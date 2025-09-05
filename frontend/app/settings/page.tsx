"use client";

import React, { useEffect, useState } from "react";
import Loader from "../components/loader";

// Enhanced Toggle Component
function Toggle({ label, checked, onChange, description }: { 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50/50 transition-all duration-300">
      <div className="flex-1">
        <span className="text-gray-900 font-semibold">{label}</span>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-14 h-7 rounded-full transition-all duration-300 shadow-inner ${checked ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-200'}`}>
          <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-all duration-300 mt-1 ${checked ? 'translate-x-8' : 'translate-x-1'}`}></div>
        </div>
      </label>
    </div>
  );
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement API call to save settings
    console.log("Saving settings:", settings);
    // Show success message
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-slate-200/60 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">⚙️</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Configure your application preferences and system settings
                </p>
              </div>
            </div>
          </div>
        </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Notifications */}
          <section className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">🔔</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
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
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                  <label htmlFor="slackWebhook" className="block text-sm font-semibold text-gray-700 mb-2">
                    Slack Webhook URL
                  </label>
                  <input
                    id="slackWebhook"
                    type="url"
                    value={settings.slackWebhookUrl}
                    onChange={(e) => handleSettingChange('slackWebhookUrl', e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Enhanced Appearance */}
          <section className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Appearance</h2>
            </div>
            <div className="space-y-4">
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

          {/* Enhanced System Configuration */}
          <section className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">System</h2>
            </div>
            <div className="space-y-6">
              <Toggle
                label="Auto Scaling"
                checked={settings.autoScaling}
                onChange={(checked) => handleSettingChange('autoScaling', checked)}
                description="Automatically scale GPU resources"
              />
              
              <div>
                <label htmlFor="maxGPU" className="block text-sm font-semibold text-gray-700 mb-2">
                  Max GPU Instances
                </label>
                <select
                  id="maxGPU"
                  value={settings.maxGPUInstances}
                  onChange={(e) => handleSettingChange('maxGPUInstances', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                >
                  <option value={5}>5 instances</option>
                  <option value={10}>10 instances</option>
                  <option value={20}>20 instances</option>
                  <option value={50}>50 instances</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  Default Job Priority
                </label>
                <select
                  id="priority"
                  value={settings.defaultPriority}
                  onChange={(e) => handleSettingChange('defaultPriority', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                >
                  <option value={1}>Low (1)</option>
                  <option value={3}>Medium (3)</option>
                  <option value={5}>Normal (5)</option>
                  <option value={7}>High (7)</option>
                  <option value={10}>Critical (10)</option>
                </select>
              </div>

              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-semibold text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <select
                  id="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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

          {/* Enhanced Preferences */}
          <section className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">🎛️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="timezone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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
                <label htmlFor="dateFormat" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:col-span-3">
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
          <section className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 lg:col-span-3">
            <div className="flex items-center mb-6">
              <span className="material-icons text-indigo-500 text-2xl mr-3">storage</span>
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center">
                <span className="material-icons text-gray-600 text-2xl mb-2 block">download</span>
                <span className="text-sm font-medium text-gray-900">Export Data</span>
                <p className="text-xs text-gray-500 mt-1">Download your data</p>
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
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
