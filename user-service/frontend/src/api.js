const BASE = '/api/users';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON error pages are reported through the status code below.
  }
  if (!res.ok) {
    const err = new Error(data?.message || `The server returned ${res.status}`);
    err.status = res.status;
    // GlobalExceptionHandler returns a plain { field: message } map for validation errors.
    err.fields = res.status === 400 && data && !data.status ? data : null;
    throw err;
  }
  return data;
}

export const listUsers = () => request('');
export const getUser = (id) => request(`/${id}`);
export const createUser = (body) => request('', { method: 'POST', body });
export const updateUser = (id, body) => request(`/${id}`, { method: 'PUT', body });
export const deleteUser = (id) => request(`/${id}`, { method: 'DELETE' });
