import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ignoreRadioJumpKeys } from "@/components/ui/radio-group";

/*
 * Porest Segmented Control — 구조는 SEED Segmented Control(2026-10-02). 수치 원본은 specs/components/segmented-control.yaml.
 *
 *   SegmentedControl       트랙 — 라디오 묶음(role=radiogroup). 같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게
 *                          보는 자리에, 그 내용 바로 위에 하나만 둔다. 이름(aria-label · aria-labelledby)과 value(또는
 *                          defaultValue)를 준다 — 없으면 개발 중에 경고한다(칸이 2 ~ 4개가 아닐 때도)
 *   SegmentedControlItem   칸 — 라디오(role=radio · aria-checked). value · disabled · notification
 *
 * 크기 · 변형이 하나다. 트랙은 놓인 자리 폭을 채우는 알약(안쪽 4 · 투명한 bg-neutral-weak-alpha — 회색 바닥 위에서도 보인다, v120)이고 칸이 그 폭을 칸 수로 똑같이 나눈다
 * (최소 폭 없음 — 폰 콘텐츠 폭 312 에도 4개가 들어간다). 넓은 화면에서는 놓는 자리를 좁힌다.
 * 칸은 34 이상 · 좌우 12 · 위아래 6 · 알약 모서리. 글은 t5 16 · 700(고르든 안 고르든) · 가운데이고, 단어 단위로 줄을 바꾼다
 * (v114 — keep-all + break-word). 글이 길어 여러 줄이 되면 모든 칸이 가장 높은 칸에 맞춘다(트랙의 줄 높이).
 * 고른 알약은 트랙에 하나 — 칸 뒤에 깔리고 폭 (트랙 − 8) ÷ 칸 수, 고른 칸 번호만큼 옆으로 옮겨 200ms 에 미끄러진다
 * (motion-duration-d4 · motion-ease-easing — 200ms 이하는 마이크로 모션이라 모션 줄이기에도 그대로다). 바탕 bg-layer-default
 * + 안쪽 1px stroke-neutral-contrast(짙은 테두리 — SEED 의 옅은 1px 은 트랙과 1.14:1 이라 3:1 에 못 미친다, 사용자 결정).
 * 고른 칸이 없으면 알약을 숨긴다.
 *
 * 상태(바탕 · 글자 · 테두리는 color-transition 150ms):
 *   안 고른 칸   글 fg-neutral-subtle(다크는 fg-neutral-muted — 투명 트랙 위 4.5:1, 2026-10-17). 올리거나(마우스 있는 기기) 누르면 bg-neutral-weak-pressed + 안쪽 1px stroke-neutral-weak,
 *                글 fg-neutral-muted(누름 바탕 위 fg-neutral-subtle 은 다크 3.91:1)
 *   고른 칸      글 fg-neutral. 올리거나 누르면 칸에 bg-layer-default-pressed + 짙은 1px 를 칠해 알약을 덮는다
 *   막힘         글 fg-disabled · not-allowed · 누름 바탕 · 축소 없음(흐리게 하지 않는다 — v106). 고른 채 막히면 칸에
 *                bg-disabled + 안쪽 1px stroke-neutral-solid 를 칠해 무엇을 골랐는지 남긴다
 * 누르면 칸 바탕은 그대로 두고 안의 글만 2px 거리로 준다(SEED scaleScope: content · v104) — 배율 = (기준 − 2) ÷ 기준,
 * 기준 = max(칸 높이, 칸 폭 ÷ 4, 24) 를 누르는 순간(포인터 · Space) 칸을 재서 --press-basis 로 넘긴다. 호버는 축소가 없고,
 * 모션 줄이기면 축소하지 않는다. 포커스 링은 키보드 포커스에만 칸 바깥 2px · 띄움 2px(알약을 따라 둥글다).
 * 알림 점(notification)은 6px fg-brand(브랜드 글자색 — bg-brand-solid 는 다크 트랙에서 안 보인다) — 글 끝에서 2 · 글 위쪽에
 * 띄워 칸 폭을 바꾸지 않는다. 보조 기술에는 "새 소식" 을 덧붙인다(점만으로 알리지 않는다). 고른 칸에는 점도 "새 소식" 도
 * 없다(고르면 사라진다).
 *
 * 키보드는 라디오 묶음 그대로다(Radix RadioGroup) — Tab 은 고른 칸 하나에만 서고, ← → ↑ ↓ 로 옮기면 바로 고른다(끝에서
 * 처음으로 돈다). 막힌 칸은 건너뛴다. 고른 칸을 다시 눌러도 그대로다. disabled 를 트랙에 주면 칸이 모두 막힌다.
 * 고른 칸만 tabIndex 0 이다 — Radix 의 로빙 위치는 마지막으로 포커스한 칸이라, 값이 밖에서 바뀌면 Shift+Tab 이 옛 칸에 선다.
 * 값은 이 컴포넌트가 한 번 더 쥔다(알약이 고른 칸을 따라가야 한다) — 쓰는 쪽은 value · onValueChange 또는 defaultValue.
 * 저장할 폼 값이 아니므로(폼 값은 Chip · Select) name · required 를 두지 않는다.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로 — 칸을 재서 글이 그만큼 준다.
// Space 를 누르는 동안에도 :active 가 걸리므로 Space 에서도 잰다(라디오는 Enter 로 고르지 않는다)
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

const isPressKey = (e: React.KeyboardEvent) => e.key === " " || e.key === "Enter";

// 트랙 — 놓인 자리 폭을 채우는 알약. 칸이 칸 수로 똑같이 나눈다(최소 폭 없음) · 모든 칸이 가장 높은 칸에 맞춘다
const segmentedControlVariants = cva(
  "relative grid w-full grid-flow-col auto-cols-fr rounded-full bg-bg-neutral-weak-alpha p-x1 font-sans",
);

// 고른 알약 — 칸 뒤(트랙의 첫 자식 · 칸은 relative 라 그 위에 그려진다). 폭 (트랙 − 8) ÷ 칸 수, 고른 칸 번호만큼 옮긴다.
// --segmented-count · --segmented-index 는 그린 칸을 세어 넣는다
const SEGMENTED_INDICATOR = [
  "pointer-events-none absolute inset-y-x1 left-x1 rounded-full bg-bg-layer-default shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
  "w-[calc((100%_-_2_*_var(--spacing-x1))_/_var(--segmented-count,1))] [transform:translateX(calc(var(--segmented-index,0)_*_100%))]",
  "[transition:transform_var(--motion-duration-d4)_var(--motion-ease-easing)]",
].join(" ");

// 칸 — 바탕 · 글자 · 테두리는 color-transition. 호버는 마우스 있는 기기에서만(누름과 같은 바탕, 축소 없음).
// 막힌 칸은 호버 · 누름이 없다(enabled 에서만 칠한다)
const segmentedControlItemVariants = cva(
  [
    "group/segmented-item relative flex min-h-[34px] min-w-0 cursor-pointer select-none items-center justify-center rounded-full px-x3 py-x1_5 font-sans text-t5-static font-bold text-fg-neutral-subtle dark:text-fg-neutral-muted [--press-basis:34]",
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
    // 안 고른 칸 — 올리거나 누르면 바탕 + 안쪽 1px + 한 단계 짙은 글
    "data-[state=unchecked]:enabled:hover:bg-bg-neutral-weak-pressed data-[state=unchecked]:enabled:hover:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] data-[state=unchecked]:enabled:hover:text-fg-neutral-muted",
    "data-[state=unchecked]:enabled:active:bg-bg-neutral-weak-pressed data-[state=unchecked]:enabled:active:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] data-[state=unchecked]:enabled:active:text-fg-neutral-muted",
    // 고른 칸 — 글자색만 바뀐다. 올리거나 누르면 칸에 칠해 알약을 덮는다(짙은 테두리는 그대로)
    "enabled:data-[state=checked]:text-fg-neutral",
    "data-[state=checked]:enabled:hover:bg-bg-layer-default-pressed data-[state=checked]:enabled:hover:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
    "data-[state=checked]:enabled:active:bg-bg-layer-default-pressed data-[state=checked]:enabled:active:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-contrast)]",
    // 막힘 — 흐리게 하지 않는다. 고른 채 막히면 칸에 회색 바탕 + 짙은 1px 를 칠해 알약을 덮는다
    "disabled:cursor-not-allowed disabled:text-fg-disabled",
    "data-[state=checked]:disabled:bg-bg-disabled data-[state=checked]:disabled:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-solid)]",
  ].join(" "),
);

// 글 — 가운데 · 단어 단위 줄바꿈(v114). 누르는 동안 글만 준다(칸이 잰 --press-basis). 막힌 칸은 줄지 않는다
const SEGMENTED_LABEL = [
  "relative min-w-0 text-center break-keep [overflow-wrap:break-word]",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-active/segmented-item:[scale:calc(1-2/var(--press-basis))] group-disabled/segmented-item:[scale:1] motion-reduce:group-active/segmented-item:[scale:1]",
].join(" ");

// 알림 점 — 브랜드 글자색, 글 끝에서 2 · 글 위쪽. 띄워 두므로 칸 폭이 바뀌지 않는다. 고른 칸에는 그리지 않는다
const SEGMENTED_NOTIFICATION = "pointer-events-none absolute left-[calc(100%_+_2px)] top-0 size-1.5 rounded-full bg-fg-brand";

// 고른 값 — 칸이 고른 칸인지(tabIndex) 안다
const SegmentedValueContext = React.createContext<string | null>(null);

export interface SegmentedControlProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, "orientation" | "name" | "required"> {}

// 트랙(role=radiogroup) — ← → ↑ ↓ 모두 옮기며 고른다(orientation 을 두지 않는다). Home · End 는 받지 않는다(Radio 와 같다)
const SegmentedControl = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, SegmentedControlProps>(
  ({ className, children, value: valueProp, defaultValue, onValueChange, onKeyDownCapture, ...props }, ref) => {
    const own = React.useRef<HTMLDivElement>(null);
    const pill = React.useRef<HTMLSpanElement>(null);
    const [inner, setInner] = React.useState(defaultValue ?? "");
    const controlled = valueProp !== undefined;
    const value = controlled ? valueProp : inner;
    const setValue = (next: string) => {
      if (!controlled) setInner(next);
      onValueChange?.(next);
    };
    const warnedCount = React.useRef(false);

    // 그린 칸을 세어 알약 자리를 넣는다(칠하기 전에)
    useIsoLayoutEffect(() => {
      const root = own.current;
      const bar = pill.current;
      if (!root || !bar) return;
      const items = Array.from(root.querySelectorAll(":scope > [data-slot=segmented-control-item]"));
      const index = items.findIndex((el) => el.getAttribute("data-state") === "checked");
      bar.hidden = index < 0;
      bar.style.setProperty("--segmented-count", String(Math.max(items.length, 1)));
      bar.style.setProperty("--segmented-index", String(Math.max(index, 0)));
      if (import.meta.env.DEV && !warnedCount.current && (items.length < 2 || items.length > 4)) {
        warnedCount.current = true;
        console.warn(`[SegmentedControl] 칸이 ${items.length}개다 — 2 ~ 4개만 둔다(5개 이상은 Chip 의 하나 고르기 · Select).`, root);
      }
    });

    const label = props["aria-label"];
    const labelledBy = props["aria-labelledby"];
    React.useEffect(() => {
      if (import.meta.env.DEV && !label?.trim() && !labelledBy?.trim()) {
        console.warn('[SegmentedControl] 이름이 없다 — aria-label(또는 aria-labelledby)을 준다(예: "할 일 보기").', own.current);
      }
    }, [label, labelledBy]);
    const noValue = valueProp === undefined && defaultValue === undefined;
    React.useEffect(() => {
      if (import.meta.env.DEV && noValue) {
        console.warn("[SegmentedControl] value 도 defaultValue 도 없다 — 늘 하나를 골라 둔다.", own.current);
      }
    }, [noValue]);

    return (
      <SegmentedValueContext.Provider value={value}>
        <RadioGroupPrimitive.Root
          ref={mergeRefs(ref, own)}
          data-slot="segmented-control"
          className={cn(segmentedControlVariants(), className)}
          {...props}
          value={value}
          onValueChange={setValue}
          onKeyDownCapture={ignoreRadioJumpKeys(onKeyDownCapture)}
        >
          <span ref={pill} aria-hidden data-slot="segmented-control-indicator" className={SEGMENTED_INDICATOR} />
          {children}
        </RadioGroupPrimitive.Root>
      </SegmentedValueContext.Provider>
    );
  },
);
SegmentedControl.displayName = "SegmentedControl";

export interface SegmentedControlItemProps extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "asChild"> {
  /** 새 소식 — 알림 점 + 보조 기술에 "새 소식"(고른 칸에는 그리지 않는다). 내용을 보면 끈다 */
  notification?: boolean;
}

// 칸(role=radio) — 글은 짧게("이름순" · "최근 사용"). SegmentedControl 안에 바로 둔다
const SegmentedControlItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, SegmentedControlItemProps>(
  ({ className, value, notification = false, children, onPointerDown, onKeyDownCapture, ...props }, ref) => {
    const checked = React.useContext(SegmentedValueContext) === value;
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        value={value}
        data-slot="segmented-control-item"
        data-notification={notification ? "" : undefined}
        tabIndex={checked ? 0 : -1}
        className={cn(segmentedControlItemVariants(), className)}
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
        <span data-slot="segmented-control-label" className={SEGMENTED_LABEL}>
          {children}
          {notification && !checked && <span aria-hidden data-slot="segmented-control-notification" className={SEGMENTED_NOTIFICATION} />}
        </span>
        {notification && !checked && <span className="sr-only">새 소식</span>}
      </RadioGroupPrimitive.Item>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";

export { SegmentedControl, SegmentedControlItem, segmentedControlVariants, segmentedControlItemVariants };
