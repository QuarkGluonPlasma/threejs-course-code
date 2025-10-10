import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';

let curPageNo;

export function getCurPageNo() {
    return curPageNo;
}

export function init(dom) {

    const scene = new THREE.Scene();
    scene.add(mesh);

    // const axesHelper = new THREE.AxesHelper(5000);
    // scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 50000);
    // camera.position.set(-3000, 5000, 1000);
    // camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);

    function render(time) {
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
    
    // const controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('scroll', () => {
        const pageNo = Math.round(window.scrollY /window.innerHeight);
        
        if(pageNo !== curPageNo) {
            curPageNo = pageNo;
            console.log(pageNo);
            if(curPageNo === 0) {
                return;
            }
            camera.parent?.remove(camera);
            const targetGroup = mesh.getObjectByName('planetGroup' + (curPageNo - 1));
            targetGroup.add(camera);

            const planet = targetGroup.children[0];

            const r = planet.geometry.parameters.radius;
        
            camera.position.set(0, 0, r * 5);
        }
    });

    return {
        scene,
        renderer,
        // controls
    }
}
