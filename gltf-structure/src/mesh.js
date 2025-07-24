// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 从 Three.js 拓展库中导入 GLTFLoader，用于加载 GLTF/GLB 格式的 3D 模型
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 从 Three.js 示例模块中导入 DRACOLoader，用于处理经过 Draco 压缩的 GLTF 模型
// 注意：当前代码中声明了 DRACOLoader 但未使用
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

// 创建一个 GLTFLoader 实例，用于加载 GLTF/GLB 模型
const loader = new GLTFLoader();

// 创建一个 Three.js 组对象，用于将多个 3D 模型组合在一起
const mesh = new THREE.Group();

/**
 * 加载第一个 GLTF 模型
 * @param {string} "./gltf1/CesiumMan.gltf" - 模型文件的路径
 * @param {function} callback - 加载成功后的回调函数
 */
loader.load("./gltf1/CesiumMan.gltf", function (gltf) {
    // 在控制台打印加载成功后的 GLTF 对象，方便调试查看模型信息
    console.log(gltf);
    // 将加载的模型场景添加到之前创建的组对象中
    mesh.add(gltf.scene);

    // 设置模型的缩放比例，在 X、Y、Z 三个轴上都放大 50 倍
    gltf.scene.scale.set(50, 50, 50);

    // 遍历模型场景中的所有对象
    gltf.scene.traverse(obj => {
        // 判断当前对象是否为网格对象
        if(obj.isMesh) {
            // 在控制台打印网格对象的名称和对象本身，方便调试
            console.log(obj.name, obj);

            // 将网格对象的材质设置为线框模式，只显示模型的轮廓线
            obj.material.wireframe = true;
            // 将网格对象的材质颜色设置为橙色
            obj.material.color.set('orange');
            // 移除网格对象材质的纹理贴图
            obj.material.map = null;
        }
    })
});

/**
 * 加载第二个 GLTF 模型
 * @param {string} "./gltf2/CesiumMan.gltf" - 模型文件的路径
 * @param {function} callback - 加载成功后的回调函数
 */
loader.load("./gltf2/CesiumMan.gltf", function (gltf) {
    // 将加载的模型场景添加到之前创建的组对象中
    mesh.add(gltf.scene);

    // 设置模型的缩放比例，在 X、Y、Z 三个轴上都放大 50 倍
    gltf.scene.scale.set(50, 50, 50);
    // 将模型场景沿 X 轴负方向平移 50 个单位
    gltf.scene.translateX(-50);

    // 遍历模型场景中的所有对象
    gltf.scene.traverse(obj => {
        // 判断当前对象是否为网格对象
        if(obj.isMesh) {
            // 将网格对象的材质设置为线框模式，只显示模型的轮廓线
            obj.material.wireframe = true;
            // 将网格对象的材质颜色设置为浅蓝色
            obj.material.color.set('lightblue');
            // 移除网格对象材质的纹理贴图
            obj.material.map = null;
        }
    })
});

/**
 * 加载第三个 GLB 模型
 * @param {string} "./gltf3/CesiumMan.glb" - 模型文件的路径
 * @param {function} callback - 加载成功后的回调函数
 */
loader.load("./gltf3/CesiumMan.glb", function (gltf) {
    // 将加载的模型场景添加到之前创建的组对象中
    mesh.add(gltf.scene);

    // 设置模型的缩放比例，在 X、Y、Z 三个轴上都放大 50 倍
    gltf.scene.scale.set(50, 50, 50);
    // 将模型场景沿 X 轴正方向平移 50 个单位
    gltf.scene.translateX(50);

    // 遍历模型场景中的所有对象
    gltf.scene.traverse(obj => {
        // 判断当前对象是否为网格对象
        if(obj.isMesh) {
            // 将网格对象的材质设置为线框模式，只显示模型的轮廓线
            obj.material.wireframe = true;
            // 将网格对象的材质颜色设置为浅绿色
            obj.material.color.set('lightgreen');
            // 移除网格对象材质的纹理贴图
            obj.material.map = null;
        }
    })
});

// 将包含所有加载模型的组对象作为默认导出，供其他模块使用
export default mesh;
