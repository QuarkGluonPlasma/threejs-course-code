// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 创建一个形状对象，用于定义墙体的二维轮廓
 * 后续通过一系列方法绘制墙体的轮廓路径
 */
const shape = new THREE.Shape();
// 将绘图游标移动到起始点 (0, 0)
shape.moveTo(0, 0);
// 从当前点绘制一条直线到点 (0, 2000)
shape.lineTo(0, 2000);
// 从当前点绘制一条直线到点 (-1500, 3000)
shape.lineTo(-1500, 3000);
// 从当前点绘制一条直线到点 (-3000, 2000)
shape.lineTo(-3000, 2000);
// 从当前点绘制一条直线到点 (-3000, 0)，完成墙体轮廓的绘制
shape.lineTo(-3000, 0);

/**
 * 创建一个路径对象，用于定义墙体上窗户的形状
 * 后续通过一系列方法绘制窗户的轮廓路径
 */
const windowPath = new THREE.Path();
// 将绘图游标移动到窗户的起始点 (-600, 400)
windowPath.moveTo(-600, 400);
// 从当前点绘制一条直线到点 (-600, 1600)
windowPath.lineTo(-600, 1600);
// 从当前点绘制一条直线到点 (-2400, 1600)
windowPath.lineTo(-2400, 1600);
// 从当前点绘制一条直线到点 (-2400, 400)，完成窗户轮廓的绘制
windowPath.lineTo(-2400, 400);
// 将窗户路径添加到墙体形状的孔洞数组中，以便在后续生成几何体时创建窗户
shape.holes.push(windowPath);

/**
 * 创建一个拉伸几何体，将之前定义的二维形状沿 Z 轴方向拉伸
 * @param {THREE.Shape} shape - 要拉伸的二维形状
 * @param {Object} options - 拉伸的配置选项
 * @param {number} options.depth - 拉伸的深度，即墙体的厚度
 */
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 100
});

// 创建一个纹理加载器，用于加载外部纹理文件
const loader = new THREE.TextureLoader();
// 加载指定路径的砖墙纹理文件
const texture = loader.load('./zhuan.jpg');
// 设置纹理的颜色空间为 sRGB，确保颜色显示正确
texture.colorSpace = THREE.SRGBColorSpace;
// 设置纹理在水平方向上的包裹模式为重复
texture.wrapS = THREE.RepeatWrapping;
// 设置纹理在垂直方向上的包裹模式为重复
texture.wrapT = THREE.RepeatWrapping;
// 设置纹理在水平方向上的重复次数
texture.repeat.x = 0.0005;
// 设置纹理在垂直方向上的重复次数
texture.repeat.y = 0.0005;

/**
 * 创建一个 MeshLambert 材质，该材质会对光照产生反应
 * @param {Object} options - 材质的配置选项
 * @param {THREE.Texture} options.map - 颜色贴图，用于定义几何体的表面颜色
 * @param {THREE.Texture} options.aoMap - 环境光遮蔽贴图，增强几何体的明暗对比
 */
const material = new THREE.MeshLambertMaterial({
    // 注释掉的代码，原本用于设置材质的基础颜色为浅灰色
    // color: new THREE.Color('lightgrey')
    map: texture,
    aoMap: texture
});

// 创建一个网格对象，将拉伸几何体和 MeshLambert 材质组合在一起，代表侧墙
const sideWall = new THREE.Mesh(geometry, material);

// 在控制台打印侧墙对象，方便调试
console.log(sideWall);

// 将最终创建的侧墙对象作为默认导出，供其他模块使用
export default sideWall;
