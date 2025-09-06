"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/loader";
import { defaultSettings, fetchSettings, updateSettings, type SettingsShape } from "@/lib/settings";
import { useToast } from "../components/toaster";

export default function SettingsPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [customerId, setCustomerId] = React.useState<string | null | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [apiKey, setApiKey] = React.useState<string>("");
  const [settings, setSettings] = React.useState<SettingsShape>(defaultSettings());

  // Determine customerId from URL or localStorage; redirect when on /settings without id
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const match = window.location.pathname.match(/^\/settings\/([^\/]+)$/);
    if (match) {
      setCustomerId(match[1]);
      return;
    }
    try {
      const storedId = localStorage.getItem('customer_id');
      if (storedId) {
        router.replace(`/settings/${storedId}`);
        return;
      }
    } catch { /* ignore */ }
    setCustomerId(null);
  }, [router]);

  // Load settings when we have a customerId in the URL
  React.useEffect(() => {
    if (!customerId) return;
    const controller = new AbortController();
    setLoading(true);
    fetchSettings(customerId, controller.signal)
      .then((resp) => {
        if (resp.error) {
          error(resp.error, { title: "Failed to load settings" });
        } else {
          setSettings(resp.settings);
          setApiKey(resp.api_key || "");
        }
      })
      .catch((e: unknown) => {
        if ((e as any)?.name !== 'AbortError') error('Failed to load settings');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [customerId, error]);

  async function saveAll() {
    if (!customerId) return;
    setSaving(true);
    const resp = await updateSettings(customerId, settings);
    setSaving(false);
    if (!resp.ok) return error(resp.error || "Save failed", { title: "Error" });
    success("Settings updated", { title: "Saved" });
  }

  // Simple input bind helpers
  const bind = {
    text:
      (path: (s: SettingsShape) => string, set: (s: SettingsShape, v: string) => void) => ({
        value: path(settings),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          setSettings((prev) => {
            const copy = structuredClone(prev);
            set(copy, v);
            return copy;
          });
        },
      }),
    bool:
      (path: (s: SettingsShape) => boolean, set: (s: SettingsShape, v: boolean) => void) => ({
        checked: path(settings),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const v = e.target.checked;
          setSettings((prev) => {
            const copy = structuredClone(prev);
            set(copy, v);
            return copy;
          });
        },
      }),
    number:
      (path: (s: SettingsShape) => number, set: (s: SettingsShape, v: number) => void) => ({
        value: path(settings) ?? 0,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const v = Number(e.target.value || 0);
          setSettings((prev) => {
            const copy = structuredClone(prev);
            set(copy, v);
            return copy;
          });
        },
      }),
  } as const;

  if (customerId === undefined || loading) return <Loader />;
  if (customerId === null) return null; // No ID and no redirect target

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">person</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Update your personal info and contact details.</p>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="full-name" type="text" placeholder="Jane Doe" {...bind.text(s=>s.profile.full_name,(s,v)=>{s.profile.full_name=v;})} className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input id="email-address" type="email" placeholder="jane@example.com" {...bind.text(s=>s.profile.email,(s,v)=>{s.profile.email=v;})} className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
            </div>
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input id="phone-number" type="tel" placeholder="+1 (555) 123-4567" {...bind.text(s=>s.profile.phone,(s,v)=>{s.profile.phone=v;})} className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
            </div>
            <button type="button" onClick={saveAll} disabled={saving} className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">settings</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Preferences</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Customize how your dashboard behaves and looks.</p>
          <div className="space-y-3 sm:space-y-4">
            <Toggle label="Dark Mode" checked={settings.preferences.dark_mode} onChange={(v)=>setSettings(s=>({...s, preferences:{...s.preferences, dark_mode:v}}))} />
            <Toggle label="Enable Animations" checked={settings.preferences.enable_animations} onChange={(v)=>setSettings(s=>({...s, preferences:{...s.preferences, enable_animations:v}}))} />
            <Toggle label="Auto-Refresh Dashboard" checked={settings.preferences.auto_refresh} onChange={(v)=>setSettings(s=>({...s, preferences:{...s.preferences, auto_refresh:v}}))} />
            <Toggle label="Compact Table View" checked={settings.preferences.compact_table} onChange={(v)=>setSettings(s=>({...s, preferences:{...s.preferences, compact_table:v}}))} />
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">notifications</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Manage how and when you receive updates.</p>
          <div className="space-y-3 sm:space-y-4">
            <Toggle label="Email Notifications" checked={settings.notifications.email} onChange={(v)=>setSettings(s=>({...s, notifications:{...s.notifications, email:v}}))} />
            <Toggle label="Push Notifications" checked={settings.notifications.push} onChange={(v)=>setSettings(s=>({...s, notifications:{...s.notifications, push:v}}))} />
            <Toggle label="SMS Notifications" checked={settings.notifications.sms} onChange={(v)=>setSettings(s=>({...s, notifications:{...s.notifications, sms:v}}))} />
            <Toggle label="System Alerts" checked={settings.notifications.system} onChange={(v)=>setSettings(s=>({...s, notifications:{...s.notifications, system:v}}))} />
          </div>
        </section>

        {/* Security */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">lock</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Security</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Update your password and manage multi-factor authentication.</p>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" placeholder="********" className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" disabled />
            </div>
            <Toggle label="Enable Two-Factor Authentication" checked={settings.security.two_fa_enabled} onChange={(v)=>setSettings(s=>({...s, security:{...s.security, two_fa_enabled:v}}))} />
            <button onClick={saveAll} disabled={saving} className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-red-600 text-white rounded-[10px] font-medium hover:bg-red-700 transition text-sm sm:text-base disabled:opacity-60">
              {saving ? 'Saving...' : 'Update Security'}
            </button>
          </div>
        </section>

        {/* API & Integrations */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">api</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">API & Integrations</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Manage API keys and connected integrations.</p>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input type="text" readOnly value={apiKey || '—'} className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base bg-gray-50" />
              <button type="button" className="text-indigo-600 font-medium text-sm sm:text-base hover:underline disabled:opacity-60" disabled>
                Regenerate (coming soon)
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm sm:text-base">Slack Integration</span>
              <Toggle label="Enabled" checked={settings.integrations.slack_enabled} onChange={(v)=>setSettings(s=>({...s, integrations:{...s.integrations, slack_enabled:v}}))} />
            </div>
          </div>
        </section>

        {/* Activity Logs */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">history</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Activity Logs</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">View recent account activity and logins.</p>
          <ul className="space-y-1 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
            <li>📌 Logged in from New York, USA – 2 hours ago</li>
            <li>🔑 API key regenerated – 1 day ago</li>
            <li>🔔 Notification settings updated – 3 days ago</li>
          </ul>
        </section>

        {/* Billing & Subscription */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">credit card</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Billing & Subscription</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Manage your subscription plan and payment methods.</p>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm sm:text-base">Current Plan</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">Pro</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm sm:text-base">Next Billing</span>
              <span className="text-gray-600 text-sm">Jan 15, 2024</span>
            </div>
            <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">
              Manage Billing
            </button>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">privacy tip</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Data & Privacy</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Control your data privacy and manage data exports.</p>
          <div className="space-y-3 sm:space-y-4">
            <Toggle label="Analytics Tracking" checked={settings.privacy.analytics} onChange={(v)=>setSettings(s=>({...s, privacy:{...s.privacy, analytics:v}}))} />
            <Toggle label="Data Sharing with Partners" checked={settings.privacy.data_sharing} onChange={(v)=>setSettings(s=>({...s, privacy:{...s.privacy, data_sharing:v}}))} />
            <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">
              Export My Data
            </button>
            <button className="w-full px-4 sm:px-5 py-2 bg-red-600 text-white rounded-[10px] font-medium hover:bg-red-700 transition text-sm sm:text-base">
              Delete Account
            </button>
          </div>
        </section>

        {/* Team Management */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">group</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Management</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Invite team members and manage permissions.</p>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm sm:text-base">Team Members</span>
              <span className="text-gray-600 text-sm">5/10</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Invite Email</label>
              <input type="email" placeholder="colleague@company.com" className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
            </div>
            <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">
              Send Invitation
            </button>
          </div>
        </section>

        {/* Workspace Settings */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">work</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Workspace Settings</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Configure workspace defaults and organization settings.</p>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Workspace Name</label>
              <input type="text" placeholder="My AI Workspace" {...bind.text(s=>s.workspace.name,(s,v)=>{s.workspace.name=v;})} className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
            </div>
            <Toggle label="Public Workspace" checked={settings.workspace.public} onChange={(v)=>setSettings(s=>({...s, workspace:{...s.workspace, public:v}}))} />
            <Toggle label="Allow Guest Access" checked={settings.workspace.guest_access} onChange={(v)=>setSettings(s=>({...s, workspace:{...s.workspace, guest_access:v}}))} />
            <button onClick={saveAll} disabled={saving} className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base disabled:opacity-60">
              {saving ? 'Saving...' : 'Update Workspace'}
            </button>
          </div>
        </section>

        {/* Storage & Backup */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">storage</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Storage & Backup</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Monitor storage usage and configure backup settings.</p>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm sm:text-base">Storage Used</span>
              <span className="text-gray-600 text-sm">2.5 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{width: '25%'}}></div>
            </div>
            <Toggle label="Auto Backup" checked={settings.storage.auto_backup} onChange={(v)=>setSettings(s=>({...s, storage:{...s.storage, auto_backup:v}}))} />
            <Toggle label="Cloud Sync" checked={settings.storage.cloud_sync} onChange={(v)=>setSettings(s=>({...s, storage:{...s.storage, cloud_sync:v}}))} />
            <button onClick={saveAll} disabled={saving} className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base disabled:opacity-60">
              Manage Storage
            </button>
          </div>
        </section>

        {/* Advanced Settings */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">tune</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Advanced Settings</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Configure advanced system preferences and experimental features.</p>
          <div className="space-y-3 sm:space-y-4">
            <Toggle label="Developer Mode" checked={settings.advanced.developer_mode} onChange={(v)=>setSettings(s=>({...s, advanced:{...s.advanced, developer_mode:v}}))} />
            <Toggle label="Beta Features" checked={settings.advanced.beta_features} onChange={(v)=>setSettings(s=>({...s, advanced:{...s.advanced, beta_features:v}}))} />
            <Toggle label="Debug Mode" checked={settings.advanced.debug_mode} onChange={(v)=>setSettings(s=>({...s, advanced:{...s.advanced, debug_mode:v}}))} />
            <Toggle label="Performance Monitoring" checked={settings.advanced.performance_monitoring} onChange={(v)=>setSettings(s=>({...s, advanced:{...s.advanced, performance_monitoring:v}}))} />
            <div>
              <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
              <input id="session-timeout" type="number" placeholder="30" {...bind.number(s=>s.advanced.session_timeout_min,(s,v)=>{s.advanced.session_timeout_min=v;})} className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base" />
            </div>
          </div>
        </section>

        {/* Support & Help */}
        <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
          <div className="flex items-center mb-4">
            <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">help</span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Support & Help</h2>
          </div>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Get help, report issues, and access documentation.</p>
          <div className="space-y-3 sm:space-y-4">
            <button type="button" className="w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">View Documentation</button>
            <button type="button" className="w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">Report Issue</button>
            <button type="button" className="w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">Contact Support</button>
            <div className="text-center text-gray-500 text-xs sm:text-sm">Response time: ~2 hours</div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Toggle Component
function Toggle({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: (v:boolean)=>void }) {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-gray-700 text-sm sm:text-base cursor-pointer">{label}</label>
      <input id={id} type="checkbox" checked={!!checked} onChange={(e)=>onChange?.(e.target.checked)} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" aria-describedby={`${id}-description`} />
      <span id={`${id}-description`} className="sr-only">Toggle {label}</span>
    </div>
  );
}
