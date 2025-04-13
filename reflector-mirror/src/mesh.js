import * as THREE from 'three';

const group = new THREE.Group();

function createMirror(name, z, rotationY, texture) {
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshStandardMaterial({
        color: 'white',
        side: THREE.DoubleSide,
        roughness: 0,
        metalness: 1,
        envMap: texture
    });
    const mesh = new THREE.Mesh(geometry, material);
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

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512);
export const cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

const cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(512);
export const cubeCamera2 = new THREE.CubeCamera( 1, 1000, cubeRenderTarget2 );

group.add(createMirror('mirror1', -500, 0, cubeRenderTarget.texture));
group.add(createMirror('mirror2', 500, Math.PI, cubeRenderTarget2.texture));
group.add(createBall());

export default group;
