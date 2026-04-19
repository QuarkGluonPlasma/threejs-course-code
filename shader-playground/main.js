import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

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

// 2D simplex noise: 常见的 Ashima 版本改写，适合入门练习
const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(
        0.211324865405187,  // (3.0-sqrt(3.0))/6.0
        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439   // 1.0 / 41.0
    );

    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(
        permute(i.y + vec3(0.0, i1.y, 1.0)) +
        i.x + vec3(0.0, i1.x, 1.0)
    );

    vec3 m = max(
        0.5 - vec3(
            dot(x0, x0),
            dot(x12.xy, x12.xy),
            dot(x12.zw, x12.zw)
        ),
        0.0
    );
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.y = a0.y * x12.x + h.y * x12.y;
    g.z = a0.z * x12.z + h.z * x12.w;

    return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        f += amp * snoise(p);
        p = rot * p * 2.0 + vec2(11.3, 7.7);
        amp *= 0.5;
    }
    return f;
}

void main() {
    // 让不同屏幕比例下云的“尺度”一致一些
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.06;

    // domain warp：先用低频噪声轻微扭曲采样坐标
    vec2 q;
    q.x = fbm(p * 1.2 + vec2(0.0, t));
    q.y = fbm(p * 1.2 + vec2(3.4, t));

    vec2 r = p + 0.35 * q;

    // 主密度：多尺度叠加
    float n = fbm(r * 1.6 + vec2(t * 1.2, t * 0.7));

    // 把 [-1,1] 近似映射到 [0,1]
    float d = 0.5 + 0.5 * n;

    // 云的“成团感”：阈值 + 软边
    float cloud = smoothstep(0.45, 0.78, d);

    // 细节：用更高频噪声调边缘，让云不那么“塑料”
    float detail = 0.5 + 0.5 * snoise(r * 6.0 + vec2(t * 2.0, -t * 1.5));
    cloud *= mix(0.85, 1.05, detail);

    // 简单“光照”：沿一个方向做密度差分，模拟云的亮边
    vec2 lightDir = normalize(vec2(-0.6, 0.8));
    float e = 0.01;
    float d1 = 0.5 + 0.5 * fbm((r + lightDir * e) * 1.6 + vec2(t * 1.2, t * 0.7));
    float c1 = smoothstep(0.45, 0.78, d1);
    float shade = clamp((c1 - cloud) * 6.0, -1.0, 1.0);

    vec3 sky = vec3(0.05, 0.07, 0.14);
    vec3 cloudCol = vec3(0.92, 0.95, 1.0);

    // 云内部稍微偏冷，边缘亮一点
    vec3 col = mix(sky, cloudCol, cloud);
    col += vec3(0.12, 0.14, 0.16) * shade * cloud;

    // 顶部更亮一点，增加天空层次
    col += vec3(0.02, 0.03, 0.05) * (1.0 - uv.y) * 0.6;

    gl_FragColor = vec4(col, 1.0);
}
`;

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
    },
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;

const clock = new THREE.Clock();

function tick() {
    requestAnimationFrame(tick);
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}
tick();

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    material.uniforms.uResolution.value.set(w, h);
});