import * as THREE from 'three';

const worldMap = new THREE.Group();

const loader = new THREE.FileLoader();
loader.load('./world.geo.json', function (data) {
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

        worldMap.add(province);
    });
});

function createPolygon(coordinates) {
    const group = new THREE.Group();
    
    coordinates.forEach(item => {
        const bufferGeometry = new THREE.BufferGeometry();
        const vertices = [];
        item.forEach(point => {
            const {x,y,z} = lon2xyz(200, point[0], point[1]);
            vertices.push(x, y, z);
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
    const geometry = new THREE.SphereGeometry(200);
    const material = new THREE.MeshBasicMaterial({
        color: 'blue'
    });
    const ball = new THREE.Mesh(geometry, material);
    return ball;
}

worldMap.add(createBall());

export default worldMap;
