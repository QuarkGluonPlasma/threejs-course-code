import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const group = new THREE.Group();

export const loadPromise = loader.loadAsync("./car.glb");

loadPromise.then(gltf => {
    group.add(gltf.scene);
    console.log(gltf);

    gltf.scene.position.set(0, 0, 10);
})

export default group;

