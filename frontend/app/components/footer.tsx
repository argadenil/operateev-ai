interface FooterProps {
  showStatus?: boolean;
  className?: string;
}

export default function Footer({ showStatus = true, className = "" }: FooterProps) {
  return (
    <footer className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white/80 border-t border-slate-700/50 py-3 px-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showStatus && (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/60">System Operational</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-white/60">All rights reserved</div>
          <div className="w-1 h-1 bg-white/30 rounded-full" />
          <div className="text-xs font-medium">© 2025 Operateev.ai</div>
        </div>
      </div>
    </footer>
  );
}
