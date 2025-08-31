"use client";

import React, { useState, useTransition, useEffect, useCallback, useMemo } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { ChevronLeft, ChevronRight, X, Menu } from "lucide-react";
import Chat from "./components/chat";
import { usePathname, useRouter } from "next/navigation";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [slideOverOpen, setSlideOverOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const pathname = usePathname(); // current route
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activeHref, setActiveHref] = useState<string | null>(null);

    // Debounced resize handler for better performance
    const handleResize = useCallback(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (window.innerWidth >= 768) {
            setSidebarOpen(false); // Close sidebar on desktop
        }
    }, []);

    // Check if device is mobile with debounced resize handler
    useEffect(() => {
        handleResize();
        
        let timeoutId: NodeJS.Timeout;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };

        window.addEventListener('resize', debouncedResize, { passive: true });
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(timeoutId);
        };
    }, [handleResize]);

    // Memoized navigation items to prevent re-renders
    const navigationItems = useMemo(() => [
        { name: "Dashboard", icon: "🏠", href: "/dashboard" },
        { name: "GPU Resources", icon: "📁", href: "/gpu-resources" },
        { name: "Job Management", icon: "📊", href: "/job-management" },
        { name: "Settings", icon: "⚙️", href: "/settings" },
    ], []);

    // Optimized sidebar toggle function
    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    // Optimized navigation handler
    const handleNavigation = useCallback((href: string) => {
        setActiveHref(href);
        if (isMobile) setSidebarOpen(false); // Close sidebar on mobile after selection
        startTransition(() => {
            router.push(href);
        });
    }, [isMobile, router]);

    // Map of routes to names for dynamic page title
    const routeMap: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/gpu-resources": "GPU Resources", 
        "/job-management": "Job Management",
        "/settings": "Settings",
    };

    return (
        <div className="flex h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden touch-manipulation"
                    aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={sidebarOpen}
                    style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
                >
                    <Menu size={20} className="text-gray-700" aria-hidden="true" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white sidebar-transition ${
                    isMobile 
                        ? (sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed")
                        : (sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed")
                } flex flex-col relative z-30 shadow-2xl border-slate-700/50 ${
                    isMobile ? 'fixed' : 'relative'
                }`}
                style={{ 
                    transform: 'translateZ(0)', // Force hardware acceleration
                    containIntrinsicSize: '16rem auto' // Optimize layout
                }}
            >
                {/* Sidebar background pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                
                <nav className={`flex flex-col ${isMobile ? 'mt-16' : 'mt-40'} space-y-2 relative z-10`}>
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href || activeHref === item.href;
                        return (
                            <button
                                key={item.href}
                                type="button"
                                onClick={() => handleNavigation(item.href)}
                                className={`group relative flex items-center p-4 mx-3 rounded-2xl cursor-pointer transition-all duration-200 transform touch-manipulation ${isActive
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/25"
                                    : "hover:bg-white/10 hover:backdrop-blur-sm text-gray-300 hover:text-white"
                                    }`}
                                title={!sidebarOpen && !isMobile ? item.name : undefined}
                                aria-current={pathname === item.href ? 'page' : undefined}
                                style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
                            >
                                <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                                <span className={`ml-4 font-medium text-base group-hover:text-white transition-all duration-200 whitespace-nowrap overflow-hidden ${
                                    (sidebarOpen || isMobile) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                }`}
                                style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
                                >
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto mb-4 px-4 text-white/70 text-sm relative z-10">
                    <div className={`transition-all duration-200 ${(sidebarOpen || isMobile) ? 'opacity-100' : 'opacity-70'}`}
                         style={{ transform: 'translateZ(0)' }}>
                        {(sidebarOpen || isMobile) ? (
                            <div className={`transition-all duration-200 ${(sidebarOpen || isMobile) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="text-xs font-medium">Version: v1.0.0</div>
                            </div>
                        ) : (
                            <span title="App Version" className="text-xs">v1.0.0</span>
                        )}
                    </div>
                </div>

                {/* Collapse / Expand - Hidden on mobile */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="hover:cursor-pointer absolute top-24 -right-5 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-110 z-40 touch-manipulation"
                        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        style={{ transform: 'translateZ(0)' }}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
                        ) : (
                            <ChevronRight size={24} strokeWidth={2.5} aria-hidden="true" />
                        )}
                    </button>
                )}
            </aside>

            {/* Main Area */}
            <div className={`flex flex-col flex-grow relative z-20 bg-white/80 backdrop-blur-sm main-content-transition ${
                isMobile ? 'main-content-mobile' : ''
            }`}>
                <Header />
                <main className={`flex-grow overflow-auto bg-gradient-to-br from-white/90 via-indigo-50/30 to-purple-50/30 main-content-transition ${
                    isMobile 
                        ? 'px-4 py-4' 
                        : sidebarOpen 
                            ? 'px-6 py-6' 
                            : 'px-8 py-6'
                }`}>
                    <div className={`flex items-center justify-between mb-6 transition-all duration-300 ease-in-out`}>
                        <h1 className={`font-bold text-gray-900 tracking-tight relative transition-all duration-300 ease-in-out ${
                            isMobile ? 'text-xl sm:text-2xl' : 'text-2xl lg:text-2xl'
                        }`}>
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                                {pathname && routeMap[pathname] || "PAGE"}
                            </span>
                            <div className="absolute left-0 -bottom-2 w-12 sm:w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        </h1>
                    </div>

                    {/* Content wrapper with consistent spacing */}
                    <div className="animate-slide-up transition-all duration-300 ease-in-out">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>

            {/* Floating Action Button */}
            {!slideOverOpen && (
                <div className={`fixed z-50 ${
                    isMobile 
                        ? 'bottom-4 right-4' 
                        : 'top-[20%] right-6 -translate-y-1/2'
                }`} style={{ position: 'fixed' }}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <video
                            src="images/agent.webm"
                            className={`relative rounded-full cursor-pointer shadow-2xl border-2 border-white/20 bg-transparent backdrop-blur-sm hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-3xl ${
                                isMobile ? 'w-12 h-12' : 'w-16 h-16'
                            }`}
                            width={isMobile ? 48 : 64}
                            height={isMobile ? 48 : 64}
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
                        <div className={`absolute -top-1 -right-1 bg-green-500 rounded-full border-2 border-white animate-pulse ${
                            isMobile ? 'w-3 h-3' : 'w-4 h-4'
                        }`}></div>
                    </div>
                </div>
            )}

            {/* Slide-over panel */}
            <div
                className={`fixed inset-y-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 z-50 chat-slide-transition ${
                    isMobile 
                        ? 'chat-panel-mobile w-full h-full' 
                        : 'w-96 max-w-[90vw] md:max-w-[400px] h-[96vh]'
                } ${slideOverOpen 
                    ? "chat-slide-open" 
                    : "chat-slide-closed"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Chat assistant header inside chat window */}
                    <div className={`flex justify-between items-center border-b border-gray-200/60 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm ${
                        isMobile ? 'p-4' : 'p-6'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className={`font-semibold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
                                👋 Welcome Nilesh
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
                        <Chat />
                    </div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && isMobile && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/20 overlay-optimized smooth-transition z-20"
                />
            )}

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
