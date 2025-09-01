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
import { X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, BarChart3, PlayCircle, CheckCircle, XCircle, Clock, Timer } from "lucide-react";
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

// Unified dashboard-style status badge
const renderStatusBadge = (status: Job["status"]) => {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm border transition-colors duration-300 capitalize";
  const map: Record<Job["status"], { wrap: string; dot: string }> = {
    running: {
      wrap:
        "bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-emerald-500/20 text-emerald-700 border-emerald-500/30 ring-1 ring-inset ring-emerald-500/20",
      dot: "bg-emerald-500 animate-pulse",
    },
    completed: {
      wrap:
        "bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-indigo-500/20 text-blue-700 border-blue-500/30 ring-1 ring-inset ring-blue-500/20",
      dot: "bg-blue-500",
    },
    failed: {
      wrap:
        "bg-gradient-to-r from-rose-500/15 via-rose-400/10 to-rose-500/20 text-rose-700 border-rose-500/30 ring-1 ring-inset ring-rose-500/20",
      dot: "bg-rose-500",
    },
    queued: {
      wrap:
        "bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/20 text-amber-700 border-amber-500/30 ring-1 ring-inset ring-amber-500/20",
      dot: "bg-amber-500",
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


export default function JobManagementPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [statusFilter] = React.useState<"all" | Job["status"]>("all"); // setter removed (unused)

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
  const status = getValue() as Job["status"];
  return renderStatusBadge(status);
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
    <div className="space-y-6">
      <div className="mx-auto flex flex-col gap-6">
        {/* Page Header */}

        {/* KPI Cards (Enhanced like Dashboard Stats) */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {/* Total Jobs */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg bg-gray-100/70 border border-gray-300 ring-1 ring-inset ring-gray-400/20">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/15 via-transparent to-gray-500/25" />
              <div className="flex items-start justify-between gap-4 relative">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-gray-600 tracking-wide uppercase">Total Jobs</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">{total}</p>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-300/60 to-gray-400/50 blur opacity-60 group-hover:opacity-80 transition" />
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/30 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-gray-400/40 shadow-inner shadow-gray-400/30">
                    <BarChart3 className="text-gray-700 group-hover:scale-110 transition-transform" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Running */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg bg-emerald-50/70 border border-emerald-300/70 ring-1 ring-inset ring-emerald-400/30">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/15" />
              <div className="flex items-start justify-between gap-4 relative">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-emerald-700 tracking-wide uppercase">Running</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-700">{running}</p>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/50 to-green-500/50 blur opacity-60 group-hover:opacity-80 transition" />
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-emerald-500/30 shadow-inner shadow-emerald-500/20">
                    <PlayCircle className="text-emerald-600 group-hover:scale-110 transition-transform" size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg bg-blue-50/70 border border-blue-300/70 ring-1 ring-inset ring-blue-400/30">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/15" />
              <div className="flex items-start justify-between gap-4 relative">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-blue-700 tracking-wide uppercase">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-blue-700">{completed}</p>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/50 to-indigo-500/50 blur opacity-60 group-hover:opacity-80 transition" />
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-blue-500/30 shadow-inner shadow-blue-500/20">
                    <CheckCircle className="text-blue-600 group-hover:scale-110 transition-transform" size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Failed */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg bg-red-50/70 border border-red-300/70 ring-1 ring-inset ring-red-400/30">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-rose-500/15" />
              <div className="flex items-start justify-between gap-4 relative">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-red-700 tracking-wide uppercase">Failed</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-red-700">{failed}</p>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-400/50 to-rose-500/50 blur opacity-60 group-hover:opacity-80 transition" />
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-red-500/30 shadow-inner shadow-red-500/20">
                    <XCircle className="text-red-600 group-hover:scale-110 transition-transform" size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Queued */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg bg-yellow-50/70 border border-amber-300/70 ring-1 ring-inset ring-amber-400/30">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/15" />
              <div className="flex items-start justify-between gap-4 relative">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-amber-700 tracking-wide uppercase">Queued</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-amber-700">{queued}</p>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/50 to-yellow-500/50 blur opacity-60 group-hover:opacity-80 transition" />
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-amber-500/30 shadow-inner shadow-amber-500/20">
                    <Clock className="text-amber-600 group-hover:scale-110 transition-transform" size={22} />
                  </div>
                </div>
              </div>
            </div>

            {/* Avg Duration */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg bg-indigo-50/70 border border-indigo-300/70 ring-1 ring-inset ring-indigo-400/30">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-600/15" />
              <div className="flex items-start justify-between gap-4 relative">
                <div>
                  <p className="text-[11px] sm:text-xs font-medium text-indigo-700 tracking-wide uppercase">Avg. Duration</p>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-600">1h 23m</p>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400/50 to-purple-500/50 blur opacity-60 group-hover:opacity-80 transition" />
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-inset ring-indigo-500/30 shadow-inner shadow-indigo-500/20">
                    <Timer className="text-indigo-600 group-hover:scale-110 transition-transform" size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts / Analytics (Enhanced) */}
        <section>
          <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Analytics</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {/* Status Distribution */}
            <div className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/40 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-shadow">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative h-64 flex flex-col rounded-[15px] bg-white/90 backdrop-blur-xl border border-white/60 px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Job Status Distribution</h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">Pie</span>
                </div>
                <div className="flex-1">
                  <Pie data={pieData} options={commonChartOptions} />
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] text-gray-600">
                  <div className="flex flex-col items-center p-1 rounded bg-emerald-500/5"><span className="font-semibold text-emerald-600">{running}</span><span>Run</span></div>
                  <div className="flex flex-col items-center p-1 rounded bg-blue-500/5"><span className="font-semibold text-blue-600">{completed}</span><span>Done</span></div>
                  <div className="flex flex-col items-center p-1 rounded bg-rose-500/5"><span className="font-semibold text-rose-600">{failed}</span><span>Fail</span></div>
                  <div className="flex flex-col items-center p-1 rounded bg-amber-500/5"><span className="font-semibold text-amber-600">{queued}</span><span>Queue</span></div>
                </div>
              </div>
            </div>

            {/* Owner-wise */}
            <div className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-violet-500/40 via-indigo-500/30 to-sky-500/40 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 transition-shadow">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative h-64 flex flex-col rounded-[15px] bg-white/90 backdrop-blur-xl border border-white/60 px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Owner-wise Job Count</h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200">Bar</span>
                </div>
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
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={barOptions}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-indigo-600">
                  {[...new Set(jobList.map(j=>j.owner))].map(o => (
                    <span key={o} className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">{o}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* GPU Utilization */}
            <div className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-emerald-500/40 via-teal-500/30 to-cyan-500/40 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-shadow">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_60%)]" />
              <div className="relative h-64 flex flex-col rounded-[15px] bg-white/90 backdrop-blur-xl border border-white/60 px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">GPU Utilization</h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">Bar</span>
                </div>
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
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={barOptions}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-emerald-600">
                  {[...new Set(jobList.map(j=>j.gpu))].map(g => (
                    <span key={g} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* <select
              value={statusFilter}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select> */}
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search Jobs..."
              className="px-3 sm:px-4 py-2 border rounded-lg w-full sm:w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Job List</h2>
          <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100 flex flex-col">
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full min-w-[780px] border-collapse">
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
                <h3 className="font-semibold text-sm">Jobs ({filteredData.length})</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{row.original.name}</div>
                        <div className="text-xs text-gray-600">{row.original.gpu} • {row.original.owner}</div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="font-medium">{row.original.status}</span>
                        {/* Could wrap with badge if desired in mobile summary line */}
                        <span>{row.original.duration}</span>
                      </div>
                      <button
                        onClick={() => setSelectedJob(row.original)}
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
        </section>

        {/* Recent Activity (Enhanced Timeline) */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-800">Recent Activity</h2>
            <span className="text-[11px] uppercase font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">Live Feed</span>
          </div>
          <div className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/10">
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-[15px] p-5">
              <ul className="space-y-4">
                {[
                  { icon: '✅', label: 'completed', job: 'NLP Inference', by: 'Bob', time: '08:45', color: 'from-emerald-500 to-green-500' },
                  { icon: '⚠️', label: 'failed', job: 'GAN Training', by: 'Charlie', time: '00:10', color: 'from-rose-500 to-red-500' },
                  { icon: '🚀', label: 'started', job: 'ImageNet Training', by: 'Alice', time: '09:30', color: 'from-indigo-500 to-purple-500' },
                  { icon: '⏳', label: 'queued', job: 'BERT Fine-tuning', by: 'Alice', time: '—', color: 'from-amber-500 to-yellow-500' },
                ].map((e, i, arr) => (
                  <li key={i} className="relative pl-8">
                    {i !== arr.length - 1 && (
                      <span className="absolute left-3 top-5 w-px h-full bg-gradient-to-b from-gray-300/70 via-gray-300/40 to-transparent" />
                    )}
                    <span className="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white bg-gradient-to-r shadow ring-2 ring-white animate-[pulse_5s_ease-in-out_infinite]" style={{ backgroundImage: 'linear-gradient(to right,var(--tw-gradient-stops))' }}>
                      <span className={`bg-gradient-to-r ${e.color} bg-clip-text text-transparent`}>{e.icon}</span>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">{e.job}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="capitalize text-gray-600">{e.label}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-500">by {e.by}</span>
                      </div>
                      <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200 w-fit">{e.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Modal (same as before) */}
             {selectedJob && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedJob(null)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-auto max-w-lg sm:max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-800 transition"
                >
                  <X size={22} />
                </button>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700">
                <li><span className="font-semibold">Job Name:</span> {selectedJob.name}</li>
                <li><span className="font-semibold">Owner:</span> {selectedJob.owner}</li>
                <li><span className="font-semibold">GPU:</span> {selectedJob.gpu}</li>
                <li><span className="font-semibold">Status:</span> {selectedJob.status}</li>
                {/* Badge version: <li><span className=\"font-semibold\">Status:</span> <span className=\"ml-2\">{renderStatusBadge(selectedJob.status)}</span></li> */}
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