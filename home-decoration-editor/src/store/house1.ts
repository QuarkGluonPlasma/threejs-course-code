import type { State } from ".";

const data: State['data'] = {
    walls: [
        {
            position: { x: 5000, y: 0, z: 200},
            width: 5000,
            height:3000,
            depth: 200,
            rotationY: Math.PI,
            normal: { x: 0, y: 0, z: 1},
            windows: []
        },
        {
            position: { x: 0, y: 0, z: 7000},
            width: 5000,
            height: 3000,
            depth: 200,
            normal: { x: 0, y: 0, z: -1},
            windows: []
        },
        {
            position: { x: 0, y: 0, z: 0},
            width: 7200,
            height: 3000,
            depth: 200,
            rotationY: -Math.PI / 2,
            normal: { x: 1, y: 0, z: 0},
            windows: [
                    {
                        leftBottomPosition: {
                            left: 2867,
                            bottom: 900
                        },
                        width: 2100,
                        height: 1620
                    }
            ]
        },
        {
            position: { x: 4800, y: 0, z: 7000},
            width: 7000,
            height: 3000,
            depth: 200,
            rotationY: Math.PI / 2,
            normal: { x: -1, y: 0, z: 0},
            windows: [],
            doors: [
                {
                    leftBottomPosition: {
                        left: 6084,
                        bottom: 0
                    },
                    width: 856,
                    height: 2152
                }
            ]
        },
    ],
    floors: [
        {
            points: [
                { x: 0, z: 0},
                { x: 0, z: 6800},
                { x: 4800, z: 6800},
                { x: 4800, z: 0},
                { x: 0, z: 0 }
            ],
            name: '主卧',
            size: 35
        }
    ],
    ceilings: [
        {
            points: [
                { x: 0, z: 0},
                { x: 0, z: 7000},
                { x: 5000, z: 7000},
                { x: 5000, z: 0},
                { x: 0, z: 0 }
            ],
            height: 3000
        }
    ],
    furnitures: [
        // {
        //     id: '111',
        //     modelUrl: './dining-table.glb',
        //     position: {
        //         x: 1500,
        //         y: 0,
        //         z: 3000
        //     },
        //     rotation: {
        //         x: 0,
        //         y: Math.PI / 2,
        //         z: 0
        //     }
        // }
    ]
};

export default data;