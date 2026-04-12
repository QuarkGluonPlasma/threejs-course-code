import { io } from 'socket.io-client';
import {
  setLocalUsername,
  clearRemotePlayers,
  syncWorldRoster,
  syncPlayerJoined,
  syncPlayerLeft,
  syncPlayerState,
} from './remotePlayers.js';

function readLoggedInUsername() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?.username ?? null;
  } catch {
    return null;
  }
}

/** 与 open-world-server 一致：命名空间 /world，path /socket.io */
function getSocketOrigin() {
  const base = import.meta.env.VITE_WS_BASE;
  if (base) return String(base).replace(/\/$/, '');
  if (import.meta.env.DEV) {
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

let socket = null;
let emitAcc = 0;
const EMIT_INTERVAL = 1 / 12;

/** playerState 较频繁，仅节流打印摘要（与渲染并行保留） */
let lastPlayerStateLog = 0;
const PLAYER_STATE_LOG_MS = 1000;

/**
 * 连接多人房间（需已登录 JWT）。重复调用会先断开旧连接。
 * @param {string} accessToken
 */
export function connectWorld(accessToken) {
  if (!accessToken) return;
  disconnectWorld();

  const origin = getSocketOrigin();
  socket = io(`${origin}/world`, {
    path: '/socket.io',
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    const username = readLoggedInUsername();
    setLocalUsername(username);
    console.log('[world] 已连接', { id: socket.id, username });
  });

  socket.on('disconnect', (reason) => {
    clearRemotePlayers();
    console.log('[world] 已断开', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[world] 连接失败', err.message);
  });

  socket.on('worldRoster', async (data) => {
    await syncWorldRoster(data);
  });

  socket.on('playerJoined', async (data) => {
    await syncPlayerJoined(data);
  });

  socket.on('playerLeft', (data) => {
    syncPlayerLeft(data);
  });

  socket.on('playerState', async (payload) => {
    const now = Date.now();
    if (now - lastPlayerStateLog >= PLAYER_STATE_LOG_MS) {
      lastPlayerStateLog = now;
      console.log('[world] playerState (节流 1s 内汇总)', payload);
    }
    await syncPlayerState(payload);
  });
}

export function disconnectWorld() {
  emitAcc = 0;
  lastPlayerStateLog = 0;
  clearRemotePlayers();
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/**
 * 在 mesh 的物理循环里调用；仅在步行且角色已加载时上传状态。
 * @param {number} dt
 * @param {() => { position: { x: number; y: number; z: number }; rotationY: number }} getPayload
 * @param {boolean} enabled
 */
export function worldSyncTick(dt, getPayload, enabled) {
  if (!socket?.connected || !enabled) return;
  emitAcc += dt;
  if (emitAcc < EMIT_INTERVAL) return;
  emitAcc = 0;
  const p = getPayload();
  const username = readLoggedInUsername();
  socket.emit('state', {
    position: p.position,
    rotationY: p.rotationY,
    ...(username ? { username } : {}),
  });
}
