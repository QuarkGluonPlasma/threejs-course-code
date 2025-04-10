import * as THREE from 'three';

const group = new THREE.Group();

function createBox(color, x) {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshPhongMaterial({
        color: color
    });
    const mesh =  new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    mesh.name = color;
    return mesh;
}

group.add(createBox('red', 0));
group.add(createBox('blue', 300));
group.add(createBox('green', -300));

export default group;
