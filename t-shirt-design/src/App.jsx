import { useEffect, useRef, useState } from 'react';
import { init } from './3d-init'
import './App.scss'
import { Button, ColorPicker } from 'antd';
import { Radio } from 'antd';

function App() {

  const changeTShirtColorRef = useRef();
  const changeTextureRef = useRef();
  const downloadImgRef = useRef();
  const downloadVideoRef = useRef();

  useEffect(() => {
    const dom = document.getElementById('content');
    const { scene,changeTShirtColor, changeTexture, downloadImg, downloadVideo } = init(dom);
    
    changeTShirtColorRef.current = changeTShirtColor;
    downloadImgRef.current = downloadImg;
    downloadVideoRef.current = downloadVideo;
    changeTextureRef.current = changeTexture;

    return () => {
      dom.innerHTML = '';
    }
  }, []);

  return <div>
    <div id="main">
      <div id="content">
      </div>
      <div id="operate">
        <div className='ope-item'>
          <div>颜色</div>
          <div>
            <ColorPicker defaultValue={'#ffffff'} onChange={(color) => {
              changeTShirtColorRef.current(color.toRgbString());
            }}/>
          </div>
        </div>
        <div className='ope-item'>
          <div>图案</div>
          <div>
            <Radio.Group onChange={e => {
              changeTextureRef.current(e.target.value);
            }}>
              <Radio value={'./xiaoxin.png'}>小新</Radio>
              <Radio value={'./heart.png'}>爱心</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='ope-item'>
          <Button type='primary' onClick={() => downloadImgRef.current()}>保存为图片</Button>
          <Button type='default' onClick={() => downloadVideoRef.current()}>保存为视频</Button>
        </div>
      </div>
    </div>
  </div>
}

export default App
