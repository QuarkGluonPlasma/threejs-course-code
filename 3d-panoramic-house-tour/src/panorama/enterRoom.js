import { loadRoom } from './loadRoom.js';
import { PANORAMA_CENTER, PANORAMA_TARGET_OFFSET } from './constants.js';

const meshCache = new Map();

let currentMesh = null;
let currentRoomIndex = -1;
let loading = false;

export function getCurrentRoomIndex() {
  return currentRoomIndex;
}

function syncCamera(camera, controls) {
  const [x, y, z] = PANORAMA_CENTER;
  const [tx, ty, tz] = PANORAMA_TARGET_OFFSET;
  camera.position.set(x, y, z);
  controls.target.set(tx, ty, tz);
  camera.updateProjectionMatrix();
}

export async function enterRoom(scene, camera, controls, roomData, roomIndex) {
  if (loading) return currentMesh;
  if (roomIndex !== undefined && roomIndex === currentRoomIndex) {
    return currentMesh;
  }

  loading = true;

  try {
    let cube = meshCache.get(roomIndex);

    if (!cube) {
      cube = await loadRoom(roomData);
      meshCache.set(roomIndex, cube);
    }

    if (currentMesh) {
      scene.remove(currentMesh);
    }

    scene.add(cube);
    currentMesh = cube;
    currentRoomIndex = roomIndex;

    syncCamera(camera, controls);

    return cube;
  } finally {
    loading = false;
  }
}
