// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个 Three.js 组对象，用于将多个物体组合在一起
const group = new THREE.Group();

/**
 * 创建坐标轴直线
 * @param {string} type - 坐标轴类型，'x' 表示 X 轴，'y' 表示 Y 轴
 * @returns {THREE.Line} - 创建好的直线对象
 */
function createLine(type) {
    // 定义直线的两个端点
    const points = [
        new THREE.Vector3(0, 0, 0),
        // 根据传入的坐标轴类型确定第二个端点的位置
        type === 'y' 
            ? new THREE.Vector3(0, 100, 0)
            : new THREE.Vector3(100, 0, 0)
    ];
    // 创建一个 BufferGeometry 对象，用于存储几何体数据
    const geometry = new THREE.BufferGeometry();
    // 创建一个线基础材质，设置颜色为白色
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });
    // 将端点数据设置到几何体中
    geometry.setFromPoints(points);
    
    // 创建一个直线对象，将几何体和材质组合在一起
    const line = new THREE.Line(geometry, material);
    return line;
}

/**
 * 创建坐标轴刻度线
 * @param {string} type - 坐标轴类型，'x' 表示 X 轴，'y' 表示 Y 轴
 * @returns {THREE.LineSegments} - 创建好的刻度线对象
 */
function createScaleLine(type) {
    // 存储刻度线端点的数组
    const points = [];
    // 每隔 10 个单位创建一条刻度线
    for (let i = 0; i <= 100; i += 10) {
        if(type === 'y') {
            // Y 轴刻度线端点
            points.push(new THREE.Vector3(0, i, 0));
            points.push(new THREE.Vector3(-5, i, 0));
        } else {
            // X 轴刻度线端点
            points.push(new THREE.Vector3(i, 0, 0));
            points.push(new THREE.Vector3(i, -5, 0));
        }
    }
    // 创建一个 BufferGeometry 对象，用于存储几何体数据
    const geometry = new THREE.BufferGeometry();
    // 将端点数据设置到几何体中
    geometry.setFromPoints(points);
    // 创建一个线基础材质，设置颜色为白色
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });
    // 创建一个线段对象，将几何体和材质组合在一起
    const scaleLine = new THREE.LineSegments(geometry, material);
    return scaleLine;
}

/**
 * 创建渐变颜色的柱状图
 * @param {number[]} dataArr - 柱状图数据数组，每个元素代表柱子的高度
 * @returns {THREE.Group} - 包含所有柱子的组对象
 */
function createBar(dataArr) {
    // 创建一个组对象，用于存放所有柱子
    const bars = new THREE.Group(); 
    // 遍历数据数组，为每个数据创建一个柱子
    dataArr.forEach((item, i) => {
        // 创建一个平面几何体，宽度为 10，高度为当前数据值
        const geometry = new THREE.PlaneGeometry(10, item, 1, 20);

        // 获取几何体的顶点位置属性
        const positions = geometry.attributes.position;

        // 存储每个顶点颜色信息的数组
        const colorsArr = [];
        // 定义三种渐变颜色
        const color1 = new THREE.Color('green');
        const color2 = new THREE.Color('blue');
        const color3 = new THREE.Color('red');
        // 遍历每个顶点，根据顶点的 Y 坐标计算渐变颜色
        for (let i = 0; i < positions.count; i++) {
            // 获取当前顶点的 Y 坐标，并调整到合适范围
            const y = positions.getY(i) + item / 2;
            if(y <= 50) {
                // 高度在 50 以下，从 color1 渐变到 color2
                const percent = y / 50;
                const c = color1.clone().lerp(color2, percent);
                colorsArr.push(c.r, c.g, c.b);
            } else if(y > 50 && y <= 100) {
                // 高度在 50 到 100 之间，从 color2 渐变到 color3
                const percent = ( y - 50 )/ 50;
                console.log(percent);
                const c = color2.clone().lerp(color3, percent);
                colorsArr.push(c.r, c.g, c.b);
            }
        }
        // 将颜色数组转换为 Float32 类型的数组
        const colors = new Float32Array(colorsArr);
        // 将颜色数组封装为 BufferAttribute 对象，并添加到几何体的 color 属性中
        geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

        // 创建一个网格基础材质，启用顶点颜色
        const material = new THREE.MeshBasicMaterial({
            // color: 'orange'
            vertexColors: true
        });
        // 创建一个网格对象，将几何体和材质组合在一起
        const bar = new THREE.Mesh(geometry, material);
        // 设置柱子的 X 坐标，使柱子依次排列
        bar.position.x = 10 + i * 20 + 5;
        // 设置柱子的 Y 坐标，使其底部对齐 X 轴
        bar.position.y = item / 2;
        // 将柱子添加到组中
        bars.add(bar);
    });

    // 将柱子数值标签添加到组中
    bars.add(createNum(dataArr));

    return bars;
}

/**
 * 创建包含指定文本的 Canvas 元素
 * @param {string} text - 要显示的文本
 * @returns {HTMLCanvasElement} - 创建好的 Canvas 元素
 */
function createCanvas(text) {
    // 创建一个 Canvas 元素
    const canvas = document.createElement("canvas");
    // 设置 Canvas 的宽度和高度
    const w = canvas.width = 100;
    const h = canvas.height = 100;

    // 获取 Canvas 的 2D 绘图上下文
    const c = canvas.getContext('2d');
    // 将绘图原点移动到 Canvas 中心
    c.translate(w / 2, h / 2);
    // 设置填充颜色为白色
    c.fillStyle = "#ffffff";
    // 设置字体样式
    c.font = "normal 48px 宋体";
    // 设置文本基线为垂直居中
    c.textBaseline = "middle";
    // 设置文本对齐方式为水平居中
    c.textAlign = "center";
    // 在 Canvas 中心绘制文本
    c.fillText(text, 0, 0);
    return canvas;
}

/**
 * 创建柱状图数值标签
 * @param {number[]} dataArr - 柱状图数据数组，每个元素代表柱子的高度
 * @returns {THREE.Group} - 包含所有数值标签的组对象
 */
function createNum(dataArr) {
    // 创建一个组对象，用于存放所有数值标签
    const nums = new THREE.Group();
    // 遍历数据数组，为每个数据创建一个数值标签
    dataArr.forEach((item, i) => {
        // 创建一个 Canvas 纹理，纹理内容为当前数据值
        const texture = new THREE.CanvasTexture(createCanvas(item));
        // 创建一个平面几何体，作为标签的形状
        const geometry = new THREE.PlaneGeometry(10, 10);
        // 创建一个网格基础材质，将纹理应用到材质上
        const material = new THREE.MeshBasicMaterial({
            // color: 'orange'
            map: texture
        });
        // 创建一个网格对象，将几何体和材质组合在一起
        const num = new THREE.Mesh(geometry, material);
        // 设置标签的 Y 坐标，使其位于柱子上方
        num.position.y = item + 30;
        // 设置标签的 X 坐标，使其与柱子对齐
        num.position.x = 10 + i * 20 + 5;
        // 将标签添加到组中
        nums.add(num);
    });
    return nums;
}

// 创建 X 轴直线
const xLine = createLine('x');
// 创建 Y 轴直线
const yLine = createLine('y');

// 创建 X 轴刻度线
const xScaleLine = createScaleLine('x');
// 创建 Y 轴刻度线
const yScaleLine = createScaleLine('y');

// 创建柱状图，传入数据数组
const bar = createBar([70, 20, 100, 40, 50, 70]);
// 将坐标轴、刻度线和柱状图添加到组中
group.add(xLine, yLine, xScaleLine, yScaleLine, bar);

// 将包含所有对象的组作为默认导出，供其他模块使用
export default group;
