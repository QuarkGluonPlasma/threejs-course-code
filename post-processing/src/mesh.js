import * as THREE from 'three';

function createMesh(color, x) {
    const geometry = new THREE.DodecahedronGeometry(100);
    const material = new THREE.MeshPhongMaterial({
        color: color
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    return mesh;    
}

const mesh = createMesh('orange', 0);
const mesh2 = createMesh('skyblue', 300);
const mesh3 = createMesh('lightgreen', -300);

const group = new THREE.Group();
group.add(mesh);
group.add(mesh2);
group.add(mesh3);

export default group;
