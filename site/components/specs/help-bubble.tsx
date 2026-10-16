// Help Bubble 페이지의 그림 — specs/components/help-bubble.md 의 `[그림: …](../../site/components/specs/help-bubble.tsx#<id>)` 자리.
// 말풍선은 help-bubble.yaml 을 푼 값(menuKit().bubble — menu-view 의 BubbleView)으로, 버튼은 button.yaml, 팝오버는 popover.yaml 로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { HelpBubblePlayground, HideTipDemo, LeaveRuleDemo } from './bubble-demos';
import { AssetsPhone, BellButton, Bubble, BubbleAt, InfoButton, InfoGlyph, LeaveSummary, LeaveWindow, bl } from './bubble-screens';
import { NK } from './nav-screens';
import { LEAVE_RULE } from './menu-data';
import { Board, Scaled, iconBtn, mk } from './menu-screens';
import { Legend, Note, RuleBody, Shot, ov, pinStyle } from './overlay-screens';
import { EndButtons, PopoverSurface } from './overlay-view';
import { Cap } from './select-screens';
import { PHONE_W, Phone, rc } from './kit';
import { TopNavBar } from './nav-view';

type Fig = (p: { caption?: string }) => ReactNode;
const px = (v: string) => parseFloat(v);
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const markBox: CSSProperties = { ...dashed, background: MARK };
function Band({ style, label }: { style: CSSProperties; label?: string }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center justify-center" style={{ background: MARK, zIndex: 4, ...style }}>
      {label && <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>{label}</span>}
    </span>
  );
}
const Tag = ({ children, style }: { children: ReactNode; style: CSSProperties }) => (
  <span aria-hidden className="pointer-events-none absolute whitespace-nowrap text-[11px] font-bold leading-4" style={{ color: MARK_LINE, zIndex: 5, ...style }}>
    {children}
  </span>
);

// ── Overview ──────────────────────────────────────────────
// HR 연차 사용 규정(ⓘ 를 눌러서) · Desk 거래 검색 안내(처음부터 열린 안내 — 닫기 버튼, 홈 상단 바의 검색) — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-wrap items-start justify-center gap-4">
          <Scaled w={460} h={280} s={0.72}>
            <LeaveWindow mode={mode} />
          </Scaled>
          <AssetsPhone mode={mode} scale={0.52} h={540} />
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <HelpBubblePlayground kits={{ desk: mk('desk'), hr: mk('hr') }} infos={{ desk: iconBtn('desk', 'neutralSubtle'), hr: iconBtn('hr', 'neutralSubtle') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const b = bl('hr');
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Board brand="hr" style={{ padding: '40px 64px 28px' }}>
          <div style={{ paddingTop: b.heightDesc + b.bodyOffset }}>
            <BubbleAt
              brand="hr"
              trigger={<InfoButton />}
              bubble={(p) => (
                <Bubble
                  brand="hr"
                  title={LEAVE_RULE.title}
                  description={LEAVE_RULE.description}
                  close
                  marks={{ root: dashed, title: markBox, description: markBox, close: markBox }}
                  decor={
                    <>
                      {pinStyle('ⓐ', { left: -30, top: 4 })}
                      {pinStyle('ⓑ', { left: 'calc(50% + 12px)', top: `calc(100% + ${b.arrow.height / 2 - 10}px)` })}
                      {pinStyle('ⓒ', { left: -30, top: b.padY - 1 })}
                      {pinStyle('ⓓ', { left: -30, top: b.padY + px(b.title.lineHeight) + b.descGap + 8 })}
                      {pinStyle('ⓔ', { right: -30, top: (b.close.size - 20) / 2 })}
                    </>
                  }
                  {...p}
                />
              )}
            />
          </div>
        </Board>
        <Legend
          items={[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Arrow — 늘 트리거 가운데'],
            ['ⓒ', 'Title'],
            ['ⓓ', 'Description'],
            ['ⓔ', 'Close Button — 남겨 둘 안내에만'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── 말풍선의 여백 · 화살표 · 간격 ──────────────────────────
// 한 줄(제목만) · 설명 + 닫기 버튼 · 긴 설명(최대 폭) — 셋을 위아래로
const HeightTag = ({ label }: { label: string }) => (
  <span aria-hidden className="pointer-events-none absolute flex items-center" style={{ top: 0, bottom: 0, left: 'calc(100% + 10px)', zIndex: 4 }}>
    <span style={{ alignSelf: 'stretch', width: 6, borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }} />
    <span className="ml-1 whitespace-nowrap text-[11px] font-bold leading-4" style={{ color: MARK_LINE }}>
      {label}
    </span>
  </span>
);
function LayoutRow({ children, top }: { children: ReactNode; top: number }) {
  return (
    <div className="flex justify-center" style={{ width: 300, paddingTop: top }}>
      {children}
    </div>
  );
}
const Layout: Fig = ({ caption }) => {
  const b = bl();
  const lh = px(b.title.lineHeight);
  const c = b.close;
  const grow = (c.hit - c.size) / 2;
  const pads = (
    <>
      <Band style={{ left: 0, right: 0, top: 0, height: b.padY }} label={String(b.padY)} />
      <Band style={{ left: 0, right: 0, bottom: 0, height: b.padY }} />
      <Band style={{ left: 0, top: b.padY, bottom: b.padY, width: b.padX }} label={String(b.padX)} />
    </>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="max-w-full overflow-x-auto">
        <Board style={{ padding: '20px 120px 28px 48px' }}>
          <div className="flex flex-col gap-2">
            {/* 한 줄 — 제목만 */}
            <LayoutRow top={b.height + b.bodyOffset}>
              <BubbleAt
                trigger={<BellButton />}
                bubble={(p) => (
                  <Bubble
                    title="알림"
                    decor={
                      <>
                        {pads}
                        <Band style={{ right: 0, top: b.padY, bottom: b.padY, width: b.padX }} />
                        <HeightTag label={`${b.height}`} />
                        <Band style={{ left: `calc(50% - ${b.arrow.width / 2}px)`, width: b.arrow.width, top: `calc(100% + ${b.arrow.height}px)`, height: b.offset }} />
                        <Tag style={{ left: `calc(50% + ${b.arrow.width / 2 + 28}px)`, top: `calc(100% + ${b.arrow.height - 6}px)` }}>{`화살표 끝 ↔ 트리거 ${b.offset} · 몸통 ↔ 트리거 ${b.bodyOffset}`}</Tag>
                      </>
                    }
                    {...p}
                  />
                )}
              />
            </LayoutRow>
            {/* 설명 + 닫기 버튼 */}
            <LayoutRow top={b.heightDesc + b.bodyOffset + 24}>
              <BubbleAt
                trigger={<InfoButton brand="desk" label="금액 가리기 안내" />}
                bubble={(p) => (
                  <Bubble
                    title="금액 가리기"
                    description="가릴 카드는 설정에서 골라요."
                    close
                    marks={{ closeHit: dashed, close: markBox }}
                    decor={
                      <>
                        {pads}
                        <Band style={{ left: b.padX, right: c.size + c.gap, top: b.padY + lh, height: b.descGap }} />
                        <HeightTag label={`${b.heightDesc}`} />
                        <Tag style={{ right: -grow, bottom: `calc(100% + ${grow + 4}px)` }}>{`닫기 ${c.size} · 누르는 영역 ${c.hit}(점선) · 아이콘 ${c.icon}`}</Tag>
                        <Tag style={{ right: `calc(50% + ${b.arrow.width / 2 + 28}px)`, top: `calc(100% + ${b.arrow.height - 6}px)` }}>{`화살표 ${b.arrow.width} × ${b.arrow.height} · 끝 모서리 ${b.arrow.tip}`}</Tag>
                      </>
                    }
                    {...p}
                  />
                )}
              />
            </LayoutRow>
            {/* 키보드 초점 — 닫기 버튼은 안쪽 링(말풍선 글자색), 닫기 버튼이 없는 말풍선은 둘레 바깥 링(브랜드 링) */}
            <LayoutRow top={b.heightDesc + b.bodyOffset + 30}>
              <div className="flex items-end gap-6">
                <BubbleAt
                  trigger={<InfoButton brand="desk" label="금액 가리기 안내" />}
                  bubble={(p) => (
                    <Bubble
                      title="금액 가리기"
                      description="가릴 카드는 설정에서 골라요."
                      close
                      closeState="focused"
                      decor={<Tag style={{ right: -grow, bottom: `calc(100% + ${grow + 4}px)` }}>{`닫기 링 — 안쪽 ${-b.ring.offset} · 글자색`}</Tag>}
                      {...p}
                    />
                  )}
                />
              </div>
            </LayoutRow>
            <LayoutRow top={b.height + b.bodyOffset + 24}>
              <BubbleAt
                trigger={<InfoButton brand="desk" label="금액 가리기 안내" />}
                bubble={(p) => <Bubble title="금액 가리기" rootRing decor={<Tag style={{ left: 'calc(100% + 10px)', top: (b.height - 16) / 2 }}>{`말풍선 링 — 바깥 ${b.ring.rootOffset} · 브랜드 링`}</Tag>} {...p} />}
              />
            </LayoutRow>
            {/* 긴 설명 — 최대 폭에서 줄을 바꾼다 */}
            <LayoutRow top={b.heightDesc + lh + b.bodyOffset + 24}>
              <BubbleAt
                trigger={<InfoButton brand="desk" label="연차 사용 규정 안내" />}
                bubble={(p) => (
                  <Bubble
                    title={LEAVE_RULE.title}
                    description={LEAVE_RULE.description}
                    decor={
                      <span aria-hidden className="pointer-events-none absolute left-0 right-0 flex items-center justify-center" style={{ bottom: 'calc(100% + 6px)', height: 12, borderLeft: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }}>
                        <span className="absolute left-0 right-0 top-1/2" style={{ borderTop: `1px dashed ${MARK_LINE}` }} />
                        <span className="relative rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>{`최대 ${b.maxWidth}`}</span>
                      </span>
                    }
                    {...p}
                  />
                )}
              />
            </LayoutRow>
          </div>
        </Board>
        </div>
        <Note>
          위아래 {b.padY} · 좌우 {b.padX} · 모서리 {b.radius} · 그림자 없음 — 제목 {px(b.title.fontSize)} / {lh} · {b.title.fontWeight}, 설명 {px(b.description.fontSize)} / {px(b.description.lineHeight)} · {b.description.fontWeight}, 사이 {b.descGap} → 한 줄 {b.height} · 설명이 있으면 {b.heightDesc}
          <br />
          폭은 내용만큼 · 최대 {b.maxWidth}(여백 포함, 화면이 좁으면 화면 − 양쪽 {b.edge}) — 화살표 {b.arrow.width} × {b.arrow.height}, 화살표 상자 끝과 트리거 {b.offset}(몸통과 {b.bodyOffset}) · 닫기 상자 {c.size}(위 0 · 오른쪽 0 · 모서리 {c.radius}, 점선은 누르는 영역 {c.hit}) · 아이콘 {c.icon} · 글과 상자 사이 {c.gap}
          <br />
          키보드 초점 — 닫기 버튼은 안쪽 {b.ring.width} 링(말풍선 글자색), 닫기 버튼이 없는 말풍선에 Tab 으로 들어오면 둘레 바깥 {b.ring.rootOffset} 에 {b.ring.width} 링(브랜드 링)
        </Note>
      </div>
    </Panel>
  );
};

// ── 위치 ──────────────────────────────────────────────────
// 위 · 아래 · 왼쪽 · 오른쪽 — 화살표는 늘 트리거 가운데. 끝에 붙은 작은 트리거는 말풍선을 민다
function Cell({ children, label, h = 150, w = 260 }: { children: ReactNode; label: ReactNode; h?: number; w?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center rounded-xl" style={{ width: w, height: h, maxWidth: '100%', background: rc('bg-layer-default') }}>
        {children}
      </div>
      <Cap>{label}</Cap>
    </div>
  );
}
// 화면 끝의 트리거 — 화살표는 트리거 가운데에 남고(모서리 14) 말풍선이 가장자리 16 보다 붙는다(2026-10-15 Q-004-1).
// ① 상단 바 오른쪽 끝의 알림(아이콘 버튼 44 · 화면 끝 6) — 말풍선 끝이 화면 끝에서 8 ② 화면 왼쪽 끝 0 에 붙은 ⓘ 40 — 0
function EdgeScenes() {
  const b = bl();
  const top = NK().top;
  const W = PHONE_W;
  const reach = b.arrow.pad + b.arrow.width / 2;
  const hit = top.icon.size;
  const cx1 = W - top.padX - hit / 2;
  const edge1 = W - (cx1 + reach);
  const info = 40;
  const cx2 = info / 2;
  const edge2 = cx2 - reach;
  // 세로 보조선 — 화면 왼쪽(left) · 오른쪽(right)에서 잰다(폭이 좁아져도 그 끝에 붙은 트리거와 함께 간다)
  const guide = (at: { left: number } | { right: number }) => <span aria-hidden className="pointer-events-none absolute bottom-0 top-0" style={{ ...at, borderLeft: `1px dashed ${MARK_LINE}`, zIndex: 7 }} />;
  const scene = (label: ReactNode, body: ReactNode) => (
    <div className="flex w-full flex-col items-center gap-2" style={{ maxWidth: W }}>
      <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 190, background: rc('bg-layer-default') }}>
        {body}
      </div>
      <Cap>{label}</Cap>
    </div>
  );
  const bell = <BellButton />;
  // 오른쪽 끝 알림의 안내 — 지어낸 글
  const BELL_TIP = { title: '알림을 모아 봐요', description: '카드 결제 · 예산 알림이 오면 점이 생겨요.' };
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-4">
      {scene(
        `① 상단 바 끝의 알림(${hit} · 화면 끝 ${top.padX}) — 화살표는 버튼 가운데, 말풍선 끝은 화면 끝에서 ${edge1}(가장자리 ${b.edge} 보다 붙는다)`,
        <>
          <TopNavBar look={top} type="root" title="홈" trailing={<BubbleAt side="bottom" align="end" triggerSize={hit} trigger={bell} bubble={(p) => <Bubble title={BELL_TIP.title} description={BELL_TIP.description} close {...p} />} />} />
          {guide({ right: b.edge })}
          {guide({ right: W - cx1 })}
          <Tag style={{ right: b.edge + 4, bottom: 6 }}>{`가장자리 ${b.edge}`}</Tag>
          <Tag style={{ right: 4, bottom: 22 }}>{`화면 끝 ${edge1}`}</Tag>
        </>,
      )}
      {scene(
        `② 화면 왼쪽 끝 0 에 붙은 ⓘ ${info} — 화살표는 ⓘ 가운데, 말풍선은 화면 끝 ${edge2} 까지`,
        <>
          <span className="absolute flex items-center" style={{ left: 0, top: 24, height: info }}>
            <span className="relative flex items-center justify-center" style={{ width: info, height: info, color: rc('fg-neutral-subtle') }}>
              <InfoGlyph size={20} />
              <span style={{ position: 'absolute', zIndex: 6, top: `calc(100% + ${b.bodyOffset}px)`, left: cx2 - reach }}>
                <Bubble title="예상 환급액" description="지난달까지 받은 급여로 계산해요. 12월에 다시 바뀌어요." side="bottom" arrowAt={reach} />
              </span>
            </span>
            <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500, color: rc('fg-neutral') }}>예상 환급액</span>
          </span>
          {guide({ left: b.edge })}
          {guide({ left: cx2 })}
          <Tag style={{ left: b.edge + 4, bottom: 6 }}>{`가장자리 ${b.edge}`}</Tag>
          <Tag style={{ left: 4, bottom: 22 }}>{`화면 끝 ${edge2}`}</Tag>
        </>,
      )}
    </div>
  );
}

const Placement: Fig = ({ caption }) => {
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
            <Cell key={side} label={side === 'top' ? '위(기본)' : side === 'bottom' ? '아래 — 위에 자리가 없으면' : side === 'left' ? '왼쪽' : '오른쪽'}>
              <BubbleAt side={side} trigger={<BellButton />} bubble={(p) => <Bubble title="알림" {...p} />} />
            </Cell>
          ))}
        </div>
        <EdgeScenes />
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 도움말의 자리 — 툴팁 · 말풍선 · 화면 안 글 · 팝오버
const RoleGuide: Fig = ({ caption }) => {
  const po = ov('hr').popover;
  const s = po.footer.button.size;
  return (
    <Panel caption={caption}>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Shot strong="Tooltip — 마우스 · 키보드" cap="아이콘 버튼의 이름 · 줄인 글 — 손가락으로는 열리지 않는다">
          <Board pad={24} style={{ width: 280, paddingTop: 24 + bl().height + bl().bodyOffset }}>
            <div className="flex justify-center">
              <BubbleAt trigger={<BellButton state="hovered" />} bubble={(p) => <Bubble title="알림" {...p} />} />
            </div>
          </Board>
        </Shot>
        <Shot strong="Help Bubble — ⓘ 를 눌러서" cap="몰라도 일은 할 수 있는 설명 — 규정 · 계산 방법 · 기능 안내">
          <Board brand="hr" pad={24} style={{ width: 280, paddingTop: 24 + bl('hr').heightDesc + bl('hr').bodyOffset + 18 }}>
            <LeaveSummary bubbleMax={280 - bl('hr').edge * 2} />
          </Board>
        </Shot>
        <Shot strong="화면 안 글" cap="일을 하려면 꼭 읽어야 하는 안내 — 숨기지 않는다">
          <Board brand="hr" pad={24} style={{ width: 280 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 14, lineHeight: '19px', fontWeight: 700, color: rc('fg-neutral', 'auto', 'hr') }}>휴가 시작일</span>
              <span style={{ display: 'block', height: 44, borderRadius: 12, background: rc('bg-layer-default', 'auto', 'hr'), boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak', 'auto', 'hr')}` }} />
              <span style={{ fontSize: 13, lineHeight: '18px', color: rc('fg-neutral-muted', 'auto', 'hr') }}>연차는 하루 전까지 신청해야 해요.</span>
            </div>
          </Board>
        </Shot>
        <Shot strong="Popover — 버튼 · 입력이 있는 내용" cap="누를 것이 있으면 말풍선이 아니라 팝오버">
          <PopoverSurface look={po} mode="auto" title={LEAVE_RULE.title} width={280} avail={280} footer={<EndButtons items={[{ label: '규정 전체 보기', look: buttonLook({ variant: 'neutralWeak', size: s }, 'hr') }]} />}>
            <RuleBody mode="auto" short />
          </PopoverSurface>
        </Shot>
      </div>
    </Panel>
  );
};

// 터치에서도 닿는 도움말 — ⓘ 를 눌러 여는 말풍선(폰 · 데스크톱)
const TouchGuide: Fig = ({ caption }) => {
  const b = bl('hr');
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Shot strong="폰 — 손가락으로 눌러서" cap="다시 누르거나 바깥을 누르면 닫힌다">
          <Phone title="휴가" back={false} scale={0.62} h={520} bg="bg-layer-default">
            <div style={{ position: 'relative', padding: `${24 + b.heightDesc + b.bodyOffset + 20}px 24px 0` }}>
              <LeaveSummary gesture="tap" />
            </div>
          </Phone>
        </Shot>
        <Shot strong="데스크톱 — 눌러서(마우스 · 키보드)" cap="Enter · Space 로도 열고, Tab 으로 말풍선에 들어간다">
          <Scaled w={460} h={280} s={0.62}>
            <LeaveWindow gesture="click" />
          </Scaled>
        </Shot>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 닫는다) ────────────────────────
const ExInfo: Fig = () => <LeaveRuleDemo kit={mk('hr')} info={iconBtn('hr', 'neutralSubtle')} />;
const ExClose: Fig = () => <HideTipDemo kit={mk()} top={NK().top} />;

export const helpBubbleFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  placement: Placement,
  'role-guide': RoleGuide,
  'touch-guide': TouchGuide,
  'ex-info': ExInfo,
  'ex-close': ExClose,
};
