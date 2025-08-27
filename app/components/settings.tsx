export default function Settings() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Settings</h1>

                <div className="space-y-8">
                    {/* Profile Settings */}
                    <section className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                                Save Changes
                            </button>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                        <div className="space-y-4">
                            <Toggle label="Dark Mode" />
                            <Toggle label="Enable Animations" />
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                        <div className="space-y-4">
                            <Toggle label="Email Notifications" />
                            <Toggle label="Push Notifications" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

// Simple Toggle Component
function Toggle({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-700">{label}</span>
            <input
                type="checkbox"
                className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
        </div>
    );
}
