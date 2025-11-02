
console.log(THREE.MathUtils.degToRad(180));
console.log(THREE.MathUtils.radToDeg(Math.PI));

// 线性插值
console.log(THREE.MathUtils.lerp(0, 100, 0.5));
console.log(THREE.MathUtils.lerp(0, 150, 0.5));

// 平滑插值（三次 Hermite 插值）
console.log(THREE.MathUtils.smoothstep(0.8, 0, 1));
console.log(THREE.MathUtils.smoothstep(0.3, 0, 1));
// 改进的平滑插值（五次 Hermite 插值）
console.log(THREE.MathUtils.smootherstep(0.8, 0, 1));
console.log(THREE.MathUtils.smootherstep(0.3, 0, 1));

// 映射值到指定范围 [min, max]
console.log(THREE.MathUtils.mapLinear(0.6, 0, 1, 0, 100));
console.log(THREE.MathUtils.mapLinear(0.6, 0, 1, 0, 150));

// 夹紧值到指定范围 [min, max]
console.log(THREE.MathUtils.clamp(150, 0, 100));
console.log(THREE.MathUtils.clamp(-50, 0, 100));
console.log(THREE.MathUtils.clamp(30, 0, 100));

// 生成随机浮点数 [min, max]
console.log(THREE.MathUtils.randFloat(0, 10));
// 生成随机整数 [min, max]
console.log(THREE.MathUtils.randInt(0, 10));
// 生成随机浮点数 [min, max]
console.log(THREE.MathUtils.randFloatSpread(10));


// 向下取整到最近的 2 的幂
console.log(THREE.MathUtils.floorPowerOfTwo(500)); 
// 向上取整到最近的 2 的幂
console.log(THREE.MathUtils.ceilPowerOfTwo(1000)); 

// 生成随机 UUID
console.log(THREE.MathUtils.generateUUID());
console.log(THREE.MathUtils.generateUUID());
console.log(THREE.MathUtils.generateUUID());