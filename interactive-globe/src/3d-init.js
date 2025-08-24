import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';
import gsap from 'gsap';

export function init(dom) {

    const scene = new THREE.Scene();
    scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = 1200;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 800, 800);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);

    const controls = new OrbitControls(camera, renderer.domElement);

    function render(time) {
        controls.update(time);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();

    dom.append(renderer.domElement);

    window.onresize = function () {
        const width = 1200;
        const height = window.innerHeight;

        renderer.setSize(width,height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    let prevLabel;
    let prevShape;
    function focusCountry(name) {
        if(prevLabel) {
            prevLabel.textHeight = 3;
        }
        if(prevShape) {
            const dir = prevLabel.position.clone().normalize();

            prevShape.traverse((obj) => {
                if(obj.isLine2) {
                    obj.material.color.set('gold');
                    obj.position.sub(dir.clone().normalize().multiplyScalar(2));
                }
            })
        }
        const focusLabel = scene.getObjectByName('label' + name);

        const dir = focusLabel.position.clone().normalize();
        const newCameraPos = focusLabel.position.clone().add(dir.multiplyScalar(600));
        // camera.position.copy(newCameraPos);

        gsap.to(camera.position, {
            ...newCameraPos,
            ease: 'none',
            repeat: 0,
            duration: 1
        });

        focusLabel.textHeight = 20;

        const focusShape = scene.getObjectByName('shape' + name);

        focusShape.traverse((obj) => {
            if(obj.isLine2) {
                obj.material.color.set('red');
                obj.position.add(dir.clone().normalize().multiplyScalar(2));
            }
        })
        prevLabel = focusLabel;
        prevShape = focusShape;
    }

    return {
        scene,
        renderer,
        controls,
        focusCountry
    }

}