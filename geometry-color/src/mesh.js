// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 BufferGeometry 对象，用于存储和管理几何体数据
const geometry = new THREE.BufferGeometry();

// 定义三个三维向量，作为三角形的三个顶点
// 第一个顶点，位于原点 (0, 0, 0)
const point1 = new THREE.Vector3(0, 0, 0);
// 第二个顶点，位于 Y 轴正方向 100 单位处
const point2 = new THREE.Vector3(0, 100, 0);
// 第三个顶点，位于 X 轴正方向 100 单位处
const point3 = new THREE.Vector3(100, 0, 0);
// 将三个顶点数据设置到 BufferGeometry 中
geometry.setFromPoints([point1, point2, point3]);

// 定义一个 Float32 类型的数组，存储每个顶点的颜色信息
// 每个顶点的颜色由 RGB 三个值表示，范围从 0 到 1
// 第一个顶点颜色为红色 (1, 0, 0)
// 第二个顶点颜色为绿色 (0, 1, 0)
// 第三个顶点颜色为蓝色 (0, 0, 1)
const colors = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);
// 将颜色数组封装为 BufferAttribute 对象，并添加到几何体的 color 属性中
// 这里的 3 表示每个颜色由 3 个值 (R, G, B) 组成
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

// 以下代码为注释掉的点渲染相关代码
// 创建一个点材质，启用顶点颜色，设置点的大小为 30
// const material = new THREE.PointsMaterial({
//     vertexColors:true,
//     size: 30,
// });

// 创建一个点对象，将几何体和点材质组合在一起
// const points = new THREE.Points(geometry, material);

// 将点对象作为默认导出，供其他模块使用
// export default points;

// 以下代码为注释掉的线渲染相关代码
// 创建一个线基础材质，启用顶点颜色
// const material = new THREE.LineBasicMaterial({
//     vertexColors: true
// });

// 创建一个闭合线对象，将几何体和线材质组合在一起
// const line = new THREE.LineLoop(geometry, material);

// 将闭合线对象作为默认导出，供其他模块使用
// export default line;

// 创建一个网格基础材质，启用顶点颜色
const material = new THREE.MeshBasicMaterial({
    vertexColors: true
});

// 创建一个网格对象，将几何体和网格材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 将网格对象作为默认导出，供其他模块使用
export default mesh;
