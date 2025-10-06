import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export type StatCardProps = {
    title: string;
    value: React.ReactNode;
    icon: LucideIcon;
    palette: 'blue' | 'emerald' | 'amber' | 'orange' | 'violet' | 'red' | 'yellow' | 'indigo' | 'sky' | 'teal' | 'pink' | 'gray';
    className?: string; // for grid span overrides etc
    size?: 'sm' | 'md';
    uppercaseTitle?: boolean;
    valueSuffix?: string;
    description?: React.ReactNode; // small helper / sub label line
    descriptionClassName?: string; // override color of description
    change?: number; // percentage or absolute change
    changeType?: 'increase' | 'decrease' | 'neutral';
};

// Central palette map so variants stay consistent across pages
const paletteMap: Record<string, {
    container: string;
    gradient: string;
    ring: string;
    iconWrap: string;
    iconColor: string;
    title: string;
    value: string;
    shadow: string;
}> = {
    blue: {
        container: 'bg-blue-50/80',
        gradient: 'from-blue-400/30 via-transparent to-blue-500/30',
        ring: 'hover:border-blue-500/50 ring-blue-400/40',
        iconWrap: 'from-blue-400/60 to-blue-500/60 ring-blue-500/50 shadow-blue-500/30',
        iconColor: 'text-blue-700',
        title: 'text-blue-800',
        value: 'text-blue-900',
        shadow: 'shadow-blue-500/20'
    },
    emerald: {
        container: 'bg-emerald-50/80',
        gradient: 'from-emerald-400/30 via-transparent to-green-500/30',
        ring: 'hover:border-emerald-500/50 ring-emerald-400/40',
        iconWrap: 'from-emerald-400/60 to-green-500/60 ring-emerald-500/50 shadow-emerald-500/30',
        iconColor: 'text-emerald-700',
        title: 'text-emerald-800',
        value: 'text-emerald-900',
        shadow: 'shadow-emerald-500/20'
    },
    violet: {
        container: 'bg-violet-50/80',
        gradient: 'from-violet-500/20 via-transparent to-fuchsia-500/25',
        ring: 'hover:border-violet-500/50 ring-violet-400/40',
        iconWrap: 'from-violet-400/60 to-fuchsia-500/60 ring-violet-500/50 shadow-violet-500/30',
        iconColor: 'text-violet-700',
        title: 'text-violet-800',
        value: 'text-violet-900',
        shadow: 'shadow-violet-500/20'
    },
    amber: {
        container: 'bg-amber-50/80',
        gradient: 'from-amber-400/25 via-transparent to-yellow-500/25',
        ring: 'hover:border-amber-500/50 ring-amber-400/40',
        iconWrap: 'from-amber-400/60 to-yellow-500/60 ring-amber-500/50 shadow-amber-500/30',
        iconColor: 'text-amber-700',
        title: 'text-amber-800',
        value: 'text-amber-900',
        shadow: 'shadow-amber-500/20'
    },
    pink: {
        container: 'bg-pink-50/80',
        gradient: 'from-pink-400/25 via-transparent to-rose-500/25',
        ring: 'hover:border-pink-500/50 ring-pink-400/40',
        iconWrap: 'from-pink-400/60 to-rose-500/60 ring-pink-500/50 shadow-pink-500/30',
        iconColor: 'text-pink-700',
        title: 'text-pink-800',
        value: 'text-pink-900',
        shadow: 'shadow-pink-500/20'
    },
    indigo: {
        container: 'bg-indigo-50/80',
        gradient: 'from-indigo-400/25 via-transparent to-purple-500/25',
        ring: 'hover:border-indigo-500/50 ring-indigo-400/40',
        iconWrap: 'from-indigo-400/60 to-purple-500/60 ring-indigo-500/50 shadow-indigo-500/30',
        iconColor: 'text-indigo-700',
        title: 'text-indigo-800',
        value: 'text-indigo-900',
        shadow: 'shadow-indigo-500/20'
    },
    teal: {
        container: 'bg-teal-50/80',
        gradient: 'from-teal-400/25 via-transparent to-cyan-500/25',
        ring: 'hover:border-teal-500/50 ring-teal-400/40',
        iconWrap: 'from-teal-400/60 to-cyan-500/60 ring-teal-500/50 shadow-teal-500/30',
        iconColor: 'text-teal-700',
        title: 'text-teal-800',
        value: 'text-teal-900',
        shadow: 'shadow-teal-500/20'
    },
    orange: {
        container: 'bg-orange-50/80',
        gradient: 'from-orange-400/25 via-transparent to-orange-500/30',
        ring: 'hover:border-orange-500/50 ring-orange-400/40',
        iconWrap: 'from-orange-400/60 to-orange-500/60 ring-orange-500/50 shadow-orange-500/30',
        iconColor: 'text-orange-700',
        title: 'text-orange-800',
        value: 'text-orange-900',
        shadow: 'shadow-orange-500/20'
    },
    red: {
        container: 'bg-red-50/80',
        gradient: 'from-red-400/25 via-transparent to-rose-500/25',
        ring: 'hover:border-red-500/50 ring-red-400/40',
        iconWrap: 'from-red-400/60 to-rose-500/60 ring-red-500/50 shadow-red-500/30',
        iconColor: 'text-red-700',
        title: 'text-red-800',
        value: 'text-red-900',
        shadow: 'shadow-red-500/20'
    },
    sky: {
        container: 'bg-sky-50/80',
        gradient: 'from-sky-400/25 via-transparent to-blue-400/25',
        ring: 'hover:border-sky-500/50 ring-sky-400/40',
        iconWrap: 'from-sky-400/60 to-blue-500/60 ring-sky-500/50 shadow-sky-500/30',
        iconColor: 'text-sky-700',
        title: 'text-sky-800',
        value: 'text-sky-900',
        shadow: 'shadow-sky-500/20'
    },
    gray: {
        container: 'bg-gray-50/80',
        gradient: 'from-gray-400/20 via-transparent to-slate-500/25',
        ring: 'hover:border-gray-500/50 ring-gray-400/40',
        iconWrap: 'from-gray-400/60 to-slate-500/60 ring-gray-500/50 shadow-gray-500/20',
        iconColor: 'text-gray-700',
        title: 'text-gray-800',
        value: 'text-gray-900',
        shadow: 'shadow-gray-400/20'
    }
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
    changeType = 'neutral'
}) => {
    const p = paletteMap[palette];
    const sizeClasses = size === 'sm' ? {
        padding: 'p-4 sm:p-5',
        title: 'text-[11px] sm:text-xs',
        value: 'text-xl sm:text-2xl',
        iconWrap: 'w-9 h-9 sm:w-11 sm:h-11',
        icon: 22
    } : {
        padding: 'p-6',
        title: 'text-sm',
        value: 'text-3xl',
        iconWrap: 'w-12 h-12',
        icon: 26
    };

    const getChangeColor = () => {
        if (changeType === 'increase') return 'text-green-600 bg-green-50';
        if (changeType === 'decrease') return 'text-red-600 bg-red-50';
        return 'text-gray-600 bg-gray-50';
    };

    const getChangeIcon = () => {
        if (changeType === 'increase') return TrendingUp;
        if (changeType === 'decrease') return TrendingDown;
        return null;
    };

    const ChangeIcon = getChangeIcon();

    return (
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ${p.shadow} border border-gray-900/20 ring-1 ring-inset ${p.ring} bg-gradient-to-br ${p.container} backdrop-blur-sm group transition-all duration-300 ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-tr ${p.gradient} opacity-60 group-hover:opacity-90 transition`} />
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative ${sizeClasses.padding}`}>
                <div className="flex-1">
                    <p className={`${sizeClasses.title} font-medium ${p.title} tracking-wide ${uppercaseTitle ? 'uppercase' : ''}`}>{title}</p>
                    <div className="flex items-end gap-2">
                        <p className={`${sizeClasses.value} font-bold tracking-tight ${p.value}`}>{value}{valueSuffix}</p>
                        {change !== undefined && change !== 0 && (
                            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${getChangeColor()} mb-1.5`}>
                                {ChangeIcon && <ChangeIcon size={12} />}
                                {change > 0 ? '+' : ''}{change}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className={`text-[10px] sm:text-xs mt-1 font-medium ${descriptionClassName || 'text-slate-600/80'}`}>{description}</p>
                    )}
                </div>
                <div className="relative group/icon">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${p.iconWrap} blur-lg opacity-70 group-hover:opacity-90 transition`} />
                    <div className={`relative ${sizeClasses.iconWrap} rounded-xl bg-white/30 backdrop-blur-md flex items-center justify-center ring-1 ${p.iconWrap.split(' ')[2]} shadow-md`}> {/* reuse ring color */}
                        <Icon className={`${p.iconColor} group-hover:scale-110 transition-transform`} size={sizeClasses.icon} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
