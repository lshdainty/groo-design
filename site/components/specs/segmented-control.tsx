// Segmented Control 페이지의 그림 — specs/components/segmented-control.md 의 `[그림: …](../../site/components/specs/segmented-control.tsx#<id>)` 자리.
// 컨트롤은 segmented-control.yaml 을 푼 값(segmentedLook)으로, 탭은 tabs.yaml(tabsLook)로 그린다.
// 화면 속 목록은 아직 스펙이 없어 역할 색 토큰으로 간단히 그린다(kit).
// 폰 화면은 틀 바깥 360 — 트랙은 화면 여백 안 콘텐츠 폭(360 − 24 × 2 = 312)을 채우고 칸이 똑같이 나눈다.
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { PHONE_W, Phone, Row, Verdict, rc, type Mode } from './kit';
import { ASSET_RANGE, HOLDINGS, PRESET_SORT_LONG, RANKING, SEG_SETS, TODOS, TXS, todoFilter } from './segmented-control-data';
import { TodoDemo, SegDemoFrame } from './segmented-control-demos';
import { segmentedLook, SEG_STATES, type SegItem, type SegLook, type SegState } from './segmented-control-look';
import { SegmentedPlayground } from './segmented-control-playground';
import { SegmentedView, type SegmentedViewProps } from './segmented-control-view';
import { Cap, Surface } from './select-screens';
import { BROKER_TABS, STATS_TABS, VIEW_TABS } from './tabs-data';
import { chipTabsLook, tabsLook } from './tabs-look';
import { ChipTabsView, LineTabsView } from './tabs-view';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';
const sl = (brand: Brand = 'desk') => segmentedLook(brand);
const px = (v: string) => parseFloat(v);
const SCREEN = PHONE_W;
const STATE_KO: Record<SegState, string> = { enabled: '기본', hovered: '호버(웹)', pressed: '누름', focused: '포커스(키보드)', disabled: '비활성' };

// ── 조각 ─────────────────────────────────────────────────
function S({ brand = 'desk', ...p }: Omit<SegmentedViewProps, 'look' | 'live'> & { brand?: Brand }) {
  return <SegmentedView look={sl(brand)} live={false} {...p} />;
}
function Screen({ title, mode = 'auto', scale = 0.62, h = 440, back = false, children }: { title?: string; mode?: Mode; scale?: number; h?: number; back?: boolean; children: ReactNode }) {
  return (
    <Phone title={title} back={back} mode={mode} scale={scale} h={h} bg="bg-layer-default" screenW={SCREEN}>
      {children}
    </Phone>
  );
}
// 화면 안 내용 — 좌우는 화면 여백
function Body({ children, top = 12, gap = 8 }: { children: ReactNode; top?: number; gap?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingTop: top, paddingLeft: sl().gutter, paddingRight: sl().gutter, rowGap: gap }}>
      {children}
    </div>
  );
}
function Pin({ n }: { n: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
}
const dashed = (offset = 0): CSSProperties => ({ outlineStyle: 'dashed', outlineWidth: 1, outlineColor: MARK_LINE, outlineOffset: offset });
const markBox: CSSProperties = { ...dashed(), background: MARK };
function Tag({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return (
    <span aria-hidden className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, ...style }}>
      {children}
    </span>
  );
}
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">{children}</div>;
const Wide = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`max-w-full overflow-x-auto ${className}`}>{children}</div>;

// ── 화면 조각 ─────────────────────────────────────────────
function TxRows({ mode, value = 'all', n = 4 }: { mode: Mode; value?: string; n?: number }) {
  return (
    <div>
      {TXS.filter((x) => value === 'all' || x.type === value)
        .slice(0, n)
        .map((x) => (
          <Row key={x.title} mode={mode} title={x.title} sub={x.sub} amount={x.amount} hue={x.hue} />
        ))}
    </div>
  );
}
function TodoRows({ mode, value = 'today' }: { mode: Mode; value?: string }) {
  return (
    <div>
      {TODOS.filter(todoFilter(value)).map((x) => (
        <div key={x.title} className="flex items-center gap-3 py-2.5">
          <span aria-hidden className="block h-5 w-5 shrink-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${rc('stroke-neutral-solid', mode)}` }} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-medium" style={{ color: rc('fg-neutral', mode) }}>
              {x.title}
            </span>
            <span className="text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {x.due}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
// 가계부 — 목록 바로 위 전체 · 지출 · 수입
function LedgerScreen({ mode, value = 'all', scale, h = 440 }: { mode: Mode; value?: string; scale?: number; h?: number }) {
  return (
    <Screen title="가계부" mode={mode} scale={scale} h={h}>
      <Body>
        <S mode={mode} items={SEG_SETS[3].items} value={value} />
        <TxRows mode={mode} value={value} />
      </Body>
    </Screen>
  );
}
// 할 일 — 목록 바로 위 오늘 · 이번 주 · 전체 · 완료
function TodoScreen({ mode, value = 'today', scale, h = 440 }: { mode: Mode; value?: string; scale?: number; h?: number }) {
  return (
    <Screen title="할 일" mode={mode} scale={scale} h={h}>
      <Body>
        <S mode={mode} items={SEG_SETS[4].items} value={value} />
        <TodoRows mode={mode} value={value} />
      </Body>
    </Screen>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-4">
      <LedgerScreen mode="light" h={500} />
      <TodoScreen mode="dark" value="week" h={500} />
    </div>
  </Figure>
);

const Playground: Fig = () => <SegmentedPlayground looks={{ desk: sl('desk'), hr: sl('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
function zoomSeg(l: SegLook, k: number): SegLook {
  return {
    ...l,
    root: { ...l.root, padding: l.root.padding * k },
    item: { ...l.item, minH: l.item.minH * k, padX: l.item.padX * k, padY: l.item.padY * k },
    text: { ...l.text, fontSize: `${px(l.text.fontSize) * k}px`, lineHeight: `${px(l.text.lineHeight) * k}px` },
    indicator: { ...l.indicator, inset: l.indicator.inset * k, borderWidth: l.indicator.borderWidth * k },
    notification: { ...l.notification, size: l.notification.size * k, gap: l.notification.gap * k },
    ring: { ...l.ring, width: l.ring.width * k, offset: l.ring.offset * k },
  };
}
const ANATOMY_W = 250;
const Anatomy: Fig = ({ caption }) => {
  const k = 2;
  const z = zoomSeg(sl(), k);
  const items: SegItem[] = [...SEG_SETS[3].items.slice(0, 2), { ...SEG_SETS[3].items[2], notification: true }];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-12 rounded-xl pk-surface px-10 pb-10 pt-16">
        <div style={{ width: ANATOMY_W * k }}>
          <SegmentedView
            look={z}
            live={false}
            items={items}
            value="all"
            zone={{ root: dashed(4) }}
            itemZone={{ all: { label: markBox }, expense: { item: dashed(-1) } }}
            itemPins={{ all: { label: <Pin n="ⓒ" /> }, expense: { item: <Pin n="ⓑ" /> }, income: { notification: <Pin n="ⓔ" /> } }}
            pins={{ root: <Pin n="ⓐ" />, indicator: <Pin n="ⓓ" /> }}
            pinLine={MARK_LINE}
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted sm:grid-cols-5">
          {[
            ['ⓐ', 'Track'],
            ['ⓑ', 'Segment'],
            ['ⓒ', 'Label'],
            ['ⓓ', 'Indicator'],
            ['ⓔ', 'Notification'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
        <span className="text-center text-[12px] pk-muted">2배로 그렸다 — 고른 칸 뒤에 흰 알약, 셋째 칸에 알림 점</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 폭 — 360 폰에서 2 · 3 · 4개. 트랙은 콘텐츠 폭(화면 − 여백 × 2)을 채우고 칸이 똑같이 나눈다
const Width: Fig = ({ caption }) => {
  const lk = sl();
  const track = SCREEN - lk.gutter * 2;
  const H = lk.item.minH + lk.root.padding * 2;
  const p = lk.root.padding;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-2">
        <Wide>
          {/* 흰 판 = 360 화면. 둘레의 치수 표시는 판 밖(회색)으로 낸다 */}
          <div style={{ paddingLeft: 8, paddingRight: 44, paddingBottom: 14 }}>
            <Surface style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 12, paddingBottom: 28 }}>
              <div className="flex flex-col" style={{ width: SCREEN, paddingLeft: lk.gutter, paddingRight: lk.gutter, rowGap: 34 }}>
                {[2, 3, 4].map((n, row) => {
                  const set = SEG_SETS[n];
                  const item = (track - p * 2) / n;
                  return (
                    <div key={n} className="relative" style={{ marginTop: row === 0 ? 24 : 0 }}>
                      {row === 0 && (
                        <>
                          <span aria-hidden className="absolute" style={{ left: -lk.gutter, width: lk.gutter, top: 0, height: H, background: MARK }} />
                          <Tag style={{ left: -lk.gutter / 2, top: H / 2, transform: 'translate(-50%, -50%)' }}>{lk.gutter}</Tag>
                          <span aria-hidden className="absolute" style={{ left: 0, width: track, top: -10, height: 3, background: MARK }} />
                          <Tag style={{ left: track / 2, top: -12, transform: 'translate(-50%, -100%)' }}>트랙 {track}</Tag>
                        </>
                      )}
                      <S items={set.items} value={set.items[0].value} />
                      {/* 칸 폭 · 안쪽 */}
                      <span aria-hidden className="absolute" style={{ left: p, width: item, top: H + 4, height: 3, background: MARK }} />
                      <Tag style={{ left: p + item / 2, top: H + 9, transform: 'translateX(-50%)' }}>칸 {Math.round(item * 10) / 10}</Tag>
                      {row === 2 && (
                        <>
                          <span aria-hidden className="absolute" style={{ left: 0, width: p, top: 0, height: H, background: MARK }} />
                          <span aria-hidden className="absolute" style={{ right: -10, width: 4, top: 0, height: H, background: MARK }} />
                          <Tag style={{ right: -14, top: H / 2, transform: 'translate(100%, -50%)' }}>{H}</Tag>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Surface>
          </div>
        </Wide>
        <Cap strong={`${SCREEN} 폰 — 트랙 ${track}(여백 ${lk.gutter} × 2)`}>
          칸 = (트랙 − 안쪽 {p} × 2) ÷ 칸 수 — 최소 폭 없이 4개도 들어간다 · 높이 {H} = 칸 {lk.item.minH} + 안쪽 {p} × 2 · 글 {px(lk.text.fontSize)} · {lk.text.fontWeight} · 칸 좌우 {lk.item.padX}
        </Cap>
      </div>
    </Panel>
  );
};

// 상태 다섯 × 안 고름 · 고름 — 라이트 · 다크(앞 칸이 그 상태)
const States: Fig = ({ caption }) => {
  const items = SEG_SETS[2].items;
  const [a, b] = items.map((i) => i.value);
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        {/* 좁은 화면에서는 상태 이름을 줄 위로 올린다 — 표가 판 안에 들어가게 */}
        <div className="mx-auto grid w-max grid-cols-2 items-center gap-x-3 gap-y-2 sm:grid-cols-[max-content_max-content_max-content] sm:gap-x-5 sm:gap-y-3">
          <span className="hidden sm:block" />
          {['안 고름', '고름'].map((h) => (
            <span key={h} className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {h}
            </span>
          ))}
          {SEG_STATES.map((st) => (
            <Fragment key={st}>
              <span className="col-span-2 pt-1 text-[12px] font-bold leading-4 sm:col-span-1 sm:pt-0" style={{ color: rc('fg-neutral', mode) }}>
                {STATE_KO[st]}
              </span>
              {[b, a].map((value) => (
                <div key={value} className="w-[128px] sm:w-[168px]">
                  <S mode={mode} items={items} value={value} states={{ [a]: st }} />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>앞 칸이 그 상태 — 호버는 누름과 같은 바탕(축소 없음) · 누름은 글만 축소 · 링은 칸 바깥 · 고른 채 막히면 회색 칸 + 1px</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 통계 구역을 Segmented 로(나쁜 예) — 구역 이동은 Tabs
function StatsSegScreen({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <Screen title="통계" mode={mode}>
      <Body>
        <S mode={mode} items={STATS_TABS} value="category" />
        <span className="pt-2 text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
          10월 지출
        </span>
        <span className="text-[22px] font-bold tabular-nums" style={{ color: rc('fg-neutral', mode) }}>
          412,300원
        </span>
        <div>
          {[
            ['식비', '44%', '182,400원', 'orange'],
            ['쇼핑', '22%', '89,000원', 'violet'],
            ['카페', '13%', '52,300원', 'brown'],
          ].map(([t, s, a, h]) => (
            <Row key={t} mode={mode} title={t} sub={s} amount={a} hue={h} />
          ))}
        </div>
      </Body>
    </Screen>
  );
}
const RoleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="같은 내용을 다르게 보기 — 가계부 목록을 전체 · 지출 · 수입으로, 그 목록 바로 위에서 바로 거른다">
        <LedgerScreen mode="auto" />
      </Verdict>
      <Verdict ok={false} note="다른 구역으로 옮기기 — 카테고리 · 추이 · 비교는 내용 전체가 바뀌는 구역이라 화면 맨 위 Tabs 다">
        <StatsSegScreen />
      </Verdict>
    </Pair>
  </Panel>
);

// 자리 — 내용 바로 위 하나 · 한 화면에 둘(토스 발견 — 지금 셋이 쌓인 자리)
function DiscoverScreen({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <Screen title="증권" mode={mode}>
      <LineTabsView look={tabsLook()} live={false} mode={mode} size="medium" items={BROKER_TABS} value="toss" />
      <ChipTabsView look={chipTabsLook()} live={false} mode={mode} items={VIEW_TABS} value="discover" />
      <Body top={0}>
        <S mode={mode} items={RANKING} value="rise" />
        <S mode={mode} items={SEG_SETS[2].items} value="domestic" />
        <div>
          {HOLDINGS.filter((x) => x.market === 'domestic').map((x, i) => (
            <Row key={x.name} mode={mode} title={x.name} sub={`${i + 1}위`} amount={x.amount} hue="blue" />
          ))}
        </div>
      </Body>
    </Screen>
  );
}
const PlacementGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="바꾸는 목록 바로 위에 하나 — 무엇을 거르는지 바로 보인다">
        <TodoScreen mode="auto" />
      </Verdict>
      <Verdict ok={false} note="한 화면에 둘(토스 발견) — 어느 것이 어느 내용을 바꾸는지 헷갈린다. 둘째 축은 Chip(하나 고르기) · Select 로">
        <DiscoverScreen />
      </Verdict>
    </Pair>
  </Panel>
);

// 글 — 짧게 · 길어서 두 줄(설정 > 프리셋 정렬)
const PRESETS: [string, string, string, string][] = [
  ['점심 식사', '식비 · 현대카드 M', '12,000원', 'orange'],
  ['아침 커피', '카페 · 현대카드 M', '4,500원', 'brown'],
  ['출퇴근', '교통 · 국민 체크카드', '1,450원', 'blue'],
];
function PresetScreen({ items, mode = 'auto' }: { items: SegItem[]; mode?: Mode }) {
  return (
    <Screen title="프리셋" mode={mode} back>
      <Body>
        <S mode={mode} items={items} value={items[0].value} />
        <div>
          {PRESETS.map(([t, s, a, h]) => (
            <Row key={t} mode={mode} title={t} sub={s} amount={a} hue={h} />
          ))}
        </div>
      </Body>
    </Screen>
  );
}
function RangeScreen({ mode = 'auto' }: { mode?: Mode }) {
  const lk = sl();
  const months = [42, 44, 41, 47, 52, 55];
  return (
    <Screen title="자산 추이" mode={mode} back>
      <Body>
        <S mode={mode} items={ASSET_RANGE} value="6m" />
        <span className="pt-2 text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
          순자산
        </span>
        <span className="text-[22px] font-bold tabular-nums" style={{ color: rc('fg-neutral', mode) }}>
          55,200,000원
        </span>
        <div className="mt-2 flex h-[120px] items-end justify-between" style={{ paddingLeft: lk.item.padX, paddingRight: lk.item.padX }}>
          {months.map((v, i) => (
            <span key={i} className="block w-6 rounded-t-md" style={{ height: v * 2, background: rc(i === months.length - 1 ? 'chart-blue' : 'bg-neutral-weak', mode) }} />
          ))}
        </div>
      </Body>
    </Screen>
  );
}
const LabelGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note='짧은 명사 — "3개월 · 6개월 · 1년" 처럼 한 줄에 들어간다'>
        <RangeScreen />
      </Verdict>
      <Verdict ok={false} note="문장처럼 길게 — 줄이 바뀌어 모든 칸이 높아진다. 이러면 다른 컴포넌트를 쓴다">
        <PresetScreen items={PRESET_SORT_LONG} />
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExBasic: Fig = () => (
  <SegDemoFrame look={sl()}>
    <TodoDemo look={sl()} />
  </SegDemoFrame>
);

export const segmentedControlFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  width: Width,
  states: States,
  'role-guide': RoleGuide,
  'placement-guide': PlacementGuide,
  'label-guide': LabelGuide,
  'ex-basic': ExBasic,
};
