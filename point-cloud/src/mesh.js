import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/Addons.js';

const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshPhongMaterial({
    color: 'orange'
})
const mesh = new THREE.Mesh(geometry, material);

const sampler = new MeshSurfaceSampler(mesh).build();

const vertices = [];
const position = new THREE.Vector3();
for (let i = 0; i < 1000; i++) {
    sampler.sample(position);
    vertices.push(position.x, position.y, position.z);
}

const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
);
const pointMaterial = new THREE.PointsMaterial({
    size: 0.5,
    color: 'orange'
});
const pointCloud = new THREE.Points(bufferGeometry, pointMaterial);

export default pointCloud;
