import * as THREE from "three";
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";
import { camera, controls, renderer } from "./main";

class MyTransformControls {

    constructor() {
        this.obj = null;
    }

    attach(obj) {
        this.obj = obj;

        const box3 = new THREE.Box3();
        box3.expandByObject(obj);

        const size = box3.getSize(new THREE.Vector3());
        const center = box3.getCenter(new THREE.Vector3());
        
        // const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        // const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
        // const material = new THREE.LineBasicMaterial({
        //     color: 'yellow',
        //     linewidth: 10
        // })
        // const mesh = new THREE.LineSegments(edgesGeometry, material);
        // mesh.position.copy(center);
        // obj.add(mesh);
        const geometry = new LineGeometry();
        geometry.setPositions([
            box3.min.x, box3.min.y, box3.min.z,
            box3.min.x, box3.max.y, box3.min.z,
            box3.max.x, box3.max.y, box3.min.z,
            box3.max.x, box3.min.y, box3.min.z,
            box3.min.x, box3.min.y, box3.min.z,
            box3.min.x, box3.min.y, box3.max.z,
            box3.min.x, box3.max.y, box3.max.z,
            box3.min.x, box3.max.y, box3.min.z,
            box3.min.x, box3.max.y, box3.max.z,
            box3.max.x, box3.max.y, box3.max.z,
            box3.max.x, box3.min.y, box3.max.z,
            box3.max.x, box3.min.y, box3.min.z,
            box3.max.x, box3.max.y, box3.min.z,
            box3.max.x, box3.max.y, box3.max.z,
            box3.max.x, box3.min.y, box3.max.z,
            box3.min.x, box3.min.y, box3.max.z,    
        ]);
        const material = new LineMaterial({
            color: 'yellow',
            linewidth: 3
        });
        const mesh = new Line2(geometry, material);
        obj.add(mesh);

        const arrowTopShape = new THREE.Shape();
        arrowTopShape.lineTo(0, 150);
        arrowTopShape.lineTo(-25, 150);
        arrowTopShape.lineTo(25, 200);
        arrowTopShape.lineTo(75, 150);
        arrowTopShape.lineTo(50, 150);
        arrowTopShape.lineTo(50, 0);
        arrowTopShape.lineTo(0, 0);

        const arrowTopGeometry = new THREE.ShapeGeometry(arrowTopShape);
        const arrowTopMaterial = new THREE.MeshBasicMaterial({
            color: 'blue',
            side: THREE.DoubleSide
        });
        const arrowTopMesh = new THREE.Mesh(arrowTopGeometry, arrowTopMaterial);
        obj.add(arrowTopMesh);
        arrowTopMesh.name = 'arrowTop';
        arrowTopMesh.position.copy(center);
        arrowTopMesh.position.y += size.y/2;
        arrowTopMesh.position.x -= 25;

        const arrowLeftGeometry = new THREE.ShapeGeometry(arrowTopShape);
        const arrowLeftMaterial = new THREE.MeshBasicMaterial({
            color: 'green',
            side: THREE.DoubleSide
        });
        const arrowLeftMesh = new THREE.Mesh(arrowLeftGeometry, arrowLeftMaterial);
        obj.add(arrowLeftMesh);
        arrowLeftMesh.name = 'arrowLeft';
        arrowLeftMesh.position.copy(center);
        arrowLeftMesh.position.x += size.x/2;
        arrowLeftMesh.rotateZ(-Math.PI / 2);
        arrowLeftMesh.position.y += 25;

        const arrowFrontGeometry = new THREE.ShapeGeometry(arrowTopShape);
        const arrowFrontMaterial = new THREE.MeshBasicMaterial({
            color: 'red',
            side: THREE.DoubleSide
        });
        const arrowFrontMesh = new THREE.Mesh(arrowFrontGeometry, arrowFrontMaterial);
        obj.add(arrowFrontMesh);
        arrowFrontMesh.name = 'arrowFront';
        arrowFrontMesh.position.copy(center);
        arrowFrontMesh.position.z += size.z/2;
        arrowFrontMesh.rotateX(Math.PI / 2);
        arrowFrontMesh.position.x -= 25;

        const arrowRotateShape = new THREE.Shape();
        arrowRotateShape.absarc(0, 0, 200, 0, Math.PI / 2, false);
        arrowRotateShape.absarc(0, 0, 240, Math.PI / 2, 0, true);

        const arrowRotateGeometry = new THREE.ShapeGeometry(arrowRotateShape);
        const arrowRotateMaterial = new THREE.MeshBasicMaterial({
            color: 'yellow',
            side: THREE.DoubleSide
        });
        const arrowRotateMesh = new THREE.Mesh(arrowRotateGeometry, arrowRotateMaterial);
        obj.add(arrowRotateMesh);
        arrowRotateMesh.name = 'arrowRotate';
        arrowRotateMesh.position.copy(center);
        arrowRotateMesh.position.x += size.x/2;
        arrowRotateMesh.position.z += size.z/2;
        arrowRotateMesh.rotateX(Math.PI / 2);

        controls.addEventListener('change', () => {
            const dir = camera.getWorldDirection(new THREE.Vector3());
            const zAxis = new THREE.Vector3(0, 0, 1);
            const dot = dir.dot(zAxis);
            const angle = Math.acos(dot);
            
            const res = THREE.MathUtils.radToDeg(angle);
          
            if(res > 90) {
                arrowFrontMesh.position.copy(center);
                arrowFrontMesh.position.z += size.z/2;
                arrowFrontMesh.rotation.z = 0;
                arrowFrontMesh.position.x -= 25;

                arrowRotateMesh.position.copy(center);
                arrowRotateMesh.position.x += size.x/2;
                arrowRotateMesh.position.z += size.z/2;
                arrowRotateMesh.rotation.z = 0;
            } else {
                arrowFrontMesh.position.copy(center);
                arrowFrontMesh.position.z -= size.z/2;
                arrowFrontMesh.rotation.z = -Math.PI;
                arrowFrontMesh.position.x += 25;

                arrowRotateMesh.position.copy(center);
                arrowRotateMesh.position.x -= size.x/2;
                arrowRotateMesh.position.z -= size.z/2;
                arrowRotateMesh.rotation.z = Math.PI;
            }

            const xAxis = new THREE.Vector3(1, 0, 0);
            const dot2 = dir.dot(xAxis);
            const angle2 = Math.acos(dot2);
            
            const res2 = THREE.MathUtils.radToDeg(angle2);
            if(res2 > 90) {
                arrowLeftMesh.position.copy(center);
                arrowLeftMesh.position.y += 25;
                arrowLeftMesh.position.x += size.x/2;
                arrowLeftMesh.rotation.y = 0;
            } else {
                arrowLeftMesh.position.copy(center);
                arrowLeftMesh.position.y += 25;
                arrowLeftMesh.position.x -= size.x/2;
                arrowLeftMesh.rotation.y = -Math.PI;
            }
            
        });
          
        let initialMousePosition = new THREE.Vector2();
        let initialRotation = 0;

        let draggingX = false;
        let draggingY = false;
        let draggingZ = false;
        let rotating = false;
        renderer.domElement.addEventListener('mousedown', (e) => {
            const y = -((e.offsetY / window.innerHeight) * 2 - 1);
            const x = (e.offsetX / window.innerWidth) * 2 - 1;

            const rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

            const intersections = rayCaster.intersectObjects([
                arrowFrontMesh,
                arrowLeftMesh,
                arrowTopMesh,
                arrowRotateMesh
            ]);

            if(intersections.length) {
                draggingX = false;
                draggingY = false;
                draggingZ = false;
                rotating = false;
                switch(intersections[0].object.name) {
                    case 'arrowTop':
                        draggingY = true;
                        break;
                    case 'arrowFront':
                        draggingZ = true;
                        break;
                    case 'arrowLeft':
                        draggingX = true;
                        break;
                    case 'arrowRotate':
                        rotating = true;
                        initialMousePosition.set(x, y);
                        initialRotation = this.obj.rotation.y;
                        break;
                }
            }
        });

        renderer.domElement.addEventListener('mousemove', (e) => {
            const y = -((e.offsetY / window.innerHeight) * 2 - 1);
            const x = (e.offsetX / window.innerWidth) * 2 - 1;

            const rayCaster = new THREE.Raycaster();
            rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

            if(draggingX) {
                arrowFrontMesh.visible = false;
                arrowTopMesh.visible = false;
                arrowRotateMesh.visible = false;

                controls.enabled = false;
          
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.obj.position.y);

                const intersection = new THREE.Vector3();
                rayCaster.ray.intersectPlane(plane, intersection);
                
                this.obj.position.x = intersection.x;
            }

            if(draggingY) {
                arrowLeftMesh.visible = false;
                arrowFrontMesh.visible = false;
                arrowRotateMesh.visible = false;

                controls.enabled = false;

                const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -this.obj.position.x);
                
                const intersection = new THREE.Vector3();
                rayCaster.ray.intersectPlane(plane, intersection);
                
                this.obj.position.y = intersection.y;
            }

            if(draggingZ) {
                arrowLeftMesh.visible = false;
                arrowTopMesh.visible = false;
                arrowRotateMesh.visible = false;

                controls.enabled = false;

                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.obj.position.y);
                
                const intersection = new THREE.Vector3();
                rayCaster.ray.intersectPlane(plane, intersection);
                
                this.obj.position.z = intersection.z;
            }

            if(rotating) {
                arrowLeftMesh.visible = false;
                arrowFrontMesh.visible = false;
                arrowTopMesh.visible = false;

                controls.enabled = false;
                
                const deltaX = x - initialMousePosition.x;

                const s = 5.0;
                const rotationAngle = deltaX * s;
                
                this.obj.rotation.y = initialRotation + rotationAngle;
            }
        });

        renderer.domElement.addEventListener('mouseup', (e) => {
            draggingX = false;
            draggingY = false;
            draggingZ = false;
            rotating = false;

            arrowLeftMesh.visible = true;
            arrowFrontMesh.visible = true;
            arrowTopMesh.visible = true;
            arrowRotateMesh.visible = true;

            controls.enabled = true;
        });
    }

    detach() {
        this.obj = null;
    }
}

export default MyTransformControls;
