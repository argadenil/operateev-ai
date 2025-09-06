// Job Management API client utilities
// Integrates with backend /get-jobs/:customer_id endpoint.

import { authFetch } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export interface JobAPIShape {
  id: number;
  customer_id: string;
  name: string;
  description?: string;
  gpu: string;
  owner: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  duration?: string;
  priority: number;
  cpu_cores: number;
  memory_gb: number;
  gpu_memory_gb: number;
  created_at: string;
  updated_at: string;
}

export interface JobSummaryAPIShape {
  total: number;
  queued: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
}

export interface JobsResponseAPIShape {
  jobs: JobAPIShape[];
  summary: JobSummaryAPIShape;
  error?: string;
}

export async function fetchJobs(customerId: string, signal?: AbortSignal): Promise<JobsResponseAPIShape> {
  if (!customerId) {
    return { 
      jobs: [], 
      summary: { total: 0, queued: 0, running: 0, completed: 0, failed: 0, cancelled: 0 }, 
      error: 'customer_id is required' 
    };
  }
  
  const url = `${API_BASE}/get-jobs/${encodeURIComponent(customerId)}`;
  const resp = await authFetch(url, { method: 'GET', signal });
  const data = await resp.json().catch(() => ({}));
  
  if (!resp.ok) {
    return { 
      jobs: [], 
      summary: { total: 0, queued: 0, running: 0, completed: 0, failed: 0, cancelled: 0 }, 
      error: data.error || 'Failed to load jobs' 
    };
  }
  
  return data;
}

export function formatDuration(duration?: string): string {
  if (!duration) return 'N/A';
  return duration;
}

export function formatDateTime(dateTimeStr?: string): string {
  if (!dateTimeStr) return 'N/A';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  } catch {
    return dateTimeStr;
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'running':
      return 'text-blue-600';
    case 'completed':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    case 'cancelled':
      return 'text-gray-600';
    case 'queued':
      return 'text-yellow-600';
    default:
      return 'text-gray-500';
  }
}

export function getStatusIcon(status: string): string {
  switch (status.toLowerCase()) {
    case 'running':
      return '▶️';
    case 'completed':
      return '✅';
    case 'failed':
      return '❌';
    case 'cancelled':
      return '⏹️';
    case 'queued':
      return '⏳';
    default:
      return '❓';
  }
}
