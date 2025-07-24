Three.js 曲线相关实现总结
├── 项目初始化
│   ├── 创建项目目录
│   ├── 使用 npm init -y 初始化 package.json
│   └── 安装依赖（如 @types/three）
├── 导入 Three.js 库
│   ├── 导入核心库 import * as THREE from 'three';
│   └── 导入插件（如 OrbitControls）
├── 曲线创建
│   ├── 椭圆曲线（THREE.EllipseCurve）
│   │   ├── 参数：中心坐标、半轴长度、起始/结束角度
│   │   └── 获取点：getPoints()
│   ├── 样条曲线（THREE.SplineCurve）
│   │   ├── 参数：二维点数组
│   │   └── 获取点：getPoints()
│   ├── 二次贝塞尔曲线（THREE.QuadraticBezierCurve）
│   │   ├── 参数：起始点、控制点、结束点
│   │   └── 获取点：getPoints()
│   ├── 三次贝塞尔曲线（THREE.CubicBezierCurve3）
│   │   ├── 参数：起始点、两个控制点、结束点
│   │   └── 获取点：getPoints()
│   ├── 直线曲线（THREE.LineCurve）
│   │   ├── 参数：起始点、结束点
│   │   └── 获取点：getPoints()
│   └── 曲线路径（THREE.CurvePath）
│       ├── 组合多条曲线
│       └── 获取点：getPoints()
├── 几何体与材质创建
│   ├── 几何体（THREE.BufferGeometry）
│   │   └── 设置点：setFromPoints()
│   ├── 点材质（THREE.PointsMaterial）
│   │   ├── 属性：颜色、大小
│   │   └── 用途：渲染点
│   ├── 线条材质（THREE.LineBasicMaterial）
│   │   ├── 属性：颜色
│   │   └── 用途：渲染线条
│   └── 网格材质（THREE.MeshBasicMaterial）
│       ├── 属性：颜色
│       └── 用途：渲染三维形状
├── 对象创建与场景添加
│   ├── 点对象（THREE.Points）
│   │   ├── 参数：几何体、点材质
│   │   └── 添加到场景：scene.add()
│   ├── 线条对象（THREE.Line）
│   │   ├── 参数：几何体、线条材质
│   │   └── 添加到场景：scene.add()
│   └── 网格对象（THREE.Mesh）
│       ├── 参数：几何体、网格材质
│       └── 添加到场景：scene.add()
├── 相机与渲染器创建
│   ├── 相机（THREE.PerspectiveCamera）
│   │   ├── 参数：视角、宽高比、近裁剪面、远裁剪面
│   │   ├── 设置位置：position.set()
│   │   └── 设置观察点：lookAt()
│   └── 渲染器（THREE.WebGLRenderer）
│       ├── 设置大小：setSize()
│       └── 添加到页面：document.body.append()
├── 场景渲染
│   └── 动画循环
│       ├── 使用 requestAnimationFrame
│       └── 调用 renderer.render()
└── 交互控制
    └── OrbitControls
        ├── 参数：相机、渲染器 DOM 元素
        └── 功能：鼠标交互控制相机视角