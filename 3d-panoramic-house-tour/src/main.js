import './style.css';
import { rooms } from './data/rooms.js';
import { initThree } from './core/initThree.js';
import { enterRoom, getCurrentRoomIndex } from './panorama/enterRoom.js';
import { createRoomList } from './ui/createRoomList.js';
import { showLoading, hideLoading } from './ui/loading.js';

const { scene, camera, controls, startRenderLoop } = initThree();

startRenderLoop();

const roomListUi = createRoomList(rooms, (index) => {
  switchRoom(index);
});

async function switchRoom(index) {
  if (index === getCurrentRoomIndex()) return;

  const isFirstRoom = getCurrentRoomIndex() === -1;
  roomListUi.setLoading(true);
  if (isFirstRoom) showLoading();

  await enterRoom(scene, camera, controls, rooms[index], index);

  roomListUi.setActive(index);
  roomListUi.setLoading(false);
  if (isFirstRoom) hideLoading();
}

switchRoom(0);
