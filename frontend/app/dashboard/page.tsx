"use client";

import React, { useEffect, useMemo, useCallback } from "react";
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
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Cpu, PlayCircle, PauseCircle, Zap, PlusCircle, BarChart3, RefreshCw, Activity, Settings2 } from "lucide-react";

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

// Move data outside component to prevent recreation
const mockGPUData: GPUResource[] = [
  { id: 1, gpu: "NVIDIA A100", memory: "80 GB", cluster: "Cluster-A", status: "Running", uptime: "72h", temperature: 65, power: 250, processes: 12 },
  { id: 2, gpu: "RTX 4090", memory: "24 GB", cluster: "Cluster-C", status: "Stopped", uptime: "0h", temperature: 40, power: 50, processes: 0 },
  { id: 3, gpu: "T4", memory: "16 GB", cluster: "Cluster-A", status: "Running", uptime: "36h", temperature: 70, power: 200, processes: 5 },
  { id: 4, gpu: "A40", memory: "48 GB", cluster: "Cluster-D", status: "Idle", uptime: "10h", temperature: 55, power: 120, processes: 1 },
  { id: 5, gpu: "A100", memory: "80 GB", cluster: "Cluster-B", status: "Running", uptime: "96h", temperature: 72, power: 280, processes: 20 },
  { id: 6, gpu: "RTX 6000 Ada", memory: "48 GB", cluster: "Cluster-B", status: "Idle", uptime: "8h", temperature: 50, power: 100, processes: 2 },
];

// (Old getStatusColor removed; using unified renderStatusBadge)

// Fancy status badge renderer (centralized styling)
const renderStatusBadge = (status: string) => {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm border transition-colors duration-300";
  const styles: Record<string, string> = {
    Running:
      "bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 ring-1 ring-inset ring-emerald-500/20", // green
    Idle:
      "bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 ring-1 ring-inset ring-amber-500/20", // amber
  };
  const fallback =
    "bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30 ring-1 ring-inset ring-rose-500/20";

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

const Dashboard = React.memo(() => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState<GPUResource | null>(null);

  // Memoize chart data
  const lineChartData = useMemo(() => createLineChartData(), []);
  const pieChartData = useMemo(() => createPieChartData(), []);

  // Memoize expensive calculations
  const statsData = useMemo(() => {
    const runningCount = mockGPUData.filter(gpu => gpu.status === 'Running').length;
    const idleCount = mockGPUData.filter(gpu => gpu.status === 'Idle').length;
    const avgPower = Math.round(mockGPUData.reduce((acc, gpu) => acc + gpu.power, 0) / mockGPUData.length);

    return {
      total: mockGPUData.length,
      running: runningCount,
      idle: idleCount,
      avgPower
    };
  }, []);

  // Memoize modal close handler
  const handleCloseModal = useCallback(() => {
    setSelectedModel(null);
  }, []);

  // Memoize columns to prevent recreation
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
    data: mockGPUData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Customer Info (Innovative Enhanced) */}
      <div className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20 overflow-hidden">
        {/* Animated border sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.05)_0deg,rgba(255,255,255,0.35)_140deg,rgba(255,255,255,0.05)_300deg)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700" />
        <div className="relative rounded-2xl overflow-hidden bg-white/85 dark:bg-gray-900/70 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 px-5 sm:px-7 py-5 sm:py-6">
          {/* Decorative gradients */}
          <div className="pointer-events-none absolute -top-20 -right-32 w-80 h-80 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-indigo-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 via-sky-500/5 to-pink-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30">
                  <Cpu size={30} className="drop-shadow" />
                  <div className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-60 transition duration-500 blur-lg bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/30 to-purple-600/40" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap" />
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
                    {/* Company name badge (enhanced) */}
                    <span
                      className="relative inline-flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-lg text-base sm:text-2xl font-extrabold tracking-tight
                        bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-2 ring-gray-300 dark:ring-gray-600 shadow-sm
                        focus:outline-none cursor-default select-none"
                      aria-label="Company: TEST Corp"
                      title="TEST Corp"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow" />
                      <span className="leading-none">TEST Corp</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Shared button style extracted for consistency */}
                {(() => {
                  const btn = "inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-500 text-white hover:cursor-pointer shadow hover:shadow-lg transition active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-indigo-400/50";
                  return (
                    <>
                      <button className={btn}>
                        <RefreshCw size={14} /> Refresh
                      </button>
                      <button className={btn}>
                        <PlusCircle size={15} /> Add GPU
                      </button>
                      <button className={btn}>
                        <BarChart3 size={15} /> Reports
                      </button>
                      <button className={`hidden lg:inline-flex ${btn}`}>
                        <Settings2 size={15} /> Settings
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Mini KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative group/kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur px-3 py-3 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 tracking-wide">UTIL%</span>
                  <Activity size={14} className="text-indigo-500" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">72%</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">+5%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded bg-gray-200/70 dark:bg-gray-700/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[pulse_3s_ease-in-out_infinite] rounded" style={{ width: '72%' }} />
                </div>
              </div>
              <div className="relative group/kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 tracking-wide">AVG TEMP</span>
                  <span className="text-xs font-semibold text-amber-600">℃</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">62</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">+2</span>
                </div>
                <div className="mt-2 h-1 w-full flex gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (<span key={i} className={`flex-1 rounded-sm ${i < 8 ? 'bg-amber-400/70 dark:bg-amber-400/80' : 'bg-amber-200/50 dark:bg-amber-900/40'} h-full`} />))}
                </div>
              </div>
              <div className="relative group/kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 tracking-wide">POWER W</span>
                  <Zap size={14} className="text-indigo-500" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{statsData.avgPower}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">stable</span>
                </div>
                <div className="mt-2 flex items-end gap-0.5 h-8">
                  {[5, 7, 6, 8, 5, 9, 6, 7].map((v, i) => (<span key={i} className="flex-1 bg-gradient-to-t from-indigo-500/30 to-indigo-500/70 rounded-t" style={{ height: `${v * 6}px` }} />))}
                </div>
              </div>
              <div className="relative group/kpi rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 tracking-wide">STATUS</span>
                  <span className="text-xs font-semibold text-emerald-600">Live</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{statsData.running}/{statsData.total}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">Running</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${(statsData.running / statsData.total) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gray-100/70 dark:bg-gray-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-300 dark:border-gray-600 ring-1 ring-inset ring-gray-400/20 dark:ring-gray-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 via-transparent to-gray-500/30 dark:from-gray-600/30 dark:to-gray-500/20" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total GPUs</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">{statsData.total}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-300/60 to-gray-400/50 dark:from-gray-600/60 dark:to-gray-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-white/20 dark:bg-gray-700/30 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-gray-400/40 dark:ring-gray-500/40 shadow-inner shadow-gray-400/30">
                <Cpu className="text-gray-700 dark:text-gray-200 group-hover:scale-110 transition-transform" size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-50/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-emerald-300/70 ring-1 ring-inset ring-emerald-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Running</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 tracking-tight">{statsData.running}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/50 to-green-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-emerald-500/30 shadow-inner shadow-emerald-500/20">
                <PlayCircle className="text-emerald-600 group-hover:scale-110 transition-transform" size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 dark:bg-amber-50/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-300/70 ring-1 ring-inset ring-amber-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Idle</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 tracking-tight">{statsData.idle}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/50 to-yellow-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-amber-500/30 shadow-inner shadow-amber-500/20">
                <PauseCircle className="text-amber-600 group-hover:scale-110 transition-transform" size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50/70 dark:bg-indigo-50/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-indigo-300/70 ring-1 ring-inset ring-indigo-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-600/10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative">
            <div className="mb-2 sm:mb-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Power</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 tracking-tight">{statsData.avgPower}W</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400/50 to-purple-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-indigo-500/30 shadow-inner shadow-indigo-500/20">
                <Zap className="text-indigo-600 group-hover:scale-110 transition-transform" size={22} />
              </div>
            </div>
          </div>
        </div>
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
                  className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-200 ${i % 2 === 0 ? "bg-gray-50/30" : "bg-white"}`}
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
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
