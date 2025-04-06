import * as THREE from 'three';

const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1000, 200, 900),
    new THREE.Vector3(-400, 800, 1000),
    new THREE.Vector3(0, 0, 0)
]);

const geometry = new THREE.TubeGeometry(path, 100, 50, 30);

const material = new THREE.MeshBasicMaterial({
    color: 'blue',
    wireframe: true
});

const tube = new THREE.Mesh(geometry, material);
tube.position.set(0, 500, 800);

material.visible = false;
const pointsMaterial = new THREE.PointsMaterial({
    color: 'orange',
    size: 3
});
const points = new THREE.Points(geometry, pointsMaterial);
tube.add(points);

export const tubePoints = path.getSpacedPoints(1000).map(item => {
    return new THREE.Vector3(item.x, item.y + 500, item.z + 800)
});

export default tube;
