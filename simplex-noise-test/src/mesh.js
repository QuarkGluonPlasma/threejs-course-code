// 导入 Three.js 库
import * as THREE from 'three';
// 从 Three.js 示例模块中导入 SimplexNoise 类
import { SimplexNoise } from 'three/examples/jsm/Addons.js';

// 创建一个平面几何体，宽度和高度均为 3000，横向和纵向细分段数均为 200
const geometry = new THREE.PlaneGeometry(3000, 3000, 200, 200);

// 实例化 SimplexNoise 对象，用于生成 Simplex 噪声
const simplex = new SimplexNoise();

// 获取几何体顶点位置属性
const positions = geometry.attributes.position;

// 遍历几何体的所有顶点
for (let i = 0 ; i < positions.count; i ++) {
    // 获取当前顶点的 x 坐标
    const x = positions.getX(i);
    // 获取当前顶点的 y 坐标
    const y = positions.getY(i);

    // 计算当前顶点的 z 坐标，使用不同频率的 Simplex 噪声叠加
    // 低频噪声，影响整体地形的起伏
    let z = 0
    z = simplex.noise(x / 1000, y / 1000) * 300;
    // 中频噪声，添加一些细节
    z += simplex.noise(x / 400, y / 400) * 100;
    // // 高频噪声，增加更多的细节
    z += simplex.noise(x / 200, y / 200) * 50;

    // 设置当前顶点的 z 坐标
    positions.setZ(i, z);
}

// 创建一个基础网格材质，设置颜色为橙色，并以线框模式显示
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true
});

// 创建一个网格对象，将处理后的几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, material);
// 将网格绕 X 轴逆时针旋转 90 度
mesh.rotateX(- Math.PI / 2);
// 在控制台打印网格对象
console.log(mesh);

// 导出创建好的网格对象
export default mesh;
