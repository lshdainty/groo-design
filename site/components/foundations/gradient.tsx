// Gradient 페이지 — 그라디언트 값은 DESIGN.md 의 gradient-* 표, 반짝임의 시간 · 곡선 · 면은 skeleton.yaml, 가림 마스크의 깊이는 scroll-fog.yaml 에서 온다
import type { CSSProperties } from 'react';
import { color, proseTokenSet, sectionCode } from '@/lib/design-tokens';
import { loadComponentSpec } from '@/lib/component-spec';
import { loadingKit } from '../specs/loading-look';
import { fogMaskStyle } from '../specs/overlay-shared';
import { Figure, Panel, Table, Token } from './ui';
import { ShimmerDemo } from './shimmer-demo';

type Mode = 'light' | 'dark';
const rc = (name: string, mode: Mode = 'light') => color(mode === 'dark' ? `${name}-dark` : name);

// 방향 없이 적힌(위 → 아래) 그라디언트에 방향을 붙인다
const withDirection = (value: string, dir: string) => value.replace(/^linear-gradient\(/, `linear-gradient(${dir}, `);

function preview(name: string, value: string) {
  if (name === 'gradient-fade-mask')
    return <span className="block h-7 w-36 rounded-md" style={{ background: withDirection(value, 'to right'), boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />;
  const dark = name.endsWith('-dark');
  // 반짝임 띠는 스켈레톤 면(skeleton.yaml root.background) 위에
  const bone = loadingKit().skeleton.bg;
  return (
    <span className="relative block h-7 w-36 overflow-hidden rounded-md" style={{ background: dark ? bone.dark : bone.light }}>
      <span className="absolute inset-0" style={{ background: value }} />
    </span>
  );
}

export function GradientTokenTable() {
  const rows = proseTokenSet('gradient-', /^gradient-/);
  return (
    <Table head={['토큰', '미리보기', '값', '쓰는 곳']} minWidth={860}>
      {rows.map((r) => (
        <tr key={r.name}>
          <td><Token>{r.name}</Token></td>
          <td>{preview(r.name, r.value)}</td>
          <td className="min-w-[260px] max-w-[320px] break-all font-mono text-[11px] leading-4 text-fd-muted-foreground">{r.value}</td>
          <td className="min-w-[200px] text-fd-muted-foreground">{r.note.replace(/`/g, '')}</td>
        </tr>
      ))}
    </Table>
  );
}

export function FadeMaskFigure() {
  // 깊이는 Scroll Fog 의 자리 값 — 가로 줄 좌우(row) · 시트 본문 위 · 아래(overlayBody)
  const fog = loadingKit().fog;
  const row = fog.uses.row;
  const body = fog.uses.overlayBody;
  const chips = ['전체', '식비', '교통', '쇼핑', '카페', '구독', '의료'];
  const chipRow = (style?: CSSProperties) => (
    <div className="flex w-[256px] gap-2 overflow-hidden" style={{ paddingLeft: row.pad.left, ...style }}>
      {chips.map((c, i) => (
        <span key={c} className="shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium" style={{ background: i ? rc('bg-neutral-weak') : rc('bg-neutral-inverted'), color: i ? rc('fg-neutral') : rc('fg-neutral-inverted') }}>{c}</span>
      ))}
    </div>
  );
  const list = (style?: CSSProperties) => (
    <div className="flex h-[150px] w-[236px] flex-col overflow-hidden" style={style}>
      <div className="flex flex-col" style={{ marginTop: -18 }}>
        {['점심 식사', '지하철', '스타벅스', '관리비', '영화', '편의점'].map((t) => (
          <div key={t} className="flex h-9 shrink-0 items-center justify-between border-b text-[13px]" style={{ borderColor: rc('stroke-neutral-weak'), color: rc('fg-neutral') }}>
            {t}
            <span style={{ color: rc('fg-neutral-subtle') }}>⋯</span>
          </div>
        ))}
      </div>
    </div>
  );
  const card = (title: string, children: React.ReactNode) => (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-4">
      {children}
      <span className="text-center text-[12px] text-[#62697A]">{title}</span>
    </div>
  );
  return (
    <Figure caption="가로로 넘기는 줄(위)과 긴 목록(아래) — 왼쪽은 잘린 채로, 오른쪽은 마스크로 끝을 흐린다(Scroll Fog)">
      <div className="grid grid-cols-2 gap-4">
        {card('그냥 자름', chipRow())}
        {card(`좌우 ${row.sides.left} — to right · to left`, chipRow(fogMaskStyle(fog.mask, row.sides)))}
        {card('그냥 자름', list())}
        {card(`위 ${body.sides.top} · 아래 ${body.sides.bottom} — to bottom · to top`, list(fogMaskStyle(fog.mask, body.sides)))}
      </div>
    </Figure>
  );
}

export function ShimmerFigure() {
  const css = sectionCode('CSS keyframes 정의').replace(/@keyframes ([a-z-]+)/g, '@keyframes groo-$1');
  // 반짝임의 시간 · 곡선 · 면 · 글 자리는 skeleton.yaml(motion "반짝임" · root) — 토큰 이름도 YAML 에 적힌 그대로
  const sk = loadingKit().skeleton;
  const raw = (loadComponentSpec('skeleton') as unknown as { motion: Record<string, { duration: string; easing: string }> }).motion['반짝임'];
  const name = (t: string) => t.replace(/^\$/, '');
  const scenes = (['light', 'dark'] as Mode[]).map((m) => ({
    label: m === 'light' ? '라이트 — gradient-shimmer-neutral' : '다크 — gradient-shimmer-neutral-dark',
    page: rc('bg-layer-basement', m),
    card: rc('bg-layer-default', m),
    bone: m === 'dark' ? sk.bg.dark : sk.bg.light,
    shimmer: m === 'dark' ? sk.shimmer.dark : sk.shimmer.light,
    fg: rc('fg-neutral', m),
  }));
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Panel caption={`스켈레톤 위를 지나는 반짝임 띠 — ${name(raw.duration)} · ${name(raw.easing)}`}>
        <ShimmerDemo scenes={scenes} loop={{ ms: sk.motion.shimmer.ms, ease: sk.motion.shimmer.easing }} bone={{ text: sk.text.t4.lineHeight, radius: sk.radius['8'], avatar: sk.radius.full }} />
      </Panel>
    </>
  );
}
