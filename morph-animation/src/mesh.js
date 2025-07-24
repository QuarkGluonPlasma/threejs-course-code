// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';
// 导入 lil-gui 库，用于创建图形用户界面
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// 创建一个立方体几何体，宽、高、深均为 300 单位
const geometry = new THREE.BoxGeometry(300, 300, 300);
// 创建一个 MeshLambert 材质，该材质会对光照产生反应，设置颜色为橙色
const material = new  THREE.MeshLambertMaterial({
    color: 'orange'
});

// 克隆几何体的顶点位置属性，用于创建第一个变形目标
const positions = geometry.attributes.position.clone();
// 遍历所有顶点，将每个顶点的 Y 坐标乘以 2
for(let i = 0; i < positions.count; i++) {
    positions.setY(i, positions.getY(i) * 2);
}

// 克隆几何体的顶点位置属性，用于创建第二个变形目标
const positions2 = geometry.attributes.position.clone();
// 遍历所有顶点，将每个顶点的 X 坐标乘以 2
for(let i = 0; i < positions2.count; i++) {
    positions2.setX(i, positions2.getX(i) * 2);
}

// 将克隆并修改后的顶点位置数组作为变形目标添加到几何体中
geometry.morphAttributes.position = [positions, positions2];

// 创建一个网格对象，将几何体和材质组合在一起
const mesh = new THREE.Mesh(geometry, material);

// 创建一个 lil-gui 实例，用于创建图形用户界面
const gui = new GUI();

// 在 GUI 中添加一个滑块，用于控制第一个变形目标的影响程度，范围从 0 到 1
gui.add(mesh.morphTargetInfluences, '0', 0, 1);
// 在 GUI 中添加一个滑块，用于控制第二个变形目标的影响程度，范围从 0 到 1
gui.add(mesh.morphTargetInfluences, '1', 0, 1);
// 注释掉的代码，原本用于直接设置第一个变形目标的影响程度为 0
// mesh.morphTargetInfluences[0] = 0;
// 注释掉的代码，原本用于直接设置第二个变形目标的影响程度为 1
// mesh.morphTargetInfluences[1] = 1;

// 为网格对象设置名称，方便后续动画引用
mesh.name = "Kkk";
// 创建第一个关键帧轨道，控制名为 "Kkk" 的网格对象的第一个变形目标影响程度
// 在 0 秒时影响程度为 0，在 3 秒时影响程度为 0.5
const track1 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[0]', [0, 3], [0, 0.5]);
// 创建第二个关键帧轨道，控制名为 "Kkk" 的网格对象的第二个变形目标影响程度
// 在 3 秒时影响程度为 0，在 6 秒时影响程度为 1
const track2 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[1]', [3, 6], [0, 1]);
// 创建一个动画剪辑，名为 "aaaa"，持续时间为 6 秒，包含两个关键帧轨道
const clip = new THREE.AnimationClip("aaaa", 6, [track1, track2]);

// 创建一个动画混合器，用于管理和播放网格对象的动画
const mixer = new THREE.AnimationMixer(mesh);
// 创建一个动画动作，将动画剪辑应用到混合器上
const clipAction = mixer.clipAction(clip);
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
    // 用于使用时间差更新动画混合器，驱动动画播放
    // mixer.update(delta);

    // 请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 调用 render 函数，开始渲染循环
render();

// 将网格对象作为默认导出，供其他模块使用
export default mesh;
