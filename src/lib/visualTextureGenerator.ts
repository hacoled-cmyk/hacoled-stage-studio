import * as THREE from 'three';

// Tạo texture visual động/tĩnh cho màn hình LED dựa trên preset
export function createLedVisualTexture(presetId: string, screenWidthM: number, screenHeightM: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  // Kích thước canvas tỷ lệ tương xứng để chữ và hoa văn cực sắc nét
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const w = canvas.width;
    const h = canvas.height;

    if (presetId === 'hacoled_opening') {
      // HACOLED Khai mạc Đỏ Ánh Kim
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, '#EF4444');
      grad.addColorStop(0.5, '#B91C1C');
      grad.addColorStop(1, '#450A0A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Tia sáng vàng kim
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 36; i++) {
        const angle = (i * Math.PI) / 18;
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(w / 2 + Math.cos(angle) * w, h / 2 + Math.sin(angle) * h);
        ctx.stroke();
      }

      // Hạt vàng kim
      for (let i = 0; i < 60; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        const pr = Math.random() * 3 + 1;
        ctx.fillStyle = 'rgba(253, 230, 138, 0.7)';
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Logo & Chữ thương hiệu
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 54px Arial, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 16;
      ctx.fillText('HACOLED STAGE STUDIO', w / 2, h / 2 - 20);

      ctx.fillStyle = '#FDE047';
      ctx.font = '600 24px Arial, sans-serif';
      ctx.fillText(`MÀN HÌNH CHÍNH · ${screenWidthM.toFixed(1)}M × ${screenHeightM.toFixed(1)}M`, w / 2, h / 2 + 35);
    } else if (presetId === 'gala_luxury') {
      // Gala Night Hoàng Gia Đen Vàng
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E1B4B');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Khung viền hoa văn vàng
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 6;
      ctx.strokeRect(40, 40, w - 80, h - 80);
      ctx.strokeStyle = 'rgba(253, 230, 138, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, w - 110, h - 110);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 56px "Times New Roman", serif';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 24;
      ctx.fillText('GALA DINNER', w / 2, h / 2 - 25);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '300 22px Arial, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.shadowBlur = 0;
      ctx.fillText('TRI ÂN & KỶ NIỆM THÀNH LẬP', w / 2, h / 2 + 35);
    } else if (presetId === 'tech_cyber') {
      // Công nghệ Tương lai Cyber Neon
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, w, h);

      // Lưới ma trận Cyan
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 52px "Courier New", monospace';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 20;
      ctx.fillText('NEXT GENERATION TECH', w / 2, h / 2 - 20);

      ctx.fillStyle = '#38BDF8';
      ctx.font = '600 22px Arial, sans-serif';
      ctx.fillText('HACOLED VISUAL DISPLAY SYSTEM', w / 2, h / 2 + 35);
    } else if (presetId === 'corporate_blue') {
      // Hội nghị Xanh Navy
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1E3A8A');
      grad.addColorStop(1, '#0F172A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fillText('HỘI NGHỊ THƯỜNG NIÊN 2026', w / 2, h / 2 - 20);

      ctx.fillStyle = '#93C5FD';
      ctx.font = '500 22px Arial, sans-serif';
      ctx.fillText('CHUYỂN ĐỔI SỐ VÀ ĐỘT PHÁ TĂNG TRƯỞNG', w / 2, h / 2 + 35);
    } else {
      // Sóng nhạc EDM
      ctx.fillStyle = '#180B05';
      ctx.fillRect(0, 0, w, h);

      // Sóng âm thanh
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let x = 0; x < w; x += 10) {
        const y = h / 2 + Math.sin(x * 0.02) * 80 * Math.sin(x * 0.005);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FB923C';
      ctx.font = '900 64px Arial, sans-serif';
      ctx.shadowColor = '#EA580C';
      ctx.shadowBlur = 25;
      ctx.fillText('HACO LIVE MUSIC', w / 2, h / 2 - 30);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
