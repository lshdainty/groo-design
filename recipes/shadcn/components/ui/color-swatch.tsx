import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChartColor } from "@/components/ui/chart";
import { submitImplicitly, useFieldGroup, useFieldGroupState } from "@/components/ui/field";
import { ignoreRadioJumpKeys } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/*
 * Porest Color Swatch — 카테고리 · 태그 · 라벨 · 저축 목표 · 캘린더에 붙일 색을 고르는 묶음(2026-10-09). 수치 원본은 specs/components/color-swatch.yaml.
 * SEED 에는 색 고르기 부품이 없다 — 칸의 칠 · 크기 · 고른 표시 · 키보드 · 새 항목의 첫 색은 porest 가 정했다(사용자 결정 12C · 13B · 14B).
 * 옛 Color Swatch(폭을 나눈 정사각 칸 · currentColor 테두리 · 마우스 1.05배 · options 를 받는 묶음)를 대신한다.
 *
 *   ColorSwatchGroup   묶음(radiogroup · 5 × 2). value · defaultValue(ChartColor 또는 "current" — 지금 색 칸, null 이면 고른 칸 없음) ·
 *                      onValueChange(value) · currentColor(팔레트 밖 저장 색 hex — 주면 "지금 색" 칸) · autoColor(색 없는 항목에 차트가 줄
 *                      ChartColor — 주면 "자동" 칸) · disabled · aria-label(Field 밖에서만). Field 안이면 라벨이 묶음 이름, 설명 · 오류가
 *                      설명이 되고(useFieldGroup) Field 의 막힘 · 오류 · 필수를 받는다(useFieldGroupState). 칸 이름 · 차례 · 2차원 화살표는 스스로
 *   firstUnusedColor(used)   v110 배정 순서(파랑 → 초록 → 주황 → 보라 → 분홍 → 남색 → 빨강 → 노랑 → 갈색)에서 used 에 없는 첫 색.
 *                      아홉 색을 다 쓰면 파랑부터, 회색은 주지 않는다(차트의 "기타" 전용) — 새 항목은 늘 빨강으로 시작하지 않는다
 *   COLOR_NAMES        색 이름 — { red: "빨강", … } · COLOR_SWATCH_ORDER — 색상환 차례(빨강 → … → 갈색 → 회색)
 *
 * 칸: 원 40(누르는 44 — ::before) · 5개씩 두 줄 · 사이 12(폭과 상관없이 248), v110 차트 색(라이트 700 · 다크 800-dark)으로 꽉 채운다 —
 *   옅게 섞은 칸 · v111 옅은 바탕 칸은 쓰지 않는다. 칸의 이름은 색 이름("빨강") — "색상 N" · hex 를 이름으로 두지 않는다. 보조 기술이
 *   읽고, 마우스를 올리거나 키보드 초점이 오면 같은 이름의 툴팁(porest Tooltip — 네이티브 title 은 쓰지 않는다, Icon Picker 칸과 같다)이
 *   뜬다 — 색으로 가리기 어려운 사람도 이름을 본다. 지금 색 칸은 이름이 아래 글로 보이므로 툴팁을 두지 않는다. 호버는 모양이 바뀌지
 *   않는다(커서만).
 * 고름: 칸 바깥 2 띄운 2px 고리(stroke-neutral-contrast — Select Box 의 고른 테두리와 같은 색, outline) + 가운데 체크 16 · 선 2.5
 *   (fg-neutral-inverted — 라이트 흰 · 다크 짙은 글자. 다크 800-dark 칸 위 흰 체크는 읽히지 않는다). 키보드 포커스 링은 고리 바깥
 *   (띄움 6 · 2px — ::after). 누르면 칸 2px 거리 축소(40 → 0.95, 모션 줄이기면 하지 않는다).
 * 지금 색 · 자동(14B): 고치는 항목의 색이 팔레트 밖(가져오기의 #9E9E9E)이면 "지금 색" 칸에 그 색을 그대로(두 모드 같은 값 — 체크는
 *   fg-neutral · fg-neutral-inverted 가운데 그 색 위 대비가 큰 쪽, 모드 · 브랜드가 바뀌면 다시 정한다), 색이 없으면 "자동" 칸에 차트가 줄 색을 점선 원(2px
 *   stroke-neutral-solid)으로 격자 앞에 둔다 — 세로 선(1px stroke-neutral-weak, 사이 16)으로 가르고 칸 아래 6 에 같은 이름 글(12 / 16 ·
 *   fg-neutral-subtle — 덧붙인 이름표, 2026-10-16 글자 역할 D5). 그 칸을 고르면(처음에 골라져 있다) 값은 "current" — 저장 값을 그대로 둔다. 몰래 빨강으로 바꾸지 않는다.
 *   칸 · 선 · 격자의 폭은 321(40 + 16 + 1 + 16 + 248)이다. 놓인 자리가 그보다 좁으면(360 폰 본문 312) 지금 색 칸을 격자 위 줄에 두고
 *   선을 가로 1px(격자 폭)로 가른다 — 사이는 그대로 16. 넓으면(390 폰 342 · 대화상자) 옆으로 둔다. 묶음이 놓인 자리의 폭으로
 *   가르므로(@container) 묶음은 그 폭을 다 쓴다 — 폭을 내용으로 정하는 자리(팝오버)에서는 321 로 잰다.
 * 키보드(radiogroup): 묶음에 Tab 하나(고른 칸, 없으면 첫 칸). ← → 는 차례대로 옮기며 고른다(줄 끝에서 다음 줄로, 끝에서 처음으로 —
 *   지금 색 칸은 차례의 맨 앞, RTL 은 반대), ↑ ↓ 는 위아래 줄의 같은 칸(두 줄이라 오간다 — 지금 색 칸에서는 위 줄에 있어도 그대로),
 *   Home · End · PageUp · PageDown 은 받지 않는다(ignoreRadioJumpKeys — 하나 고르기 묶음은 화살표만, 사용자 결정 2026-10-17 — 03-E 결정 3 후속).
 *   Space 는 초점의 칸을 고르고, Enter 는 폼을 제출한다(진짜 radio 와 같다 — Radio 묶음과 같은 규칙).
 * 막힘: 색은 그대로 두고 누르기만 막는다(진짜 disabled — Tab 에서 빠진다). 고른 칸의 고리는 stroke-neutral-solid 로 남긴다.
 */

/** 색상환 차례 — 격자의 차례(5 × 2) */
export const COLOR_SWATCH_ORDER: readonly ChartColor[] = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "pink", "brown", "gray"];

/** 색 이름 — 칸의 이름(라디오) */
export const COLOR_NAMES: Readonly<Record<ChartColor, string>> = {
  red: "빨강",
  orange: "주황",
  yellow: "노랑",
  green: "초록",
  blue: "파랑",
  indigo: "남색",
  violet: "보라",
  pink: "분홍",
  brown: "갈색",
  gray: "회색",
};

// v110 배정 순서 — chart.tsx 의 CHART_ORDER 와 같다(회색은 "기타" 전용이라 없다)
const ASSIGN_ORDER: readonly ChartColor[] = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown"];

/** 같은 목록이 아직 쓰지 않은 첫 색(v110 배정 순서) — 아홉 색을 다 쓰면 파랑, 회색은 주지 않는다 */
export function firstUnusedColor(used: Iterable<ChartColor | null | undefined>): ChartColor {
  const taken = new Set<ChartColor | null | undefined>(used);
  return ASSIGN_ORDER.find((color) => !taken.has(color)) ?? "blue";
}

// Tailwind 는 소스의 글자 그대로를 읽으므로 열을 다 적는다
const SWATCH_BG: Record<ChartColor, string> = {
  red: "bg-chart-red",
  orange: "bg-chart-orange",
  yellow: "bg-chart-yellow",
  green: "bg-chart-green",
  blue: "bg-chart-blue",
  indigo: "bg-chart-indigo",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};

const COLUMNS = 5;

// 칸 — 원 40 · 누르는 44. 고른 고리는 바깥 2 띄운 2px outline, 키보드 포커스 링은 그 바깥 6 에 ::after 로(고리와 겹치지 않게)
const SWATCH = [
  // 칸 40 은 px(-static) — 글자 크기 설정을 따르지 않는다(색이 곧 값, 열 · 간격 · 격자 폭 px 와 맞춘다 — 사용자 결정 2026-10-17, 03-B 결정 5 A)
  "relative block size-[40px] shrink-0 cursor-pointer rounded-full border-0 p-0",
  "before:absolute before:-inset-0.5 before:rounded-full before:content-['']",
  "outline-offset-2 aria-checked:outline-2 aria-checked:outline-solid aria-checked:outline-stroke-neutral-contrast",
  "disabled:aria-checked:outline-stroke-neutral-solid not-aria-checked:focus-visible:outline-none",
  "after:pointer-events-none after:absolute after:-inset-1.5 after:rounded-full after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:outline-solid focus-visible:after:outline-stroke-focus-ring",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:40] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:[scale:1]",
].join(" ");

// 체크 16 · 선 2.5 — 고른 칸 가운데
const CHECK = "pointer-events-none absolute inset-0 flex items-center justify-center [&_svg]:size-4";

// 지금 색 칸이 있으면 묶음이 놓인 자리의 폭으로 가른다 — 321(칸 40 + 16 + 선 1 + 16 + 격자 248, color-swatch.yaml divider.stackBelow)
// 보다 좁으면 지금 색 칸 · 선 · 격자를 세로로. 폭을 내용으로 정하는 자리(팝오버 · fit-content)에서는 321 로 잰다(contain-intrinsic)
const STACK_CONTAINER = "@container w-full min-w-0 [contain-intrinsic-inline-size:321px]";
// 선 — 세로로 쌓이면 가로 1px(격자 폭), 옆으로 두면 세로 1px(격자 높이). 사이는 늘 16
const DIVIDER = "h-px shrink-0 self-stretch bg-stroke-neutral-weak @min-[321px]:h-auto @min-[321px]:w-px";

type Rgb = [number, number, number];
const parseRgb = (text: string): Rgb | null => {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(text);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};
const luminance = ([r, g, b]: Rgb) => {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrastOf = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

type CheckTone = "neutral" | "inverted";
const CHECK_COLOR: Record<CheckTone, string> = { neutral: "text-fg-neutral", inverted: "text-fg-neutral-inverted" };

// 지금 색 칸의 체크 — fg-neutral · fg-neutral-inverted 가운데 그 색 위 대비가 큰 쪽(두 모드 모두 하나는 짙고 하나는 밝다 —
// 라이트 4.06 · 다크 3.67 이상). 저장 색은 모드를 따르지 않으므로 모드 · 브랜드가 바뀌면(문서의 class · data-theme · 색 모드) 다시 정한다
function useCheckTone(rootRef: React.RefObject<HTMLElement | null>, color: string | undefined): CheckTone {
  const [tone, setTone] = React.useState<CheckTone>("inverted");
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !color) return;
    const compute = () => {
      const probe = root.ownerDocument.createElement("span");
      probe.style.display = "none";
      root.appendChild(probe);
      const read = (value: string) => {
        probe.style.color = "";
        probe.style.color = value;
        return parseRgb(getComputedStyle(probe).color);
      };
      const bg = read(color);
      const fg = read("var(--color-fg-neutral)");
      const inverted = read("var(--color-fg-neutral-inverted)");
      probe.remove();
      if (!bg || !fg || !inverted) return;
      const next: CheckTone = contrastOf(inverted, bg) >= contrastOf(fg, bg) ? "inverted" : "neutral";
      setTone((prev) => (prev === next ? prev : next));
    };
    compute();
    const observer = new MutationObserver(compute);
    observer.observe(root.ownerDocument.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", compute);
    return () => {
      observer.disconnect();
      scheme.removeEventListener("change", compute);
    };
  }, [rootRef, color]);
  return tone;
}

export type ColorSwatchValue = ChartColor | "current";

export interface ColorSwatchGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** 고른 색(제어) — 색 이름 또는 "current"(지금 색 칸). null 이면 고른 칸 없음 */
  value?: ColorSwatchValue | null;
  /** 처음 고른 색(비제어) */
  defaultValue?: ColorSwatchValue | null;
  /** 고르면 — 같은 칸을 다시 고르면 부르지 않는다(라디오) */
  onValueChange?: (value: ColorSwatchValue) => void;
  /** 팔레트 밖 저장 색(hex — 가져오기의 #9E9E9E) — 주면 격자 앞에 "지금 색" 칸 */
  currentColor?: string;
  /** 색 없는 항목에 차트가 줄 색 — 주면 격자 앞에 "자동" 칸(점선 원). currentColor 가 있으면 그쪽 */
  autoColor?: ChartColor;
  /** 막힘 — 색은 그대로, 누르기만 막는다. Field 의 disabled 도 받는다 */
  disabled?: boolean;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const ColorSwatchGroup = React.forwardRef<HTMLDivElement, ColorSwatchGroupProps>(
  ({ value: valueProp, defaultValue = null, onValueChange, currentColor, autoColor, disabled: disabledProp, className, onKeyDown, onKeyDownCapture, ...props }, ref) => {
    const field = useFieldGroupState();
    const labelling = useFieldGroup(props);
    const disabled = disabledProp ?? field.disabled;
    const rootRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const [inner, setInner] = React.useState<ColorSwatchValue | null>(defaultValue);
    const controlled = valueProp !== undefined;
    const value = controlled ? valueProp : inner;
    const current = currentColor ? "custom" : autoColor ? "auto" : null;
    const checkTone = useCheckTone(rootRef, current === "custom" ? currentColor : undefined);

    // 차례 — 지금 색 칸이 맨 앞, 그 뒤 색상환 10
    const order: ColorSwatchValue[] = current ? ["current", ...COLOR_SWATCH_ORDER] : [...COLOR_SWATCH_ORDER];
    const offset = current ? 1 : 0;
    const selectedIndex = value == null ? -1 : order.indexOf(value);
    const tabbable = selectedIndex >= 0 ? selectedIndex : 0;

    const select = (next: ColorSwatchValue) => {
      if (next === value) return;
      if (!controlled) setInner(next);
      onValueChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      const i = itemRefs.current.findIndex((el) => el === e.target);
      if (i < 0) return;
      const n = order.length;
      const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
      let j: number | null = null;
      switch (e.key) {
        case "ArrowRight":
          j = (i + (rtl ? n - 1 : 1)) % n;
          break;
        case "ArrowLeft":
          j = (i + (rtl ? 1 : n - 1)) % n;
          break;
        case "ArrowDown":
        case "ArrowUp": {
          // 위아래 줄의 같은 칸 — 지금 색 칸은 줄 밖이라 그대로
          if (i < offset) return;
          const g = i - offset;
          const rows = Math.ceil(COLOR_SWATCH_ORDER.length / COLUMNS);
          const row = (Math.floor(g / COLUMNS) + (e.key === "ArrowDown" ? 1 : rows - 1)) % rows;
          j = offset + Math.min(row * COLUMNS + (g % COLUMNS), COLOR_SWATCH_ORDER.length - 1);
          break;
        }
        case "Enter":
          // 진짜 radio 처럼 폼을 제출한다 — 고르지 않는다(button 의 Enter 누르기를 막는다)
          e.preventDefault();
          submitImplicitly(e.target as HTMLButtonElement);
          return;
        default:
          return;
      }
      e.preventDefault();
      const next = order[j];
      if (next === undefined) return;
      itemRefs.current[j]?.focus();
      select(next);
    };

    const item = (v: ColorSwatchValue, i: number) => {
      const checked = value === v;
      const isCurrent = v === "current";
      const name = isCurrent ? (current === "custom" ? "지금 색" : "자동") : COLOR_NAMES[v];
      const look = isCurrent
        ? current === "custom"
          ? ""
          : cn(autoColor && SWATCH_BG[autoColor], "border-2 border-dashed border-stroke-neutral-solid")
        : SWATCH_BG[v];
      const checkColor = isCurrent && current === "custom" ? CHECK_COLOR[checkTone] : "text-fg-neutral-inverted";
      const swatch = (
        <button
          key={v}
          ref={(node) => {
            itemRefs.current[i] = node;
          }}
          type="button"
          role="radio"
          aria-checked={checked}
          aria-label={name}
          tabIndex={i === tabbable ? 0 : -1}
          disabled={disabled}
          data-slot={isCurrent ? "color-swatch-current" : "color-swatch"}
          data-color={isCurrent ? (current === "custom" ? currentColor : autoColor) : v}
          className={cn(SWATCH, look)}
          style={isCurrent && current === "custom" ? { background: currentColor } : undefined}
          onClick={() => select(v)}
        >
          {checked && (
            <span aria-hidden data-slot="color-swatch-check" className={cn(CHECK, checkColor)}>
              <Check strokeWidth={2.5} />
            </span>
          )}
        </button>
      );
      // 지금 색 칸은 이름이 아래 글로 보인다 — 툴팁 없이
      if (isCurrent) return swatch;
      return (
        <Tooltip key={v}>
          <TooltipTrigger asChild>{swatch}</TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      );
    };

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        role="radiogroup"
        data-slot="color-swatch-group"
        data-disabled={disabled || undefined}
        className={cn(current && STACK_CONTAINER, className)}
        {...(disabled ? { "aria-disabled": true } : {})}
        {...(field.invalid ? { "aria-invalid": true } : {})}
        {...(field.required ? { "aria-required": true } : {})}
        {...labelling}
        onKeyDown={handleKeyDown}
        onKeyDownCapture={ignoreRadioJumpKeys(onKeyDownCapture)}
      >
        <div data-slot="color-swatch-layout" className={cn("flex w-fit items-start gap-x4", current && "flex-col @min-[321px]:flex-row")}>
          {current && (
            <>
              <div data-slot="color-swatch-current-column" className="flex shrink-0 flex-col items-center gap-[6px]">
                {item("current", 0)}
                <span aria-hidden data-slot="color-swatch-current-label" className="whitespace-nowrap font-sans text-t2 text-fg-neutral-subtle">
                  {current === "custom" ? "지금 색" : "자동"}
                </span>
              </div>
              <span aria-hidden data-slot="color-swatch-divider" className={DIVIDER} />
            </>
          )}
          <div data-slot="color-swatch-grid" className="grid w-[248px] shrink-0 grid-cols-[repeat(5,40px)] gap-x3">
            {COLOR_SWATCH_ORDER.map((color, k) => item(color, k + offset))}
          </div>
        </div>
      </div>
    );
  },
);
ColorSwatchGroup.displayName = "ColorSwatchGroup";

export { ColorSwatchGroup };
