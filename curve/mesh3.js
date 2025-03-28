import * as THREE from 'three';

const p1 = new THREE.Vector2(0, 0);
const p2 = new THREE.Vector2(50, 200);
const p3 = new THREE.Vector2(100, 0);

const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);
const pointsArr = curve.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({ 
    color: new THREE.Color('orange')
});

const line = new THREE.Line( geometry, material );


const geometry2 = new THREE.BufferGeometry();
geometry2.setFromPoints([p1,p2,p3]);
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('pink'),
    size: 5
});
const points2 = new THREE.Points(geometry2, material2);
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
line.add(points2, line2);

export default line;
