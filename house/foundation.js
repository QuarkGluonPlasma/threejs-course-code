// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个纹理加载器实例，用于加载纹理文件
const loader = new THREE.TextureLoader();
// 使用纹理加载器加载指定路径下的水泥纹理图片
const texture = loader.load('./shuini.png');
// 设置纹理的颜色空间为 sRGB，确保纹理颜色在渲染时正确显示
texture.colorSpace = THREE.SRGBColorSpace;

// 创建一个长方体几何体，尺寸分别为长 4000、高 300、宽 3000
const geometry = new THREE.BoxGeometry(4000, 300, 3000);
// 创建一个 MeshLambert 材质，该材质会对光照产生反应
const material = new THREE.MeshLambertMaterial({
    // 注释掉的代码，原本用于设置材质的基础颜色为灰色
    // color: new THREE.Color('grey')
    map: texture, // 将加载的纹理作为颜色贴图应用到材质上
    aoMap: texture // 将加载的纹理作为环境光遮蔽贴图应用到材质上
});

// 创建一个网格对象，将长方体几何体和 MeshLambert 材质组合在一起，代表房屋基础
const foundation = new THREE.Mesh(geometry, material);
// 将房屋基础对象沿 Y 轴正方向平移 10 个单位
foundation.translateY(10);
// 将创建好的房屋基础对象作为默认导出，供其他模块使用
export default foundation;
