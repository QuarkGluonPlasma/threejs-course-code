// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 相关功能
import * as THREE from 'three';
// 导入 lil-gui 库，用于创建图形用户界面，方便在页面上动态调整材质参数
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * 使用 CubeTextureLoader 加载立方体贴图
 * 立方体贴图常用于环境映射，模拟物体表面对周围环境的反射或折射效果
 */
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图纹理文件所在的基础路径
    .setPath('./city/')
    // 加载立方体贴图的六个面，分别对应右、左、上、下、前、后
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
console.log('==========textureCube',textureCube);
// 创建一个球体几何体，参数 300 表示球体的半径
const geometry = new THREE.SphereGeometry(300);
/**
 * 创建一个基于物理的材质，支持基于物理的渲染（PBR），能更真实地模拟物体表面材质
 */
const material = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', // 材质的基础颜色，这里设置为白色
    metalness: 0, // 材质的金属度，0 表示非金属，1 表示金属
    roughness: 0, // 材质的粗糙度，0 表示完全光滑，1 表示完全粗糙
    transmission: 1, // 材质的透明度，0 表示完全不透明，1 表示完全透明
    envMap: textureCube, // 设置环境映射纹理，用于反射或折射周围环境
    iridescence: 1, // 材质的虹彩效果强度，0 表示无虹彩，1 表示最强虹彩
    iridescenceIOR: 1.8, // 虹彩效果的折射率，控制虹彩颜色的变化
    reflectivity: 1, // 材质的反射率，0 表示无反射，1 表示完全反射
});

// 创建一个 GUI 实例，用于在页面上添加可交互的控件
const gui = new GUI();
// 添加一个颜色选择器控件，允许用户动态修改材质的基础颜色
gui.addColor(material, 'color');
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的虹彩效果强度
gui.add(material, 'iridescence', 0, 1);
// 添加一个滑动条控件，允许用户在 1 到 2.33 的范围内调整虹彩效果的折射率
gui.add(material, 'iridescenceIOR', 1, 2.33);
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的反射率
gui.add(material, 'reflectivity', 0, 1);

// 创建一个网格对象，将几何体和材质组合在一起，形成一个可渲染的 3D 对象
const mesh = new THREE.Mesh(geometry, material);

// 导出网格对象，供其他模块引入和使用
export default mesh;
