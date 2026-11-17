'use client';

import React from 'react';
import { useStudio } from '@/lib/store';
import {
  DollarSign,
  Zap,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  CheckCircle,
  ShieldAlert,
  Printer,
  Info,
} from 'lucide-react';

export default function TabBOM() {
  const { project, bom } = useStudio();
  const { costBreakdown, warnings } = bom;

  const handleExportCsv = () => {
    const rows = [
      ['HACOLED STAGE STUDIO - BANG BOC TACH VAT TU VA DU TOAN'],
      ['Ten Du An:', project.name],
      ['Khach Hang:', project.clientName || 'N/A'],
      ['Ngay Xuat:', new Date().toLocaleDateString('vi-VN')],
      [''],
      ['STT', 'Hang Muc Thiet Bi', 'Khoi Luong', 'Don Vi', 'Thanh Tien (VND)'],
      ['1', `Man hinh LED (${project.ledScreens.map((s) => s.name + ' ' + s.pitch).join(', ')})`, bom.totalLedArea, 'm2', costBreakdown.ledCost],
      ['2', `He gian khung Truss nhom (${project.truss.sectionSize})`, bom.totalTrussMeters, 'm', costBreakdown.trussCost],
      ['3', `San san khau tham su kien`, bom.totalStageArea, 'm2', costBreakdown.stageCost],
      ['4', `He thong anh sang (Beam, Par, Spot)`, project.lighting.fixturesCount.beamMovingHead + project.lighting.fixturesCount.parLedWash, 'cay', costBreakdown.lightingCost],
      ['5', `He thong am thanh Line Array (${project.audio.brand})`, 1, 'goi', costBreakdown.audioCost],
      ['6', `Nhan cong van hanh & Van chuyen`, 1, 'chuyen', costBreakdown.laborCost],
      [''],
      ['TONG DU TOAN (VND):', '', '', '', bom.estimatedCostVnd],
      ['Tong cong suat dien dinh (kW):', bom.grandTotalPowerKw],
      ['Aptomat 3 pha khuyen nghi (A):', bom.recommendedBreakerAmp],
      ['Tiet dien day dong 3 pha (mm2):', bom.recommendedCableSizeSqMm],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DU_TOAN_HACOLED_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-red-500" />
            Vật Tư & Dự Toán Kỹ Thuật (BOM)
          </h4>
          <span className="text-slate-400 text-[11px]">Bóc tách khối lượng tự động theo thiết kế 3D</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleExportCsv}
            title="Tải bảng tính CSV"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Xuất Excel
          </button>
          <button
            onClick={handlePrint}
            title="In bảng dự toán"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cảnh báo an toàn kỹ thuật (Technical Warnings) */}
      {warnings.length > 0 ? (
        <div className="p-3 bg-amber-950/30 border border-amber-800/80 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
            <ShieldAlert className="w-4 h-4" />
            Lưu Ý An Toàn Kỹ Thuật ({warnings.length}):
          </div>
          <ul className="space-y-1 text-[11px] text-amber-200/90 pl-5 list-disc">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle className="w-4 h-4" />
          Toàn bộ kích thước, tải trọng và công suất đều đạt chuẩn an toàn!
        </div>
      )}

      {/* Khối Thông Số Kỹ Thuật Điện Lực (Electrical & Rigging Specs) */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
        <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-400" /> Thông Số Điện Nguồn & Kết Cấu
        </h5>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Tổng công suất đỉnh:</span>
            <span className="font-bold text-yellow-400 text-sm font-mono">{bom.grandTotalPowerKw} kW</span>
            <span className="text-[10px] text-slate-500 block">~ {(bom.grandTotalPowerKw * 1.18).toFixed(1)} kVA</span>
          </div>

          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Aptomat 3 Pha cần cấp:</span>
            <span className="font-bold text-white text-sm font-mono">{bom.recommendedBreakerAmp} A</span>
            <span className="text-[10px] text-slate-500 block">3P 380V công nghiệp</span>
          </div>

          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Tiết diện cáp đồng nguồn:</span>
            <span className="font-bold text-white text-sm font-mono">{bom.recommendedCableSizeSqMm} mm²</span>
            <span className="text-[10px] text-slate-500 block">4C (3L + 1N + E)</span>
          </div>

          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400 block">Chiều dài giàn truss:</span>
            <span className="font-bold text-white text-sm font-mono">{bom.totalTrussMeters} m</span>
            <span className="text-[10px] text-slate-500 block">Tải nhôm ~ {bom.totalTrussWeightKg} kg</span>
          </div>
        </div>
      </div>

      {/* Bảng Chi Tiết Báo Giá Dự Toán (Quotation Table) */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-200">Bảng Báo Giá Dự Toán Sơ Bộ</span>
          <span className="text-[10px] text-slate-500 font-mono">Đơn vị: VNĐ</span>
        </div>

        <div className="space-y-1.5 divide-y divide-slate-800/60 text-[11px]">
          {/* Màn LED */}
          <div className="pt-1.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200">1. Màn hình LED ({bom.totalLedArea} m²)</span>
              <div className="text-[10px] text-slate-400">
                {bom.totalLedModules} module · {bom.totalLedCabinets} cabin rental
              </div>
            </div>
            <span className="font-mono font-bold text-white">
              {costBreakdown.ledCost.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Truss */}
          <div className="pt-1.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200">2. Giàn khung Truss nhôm ({bom.totalTrussMeters} m)</span>
              <div className="text-[10px] text-slate-400">Hộp {project.truss.sectionSize} chịu lực cao</div>
            </div>
            <span className="font-mono font-bold text-white">
              {costBreakdown.trussCost.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Sân khấu */}
          <div className="pt-1.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200">3. Sàn sân khấu & thảm ({bom.totalStageArea} m²)</span>
              <div className="text-[10px] text-slate-400">Khung sắt mặt ván phủ thảm sự kiện</div>
            </div>
            <span className="font-mono font-bold text-white">
              {costBreakdown.stageCost.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Ánh sáng */}
          <div className="pt-1.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200">4. Thiết bị ánh sáng chuyên nghiệp</span>
              <div className="text-[10px] text-slate-400">
                {project.lighting.fixturesCount.beamMovingHead} Beam · {project.lighting.fixturesCount.parLedWash} Par LED
              </div>
            </div>
            <span className="font-mono font-bold text-white">
              {costBreakdown.lightingCost.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Âm thanh */}
          <div className="pt-1.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200">5. Âm thanh Line Array ({project.audio.brand})</span>
              <div className="text-[10px] text-slate-400">
                {project.audio.lineArrayClusters * project.audio.boxesPerCluster} loa treo · {project.audio.subwoofersCount} Sub
              </div>
            </div>
            <span className="font-mono font-bold text-white">
              {costBreakdown.audioCost.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* Nhân công */}
          <div className="pt-1.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200">6. Vận chuyển & Kỹ thuật thi công</span>
              <div className="text-[10px] text-slate-400">Trọn gói lắp đặt, trực vận hành và tháo dỡ</div>
            </div>
            <span className="font-mono font-bold text-white">
              {costBreakdown.laborCost.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Tổng cộng */}
        <div className="mt-3 pt-2.5 border-t-2 border-red-900/60 flex items-center justify-between text-xs">
          <span className="font-extrabold text-white uppercase tracking-wider">Tổng Dự Toán Dự Kiến:</span>
          <span className="font-black text-red-400 text-sm font-mono">
            {bom.estimatedCostVnd.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      </div>
    </div>
  );
}
