import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const loader = new THREE.TextureLoader();
const texture = loader.load('./zhuan.jpg');
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.TorusGeometry(300, 100);
const material = new THREE.MeshPhysicalMaterial({
    color: 'blue',
    sheen: 1,
    sheenRoughness: 1,
    sheenColor: 'white',
    sheenColorMap: texture
});

const gui = new GUI();
gui.addColor(material, 'color');
gui.add(material, 'sheen', 0, 1);
gui.add(material, 'sheenRoughness', 0, 1);
gui.addColor(material, 'sheenColor');

const mesh = new THREE.Mesh(geometry, material);

export default mesh;

