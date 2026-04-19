import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080810);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(0, 0.2, 2.8);

const vertexShader = `
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = `
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    vec3 base = vec3(0.12, 0.18, 0.28);
    vec3 rim = vec3(0.4, 0.85, 1.0);
    vec3 color = mix(base, rim, fresnel);
    gl_FragColor = vec4(color, 1.0);
}
`;

const geometry = new THREE.SphereGeometry(0.85, 64, 32);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

function tick() {
    requestAnimationFrame(tick);
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