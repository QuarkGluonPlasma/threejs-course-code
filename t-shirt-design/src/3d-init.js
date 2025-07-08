import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import mesh from './mesh';
import { DecalGeometry } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';

export function init(dom) {

    const scene = new THREE.Scene();
    scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 400, 300);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 500, 500);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
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

    const loader = new THREE.TextureLoader();

    // const texture = loader.load('./heart.png');
    // texture.colorSpace = THREE.SRGBColorSpace;

    let texture = null;

    renderer.domElement.addEventListener('click', (e) => {
        const y = -((e.offsetY / height) * 2 - 1);
        const x = (e.offsetX / width) * 2 - 1;
      
        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
        const intersections = rayCaster.intersectObjects(mesh.children);
        
        if(intersections.length) {
          const position = intersections[0].point;
            
          if(!texture) {
            return;
          }
          const orientation = new THREE.Euler();
          const size = new THREE.Vector3(100, 100, 100);
          const geometry = new DecalGeometry(intersections[0].object, position, orientation, size);
          const material = new THREE.MeshPhongMaterial({
              polygonOffset: true,
              polygonOffsetFactor: -4,
              map: texture,
              transparent: true,
          });
          const mesh = new THREE.Mesh( geometry, material );
          scene.add(mesh);
        }
    });
    
    const controls = new OrbitControls(camera, renderer.domElement);

    function changeTShirtColor(color) {
        const tshirt = scene.getObjectByName('tshirt');
        if(tshirt) {
            tshirt.material.color.set(color);
        }
    }

    function changeTexture(url) {
        texture = loader.load(url);
        texture.colorSpace = THREE.SRGBColorSpace;
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadImg() {
        renderer.render(scene, camera);
        renderer.domElement.toBlob((blob) => {
            if (blob) {
                downloadBlob(blob, 'design.png');
            }
        }, "image/png");
    }

    function downloadVideo() {
        const stream = renderer.domElement.captureStream(60);
        const recorder = new MediaRecorder(stream);
        recorder.start();
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            downloadBlob(event.data, `design.webm`);
          }
        };
        
        gsap.to(scene.rotation, {
            y: Math.PI * 2,
            duration: 3,
            onComplete() {
                scene.rotation.y = 0;
                recorder.stop();
            }
        });
    }

    return {
        scene,
        renderer,
        controls,
        changeTShirtColor,
        changeTexture,
        downloadImg,
        downloadVideo
    }
}