import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls, FlyControls } from 'three/examples/jsm/Addons.js';

export function initPreviewScene(
    dom: HTMLElement
) {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1500, 0);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 100000);
    camera.position.set(1000, 2000, 500);
    // camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);

    // const controls = new OrbitControls(camera, renderer.domElement);

    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 1000;
    controls.rollSpeed = Math.PI / 10;

    const clock = new THREE.Clock();
    function render() {
        controls.update(clock.getDelta());

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();

    dom.append(renderer.domElement);

    window.onresize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width,height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    return {
        scene,
        camera,
        controls
    }
}