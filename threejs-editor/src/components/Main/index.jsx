import { useEffect, useRef } from "react";
import { init } from "./init";
import { MeshTypes, useThreeStore } from "../../store";
import * as THREE from 'three';
import { FloatButton } from "antd";
import { ArrowsAltOutlined, DragOutlined, RetweetOutlined } from "@ant-design/icons";

function Main() {
    const { selectedObjName, setScene, data, addMesh, selectedObj, setSelectedObj, removeMesh, updateMeshInfo } = useThreeStore();

    const sceneRef = useRef();
    const transformControlsModeRef = useRef();
    const transformControlsAttachObjRef = useRef();

    function onSelected(obj) {
        setSelectedObj(obj);
    }

    useEffect(() => {
        if(selectedObjName) {
            const obj = sceneRef.current.getObjectByName(selectedObjName);
            setSelectedObj(obj);
            transformControlsAttachObjRef.current(obj);
        }
    }, [selectedObjName]);

    useEffect(() => {
        function handleKeydown(e) {
            if(e.key === 'Backspace') {
                if(selectedObj) {
                    transformControlsAttachObjRef.current(null);
                    sceneRef.current.remove(selectedObj);
                    removeMesh(selectedObj.name);
                }
            }
        }
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        }
    }, [selectedObj]);

    useEffect(() => {
        const dom = document.getElementById('threejs-container');
        const { scene, setTransformControlsMode, transformControlsAttachObj } = init(dom, data, onSelected, updateMeshInfo);

        sceneRef.current = scene;
        transformControlsModeRef.current = setTransformControlsMode;
        transformControlsAttachObjRef.current = transformControlsAttachObj;

        const tree = scene.children.map(item => {
            if(item.isTransformControlsRoot) {
                return null;
            }

            return {
                title: item.isMesh ?  item.geometry.type : item.type,
                key: item.type + item.name + item.id,
                name: item.name
            }
        }).filter(item => item !== null);

        setScene(tree);
        return () => {
          dom.innerHTML = '';
        }
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;

        data.meshArr.forEach(item => {
            if(item.type === MeshTypes.Box) {
                const { width, height, depth, material: { color }, position,scale,rotation} = item.props;
                let mesh = scene.getObjectByName(item.name);

                if(!mesh) {
                    const geometry = new THREE.BoxGeometry(width, height, depth);
                    const material = new THREE.MeshPhongMaterial({
                        color
                    });
                    mesh = new THREE.Mesh(geometry, material);
                }    
    
                mesh.name = item.name;
                mesh.position.copy(position)
                mesh.scale.copy(scale)
                mesh.rotation.x = rotation.x;
                mesh.rotation.y = rotation.y;
                mesh.rotation.z = rotation.z;

                mesh.material.color = new THREE.Color(color);
                scene.add(mesh);
            } else if(item.type === MeshTypes.Cylinder) {
                const { radiusTop, radiusBottom, height, material: { color }, position,scale,rotation} = item.props;
                let mesh = scene.getObjectByName(item.name);

                if(!mesh) {
                    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
                    const material = new THREE.MeshPhongMaterial({
                        color
                    });
                    mesh = new THREE.Mesh(geometry, material);
                }
                mesh.name = item.name;
                mesh.position.copy(position)
                mesh.scale.copy(scale)
                mesh.rotation.x = rotation.x;
                mesh.rotation.y = rotation.y;
                mesh.rotation.z = rotation.z;

                mesh.material.color = new THREE.Color(color);

                scene.add(mesh);
            }
        })
        
        const tree = scene.children.map(item => {
            if(item.isTransformControlsRoot) {
                return null;
            }

            return {
                title: item.isMesh ?  item.geometry.type : item.type,
                key: item.type + item.name + item.id,
                name: item.name
            }
        }).filter(item => item !== null);

        setScene(tree);
    }, [data]);

    function setMode(mode) {
        transformControlsModeRef.current(mode);
    }
    
    return <div className="Main">
        <div id="threejs-container"></div>
        <FloatButton.Group className="btn-group">
            <FloatButton icon={<DragOutlined />} onClick={() => setMode('translate')}/>
            <FloatButton icon={<RetweetOutlined />} onClick={() => setMode('rotate')}/>
            <FloatButton icon={<ArrowsAltOutlined />} onClick={() => setMode('scale')}/>
        </FloatButton.Group>
    </div>
}

export default Main;
