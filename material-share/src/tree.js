import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const tree = new THREE.Group();

const loader = new GLTFLoader();

function loadTree(callback) {
    loader.load('../public/FemaleGorgo.glb', gltf => {
        // console.log(gltf);
    
        tree.add(gltf.scene);
        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(gltf.scene);
        // 检查模型是否包含动画剪辑
        if (gltf.animations && gltf.animations.length > 0) {
            // 获取第一个动画剪辑
            const clip = gltf.animations[0];
            // 创建动画动作
            const action = mixer.clipAction(clip);
            // 播放动画
            action.play();
        }

        // 创建时钟对象，用于获取时间差
        const clock = new THREE.Clock();
        /**
         * 渲染函数，用于更新动画并循环渲染
         */
        function animate() {
            // 获取自上次调用 getDelta 方法以来经过的时间差
            const delta = clock.getDelta();
            // 更新动画混合器
            mixer.update(delta);
            // 请求下一帧动画
            requestAnimationFrame(animate);
        }
        // 开始动画循环
        animate();
        callback(tree);
    });
}

function loadTrees(callback) {
    loader.load('../public/tyrannosaurus.glb', gltf => {
        console.log(gltf);
    
        tree.add(gltf.scene);
        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(gltf.scene);
        // 检查模型是否包含动画剪辑
        if (gltf.animations && gltf.animations.length > 0) {
            // 获取第一个动画剪辑
            const clip = gltf.animations[0];
            // 创建动画动作
            const action = mixer.clipAction(clip);
            // 播放动画
            action.play();
        }

        // 创建时钟对象，用于获取时间差
        const clock = new THREE.Clock();
        /**
         * 渲染函数，用于更新动画并循环渲染
         */
        function animate() {
            // 获取自上次调用 getDelta 方法以来经过的时间差
            const delta = clock.getDelta();
            // 更新动画混合器
            mixer.update(delta);
            // 请求下一帧动画
            requestAnimationFrame(animate);
        }
        // 开始动画循环
        animate();
        callback(tree);
    });
}

export {
    loadTree,
    loadTrees,
};