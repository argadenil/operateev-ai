"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react"; // Icon
import { useRouter } from "next/navigation";
import { logout } from "../../lib/auth";
import { useToast } from "./toaster";

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
  const router = useRouter();
  const { success, error: pushError } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayName, setDisplayName] = useState<string>("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Load username and customer_id from localStorage (set during login)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const name = localStorage.getItem('username');
      if (name && name.trim()) setDisplayName(name);
      const cid = localStorage.getItem('customer_id');
      if (cid) setCustomerId(cid);
      const r = localStorage.getItem('role');
      if (r) setRole(r);
    } catch { }
  }, []);

  const initial = displayName.charAt(0).toUpperCase();

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

  const [loggingOut, setLoggingOut] = useState(false);

  function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setDropdownOpen(false);
    // Fire-and-forget; logout now clears local storage immediately and pings server in background
    logout().then((res) => {
      if (!res.ok && res.error) {
        // Optional: we can log this somewhere; avoid blocking UX
        pushError(res.error, { title: "Logout issue" });
      }
    }).finally(() => setLoggingOut(false));
    success("You have been logged out", { title: "Logged out" });
    router.replace('/login');
  }

  const menuItems = [
    { label: "Settings", onClick: () => router.push(customerId ? `/settings/${customerId}` : '/settings') },
    { label: "Logout", onClick: handleLogout },
  ];

  // Focus management when menu opens
  useEffect(() => {
    if (dropdownOpen) {
      setActiveIndex(0);
      requestAnimationFrame(() => {
        menuItemRefs.current[0]?.focus();
      });
    }
  }, [dropdownOpen]);

  const closeMenu = useCallback(() => {
    setDropdownOpen(false);
    setActiveIndex(0);
    // Return focus to profile button for accessibility
    requestAnimationFrame(() => profileButtonRef.current?.focus());
  }, []);

  const moveFocus = useCallback((delta: number) => {
    if (!dropdownOpen) return;
    setActiveIndex((prev) => {
      const next = (prev + delta + menuItems.length) % menuItems.length;
      menuItemRefs.current[next]?.focus();
      return next;
    });
  }, [dropdownOpen, menuItems.length]);

  const onMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        menuItemRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(menuItems.length - 1);
        menuItemRefs.current[menuItems.length - 1]?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        // Close on tab to maintain natural navigation
        closeMenu();
        break;
    }
  }, [closeMenu, moveFocus, menuItems.length]);

  // (Quick actions / notifications removed until implemented to avoid unused variable warnings)

  return (
    <header
      className={`bg-slate-900 text-white shadow-2xl border-b border-slate-700/50 backdrop-blur-xl relative z-[100] ${isMobile ? 'mobile-header px-4 py-3' : 'px-6 py-4'
        } flex items-center justify-between ${className}`}
      aria-label="Main site header"
    >
      {/* Left - Logo / Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className={`bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg ${isMobile ? 'w-8 h-8' : 'w-10 h-10'
            }`}>
            <span className={`font-bold text-white ${isMobile ? 'text-sm' : 'text-xl'}`}>O</span>
          </div>
          {!isMobile && (
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Operateev.<span className="text-indigo-400">ai</span>
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
              className={`rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ring-2 ring-white/10 hover:ring-white/20 ${isMobile ? 'w-9 h-9' : 'w-11 h-11'
                }`}
              title="Account"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              id="profile-button"
              role="button"
              tabIndex={0}
              ref={profileButtonRef}
              aria-label="Open user profile menu"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                }
                if (e.key === 'ArrowDown' && !dropdownOpen) {
                  e.preventDefault();
                  setDropdownOpen(true);
                }
              }}
            >
              <span className={isMobile ? 'text-sm' : 'text-xl'} aria-hidden="true">{initial}</span>
            </div>

            {dropdownOpen && (
              <div
                role="menu"
                aria-labelledby="profile-button"
                onKeyDown={onMenuKeyDown}
                className={`fixed bg-white/95 backdrop-blur-xl text-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-[9999] animate-slide-up will-change-transform focus:outline-none ${isMobile
                  ? 'top-14 right-2 w-44'
                  : 'top-16 right-6 w-48'
                  }`}
              >
                <div className={`border-b border-gray-200/60 bg-gradient-to-r from-indigo-50 to-purple-50 ${isMobile ? 'p-3' : 'p-4'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
                      }`}>
                      {initial}
                    </div>
                    <div>
                      <div className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>{displayName}</div>
                      <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-xs'}`}>{role}</div>
                    </div>
                  </div>
                </div>
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    ref={(el) => { menuItemRefs.current[index] = el; }}
                    role="menuitem"
                    tabIndex={activeIndex === index ? 0 : -1}
                    className={`w-full text-left hover:bg-indigo-50 hover:cursor-pointer focus:bg-indigo-50 focus:text-indigo-800 focus-visible:outline-none transition-colors duration-150 text-gray-700 hover:text-indigo-700 font-medium ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3'
                      }`}
                    onKeyDown={(e) => {
                      // Allow Enter/Space activation (already default for button) but handle Left/Right optionally
                      if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        moveFocus(1);
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        moveFocus(-1);
                      }
                    }}
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
