/**
 * 用户注册 API。开发环境通过 Vite 代理访问 localhost:3000；生产可设 VITE_API_BASE。
 */
function getApiBase() {
  const base = import.meta.env.VITE_API_BASE;
  if (base) {
    return String(base).replace(/\/$/, '');
  }
  return '/api';
}

/**
 * POST /user/register
 * @returns {Promise<{ id: number, username: string, createdAt: string }>}
 */
export async function registerUser(username, password) {
  const url = `${getApiBase()}/user/register`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const msg =
      data.message ||
      data.error ||
      (typeof data === 'string' ? data : null) ||
      `请求失败 (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
