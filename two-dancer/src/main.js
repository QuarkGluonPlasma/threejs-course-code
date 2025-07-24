// 导入样式文件
import './style.css';
// 导入 Three.js 库的所有内容
import * as THREE from 'three';
// 从 Three.js 扩展模块中导入轨道控制器
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 导入舞台对象
import stage from './stage.js';
// 从 Three.js 扩展模块中导入后期处理相关类
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
// 从 Three.js 示例模块中导入轮廓通道
import { OutlinePass } from 'three/examples/jsm/Addons.js';
// 从 tween.js 库中导入补间动画相关类
import { Tween, Easing, Group } from '@tweenjs/tween.js';
// 从 Three.js 示例模块中导入 2D 标签渲染器
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';

// 创建一个 Three.js 场景对象
const scene = new THREE.Scene();

// 将舞台对象添加到场景中
scene.add(stage);

// 创建一个平行光，设置颜色为白色，强度为 5
const directionLight = new THREE.DirectionalLight(0xffffff, 5);
// 设置平行光的位置
directionLight.position.set(500, 400, 300);
// 将平行光添加到场景中
scene.add(directionLight);

// 创建一个聚光灯，设置颜色为白色，强度为 5000000
const spotLight = new THREE.SpotLight('white', 5000000);
// 设置聚光灯的照射角度
spotLight.angle = Math.PI / 6;
// 设置聚光灯的位置
spotLight.position.set(0, 800, 0);
// 让聚光灯看向原点
spotLight.lookAt(0, 0, 0);
// 将聚光灯添加到场景中
scene.add(spotLight);
// 开启聚光灯的阴影投射功能
spotLight.castShadow = true;
// 设置聚光灯阴影相机的远裁剪面
spotLight.shadow.camera.far = 10000;

// 创建一个相机辅助对象，用于可视化聚光灯的阴影相机
const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// 注释掉的代码，若取消注释可将相机辅助对象添加到场景中
// scene.add(cameraHelper);

// 创建一个环境光
const ambientLight = new THREE.AmbientLight();
// 将环境光添加到场景中
scene.add(ambientLight);

// 获取窗口的宽度
const width = window.innerWidth;
// 获取窗口的高度
const height = window.innerHeight;

// 创建一个坐标轴辅助对象，长度为 500
const helper = new THREE.AxesHelper(500);
// 注释掉的代码，若取消注释可将坐标轴辅助对象添加到场景中
// scene.add(helper);

// 创建一个透视相机，设置视角、宽高比、近裁剪面和远裁剪面
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
// 设置相机的位置
camera.position.set(500, 600, 800);
// 让相机看向原点
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸
renderer.setSize(width, height)

// 创建一个后期处理合成器
const composer = new EffectComposer(renderer);
// 创建一个渲染通道，用于渲染场景和相机视图
const renderPass = new RenderPass(scene, camera);
// 将渲染通道添加到合成器中
composer.addPass(renderPass);

// 创建一个二维向量，用于设置轮廓通道的尺寸
const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
// 创建一个轮廓通道
const outlinePass = new OutlinePass(v, scene, camera);
// 设置轮廓的边缘强度
outlinePass.edgeStrength = 10;
// 设置轮廓的边缘厚度
outlinePass.edgeThickness = 10;
// 设置轮廓的脉冲周期
outlinePass.pulsePeriod = 1;
// 将轮廓通道添加到合成器中
composer.addPass(outlinePass);

// 创建一个故障效果通道
const glitchPass = new GlitchPass();
// 将故障效果通道添加到合成器中
composer.addPass(glitchPass);

// 开启渲染器的阴影映射功能
renderer.shadowMap.enabled = true;

// 创建一个补间动画组，用于管理补间动画
const tweenGroup = new Group();

// 创建一个 2D 标签渲染器
const css2Renderer = new CSS2DRenderer();
// 设置 2D 标签渲染器的尺寸
css2Renderer.setSize(width, height);

/**
 * 渲染函数，用于循环渲染场景
 * @param {number} time - 当前的时间戳
 */
function render(time) {
    // 使用 2D 标签渲染器渲染场景和相机视图
    css2Renderer.render(scene, camera);
    // 使用后期处理合成器进行渲染
    composer.render();
    // 请求下一帧动画继续调用 render 函数
    requestAnimationFrame(render);
    
    // 更新补间动画组中的所有动画
    tweenGroup.getAll().map(item => item.update(time))
}

// 启动渲染循环
render();

// 注释掉的代码，若取消注释可将渲染器的 DOM 元素添加到页面中
// document.body.append(renderer.domElement);
// 创建一个 div 元素
const div = document.createElement('div');
// 设置 div 元素的定位方式为相对定位
div.style.position = 'relative';
// 将 2D 标签渲染器的 DOM 元素添加到 div 中
div.appendChild(css2Renderer.domElement);
// 设置 2D 标签渲染器的 DOM 元素的定位方式为绝对定位
css2Renderer.domElement.style.position = 'absolute';
// 设置 2D 标签渲染器的 DOM 元素的左偏移量为 0
css2Renderer.domElement.style.left = '0px';
// 设置 2D 标签渲染器的 DOM 元素的上偏移量为 0
css2Renderer.domElement.style.top = '0px';
// 禁止 2D 标签渲染器的 DOM 元素响应鼠标事件
css2Renderer.domElement.style.pointerEvents = 'none';
// 将渲染器的 DOM 元素添加到 div 中
div.appendChild(renderer.domElement);
// 将 div 元素添加到页面的 body 中
document.body.appendChild(div);

// 创建一个轨道控制器，用于控制相机
const controls = new OrbitControls(camera, renderer.domElement);
// 为轨道控制器添加变化事件监听器
controls.addEventListener('change', () => {
  // 注释掉的代码，若取消注释可在控制台打印相机的位置
  // console.log(camera.position);
});

// 为窗口的 resize 事件添加监听器
window.onresize = function () {
  // 获取窗口的新宽度
  const width = window.innerWidth;
  // 获取窗口的新高度
  const height = window.innerHeight;

  // 设置渲染器的新尺寸
  renderer.setSize(width,height);

  // 更新相机的宽高比
  camera.aspect = width / height;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
};

// 创建一个音频监听器
const listener = new THREE.AudioListener();
// 创建一个音频对象
const audio = new THREE.Audio( listener );
// 创建一个音频加载器
const loader = new THREE.AudioLoader();
// 加载音频文件
loader.load('./superman.mp3', function ( buffer ) {
  // 将加载的音频缓冲区设置到音频对象中
  audio.setBuffer( buffer );
});

// 为页面的 body 添加点击事件监听器
document.body.addEventListener('click', () => {
  // 若音频没有正在播放
  if(!audio.isPlaying) {
    // 设置音频循环播放
    audio.setLoop(true);
    // 设置音频音量为 1
    audio.setVolume(1);
    // 播放音频
    audio.play();
  }
});

// 为渲染器的 DOM 元素添加点击事件监听器
renderer.domElement.addEventListener('click', (e) => {
  // 计算点击位置的归一化 y 坐标
  const y = -((e.offsetY / height) * 2 - 1);
  // 计算点击位置的归一化 x 坐标
  const x = (e.offsetX / width) * 2 - 1;

  // 创建一个射线投射器
  const rayCaster = new THREE.Raycaster();
  // 从相机位置发射射线到点击位置
  rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

  // 获取射线与舞台子对象的交点数组
  const intersections = rayCaster.intersectObjects(stage.children);
 
  // 创建一个 Set 对象，用于存储有 target 属性的对象
  const set = new Set();
  // 遍历交点数组
  intersections.forEach(item => {
    // 若交点对象有 target 属性
    if(item.object.target) {
      // 将 target 对象添加到 Set 中
      set.add(item.object.target);
    }
  });
  // 从 Set 中取出前 1 个对象作为舞者数组
  const dancerArr = [...set].slice(0, 1);
  // 若 Set 中有对象，则将舞者数组设置为轮廓通道的选中对象，否则设置为空数组
  outlinePass.selectedObjects = set.size ? dancerArr : [];

  // 若舞者数组中有对象
  if(dancerArr.length) {
    // 判断选中的是否为舞者 1
    const isDancer1 = dancerArr[0].name === 'dancer1';
    // 注释掉的代码，若取消注释可直接设置相机的位置和看向的目标
    // if(isDancer1) {
    //   // camera.position.set(24, 955, -580);
    //   // camera.lookAt(0, 0, 0);
    // } else {
    //   // camera.position.set(42, 1008, 479);
    //   // camera.lookAt(0, 0, 0);
    // }

    // 创建一个补间动画，让相机移动到指定位置
    const tween = new Tween(camera.position)
      // 根据选中的舞者设置相机的目标位置，动画时长为 2000 毫秒
      .to(isDancer1 ? {x:24, y:955, z:-580}: {x:42, y:1008, z:479}, 2000)
      // 设置动画不重复
      .repeat(0)
      // 设置动画的缓动函数为二次方缓入缓出
      .easing(Easing.Quadratic.InOut)
      // 动画更新时的回调函数
      .onUpdate((obj) => {
        // 更新相机的位置
        camera.position.copy(new THREE.Vector3(obj.x, obj.y, obj.z));
        // 让相机看向原点
        camera.lookAt(0, 0, 0);
      }).start();
    // 将补间动画添加到动画组中
    tweenGroup.add(tween);
  }
});
