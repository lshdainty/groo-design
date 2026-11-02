// 기다림 묶음(Skeleton · Progress Circle · Progress · Scroll Fog · Content Placeholder) 페이지가 같이 쓰는 그림 조각(서버).
// 부품 자체(면 · 원 · 막대 · 흐림 · 대체 그림)는 loading-view 가 YAML 값(loading-look)으로 그린다. 목록 줄은 list.yaml(listLook),
// 버튼은 button.yaml, 결과 · 스낵바는 result-section · snackbar.yaml 이다. 화면 틀(폰 · 카드 제목)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MARK_LINE } from '../foundations/ui';
import { listLook } from './list-look';
import { ListView } from './list-view';
import { TX } from './loading-data';
import { SK_ROW, loadingKit, loadingScreen, type RowDims } from './loading-look';
import type { LdCard, LdScreen } from './loading-shared';
import { cardFace } from './card-face';
import { ContentPlaceholderView, ProgressCircleView, ProgressView, SkeletonRowsView, SkeletonView, SlowTextView, type ContentPlaceholderViewProps, type ProgressCircleViewProps, type ProgressViewProps, type SkeletonViewProps } from './loading-view';
import { Phone, rc, type Mode } from './kit';

type Brand = 'desk' | 'hr';
export const L = (brand: Brand = 'desk') => loadingKit(brand);
// 그림 속 화면의 역할 색 + 카드(card.yaml) — 브라우저 그림(loading-demos)도 이 값을 받는다
export const ldCard = (): LdCard => cardFace();
export const SCREEN = (brand: Brand = 'desk'): LdScreen => ({ ...loadingScreen(brand), card: ldCard() });
export type Fig = (p: { caption?: string }) => ReactNode;

// ── 부품(값은 YAML) ─────────────────────────────────────
export const Bone = (p: Omit<SkeletonViewProps, 'look'>) => <SkeletonView look={L().skeleton} {...p} />;
export const Circle = ({ brand = 'desk', ...p }: Omit<ProgressCircleViewProps, 'look'> & { brand?: Brand }) => <ProgressCircleView look={L(brand).circle} {...p} />;
export const Meter = ({ brand = 'desk', ...p }: Omit<ProgressViewProps, 'look'> & { brand?: Brand }) => <ProgressView look={L(brand).progress} {...p} />;
export const Placeholder = (p: Omit<ContentPlaceholderViewProps, 'look'>) => <ContentPlaceholderView look={L().placeholder} {...p} />;
export const SlowText = ({ mode = 'auto', align = 'left', style }: { mode?: Mode; align?: 'left' | 'center'; style?: CSSProperties }) => <SlowTextView look={L().skeleton} mode={mode} align={align} style={style} />;

// ── 목록 줄 ─────────────────────────────────────────────
// 가계부 거래 — 줄 데이터는 loading-data(브라우저 미리보기와 같이 쓴다)
export { TX };
// compact — 좁은 칸에서는 메타를 카테고리만(식비 · 카페)
export function TxList({ mode = 'auto', n = 4, from = 0, brand = 'desk', compact = false }: { mode?: Mode; n?: number; from?: number; brand?: Brand; compact?: boolean }) {
  const rows = TX.slice(from, from + n).map((r) => (compact && r.detail ? { ...r, detail: r.detail.split(' · ')[0] } : r));
  return <ListView look={listLook(brand)} rows={rows} mode={mode} live={false} />;
}
// 목록 줄의 치수 — list.yaml 의 줄(위아래 · 좌우 여백 · 앞 칸 · 본문 사이 · 글자)
export function rowDims(): RowDims {
  const f = listLook('desk').faces.none.light.enabled;
  const titleLh = parseFloat(f.title.lineHeight ?? f.title.fontSize);
  const detailLh = parseFloat(f.detail.lineHeight ?? f.detail.fontSize);
  return { padY: f.pad.y, padX: f.pad.x, avatar: f.tile.size, prefixGap: f.prefix.padRight, bodyGap: f.body.gap, suffixGap: f.body.padRight, titleLh, detailLh, height: f.pad.y * 2 + Math.max(f.tile.size, titleLh + f.body.gap + detailLh) };
}
// 거래 줄 스켈레톤 — 껍데기는 List 의 줄 그대로(SkeletonRowsView)
export { SK_ROW };
export const TxSkeletonRows = (p: Omit<Parameters<typeof SkeletonRowsView>[0], 'look' | 'dims'>) => <SkeletonRowsView look={L().skeleton} dims={rowDims()} {...p} />;

// ── 화면 조각 ───────────────────────────────────────────
// 흰 카드 — 회색 바탕 위의 묶음(card.yaml — 흰 면 + 1px stroke-neutral-weak · 모서리 16 · 그림자 없음). 제목(틀)은 처음부터 그린다.
// 목록 카드(body list — 제목이 있으면 기본)는 머리 위 24 · 좌우 24 · 아래 4, 줄이 제 좌우 24 를 가지고 카드 아래는 12 다.
// 머리 없는 목록 카드는 위도 12(첫 줄의 위 12 와 합쳐 보이는 24). 글 카드(body content — 제목이 없으면 기본)는 여백 24
export function CardBox({ mode = 'auto', title, right, children, style, body }: { mode?: Mode; title?: ReactNode; right?: ReactNode; children?: ReactNode; style?: CSSProperties; body?: 'list' | 'content' }) {
  const c = ldCard();
  const list = (body ?? (title !== undefined ? 'list' : 'content')) === 'list';
  const pad: CSSProperties = list
    ? { paddingTop: title !== undefined ? 0 : c.listBottom, paddingRight: 0, paddingBottom: c.listBottom, paddingLeft: 0 }
    : { paddingTop: c.pad, paddingRight: c.pad, paddingBottom: c.pad, paddingLeft: c.pad };
  return (
    <div style={{ boxSizing: 'border-box', borderRadius: c.radius, background: rc('bg-layer-default', mode), borderWidth: c.borderW, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak', mode), overflow: 'hidden', ...pad, ...style }}>
      {title !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: c.head.gap, paddingTop: list ? c.head.top : 0, paddingRight: list ? c.head.x : 0, paddingBottom: c.head.bottom, paddingLeft: list ? c.head.x : 0 }}>
          <span style={{ fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: rc('fg-neutral', mode) }}>{title}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
// 달 넘기기 머리 — ‹ 2026년 10월 › (틀 — 고른 달은 바로 바뀐다)
export function MonthNav({ mode = 'auto', month, right }: { mode?: Mode; month: string; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8, paddingRight: 24, paddingBottom: 8, paddingLeft: 24 }}>
      <ChevronLeft aria-hidden size={22} strokeWidth={2} style={{ color: rc('fg-neutral', mode) }} />
      <span style={{ fontSize: 17, lineHeight: '24px', fontWeight: 700, color: rc('fg-neutral', mode) }}>{month}</span>
      <ChevronRight aria-hidden size={22} strokeWidth={2} style={{ color: rc('fg-neutral', mode) }} />
      {right}
    </div>
  );
}
// 요약 머리 — "10월 지출" · 금액(t8 22/30). 금액 자리는 스켈레톤일 수 있다
export function SpendHead({ mode = 'auto', label = '10월 지출', amount, bone, hidden, still }: { mode?: Mode; label?: string; amount?: string; bone?: number; hidden?: boolean; still?: boolean }) {
  const t8 = L().skeleton.text.t8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 13, lineHeight: '18px', color: rc('fg-neutral-subtle', mode) }}>{label}</span>
      {amount ? (
        <span style={{ fontSize: t8.size, lineHeight: `${t8.lineHeight}px`, fontWeight: 700, color: rc('fg-neutral', mode), fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
      ) : (
        <Bone mode={mode} text="t8" width={bone ?? 140} hidden={hidden} still={still} />
      )}
    </div>
  );
}
// 카테고리 줄(통계) — 타일 · 이름(틀) · 금액(숫자 — 스켈레톤일 수 있다)
export const STAT_ROWS: [string, string, string][] = [
  ['식비', 'orange', '432,000원'],
  ['교통', 'green', '128,500원'],
  ['쇼핑', 'violet', '96,000원'],
];
export function StatRows({ mode = 'auto', amounts = true, still }: { mode?: Mode; amounts?: boolean; still?: boolean }) {
  const t5 = L().skeleton.text.t5;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {STAT_ROWS.map(([name, hue, amt]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '0 24px' }}>
          <span aria-hidden style={{ width: 32, height: 32, borderRadius: 10, background: rc(`chart-${hue}-weak`, mode), color: rc(`chart-${hue}-contrast`, mode), display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {name.slice(0, 1)}
          </span>
          <span style={{ flex: 1, fontSize: t5.size, lineHeight: `${t5.lineHeight}px`, color: rc('fg-neutral', mode) }}>{name}</span>
          {amounts ? (
            <span style={{ fontSize: t5.size, lineHeight: `${t5.lineHeight}px`, fontWeight: 700, color: rc('fg-neutral', mode), fontVariantNumeric: 'tabular-nums' }}>{amt}</span>
          ) : (
            <Bone mode={mode} text="t5" width={80} still={still} />
          )}
        </div>
      ))}
    </div>
  );
}
// 폰 — 회색 바탕 · 탭 바(앱 틀). 화면 예시의 크기는 그림에서 정한다
// title 이 없으면 앱 막대 없이 상태 막대 아래부터 그린다(그림이 머리를 따로 그릴 때)
export function LdPhone({ mode = 'auto', title, back = false, tabs = true, h = 600, scale = 1, bg = 'bg-layer-basement', right, bottom, overlay, children }: { mode?: Mode; title?: string; back?: boolean; tabs?: boolean; h?: number; scale?: number; bg?: string; right?: ReactNode; bottom?: ReactNode; overlay?: ReactNode; children?: ReactNode }) {
  return (
    <Phone title={title} back={back} mode={mode} h={h} scale={scale} bg={bg} tabs={tabs} right={right} bottom={bottom} overlay={overlay}>
      {children}
    </Phone>
  );
}

// ── 시간표 막대 — 0 · showAfter · slowAfter · timeout(skeleton.yaml region) ─────────
export function TimelineBar({ mode = 'auto', width = 560, labels }: { mode?: Mode; width?: number; labels: [string, string, string, string] }) {
  const r = L().skeleton.region;
  const end = r.timeout * 1.2;
  const at = (ms: number) => (ms / end) * 100;
  const segs: [number, number, string, string][] = [
    [0, r.showAfter, labels[0], 'bg-layer-basement'],
    [r.showAfter, r.slowAfter, labels[1], 'bg-neutral-weak'],
    [r.slowAfter, r.timeout, labels[2], 'bg-warning-weak'],
    [r.timeout, end, labels[3], 'bg-critical-weak'],
  ];
  return (
    <div style={{ position: 'relative', width, maxWidth: '100%', paddingTop: 20 }}>
      {[0, r.showAfter, r.slowAfter, r.timeout].map((t) => (
        <span key={t} style={{ position: 'absolute', top: 0, left: `${at(t)}%`, transform: 'translateX(-50%)', fontSize: 11, lineHeight: '16px', color: rc('fg-neutral-subtle', mode), whiteSpace: 'nowrap' }}>
          {t / 1000}초
        </span>
      ))}
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden' }}>
        {segs.map(([a, b, t, bg]) => (
          <span key={t} style={{ width: `${at(b) - at(a)}%`, minHeight: 40, boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '4px 6px', background: rc(bg, mode), borderRight: `2px solid ${rc('bg-layer-default', mode)}`, fontSize: 11, lineHeight: '14px', color: rc('fg-neutral', mode) }}>
            {t}
          </span>
        ))}
      </div>
      <span aria-hidden style={{ position: 'absolute', top: 20, bottom: 0, left: `${at(r.timeout)}%`, borderLeft: `2px dashed ${rc('stroke-critical-solid', mode)}` }} />
    </div>
  );
}

// 자리 표시 — 0 ~ 1초에 보이지 않게 그린 데이터 자리(높이는 지킨다)를 그림에서만 점선으로
export const keepMark: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
