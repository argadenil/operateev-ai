import { useState, useRef, useEffect } from "react";

export default function Header({
  className = "",
  pageTitle = "",
}: {
  className?: string;
  pageTitle?: string;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: "Profile", onClick: () => console.log("Go to profile") },
    { label: "Settings", onClick: () => console.log("Go to settings") },
    { label: "Logout", onClick: () => console.log("Logging out") },
  ];

  return (
    <header
      className={`bg-zinc-900 text-white shadow-lg px-6 py-4 flex items-center justify-between ${className}`}
      aria-label="Main site header"
    >
      {/* Left - Logo / Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 text-sky-500 font-bold rounded-full flex items-center justify-center shadow-md ml-7">
          <img
            src="/images/logo.png"
            alt="Operateev.ai Logo"
            className="w-full h-full object-contain transform scale-200"
          />
        </div>
      </div>

      {/* Right - Profile */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition"
          title="Profile"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          N
        </div>

        {/* Dropdown Menu */}
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
    </header>
  );
}
