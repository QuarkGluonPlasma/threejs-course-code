import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import SpriteText from 'three-spritetext';

const scene = new THREE.Scene();

scene.add(mesh);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(500, 300, 600);
scene.add(light);

const light2 = new THREE.AmbientLight();
scene.add(light2);

const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(0, 200, 600);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

let lastPosName = null; 
renderer.domElement.addEventListener('click', (e) => {
  const y = -((e.offsetY / height) * 2 - 1);
  const x = (e.offsetX / width) * 2 - 1;

  const rayCaster = new THREE.Raycaster();
  rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

  const intersections = rayCaster.intersectObjects(scene.children);

  if(intersections.length) {
    const obj = intersections[0].object;

    if(obj.isSprite && obj.name.startsWith('annotation')) {

      const posName = new SpriteText(obj.name.replace('annotation', ''), 1);
      posName.color = 'black';
      posName.backgroundColor = 'white'
      posName.padding = 1.5;
      posName.borderWidth = 0.2;
      posName.borderRadius = 1;
      posName.borderColor = 'orange';
      posName.position.set(0, 3, 1);
      obj.add(posName);

      if(lastPosName) {
        lastPosName.parent.remove(lastPosName);
      }
      lastPosName = posName;
    }
  }
});
