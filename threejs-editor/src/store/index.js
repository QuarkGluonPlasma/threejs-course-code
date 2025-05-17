import { create } from "zustand";

function createBox() {
    const newId = Math.random().toString().slice(2, 8);
    return {
        id: newId,
        type: 'Box',
        name: 'Box' + newId,
        props: {
            width: 200,
            height: 200,
            depth: 200,
            material: {
                color: 'orange',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 1,
                y: 1,
                z: 1
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
}

function createCylinder() {
    const newId = Math.random().toString().slice(2, 8);
    return {
        id: newId,
        type: 'Cylinder',
        name: 'Cylinder' + newId,
        props: {
            radiusTop: 200,
            radiusBottom: 200,
            height: 300,
            material: {
                color: 'orange',
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: {
                x: 1,
                y: 1,
                z: 1
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    }
}

const useThreeStore = create((set, get) => {
    return {
        data: {
            meshArr: [

            ]
        },
        scene: null,
        setScene(obj) {
            set({
                scene: obj
            })
        },
        selectedObj: null,
        setSelectedObj(obj) {
            set({
                selectedObj: obj
            })
        },
        selectedObjName: null,
        setSelectedObjName(name) {
            set({
                selectedObjName: name
            })
        },
        removeMesh(name) {
            set(state => {
                return {
                    data: {
                        ...state.data,
                        meshArr: state.data.meshArr.filter(mesh => {
                            return mesh.name !== name
                        })
                    }
                }
            })
        },
        addMesh(type) {
            function addItem(creator) {
                set(state => {
                    return {
                        data: {
                            ...state.data,
                            meshArr: [
                                ...state.data.meshArr,
                                creator()
                            ]
                        }
                    }
                })
            }
            if(type === 'Box') {
                addItem(createBox);
            } else if(type === 'Cylinder') {
                addItem(createCylinder);
            }
        },
        updateMeshInfo(name, info, type) {
            set(state => {
                return {
                    data: {
                        ...state.data,
                        meshArr: state.data.meshArr.map(mesh => {
                            if(mesh.name === name) {
                                if(type === 'position') {
                                    mesh.props.position = info;
                                } else if(type === 'scale') {
                                    mesh.props.scale = info;
                                } else if(type === 'rotation') {
                                    mesh.props.rotation = {
                                        x: info.x,
                                        y: info.y,
                                        z: info.z
                                    }
                                }
                            }
                            return mesh;
                        })
                    }
                }
            })
        }
    }
});

const MeshTypes = {
    Box: 'Box',
    Cylinder: 'Cylinder'
}

export {
    useThreeStore,
    MeshTypes
}