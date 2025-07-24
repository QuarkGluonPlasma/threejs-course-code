import * as THREE from 'three';

// 创建一个 BufferGeometry 对象，用于存储几何体的顶点数据
const geometry = new THREE.BufferGeometry();

// 定义一个包含顶点坐标的 Float32Array 数组
// 每个顶点由三个数值表示 (x, y, z)，这里定义了 5 个顶点
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    0, 0, 100,
    100, 100, 0
]);
// 创建一个 BufferAttribute 对象，将顶点数据存储其中，每个顶点由 3 个数值组成
const attribute = new THREE.BufferAttribute(vertices, 3);
// 将顶点属性添加到 BufferGeometry 对象的 position 属性中
geometry.attributes.position = attribute;

// 创建一个点材质对象，用于定义点的外观
const material = new THREE.PointsMaterial({
    // 设置点的颜色为橙色
    color: new THREE.Color('orange'),
    // 设置点的大小为 10
    size: 10
});
// 创建一个 Points 对象，将几何体和材质组合在一起，形成点模型
const points = new THREE.Points(geometry, material);

// 在控制台打印创建好的点模型对象
console.log(points);

// 导出创建好的点模型对象
export default points;
