/**
 * 导入 Three.js 库的所有模块，将其挂载到 THREE 命名空间下，
 * 后续可通过该命名空间使用 Three.js 提供的各类功能。
 */
import * as THREE from 'three';

/**
 * 创建一个平面几何体对象
 * @param {number} 200 - 平面在 X 轴方向的宽度
 * @param {number} 100 - 平面在 Y 轴方向的高度
 */
const geometry = new THREE.PlaneGeometry(200, 100);

/**
 * 定义平面几何体的 UV 坐标数组
 * UV 坐标用于将纹理映射到几何体表面，取值范围在 0 到 1 之间
 * 每对值分别表示纹理的 U（水平）和 V（垂直）坐标
 */
const uvs = new Float32Array([
    0, 0.5,    // 第一个顶点的 UV 坐标
    0.5, 0.5,  // 第二个顶点的 UV 坐标
    0, 0,      // 第三个顶点的 UV 坐标
    0.5, 0     // 第四个顶点的 UV 坐标
]);

/**
 * 为几何体的 UV 属性赋值
 * 创建一个 BufferAttribute 对象，将 UV 坐标数组传入，每个顶点有 2 个 UV 坐标值
 */
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);

/**
 * 创建一个纹理加载器对象
 * TextureLoader 用于从指定路径加载外部的纹理图像文件
 */
const loader = new THREE.TextureLoader();
/**
 * 使用纹理加载器加载 './bg.png' 图像文件作为纹理
 * 加载完成后将对应的纹理对象赋值给 texture 变量
 */
const texture = loader.load('./bg.png');
/**
 * 设置纹理的颜色空间为 SRGB 颜色空间
 * SRGB 是常见的颜色空间，能正确处理纹理的颜色显示
 */
texture.colorSpace = THREE.SRGBColorSpace;

/**
 * 创建一个基础网格材质对象
 * 此处存在语法错误，多了一个左括号，该材质用于定义网格的外观，使用加载的纹理贴图
 * @param {Object} options - 材质配置选项
 * @param {THREE.Texture} options.map - 指定应用到材质上的纹理贴图
 */
const material = new THREE.MeshBasicMaterial(({
    map: texture
}));

/**
 * 创建一个网格对象，将几何体和材质组合在一起
 * 通过 Mesh 对象可以将定义好的平面几何体以指定的纹理材质在 Three.js 场景中渲染出来
 */
const mesh = new THREE.Mesh(geometry, material);

/**
 * 将创建好的网格对象打印到控制台，方便调试查看其属性和结构
 */
console.log(mesh);

/**
 * 导出创建好的网格对象，供其他模块引入使用
 */
export default mesh;
