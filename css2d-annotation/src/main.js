// 导入样式文件，用于设置页面样式
import './style.css';
// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入轨道控制器，用于实现鼠标交互控制相机视角
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 导入自定义的网格对象，该对象在 mesh.js 文件中定义
import mesh from './mesh.js';
// 从 Three.js 示例模块中导入 CSS2D 渲染器，用于渲染 2D 标签
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';

// 创建一个 Three.js 场景对象，场景是所有物体、灯光和相机的容器
const scene = new THREE.Scene();

// 将自定义的网格对象添加到场景中
scene.add(mesh);

// 创建一个平行光对象，颜色为白色，强度为 2
// 平行光类似于太阳光，从一个方向均匀照射场景
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
// 设置平行光的位置
directionLight.position.set(500, 400, 300);
// 将平行光添加到场景中
scene.add(directionLight);

// 创建一个环境光对象，环境光会均匀照亮场景中的所有物体
const ambientLight = new THREE.AmbientLight();
// 将环境光添加到场景中
scene.add(ambientLight);

// 获取浏览器窗口的宽度
const width = window.innerWidth;
// 获取浏览器窗口的高度
const height = window.innerHeight;

// 创建一个坐标轴辅助器，长度为 500，用于在场景中显示坐标轴
const helper = new THREE.AxesHelper(500);
// 将坐标轴辅助器添加到场景中
scene.add(helper);

// 创建一个透视相机对象
// 60 为相机的视野角度，width / height 为相机的宽高比
// 0.1 为近裁剪面，10000 为远裁剪面，只有在这个范围内的物体才会被渲染
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的初始位置
camera.position.set(500, 600, 800);
// 让相机朝向场景原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，用于将场景和相机渲染到浏览器中
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸，使其与浏览器窗口大小一致
renderer.setSize(width, height);

// 创建一个 CSS2D 渲染器，用于渲染 2D 标签
const css2Renderer = new CSS2DRenderer();
// 设置 CSS2D 渲染器的尺寸，使其与浏览器窗口大小一致
css2Renderer.setSize(width, height);

// 创建一个 div 元素，用于包裹渲染器的 DOM 元素
const div = document.createElement('div');
// 设置 div 元素的定位方式为相对定位
div.style.position = 'relative';
// 将 CSS2D 渲染器的 DOM 元素添加到 div 中
div.appendChild(css2Renderer.domElement);
// 设置 CSS2D 渲染器的 DOM 元素的定位方式为绝对定位
css2Renderer.domElement.style.position = 'absolute';
// 设置 CSS2D 渲染器的 DOM 元素的左偏移量为 0
css2Renderer.domElement.style.left = '0px';
// 设置 CSS2D 渲染器的 DOM 元素的上偏移量为 0
css2Renderer.domElement.style.top = '0px';
// 禁止 CSS2D 渲染器的 DOM 元素响应鼠标事件
css2Renderer.domElement.style.pointerEvents = 'none';

// 将 WebGL 渲染器的 DOM 元素添加到 div 中
div.appendChild(renderer.domElement);
// 将包裹渲染器 DOM 元素的 div 添加到页面的 body 中
document.body.appendChild(div);

/**
 * 渲染函数，用于循环更新场景和相机状态并进行渲染
 */
function render() {
    // 使用 CSS2D 渲染器渲染场景和相机
    css2Renderer.render(scene, camera);
    // 使用 WebGL 渲染器渲染场景和相机
    renderer.render(scene, camera);
    // 使用 requestAnimationFrame 方法请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用 render 函数，开始渲染循环
render();

// 注释掉的代码，若取消注释，将把 WebGL 渲染器的 DOM 元素直接添加到页面的 body 中
// document.body.append(renderer.domElement);

// 创建轨道控制器对象，将相机和 WebGL 渲染器的 DOM 元素作为参数传入
// 轨道控制器允许用户通过鼠标交互来控制相机的视角
const controls = new OrbitControls(camera, renderer.domElement);

// 监听窗口大小变化事件
window.onresize = function () {
    // 获取变化后的浏览器窗口宽度
    const width = window.innerWidth;
    // 获取变化后的浏览器窗口高度
    const height = window.innerHeight;

    // 调整 WebGL 渲染器的尺寸
    renderer.setSize(width,height);
    // 调整 CSS2D 渲染器的尺寸
    css2Renderer.setSize(width,height);

    // 更新相机的宽高比
    camera.aspect = width / height;
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix();
};

// 为 WebGL 渲染器的 DOM 元素添加点击事件监听器
renderer.domElement.addEventListener('click', (e) => {
    // 将鼠标点击的 Y 坐标转换为归一化设备坐标（NDC）
    const y = -((e.offsetY / height) * 2 - 1);
    // 将鼠标点击的 X 坐标转换为归一化设备坐标（NDC）
    const x = (e.offsetX / width) * 2 - 1;

    // 创建一个射线投射器对象，用于检测鼠标点击位置与场景中物体的交点
    const rayCaster = new THREE.Raycaster();
    // 根据鼠标点击的归一化设备坐标和相机信息设置射线投射器
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

    // 获取射线与网格对象子元素的交点数组
    const intersections = rayCaster.intersectObjects(mesh.children);

    // 若存在交点
    if(intersections.length) {
        // 获取第一个交点对应的物体
        const obj = intersections[0].object;
        // 尝试获取该物体中名为 'tag' 的子对象
        const tag = obj.getObjectByName('tag');
        // 若存在名为 'tag' 的子对象
        if(tag) {
            // 切换该标签的可见性
            tag.visible = !tag.visible;
        }
    }
});
