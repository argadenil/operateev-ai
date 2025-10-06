import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
export type DataVisualization =
    | { type: 'miniChart'; data: number[]; label?: string }
    | { type: 'dotIndicator'; items: { label: string; count: number; color?: string }[] }
    | { type: 'comparison'; primary: { label: string; value: string | number }; secondary: { label: string; value: string | number } }
    | { type: 'trendLine'; data: number[]; label?: string }
    | { type: 'tags'; items: string[] }
    | { type: 'none' };

export type StatCardProps = {
    title: string;
    value: React.ReactNode;
    icon: LucideIcon;
    palette: 'blue' | 'emerald' | 'amber' | 'orange' | 'violet' | 'red' | 'yellow' | 'indigo' | 'sky' | 'teal' | 'pink' | 'gray' | 'fuchsia' | 'orange-red' | 'blue-gray' | 'cyan' | 'lime' | 'rose';
    className?: string;
    size?: 'sm' | 'md';
    uppercaseTitle?: boolean;
    valueSuffix?: string;
    description?: React.ReactNode;
    descriptionClassName?: string;
    change?: number;
    changeType?: 'increase' | 'decrease' | 'neutral';
    dataViz?: DataVisualization; // New flexible data visualization prop
};

// Add keyframes for animated gradient and pulse
// Tailwind config should include:
// theme: { extend: { animation: { 'gradient-x': 'gradient-x 4s ease infinite', 'pulse-slow': 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite' }, keyframes: { 'gradient-x': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } } } } }

const paletteMap: Record<string, {
    gradient: string;
    iconWrap: string;
    iconColor: string;
    title: string;
    value: string;
    shadow: string;
    changeColors: { increase: string; decrease: string; neutral: string; };
    progressBar: string;
    progressBg: string;
}> = {
    blue: {
        gradient: "bg-[linear-gradient(to_right,_#373b44,_#4286f4)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-blue-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-blue-400',
        progressBg: 'bg-white/20'
    },
    emerald: {
        gradient: "bg-[linear-gradient(to_right,_#0a504a,_#38ef7d)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-emerald-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-emerald-400',
        progressBg: 'bg-white/20'
    },
    amber: {
        gradient: "bg-[linear-gradient(to_right,_#a86008,_#ffba56)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-amber-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-amber-400',
        progressBg: 'bg-white/20'
    },
    orange: {
        gradient: "bg-[linear-gradient(to_right,_#a86008,_#ffba56)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-orange-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-orange-400',
        progressBg: 'bg-white/20'
    },
    violet: {
        gradient: "bg-[linear-gradient(to_right,_#6a3093,_#a044ff)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-violet-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-violet-400',
        progressBg: 'bg-white/20'
    },
    pink: {
        gradient: "bg-[linear-gradient(to_right,_#493240,_#f09)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-pink-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-pink-400',
        progressBg: 'bg-white/20'
    },
    red: {
        gradient: "bg-[linear-gradient(to_right,_#d15241,_#e57373,_#f28f79)]", // warm red-to-copper gradient
        iconWrap: "bg-white/15 backdrop-blur-sm", // subtle blur
        iconColor: "text-white", // clean contrast
        title: "text-white/90", // soft readable title
        value: "text-white", // clear strong value
        shadow: "shadow-[0_4px_20px_rgba(210,82,65,0.35)]", // red-copper soft shadow
        changeColors: {
            increase: "text-white/90 bg-white/15 border-white/20",
            decrease: "text-white/80 bg-white/10 border-white/15",
            neutral: "text-white/70 bg-white/5 border-white/10",
        },
        progressBar: "bg-[#e2725b]", // copper red progress
        progressBg: "bg-white/10", // subtle track background
    },




    yellow: {
        gradient: "bg-[linear-gradient(to_right,_#f7971e,_#ffd200)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-yellow-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-yellow-400',
        progressBg: 'bg-white/20'
    },
    indigo: {
        gradient: "bg-[linear-gradient(to_right,_#3f2b96,_#a8c0ff)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-indigo-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-indigo-400',
        progressBg: 'bg-white/20'
    },
    sky: {
        gradient: "bg-[linear-gradient(to_right,_#2980b9,_#6dd5fa)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-sky-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-sky-400',
        progressBg: 'bg-white/20'
    },
    teal: {
        gradient: "bg-[linear-gradient(to_right,_#136a8a,_#267871)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-teal-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-teal-400',
        progressBg: 'bg-white/20'
    },
    gray: {
        gradient: "bg-[linear-gradient(to_right,_#757f9a,_#d7dde8)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-gray-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-gray-500',
        progressBg: 'bg-white/20'
    },
    cyan: {
        gradient: "bg-[linear-gradient(to_right,_#06b6d4,_#67e8f9)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-cyan-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-cyan-400',
        progressBg: 'bg-white/20'
    },
    lime: {
        gradient: "bg-[linear-gradient(to_right,_#84cc16,_#bef264)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-lime-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-lime-400',
        progressBg: 'bg-white/20'
    },
    rose: {
        gradient: "bg-[linear-gradient(to_right,_#f43f5e,_#fda4af)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-rose-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-rose-400',
        progressBg: 'bg-white/20'
    },
    fuchsia: {
        gradient: "bg-[linear-gradient(to_right,_#c026d3,_#f0abfc)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-fuchsia-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-fuchsia-400',
        progressBg: 'bg-white/20'
    },
    "orange-red": {
        gradient: "bg-[linear-gradient(to_right,_#ff4500,_#ff8c00)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-orange-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-orange-500',
        progressBg: 'bg-white/20'
    },
    "blue-gray": {
        gradient: "bg-[linear-gradient(to_right,_#64748b,_#94a3b8)]",
        iconWrap: 'bg-white/20 backdrop-blur-md',
        iconColor: 'text-white',
        title: 'text-white/95',
        value: 'text-white',
        shadow: 'shadow-blue-gray-500/40',
        changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
        progressBar: 'bg-blue-gray-400',
        progressBg: 'bg-white/20'
    },
};

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    palette,
    className = '',
    size = 'md',
    uppercaseTitle = false,
    valueSuffix,
    description,
    descriptionClassName,
    change,
    changeType = 'neutral',
    dataViz = { type: 'none' }
}) => {
    const p = paletteMap[palette];

    const sizeClasses = size === 'sm' ? {
        padding: 'p-3 sm:p-4',
        title: 'text-[10px] sm:text-xs',
        value: 'text-lg sm:text-xl',
        iconWrap: 'w-8 h-8 sm:w-9 sm:h-9',
        icon: 18
    } : {
        padding: 'p-4 sm:p-5',
        title: 'text-sm sm:text-base',
        value: 'text-2xl sm:text-3xl',
        iconWrap: 'w-10 h-10 sm:w-12 sm:h-12',
        icon: 22
    };

    // Mini Chart Renderer
    const renderMiniChart = (data: number[], label?: string) => {
        if (!data || data.length === 0) return null;
        const max = Math.max(...data);
        if (max === 0) return null;

        return (
            <div className="mt-3 w-full">
                {label && <p className="text-xs text-white/70 mb-2">{label}</p>}
                <div className="flex items-end justify-between gap-0.5 h-12 w-full">
                    {data.map((val, idx) => {
                        const heightPercent = Math.max((val / max) * 100, 5); // Minimum 5% height for visibility
                        return (
                            <div key={idx} className="flex-1 bg-white/10 rounded-t relative overflow-hidden" style={{ minHeight: '2px' }}>
                                <div
                                    className={`absolute bottom-0 left-0 right-0 ${p.progressBar} transition-all duration-500 rounded-t`}
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${val}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Dot Indicator Renderer
    const renderDotIndicator = (items: { label: string; count: number; color?: string }[]) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mt-3 w-full space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.color || 'bg-white/70'}`} />
                            <span className="text-white/80">{item.label}</span>
                        </div>
                        <span className="text-white/90 font-semibold">{item.count}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Comparison Renderer
    const renderComparison = (primary: { label: string; value: string | number }, secondary: { label: string; value: string | number }) => {
        return (
            <div className="mt-3 w-full grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-2">
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">{primary.label}</p>
                    <p className="text-lg font-bold text-white mt-1">{primary.value}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">{secondary.label}</p>
                    <p className="text-lg font-bold text-white mt-1">{secondary.value}</p>
                </div>
            </div>
        );
    };

    // Trend Line Renderer (Simple Sparkline)
    const renderTrendLine = (data: number[], label?: string) => {
        if (!data || data.length === 0) return null;

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const points = data.map((val, idx) => {
            const x = data.length === 1 ? 50 : (idx / (data.length - 1)) * 100;
            const y = 100 - ((val - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="mt-3 w-full">
                {label && <p className="text-xs text-white/70 mb-2">{label}</p>}
                <svg className="w-full h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="2"
                        points={points}
                    />
                    <polyline
                        fill="rgba(255,255,255,0.1)"
                        stroke="none"
                        points={`0,100 ${points} 100,100`}
                    />
                </svg>
            </div>
        );
    };

    // Tags Renderer
    const renderTags = (items: string[]) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mt-3 w-full flex flex-wrap gap-1.5">
                {items.map((item, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-0.5 bg-white/15 rounded-full text-[10px] text-white/90 font-medium"
                    >
                        {item}
                    </span>
                ))}
            </div>
        );
    };

    // Render appropriate data visualization
    const renderDataViz = () => {
        if (!dataViz || dataViz.type === 'none') return null;

        switch (dataViz.type) {
            case 'miniChart':
                return renderMiniChart(dataViz.data, dataViz.label);
            case 'dotIndicator':
                return renderDotIndicator(dataViz.items);
            case 'comparison':
                return renderComparison(dataViz.primary, dataViz.secondary);
            case 'trendLine':
                return renderTrendLine(dataViz.data, dataViz.label);
            case 'tags':
                return renderTags(dataViz.items);
            default:
                return null;
        }
    };

    return (
        <div
            className={`relative rounded-2xl ${p.shadow} ${p.gradient} group ${className} cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl animate-gradient-x`} style={{ transitionProperty: "transform, translate, scale, rotate", backgroundSize: '200% 200%' }}
        >
            <div className="flex flex-col w-full py-4 px-4">
                {/* Row 1: Title left, Icon right */}
                <div className="flex items-center justify-between mb-4">
                    <p className={`text-xl font-bold ${p.title}`}>{title}</p>
                    <div className={`${p.iconWrap} rounded-xl w-12 h-12 flex items-center justify-center transform transition-transform duration-500 ease-in-out group-hover:scale-110`} style={{ transitionProperty: "transform, translate, scale, rotate" }}>
                        <Icon size={28} className={p.iconColor} />
                    </div>
                </div>

                {/* Row 2: Value + Data Visualization */}
                <div className="flex flex-col w-full">
                    <h3 className={`text-3xl font-bold ${p.value}`}>{value}{valueSuffix}</h3>

                    {/* Render data visualization component */}
                    {renderDataViz()}
                </div>
            </div>
        </div>

    );
};

export default StatCard;
