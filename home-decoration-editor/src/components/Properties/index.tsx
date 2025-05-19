import { useState } from "react";

function Properties() {

    const [right, setRight] = useState(0);

    return <div className="Properties" style={{right: right}}>
        Properties
        <div className="drawer-bar" onClick={() => {
            setRight(right === 0 ? -300 : 0);
        }}></div>
    </div>
}

export default Properties;
