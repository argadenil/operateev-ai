import React from "react";

interface SidebarProps {
    className?: string;
    expanded: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ className = "", expanded, toggleSidebar }: SidebarProps) {
    return (
        <aside
            className={`bg-gray-100 h-full p-4 transition-all duration-300 ${expanded ? "w-64" : "w-16"} ${className}`}
        >
            <button
                onClick={toggleSidebar}
                className="mb-4 p-2 bg-gray-300 rounded hover:bg-gray-400"
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
                {expanded ? "⮜" : "⮞"}
            </button>
            {expanded ? <div>Sidebar content here</div> : null}
        </aside>
    );
}
