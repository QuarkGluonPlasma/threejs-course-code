import { CameraOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useHouseStore } from "../../store";

function Header() {

    const { toggleShowPreview } = useHouseStore();

    return <div className="Header">
        <h1 className="logo">仿酷家乐装修编辑器</h1>

        <div className="btns">
            <Button type="primary" onClick={() => toggleShowPreview()}><CameraOutlined />渲染</Button>
        </div>
    </div>
}

export default Header;
