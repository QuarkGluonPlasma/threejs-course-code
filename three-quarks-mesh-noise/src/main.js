import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import { batchRenderer } from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const helper = new THREE.AxesHelper(1000);
// scene.add(helper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(0, -500, 200);
camera.lookAt(0, -500, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    if(batchRenderer) {
      batchRenderer.update(delta);
    }
}
render();

document.body.append(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
