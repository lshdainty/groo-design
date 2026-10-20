'use client';
// Gradient 페이지의 반짝임 판 — 값은 서버 컴포넌트(gradient.tsx)가 DESIGN.md 에서 읽어 넘긴다
import { useState } from 'react';
import { usePrefersReducedMotion } from './motion-demo';

type Scene = { label: string; page: string; card: string; bone: string; shimmer: string; fg: string };

// bone — 스켈레톤 글 자리 한 줄(높이 = 글줄 높이 · 모서리)과 아바타 모서리(skeleton.yaml)
export function ShimmerDemo({ scenes, loop, bone }: { scenes: Scene[]; loop: { ms: number; ease: string }; bone: { text: number; radius: number; avatar: number } }) {
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(false);
  const run = on && !reduced;
  const bar = (w: number | string, s: Scene) => (
    <span className="relative block overflow-hidden" style={{ width: w, height: bone.text, borderRadius: bone.radius, background: s.bone }}>
      <span className="absolute inset-0" style={{ background: s.shimmer, transform: 'translateX(-100%)', animation: run ? `groo-shimmer ${loop.ms}ms ${loop.ease} infinite` : 'none' }} />
    </span>
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12px] text-fd-muted-foreground">{reduced ? '기기에서 동작 줄이기가 켜져 있어 멈춰 둔다 — 줄이기 모드에서 반복은 멈춘다.' : '켜 두면 반짝임 띠가 되풀이해 지나간다.'}</span>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn(!on)}
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] font-medium text-fd-foreground hover:bg-fd-accent aria-pressed:border-fd-foreground"
        >
          반짝임 보기
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {scenes.map((s) => (
          <div key={s.label} className="flex flex-col gap-3 rounded-2xl p-4" style={{ background: s.page }}>
            <span className="text-[12px] font-bold" style={{ color: s.fg }}>{s.label}</span>
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: s.card }}>
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden" style={{ borderRadius: bone.avatar, background: s.bone }}>
                <span className="absolute inset-0" style={{ background: s.shimmer, transform: 'translateX(-100%)', animation: run ? `groo-shimmer ${loop.ms}ms ${loop.ease} infinite` : 'none' }} />
              </span>
              <div className="flex flex-1 flex-col gap-2">
                {bar('70%', s)}
                {bar('45%', s)}
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-3" style={{ background: s.card }}>
              {bar('100%', s)}
              {bar('85%', s)}
              {bar('60%', s)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
