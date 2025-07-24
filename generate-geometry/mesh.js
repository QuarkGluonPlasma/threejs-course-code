// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 定义一组二维点，这些点将作为旋转几何体的轮廓。
 * 后续会围绕 y 轴旋转这些点来生成三维几何体。
 */
const pointsArr = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(50, 50),
    new THREE.Vector2(20, 80),
    new THREE.Vector2(0, 150)
];

/**
 * 创建一个旋转几何体（LatheGeometry）。
 * @param {Array<THREE.Vector2>} pointsArr - 用于旋转的二维点数组。
 * @param {number} 50 - 旋转时的分段数，数值越大，生成的几何体越光滑。
 */
const geometry = new THREE.LatheGeometry(pointsArr, 5000);

/**
 * 创建一个 MeshLambert 材质，该材质会对光照产生反应。
 * @param {Object} options - 材质的配置选项。
 * @param {THREE.Color} options.color - 材质的颜色，这里设置为粉色。
 * @param {number} options.side - 渲染面的设置，THREE.DoubleSide 表示双面渲染。
 */
const materail = new THREE.MeshLambertMaterial({
    color: new THREE.Color('pink'),
    side: THREE.DoubleSide
});

/**
 * 创建一个网格对象，由之前创建的旋转几何体和材质组成。
 * @param {THREE.LatheGeometry} geometry - 旋转几何体。
 * @param {THREE.MeshLambertMaterial} materail - MeshLambert 材质。
 */
const mesh = new THREE.Mesh(geometry, materail);

/**
 * 创建一个 BufferGeometry 对象，用于存储点和线的顶点数据。
 * 并将之前定义的二维点数组设置为其顶点数据。
 */
const geometry2 = new THREE.BufferGeometry();
geometry2.setFromPoints(pointsArr);

/**
 * 创建一个点材质，用于渲染点。
 * @param {Object} options - 材质的配置选项。
 * @param {THREE.Color} options.color - 点的颜色，这里设置为蓝色。
 * @param {number} options.size - 点的大小，这里设置为 10。
 */
const material2 = new THREE.PointsMaterial({
    color: new THREE.Color('blue'),
    size: 10
});

/**
 * 创建一个点对象，由 BufferGeometry 和点材质组成。
 * @param {THREE.BufferGeometry} geometry2 - 存储顶点数据的 BufferGeometry。
 * @param {THREE.PointsMaterial} material2 - 点材质。
 */
const points2 = new THREE.Points(geometry2, material2);

/**
 * 创建一条线对象，由 BufferGeometry 和基础线条材质组成。
 * @param {THREE.BufferGeometry} geometry2 - 存储顶点数据的 BufferGeometry。
 * @param {THREE.LineBasicMaterial} - 基础线条材质。
 */
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial());

// 将点对象和线对象添加到网格对象中，作为其子对象
mesh.add(points2, line2);

// 将最终的网格对象作为默认导出，供其他模块使用
export default mesh;
