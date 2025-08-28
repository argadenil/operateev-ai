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

// Chart.js
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

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

const data: GPUResource[] = [
  { id: 1, gpu: "NVIDIA A100", memory: "80 GB", cluster: "Cluster-A", status: "Running", uptime: "72h", temperature: 65, power: 250, processes: 12 },
  { id: 2, gpu: "RTX 4090", memory: "24 GB", cluster: "Cluster-C", status: "Stopped", uptime: "0h", temperature: 40, power: 50, processes: 0 },
  { id: 3, gpu: "T4", memory: "16 GB", cluster: "Cluster-A", status: "Running", uptime: "36h", temperature: 70, power: 200, processes: 5 },
  { id: 4, gpu: "A40", memory: "48 GB", cluster: "Cluster-D", status: "Idle", uptime: "10h", temperature: 55, power: 120, processes: 1 },
  { id: 5, gpu: "A100", memory: "80 GB", cluster: "Cluster-B", status: "Running", uptime: "96h", temperature: 72, power: 280, processes: 20 },
  { id: 6, gpu: "RTX 6000 Ada", memory: "48 GB", cluster: "Cluster-B", status: "Idle", uptime: "8h", temperature: 50, power: 100, processes: 2 },
];

export default function Dashboard() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const [selectedModel, setSelectedModel] = React.useState<GPUResource | null>(null);

  const columns: ColumnDef<GPUResource>[] = [
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
          onClick={() => setSelectedModel(row.original)}
          className="bg-indigo-500 hover:bg-[#2f13b0] text-white px-4 py-2 rounded-[10px] font-semibold transition-colors"
        >
          Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
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

  // Mock line chart data (GPU utilization)
  const lineChartData = {
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
  };

  // Mock pie chart data (memory usage breakdown)
  const pieChartData = {
    labels: ["Used Memory", "Free Memory"],
    datasets: [
      {
        label: "Memory (GB)",
        data: [56, 24], // mock values
        backgroundColor: ["#f87171", "#34d399"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-8 h-[85vh] flex flex-col">
      {/* Header */}
      <div className="mb-6 ml-2">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          Customer Dashboard: <span className="text-indigo-600">ACME Corp</span>
        </h1>
        <p className="text-gray-600 text-sm">GPU allocations and usage for this customer</p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search GPUs, clusters..."
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
                    const isCenter = ["status", "actions"].includes(header.column.id);
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`px-4 py-3 border-b border-gray-700 font-semibold cursor-pointer select-none ${isCenter ? "text-center" : "text-start"
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
                    const isCenter = ["status", "actions"].includes(cell.column.id);
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
            Page <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
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

      {/* Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[75%] max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Header with close icon */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">GPU Resource Details</h2>
              <button
                onClick={() => setSelectedModel(null)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div><span className="font-semibold">GPU:</span> {selectedModel.gpu}</div>
              <div><span className="font-semibold">Memory:</span> {selectedModel.memory}</div>
              <div><span className="font-semibold">Cluster:</span> {selectedModel.cluster}</div>
              <div><span className="font-semibold">Uptime:</span> {selectedModel.uptime}</div>
              <div><span className="font-semibold">Temperature:</span> {selectedModel.temperature}°C</div>
              <div><span className="font-semibold">Power Usage:</span> {selectedModel.power}W</div>
              <div><span className="font-semibold">Processes Running:</span> {selectedModel.processes}</div>
              <div className="col-span-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border ${selectedModel.status === "Running"
                      ? "bg-green-100 text-green-700 border-green-700"
                      : selectedModel.status === "Idle"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-700"
                        : "bg-red-100 text-red-700 border-red-700"
                    }`}
                >
                  {selectedModel.status}
                </span>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 shadow">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">GPU Utilization Over Time</h3>
                <div className="h-48">
                  <Line
                    data={lineChartData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 shadow">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Memory Usage</h3>
                <div className="h-48">
                  <Pie
                    data={pieChartData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: { legend: { position: "bottom" } }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-gray-50 rounded-xl p-4 shadow mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Detailed GPU Statistics</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
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
      )}
    </div>
  );
}
