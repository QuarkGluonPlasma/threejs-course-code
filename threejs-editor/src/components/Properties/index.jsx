import { useEffect, useState } from "react";
import { useThreeStore } from "../../store";
import { Tree } from "antd";

function Properties() {
    const { setSelectedObjName, selectedObj, data, scene } = useThreeStore();

    const [treeData, setTreeData] = useState();
    useEffect(() => {
        if(scene?.children) {
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

            setTreeData([
                {
                    title: 'Scene',
                    key: 'root',
                    children: tree
                }
            ]);
        }
    }, [scene]);

    function handleSelect(selectKeys, info) {
        const name = info.node.name;
        
        setSelectedObjName(name);
    }

    return <div className="Properties">
        <Tree treeData={treeData} expandedKeys={['root']} onSelect={handleSelect}/>
        {/* <div>selectedObj: {selectedObj?.name}</div>
        <pre>
        {JSON.stringify(data, null, 2)}
        </pre> */}
    </div>
}

export default Properties;