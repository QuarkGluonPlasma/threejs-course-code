import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./Flamingo.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.set(3, 3, 3);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const clipAction = mixer.clipAction(gltf.animations[0]);
    clipAction.play();

    const clock = new THREE.Clock();
    function render() {
        const delta = clock.getDelta();
        mixer.update(delta);

        requestAnimationFrame(render);
    }
    render();
})

export default mesh;