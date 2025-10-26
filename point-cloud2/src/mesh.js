import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/Addons.js';

const geometry = new THREE.DodecahedronGeometry(100);
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

const cubeGeometry = new THREE.BoxGeometry(2, 2, 30);
const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 'blue'
});

const cubesGroup = new THREE.Group();

for (let i = 0; i < vertices.length; i += 3) {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    const position = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    cube.position.copy(position);

    const normal = position.clone().normalize();
    cube.lookAt(normal);
    
    cubesGroup.add(cube);
}

mesh.add(cubesGroup);

export default mesh;

