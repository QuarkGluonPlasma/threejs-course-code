import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();

const point1 = new THREE.Vector3(0, 0, 0);
const point2 = new THREE.Vector3(0, 100, 0);
const point3 = new THREE.Vector3(100, 0, 0);
geometry.setFromPoints([point1, point2, point3]);

const colors = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

// const material = new THREE.PointsMaterial({
//     vertexColors:true,
//     size: 30,
// });

// const points = new THREE.Points(geometry, material);

// export default points;


// const material = new THREE.LineBasicMaterial({
//     vertexColors: true
// });

// const line = new THREE.LineLoop(geometry, material);

// export default line;

const material = new THREE.MeshBasicMaterial({
    vertexColors: true
});

const mesh = new THREE.Mesh(geometry, material);

export default mesh;
