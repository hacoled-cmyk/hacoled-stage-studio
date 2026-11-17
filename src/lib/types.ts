// Định nghĩa toàn bộ kiểu dữ liệu cho HACOLED STAGE STUDIO

export type PitchType = 'P1.53' | 'P1.86' | 'P2.0' | 'P2.5' | 'P3.0' | 'P3.91' | 'P4.0' | 'P5.0';

export interface LedModuleInfo {
  pitch: PitchType;
  name: string;
  category: 'indoor' | 'outdoor' | 'rental';
  moduleWidthMm: number;
  moduleHeightMm: number;
  pixelWidth: number;
  pixelHeight: number;
  maxPowerWPerSqm: number;
  avgPowerWPerSqm: number;
  pricePerSqm: number; // VNĐ / m2
  recommendedDistance: string;
  brightnessNits: number;
}

export type ScreenRole = 'main' | 'wing_left' | 'wing_right' | 'banner' | 'floor';

export interface LedScreenConfig {
  id: string;
  name: string;
  role: ScreenRole;
  pitch: PitchType;
  width: number; // mét
  height: number; // mét
  position: { x: number; y: number; z: number }; // mét
  rotation: { x: number; y: number; z: number }; // độ
  elevation: number; // mét cách sàn sân khấu
  curved: boolean;
  curveRadius: number; // bán kính cong (mét)
  visualPreset: string; // key hoặc URL visual
  customMediaUrl?: string | null;
  brightness: number; // 0 - 100%
  enabled: boolean;
}

export interface StageConfig {
  width: number; // mét (vd: 12)
  depth: number; // mét (vd: 8)
  height: number; // mét bục cao (vd: 0.8)
  shape: 'rectangle' | 't-shape' | 'extended';
  carpetColor: string; // hex
  hasStairs: boolean;
  stairsPosition: 'both' | 'front' | 'sides';
  hasFrontSkirt: boolean;
  skirtColor: string;
}

export interface TrussConfig {
  enabled: boolean;
  width: number; // mét (vd: 14)
  depth: number; // mét (vd: 8)
  height: number; // mét (vd: 6.5)
  sectionSize: '300x300' | '400x400';
  color: 'silver' | 'black';
  loadCapacityKg: number;
}

export type LightingLook = 'gala_gold' | 'bright_conference' | 'cyber_rock' | 'romantic_purple' | 'corporate_blue';

export interface LightingConfig {
  look: LightingLook;
  ambientIntensity: number;
  beamIntensity: number;
  spotIntensity: number;
  fogDensity: number;
  beamColor: string;
  fixturesCount: {
    beamMovingHead: number;
    parLedWash: number;
    profileSpot: number;
    blinder: number;
  };
}

export interface AudioConfig {
  enabled: boolean;
  brand: 'L-Acoustics' | 'd&b audiotechnik' | 'JBL VTX';
  lineArrayClusters: number; // 2 cụm L-R
  boxesPerCluster: number; // vd: 6 loa mỗi bên
  subwoofersCount: number; // vd: 4 sub
  elevation: number; // độ cao treo (m)
  stageMonitorsCount: number;
}

export interface AudienceConfig {
  mode: 'banquet' | 'theater' | 'standing' | 'none';
  guestCount: number;
  distanceToStage: number; // mét từ mép sân khấu đến hàng đầu
}

export interface ShowAct {
  id: string;
  title: string;
  durationMin: number;
  energyLevel: number; // 1 - 10
  lightingMood: LightingLook;
  note: string;
}

export interface BOMRates {
  trussPerMeterVnd: number;
  stagePerSqmVnd: number;
  beamPerFixtureVnd: number;
  parPerFixtureVnd: number;
  audioPackageVnd: number;
  laborAndTransportVnd: number;
}

export interface ProjectState {
  version: string;
  id: string;
  name: string;
  clientName: string;
  eventDate: string;
  venueName: string;
  venueType: 'indoor' | 'outdoor';
  notes: string;
  stage: StageConfig;
  truss: TrussConfig;
  ledScreens: LedScreenConfig[];
  lighting: LightingConfig;
  audio: AudioConfig;
  audience: AudienceConfig;
  showActs: ShowAct[];
  bomRates: BOMRates;
  layersVisibility: {
    stage: boolean;
    truss: boolean;
    led: boolean;
    lighting: boolean;
    audio: boolean;
    audience: boolean;
    props: boolean;
    grid: boolean;
  };
}

export interface CalculatedBOM {
  totalLedArea: number; // m2
  totalLedCabinets: number;
  totalLedModules: number;
  totalLedPowerPeakKw: number;
  totalLedPowerAvgKw: number;
  totalTrussMeters: number;
  totalTrussWeightKg: number;
  totalStageArea: number; // m2
  totalLightingPowerKw: number;
  totalAudioPowerKw: number;
  grandTotalPowerKw: number;
  recommendedBreakerAmp: number;
  recommendedCableSizeSqMm: number;
  estimatedCostVnd: number;
  costBreakdown: {
    ledCost: number;
    trussCost: number;
    stageCost: number;
    lightingCost: number;
    audioCost: number;
    laborCost: number;
  };
  warnings: string[];
}

export type CameraViewMode = 'perspective' | 'front' | 'top' | 'audience' | 'foh';

export interface TransformSelectedTarget {
  type: 'stage' | 'truss' | 'screen' | 'light' | 'audio';
  id?: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}
