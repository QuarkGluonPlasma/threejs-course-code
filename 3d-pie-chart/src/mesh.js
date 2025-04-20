import * as THREE from 'three';
import createLabel from './label';

const group = new THREE.Group();

const R = 300;
function createPieChart(data) {
    let total = 0;
    data.forEach(item => {
        total += item.value;
    });

    const angles = data.map(item => {
        return item.value / total * 360;
    });

    let startAngle = 0;
    angles.map((angle, i) => {
        const curvePath = new THREE.CurvePath();

        const rad = THREE.MathUtils.degToRad(angle);
        const endAngle = startAngle + rad;

        const x1 = R * Math.cos(startAngle);
        const y1 = R * Math.sin(startAngle);

        const x2 = R * Math.cos(endAngle);
        const y2 = R * Math.sin(endAngle);

        const v1 = new THREE.Vector2(0, 0);
        const v2 = new THREE.Vector2(x1, y1);
        const v3 = new THREE.Vector2(x2, y2);

        const line1 = new THREE.LineCurve(v1, v2);
        curvePath.add(line1);

        const arc = new THREE.EllipseCurve(0, 0, R, R, startAngle, endAngle);
        curvePath.add(arc);

        const line2 = new THREE.LineCurve(v1, v3);
        curvePath.add(line2);

        const points = curvePath.getPoints(100);
        const shape = new THREE.Shape(points);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 100
        })
        const material = new THREE.MeshPhongMaterial({
            color: getRandomColor()
        });

        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

        mesh.angle = (endAngle + startAngle) / 2;

        const label = createLabel(data[i].name + ' ' + data[i].value);
        label.position.x = 400 * Math.cos(mesh.angle);
        label.position.y = 400 * Math.sin(mesh.angle);
        label.position.z = 150;
        mesh.add(label);

        label.target = mesh;
        mesh.target = mesh;

        startAngle += rad;
    })
}

let usedColor = [];
let colors = ['red', 'pink', 'blue', 'purple', 'orange', 'lightblue', 'green', 'lightgreen']
function getRandomColor() {
    let index = Math.floor(Math.random() * colors.length);
    while(usedColor.includes(index)) {
        index = Math.floor(Math.random() * colors.length);
    }
    usedColor.push(index);
    return colors[index];
}

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
createPieChart(data);

group.rotateX(- Math.PI / 2);

export default group;
