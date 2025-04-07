import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';

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

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

const css2Renderer = new CSS2DRenderer();
css2Renderer.setSize(width, height);

const div = document.createElement('div');
div.style.position = 'relative';
div.appendChild(css2Renderer.domElement);
css2Renderer.domElement.style.position = 'absolute';
css2Renderer.domElement.style.left = '0px';
css2Renderer.domElement.style.top = '0px';
css2Renderer.domElement.style.pointerEvents = 'none';

div.appendChild(renderer.domElement);
document.body.appendChild(div);

function render() {
    css2Renderer.render(scene, camera);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

// document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

window.onresize = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width,height);
  css2Renderer.setSize(width,height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

renderer.domElement.addEventListener('click', (e) => {
  const y = -((e.offsetY / height) * 2 - 1);
  const x = (e.offsetX / width) * 2 - 1;

  const rayCaster = new THREE.Raycaster();
  rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

  const intersections = rayCaster.intersectObjects(mesh.children);

  if(intersections.length) {
    const obj = intersections[0].object;
    const tag = obj.getObjectByName('tag');
    if(tag) {
      tag.visible = !tag.visible;
    }
  }
});
