import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const texture = loader.load('./shuini.png');
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.BoxGeometry(4000, 300, 3000);
const material = new THREE.MeshLambertMaterial({
    // color: new THREE.Color('grey')
    map: texture,
    aoMap: texture
});

const foundation = new THREE.Mesh(geometry, material);
foundation.translateY(10);
export default foundation;
