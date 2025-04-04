import * as THREE from 'three';
import { createNoise2D } from "simplex-noise";
import loadTree from './tree';

const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

const noise2D = createNoise2D();

const positions = geometry.attributes.position;

for (let i = 0 ; i < positions.count; i ++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    const z = noise2D(x / 800, y / 800) * 50;

    positions.setZ(i, z);
}

const heightArr = [];
for (let i = 0; i < positions.count; i++) {
    heightArr.push(positions.getZ(i));
}
heightArr.sort();

const minHeight = heightArr[0];
const maxHeight = heightArr[heightArr.length - 1];
const height = maxHeight - minHeight;

const colorsArr = [];
const color1 = new THREE.Color('#eee');
const color2 = new THREE.Color('white');

for (let i = 0; i < positions.count; i++) {
    const percent = (positions.getZ(i) - minHeight) / height;
    const c = color1.clone().lerp(color2, percent);
    colorsArr.push(c.r, c.g, c.b); 
}
const colors = new Float32Array(colorsArr);
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

const material = new THREE.MeshLambertMaterial({
    // color: new THREE.Color('white'),
    vertexColors:true,
    // wireframe: true
});

const mountainside = new THREE.Mesh(geometry, material);
mountainside.rotateX(- Math.PI / 2);
console.log(mountainside);
mountainside.receiveShadow = true;

loadTree((tree) => {
    let i = 0;
    while(i< positions.count) {
        const newTree = tree.clone();
        newTree.position.x = positions.getX(i);
        newTree.position.y = positions.getY(i);
        newTree.position.z = positions.getZ(i);
        mountainside.add(newTree);
        newTree.rotateX(Math.PI / 2);

        i += Math.floor(300 * Math.random());
    }
})

export default mountainside;
