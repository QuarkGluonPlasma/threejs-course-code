import * as THREE from 'three';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

const group = new THREE.Group();

const gltfLoader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('./tshirt.glb', (gltf) => {
    group.add(gltf.scene);
    gltf.scene.scale.setScalar(1000);

    gltf.scene.traverse(obj => {
        if(obj.isMesh) {
            console.log(obj.name, obj);
        }
    })
});

export default group;
