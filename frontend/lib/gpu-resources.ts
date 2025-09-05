// GPU Resources API client utilities
// Integrates with backend /gpu-resources/:customer_id endpoint.

import { authFetch } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:10000';

export interface GPUResourceAPIShape {
  id: number;
  customer_id: string;
  model: string;
  memory_gb: number;
  memory_used_gb: number;
  cluster: string;
  status: 'available' | 'allocated' | 'offline' | string;
  utilization: number;
  temperature_c: number;
  power_w: number;
  uptime_sec: number;
}

export interface GPUResourcesSummaryAPIShape {
  total: number;
  available: number;
  allocated: number;
  offline: number;
  avg_utilization: number;
  allocation_rate: number;
}

export interface GPUResourcesResponseAPIShape {
  gpus: GPUResourceAPIShape[];
  summary: GPUResourcesSummaryAPIShape;
  error?: string;
}

export async function fetchGPUResources(customerId: string, signal?: AbortSignal): Promise<GPUResourcesResponseAPIShape> {
  if (!customerId) {
    return { gpus: [], summary: { total: 0, available: 0, allocated: 0, offline: 0, avg_utilization: 0, allocation_rate: 0 }, error: 'customer_id is required' };
  }
  const url = `${API_BASE}/gpu-resources/${encodeURIComponent(customerId)}`;
  const resp = await authFetch(url, { method: 'GET', signal });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return { gpus: [], summary: { total: 0, available: 0, allocated: 0, offline: 0, avg_utilization: 0, allocation_rate: 0 }, error: data.error || 'Failed to load GPU resources' };
  }
  return data;
}

export function formatMemory(totalGB: number, usedGB: number): string {
  if (!totalGB) return '0 GB';
  return `${usedGB} / ${totalGB} GB`;
}

export function secondsToPretty(sec: number): string {
  if (sec < 60) return `${sec}s`; const m = Math.floor(sec / 60); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); if (h < 24) return `${h}h`; const d = Math.floor(h / 24); return `${d}d ${h % 24}h`;
}
