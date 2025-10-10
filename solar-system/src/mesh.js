import gsap from 'gsap';
import * as THREE from 'three';
import { getCurPageNo } from './3d-init';

const data = [
    {
        name: '太阳',
        radius: 500,
        texture: './sun.jpg',
        period: 0
    },
    {
        name: '水星',
        radius: 20,
        texture: './mercury.jpg',
        period: 1
    },
    {
        name: '金星',
        radius: 34.8,
        texture: './venus.jpg',
        period: 2.58
    },
    {
        name: '地球',
        radius: 36.1,
        texture: './earth.jpg',
        period: 4.17
    },
    {
        name: '火星',
        radius: 23.9,
        texture: './mars.jpg',
        period: 7.83
    },
    {
        name: '木星',
        radius: 286.5,
        texture: './jupiter.jpg',
        period: 49.42
    },
    {
        name: '土星',
        radius: 238.6,
        texture: './saturn.jpg',
        period: 122.75
    },
    {
        name: '天王星',
        radius: 104,
        texture: './uranus.jpg',
        period: 350.04
    },
    {
        name: '海王星',
        radius: 101,
        texture: './neptune.jpg',
        period: 686.67
    }
]

const group = new THREE.Group();

const loader = new THREE.TextureLoader();

data.forEach((item, index) => {
    const geometry = new THREE.SphereGeometry(item.radius);

    loader.load(item.texture, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshPhongMaterial({
            map: texture
        });
        const planet = new THREE.Mesh(geometry, material);
        // planet.position.x = index * 700;

        const planetGroup = new THREE.Group();
        planetGroup.name = 'planetGroup' + index;
        planetGroup.add(planet);
        group.add(planetGroup);

        // const helper = new THREE.AxesHelper(1000);
        // planetGroup.add(helper);

        const arc1 = new THREE.EllipseCurve(0, 0,  index * 700, index * 700, 0, Math.PI * 2);
        const pointsArr1 = arc1.getPoints(200);
        const geometry1 = new THREE.BufferGeometry();
        geometry1.setFromPoints(pointsArr1);
        const material1 = new THREE.LineBasicMaterial({
            color: new THREE.Color('white'),
            transparent: true,
            opacity: 0.4
        });
        const line1 = new THREE.Line(geometry1, material1);
        group.add(line1);

        const R = index * 700;
        const startAngle = Math.PI * 2 * Math.random();
        let obj = {
            angle: startAngle
        }

        let prevPageNo;
        gsap.to(obj, {
            angle: Math.PI  * 2 + startAngle,
            duration: item.period / 5,
            repeat: -1,
            ease: 'none',
            onUpdate: () => {
                planetGroup.position.x = Math.cos(obj.angle) * R;
                planetGroup.position.y = Math.sin(obj.angle) * R;

                const curPageNo = getCurPageNo();
                if( curPageNo !== prevPageNo && curPageNo === index + 1) {
                    console.log(getCurPageNo())

                }
                prevPageNo = curPageNo;
            },
        });
    });
});

group.rotateX(-Math.PI / 2);

export default group;
