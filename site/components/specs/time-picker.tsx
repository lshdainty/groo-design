// Time Picker 페이지의 그림 — specs/components/time-picker.md 의 `[그림: …](../../site/components/specs/time-picker.tsx#<id>)` 자리.
// 휠은 time-picker · wheel-picker.yaml 을 푼 값(date-look — wheel-view 의 TimePickerView)으로, 시트 · 팝오버는 bottom-sheet · popover.yaml,
// 칸은 input-button · field.yaml 로 그린다. 칸 값은 International Design — "오후 3:00".
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { DateFieldDemo, DateLive, FitZoom, TimeFieldDemo, TimePickerPlayground } from './date-demos';
import { fogHeight, formatDay, formatTime, type Time } from './date-shared';
import { D, DONE, DateTimeRow, DeskPopover, Field, Floating, HeightTag, PhoneSheet, PickerPopover, PickerSheet, ROW_GAP, SCREEN, dk, popFooter, sheetFooter, timeCol } from './date-screens';
import { Band, Legend, Note, overlayKit, pinStyle } from './overlay-screens';
import { Cap, F, desk, hr, tf } from './select-screens';
import { TfInputView } from './text-field-view';
import { TimePickerView } from './wheel-view';
import { Verdict, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const T = (hour: number, minute: number): Time => ({ hour, minute });
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const START = D(10, 15);

function TimeWheel({ mode, value = T(15, 0), step, focusColumn, columnDecor, marks, showFog, decor }: { mode: Mode; value?: Time; step?: number; focusColumn?: string; columnDecor?: Record<string, ReactNode>; marks?: Parameters<typeof TimePickerView>[0]['marks']; showFog?: boolean; decor?: ReactNode }) {
  const k = dk();
  return <TimePickerView wheel={k.wheel} time={k.time} mode={mode} value={value} step={step} focusColumn={focusColumn} columnDecor={columnDecor} marks={marks} showFog={showFog} decor={decor} />;
}
// 일정 추가 폼(폰) — 일정 · 시작(날짜 + 시각)
function ScheduleForm({ mode, time = T(15, 0) }: { mode: Mode; time?: Time }) {
  return (
    <>
      <F mode={mode} label="일정">
        <TfInputView look={tf().input} mode={mode} size="large" state="enabled" value="팀 회의" />
      </F>
      <DateTimeRow mode={mode} label="시작" date={START} time={time} />
    </>
  );
}
// 일정 추가(데스크톱) — 시각 칸 아래 8 에 팝오버(칸 왼쪽에 맞춘다)
function DeskTime({ mode, scale = 1 }: { mode: Mode; scale?: number }) {
  const o = overlayKit().ov.popover;
  const fieldW = 300;
  const popH = o.body.padTop + dk().time.height + o.footer.padTop + o.footer.button.height + o.footer.padBottom;
  return (
    <DeskPopover
      mode={mode}
      w={560}
      title="일정 추가"
      scale={scale}
      fieldW={fieldW}
      field={<DateTimeRow mode={mode} size="medium" label="시작" date={START} time={T(15, 0)} />}
      popLeft={fieldW - timeCol()}
      popH={popH}
      popover={
        <PickerPopover mode={mode} footer={popFooter(mode, [DONE])}>
          <TimeWheel mode={mode} />
        </PickerPopover>
      }
    />
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <PhoneSheet
            mode={mode}
            app="일정 추가"
            h={640}
            scale={0.6}
            form={<ScheduleForm mode={mode} />}
            sheet={
              <PickerSheet mode={mode} title="시간 선택" footer={sheetFooter(mode, [DONE])}>
                <TimeWheel mode={mode} />
              </PickerSheet>
            }
          />
          <DeskTime mode={mode} scale={0.66} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <TimePickerPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} ovs={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} sels={{ desk: desk(), hr: hr() }} field={tf().field} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const k = dk();
  const item = k.wheel.sizes[k.time.size].item;
  const half = Math.floor(k.time.visible / 2);
  const pinTop = (n: string) => pinStyle(n, { left: '50%', top: -30, marginLeft: -10 });
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="max-w-full overflow-x-auto" style={{ padding: '40px 40px 8px' }}>
          <Floating mode="auto" pad={0} style={{ width: 340 }}>
            <TimeWheel
              mode="auto"
              marks={{ band: dashed, column: { period: dashed, hour: dashed, minute: dashed } }}
              columnDecor={{ period: pinTop('ⓐ'), hour: pinTop('ⓑ'), minute: pinTop('ⓒ') }}
              decor={pinStyle('ⓓ', { left: -30, top: half * item + item / 2 - 10 })}
            />
          </Floating>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Period Column — 오전 · 오후'],
            ['ⓑ', 'Hour Column — 1~12, 오른쪽 정렬'],
            ['ⓒ', 'Minute Column — 2자리'],
            ['ⓓ', 'Indicator — 가운데 띠'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 칼럼 · 띠 · 안개 ────────────────────────────────────────
const Layout: Fig = ({ caption }) => {
  const k = dk();
  const w = k.wheel;
  const size = k.time.size;
  const item = w.sizes[size].item;
  const visible = k.time.visible;
  const h = item * visible;
  const half = Math.floor(visible / 2);
  const fog = fogHeight(w, size, visible);
  const W = 340;
  const fogMark: CSSProperties = { background: 'repeating-linear-gradient(135deg, rgba(219,39,119,0.18) 0 6px, transparent 6px 12px)' };
  const pad = (side: 'left' | 'right') => <span aria-hidden className="absolute" style={side === 'left' ? { left: 0, top: half * item, width: w.item.padX, height: item, background: MARK } : { right: 0, top: half * item, width: w.item.padX, height: item, background: MARK }} />;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="max-w-full overflow-x-auto">
          <div style={{ padding: '28px 120px 12px 90px' }}>
            <Floating mode="auto" pad={0} style={{ width: W }}>
              <TimeWheel
                mode="auto"
                showFog
                marks={{ fogTop: fogMark, fogBottom: fogMark, band: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 0 } }}
                columnDecor={{ period: <>{pad('left')}{pad('right')}</>, hour: <>{pad('left')}{pad('right')}</>, minute: <>{pad('left')}{pad('right')}</> }}
                decor={
                  <>
                    <HeightTag top={0} h={h} label={`${h} = ${item} × ${visible}`} />
                    <HeightTag top={half * item} h={item} label={`항목 ${item}`} side="left" />
                    <HeightTag top={0} h={fog} label={`안개 ${Math.round(fog)}`} side="left" />
                    <HeightTag top={h - fog} h={fog} label={`안개 ${Math.round(fog)}`} side="left" />
                    <Band style={{ left: 0, top: half * item - 16, width: w.band.insetX, height: 12 }} label={String(w.band.insetX)} />
                    <Band style={{ right: 0, top: half * item - 16, width: w.band.insetX, height: 12 }} label={String(w.band.insetX)} />
                  </>
                }
              />
            </Floating>
          </div>
        </div>
        <Note>
          칼럼은 오전·오후 → 시 → 분 순서이고, 칼럼 폭은 항목 글 폭 + 좌우 {w.item.padX}(분홍)이며 칼럼 묶음은 휠 가운데에 둡니다. 글자는 {parseFloat(w.sizes[size].text.fontSize)} / {parseFloat(w.sizes[size].text.lineHeight)} · {w.item.weight} 이고, 글자 크기 설정을 따르지 않는 px 입니다. 띠는 좌우 {w.band.insetX} 를 들인 모서리 {w.band.radius} 이고, 띠에 걸친 글자만 짙게 그립니다. 안개는 min(휠 높이 × {w.fog.ratio * 100}%, 항목 {w.fog.maxItems}칸) = {Math.round(fog)} 입니다.
        </Note>
      </div>
    </Panel>
  );
};

// ── 날짜와 함께 — 날짜 칸 + 시각 칸 ───────────────────────────
// 360 폰(좌우 24 — 칸 312)의 폼으로 그린다: 날짜 칸은 글이 다 들어가는 폭 이상, 시각 칸은 md 의 폭.
// 한 줄에 들어가지 않으면 시각 칸이 다음 줄로 내려간다 — 올해 날짜도 360 에서는 거의 꽉 찬다(가장 긴 "12월 28일 (월)" 이
// 1px 남는다 — 글꼴에 따라 내려갈 수 있다). 이 그림의 시작("10월 15일 (목)")은 한 줄, 종료(다른 해 날짜)는 시각 칸이 다음 줄.
// 라벨은 짝마다 하나(날짜 칸 위) — 시각 칸은 라벨 없이 아래를 맞춘다(DateTimeRow)
function PhoneForm({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-full flex-col rounded-xl" style={{ width: SCREEN, padding: '20px 24px', gap: tf().field.form.gapY, background: 'var(--p-bg-layer-default)' }}>
      {children}
    </div>
  );
}
const DatetimeGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto flex w-full max-w-[440px] flex-col gap-4">
      <Verdict ok note="날짜 칸 옆에 시각 칸을 둡니다. 한 줄에 다 들어가지 않으면(다른 해 날짜 · 큰 글자 · 좁은 폰) 시각 칸이 다음 줄로 내려가고, 칸의 글은 자르지 않습니다">
        <div className="flex w-full flex-col items-center gap-2">
          {/* 폰 폭(360) 그대로 그리고 판이 좁으면 통째로 줄인다 — 판 폭에 맞춰 칸을 좁히면 줄바꿈이 360 폰과 달라진다 */}
          <FitZoom w={SCREEN}>
            <PhoneForm>
              <DateTimeRow mode="auto" label="시작" date={START} time={T(15, 0)} />
              <DateTimeRow mode="auto" label="종료" date={D(1, 3, 2027)} time={T(12, 30)} />
            </PhoneForm>
          </FitZoom>
          <Cap>360 폰 — 한 줄에 들어가지 않으면(다른 해 날짜 {formatDay(D(1, 3, 2027))}) 시각 칸이 다음 줄로 내려갑니다. 라벨은 짝마다 하나입니다</Cap>
        </div>
      </Verdict>
      <Verdict ok={false} note="한 칸에 날짜 · 시각을 넣으면 시각만 바꿀 때도 날짜부터 지나야 하고, 종일이어도 시각을 걷을 수 없습니다">
        <FitZoom w={SCREEN}>
          <PhoneForm>
            <Field mode="auto" label="시작" value={`${formatDay(START)} ${formatTime(T(15, 0))}`} />
            <Field mode="auto" label="종료" value={`${formatDay(D(1, 3, 2027))} ${formatTime(T(12, 30))}`} />
          </PhoneForm>
        </FitZoom>
      </Verdict>
    </div>
  </Panel>
);

// ── 코드 미리보기 ─────────────────────────────────────────
const live = () => ({ kit: dk(), ov: overlayKit(), sel: desk(), field: tf().field });
const NOTE = '이 창의 폭으로 엽니다 — 1280 미만은 아래 시트, 이상은 칸 아래 팝오버입니다. 휠을 굴려도 칸의 값은 "완료" 를 누를 때 바뀝니다.';
const ExTime: Fig = () => (
  <DateLive ov={overlayKit()} note={NOTE}>
    <TimeFieldDemo {...live()} label="시작 시각" placeholder="시간 선택" initial={T(15, 0)} />
  </DateLive>
);
// 날짜 + 시각 한 짝 — flex-wrap, 날짜 칸은 글이 다 들어가는 폭 이상, 시각 칸은 md 의 폭. 한 줄에 다 들어가지 않으면
// (다른 해 날짜 · 큰 글자 · 좁은 폰) 시각 칸이 다음 줄로. 라벨은 짝마다 하나(날짜 칸 위), 시각 칸은 라벨 없이 아래를 맞추고
// 이름은 보조 기술에만 "시작 시간"(칸의 글 "시간 선택" 과 같은 말)
function LivePair({ label, date, time }: { label: string; date: ReturnType<typeof D>; time: Time }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: ROW_GAP, alignItems: 'flex-end' }}>
      <div style={{ flex: '1 1 0%', minWidth: 'max-content' }}>
        <DateFieldDemo {...live()} label={label} placeholder="날짜 선택" initial={date} />
      </div>
      <div style={{ width: timeCol(), flexShrink: 0 }}>
        <TimeFieldDemo {...live()} bare label={`${label} 시간`} placeholder="시간 선택" initial={time} />
      </div>
    </div>
  );
}
const ExDatetime: Fig = () => (
  <DateLive ov={overlayKit()} note={NOTE}>
    <LivePair label="시작" date={D(10, 2)} time={T(12, 30)} />
    <LivePair label="종료" date={D(1, 3, 2027)} time={T(13, 30)} />
  </DateLive>
);

// 개요 카드 — 라이트 휠 하나(오후 3:00 을 고른 모습)
const Thumb: Fig = () => (
  <div style={{ width: 320, zoom: 0.8 }}>
    <Floating mode="light" pad={0}>
      <TimeWheel mode="light" value={T(15, 0)} />
    </Floating>
  </div>
);

export const timePickerFigures: Record<string, Fig> = {
  thumb: Thumb,
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  'datetime-guide': DatetimeGuide,
  'ex-time': ExTime,
  'ex-datetime': ExDatetime,
};

