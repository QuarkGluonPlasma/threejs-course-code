import gltfPipeline from "gltf-pipeline";
import fs from 'fs';

const { gltfToGlb } = gltfPipeline;

const content = fs.readFileSync("./model/Michelle2.gltf", 'utf8');
const gltfJson = JSON.parse(content);

gltfToGlb(gltfJson, { 
    resourceDirectory: "./model/" 
}).then(function (results) {
  fs.writeFileSync("model.glb", results.glb);
});
