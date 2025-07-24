// 导入 Three.js 库的所有模块，将其挂载到 THREE 命名空间下，后续可通过该命名空间使用 Three.js 提供的各类功能
import * as THREE from 'three';

// 创建一个立方体几何体对象
// 参数分别表示立方体在 X、Y、Z 轴方向的尺寸，这里创建了一个边长为 100 的立方体
const boxGeometry = new THREE.BoxGeometry(100, 100, 100);

// 基于立方体几何体创建一个边缘几何体对象
// EdgesGeometry 会提取原几何体的边缘线条，用于后续绘制几何体的边缘
const geometry = new THREE.EdgesGeometry(boxGeometry);

// color：设置线条的颜色为橙色；dashSize：设置虚线线段的长度；gapSize：设置虚线间隙的长度
const material = new THREE.LineDashedMaterial({
    color: new THREE.Color('orange'),
    dashSize: 10,
    gapSize: 10
});

// 创建一个线条对象，将边缘几何体和虚线材质组合在一起
// 这样就能以虚线形式绘制出立方体的边缘
const line = new THREE.Line(geometry, material);
// 计算线条上每个点到起点的累积距离，这是使用虚线材质时必须调用的方法，确保虚线效果正常显示
line.computeLineDistances();

// 将创建好的线条对象打印到控制台，方便调试查看其属性和结构
console.log(line);

// 导出创建好的线条对象，供其他模块引入使用
export default line;
