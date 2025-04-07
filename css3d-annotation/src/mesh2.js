import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/Addons.js';

const geometry = new THREE.BoxGeometry(800, 500, 100);
const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color('skyblue')
});

const mesh = new THREE.Mesh(geometry, material);


const ele = document.createElement('div');
ele.innerHTML = `<div style="background:#fff;width:700px;height:400px;">
    <h1>这是网页</h1>
    <div style="display:flex;">
        <img src="https://wx4.sinaimg.cn/mw690/001wNYJjly1huwhn2t7x3j61401wgtp502.jpg" style="max-height:300px"/>
        <div>
            <p>这是一条新闻</p>
            <p>这是一条新闻</p>
            <p>这是一条新闻</p>
            <p>这是一条新闻</p>
        </div>
    </div>
</div>`;
ele.style.backfaceVisibility = 'hidden';

const obj = new CSS3DObject(ele);
obj.position.y = 0;
mesh.add(obj);

export default mesh;
