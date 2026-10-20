import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { appName } from '@/lib/shared';
import './global.css';

export const metadata: Metadata = {
  title: { default: appName, template: `%s — ${appName}` },
  description: '그루 이음 · 그루 담다 가 함께 쓰는 디자인 시스템',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
