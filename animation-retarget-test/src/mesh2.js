import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

// 暴露给重定向使用的源 SkinnedMesh 和源动画
export let sourceSkin = null;
export let sourceClip = null;

function findSkinnedMesh(root) {
  let skinned = null;
  root.traverse((obj) => {
    if (!skinned && obj.isSkinnedMesh) {
      skinned = obj;
    }
  });
  return skinned;
}


loader.load('./Michelle.glb', function (gltf) {
  console.log(gltf);
  mesh.add(gltf.scene);
  gltf.scene.scale.set(100, 100, 100);

  gltf.scene.position.set(200, 0, 0);

  const mixer = new THREE.AnimationMixer(gltf.scene);

  // 源：Michelle 的 SkinnedMesh + 第 0 个动画
  sourceSkin = findSkinnedMesh(gltf.scene);
  sourceClip = gltf.animations[0] || null;

  if (sourceClip) {
    const clipAction = mixer.clipAction(sourceClip);
    clipAction.play();
  }

  const timer = new THREE.Timer();
  timer.connect(document);
  function render(timestamp) {
    timer.update(timestamp);
    mixer.update(timer.getDelta());
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
});

export default mesh;

