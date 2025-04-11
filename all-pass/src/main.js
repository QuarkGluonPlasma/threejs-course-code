import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { AfterimagePass, BloomPass, BokehPass, FilmPass, GammaCorrectionShader, HalftonePass, OutlinePass, ShaderPass, SMAAPass, UnrealBloomPass } from 'three/addons/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(300, 300, 300);
const material = new THREE.MeshLambertMaterial({
  color: 'orange'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(400, 500, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  // antialias: true
});
renderer.setSize(width, height)

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);

// const afterimagePass = new AfterimagePass();
// composer.addPass(afterimagePass);

// const filmPass = new FilmPass(0.5, true);
// composer.addPass(filmPass);

// const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// const bloomPass = new UnrealBloomPass(v);
// bloomPass.strength = 0.8;
// bloomPass.radius = 10;
// composer.addPass(bloomPass);

// const halftonePass = new HalftonePass({
//   radius: 8
// });
// composer.addPass(halftonePass);

// const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// const outlinePass = new OutlinePass(v, scene, camera);
// outlinePass.visibleEdgeColor.set('blue');
// outlinePass.edgeStrength = 10;
// outlinePass.edgeThickness = 10;
// outlinePass.pulsePeriod = 1;
// outlinePass.selectedObjects = [mesh];
// composer.addPass(outlinePass);

const pixelRatio = renderer.getPixelRatio();
const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
composer.addPass(smaaPass);

const gammaPass= new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaPass);


function render() {
    composer.render();
    // renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
