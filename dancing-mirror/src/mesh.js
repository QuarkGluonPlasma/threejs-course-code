import * as THREE from 'three';
import { GLTFLoader, Reflector } from 'three/examples/jsm/Addons.js';

const group = new THREE.Group();

function createGround() {
    const geometry = new THREE.PlaneGeometry(3000, 3000);
    const material = new THREE.MeshPhongMaterial({
        color: 'orange'
    })
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;
    return mesh;
}

group.add(createGround());

function createMirrors() {
    const mirrors = new THREE.Group();
    for(let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        const mirror = new Reflector(geometry);

        mirror.position.y = 500;
        mirror.position.x = 500 * Math.sin(i);
        mirror.position.z = 500 * Math.cos(i);
        mirror.rotateY(i);
        mirror.rotateY(-Math.PI);

        mirrors.add(mirror);
    }
    return mirrors;
}

group.add(createMirrors());


function loadDancer() {
    const dancer = new THREE.Group();
    const loader = new GLTFLoader();

    loader.load("./Michelle.glb", function (gltf) {
        console.log(gltf);
        dancer.add(gltf.scene);
        gltf.scene.scale.set(200, 200, 200);

        gltf.scene.traverse(obj => {
            obj.castShadow = true;
        })

        const mixer = new THREE.AnimationMixer(dancer);
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
    return dancer;
}

group.add(loadDancer());

export default group;

