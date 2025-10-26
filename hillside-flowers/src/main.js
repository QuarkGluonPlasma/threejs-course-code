import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();

// 设置背景颜色和雾气效果
scene.background = new THREE.Color(0x87CEEB); // 天空蓝
scene.fog = new THREE.Fog(0x87CEEB, 200, 1500);

scene.add(mesh);

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(1000, 3000, 2000);
light.castShadow = true;

light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 5000;
light.shadow.camera.left = -1000;
light.shadow.camera.right = 1000;
light.shadow.camera.top = 1000;
light.shadow.camera.bottom = -1000;

scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(0, 500, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height);

renderer.shadowMap.enabled = true;

// 相机环绕动画
let cameraAngle = 0;
const cameraRadius = 800;
const cameraHeight = 400;

function render() {
    // 简单的相机环绕
    cameraAngle += 0.005;
    
    camera.position.x = Math.cos(cameraAngle) * cameraRadius;
    camera.position.z = Math.sin(cameraAngle) * cameraRadius;
    camera.position.y = cameraHeight;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
