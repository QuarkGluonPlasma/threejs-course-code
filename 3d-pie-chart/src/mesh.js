// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 导入用于创建标签的自定义函数
import createLabel from './label';

// 创建一个 Three.js 组对象，用于容纳 3D 饼图的各个部分
const group = new THREE.Group();

// 定义饼图的半径
const R = 300;
/**
 * 创建 3D 饼图的函数
 * @param {Array} data - 包含饼图数据的数组，每个元素为 { name: string, value: number } 格式
 */
function createPieChart(data) {
    // 初始化数据总和为 0
    let total = 0;
    // 遍历数据数组，累加每个数据项的值
    data.forEach(item => {
        total += item.value;
    });

    // 计算每个数据项对应的角度（以度为单位）
    const angles = data.map(item => {
        return item.value / total * 360;
    });

    // 初始化起始角度为 0 弧度
    let startAngle = 0;
    // 遍历每个角度，为每个数据项创建饼图的一部分
    angles.map((angle, i) => {
        // 创建一个曲线路径对象，用于组合多个曲线
        const curvePath = new THREE.CurvePath();

        // 将角度从度转换为弧度
        const rad = THREE.MathUtils.degToRad(angle);
        // 计算当前扇形的结束角度
        const endAngle = startAngle + rad;

        // 计算扇形起始点的 x 和 y 坐标
        const x1 = R * Math.cos(startAngle);
        const y1 = R * Math.sin(startAngle);

        // 计算扇形结束点的 x 和 y 坐标
        const x2 = R * Math.cos(endAngle);
        const y2 = R * Math.sin(endAngle);

        // 创建三个二维向量，分别表示扇形的中心点、起始点和结束点
        const v1 = new THREE.Vector2(0, 0);
        const v2 = new THREE.Vector2(x1, y1);
        const v3 = new THREE.Vector2(x2, y2);

        // 创建从中心点到起始点的直线曲线
        const line1 = new THREE.LineCurve(v1, v2);
        // 将直线曲线添加到曲线路径中
        curvePath.add(line1);

        // 创建一个椭圆曲线，表示扇形的弧形部分
        const arc = new THREE.EllipseCurve(0, 0, R, R, startAngle, endAngle);
        // 将椭圆曲线添加到曲线路径中
        curvePath.add(arc);

        // 创建从中心点到结束点的直线曲线
        const line2 = new THREE.LineCurve(v1, v3);
        // 将直线曲线添加到曲线路径中
        curvePath.add(line2);

        // 从曲线路径中获取 100 个点，用于创建形状
        const points = curvePath.getPoints(100);
        // 使用这些点创建一个形状对象
        const shape = new THREE.Shape(points);

        // 创建一个拉伸几何体，将形状沿 z 轴拉伸 100 个单位
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 100
        })
        // 创建一个 Phong 材质，使用随机颜色
        const material = new THREE.MeshPhongMaterial({
            color: getRandomColor()
        });

        // 创建一个网格对象，将几何体和材质组合在一起
        const mesh = new THREE.Mesh(geometry, material);
        // 将网格对象添加到组中
        group.add(mesh);

        // 记录当前扇形的中间角度，用于定位标签
        mesh.angle = (endAngle + startAngle) / 2;

        // 调用 createLabel 函数创建标签
        const label = createLabel(data[i].name + ' ' + data[i].value);
        // 根据中间角度计算标签的 x 坐标
        label.position.x = 400 * Math.cos(mesh.angle);
        // 根据中间角度计算标签的 y 坐标
        label.position.y = 400 * Math.sin(mesh.angle);
        // 设置标签的 z 坐标
        label.position.z = 150;
        // 将标签添加到当前网格对象上
        mesh.add(label);

        // 为标签和网格对象添加 target 属性，指向自身
        label.target = mesh;
        mesh.target = mesh;

        // 更新起始角度，为下一个扇形做准备
        startAngle += rad;
    })
}

// 记录已经使用过的颜色索引
let usedColor = [];
// 定义可用的颜色数组
let colors = ['red', 'pink', 'blue', 'purple', 'orange', 'lightblue', 'green', 'lightgreen']
/**
 * 获取一个未使用过的随机颜色
 * @returns {string} - 未使用过的颜色名称
 */
function getRandomColor() {
    // 随机生成一个颜色索引
    let index = Math.floor(Math.random() * colors.length);
    // 若该索引对应的颜色已被使用，重新生成索引
    while(usedColor.includes(index)) {
        index = Math.floor(Math.random() * colors.length);
    }
    // 将使用过的颜色索引添加到 usedColor 数组中
    usedColor.push(index);
    // 返回对应的颜色名称
    return colors[index];
}

// 定义饼图的数据
const data = [
    {
        name: '春节销售额',
        value: 1000
    },
    {
        name: '夏节销售额',
        value: 3000
    },
    {
        name: '秋节销售额',
        value: 800
    },
    {
        name: '冬节销售额',
        value: 500
    }
];
// 调用 createPieChart 函数，根据数据创建 3D 饼图
createPieChart(data);

// 将整个组对象绕 X 轴逆时针旋转 90 度
group.rotateX(- Math.PI / 2);

// 将包含 3D 饼图的组对象作为默认导出，供其他模块使用
export default group;
