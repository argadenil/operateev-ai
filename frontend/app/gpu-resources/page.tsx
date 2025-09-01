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
import { X, Copy, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, CheckCircle, Lock, PowerOff } from "lucide-react";

type GPU = {
  id: number;
  model: string;
  memory: string;
  cluster: string;
  status: "available" | "allocated" | "offline";
};

const gpuList: GPU[] = [
  { id: 1, model: "NVIDIA A100", memory: "80 GB", cluster: "Cluster-A", status: "available" },
  { id: 2, model: "NVIDIA V100", memory: "32 GB", cluster: "Cluster-B", status: "allocated" },
  { id: 3, model: "RTX 4090", memory: "24 GB", cluster: "Cluster-C", status: "offline" },
];

// Reusable badge styled similarly to dashboard statuses
const renderStatusBadge = (status: GPU["status"]) => {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm border transition-colors duration-300 capitalize";
  const map: Record<GPU["status"], { wrap: string; dot: string }> = {
    available: {
      wrap:
        "bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 ring-1 ring-inset ring-emerald-500/20",
      dot: "bg-emerald-500 animate-pulse",
    },
    allocated: {
      wrap:
        "bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-indigo-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 ring-1 ring-inset ring-blue-500/20",
      dot: "bg-blue-500",
    },
    offline: {
      wrap:
        "bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30 ring-1 ring-inset ring-rose-500/20",
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
  const [loading, setLoading] = React.useState(true);
  const [selectedGPU, setSelectedGPU] = React.useState<GPU | null>(null);

  const columns: ColumnDef<GPU>[] = [
    { accessorKey: "model", header: "Model" },
    { accessorKey: "memory", header: "Memory" },
    { accessorKey: "cluster", header: "Cluster" },
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
          className="bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Details
        </button>
      ),
    },
  ];

  const filteredData = gpuList.filter(
    (gpu) => statusFilter === "all" || gpu.status === statusFilter
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
    available: gpuList.filter((g) => g.status === "available").length,
    allocated: gpuList.filter((g) => g.status === "allocated").length,
    offline: gpuList.filter((g) => g.status === "offline").length,
  };

  const exportCSV = () => {
    const header = ["ID", "Model", "Memory", "Cluster", "Status"];
    const rows = filteredData.map((g) => [g.id, g.model, g.memory, g.cluster, g.status]);
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Available */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-emerald-50/70 dark:bg-emerald-100/10 border border-emerald-300/70 ring-1 ring-inset ring-emerald-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">Available</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">{gpuSummary.available}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/50 to-green-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 dark:bg-emerald-200/10 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-emerald-500/30 shadow-inner shadow-emerald-500/20">
                <CheckCircle className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Allocated */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-blue-50/70 dark:bg-blue-100/10 border border-blue-300/70 ring-1 ring-inset ring-blue-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">Allocated</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-300">{gpuSummary.allocated}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/50 to-indigo-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 dark:bg-blue-200/10 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-blue-500/30 shadow-inner shadow-blue-500/20">
                <Lock className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Offline */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-red-50/70 dark:bg-rose-100/10 border border-red-300/70 ring-1 ring-inset ring-red-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/15" />
          <div className="flex items-start sm:items-center justify-between gap-4 relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">Offline</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-red-700 dark:text-red-300">{gpuSummary.offline}</p>
            </div>
            <div className="group relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/50 to-rose-500/50 blur opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 dark:bg-rose-200/10 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-red-500/30 shadow-inner shadow-red-500/20">
                <PowerOff className="text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search GPUs..."
          className="px-4 py-2 border rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        /> */}
        {/* <select
          value={statusFilter}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
          <option value="offline">Offline</option>
        </select> */}
        <div className="flex sm:ml-auto">
          <button
            onClick={exportCSV}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
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
            {table.getRowModel().rows.map((row, i) => (
              <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{row.original.model}</div>
                      <div className="text-xs text-gray-600">{row.original.memory} • {row.original.cluster}</div>
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
              <li><span className="font-semibold">Memory:</span> {selectedGPU.memory}</li>
              <li><span className="font-semibold">Cluster:</span> {selectedGPU.cluster}</li>
              <li><span className="font-semibold">Status:</span> {selectedGPU.status}</li>
              {/* Could also render the badge inside the modal if preferred: */}
              {/* <li><span className="font-semibold">Status:</span> <span className="ml-2">{renderStatusBadge(selectedGPU.status)}</span></li> */}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
