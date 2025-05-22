import SpriteText from "three-spritetext";

const spriteText = new SpriteText('aaa\n测试\n666', 300);

spriteText.color = 'blue';
spriteText.padding = 80;
// spriteText.strokeWidth = 2;
spriteText.strokeColor = 'blue';

spriteText.borderColor = '#ffffff';
spriteText.borderWidth = 10;
spriteText.borderRadius = 100;
spriteText.backgroundColor = 'lightpink';

export default spriteText;
