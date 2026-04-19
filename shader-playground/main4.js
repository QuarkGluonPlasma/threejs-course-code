import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function createCheckerTexture(size, cells) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const step = size / cells;
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const dark = (x + y) % 2 === 0;
            ctx.fillStyle = dark ? '#303030' : '#d0d0d0';
            ctx.fillRect(x * step, y * step, step, step);
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 2);

const map = createCheckerTexture(256, 8);

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uMap;
uniform float uTime;
varying vec2 vUv;
void main() {
    vec2 uv = vUv * 3.0;
    uv.x += sin(uTime + vUv.y * 6.2831) * 0.03;
    vec4 texel = texture2D(uMap, uv);
    gl_FragColor = texel;
}
`;

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uMap: { value: map },
        uTime: { value: 0 },
    },
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();

function tick() {
    requestAnimationFrame(tick);
    material.uniforms.uTime.value = clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
}
tick();

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});