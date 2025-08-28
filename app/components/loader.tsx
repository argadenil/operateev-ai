// components/Loader.tsx
export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Brand text */}
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-sky-400 animate-pulse">
        Operateev.ai
      </span>

      {/* Optional subtext */}
      <span className="text-sm text-gray-500">Loading, please wait...</span>
    </div>
  );
}
