import * as React from "react";

import { WheelPicker, WheelPickerColumn, type WheelPickerValueChangeDetails } from "@/components/ui/wheel-picker";

/*
 * Groo Time Picker — 구조는 SEED Time Picker(2026-10-03). 수치 원본은 specs/components/time-picker.yaml(휠은 wheel-picker.yaml medium · 5칸).
 *
 *   TimePicker        12시간 휠 — 오전·오후 → 시 → 분. value · onValueChange 는 24시간 { hour 0 ~ 23, minute 0 ~ 59 }.
 *                     minuteStep(1 · 5 · 10 · 15 · 30, 기본 5) · disabled · autoFocus(열 때 시 칼럼에 초점) · aria-label(칸 라벨, 기본 "시간 선택")
 *   roundToStep       시각 · Date 를 분 간격에 맞춰 반올림한다(시각 전체 기준 — 9시 58분 → 10시 00분). 빈 칸을 열 때 지금을 짚는 데 쓴다
 *   formatTimeValue   칸에 넣는 글 — "오후 3:00"(International Design v106, 초 없음)
 *
 * 칼럼(Wheel Picker medium × 5 — 220)
 *   오전·오후   두 칸에서 멈춘다(반복 없음), 가운데 정렬. 바깥에서 바뀌면(시 11 ↔ 12) 부드럽게 따라간다
 *   시          1 · 2 … 12(0 을 채우지 않는다), 반복, 오른쪽 정렬 — 한 자리 · 두 자리 수의 끝을 맞춘다
 *   분          두 자리(00 · 05 …), 분 간격의 분만, 반복, 가운데 정렬
 * 시 · 분 글자는 쓰지 않는다 — 단위는 칼럼 이름("오전/오후" · "시" · "분")과 자리가 알린다("오후 3 00" = 오후 3시 00분).
 *
 * 값 규칙(time-picker.md)
 *   - 시 휠이 11 ↔ 12 를 넘으면 오전 · 오후가 따라 바뀐다 — 시 칼럼이 멈춘 자리까지 움직인 칸 수(stepDelta)만큼 24시간 값에 시를 더한다
 *     (오전 11 + 1칸 = 오후 12, 오후 11 + 1칸 = 오전 12).
 *   - 분 휠은 55 → 00 을 넘어도 시는 그대로다(10시 55분 → 10시 00분).
 *   - 오전 · 오후를 바꾸면 시 · 분은 그대로 12시간을 더하거나 뺀다.
 *   - 분 간격에 맞지 않는 값은 가장 가까운 칸으로 반올림해 보인다(시각 전체 기준 — 23시 58분은 0시 00분). 그것만으로 onValueChange 를
 *     부르지는 않는다 — 사용자가 굴린 뒤에 반올림한 값에서 이어 간다.
 *   - value 가 비었으면 지금을 분 간격에 맞춰 반올림한 자리를 짚기만 한다(고른 것처럼 넣지 않는다 — onValueChange 를 부르지 않는다).
 *     "완료" 는 draft ?? roundToStep(new Date(), step) 을 넣는다.
 *
 * 휠을 굴리는 동안 칸 값은 그대로다 — 휠이 멈춘 뒤 onValueChange 가 불리고(draft), "완료" 가 칸에 넣는다(input-button.md).
 * 키보드: 칼럼마다 Tab 자리 하나(오전·오후 → 시 → 분 → "완료"), ↑ ↓ 이전 · 다음, Home · End 처음 · 끝(시는 1 · 12 — 오전 · 오후는 그대로, 03-C 3A).
 * 이름: 휠 role="group"(칸 라벨), 칼럼 spinbutton "오전/오후" · "시" · "분", 읽는 값 "오후" · "3" · "00". 글은 labels 한 벌로 바꾼다.
 */

export interface TimeValue {
  /** 24시간의 시 — 0 ~ 23 */
  hour: number;
  /** 분 — 0 ~ 59 */
  minute: number;
}

export type MinuteStep = 1 | 5 | 10 | 15 | 30;

export interface TimePickerLabels {
  /** 휠 이름 — 칸 라벨이 없을 때 */
  root: string;
  period: string;
  hour: string;
  minute: string;
  am: string;
  pm: string;
}

/** 한국어 글 한 벌 — 다른 언어는 같은 꼴로 labels 에 넘긴다 */
export const TIME_PICKER_LABELS: TimePickerLabels = {
  root: "시간 선택",
  period: "오전/오후",
  hour: "시",
  minute: "분",
  am: "오전",
  pm: "오후",
};

const MINUTES_IN_DAY = 24 * 60;
const pad2 = (n: number) => String(n).padStart(2, "0");

/** 분 간격에 맞춰 반올림한다 — 시각 전체 기준(9시 58분 → 10시 00분). 시각은 하루를 넘으면 0시로 돌고, Date 는 다음 날로 넘어간다 */
function roundToStep(time: TimeValue, step: MinuteStep): TimeValue;
function roundToStep(date: Date, step: MinuteStep): Date;
function roundToStep(input: TimeValue | Date, step: MinuteStep): TimeValue | Date {
  // 초는 버리고 분으로 셈한다(SEED 와 같다 — 9시 13분 40초도 9시 13분에서 반올림)
  if (input instanceof Date) {
    const total = input.getHours() * 60 + input.getMinutes();
    const rounded = Math.round(total / step) * step;
    return new Date(input.getFullYear(), input.getMonth(), input.getDate(), 0, rounded);
  }
  const total = input.hour * 60 + input.minute;
  if (input.minute % step === 0 && input.hour >= 0 && input.hour < 24) return input;
  const rounded = (((Math.round(total / step) * step) % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  return { hour: Math.floor(rounded / 60), minute: rounded % 60 };
}

/** 칸에 넣는 글 — "오후 3:00"(오전 · 오후 12시간, 초 없음). 비었으면 "" */
function formatTimeValue(value: TimeValue | Date | undefined | null, labels: Pick<TimePickerLabels, "am" | "pm"> = TIME_PICKER_LABELS): string {
  if (!value) return "";
  const hour = value instanceof Date ? value.getHours() : value.hour;
  const minute = value instanceof Date ? value.getMinutes() : value.minute;
  return `${hour < 12 ? labels.am : labels.pm} ${hour % 12 === 0 ? 12 : hour % 12}:${pad2(minute)}`;
}

const MINUTE_STEPS: readonly MinuteStep[] = [1, 5, 10, 15, 30];
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> {
  /** 고르던 시각(24시간) — 비었으면 지금을 분 간격에 맞춰 반올림한 자리를 짚기만 한다 */
  value?: TimeValue;
  /** 휠이 멈춰 값이 정해졌을 때 — 칸이 아니라 draft 에 넣는다 */
  onValueChange?: (value: TimeValue) => void;
  /** 분 간격 — 기본 5. 분이 중요한 자리만 1, HR 일정 30 */
  minuteStep?: MinuteStep;
  disabled?: boolean;
  /** 처음 그릴 때 시 칼럼에 초점을 둔다(시트 · 팝오버가 열 때 — input-button.md "열린 뒤 포커스") */
  autoFocus?: boolean;
  /** 지금 — 빈 값을 짚을 때 쓴다(테스트) */
  now?: Date;
  /** 글 한 벌(기본 한국어) */
  labels?: Partial<TimePickerLabels>;
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    { value: valueProp, onValueChange, minuteStep = 5, disabled = false, autoFocus = false, now, labels: labelsProp, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props },
    ref,
  ) => {
    const labels = React.useMemo(() => ({ ...TIME_PICKER_LABELS, ...labelsProp }), [labelsProp]);
    const step: MinuteStep = MINUTE_STEPS.includes(minuteStep) ? minuteStep : 5;
    // 빈 칸 — 지금을 반올림한 자리(처음 한 번만 잰다)
    const [fallback] = React.useState(() => {
      const d = now ?? new Date();
      return { hour: d.getHours(), minute: d.getMinutes() };
    });
    // value 를 주지 않고 쓸 때(제어하지 않을 때)의 값
    const [inner, setInner] = React.useState<TimeValue | undefined>(undefined);
    const value = roundToStep(valueProp ?? inner ?? fallback, step);
    // 지금 값 — 칼럼이 잇달아 멈춰도(시 → 오전·오후) 앞 칼럼이 바꾼 값 위에서 셈한다
    const valueRef = React.useRef(value);
    React.useLayoutEffect(() => {
      valueRef.current = value;
    });
    const commit = (next: TimeValue) => {
      const prev = valueRef.current;
      if (next.hour === prev.hour && next.minute === prev.minute) return;
      valueRef.current = next;
      if (valueProp === undefined) setInner(next);
      onValueChange?.(next);
    };

    const periodOptions = React.useMemo(
      () => [
        { value: "am", label: labels.am },
        { value: "pm", label: labels.pm },
      ],
      [labels.am, labels.pm],
    );
    const minuteOptions = React.useMemo(
      () => Array.from({ length: 60 / step }, (_, i) => ({ value: String(i * step), label: pad2(i * step) })),
      [step],
    );

    // 시 칼럼 — 열 때 초점. 시트 · 팝오버가 처음 초점을 둔 뒤(같은 커밋의 effect — 바깥 표면이 나중에 돈다), 그리기 전에 옮긴다
    const hourRef = React.useRef<HTMLDivElement>(null);
    const autoFocusRef = React.useRef(autoFocus && !disabled);
    React.useEffect(() => {
      if (!autoFocusRef.current) return;
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) hourRef.current?.focus({ preventScroll: true });
      });
      return () => {
        cancelled = true;
      };
    }, []);

    const period = value.hour < 12 ? "am" : "pm";
    const displayHour = value.hour % 12 === 0 ? 12 : value.hour % 12;
    // 이름 — 칸 라벨을 가리키면 그것, 아니면 aria-label(기본 "시간 선택")
    const name = ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel } : { "aria-label": ariaLabel ?? labels.root };

    return (
      <WheelPicker ref={ref} size="medium" visibleItems={5} disabled={disabled} data-picker="time" {...name} {...props}>
        <WheelPickerColumn
          aria-label={labels.period}
          data-column="period"
          options={periodOptions}
          value={period}
          align="center"
          valueChangeBehavior="smooth"
          onValueChange={(next) => {
            const cur = valueRef.current;
            const curPeriod = cur.hour < 12 ? "am" : "pm";
            if (next === curPeriod) return;
            commit({ hour: next === "am" ? cur.hour - 12 : cur.hour + 12, minute: cur.minute });
          }}
        />
        <WheelPickerColumn
          ref={hourRef}
          aria-label={labels.hour}
          data-column="hour"
          options={HOUR_OPTIONS}
          value={String(displayHour)}
          loop
          align="right"
          onValueChange={(next, details: WheelPickerValueChangeDetails) => {
            const cur = valueRef.current;
            // Home · End(처음 · 끝 = 1 · 12)는 오전 · 오후를 그대로 두고 그 시로 간다 — 지나간 칸을 세지 않는다(03-C 3A)
            if (details.jump) {
              commit({ hour: (Number(next) % 12) + (cur.hour >= 12 ? 12 : 0), minute: cur.minute });
              return;
            }
            commit({ hour: (((cur.hour + details.stepDelta) % 24) + 24) % 24, minute: cur.minute });
          }}
        />
        <WheelPickerColumn
          aria-label={labels.minute}
          data-column="minute"
          options={minuteOptions}
          value={String(value.minute)}
          loop
          align="center"
          onValueChange={(next) => {
            const cur = valueRef.current;
            commit({ hour: cur.hour, minute: Number(next) });
          }}
        />
      </WheelPicker>
    );
  },
);
TimePicker.displayName = "TimePicker";

export { TimePicker, roundToStep, formatTimeValue };
