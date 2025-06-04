import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { isGameOver } from './main';

const group = new THREE.Group();

const loader = new THREE.TextureLoader();

async function createRoad() {
    const texture = loader.load('./road.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.y = 15;

    const geometry = new THREE.PlaneGeometry(1000, 10000);
    const material = new THREE.MeshLambertMaterial({
        map: texture,
        aoMap: texture
    });
    const road = new THREE.Mesh(geometry, material);
    group.add(road);

    road.rotateX(-Math.PI / 2);    
}
const gltfLoader = new GLTFLoader();

export const cars = [[],[],[],[]];

let blueCarGltf;
let orangeCarGltf;
async function createCar() {
    const isBlueCar = Math.random() < 0.5;
    if(isBlueCar) {
        if(!blueCarGltf) {
            blueCarGltf = await gltfLoader.loadAsync('./blue-car.glb');
        }
        blueCarGltf.scene.scale.setScalar(150);
        return blueCarGltf.scene.clone();
    } else {
        if(!orangeCarGltf) {
            orangeCarGltf = await gltfLoader.loadAsync('./orange-car.glb');
        }
        orangeCarGltf.scene.scale.setScalar(130);
        return orangeCarGltf.scene.clone();
    }
}
let paused = false;
document.addEventListener('visibilitychange', (e) => {
    paused = document.visibilityState !== 'visible'
});

const timer = setInterval(async () => {
    if(paused) {
        return;
    }
    if(isGameOver()) {
        return clearInterval(timer);
    }
    const car = await createCar();
    // car.visible = false;
    group.add(car);

    // const helper = new THREE.BoxHelper(car);
    // group.add(helper);
    // car.helper = helper;

    const index = Math.floor(Math.random() * 4);
    cars[index].push(car);

    car.position.x = -400 + index * 250;
    car.position.z  = -1300;

    // car.speed = 10 + Math.random() * 5;
    car.speed = [1, 2].includes(index) ? 20 : 10

    // console.log(cars);
}, 1000);

async function createMan() {
    const manGltf = await gltfLoader.loadAsync('./Soldier.glb');
    group.add(manGltf.scene);
    console.log(manGltf);
    manGltf.scene.scale.setScalar(90);
    manGltf.scene.position.z = 200;
    // manGltf.scene.rotateY(Math.PI);
    manGltf.scene.name = 'man';

    const box3 = new THREE.Box3();
    box3.setFromObject(manGltf.scene);
    box3.expandByVector(new THREE.Vector3(-50, 0, 0));

    // const helper = new THREE.Box3Helper(box3);
    // group.add(helper);
    // manGltf.scene.helper = helper;

    // const helper = new THREE.BoxHelper(manGltf.scene);
    // group.add(helper);
    // manGltf.scene.helper = helper;

    const mixer = new THREE.AnimationMixer(manGltf.scene);
    const clipAction = mixer.clipAction(manGltf.animations[3]);
    clipAction.play();

    const clock = new THREE.Clock();
    function render() {
        requestAnimationFrame(render);

        const delta = clock.getDelta();
        mixer.update(delta);
        if(isGameOver()) {
            clipAction.paused = true;
        }
    }
    render();
}
createRoad();
createMan();


export default group;