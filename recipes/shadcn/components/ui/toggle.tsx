import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Groo Toggle — 켜고 끄는 아이콘 단추(2026-10-09). 수치 원본은 specs/components/toggle.yaml.
 * SEED 에는 이 단추의 디자인 문서가 없다 — 글이 있는 알약 Toggle Button 은 코드에만 있고 groo 는 두지 않는다(사용자 결정 8A).
 * 옛 글 토글(default · outline 28 · 32 · 40)과 Toggle Group 은 걷었다 — 거르기 · 고르기는 Chip · Segmented Control, 설정은 Switch.
 *
 *   Toggle   <button type="button" aria-pressed> 하나 — 관심 등록 · 메모 고정 · App Key 보기(그 자리에서 켜고 끄는 단추)
 *            aria-label(필수 — 고정 이름) · pressed · defaultPressed · onPressedChange(pressed) · icon(끔의 아이콘 — 필수) ·
 *            pressedIcon(켬의 아이콘 — 없으면 icon 그대로: 모으기 단추) · tone("default" · "inverted" — 브랜드 채움 위) · disabled.
 *            나머지 <button> 속성(className · id · onClick …)은 단추에 간다. ref 는 단추로 — TooltipTrigger · HelpBubbleAnchor 의
 *            asChild 자식으로 둘 수 있다(감싼 쪽의 onClick 은 켜고 끄기보다 먼저 불리고, preventDefault 하면 켜고 끄지 않는다)
 *
 * 이름은 고정이고 켬은 aria-pressed 가 알린다(APG) — 상태마다 이름을 바꾸지 않는다. 아이콘은 지금 상태를 그린다: 기능 단추(눈 · 종)는
 * lucide 의 -off 짝(가렸으면 eye-off), 모으기 단추(관심 · 고정)는 사선 없이 같은 아이콘(사용자 결정 6B · 7A).
 * 켬 · 끔은 아이콘만 바뀐다 — 켬은 진한 색(fg-neutral) + 선 2.5, 끔은 흐린 색(fg-neutral-muted) + 선 2. 바탕은 켬 · 끔에 따라 바뀌지
 * 않는다(5A — 켜면 옅은 바탕 · 반전은 고르지 않았다). 아이콘의 크기(20) · 굵기 · 색은 단추가 건다 — 넘기는 아이콘에 size · strokeWidth 를
 * 주지 않는다. 상단 바 안에 둘 때는 Top Navigation 의 아이콘 버튼(aria-pressed — 끔도 fg-neutral, 19B)을 쓴다.
 * 순자산 카드의 금액 가리기 눈은 Toggle 이 아니다 — 설정으로 가는 버튼이라 <button aria-label="금액 가리기 설정"> 에 toggleVariants({ tone })
 * 의 상자만 빌리고 aria-pressed 를 두지 않는다(선 2 그대로, 아이콘은 그 카드가 가려졌는지 — 2026-10-16 Q-017-2b A · 3c B).
 *
 * 크기 하나 — 보이는 40 · 누르는 44(::before) · 아이콘 20 · 모서리 8(Button medium iconOnly 와 같은 상자). 호버 · 누름에만 바탕
 * bg-layer-default-pressed, 누르면 단추 전체가 2px 거리 축소(40 → 0.95 · v104, 모션 줄이기면 하지 않는다). 켬 · 끔은 손을 뗄 때(click)
 * 바로 바뀌고 onPressedChange 를 부른다 — 요청을 기다리지 않고 단추를 막지 않는다(실패하면 부르는 쪽이 되돌리고 스낵바, 20A).
 * 키보드 포커스에만 링 2px · 띄움 2px(stroke-focus-ring). 막힘은 진짜 disabled(Tab 에서 빠진다) — 아이콘만 fg-disabled 이고 켬의 선 2.5 는
 * 그대로 둔다(v106).
 * 브랜드 채움 위(inverted — 순자산 카드의 금액 가리기 눈이 빌린다)는 켬 · 끔 모두 흰 아이콘이고 모양 · 굵기로 가른다. 누름 색 짝이 없어 축소만 한다(21A — 원 · 바탕 없음).
 * 포커스 링도 흰색(static-white)이다 — stroke-focus-ring 은 브랜드 채움에 묻힌다(Desk 라이트 1.00). 링 색은 톤마다 건다.
 * 켬 · 끔의 모양은 aria-pressed 로 건다(data-state 를 쓰지 않는다 — TooltipTrigger 가 asChild 로 data-state 를 넘긴다).
 */

const toggleVariants = cva(
  [
    "relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0",
    // 누르는 영역 44 — 보이는 40 둘레로 2 씩
    "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
    // 아이콘 20 · 끔 선 2 · 켬 선 2.5(막혀도 그대로)
    "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:[stroke-width:2] aria-pressed:[&_svg]:[stroke-width:2.5]",
    // 바탕은 color-transition, 축소는 pressed-scale
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    "[--press-basis:40] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
    // 키보드 포커스 링 2px · 띄움 2px — 색은 톤마다(채움 위는 흰색)
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:cursor-not-allowed disabled:bg-transparent disabled:text-fg-disabled disabled:[scale:1]",
  ].join(" "),
  {
    variants: {
      tone: {
        // 끔 흐린 색 · 켬 진한 색(막히면 켬도 fg-disabled — enabled 에만 건다), 호버 · 누름은 같은 바탕, 링 stroke-focus-ring
        default:
          "text-fg-neutral-muted enabled:aria-pressed:text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed focus-visible:outline-stroke-focus-ring",
        // 브랜드 채움 위 — 켬 · 끔 모두 흰 아이콘, 바탕은 칠하지 않는다(축소만). 링도 흰색 — stroke-focus-ring 은 채움에 묻힌다
        inverted: "text-static-white focus-visible:outline-static-white",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "aria-label" | "aria-pressed" | "children" | "defaultChecked"> {
  /** 고정 이름 — 켜고 끄는 것 하나("관심 등록" · "App Key 보기"). 상태마다 바꾸지 않는다 */
  "aria-label": string;
  /** 켬(제어) */
  pressed?: boolean;
  /** 처음 켬(비제어) */
  defaultPressed?: boolean;
  /** 켬 · 끔이 바뀌면 바로 — 요청을 기다리지 않는다 */
  onPressedChange?: (pressed: boolean) => void;
  /** 끔일 때의 아이콘(lucide) — 지금 상태를 그린다. 크기 · 굵기 · 색은 단추가 건다 */
  icon: React.ReactNode;
  /** 켬일 때의 아이콘 — 기능 단추(눈 · 종)의 짝. 없으면 icon 그대로(모으기 단추 — 관심 · 고정) */
  pressedIcon?: React.ReactNode;
  /** default(흰 표면 · 카드 · 시트 위, 기본) · inverted(브랜드 채움 위 — 흰 아이콘) */
  tone?: "default" | "inverted";
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ pressed: pressedProp, defaultPressed = false, onPressedChange, icon, pressedIcon, tone = "default", className, onClick, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultPressed);
    const controlled = pressedProp !== undefined;
    const pressed = controlled ? pressedProp : inner;
    return (
      <button
        ref={ref}
        type="button"
        data-slot="toggle"
        data-tone={tone}
        className={cn(toggleVariants({ tone }), className)}
        {...props}
        aria-pressed={pressed}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          const next = !pressed;
          if (!controlled) setInner(next);
          onPressedChange?.(next);
        }}
      >
        {/* 아이콘은 장식 — 이름은 aria-label, 켬은 aria-pressed */}
        <span aria-hidden data-slot="toggle-icon" className="pointer-events-none flex">
          {pressed && pressedIcon != null ? pressedIcon : icon}
        </span>
      </button>
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
