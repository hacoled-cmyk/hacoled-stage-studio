'use client';

import React, { useRef } from 'react';
import { useStudio } from '@/lib/store';
import {
  Undo2,
  Redo2,
  AlertTriangle,
  Zap,
  DollarSign,
  Maximize2,
  FolderOpen,
  Save,
  PlusCircle,
  Tv,
  CheckCircle2,
} from 'lucide-react';

export default function TopHeader() {
  const {
    project,
    updateProject,
    canUndo,
    canRedo,
    undo,
    redo,
    bom,
    resetProject,
    exportProjectFile,
    importProjectFile,
    saveProjectToLocal,
    setActiveTab,
  } = useStudio();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importProjectFile(file);
      if (ok) {
        alert('Tải dự án thành công!');
      } else {
        alert('Định dạng tệp dự án không hợp lệ.');
      }
      e.target.value = '';
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-4">
        {/* Logo HACOLED */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <span className="text-white font-black text-lg tracking-tighter">H</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wide text-white">HACOLED</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60">
                Studio
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-0.5 font-medium">Stage & LED 3D Designer</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Project Name Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={project.name}
            onChange={(e) => updateProject((prev) => ({ ...prev, name: e.target.value }))}
            className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none transition-all w-52 md:w-64"
            placeholder="Tên chương trình / dự án..."
          />
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Hoàn tác (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-400 hover:text-white disabled:text-slate-600 disabled:hover:bg-transparent hover:bg-slate-800 transition-all"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Làm lại (Ctrl+Y)"
            className="p-1.5 rounded-md text-slate-400 hover:text-white disabled:text-slate-600 disabled:hover:bg-transparent hover:bg-slate-800 transition-all"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Status Chips */}
      <div className="hidden lg:flex items-center gap-2.5">
        {/* Warnings */}
        <button
          onClick={() => setActiveTab('bom')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            bom.warnings.length > 0
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300 hover:bg-amber-900/50'
              : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-400'
          }`}
        >
          {bom.warnings.length > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{bom.warnings.length} Cảnh báo</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chuẩn an toàn</span>
            </>
          )}
        </button>

        {/* Total LED Area */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <Tv className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-400">LED:</span>
          <span className="font-bold text-white">{bom.totalLedArea} m²</span>
        </div>

        {/* Power */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-slate-400">Điện:</span>
          <span className="font-bold text-white">{bom.grandTotalPowerKw} kW</span>
        </div>

        {/* Estimate */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-900/60 text-xs">
          <DollarSign className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-400">Dự toán:</span>
          <span className="font-bold text-red-300">
            {bom.estimatedCostVnd >= 1000000
              ? `${(bom.estimatedCostVnd / 1000000).toFixed(1)} tr`
              : `${bom.estimatedCostVnd.toLocaleString('vi-VN')} đ`}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Tạo mới */}
        <button
          onClick={resetProject}
          title="Tạo dự án mới"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dự án mới</span>
        </button>

        {/* Mở file */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Mở file dự án từ máy tính"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mở</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,.hls"
          className="hidden"
        />

        {/* Lưu file */}
        <button
          onClick={exportProjectFile}
          title="Tải tệp dự án .json về máy tính"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-red-600/20 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Lưu dự án</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullScreen}
          title="Toàn màn hình"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
