// Date Picker · Time Picker · Wheel Picker 페이지(와 그 피커를 여는 Input Button · Popover 페이지)가 같이 쓰는 그림 조각.
// 시트 · 팝오버는 bottom-sheet · popover.yaml(overlay-look), 칸은 input-button · field.yaml, 버튼은 button.yaml, 달력 · 휠은 date-look 이 푼 값으로 그린다.
// 화면 틀(폰 · 창)과 뒤 화면의 글자 크기만 그림 안에서 정한다. 오늘은 2026년 10월 2일(금)이다.
import type { CSSProperties, ReactNode } from 'react';
import { MARK_LINE } from '../foundations/ui';
import { dateKit, type Brand } from './date-look';
import { TODAY, formatDay, formatTime, type Day, type Time } from './date-shared';
import { DimView, EndButtons, PopoverSurface, SheetButtons, SheetSurface, type OvDecor, type OvMarks } from './overlay-view';
import { PHONE_SAFE, btn, ov } from './overlay-screens';
import { F, desk, hr, tf } from './select-screens';
import type { SelIcon } from './select-shared';
import { InputButtonView } from './select-view';
import { Phone, WebWindow, rc, type Mode } from './kit';

export const dk = (brand: Brand = 'desk') => dateKit(brand);
export const sel = (brand: Brand = 'desk') => (brand === 'hr' ? hr() : desk());
const px = (v: string) => parseFloat(v);
export const D = (m: number, d: number, y = TODAY.y): Day => ({ y, m, d });
// 그림 속 폰 화면 폭 — 스펙의 "360 화면"(시트 달력 312 · 칸 44.6)
export const SCREEN = 360;

type Btn = { label: string; variant: 'neutralSolid' | 'neutralWeak'; disabled?: boolean };
// 바닥 — 시트는 large(하나면 폭 전체 · 둘이면 반씩), 팝오버는 small 오른쪽
export const sheetFooter = (mode: Mode, items: Btn[], brand: Brand = 'desk') => (
  <SheetButtons mode={mode} items={items.map((b) => ({ label: b.label, look: btn(b.variant, ov(brand).sheet.footer.button.size, brand), state: b.disabled ? 'disabled' : 'enabled' }))} />
);
export const popFooter = (mode: Mode, items: Btn[], brand: Brand = 'desk') => (
  <EndButtons mode={mode} items={items.map((b) => ({ label: b.label, look: btn(b.variant, ov(brand).popover.footer.button.size, brand), state: b.disabled ? 'disabled' : 'enabled' }))} />
);
export const DONE: Btn = { label: '완료', variant: 'neutralSolid' };
export const RESET: Btn = { label: '초기화', variant: 'neutralWeak' };

// 시트(멈춘 그림) — 위 닫기 · 제목(고를 값의 종류) · 본문 · 바닥. tall 이면 화면 높이의 90%(이어지는 달)
export function PickerSheet({ mode, brand = 'desk', title, footer, tall = false, marks, decor, children }: { mode: Mode; brand?: Brand; title: string; footer: ReactNode; tall?: boolean; marks?: OvMarks; decor?: OvDecor; children: ReactNode }) {
  const o = ov(brand);
  return (
    <SheetSurface look={o.sheet} mode={mode} title={title} footer={footer} safe={PHONE_SAFE} style={tall ? { height: `${o.sheet.maxHeight * 100}%` } : undefined} bodyStyle={tall ? { display: 'flex', flexDirection: 'column' } : undefined} marks={marks} decor={decor}>
      {children}
    </SheetSurface>
  );
}

// 폰 + 열린 시트 — 뒤 화면은 폼(form)
export function PhoneSheet({ mode, brand = 'desk', app, form, h = 720, scale = 1, sheet }: { mode: Mode; brand?: Brand; app: string; form: ReactNode; h?: number; scale?: number; sheet: ReactNode }) {
  return (
    <Phone title={app} mode={mode} scale={scale} h={h} bg="bg-layer-default" screenW={SCREEN} overlay={sheet && <DimView dim={ov(brand).sheet.dim} mode={mode} place="end">{sheet}</DimView>}>
      <div className="flex flex-col px-6 pt-4" style={{ gap: tf().field.form.gapY }}>
        {form}
      </div>
    </Phone>
  );
}

// 팝오버(멈춘 그림) — 머리 없는 고르는 패널, 바닥 버튼. width 를 주면 그 폭(두 달 744 — Popover 최대 480 의 예외)
export function PickerPopover({ mode, brand = 'desk', footer, width, marks, decor, children, style }: { mode: Mode; brand?: Brand; footer?: ReactNode; width?: number; marks?: OvMarks; decor?: OvDecor; children: ReactNode; style?: CSSProperties }) {
  return (
    <PopoverSurface look={ov(brand).popover} mode={mode} footer={footer} width={width} scroll={{ scrolled: false }} style={width ? { maxWidth: width, ...style } : style} marks={marks} decor={decor}>
      {children}
    </PopoverSurface>
  );
}

// 칸 — 폰은 large, 데스크톱은 medium
export function Field({ mode, brand = 'desk', label, value, placeholder, icon = 'calendar', size = 'large', state = 'enabled' }: { mode: Mode; brand?: Brand; label: string; value?: string; placeholder?: string; icon?: SelIcon; size?: 'large' | 'medium'; state?: 'enabled' | 'pressed' }) {
  return (
    <F mode={mode} label={label}>
      <InputButtonView look={sel(brand)} mode={mode} size={size} state={state} value={value} placeholder={placeholder} suffixIcon={icon} />
    </F>
  );
}
// 날짜 칸 + 시각 칸 나란히(time-picker.md "날짜와 함께" — flex-wrap gap-x2, 날짜 칸은 글이 다 들어가는 폭 이상(min-w-max flex-1),
// 시각 칸은 md 의 폭(shrink-0). 한 줄에 다 들어가지 않으면 시각 칸이 다음 줄로 — 칸 글은 말줄임으로 자르지 않는다).
// 라벨은 짝마다 하나("시작" · "종료") — 날짜 칸 위에 두고, 시각 칸은 라벨 없이 아래를 맞춘다(내려가도 라벨 줄이 생기지 않는다).
// 시각 칸의 이름은 보조 기술에만 "시작 시간"(칸의 글 "시간 선택" 과 같은 말)
export const timeCol = () => dk().time.fieldWidth;
export const ROW_GAP = 8;
export function DateTimeRow({ mode, brand = 'desk', size = 'large', label, date, time }: { mode: Mode; brand?: Brand; size?: 'large' | 'medium'; label: string; date?: Day; time?: Time }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: ROW_GAP, alignItems: 'flex-end' }}>
      <div style={{ flex: '1 1 0%', minWidth: 'max-content' }}>
        <Field mode={mode} brand={brand} label={label} value={date ? formatDay(date) : undefined} placeholder="날짜 선택" size={size} />
      </div>
      <div data-time-field style={{ width: timeCol(), flexShrink: 0 }}>
        <span className="sr-only">{`${label} 시간`}</span>
        <InputButtonView look={sel(brand)} mode={mode} size={size} state="enabled" value={time ? formatTime(time) : undefined} placeholder="시간 선택" suffixIcon="clock" />
      </div>
    </div>
  );
}

// 칸 하나의 높이 — 라벨 줄 + 사이 + 상자
export const fieldH = (size: 'large' | 'medium', brand: Brand = 'desk') => px(tf().field.label.text.lineHeight) + tf().field.gap + sel(brand).ib.sizes[size].h;

// 데스크톱 창 + 페이지(제목 · 칸) + 칸 아래 8 의 팝오버. 창 높이는 팝오버 아래 margin 까지
export function DeskPopover({ mode, brand = 'desk', w, title, url, field, fieldW = 280, fieldsH, popover, popH, popLeft = 0, margin = 32, scale = 1 }: { mode: Mode; brand?: Brand; w: number; title: string; url?: string; field: ReactNode; fieldW?: number; fieldsH?: number; popover: ReactNode; popH: number; popLeft?: number; margin?: number; scale?: number }) {
  const o = ov(brand).popover;
  const top = 24 + 44;
  // 칸(들)의 높이 — 팝오버는 마지막 칸 아래 8 에 붙는다
  const h = 32 + top + (fieldsH ?? fieldH('medium', brand)) + o.offset + popH + margin;
  return (
    <div className="shrink-0" style={{ width: w * scale, height: h * scale }}>
      <div style={{ width: w, height: h, transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: 'top left' }}>
        <WebWindow mode={mode} w={w} h={h} url={url ?? (brand === 'hr' ? 'hr.groo.app' : 'desk.groo.app')}>
          <div className="relative h-full px-8 pt-6" style={{ background: rc('bg-layer-basement', mode, brand) }}>
            <div className="pb-4 text-[20px] font-bold leading-7" style={{ color: rc('fg-neutral', mode, brand) }}>
              {title}
            </div>
            <div className="relative" style={{ width: fieldW }}>
              {field}
              <div className="absolute z-10" style={{ left: popLeft, top: `calc(100% + ${o.offset}px)` }}>
                {popover}
              </div>
            </div>
          </div>
        </WebWindow>
      </div>
    </div>
  );
}

// 팝오버 높이 — 본문 위 + 달력(칩 줄 · 머리 · 요일 · 6주) + 바닥
export function popoverH(brand: Brand = 'desk', o: { presets?: boolean; header?: boolean; footer?: boolean; body?: number } = {}) {
  const p = ov(brand).popover;
  const d = dk(brand).date;
  const body = o.body ?? (o.presets ? d.presets.height + d.presets.padBottom : 0) + (o.header === false ? 0 : d.header.height) + d.weekday.height + d.cell.height * d.cell.weeks;
  return p.body.padTop + body + (o.footer === false ? p.body.padBottom : p.footer.padTop + p.footer.button.height + p.footer.padBottom);
}

// 떠 있는 판(그림 속 달력 · 휠만 보일 때) — 바탕 bg-layer-floating · 모서리 20(Popover 와 같은 판)
export function Floating({ mode, brand = 'desk', children, pad = 16, style }: { mode: Mode; brand?: Brand; children: ReactNode; pad?: number; style?: CSSProperties }) {
  const p = ov(brand).popover;
  return (
    <div style={{ boxSizing: 'border-box', borderRadius: p.radius, padding: pad, background: rc('bg-layer-floating', mode, brand), ...style }}>
      {children}
    </div>
  );
}

// 높이 표시 — 판 바깥 왼쪽 · 오른쪽의 괄호와 수
export function HeightTag({ top, h, label, side = 'right', gap = 10 }: { top: number; h: number; label: string; side?: 'left' | 'right'; gap?: number }) {
  const line = `1px solid ${MARK_LINE}`;
  const right = side === 'right';
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center" style={right ? { top, height: h, left: `calc(100% + ${gap}px)`, zIndex: 5 } : { top, height: h, right: `calc(100% + ${gap}px)`, zIndex: 5, flexDirection: 'row-reverse' }}>
      <span style={right ? { alignSelf: 'stretch', width: 6, borderTop: line, borderBottom: line, borderRight: line } : { alignSelf: 'stretch', width: 6, borderTop: line, borderBottom: line, borderLeft: line }} />
      <span className="whitespace-nowrap text-[11px] font-bold leading-4" style={right ? { color: MARK_LINE, marginLeft: 4 } : { color: MARK_LINE, marginRight: 4 }}>
        {label}
      </span>
    </span>
  );
}
