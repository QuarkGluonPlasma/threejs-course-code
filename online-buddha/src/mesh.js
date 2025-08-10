import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const buddha = new THREE.Group();

export const loadPromise = loader.loadAsync("./buddha.glb");

loadPromise.then(gltf => {
    buddha.add(gltf.scene);
    console.log(gltf);

    gltf.scene.scale.setScalar(50);

    const box = new THREE.BoxHelper(gltf.scene);
    // buddha.add(box);

    gltf.scene.traverse(obj => {
        if(obj.isMesh) {
            console.log(obj.name, obj);
            obj.material.color.set('gold');
        }
    })

    buddha.rotateY(Math.PI);
    buddha.name = 'buddha';
})

export default buddha;

