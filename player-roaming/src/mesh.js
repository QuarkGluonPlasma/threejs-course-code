import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

let changeAction;
export {
    changeAction
}

loader.load("./Soldier.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.set(100, 100, 100);

    const mixer = new THREE.AnimationMixer(mesh);

    const walkAction = mixer.clipAction(gltf.animations[3]);
    walkAction.play();
    const idleAction = mixer.clipAction(gltf.animations[0]);
    idleAction.play();

    walkAction.weight = 0;
    idleAction.weight = 1;

    changeAction = (toIdle) => {
        if(toIdle) {
            let obj = {
                w: 0
            }
            gsap .to(obj, {
                w: 1,
                duration: 2,
                ease: 'none',
                repeat: 0,
                onUpdate() {
                    idleAction.weight = obj.w;
                    walkAction.weight = 1- obj.w;
                }
            });
        } else {
            let obj = {
                w: 0
            }
             gsap .to(obj, {
                w: 1,
                duration: 2,
                ease: 'none',
                repeat: 0,
                onUpdate() {
                    walkAction.weight = obj.w;
                    idleAction.weight = 1- obj.w;
                }
            });
        }
    }

    const clock = new THREE.Clock();
    function render() {
        const delta = clock.getDelta();
        mixer.update(delta);

        requestAnimationFrame(render);
    }

    render();
})

export default mesh;
