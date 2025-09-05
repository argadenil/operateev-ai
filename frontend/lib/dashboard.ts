// Dashboard API client utilities
// Integrates with backend /dashboard/:customer_id endpoint.
// Assumes customer id available via NEXT_PUBLIC_CUSTOMER_ID (fallback '1').

import { authFetch } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://operateev-ai-backend.onrender.com';

// Raw shapes from backend
export interface DashboardAPIResource {
  id: number;
  gpu: string;
  memory_gb: number;
  cluster: string;
  status: string; // e.g. running | idle | stopped
  uptime_sec: number;
  temperature_c: number;
  power_w: number;
  processes: number;
}

export interface DashboardAPISummary {
  total: number;
  running: number;
  idle: number;
  avg_power: number;
}

export interface DashboardAPIResponse {
  resources: DashboardAPIResource[];
  summary: DashboardAPISummary;
  error?: string;
}

export async function fetchDashboard(customerId: string, signal?: AbortSignal): Promise<DashboardAPIResponse> {
  // Guard: require a non-empty customerId; mimic backend 400 response shape
  if (!customerId) {
    return { resources: [], summary: { total: 0, running: 0, idle: 0, avg_power: 0 }, error: 'customer_id is required' };
  }
  const url = `${API_BASE}/dashboard/${encodeURIComponent(customerId)}`;
  const resp = await authFetch(url, { method: 'GET', signal });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return { resources: [], summary: { total: 0, running: 0, idle: 0, avg_power: 0 }, error: data.error || 'Failed to load dashboard' };
  }
  return data;
}

export function secondsToH(uptimeSec: number): string {
  if (!uptimeSec || uptimeSec < 60) return `${uptimeSec || 0}s`;
  const hours = Math.floor(uptimeSec / 3600);
  if (hours < 1) return `${Math.floor(uptimeSec / 60)}m`;
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

export function capitalizeStatus(s: string): string {
  if (!s) return 'Unknown';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
