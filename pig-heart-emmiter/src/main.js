import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import particles, { batchRenderer, replay, stop } from './particles.js';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

scene.add(mesh);
scene.add(particles);

const directionLight = new THREE.DirectionalLight(0xffffff);
directionLight.position.set(500, 600, 800);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const helper = new THREE.AxesHelper(1000);
// scene.add(helper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(0, 0, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
const bloomPass = new UnrealBloomPass(v);
composer.addPass(bloomPass);

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    // renderer.render(scene, camera);
    composer.render();
    requestAnimationFrame(render);

    if(batchRenderer) {
      batchRenderer.update(delta);
    }
}
render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

renderer.domElement.addEventListener('click', (e) => {
  const y = -((e.offsetY / height) * 2 - 1);
  const x = (e.offsetX / width) * 2 - 1;

  const rayCaster = new THREE.Raycaster();
  rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

  const intersections = rayCaster.intersectObjects([mesh]);
  
  if(intersections.length) {
    const obj = intersections[0].object;
    if(obj) {
      replay();
    }
  } else {
    stop();
  }
});
