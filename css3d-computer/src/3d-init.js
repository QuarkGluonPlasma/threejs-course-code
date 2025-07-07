import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';
import { CSS3DRenderer } from 'three/examples/jsm/Addons';

export function init(dom) {

    const scene = new THREE.Scene();
    scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(-100, 1000, 0);
    directionalLight.lookAt(0, 0, 0);
    scene.add(directionalLight);

    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -800;
    directionalLight.shadow.camera.right = 800;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 2000;

    const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(cameraHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(1200, 500, 0);
    camera.lookAt(0, 100, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor('lightblue');
    renderer.shadowMap.enabled = true;

    const css3Renderer = new CSS3DRenderer();
    css3Renderer.setSize(width, height);

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.appendChild(css3Renderer.domElement);
    css3Renderer.domElement.style.position = 'absolute';
    css3Renderer.domElement.style.left = '0px';
    css3Renderer.domElement.style.top = '0px';
    css3Renderer.domElement.style.pointerEvents = 'none';

    div.appendChild(renderer.domElement);
    document.body.appendChild(div);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);

    function render(time) {
        controls.update(time);
        renderer.render(scene, camera);
        css3Renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();

    // dom.append(renderer.domElement);

    window.onresize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width,height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
      
    return {
        scene,
        renderer,
        controls,
        camera
    }
}