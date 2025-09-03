import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./Michelle.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);

    gltf.scene.scale.setScalar(150);

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const clipAction = mixer.clipAction(gltf.animations[0]);
    clipAction.play();
    clipAction.paused = true;

    const clock = new THREE.Clock();
    function render() {
        requestAnimationFrame(render);

        const delta = clock.getDelta();
        mixer.update(delta);

        const pageNo = window.scrollY /window.innerHeight;
        if(pageNo >= 3.5 && pageNo < 6.5) {
            const percent = (window.scrollY / window.innerHeight - 3.5)/3;
            clipAction.time = gltf.animations[0].duration * percent;
        }
    }
    render();

})

export default mesh;
