import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI();

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);
plane.position.y = -50;

const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const box2 = box.clone();
box2.position.x = 200;

export const mesh = new THREE.Group();
mesh.add(plane);
mesh.add(box);
mesh.add(box2);

export const light = new THREE.SpotLight(0xffffff, 1000000);
light.distance = 1000;
light.angle = Math.PI / 6;
light.position.set(400, 500, 300);
light.lookAt(0, 0, 0);

let helper = new THREE.SpotLightHelper(light);
mesh.add(helper);

const f1 = gui.addFolder('聚光灯');
function onChange() {
    helper.update();
}
f1.add(light.position, 'x').min(10).max(1000).onChange(onChange);
f1.add(light.position, 'y').min(10).max(1000).onChange(onChange);
f1.add(light.position, 'z').min(10).max(1000).onChange(onChange);
f1.add(light, 'angle', {
    '30': Math.PI / 6,
    '60': Math.PI / 3,
}).onChange(onChange);
f1.add(light, 'intensity');
f1.add(light, 'distance').min(800).max(2000).onChange(onChange);
