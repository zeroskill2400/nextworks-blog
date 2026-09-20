import './globals.css';
import { Talk } from './_parts/Talk';

const BASE = 'https://nextworks-blog.vercel.app';
export const metadata = {
  metadataBase: new URL(BASE),
  title: { default: '넥스트웍스 기록', template: '%s · 넥스트웍스 기록' },
  description: '사업에 쓰는 AI와 자동화 소식을 매일 정리하고, 직접 만들며 남긴 기록을 올립니다.',
  openGraph: { type: 'website', siteName: '넥스트웍스 기록', locale: 'ko_KR',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}<Talk /></body>
    </html>
  );
}
