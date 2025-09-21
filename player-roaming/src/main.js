import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import { changeAction } from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(500, 300, 600);
scene.add(light);

const light2 = new THREE.AmbientLight();
scene.add(light2);

const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10000, 500, 'orange', 'blue');
scene.add(gridHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
// camera.position.set(0, 500, 500);
// camera.lookAt(0, 0, 0);

camera.position.y = 150;
camera.position.z = 300;
camera.lookAt(0, 150, 0);

mesh.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)


document.body.append(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

let keyPressed = {
  w: false,
  a: false,
  s: false,
  d: false
};

document.addEventListener('keydown', e => {
  switch(e.code) {
    case 'KeyA':
      keyPressed.a = true;
      break;
    case 'KeyW':
      keyPressed.w = true;
      break;
    case 'KeyS':
      keyPressed.s = true;
      break;
    case 'KeyD':
      keyPressed.d = true;
      break;
  }
});

document.addEventListener('keyup', e => {
  switch(e.code) {
    case 'KeyA':
      keyPressed.a = false;
      break;
    case 'KeyW':
      keyPressed.w = false;
      break;
    case 'KeyS':
      keyPressed.s = false;
      break;
    case 'KeyD':
      keyPressed.d = false;
      break;
  }

  setTimeout(() => {
    changeAction?.(true);
  }, 2000);
});

const clock = new THREE.Clock();

const v = new THREE.Vector3(0, 0, 0);
const a = 100;
const resistance = -0.01;

let flag = false;
function render() {
  const deltaTime = clock.getDelta();
  if(keyPressed.w) {
    
    if(!flag) {
      changeAction?.(false);
    }
    flag = true;

    const dir = camera.getWorldDirection(new THREE.Vector3());
    dir.y = 0;

    if(v.length() > -400) {
      v.add(dir.multiplyScalar(a * deltaTime));
    }
  } else if(keyPressed.s) {
    if(!flag) {
      changeAction?.(false);
    }
    flag = true;

    const dir = camera.getWorldDirection(new THREE.Vector3());
    dir.y = 0;
    if(v.length() < 400) {
      v.add(dir.multiplyScalar(-a * deltaTime));
    }
  } else if(keyPressed.a) {
    if(!flag) {
      changeAction?.(false);
    }
    flag = true;

    const frontDir = camera.getWorldDirection(new THREE.Vector3());
    const topDir = new THREE.Vector3(0, 1, 0);
    const dir = topDir.cross(frontDir);

    if(v.length() < 400) {
      v.add(dir.multiplyScalar(a * deltaTime));
    }
  } else if(keyPressed.d) {
    if(!flag) {
      changeAction?.(false);
    }
    flag = true;

    const frontDir = camera.getWorldDirection(new THREE.Vector3());
    const topDir = new THREE.Vector3(0, 1, 0);
    const dir = frontDir.cross(topDir);

    if(v.length() < 400) {
      v.add(dir.multiplyScalar(a * deltaTime));
    }
  } else {
    flag = false;
  }

  v.addScaledVector(v, resistance);

  const movePos = v.clone().multiplyScalar(deltaTime);
  mesh.position.add(movePos);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

// let mousePressed = false;
// document.addEventListener('mousedown', () => {
//   mousePressed = true;
// });

document.addEventListener('mousedown', () => {
  document.body.requestPointerLock();
});

const min = THREE.MathUtils.degToRad(-20);
const max = THREE.MathUtils.degToRad(20);

document.addEventListener('mousemove', (e) => {
  // if(mousePressed) {
  if(document.pointerLockElement === document.body) {
    mesh.rotation.y -= e.movementX / 500;
    camera.rotation.x -= e.movementY / 500;

    if(camera.rotation.x > max) {
      camera.rotation.x = max
    } 
    if(camera.rotation.x < min) {
      camera.rotation.x = min
    }
  }
});

// document.addEventListener('mouseup', () => {
//   mousePressed = false;
// });

