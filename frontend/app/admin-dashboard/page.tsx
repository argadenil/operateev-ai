import React from 'react';
import { Shield } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="p-6 border-b bg-white flex items-center gap-4">
        <Shield className="text-blue-600" size={32} />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="text-lg text-gray-700">Welcome, Admin! Here you can manage users, jobs, and resources for your organization.</div>
        {/* Add admin-specific dashboard features here */}
      </main>
    </div>
  );
}
