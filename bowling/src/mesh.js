import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as CANNON from 'cannon-es';

const world = new CANNON.World();
world.gravity.set(0, -20, 0);

const ballCannonMaterial = new CANNON.Material('ball');
const pinCannonMaterial = new CANNON.Material('pin');
const laneCannonMaterial = new CANNON.Material('lane');
const boundaryCannonMaterial = new CANNON.Material('boundary');

const ballBoundaryContact = new CANNON.ContactMaterial(
    ballCannonMaterial,
    boundaryCannonMaterial,
    { 
        friction: 0.6,      // 较高摩擦力，让球可以沿着墙壁滑动
        restitution: 0.0    // 不反弹
    }
);
world.addContactMaterial(ballBoundaryContact);
const ballPinContact = new CANNON.ContactMaterial(
    ballCannonMaterial,
    pinCannonMaterial,
    { 
        friction: 0.3,      // 适中摩擦力
        restitution: 0.0    // 不反弹
    }
);
world.addContactMaterial(ballPinContact);
const ballLaneContact = new CANNON.ContactMaterial(
    ballCannonMaterial,
    laneCannonMaterial,
    { 
        friction: 0.05,      // 摩擦力
        restitution: 0.0     // 弹性系数（0=不反弹，1=完全弹性碰撞）
    }
);
world.addContactMaterial(ballLaneContact);
const pinLaneContact = new CANNON.ContactMaterial(
    pinCannonMaterial,
    laneCannonMaterial,
    { friction: 0.4, restitution: 0.0 }
);
world.addContactMaterial(pinLaneContact);

const pinBoundaryContact = new CANNON.ContactMaterial(
    pinCannonMaterial,
    boundaryCannonMaterial,
    { friction: 0.6, restitution: 0.0 }
);
world.addContactMaterial(pinBoundaryContact);

const group = new THREE.Group();

const laneGeometry = new THREE.PlaneGeometry(100, 500);

const textureLoader = new THREE.TextureLoader();
const laneTexture = textureLoader.load('/ground.png');
laneTexture.colorSpace = THREE.SRGBColorSpace;
laneTexture.wrapS = THREE.RepeatWrapping;
laneTexture.wrapT = THREE.RepeatWrapping;
laneTexture.repeat.set(3, 10);
const laneMaterial = new THREE.MeshLambertMaterial({ map: laneTexture, side: THREE.DoubleSide });

const laneMesh = new THREE.Mesh(laneGeometry, laneMaterial);
laneMesh.rotation.x = -Math.PI / 2; 
group.add(laneMesh);

const laneShape = new CANNON.Plane();
const laneBody = new CANNON.Body({ mass: 0, material: laneCannonMaterial });
laneBody.addShape(laneShape);
laneBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(laneBody);

const boundaryMaterial = new THREE.MeshLambertMaterial({ color: '#cccccc' });

const leftBoundaryGeometry = new THREE.BoxGeometry(2, 20, 500);
const leftBoundary = new THREE.Mesh(leftBoundaryGeometry, boundaryMaterial);
leftBoundary.position.set(-100 / 2, 20 / 2, 0);
group.add(leftBoundary);

const leftBoundaryShape = new CANNON.Box(new CANNON.Vec3( 1, 10, 250));
const leftBoundaryBody = new CANNON.Body({ mass: 0, material: boundaryCannonMaterial });
leftBoundaryBody.addShape(leftBoundaryShape);
leftBoundaryBody.position.set(-100 / 2, 20 / 2, 0);
world.addBody(leftBoundaryBody);

const rightBoundaryGeometry = new THREE.BoxGeometry(2, 20, 500);
const rightBoundary = new THREE.Mesh(rightBoundaryGeometry, boundaryMaterial);
rightBoundary.position.set(100 / 2, 20 / 2, 0);
group.add(rightBoundary);

const rightBoundaryShape = new CANNON.Box(new CANNON.Vec3(1, 10, 250));
const rightBoundaryBody = new CANNON.Body({ mass: 0, material: boundaryCannonMaterial });
rightBoundaryBody.addShape(rightBoundaryShape);
rightBoundaryBody.position.set(100 / 2, 20 / 2, 0);
world.addBody(rightBoundaryBody);

const loader = new GLTFLoader();

const ball = {};
loader.load("./bowling_ball.glb", function (gltf) {
    gltf.scene.scale.setScalar(50);
    group.add(gltf.scene);

    const box = new THREE.Box3();
    box.expandByObject(gltf.scene);

    const size = box.getSize(new THREE.Vector3());
    console.log(size);

    gltf.scene.position.y = size.y / 2;
    gltf.scene.position.z = 200;

    const ballShape = new CANNON.Sphere(size.y / 2);
    const ballBody = new CANNON.Body({ mass: 3, material: ballCannonMaterial });
    ballBody.addShape(ballShape);
    ballBody.position.set(0, size.y / 2, 200);
    world.addBody(ballBody);
    
    ball.body = ballBody;
    ball.mesh = gltf.scene;

    // const impulse = new CANNON.Vec3(0, 0, -500);
    // ballBody.applyImpulse(impulse, ballBody.position);
});

const pins = [];

loader.load("./bowling_pin.glb", function (gltf) {
    gltf.scene.scale.setScalar(80);
    gltf.scene.position.z = -230;

    const box = new THREE.Box3();
    box.expandByObject(gltf.scene);

    const size = box.getSize(new THREE.Vector3());

    for(let i = 0; i < 9; i++) {
        const pin = gltf.scene.clone();
        pin.position.x = -40 + i * 10;
        group.add(pin);

       const pinShape = new CANNON.Cylinder(size.x * 0.6 / 2, size.x / 2, size.y / 2, 8);
       const pinBody = new CANNON.Body({
           mass: 1.5,
           material: pinCannonMaterial 
       });
       pinBody.addShape(pinShape);
       pinBody.position.set(-40 + i * 10, size.y / 2, -230);
       world.addBody(pinBody);
      
       pins.push({ body: pinBody, mesh: pin });
    }
});


function render() {
    world.fixedStep();

    if(ball.body && ball.mesh){
        ball.mesh.position.copy(ball.body.position);
        ball.mesh.quaternion.copy(ball.body.quaternion);
    }

    pins.forEach(({ body, mesh }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    requestAnimationFrame(render);
}
render();

let isDragging = false;
let dragStart = new THREE.Vector2();
let dragEnd = new THREE.Vector2();
let mouse = new THREE.Vector2();  
function setupMouseInteraction() {
  const canvas = document.querySelector('canvas');

  canvas.addEventListener('mousedown', (event) => {
      if (ball.body.position.z > 100) {
          isDragging = true;
          event.preventDefault();
          
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          dragStart.set(mouse.x, mouse.y);
          dragEnd.set(mouse.x, mouse.y);   
      }
  });

  canvas.addEventListener('mousemove', (event) => {
      if (isDragging) {
          event.preventDefault();
          
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          dragEnd.set(mouse.x, mouse.y);          
      }
  });

  canvas.addEventListener('mouseup', (event) => {
      if (isDragging) {
          event.preventDefault();
          isDragging = false;

          shootBall();
      }
  });
}

setTimeout(() => {
    setupMouseInteraction();
}, 0);

function shootBall() {
  console.log('shootBall', dragEnd, dragStart);

   const dragVector = new THREE.Vector2().subVectors(dragEnd, dragStart);
   const dragDistance = dragVector.length();
   
   // 如果拖拽距离太小，不发射（防止误触）
   if (dragDistance < 0.01) return;
   
   // 计算力度：拖拽距离 × 500，最大 2000
   // 这个系数决定了力度的大小，可以根据需要调整
   const force = Math.min(dragDistance * 500, 2000);
   
   // 计算发射方向
   const forwardComponent = Math.max(0.1, -dragVector.y);  // 向下拖拽 = 向前发射
   const sideComponent = dragVector.x;  // 左右拖拽 = 左右方向
   
   const direction = new CANNON.Vec3(
       sideComponent * 1.5,      // 左右方向系数
       0,                         // 不向上
       -forwardComponent * 1.2 - 0.5  // 向前方向系数
   );
   direction.normalize();  // 归一化，使方向向量长度为1
   
   // 重置球的速度和角速度（确保每次发射都是干净的状态）
   ball.body.velocity.set(0, 0, 0);
   ball.body.angularVelocity.set(0, 0, 0);
   
   // 应用冲量：方向 × 力度
   // applyImpulse 会在球的位置施加一个瞬间的力，使球开始运动
   ball.body.applyImpulse(direction.scale(force), ball.body.position);
  return;
}

export default group;
