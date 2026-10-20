// Select · Input Button 페이지가 같이 쓰는 그림 조각 — 화면 예시(Desk 거래 추가 · HR 휴가 신청), Field 묶음, 설명 글, 선택지 묶음.
// 칸(Select · Input Button · Input)의 수치는 YAML 을 푼 값(selectLook · textFieldLook)에서 온다. 화면 틀(폰 · 창 · 대화상자)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { buttonLook } from './button-look';
import { timeLook } from './date-look';
import { ButtonView } from './button-view';
import { overlayLook } from './overlay-look';
import { DialogSurface, DimView } from './overlay-view';
import { selectLook, type SelGroup, type SelSizeProp, type SelectLook } from './select-look';
import { InputButtonView, SelectOpenView, SelectTriggerView } from './select-view';
import { textFieldLook } from './text-field-look';
import { TfFieldView, TfInputView } from './text-field-view';
import { Phone, WebWindow, rc, type Mode } from './kit';

export const desk = () => selectLook('desk');
export const hr = () => selectLook('hr');
export const tf = () => textFieldLook('desk');
const px = (v: string) => parseFloat(v);

export function Cap({ children, strong }: { children?: ReactNode; strong?: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
      {strong && <b className="text-[13px] pk-text">{strong}</b>}
      {children}
    </span>
  );
}

// 흰 판 — 칸은 흰 바탕 위에 둔다. 포커스 링(바깥 4px)이 잘리지 않게 여백을 둔다
export function Surface({ mode = 'auto', brand = 'desk', children, className = '', style }: { mode?: Mode; brand?: 'desk' | 'hr'; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ background: rc('bg-layer-default', mode, brand), ...style }}>
      {children}
    </div>
  );
}

export function Cell({ label, children, mode = 'auto', className = '' }: { label?: ReactNode; children: ReactNode; mode?: Mode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <Surface mode={mode}>{children}</Surface>
      {label && <Cap>{label}</Cap>}
    </div>
  );
}

// Field(멈춘 그림) — 라벨 · 설명 · 오류 + 칸
export function F({ mode = 'auto', label, description, error, indicator, children }: { mode?: Mode; label?: string; description?: string; error?: string; indicator?: 'required' | 'optional'; children: ReactNode }) {
  return (
    <TfFieldView look={tf().field} mode={mode} label={label} description={description} errorMessage={error} invalid={!!error} indicator={indicator}>
      {children}
    </TfFieldView>
  );
}

// 폼 — Field 를 form.gapY 간격으로 쌓는다
export function Form({ children, gap }: { children: ReactNode; gap?: number }) {
  return (
    <div className="flex flex-col" style={{ gap: gap ?? tf().field.form.gapY }}>
      {children}
    </div>
  );
}

export const cta = (label: string, mode: Mode, variant = 'neutralSolid', brand: 'desk' | 'hr' = 'desk') => <ButtonView look={buttonLook({ variant, size: 'large' }, brand)} mode={mode} label={label} fill state="enabled" />;
export const smallBtn = (label: string, mode: Mode, variant: string, brand: 'desk' | 'hr' = 'hr', size = 'small') => <ButtonView look={buttonLook({ variant, size }, brand)} mode={mode} label={label} state="enabled" />;

// ── 선택지 묶음 ─────────────────────────────────────────
// 결제 수단(Desk) — "없음" 은 맨 앞 따로 묶음
export const PAY_NONE: SelGroup = { items: [{ value: 'none', label: '결제 수단 없음', icon: 'circle-slash' }] };
export const PAY_FLAT: SelGroup = {
  items: [
    { value: 'cash', label: '현금', icon: 'banknote' },
    { value: 'kb-check', label: '국민 체크카드', icon: 'credit-card' },
    { value: 'hyundai-m', label: '현대카드 M', icon: 'credit-card' },
    { value: 'toss', label: '토스뱅크 통장', icon: 'landmark' },
    { value: 'kakao', label: '카카오뱅크 통장', icon: 'landmark' },
  ],
};
export const PAY_GROUPS: SelGroup[] = [
  PAY_NONE,
  { label: '카드', items: [{ value: 'kb-check', label: '국민 체크카드', icon: 'credit-card' }, { value: 'hyundai-m', label: '현대카드 M', icon: 'credit-card' }] },
  { label: '계좌 · 현금', items: [{ value: 'toss', label: '토스뱅크 통장', description: '1000-1234-5678', icon: 'landmark' }, { value: 'cash', label: '현금', icon: 'banknote' }] },
];
export const plain = (groups: SelGroup[]): SelGroup[] => groups.map((g) => ({ ...g, items: g.items.map(({ icon, ...i }) => (void icon, i)) }));
// 휴가 정책(HR)
export const POLICY: SelGroup[] = [
  {
    items: [
      { value: 'annual', label: '연차', description: '남은 연차 11일' },
      { value: 'half-am', label: '반차(오전)' },
      { value: 'half-pm', label: '반차(오후)' },
      { value: 'family', label: '경조 휴가' },
      { value: 'sick', label: '병가' },
      { value: 'official', label: '공가' },
    ],
  },
];
// 카테고리(Desk) — 여럿 고르기
export const CATS: SelGroup[] = [
  {
    items: [
      { value: 'food', label: '식비', icon: 'utensils' },
      { value: 'transport', label: '교통', icon: 'bus' },
      { value: 'shopping', label: '쇼핑', icon: 'shopping-bag' },
      { value: 'culture', label: '문화', icon: 'film' },
      { value: 'health', label: '의료', icon: 'stethoscope' },
    ],
  },
];

// ── 화면 예시 ───────────────────────────────────────────
// 날짜 칸 + 시각 칸 나란히 — 날짜와 시각은 한 칸에 넣지 않는다(time-picker.md "날짜와 함께" · flex-wrap gap-x2,
// 날짜 칸은 글이 다 들어가는 폭 이상 · 시각 칸은 md 의 폭 — 한 줄에 다 들어가지 않으면 시각 칸이 다음 줄로)
export function DateTimeFields({ mode, label, date, time, size = 'large', brand = 'desk' }: { mode: Mode; label: string; date: string; time: string; size?: 'large' | 'medium'; brand?: 'desk' | 'hr' }) {
  const lk = brand === 'hr' ? hr() : desk();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end' }}>
      <div style={{ flex: '1 1 0%', minWidth: 'max-content' }}>
        <F mode={mode} label={label}>
          <InputButtonView look={lk} mode={mode} size={size} state="enabled" value={date} suffixIcon="calendar" />
        </F>
      </div>
      {/* 라벨은 짝마다 하나(날짜 칸 위) — 시각 칸은 라벨 없이 아래를 맞추고, 이름은 보조 기술에만 */}
      <div style={{ width: timeLook().fieldWidth, flexShrink: 0 }}>
        <span className="sr-only">시간</span>
        <InputButtonView look={lk} mode={mode} size={size} state="enabled" value={time} suffixIcon="clock" />
      </div>
    </div>
  );
}

// Desk 거래 추가(폰 · large) — 카테고리 · 날짜 · 시각은 Input Button, 결제 수단은 Select. 틀 안 화면은 360(날짜 칸 + 시각 칸이 한 줄에 들어가는 폭)
export function DeskTxPhone({ mode, scale = 0.58, h = 640, payment, overlay, screenW = 360 }: { mode: Mode; scale?: number; h?: number; payment?: ReactNode; overlay?: ReactNode; screenW?: number }) {
  const lk = desk();
  const t = tf();
  return (
    <Phone title="거래 추가" mode={mode} scale={scale} h={h} bg="bg-layer-default" bottom={cta('저장', mode)} overlay={overlay} screenW={screenW}>
      <div className="flex flex-col px-6 pt-4" style={{ gap: t.field.form.gapY }}>
        <F mode={mode} label="금액">
          <TfInputView look={t.input} mode={mode} size="large" state="enabled" value="12,000" suffix="원" />
        </F>
        <F mode={mode} label="카테고리">
          <InputButtonView look={lk} mode={mode} size="large" state="enabled" value="식비 · 점심" prefixIcon="utensils" suffixIcon="chevron-down" />
        </F>
        <F mode={mode} label="결제 수단">
          {payment ?? <SelectTriggerView look={lk} mode={mode} size="large" state="enabled" labels={['현대카드 M']} />}
        </F>
        <DateTimeFields mode={mode} label="날짜" date="10월 1일 (목)" time="오후 3:00" />
      </div>
    </Phone>
  );
}

// HR 대화상자(데스크톱) — Dialog(dialog.yaml): 화면 정중앙 · medium 480. 입력 폼이라 머리 닫기 없이 바닥 [취소] [주 버튼].
// 열린 목록 · 팝오버는 대화상자 밖으로 나온다(실제로는 body 에 띄운다) — 판이 자르지 않게 그린다
export function HrDialog({ mode, title, description, children, footer }: { mode: Mode; title: string; description?: string; children: ReactNode; footer: ReactNode }) {
  const o = overlayLook('hr');
  return (
    <DimView dim={o.dialog.dim} mode={mode} place="center">
      <DialogSurface look={o.dialog} mode={mode} title={title} description={description} footer={footer} unclipped>
        {children}
      </DialogSurface>
    </DimView>
  );
}
// 대화상자의 머리(제목 한 줄) · 바닥(버튼 한 줄) 높이 — 창 높이를 셀 때
export function hrDialogChrome(description = false) {
  const d = overlayLook('hr').dialog;
  return {
    head: d.header.padTop + px(d.title.lineHeight) + (description ? d.header.gap + px(d.description.lineHeight) : 0) + d.header.padBottom,
    foot: d.footer.padTop + d.footer.button.height + d.footer.padBottom,
  };
}
// 창 높이 — 가운데 대화상자(높이 dialogH)에서 머리 아래 below 만큼 내려온 것(열린 목록 · 팝오버)이 창 아래 margin 안에 들어오게
export function centeredWindowH(dialogH: number, head: number, below: number, margin = 24) {
  return 32 + Math.max(dialogH + margin * 2, 2 * (head + below + margin) - dialogH);
}
// 바닥 [취소] [주 버튼] — 대화상자는 Button small
export const hrFooter = (mode: Mode, primary: string) => {
  const size = overlayLook('hr').dialog.footer.button.size;
  return (
    <>
      {smallBtn('취소', mode, 'neutralWeak', 'hr', size)}
      {smallBtn(primary, mode, 'brandSolid', 'hr', size)}
    </>
  );
};

// HR 휴가 신청(데스크톱 · medium) — 휴가 정책 Select 를 열었다
export function HrLeaveWindow({ mode, w = 540, s = 1 }: { mode: Mode; w?: number; s?: number }) {
  const lk = hr();
  const t = tf();
  const m = lk.item.sizes.medium;
  const label = px(t.field.label.text.lineHeight) + t.field.gap;
  // 열린 목록의 아래 끝 — 라벨 + 간격 + 칸 + 목록 간격 + 목록(위아래 여백 + 설명 있는 줄 하나 + 한 줄 다섯)
  const listH = lk.content.padY * 2 + m.heightDesc + m.height * (POLICY[0].items.length - 1);
  const listBottom = label + lk.trigger.sizes.medium.h + lk.content.gutter + listH;
  const body = 2 * (label + lk.trigger.sizes.medium.h) + t.field.form.gapY;
  const c = hrDialogChrome();
  const h = centeredWindowH(c.head + body + c.foot, c.head, listBottom);
  return (
    <ScaledBox w={w} h={h} s={s}>
    <WebWindow mode={mode} w={w} h={h} url="hr.groo.app">
      <HrDialog mode={mode} title="휴가 신청" footer={hrFooter(mode, '신청')}>
        <Form>
          <F mode={mode} label="휴가 정책">
            <SelectOpenView look={lk} mode={mode} size="medium" groups={POLICY} selected={['annual']} states={{ 'half-am': 'hovered' }} placement="overlay" />
          </F>
          <F mode={mode} label="날짜">
            <InputButtonView look={lk} mode={mode} size="medium" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
          </F>
        </Form>
      </HrDialog>
    </WebWindow>
    </ScaledBox>
  );
}

// 줄여 그린다 — 자리(폭 · 높이)도 같이 준다
export function ScaledBox({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) {
  if (s === 1) return <>{children}</>;
  return (
    <div className="shrink-0" style={{ width: w * s, height: h * s }}>
      <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}

// 거래 추가 · 휴가 신청 — 라이트 줄 · 다크 줄(두 페이지의 첫 그림)
export function HeroScreens() {
  return (
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <DeskTxPhone mode={mode} />
          <HrLeaveWindow mode={mode} s={0.7} />
        </div>
      ))}
    </div>
  );
}

// 코드 미리보기 — 흰 판에 실제로 쓰는 칸
export function Live({ children, w = 360, brand = 'desk' }: { children: ReactNode; w?: number; brand?: 'desk' | 'hr' }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <Surface brand={brand} className="mx-auto w-full" style={{ maxWidth: w }}>
          {children}
        </Surface>
      </div>
    </figure>
  );
}

export type { SelSizeProp, SelectLook };
