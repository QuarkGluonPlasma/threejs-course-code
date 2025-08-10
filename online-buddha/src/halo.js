import * as THREE from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';
import { loadPromise } from './mesh';
import gsap from 'gsap';
import SpriteText from 'three-spritetext';

const group = new THREE.Group();

const arc1 = new THREE.EllipseCurve(0, 0, 130 , 130, 0, Math.PI * 2);
const pointsArr1 = arc1.getPoints(50);
const geometry1 = new LineGeometry();
geometry1.setFromPoints(pointsArr1);
const material1 = new LineMaterial({
    color: new THREE.Color('gold'),
    linewidth: 10
});
const line1 = new Line2(geometry1, material1);
group.add(line1);

const geometry2 = new LineGeometry();
const pointsArr2 =  [];
for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI  / 6) {
    pointsArr2.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(150 * Math.cos(angle), 150 * Math.sin(angle), 0),
    )
}
geometry2.setFromPoints(pointsArr2);
const material2 = new LineMaterial({
    color: new THREE.Color('white'),
    linewidth: 2
});
const line2 = new Line2(geometry2, material2);
group.add(line2);

for(let i = 0; i<= 2; i++) {
    const arc = new THREE.EllipseCurve(0, 0, 110 + i * 20 , 110 + i * 20, 0, Math.PI * 2);
    const pointsArr = arc.getPoints(50);
    const geometry = new LineGeometry();
    geometry.setFromPoints(pointsArr);
    const material = new LineMaterial({
        color: new THREE.Color('gold'),
        linewidth: 3
    });
    const line = new Line2(geometry, material);
    group.add(line);
}

const circleGeometry = new THREE.CircleGeometry(110);
const circleMaterial = new THREE.MeshBasicMaterial({
    color: '#faeb6c',
    side: THREE.DoubleSide
});
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.z = 1;
group.add(circle);

const figureGroup = new THREE.Group();
// for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI  / 30) {
//     const figureText = new SpriteText('卍', 12);
//     figureText.color = 'gold';
//     figureText.strokeWidth = 1;
//     figureText.strokeColor = 'white';
//     figureText.position.set(160 * Math.cos(angle), 160 * Math.sin(angle), 0);
//     figureGroup.add(figureText);
// }
for(let angle = 0; angle <= Math.PI * 2; angle += Math.PI  / 15) {
    const figureText = new SpriteText('卍', 12);
    figureText.color = 'gold';
    figureText.strokeWidth = 1;
    figureText.strokeColor = 'white';
    figureText.position.set(140 * Math.cos(angle), 140 * Math.sin(angle), 0);
    figureGroup.add(figureText);
}
for(let angle = Math.PI / 10; angle <= Math.PI * 2; angle += Math.PI  / 6) {
    const figureText = new SpriteText('卍', 12);
    figureText.color = 'gold';
    figureText.strokeWidth = 1;
    figureText.strokeColor = 'white';
    figureText.position.set(120 * Math.cos(angle), 120 * Math.sin(angle), 0);
    figureGroup.add(figureText);
}
group.add(figureGroup);

loadPromise.then((gltf) => {
    const box3 = new THREE.Box3();
    box3.expandByObject(gltf.scene);

    const size = box3.getSize(new THREE.Vector3());

    group.position.y = size.y * 2 / 3;
    group.position.z = -size.z / 2;
})

gsap.to(group.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'none'
});

gsap.to(group.rotation, {
    z: Math.PI  * 2,
    duration: 10,
    repeat: -1,
    ease: 'none'
});

gsap.to(figureGroup.rotation, {
    z: -Math.PI  * 2,
    duration: 5,
    repeat: -1,
    ease: 'none'
})

let obj = { opacity: 0.2 };
gsap.to(obj, {
    opacity: 1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'none',
    onUpdate() {
        group.traverse(o => {
            if(o.isMesh || o.isSprite) {
                o.material.transparent = true;
                o.material.opacity = obj.opacity;
            }
        })
    }
})

export default group;
