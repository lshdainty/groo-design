// Bottom Sheet · Dialog · Alert Dialog · Popover 페이지(와 그 표면을 쓰는 Select · Input Button · Chip 페이지)가 같이 쓰는 그림 조각.
// 표면(시트 · 대화상자 · 확인창 · 팝오버)은 overlay-look 이 YAML 에서 푼 값으로, 칸은 field · input · select · input-button.yaml,
// 목록 줄은 list.yaml, 버튼은 button.yaml 로 그린다. 화면 틀(폰 · 창)과 뒤 화면의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { listLook } from './list-look';
import { ListView } from './list-view';
import type { RowSpec } from './list-shared';
import { CATEGORY } from './loading-data';
import { overlayLook, type OverlayLook, type OvButtons, type OvKit } from './overlay-look';
import { AlertSurface, DimView, DialogSurface, EndButtons, PopoverSurface, SheetButtons, SheetSurface, type AlertSurfaceProps, type DialogSurfaceProps, type OvMarks, type PopoverSurfaceProps, type SheetSurfaceProps } from './overlay-view';
import { Cap, F, Form, desk, hr, tf } from './select-screens';
import { InputButtonView, SelectTriggerView } from './select-view';
import { TfInputView } from './text-field-view';
import { PHONE_SAFE, Phone, Row, WebWindow, rc, type Mode } from './kit';

type Brand = 'desk' | 'hr';
export const ov = (brand: Brand = 'desk'): OverlayLook => overlayLook(brand);
export const btn = (variant: string, size: string, brand: Brand = 'desk') => buttonLook({ variant, size }, brand);
const px = (v: string) => parseFloat(v);

// 그림 속 폰의 홈 표시줄 자리(안전 영역) — kit 이 정한다
export { PHONE_SAFE };
// kit Phone 의 화면 — 틀(8) 안쪽 폭 · 높이
export const phoneInner = (h: number) => ({ w: 360 - 16, h: h - 16 });

// 줄여 그린다 — 자리(폭 · 높이)도 같이 준다
export function Scaled({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) {
  return (
    <div className="shrink-0" style={{ width: w * s, height: h * s }}>
      <div style={{ width: w, height: h, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}

export function Pin({ n, style }: { n: string; style?: CSSProperties }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE, ...style }}>
      {n}
    </span>
  );
}
// 부위 핀 — 부위의 왼쪽 위 바깥에 붙인다
export const pinAt = (n: string, x = -10, y = -10) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ left: x, top: y, zIndex: 6 }}>
    <Pin n={n} />
  </span>
);
export const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1, background: MARK };
// 수치 띠 — 부위 안의 자리(absolute)에 분홍 띠 + 숫자
export function Band({ style, label, vertical = false }: { style: CSSProperties; label?: string; vertical?: boolean }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center justify-center" style={{ background: MARK, zIndex: 4, ...style }}>
      {label && (
        <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, writingMode: vertical ? 'vertical-rl' : undefined }}>
          {label}
        </span>
      )}
    </span>
  );
}

// 범례 — 그림 판(Figure)은 내용 폭을 따르므로 폭을 막아 줄바꿈한다
export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex max-w-[560px] flex-wrap justify-center gap-x-5 gap-y-1.5 text-[12px] leading-4 pk-muted">
      {items.map(([n, t]) => (
        <span key={n} className="whitespace-nowrap">
          <b className="pk-text">{n}</b> {t}
        </span>
      ))}
    </div>
  );
}
// 그림 한 칸 — 그림 + 아래 두 줄 설명. 판보다 넓은 그림(창)은 좁은 화면에서 이 칸 안에서 가로로 민다
export function Shot({ children, cap, strong }: { children: ReactNode; cap?: ReactNode; strong?: ReactNode }) {
  return (
    <div className="flex min-w-0 max-w-full flex-col items-center gap-2">
      <div className="max-w-full overflow-x-auto">{children}</div>
      {(cap || strong) && <Cap strong={strong}>{cap}</Cap>}
    </div>
  );
}
// 그림 아래 한 줄 설명 — 판 폭을 넘지 않게
export function Note({ children }: { children: ReactNode }) {
  return <p className="max-w-[560px] text-center text-[12px] leading-5 text-fd-muted-foreground">{children}</p>;
}
// 핀을 아무 자리에(오른쪽 · 아래 기준도)
export const pinStyle = (n: string, style: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ zIndex: 6, ...style }}>
    <Pin n={n} />
  </span>
);

// ── 뒤 화면 ───────────────────────────────────────────────
const LEDGER: [string, string, string, string][] = [
  ['점심 식사', '식비 · 현대카드 M', '−12,000원', 'orange'],
  ['지하철', '교통 · 국민 체크카드', '−1,450원', 'blue'],
  ['월급', '수입 · 국민 주계좌', '+3,200,000원', 'green'],
  ['편의점', '식비 · 현금', '−4,300원', 'orange'],
  ['영화', '문화 · 국민 체크카드', '−15,000원', 'violet'],
  ['스타벅스', '카페 · 현대카드 M', '−5,600원', 'orange'],
];
export function LedgerRows({ mode, n = LEDGER.length }: { mode: Mode; n?: number }) {
  return (
    <div className="flex flex-col px-6 pt-2">
      <div className="flex items-center justify-between pb-1 text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
        <span>10월 1일 (목)</span>
        <span className="tabular-nums">−18,750원</span>
      </div>
      {LEDGER.slice(0, n).map(([title, sub, amount, hue]) => (
        <Row key={title} mode={mode} title={title} sub={sub} amount={amount} hue={hue} />
      ))}
    </div>
  );
}
// Desk 가계부(폰) — 시트 뒤 화면
export function LedgerPhone({ mode, scale = 0.6, h = 640, overlay, title = '가계부' }: { mode: Mode; scale?: number; h?: number; overlay?: ReactNode; title?: string }) {
  return (
    <Phone title={title} back={false} mode={mode} scale={scale} h={h} bg="bg-layer-default" overlay={overlay}>
      <LedgerRows mode={mode} />
    </Phone>
  );
}
// 데스크톱 창 안의 페이지 — 대화상자 · 팝오버 뒤 화면(제목 + 흰 카드 속 줄)
export function WebPage({ mode, title, brand = 'desk', rows = 4, children }: { mode: Mode; title: string; brand?: Brand; rows?: number; children?: ReactNode }) {
  return (
    <div className="h-full px-8 pt-6" style={{ background: rc('bg-layer-basement', mode, brand) }}>
      <div className="pb-4 text-[20px] font-bold" style={{ color: rc('fg-neutral', mode, brand) }}>
        {title}
      </div>
      {children}
      <div className="rounded-xl px-5 py-2" style={{ background: rc('bg-layer-default', mode, brand) }}>
        {(brand === 'hr' ? HR_ROWS : LEDGER).slice(0, rows).map(([t, sub, amount, hue], i) => (
          <Row key={`${t}${i}`} mode={mode} title={t} sub={sub} amount={amount} hue={hue} />
        ))}
      </div>
    </div>
  );
}
const HR_ROWS: [string, string, string, string][] = [
  ['연차', '10월 12일 (월)~10월 13일 (화)', '2일', 'green'],
  ['반차(오후)', '9월 25일 (금)', '0.5일', 'blue'],
  ['경조 휴가', '9월 4일 (금)', '1일', 'violet'],
  ['연차', '8월 14일 (금)', '1일', 'green'],
];

// ── 표면 안의 내용 ─────────────────────────────────────────
// 거래 추가 — 금액 · 날짜 · 카테고리(폰 large · 데스크톱 medium)
export function TxFields({ mode, size }: { mode: Mode; size: 'large' | 'medium' }) {
  const lk = desk();
  const t = tf();
  return (
    <Form>
      <F mode={mode} label="금액">
        <TfInputView look={t.input} mode={mode} size={size} state="enabled" value="12,000" suffix="원" />
      </F>
      <F mode={mode} label="날짜">
        <InputButtonView look={lk} mode={mode} size={size} state="enabled" value="10월 1일 (목)" suffixIcon="calendar" />
      </F>
      <F mode={mode} label="카테고리">
        <InputButtonView look={lk} mode={mode} size={size} state="enabled" value="식비 · 점심" prefixIcon="utensils" suffixIcon="chevron-down" />
      </F>
    </Form>
  );
}
// 거래 추가의 높이 — 라벨 + 사이 + 칸, 셋을 Field 간격으로
export function txFieldsHeight(size: 'large' | 'medium') {
  const t = tf();
  const label = px(t.field.label.text.lineHeight) + t.field.gap;
  const h = t.input.sizes.outline[size].minHeight;
  return 3 * (label + h) + 2 * t.field.form.gapY;
}
// HR 휴가 신청 — 휴가 종류(Select) · 기간(Input Button)
export function LeaveFields({ mode, size = 'medium' }: { mode: Mode; size?: 'large' | 'medium' }) {
  const lk = hr();
  return (
    <Form>
      <F mode={mode} label="휴가 종류">
        <SelectTriggerView look={lk} mode={mode} size={size} state="enabled" labels={['연차']} />
      </F>
      <F mode={mode} label="기간">
        <InputButtonView look={lk} mode={mode} size={size} state="enabled" value="10월 12일~10월 13일" suffixIcon="calendar" />
      </F>
    </Form>
  );
}
export function leaveFieldsHeight(size: 'large' | 'medium') {
  const t = tf();
  const label = px(t.field.label.text.lineHeight) + t.field.gap;
  return 2 * (label + hr().trigger.sizes[size].h) + t.field.form.gapY;
}

// 기간 — 하나 고르기 줄(오른쪽 라디오). 목록 줄은 화면 여백(24)을 스스로 가진다 — 시트 본문의 좌우 여백은 뺀다
export const PERIOD: RowSpec[] = [
  { kind: 'radio', title: '이번 달', value: 'this', checked: true },
  { kind: 'radio', title: '지난 달', value: 'last' },
  { kind: 'radio', title: '최근 3개월', value: 'q' },
];
export function PeriodList({ mode, live = false, rows = PERIOD }: { mode: Mode; live?: boolean; rows?: RowSpec[] }) {
  return <ListView look={listLook('desk')} rows={rows} mode={mode} live={live} ariaLabel="기간" />;
}
// 카테고리 고르기 — 줄 데이터는 loading-data(브라우저 미리보기와 같이 쓴다)
export { CATEGORY };
// 앞 타일이 있는 줄 높이 — 위아래 여백 + max(타일, 제목 줄 높이)
export function tileRowHeight() {
  const f = listLook('desk').faces.none.light.enabled;
  return f.pad.y * 2 + Math.max(f.tile.size, px(f.title.lineHeight ?? f.title.fontSize));
}
// 카테고리 고르기 시트 — 위 닫기, 바닥 없음(누르면 바로 고른다), 끝 흐림
export function CategorySheet({ mode, ...rest }: Partial<SheetBits> & { mode: Mode }) {
  return (
    <SheetSurface look={ov().sheet} mode={mode} title="카테고리 고르기" safe={PHONE_SAFE} bodyPad={false} fog {...rest}>
      <ListView look={listLook('desk')} rows={CATEGORY} mode={mode} live={false} ariaLabel="카테고리" />
    </SheetSurface>
  );
}
// 거래 상세 — 키 · 값 줄
export const DETAIL: RowSpec[] = [
  { kind: 'view', title: '금액', suffix: { text: '−12,000원' } },
  { kind: 'view', title: '내용', suffix: { text: '점심 식사' } },
  { kind: 'view', title: '카테고리', suffix: { text: '식비' } },
  { kind: 'view', title: '결제 수단', suffix: { text: '현대카드 M' } },
  { kind: 'view', title: '날짜', suffix: { text: '10월 1일 (목) 오후 12:30' } },
];
export function DetailList({ mode, rows = DETAIL, brand = 'desk' }: { mode: Mode; rows?: RowSpec[]; brand?: Brand }) {
  return <ListView look={listLook(brand)} rows={rows} mode={mode} live={false} />;
}
// 목록 줄 높이 — 한 줄(위아래 여백 + 제목 줄 높이)
export function listRowHeight() {
  const f = listLook('desk').faces.none.light.enabled;
  return f.pad.y * 2 + px(f.title.lineHeight ?? f.title.fontSize);
}

// ── 표면(멈춘 그림) ────────────────────────────────────────
type SheetBits = Omit<SheetSurfaceProps, 'look' | 'title'> & { mode: Mode };
// 거래 추가 시트 — 위 닫기 + 바닥 저장(입력 폼)
export function TxAddSheet({ mode, footer, ...rest }: Partial<SheetBits> & { mode: Mode }) {
  const o = ov();
  return (
    <SheetSurface look={o.sheet} mode={mode} title="거래 추가" safe={PHONE_SAFE} footer={footer ?? <SheetButtons mode={mode} items={[{ label: '저장', look: btn('neutralSolid', o.sheet.footer.button.size) }]} />} {...rest}>
      <TxFields mode={mode} size="large" />
    </SheetSurface>
  );
}
// 기간 시트 — 위 닫기 + 설명 + 고르기 + 바닥 초기화 · 적용
export function PeriodSheet({ mode, footer, ...rest }: Partial<SheetBits> & { mode: Mode }) {
  const o = ov();
  const s = o.sheet.footer.button.size;
  return (
    <SheetSurface
      look={o.sheet}
      mode={mode}
      title="기간"
      description="고른 기간의 거래만 보여요."
      safe={PHONE_SAFE}
      bodyPad={false}
      footer={
        footer ?? (
          <SheetButtons
            mode={mode}
            items={[
              { label: '초기화', look: btn('neutralWeak', s) },
              { label: '적용', look: btn('neutralSolid', s) },
            ]}
          />
        )
      }
      {...rest}
    >
      <PeriodList mode={mode} />
    </SheetSurface>
  );
}
// 거래 상세 시트 — 위 닫기, 바닥 없음(조회)
export function DetailSheet({ mode, ...rest }: Partial<SheetBits> & { mode: Mode }) {
  return (
    <SheetSurface look={ov().sheet} mode={mode} title="거래 상세" safe={PHONE_SAFE} bodyPad={false} {...rest}>
      <DetailList mode={mode} />
    </SheetSurface>
  );
}
export const SheetOn = ({ mode, children }: { mode: Mode; children: ReactNode }) => (
  <DimView dim={ov().sheet.dim} mode={mode} place="end">
    {children}
  </DimView>
);

type DialogBits = Omit<DialogSurfaceProps, 'look' | 'title'> & { mode: Mode };
// HR 휴가 신청 대화상자 — 입력 폼: 바닥 취소 · 신청, 머리 닫기 없음
export function LeaveDialog({ mode, footer, ...rest }: Partial<DialogBits> & { mode: Mode }) {
  const o = ov('hr');
  const s = o.dialog.footer.button.size;
  return (
    <DialogSurface
      look={o.dialog}
      mode={mode}
      title="휴가 신청"
      description="승인되면 알려드려요."
      footer={
        footer ?? (
          <EndButtons
            mode={mode}
            items={[
              { label: '취소', look: btn('neutralWeak', s, 'hr') },
              { label: '신청', look: btn('brandSolid', s, 'hr') },
            ]}
          />
        )
      }
      {...rest}
    >
      <LeaveFields mode={mode} />
    </DialogSurface>
  );
}
// Desk 거래 상세 대화상자 — 조회: 머리 닫기, 바닥 없음
export function DetailDialog({ mode, ...rest }: Partial<DialogBits> & { mode: Mode }) {
  return (
    <DialogSurface look={ov().dialog} mode={mode} title="거래 상세" close bodyPad={false} {...rest}>
      <DetailList mode={mode} />
    </DialogSurface>
  );
}
// Desk 거래 추가 대화상자 — 입력 폼: 바닥 취소 · 저장
export function TxAddDialog({ mode, footer, ...rest }: Partial<DialogBits> & { mode: Mode }) {
  const o = ov();
  const s = o.dialog.footer.button.size;
  return (
    <DialogSurface
      look={o.dialog}
      mode={mode}
      title="거래 추가"
      footer={
        footer ?? (
          <EndButtons
            mode={mode}
            items={[
              { label: '취소', look: btn('neutralWeak', s) },
              { label: '저장', look: btn('neutralSolid', s) },
            ]}
          />
        )
      }
      {...rest}
    >
      <TxFields mode={mode} size="medium" />
    </DialogSurface>
  );
}
export const CenterOn = ({ mode, children, dim }: { mode: Mode; children: ReactNode; dim?: OverlayLook['dialog']['dim'] }) => (
  <DimView dim={dim ?? ov().dialog.dim} mode={mode} place="center">
    {children}
  </DimView>
);

// 대화상자의 머리 · 바닥 높이 — 창 높이를 셀 때(제목 한 줄 · 설명 한 줄)
export function dialogChrome(brand: Brand = 'desk', description = false) {
  const d = ov(brand).dialog;
  const head = d.header.padTop + px(d.title.lineHeight) + (description ? d.header.gap + px(d.description.lineHeight) : 0) + d.header.padBottom;
  const foot = d.footer.padTop + d.footer.button.height + d.footer.padBottom;
  return { head, foot };
}

// ── 확인창(멈춘 그림) ──────────────────────────────────────
// 폰(1280 미만)은 버튼 medium 40, 데스크톱(1280 이상)은 small 36
export function alertButtons(wide: boolean, brand: Brand = 'desk') {
  const a = ov(brand).alert.footer;
  return (variant: string) => btn(variant, wide ? a.above.size : a.below.size, brand);
}
type AlertBits = Omit<AlertSurfaceProps, 'look' | 'description' | 'confirm'> & { mode: Mode; wide?: boolean };
export function DeleteAlert({ mode, wide = false, ...rest }: AlertBits) {
  const b = alertButtons(wide);
  return <AlertSurface look={ov().alert} mode={mode} title="거래를 삭제할까요?" description="삭제한 거래는 되돌릴 수 없어요." cancel={{ label: '취소', look: b('neutralWeak') }} confirm={{ label: '삭제', look: b('criticalSolid') }} {...rest} />;
}
export function LeaveAlert({ mode, wide = false, ...rest }: AlertBits) {
  const b = alertButtons(wide);
  return <AlertSurface look={ov().alert} mode={mode} title="작성한 내용이 사라져요" description="나가면 입력한 금액과 날짜가 저장되지 않아요." cancel={{ label: '계속 작성', look: b('neutralWeak') }} confirm={{ label: '나가기', look: b('criticalSolid') }} {...rest} />;
}
export function GroupAlert({ mode, wide = false, ...rest }: AlertBits) {
  const b = alertButtons(wide);
  return <AlertSurface look={ov().alert} mode={mode} title="관심 그룹을 삭제할까요?" description="그룹에 담은 종목 12개도 함께 빠져요." cancel={{ label: '취소', look: b('neutralWeak') }} confirm={{ label: '그룹과 종목 함께 삭제', look: b('criticalSolid') }} {...rest} />;
}
export const AlertOn = ({ mode, children }: { mode: Mode; children: ReactNode }) => (
  <DimView dim={ov().alert.dim} mode={mode} place="center">
    {children}
  </DimView>
);

// ── 팝오버(멈춘 그림) ──────────────────────────────────────
// HR 연차 사용 규정 — 머리(제목 + 닫기) · 본문 글
export const RULE_TEXT = '입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요. 쓰지 않은 연차는 다음 해 3월에 정산해요.';
const RULE_SHORT = '입사 1년 미만은 한 달에 1일씩 생겨요.';
// 본문 글 — 팝오버 설명과 같은 글자(t4 · fg-neutral-muted)
export function RuleBody({ mode, short = false }: { mode: Mode; short?: boolean }) {
  const d = ov('hr').popover.description;
  return <p style={{ margin: 0, fontFamily: d.fontFamily, fontSize: d.fontSize, lineHeight: d.lineHeight, color: rc('fg-neutral-muted', mode, 'hr') }}>{short ? RULE_SHORT : RULE_TEXT}</p>;
}
type PopBits = Omit<PopoverSurfaceProps, 'look'> & { mode: Mode };
export function RulePopover({ mode, children, ...rest }: PopBits) {
  return (
    <PopoverSurface look={ov('hr').popover} mode={mode} title="연차 사용 규정" {...rest}>
      {children ?? <RuleBody mode={mode} />}
    </PopoverSurface>
  );
}

export type { Mode, OvMarks };

// 실제로 여닫는 미리보기 · 플레이그라운드에 넘기는 한 벌(서버에서 YAML 을 풀어 브라우저로)
export function overlayKit(brand: Brand = 'desk'): OvKit {
  const o = ov(brand);
  const set = (size: string): OvButtons => ({ solid: btn('neutralSolid', size, brand), weak: btn('neutralWeak', size, brand), brand: btn('brandSolid', size, brand), critical: btn('criticalSolid', size, brand) });
  return { ov: o, sheet: set(o.sheet.footer.button.size), dialog: set(o.dialog.footer.button.size), alert: { below: set(o.alert.footer.below.size), above: set(o.alert.footer.above.size) } };
}
