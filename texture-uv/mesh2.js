/**
 * 导入 Three.js 库的所有模块，将其挂载到 THREE 命名空间下，
 * 后续可通过该命名空间访问 Three.js 提供的各类类和方法。
 */
import * as THREE from 'three';

/**
 * 创建一个纹理加载器对象，用于从指定路径加载纹理图像文件。
 */
const loader = new THREE.TextureLoader();
/**
 * 使用纹理加载器加载 './muxing.jpg' 图像文件，将其作为纹理。
 * 加载完成后，对应的纹理对象会被赋值给 texture 变量。
 */
const texture = loader.load('./muxing.jpg');
/**
 * 设置纹理的颜色空间为 SRGB 颜色空间，确保纹理颜色能正确显示。
 */
texture.colorSpace = THREE.SRGBColorSpace;
/**
 * 设置纹理在 T 轴（V 坐标，通常对应纹理垂直方向）的环绕模式为重复显示。
 * 当纹理在垂直方向超出原始范围时，会重复渲染纹理。
 */
texture.wrapS = THREE.RepeatWrapping;

/**
 * 创建一个球体几何体对象。
 * @param {number} 50 - 球体的半径，此处创建半径为 50 的球体。
 */
const geometry = new THREE.SphereGeometry(50);

/**
 * 创建一个基础网格材质对象。
 * 该材质用于定义网格的外观，将加载的纹理指定为材质的贴图。
 * @param {Object} options - 材质配置选项
 * @param {THREE.Texture} options.map - 应用到材质上的纹理贴图
 */
const material = new THREE.MeshBasicMaterial({
    map: texture
});

/**
 * 创建一个网格对象，将几何体和材质组合在一起。
 * 通过该 Mesh 对象，可将定义好的球体几何体以指定纹理材质在 Three.js 场景中渲染出来。
 */
const mesh = new THREE.Mesh(geometry, material);

/**
 * 导出创建好的网格对象，供其他模块引入使用。
 */
export default mesh;
