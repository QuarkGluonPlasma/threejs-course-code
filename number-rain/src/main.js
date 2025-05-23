import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 300, 10000);
camera.position.set(width / 2 , height / 2, 500);
camera.lookAt(width / 2 , height / 2, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

// const controls = new OrbitControls(camera, renderer.domElement);

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);


