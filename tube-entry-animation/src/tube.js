// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 创建一个三次 Catmull-Rom 样条曲线，该曲线由三个三维向量点定义。
 * Catmull-Rom 样条曲线是一种平滑的插值曲线，常用于动画路径等场景。
 */
const path = new THREE.CatmullRomCurve3([
    // 曲线的起始点
    new THREE.Vector3(-1000, 200, 900),
    // 曲线的中间控制点
    new THREE.Vector3(-400, 800, 1000),
    // 曲线的结束点
    new THREE.Vector3(0, 0, 0)
]);

/**
 * 创建一个管状几何体，沿着之前定义的曲线拉伸形成管道形状。
 * @param {THREE.Curve} path - 用于定义管道路径的曲线
 * @param {number} tubularSegments - 管道的分段数，数值越大越平滑
 * @param {number} radius - 管道的半径
 * @param {number} radialSegments - 管道横截面的分段数
 */
const geometry = new THREE.TubeGeometry(path, 100, 50, 30);

/**
 * 创建一个基础网格材质，该材质对光照无反应。
 * @param {Object} options - 材质的配置选项
 * @param {string} options.color - 材质的颜色
 * @param {boolean} options.wireframe - 是否以线框模式显示
 */
const material = new THREE.MeshBasicMaterial({
    color: 'blue',
    wireframe: true
});

/**
 * 创建一个网格对象，将管状几何体和基础网格材质组合在一起。
 * @param {THREE.Geometry} geometry - 几何体对象
 * @param {THREE.Material} material - 材质对象
 */
const tube = new THREE.Mesh(geometry, material);
// 设置管道网格对象的位置
tube.position.set(0, 500, 800);

// 将基础网格材质设置为不可见
material.visible = false;
/**
 * 创建一个点材质，用于渲染点几何体。
 * @param {Object} options - 材质的配置选项
 * @param {string} options.color - 点的颜色
 * @param {number} options.size - 点的大小
 */
const pointsMaterial = new THREE.PointsMaterial({
    color: 'orange',
    size: 3
});
/**
 * 创建一个点对象，将管状几何体和点材质组合在一起。
 * @param {THREE.Geometry} geometry - 几何体对象
 * @param {THREE.Material} material - 材质对象
 */
const points = new THREE.Points(geometry, pointsMaterial);
// 将点对象添加到管道网格对象中
tube.add(points);

/**
 * 从曲线上获取等间距的 1000 个点，并对这些点的位置进行偏移。
 * 偏移后的点位置用于后续可能的动画或交互操作。
 * @returns {Array<THREE.Vector3>} - 偏移后的点数组
 */
export const tubePoints = path.getSpacedPoints(1000).map(item => {
    // 对每个点的 Y 坐标增加 500，Z 坐标增加 800
    return new THREE.Vector3(item.x, item.y + 500, item.z + 800)
});

// 默认导出管道网格对象
export default tube;
