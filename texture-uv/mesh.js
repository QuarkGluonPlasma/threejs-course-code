import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(200, 100);

const uvs = new Float32Array([
    0, 0.5,
    0.5, 0.5,
    0, 0,
    0.5, 0
]);

geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);

const loader = new THREE.TextureLoader();
const texture = loader.load('./bg.png');
texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial(({
    map: texture
}));

const mesh = new THREE.Mesh(geometry, material);

console.log(mesh);

export default mesh;
