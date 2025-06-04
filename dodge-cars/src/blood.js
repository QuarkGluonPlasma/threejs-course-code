import * as THREE from "three";
import { ApplyCollision, ApplyForce, BatchedParticleRenderer,ConstantValue, GridEmitter, IntervalValue, ParticleSystem, PointEmitter, RandomColor, RenderMode } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./point.png');

const particles = new ParticleSystem({
    duration: 10,
    looping: true,
    startLife: new ConstantValue(5, 9),
    startSpeed: new IntervalValue(30, 50),
    startSize: new IntervalValue(5, 10),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0, 0, 1),
        new THREE.Vector4(1, 0, 0, 0.1)
    ),
    emissionOverTime: new IntervalValue(300, 500),
    shape: new PointEmitter(),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

batchRenderer.addSystem(particles);


// particles.emitter.position.y = 100;
particles.emitter.visible = false;
particles.emitter.name = 'bloodEmitter';

particles.addBehavior(
    new ApplyForce(
        new THREE.Vector3(0, -1, 0),
        new ConstantValue(70)
    )
)

function addCollisionBehavior(y) {
    particles.addBehavior(new ApplyCollision({
        resolve(pos, normal) {
            if(pos.y < y) {
                normal.set(0, 1, 0);
                return true;
            } else {
                return false;
            }
        }
    }, 0.1));
}

export {
    batchRenderer,
    addCollisionBehavior
}

export default group;
