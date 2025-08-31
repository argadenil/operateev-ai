export default function Footer() {
  return (
    <footer className={`bg-gray-950 text-white text-bold text-right py-1 px-4 text-xs `}>
      © {new Date().getFullYear()} Operateev.ai All rights reserved.
    </footer>
  );
}
