// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

// 定义一个包含 THREE.Vector2 实例的数组，这些实例代表二维平面上的点
const arr = [
    // 第一个点，坐标为 (-100, 0)
    new THREE.Vector2( -100, 0 ),
    // 第二个点，坐标为 (-50, 50)
    new THREE.Vector2( -50, 50 ),
    // 第三个点，坐标为 (0, 0)
    new THREE.Vector2( 0, 0 ),
    // 第四个点，坐标为 (50, -50)
    new THREE.Vector2( 50, -50 ),
    // 第五个点，坐标为 (100, -30)
    new THREE.Vector2( 100, -30),
    // 第六个点，坐标为 (100, 0)
    new THREE.Vector2( 100, 0 )
];

// 使用 SplineCurve 创建一个样条曲线，该曲线会平滑地通过 arr 数组中的所有点
const curve = new THREE.SplineCurve(arr);
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

// 使用之前创建的几何体和材质创建一条线条对象
const line = new THREE.Line( geometry, material );

// 创建一个点材质，设置点的颜色为粉色，大小为 5
const pointsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('pink'),
    size: 5
});

// 使用之前创建的几何体和点材质创建一个点对象
const points = new THREE.Points(geometry, pointsMaterial);
// 将点对象添加到线条对象中，作为其子对象
line.add(points);

// 创建另一个 BufferGeometry 对象，用于存储原始点数据
const geometry2 = new THREE.BufferGeometry();
// 将原始点数组 arr 中的数据设置到新的 BufferGeometry 中
geometry2.setFromPoints(arr);
// 创建另一个点材质，设置点的颜色为绿色，大小为 10
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('green'),
    size: 10
});

// 使用新的几何体和点材质创建另一个点对象
const points2 = new THREE.Points(geometry2, material2);
// 使用新的几何体和基础线条材质创建另一条线条对象
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
// 将新的点对象和线条对象添加到之前的线条对象中，作为其子对象
line.add(points2, line2);

// 将最终的线条对象作为默认导出，供其他模块使用
export default line;
