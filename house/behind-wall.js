// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个纹理加载器实例，用于加载纹理文件
const loader = new THREE.TextureLoader();
// 使用纹理加载器加载指定路径下的砖墙纹理图片
const texture = loader.load('./zhuan.jpg');
// 设置纹理的颜色空间为 sRGB，确保纹理颜色在渲染时正确显示
texture.colorSpace = THREE.SRGBColorSpace;
// 设置纹理在水平方向上的包裹模式为重复，当纹理尺寸小于几何体时会重复平铺
texture.wrapS = THREE.RepeatWrapping;
// 设置纹理在水平方向上的重复次数为 2，即纹理会在水平方向上重复显示两次
texture.repeat.x = 2;

// 创建一个长方体几何体，尺寸分别为长 4000、高 2000、宽 100，用于表示后墙
const geometry = new THREE.BoxGeometry(4000, 2000, 100);
// 创建一个 MeshLambert 材质，该材质会对光照产生反应
const material = new THREE.MeshLambertMaterial({
    // 注释掉的代码，原本用于设置材质的基础颜色为浅灰色
    // color: new THREE.Color('lightgrey')
    map: texture, // 将加载的纹理作为颜色贴图应用到材质上
    aoMap: texture // 将加载的纹理作为环境光遮蔽贴图应用到材质上，增强明暗对比
});

// 创建一个网格对象，将长方体几何体和 MeshLambert 材质组合在一起，代表房屋的后墙
const behindWall = new THREE.Mesh(geometry, material);
// 将后墙对象沿 Y 轴正方向平移 1150 个单位，调整其在垂直方向上的位置
behindWall.translateY(1150);
// 将后墙对象沿 Z 轴负方向平移 1450 个单位，调整其在深度方向上的位置
behindWall.translateZ(-1450);

// 在控制台打印后墙对象，方便调试查看对象信息
console.log(behindWall);

// 将最终创建的后墙对象作为默认导出，供其他模块使用
export default behindWall;
