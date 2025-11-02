import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(100, 100, 100);
const material = new THREE.MeshPhongMaterial({
    color: 'orange'
})
const mesh = new THREE.Mesh(geometry, material);

const translateMatrix = new THREE.Matrix4().makeTranslation(100, 0, 0);
const rotateMatrix = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(THREE.MathUtils.degToRad(45), 0, 0)
);

const q1 = new THREE.Quaternion();
q1.setFromEuler(new THREE.Euler(0, 0, 0));

const q2 = new THREE.Quaternion();
q2.setFromEuler(new THREE.Euler(0, THREE.MathUtils.degToRad(90), 0));

const q = new THREE.Quaternion();
q.slerpQuaternions(q1, q2, 0.3);

const rotateMatrix2 = new THREE.Matrix4();
rotateMatrix2.makeRotationFromQuaternion(q);

const scaleMatrix = new THREE.Matrix4().makeScale(1, 3, 1);

// 组合矩阵：注意顺序是从右到左应用
// 先缩放，再旋转，最后平移
// const matrix = new THREE.Matrix4();
// matrix.multiplyMatrices(translateMatrix, rotateMatrix); 
// matrix.multiplyMatrices(matrix, scaleMatrix); 

const rotateMatrix3 = new THREE.Matrix4();

const axis = new THREE.Vector3(0, 0, 1);
rotateMatrix3.makeRotationAxis(axis, Math.PI / 4);

translateMatrix.multiply(rotateMatrix3).multiply(scaleMatrix);

mesh.applyMatrix4(translateMatrix);


const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();

translateMatrix.decompose(position, quaternion, scale);
console.log('Position:', position);
console.log('Rotation:', quaternion);
console.log('Scale:', scale);


export default mesh;
