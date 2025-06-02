import * as THREE from "three";
import { ApplySequences, BatchedParticleRenderer,ConeEmitter, ConstantValue, DonutEmitter, GridEmitter, IntervalValue, ParticleSystem, RandomColor, RectangleEmitter, TextureSequencer, Vector3, Vector4 } from "three.quarks";

const group = new THREE.Group();

const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();
const texture = loader.load('./point.png');

const particles = new ParticleSystem({
    duration: 10,
    looping: true,
    startLife: new ConstantValue(9),
    startSpeed: new ConstantValue(0),
    startSize: new IntervalValue(0.1, 0.2),
    startColor: new RandomColor(
        new Vector4(1, 1, 1, 1),
        new Vector4(1, 0.7, 0, 1)
    ),
    emissionOverTime: new ConstantValue(0),
    emissionBursts: [
        {
            time: 0,
            count: new ConstantValue(2000),
            probability: 1,
        },
    ],
    shape: new GridEmitter({
        width: 20, 
        height: 20, 
        column: 50, 
        row: 50
    }),
    material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    })
});

group.add(particles.emitter);

batchRenderer.addSystem(particles);

const pointTexture = await loader.loadAsync('./text_texture.png');

const seq = new TextureSequencer(0.1, 0.1, new Vector3(-10, 0, 0));
seq.fromImage(pointTexture.image, 0.2);

const logoTexture = await loader.loadAsync('./logo_texture.png');

const seq2 = new TextureSequencer(0.1, 0.1, new Vector3(-5, -5, 0));
seq2.fromImage(logoTexture.image, 0.2);

const applySeq = new ApplySequences(0.0001);
applySeq.appendSequencer(new IntervalValue(2, 3), seq);
applySeq.appendSequencer(new IntervalValue(6, 7), seq2);

particles.addBehavior(applySeq);

export {
    batchRenderer
}

export default group;