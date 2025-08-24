import gsap from 'gsap';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';

const worldMap = new THREE.Group();

export const loadPromise = new Promise((resolve) => {
    const loader = new THREE.FileLoader();
    loader.load('./world.geo.json', function (data) {
        const geojson = JSON.parse(data);
        resolve(geojson)
    });
})

loadPromise.then((geojson) => {
    
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

        worldMap.add(province);
    });

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

        province.name = 'shape' + feature.properties.name_zh;
        worldMap.add(province);
    });

    geojson.features.forEach(feature => {
        const name = feature.properties.name_zh;
        const {x,y,z} = lon2xyz(510, feature.properties.label_x, feature.properties.label_y);

        const label = new SpriteText(name, 3);
        label.color = 'black';
        label.position.set(x, y, z);

        label.name = 'label' + feature.properties.name_zh;

        worldMap.add(label);
    });
});

function createPolygon(coordinates) {
    const group = new THREE.Group();
    
    coordinates.forEach(item => {
        const geometry = new LineGeometry();
        const vertices = [];
        item.forEach(point => {
            const {x,y,z} = lon2xyz(500, point[0], point[1]);
            vertices.push(new THREE.Vector3(x, y, z));
        });
        geometry.setFromPoints(vertices);

        const lineMaterial = new LineMaterial({ 
            color: 'gold',
            linewidth: 3
        });
        const line = new Line2(geometry, lineMaterial);
        group.add(line);
    });

    return group;
}

function lon2xyz(R, longitude, latitude) {
    let lon = -longitude * Math.PI / 180;
    let lat = latitude * Math.PI / 180;

    const x = R * Math.cos(lat) * Math.cos(lon);
    const y = R * Math.sin(lat);
    const z = R * Math.cos(lat) * Math.sin(lon);

    return {
        x,
        y,
        z
    }
}

function createBall() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./worldmap.jpeg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(500);
    const material = new THREE.MeshBasicMaterial({
        map: texture
    });
    const ball = new THREE.Mesh(geometry, material);
    return ball;
}

worldMap.add(createBall());

function createBg() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./bg.png');
    texture.colorSpace = THREE.SRGBColorSpace;;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.setScalar(2100);

    gsap.to(sprite.material, {
        opacity: 0.6,
        duration: 2,
        ease: 'none',
        repeat: -1,
        yoyo: true
    })
    return sprite;
}

worldMap.add(createBg());

export default worldMap;
