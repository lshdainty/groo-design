// Chip 페이지의 그림 — specs/components/chip.md 의 `[그림: …](../../site/components/specs/chip.tsx#<id>)` 자리.
// 칩은 chip.yaml 을 푼 값(chipLook)으로, Field · 칸은 field · input.yaml(textFieldLook), Select · Input Button 은 select · input-button.yaml(selectLook),
// 버튼은 button.yaml, 시트 · 대화상자 · 팝오버는 bottom-sheet · dialog · popover.yaml(overlay-look)로 그린다. 스크롤 끝 흐림 · Segmented · Tabs 는 아직 스펙이 없어 역할 색 토큰으로 간단히 그린다.
// 휴대폰 화면 안의 칸은 large, 데스크톱 창 안의 칸은 medium 이다. 칩은 어디서나 medium(기본)이고, small 은 데스크톱의 촘촘한 필터 · 표 위 줄만이다.
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { checkLook } from './checkbox-look';
import { CheckboxView } from './checkbox-view';
import { CHIP_STATES, CHIP_VARIANTS, chipLook, type ChipIcon, type ChipLook, type ChipSize, type ChipState, type ChipVariant } from './chip-look';
import { BudgetField, DemoFrame, FilterBarDemo, MultiDemo, PeopleField, SingleDemo } from './chip-demos';
import { ChipPlayground } from './chip-playground';
import { ChipGroupView, ChipView, InputChipView, type ChipViewProps } from './chip-view';
import { PopoverPanel, SheetOverlay, SheetPanel } from './input-button-pickers';
import { CenterOn, PHONE_SAFE, dialogChrome, overlayKit, ov } from './overlay-screens';
import { DialogSurface, EndButtons } from './overlay-view';
import { Cap, DateTimeFields, F, Form, Surface, cta, desk, hr, tf } from './select-screens';
import { InputButtonView } from './select-view';
import { TfInputView } from './text-field-view';
import { Line, Phone, Row, Verdict, WebWindow, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';
const cl = (brand: Brand = 'desk') => chipLook(brand);
const px = (v: string) => parseFloat(v);

const VARIANT_KO: Record<ChipVariant, string> = { solid: 'Solid', outlineStrong: 'Outline Strong', outlineWeak: 'Outline Weak' };
const STATE_KO: Record<ChipState, string> = { enabled: '기본', hovered: '호버(웹)', pressed: '누름', focused: '포커스(키보드)', disabled: '비활성' };

// ── 조각 ─────────────────────────────────────────────────
// 멈춘 칩 하나 — 수치 · 색은 chipLook 에서
type CP = Omit<ChipViewProps, 'look' | 'label' | 'variant' | 'size' | 'selected' | 'state' | 'prefixIcon' | 'suffixIcon'> & {
  l?: string;
  v?: ChipVariant;
  s?: ChipSize;
  on?: boolean;
  st?: ChipState;
  pre?: ChipIcon;
  suf?: ChipIcon;
  brand?: Brand;
};
function C({ l, v, s, on, st = 'enabled', pre, suf, brand = 'desk', ...rest }: CP) {
  return <ChipView look={cl(brand)} variant={v} size={s} selected={on} state={st} label={l} prefixIcon={pre} suffixIcon={suf} {...rest} />;
}
// 줄바꿈 묶음(칩 사이 · 줄 사이는 YAML 의 group)
function G({ children, mode = 'auto', brand = 'desk' }: { children: ReactNode; mode?: Mode; brand?: Brand }) {
  return (
    <ChipGroupView look={cl(brand)} mode={mode} layout="wrap">
      {children}
    </ChipGroupView>
  );
}
// 같은 변형 · 크기로 여럿 — [글, 고름]
function Chips({ items, v, s, mode = 'auto', brand = 'desk', st }: { items: [string, boolean?][]; v?: ChipVariant; s?: ChipSize; mode?: Mode; brand?: Brand; st?: ChipState }) {
  return (
    <G mode={mode} brand={brand}>
      {items.map(([l, on]) => (
        <C key={l} l={l} on={on} v={v} s={s} mode={mode} brand={brand} st={st} />
      ))}
    </G>
  );
}

function Pin({ n }: { n: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
}
const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, background: MARK };

// 그림 속 흰 판 — 필터 바처럼 줄을 판 끝까지 내는 그림은 안쪽 여백을 화면 여백(scrollRow.paddingX)으로
function Board({ children, mode = 'auto', gutter = false, className = '', style }: { children: ReactNode; mode?: Mode; gutter?: boolean; className?: string; style?: CSSProperties }) {
  const lk = cl();
  return (
    <Surface mode={mode} className={`${gutter ? 'overflow-hidden' : ''} ${className}`} style={gutter ? { paddingLeft: lk.scrollRow.padX, paddingRight: lk.scrollRow.padX, ...style } : style}>
      {children}
    </Surface>
  );
}
function CapCell({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {children}
      <Cap>{label}</Cap>
    </div>
  );
}

// 이렇게 · 이렇게 하지 않는다 — 좁은 화면에서는 위아래로
const Pair = ({ children, three = false }: { children: ReactNode; three?: boolean }) => <div className={`flex w-full flex-col gap-4 ${three ? 'max-w-[900px] lg:flex-row' : 'max-w-[720px] md:flex-row'}`}>{children}</div>;
const W = ({ children, w = 300 }: { children: ReactNode; w?: number }) => (
  <div className="max-w-full" style={{ width: w }}>
    {children}
  </div>
);
const Muted = ({ children, mode = 'auto' }: { children: ReactNode; mode?: Mode }) => (
  <span className="text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
    {children}
  </span>
);

// 가계부 필터 바(멈춘 그림) — 맨 앞 지우기(↺) · 걸린 조건 둘(짙은 채움 + 값 요약) · 안 걸린 조건
function Bar({ mode = 'auto', s, bleed = true }: { mode?: Mode; s?: ChipSize; bleed?: boolean }) {
  const lk = cl();
  return (
    <ChipGroupView look={lk} mode={mode} layout="scroll" bleed={bleed} ariaLabel="거래 거르기">
      <C mode={mode} s={s} v="outlineStrong" icon="rotate-ccw" ariaLabel="필터 지우기" />
      <C mode={mode} s={s} v="solid" on l="이번 달" suf="chevron-down" />
      <C mode={mode} s={s} v="solid" on l="식비 외 2개" suf="chevron-down" />
      <C mode={mode} s={s} v="solid" l="결제 수단" suf="chevron-down" />
      <C mode={mode} s={s} v="solid" l="금액" suf="chevron-down" />
    </ChipGroupView>
  );
}
// 이번 달 · 식비 · 카페 · 교통으로 거른 거래
const LEDGER: [string, string, string, string][] = [
  ['점심 식사', '식비 · 현대카드 M', '−12,000원', 'orange'],
  ['스타벅스', '카페 · 현대카드 M', '−5,600원', 'brown'],
  ['지하철', '교통 · 국민 체크카드', '−1,450원', 'blue'],
  ['편의점', '식비 · 현금', '−4,300원', 'orange'],
];
function LedgerRows({ mode, n = LEDGER.length }: { mode: Mode; n?: number }) {
  return (
    <>
      <div className="mt-4 flex items-center justify-between text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
        <span>10월 1일 (목)</span>
        <span className="tabular-nums">−23,350원</span>
      </div>
      {LEDGER.slice(0, n).map(([title, sub, amount, hue]) => (
        <Row key={title} mode={mode} title={title} sub={sub} amount={amount} hue={hue} />
      ))}
    </>
  );
}
// Desk 가계부(폰) — 앱 막대 아래 필터 바(줄은 화면 끝까지)
function LedgerPhone({ mode, scale = 0.7, h = 600, overlay }: { mode: Mode; scale?: number; h?: number; overlay?: ReactNode }) {
  return (
    <Phone title="가계부" back={false} mode={mode} scale={scale} h={h} bg="bg-layer-default" overlay={overlay}>
      <div className="flex flex-col px-6 pt-2">
        <Bar mode={mode} />
        <LedgerRows mode={mode} />
      </div>
    </Phone>
  );
}
// Desk 거래 추가(폰) — 거래 종류는 하나 고르기(Outline Strong — 고른 값이 곧 화면의 갈래)
function TxAddPhone({ mode, scale = 0.7, h = 600 }: { mode: Mode; scale?: number; h?: number }) {
  const lk = desk();
  const t = tf();
  return (
    <Phone title="거래 추가" mode={mode} scale={scale} h={h} bg="bg-layer-default" bottom={cta('저장', mode)} screenW={360}>
      <div className="flex flex-col px-6 pt-4" style={{ gap: t.field.form.gapY }}>
        <F mode={mode} label="거래 종류">
          <Chips mode={mode} v="outlineStrong" items={[['지출', true], ['수입'], ['이체']]} />
        </F>
        <F mode={mode} label="금액">
          <TfInputView look={t.input} mode={mode} size="large" state="enabled" value="12,000" suffix="원" />
        </F>
        <F mode={mode} label="카테고리">
          <InputButtonView look={lk} mode={mode} size="large" state="enabled" value="식비 · 점심" prefixIcon="utensils" suffixIcon="chevron-down" />
        </F>
        <DateTimeFields mode={mode} label="날짜" date="10월 1일 (목)" time="오후 3:00" />
      </div>
    </Phone>
  );
}
// HR 공지 작성(데스크톱 · 칸 medium · 칩 medium — small 은 데스크톱의 촘촘한 필터 · 표 위 줄만) — 지금 Select 인 공지 유형(GENERAL · URGENT · EVENT · MAINTENANCE)을 칩으로.
// 대화상자는 Dialog(dialog.yaml) — 입력 폼이라 머리 닫기 없이 바닥 취소 · 등록
function HrNoticeWindow({ mode, w = 560 }: { mode: Mode; w?: number }) {
  const h = hr();
  const t = tf();
  const lk = cl('hr');
  const o = ov('hr');
  const check = checkLook({ size: 'medium' }, 'hr');
  const label = px(t.field.label.text.lineHeight) + t.field.gap;
  const gap = t.field.form.gapY;
  // 창 높이 — 창 막대 32 · 위아래 24 · 대화상자(머리 + 칸 넷 + 바닥)
  const body = label + t.input.sizes.outline.medium.minHeight + gap + label + lk.sizes[lk.defaults.size].h + gap + label + h.ib.sizes.medium.h + gap + check.faces.unchecked.light.enabled.row.minHeight;
  const chrome = dialogChrome('hr');
  const winH = 32 + 24 * 2 + chrome.head + body + chrome.foot;
  const s = o.dialog.footer.button.size;
  return (
    <WebWindow mode={mode} w={w} h={winH} url="hr.porest.app">
      <CenterOn mode={mode} dim={o.dialog.dim}>
        <DialogSurface
          look={o.dialog}
          mode={mode}
          title="공지 작성"
          footer={
            <EndButtons
              mode={mode}
              items={[
                { label: '취소', look: buttonLook({ variant: 'neutralWeak', size: s }, 'hr') },
                { label: '등록', look: buttonLook({ variant: 'brandSolid', size: s }, 'hr') },
              ]}
            />
          }
        >
          <Form gap={gap}>
            <F mode={mode} label="제목">
              <TfInputView look={t.input} mode={mode} size="medium" state="enabled" value="10월 전사 워크숍 안내" />
            </F>
            <F mode={mode} label="공지 유형">
              <Chips mode={mode} brand="hr" items={[['일반'], ['긴급'], ['이벤트', true], ['점검']]} />
            </F>
            {/* 기간은 칸 하나 — 시작 · 종료 두 칸으로 나누지 않는다(date-picker.md) */}
            <F mode={mode} label="게시 기간">
              <InputButtonView look={h} mode={mode} size="medium" state="enabled" value="10월 1일~10월 31일" suffixIcon="calendar" />
            </F>
            <CheckboxView look={check} mode={mode} checked="unchecked" state="enabled" label="상단에 고정" />
          </Form>
        </DialogSurface>
      </CenterOn>
    </WebWindow>
  );
}

// ── Overview ──────────────────────────────────────────────
// 가계부(라이트 · 필터 바) · 거래 추가(다크 · 하나 고르기) · 공지 작성(HR 데스크톱 · 칩 medium)
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <LedgerPhone mode="light" />
        <TxAddPhone mode="dark" />
      </div>
      <HrNoticeWindow mode="light" />
    </div>
  </Figure>
);

const Playground: Fig = () => (
  <ChipPlayground
    looks={{ desk: cl('desk'), hr: cl('hr') }}
    field={tf().field}
    input={tf().input}
    cta={{ desk: buttonLook({ variant: 'neutralSolid', size: 'large' }, 'desk'), hr: buttonLook({ variant: 'neutralSolid', size: 'large' }, 'hr') }}
    kits={{ desk: overlayKit('desk'), hr: overlayKit('hr') }}
  />
);

// ── Anatomy ───────────────────────────────────────────────
// 2배로 그린다 — 치수 · 글자를 모두 곱한 look(색은 그대로)
function zoomed(l: ChipLook, k: number): ChipLook {
  const sizes = Object.fromEntries(
    Object.entries(l.sizes).map(([s, v]) => [s, { h: v.h * k, padX: v.padX * k, minW: v.minW * k, iconOnlyW: v.iconOnlyW * k, prefixIcon: v.prefixIcon * k, suffixIcon: v.suffixIcon * k, removeIcon: v.removeIcon * k, icon: v.icon * k }]),
  ) as ChipLook['sizes'];
  const faces = JSON.parse(JSON.stringify(l.faces)) as ChipLook['faces'];
  for (const v of Object.values(faces)) for (const s of Object.values(v)) for (const f of Object.values(s)) if (f.border) f.border.width *= k;
  return {
    ...l,
    sizes,
    faces,
    gap: l.gap * k,
    text: { ...l.text, fontSize: `${px(l.text.fontSize) * k}px`, lineHeight: `${px(l.text.lineHeight) * k}px` },
    removeTarget: l.removeTarget * k,
    touch: { w: l.touch.w * k, h: l.touch.h * k },
  };
}
const Anatomy: Fig = ({ caption }) => {
  const z = zoomed(cl(), 2);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-14 pb-8 pt-16">
        <div className="flex items-center gap-20">
          <ChipView
            look={z}
            variant="solid"
            state="enabled"
            prefixIcon="calendar"
            label="이번 달"
            suffixIcon="chevron-down"
            zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 }, prefix: markBox, label: markBox, suffix: markBox }}
            pins={{ root: <Pin n="ⓐ" />, prefix: <Pin n="ⓑ" />, label: <Pin n="ⓒ" />, suffix: <Pin n="ⓓ" /> }}
            pinLine={MARK_LINE}
          />
          <InputChipView look={z} state="enabled" label="김민지" zone={{ remove: markBox }} pins={{ remove: <Pin n="ⓔ" /> }} pinLine={MARK_LINE} />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted sm:grid-cols-5">
          {[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Prefix Icon'],
            ['ⓒ', 'Label'],
            ['ⓓ', 'Suffix Icon'],
            ['ⓔ', 'Remove Button'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
        <span className="text-[12px] pk-muted">2배로 그렸다 — 왼쪽은 필터 바의 여는 칩(Solid), 오른쪽은 입력값 칩(Outline Weak 고름 + 지우기)</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 변형 셋 × 안 고름 · 고름 — 라이트 · 다크
const VARIANT_LABEL: Record<ChipVariant, string> = { solid: '이번 달', outlineStrong: '지출', outlineWeak: '식비' };
const Variant: Fig = ({ caption }) => {
  const lk = cl();
  const panel = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        <div className="mx-auto grid items-center gap-x-3 gap-y-4 sm:gap-x-6" style={{ gridTemplateColumns: 'max-content max-content max-content', width: 'max-content', justifyItems: 'center' }}>
          <span />
          <Muted mode={mode}>안 고름</Muted>
          <Muted mode={mode}>고름</Muted>
          {CHIP_VARIANTS.map((v) => (
            <Fragment key={v}>
              <span className="justify-self-start text-[13px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
                {VARIANT_KO[v]}
                {v === lk.defaults.variant && (
                  <span className="block" style={{ color: rc('fg-neutral-subtle', mode), fontWeight: 400 }}>
                    기본
                  </span>
                )}
              </span>
              <C mode={mode} v={v} l={VARIANT_LABEL[v]} />
              <C mode={mode} v={v} on l={VARIANT_LABEL[v]} />
            </Fragment>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>안 고른 Outline 둘은 같고, 고르면 갈린다</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        {panel('light')}
        {panel('dark')}
      </div>
    </Panel>
  );
};

// 누르는 영역 — 칩 뒤에 가로 · 세로 look.touch 의 띠. 글이 있는 칩은 최소 폭이 이미 넘어 가로는 칩 폭 그대로, 아이콘만 있는 칩은 가로도 넓힌다
function Touch({ children, s, iconOnly = false }: { children: ReactNode; s: ChipSize; iconOnly?: boolean }) {
  const lk = cl();
  const z = lk.sizes[s];
  const h = Math.max(lk.touch.h, z.h);
  const w = Math.max(lk.touch.w, z.iconOnlyW);
  const x: CSSProperties = iconOnly ? { left: (z.iconOnlyW - w) / 2, width: w } : { left: 0, right: 0 };
  return (
    <span className="relative inline-flex">
      <span aria-hidden className="absolute" style={{ top: (z.h - h) / 2, height: h, ...x, background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
      {children}
    </span>
  );
}
// 크기 셋 — 글 · 앞 아이콘 · 뒤 아이콘 · 아이콘만. 글 칩 · 아이콘만 있는 칩 뒤에 누르는 영역(touch)을 분홍 띠로
const SIZE_WHERE: Record<ChipSize, string> = { small: '촘촘한 줄 — 1280 이상 데스크톱의 필터 · 표 위', medium: '기본 — 폰 폼도', large: '화면의 주인공 고르기' };
const Size: Fig = ({ caption }) => {
  const lk = cl();
  const sizes = Object.keys(lk.sizes) as ChipSize[];
  return (
    <Panel caption={caption}>
      <Board>
        <div className="flex flex-col">
          {sizes.map((s, i) => {
            const z = lk.sizes[s];
            return (
              <div key={s} className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:gap-6" style={{ borderTop: i ? `1px solid ${rc('stroke-neutral-subtle')}` : undefined }}>
                <div className="flex w-[250px] shrink-0 flex-col gap-0.5">
                  <b className="text-[14px] pk-text">
                    {s} {z.h}
                    {s === lk.defaults.size && <span className="font-normal pk-muted"> (기본)</span>}
                  </b>
                  <span className="text-[12px] leading-4 pk-muted">{SIZE_WHERE[s]}</span>
                  <span className="text-[12px] leading-4 pk-muted">
                    좌우 {z.padX} · 앞 아이콘 {z.prefixIcon} · 뒤 아이콘 {z.suffixIcon}
                  </span>
                  <span className="text-[12px] leading-4 pk-muted">
                    최소 폭 {z.minW} · 아이콘만 {z.iconOnlyW} × {z.h}
                  </span>
                </div>
                <G>
                  <Touch s={s}>
                    <C s={s} l="식비" />
                  </Touch>
                  <C s={s} l="식비" pre="utensils" />
                  <C s={s} v="solid" l="카테고리" suf="chevron-down" />
                  <Touch s={s} iconOnly>
                    <C s={s} v="outlineStrong" icon="rotate-ccw" />
                  </Touch>
                </G>
              </div>
            );
          })}
        </div>
      </Board>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">
        분홍 띠 — 누르는 영역(가로 · 세로 {lk.touch.w} 까지 — 글이 있는 칩은 최소 폭이 이미 넘는다, 보이는 칩은 그대로) · 글은 세 크기 모두 {px(lk.text.fontSize)} · {lk.text.fontWeight} · 아이콘과 글 사이 {lk.gap}
      </p>
    </Panel>
  );
};

// 상태 다섯 × 변형 셋 × 안 고름 · 고름 — 라이트 · 다크
const States: Fig = ({ caption }) => {
  const rows = CHIP_VARIANTS.flatMap((v) => [false, true].map((on) => [v, on] as const));
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        <div className="mx-auto grid items-center gap-x-4 gap-y-4" style={{ gridTemplateColumns: `max-content repeat(${CHIP_STATES.length}, max-content)`, width: 'max-content' }}>
          <span />
          {CHIP_STATES.map((st) => (
            <span key={st} className="text-center">
              <Muted mode={mode}>{STATE_KO[st]}</Muted>
            </span>
          ))}
          {rows.map(([v, on]) => (
            <Fragment key={`${v}-${on}`}>
              <span className="text-[12px] leading-4" style={{ color: rc('fg-neutral', mode) }}>
                <b>{VARIANT_KO[v]}</b> {on ? '고름' : '안 고름'}
              </span>
              {CHIP_STATES.map((st) => (
                <span key={st} className="flex justify-center">
                  <C mode={mode} v={v} on={on} st={st} l="식비" />
                </span>
              ))}
            </Fragment>
          ))}
          {/* 입력값 칩 — 칩은 누르지 않는다(호버 · 누름 바탕 없음). 누름은 지우기만, 키보드 링은 칩 둘레 */}
          <span className="text-[12px] leading-4" style={{ color: rc('fg-neutral', mode) }}>
            <b>입력값</b> 지우기
          </span>
          {CHIP_STATES.map((st) => (
            <span key={st} className="flex justify-center">
              <InputChipView look={cl()} mode={mode} state={st === 'hovered' ? 'enabled' : st} label="김민지" />
            </span>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>호버는 누름과 같은 바탕(축소 없음) · 누름은 칩 전체 축소 · 고른 채 막히면 짙은 1px · 입력값 칩은 지우기만 줄고 링은 칩 둘레</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// 쓰임 넷 — 고르기(하나 · 여럿) · 제안 · 필터 바 · 입력값
const Uses: Fig = ({ caption }) => {
  const t = tf();
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        <CapCell label={<><b className="pk-text">고르기</b> 하나는 라디오(다시 눌러도 그대로) · 여럿은 체크박스(다시 누르면 풀린다)</>}>
          <Board>
            <Form gap={t.field.form.gapY}>
              <F label="거래 종류">
                <Chips v="outlineStrong" items={[['지출', true], ['수입'], ['이체']]} />
              </F>
              <F label="알림">
                <Chips items={[['당일', true], ['1일 전', true], ['3일 전'], ['1주 전']]} />
              </F>
            </Form>
          </Board>
        </CapCell>
        <CapCell label={<><b className="pk-text">제안</b> 누르면 칸에 값을 넣는 버튼 — 고른 모습이 없다</>}>
          <Board>
            <F label="예산" description="누르면 금액이 그 값으로 바뀌어요.">
              <div className="flex flex-col" style={{ gap: t.field.gap }}>
                <TfInputView look={t.input} size="large" state="enabled" value="300,000" suffix="원" />
                <Chips v="solid" items={[['10만'], ['30만'], ['50만']]} />
              </div>
            </F>
          </Board>
        </CapCell>
        <CapCell label={<><b className="pk-text">필터 바</b> 조건마다 여는 칩 — 걸린 조건은 짙은 채움 + 값 요약, 맨 앞 지우기</>}>
          <Board gutter>
            <Bar />
            <LedgerRows mode="auto" n={2} />
          </Board>
        </CapCell>
        <CapCell label={<><b className="pk-text">입력값</b> 넣은 값 + &quot;{'{글}'} 지우기&quot; 버튼 — Outline Weak 고른 모습</>}>
          <Board>
            <F label="참여자" description="지우기로 한 명씩 빼요.">
              <G>
                {['김민지', '박서준', '이도윤'].map((n) => (
                  <InputChipView key={n} look={cl()} state="enabled" label={n} />
                ))}
              </G>
            </F>
          </Board>
        </CapCell>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 목록 위 하나 고르기 줄 — 메모 태그(태그 수가 늘고 주는 축이라 칩. 고정된 보기 2 ~ 4개는 Segmented Control 자리다).
// 목록 위 줄이라 한 줄 가로 스크롤(줄은 화면 끝까지, 안쪽 여백 = 화면 여백)
function MemoTags({ items }: { items: [string, boolean?][] }) {
  const lk = cl();
  return (
    <div className="w-[400px] max-w-full overflow-hidden" style={{ paddingLeft: lk.scrollRow.padX, paddingRight: lk.scrollRow.padX }}>
      <span className="block pb-3 text-[17px] font-bold pk-text">메모</span>
      <ChipGroupView look={lk} layout="scroll" ariaLabel="태그로 거르기">
        {items.map(([l, on]) => (
          <C key={l} l={l} on={on} />
        ))}
      </ChipGroupView>
      <div className="flex flex-col gap-2 pt-4">
        <Line w="80%" />
        <Line w="55%" />
      </div>
    </div>
  );
}
const SingleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    {/* 목록 위 줄이 한 줄에 다 보이게 위아래로 놓는다 */}
    <div className="flex w-full max-w-[760px] flex-col gap-4">
      <Verdict ok note='거르기의 "전체" 는 맨 앞 선택지("태그 없음" 은 맨 뒤) · 폼은 기본값 또는 "{칸 이름} 없음" 을 맨 앞에 — 늘 하나가 골라져 있다'>
        <div className="flex w-full flex-wrap items-start justify-center gap-x-8 gap-y-6">
          <MemoTags items={[['전체', true], ['업무'], ['여행'], ['가족'], ['태그 없음']]} />
          <W w={280}>
            <F label="반복">
              <Chips items={[['반복 없음', true], ['매일'], ['매주'], ['매월']]} />
            </F>
          </W>
        </div>
      </Verdict>
      <Verdict ok={false} note='"전체" 가 세 번째 — 조건 사이에 섞여 거르지 않는 자리를 찾기 어렵다'>
        <MemoTags items={[['업무'], ['여행'], ['전체', true], ['가족'], ['태그 없음']]} />
      </Verdict>
    </div>
  </Panel>
);

const MultiGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="다시 누르면 풀린다 — 몇 개까지 고를 수 있는지는 Field 설명에">
        <W>
          <div className="flex flex-col gap-3">
            <F label="알림" description="3개까지 고를 수 있어요.">
              <G>
                <C l="당일" on />
                <C l="1일 전" on st="pressed" />
                <C l="3일 전" />
                <C l="1주 전" />
              </G>
            </F>
            <Muted>↓ &quot;1일 전&quot; 을 다시 누르면</Muted>
            <Chips items={[['당일', true], ['1일 전'], ['3일 전'], ['1주 전']]} />
          </div>
        </W>
      </Verdict>
      <Verdict ok={false} note='"전체 선택" — 다른 칩을 함께 바꿔 무엇이 골라졌는지 짐작하기 어렵다'>
        <W>
          <F label="알림">
            <Chips items={[['전체 선택', true], ['당일', true], ['1일 전', true], ['3일 전', true], ['1주 전', true]]} />
          </F>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// 필터 바 — 폰 목록(라이트) · 그 조건만 연 시트(다크, 1280 미만) · 데스크톱 팝오버(1280 이상, small)
const CATS: [string, boolean?][] = [['식비', true], ['카페', true], ['교통', true], ['쇼핑'], ['문화'], ['의료'], ['주거'], ['통신']];
function CategorySheet({ mode }: { mode: Mode }) {
  const o = ov();
  return (
    <SheetOverlay ov={o} mode={mode}>
      <SheetPanel ov={o} mode={mode} title="카테고리" footer={cta('완료', mode)} safe={PHONE_SAFE}>
        <Chips mode={mode} items={CATS} />
      </SheetPanel>
    </SheetOverlay>
  );
}
function DeskWebLedger({ mode }: { mode: Mode }) {
  const lk = cl();
  const o = ov();
  const s = lk.sizes.small;
  return (
    <WebWindow mode={mode} w={520} h={340} url="desk.porest.app">
      <div className="flex h-full flex-col px-8 pt-6" style={{ background: rc('bg-layer-default', mode) }}>
        <span className="pb-4 text-[20px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
          가계부
        </span>
        <div className="relative">
          <Bar mode={mode} s="small" />
          {/* 기간 칩(맨 앞 지우기 다음) 아래에 그 조건만 */}
          <div className="absolute z-10" style={{ left: s.iconOnlyW + lk.group.gap, top: s.h + o.popover.offset }}>
            <PopoverPanel ov={o} mode={mode}>
              <Chips mode={mode} s="small" items={[['전체'], ['이번 달', true], ['지난 달'], ['최근 3개월']]} />
            </PopoverPanel>
          </div>
        </div>
        <LedgerRows mode={mode} n={2} />
      </div>
    </WebWindow>
  );
}
const FilterBar: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone mode="light" />
          <Cap strong="조건마다 칩">걸린 조건은 짙은 채움 + 값 요약 · 맨 앞 지우기</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone mode="dark" overlay={<CategorySheet mode="dark" />} />
          <Cap strong="누르면 그 조건만">1280 미만 — 시트(시트 안 고르기는 Outline Weak)</Cap>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DeskWebLedger mode="light" />
        <Cap strong="1280 이상 — 칩 아래 팝오버">데스크톱의 촘촘한 줄은 small</Cap>
      </div>
    </div>
  </Figure>
);

// 빼기 — "고른 것만 · 고른 것 빼고" 를 먼저(하나 고르기 칩 둘) · 3상태 칩
const ExcludeGuide: Fig = ({ caption }) => {
  const lk = cl();
  const ex = { bg: lk.tone['bg-critical-weak'], fg: lk.tone['fg-critical'], border: lk.tone['stroke-critical-solid'] };
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='"고른 것만 · 고른 것 빼고" 를 먼저 고르고 아래에서 여럿 — 칩은 고름 · 안 고름 둘'>
          <W w={320}>
            <F label="카테고리" description="고른 카테고리를 빼고 보여요.">
              <div className="flex flex-col gap-3">
                <Chips v="outlineStrong" items={[['고른 것만'], ['고른 것 빼고', true]]} />
                <Chips items={[['식비'], ['교통', true], ['쇼핑'], ['문화', true], ['의료'], ['주거']]} />
              </div>
            </F>
          </W>
        </Verdict>
        <Verdict ok={false} note="누를 때마다 고름 → 빼고 → 해제를 도는 3상태 칩 — 넣기 · 빼기가 한 줄에 섞이고, 칩만 보고는 다음 상태를 알 수 없다">
          <W w={320}>
            <F label="카테고리" description='한 번 더 누르면 "빼고" 가 돼요.'>
              <G>
                <C l="식비" on />
                <C l="교통" on paint={ex} strike />
                <C l="쇼핑" />
                <C l="문화" on paint={ex} strike />
                <C l="의료" />
                <C l="주거" />
              </G>
            </F>
          </W>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 제안 — 고른 표시 없음 · 칸 값과 같은 칩이 골라져 보인다
function Budget({ picked }: { picked?: string }) {
  const t = tf();
  return (
    <F label="예산" description={picked ? undefined : '누르면 금액이 그 값으로 바뀌어요.'}>
      <div className="flex flex-col" style={{ gap: t.field.gap }}>
        <TfInputView look={t.input} size="large" state="enabled" value="300,000" suffix="원" />
        <Chips v="solid" items={['10만', '30만', '50만'].map((l) => [l, l === picked] as [string, boolean])} />
      </div>
    </F>
  );
}
const SuggestionGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="누르면 값을 넣는 버튼 — 지금 값은 칸이 보이고, 다시 누르면 같은 값을 다시 넣는다">
        <W>
          <Budget />
        </W>
      </Verdict>
      <Verdict ok={false} note='칸 값과 같은 칩을 고른 모습으로 — "이 값만 고를 수 있다" 로 읽히고, 칸을 고치면 어긋난다'>
        <W>
          <Budget picked="30만" />
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// 표면 — 라이트에서 Solid 의 옅은 바탕(bg-neutral-weak)과 회색 바탕(bg-layer-basement)이 같은 색이라 라이트로 그린다
const SurfaceGuide: Fig = ({ caption }) => {
  const m: Mode = 'light';
  const basement = rc('bg-layer-basement', m);
  const row = (v: ChipVariant) => (
    <G mode={m}>
      <C mode={m} v={v} l="기간" suf="chevron-down" />
      <C mode={m} v={v} l="카테고리" suf="chevron-down" />
      <C mode={m} v={v} l="금액" suf="chevron-down" />
    </G>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok bg={basement} note="흰 표면 위에서 Solid, 회색 바탕 위 줄은 Outline">
          <div className="flex w-full max-w-[320px] flex-col gap-4">
            <div className="rounded-xl p-4" style={{ background: rc('bg-layer-default', m) }}>
              <div className="flex flex-col gap-1.5">
                <Muted mode={m}>흰 표면(bg-layer-default) — Solid</Muted>
                {row('solid')}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-1">
              <Muted mode={m}>회색 바탕(bg-layer-basement) — Outline Weak</Muted>
              {row('outlineWeak')}
            </div>
          </div>
        </Verdict>
        <Verdict ok={false} bg={basement} note="회색 바탕 위 Solid — 바탕과 같은 색이라 칩의 자리가 사라진다">
          <div className="flex w-full max-w-[320px] flex-col gap-1.5 px-1">
            <Muted mode={m}>회색 바탕(bg-layer-basement) — Solid</Muted>
            {row('solid')}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 글 — 명사로 짧게 · 문장 · 코드값
const LabelGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair three>
      <Verdict ok note='명사로 짧게, 한 줄 — 길이 · 말투를 맞추고, 여럿은 "식비 외 2개"'>
        <W w={260}>
          <div className="flex flex-col gap-4">
            <F label="반복">
              <Chips items={[['매일'], ['매주', true], ['매월']]} />
            </F>
            <G>
              <C v="solid" on l="식비 외 2개" suf="chevron-down" />
            </G>
          </div>
        </W>
      </Verdict>
      <Verdict ok={false} note="문장 · 동작을 붙였다 — 칩이 길어지고 말투가 섞인다">
        <W w={260}>
          <F label="반복">
            <Chips items={[['매일 반복하기'], ['매주 선택', true], ['한 달에 한 번씩 반복해요']]} />
          </F>
        </W>
      </Verdict>
      <Verdict ok={false} note="코드값 — 사람이 읽는 글로 바꾼다(관리자 · 구성원)">
        <W w={260}>
          <F label="권한">
            <Chips brand="hr" items={[['ADMIN', true], ['USER']]} />
          </F>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// 묶음 — 폼 안 줄바꿈(칩 사이 · 줄 사이) · 목록 위 가로 스크롤(안쪽 여백 = 화면 여백)
// 간격은 칩 사이에 분홍 띠로 그린다(띠 하나에만 수치). 띠 위 수치 자리를 비워 둔다
function GapMark({ w, h, label, mark = true }: { w: number; h: number; label?: string; mark?: boolean }) {
  return (
    <span aria-hidden className="relative flex shrink-0 justify-center" style={{ width: w, height: h, background: mark ? MARK : undefined }}>
      {label && (
        <span className="absolute -top-5 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
          {label}
        </span>
      )}
    </span>
  );
}
function MarkedRow({ items, first }: { items: [string, boolean?][]; first?: string }) {
  const lk = cl();
  const h = lk.sizes[lk.defaults.size].h;
  return (
    <div className="flex items-center">
      {items.map(([l, on], i) => (
        <Fragment key={l}>
          {i > 0 && <GapMark w={lk.group.gap} h={h} mark={i === 1 && !!first} label={i === 1 ? first : undefined} />}
          <C l={l} on={on} />
        </Fragment>
      ))}
    </div>
  );
}
const LayoutGuide: Fig = ({ caption }) => {
  const lk = cl();
  const g = lk.group;
  const p = lk.scrollRow.padX;
  const h = lk.sizes[lk.defaults.size].h;
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        <CapCell label={<><b className="pk-text">폼 · 시트 안 — 줄바꿈</b> 칩 사이 {g.gap} · 줄 사이 {g.rowGap}</>}>
          <Board className="h-full">
            <Muted>시트 안 고르기 — 카테고리</Muted>
            <div className="mt-6 flex w-max flex-col">
              <MarkedRow first={String(g.gap)} items={[['식비', true], ['카페', true], ['교통'], ['쇼핑']]} />
              <div className="relative" style={{ height: g.rowGap, background: MARK }}>
                <span className="absolute left-full top-1/2 ml-1.5 -translate-y-1/2 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                  {g.rowGap}
                </span>
              </div>
              <MarkedRow items={[['문화'], ['의료'], ['주거']]} />
            </div>
          </Board>
        </CapCell>
        <CapCell
          label={
            <>
              <b className="pk-text">목록 위 — 한 줄 가로 스크롤</b> 줄은 화면 끝까지 · 안쪽 여백 {p}(화면 여백) · 칩 사이 {g.gap}
            </>
          }
        >
          <Board gutter className="h-full">
            <span className="block text-[17px] font-bold pk-text">가계부</span>
            <div className="relative overflow-hidden pt-6" style={{ marginLeft: -p, marginRight: -p }}>
              <div className="flex items-center">
                <GapMark w={p} h={h} label={String(p)} />
                <C v="outlineStrong" icon="rotate-ccw" />
                <GapMark w={g.gap} h={h} label={String(g.gap)} />
                <C v="solid" on l="이번 달" suf="chevron-down" />
                <GapMark w={g.gap} h={h} mark={false} />
                <C v="solid" on l="식비 외 2개" suf="chevron-down" />
                <GapMark w={g.gap} h={h} mark={false} />
                <C v="solid" l="결제 수단" suf="chevron-down" />
              </div>
              <span aria-hidden className="absolute bottom-0 right-0" style={{ width: p, height: h, background: `linear-gradient(to right, transparent, ${rc('bg-layer-default')})` }} />
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Line w="85%" />
              <Line w="60%" />
            </div>
          </Board>
        </CapCell>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExSingle: Fig = () => (
  <DemoFrame look={cl()}>
    <SingleDemo look={cl()} field={tf().field} variant="outlineStrong" />
  </DemoFrame>
);
const ExMultiple: Fig = () => (
  <DemoFrame look={cl()}>
    <MultiDemo look={cl()} field={tf().field} />
  </DemoFrame>
);
const ExFilter: Fig = () => (
  <DemoFrame look={cl()} pad={false}>
    <FilterBarDemo look={cl()} kit={overlayKit()} cta={buttonLook({ variant: 'neutralSolid', size: 'large' })} height={400} />
  </DemoFrame>
);
const ExSuggestion: Fig = () => (
  <DemoFrame look={cl()}>
    <Form>
      <BudgetField look={cl()} field={tf().field} input={tf().input} />
      <PeopleField look={cl()} field={tf().field} />
    </Form>
  </DemoFrame>
);

export const chipFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  variant: Variant,
  size: Size,
  states: States,
  uses: Uses,
  'single-guide': SingleGuide,
  'multi-guide': MultiGuide,
  'filter-bar': FilterBar,
  'exclude-guide': ExcludeGuide,
  'suggestion-guide': SuggestionGuide,
  'surface-guide': SurfaceGuide,
  'label-guide': LabelGuide,
  'layout-guide': LayoutGuide,
  'ex-single': ExSingle,
  'ex-multiple': ExMultiple,
  'ex-filter': ExFilter,
  'ex-suggestion': ExSuggestion,
};

