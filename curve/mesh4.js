// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

// 定义三次贝塞尔曲线的起始点，使用三维向量表示，坐标为 (-100, 0, 0)
const p1 = new THREE.Vector3(-100, 0, 0);
// 定义三次贝塞尔曲线的第一个控制点，坐标为 (50, 100, 0)
const p2 = new THREE.Vector3(50, 100, 0);
// 定义三次贝塞尔曲线的第二个控制点，坐标为 (100, 0, 100)
const p3 = new THREE.Vector3(100, 0, 100);
// 定义三次贝塞尔曲线的结束点，坐标为 (100, 0, 0)
const p4 = new THREE.Vector3(100, 0, 0);

// 使用 THREE.CubicBezierCurve3 创建一个三维空间中的三次贝塞尔曲线
// 传入起始点、第一个控制点、第二个控制点和结束点
const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4);
// 在曲线上均匀地获取 20 个点，返回一个包含这些点的数组
const pointsArr = curve.getPoints(20);

// 创建一个 BufferGeometry 对象，用于存储几何体的顶点数据
const geometry = new THREE.BufferGeometry();
// 将曲线上获取的点数据设置到 BufferGeometry 中
geometry.setFromPoints(pointsArr);

// 创建一个基础线条材质，设置线条的颜色为橙色
const material = new THREE.LineBasicMaterial({ 
    color: new THREE.Color('orange')
});

// 使用之前创建的几何体和材质创建一条线条对象，用于展示三次贝塞尔曲线
const line = new THREE.Line( geometry, material );

// // 创建点材质
// const pointsMaterial = new THREE.PointsMaterial({
//     color: new THREE.Color('pink'),
//     size: 5
// });

// // 根据之前创建的几何体和点材质创建一个点对象
// const points = new THREE.Points(geometry, pointsMaterial);

// // 将点对象添加到线条对象中 最为其子对象
// line.add(points);

// // 创建球体几何体，参数分别为半径、宽度分段数、高度分段数
// const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
// // 创建球体材质
// const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

// // 在线条上添加球体
// for (let i = 0; i < pointsArr.length; i++) {
//     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//     sphere.position.copy(pointsArr[i]);
//     line.add(sphere);
// }

// // 创建立方体几何体
// const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
// // 创建立方体材质
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// // 在线条上添加立方体
// for (let i = 0; i < pointsArr.length; i++) {
//     const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//     cube.position.copy(pointsArr[i]);
//     line.add(cube);
// }

// 创建圆锥体几何体，参数分别为半径、高度、径向分段数
const coneGeometry = new THREE.ConeGeometry(3, 5, 32);
// 创建圆锥体材质
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// 在线条上添加圆锥体
for (let i = 0; i < pointsArr.length; i++) {
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.copy(pointsArr[i]);
    line.add(cone);
}

// 创建另一个 BufferGeometry 对象，用于存储三次贝塞尔曲线的起始点、控制点和结束点
const geometry2 = new THREE.BufferGeometry();
// 将起始点、控制点和结束点的数据设置到新的 BufferGeometry 中
geometry2.setFromPoints([p1,p2,p3,p4]);
// 创建一个点材质，设置点的颜色为粉色，大小为 5
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('pink'),
    size: 5
});
// 使用新的几何体和点材质创建一个点对象，用于展示三次贝塞尔曲线的关键控制点
const points2 = new THREE.Points(geometry2, material2);
// 使用新的几何体和基础线条材质创建另一条线条对象，用于连接三次贝塞尔曲线的关键控制点
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());
// 将点对象和连接控制点的线条对象添加到展示三次贝塞尔曲线的线条对象中，作为其子对象
line.add(points2, line2);

// 将最终包含曲线、控制点和连接线条的对象作为默认导出，供其他模块使用
export default line;
