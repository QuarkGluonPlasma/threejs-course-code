import * as THREE from "three";
import { BatchedParticleRenderer, Bezier, ColorOverLife, ColorRange, ConstantValue, ForceOverLife, FrameOverLife, GridEmitter, IntervalValue, ParticleSystem,PiecewiseBezier,PointEmitter,RandomColor, RenderMode, RotationOverLife, SizeOverLife, SpeedOverLife } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./heart.png');

const particles = new ParticleSystem({
    duration: 5,
    looping: true,
    startLife: new IntervalValue(0, 3),
    startSpeed: new IntervalValue(0, 600),
    startSize: new ConstantValue(100),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0.5, 0.5, 1),
        new THREE.Vector4(0.5, 0.5, 1, 1)
    ),
    emissionOverTime: new ConstantValue(5),
    shape: new GridEmitter({
        width: 300,
        height: 300,
        row: 1,
        column: 1
    }),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

batchRenderer.addSystem(particles);

particles.addBehavior(
    new SizeOverLife(new PiecewiseBezier(
        [
            [
                new Bezier(1, 0.7, 0.3, 0),
                0
            ]
        ]
    ))
);

particles.addBehavior(
    new SpeedOverLife(new PiecewiseBezier(
        [
            [
                new Bezier(0.1 ,0.8, 0.3, 10),
                0
            ]
        ]
    ))
);

particles.addBehavior(
    new ColorOverLife(new ColorRange(
        new THREE.Vector4(1, 0, 0, 1),
        new THREE.Vector4(0, 0, 1, 1)
    ))
);

particles.addBehavior(new ForceOverLife(
    new ConstantValue(0), 
    new ConstantValue(-500), 
    new ConstantValue(0)
));

particles.addBehavior(new RotationOverLife(
    new IntervalValue(-Math.PI, Math.PI))
);


export {
    batchRenderer
}

export default group;