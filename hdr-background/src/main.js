// 导入样式文件，用于设置页面的样式
import './style.css';
// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用
import * as THREE from 'three';
// 从 three.js 的扩展模块中导入轨道控制器，用于实现相机的交互控制
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 three.js 的示例模块中导入 RGBELoader，用于加载 HDR 格式的纹理
import { RGBELoader } from 'three/examples/jsm/Addons.js';

// 创建一个新的场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();

// 创建一个平行光对象，参数为光的颜色（白色），用于模拟类似太阳光的定向光照
const directionLight = new THREE.DirectionalLight(0xffffff);
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
// 将坐标轴辅助对象添加到场景中，方便调试
scene.add(helper);

// 创建一个透视相机对象，参数分别为视角、宽高比、近裁剪面和远裁剪面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(300, 700, 300);
// 让相机看向场景的原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器实例，开启抗锯齿功能以提高渲染质量
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
// 设置渲染器的尺寸为浏览器窗口的大小
renderer.setSize(width, height)

/**
 * 渲染函数，用于循环渲染场景
 * @param {number} time - 由 requestAnimationFrame 传入的时间参数，当前未使用
 */
function render(time) {
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

// 监听窗口大小变化事件，当窗口大小改变时调整渲染器和相机
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

// 创建一个 RGBELoader 实例，用于加载 HDR 纹理
const rgbeloader = new RGBELoader();

// 使用 RGBELoader 加载指定路径下的 HDR 纹理文件
rgbeloader.load('./pic.hdr', function ( texture ) {
  // 设置纹理的映射方式为等距柱状反射映射
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // 将加载的纹理设置为场景的背景
  scene.background = texture;
});

// 以下代码为注释掉的纹理加载逻辑，使用 TextureLoader 加载 JPG 格式的纹理作为场景背景
// const textureLoader = new THREE.TextureLoader();

// textureLoader.load('./pic.jpg', function ( texture ) {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = texture;
// });
