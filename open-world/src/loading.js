/**
 * 加载管理器 - 统一追踪所有资源加载进度
 */
import * as THREE from 'three';

let resolveLoadComplete;
export const loadCompletePromise = new Promise((resolve) => {
  resolveLoadComplete = resolve;
});

function updateProgressUI(loaded, total) {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
  const progressEl = document.getElementById('loadingProgress');
  const percentEl = document.getElementById('loadingPercent');
  if (progressEl) progressEl.style.width = pct + '%';
  if (percentEl) percentEl.textContent = pct + '%';
}

export const loadingManager = new THREE.LoadingManager(
  () => {
    updateProgressUI(100, 100);
    resolveLoadComplete();
  },
  (url, loaded, total) => {
    updateProgressUI(loaded, total);
  },
  (url) => {
    console.error('加载失败:', url);
  }
);
