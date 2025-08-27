"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

type AIInfra = {
  id: number;
  model: string;
  gpu: string;
  memory: string;
  cluster: string;
  status: string;
};

const data: AIInfra[] = [
  { id: 1, model: "GPT-5", gpu: "NVIDIA A100", memory: "80 GB", cluster: "Cluster-A", status: "Running" },
  { id: 2, model: "LLaMA-3", gpu: "H100", memory: "120 GB", cluster: "Cluster-B", status: "Idle" },
  { id: 3, model: "Stable Diffusion XL", gpu: "RTX 4090", memory: "24 GB", cluster: "Cluster-C", status: "Stopped" },
  { id: 4, model: "BERT", gpu: "T4", memory: "16 GB", cluster: "Cluster-A", status: "Running" },
  { id: 5, model: "Whisper Large", gpu: "A40", memory: "48 GB", cluster: "Cluster-D", status: "Idle" },
  { id: 6, model: "Falcon-180B", gpu: "A100", memory: "80 GB", cluster: "Cluster-B", status: "Running" },
  { id: 7, model: "Mistral 7B", gpu: "V100", memory: "32 GB", cluster: "Cluster-E", status: "Stopped" },
  { id: 8, model: "Claude-3 Opus", gpu: "H100", memory: "120 GB", cluster: "Cluster-C", status: "Running" },
  { id: 9, model: "Gemini Ultra", gpu: "TPU v5e", memory: "96 GB", cluster: "Cluster-F", status: "Running" },
  { id: 10, model: "GPT-NeoX", gpu: "RTX 6000 Ada", memory: "48 GB", cluster: "Cluster-B", status: "Idle" },
  { id: 11, model: "LLaMA-2 70B", gpu: "A100", memory: "80 GB", cluster: "Cluster-G", status: "Stopped" },
  { id: 12, model: "GPT-J", gpu: "RTX 3090", memory: "24 GB", cluster: "Cluster-A", status: "Running" },
  { id: 13, model: "DeepSeek V3", gpu: "H200", memory: "141 GB", cluster: "Cluster-H", status: "Running" },
  { id: 14, model: "Mixtral 8x7B", gpu: "A100", memory: "80 GB", cluster: "Cluster-I", status: "Idle" },
  { id: 15, model: "PaLM-2", gpu: "TPU v4", memory: "128 GB", cluster: "Cluster-J", status: "Stopped" },
  { id: 16, model: "ChatGLM-3", gpu: "RTX 4090", memory: "24 GB", cluster: "Cluster-C", status: "Running" },
  { id: 17, model: "Qwen-72B", gpu: "H100", memory: "120 GB", cluster: "Cluster-K", status: "Running" },
  { id: 18, model: "Stable Cascade", gpu: "A40", memory: "48 GB", cluster: "Cluster-L", status: "Idle" },
  { id: 19, model: "Bloom", gpu: "V100", memory: "32 GB", cluster: "Cluster-M", status: "Stopped" },
  { id: 20, model: "Phi-3", gpu: "RTX 6000 Ada", memory: "48 GB", cluster: "Cluster-N", status: "Running" },
];

const columns: ColumnDef<AIInfra>[] = [
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
      onClick={() => alert(`Deploying ${row.original.model} on ${row.original.cluster}`)}
      className="bg-[#3b19e6] hover:bg-[#2f13b0] text-white px-4 py-2 rounded"
    >
      Deploy
    </button>
    ),
  },
];

export default function Dashboard() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 h-[85vh] flex flex-col">
      {/* Table container grows and scrolls */}
      <div className="flex-1 rounded-xl shadow-xl overflow-hidden bg-white border flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-800 shadow-sm z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-left text-sm text-white">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 border-b border-gray-700 font-semibold text-center"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-sm text-gray-800">
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`transition ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border-b border-gray-200 text-center"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination always at bottom of table card */}
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
