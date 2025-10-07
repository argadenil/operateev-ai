'use client';

import React, { useState, useEffect } from 'react';
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
    LucideIcon,
    Search,
    ChevronDown,
    ChevronUp,
    CheckCircle,
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
import { fetchSuperAdminDashboard, type SuperAdminDashboardData } from '@/lib/dashboard';

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

// Helper function to format large numbers
const formatNumber = (num: number): string | number => {
    if (num >= 1000) {
        return `${(num / 1000).toFixed(2)}K`;
    }
    return num;
};

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

const getHeatColor = (value: number) => {
    const hue = (100 - value) * 1.2; // map intensity to green->red spectrum
    return `hsl(${hue}, 80%, 50%)`;
};

export default function SuperAdminDashboard() {
    const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');
    const [alertFilter, setAlertFilter] = useState<'all' | AlertSeverity>('all');
    const [activitySearch, setActivitySearch] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        alerts: true,
        activities: true,
        charts: true
    });
    const [currentPage, setCurrentPage] = useState(1);
    const activitiesPerPage = 4;

    // Fetch dashboard data
    const loadDashboardData = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetchSuperAdminDashboard();
            if (response.status === 'success' && response.dashboard) {
                setDashboardData(response.dashboard);
                setError(null);
            } else {
                setError(response.error || 'Failed to load dashboard data');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadDashboardData();
    }, []);

    // Auto-refresh logic
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            loadDashboardData();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh]);

    const handleRefresh = () => {
        loadDashboardData();
    };

    // Build headline stats from API data
    const headlineStats = dashboardData ? [
        {
            title: 'Total Admins',
            value: dashboardData.totalAdmins.total,
            icon: UserCog,
            palette: 'blue' as const,
            change: 0,
            changeType: 'neutral' as const,
            description: `${dashboardData.totalAdmins.active} active, ${dashboardData.totalAdmins.inactive} inactive`,
            dataViz: {
                type: 'dotIndicator' as const,
                items: [
                    { label: 'Active', count: dashboardData.totalAdmins.active, color: 'bg-green-400' },
                    { label: 'Inactive', count: dashboardData.totalAdmins.inactive, color: 'bg-red-400' },
                ]
            }
        },
        {
            title: 'Total Customers',
            value: formatNumber(dashboardData.totalCustomers.total),
            icon: Users,
            palette: 'emerald' as const,
            change: 0,
            changeType: 'neutral' as const,
            description: `${dashboardData.totalCustomers.active} active customers`,
            dataViz: {
                type: 'dotIndicator' as const,
                items: [
                    { label: 'Active', count: dashboardData.totalCustomers.active, color: 'bg-green-400' },
                    { label: 'Inactive', count: dashboardData.totalCustomers.inactive, color: 'bg-red-400' },
                ]
            }
        },
        {
            title: 'Clusters',
            value: dashboardData.totalClusters.total,
            icon: Server,
            palette: 'gray' as const,
            change: 0,
            changeType: 'neutral' as const,
            description: `${dashboardData.totalClusters.active} active clusters`,
            dataViz: {
                type: 'comparison' as const,
                primary: { label: 'Active', value: dashboardData.totalClusters.active.toString() },
                secondary: { label: 'Idle', value: dashboardData.totalClusters.idle.toString() }
            }
        },
        {
            title: 'Nodes',
            value: dashboardData.totalNodes.total,
            icon: MonitorSmartphone,
            palette: 'orange' as const,
            change: 0,
            changeType: 'neutral' as const,
            description: `${dashboardData.totalNodes.online} nodes online`,
            dataViz: {
                type: 'dotIndicator' as const,
                items: [
                    { label: 'Online', count: dashboardData.totalNodes.online, color: 'bg-green-400' },
                    { label: 'Maintenance', count: dashboardData.totalNodes.maintenance, color: 'bg-yellow-400' },
                    { label: 'Offline', count: dashboardData.totalNodes.offline, color: 'bg-red-400' }
                ]
            }
        },
        {
            title: 'GPUs',
            value: dashboardData.totalGpus.total,
            icon: Cpu,
            palette: 'indigo' as const,
            change: 0,
            changeType: 'neutral' as const,
            description: `${dashboardData.totalGpus.gpuList.length} GPU models`,
            dataViz: {
                type: 'tags' as const,
                items: dashboardData.totalGpus.gpuList
            }
        }
    ] : [];

    // Build secondary stats from API data
    const secondaryStats = dashboardData ? [
        {
            title: 'Total Jobs',
            value: dashboardData.totalJobs.total,
            icon: Activity,
            palette: 'violet' as const,
            description: `Running: ${dashboardData.totalJobs.running}`,
            dataViz: {
                type: 'dotIndicator' as const,
                items: [
                    { label: 'Running', count: dashboardData.totalJobs.running, color: 'bg-green-400' },
                    { label: 'Queued', count: dashboardData.totalJobs.queued, color: 'bg-yellow-400' },
                    { label: 'Completed', count: dashboardData.totalJobs.completed, color: 'bg-blue-400' },
                ]
            }
        },
        {
            title: 'Used GPUs',
            value: dashboardData.usedGPUs.inUse,
            icon: Cpu,
            palette: 'sky' as const,
            description: `Available: ${dashboardData.usedGPUs.available}`,
            dataViz: {
                type: 'dotIndicator' as const,
                items: [
                    { label: 'In Use', count: dashboardData.usedGPUs.inUse, color: 'bg-red-400' },
                    { label: 'Available', count: dashboardData.usedGPUs.available, color: 'bg-green-400' },
                    { label: 'Reserved', count: dashboardData.usedGPUs.reserved, color: 'bg-amber-400' },
                ]
            }
        },
        {
            title: 'Failed GPUs',
            value: dashboardData.failedGPUs.total,
            icon: ZapOff,
            palette: 'red' as const,
            description: `${dashboardData.failedGPUs.hardwareFailures} hardware failures`,
            dataViz: {
                type: 'dotIndicator' as const,
                items: [
                    { label: 'Hardware', count: dashboardData.failedGPUs.hardwareFailures, color: 'bg-red-400' },
                    { label: 'Software', count: dashboardData.failedGPUs.softwareFailures, color: 'bg-orange-400' },
                    { label: 'Network', count: dashboardData.failedGPUs.networkFailures, color: 'bg-gray-400' },
                    { label: 'Power', count: dashboardData.failedGPUs.powerFailures, color: 'bg-yellow-400' }
                ]
            }
        },
    ] : [];

    const handleExport = () => {
        // Export dashboard data as JSON
        const exportData = {
            dashboardData,
            stats: { headlineStats, secondaryStats },
            alerts,
            activities: recentActivities,
            timestamp: new Date().toISOString()
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Filter alerts by severity
    const filteredAlerts = alertFilter === 'all'
        ? alerts
        : alerts.filter(alert => alert.severity === alertFilter);

    // Filter activities by search
    const filteredActivities = recentActivities.filter(activity =>
        activity.text.toLowerCase().includes(activitySearch.toLowerCase())
    );

    // Paginate activities
    const indexOfLastActivity = currentPage * activitiesPerPage;
    const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
    const currentActivities = filteredActivities.slice(indexOfFirstActivity, indexOfLastActivity);
    const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-6 lg:p-10 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-slate-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !dashboardData) {
        return (
            <div className="min-h-screen p-6 lg:p-10 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="text-red-600" size={24} />
                        <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
                    </div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-10 space-y-10">
            {/* Error banner (if error but we have cached data) */}
            {error && dashboardData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertTriangle className="text-yellow-600" size={20} />
                    <p className="text-yellow-800 text-sm">{error}</p>
                </div>
            )}

            {/* Summary Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {headlineStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        palette={stat.palette}
                        change={stat.change}
                        changeType={stat.changeType}
                        dataViz={stat.dataViz}
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
                        dataViz={stat.dataViz}
                    />
                ))}
            </section>

            {/* Graphs & Visuals */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">Analytics & Insights</h2>
                        <button
                            onClick={() => toggleSection('charts')}
                            className="text-slate-500 hover:text-slate-700 transition"
                        >
                            {expandedSections.charts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>
                    <p className="text-sm text-slate-500">Showing data for: {timeRange === '24h' ? 'Last 24 hours' : timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}</p>
                </div>

                {expandedSections.charts && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                    </div>
                )}
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Alerts & Notifications with Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900">Alerts & Notifications</h2>
                            <button
                                onClick={() => toggleSection('alerts')}
                                className="text-slate-500 hover:text-slate-700 transition"
                            >
                                {expandedSections.alerts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
                            {filteredAlerts.length}
                        </span>
                    </div>

                    {expandedSections.alerts && (
                        <>
                            {/* Alert Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {(['all', 'error', 'warning', 'info'] as const).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setAlertFilter(filter)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${alertFilter === filter
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                                {filteredAlerts.length > 0 ? (
                                    filteredAlerts.map((alert, idx) => (
                                        <li key={idx} className={`flex items-start gap-3 p-3 rounded-lg border transition hover:shadow-sm ${alert.severity === 'error' ? 'bg-red-50/50 border-red-200' :
                                            alert.severity === 'warning' ? 'bg-yellow-50/50 border-yellow-200' :
                                                'bg-blue-50/50 border-blue-200'
                                            }`}>
                                            <alert.icon
                                                size={18}
                                                className={`flex-shrink-0 mt-0.5 ${alert.severity === 'error' ? 'text-red-600' :
                                                    alert.severity === 'warning' ? 'text-yellow-600' :
                                                        'text-blue-600'
                                                    }`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">{alert.text}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition">
                                                        View Details
                                                    </button>
                                                    <button className="text-xs font-medium text-slate-600 hover:text-slate-700 transition">
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center py-8 text-slate-500">
                                        <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                                        <p className="text-sm font-medium">No {alertFilter !== 'all' ? alertFilter : ''} alerts</p>
                                    </li>
                                )}
                            </ul>
                        </>
                    )}
                </div>

                {/* Recent Activities with Search and Pagination */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
                            <button
                                onClick={() => toggleSection('activities')}
                                className="text-slate-500 hover:text-slate-700 transition"
                            >
                                {expandedSections.activities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>
                        <Link href="/logs" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                            View All Logs
                        </Link>
                    </div>

                    {expandedSections.activities && (
                        <>
                            {/* Activity Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search activities..."
                                    value={activitySearch}
                                    onChange={(e) => {
                                        setActivitySearch(e.target.value);
                                        setCurrentPage(1); // Reset to first page on search
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <ul className="space-y-2">
                                {currentActivities.length > 0 ? (
                                    currentActivities.map((activity, idx) => (
                                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <activity.icon size={16} className="text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{activity.timestamp}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center py-8 text-slate-500">
                                        <p className="text-sm font-medium">No activities found</p>
                                    </li>
                                )}
                            </ul>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <p className="text-xs text-slate-600">
                                        Showing {indexOfFirstActivity + 1}-{Math.min(indexOfLastActivity, filteredActivities.length)} of {filteredActivities.length}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-3 py-1 text-xs font-medium text-slate-700">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
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
