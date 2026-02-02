'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Skill } from '../types';

interface AboutChartProps {
  skills: Skill[];
}

export default function AboutChart({ skills }: AboutChartProps) {
  const chartData = skills.map(s => ({ name: s.name, level: s.level }));
  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

  return (
    <div className="h-[500px] w-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={140} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontWeight: 700, fontSize: 14, fill: 'currentColor' }} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '16px' }}
          />
          <Bar dataKey="level" radius={[0, 12, 12, 0]} barSize={40}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}