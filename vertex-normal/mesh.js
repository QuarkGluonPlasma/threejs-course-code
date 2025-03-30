import * as THREE from 'three';

const p1 = new THREE.Vector3(-100, 0, 0);
const p2 = new THREE.Vector3(50, 100, 0);
const p3 = new THREE.Vector3(100, 0, 100);
const p4 = new THREE.Vector3(100, 0, 0);

const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

const geometry = new THREE.TubeGeometry(curve, 50, 10, 20);

const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('white'),
    shininess: 500
});

const mesh = new THREE.Mesh(geometry, material);

console.log(mesh);
export default mesh;
