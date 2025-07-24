// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个形状对象，用于定义门阶的二维轮廓
const shape = new THREE.Shape();
// 将绘图游标移动到起始点 (0, 0)
shape.moveTo(0, 0);
// 从当前点绘制一条直线到点 (200, 0)
shape.lineTo(200, 0);
// 从当前点绘制一条直线到点 (200, -100)
shape.lineTo(200, -100);
// 从当前点绘制一条直线到点 (400, -100)
shape.lineTo(400, -100);
// 从当前点绘制一条直线到点 (400, -200)
shape.lineTo(400, -200);
// 从当前点绘制一条直线到点 (600, -200)
shape.lineTo(600, -200);
// 从当前点绘制一条直线到点 (600, -300)
shape.lineTo(600, -300);
// 从当前点绘制一条直线到点 (0, -300)，完成门阶二维轮廓的绘制
shape.lineTo(0, -300);

/**
 * 创建一个拉伸几何体，将之前定义的二维形状沿 Z 轴方向拉伸
 * @param {THREE.Shape} shape - 要拉伸的二维形状
 * @param {Object} options - 拉伸的配置选项
 * @param {number} options.depth - 拉伸的深度，即门阶的厚度
 */
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1000,
    
});

// 创建一个纹理加载器，用于加载外部纹理文件
const loader = new THREE.TextureLoader();
// 加载指定路径的水泥纹理文件
const texture = loader.load('./shuini.png');
// 设置纹理的颜色空间为 sRGB，确保颜色显示正确
texture.colorSpace = THREE.SRGBColorSpace;
// 设置纹理在水平方向上的包裹模式为重复
texture.wrapS = THREE.RepeatWrapping;
// 设置纹理在垂直方向上的包裹模式为重复
texture.wrapT = THREE.RepeatWrapping;
// 设置纹理在水平方向上的重复次数
texture.repeat.x = 0.001;
// 设置纹理在垂直方向上的重复次数
texture.repeat.y = 0.001;

/**
 * 创建一个 MeshLambert 材质，该材质会对光照产生反应
 * @param {Object} options - 材质的配置选项
 * @param {THREE.Texture} options.map - 颜色贴图，用于定义几何体的表面颜色
 * @param {THREE.Texture} options.aoMap - 环境光遮蔽贴图，增强几何体的明暗对比
 */
const material = new THREE.MeshLambertMaterial({
    // 注释掉的代码，原本用于设置材质的基础颜色为灰色
    // color: new THREE.Color('grey'),
    map: texture,
    aoMap: texture
});

// 创建一个网格对象，将拉伸几何体和 MeshLambert 材质组合在一起，代表门阶
const doorstep = new THREE.Mesh(geometry, material);
// 绕 Y 轴逆时针旋转 90 度（-π/2 弧度）
doorstep.rotateY(-Math.PI / 2);
// 设置门阶在 Z 轴上的位置
doorstep.position.z = 1500;
// 设置门阶在 Y 轴上的位置
doorstep.position.y = 150;

// 将最终创建的门阶对象作为默认导出，供其他模块使用
export default doorstep;
