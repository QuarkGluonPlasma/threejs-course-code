// 导入样式文件，用于设置页面样式
import './style.css';
// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入轨道控制器，用于实现鼠标交互控制相机视角
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 导入自定义的山脉对象，该对象在 mountainside.js 文件中定义
import mountainside from './mountainside.js';
// 注释掉的导入语句，原本用于导入加载树木的函数，该函数在 tree.js 文件中定义
// import loadTree from './tree.js';
// 导入自定义的雪花对象，该对象在 snow.js 文件中定义
import snow from './snow.js';

// 创建一个 Three.js 场景对象，场景是所有物体、灯光和相机的容器
const scene = new THREE.Scene();

// 将雪花对象添加到场景中
scene.add(snow);

// 注释掉的函数调用，原本用于加载树木并添加到场景中
// 加载完成后遍历场景中的网格对象并打印信息
// loadTree((tree) => {
//   scene.add(tree);

//   scene.traverse(obj => {
//     if(obj.isMesh) {
//       console.log(obj.name, obj);
//     }
//   })
// })
// 将山脉对象添加到场景中
scene.add(mountainside);

// 创建一个平行光对象，颜色为白色，强度为 2
// 平行光类似于太阳光，从一个方向均匀照射场景
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
// 设置平行光的位置
directionLight.position.set(1000, 2000, 1000);
// 启用平行光的阴影投射功能
directionLight.castShadow = true;
// 设置平行光阴影相机的左边界
directionLight.shadow.camera.left = -2000;
// 设置平行光阴影相机的右边界
directionLight.shadow.camera.right = 2000;
// 设置平行光阴影相机的上边界
directionLight.shadow.camera.top = 2000;
// 设置平行光阴影相机的下边界
directionLight.shadow.camera.bottom = -2000;
// 设置平行光阴影相机的近裁剪面
directionLight.shadow.camera.near = 0.5;
// 设置平行光阴影相机的远裁剪面
directionLight.shadow.camera.far = 10000;
// 将平行光添加到场景中
scene.add(directionLight);

// 注释掉的相机辅助器代码，若取消注释，将显示平行光阴影相机的边界框
// const cameraHelper = new THREE.CameraHelper(directionLight.shadow.camera);
// scene.add(cameraHelper);

// 获取浏览器窗口的宽度
const width = window.innerWidth;
// 获取浏览器窗口的高度
const height = window.innerHeight;

// 创建一个透视相机对象
// 60 为相机的视野角度，width / height 为相机的宽高比
// 100 为近裁剪面，10000 为远裁剪面，只有在这个范围内的物体才会被渲染
const camera = new THREE.PerspectiveCamera(60, width / height, 100, 10000);
// 设置相机的初始位置
camera.position.set(300, 300, 500);
// 让相机朝向场景原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，用于将场景和相机渲染到浏览器中
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸，使其与浏览器窗口大小一致
renderer.setSize(width, height)
// 启用渲染器的阴影映射功能
renderer.shadowMap.enabled = true;

// 定义相机旋转的角度变量，初始值为 0
let angle = 0;
// 定义相机旋转的半径，初始值为 1000
let r = 1000;
/**
 * 渲染函数，用于循环渲染场景并实现相机环绕动画
 */
function render() {
    // // 每次渲染时增加相机旋转的角度
    // angle += 0.03;

    // // 根据角度和半径计算相机在 X 轴上的位置
    // camera.position.x = r * Math.cos(angle);
    // // 根据角度和半径计算相机在 Z 轴上的位置
    // camera.position.z = r * Math.sin(angle);

    // // 让相机始终朝向场景原点 (0, 0, 0)
    // camera.lookAt(0, 0, 0);

    // 调用渲染器的 render 方法，将场景和相机渲染到屏幕上
    renderer.render(scene, camera);
    // 使用 requestAnimationFrame 方法请求浏览器在下一次重绘之前调用 render 函数
    // 从而实现动画循环
    requestAnimationFrame(render);
}
// 调用 render 函数，开始渲染循环
render();

// 设置渲染器的清除颜色为深蓝色
renderer.setClearColor(new THREE.Color('darkblue'));
// 将渲染器生成的 DOM 元素添加到页面的 body 中，以便显示渲染结果
document.body.append(renderer.domElement);

// 创建轨道控制器对象，将相机和渲染器的 DOM 元素作为参数传入
// 轨道控制器允许用户通过鼠标交互来控制相机的视角
const controls = new OrbitControls(camera, renderer.domElement);
