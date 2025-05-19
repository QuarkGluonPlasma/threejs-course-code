import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);

const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.y = 300;

const mesh = new THREE.Group();
mesh.add(plane);
mesh.add(box);

const world = new CANNON.World();
world.gravity.set(0, -200, 0);

const boxShape = new CANNON.Box(new CANNON.Vec3(25, 25, 25));
const boxCannonMaterial = new CANNON.Material();
const boxBody = new CANNON.Body({
    shape: boxShape,
    mass: 1,
    material: boxCannonMaterial
});
boxBody.position.set(0, 300, 0)
world.addBody(boxBody);

const planeShape = new CANNON.Plane();
const planeCannonMaterial = new CANNON.Material();
const planeBody = new CANNON.Body({
    shape: planeShape,
    mass: 0,
    material: planeCannonMaterial
});
planeBody.position.set(0, 0, 0);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

const contactMaterial = new CANNON.ContactMaterial(
    boxCannonMaterial,
    planeCannonMaterial,
    {
        friction: 0.2, // 摩擦力
        restitution: 0.6 // 弹性
    }
);
world.addContactMaterial(contactMaterial);

function render() {
    world.fixedStep();

    box.position.copy(boxBody.position);

    requestAnimationFrame(render);
}
render();

export default mesh;
