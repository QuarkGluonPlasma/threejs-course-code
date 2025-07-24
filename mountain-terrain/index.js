
import * as THREE from 'three';
/**
 * 从 Three.js 扩展模块中导入轨道控制器 OrbitControls
 * 该控制器允许用户通过鼠标交互来控制场景中的相机视角
 */
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
/**
 * 从 './mesh.js' 文件中导入网格对象 mesh 和更新位置的函数 updatePosition
 */
import mesh, { updatePosition } from './mesh.js';

/**
 * 创建一个 Three.js 场景对象
 * 场景是一个容器，用于存放所有的 3D 对象、灯光和相机
 */
const scene = new THREE.Scene();

/**
 * 将导入的网格对象添加到场景中
 * 这样网格对象就会在场景中被渲染
 */
scene.add(mesh);

/**
 * 创建一个坐标轴辅助对象
 * 参数 200 表示辅助线的长度，用于可视化场景中的坐标轴
 * X 轴为红色，Y 轴为绿色，Z 轴为蓝色
 */
const axesHelper = new THREE.AxesHelper(200);
// 注释掉该行代码，不将坐标轴辅助对象添加到场景中
// scene.add(axesHelper);

/**
 * 获取浏览器窗口的内部宽度，作为渲染区域的宽度
 */
const width = window.innerWidth;
/**
 * 获取浏览器窗口的内部高度，作为渲染区域的高度
 */
const height = window.innerHeight;

/**
 * 创建一个透视相机对象
 * @param {number} 60 - 相机的垂直视野角度，单位为度
 * @param {number} width / height - 相机的宽高比
 * @param {number} 1 - 近裁剪面距离，距离相机小于该值的物体将不会被渲染
 * @param {number} 10000 - 远裁剪面距离，距离相机大于该值的物体将不会被渲染
 */
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
/**
 * 设置相机的位置
 * 分别指定相机在 X、Y、Z 轴上的坐标
 */
camera.position.set(450, 150, 100);
/**
 * 设置相机的朝向
 * 让相机看向场景的原点 (0, 0, 0)
 */
camera.lookAt(0, 0, 0);

/**
 * 创建一个 WebGL 渲染器对象
 * 用于将场景和相机组合渲染成 2D 图像
 */
const renderer = new THREE.WebGLRenderer();
/**
 * 设置渲染器的渲染区域大小
 * 使用之前获取的浏览器窗口的宽度和高度
 */
renderer.setSize(width, height)

/**
 * 定义渲染函数
 * 该函数会在每一帧更新场景并进行渲染
 */
function render() {
    // 调用从 './mesh.js' 导入的更新位置函数
    updatePosition();
    // 让网格对象绕 Z 轴旋转 0.003 弧度
    mesh.rotateZ(0.003);
    // 使用渲染器渲染场景和相机视图
    renderer.render(scene, camera);
    // 请求浏览器在下一次重绘前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用渲染函数，启动动画循环
render();

/**
 * 将渲染器的 DOM 元素添加到页面的 body 元素中
 * 这样渲染结果就会显示在网页上
 */
document.body.append(renderer.domElement);

/**
 * 创建一个轨道控制器对象
 * 允许用户通过鼠标交互控制相机的视角
 * @param {THREE.Camera} camera - 要控制的相机对象
 * @param {HTMLElement} renderer.domElement - 渲染器的 DOM 元素，用于监听鼠标事件
 */
const controls = new OrbitControls(camera, renderer.domElement);

/**
 * 为轨道控制器添加 change 事件监听器
 * 当相机位置发生变化时，在控制台打印相机的当前位置
 */
controls.addEventListener('change', () => {
    console.log(camera.position);
});
