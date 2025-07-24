import * as THREE from 'three';

/**
 * 创建一个 BufferGeometry 对象
 * BufferGeometry 用于高效存储和管理几何体的顶点数据，是 Three.js 中常用的几何体类
 */
const geometry = new THREE.BufferGeometry();

/**
 * 创建一个 Float32Array 类型的数组来存储顶点坐标
 * 每个顶点由 x, y, z 三个浮点数表示，这里定义了 5 个顶点的坐标
 */
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    0, 0, 100,
    100, 100, 0
]);

/**
 * 创建一个 BufferAttribute 对象
 * 将顶点数据 vertices 封装起来，并指定每个顶点由 3 个数值组成
 * BufferAttribute 用于将顶点数据传递给 BufferGeometry
 */
const attribute = new THREE.BufferAttribute(vertices, 3);

/**
 * 将顶点位置属性添加到 BufferGeometry 对象中
 * 这样 BufferGeometry 就知道了几何体的顶点位置信息
 */
geometry.attributes.position = attribute;

/**
 * 创建一个基础线条材质对象
 * 设置线条的颜色为橙色，LineBasicMaterial 用于定义线条的外观
 */
const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('orange')
});

/**
 * 创建一个线条对象
 * 使用之前创建的几何体和材质组合成一个线条，默认会按顶点顺序连接
 */
const line = new THREE.Line(geometry, material);

/**
 * 以下为注释掉的代码，展示不同的线条创建方式
 * LineLoop 会将最后一个顶点和第一个顶点连接，形成闭合的线条
 * LineSegments 会将每两个顶点作为一组，分别连接成线段
 */
// const line = new THREE.LineLoop(geometry, material);
// const line = new THREE.LineSegments(geometry, material);

/**
 * 导出创建好的线条对象，方便其他模块引入使用
 */
export default line;
