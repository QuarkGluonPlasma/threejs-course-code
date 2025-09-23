import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./Soldier.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.scale.setScalar(20);
    mesh.add(gltf.scene);

    const mixer = new THREE.AnimationMixer(mesh);

    const walkAction = mixer.clipAction(gltf.animations[3]);
    walkAction.play();

    const clock = new THREE.Clock();
    function render() {
        const delta = clock.getDelta();
        mixer.update(delta);

        requestAnimationFrame(render);
    }

    render();

});

export default mesh;
