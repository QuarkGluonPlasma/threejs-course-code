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
        <h1>太阳系科普网站</h1>
      </div>
      <div className='section section2'>
        <h1>太阳</h1>
        <p>
        位于太阳系中心，是一颗黄矮星，占太阳系总质量的99.86%，通过氢核聚变产生能量，其发出的光和热是地球上生命存在的关键
        </p>
      </div>
      <div className='section section3'>
        <h1>水星</h1>
        <p>太阳系中最小、最靠近太阳的行星，表面布满撞击坑，自转周期缓慢，没有大气层，温度昼夜温差极大。</p>
      </div>
      <div className='section section4'>
        <h1>金星</h1>
        <p>离太阳第二近的行星，大气以二氧化碳为主，温室效应极强，表面温度极高，充满火山口、峡谷和平原，因云层遮挡，地面特征难以观测。</p>
      </div>
      <div className='section section5'>
        <h1>地球</h1>
        <p>目前唯一已知存在生命的行星，表面70%被海洋覆盖，有适宜生命生存的大气层，自转轴倾角带来四季变化，拥有月球这一天然卫星。</p>
      </div>
      <div className='section section6'>
        <h1>火星</h1>
        <p>表面为红色沙漠，有稀薄大气层，曾有液态水存在的证据，是人类太空移民的目标星球，有两颗小型卫星，拥有太阳系最大的奥林帕斯火山。</p>
      </div>
      <div className='section section7'>
        <h1>木星</h1>
        <p>太阳系中最大的行星，质量是地球的318倍，表面有大红斑，是一个长期存在的大型风暴，卫星数量至少79颗，内部为液态金属氢，大气层以氢氨为主。</p>
      </div>
      <div className='section section8'>
        <h1>土星</h1>
        <p>以美丽的光环闻名，光环由冰晶和碎块组成，约有140颗天然卫星，内部结构与木星相似，是离太阳第六远的行星，密度低，甚至比水还轻。</p>
      </div>
      <div className='section section9'>
        <h1>天王星</h1>
        <p>是离太阳第七远的行星，有13层环，至少27颗天然卫星，大气含蓝色的甲烷，表面温度极低，是太阳系唯一一颗躺着自转的行星，自转轴和公转轨道非常倾斜。</p>
      </div>
      <div className='section section10'>
        <h1>海王星</h1>
        <p>离太阳第八远的行星，大气中存在太阳系最强级别的超级风暴，环系统较暗淡，有至少14颗天然卫星，大气以氢氦为主，表面温度极低，轨道离太阳约30个天文单位。</p>
      </div>
    </div>
  </div>
}

export default App
