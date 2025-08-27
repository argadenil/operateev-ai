"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Footer from "./components/footer";
import Header from "./components/header";
import Dashboard from "./components/dashboard";
import Settings from "./components/settings";
import Chat from "./components/chat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen relative overflow-hidden bg-gray-100">
      <aside
        className={`bg-gray-950 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
          } flex flex-col relative z-30 shadow-2xl`}
      >
        {/* Logo */}
        {/* <div className={`flex items-center justify-center ${sidebarOpen ? "h-24" : "h-20"} mt-4`}>
          {sidebarOpen ? (
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Operateev.<span className="text-sky-400">ai</span>
            </h1>
          ) : (
            <div className="text-3xl font-bold text-sky-400 animate-pulse">O</div>
          )}
        </div> */}

        {/* Navigation */}
        <nav className="flex flex-col mt-40 space-y-3">
          {[
            { name: "Dashboard", icon: "🏠", key: "dashboard" },
            { name: "Projects", icon: "📁", key: "projects" },
            { name: "Reports", icon: "📊", key: "reports" },
            { name: "Settings", icon: "⚙️", key: "settings" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`group relative flex items-center p-3 mx-3 rounded-2xl transition-all duration-300 transform ${activePage === item.key
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
            </button>
          ))}
        </nav>
        <div className="mt-auto mb-4 px-4">
          {sidebarOpen ? (
            <span className="text-sm font-medium text-white-400 text-left block">
              Version: v1.0.0
            </span>
          ) : (
            <span className="text-sm font-medium text-white-400 text-left block" title="App Version">
              v1.0.0
            </span>
          )}
        </div>

        {/* Collapse / Expand */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-24 -right-5 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
    ${sidebarOpen
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
        >
          {sidebarOpen
            ? <ChevronLeft size={22} strokeWidth={3} className="text-white" />
            : <ChevronRight size={22} strokeWidth={3} className="text-white" />}
        </button>

      </aside>





      {/* Main Area */}
      <div className="flex flex-col flex-grow relative z-20 bg-white">
        <Header />
        <main className="flex-grow p-4 overflow-auto bg-white">
          {renderPage()}
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
        {/* Header with close + text */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold text-gray-800">
            👋 Welcome Nilesh
          </span>
          <button onClick={() => setSlideOverOpen(false)} className="text-gray-600 hover:text-gray-900">
            <X size={22} />
          </button>
        </div>

        {/* Content area */}
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
