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

type GPUResource = {
  id: number;
  model: string;
  gpu: string;
  memory: string;
  cluster: string;
  status: string;
};

// Example: GPUs allocated to a single customer (e.g. "ACME Corp")
const data: GPUResource[] = [
  { id: 1, model: "GPT-5", gpu: "NVIDIA A100", memory: "80 GB", cluster: "Cluster-A", status: "Running" },
  { id: 2, model: "Stable Diffusion XL", gpu: "RTX 4090", memory: "24 GB", cluster: "Cluster-C", status: "Stopped" },
  { id: 3, model: "BERT", gpu: "T4", memory: "16 GB", cluster: "Cluster-A", status: "Running" },
  { id: 4, model: "Whisper Large", gpu: "A40", memory: "48 GB", cluster: "Cluster-D", status: "Idle" },
  { id: 5, model: "Falcon-180B", gpu: "A100", memory: "80 GB", cluster: "Cluster-B", status: "Running" },
  { id: 6, model: "GPT-NeoX", gpu: "RTX 6000 Ada", memory: "48 GB", cluster: "Cluster-B", status: "Idle" },
];

const columns: ColumnDef<GPUResource>[] = [
  { accessorKey: "model", header: "Model" },
  { accessorKey: "gpu", header: "GPU" },
  { accessorKey: "memory", header: "Memory" },
  { accessorKey: "cluster", header: "Cluster" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const color =
        status === "Running"
          ? "bg-green-100 text-green-700 border-green-700"
          : status === "Idle"
          ? "bg-yellow-100 text-yellow-700 border-yellow-700"
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
        onClick={() =>
          alert(`Deploying ${row.original.model} on ${row.original.cluster}`)
        }
        className="bg-indigo-500 hover:bg-[#2f13b0] text-white px-4 py-2 rounded-[10px] text-bold transition-colors"
      >
        Deploy
      </button>
    ),
  },
];

export default function Dashboard() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 h-[85vh] flex flex-col">
      {/* Customer Header */}
      <div className="mb-6 ml-2">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          Customer Dashboard: <span className="text-indigo-600">ACME Corp</span>
        </h1>
        <p className="text-gray-600 text-sm">GPU allocations and usage for this customer</p>
      </div>

      {/* Search box */}
      <div className="mb-4 flex items-center gap-4">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search models, GPUs, clusters..."
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
                  {headerGroup.headers.map((header) => {
                    const isCenter = header.column.id === "status" || header.column.id === "actions";
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-4 py-3 border-b border-gray-700 font-semibold cursor-pointer select-none ${
                          isCenter ? "text-center" : "text-start"
                        }`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="text-sm text-gray-800">
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`transition ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isCenter = cell.column.id === "status" || cell.column.id === "actions";
                    return (
                      <td
                        key={cell.id}
                        className={`px-4 py-3 border-b border-gray-200 ${isCenter ? "text-center" : "text-start"}`}
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
        <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t">
          <span className="text-sm font-medium text-gray-700 mr-4">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ⬅ Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
