import './style.css';
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import player from './player';
import analyser from './analyser';
import _ from 'lodash-es';
import lyricList, { lyricPositions } from './lyric';
import { Easing, Group, Tween } from '@tweenjs/tween.js';

const listener = new THREE.AudioListener();
const audio = new THREE.Audio( listener );

const loader = new THREE.AudioLoader();
loader.load('./superman.mp3', function ( buffer ) {
  audio.setBuffer( buffer );
  audio.autoplay = false;
});

const scene = new THREE.Scene();

scene.add(lyricList);
lyricList.position.y = 650;
scene.add(player);
player.position.x = 800;
player.position.z = 600;
scene.add(analyser);

const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(500, 400, 300);
scene.add(directionLight);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const width = window.innerWidth;
const height = window.innerHeight;

const helper = new THREE.AxesHelper(500);
// scene.add(helper);

const camera = new THREE.PerspectiveCamera(60, width / height, 300, 10000);
camera.position.set(0, 800, 1500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height)

const audioAnalyser = new THREE.AudioAnalyser(audio);
function updateHeight() {
  const frequencyData = audioAnalyser.getFrequencyData();

  const sumArr = _.map(_.chunk(frequencyData, 50), (arr) => {
    return _.sum(arr);
  });

  for(let i = 0; i< analyser.children.length;i++) {
    const mesh = analyser.children[i];
    const height = sumArr[i] / 4000;
    mesh.scale.z = height;
  }
}

let costTime = 0;
let startTime = 0;
const tweenGroup = new Group();
let i = 0;
function render() {
    if(lyricPositions.length && audio.isPlaying) {
      let currentTime = costTime + Date.now() - startTime;
  
      const mSeconds = currentTime;
      if(i >= lyricPositions.length - 1) {
        lyricList.position.z = lyricPositions[lyricPositions.length - 1][1];
      } else if(mSeconds > lyricPositions[i][0] && mSeconds < lyricPositions[i + 1][0]) {
        const tween= new Tween(lyricList.position).to({
            z: lyricPositions[i][1] + 300
        }, 300)
        .easing(Easing.Quadratic.InOut)
        .repeat(0)
        .start()
        .onComplete(() => {
            tweenGroup.remove(tween);
        })
        tweenGroup.add(tween);
        i++;
      }
    }

    tweenGroup.update();
    updateHeight();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();

document.body.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.addEventListener('change', () => {
//   console.log(camera.position);
// });

const playerBtn = player.getObjectByName('playBtn');
const pauseBtn = player.getObjectByName('pauseBtn');

renderer.domElement.addEventListener('click', (e) => {
  const y = -((e.offsetY / height) * 2 - 1);
  const x = (e.offsetX / width) * 2 - 1;

  const rayCaster = new THREE.Raycaster();
  rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

  const intersections = rayCaster.intersectObjects(player.children);
  
  if(intersections.length) {
    const obj = intersections[0].object.target;
    if(obj) {
      if(obj.name === 'playBtn') {
        obj.scale.y = 0.6;
        obj.position.y = -80 * 0.4/2;

        startTime = Date.now();
        pauseBtn.scale.y = 1;
        pauseBtn.position.y = 0;
        audio.play();
      } else if(obj.name === 'pauseBtn') {
        obj.scale.y = 0.6;
        obj.position.y = -80 * 0.4/2;

        costTime += Date.now() - startTime;
        playerBtn.scale.y = 1;
        playerBtn.position.y = 0;
        audio.pause();
      }
    }
  }
});
