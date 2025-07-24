// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 定义四个三维向量，作为三次贝塞尔曲线的控制点
// 起始点，位于 X 轴负方向，距离原点 100 个单位
const p1 = new THREE.Vector3(-100, 0, 0);
// 第一个控制点，坐标为 (50, 100, 0)
const p2 = new THREE.Vector3(50, 100, 0);
// 第二个控制点，坐标为 (100, 0, 100)
const p3 = new THREE.Vector3(100, 0, 100);
// 结束点，位于 X 轴正方向，距离原点 100 个单位
const p4 = new THREE.Vector3(100, 0, 0);

// 创建一个三次贝塞尔曲线对象，使用上述四个控制点
const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);

// 创建一个管道几何体，沿着三次贝塞尔曲线生成
// curve: 作为管道路径的曲线
// 50: 管道路径的分段数
// 10: 管道的半径
// 20: 管道横截面的分段数
const geometry = new THREE.TubeGeometry(curve, 50, 10, 20);

// 创建一个 MeshPhong 材质，该材质会对光照产生反应，能实现高光效果
//  MeshLambertMaterial 漫反射材质有种磨砂感，没有高光效果
const material = new THREE.MeshPhongMaterial({
    // 设置材质的颜色为白色
    color: new THREE.Color('white'),
    // 设置材质的光泽度，值越大高光越亮越集中
    shininess: 500
});

// 创建一个网格对象，将管道几何体和 MeshPhong 材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 在控制台打印网格对象，方便调试查看对象信息
console.log(mesh);

// 将最终创建的网格对象作为默认导出，供其他模块使用
export default mesh;
