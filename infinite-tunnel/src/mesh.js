// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 创建一个圆柱几何体。
 * @param {number} 30 - 圆柱顶部的半径。
 * @param {number} 50 - 圆柱底部的半径。
 * @param {number} 1000 - 圆柱的高度。
 * @param {number} 32 - 圆柱侧面的分段数，数值越大侧面越平滑。
 * @param {number} 32 - 圆柱高度方向的分段数。
 * @param {boolean} true - 是否开启圆柱的顶部和底部封口，这里设置为开启。
 */
const geometry = new THREE.CylinderGeometry( 30, 50, 1000, 32, 32, true);

// 创建一个纹理加载器，用于加载外部纹理文件
const loader = new THREE.TextureLoader();
// 加载指定路径的纹理文件
const texture = loader.load('./storm.png');
// 设置纹理的颜色空间为 sRGB，确保颜色显示正确
texture.colorSpace = THREE.SRGBColorSpace;
// 设置纹理在垂直方向上的包裹模式为重复
texture.wrapT = THREE.RepeatWrapping;
// 设置纹理在水平和垂直方向上的重复次数，这里水平重复 1 次，垂直重复 2 次
texture.repeat.set(1, 2);

/**
 * 创建一个基础网格材质。
 * @param {Object} options - 材质的配置选项。
 * @param {boolean} options.transparent - 是否开启材质的透明度，设置为 true 允许使用透明度贴图。
 * @param {THREE.Texture} options.alphaMap - 透明度贴图，用于控制材质的透明区域。
 * @param {number} options.side - 渲染面的设置，THREE.BackSide 表示只渲染几何体的背面。
 */
const material = new THREE.MeshBasicMaterial({ 
    transparent: true,
    alphaMap: texture,
    side: THREE.BackSide
});

// 创建一个网格对象，将圆柱几何体和基础网格材质组合在一起
const tunnel = new THREE.Mesh(geometry, material);

// 将最终创建的隧道网格对象作为默认导出，供其他模块使用
export default tunnel;
