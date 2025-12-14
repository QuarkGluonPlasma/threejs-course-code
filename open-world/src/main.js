import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import car from './car.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

scene.add(mesh);
scene.add(car);

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

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

export { camera }

