'use client';
// 스펙대로 그린 Scroll Area · Scroll Auto Hide — ScrollAreaLook · AutoHideLook(scroll-area · scroll-auto-hide.yaml 을 푼 값)만 받아 그린다.
// 스크롤바 모양(6px 알약 · 막대 stroke-neutral-solid · 바탕 투명)은 tokens-style 이 YAML 로 깐 .psa 규칙이다 — 여기서는 상자에 이름 · 초점 · 넘침 막기를 단다.
// 숨는 머리는 SEED Breeze ScrollAutoHide 의 동작 — 스크롤 거리 1:1 · 끝나면 50% 로 스냅(200ms enter) · translate3d 로만 옮긴다(높이 그대로) ·
// 모션 줄이기면 끈다 · 숨은 머리 안으로 초점이 오면 다 드러낸다.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { icv, type AutoHideLook, type ScrollAreaLook, type Tones, type ViewMode } from './collapse-shared';
import { useReducedMotion } from './data-card-view';
import { LedgerHeadView, LedgerListView } from './collapse-ledger';
import { HOUR_H } from './collapse-data';

// ── 스크롤 상자 ───────────────────────────────────────────
export type ScrollBoxProps = {
  look: ScrollAreaLook;
  mode?: ViewMode;
  // 이름 — 주면 role=region · tabindex 0 · aria-label(안에 초점 가는 것이 없는 상자)
  label?: string;
  // 시트 · 대화상자 · 팝오버 안 — 끝에 닿아도 뒤 화면이 따라 스크롤되지 않게
  contain?: boolean;
  height?: number | string;
  maxHeight?: number | string;
  // 처음 스크롤 자리
  initialScroll?: number;
  // 멈춘 그림 — 키보드 포커스 링을 그린다
  focused?: boolean;
  onScroll?: (top: number, el: HTMLDivElement) => void;
  boxRef?: (el: HTMLDivElement | null) => void;
  children: ReactNode;
  style?: CSSProperties;
};
export function ScrollBox({ look, mode = 'auto', label, contain = false, height, maxHeight, initialScroll, focused = false, onScroll, boxRef, children, style }: ScrollBoxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current && initialScroll) ref.current.scrollTop = initialScroll;
  }, [initialScroll]);
  // 모드를 정한 그림은 그 모드의 막대 · 링 색(사이트 모드를 따르면 토큰 변수 그대로)
  const vars = mode === 'auto' ? {} : ({ '--psa-thumb': icv(look.bar.thumb, mode), '--psa-ring': icv(look.focus.ring.color, mode) } as CSSProperties);
  return (
    <div
      ref={(el) => {
        ref.current = el;
        boxRef?.(el);
      }}
      className={label ? 'psa psa-region' : 'psa'}
      role={label ? look.focus.role : undefined}
      aria-label={label}
      tabIndex={label ? look.focus.tabIndex : undefined}
      onScroll={onScroll ? (e) => onScroll(e.currentTarget.scrollTop, e.currentTarget) : undefined}
      style={{
        position: 'relative',
        overflowY: 'auto',
        height,
        maxHeight,
        overscrollBehavior: contain ? (look.overscroll as CSSProperties['overscrollBehavior']) : undefined,
        ...(focused ? { outline: `${look.focus.ring.width}px solid ${icv(look.focus.ring.color, mode)}`, outlineOffset: look.focus.ring.offset } : {}),
        ...vars,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── HR 달력 일 보기 — 한 시간 한 줄(HOUR_H — collapse-data) ──────
const EVENTS: [number, number, string, string][] = [
  [9, 10, '클라우드 인프라 점검 회의', 'blue'],
  [10.5, 11.5, '신규 입사자 오리엔테이션', 'green'],
  [13, 14, '데이터 플랫폼 배치 리뷰', 'violet'],
  [15, 18, '김민수 연차(오후 반차)', 'orange'],
  [19, 21, '야간 작업 — 네트워크 장비 교체', 'red'],
];
const hourLabel = (h: number) => (h === 0 ? '오전 12시' : h < 12 ? `오전 ${h}시` : h === 12 ? '오후 12시' : `오후 ${h - 12}시`);
export function DayTimeline({ tones, mode = 'auto' }: { tones: Tones; mode?: ViewMode }) {
  const c = (n: string) => icv(tones[n], mode);
  return (
    <div style={{ position: 'relative', height: 24 * HOUR_H, background: c('bg-layer-default') }}>
      {Array.from({ length: 24 }, (_, h) => (
        <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: h * HOUR_H, height: HOUR_H, borderTop: `1px solid ${c('stroke-neutral-subtle')}` }}>
          <span style={{ position: 'absolute', left: 12, top: 4, fontSize: 12, lineHeight: '16px', color: c('fg-neutral-subtle') }}>{hourLabel(h)}</span>
        </div>
      ))}
      {EVENTS.map(([a, b, t, hue]) => (
        <div key={t} style={{ position: 'absolute', left: 76, right: 12, top: a * HOUR_H + 2, height: (b - a) * HOUR_H - 4, borderRadius: 8, background: c(`chart-${hue}-weak`), borderLeft: `3px solid ${c(`chart-${hue}`)}`, paddingTop: 4, paddingLeft: 10, paddingRight: 8, boxSizing: 'border-box', overflow: 'hidden' }}>
          <span style={{ display: 'block', fontSize: 13, lineHeight: '18px', fontWeight: 600, color: c('fg-neutral') }}>{t}</span>
          <span style={{ display: 'block', fontSize: 12, lineHeight: '16px', color: c('fg-neutral-subtle') }}>
            {hourLabel(Math.floor(a))} ~ {hourLabel(Math.floor(b))}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Scroll Area 플레이그라운드 · 미리보기 ───────────────────
export function ScrollAreaPlay({ look, tones, contrast }: { look: ScrollAreaLook; tones: Tones; contrast: Record<'default' | 'basement' | 'floating', { light: number; dark: number }> }) {
  const [surface, setSurface] = useState<'default' | 'basement' | 'floating'>('default');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [focusable, setFocusable] = useState<'none' | 'inside'>('none');
  const [sheet, setSheet] = useState<'on' | 'off'>('on');
  const [focused, setFocused] = useState(false);
  const [outerMoved, setOuterMoved] = useState(0);
  const outer = useRef<HTMLDivElement>(null);
  const lastOuter = useRef(0);
  const bg = look.surfaces[surface];
  const name = '10월 9일 일정';
  const seg = <T extends string>(label: string, value: T, options: [T, string][], on: (v: T) => void) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-fd-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(([v, t]) => (
          <button key={v} type="button" aria-pressed={v === value} onClick={() => on(v)} className={`rounded-md border px-2.5 py-1 text-[12px] ${v === value ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent'}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
  const inner = (
    <ScrollBox look={look} mode={mode} label={focusable === 'none' ? name : undefined} contain={sheet === 'on'} height={260} initialScroll={HOUR_H * 8} style={{ borderRadius: 12, background: icv(bg, mode) }}>
      <div>
        <DayTimeline tones={tones} mode={mode} />
        {focusable === 'inside' && (
          <div style={{ display: 'flex', gap: 8, padding: 12, background: icv(bg, mode) }}>
            <button type="button" className="rounded-md border px-3 py-1.5 text-[13px]" style={{ color: icv(tones['fg-neutral'], mode), borderColor: icv(tones['stroke-neutral-weak'], mode) }}>
              일정 추가
            </button>
          </div>
        )}
      </div>
    </ScrollBox>
  );
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div
        ref={outer}
        className="psa"
        onScroll={(e) => {
          const t = e.currentTarget.scrollTop;
          setOuterMoved((m) => m + Math.abs(t - lastOuter.current));
          lastOuter.current = t;
        }}
        style={{ height: 420, overflowY: 'auto', background: icv(tones['bg-layer-basement'], mode), ['--psa-thumb' as string]: icv(look.bar.thumb, mode) } as CSSProperties}
      >
        {/* 뒤 화면(또는 시트 본문) — 상자 위아래로 넘쳐 스크롤된다 */}
        <div style={{ padding: 24, minHeight: 640 }}>
          <div style={{ maxWidth: 420, margin: '0 auto', padding: sheet === 'on' ? 20 : 0, borderRadius: 24, background: sheet === 'on' ? icv(look.surfaces.floating, mode) : 'transparent' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: icv(tones['fg-neutral'], mode), marginBottom: 12 }}>{sheet === 'on' ? '시트 — 10월 9일 (금)' : '화면 — 10월 9일 (금)'}</div>
            <div onFocus={(e) => setFocused(e.target === e.currentTarget.firstElementChild)} onBlur={() => setFocused(false)}>
              {inner}
            </div>
            <div style={{ height: 260, marginTop: 12, borderRadius: 12, background: icv(tones['bg-neutral-weak'], mode) }} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-fd-border bg-fd-card px-5 py-3 text-[12.5px] leading-[18px] text-fd-muted-foreground">
        <span>
          <b className="text-fd-foreground">막대 대비</b> {surface === 'default' ? '흰 면' : surface === 'basement' ? '바닥' : '떠 있는 표면'} 위 {contrast[surface][mode].toFixed(2)}(3 이상)
        </span>
        <span>
          <b className="text-fd-foreground">읽기</b> {focusable === 'none' ? (focused ? `${name}, 스크롤 영역` : `상자에 Tab — "${name}, 스크롤 영역"`) : '상자는 초점을 받지 않는다 — 안의 단추에 Tab'}
        </span>
        <span>
          <b className="text-fd-foreground">뒤 화면</b> {sheet === 'on' ? `contain — 상자 끝에서 따라오지 않는다(움직인 거리 ${Math.round(outerMoved)}px)` : `따라 움직였다 ${Math.round(outerMoved)}px`}
        </span>
        <button type="button" onClick={() => (setOuterMoved(0), outer.current?.scrollTo({ top: 0 }))} className="rounded-md border border-fd-border bg-fd-background px-2 py-0.5 text-[12px] text-fd-foreground">
          ↺ 다시 재기
        </button>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">
        {seg('놓인 면', surface, [['default', '흰 면'], ['basement', '바닥'], ['floating', '떠 있는 표면']], setSurface)}
        {seg('모드', mode, [['light', '라이트'], ['dark', '다크']], setMode)}
        {seg('안에 초점 가는 것', focusable, [['none', '없음 — 상자가 초점 · 이름'], ['inside', '있음 — 단추']], setFocusable)}
        {seg('시트 안', sheet, [['on', '예 — contain'], ['off', '아니오 — 화면']], (v) => (setSheet(v), setOuterMoved(0)))}
      </div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{`import { ScrollArea } from "@/components/ui/scroll-area"\n\n<ScrollArea${focusable === 'none' ? ` label="${name}"` : ''}${sheet === 'on' ? ' contain' : ''} className="h-[260px]">\n  {dayTimeline}\n</ScrollArea>`}</code>
      </pre>
    </div>
  );
}

// 초점을 받는 상자 — ↓ 로 스크롤 · 읽기
export function FocusRegionDemo({ look, tones, name = '10월 9일 일정' }: { look: ScrollAreaLook; tones: Tones; name?: string }) {
  const [focused, setFocused] = useState(false);
  const [top, setTop] = useState(HOUR_H * 8);
  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: 360 }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
        <ScrollBox look={look} label={name} height={300} initialScroll={HOUR_H * 8} onScroll={(t) => setTop(t)} style={{ borderRadius: 12 }}>
          <DayTimeline tones={tones} />
        </ScrollBox>
      </div>
      <p className="m-0 text-center text-[12.5px] leading-[18px] text-fd-muted-foreground">
        상자를 눌러 초점을 두고 ↑ ↓ · PageUp · PageDown · Home · End — {focused ? `읽기 "${name}, 스크롤 영역"` : 'Tab 으로 상자에'} · 지금 {hourLabel(Math.min(23, Math.round(top / HOUR_H)))}부터
      </p>
    </div>
  );
}

// ── Scroll Auto Hide ──────────────────────────────────────
type AHApi = { downUp: () => void; focusHidden: () => void; top: () => void };
type AHInfo = { hidden: number; head: number; list: number; box: number; snapped: string };
const AHContext = createContext<{ reduce: boolean; setApi: (a: AHApi) => void; setInfo: (i: AHInfo) => void } | null>(null);

// 숨는 머리 + 원장 목록. frozen 이면 멈춘 그림(그 스크롤 · 숨은 높이로)
// frozen.hidden — 숫자(px) · 'all'(머리 높이만큼 다 숨음) · { fromAll: n }(다 숨은 뒤 n 만큼 올림 — 머리 높이 − n)
export type AHFrozen = { scroll: number; hidden: number | 'all' | { fromAll: number }; focusSummary?: boolean };
export function AutoHideLedger({ look, tones, mode = 'auto', reduce: reduceProp, frozen, header, listLimit, measureId, marks }: { look: AutoHideLook; tones: Tones; mode?: ViewMode; reduce?: boolean; frozen?: AHFrozen; header?: ReactNode; listLimit?: number; measureId?: string; marks?: { box?: CSSProperties; head?: CSSProperties } }) {
  const ctx = useContext(AHContext);
  const sysReduce = useReducedMotion();
  const reduce = reduceProp ?? ctx?.reduce ?? sysReduce;
  const box = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(typeof frozen?.hidden === 'number' ? frozen.hidden : 0);
  const [snapping, setSnapping] = useState(false);
  const hiddenRef = useRef(typeof frozen?.hidden === 'number' ? frozen.hidden : 0);
  const last = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const [snapped, setSnapped] = useState('—');
  const H = () => head.current?.offsetHeight ?? 0;
  const apply = (v: number, snap = false) => {
    hiddenRef.current = v;
    setSnapping(snap);
    setHidden(v);
  };
  const report = useCallback(() => {
    const b = box.current;
    const h = H();
    if (!b) return;
    ctx?.setInfo({ hidden: Math.round(hiddenRef.current), head: h, list: Math.round(b.clientHeight - (h - hiddenRef.current)), box: b.clientHeight, snapped });
  }, [ctx, snapped]);
  // 멈춘 그림 — 그 스크롤 자리 · 숨은 높이(머리 높이는 그린 뒤 잰다)
  const fScroll = frozen?.scroll;
  const fHidden = frozen ? JSON.stringify(frozen.hidden) : undefined;
  useEffect(() => {
    const b = box.current;
    if (!b || fScroll === undefined || fHidden === undefined) return;
    b.scrollTop = fScroll;
    last.current = fScroll;
    const fh = JSON.parse(fHidden) as AHFrozen['hidden'];
    const h = H();
    apply(fh === 'all' ? h : typeof fh === 'number' ? fh : Math.max(0, h - fh.fromAll));
  }, [fScroll, fHidden]);
  // 모션 줄이기면 끈다 — 머리는 늘 보인다
  useEffect(() => {
    if (reduce) apply(0);
  }, [reduce]);
  useEffect(() => {
    report();
  });
  const onScroll = () => {
    const b = box.current;
    if (!b || frozen) return;
    const t = b.scrollTop;
    const d = t - last.current;
    last.current = t;
    if (reduce) return;
    const h = H();
    // 스크롤 거리를 그대로 따라간다(맨 위면 다 드러남)
    apply(t <= 0 ? 0 : Math.min(h, Math.max(0, hiddenRef.current + d)));
    window.clearTimeout(timer.current);
    // 스크롤이 끝나면 영역 높이의 절반을 기준으로 다 숨거나 다 드러난다
    timer.current = window.setTimeout(() => {
      const hh = H();
      const v = hiddenRef.current;
      if (v > 0 && v < hh) {
        const toHide = v > hh * look.threshold && b.scrollTop > hh;
        setSnapped(toHide ? `${Math.round(v)}px 숨어 ${look.threshold * 100}% 넘음 → 다 숨김` : `${Math.round(v)}px 숨어 ${look.threshold * 100}% 아래 → 다 드러남`);
        apply(toHide ? hh : 0, true);
      }
    }, 120);
  };
  const reveal = () => apply(0, true);
  useEffect(() => {
    ctx?.setApi({
      downUp: () => {
        const b = box.current;
        if (!b) return;
        b.scrollTo({ top: 900, behavior: reduce ? 'auto' : 'smooth' });
        window.setTimeout(() => b.scrollTo({ top: 740, behavior: reduce ? 'auto' : 'smooth' }), 1100);
      },
      focusHidden: () => head.current?.querySelector<HTMLElement>('[data-ledger="summary"]')?.focus(),
      top: () => box.current?.scrollTo({ top: 0 }),
    });
  });
  const live = !frozen;
  return (
    <div ref={box} className="psa" onScroll={onScroll} data-autohide-box="" style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: icv(tones['bg-layer-default'], mode), ['--psa-thumb' as string]: mode === 'auto' ? undefined : icv(tones['fg-neutral-subtle'], mode), ...marks?.box } as CSSProperties}>
      <div
        ref={head}
        data-autohide-head=""
        data-measure={measureId}
        // 숨은 머리 안으로 초점이 오면 바로 다 드러낸다
        onFocus={live ? reveal : undefined}
        style={{
          position: look.position as CSSProperties['position'],
          top: look.top,
          zIndex: look.z,
          background: icv(look.bg, mode),
          transform: `translate3d(0, ${-hidden}px, 0)`,
          transitionProperty: 'transform',
          transitionDuration: snapping ? look.snap.duration : '0ms',
          transitionTimingFunction: look.snap.easing,
          willChange: 'transform',
          ...marks?.head,
        }}
      >
        {header ?? <LedgerHeadView tones={tones} mode={mode} live={live} marks={frozen?.focusSummary ? { summary: { outline: `2px solid ${icv(tones['stroke-focus-ring'], mode)}`, outlineOffset: 2 } } : undefined} />}
      </div>
      <LedgerListView tones={tones} mode={mode} limit={listLimit} />
    </div>
  );
}

// 플레이그라운드 — 같은 상태를 폰 안의 원장(AutoHideLedger)과 아래 조작 줄(AutoHideControls)이 함께 쓴다
export function AutoHideProvider({ children, reduce }: { children: ReactNode; reduce?: boolean }) {
  const [r, setR] = useState(!!reduce);
  const api = useRef<AHApi | null>(null);
  const [info, setInfo] = useState<AHInfo | null>(null);
  return (
    <AHControls.Provider value={{ reduce: r, setReduce: setR, api, info }}>
      <AHContext.Provider value={{ reduce: r, setApi: (a) => (api.current = a), setInfo: (i) => setInfo((p) => (p && p.hidden === i.hidden && p.list === i.list && p.head === i.head && p.snapped === i.snapped ? p : i)) }}>{children}</AHContext.Provider>
    </AHControls.Provider>
  );
}
const AHControls = createContext<{ reduce: boolean; setReduce: (v: boolean) => void; api: { current: AHApi | null }; info: AHInfo | null } | null>(null);
export function AutoHideControls({ snapLabel }: { snapLabel: string }) {
  const c = useContext(AHControls);
  if (!c) return null;
  const btn = 'rounded-md border border-fd-border bg-fd-background px-2.5 py-1 text-[12px] font-medium text-fd-foreground hover:bg-fd-accent';
  return (
    <div className="flex w-full max-w-[520px] flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => c.api.current?.downUp()}>
          ▼ 내렸다 조금 올리기
        </button>
        <button type="button" className={btn} onClick={() => c.api.current?.focusHidden()}>
          ⇥ 숨은 머리로 초점 옮기기
        </button>
        <button type="button" className={btn} onClick={() => c.api.current?.top()}>
          ↺ 맨 위로
        </button>
        <label className="flex items-center gap-1.5 text-[12px] text-fd-foreground">
          <input type="checkbox" checked={c.reduce} onChange={(e) => c.setReduce(e.target.checked)} /> 모션 줄이기
        </label>
      </div>
      <div className="text-[12.5px] leading-[18px] text-fd-muted-foreground">
        {c.info ? (
          <>
            <b className="text-fd-foreground">숨은 높이</b> {c.info.hidden}px / 머리 {c.info.head}px · <b className="text-fd-foreground">목록이 보이는 높이</b> {c.info.list}px / 상자 {c.info.box}px
            {c.reduce ? ' · 모션 줄이기 — 머리는 늘 보인다' : ` · ${snapLabel} · 마지막 스냅: ${c.info.snapped}`}
          </>
        ) : (
          '—'
        )}
      </div>
    </div>
  );
}
