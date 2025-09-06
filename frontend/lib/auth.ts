// Simple auth utilities for frontend.
// NOTE: For production you should move to httpOnly cookies + refresh tokens.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

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

// Logout helper: best-effort POST to backend, always clears token locally.
export async function logout(): Promise<{ ok: boolean; error?: string }> {
  const token = getToken();
  if (!token) {
    clearToken();
    return { ok: true };
  }
  try {
    const resp = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    clearToken();
    if (!resp.ok) {
      let msg = 'Logout failed';
      try { const data = await resp.json(); msg = data.error || msg; } catch {}
      return { ok: false, error: msg };
    }
    return { ok: true };
  } catch (e: unknown) {
    clearToken();
    const msg = e instanceof Error ? e.message : 'Network error';
    return { ok: false, error: msg };
  }
}
