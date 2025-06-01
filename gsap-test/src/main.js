import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import gsap from 'gsap';

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

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(200, 300, 300);
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


// const r = 50;

// const rotationObj = { angle: 0 };

// gsap.to(rotationObj, {
//     angle: Math.PI * 2, 
//     duration: 5,
//     ease: "quad.inOut",
//     repeat: -1, // -1 表示无限循环
//     onUpdate: function() {
//         // 更新相机位置
//         camera.position.x = r * Math.cos(rotationObj.angle);
//         camera.position.z = r * Math.sin(rotationObj.angle);
        
//         // 始终看向原点
//         camera.lookAt(0, 0, 0);
//     }
// });