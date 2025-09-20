import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

export const loadPromise = loader.loadAsync("./Michelle.glb");

loadPromise.then(gltf => {
    mesh.add(gltf.scene);

    gltf.scene.scale.setScalar(150);
})

export default mesh;

