// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个纹理加载器实例，用于加载纹理文件
const loader = new THREE.TextureLoader();
// 使用纹理加载器加载砖墙纹理图片
const texture = loader.load('./zhuan.jpg');
// 设置纹理的颜色空间为 sRGB，确保纹理颜色在渲染时正确显示
texture.colorSpace = THREE.SRGBColorSpace;
// 设置纹理在水平方向上的包裹模式为重复，当纹理尺寸小于几何体时会重复平铺
texture.wrapS = THREE.RepeatWrapping;
// 设置纹理在垂直方向上的包裹模式为重复，当纹理尺寸小于几何体时会重复平铺
texture.wrapT = THREE.RepeatWrapping;
// 设置纹理在水平方向上的重复次数，值越小纹理在水平方向上显示越大
texture.repeat.x = 0.0005;
// 设置纹理在垂直方向上的重复次数，值越小纹理在垂直方向上显示越大
texture.repeat.y = 0.0005;

// 创建一个 MeshLambert 材质，该材质会对光照产生反应
const material = new THREE.MeshLambertMaterial({
    // 注释掉的代码，原本用于设置材质的基础颜色为浅灰色
    // color: new THREE.Color('lightgrey')
    map: texture, // 将加载的纹理作为颜色贴图应用到材质上
    aoMap: texture // 将加载的纹理作为环境光遮蔽贴图应用到材质上，增强明暗对比
});

// 创建一个形状对象，用于定义前墙的二维轮廓
const shape = new THREE.Shape();
// 将绘图游标移动到起始点 (0, 0)
shape.moveTo(0, 0);
// 从当前点绘制一条直线到点 (4000, 0)
shape.lineTo(4000, 0);
// 从当前点绘制一条直线到点 (4000, 2000)
shape.lineTo(4000, 2000);
// 从当前点绘制一条直线到点 (0, 2000)，完成前墙轮廓的绘制
shape.lineTo(0, 2000);

// 创建一个路径对象，用于定义前墙上门的形状
const door = new THREE.Path();
// 将绘图游标移动到门的起始点 (1000, 0)
door.moveTo(1000, 0);
// 从当前点绘制一条直线到点 (2000, 0)
door.lineTo(2000, 0);
// 从当前点绘制一条直线到点 (2000, 1500)
door.lineTo(2000, 1500);
// 从当前点绘制一条直线到点 (1000, 1500)，完成门轮廓的绘制
door.lineTo(1000, 1500);
// 将门的路径添加到前墙形状的孔洞数组中，以便在后续生成几何体时创建门
shape.holes.push(door);

// 创建一个路径对象，用于定义前墙上窗户的形状
const win = new THREE.Path();
// 将绘图游标移动到窗户的起始点 (2500, 500)
win.moveTo(2500, 500);
// 从当前点绘制一条直线到点 (3500, 500)
win.lineTo(3500, 500);
// 从当前点绘制一条直线到点 (3500, 1500)
win.lineTo(3500, 1500);
// 从当前点绘制一条直线到点 (2500, 1500)，完成窗户轮廓的绘制
win.lineTo(2500, 1500);
// 将窗户的路径添加到前墙形状的孔洞数组中，以便在后续生成几何体时创建窗户
shape.holes.push(win);

// 创建一个拉伸几何体，将之前定义的二维形状沿 Z 轴方向拉伸
const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 100 // 拉伸的深度，即前墙的厚度
});

// 创建一个网格对象，将拉伸几何体和 MeshLambert 材质组合在一起，代表前墙
const frontWall = new THREE.Mesh(geometry, material);
// 将前墙对象沿 X 轴负方向平移 2000 个单位
frontWall.translateX(-2000);
// 将前墙对象沿 Z 轴正方向平移 1400 个单位
frontWall.translateZ(1400);
// 将前墙对象沿 Y 轴正方向平移 150 个单位
frontWall.translateY(150);

// 注释掉的代码，若取消注释，可在控制台打印前墙对象，方便调试
// console.log(frontWall);

// 将最终创建的前墙对象作为默认导出，供其他模块使用
export default frontWall;
