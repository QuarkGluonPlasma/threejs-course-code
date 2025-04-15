import * as THREE from 'three';

const lyricList = new THREE.Group();

function createCanvas(text, width) {
    const dpr = window.devicePixelRatio;
    const canvas = document.createElement("canvas");
    const w = canvas.width = width * dpr;
    const h = canvas.height = 100 * dpr;

    const c = canvas.getContext('2d');
    c.translate(w / 2, h / 2);
    c.fillStyle = "#ffffff";
    c.font = "normal 24px 微软雅黑";
    c.textBaseline = "middle";
    c.textAlign = "center";
    c.fillText(text, 0, 0);

    return canvas;
}

function createLyricItem(text) {
    const texture = new THREE.CanvasTexture(createCanvas(text, text.length * 30));
    const g = new THREE.PlaneGeometry(text.length * 300, 500);
    const m = new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        roughness: 0.3
    });
    const plane = new THREE.Mesh(g, m);
    plane.position.y = 41;
    return plane;
}

export const lyricPositions = [];

fetch('./superman.lrc').then((res) => {
    return res.text()
}).then(content => {
    const lyrics = content.split('\n');
    
    lyrics.forEach((item, i) => {
        const timeStr = item.slice(0, 10);
        if(timeStr.length) {
            const minute = parseInt(timeStr.slice(1, 3));
            const second = parseInt(timeStr.slice(4, 6));
            const mSecond = parseInt(timeStr.slice(7, 9));
            
            const time = minute * 60 * 1000 + second * 1000 + mSecond;
            lyricPositions.push([time, i * 1000]);
        }

        const lyricItem = createLyricItem(item.slice(10));
        lyricList.add(lyricItem);
        lyricItem.position.z = -i * 1000;
    })

    // console.log(lyricPositions);
})

export default lyricList;
