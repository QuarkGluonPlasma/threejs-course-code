import * as THREE from 'three';
import foundation from './foundation.js';
import sideWall from './side-wall.js';
import behindWall from './behind-wall.js';
import frontWall from './front-wall.js';
import roof from './roof.js';
import doorstep from './doorstep.js';

const house = new THREE.Group();

const sideWall2 = sideWall.clone();

sideWall.rotateY(Math.PI / 2);
sideWall.translateZ(-2000);
sideWall.translateX(1500);
sideWall.translateY(150);

sideWall2.rotateY(Math.PI / 2);
sideWall2.translateZ(1900);
sideWall2.translateX(1500);
sideWall2.translateY(150);

house.add(foundation);
house.add(sideWall);
house.add(sideWall2);
house.add(behindWall);
house.add(frontWall);
house.add(roof);
house.add(doorstep);

const roof2 = roof.clone();
roof2.rotateX( 70 / 180 * Math.PI);
roof2.position.z = -roof.position.z;

house.add(roof2);

export default house;
