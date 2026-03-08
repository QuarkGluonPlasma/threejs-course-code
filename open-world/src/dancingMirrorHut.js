/**
 * 镜屋 - 四面镜子
 */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { world } from './mesh.js';
import { loadingManager } from './loading.js';

const group = new THREE.Group();

const hutOffsetX = 20;
const hutOffsetY = 0;
const hutOffsetZ = -20;

const mirrorHeight = 2.5;
const roomSize = 6;
const mirrorWidth = roomSize; // 与边长一致，四面围合无空隙
const mirrorRadius = roomSize / 2;

const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xd4c5a9, side: THREE.DoubleSide });

function createMirror() {
  const geometry = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);
  const mirror = new Reflector(geometry, {
    textureWidth: 2048,
    textureHeight: 2048
  });

  mirror.position.set(hutOffsetX + mirrorRadius, hutOffsetY + mirrorHeight / 2, hutOffsetZ);
  mirror.rotateY(-Math.PI / 2);
  mirror.castShadow = false;
  mirror.receiveShadow = true;

  return mirror;
}

const wallThickness = 0.3;
const mirrorWallGap = 0.02; // 避免镜子和墙重叠导致闪烁

function createBackWall() {
  const geometry = new THREE.BoxGeometry(mirrorWidth, mirrorHeight, wallThickness);
  const wall = new THREE.Mesh(geometry, wallMaterial);
  wall.position.set(hutOffsetX + mirrorRadius + mirrorWallGap + wallThickness / 2, hutOffsetY + mirrorHeight / 2, hutOffsetZ);
  wall.rotateY(-Math.PI / 2);
  wall.castShadow = true;
  wall.receiveShadow = true;
  return wall;
}

group.add(createMirror());
group.add(createBackWall());

// 镜子前面加载 Michelle 跳舞
const dancerRadius = 0.4;
const dancerHeight = 1.4;
let dancerMixer = null;
let dancerBody = null;

new GLTFLoader(loadingManager).load('./Michelle.glb', (gltf) => {
  const dancer = gltf.scene;
  dancer.scale.setScalar(0.8);
  dancer.position.set(hutOffsetX, hutOffsetY, hutOffsetZ);
  dancer.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  group.add(dancer);

  const dancerDialogEl = document.getElementById('dancerDialog');
  if (dancerDialogEl) {
    const dancerDialogObj = new CSS2DObject(dancerDialogEl);
    dancerDialogObj.position.set(0, dancerHeight + 0.3, 0);
    dancer.add(dancerDialogObj);
    dancerDialogEl.style.display = 'none';
  }

  dancerBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(hutOffsetX, dancerHeight / 2, hutOffsetZ)
  });
  dancerBody.addShape(new CANNON.Cylinder(dancerRadius, dancerRadius, dancerHeight, 8));
  world.addBody(dancerBody);

  dancerMixer = new THREE.AnimationMixer(dancer);
  if (gltf.animations[0]) {
    dancerMixer.clipAction(gltf.animations[0]).setLoop(THREE.LoopRepeat).play();
  }
});

const dancerClock = new THREE.Clock();
export function updateDancingMirrorHut() {
  if (dancerMixer) {
    dancerMixer.update(dancerClock.getDelta());
  }
}

const wallPosX = hutOffsetX + mirrorRadius + mirrorWallGap + wallThickness / 2;
const wallPosY = hutOffsetY + mirrorHeight / 2;
const wallPosZ = hutOffsetZ;
const wallBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(wallPosX, wallPosY, wallPosZ),
  quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
});
wallBody.addShape(new CANNON.Box(new CANNON.Vec3(mirrorWidth / 2, mirrorHeight / 2, wallThickness / 2)));
world.addBody(wallBody);

export const dancingMirrorHutPosition = { x: hutOffsetX, z: hutOffsetZ };
export { group as dancingMirrorHut };

export default group;
