// Toggle 페이지의 그림 — specs/components/toggle.md 의 `[그림: …](../../site/components/specs/toggle.tsx#<id>)` 자리.
// 단추는 toggle.yaml 을 푼 값(toggleLook — toggle-view)으로, 상단 바 안의 단추는 Top Navigation 아이콘 버튼(top-navigation.yaml — 44 · 24,
// 끔도 fg-neutral · 19B)으로, 카드 · 순자산 카드는 card.yaml(data-card-view)로 그린다. 순자산 카드의 금액 가리기 눈은 Toggle 이 아니다 —
// 같은 상자 · 색을 빌린 이동 단추(ToggleView link — aria-pressed 없음, 2026-10-16 Q-017-2b A · 3c B). 종목 · 메모 · 금액은 지어낸 것이다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { chipLook } from './chip-look';
import { ChipGroupView, ChipView } from './chip-view';
import { cardLook } from './data-look';
import { CardSurface, HeroCardView } from './data-card-view';
import { snackbarLook } from './feedback-look';
import { tokenValue } from '@/lib/component-spec';
import { toggleLook, type ToggleLook, type ToggleState } from './input-look';
import { Phone, Verdict, rc, type Mode } from './kit';
import { NK } from './nav-screens';
import { TopIconButton } from './nav-view';
import { Band, Legend, Shot, pinStyle } from './overlay-screens';
import { Cap, Surface } from './select-screens';
import { switchLook } from './switch-look';
import { SwitchView } from './switch-view';
import { ExEyeDemo, ExInvertedDemo, ExPinDemo, ExWatchDemo, Readout, TogglePlayground } from './toggle-play';
import { ToggleView } from './toggle-view';
import { TOGGLES, toggleReadout, type ToggleIcon, type ToggleKind } from './input-shared';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';
const T = (brand: Brand = 'desk') => toggleLook(brand);
const CL = () => cardLook();
const STATE_KO: Record<ToggleState, string> = { enabled: '기본', hovered: '호버(웹)', focused: '포커스(키보드)', pressed: '누름', disabled: '막힘' };
const gutter = () => parseFloat(String(tokenValue('$spacing-global-gutter')));
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;

// 멈춘 단추
function Tg({ kind, pressed = false, state = 'enabled', mode = 'auto', tone = 'default', icon, brand = 'desk', style }: { kind: ToggleKind; pressed?: boolean; state?: ToggleState; mode?: Mode; tone?: 'default' | 'inverted'; icon?: ToggleIcon; brand?: Brand; style?: CSSProperties }) {
  const k = TOGGLES[kind];
  return <ToggleView look={T(brand)} mode={mode} state={state} pressed={pressed} icon={icon ?? k.icon} pressedIcon={icon ? undefined : k.pressedIcon} tone={tone} ariaLabel={k.label} style={style} />;
}
// 상단 바 안에 둔다면 — Top Navigation 아이콘 버튼(44 · 24) · 끔도 fg-neutral(19B). 지금 상단 바에 켜고 끄는 단추를 두는 화면은 없다
const TopStar = ({ on = false, mode = 'auto' }: { on?: boolean; mode?: Mode }) => <TopIconButton look={NK().top} mode={mode} icon="star" label="관심 등록" pressed={on} />;
const TopBell = ({ mode = 'auto' }: { mode?: Mode }) => <TopIconButton look={NK().top} mode={mode} icon="bell" label="알림" />;
// 순자산 카드의 금액 가리기 눈 — Toggle 이 아니다(설정으로 가는 버튼 · aria-pressed 없음 · 아이콘은 그 카드가 가려졌는지 · 흰 아이콘만)
const EyeLink = ({ hidden = false, mode = 'auto', tone = 'inverted', state }: { hidden?: boolean; mode?: Mode; tone?: 'default' | 'inverted'; state?: ToggleState }) => (
  <ToggleView look={T()} mode={mode} tone={tone} link ariaLabel="금액 가리기 설정" icon={hidden ? 'eye-off' : 'eye'} state={state} />
);

// 카드 한 장 — 제목 줄 오른쪽에 단추(위 · 오른쪽 8 당김 — card.md 의 peers 코드), 아래 한 줄
function ToggleCard({ title, sub, toggle, mode = 'auto' }: { title: string; sub: string; toggle: ReactNode; mode?: Mode }) {
  const c = CL();
  return (
    <CardSurface look={c} mode={mode}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: c.content.gap }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: c.header.gap }}>
          <span style={{ fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: rc('fg-neutral', mode), minWidth: 0 }}>{title}</span>
          <span style={{ display: 'flex', flexShrink: 0, marginTop: -c.header.gap, marginRight: -c.header.gap }}>{toggle}</span>
        </div>
        <span style={{ fontFamily: c.stat.label.fontFamily, fontSize: c.stat.label.fontSize, lineHeight: c.stat.label.lineHeight, color: rc('fg-neutral-subtle', mode), fontVariantNumeric: 'tabular-nums' }}>{sub}</span>
      </div>
    </CardSurface>
  );
}
const stack = (): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap: CL().surface.gap, paddingTop: CL().surface.gap, paddingLeft: gutter(), paddingRight: gutter() });

// ── 화면 ──────────────────────────────────────────────────
// 종목 상세 — 머리(이름 · 값) 오른쪽 관심 등록
function StockHead({ watched, mode = 'auto', state, icon }: { watched: boolean; mode?: Mode; state?: ToggleState; icon?: ToggleIcon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, padding: `16px ${gutter()}px 12px` }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700, color: rc('fg-neutral-subtle', mode) }}>삼성전자 · 005930</span>
        <span style={{ fontSize: 26, lineHeight: '35px', fontWeight: 700, color: rc('fg-neutral', mode), fontVariantNumeric: 'tabular-nums' }}>71,500원</span>
        <span style={{ fontSize: 14, lineHeight: '19px', fontWeight: 500, color: rc('fg-critical', mode), fontVariantNumeric: 'tabular-nums' }}>+850원(1.2%)</span>
      </div>
      <span style={{ display: 'flex', marginTop: -CL().header.gap, marginRight: -CL().header.gap }}>
        <Tg kind="watch" pressed={watched} mode={mode} state={state} icon={icon} />
      </span>
    </div>
  );
}
function StockPhone({ mode, scale = 0.5, h = 500, watched = true }: { mode: Mode; scale?: number; h?: number; watched?: boolean }) {
  const bars = [38, 52, 44, 61, 57, 70, 66, 78];
  return (
    <Phone title="삼성전자" mode={mode} scale={scale} h={h} bg="bg-layer-default" screenW={360}>
      <StockHead watched={watched} mode={mode} />
      <div className="flex items-end gap-1.5" style={{ height: 120, padding: `0 ${gutter()}px` }}>
        {bars.map((v, i) => (
          <span key={i} className="block flex-1 rounded-t" style={{ height: v, background: rc(i === bars.length - 1 ? 'chart-red' : 'bg-neutral-weak', mode) }} />
        ))}
      </div>
    </Phone>
  );
}
const MEMO_ROWS: [string, string, boolean][] = [
  ['장보기 목록', '우유 · 계란 · 두부 · 대파', true],
  ['제주 여행 준비', '숙소 예약 · 렌터카 · 우산', false],
  ['부모님 선물', '안마기 · 꽃바구니', false],
];
function MemoPhone({ mode, scale = 0.5, h = 500 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Phone title="메모" back={false} mode={mode} scale={scale} h={h} screenW={360}>
      <div style={stack()}>
        {MEMO_ROWS.map(([t, s, on]) => (
          <ToggleCard key={t} mode={mode} title={t} sub={s} toggle={<Tg kind="pin" pressed={on} mode={mode} />} />
        ))}
      </div>
    </Phone>
  );
}
// 증권 연결 — App Key 보기(기능 단추 — 가려져 있으면 끔 · eye-off)
function KeyPhone({ mode, scale = 0.5, h = 500 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Phone title="증권 연결" mode={mode} scale={scale} h={h} screenW={360}>
      <div style={stack()}>
        <ToggleCard mode={mode} title="가나증권" sub="App Key ••••••••••••••••" toggle={<Tg kind="key" mode={mode} />} />
        <ToggleCard mode={mode} title="다라투자증권" sub="App Key PSq7·Kx2m·9WdA·tL4e" toggle={<Tg kind="key" pressed mode={mode} />} />
      </div>
    </Phone>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <StockPhone mode={mode} />
          <MemoPhone mode={mode} />
          <KeyPhone mode={mode} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <TogglePlayground looks={{ desk: T('desk'), hr: T('hr') }} cards={{ desk: CL(), hr: CL() }} />;

// ── Anatomy ───────────────────────────────────────────────
function zoom(l: ToggleLook, k: number): ToggleLook {
  return { ...l, size: l.size * k, touch: l.touch * k, radius: l.radius * k, icon: l.icon * k, ring: { ...l.ring, width: l.ring.width * k, offset: l.ring.offset * k } };
}
const Anatomy: Fig = ({ caption }) => {
  const k = 3;
  const l = T();
  const z = zoom(l, k);
  const ext = ((l.touch - l.size) / 2) * k;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-4 pb-8 pt-12 sm:px-10">
        <div className="flex flex-wrap items-end justify-center gap-x-16 gap-y-8">
          {([false, true] as const).map((on) => (
            <div key={String(on)} className="flex flex-col items-center gap-4">
              <span className="relative inline-flex" style={{ padding: ext + 8 }}>
                <ToggleView
                  look={z}
                  state={on ? 'focused' : 'hovered'}
                  pressed={on}
                  icon="star"
                  ariaLabel="관심 등록"
                  showHit={{ fill: MARK, line: MARK_LINE }}
                  decor={
                    <>
                      {pinStyle('ⓐ', { left: -ext - 10, top: -ext - 10 })}
                      {pinStyle('ⓑ', { left: '50%', top: '50%', transform: `translate(${(l.icon * k) / 2 - 4}px, ${-(l.icon * k) / 2 - 16}px)` })}
                      {on && pinStyle('ⓒ', { right: -ext - 14, bottom: -ext - 14 })}
                    </>
                  }
                />
              </span>
              <Cap strong={on ? '켬 · 키보드 포커스' : '끔 · 호버(웹)'}>{on ? `${toggleReadout('관심 등록', true)}` : `${toggleReadout('관심 등록', false)}`}</Cap>
            </div>
          ))}
        </div>
        <Legend
          items={[
            ['ⓐ', `Container — 보이는 ${l.size} · 누르는 ${l.touch}(분홍), 바탕은 누름 · 호버에만`],
            ['ⓑ', `Icon — ${l.icon}, 끔 선 ${l.stroke.off} · 켬 선 ${l.stroke.on}`],
            ['ⓒ', `Focus ring — ${l.ring.width}px · 띄움 ${l.ring.offset}px`],
          ]}
        />
        <span className="text-center text-[12px] pk-muted">{k}배로 그렸다</span>
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
// 켬 · 끔 — 단추 넷 × 끔 · 켬, 라이트 · 다크
const Toggled: Fig = ({ caption }) => {
  const l = T();
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode}>
        <div className="mx-auto grid w-max grid-cols-[max-content_max-content_max-content] items-center gap-x-6 gap-y-3">
          <span />
          {['끔', '켬'].map((h) => (
            <span key={h} className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {h}
            </span>
          ))}
          {(Object.keys(TOGGLES) as ToggleKind[]).map((kind) => (
            <div key={kind} className="contents">
              <span className="text-[12px] font-bold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                {kind === 'pin' ? '메모 고정' : TOGGLES[kind].label}
              </span>
              {[false, true].map((on) => (
                <span key={String(on)} className="flex justify-center">
                  <Tg kind={kind} pressed={on} mode={mode} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>{`끔 fg-neutral-muted · 선 ${l.stroke.off} — 켬 fg-neutral · 선 ${l.stroke.on}. 바탕은 둘 다 투명하다`}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// 크기 — 보이는 40 · 누르는 44 · 아이콘 20, 상단 바는 Top Navigation 아이콘 버튼 44 · 24(끔도 fg-neutral)
const Size: Fig = ({ caption }) => {
  const l = T();
  const top = NK().top.icon;
  const ext = (l.touch - l.size) / 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-end justify-center gap-10">
          <Shot strong="카드 · 시트 위 Toggle" cap={`보이는 ${l.size} · 누르는 ${l.touch} · 아이콘 ${l.icon} · 모서리 ${l.radius}`}>
            <Surface>
              <div className="relative" style={{ padding: 28 }}>
                <span className="relative inline-flex">
                  <ToggleView look={l} state="hovered" icon="pin" ariaLabel="장보기 목록 고정" showHit={{ fill: MARK, line: MARK_LINE }} />
                  <Band style={{ left: 0, right: 0, top: -ext - 14, height: 3 }} />
                  <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ left: '50%', top: -ext - 30, transform: 'translateX(-50%)', color: MARK_LINE }}>{l.size}</span>
                  <Band style={{ right: -ext - 14, top: -ext, bottom: -ext, width: 3 }} />
                  <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ right: -ext - 36, top: '50%', transform: 'translateY(-50%)', color: MARK_LINE }}>{l.touch}</span>
                </span>
              </div>
            </Surface>
          </Shot>
          <Shot strong="상단 바 안이라면 — Top Navigation 아이콘 버튼" cap={`상자 ${top.size} · 아이콘 ${top.icon} — 끔 선 ${top.stroke} · 켬 선 ${top.pressedStroke}, 둘 다 fg-neutral`}>
            <Surface>
              <div className="flex items-center gap-1" style={{ padding: '8px 4px' }}>
                <TopStar />
                <TopStar on />
                <TopBell />
              </div>
            </Surface>
          </Shot>
        </div>
        <Cap>상단 바에서는 이웃 버튼과 같은 진한 색 — 아이콘 줄에서 하나만 흐리면 막힌 단추처럼 보인다(19B). 켬 · 끔은 굵기와 아이콘으로만 가른다. 지금 상단 바에 켜고 끄는 단추를 두는 화면은 없다</Cap>
      </div>
    </Panel>
  );
};

// 브랜드 채움 위 — 순자산 카드, 끔 · 켬 × 라이트 · 다크
// 폰 342 화면의 카드 폭에 가깝게 — 판 안에 두 장이 나란히 들어가게
const HERO_W = 296;
function HeroWithEye({ mode, hidden, focused = false }: { mode: Mode; hidden: boolean; focused?: boolean }) {
  return (
    <HeroCardView
      look={CL()}
      mode={mode}
      width={HERO_W}
      label="순자산 · 2026년 10월"
      amount={hidden ? '••••••원' : '42,898,100원'}
      detail={hidden ? '총 자산 •••••• · 총 부채 ••••••' : '총 자산 52,320,000원 · 총 부채 9,421,900원'}
      labelEnd={<EyeLink hidden={hidden} mode={mode} state={focused ? 'focused' : 'enabled'} />}
    />
  );
}
const Tone: Fig = ({ caption }) => {
  const l = T();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap justify-center gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-basement', mode) }}>
              <HeroWithEye mode={mode} hidden={false} />
              <HeroWithEye mode={mode} hidden focused />
            </div>
            <Cap strong={mode === 'light' ? '라이트' : '다크'}>{`금액 가리기 눈 — Toggle 이 아니다(aria-pressed 없음 · 이름 "금액 가리기 설정"). 보임 eye · 가림 eye-off(선 ${l.stroke.off} 그대로) · 흰 아이콘만, 원 · 바탕 없음. 가림 카드는 키보드 포커스 — 링도 흰색(${l.ring.width}px · 띄움 ${l.ring.offset})`}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 상태 다섯 × 끔 · 켬 — 라이트 · 다크
const States: Fig = ({ caption }) => {
  const order: ToggleState[] = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'];
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        <div className="mx-auto grid w-max grid-cols-[max-content_max-content_max-content] items-center gap-x-8 gap-y-3">
          <span />
          {['끔', '켬'].map((h) => (
            <span key={h} className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {h}
            </span>
          ))}
          {order.map((st) => (
            <div key={st} className="contents">
              <span className="text-[12px] font-bold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                {STATE_KO[st]}
              </span>
              {[false, true].map((on) => (
                <span key={String(on)} className="flex justify-center p-1">
                  <Tg kind="watch" pressed={on} state={st} mode={mode} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>호버 = 누름 바탕(축소 없음) · 누름은 단추 2px 축소 · 막힘은 아이콘만 fg-disabled(켬은 선 굵기 그대로)</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 아이콘 — 기능 단추는 -off 짝, 모으기 단추는 사선 없이
const IconGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="모으기 단추(관심 · 고정)의 끔은 같은 아이콘이 흐린 선 2 — 관심에 넣지 않은 종목마다 사선 별이 깔리지 않는다. 눈은 지금 상태(키가 가려져 있으면 eye-off)">
        <div className="flex w-full max-w-[300px] flex-col gap-2">
          <Surface style={{ padding: 0 }}>
            <StockHead watched={false} />
          </Surface>
          <ToggleCard title="제주 여행 준비" sub="숙소 예약 · 렌터카 · 우산" toggle={<Tg kind="pin" />} />
          <ToggleCard title="가나증권" sub="App Key ••••••••••••" toggle={<Tg kind="key" />} />
        </div>
      </Verdict>
      <Verdict ok={false} note="모으기 단추의 끔을 사선(star-off · pin-off)으로 — 목록의 칸마다 사선이 깔려 '꺼진 기능' 처럼 읽힌다">
        <div className="flex w-full max-w-[300px] flex-col gap-2">
          <Surface style={{ padding: 0 }}>
            <StockHead watched={false} icon="star-off" />
          </Surface>
          <ToggleCard title="제주 여행 준비" sub="숙소 예약 · 렌터카 · 우산" toggle={<Tg kind="pin" icon="pin-off" />} />
          <ToggleCard title="가나증권" sub="App Key ••••••••••••" toggle={<Tg kind="key" />} />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// 이름은 고정 — 켬은 aria-pressed
const NameGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="이름 '관심 등록' 은 그대로 — 켜지면 '눌림' 이 붙는다(APG)">
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <Surface style={{ padding: 0 }}>
            <StockHead watched />
          </Surface>
          <Readout text={toggleReadout('관심 등록', true)} />
        </div>
      </Verdict>
      <Verdict ok={false} note="켜면 이름을 '관심 해제' 로 — '관심 해제, 눌림' 처럼 이름과 상태가 겹쳐 읽힌다">
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <Surface style={{ padding: 0 }}>
            <StockHead watched />
          </Surface>
          <Readout text={toggleReadout('관심 해제', true)} />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// 눈은 지금 상태 — 상단 바 · 순자산 카드 · 자산 상세 바닥이 같은 아이콘
function EyePlaces({ action = false }: { action?: boolean }) {
  const place = (cap: string, el: ReactNode) => (
    <div className="flex w-full flex-col gap-1.5">
      {el}
      <span className="text-center text-[12px] leading-4 pk-muted">{cap}</span>
    </div>
  );
  return (
    <div className="flex w-full max-w-[312px] flex-col gap-3">
      {place('홈 순자산 카드 — 가림', <HeroCardView look={CL()} width="100%" label="순자산 · 2026년 10월" amount="••••••원" labelEnd={<EyeLink hidden={!action} />} />)}
      {place('자산 순자산 카드 — 보임', <HeroCardView look={CL()} width="100%" label="순자산 · 자산" amount="42,898,100원" labelEnd={<EyeLink hidden={action} />} />)}
    </div>
  );
}
const EyeGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="아이콘은 그 카드의 지금 상태 — 가렸으면 eye-off, 보이면 eye. 누르면 금액 가리기 설정(이름 '금액 가리기 설정' · aria-pressed 없음)">
        <EyePlaces />
      </Verdict>
      <Verdict ok={false} note="누르면 할 일을 그린다 — 가린 카드에 eye, 보이는 카드에 eye-off. 같은 화면에서 두 눈이 반대로 읽힌다(7A)">
        <EyePlaces action />
      </Verdict>
    </Pair>
  </Panel>
);

// 쓰임 — 단추 하나는 Toggle, 거르기는 Chip, 설정은 Switch, 글 토글은 두지 않는다
function SettingRow({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-[15px]" style={{ color: rc('fg-neutral') }}>
        {label}
      </span>
      <SwitchView look={switchLook()} checked={on} state="enabled" ariaLabel={label} />
    </div>
  );
}
const RoleGuide: Fig = ({ caption }) => {
  const chip = chipLook();
  const text = buttonLook({ variant: 'ghost', size: 'small' });
  return (
    <Panel caption={caption}>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Verdict ok note="단추 하나가 한 상태를 그 자리에서 켜고 끈다 — 관심 등록 · 고정 · 키 보기는 Toggle">
          <div className="w-full max-w-[300px]">
            <Surface style={{ padding: 0 }}>
              <StockHead watched />
            </Surface>
          </div>
        </Verdict>
        <Verdict ok note="여럿 가운데 거르거나 고른다 — 계좌 거르기는 Chip(체크박스 · 라디오 의미)">
          <Surface className="w-full max-w-[300px]">
            <ChipGroupView look={chip}>
              {['국민 주계좌', '토스뱅크', '현대카드 M'].map((t, i) => (
                <ChipView key={t} look={chip} state="enabled" selected={i !== 1} label={t} />
              ))}
            </ChipGroupView>
          </Surface>
        </Verdict>
        <Verdict ok note="누르는 순간 적용되는 설정 줄 — Switch">
          <Surface className="w-full max-w-[300px]">
            <SettingRow label="예산 알림" on />
            <SettingRow label="카드 결제 알림" on={false} />
          </Surface>
        </Verdict>
        <Verdict ok={false} note="글이 있는 켜고 끄기 단추(옛 Toggle · SEED Toggle Button)로 거르기 — 고른 것인지 켠 것인지 헷갈린다">
          <Surface className="w-full max-w-[300px]">
            <div className="flex gap-1">
              {['전체', '지출', '수입'].map((t, i) => (
                <ButtonView key={t} look={text} state={i === 1 ? 'hovered' : 'enabled'} label={t} />
              ))}
            </div>
          </Surface>
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExWatch: Fig = () => <ExWatchDemo look={T()} card={CL()} />;
const ExEye: Fig = () => <ExEyeDemo look={T()} card={CL()} />;
const ExPin: Fig = () => <ExPinDemo look={T()} card={CL()} snack={snackbarLook()} gutter={gutter()} />;
const ExInverted: Fig = () => <ExInvertedDemo look={T()} card={CL()} />;

export const toggleFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  toggled: Toggled,
  'icon-guide': IconGuide,
  size: Size,
  tone: Tone,
  states: States,
  'name-guide': NameGuide,
  'eye-guide': EyeGuide,
  'role-guide': RoleGuide,
  'ex-watch': ExWatch,
  'ex-eye': ExEye,
  'ex-pin': ExPin,
  'ex-inverted': ExInverted,
};
