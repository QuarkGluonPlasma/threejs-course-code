/**
 * 导入 Three.js 库的所有模块，并将其挂载到 THREE 命名空间下，
 * 后续可通过该命名空间使用 Three.js 提供的各种类和方法。
 */
import * as THREE from 'three';

/**
 * 创建一个椭圆曲线对象
 * @param {number} 0 - 椭圆中心的 X 坐标
 * @param {number} 0 - 椭圆中心的 Y 坐标
 * @param {number} 100 - 椭圆在 X 轴方向的半径
 * @param {number} 100 - 椭圆在 Y 轴方向的半径
 * @param {number} 0 - 曲线起始角度（弧度制）
 * @param {number} Math.PI / 2 - 曲线结束角度（弧度制），这里表示从 0 到 π/2，即四分之一椭圆
 */
const arc = new THREE.EllipseCurve(0, 0, 100, 100, 0, Math.PI / 2 );

/**
 * 在椭圆曲线上均匀获取 50 个点，返回一个包含这些点的数组
 * 这些点将用于后续创建几何体
 */
const pointsList = arc.getPoints(20);

/**
 * 创建一个缓冲几何体对象
 * 缓冲几何体使用缓冲区来存储顶点数据，能提升渲染性能
 */
const geometry = new THREE.BufferGeometry();

/**
 * 将之前获取的点数组赋值给几何体，作为几何体的顶点数据
 */
geometry.setFromPoints(pointsList);

/**
 * 以下代码被注释，功能为创建点云对象
 *  
 */
// 创建一个点材质对象
// 该材质用于定义点云的外观，设置点的颜色为橙色，大小为 10
const material = new THREE.PointsMaterial({
    color: new THREE.Color('orange'),
    size: 5
});

// 创建一个点云对象，将几何体和点材质组合在一起
const points = new THREE.Points(geometry, material);

// 将创建好的点云对象打印到控制台，方便调试查看其属性和结构
console.log(points);


/**
 * 创建一个线条基础材质对象
 * 该材质用于定义线条的外观，设置线条颜色为橙色
 */
// const material = new THREE.LineBasicMaterial({
//     color: new THREE.Color('orange')
// });

// /**
//  * 创建一个线条对象，将几何体和线条材质组合在一起
//  * 通过该 Line 对象，可将之前定义的点连接成线条进行渲染
//  */
// const line = new THREE.Line(geometry, material);

/**
 * 导出创建好的线条对象，供其他模块引入使用
 */
export default points;
