import * as THREE from 'three';

const group = new THREE.Group();

function generateBox(colorStr, x, y, z) {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(colorStr)
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z)
    return box;
}

const box = generateBox('blue', 0, 0, 0);
const box2 = generateBox('green', 0, 0, 300);
const box3 =generateBox('red', 300, 0, 0);
group.add(box, box2, box3);

// setTimeout(() => {
//     const rayCaster = new THREE.Raycaster();
//     rayCaster.ray.origin.set(-100, 30, 0);
//     rayCaster.ray.direction.set(1, 0, 0);
    
//     const arrowHelper = new THREE.ArrowHelper(
//         rayCaster.ray.direction,
//         rayCaster.ray.origin,
//         600
//     );
//     group.add(arrowHelper);
    
//     const intersections = rayCaster.intersectObjects([box, box2, box3]);
//     console.log(intersections);
    
//     intersections.forEach(item => {
//         item.object.material.color = new THREE.Color('pink')
//     })
// }, 0);

export default group;


