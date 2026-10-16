// Slider 페이지의 그림 — specs/components/slider.md 의 `[그림: …](../../site/components/specs/slider.tsx#<id>)` 자리.
// 슬라이더는 slider.yaml 을 푼 값(sliderLook — slider-view)으로, 칸 이름 · 설명 · 오류 · 머리 자리는 Field(field.yaml — text-field-view)로 그린다.
// 설정 화면의 스위치 줄은 switch.yaml, 금액 칸은 input.yaml 이다. 값 · 이름은 지어낸 것이다.
import type { ReactNode } from 'react';
import { tokenValue } from '@/lib/component-spec';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { PRESETS, headText, isDiscrete, segmentsOf, sliderLookZoom, type SliderLook, type SliderPreset, type SliderState, type SliderValue } from './input-shared';
import { sliderLook } from './input-look';
import { Phone, Verdict, WebWindow, rc, type Mode } from './kit';
import { Band, Legend, pinStyle } from './overlay-screens';
import { Cap, Surface, tf } from './select-screens';
import { ExBasicDemo, ExRangeDemo, ExStepsDemo, SliderPlayground } from './slider-play';
import { SliderValueView, SliderView } from './slider-view';
import { switchLook } from './switch-look';
import { SwitchView } from './switch-view';
import { TfFieldView, TfInputView } from './text-field-view';
import { Readout } from './toggle-play';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';
const SL = (brand: Brand = 'desk') => sliderLook(brand);
const STATE_KO: Record<SliderState, string> = { enabled: '기본', hovered: '호버(웹)', focused: '포커스(키보드)', pressed: '누름', disabled: '막힘' };
const px = (v: string) => parseFloat(v);
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;

// 멈춘 Field + Slider — 머리 오른쪽 지금 값, 아래 설명 · 오류
function SF({
  preset,
  value,
  mode = 'auto',
  state = 'enabled',
  active = 0,
  indicator,
  width,
  error = false,
  description = true,
  brand = 'desk',
  surface,
  look,
  hideMarkers,
}: {
  preset: SliderPreset;
  value?: SliderValue;
  mode?: Mode;
  state?: SliderState;
  active?: 0 | 1;
  indicator?: boolean;
  width: number;
  error?: boolean;
  description?: boolean;
  brand?: Brand;
  surface?: 'default' | 'floating';
  look?: SliderLook;
  hideMarkers?: boolean;
}) {
  const l = look ?? SL(brand);
  const v = value ?? preset.value;
  const disabled = state === 'disabled';
  return (
    <TfFieldView
      look={tf().field}
      mode={mode}
      label={preset.label}
      width={width}
      headerAction={
        <SliderValueView look={l} mode={mode} disabled={disabled}>
          {headText(v, preset.unit)}
        </SliderValueView>
      }
      description={description ? preset.description : undefined}
      invalid={error}
      errorMessage={preset.error}
    >
      <SliderView look={l} mode={mode} min={preset.min} max={preset.max} step={preset.step} value={v} unit={preset.unit} state={state} active={active} indicator={indicator} width={width} surface={surface} hideMarkers={hideMarkers} />
    </TfFieldView>
  );
}

// ── 화면 — 설정 > 알림 ─────────────────────────────────────
function SwitchRow({ label, on, mode }: { label: string; on: boolean; mode: Mode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-[15px] leading-5" style={{ color: rc('fg-neutral', mode) }}>
        {label}
      </span>
      <SwitchView look={switchLook()} mode={mode} checked={on} state="enabled" ariaLabel={label} />
    </div>
  );
}
function AlertSettings({ mode, width }: { mode: Mode; width: number }) {
  return (
    <div className="flex flex-col gap-4">
      <SwitchRow label="예산 알림" on mode={mode} />
      <SF preset={PRESETS.threshold} mode={mode} width={width} />
      <SwitchRow label="카드 결제 예정 알림" on mode={mode} />
      <SwitchRow label="할 일 알림" on={false} mode={mode} />
    </div>
  );
}
const PHONE_SCREEN = 360;
const gutterOf = () => parseFloat(String(tokenValue('$spacing-global-gutter')));
function SettingsPhone({ mode, scale = 0.6, h = 560 }: { mode: Mode; scale?: number; h?: number }) {
  const w = PHONE_SCREEN - gutterOf() * 2;
  return (
    <Phone title="알림" mode={mode} scale={scale} h={h} bg="bg-layer-default" screenW={PHONE_SCREEN}>
      <div style={{ padding: `16px ${gutterOf()}px 0` }}>
        <AlertSettings mode={mode} width={w} />
      </div>
    </Phone>
  );
}
// 창 높이 — 설정 카드(스위치 줄 · 슬라이더 칸 · 스위치 줄 둘)가 다 보이게
const WIN_H = 480;
function SettingsWindow({ mode }: { mode: Mode }) {
  return (
    <WebWindow mode={mode} w={620} h={WIN_H}>
      <div className="flex h-full flex-col px-8 pt-6" style={{ background: rc('bg-layer-basement', mode) }}>
        <span className="pb-4 text-[22px] font-bold leading-[30px]" style={{ color: rc('fg-neutral', mode) }}>
          알림
        </span>
        <div className="rounded-2xl p-6" style={{ background: rc('bg-layer-default', mode), border: `1px solid ${rc('stroke-neutral-weak', mode)}` }}>
          <AlertSettings mode={mode} width={420} />
        </div>
      </div>
    </WebWindow>
  );
}
const Scaled = ({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) => (
  <div className="shrink-0" style={{ width: w * s, height: h * s }}>
    <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
  </div>
);

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <Scaled w={620} h={WIN_H} s={0.6}>
            <SettingsWindow mode={mode} />
          </Scaled>
          <SettingsPhone mode={mode} scale={0.45} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <SliderPlayground looks={{ desk: SL('desk'), hr: SL('hr') }} fields={{ desk: tf().field, hr: tf().field }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const k = 1.6;
  const base = SL();
  const z = sliderLookZoom(base, k);
  const p = PRESETS.score;
  const W = 300 * k;
  const v = 3;
  const x = (val: number) => z.thumb.inset + ((W - z.thumb.inset * 2) * (val - p.min)) / (p.max - p.min);
  const H = z.control.height;
  const head = { fontFamily: tf().field.label.text.fontFamily, fontSize: px(tf().field.label.text.fontSize) * k, lineHeight: `${px(tf().field.label.text.lineHeight) * k}px`, fontWeight: tf().field.label.weight.medium };
  // 손잡이 줄은 위 여백(말풍선 자리) 아래에서 시작한다
  const T0 = z.padTop;
  const indicatorTop = T0 + H / 2 - z.thumb.size / 2 - z.indicator.offsetY - (px(z.indicator.text.lineHeight) + z.indicator.padY * 2);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-4 pb-8 pt-10">
        <div className="max-w-full overflow-x-auto">
          <div style={{ width: W + 32, paddingTop: 40, paddingBottom: 30, paddingLeft: 16, paddingRight: 16 }}>
            {/* 머리 — 라벨 · 지금 값(Field 의 headerAction 자리) */}
            <div className="relative flex items-center justify-between" style={{ marginBottom: tf().field.gap * k }}>
              <span style={{ ...head, color: rc('fg-neutral') }}>{p.label}</span>
              <span className="relative">
                <SliderValueView look={z}>{headText(v, p.unit)}</SliderValueView>
                {pinStyle('ⓖ', { right: -12, top: -18 })}
              </span>
            </div>
            <div className="relative">
              <SliderView look={z} min={p.min} max={p.max} step={p.step} value={v} unit={p.unit} state="pressed" width={W} marks={{ markers: { outline: `1px dashed ${MARK_LINE}` } }} />
              {pinStyle('ⓐ', { left: x(4.6) - 10, top: T0 + H / 2 - 30 })}
              {pinStyle('ⓑ', { left: x(1.5) - 10, top: T0 + H / 2 - 30 })}
              {pinStyle('ⓒ', { left: x(v) + z.thumb.pressedSize / 2 + 2, top: T0 + H / 2 + 4 })}
              {pinStyle('ⓓ', { left: x(v) + 24, top: indicatorTop - 6 })}
              {pinStyle('ⓔ', { left: x(2) - 10, top: T0 + H / 2 + 8 })}
              {pinStyle('ⓕ', { left: -12, top: T0 + H + z.gap - 6 })}
            </div>
          </div>
        </div>
        <Legend
          items={[
            ['ⓐ', `Track — ${base.track.height}`],
            ['ⓑ', 'Fill'],
            ['ⓒ', `Thumb — ${base.thumb.size} · 누르는 동안 ${base.thumb.pressedSize}`],
            ['ⓓ', 'Value Indicator'],
            ['ⓔ', `Tick — 틈 ${base.tick.width}`],
            ['ⓕ', 'Markers'],
            ['ⓖ', 'Header Value'],
          ]}
        />
        <span className="text-center text-[12px] pk-muted">{k}배로 그렸다 — 별점 1 ~ 5(4 구간)를 누르는 동안</span>
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const Mode_: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { p: PRESETS.threshold, cap: '값 하나 — 최솟값에서 손잡이까지' },
        { p: PRESETS.usage, cap: '값 둘 — 두 손잡이 사이, 손잡이마다 이름("예산 사용률 최소" · "최대")' },
      ].map(({ p, cap }) => (
        <div key={p.key} className="flex flex-col items-center gap-2">
          <Surface>
            <SF preset={p} width={280} description={false} />
          </Surface>
          <Cap>{cap}</Cap>
        </div>
      ))}
    </div>
  </Panel>
);

// 모양 — 트랙 · 채움 · 손잡이 20 · 누르는 동안 24 · 손잡이 줄 44(라이트 · 다크)
function LookRow({ mode, state }: { mode: Mode; state: SliderState }) {
  const l = SL();
  const W = 260;
  const p = PRESETS.threshold;
  const H = l.control.height;
  const x = l.thumb.inset + ((W - l.thumb.inset * 2) * (60 - p.min)) / (p.max - p.min);
  const t = state === 'pressed' ? l.thumb.pressedSize : l.thumb.size;
  const T0 = l.padTop;
  return (
    <div className="relative" style={{ width: W }}>
      <SliderView look={l} mode={mode} min={p.min} max={p.max} step={p.step} value={60} unit={p.unit} state={state} indicator={false} width={W} hideMarkers />
      {/* 손잡이 줄 44 — 줄 전체가 누르는 자리(위 여백 — 말풍선 자리 — 아래에서 시작한다) */}
      <span aria-hidden className="pointer-events-none absolute left-0 right-0" style={{ top: T0, height: H, outline: `1px dashed ${MARK_LINE}`, background: MARK, opacity: 0.6 }} />
      <Band style={{ right: -16, top: T0, height: H, width: 3 }} />
      <span aria-hidden className="absolute text-[10px] font-bold leading-4" style={{ right: -38, top: T0 + H / 2 - 8, color: MARK_LINE }}>
        {H}
      </span>
      <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ left: x - t / 2, top: T0 + H / 2 + t / 2 + 2, width: t, textAlign: 'center', color: MARK_LINE }}>
        {t}
      </span>
      <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ left: W - 70, top: T0 + H / 2 - l.track.height / 2 - 18, color: MARK_LINE }}>
        {`트랙 ${l.track.height}`}
      </span>
    </div>
  );
}
const Look: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-2">
          <Surface mode={mode} className="flex w-full flex-col items-center gap-6" style={{ paddingTop: 28, paddingBottom: 28 }}>
            <LookRow mode={mode} state="enabled" />
            <LookRow mode={mode} state="pressed" />
          </Surface>
          <Cap strong={mode === 'light' ? '라이트' : '다크'}>위 기본 · 아래 누르는 동안 — 분홍이 누르는 자리(손잡이 줄 전체)</Cap>
        </div>
      ))}
    </div>
  </Panel>
);

// 값 보이기 — 머리 값 · 끄는 동안 말풍선 · 끝에서 안으로 밀린 말풍선 · 양 끝 표식
const Value: Fig = ({ caption }) => {
  const l = SL();
  const t = tf().field;
  const headH = px(t.label.text.lineHeight);
  const gapAll = t.gap + l.padTop;
  // 말풍선의 위 끝 — 손잡이 줄 위에서 잰다. 자리는 누르지 않은 손잡이(20) 기준이라 누른 24 를 따라 오르지 않는다. 머리 아래 끝과의 사이가 남는 자리
  const bubbleTop = l.control.height / 2 - l.thumb.size / 2 - l.indicator.offsetY - (px(l.indicator.text.lineHeight) + l.indicator.padY * 2);
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { v: 80, st: 'enabled' as const, cap: '가만히 — 머리 값만(80%)', band: false },
          { v: 80, st: 'pressed' as const, cap: `끄는 동안 — 손잡이 위 말풍선. 머리 ↔ 손잡이 줄 ${gapAll}(Field ${t.gap} + 위 ${l.padTop})이라 머리를 덮지 않는다(${gapAll + bubbleTop} 남음)`, band: true },
          { v: 100, st: 'pressed' as const, cap: '끝에서 — 상자만 안으로, 화살표는 손잡이', band: false },
        ].map(({ v, st, cap, band }) => (
          <div key={cap} className="flex max-w-[260px] flex-col items-center gap-2">
            <Surface>
              <div className="relative">
                <SF preset={PRESETS.threshold} value={v} state={st} width={220} description={false} />
                {band && (
                  <>
                    <Band style={{ left: -14, width: 3, top: headH, height: gapAll }} />
                    <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ left: -16, top: headH + gapAll / 2 - 8, transform: 'translateX(-100%)', color: MARK_LINE }}>
                      {gapAll}
                    </span>
                  </>
                )}
              </div>
            </Surface>
            <Cap>{cap}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 단계 · 눈금 — 10 구간(눈금 없이 양 끝) · 별점 4 구간(틈 3 · 표식 5)
const Ticks: Fig = ({ caption }) => {
  const l = SL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {[PRESETS.threshold, PRESETS.score].map((p) => {
          const n = segmentsOf(p.min, p.max, p.step);
          const d = isDiscrete(l, p.min, p.max, p.step);
          return (
            <div key={p.key} className="flex flex-col items-center gap-2">
              <Surface>
                <SF preset={p} width={280} description={false} />
              </Surface>
              <Cap strong={`${n} 구간`}>{d ? `${l.tick.min} ~ ${l.tick.max} 구간 — 틈 ${n - 1} · 표식 ${n + 1}` : `${l.tick.max + 1} 구간 이상 — 눈금 없이 양 끝 표식`}</Cap>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

// 상태 다섯 — 라이트 · 다크
const States: Fig = ({ caption }) => {
  const order: SliderState[] = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'];
  const l = SL();
  // Field 없이 늘어놓은 줄 — 말풍선이 손잡이 줄 위로 나오는 만큼에서 위 여백(padTop)을 뺀 나머지를 더 비운다
  const top = px(l.indicator.text.lineHeight) + l.indicator.padY * 2 + l.indicator.offsetY - (l.control.height / 2 - l.thumb.size / 2) - l.padTop;
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        <div className="mx-auto grid w-max grid-cols-[max-content_max-content] items-end gap-x-5 gap-y-2">
          {order.map((st) => (
            <div key={st} className="contents">
              <span className="pb-6 text-[12px] font-bold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                {STATE_KO[st]}
              </span>
              <div style={{ paddingTop: Math.max(0, top) + 4 }}>
                <SliderView look={l} mode={mode} min={50} max={100} step={5} value={80} unit="%" state={st} width={180} />
              </div>
            </div>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>호버 · 포커스 · 누름에 말풍선 — 누름은 손잡이 24, 포커스는 링. 막힘은 전용 색(흐리게 하지 않는다)</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
function Requests({ items, tone }: { items: string[]; tone: 'ok' | 'bad' }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-1 p-0">
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-2 text-[12px] leading-4" style={{ color: rc(tone === 'ok' ? 'fg-neutral' : i === items.length - 1 ? 'fg-critical' : 'fg-neutral-subtle') }}>
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: rc(tone === 'ok' ? 'fg-positive' : 'fg-neutral-subtle') }} />
          {t}
        </li>
      ))}
    </ol>
  );
}
const CommitGuide: Fig = ({ caption }) => {
  const p = PRESETS.threshold;
  const steps = [75, 70, 65, 60, 55, 50];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="끄는 동안은 화면만 따라가고 손을 뗄 때 한 번 — 요청 중에도 막지 않아 키보드 초점이 그대로다">
          <div className="flex w-full max-w-[300px] flex-col gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-default') }}>
            <SF preset={p} value={50} state="focused" width={228} />
            <Requests items={['손을 뗌 → PATCH budgetAlertThreshold 50 — 한 번']} tone="ok" />
          </div>
        </Verdict>
        <Verdict ok={false} note="단계마다 저장하고 요청 중에 막기 — 80 → 50 에 여섯 번, 막힌 손잡이가 Tab 순서에서 빠져 초점이 본문으로 떨어진다">
          <div className="flex w-full max-w-[300px] flex-col gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-default') }}>
            <SF preset={p} value={55} state="disabled" width={228} />
            <Requests items={[...steps.map((s) => `PATCH ${s}`), '초점 → <body>']} tone="bad" />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

function AmountInput({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <TfFieldView look={tf().field} mode={mode} label="한 달 예산">
      <TfInputView look={tf().input} mode={mode} size="large" state="enabled" value="1,500,000" suffix="원" />
    </TfFieldView>
  );
}
const WhenGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="2 ~ 5단계 가운데 하나(별점)는 Slider — 단계마다 표식. 정확한 숫자 · 금액은 Input(숫자 키보드 · 뒤 단위)">
        <div className="flex w-full max-w-[280px] flex-col gap-3">
          <Surface>
            <SF preset={PRESETS.score} width={220} description={false} />
          </Surface>
          <Surface>
            <AmountInput />
          </Surface>
        </div>
      </Verdict>
      <Verdict ok={false} note="금액을 슬라이더로 — 원하는 값에 맞출 수 없고, 끄는 손이 값을 가린다">
        <Surface className="w-full max-w-[280px]">
          <SF preset={{ key: 'budget', label: '한 달 예산', min: 0, max: 300, step: 1, unit: '만원', value: 150 }} width={220} description={false} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const NameGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="이름은 칸 이름(Field 라벨), 값은 aria-valuetext 에 단위를 붙여 — 무엇의 80 인지 들린다">
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <Surface>
            <SF preset={PRESETS.threshold} state="focused" width={228} description={false} />
          </Surface>
          <Readout text="예산 알림 임계값, 80%, 슬라이더" />
        </div>
      </Verdict>
      <Verdict ok={false} note="이름 자리에 값을 넣기(지금 앱) — '80%, 60%' 로 읽혀 무엇을 정하는지 모른다. 올리면 '70%'(실제 85)">
        <div className="flex w-full max-w-[300px] flex-col gap-3">
          <Surface>
            <SF preset={PRESETS.threshold} state="focused" width={228} description={false} />
          </Surface>
          <Readout text="80%, 60%, 슬라이더" />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 미리보기 ─────────────────────────────────────────
const ExBasic: Fig = () => <ExBasicDemo look={SL()} field={tf().field} />;
const ExSteps: Fig = () => <ExStepsDemo look={SL()} field={tf().field} />;
const ExRange: Fig = () => <ExRangeDemo look={SL()} field={tf().field} />;

export const sliderFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  mode: Mode_,
  look: Look,
  value: Value,
  ticks: Ticks,
  states: States,
  'commit-guide': CommitGuide,
  'when-guide': WhenGuide,
  'name-guide': NameGuide,
  'ex-basic': ExBasic,
  'ex-steps': ExSteps,
  'ex-range': ExRange,
};
