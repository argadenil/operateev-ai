"use client";

import React, { useEffect } from "react";
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
import { X, Copy, RefreshCcw, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, CheckCircle, Lock, PowerOff, BarChart3, Server, Activity, Thermometer, Zap } from "lucide-react";

type GPU = {
  id: number;
  model: string;
  memory: string; // total memory string
  memoryUsedGB: number;
  cluster: string;
  status: "available" | "allocated" | "offline";
  utilization: number;
  temperature: number;
  power: number;
  uptime: string;
};

const initialGPUList: GPU[] = [
  { id: 1, model: "NVIDIA A100", memory: "80 GB", memoryUsedGB: 42, cluster: "Cluster-A", status: "available", utilization: 55, temperature: 62, power: 245, uptime: "120h" },
  { id: 2, model: "NVIDIA V100", memory: "32 GB", memoryUsedGB: 29, cluster: "Cluster-B", status: "allocated", utilization: 91, temperature: 78, power: 280, uptime: "340h" },
  { id: 3, model: "RTX 4090", memory: "24 GB", memoryUsedGB: 0, cluster: "Cluster-C", status: "offline", utilization: 0, temperature: 0, power: 0, uptime: "0h" },
  { id: 4, model: "Tesla T4", memory: "16 GB", memoryUsedGB: 11, cluster: "Cluster-A", status: "allocated", utilization: 68, temperature: 70, power: 140, uptime: "56h" },
  { id: 5, model: "NVIDIA A100", memory: "80 GB", memoryUsedGB: 75, cluster: "Cluster-D", status: "allocated", utilization: 95, temperature: 74, power: 310, uptime: "512h" },
  { id: 6, model: "RTX 6000 Ada", memory: "48 GB", memoryUsedGB: 6, cluster: "Cluster-B", status: "available", utilization: 18, temperature: 54, power: 90, uptime: "12h" },
  { id: 7, model: "A40", memory: "48 GB", memoryUsedGB: 43, cluster: "Cluster-C", status: "allocated", utilization: 76, temperature: 69, power: 230, uptime: "210h" },
  { id: 8, model: "H100", memory: "94 GB", memoryUsedGB: 12, cluster: "Cluster-E", status: "available", utilization: 22, temperature: 51, power: 180, uptime: "33h" },
  { id: 9, model: "A10", memory: "24 GB", memoryUsedGB: 19, cluster: "Cluster-B", status: "allocated", utilization: 84, temperature: 72, power: 200, uptime: "400h" },
  { id: 10, model: "NVIDIA V100", memory: "32 GB", memoryUsedGB: 7, cluster: "Cluster-A", status: "available", utilization: 15, temperature: 49, power: 120, uptime: "8h" },
];

// Reusable badge styled similarly to dashboard statuses
const renderStatusBadge = (status: GPU["status"]) => {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm border transition-colors duration-300 capitalize";
  const map: Record<GPU["status"], { wrap: string; dot: string }> = {
    available: {
      wrap:
        "bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/20 text-emerald-700 border-emerald-500/30 ring-1 ring-inset ring-emerald-500/20",
      dot: "bg-emerald-500 animate-pulse",
    },
    allocated: {
      wrap:
        "bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-indigo-500/20 text-blue-700 border-blue-500/30 ring-1 ring-inset ring-blue-500/20",
      dot: "bg-blue-500",
    },
    offline: {
      wrap:
        "bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-rose-500/20 text-rose-700 border-rose-500/30 ring-1 ring-inset ring-rose-500/20",
      dot: "bg-rose-500",
    },
  };
  const { wrap, dot } = map[status];
  return (
    <span className={`${base} ${wrap}`} aria-label={`Status: ${status}`}>
      <span className={`w-2 h-2 rounded-full shadow-inner ${dot}`} />
      {status}
    </span>
  );
};

export default function GPUResourcesPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<GPU["status"] | "all">("all");
  const [clusterFilter, setClusterFilter] = React.useState<string>("all");
  const [loading, setLoading] = React.useState(true);
  const [selectedGPU, setSelectedGPU] = React.useState<GPU | null>(null);
  const [gpuData, setGpuData] = React.useState<GPU[]>(initialGPUList);

  const parseTotalMemory = (gpu: GPU) => {
    const m = gpu.memory.match(/(\d+)\s*GB/i);
    return m ? parseInt(m[1], 10) : 0;
  };

  const simulateMetrics = () => {
    setGpuData(prev => prev.map(g => {
      if (g.status === "offline") return { ...g, utilization: 0, temperature: 0, power: 0, memoryUsedGB: 0 };
      const total = parseTotalMemory(g);
      const nextUtil = Math.max(0, Math.min(100, Math.round(g.utilization + (Math.random()*20 - 10))));
      const nextTemp = Math.max(30, Math.min(85, Math.round(g.temperature + (Math.random()*6 - 3))));
      const nextPower = Math.max(50, Math.min(350, Math.round(g.power + (Math.random()*40 - 20))));
      const nextMemUsed = Math.max(0, Math.min(total, Math.round(g.memoryUsedGB + (Math.random()*6 - 3))));
      return { ...g, utilization: nextUtil, temperature: nextTemp, power: nextPower, memoryUsedGB: nextMemUsed };
    }));
  };

  const utilizationColor = (u: number) => {
    if (u >= 85) return "bg-emerald-500";
    if (u >= 60) return "bg-blue-500";
    if (u >= 30) return "bg-amber-500";
    return "bg-rose-500";
  };

  const columns: ColumnDef<GPU>[] = [
    { accessorKey: "model", header: "Model" },
    { accessorKey: "cluster", header: "Cluster" },
    {
      accessorKey: "memory",
      header: "Memory (Used)",
      cell: ({ row }) => {
        const g = row.original;
        const total = parseTotalMemory(g);
        const pct = total ? Math.round((g.memoryUsedGB / total) * 100) : 0;
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
              <span>{g.memoryUsedGB} / {total} GB</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "utilization",
      header: "Util (%)",
      cell: ({ getValue }) => {
        const val = getValue<number>() ?? 0;
        return (
          <div className="space-y-1 w-[90px]">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600"><span>{val}%</span></div>
            <div className="h-1.5 rounded bg-slate-100 overflow-hidden">
              <div className={`h-full ${utilizationColor(val)} transition-all duration-500`} style={{ width: `${val}%` }} />
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "temperature",
      header: "Temp (°C)",
      cell: ({ getValue }) => {
        const t = getValue<number>() ?? 0;
        const color = t >= 75 ? "text-rose-600" : t >= 65 ? "text-amber-600" : "text-slate-700";
        return <span className={`font-medium ${color}`}>{t}</span>;
      }
    },
    {
      accessorKey: "power",
      header: "Power (W)",
      cell: ({ getValue }) => <span className="font-medium text-slate-700">{getValue<number>()}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as GPU["status"];
        return renderStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedGPU(row.original)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow hover:shadow-md text-xs"
        >
          Details
        </button>
      ),
    },
  ];

  const filteredData = gpuData.filter((gpu) =>
    (statusFilter === "all" || gpu.status === statusFilter) &&
    (clusterFilter === "all" || gpu.cluster === clusterFilter) &&
    (globalFilter === "" || Object.values(gpu).some(v => String(v).toLowerCase().includes(globalFilter.toLowerCase())))
  );

  const table = useReactTable({
    data: filteredData,
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
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const gpuSummary = {
    available: gpuData.filter((g) => g.status === "available").length,
    allocated: gpuData.filter((g) => g.status === "allocated").length,
    offline: gpuData.filter((g) => g.status === "offline").length,
  };

  const totalGPUs = gpuData.length;
  const allocationRate = totalGPUs ? Math.round((gpuSummary.allocated / totalGPUs) * 100) : 0;
  const totalMemoryGB = gpuData.reduce((sum, g) => {
    const m = g.memory.match(/(\d+)\s*GB/i);
    return sum + (m ? parseInt(m[1], 10) : 0);
  }, 0);
  const avgUtil = totalGPUs ? Math.round(gpuData.reduce((a, g) => a + g.utilization, 0) / totalGPUs) : 0;
  const avgTemp = totalGPUs ? Math.round(gpuData.reduce((a, g) => a + g.temperature, 0) / totalGPUs) : 0;
  const totalPower = gpuData.reduce((a, g) => a + g.power, 0);
  const clusters = Array.from(new Set(gpuData.map(g => g.cluster)));

  const exportCSV = () => {
    const header = ["ID", "Model", "Cluster", "Memory", "MemoryUsedGB", "Utilization", "Temperature", "Power", "Status", "Uptime"];
    const rows = filteredData.map((g) => [g.id, g.model, g.cluster, g.memory, g.memoryUsedGB, g.utilization, g.temperature, g.power, g.status, g.uptime]);
    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gpu_list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col space-y-6 min-h-[70vh]">
      {/* Stats Overview (Enhanced to match Dashboard) */}
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {/* Total GPUs (updated color from slate/gray to amber) */}
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-amber-50/70 border border-amber-300/70 ring-1 ring-inset ring-amber-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-orange-500/20" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-amber-700">Total GPUs</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-amber-800">{totalGPUs}</p>
              <p className="text-[10px] sm:text-xs mt-1 font-medium text-amber-600">{totalMemoryGB} GB aggregate</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-300/60 to-orange-400/60 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/30 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-amber-500/30 shadow-inner shadow-amber-500/20">
                <Server className="text-amber-600 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>
        {/* Available */}
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-emerald-50/70 border border-emerald-300/70 ring-1 ring-inset ring-emerald-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-emerald-700">Available</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-emerald-700">{gpuSummary.available}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/50 to-green-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-emerald-500/30 shadow-inner shadow-emerald-500/20">
                <CheckCircle className="text-emerald-600 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Allocated */}
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-blue-50/70 border border-blue-300/70 ring-1 ring-inset ring-blue-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700">Allocated</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-blue-700">{gpuSummary.allocated}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/50 to-indigo-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-blue-500/30 shadow-inner shadow-blue-500/20">
                <Lock className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Offline */}
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-red-50/70 border border-red-300/70 ring-1 ring-inset ring-red-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-red-700">Offline</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-red-700">{gpuSummary.offline}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/50 to-rose-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-red-500/30 shadow-inner shadow-red-500/20">
                <PowerOff className="text-red-600 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>

  {/* Allocation Rate */}
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-violet-50/70 border border-violet-300/70 ring-1 ring-inset ring-violet-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-violet-700">Allocation Rate</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-violet-700">{allocationRate}%</p>
              <p className="text-[10px] sm:text-xs mt-1 font-medium text-violet-500">{gpuSummary.allocated} / {totalGPUs} allocated</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/50 to-fuchsia-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-violet-500/30 shadow-inner shadow-violet-500/20">
                <BarChart3 className="text-violet-600 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>
        {/* Avg Utilization */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-emerald-50/70 border border-emerald-300/70 ring-1 ring-inset ring-emerald-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/10" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-emerald-700">Avg Utilization</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-emerald-700">{avgUtil}%</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/50 to-emerald-600/50 blur opacity-50 group-hover:opacity-70 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-emerald-500/30 shadow-inner shadow-emerald-500/20">
                <Activity className="text-emerald-600 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
  </div>

  {/* Removed Avg Temperature and Total Power cards to allow more space for remaining cards */}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <div className="flex flex-col w-full sm:w-64">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Search</label>
            <input
              placeholder="Search model, cluster, status..."
              className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
            <div className="flex flex-col w-full sm:w-40">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Status</label>
            <select
              className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="flex flex-col w-full sm:w-44">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Cluster</label>
            <select
              className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All</option>
              {clusters.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 md:ml-auto">

          <button
            onClick={exportCSV}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center gap-2 w-full sm:w-auto justify-center text-sm shadow"
          >
            <Copy size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-sm text-white">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-4 font-semibold cursor-pointer select-none transition-colors duration-200 hover:bg-white/10 text-left"
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
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm text-gray-800 bg-white">
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-200 ${i % 2 === 0 ? "bg-gray-50/30" : "bg-white"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-left">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <h3 className="font-semibold text-sm">GPU Resources ({filteredData.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{row.original.model}</div>
                      <div className="text-xs text-gray-600">{row.original.cluster} • {row.original.memory}</div>
                      <div className="text-[10px] text-gray-500 mt-1">Util: {row.original.utilization}% • Temp: {row.original.temperature}°C</div>
                    </div>
                    <div className="text-right">
                      {renderStatusBadge(row.original.status)}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGPU(row.original)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 order-last sm:order-none">
            <span className="hidden sm:inline">Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of {table.getPageCount()}</span>
            <span className="sm:hidden"><strong>{table.getState().pagination.pageIndex + 1}</strong>/{table.getPageCount()}</span>
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
      {selectedGPU && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl p-4 sm:p-6 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">GPU Details</h2>
              <button
                onClick={() => setSelectedGPU(null)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X size={22} />
              </button>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700">
              <li><span className="font-semibold">Model:</span> {selectedGPU.model}</li>
              <li><span className="font-semibold">Cluster:</span> {selectedGPU.cluster}</li>
              <li><span className="font-semibold">Status:</span> {renderStatusBadge(selectedGPU.status)}</li>
              <li><span className="font-semibold">Uptime:</span> {selectedGPU.uptime}</li>
              <li><span className="font-semibold">Memory:</span> {selectedGPU.memoryUsedGB} GB / {selectedGPU.memory}</li>
              <li><span className="font-semibold">Utilization:</span> {selectedGPU.utilization}%</li>
              <li><span className="font-semibold">Temperature:</span> {selectedGPU.temperature}°C</li>
              <li><span className="font-semibold">Power:</span> {selectedGPU.power} W</li>
              {/* Could also render the badge inside the modal if preferred: */}
              {/* <li><span className="font-semibold">Status:</span> <span className="ml-2">{renderStatusBadge(selectedGPU.status)}</span></li> */}
            </ul>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Utilization Trend (Dummy)</h3>
              <Sparkline utilization={selectedGPU.utilization} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Sparkline: React.FC<{ utilization: number }> = ({ utilization }) => {
  const points = React.useMemo(() => {
    const arr = Array.from({ length: 24 }, () => {
      const variance = (Math.random() * 14) - 7;
      return Math.max(0, Math.min(100, utilization + variance));
    });
    return arr;
  }, [utilization]);
  const max = 100;
  const width = 240;
  const height = 50;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / max) * height;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="w-full max-w-xs">
      <path d={path} fill="none" strokeWidth={2} className="stroke-indigo-500" strokeLinecap="round" />
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
      </linearGradient>
      <path d={path + ` L ${width},${height} L 0,${height} Z`} fill="url(#sparkGrad)" opacity={0.4} />
    </svg>
  );
};
