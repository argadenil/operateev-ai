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
import { X } from "lucide-react";

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
          onClick={() => setSelectedGPU(row.original)}
          className="bg-indigo-500 hover:bg-[#2f13b0] text-white px-4 py-2 rounded-[10px] font-semibold transition-colors"
        >
          Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: gpuList,
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

  if (loading) return <Loader />;

  return (
    <div className="p-8 h-[85vh] flex flex-col">
      {/* Header */}

      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search GPUs..."
          className="px-4 py-2 border rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
