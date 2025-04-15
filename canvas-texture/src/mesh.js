import * as THREE from 'three';

const group = new THREE.Group();

function createCanvas() {
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100 * dpr;
    const h = canvas.height = 100 * dpr;

    const c = canvas.getContext('2d');
    c.translate(w / 2, h / 2);

    c.arc(0, 0, 40 * dpr, 0, Math.PI * 2);
    c.fillStyle = "orange";
    c.fill();

    c.beginPath();
    c.moveTo(-10 * dpr, -20 * dpr);
    c.lineTo(-10 * dpr, 20 * dpr);
    c.lineTo(20 * dpr, 0);
    c.closePath();
    c.fillStyle = "white";
    c.fill();
    return canvas;
}

function createCanvas2() {
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100 * dpr;
    const h = canvas.height = 100 * dpr;

    const ctx = canvas.getContext('2d');
    ctx.translate(w / 2, h / 2);

	ctx.moveTo(-50 * dpr, -10 * dpr);
	ctx.lineTo(50 * dpr, -10 * dpr);
	ctx.lineTo(-30 * dpr,50 * dpr);
	ctx.lineTo(0 * dpr, -50 * dpr);
	ctx.lineTo(30 * dpr,50 * dpr);
	ctx.lineTo(-50 * dpr,-10 * dpr);
    ctx.lineTo(-50 * dpr,-10 * dpr);
    ctx.strokeStyle = "red";
    ctx.stroke();
    return canvas;	
}

function createCanvas3() {
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100 * dpr;
    const h = canvas.height = 100 * dpr;

    const ctx = canvas.getContext('2d');
    ctx.translate(w / 2, h / 2);

	ctx.moveTo(-50 * dpr, -10 * dpr);
	ctx.lineTo(50 * dpr, -10 * dpr);
	ctx.lineTo(-30 * dpr,50 * dpr);
	ctx.lineTo(0 * dpr, -50 * dpr);
	ctx.lineTo(30 * dpr,50 * dpr);
	ctx.lineTo(-50 * dpr,-10 * dpr);
    ctx.lineTo(-50 * dpr,-10 * dpr);
    ctx.strokeStyle = "red";
    ctx.stroke();
    return canvas;	
}

function createCanvas4() {
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement("canvas");
    const w = canvas.width = 100 * dpr;
    const h = canvas.height = 100 * dpr;

    const c = canvas.getContext('2d');
    c.drawImage(img, 0, 0, w, h);

    c.translate(w / 2, h / 2);
    c.fillStyle = "#ffffff";
    c.font = "normal 24px 微软雅黑";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.fillText('你好，guang', 0, 0);
    return canvas;
}

function createPlane(x, y, img) {
    const texture = new THREE.CanvasTexture(createCanvas4(img));
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshPhongMaterial({
        // color: 'white'
        transparent: true,
        map: texture
    });
    const mesh =  new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    return mesh;
}

const img = new Image();
img.src = './heart.png';
img.onload = function() {
    group.add(createPlane(-300, 0, img));
    group.add(createPlane(0, 0, img));
    group.add(createPlane(300, 0, img));
}



export default group;