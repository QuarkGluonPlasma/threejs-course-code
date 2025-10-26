import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const simplex = new SimplexNoise();
const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);

const positions = geometry.attributes.position;

for (let i = 0 ; i < positions.count; i ++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    // 多重噪音层叠
    // 第一层：大尺度地形 (山脉轮廓)
    const noise1 = simplex.noise(x / 1200, y / 1200) * 150;
    
    // 第二层：中等尺度地形 (丘陵)
    const noise2 = simplex.noise(x / 600, y / 600) * 80;
    
    // 第三层：小尺度地形 (细节)
    const noise3 = simplex.noise(x / 300, y / 300) * 40;
    
    // 第四层：微细节 (岩石纹理)
    const noise4 = simplex.noise(x / 150, y / 150) * 20;
    
    // 第五层：非常细微的细节
    const noise5 = simplex.noise(x / 75, y / 75) * 10;
    
    // 组合所有噪音层
    const z = noise1 + noise2 + noise3 + noise4 + noise5;

    positions.setZ(i, z);
}

// 计算高度范围用于颜色映射
const heightArr = [];
for (let i = 0; i < positions.count; i++) {
    heightArr.push(positions.getZ(i));
}
heightArr.sort();

const minHeight = heightArr[0];
const maxHeight = heightArr[heightArr.length - 1];
const height = maxHeight - minHeight;

// 设置颜色渐变
const colorsArr = [];
const color1 = new THREE.Color('#efcc98');  // 低处 
const color2 = new THREE.Color('#70624F');  // 中低处 
const color3 = new THREE.Color('#C0A068');  // 中高处
const color4 = new THREE.Color('#eeb766');  // 高处 

for (let i = 0; i < positions.count; i++) {
    const percent = (positions.getZ(i) - minHeight) / height;
    let c;
    
    if (percent < 0.33) {
        const localPercent = percent / 0.33;
        c = color1.clone().lerp(color2, localPercent);
    } else if (percent < 0.66) {
        const localPercent = (percent - 0.33) / 0.33;
        c = color2.clone().lerp(color3, localPercent);
    } else {
        const localPercent = (percent - 0.66) / 0.34;
        c = color3.clone().lerp(color4, localPercent);
    }
    
    colorsArr.push(c.r, c.g, c.b); 
}

const colors = new Float32Array(colorsArr);
geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

const material = new THREE.MeshLambertMaterial({
    vertexColors: true
});

const mountainside = new THREE.Mesh(geometry, material);
mountainside.rotateX(- Math.PI / 2);
mountainside.receiveShadow = true;


const loader = new GLTFLoader();
const flowersGroup = new THREE.Group();
const treesGroup = new THREE.Group();

loader.load('/flower.glb', (gltf) => {
    const flowerModel = gltf.scene;

    const sampler = new MeshSurfaceSampler(mountainside).build();
    
    const flowerPositions = [];
    const position = new THREE.Vector3();
    
    for (let i = 0; i < 500; i++) {
        sampler.sample(position);
        flowerPositions.push(position.x, position.y, position.z);
    }
    
    // 在每个采样点放置鲜花模型
    for (let i = 0; i < flowerPositions.length; i += 3) {
        const flower = flowerModel.clone();
        const flowerPosition = new THREE.Vector3(
            flowerPositions[i], 
            flowerPositions[i + 1], 
            flowerPositions[i + 2]
        );
        
        flower.position.copy(flowerPosition);
        
        flower.scale.setScalar(3);

        flower.rotateX(Math.PI / 2);
        // 启用视锥剔除优化
        flower.frustumCulled = true;

        flower.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        
        flowersGroup.add(flower);
    }
    
    mountainside.add(flowersGroup);
});

// 加载树木模型
loader.load('/tree.glb', (gltf) => {
    const treeModel = gltf.scene;

    const sampler = new MeshSurfaceSampler(mountainside).build();
    
    const treePositions = [];
    const position = new THREE.Vector3();
    
    // 生成树木位置，数量比鲜花少一些
    for (let i = 0; i < 200; i++) {
        sampler.sample(position);
        treePositions.push(position.x, position.y, position.z);
    }
    
    // 在每个采样点放置树木模型
    for (let i = 0; i < treePositions.length; i += 3) {
        const tree = treeModel.clone();
        const treePosition = new THREE.Vector3(
            treePositions[i], 
            treePositions[i + 1], 
            treePositions[i + 2]
        );
        
        tree.position.copy(treePosition);
        
        tree.scale.setScalar(0.2);

        tree.rotateX(Math.PI / 2);
        
        // 添加随机的Y轴旋转（绕垂直轴旋转）
        const randomRotationY = Math.random() * Math.PI * 2; // 0 到 2π 的随机旋转
        tree.rotateY(randomRotationY);
        
        // 启用视锥剔除优化
        tree.frustumCulled = true;

        tree.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        
        treesGroup.add(tree);
    }
    
    mountainside.add(treesGroup);
});

export default mountainside;
