import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh.js';

const scene = new THREE.Scene();

scene.add(mesh);

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(500, 300, 600);
scene.add(light);

const light2 = new THREE.AmbientLight();
scene.add(light2);

const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(0, 500, 200);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)

const geometry = new THREE.PlaneGeometry(3000, 3000);

const loader = new THREE.TextureLoader();
const grid = loader.load('./grid.png');
grid.colorSpace = THREE.SRGBColorSpace;
grid.wrapS = grid.wrapT = THREE.RepeatWrapping;
grid.repeat.set(20, 20);

const material = new THREE.MeshPhongMaterial({
  map: grid,
  transparent: true,
  opacity: 0.15
});
const plane = new THREE.Mesh(geometry, material);
plane.rotateX(-Math.PI / 2);
plane.position.y = -11;
scene.add(plane);

for(let i = 0; i < 10;i ++) {
  const R = 100 + i * 50;

  if(i % 2 === 0) {
    const curve1 = new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI * 2);
  
    const pointsArr = curve1.getPoints(50);
    const geometry2 = new THREE.BufferGeometry();
    geometry2.setFromPoints(pointsArr);
  
    const material2 = new THREE.LineBasicMaterial({
        color: new THREE.Color('white'),
        transparent: true,
        opacity: 0.8 - i * 0.05
    });
  
    const line = new THREE.Line(geometry2, material2);
    line.rotateX(-Math.PI / 2);
    line.position.y = -10;
    scene.add(line);
  } else {
    const geometry2 = new THREE.BufferGeometry();

    const R2 = R - 10;
    const pointsArr =  [];

    for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI  / 100) {
      pointsArr.push(
        new THREE.Vector3(R * Math.cos(angle), R * Math.sin(angle), 0),
        new THREE.Vector3(R2 * Math.cos(angle), R2 * Math.sin(angle), 0),
      )
    }

    geometry2.setFromPoints(pointsArr);
  
    const material2 = new THREE.LineBasicMaterial({
        color: new THREE.Color('white'),
        transparent: true,
        opacity: 0.8 - i * 0.05
    });
  
    const line = new THREE.LineSegments(geometry2, material2);
    line.rotateX(-Math.PI / 2);
    line.position.y = -10;
    scene.add(line);
  }
  
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
