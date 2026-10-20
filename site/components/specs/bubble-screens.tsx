// Help Bubble · Tooltip 페이지가 같이 쓰는 그림 조각(서버) — 트리거에 붙인 말풍선, HR 휴가 · Desk 자산 화면, 접힌 사이드바.
// 말풍선은 help-bubble.yaml 을 푼 값(menuKit().bubble — menu-view 의 BubbleView)으로, 버튼은 button.yaml 로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Info } from 'lucide-react';
import { ButtonView } from './button-view';
import { LEAVE_RULE, SEARCH_TIP } from './menu-data';
import type { BubbleSide } from './menu-look';
import { iconBtn, mk, type Brand } from './menu-screens';
import { BubbleView, type BubbleViewProps } from './menu-view';
import { GestureMark } from './overlay-view';
import { Phone, WebWindow, rc, type Mode } from './kit';
import { Bar, NK, ScreenTitle, Shell, Side } from './nav-screens';
import type { TopAction } from './nav-shared';
import { TopIconButton } from './nav-view';
import { cardFace } from './card-face';

export const bl = (brand: Brand = 'desk') => mk(brand).bubble;

// 말풍선(멈춘 그림) — 값은 help-bubble.yaml
export function Bubble({ brand = 'desk', ...p }: Omit<BubbleViewProps, 'look'> & { brand?: Brand }) {
  return <BubbleView look={bl(brand)} {...p} />;
}

// 트리거에 붙인 말풍선 — side 쪽으로 몸통 거리(화살표 끝 4 + 화살표 8), 화살표는 트리거 가운데.
// align='end' 면 화면 끝에 붙은 트리거 — 화살표는 트리거 가운데, 말풍선 끝 변은 화살표 가운데에서 모서리 14 + 화살표 폭의 반(20)만큼만
// 나간다(말풍선이 가장자리 16 보다 붙는다 — help-bubble.md "위치", 2026-10-15 Q-004-1)
export function BubbleAt({ trigger, side = 'top', align = 'center', triggerSize = 40, brand = 'desk', bubble, zIndex = 6 }: { trigger: ReactNode; side?: BubbleSide; align?: 'center' | 'end'; triggerSize?: number; brand?: Brand; bubble: (p: { side: BubbleSide; arrowEnd?: number }) => ReactNode; zIndex?: number }) {
  const { bodyOffset: off, arrow } = bl(brand);
  const reach = arrow.pad + arrow.width / 2;
  const vertical = side === 'top' || side === 'bottom';
  const endInset = triggerSize / 2 - reach;
  const along: CSSProperties = align === 'end' ? (vertical ? { right: endInset } : { bottom: endInset }) : vertical ? { left: '50%', transform: 'translateX(-50%)' } : { top: '50%', transform: 'translateY(-50%)' };
  const place: CSSProperties =
    side === 'top' ? { bottom: `calc(100% + ${off}px)`, ...along } : side === 'bottom' ? { top: `calc(100% + ${off}px)`, ...along } : side === 'left' ? { right: `calc(100% + ${off}px)`, ...along } : { left: `calc(100% + ${off}px)`, ...along };
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      {trigger}
      <span style={{ position: 'absolute', zIndex, ...place }}>{bubble({ side, arrowEnd: align === 'end' ? reach : undefined })}</span>
    </span>
  );
}

export const InfoButton = ({ mode = 'auto', brand = 'hr', label = '연차 사용 규정 안내', state = 'enabled' }: { mode?: Mode; brand?: Brand; label?: string; state?: 'enabled' | 'pressed' | 'focused' | 'hovered' }) => (
  <ButtonView look={iconBtn(brand, 'neutralSubtle')} mode={mode} state={state} icon="info" ariaLabel={label} />
);
// 상단 바의 알림(벨) — Top Navigation 아이콘 버튼(44 · 24). 말풍선 · 툴팁 그림의 트리거(머리 오른쪽 끝 — 화면 끝에서 6)
export const BellButton = ({ mode = 'auto', brand = 'desk', state }: { mode?: Mode; brand?: Brand; state?: 'pressed' | 'focused' | 'hovered' }) => (
  <TopIconButton look={NK(brand).top} mode={mode} state={state} icon="bell" label="알림" />
);

// HR 휴가 요약 — 남은 연차 + ⓘ(눌러서 여는 규정 안내). ⓘ 를 판 가운데에 두어 말풍선이 가운데로 열린다
// bubbleMax — 말풍선 최대 폭(화면이 좁으면 화면 − 가장자리 둘, 실제 말풍선과 같은 규칙)
export function LeaveSummary({ mode = 'auto', open = true, desc = true, gesture, bubbleMax }: { mode?: Mode; open?: boolean; desc?: boolean; gesture?: 'tap' | 'click'; bubbleMax?: number }) {
  // 누르는 손가락 · 마우스 표시는 ⓘ 오른쪽 아래에 걸친다(ⓘ 가 가려지지 않게)
  const info = (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <InfoButton mode={mode} />
      {gesture && <GestureMark kind={gesture} x="95%" y="100%" />}
    </span>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span style={{ fontSize: 13, lineHeight: '18px', color: rc('fg-neutral-subtle', mode, 'hr') }}>남은 연차</span>
      <span style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', width: '100%' }}>
        <span style={{ justifySelf: 'end', fontSize: 22, lineHeight: '30px', fontWeight: 700, color: rc('fg-neutral', mode, 'hr') }}>11일</span>
        {open ? <BubbleAt brand="hr" trigger={info} bubble={(p) => <Bubble brand="hr" mode={mode} title={LEAVE_RULE.title} description={desc ? LEAVE_RULE.description : undefined} maxWidth={bubbleMax} {...p} />} /> : info}
        <span />
      </span>
    </div>
  );
}
export function LeaveWindow({ mode = 'auto', w = 460, h = 280, overlay, gesture }: { mode?: Mode; w?: number; h?: number; overlay?: ReactNode; gesture?: 'tap' | 'click' }) {
  return (
    <WebWindow mode={mode} w={w} h={h} url="hr.groo.app">
      <div style={{ height: '100%', boxSizing: 'border-box', padding: '22px 28px', background: rc('bg-layer-basement', mode, 'hr') }}>
        <div style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, color: rc('fg-neutral', mode, 'hr'), paddingBottom: 14 }}>휴가</div>
        {/* 카드 — card.yaml 의 면(1px 테두리 · 모서리 16 · 여백 24). 위는 말풍선이 열릴 자리만큼 비운다 */}
        <div style={{ boxSizing: 'border-box', borderRadius: cardFace().radius, borderWidth: cardFace().borderW, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak', mode, 'hr'), paddingTop: 96, paddingRight: cardFace().pad, paddingBottom: cardFace().pad, paddingLeft: cardFace().pad, background: rc('bg-layer-default', mode, 'hr') }}>
          <LeaveSummary mode={mode} gesture={gesture} />
        </div>
      </div>
      {overlay}
    </WebWindow>
  );
}

// Desk 홈(폰) — 머리 오른쪽 검색 버튼(오른쪽 끝은 알림) 아래에 처음부터 열린 안내(닫기 버튼)
const ASSETS: [string, string][] = [
  ['국민 주계좌', '1,250,000원'],
  ['현대카드 M', '−352,400원'],
  ['토스뱅크 통장', '820,000원'],
];
export function AssetsPhone({ mode = 'auto', scale = 0.62, h = 560, bubble = true }: { mode?: Mode; scale?: number; h?: number; bubble?: boolean }) {
  // 상단 바 안 — Top Navigation 아이콘 버튼(44 · 24) — 검색 · 알림이 붙는다
  const btn = <TopIconButton look={NK().top} mode={mode} icon="search" label="검색" />;
  const bell = <TopIconButton look={NK().top} mode={mode} icon="bell" label="알림" />;
  return (
    <Phone
      title="홈"
      back={false}
      mode={mode}
      scale={scale}
      h={h}
      bg="bg-layer-default"
      right={
        <>
          {bubble ? <BubbleAt side="bottom" align="end" triggerSize={NK().top.icon.size} trigger={btn} bubble={(p) => <Bubble mode={mode} title={SEARCH_TIP.title} description={SEARCH_TIP.description} close {...p} />} /> : btn}
          {bell}
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 24px 0' }}>
        {ASSETS.map(([name, amount], i) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: i === ASSETS.length - 1 ? 'none' : `1px solid ${rc('stroke-neutral-subtle', mode)}` }}>
            <span style={{ fontSize: 15, lineHeight: '20px', color: rc('fg-neutral', mode) }}>{name}</span>
            <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700, color: rc('fg-neutral', mode) }}>{amount}</span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

// Desk 웹 — 접힌 사이드바(Side Navigation 56 — side-navigation.yaml) + 데스크톱 머리(top-navigation.yaml desktop — 내역 추가 · 알림 · 설정,
// 2026-10-16 금액 가리기 눈은 뺐다) + 본문 맨 위 화면 제목. tip 은 툴팁이 뜬 자리 — 'header' 는 머리의 설정(호버), 'sidebar' 는 접힌 사이드바의 자산
export const DESK_HEADER: TopAction[] = [
  { icon: 'bell', label: '알림' },
  { icon: 'settings', label: '설정' },
];
const TIP_AT = 1;
export function DeskToolWindow({ mode = 'auto', tip, w = 460, h = 300 }: { mode?: Mode; tip: 'header' | 'sidebar'; w?: number; h?: number }) {
  const b = bl();
  const actions = DESK_HEADER.map((a, i) => (i === TIP_AT && tip === 'header' ? { ...a, state: 'hovered' as const } : a));
  // 툴팁 — 설정 아래(머리 아래 본문 위로), 화살표는 단추 가운데
  const below = (
    <span aria-hidden style={{ position: 'absolute', zIndex: 6, top: `calc(100% + ${b.bodyOffset}px)`, left: '50%', transform: 'translateX(-50%)' }}>
      <Bubble mode={mode} title="설정" side="bottom" />
    </span>
  );
  return (
    <WebWindow mode={mode} w={w} h={h}>
      <Shell
        mode={mode}
        side={<Side mode={mode} collapsed current="ledger" height="100%" tip={tip === 'sidebar' ? 'assets' : undefined} states={tip === 'sidebar' ? { assets: 'hovered' } : undefined} />}
        header={<Bar mode={mode} type="desktop" actions={actions} primary={{ label: '내역 추가', icon: 'plus' }} actionPins={tip === 'header' ? { [TIP_AT]: below } : undefined} />}
      >
        <ScreenTitle mode={mode}>가계부</ScreenTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, paddingLeft: NK().margin, paddingRight: NK().margin }}>
          {[72, 56, 64].map((wd, i) => (
            <span key={i} style={{ display: 'block', height: 44, borderRadius: 10, background: rc('bg-layer-default', mode), width: `${wd}%` }} />
          ))}
        </div>
      </Shell>
    </WebWindow>
  );
}

// 터치 · 키보드에서 뜨지 않는 브라우저 기본 title(나쁜 예의 그림 — 브라우저가 그리는 모양이라 토큰이 아니다)
export function NativeTitle({ children }: { children: ReactNode }) {
  return <span style={{ display: 'inline-block', padding: '2px 6px', fontFamily: 'system-ui, sans-serif', fontSize: 12, lineHeight: '16px', color: '#000000', background: '#F7F7F7', border: '1px solid #767676', boxShadow: '1px 1px 3px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>{children}</span>;
}
export const InfoGlyph = ({ size = 16, color }: { size?: number; color?: string }) => <Info size={size} strokeWidth={2} color={color} aria-hidden />;
