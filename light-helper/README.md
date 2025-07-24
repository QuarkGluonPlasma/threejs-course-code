```
Three.js 灯光与场景构建技术总结

├── 项目初始化与环境搭建
│   ├── 创建项目目录
│   │   ├── mkdir light - helper
│   │   ├── cd light - helper
│   │   └── npm init -y
│   ├── 安装依赖
│   │   ├── npm install --save-dev @types/three
│   │   └── 拓展：可安装其他工具库如 stats.js 进行性能监控
│   ├── 项目文件结构
│   │   ├── index.html
│   │   ├── index.js
│   │   ├── mesh.js 及系列 mesh 文件
│   │   └── 拓展：可使用模块化开发，将不同功能拆分到更多文件
│
├── 核心场景构建
│   ├── 场景（Scene）
│   │   ├── 创建场景对象 new THREE.Scene()
│   │   └── 拓展：可添加雾效 new THREE.Fog()
│   ├── 相机（Camera）
│   │   ├── 透视相机 PerspectiveCamera
│   │   │   ├── 参数：视野、宽高比、近裁剪面、远裁剪面
│   │   │   └── 拓展：可使用正交相机 OrthographicCamera
│   │   └── 设置相机位置和朝向
│   ├── 渲染器（Renderer）
│   │   ├── WebGL 渲染器 WebGLRenderer
│   │   ├── 设置渲染尺寸 renderer.setSize()
│   │   └── 拓展：可启用抗锯齿 antialias: true
│   ├── 循环渲染
│   │   ├── 使用 requestAnimationFrame 实现动画循环
│   │   └── 拓展：可添加性能优化，如节流渲染
│
├── 几何体与材质
│   ├── 几何体（Geometry）
│   │   ├── 基础几何体（PlaneGeometry、BoxGeometry）
│   │   ├── 拉伸几何体 ExtrudeGeometry
│   │   │   ├── 形状 Shape 与路径 Path
│   │   │   └── 拓展：可使用 CatmullRomCurve3 创建复杂路径
│   │   └── 拓展：可使用 BufferGeometry 提升性能
│   ├── 材质（Material）
│   │   ├── 漫反射材质 MeshLambertMaterial
│   │   ├── 纹理贴图
│   │   │   ├── 加载纹理 TextureLoader
│   │   │   ├── 设置重复和包裹模式
│   │   │   └── 拓展：可使用法线贴图、高光贴图
│   │   └── 拓展：可使用 MeshPhongMaterial 实现高光效果
│
├── 灯光系统
│   ├── 平行光 DirectionalLight
│   │   ├── 特性
│   │   │   ├── 类似太阳光，光线均匀且平行，可照亮整个场景的一个方向
│   │   │   ├── 光的强度在场景中保持一致，不受距离影响
│   │   ├── 创建
│   │   │   └── `new THREE.DirectionalLight(color, intensity)`
│   │   ├── 参数
│   │   │   ├── `color`：灯光颜色，支持十六进制值或颜色名称，默认 `0xffffff`（白色）
│   │   │   ├── `intensity`：灯光强度，默认 `1`
│   │   ├── 可视化
│   │   │   └── 使用 `DirectionalLightHelper` 显示平行光的方向和位置
│   │   ├── 阴影设置
│   │   │   ├── 开启阴影：`light.castShadow = true`
│   │   │   ├── 配置阴影相机：`light.shadow.camera`，可设置投影范围、近裁剪面和远裁剪面
│   │   │   ├── 阴影贴图尺寸：`light.shadow.mapSize`，尺寸越大阴影越清晰，但性能开销越高
│   │   │   ├── 阴影模糊：`light.shadow.radius`，控制阴影边缘的模糊程度
│   │   │   └── 拓展：可使用 `PCFSoftShadowMap` 实现更柔和的阴影效果，需在渲染器中设置 `renderer.shadowMap.type = THREE.PCFSoftShadowMap`
│   │   ├── 应用场景
│   │   │   ├── 室外场景模拟太阳光
│   │   │   ├── 需要全局定向照明的场景，如大型广场、停车场等
│   │   ├── 注意点
│   │   │   ├── 平行光的方向由其位置和场景原点决定，通常需要设置合适的位置
│   │   │   ├── 阴影设置会增加性能开销，需根据实际情况调整阴影贴图尺寸和模糊程度
│
│   ├── 点光源 PointLight
│   │   ├── 特性
│   │   │   ├── 类似灯泡，向所有方向均匀发射光线
│   │   │   ├── 光的强度随距离衰减
│   │   ├── 创建
│   │   │   └── `new THREE.PointLight(color, intensity, distance, decay)`
│   │   ├── 参数
│   │   │   ├── `color`：灯光颜色，默认 `0xffffff`
│   │   │   ├── `intensity`：灯光强度，默认 `1`
│   │   │   ├── `distance`：光线完全衰减到 0 的距离，默认 `0` 表示无限制
│   │   │   ├── `decay`：光线衰减的速度，默认 `1`，WebGL 中建议使用 `2` 以符合物理规律
│   │   ├── 可视化
│   │   │   └── 使用 `PointLightHelper` 显示点光源的位置和影响范围
│   │   ├── 阴影设置
│   │   │   ├── 开启阴影：`light.castShadow = true`
│   │   │   ├── 配置阴影相机：`light.shadow.camera` 为 `THREE.PerspectiveCamera`
│   │   │   └── 同样可设置阴影贴图尺寸和模糊等属性
│   │   ├── 应用场景
│   │   │   ├── 模拟室内灯泡、火把等局部光源
│   │   │   ├── 营造局部照明效果，如商店橱窗、舞台局部打光
│   │   ├── 注意点
│   │   │   ├── 点光源的阴影计算相对复杂，对性能影响较大
│   │   │   ├── 合理设置 `distance` 和 `decay` 参数，避免出现光照范围过大或过小的问题
│
│   ├── 环境光 AmbientLight
│   │   ├── 特性
│   │   │   ├── 均匀照亮场景中的所有物体，没有特定方向
│   │   │   ├── 不会产生阴影，仅提供基础亮度
│   │   ├── 创建
│   │   │   └── `new THREE.AmbientLight(color, intensity)`
│   │   ├── 参数
│   │   │   ├── `color`：灯光颜色，默认 `0xffffff`
│   │   │   ├── `intensity`：灯光强度，默认 `1`
│   │   ├── 组合使用
│   │   │   ├── 常与其他光源（如平行光、点光源）配合，补充场景整体亮度
│   │   │   └── 避免场景中出现完全黑暗的区域
│   │   ├── 应用场景
│   │   │   ├── 室内场景补充照明
│   │   │   ├── 需要均匀基础光照的场景，如游戏中的地下城、室内展厅
│   │   ├── 注意点
│   │   │   ├── 环境光会使场景缺乏立体感，应与其他光源搭配使用
│   │   │   ├── 过高的强度可能导致场景过亮，失去光影效果
│
│   ├── 聚光灯 SpotLight
│   │   ├── 特性
│   │   │   ├── 类似手电筒，从一个点向特定方向发射锥形光线
│   │   │   ├── 光的强度随距离衰减，且在锥形范围外无光
│   │   ├── 创建
│   │   │   └── `new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)`
│   │   ├── 参数
│   │   │   ├── `color`：灯光颜色，默认 `0xffffff`
│   │   │   ├── `intensity`：灯光强度，默认 `1`
│   │   │   ├── `distance`：光线完全衰减到 0 的距离，默认 `0` 表示无限制
│   │   │   ├── `angle`：锥形光的角度，取值范围 `0` 到 `Math.PI / 2`，默认 `Math.PI / 3`
│   │   │   ├── `penumbra`：锥形光边缘的模糊程度，取值范围 `0` 到 `1`，默认 `0`
│   │   │   ├── `decay`：光线衰减的速度，默认 `1`，WebGL 中建议使用 `2`
│   │   ├── 可视化
│   │   │   └── 使用 `SpotLightHelper` 显示聚光灯的锥形范围和方向
│   │   ├── 投影效果
│   │   │   ├── 开启投影：`light.castShadow = true`
│   │   │   ├── 配置投影相机：`light.shadow.camera` 为 `THREE.PerspectiveCamera`
│   │   │   ├── 可设置投影纹理：`light.shadow.map`，实现特殊投影效果
│   │   │   └── 同样可设置阴影贴图尺寸、模糊等属性
│   │   ├── 应用场景
│   │   │   ├── 舞台照明效果
│   │   │   ├── 手电筒、探照灯等效果模拟
│   │   │   ├── 需要聚焦照明的场景，如博物馆展品展示
│   │   ├── 注意点
│   │   │   ├── 聚光灯的阴影计算开销较大，需谨慎使用
│   │   │   ├── 合理调整 `angle` 和 `penumbra` 参数，以达到理想的光照效果
│
│   ├── 半球光 HemisphereLight
│   │   ├── 特性
│   │   │   ├── 模拟室外环境中天空和地面反射的光线
│   │   │   ├── 从天空方向和地面方向同时照射物体
│   │   ├── 创建
│   │   │   └── `new THREE.HemisphereLight(skyColor, groundColor, intensity)`
│   │   ├── 参数
│   │   │   ├── `skyColor`：天空颜色，默认 `0xffffff`
│   │   │   ├── `groundColor`：地面颜色，默认 `0x000000`
│   │   │   ├── `intensity`：灯光强度，默认 `1`
│   │   ├── 应用场景
│   │   │   ├── 室外场景模拟自然光照
│   │   │   ├── 简化的全局光照设置，可快速营造室外氛围
│   │   ├── 注意点
│   │   │   ├── 半球光不会产生阴影，仅用于模拟环境光
│   │   │   ├── 可与其他光源配合使用，增强场景真实感
│
│   ├── 矩形区域光 RectAreaLight
│   │   ├── 特性
│   │   │   ├── 发射矩形平面的光线，类似窗户透进来的光或条形灯
│   │   │   ├── 仅支持 `MeshStandardMaterial` 和 `MeshPhysicalMaterial`
│   │   ├── 创建
│   │   │   └── `new THREE.RectAreaLight(color, intensity, width, height)`
│   │   ├── 参数
│   │   │   ├── `color`：灯光颜色，默认 `0xffffff`
│   │   │   ├── `intensity`：灯光强度，默认 `1`
│   │   │   ├── `width`：矩形区域的宽度
│   │   │   ├── `height`：矩形区域的高度
│   │   ├── 应用场景
│   │   │   ├── 室内场景模拟窗户光、条形灯
│   │   │   ├── 需要矩形区域照明的场景，如会议室、办公室
│   │   ├── 注意点
│   │   │   ├── 矩形区域光的计算较为复杂，对性能有一定影响
│   │   │   ├── 确保材质使用 `MeshStandardMaterial` 或 `MeshPhysicalMaterial`，否则光照效果可能异常
│
├── 辅助工具
│   ├── 控制器
│   │   ├── 轨道控制器 OrbitControls
│   │   │   ├── 鼠标交互控制相机
│   │   │   └── 拓展：可添加阻尼效果
│   │   └── 拓展：可使用 TransformControls 操作对象
│   ├── 可视化辅助器
│   │   ├── 坐标轴辅助器 AxesHelper
│   │   ├── 极坐标网格辅助器 PolarGridHelper
│   │   ├── 平面网格辅助器 GridHelper
│   │   ├── 箭头辅助器 ArrowHelper
│   │   └── 各灯光辅助器
│   ├── 调试工具
│   │   ├── dat.gui 调试参数
│   │   └── 拓展：可使用 Three.js 自带的调试面板
│
└── 性能优化
    ├── 纹理压缩
    │   └── 拓展：使用压缩纹理格式如 DDS、ASTC
    ├── 几何体合并
    │   └── 拓展：使用 BufferGeometryUtils.mergeBufferGeometries
    └── 视锥体裁剪
        └── 拓展：设置对象 frustumCulled 属性
```