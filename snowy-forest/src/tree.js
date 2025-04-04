import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const tree = new THREE.Group();

const loader = new GLTFLoader();

function loadTree(callback) {
    loader.load('./tree/tree.gltf', gltf => {
        console.log(gltf);
    
        gltf.scene.scale.set(10, 10, 10);

        tree.add(gltf.scene);
    
        gltf.scene.traverse(obj => {

            if(obj.isMesh) {
                obj.castShadow = true;
                if(obj.name === "leaves001") {
                    obj.material.color.set('green');
                } else {
                    obj.material.color.set('brown');
                }
            }
        });
        callback(tree);
    });
}

export default loadTree;
