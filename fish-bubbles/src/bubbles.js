import * as THREE from "three";
import { BatchedParticleRenderer,Bezier,ConstantValue, FrameOverLife, GridEmitter, IntervalValue, ParticleSystem, PiecewiseBezier, RandomColor, SizeOverLife } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./texture.png');

const particles = new ParticleSystem({
    duration: 5,
    looping: true,
    startLife: new ConstantValue(3, 5),
    startSpeed: new IntervalValue(200, 300),
    startSize: new IntervalValue(50, 100),
    startColor: new RandomColor(
        new THREE.Vector4(1, 1, 1, 1),
        new THREE.Vector4(1, 1, 1, 1)
    ),
    emissionOverTime: new IntervalValue(1, 2),
    shape: new GridEmitter({
        row: 1,
        column: 1,
    }),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    }),
    uTileCount: 10,
    vTileCount: 10,
    startTileIndex: new ConstantValue(36)
});

group.add(particles.emitter);

particles.emitter.rotateX(-Math.PI / 2);
particles.emitter.position.x = 55;
particles.emitter.position.z = -40;
particles.emitter.position.y = 230;

batchRenderer.addSystem(particles);

particles.emitter.name = 'emitter';

particles.addBehavior(
    new SizeOverLife(
        new PiecewiseBezier([[new Bezier(0, 0.5, 0.75, 1), 0]])
    )
);

particles.addBehavior(
    new FrameOverLife(
        new PiecewiseBezier(
            [
                [new Bezier(36, 39, 42, 44), 0]
            ]
        )
    )
);

export {
    batchRenderer
}

export default group;
