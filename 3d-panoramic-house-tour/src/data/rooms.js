const FACE_SUFFIXES = ['l', 'r', 'u', 'd', 'b', 'f'];

export function getRoomMaterialSrc(roomId) {
  return FACE_SUFFIXES.map((face) => `/img/${roomId}/1_${face}.jpg`);
}

export const rooms = [
  {
    materialSrc: getRoomMaterialSrc('01'),
    name: '客厅',
  },
  {
    materialSrc: getRoomMaterialSrc('02'),
    name: '餐厅',
  },
  {
    materialSrc: getRoomMaterialSrc('03'),
    name: '阳台',
  },
];
