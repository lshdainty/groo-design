import * as React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFieldGroup, useFieldGroupState } from "@/components/ui/field";
import { ProgressCircle } from "@/components/ui/progress-circle";

/*
 * Groo Quantity Picker — 구조는 SEED Quantity Picker(2026-10-15, rootage quantity-picker · quantity-picker-button,
 * react-headless useQuantityPicker). 수치 원본은 specs/components/quantity-picker.yaml.
 * 작은 정수를 한 단계씩 늘리고 줄이는 컨트롤 — 흔한 값이 열 단계 안쪽인 수(승인 필요 횟수 0 ~ 3 · 부여 시간 0 ~ 7시간)에 쓴다.
 * 흔한 값이 더 멀거나 돈 · 소수면 Input 의 숫자 칸, 날짜 부분 · 띄엄띄엄 이름 붙은 값은 Select, 범위 안의 자리는 Slider 다.
 *
 *   QuantityPicker  테두리 상자 안에 줄이기(−) · 선 · 값 · 선 · 늘리기(+)
 *     value · defaultValue · onValueChange(value)   값(정수) — value 를 주면 쥐고 다룬다. 비제어의 처음 값은 기본 min
 *     min(기본 0) · max(기본 Number.MAX_SAFE_INTEGER — 데이터로 건다) · step(기본 1)
 *     size        small 36(표 칸 · 목록 줄 안) · medium 40(1280 이상 웹 폼) · large 52(폰 · 앱 폼) ·
 *                 responsive(기본 — 1280 미만 large · 이상 medium, Input 과 같은 경계). 옆 칸과 같은 높이로 고른다
 *     layout      hug(기본 — 값 칸이 가장 긴 값의 폭) · fill(부모 Flex 의 남은 폭 — 늘어나는 것은 값 칸뿐)
 *     getValueText(value)  값 칸 · 읽기 글("3회" · "8h") — 기본은 숫자 그대로. 단위는 이 글로만 붙인다(라벨에 "(회)" 를 쓰지 않는다)
 *     loading     true(두 버튼) · { decrement?, increment? } — 기다리는 버튼에 누름 바탕 + 값 없는 원, 그 버튼의 누르기를 버린다(aria-busy)
 *     disabled · readOnly · invalid   Field 안이면 Field 의 값을 받는다(직접 준 값이 이긴다)
 *     name        숨은 입력 — 단위 없는 정수를 폼에 낸다(막힘이면 내지 않는다)
 *     decrementAriaLabel(기본 "줄이기") · incrementAriaLabel(기본 "늘리기") · aria-label · aria-labelledby(Field 밖이면 이름 필수)
 *     removable + onRemove() + removeAriaLabel   셋을 함께 — 값이 최소면 줄이기 자리가 지우기(휴지통 trash-2)가 된다.
 *                 누르면 onRemove, 값은 바꾸지 않는다. 이름은 무엇을 지우는지("{항목 이름} 지우기")
 *
 * 역할 — 루트 role="group" + 이름(Field 라벨 aria-labelledby · aria-label), Field 의 설명 · 오류가 묶음의 설명이 된다(useFieldGroup).
 *   막힘이면 루트 aria-disabled. 두 버튼은 <button type="button"> — 끝(최소 · 최대)에 닿은 버튼은 aria-disabled 만 건다(disabled 속성이
 *   아니다 — 초점이 남아 "사용할 수 없음" 이 들리고 Tab 한 번이면 반대 버튼이다, SEED headless 와 다른 자리). 읽기 전용도 두 버튼 aria-disabled.
 *   막힘(disabled)만 두 버튼에 disabled 속성 — 초점을 받지 않는다. 값 칸은 aria-live="polite" · aria-atomic 이라 바뀐 값을 단위와 함께
 *   한 번 읽는다("4회"). 값 칸은 누르기 · 초점 · 치기가 없다. 화살표 키 · spinbutton 은 두지 않는다 — 누르고 있어도 반복하지 않는다
 *   (Enter 를 누르고 있을 때 브라우저가 되풀이하는 keydown 도 버린다).
 *
 * 모양 — 상자는 bg-layer-default + 안쪽 1px stroke-neutral-weak(inset shadow), 오류는 안쪽 2px stroke-critical-solid(내용이 밀리지 않는다).
 *   모서리 small · medium 8 · large 12. 버튼은 정사각(상자 높이), 바탕 투명 · 아이콘 fg-neutral(16 · 18 · 22, lucide minus · plus).
 *   선 1px × 16 stroke-neutral-subtle(장식). 값 칸은 좌우 8 · 500 · fg-neutral · 고정폭 숫자, 글 t5 16 / 22(large t6 18 / 24).
 *   값 칸은 가장 긴 표시 글을 숨겨 둔 자리 글로 폭을 잡는다(SEED valueDisplayPlaceholder) — getValueText(min) · getValueText(max) ·
 *   지금 값 가운데 가장 넓은 것. max 를 주지 않으면(Number.MAX_SAFE_INTEGER) 그 글은 빼고 지금 값 · 최소로만 잡는다.
 *   누르는 자리 — 36 · 40 버튼은 보이지 않는 여백(::before)으로 44(4 · 2 씩), 52 는 그대로. 상자는 overflow 를 자르지 않는다(여백 · 링).
 * 상태 — 올림(웹) · 누름 bg-layer-default-pressed, 누르면 그 버튼만 2px 거리 축소(기준 = 버튼 높이 36 · 40 · 52, v104 — 모션 줄이기면
 *   하지 않는다). 키보드 포커스에만 버튼 바깥 링 2px · 띄움 2px. 끝 · 읽기 전용 · 막힘은 아이콘 fg-disabled(올려도 눌러도 바탕 없음),
 *   막힘은 값도 fg-disabled — 불투명도로 흐리지 않는다(v106). 로딩은 누름 바탕 + 값 없는 원(16 · 18 · 22, 두께 2, 트랙 gray-500 ·
 *   호 fg-neutral — Button ghost 로딩 원과 같은 값, Progress Circle tone inherit).
 */

export type QuantityPickerSize = "small" | "medium" | "large" | "responsive";
export type QuantityPickerLayout = "hug" | "fill";
export type QuantityPickerLoading = boolean | { decrement?: boolean; increment?: boolean };

// 상자 — 안쪽 1px 테두리(오류는 2px). 크기마다 최소 높이 · 모서리 — 글자가 커지면 상자가 값을 따라 커진다(Input · Select 와 같다)
const ROOT =
  "relative inline-flex shrink-0 items-center bg-bg-layer-default font-sans shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] data-[invalid]:shadow-[inset_0_0_0_2px_var(--color-stroke-critical-solid)]";
const ROOT_SIZE: Record<QuantityPickerSize, string> = {
  small: "min-h-9 rounded-r2",
  medium: "min-h-10 rounded-r2",
  large: "min-h-13 rounded-r3",
  responsive: "min-h-13 rounded-r3 lg:min-h-10 lg:rounded-r2",
};
// hug — 내용 폭(Field 같은 세로 Flex 안에서도 늘어나지 않는다) · fill — 부모 Flex 의 남은 폭(세로 Flex 면 칸 폭)
const ROOT_LAYOUT: Record<QuantityPickerLayout, string> = {
  hug: "w-fit",
  fill: "grow",
};

// 버튼 — 정사각 · 투명. 누르는 자리 44(::before — 보이는 상자보다 작을 때만 넓힌다, 52 는 그대로).
// 끝 · 읽기 전용(aria-disabled) · 막힘(disabled)은 바탕 · 축소 없이 아이콘만 fg-disabled. 로딩(aria-busy)은 누름 바탕 + 원
const BUTTON = [
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center bg-transparent text-fg-neutral",
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "aria-disabled:cursor-not-allowed aria-disabled:text-fg-disabled aria-disabled:hover:bg-transparent aria-disabled:active:bg-transparent aria-disabled:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:bg-transparent disabled:active:bg-transparent disabled:active:[scale:1]",
  "aria-busy:cursor-progress aria-busy:bg-bg-layer-default-pressed aria-busy:hover:bg-bg-layer-default-pressed aria-busy:active:[scale:1]",
  // 로딩 원 — 두께 2 · 트랙 gray-500 · 호 fg-neutral(크기는 size 마다 --progress-size)
  "[--progress-thickness:2px] [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
].join(" ");
const BUTTON_SIZE: Record<QuantityPickerSize, string> = {
  small: "size-9 rounded-r2 [--press-basis:36] [--progress-size:16px] [&>svg]:size-4",
  medium: "size-10 rounded-r2 [--press-basis:40] [--progress-size:18px] [&>svg]:size-[18px]",
  large: "size-13 rounded-r3 [--press-basis:52] [--progress-size:22px] [&>svg]:size-[22px]",
  responsive:
    "size-13 rounded-r3 [--press-basis:52] [--progress-size:22px] [&>svg]:size-[22px] lg:size-10 lg:rounded-r2 lg:[--press-basis:40] lg:[--progress-size:18px] lg:[&>svg]:size-[18px]",
};

// 선 — 1px × 16, 장식
const DIVIDER = "h-x4 w-px shrink-0 bg-stroke-neutral-subtle";

// 값 칸 — 보기만(누르기 · 초점 · 치기 없음). 숨긴 자리 글과 지금 값을 한 칸(격자 1 × 1)에 겹쳐 가장 넓은 글의 폭을 잡는다
const VALUE =
  "pointer-events-none grid shrink-0 grow select-none items-center justify-center px-x2 font-medium tabular-nums text-fg-neutral data-[disabled]:text-fg-disabled";
const VALUE_SIZE: Record<QuantityPickerSize, string> = {
  small: "text-t5",
  medium: "text-t5",
  large: "text-t6",
  responsive: "text-t6 lg:text-t5",
};
const VALUE_PLACEHOLDER = "invisible col-start-1 row-start-1 whitespace-nowrap text-center";
const VALUE_TEXT = "col-start-1 row-start-1 whitespace-nowrap text-center";

const defaultValueText = (value: number) => String(value);

type QuantityPickerName = { "aria-label"?: string; "aria-labelledby"?: string };

type QuantityPickerRemovable =
  | {
      /** 값이 최소면 줄이기 자리가 지우기(휴지통)가 된다 — onRemove · removeAriaLabel 과 함께 */
      removable: true;
      /** 지우기를 누르면 — 값은 바꾸지 않는다. 지운 뒤 초점은 쓰는 쪽이 다음 항목(없으면 목록 머리)으로 옮긴다 */
      onRemove: () => void;
      /** 지우기 버튼 이름 — 무엇을 지우는지("{항목 이름} 지우기") */
      removeAriaLabel: string;
    }
  | { removable?: false; onRemove?: never; removeAriaLabel?: never };

export type QuantityPickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange" | "children" | "aria-label" | "aria-labelledby"
> &
  QuantityPickerName &
  QuantityPickerRemovable & {
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    /** 기본 0 */
    min?: number;
    /** 기본 Number.MAX_SAFE_INTEGER — 데이터로 건다(고를 수 있는 승인자 수 …) */
    max?: number;
    /** 기본 1 */
    step?: number;
    /** 기본 responsive — 1280 미만 large 52 · 이상 medium 40. 표 칸 · 목록 줄 안은 small 36 */
    size?: QuantityPickerSize;
    /** 기본 hug — 값 칸이 가장 긴 값의 폭. fill 은 부모 Flex 의 남은 폭 */
    layout?: QuantityPickerLayout;
    /** 값 칸 · 읽기 글 — 기본은 숫자 그대로 */
    getValueText?: (value: number) => string;
    loading?: QuantityPickerLoading;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    /** 숨은 입력의 이름 — 단위 없는 정수를 폼에 낸다 */
    name?: string;
    /** 기본 "줄이기" */
    decrementAriaLabel?: string;
    /** 기본 "늘리기" */
    incrementAriaLabel?: string;
  };

const QuantityPicker = React.forwardRef<HTMLDivElement, QuantityPickerProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    step = 1,
    size = "responsive",
    layout = "hug",
    getValueText = defaultValueText,
    loading,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    invalid: invalidProp,
    name,
    decrementAriaLabel = "줄이기",
    incrementAriaLabel = "늘리기",
    removable = false,
    onRemove,
    removeAriaLabel,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = props;

  const fieldState = useFieldGroupState();
  const disabled = disabledProp ?? fieldState.disabled;
  const readOnly = readOnlyProp ?? fieldState.readOnly;
  const invalid = invalidProp ?? fieldState.invalid;
  const naming = useFieldGroup({ "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy });

  const [inner, setInner] = React.useState(() => defaultValue ?? min);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const commit = (next: number) => {
    if (next === value) return;
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const busy =
    loading === true
      ? { decrement: true, increment: true }
      : typeof loading === "object"
        ? { decrement: !!loading.decrement, increment: !!loading.increment }
        : { decrement: false, increment: false };
  const atMin = value <= min;
  const atMax = value >= max;
  const isRemove = removable && atMin;
  // 끝 · 읽기 전용은 aria-disabled(초점이 남는다). 지우기는 최소에서도 누를 수 있다
  const decrementBlocked = readOnly || (atMin && !isRemove);
  const incrementBlocked = readOnly || atMax;

  const onDecrement = () => {
    if (disabled || decrementBlocked || busy.decrement) return;
    if (isRemove) onRemove?.();
    else commit(Math.max(value - step, min));
  };
  const onIncrement = () => {
    if (disabled || incrementBlocked || busy.increment) return;
    commit(Math.min(value + step, max));
  };
  // 누르고 있어도 한 번 — Enter 를 누르고 있으면 브라우저가 keydown 을 되풀이해 click 을 다시 만든다
  const noRepeat = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.repeat) e.preventDefault();
  };

  // 값 칸의 폭 — 가장 긴 표시 글. max 를 주지 않았으면 그 글(16자리 수)은 뺀다
  const text = getValueText(value);
  const placeholders = Array.from(
    new Set([getValueText(min), ...(max < Number.MAX_SAFE_INTEGER ? [getValueText(max)] : [])].filter((t) => t !== text)),
  );

  const icon = (kind: "decrement" | "increment") => {
    if (busy[kind]) return <ProgressCircle size="inherit" tone="inherit" aria-hidden />;
    if (kind === "increment") return <Plus aria-hidden />;
    return isRemove ? <Trash2 aria-hidden /> : <Minus aria-hidden />;
  };

  return (
    <div
      ref={ref}
      role="group"
      data-slot="quantity-picker"
      data-size={size}
      data-layout={layout}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
      className={cn(ROOT, ROOT_SIZE[size], ROOT_LAYOUT[layout], className)}
      {...naming}
      {...rest}
    >
      <button
        type="button"
        data-slot="quantity-picker-decrement"
        data-remove={isRemove || undefined}
        aria-label={isRemove ? removeAriaLabel : decrementAriaLabel}
        aria-disabled={(!disabled && decrementBlocked) || undefined}
        aria-busy={busy.decrement || undefined}
        disabled={disabled}
        className={cn(BUTTON, BUTTON_SIZE[size])}
        onClick={onDecrement}
        onKeyDown={noRepeat}
      >
        {icon("decrement")}
      </button>
      <span aria-hidden data-slot="quantity-picker-divider" className={DIVIDER} />
      <span
        data-slot="quantity-picker-value"
        data-disabled={disabled || undefined}
        aria-live="polite"
        aria-atomic="true"
        className={cn(VALUE, VALUE_SIZE[size])}
      >
        {placeholders.map((t) => (
          <span key={t} aria-hidden className={VALUE_PLACEHOLDER}>
            {t}
          </span>
        ))}
        <span className={VALUE_TEXT}>{text}</span>
      </span>
      <span aria-hidden data-slot="quantity-picker-divider" className={DIVIDER} />
      <button
        type="button"
        data-slot="quantity-picker-increment"
        aria-label={incrementAriaLabel}
        aria-disabled={(!disabled && incrementBlocked) || undefined}
        aria-busy={busy.increment || undefined}
        disabled={disabled}
        className={cn(BUTTON, BUTTON_SIZE[size])}
        onClick={onIncrement}
        onKeyDown={noRepeat}
      >
        {icon("increment")}
      </button>
      {name != null && <input type="hidden" data-slot="quantity-picker-input" name={name} value={String(value)} disabled={disabled} />}
    </div>
  );
});
QuantityPicker.displayName = "QuantityPicker";

export { QuantityPicker };
