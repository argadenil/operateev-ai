import React from 'react';
import { User } from 'lucide-react';

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="p-6 border-b bg-white flex items-center gap-4">
        <User className="text-green-600" size={32} />
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
      </header>
      <main className="flex-1 p-6">
        <div className="text-lg text-gray-700">Welcome, Customer! Here you can view your resources, jobs, and account details.</div>
        {/* Add customer-specific dashboard features here */}
      </main>
    </div>
  );
}
