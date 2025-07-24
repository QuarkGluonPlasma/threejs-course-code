// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入 GUI 模块，用于创建图形用户界面
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 创建一个 GUI 实例，用于后续添加可交互的调试控件
const gui = new GUI();

// 创建一个平面几何体，宽和高均为 1000
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
// 创建一个 MeshLambert 材质，该材质会对光照产生反应，颜色设置为天蓝色
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

// 创建一个网格对象，将平面几何体和材质组合在一起
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// 将平面绕 X 轴逆时针旋转 90 度，使其水平放置
plane.rotateX(- Math.PI / 2);
// 将平面沿 Y 轴负方向移动 50 个单位
plane.position.y = -50;
plane.receiveShadow = true;

// 创建一个长方体几何体，长、宽、高均为 100
const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
// 创建一个 MeshLambert 材质，颜色设置为橙色
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
// 创建一个网格对象，将长方体几何体和材质组合在一起
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.castShadow = true;

// 克隆 box 对象，得到一个新的长方体
const box2 = box.clone();
// 将克隆的长方体沿 X 轴正方向移动 200 个单位
box2.position.x = 200;
// box2.castShadow = true;

// 创建一个 Three.js 组对象，用于将多个对象组合在一起
export const mesh = new THREE.Group();
// 将平面添加到组中
mesh.add(plane);
// 将第一个长方体添加到组中
mesh.add(box);
// 将克隆的长方体添加到组中
mesh.add(box2);

// 创建一个平行光对象，颜色为白色
export const light = new THREE.DirectionalLight(0xffffff, 4);
light.castShadow = true;
// 调整阴影相机的正交投影范围，确保能覆盖场景中的物体
light.shadow.camera.left = -500;
light.shadow.camera.right = 500;
light.shadow.camera.top = 500;
light.shadow.camera.bottom = -500;
light.shadow.camera.near = 10;
light.shadow.camera.far = 1000;
// 设置阴影贴图的尺寸，尺寸越大阴影越清晰
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.radius = 10;
// 设置平行光的位置
light.position.set(400, 500, 300);
// 让平行光朝向原点 (0, 0, 0)
light.lookAt(0, 0, 0);

// 创建一个平行光辅助器，用于可视化平行光的方向和位置，辅助器长度为 100
const helper = new THREE.DirectionalLightHelper(light, 100);
// 将平行光辅助器添加到组中
mesh.add(helper);

const ambientLight = new THREE.AmbientLight(0xffffff);
mesh.add(ambientLight);

// 在 GUI 中创建一个名为 '平行光' 的文件夹，用于组织平行光相关的调试控件
const f1 = gui.addFolder('平行光');
// 在 '平行光' 文件夹中添加一个滑动条，用于调整平行光的 X 坐标，范围为 10 到 1000
f1.add(light.position, 'x').min(10).max(1000);
// 在 '平行光' 文件夹中添加一个滑动条，用于调整平行光的 Y 坐标，范围为 10 到 1000
f1.add(light.position, 'y').min(10).max(1000);
// 在 '平行光' 文件夹中添加一个滑动条，用于调整平行光的 Z 坐标，范围为 10 到 1000
f1.add(light.position, 'z').min(10).max(1000);
// 在 '平行光' 文件夹中添加一个滑动条，用于调整平行光的强度，范围为 0 到 10
f1.add(light, 'intensity').min(0).max(10);
