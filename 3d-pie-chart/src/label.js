// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

/**
 * 创建一个包含指定文本的 Canvas 元素
 * @param {string} text - 要显示在 Canvas 上的文本
 * @param {number} width - Canvas 的宽度
 * @returns {HTMLCanvasElement} - 包含指定文本的 Canvas 元素
 */
function createCanvas(text, width) {
    // 创建一个新的 Canvas 元素
    const canvas = document.createElement("canvas");
    // 获取设备的像素比，用于处理高清屏幕
    const dpr = window.devicePixelRatio;
    // 设置 Canvas 的宽度，考虑设备像素比
    const w = canvas.width = width * dpr;
    // 设置 Canvas 的高度，考虑设备像素比
    const h = canvas.height = 50 * dpr;

    // 获取 Canvas 的 2D 绘图上下文
    const c = canvas.getContext('2d');
    // 将画布原点移动到中心位置
    c.translate(w / 2, h / 2);
    // 设置填充颜色为白色
    c.fillStyle = "#ffffff";
    // 设置字体样式，包括字体大小、粗细和字体名称
    c.font = "normal 60px 微软雅黑";
    // 设置文本的垂直对齐方式为居中
    c.textBaseline = "middle";
    // 设置文本的水平对齐方式为居中
    c.textAlign = "center";
    // 在画布中心位置填充指定文本
    c.fillText(text, 0, 0);
    // 返回包含文本的 Canvas 元素
    return canvas;
}

/**
 * 创建一个包含指定文本的 Three.js 精灵标签
 * @param {string} text - 要显示在标签上的文本
 * @returns {THREE.Sprite} - 包含指定文本的精灵标签
 */
export default function createLabel(text) {
    // 创建一个包含指定文本的 Canvas 元素，并将其转换为 Three.js 纹理
    const texture = new THREE.CanvasTexture(createCanvas(text, text.length * 30));

    // 创建一个精灵材质，将之前创建的纹理应用到材质上
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture
    });

    // 创建一个精灵对象，使用之前创建的精灵材质
    const label = new THREE.Sprite(spriteMaterial);
    // 根据文本长度设置精灵标签的尺寸
    label.scale.set(text.length * 30, 50);
    // 返回创建好的精灵标签
    return label;
}
