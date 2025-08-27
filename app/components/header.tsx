export default function Header({ className = "", pageTitle = "" }: { className?: string; pageTitle?: string }) {
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

        {/* <span className="font-bold text-xl tracking-wide text-white">Operateev.ai</span> */}
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
