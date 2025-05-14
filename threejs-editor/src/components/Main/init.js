import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import { MeshTypes } from '../../store';
import { EffectComposer, GammaCorrectionShader, OutlinePass, RenderPass, ShaderPass, TransformControls } from 'three/examples/jsm/Addons.js';

export function init(dom, data, onSelected, updateMeshInfo) {
    const scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);
    const gridHeper = new THREE.GridHelper(1000);
    scene.add(gridHeper);

    // data.meshArr.forEach(item => {
    //     if(item.type === MeshTypes.Box) {
    //         const { width, height, depth, material: { color }} = item.props;
    //         const geometry = new THREE.BoxGeometry(width, height, depth);
    //         const material = new THREE.MeshPhongMaterial({
    //             color
    //         });
    //         const mesh = new THREE.Mesh(geometry, material);
    //         scene.add(mesh);
    //     } 
    // })

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = 1000;
    const height = window.innerHeight - 60;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(500, 500, 500);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
    const outlinePass = new OutlinePass(v, scene, camera);
    outlinePass.pulsePeriod = 1;
    composer.addPass(outlinePass);

    const gammaPass= new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaPass);

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    const transformControls = new TransformControls(camera, renderer.domElement);
    const transformHelper = transformControls.getHelper();
    scene.add(transformHelper);

    transformControls.addEventListener('dragging-changed', function (event) {
        orbitControls.enabled = !event.value;
    });

    transformControls.addEventListener('change', () => {
        const obj = transformControls.object;
        if(obj) {
            if(transformControls.mode === 'translate') {
                updateMeshInfo(obj.name, obj.position, 'position');
            } else if(transformControls.mode === 'scale') {
                updateMeshInfo(obj.name, obj.scale, 'scale');
            } else if(transformControls.mode === 'rotate'){
                updateMeshInfo(obj.name, obj.rotation, 'rotation');
            }
        }
    });

    function render(time) {
        composer.render();
        // renderer.render(scene, camera);
        transformControls.update(time);
        requestAnimationFrame(render);
    }
    render();

    dom.append(renderer.domElement);

    window.onresize = function () {
        const width = 1000;
        const height = window.innerHeight - 60;

        renderer.setSize(width,height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener('click', (e) => {
        const y = -((e.offsetY / height) * 2 - 1);
        const x = (e.offsetX / width) * 2 - 1;
    
        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);
    
        const objs = scene.children.filter(item => {
            return item.name.startsWith('Box') || item.name.startsWith('Cylinder')
        })
        const intersections = rayCaster.intersectObjects(objs);
        
        if(intersections.length) {
          const obj = intersections[0].object;
        //   obj.material.color.set('green');
            outlinePass.selectedObjects = [obj];
            onSelected(obj);
            transformControls.attach(obj);
        } else {
            outlinePass.selectedObjects = [];
            onSelected(null);
            transformControls.detach();
        }
    });
    
    function setTransformControlsMode(mode) {
        transformControls.setMode(mode);
    }

    return {
        scene,  
        setTransformControlsMode  
    }
}