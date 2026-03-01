/**
 * 存档系统 - 使用 localStorage 保存和加载游戏状态
 */

import { WeatherType } from './weather.js';

const SAVE_KEY = 'open-world-save';
const SAVE_VERSION = 1;

/**
 * 收集当前游戏状态
 */
export function getGameState(getters) {
  const { playerBody, carBody, planeBody, doorBody, characterModel } = getters;
  const state = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    player: null,
    car: null,
    plane: null,
    door: null,
    weather: null,
    settings: getters.settings ? getters.settings() : null
  };

  if (playerBody) {
    const pos = playerBody.position;
    const vel = playerBody.velocity;
    state.player = {
      x: pos.x, y: pos.y, z: pos.z,
      rotY: characterModel ? characterModel.rotation.y : 0,
      vx: vel.x, vy: vel.y, vz: vel.z
    };
  }

  if (carBody) {
    const pos = carBody.position;
    const quat = carBody.quaternion;
    const vel = carBody.velocity;
    state.car = {
      x: pos.x, y: pos.y, z: pos.z,
      qx: quat.x, qy: quat.y, qz: quat.z, qw: quat.w,
      vx: vel.x, vy: vel.y, vz: vel.z
    };
  }

  if (planeBody) {
    const pos = planeBody.position;
    const quat = planeBody.quaternion;
    const vel = planeBody.velocity;
    state.plane = {
      x: pos.x, y: pos.y, z: pos.z,
      qx: quat.x, qy: quat.y, qz: quat.z, qw: quat.w,
      vx: vel.x, vy: vel.y, vz: vel.z
    };
  }

  if (doorBody) {
    const pos = doorBody.position;
    const quat = doorBody.quaternion;
    state.door = {
      x: pos.x, y: pos.y, z: pos.z,
      qx: quat.x, qy: quat.y, qz: quat.z, qw: quat.w
    };
  }

  if (getters.weather) {
    state.weather = getters.weather();
  }

  return state;
}

/**
 * 应用存档状态到游戏
 */
export function applyGameState(state, setters) {
  if (!state || state.version !== SAVE_VERSION) return false;

  const { setPlayerState, setCarState, setPlaneState, setDoorState, setWeather, setSettings } = setters;

  if (state.player && setPlayerState) {
    setPlayerState(state.player);
  }
  if (state.car && setCarState) {
    setCarState(state.car);
  }
  if (state.plane && setPlaneState) {
    setPlaneState(state.plane);
  }
  if (state.door && setDoorState) {
    setDoorState(state.door);
  }
  if (state.weather && setWeather) {
    const weatherType = Object.values(WeatherType).includes(state.weather)
      ? state.weather
      : WeatherType.CLEAR;
    setWeather(weatherType);
  }
  if (state.settings && setSettings) {
    setSettings(state.settings);
  }

  return true;
}

/**
 * 保存到 localStorage
 */
export function saveGame(getters) {
  try {
    const state = getGameState(getters);
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return { success: true, timestamp: state.timestamp };
  } catch (e) {
    console.error('存档失败:', e);
    return { success: false };
  }
}

/**
 * 从 localStorage 加载
 */
export function loadGame(setters) {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { success: false, reason: '无存档' };
    const state = JSON.parse(raw);
    const ok = applyGameState(state, setters);
    return { success: ok, timestamp: state.timestamp };
  } catch (e) {
    console.error('读档失败:', e);
    return { success: false, reason: '存档损坏' };
  }
}

/**
 * 检查是否有存档
 */
export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

/**
 * 获取存档时间
 */
export function getSaveTimestamp() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    return state.timestamp || null;
  } catch {
    return null;
  }
}
