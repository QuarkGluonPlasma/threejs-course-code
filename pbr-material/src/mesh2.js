// 导入 three.js 库的所有模块，并将其命名为 THREE
import * as THREE from 'three';
// 导入 lil-gui 库，用于创建图形用户界面，方便调试和交互
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * 使用 CubeTextureLoader 加载立方体贴图
 * 立方体贴图常用于环境映射，模拟物体表面对周围环境的反射或折射效果
 */
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图纹理文件所在的基础路径
    .setPath('./forest/')
    // 加载立方体贴图的六个面，分别对应右、左、上、下、前、后
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 创建一个正十二面体几何体，参数 300 表示几何体的半径
const geometry = new THREE.DodecahedronGeometry(300);
/**
 * 创建一个基于物理的材质，支持更高级的物理渲染特性
 * 该材质可模拟玻璃、水等透明或半透明物体的效果
 */
const material = new THREE.MeshPhysicalMaterial({
    color: 'blue', // 材质的基础颜色
    metalness: 0, // 材质的金属度，0 表示非金属，1 表示金属
    roughness: 0, // 材质的粗糙度，0 表示完全光滑，1 表示完全粗糙
    envMap: textureCube, // 设置环境映射纹理，用于反射或折射周围环境
    transmission: 0.9, // 材质的透明度，0 表示完全不透明，1 表示完全透明
    ior: 1.8, // 材质的折射率，控制光线穿过物体时的弯曲程度
});

// 创建一个 GUI 实例，用于在页面上添加可交互的控件
const gui = new GUI();
// 添加一个颜色选择器控件，允许用户动态修改材质的颜色
gui.addColor(material, 'color');
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的粗糙度
gui.add(material, 'roughness', 0, 1);
// 添加一个滑动条控件，允许用户在 0 到 1 的范围内调整材质的透明度
gui.add(material, 'transmission', 0, 1);
// 添加一个滑动条控件，允许用户在 0 到 2.33 的范围内调整材质的折射率
gui.add(material, 'ior', 0, 2.33);

// 创建一个网格对象，将几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 导出网格对象，供其他模块使用
export default mesh;
