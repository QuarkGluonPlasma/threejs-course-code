import * as THREE from "three";
import { BatchedParticleRenderer, ConstantValue, IntervalValue, ParticleSystem,PointEmitter,RandomColor, RenderMode } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./heart.png');

const particles = new ParticleSystem({
    duration: 20,
    looping: true,
    startLife: new IntervalValue(0, 10),
    startSpeed: new IntervalValue(0, 500),
    startSize: new IntervalValue(0, 100),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0, 0, 1),
        new THREE.Vector4(0, 1, 0, 1)
    ),
    emissionOverTime: new ConstantValue(100),
    shape: new PointEmitter(),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

batchRenderer.addSystem(particles);

export {
    batchRenderer
}

export default group;
