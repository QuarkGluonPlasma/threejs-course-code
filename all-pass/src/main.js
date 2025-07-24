// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入轨道控制器，用于实现鼠标交互控制相机视角
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 Three.js 拓展库中导入 DragControls，用于实现物体拖拽功能
import { DragControls } from 'three/addons/controls/DragControls.js';
// 从 Three.js 拓展库中导入后期处理合成器，用于管理后期处理流程
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 从 Three.js 拓展库中导入基础渲染通道，用于执行基础的场景渲染
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 从 Three.js 拓展库中导入故障效果通道，用于添加故障视觉效果
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
// 从 Three.js 拓展库中导入多种后期处理相关的类和着色器
import { AfterimagePass, BloomPass, BokehPass, FilmPass, GammaCorrectionShader, HalftonePass, OutlinePass, ShaderPass, SMAAPass, UnrealBloomPass } from 'three/addons/Addons.js';
// 导入 lil-gui 库，用于创建图形用户界面
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// 创建一个 Three.js 场景对象，场景是所有物体、灯光和相机的容器
const scene = new THREE.Scene();

// 创建一个立方体几何体，尺寸为 300x300x300
const geometry = new THREE.BoxGeometry(300, 300, 300);
// 创建一个 MeshLambert 材质，该材质会对光照产生反应，设置颜色为橙色
const material = new THREE.MeshLambertMaterial({
  color: 'orange'
});
// 创建一个网格对象，将几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, material);
// 将网格对象添加到场景中
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

// 创建一个坐标轴辅助器，长度为 500，用于可视化场景中的坐标轴
// 红色代表 X 轴，绿色代表 Y 轴，蓝色代表 Z 轴
const helper = new THREE.AxesHelper(500);
// 注释掉的代码，若取消注释，将坐标轴辅助器添加到场景中
// scene.add(helper);

// 创建一个透视相机对象
// 60 为相机的视野角度，width / height 为相机的宽高比
// 0.1 为近裁剪面，10000 为远裁剪面，只有在这个范围内的物体才会被渲染
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(400, 500, 600);
// 让相机朝向场景原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，用于将场景和相机渲染到浏览器中
// antialias 用于开启抗锯齿，当前处于注释状态
const renderer = new THREE.WebGLRenderer({
  // antialias: true
});
// 设置渲染器的尺寸，使其与浏览器窗口大小一致
renderer.setSize(width, height)

// 创建后期处理合成器，将渲染器作为参数传入
const composer = new EffectComposer(renderer);
// 创建基础渲染通道，将场景和相机作为参数传入
const renderPass = new RenderPass(scene, camera);
// 将基础渲染通道添加到后期处理合成器中
composer.addPass(renderPass);

// 注释掉的故障效果通道代码，若取消注释，将添加故障视觉效果
// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);

// 注释掉的残像效果通道代码，若取消注释，将添加残像视觉效果
const afterimagePass = new AfterimagePass();
composer.addPass(afterimagePass);

// 注释掉的胶片效果通道代码，若取消注释，将添加胶片风格视觉效果
// const filmPass = new FilmPass(0.8, false);
// composer.addPass(filmPass);

// 注释掉的泛光效果通道代码，若取消注释，将添加泛光视觉效果
// const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// const bloomPass = new UnrealBloomPass(v);
// bloomPass.strength = 0.12; // 泛光强度
// bloomPass.radius = 1; // 泛光半径
// composer.addPass(bloomPass);

// 注释掉的半色调效果通道代码，若取消注释，将添加半色调视觉效果
// const halftonePass = new HalftonePass({
//   radius: 8
// });
// composer.addPass(halftonePass);

// 注释掉的轮廓效果通道代码，若取消注释，将为指定对象添加轮廓效果
const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
const outlinePass = new OutlinePass(v, scene, camera);
outlinePass.visibleEdgeColor.set('blue');
outlinePass.edgeStrength = 10;
outlinePass.edgeThickness = 1;
// outlinePass.pulsePeriod = 1;
outlinePass.selectedObjects = [mesh];
composer.addPass(outlinePass);

// 获取渲染器的像素比
const pixelRatio = renderer.getPixelRatio();
// 创建 SMAA 抗锯齿通道，用于减少锯齿现象
const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
// 将 SMAA 抗锯齿通道添加到后期处理合成器中
composer.addPass(smaaPass);

// 创建伽马校正通道，用于校正颜色显示
const gammaPass= new ShaderPass(GammaCorrectionShader);
// 将伽马校正通道添加到后期处理合成器中
composer.addPass(gammaPass);

/**
 * 渲染函数，用于循环进行后期处理渲染
 */
function render() {
    // 调用后期处理合成器的 render 方法进行渲染
    composer.render();
    // 注释掉的代码，原本用于直接渲染场景，使用后期处理后不再需要
    // renderer.render(scene, camera);
    // 使用 requestAnimationFrame 方法请求浏览器在下一次重绘之前调用 render 函数
    // 从而实现动画循环
    requestAnimationFrame(render);
}

// 调用 render 函数，开始渲染循环
render();

// 将渲染器生成的 DOM 元素添加到页面的 body 中，以便显示渲染结果
document.body.append(renderer.domElement);

// 创建轨道控制器对象，将相机和渲染器的 DOM 元素作为参数传入
// 轨道控制器允许用户通过鼠标交互来控制相机的视角
const controls = new OrbitControls(camera, renderer.domElement);

// 创建 DragControls 实例
const dragControls = new DragControls([mesh], camera, renderer.domElement);

dragControls.addEventListener('dragstart', (event) => {
  event.object.material.color.set('red');
  controls.enabled = false;
});

dragControls.addEventListener('dragend', (event) => {
  event.object.material.color.set('blue');
  controls.enabled = true;
});
