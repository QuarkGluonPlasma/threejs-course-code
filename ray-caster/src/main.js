// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入轨道控制器，用于实现鼠标交互控制相机视角
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 导入自定义的网格对象，该对象在 mesh2.js 文件中定义
import mesh from './mesh2.js';

// 创建一个 Three.js 场景对象，场景是所有物体、灯光和相机的容器
const scene = new THREE.Scene();

// 将导入的网格对象添加到场景中
scene.add(mesh);

// 创建一个坐标轴辅助器，长度为 500，用于可视化场景中的坐标轴
// 红色代表 X 轴，绿色代表 Y 轴，蓝色代表 Z 轴
const axesHelper = new THREE.AxesHelper(500);
// 将坐标轴辅助器添加到场景中
scene.add(axesHelper);

// 创建一个平行光对象，颜色为白色
// 平行光类似于太阳光，从一个方向均匀照射场景
const directionalLight = new THREE.DirectionalLight(0xffffff);
// 设置平行光的位置
directionalLight.position.set(500, 400, 300);
// 将平行光添加到场景中
scene.add(directionalLight);

// 创建一个环境光对象，环境光会均匀照亮场景中的所有物体，颜色为白色
const ambientLight = new THREE.AmbientLight(0xffffff);
// 将环境光添加到场景中
scene.add(ambientLight);

// 获取浏览器窗口的宽度
const width = window.innerWidth;
// 获取浏览器窗口的高度
const height = window.innerHeight;

// 创建一个透视相机对象
// 60 为相机的视野角度，width / height 为相机的宽高比
// 1 为近裁剪面，10000 为远裁剪面，只有在这个范围内的物体才会被渲染
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
// 设置相机的位置
camera.position.set(500, 500, 500);
// 让相机朝向场景原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，用于将场景和相机渲染到浏览器中
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸，使其与浏览器窗口大小一致
renderer.setSize(width, height)

// 创建轨道控制器对象，将相机和渲染器的 DOM 元素作为参数传入
// 轨道控制器允许用户通过鼠标交互来控制相机的视角
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
/**
 * 渲染函数，用于循环渲染场景
 */
function render() {
  if (controls.enableDamping) {
    controls.update();
  }
    // 调用渲染器的 render 方法，将场景和相机渲染到屏幕上
    renderer.render(scene, camera);
    // 使用 requestAnimationFrame 方法请求浏览器在下一次重绘之前调用 render 函数
    // 从而实现动画循环
    requestAnimationFrame(render);
}

// 调用 render 函数，开始渲染循环
render();

// 将渲染器生成的 DOM 元素添加到页面的 body 中，以便显示渲染结果
document.body.append(renderer.domElement);

// 为渲染器的 DOM 元素添加点击事件监听器
renderer.domElement.addEventListener('click', (e) => {
  // 将鼠标点击的 Y 坐标转换为标准化设备坐标（NDC）
  const y = -((e.offsetY / height) * 2 - 1);
  // 将鼠标点击的 X 坐标转换为标准化设备坐标（NDC）
  const x = (e.offsetX / width) * 2 - 1;

  // 创建一个射线投射器对象，用于检测射线与物体的相交情况
  const rayCaster = new THREE.Raycaster();
  // 根据鼠标点击位置和相机信息设置射线的起点和方向
  rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

  // 注释掉的代码，用于创建箭头辅助对象可视化射线
  // const arrowHelper = new THREE.ArrowHelper(rayCaster.ray.direction, rayCaster.ray.origin, 3000);
  // scene.add(arrowHelper);

  // 检测射线与 mesh 对象的子对象的相交情况，返回相交信息数组
  const intersections = rayCaster.intersectObjects(mesh.children);

  // 遍历相交信息数组，将相交物体的材质颜色设置为橙色
  intersections.forEach(item => {
    item.object.material.color = new THREE.Color('orange');
  });
});
