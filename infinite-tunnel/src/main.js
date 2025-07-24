// 导入样式文件，用于设置页面样式
import './style.css';
// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 扩展库中导入轨道控制器，用于用户交互控制相机视角
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 mesh.js 文件中导入网格对象
import mesh from './mesh.js';

// 创建一个 Three.js 场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();

// 将从 mesh.js 导入的网格对象添加到场景中
scene.add(mesh);

// 获取浏览器窗口的宽度
const width = window.innerWidth;
// 获取浏览器窗口的高度
const height = window.innerHeight;

// 创建一个透视相机，设置视野角度为 60 度，宽高比为窗口宽高比，近裁剪面为 1，远裁剪面为 1000
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
// 设置相机的初始位置
camera.position.set(0.9, -520, 6.5);
// 让相机看向场景的原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，用于将 3D 场景渲染到浏览器中
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的渲染尺寸为浏览器窗口的大小
renderer.setSize(width, height)

// 初始化色相值，用于控制网格材质的颜色
let H = 0;
// 创建一个时钟对象，用于获取时间差，实现动画的平滑更新
const clock = new THREE.Clock();
/**
 * 渲染函数，用于更新场景状态并渲染场景
 */
function render() {
    // 获取自上次调用以来经过的时间差（秒）
    const delta = clock.getDelta();
    
    // 每次渲染时增加色相值
    H += 0.002;
    // 若色相值超过 1，将其重置为 0，确保色相值在 0 到 1 的有效范围内
    if (H > 1) { H = 0; }

    // 根据更新后的色相值设置网格材质的颜色，饱和度为 0.5，亮度为 0.5
    mesh.material.color.setHSL(H, 0.5, 0.5);

    // 沿着 Y 轴偏移网格材质的透明度贴图，实现动态效果
    mesh.material.alphaMap.offset.y += delta * 0.5;
    // 绕 Y 轴旋转网格对象，旋转速度由时间差决定
    // mesh.rotation.y += delta * 0.5;

    // 使用渲染器渲染场景和相机视图
    renderer.render(scene, camera);
    // 请求浏览器在下一次重绘前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用渲染函数，启动动画循环
render();

// 将渲染器的 DOM 元素添加到页面的 body 中，使渲染结果显示在页面上
document.body.append(renderer.domElement);

// 创建轨道控制器，允许用户通过鼠标交互控制相机视角
const controls = new OrbitControls(camera, renderer.domElement);
// 为轨道控制器添加 change 事件监听器，当相机位置发生变化时，在控制台输出相机的位置
controls.addEventListener('change', () => {
  console.log(camera.position);
});
