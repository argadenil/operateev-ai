import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  palette: 'blue' | 'emerald' | 'amber' | 'orange' | 'violet' | 'red' | 'yellow' | 'indigo' | 'sky' | 'teal' | 'pink' | 'gray';
  className?: string;
  size?: 'sm' | 'md';
  uppercaseTitle?: boolean;
  valueSuffix?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  progress?: number; // Progress percentage (0-100) for the progress bar
};

// Full premium vibrant palette with 12+ colors
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
    gradient: "bg-[linear-gradient(to_right,_#cb2d3e,_#ef473a)]",
    iconWrap: 'bg-white/20 backdrop-blur-md',
    iconColor: 'text-white',
    title: 'text-white/95',
    value: 'text-white',
    shadow: 'shadow-red-500/40',
    changeColors: { increase: 'text-white bg-white/20 border-white/30', decrease: 'text-white bg-white/10 border-white/20', neutral: 'text-white/90 bg-white/5 border-white/10' },
    progressBar: 'bg-red-400',
    progressBg: 'bg-white/20'
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
  progress = 65 // Default progress
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

  const ChangeIcon = changeType === 'increase' ? TrendingUp : changeType === 'decrease' ? TrendingDown : null;

  return (
    <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl ${p.shadow} border border-white/10 ${p.gradient} group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
      {/* Large Decorative Circle Background */}
      <div className="absolute -right-6 -top-6 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute -right-12 top-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-white/5 rounded-full blur-xl" />
      
      {/* Content */}
      <div className={`relative ${sizeClasses.padding} flex flex-col h-full`}>
        {/* Header with Title and Change Badge */}
        <div className="flex items-start justify-between mb-2">
          <p className={`${sizeClasses.title} font-semibold tracking-wide ${p.title} ${uppercaseTitle ? 'uppercase' : ''}`}>
            {title}
          </p>
          {change !== undefined && change !== 0 && (
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${p.changeColors[changeType]} shadow-md`}>
              {change > 0 ? '+' : ''}{change}%
              {ChangeIcon && <ChangeIcon size={12} strokeWidth={3} />}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex-1 flex items-center mb-3">
          <p className={`${sizeClasses.value} font-extrabold tracking-tight ${p.value}`}>
            {value}{valueSuffix}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-auto">
          <div className={`w-full h-1.5 rounded-full ${p.progressBg} overflow-hidden`}>
            <div 
              className={`h-full ${p.progressBar} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {description && (
          <p className={`text-[10px] sm:text-xs mt-1.5 font-medium ${descriptionClassName || 'text-white/70'}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
