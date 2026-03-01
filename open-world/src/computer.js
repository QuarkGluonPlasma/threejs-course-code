import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DObject } from 'three/examples/jsm/Addons.js';
import * as CANNON from 'cannon-es';
import { world } from './mesh.js';
import { loadingManager } from './loading.js';

const loader = new GLTFLoader(loadingManager);

let css3dObj = null;
let monitorPosition = null;

// 检查玩家是否靠近电脑
export function isNearComputer(characterModel) {
    if (!characterModel || !monitorPosition) return false;
    
    const characterPos = characterModel.position;
    
    const distance = Math.sqrt(
        Math.pow(characterPos.x - monitorPosition.x, 2) +
        Math.pow(characterPos.z - monitorPosition.z, 2)
    );
    
    return distance < 2; // 2米范围内
}

// 进入电脑模式
export function enterComputerView(camera, scene, css3Renderer, characterModel) {
    if (css3dObj) {
        css3dObj.visible = true;
    }
    
    // 隐藏玩家
    if (characterModel) {
        characterModel.visible = false;
    }
    
    // 退出鼠标锁定模式
    if (document.pointerLockElement === document.body) {
        document.exitPointerLock();
    }
    
    // 将相机从人物组下移除，添加到场景下
    if (camera.parent) {
        camera.parent.remove(camera);
    }
    scene.add(camera);
    
    // 设置相机固定位置（在屏幕正前方）
    if (monitorPosition && css3dObj) {
        // CSS3D对象的位置是相对于显示器模型的局部坐标
        // position.y = 2, position.x = -0.16, scale = 0.01
        // 屏幕中心的世界坐标
        const screenCenterX = monitorPosition.x - 0.16 * 0.01;
        const screenCenterY = monitorPosition.y + 2 * 0.01;
        const screenCenterZ = monitorPosition.z;
        
        // 相机位置：屏幕右侧，距离约0.6米，再向上一点
        camera.position.set(
            screenCenterX + 0.6,  // 屏幕右侧（X轴正方向）
            screenCenterY + 0.3,  // 再向上一点
            screenCenterZ        // 与屏幕Z坐标相同
        );
        // 朝左看向屏幕中心上方一点
        camera.lookAt(screenCenterX, screenCenterY + 0.2, screenCenterZ);
    }
}

// 退出电脑模式
export function exitComputerView(camera, characterModel, css3Renderer) {
    if (css3dObj) {
        css3dObj.visible = false;
    }
    
    // 显示玩家
    if (characterModel) {
        characterModel.visible = true;
    }
    
    // 隐藏浏览器 iframe
    const browserIframe = document.querySelector('#desktop .browser');
    if (browserIframe) {
        browserIframe.style.display = 'none';
    }
    
    // CSS3DRenderer 的 domElement 应该保持 pointer-events: 'none'
    // 不需要手动设置
    
    // 将相机从场景下移除，添加回人物组
    if (camera.parent) {
        camera.parent.remove(camera);
    }
    if (characterModel) {
        characterModel.add(camera);
        // 恢复为人物行走时的相机设置
        camera.position.set(0, 1.5, 2.5);
        camera.rotation.set(0, 0, 0);
        camera.up.set(0, 1, 0);
    }
}

export function loadComputer(group, houseOffsetX, houseOffsetY, houseOffsetZ, roomDepth) {
    monitorPosition = new THREE.Vector3(
        houseOffsetX + 0,
        houseOffsetY + 1,
        houseOffsetZ + (-roomDepth / 2)
    );

    loader.load("./monitor.glb", function (gltf) {
        console.log(gltf);
        gltf.scene.scale.set(0.5, 0.5, 0.5);

        // 将显示器放置在房子内部
        gltf.scene.position.copy(monitorPosition);
        
        group.add(gltf.scene);

        const ele = document.getElementById('desktop');
        if (ele) {
            css3dObj = new CSS3DObject(ele);
            css3dObj.rotateX(-Math.PI / 2);
            css3dObj.scale.set(0.01, 0.01, 0.01);
            css3dObj.position.y = 2;
            css3dObj.position.x = -0.16;
            
            css3dObj.visible = false;

            gltf.scene.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    
                    if (obj.name === 'Object_5') {
                        obj.add(css3dObj);
                    }
                }
            });
        }
    });

    loader.load("./desk.glb", function (gltf) {
        // console.log(gltf);
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.rotateY(Math.PI / 2);
        
        // 将桌子放置在房子内部，显示器下方
        const deskX = houseOffsetX + 0;
        const deskY = houseOffsetY + 1;
        const deskZ = houseOffsetZ + (-roomDepth / 2);
        
        gltf.scene.position.set(deskX, deskY, deskZ);
        
        group.add(gltf.scene);

        gltf.scene.traverse(obj => {
            obj.receiveShadow = true;
        });

        // 计算桌子的边界框来确定物理体大小
        const box = new THREE.Box3();
        box.setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // 创建桌子的物理刚体
        const deskBody = new CANNON.Body({
            mass: 0, // 静态物体，质量为0
            position: new CANNON.Vec3(center.x, center.y, center.z)
        });
        deskBody.addShape(new CANNON.Box(new CANNON.Vec3(
            size.x / 2,
            size.y / 2,
            size.z / 2
        )));
        world.addBody(deskBody);

        // 可视化物理刚体 - 创建线框盒子
        // const helperGeo = new THREE.BoxGeometry(size.x, size.y, size.z);
        // const helperMat = new THREE.MeshBasicMaterial({
        //     color: 0x00ff00,
        //     wireframe: true,
        //     transparent: true,
        //     opacity: 0.5
        // });
        // const helperMesh = new THREE.Mesh(helperGeo, helperMat);
        // helperMesh.position.copy(center);
        // group.add(helperMesh);
    });
}
