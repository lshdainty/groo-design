import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { submitImplicitly, useFieldGroup, useFieldGroupState } from "@/components/ui/field";

/*
 * Porest Radio — 구조는 SEED Radio(2026-09-30). 수치 원본은 specs/components/radio-group.yaml.
 *
 *   Radiomark   동그라미만 — 라벨이 따로 서는 자리에 넣어 쓴다(누르는 영역은 그 줄 전체가 맡는다, 라벨 연결 필수)
 *   Radio       동그라미 + 라벨 — 라벨까지 눌리고, 누르는 영역은 44 까지 넓힌다(::before)
 *   RadioGroup  묶음 — 세로로 쌓고 줄 사이 12. 가로 배치는 두지 않는다(가로로 짧게 고르면 Segmented · Chip)
 *
 *   size   medium 20(점 8 · 라벨 14 · 줄 32, 기본) · large 24(점 10 · 라벨 16 · 줄 36)
 *   tone   neutral(짙은 회색, 기본) · brand(서비스 핵심 흐름에서만)
 *   weight regular(기본) · bold(강조)
 *
 * 선택 안 된 동그라미의 테두리는 stroke-neutral-solid(3:1 — v109). 선택은 테두리 없이 채운 원 + 가운데 점(SEED).
 * 호버 = 누름 색(v106), 누르면 동그라미만 세로 2px 축소(v104) — 기준 길이는 max(20·24, 24) = 24.
 * 비활성은 전용 색(v106) — 선택도 채운 원 그대로 색만 바꾼다(Checkbox 와 같다, 사용자 결정).
 * 오류는 동그라미를 바꾸지 않는다 — 묶음 아래 글. 설명 · 딸린 입력이 붙는 선택은 Radio 가 아니라 Select Box(사용자 결정).
 * 점은 늘 그려 두고(forceMount) 색만 바꾼다 — 채움과 함께 색으로 전환된다.
 * 라벨을 눌러도 동그라미가 반응하도록 Radio 는 group/radio, 동그라미는 그 hover · active 도 받는다.
 * 키 — 화살표는 옮기며 고르고 Space 는 포커스된 선택지를 고른다. Enter 는 폼을 제출한다(진짜 input · SEED 와 같다 — 폼의 기본 버튼을
 * 누른다, 고르지 않는다). Radix 의 항목은 onKeyDown 을 덮어써 Enter 를 막기만 하므로 묶음이 받는다(submitOnRadioEnter — Radiomark 를
 * 담는 List · Select Box 의 묶음도 같이 쓴다, 사용자 결정 2026-10-08). Home · End · PageUp · PageDown 은 받지 않는다 — 화살표만(SEED · 진짜
 * 라디오 · APG, 사용자 결정 2026-10-17 — 03-E 결정 3 A). Radix 는 이 키로 초점만 첫 · 끝으로 옮겨 초점과 고른 것이 갈리므로 묶음이
 * 캡처 단계에서 막는다(ignoreRadioJumpKeys — 라디오를 담는 Chip · Segmented Control · List · Select Box 의 묶음도 같이 쓴다).
 * 라벨 안에 링크 · 버튼을 두지 않는다 — 누르는 영역(::before)이
 * 덮는다. 링크는 라벨 옆 · 아래에(radio-group.md Don't).
 * 묶음의 상태 — Field 의 막힘은 묶음 aria-disabled 와 칸마다 disabled(Radix disabled), 오류 · 필수는 radiogroup 의 aria-invalid ·
 * aria-required 다(SEED RadioGroup 과 같다). 묶음에 직접 준 값이 이긴다.
 * 줄 사이 12 는 누르는 영역 때문이다 — 줄 32 · 36 에 더해 44 · 48 마다 한 줄이라 이웃 줄과 44 영역이 겹치지 않는다
 * (SEED 의 4 로는 한 줄이 36 · 40 만 받는다, 사용자 결정). Radio 줄은 내용만큼만 차지한다(self-start) — 직접 짠 줄은 묶음 폭을 쓴다.
 */
const radiomarkVariants = cva(
  [
    "peer relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full",
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    "active:[scale:calc(1-2/var(--press-basis))] group-active/radio:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/radio:[scale:1]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
    "disabled:cursor-not-allowed disabled:[scale:1]",
    // 선택 안 됨 — 테두리 원. 호버 · 누름은 누름 바탕
    "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/radio:bg-bg-layer-default-pressed group-active/radio:bg-bg-layer-default-pressed",
    "disabled:border-stroke-neutral-weak disabled:bg-bg-disabled",
    // 선택 — 테두리 없이 채운 원(톤에서). 비활성은 채움 그대로 색만
    "data-[state=checked]:border-0 data-[state=checked]:disabled:bg-bg-disabled",
  ].join(" "),
  {
    variants: {
      size: {
        medium: "size-5 [--press-basis:24]",
        large: "size-6 [--press-basis:24]",
      },
      tone: {
        neutral:
          "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/radio:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/radio:bg-bg-neutral-inverted-pressed",
        brand:
          "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/radio:bg-bg-brand-solid-pressed data-[state=checked]:group-active/radio:bg-bg-brand-solid-pressed",
      },
    },
    defaultVariants: {
      size: "medium",
      tone: "neutral",
    },
  },
);

// 가운데 점 — 선택 안 됨에는 투명, 선택이면 톤 색, 막히면 fg-disabled
const radiomarkDotVariants = cva(
  "pointer-events-none block rounded-full bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] data-[disabled]:data-[state=checked]:bg-fg-disabled",
  {
    variants: {
      size: {
        medium: "size-2",
        large: "size-2.5",
      },
      tone: {
        neutral: "data-[state=checked]:bg-fg-neutral-inverted",
        brand: "data-[state=checked]:bg-static-white",
      },
    },
    defaultVariants: {
      size: "medium",
      tone: "neutral",
    },
  },
);

export interface RadiomarkProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radiomarkVariants> {}

// 동그라미 — RadioGroup 안에서만 쓴다
const Radiomark = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadiomarkProps>(
  ({ className, size, tone, ...props }, ref) => (
    <RadioGroupPrimitive.Item ref={ref} className={cn(radiomarkVariants({ size, tone }), className)} {...props}>
      <RadioGroupPrimitive.Indicator forceMount className={radiomarkDotVariants({ size, tone })} />
    </RadioGroupPrimitive.Item>
  ),
);
Radiomark.displayName = "Radiomark";

// 한 줄 — 동그라미 + 라벨. 누르는 영역은 ::before 로 44 까지
const radioVariants = cva(
  [
    "group/radio relative inline-flex cursor-pointer select-none items-center gap-x2 self-start",
    "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
    "has-[:disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        medium: "min-h-8",
        large: "min-h-9",
      },
    },
    defaultVariants: { size: "medium" },
  },
);

const radioLabelVariants = cva("font-sans text-fg-neutral peer-disabled:text-fg-disabled", {
  variants: {
    size: {
      medium: "text-t4",
      large: "text-t5",
    },
    weight: {
      regular: "font-normal",
      bold: "font-bold",
    },
  },
  defaultVariants: { size: "medium", weight: "regular" },
});

export interface RadioProps extends RadiomarkProps, VariantProps<typeof radioLabelVariants> {
  label: React.ReactNode;
  labelClassName?: string;
}

const Radio = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadioProps>(
  ({ className, labelClassName, label, size, tone, weight, id, ...props }, ref) => {
    const autoId = React.useId();
    const rid = id ?? autoId;
    return (
      <label htmlFor={rid} className={cn(radioVariants({ size }), className)}>
        <Radiomark ref={ref} id={rid} size={size} tone={tone} {...props} />
        <span className={cn(radioLabelVariants({ size, weight }), labelClassName)}>{label}</span>
      </label>
    );
  },
);
Radio.displayName = "Radio";

// 묶음이 받는 Enter — 진짜 input 처럼 폼을 제출한다(폼의 기본 버튼을 누른다). Radix 의 항목은 Enter 를 막기만 하고 묶음으로 올려 보낸다.
// Radiomark 를 담는 묶음(RadioGroup · List 의 ListRadioGroup · Select Box 의 RadioSelectBoxGroup)이 함께 쓴다
function submitOnRadioEnter(onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>) {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const item = e.target;
    if (e.key === "Enter" && item instanceof HTMLButtonElement && item.getAttribute("role") === "radio") submitImplicitly(item);
  };
}

// 하나 고르기 묶음이 받지 않는 키 — Home · End · PageUp · PageDown(화살표만 — SEED · 진짜 라디오 · APG, 사용자 결정 2026-10-17 — 03-E 결정 3 A).
// Radix 의 RovingFocusGroup 은 이 키로 초점만 첫 · 끝으로 옮긴다(고르지 않는다) — 초점과 고른 것이 갈려, Tab 으로 나갔다 오면 고른 것으로 돌아간다.
// 묶음이 캡처 단계에서 기본 동작을 막는다 — Radix 의 항목 처리는 defaultPrevented 면 건너뛰고, 화면도 스크롤되지 않는다.
// 라디오가 아닌 곳(Select Box 펼침 안의 입력칸)에서는 그대로 둔다. 라디오를 담는 묶음(RadioGroup · ChipRadioGroup · SegmentedControl ·
// ListRadioGroup · RadioSelectBoxGroup)이 함께 쓴다
const RADIO_JUMP_KEYS = new Set(["Home", "End", "PageUp", "PageDown"]);
function ignoreRadioJumpKeys(onKeyDownCapture?: React.KeyboardEventHandler<HTMLDivElement>) {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCapture?.(e);
    const item = e.target;
    if (RADIO_JUMP_KEYS.has(e.key) && item instanceof HTMLElement && item.getAttribute("role") === "radio") e.preventDefault();
  };
}

// 묶음 — 세로로 쌓고 줄 사이 12. 제목 · 오류 글은 Field 로 감싸면 이어진다(라벨 → aria-labelledby, 설명 · 오류 → aria-describedby).
// Field 없이 쓰면 aria-label 또는 aria-labelledby 를 준다. Field 의 막힘 · 오류 · 필수도 받는다(머리 주석) — 묶음에 직접 준 값이 이긴다
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, disabled, onKeyDown, onKeyDownCapture, ...props }, ref) => {
  const field = useFieldGroupState();
  const off = disabled ?? field.disabled;
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn("flex flex-col gap-x3", className)}
      disabled={off}
      {...(off ? { "aria-disabled": true } : {})}
      {...(field.invalid ? { "aria-invalid": true } : {})}
      {...(field.required ? { "aria-required": true } : {})}
      {...useFieldGroup(props)}
      onKeyDown={submitOnRadioEnter(onKeyDown)}
      onKeyDownCapture={ignoreRadioJumpKeys(onKeyDownCapture)}
    />
  );
});
RadioGroup.displayName = "RadioGroup";

export { Radio, RadioGroup, Radiomark, radioVariants, radioLabelVariants, radiomarkVariants, radiomarkDotVariants, submitOnRadioEnter, ignoreRadioJumpKeys };
