import { ColorPicker, Form, Input } from "antd";
import { useThreeStore } from "../../store";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";

function Info() {

    const { selectedObj, updateMaterial } = useThreeStore();

    function handleValuesChange(changeValues) {
        const colorStr = changeValues.color.toHexString();

        updateMaterial(selectedObj.name, {
            color: colorStr
        });
    }
    const [form] = useForm();
    
    useEffect(() => {
        if(selectedObj?.isMesh) {
            form.setFieldValue('color', selectedObj.material.color.getHexString())
        }
    }, [selectedObj]);

    return <div className='Info' style={{margin: 20}}>
        { selectedObj?.isMesh ?
            <Form
                form={form}
                initialValues={{
                    color: selectedObj.material.color.getHexString()
                }}
                onValuesChange={handleValuesChange}
            >
                <Form.Item label="材质颜色" name="color">
                    <ColorPicker/>
                </Form.Item>
            </Form>
            : null
        }
    </div>
}

export default Info;