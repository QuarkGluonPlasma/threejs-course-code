import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { camera } from './main';
import * as CANNON from 'cannon-es';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const group = new THREE.Group();

const groundSize = 100;
const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x90a955 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
group.add(groundMesh);

const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(new CANNON.Plane());
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

function createBox(x, y, z, width, height, depth, color) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshPhongMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);

    const body = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(x, y, z)
    });
    body.addShape(new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)));
    world.addBody(body);
}

function createStairs(x, y, z, stepCount, stepWidth, stepDepth, stepHeight, color, platformDepth = 2) {
    const stairsGroup = new THREE.Group();

    // 创建每一级台阶（实心结构）
    for (let i = 0; i < stepCount; i++) {
        // 当前台阶的总高度（
        const currentHeight = (i + 1) * stepHeight;

        // 创建实心台阶
        const stepGeo = new THREE.BoxGeometry(stepWidth, currentHeight, stepDepth);
        const stepMat = new THREE.MeshPhongMaterial({ color });
        const stepMesh = new THREE.Mesh(stepGeo, stepMat);

        // 台阶位置：高度中心在一半高度，Z轴在对应位置
        stepMesh.position.set(
            0,
            currentHeight / 2,
            i * stepDepth + stepDepth / 2
        );

        stepMesh.castShadow = true;
        stepMesh.receiveShadow = true;

        stairsGroup.add(stepMesh);
    }

    // 创建楼梯顶部的平台
    const totalStairsHeight = stepCount * stepHeight;
    const platformGeo = new THREE.BoxGeometry(stepWidth, totalStairsHeight, platformDepth);
    const platformMat = new THREE.MeshPhongMaterial({ color });
    const platformMesh = new THREE.Mesh(platformGeo, platformMat);

    platformMesh.position.set(
        0,
        totalStairsHeight / 2,
        stepCount * stepDepth + platformDepth / 2
    );

    platformMesh.castShadow = true;
    platformMesh.receiveShadow = true;

    stairsGroup.add(platformMesh);

    stairsGroup.position.set(x, y, z);
    group.add(stairsGroup);

    // 物理效果：创建一个斜坡碰撞体（楼梯部分）
    const totalDepth = stepCount * stepDepth;
    const rampThickness = 0.1; // 斜坡的厚度

    // 斜坡上端应该和平台表面高度一致
    const totalHeight = totalStairsHeight; // 斜坡顶端和平台顶面平齐
    const rampLength = Math.sqrt(totalHeight * totalHeight + totalDepth * totalDepth);

    // 计算倾斜角度（相对于水平面）
    const angle = Math.atan2(totalHeight, totalDepth);

    // 计算斜坡中心位置
    // Y坐标：考虑旋转后底端面要贴在地面
    const rampCenterY = y + (rampLength / 2) * Math.sin(angle) - (rampThickness / 2) * Math.cos(angle);
    // Z坐标：斜坡从地面起点(z)开始，上端到达平台前边缘(z + totalDepth)
    const rampCenterZ = z + totalDepth / 2;

    const rampBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(x, rampCenterY, rampCenterZ)
    });

    // 创建一个盒子作为斜坡
    const rampShape = new CANNON.Box(new CANNON.Vec3(stepWidth / 2, rampThickness / 2, rampLength / 2));
    rampBody.addShape(rampShape);

    // 旋转斜坡：绕X轴旋转，使其倾斜
    rampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -angle);

    world.addBody(rampBody);

    // 平台的物理碰撞体（顶面应该和斜坡顶端高度一致）
    const platformThickness = 0.2;
    const platformBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(
            x,
            y + totalStairsHeight - platformThickness / 2, // 平台顶面高度
            z + stepCount * stepDepth + platformDepth / 2
        )
    });
    platformBody.addShape(new CANNON.Box(new CANNON.Vec3(stepWidth / 2, platformThickness / 2, platformDepth / 2)));
    world.addBody(platformBody);

    // 可视化物理斜坡（调试用）
    const rampVisualGeo = new THREE.BoxGeometry(stepWidth, rampThickness, rampLength);
    const rampVisualMat = new THREE.MeshPhongMaterial({
        color: 'green',
        transparent: true,
        opacity: 0.3,
        wireframe: false
    });
    const rampVisualMesh = new THREE.Mesh(rampVisualGeo, rampVisualMat);
    rampVisualMesh.position.set(x, rampCenterY, rampCenterZ);
    rampVisualMesh.rotation.x = -angle;
    group.add(rampVisualMesh);
}

// 创建楼梯
// createStairs(x, y, z, 台阶数量, 台阶宽度, 台阶深度, 台阶高度, 颜色, 平台深度)
createStairs(10, 0, 10, 10, 4, 0.5, 0.2, 0x8b7355, 10);

// 创建几个障碍物
createBox(5, 1, 0, 2, 2, 2, 0xff6b6b);
createBox(-5, 1.5, -5, 3, 3, 3, 0x4ecdc4);
createBox(0, 0.5, -10, 4, 1, 4, 0xffe66d);
createBox(8, 1, -8, 2, 2, 2, 0x95e1d3);
createBox(-8, 1.5, -3, 2, 3, 2, 0xf38181);

// 创建墙壁（边界）
const wallHeight = 4;
const wallThickness = 0.5;

// 前墙
createBox(0, wallHeight / 2, groundSize / 2, groundSize, wallHeight, wallThickness, 0xd4c5a9);
// 后墙
createBox(0, wallHeight / 2, -groundSize / 2, groundSize, wallHeight, wallThickness, 0xd4c5a9);
// 左墙
createBox(-groundSize / 2, wallHeight / 2, 0, wallThickness, wallHeight, groundSize, 0xd4c5a9);
// 右墙
createBox(groundSize / 2, wallHeight / 2, 0, wallThickness, wallHeight, groundSize, 0xd4c5a9);

// 玩家物理体（圆柱体，模拟人物碰撞体积）
const playerRadius = 0.25;
const playerHeight = 1.8;
const playerBody = new CANNON.Body({
  mass: 80,
  position: new CANNON.Vec3(0, playerHeight / 2, 0),
  linearDamping: 0.9,
  angularDamping: 0.99,
  fixedRotation: true
});
playerBody.addShape(new CANNON.Cylinder(playerRadius, playerRadius, playerHeight, 16));
world.addBody(playerBody);

let characterModel = null;
let mixer = null;
let idleAction = null;
let walkAction = null;
let currentAction = null;


const gltfLoader = new GLTFLoader();
gltfLoader.load('./Soldier.glb', (gltf) => {
  characterModel = gltf.scene;
  characterModel.scale.setScalar(0.8);
  characterModel.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  group.add(characterModel);

  mixer = new THREE.AnimationMixer(characterModel);

  idleAction = mixer.clipAction(gltf.animations[0]);
  walkAction = mixer.clipAction(gltf.animations[3]);

  currentAction = idleAction;

  characterModel.add(camera);

  // 设置相机相对人物的位置（局部坐标）
  camera.position.set(0, 1.5, 2.5); // 在人物后上方
  camera.lookAt(0, 1, 0);

  idleAction.play();

  // const clock = new THREE.Clock();
  // function render() {
  //     requestAnimationFrame(render);

  //     const delta = clock.getDelta();
  //     mixer.update(delta);
  // }
  // render();
});


const keyPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === ' ') {
    keyPressed.space = true;
  } else if (key in keyPressed) {
    keyPressed[key] = true;
  }
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === ' ') {
    keyPressed.space = false;
  } else if (key in keyPressed) {
    keyPressed[key] = false;
  }
});

let isPointerLocked = false;

const minCameraAngle = THREE.MathUtils.degToRad(-20);
const maxCameraAngle = THREE.MathUtils.degToRad(20);

document.addEventListener('mousedown', () => {
  document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  isPointerLocked = document.pointerLockElement === document.body;
});

document.addEventListener('mousemove', (e) => {
  if (!isPointerLocked || !characterModel) return;

  characterModel.rotation.y -= e.movementX / 500;

  camera.rotation.x -= e.movementY / 500;

  if (camera.rotation.x > maxCameraAngle) {
    camera.rotation.x = maxCameraAngle;
  }
  if (camera.rotation.x < minCameraAngle) {
    camera.rotation.x = minCameraAngle;
  }
});

const moveSpeed = 10;
const airControlSpeed = 1.5;
const jumpForce = 1000;

function updatePlayerMovement(deltaTime) {
  if (!characterModel) return;

    // 检测是否在地面或物体上
  const physicsVelocity = playerBody.velocity;
  const velocityY = Math.abs(physicsVelocity.y);
  const isOnGround = velocityY < 1.0;

  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

  let isMoving = false;
  const moveDirection = new THREE.Vector3(0, 0, 0);

  if (keyPressed.w) {
    moveDirection.add(forward);
    isMoving = true;
  }
  if (keyPressed.s) {
    moveDirection.add(forward.clone().negate());
    isMoving = true;
  }
  if (keyPressed.a) {
    const leftDir = right;
    moveDirection.add(leftDir);
    isMoving = true;
  }
  if (keyPressed.d) {
    const rightDir = right.clone().negate();
    moveDirection.add(rightDir);
    isMoving = true;
  }

  if (isMoving) {
    moveDirection.normalize();
    if (isOnGround) {
      // 地面上
      playerBody.velocity.x = moveDirection.x * moveSpeed;
      playerBody.velocity.z = moveDirection.z * moveSpeed;
    } else {
      // 空中
      playerBody.velocity.x = moveDirection.x * airControlSpeed;
      playerBody.velocity.z = moveDirection.z * airControlSpeed;
    }
  } else if (isOnGround) {
    playerBody.velocity.x = 0;
    playerBody.velocity.z = 0;
  }

  if (mixer) {
    if (isMoving && currentAction !== walkAction) {
      if (currentAction) currentAction.stop();
      walkAction.play();
      currentAction = walkAction;
    } else if (!isMoving && currentAction !== idleAction) {
      if (currentAction) currentAction.stop();
      idleAction.play();
      currentAction = idleAction;
    }
  }

  if (keyPressed.space) {
    const physicsVelocity = playerBody.velocity;
    const velocityY = Math.abs(physicsVelocity.y);

    if (velocityY < 1.0) {
      playerBody.applyImpulse(new CANNON.Vec3(0, jumpForce, 0), playerBody.position);
    }
  }
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  world.fixedStep();
  const dt = Math.min(clock.getDelta(), 0.1);

  updatePlayerMovement(dt);

  if (mixer) {
    mixer.update(dt);
  }

  if (characterModel) {
    characterModel.position.copy(playerBody.position);
    characterModel.position.y -= playerHeight / 2;
  }
}

animate();

export default group;
