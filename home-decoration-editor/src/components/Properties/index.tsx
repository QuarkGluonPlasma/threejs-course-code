import { useEffect, useState } from "react";
import { useHouseStore } from "../../store";
import { Form, Input, InputNumber, Slider } from "antd";
import { useForm } from "antd/es/form/Form";

function Properties() {

    const [right, setRight] = useState(0);

    const { data, curSelectedFurniture, updateFurniture } = useHouseStore();

    const [form] = useForm();

    useEffect(() => {
        form.setFieldsValue(curSelectedFurniture);
    }, [curSelectedFurniture, data]);

    function handleValuesChange() {
        const values  = form.getFieldsValue();
        updateFurniture(values.id, 'position', values.position);
        updateFurniture(values.id, 'rotation', values.rotation);
    }

    return <div className="Properties" style={{right: right}}>
        {/* <pre>
            {JSON.stringify(curSelectedFurniture, null, 4)}
        </pre> */}
        {
            curSelectedFurniture ? <div>
                <Form 
                    form={form}
                    initialValues={
                        curSelectedFurniture
                    } style={{
                        margin: 10
                    }} onKeyDown={(evt) => {
                        evt.stopPropagation();
                    }}
                    onValuesChange={handleValuesChange}
                >
                    <Form.Item label="ID" name='id'>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label="位置 x" name={["position", 'x']}>
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item label="位置 y" name={["position", 'y']}>
                        <InputNumber disabled/>
                    </Form.Item>
                    <Form.Item label="位置 z" name={["position", 'z']}>
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item label="角度 x" name={["rotation", 'x']}>
                        <Slider min={-Math.PI * 2} max={Math.PI * 2} disabled/>
                    </Form.Item>
                    <Form.Item label="角度 y" name={["rotation", 'y']}>
                        <Slider min={-Math.PI * 2} max={Math.PI * 2}/>
                    </Form.Item>
                    <Form.Item label="角度 z" name={["rotation", 'z']}>
                        <Slider min={-Math.PI * 2} max={Math.PI * 2} disabled/>
                    </Form.Item>
                </Form>
            </div> : null
        }
        <div className="drawer-bar" onClick={() => {
            setRight(right === 0 ? -240 : 0);
        }}></div>
    </div>
}

export default Properties;
