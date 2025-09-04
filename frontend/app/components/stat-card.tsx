import React from 'react';
import { LucideIcon } from 'lucide-react';

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
};

// Central palette map so variants stay consistent across pages
const paletteMap: Record<string, {
    container: string; // base bg (outer card)
    gradient: string;  // overlay gradient (absolute layer)
    ring: string;      // ring + hover border classes
    iconWrap: string;  // gradient for icon blur layer + ring color token reuse
    iconColor: string;
    title: string;
    value: string;
    shadow: string;    // color-accented shadow
}> = {
    blue: {
        container: 'bg-blue-50/70',
        gradient: 'from-blue-400/20 via-transparent to-sky-500/20',
        ring: 'hover:border-blue-500/40 ring-blue-400/30',
        iconWrap: 'from-blue-400/50 to-sky-500/50 ring-blue-400/40 shadow-blue-500/30',
        iconColor: 'text-blue-700',
        title: 'text-blue-700/80',
        value: 'text-blue-900',
        shadow: 'shadow-blue-500/10'
    },
    emerald: {
        container: 'bg-emerald-50/70',
        gradient: 'from-emerald-400/20 via-transparent to-green-500/20',
        ring: 'hover:border-emerald-500/40 ring-emerald-400/30',
        iconWrap: 'from-emerald-400/50 to-green-500/50 ring-emerald-500/40 shadow-emerald-500/30',
        iconColor: 'text-emerald-600',
        title: 'text-emerald-700/80',
        value: 'text-emerald-700',
        shadow: 'shadow-emerald-500/10'
    },
    amber: {
        container: 'bg-amber-50/70',
        gradient: 'from-amber-400/20 via-transparent to-yellow-500/20',
        ring: 'hover:border-amber-500/40 ring-amber-400/30',
        iconWrap: 'from-amber-400/50 to-yellow-500/50 ring-amber-500/40 shadow-amber-500/30',
        iconColor: 'text-amber-600',
        title: 'text-amber-700/80',
        value: 'text-amber-700',
        shadow: 'shadow-amber-500/10'
    },
    orange: {
        container: 'from-orange-50/90 to-orange-100/80',
        gradient: 'from-orange-400/20 via-transparent to-orange-600/20',
        ring: 'hover:border-orange-500/40 ring-orange-400/30',
        iconWrap: 'from-orange-400/50 to-orange-500/50 ring-orange-500/40 shadow-orange-500/30',
        iconColor: 'text-orange-600',
        title: 'text-orange-700/80',
        value: 'text-orange-700',
        shadow: 'shadow-orange-500/10'
    },
    violet: {
        container: 'bg-violet-50/70',
        gradient: 'from-violet-500/5 via-transparent to-fuchsia-500/15',
        ring: 'border-violet-400/80 ring-violet-500/40',
        iconWrap: 'from-violet-400/50 to-fuchsia-500/50 ring-violet-500/30',
        iconColor: 'text-violet-600',
        title: 'text-violet-700',
        value: 'text-violet-700',
        shadow: 'shadow-violet-500/10'
    },
    red: {
        container: 'bg-red-50/70',
        gradient: 'from-red-500/5 via-transparent to-rose-500/15',
        ring: 'border-red-400/80 ring-red-500/40',
        iconWrap: 'from-red-400/50 to-rose-500/50 ring-red-500/30',
        iconColor: 'text-red-600',
        title: 'text-red-700',
        value: 'text-red-700',
        shadow: 'shadow-red-500/10'
    },
    yellow: {
        container: 'bg-yellow-50/70',
        gradient: 'from-amber-500/5 via-transparent to-yellow-500/15',
        ring: 'border-amber-400/80 ring-amber-500/40',
        iconWrap: 'from-amber-400/50 to-yellow-500/50 ring-amber-500/30',
        iconColor: 'text-amber-600',
        title: 'text-amber-700',
        value: 'text-amber-700',
        shadow: 'shadow-amber-500/10'
    },
    indigo: {
        container: 'bg-indigo-50/70',
        gradient: 'from-indigo-500/5 via-transparent to-purple-600/15',
        ring: 'border-indigo-400/80 ring-indigo-500/40',
        iconWrap: 'from-indigo-400/50 to-purple-500/50 ring-indigo-500/30',
        iconColor: 'text-indigo-600',
        title: 'text-indigo-700',
        value: 'text-indigo-600',
        shadow: 'shadow-indigo-500/10'
    },
    sky: {
        container: 'from-sky-50/90 to-sky-100/80',
        gradient: 'from-sky-400/20 via-transparent to-sky-500/20',
        ring: 'hover:border-sky-500/40 ring-sky-400/30',
        iconWrap: 'from-sky-400/50 to-sky-500/50 ring-sky-500/40 shadow-sky-500/30',
        iconColor: 'text-sky-600',
        title: 'text-sky-700/80',
        value: 'text-sky-900',
        shadow: 'shadow-sky-500/10'
    },
    teal: {
        container: 'from-teal-50/90 to-teal-100/80',
        gradient: 'from-teal-400/20 via-transparent to-teal-600/20',
        ring: 'hover:border-teal-500/40 ring-teal-400/30',
        iconWrap: 'from-teal-400/50 to-teal-600/50 ring-teal-500/40 shadow-teal-500/30',
        iconColor: 'text-teal-600',
        title: 'text-teal-700/80',
        value: 'text-teal-900',
        shadow: 'shadow-teal-500/10'
    },
    pink: {
        container: 'from-pink-50/90 to-pink-100/80',
        gradient: 'from-pink-400/20 via-transparent to-pink-600/20',
        ring: 'hover:border-pink-500/40 ring-pink-400/30',
        iconWrap: 'from-pink-400/50 to-pink-600/50 ring-pink-500/40 shadow-pink-500/30',
        iconColor: 'text-pink-600',
        title: 'text-pink-700/80',
        value: 'text-pink-900',
        shadow: 'shadow-pink-500/10'
    },
    gray: {
        container: 'from-gray-50/90 to-slate-100/80',
        gradient: 'from-gray-400/20 via-transparent to-slate-500/20',
        ring: 'hover:border-gray-500/40 ring-gray-400/30',
        iconWrap: 'from-gray-400/50 to-slate-500/50 ring-gray-500/40 shadow-gray-500/30',
        iconColor: 'text-gray-600',
        title: 'text-gray-700/80',
        value: 'text-gray-900',
        shadow: 'shadow-gray-500/10'
    }
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, palette, className = '', size = 'md', uppercaseTitle = false, valueSuffix, description, descriptionClassName }) => {
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

    return (
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ${p.shadow} border border-gray-900/20 ring-1 ring-inset ${p.ring} bg-gradient-to-br ${p.container} backdrop-blur-sm group transition-all duration-300 ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-tr ${p.gradient} opacity-60 group-hover:opacity-90 transition`} />
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative ${sizeClasses.padding}`}>
                <div>
                    <p className={`${sizeClasses.title} font-medium ${p.title} tracking-wide ${uppercaseTitle ? 'uppercase' : ''}`}>{title}</p>
                    <p className={`${sizeClasses.value} font-bold tracking-tight ${p.value}`}>{value}{valueSuffix}</p>
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
