import { ProjectState, CalculatedBOM } from './types';
import { HACOLED_CATALOG } from './constants/ledCatalog';

export function calculateProjectBOM(state: ProjectState): CalculatedBOM {
  const warnings: string[] = [];

  // 1. Màn hình LED
  let totalLedArea = 0;
  let totalLedModules = 0;
  let totalLedCabinets = 0;
  let totalLedPowerPeakKw = 0;
  let totalLedPowerAvgKw = 0;
  let ledCost = 0;

  state.ledScreens.forEach((scr) => {
    if (!scr.enabled) return;
    const area = scr.width * scr.height;
    totalLedArea += area;

    const cat = HACOLED_CATALOG[scr.pitch] || HACOLED_CATALOG['P2.5'];

    // Tính số module
    const mw = cat.moduleWidthMm / 1000;
    const mh = cat.moduleHeightMm / 1000;
    const modX = Math.ceil(scr.width / mw);
    const modY = Math.ceil(scr.height / mh);
    totalLedModules += modX * modY;

    // Tính cabin (chuẩn rental 500x500mm = 0.25m2)
    const cabX = Math.ceil(scr.width / 0.5);
    const cabY = Math.ceil(scr.height / 0.5);
    totalLedCabinets += cabX * cabY;

    // Công suất điện
    const peakW = area * cat.maxPowerWPerSqm;
    const avgW = area * cat.avgPowerWPerSqm;
    totalLedPowerPeakKw += peakW / 1000;
    totalLedPowerAvgKw += avgW / 1000;

    // Chi phí dự toán
    ledCost += area * cat.pricePerSqm;

    // Kiểm tra tương quan kích thước
    if (scr.width > state.stage.width) {
      warnings.push(`Cảnh báo: Chiều rộng màn ${scr.name} (${scr.width}m) lớn hơn chiều rộng sân khấu (${state.stage.width}m).`);
    }
    if (scr.height + scr.elevation > state.truss.height && state.truss.enabled) {
      warnings.push(`Cảnh báo: Chiều cao đỉnh màn ${scr.name} (${scr.height + scr.elevation}m) vượt quá chiều cao giàn truss (${state.truss.height}m).`);
    }
  });

  // 2. Hệ giàn khung Truss
  let totalTrussMeters = 0;
  let trussCost = 0;
  let totalTrussWeightKg = 0;

  if (state.truss.enabled) {
    // 4 cột đứng + 4 xà ngang trên + 2 xà phụ treo đèn/màn
    const verticals = 4 * state.truss.height;
    const perimeters = 2 * (state.truss.width + state.truss.depth);
    const crossBeams = state.truss.width * 2;
    totalTrussMeters = Math.round(verticals + perimeters + crossBeams);

    // Trọng lượng nhôm ~7kg/m đối với 300x300, ~10kg/m đối với 400x400
    const kgPerM = state.truss.sectionSize === '400x400' ? 10 : 7;
    totalTrussWeightKg = totalTrussMeters * kgPerM;

    trussCost = totalTrussMeters * state.bomRates.trussPerMeterVnd;

    // Kiểm tra tải trọng treo
    const estimatedScreenWeightKg = totalLedArea * 35; // ~35kg/m2 gồm cabin và phụ kiện
    const totalHungKg = estimatedScreenWeightKg + 500; // thêm đèn và loa
    if (totalHungKg > state.truss.loadCapacityKg) {
      warnings.push(`Cảnh báo an toàn: Tổng tải trọng treo (~${Math.round(totalHungKg)}kg) vượt quá tải trọng an toàn của giàn truss (${state.truss.loadCapacityKg}kg).`);
    }
  }

  // 3. Sàn sân khấu
  const totalStageArea = state.stage.width * state.stage.depth;
  const stageCost = totalStageArea * state.bomRates.stagePerSqmVnd;

  // 4. Ánh sáng
  const fx = state.lighting.fixturesCount;
  const totalLightingPowerKw = (fx.beamMovingHead * 450 + fx.parLedWash * 150 + fx.profileSpot * 350 + fx.blinder * 1000) / 1000;
  const lightingCost = fx.beamMovingHead * state.bomRates.beamPerFixtureVnd +
    fx.parLedWash * state.bomRates.parPerFixtureVnd +
    fx.profileSpot * (state.bomRates.beamPerFixtureVnd * 1.2) +
    fx.blinder * (state.bomRates.beamPerFixtureVnd * 0.8);

  // 5. Âm thanh
  let totalAudioPowerKw = 0;
  let audioCost = 0;
  if (state.audio.enabled) {
    totalAudioPowerKw = (state.audio.lineArrayClusters * state.audio.boxesPerCluster * 600 + state.audio.subwoofersCount * 1500) / 1000;
    audioCost = state.bomRates.audioPackageVnd;
  }

  // 6. Tổng công suất điện tiêu thụ & Quy cách nguồn cấp
  const grandTotalPowerKw = Number((totalLedPowerPeakKw + totalLightingPowerKw + totalAudioPowerKw + 2.0).toFixed(1)); // +2kW phụ tải FOH
  // Tính dòng điện 3 pha: I = P / (sqrt(3) * U * cosPhi) với U = 380V, cosPhi = 0.85
  // I ~ P(kW) * 1.8
  const recommendedBreakerAmp = Math.ceil((grandTotalPowerKw * 1.8) / 10) * 10;
  
  // Tiết diện dây đồng 3 pha: Mật độ dòng điện an toàn ~ 4A/mm2
  const rawCableSize = recommendedBreakerAmp / 4;
  const standardCableSizes = [4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const recommendedCableSizeSqMm = standardCableSizes.find((s) => s >= rawCableSize) || 120;

  if (grandTotalPowerKw > 50) {
    warnings.push(`Lưu ý điện lực: Tổng công suất đỉnh ${grandTotalPowerKw} kW (> 50 kW) cần máy phát điện riêng hoặc trạm biến áp dự phòng.`);
  }

  // 7. Tổng dự toán
  const laborCost = state.bomRates.laborAndTransportVnd;
  const estimatedCostVnd = ledCost + trussCost + stageCost + lightingCost + audioCost + laborCost;

  return {
    totalLedArea: Number(totalLedArea.toFixed(2)),
    totalLedCabinets,
    totalLedModules,
    totalLedPowerPeakKw: Number(totalLedPowerPeakKw.toFixed(1)),
    totalLedPowerAvgKw: Number(totalLedPowerAvgKw.toFixed(1)),
    totalTrussMeters,
    totalTrussWeightKg,
    totalStageArea: Number(totalStageArea.toFixed(1)),
    totalLightingPowerKw: Number(totalLightingPowerKw.toFixed(1)),
    totalAudioPowerKw: Number(totalAudioPowerKw.toFixed(1)),
    grandTotalPowerKw,
    recommendedBreakerAmp,
    recommendedCableSizeSqMm,
    estimatedCostVnd,
    costBreakdown: {
      ledCost: Math.round(ledCost),
      trussCost: Math.round(trussCost),
      stageCost: Math.round(stageCost),
      lightingCost: Math.round(lightingCost),
      audioCost: Math.round(audioCost),
      laborCost: Math.round(laborCost),
    },
    warnings,
  };
}
