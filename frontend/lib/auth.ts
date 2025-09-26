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

// Clear all locally stored auth/session data
export function clearAuthData() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('customer_id');
    localStorage.removeItem('username');
  } catch {}
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
  // Capture token for backend notification, but make the UX instant by clearing local state first.
  const token = getToken();
  clearAuthData();

  // Fire-and-forget best-effort server notification; do not block navigation.
  try {
    if (token && API_BASE) {
  // keepalive helps when navigating away right after calling fetch
  fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Ignore network errors; local logout already completed
  }

  return { ok: true };
}
