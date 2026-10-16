'use client';
// Motion 페이지의 재생 판 — 값은 서버 컴포넌트(motion.tsx)가 DESIGN.md 에서 읽어 넘긴다.
// 누를 때만 움직인다(저절로 재생하지 않는다).
import { useEffect, useState, type CSSProperties } from 'react';
import { RotateCw } from 'lucide-react';

// skeleton · bone — 스켈레톤의 면 색과 글 자리 한 줄(높이 = 글줄 높이 · 모서리, skeleton.yaml)
export type Palette = { brand: string; weak: string; line: string; grid: string; muted: string; surface: string; skeleton: string; bone?: { h: number; r: number } };
export type EaseItem = { name: string; value: string; note: string };
export type Kf = { name: string; duration: string; durationToken?: string; ms: number; ease: string; easeToken?: string; use: string };

const short = (n?: string) => n?.replace(/^motion-(duration|ease)-/, '');

function bezier(value: string): [number, number, number, number] {
  const m = value.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return [0, 0, 1, 1]; // linear
  const [a, b, c, d] = m[1].split(',').map((x) => parseFloat(x));
  return [a, b, c, d];
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(q.matches);
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function Button({ onClick, children, pressed }: { onClick: () => void; children: string; pressed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] font-medium text-fd-foreground hover:bg-fd-accent aria-pressed:border-fd-foreground"
    >
      {children}
    </button>
  );
}

// ── 이징 곡선 ─────────────────────────────────────────────
const PLOT = 96, PAD = 10, TRACK = PLOT - 12;
function Curve({ value, p }: { value: string; p: Palette }) {
  const [x1, y1, x2, y2] = bezier(value);
  const X = (x: number) => PAD + x * PLOT;
  const Y = (y: number) => PAD + (1 - y) * PLOT;
  return (
    <svg width={PLOT + PAD * 2} height={PLOT + PAD * 2} aria-hidden className="overflow-visible">
      <rect x={PAD} y={PAD} width={PLOT} height={PLOT} fill="none" stroke={p.grid} />
      <line x1={X(0)} y1={Y(0)} x2={X(x1)} y2={Y(y1)} stroke={p.muted} strokeDasharray="2 2" />
      <line x1={X(1)} y1={Y(1)} x2={X(x2)} y2={Y(y2)} stroke={p.muted} strokeDasharray="2 2" />
      <circle cx={X(x1)} cy={Y(y1)} r={2.5} fill={p.muted} />
      <circle cx={X(x2)} cy={Y(y2)} r={2.5} fill={p.muted} />
      <path d={`M${X(0)},${Y(0)} C${X(x1)},${Y(y1)} ${X(x2)},${Y(y2)} ${X(1)},${Y(1)}`} fill="none" stroke={p.brand} strokeWidth={2} />
    </svg>
  );
}

export function EasingPlayer({ items, demoMs, palette: p }: { items: EaseItem[]; demoMs: number; palette: Palette }) {
  const [right, setRight] = useState<Record<string, boolean>>({});
  const toggle = (names: string[]) => setRight((r) => Object.fromEntries([...Object.entries(r), ...names.map((n) => [n, !r[n]])]));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] text-fd-muted-foreground">곡선 모양이 보이게 {demoMs / 1000}초로 늘려 움직인다. 판을 누르면 그 곡선만.</span>
        <Button onClick={() => toggle(items.map((i) => i.name))}>모두 재생</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <button
            key={it.name}
            type="button"
            onClick={() => toggle([it.name])}
            className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-left text-[#1A1F2E] ring-fd-primary focus-visible:outline-none focus-visible:ring-2"
          >
            <Curve value={it.value} p={p} />
            <div className="relative h-3 rounded-full" style={{ width: PLOT, background: p.surface }}>
              <span
                className="absolute left-0 top-0 block h-3 w-3 rounded-full"
                style={{ background: p.brand, transform: `translateX(${right[it.name] ? TRACK : 0}px)`, transition: `transform ${demoMs}ms ${it.value}` }}
              />
            </div>
            <code className="text-[12px] font-bold">{short(it.name)}</code>
            <span className="text-center text-[11px] leading-4 text-[#62697A]">{it.note.replace(/`/g, '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 키프레임 ──────────────────────────────────────────────
type Plan = { anim: string; ms: number; ease: string; label: string } | null;

export function KeyframePlayer({ single, loop, reduced, shimmer, palette: p }: { single: Kf[]; loop: Kf[]; reduced: { over: number; fade: number }; shimmer: string; palette: Palette }) {
  const prefers = usePrefersReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const isReduced = choice ?? prefers;
  const [run, setRun] = useState<Record<string, number>>({});
  const [loopOn, setLoopOn] = useState(false);

  // 줄이기 모드 — DESIGN.md "모션 줄이기 모드" 표: 큰 전환(over 초과)은 fade ms 서서히 나타남 · 사라짐
  const plan = (k: Kf): Plan => {
    if (!isReduced || k.ms <= reduced.over) return { anim: k.name, ms: k.ms, ease: k.ease, label: `${short(k.durationToken) ?? k.duration} · ${short(k.easeToken) ?? '곡선 따로'}` };
    if (/-out$/.test(k.name)) return { anim: 'fade-out', ms: reduced.fade, ease: k.ease, label: `서서히 사라짐 ${reduced.fade}ms` };
    if (/(^|-)in(-|$)/.test(k.name)) return { anim: 'fade-in', ms: reduced.fade, ease: k.ease, label: `서서히 나타남 ${reduced.fade}ms` };
    return null;
  };
  const play = (names: string[]) => setRun((r) => ({ ...r, ...Object.fromEntries(names.map((n) => [n, (r[n] ?? 0) + 1])) }));
  const stop = (name: string) => setTimeout(() => setRun((r) => ({ ...r, [name]: 0 })), 450);

  const box: CSSProperties = { width: 36, height: 36, borderRadius: 8, background: p.weak, border: `1.5px solid ${p.line}` };
  const loopRunning = loopOn && !isReduced;
  const loopAnim = (k: Kf) => (loopRunning ? `porest-${k.name} ${k.ms}ms ${k.ease} infinite` : 'none');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12px] text-fd-muted-foreground">
          {prefers ? '기기에서 동작 줄이기가 켜져 있어 줄이기 모드로 보여 준다.' : '판을 누르면 권장 지속 시간 · 이징으로 재생한다.'}
        </span>
        <div className="flex gap-2">
          <Button onClick={() => setChoice(!isReduced)} pressed={isReduced}>모션 줄이기 모드로 보기</Button>
          <Button onClick={() => play(single.map((k) => k.name))}>모두 재생</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {single.map((k) => {
          const pl = plan(k);
          const n = run[k.name] ?? 0;
          return (
            <button
              key={k.name}
              type="button"
              onClick={() => pl && play([k.name])}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-white px-2 pb-3 pt-4 text-[#1A1F2E] ring-fd-primary focus-visible:outline-none focus-visible:ring-2"
            >
              <div className="flex h-14 items-center justify-center">
                <span
                  key={n}
                  style={{ ...box, animation: n && pl ? `porest-${pl.anim} ${pl.ms}ms ${pl.ease} both` : 'none', opacity: pl ? 1 : 0.35 }}
                  onAnimationEnd={() => stop(k.name)}
                />
              </div>
              <code className="text-[12px] font-bold">{k.name}</code>
              <span className="text-center text-[11px] leading-4 text-[#62697A]">{pl ? pl.label : '표에 없는 움직임 — 컴포넌트 스펙에서 정한다'}</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-[12px] text-fd-muted-foreground">반복 — {isReduced ? '줄이기 모드에서는 멈춘다.' : '켜 두면 계속 돈다.'}</span>
        <Button onClick={() => setLoopOn(!loopOn)} pressed={loopOn}>반복 보기</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {loop.map((k) => (
          <div key={k.name} className="flex flex-col items-center gap-1.5 rounded-xl bg-white px-2 pb-3 pt-4 text-[#1A1F2E]">
            <div className="flex h-14 items-center justify-center">
              {/* spin — 새로 고침 아이콘처럼 일정하게 도는 것(Progress Circle 은 제 스펙의 회전 · 호를 쓴다) */}
              {k.name === 'spin' && <RotateCw aria-hidden size={26} strokeWidth={2} style={{ color: p.brand, animation: loopAnim(k) }} />}
              {k.name === 'pulse' && <span className="block h-4 w-4 rounded-full" style={{ background: p.brand, animation: loopAnim(k) }} />}
              {k.name === 'ping' && (
                <span className="relative block h-3 w-3">
                  <span className="absolute inset-0 rounded-full" style={{ background: p.brand, opacity: 0.6, animation: loopAnim(k) }} />
                  <span className="absolute inset-0 rounded-full" style={{ background: p.brand }} />
                </span>
              )}
              {k.name === 'shimmer' && (
                <span className="relative block w-20 overflow-hidden" style={{ height: p.bone?.h ?? 12, borderRadius: p.bone?.r ?? 4, background: p.skeleton }}>
                  <span className="absolute inset-0" style={{ background: shimmer, transform: 'translateX(-100%)', animation: loopAnim(k) }} />
                </span>
              )}
            </div>
            <code className="text-[12px] font-bold">{k.name}</code>
            <span className="text-center text-[11px] leading-4 text-[#62697A]">{short(k.durationToken) ?? k.duration} · {short(k.easeToken) ?? k.ease}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
