'use client';
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer, 
  PolarRadiusAxis 
} from 'recharts';
import { Skill } from '../types';

interface HomeRadarChartProps {
  skills: Skill[];
}

export default function HomeRadarChart({ skills }: HomeRadarChartProps) {
  // Ambil 6 skill utama agar grafik radar terlihat simetris dan bersih
  const data = skills.slice(0, 6).map(skill => ({
    subject: skill.name,
    A: skill.level,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid 
            stroke="currentColor" 
            className="text-slate-200 dark:text-slate-800" 
            gridType="polygon"
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 800 }}
            className="text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono"
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.5}
            animationBegin={0}
            animationDuration={2000}
            className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Decorative Scanning Ring */}
      <div className="absolute inset-0 border-[1px] border-indigo-500/20 rounded-full animate-spin-slow pointer-events-none"></div>
      <div className="absolute inset-4 border-[1px] border-indigo-500/10 rounded-full animate-reverse-spin-slow pointer-events-none"></div>
    </div>
  );
}
