// 导入 Three.js 库的所有内容
import * as THREE from 'three';
// 导入 GLTFLoader 类，用于加载 GLB 格式的 3D 模型
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 导入 CSS2DObject 类，用于创建 2D 标签对象
import { CSS2DObject } from 'three/examples/jsm/Addons.js';

// 创建一个 GLTFLoader 实例，用于加载 GLB 模型
const loader = new GLTFLoader();

// 创建一个 Three.js 组对象，用于容纳舞台和舞者模型
const stage = new THREE.Group();

// 加载舞台的 GLB 模型
loader.load("../public/stage.glb", function (gltf) {
    // 在控制台打印加载的 GLTF 对象，方便调试
    console.log(gltf);
    // 将加载的模型场景添加到舞台组中
    stage.add(gltf.scene);
    // 对模型进行缩放，x、y、z 轴均缩放 50 倍
    gltf.scene.scale.set(50,50,50);

    // 遍历模型场景中的所有对象
    gltf.scene.traverse(obj => {
        // 设置所有对象接收阴影
        obj.receiveShadow = true;
    });
});

// 加载第一个舞者模型
loadDancer((dancer)=> {
    // 为舞者模型命名为 'dancer1'
    dancer.name = 'dancer1';
    // 遍历舞者模型中的所有对象
    dancer.traverse((obj) => {
        // 为每个对象添加 target 属性，指向舞者模型本身
        obj.target = dancer;
    });

    // 获取页面中 id 为 'dialog' 的元素
    const ele = document.getElementById('dialog');
    // 使用该元素创建一个 CSS2DObject 对象
    const obj = new CSS2DObject(ele);
    // 将 2D 标签对象添加到舞者模型上
    dancer.add(obj);
    // 设置 2D 标签对象的位置
    obj.position.set(1, 0, 0);
    // 显示 2D 标签元素
    ele.style.display = 'block';
    // 5 秒后更新 2D 标签元素的文本内容
    setTimeout(() => {
        ele.textContent = '谁叫你还搞不清楚我跟你的差别';
    }, 5000);
}, 200, Math.PI);

// 加载第二个舞者模型
loadDancer((dancer) => {
    // 获取页面中 id 为 'dialog2' 的元素
    const ele = document.getElementById('dialog2');
    // 使用该元素创建一个 CSS2DObject 对象
    const obj = new CSS2DObject(ele);
    // 显示 2D 标签元素
    ele.style.display = 'block';
    // 将 2D 标签对象添加到舞者模型上
    dancer.add(obj);
    // 设置 2D 标签对象的位置
    obj.position.set(1, 0, 0);
    // 8 秒后更新 2D 标签元素的文本内容
    setTimeout(() => {
        ele.textContent = '超人没空给你给你安慰';
    }, 8000);

    // 为舞者模型命名为 'dancer2'
    dancer.name = 'dancer2';
    // 遍历舞者模型中的所有对象
    dancer.traverse((obj) => {
        // 为每个对象添加 target 属性，指向舞者模型本身
        obj.target = dancer;
    });
    // 遍历舞者模型中的所有对象
    dancer.traverse(obj => {
        // 判断当前对象是否为网格对象
        if(obj.isMesh) {
            // 克隆对象的材质，避免多个对象共享同一材质
            obj.material = obj.material.clone();
            // 将网格对象的材质颜色设置为橙色
            obj.material.color.set('orange');
        }
    });
}, -200, 0);

/**
 * 加载舞者模型的函数
 * @param {Function} callback - 加载成功后的回调函数，参数为加载的舞者模型场景
 * @param {number} z - 舞者模型在 z 轴上的位置
 * @param {number} angle - 舞者模型绕 y 轴旋转的角度
 */
function loadDancer(callback, z, angle) {
    // 加载舞者的 GLB 模型
    loader.load("../public/Michelle.glb", function (gltf) {
        // 调用回调函数，传入加载的舞者模型场景
        callback(gltf.scene);

        // 遍历舞者模型场景中的所有对象
        gltf.scene.traverse(obj => {
            // 设置所有对象投射阴影
            obj.castShadow = true;
        });

        // 将舞者模型场景添加到舞台组中
        stage.add(gltf.scene);
        // 对舞者模型进行缩放，x、y、z 轴均缩放 300 倍
        gltf.scene.scale.set(300, 300, 300);
        // 设置舞者模型在 z 轴上的位置
        gltf.scene.position.z = z;
        // 让舞者模型绕 y 轴旋转指定角度
        gltf.scene.rotateY(angle);

        // 创建一个动画混合器，用于管理舞者模型的动画
        const mixer = new THREE.AnimationMixer(gltf.scene);
        // 获取模型的第一个动画剪辑并创建动画动作
        const clipAction = mixer.clipAction(gltf.animations[0]);
        // 播放动画动作
        clipAction.play();

        // 创建一个时钟对象，用于记录时间
        const clock = new THREE.Clock();
        /**
         * 渲染函数，用于更新动画并请求下一帧渲染
         */
        function render() {
            // 获取自上一帧以来的时间差
            const delta = clock.getDelta();
            // 使用时间差更新动画混合器
            mixer.update(delta);

            // 请求浏览器在下一帧调用 render 函数，实现动画循环
            requestAnimationFrame(render);
        }

        // 启动渲染循环
        render();
    });
}

// 导出舞台组对象
export default stage;
