import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.add(mesh);

const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 500, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const origin = new THREE.Vector3(300, 300, 300);
const cameraDir = camera.getWorldDirection(new THREE.Vector3());
const arrowHelper = new THREE.ArrowHelper(cameraDir, origin, 1000, 'yellow');
scene.add(arrowHelper);


console.log(origin.normalize(),cameraDir);


const gui = new GUI();

let originPosition = camera.position.clone();
gui.add({ num: 0 }, 'num', 0, 200).onChange(value => {
  const dir = cameraDir.clone().multiplyScalar(value);
  const pos = originPosition.clone().add(dir);
  camera.position.copy(pos);
}).name('add');
gui.add({ num: 0 }, 'num', 0, 200).onChange(value => {
  const dir = cameraDir.clone().multiplyScalar(value);
  const pos = originPosition.clone().sub(dir);
  camera.position.copy(pos);
}).name('sub');
