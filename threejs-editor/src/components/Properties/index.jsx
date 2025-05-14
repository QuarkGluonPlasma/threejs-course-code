import { useThreeStore } from "../../store";

function Properties() {
    const { selectedObj, data } = useThreeStore();
        
    return <div className="Properties">
        <div>selectedObj: {selectedObj?.name}</div>
        <pre>
        {JSON.stringify(data, null, 2)}
        </pre>
    </div>
}

export default Properties;