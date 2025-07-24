// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入 GLTFLoader，用于加载 GLTF 格式的 3D 模型
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 创建一个 GLTFLoader 实例，用于加载 GLTF 模型
const loader = new GLTFLoader();

// 创建一个 Three.js 组对象，用于存放加载的模型
const mesh = new THREE.Group();

// 使用 GLTFLoader 加载指定路径的 GLTF 模型
// 第一个参数是模型文件的路径
// 第二个参数是加载成功后的回调函数
loader.load("../public/Horse.gltf", function (gltf) {
    // 在控制台打印加载成功的 GLTF 对象，方便调试
    console.log(gltf);
    // 将 GLTF 对象中的场景添加到之前创建的组对象中
    mesh.add(gltf.scene);
    // 对加载的模型进行缩放，在 X、Y、Z 轴上均放大 30 倍
    gltf.scene.scale.set(30, 30, 30);

    // 遍历 GLTF 场景中的所有对象
    gltf.scene.traverse(obj => {
        // 判断当前对象是否为网格对象
        if(obj.isMesh) {
            // 在控制台打印网格对象信息，方便调试
            console.log('mesh', obj);
            // 判断网格对象的名称是否为 'Cylinder'
            if(obj.name === 'Cylinder') {
                // 将名称为 'Cylinder' 的网格对象的材质颜色设置为白色
                obj.material.color = new THREE.Color('white');
            } 
            // 判断网格对象的名称是否为 'Cylinder_1'
            else if(obj.name === 'Cylinder_1') {
                // 将名称为 'Cylinder_1' 的网格对象的材质颜色设置为粉色
                obj.material.color = new THREE.Color('pink');
            }
        }
    });

    // 创建一个动画混合器，用于管理和播放模型的动画
    const mixer = new THREE.AnimationMixer(gltf.scene);
    // 获取 GLTF 对象中第 5 个动画剪辑（索引从 0 开始），并创建一个动画动作
    const clipAction = mixer.clipAction(gltf.animations[4]);
    // 播放动画动作
    clipAction.play();

    // 创建一个时钟对象，用于获取时间差，控制动画的更新
    const clock = new THREE.Clock();
    /**
     * 渲染函数，用于循环更新动画并请求下一帧渲染
     */
    function render() {
        // 请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
        requestAnimationFrame(render);

        // 获取自上次调用 getDelta 方法以来经过的时间差
        const delta = clock.getDelta();
        // 使用时间差更新动画混合器，驱动动画播放
        mixer.update(delta);
    }
    // 调用 render 函数，开始动画循环
    render();
})

// 将包含加载模型的组对象作为默认导出，供其他模块使用
export default mesh;
