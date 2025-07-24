// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 BufferGeometry 对象，用于存储和管理几何体的顶点数据
const geometry = new THREE.BufferGeometry();

// 定义三角形的三个顶点，使用 Vector3 表示三维空间中的点
// 第一个顶点，位于原点 (0, 0, 0)
const point1 = new THREE.Vector3(0, 0, 0);
// 第二个顶点，位于 X 轴正方向 300 单位处
const point2 = new THREE.Vector3(300, 0, 0);
// 第三个顶点，位于 Y 轴正方向 300 单位处
const point3 = new THREE.Vector3(0, 300, 0);

// 将定义好的三个顶点数据设置到 BufferGeometry 中，用于构建几何体
geometry.setFromPoints([point1, point2, point3]);

// 创建一个基础网格材质，设置材质颜色为橙色
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange')
});

// 创建一个网格对象，将几何体和材质组合在一起，形成一个可渲染的三角形
const mesh = new THREE.Mesh(geometry, material);

// 创建一个射线对象，射线用于检测与其他物体的相交情况
const ray = new THREE.Ray();
// 设置射线的起始点，位于 (50, 50, 100)
ray.origin.set(50, 50, 100);
// 设置射线的方向，沿着 Z 轴负方向
ray.direction = new THREE.Vector3(0, 0, -1);

// 创建一个箭头辅助对象，用于可视化射线
// 参数分别为：射线方向、射线起始点、箭头长度、箭头颜色
const arrowHelper = new THREE.ArrowHelper(ray.direction, ray.origin, 1000, new THREE.Color('pink'));
// 将箭头辅助对象添加到网格对象中，使其随网格一起渲染
mesh.add(arrowHelper);

// 创建一个 Vector3 对象，用于存储射线与三角形相交的交点坐标
const point = new THREE.Vector3();
/**
 * 检测射线与三角形是否相交，并将交点坐标存储在 point 中
 * @param {THREE.Vector3} point1 - 三角形的第一个顶点
 * @param {THREE.Vector3} point2 - 三角形的第二个顶点
 * @param {THREE.Vector3} point3 - 三角形的第三个顶点
 * @param {boolean} false - 是否开启背面剔除，false 表示不剔除
 * @param {THREE.Vector3} point - 用于存储交点坐标的 Vector3 对象
 */
ray.intersectTriangle(point1, point2, point3, false, point);
// 在控制台打印射线与三角形的交点坐标
console.log(point);

// 将最终创建的网格对象作为默认导出，供其他模块使用
export default mesh;
