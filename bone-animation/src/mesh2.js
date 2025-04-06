import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./Michelle.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.set(100, 100, 100);

    const helper = new THREE.SkeletonHelper(gltf.scene);
    mesh.add(helper);

    // gltf.scene.traverse(obj => {
    //     if(obj.isBone && obj.name === "mixamorigSpine2") {
    //         obj.rotateX(-Math.PI / 3);
    //     }
    // })

    const track1 = new THREE.KeyframeTrack('mixamorigSpine2.position', [0, 3], [0, 0, 0, 0, 0, 30]);
    const clip = new THREE.AnimationClip("bbb", 3, [track1]);

    const mixer = new THREE.AnimationMixer(mesh);
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