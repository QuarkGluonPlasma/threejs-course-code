import * as THREE from 'three';
import { PANORAMA_CENTER } from './constants.js';

/**
 * 加载一间房的全景立方体。
 * @param {{ materialSrc: string[] }} roomData
 * @param {{ onProgress?: (progress: number) => void }} options
 * @returns {Promise<THREE.Mesh>}
 */
export function loadRoom(roomData, { onProgress } = {}) {
  const { materialSrc } = roomData;

  return new Promise((resolve) => {
    const materials = [];
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    if (onProgress) {
      loadingManager.onProgress = (_url, loaded, total) => {
        onProgress(loaded / total);
      };
    }

    for (const src of materialSrc) {
      const texture = textureLoader.load(src);
      texture.colorSpace = THREE.SRGBColorSpace;
      materials.push(new THREE.MeshBasicMaterial({ map: texture }));
    }

    loadingManager.onLoad = () => {
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      geometry.scale(1, 1, -1);

      const cube = new THREE.Mesh(geometry, materials);
      const [x, y, z] = PANORAMA_CENTER;
      cube.position.set(x, y, z);

      resolve(cube);
    };
  });
}
