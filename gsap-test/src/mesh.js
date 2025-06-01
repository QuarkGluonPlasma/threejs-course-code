import gsap from 'gsap';
import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(30, 30, 30);
const material = new THREE.MeshPhongMaterial({
    color: 'orange'
});

const mesh = new THREE.Mesh(geometry, material);

// gsap.to(mesh.position, {
//     x: 300,
//     ease: 'bounce.inOut'
// }).repeat(0);

const tl = gsap.timeline();

tl.to(mesh.position, { duration: 2, x: 300 })
  .to(mesh.rotation, { duration: 1, y: Math.PI / 3}, '+=3')
  .to(mesh.scale, { duration: 1, x: 2 }, '<');

export default mesh;