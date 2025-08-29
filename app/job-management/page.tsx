// ...existing code...
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

type Job = {
  id: number;
  name: string;
  gpu: string;
  owner: string;
  status: "running" | "completed" | "failed" | "queued";
  startTime: string;
  duration: string;
};

const jobList: Job[] = [
  {
    id: 1,
    name: "ImageNet Training",
    gpu: "NVIDIA A100",
    owner: "Alice",
    status: "running",
    startTime: "2025-08-28 09:30",
    duration: "2h 15m",
  },
  {
    id: 2,
    name: "NLP Inference",
    gpu: "RTX 4090",
    owner: "Bob",
    status: "completed",
    startTime: "2025-08-28 08:00",
    duration: "45m",
  },
  {
    id: 3,
    name: "GAN Training",
    gpu: "NVIDIA V100",
    owner: "Charlie",
    status: "failed",
    startTime: "2025-08-27 22:15",
    duration: "1h 10m",
  },
  {
    id: 4,
    name: "BERT Fine-tuning",
    gpu: "Tesla T4",
    owner: "Alice",
    status: "queued",
    startTime: "—",
    duration: "—",
  },
  {
    id: 5,
    name: "ResNet50 Training",
    gpu: "NVIDIA A100",
    owner: "David",
    status: "running",
    startTime: "2025-08-28 10:00",
    duration: "3h 5m",
  },
  {
    id: 6,
    name: "YOLOv8 Object Detection",
    gpu: "RTX 3090",
    owner: "Eve",
    status: "completed",
    startTime: "2025-08-27 14:20",
    duration: "1h 40m",
  },
  {
    id: 7,
    name: "StyleGAN2 Generation",
    gpu: "NVIDIA V100",
    owner: "Frank",
    status: "running",
    startTime: "2025-08-28 11:15",
    duration: "2h 30m",
  },
  {
    id: 8,
    name: "Transformer Pretraining",
    gpu: "Tesla T4",
    owner: "Grace",
    status: "queued",
    startTime: "—",
    duration: "—",
  },
  {
    id: 9,
    name: "BERT QA",
    gpu: "RTX 4090",
    owner: "Alice",
    status: "completed",
    startTime: "2025-08-27 18:45",
    duration: "55m",
  },
  {
    id: 10,
    name: "DeepDream Visualization",
    gpu: "NVIDIA A100",
    owner: "Bob",
    status: "failed",
    startTime: "2025-08-26 21:10",
    duration: "1h 5m",
  },
  {
    id: 11,
    name: "RL Policy Training",
    gpu: "RTX 3080",
    owner: "Charlie",
    status: "running",
    startTime: "2025-08-28 07:50",
    duration: "2h 50m",
  },
  {
    id: 12,
    name: "Speech-to-Text Model",
    gpu: "Tesla T4",
    owner: "David",
    status: "queued",
    startTime: "—",
    duration: "—",
  },
  {
    id: 13,
    name: "Autoencoder Training",
    gpu: "RTX 3090",
    owner: "Eve",
    status: "completed",
    startTime: "2025-08-27 16:30",
    duration: "1h 20m",
  },
  {
    id: 14,
    name: "Segmentation Model",
    gpu: "NVIDIA V100",
    owner: "Frank",
    status: "running",
    startTime: "2025-08-28 09:45",
    duration: "2h 10m",
  },
  {
    id: 15,
    name: "GPT-Style Finetune",
    gpu: "A100",
    owner: "Grace",
    status: "queued",
    startTime: "—",
    duration: "—",
  },
  {
    id: 16,
    name: "Image Super-Resolution",
    gpu: "RTX 4090",
    owner: "Alice",
    status: "completed",
    startTime: "2025-08-27 12:15",
    duration: "50m",
  },
];


export default function JobManagementPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<"all" | Job["status"]>("all");

  const filteredData =
    statusFilter === "all" ? jobList : jobList.filter((job) => job.status === statusFilter);

  const columns: ColumnDef<Job>[] = [
    { accessorKey: "name", header: "Job Name" },
    { accessorKey: "gpu", header: "GPU" },
    { accessorKey: "owner", header: "Owner" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const color =
          status === "running"
            ? "bg-green-100 text-green-700 border-green-700"
            : status === "completed"
              ? "bg-blue-100 text-blue-700 border-blue-700"
              : status === "failed"
                ? "bg-red-100 text-red-700 border-red-700"
                : "bg-yellow-100 text-yellow-700 border-yellow-700";
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
            {status}
          </span>
        );
      },
    },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "duration", header: "Duration" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedJob(row.original)}
          className="bg-indigo-500 hover:bg-[#2f13b0] text-white px-4 py-2 rounded-[10px] font-semibold transition-colors"
        >
          Details
        </button>
      ),
    },
  ];

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

  // Stats
  const total = jobList.length;
  const running = jobList.filter((j) => j.status === "running").length;
  const completed = jobList.filter((j) => j.status === "completed").length;
  const failed = jobList.filter((j) => j.status === "failed").length;
  const queued = jobList.filter((j) => j.status === "queued").length;

  const pieData = {
    labels: ["Running", "Completed", "Failed", "Queued"],
    datasets: [
      {
        data: [running, completed, failed, queued],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444", "#eab308"],
      },
    ],
  };

  // Chart options - ensure charts are responsive and do not maintain aspect ratio,
  // and give some padding so nothing gets cut off.
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 12, padding: 8 },
      },
      title: { display: false },
      tooltip: { enabled: true },
    },
    layout: {
      padding: { top: 8, bottom: 8, left: 8, right: 8 },
    },
  };

  const barOptions = {
    ...commonChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
      x: {
        ticks: { autoSkip: false },
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8 h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}

        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow border">
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <h2 className="text-2xl font-bold">{total}</h2>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow border border-green-400">
              <p className="text-green-700 text-sm">Running</p>
              <h2 className="text-2xl font-bold text-green-700">{running}</h2>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 shadow border border-blue-400">
              <p className="text-blue-700 text-sm">Completed</p>
              <h2 className="text-2xl font-bold text-blue-700">{completed}</h2>
            </div>
            <div className="bg-red-50 rounded-xl p-4 shadow border border-red-400">
              <p className="text-red-700 text-sm">Failed</p>
              <h2 className="text-2xl font-bold text-red-700">{failed}</h2>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 shadow border border-yellow-400">
              <p className="text-yellow-700 text-sm">Queued</p>
              <h2 className="text-2xl font-bold text-yellow-700">{queued}</h2>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 shadow border border-indigo-400">
              <p className="text-indigo-700 text-sm">Avg. Duration</p>
              <h2 className="text-2xl font-bold text-indigo-700">1h 23m</h2>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Analytics</h2>
          {/* items-stretch ensures all cards get full height in the row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="bg-white shadow rounded-xl p-4 border h-64 flex flex-col">
              <h3 className="text-sm font-semibold mb-2">Job Status Distribution</h3>
              <div className="flex-1">
                <Pie data={pieData} options={commonChartOptions} />
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 border h-64 flex flex-col">
              <h3 className="text-sm font-semibold mb-2">Owner-wise Job Count</h3>
              <div className="flex-1">
                <Bar
                  data={{
                    labels: [...new Set(jobList.map((j) => j.owner))],
                    datasets: [
                      {
                        label: "Jobs",
                        data: [...new Set(jobList.map((j) => j.owner))].map(
                          (o) => jobList.filter((j) => j.owner === o).length
                        ),
                        backgroundColor: "#6366f1",
                      },
                    ],
                  }}
                  options={barOptions}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 border h-64 flex flex-col">
              <h3 className="text-sm font-semibold mb-2">GPU Utilization</h3>
              <div className="flex-1">
                <Bar
                  data={{
                    labels: [...new Set(jobList.map((j) => j.gpu))],
                    datasets: [
                      {
                        label: "Usage",
                        data: [...new Set(jobList.map((j) => j.gpu))].map(
                          (g) => jobList.filter((j) => j.gpu === g).length
                        ),
                        backgroundColor: "#22c55e",
                      },
                    ],
                  }}
                  options={barOptions}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section>
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={statusFilter}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search Jobs..."
              className="px-4 py-2 border rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Job List</h2>
          <div className="rounded-xl shadow-xl overflow-hidden bg-white border flex flex-col">
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
                      className={`transition ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-indigo-50`}
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
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow border p-4">
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✅ Job <span className="font-semibold">NLP Inference</span> completed by Bob (08:45)</li>
              <li>⚠️ Job <span className="font-semibold">GAN Training</span> failed for Charlie (00:10)</li>
              <li>🚀 Job <span className="font-semibold">ImageNet Training</span> started by Alice (09:30)</li>
              <li>⏳ Job <span className="font-semibold">BERT Fine-tuning</span> queued by Alice</li>
            </ul>
          </div>
        </section>

        {/* Modal (same as before) */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[60%] p-6 relative">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-800 transition"
                >
                  <X size={22} />
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <li><span className="font-semibold">Job Name:</span> {selectedJob.name}</li>
                <li><span className="font-semibold">Owner:</span> {selectedJob.owner}</li>
                <li><span className="font-semibold">GPU:</span> {selectedJob.gpu}</li>
                <li><span className="font-semibold">Status:</span> {selectedJob.status}</li>
                <li><span className="font-semibold">Start Time:</span> {selectedJob.startTime}</li>
                <li><span className="font-semibold">Duration:</span> {selectedJob.duration}</li>
              </ul>
              <div className="mt-6 flex gap-4">
                {selectedJob.status === "running" && (
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                    Cancel Job
                  </button>
                )}
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
                  View Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}