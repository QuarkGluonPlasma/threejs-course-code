// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 BufferGeometry 对象，用于存储和管理几何体数据
const geometry = new THREE.BufferGeometry();

// 定义一个 Float32 类型的数组，存储顶点的坐标信息
// 每个顶点由三个数值表示 (x, y, z)，这里定义了 4 个顶点
const vertices = new Float32Array([
    0, 0, 0,    // 第一个顶点的坐标
    100, 0, 0,  // 第二个顶点的坐标
    0, 100, 0,  // 第三个顶点的坐标
    100, 100, -100 // 第四个顶点的坐标
]);

// 创建一个 BufferAttribute 对象，将顶点数组与每个顶点包含的数值数量（3 个）关联起来
// 这里的 3 表示每个顶点由 3 个数值 (x, y, z) 组成
const attribute = new THREE.BufferAttribute(vertices, 3);
console.log('==========attribute',attribute,vertices);
// 将顶点属性添加到几何体的 position 属性中，用于定义几何体的形状
geometry.attributes.position = attribute;

// 定义一个 Uint16 类型的数组，存储顶点索引信息
// 通过索引指定顶点如何组合成三角形面
// 这里 0, 1, 2 组成一个三角形，2, 1, 3 组成另一个三角形
const indexes = new Uint16Array([
    0, 1, 2, 2, 1, 3
]);
// 创建一个 BufferAttribute 对象，将索引数组与每个索引包含的数值数量（1 个）关联起来
// 这里的 1 表示每个索引是一个单独的数值
geometry.index = new THREE.BufferAttribute(indexes, 1);

// 定义一个 Float32 类型的数组，存储顶点的法线信息
// 法线用于确定光照如何影响几何体表面，每个法线由三个数值表示 (x, y, z)
const normals = new Float32Array([
    0, 0, 1,    // 第一个顶点的法线向量
    0, 0, 1,    // 第二个顶点的法线向量
    0, 0, 1,    // 第三个顶点的法线向量
    1, 1, 0     // 第四个顶点的法线向量
]);
// 创建一个 BufferAttribute 对象，将法线数组与每个法线包含的数值数量（3 个）关联起来
// 这里的 3 表示每个法线由 3 个数值 (x, y, z) 组成
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

// 创建一个 MeshPhongMaterial 对象，该材质会对光照产生反应，能实现高光效果
const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('orange'), // 设置材质的颜色为橙色
    shininess: 1000 // 设置材质的光泽度，值越大高光越亮越集中
});

// 创建一个 Mesh 对象，将几何体和材质组合在一起，形成一个可渲染的网格
const mesh = new THREE.Mesh(geometry, material);

// 将最终创建的网格对象作为默认导出，供其他模块使用
export default mesh;
