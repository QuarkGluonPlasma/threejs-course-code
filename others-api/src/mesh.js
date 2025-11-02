import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(100, 100, 100);
const material1 = new THREE.MeshPhongMaterial({ color: 'orange' });
const material2 = new THREE.MeshPhongMaterial({ color: 'cyan' });
const material3 = new THREE.MeshPhongMaterial({ color: 'lime' });

const mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.set(-200, 0, 0);

const mesh2 = new THREE.Mesh(geometry, material2);
mesh2.position.set(0, 0, 0);

const mesh3 = new THREE.Mesh(geometry, material3);
mesh3.position.set(200, 0, 0);

const x = THREE.MathUtils.degToRad(90);
const y = THREE.MathUtils.degToRad(60);
const z = THREE.MathUtils.degToRad(30);

const euler1 = new THREE.Euler(x, y, z, 'XYZ');
mesh1.setRotationFromEuler(euler1);

const euler2 = new THREE.Euler(x, y, z, 'ZYX');
mesh2.setRotationFromEuler(euler2);


const angle = THREE.MathUtils.degToRad(30);
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
const euler = new THREE.Euler();
euler.setFromQuaternion(quaternion);
mesh3.setRotationFromEuler(euler);

const euler3 = new THREE.Euler(THREE.MathUtils.degToRad(45), 0, 0);
const quaternion3 = new THREE.Quaternion();
quaternion3.setFromEuler(euler3);
console.log('From Euler:', quaternion3);

const q1 = new THREE.Quaternion();
q1.setFromEuler(new THREE.Euler(0, 0, 0));

const q2 = new THREE.Quaternion();
q2.setFromEuler(new THREE.Euler(0, THREE.MathUtils.degToRad(90), 0));

const q = new THREE.Quaternion();
q.slerpQuaternions(q1, q2, 0.3);

console.log('Slerp result:', q);

const e = new THREE.Euler();
e.setFromQuaternion(q);
console.log('angle y:', THREE.MathUtils.radToDeg(e.y));


const v1 = new THREE.Vector3(1, 0, 0);
const v2 = new THREE.Vector3(0, 1, 0);
const q3 = new THREE.Quaternion();
q3.setFromUnitVectors(v1, v2);
console.log('From vectors:', q3);

// const v = new THREE.Vector3(angle, 0, 0);
// euler.setFromVector3(v);
// mesh3.setRotationFromEuler(euler);


// const m = new THREE.Matrix4();
// // 绕Z轴旋转60度 (cos60°=0.5, sin60°=√3/2≈0.8660)
// m.elements = [
//     0.5,   0.8660, 0, 0,  // 第一列
//    -0.8660, 0.5,   0, 0,  // 第二列
//     0,     0,      1, 0,  // 第三列
//     0,     0,      0, 1   // 第四列
// ];
// euler.setFromRotationMatrix(m);
// mesh3.setRotationFromEuler(euler);

const group = new THREE.Group();
group.add(mesh1);
group.add(mesh2);
group.add(mesh3);


// 创建单位矩阵
const matrix = new THREE.Matrix4();
console.log('单位矩阵:', matrix);
matrix.set(
    2, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, 2
);
console.log(matrix);


export default group;
