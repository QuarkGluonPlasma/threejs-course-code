import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { MapControls, TransformControls } from 'three/examples/jsm/Addons.js';
import type { Action } from '../../store';

export function init2D(
    dom: HTMLElement,
    updateFurniture: Action['updateFurniture'],
    setCurSelectedFurniture: Action['setCurSelectedFurniture']
) {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(50000);
    // scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const width = window.innerWidth;
    const height = window.innerHeight - 60;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 100000);
    camera.position.set(0, 10000, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor('lightblue');

    const controls = new MapControls(camera, renderer.domElement);
    controls.enableRotate = false;
    // controls.target.set(200, 0, -100);
    // controls.addEventListener('change', () => {
    //     console.log(controls.target, camera.position);
    // });

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.showY = false;

    const transformHelper = transformControls.getHelper();
    scene.add(transformHelper);

    transformControls.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
    });

    transformControls.addEventListener('change', () => {
        const obj = transformControls.object;

        if(obj) {
            if(transformControls.mode === 'translate') {
                updateFurniture(obj.name, 'position',new THREE.Vector3(
                    -obj.position.x,
                    -obj.position.y,
                    -obj.position.z
                ));
            } else if(transformControls.mode === 'rotate'){
                updateFurniture(obj.name, 'rotation', new THREE.Vector3(
                    obj.rotation.x,
                    obj.rotation.y,
                    obj.rotation.z
                ));
            }
        }
    });
    function render() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();

    dom.append(renderer.domElement);

    window.onresize = function () {

        const size = renderer.getSize(new THREE.Vector2());

        if(size.y === 200) {
            return;
        }
        const width = window.innerWidth;
        const height = window.innerHeight - 60;

        renderer.setSize(width,height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener('click', (e) => {

        const { x: width, y: height} = renderer.getSize(new THREE.Vector2());

        const y = -((e.offsetY / height) * 2 - 1);
        const x = (e.offsetX / width) * 2 - 1;
      
        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

        const furnitures = scene.getObjectByName('furnitures')!;
        const intersections2 = rayCaster.intersectObjects(furnitures.children);

        if(intersections2.length) {
            const obj = intersections2[0].object as any;
            if(obj.target) {
                transformControls.attach(obj.target);
                setCurSelectedFurniture(obj.target.name);
            }
        } else {
            transformControls.detach();
            setCurSelectedFurniture('');
        }
    });

    function changeMode(isTranslate: boolean) {
        if(isTranslate) {
            transformControls.mode = 'translate';
            transformControls.showX = true;
            transformControls.showZ = true;
            transformControls.showY = false;
        } else {
            transformControls.mode = 'rotate';
            transformControls.showX = false;
            transformControls.showZ = false;
            transformControls.showY = true;
        }
    }


    function changeSize(isBig: boolean) {
        if(isBig) {
            const width = window.innerWidth;
            const height = window.innerHeight - 60;

            renderer.setSize(width,height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        } else {
            const width = 240;
            const height = 200;

            renderer.setSize(width,height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }

    function detachTransformControls() {
        transformControls.detach();
    }

    return {
        scene,
        changeMode,
        changeSize,
        detachTransformControls
    }
}