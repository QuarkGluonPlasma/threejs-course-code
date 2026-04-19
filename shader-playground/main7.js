import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111118);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
camera.position.set(1.2, 1.0, 1.5);
camera.lookAt(0, 0, 0);

const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(vec3(0.35, 1.0, 0.45));
    float ndl = max(dot(N, L), 0.0);
    vec3 base = vec3(0.25, 0.45, 0.72);
    vec3 ambient = base * 0.15;
    vec3 diffuse = base * ndl;
    vec3 color = ambient + diffuse;
    gl_FragColor = vec4(color, 1.0);
}
`;

const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
geometry.rotateX(-Math.PI / 2);

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
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