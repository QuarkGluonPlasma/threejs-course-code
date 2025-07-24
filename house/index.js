// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 扩展库中导入轨道控制器，用于用户交互控制相机视角
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 从 house.js 文件中导入房屋对象
import house from './house.js';
// 从 grass.js 文件中导入草地对象
import grass from './grass.js';
// 从 roof.js 文件中导入 GUI 控制器对象
import { gui } from './roof.js';

// 创建一个 Three.js 场景对象，场景是所有 3D 对象的容器
const scene = new THREE.Scene();
// 为场景添加雾效，设置雾的颜色为 0xcccccc，最近可见距离为 1000，最远可见距离为 40000
scene.fog = new THREE.Fog( 0xcccccc, 1000, 40000);

// 在 GUI 中创建一个名为 '雾' 的文件夹，用于控制雾的相关参数
const fogControl = gui.addFolder('雾');
// 在 '雾' 文件夹中添加一个控制器，用于调整雾的最近可见距离，步长为 100
fogControl.add(scene.fog, 'near').step(100);
// 在 '雾' 文件夹中添加一个控制器，用于调整雾的最远可见距离，步长为 1000
fogControl.add(scene.fog, 'far').step(1000);

// 将房屋对象添加到场景中
scene.add(house);
// 将草地对象添加到场景中
scene.add(grass);

// 创建一个平行光，颜色为白色
const directionLight = new THREE.DirectionalLight(0xffffff);
// 设置平行光的位置
directionLight.position.set(3000, 3000, 3000);
// 将平行光添加到场景中
scene.add(directionLight);

// 创建一个环境光
const ambientLight = new THREE.AmbientLight();
// 将环境光添加到场景中
scene.add(ambientLight);

// 创建一个坐标轴辅助器，长度为 20000
const axesHelper = new THREE.AxesHelper(20000);
// 注释掉的代码，若取消注释，可将坐标轴辅助器添加到场景中
// scene.add(axesHelper);

// 获取浏览器窗口的宽度
const width = window.innerWidth;
// 获取浏览器窗口的高度
const height = window.innerHeight;

// 创建一个透视相机，设置视野角度为 60 度，宽高比为窗口宽高比，近裁剪面为 1，远裁剪面为 30000
const camera = new THREE.PerspectiveCamera(60, width / height, 1, 30000);
// 设置相机的初始位置
camera.position.set(5000, 5000, 5000);
// 让相机看向场景的原点 (0, 0, 0)
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器，启用对数深度缓冲区以解决深度冲突问题
const renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true
});
// 设置渲染器的清除颜色为天蓝色
renderer.setClearColor(new THREE.Color('skyblue'));

// 设置渲染器的渲染尺寸为浏览器窗口的大小
renderer.setSize(width, height);

// 初始化角度变量，用于控制相机的旋转
let angle = 0;
// 初始化相机的旋转半径
let r = 5000;

// 创建轨道控制器，允许用户通过鼠标交互控制相机视角
const controls = new OrbitControls(camera, renderer.domElement);

//启用阻尼效果
controls.enableDamping = true;

// 设置轨道控制器的阻尼因子，用于控制相机在拖拽时的灵敏度
controls.dampingFactor = 0.25;

controls.mindistance = 1000;
controls.maxdistance = 50000;

// 设置最大和最小垂直角度，避免相机视角过于垂直
controls.minPolarAngle = 0; // 最小垂直角度，0 表示正上方
controls.maxPolarAngle = Math.PI / 2; // 最大垂直角度，Math.PI / 2 表示水平方向

/**
 * 渲染函数，用于更新相机位置并渲染场景
 */
function render() {
    // 每次渲染时增加角度值，控制相机的旋转速度
    // angle += 0.00000001;

    // 当角度值超过 2π 时，重置角度值，并随机更新相机的旋转半径和 Y 轴位置
    if(angle >= Math.PI * 2) {
        // 重置角度值
        angle -= Math.PI * 2;
        // 随机更新相机的旋转半径
        r = 5000 + Math.random() * 10000;
        // 随机更新相机的 Y 轴位置
        camera.position.y = 1000 + Math.random() * 10000;
    }

    // 根据角度和半径更新相机的 X 轴位置
    // camera.position.x = r * Math.cos(angle);
    // 根据角度和半径更新相机的 Z 轴位置
    // camera.position.z = r * Math.sin(angle);

    // 让相机始终看向场景的原点 (0, 0, 0)
    // camera.lookAt(0, 0, 0);

    if (controls.enableDamping) {
        controls.update();
    }

    // 使用渲染器渲染场景和相机视图
    renderer.render(scene, camera);
    // 请求浏览器在下一次重绘前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用渲染函数，启动动画循环
render();

// 将渲染器的 DOM 元素添加到页面的 body 中，使渲染结果显示在页面上
document.body.append(renderer.domElement);
