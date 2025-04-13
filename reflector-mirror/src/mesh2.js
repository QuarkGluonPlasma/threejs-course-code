import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/Addons.js';

const group = new THREE.Group();

function createMirror(name, z, rotationY) {
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const mesh = new Reflector(geometry, {
        // color: 'blue',
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
    });
    mesh.name = name;
    mesh.position.z = z;
    mesh.rotateY(rotationY);
    return mesh;
}

function createBall() {
    const geometry = new THREE.SphereGeometry(100);
    const material = new THREE.MeshStandardMaterial({
        color: 'lightgreen'
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
group.add(createMirror('mirror1', -500, 0));
group.add(createMirror('mirror2', 500, Math.PI));
group.add(createBall());

export default group;
