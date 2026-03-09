import type { Metadata } from 'next';
import { Layout } from '@/src/app/components/Layout';
import '@/src/styles/index.css';

export const metadata: Metadata = {
  title: 'Social Reading App MVP',
  description: 'Figma exported UI adjusted to Next.js App Router.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
