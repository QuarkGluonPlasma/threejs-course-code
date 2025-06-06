import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/Addons.js';

const group = new THREE.Group();

// const geometry = new THREE.SphereGeometry(200);
const geometry = new THREE.DodecahedronGeometry(200);
const material = new THREE.MeshPhongMaterial({
    color: 'orange'
});
const mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

const loader = new THREE.TextureLoader();
const texture = loader.load('./xiaoxin.png');
texture.colorSpace = THREE.SRGBColorSpace;

const position = new THREE.Vector3(85, -5, -134);
const orientation = new THREE.Euler();
const size = new THREE.Vector3(100, 100, 100);
const geometry2 = new DecalGeometry(mesh, position, orientation, size);
const material2 = new THREE.MeshPhongMaterial({
    polygonOffset: true,
    polygonOffsetFactor: -4,
    // color: 'green',
    map: texture,
    transparent: true
});
const mesh2 = new THREE.Mesh(geometry2, material2);
group.add(mesh2);

export default group;
