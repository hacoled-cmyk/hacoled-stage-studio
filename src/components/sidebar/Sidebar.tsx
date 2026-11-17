'use client';

import React from 'react';
import { useStudio, TabType } from '@/lib/store';
import TabPresets from './TabPresets';
import TabStructure from './TabStructure';
import TabLayers from './TabLayers';
import TabLedScreen from './TabLedScreen';
import TabLighting from './TabLighting';
import TabShowTimeline from './TabShowTimeline';
import TabBOM from './TabBOM';
import { Sparkles, Box, Layers, Tv, SunMedium, Clock, DollarSign } from 'lucide-react';

interface TabItem {
  id: TabType;
  num: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabItem[] = [
  { id: 'lib', num: '01', label: 'Kho mẫu', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'struct', num: '02', label: 'Kết cấu', icon: <Box className="w-4 h-4" /> },
  { id: 'layer', num: '03', label: 'Layer', icon: <Layers className="w-4 h-4" /> },
  { id: 'led', num: '04', label: 'Màn LED', icon: <Tv className="w-4 h-4" /> },
  { id: 'light', num: '05', label: 'Ánh sáng', icon: <SunMedium className="w-4 h-4" /> },
  { id: 'show', num: '06', label: 'Tiết mục', icon: <Clock className="w-4 h-4" /> },
  { id: 'bom', num: '07', label: 'Vật tư', icon: <DollarSign className="w-4 h-4" /> },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useStudio();

  return (
    <aside className="w-96 md:w-[410px] bg-slate-950 border-r border-slate-850 flex shrink-0 h-full overflow-hidden z-20">
      {/* Cột Icon Tabs Dọc (Left Strip) */}
      <nav className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 gap-1 shrink-0 select-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                isActive
                  ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
              )}
              <span className={`text-[9px] font-mono leading-none ${isActive ? 'text-red-200' : 'text-slate-500'}`}>
                {tab.num}
              </span>
              {tab.icon}
              <span className="text-[9px] leading-tight font-medium truncate max-w-[44px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Vùng Nội Dung Tab Chi Tiết (Active Panel Workspace) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'lib' && <TabPresets />}
          {activeTab === 'struct' && <TabStructure />}
          {activeTab === 'layer' && <TabLayers />}
          {activeTab === 'led' && <TabLedScreen />}
          {activeTab === 'light' && <TabLighting />}
          {activeTab === 'show' && <TabShowTimeline />}
          {activeTab === 'bom' && <TabBOM />}
        </div>
      </main>
    </aside>
  );
}
