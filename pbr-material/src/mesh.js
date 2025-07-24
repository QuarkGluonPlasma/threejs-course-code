// 从 three 库中导入所有模块并命名为 THREE
import * as THREE from 'three';
// 从 three 示例库中导入 lil-gui 模块
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 * 使用 CubeTextureLoader 加载立方体贴图
 * 立方体贴图常用于环境映射，比如反射和折射效果
 */
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图文件所在的路径
    .setPath('../public/forest/')
    // 加载六个面的纹理文件，分别对应右、左、上、下、前、后六个面
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 创建一个圆柱体几何体，参数分别为顶部半径、底部半径、高度
const geometry = new THREE.CylinderGeometry(200, 200, 500);
/**
 * 创建一个基于物理的标准材质
 * 这种材质支持基于物理的渲染（PBR），可以模拟真实世界的光照效果
 */
const material = new THREE.MeshStandardMaterial({
    color: 'orange', // 材质的基础颜色
    roughness: 0, // 材质的粗糙度，0 表示完全光滑，1 表示完全粗糙
    metalness: 1, // 材质的金属度，0 表示非金属，1 表示金属
    envMap: textureCube, // 设置环境映射纹理
    envMapIntensity: 1 // 环境映射的强度
});

// 创建一个 GUI 实例，用于在页面上添加交互控件
const gui = new GUI();
// 添加一个颜色选择器控件，用于修改材质的颜色
gui.addColor(material, 'color');
// 添加一个滑动条控件，用于调整材质的粗糙度，范围从 0 到 1
gui.add(material, 'roughness', 0, 1);
// 添加一个滑动条控件，用于调整材质的金属度，范围从 0 到 1
gui.add(material, 'metalness', 0, 1);
// 添加一个滑动条控件，用于调整环境映射的强度，范围从 0 到 5
gui.add(material, 'envMapIntensity', 0, 5);

// 创建一个网格对象，将几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 导出网格对象，供其他模块使用
export default mesh
