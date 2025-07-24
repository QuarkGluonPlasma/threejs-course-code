// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 Three.js 组对象，用于将多个 3D 对象组合在一起
const group = new THREE.Group();

/**
 * 生成一个立方体网格对象
 * @param {string} colorStr - 立方体的颜色字符串，例如 'blue'、'green' 等
 * @param {number} x - 立方体在 X 轴上的位置
 * @param {number} y - 立方体在 Y 轴上的位置
 * @param {number} z - 立方体在 Z 轴上的位置
 * @returns {THREE.Mesh} - 返回一个立方体网格对象
 */
function generateBox(colorStr, x, y, z) {
    // 创建一个立方体几何体，尺寸为 100x100x100
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    // 创建一个 MeshLambert 材质，该材质会对光照产生反应，设置颜色为传入的颜色
    const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(colorStr)
    });
    // 创建一个网格对象，将几何体和材质组合在一起
    const box = new THREE.Mesh(geometry, material);
    // 设置立方体的位置
    box.position.set(x, y, z)
    return box;
}

// 生成一个蓝色立方体，位置在原点 (0, 0, 0)
const box = generateBox('blue', 0, 0, 0);
// 生成一个绿色立方体，位置在 Z 轴正方向 300 单位处
const box2 = generateBox('green', 0, 0, 300);
// 生成一个红色立方体，位置在 X 轴正方向 300 单位处
const box3 = generateBox('red', 300, 0, 0);
// 将三个立方体添加到组对象中
group.add(box, box2, box3);

// 注释掉的代码，原本用于在一定时间后执行射线检测
setTimeout(() => {
    // 创建一个射线投射器对象，用于检测射线与物体的相交情况
    const rayCaster = new THREE.Raycaster();
    // 设置射线的起始点
    rayCaster.ray.origin.set(-100, 30, 0);
    // 设置射线的方向
    rayCaster.ray.direction.set(1, 0, 0);
    
    // 创建一个箭头辅助对象，用于可视化射线
    const arrowHelper = new THREE.ArrowHelper(
        rayCaster.ray.direction,
        rayCaster.ray.origin,
        600
    );
    // 将箭头辅助对象添加到组对象中
    group.add(arrowHelper);
    
    // 检测射线与指定的物体数组 [box, box2, box3] 的相交情况，返回相交信息数组
    const intersections = rayCaster.intersectObjects([box, box2, box3]);
    // 在控制台打印相交信息数组
    console.log(intersections);
    
    // 遍历相交信息数组，将相交物体的材质颜色设置为粉色
    intersections.forEach(item => {
        item.object.material.color = new THREE.Color('pink')
    })
}, 0);

// 将包含所有对象的组对象作为默认导出，供其他模块使用
export default group;
