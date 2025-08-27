export default function Settings() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-4 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Account Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your profile, security, notifications, and integrations in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <span className="material-icons text-indigo-500 text-3xl mr-2">person</span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
              Update your personal info and contact details.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                />
              </div>
              <button className="mt-3 sm:mt-4 w-full px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-[10px] font-medium hover:bg-indigo-700 transition text-sm sm:text-base">
                Save Changes
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white shadow-lg rounded-[15px] border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center mb-4">
              <span className="material-icons text-indigo-500 text-3xl mr-2">settings</span>
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
              <span className="material-icons text-indigo-500 text-3xl mr-2">notifications</span>
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
              <span className="material-icons text-indigo-500 text-3xl mr-2">lock</span>
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
              <span className="material-icons text-indigo-500 text-3xl mr-2">api</span>
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
              <span className="material-icons text-indigo-500 text-3xl mr-2">history</span>
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
        </div>
      </div>
    </div>
  );
}

// Toggle Component
function Toggle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 text-sm sm:text-base">{label}</span>
      <input
        type="checkbox"
        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
      />
    </div>
  );
}
