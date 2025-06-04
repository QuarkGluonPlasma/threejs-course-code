import gsap from "gsap";
import SpriteText from "three-spritetext";

export function createLeftArrow() {
    const arrowLeft = new SpriteText('←', 200);
    arrowLeft.color = 'white';
    arrowLeft.strokeColor = 'blue';
    arrowLeft.strokeWidth = 1;
    arrowLeft.position.x = -500;
    arrowLeft.position.y = 100;
    arrowLeft.position.z = 100;
    return arrowLeft;
}

export function createRightArrow() {
    const arrowLeft = new SpriteText('→', 200);
    arrowLeft.color = 'white';
    arrowLeft.strokeColor = 'blue';
    arrowLeft.strokeWidth = 1;
    arrowLeft.position.x = 500;
    arrowLeft.position.y = 100;
    arrowLeft.position.z = 100;
    return arrowLeft;
}

export function createReady() {
    const ready = new SpriteText('Ready', 200);
    ready.color = 'white';
    ready.strokeColor = 'green';
    ready.strokeWidth = 1;

    ready.position.y = 200;
    
    ready.position.z = -500;
    ready.textHeight = 0;

    const timeline = gsap.timeline();
    timeline
        .to(ready.position, {
            duration: 0.5,
            z: 100,
        })
        .to(ready, {
            textHeight: 200,
            duration: 0.5
        }, '<')
        .to(ready, {
            textHeight: 0,
            duration: 0.05,
            onComplete: () => {
                ready.parent.remove(ready);
            }
        }, '+=0.5');
    return ready;
}


export function createGo() {
    const ready = new SpriteText('Go', 200);
    ready.color = 'white';
    ready.strokeColor = 'green';
    ready.strokeWidth = 1;

    ready.position.y = 200;
    
    ready.position.z = -500;
    ready.textHeight = 0;

    const timeline = gsap.timeline();
    timeline
        .to(ready.position, {
            duration: 0.5,
            z: 100,
        }, '+=1')
        .to(ready, {
            textHeight: 200,
            duration: 0.5
        }, '<')
        .to(ready, {
            textHeight: 0,
            duration: 0.05,
            onComplete: () => {
                ready.parent.remove(ready);
            }
        }, '+=0.5');
    return ready;
}

export function createGameOver() {
    const ready = new SpriteText('Game Over', 200);
    ready.color = 'red';
    ready.strokeColor = 'white';
    ready.strokeWidth = 1;
    ready.padding = 80;

    ready.position.y = 200;
    
    ready.position.z = -500;
    ready.textHeight = 0;

    const timeline = gsap.timeline();
    timeline
        .to(ready.position, {
            duration: 0.3,
            z: 100,
        })
        .to(ready, {
            textHeight: 120,
            duration: 0.3
        }, '<');
    return ready;
}
