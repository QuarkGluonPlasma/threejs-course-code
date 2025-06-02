import * as THREE from "three";
import { BatchedParticleRenderer,Bezier,ConeEmitter, ConstantValue, DonutEmitter, FrameOverLife, IntervalValue, ParticleSystem, PiecewiseBezier, RandomColor, RenderMode } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./texture.png');

const particles = new ParticleSystem({
    duration: 20,
    looping: true,
    startLife: new IntervalValue(0, 10),
    startSpeed: new IntervalValue(0, 100),
    startSize: new IntervalValue(0, 100),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0, 0, 1),
        new THREE.Vector4(0, 0, 1, 1)
    ),
    emissionOverTime: new ConstantValue(50),
    shape: new DonutEmitter({
        radius: 300,
        arc: Math.PI * 2,
        donutRadius: 50
    }),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    }),
    uTileCount: 10,
    vTileCount: 10,
    startTileIndex: new ConstantValue(45)
});

particles.addBehavior(
    new FrameOverLife(
        new PiecewiseBezier(
            [
                [new Bezier(45, 48, 50, 52), 0]
            ]
        )
    )
);

group.add(particles.emitter);

batchRenderer.addSystem(particles);

export {
    batchRenderer
}

export default group;