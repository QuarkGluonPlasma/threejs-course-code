/**
 * 导入 Three.js 库的所有模块，将其挂载到 THREE 命名空间下，
 * 借助该命名空间可使用 Three.js 提供的各类 3D 渲染相关的类和方法。
 */
import * as THREE from 'three';

/**
 * 创建一个纹理加载器对象
 * TextureLoader 用于从指定路径加载外部的纹理图像文件
 */
const loader = new THREE.TextureLoader();
/**
 * 使用纹理加载器加载 './zhuan.jpg' 图像文件作为纹理
 * 加载完成后将对应的纹理对象赋值给 texture 变量
 */
const texture = loader.load('./zhuan.jpg');

/**
 * 设置纹理在 S 轴（U 坐标，通常对应纹理的水平方向）的环绕模式
 * THREE.RepeatWrapping 表示纹理将在超出原始范围时重复显示
 */
texture.wrapS = THREE.RepeatWrapping;
/**
 * 设置纹理在 T 轴（V 坐标，通常对应纹理的垂直方向）的环绕模式
 * THREE.RepeatWrapping 表示纹理将在超出原始范围时重复显示
 */
texture.wrapT = THREE.RepeatWrapping;
/**
 * 设置纹理在 S 轴和 T 轴的重复次数
 * 这里设置为 (3, 3)，意味着纹理将在水平和垂直方向分别重复 3 次
 */
texture.repeat.set(3, 3);
/**
 * 设置纹理的颜色空间为 SRGB 颜色空间
 * SRGB 是常见的颜色空间，能正确处理纹理的颜色显示
 */
texture.colorSpace = THREE.SRGBColorSpace;

/**
 * 创建一个平面几何体对象
 * @param {number} 1000 - 平面在 X 轴方向的宽度
 * @param {number} 1000 - 平面在 Y 轴方向的高度
 */
const geometry = new THREE.PlaneGeometry(1000, 1000);

/**
 * 创建一个基础网格材质对象
 * 该材质用于定义网格的外观，将加载的纹理分别应用为普通贴图和环境遮挡贴图
 * @param {Object} options - 材质配置选项
 * @param {THREE.Texture} options.map - 指定应用到材质上的基础纹理贴图
 * @param {THREE.Texture} options.aoMap - 指定应用到材质上的环境遮挡纹理贴图
 */
const material = new THREE.MeshBasicMaterial({
    map: texture,
    aoMap: texture
});

/**
 * 创建一个网格对象，将几何体和材质组合在一起
 * 通过 Mesh 对象可将定义好的平面几何体以指定的纹理材质在 Three.js 场景中渲染出来
 */
const mesh = new THREE.Mesh(geometry, material);

/**
 * 导出创建好的网格对象，供其他模块引入使用
 */
export default mesh;
