import './App.scss'
import Header from './components/Header';
import Menu from './components/Menu';
import Main, { getGLTFLoader } from './components/Main';
import Properties from './components/Properties';
import { useEffect, useState } from 'react';
import type { GLTF } from 'three/examples/jsm/Addons.js';
import { Progress } from 'antd';
import Preview from './components/Preview';
import { useHouseStore } from './store';

const gltfLoader = getGLTFLoader();

export const modelMap: Record<string, Promise<GLTF>> = {}

function App() {
  const [modelLoaded, setModelLoaded] = useState(false);

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const percentArr = [0, 0, 0, 0];
    ['./bed.glb', './dining-table.glb', './door.glb', './window.glb'].forEach((modelUrl, index) => {
      modelMap[modelUrl] = gltfLoader.loadAsync(modelUrl, (event) => {
        const per = event.loaded / event.total;
        percentArr[index] = per;

        let total = 0;
        percentArr.forEach(item => {
          total += item;
        });
        setPercent(Math.floor(total / 4 * 100));
      });
    })
  }, []);

  useEffect(() => {
    Promise.all(Object.values(modelMap)).then(() => {
      setModelLoaded(true);
    })
  }, []);

  const { showPreview } = useHouseStore();

  return <div>
      {
        modelLoaded ? 
          <div className='wrap'>
            <Header />
            <div className='editor'>
              <Menu/>
              <Main/>
              <Properties/>
            </div>
            <Preview close={!showPreview}/>
          </div>
          : <div id="loading">
              <p>loading...</p>
              <Progress
                percent={percent}
                style={{width:500}}
                percentPosition={{ align: 'start', type: 'inner' }}
                size={[500, 30]}
                strokeColor="#B7EB8F"
              />
          </div>
      }
    </div>
}

export default App;
