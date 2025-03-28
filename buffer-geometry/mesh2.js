import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshLambertMaterial(({
    color: new THREE.Color('orange')
}));
const mesh = new THREE.Mesh(geometry, material);

console.log(mesh);

export default mesh;
