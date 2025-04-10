import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';
import { Easing, Group, Tween } from '@tweenjs/tween.js';

export function init(dom, setStr) {

    const scene = new THREE.Scene();
    scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = 1000;
    const height = window.innerHeight - 80;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(500, 500, 500);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    const tweenGroup = new Group();
    function jump(color) {
        const box = mesh.getObjectByName(color);
        const tween= new Tween(box.position).to({
            ...box.position,
            y: 100
        }, 1000)
        .easing(Easing.Quadratic.InOut)
        .repeat(0)
        .start()
        .onComplete(() => {
            tweenGroup.remove(tween);
            setStr(color + '已经 jump 完成')
        })
        tweenGroup.add(tween);
    }

    function render(time) {
        tweenGroup.update(time);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();

    dom.append(renderer.domElement);

    window.onresize = function () {
        const width = 1000;
        const height = window.innerHeight - 80;

        renderer.setSize(width,height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    
    const controls = new OrbitControls(camera, renderer.domElement);

    return {
        scene,
        camera,
        renderer,
        jump
    }
}