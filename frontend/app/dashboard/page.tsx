"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import Loader from "../components/loader";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Cpu, PlayCircle, PauseCircle, Zap, PlusCircle, RefreshCw, Activity, Server } from "lucide-react";
import StatCard from "../components/stat-card";

// Chart.js - Register once
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { X } from "lucide-react";


// Register ChartJS components once
if (typeof window !== 'undefined') {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);
}

import { fetchDashboard, secondsToH, capitalizeStatus, DashboardAPIResource } from "../../lib/dashboard"; // added
import { addGPUResource, AddGPURequest } from "../../lib/gpu-resources";
import { useToast } from "../components/toaster"; // added
import SuperadminDashboard from "../super-admin/page";

type GPUResource = {
  id: number;
  gpu: string;
  memory: string;
  cluster: string;
  status: string;
  uptime: string;
  temperature: number;
  power: number;
  processes: number;
};


// (Old getStatusColor removed; using unified renderStatusBadge)

// Fancy status badge renderer (centralized styling)
const renderStatusBadge = (status: string) => {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm border transition-colors duration-300";
  const styles: Record<string, string> = {
    Running:
      "bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/20 text-emerald-700 border-emerald-500/30 ring-1 ring-inset ring-emerald-500/20", // green
    Idle:
      "bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/20 text-amber-700 border-amber-500/30 ring-1 ring-inset ring-amber-500/20", // amber
  };
  const fallback =
    "bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-rose-500/20 text-rose-700 border-rose-500/30 ring-1 ring-inset ring-rose-500/20";

  const cls = styles[status] || fallback;
  const dotColor =
    status === "Running"
      ? "bg-emerald-500 animate-pulse"
      : status === "Idle"
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <span className={`${base} ${cls}`} aria-label={`Status: ${status}`}>
      <span className={`w-2 h-2 rounded-full shadow-inner ${dotColor}`} />
      {status}
    </span>
  );
};

// Chart data - moved outside component to prevent recreation
const createLineChartData = () => ({
  labels: ["1m", "2m", "3m", "4m", "5m", "6m"],
  datasets: [
    {
      label: "GPU Utilization (%)",
      data: [30, 45, 60, 50, 70, 85],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.3)",
      fill: true,
      tension: 0.4,
    },
  ],
});

const createPieChartData = () => ({
  labels: ["Used Memory", "Free Memory"],
  datasets: [
    {
      label: "Memory (GB)",
      data: [56, 24],
      backgroundColor: ["#f87171", "#34d399"],
      borderWidth: 2,
    },
  ],
});

// Chart options - memoized to prevent recreation
const chartOptions = {
  line: {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { size: 12 },
        bodyFont: { size: 11 }
      }
    },
    scales: {
      x: {
        ticks: { font: { size: 10 } }
      },
      y: {
        ticks: { font: { size: 10 } }
      }
    }
  },
  pie: {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 11 },
          padding: 15
        }
      },
      tooltip: {
        titleFont: { size: 12 },
        bodyFont: { size: 11 }
      }
    }
  }
};

// SuperadminPanel extracted to ../components/superadmin-panel

const Dashboard = React.memo(() => {
  // Role aware: read role synchronously from localStorage so superadmin can be rendered immediately
  const role = typeof window !== 'undefined' ? (localStorage.getItem('role') || '').toLowerCase() : null;
  const router = useRouter();
  const { error: pushError, success: pushSuccess } = useToast(); // added
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState<GPUResource | null>(null);
  const [resources, setResources] = React.useState<GPUResource[]>([]); // added
  const [summary, setSummary] = React.useState({ total: 0, running: 0, idle: 0, avgPower: 0 }); // added
  // removed fetching state
  // removed lastUpdated timestamp functionality
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [nowTs, setNowTs] = React.useState<number>(() => Date.now());
  // customerId: undefined = pending (not yet parsed), null = explicitly missing (base /dashboard), string = present
  const [customerId, setCustomerId] = React.useState<string | null | undefined>(undefined);
  const missingIdNotified = React.useRef(false);
  // Customer name for badge; prefer 'customer_name' then 'username'
  const [customerName, setCustomerName] = React.useState<string>("TEST Corp");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [addError, setAddError] = React.useState<string | null>(null);
  const [addForm, setAddForm] = React.useState<{
    model: string;
    memory_gb: number | '';
    memory_used_gb: number | '';
    cluster: string;
    status: 'available' | 'allocated' | 'offline';
  }>({ model: '', memory_gb: '', memory_used_gb: 0, cluster: '', status: 'available' });

  // Derive customer id strictly from URL (/dashboard/:id). Base /dashboard should not auto-use stored id.
  useEffect(() => {
    if (typeof window === 'undefined') return; // client-only logic
    const match = window.location.pathname.match(/^\/dashboard\/([^\/]+)$/);
    if (match) {
      setCustomerId(match[1]);
      return;
    }
    // No ID in path -> try localStorage
    try {
      const storedId = localStorage.getItem('customer_id');
      if (storedId) {
        // Redirect to canonical /dashboard/{customer_id}
        router.replace(`/dashboard/${storedId}`);
        // Keep customerId as undefined so we show loader until navigation completes
        return;
      }
    } catch { /* ignore */ }
    // Nothing found -> mark explicitly missing
    setCustomerId(null);
  }, [router]);

  // Load customer display name from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const name = (localStorage.getItem('customer_name') || localStorage.getItem('username') || '').trim();
      if (name) setCustomerName(name);
    } catch { /* ignore */ }
  }, []);
  const loadDashboard = React.useCallback((cid: string, signal: AbortSignal) => {
    return fetchDashboard(cid, signal)
      .then((data) => {
        if (data.error) {
          pushError(data.error, { title: 'Dashboard' });
        }
        const transformed: GPUResource[] = (data.resources || []).map((r: DashboardAPIResource) => ({
          id: r.id,
          gpu: r.gpu,
          memory: `${r.memory_gb} GB`,
          cluster: r.cluster,
          status: capitalizeStatus(r.status),
          uptime: secondsToH(r.uptime_sec),
          temperature: r.temperature_c,
          power: r.power_w,
          processes: r.processes,
        }));
        setResources(transformed);
        setSummary({
          total: data.summary?.total || 0,
          running: data.summary?.running || 0,
          idle: data.summary?.idle || 0,
          avgPower: data.summary?.avg_power || 0,
        });
        setLastUpdated(new Date());
      })
      .catch((e: unknown) => {
        if (!signal.aborted) {
          const msg = e instanceof Error ? e.message : 'Network error';
          pushError(msg, { title: 'Dashboard fetch' });
        }
      });
  }, [pushError]);

  useEffect(() => {
    if (customerId === undefined) return; // waiting for parse
    if (customerId === null) {
      if (!missingIdNotified.current) {
        pushError('customer_id is required', { title: 'Dashboard' });
        missingIdNotified.current = true;
      }
      setResources([]);
      setSummary({ total: 0, running: 0, idle: 0, avgPower: 0 });
      setLoading(false);
      return;
    }
    const abort = new AbortController();
    loadDashboard(customerId, abort.signal)
      .finally(() => {
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      });
    return () => abort.abort();
  }, [customerId, loadDashboard, pushError]);

  // Memoize chart data
  const lineChartData = useMemo(() => createLineChartData(), []);
  const pieChartData = useMemo(() => createPieChartData(), []);

  // Replace statsData calc to use summary/resources
  const statsData = useMemo(() => ({
    total: summary.total,
    running: summary.running,
    idle: summary.idle,
    avgPower: summary.avgPower,
  }), [summary]);

  // Memoize modal close handler
  const handleCloseModal = useCallback(() => {
    setSelectedModel(null);
  }, []);

  // Tick every 30s to update the relative time label
  useEffect(() => {
    if (!lastUpdated) return;
    const id = setInterval(() => setNowTs(Date.now()), 30000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  // Friendly relative label for last updated
  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return '';
    const diffMs = nowTs - lastUpdated.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins <= 0) return 'just now';
    if (mins === 1) return '1 min ago';
    return `${mins} mins ago`;
  }, [lastUpdated, nowTs]);

  // Adjust columns and table data to use resources
  const columns = useMemo<ColumnDef<GPUResource>[]>(() => [
    { accessorKey: "gpu", header: "GPU" },
    { accessorKey: "memory", header: "Memory" },
    { accessorKey: "cluster", header: "Cluster" },
    { accessorKey: "uptime", header: "Uptime" },
    { accessorKey: "temperature", header: "Temperature (°C)" },
    { accessorKey: "power", header: "Power Usage (W)" },
    { accessorKey: "processes", header: "Processes" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return renderStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedModel(row.original)}
          className="bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Details
        </button>
      ),
    },
  ], []);

  const table = useReactTable({
    data: resources,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Replace mock delay
  useEffect(() => {
    if (resources.length > 0) setLoading(false);
  }, [resources]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const t = localStorage.getItem("auth_token");
      if (!t) {
        router.replace("/login");
      }
    } catch { }
  }, [router]);

  // If superadmin, render superadmin panel immediately (no customer id required)
  if (role === 'superadmin') {
    return <SuperadminDashboard />;
  }

  if (loading || customerId === undefined) return <Loader />;

  // If no customer id was provided in the path, show a friendly empty state.
  if (customerId === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">Customer ID Required</h2>
          <p className="text-gray-600 text-sm max-w-md">Please access the dashboard via /dashboard/&lt;customer_id&gt;. Example: /dashboard/111111</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="relative rounded-2xl border border-slate-200 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-indigo-100/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-sky-100/20 rounded-full blur-2xl" />
        </div>
        {/* dashboard card */}
        <div className="relative px-5 sm:px-7 py-6 overflow-hidden rounded-lg bg-gradient-to-b from-slate-400 via-slate-400/90 to-slate-700
">
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30">
                  <Cpu size={30} className="drop-shadow" />
                  <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition duration-500 blur-lg bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/30 to-purple-600/40" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap" />
                  <p className="mt-1 text-sm text-gray-600 font-medium flex items-center gap-2">
                    {/* Company name badge (enhanced) */}
                    <span
                      className="relative inline-flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-lg text-base sm:text-2xl font-semibold tracking-tight bg-white ring-1 ring-slate-200 shadow-sm focus:outline-none cursor-default select-none text-slate-800"
                      aria-label={`Company: ${customerName}`}
                      title={customerName}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow" />
                      <span className="leading-none">{customerName}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {(() => {
                    const btn = "inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-500 text-white hover:cursor-pointer shadow hover:shadow-lg transition active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-60";
                    return (
                      <>
                        <button className={btn} onClick={async () => {
                          try {
                            const data = await fetchDashboard(customerId as string);
                            const transformed: GPUResource[] = (data.resources || []).map((r: DashboardAPIResource) => ({
                              id: r.id,
                              gpu: r.gpu,
                              memory: `${r.memory_gb} GB`,
                              cluster: r.cluster,
                              status: capitalizeStatus(r.status),
                              uptime: secondsToH(r.uptime_sec),
                              temperature: r.temperature_c,
                              power: r.power_w,
                              processes: r.processes,
                            }));
                            setResources(transformed);
                            setSummary({
                              total: data.summary?.total || 0,
                              running: data.summary?.running || 0,
                              idle: data.summary?.idle || 0,
                              avgPower: data.summary?.avg_power || 0,
                            });
                            setLastUpdated(new Date());
                          } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Refresh failed'; pushError(msg, { title: 'Dashboard' }); }
                        }}>
                          <RefreshCw size={14} /> Refresh
                        </button>
                        <button className={btn} onClick={() => setShowAddModal(true)}>
                          <PlusCircle size={15} /> Add GPU
                        </button>
                        {lastUpdated && (
                          <span
                            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs ml-1 sm:ml-2 whitespace-nowrap px-2.5 py-1 rounded-md bg-white/95 text-slate-800 ring-1 ring-indigo-300 shadow-sm"
                            title={lastUpdated.toLocaleString()}
                          >
                            <RefreshCw size={12} className="text-indigo-500" />
                            <span className="font-semibold">Last updated</span>
                            <span className="text-slate-600">• {lastUpdatedLabel}</span>
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
                {/* lastUpdated badge removed */}
              </div>
            </div>

            {/* Mini KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* UTIL% */}
              {/* Total Users */}
              <div className="relative group/kpi rounded-xl border border-indigo-400 ring-1 ring-indigo-300/50 bg-white/95 backdrop-blur-md px-3 py-3 shadow-md shadow-indigo-300/50 hover:shadow-lg hover:shadow-indigo-400/60 group-hover/kpi:-translate-y-1 group-hover/kpi:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_70%)]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 tracking-wide">UTIL%</span>
                  <Activity size={14} className="text-indigo-500" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">72%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 animate-[pulse_3s_ease-in-out_infinite]"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>

              {/* Revenue */}
              <div className="relative group/kpi rounded-xl border border-pink-400 ring-1 ring-pink-300/50 bg-white/95 backdrop-blur-md px-3 py-3 shadow-md shadow-pink-300/50 hover:shadow-lg hover:shadow-pink-400/60 group-hover/kpi:-translate-y-1 group-hover/kpi:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.15),transparent_70%)]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 tracking-wide">AVG TEMP</span>
                  <span className="text-xs font-bold text-pink-600">℃</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">62</span>
                </div>
                <div className="mt-2 h-1 w-full flex gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-sm ${i < 8 ? "bg-pink-500" : "bg-pink-200"} h-full`}
                    />
                  ))}
                </div>
              </div>

              {/* Active Sessions */}
              <div className="relative group/kpi rounded-xl border border-teal-400 ring-1 ring-teal-300/50 bg-white/95 backdrop-blur-md px-3 py-3 shadow-md shadow-teal-300/50 hover:shadow-lg hover:shadow-teal-400/60 group-hover/kpi:-translate-y-1 group-hover/kpi:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.15),transparent_70%)]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 tracking-wide">POWER W</span>
                  <Zap size={14} className="text-teal-500" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">1,240</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-600 font-semibold">
                    Stable
                  </span>
                </div>
                <div className="mt-2 flex items-end gap-0.5 h-8">
                  {[5, 7, 6, 8, 5, 9, 6, 7].map((v, i) => (
                    <span
                      key={i}
                      className="flex-1 bg-gradient-to-t from-teal-300 to-teal-600 rounded-t"
                      style={{ height: `${v * 6}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Growth */}
              <div className="relative group/kpi rounded-xl border border-amber-400 ring-1 ring-amber-300/50 bg-white/95 backdrop-blur-md px-3 py-3 shadow-md shadow-amber-300/50 hover:shadow-lg hover:shadow-amber-400/60 group-hover/kpi:-translate-y-1 group-hover/kpi:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_70%)]" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 tracking-wide">STATUS</span>
                  <span className="text-xs font-bold text-amber-600">LIVE</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">{statsData.running}/{statsData.total}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 font-semibold">
                    Running
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded bg-amber-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 animate-[pulse_3s_ease-in-out_infinite]"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard title="Total GPUs" value={statsData.total} icon={Server} palette="blue" />
        <StatCard title="Running" value={statsData.running} icon={PlayCircle} palette="emerald" />
        <StatCard title="Idle" value={statsData.idle} icon={PauseCircle} palette="amber" />
        <StatCard title="Avg. Power" value={<>{statsData.avgPower}<span className='text-xl sm:text-2xl'>W</span></>} icon={Zap} palette="orange" />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search GPUs, clusters..."
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pl-10 sm:pl-12 border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-sm sm:text-base"
          />
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">
            🔍
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Mobile Card View (hidden on desktop) */}
        <div className="block lg:hidden">
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <h3 className="font-semibold text-sm sm:text-base">GPU Resources ({statsData.total})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{row.original.gpu}</div>
                      <div className="text-xs text-gray-600">{row.original.memory} • {row.original.cluster}</div>
                    </div>
                    <div className="text-right">
                      {renderStatusBadge(row.original.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Uptime: <span className="font-medium">{row.original.uptime}</span></div>
                    <div>Temp: <span className="font-medium">{row.original.temperature}°C</span></div>
                    <div>Power: <span className="font-medium">{row.original.power}W</span></div>
                    <div>Processes: <span className="font-medium">{row.original.processes}</span></div>
                  </div>

                  <button
                    onClick={() => setSelectedModel(row.original)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-sm text-white">
                  {headerGroup.headers.map((header) => {
                    const isCenter = ["status", "actions"].includes(header.column.id);
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-6 py-4 font-semibold cursor-pointer select-none transition-colors duration-200 hover:bg-white/10 ${isCenter ? "text-center" : "text-left"}`}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="text-white/60">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕️"}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="text-sm text-gray-800 bg-white">
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 ${i % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white"
                    }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isCenter = ["status", "actions"].includes(cell.column.id);
                    return (
                      <td
                        key={cell.id}
                        className={`px-6 py-4 ${isCenter ? "text-center" : "text-left"}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center gap-3 p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
            <span className="hidden sm:inline">Rows per page:</span>
            <span className="sm:hidden">Per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border rounded-md px-2 py-1 text-xs sm:text-sm"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 order-last sm:order-none">
            <span className="hidden sm:inline">
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
              {table.getPageCount()}
            </span>
            <span className="sm:hidden">
              <strong>{table.getState().pagination.pageIndex + 1}</strong>/{table.getPageCount()}
            </span>
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-12 sm:w-16 border rounded-md px-1 sm:px-2 py-1 text-xs sm:text-sm"
            />
          </div>

          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
              className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm"
            >
              <ChevronsLeft size={14} className="sm:hidden" />
              <ChevronsLeft size={18} className="hidden sm:block" />
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
              className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm"
            >
              <ChevronLeft size={14} className="sm:hidden" />
              <ChevronLeft size={18} className="hidden sm:block" />
            </button>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
              className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm"
            >
              <ChevronRight size={14} className="sm:hidden" />
              <ChevronRight size={18} className="hidden sm:block" />
            </button>

            <button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to last page"
              className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm"
            >
              <ChevronsRight size={14} className="sm:hidden" />
              <ChevronsRight size={18} className="hidden sm:block" />
            </button>
          </div>

        </div>
      </div>

      {/* Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
            {/* Header with close icon */}
            <div className="flex justify-between items-center border-b p-4 sm:p-6 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">GPU Resource Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-800 transition p-1"
              >
                <X size={20} className="sm:hidden" />
                <X size={22} className="hidden sm:block" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-sm sm:text-base"><span className="font-semibold">GPU:</span> {selectedModel.gpu}</div>
                <div className="text-sm sm:text-base"><span className="font-semibold">Memory:</span> {selectedModel.memory}</div>
                <div className="text-sm sm:text-base"><span className="font-semibold">Cluster:</span> {selectedModel.cluster}</div>
                <div className="text-sm sm:text-base"><span className="font-semibold">Uptime:</span> {selectedModel.uptime}</div>
                <div className="text-sm sm:text-base"><span className="font-semibold">Temperature:</span> {selectedModel.temperature}°C</div>
                <div className="text-sm sm:text-base"><span className="font-semibold">Power Usage:</span> {selectedModel.power}W</div>
                <div className="text-sm sm:text-base"><span className="font-semibold">Processes Running:</span> {selectedModel.processes}</div>
                <div className="col-span-1 sm:col-span-2 text-sm sm:text-base">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="ml-2 inline-block align-middle">{renderStatusBadge(selectedModel.status)}</span>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">GPU Utilization Over Time</h3>
                  <div className="h-40 sm:h-48 lg:h-56">
                    <Line
                      data={lineChartData}
                      options={chartOptions.line}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Memory Usage</h3>
                  <div className="h-40 sm:h-48 lg:h-56">
                    <Pie
                      data={pieChartData}
                      options={chartOptions.pie}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Detailed GPU Statistics</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700">
                  <li>Driver Version: <span className="font-medium">535.86</span></li>
                  <li>CUDA Version: <span className="font-medium">12.1</span></li>
                  <li>SM Utilization: <span className="font-medium">68%</span></li>
                  <li>Memory Bandwidth: <span className="font-medium">1555 GB/s</span></li>
                  <li>PCIe Bandwidth: <span className="font-medium">32 GB/s</span></li>
                  <li>Error Rate: <span className="font-medium">0%</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add GPU Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Add GPU Resource</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-800 transition">
                <X size={22} />
              </button>
            </div>

            {addError && (
              <div className="mb-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">{addError}</div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!customerId) {
                  setAddError('customer_id is required');
                  return;
                }
                setAdding(true);
                setAddError(null);
                const payload: AddGPURequest = {
                  customer_id: customerId,
                  model: addForm.model.trim(),
                  memory_gb: typeof addForm.memory_gb === 'number' ? addForm.memory_gb : parseInt(String(addForm.memory_gb || 0), 10),
                  memory_used_gb: typeof addForm.memory_used_gb === 'number' ? addForm.memory_used_gb : parseInt(String(addForm.memory_used_gb || 0), 10),
                  cluster: addForm.cluster.trim() || undefined,
                  status: addForm.status,
                };
                const res = await addGPUResource(payload);
                if (res.error) {
                  setAddError(res.error);
                  setAdding(false);
                  return;
                }
                setShowAddModal(false);
                setAddForm({ model: '', memory_gb: '', memory_used_gb: 0, cluster: '', status: 'available' });
                // Adding to gpu_resources won't reflect in dashboard list immediately; show success toast.
                pushSuccess('GPU added successfully', { title: 'Add GPU' });
                setAdding(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Model</label>
                  <input
                    required
                    value={addForm.model}
                    onChange={(e) => setAddForm(f => ({ ...f, model: e.target.value }))}
                    placeholder="e.g., NVIDIA A100"
                    className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Memory (GB)</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={addForm.memory_gb}
                    onChange={(e) => setAddForm(f => ({ ...f, memory_gb: e.target.value === '' ? '' : Number(e.target.value) }))}
                    placeholder="40"
                    className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Used (GB)</label>
                  <input
                    type="number"
                    min={0}
                    value={addForm.memory_used_gb}
                    onChange={(e) => setAddForm(f => ({ ...f, memory_used_gb: e.target.value === '' ? 0 : Number(e.target.value) }))}
                    placeholder="0"
                    className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Cluster</label>
                  <input
                    value={addForm.cluster}
                    onChange={(e) => setAddForm(f => ({ ...f, cluster: e.target.value }))}
                    placeholder="cluster-1"
                    className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === 'available' || v === 'allocated' || v === 'offline') {
                        setAddForm(f => ({ ...f, status: v }));
                      }
                    }}
                    className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" disabled={adding} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 text-sm">
                  {adding ? 'Adding…' : 'Add GPU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
