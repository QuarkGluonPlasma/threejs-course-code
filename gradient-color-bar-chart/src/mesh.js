import * as THREE from 'three';

const group = new THREE.Group();

function createLine(type) {
    const points = [
        new THREE.Vector3(0, 0, 0),
        type === 'y' 
            ? new THREE.Vector3(0, 100, 0)
            : new THREE.Vector3(100, 0, 0)
    ]
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });
    geometry.setFromPoints(points);
    
    const line = new THREE.Line(geometry, material);
    return line;
}

function createScaleLine(type) {
    const points = [];
    for (let i = 0; i <= 100; i += 10) {
        if(type === 'y') {
            points.push(new THREE.Vector3(0, i, 0));
            points.push(new THREE.Vector3(-5, i, 0));
        } else {
            points.push(new THREE.Vector3(i, 0, 0));
            points.push(new THREE.Vector3(i, -5, 0));
        }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: '#ffffff'
    });
    const scaleLine = new THREE.LineSegments(geometry, material);
    return scaleLine;
}

function createBar(dataArr) {
    const bars = new THREE.Group(); 
    dataArr.forEach((item, i) => {
        const geometry = new THREE.PlaneGeometry(10, item, 1, 20);

        const positions = geometry.attributes.position;

        const colorsArr = [];
        const color1 = new THREE.Color('green');
        const color2 = new THREE.Color('blue');
        const color3 = new THREE.Color('red');
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i) + item / 2
            if(y <= 50) {
                const percent = y / 50;
                const c = color1.clone().lerp(color2, percent);
                colorsArr.push(c.r, c.g, c.b);
            } else if(y > 50 && y <= 100) {
                const percent = ( y - 50 )/ 50;
                console.log(percent);
                const c = color2.clone().lerp(color3, percent);
                colorsArr.push(c.r, c.g, c.b);
            }
        }
        const colors = new Float32Array(colorsArr);
        geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

        const material = new THREE.MeshBasicMaterial({
            // color: 'orange'
            vertexColors: true
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = 10 + i * 20 + 5;
        bar.position.y = item / 2;
        bars.add(bar);
    });

    bars.add(createNum(dataArr));

    return bars;
}
function createCanvas(text) {
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100;
    const h = canvas.height = 100;

    const c = canvas.getContext('2d');
    c.translate(w / 2, h / 2);
    c.fillStyle = "#ffffff";
    c.font = "normal 48px 宋体";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.fillText(text, 0, 0);
    return canvas;
}

function createNum(dataArr) {
    const nums = new THREE.Group();
    dataArr.forEach((item, i) => {
        const texture = new THREE.CanvasTexture(createCanvas(item));
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshBasicMaterial({
            // color: 'orange'
            map: texture
        });
        const num = new THREE.Mesh(geometry, material);
        num.position.y = item + 10;
        num.position.x = 10 + i * 20 + 5;
        nums.add(num);
    })
    return nums;
}

const xLine = createLine('x');
const yLine = createLine('y');

const xScaleLine = createScaleLine('x');
const yScaleLine = createScaleLine('y');

const bar = createBar([70, 20, 100, 40, 50]);
group.add(xLine, yLine, xScaleLine, yScaleLine, bar);

export default group;
