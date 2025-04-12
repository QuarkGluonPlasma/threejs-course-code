import { Tween } from '@tweenjs/tween.js';
import * as THREE from 'three';

const group = new THREE.Group();

const textureCube = new THREE.CubeTextureLoader()
    .setPath('./city/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512);
export const cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

const geometry = new THREE.PlaneGeometry(1000, 1000)
const material = new THREE.MeshStandardMaterial({
    color: 'white',
    metalness: 1,
    roughness: 0,
    envMap: cubeRenderTarget.texture
});
const mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

const geometry2 = new THREE.SphereGeometry(100);
const material2 = new THREE.MeshStandardMaterial({
    color: 'lightgreen'
});
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.set(0, 0, 500);
group.add(mesh2);

let r = 800;
export const ballTween = new Tween({ angle: 0}).to({
    angle: Math.PI
}, 5000)
.repeat(Infinity)
.onUpdate(obj => {
    mesh2.position.x = Math.cos(obj.angle) * r;
    mesh2.position.z = Math.sin(obj.angle) * r;
}).start();

export default group;
