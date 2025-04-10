import { useEffect, useRef, useState } from 'react';
import { init } from './3d-init'
import './App.css'

function App() {

  const jumpRef = useRef(() => {});

  const [str, setStr] = useState('');

  useEffect(() => {
    const dom = document.getElementById('content');
    const { jump } = init(dom, setStr);

    jumpRef.current = jump;
  
    return () => {
      dom.innerHTML = '';
    }
  }, []);

  return <div>
    <div id="header">
      React 和 Three.js 集成测试
    </div>
    <div id="main">
      <div id="content">
      </div>
      <div id="operate">
        <button onClick={()=> {jumpRef.current('red')}}>红色</button>
        <button onClick={()=> {jumpRef.current('green')}}>绿色</button>
        <button onClick={()=> {jumpRef.current('blue')}}>蓝色</button>
        <div>
          {str}
        </div>
      </div>
    </div>
  </div>
}

export default App
