// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 simplex-noise 库中导入 createNoise2D 函数，用于生成二维噪声
import { createNoise2D } from "simplex-noise";
// 导入自定义的加载树木的函数，该函数在 tree.js 文件中定义
import loadTree from './tree';

// 创建一个平面几何体，宽度和高度均为 3000 单位，在 X 和 Y 方向上分别细分为 100 份
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

// 创建一个二维噪声生成函数
const noise2D = createNoise2D();

// 获取几何体顶点位置的属性数据
const positions = geometry.attributes.position;

// 遍历几何体的所有顶点
for (let i = 0 ; i < positions.count; i ++) {
    // 获取当前顶点的 X 坐标
    const x = positions.getX(i);
    // 获取当前顶点的 Y 坐标
    const y = positions.getY(i);

    // 根据二维噪声函数计算当前顶点的 Z 坐标，实现地形起伏效果
    const z = noise2D(x / 800, y / 800) * 50;

    // 设置当前顶点的 Z 坐标
    positions.setZ(i, z);
}

// 用于存储所有顶点 Z 坐标的数组
const heightArr = [];
// 遍历几何体的所有顶点，将 Z 坐标添加到 heightArr 数组中
for (let i = 0; i < positions.count; i++) {
    heightArr.push(positions.getZ(i));
}
// 对 heightArr 数组进行排序，从小到大排列
heightArr.sort();

// 获取地形的最小高度
const minHeight = heightArr[0];
// 获取地形的最大高度
const maxHeight = heightArr[heightArr.length - 1];
// 计算地形的高度差
const height = maxHeight - minHeight;

// 用于存储每个顶点颜色信息的数组
const colorsArr = [];
// 定义第一种颜色，用于地形较低处
const color1 = new THREE.Color('#eee');
// 定义第二种颜色，用于地形较高处
const color2 = new THREE.Color('white');

// 遍历几何体的所有顶点，根据顶点高度计算颜色
for (let i = 0; i < positions.count; i++) {
    // 计算当前顶点高度在最小高度和最大高度之间的百分比
    const percent = (positions.getZ(i) - minHeight) / height;
    // 根据百分比在两种颜色之间进行线性插值，得到当前顶点的颜色
    const c = color1.clone().lerp(color2, percent);
    // 将当前顶点颜色的 RGB 值添加到 colorsArr 数组中
    colorsArr.push(c.r, c.g, c.b); 
}
// 将颜色数组转换为 Float32Array 类型
const colors = new Float32Array(colorsArr);
// 为几何体添加颜色属性，每个顶点的颜色由 3 个分量（RGB）表示
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

// 创建一个 MeshLambert 材质，该材质会对光照产生反应
const material = new THREE.MeshLambertMaterial({
    // 注释掉的代码，原本用于设置统一的颜色，这里使用顶点颜色，故注释
    // color: new THREE.Color('white'),
    // 启用顶点颜色
    vertexColors: true,
    // 注释掉的代码，若取消注释，将以线框模式显示几何体
    // wireframe: true
});

// 创建一个网格对象，将几何体和材质组合在一起，代表山脉地形
const mountainside = new THREE.Mesh(geometry, material);
// 将山脉地形绕 X 轴旋转 -90 度，使其处于水平状态
mountainside.rotateX(- Math.PI / 2);
// 在控制台打印山脉地形对象信息，用于调试
console.log(mountainside);
// 设置山脉地形可以接收阴影
mountainside.receiveShadow = true;

// 调用加载树木的函数，加载完成后执行回调函数
loadTree((tree) => {
    // 初始化计数器
    let i = 0;
    // 循环在山脉地形上添加树木
    while(i < positions.count) {
        // 克隆一个新的树木对象
        const newTree = tree.clone();
        // 设置新树木对象的 X 坐标为当前顶点的 X 坐标
        newTree.position.x = positions.getX(i);
        // 设置新树木对象的 Y 坐标为当前顶点的 Y 坐标
        newTree.position.y = positions.getY(i);
        // 设置新树木对象的 Z 坐标为当前顶点的 Z 坐标
        newTree.position.z = positions.getZ(i);
        // 将新树木对象添加到山脉地形中
        mountainside.add(newTree);
        // 将新树木对象绕 X 轴旋转 90 度
        newTree.rotateX(Math.PI / 2);

        // 随机增加计数器的值，实现树木随机分布
        i += Math.floor(300 * Math.random());
    }
})

// 将山脉地形对象作为默认导出，供其他模块使用
export default mountainside;
