// Date Picker 페이지의 그림 — specs/components/date-picker.md 의 `[그림: …](../../site/components/specs/date-picker.tsx#<id>)` 자리.
// 달력은 date-picker.yaml 을 푼 값(date-look — date-view 의 DatePickerView · DayCell)으로, 시트 · 팝오버는 bottom-sheet · popover.yaml,
// 칩은 chip.yaml, 이전 · 다음은 button.yaml, 연 · 월 휠은 wheel-picker.yaml 로 그린다. 오늘은 2026년 10월 2일(금)이다.
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { DateFieldDemo, DateLive, DatePickerPlayground } from './date-demos';
import { TODAY, formatDay, formatRange, type Day, type PresetName } from './date-shared';
import { D, DONE, DeskPopover, Field, Floating, PhoneSheet, PickerPopover, PickerSheet, RESET, SCREEN, dk, popFooter, popoverH, sheetFooter } from './date-screens';
import { DatePickerView, DayCell, type DayInfo } from './date-view';
import { GestureMark } from './overlay-view';
import { Band, Legend, Note, Scaled, Shot, markBox, ov, overlayKit, pinStyle } from './overlay-screens';
import { Cap, F, desk, hr, tf } from './select-screens';
import { TfInputView } from './text-field-view';
import { Verdict, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const CHIPS: PresetName[] = ['thisWeek', 'thisMonth', 'lastMonth', 'last3Months', 'thisYear'];
const SEP = { y: 2026, m: 9 };
const OCT = { y: 2026, m: 10 };
const NOV = { y: 2026, m: 11 };
const RANGE = { start: D(9, 28), end: D(10, 6) };
// 달력 안 자리 — 칸 c · 줄 r 의 가운데(머리 · 요일 줄 아래)
const cellX = (c: number) => dk().date.cell.height * c + dk().date.cell.height / 2;
const rowY = (r: number, head = true) => (head ? dk().date.header.height : 0) + dk().date.weekday.height + dk().date.cell.height * r + dk().date.cell.height / 2;

// 일정 추가 폼(폰) — 날짜 · 일정(날짜 칸이 위라 시트가 열려도 보인다)
function ScheduleForm({ mode, date }: { mode: Mode; date?: Day }) {
  return (
    <>
      <Field mode={mode} label="날짜" value={date ? formatDay(date) : undefined} placeholder="날짜 선택" />
      <F mode={mode} label="일정">
        <TfInputView look={tf().input} mode={mode} size="large" state="enabled" value="팀 회의" />
      </F>
    </>
  );
}
// 날짜 하나 시트 — 열 때 칸의 값에서 시작, 고르던 날은 draft
function SingleSheet({ mode, draft, footer = true, view }: { mode: Mode; draft?: Day; footer?: boolean; view?: { y: number; m: number } }) {
  return (
    <PickerSheet mode={mode} title="날짜 선택" footer={footer ? sheetFooter(mode, [DONE]) : undefined}>
      <DatePickerView kit={dk()} mode={mode} value={draft} width="100%" view={view} />
    </PickerSheet>
  );
}
// 통계 기간 — 데스크톱 팝오버(두 달 · 칩 줄)
function StatsWindow({ mode, scale = 1, preset, value = RANGE, brand = 'desk' }: { mode: Mode; scale?: number; preset?: PresetName; value?: { start: Day; end: Day }; brand?: 'desk' | 'hr' }) {
  const d = dk(brand).date;
  const popW = d.twoMonths.width + ov(brand).popover.body.padX * 2;
  return (
    <DeskPopover
      mode={mode}
      brand={brand}
      w={popW + 32 + 16}
      title="통계"
      scale={scale}
      field={<Field mode={mode} brand={brand} label="기간" value={formatRange({ start: D(9, 1), end: D(9, 30) })} size="medium" />}
      popH={popoverH(brand, { presets: true })}
      popover={
        <PickerPopover mode={mode} brand={brand} width={popW} footer={popFooter(mode, [RESET, DONE], brand)}>
          <DatePickerView kit={dk(brand)} mode={mode} selection="range" visibleRange="twoMonths" value={value} view={SEP} presets={CHIPS} preset={preset} />
        </PickerPopover>
      }
    />
  );
}

// ── Overview ──────────────────────────────────────────────
// 라이트 — 일정 날짜(폰 시트) · 통계 기간(데스크톱 두 달), 다크 — 저축 기한(다른 해 — 연도가 붙는다) · 통계 기간
const SAVE_DUE = { y: 2027, m: 3, d: 31 };
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-3">
          {mode === 'light' ? (
            <PhoneSheet mode={mode} app="일정 추가" scale={0.48} form={<ScheduleForm mode={mode} date={TODAY} />} sheet={<SingleSheet mode={mode} draft={D(10, 15)} />} />
          ) : (
            <PhoneSheet
              mode={mode}
              app="저축 목표"
              scale={0.48}
              form={
                <>
                  <F mode={mode} label="목표 금액">
                    <TfInputView look={tf().input} mode={mode} size="large" state="enabled" value="3,000,000" suffix="원" />
                  </F>
                  <Field mode={mode} label="기한" value={formatDay(SAVE_DUE)} placeholder="날짜 선택" />
                </>
              }
              sheet={<SingleSheet mode={mode} draft={SAVE_DUE} />}
            />
          )}
          <StatsWindow mode={mode} scale={0.5} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <DatePickerPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} ovs={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} sels={{ desk: desk(), hr: hr() }} field={tf().field} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const d = dk().date;
  const w = d.width;
  const pinRow = (n: string, top: number, left: number) => pinStyle(n, { left, top });
  const single = (
    <PickerPopover
      mode="auto"
      footer={popFooter('auto', [DONE])}
      marks={{ footer: dashed }}
      decor={{ footer: pinStyle('ⓘ', { left: 10, top: ov().popover.footer.padTop + 8 }) }}
    >
      <DatePickerView
        kit={dk()}
        mode="auto"
        value={D(10, 15)}
        marks={{ header: dashed, title: markBox, nav: markBox, weekday: markBox, cells: [{ day: D(10, 21), marks: { cell: dashed } }, { day: D(10, 15), marks: { circle: { outline: `2px dashed ${MARK_LINE}`, outlineOffset: 2 } } }] }}
        decor={
          <>
            {pinRow('ⓑ', d.header.height / 2 - 10, -22)}
            {pinRow('ⓒ', -22, 46)}
            {pinRow('ⓓ', -22, w - d.nav.size - 10)}
            {pinRow('ⓔ', d.header.height + d.weekday.height / 2 - 10, -22)}
            {pinRow('ⓕ', rowY(3) - 10, w + 2)}
            {pinRow('ⓖ', rowY(2) - 10, w + 2)}
          </>
        }
      />
    </PickerPopover>
  );
  const popW = d.twoMonths.width + ov().popover.body.padX * 2;
  const presetsH = d.presets.height + d.presets.padBottom;
  const range = (
    <Scaled w={popW} h={popoverH('desk', { presets: true })} s={0.6}>
      <div>
        <PickerPopover mode="auto" width={popW} footer={popFooter('auto', [RESET, DONE])} marks={{ footer: dashed }} decor={{ footer: pinStyle('ⓘ', { left: 10, top: ov().popover.footer.padTop + 8 }) }}>
          <DatePickerView
            kit={dk()}
            mode="auto"
            selection="range"
            visibleRange="twoMonths"
            value={RANGE}
            view={SEP}
            presets={CHIPS}
            marks={{ presets: dashed, cells: [{ day: D(10, 5), marks: { band: { ...markBox, outlineOffset: 0 } } }] }}
            decor={
              <>
                {pinRow('ⓐ', d.presets.height / 2 - 10, -22)}
                {pinRow('ⓗ', presetsH + d.header.height + d.weekday.height + d.cell.height - 12, d.width + d.twoMonths.gap + d.cell.height - 12)}
              </>
            }
          />
        </PickerPopover>
      </div>
    </Scaled>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full flex-wrap items-start justify-center gap-8">
          <Shot strong="하루 — 팝오버(한 달)">
            <div style={{ padding: '8px 0' }}>{single}</div>
          </Shot>
          <Shot strong="기간 — 팝오버(두 달 · 빠른 기간)">{range}</Shot>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Presets'],
            ['ⓑ', 'Header'],
            ['ⓒ', 'Title'],
            ['ⓓ', 'Nav Button'],
            ['ⓔ', 'Weekday'],
            ['ⓕ', 'Cell'],
            ['ⓖ', 'Day'],
            ['ⓗ', 'Range Band'],
            ['ⓘ', 'Footer'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 머리 · 요일 · 날짜 칸 ───────────────────────────────────
// 높이 표시 — 부위 오른쪽 바깥의 괄호와 수
function HeightTag({ top, h, label, left }: { top: number; h: number; label: string; left: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center" style={{ top, height: h, left, zIndex: 4 }}>
      <span style={{ alignSelf: 'stretch', width: 6, borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }} />
      <span className="ml-1 whitespace-nowrap text-[11px] font-bold leading-4" style={{ color: MARK_LINE }}>
        {label}
      </span>
    </span>
  );
}
// 한 주 — 폭이 정해진 줄에서 칸 · 원이 어떻게 되는지(시트 360 · 320 화면)
function WeekStrip({ width, mode = 'auto' }: { width: number; mode?: Mode }) {
  const d = dk().date;
  const info = (day: number, extra: Partial<DayInfo> = {}): DayInfo => ({ day: D(10, day), outside: false, today: false, selected: false, inRange: false, band: null, disabled: false, readOnly: false, ...extra });
  return (
    <div style={{ width, display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', background: rc('bg-layer-floating', mode) }}>
      {[11, 12, 13, 14, 15, 16, 17].map((n) => (
        <DayCell key={n} look={d} mode={mode} live={false} info={info(n, n === 15 ? { selected: true } : n === 14 ? { today: true } : {})} marks={{ cell: { outline: `1px dashed ${MARK}`, outlineOffset: -1 } }} />
      ))}
    </div>
  );
}
const Layout: Fig = ({ caption }) => {
  const d = dk().date;
  const w = d.width;
  const c = d.cell.height;
  const top = d.header.height + d.weekday.height;
  const circleTop = top + c * 3 + d.day.top;
  const circleLeft = c * 4 + (c - d.day.size) / 2;
  const sheet = (screen: number) => screen - d.sheetPadX * 2;
  const fmt = (n: number) => (Math.round(n * 10) / 10).toString();
  const circle = (screen: number) => Math.min(d.day.size, sheet(screen) / 7 - d.day.shrinkBy);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="max-w-full overflow-x-auto">
          <div style={{ padding: '30px 120px 8px 20px' }}>
            <Floating mode="auto" pad={0}>
              <DatePickerView
                kit={dk()}
                mode="auto"
                value={D(10, 15)}
                marks={{ cells: [{ day: D(10, 21), marks: { cell: dashed } }] }}
                decor={
                  <>
                    <Band style={{ left: 0, top: -22, width: w, height: 14 }} label={`${w} = ${c} × 7`} />
                    <HeightTag top={0} h={d.header.height} label={`머리 ${d.header.height}`} left={w + 10} />
                    <HeightTag top={d.header.height} h={d.weekday.height} label={`요일 ${d.weekday.height}`} left={w + 10} />
                    <HeightTag top={top} h={c * d.cell.weeks} label={`${d.cell.weeks}주 × ${c} = ${c * d.cell.weeks}`} left={w + 10} />
                    <Band style={{ left: circleLeft, top: circleTop, width: d.day.size, height: d.day.size, borderRadius: 9999 }} label={String(d.day.size)} />
                    <Band style={{ left: c * 4, top: top + c * 3, width: c, height: d.day.top }} />
                  </>
                }
              />
            </Floating>
          </div>
        </div>
        <Note>
          칸 전체가 누르는 자리 — 원 {d.day.size} 은 칸 위 {d.day.top} · 가운데라 원 · 띠끼리 {d.day.top * 2} 떨어진다. 숫자 {parseFloat(d.day.text.fontSize)} / {parseFloat(d.day.text.lineHeight)} · {d.day.text.fontWeight}, 요일 {parseFloat(d.weekday.text.fontSize)} / {parseFloat(d.weekday.text.lineHeight)} · {d.weekday.text.fontWeight}. 9월 27일~30일 · 11월 1일~7일(앞뒤 달)은 흐리게 채우기만 하고 누르지 못한다 — 늘 {d.cell.weeks}주라 달을 넘겨도 높이가 그대로다.
        </Note>
        <div className="flex w-full flex-wrap items-start justify-center gap-6">
          {[SCREEN, 320].map((screen) => (
            <Shot key={screen} strong={`${screen} 화면 — 시트 달력 ${sheet(screen)}`} cap={`칸 ${fmt(sheet(screen) / 7)} · 원 ${fmt(circle(screen))}${sheet(screen) / 7 < d.day.shrinkBelow ? ` — ${d.day.shrinkBelow} 보다 좁아 칸 폭 − ${d.day.shrinkBy}` : ''}`}>
              <WeekStrip width={sheet(screen)} />
            </Shot>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// ── Visible Range ─────────────────────────────────────────
const VisibleRanges: Fig = ({ caption }) => {
  const d = dk().date;
  const popW = d.twoMonths.width + ov().popover.body.padX * 2;
  const monthH = popoverH('desk');
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Shot strong="twoMonths — 두 달 나란히" cap={`1280 이상 팝오버의 기간 · ${d.width} + ${d.twoMonths.gap} + ${d.width} = ${d.twoMonths.width}(팝오버 ${popW} — Popover 최대 480 의 예외)`}>
          <Scaled w={popW} h={popoverH('desk')} s={0.76}>
            <PickerPopover mode="auto" width={popW} footer={popFooter('auto', [RESET, DONE])}>
              <DatePickerView kit={dk()} mode="auto" selection="range" visibleRange="twoMonths" value={RANGE} view={SEP} />
            </PickerPopover>
          </Scaled>
        </Shot>
        <div className="flex w-full flex-wrap items-start justify-center gap-6">
          <Shot strong="month — 한 달" cap={`하루 · 여러 날 · 팝오버 ${d.width}(칸 ${d.cell.height} × 7) · 늘 ${d.cell.weeks}주`}>
            <Scaled w={d.width + ov().popover.body.padX * 2} h={monthH} s={0.72}>
              <PickerPopover mode="auto" footer={popFooter('auto', [DONE])}>
                <DatePickerView kit={dk()} mode="auto" value={D(10, 15)} />
              </PickerPopover>
            </Scaled>
          </Shot>
          <Shot strong="continuous — 이어지는 달" cap={`1280 미만 시트의 기간 · 요일 줄이 위에 붙고 아래 안개 ${d.fog.height}`}>
            <PhoneSheet
              mode="auto"
              app="통계"
              h={640}
              scale={0.55}
              form={<Field mode="auto" label="기간" value={formatRange({ start: D(9, 1), end: D(9, 30) })} />}
              sheet={
                <PickerSheet mode="auto" title="기간 선택" tall footer={sheetFooter('auto', [RESET, DONE])}>
                  <DatePickerView kit={dk()} mode="auto" selection="range" visibleRange="continuous" value={RANGE} months={[SEP, OCT, NOV]} view={SEP} scrollOffset={d.cell.height * 3} fill />
                </PickerSheet>
              }
            />
          </Shot>
        </div>
      </div>
    </Panel>
  );
};

// ── State ─────────────────────────────────────────────────
type Sw = { label: string; cells: { info: Partial<DayInfo> & { d: number }; hovered?: boolean; pressed?: boolean; ring?: boolean }[] };
const SWATCHES: Sw[] = [
  { label: '보통', cells: [{ info: { d: 15 } }] },
  { label: '호버(마우스)', cells: [{ info: { d: 15 }, hovered: true }] },
  { label: '누름(터치)', cells: [{ info: { d: 15 }, pressed: true }] },
  { label: '키보드 초점', cells: [{ info: { d: 15 }, ring: true }] },
  { label: '오늘', cells: [{ info: { d: 15, today: true } }] },
  { label: '고름', cells: [{ info: { d: 15, selected: true } }] },
  { label: '기간 — 시작 · 사이 · 끝', cells: [{ info: { d: 14, selected: true, band: 'start' } }, { info: { d: 15, inRange: true, band: 'mid' } }, { info: { d: 16, selected: true, band: 'end' } }] },
  { label: '앞뒤 달', cells: [{ info: { d: 30, outside: true } }] },
  { label: '막힘', cells: [{ info: { d: 15, disabled: true } }] },
  { label: '읽기 전용 시작일', cells: [{ info: { d: 14, selected: true, readOnly: true, band: 'start' } }, { info: { d: 15, inRange: true, band: 'mid' } }, { info: { d: 16, selected: true, band: 'end' } }] },
];
const OVERLAPS: Sw[] = [
  { label: '오늘을 고르면 — 짙은 원, 굵기는 남는다', cells: [{ info: { d: 2, today: true, selected: true } }] },
  { label: '기간 안의 오늘 — 원 없이 굵은 숫자', cells: [{ info: { d: 1, selected: true, band: 'start' } }, { info: { d: 2, today: true, inRange: true, band: 'mid' } }, { info: { d: 3, selected: true, band: 'end' } }] },
  { label: '오늘 위 호버 — 한 단계 짙은 원', cells: [{ info: { d: 2, today: true }, hovered: true }] },
  { label: '기간 사이 위 호버 — 한 단계 짙은 원', cells: [{ info: { d: 14, selected: true, band: 'start' } }, { info: { d: 15, inRange: true, band: 'mid' }, hovered: true }, { info: { d: 16, selected: true, band: 'end' } }] },
  { label: '기간 안의 막힌 날 — 띠 위 흐린 취소선', cells: [{ info: { d: 14, selected: true, band: 'start' } }, { info: { d: 15, inRange: true, band: 'mid', disabled: true } }, { info: { d: 16, selected: true, band: 'end' } }] },
  { label: '오늘인데 막힌 날 — 원 없이 굵은 숫자 + 취소선', cells: [{ info: { d: 2, today: true, disabled: true } }] },
  { label: '고른 날인데 막힌 날 — 고른 모양 + 취소선', cells: [{ info: { d: 15, selected: true, disabled: true } }] },
  { label: '시작만 고른 막힌 날 — 취소선 없음', cells: [{ info: { d: 15, selected: true, disabled: true, incompleteStart: true } }] },
];
function Swatch({ sw, mode }: { sw: Sw; mode: Mode }) {
  const d = dk().date;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sw.cells.length}, ${d.cell.height}px)` }}>
        {sw.cells.map(({ info, ...rest }, i) => (
          <DayCell key={i} look={d} mode={mode} live={false} info={{ day: D(info.outside ? 9 : 10, info.d), outside: false, today: false, selected: false, inRange: false, band: null, disabled: false, readOnly: false, ...info }} {...rest} />
        ))}
      </div>
      <span className="max-w-[160px] text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
        {sw.label}
      </span>
    </div>
  );
}
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-col gap-2">
          <Floating mode={mode} pad={20}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-4">
                {SWATCHES.map((sw) => (
                  <Swatch key={sw.label} sw={sw} mode={mode} />
                ))}
              </div>
              <div className="h-px" style={{ background: rc('stroke-neutral-weak', mode) }} />
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                {OVERLAPS.map((sw) => (
                  <Swatch key={sw.label} sw={sw} mode={mode} />
                ))}
              </div>
            </div>
          </Floating>
          <Cap strong={mode === 'light' ? '라이트' : '다크'} />
        </div>
      ))}
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
const Pair = ({ children }: { children: ReactNode }) => <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 md:flex-row">{children}</div>;
// 확인 그림의 폰 높이 — 날짜 칸이 시트 위로 보이게
const PH = 800;
const ConfirmGuide: Fig = ({ caption }) => {
  const d = dk().date;
  // 시트 안 달력에서 15일(셋째 줄 · 목)의 자리 — 그림 속 폰 화면(360) · 시트 머리 · 본문 여백에서
  const o = ov().sheet;
  const header = o.header.padTop + parseFloat(o.title.lineHeight) + o.header.padBottom;
  const cw = (SCREEN - d.sheetPadX * 2) / 7;
  const sheetH = header + d.header.height + d.weekday.height + d.cell.height * d.cell.weeks + o.body.padBottom + 12;
  const tapX = d.sheetPadX + cw * 4 + cw / 2;
  const tapY = PH - 16 - sheetH + header + d.header.height + d.weekday.height + d.cell.height * 2 + d.cell.height / 2;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='고르는 동안 칸은 그대로(10월 2일) — "완료" 를 누를 때 10월 15일 (목) 이 들어간다'>
          <PhoneSheet mode="light" app="일정 추가" h={PH} scale={0.5} form={<ScheduleForm mode="light" date={TODAY} />} sheet={<SingleSheet mode="light" draft={D(10, 15)} />} />
        </Verdict>
        <Verdict ok={false} note="날짜를 누르는 순간 칸에 넣고 닫는다 — 잘못 누른 날이 그대로 들어가고, 기간은 시작만 고르고 닫힌다">
          <div className="relative">
            <PhoneSheet
              mode="light"
              app="일정 추가"
              h={PH}
              scale={0.5}
              form={<ScheduleForm mode="light" date={D(10, 15)} />}
              sheet={<SingleSheet mode="light" draft={D(10, 15)} footer={false} />}
            />
            <div className="pointer-events-none absolute inset-0" style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
              <GestureMark kind="tap" x={tapX + 8} y={tapY + 8} note="누르면 바로 칸에" ok={false} />
            </div>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 고르는 순서 — 첫 탭 시작 · 둘째 탭 끝 · 시작보다 앞은 새 시작
const RangeGuide: Fig = ({ caption }) => {
  const steps: { n: string; t: string; value: { start: Day; end?: Day }; tap: [number, number] }[] = [
    { n: '①', t: '첫 탭 — 시작', value: { start: D(10, 8) }, tap: [4, 1] },
    { n: '②', t: '시작 뒤를 누르면 끝 — 사이가 띠로', value: { start: D(10, 8), end: D(10, 13) }, tap: [2, 2] },
    { n: '③', t: '시작보다 앞을 누르면 그날이 새 시작', value: { start: D(10, 5) }, tap: [1, 1] },
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-wrap items-start justify-center gap-5">
          {steps.map((s) => (
            <Shot key={s.n} strong={`${s.n} ${s.t}`}>
              <Scaled w={dk().date.width + 32} h={dk().date.weekday.height + dk().date.cell.height * 6 + 32} s={0.72}>
                <Floating mode="auto">
                  <DatePickerView kit={dk()} mode="auto" selection="range" value={s.value} bare decor={<GestureMark kind="tap" x={cellX(s.tap[0])} y={rowY(s.tap[1], false)} />} />
                </Floating>
              </Scaled>
            </Shot>
          ))}
        </div>
        <Note>같은 날을 두 번 누르면 하루짜리 기간이고, 다 고른 뒤 다시 누르면 새로 시작한다. 끝을 고르는 동안 띠를 미리 칠하지 않고, 끝을 고르기 전에는 &quot;완료&quot; 가 막힌다.</Note>
      </div>
    </Panel>
  );
};

// 빠른 기간 — 이번 달을 누르면 10월 전체
const Presets: Fig = ({ caption }) => {
  const d = dk().date;
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-wrap items-start justify-center gap-6">
        <Shot strong="이번 달을 눌렀다" cap="그 기간을 칠하고 그 달로 옮긴다 — 칸에는 &quot;완료&quot; 로 넣는다">
          <PhoneSheet
            mode="auto"
            app="가계부"
            h={680}
            scale={0.7}
            form={<Field mode="auto" label="기간" value={formatRange({ start: D(9, 1), end: D(9, 30) })} />}
            sheet={
              <PickerSheet mode="auto" title="기간 선택" tall footer={sheetFooter('auto', [RESET, DONE])}>
                <DatePickerView kit={dk()} mode="auto" selection="range" visibleRange="continuous" value={{ start: D(10, 1), end: D(10, 31) }} months={[SEP, OCT, NOV]} view={OCT} presets={CHIPS} preset="thisMonth" presetLayout="scroll" fill />
              </PickerSheet>
            }
          />
        </Shot>
        <Shot strong="팝오버 — 넘치면 줄바꿈" cap={`칩 사이 ${d.presets.gap} · 달력과 ${d.presets.padBottom} — 하나 고르기, 고른 칩은 짙게`}>
          <StatsWindow mode="auto" scale={0.6} preset="lastMonth" value={{ start: D(9, 1), end: D(9, 30) }} />
        </Shot>
      </div>
    </Panel>
  );
};

// 연 · 월 옮기기 — 제목을 누르면 휠
const MonthYear: Fig = ({ caption }) => {
  const d = dk().date;
  const pw = d.width + ov().popover.body.padX * 2;
  const ph = popoverH('desk', { footer: false });
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:items-start">
        <div className="max-w-full shrink-0" style={{ width: pw * 0.7 }}>
        <Shot strong="제목을 누르면" cap="셰브론이 위로 돌고 요일 줄 · 날짜 자리에 휠이 뜬다">
          <Scaled w={pw} h={ph} s={0.7}>
            <PickerPopover mode="auto">
              <DatePickerView kit={dk()} mode="auto" value={D(10, 15)} decor={<GestureMark kind="tap" x={100} y={d.header.height / 2} />} />
            </PickerPopover>
          </Scaled>
        </Shot>
        </div>
        <ArrowRight aria-hidden size={24} className="shrink-0 rotate-90 pk-muted md:mt-[120px] md:rotate-0" />
        <div className="max-w-full shrink-0" style={{ width: pw * 0.7 }}>
        <Shot strong="연 | 월 휠" cap={`Wheel Picker ${d.wheel.size} · ${d.wheel.visible}칸 — 열린 동안 이전 · 다음은 막힌다. 제목을 다시 누르면 고른 달로`}>
          <Scaled w={pw} h={ph} s={0.7}>
            <PickerPopover mode="auto">
              <DatePickerView kit={dk()} mode="auto" value={D(10, 15)} wheelOpen />
            </PickerPopover>
          </Scaled>
        </Shot>
        </div>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 고른다 — 이 창의 폭으로 시트 · 팝오버) ─────
const live = () => ({ kit: dk(), ov: overlayKit(), sel: desk(), field: tf().field });
const NOTE = '이 창의 폭으로 연다 — 1280 미만은 아래 시트, 이상은 칸 아래 팝오버.';
const ExSingle: Fig = () => (
  <DateLive ov={overlayKit()} note={NOTE}>
    <DateFieldDemo {...live()} label="날짜" placeholder="날짜 선택" initial={D(10, 15)} />
  </DateLive>
);
const ExRange: Fig = () => (
  <DateLive ov={overlayKit()} note={`${NOTE} 기간은 시트에서 달이 위아래로 이어지고, 팝오버에서 두 달이 나란히 보인다.`}>
    <DateFieldDemo {...live()} label="기간" placeholder="기간 선택" selection="range" presets={CHIPS} initial={{ start: D(9, 1), end: D(9, 30) }} />
  </DateLive>
);
// 환불일 — 거래일(9월 24일)부터 오늘(10월 2일)까지만. 그 밖은 막힌 날(흐린 숫자 + 취소선)
const TX = D(9, 24);
const ExConstraints: Fig = () => (
  <DateLive ov={overlayKit()} w={400} note={NOTE}>
    <DateFieldDemo {...live()} label="환불일" placeholder="날짜 선택" description={`거래일 ${TX.m}월 ${TX.d}일부터 오늘까지 고를 수 있어요.`} min={TX} max={TODAY} />
    <div className="flex flex-col items-center gap-2">
      <Floating mode="auto" pad={0}>
        <DatePickerView kit={dk()} mode="auto" min={TX} max={TODAY} view={OCT} />
      </Floating>
      <Cap>열면 — 9월 24일 앞 · 오늘 뒤는 막힌 날(흐린 숫자 + 취소선, 키보드 초점은 간다)</Cap>
    </div>
  </DateLive>
);

export const datePickerFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  'visible-ranges': VisibleRanges,
  states: States,
  'confirm-guide': ConfirmGuide,
  'range-guide': RangeGuide,
  presets: Presets,
  'month-year': MonthYear,
  'ex-single': ExSingle,
  'ex-range': ExRange,
  'ex-constraints': ExConstraints,
};

