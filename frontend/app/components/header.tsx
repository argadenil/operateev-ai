import { useState, useRef, useEffect } from "react";
import { Bell, Search, Zap } from "lucide-react"; // Icons for notifications, search, quick actions

export default function Header({
  className = "",
  pageTitle = "",
}: {
  className?: string;
  pageTitle?: string;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setQuickActionOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Profile", onClick: () => console.log("Go to profile") },
    { label: "Settings", onClick: () => console.log("Go to settings") },
    { label: "Logout", onClick: () => console.log("Logging out") },
  ];

  const quickActions = [
    { label: "New Project", onClick: () => console.log("New Project") },
    { label: "Upload File", onClick: () => console.log("Upload File") },
  ];

  const notifications = [
    "New comment on your post",
    "Server backup completed",
    "New user registered",
  ];

  return (
    <header
      className={`bg-gray-950 text-white shadow-lg px-6 py-4 flex items-center justify-between ${className}`}
      aria-label="Main site header"
    >
      {/* Left - Logo / Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 text-sky-500 font-bold rounded-full flex items-center justify-center shadow-md ml-15">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Operateev.<span className="text-indigo-500">ai</span>
          </h1>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 mx-6 relative max-w-xs">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-800 text-white rounded-md px-3 py-1.5 pl-9 text-sm placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-2.5 top-1.5 text-white w-4 h-4" />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {/* <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
              {notifications.length}
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-zinc-900 rounded-md shadow-lg overflow-hidden z-50">
              {notifications.map((note, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {note}
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* Quick Actions */}
        {/* <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition"
            onClick={() => setQuickActionOpen(!quickActionOpen)}
          >
            <Zap className="w-5 h-5 text-white" />
          </button>
          {quickActionOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-zinc-900 rounded-md shadow-lg overflow-hidden z-50">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white transition"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition"
            title="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            N
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-zinc-900 rounded-md shadow-lg overflow-hidden z-50">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
