import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useFieldGroup } from "@/components/ui/field";
import { ignoreRadioJumpKeys } from "@/components/ui/radio-group";
import { useScrollFog } from "@/components/ui/scroll-fog";

/*
 * Groo Chip — 구조는 SEED Chip(2026-10-02). 수치 원본은 specs/components/chip.yaml.
 *
 *   Chip                         버튼 — 제안(누르면 칸에 값을 넣는다, 고른 모습 없음) · 필터 바의 여는 칩(뒤 아래 화살표 +
 *                                aria-haspopup="dialog", 걸린 조건이면 selected) · 아이콘만 있는 필터 지우기(↺, aria-label 필수)
 *   ChipToggle                   여럿 고르기 — 체크박스, 다시 누르면 풀린다. name · value 를 주면 폼으로 보낸다
 *   ChipRadioGroup · ChipRadio   하나 고르기 — 라디오 묶음. 화살표로 옮기면 고르고, Tab 은 고른 칩 하나에만 선다.
 *                                고른 칩을 다시 눌러도 풀리지 않는다
 *   InputChip                    넣은 값 — 버튼이 아닌 알약(Outline Weak 고른 모습) + 뒤 지우기 버튼("{글} 지우기")
 *   ChipGroup                    묶음 — wrap(폼 · 시트 안) · scroll(목록 위 필터 바 · 제안 줄)
 *
 *   variant  solid(옅은 투명 채움 bg-neutral-weak-alpha — 어느 바탕에서나, v120) · outlineStrong(고르면 짙은 채움) ·
 *            outlineWeak(기본 — 고르면 옅은 바탕 + 짙은 1px, 글자 그대로)
 *   size     small 32 · medium 36(기본) · large 40. 글은 세 크기 모두 t4 14 · 500, 가장자리 ↔ 글 12 · 14 · 16, 아이콘 ↔ 글 6
 *   layout   withText(기본) · iconOnly(원 — 아이콘을 children 으로, aria-label 필수 · 없으면 개발 중에 경고)
 *
 * 고름은 ChipToggle · ChipRadio 는 Radix 의 data-state="checked", Chip 은 selected 가 다는 data-selected 로 칠한다
 * (보이기만 한다 — aria-pressed 는 어디에도 쓰지 않는다, SEED). Chip 에 data-state 를 쓰지 않는 것은 여는 칩을 감싸는
 * Popover · Dialog 트리거(asChild)가 data-state="open | closed" 를 덮어쓰기 때문이다. 고른 칩은 브랜드가 아니라 중립색이다.
 * 테두리는 안쪽 1px(inset shadow)이라 칩 크기가 변하지 않는다. 호버 = 누름 바탕(v106 — 마우스 있는 기기에서만, 축소 없음).
 * 누르면 누름 바탕 + 칩 전체가 2px 거리로 준다(SEED scaleScope: self · v104) — 배율 = (기준 − 2) ÷ 기준,
 * 기준 = max(높이, 폭 ÷ 4, 24). 누르는 순간(포인터 · Space · Enter) 칩을 재서 --press-basis 로 넘기고, 크기마다 높이를
 * 기본값으로 둔다. 모션 줄이기면 축소하지 않는다. 포커스 링은 키보드 포커스에만 바깥 2px · 띄움 2px.
 * 비활성은 전용 색(bg-disabled · fg-disabled — 흐리게 하지 않는다, v106)이고 호버 · 누름 · 축소가 없다. 안 고른 Solid 는 바탕
 * bg-neutral-weak-alpha 를 그대로 두고 글 · 아이콘만 fg-disabled 다 — bg-disabled 는 회색 바닥과 같은 gray-200 이라 알약이 사라진다
 * (사용자 결정 2026-10-17 — 03-B 결정 1 A). 고른 채 막히면 안쪽 1px stroke-neutral-solid 를 남겨 무엇을 골랐는지 보인다(사용자 결정 2026-10-02).
 * 누르는 영역은 보이는 칩과 따로 44 까지 넓힌다(::before — Button 과 같다. 아이콘만 있는 칩은 가로도 44).
 *
 * 묶음은 칩 사이 · 줄 사이 8(spacing-between-chips). scroll 은 두 겹이다 — 바깥 묶음(이름 · 포커스 · bleed) 안에 스크롤 칸
 * (chip.yaml scrollRow)을 둔다. 칸은 한 줄로 두고 안쪽 좌우 여백을 화면 여백(spacing-global-gutter)만큼 둔다 — 스크롤해도
 * 첫 칩이 여백에서 시작하고, 키보드로 옮겨도 여백 안에 멈춘다(scroll-padding). 스크롤바는 숨긴다. 칸의 양 끝은 늘 흐린다(Scroll Fog
 * row — gradient-fade-mask 좌우 20, 스크롤 위치 · 넘침과 상관없이) — 안쪽 여백 24 가 흐림보다 넓어 처음 · 끝의 칩은 흐리지 않는다.
 * 흐림은 마스크라 흐린 자리의 칩도 그대로 눌린다. 부모가 이미 화면 여백을 두었으면 bleed 로 줄을 화면 끝까지 낸다.
 * 칸은 넘친 것을 자르므로 위아래 안쪽 6 · 바깥 −6 을 둔다 — 누르는 영역 44 ·
 * 포커스 링이 잘리지 않고, 줄이 세로로 스크롤되지 않고, 줄 높이는 칩 그대로다. 두 겹이라 −6 이 바깥 묶음의 margin 과
 * 상쇄돼 부모의 위아래 간격(space-y · gap)도 그대로다.
 * 비어 있는 묶음은 칩 한 줄(36) 높이를 남긴다 — 입력값을 다 지운 뒤 받는 묶음의 링(모서리 없음)이 납작한 선이 되지 않게.
 * 묶음 · 스크롤 칸은 position: relative — 폼 안에서 Radix 가 칩 옆에 두는 숨은 input(투명 · 누르지 않음)이 그 안에
 * 자리 잡는다(스크롤 줄에서는 칩과 함께 잘리고 함께 스크롤된다).
 * 고르기 묶음을 Field 로 감싸면 라벨이 묶음의 이름, 설명 · 오류가 설명이 된다. Field 없이 쓰면 aria-label 을 준다.
 *
 * InputChip 의 지우기는 칩 안에서 따로 눌린다 — 아이콘 14 · 14 · 16(글자색 그대로), 누르는 영역 24 × 24, 호버 바탕 없음,
 * 누르면 지우기만 준다(기준 24 — Input Button 의 지우기와 같다). 지우기에 키보드 포커스가 있으면 링은 칩 둘레에 그린다
 * (지우기가 칩의 유일한 누를 자리다).
 * 누르면 onRemove 를 부르고, 다음 프레임에 포커스를 다음 칩의 지우기로(없으면 앞 칩의 지우기, 그것도 없으면 ChipGroup —
 * 묶음도 키보드 링을 그린다) 옮긴다. 그래서 InputChip 은 ChipGroup 안에 둔다. 지우지 않았으면(onRemove 가 거절) 포커스는 그 자리에 둔다.
 */

type ChipSize = "small" | "medium" | "large";

// ── 칩 ───────────────────────────────────────────────────────
const chipVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-x1_5 whitespace-nowrap rounded-full font-sans text-t4 font-medium no-underline",
    // 누르는 영역 44 — 보이는 칩보다 작으면 ::before 가 넓힌다
    "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
    // 바탕 · 글자 · 테두리는 color-transition, 축소는 pressed-scale
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
    // 비활성 — 호버 · 누름 바탕보다 뒤에 나와 이긴다. 고른 채 막힘은 고름의 바탕 · 글자를 덮고 짙은 1px 를 남긴다
    "disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled",
    "[&:is([data-state=checked],[data-selected])]:disabled:bg-bg-disabled [&:is([data-state=checked],[data-selected])]:disabled:text-fg-disabled [&:is([data-state=checked],[data-selected])]:disabled:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-solid)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      // 안 고름 · 고름의 바탕 · 글자 · 테두리, 호버 · 누름 바탕. 고름은 [&:is([data-state=checked],[data-selected])] —
      // Radix 칩의 data-state · Chip 의 data-selected 를 한 규칙으로 받는다
      variant: {
        solid: [
          "bg-bg-neutral-weak-alpha text-fg-neutral hover:bg-bg-neutral-weak-alpha-pressed active:bg-bg-neutral-weak-alpha-pressed",
          // 막혀도 안 고른 Solid 는 바탕 그대로 — 글 · 아이콘만 fg-disabled(bg-disabled 는 회색 바닥과 같은 색, 사용자 결정 2026-10-17 — 03-B 결정 1 A)
          "[&:not([data-state=checked],[data-selected])]:disabled:bg-bg-neutral-weak-alpha",
          "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-inverted [&:is([data-state=checked],[data-selected])]:text-fg-neutral-inverted [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-inverted-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-inverted-pressed",
        ].join(" "),
        // 고르면 짙은 채움 — 테두리는 지운다(SEED Chip Tabs 와 같다)
        outlineStrong: [
          "bg-transparent text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
          "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-inverted [&:is([data-state=checked],[data-selected])]:text-fg-neutral-inverted [&:is([data-state=checked],[data-selected])]:shadow-none [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-inverted-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-inverted-pressed",
        ].join(" "),
        // 고르면 옅은 바탕 + 짙은 1px(v113), 글자는 그대로
        outlineWeak: [
          "bg-transparent text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
          "[&:is([data-state=checked],[data-selected])]:bg-bg-neutral-weak [&:is([data-state=checked],[data-selected])]:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)] [&:is([data-state=checked],[data-selected])]:hover:bg-bg-neutral-weak-pressed [&:is([data-state=checked],[data-selected])]:active:bg-bg-neutral-weak-pressed",
        ].join(" "),
      },
      size: {
        small: "h-8 [--press-basis:32]",
        medium: "h-9 [--press-basis:36]",
        large: "h-10 [--press-basis:40]",
      },
      layout: {
        withText: "",
        iconOnly: "",
      },
    },
    compoundVariants: [
      // 크기 × 모양 — 최소 폭 · 좌우 여백(SEED 루트 + 글 여백), 아이콘만 있으면 원 + 아이콘 14 · 16 · 16
      { size: "small", layout: "withText", className: "min-w-11 px-x3" },
      { size: "medium", layout: "withText", className: "min-w-12 px-x3_5" },
      { size: "large", layout: "withText", className: "min-w-13 px-x4" },
      { size: "small", layout: "iconOnly", className: "w-8 px-0 [&>svg]:size-3.5" },
      { size: "medium", layout: "iconOnly", className: "w-9 px-0 [&>svg]:size-4" },
      { size: "large", layout: "iconOnly", className: "w-10 px-0 [&>svg]:size-4" },
    ],
    defaultVariants: {
      variant: "outlineWeak",
      size: "medium",
      layout: "withText",
    },
  },
);

// 아이콘 — 앞 14 · 16 · 16, 뒤 14 · 14 · 16(SEED — medium 만 앞 ≠ 뒤), 지우기 14 · 14 · 16.
// Tailwind 는 소스의 글자 그대로를 읽으므로 크기마다 다 적는다
const ICONS: Record<ChipSize, { prefix: string; suffix: string; remove: string }> = {
  small: { prefix: "[&>svg]:size-3.5", suffix: "[&>svg]:size-3.5", remove: "size-3.5" },
  medium: { prefix: "[&>svg]:size-4", suffix: "[&>svg]:size-3.5", remove: "size-3.5" },
  large: { prefix: "[&>svg]:size-4", suffix: "[&>svg]:size-4", remove: "size-4" },
};
const ICON_SLOT = "flex shrink-0 items-center justify-center";

function PrefixIcon({ size, children }: { size: ChipSize; children: React.ReactNode }) {
  return (
    <span aria-hidden data-slot="chip-prefix-icon" className={cn(ICON_SLOT, ICONS[size].prefix)}>
      {children}
    </span>
  );
}

function SuffixIcon({ size, children }: { size: ChipSize; children: React.ReactNode }) {
  return (
    <span aria-hidden data-slot="chip-suffix-icon" className={cn(ICON_SLOT, ICONS[size].suffix)}>
      {children}
    </span>
  );
}

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로(Button · List 와 같은 식) — 긴 글의 칩도 세로 2px 만 준다.
// Space 를 누르는 동안에도 :active 가 걸리므로 Space · Enter 에서도 잰다
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

const isPressKey = (e: React.KeyboardEvent) => e.key === " " || e.key === "Enter";

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 아이콘만 있는 칩은 이름이 있어야 한다 — 개발 중에만, 그려진 칩을 보고 알린다(asChild 자식에 단 이름도 본다)
function useIconOnlyName(ref: React.RefObject<HTMLElement | null>, iconOnly: boolean, label?: string, labelledBy?: string) {
  React.useEffect(() => {
    if (!import.meta.env.DEV || !iconOnly) return;
    const el = ref.current;
    if (el && !el.getAttribute("aria-label")?.trim() && !el.getAttribute("aria-labelledby")?.trim()) {
      console.warn('[Chip] 아이콘만 있는 칩에 이름이 없다 — aria-label 을 준다(예: "필터 지우기").', el);
    }
  }, [ref, iconOnly, label, labelledBy]);
}

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof chipVariants> {
  /** 고른 모습(짙은 채움) — 필터 바의 걸린 조건. 보이기만 한다(aria 상태 없음). 제안 칩에는 쓰지 않는다 */
  selected?: boolean;
  /** 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다 */
  prefixIcon?: React.ReactNode;
  /** 뒤 아이콘 — 여는 칩의 아래 화살표(ChevronDown) */
  suffixIcon?: React.ReactNode;
  /** 자식 요소(링크 등)를 칩으로 그린다 — 자식은 하나 */
  asChild?: boolean;
}

// 버튼 칩 — 제안 · 여는 칩 · 아이콘만 있는 지우기. 폼 안에서도 제출하지 않는다(type="button")
const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    { className, variant, size, layout, selected = false, prefixIcon, suffixIcon, asChild = false, type, children, onPointerDown, onKeyDown, ...props },
    ref,
  ) => {
    const own = React.useRef<HTMLButtonElement>(null);
    useIconOnlyName(own, layout === "iconOnly", props["aria-label"], props["aria-labelledby"]);
    const s = size ?? "medium";
    const prefix = prefixIcon != null && <PrefixIcon size={s}>{prefixIcon}</PrefixIcon>;
    const suffix = suffixIcon != null && <SuffixIcon size={s}>{suffixIcon}</SuffixIcon>;
    const common = {
      "data-slot": "chip",
      "data-selected": selected ? "" : undefined,
      className: cn(chipVariants({ variant, size, layout }), className),
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
        measurePress(e.currentTarget);
        onPointerDown?.(e);
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (isPressKey(e)) measurePress(e.currentTarget);
        onKeyDown?.(e);
      },
    };
    if (asChild) {
      return (
        <Slot ref={mergeRefs(ref, own)} {...common} {...props}>
          {prefix}
          <Slottable>{children}</Slottable>
          {suffix}
        </Slot>
      );
    }
    return (
      <button ref={mergeRefs(ref, own)} type={type ?? "button"} {...common} {...props}>
        {prefix}
        {children}
        {suffix}
      </button>
    );
  },
);
Chip.displayName = "Chip";

// ── 여럿 고르기 ───────────────────────────────────────────────
export interface ChipToggleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "checked" | "defaultChecked" | "onCheckedChange">,
    Omit<VariantProps<typeof chipVariants>, "layout"> {
  // 일부 고름(indeterminate)은 없다 — 칩은 고름 · 안 고름 둘뿐이다
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다 */
  prefixIcon?: React.ReactNode;
}

// 체크박스 칩 — 칩 자체가 Radix 체크박스(button role=checkbox)이고 글은 그 안에 있다. 칩마다 Tab 이 선다
const ChipToggle = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, ChipToggleProps>(
  ({ className, variant, size, prefixIcon, children, onCheckedChange, onPointerDown, onKeyDown, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="chip"
      className={cn(chipVariants({ variant, size, layout: "withText" }), className)}
      onCheckedChange={onCheckedChange && ((checked) => onCheckedChange(checked === true))}
      onPointerDown={(e) => {
        measurePress(e.currentTarget);
        onPointerDown?.(e);
      }}
      onKeyDown={(e) => {
        if (isPressKey(e)) measurePress(e.currentTarget);
        onKeyDown?.(e);
      }}
      {...props}
    >
      {prefixIcon != null && <PrefixIcon size={size ?? "medium"}>{prefixIcon}</PrefixIcon>}
      {children}
    </CheckboxPrimitive.Root>
  ),
);
ChipToggle.displayName = "ChipToggle";

// ── 묶음 ─────────────────────────────────────────────────────
// 바깥 묶음 — wrap 은 칩을 바로 담아 줄바꿈한다(칩 사이 · 줄 사이 8). scroll 은 안쪽 스크롤 칸(SCROLL_ROW)을 담고,
// bleed 면 부모의 화면 여백 밖(화면 끝)까지 낸다. 비었을 때만 칩 한 줄(medium 36) 높이를 남긴다 — 입력값을 다 지우면
// 포커스가 묶음으로 오므로 링이 납작한 선이 되지 않게(칩이 있으면 높이를 더하지 않는다)
const chipGroupVariants = cva("relative", {
  variants: {
    layout: {
      wrap: "flex flex-wrap gap-between-chips empty:min-h-9",
      scroll: "has-[>[data-slot=chip-scroll-row]:empty]:min-h-9",
    },
    bleed: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [{ layout: "scroll", bleed: true, className: "-mx-global-gutter" }],
  defaultVariants: { layout: "wrap", bleed: false },
});

// 안쪽 스크롤 칸(chip.yaml scrollRow) — 한 줄 · 칩 사이 8, 안쪽 좌우 화면 여백 · 위아래 6 을 두고 바깥 −6 으로 되돌린다
// (줄 높이 = 칩). −6 이 바깥 묶음의 margin 과 상쇄되는 두 겹이라 부모의 위아래 간격(space-y · gap)이 지워지지 않는다.
// relative — 폼 안에서 Radix 가 칩 옆에 두는 숨은 input 이 칩과 함께 잘리고 함께 스크롤된다
const SCROLL_ROW =
  "relative -my-x1_5 flex flex-nowrap gap-between-chips overflow-x-auto px-global-gutter py-x1_5 scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// 스크롤 칸 — 양 끝은 늘 흐린다(Scroll Fog row — 좌우 20). 위아래 여백 6 은 흐리지 않는다(가로 마스크다)
function ChipScrollRow({ children }: { children?: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useScrollFog(ref, "row");
  return (
    <div ref={ref} data-slot="chip-scroll-row" data-scroll-fog="row" className={SCROLL_ROW}>
      {children}
    </div>
  );
}

// 묶음의 키보드 링 — 모서리 없이 묶음 둘레(입력값을 다 지운 뒤 포커스를 받는다)
const GROUP_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring";

const rowOf = (layout: VariantProps<typeof chipGroupVariants>["layout"], children: React.ReactNode) =>
  layout === "scroll" ? <ChipScrollRow>{children}</ChipScrollRow> : children;

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chipGroupVariants> {}

// 묶음 — role="group"(이름은 Field 라벨 · aria-label). 입력값 칩을 다 지우면 포커스를 받으므로 tabIndex -1.
// className · ref 는 바깥 묶음에 간다(scroll 의 스크롤 칸은 그 안의 [data-slot=chip-scroll-row])
const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(({ className, layout, bleed, children, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    tabIndex={-1}
    data-slot="chip-group"
    className={cn(chipGroupVariants({ layout, bleed }), GROUP_RING, className)}
    {...useFieldGroup(props)}
  >
    {rowOf(layout, children)}
  </div>
));
ChipGroup.displayName = "ChipGroup";

// ── 하나 고르기 ───────────────────────────────────────────────
export interface ChipRadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, "orientation">,
    VariantProps<typeof chipGroupVariants> {}

// 라디오 묶음(role=radiogroup) — ← → ↑ ↓ 모두 옮기며 고른다(orientation 을 두지 않는다). Home · End 는 받지 않는다(Radio 와 같다). 배치는 ChipGroup 과 같다
// (scroll 은 radiogroup 안에 스크롤 칸을 한 겹 더 둔다 — Radix 는 칸 너머의 라디오도 DOM 순서로 찾는다)
const ChipRadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, ChipRadioGroupProps>(
  ({ className, layout, bleed, children, onKeyDownCapture, ...props }, ref) => (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-slot="chip-radio-group"
      className={cn(chipGroupVariants({ layout, bleed }), className)}
      {...useFieldGroup(props)}
      onKeyDownCapture={ignoreRadioJumpKeys(onKeyDownCapture)}
    >
      {rowOf(layout, children)}
    </RadioGroupPrimitive.Root>
  ),
);
ChipRadioGroup.displayName = "ChipRadioGroup";

export interface ChipRadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    Omit<VariantProps<typeof chipVariants>, "layout"> {
  /** 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다 */
  prefixIcon?: React.ReactNode;
}

// 라디오 칩 — 칩 자체가 Radix 라디오(button role=radio)이고 글은 그 안에 있다. ChipRadioGroup 안에 둔다
const ChipRadio = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, ChipRadioProps>(
  ({ className, variant, size, prefixIcon, children, onPointerDown, onKeyDownCapture, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="chip"
      className={cn(chipVariants({ variant, size, layout: "withText" }), className)}
      onPointerDown={(e) => {
        measurePress(e.currentTarget);
        onPointerDown?.(e);
      }}
      // Radix 라디오는 onKeyDown 을 자기 것으로 덮는다 — 누르는 키는 잡는 단계에서 잰다
      onKeyDownCapture={(e) => {
        if (isPressKey(e)) measurePress(e.currentTarget);
        onKeyDownCapture?.(e);
      }}
      {...props}
    >
      {prefixIcon != null && <PrefixIcon size={size ?? "medium"}>{prefixIcon}</PrefixIcon>}
      {children}
    </RadioGroupPrimitive.Item>
  ),
);
ChipRadio.displayName = "ChipRadio";

// ── 입력값 ───────────────────────────────────────────────────
// 알약 — 누르지 않는다(호버 · 누름 없음). Outline Weak 의 고른 모습, 막히면 회색 바탕 + 짙은 1px stroke-neutral-solid
const inputChipVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-x1_5 whitespace-nowrap rounded-full font-sans text-t4 font-medium",
    "bg-bg-neutral-weak text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "data-[disabled]:bg-bg-disabled data-[disabled]:text-fg-disabled data-[disabled]:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-solid)]",
    // 지우기에 키보드 포커스가 있으면 칩 둘레에 링(바깥 2px · 띄움 2px)
    "has-[[data-slot=input-chip-remove]:focus-visible]:outline-2 has-[[data-slot=input-chip-remove]:focus-visible]:outline-offset-2 has-[[data-slot=input-chip-remove]:focus-visible]:outline-stroke-focus-ring",
  ].join(" "),
  {
    variants: {
      size: {
        small: "h-8 min-w-11 px-x3",
        medium: "h-9 min-w-12 px-x3_5",
        large: "h-10 min-w-13 px-x4",
      },
    },
    defaultVariants: { size: "medium" },
  },
);

// 지우기 — 보이는 아이콘 14 · 14 · 16(글자색 그대로), 누르는 영역은 ::before 로 24. 누르면 자기만 준다(기준 24 — Input Button 의
// 지우기와 같다). 키보드 링은 칩(InputChip)이 그린다
const REMOVE = [
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current outline-none",
  "[&>svg]:pointer-events-none [&>svg]:size-full",
  "before:absolute before:left-1/2 before:top-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[--press-basis:24] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:[scale:1]",
].join(" ");

const removeButtonsIn = (group: HTMLElement) => Array.from(group.querySelectorAll<HTMLButtonElement>("[data-slot=input-chip-remove]"));
const enabled = (button: HTMLButtonElement) => !button.disabled;

export interface InputChipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** 넣은 값의 글 */
  children: React.ReactNode;
  /** 지우기 — 이 값을 뺀다 */
  onRemove: () => void;
  size?: ChipSize;
  /** 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다 */
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
  /** 지우기 버튼의 이름 — 기본 "{글} 지우기"(글이 문자열이 아니면 화면의 글 + "지우기" 로 읽힌다) */
  removeLabel?: string;
}

// 입력값 칩 — 글 + 뒤 지우기 버튼. ChipGroup 안에 둔다(지운 뒤 포커스가 갈 자리)
const InputChip = React.forwardRef<HTMLSpanElement, InputChipProps>(
  ({ className, size, prefixIcon, disabled = false, removeLabel, onRemove, children, ...props }, ref) => {
    const auto = React.useId();
    const labelId = `${auto}label`;
    const removeTextId = `${auto}remove`;
    const s = size ?? "medium";
    const plain = typeof children === "string" || typeof children === "number";
    const name = removeLabel ?? (plain ? `${children} 지우기` : undefined);

    const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const group = button.closest<HTMLElement>("[data-slot=chip-group]");
      const index = group ? removeButtonsIn(group).indexOf(button) : -1;
      onRemove();
      if (!group) return;
      // 지운 칩이 화면에서 빠진 다음 프레임에 — 다음 칩의 지우기, 없으면 앞 칩의 지우기, 그것도 없으면 묶음
      requestAnimationFrame(() => {
        if (!group.isConnected) return;
        // 지우지 않았거나(거절) 같은 자리를 다음 칩이 이어 쓴다(배열 순번 key) — 그 자리에 둔다
        if (button.isConnected && enabled(button)) {
          button.focus();
          return;
        }
        const rest = removeButtonsIn(group);
        const next = rest.slice(index).find(enabled) ?? rest.slice(0, index).reverse().find(enabled);
        (next ?? group).focus();
      });
    };

    return (
      <span
        ref={ref}
        data-slot="input-chip"
        data-disabled={disabled ? "" : undefined}
        className={cn(inputChipVariants({ size: s }), className)}
        {...props}
      >
        {prefixIcon != null && <PrefixIcon size={s}>{prefixIcon}</PrefixIcon>}
        <span id={labelId} data-slot="input-chip-label">
          {children}
        </span>
        <button
          type="button"
          data-slot="input-chip-remove"
          aria-label={name}
          aria-labelledby={name === undefined ? `${labelId} ${removeTextId}` : undefined}
          disabled={disabled}
          className={cn(REMOVE, ICONS[s].remove)}
          onClick={remove}
        >
          <X aria-hidden />
        </button>
        {name === undefined && (
          <span id={removeTextId} hidden>
            지우기
          </span>
        )}
      </span>
    );
  },
);
InputChip.displayName = "InputChip";

export { Chip, ChipToggle, ChipGroup, ChipRadioGroup, ChipRadio, InputChip, chipVariants, chipGroupVariants, inputChipVariants };
