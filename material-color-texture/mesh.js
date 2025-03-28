import * as THREE from 'three';

const boxGeometry = new THREE.BoxGeometry(100, 100, 100);

const geometry = new THREE.EdgesGeometry(boxGeometry);

const material = new THREE.LineDashedMaterial(({
    color: new THREE.Color('orange'),
    dashSize: 10,
    gapSize: 10
}));

const line = new THREE.Line(geometry, material);
line.computeLineDistances();

console.log(line);

export default line;
