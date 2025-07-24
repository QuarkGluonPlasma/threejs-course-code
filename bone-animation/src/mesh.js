// 导入 Three.js 库的所有导出内容，使用 THREE 作为命名空间
import * as THREE from 'three';

// 创建三个骨骼对象，它们将构成骨骼层级结构
// bone1 作为根骨骼
const bone1 = new THREE.Bone();
// bone2 作为 bone1 的子骨骼
const bone2 = new THREE.Bone();
// bone3 作为 bone2 的子骨骼
const bone3 = new THREE.Bone();

// 将 bone2 添加为 bone1 的子骨骼，构建骨骼层级关系
bone1.add(bone2);
// 将 bone3 添加为 bone2 的子骨骼，进一步完善骨骼层级
bone2.add(bone3);

// 设置 bone1 在 X 轴上偏移 100 个单位
bone1.position.x = 100;

// 设置 bone2 在 Y 轴上偏移 100 个单位
bone2.position.y = 100;
// 设置 bone3 在 Y 轴上偏移 50 个单位
bone3.position.y = 50;

// 创建一个三维向量对象，用于存储 bone3 的世界坐标位置
const pos = new THREE.Vector3();
// 获取 bone3 在世界坐标系中的位置，并存储到 pos 向量中
bone3.getWorldPosition(pos);
// 在控制台打印 bone3 的世界坐标位置
console.log(pos);

// 创建一个 Three.js 组对象，用于将骨骼对象组织在一起
const group = new THREE.Group();
// 将根骨骼 bone1 添加到组对象中
group.add(bone1);

// 将 bone1 绕 Z 轴顺时针旋转 45 度（Math.PI/4 表示 45 度的弧度值）
bone1.rotateZ(Math.PI/4);
// 将 bone2 绕 Z 轴逆时针旋转 45 度
bone2.rotateZ(-Math.PI/4);

// 创建一个骨骼辅助器对象，用于可视化骨骼结构
// 传入包含骨骼的组对象，以便辅助器能正确显示骨骼层级
const skeletonHelper = new THREE.SkeletonHelper(group);

// 将骨骼辅助器添加到组对象中，使其与骨骼一起显示
group.add(skeletonHelper);

// 将包含骨骼和辅助器的组对象作为默认导出，供其他模块使用
export default group;
