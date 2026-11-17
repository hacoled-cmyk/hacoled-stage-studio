'use client';

import React from 'react';
import { useStudio } from '@/lib/store';
import { Box, Sliders, Users, Layers, ShieldCheck } from 'lucide-react';

export default function TabStructure() {
  const { project, updateStage, updateTruss, updateAudience, updateProject } = useStudio();
  const { stage, truss, audience } = project;

  return (
    <div className="space-y-5 text-xs">
      {/* 1. Sàn sân khấu */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Box className="w-3.5 h-3.5 text-red-500" />
            Kích Thước Sàn Sân Khấu
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            Diện tích: {(stage.width * stage.depth).toFixed(1)} m²
          </span>
        </div>

        {/* Width */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Chiều rộng mặt tiền:</span>
            <span className="font-bold text-white font-mono">{stage.width} m</span>
          </div>
          <input
            type="range"
            min={6}
            max={26}
            step={0.5}
            value={stage.width}
            onChange={(e) => updateStage({ width: parseFloat(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Depth */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Chiều sâu sàn:</span>
            <span className="font-bold text-white font-mono">{stage.depth} m</span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            step={0.5}
            value={stage.depth}
            onChange={(e) => updateStage({ depth: parseFloat(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Height */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Độ cao bục sân khấu:</span>
            <span className="font-bold text-white font-mono">{stage.height} m</span>
          </div>
          <input
            type="range"
            min={0.3}
            max={2.0}
            step={0.1}
            value={stage.height}
            onChange={(e) => updateStage({ height: parseFloat(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Carpet Color & Stairs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-slate-400 block mb-1">Màu thảm sàn:</label>
            <select
              value={stage.carpetColor}
              onChange={(e) => updateStage({ carpetColor: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-red-500"
            >
              <option value="#1e293b">Xám Đen Hiện Đại</option>
              <option value="#09090b">Đen Tuyệt Đối</option>
              <option value="#7f1d1d">Đỏ Sự Kiện Gala</option>
              <option value="#172554">Xanh Hội Nghị</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Bậc thang lên xuống:</label>
            <select
              value={stage.hasStairs ? stage.stairsPosition : 'none'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'none') {
                  updateStage({ hasStairs: false });
                } else {
                  updateStage({ hasStairs: true, stairsPosition: val as any });
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-red-500"
            >
              <option value="both">2 Bên Cánh Gà</option>
              <option value="front">Chính Diện</option>
              <option value="none">Không Bậc Thang</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* 2. Hệ giàn khung Truss */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <Sliders className="w-3.5 h-3.5 text-red-500" />
            Giàn Khung Nhôm Truss
          </h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[11px] text-slate-400">Bật giàn:</span>
            <input
              type="checkbox"
              checked={truss.enabled}
              onChange={(e) => updateTruss({ enabled: e.target.checked })}
              className="accent-red-600 rounded"
            />
          </label>
        </div>

        {truss.enabled && (
          <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            {/* Truss Width */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Rộng giàn truss:</span>
                <span className="font-bold text-white font-mono">{truss.width} m</span>
              </div>
              <input
                type="range"
                min={8}
                max={30}
                step={0.5}
                value={truss.width}
                onChange={(e) => updateTruss({ width: parseFloat(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Truss Height */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Chiều cao treo đỉnh:</span>
                <span className="font-bold text-white font-mono">{truss.height} m</span>
              </div>
              <input
                type="range"
                min={5}
                max={12}
                step={0.5}
                value={truss.height}
                onChange={(e) => updateTruss({ height: parseFloat(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Section Size & Color */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Quy cách hộp:</label>
                <select
                  value={truss.sectionSize}
                  onChange={(e) => updateTruss({ sectionSize: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                >
                  <option value="300x300">Nhôm Hộp 300x300</option>
                  <option value="400x400">Nhôm Chịu Tải 400x400</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Màu sắc:</label>
                <select
                  value={truss.color}
                  onChange={(e) => updateTruss({ color: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                >
                  <option value="silver">Bạc Nhôm Sáng</option>
                  <option value="black">Sơn Tĩnh Điện Đen</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-800" />

      {/* 3. Khán phòng & Venue */}
      <div className="space-y-3">
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
          <Users className="w-3.5 h-3.5 text-red-500" />
          Mặt Bằng Khán Phòng (Audience Layout)
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Địa điểm:</label>
            <select
              value={project.venueType}
              onChange={(e) => updateProject((prev) => ({ ...prev, venueType: e.target.value as any }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
            >
              <option value="indoor">Trong Nhà (Indoor Ballroom)</option>
              <option value="outdoor">Ngoài Trời (Outdoor Event)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Kiểu bố trí ghế:</label>
            <select
              value={audience.mode}
              onChange={(e) => updateAudience({ mode: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
            >
              <option value="banquet">Bàn Tròn Tiệc (Banquet)</option>
              <option value="theater">Ghế Hội Trường (Theater)</option>
              <option value="standing">Khán Giả Đứng (Standing)</option>
              <option value="none">Không Bố Trí</option>
            </select>
          </div>
        </div>

        {audience.mode !== 'none' && (
          <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Số lượng khách dự kiến:</span>
                <span className="font-bold text-white font-mono">{audience.guestCount} Khách</span>
              </div>
              <input
                type="range"
                min={50}
                max={3000}
                step={50}
                value={audience.guestCount}
                onChange={(e) => updateAudience({ guestCount: parseInt(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Khoảng cách từ sân khấu đến hàng đầu:</span>
                <span className="font-bold text-white font-mono">{audience.distanceToStage} m</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={10.0}
                step={0.5}
                value={audience.distanceToStage}
                onChange={(e) => updateAudience({ distanceToStage: parseFloat(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
