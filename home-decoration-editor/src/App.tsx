import './App.scss'
import Header from './components/Header';
import Menu from './components/Menu';
import Main from './components/Main';
import Properties from './components/Properties';

function App() {
  return <div className='wrap'>
    <Header />
    <div className='editor'>
      <Menu/>
      <Main/>
      <Properties/>
    </div>
  </div>
}

export default App