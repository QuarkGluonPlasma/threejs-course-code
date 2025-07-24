/**
 * 导入 Three.js 库的所有模块，将其挂载到 THREE 命名空间下，
 * 借助该命名空间可使用 Three.js 提供的各类 3D 渲染相关类和方法。
 */
import * as THREE from 'three';
/**
 * 从 "simplex-noise" 库中导入 createNoise2D 函数，
 * 该函数用于创建一个二维噪声生成器，可生成自然、随机的噪声图案。
 */
import { createNoise2D } from "simplex-noise";

/**
 * 创建一个平面几何体对象。
 * @param {number} 3000 - 平面在 X 轴方向的宽度。
 * @param {number} 3000 - 平面在 Y 轴方向的高度。
 * @param {number} 100 - 平面在 X 轴方向的分段数。
 * @param {number} 100 - 平面在 Y 轴方向的分段数。
 */
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

/**
 * 创建一个二维噪声生成器函数，
 * 后续可调用该函数生成指定坐标处的二维噪声值。
 */
const noise2D = createNoise2D();

/**
 * 更新平面几何体顶点的 Z 坐标，实现动态地形效果。
 * 该函数结合二维噪声和正弦函数来改变顶点高度，让地形产生波动动画。
 */
export function updatePosition() {
    // 获取几何体的顶点位置属性
    const positions = geometry.attributes.position;

    // 遍历所有顶点
    for (let i = 0 ; i < positions.count; i ++) {
        // 获取当前顶点的 X 坐标
        const x = positions.getX(i);
        // 获取当前顶点的 Y 坐标
        const y = positions.getY(i);

        // 使用二维噪声函数计算顶点的基础 Z 坐标，对坐标进行缩放以控制噪声密度，乘以 50 控制高度幅度
        const z = noise2D(x / 300, y / 300) * 50;
        // 使用正弦函数计算随时间变化的高度偏移量，实现波动效果
        const sinNum = Math.sin(Date.now() * 0.002  + x * 0.05) * 10;

        // 设置当前顶点的 Z 坐标为基础 Z 坐标与正弦偏移量之和
        positions.setZ(i, z + sinNum);
    }
    // 标记顶点位置属性需要更新，确保 Three.js 在渲染时使用新的顶点数据
    positions.needsUpdate = true;
}

/**
 * 创建一个基础网格材质对象。
 * @param {Object} options - 材质配置选项。
 * @param {THREE.Color} options.color - 网格的颜色，设置为橙色。
 * @param {boolean} options.wireframe - 是否以线框模式渲染，设置为 true 表示开启。
 */
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true
});

/**
 * 创建一个网格对象，将几何体和材质组合在一起。
 * 借助该网格对象，可将定义好的几何体以指定材质在 Three.js 场景中渲染出来。
 */
const mesh = new THREE.Mesh(geometry, material);
/**
 * 将网格对象绕 X 轴旋转 - Math.PI / 2 弧度（即 -90 度），
 * 使平面从默认的 XY 平面旋转到 XZ 平面。
 */
mesh.rotateX(- Math.PI / 2);
/**
 * 将创建好的网格对象打印到控制台，方便调试查看其属性和结构。
 */
console.log(mesh);

/**
 * 导出创建好的网格对象，供其他模块引入使用。
 */
export default mesh;
