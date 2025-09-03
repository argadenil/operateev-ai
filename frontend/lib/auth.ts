// Simple auth utilities for frontend.
// In production consider httpOnly cookies and refresh tokens.

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('auth_token'); } catch { return null; }
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem('auth_token'); } catch {}
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
}
