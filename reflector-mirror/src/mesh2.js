// 导入 three.js 库的所有模块，并将其命名为 THREE，方便后续使用 three.js 提供的各种功能
import * as THREE from 'three';
// 从 three.js 的示例模块中导入 Reflector 类，用于创建反射效果的对象
import { Reflector } from 'three/examples/jsm/Addons.js';

// 创建一个 THREE.Group 实例，用于将多个 3D 对象组合在一起
const group = new THREE.Group();

/**
 * 创建一个带有反射效果的镜子对象
 * @param {string} name - 镜子对象的名称
 * @param {number} z - 镜子在 z 轴上的位置
 * @param {number} rotationY - 镜子绕 y 轴的旋转角度
 * @returns {Reflector} - 返回创建好的反射镜对象
 */
function createMirror(name, z, rotationY) {
    // 创建一个平面几何体，宽度和高度均为 1000
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    // 创建一个 Reflector 实例，用于实现反射效果
    const mesh = new Reflector(geometry, {
        // 注释掉的颜色设置，若取消注释可改变反射的颜色
        // color: 'blue',
        // 设置反射纹理的宽度，考虑设备像素比以获得更清晰的效果
        textureWidth: window.innerWidth * window.devicePixelRatio,
        // 设置反射纹理的高度，考虑设备像素比以获得更清晰的效果
        textureHeight: window.innerHeight * window.devicePixelRatio,
    });
    // 为反射镜对象设置名称
    mesh.name = name;
    // 设置反射镜对象在 z 轴上的位置
    mesh.position.z = z;
    // 让反射镜对象绕 y 轴旋转指定的角度
    mesh.rotateY(rotationY);
    return mesh;
}

/**
 * 创建一个球体对象
 * @returns {THREE.Mesh} - 返回创建好的球体网格对象
 */
function createBall() {
    // 创建一个球体几何体，半径为 100
    const geometry = new THREE.SphereGeometry(100);
    // 创建一个基于物理的标准材质，颜色设置为浅绿色
    const material = new THREE.MeshStandardMaterial({
        color: 'lightgreen'
    });
    // 创建一个网格对象，将球体几何体和标准材质组合在一起
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// 将名为 'mirror1' 的反射镜对象添加到组中，位置在 z 轴 -500 处，不旋转
group.add(createMirror('mirror1', -500, 0));
// 将名为 'mirror2' 的反射镜对象添加到组中，位置在 z 轴 500 处，绕 y 轴旋转 180 度
group.add(createMirror('mirror2', 500, Math.PI));
// 将创建好的球体对象添加到组中
group.add(createBall());

// 导出组合对象，供其他模块引入使用
export default group;
