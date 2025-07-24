// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 注释掉的代码部分：
 * 原本计划通过传入点数组来创建一个形状对象
 * 每个点由 THREE.Vector2 表示二维坐标
 * 但最终未使用该方式创建形状
 */
// const pointsArr = [
//     new THREE.Vector2(100, 0),
//     new THREE.Vector2(50, 20),
//     new THREE.Vector2(0, 0),
//     new THREE.Vector2(0, 50),
//     new THREE.Vector2(50, 100)
// ];

// 通过传入点数组创建一个形状对象，但此代码被注释未使用
// const shape = new THREE.Shape(pointsArr);

// 创建一个新的形状对象
const shape = new THREE.Shape();
// 将绘图光标移动到指定的二维坐标 (100, 0)，作为形状的起始点
shape.moveTo(100, 0);
// 从当前光标位置绘制一条直线到指定坐标 (0, 0)
shape.lineTo(0, 0);
// 继续从当前位置绘制一条直线到指定坐标 (0, 50)
shape.lineTo(0, 50);
// 再从当前位置绘制一条直线到指定坐标 (80, 100)，完成形状的轮廓绘制
shape.lineTo(80, 100);

// 创建一个新的路径对象，用于定义形状中的孔洞
const path = new THREE.Path();
// 在路径中添加一个圆弧，圆心位于 (50, 50)，半径为 10，默认角度范围为 0 到 2π
path.arc(50, 50, 10);
// 将路径对象作为孔洞添加到形状对象中
shape.holes.push(path);

// 通过形状对象创建一个平面形状几何体，此代码被注释未使用
// const geometry = new THREE.ShapeGeometry(shape);
/**
 * 通过形状对象创建一个拉伸几何体
 * 第一个参数为要拉伸的形状对象
 * 第二个参数为拉伸配置对象，depth 表示拉伸的深度
 */
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 50
});
/**
 * 创建一个 MeshLambert 材质，该材质会对光照产生反应
 * color 属性设置材质的颜色为浅绿色
 */
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color('lightgreen')
});

// 创建一个网格对象，将拉伸几何体和 MeshLambert 材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 将最终创建的网格对象作为默认导出，供其他模块使用
export default mesh;
