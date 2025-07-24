import * as THREE from 'three';
/**
 * 创建一个 BufferGeometry 对象，用于存储几何体的顶点数据。
 * BufferGeometry 是 Three.js 中高效管理和渲染 3D 模型顶点数据的类。
 */
const geometry = new THREE.BufferGeometry();

/**
 * 创建一个 Float32Array 类型的数组，用于存储顶点的坐标。
 * 每个顶点由 x, y, z 三个数值表示，这里定义了 4 个顶点。
 */
const vertices = new Float32Array([
    0, 0, 0,
    100, 0, 0,
    0, 100, 0,
    100, 100, 0
]);

/**
 * 创建一个 BufferAttribute 对象，将顶点数据封装起来。
 * 第二个参数 3 表示每个顶点由 3 个数值（x, y, z）组成。
 */
const attribute = new THREE.BufferAttribute(vertices, 3);
// 将顶点位置属性添加到 BufferGeometry 对象中
geometry.attributes.position = attribute;

/**
 * 创建一个 Uint16Array 类型的数组，用于存储顶点索引。
 * 索引定义了如何通过顶点构建三角形面，这里描述了两个三角形面。
 * 已注释掉的索引序列为另一种可能的索引组合，当前使用的索引序列能正确构建两个相邻的三角形。
 */
const indexes = new Uint16Array([
    // 0, 1, 2, 2, 1, 3
    0, 1, 2, 2, 3, 1
]);
// 将顶点索引数据封装为 BufferAttribute 并设置到 BufferGeometry 的 index 属性上
geometry.index = new THREE.BufferAttribute(indexes, 1);

/**
 * 创建一个 MeshBasicMaterial 对象，用于定义网格的材质。
 * MeshBasicMaterial 是一种基础材质，不受光照影响。
 * 这里设置网格颜色为橙色，注释掉的 side 属性可用于设置渲染面，取消注释可渲染双面。
 */
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    // side: THREE.DoubleSide
});

/**
 * 创建一个 Mesh 对象，将几何体和材质组合成一个网格模型。
 * Mesh 是 Three.js 中用于表示 3D 网格的类。
 */
const mesh = new THREE.Mesh(geometry, material);

/**
 * 导出创建好的网格模型，方便其他模块引入使用。
 */
export default mesh;

