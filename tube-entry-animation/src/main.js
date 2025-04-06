import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import tube, { tubePoints } from './tube.js';
import { Easing, Tween } from '@tweenjs/tween.js';

const scene = new THREE.Scene();

scene.add(mesh, tube);

const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(200, 800, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

const tween = new Tween({
  x: 0,
  y: 500,
  z: 800,
  rotation: 0
}).to({
  x: 200,
  y: 800,
  z: 800,
  rotation: 180
}).repeat(0).easing(Easing.Quadratic.InOut).onUpdate((obj) => {
  camera.position.copy(new THREE.Vector3(obj.x, obj.y, obj.z));
  camera.lookAt(0, 0, 0);

  mesh.rotation.y = obj.rotation / 180 * Math.PI;
});

let started = false;
let i = 0;
function render(time) {
    if(i< tubePoints.length - 1) {
        camera.position.copy(tubePoints[i]);
        camera.lookAt(tubePoints[i + 1]);
        i += 4;
    } else {
      if(!started) {
        scene.remove(tube);
        tween.start();
        started = true;
      }
    }

    tween.update(time);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
