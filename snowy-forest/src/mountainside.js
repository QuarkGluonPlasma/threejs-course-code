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

const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color('white'),
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
