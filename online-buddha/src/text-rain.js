import * as THREE from "three";
import SpriteText from "three-spritetext";
import { AxisAngleGenerator, BatchedParticleRenderer,ConeEmitter, ConstantValue, DonutEmitter, GridEmitter, IntervalValue, Noise, ParticleSystem, RandomColor, RectangleEmitter, RenderMode, Rotation3DOverLife, TextureSequencer, Vector3, Vector4 } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const figureText = new SpriteText('卐', 30);
figureText.color = 'gold';

const geometry = new THREE.PlaneGeometry(20, 20);

const particles = new ParticleSystem({
    duration: 20,
    looping: true,
    instancingGeometry: geometry,
    startLife: new ConstantValue(20),
    startSpeed: new IntervalValue(100, 200),
    startSize: new IntervalValue(1, 3),
    startColor: new RandomColor(
        new Vector4(1, 0.7, 0, 1),
        new Vector4(1, 1, 1, 1)
    ),
    startRotation: new IntervalValue(Math.PI / 6, Math.PI / 3),
    emissionOverTime: new IntervalValue(10, 30),
    shape: new GridEmitter({
        width: 1500, 
        height: 1000,
        column: 20, 
        row: 20
    }),
    renderMode: RenderMode.Mesh,
    material: new THREE.MeshBasicMaterial({
        map: figureText.material.map,
        transparent: true,
        side: THREE.DoubleSide
    })
});

particles.addBehavior(
    new Rotation3DOverLife(
        new AxisAngleGenerator(
            new THREE.Vector3(0, 1, 1).normalize(),
            new IntervalValue(Math.PI / 10, Math.PI)
        )
    )
)

particles.addBehavior(
    new Noise(
        new ConstantValue(0.2),
        new IntervalValue(100, 300)
    )
)

group.add(particles.emitter);

particles.emitter.rotateX(Math.PI / 2);
particles.emitter.position.y = 600;

batchRenderer.addSystem(particles);

export {
    batchRenderer
}

export default group;
