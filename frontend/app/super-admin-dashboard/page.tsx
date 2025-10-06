import React from 'react';
import {
    Users,
    UserCheck,
    Server,
    Cpu,
    MonitorSmartphone,
    Activity,
    UserPlus,
    UserCog,
    LayoutDashboard,
    AlertTriangle,
    Thermometer,
    ZapOff,
    LucideIcon
} from 'lucide-react';
import StatCard from '../components/stat-card';

// ...existing code...

export default function SuperAdminDashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 p-6 gap-8">
            {/* 📊 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard title="Admins" value={12} icon={UserCog} palette="blue" />
                <StatCard title="Customers" value={120} icon={Users} palette="emerald" />
                <StatCard title="Clusters" value={8} icon={Server} palette="violet" />
                <StatCard title="Nodes" value={56} icon={MonitorSmartphone} palette="orange" />
                <StatCard title="GPUs" value={320} icon={Cpu} palette="indigo" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Users" value={110} icon={UserCheck} palette="emerald" description="Inactive: 10" />
                <StatCard title="Used GPUs" value={280} icon={Cpu} palette="blue" description="Available: 40" />
                <StatCard title="Failed GPUs" value={3} icon={ZapOff} palette="red" description="Offline Nodes: 2" />
            </div>

            {/* 🧩 Graphs & Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Customers per Admin (Bar Chart)" />
                <ChartCard title="GPU Utilization per Cluster (Pie Chart)" />
                <ChartCard title="Uptime Trend / Failures (Line Chart)" />
                <ChartCard title="Cluster Usage Intensity (Heatmap)" />
            </div>

            {/* ⚠️ Alerts & Notifications */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Alerts & Notifications</h2>
                <ul className="space-y-2">
                    <AlertItem text="2 nodes offline" type="error" icon={AlertTriangle} />
                    <AlertItem text="GPU #45 high temperature" type="warning" icon={Thermometer} />
                    <AlertItem text="Cluster #3 over-capacity" type="error" icon={AlertTriangle} />
                </ul>
            </div>

            {/* ⏱️ Recent Activities */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
                <ul className="space-y-1">
                    <ActivityItem text="Admin John created" icon={UserPlus} />
                    <ActivityItem text="Customer X updated" icon={Users} />
                    <ActivityItem text="Node #12 went offline" icon={MonitorSmartphone} />
                    <ActivityItem text="System log: Backup completed" icon={Activity} />
                </ul>
            </div>

            {/* 🔍 Quick Access Shortcuts */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <ShortcutButton text="Create Admin" icon={UserPlus} />
                <ShortcutButton text="View All Customers" icon={Users} />
                <ShortcutButton text="Infrastructure Overview" icon={LayoutDashboard} />
            </div>
        </div>
    );
}

// --- Helper Components ---

function ChartCard({ title }: { title: string }) {
    return (
        <div className="bg-white rounded shadow p-4 flex flex-col items-center justify-center h-40">
            <div className="text-sm font-semibold mb-2">{title}</div>
            <div className="text-xs text-gray-400">[Chart Placeholder]</div>
        </div>
    );
}

function AlertItem({ text, type, icon: Icon }: { text: string, type: 'error' | 'warning', icon: LucideIcon }) {
    const color = type === 'error' ? 'text-red-600' : 'text-yellow-600';
    return (
        <li className={`font-medium flex items-center gap-2 ${color}`}>
            <Icon size={18} />
            {text}
        </li>
    );
}

function ActivityItem({ text, icon: Icon }: { text: string, icon: LucideIcon }) {
    return (
        <li className="text-gray-700 text-sm flex items-center gap-2">
            <Icon size={16} />
            {text}
        </li>
    );
}

function ShortcutButton({ text, icon: Icon }: { text: string, icon: LucideIcon }) {
    return (
        <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Icon size={18} />
            {text}
        </button>
    );
}

// ...existing code...
