'use client';

import React from 'react';
import { useStudio } from '@/lib/store';
import { STAGE_PRESETS } from '@/lib/constants/presets';
import { Sparkles, Check, Layers, ChevronRight } from 'lucide-react';

export default function TabPresets() {
  const { project, loadPreset } = useStudio();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-red-500" />
          Kho Mẫu Sân Khấu Tiêu Chuẩn
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Chọn mẫu sân khấu được HACOLED tối ưu sẵn kết cấu, kích thước màn hình LED và hệ thống kỹ thuật.
        </p>
      </div>

      <div className="space-y-2.5">
        {STAGE_PRESETS.map((preset) => {
          const isCurrent = project.id === preset.state.id;
          return (
            <div
              key={preset.id}
              onClick={() => loadPreset(preset.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                isCurrent
                  ? 'bg-red-950/30 border-red-500/80 shadow-md shadow-red-900/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {preset.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{preset.description}</p>
                </div>
                {isCurrent && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Sân khấu: <b className="text-slate-200">{preset.state.stage.width}x{preset.state.stage.depth}m</b>
                </span>
                <span>
                  LED: <b className="text-red-400">{preset.state.ledScreens.length} Màn</b>
                </span>
                <span className="flex items-center text-red-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Áp dụng <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
