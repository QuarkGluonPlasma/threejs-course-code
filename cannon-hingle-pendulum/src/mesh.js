import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const group = new THREE.Group();

const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
group.add(groundMesh);

const groundBody = new CANNON.Body({ mass: 0 });
groundBody.addShape(new CANNON.Plane());
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

const pivotY = 5;
const pivotGeo = new THREE.SphereGeometry(0.15, 16, 16);
const pivotMat = new THREE.MeshPhongMaterial({ color: 'blue' });
const pivotMesh = new THREE.Mesh(pivotGeo, pivotMat);
pivotMesh.position.set(0, pivotY, 0);
group.add(pivotMesh);

const pivotBody = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, pivotY, 0) });
pivotBody.addShape(new CANNON.Sphere(0.15));
world.addBody(pivotBody);

const pendulumRadius = 0.3;
const ropeLength = 3;
const pendulumY = pivotY - ropeLength;

const pendulumGeo = new THREE.SphereGeometry(pendulumRadius, 32, 32);
const pendulumMat = new THREE.MeshPhongMaterial({ color: 'orange' });
const pendulumMesh = new THREE.Mesh(pendulumGeo, pendulumMat);
pendulumMesh.position.set(0, pendulumY, 0);
pendulumMesh.castShadow = true;
group.add(pendulumMesh);

const pendulumBody = new CANNON.Body({
    mass: 2,
    position: new CANNON.Vec3(0, pendulumY, 0),
});
pendulumBody.addShape(new CANNON.Sphere(pendulumRadius));
world.addBody(pendulumBody);

// 铰链约束：连接固定点和摆锤
const hingeAxis = new CANNON.Vec3(0, 0, 1);
const hinge = new CANNON.HingeConstraint(pivotBody, pendulumBody, {
  pivotA: new CANNON.Vec3(0, 0, 0),
  pivotB: new CANNON.Vec3(0, ropeLength, 0),
  axisA: hingeAxis,
  axisB: hingeAxis
});
world.addConstraint(hinge);

const ropeMat = new THREE.LineBasicMaterial({ color: 'white' });
const ropeGeo = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, pivotY, 0),
  new THREE.Vector3(0, pendulumY, 0)
]);
const ropeLine = new THREE.Line(ropeGeo, ropeMat);
group.add(ropeLine);

function animate() {
    requestAnimationFrame(animate);
    world.fixedStep();
  
    pendulumMesh.position.copy(pendulumBody.position);
    pendulumMesh.quaternion.copy(pendulumBody.quaternion);
  
    const positions = ropeLine.geometry.attributes.position;
    positions.setXYZ(0, pivotMesh.position.x, pivotMesh.position.y, pivotMesh.position.z);
    positions.setXYZ(1, pendulumMesh.position.x, pendulumMesh.position.y, pendulumMesh.position.z);
    positions.needsUpdate = true;  
}

animate();

const impulse = new CANNON.Vec3(15, 0, 0);
pendulumBody.applyImpulse(impulse, pendulumBody.position);

export default group;
