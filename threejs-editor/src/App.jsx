import './App.scss'
import Menu from './components/Menu';
import Main from './components/Main';
import Properties from './components/Properties';
import { MeshTypes, useThreeStore } from './store';
import { useEffect } from 'react';

function App() {
  
  const { data, addMesh } = useThreeStore();

  // useEffect(()=> {
  //   setTimeout(() => {
  //     addMesh(MeshTypes.Box);
  //   }, 2000);
  // }, [])

  return <div className='wrap'>
    {/* <pre>
      {JSON.stringify(data, null, 2)}
    </pre> */}
    <Menu />
    <div className='editor'>
      <Main/>
      <Properties/>
    </div>
  </div>
}

export default App