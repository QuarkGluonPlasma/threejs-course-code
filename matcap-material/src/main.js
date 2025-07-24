// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 three.js 库的所有模块，并将其命名为 THREE
import * as THREE from 'three';
// 从 three.js 的扩展模块中导入轨道控制器，用于实现相机的交互控制
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 mesh2.js 文件中导入预先创建好的网格对象
import mesh from './mesh2.js';

// 创建一个新的场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();

// 将导入的网格对象添加到场景中，使其可以被渲染
scene.add(mesh);

// 创建一个平行光对象，参数分别为光的颜色（白色）和强度
const directionLight = new THREE.DirectionalLight(0xffffff, 10);
// 设置平行光的位置，决定光照的方向
directionLight.position.set(500, 600, 800);
// 将平行光添加到场景中
scene.add(directionLight);

// 创建一个环境光对象，环境光会均匀照亮场景中的所有物体
const ambientLight = new THREE.AmbientLight();
// 将环境光添加到场景中
scene.add(ambientLight);

// 创建一个坐标轴辅助对象，用于显示场景中的坐标轴，参数表示轴的长度
const helper = new THREE.AxesHelper(100);
// 将坐标轴辅助对象添加到场景中，方便调试
scene.add(helper);

// 获取浏览器窗口的当前宽度
const width = window.innerWidth;
// 获取浏览器窗口的当前高度
const height = window.innerHeight;

// 创建一个透视相机对象，参数分别为视角、宽高比、近裁剪面和远裁剪面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(500, 600, 800);
// 让相机看向场景的原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器实例，用于将场景渲染到屏幕上
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸为浏览器窗口的大小
renderer.setSize(width, height)

/**
 * 渲染函数，用于循环渲染场景
 */
function render() {
    // 使用渲染器渲染场景和相机视图
    renderer.render(scene, camera);
    // 请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用渲染函数，开始渲染循环
render();

// 将渲染器生成的 DOM 元素添加到页面的 body 元素中，使渲染结果显示在页面上
document.body.append(renderer.domElement);

// 创建轨道控制器实例，允许用户通过鼠标交互控制相机视角
const controls = new OrbitControls(camera, renderer.domElement);

// 监听窗口大小变化事件
window.onresize = function () {
    // 获取变化后的浏览器窗口宽度
    const width = window.innerWidth;
    // 获取变化后的浏览器窗口高度
    const height = window.innerHeight;

    // 根据新的窗口大小调整渲染器的尺寸
    renderer.setSize(width,height);

    // 更新相机的宽高比
    camera.aspect = width / height;
    // 更新相机的投影矩阵，确保画面正确显示
    camera.updateProjectionMatrix();
};
