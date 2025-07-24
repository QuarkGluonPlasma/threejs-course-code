// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

// 定义第一条直线的起始点，坐标为 (0, 0)
const p1 = new THREE.Vector2(0, 0);
// 定义第一条直线的结束点，坐标为 (100, 100)
const p2 = new THREE.Vector2(100, 100);
// 创建第一条直线曲线对象，连接 p1 和 p2 两点
const line1 = new THREE.LineCurve(p1, p2);

// 创建一个椭圆曲线对象
// 参数依次为：椭圆中心的 x 坐标、y 坐标，椭圆的 x 半轴长度、y 半轴长度，
// 起始角度（弧度制）、结束角度（弧度制）
const arc = new THREE.EllipseCurve(0, 100, 100 , 100, 0, Math.PI);

// 定义第二条直线的起始点，坐标为 (-100, 100)
const p3 = new THREE.Vector2(-100, 100);
// 定义第二条直线的结束点，坐标为 (0, 0)
const p4 = new THREE.Vector2(0, 0);
// 创建第二条直线曲线对象，连接 p3 和 p4 两点
const line2 = new THREE.LineCurve(p3, p4);

// 若要在 arc 椭圆曲线上添加点形状，可按以下步骤操作：

// 从 arc 曲线上获取一系列点。
// 创建点几何体和点材质。
// 将获取的点设置到点几何体中。
// 使用点几何体和点材质创建 Points 对象。
// 将 Points 对象添加到场景中。

/**
 * 从椭圆曲线 arc 上均匀获取 20 个点，返回一个包含这些点的数组。
 * 这些点将用于后续创建点几何体，以展示椭圆曲线上的点位。
 */
const arcPointsArr = arc.getPoints(20);

/**
 * 创建一个点几何体对象，用于存储椭圆曲线上获取的点数据。
 * 该几何体将作为 Three.js 中渲染点的基础数据结构。
 */
const arcPointsGeometry = new THREE.BufferGeometry();

/**
 * 将从椭圆曲线获取的点数组 arcPointsArr 设置到点几何体 arcPointsGeometry 中。
 * 这样，几何体就包含了用于渲染的点位信息。
 */
arcPointsGeometry.setFromPoints(arcPointsArr);

/**
 * 创建一个点材质对象，用于定义点的外观属性。
 * color: 设置点的颜色为红色。
 * size: 设置点的大小为 5。
 */
const arcPointsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('red'),
    size: 5
});

/**
 * 使用之前创建的点几何体 arcPointsGeometry 和点材质 arcPointsMaterial 创建一个 Points 对象。
 * 该对象将在 Three.js 场景中渲染出椭圆曲线上的一系列点。
 */
const points = new THREE.Points(arcPointsGeometry, arcPointsMaterial);

// 创建一个曲线路径对象，用于组合多个曲线
const curvePath = new THREE.CurvePath();
// 将第一条直线曲线添加到曲线路径中
curvePath.add(line1);
// 将椭圆曲线添加到曲线路径中
curvePath.add(arc);
// 将第二条直线曲线添加到曲线路径中
curvePath.add(line2);

// 在组合后的曲线路径上均匀地获取 20 个点，返回一个包含这些点的数组
const pointsArr = curvePath.getPoints(20);
// 创建一个 BufferGeometry 对象，用于存储几何体的顶点数据
const geometry = new THREE.BufferGeometry();
// 将曲线路径上获取的点数据设置到 BufferGeometry 中
geometry.setFromPoints(pointsArr);

// 创建一个基础线条材质，设置线条的颜色为粉色
const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('pink')
});

// 使用之前创建的几何体和材质创建一条线条对象，用于展示组合后的曲线路径
const line = new THREE.Line(geometry, material);

line.add(points);

// 将最终的线条对象作为默认导出，供其他模块使用
export default line;
