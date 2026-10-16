'use client';
// 폰 가계부 원장 — 머리(월 이동 · 총액 · 소비 요약 · 주 달력 / 월 달력)와 거래 40줄. Collapsible 의 "원장 머리"(소비 요약 ↔ 월 달력 하나만)와
// Scroll Auto Hide(머리가 스크롤에 숨는다)가 같이 쓴다. 화면 예시라 글자 크기는 그림 안에서 정하고, 색은 역할 색(screenTones)이다.
// 소비 요약 · 월 달력은 원장 머리의 단추다 — 이름 고정 + aria-expanded(collapsible.md "원장 머리").
import type { CSSProperties, ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from 'lucide-react';
import { LEDGER40, LEDGER_TOTAL, dayTotal, type LedgerDay } from './collapse-data';
import { tc, won, type Tones, type ViewMode } from './collapse-shared';

const DOW = ['일', '월', '화', '수', '목', '금', '토'];
// 10월 — 1일이 목요일(2026)
const MONTH: (number | null)[] = [null, null, null, null, 1, 2, 3, ...Array.from({ length: 28 }, (_, i) => i + 4), null, null, null, null];
const WEEK = [4, 5, 6, 7, 8, 9, 10];
const TODAY = 8;
// 날짜별 쓴 돈(원장 40줄에서) — 10월 1일 ~ 8일
const SPENT: Record<number, number> = Object.fromEntries(
  LEDGER40.map((d) => [Number(/10월 (\d+)일/.exec(d.label)?.[1] ?? 0), dayTotal(d)]).filter(([day]) => day > 0),
);

function IconBtn({ children, label, tones, mode, live }: { children: ReactNode; label: string; tones: Tones; mode: ViewMode; live: boolean }) {
  return (
    <button type="button" aria-label={label} tabIndex={live ? undefined : -1} style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, padding: 0, borderWidth: 0, borderRadius: 10, background: 'transparent', color: tc(tones, 'fg-neutral', mode), cursor: live ? 'pointer' : 'default' }}>
      {children}
    </button>
  );
}

export type LedgerHeadProps = {
  tones: Tones;
  mode?: ViewMode;
  summaryOpen?: boolean;
  calendarOpen?: boolean;
  live?: boolean;
  onSummary?: () => void;
  onCalendar?: () => void;
  // 그림 표시 — 부위마다
  marks?: Partial<Record<'summary' | 'calendar', CSSProperties>>;
};

export function LedgerHeadView({ tones, mode = 'auto', summaryOpen = false, calendarOpen = false, live = false, onSummary, onCalendar, marks }: LedgerHeadProps) {
  const c = (n: string) => tc(tones, n, mode);
  const cell = (n: number | null, i: number) => {
    const today = n === TODAY;
    const future = n !== null && n > TODAY;
    const spent = n !== null ? SPENT[n] : undefined;
    return (
      <span key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingTop: 4, paddingBottom: 4, minWidth: 0, lineHeight: '13px' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 9999, fontSize: 14, lineHeight: '28px', fontWeight: 700, background: today ? c('bg-brand-solid') : 'transparent', color: today ? c('static-white') : future ? c('fg-disabled') : n === null ? 'transparent' : c('fg-neutral') }}>{n ?? ''}</span>
        <span style={{ height: 13, fontSize: 9, lineHeight: '13px', color: c('fg-critical'), whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', fontVariantNumeric: 'tabular-nums' }}>{spent ? Math.round(-spent / 1000).toLocaleString('ko-KR') + '천' : ''}</span>
      </span>
    );
  };
  return (
    <div style={{ background: c('bg-layer-default') }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 44, paddingLeft: 16, paddingRight: 12, boxSizing: 'border-box' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 19, fontWeight: 700, color: c('fg-neutral') }}>
          <ChevronLeft aria-hidden size={18} />
          10월
          <ChevronRight aria-hidden size={18} />
        </span>
        <span style={{ display: 'flex', gap: 4 }}>
          <IconBtn label="필터" tones={tones} mode={mode} live={live}>
            <SlidersHorizontal aria-hidden size={20} />
          </IconBtn>
          <IconBtn label="거래 추가" tones={tones} mode={mode} live={live}>
            <Plus aria-hidden size={20} />
          </IconBtn>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 6, paddingRight: 24, paddingBottom: 16, paddingLeft: 24 }}>
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 24, lineHeight: '32px', fontWeight: 700, color: c('fg-neutral'), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{won(LEDGER_TOTAL)}</span>
          <span style={{ fontSize: 12.5, lineHeight: '18px', color: c('fg-neutral-subtle') }}>지난달보다 1억 2,345만 원 더 쓰는 중</span>
        </span>
        <button
          type="button"
          aria-expanded={summaryOpen}
          tabIndex={live ? undefined : -1}
          onClick={live ? onSummary : undefined}
          data-ledger="summary"
          style={{ flexShrink: 0, height: 40, paddingLeft: 14, paddingRight: 14, borderRadius: 9999, borderWidth: 1, borderStyle: 'solid', borderColor: c('stroke-neutral-weak'), background: summaryOpen ? c('bg-neutral-weak') : 'transparent', fontSize: 13, fontWeight: 700, color: c('fg-neutral'), cursor: live ? 'pointer' : 'default', ...marks?.summary }}
        >
          소비 요약
        </button>
      </div>
      {summaryOpen && (
        <div style={{ marginLeft: 24, marginRight: 24, marginBottom: 12, padding: 16, borderRadius: 16, background: c('bg-layer-basement') }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: c('fg-neutral'), marginBottom: 10 }}>10월 소비 요약</span>
          {(
            [
              ['주거', 'indigo', 92],
              ['식비', 'orange', 4],
              ['쇼핑', 'pink', 3],
            ] as const
          ).map(([k, hue, p]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, lineHeight: '22px', color: c('fg-neutral-muted') }}>
              <span style={{ width: 28 }}>{k}</span>
              <span style={{ flex: 1, height: 8, borderRadius: 9999, background: c('bg-neutral-weak'), overflow: 'hidden' }}>
                <span style={{ display: 'block', width: `${p}%`, height: '100%', background: c(`chart-${hue}`) }} />
              </span>
              <span style={{ width: 30, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p}%</span>
            </span>
          ))}
        </div>
      )}
      <div style={{ paddingLeft: 16, paddingRight: 16, ...marks?.calendar }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', paddingTop: 4, paddingBottom: 2 }}>
          {DOW.map((d) => (
            <span key={d} style={{ textAlign: 'center', fontSize: 12, lineHeight: '18px', color: d === '일' ? c('fg-critical') : c('fg-neutral-subtle') }}>
              {d}
            </span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>{(calendarOpen ? MONTH : WEEK).map(cell)}</div>
        <button
          type="button"
          aria-label="월 달력"
          aria-expanded={calendarOpen}
          tabIndex={live ? undefined : -1}
          onClick={live ? onCalendar : undefined}
          data-ledger="calendar"
          style={{ display: 'grid', placeItems: 'center', width: '100%', height: 28, padding: 0, borderWidth: 0, background: 'transparent', color: c('fg-neutral-subtle'), cursor: live ? 'pointer' : 'default' }}
        >
          <ChevronDown aria-hidden size={20} style={{ transform: calendarOpen ? 'rotate(180deg)' : 'none' }} />
        </button>
      </div>
      <div style={{ height: 8, background: c('bg-layer-basement') }} />
    </div>
  );
}

export function LedgerListView({ tones, mode = 'auto', days = LEDGER40, limit }: { tones: Tones; mode?: ViewMode; days?: LedgerDay[]; limit?: number }) {
  const c = (n: string) => tc(tones, n, mode);
  let left = limit ?? Infinity;
  return (
    <div style={{ background: c('bg-layer-default'), paddingBottom: 16 }}>
      {days.map((d) => {
        if (left <= 0) return null;
        const rows = d.rows.slice(0, left);
        left -= rows.length;
        return (
          <div key={d.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: 12, paddingRight: 24, paddingBottom: 4, paddingLeft: 24, fontSize: 13, color: c('fg-neutral-subtle') }}>
              <span>{d.label}</span>
              <b style={{ color: c('fg-critical'), whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{won(dayTotal(d))}</b>
            </div>
            {rows.map((r, i) => (
              <div key={i} data-ledger-row="" style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, paddingRight: 24, paddingBottom: 10, paddingLeft: 24 }}>
                <span aria-hidden style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: c(`chart-${r.hue}-weak`) }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 15, lineHeight: '21px', fontWeight: 700, color: c('fg-neutral') }}>{r.title}</span>
                  <span style={{ display: 'block', fontSize: 12, lineHeight: '17px', color: c('fg-neutral-subtle') }}>{r.sub}</span>
                </span>
                <b style={{ fontSize: 15, color: c('fg-neutral'), whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{won(r.amount)}</b>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
