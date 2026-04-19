import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 2);

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
void main() {
    vec3 a = vec3(0.35, 0.25, 0.55);
    vec3 b = vec3(0.2, 0.45, 0.5);
    float t = vUv.x + 0.05 * sin(uTime + vUv.y * 6.28);
    t = clamp(t, 0.0, 1.0);
    vec3 grad = mix(a, b, t);

    float lines = step(0.92, fract(vUv.x * 12.0 + uTime * 0.5));
    vec3 color = mix(grad, vec3(1.0), lines * 0.15);

    gl_FragColor = vec4(color, 1.0);
}
`;

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
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