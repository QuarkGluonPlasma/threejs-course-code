// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

// 定义二次贝塞尔曲线的起始点，坐标为 (0, 0)
const p1 = new THREE.Vector2(0, 0);
// 定义二次贝塞尔曲线的控制点，坐标为 (50, 200)
const p2 = new THREE.Vector2(50, 200);
// 定义二次贝塞尔曲线的结束点，坐标为 (100, 0)
const p3 = new THREE.Vector2(100, 0);

// 使用 THREE.QuadraticBezierCurve 创建一个二次贝塞尔曲线，传入起始点、控制点和结束点
const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);
// 在曲线上均匀地获取 20 个点，返回一个包含这些点的数组
const pointsArr = curve.getPoints(20);

// 创建一个 BufferGeometry 对象，用于存储几何体数据
const geometry = new THREE.BufferGeometry();
// 将曲线上获取的点数据设置到 BufferGeometry 中
geometry.setFromPoints(pointsArr);

// 创建一个基础线条材质，设置线条颜色为橙色
const material = new THREE.LineBasicMaterial({ 
    color: new THREE.Color('orange')
});

// 使用之前创建的几何体和材质创建一条线条对象，用于展示二次贝塞尔曲线
const line = new THREE.Line( geometry, material );

// 创建另一个 BufferGeometry 对象，用于存储贝塞尔曲线的起始点、控制点和结束点
const geometry2 = new THREE.BufferGeometry();
// 将起始点、控制点和结束点数据设置到新的 BufferGeometry 中
geometry2.setFromPoints([p1, p2, p3]);
// 创建一个点材质，设置点的颜色为粉色，大小为 5
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('pink'),
    size: 5
});
// 使用新的几何体和点材质创建一个点对象，用于展示贝塞尔曲线的关键控制点
const points2 = new THREE.Points(geometry2, material2);
// 使用新的几何体和基础线条材质创建另一条线条对象，用于连接贝塞尔曲线的关键控制点
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
// 将点对象和连接控制点的线条对象添加到展示二次贝塞尔曲线的线条对象中，作为其子对象
line.add(points2, line2);

// 将最终包含曲线、控制点和连接线条的对象作为默认导出，供其他模块使用
export default line;
