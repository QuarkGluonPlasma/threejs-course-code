import * as THREE from 'three';

const geometry = new THREE.CylinderGeometry(50, 50, 80, 5);

const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
