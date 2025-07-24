import * as THREE from 'three';

// 创建一个圆柱几何体对象
// 第一个参数 50 表示圆柱顶部半径
// 第二个参数 50 表示圆柱底部半径
// 第三个参数 80 表示圆柱的高度
// 第四个参数 5 表示圆柱侧面的分段数
const geometry = new THREE.CylinderGeometry(50, 50, 80, 5);

// 创建一个基础网格材质对象
// color 属性设置网格的颜色为橙色
// wireframe 属性设置为 true，表示以线框模式渲染几何体
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('orange'),
    wireframe: true,
});

// 创建一个网格对象，将几何体和材质组合在一起
// 通过 Mesh 对象可以将几何体以指定的材质在 Three.js 场景中渲染出来
const mesh = new THREE.Mesh(geometry, material);

// 导出创建好的网格对象，方便其他模块引入使用
export default mesh;

