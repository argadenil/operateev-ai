"use client";

import React, { useEffect } from "react";
import Loader from "../../components/loader";

export default function Settings() {
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loader for demo
    return () => clearTimeout(timer);
  }, []);

    if (loading) {
      return <Loader />;
    }
  return (
  <div className="space-y-6 animate-slide-up">
        {/* Page Header */}
        {/* <div className="mb-4 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Account Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your profile, security, notifications, and integrations in one place.
          </p>
        </div> */}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">person</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Update your personal info and contact details.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Jane Doe"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email-address"
                  type="email"
                  placeholder="jane@example.com"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone-number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <button 
                type="button"
                className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </section>

          {/* Preferences */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">settings</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Preferences</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Customize how your dashboard behaves and looks.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Toggle label="Dark Mode" />
              <Toggle label="Enable Animations" />
              <Toggle label="Auto-Refresh Dashboard" />
              <Toggle label="Compact Table View" />
            </div>
          </section>

          {/* Notifications */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">notifications</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Manage how and when you receive updates.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Toggle label="Email Notifications" />
              <Toggle label="Push Notifications" />
              <Toggle label="SMS Notifications" />
              <Toggle label="System Alerts" />
            </div>
          </section>

          {/* Security */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">lock</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Security</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Update your password and manage multi-factor authentication.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <Toggle label="Enable Two-Factor Authentication" />
              <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-red-600 text-white rounded-[10px] font-medium hover:bg-red-700 transition text-sm sm:text-base">
                Update Security
              </button>
            </div>
          </section>

          {/* API & Integrations */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">api</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">API & Integrations</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Manage API keys and connected integrations.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm sm:text-base">API Key #1</span>
                <button className="text-indigo-600 font-medium text-sm sm:text-base hover:underline">
                  Regenerate
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm sm:text-base">Slack Integration</span>
                <Toggle label="Enabled" />
              </div>
            </div>
          </section>

          {/* Activity Logs */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">history</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Activity Logs</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              View recent account activity and logins.
            </p>
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
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Manage your subscription plan and payment methods.
            </p>
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
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Control your data privacy and manage data exports.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Toggle label="Analytics Tracking" />
              <Toggle label="Data Sharing with Partners" />
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
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Invite team members and manage permissions.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm sm:text-base">Team Members</span>
                <span className="text-gray-600 text-sm">5/10</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invite Email</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
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
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Configure workspace defaults and organization settings.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Workspace Name</label>
                <input
                  type="text"
                  placeholder="My AI Workspace"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <Toggle label="Public Workspace" />
              <Toggle label="Allow Guest Access" />
              <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">
                Update Workspace
              </button>
            </div>
          </section>

          {/* Storage & Backup */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">storage</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Storage & Backup</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Monitor storage usage and configure backup settings.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm sm:text-base">Storage Used</span>
                <span className="text-gray-600 text-sm">2.5 GB / 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
              <Toggle label="Auto Backup" />
              <Toggle label="Cloud Sync" />
              <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">
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
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Configure advanced system preferences and experimental features.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <Toggle label="Developer Mode" />
              <Toggle label="Beta Features" />
              <Toggle label="Debug Mode" />
              <Toggle label="Performance Monitoring" />
              <div>
                <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                <input
                  id="session-timeout"
                  type="number"
                  placeholder="30"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
            </div>
          </section>

          {/* Support & Help */}
      <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
        <span className="material-icons text-indigo-500 text-2xl sm:text-3xl mr-2">help</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Support & Help</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Get help, report issues, and access documentation.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <button 
                type="button"
                className="w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                View Documentation
              </button>
              <button 
                type="button"
                className="w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Report Issue
              </button>
              <button 
                type="button"
                className="w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base"
              >
                Contact Support
              </button>
              <div className="text-center text-gray-500 text-xs sm:text-sm">
                Response time: ~2 hours
              </div>
            </div>
          </section>
    </div>
  </div>
  );
}

// Toggle Component
function Toggle({ label }: { label: string }) {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-gray-700 text-sm sm:text-base cursor-pointer">
        {label}
      </label>
      <input
        id={id}
        type="checkbox"
        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
        aria-describedby={`${id}-description`}
      />
      <span id={`${id}-description`} className="sr-only">
        Toggle {label}
      </span>
    </div>
  );
}
