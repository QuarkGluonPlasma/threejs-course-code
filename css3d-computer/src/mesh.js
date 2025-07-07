import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DObject } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./monitor.glb", function (gltf) {
    console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.set(300, 300, 300);

    const ele = document.getElementById('desktop');
    const css3dObj = new CSS3DObject(ele);
    css3dObj.rotateX(-Math.PI / 2);
    css3dObj.scale.set(0.01,0.01,0.01);
    css3dObj.position.y = 2;
    css3dObj.position.x = -0.16;

    gltf.scene.traverse(obj => {
        if(obj.isMesh) {
            console.log(obj.name, obj);

            if(obj.name === 'Object_5') {
                const helper = new THREE.AxesHelper(1000);
                // obj.add(helper);
                obj.add(css3dObj);
            }
        }
        obj.castShadow = true;
    });
})

loader.load("./desk.glb", function (gltf) {
    // console.log(gltf);
    mesh.add(gltf.scene);
    gltf.scene.scale.set(200, 200, 200);

    gltf.scene.rotateY(Math.PI / 2);

    gltf.scene.traverse(obj => {
        obj.receiveShadow = true;
    });
})

export default mesh;