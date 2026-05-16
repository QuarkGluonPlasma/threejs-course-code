let el;

export function showLoading() {
  if (!el) {
    el = document.createElement('div');
    el.className = 'loading';
    el.textContent = '加载中…';
    document.body.appendChild(el);
  }
  el.hidden = false;
}

export function hideLoading() {
  if (el) {
    el.hidden = true;
  }
}
