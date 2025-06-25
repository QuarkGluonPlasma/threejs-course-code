import * as THREE from 'three';

const house = new THREE.Group();

for(let i = 0; i< 4; i ++) {
    const geometry = new THREE.BoxGeometry(500, 300, 20);
    const material = new THREE.MeshLambertMaterial({
        color: 'white'
    });
    const wall = new THREE.Mesh(geometry, material);
    wall.rotateY(Math.PI / 2 * i);
    house.add(wall);
}

house.children[0].position.z = 250;
house.children[1].position.x = 250;
house.children[2].position.z = -250;
house.children[3].position.x = -250;

export const normals = [
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 0),
]

export default house;
