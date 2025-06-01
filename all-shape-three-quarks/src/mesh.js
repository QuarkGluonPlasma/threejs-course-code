import * as THREE from "three";
import { BatchedParticleRenderer, CircleEmitter, ConeEmitter, ConstantValue, DonutEmitter, GridEmitter, HemisphereEmitter, IntervalValue, ParticleSystem,PointEmitter,RandomColor, RectangleEmitter, RenderMode, SphereEmitter } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./point.png');

const particles = new ParticleSystem({
    duration: 20,
    looping: true,
    startLife: new IntervalValue(0, 10),
    startSpeed: new IntervalValue(0, 100),
    startSize: new IntervalValue(0, 10),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0.5, 0.5, 1),
        new THREE.Vector4(0.5, 0.5, 1, 1)
    ),
    emissionOverTime: new ConstantValue(1000),
    // shape: new PointEmitter(),
    // shape: new ConeEmitter({
    //     radius: 100,
    //     thickness: 10,
    //     arc: Math.PI * 2,
    //     angle: Math.PI / 4
    // }),
    // shape: new SphereEmitter({
    //     radius: 500,
    //     thickness: 0,
    //     arc: Math.PI * 2
    // }),
    // shape: new HemisphereEmitter({
    //     radius: 500,
    //     thickness: 0,
    //     arc: Math.PI * 2
    // }),
    // shape: new CircleEmitter({
    //     radius: 200,
    //     thickness: 0,
    //     arc: Math.PI  * 2
    // }),
    // shape: new DonutEmitter({
    //     radius: 500,
    //     thickness: 0,
    //     arc: Math.PI  * 2,
    //     donutRadius: 50
    // }),
    // shape: new RectangleEmitter({
    //     width: 300,
    //     height: 400,
    // }),
    shape: new GridEmitter({
        width: 300,
        height: 400,
        row: 5,
        column: 6
    }),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

batchRenderer.addSystem(particles);

export {
    batchRenderer
}

export default group;