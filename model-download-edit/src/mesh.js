import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./audi2.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.scale.set(3, 3, 3);
    mesh.add(gltf.scene);
    gltf.scene.traverse((obj) => {
        if(obj.isMesh) {
            console.log(obj.name, obj);

            if(obj.name === 'custom_hood_body_0') {
                // console.log(obj.material);
                obj.material.color.set('green');
                obj.material.metalness = 0;
                obj.material.roughness = 0.5;
            }
            if(obj.name === 'Doors014_glass_0') {
                console.log(obj.material);
                obj.material.color.set('orange');
            }
        }
    });
});

export default mesh;