/**
 * 远端多人：按「用户名优先」的唯一键加载 Soldier 克隆，同步位置/朝向与行走动画。
 * 场景里挂一个 Group（getRemotePlayersRoot），由 mesh 每帧 updateRemotePlayers(dt)。
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

// 与本地主角胶囊一致：服务端 position 为物理中心，模型需下移半高对齐脚底
const PLAYER_HEIGHT = 1.8;
const SOLDIER_URL = `${import.meta.env.BASE_URL}Soldier.glb`;

const remoteRoot = new THREE.Group();
remoteRoot.name = 'remotePlayers';

let localUsername = null;
let templateGltf = null;
let templateLoadPromise = null;

// key → 该玩家的 root、mixer、动画；ensureInFlight 防止同一 key 并发重复克隆
const remoteByKey = new Map();
const ensureInFlight = new Map();

/** 用户名比较用：去空白、小写 */
function normUser(s) {
  return String(s).trim().toLowerCase();
}

/**
 * 只加载一次 Soldier.glb，后续全员共用模板做 SkeletonUtils.clone。
 */
function getTemplate() {
  if (templateGltf) return Promise.resolve(templateGltf);
  if (!templateLoadPromise) {
    templateLoadPromise = new Promise((resolve, reject) => {
      new GLTFLoader().load(
        SOLDIER_URL,
        (gltf) => {
          templateGltf = gltf;
          gltf.scene.scale.setScalar(0.8);
          gltf.scene.traverse((ch) => {
            if (ch.isMesh) {
              ch.castShadow = true;
              ch.receiveShadow = true;
            }
          });
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }
  return templateLoadPromise;
}

/** 挂到主场景上的远端玩家根节点 */
export function getRemotePlayersRoot() {
  return remoteRoot;
}

/**
 * 设置当前登录用户名（与 localStorage user 一致），用于不渲染「自己」的远端模型。
 */
export function setLocalUsername(username) {
  localUsername =
    username != null && String(username).trim() !== '' ? normUser(username) : null;
}

/** 断开或重连前清空所有远端实例与 GPU 资源 */
export function clearRemotePlayers() {
  for (const k of remoteByKey.keys()) {
    removeRemotePlayer(k);
  }
  remoteByKey.clear();
}

/** 动画交叉淡入淡出切换 idle / walk */
function playAction(entry, next) {
  if (!next || entry.current === next) return;
  if (entry.current) entry.current.fadeOut(0.15);
  next.reset().fadeIn(0.15).play();
  entry.current = next;
}

/** 根据本帧水平位移判断走路还是站立 */
function setWalkOrIdle(entry, moved) {
  playAction(entry, moved > 0.015 ? entry.walkAction : entry.idleAction);
}

/** 移除指定 key 的远端玩家并 dispose 几何体/材质 */
function removeRemotePlayer(key) {
  const k = key != null ? String(key) : '';
  const entry = remoteByKey.get(k);
  if (!entry) return;
  entry.mixer.stopAllAction();
  remoteRoot.remove(entry.root);
  entry.root.traverse((ch) => {
    if (ch.isMesh) {
      ch.geometry?.dispose?.();
      const m = ch.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
      else m?.dispose?.();
    }
  });
  remoteByKey.delete(k);
}

/** 世界坐标 + 绕 Y 旋转；Y 用物理中心减半高，与本地主角一致 */
function applyPose(entry, pos, rotY) {
  entry.root.position.set(pos.x, pos.y - PLAYER_HEIGHT / 2, pos.z);
  entry.root.rotation.y = rotY;
}

/** 是否为本地玩家（key 已与 normUser 对齐） */
function isLocal(key) {
  return localUsername && key && String(key) === localUsername;
}

/**
 * 生成远端玩家唯一键：优先 username/name，否则 socketId/id/userId，最后用对象外层的键 _fb。
 */
function playerKey(rec, socketFallback) {
  const name = rec.username ?? rec.name;
  if (name != null && String(name).trim() !== '') return normUser(name);
  const id = rec.socketId ?? rec.id ?? rec.userId ?? socketFallback;
  return id != null ? String(id) : undefined;
}

/** 从一条同步记录里解析 position（支持 {x,y,z}、数组、顶层 x/z） */
function readPosition(rec) {
  const p = rec.position;
  if (p != null && typeof p === 'object') {
    if (Array.isArray(p) && p.length >= 3) {
      return { x: +p[0], y: +(p[1] ?? 0), z: +p[2] };
    }
    if (p.x !== undefined || p.z !== undefined) {
      return { x: +p.x, y: +(p.y ?? 0), z: +p.z };
    }
  }
  if (rec.x !== undefined || rec.z !== undefined) {
    return { x: +rec.x, y: +(rec.y ?? 0), z: +rec.z };
  }
  return null;
}

/**
 * 扁平记录 → { key, position, rotationY }；去掉内部用的 _fb（来自 players/states 的键名）。
 */
function parseRecord(rec) {
  const r = { ...rec };
  const fb = r._fb;
  delete r._fb;
  const key = playerKey(r, typeof fb === 'string' ? fb : undefined);
  if (!key) return null;
  return {
    key,
    position: readPosition(r),
    rotationY: r.rotationY !== undefined ? +r.rotationY : 0,
  };
}

/** 若服务端包一层 { data: ... }，剥到内层再解析 */
function unwrap(p) {
  return p && typeof p === 'object' && p.data != null && typeof p.data === 'object'
    ? p.data
    : p;
}

/** 对象映射 { socketId: state } → 多条记录，并把键塞进 _fb 供 playerKey 兜底 */
function keyedToList(obj) {
  return Object.entries(obj).map(([k, v]) =>
    v && typeof v === 'object' ? { ...v, _fb: k } : { _fb: k }
  );
}

/**
 * 把任意服务端 payload 转成「玩家记录数组」：数组 / players / states / 单条带坐标。
 */
function toRecordList(payload) {
  const p = unwrap(payload);
  if (p == null) return [];
  if (Array.isArray(p)) {
    // 字符串数组视为 username 列表（无坐标，仅预创建）
    return typeof p[0] === 'string' ? p.map((u) => ({ username: String(u) })) : p;
  }
  if (typeof p !== 'object') return [];
  if (Array.isArray(p.players)) return p.players;
  if (p.players && typeof p.players === 'object' && !Array.isArray(p.players)) {
    return keyedToList(p.players);
  }
  if (p.states && typeof p.states === 'object' && !Array.isArray(p.states)) {
    return keyedToList(p.states);
  }
  if (
    (p.username != null || p.socketId != null) &&
    (p.position != null || p.x !== undefined)
  ) {
    return [p];
  }
  return [];
}

/**
 * 首次出现时克隆 Soldier、建 mixer，播放 idle；同一 key 并发只建一次。
 */
export async function ensureRemotePlayer(key) {
  const k = key != null ? String(key) : '';
  if (!k || isLocal(k)) return;
  if (remoteByKey.has(k)) return;
  const pending = ensureInFlight.get(k);
  if (pending) return pending;

  const promise = (async () => {
    const gltf = await getTemplate();
    if (remoteByKey.has(k)) return;

    const root = SkeletonUtils.clone(gltf.scene);
    root.traverse((ch) => {
      if (ch.isMesh) {
        ch.castShadow = true;
        ch.receiveShadow = true;
      }
    });

    const mixer = new THREE.AnimationMixer(root);
    const idle = mixer.clipAction(gltf.animations[0]);
    const walk = mixer.clipAction(gltf.animations[3]);
    idle.play();

    remoteByKey.set(k, {
      root,
      mixer,
      idleAction: idle,
      walkAction: walk,
      current: idle,
      lastPos: new THREE.Vector3(),
    });
    remoteRoot.add(root);
  })().finally(() => ensureInFlight.delete(k));

  ensureInFlight.set(k, promise);
  return promise;
}

/**
 * 用网络状态更新位置与朝向；根据与上一帧水平位移切换走路/站立动画。
 */
export async function updateRemotePlayerFromState(key, position, rotationY) {
  const k = key != null ? String(key) : '';
  if (!k || isLocal(k) || !position) return;

  await ensureRemotePlayer(k);
  const entry = remoteByKey.get(k);
  if (!entry) return;

  const pos = { x: position.x, y: position.y ?? 0, z: position.z };
  const moved = Math.hypot(pos.x - entry.lastPos.x, pos.z - entry.lastPos.z);
  entry.lastPos.set(pos.x, pos.y, pos.z);
  applyPose(entry, pos, rotationY ?? 0);
  setWalkOrIdle(entry, moved);
}

/**
 * 统一处理 roster / joined / playerState：先 toRecordList，再 parseRecord，过滤本人。
 * needPosition=true 时（playerState）必须有合法坐标才更新；否则可只 ensure 模型。
 */
async function applyIncoming(payload, needPosition) {
  for (const raw of toRecordList(payload)) {
    const n = parseRecord(raw);
    if (!n || !n.key || isLocal(n.key)) continue;

    if (needPosition) {
      if (
        !n.position ||
        !Number.isFinite(n.position.x) ||
        !Number.isFinite(n.position.z)
      ) {
        continue;
      }
      await updateRemotePlayerFromState(n.key, n.position, n.rotationY);
    } else if (
      n.position &&
      Number.isFinite(n.position.x) &&
      Number.isFinite(n.position.z)
    ) {
      await updateRemotePlayerFromState(n.key, n.position, n.rotationY);
    } else {
      await ensureRemotePlayer(n.key);
    }
  }
}

/** 房间当前成员列表（可无坐标，先占位模型） */
export function syncWorldRoster(payload) {
  return applyIncoming(payload, false);
}

/** 有人加入：同上 */
export function syncPlayerJoined(data) {
  return applyIncoming(data, false);
}

/** 高频位置同步：无有效坐标则跳过 */
export function syncPlayerState(payload) {
  return applyIncoming(payload, true);
}

/** 有人离开：按 username / id / _fb 解析 key 后移除 */
export function syncPlayerLeft(data) {
  const o = unwrap(data) || {};
  const r = { ...o };
  const fb = r._fb;
  delete r._fb;
  const key = playerKey(r, typeof fb === 'string' ? fb : undefined);
  if (key) removeRemotePlayer(key);
}

/** 每帧推进所有远端 AnimationMixer */
export function updateRemotePlayers(dt) {
  for (const e of remoteByKey.values()) {
    e.mixer.update(dt);
  }
}
