import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const geometry= new THREE.BoxGeometry(300, 300, 300);
const material = new  THREE.MeshLambertMaterial({
    color: 'orange'
});

const positions = geometry.attributes.position.clone();
for(let i = 0; i< positions.count; i++) {
    positions.setY(i, positions.getY(i) * 2);
}

const positions2 = geometry.attributes.position.clone();
for(let i = 0; i< positions2.count; i++) {
    positions2.setX(i, positions2.getX(i) * 2);
}

geometry.morphAttributes.position = [positions, positions2];

const mesh = new THREE.Mesh(geometry, material);

const gui = new GUI();

gui.add(mesh.morphTargetInfluences, '0', 0, 1);
gui.add(mesh.morphTargetInfluences, '1', 0, 1);
// mesh.morphTargetInfluences[0] = 0;
// mesh.morphTargetInfluences[1] = 1;

mesh.name = "Kkk";
const track1 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[0]', [0, 3], [0, 0.5]);
const track2 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[1]', [3, 6], [0, 1]);
const clip = new THREE.AnimationClip("aaaa", 6, [track1, track2]);

const mixer = new THREE.AnimationMixer(mesh);
const clipAction = mixer.clipAction(clip);
clipAction.play();

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    mixer.update(delta);

    requestAnimationFrame(render);
}

render();

export default mesh;

