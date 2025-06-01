import * as THREE from "three";
import { ApplyCollision, ApplyForce, BatchedParticleRenderer,Bezier,ConeEmitter, ConstantValue, IntervalValue, ParticleSystem, PiecewiseBezier, RandomColor, RenderMode, SpeedOverLife } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./point.png');

const particles = new ParticleSystem({
    duration: 20,
    looping: true,
    startLife: new IntervalValue(0, 10),
    startSpeed: new IntervalValue(0, 1000),
    startSize: new IntervalValue(0, 10),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0.7, 0, 1),
        new THREE.Vector4(1, 1, 1, 1)
    ),
    emissionOverTime: new ConstantValue(1000),
    shape: new ConeEmitter({
        radius: 0,
        arc: Math.PI * 2,
    }),
    renderMode: RenderMode.Trail,
    rendererEmitterSettings: {
        startLength: new ConstantValue(5)
    },
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

particles.emitter.rotateX(-Math.PI  / 2);

batchRenderer.addSystem(particles);

particles.addBehavior(
    new ApplyForce(
        new THREE.Vector3(0, 0, -1),
        new ConstantValue(1000)
    )
)

particles.addBehavior(new ApplyCollision({
    resolve(pos, normal) {
        if(pos.z < 0) {
            normal.set(0, 0, 1);
            return true;
        } else {
            return false;
        }
    }
}, 0.5));

particles.addBehavior(
    new SpeedOverLife(new PiecewiseBezier(
        [
            [
                new Bezier(1.5 ,0.8, 0.4, 0),
                0
            ]
        ]
    ))
);

export {
    batchRenderer
}

export default group;
