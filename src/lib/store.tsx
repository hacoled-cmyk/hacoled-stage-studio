'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProjectState, CameraViewMode, TransformSelectedTarget, CalculatedBOM, LedScreenConfig, ScreenRole } from './types';
import { STAGE_PRESETS } from './constants/presets';
import { calculateProjectBOM } from './bomCalculator';

const STORAGE_KEY = 'hacoled-stage-studio-v1';
const MAX_UNDO = 25;

export type TabType = 'lib' | 'struct' | 'layer' | 'led' | 'light' | 'show' | 'bom';

interface StudioContextType {
  project: ProjectState;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  cameraView: CameraViewMode;
  setCameraView: (view: CameraViewMode) => void;
  selectedObject: TransformSelectedTarget | null;
  setSelectedObject: (obj: TransformSelectedTarget | null) => void;
  transformMode: 'translate' | 'rotate';
  setTransformMode: (mode: 'translate' | 'rotate') => void;
  bom: CalculatedBOM;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  loadPreset: (presetId: string) => void;
  resetProject: () => void;
  updateStage: (stageProps: Partial<ProjectState['stage']>) => void;
  updateTruss: (trussProps: Partial<ProjectState['truss']>) => void;
  addLedScreen: (role?: ScreenRole) => void;
  updateLedScreen: (id: string, screenProps: Partial<LedScreenConfig>) => void;
  removeLedScreen: (id: string) => void;
  updateLighting: (lightProps: Partial<ProjectState['lighting']>) => void;
  updateAudio: (audioProps: Partial<ProjectState['audio']>) => void;
  updateAudience: (audProps: Partial<ProjectState['audience']>) => void;
  toggleLayer: (layer: keyof ProjectState['layersVisibility']) => void;
  exportProjectFile: () => void;
  importProjectFile: (file: File) => Promise<boolean>;
  saveProjectToLocal: () => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const defaultProject = STAGE_PRESETS[0].state;
  const [project, setProjectState] = useState<ProjectState>(defaultProject);
  const [undoStack, setUndoStack] = useState<ProjectState[]>([]);
  const [redoStack, setRedoStack] = useState<ProjectState[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('lib');
  const [cameraView, setCameraView] = useState<CameraViewMode>('perspective');
  const [selectedObject, setSelectedObject] = useState<TransformSelectedTarget | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate');

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version && parsed.stage && parsed.ledScreens) {
          setProjectState(parsed);
        }
      }
    } catch {
      // Dùng cấu hình mặc định nếu lỗi parse
    }
  }, []);

  // Tự động lưu LocalStorage khi state thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      // Bỏ qua lỗi hạn ngạch storage
    }
  }, [project]);

  // Cập nhật project kèm theo lưu lịch sử Undo
  const updateProject = useCallback((updater: (prev: ProjectState) => ProjectState) => {
    setProjectState((prev) => {
      const next = updater(prev);
      setUndoStack((u) => [...u.slice(-MAX_UNDO), prev]);
      setRedoStack([]); // Xóa nhánh redo khi có thay đổi mới
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((u) => u.slice(0, -1));
    setRedoStack((r) => [...r, project]);
    setProjectState(previous);
  }, [undoStack, project]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setUndoStack((u) => [...u, project]);
    setProjectState(next);
  }, [redoStack, project]);

  const loadPreset = useCallback((presetId: string) => {
    const found = STAGE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      updateProject(() => JSON.parse(JSON.stringify(found.state)));
    }
  }, [updateProject]);

  const resetProject = useCallback(() => {
    const blank = STAGE_PRESETS[0].state;
    updateProject(() => ({
      ...blank,
      id: 'proj_' + Date.now(),
      name: 'Dự án Sân khấu Mới',
      clientName: '',
      notes: '',
    }));
    setSelectedObject(null);
  }, [updateProject]);

  const updateStage = useCallback((stageProps: Partial<ProjectState['stage']>) => {
    updateProject((prev) => ({
      ...prev,
      stage: { ...prev.stage, ...stageProps },
    }));
  }, [updateProject]);

  const updateTruss = useCallback((trussProps: Partial<ProjectState['truss']>) => {
    updateProject((prev) => ({
      ...prev,
      truss: { ...prev.truss, ...trussProps },
    }));
  }, [updateProject]);

  const addLedScreen = useCallback((role: ScreenRole = 'wing_left') => {
    const id = 'scr_' + Date.now();
    const newScreen: LedScreenConfig = {
      id,
      name: role === 'wing_left' ? 'Màn Cánh Gà Mới' : role === 'banner' ? 'Banner LED Treo' : 'Màn LED Phụ',
      role,
      pitch: 'P3.91',
      width: 3.0,
      height: 4.0,
      position: { x: role === 'wing_left' ? -6 : 6, y: 0.5, z: -1.5 },
      rotation: { x: 0, y: role === 'wing_left' ? 20 : -20, z: 0 },
      elevation: 0.5,
      curved: false,
      curveRadius: 0,
      visualPreset: 'hacoled_opening',
      brightness: 90,
      enabled: true,
    };

    updateProject((prev) => ({
      ...prev,
      ledScreens: [...prev.ledScreens, newScreen],
    }));

    setSelectedObject({
      type: 'screen',
      id,
      name: newScreen.name,
      position: newScreen.position,
      rotation: newScreen.rotation,
    });
  }, [updateProject]);

  const updateLedScreen = useCallback((id: string, screenProps: Partial<LedScreenConfig>) => {
    updateProject((prev) => ({
      ...prev,
      ledScreens: prev.ledScreens.map((scr) => (scr.id === id ? { ...scr, ...screenProps } : scr)),
    }));
    // Cập nhật selectedObject nếu đang chọn màn hình này
    setSelectedObject((prevObj) => {
      if (prevObj && prevObj.id === id) {
        return {
          ...prevObj,
          position: screenProps.position ?? prevObj.position,
          rotation: screenProps.rotation ?? prevObj.rotation,
        };
      }
      return prevObj;
    });
  }, [updateProject]);

  const removeLedScreen = useCallback((id: string) => {
    updateProject((prev) => ({
      ...prev,
      ledScreens: prev.ledScreens.filter((scr) => scr.id !== id),
    }));
    setSelectedObject((prevObj) => (prevObj?.id === id ? null : prevObj));
  }, [updateProject]);

  const updateLighting = useCallback((lightProps: Partial<ProjectState['lighting']>) => {
    updateProject((prev) => ({
      ...prev,
      lighting: { ...prev.lighting, ...lightProps },
    }));
  }, [updateProject]);

  const updateAudio = useCallback((audioProps: Partial<ProjectState['audio']>) => {
    updateProject((prev) => ({
      ...prev,
      audio: { ...prev.audio, ...audioProps },
    }));
  }, [updateProject]);

  const updateAudience = useCallback((audProps: Partial<ProjectState['audience']>) => {
    updateProject((prev) => ({
      ...prev,
      audience: { ...prev.audience, ...audProps },
    }));
  }, [updateProject]);

  const toggleLayer = useCallback((layer: keyof ProjectState['layersVisibility']) => {
    updateProject((prev) => ({
      ...prev,
      layersVisibility: {
        ...prev.layersVisibility,
        [layer]: !prev.layersVisibility[layer],
      },
    }));
  }, [updateProject]);

  const exportProjectFile = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_hacoled_stage.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [project]);

  const importProjectFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && parsed.stage && parsed.ledScreens) {
        updateProject(() => parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [updateProject]);

  const saveProjectToLocal = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      alert('Đã lưu dự án vào bộ nhớ trình duyệt thành công!');
    } catch {
      alert('Lỗi lưu trữ cục bộ.');
    }
  }, [project]);

  const bom = calculateProjectBOM(project);

  return (
    <StudioContext.Provider
      value={{
        project,
        activeTab,
        setActiveTab,
        cameraView,
        setCameraView,
        selectedObject,
        setSelectedObject,
        transformMode,
        setTransformMode,
        bom,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        undo,
        redo,
        updateProject,
        loadPreset,
        resetProject,
        updateStage,
        updateTruss,
        addLedScreen,
        updateLedScreen,
        removeLedScreen,
        updateLighting,
        updateAudio,
        updateAudience,
        toggleLayer,
        exportProjectFile,
        importProjectFile,
        saveProjectToLocal,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return ctx;
}
