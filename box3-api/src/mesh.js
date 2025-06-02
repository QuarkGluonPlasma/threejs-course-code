import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

async function main() {
    const gltf = await loader.loadAsync("./Michelle.glb");
    console.log(gltf);

    gltf.scene.scale.setScalar(150);
    mesh.add(gltf.scene);

    const box = new THREE.Box3();
    // box.expandByObject(gltf.scene);
    box.setFromObject(gltf.scene);

    const xSize = box.max.x - box.min.x;
    const ySize= box.max.y - box.min.y;
    const zSize = box.max.z - box.min.z;

    gltf.scene.position.y = - ySize / 2 + 20;
    gltf.scene.position.z = - zSize / 2;
    console.log(xSize, ySize, zSize);

    const v = new THREE.Vector3();
    box.getSize(v);
    console.log(v);

    const helper1 = new THREE.BoxHelper(gltf.scene);
    mesh.add(helper1);

    const box2 = new THREE.Box3();
    box2.expandByObject(gltf.scene);

    // box2.expandByScalar(100);

    const v2 = new THREE.Vector3();
    box2.getSize(v2);
    console.log(v2);

    const helper2 = new THREE.Box3Helper(box2, 'red');
    mesh.add(helper2);

    const gltf2 = await loader.loadAsync("./duck.glb");
    console.log(gltf2);

    gltf2.scene.scale.setScalar(500);
    mesh.add(gltf2.scene);

    gltf2.scene.position.z = 10;

    const helper3 = new THREE.BoxHelper(gltf2.scene);
    mesh.add(helper3);

    const box3 = new THREE.Box3();
    box3.setFromObject(gltf2.scene);

    console.log('是否碰撞', box2.intersectsBox(box3));

    // const intersectBox = box2.intersect(box3);
    // const size = intersectBox.getSize(new THREE.Vector3());
    // console.log('相交部分大小',size);

    // const unionBox = box2.union(box3);
    // const helper4 = new THREE.Box3Helper(unionBox, 'green');
    // mesh.add(helper4);
    // const size = unionBox.getSize(new THREE.Vector3());
    // console.log('并集大小',size);

    const group = new THREE.Group();
    group.add(gltf.scene, gltf2.scene);
    mesh.add(group);

    const box4 = new THREE.Box3();
    box4.setFromObject(group);
    
    const helper5 = new THREE.Box3Helper(box4, 'green');
    mesh.add(helper5);
    const size = box4.getSize(new THREE.Vector3());
    console.log('并集大小',size);

    console.log(box4.getCenter(new THREE.Vector3()));
}
main();

export default mesh;
