/**
 * 用户登录 API。与 register 共用 Vite 代理 /api → localhost:3000。
 */
function getApiBase() {
  const base = import.meta.env.VITE_API_BASE;
  if (base) {
    return String(base).replace(/\/$/, '');
  }
  return '/api';
}

/**
 * POST /user/login
 * @returns {Promise<{ accessToken: string, user: { id: number, username: string } }>}
 */
export async function loginUser(username, password) {
  const url = `${getApiBase()}/user/login`;
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
