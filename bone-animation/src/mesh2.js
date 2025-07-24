// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入 GLTFLoader，用于加载 GLTF 格式的 3D 模型
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 创建一个 GLTFLoader 实例，用于加载 GLTF 模型
const loader = new GLTFLoader();

// 创建一个 Three.js 组对象，用于存放加载的模型和相关辅助对象
const mesh = new THREE.Group();

// 使用 GLTFLoader 加载指定路径的 GLTF 模型
// 第一个参数是模型文件的路径
// 第二个参数是加载成功后的回调函数
loader.load("../public/Michelle.glb", function (gltf) {
    // 在控制台打印加载成功的 GLTF 对象，方便调试
    console.log(gltf);
    // 将 GLTF 对象中的场景添加到之前创建的组对象中
    mesh.add(gltf.scene);
    // 对加载的模型进行缩放，在 X、Y、Z 轴上均放大 100 倍
    gltf.scene.scale.set(100, 100, 100);

    // 创建一个骨骼辅助器对象，用于可视化模型的骨骼结构
    const helper = new THREE.SkeletonHelper(gltf.scene);
    // 将骨骼辅助器添加到组对象中
    mesh.add(helper);

    // 遍历 GLTF 场景中的所有对象
    // gltf.scene.traverse(obj => {
    //     // 判断当前对象是否为骨骼对象，并且骨骼名称是否为 "mixamorigSpine2"
    //     if(obj.isBone && obj.name === "mixamorigSpine2") {
    //         // 若满足条件，将该骨骼绕 X 轴逆时针旋转 60 度（-Math.PI / 3 表示 -60 度的弧度值）
    //         obj.rotateX(-Math.PI / 3);
    //     }
    // })

    // 创建一个关键帧轨道对象
    // 第一个参数指定目标对象的属性路径，这里是 "mixamorigSpine2" 骨骼的位置属性
    // 第二个参数是时间数组，表示关键帧的时间点
    // 第三个参数是值数组，表示对应时间点的属性值，这里是位置坐标
    const track1 = new THREE.KeyframeTrack('mixamorigSpine2.position', [0, 3], [0, 0, 0, 0, 0, 30]);
    // 创建一个动画剪辑对象
    // 第一个参数是动画剪辑的名称
    // 第二个参数是动画的持续时间（秒）
    // 第三个参数是包含关键帧轨道的数组
    const clip = new THREE.AnimationClip("bbb", 3, [track1]);
    
    // 创建一个动画混合器，用于管理和播放模型的动画
    const mixer = new THREE.AnimationMixer(mesh);
    // 创建一个动画动作，使用 GLTF 对象中的第一个动画剪辑
    const clipAction = mixer.clipAction(gltf.animations[0]);
    // 播放动画动作
    clipAction.play();

    // 创建一个时钟对象，用于获取时间差，控制动画的更新
    const clock = new THREE.Clock();
    /**
     * 渲染函数，用于循环更新动画并请求下一帧渲染
     */
    function render() {
        // 获取自上次调用 getDelta 方法以来经过的时间差
        const delta = clock.getDelta();
        // 注释掉的代码，若取消注释，将使用时间差更新动画混合器，驱动动画播放
        // mixer.update(delta);

        // 请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
        requestAnimationFrame(render);
    }

    // 调用 render 函数，开始动画循环
    render();
})

// 将包含加载模型和辅助对象的组对象作为默认导出，供其他模块使用
export default mesh;
