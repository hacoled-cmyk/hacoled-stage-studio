'use client';

import React, { useState } from 'react';
import { useStudio } from '@/lib/store';
import { HACOLED_CATALOG, VISUAL_PRESETS } from '@/lib/constants/ledCatalog';
import { PitchType, ScreenRole } from '@/lib/types';
import { Tv, Plus, Trash2, Sliders, Eye, Sparkles, Activity, Layers } from 'lucide-react';

export default function TabLedScreen() {
  const { project, addLedScreen, updateLedScreen, removeLedScreen, selectedObject, setSelectedObject } = useStudio();
  const [selectedScreenId, setSelectedScreenId] = useState<string>(
    selectedObject?.id || project.ledScreens[0]?.id || ''
  );

  const activeScreen = project.ledScreens.find((s) => s.id === selectedScreenId) || project.ledScreens[0];

  const handleSelectScreen = (id: string) => {
    setSelectedScreenId(id);
    const scr = project.ledScreens.find((s) => s.id === id);
    if (scr) {
      setSelectedObject({
        type: 'screen',
        id: scr.id,
        name: scr.name,
        position: scr.position,
        rotation: scr.rotation,
      });
    }
  };

  if (!activeScreen) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-slate-400">Chưa có màn hình LED nào trong cảnh.</p>
        <button
          onClick={() => addLedScreen('main')}
          className="mt-3 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg"
        >
          Thêm Màn Chính
        </button>
      </div>
    );
  }

  const moduleCat = HACOLED_CATALOG[activeScreen.pitch] || HACOLED_CATALOG['P2.5'];
  const area = (activeScreen.width * activeScreen.height).toFixed(2);
  const mw = moduleCat.moduleWidthMm / 1000;
  const mh = moduleCat.moduleHeightMm / 1000;
  const modX = Math.ceil(activeScreen.width / mw);
  const modY = Math.ceil(activeScreen.height / mh);
  const totalModules = modX * modY;
  const resX = modX * moduleCat.pixelWidth;
  const resY = modY * moduleCat.pixelHeight;
  const peakPowerKw = ((activeScreen.width * activeScreen.height * moduleCat.maxPowerWPerSqm) / 1000).toFixed(1);

  return (
    <div className="space-y-4 text-xs">
      {/* Header & Screen Tabs */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
          <Tv className="w-3.5 h-3.5 text-red-500" />
          Hệ Thống Màn Hình LED ({project.ledScreens.length})
        </h4>
        <button
          onClick={() => addLedScreen('wing_left')}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800/60 rounded-lg text-xs font-semibold transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm Màn LED
        </button>
      </div>

      {/* Screen Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {project.ledScreens.map((scr) => (
          <button
            key={scr.id}
            onClick={() => handleSelectScreen(scr.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              activeScreen.id === scr.id
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/25'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {scr.name}
          </button>
        ))}
      </div>

      {/* Active Screen Configuration Card */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <input
            type="text"
            value={activeScreen.name}
            onChange={(e) => updateLedScreen(activeScreen.id, { name: e.target.value })}
            className="bg-transparent font-bold text-white text-xs focus:outline-none border-b border-transparent focus:border-red-500 pb-0.5"
          />
          {project.ledScreens.length > 1 && (
            <button
              onClick={() => removeLedScreen(activeScreen.id)}
              className="text-slate-500 hover:text-red-400 p-1 rounded"
              title="Xóa màn hình này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pitch & Catalog selection */}
        <div>
          <label className="text-slate-400 block mb-1">Dòng sản phẩm LED HACOLED:</label>
          <select
            value={activeScreen.pitch}
            onChange={(e) => updateLedScreen(activeScreen.id, { pitch: e.target.value as PitchType })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs font-medium focus:border-red-500"
          >
            {Object.entries(HACOLED_CATALOG).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.name} ({cat.pixelWidth}x{cat.pixelHeight}px/mod)
              </option>
            ))}
          </select>
        </div>

        {/* Real-time Technical Specs Badge */}
        <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px]">
          <div>
            <span className="text-slate-400 block">Diện tích:</span>
            <span className="font-bold text-white font-mono">{area} m²</span>
          </div>
          <div>
            <span className="text-slate-400 block">Độ phân giải:</span>
            <span className="font-bold text-red-400 font-mono">
              {resX} × {resY}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Công suất đỉnh:</span>
            <span className="font-bold text-yellow-400 font-mono">{peakPowerKw} kW</span>
          </div>
        </div>

        {/* Width & Height Sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Chiều rộng:</span>
              <span className="font-bold text-white font-mono">{activeScreen.width} m</span>
            </div>
            <input
              type="range"
              min={1.5}
              max={24}
              step={0.5}
              value={activeScreen.width}
              onChange={(e) => updateLedScreen(activeScreen.id, { width: parseFloat(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Chiều cao:</span>
              <span className="font-bold text-white font-mono">{activeScreen.height} m</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={10}
              step={0.5}
              value={activeScreen.height}
              onChange={(e) => updateLedScreen(activeScreen.id, { height: parseFloat(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Elevation & Curved Screen */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Nâng khỏi sàn (Y):</span>
              <span className="font-bold text-white font-mono">{activeScreen.elevation} m</span>
            </div>
            <input
              type="range"
              min={0}
              max={3.0}
              step={0.1}
              value={activeScreen.elevation}
              onChange={(e) => updateLedScreen(activeScreen.id, { elevation: parseFloat(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span>Màn hình cong:</span>
              <input
                type="checkbox"
                checked={activeScreen.curved}
                onChange={(e) => updateLedScreen(activeScreen.id, { curved: e.target.checked, curveRadius: e.target.checked ? 16 : 0 })}
                className="accent-red-600 rounded"
              />
            </div>
            {activeScreen.curved ? (
              <input
                type="range"
                min={6}
                max={30}
                step={1}
                value={activeScreen.curveRadius}
                onChange={(e) => updateLedScreen(activeScreen.id, { curveRadius: parseFloat(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            ) : (
              <div className="text-[11px] text-slate-500 pt-1">Màn LED phẳng tiêu chuẩn</div>
            )}
          </div>
        </div>

        {/* Visual Preset & Test Patterns */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="text-slate-400 block font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Visual Trình Diễn Trên Màn LED:
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {VISUAL_PRESETS.map((vp) => (
              <button
                key={vp.id}
                onClick={() => updateLedScreen(activeScreen.id, { visualPreset: vp.id })}
                className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between ${
                  activeScreen.visualPreset === vp.id
                    ? 'bg-red-950/40 border-red-500/80 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-white">{vp.name}</div>
                  <div className="text-[10px] text-slate-400">{vp.description}</div>
                </div>
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0 ml-2"
                  style={{ background: vp.primaryColor }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Brightness */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-slate-300">
            <span>Độ sáng màn hình:</span>
            <span className="font-bold text-white font-mono">{activeScreen.brightness} %</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={5}
            value={activeScreen.brightness}
            onChange={(e) => updateLedScreen(activeScreen.id, { brightness: parseInt(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
