import { create, type StateCreator } from "zustand";
import data from "./house2";
import type { Vector3 } from "three";
import { persist } from "zustand/middleware";

interface Wall {
    position: { x: number, y: number, z: number},
    width: number,
    height: number,
    depth: number,
    rotationY?: number,
    normal: {x: number, y: number, z: number},
    windows: Array<{
        leftBottomPosition: {
            left: number,
            bottom: number
        },
        width: number,
        height: number
    }>,
    doors?: Array<{
        leftBottomPosition: {
            left: number,
            bottom: number
        },
        width: number,
        height: number
    }>
}

interface Floor {
    points: Array<{
        x: number,
        z: number
    }>,
    textureUrl?: string,
    name?: string,
    size?: number
}

interface Ceiling {
    points: Array<{
        x: number,
        z: number
    }>,
    height: number
}

interface Furniture {
    id: string,
    modelUrl: string,
    modelScale?: number;
    position: {
        x: number,
        y: number,
        z: number
    },
    rotation: {
        x: number,
        y: number,
        z: number
    }
}

export interface State {
    data: {
        walls: Array<Wall>,
        floors: Array<Floor>,
        ceilings: Array<Ceiling>,
        furnitures: Array<Furniture>
    }
}

export interface Action {
    setData(data: State['data']): void;
    updateFurniture(id: string, type: 'position' | 'rotation', info: Vector3): void;
    addFurniture(furniture: Furniture): void;
}

const stateCreator: StateCreator<State & Action> = (set, get) => {
    return {
        data: data,
        setData(data) {
            set(state => {
                return {
                    ...state,
                    data: data
                }
            })
        },
        updateFurniture(id, type, info) {
            set(state => {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        furnitures: state.data.furnitures.map(item => {
                            if(item.id === id) {
                                if(type === 'position') {
                                    item.position.x = info.x;
                                    item.position.y = info.y;
                                    item.position.z = info.z;
                                } else {
                                    item.rotation.x = info.x;
                                    item.rotation.y = info.y;
                                    item.rotation.z = info.z;
                                }
                            }
                            return item;
                        })
                    }
                }
            })
        },
        addFurniture(furniture) {
            set(state => {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        furnitures: [
                            ...state.data.furnitures,
                            furniture
                        ]
                    }
                }
            })
        }
    }
};

const useHouseStore = create<State & Action>()(persist(stateCreator, {
    name: 'house'
}));

export {
    useHouseStore
}