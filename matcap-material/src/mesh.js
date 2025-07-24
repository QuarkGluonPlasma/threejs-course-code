// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 提供的各类功能
import * as THREE from 'three';

// 创建一个纹理加载器实例，用于加载纹理文件
const loader = new THREE.TextureLoader();
// 使用纹理加载器加载指定路径下的 matcap 纹理图片
const texture = loader.load('./matcap1.png');

// 创建一个球体几何体，参数 300 表示球体的半径
const geometry = new  THREE.SphereGeometry(300);
/**
 * 创建一个 Matcap 材质实例
 * Matcap 材质使用 Matcap 纹理来模拟光照效果，不依赖场景中的光源
 */
const material = new THREE.MeshMatcapMaterial({
    color: 'orange', // 设置材质的基础颜色为橙色
    // matcap: texture // 指定使用的 Matcap 纹理
});
// 创建一个网格对象，将几何体和材质组合在一起，形成一个可渲染的 3D 对象
const mesh = new THREE.Mesh(geometry, material);

// 导出网格对象，供其他模块引入和使用
export default mesh;
