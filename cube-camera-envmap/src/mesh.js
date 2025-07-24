// 从 @tweenjs/tween.js 库中导入 Tween 类，用于创建动画补间
import { Tween } from '@tweenjs/tween.js';
// 导入 three.js 库的所有模块，并将其命名为 THREE
import * as THREE from 'three';

// 创建一个 THREE.Group 实例，用于将多个 3D 对象组合在一起
const group = new THREE.Group();

// 创建一个 CubeTextureLoader 实例，用于加载立方体贴图
const textureCube = new THREE.CubeTextureLoader()
    // 设置立方体贴图纹理文件所在的基础路径
    .setPath('../public/city/')
    // 加载立方体贴图的六个面，分别对应右、左、上、下、前、后
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 创建一个 WebGLCubeRenderTarget 实例，用于立方体贴图的渲染目标，确定分辨率等参数。
// 参数 512 表示渲染目标的分辨率
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512);
// 创建一个 CubeCamera 实例，用于从一个点向六个方向渲染场景，生成立方体贴图
// 参数 1 和 1000 分别表示相机的近裁剪面和远裁剪面
export const cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

// 创建一个平面几何体，参数 1000 和 1000 分别表示平面的宽度和高度
const geometry = new THREE.PlaneGeometry(1000, 1000)
// 创建一个基于物理的标准材质，用于模拟具有金属特性的表面
const material = new THREE.MeshStandardMaterial({
    color: 'white', // 材质的基础颜色为白色
    metalness: 1, // 材质的金属度为 1，表示完全金属
    roughness: 0, // 材质的粗糙度为 0，表示完全光滑
    envMap: cubeRenderTarget.texture // 设置环境映射纹理，用于反射周围环境
});
// 创建一个网格对象，将平面几何体和标准材质组合在一起
const mesh = new THREE.Mesh(geometry, material);
// 将平面网格对象添加到组中
group.add(mesh);

// 创建一个球体几何体，参数 100 表示球体的半径
const geometry2 = new THREE.SphereGeometry(100);
// 创建一个基于物理的标准材质，用于模拟浅绿色的表面
const material2 = new THREE.MeshStandardMaterial({
    color: 'lightgreen' // 材质的基础颜色为浅绿色
});
// 创建一个球体网格对象，将球体几何体和标准材质组合在一起
const mesh2 = new THREE.Mesh(geometry2, material2);
// 设置球体网格对象的位置
mesh2.position.set(0, 0, 500);
// 将球体网格对象添加到组中
group.add(mesh2);

// 定义球体运动轨迹的半径
let r = 800;
// 创建一个 Tween 实例，用于实现球体的圆周运动动画
// 初始角度为 0，目标角度为 Math.PI
export const ballTween = new Tween({ angle: 0}).to({
    angle: Math.PI
}, 5000)
// 设置动画无限重复
.repeat(Infinity)
// 动画更新时的回调函数，根据当前角度更新球体的位置
.onUpdate(obj => {
    mesh2.position.x = Math.cos(obj.angle) * r;
    mesh2.position.z = Math.sin(obj.angle) * r;
})
// 启动动画
.start();

// 导出组合对象，供其他模块使用
export default group;
