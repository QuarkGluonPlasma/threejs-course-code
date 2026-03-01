import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { world } from './mesh.js';
import { loadComputer } from './computer.js';

const group = new THREE.Group();

const houseOffsetX = -20;
const houseOffsetY = 0;
const houseOffsetZ = -20;

const roomWidth = 6;
const roomDepth = 8;
const wallHeight = 3;
const wallThickness = 0.25;
const doorOpeningWidth = 1.2;

const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xd4c5a9 });

// === 前墙（有门）===
// 左边墙
const leftWallWidth = (roomWidth - doorOpeningWidth) / 2;
const leftWallGeo = new THREE.BoxGeometry(leftWallWidth, wallHeight, wallThickness);
const leftWallMesh = new THREE.Mesh(leftWallGeo, wallMaterial);
leftWallMesh.position.set(
  houseOffsetX + (-roomWidth / 2 + leftWallWidth / 2),
  houseOffsetY + wallHeight / 2,
  houseOffsetZ + 0
);
leftWallMesh.castShadow = true;
leftWallMesh.receiveShadow = true;
group.add(leftWallMesh);

const leftWallBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + (-roomWidth / 2 + leftWallWidth / 2),
    houseOffsetY + wallHeight / 2,
    houseOffsetZ + 0
  )
});
leftWallBody.addShape(new CANNON.Box(new CANNON.Vec3(leftWallWidth / 2, wallHeight / 2, wallThickness / 2)));
world.addBody(leftWallBody);

// 右边墙
const rightWallMesh = new THREE.Mesh(leftWallGeo, wallMaterial);
rightWallMesh.position.set(
  houseOffsetX + (roomWidth / 2 - leftWallWidth / 2),
  houseOffsetY + wallHeight / 2,
  houseOffsetZ + 0
);
rightWallMesh.castShadow = true;
rightWallMesh.receiveShadow = true;
group.add(rightWallMesh);

const rightWallBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + (roomWidth / 2 - leftWallWidth / 2),
    houseOffsetY + wallHeight / 2,
    houseOffsetZ + 0
  )
});
rightWallBody.addShape(new CANNON.Box(new CANNON.Vec3(leftWallWidth / 2, wallHeight / 2, wallThickness / 2)));
world.addBody(rightWallBody);

// 门框上方
const topFrameHeight = wallHeight - 2;
const topFrameGeo = new THREE.BoxGeometry(doorOpeningWidth, topFrameHeight, wallThickness);
const topFrameMesh = new THREE.Mesh(topFrameGeo, wallMaterial);
topFrameMesh.position.set(
  houseOffsetX + 0,
  houseOffsetY + (wallHeight - topFrameHeight / 2),
  houseOffsetZ + 0
);
topFrameMesh.castShadow = true;
topFrameMesh.receiveShadow = true;
group.add(topFrameMesh);

const topFrameBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + 0,
    houseOffsetY + (wallHeight - topFrameHeight / 2),
    houseOffsetZ + 0
  )
});
topFrameBody.addShape(new CANNON.Box(new CANNON.Vec3(doorOpeningWidth / 2, topFrameHeight / 2, wallThickness / 2)));
world.addBody(topFrameBody);

// === 后墙（有窗户 - 使用 Shape + ExtrudeGeometry）===
const windowWidth = 1.5;
const windowHeight = 1.2;
const windowY = 1.6;

// 创建后墙的形状（外轮廓）
const backWallShape = new THREE.Shape();
backWallShape.moveTo(-roomWidth / 2, 0);
backWallShape.lineTo(roomWidth / 2, 0);
backWallShape.lineTo(roomWidth / 2, wallHeight);
backWallShape.lineTo(-roomWidth / 2, wallHeight);
backWallShape.lineTo(-roomWidth / 2, 0);

// 创建窗户孔洞（内轮廓）
const windowHole = new THREE.Path();
const windowLeft = -windowWidth / 2;
const windowRight = windowWidth / 2;
const windowBottom = windowY - windowHeight / 2;
const windowTop = windowY + windowHeight / 2;

windowHole.moveTo(windowLeft, windowBottom);
windowHole.lineTo(windowRight, windowBottom);
windowHole.lineTo(windowRight, windowTop);
windowHole.lineTo(windowLeft, windowTop);
windowHole.lineTo(windowLeft, windowBottom);

// 将孔洞添加到形状
backWallShape.holes.push(windowHole);

// 使用 ExtrudeGeometry 创建带孔的墙
const extrudeSettings = {
  depth: wallThickness,
  bevelEnabled: false
};

const backWallGeo = new THREE.ExtrudeGeometry(backWallShape, extrudeSettings);
const backWallMesh = new THREE.Mesh(backWallGeo, wallMaterial);

// 旋转和定位墙体
backWallMesh.rotation.y = Math.PI;
backWallMesh.position.set(
  houseOffsetX + 0,
  houseOffsetY + 0,
  houseOffsetZ + (-roomDepth + wallThickness)
);
backWallMesh.castShadow = true;
backWallMesh.receiveShadow = true;
group.add(backWallMesh);

// 物理刚体
const backLeftWidth = (roomWidth - windowWidth) / 2;

// 后墙左侧刚体
const backLeftBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + (-roomWidth / 2 + backLeftWidth / 2),
    houseOffsetY + wallHeight / 2,
    houseOffsetZ + (-roomDepth)
  )
});
backLeftBody.addShape(new CANNON.Box(new CANNON.Vec3(backLeftWidth / 2, wallHeight / 2, wallThickness / 2)));
world.addBody(backLeftBody);

// 后墙右侧刚体
const backRightBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + (roomWidth / 2 - backLeftWidth / 2),
    houseOffsetY + wallHeight / 2,
    houseOffsetZ + (-roomDepth)
  )
});
backRightBody.addShape(new CANNON.Box(new CANNON.Vec3(backLeftWidth / 2, wallHeight / 2, wallThickness / 2)));
world.addBody(backRightBody);

// 窗户下方刚体
const windowBottomHeight = windowY - windowHeight / 2;
const windowBottomBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + 0,
    houseOffsetY + windowBottomHeight / 2,
    houseOffsetZ + (-roomDepth)
  )
});
windowBottomBody.addShape(new CANNON.Box(new CANNON.Vec3(windowWidth / 2, windowBottomHeight / 2, wallThickness / 2)));
world.addBody(windowBottomBody);

// 窗户上方刚体
const windowTopHeight = wallHeight - (windowY + windowHeight / 2);
const windowTopBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + 0,
    houseOffsetY + (wallHeight - windowTopHeight / 2),
    houseOffsetZ + (-roomDepth)
  )
});
windowTopBody.addShape(new CANNON.Box(new CANNON.Vec3(windowWidth / 2, windowTopHeight / 2, wallThickness / 2)));
world.addBody(windowTopBody);

// === 左侧墙 ===
const sideWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth);
const leftSideWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
leftSideWallMesh.position.set(
  houseOffsetX + (-roomWidth / 2),
  houseOffsetY + wallHeight / 2,
  houseOffsetZ + (-roomDepth / 2)
);
leftSideWallMesh.castShadow = true;
leftSideWallMesh.receiveShadow = true;
group.add(leftSideWallMesh);

const leftSideWallBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + (-roomWidth / 2),
    houseOffsetY + wallHeight / 2,
    houseOffsetZ + (-roomDepth / 2)
  )
});
leftSideWallBody.addShape(new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, roomDepth / 2)));
world.addBody(leftSideWallBody);

// === 右侧墙 ===
const rightSideWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
rightSideWallMesh.position.set(
  houseOffsetX + (roomWidth / 2),
  houseOffsetY + wallHeight / 2,
  houseOffsetZ + (-roomDepth / 2)
);
rightSideWallMesh.castShadow = true;
rightSideWallMesh.receiveShadow = true;
group.add(rightSideWallMesh);

const rightSideWallBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + (roomWidth / 2),
    houseOffsetY + wallHeight / 2,
    houseOffsetZ + (-roomDepth / 2)
  )
});
rightSideWallBody.addShape(new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, roomDepth / 2)));
world.addBody(rightSideWallBody);

// === 屋顶 ===
const roofGeo = new THREE.BoxGeometry(roomWidth, 0.15, roomDepth);
const roofMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 });
const roofMesh = new THREE.Mesh(roofGeo, roofMat);
roofMesh.position.set(
  houseOffsetX + 0,
  houseOffsetY + wallHeight,
  houseOffsetZ + (-roomDepth / 2)
);
roofMesh.receiveShadow = true;
roofMesh.castShadow = true;
group.add(roofMesh);

const roofBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    houseOffsetX + 0,
    houseOffsetY + wallHeight,
    houseOffsetZ + (-roomDepth / 2)
  )
});
roofBody.addShape(new CANNON.Box(new CANNON.Vec3(roomWidth / 2, 0.075, roomDepth / 2)));
world.addBody(roofBody);

// === 加载显示器和桌子模型 ===
loadComputer(group, houseOffsetX, houseOffsetY, houseOffsetZ, roomDepth);

// === 门 ===
const doorWidth = 1.2;
const doorHeight = 2;
const doorThickness = 0.08;

// 门的铰链在左侧门框边缘
const hingeX = houseOffsetX + (-doorOpeningWidth / 2);
const doorCenterX = hingeX + doorWidth / 2;
const doorY = houseOffsetY + doorHeight / 2;
// 门放在墙框内侧（+Z方向），这样可以向两边完全打开
const doorZ = houseOffsetZ + (wallThickness / 2 + doorThickness / 2 + 0.02);

const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
const doorMat = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
const doorMesh = new THREE.Mesh(doorGeo, doorMat);
doorMesh.position.set(doorCenterX, doorY, doorZ);
doorMesh.castShadow = true;
doorMesh.receiveShadow = true;
group.add(doorMesh);

const doorBody = new CANNON.Body({
  mass: 10,
  position: new CANNON.Vec3(doorCenterX, doorY, doorZ),
  angularDamping: 0.5,
  linearDamping: 0.05
});
doorBody.addShape(new CANNON.Box(new CANNON.Vec3(doorWidth / 2, doorHeight / 2, doorThickness / 2)));
world.addBody(doorBody);

// 门框柱子（固定铰链的位置）- 放在门框内侧
const doorFrameRadius = 0.08;
const doorFrameGeo = new THREE.CylinderGeometry(doorFrameRadius, doorFrameRadius, doorHeight, 8);
const doorFrameMat = new THREE.MeshPhongMaterial({ color: 0x6d4c41 });
const doorFrameMesh = new THREE.Mesh(doorFrameGeo, doorFrameMat);
doorFrameMesh.position.set(hingeX, doorY, doorZ);
doorFrameMesh.castShadow = true;
group.add(doorFrameMesh);

const doorFrameBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(hingeX, doorY, doorZ)
});
// 使用极小的碰撞体，几乎不影响门的旋转
doorFrameBody.addShape(new CANNON.Cylinder(0.02, 0.02, doorHeight, 8));
world.addBody(doorFrameBody);

// 铰链约束
const hinge = new CANNON.HingeConstraint(doorFrameBody, doorBody, {
  pivotA: new CANNON.Vec3(0, 0, 0),
  pivotB: new CANNON.Vec3(-doorWidth / 2, 0, 0),
  axisA: new CANNON.Vec3(0, 1, 0),
  axisB: new CANNON.Vec3(0, 1, 0),
  collideConnected: false,
  maxForce: 1e8
});
world.addConstraint(hinge);

export function setDoorState({ x, y, z, qx, qy, qz, qw }) {
  doorBody.position.set(x, y, z);
  doorBody.quaternion.set(qx, qy, qz, qw);
  doorBody.velocity.set(0, 0, 0);
  doorBody.angularVelocity.set(0, 0, 0);
}

export default group;
export { doorMesh, doorBody };