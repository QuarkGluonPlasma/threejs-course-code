// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 提供的各类功能
import * as THREE from 'three';
// 导入 lil-gui 库，用于创建图形用户界面，方便在页面上动态调整材质参数
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// 创建一个纹理加载器实例，用于加载纹理文件
const loader = new THREE.TextureLoader();
// 使用纹理加载器加载指定路径下的图片作为纹理
const texture = loader.load('./zhuan.jpg');
// 设置纹理的颜色空间为 SRGB 颜色空间，确保纹理颜色正确显示
texture.colorSpace = THREE.SRGBColorSpace;

// 创建一个圆环几何体，参数分别为圆环的半径和管道的半径
const geometry = new THREE.TorusGeometry(300, 100);
/**
 * 创建一个基于物理的材质，支持更高级的物理渲染特性
 * 该材质可模拟具有光泽表面的物体效果
 */
const material = new THREE.MeshPhysicalMaterial({
    color: 'blue', // 材质的基础颜色
    sheen: 1, // 材质的光泽度，值越大光泽越明显
    sheenRoughness: 1, // 光泽的粗糙度，值越大光泽越模糊
    sheenColor: 'white', // 光泽的颜色
    sheenColorMap: texture // 用于控制光泽颜色的纹理贴图
});

// 创建一个 GUI 实例，用于在页面上添加可交互的控件
const gui = new GUI();
// 添加一个颜色选择器控件，允许用户动态修改材质的基础颜色
gui.addColor(material, 'color');
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的光泽度
gui.add(material, 'sheen', 0, 1);
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整光泽的粗糙度
gui.add(material, 'sheenRoughness', 0, 1);
// 添加一个颜色选择器控件，允许用户动态修改光泽的颜色
gui.addColor(material, 'sheenColor');

// 创建一个网格对象，将几何体和材质组合在一起，形成一个可渲染的 3D 对象
const mesh = new THREE.Mesh(geometry, material);

// 导出网格对象，供其他模块引入和使用
export default mesh;
