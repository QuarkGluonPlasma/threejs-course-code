import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const loader = new GLTFLoader();

const textureCube = new THREE.CubeTextureLoader()
    .setPath('./forest/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const mesh = new THREE.Group();

const gui = new GUI();
const body = gui.addFolder('车身');
const win = gui.addFolder('车窗');

loader.load("./car.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.scale.set(40, 40, 40);
    mesh.add(gltf.scene);

    gltf.scene.traverse((obj) => {
        if(obj.isMesh) {
            if(obj.material.isMeshPhysicalMaterial) {
                obj.material.envMap = textureCube;
                obj.material.envMapIntensity = 2;
            }

            if(obj.name ==='车身') {
                obj.material.color.set('white');
                obj.material.metalness = 0.9;
                obj.material.roughness = 0.2;
                obj.material.clearcoat = 1;
                obj.material.clearcoatRoughness = 0.1;
                body.addColor(obj.material, 'color');
                body.add(obj.material, 'metalness', 0, 1);
                body.add(obj.material, 'roughness', 0, 1);
                body.add(obj.material, 'clearcoat', 0, 1);
                body.add(obj.material, 'clearcoatRoughness', 0, 1);
            }

            if(obj.name === '车窗') {
                obj.material.color.set('#fff');
                obj.material.transmission= 1;
                obj.material.ior = 1.3;
                win.addColor(obj.material, 'color');
                win.add(obj.material, 'transmission', 0, 1);
                win.add(obj.material, 'ior', 1, 2.3);
                win.add(obj.material, 'metalness', 0, 1);
                win.add(obj.material, 'roughness', 0, 1);
            }
        }
    });
});

export default mesh;
