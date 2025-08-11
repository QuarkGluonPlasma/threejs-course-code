import * as THREE from "three";
import { ApplyForce, ApplyCollision, BatchedParticleRenderer,SphereEmitter, ConstantValue, IntervalValue, ParticleSystem, RandomColor, RenderMode } from "three.quarks";
import { loadPromise } from "./mesh";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./point.png');

const particles = new ParticleSystem({
    duration: 5,
    looping: true,
    startLife: new IntervalValue(3, 5),
    startSpeed: new IntervalValue(200, 500),
    startSize: new IntervalValue(1, 3),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0.7, 0, 1),
        new THREE.Vector4(1, 0.7, 0, 1)
    ),
    emissionOverTime: new ConstantValue(200),
    shape: new SphereEmitter({
        radius: 150,
        thickness: 0,
        arc: Math.PI * 2
    }),
    renderMode: RenderMode.Trail,
    rendererEmitterSettings: {
        startLength: new IntervalValue(1,5)
    },
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

loadPromise.then((gltf) => {
    const box3 = new THREE.Box3();
    box3.expandByObject(gltf.scene);

    const size = box3.getSize(new THREE.Vector3());

    particles.emitter.position.y = size.y * 2 / 3;
    particles.emitter.position.z = -size.z / 2;

    particles.addBehavior(
        new ApplyForce(
            new THREE.Vector3(0, -1, 0),
            new ConstantValue(10)
        )
    )

    particles.addBehavior(new ApplyCollision({
        resolve(pos, normal) {
            if(pos.y < -size.y * 2 / 3) {
                normal.set(0, 0.8, 0);
                return true;
            } else {
                return false;
            }
        }
    }, 0.5));
})

batchRenderer.addSystem(particles);


export {
    batchRenderer
}

export default group;
