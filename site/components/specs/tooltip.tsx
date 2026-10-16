// Tooltip 페이지의 그림 — specs/components/tooltip.md 의 `[그림: …](../../site/components/specs/tooltip.tsx#<id>)` 자리.
// 툴팁은 Help Bubble 과 같은 말풍선이다 — help-bubble.yaml 을 푼 값(menuKit().bubble, opens: hover 의 열림 · 닫힘 지연)으로 그린다. 버튼은 button.yaml.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { DisabledReasonDemo, ToolbarTooltipDemo, TooltipPlayground } from './bubble-demos';
import { BellButton, Bubble, BubbleAt, DeskToolWindow, LeaveSummary, NativeTitle, bl } from './bubble-screens';
import { NK } from './nav-screens';
import { COPY_REASON } from './menu-data';
import { Board, Scaled, mk } from './menu-screens';
import { Legend, pinStyle } from './overlay-screens';
import { MousePointer2 } from 'lucide-react';
import { Phone, Verdict, rc } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const markBox: CSSProperties = { ...dashed, background: MARK };
const BASEMENT = 'var(--p-bg-layer-basement)';

// ── Overview ──────────────────────────────────────────────
// 머리 툴바의 아이콘 버튼 · 접힌 사이드바의 아이콘 — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-wrap items-start justify-center gap-4">
          <Scaled w={460} h={300} s={0.66}>
            <DeskToolWindow mode={mode} tip="header" />
          </Scaled>
          <Scaled w={460} h={300} s={0.66}>
            <DeskToolWindow mode={mode} tip="sidebar" />
          </Scaled>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <TooltipPlayground kits={{ desk: mk('desk'), hr: mk('hr') }} tops={{ desk: NK('desk').top, hr: NK('hr').top }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const b = bl();
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Board style={{ padding: `${32 + b.height + b.bodyOffset}px 80px 28px` }}>
          <BubbleAt
            trigger={<BellButton state="hovered" />}
            bubble={(p) => (
              <Bubble
                title="알림"
                marks={{ root: dashed, title: markBox }}
                decor={
                  <>
                    {pinStyle('ⓐ', { left: -30, top: (b.height - 20) / 2 })}
                    {pinStyle('ⓑ', { left: 'calc(50% + 12px)', top: `calc(100% + ${b.arrow.height / 2 - 10}px)` })}
                    {pinStyle('ⓒ', { right: -30, top: (b.height - 20) / 2 })}
                  </>
                }
                {...p}
              />
            )}
          />
        </Board>
        <Legend
          items={[
            ['ⓐ', 'Container — Help Bubble 과 같다'],
            ['ⓑ', 'Arrow — 늘 트리거 가운데'],
            ['ⓒ', 'Title — 글 하나(굵게)'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── 여는 방식 — 마우스 200ms · 키보드 바로 · 이어서 옮기면 바로 ─────
// 시간 축 위에 세 줄 — 막대는 말풍선이 보이는 동안, 앞의 흐린 부분은 열림 모션. 위 눈금은 사람이 한 일, 아래 눈금은 지연
const SCALE = 0.6;
const SPAN = 760;
const LANE_H = 66;
const BAR_TOP = 22;
const BAR_H = 22;
function Lane({ name, children, note }: { name: string; children: ReactNode; note: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-[56px] shrink-0 text-right text-[13px] font-bold pk-text" style={{ paddingTop: BAR_TOP + 2 }}>
        {name}
      </span>
      <div className="flex flex-col gap-1" style={{ width: SPAN * SCALE }}>
        <div className="relative" style={{ height: LANE_H }}>
          <span aria-hidden className="absolute left-0 right-0" style={{ top: BAR_TOP + BAR_H / 2, borderTop: `1px solid ${rc('stroke-neutral-weak')}` }} />
          {children}
        </div>
        <span className="text-[12px] leading-4 pk-muted">{note}</span>
      </div>
    </div>
  );
}
// 말풍선이 보이는 구간 — from · to(ms), fade 는 열림 모션 길이(ms, 0 이면 모션 없이)
function Shown({ from, to, fade, label }: { from: number; to: number; fade: number; label: string }) {
  const bg = rc('bg-neutral-inverted');
  const w = (to - from) * SCALE;
  const f = Math.min(w, fade * SCALE);
  return (
    <span className="absolute flex items-center" style={{ left: from * SCALE, width: w, top: BAR_TOP, height: BAR_H, borderRadius: 6, overflow: 'hidden', background: `linear-gradient(90deg, transparent 0, ${bg} ${f}px, ${bg} 100%)` }}>
      <span className="ml-auto mr-2 whitespace-nowrap text-[11px] font-bold" style={{ color: rc('fg-neutral-inverted') }}>
        {label}
      </span>
    </span>
  );
}
// 사건 — 위(사람이 한 일) · 아래(지연이 끝난 때) 눈금과 이름
function Tick({ at, label, below = false }: { at: number; label: string; below?: boolean }) {
  return (
    <span className="absolute flex flex-col items-center" style={{ left: at * SCALE, top: below ? BAR_TOP + BAR_H / 2 : 0, transform: 'translateX(-50%)' }}>
      {!below && <span className="whitespace-nowrap text-[10px] font-bold leading-3" style={{ color: MARK_LINE }}>{label}</span>}
      <span style={{ width: 0, height: below ? BAR_H / 2 + 6 : BAR_TOP - 12 + BAR_H / 2, borderLeft: `2px solid ${MARK_LINE}` }} />
      {below && <span className="whitespace-nowrap text-[10px] font-bold leading-3" style={{ color: MARK_LINE }}>{label}</span>}
    </span>
  );
}
const Timing: Fig = ({ caption }) => {
  const b = bl();
  const open = b.hover.open;
  const close = b.hover.close;
  const motion = parseFloat(b.motion.open.duration);
  const skip = b.hover.skip;
  const leave = 560;
  // 이어서 — 앞 툴팁이 닫힌 때 · 옆 트리거로 옮긴 때(이어 열기 시간 안)
  const closedAt = 260;
  const movedAt = closedAt + Math.round(skip / 3);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-5">
        <Lane name="마우스" note={`올리고 ${open}ms 뒤에 연다 · 트리거와 말풍선을 모두 벗어나면 ${close}ms 뒤에 닫는다(말풍선 위로 옮기는 동안은 열어 둔다)`}>
          <Tick at={0} label="올림" />
          <Shown from={open} to={leave + close} fade={motion} label="알림" />
          <Tick at={open} label={`${open}ms`} below />
          <Tick at={leave} label="벗어남" />
          <Tick at={leave + close} label={`+${close}ms`} below />
        </Lane>
        <Lane name="키보드" note="Tab 으로 초점이 오면 기다리지 않고 바로 연다 · 초점이 떠나면 닫는다">
          <Tick at={0} label="Tab" />
          <Shown from={0} to={leave} fade={motion} label="알림" />
          <Tick at={leave} label="초점 떠남" />
        </Lane>
        <Lane name="이어서" note={`하나가 열린 동안이나 닫힌 뒤 ${skip}ms 안에 옆 트리거로 옮기면 기다리지 않고 모션 없이 바로 연다`}>
          <Shown from={0} to={closedAt} fade={0} label="알림" />
          <Tick at={closedAt} label="닫힘" />
          {/* 이어 열기 시간 — 닫힌 뒤 이 안에 옮기면 바로 */}
          <span aria-hidden className="absolute flex items-center justify-center" style={{ left: closedAt * SCALE, width: skip * SCALE, top: BAR_TOP + BAR_H + 4, height: 12, borderLeft: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }}>
            <span className="absolute left-0 right-0 top-1/2" style={{ borderTop: `1px dashed ${MARK_LINE}` }} />
            <span className="relative rounded px-1 text-[10px] font-bold leading-3 text-white" style={{ background: MARK_LINE }}>{`${skip}ms`}</span>
          </span>
          <Tick at={movedAt} label="옆으로 옮김" />
          <Shown from={movedAt} to={SPAN} fade={0} label="설정" />
        </Lane>
        {/* 시간 축 */}
        <div className="flex items-start gap-3">
          <span className="w-[56px] shrink-0" />
          <div className="relative" style={{ width: SPAN * SCALE, height: 22, borderTop: `1px solid ${rc('stroke-neutral-subtle')}` }}>
            {Array.from({ length: Math.floor(SPAN / 100) + 1 }, (_, i) => i * 100).map((t) => (
              <span key={t} className="absolute flex flex-col items-center text-[10px] leading-3 pk-muted" style={{ left: t * SCALE, top: 0, transform: 'translateX(-50%)' }}>
                <span style={{ width: 0, height: 4, borderLeft: `1px solid ${rc('stroke-neutral-subtle')}` }} />
                {t === 0 ? '0' : `${t}`}
              </span>
            ))}
            <span className="absolute text-[10px] leading-3 pk-muted" style={{ right: -22, top: 4 }}>
              ms
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-[68px] text-[11px] pk-muted">
          <span className="inline-block h-3 w-8 shrink-0 rounded-sm" style={{ background: `linear-gradient(90deg, transparent, ${rc('bg-neutral-inverted')})` }} />
          열림 모션 {b.motion.open.duration}(크기 {b.motion.from} → 1 · 나타남) · 이어서 열 때는 없다 · 손가락으로 누르면 열지 않는다
        </div>
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 이름은 aria-label · 막힌 이유는 가까운 글 · 툴팁에만 두지 않는다
const AssistGuide: Fig = ({ caption }) => {
  const b = bl();
  const weak = buttonLook({ variant: 'neutralWeak', size: 'medium' });
  return (
    <Panel caption={caption}>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Verdict ok note="아이콘 버튼의 이름은 aria-label — 툴팁은 그 이름을 마우스 · 키보드 사용자에게 보여 줄 뿐이다" bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3" style={{ paddingTop: b.height + b.bodyOffset }}>
            <BubbleAt trigger={<BellButton state="focused" />} bubble={(p) => <Bubble title="알림" {...p} />} />
            <code className="rounded px-1.5 py-0.5 text-[12px]" style={{ background: rc('bg-layer-default'), color: rc('fg-neutral') }}>
              aria-label=&quot;알림&quot;
            </code>
          </div>
        </Verdict>
        <Verdict ok note="막힌 버튼은 초점을 받지 못한다 — 왜 안 되는지는 버튼 가까이 글로 보인다" bg={BASEMENT}>
          <div className="flex flex-col items-start gap-1.5 rounded-xl p-5" style={{ background: rc('bg-layer-default') }}>
            <ButtonView look={weak} state="disabled" label="지난달 예산 복사" />
            <span className="text-[13px] leading-[18px]" style={{ color: rc('fg-neutral-subtle') }}>
              {COPY_REASON}
            </span>
          </div>
        </Verdict>
        <Verdict ok={false} note="막힌 이유를 툴팁 · 네이티브 title 에만 — 마우스를 올려야만 보이고, 손가락 · 키보드로는 끝내 볼 수 없다" bg={BASEMENT}>
          <div className="flex flex-col items-start gap-1 rounded-xl p-5" style={{ background: rc('bg-layer-default') }}>
            <span className="relative inline-flex">
              <ButtonView look={weak} state="disabled" label="지난달 예산 복사" />
              <span className="absolute" style={{ left: '62%', top: '70%' }}>
                <MousePointer2 size={16} fill="#1A1F2E" color="#FFFFFF" strokeWidth={1.5} aria-hidden />
              </span>
            </span>
            <span style={{ marginLeft: 72 }}>
              <NativeTitle>{COPY_REASON.replace(/\.$/, '')}</NativeTitle>
            </span>
          </div>
        </Verdict>
        <Verdict ok note="폰에서도 읽어야 하는 설명은 ⓘ 를 눌러 여는 Help Bubble 로" bg={BASEMENT}>
          <Phone title="휴가" back={false} scale={0.5} h={420} bg="bg-layer-default">
            <div style={{ padding: `${24 + bl('hr').heightDesc + bl('hr').bodyOffset + 20}px 24px 0` }}>
              <LeaveSummary gesture="tap" />
            </div>
          </Phone>
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 마우스 · 키보드로 연다) ─────────────────
const ExIcon: Fig = () => <ToolbarTooltipDemo kit={mk()} top={NK().top} />;
const ExDisabled: Fig = () => <DisabledReasonDemo kit={mk()} weak={buttonLook({ variant: 'neutralWeak', size: 'medium' })} />;

export const tooltipFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  timing: Timing,
  'assist-guide': AssistGuide,
  'ex-icon': ExIcon,
  'ex-disabled': ExDisabled,
};
