import * as THREE from 'three';
import { geoMercator } from 'd3-geo';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';

const chinaMap = new THREE.Group();

const mercator = geoMercator()
    .center([105,34]).translate([0, 0]).scale(600)

const loader = new THREE.FileLoader();
loader.load('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json', function (data) {
    const geojson = JSON.parse(data);
    console.log(geojson);

    geojson.features.forEach(feature => {
        const province = new THREE.Group();
        
        if (feature.geometry.type === 'Polygon') {
            const polygon = createPolygon(feature.geometry.coordinates);
            province.add(polygon);
        } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygonCoords => {
                const polygon = createPolygon(polygonCoords);
                province.add(polygon);
            });
        }

        chinaMap.add(province);
    });

    const cityCenterMap = new Map();
    geojson.features.forEach(feature => {
        cityCenterMap.set(feature.properties.name, feature.properties.center);
    })
    console.log(cityCenterMap);

    const beijingPos = mercator(cityCenterMap.get('北京市'));

    for(let [name, center] of cityCenterMap.entries()) {
        if(!name) {
            continue;
        }
        if(name === '北京市') {
            const startPos = mercator(center);

            const geometry = new THREE.ConeGeometry(10, 30, 6);
            const material = new THREE.MeshBasicMaterial({
                color: 'red'
            });
            const cone = new THREE.Mesh(geometry, material);
            cone.position.x = startPos[0];
            cone.position.y = -startPos[1];
            cone.position.z = 20;
            cone.rotateX(-Math.PI /2);

            chinaMap.add(cone);

            gsap.to(cone.position, {
                z: 40,
                ease: 'none',
                repeat: -1,
                duration: 1,
                yoyo: true
            });

            continue;
        }
        const endPos = mercator(center);
        const start = new THREE.Vector3( beijingPos[0], -beijingPos[1], 0 );
        const end  = new THREE.Vector3( endPos[0], -endPos[1], 0 );
        const middle = start.clone().add(end).divideScalar(2);

        drawRipple(new THREE.Vector3(endPos[0], -endPos[1], 0));

        const distance = start.clone().sub(end).length();
        middle.z = distance / 3;

        const curve = new THREE.CatmullRomCurve3([
            start,
            middle,
            end
        ]);
        const pointsArr = curve.getPoints(100);

        const geometry = new LineGeometry();
        geometry.setFromPoints(pointsArr);

        const material = new LineMaterial({ 
            color: new THREE.Color('yellow'),
            linewidth: 2
        });

        const line = new Line2(geometry, material);
        chinaMap.add(line);

        const pointsArr2 = pointsArr.slice(30, 30 + 20);

        const geometry2 = new LineGeometry();
        geometry2.setFromPoints(pointsArr2);

        const material2 = new LineMaterial({ 
            color: new THREE.Color('orange'),
            linewidth: 2
        });
        const line2 = new Line2(geometry2, material2);
        // chinaMap.add(line2);

        // let index = 30;
        // function render() {
        //     if(index >= 100) index = 0;
        //     index++;
        //     const arr = pointsArr.slice(index, index + 20);
        //     geometry2.setFromPoints(arr);
        //     requestAnimationFrame(render);
        // }

        // render();

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./plane.jpeg');

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            color: 'orange',
            transparent: true
        });
    
        const planeSprite = new THREE.Sprite(spriteMaterial);
        planeSprite.scale.set(30,30);
        chinaMap.add(planeSprite);

        let obj = { index: 0 };
        gsap.to(obj, {
            index: 100,
            ease: 'circ.out',
            repeat: -1,
            duration: 2,
            onUpdate() {
                const arr = pointsArr.slice(obj.index, obj.index + 20);
                geometry2.setFromPoints(arr);
                planeSprite.position.copy(arr[0]);

                if (arr.length > 1) {
                    const currentPoint = arr[0];
                    const nextPoint = arr[1];

                    const direction = new THREE.Vector2(
                        nextPoint.x - currentPoint.x,
                        nextPoint.y - currentPoint.y
                    );

                    const angle = Math.atan2(direction.y, direction.x);

                    planeSprite.material.rotation = angle - Math.PI / 2;
                }
            }
        })
    }
});

function createPolygon(coordinates) {
    const group = new THREE.Group();

    coordinates.forEach(item => {
        const bufferGeometry = new THREE.BufferGeometry();
        const vertices = [];
        item.forEach(point => {
            const [x, y] = mercator(point);
            vertices.push(x, -y, 0);
        });
        const attribute = new THREE.Float32BufferAttribute(vertices, 3);;
        bufferGeometry.attributes.position = attribute;

        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 'white' 
        });
        const line = new THREE.Line(bufferGeometry, lineMaterial);
        group.add(line);
    });

    return group;
}

function drawRipple(pos) {
    const ripple = new THREE.Group();
    for(let i = 0; i< 5; i++) {
        const arc = new THREE.EllipseCurve(0, 0, i * 5 , i * 5, 0, Math.PI * 2);
        const pointsArr = arc.getPoints(50);
        const geometry = new LineGeometry();
        geometry.setFromPoints(pointsArr);
        const material = new LineMaterial({
            color: new THREE.Color('green'),
            linewidth:  (4 - i <= 0) ? 1 : 4 - i
        });
        const line = new Line2(geometry, material);
        ripple.add(line);
    }
    ripple.position.copy(pos);
    chinaMap.add(ripple);

    ripple.scale.set(0.2,0.2,0);
    gsap.to(ripple.scale, {
        y: 1,
        x: 1,
        ease: 'none',
        repeat: -1,
        duration: 2 
    });
}
chinaMap.rotateX(-Math.PI / 2);

export default chinaMap;
