import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const textureCube = new THREE.CubeTextureLoader()
    .setPath('./forest/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const geometry = new THREE.CylinderGeometry(200, 200, 500);
const material = new THREE.MeshStandardMaterial({
    color: 'orange',
    roughness: 0,
    metalness: 1,
    envMap: textureCube,
    envMapIntensity: 1
});

const gui = new GUI();
gui.addColor(material, 'color');
gui.add(material, 'roughness', 0, 1);
gui.add(material, 'metalness', 0, 1);
gui.add(material, 'envMapIntensity', 0, 5);

const mesh = new THREE.Mesh(geometry, material);

export default mesh
