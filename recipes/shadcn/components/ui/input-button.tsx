import * as React from "react";
import { CircleX } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useField, useFieldControl } from "@/components/ui/field";

/*
 * Groo Input Button — 구조는 SEED Input Button(React 이름 Field Button, 2026-10-01). 수치 원본은 specs/components/input-button.yaml.
 *
 *   InputButton             입력칸 모양의 버튼 — 누르면 고르는 자리(달력 · 시각 휠 · 아이콘 격자 · 검색 시트)를 연다
 *   useInputButtonSurface   여는 자리 — 1280 미만 "sheet"(아래 시트) · 이상 "popover"(칸 아래 팝오버). 칸 크기가 바뀌는 폭과 같다
 *   inputButtonVariants · inputButtonSurfaceVariants   상자의 크기 · 겉모습 — Select 의 트리거도 같은 상자를 쓴다
 *
 * 긴 목록의 검색 시트 · 팝오버는 Searchable List(searchable-list.tsx)로 채운다 — 위 검색칸은 Input 의 밑줄형(SearchableListInput 이
 * variant="underline" · 앞 돋보기 · 지우기를 스스로 건다 — 시트에 입력이 하나뿐인 목록 위 검색, 사용자 결정 2026-10-08 17A), 아래는 List 줄 +
 * 오른쪽 라디오, 고르면 닫는다("완료" 없음). 상자형 52 검색칸을 시트 위에 두지 않는다.
 *
 * 값은 쓰는 쪽이 가진다 — 칸은 value(비면 placeholder)를 보이고 누르면 onClick 을 부를 뿐이다. 라벨 · 설명 · 오류는
 * Field 가 둘레에서 그린다 — Field 안에 두면 id · aria 를 받는다.
 * 상자(div)는 크기 · 여백 · 모서리만 갖고, 진짜 버튼은 상자를 덮는 배경 층이다(SEED) — 테두리(안쪽 1px) · 바탕 ·
 * 키보드 포커스 링 · 오류 2px(::after)를 그리고, 상자 어디를 눌러도(붙이개 · 여백 포함) 눌린다. 값 · 붙이개는 그 위
 * 콘텐츠 층에 얹고 누름을 지나 보낸다(pointer-events: none). 지우기 버튼만 그 위에서 따로 눌린다 — 버튼 안에 버튼을 두지 않는다.
 *
 * 누르면 바탕이 bg-layer-default-pressed 로 바뀌고 콘텐츠 층만 2px 거리로 준다(SEED scaleScope: content · v104) —
 * 배율 = (기준 − 2) ÷ 기준, 기준 = max(높이, 폭 ÷ 4, 24). Button · List 처럼 누르는 순간(포인터 · Enter · Space) 상자를 재서
 * --press-basis 로 넘긴다. 마우스는 호버에 같은 바탕(지우기 버튼 위에서도 상자의 호버를 잇는다). 모션 줄이기면 축소하지 않는다.
 * 포커스 링은 키보드 포커스에만(버튼이라 마우스 · 터치로 눌러서는 없다). 오류의 2px 는 1px 위에 덧그리고 눌러도 그대로다.
 * 비활성은 버튼을 막는다(disabled). 읽기 전용은 포커스는 되고(aria-disabled) 눌러도 · Enter · Space 로도 onClick 을 부르지
 * 않는다. 둘 다 회색 바탕(bg-disabled)으로 가르고 흐리게 하지 않는다(v106) — 읽기 전용의 값은 진한 글자 그대로다.
 *
 * 이름은 Field 의 라벨 + 고른 값(aria-labelledby — "날짜 10월 1일 (목)"), 비면 라벨 + placeholder. aria-label 을 주면
 * 라벨 대신 그 글 + 값이고, aria-labelledby 를 주면 그대로 쓴다. 붙이개 글(prefix · suffix)은 설명으로 읽힌다(단위가 화면
 * 읽기 프로그램에도 들리게 — Input 과 같다). 필수는 설명으로 "필수" 를 읽힌다 — aria-required 는 버튼에 쓸 수 없는 속성이다
 * (화면의 필수 점은 Field 가 그린다).
 * 지우기(onClear)는 값이 있고 막히지 않았을 때만 — 누르면 onClear 만 부르고(onClick 은 부르지 않는다 — 열지 않는다)
 * 칸에 포커스를 둔다. 누름도 지우기 버튼만 준다(상자는 눌리지 않는다). Tab 순서에 없다.
 *
 * 크기: large 52 · medium 40(1280 이상 데스크톱 웹만) · responsive(웹 기본 — 1280 미만 large · 이상 medium). 앱은 늘 large.
 * className · style 은 버튼에, rootClassName · rootRef 는 상자(div)에 간다 — 폭은 rootClassName 으로 정한다.
 */

// 상자의 크기 — 높이 · 모서리 · 좌우 여백 · 사이 · 글자, --input-button-icon(앞 · 뒤 아이콘) · --input-button-clear(지우기)
const inputButtonVariants = cva("font-sans", {
  variants: {
    size: {
      large: "min-h-13 gap-x2_5 rounded-r3 px-x4 text-t5 [--input-button-icon:20px] [--input-button-clear:22px]",
      medium: "min-h-10 gap-x2 rounded-r2 px-x3_5 text-t4 [--input-button-icon:16px] [--input-button-clear:18px]",
      responsive: [
        "min-h-13 gap-x2_5 rounded-r3 px-x4 text-t5 [--input-button-icon:20px] [--input-button-clear:22px]",
        "lg:min-h-10 lg:gap-x2 lg:rounded-r2 lg:px-x3_5 lg:text-t4 lg:[--input-button-icon:16px] lg:[--input-button-clear:18px]",
      ].join(" "),
    },
  },
  defaultVariants: { size: "responsive" },
});

// 상자의 겉모습 — 버튼에 단다. 테두리는 안쪽 1px(inset shadow), 오류 2px 는 ::after 로 덧그려 내용이 밀리지 않고 색만 100ms 로 나타난다
const inputButtonSurfaceVariants = cva(
  [
    "bg-transparent shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
    "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
    "after:[transition:border-color_var(--motion-duration-d2)_var(--motion-ease-easing)]",
  ].join(" "),
  {
    variants: {
      state: {
        enabled: "cursor-pointer active:bg-bg-layer-default-pressed",
        disabled: "cursor-not-allowed bg-bg-disabled",
        readonly: "cursor-default bg-bg-disabled",
      },
      // 마우스 호버의 바탕 — 칸 자신(self · Select 트리거) 또는 상자(group · 지우기 버튼 위에서도 잇는다)
      hover: { self: "", group: "" },
      invalid: { true: "after:border-stroke-critical-solid", false: "" },
    },
    compoundVariants: [
      { state: "enabled", hover: "self", className: "hover:bg-bg-layer-default-pressed" },
      { state: "enabled", hover: "group", className: "group-hover/input-button:bg-bg-layer-default-pressed" },
    ],
    defaultVariants: { state: "enabled", hover: "self", invalid: false },
  },
);

// 콘텐츠 층 — 앞 아이콘 · 앞 글 · 값 · 지우기 · 뒤 글 · 뒤 아이콘. 누름을 지나 보내고, 버튼(peer)을 누르는 동안만 준다
const CONTENT =
  "relative flex min-w-0 flex-1 select-none items-center gap-[inherit] pointer-events-none [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const CONTENT_PRESS = "peer-active/input-button:[scale:calc(1-2/var(--press-basis))] motion-reduce:peer-active/input-button:[scale:1]";

// 지우기 — 콘텐츠 층 위에서 따로 눌린다. 보이는 22 · 18, 누르는 영역은 ::before 로 24. 누르면 자기만 준다(기준 24 — SEED scaleScope: self)
const CLEAR = [
  "pointer-events-auto relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "[&>svg]:size-[var(--input-button-clear)]",
  "before:absolute before:left-1/2 before:top-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[--press-basis:24] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
].join(" ");

const join = (...ids: (string | undefined | false | null)[]) => ids.filter(Boolean).join(" ") || undefined;

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로 — 넓은 칸도 세로 2px 만큼만 준다
function measurePress(el: HTMLElement | null) {
  el?.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

// 읽기 전용은 눌러도 · Enter · Space 로도 아무것도 열지 않는다 — onClick(감싼 Trigger 의 열기 포함)을 부르지 않는다
function swallowClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
}

export interface InputButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "prefix"> {
  /** 고른 값 — 고른 자리의 표기 그대로(날짜 · 시각 · 이름). 비면(undefined · null · "") placeholder */
  value?: React.ReactNode;
  /** 고르기 전의 글 — "{값의 종류} 선택"("날짜 선택"). 마침표 없이 */
  placeholder?: string;
  /** large 52 · medium 40(1280 이상 데스크톱 웹만) · responsive(웹 기본 — 1280 에서 바뀐다). 앱은 large */
  size?: "large" | "medium" | "responsive";
  /** 앞 글자 — 만 · https:// */
  prefix?: React.ReactNode;
  /** 앞 아이콘 — 값의 종류 · 고른 값에 딸린 아이콘(카테고리) */
  prefixIcon?: React.ReactNode;
  /** 뒤 글자 — 단위(세 · cm) */
  suffix?: React.ReactNode;
  /** 뒤 아이콘 — 누르면 무엇이 열리는지(달력 · 시계 · 아래 화살표) */
  suffixIcon?: React.ReactNode;
  /** 지우기 버튼 — 주면 값이 있고 막히지 않았을 때만 보인다. 선택 사항인 칸에 */
  onClear?: () => void;
  /** 읽기 전용 — 포커스는 되고 열리지 않는다(onClick 을 부르지 않는다) */
  readOnly?: boolean;
  /** 상자(div)의 className — className 은 버튼에 간다 */
  rootClassName?: string;
  /** 상자(div)의 ref — ref 는 버튼에 간다(팝오버의 기준 · 포커스) */
  rootRef?: React.Ref<HTMLDivElement>;
}

const InputButton = React.forwardRef<HTMLButtonElement, InputButtonProps>(
  (
    {
      value,
      placeholder,
      size = "responsive",
      prefix,
      prefixIcon,
      suffix,
      suffixIcon,
      onClear,
      readOnly: readOnlyProp,
      rootClassName,
      rootRef,
      className,
      type = "button",
      id,
      disabled: disabledProp,
      onClick,
      onPointerDown,
      onKeyDown,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      "aria-disabled": ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const field = useField();
    const control = useFieldControl({
      id,
      disabled: disabledProp,
      readOnly: readOnlyProp,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-describedby": ariaDescribedBy,
    });
    const boxRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const auto = React.useId();
    const buttonId = control.id ?? `${auto}button`;
    const valueId = `${auto}value`;
    const prefixId = prefix != null ? `${auto}prefix` : undefined;
    const required = control["aria-required"] === true || control["aria-required"] === "true";
    const requiredId = required ? `${auto}required` : undefined;
    const suffixId = suffix != null ? `${auto}suffix` : undefined;
    const disabled = !!control.disabled;
    const readOnly = !!control.readOnly;
    const invalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
    const interactive = !disabled && !readOnly;
    const hasValue = value != null && value !== false && value !== "";
    const showClear = onClear != null && hasValue && interactive;
    const iconColor = disabled ? "text-fg-disabled" : "text-fg-neutral-muted";
    const affixColor = disabled ? "text-fg-disabled" : "text-fg-neutral-subtle";
    const valueColor = disabled ? "text-fg-disabled" : hasValue ? "text-fg-neutral" : "text-fg-placeholder";
    // 이름 — 라벨(aria-label 을 주면 그 글) 다음에 값이 이어 읽힌다. 자기 id 를 가리키면 aria-label 이 그 자리에 읽힌다
    const labelledBy = ariaLabelledBy ?? join(props["aria-label"] ? buttonId : field?.labelId, valueId);

    const clear = () => {
      onClear?.();
      buttonRef.current?.focus();
    };

    return (
      <div
        ref={mergeRefs(rootRef, boxRef)}
        data-slot="input-button"
        data-size={size}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        className={cn("group/input-button relative isolate flex w-full min-w-0 items-center", inputButtonVariants({ size }), rootClassName)}
      >
        <button
          ref={mergeRefs(ref, buttonRef)}
          type={type}
          data-slot="input-button-trigger"
          className={cn(
            "peer/input-button absolute inset-0 m-0 appearance-none rounded-[inherit] border-0 p-0",
            inputButtonSurfaceVariants({ state: disabled ? "disabled" : readOnly ? "readonly" : "enabled", hover: "group", invalid }),
            className,
          )}
          {...props}
          id={buttonId}
          disabled={disabled}
          aria-disabled={readOnly || ariaDisabled || undefined}
          aria-invalid={control["aria-invalid"]}
          aria-labelledby={labelledBy}
          aria-describedby={join(requiredId, prefixId, suffixId, control["aria-describedby"])}
          onClick={readOnly ? swallowClick : onClick}
          onPointerDown={(e) => {
            measurePress(boxRef.current);
            onPointerDown?.(e);
          }}
          onKeyDown={(e) => {
            // Space 를 누르는 동안에도 :active 가 걸린다 — 키로 눌러도 잰다
            if (e.key === " " || e.key === "Enter") measurePress(boxRef.current);
            onKeyDown?.(e);
          }}
        />
        <span data-slot="input-button-content" className={cn(CONTENT, interactive && CONTENT_PRESS)}>
          {prefixIcon != null && (
            <span aria-hidden data-slot="input-button-prefix-icon" className={cn("flex shrink-0 [&>svg]:size-[var(--input-button-icon)]", iconColor)}>
              {prefixIcon}
            </span>
          )}
          {prefix != null && (
            <span id={prefixId} aria-hidden data-slot="input-button-prefix" className={cn("shrink-0", affixColor)}>
              {prefix}
            </span>
          )}
          <span
            id={valueId}
            aria-hidden
            data-slot="input-button-value"
            data-placeholder={hasValue ? undefined : ""}
            className={cn("min-w-0 flex-1 truncate text-left", valueColor)}
          >
            {hasValue ? value : placeholder}
          </span>
          {showClear && (
            <button type="button" aria-label="지우기" tabIndex={-1} data-slot="input-button-clear" onClick={clear} className={CLEAR}>
              <CircleX aria-hidden strokeWidth={2} />
            </button>
          )}
          {suffix != null && (
            <span id={suffixId} aria-hidden data-slot="input-button-suffix" className={cn("shrink-0", affixColor)}>
              {suffix}
            </span>
          )}
          {suffixIcon != null && (
            <span aria-hidden data-slot="input-button-suffix-icon" className={cn("flex shrink-0 [&>svg]:size-[var(--input-button-icon)]", iconColor)}>
              {suffixIcon}
            </span>
          )}
        </span>
        {required && (
          <span id={requiredId} className="sr-only">
            필수
          </span>
        )}
      </div>
    );
  },
);
InputButton.displayName = "InputButton";

// ── 여는 자리 ─────────────────────────────────────────────────
// 칸 크기가 바뀌는 폭(Tailwind lg = --breakpoint-lg 1280px)과 같은 식 — rem 으로 적으면 브라우저 글자 크기 설정에 따라 어긋난다
const SURFACE_QUERY = "(min-width: 1280px)";

function subscribeSurface(onChange: () => void) {
  const mql = window.matchMedia(SURFACE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** 고르는 자리를 무엇으로 열지 — 1280 미만 "sheet"(아래에서 올라오는 시트) · 이상 "popover"(칸 아래 8 에 붙는 팝오버). 서버에서는 "sheet" */
function useInputButtonSurface(): "sheet" | "popover" {
  return React.useSyncExternalStore(
    subscribeSurface,
    () => (window.matchMedia(SURFACE_QUERY).matches ? "popover" : "sheet"),
    () => "sheet",
  );
}

export { InputButton, useInputButtonSurface, inputButtonVariants, inputButtonSurfaceVariants };
