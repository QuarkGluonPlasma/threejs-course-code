import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
camera.position.set(1.2, 1.0, 1.8);
camera.lookAt(0, 0, 0);

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying float vHeight;

void main() {
    vUv = uv;
    vec3 pos = position;
    float w = sin(pos.x * 6.0 + uTime * 2.0) * cos(pos.y * 5.0 + uTime * 1.5);
    pos.z += w * 0.12;
    vHeight = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vHeight;
void main() {
    float h = vHeight * 0.5 + 0.5;
    vec3 base = vec3(0.2, 0.45, 0.65);
    vec3 crest = vec3(0.5, 0.85, 0.95);
    vec3 color = mix(base, crest, h);
    gl_FragColor = vec4(color, 1.0);
}
`;

const geometry = new THREE.PlaneGeometry(2, 2, 128, 128);
geometry.rotateX(-Math.PI / 2);

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0 },
    },
    side: THREE.DoubleSide,
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