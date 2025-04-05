import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const tree = new THREE.Group();

const loader = new GLTFLoader();

function loadTree(callback) {
    loader.load('./tree/tree.gltf', gltf => {
        console.log(gltf);
    
        tree.add(gltf.scene);

        callback(tree);
    });
}

export default loadTree;