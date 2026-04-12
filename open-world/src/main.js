import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { loadCompletePromise } from './loading.js';
import mesh, { characterModel, playerBody, playerHeight, walkSound, setSoundEffectEnabled } from './mesh.js';
import car, { carModel, carBody, stopCarSound, setCarState } from './car.js';
import plane, { planeModel, planeBody, stopPlaneSound, setPlaneState } from './plane.js';
import house, { doorMesh, doorBody, setDoorState } from './house.js';
import person, { personModel, personBody } from './person.js';
import dancingMirrorHut, { updateDancingMirrorHut, dancingMirrorHutPosition } from './dancingMirrorHut.js';
import birds, { updateBirds } from './birds.js';
import { isNearComputer, enterComputerView, exitComputerView } from './computer.js';
import { mapSystem, updateMapMarkers, toggleFullMap } from './map.js';
import { initWeatherSystem, updateWeather, setWeather, WeatherType, getWeatherSystem } from './weather.js';
import { saveGame, loadGame, hasSave, getSaveTimestamp } from './save.js';
import { setPlayerState, startPlayerDance, stopPlayerDance, isDancing } from './mesh.js';
import { registerUser } from './api/register.js';
import { loginUser } from './api/login.js';
import { connectWorld } from './worldSync.js';
import { getRemotePlayersRoot } from './remotePlayers.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

scene.add(mesh);
scene.add(getRemotePlayersRoot());
scene.add(car);
scene.add(plane);
scene.add(house);
scene.add(person);
scene.add(dancingMirrorHut);
scene.add(birds);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(20, 30, 10);
sun.castShadow = true;
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
scene.add(sun);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 200);
camera.position.set(0, 1.6, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)
renderer.shadowMap.enabled = true;

// 初始化天气系统
initWeatherSystem(scene, camera, renderer);

// 背景音乐
const backgroundMusic = new Audio(`${import.meta.env.BASE_URL}秋日私语.mp3`);
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3; // 背景音乐音量设置为30%

// 在用户第一次交互时播放背景音乐（浏览器自动播放限制）
let musicStarted = false;
function startBackgroundMusic() {
  if (!musicStarted) {
    backgroundMusic.play().catch(err => {
      console.log('播放背景音乐失败:', err);
    });
    musicStarted = true;
  }
}

// 监听用户交互事件来启动背景音乐
document.addEventListener('click', startBackgroundMusic, { once: true });
document.addEventListener('keydown', startBackgroundMusic, { once: true });

// 设置面板控制
export let isSettingsOpen = false;
export let isManualOpen = false;
export let isRegisterOpen = false;
export let isLoginOpen = false;

function dismissRegisterPanel() {
  if (!isRegisterOpen) return;
  isRegisterOpen = false;
  const registerPanel = document.getElementById('registerPanel');
  if (registerPanel) registerPanel.hidden = true;
  const registerMsg = document.getElementById('registerMessage');
  if (registerMsg) {
    registerMsg.hidden = true;
    registerMsg.textContent = '';
    registerMsg.className = 'register-message';
  }
}

function dismissLoginPanel() {
  if (!isLoginOpen) return;
  isLoginOpen = false;
  const loginPanel = document.getElementById('loginPanel');
  if (loginPanel) loginPanel.hidden = true;
  const loginMsg = document.getElementById('loginMessage');
  if (loginMsg) {
    loginMsg.hidden = true;
    loginMsg.textContent = '';
    loginMsg.className = 'register-message';
  }
}
let soundEffectEnabled = true;
let backgroundMusicEnabled = true;
let miniMapEnabled = true;

function getSettings() {
  return { soundEffectEnabled, backgroundMusicEnabled, miniMapEnabled };
}
function setSettingsFromSave(s) {
  if (!s) return;
  soundEffectEnabled = s.soundEffectEnabled !== false;
  backgroundMusicEnabled = s.backgroundMusicEnabled !== false;
  miniMapEnabled = s.miniMapEnabled !== false;
  setSoundEffectEnabled(soundEffectEnabled);
  const bgMusicEl = document.getElementById('bgMusicToggle');
  const soundEl = document.getElementById('soundEffectToggle');
  const miniMapEl = document.getElementById('miniMapToggle');
  const miniMapEl2 = document.getElementById('miniMap');
  if (bgMusicEl) bgMusicEl.checked = backgroundMusicEnabled;
  if (soundEl) soundEl.checked = soundEffectEnabled;
  if (miniMapEl) miniMapEl.checked = miniMapEnabled;
  if (miniMapEl2) miniMapEl2.style.display = miniMapEnabled ? 'flex' : 'none';
  if (!backgroundMusicEnabled && musicStarted) backgroundMusic.pause();
  else if (backgroundMusicEnabled && musicStarted) backgroundMusic.play().catch(() => {});
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settingsPanel');
  if (!settingsPanel) return;

  dismissRegisterPanel();
  dismissLoginPanel();

  isSettingsOpen = !isSettingsOpen;
  settingsPanel.style.display = isSettingsOpen ? 'flex' : 'none';
  
  // 打开设置时更新存档状态提示
  if (isSettingsOpen) {
    const statusEl = document.getElementById('saveStatus');
    if (statusEl && !statusEl.textContent) {
      const ts = getSaveTimestamp();
      statusEl.textContent = ts ? `上次存档: ${new Date(ts).toLocaleString('zh-CN')}` : '暂无存档';
    }
  }
  
  // 当打开设置面板时，退出指针锁定模式
  if (isSettingsOpen && document.pointerLockElement) {
    document.exitPointerLock();
  }

  // 更新当前天气按钮状态
  if (isSettingsOpen) {
    updateWeatherButtonStates();
  }
}

function toggleManual() {
  const manualPanel = document.getElementById('manualPanel');
  if (!manualPanel) return;

  dismissRegisterPanel();
  dismissLoginPanel();

  isManualOpen = !isManualOpen;
  manualPanel.style.display = isManualOpen ? 'flex' : 'none';
  if (isManualOpen && document.pointerLockElement) {
    document.exitPointerLock();
  }
}

function toggleRegister() {
  const registerPanel = document.getElementById('registerPanel');
  if (!registerPanel) return;

  const willOpen = !isRegisterOpen;
  if (willOpen) {
    dismissLoginPanel();
    if (isSettingsOpen) {
      isSettingsOpen = false;
      const settingsPanel = document.getElementById('settingsPanel');
      if (settingsPanel) settingsPanel.style.display = 'none';
    }
    if (isManualOpen) {
      isManualOpen = false;
      const manualPanel = document.getElementById('manualPanel');
      if (manualPanel) manualPanel.style.display = 'none';
    }
  }

  isRegisterOpen = !isRegisterOpen;
  registerPanel.hidden = !isRegisterOpen;

  if (isRegisterOpen && document.pointerLockElement) {
    document.exitPointerLock();
  }

  const registerMsg = document.getElementById('registerMessage');
  if (!isRegisterOpen && registerMsg) {
    registerMsg.hidden = true;
    registerMsg.textContent = '';
    registerMsg.className = 'register-message';
  }
}

function toggleLogin() {
  const loginPanel = document.getElementById('loginPanel');
  if (!loginPanel) return;

  const willOpen = !isLoginOpen;
  if (willOpen) {
    dismissRegisterPanel();
    if (isSettingsOpen) {
      isSettingsOpen = false;
      const settingsPanel = document.getElementById('settingsPanel');
      if (settingsPanel) settingsPanel.style.display = 'none';
    }
    if (isManualOpen) {
      isManualOpen = false;
      const manualPanel = document.getElementById('manualPanel');
      if (manualPanel) manualPanel.style.display = 'none';
    }
  }

  isLoginOpen = !isLoginOpen;
  loginPanel.hidden = !isLoginOpen;

  if (isLoginOpen && document.pointerLockElement) {
    document.exitPointerLock();
  }

  const loginMsg = document.getElementById('loginMessage');
  if (!isLoginOpen && loginMsg) {
    loginMsg.hidden = true;
    loginMsg.textContent = '';
    loginMsg.className = 'register-message';
  }
}

function updateWeatherButtonStates() {
  const weatherButtons = document.querySelectorAll('.weather-btn');
  const weatherSystem = getWeatherSystem();
  const currentWeather = weatherSystem ? weatherSystem.getCurrentWeather() : WeatherType.CLEAR;
  
  weatherButtons.forEach(btn => {
    const weather = btn.getAttribute('data-weather');
    let weatherType;
    
    switch(weather) {
      case 'clear':
        weatherType = WeatherType.CLEAR;
        break;
      case 'rain':
        weatherType = WeatherType.RAIN;
        break;
      case 'snow':
        weatherType = WeatherType.SNOW;
        break;
      case 'fog':
        weatherType = WeatherType.FOG;
        break;
      default:
        weatherType = WeatherType.CLEAR;
    }
    
    btn.classList.toggle('active', weatherType === currentWeather);
  });
}

// 强制退出载具/电脑，回到玩家步行状态（读档时使用）
function forceExitToPlayer() {
  if (isComputerView) {
    isComputerView = false;
    exitComputerView(camera, characterModel, css3Renderer);
  }
  if (isCarView) {
    isCarView = false;
    stopCarSound();
    if (carModel && characterModel && carBody && playerBody) {
      carModel.remove(camera);
      characterModel.visible = true;
      const carPosition = carBody.position;
      const forward = new THREE.Vector3();
      carModel.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const left = new THREE.Vector3(forward.z, 0, -forward.x);
      const leftOffset = 2;
      playerBody.position.set(
        carPosition.x + left.x * leftOffset,
        playerHeight / 2,
        carPosition.z + left.z * leftOffset
      );
      playerBody.velocity.set(0, 0, 0);
      characterModel.position.copy(playerBody.position);
      characterModel.position.y -= playerHeight / 2;
      characterModel.rotation.y = carModel.rotation.y;
      characterModel.add(camera);
      camera.position.set(0, 1.5, 2.5);
      camera.rotation.set(0, 0, 0);
      camera.up.set(0, 1, 0);
    }
  }
  if (isPlaneView) {
    isPlaneView = false;
    stopPlaneSound();
    if (planeModel && characterModel && planeBody && playerBody) {
      planeModel.remove(camera);
      characterModel.visible = true;
      const planePosition = planeBody.position;
      const forward = new THREE.Vector3();
      planeModel.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const left = new THREE.Vector3(forward.z, 0, -forward.x);
      const leftOffset = 2;
      playerBody.position.set(
        planePosition.x + left.x * leftOffset,
        playerHeight / 2,
        planePosition.z + left.z * leftOffset
      );
      playerBody.velocity.set(0, 0, 0);
      characterModel.position.copy(playerBody.position);
      characterModel.position.y -= playerHeight / 2;
      characterModel.rotation.y = planeModel.rotation.y;
      characterModel.add(camera);
      camera.position.set(0, 1.5, 2.5);
      camera.rotation.set(0, 0, 0);
      camera.up.set(0, 1, 0);
    }
  }
  isTalking = false;
  dialogueIndex = 0;
}

// 存档
function doSave() {
  if (isCarView || isPlaneView || isComputerView) {
    showSaveStatus('请先下车/下飞机/退出电脑后再存档', 'warning');
    return;
  }
  if (!confirm('确定要存档吗？')) return;
  const getters = {
    playerBody,
    carBody,
    planeBody,
    doorBody,
    characterModel,
    weather: () => getWeatherSystem()?.getCurrentWeather(),
    settings: getSettings
  };
  const result = saveGame(getters);
  if (result.success) {
    const time = new Date(result.timestamp).toLocaleString('zh-CN');
    showSaveStatus(`存档成功 (${time})`, 'success');
  } else {
    showSaveStatus('存档失败', 'error');
  }
}

// 读档
function doLoad() {
  if (!hasSave()) {
    showSaveStatus('暂无存档', 'error');
    return;
  }
  if (!confirm('确定要读档吗？当前进度将被覆盖。')) return;
  forceExitToPlayer();
  const setters = {
    setPlayerState,
    setCarState,
    setPlaneState,
    setDoorState,
    setWeather,
    setSettings: setSettingsFromSave
  };
  const result = loadGame(setters);
  if (result.success) {
    if (isSettingsOpen) updateWeatherButtonStates();
    const time = result.timestamp ? new Date(result.timestamp).toLocaleString('zh-CN') : '';
    showSaveStatus(`读档成功 (存档于 ${time})`, 'success');
  } else {
    showSaveStatus(result.reason || '读档失败', 'error');
  }
}

function showSaveStatus(msg, type = 'info') {
  // 设置面板内的状态
  const statusEl = document.getElementById('saveStatus');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.className = 'save-status save-status-' + (type || 'info');
    if (msg) setTimeout(() => { statusEl.textContent = ''; }, 3000);
  }
  // 屏幕中央 Toast 提示（始终可见）
  const toast = document.getElementById('saveLoadToast');
  if (toast && msg) {
    toast.textContent = msg;
    toast.className = 'save-load-toast show ' + (type || 'info');
    clearTimeout(showSaveStatus._toastTimer);
    showSaveStatus._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

// 初始化设置面板
document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const bgMusicToggle = document.getElementById('bgMusicToggle');
  const soundEffectToggle = document.getElementById('soundEffectToggle');
  const miniMapToggle = document.getElementById('miniMapToggle');
  const weatherButtons = document.querySelectorAll('.weather-btn');
  const settingsPanel = document.getElementById('settingsPanel');
  const miniMap = document.getElementById('miniMap');
  
  // 阻止设置面板内的点击事件冒泡，防止触发指针锁定
  if (settingsPanel) {
    settingsPanel.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    settingsPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettings();
    });
  }
  
  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettings();
    });
  }
  
  // 背景音乐开关
  if (bgMusicToggle) {
    bgMusicToggle.addEventListener('change', (e) => {
      backgroundMusicEnabled = e.target.checked;
      if (backgroundMusicEnabled && musicStarted) {
        backgroundMusic.play().catch(err => {
          console.log('播放背景音乐失败:', err);
        });
      } else {
        backgroundMusic.pause();
      }
    });
  }
  
  // 音效开关
  if (soundEffectToggle) {
    soundEffectToggle.addEventListener('change', (e) => {
      soundEffectEnabled = e.target.checked;
      setSoundEffectEnabled(soundEffectEnabled);
      // 如果关闭音效，立即停止所有音效
      if (!soundEffectEnabled) {
        stopCarSound();
        stopPlaneSound();
      }
    });
  }
  
  // 小地图开关
  if (miniMapToggle && miniMap) {
    // 初始化小地图显示状态
    miniMap.style.display = miniMapEnabled ? 'flex' : 'none';
    
    miniMapToggle.addEventListener('change', (e) => {
      miniMapEnabled = e.target.checked;
      miniMap.style.display = miniMapEnabled ? 'flex' : 'none';
    });
  }
  
  // 存档/读档按钮
  const saveBtn = document.getElementById('saveGameBtn');
  const loadBtn = document.getElementById('loadGameBtn');
  if (saveBtn) saveBtn.addEventListener('click', () => { doSave(); });
  if (loadBtn) loadBtn.addEventListener('click', () => { doLoad(); });

  // 使用手册
  const manualBtn = document.getElementById('manualBtn');
  const closeManualBtn = document.getElementById('closeManualBtn');
  const manualPanel = document.getElementById('manualPanel');
  if (manualBtn) manualBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleManual(); });
  if (closeManualBtn) closeManualBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleManual(); });
  if (manualPanel) {
    manualPanel.addEventListener('mousedown', (e) => e.stopPropagation());
    manualPanel.addEventListener('click', (e) => e.stopPropagation());
  }

  const registerPanel = document.getElementById('registerPanel');
  const registerBtn = document.getElementById('registerBtn');
  const closeRegisterBtn = document.getElementById('closeRegisterBtn');
  const registerForm = document.getElementById('registerForm');
  if (registerPanel) {
    registerPanel.addEventListener('mousedown', (e) => e.stopPropagation());
    registerPanel.addEventListener('click', (e) => e.stopPropagation());
  }
  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleRegister();
    });
  }
  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleRegister();
    });
  }
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameEl = document.getElementById('registerUsername');
      const passwordEl = document.getElementById('registerPassword');
      const msgEl = document.getElementById('registerMessage');
      const submitBtn = document.getElementById('registerSubmitBtn');
      const username = usernameEl ? usernameEl.value.trim() : '';
      const password = passwordEl ? passwordEl.value : '';
      if (!username || !password) {
        if (msgEl) {
          msgEl.hidden = false;
          msgEl.textContent = '请填写用户名和密码';
          msgEl.className = 'register-message register-error';
        }
        return;
      }
      if (msgEl) {
        msgEl.hidden = true;
        msgEl.textContent = '';
        msgEl.className = 'register-message';
      }
      if (submitBtn) submitBtn.disabled = true;
      try {
        const data = await registerUser(username, password);
        if (msgEl) {
          msgEl.hidden = false;
          const t = data.createdAt
            ? new Date(data.createdAt).toLocaleString('zh-CN')
            : '';
          msgEl.textContent = t
            ? `注册成功：${data.username}（id: ${data.id}）· ${t}`
            : `注册成功：${data.username}（id: ${data.id}）`;
          msgEl.className = 'register-message register-success';
        }
      } catch (err) {
        if (msgEl) {
          msgEl.hidden = false;
          msgEl.textContent = err instanceof Error ? err.message : '注册失败';
          msgEl.className = 'register-message register-error';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const loginPanel = document.getElementById('loginPanel');
  const loginBtn = document.getElementById('loginBtn');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const loginForm = document.getElementById('loginForm');
  if (loginPanel) {
    loginPanel.addEventListener('mousedown', (e) => e.stopPropagation());
    loginPanel.addEventListener('click', (e) => e.stopPropagation());
  }
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLogin();
    });
  }
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLogin();
    });
  }
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameEl = document.getElementById('loginUsername');
      const passwordEl = document.getElementById('loginPassword');
      const msgEl = document.getElementById('loginMessage');
      const submitBtn = document.getElementById('loginSubmitBtn');
      const username = usernameEl ? usernameEl.value.trim() : '';
      const password = passwordEl ? passwordEl.value : '';
      if (!username || !password) {
        if (msgEl) {
          msgEl.hidden = false;
          msgEl.textContent = '请填写用户名和密码';
          msgEl.className = 'register-message register-error';
        }
        return;
      }
      if (msgEl) {
        msgEl.hidden = true;
        msgEl.textContent = '';
        msgEl.className = 'register-message';
      }
      if (submitBtn) submitBtn.disabled = true;
      try {
        const data = await loginUser(username, password);
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data.accessToken) {
          connectWorld(data.accessToken);
        }
        if (msgEl) {
          msgEl.hidden = false;
          const u = data.user;
          msgEl.textContent = u
            ? `登录成功：${u.username}（id: ${u.id}）`
            : '登录成功';
          msgEl.className = 'register-message register-success';
        }
      } catch (err) {
        if (msgEl) {
          msgEl.hidden = false;
          msgEl.textContent = err instanceof Error ? err.message : '登录失败';
          msgEl.className = 'register-message register-error';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // 天气切换按钮
  weatherButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const weather = btn.getAttribute('data-weather');
      let weatherType;
      
      switch(weather) {
        case 'clear':
          weatherType = WeatherType.CLEAR;
          break;
        case 'rain':
          weatherType = WeatherType.RAIN;
          break;
        case 'snow':
          weatherType = WeatherType.SNOW;
          break;
        case 'fog':
          weatherType = WeatherType.FOG;
          break;
        default:
          weatherType = WeatherType.CLEAR;
      }
      
      setWeather(weatherType);
      
      // 更新按钮状态
      updateWeatherButtonStates();
    });
  });
});

const css3Renderer = new CSS3DRenderer();
css3Renderer.setSize(width, height);
css3Renderer.domElement.style.position = 'absolute';
css3Renderer.domElement.style.top = '0px';
css3Renderer.domElement.style.left = '0px';
css3Renderer.domElement.style.pointerEvents = 'none';

const css2Renderer = new CSS2DRenderer();
  css2Renderer.setSize(width, height);
  css2Renderer.domElement.style.position = 'absolute';
  css2Renderer.domElement.style.top = '0px';
  css2Renderer.domElement.style.left = '0px';
  css2Renderer.domElement.style.pointerEvents = 'none';
  css2Renderer.domElement.style.zIndex = '1';

document.body.append(renderer.domElement);
document.body.append(css3Renderer.domElement);
document.body.append(css2Renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

// 车辆视角切换
export let isCarView = false;

// 飞机视角切换
export let isPlaneView = false;

// 电脑视角切换
export let isComputerView = false;

// 对话状态
export let isTalking = false;
export let isTalkingToDancer = false;

// 对话系统
const dialogueData = [
    { player: "你好！", npc: "哦，你好！看起来你是个战士？" },
    { player: "是的，我在执行任务。你坐在这里做什么？", npc: "哈哈，我在思考人生。这个桶很舒服，你要不要也坐坐？" },
    { player: "不了，我还有任务要完成。", npc: "任务？听起来很严肃。不过你知道吗，有时候停下来看看风景也不错。" },
    { player: "也许你说得对...但我得走了。", npc: "好吧，祝你好运！如果累了，随时可以回来找我聊天。" },
    { player: "谢谢！再见！", npc: "再见，战士！" }
];

let dialogueIndex = 0;

const dancerDialogueData = [
    { player: "你好！", npc: "嗨～你也来看镜子呀？" },
    { player: "嗯，你跳得真好。", npc: "谢谢！我天天在这儿练，你要不要也试试？" },
    { player: "我也可以跳吗？", npc: "当然呀，我教你！很简单的。" },
    { player: "好啊，教教我。", npc: "那你准备好哦，按 J 开始跳舞～" }
];

let dancerDialogueIndex = 0;

// 检查是否靠近镜屋女孩
function isNearDancer() {
    if (!characterModel || !dancingMirrorHutPosition) return false;
    const p = characterModel.position;
    const dx = p.x - dancingMirrorHutPosition.x;
    const dz = p.z - dancingMirrorHutPosition.z;
    return Math.sqrt(dx * dx + dz * dz) < 3;
}

// 检查人物是否在车辆附近
function isNearCar() {
    if (!characterModel || !carBody) return false;

    const characterPos = characterModel.position;
    const carPos = carBody.position;

    const distance = Math.sqrt(
        Math.pow(characterPos.x - carPos.x, 2) +
        Math.pow(characterPos.z - carPos.z, 2)
    );

    return distance < 3; // 3米范围内
}

// 检查人物是否在飞机附近
function isNearPlane() {
    if (!characterModel || !planeBody) return false;

    const characterPos = characterModel.position;
    const planePos = planeBody.position;

    const distance = Math.sqrt(
        Math.pow(characterPos.x - planePos.x, 2) +
        Math.pow(characterPos.z - planePos.z, 2)
    );

    return distance < 3; // 3米范围内
}

// 检查玩家是否靠近NPC人物
function isNearPerson() {
    if (!characterModel || !personBody) return false;

    const characterPos = characterModel.position;
    const personPos = personBody.position;

    const distance = Math.sqrt(
        Math.pow(characterPos.x - personPos.x, 2) +
        Math.pow(characterPos.z - personPos.z, 2)
    );

    return distance < 3; // 3米范围内
}

// 更新提示文本（仅显示当前情境下的操作提示）
function updateViewTip() {
    const tipElement = document.getElementById('viewTip');
    if (!tipElement) return;

    if (isComputerView) {
        tipElement.textContent = '按 E 退出';
    } else if (isCarView) {
        tipElement.textContent = '按 X 下车';
    } else if (isPlaneView) {
        if (planeBody && planeBody.position.y > 2.15) {
            tipElement.textContent = '空格上升 Shift下降 · 先降落再按 C 下飞机';
        } else {
            tipElement.textContent = '空格上升 Shift下降 · 按 C 下飞机';
        }
    } else if (isNearCar()) {
        tipElement.textContent = '按 X 上车';
    } else if (isNearPlane()) {
        tipElement.textContent = '按 C 上飞机';
    } else if (isNearPerson()) {
        if (isTalking) {
            tipElement.textContent = dialogueIndex < dialogueData.length ? '按 H 继续 按 K 结束' : '按 H 重新开始 按 K 结束';
        } else {
            tipElement.textContent = '按 H 对话';
        }
    } else if (isDancing) {
        tipElement.textContent = '按 L 结束跳舞';
    } else if (isNearDancer()) {
        if (isTalkingToDancer) {
            if (dancerDialogueIndex < dancerDialogueData.length) {
                tipElement.textContent = '按 H 继续 按 K 结束';
            } else {
                tipElement.textContent = '按 J 开始跳舞 | 按 K 结束对话';
            }
        } else {
            tipElement.textContent = '按 H 对话';
        }
    } else if (isNearComputer(characterModel)) {
        tipElement.textContent = '按 E 使用电脑';
    } else {
        tipElement.textContent = '';
    }
    tipElement.style.display = tipElement.textContent ? 'block' : 'none';
}

// 控制对话框显示和内容
function updateDialogs() {
    const personDialog = document.getElementById('personDialog');
    const playerDialog = document.getElementById('playerDialog');
    
    const inPersonTalk = isTalking && isNearPerson() && !isCarView && !isPlaneView && !isComputerView;
    const inDancerTalk = isTalkingToDancer && isNearDancer() && !isCarView && !isPlaneView && !isComputerView;

    if (inPersonTalk) {
        if (personDialog && playerDialog) {
            if (dialogueIndex < dialogueData.length) {
                personDialog.textContent = dialogueData[dialogueIndex].npc;
                playerDialog.textContent = dialogueData[dialogueIndex].player;
                personDialog.style.display = 'block';
                playerDialog.style.display = 'block';
            } else {
                personDialog.style.display = 'none';
                playerDialog.style.display = 'none';
            }
        }
    } else if (inDancerTalk) {
        const dancerDialog = document.getElementById('dancerDialog');
        if (dancerDialog && playerDialog) {
            if (dancerDialogueIndex < dancerDialogueData.length) {
                dancerDialog.textContent = dancerDialogueData[dancerDialogueIndex].npc;
                playerDialog.textContent = dancerDialogueData[dancerDialogueIndex].player;
                dancerDialog.style.display = 'block';
                playerDialog.style.display = 'block';
            } else {
                dancerDialog.style.display = 'none';
                playerDialog.style.display = 'none';
            }
        }
    } else {
        if (personDialog) personDialog.style.display = 'none';
        const dancerDialog = document.getElementById('dancerDialog');
        if (dancerDialog) dancerDialog.style.display = 'none';
        if (playerDialog) playerDialog.style.display = 'none';
        if (!isNearPerson()) {
            isTalking = false;
            dialogueIndex = 0;
        }
        if (!isNearDancer()) {
            isTalkingToDancer = false;
            dancerDialogueIndex = 0;
        }
    }
}

// 渲染循环
function render() {
    renderer.render(scene, camera);
    css3Renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
    updateViewTip();
    updateDialogs();
    
    // 同步门的视觉和物理状态（保留物理效果）
    if (doorMesh && doorBody) {
        doorMesh.position.copy(doorBody.position);
        doorMesh.quaternion.copy(doorBody.quaternion);
    }
    
    // 更新地图标记和绘制
    updateMapMarkers(characterModel, carModel, planeModel, personModel, camera, isCarView, isPlaneView);
    updateDancingMirrorHut();
    updateBirds();
    mapSystem.update();
    
    // 更新天气系统
    updateWeather();
    
    requestAnimationFrame(render);
}

// 全部加载完成后再显示游戏并开始渲染
loadCompletePromise.then(() => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
    render();
    const token = localStorage.getItem('accessToken');
    if (token) {
      connectWorld(token);
    }
});

// 窗口大小调整处理
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  css3Renderer.setSize(width, height);
  css2Renderer.setSize(width, height);
});

// 监听键盘事件
window.addEventListener('keydown', (event) => {
    if (event.key === 'x' || event.key === 'X') {
        if (isCarView) {
            // 在车辆视角时，可以随时下车
            isCarView = false;
            stopCarSound(); // 停止开车音效
            if (carModel && characterModel && carBody && playerBody) {
                carModel.remove(camera);

                // 显示人物模型
                characterModel.visible = true;

                // 将人物放置在车辆左边
                const carPosition = carBody.position;

                // 获取车辆的前进方向
                const forward = new THREE.Vector3();
                carModel.getWorldDirection(forward);
                forward.y = 0;
                forward.normalize();

                // 计算车辆左侧方向（前进方向顺时针旋转90度）
                const left = new THREE.Vector3(forward.z, 0, -forward.x);

                // 计算车辆左侧的位置（距离车辆2米）
                const leftOffset = 2;
                const leftX = carPosition.x + left.x * leftOffset;
                const leftZ = carPosition.z + left.z * leftOffset;

                // 更新人物物理体和模型位置
                playerBody.position.set(leftX, playerHeight / 2, leftZ);
                playerBody.velocity.set(0, 0, 0);
                characterModel.position.copy(playerBody.position);
                characterModel.position.y -= playerHeight / 2;

                // 设置人物朝向与车辆一致
                characterModel.rotation.y = carModel.rotation.y;

                characterModel.add(camera);
                // 恢复为人物行走时的相机设置
                camera.position.set(0, 1.5, 2.5);
                camera.rotation.set(0, 0, 0);
                camera.up.set(0, 1, 0);
            }
        } else if (isNearCar()) {
            // 只有在车辆附近才能上车
            isCarView = true;
            if (carModel && characterModel) {
                characterModel.remove(camera);

                // 隐藏人物模型
                characterModel.visible = false;

                carModel.add(camera);
                // 相机在车后面，看向车辆前进方向
                camera.position.set(0, 3, -6);
                camera.rotation.set(-0.1, Math.PI, 0); // 稍微向下看约6度，主要朝向前方
            }
        }
    } else if (event.key === 'c' || event.key === 'C') {
        if (isPlaneView) {
            // 在飞机视角时，需要先降落再下飞机
            if (planeModel && characterModel && planeBody && playerBody) {
                const planeHeight = planeBody.position.y;
                const groundHeight = 1.15; // 飞机在地面时的高度

                // 如果飞机在空中（高于地面1米以上），提示需要先降落
                if (planeHeight > groundHeight + 1) {
                    return;
                }

                // 飞机在地面或接近地面时，可以下飞机
                isPlaneView = false;
                stopPlaneSound(); // 停止开飞机音效
                planeModel.remove(camera);

                // 显示人物模型
                characterModel.visible = true;

                // 将人物放置在飞机左边
                const planePosition = planeBody.position;

                // 获取飞机的前进方向
                const forward = new THREE.Vector3();
                planeModel.getWorldDirection(forward);
                forward.y = 0;
                forward.normalize();

                // 计算飞机左侧方向（前进方向顺时针旋转90度）
                const left = new THREE.Vector3(forward.z, 0, -forward.x);

                // 计算飞机左侧的位置（距离飞机2米）
                const leftOffset = 2;
                const leftX = planePosition.x + left.x * leftOffset;
                const leftZ = planePosition.z + left.z * leftOffset;

                // 更新人物物理体和模型位置
                playerBody.position.set(leftX, playerHeight / 2, leftZ);
                playerBody.velocity.set(0, 0, 0);
                characterModel.position.copy(playerBody.position);
                characterModel.position.y -= playerHeight / 2;

                // 设置人物朝向与飞机一致
                characterModel.rotation.y = planeModel.rotation.y;

                characterModel.add(camera);
                // 恢复为人物行走时的相机设置
                camera.position.set(0, 1.5, 2.5);
                camera.rotation.set(0, 0, 0);
                camera.up.set(0, 1, 0);
            }
        } else if (isNearPlane()) {
            // 只有在飞机附近才能上飞机
            isPlaneView = true;
            if (planeModel && characterModel) {
                characterModel.remove(camera);

                // 隐藏人物模型
                characterModel.visible = false;

                planeModel.add(camera);
                // 相机在飞机后面，看向飞机前进方向
                camera.position.set(0, 3, -6);
                camera.rotation.set(-0.1, Math.PI, 0); // 稍微向下看约6度，主要朝向前方
            }
        }
    } else if (event.key === 'e' || event.key === 'E') {
        if (isComputerView) {
            // 退出电脑模式
            isComputerView = false;
            exitComputerView(camera, characterModel, css3Renderer);
        } else if (isNearComputer(characterModel)) {
            // 进入电脑模式
            isComputerView = true;
            enterComputerView(camera, scene, css3Renderer, characterModel);
        }
    } else if (event.key === 'h' || event.key === 'H') {
        if (isNearPerson() && !isNearDancer() && !isPlaneView && !isCarView && !isComputerView) {
            if (!isTalking) {
                isTalking = true;
                dialogueIndex = 0;
            } else {
                if (dialogueIndex < dialogueData.length - 1) {
                    dialogueIndex++;
                } else {
                    dialogueIndex = 0;
                }
            }
        } else if (isNearDancer() && !isPlaneView && !isCarView && !isComputerView) {
            if (!isTalkingToDancer) {
                isTalkingToDancer = true;
                dancerDialogueIndex = 0;
            } else {
                if (dancerDialogueIndex < dancerDialogueData.length - 1) {
                    dancerDialogueIndex++;
                } else if (dancerDialogueIndex < dancerDialogueData.length) {
                    dancerDialogueIndex = dancerDialogueData.length; // 对话结束，显示「按 J 开始跳舞」
                } else {
                    dancerDialogueIndex = 0; // 再按 H 重新开始
                }
            }
        }
    } else if (event.key === 'j' || event.key === 'J') {
        // J 键：在女孩对话完成后开始跳舞
        if (
            isNearDancer() &&
            !isPlaneView && !isCarView && !isComputerView &&
            isTalkingToDancer &&
            dancerDialogueIndex >= dancerDialogueData.length
        ) {
            startPlayerDance();
        }
    } else if (event.key === 'l' || event.key === 'L') {
        // L 键：结束跳舞
        if (isDancing) {
            stopPlayerDance();
        }
    } else if (event.key === 'k' || event.key === 'K') {
        if (isNearPerson() && isTalking && !isPlaneView && !isCarView && !isComputerView) {
            isTalking = false;
            dialogueIndex = 0;
        }
        if (isNearDancer() && isTalkingToDancer && !isPlaneView && !isCarView && !isComputerView) {
            isTalkingToDancer = false;
            dancerDialogueIndex = 0;
        }
    } else if (event.key === 'm' || event.key === 'M') {
        // M 键处理：切换全屏地图（在非电脑模式下）
        if (!isComputerView) {
            toggleFullMap();
        }
    } else if (event.key === '1') {
        // 数字键1：晴天
        setWeather(WeatherType.CLEAR);
        if (isSettingsOpen) updateWeatherButtonStates();
    } else if (event.key === '2') {
        // 数字键2：雨天
        setWeather(WeatherType.RAIN);
        if (isSettingsOpen) updateWeatherButtonStates();
    } else if (event.key === '3') {
        // 数字键3：雪天
        setWeather(WeatherType.SNOW);
        if (isSettingsOpen) updateWeatherButtonStates();
    } else if (event.key === '4') {
        // 数字键4：雾天
        setWeather(WeatherType.FOG);
        if (isSettingsOpen) updateWeatherButtonStates();
    } else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        doSave();
    } else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        doLoad();
    } else if (event.key === '?' || event.key === '？') {
        toggleManual();
    } else if (event.key === 'p' || event.key === 'P') {
        if (!isComputerView) toggleSettings();
    } else if (event.key === 'Escape') {
        if (isManualOpen) toggleManual();
        else if (isSettingsOpen) toggleSettings();
        else if (isLoginOpen) toggleLogin();
        else if (isRegisterOpen) toggleRegister();
    }
});

export { camera }

