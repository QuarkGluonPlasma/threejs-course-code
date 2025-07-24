// 导入 Three.js 库的所有导出内容，并使用 THREE 作为命名空间
import * as THREE from 'three';

// 定义第一条直线的起始点，坐标为 (0, 0)
const p1 = new THREE.Vector2(0, 0);
// 定义第一条直线的结束点，坐标为 (100, 100)
const p2 = new THREE.Vector2(100, 100);
// 创建第一条直线曲线对象，连接 p1 和 p2 两点
const line1 = new THREE.LineCurve(p1, p2);

// 创建一个椭圆曲线对象
// 参数依次为：椭圆中心的 x 坐标、y 坐标，椭圆的 x 半轴长度、y 半轴长度，
// 起始角度（弧度制）、结束角度（弧度制）
const arc = new THREE.EllipseCurve(0, 100, 100 , 100, 0, Math.PI);

// 定义第二条直线的起始点，坐标为 (-100, 100)
const p3 = new THREE.Vector2(-100, 100);
// 定义第二条直线的结束点，坐标为 (0, 0)
const p4 = new THREE.Vector2(0, 0);
// 创建第二条直线曲线对象，连接 p3 和 p4 两点
const line2 = new THREE.LineCurve(p3, p4);

// 创建一个曲线路径对象，用于组合多个曲线
const curvePath = new THREE.CurvePath();
// 将第一条直线曲线添加到曲线路径中
curvePath.add(line1);
// 将椭圆曲线添加到曲线路径中
curvePath.add(arc);
// 将第二条直线曲线添加到曲线路径中
curvePath.add(line2);

// 在组合后的曲线路径上均匀地获取 20 个点，返回一个包含这些点的数组
const pointsArr = curvePath.getPoints(20);
// 创建一个 BufferGeometry 对象，用于存储几何体的顶点数据
const geometry = new THREE.BufferGeometry();
// 将曲线路径上获取的点数据设置到 BufferGeometry 中
geometry.setFromPoints(pointsArr);

// 创建一个基础线条材质，设置线条的颜色为粉色
const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('pink')
});

// 使用之前创建的几何体和材质创建一条线条对象，用于展示组合后的曲线路径
const line = new THREE.Line(geometry, material);

// 点的数量
const pointCount = 5;
// 点对象数组
const movingPoints = [];
// 每个点的曲线参数数组
const ts = [];
// 移动速度
const speed = 0.005;
// 间隔时间
const interval = 0.2;

// 创建多个点对象
for (let i = 0; i < pointCount; i++) {
    const movingPointGeometry = new THREE.BufferGeometry();
    const movingPointMaterial = new THREE.PointsMaterial({
        color: new THREE.Color(`hsl(${(i / pointCount) * 360}, 100%, 50%)`),
        size: 5
    });
    const movingPoint = new THREE.Points(movingPointGeometry, movingPointMaterial);
    line.add(movingPoint);
    movingPoints.push(movingPoint);
    // 每个点的起始 t 值间隔 interval
    ts.push(-i * interval); 
}

// 动画循环函数
function animate() {
    for (let i = 0; i < pointCount; i++) {
        let t = ts[i];
        // 确保 t 在 0 到 1 之间
        t = (t + 1) % 1; 
        const point = arc.getPoint(t);
        const movingPointGeometry = movingPoints[i].geometry;

        // 将新的点位置设置到几何体中 用于将传入的点数组设置为几何体的顶点数据
        movingPointGeometry.setFromPoints([point]);
        movingPointGeometry.attributes.position.needsUpdate = true;
        // 更新每个点的 t 值
        ts[i] = t + speed; 
    }

    requestAnimationFrame(animate);
}

// 启动动画
animate();

// 将最终的线条对象作为默认导出，供其他模块使用
export default line;
