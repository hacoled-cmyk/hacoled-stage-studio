'use client';

import React from 'react';
import { useStudio } from '@/lib/store';
import { Layers, Eye, EyeOff, Box, Tv, SunMedium, Volume2, Users, Grid, Sparkles } from 'lucide-react';

export default function TabLayers() {
  const { project, toggleLayer, selectedObject, setSelectedObject } = useStudio();
  const { layersVisibility, ledScreens, stage, truss } = project;

  const layerItems: { key: keyof typeof layersVisibility; label: string; icon: React.ReactNode }[] = [
    { key: 'stage', label: 'Sàn Sân Khấu & Bậc Thang', icon: <Box className="w-3.5 h-3.5 text-blue-400" /> },
    { key: 'truss', label: 'Hệ Giàn Khung Nhôm Truss', icon: <Layers className="w-3.5 h-3.5 text-slate-300" /> },
    { key: 'led', label: 'Màn Hình LED & Visual', icon: <Tv className="w-3.5 h-3.5 text-red-400" /> },
    { key: 'lighting', label: 'Đèn Chiếu & Chùm Tia Beam', icon: <SunMedium className="w-3.5 h-3.5 text-yellow-400" /> },
    { key: 'audio', label: 'Loa Line Array & Subwoofer', icon: <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { key: 'props', label: 'Đạo Cụ & Bục Phát Biểu', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'audience', label: 'Khán Phòng & Bàn Ghế', icon: <Users className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: 'grid', label: 'Lưới Thước Đo Tọa Độ Mét', icon: <Grid className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  return (
    <div className="space-y-5 text-xs">
      {/* 1. Bật tắt lớp hiển thị */}
      <div>
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs mb-1">
          <Layers className="w-3.5 h-3.5 text-red-500" />
          Lớp Hiển Thị Không Gian (Visibility Layers)
        </h4>
        <p className="text-slate-400 text-[11px] mb-3">
          Ẩn hoặc hiện từng thành phần để tập trung căn chỉnh và xuất bản vẽ.
        </p>

        <div className="space-y-1.5">
          {layerItems.map((item) => {
            const isVisible = layersVisibility[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleLayer(item.key)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isVisible
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className={`font-medium ${isVisible ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                    {item.label}
                  </span>
                </div>
                <button className="p-1 rounded text-slate-400 hover:text-white">
                  {isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-600" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* 2. Cây danh sách vật thể trong cảnh 3D (Scene Outliner) */}
      <div>
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs mb-1">
          <Box className="w-3.5 h-3.5 text-red-500" />
          Danh Sách Vật Thể 3D Trong Cảnh (Outliner)
        </h4>
        <p className="text-slate-400 text-[11px] mb-3">
          Click vào vật thể để gắn Gizmo căn chỉnh tọa độ chính xác.
        </p>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {/* Sân khấu */}
          <div
            onClick={() =>
              setSelectedObject({
                type: 'stage',
                id: 'stage_main',
                name: 'Sàn Sân Khấu',
                position: { x: 0, y: stage.height / 2, z: 0 },
              })
            }
            className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
              selectedObject?.id === 'stage_main'
                ? 'bg-red-950/50 border-red-500 text-white font-semibold'
                : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>Sàn Sân Khấu ({stage.width}x{stage.depth}m)</span>
            <span className="font-mono text-[10px] text-slate-400">X:0, Y:0, Z:0</span>
          </div>

          {/* Màn hình LED */}
          {ledScreens.map((scr) => (
            <div
              key={scr.id}
              onClick={() =>
                setSelectedObject({
                  type: 'screen',
                  id: scr.id,
                  name: scr.name,
                  position: scr.position,
                  rotation: scr.rotation,
                })
              }
              className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                selectedObject?.id === scr.id
                  ? 'bg-red-950/50 border-red-500 text-white font-semibold'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>{scr.name} ({scr.width}x{scr.height}m)</span>
              <span className="font-mono text-[10px] text-red-400">
                X:{scr.position.x}, Z:{scr.position.z}
              </span>
            </div>
          ))}

          {/* Bục phát biểu */}
          <div
            onClick={() =>
              setSelectedObject({
                type: 'stage',
                id: 'prop_podium',
                name: 'Bục Phát Biểu',
                position: { x: 0, y: stage.height + 0.6, z: stage.depth / 3 },
              })
            }
            className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
              selectedObject?.id === 'prop_podium'
                ? 'bg-red-950/50 border-red-500 text-white font-semibold'
                : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>Bục Phát Biểu HACOLED</span>
            <span className="font-mono text-[10px] text-slate-400">Tâm sân khấu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
