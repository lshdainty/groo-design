import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { GrooTokenStyle } from '@/components/specs/tokens-style';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {/* 컴포넌트 페이지 그림의 색 — 라이트 · 다크 전환을 따른다 */}
      <GrooTokenStyle />
      {children}
    </DocsLayout>
  );
}
