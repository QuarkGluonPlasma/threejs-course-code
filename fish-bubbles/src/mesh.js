import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import bubbles from './bubbles';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./fish.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);

    gltf.scene.scale.setScalar(100);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const clipAction = mixer.clipAction(gltf.animations[0]);
    clipAction.play();

    const clock = new THREE.Clock();
    function render() {
        requestAnimationFrame(render);

        const delta = clock.getDelta();
        mixer.update(delta);
    }
    render();

    const fish1 = gltf.scene.getObjectByName("BrownFishArmature_13");
    const fish2 = gltf.scene.getObjectByName("ClownFishArmature_23");
    const fish3 = gltf.scene.getObjectByName("TunaArmature_33");
    const fish4 = gltf.scene.getObjectByName("DoryArmature_47");

    fish1.parent.remove(fish1, fish3, fish4);

    fish2.name = 'fish';

    const box3 = new THREE.Box3();
    box3.setFromObject(fish2);

    const size = box3.getSize(new THREE.Vector3());

    const tl = gsap.timeline();

    fish2.rotation.y = 0;
    tl.to(fish2.position, {
        duration: 5,
        z: -10,
        onUpdate: () => {
            const emitter = bubbles.getObjectByName('emitter');
            emitter.visible = true;
            emitter.position.z = fish2.position.z * 100 - size.x * 100 / 2;
        }
    }).to(fish2.rotation, {
        y: Math.PI,
        duration: 1,
        onUpdate: () => {
            const emitter = bubbles.getObjectByName('emitter');
            emitter.visible = false;
        }
    }).to(fish2.position, {
        z: 0,
        duration: 5,
        onUpdate: () => {
            const emitter = bubbles.getObjectByName('emitter');
            emitter.visible = true;
            emitter.position.z = fish2.position.z * 100 + size.x * 100 / 2;
        }
    }).to(fish2.rotation, {
        y: 0,
        duration: 1,
        onUpdate: () => {
            const emitter = bubbles.getObjectByName('emitter');
            emitter.visible = false;
        }
    }).repeat(Infinity);
})

export default mesh;
