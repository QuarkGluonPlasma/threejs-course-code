import { useEffect, useRef, useState } from 'react';
import { init } from './3d-init'
import './App.css'
import gsap from 'gsap';

function App() {

  const cameraRef = useRef();

  useEffect(() => {
    const dom = document.getElementById('content');
    const { scene,camera } = init(dom);
    
    cameraRef.current = camera;
  
    return () => {
      dom.innerHTML = '';
    }
  }, []);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const camera = cameraRef.current;
  
    const ele = document.querySelector('.app');
    const handler = () => {
      setOpen(true);
      // camera.position.set(500, 100, 0);

      gsap.to(camera.position, {
        x: 500,
        y: 100,
        z: 0,
        duration: 1
      });
      
    };
    ele.addEventListener('click', handler)

    return () => {
      ele.removeEventListener('click', handler);
    }
  }, []);

  return <div>
    <div id="main">
      <div id="content">
      </div>
      <div id="desktop" style={{display: 'none'}}>
        <img className="bg" src="./bg.png"/>
        <div className='app'>
          <div className='logo'></div>
          <div className='name'>浏览器</div>
        </div>
        <iframe className='browser' style={{display: open ? 'block' : 'none'}} src='https://sogou.com/'/>
      </div>
    </div>
  </div>
}

export default App