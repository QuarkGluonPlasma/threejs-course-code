import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const texture = loader.load("./snow.png");
const spriteMaterial = new THREE.SpriteMaterial({
    map: texture
});

const group = new THREE.Group();

for (let i = 0; i < 1000; i ++) {
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 5);

    const x = -1500 + 3000 * Math.random();
    const y = 1000 * Math.random();
    const z = -1500 + 3000 * Math.random();
    sprite.position.set(x, y, z);

    group.add(sprite);
}

const clock = new THREE.Clock();
function render() {
    const delta = clock.getDelta();
    group.children.forEach(sprite => {
        sprite.position.y -= delta * 30;

        if (sprite.position.y < 0) {
            sprite.position.y = 1000;
        }
    });

    requestAnimationFrame(render);
}
render();

export default group;
