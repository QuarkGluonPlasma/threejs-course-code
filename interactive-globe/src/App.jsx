import { useEffect, useRef, useState } from 'react';
import { init } from './3d-init'
import './App.css'
import { loadPromise } from './mesh';

function App() {

  const focusCountryRef = useRef(() => {});

  useEffect(() => {
    const dom = document.getElementById('content');
    const { scene, focusCountry } = init(dom);

    focusCountryRef.current = focusCountry;
  
    return () => {
      dom.innerHTML = '';
    }
  }, []);

  const [countryList, setCountryList] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    loadPromise.then(geojson => {
      const list = geojson.features.map(feature => {
        return feature.properties.name_zh;
      });
      setCountryList(list.filter(item => {
        return  item.includes(filterText)
      }));
    });

  }, [filterText]);

  return <div>
    <div id="main">
      <div id="content">
      </div>
      <div id="panel">
        <div className='searchbox'>
          <input placeholder='输入文本搜索国家' value={filterText} onChange={e => setFilterText(e.target.value)}/>
        </div>
        <div className='country-list'>
          {
            countryList.map(item => {
              return <div className='item' key={item} onClick={() => {
                focusCountryRef.current(item);
              }}>{item}</div>
            })
          }
        </div>
      </div>
    </div>
  </div>
}

export default App