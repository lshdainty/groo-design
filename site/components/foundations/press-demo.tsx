'use client';
// Feedback › Scale 의 눌러 보는 판 — 상수 · 색 · 시간은 서버 컴포넌트(feedback.tsx)가 DESIGN.md 에서 읽어 넘긴다.
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { usePrefersReducedMotion } from './motion-demo';

export type PressConst = { distance: number; widthDivisor: number; minBasis: number };
export type PressTiming = { scaleMs: number; scaleEase: string; colorMs: number; colorEase: string };
export type PressColors = { brand: string; brandPressed: string; onBrand: string; layer: string; layerPressed: string; fg: string; subtle: string; line: string; weak: string; weakPressed: string };

function measure(el: HTMLElement, c: PressConst) {
  // offsetWidth/Height 는 transform 의 영향을 받지 않는다 — 줄어든 크기로 다시 계산하지 않게
  const w = el.offsetWidth, h = el.offsetHeight;
  const basis = Math.max(h, w / c.widthDivisor, c.minBasis);
  const by = basis === h ? '높이' : basis === c.minBasis ? `최소 ${c.minBasis}` : `폭 ÷ ${c.widthDivisor}`;
  return { w, h, basis, by, ratio: (basis - c.distance) / basis };
}

function Pressable({
  label,
  c,
  t,
  reduced,
  className,
  style,
  pressedStyle,
  content,
  children,
}: {
  label: string;
  c: PressConst;
  t: PressTiming;
  reduced: boolean;
  className?: string;
  style: CSSProperties;
  pressedStyle: CSSProperties;
  content?: boolean; // Content Scale — 배경은 그대로, 안쪽만 준다
  children: ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [m, setM] = useState<ReturnType<typeof measure> | null>(null);
  const [down, setDown] = useState(false);
  const press = () => {
    if (ref.current) setM(measure(ref.current, c));
    setDown(true);
  };
  const release = () => setDown(false);
  const scale = down && m && !reduced ? m.ratio : 1;
  const move: CSSProperties = { transform: `scale(${scale})`, transition: `transform ${t.scaleMs}ms ${t.scaleEase}` };
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <button
        ref={ref}
        type="button"
        aria-label={label}
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && press()}
        onKeyUp={release}
        onBlur={release}
        className={`touch-manipulation select-none outline-none ring-offset-2 focus-visible:ring-2 ${className ?? ''}`}
        style={{
          ...style,
          ...(down ? pressedStyle : null),
          transition: `background-color ${t.colorMs}ms ${t.colorEase}, transform ${t.scaleMs}ms ${t.scaleEase}`,
          ...(content ? null : { transform: `scale(${scale})` }),
        }}
      >
        {content ? <span className="flex w-full items-center gap-3" style={move}>{children}</span> : children}
      </button>
      <span className="h-4 text-[11px] tabular-nums text-[#62697A]">
        {m ? `${m.w} × ${m.h} · 기준 ${m.by} ${Math.round(m.basis * 10) / 10} · 배율 ${reduced ? '1' : m.ratio.toFixed(3)}` : '눌러 보면 배율이 나온다'}
      </span>
    </div>
  );
}

export function PressDemo({ c, t, colors: k, heights }: { c: PressConst; t: PressTiming; colors: PressColors; heights: { icon: number; button: number; wide: number; row: number } }) {
  const prefers = usePrefersReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const reduced = choice ?? prefers;
  const common = { c, t, reduced };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12px] text-fd-muted-foreground">누르고 있는 동안 준다. 배율은 요소마다 다르지만 움직이는 거리는 비슷하다.</span>
        <button
          type="button"
          aria-pressed={reduced}
          onClick={() => setChoice(!reduced)}
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] font-medium text-fd-foreground hover:bg-fd-accent aria-pressed:border-fd-foreground"
        >
          모션 줄이기 모드로 보기
        </button>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-5">
        <div className="flex w-full flex-wrap items-start justify-center gap-6">
          <div className="w-[150px]">
            <Pressable
              label="아이콘 버튼"
              {...common}
              className="mx-auto flex items-center justify-center rounded-lg text-[18px]"
              style={{ width: heights.icon, height: heights.icon, background: k.weak, color: k.brand }}
              pressedStyle={{ background: k.weakPressed }}
            >
              ＋
            </Pressable>
          </div>
          <div className="w-[190px]">
            <Pressable
              label="버튼"
              {...common}
              className="mx-auto flex items-center justify-center rounded-lg px-5 text-[14px] font-bold"
              style={{ height: heights.button, background: k.brand, color: k.onBrand }}
              pressedStyle={{ background: k.brandPressed }}
            >
              저장
            </Pressable>
          </div>
        </div>
        <Pressable
          label="가로로 긴 버튼"
          {...common}
          className="flex w-full items-center justify-center rounded-xl text-[15px] font-bold"
          style={{ height: heights.wide, background: k.brand, color: k.onBrand }}
          pressedStyle={{ background: k.brandPressed }}
        >
          다음
        </Pressable>
        <Pressable
          label="목록 줄"
          {...common}
          content
          className="flex w-full items-center px-4 text-left"
          style={{ height: heights.row, background: k.layer, color: k.fg, borderTop: `1px solid ${k.line}`, borderBottom: `1px solid ${k.line}` }}
          pressedStyle={{ background: k.layerPressed }}
        >
          <span className="block h-8 w-8 shrink-0 rounded-full" style={{ background: k.weak }} />
          <span className="flex-1 text-[14px]">점심 식비</span>
          <span className="text-[14px] tabular-nums" style={{ color: k.subtle }}>12,000원</span>
        </Pressable>
      </div>
    </div>
  );
}
