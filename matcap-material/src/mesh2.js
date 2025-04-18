import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./matcap3.png');

loader.load("./duck.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.setScalar(3000);
    gltf.scene.position.y = -300;

    gltf.scene.traverse(obj => {
        if(obj.isMesh) {
            obj.material = new THREE.MeshMatcapMaterial({
                color: 'orange',
                matcap: texture
            })
        }
    })
})

export default mesh;