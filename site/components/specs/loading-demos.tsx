'use client';
// 기다림 묶음의 실제로 움직이는 미리보기 — 각 페이지의 코드 절(ex-*)과 당겨서 새로 고침 그림이 쓴다.
// 면 · 원 · 막대 · 흐림 · 대체 그림은 YAML 대로(loading-view), 목록 줄은 list.yaml(ListView), 결과는 result-section.yaml,
// 스낵바는 snackbar.yaml, 버튼은 button.yaml 그대로다. 미리보기 밖의 조작 버튼은 사이트 모양이다(제품 화면이 아니다).
// 저절로 시작하지 않는다 — 처음 모습은 다 불러온 화면이고, 조작 버튼을 누르면 시간표(1초 · 5초 · 10초)대로 흐른다.
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Search } from 'lucide-react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import type { ChipLook } from './chip-shared';
import { ChipGroupView, ChipView } from './chip-view';
import type { ResultSectionLook, SnackbarLook } from './feedback-shared';
import { ResultSectionView, SnackbarRegion, useSnackbarHost } from './feedback-view';
import type { ListLook } from './list-shared';
import { ListView } from './list-view';
import { CATEGORY, FILTER_CHIPS, MONTH_STATS, TERMS, TX } from './loading-data';
import { FONT, lcv, phaseAt, type LdScreen, type LdTone, type LoadingKit, type RowDims, type SkeletonLook, type ViewMode } from './loading-shared';
import { ProgressCircleView, ScrollFogView, SkeletonRowsView, SkeletonView, SlowTextView } from './loading-view';
import type { OvKit } from './overlay-shared';
import { DemoFrame, ResponsiveLayer } from './overlay-demos';
import { useReducedMotion } from './overlay-view';

const tone = (s: LdScreen, n: LdTone, mode: ViewMode) => lcv(s[n], mode);
// 좁은 화면 — 메타를 카테고리만(식비 · 카페)
const compactRows = (rows: typeof TX) => rows.map((r) => (r.detail ? { ...r, detail: r.detail.split(' · ')[0] } : r));
// 목록 줄의 치수 — list.yaml 의 줄(ListLook 에서)
export function dimsOf(list: ListLook): RowDims {
  const f = list.faces.none.light.enabled;
  const titleLh = parseFloat(f.title.lineHeight ?? f.title.fontSize);
  const detailLh = parseFloat(f.detail.lineHeight ?? f.detail.fontSize);
  return { padY: f.pad.y, padX: f.pad.x, avatar: f.tile.size, prefixGap: f.prefix.padRight, bodyGap: f.body.gap, suffixGap: f.body.padRight, titleLh, detailLh, height: f.pad.y * 2 + Math.max(f.tile.size, titleLh + f.body.gap + detailLh) };
}

// ── 판 · 조작 ─────────────────────────────────────────────
export function Board({ children, w = 400 }: { children: ReactNode; w?: number }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto flex w-full flex-col gap-3" style={{ maxWidth: w }}>
          {children}
        </div>
      </div>
    </figure>
  );
}
// 사이트 조작 버튼(제품 화면이 아니다)
export function Ctl({ children, onClick, pressed, disabled }: { children: ReactNode; onClick: () => void; pressed?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors disabled:opacity-40 ${pressed ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent'}`}
    >
      {children}
    </button>
  );
}
export const CtlRow = ({ children, note }: { children: ReactNode; note?: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {children}
    {note && <span className="ml-auto text-[12px] tabular-nums text-fd-muted-foreground">{note}</span>}
  </div>
);
// 흰 카드(화면의 묶음) — 제목은 틀이라 처음부터 그린다
// 흰 카드 — card.yaml 의 면(흰 면 + 1px stroke-neutral-weak · 모서리 16 · 그림자 없음, 값은 screen.card). 제목이 있으면 목록 카드 —
// 머리 위 24 · 좌우 24 · 아래 4, 줄이 제 좌우 24 를 가지고 카드 아래 12. 머리 없는 목록 카드는 위도 12. 글 카드(body content)는 여백 24
export function DemoCard({ screen, mode = 'auto', title, right, children, style, body }: { screen: LdScreen; mode?: ViewMode; title?: ReactNode; right?: ReactNode; children?: ReactNode; style?: CSSProperties; body?: 'list' | 'content' }) {
  const c = screen.card;
  const list = (body ?? 'list') === 'list';
  const pad: CSSProperties = list
    ? { paddingTop: title !== undefined ? 0 : c.listBottom, paddingRight: 0, paddingBottom: c.listBottom, paddingLeft: 0 }
    : { paddingTop: c.pad, paddingRight: c.pad, paddingBottom: c.pad, paddingLeft: c.pad };
  return (
    <div style={{ boxSizing: 'border-box', borderRadius: c.radius, background: tone(screen, 'bg-layer-default', mode), borderWidth: c.borderW, borderStyle: 'solid', borderColor: tone(screen, 'stroke-neutral-weak', mode), overflow: 'hidden', fontFamily: FONT, ...pad, ...style }}>
      {title !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: c.head.gap, minHeight: 24, paddingTop: list ? c.head.top : 0, paddingRight: list ? c.head.x : 0, paddingBottom: c.head.bottom, paddingLeft: list ? c.head.x : 0 }}>
          <span style={{ fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: tone(screen, 'fg-neutral', mode) }}>{title}</span>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
// 카드를 놓는 회색 바닥 — 화면 끝 24 · 카드 사이 8(card.yaml root.gap)
const floorStyle = (screen: LdScreen, mode: ViewMode): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap: 8, background: tone(screen, 'bg-layer-basement', mode), borderRadius: 20, paddingTop: screen.card.pad, paddingRight: screen.card.pad, paddingBottom: screen.card.pad, paddingLeft: screen.card.pad });

// ── 기다리는 영역의 시계 — 시작하면 0.1초마다 센다, 다 오거나(loadAt) 요청 제한(timeout)이면 멈춘다 ─────────
export type WaitStatus = 'idle' | 'quiet' | 'waiting' | 'slow' | 'done' | 'failed';
export function useWaitClock(region: SkeletonLook['region']) {
  const [run, setRun] = useState<{ t0: number; loadAt: number | null } | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!run) return;
    const id = window.setInterval(() => {
      const t = performance.now();
      setNow(t);
      const e = t - run.t0;
      if ((run.loadAt !== null && e >= run.loadAt) || e >= region.timeout) window.clearInterval(id);
    }, 100);
    return () => window.clearInterval(id);
  }, [run, region.timeout]);
  const elapsed = run ? Math.max(0, now - run.t0) : 0;
  const status: WaitStatus = !run ? 'idle' : run.loadAt !== null && run.loadAt < region.timeout && elapsed >= run.loadAt ? 'done' : phaseAt(region, elapsed);
  const start = (loadAt: number | null) => {
    const t = performance.now();
    setNow(t);
    setRun({ t0: t, loadAt });
  };
  return { status, elapsed, start, reset: () => setRun(null), running: !!run && status !== 'done' && status !== 'failed' };
}
// 화면의 상태 글 하나 — 1초에 "불러오는 중…", 5초에 "평소보다 오래 걸리고 있어요." 를 한 번씩, 다 오면 비운다
export function StatusText({ status }: { status: WaitStatus }) {
  const msg = status === 'waiting' ? '불러오는 중…' : status === 'slow' ? '평소보다 오래 걸리고 있어요.' : '';
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {msg}
    </span>
  );
}
// 내용으로 바뀜 — 투명도 0 → 1(skeleton.yaml motion "내용으로 바뀜"), 모션 줄이기면 바로
export function Reveal({ kit, children }: { kit: LoadingKit; children: ReactNode }) {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const m = kit.skeleton.motion.reveal;
  return <div style={{ opacity: on || reduce ? 1 : 0, transition: reduce ? undefined : `opacity ${m.duration} ${m.easing}` }}>{children}</div>;
}
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}초`;
const STATUS_KO: Record<WaitStatus, string> = { idle: '다 불러왔다', quiet: '틀만 — 자리는 지킨다', waiting: '스켈레톤', slow: '+ 오래 걸림 글', done: '다 왔다 — 내용', failed: '요청 제한 — 실패' };

// ── Skeleton — 최근 거래(ex-list) ──────────────────────────
const LOADS: [string, number | null][] = [
  ['0.6초에 옴', 600],
  ['3초에 옴', 3000],
  ['7초에 옴', 7000],
  ['오지 않음', null],
];
export function SkeletonListDemo({ kit, screen, result, list, mode = 'auto' }: { kit: LoadingKit; screen: LdScreen; result: ResultSectionLook; list: ListLook; mode?: ViewMode }) {
  const clock = useWaitClock(kit.skeleton.region);
  const [pick, setPick] = useState<number | null>(3000);
  // 실패 화면의 "다시 시도" — 시간표를 처음부터 다시 세고, 그동안 버튼에 로딩을 건다(Result Section)
  const [retrying, setRetrying] = useState(false);
  const dims = dimsOf(list);
  const st = clock.status;
  const pending = st === 'quiet' || st === 'waiting' || st === 'slow';
  const failed = st === 'failed' || (retrying && pending);
  const start = (loadAt: number | null) => {
    setRetrying(false);
    setPick(loadAt);
    clock.start(loadAt);
  };
  const spacer = kit.skeleton.slowText.gap - dims.padY;
  return (
    <Board w={400}>
      <div style={floorStyle(screen, mode)}>
        <DemoCard screen={screen} mode={mode} title="최근 거래" style={{ minHeight: 330 }}>
          <div aria-busy={pending || undefined}>
            {failed ? (
              // 카드 안 결과 — 좌우는 목록 카드의 24 만(결과 자리의 좌우 0)
              <div style={{ paddingTop: 24, paddingRight: kit.skeleton.slowText.padXList, paddingBottom: 16, paddingLeft: kit.skeleton.slowText.padXList }}>
                <ResultSectionView
                  look={result}
                  mode={mode}
                  inCard
                  kind="failure"
                  size="medium"
                  live
                  title="거래를 불러오지 못했어요"
                  description="잠시 뒤 다시 시도해주세요."
                  primary={{
                    label: '다시 시도',
                    loading: retrying && pending,
                    onClick: () => {
                      setRetrying(true);
                      clock.start(pick);
                    },
                  }}
                />
              </div>
            ) : pending ? (
              <>
                {st === 'slow' && (
                  <div style={{ paddingLeft: kit.skeleton.slowText.padXList, paddingRight: kit.skeleton.slowText.padXList, marginBottom: spacer }}>
                    <SlowTextView look={kit.skeleton} mode={mode} />
                  </div>
                )}
                <SkeletonRowsView look={kit.skeleton} dims={dims} n={4} mode={mode} hidden={st === 'quiet'} />
              </>
            ) : (
              <Reveal key={st} kit={kit}>
                <ListView look={list} rows={TX.slice(0, 4)} mode={mode} live={false} />
              </Reveal>
            )}
          </div>
        </DemoCard>
      </div>
      <StatusText status={retrying ? 'idle' : st} />
      <CtlRow note={st === 'idle' ? '눌러서 다시 불러온다' : `${secs(clock.elapsed)} — ${retrying && pending ? '다시 시도 중' : STATUS_KO[st]}`}>
        {LOADS.map(([label, at]) => (
          <Ctl key={label} onClick={() => start(at)} pressed={st !== 'idle' && pick === at}>
            {label}
          </Ctl>
        ))}
      </CtlRow>
    </Board>
  );
}

// ── Skeleton — 통계의 달 넘기기(ex-period) ───────────────
const MONTHS = ['2026-07', '2026-08', '2026-09', '2026-10'];
const monthName = (k: string) => `${k.slice(0, 4)}년 ${Number(k.slice(5))}월`;
export function SkeletonPeriodDemo({ kit, screen, mode = 'auto' }: { kit: LoadingKit; screen: LdScreen; mode?: ViewMode }) {
  const [i, setI] = useState(MONTHS.length - 1);
  // 받아 둔 달 — 다시 오면 바로 보인다
  const [cache, setCache] = useState<string[]>([MONTHS[MONTHS.length - 1]]);
  const clock = useWaitClock(kit.skeleton.region);
  const month = MONTHS[i];
  const cached = cache.includes(month);
  const st = cached ? 'idle' : clock.status;
  useEffect(() => {
    if (clock.status === 'done' && !cache.includes(month)) setCache((c) => [...c, month]);
  }, [clock.status, month, cache]);
  const go = (to: number) => {
    setI(to);
    if (!cache.includes(MONTHS[to])) clock.start(2400);
  };
  const t9 = kit.skeleton.text.t9;
  const fg = tone(screen, 'fg-neutral', mode);
  const nav = (dir: -1 | 1) => {
    const to = i + dir;
    const off = to < 0 || to >= MONTHS.length;
    const I = dir < 0 ? ChevronLeft : ChevronRight;
    return (
      <button type="button" aria-label={dir < 0 ? '이전 달' : '다음 달'} disabled={off} onClick={() => go(to)} className="grid h-11 w-11 place-items-center rounded-full disabled:cursor-not-allowed" style={{ color: off ? tone(screen, 'fg-neutral-subtle', mode) : fg }}>
        <I aria-hidden size={22} strokeWidth={2} />
      </button>
    );
  };
  const pending = st === 'quiet' || st === 'waiting' || st === 'slow';
  return (
    <Board w={400}>
      <div style={floorStyle(screen, mode)}>
        <DemoCard screen={screen} mode={mode}>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 0, paddingRight: 8, paddingBottom: 0, paddingLeft: 8 }}>
            {nav(-1)}
            <span aria-live="polite" style={{ fontSize: 17, lineHeight: '24px', fontWeight: 700, color: fg }}>
              {monthName(month)}
            </span>
            {nav(1)}
          </div>
          <div aria-busy={pending || undefined} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 8, paddingRight: 24, paddingBottom: 12, paddingLeft: 24 }}>
            <span style={{ fontSize: 13, lineHeight: '18px', color: tone(screen, 'fg-neutral-subtle', mode) }}>지출</span>
            {pending || st === 'failed' ? (
              st === 'failed' ? (
                <span style={{ fontSize: 14, lineHeight: '19px', color: tone(screen, 'fg-critical', mode) }}>통계를 불러오지 못했어요.</span>
              ) : (
                <SkeletonView look={kit.skeleton} mode={mode} text="t9" width={144} hidden={st === 'quiet'} />
              )
            ) : (
              <Reveal key={month} kit={kit}>
                <span style={{ display: 'block', fontSize: t9.size, lineHeight: `${t9.lineHeight}px`, fontWeight: 700, color: fg, fontVariantNumeric: 'tabular-nums' }}>{MONTH_STATS[month].total}</span>
              </Reveal>
            )}
          </div>
        </DemoCard>
      </div>
      <StatusText status={st} />
      <p className="m-0 text-[12px] leading-5 text-fd-muted-foreground">
        ‹ 를 눌러 지난달로 — 달 이름은 바로 바뀌고 금액 자리만 기다린다(1초까지는 비워 둔다). 받아 둔 달로 돌아오면 바로 보인다. {cached ? '' : `${secs(clock.elapsed)} — ${STATUS_KO[clock.status]}`}
      </p>
    </Board>
  );
}

// ── Progress Circle — 섹션 새로 고침 · 화면 가운데(ex-basic) ───────
export function CircleBasicDemo({ kit, screen, list, search, mode = 'auto' }: { kit: LoadingKit; screen: LdScreen; list: ListLook; search: ButtonLook; mode?: ViewMode }) {
  const refresh = useWaitClock(kit.skeleton.region);
  const results = useWaitClock(kit.skeleton.region);
  const [searched, setSearched] = useState(false);
  // 원은 기다리는 영역의 시간표대로 — 1초 안에 끝나면 보이지 않는다
  const isRefreshing = refresh.status === 'waiting' || refresh.status === 'slow';
  const rs = results.status;
  const pending = rs === 'quiet' || rs === 'waiting' || rs === 'slow';
  return (
    <Board w={400}>
      <div style={floorStyle(screen, mode)}>
        <DemoCard screen={screen} mode={mode} title="최근 거래" right={isRefreshing && <ProgressCircleView look={kit.circle} mode={mode} size="24" label="최근 거래 새로 고치는 중" />}>
          <ListView look={list} rows={TX.slice(0, 2)} mode={mode} live={false} />
        </DemoCard>
        <DemoCard screen={screen} mode={mode} title="검색 결과" style={{ minHeight: 236 }}>
          <div aria-busy={pending || undefined} style={{ position: 'relative', minHeight: 172 }}>
            {pending ? (
              // 목록 카드 바로 아래 영역 — 원 · 오래 걸림 글은 좌우 24 안에(skeleton.yaml slowText.paddingX 비고)
              <div style={{ display: 'grid', placeItems: 'center', minHeight: 172, paddingLeft: kit.skeleton.slowText.padXList, paddingRight: kit.skeleton.slowText.padXList, visibility: rs === 'quiet' ? 'hidden' : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: kit.skeleton.slowText.gap }}>
                  <ProgressCircleView look={kit.circle} mode={mode} size="40" />
                  {rs === 'slow' && <SlowTextView look={kit.skeleton} mode={mode} align="center" />}
                </div>
              </div>
            ) : searched ? (
              <Reveal key={rs} kit={kit}>
                <ListView look={list} rows={[TX[0], TX[4]]} mode={mode} live={false} />
              </Reveal>
            ) : (
              <div style={{ display: 'grid', placeItems: 'center', minHeight: 172, fontSize: 14, color: tone(screen, 'fg-neutral-subtle', mode) }}>찾을 내용을 넣고 검색을 눌러보세요.</div>
            )}
          </div>
        </DemoCard>
      </div>
      <StatusText status={rs === 'idle' ? refresh.status : rs} />
      <CtlRow>
        <Ctl onClick={() => refresh.start(2600)}>최근 거래 새로 고침(2.6초)</Ctl>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-fd-border px-2 text-[12px] text-fd-muted-foreground">
            <Search aria-hidden size={14} /> 점심
          </span>
          <ButtonView look={search} mode={mode} label="검색" onClick={() => (setSearched(true), results.start(2400))} />
        </span>
      </CtlRow>
    </Board>
  );
}

// ── Progress Circle — 영수증 사진 올리기(ex-determinate) ─────────
const FILE_SIZE = 2_400_000;
// 영수증 사진(그림) — 흰 종이 위 글줄
function ReceiptPhoto({ size }: { size: number }) {
  return (
    <span aria-hidden style={{ display: 'block', width: size, height: size, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(160deg, #C9B79C 0%, #A58E6F 100%)' }}>
      <span style={{ display: 'block', margin: `${size * 0.12}px auto 0`, width: size * 0.62, height: size, background: '#FBFAF6', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: 'rotate(-6deg)', padding: size * 0.08, boxSizing: 'border-box' }}>
        {[0.9, 0.6, 0.75, 0.5, 0.8].map((w, i) => (
          <span key={i} style={{ display: 'block', height: 3, width: `${w * 100}%`, marginBottom: 4, background: '#B9B4A8', borderRadius: 2 }} />
        ))}
      </span>
    </span>
  );
}
export function CircleUploadDemo({ kit, screen, start, mode = 'auto' }: { kit: LoadingKit; screen: LdScreen; start: ButtonLook; mode?: ViewMode }) {
  const [uploaded, setUploaded] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);
  const go = () => {
    window.clearInterval(timer.current);
    setUploaded(0);
    let v = 0;
    timer.current = window.setInterval(() => {
      v = Math.min(FILE_SIZE, v + FILE_SIZE * (0.08 + Math.random() * 0.1));
      setUploaded(v);
      if (v >= FILE_SIZE) {
        window.clearInterval(timer.current);
        window.setTimeout(() => setUploaded(null), 600);
      }
    }, 320);
  };
  const busy = uploaded !== null;
  return (
    <Board w={400}>
      <div style={floorStyle(screen, mode)}>
      <DemoCard screen={screen} mode={mode} title="영수증 사진">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 8, paddingRight: 24, paddingBottom: 12, paddingLeft: 24 }}>
          <div className="relative" style={{ width: 80, height: 80 }}>
            <ReceiptPhoto size={80} />
            {busy && (
              <div className="absolute inset-0 grid place-items-center" style={{ borderRadius: 8, background: lcv(screen.dim, mode) }}>
                <ProgressCircleView look={kit.circle} mode={mode} size="24" tone="staticWhite" value={uploaded} max={FILE_SIZE} label="영수증 사진 올리는 중" />
              </div>
            )}
          </div>
          <span style={{ fontSize: 14, lineHeight: '19px', color: tone(screen, 'fg-neutral-muted', mode) }} aria-live="polite">
            {busy ? (uploaded >= FILE_SIZE ? '다 올렸어요.' : '올리는 중이에요.') : '점심 식사 영수증'}
          </span>
        </div>
      </DemoCard>
      </div>
      <CtlRow note={busy ? `${Math.round(((uploaded ?? 0) / FILE_SIZE) * 100)}%` : undefined}>
        <ButtonView look={start} mode={mode} label="사진 올리기" state={busy ? 'loading' : 'live'} onClick={go} />
      </CtlRow>
    </Board>
  );
}

// ── 당겨서 새로 고침(ptr) ─────────────────────────────────
type PullPhase = 'idle' | 'pulling' | 'ready' | 'refreshing';
const REFRESH: [string, number, boolean][] = [
  ['1초 걸림', 1000, true],
  ['3초 걸림', 3000, true],
  ['실패', 2000, false],
];
export function PullToRefreshDemo({ kit, screen, list, snack, mode = 'auto' }: { kit: LoadingKit; screen: LdScreen; list: ListLook; snack: SnackbarLook; mode?: ViewMode }) {
  const p = kit.pull;
  const reduce = useReducedMotion();
  const [pull, setPull] = useState(0);
  const [phase, setPhase] = useState<PullPhase>('idle');
  const [anim, setAnim] = useState<string | null>(null);
  const [plan, setPlan] = useState(0);
  const drag = useRef<{ id: number; y0: number; started: boolean } | null>(null);
  const host = useSnackbarHost(snack);
  const done = useRef<number | undefined>(undefined);
  const id = useId();
  useEffect(() => () => window.clearTimeout(done.current), []);
  // 새로 고침 — 끝날 때까지(성공 · 실패 모두) 88 에 머문다. 실패하면 내용은 두고 스낵바
  const refresh = () => {
    const [, ms, ok] = REFRESH[plan];
    setPhase('refreshing');
    setAnim(reduce ? null : `transform ${p.motion.release.duration} ${p.motion.release.easing}`);
    setPull(p.threshold);
    window.clearTimeout(done.current);
    done.current = window.setTimeout(() => {
      setAnim(reduce ? null : `transform ${p.motion.done.duration} ${p.motion.done.easing}`);
      setPull(0);
      setPhase('idle');
      if (!ok) host.show({ tone: 'critical', message: '새로 고치지 못했어요.' });
    }, ms);
  };
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (phase === 'refreshing' || e.button !== 0) return;
    if (e.currentTarget.scrollTop > 0) return;
    drag.current = { id: e.pointerId, y0: e.clientY, started: false };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    // 처음 아래로 움직인 자리부터 센다 — 위로 되돌리면 0 에 머문다
    if (e.clientY < d.y0) d.y0 = e.clientY;
    const dist = (e.clientY - d.y0) * p.multiplier;
    if (!d.started && dist > 2) {
      d.started = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.started) return;
    setAnim(null);
    setPull(dist);
    setPhase(dist >= p.threshold ? 'ready' : dist > 0 ? 'pulling' : 'idle');
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.started) return;
    if (pull >= p.threshold) refresh();
    else {
      // 문턱 전 놓음 — 새로 고치지 않는다
      setAnim(reduce ? null : `transform ${p.motion.cancel.duration} ${p.motion.cancel.easing}`);
      setPull(0);
      setPhase('idle');
    }
  };
  const ratio = Math.min(pull / p.threshold, 1);
  const refreshing = phase === 'refreshing';
  const indicatorY = refreshing ? 0 : Math.min(pull - p.indicator, 0);
  const label = phase === 'idle' ? (pull > 0 ? '제자리로' : '쉼 — 목록을 아래로 끌어 보세요') : phase === 'pulling' ? `당기는 중 ${Math.round(pull)} / ${p.threshold}` : phase === 'ready' ? '문턱을 넘음 — 놓으면 새로 고친다' : `새로 고치는 중 — 끝날 때까지 ${p.threshold} 에 머문다`;
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="group"
        aria-label="가계부 — 당겨서 새로 고침"
        style={{ position: 'relative', isolation: 'isolate', width: 320, maxWidth: '100%', height: 520, borderRadius: 28, border: '6px solid var(--p-frame)', overflow: 'hidden', background: tone(screen, 'bg-layer-basement', mode), fontFamily: FONT, boxSizing: 'border-box' }}
      >
        {/* 머리 — 새로 고침 버튼(당기기의 다른 길: 키보드 · 보조 기술) */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, padding: '0 8px 0 20px', background: tone(screen, 'bg-layer-default', mode) }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: tone(screen, 'fg-neutral', mode) }}>가계부</span>
          <button type="button" aria-label="새로 고침" disabled={refreshing} onClick={refresh} className="grid h-11 w-11 place-items-center rounded-full disabled:cursor-not-allowed" style={{ color: tone(screen, refreshing ? 'fg-neutral-subtle' : 'fg-neutral', mode) }}>
            <RotateCw aria-hidden size={20} strokeWidth={2} />
          </button>
        </div>
        <div style={{ position: 'relative', height: 'calc(100% - 52px)' }}>
          {/* 지시자 칸 — 쉬는 동안 · 당기는 동안은 보조 기술에 숨긴다, 새로 고치는 동안만 "새로 고치는 중" */}
          <div aria-hidden={refreshing ? undefined : true} style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1, height: p.indicator, display: 'grid', placeItems: 'center', transform: `translateY(${indicatorY}px)`, opacity: refreshing ? 1 : ratio, transition: anim ?? undefined, pointerEvents: 'none' }}>
            {refreshing ? <ProgressCircleView look={kit.circle} mode={mode} size="24" label="새로 고치는 중" /> : <ProgressCircleView look={kit.circle} mode={mode} size="24" value={ratio * 100} decorative />}
          </div>
          <div
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto', touchAction: 'pan-x', userSelect: 'none', cursor: refreshing ? 'progress' : 'grab' }}
          >
            <div style={{ transform: `translateY(${pull}px)`, transition: anim ?? undefined, paddingTop: 8, paddingRight: screen.card.pad, paddingBottom: 12, paddingLeft: screen.card.pad }}>
              <DemoCard screen={screen} mode={mode} title="최근 거래">
                <ListView look={list} rows={compactRows(TX.slice(0, 5))} mode={mode} live={false} />
              </DemoCard>
            </div>
          </div>
          <SnackbarRegion host={host} look={snack} mode={mode} />
        </div>
      </div>
      <span id={`${id}s`} className="text-[12px] tabular-nums text-fd-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {REFRESH.map(([l], k) => (
          <Ctl key={l} onClick={() => setPlan(k)} pressed={plan === k}>
            새로 받기 {l}
          </Ctl>
        ))}
      </div>
    </div>
  );
}

// ── Scroll Fog — 카테고리 고르기(ex-sheet) ─────────────────
export function FogSheetDemo({ kit, list, trigger, mode = 'auto' }: { kit: OvKit; list: ListLook; trigger: ButtonLook; mode?: ViewMode }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('food');
  const holder = useRef<HTMLElement | null>(null);
  const label = CATEGORY.find((c) => c.value === value)?.title;
  return (
    <DemoFrame kit={kit} mode={mode} w={400}>
      <div className="flex flex-col gap-3">
        <span className="text-[17px] font-bold" style={{ color: `var(--p-fg-neutral)` }}>
          거래 추가
        </span>
        <span ref={(el) => void (holder.current = el?.querySelector('button') ?? null)}>
          <ButtonView look={trigger} mode={mode} label={`카테고리 · ${label}`} onClick={() => setOpen(true)} />
        </span>
      </div>
      <ResponsiveLayer kit={kit} mode={mode} open={open} form={false} onRequestClose={() => setOpen(false)} title="카테고리 고르기" bodyPad={false} fog trigger={() => holder.current}>
        <ListView
          look={list}
          rows={CATEGORY.map((c) => ({ ...c, checked: c.value === value }))}
          mode={mode}
          value={value}
          onValue={(v) => {
            setValue(v);
            setOpen(false);
          }}
          ariaLabel="카테고리"
        />
      </ResponsiveLayer>
    </DemoFrame>
  );
}

// ── Scroll Fog — 칩 줄 · 카드 안 긴 설명(ex-row) ─────────────
export function FogRowDemo({ kit, chip, screen, mode = 'auto' }: { kit: LoadingKit; chip: ChipLook; screen: LdScreen; mode?: ViewMode }) {
  const [pick, setPick] = useState(FILTER_CHIPS[0]);
  return (
    <Board w={400}>
      <div style={floorStyle(screen, mode)}>
      <div style={{ boxSizing: 'border-box', background: tone(screen, 'bg-layer-default', mode), borderWidth: screen.card.borderW, borderStyle: 'solid', borderColor: tone(screen, 'stroke-neutral-weak', mode), borderRadius: screen.card.radius, paddingTop: screen.card.pad, paddingRight: screen.card.pad, paddingBottom: screen.card.pad, paddingLeft: screen.card.pad, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        <ChipGroupView look={chip} mode={mode} layout="scroll" role="radiogroup" ariaLabel="필터">
          {FILTER_CHIPS.map((t) => (
            <ChipView key={t} look={chip} mode={mode} label={t} role="radio" selected={pick === t} tabIndex={pick === t ? 0 : -1} onClick={() => setPick(t)} />
          ))}
        </ChipGroupView>
        <div style={{ borderRadius: 16, background: tone(screen, 'bg-layer-basement', mode), padding: '0 20px' }}>
          <ScrollFogView look={kit.fog} use="box" ariaLabel="이용 약관" tabIndex={0} style={{ maxHeight: 240 }}>
            {TERMS.map((t) => (
              <p key={t} style={{ margin: '0 0 12px', fontSize: 14, lineHeight: '22px', color: tone(screen, 'fg-neutral-muted', mode) }}>
                {t}
              </p>
            ))}
          </ScrollFogView>
        </div>
      </div>
      </div>
    </Board>
  );
}
