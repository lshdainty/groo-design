// Motion 페이지 — 지속 시간 · 이징 · 키프레임은 DESIGN.md 의 motion 표 · CSS 블록에서만 온다
import { color, ms, pressScale, proseTokenSet, proseValue, reducedMotion, sectionCode, sectionTable, specSize } from '@/lib/design-tokens';
import { loadingKit } from '../specs/loading-look';
import { Figure, Panel } from './ui';
import { EasingPlayer, KeyframePlayer, type Kf, type Palette } from './motion-demo';

const short = (n: string) => n.replace(/^motion-(duration|ease)-/, '');
const EASE_ORDER = ['easing', 'enter', 'exit', 'enter-expressive', 'exit-expressive', 'pressed-scale', 'linear'];

export function palette(): Palette {
  return {
    brand: color('bg-brand-solid'),
    weak: color('bg-brand-weak'),
    line: color('stroke-brand-solid'),
    grid: color('stroke-neutral-weak'),
    muted: color('stroke-neutral-solid'),
    surface: color('bg-neutral-weak'),
    // 스켈레톤 면 — skeleton.yaml 의 root.background(bg-neutral-weak) · 글 한 줄(t4 줄 높이 · 모서리 8)
    skeleton: loadingKit().skeleton.bg.light,
    bone: { h: loadingKit().skeleton.text.t4.lineHeight, r: loadingKit().skeleton.radius['8'] },
  };
}

// ── 매크로 · 마이크로 ─────────────────────────────────────
export function MacroMicroFigure() {
  const press = proseValue('motion-duration-pressed-scale');
  const sheet = proseValue('motion-duration-d5');
  const { over } = reducedMotion();
  const lg = specSize('button', 'large');
  const { ratio } = pressScale();
  const w = 148;
  const dim = proseValue('overlay-dim-light');
  return (
    <Figure caption={`마이크로 모션은 ${over}ms 이하의 작은 반응, 매크로 모션은 그보다 긴 화면의 변화`}>
      <div className="flex gap-5">
        <div className="flex w-[250px] flex-col items-center gap-3 rounded-xl bg-white px-5 pb-5 pt-8">
          <div className="relative flex items-center justify-center" style={{ width: w, height: lg.height }}>
            <span className="absolute inset-0 rounded-lg border border-dashed" style={{ borderColor: color('stroke-neutral-solid') }} />
            <span
              className="flex items-center justify-center rounded-lg text-[14px] font-bold"
              style={{ width: w, height: lg.height, background: color('bg-brand-solid-pressed'), color: color('static-white'), transform: `scale(${ratio(w, lg.height)})` }}
            >
              저장
            </span>
          </div>
          <div className="w-full rounded-lg border-2 px-3 py-2 text-[13px] text-[#62697A]" style={{ borderColor: color('stroke-focus-ring') }}>
            메모 제목
          </div>
          <b className="mt-2 text-[14px] text-[#1A1F2E]">마이크로</b>
          <span className="text-center text-[12px] leading-4 text-[#62697A]">버튼 누름 {press} · 입력칸 포커스</span>
        </div>
        <div className="flex w-[250px] flex-col items-center gap-3 rounded-xl bg-white px-5 pb-5 pt-6">
          <div className="relative h-[150px] w-[92px] overflow-hidden rounded-[14px] border border-black/10" style={{ background: color('bg-layer-basement') }}>
            {[14, 44, 74].map((t) => (
              <span key={t} className="absolute left-2 right-2 h-6 rounded-md" style={{ top: t, background: color('bg-layer-default') }} />
            ))}
            <span className="absolute inset-0" style={{ background: dim }} />
            <div className="absolute inset-x-0 bottom-0 h-[74px] rounded-t-xl px-2 pt-2" style={{ background: color('bg-layer-floating') }}>
              <span className="mx-auto block h-1 w-6 rounded-full" style={{ background: color('stroke-neutral-weak') }} />
              <span className="mt-2 block h-2 w-12 rounded" style={{ background: color('bg-neutral-weak') }} />
              <span className="mt-1.5 block h-2 w-16 rounded" style={{ background: color('bg-neutral-weak') }} />
            </div>
            <span className="absolute bottom-[80px] right-2 text-[16px] leading-none" style={{ color: color('fg-brand') }} aria-hidden>↑</span>
          </div>
          <b className="text-[14px] text-[#1A1F2E]">매크로</b>
          <span className="text-center text-[12px] leading-4 text-[#62697A]">시트가 올라온다 {sheet} · 모달 · 페이지 전환</span>
        </div>
      </div>
    </Figure>
  );
}

// ── 이징 ─────────────────────────────────────────────────
export function EasingFigure() {
  const all = proseTokenSet('motion-ease-', new RegExp(`^motion-ease-(${EASE_ORDER.join('|')})$`));
  const items = EASE_ORDER.map((k) => all.find((t) => t.name === `motion-ease-${k}`)).filter((t) => t !== undefined);
  if (items.length !== EASE_ORDER.length) throw new Error('DESIGN.md 에 이징 토큰이 모자란다');
  return (
    <Panel caption="이징 곡선 — 가로는 시간, 세로는 움직인 거리">
      <EasingPlayer items={items} demoMs={1000} palette={palette()} />
    </Panel>
  );
}

// ── 지속 시간 ─────────────────────────────────────────────
export function DurationFigure() {
  const ds = proseTokenSet('motion-duration-', /^motion-duration-d\d$/);
  const { over } = reducedMotion();
  const max = Math.max(...ds.map((d) => ms(d.value)));
  const W = 330, k = W / max, LEFT = 20 + 44; // 판 안쪽 여백 + 이름 칸
  const brand = color('bg-brand-solid'), weak = color('bg-brand-weak');
  return (
    <Figure caption={`d1 ~ d6 — 점선 왼쪽(${over}ms 이하)이 마이크로, 오른쪽이 매크로 모션`}>
      <div className="relative w-[480px] rounded-xl bg-white px-5 pb-4 pt-9">
        <div className="absolute bottom-3 top-3 border-l border-dashed" style={{ left: LEFT + over * k, borderColor: color('stroke-neutral-solid') }}>
          <span className="absolute right-1.5 top-0 whitespace-nowrap text-[11px] text-[#62697A]">마이크로</span>
          <span className="absolute left-1.5 top-0 whitespace-nowrap text-[11px] text-[#62697A]">매크로</span>
        </div>
        {ds.map((d) => (
          <div key={d.name} className="flex h-7 items-center gap-2">
            <code className="w-9 text-[12px] text-[#1A1F2E]">{short(d.name)}</code>
            <span className="block h-3 rounded-sm" style={{ width: ms(d.value) * k, background: ms(d.value) > over ? brand : weak, border: `1px solid ${brand}` }} />
            <span className="text-[12px] tabular-nums text-[#62697A]">{d.value}</span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// ── 키프레임 ──────────────────────────────────────────────
function cell(c: string) {
  const code = c.match(/`([^`]+)`/)?.[1] ?? c.trim();
  return code.startsWith('motion-') ? { token: code, value: proseValue(code) } : { token: undefined, value: code };
}
function keyframeRows(heading: string): Kf[] {
  return sectionTable(heading).rows.map((r) => {
    const d = cell(r[1]), e = cell(r[2]);
    return { name: r[0].replace(/`/g, ''), duration: d.value, durationToken: d.token, ms: ms(d.value), ease: e.value, easeToken: e.token, use: r[3] };
  });
}
export function KeyframeLibrary() {
  // 사이트의 Tailwind(spin · pulse · ping)와 이름이 겹치지 않게 앞에 porest- 를 붙여 싣는다
  const css = sectionCode('CSS keyframes 정의').replace(/@keyframes ([a-z-]+)/g, '@keyframes porest-$1');
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Panel caption="단발 키프레임은 누를 때 한 번, 반복 키프레임은 켜 두는 동안 돈다">
        <KeyframePlayer
          single={keyframeRows('Single-shot keyframes')}
          loop={keyframeRows('Loop keyframes')}
          reduced={reducedMotion()}
          shimmer={proseValue('gradient-shimmer-neutral')}
          palette={palette()}
        />
      </Panel>
    </>
  );
}
