// 알림 메시지 넷의 그림이 같이 쓰는 화면 조각(서버) — Desk 가계부 · 증권 · 거래 추가, 띠 자리, Anatomy 핀, Do/Don't 칸.
// 알림 메시지 자체(띠 · 상자 · 결과)는 feedback-view 가 YAML 값으로 그린다. 화면 틀(폰 · 창 · 시트)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { calloutLook, snackbarLook } from './feedback-look';
import { CalloutView } from './feedback-view';
import { SheetOverlay, SheetPanel } from './input-button-pickers';
import { overlayLook } from './overlay-look';
import { Row, rc, type Mode } from './kit';
import { F, Form, cta, desk, tf } from './select-screens';
import { InputButtonView } from './select-view';
import { TfInputView } from './text-field-view';

export type Fig = (p: { caption?: string }) => ReactNode;

// ── Anatomy 핀 · 칠 ─────────────────────────────────────
export function Pin({ n }: { n: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
}
export const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, background: MARK };
export const markLine: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 };
export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted sm:grid-cols-3">
      {items.map(([n, t]) => (
        <span key={n}>
          <b className="pk-text">{n}</b> {t}
        </span>
      ))}
    </div>
  );
}
// 치수 표시 — 분홍 띠 위 수(디자인 도구의 간격 표시)
export function Band({ style, label, vertical = false, below = false }: { style: CSSProperties; label?: string; vertical?: boolean; below?: boolean }) {
  return (
    <span aria-hidden className="absolute flex items-center justify-center" style={{ background: MARK, pointerEvents: 'none', ...style }}>
      {label && (
        <span
          className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white"
          style={vertical ? { left: '100%', marginLeft: 4, background: MARK_LINE } : below ? { top: '100%', marginTop: 3, background: MARK_LINE } : { bottom: '100%', marginBottom: 3, background: MARK_LINE }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

// ── 칸 · 쌍 ─────────────────────────────────────────────
// 이렇게 · 이렇게 하지 않는다 — 좁은 화면에서는 위아래로
export const Pair = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={`flex w-full flex-col gap-4 ${wide ? 'max-w-[900px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
export const W = ({ children, w = 320 }: { children: ReactNode; w?: number }) => (
  <div className="max-w-full" style={{ width: w }}>
    {children}
  </div>
);
export function Muted({ children, mode = 'auto', className = '' }: { children: ReactNode; mode?: Mode; className?: string }) {
  return (
    <span className={`text-[12px] leading-4 ${className}`} style={{ color: rc('fg-neutral-subtle', mode) }}>
      {children}
    </span>
  );
}
export function ModeTag({ mode }: { mode: 'light' | 'dark' }) {
  return <Muted mode={mode}>{mode === 'light' ? '라이트' : '다크'}</Muted>;
}

// ── 화면 조각 ───────────────────────────────────────────
// 오늘 2026. 10. 2. (금) — 가계부의 하루 묶음
export const LEDGER: [string, string, string, string][] = [
  ['점심 식사', '식비 · 현대카드 M', '−12,000원', 'orange'],
  ['스타벅스', '카페 · 현대카드 M', '−5,600원', 'brown'],
  ['지하철', '교통 · 국민 체크카드', '−1,450원', 'blue'],
  ['월급', '수입 · 토스뱅크 통장', '+3,200,000원', 'green'],
];
export function DayHead({ mode = 'auto', day = '10월 2일 (금)', total = '−19,050원' }: { mode?: Mode; day?: string; total?: string }) {
  return (
    <div className="flex items-center justify-between pt-3 text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
      <span>{day}</span>
      <span className="tabular-nums">{total}</span>
    </div>
  );
}
export function LedgerRows({ mode = 'auto', n = LEDGER.length, from = 0 }: { mode?: Mode; n?: number; from?: number }) {
  return (
    <>
      {LEDGER.slice(from, from + n).map(([title, sub, amount, hue]) => (
        <Row key={title} mode={mode} title={title} sub={sub} amount={amount} hue={hue} />
      ))}
    </>
  );
}
// 증권 — 보유 종목
export const STOCKS: [string, string, string, string][] = [
  ['삼성전자', '10주 · 국내', '712,000원', 'blue'],
  ['SK하이닉스', '2주 · 국내', '452,000원', 'red'],
  ['Apple', '3주 · 해외', '1,021,500원', 'violet'],
];
export function StockRows({ mode = 'auto', n = STOCKS.length }: { mode?: Mode; n?: number }) {
  return (
    <>
      {STOCKS.slice(0, n).map(([title, sub, amount, hue]) => (
        <Row key={title} mode={mode} title={title} sub={sub} amount={amount} hue={hue} />
      ))}
    </>
  );
}

// 띠 자리 — 놓인 화면 영역의 아래 가운데(좌우 · 아래 여백은 snackbar.yaml 의 region). 탭 바 · 바닥 버튼은 영역 밖 아래에 둔다
export function SnackDock({ children, gap = 8, style }: { children: ReactNode; gap?: number; style?: CSSProperties }) {
  const r = snackbarLook().region;
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" style={{ gap, padding: `0 ${r.padX}px ${r.padBottom}px`, ...style }}>
      {children}
    </div>
  );
}

// Desk 거래 추가 시트 — 저장에 실패하면 폼은 연 채로 맨 위에 Callout(critical). 시트는 Bottom Sheet(overlay-look)다
export const SAVE_FAIL = '저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 다시 저장해 주세요.';
export function TxSheet({ mode, error = true }: { mode: Mode; error?: boolean }) {
  const lk = desk();
  const o = overlayLook();
  const t = tf();
  return (
    <SheetOverlay ov={o} mode={mode}>
      <SheetPanel ov={o} mode={mode} title="거래 추가" footer={cta('저장', mode)}>
        <div className="px-6">
          <Form gap={t.field.form.gapY}>
            {error && <CalloutView look={calloutLook()} mode={mode} tone="critical" description={SAVE_FAIL} state="enabled" />}
            <F mode={mode} label="금액">
              <TfInputView look={t.input} mode={mode} size="large" state="enabled" value="12,000" suffix="원" />
            </F>
            <F mode={mode} label="카테고리">
              <InputButtonView look={lk} mode={mode} size="large" state="enabled" value="식비 · 점심" prefixIcon="utensils" suffixIcon="chevron-down" />
            </F>
          </Form>
        </div>
      </SheetPanel>
    </SheetOverlay>
  );
}

// 가운데 대화상자(Alert Dialog — 되돌릴 수 없는 결정). 대화상자는 아직 스펙이 없다 — 역할 색으로 간단히
export function DialogCard({ mode = 'auto', title, body, cancel = '취소', confirm }: { mode?: Mode; title: string; body: string; cancel?: string; confirm: string }) {
  return (
    <div className="w-full rounded-[20px] px-6 pb-5 pt-6" style={{ background: rc('bg-layer-floating', mode), boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-subtle', mode)}` }}>
      <div className="text-[18px] font-bold leading-6" style={{ color: rc('fg-neutral', mode) }}>
        {title}
      </div>
      <div className="mt-2 text-[14px] leading-[19px]" style={{ color: rc('fg-neutral-muted', mode) }}>
        {body}
      </div>
      <div className="mt-6 flex gap-2">
        <div className="flex-1">
          <ButtonView look={buttonLook({ variant: 'neutralWeak', size: 'large' })} mode={mode} label={cancel} fill state="enabled" />
        </div>
        <div className="flex-1">
          <ButtonView look={buttonLook({ variant: 'criticalSolid', size: 'large' })} mode={mode} label={confirm} fill state="enabled" />
        </div>
      </div>
    </div>
  );
}

// 가계부 머리 — 달 · 이번 달 지출(목록 위)
export function MonthHead({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div className="flex flex-col gap-0.5 pt-2">
      <span className="text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
        10월 지출
      </span>
      <span className="text-[22px] font-bold leading-[30px] tabular-nums" style={{ color: rc('fg-neutral', mode) }}>
        412,300원
      </span>
    </div>
  );
}
