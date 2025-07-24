import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {loadTree, loadTrees} from './tree';

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshLambertMaterial({
  color: 'orange',
});
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// const mesh2 = mesh.clone();
// mesh2.geometry = mesh2.geometry.clone();
// mesh2.material = mesh2.material.clone();
// mesh2.material.color.set('lightgreen');
// mesh2.position.y = 200;
// scene.add(mesh2);

// const positions = mesh2.geometry.attributes.position;
// for(let i = 0; i< positions.count; i++) {
//   positions.setX(i, positions.getX(i) * 2);
// }

// const mesh3 = mesh.clone();
// mesh3.position.x = 200;
// const mesh4 = mesh.clone();
// mesh4.position.x = -200;
// scene.add(mesh3, mesh4);
// mesh3.material.visible = false;

loadTree(tree => {
  const group = new THREE.Group();

  tree.scale.set(20, 20, 20);

  // const tree2 = tree.clone();
  // tree2.position.x = -200;
  // const tree3 = tree.clone();
  // tree3.position.x = 200;

  group.add(tree);
  group.position.z = 60;
  group.position.x = 60;
  scene.add(group);

  // tree.getObjectByName('leaves001').material.color.set('green');
  // tree.getObjectByName('tree001').material.color.set('brown');

  // tree2.traverse(obj => {
  //     if (obj.isMesh) {
  //         obj.material = obj.material.clone();
  //     }
  // })
  // tree2.getObjectByName('leaves001').material.color.set('orange');

});

loadTrees(tree => {
  const group = new THREE.Group();

  tree.scale.set(20, 20, 20);

  // const tree2 = tree.clone();
  // tree2.position.x = -200;
  // const tree3 = tree.clone();
  // tree3.position.x = 200;

  group.add(tree);
  group.position.z = 30;
  group.position.x = 30
  scene.add(group);

  // tree.getObjectByName('leaves001').material.color.set('green');
  // tree.getObjectByName('tree001').material.color.set('brown');

  // tree2.traverse(obj => {
  //     if (obj.isMesh) {
  //         obj.material = obj.material.clone();
  //     }
  // })
  // tree2.getObjectByName('leaves001').material.color.set('orange');

});


const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.set(300, 300, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta(); 
    // mesh.rotateY(delta * Math.random()*2);
    // mesh.rotateX(delta * Math.random());
    // mesh.rotateZ(delta * Math.random());

    // mesh2.rotation.copy(mesh.rotation);
    // mesh3.rotateY(delta * Math.random()*8);
    // mesh4.rotation.copy(mesh3.rotation);
    // mesh3.rotateX(delta * Math.random()*8);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
