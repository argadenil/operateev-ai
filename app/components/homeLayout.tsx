"use client";

import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Chat from "./chat";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [slideOverOpen, setSlideOverOpen] = useState(false);

    const pathname = usePathname(); // current route

    // Map of routes to names for dynamic page title
    const routeMap: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/projects": "Projects",
        "/reports": "Reports",
        "/settings": "Settings",
    };

    return (
        <div className="flex h-screen relative overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-gray-950 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                    } flex flex-col relative z-30 shadow-2xl`}
            >
                <nav className="flex flex-col mt-40 space-y-3">
                    {[
                        { name: "Dashboard", icon: "🏠", href: "/dashboard" },
                        { name: "Projects", icon: "📁", href: "/projects" },
                        { name: "Reports", icon: "📊", href: "/reports" },
                        { name: "Settings", icon: "⚙️", href: "/settings" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex items-center p-3 mx-3 rounded-2xl transition-all duration-300 transform ${pathname === item.href
                                ? "bg-indigo-500 text-white shadow-xl scale-105"
                                : "hover:bg-gray-800 hover:scale-105 text-gray-200"
                                }`}
                            title={!sidebarOpen ? item.name : undefined}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="ml-4 font-semibold text-lg group-hover:text-white transition-all duration-300">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto mb-4 px-4 text-white text-sm">
                    {sidebarOpen ? "Version: v1.0.0" : <span title="App Version">v1.0.0</span>}
                </div>

                {/* Collapse / Expand */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-24 -right-5 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl bg-indigo-500 text-white hover:bg-indigo-600"
                >
                    {sidebarOpen ? <ChevronLeft size={22} strokeWidth={3} /> : <ChevronRight size={22} strokeWidth={3} />}
                </button>
            </aside>

            {/* Main Area */}
            <div className="flex flex-col flex-grow relative z-20 bg-white">
                <Header />
                <main className="flex-grow p-4 overflow-auto bg-white">
                    <div className="flex items-center justify-between mb-6 ml-3">
                        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
                            {routeMap[pathname]?.toUpperCase() || "PAGE"}
                        </h1>
                    </div>

                    {/* Render the page content */}
                    {children}
                </main>
                <Footer />
            </div>

            {/* Floating Action Button */}
            {!slideOverOpen && (
                <video
                    src="images/agent.webm"
                    className="fixed top-1/2 right-6 w-[65px] h-[65px] -translate-y-1/2 rounded-full cursor-pointer shadow-lg border-2 border-white bg-transparent z-40"
                    width={70}
                    height={70}
                    muted
                    loop
                    playsInline
                    autoPlay
                    aria-hidden
                    onClick={() => setSlideOverOpen(true)}
                />
            )}

            {/* Slide-over panel */}
            <div
                className={`fixed inset-y-0 right-0 w-95 h-[96vh] bg-white shadow-xl transform transition-transform duration-300 z-50 ${slideOverOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="text-lg font-semibold text-gray-800">👋 Welcome Nilesh</span>
                    <X onClick={() => setSlideOverOpen(false)}></X>

                </div>

                <div className="p-4 space-y-4 h-[88vh] overflow-y-auto">
                    <Chat />
                </div>
            </div>

            {/* Overlay */}
            {slideOverOpen && (
                <div
                    onClick={() => setSlideOverOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 transition-opacity z-0"
                />
            )}
        </div>
    );
}
