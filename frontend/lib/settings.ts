// Settings API client utilities
// Integrates with backend /settings/:customer_id endpoints.

import { authFetch } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

// Types aligned with backend models
export interface SettingsProfile { full_name: string; email: string; phone: string }
export interface SettingsPreferences { dark_mode: boolean; enable_animations: boolean; auto_refresh: boolean; compact_table: boolean }
export interface SettingsNotifications { email: boolean; push: boolean; sms: boolean; system: boolean }
export interface SettingsSecurity { two_fa_enabled: boolean; password_hint?: string }
export interface SettingsIntegrations { slack_enabled: boolean }
export interface SettingsPrivacy { analytics: boolean; data_sharing: boolean; allow_export: boolean; allow_deletion: boolean }
export interface SettingsWorkspace { name: string; public: boolean; guest_access: boolean }
export interface SettingsStorage { auto_backup: boolean; cloud_sync: boolean }
export interface SettingsAdvanced { developer_mode: boolean; beta_features: boolean; debug_mode: boolean; performance_monitoring: boolean; session_timeout_min: number }

export interface SettingsShape {
  profile: SettingsProfile;
  preferences: SettingsPreferences;
  notifications: SettingsNotifications;
  security: SettingsSecurity;
  integrations: SettingsIntegrations;
  privacy: SettingsPrivacy;
  workspace: SettingsWorkspace;
  storage: SettingsStorage;
  advanced: SettingsAdvanced;
}

export interface GetSettingsResponse {
  customer_id: number;
  settings: SettingsShape;
  api_key?: string;
  error?: string;
}

export async function fetchSettings(customerId: string, signal?: AbortSignal): Promise<GetSettingsResponse> {
  if (!customerId) return { customer_id: 0, settings: defaultSettings(), error: 'customer_id is required' };
  const url = `${API_BASE}/settings/${encodeURIComponent(customerId)}`;
  const resp = await authFetch(url, { method: 'GET', signal });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return { customer_id: 0, settings: defaultSettings(), error: data.error || 'Failed to load settings' };
  }
  return data as GetSettingsResponse;
}

export async function updateSettings(customerId: string, settings: SettingsShape): Promise<{ ok: boolean; error?: string }> {
  if (!customerId) return { ok: false, error: 'customer_id is required' };
  const url = `${API_BASE}/settings/${encodeURIComponent(customerId)}`;
  const resp = await authFetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings }),
  });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    return { ok: false, error: data.error || 'Failed to save settings' };
  }
  return { ok: true };
}

export function defaultSettings(): SettingsShape {
  return {
    profile: { full_name: '', email: '', phone: '' },
    preferences: { dark_mode: false, enable_animations: true, auto_refresh: true, compact_table: false },
    notifications: { email: true, push: false, sms: false, system: true },
    security: { two_fa_enabled: false },
    integrations: { slack_enabled: false },
    privacy: { analytics: true, data_sharing: false, allow_export: true, allow_deletion: false },
    workspace: { name: '', public: false, guest_access: false },
    storage: { auto_backup: false, cloud_sync: false },
    advanced: { developer_mode: false, beta_features: false, debug_mode: false, performance_monitoring: false, session_timeout_min: 30 },
  };
}
