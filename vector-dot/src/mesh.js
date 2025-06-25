import * as THREE from 'three';

const group = new THREE.Group();

const origin = new THREE.Vector3( 0, 0, 0 );
const dir = new THREE.Vector3( 1, 2, 0 );
dir.normalize();

const arrowHelper = new THREE.ArrowHelper( dir, origin, 400, 'red' );
group.add( arrowHelper );

const dir2 = new THREE.Vector3( 1, -2, 0 );
dir2.normalize();

const arrowHelper2 = new THREE.ArrowHelper( dir2, origin, 400, 'red' );
group.add( arrowHelper2 );

console.log(dir.dot(dir2) < 0 ? '钝角' : '锐角')

export default group;
