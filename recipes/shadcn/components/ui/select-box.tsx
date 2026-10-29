import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useFieldGroup } from "@/components/ui/field";
import { Checkmark } from "@/components/ui/checkbox";
import { Radiomark, ignoreRadioJumpKeys, submitOnRadioEnter } from "@/components/ui/radio-group";

/*
 * Groo Select Box — 구조는 SEED Select Box(2026-10-01). 수치 원본은 specs/components/select-box.yaml.
 *
 *   RadioSelectBoxGroup · RadioSelectBox   하나 고르기 — 묶음은 radiogroup, 오른쪽 라디오(Radiomark 20) 또는 없음
 *   CheckSelectBoxGroup · CheckSelectBox   여럿 고르기 — 묶음은 fieldset, 오른쪽 칸 없는 체크(Checkbox Ghost) 또는 없음
 *
 * 상자 하나 = 선택지 하나. 상자(div)는 테두리 · 바탕만 맡고, 그 안의 누르는 자리(label)가 콘텐츠 + 컨트롤을 담아
 * 펼침(footer)을 뺀 상자 전체가 누르는 영역이 된다. 고른 테두리는 ::after 로 안쪽 2px 에 덧그린다 — 1px → 2px 로
 * 바뀌어도 내용이 밀리지 않는다(SEED). 바탕은 바꾸지 않는다(사용자 결정).
 * 누르면 바탕이 bg-layer-default-pressed 로 바뀌고 누르는 자리만 2px 거리로 준다(SEED scaleScope: content · v104) —
 * 기준 길이 max(높이, 폭 ÷ 4, 24) 는 Button · List 처럼 누르는 순간 잰다. 컨트롤은 따로 줄지 않는다.
 * 키보드 포커스 링은 상자 바깥에 하나만 — 컨트롤은 자기 링을 끈다(SEED).
 * 컨트롤이 '없음' 이어도 라디오 · 체크는 화면 밖에 두어(sr-only) 키보드 · 화면 읽기 프로그램이 그대로 쓴다.
 * 1열은 가로형(기본), 2 ~ 3열이면 세로형 — 묶음의 columns 가 정하고 상자마다 layout 으로 바꿀 수 있다.
 * 묶음의 density="compact" 는 세로형의 낮은 상자다 — 위아래 20 → 12 · 앞 ↔ 글 10 → 4(가로형에는 걸리지 않는다). 한 시트에 상자가 많아
 * 100% 글자에서 모두 보여야 할 때만 쓴다(자산 종류 아홉 — 2026-10-29 사용자 결정 17-1 Q5 = B). 선택지 2 ~ 4개는 기본.
 * 펼침은 고른 상자 아래로 열린다(높이 400ms · 투명도 300ms, 닫을 때 300ms · 400ms). 닫히면 보이지 않고 Tab 도 닿지 않는다.
 */

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로(Button · List 와 같은 식) — 누르는 자리(label)에 단다.
// 키보드(Space)로 눌러도 :active 가 걸리므로 keydown 에서도 잰다. 가장자리를 오래 눌러도 click 이 그 자리로 가게
// 누른 요소가 포인터를 잡는다(마우스 · 펜 — 터치는 브라우저가 이미 잡는다)
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

const pressHandlers = {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
    measurePress(e.currentTarget);
    const target = e.target as Element;
    if (e.pointerType !== "touch") target.setPointerCapture?.(e.pointerId);
  },
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => measurePress(e.currentTarget),
};

// 묶음 — 1 ~ 3열 격자. 2열 이상은 상자 높이를 가장 긴 상자에 맞춘다(모든 줄이 같은 높이 — SEED grid-auto-rows 1fr)
const selectBoxGroupVariants = cva("grid w-full gap-x-x3 gap-y-component-default", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "auto-rows-fr grid-cols-2",
      3: "auto-rows-fr grid-cols-3",
    },
  },
  defaultVariants: { columns: 1 },
});

// 상자 — 테두리 1px(안쪽) · 모서리 12. 고른 테두리 2px 는 ::after. 상태는 안쪽의 누르는 자리 · 컨트롤에서 읽는다
const selectBoxVariants = cva(
  [
    "group/select-box relative flex h-full flex-col rounded-r3 bg-transparent shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-[''] after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
    "has-[[data-select-box-control][data-state=checked]:not([data-disabled])]:after:border-stroke-neutral-contrast",
    "has-[[data-select-box-control][data-state=checked][data-disabled]]:after:border-stroke-neutral-weak",
    "[@media(hover:hover)]:has-[[data-select-box-action]:not([data-disabled]):hover]:bg-bg-layer-default-pressed has-[[data-select-box-action]:not([data-disabled]):active]:bg-bg-layer-default-pressed",
    "has-[[data-select-box-control]:focus-visible]:outline-2 has-[[data-select-box-control]:focus-visible]:outline-offset-2 has-[[data-select-box-control]:focus-visible]:outline-stroke-focus-ring",
  ].join(" "),
);

// 누르는 자리(label) — 콘텐츠 + 컨트롤. 누르면 이 자리만 준다. 상자가 같은 높이로 늘면 남는 자리까지 채운다(grow — SEED) —
// 그래야 내용이 짧은 상자의 빈 아래쪽도 눌린다
const selectBoxTriggerVariants = cva(
  [
    "relative flex w-full grow cursor-pointer select-none justify-between gap-x1_5",
    "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    "group-has-[[data-select-box-action]:not([data-disabled]):active]/select-box:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-select-box-action]:not([data-disabled]):active]/select-box:[scale:1]",
    "data-[disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      layout: {
        horizontal: "items-center py-x4 pl-x5 pr-x4",
        vertical: "items-start px-x4",
      },
      // 낮은 상자(compact)는 세로형에만 — 위아래 20 → 12
      density: { default: "", compact: "" },
    },
    compoundVariants: [
      { layout: "vertical", density: "default", className: "py-x5" },
      { layout: "vertical", density: "compact", className: "py-x3" },
    ],
    defaultVariants: { layout: "horizontal", density: "default" },
  },
);

const selectBoxContentVariants = cva("flex min-w-0 flex-1", {
  variants: {
    layout: {
      horizontal: "flex-row items-center gap-x3",
      vertical: "flex-col",
    },
    // 낮은 상자(compact)는 세로형에만 — 앞(위) ↔ 본문 10 → 4
    density: { default: "", compact: "" },
  },
  compoundVariants: [
    { layout: "vertical", density: "default", className: "gap-x2_5" },
    { layout: "vertical", density: "compact", className: "gap-x1" },
  ],
  defaultVariants: { layout: "horizontal", density: "default" },
});

const selectBoxPrefixVariants = cva("flex shrink-0 text-fg-neutral [&>svg]:size-[22px]", {
  variants: { disabled: { true: "text-fg-disabled", false: "" } },
  defaultVariants: { disabled: false },
});

const selectBoxBodyVariants = cva("mr-auto flex min-w-0 flex-col items-start gap-x0_5 pr-x1 text-left");

const selectBoxLabelVariants = cva("flex items-center gap-x1 font-sans text-t5 font-medium text-fg-neutral", {
  variants: { disabled: { true: "text-fg-disabled", false: "" } },
  defaultVariants: { disabled: false },
});

const selectBoxDescriptionVariants = cva("font-sans text-t3 text-fg-neutral-muted", {
  variants: { disabled: { true: "text-fg-disabled", false: "" } },
  defaultVariants: { disabled: false },
});

// 펼침 — 고른 상자 아래로 열린다. 높이는 grid-template-rows 0fr → 1fr, 닫히면 보이지 않는다(visibility — Tab 도 안 닿는다).
// Tailwind 는 소스의 글자 그대로를 읽으므로 두 경우의 클래스를 다 적는다(조합해 만들면 CSS 가 생기지 않는다)
const FOOTER_BASE = [
  "grid invisible opacity-0 [grid-template-rows:0fr]",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_400ms_var(--motion-ease-easing),visibility_0s_linear_400ms]",
  "motion-reduce:[transition:opacity_150ms_linear,visibility_0s_linear_150ms]",
].join(" ");
const FOOTER_OPEN = {
  "when-selected": [
    "group-has-[[data-select-box-control][data-state=checked]]/select-box:visible group-has-[[data-select-box-control][data-state=checked]]/select-box:opacity-100 group-has-[[data-select-box-control][data-state=checked]]/select-box:[grid-template-rows:1fr]",
    "group-has-[[data-select-box-control][data-state=checked]]/select-box:[transition:grid-template-rows_400ms_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
    "motion-reduce:group-has-[[data-select-box-control][data-state=checked]]/select-box:[transition:opacity_150ms_linear,visibility_0s]",
  ].join(" "),
  "when-not-selected": [
    "group-has-[[data-select-box-control][data-state=unchecked]]/select-box:visible group-has-[[data-select-box-control][data-state=unchecked]]/select-box:opacity-100 group-has-[[data-select-box-control][data-state=unchecked]]/select-box:[grid-template-rows:1fr]",
    "group-has-[[data-select-box-control][data-state=unchecked]]/select-box:[transition:grid-template-rows_400ms_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
    "motion-reduce:group-has-[[data-select-box-control][data-state=unchecked]]/select-box:[transition:opacity_150ms_linear,visibility_0s]",
  ].join(" "),
} as const;
const footerClasses = (visibility: "when-selected" | "when-not-selected") => `${FOOTER_BASE} ${FOOTER_OPEN[visibility]}`;
const selectBoxFooterInnerVariants = cva("px-x5 pb-x4");

// 컨트롤은 따로 줄지 않는다 — 누르는 자리가 함께 준다(v104). label 의 누름이 컨트롤로 넘어오므로 축소만 끈다.
// 포커스 링도 상자가 그리므로 컨트롤 자기 링은 끈다(SEED 도 trigger 에서 --seed-focus-ring: none — 링이 두 겹이 되지 않는다).
// 체크(Ghost)는 상자가 누름 · 호버를 맡으므로 자기 바탕을 끈다
const MARK_IN_BOX = "active:[scale:1] focus-visible:outline-none";
const GHOST_NO_BG =
  "hover:bg-transparent active:bg-transparent data-[state=checked]:hover:bg-transparent data-[state=checked]:active:bg-transparent";

type Layout = "horizontal" | "vertical";
type Density = "default" | "compact";
const SelectBoxGroupContext = React.createContext<{ columns: 1 | 2 | 3; density: Density }>({ columns: 1, density: "default" });
const useLayout = (layout?: Layout): Layout => {
  const { columns } = React.useContext(SelectBoxGroupContext);
  return layout ?? (columns > 1 ? "vertical" : "horizontal");
};

type BoxBase = {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** 앞 — 아이콘(22 로 맞춘다) · 그림 */
  prefix?: React.ReactNode;
  /** 고르면 상자 아래로 펼쳐지는 내용 — 딸린 입력 · 안내 */
  footer?: React.ReactNode;
  /** 펼침을 보일 때 — 고르면(기본) · 고르지 않으면 · 늘 */
  footerVisibility?: "when-selected" | "when-not-selected" | "always";
  /** 묶음의 열 수에서 온다(1열 가로형 · 2 ~ 3열 세로형) — 상자마다 바꿀 때만 */
  layout?: Layout;
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
};

// 상자의 짜임 — div(테두리 · 바탕) > label(누르는 자리: 앞 · 본문 · 컨트롤) + 펼침
function Box({
  label,
  description,
  prefix,
  footer,
  footerVisibility = "when-selected",
  layout: layoutProp,
  rootProps: { className: rootClassName, ...rootRest } = {},
  disabled,
  htmlFor,
  control,
}: BoxBase & { disabled?: boolean; htmlFor: string; control: React.ReactNode }) {
  const layout = useLayout(layoutProp);
  const { density } = React.useContext(SelectBoxGroupContext);
  return (
    <div className={cn(selectBoxVariants(), rootClassName)} {...rootRest}>
      <label
        htmlFor={htmlFor}
        data-select-box-action=""
        data-disabled={disabled ? "" : undefined}
        className={selectBoxTriggerVariants({ layout, density })}
        {...pressHandlers}
      >
        <span className={selectBoxContentVariants({ layout, density })}>
          {prefix && <span className={cn(selectBoxPrefixVariants({ disabled }))}>{prefix}</span>}
          <span className={selectBoxBodyVariants()}>
            <span className={cn(selectBoxLabelVariants({ disabled }))}>{label}</span>
            {description && <span className={cn(selectBoxDescriptionVariants({ disabled }))}>{description}</span>}
          </span>
        </span>
        {control}
      </label>
      {footer &&
        (footerVisibility === "always" ? (
          <div className={selectBoxFooterInnerVariants()}>{footer}</div>
        ) : (
          <div data-select-box-footer="" className={footerClasses(footerVisibility)}>
            <div className="min-h-0 overflow-hidden">
              <div className={selectBoxFooterInnerVariants()}>{footer}</div>
            </div>
          </div>
        ))}
    </div>
  );
}

type GroupDensity = {
  /** 세로형의 낮은 상자(compact — 위아래 12 · 앞 ↔ 글 4). 한 시트에 상자가 많아 모두 보여야 할 때만 — 선택지 2 ~ 4개는 기본(default) */
  density?: Density;
};

export interface RadioSelectBoxGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof selectBoxGroupVariants>,
    GroupDensity {}

// 하나 고르기 묶음 — role=radiogroup, 이름 필수(Field 로 감싸면 라벨이 이름 · 오류가 설명이 된다, 아니면 aria-label · aria-labelledby).
// 화살표로 옮기며 고른다(Home · End 는 받지 않는다 — Radio 와 같다). Enter 는 폼을 제출한다(Radio 와 같다 — 여럿 고르기는 Checkmark 가 한다)
const RadioSelectBoxGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, RadioSelectBoxGroupProps>(
  ({ className, columns = 1, density = "default", onKeyDown, onKeyDownCapture, ...props }, ref) => (
    <SelectBoxGroupContext.Provider value={{ columns: columns ?? 1, density }}>
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(selectBoxGroupVariants({ columns }), className)}
        {...useFieldGroup(props)}
        onKeyDown={submitOnRadioEnter(onKeyDown)}
        onKeyDownCapture={ignoreRadioJumpKeys(onKeyDownCapture)}
      />
    </SelectBoxGroupContext.Provider>
  ),
);
RadioSelectBoxGroup.displayName = "RadioSelectBoxGroup";

export interface RadioSelectBoxProps extends BoxBase, Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "prefix" | "children"> {
  /** 오른쪽 컨트롤 — 라디오(기본) · 없음(테두리만) */
  control?: "radio" | "none";
}

// 하나 고르기 상자 — RadioSelectBoxGroup 안에 둔다
const RadioSelectBox = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadioSelectBoxProps>(
  ({ label, description, prefix, footer, footerVisibility, layout, rootProps, control = "radio", id, disabled, className, ...props }, ref) => {
    const autoId = React.useId();
    const rid = id ?? autoId;
    const mark =
      control === "radio" ? (
        <Radiomark
          ref={ref}
          id={rid}
          data-select-box-control=""
          data-select-box-action=""
          size="medium"
          tone="neutral"
          disabled={disabled}
          className={cn(MARK_IN_BOX, className)}
          {...props}
        />
      ) : (
        <RadioGroupPrimitive.Item
          ref={ref}
          id={rid}
          data-select-box-control=""
          data-select-box-action=""
          disabled={disabled}
          className={cn("sr-only", className)}
          {...props}
        />
      );
    return (
      <Box
        {...{ label, description, prefix, footer, footerVisibility, layout, rootProps, disabled }}
        htmlFor={rid}
        control={mark}
      />
    );
  },
);
RadioSelectBox.displayName = "RadioSelectBox";

export interface CheckSelectBoxGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement>, VariantProps<typeof selectBoxGroupVariants>, GroupDensity {}

// 여럿 고르기 묶음 — fieldset, 이름 필수(Field 로 감싸면 라벨이 이름 · 오류가 설명이 된다, 아니면 aria-label · aria-labelledby).
// "없음" 으로 여럿을 고르게 하면 몇 개까지인지 미리 적는다
const CheckSelectBoxGroup = React.forwardRef<HTMLFieldSetElement, CheckSelectBoxGroupProps>(({ className, columns = 1, density = "default", ...props }, ref) => (
  <SelectBoxGroupContext.Provider value={{ columns: columns ?? 1, density }}>
    <fieldset ref={ref} className={cn(selectBoxGroupVariants({ columns }), "m-0 min-w-0 border-0 p-0", className)} {...useFieldGroup(props)} />
  </SelectBoxGroupContext.Provider>
));
CheckSelectBoxGroup.displayName = "CheckSelectBoxGroup";

export interface CheckSelectBoxProps
  extends BoxBase,
    Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "prefix" | "children" | "checked" | "defaultChecked" | "onCheckedChange"> {
  /** 오른쪽 컨트롤 — 칸 없는 체크(기본) · 없음(테두리만) */
  control?: "check" | "none";
  // 일부 선택(indeterminate)은 없다 — 부모 · 자식 묶음은 Checkbox
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// 여럿 고르기 상자 — CheckSelectBoxGroup 안에 둔다
const CheckSelectBox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckSelectBoxProps>(
  ({ label, description, prefix, footer, footerVisibility, layout, rootProps, control = "check", id, disabled, className, onCheckedChange, ...rest }, ref) => {
    const autoId = React.useId();
    const cid = id ?? autoId;
    const props = { ...rest, onCheckedChange: onCheckedChange && ((v: CheckboxPrimitive.CheckedState) => onCheckedChange(v === true)) };
    const mark =
      control === "check" ? (
        <Checkmark
          ref={ref}
          id={cid}
          data-select-box-control=""
          data-select-box-action=""
          size="medium"
          shape="ghost"
          tone="neutral"
          disabled={disabled}
          className={cn(MARK_IN_BOX, GHOST_NO_BG, className)}
          {...props}
        />
      ) : (
        <CheckboxPrimitive.Root
          ref={ref}
          id={cid}
          data-select-box-control=""
          data-select-box-action=""
          disabled={disabled}
          className={cn("sr-only", className)}
          {...props}
        />
      );
    return (
      <Box
        {...{ label, description, prefix, footer, footerVisibility, layout, rootProps, disabled }}
        htmlFor={cid}
        control={mark}
      />
    );
  },
);
CheckSelectBox.displayName = "CheckSelectBox";

export {
  RadioSelectBoxGroup,
  RadioSelectBox,
  CheckSelectBoxGroup,
  CheckSelectBox,
  selectBoxGroupVariants,
  selectBoxVariants,
  selectBoxTriggerVariants,
  selectBoxContentVariants,
  selectBoxPrefixVariants,
  selectBoxBodyVariants,
  selectBoxLabelVariants,
  selectBoxDescriptionVariants,
  selectBoxFooterInnerVariants,
};
