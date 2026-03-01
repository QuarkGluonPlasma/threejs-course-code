import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import * as CANNON from 'cannon-es';
import { world } from './mesh.js';
import { loadingManager } from './loading.js';

const loader = new GLTFLoader(loadingManager);

const group = new THREE.Group();

// 人物的位置
const personPosition = { x: 5, y: 0, z: 5 }; // 放置在场景中的位置
const personRadius = 0.5; // 圆柱体半径
const personHeight = 1.5; // 圆柱体高度

// 创建人物的物理碰撞体
const personBody = new CANNON.Body({
    mass: 0, // 静态物体，质量为0
    position: new CANNON.Vec3(personPosition.x, personHeight / 2, personPosition.z)
});
personBody.addShape(new CANNON.Cylinder(
    personRadius,
    personRadius,
    personHeight,
    8 // 分段数
));
world.addBody(personBody);

export { personBody };

// 可视化物理刚体（调试用）
// const cylinderGeo = new THREE.CylinderGeometry(personRadius, personRadius, personHeight, 8);
// const cylinderMat = new THREE.MeshPhongMaterial({
//     color: 0xff0000,
//     transparent: true,
//     opacity: 0.3,
//     wireframe: true
// });
// const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
// cylinderMesh.position.set(personPosition.x, personHeight / 2, personPosition.z);
// group.add(cylinderMesh);

// 加载人物模型
export const loadPromise = loader.loadAsync("./person.glb");

export let personModel = null;

loadPromise.then(gltf => {
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    gltf.scene.scale.setScalar(0.35);
    gltf.scene.position.set(personPosition.x, 0, personPosition.z);
    group.add(gltf.scene);
    
    personModel = gltf.scene;
    
    // 创建对话框
    const dialogElement = document.getElementById('personDialog');
    if (dialogElement) {
        const dialogObject = new CSS2DObject(dialogElement);
        dialogObject.position.set(0.5, personHeight + 0.5, 0); // 在人物头顶上方，向右调整
        gltf.scene.add(dialogObject);
        dialogElement.style.display = 'none'; // 默认隐藏
    }
    
    console.log('Person model loaded:', gltf);
});

export default group;
