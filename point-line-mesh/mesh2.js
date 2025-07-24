import * as THREE from 'three';

/**
 * 创建一个平面几何体对象
 * @param {number} 100 - 平面在 X 轴方向的宽度
 * @param {number} 100 - 平面在 Y 轴方向的高度
 * @param {number} 2 - 平面在 X 轴方向的分段数
 * @param {number} 3 - 平面在 Y 轴方向的分段数
 */
const geometry = new THREE.PlaneGeometry(100, 100, 2, 3);

/**
 * 创建一个基础网格材质对象
 * @param {Object} options - 材质配置选项
 * @param {THREE.Color} options.color - 网格的颜色，此处设置为橙色
 * @param {boolean} options.wireframe - 是否以线框模式渲染，设置为 true 表示开启
 */
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true
});

/**
 * 创建一个网格对象，将几何体和材质组合在一起
 * @param {THREE.BufferGeometry} geometry - 几何体对象
 * @param {THREE.Material} material - 材质对象
 */
const mesh = new THREE.Mesh(geometry, material);

/**
 * 将创建好的网格对象打印到控制台，方便调试查看
 */
console.log(mesh);

/**
 * 导出创建好的网格对象，供其他模块引入使用
 */
export default mesh;

