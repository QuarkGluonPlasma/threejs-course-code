import * as THREE from 'three';

const geometry = new  THREE.BoxGeometry(200, 200, 200);
const material = new THREE.MeshPhongMaterial({
    color: 'orange'
});
const mesh = new THREE.Mesh(geometry, material);

export default mesh;