// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 导入 lil-gui 库，用于创建图形用户界面
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// 定义三次贝塞尔曲线的四个控制点
// 起始点 曲线的起始点
const p1 = new THREE.Vector3(-100, 0, 0);
// 第一个控制点  控制点会影响曲线的形状，曲线会朝着控制点的方向弯曲
const p2 = new THREE.Vector3(50, 100, 0);
// 第二个控制点 控制点会影响曲线的形状，曲线会朝着控制点的方向弯曲
const p3 = new THREE.Vector3(100, 0, 100);
// 结束点
const p4 = new THREE.Vector3(100, 0, 0);

// 创建一个三次贝塞尔曲线对象，通过四个控制点定义曲线形状
// 三次贝塞尔曲线是一种数学曲线，常用于计算机图形学中绘制平滑曲线。
const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

// 创建管道几何体   创建了一个沿着三次贝塞尔曲线延伸的管道几何体
// THREE.TubeGeometry：Three.js 提供的一个类，用于创建沿着指定曲线路径延伸的管道几何体
// 参数依次为：曲线路径、管道方向的分段数、管道半径、横截面的分段数(即管道横截面的多边形边数。数值越大，横截面越接近圆形，默认值为 8)
// THREE.TubeGeometry 会在曲线上的每个分段点处创建一个垂直于曲线的横截面，然后将这些横截面连接起来形成一个管道形状。通过调整分段数和半径，可以控制管道的平滑度和粗细。
const geometry = new THREE.TubeGeometry(curve, 50, 20, 20);

// 创建 MeshLambert 材质，该材质会对光照产生反应
// color: 材质颜色设置为橙色
// side: 双面渲染，确保从内外都能看到几何体
// wireframe: 以线框模式渲染几何体
const materail = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange'),
    side: THREE.DoubleSide,
    wireframe: true
});

// 创建网格对象，将几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, materail);

// 创建一个 GUI 实例，用于创建可交互的控制面板
const gui = new GUI();

// 定义一个对象，存储可调节的参数及其初始值
const obj = {
    tubularSegments: 50, // 管道方向分段数
    radius: 20, // 管道半径
    radialSegments: 20 // 横截面分段数
}

// 当 GUI 中的参数发生变化时调用的函数
function onChange() {
    // 根据新的参数重新创建管道几何体，并更新网格对象的几何体
    console.log('==========obj',obj);
    mesh.geometry = new THREE.TubeGeometry(
        curve,
        obj.tubularSegments,
        obj.radius,
        obj.radialSegments
    );
}

// 在 GUI 中添加管道方向分段数的调节滑块
// min: 最小值为 3
// max: 最大值为 100
// step: 步长为 1
// name: 显示的名称为“管道方向分段数”
// onChange: 参数变化时调用 onChange 函数
gui.add(obj, 'tubularSegments').onChange(onChange)
    .min(3).max(100).step(1).name('管道方向分段数');
// 在 GUI 中添加半径的调节滑块
gui.add(obj, 'radius').onChange(onChange)
    .min(10).max(100).step(0.1).name('半径');
// 在 GUI 中添加横截面分段数的调节滑块
gui.add(obj, 'radialSegments').onChange(onChange)
    .min(3).max(100).step(1).name('横截面分段数');

// 创建一个 BufferGeometry 对象，用于存储控制点的顶点数据
// THREE.BufferGeometry：Three.js 里用于高效存储和管理几何体顶点数据的类。和 THREE.Geometry 相比，BufferGeometry 能直接将数据以二进制形式存储在 GPU 缓冲区，从而提升渲染性能。
const geometry2 = new THREE.BufferGeometry();
// 将四个控制点的坐标设置为几何体的顶点数据
// setFromPoints：BufferGeometry 的方法，用于把传入的点数组设置为几何体的顶点数据。
geometry2.setFromPoints([p1,p2,p3,p4]);

// 创建点材质，用于渲染控制点
// color: 点的颜色设置为蓝色
// size: 点的大小设置为 10
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('blue'),
    size: 10
});

// 创建点对象，将存储控制点的几何体和点材质组合在一起
const points2 = new THREE.Points(geometry2, material2);
// 创建线对象，将存储控制点的几何体和基础线条材质组合在一起
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());

// 将点对象和线对象添加到网格对象中，作为其子对象
mesh.add(points2, line2);

// 将最终的网格对象作为默认导出，供其他模块使用
export default mesh;
