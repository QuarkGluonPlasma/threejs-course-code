import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./pig.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);

    gltf.scene.scale.setScalar(5);

    const box = new THREE.Box3();
    box.expandByObject(gltf.scene);

    const xSize = box.max.x - box.min.x;
    const ySize= box.max.y - box.min.y;
    const zSize = box.max.z - box.min.z;

    gltf.scene.position.y = - ySize / 2 + 20;
    gltf.scene.position.z = - zSize / 2;
    console.log(xSize, ySize, zSize);

    const helper = new THREE.BoxHelper(gltf.scene);
    // mesh.add(helper);
})

export default mesh;