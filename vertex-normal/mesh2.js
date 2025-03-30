import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    100, 100, -100
]);

const attribute = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribute;

const indexes = new Uint16Array([
    0, 1, 2, 2, 1, 3
]);
geometry.index = new THREE.BufferAttribute(indexes, 1);

const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,    
    0, 0, 1,
    1, 1, 0
]);
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('orange'),
    shininess: 1000
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
