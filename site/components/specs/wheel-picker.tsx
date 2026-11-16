// Wheel Picker 페이지의 그림 — specs/components/wheel-picker.md 의 `[그림: …](../../site/components/specs/wheel-picker.tsx#<id>)` 자리.
// 휠은 wheel-picker.yaml 을 푼 값(date-look — wheel-view 의 WheelView)으로, 시트 · 팝오버는 bottom-sheet · popover.yaml 로 그린다.
// 휠을 쓰는 세 자리 — 달만 고르기(예산 월) · Time Picker · Date Picker 머리의 연 · 월 휠.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { DateLive, MonthFieldDemo, WheelPickerPlayground } from './date-demos';
import { TODAY, fogHeight, monthValue, type Month, type WpSize } from './date-shared';
import { DONE, Field, Floating, HeightTag, PhoneSheet, PickerPopover, PickerSheet, dk, popoverH, sheetFooter } from './date-screens';
import { DatePickerView } from './date-view';
import { Legend, Note, Scaled, Shot, overlayKit, pinStyle } from './overlay-screens';
import { desk, tf } from './select-screens';
import { MonthYearWheel, TimePickerView, type WheelMarks } from './wheel-view';
import { Verdict, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const OCT: Month = { y: 2026, m: 10 };
const YEARS: [number, number] = [TODAY.y - 100, TODAY.y + 100];

function MonthWheel({ mode, value = OCT, size, visible, columnDecor, marks, showFog, decor, focusColumn }: { mode: Mode; value?: Month; size?: WpSize; visible?: number; columnDecor?: Record<string, ReactNode>; marks?: WheelMarks; showFog?: boolean; decor?: ReactNode; focusColumn?: string }) {
  // 달만 고르는 휠도 달력의 연 · 월 휠과 같은 칼럼 — 연 120 오른쪽 · 월 96 왼쪽(date-picker.yaml wheel.columns)
  const c = dk().date.wheel.columns;
  return <MonthYearWheel look={dk().wheel} mode={mode} size={size} visible={visible} value={value} from={YEARS[0]} to={YEARS[1]} widths={{ year: c.year.width, month: c.month.width }} columnDecor={columnDecor} marks={marks} showFog={showFog} decor={decor} focusColumn={focusColumn} />;
}
// 예산 — 달만 고르는 칸(폰) + 월 선택 시트
function BudgetPhone({ mode, scale = 1, h = 600 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <PhoneSheet
      mode={mode}
      app="예산"
      h={h}
      scale={scale}
      form={<Field mode={mode} label="예산 월" value={monthValue(OCT)} placeholder="월 선택" />}
      sheet={
        <PickerSheet mode={mode} title="월 선택" footer={sheetFooter(mode, [DONE])}>
          <MonthWheel mode={mode} />
        </PickerSheet>
      }
    />
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => {
  const k = dk();
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex items-start gap-3">
            <BudgetPhone mode={mode} scale={0.46} />
            <PhoneSheet
              mode={mode}
              app="일정 추가"
              h={600}
              scale={0.46}
              form={<Field mode={mode} label="시작 시각" value="오후 3:00" placeholder="시간 선택" icon="clock" />}
              sheet={
                <PickerSheet mode={mode} title="시간 선택" footer={sheetFooter(mode, [DONE])}>
                  <TimePickerView wheel={k.wheel} time={k.time} mode={mode} value={{ hour: 15, minute: 0 }} />
                </PickerSheet>
              }
            />
            <Scaled w={k.date.width + overlayKit().ov.popover.body.padX * 2} h={popoverH('desk', { footer: false })} s={0.6}>
              <PickerPopover mode={mode}>
                <DatePickerView kit={k} mode={mode} value={{ y: 2026, m: 10, d: 15 }} wheelOpen />
              </PickerPopover>
            </Scaled>
          </div>
        ))}
      </div>
    </Figure>
  );
};

const Playground: Fig = () => <WheelPickerPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const w = dk().wheel;
  const size = w.defaults.size;
  const item = w.sizes[size].item;
  const visible = w.defaults.visible;
  const half = Math.floor(visible / 2);
  const fog = fogHeight(w, size, visible);
  const fogMark: CSSProperties = { background: 'repeating-linear-gradient(135deg, rgba(219,39,119,0.16) 0 6px, transparent 6px 12px)' };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="max-w-full overflow-x-auto" style={{ padding: '36px 44px 8px' }}>
          <Floating mode="auto" pad={0} style={{ width: 320 }}>
            <MonthWheel
              mode="auto"
              showFog
              marks={{ band: dashed, column: { month: dashed }, fogTop: fogMark, fogBottom: fogMark }}
              columnDecor={{
                month: (
                  <>
                    {pinStyle('ⓐ', { left: '50%', top: -30, marginLeft: -10 })}
                    <span aria-hidden className="absolute" style={{ left: 0, right: 0, top: (half - 1) * item, height: item, ...dashed, outlineOffset: -2 }} />
                    {pinStyle('ⓑ', { right: -30, top: (half - 1) * item + item / 2 - 10 })}
                  </>
                ),
              }}
              decor={
                <>
                  {pinStyle('ⓒ', { left: -30, top: half * item + item / 2 - 10 })}
                  {pinStyle('ⓓ', { left: -30, top: fog / 2 - 10 })}
                </>
              }
            />
          </Floating>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Column — 항목 글 폭 + 좌우 여백'],
            ['ⓑ', 'Item — 짧은 한 줄 글'],
            ['ⓒ', 'Indicator — 가운데 띠'],
            ['ⓓ', 'Fog — 위아래 안개'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Size ──────────────────────────────────────────────────
const Sizes: Fig = ({ caption }) => {
  const w = dk().wheel;
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-wrap items-start justify-center gap-8">
        {(['small', 'medium'] as const).map((size) => {
          const item = w.sizes[size].item;
          const visible = w.defaults.visible;
          const h = item * visible;
          const fog = fogHeight(w, size, visible);
          const t = w.sizes[size].text;
          return (
            <Shot key={size} strong={`${size} ${item}${size === w.defaults.size ? '(기본)' : ''}`} cap={`글자 ${parseFloat(t.fontSize)} / ${parseFloat(t.lineHeight)} · ${visible}칸 ${h} · 안개 ${Math.round(fog)}`}>
              <div style={{ padding: '8px 110px 8px 70px' }}>
                <Floating mode="auto" pad={0} style={{ width: 260 }}>
                  <MonthWheel
                    mode="auto"
                    size={size}
                    decor={
                      <>
                        <HeightTag top={0} h={h} label={`${h} = ${item} × ${visible}`} />
                        <HeightTag top={Math.floor(visible / 2) * item} h={item} label={`항목 ${item}`} side="left" />
                        <HeightTag top={0} h={fog} label={`안개 ${Math.round(fog)}`} side="left" />
                      </>
                    }
                  />
                </Floating>
              </div>
            </Shot>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center">
        <Note>small 은 좁은 팝오버에만 씁니다 — 누르는 높이 {w.sizes.small.item} 은 AAA(44)에 못 미칩니다. 달력 머리의 연 · 월 휠은 medium · 7칸({w.sizes.medium.item * 7} · 안개 {Math.floor(fogHeight(w, 'medium', 7))})입니다.</Note>
      </div>
    </Panel>
  );
};

// ── 달만 고르기 ────────────────────────────────────────────
// 나쁜 예 — 4 × 3 월 격자. 누르면 바로 들어가고 연은 화살표로만 넘긴다
function MonthGrid({ mode }: { mode: Mode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-12 items-center justify-between text-[16px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
        <span className="px-2">‹</span>
        2026년
        <span className="px-2">›</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="flex h-12 items-center justify-center rounded-xl text-[16px] font-medium" style={{ background: i === 9 ? rc('bg-neutral-inverted', mode) : 'transparent', color: i === 9 ? rc('fg-neutral-inverted', mode) : rc('fg-neutral-muted', mode) }}>
            {i + 1}월
          </span>
        ))}
      </div>
    </div>
  );
}
const Pair = ({ children }: { children: ReactNode }) => <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 md:flex-row">{children}</div>;
const MonthGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note='연 | 월 휠 + "완료" — 달력 머리의 연 · 월 휠과 같은 모양이고, 연을 넘나들기 쉽습니다'>
        <BudgetPhone mode="light" scale={0.52} />
      </Verdict>
      <Verdict ok={false} note="4 × 3 월 격자 — 누르면 바로 들어가고, 연은 화살표로 한 해씩만 넘깁니다">
        <PhoneSheet
          mode="light"
          app="예산"
          h={600}
          scale={0.52}
          form={<Field mode="light" label="예산 월" value={monthValue(OCT)} placeholder="월 선택" />}
          sheet={
            <PickerSheet mode="light" title="월 선택" footer={undefined}>
              <MonthGrid mode="light" />
            </PickerSheet>
          }
        />
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 미리보기 ─────────────────────────────────────────
const ExMonth: Fig = () => (
  <DateLive ov={overlayKit()} note='이 창의 폭으로 엽니다 — 1280 미만은 아래 시트, 이상은 칸 아래 팝오버입니다. 휠이 멈춘 뒤 "완료" 로 넣습니다.'>
    <MonthFieldDemo kit={dk()} ov={overlayKit()} sel={desk()} field={tf().field} label="예산 월" placeholder="월 선택" initial={OCT} />
  </DateLive>
);

// 개요 카드 — 라이트 연 | 월 휠 하나(2026년 10월을 고른 모습)
const Thumb: Fig = () => (
  <div style={{ width: 280, zoom: 0.85 }}>
    <Floating mode="light" pad={0}>
      <MonthWheel mode="light" value={OCT} />
    </Floating>
  </div>
);

export const wheelPickerFigures: Record<string, Fig> = {
  thumb: Thumb,
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  'month-guide': MonthGuide,
  'ex-month': ExMonth,
};

