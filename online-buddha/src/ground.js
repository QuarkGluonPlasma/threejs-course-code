import gsap from 'gsap';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { Line2, LineGeometry, LineMaterial, Reflector } from 'three/examples/jsm/Addons.js';

const group = new THREE.Group();

for(let i = 0; i < 5; i++) {
    const R = 80 + i * 50 ;
    const arc1 = new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI * 2);
    const pointsArr1 = arc1.getPoints(50);
    const geometry1 = new LineGeometry();
    geometry1.setFromPoints(pointsArr1);
    const material1 = new LineMaterial({
        color: new THREE.Color('gold'),
        linewidth: 5 - i 
    });
    const line1 = new Line2(geometry1, material1);
    group.add(line1);
}

for(let i = 0; i < 5; i++) {
    const figureGroup = new THREE.Group();

    const R = 50 + i * 50 ;
    for(let angle = Math.PI / 10; angle <= Math.PI * 2; angle += Math.PI  / 6) {
        const figureText = new SpriteText('卍', 12);
        figureText.color = 'gold';
        figureText.strokeWidth = 1;
        figureText.strokeColor = 'gold';
        figureText.position.set(R * Math.cos(angle), R * Math.sin(angle), 0);
        figureGroup.add(figureText);
    }
    group.add(figureGroup);
}

for(let i = 1; i <= 3; i++) {
    const figureGroup = new THREE.Group();
    for(let angle = 0; angle < Math.PI  * 2; angle += Math.PI  / (10 + i)) {
        const R = 250 + i * 70;
        const x = R * Math.cos(angle);
        const y = R * Math.sin(angle);

        const pointsArr = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(15, 0, 0),
            new THREE.Vector3(15, 15, 0),
            new THREE.Vector3(-15, 15, 0),
            new THREE.Vector3(-15, -15, 0),
            new THREE.Vector3(30, -15, 0),
            new THREE.Vector3(30, 30, 0),
            new THREE.Vector3(-30, 30, 0),
            new THREE.Vector3(-30, -30, 0),
            new THREE.Vector3(30, -30, 0)
        ];

        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(pointsArr);
        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color('gold')
        });
        const line = new THREE.Line(geometry, material);
        
        line.position.set(x, y, 0);    
        line.rotation.z = angle;
        
        figureGroup.add(line);
    }
    group.add(figureGroup);
}

let obj = {rotation: 0};
gsap.to(obj, {
    rotation: Math.PI * 2,
    repeat: -1,
    duration: 20,
    ease: 'none',
    onUpdate() {
        group.children.forEach((item, index) => {
            const flag = index % 2 === 0 ? 1 : -1;
            item.rotation.z = obj.rotation * flag;
        })
    }
});

group.rotateX(-Math.PI / 2);

const geometry = new THREE.CircleGeometry(280);

const mirror = new Reflector(geometry, {
    color: 'gold',
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
});
mirror.position.z = -1;
group.add(mirror);

export default group;
