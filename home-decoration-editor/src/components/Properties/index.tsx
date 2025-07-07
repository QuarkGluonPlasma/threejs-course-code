import { useState } from "react";
import { useHouseStore } from "../../store";

function Properties() {

    const [right, setRight] = useState(0);

    const { data } = useHouseStore();

    return <div className="Properties" style={{right: right}}>
        <pre>
            {JSON.stringify(data.furnitures, null, 4)}
        </pre>
        <div className="drawer-bar" onClick={() => {
            setRight(right === 0 ? -300 : 0);
        }}></div>
    </div>
}

export default Properties;
