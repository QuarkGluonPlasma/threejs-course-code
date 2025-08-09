import * as THREE from 'three';
import { geoMercator } from 'd3-geo';
import populationData from './data';
import SpriteText from 'three-spritetext';
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

    geojson.features.forEach(feature => {        
        if(!feature.properties.center) {
            return;
        }

        const [x, y] = mercator(feature.properties.center);

        const num = populationData[feature.properties.name];
        const geometry = new THREE.BoxGeometry(10, 10, num / 50);

        const positions = geometry.attributes.position;

        const colorsArr = [];
        const color1 = new THREE.Color('pink');
        const color2 = new THREE.Color('red');
        for (let i = 0; i < positions.count; i++) {
            const z = positions.getZ(i) * 2
            const percent = z / 250;
            const c = color1.clone().lerp(color2, percent);
            colorsArr.push(c.r, c.g, c.b);
        }
        const colors = new Float32Array(colorsArr);
        geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

        const material = new THREE.MeshPhongMaterial({
            // color: 'orange'
            vertexColors: true
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(x, -y, num/50/2);

        chinaMap.add(bar);

        const numText = new SpriteText(num + '万', 8);
        numText.color = 'black';
        numText.backgroundColor = 'white';
        numText.strokeWidth = 0.5;
        numText.strokeColor = 'blue';
        numText.borderRadius = 5;
        numText.borderWidth = 1;
        numText.borderColor = '#000';
        numText.padding = 2;
        numText.position.set(0, 0, num/50/2  + 10);
        bar.add(numText);


        const nameText = new SpriteText(feature.properties.name, 10);
        nameText.color = 'white';
        nameText.strokeWidth = 3;
        nameText.strokeColor = 'black';
        nameText.position.set(10, -10, -num/50/2 + 10);
        bar.add(nameText);

        nameText.visible = false;

        bar.position.z = -num/50/2;
        gsap.to(bar.position, {
            z: num/50/2,
            ease: 'bounce.out',
            duration: 2,
            onComplete() {
                nameText.visible = true;
            }
        });
    });
});

function createPolygon(coordinates) {
    const group = new THREE.Group();
    
    const shape = new THREE.Shape();

    let first = true;
    coordinates.forEach(item => {
        const bufferGeometry = new THREE.BufferGeometry();
        const vertices = [];
        item.forEach(point => {
            const [x, y] = mercator(point);
            vertices.push(x, -y, 0);

            if(first) {
                shape.moveTo(x, -y);
            } else {
                shape.lineTo(x, -y);
            }
            first = false;
        });

        const attribute = new THREE.Float32BufferAttribute(vertices, 3);;
        bufferGeometry.attributes.position = attribute;

        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 'white' 
        });
        const line = new THREE.Line(bufferGeometry, lineMaterial);
        group.add(line);

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 10
        });

        const color1 = new THREE.Color('lightblue');
        const color2 = new THREE.Color('blue');
        const percent = Math.random();
        const color = color1.clone().lerp(color2, percent);

        const material = new THREE.MeshPhongMaterial({
            color
        });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
        mesh.position.z = -11;
    });

    return group;
}

chinaMap.rotateX(-Math.PI / 2);

export default chinaMap;
