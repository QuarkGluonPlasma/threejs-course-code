export function createRoomList(rooms, onSelect) {
  const roomList = document.createElement('div');
  roomList.className = 'room-list';

  const items = rooms.map(({ name }, index) => {
    const roomItem = document.createElement('div');
    roomItem.innerText = name;
    roomItem.className = 'room-item';
    roomItem.onclick = () => onSelect(index);
    roomList.appendChild(roomItem);
    return roomItem;
  });

  document.body.appendChild(roomList);

  return {
    setActive(index) {
      items.forEach((el, i) => {
        el.classList.toggle('room-item--active', i === index);
      });
    },
    setLoading(isLoading) {
      roomList.classList.toggle('room-list--loading', isLoading);
      items.forEach((el) => {
        el.style.pointerEvents = isLoading ? 'none' : '';
      });
    },
  };
}
