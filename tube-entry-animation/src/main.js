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
// 导入自定义的管道对象和管道上的点数组，它们在 tube.js 文件中定义
import tube, { tubePoints } from './tube.js';
// 从 tween.js 库中导入缓动函数和补间动画类
import { Easing, Tween } from '@tweenjs/tween.js';

// 创建一个 Three.js 场景对象，场景是所有物体、灯光和相机的容器
const scene = new THREE.Scene();

// 将自定义的网格对象和管道对象添加到场景中
scene.add(mesh, tube);

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
// 注释掉的代码，若取消注释，将把坐标轴辅助器添加到场景中
// scene.add(helper);

// 创建一个透视相机对象
// 60 为相机的视野角度，width / height 为相机的宽高比
// 0.1 为近裁剪面，10000 为远裁剪面，只有在这个范围内的物体才会被渲染
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的初始位置
camera.position.set(200, 800, 800);
// 让相机朝向场景原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，用于将场景和相机渲染到浏览器中
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸，使其与浏览器窗口大小一致
renderer.setSize(width, height)

// 创建一个补间动画对象，定义动画的起始状态
const tween = new Tween({
  x: 0,
  y: 500,
  z: 800,
  rotation: 0
})
// 定义动画的结束状态
.to({
  x: 200,
  y: 800,
  z: 800,
  rotation: 280
})
// 设置动画不重复
.repeat(0)
// 设置动画的缓动函数为二次函数的先加速后减速效果
.easing(Easing.Quadratic.InOut)
// 动画更新时的回调函数
.onUpdate((obj) => {
  // 更新相机的位置
  camera.position.copy(new THREE.Vector3(obj.x, obj.y, obj.z));
  // 让相机始终朝向场景原点 (0, 0, 0)
  camera.lookAt(0, 0, 0);

  // 更新网格对象的绕 Y 轴旋转角度
  mesh.rotation.y = obj.rotation / 180 * Math.PI;
});

// 标记动画是否已经开始
let started = false;
// 用于遍历管道上点数组的索引
let i = 0;
/**
 * 渲染函数，用于循环更新场景和相机状态并进行渲染
 * @param {number} time - 由 requestAnimationFrame 传入的当前时间戳
 */
function render(time) {
    // 若索引未超出管道上点数组的范围
    if(i < tubePoints.length - 1) {
        // 将相机位置设置为当前管道点的位置
        camera.position.copy(tubePoints[i]);
        // 让相机朝向管道上的下一个点
        camera.lookAt(tubePoints[i + 1]);
        // 索引递增，每次跳过 4 个点
        i += 4;
    } else {
      // 若动画还未开始
      if(!started) {
        // 从场景中移除管道对象
        scene.remove(tube);
        // 启动补间动画
        tween.start();
        // 标记动画已经开始
        started = true;
      }
    }

    // 更新补间动画
    tween.update(time);
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

// 创建轨道控制器对象，将相机和渲染器的 DOM 元素作为参数传入
// 轨道控制器允许用户通过鼠标交互来控制相机的视角
const controls = new OrbitControls(camera, renderer.domElement);
