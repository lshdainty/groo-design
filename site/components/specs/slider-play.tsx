'use client';
// Slider 플레이그라운드 · 코드 미리보기 — 값 하나 · 둘, 단계(10 구간 · 별점 4 구간), 막힘을 고르면 스펙대로 그린 슬라이더(slider-view — slider.yaml)와
// 그 코드가 바뀐다. 실제로 끌고, 손잡이에 초점을 두고 화살표 · Home · End · PageUp 을 눌러 볼 수 있다 — 손을 뗄 때 저장 요청이 한 번 나가는 것이 함께 보인다.
// 칸 이름 · 설명 · 오류 · 머리 값은 Field(field.yaml — text-field-view)가 둘레에서 그린다. 코드는 slider.md 의 "코드" 절과 같은 API 다.
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { FONT, PRESETS, headText, icv, type SliderLook, type SliderPreset, type ViewMode } from './input-shared';
import { BRANDS, MODES, PlayFrame, Seg } from './select-playground';
import { SliderValueView, SliderView } from './slider-view';
import type { SliderValue } from './input-shared';
import type { TfFieldLook } from './text-field-shared';
import { TfFieldView } from './text-field-view';

type Brand = 'desk' | 'hr';
const fmt = (unit: string) => (v: number) => `${v}${unit}`;
// Field + Slider — 라벨은 묶음 이름(span id), 슬라이더 손잡이가 aria-labelledby 로 가리킨다(범위는 손잡이마다 "{라벨} 최소" · "{라벨} 최대")
export function SliderField({
  look,
  field,
  mode = 'auto',
  preset,
  value,
  onValueChange,
  onValueCommit,
  disabled = false,
  invalid = false,
  surface,
}: {
  look: SliderLook;
  field: TfFieldLook;
  mode?: ViewMode;
  preset: SliderPreset;
  value: SliderValue;
  onValueChange?: (v: SliderValue) => void;
  onValueCommit?: (v: SliderValue) => void;
  disabled?: boolean;
  invalid?: boolean;
  surface?: 'default' | 'floating';
}) {
  return (
    <TfFieldView
      look={field}
      mode={mode}
      group
      label={preset.label}
      headerAction={
        <SliderValueView look={look} mode={mode} disabled={disabled}>
          {headText(value, preset.unit)}
        </SliderValueView>
      }
      description={preset.description}
      invalid={invalid}
      errorMessage={preset.error}
    >
      {(ctl) => (
        <SliderView
          look={look}
          mode={mode}
          min={preset.min}
          max={preset.max}
          step={preset.step}
          value={value}
          onValueChange={onValueChange}
          onValueCommit={onValueCommit}
          format={fmt(preset.unit)}
          disabled={disabled}
          labelledBy={ctl.labelId}
          label={preset.label}
          describedBy={ctl.describedBy}
          invalid={ctl.invalid}
          surface={surface}
        />
      )}
    </TfFieldView>
  );
}

// 요청 기록 — 손을 뗄 때 · 키마다 한 번 나간 저장 요청
function RequestLog({ items, empty }: { items: string[]; empty: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[64px] flex-col items-center gap-0.5 text-center text-[12px] leading-5 text-fd-muted-foreground">
      {items.length ? items.map((t, i) => <span key={i} className={i === 0 ? 'font-bold text-fd-foreground' : undefined}>{t}</span>) : <span>{empty}</span>}
    </div>
  );
}

export function SliderPlayground({ looks, fields }: { looks: Record<Brand, SliderLook>; fields: Record<Brand, TfFieldLook> }) {
  const [range, setRange] = useState<'single' | 'range'>('single');
  const [steps, setSteps] = useState<'ten' | 'score'>('ten');
  const [disabled, setDisabled] = useState<'no' | 'yes'>('no');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const preset = range === 'single' ? (steps === 'ten' ? PRESETS.threshold : PRESETS.score) : steps === 'ten' ? PRESETS.usage : PRESETS.scoreRange;
  const [values, setValues] = useState<Record<string, SliderValue>>(() => Object.fromEntries(Object.values(PRESETS).map((p) => [p.key, p.value])));
  const [log, setLog] = useState<string[]>([]);
  const count = useRef(0);
  const value = values[preset.key];
  const look = looks[brand];
  const commit = (v: SliderValue) => {
    count.current += 1;
    setLog((l) => [`저장 요청 ${count.current}번째 — ${headText(v, preset.unit)}`, ...l].slice(0, 3));
  };
  const code = useMemo(() => {
    const isRange = Array.isArray(preset.value);
    const comp = isRange ? 'RangeSlider' : 'Slider';
    const st = preset.key === 'threshold' ? ['threshold', 'setThreshold'] : preset.key === 'usage' ? ['usage', 'setUsage'] : ['score', 'setScore'];
    const head = isRange ? `{${st[0]}[0]}${preset.unit} ~ {${st[0]}[1]}${preset.unit}` : `{${st[0]}}${preset.unit}`;
    const attrs = [`min={${preset.min}}`, `max={${preset.max}}`, ...(preset.step !== 1 ? [`step={${preset.step}}`] : []), `value={${st[0]}}`, `onValueChange={${st[1]}}`, ...(preset.key === 'threshold' ? ['onValueCommit={commit}'] : []), `formatValue={(v) => \`\${v}${preset.unit}\`}`, ...(disabled === 'yes' ? ['disabled'] : [])];
    const field = [`label="${preset.label}"`, `headerAction={<SliderValue>${head}</SliderValue>}`, ...(preset.description ? [`description="${preset.description}"`] : [])];
    return [
      'import { Field } from "@/components/ui/field"',
      `import { ${comp}, SliderValue } from "@/components/ui/slider"`,
      '',
      `<Field ${field.join(' ')}>`,
      `  <${comp} ${attrs.join(' ')} />`,
      '</Field>',
    ].join('\n');
  }, [preset, disabled]);
  const stage = (
    <div className="flex flex-col gap-4" style={{ fontFamily: FONT }}>
      <SliderField
        key={`${preset.key}${brand}`}
        look={look}
        field={fields[brand]}
        mode={mode}
        preset={preset}
        value={value}
        onValueChange={(v) => setValues((s) => ({ ...s, [preset.key]: v }))}
        onValueCommit={commit}
        disabled={disabled === 'yes'}
      />
      <RequestLog items={log} empty="손을 떼거나 키를 누를 때마다 저장 요청이 한 번 나가요 — 끄는 동안에는 나가지 않아요." />
    </div>
  );
  return (
    <PlayFrame
      surface={icv(look.surface.default, mode)}
      code={code}
      stage={stage}
      controls={
        <>
          <Seg
            label="값"
            value={range}
            options={[
              ['single', '하나 — Slider'],
              ['range', '둘 — RangeSlider'],
            ]}
            onChange={(v) => (setRange(v), setLog([]))}
          />
          <Seg
            label="단계"
            value={steps}
            options={[
              ['ten', '10 구간 — 눈금 없음'],
              ['score', '별점 4 구간 — 눈금'],
            ]}
            onChange={(v) => (setSteps(v), setLog([]))}
          />
          <Seg
            label="막힘 disabled"
            value={disabled}
            options={[
              ['no', '아니요'],
              ['yes', '막힘'],
            ]}
            onChange={setDisabled}
          />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ── 코드 미리보기 ─────────────────────────────────────────
export function SliderDemoFrame({ children, w = 400, bg }: { children: ReactNode; w?: number; bg: string }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto flex w-full flex-col gap-4 rounded-xl p-6" style={{ maxWidth: w, background: bg, fontFamily: FONT }}>
          {children}
        </div>
      </div>
    </figure>
  );
}

// 설정 — 예산 알림 임계값: 끄는 동안 화면만, 손을 뗄 때 한 번 저장 · 요청 중에도 막지 않는다 · 실패하면 되돌리고 Field 오류
export function ExBasicDemo({ look, field }: { look: SliderLook; field: TfFieldLook }) {
  const p = PRESETS.threshold;
  const [threshold, setThreshold] = useState(80);
  const saved = useRef(80);
  const [failed, setFailed] = useState(false);
  const [next, setNext] = useState<'ok' | 'fail'>('ok');
  const [log, setLog] = useState<string[]>([]);
  const seq = useRef(0);
  const commit = (v: SliderValue) => {
    const value = v as number;
    setFailed(false);
    const n = ++seq.current;
    setLog((l) => [`요청 ${n} — budgetAlertThreshold: ${value}`, ...l].slice(0, 3));
    const fail = next === 'fail';
    window.setTimeout(() => {
      // 요청이 겹치면 마지막 요청의 결과만 반영한다
      if (n !== seq.current) return;
      if (fail) {
        setThreshold(saved.current);
        setFailed(true);
        setLog((l) => [`요청 ${n} 실패 — ${saved.current}% 로 되돌림`, ...l].slice(0, 3));
      } else saved.current = value;
    }, 600);
  };
  return (
    <SliderDemoFrame bg={icv(look.surface.default, 'auto')}>
      <SliderField look={look} field={field} preset={p} value={threshold} onValueChange={(v) => setThreshold(v as number)} onValueCommit={commit} invalid={failed} />
      <div className="flex flex-col items-center gap-2 border-t border-fd-border pt-3">
        <Seg
          label="다음 저장"
          value={next}
          options={[
            ['ok', '성공'],
            ['fail', '실패 — 되돌리고 그 자리에 오류'],
          ]}
          onChange={setNext}
        />
        <RequestLog items={log} empty="끌다가 손을 떼면 요청이 한 번 나가요 — 요청 중에도 계속 끌 수 있어요." />
      </div>
    </SliderDemoFrame>
  );
}

// 2 ~ 5단계 — 별점(폼의 값 — 손을 떼도 보내지 않는다)
export function ExStepsDemo({ look, field }: { look: SliderLook; field: TfFieldLook }) {
  const [score, setScore] = useState(4);
  return (
    <SliderDemoFrame bg={icv(look.surface.default, 'auto')}>
      <SliderField look={look} field={field} preset={PRESETS.score} value={score} onValueChange={(v) => setScore(v as number)} />
      <p className="m-0 text-center text-[12px] leading-5 text-fd-muted-foreground">폼의 값 — 손을 떼도 보내지 않아요. 폼의 저장 버튼이 반영해요.</p>
    </SliderDemoFrame>
  );
}

// 범위 — 두 손잡이 사이를 채운다(손잡이 이름 "예산 사용률 최소" · "예산 사용률 최대")
export function ExRangeDemo({ look, field }: { look: SliderLook; field: TfFieldLook }) {
  const [usage, setUsage] = useState<SliderValue>([30, 70]);
  return (
    <SliderDemoFrame bg={icv(look.surface.default, 'auto')}>
      <SliderField look={look} field={field} preset={PRESETS.usage} value={usage} onValueChange={setUsage} />
    </SliderDemoFrame>
  );
}
