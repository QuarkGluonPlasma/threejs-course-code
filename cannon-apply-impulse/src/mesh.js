import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { camera } from './main';

const world = new CANNON.World();
world.gravity.set(0, -20, 0);

const groundMaterial = new CANNON.Material('ground');
const boxMaterial = new CANNON.Material('box');
const sphereMaterial = new CANNON.Material('sphere');
const contactBox = new CANNON.ContactMaterial(groundMaterial, boxMaterial, {
  friction: 0.8,    // 摩擦力：越大越难滑动
  restitution: 0.1  // 弹性：0为不反弹，1为完全弹性
});
world.addContactMaterial(contactBox);
const contactSphereGround = new CANNON.ContactMaterial(groundMaterial, sphereMaterial, {
  friction: 0.4,
  restitution: 0.1
});
world.addContactMaterial(contactSphereGround);
const contactSphereBox = new CANNON.ContactMaterial(sphereMaterial, boxMaterial, {
  friction: 0.3,
  restitution: 0.1
});
world.addContactMaterial(contactSphereBox);

const group = new THREE.Group();

const planeGeometry = new THREE.PlaneGeometry(8000, 8000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);
plane.receiveShadow = true;
group.add(plane);

const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
groundBody.addShape(new CANNON.Plane());
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

const boxes = [];
const boxSize = 50;
const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const colorA = new THREE.Color('orange');
const colorB = new THREE.Color('yellow');

function addBoxAt(x, y, z) {
    const t = Math.random();
    const lerped = new THREE.Color().lerpColors(colorA, colorB, t);
    const mat = new THREE.MeshPhongMaterial({ color: lerped });
    const mesh = new THREE.Mesh(boxGeo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    group.add(mesh);

    const body = new CANNON.Body({
        mass: 3,
        material: boxMaterial,
        position: new CANNON.Vec3(x, y, z)
    });
    body.addShape(new CANNON.Box(new CANNON.Vec3(half, half, half)));
    world.addBody(body);
    boxes.push({ mesh, body });
}

const cols = 20;
const rows = 3;
const half = boxSize / 2;

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    const x = (i - (cols - 1) / 2) * boxSize;
    const y = half + j * boxSize;
    addBoxAt(x, y, -1000);
  }
}

const balls = [];
const geometry = new THREE.SphereGeometry(20);
const material = new THREE.MeshStandardMaterial({ 
    color: 'blue', 
    metalness: 0.8, 
    roughness: 0.2
});
function shootBallAt(x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 20, z);
    mesh.castShadow = true;
    group.add(mesh);
    const body = new CANNON.Body({
        mass: 10,
        material: sphereMaterial,
        position: new CANNON.Vec3(x, y + 20, z)
    });
    body.addShape(new CANNON.Sphere(20));
    world.addBody(body);
    balls.push({ mesh, body });

    const impulse = new CANNON.Vec3(0, 0, -5000);
    body.applyImpulse(impulse, body.position);
}

// shootBallAt(0, 0, 0);

const raycaster = new THREE.Raycaster();
const mousePos = new THREE.Vector2();
const shootPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
window.addEventListener('click', (event) => {
    mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePos, camera);

    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(shootPlane, hit)) {
        shootBallAt(hit.x, 1, hit.z);
    }
});

function render() {
    world.fixedStep();

    boxes.forEach(({ mesh, body }) => {
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
    });

    balls.forEach(({ mesh, body }) => {
      mesh.position.copy(body.position);
      mesh.quaternion.copy(body.quaternion);
    });

    requestAnimationFrame(render);
}
render();


export default group;
