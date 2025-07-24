// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建一个纹理加载器实例，用于加载纹理图片
const loader = new THREE.TextureLoader();
// 使用纹理加载器加载指定路径的纹理图片，这里加载的是 snow.png
const texture = loader.load("../public/snow.png");
// 创建一个精灵材质对象，将加载好的纹理应用到该材质上
const spriteMaterial = new THREE.SpriteMaterial({
    map: texture
});

// 创建一个 Three.js 组对象，用于将多个精灵对象组合在一起
const group = new THREE.Group();

// 使用 for 循环创建 10000 个精灵对象，模拟雪花效果
for (let i = 0; i < 10000; i ++) {
    // 创建一个精灵对象，使用之前创建好的精灵材质
    const sprite = new THREE.Sprite(spriteMaterial);

    // 生成随机的 X 坐标，范围在 0 到 1000 之间
    const x = 1000 * Math.random();
    // 生成随机的 Y 坐标，范围在 0 到 1000 之间
    const y = 1000 * Math.random();
    // 生成随机的 Z 坐标，范围在 0 到 1000 之间
    const z = 1000 * Math.random();
    // 设置精灵对象的位置
    sprite.position.set(x, y, z);

    sprite.scale.set(4, 4, 4)

    // 将创建好的精灵对象添加到组对象中
    group.add(sprite);
}

// 创建一个时钟对象，用于获取时间差，实现动画效果
const clock = new THREE.Clock();
/**
 * 渲染函数，用于实现雪花下落的动画效果
 */
function render() {
    // 获取自上次调用 getDelta 方法以来经过的时间差
    const delta = clock.getDelta();
    // 遍历组对象中的所有精灵对象
    group.children.forEach(sprite => {
        // 让精灵对象（雪花）沿 Y 轴负方向移动，移动速度由时间差和系数 10 决定
        sprite.position.y -= delta * 10 * Math.random() * 10;

        // 若雪花的 Y 坐标小于 0，说明雪花落到了底部，将其 Y 坐标重置为 1000，实现循环下落效果
        if (sprite.position.y < 0) {
            sprite.position.y = 1000;
        }
    });

    // 使用 requestAnimationFrame 方法请求浏览器在下一次重绘之前调用 render 函数，实现动画循环
    requestAnimationFrame(render);
}
// 调用 render 函数，开始动画循环
render();

// 将包含所有雪花精灵对象的组对象作为默认导出，供其他模块使用
export default group;
