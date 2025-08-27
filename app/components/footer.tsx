export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`bg-black text-white text-left py-1 px-4 text-xs ${className}`}>
      © {new Date().getFullYear()} Operateev.ai All rights reserved.
    </footer>
  );
}
