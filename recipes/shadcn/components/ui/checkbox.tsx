import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { submitImplicitly, useFieldGroup, useFieldGroupState } from "@/components/ui/field";

/*
 * Groo Checkbox — 구조는 SEED Checkbox(2026-09-30). 수치 원본은 specs/components/checkbox.yaml.
 *
 *   Checkmark      칸만 — 목록 행 · 표 머리에 넣어 쓴다(누르는 영역은 행 전체가 맡는다, aria-label 필수)
 *   Checkbox       칸 + 라벨 — 라벨까지 눌리고, 누르는 영역은 44 까지 넓힌다(::before)
 *   CheckboxGroup  묶음 — 세로로 쌓고 줄 사이 12
 *
 *   size   medium 20(라벨 14 · 줄 32, 기본) · large 24(라벨 16 · 줄 36)
 *   shape  square(칸 + 체크, 기본) · ghost(칸 없이 체크만 — 선택 안 됨도 옅은 체크)
 *   tone   neutral(짙은 회색, 기본) · brand(서비스 핵심 흐름에서만)
 *   weight regular(기본) · bold(강조 · 묶음의 부모)
 *
 * 선택 안 된 칸의 테두리는 stroke-neutral-solid(3:1 — v109). 호버 = 누름 색(v106), 누르면 칸만 세로 2px 축소(v104) —
 * 칸의 기준 길이는 max(20·24, 24) = 24. 비활성은 전용 색(v106). 오류는 칸을 바꾸지 않는다 — 묶음 아래 글(사용자 결정).
 * 라벨을 눌러도 칸이 반응하도록 Checkbox 는 group/checkbox, 칸은 그 hover · active 도 받는다.
 * 키 — Space 는 켜고 끈다. Enter 는 폼을 제출한다(진짜 input · SEED 와 같다 — 폼의 기본 버튼을 누른다, 칸은 바뀌지 않는다).
 * Radix 는 Enter 를 막기만 해서 칸이 받아 제출한다(사용자 결정 2026-10-08). 라벨 안에 링크 · 버튼을 두지 않는다 — 누르는 영역(::before)이
 * 덮는다. 링크는 라벨 옆 · 아래에(checkbox.md Don't).
 * 묶음의 상태 — Field(또는 묶음에 준 disabled · aria-invalid)의 막힘은 묶음 aria-disabled 와 칸마다 disabled, 오류는 칸마다
 * aria-invalid 다. role="group" 은 aria-invalid · aria-required 를 받지 않아 묶음에는 걸지 않는다(SEED useFieldset 과 같다).
 * 줄 사이 12 는 누르는 영역 때문이다 — 줄 32 · 36 에 더해 44 · 48 마다 한 줄이라 이웃 줄과 44 영역이 겹치지 않는다
 * (SEED 의 4 로는 한 줄이 36 · 40 만 받는다, 사용자 결정). Checkbox 줄은 내용만큼만 차지한다(self-start) — 직접 짠 줄은 묶음 폭을 쓴다.
 */
const checkmarkVariants = cva(
  [
    "peer group/checkmark relative inline-grid shrink-0 cursor-pointer place-items-center rounded-r1",
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    "active:[scale:calc(1-2/var(--press-basis))] group-active/checkbox:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/checkbox:[scale:1]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
    "disabled:cursor-not-allowed disabled:[scale:1]",
    "[&_svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      size: {
        medium: "size-5 [--press-basis:24]",
        large: "size-6 [--press-basis:24]",
      },
      shape: {
        // 선택 안 됨: 테두리 칸. 선택 · 일부 선택: 테두리 없이 채움(톤 조합에서)
        square:
          "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed data-[state=checked]:border-0 data-[state=indeterminate]:border-0 disabled:border-stroke-neutral-weak disabled:bg-bg-disabled data-[state=checked]:disabled:bg-bg-disabled data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-bg-disabled data-[state=indeterminate]:disabled:text-fg-disabled",
        // 칸 없이 체크만 — 선택 안 됨도 옅은 체크(fg-placeholder)
        ghost:
          "border-0 bg-transparent text-fg-placeholder hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed disabled:bg-transparent disabled:text-fg-disabled data-[state=checked]:disabled:bg-transparent data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-transparent data-[state=indeterminate]:disabled:text-fg-disabled",
      },
      tone: {
        neutral: "",
        brand: "",
      },
    },
    compoundVariants: [
      // 크기 × 모양 — 아이콘(Ghost 는 칸이 없어 크다)
      { size: "medium", shape: "square", className: "[&_svg]:size-3" },
      { size: "large", shape: "square", className: "[&_svg]:size-3.5" },
      { size: "medium", shape: "ghost", className: "[&_svg]:size-3.5" },
      { size: "large", shape: "ghost", className: "[&_svg]:size-[18px]" },
      // Square × 톤 — 선택 · 일부 선택의 채움, 누름 · 호버는 -pressed
      {
        shape: "square",
        tone: "neutral",
        className:
          "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:text-fg-neutral-inverted data-[state=indeterminate]:bg-bg-neutral-inverted data-[state=indeterminate]:text-fg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:hover:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:active:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-inverted-pressed",
      },
      {
        shape: "square",
        tone: "brand",
        className:
          "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:text-static-white data-[state=indeterminate]:bg-bg-brand-solid data-[state=indeterminate]:text-static-white data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/checkbox:bg-bg-brand-solid-pressed data-[state=checked]:group-active/checkbox:bg-bg-brand-solid-pressed data-[state=indeterminate]:hover:bg-bg-brand-solid-pressed data-[state=indeterminate]:active:bg-bg-brand-solid-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-brand-solid-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-brand-solid-pressed",
      },
      // Ghost × 톤 — 선택 · 일부 선택의 글자색, 누름 · 호버 바탕
      {
        shape: "ghost",
        tone: "neutral",
        className:
          "data-[state=checked]:text-fg-neutral data-[state=indeterminate]:text-fg-neutral data-[state=checked]:hover:bg-bg-neutral-weak data-[state=checked]:active:bg-bg-neutral-weak data-[state=checked]:group-hover/checkbox:bg-bg-neutral-weak data-[state=checked]:group-active/checkbox:bg-bg-neutral-weak data-[state=indeterminate]:hover:bg-bg-neutral-weak data-[state=indeterminate]:active:bg-bg-neutral-weak data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-weak data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-weak",
      },
      {
        shape: "ghost",
        tone: "brand",
        className:
          "data-[state=checked]:text-fg-brand data-[state=indeterminate]:text-fg-brand data-[state=checked]:hover:bg-bg-brand-weak-pressed data-[state=checked]:active:bg-bg-brand-weak-pressed data-[state=checked]:group-hover/checkbox:bg-bg-brand-weak-pressed data-[state=checked]:group-active/checkbox:bg-bg-brand-weak-pressed data-[state=indeterminate]:hover:bg-bg-brand-weak-pressed data-[state=indeterminate]:active:bg-bg-brand-weak-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-brand-weak-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-brand-weak-pressed",
      },
    ],
    defaultVariants: {
      size: "medium",
      shape: "square",
      tone: "neutral",
    },
  },
);

export interface CheckmarkProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkmarkVariants> {}

// 묶음(CheckboxGroup)이 칸에 넘기는 상태 — 막힘 · 오류. 칸에 직접 준 값이 이긴다
const CheckboxGroupContext = React.createContext<{ disabled: boolean; invalid: boolean } | null>(null);

// 칸 — 체크 · 가로줄(일부 선택). Ghost 는 선택 안 됨에도 옅은 체크를 보인다(forceMount)
const Checkmark = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckmarkProps>(
  ({ className, size, shape, tone, disabled, onKeyDown, ...props }, ref) => {
    const group = React.useContext(CheckboxGroupContext);
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(checkmarkVariants({ size, shape, tone }), className)}
        disabled={disabled ?? group?.disabled}
        aria-invalid={group?.invalid || undefined}
        {...props}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          // Enter 는 폼을 제출한다 — Radix 는 Enter 를 막기만 한다(그 뒤에 막으므로 여기서는 부르는 쪽이 막았는지만 본다)
          if (!e.defaultPrevented && e.key === "Enter") submitImplicitly(e.currentTarget);
        }}
      >
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn("grid place-items-center", shape !== "ghost" && "data-[state=unchecked]:invisible")}
        >
          <Check strokeWidth={3} className="group-data-[state=indeterminate]/checkmark:hidden" />
          <Minus strokeWidth={3} className="hidden group-data-[state=indeterminate]/checkmark:block" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);
Checkmark.displayName = "Checkmark";

// 한 줄 — 칸 + 라벨. 누르는 영역은 ::before 로 44 까지
const checkboxVariants = cva(
  [
    "group/checkbox relative inline-flex cursor-pointer select-none items-center gap-x2 self-start",
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

const checkboxLabelVariants = cva("font-sans text-fg-neutral peer-disabled:text-fg-disabled", {
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

export interface CheckboxProps extends CheckmarkProps, VariantProps<typeof checkboxLabelVariants> {
  label: React.ReactNode;
  labelClassName?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, labelClassName, label, size, shape, tone, weight, id, ...props }, ref) => {
    const autoId = React.useId();
    const cid = id ?? autoId;
    return (
      <label htmlFor={cid} className={cn(checkboxVariants({ size }), className)}>
        <Checkmark ref={ref} id={cid} size={size} shape={shape} tone={tone} {...props} />
        <span className={cn(checkboxLabelVariants({ size, weight }), labelClassName)}>{label}</span>
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 칸을 모두 막는다 — 묶음 aria-disabled, 칸마다 disabled. Field 의 disabled 도 같다 */
  disabled?: boolean;
}

// 묶음 — 세로로 쌓고 줄 사이 12. 제목 · 오류 글은 Field 로 감싸면 이어진다(라벨 → aria-labelledby, 설명 · 오류 → aria-describedby).
// Field 없이 쓰면 aria-label 또는 aria-labelledby 를 준다. Field 의 막힘 · 오류는 칸에 나눠 건다(머리 주석) — 묶음에 준 disabled ·
// aria-invalid 가 이긴다. 필수는 묶음에 걸지 않는다(role=group 은 받지 않는다) — 고르지 않고 내면 오류 글이 알린다
const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(({ className, disabled, ...props }, ref) => {
  const field = useFieldGroupState();
  const own = props["aria-invalid"];
  const off = disabled ?? field.disabled;
  const invalid = own === undefined ? field.invalid : own === true || own === "true";
  const state = React.useMemo(() => ({ disabled: off, invalid }), [off, invalid]);
  return (
    <CheckboxGroupContext.Provider value={state}>
      <div
        ref={ref}
        role="group"
        aria-disabled={off || undefined}
        className={cn("flex flex-col gap-x3", className)}
        {...useFieldGroup(props)}
        aria-invalid={undefined}
        aria-required={undefined}
      />
    </CheckboxGroupContext.Provider>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup, Checkmark, checkboxVariants, checkboxLabelVariants, checkmarkVariants };
