import * as THREE from "three";
import { BatchedParticleRenderer, ConeEmitter, ConstantValue, IntervalValue, ParticleSystem,PointEmitter,RandomColor, RenderMode, SphereEmitter } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./heart.png');

const particles = new ParticleSystem({
    duration: 20,
    looping: false,
    startLife: new IntervalValue(0, 10),
    startSpeed: new IntervalValue(0, 1000),
    startSize: new IntervalValue(0, 100),
    startColor: new RandomColor(
        new THREE.Vector4(1, 0, 0, 1),
        new THREE.Vector4(0, 1, 0, 1)
    ),
    emissionOverTime: new ConstantValue(1000),
    shape: new ConeEmitter({
        radius: 10,
        thickness: 10,
        arc: Math.PI * 2
    }),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    })
});

group.add(particles.emitter);

particles.pause();

batchRenderer.addSystem(particles);

function replay() {
    particles.stop();
    particles.time = 0;
    particles.play();
}

function stop() {
    particles.stop();
}

export {
    batchRenderer,
    replay,
    stop
}

export default group;
