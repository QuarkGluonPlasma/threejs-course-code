import * as THREE from 'three';

const arr = [
    new THREE.Vector2( -100, 0 ),
	new THREE.Vector2( -50, 50 ),
	new THREE.Vector2( 0, 0 ),
	new THREE.Vector2( 50, -50 ),
    new THREE.Vector2( 100, -30),
	new THREE.Vector2( 100, 0 )
];

const curve = new THREE.SplineCurve(arr);
const pointsArr = curve.getPoints(20);

const geometry = new THREE.BufferGeometry();
geometry.setFromPoints(pointsArr);

const material = new THREE.LineBasicMaterial({ 
    color: new THREE.Color('orange') 
});

const line = new THREE.Line( geometry, material );

const pointsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('pink'),
    size: 5
});

const points = new THREE.Points(geometry, pointsMaterial);
line.add(points);

const geometry2 = new THREE.BufferGeometry();
geometry2.setFromPoints(arr);
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('green'),
    size: 10
});
const points2 = new THREE.Points(geometry2, material2);
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
line.add(points2, line2);

export default line;
