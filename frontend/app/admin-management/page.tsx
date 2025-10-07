
"use client";

import React, { useState, useEffect } from "react";
import {
    Shield,
    Search,
    Plus,
    Edit,
    Trash2,
    BarChart2,
    Layers,
    Clipboard,
    Lightbulb,
    Users,
    TrendingUp,
    Activity,
    Filter,
    X
} from "lucide-react";


// Placeholder data types
type Admin = {
    id: string;
    name: string;
    email: string;
    region: string;
    status: "active" | "inactive";
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
];

// Main Component
const AdminManagement: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
    const [search, setSearch] = useState("");
    const [regionFilter, setRegionFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [showCreate, setShowCreate] = useState(false);
    const [editAdmin, setEditAdmin] = useState<Admin | null>(null);

    // Filter logic
    const filteredAdmins = admins.filter((admin) => {
        return (
            (!search || admin.name.toLowerCase().includes(search.toLowerCase()) || admin.email.toLowerCase().includes(search.toLowerCase())) &&
            (!regionFilter || admin.region === regionFilter) &&
            (!statusFilter || admin.status === statusFilter)
        );
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
            <div className="max-w-7xl mx-auto">
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
                            Admin Directory
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {filteredAdmins.length} {filteredAdmins.length === 1 ? 'admin' : 'admins'} found
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customers</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Clusters</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GPU Limit</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-blue-50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {admin.region}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                admin.status === 'active' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{admin.customers}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{admin.clusters}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{admin.gpuLimit}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                                                    <div 
                                                        className={`h-2 rounded-full ${
                                                            admin.performanceScore >= 80 ? 'bg-green-500' :
                                                            admin.performanceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${admin.performanceScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{admin.performanceScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                        <span className={`font-semibold ${
                                            admin.performanceScore >= 80 ? 'text-green-600' :
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
