export default function Header({ className = "", pageTitle = "" }: { className?: string; pageTitle?: string }) {
  return (
    <header
      className={`bg-zinc-900 text-white shadow-lg px-6 py-4 flex items-center justify-between ${className}`}
      aria-label="Main site header"
    >
      {/* Left - Logo / Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-white text-sky-500 font-bold rounded-full flex items-center justify-center shadow-md">
          {/* Replace with actual logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-wide text-white">Operateev.ai</span>
      </div>
      <div className="flex items-center space-x-4">
        <div
          className="w-9 h-9 rounded-full bg-sky-400 text-white flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition"
          title="Profile"
        >
          N
        </div>
      </div>
    </header>
  );
}
