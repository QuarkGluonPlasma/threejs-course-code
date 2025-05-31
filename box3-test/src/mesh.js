import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

loader.load("./Michelle.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.scale.setScalar(150);
    mesh.add(gltf.scene);

    const helper = new THREE.BoxHelper(gltf.scene, 'pink');
    mesh.add(helper);

    const box = new THREE.Box3();
    box.expandByObject(gltf.scene);

    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;
    const depth = box.max.z - box.min.z;
    
    console.log('模型大小：', {
        width: width,
        height: height,
        depth: depth
    });

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({
        color: 'orange',
        transparent: true,
        opacity: 0.5
    });
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh.add(mesh2);
    mesh2.position.y = height / 2;

    const ringGeometry = new THREE.RingGeometry( width / 2, width /2 + 10);
    const ringMaterial = new THREE.MeshBasicMaterial( { 
        color: 'green',
        side: THREE.DoubleSide 
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    mesh.add(ring);
    ring.position.y = height / 2;
    ring.rotateX(Math.PI / 2);
})

export default mesh;
