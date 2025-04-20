import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();
const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
dracoLoader.setDecoderPath('gltf/')
loader.setDRACOLoader(dracoLoader);

loader.load("./Michelle2.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.scale.setScalar(5);
    mesh.add(gltf.scene);
})

export default mesh;