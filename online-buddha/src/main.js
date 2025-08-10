import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh, { loadPromise } from './mesh.js';
import buddhistLight, { batchRenderer } from './buddhist-light.js';
import halo from './halo.js';
import ground from './ground.js';
import { EffectComposer, GammaCorrectionShader, OutlinePass, RenderPass, ShaderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';
import textRain, { batchRenderer as br } from './text-rain.js';

const scene = new THREE.Scene();

scene.add(mesh);
scene.add(buddhistLight);
scene.add(halo);
scene.add(ground);
scene.add(textRain);

const light = new THREE.DirectionalLight(0xffffff, 25);
light.position.set(0, 200, 500);
scene.add(light);

const light2 = new THREE.AmbientLight();
scene.add(light2);

const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 300, 10000);
camera.position.set(0, 200, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
const outlinePass = new OutlinePass(v, scene, camera);
outlinePass.visibleEdgeColor.set('lightyellow');
outlinePass.edgeStrength = 10;
outlinePass.edgeThickness = 10;
outlinePass.pulsePeriod = 5;
outlinePass.selectedObjects = [mesh];
composer.addPass(outlinePass);

const bloomPass = new UnrealBloomPass(v);
bloomPass.strength = 0.2;
composer.addPass(bloomPass);

const gammaPass= new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaPass);

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    // renderer.render(scene, camera);
    composer.render();
    requestAnimationFrame(render);

    if(batchRenderer) {
      batchRenderer.update(delta);
    }
    if(br) {
      br.update(delta);
    }
}
render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

loadPromise.then(() => {
  const box3 = new THREE.Box3();
  box3.expandByObject(mesh);

  const center = box3.getCenter(new THREE.Vector3());
  
  camera.lookAt(center.x, center.y, center.z);
  controls.target.set(center.x, center.y, center.z);
})

