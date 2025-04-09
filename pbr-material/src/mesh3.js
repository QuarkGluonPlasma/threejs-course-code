import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const textureCube = new THREE.CubeTextureLoader()
    .setPath('./forest/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const geometry = new THREE.BoxGeometry(300, 300, 300);
const material = new THREE.MeshPhysicalMaterial({
    color: 'black',
    metalness: 0.8,
    roughness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMap: textureCube
});

const gui = new GUI();
gui.addColor(material, 'color');
gui.add(material, 'metalness', 0, 1);
gui.add(material, 'roughness', 0, 1);
gui.add(material, 'clearcoat', 0, 1);
gui.add(material, 'clearcoatRoughness', 0, 1);

const mesh = new THREE.Mesh(geometry, material);

export default mesh;

