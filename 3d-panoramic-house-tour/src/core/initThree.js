import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PANORAMA_CENTER, PANORAMA_TARGET_OFFSET } from '../panorama/constants.js';

export function initThree() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.maxDistance = 1;

  const [x, y, z] = PANORAMA_CENTER;
  const [tx, ty, tz] = PANORAMA_TARGET_OFFSET;
  camera.position.set(x, y, z);
  controls.target.set(tx, ty, tz);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);

  function startRenderLoop() {
    function render() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();
  }

  return { scene, camera, renderer, controls, startRenderLoop };
}
