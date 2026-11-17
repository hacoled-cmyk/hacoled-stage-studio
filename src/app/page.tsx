'use client';

import React from 'react';
import { StudioProvider } from '@/lib/store';
import TopHeader from '@/components/header/TopHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import StageCanvas from '@/components/viewport/StageCanvas';

export default function StudioPage() {
  return (
    <StudioProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070B14]">
        {/* Top Navigation Header */}
        <TopHeader />

        {/* Main Workspace: Sidebar & 3D Viewport */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Controls Sidebar (7 Tabs) */}
          <Sidebar />

          {/* Center/Right 3D Interactive WebGL Stage Viewport */}
          <section className="flex-1 relative h-full overflow-hidden">
            <StageCanvas />
          </section>
        </div>
      </div>
    </StudioProvider>
  );
}
