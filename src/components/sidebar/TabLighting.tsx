'use client';

import React from 'react';
import { useStudio } from '@/lib/store';
import { LightingLook } from '@/lib/types';
import { SunMedium, Flame, Sparkles, Sliders, Palette } from 'lucide-react';

const LOOKS_PRESETS: { id: LightingLook; name: string; desc: string; color: string }[] = [
  { id: 'gala_gold', name: 'Gala Hoàng Gia Vàng Ấm', desc: 'Tone vàng hổ phách sang trọng, đẳng cấp', color: '#F59E0B' },
  { id: 'bright_conference', name: 'Hội Nghị Sáng Rõ', desc: 'Ánh sáng trắng tự nhiên đánh mặt đại biểu', color: '#38BDF8' },
  { id: 'cyber_rock', name: 'Cyber Rock Rực Lửa', desc: 'Cam đỏ rực cháy, chùm tia quét tốc độ cao', color: '#EA580C' },
  { id: 'romantic_purple', name: 'Lãng Mạn Tím Hồng', desc: 'Tone tím violet nghệ thuật cho dạ tiệc', color: '#C084FC' },
  { id: 'corporate_blue', name: 'Doanh Nghiệp Xanh Navy', desc: 'Tone xanh dương hiện đại công nghệ', color: '#2563EB' },
];

export default function TabLighting() {
  const { project, updateLighting } = useStudio();
  const { lighting } = project;

  return (
    <div className="space-y-4 text-xs">
      <div>
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
          <SunMedium className="w-3.5 h-3.5 text-red-500" />
          Look & Mood Ánh Sáng Sân Khấu
        </h4>
        <p className="text-slate-400 mt-1">
          Lựa chọn không gian ánh sáng phù hợp với phong cách và tính chất sự kiện.
        </p>
      </div>

      {/* Mood Selector Buttons */}
      <div className="space-y-1.5">
        {LOOKS_PRESETS.map((look) => {
          const isActive = lighting.look === look.id;
          return (
            <button
              key={look.id}
              onClick={() => updateLighting({ look: look.id, beamColor: look.color })}
              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-red-950/40 border-red-500 text-white shadow-md shadow-red-900/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-white">{look.name}</div>
                <div className="text-[10px] text-slate-400">{look.desc}</div>
              </div>
              <div
                className="w-4 h-4 rounded-full border border-white/30 shrink-0 ml-2"
                style={{ background: look.color }}
              />
            </button>
          );
        })}
      </div>

      <div className="h-px bg-slate-800" />

      {/* Intensity Sliders */}
      <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Sliders className="w-3 h-3 text-red-400" /> Cường Độ Ánh Sáng
        </h5>

        {/* Beam Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Cường độ chùm tia Beam:</span>
            <span className="font-bold text-white font-mono">{Math.round(lighting.beamIntensity * 100)} %</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={lighting.beamIntensity}
            onChange={(e) => updateLighting({ beamIntensity: parseFloat(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Spot Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Đèn rọi tâm sân khấu (Key Spot):</span>
            <span className="font-bold text-white font-mono">{Math.round(lighting.spotIntensity * 100)} %</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={lighting.spotIntensity}
            onChange={(e) => updateLighting({ spotIntensity: parseFloat(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Ambient / Wash Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Ánh sáng tràn môi trường:</span>
            <span className="font-bold text-white font-mono">{Math.round(lighting.ambientIntensity * 100)} %</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={lighting.ambientIntensity}
            onChange={(e) => updateLighting({ ambientIntensity: parseFloat(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>

      {/* Fixtures Inventory */}
      <div className="space-y-2.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <h5 className="font-semibold text-slate-200">Số Lượng Thiết Bị Đèn</h5>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Beam Moving Head:</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-white font-mono">{lighting.fixturesCount.beamMovingHead} cây</span>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    updateLighting({
                      fixturesCount: {
                        ...lighting.fixturesCount,
                        beamMovingHead: Math.max(4, lighting.fixturesCount.beamMovingHead - 2),
                      },
                    })
                  }
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    updateLighting({
                      fixturesCount: {
                        ...lighting.fixturesCount,
                        beamMovingHead: Math.min(48, lighting.fixturesCount.beamMovingHead + 2),
                      },
                    })
                  }
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Par LED 54 Wash:</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-white font-mono">{lighting.fixturesCount.parLedWash} cây</span>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    updateLighting({
                      fixturesCount: {
                        ...lighting.fixturesCount,
                        parLedWash: Math.max(8, lighting.fixturesCount.parLedWash - 4),
                      },
                    })
                  }
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    updateLighting({
                      fixturesCount: {
                        ...lighting.fixturesCount,
                        parLedWash: Math.min(64, lighting.fixturesCount.parLedWash + 4),
                      },
                    })
                  }
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
