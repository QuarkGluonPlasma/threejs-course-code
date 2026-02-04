import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import { world } from './mesh.js';
import { camera, isCarView } from './main.js';

const loader = new GLTFLoader();

const group = new THREE.Group();

// 车的位置和尺寸
const carSize = { width: 2, height: 1.31, depth: 5 }; // 车的碰撞盒尺寸
const carPosition = { x: 0, y: carSize.height / 2, z: 10 };

// 创建车的物理碰撞体
const carBody = new CANNON.Body({
    mass: 1500, // 车的质量（千克），可以移动
    position: new CANNON.Vec3(carPosition.x, carPosition.y, carPosition.z),
    linearDamping: 0.9, // 增加线性阻尼
    angularDamping: 0.9, // 增加角度阻尼
    fixedRotation: false, // 允许旋转
    linearFactor: new CANNON.Vec3(1, 0, 1), // 限制Y轴移动，只能在XZ平面移动
    angularFactor: new CANNON.Vec3(0, 1, 0) // 只允许绕Y轴旋转
});
carBody.addShape(new CANNON.Box(new CANNON.Vec3(
    carSize.width / 2,
    carSize.height / 2,
    carSize.depth / 2
)));
world.addBody(carBody);

export { carBody };

// 可视化碰撞盒（调试用）
// const carBoxGeo = new THREE.BoxGeometry(carSize.width, carSize.height, carSize.depth);
// const carBoxMat = new THREE.MeshPhongMaterial({
//     color: 0xff0000,
//     transparent: true,
//     opacity: 0.3,
//     wireframe: true
// });
// const carBoxMesh = new THREE.Mesh(carBoxGeo, carBoxMat);
// carBoxMesh.position.set(carPosition.x, carPosition.y, carPosition.z);
// group.add(carBoxMesh);

export const loadPromise = loader.loadAsync("./car.glb");

export let carModel = null;

loadPromise.then(gltf => {
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    carModel = gltf.scene;
    carModel.position.set(0, 0, 10);
    group.add(carModel);
    console.log(gltf);
})

// 车辆控制参数
const carSpeed = 15;
const carRotationSpeed = 2;

const minCameraAngle = THREE.MathUtils.degToRad(-20);
const maxCameraAngle = THREE.MathUtils.degToRad(20);

let isPointerLocked = false;

// 监听指针锁定状态
document.addEventListener('pointerlockchange', () => {
  isPointerLocked = document.pointerLockElement === document.body;
});

// 车辆鼠标控制
document.addEventListener('mousemove', (e) => {
  if (!isPointerLocked || !carModel || !isCarView) return;

  // 控制车辆左右旋转（通过物理体）
  const rotationChange = -e.movementX / 500;
  const currentRotation = new CANNON.Quaternion();
  currentRotation.copy(carBody.quaternion);
  const additionalRotation = new CANNON.Quaternion();
  additionalRotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationChange);
  carBody.quaternion = additionalRotation.mult(currentRotation);

  // 控制相机上下旋转
  camera.rotation.x -= e.movementY / 500;

  if (camera.rotation.x > maxCameraAngle) {
    camera.rotation.x = maxCameraAngle;
  }
  if (camera.rotation.x < minCameraAngle) {
    camera.rotation.x = minCameraAngle;
  }
});

// 车辆键盘控制
const keyPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};

window.addEventListener('keydown', (e) => {
  if (!isCarView) return;
  const key = e.key.toLowerCase();
  if (key === ' ') {
    keyPressed.space = true;
  } else if (key in keyPressed) {
    keyPressed[key] = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (!isCarView) return;
  const key = e.key.toLowerCase();
  if (key === ' ') {
    keyPressed.space = false;
  } else if (key in keyPressed) {
    keyPressed[key] = false;
  }
});

// 车辆移动更新函数
function updateCarMovement(deltaTime) {
  if (!carModel || !isCarView) return;

  // 获取车辆当前朝向
  const forward = new THREE.Vector3();
  carModel.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  // 重置角速度
  carBody.angularVelocity.set(0, 0, 0);

  // W/S - 前进/后退
  if (keyPressed.w) {
    carBody.velocity.x = forward.x * carSpeed;
    carBody.velocity.y = carBody.velocity.y; // 保持y轴速度，避免重力影响
    carBody.velocity.z = forward.z * carSpeed;

    // A/D - 左右转向（仅在前进时）
    if (keyPressed.a) {
      carBody.angularVelocity.y = carRotationSpeed;
    } else if (keyPressed.d) {
      carBody.angularVelocity.y = -carRotationSpeed;
    }
  } else if (keyPressed.s) {
    carBody.velocity.x = -forward.x * carSpeed;
    carBody.velocity.y = carBody.velocity.y; // 保持y轴速度
    carBody.velocity.z = -forward.z * carSpeed;

    // A/D - 左右转向（倒车时转向相反）
    if (keyPressed.a) {
      carBody.angularVelocity.y = -carRotationSpeed;
    } else if (keyPressed.d) {
      carBody.angularVelocity.y = carRotationSpeed;
    }
  } else {
    // 没有前进或后退时，停止移动
    carBody.velocity.x = 0;
    carBody.velocity.z = 0;
  }
}

// 动画循环 - 同步物理体和模型
function animateCar() {
  requestAnimationFrame(animateCar);

  if (carModel) {
    // 保持车辆在地面上，防止弹跳
    if (carBody.position.y < carSize.height / 2) {
      carBody.position.y = carSize.height / 2;
      carBody.velocity.y = 0;
    }

    // 同步车辆模型位置和旋转
    carModel.position.copy(carBody.position);
    carModel.position.y -= carSize.height / 2;
    carModel.quaternion.copy(carBody.quaternion);
  }

  updateCarMovement(0.016); // 约60fps
}

animateCar();

export default group;

