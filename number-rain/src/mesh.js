import * as THREE from "three";
import SpriteText from "three-spritetext";

const width = window.innerWidth;
const height = window.innerHeight;

const columnWidth = 50;
const columnNum = Math.floor(width / columnWidth);

const fontSize = 30;
const lineHeight = fontSize * 1.3;

const textNumOfColumn = Math.ceil(height * 2 / lineHeight);

const group = new THREE.Group();
const columns = [];

for (let i = 0; i < columnNum; i++) {
  const column = [];

  for (let j = 0; j < textNumOfColumn; j++) {
    const text = Math.floor(Math.random() * 10) + '';

    const spriteText = new SpriteText(text, 20, 'green');
    spriteText.strokeWidth = 1;
    spriteText.strokeColor = 'lightgreen';

    const x = i * columnWidth;
    const y = j * lineHeight + Math.random() * 60;

    spriteText.position.set(x, y, 0);
    spriteText.material.opacity = 0.5 + 0.5 * Math.random();

    group.add(spriteText);
    column.push(spriteText);
  }
  columns.push(column);
}

function animate() {
    columns.forEach(column => {
      column.forEach(sprite => {
        sprite.position.y -= 3 + 3 * Math.random();
        if (sprite.position.y < 0) {
          sprite.position.y = height;
        }
      });
    });
    requestAnimationFrame(animate);
}
animate();

export default group;
