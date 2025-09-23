import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./town.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.scale.setScalar(20);
    mesh.add(gltf.scene);

    const box = new THREE.Box3();
    box.expandByObject(gltf.scene);

    const size = box.getSize(new THREE.Vector3());

    for(let i = 1; i <= 4; i++) {
        const newTown = gltf.scene.clone();
        mesh.add(newTown);
        newTown.position.x  = (size.x -  330) * i;
    }
    for(let i = 0; i < 5; i++) {
        const newTown = gltf.scene.clone();
        mesh.add(newTown);
        newTown.position.x  = (size.x -  350) * i;
        newTown.position.z  = size.z - 470;
        newTown.rotation.y = Math.PI;
    }
})

export default mesh;
