// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 创建一个 Catmull-Rom 曲线，这是一种平滑的插值曲线，常用于路径动画。
 * 传入一个三维向量数组作为曲线路径上的关键点。
 */
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-100, 20, 90), // 曲线的第一个关键点
    new THREE.Vector3(-40, 80, 100), // 曲线的第二个关键点
    new THREE.Vector3(0, 0, 0), // 曲线的第三个关键点
    new THREE.Vector3(60, -60, 0), // 曲线的第四个关键点
    new THREE.Vector3(100, -40, 80), // 曲线的第五个关键点
    new THREE.Vector3(150, 60, 60) // 曲线的第六个关键点
]);

/**
 * 创建一个管道几何体，沿着指定的曲线路径延伸。
 * @param {THREE.Curve} path - 管道的中心路径，这里使用前面创建的 Catmull-Rom 曲线。
 * @param {number} 100 - 管道方向的分段数，数值越大，管道在曲线方向上越平滑。
 * @param {number} 5 - 管道的半径，即管道的粗细程度。
 * @param {number} 30 - 管道横截面的分段数，数值越大，横截面越接近圆形。
 */
const geometry = new THREE.TubeGeometry(path, 100, 5, 30);

/**
 * 创建一个基础网格材质，用于渲染几何体。
 * @param {Object} options - 材质的配置选项。
 * @param {THREE.Texture} options.map - 颜色贴图，用于定义几何体的表面颜色。
 * @param {THREE.Texture} options.aoMap - 环境光遮蔽贴图，增强几何体的明暗对比。
 * @param {number} options.side - 渲染面的设置，THREE.DoubleSide 表示双面渲染。
 */
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    side: THREE.DoubleSide,
    transparent: true, // 开启透明
    opacity: 0.5 // 设置透明度，范围 0 到 1，数值越小越透明
});

// 创建一个网格对象，将几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 获取曲线的关键点数组
const keyPoints = path.points;

// 创建一个新的 BufferGeometry 来存储点数据
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setFromPoints(keyPoints);

// 创建点材质
const pointMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('blue'),
    size: 15,
    depthWrite: false // 使点不影响深度缓冲区
});

// 创建 Points 对象
const points = new THREE.Points(pointGeometry, pointMaterial);
points.renderOrder = 1; // 设置点的渲染顺序

// 将点对象添加到网格对象中
mesh.add(points);

// 将最终创建的网格对象作为默认导出，供其他模块使用
export default mesh;