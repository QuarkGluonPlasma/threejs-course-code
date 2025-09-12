import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./Soldier.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.set(100, 100, 100);

    const mixer = new THREE.AnimationMixer(mesh);

    const runAction = mixer.clipAction(gltf.animations[1]);
    runAction.play();
    const idleAction = mixer.clipAction(gltf.animations[0]);
    idleAction.play();

    runAction.weight = 0;
    idleAction.weight = 1;

    // setTimeout(() => {
    //     runAction.weight = 0;
    //     idleAction.weight = 1;
    // }, 3000);
    let obj = {
        w: 0
    }
    gsap.to(obj, {
        w: 1,
        duration: 3,
        ease: 'none',
        repeat: 0,
        onUpdate() {
            runAction.weight = obj.w;
            idleAction.weight = 1- obj.w;
        }
    });

    const clock = new THREE.Clock();
    function render() {
        const delta = clock.getDelta();
        mixer.update(delta);

        requestAnimationFrame(render);
    }

    render();
})

export default mesh;
