import * as THREE from 'three';

const bone1 = new THREE.Bone();
const bone2 = new THREE.Bone();
const bone3 = new THREE.Bone();

bone1.add(bone2);
bone2.add(bone3);

bone1.position.x = 100;

bone2.position.y = 100;
bone3.position.y = 50;

const pos = new THREE.Vector3();
bone3.getWorldPosition(pos);
console.log(pos);

const group = new THREE.Group();
group.add(bone1);

bone1.rotateZ(Math.PI/4);
bone2.rotateZ(-Math.PI/4);

const skeletonHelper = new THREE.SkeletonHelper(group);

group.add(skeletonHelper);

export default group;
