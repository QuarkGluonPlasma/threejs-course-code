import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

const directionLight = new THREE.DirectionalLight(0xffffff);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(300, 700, 300);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)

function render(time) {
    renderer.render(scene, camera);
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

const rgbeloader = new RGBELoader();

rgbeloader.load('./pic.hdr', function ( texture ) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

// const textureLoader = new THREE.TextureLoader();

// textureLoader.load('./pic.jpg', function ( texture ) {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = texture;
// });
