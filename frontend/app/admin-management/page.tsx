
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Edit,
    Trash2,
    BarChart2,
    Layers,
    Clipboard,
    Lightbulb,
    Users,
    Activity,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table";


// Placeholder data types
type Admin = {
    id: string;
    name: string;
    email: string;
    region: string;
    status: "active" | "inactive" | "suspended";
    customers: number;
    clusters: number;
    gpuLimit: number;
    performanceScore: number;
};

type QuotaTemplate = {
    name: string;
    clusters: number;
    gpus: number;
};

// Placeholder data
const quotaTemplates: QuotaTemplate[] = [
    { name: "Tier 1", clusters: 5, gpus: 100 },
    { name: "Tier 2", clusters: 10, gpus: 250 },
];

const mockAdmins: Admin[] = [
    {
        id: "1",
        name: "Alice Smith",
        email: "alice@company.com",
        region: "US-East",
        status: "active",
        customers: 12,
        clusters: 3,
        gpuLimit: 50,
        performanceScore: 87,
    },
    {
        id: "2",
        name: "Bob Lee",
        email: "bob@company.com",
        region: "EU-West",
        status: "inactive",
        customers: 8,
        clusters: 2,
        gpuLimit: 30,
        performanceScore: 72,
    },
    {
        id: "3",
        name: "Carla Johnson",
        email: "carla@company.com",
        region: "AP-South",
        status: "active",
        customers: 15,
        clusters: 4,
        gpuLimit: 60,
        performanceScore: 91,
    },
    {
        id: "4",
        name: "David Kim",
        email: "david@company.com",
        region: "US-West",
        status: "active",
        customers: 10,
        clusters: 3,
        gpuLimit: 40,
        performanceScore: 84,
    },
    {
        id: "5",
        name: "Emma Rodriguez",
        email: "emma@company.com",
        region: "EU-Central",
        status: "inactive",
        customers: 6,
        clusters: 1,
        gpuLimit: 20,
        performanceScore: 68,
    },
    {
        id: "6",
        name: "Frank Chen",
        email: "frank@company.com",
        region: "AP-Northeast",
        status: "active",
        customers: 20,
        clusters: 5,
        gpuLimit: 80,
        performanceScore: 95,
    },
    {
        id: "7",
        name: "Grace Miller",
        email: "grace@company.com",
        region: "US-Central",
        status: "active",
        customers: 9,
        clusters: 3,
        gpuLimit: 35,
        performanceScore: 82,
    },
    {
        id: "8",
        name: "Hassan Ali",
        email: "hassan@company.com",
        region: "ME-South",
        status: "inactive",
        customers: 7,
        clusters: 2,
        gpuLimit: 25,
        performanceScore: 70,
    },
    {
        id: "9",
        name: "Ivy Patel",
        email: "ivy@company.com",
        region: "AP-Southeast",
        status: "active",
        customers: 13,
        clusters: 4,
        gpuLimit: 55,
        performanceScore: 89,
    },
    {
        id: "10",
        name: "John Carter",
        email: "john@company.com",
        region: "US-East",
        status: "suspended",
        customers: 5,
        clusters: 1,
        gpuLimit: 15,
        performanceScore: 60,
    },
];


// Main Component
const AdminManagement: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
    const [search, setSearch] = useState("");
    const [regionFilter, setRegionFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [showCreate, setShowCreate] = useState(false);
    const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Filter logic
    const filteredAdmins = useMemo(() => {
        return admins.filter((admin) => {
            return (
                (!search || admin.name.toLowerCase().includes(search.toLowerCase()) || admin.email.toLowerCase().includes(search.toLowerCase())) &&
                (!regionFilter || admin.region === regionFilter) &&
                (!statusFilter || admin.status === statusFilter)
            );
        });
    }, [admins, search, regionFilter, statusFilter]);

    // Define table columns
    const columnHelper = createColumnHelper<Admin>();

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {info.getValue().charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: info => <span className="text-gray-600">{info.getValue()}</span>,
        }),
        columnHelper.accessor('region', {
            header: 'Region',
            cell: info => (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: info => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${info.getValue() === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                    }`}>
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('customers', {
            header: 'Customers',
            cell: info => <span className="text-gray-900 font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('clusters', {
            header: 'Clusters',
            cell: info => <span className="text-gray-900 font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('gpuLimit', {
            header: 'GPU Limit',
            cell: info => <span className="text-gray-900 font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('performanceScore', {
            header: 'Performance',
            cell: info => {
                const score = info.getValue();
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${score >= 80 ? 'bg-green-500' :
                                    score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[40px]">{score}%</span>
                    </div>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: info => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                        onClick={() => setEditAdmin(info.row.original)}
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                        onClick={() => handleDeleteAdmin(info.row.original.id)}
                        title="Deactivate"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        }),
    ], []);

    // Initialize table
    const table = useReactTable({
        data: filteredAdmins,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    // Placeholder: fetch admins from backend
    useEffect(() => {
        // TODO: fetch admins
    }, []);

    // Handlers
    const handleCreateAdmin = (admin: Admin) => {
        setAdmins([...admins, admin]);
        setShowCreate(false);
    };
    const handleEditAdmin = (updated: Admin) => {
        setAdmins(admins.map((a) => (a.id === updated.id ? updated : a)));
        setEditAdmin(null);
    };
    const handleDeleteAdmin = (id: string) => {
        // Soft delete: set status to inactive
        setAdmins(admins.map((a) => (a.id === id ? { ...a, status: "inactive" } : a)));
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-full mx-auto">
                {/* Header Section with Stats */}
                <div className="mb-8">
                    <div className="flex items-center justify-end mb-6">

                        <button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus className="w-5 h-5" /> Create Admin
                        </button>
                    </div>
                </div>


                {/* Admin List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Clipboard className="w-5 h-5 text-blue-600" />
                            Admin Directory ({filteredAdmins.length})
                        </h2>
                    </div>

                    {/* Desktop Table View */}
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
                                                    className={`px-6 py-4 font-semibold cursor-pointer select-none transition-colors duration-200 hover:bg-white/10 ${isCenter ? "text-center" : "text-left"
                                                        }`}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <div className={`flex items-center gap-2 ${isCenter ? "justify-center" : ""}`}>
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            <span className="text-white/60">
                                                                {{
                                                                    asc: "↑",
                                                                    desc: "↓",
                                                                }[header.column.getIsSorted() as string] ?? "↕️"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </thead>

                            <tbody className="text-sm text-gray-800 bg-white">
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-12 h-12 text-gray-300" />
                                                <p className="text-gray-500 font-medium">No admins found</p>
                                                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row, i) => (
                                        <tr
                                            key={row.id}
                                            className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                const isCenter = ["status", "actions"].includes(cell.column.id);
                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className={`px-6 py-4 ${isCenter ? "text-center" : "text-left"}`}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (visible on mobile) */}
                    <div className="lg:hidden space-y-4 p-4">
                        {table.getRowModel().rows.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12">
                                <Users className="w-12 h-12 text-gray-300" />
                                <p className="text-gray-500 font-medium">No admins found</p>
                                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                            </div>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                const admin = row.original;
                                return (
                                    <div key={row.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{admin.name}</p>
                                                    <p className="text-sm text-gray-600">{admin.email}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${admin.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {admin.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Region:</span>
                                                <span className="ml-2 font-medium">{admin.region}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Customers:</span>
                                                <span className="ml-2 font-medium">{admin.customers}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Clusters:</span>
                                                <span className="ml-2 font-medium">{admin.clusters}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">GPU Limit:</span>
                                                <span className="ml-2 font-medium">{admin.gpuLimit}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="text-sm text-gray-500">Performance:</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${admin.performanceScore >= 80 ? 'bg-green-500' :
                                                            admin.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${admin.performanceScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{admin.performanceScore}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                                                    onClick={() => setEditAdmin(admin)}
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                                                    onClick={() => handleDeleteAdmin(admin.id)}
                                                    title="Deactivate"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center gap-3 p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                            <span className="hidden sm:inline">Rows per page:</span>
                            <span className="sm:hidden">Per page:</span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm bg-white hover:bg-gray-50 transition-colors"
                            >
                                {[5, 10, 20, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 order-last sm:order-none">
                            <span className="hidden sm:inline">
                                Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                                <strong>{table.getPageCount()}</strong>
                            </span>
                            <span className="sm:hidden">
                                <strong>{table.getState().pagination.pageIndex + 1}</strong>/<strong>{table.getPageCount()}</strong>
                            </span>
                            <input
                                type="number"
                                min={1}
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    table.setPageIndex(page);
                                }}
                                className="w-12 sm:w-16 border border-gray-300 rounded-md px-1 sm:px-2 py-1 text-xs sm:text-sm text-center bg-white hover:bg-gray-50 transition-colors"
                            />
                        </div>

                        <div className="flex gap-1 sm:gap-2">
                            <button
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to first page"
                                className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xs sm:text-sm"
                            >
                                <ChevronsLeft size={14} className="sm:hidden" />
                                <ChevronsLeft size={18} className="hidden sm:block" />
                            </button>

                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                aria-label="Go to previous page"
                                className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xs sm:text-sm"
                            >
                                <ChevronLeft size={14} className="sm:hidden" />
                                <ChevronLeft size={18} className="hidden sm:block" />
                            </button>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to next page"
                                className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xs sm:text-sm"
                            >
                                <ChevronRight size={14} className="sm:hidden" />
                                <ChevronRight size={18} className="hidden sm:block" />
                            </button>

                            <button
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                                aria-label="Go to last page"
                                className="px-2 sm:px-3 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-xs sm:text-sm"
                            >
                                <ChevronsRight size={14} className="sm:hidden" />
                                <ChevronsRight size={18} className="hidden sm:block" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Usage Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Admin Usage Summary</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {admins.map((admin) => (
                            <div key={admin.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900">{admin.name}</div>
                                        <div className="text-xs text-gray-500">{admin.region}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Clusters</span>
                                        <span className="font-semibold text-gray-900">{admin.clusters}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">GPUs</span>
                                        <span className="font-semibold text-gray-900">{admin.gpuLimit}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Score</span>
                                        <span className={`font-semibold ${admin.performanceScore >= 80 ? 'text-green-600' :
                                            admin.performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {admin.performanceScore}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Grid - Clusters, Templates, Logs, AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Assign Clusters */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Assign Clusters</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Map/unmap clusters to admins, set GPU limits per cluster.</p>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <p className="text-sm text-gray-600 text-center">Cluster mapping interface coming soon</p>
                        </div>
                    </div>

                    {/* Quota Templates */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clipboard className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Quota Templates</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {quotaTemplates.map((qt) => (
                                <div key={qt.name} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                                    <div className="font-bold text-lg text-gray-900 mb-3">{qt.name}</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Clusters</span>
                                            <span className="font-semibold text-gray-900">{qt.clusters}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">GPUs</span>
                                            <span className="font-semibold text-gray-900">{qt.gpus}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Activity Logs */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Admin Activity Logs</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Track actions performed by each admin.</p>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                            <p className="text-sm text-gray-600 text-center">Activity tracking interface coming soon</p>
                        </div>
                    </div>

                    {/* AI Insights (Future) */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg border border-purple-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Intelligent resource distribution and optimization suggestions.</p>
                        <div className="bg-white/70 backdrop-blur rounded-xl p-6 border border-purple-200">
                            <p className="text-sm text-gray-600 text-center">🤖 AI-powered insights coming soon</p>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Admin Modal */}
                {(showCreate || editAdmin) && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-slide-up">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {showCreate ? "Create New Admin" : "Edit Admin"}
                                </h3>
                                <button
                                    onClick={() => { setShowCreate(false); setEditAdmin(null); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    const form = e.target as typeof e.target & {
                                        name: { value: string };
                                        email: { value: string };
                                        region: { value: string };
                                        gpuLimit: { value: string };
                                    };
                                    const newAdmin: Admin = {
                                        id: editAdmin ? editAdmin.id : Math.random().toString(36).slice(2),
                                        name: form.name.value,
                                        email: form.email.value,
                                        region: form.region.value,
                                        status: "active",
                                        customers: 0,
                                        clusters: 0,
                                        gpuLimit: Number(form.gpuLimit.value),
                                        performanceScore: 0,
                                    };
                                    if (showCreate) handleCreateAdmin(newAdmin);
                                    else if (editAdmin) handleEditAdmin(newAdmin);
                                }}
                                className="p-6 space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        name="name"
                                        defaultValue={editAdmin?.name || ""}
                                        placeholder="Enter admin name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        defaultValue={editAdmin?.email || ""}
                                        placeholder="admin@example.com"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                                    <select
                                        name="region"
                                        defaultValue={editAdmin?.region || ""}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
                                        required
                                    >
                                        <option value="">Select region</option>
                                        <option value="US-East">US-East</option>
                                        <option value="EU-West">EU-West</option>
                                        <option value="APAC">APAC</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">GPU Limit</label>
                                    <input
                                        name="gpuLimit"
                                        type="number"
                                        defaultValue={editAdmin?.gpuLimit || 0}
                                        placeholder="100"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        {showCreate ? "Create Admin" : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                                        onClick={() => { setShowCreate(false); setEditAdmin(null); }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManagement;
