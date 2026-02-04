import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import mesh, { characterModel, playerBody, playerHeight } from './mesh.js';
import car, { carModel, carBody } from './car.js';
import plane, { planeModel, planeBody } from './plane.js';
import house, { doorMesh, doorBody } from './house.js';
import person, { personModel, personBody } from './person.js';
import { isNearComputer, enterComputerView, exitComputerView } from './computer.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

scene.add(mesh);
scene.add(car);
scene.add(plane);
scene.add(house);
scene.add(person);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(20, 30, 10);
sun.castShadow = true;
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
scene.add(sun);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 200);
camera.position.set(0, 1.6, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)
renderer.shadowMap.enabled = true;

const css3Renderer = new CSS3DRenderer();
css3Renderer.setSize(width, height);
css3Renderer.domElement.style.position = 'absolute';
css3Renderer.domElement.style.top = '0px';
css3Renderer.domElement.style.left = '0px';
css3Renderer.domElement.style.pointerEvents = 'none';

const css2Renderer = new CSS2DRenderer();
  css2Renderer.setSize(width, height);
  css2Renderer.domElement.style.position = 'absolute';
  css2Renderer.domElement.style.top = '0px';
  css2Renderer.domElement.style.left = '0px';
  css2Renderer.domElement.style.pointerEvents = 'none';
  css2Renderer.domElement.style.zIndex = '1';

document.body.append(renderer.domElement);
document.body.append(css3Renderer.domElement);
document.body.append(css2Renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);

// 车辆视角切换
export let isCarView = false;

// 飞机视角切换
export let isPlaneView = false;

// 电脑视角切换
export let isComputerView = false;

// 对话状态
export let isTalking = false;

// 对话系统
const dialogueData = [
    { player: "你好！", npc: "哦，你好！看起来你是个战士？" },
    { player: "是的，我在执行任务。你坐在这里做什么？", npc: "哈哈，我在思考人生。这个桶很舒服，你要不要也坐坐？" },
    { player: "不了，我还有任务要完成。", npc: "任务？听起来很严肃。不过你知道吗，有时候停下来看看风景也不错。" },
    { player: "也许你说得对...但我得走了。", npc: "好吧，祝你好运！如果累了，随时可以回来找我聊天。" },
    { player: "谢谢！再见！", npc: "再见，战士！" }
];

let dialogueIndex = 0;

// 检查人物是否在车辆附近
function isNearCar() {
    if (!characterModel || !carBody) return false;

    const characterPos = characterModel.position;
    const carPos = carBody.position;

    const distance = Math.sqrt(
        Math.pow(characterPos.x - carPos.x, 2) +
        Math.pow(characterPos.z - carPos.z, 2)
    );

    return distance < 3; // 3米范围内
}

// 检查人物是否在飞机附近
function isNearPlane() {
    if (!characterModel || !planeBody) return false;

    const characterPos = characterModel.position;
    const planePos = planeBody.position;

    const distance = Math.sqrt(
        Math.pow(characterPos.x - planePos.x, 2) +
        Math.pow(characterPos.z - planePos.z, 2)
    );

    return distance < 3; // 3米范围内
}

// 检查玩家是否靠近NPC人物
function isNearPerson() {
    if (!characterModel || !personBody) return false;

    const characterPos = characterModel.position;
    const personPos = personBody.position;

    const distance = Math.sqrt(
        Math.pow(characterPos.x - personPos.x, 2) +
        Math.pow(characterPos.z - personPos.z, 2)
    );

    return distance < 3; // 3米范围内
}

// 更新提示文本
function updateViewTip() {
    const tipElement = document.getElementById('viewTip');
    if (!tipElement) return;

    if (isComputerView) {
        tipElement.textContent = '按 E 退出电脑';
    } else if (isCarView) {
        tipElement.textContent = '按 X 下车';
    } else if (isPlaneView) {
        // 检查飞机是否在地面
        if (planeBody) {
            const planeHeight = planeBody.position.y;
            const groundHeight = 1.15;
            if (planeHeight > groundHeight + 1) {
                tipElement.textContent = '空格键上升 | Shift键下降 | 请先降落再按 C 下飞机';
            } else {
                tipElement.textContent = '空格键上升 | Shift键下降 | 按 C 下飞机';
            }
        } else {
            tipElement.textContent = '按 C 下飞机';
        }
    } else if (isNearCar()) {
        tipElement.textContent = '按 X 上车';
    } else if (isNearPlane()) {
        tipElement.textContent = '按 C 上飞机';
    } else if (isNearPerson()) {
        if (isTalking) {
            if (dialogueIndex < dialogueData.length) {
                tipElement.textContent = '按 H 键继续对话 | 按 K 键结束对话';
            } else {
                tipElement.textContent = '对话结束，按 H 键重新开始 | 按 K 键结束对话';
            }
        } else {
            tipElement.textContent = '按 H 键开始对话';
        }
    } else if (isNearComputer(characterModel)) {
        tipElement.textContent = '按 E 打电脑';
    } else {
        tipElement.textContent = '靠近车辆按 X 上车 | 靠近飞机按 C 上飞机 | 靠近电脑按 E 打电脑';
    }
}

// 控制对话框显示和内容
function updateDialogs() {
    const personDialog = document.getElementById('personDialog');
    const playerDialog = document.getElementById('playerDialog');
    
    // 只有在对话状态且靠近人物时才显示对话框
    if (isTalking && isNearPerson() && !isCarView && !isPlaneView && !isComputerView) {
        if (personDialog && playerDialog) {
            // 显示当前对话内容
            if (dialogueIndex < dialogueData.length) {
                personDialog.textContent = dialogueData[dialogueIndex].npc;
                playerDialog.textContent = dialogueData[dialogueIndex].player;
                personDialog.style.display = 'block';
                playerDialog.style.display = 'block';
            } else {
                // 对话结束，隐藏对话框
                personDialog.style.display = 'none';
                playerDialog.style.display = 'none';
            }
        }
    } else {
        // 其他情况隐藏对话框
        if (personDialog) {
            personDialog.style.display = 'none';
        }
        if (playerDialog) {
            playerDialog.style.display = 'none';
        }
        // 如果远离人物，结束对话状态并重置
        if (!isNearPerson()) {
            isTalking = false;
            dialogueIndex = 0;
        }
    }
}

// 渲染循环
function render() {
    renderer.render(scene, camera);
    css3Renderer.render(scene, camera);
    css2Renderer.render(scene, camera);
    updateViewTip();
    updateDialogs();
    
    // 同步门的视觉和物理状态（保留物理效果）
    if (doorMesh && doorBody) {
        doorMesh.position.copy(doorBody.position);
        doorMesh.quaternion.copy(doorBody.quaternion);
    }
    
    requestAnimationFrame(render);
}

render();

// 窗口大小调整处理
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  css3Renderer.setSize(width, height);
  css2Renderer.setSize(width, height);
});

// 监听键盘事件
window.addEventListener('keydown', (event) => {
    if (event.key === 'x' || event.key === 'X') {
        if (isCarView) {
            // 在车辆视角时，可以随时下车
            isCarView = false;
            if (carModel && characterModel && carBody && playerBody) {
                carModel.remove(camera);

                // 显示人物模型
                characterModel.visible = true;

                // 将人物放置在车辆左边
                const carPosition = carBody.position;

                // 获取车辆的前进方向
                const forward = new THREE.Vector3();
                carModel.getWorldDirection(forward);
                forward.y = 0;
                forward.normalize();

                // 计算车辆左侧方向（前进方向顺时针旋转90度）
                const left = new THREE.Vector3(forward.z, 0, -forward.x);

                // 计算车辆左侧的位置（距离车辆2米）
                const leftOffset = 2;
                const leftX = carPosition.x + left.x * leftOffset;
                const leftZ = carPosition.z + left.z * leftOffset;

                // 更新人物物理体和模型位置
                playerBody.position.set(leftX, playerHeight / 2, leftZ);
                playerBody.velocity.set(0, 0, 0);
                characterModel.position.copy(playerBody.position);
                characterModel.position.y -= playerHeight / 2;

                // 设置人物朝向与车辆一致
                characterModel.rotation.y = carModel.rotation.y;

                characterModel.add(camera);
                // 恢复为人物行走时的相机设置
                camera.position.set(0, 1.5, 2.5);
                camera.rotation.set(0, 0, 0);
                camera.up.set(0, 1, 0);
            }
        } else if (isNearCar()) {
            // 只有在车辆附近才能上车
            isCarView = true;
            if (carModel && characterModel) {
                characterModel.remove(camera);

                // 隐藏人物模型
                characterModel.visible = false;

                carModel.add(camera);
                // 相机在车后面，看向车辆前进方向
                camera.position.set(0, 3, -6);
                camera.rotation.set(-0.1, Math.PI, 0); // 稍微向下看约6度，主要朝向前方
            }
        }
    } else if (event.key === 'c' || event.key === 'C') {
        if (isPlaneView) {
            // 在飞机视角时，需要先降落再下飞机
            if (planeModel && characterModel && planeBody && playerBody) {
                const planeHeight = planeBody.position.y;
                const groundHeight = 1.15; // 飞机在地面时的高度

                // 如果飞机在空中（高于地面1米以上），提示需要先降落
                if (planeHeight > groundHeight + 1) {
                    return;
                }

                // 飞机在地面或接近地面时，可以下飞机
                isPlaneView = false;
                planeModel.remove(camera);

                // 显示人物模型
                characterModel.visible = true;

                // 将人物放置在飞机左边
                const planePosition = planeBody.position;

                // 获取飞机的前进方向
                const forward = new THREE.Vector3();
                planeModel.getWorldDirection(forward);
                forward.y = 0;
                forward.normalize();

                // 计算飞机左侧方向（前进方向顺时针旋转90度）
                const left = new THREE.Vector3(forward.z, 0, -forward.x);

                // 计算飞机左侧的位置（距离飞机2米）
                const leftOffset = 2;
                const leftX = planePosition.x + left.x * leftOffset;
                const leftZ = planePosition.z + left.z * leftOffset;

                // 更新人物物理体和模型位置
                playerBody.position.set(leftX, playerHeight / 2, leftZ);
                playerBody.velocity.set(0, 0, 0);
                characterModel.position.copy(playerBody.position);
                characterModel.position.y -= playerHeight / 2;

                // 设置人物朝向与飞机一致
                characterModel.rotation.y = planeModel.rotation.y;

                characterModel.add(camera);
                // 恢复为人物行走时的相机设置
                camera.position.set(0, 1.5, 2.5);
                camera.rotation.set(0, 0, 0);
                camera.up.set(0, 1, 0);
            }
        } else if (isNearPlane()) {
            // 只有在飞机附近才能上飞机
            isPlaneView = true;
            if (planeModel && characterModel) {
                characterModel.remove(camera);

                // 隐藏人物模型
                characterModel.visible = false;

                planeModel.add(camera);
                // 相机在飞机后面，看向飞机前进方向
                camera.position.set(0, 3, -6);
                camera.rotation.set(-0.1, Math.PI, 0); // 稍微向下看约6度，主要朝向前方
            }
        }
    } else if (event.key === 'e' || event.key === 'E') {
        if (isComputerView) {
            // 退出电脑模式
            isComputerView = false;
            exitComputerView(camera, characterModel, css3Renderer);
        } else if (isNearComputer(characterModel)) {
            // 进入电脑模式
            isComputerView = true;
            enterComputerView(camera, scene, css3Renderer, characterModel);
        }
    } else if (event.key === 'h' || event.key === 'H') {
        // H 键处理：如果靠近人物，则用于对话
        if (isNearPerson() && !isPlaneView && !isCarView && !isComputerView) {
            if (!isTalking) {
                // 开始对话
                isTalking = true;
                dialogueIndex = 0;
            } else {
                // 继续对话
                if (dialogueIndex < dialogueData.length - 1) {
                    dialogueIndex++;
                } else {
                    // 对话结束，重新开始
                    dialogueIndex = 0;
                }
            }
        }
    } else if (event.key === 'k' || event.key === 'K') {
        // K 键处理：结束对话
        if (isNearPerson() && isTalking && !isPlaneView && !isCarView && !isComputerView) {
            isTalking = false;
            dialogueIndex = 0;
        }
    }
});

export { camera }

