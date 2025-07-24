// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 相关功能
import * as THREE from 'three';
// 导入 lil-gui 库，用于创建图形用户界面，方便在页面上调整材质参数
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * 使用 CubeTextureLoader 加载立方体贴图
 * 立方体贴图常用于环境映射，模拟物体表面对周围环境的反射效果
 */
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图纹理文件所在的基础路径
    .setPath('./forest/')
    // 加载立方体贴图的六个面，分别对应右、左、上、下、前、后
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 创建一个立方体几何体，参数分别为立方体的宽、高、深
const geometry = new THREE.BoxGeometry(300, 300, 300);
/**
 * 创建一个基于物理的材质，支持基于物理的渲染（PBR），能更真实地模拟物体表面材质
 */
const material = new THREE.MeshPhysicalMaterial({
    color: 'black', // 材质的基础颜色
    metalness: 0.8, // 材质的金属度，0 表示非金属，1 表示金属
    roughness: 0.4, // 材质的粗糙度，0 表示完全光滑，1 表示完全粗糙
    clearcoat: 1, // 清漆层的强度，用于模拟物体表面类似清漆的涂层
    clearcoatRoughness: 0.05, // 清漆层的粗糙度
    envMap: textureCube // 设置环境映射纹理，用于反射周围环境
});

// 创建一个 GUI 实例，用于在页面上创建可交互的控件
const gui = new GUI();
// 添加一个颜色选择器控件，允许用户动态修改材质的颜色
gui.addColor(material, 'color');
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的金属度
gui.add(material, 'metalness', 0, 1);
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的粗糙度
gui.add(material, 'roughness', 0, 1);
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整清漆层的强度
gui.add(material, 'clearcoat', 0, 1);
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整清漆层的粗糙度
gui.add(material, 'clearcoatRoughness', 0, 1);

// 创建一个网格对象，将几何体和材质组合在一起，形成一个可渲染的 3D 对象
const mesh = new THREE.Mesh(geometry, material);

// 导出网格对象，供其他模块引入和使用
export default mesh;
