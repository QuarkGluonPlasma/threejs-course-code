// 导入样式文件
import './style.css';
// 导入 Three.js 库的所有内容
import * as THREE from 'three';
// 从 Three.js 扩展模块中导入轨道控制器
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 导入 lodash-es 库
import _ from 'lodash-es';
// 导入 Stats 模块，用于性能监控
import Stats from 'three/examples/jsm/libs/stats.module.js';

// 创建一个 Three.js 场景对象
const scene = new THREE.Scene();

// 创建一个音频监听器，用于监听音频播放
const listener = new THREE.AudioListener();
// 创建一个音频对象，并关联音频监听器
const audio = new THREE.Audio( listener );

// 创建一个音频加载器
const loader = new THREE.AudioLoader();
// 加载音频文件，加载成功后将音频缓冲区设置到音频对象中
loader.load('../public/superman.mp3', function ( buffer ) {
  audio.setBuffer( buffer );
});

// 为页面的 body 添加点击事件监听器，点击时切换音频的播放与暂停状态
document.body.addEventListener('click', () => {
  audio.isPlaying ? audio.pause() : audio.play()
})

// 创建一个平行光，设置颜色为白色，强度为 2
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
// 设置平行光的位置
directionLight.position.set(500, 400, 300);
// 将平行光添加到场景中
scene.add(directionLight);

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
camera.position.set(0, 1000, 2000);
// 让相机看向原点
camera.lookAt(0, 0, 0);

// 创建一个 WebGL 渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的尺寸
renderer.setSize(width, height)

// 创建一个 Three.js 组对象，用于管理多个网格对象
const group = new THREE.Group();
// 循环创建 21 个立方体网格对象
for(let i = 0; i < 21; i++) {
  // 创建一个立方体几何体，设置宽、高、深
  const geometry = new THREE.BoxGeometry(100, 500, 100);
  // 创建一个 Phong 材质，启用顶点颜色
  const material = new THREE.MeshPhongMaterial({
    // color: 'orange'
    vertexColors: true
  });
  // 使用几何体和材质创建一个网格对象
  const mesh = new THREE.Mesh(geometry,material);
  // 设置网格对象在 y 轴上的位置
  mesh.position.y = 250;
  // 设置网格对象在 x 轴上的位置
  mesh.position.x = i * 150;
  // 将网格对象添加到组中
  group.add(mesh);
}
// 设置组在 x 轴上的位置
group.position.x = -1500;
// 设置组在 y 轴上的位置
group.position.y = -500;

// 将组添加到场景中
scene.add(group);

// 创建一个音频分析器，关联音频对象
const analyser = new THREE.AudioAnalyser(audio);

/**
 * 根据音频频率数据更新立方体网格的高度和颜色
 */
function updateHeight() {
  // 获取音频的频率数据
  const frequencyData = analyser.getFrequencyData();

  // 将频率数据按每 50 个元素一组进行分割，并计算每组的总和
  const sumArr = _.map(_.chunk(frequencyData, 50), (arr) => {
    return _.sum(arr);
  });


  // 遍历组中的所有网格对象
  for(let i = 0; i< group.children.length;i++) {
    // 获取当前网格对象
    const box = group.children[i];
    // 根据频率数据计算网格的高度
    const height = sumArr[i] / 10;
    // 释放原几何体的资源
    box.geometry.dispose();
    // 创建一个新的几何体，更新高度
    box.geometry = new THREE.BoxGeometry(100, height, 100);
    // 更新网格对象在 y 轴上的位置
    box.position.y = height / 2;

    // 获取几何体的顶点位置属性
    const positions = box.geometry.attributes.position;
    // 用于存储顶点颜色数据的数组
    const colorsArr = [];
    // 定义起始颜色为蓝色
    const color1 = new THREE.Color('blue');
    // 定义结束颜色为红色
    const color2 = new THREE.Color('red');
    // 遍历所有顶点
    for (let i = 0; i < positions.count; i++) {
        // 计算顶点在 y 轴上的高度百分比
        const percent = positions.getY(i) / 300;
        // 根据百分比对起始颜色和结束颜色进行线性插值
        const c = color1.clone().lerp(color2, percent);
        // 将插值后的颜色的 RGB 值添加到颜色数组中
        colorsArr.push(c.r, c.g, c.b); 
    }
    // 将颜色数组转换为 Float32Array 类型
    const colors = new Float32Array(colorsArr);
    // 为几何体的颜色属性创建一个缓冲区属性
    box.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
  }
}

// 创建一个 Stats 实例，用于监控性能
const stats = new Stats();
// 将 Stats 的 DOM 元素添加到页面的 body 中
document.body.appendChild( stats.domElement );

/**
 * 渲染函数，用于循环更新场景并渲染
 */
function render() {
    // 根据音频频率数据更新立方体网格的高度和颜色
    updateHeight();
    // 更新 Stats 实例的数据
    stats.update();
    // 使用渲染器渲染场景和相机视图
    renderer.render(scene, camera);
    // 请求下一帧动画继续调用 render 函数
    requestAnimationFrame(render);
}

// 启动渲染循环
render();

// 将渲染器的 DOM 元素添加到页面的 body 中
document.body.append(renderer.domElement);

// 创建一个轨道控制器，用于控制相机
const controls = new OrbitControls(camera, renderer.domElement);
