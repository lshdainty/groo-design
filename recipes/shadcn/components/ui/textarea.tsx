import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useFieldControl, useTextControl } from "@/components/ui/field";

/*
 * Groo Textarea — 구조는 SEED Textarea(Text Input 의 여러 줄, 2026-10-01). 수치 원본은 specs/components/textarea.yaml.
 *
 * 여러 줄 입력칸. 상자 · 테두리 · 상태는 Input 의 outline 과 같다 — 안쪽 1px, 포커스 · 오류 2px 는 ::after 로 덧그린다.
 * 라벨 · 설명 · 오류 · 글자 수는 Field 가 둘레에서 그린다.
 *
 * 높이(autoSize)
 *   true(기본)  3줄(large 94 · medium 82)에서 시작해 쓴 만큼 자란다. 최대 높이(max-h-*)를 주면 그 높이부터 칸 안에서 스크롤
 *   false       고정 높이 — 자리마다 높이(h-* · rows)를 정한다. 2줄(72 · 62)보다 낮게 두지 않고, 넘치면 칸 안에서 스크롤.
 *               켜 둔 채 자란 칸에서 끄면 자랄 때 넣은 인라인 높이 · overflow 를 걷는다(2026-10-08)
 * 손잡이(resize)는 두지 않는다 — 자동 높이가 대신한다.
 * 크기: large(글자 16 · 모서리 12) · medium(14 · 8, 1280 이상 데스크톱 웹만) · responsive(웹 기본). 앱은 늘 large.
 * 캐럿은 글자색(caret-fg-neutral), 고른 글은 기기 기본 하이라이트. 읽기 전용은 포커스 표시가 없다(Input 과 같다 — 2026-10-08).
 */

const textareaVariants = cva(
  [
    "relative flex w-full min-w-0 overflow-hidden bg-transparent font-sans shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
    "cursor-text data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-disabled data-[readonly]:bg-bg-disabled",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
    "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
    "[&:has(textarea:focus):not([data-invalid]):not([data-readonly])]:after:border-stroke-neutral-contrast",
    "data-[invalid]:after:border-stroke-critical-solid",
  ].join(" "),
  {
    variants: {
      size: {
        large: "rounded-r3 text-t5 [--textarea-px:var(--spacing-x4)] [--textarea-py:var(--spacing-x3_5)]",
        medium: "rounded-r2 text-t4 [--textarea-px:var(--spacing-x3_5)] [--textarea-py:var(--spacing-x3)]",
        responsive: [
          "rounded-r3 text-t5 [--textarea-px:var(--spacing-x4)] [--textarea-py:var(--spacing-x3_5)]",
          "lg:rounded-r2 lg:text-t4 lg:[--textarea-px:var(--spacing-x3_5)] lg:[--textarea-py:var(--spacing-x3)]",
        ].join(" "),
      },
    },
    defaultVariants: { size: "responsive" },
  },
);

// 입력(<textarea>)의 최소 높이 — 자동 높이는 3줄, 고정 높이는 2줄
const textareaValueVariants = cva(
  "block w-full resize-none border-0 bg-transparent px-[var(--textarea-px)] py-[var(--textarea-py)] caret-fg-neutral outline-none [font:inherit] disabled:cursor-not-allowed",
  {
    variants: {
      size: { large: "", medium: "", responsive: "" },
      autoSize: { true: "overflow-y-hidden", false: "overflow-y-auto" },
    },
    compoundVariants: [
      { autoSize: true, size: "large", className: "min-h-[5.875rem]" },
      { autoSize: true, size: "medium", className: "min-h-[5.125rem]" },
      { autoSize: true, size: "responsive", className: "min-h-[5.875rem] lg:min-h-[5.125rem]" },
      { autoSize: false, size: "large", className: "min-h-[4.5rem]" },
      { autoSize: false, size: "medium", className: "min-h-[3.875rem]" },
      { autoSize: false, size: "responsive", className: "min-h-[4.5rem] lg:min-h-[3.875rem]" },
    ],
    defaultVariants: { size: "responsive", autoSize: true },
  },
);

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** large(글자 16) · medium(14, 1280 이상 데스크톱 웹만) · responsive(웹 기본). 앱은 large */
  size?: "large" | "medium" | "responsive";
  /** 자동 높이(기본) — 3줄에서 시작해 쓴 만큼 자란다. false 면 고정 높이(2줄 이상, 넘치면 스크롤) */
  autoSize?: boolean;
  /** 상자(div)의 className — className 은 입력(<textarea>)에 간다(max-h-* · h-* 는 여기) */
  rootClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = "responsive", autoSize = true, rootClassName, className, rows, onChange, onCompositionEnd, ...props }, ref) => {
    const areaRef = React.useRef<HTMLTextAreaElement>(null);
    const control = useFieldControl(props);
    const text = useTextControl(areaRef, { onChange, onCompositionEnd });
    const disabled = !!control.disabled;
    const readOnly = !!control.readOnly;
    const invalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";

    // 자동 높이를 끄면 자랄 때 넣은 인라인 높이 · overflow 를 걷는다 — 고정 높이(rows · h-*)와 overflow-y-auto 가 다시 먹게
    useIsoLayoutEffect(() => {
      const el = areaRef.current;
      if (!el || autoSize) return;
      el.style.removeProperty("height");
      el.style.removeProperty("overflow-y");
    }, [autoSize]);

    // 자동 높이 — 내용 높이에 맞추고, 최대 높이(max-height)를 넘으면 그 높이에서 멈추고 스크롤한다
    const fit = React.useCallback(() => {
      const el = areaRef.current;
      if (!el || !autoSize) return;
      el.style.height = "auto";
      const max = parseFloat(getComputedStyle(el).maxHeight);
      const full = el.scrollHeight;
      const limit = Number.isFinite(max) ? max : Infinity;
      el.style.height = `${Math.min(full, limit)}px`;
      el.style.overflowY = full > limit ? "auto" : "hidden";
    }, [autoSize]);

    // 값이 밖에서 바뀌어도(제어 값 · reset) · 폭이 바뀌어 줄이 다시 감겨도 맞춘다
    useIsoLayoutEffect(() => {
      fit();
    });
    React.useEffect(() => {
      const el = areaRef.current;
      if (!el || !autoSize || typeof ResizeObserver === "undefined") return;
      let width = el.offsetWidth;
      const ro = new ResizeObserver(() => {
        if (el.offsetWidth === width) return;
        width = el.offsetWidth;
        fit();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [autoSize, fit]);

    return (
      <div
        data-slot="textarea"
        data-size={size}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        className={cn(textareaVariants({ size }), rootClassName)}
      >
        <textarea
          ref={mergeRefs(ref, areaRef)}
          rows={rows ?? (autoSize ? 3 : 2)}
          data-slot="textarea-value"
          className={cn(
            textareaValueVariants({ size, autoSize }),
            disabled ? "text-fg-disabled placeholder:text-fg-disabled" : "text-fg-neutral placeholder:text-fg-placeholder",
            className,
          )}
          {...props}
          {...control}
          onChange={(e) => {
            text.onChange(e);
            fit();
          }}
          onCompositionEnd={text.onCompositionEnd}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
