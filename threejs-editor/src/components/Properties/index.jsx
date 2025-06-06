import { useEffect, useState } from "react";
import { useThreeStore } from "../../store";
import { Segmented, Tree } from "antd";
import Info from "./Info";
import MonacoEditor from '@monaco-editor/react'

function Properties() {
    const { setSelectedObjName, selectedObj, data, scene } = useThreeStore();

    const [treeData, setTreeData] = useState();
    useEffect(() => {
        if(scene) {
            setTreeData([
                {
                    title: 'Scene',
                    key: 'root',
                    children: scene
                }
            ]);
        }
    }, [scene]);

    function handleSelect(selectKeys, info) {
        const name = info.node.name;
        
        setSelectedObjName(name);
    }

    const [key, setKey] = useState('属性');

    return <div className="Properties">
        <Segmented value={key} onChange={setKey} block options={['属性', 'json']} />
        {
            key === '属性' ? <div>
                <Tree treeData={treeData} expandedKeys={['root']} onSelect={handleSelect}/>
                <Info/>
            </div> : null
        }
        { key === 'json' ? 
            // <pre>
            //     {JSON.stringify(data, null, 2)}
            // </pre>: null
            <MonacoEditor
                height={'90%'}
                path='code.json'
                language='json'
                value={JSON.stringify(data, null, 2)}
            /> : null
        }
    </div>
}

export default Properties;