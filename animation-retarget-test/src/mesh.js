import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { sourceSkin, sourceClip } from './mesh2.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

function findSkinnedMesh(root) {
  let skinned = null;
  root.traverse((obj) => {
    if (!skinned && obj.isSkinnedMesh) {
      skinned = obj;
    }
  });
  return skinned;
}

loader.load('./Soldier.glb', function (gltf) {
  console.log(gltf);
  mesh.add(gltf.scene);
  gltf.scene.scale.set(100, 100, 100);

  // Soldier 作为重定向目标
  const soldierSkin = findSkinnedMesh(gltf.scene);

  let danceMixer = null;

  function tryPlayRetarget() {
    if (!soldierSkin || !sourceSkin || !sourceClip) {
      requestAnimationFrame(tryPlayRetarget);
      return;
    }

    try {
      const retargetedClip = SkeletonUtils.retargetClip(
        sourceSkin, // 源：Michelle 的 SkinnedMesh
        soldierSkin, // 目标：Soldier 的 SkinnedMesh
        sourceClip,
        {
          hip: 'mixamorigHips',
          scale: 1,
          getBoneName: (bone) => bone.name,
        },
      );

      danceMixer = new THREE.AnimationMixer(soldierSkin);
      const danceAction = danceMixer.clipAction(retargetedClip);
      danceAction.setLoop(THREE.LoopRepeat);
      danceAction.play();
    } catch (err) {
      console.warn('跳舞动画重定向失败:', err);
    }
  }

  tryPlayRetarget();

  const timer = new THREE.Timer();
  timer.connect(document);
  function render(timestamp) {
    timer.update(timestamp);

    if (danceMixer) {
      danceMixer.update(timer.getDelta());
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
});

export default mesh;

