import { useEffect, useRef, useState } from 'react';
import { init } from './3d-init'
import './App.css'

function App() {

  useEffect(() => {
    const dom = document.getElementById('content');
    const { scene } = init(dom);
  
    return () => {
      dom.innerHTML = '';
    }
  }, []);

  return <div>
    <div id="main">
      <div id="content">
      </div>
      <div className='section section1'>
        <h1>神说要有光</h1>
      </div>
      <div className='section section2'>
        <h1>于是就有了光</h1>
      </div>
      <div className='section section3'>
        <h1>你相信光吗？</h1>
      </div>
      <div className='section section4'>
        <h1>鱼儿游啊游</h1>
      </div>
      <div className='section section5'>
        <h1>跳舞ing</h1>
      </div>
      <div className='section section6'>
      </div>
      <div className='section section7'>
      </div>
      <div className='section section8'>
        <h1>页面尾部</h1>
      </div>
    </div>
  </div>
}

export default App