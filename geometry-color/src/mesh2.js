// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 BufferGeometry 对象，用于存储和管理几何体数据
const geometry = new THREE.BufferGeometry();

// 定义三个二维向量，作为二次贝塞尔曲线的控制点
// 起始点，坐标为 (0, 0)
const p1 = new THREE.Vector2(0, 0);
// 控制点，坐标为 (50, 200)
const p2 = new THREE.Vector2(50, 200);
// 结束点，坐标为 (100, 0)
const p3 = new THREE.Vector2(100, 0);

// 创建一个二次贝塞尔曲线对象，使用上述三个控制点
const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);
// 在曲线上均匀获取 20 个点，返回一个包含这些点的数组
const pointsArr = curve.getPoints(20);

// 将曲线上获取的点设置到 BufferGeometry 中，作为顶点位置数据
geometry.setFromPoints(pointsArr);

// 从几何体中获取顶点位置属性
const positions = geometry.attributes.position;

// 用于存储每个顶点颜色信息的数组
const colorsArr = [];

// 注释掉的代码，原本用于生成渐变颜色
// for (let i = 0; i < positions.count; i++) {
//     const percent = i / positions.count;
//     colorsArr.push(0, percent, 1 - percent);
// }

// 定义两种颜色，用于生成渐变效果
// 起始颜色为橙色
const color1 = new THREE.Color('orange');
// 结束颜色为蓝色
const color2 = new THREE.Color('blue');
// 遍历每个顶点，根据顶点顺序生成渐变颜色
for (let i = 0; i < positions.count; i++) {
    // 计算当前顶点在所有顶点中的比例
    const percent = i / positions.count; 
    // 从起始颜色线性插值到结束颜色，得到当前顶点的颜色
    const c = color1.clone().lerp(color2, percent);
    // 将当前顶点颜色的 RGB 值添加到颜色数组中
    colorsArr.push(c.r, c.g, c.b); 
}

// 将颜色数组转换为 Float32 类型的数组
const colors = new Float32Array(colorsArr);
// 将颜色数组封装为 BufferAttribute 对象，并添加到几何体的 color 属性中
// 这里的 3 表示每个颜色由 3 个值 (R, G, B) 组成
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

// 创建一个线基础材质，启用顶点颜色，让每个顶点的颜色生效
const material = new THREE.LineBasicMaterial({
    vertexColors: true
});
// 创建一个线对象，将几何体和线材质组合在一起
const line = new THREE.Line(geometry, material);

// 将最终创建的线对象作为默认导出，供其他模块使用
export default line;
