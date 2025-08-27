"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
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
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
          } flex flex-col z-30`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-lg font-bold">
            {sidebarOpen ? "Menu" : ""}
          </span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex flex-col px-4 space-y-2 mt-4">
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
            onClick={() => setActivePage("settings")}
            className={`rounded p-2 text-left transition-colors ${activePage === "settings"
                ? "bg-gray-700 text-white font-semibold"
                : "hover:bg-gray-700"
              }`}
          >
            {sidebarOpen ? "Settings" : "⚙️"}
          </button>
        </nav>
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
