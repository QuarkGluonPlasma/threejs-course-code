import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a22);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
camera.position.set(2, 1.6, 2.8);
camera.lookAt(0, 0, 0);

const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x6688cc, roughness: 0.35, metalness: 0.1 }),
);
scene.add(box);

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(2, 4, 3);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const composer = new EffectComposer(renderer);
composer.setPixelRatio(window.devicePixelRatio);
composer.setSize(width, height);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const vignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        uStrength: { value: 0.55 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uStrength;
        varying vec2 vUv;
        void main() {
            vec4 tex = texture2D(tDiffuse, vUv);
            vec2 uv = (vUv - 0.5) * 2.0;
            float d = length(uv);
            float v = 1.0 - d * uStrength;
            v = clamp(v, 0.15, 1.0);
            gl_FragColor = vec4(tex.rgb * v, tex.a);
        }
    `,
};

const vignettePass = new ShaderPass(vignetteShader);
composer.addPass(vignettePass);

function tick() {
    requestAnimationFrame(tick);
    box.rotation.y += 0.008;
    controls.update();
    composer.render();
}
tick();

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
});