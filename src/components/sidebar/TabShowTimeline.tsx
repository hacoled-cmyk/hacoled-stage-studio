'use client';

import React from 'react';
import { useStudio } from '@/lib/store';
import { ShowAct } from '@/lib/types';
import { Play, Plus, Clock, Activity, Trash2 } from 'lucide-react';

export default function TabShowTimeline() {
  const { project, updateProject } = useStudio();
  const { showActs } = project;

  const totalMinutes = showActs.reduce((acc, act) => acc + act.durationMin, 0);

  const handleAddAct = () => {
    const newAct: ShowAct = {
      id: 'act_' + Date.now(),
      title: 'Tiết mục mới',
      durationMin: 15,
      energyLevel: 6,
      lightingMood: 'bright_conference',
      note: 'Chuẩn bị micro và visual',
    };
    updateProject((prev) => ({
      ...prev,
      showActs: [...prev.showActs, newAct],
    }));
  };

  const handleUpdateAct = (id: string, updates: Partial<ShowAct>) => {
    updateProject((prev) => ({
      ...prev,
      showActs: prev.showActs.map((act) => (act.id === id ? { ...act, ...updates } : act)),
    }));
  };

  const handleRemoveAct = (id: string) => {
    updateProject((prev) => ({
      ...prev,
      showActs: prev.showActs.filter((act) => act.id !== id),
    }));
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            Kịch Bản Tiết Mục Sự Kiện ({showActs.length})
          </h4>
          <span className="text-[11px] text-slate-400">
            Tổng thời lượng: <b className="text-white font-mono">{totalMinutes} phút</b> ({Math.floor(totalMinutes / 60)}h {totalMinutes % 60}p)
          </span>
        </div>
        <button
          onClick={handleAddAct}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800/60 rounded-lg text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm tiết mục
        </button>
      </div>

      {/* Biểu đồ năng lượng tiết mục theo thời gian (Energy Flow Curve) */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Activity className="w-3 h-3 text-red-400" /> Biểu Đồ Năng Lượng Show
          </span>
          <span className="text-slate-500 font-mono">Thang điểm 1 - 10</span>
        </div>
        <div className="h-16 w-full flex items-end gap-1.5 pt-2">
          {showActs.map((act, idx) => {
            const hPercent = (act.energyLevel / 10) * 100;
            return (
              <div key={act.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${hPercent}%`,
                    backgroundColor:
                      act.energyLevel >= 8
                        ? '#DC2626'
                        : act.energyLevel >= 5
                        ? '#F59E0B'
                        : '#38BDF8',
                  }}
                />
                <span className="text-[9px] text-slate-400 truncate max-w-[40px] font-mono">
                  {act.durationMin}p
                </span>
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[9px] px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-20">
                  {act.title}: Level {act.energyLevel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danh sách tiết mục */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {showActs.map((act, index) => (
          <div key={act.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <input
                type="text"
                value={act.title}
                onChange={(e) => handleUpdateAct(act.id, { title: e.target.value })}
                className="flex-1 bg-transparent text-white font-semibold text-xs focus:outline-none border-b border-transparent focus:border-red-500"
              />
              <button
                onClick={() => handleRemoveAct(act.id)}
                className="text-slate-500 hover:text-red-400 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="text-slate-400 block mb-1">Thời lượng (phút):</label>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={act.durationMin}
                  onChange={(e) => handleUpdateAct(act.id, { durationMin: parseInt(e.target.value) || 5 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Năng lượng (1-10):</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={act.energyLevel}
                  onChange={(e) => handleUpdateAct(act.id, { energyLevel: parseInt(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Ghi chú kỹ thuật ánh sáng / visual..."
              value={act.note}
              onChange={(e) => handleUpdateAct(act.id, { note: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded px-2 py-1 text-[11px] text-slate-400 focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
