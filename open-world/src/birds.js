import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadingManager } from './loading.js';

// 与 mesh.js 中 groundSize=100 一致：可飞行范围约为 [-50,50] x [-50,50]
const WORLD_HALF = 50;
const EDGE_MARGIN = 5;
const BOUNDS = WORLD_HALF - EDGE_MARGIN;

// 贴地低空，避免飞太高跑出视野
const MIN_Y = 2;
const MAX_Y = 9;
const REACH_DIST = 3;
const FLIGHT_SPEED = 3;

const loader = new GLTFLoader(loadingManager);

const group = new THREE.Group();

export const loadPromise = loader.loadAsync('./birds.glb');

export let birdsModel = null;

let mixer = null;
const clock = new THREE.Clock();

const currentTarget = new THREE.Vector3();
const toTarget = new THREE.Vector3();

let flightReady = false;

function randomInRange() {
  return (Math.random() * 2 - 1) * BOUNDS;
}

function pickTarget() {
  currentTarget.set(
    randomInRange(),
    MIN_Y + Math.random() * (MAX_Y - MIN_Y),
    randomInRange()
  );
}

loadPromise.then((gltf) => {
  const root = gltf.scene;
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  root.position.set(0, 0, 0);
  group.add(root);
  birdsModel = root;

  group.position.set(
    randomInRange(),
    MIN_Y + Math.random() * (MAX_Y - MIN_Y),
    randomInRange()
  );
  pickTarget();

  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(root);
    for (let i = 0; i < gltf.animations.length; i++) {
      mixer.clipAction(gltf.animations[i]).play();
    }
  }

  flightReady = true;
});

export function updateBirds() {
  const dt = clock.getDelta();
  if (mixer) {
    mixer.update(dt);
  }
  if (!flightReady) {
    return;
  }

  toTarget.copy(currentTarget).sub(group.position);
  let dist = toTarget.length();
  if (dist < REACH_DIST) {
    pickTarget();
    toTarget.copy(currentTarget).sub(group.position);
    dist = toTarget.length();
  }
  if (dist < 1e-4) {
    return;
  }
  toTarget.multiplyScalar(1 / dist);

  const step = Math.min(FLIGHT_SPEED * dt, dist);
  group.position.addScaledVector(toTarget, step);

  // 模型前向与移动方向相反时 + PI
  group.rotation.y = Math.atan2(toTarget.x, toTarget.z) + Math.PI;
}

export default group;
