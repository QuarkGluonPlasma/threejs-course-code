import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import { cars } from './mesh.js';
import gsap from 'gsap';
import { throttle } from 'lodash-es';
import blood, { addCollisionBehavior, batchRenderer } from './blood.js';
import { createGameOver, createGo, createLeftArrow,createReady,createRightArrow } from './text.js';

const scene = new THREE.Scene();

scene.add(mesh);
scene.add(blood);
scene.add(createLeftArrow());
scene.add(createRightArrow());
scene.add(createReady());
scene.add(createGo());

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(500, 300, 600);
scene.add(light);

const light2 = new THREE.AmbientLight();
scene.add(light2);

const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(0, 500, 500);
camera.lookAt(0, 0, 0);

camera.position.y = 2000;
camera.position.z = 2000;
gsap.to(camera.position, {
  y: 500,
  z: 500,
  duration: 2
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

let man;
let gameOver = false;

export function isGameOver() {
  return gameOver;
}

const clock = new THREE.Clock();

function render() {

    const delta = clock.getDelta();

    if(batchRenderer) {
      batchRenderer.update(delta);
    }

    if(!man) {
      man = scene.getObjectByName('man');
    }
    let manBox3;
    if(man) {
      manBox3 = new THREE.Box3();
      manBox3.setFromObject(man);
      
      if(man.rotation.y === 0) {
        manBox3.expandByVector(new THREE.Vector3(-50, 0, 0));
      } else {
        manBox3.expandByVector(new THREE.Vector3(0, 0, -50));
      }
    }

    if(!gameOver) {
      cars.forEach((arr, index) => {
        arr.forEach(item => {
          item.position.z += item.speed;
          // item.helper.update(item);

          if(man) {
            const carBox3 = new THREE.Box3();
            carBox3.setFromObject(item);

            const collision = manBox3.intersectsBox(carBox3);

            if(collision) {
              gameOver = true;

              scene.add(createGameOver());

              const box3 = manBox3.intersect(carBox3);
              const emitter = blood.getObjectByName('bloodEmitter');
              emitter.visible = true;
              const pos = box3.getCenter(new THREE.Vector3())
              emitter.position.copy(pos);

              addCollisionBehavior(-pos.y);
            }
          }
        });

        arr = arr.filter(item => {
          if(item.position.z > 500) {
            item.parent?.remove(item);
            return false;
          };
          return true;
        })
      });
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

render();

function moveMan(man, x) {
  gsap.to(man.position, {
    x,
    duration: 0.2,
    ease: 'none',
    // onUpdate() {
    //   man.helper.update(man);
    // }
  });
}
const moveManFn = throttle(moveMan, 200);

window.addEventListener('keydown', (e) => {
  if(gameOver) {
    return;
  }
  const man = scene.getObjectByName('man');
  if(man) {
    let delta = 0;

    if(e.code === 'ArrowLeft') {
      delta = -50;
      man.rotation.y = Math.PI / 2;
    } else if(e.code === 'ArrowRight') {
      delta = 50;
      man.rotation.y = - Math.PI / 2;
    }
    moveManFn(man, man.position.x + delta);
  }
});

// window.addEventListener('keyup', (e) => {
//   const man = scene.getObjectByName('man');
//   man.rotation.y = 0;
// });

document.body.append(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
