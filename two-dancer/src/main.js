import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import stage from './stage.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

const scene = new THREE.Scene();

scene.add(stage);

const directionLight = new THREE.DirectionalLight(0xffffff, 5);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const spotLight = new THREE.SpotLight('white', 5000000);
spotLight.angle = Math.PI / 6;
spotLight.position.set(0, 800, 0);
spotLight.lookAt(0, 0, 0);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.shadow.camera.far = 10000;

const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(cameraHelper);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const glitchPass = new GlitchPass();
composer.addPass(glitchPass);

renderer.shadowMap.enabled = true;

function render() {
    composer.render();
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

window.onresize = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width,height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

