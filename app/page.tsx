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
      {/* Sidebar */}
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
          } flex flex-col z-30 relative`}
      >
        {/* Brand / Logo */}
        {/* Brand / Logo */}
        {sidebarOpen && (
          <div className="px-4 py-3 mt-3 text-3xl font-bold">
            <span className="text-white">Operateev.</span>
            <span className="text-sky-400">ai</span>
          </div>
        )}


        {/* Top spacing in collapsed mode */}
        {!sidebarOpen && <div className="mt-6" />}

        {/* Navigation */}
        <nav className="flex flex-col px-4 space-y-2 mt-20">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`rounded p-2 text-left transition-colors ${activePage === "dashboard"
              ? "bg-gray-700 text-white font-semibold"
              : "hover:bg-gray-700"
              }`}
          >
            {sidebarOpen ? "Dashboard" : "🏠"}
          </button>

          <button
            onClick={() => setActivePage("projects")}
            className={`rounded p-2 text-left transition-colors ${activePage === "projects"
              ? "bg-gray-700 text-white font-semibold"
              : "hover:bg-gray-700"
              }`}
          >
            {sidebarOpen ? "Projects" : "📁"}
          </button>

          <button
            onClick={() => setActivePage("reports")}
            className={`rounded p-2 text-left transition-colors ${activePage === "reports"
              ? "bg-gray-700 text-white font-semibold"
              : "hover:bg-gray-700"
              }`}
          >
            {sidebarOpen ? "Reports" : "📊"}
          </button>

          <button
            onClick={() => setActivePage("settings")}
            className={`rounded p-2 text-left transition-colors ${activePage === "settings"
              ? "bg-gray-700 text-white font-semibold"
              : "hover:bg-gray-700"
              }`}
          >
            {sidebarOpen ? "Settings" : "⚙️"}
          </button>




        </nav>

        {/* Collapse/Expand Arrow at sidebar edge */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-[5%] -right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
    ${sidebarOpen
              ? "bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500"
              : "bg-gradient-to-br from-green-400 to-teal-400 hover:from-teal-400 hover:to-green-400"}`
          }
        >
          {sidebarOpen ? (
            <ChevronLeft size={20} className="text-white" />
          ) : (
            <ChevronRight size={20} className="text-white" />
          )}
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
