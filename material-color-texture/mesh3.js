/**
 * 导入 Three.js 库的所有模块，将其挂载到 THREE 命名空间下，
 * 借助该命名空间可以使用 Three.js 提供的各类 3D 渲染相关的类和方法。
 */
import * as THREE from 'three';

/**
 * 创建一个纹理加载器对象
 * TextureLoader 用于加载外部的纹理图像文件
 */
const loader = new THREE.TextureLoader();

/**
 * 使用纹理加载器加载指定路径的纹理图像
 * 这里加载的是 './diqiu.jpg' 文件，加载完成后将纹理对象赋值给 texture 变量
 */
const texture = loader.load('./diqiu.jpg');

/**
 * 创建一个球体几何体对象
 * @param {number} 100 - 球体的半径，这里创建一个半径为 100 的球体
 */
const geometry = new THREE.SphereGeometry(100);

/**
 * 创建一个基础网格材质对象
 * 该材质用于定义网格的外观，注释掉了颜色设置，使用加载的纹理贴图
 * @param {Object} options - 材质配置选项
 * @param {THREE.Texture} options.map - 指定应用到材质上的纹理贴图
 */
const material = new THREE.MeshBasicMaterial({
    // color: new THREE.Color('orange'),
    map: texture
});

/**
 * 创建一个网格对象，将几何体和材质组合在一起
 * 通过 Mesh 对象可以将定义好的球体几何体以指定的纹理材质在 Three.js 场景中渲染出来
 */
const mesh = new THREE.Mesh(geometry, material);

/**
 * 导出创建好的网格对象，供其他模块引入使用
 */
export default mesh;
