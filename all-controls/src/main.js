// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用
import * as THREE from 'three';
// 从 three.js 的扩展模块中导入轨道控制器，不过当前代码未实际使用该控制器
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 mesh.js 文件中导入预先创建好的网格对象
import mesh from './mesh.js';
// 从 three.js 的示例模块中导入多种控制器，用于实现不同的相机和对象交互功能
import { ArcballControls, DragControls, FirstPersonControls, FlyControls, MapControls, TrackballControls, TransformControls } from 'three/examples/jsm/Addons.js';

// 创建一个新的场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();
// 将从 mesh.js 导入的网格对象添加到场景中
scene.add(mesh);

// 创建一个平行光对象，参数分别为光的颜色（白色）和强度
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
// 设置平行光的位置，从而决定光照的方向
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

// 创建一个坐标轴辅助对象，参数 500 表示轴的长度，用于在场景中显示坐标轴
const helper = new THREE.AxesHelper(500);
// 注释掉的代码，若取消注释可将坐标轴辅助对象添加到场景中，方便调试
// scene.add(helper);

// 创建一个透视相机对象，参数分别为视角、宽高比、近裁剪面和远裁剪面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(500, 500, 500);
// 让相机看向场景的原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器实例，开启抗锯齿功能以提高渲染质量
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
// 设置渲染器的尺寸为浏览器窗口的大小
renderer.setSize(width, height)

// 创建飞行控制器实例，允许用户以飞行的方式控制相机视角
// const controls = new FlyControls(camera, renderer.domElement);
// // 设置飞行控制器的移动速度
// controls.movementSpeed = 100;
// // 设置飞行控制器的翻滚速度
// controls.rollSpeed = Math.PI / 10;

// 注释掉的代码，若取消注释可使用第一人称控制器控制相机视角
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 150;

// 创建一个时钟对象，用于获取渲染帧之间的时间差
const clock = new THREE.Clock();
/**
 * 渲染函数，用于循环渲染场景并更新控制器状态
 */
function render() {
    // 根据时间差更新控制器状态，确保相机的移动和旋转平滑
    // controls.update(clock.getDelta());

    // 使用渲染器渲染场景和相机视图
    renderer.render(scene, camera);
    // 请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用渲染函数，开始渲染循环
render();

// 将渲染器生成的 DOM 元素添加到页面的 body 元素中，使渲染结果显示在页面上
document.body.append(renderer.domElement);

// 注释掉的代码，若取消注释可使用轨道控制器控制相机视角
// const controls = new OrbitControls(camera, renderer.domElement);

// 注释掉的代码，若取消注释可从场景中获取名为 'box' 和 'box2' 的对象
const box1 = scene.getObjectByName('box');
const box2 = scene.getObjectByName('box2');
// 注释掉的代码，若取消注释可使用变换控制器对对象进行变换操作
// const controls = new TransformControls(camera, renderer.domElement);
// controls.attach(box1);
// scene.add(controls.getHelper());

// 注释掉的代码，若取消注释可使用拖拽控制器实现对象的拖拽操作
// const controls = new DragControls([box1, box2], camera, renderer.domElement);

// // 注释掉的代码，若取消注释，当开始拖拽对象时，将对象材质颜色设置为浅绿色
// controls.addEventListener( 'dragstart', function(event) {
// 	event.object.material.color.set('lightgreen');
// });

// // 注释掉的代码，若取消注释，当结束拖拽对象时，将对象材质颜色设置为橙色
// controls.addEventListener( 'dragend', function(event) {
// 	event.object.material.color.set('orange');
// });

// // 注释掉的代码，若取消注释，当鼠标悬停在对象上时，将对象材质设置为线框模式
// controls.addEventListener('hoveron', (event) => {
//   event.object.material.wireframe = true;
// });

// // 注释掉的代码，若取消注释，当鼠标离开对象时，取消对象材质的线框模式
// controls.addEventListener('hoveroff', (event) => {
//   event.object.material.wireframe = false;
// });
