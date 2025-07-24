// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 three.js 库的所有模块，并命名为 THREE
import * as THREE from 'three';
// 从 three.js 的扩展模块中导入轨道控制器
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 mesh4.js 文件中导入网格对象
import mesh from './mesh5.js';

// 创建一个新的场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();
// 将导入的网格对象添加到场景中
scene.add(mesh);

// 创建一个立方体贴图加载器实例
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图的基础路径
    .setPath('./city/')
    // 加载立方体贴图的六个面，分别对应右、左、上、下、前、后
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 将加载好的立方体贴图设置为场景的背景
scene.background = textureCube;

// 创建一个平行光对象，参数分别为颜色和强度
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

// 创建一个坐标轴辅助对象，用于显示场景中的坐标轴，参数表示轴的长度
const helper = new THREE.AxesHelper(500);
// 注释掉的代码，若取消注释可将坐标轴辅助对象添加到场景中
// scene.add(helper);

// 创建一个透视相机对象，参数分别为视角、宽高比、近裁剪面和远裁剪面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(500, 600, 800);
// 让相机看向场景的原点
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器实例，开启抗锯齿功能
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
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

// 将渲染器生成的 DOM 元素添加到页面的 body 元素中
document.body.append(renderer.domElement);

// 创建轨道控制器实例，允许用户通过鼠标交互控制相机视角
const controls = new OrbitControls(camera, renderer.domElement);


// import './style.css';
// import * as THREE from 'three';
// import {
//     OrbitControls
// } from 'three/addons/controls/OrbitControls.js';
// import mesh from './mesh5.js';
 
// const scene = new THREE.Scene();
 
// scene.add(mesh);
 
// const directionLight = new THREE.DirectionalLight(0xffffff, 1);
// directionLight.position.set(100, 100, 100);
// scene.add(directionLight);
 
// const ambientLight = new THREE.AmbientLight();
// scene.add(ambientLight);
 
// const helper = new THREE.AxesHelper(100);
// scene.add(helper);
 
// const width = window.innerWidth;
// const height = window.innerHeight;
 
// const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// camera.position.set(100, 100, 100);
// camera.lookAt(0, 0, 0);
 
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(width, height)
 
// function render() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }
 
// render();
 
// document.body.append(renderer.domElement);
 
// const controls = new OrbitControls(camera, renderer.domElement);
 
// window.onresize = function () {
//     const width = window.innerWidth;
//     const height = window.innerHeight;
 
//     renderer.setSize(width,height);
 
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
// };