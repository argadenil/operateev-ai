// Dashboard API client utilities
// Integrates with backend /dashboard/:customer_id endpoint.
// Assumes customer id available via NEXT_PUBLIC_CUSTOMER_ID (fallback '1').

import { authFetch } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

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

// Super Admin Dashboard Types (matching backend models)
export interface AdminsStats {
  total: number;
  active: number;
  inactive: number;
}

export interface CustomersStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ClustersStats {
  total: number;
  active: number;
  idle: number;
}

export interface NodesStats {
  total: number;
  online: number;
  maintenance: number;
  offline: number;
}

export interface GpusStats {
  total: number;
  gpuList: string[];
}

export interface JobsStats {
  total: number;
  running: number;
  completed: number;
  failed: number;
  queued: number;
}

export interface UsedGPUsStats {
  total: number;
  inUse: number;
  available: number;
  reserved: number;
}

export interface FailedGPUsStats {
  total: number;
  hardwareFailures: number;
  softwareFailures: number;
  networkFailures: number;
  powerFailures: number;
}

export interface SuperAdminDashboardData {
  totalAdmins: AdminsStats;
  totalCustomers: CustomersStats;
  totalClusters: ClustersStats;
  totalNodes: NodesStats;
  totalGpus: GpusStats;
  totalJobs: JobsStats;
  usedGPUs: UsedGPUsStats;
  failedGPUs: FailedGPUsStats;
}

export interface SuperAdminDashboardResponse {
  status: string;
  dashboard: SuperAdminDashboardData;
  error?: string;
}

// Fetch Super Admin Dashboard
export async function fetchSuperAdminDashboard(signal?: AbortSignal): Promise<SuperAdminDashboardResponse> {
  const url = `${API_BASE}/api/dashboard/super-admins`;
  try {
    const resp = await authFetch(url, { method: 'GET', signal });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return {
        status: 'error',
        dashboard: getEmptyDashboardData(),
        error: data.error || 'Failed to load super admin dashboard'
      };
    }
    return data;
  } catch (error) {
    return {
      status: 'error',
      dashboard: getEmptyDashboardData(),
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

function getEmptyDashboardData(): SuperAdminDashboardData {
  return {
    totalAdmins: { total: 0, active: 0, inactive: 0 },
    totalCustomers: { total: 0, active: 0, inactive: 0 },
    totalClusters: { total: 0, active: 0, idle: 0 },
    totalNodes: { total: 0, online: 0, maintenance: 0, offline: 0 },
    totalGpus: { total: 0, gpuList: [] },
    totalJobs: { total: 0, running: 0, completed: 0, failed: 0, queued: 0 },
    usedGPUs: { total: 0, inUse: 0, available: 0, reserved: 0 },
    failedGPUs: { total: 0, hardwareFailures: 0, softwareFailures: 0, networkFailures: 0, powerFailures: 0 }
  };
}
