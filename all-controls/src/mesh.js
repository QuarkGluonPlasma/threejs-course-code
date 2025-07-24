// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 提供的各种功能
import * as THREE from 'three';

// 创建一个平面几何体，参数 1000 和 1000 分别表示平面的宽度和高度
const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
// 创建一个 MeshLambertMaterial 材质，用于创建具有漫反射效果的表面，颜色设置为天蓝色
const planeMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

// 创建一个网格对象，将平面几何体和材质组合在一起
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// 绕 X 轴逆时针旋转 90 度，使平面处于水平状态
plane.rotateX(- Math.PI / 2);
// 将平面沿 Y 轴负方向移动 50 个单位
plane.position.y = -50;

// 创建一个立方体几何体，参数分别表示立方体的宽、高、深
const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
// 创建一个 MeshLambertMaterial 材质，用于创建具有漫反射效果的表面，颜色设置为橙色
const boxMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color('orange')
});
// 创建一个立方体网格对象，将立方体几何体和材质组合在一起
const box = new THREE.Mesh(boxGeometry, boxMaterial);
// 为立方体网格对象设置名称，方便后续通过名称查找对象
box.name = 'box';

// 克隆一个新的立方体网格对象，新对象的属性和原对象相同
const box2 = box.clone();
// 将克隆的立方体沿 X 轴正方向移动 200 个单位
box2.position.x = 200;
// 为克隆的立方体网格对象设置名称，方便后续通过名称查找对象
box2.name = 'box2';
// 克隆原立方体的材质并赋值给新的立方体，避免多个对象共享同一个材质实例
box2.material = box.material.clone();

// 创建一个 THREE.Group 实例，用于将多个 3D 对象组合在一起
const  group = new THREE.Group();
// 将平面网格对象添加到组中
group.add(plane);
// 将第一个立方体网格对象添加到组中
group.add(box);
// 将克隆的立方体网格对象添加到组中
group.add(box2);

// 导出组合对象，供其他模块引入使用
export default group;
