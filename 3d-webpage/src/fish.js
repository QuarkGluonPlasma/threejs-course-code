import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./fish.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);

    gltf.scene.scale.setScalar(50);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const clipAction = mixer.clipAction(gltf.animations[0]);
    clipAction.play();
    clipAction.paused = true;

    // const gui = new GUI();
    // gui.add(clipAction, 'time', 0, gltf.animations[0].duration)

    const clock = new THREE.Clock();
    function render() {
        requestAnimationFrame(render);

        const delta = clock.getDelta();
        mixer.update(delta);

        const pageNo = Math.round(window.scrollY /window.innerHeight);
        if(pageNo === 3) {
            const percent = (window.scrollY / window.innerHeight - 2.5) / (1/5) % 1
            clipAction.time = gltf.animations[0].duration * percent;

            // console.log(percent)
        }
    }
    render();

    const fish1 = gltf.scene.getObjectByName("BrownFishArmature_13");
    const fish2 = gltf.scene.getObjectByName("ClownFishArmature_23");
    const fish3 = gltf.scene.getObjectByName("TunaArmature_33");
    const fish4 = gltf.scene.getObjectByName("DoryArmature_47");

    fish1.parent.remove(fish1, fish3, fish4);

    fish2.name = 'fish';

})

export default mesh;
