import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();
const group = new THREE.Group();
export const loadPromise2 = loader.loadAsync("./flower.glb");

loadPromise2.then(gltf => {
    group.add(gltf.scene);

    gltf.scene.scale.setScalar(5000);
    gltf.scene.position.y = -2000;
});

export default group;
