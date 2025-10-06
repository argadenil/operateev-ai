'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import StatCard from '../components/stat-card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const BarChart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });
const PieChart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const LineChart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });

const headlineStats = [
    { title: 'Total Admins', value: 18, icon: UserCog, palette: 'blue' as const },
    { title: 'Total Customers', value: 1264, icon: Users, palette: 'emerald' as const, valueSuffix: '+' },
    { title: 'Clusters', value: 12, icon: Server, palette: 'violet' as const },
    { title: 'Nodes', value: 84, icon: MonitorSmartphone, palette: 'orange' as const },
    { title: 'GPUs', value: 512, icon: Cpu, palette: 'indigo' as const }
];

const secondaryStats = [
    { title: 'Active Users', value: '1.1k', icon: UserCheck, palette: 'emerald' as const, description: 'Inactive: 58' },
    { title: 'Used GPUs', value: 356, icon: Cpu, palette: 'sky' as const, description: 'Available: 156' },
    { title: 'Failed GPUs', value: 6, icon: ZapOff, palette: 'red' as const, description: 'Offline nodes: 4' }
];

const customersPerAdminData: ChartData<'bar'> = {
    labels: ['Avery', 'Jordan', 'Morgan', 'Taylor', 'Riley', 'Bailey'],
    datasets: [
        {
            label: 'Customers',
            data: [54, 47, 63, 38, 52, 41],
            backgroundColor: '#2563eb',
            borderRadius: 8,
            maxBarThickness: 32
        }
    ]
};

const customersPerAdminOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            mode: 'index',
            intersect: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 10
            },
            grid: {
                color: 'rgba(148, 163, 184, 0.2)'
            }
        }
    }
};

const gpuUtilizationData: ChartData<'pie'> = {
    labels: ['Cluster Atlas', 'Cluster Nova', 'Cluster Orion', 'Cluster Helios'],
    datasets: [
        {
            label: 'GPU Utilization',
            data: [38, 26, 22, 14],
            backgroundColor: ['#1d4ed8', '#10b981', '#f97316', '#8b5cf6'],
            borderWidth: 1
        }
    ]
};

const gpuUtilizationOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
};

const uptimeTrendData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Uptime %',
            data: [99.4, 99.1, 98.7, 99.6, 99.2, 98.9, 99.7],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#0f766e',
            pointRadius: 4
        }
    ]
};

const uptimeTrendOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            min: 96,
            max: 100,
            ticks: {
                callback: (value) => `${value}%`
            },
            grid: {
                color: 'rgba(148, 163, 184, 0.2)'
            }
        }
    }
};

const clusterHeatmapData = [
    { cluster: 'Atlas', intensities: [92, 70, 65, 88, 73, 68] },
    { cluster: 'Nova', intensities: [54, 61, 76, 44, 59, 63] },
    { cluster: 'Orion', intensities: [81, 72, 69, 84, 77, 66] },
    { cluster: 'Helios', intensities: [35, 48, 51, 39, 42, 46] }
];

type AlertSeverity = 'error' | 'warning' | 'info';

const alerts: Array<{ text: string; severity: AlertSeverity; icon: LucideIcon }> = [
    { text: 'Cluster Atlas reached 92% GPU utilization', severity: 'warning', icon: AlertTriangle },
    { text: 'GPU H-204 temperature at 87°C', severity: 'warning', icon: Thermometer },
    { text: 'Node N-88 is offline in Cluster Orion', severity: 'error', icon: AlertTriangle },
    { text: 'Maintenance window scheduled for 02:00 UTC', severity: 'info', icon: Activity }
];

const recentActivities: Array<{ text: string; icon: LucideIcon; timestamp: string }> = [
    { text: 'New admin Sophia Reed created', icon: UserPlus, timestamp: '2 min ago' },
    { text: 'Customer Nimbus Labs assigned to Atlas', icon: Users, timestamp: '12 min ago' },
    { text: 'Node N-72 restarted', icon: MonitorSmartphone, timestamp: '24 min ago' },
    { text: 'Cluster Nova firmware updated', icon: Activity, timestamp: '48 min ago' }
];

const shortcuts: Array<{ text: string; href: string; icon: LucideIcon }> = [
    { text: 'Create Admin', href: '/admin/create', icon: UserPlus },
    { text: 'View All Customers', href: '/admin/customers', icon: Users },
    { text: 'Infrastructure Overview', href: '/infrastructure', icon: LayoutDashboard }
];

const getHeatColor = (value: number) => {
    const hue = (100 - value) * 1.2; // map intensity to green->red spectrum
    return `hsl(${hue}, 80%, 50%)`;
};

export default function SuperAdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-10">
            {/* Summary Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {headlineStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        valueSuffix={stat.valueSuffix}
                        icon={stat.icon}
                        palette={stat.palette}
                    />
                ))}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        palette={stat.palette}
                        description={stat.description}
                    />
                ))}
            </section>

            {/* Graphs & Visuals */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Customers per Admin" subtitle="Distribution across all admin accounts">
                    <BarChart data={customersPerAdminData} options={customersPerAdminOptions} />
                </ChartCard>
                <ChartCard title="GPU Utilization per Cluster" subtitle="Current allocation split">
                    <PieChart data={gpuUtilizationData} options={gpuUtilizationOptions} />
                </ChartCard>
                <ChartCard title="Uptime Trend" subtitle="Last 7 days of platform reliability">
                    <LineChart data={uptimeTrendData} options={uptimeTrendOptions} />
                </ChartCard>
                <HeatmapCard title="Cluster Usage Intensity" subtitle="Nodes engagement by cluster" data={clusterHeatmapData} />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Alerts & Notifications</h2>
                        <p className="text-sm text-slate-500">Live incidents requiring attention.</p>
                    </div>
                    <ul className="space-y-3">
                        {alerts.map((alert) => (
                            <AlertItem key={alert.text} text={alert.text} severity={alert.severity} icon={alert.icon} />
                        ))}
                    </ul>
                </div>

                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
                            <p className="text-sm text-slate-500">Recorded system events and admin actions.</p>
                        </div>
                        <Link href="/logs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                            View logs
                        </Link>
                    </div>
                    <ul className="space-y-2">
                        {recentActivities.map((activity) => (
                            <ActivityItem key={activity.text} text={activity.text} icon={activity.icon} timestamp={activity.timestamp} />
                        ))}
                    </ul>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shortcuts.map((shortcut) => (
                    <ShortcutButton key={shortcut.text} text={shortcut.text} href={shortcut.href} icon={shortcut.icon} />
                ))}
            </section>
        </div>
    );
}

// --- Helper Components ---

type ChartCardProps = {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
};

function ChartCard({ title, subtitle, children }: ChartCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="h-64">
                {children}
            </div>
        </div>
    );
}

type HeatmapCardProps = {
    title: string;
    subtitle?: string;
    data: Array<{ cluster: string; intensities: number[] }>;
};

function HeatmapCard({ title, subtitle, data }: HeatmapCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="space-y-4">
                {data.map((cluster) => (
                    <div key={cluster.cluster} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                            <span>{cluster.cluster}</span>
                            <span>{Math.round(cluster.intensities.reduce((acc, val) => acc + val, 0) / cluster.intensities.length)}%</span>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            {cluster.intensities.map((value, index) => (
                                <div
                                    key={`${cluster.cluster}-${index}`}
                                    className="h-12 rounded-lg shadow-inner flex items-center justify-center text-[11px] font-semibold text-white/90"
                                    style={{ backgroundColor: getHeatColor(value) }}
                                >
                                    {value}%
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AlertItem({ text, severity, icon: Icon }: { text: string; severity: AlertSeverity; icon: LucideIcon }) {
    const severityStyles: Record<AlertSeverity, string> = {
        error: 'bg-red-50 text-red-600 border-red-100',
        warning: 'bg-amber-50 text-amber-600 border-amber-100',
        info: 'bg-blue-50 text-blue-600 border-blue-100'
    };

    return (
        <li className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${severityStyles[severity]}`}>
            <span className="pt-0.5">
                <Icon size={18} />
            </span>
            <span className="text-sm font-medium leading-snug">{text}</span>
        </li>
    );
}

function ActivityItem({ text, icon: Icon, timestamp }: { text: string; icon: LucideIcon; timestamp: string }) {
    return (
        <li className="flex items-start gap-3 rounded-xl border border-slate-200/70 px-4 py-3 bg-slate-50/60">
            <span className="mt-1 text-blue-600">
                <Icon size={18} />
            </span>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{text}</p>
                <p className="text-xs text-slate-500">{timestamp}</p>
            </div>
        </li>
    );
}

function ShortcutButton({ text, href, icon: Icon }: { text: string; href: string; icon: LucideIcon }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-blue-200/60 bg-blue-50/70 px-5 py-4 text-blue-700 font-semibold shadow-sm transition hover:bg-blue-100 hover:shadow-md"
        >
            <span className="flex items-center justify-center rounded-xl bg-blue-600 text-white w-10 h-10 shadow-md group-hover:scale-105 transition">
                <Icon size={20} />
            </span>
            <span>{text}</span>
        </Link>
    );
}
