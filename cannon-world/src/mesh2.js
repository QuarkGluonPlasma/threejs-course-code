import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(- Math.PI / 2);

const xxxGeometry = new THREE.SphereGeometry(50, 3);
const xxxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
const xxx = new THREE.Mesh(xxxGeometry, xxxMaterial);
xxx.position.y = 300;

const mesh = new THREE.Group();
mesh.add(plane);
mesh.add(xxx);

const world = new CANNON.World();
world.gravity.set(0, -300, 0);

// const xxxShape = new CANNON.Sphere(50);
console.log(xxx.geometry);
const vertices = [];
const faces = [];
const positions = xxx.geometry.attributes.position;
for (let i = 0; i < positions.count; i ++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    vertices.push(new CANNON.Vec3(x, y, z));
}
const index = xxx.geometry.index;
for ( let i = 0; i < index.length; i += 3) {
    const index1 = index[i];
    const index2 = index[i + 1];
    const index3 = index[i + 2];
    faces.push([index1, index2, index3]);
}
const xxxShape = new CANNON.ConvexPolyhedron({ vertices, faces})

const xxxCannonMaterial = new CANNON.Material();
const xxxBody = new CANNON.Body({
    shape: xxxShape,
    mass: 1,
    material: xxxCannonMaterial
});
xxxBody.position.set(0, 300, 0)
world.addBody(xxxBody);

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
    xxxCannonMaterial,
    planeCannonMaterial,
    {
        friction: 0.2, // 摩擦力
        restitution: 0.6 // 弹性
    }
);
world.addContactMaterial(contactMaterial);

function render() {
    world.fixedStep();

    xxx.position.copy(xxxBody.position);
    xxx.quaternion.copy(xxxBody.quaternion);

    requestAnimationFrame(render);
}
render();

export default mesh;
