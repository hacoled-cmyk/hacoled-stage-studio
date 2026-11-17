import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HACOLED STAGE STUDIO - Thiết Kế Sân Khấu & Màn Hình LED 3D',
  description:
    'Nền tảng ứng dụng thiết kế 3D không gian sân khấu sự kiện, cấu hình màn hình LED, giàn khung truss và dự toán kỹ thuật chuyên nghiệp bởi HACOLED.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full bg-[#070B14] text-slate-100 antialiased dark">
      <body className="h-full w-full overflow-hidden flex flex-col font-sans select-none">
        {children}
      </body>
    </html>
  );
}
