// 从 lodash-es 库中导入 throttle 函数，用于限制函数调用频率
import { throttle } from 'lodash-es';
// 导入 Three.js 库的所有内容
import * as THREE from 'three';
// 从 Three.js 示例模块中导入 SimplexNoise 类，用于生成 Simplex 噪声
import { SimplexNoise } from 'three/examples/jsm/Addons.js';
// 从 Three.js 示例模块的 tween 库中导入 Easing 缓动函数、Group 动画组和 Tween 动画对象
import { Easing, Group, Tween } from 'three/examples/jsm/libs/tween.module.js';

// 创建一个 Three.js 组对象，用于管理多个精灵对象
const group = new THREE.Group();

// 循环创建 100 个精灵对象
for (let i = 0; i < 100; i ++) {
    // 创建一个精灵材质，设置颜色为橙色
    const material = new THREE.SpriteMaterial({
        color: 'orange'
    });
    // 使用创建的材质创建一个精灵对象
    const sprite = new THREE.Sprite(material);
    // 设置精灵对象的缩放大小
    sprite.scale.set(100,100);
    // 将精灵对象添加到组中
    group.add(sprite);

    // 生成随机的 x、y、z 坐标，范围在 -2000 到 2000 之间
    const x = -2000 + 4000 * Math.random();
    const y = -2000 + 4000 * Math.random();
    const z = -2000 + 4000 * Math.random();
    // 设置精灵对象的初始位置
    sprite.position.set(x, y, z);
}

// 实例化 SimplexNoise 对象，用于后续生成噪声值
const simplex = new SimplexNoise();

// 创建一个 Tween 动画组，用于管理所有的 Tween 动画
const tweenGroup = new Group();

// 初始化时间变量，用于控制 Simplex 噪声的变化
let time = 0;
/**
 * 更新组内所有精灵对象的位置
 */
function updatePosition() {
    // 遍历组内的所有对象
    group.traverse(obj => {
        // 检查当前对象是否为精灵对象
        if(obj.isSprite) {
            // 获取精灵对象当前的位置坐标
            const { x, y, z} = obj.position;
            // 根据当前位置和时间计算新的 x 坐标，使用 Simplex 噪声添加随机偏移
            const x2 = x + simplex.noise(x, time) * 100;
            // 根据当前位置和时间计算新的 y 坐标，使用 Simplex 噪声添加随机偏移
            const y2 = y + simplex.noise(y, time) * 100;
            // 根据当前位置和时间计算新的 z 坐标，使用 Simplex 噪声添加随机偏移
            const z2 = z + simplex.noise(z, time) * 100;
            // 注释掉的代码：直接设置精灵对象的位置
            // obj.position.set(x2, y2, z2);

            // 创建一个 Tween 动画，将精灵对象的位置平滑过渡到新的坐标
            const tween= new Tween(obj.position).to({
                x: x2,
                y: y2,
                z: z2
            }, 500)
            // 设置动画的缓动函数为二次方缓入缓出
            .easing(Easing.Quadratic.InOut)
            // 设置动画不重复
            .repeat(0)
            // 启动动画
            .start()
            // 动画完成时的回调函数，将动画从动画组中移除
            .onComplete(() => {
                tweenGroup.remove(tween);
            })
            // 将动画添加到动画组中
            tweenGroup.add(tween);
        }
    })
    // 时间变量递增
    time++;
}

// 使用 throttle 函数限制 updatePosition 函数的调用频率，每 500 毫秒最多调用一次
const updatePosition2 = throttle(updatePosition, 200);

/**
 * 渲染函数，用于更新动画和请求下一帧渲染
 */
function render() {
    // 更新 Tween 动画组中的所有动画
    tweenGroup.update();
    // 调用节流后的更新位置函数
    // updatePosition2();
    // 请求浏览器在下一帧调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}

// 启动渲染循环
render();

// 导出包含所有精灵对象的组
export default group;
