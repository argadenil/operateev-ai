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
import { X, Copy } from "lucide-react";

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
        const status = getValue() as string;
        const color =
          status === "available"
            ? "bg-green-100 text-green-700 border-green-700"
            : status === "allocated"
            ? "bg-blue-100 text-blue-700 border-blue-700"
            : "bg-red-100 text-red-700 border-red-700";
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="bg-indigo-500 hover:bg-[#2f13b0] text-white px-4 py-2 rounded-[10px] font-semibold transition-colors"
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
    <div className="p-8 h-[85vh] flex flex-col">
      {/* Summary Cards */}
      <div className="flex gap-4 mb-6">
        <div className="bg-green-100 text-green-700 p-4 rounded-lg flex-1 text-center font-semibold">
          Available: {gpuSummary.available}
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 rounded-lg flex-1 text-center font-semibold">
          Allocated: {gpuSummary.allocated}
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex-1 text-center font-semibold">
          Offline: {gpuSummary.offline}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-4 flex items-center gap-4">
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
        <button
          onClick={exportCSV}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 flex items-center gap-2"
        >
          <Copy size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 rounded-xl shadow-xl overflow-hidden bg-white border flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-800 shadow-sm z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-sm text-white">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 border-b border-gray-700 font-semibold cursor-pointer select-none text-start"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm text-gray-800">
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`transition ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 border-b border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end gap-2 mt-2 py-2 px-4 border-t border-gray-200">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedGPU && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[60%] p-6 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">GPU Details</h2>
              <button
                onClick={() => setSelectedGPU(null)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X size={22} />
              </button>
            </div>
            <ul className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <li><span className="font-semibold">Model:</span> {selectedGPU.model}</li>
              <li><span className="font-semibold">Memory:</span> {selectedGPU.memory}</li>
              <li><span className="font-semibold">Cluster:</span> {selectedGPU.cluster}</li>
              <li><span className="font-semibold">Status:</span> {selectedGPU.status}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
