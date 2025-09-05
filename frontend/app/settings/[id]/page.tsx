"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../components/loader";

// Toggle Component
function Toggle({ label, checked, onChange, description }: { 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <span className="text-gray-700 font-medium">{label}</span>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform mt-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`}></div>
        </div>
      </label>
    </div>
  );
}

export default function SettingsById() {
  const params = useParams();
  const customerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    customerId: customerId,
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    slackNotifications: false,
    slackWebhookUrl: "",
    
    // Appearance
    darkMode: false,
    animations: true,
    compactView: false,
    
    // System
    autoScaling: false,
    maxGPUInstances: 10,
    defaultPriority: 5,
    sessionTimeout: 60,
    
    // Preferences
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    
    // Privacy
    analyticsEnabled: true,
    crashReporting: true,
    usageStatistics: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/settings/${customerId}`);
        // if (!response.ok) throw new Error('Settings not found');
        // const data = await response.json();
        
        // Mock data for now - replace with actual API call
        const mockSettings = {
          customerId: customerId,
          emailNotifications: customerId === "111113" ? false : true,
          pushNotifications: false,
          slackNotifications: customerId === "111113" ? true : false,
          slackWebhookUrl: customerId === "111113" ? "https://hooks.slack.com/services/example" : "",
          darkMode: false,
          animations: true,
          compactView: false,
          autoScaling: customerId === "111113" ? true : false,
          maxGPUInstances: customerId === "111113" ? 20 : 10,
          defaultPriority: 5,
          sessionTimeout: 60,
          timezone: "UTC",
          language: "en",
          dateFormat: "MM/DD/YYYY",
          analyticsEnabled: true,
          crashReporting: true,
          usageStatistics: false
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSettings(mockSettings);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch settings');
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchSettings();
    }
  }, [customerId]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement API call to save settings
      // const response = await fetch(`/api/settings/${customerId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      // if (!response.ok) throw new Error('Failed to save settings');
      
      console.log("Saving settings for customer", customerId, ":", settings);
      // Show success message
    } catch (err) {
      console.error('Error saving settings:', err);
      // Show error message
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Settings Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Customer ID: {customerId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Settings - Customer {customerId}
          </h1>
          <p className="text-gray-600">
            Configure application preferences and system settings for customer {customerId}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="material-icons text-indigo-500 text-2xl mr-3">account_circle</span>
              <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                  <input
                    type="text"
                    value={customerId}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Settings Profile</label>
                  <input
                    type="text"
                    value={`Customer ${customerId} Settings`}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">notifications</span>
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-2">
              <Toggle
                label="Email Notifications"
                checked={settings.emailNotifications}
                onChange={(checked) => handleSettingChange('emailNotifications', checked)}
                description="Receive updates via email"
              />
              <Toggle
                label="Push Notifications"
                checked={settings.pushNotifications}
                onChange={(checked) => handleSettingChange('pushNotifications', checked)}
                description="Browser push notifications"
              />
              <Toggle
                label="Slack Integration"
                checked={settings.slackNotifications}
                onChange={(checked) => handleSettingChange('slackNotifications', checked)}
                description="Send alerts to Slack channel"
              />
              {settings.slackNotifications && (
                <div className="mt-3 pl-4">
                  <label htmlFor="slackWebhook" className="block text-sm font-medium text-gray-700 mb-1">
                    Slack Webhook URL
                  </label>
                  <input
                    id="slackWebhook"
                    type="url"
                    value={settings.slackWebhookUrl}
                    onChange={(e) => handleSettingChange('slackWebhookUrl', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Appearance */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">palette</span>
              <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
            </div>
            <div className="space-y-2">
              <Toggle
                label="Dark Mode"
                checked={settings.darkMode}
                onChange={(checked) => handleSettingChange('darkMode', checked)}
                description="Switch to dark theme"
              />
              <Toggle
                label="Enable Animations"
                checked={settings.animations}
                onChange={(checked) => handleSettingChange('animations', checked)}
                description="Smooth transitions and effects"
              />
              <Toggle
                label="Compact View"
                checked={settings.compactView}
                onChange={(checked) => handleSettingChange('compactView', checked)}
                description="Reduce spacing and padding"
              />
            </div>
          </section>

          {/* System Configuration */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">settings</span>
              <h2 className="text-xl font-semibold text-gray-900">System</h2>
            </div>
            <div className="space-y-4">
              <Toggle
                label="Auto Scaling"
                checked={settings.autoScaling}
                onChange={(checked) => handleSettingChange('autoScaling', checked)}
                description="Automatically scale GPU resources"
              />
              
              <div>
                <label htmlFor="maxGPU" className="block text-sm font-medium text-gray-700 mb-1">
                  Max GPU Instances
                </label>
                <select
                  id="maxGPU"
                  value={settings.maxGPUInstances}
                  onChange={(e) => handleSettingChange('maxGPUInstances', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={5}>5 instances</option>
                  <option value={10}>10 instances</option>
                  <option value={20}>20 instances</option>
                  <option value={50}>50 instances</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Default Job Priority
                </label>
                <select
                  id="priority"
                  value={settings.defaultPriority}
                  onChange={(e) => handleSettingChange('defaultPriority', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>Low (1)</option>
                  <option value={3}>Medium (3)</option>
                  <option value={5}>Normal (5)</option>
                  <option value={7}>High (7)</option>
                  <option value={10}>Critical (10)</option>
                </select>
              </div>

              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <select
                  id="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={480}>8 hours</option>
                </select>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">tune</span>
              <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                </select>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">privacy_tip</span>
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Data</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Toggle
                label="Analytics"
                checked={settings.analyticsEnabled}
                onChange={(checked) => handleSettingChange('analyticsEnabled', checked)}
                description="Help improve the platform"
              />
              <Toggle
                label="Crash Reporting"
                checked={settings.crashReporting}
                onChange={(checked) => handleSettingChange('crashReporting', checked)}
                description="Automatically report errors"
              />
              <Toggle
                label="Usage Statistics"
                checked={settings.usageStatistics}
                onChange={(checked) => handleSettingChange('usageStatistics', checked)}
                description="Share anonymous usage data"
              />
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:col-span-2">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">storage</span>
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center">
                <span className="material-icons text-gray-600 text-2xl mb-2 block">download</span>
                <span className="text-sm font-medium text-gray-900">Export Data</span>
                <p className="text-xs text-gray-500 mt-1">Download customer data</p>
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center">
                <span className="material-icons text-gray-600 text-2xl mb-2 block">sync</span>
                <span className="text-sm font-medium text-gray-900">Sync Settings</span>
                <p className="text-xs text-gray-500 mt-1">Backup preferences</p>
              </button>
              
              <button className="p-4 border border-red-300 rounded-lg hover:bg-red-50 transition text-center">
                <span className="material-icons text-red-600 text-2xl mb-2 block">delete_forever</span>
                <span className="text-sm font-medium text-red-900">Delete Data</span>
                <p className="text-xs text-red-500 mt-1">Permanently remove</p>
              </button>
            </div>
          </section>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
          >
            Save Settings for Customer {customerId}
          </button>
        </div>
      </div>
    </div>
  );
}
