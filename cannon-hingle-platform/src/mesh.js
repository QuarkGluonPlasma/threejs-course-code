import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const group = new THREE.Group();

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x203a43 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
group.add(groundMesh);

const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(new CANNON.Plane());
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

const pillarHeight = 2;
const pillarRadius = 0.3;
const pillarGeo = new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 16);
const pillarMat = new THREE.MeshPhongMaterial({ color: 0x607d8b, metalness: 0.5 });
const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
pillarMesh.position.set(0, pillarHeight / 2, 0);
group.add(pillarMesh);

const pillarBody = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, pillarHeight / 2, 0) });
pillarBody.addShape(new CANNON.Cylinder(pillarRadius, pillarRadius, pillarHeight, 16));
world.addBody(pillarBody);

const platformRadius = 3;
const platformHeight = 0.2;
const platformY = pillarHeight;

const platformGeo = new THREE.CylinderGeometry(platformRadius, platformRadius, platformHeight);
const platformMat = new THREE.MeshPhongMaterial({ color: 0x00bcd4 });
const platformMesh = new THREE.Mesh(platformGeo, platformMat);
platformMesh.position.set(0, platformY, 0);
group.add(platformMesh);

const platformBody = new CANNON.Body({
    mass: 5,
    position: new CANNON.Vec3(0, platformY, 0)
});
platformBody.addShape(new CANNON.Cylinder(platformRadius, platformRadius, platformHeight, 32));
world.addBody(platformBody);

const hingeAxis = new CANNON.Vec3(0, 1, 0);
const hinge = new CANNON.HingeConstraint(pillarBody, platformBody, {
  pivotA: new CANNON.Vec3(0, pillarHeight / 2, 0),
  pivotB: new CANNON.Vec3(0, 0, 0),
  axisA: hingeAxis,
  axisB: hingeAxis
});
world.addConstraint(hinge);

const boxes = [];

function addBox() {
  const boxSize = 0.5;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * (platformRadius - 0.5);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = platformY + platformHeight / 2 + boxSize / 2 + 0.1;

  const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const boxMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
  });
  const boxMesh = new THREE.Mesh(boxGeo, boxMat);
  boxMesh.position.set(x, y, z);
  boxMesh.castShadow = true;
  group.add(boxMesh);

  const boxBody = new CANNON.Body({
    mass: 0.5,
    position: new CANNON.Vec3(x, y, z)
  });
  boxBody.addShape(new CANNON.Box(new CANNON.Vec3(boxSize / 2, boxSize / 2, boxSize / 2)));
  world.addBody(boxBody);

  boxes.push({ mesh: boxMesh, body: boxBody });
}

for (let i = 0; i < 5; i++) {
  addBox();
}

function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
  
    platformMesh.position.copy(platformBody.position);
    platformMesh.quaternion.copy(platformBody.quaternion);
  
    boxes.forEach(box => {
      box.mesh.position.copy(box.body.position);
      box.mesh.quaternion.copy(box.body.quaternion);
    });  
}

animate();

platformBody.angularVelocity.y += 3;

export default group;

