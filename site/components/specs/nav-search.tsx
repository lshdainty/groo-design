// 거래 검색 · 카드 혜택 화면의 그림(서버) — 상단 바는 top-navigation.yaml(검색칸 searchField — Text Field outline medium),
// 거르는 줄은 Scroll Auto Hide(scroll-auto-hide.yaml — 1:1 · 50% 스냅)다(2026-10-16 사용자 결정 Q-017-3a C · Q-017-5 C).
// 칩은 chip.yaml(chipLook), 검색칸은 input.yaml(textFieldLook). 글 · 이름은 지어낸 것이다.
import type { ReactNode } from 'react';
import { chipLook } from './chip-look';
import { ChipView } from './chip-view';
import { textFieldLook } from './text-field-look';
import { TfInputView } from './text-field-view';
import { Bar, NPhone, SearchBox } from './nav-screens';
import { Row, rc, type Mode } from './kit';

export const SEARCH_ROW_H = 40;
export const CARD_ROW_H = 140;
// 거래 검색 결과 — 가장 긴 가맹점 이름은 줄을 넘긴다(말줄임)
const RESULTS: [string, string, string, string][] = [
  ['지어낸마트 장보기', '식비 · 10월 3일', '−42,300원', 'orange'],
  ['지어낸마트 환불', '식비 · 10월 5일', '+12,000원', 'green'],
  ['지어낸마트 정기 배송', '생활 · 10월 9일', '−18,900원', 'blue'],
  ['지어낸마트 월간 정기 결제 환불 확인', '식비 · 10월 12일', '+8,800원', 'violet'],
];
const CARDS: [string, string, string][] = [
  ['지어낸카드 플러스', '할인 · 연회비 1만원', 'blue'],
  ['지어낸카드 포인트', '포인트 · 연회비 없음', 'green'],
  ['지어낸카드 캐시백', '캐시백 · 연회비 2만원', 'orange'],
  ['지어낸카드 프리미엄 체크', '할인 · 연회비 없음', 'violet'],
];

function Chips({ mode, items, on, size = 'small' }: { mode: Mode; items: string[]; on: string; size?: 'small' | 'medium' }) {
  const c = chipLook();
  return (
    <span className="flex items-center" style={{ gap: c.group.gap }}>
      {items.map((t) => (
        <ChipView key={t} look={c} mode={mode} variant="solid" size={size} selected={t === on} state="enabled" label={t} />
      ))}
    </span>
  );
}
// 거래 검색의 거르는 줄 — 전체 · 지출 · 수입(칩 small 32) · 줄 40 · 좌우 화면 여백 24
export function SearchFilterRow({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div className="flex items-center" style={{ height: SEARCH_ROW_H, paddingLeft: 24, paddingRight: 24, background: rc('bg-layer-default', mode) }}>
      <Chips mode={mode} items={['전체', '지출', '수입']} on="전체" />
    </div>
  );
}
// 카드 혜택의 거르는 줄 140 — 카드 이름 검색칸(40) + 칩 두 줄(36)
export function CardFilterRow({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div className="flex flex-col justify-between" style={{ height: CARD_ROW_H, boxSizing: 'border-box', padding: '8px 24px 4px', background: rc('bg-layer-default', mode) }}>
      <TfInputView look={textFieldLook().input} mode={mode} size="medium" state="enabled" placeholder="카드 이름 검색" prefixIcon="search" ariaLabel="카드 이름 검색" width="100%" />
      <Chips mode={mode} items={['신용', '체크']} on="신용" size="medium" />
      <Chips mode={mode} items={['전체', '할인', '포인트', '캐시백']} on="전체" size="medium" />
    </div>
  );
}
export function ResultRows({ mode = 'auto', n = 12 }: { mode?: Mode; n?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24 }}>
      {Array.from({ length: n }, (_, i) => {
        const [t, s, a, hue] = RESULTS[i % RESULTS.length];
        return <Row key={i} mode={mode} title={t} sub={s} amount={a} hue={hue} />;
      })}
    </div>
  );
}
function CardRows({ mode = 'auto', n = 12 }: { mode?: Mode; n?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24 }}>
      {Array.from({ length: n }, (_, i) => {
        const [t, s, hue] = CARDS[i % CARDS.length];
        return <Row key={i} mode={mode} title={t} sub={s} hue={hue} />;
      })}
    </div>
  );
}
// 거래 검색의 상단 바 — ← · 제목 자리 검색칸 · 고급 필터
export function SearchBar({ mode = 'auto', value = '지어낸마트' }: { mode?: Mode; value?: string }) {
  return <Bar mode={mode} search={<SearchBox mode={mode} value={value} />} actions={[{ icon: 'sliders', label: '고급 필터' }]} />;
}
// 스크롤 상자 — 목록은 거르는 줄 아래에서 시작해 scroll 만큼 올라가고, 숨는 줄은 맨 위(sticky top 0)에서 hidden 만큼 위로 옮겨 숨는다
export function FilterScroll({ mode = 'auto', row, rowH, scroll, hidden, children }: { mode?: Mode; row: ReactNode; rowH: number; scroll: number; hidden: number; children: ReactNode }) {
  return (
    <div className="relative h-full overflow-hidden" style={{ background: rc('bg-layer-default', mode) }}>
      <div style={{ transform: `translateY(${rowH - scroll}px)` }}>{children}</div>
      <div className="absolute left-0 right-0 top-0" style={{ transform: `translateY(${-hidden}px)`, zIndex: 2 }}>
        {row}
      </div>
    </div>
  );
}
export function SearchPhone({ mode = 'auto', scroll = 0, hidden = 0, scale = 0.5, h = 640, value }: { mode?: Mode; scroll?: number; hidden?: number; scale?: number; h?: number; value?: string }) {
  return (
    <NPhone mode={mode} scale={scale} h={h} bar={<SearchBar mode={mode} value={value} />}>
      <FilterScroll mode={mode} row={<SearchFilterRow mode={mode} />} rowH={SEARCH_ROW_H} scroll={scroll} hidden={hidden}>
        <ResultRows mode={mode} n={14} />
      </FilterScroll>
    </NPhone>
  );
}
export function CardBenefitPhone({ mode = 'auto', scroll = 0, hidden = 0, scale = 0.5, h = 640 }: { mode?: Mode; scroll?: number; hidden?: number; scale?: number; h?: number }) {
  return (
    <NPhone mode={mode} scale={scale} h={h} bar={<Bar mode={mode} title="카드 혜택" />}>
      <FilterScroll mode={mode} row={<CardFilterRow mode={mode} />} rowH={CARD_ROW_H} scroll={scroll} hidden={hidden}>
        <CardRows mode={mode} n={14} />
      </FilterScroll>
    </NPhone>
  );
}
