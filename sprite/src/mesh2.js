// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 创建一个正十二面体网格对象
 * @param {string|number} color - 网格材质的颜色，可以是颜色字符串或十六进制数值
 * @param {number} x - 网格对象在 X 轴上的位置
 * @returns {THREE.Mesh} - 返回创建好的正十二面体网格对象
 */
function createMesh(color, x) {
    // 创建一个正十二面体几何体，半径为 1
    const geometry = new THREE.DodecahedronGeometry(1);
    // 创建一个基础网格材质，设置颜色为传入的参数
    const material = new THREE.MeshBasicMaterial({
        color: color
    });
    // 创建一个网格对象，将几何体和材质组合在一起
    const mesh = new THREE.Mesh(geometry, material);
    // 设置网格对象在 X 轴上的位置
    mesh.position.x = x;
    return mesh;
}

// 创建一个橙色的正十二面体网格对象，位于 X 轴原点
const mesh = createMesh('orange', 0);
// 创建一个天蓝色的正十二面体网格对象，位于 X 轴坐标 5 的位置
const mesh2 = createMesh('skyblue', 5);
// 创建一个浅绿色的正十二面体网格对象，位于 X 轴坐标 -5 的位置
const mesh3 = createMesh('lightgreen', -5);

// 创建一个 Three.js 组对象，用于将多个对象组合在一起
const group = new THREE.Group();
// 将第一个网格对象添加到组中
group.add(mesh);
// 将第二个网格对象添加到组中
group.add(mesh2);
// 将第三个网格对象添加到组中
group.add(mesh3);

// 创建一个纹理加载器实例，用于加载纹理图片
const loader = new THREE.TextureLoader();

/**
 * 创建一个精灵对象
 * @param {number} x - 精灵对象在 X 轴上的位置
 * @param {number} y - 精灵对象在 Y 轴上的位置
 * @returns {THREE.Sprite} - 返回创建好的精灵对象
 */
function createSprite(x, y) {
    // 加载指定路径的纹理图片
    const texture = loader.load('../public/snow.png', () => {
        console.log("纹理加载完成");
    }, () => {
        console.log("纹理加载失败");
    });

    // 创建一个精灵材质，将加载的纹理应用到材质上
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture
    });
    // 创建一个精灵对象，将精灵材质应用到对象上
    const sprite = new THREE.Sprite(spriteMaterial);
    // 设置精灵对象在 X 轴上的位置
    sprite.position.x = x;
    // 设置精灵对象在 Y 轴上的位置
    sprite.position.y = y;
    // 设置精灵对象在 X、Y、Z 轴上的缩放比例
    // sprite.scale.set(4, 4, 4);
    return sprite;
}

// 创建第一个精灵对象，位于 X 轴原点，Y 轴坐标 1.5 的位置
const sprite1 = createSprite(0, 1.5);
// 创建第二个精灵对象，位于 X 轴坐标 5，Y 轴坐标 1.5 的位置
const sprite2 = createSprite(5, 1.5);
// 创建第三个精灵对象，位于 X 轴坐标 -5，Y 轴坐标 1.5 的位置
const sprite3 = createSprite(-5, 1.5);
// 将第一个精灵对象添加到组中
group.add(sprite1);
// 将第二个精灵对象添加到组中
group.add(sprite2);
// 将第三个精灵对象添加到组中
group.add(sprite3);

group.scale.set(40, 40, 40)

// 将包含所有网格和精灵对象的组作为默认导出，供其他模块使用
export default group;
