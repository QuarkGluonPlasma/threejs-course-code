import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';
import { DecalGeometry } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.add(mesh);

const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(500, 600, 400);
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

const loader = new THREE.TextureLoader();
const texture = loader.load('./xiaoxin.png');
texture.colorSpace = THREE.SRGBColorSpace;

renderer.domElement.addEventListener('click', (e) => {
    const y = -((e.offsetY / height) * 2 - 1);
    const x = (e.offsetX / width) * 2 - 1;
  
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);
  
    const intersections = rayCaster.intersectObjects(mesh.children);
    
    if(intersections.length) {
      console.log(intersections);
      const position = intersections[0].point;
      console.log(position);

      const orientation = new THREE.Euler();
      const size = new THREE.Vector3(100, 100, 100);
      const geometry1 = new DecalGeometry(intersections[0].object, position, orientation, size);
      const material1 = new THREE.MeshPhongMaterial({
          polygonOffset: true,
          polygonOffsetFactor: -4,
          map: texture,
          transparent: true,
      });
      const mesh1 = new THREE.Mesh( geometry1, material1 );
      scene.add(mesh1);
    }
});
  