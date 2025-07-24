学完骨骼动画、css2d 标注后，我们来做一个双人斗舞的实战。
 
舞台上有两个人，面对面站着。
 
点击某个人的时候，会把相机切到那个人的角度，用 tweenjs 做相机动画。
 
在右边展示这个人的介绍信息，用 css2d 标签。
 
然后点击开始按钮，就开始跳舞，播放骨骼动画。
 
我们还可以用聚光灯、阴影增加舞台的感觉。
 
大概就是这样的场景，我们来实现一下：
 
```lua
npx create-vite two-dancer
```
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a828079dd454909b2eeb80ce3a4372b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=774&h=528&s=73101&e=png&b=000000)
 
进入项目，安装依赖：
 
```css
npm install
npm install --save three
npm install --save-dev @types/three
```
 
改下 src/main.js
 
```javascript
import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import stage from './stage.js';
 
const scene = new THREE.Scene();
 
scene.add(stage);
 
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);
 
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);
 
const width = window.innerWidth;
const height = window.innerHeight;
 
const helper = new THREE.AxesHelper(500);
scene.add(helper);
 
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
camera.position.set(500, 600, 800);
camera.lookAt(0, 0, 0);
 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)
 
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
 
render();
 
document.body.append(renderer.domElement);
 
const controls = new OrbitControls(camera, renderer.domElement);
 
window.onresize = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
 
  renderer.setSize(width,height);
 
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
 
 
```
 
创建 Scene、Light、Camera、Renderer。
 
处理下 window.resize，resize 的时候重新设置宽高比。
 
改下 style.css
 
```css
body {
  margin: 0;
}
```
 
然后创建 stage.js
 
```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
 
const loader = new GLTFLoader();
 
const stage = new THREE.Group();
 
loader.load("./stage.glb", function (gltf) {
    console.log(gltf);
    stage.add(gltf.scene);
});
 
export default stage;
```
 
我们这次直接加载一个房间的模型做舞台。
 
你可以从[这里](https://github.com/QuarkGluonPlasma/threejs-course-code/blob/main/two-dancer/public/stage.glb "https://github.com/QuarkGluonPlasma/threejs-course-code/blob/main/two-dancer/public/stage.glb")下载：
 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87b3107cdbdd45c3b3c6b91c57689a74~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2162&h=806&s=167342&e=png&b=ffffff)
 
放在 public 目录下：
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e2b84b331054aa5addafb983bbaa053~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=530&h=358&s=28562&e=png&b=191919)
 
跑一下：
 
```arduino
npm run dev
```
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a0e29b0522342a58834271a7b674492~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1056&h=384&s=51989&e=png&b=181818)
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7bfa0fee2ea438cb392202627f4442c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2430&h=1212&s=111832&e=png&b=000000)
 
有点小，放大一下：
 
```javascript
gltf.scene.scale.set(50,50,50);
```
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5289e6c8e50b4683835b3a6fb21e8482~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1142&h=744&s=119891&e=png&b=1f1f1f)
 
![2025-04-07 16.53.45.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae2728decca14607895617dda65bebd0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=13178276&e=gif&f=25&b=373d40)
 
然后把舞者的模型加载进来：
 
[github.com/mrdoob/thre…](https://github.com/mrdoob/three.js/blob/e9144842962d46f0ab4a7049cc072ad201d9659d/examples/models/gltf/Michelle.glb "https://github.com/mrdoob/three.js/blob/e9144842962d46f0ab4a7049cc072ad201d9659d/examples/models/gltf/Michelle.glb")
 
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e28de8ccd66e4e0fb400bea1a72546db~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2076&h=620&s=151067&e=png&b=ffffff)
 
下载下来放到 public 目录下：
 
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c2ab6bc67634a74b699c1423e45ebb4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=480&h=430&s=33452&e=png&b=181818)
 
在代码里加载：
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af3f5dd40eab4aaf8a48a14ff26c471a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1244&h=736&s=147072&e=png&b=1f1f1f)
 
```javascript
loader.load("./Michelle.glb", function (gltf) {
    stage.add(gltf.scene);
    gltf.scene.scale.set(300, 300, 300);
    gltf.scene.position.z = 500;
    gltf.scene.rotateY(Math.PI);
});
```
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc0102c4e47d429e809e5eb704d71aa6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2256&h=1366&s=3906496&e=png&b=313538)
 
播放下跳舞的骨骼动画：
 
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff177c3f38e040d0b3f25feddc71fed2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1258&h=1106&s=201327&e=png&b=1f1f1f)
 
```javascript
const mixer = new THREE.AnimationMixer(gltf.scene);
const clipAction = mixer.clipAction(gltf.animations[0]);
clipAction.play();
 
const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    mixer.update(delta);
 
    requestAnimationFrame(render);
}
 
render();
```
 
![2025-04-07 20.24.44.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c454f704dac447baa1310aae9923fd1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=3744304&e=gif&f=43&b=3d4345)
 
然后我们再加载一个放对面，因为骨骼动画适合模型绑定的，不能直接 clone，我们重新加载一次：
 
封装个方法：
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68fc539b9afe40bd9b53dc1db38ea51a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1254&h=824&s=186680&e=png&b=1f1f1f)
 
加载两次模型，传入 z、旋转角度：
 
```javascript
loadDancer((dancer)=> {}, 200, Math.PI);
loadDancer((dancer) => {}, -200, 0);
 
function loadDancer(callback, z, angle) {
    loader.load("./Michelle.glb", function (gltf) {
        callback(gltf.scene);
 
        stage.add(gltf.scene);
        gltf.scene.scale.set(300, 300, 300);
        gltf.scene.position.z = z;
        gltf.scene.rotateY(angle);
     
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const clipAction = mixer.clipAction(gltf.animations[0]);
        clipAction.play();
 
        const clock = new THREE.Clock();
        function render() {
            const delta = clock.getDelta();
            mixer.update(delta);
     
            requestAnimationFrame(render);
        }
     
        render();
    });
}
```
 
![2025-04-07 20.45.01.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c86e093489d4543bf5bff83d99690f2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=5857252&e=gif&f=63&b=3e4346)
 
给第二个 dancer 改个颜色：
 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7406712c5bc64de48985afabf9a1efb7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1304&h=740&s=158928&e=png&b=1f1f1f)
 
```javascript
dancer.traverse(obj => {
    if(obj.isMesh) {
        obj.material = obj.material.clone();
        obj.material.color.set('orange');
    }
})
```
 
这里遍历找到 mesh，先复制一份材质，不然共用材质会相互影响，然后改下颜色。
 
![2025-04-07 20.48.31.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/658c8f769acb46489a8cbf899353f743~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=3942899&e=gif&f=52&b=3e4346)
 
然后我们加个后期效果：
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f23eede40764137a7bcfde5c41e6c96~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1788&h=512&s=160060&e=png&b=1f1f1f)
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8c70bb9ada34f96a7389088a94bdec5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1276&h=946&s=185011&e=png&b=1f1f1f)
 
```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
```
 
```javascript
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
 
const glitchPass = new GlitchPass();
composer.addPass(glitchPass);
 
function render() {
    composer.render();
    requestAnimationFrame(render);
}
```
 
这里用 RenderPass 和 GlitchPass 两个 Pass。GlitchPass 是闪屏的效果。
 
看一下：
 
![2025-04-07 20.58.18.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/365b388e55d7445996e93b9c934b3834~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=8620181&e=gif&f=20&b=151719)
 
可以看到，每隔一段时间有个闪屏效果。
 
但它会导致颜色变暗，[后期通道那节](https://juejin.cn/book/7481132169944498226/section/7482770361442435122#heading-8 "https://juejin.cn/book/7481132169944498226/section/7482770361442435122#heading-8")讲过可以加伽马校正来修复颜色：
 
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5695dd376e6546fab705da8adc028051~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1948&h=1276&s=539404&e=png&b=fdfdfd)
 
这里我们就不修复了，暗点效果更好。
 
我们可以把灯光调亮一下：
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fce52bab780241d1995fd51f31987bc8~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1574&h=502&s=117049&e=png&b=1f1f1f)
 
![2025-04-07 21.00.12.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34488a64be4e4c618bd4e2d67155e1de~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=10606420&e=gif&f=21&b=333d40)
 
好多了。
 
去掉 AxesHelper，把平行光稍微调暗点，我们再加一个聚光灯：
 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50873734ce0348f3b3a4f7e980ad5f56~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1518&h=604&s=148163&e=png&b=1f1f1f)
 
```javascript
const spotLight = new THREE.SpotLight('white', 5000000);
spotLight.angle = Math.PI / 6;
spotLight.position.set(0, 800, 0);
spotLight.lookAt(0, 0, 0);
scene.add(spotLight);
```
 
![2025-04-07 21.23.18.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c25d5a6904a4d94985d661684fec7dc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=13292323&e=gif&f=32&b=252b2e)
 
然后加一下聚光灯的阴影：
 
首先开启舞者的投射阴影属性：
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b98c423b0f51425f819447fd43f942bf~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1284&h=458&s=94941&e=png&b=1f1f1f)
 
```javascript
gltf.scene.traverse(obj => {
    obj.castShadow = true;
});
```
 
然后开启舞台的接收阴影属性：
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/190dc87154f44f44a8cdc0ced3f476a2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1130&h=564&s=103919&e=png&b=1f1f1f)
 
```javascript
gltf.scene.traverse(obj => {
    obj.receiveShadow = true;
});
```
 
因为它们都有很多子对象，所以要遍历设置。
 
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/113fbb012163400ab9c63dc4c78b4441~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1660&h=738&s=185809&e=png&b=1f1f1f)
 
```javascript
spotLight.castShadow = true;
 
const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(cameraHelper);
```
 
开启聚光灯的投射阴影属性，然后用 CameraHelper 可视化一下阴影相机。
 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a82eeffbf054fdf97e34b76f49eddcd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1046&h=548&s=74417&e=png&b=1f1f1f)
 
最后开启下 renderer 的阴影设置。
 
```javascript
renderer.shadowMap.enabled = true;
```
 
看下效果：
 
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e2972dde5924c48815ba0a29f9c9dde~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1928&h=1296&s=3391692&e=png&b=1d2225)
 
可以看到，没有投射阴影，因为阴影相机的 far 不够大。
 
改一下：
 
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0a1972e89164d738e3fa0ccfa928f50~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1034&h=436&s=95560&e=png&b=1f1f1f)
 
```javascript
spotLight.shadow.camera.far = 10000;

```
 
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4b62029504b4a749b1022ea089642fc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1548&h=1274&s=2601126&e=png&b=1e2326)
 
这样就好了：
 
![2025-04-07 22.15.08.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9452e94f69d4940b1c51fc8a0518498~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=2348&h=1354&s=11899106&e=gif&f=29&b=23282b)
 
案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/threejs-course-code/tree/main/two-dancer "https://github.com/QuarkGluonPlasma/threejs-course-code/tree/main/two-dancer")。
 
总结
--
 
这节我们实现了双人斗舞的一个场景。
 
主要用到了 gltf 模型的加载，骨骼动画的播放，聚光灯、阴影，后期处理这些基础知识。
 
下节我们继续给这个场景加一些交互。