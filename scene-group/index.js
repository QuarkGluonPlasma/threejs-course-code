import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();

console.log(scene);

// scene.add(mesh);
// mesh.position.x = 200;
// mesh.translateZ(200);

const group = new THREE.Group();
group.add(mesh);
scene.add(group);
group.position.x = 200;
group.translateZ(200);
mesh.position.x = 200;

const pos = new THREE.Vector3();
mesh.getWorldPosition(pos);
console.log(pos);
console.log(group.position);
console.log(mesh.position);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(3000, 2000, 1000);
scene.add(light);

const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const axesHelper2 = new THREE.AxesHelper(200);
group.add(axesHelper2);

scene.traverse((obj) => {
    if(obj.isMesh) {
        obj.material.color = new THREE.Color('pink');
    }
});

const cube = scene.getObjectByName('cube');
cube.material.color = new THREE.Color('lightgreen');

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(500, 500, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
