import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const texture = loader.load('./grass.png');
texture.colorSpace = THREE.SRGBColorSpace;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.x = 20;
texture.repeat.y = 20;

const geometry = new THREE.PlaneGeometry(100000, 100000);
const material = new THREE.MeshLambertMaterial({
    // color: new THREE.Color('green'),
    map: texture,
    aoMap: texture
});

const grass = new THREE.Mesh(geometry, material);
grass.rotateX( -Math.PI / 2);
grass.position.y = -150;

export default grass;
