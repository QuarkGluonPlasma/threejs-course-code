// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 相关功能
import * as THREE from 'three';
// 从 three.js 的扩展模块中导入轨道控制器，用于实现相机的交互控制
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 mesh.js 文件中导入预先创建好的网格对象
import mesh from './mesh.js';
// 注释掉的代码，若取消注释可从 mesh.js 文件中导入 cubeCamera 对象
// import { cubeCamera } from './mesh.js';
// 注释掉的代码，若取消注释可从 mesh.js 文件中导入 cubeCamera2 对象
// import { cubeCamera2 } from './mesh.js';

// 创建一个新的场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();
// 将导入的网格对象添加到场景中，使其可以被渲染
scene.add(mesh);

// 创建一个立方体贴图加载器实例
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图纹理文件所在的基础路径
    .setPath('./city/')
    // 加载立方体贴图的六个面，分别对应右、左、上、下、前、后
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
// 将加载好的立方体贴图设置为场景的背景
scene.background = textureCube;

// 创建一个平行光对象，参数分别为光的颜色（白色）和强度
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
// 设置平行光的位置，决定光照的方向
directionLight.position.set(500, 400, 300);
// 将平行光添加到场景中
scene.add(directionLight);

// 创建一个环境光对象，环境光会均匀照亮场景中的所有物体
const ambientLight = new THREE.AmbientLight();
// 将环境光添加到场景中
scene.add(ambientLight);

// 获取浏览器窗口的当前宽度
const width = window.innerWidth;
// 获取浏览器窗口的当前高度
const height = window.innerHeight;

// 创建一个坐标轴辅助对象，用于显示场景中的坐标轴，参数表示轴的长度
const helper = new THREE.AxesHelper(500);
// 注释掉的代码，若取消注释可将坐标轴辅助对象添加到场景中，用于调试
// scene.add(helper);

// 创建一个透视相机对象，参数分别为视角、宽高比、近裁剪面和远裁剪面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(300, 300, 300);
// 让相机看向场景的原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器实例，开启抗锯齿功能以提高渲染质量
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
// 设置渲染器的尺寸为浏览器窗口的大小
renderer.setSize(width, height)

// 注释掉的代码，若取消注释可通过名称从 mesh 中获取名为 'mirror1' 的对象
// const mirror1 = mesh.getObjectByName('mirror1');
// 注释掉的代码，若取消注释可通过名称从 mesh 中获取名为 'mirror2' 的对象
// const mirror2 = mesh.getObjectByName('mirror2');

/**
 * 渲染函数，用于循环渲染场景
 */
function render() {
    // 注释掉的代码，若取消注释可将 cubeCamera 的位置设置为 mirror1 的位置
    // cubeCamera.position.copy(mirror1.position);
    // 注释掉的代码，若取消注释可更新 cubeCamera 的渲染，捕获场景的立方体贴图
    // cubeCamera.update(renderer, scene);

    // 注释掉的代码，若取消注释可将 cubeCamera2 的位置设置为 mirror2 的位置
    // cubeCamera2.position.copy(mirror2.position);
    // 注释掉的代码，若取消注释可更新 cubeCamera2 的渲染，捕获场景的立方体贴图
    // cubeCamera2.update(renderer, scene);

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
