"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { ChevronLeft, ChevronRight, X, Menu } from "lucide-react";
import Chat from "./components/chat";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// Lightweight memo wrappers to avoid re-rendering when layout state changes
const MemoHeader = React.memo(Header);
const MemoFooter = React.memo(Footer);
const MemoChat = React.memo(Chat);

interface NavItemType { name: string; icon: string; href: string; }

// Individual nav item (memoized)
const NavItem = React.memo(function NavItem({ item, isActive, sidebarOpen, onNavigate }: { item: NavItemType; isActive: boolean; sidebarOpen: boolean; onNavigate: () => void; }) {
    return (
        <Link
            href={item.href}
            prefetch
            onClick={onNavigate}
            className={`group will-change-transform relative flex items-center p-4 mx-3 rounded-2xl cursor-pointer transition-all duration-200 transform touch-manipulation ${isActive
                ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/25"
                : "hover:bg-white/10 hover:backdrop-blur-sm text-gray-300 hover:text-white"}`}
            title={!sidebarOpen ? item.name : undefined}
            aria-current={isActive ? 'page' : undefined}
            style={{ transform: 'translateZ(0)' }}
        >
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110" aria-hidden>{item.icon}</span>
            <span className={`ml-4 font-medium text-base group-hover:text-white transition-all duration-200 whitespace-nowrap overflow-hidden ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transform: 'translateZ(0)' }}>
                {item.name}
            </span>
        </Link>
    );
});
NavItem.displayName = 'NavItem';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [slideOverOpen, setSlideOverOpen] = useState(false);
    const [displayName, setDisplayName] = useState<string>("User");

    const pathname = usePathname(); // current route
    const router = useRouter();

    // Optimized sidebar toggle function
    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    // Load customer id after mount to avoid SSR / hydration mismatch and allow direct deep-links
    const [customerId, setCustomerId] = useState<string | null>(null);
    useEffect(() => {
        try {
            const cid = localStorage.getItem('customer_id');
            if (cid) setCustomerId(cid);
            const name = localStorage.getItem('username');
            if (name && name.trim()) setDisplayName(name);
        } catch { }
    }, []);

    // Memoized navigation items (dashboard link adapts to presence of id)
    const navigationItems: NavItemType[] = useMemo(() => [
        { name: "Dashboard", icon: "🏠", href: customerId ? `/dashboard/${customerId}` : "/dashboard" },
        { name: "GPU Resources", icon: "📁", href: customerId ? `/gpu-resources/${customerId}` : "/gpu-resources" },
        { name: "Job Management", icon: "📊", href: customerId ? `/job-management/${customerId}` : "/job-management" },
        { name: "Settings", icon: "⚙️", href: customerId ? `/settings/${customerId}` : "/settings" },
    ], [customerId]);

    // Preload (prefetch) target routes once on mount for snappier nav
    useEffect(() => {
        navigationItems.forEach(i => router.prefetch(i.href));
    }, [navigationItems, router]);

    // Navigation handler (close sidebar on route change for mobile). Route change handled by Link.
    const handleNavigateClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const pageTitle = useMemo(() => {
        if (!pathname) return "PAGE";
        
        // Handle dynamic routes with IDs
        if (pathname.startsWith("/dashboard")) return "Dashboard";
        if (pathname.startsWith("/gpu-resources")) return "GPU Resources";
        if (pathname.startsWith("/job-management")) return "Job Management";
    // Profile page removed
        if (pathname.startsWith("/settings")) return "Settings";
        
        // Fallback for exact matches or unknown routes
        return "PAGE";
    }, [pathname]);

    // Routes that should NOT use the application shell (no sidebar/chat/system status)
    const lightweightRoutes = ["/login", "/register"];
    if (lightweightRoutes.includes(pathname)) {
        // Let the page itself control header/footer; bypass app shell to avoid duplication
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Mobile Menu Button - Show only on mobile screens using CSS */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden touch-manipulation block"
                aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={sidebarOpen}
                style={{ transform: 'translateZ(0)' }}
            >
                <Menu size={20} className="text-gray-700" aria-hidden="true" />
            </button>

            {/* Sidebar */}
            <aside
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white sidebar-transition ${
                    sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
                    } flex flex-col relative z-30 shadow-2xl border-slate-700/50 md:relative fixed`}
                style={{
                    transform: 'translateZ(0)', // Force hardware acceleration
                    containIntrinsicSize: '16rem auto' // Optimize layout
                }}
            >
                {/* Sidebar background pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

                <nav className="flex flex-col mt-16 md:mt-40 space-y-2 relative z-10">
                    {navigationItems.map((item) => {
                        const isActive = item.name === 'Dashboard'
                            ? pathname.startsWith('/dashboard') // match /dashboard or /dashboard/:id
                            : pathname === item.href;
                        return (
                            <NavItem
                                key={item.href}
                                item={item}
                                isActive={isActive}
                                sidebarOpen={sidebarOpen}
                                onNavigate={handleNavigateClose}
                            />
                        );
                    })}
                </nav>

                <div className="mt-auto mb-4 px-4 text-white/70 text-sm relative z-10">
                    <div className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-70'}`}
                        style={{ transform: 'translateZ(0)' }}>
                        {sidebarOpen ? (
                            <div className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="text-xs font-medium">Version: v1.0.0</div>
                            </div>
                        ) : (
                            <span title="App Version" className="text-xs">v1.0.0</span>
                        )}
                    </div>
                </div>

                {/* Collapse / Expand - Hide on mobile screens using CSS */}
                <button
                    onClick={toggleSidebar}
                    className="hover:cursor-pointer absolute top-24 -right-5 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl bg-indigo-500 text-white transition-all duration-200 hover:scale-110 z-40 touch-manipulation hidden md:flex"
                    aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    style={{ transform: 'translateZ(0)' }}
                >
                    {sidebarOpen ? (
                        <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                        <ChevronRight size={24} strokeWidth={2.5} aria-hidden="true" />
                    )}
                </button>
            </aside>

            {/* Main Area */}
            <div className="flex flex-col flex-grow relative z-20 bg-white/80 backdrop-blur-sm main-content-transition">
                <MemoHeader />
                <main className={`bg-gray-200 flex-grow overflow-auto bg-gradient-to-br from-white/90 via-indigo-50/30 to-purple-50/30 main-content-transition px-4 py-4 md:px-6 md:py-6 ${
                    sidebarOpen ? 'lg:px-6 lg:py-6' : 'lg:px-8 lg:py-6'
                    }`}>
                    <div className="flex items-center justify-between mb-6 transition-all duration-300 ease-in-out">
                        <h1 className="font-bold text-gray-900 tracking-tight relative transition-all duration-300 ease-in-out text-xl sm:text-2xl lg:text-2xl">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                                {pageTitle}
                            </span>
                            <div className="absolute left-0 -bottom-2 w-12 sm:w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        </h1>
                    </div>

                    {/* Content wrapper with consistent spacing */}
                    <div className="animate-slide-up transition-all duration-300 ease-in-out">
                        {children}
                    </div>
                </main>
                <MemoFooter />
            </div>

            {/* Floating Action Button */}
            {!slideOverOpen && (
                <div className="fixed z-50 bottom-4 right-4 md:top-[69%] md:right-6 md:-translate-y-1/2" style={{ position: 'fixed' }}>
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 blur-lg opacity-65 group-hover:opacity-80 transition" />

                        <video
                            src="/images/Robot.mp4"
                            className="relative rounded-full cursor-pointer bg-gradient-to-tr from-teal-800 via-teal-900 to-black
    backdrop-blur-md ring-2 ring-orange-400/80
    filter contrast-145 brightness-110 saturate-140
    shadow-[0_0_15px_rgba(239,68,68,0.65),0_0_30px_rgba(220,38,38,0.35),0_0_45px_rgba(185,28,28,0.25)]
    hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_40px_rgba(220,38,38,0.45),0_0_60px_rgba(185,28,28,0.35)]
    active:scale-95 transition-all duration-300 w-12 h-12 p-1 md:w-18 md:h-18 md:p-1"
                            width={64}
                            height={64}
                            muted
                            loop
                            playsInline
                            autoPlay
                            aria-hidden
                            onClick={() => {
                                setTimeout(() => setSlideOverOpen(true), 100);
                            }}
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                pointerEvents: 'auto'
                            }}
                        />

                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full border-2 border-white animate-pulse w-3 h-3 md:w-5 md:h-5"></div>

                    </div>
                </div>
            )}

            {/* Slide-over panel */}
            <div
                className={`fixed inset-y-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 z-50 chat-slide-transition w-full h-full md:w-96 md:max-w-[90vw] lg:max-w-[400px] md:h-[96vh] ${slideOverOpen
                        ? "chat-slide-open"
                        : "chat-slide-closed"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Chat assistant header inside chat window */}
                    <div className="flex justify-between items-center border-b border-gray-200/60 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm p-4 md:p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-gray-800 text-base md:text-lg">
                                👋 Welcome {displayName}
                            </span>
                        </div>
                        <button
                            onClick={() => setSlideOverOpen(false)}
                            className="p-2 rounded-xl hover:bg-white/60 transition-all duration-200 group hover:scale-110 active:scale-95"
                        >
                            <X size={20} className="text-gray-600 group-hover:text-gray-800" />
                        </button>
                    </div>

                    {/* Chat body takes the rest of height */}
                    <div className="flex-grow overflow-y-auto">
                        <MemoChat />
                    </div>
                </div>
            </div>

            {/* Overlay for mobile sidebar - Show only when sidebar is open on mobile */}
            <div
                onClick={toggleSidebar}
                className={`fixed inset-0 bg-black/20 overlay-optimized smooth-transition z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
            />

            {/* Overlay for chat */}
            {slideOverOpen && (
                <div
                    onClick={() => setSlideOverOpen(false)}
                    className="fixed inset-0 bg-black/20 overlay-optimized smooth-transition z-40"
                />
            )}
        </div>
    );
}
