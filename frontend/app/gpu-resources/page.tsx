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
import { X, Copy, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, CheckCircle, BarChart3, Server, Activity } from "lucide-react";
import StatCard from "../components/stat-card";
import { fetchGPUResources, formatMemory, secondsToPretty, GPUResourceAPIShape, GPUResourcesResponseAPIShape } from "@/lib/gpu-resources";
import { getToken } from "@/lib/auth";

type GPU = {
  id: number;
  model: string;
  memory: string; // formatted memory string for display
  memoryUsedGB: number;
  cluster: string;
  status: "available" | "allocated" | "offline";
  utilization: number;
  temperature: number;
  power: number;
  uptime: string;
};

// Initial empty state - will be populated from API
const initialGPUList: GPU[] = [];

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
  const [customerId, setCustomerId] = React.useState<string | null | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);

  // Parse customer id from URL path or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return; // client only
    const match = window.location.pathname.match(/^\/gpu-resources\/([^\/]+)$/);
    if (match) {
      setCustomerId(match[1]);
      return;
    }
    
    // No ID in path -> try localStorage
    try {
      const storedId = localStorage.getItem('customer_id');
      if (storedId) {
        // Redirect to canonical /gpu-resources/{customer_id}
        window.history.replaceState(null, '', `/gpu-resources/${storedId}`);
        setCustomerId(storedId);
        return;
      }
    } catch { /* ignore */ }
    
    setCustomerId(null); // explicitly missing
  }, []);

  // Transform API response to component format
  const transformGPUData = (apiGpu: GPUResourceAPIShape): GPU => ({
    id: apiGpu.id,
    model: apiGpu.model,
    memory: formatMemory(apiGpu.memory_gb, apiGpu.memory_used_gb),
    memoryUsedGB: apiGpu.memory_used_gb,
    cluster: apiGpu.cluster,
    status: (apiGpu.status === 'available' || apiGpu.status === 'allocated' || apiGpu.status === 'offline') 
      ? apiGpu.status : 'offline',
    utilization: apiGpu.utilization,
    temperature: apiGpu.temperature_c,
    power: apiGpu.power_w,
    uptime: secondsToPretty(apiGpu.uptime_sec),
  });

  // Fetch GPU data from API
  useEffect(() => {
    if (customerId === undefined) return; // waiting for parse
    if (customerId === null) {
      setError('customer_id is required');
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchGPUResources(customerId)
      .then(response => {
        if (cancelled) return;
        
        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }

        const transformedData = response.gpus.map(transformGPUData);
        setGpuData(transformedData);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        console.error("Error fetching GPU resources:", err);
        setError(err.message || 'Failed to load GPU resources');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const parseTotalMemory = (gpu: GPU) => {
    const m = gpu.memory.match(/(\d+)\s*GB/i);
    return m ? parseInt(m[1], 10) : 0;
  };

  // const simulateMetrics = () => { /* removed unused simulation to satisfy lint */ };

  const utilizationColor = (u: number) => {
    if (u >= 85) return "bg-emerald-500";
    if (u >= 60) return "bg-blue-500";
    if (u >= 30) return "bg-amber-500";
    return "bg-rose-500";
  };

  const columns: ColumnDef<GPU>[] = React.useMemo(() => [
    { accessorKey: "model", header: "Model" },
    { accessorKey: "cluster", header: "Cluster" },
    {
      accessorKey: "memory",
      header: "Memory (Used)",
      sortingFn: (a, b, id) => {
        const parse = (v: string) => {
          const m = v.match(/(\d+)/); return m ? parseInt(m[1], 10) : 0;
        };
        return parse(a.getValue(id) as string) - parse(b.getValue(id) as string);
      },
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
      sortingFn: (a, b, id) => (a.getValue(id) as string).localeCompare(b.getValue(id) as string),
      cell: ({ getValue }) => {
        const status = getValue() as GPU["status"];
        return renderStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedGPU(row.original)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow hover:shadow-md text-xs"
        >
          Details
        </button>
      ),
    },
  ], [setSelectedGPU]);

  const filteredData = React.useMemo(() => (
    gpuData.filter((gpu) =>
      (statusFilter === "all" || gpu.status === statusFilter) &&
      (clusterFilter === "all" || gpu.cluster === clusterFilter) &&
      (globalFilter === "" || Object.values(gpu).some(v => String(v).toLowerCase().includes(globalFilter.toLowerCase())))
    )
  ), [gpuData, statusFilter, clusterFilter, globalFilter]);

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
  // const avgTemp = totalGPUs ? Math.round(gpuData.reduce((a, g) => a + g.temperature, 0) / totalGPUs) : 0;
  // const totalPower = gpuData.reduce((a, g) => a + g.power, 0);
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

  if (loading || customerId === undefined) return <Loader />;

  // If no customer id was provided in the path, show a friendly empty state.
  if (customerId === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800">Customer ID Required</h2>
          <p className="text-gray-600 text-sm max-w-md">Please access the GPU resources via /gpu-resources/&lt;customer_id&gt;. Example: /gpu-resources/111111</p>
        </div>
      </div>
    );
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-semibold text-red-600">Error Loading GPU Resources</h2>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 min-h-[70vh]">
      {/* Stats Overview (Enhanced to match Dashboard) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total GPUs"
          value={totalGPUs}
          icon={Server}
          palette="amber"
          size="sm"
          description={`${totalMemoryGB} GB aggregate`}
        />
        <StatCard
          title="Available"
            value={gpuSummary.available}
            icon={CheckCircle}
            palette="emerald"
            size="sm"
        />
        <StatCard
          title="Allocated"
          value={gpuSummary.allocated}
          icon={CheckCircle}
          palette="blue"
          size="sm"
        />
        <StatCard
          title="Offline"
          value={gpuSummary.offline}
          icon={Activity}
          palette="red"
          size="sm"
        />
        <StatCard
          title="Allocation Rate"
          value={`${allocationRate}%`}
          icon={BarChart3}
          palette="violet"
          size="sm"
          description={`${gpuSummary.allocated} / ${totalGPUs} allocated`}
          descriptionClassName="text-violet-500"
        />
        <StatCard
          title="Avg Utilization"
          value={`${avgUtil}%`}
          icon={Activity}
          palette="emerald"
          size="sm"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <div className="flex flex-col w-full sm:w-64">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Search</label>
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search model, cluster, status..."
              className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="flex flex-col w-full sm:w-40">
            <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all' || val === 'available' || val === 'allocated' || val === 'offline') {
                  setStatusFilter(val);
                }
              }}
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
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
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
                  {headerGroup.headers.map((header) => {
                    const isCenter = ["status", "actions"].includes(header.column.id);
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-6 py-4 font-semibold cursor-pointer select-none transition-colors duration-200 hover:bg-white/10 ${isCenter ? 'text-center' : 'text-left'}`}
                      >
                        <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}>
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
                      <td key={cell.id} className={`px-6 py-4 ${isCenter ? 'text-center' : 'text-left'}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
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
