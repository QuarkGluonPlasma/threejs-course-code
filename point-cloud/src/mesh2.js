import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/Addons.js';

const loader = new GLTFLoader();

const mesh = new THREE.Group();

const vertices = [];

loader.load("./Horse.gltf", function (gltf) {
    console.log(gltf);
    // mesh.add(gltf.scene);

    // gltf.scene.scale.setScalar(50);

    gltf.scene.traverse(obj => {
        if(obj.isMesh) {
            console.log(obj.name, obj);

            const sampler = new MeshSurfaceSampler(obj).build();

            const position = new THREE.Vector3();
            for (let i = 0; i < 1000; i++) {
                sampler.sample(position);
                position.multiplyScalar(50);
                vertices.push(position.x, position.y, position.z);
            }
        }
    })

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3),
    );
    let colors = [];
    const colorArr = [
        new THREE.Color('red'),
        new THREE.Color('blue'),
        new THREE.Color('green'),
        new THREE.Color('pink'),
        new THREE.Color('yellow')
    ];
    for (let i = 0; i < vertices.length; i++) {
        const color = colorArr[Math.floor(Math.random() * colorArr.length)];
        colors.push(color.r, color.g, color.b);
    }
    bufferGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3),
    );
    const pointMaterial = new THREE.PointsMaterial({
        size: 0.5,
        // color: 'orange'
        vertexColors: true
    });
    const pointCloud = new THREE.Points(bufferGeometry, pointMaterial);
    mesh.add(pointCloud);

    setInterval(() => {
        if(vertices.length >= 60000) {
            return;
        }

        gltf.scene.traverse(obj => {
            if(obj.isMesh) {

                const sampler = new MeshSurfaceSampler(obj).build();
    
                const position = new THREE.Vector3();
                for (let i = 0; i < 1000; i++) {
                    sampler.sample(position);
                    position.multiplyScalar(50);
                    vertices.push(position.x, position.y, position.z);
                }
                bufferGeometry.setAttribute(
                    'position',
                    new THREE.Float32BufferAttribute(vertices, 3),
                );

                for (let i = 0; i < vertices.length; i++) {
                    const color = colorArr[Math.floor(Math.random() * colorArr.length)];
                    colors.push(color.r, color.g, color.b);
                }
                bufferGeometry.setAttribute(
                    'color',
                    new THREE.Float32BufferAttribute(colors, 3),
                );
            }
        })
    }, 1000);

})

export default mesh;
