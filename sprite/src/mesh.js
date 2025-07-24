// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 Three.js 组对象，用于将多个 3D 对象组合在一起
const group = new THREE.Group();

// 创建一个精灵材质对象，设置精灵的颜色为橙色
// 精灵始终面向相机，常用于制作 2D 元素如图标、标签等
const spriteMaterial = new THREE.SpriteMaterial({
    color: 'orange'
});

// 创建一个精灵对象，并将之前创建的精灵材质应用到该对象上
const sprite = new THREE.Sprite(spriteMaterial);

// 将创建好的精灵对象添加到之前创建的组对象中
group.add(sprite);

// 创建一个平面几何体，其宽度和高度均为 1 个单位
const geometry = new  THREE.PlaneGeometry(1, 1);
// 创建一个网格对象，使用平面几何体和基础网格材质
// 基础网格材质对光照无反应，设置其颜色为浅蓝色
const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 'lightblue',
    // 设置背面可见
    side: THREE.DoubleSide
}));
// 将网格对象沿 Y 轴正方向移动 3 个单位
mesh.position.y = 3;

// 将创建好的网格对象添加到之前创建的组对象中
group.add(mesh);

group.scale.set(51, 51, 51)

// 将包含精灵和网格对象的组对象作为默认导出，供其他模块使用
export default group;
