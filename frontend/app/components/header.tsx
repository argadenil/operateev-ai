import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react"; // Icon

interface HeaderProps {
  className?: string;
  pageTitle?: string;
  showSearch?: boolean;
  showUserMenu?: boolean;
}

export default function Header({
  className = "",
  showSearch = true,
  showUserMenu = true,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
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

  // (Quick actions / notifications removed until implemented to avoid unused variable warnings)

  return (
    <header
      className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700/50 backdrop-blur-xl relative z-[100] ${
        isMobile ? 'mobile-header px-4 py-3' : 'px-6 py-4'
      } flex items-center justify-between ${className}`}
      aria-label="Main site header"
    >
      {/* Left - Logo / Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ${
            isMobile ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <span className={`font-bold text-white ${isMobile ? 'text-sm' : 'text-xl'}`}>O</span>
          </div>
          {!isMobile && (
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Operateev.<span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">ai</span>
            </h1>
          )}
        </div>
      </div>

      {/* Center - Search (Hidden on mobile) */}
  {showSearch && !isMobile && (
        <div className="flex-1 mx-8 relative max-w-md">
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">
              Search anything
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Search anything..."
              className="w-full bg-white/10 backdrop-blur-sm text-white rounded-2xl px-4 py-3 pl-12 text-sm placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" aria-hidden="true" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-semibold text-white/50 bg-white/10 border border-white/20 rounded">⌘K</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Right - Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search icon for mobile */}
  {showSearch && isMobile && (
          <button 
            className="p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Open search"
          >
            <Search className="w-5 h-5 text-white/80" aria-hidden="true" />
          </button>
        )}

        {/* Profile */}
  {showUserMenu && (
  <div className="relative" ref={dropdownRef}>
          <div
            className={`rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ring-2 ring-white/10 hover:ring-white/20 ${
              isMobile ? 'w-9 h-9' : 'w-11 h-11'
            }`}
            title="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            id="profile-button"
            role="button"
            tabIndex={0}
            aria-label="Open user profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDropdownOpen(!dropdownOpen);
              }
            }}
          >
            <span className={isMobile ? 'text-sm' : 'text-lg'} aria-hidden="true">N</span>
          </div>

          {dropdownOpen && (
            <div className={`fixed bg-white/95 backdrop-blur-xl text-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-[9999] animate-slide-up ${
              isMobile 
                ? 'top-14 right-2 w-44' 
                : 'top-16 right-6 w-48'
            }`}>
              <div className={`border-b border-gray-200/60 bg-gradient-to-r from-indigo-50 to-purple-50 ${
                isMobile ? 'p-3' : 'p-4'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium ${
                    isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
                  }`}>
                    N
                  </div>
                  <div>
                    <div className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>Nilesh</div>
                    <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>Administrator</div>
                  </div>
                </div>
              </div>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full text-left hover:bg-indigo-50 transition-colors duration-200 text-gray-700 hover:text-indigo-700 font-medium ${
                    isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
  )}
      </div>
    </header>
  );
}
