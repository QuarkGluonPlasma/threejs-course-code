import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh, { tubePoints } from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const pointLight = new THREE.PointLight(0xffffff, 200);
pointLight.position.set(80, 80, 80);
scene.add(pointLight);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

let i = 0;
function render() {
    if(i< tubePoints.length - 1) {
        camera.position.copy(tubePoints[i]);
        camera.lookAt(tubePoints[i + 1]);
        
        // i += 1;
    } else {
        i = 0;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

document.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowDown') {
        i += 10;
    }
});

// alert('按向下的方向键，穿梭隧道');