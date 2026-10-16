import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Porest Accordion — 구조는 SEED Accordion(rootage accordion.json · accordion-item.json, 2026-10-10). 수치 원본은 specs/components/accordion.yaml.
 * 관련 상세를 세로로 묶고 항목마다 머리(트리거)를 눌러 펼친다 — 카드 혜택 · 유의사항. 하나만 접고 펴는 자리는 Collapsible, 단계가 있는
 * 고르는 나무는 Tree View, 하위 줄을 접는 목록은 List 의 하위 줄이다. 옛 Radix 베이스 · 아래 선만 · 꺾쇠 16 · 하나만 여는 모드는 걷었다.
 *
 *   Accordion            아코디언 — variant "inline"(기본 — 연속 목록 + 들인 사이 선 24) · "separated"(항목마다 Card 면 16 · 1px · 사이 8).
 *                        values · defaultValues · onValuesChange(values) — 펼친 항목의 value 목록. 늘 여럿을 함께 연다(하나만 여는 모드는 없다).
 *                        disabled(전체) · id(모두 펼치기가 aria-controls 로 가리킨다), 나머지는 div 속성. 처음에는 모두 접힘
 *   AccordionItem        항목 — value(필수) · disabled
 *   AccordionTrigger     트리거 — title(필수) · description · prefixIcon · headingLevel(2 ~ 6, 기본 3). 머리말 안의 단추(aria-expanded ·
 *                        aria-controls)와 꺾쇠 20 을 그린다. 이름은 제목 + 설명
 *   AccordionContent     펼친 내용 — 0 / 24 / 16 · text-article-note · fg-neutral-muted · 줄바꿈 문자를 지킨다. 접혀 있으면 그리지 않는다(hidden)
 *   AccordionPlainItem   상세가 없는 항목 — title · description · prefixIcon. 단추 · 머리말 · 꺾쇠가 없고 높이 · 글 시작은 트리거와 같다
 *   AccordionHeader      시트 · 대화상자의 목록 머리 — title(건수를 붙인다) + 오른쪽 자식(모두 펼치기). 카드 안이면 CardHeader 가 이 자리다
 *   AccordionExpandAll   모두 펼치기 — controls(아코디언 id) · values · expandable(상세가 있는 항목의 value) · onValuesChange.
 *                        모두 펼쳐져 있으면 "모두 접기" — 글은 단추가 정한다(글 버튼 — SEED Text Button, 아이콘 없음). 이름은 보이는 글, aria-controls 만(aria-expanded 없음)
 *
 *   useExpandMotion      펼침 · 접힘 모션 — Collapsible · Tree View 의 하위 묶음 · List 의 하위 줄도 이것을 쓴다(모두 "Accordion 과 같다")
 *   accordionTriggerVariants · accordionTriggerContentVariants · accordionTitleVariants · accordionDescriptionVariants ·
 *   accordionChevronVariants · accordionPrefixVariants   트리거의 짜임 — Collapsible 이 같은 모양으로 쓴다
 *
 * 트리거는 두 층이다 — 바탕 층(button::before: 누름 · 호버 바탕, 줄지 않는다)과 콘텐츠 층(앞 아이콘 · 본문 · 꺾쇠). 누르거나 올리면 바탕이
 * 좌우 6 들어와 모서리 10 이 되고(SEED), 누르는 동안 콘텐츠 층만 2px 거리로 준다(기초 Feedback v104 — 기준 max(높이, 폭 ÷ 4, 24) 를
 * 누르는 순간 재서 --press-basis 로). 호버는 마우스 있는 기기에서만(v106). 바탕은 불투명한 bg-layer-default-pressed — 시트 · 대화상자 위도 같다.
 * 트리거 위아래 16 · 좌우 24(spacing-global-gutter), 앞 아이콘 22 · 본문 · 꺾쇠 20 사이 12, 제목 t5 16 / 22 · 500 · fg-neutral, 설명 t3 13 / 18 · 500 ·
 * fg-neutral-subtle(제목 아래 2). 제목만이면 54, 설명이 있으면 74 — 제목 · 설명은 늘 줄을 바꾼다(단어 단위, 말줄임 없음 — v114).
 * 꺾쇠는 lucide chevron-down 20 · fg-neutral-subtle — 펼치면 180° 돈다. 막힘은 앞 아이콘 · 제목 · 설명 · 꺾쇠가 모두 fg-disabled(흐리게 하지 않는다).
 * 키보드 포커스에만 트리거 안쪽 2px 링 — inline 은 각진 링, separated 는 항목 모서리를 따라 14.
 * 펼친 내용은 좌우 24 · 아래 16(위 0 — 트리거 아래 16 에 바로 잇는다), 안에서 스크롤하지 않는다. 펼쳐도 초점은 트리거에 그대로고
 * 화면을 저절로 스크롤하지 않는다(SEED). 펼친 내용에 role="region" 을 두지 않는다 — 함께 열리는 항목이 많아 랜드마크가 늘어난다(APG).
 * 모션: 꺾쇠 · 높이 300ms motion-ease-easing(SEED d6). 모션 줄이기면 높이를 움직이지 않고 150ms 서서히 나타나고 사라지며, 꺾쇠는 바로 뒤집힌다.
 * 키보드(APG Accordion): Enter · Space 는 단추 그대로, ↓ ↑ 는 다음 · 앞 트리거(끝에서 처음으로 돈다), Home · End 는 첫 · 끝 트리거 —
 * 상세가 없는 줄 · 막힌 트리거는 건너뛴다.
 */

// ── 펼침 · 접힘 모션 ─────────────────────────────────────────
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

// 토큰의 시간 — "300ms" · "0.3s" 를 ms 로. 읽지 못하면 기본값
function tokenMs(style: CSSStyleDeclaration, name: string, fallback: number) {
  const raw = style.getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return raw.endsWith("ms") ? n : raw.endsWith("s") ? n * 1000 : n;
}

const reducedMotion = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 펼침 · 접힘 모션 — 높이 300ms motion-ease-easing(motion-duration-d6), 모션 줄이기면 높이를 움직이지 않고 150ms(d3) 서서히.
 * 접힌 뒤에는 hidden 이다(그리지 않는다 · 보조 기술도 읽지 않는다). 안의 자식은 그대로 두어 칸의 값 · aria-controls 가 이어진다.
 * 움직이는 도중에 다시 누르면 지금 높이 · 투명도에서 되돌아간다. 처음 그릴 때는 움직이지 않는다.
 * ref 는 펼치고 접는 요소(바깥 감싸개 — 여백은 안쪽 요소에)에 단다.
 */
function useExpandMotion<T extends HTMLElement = HTMLDivElement>(open: boolean) {
  const ref = React.useRef<T>(null);
  const [present, setPresent] = React.useState(open);
  // 펼치면 바로 그린다 — 움직임은 그린 뒤(레이아웃 효과)에 시작한다
  if (open && !present) setPresent(true);
  const prevOpen = React.useRef(open);
  const running = React.useRef<Animation | null>(null);
  const generation = React.useRef(0);

  useIsoLayoutEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    const el = ref.current;
    if (!el) return;
    const token = ++generation.current;
    const previous = running.current;
    // 움직이는 중이면 지금 모습에서 이어 간다 — 멈추기 전에 읽는다
    const fromHeight = el.getBoundingClientRect().height;
    const fromOpacity = Number(getComputedStyle(el).opacity);
    previous?.cancel();
    running.current = null;
    el.style.removeProperty("overflow");
    // 접힌 뒤 바로 다시 펼친 경우 — 아래 onfinish 가 단 hidden 을 걷는다(React 가 아직 그리지 않았을 수 있다)
    if (open) el.hidden = false;
    if (typeof el.animate !== "function") {
      if (!open) setPresent(false);
      return;
    }
    const style = getComputedStyle(el);
    const easing = style.getPropertyValue("--motion-ease-easing").trim() || "ease";
    let animation: Animation;
    if (reducedMotion()) {
      const start = previous ? fromOpacity : open ? 0 : 1;
      animation = el.animate([{ opacity: start }, { opacity: open ? 1 : 0 }], { duration: tokenMs(style, "--motion-duration-d3", 150), easing });
    } else {
      // 펼칠 때는 내용 전체 높이까지, 접을 때는 0 까지. 움직이는 동안만 넘친 것을 자른다
      const start = previous ? fromHeight : open ? 0 : fromHeight;
      const end = open ? el.scrollHeight : 0;
      el.style.overflow = "hidden";
      animation = el.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: tokenMs(style, "--motion-duration-d6", 300), easing });
    }
    running.current = animation;
    animation.onfinish = () => {
      if (generation.current !== token) return;
      running.current = null;
      el.style.removeProperty("overflow");
      if (open) return;
      // 접힘이 끝난 그 화면에서 바로 숨긴다 — React 가 다시 그릴 때까지 다 펼친 높이가 한 번 비치지 않게
      el.hidden = true;
      setPresent(false);
    };
  }, [open]);

  React.useEffect(
    () => () => {
      running.current?.cancel();
    },
    [],
  );

  return { ref, hidden: !present };
}

// ── 값 ───────────────────────────────────────────────────────
function useControllable<T>(prop: T | undefined, defaultValue: T, onChange: ((value: T) => void) | undefined) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = prop !== undefined;
  const value = controlled ? prop : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [value, set] as const;
}

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로(Button · List 와 같은 식) — 콘텐츠 층이 물려받는다
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

// ── 트리거의 짜임(Collapsible 도 쓴다) ────────────────────────
// 단추 — 줄 전체가 누르는 자리. 바탕 층은 ::before(누르거나 올리면 좌우 6 들어와 모서리 10), 포커스 링은 안쪽 2px
// (outline-none 을 같이 두지 않는다 — Tailwind v4 의 outline-none 은 --tw-outline-style 을 none 으로 남겨 focus-visible:outline-2 를 지운다).
// 누름 색은 --trigger-pressed(기본 bg-layer-default-pressed — Collapsible 경고 상자는 bg-warning-weak-pressed)
const accordionTriggerVariants = (opts: { ring?: "square" | "r3_5" | "r2_5"; pressed?: "layer" | "warning" } = {}) =>
  cn(
    "group/accordion-trigger relative flex min-h-[54px] w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left font-sans",
    opts.pressed === "warning" ? "[--trigger-pressed:var(--color-bg-warning-weak-pressed)]" : "[--trigger-pressed:var(--color-bg-layer-default-pressed)]",
    "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
    "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "[@media(hover:hover)]:enabled:hover:before:inset-x-x1_5 [@media(hover:hover)]:enabled:hover:before:rounded-r2_5 [@media(hover:hover)]:enabled:hover:before:bg-(--trigger-pressed)",
    "enabled:active:before:inset-x-x1_5 enabled:active:before:rounded-r2_5 enabled:active:before:bg-(--trigger-pressed)",
    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
    "disabled:cursor-not-allowed",
    // 링의 모서리 — 링(2px)이 단추 안쪽 끝에 붙어 단추 모서리가 곧 링 바깥 모서리다
    opts.ring === "r3_5" ? "rounded-r3_5" : opts.ring === "r2_5" ? "rounded-r2_5" : "rounded-none",
  );

// 콘텐츠 층 — 앞 아이콘 · 본문 · 꺾쇠. 위아래 16 · 좌우 24(경고 상자 16), 사이 12. 누르는 동안 이 층만 2px 거리 축소
const accordionTriggerContentVariants = (opts: { padX?: "gutter" | "x4"; press?: boolean } = {}) =>
  cn(
    "relative flex w-full min-w-0 items-center gap-x3 py-x4",
    opts.padX === "x4" ? "px-x4" : "px-global-gutter",
    "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    opts.press && "group-active/accordion-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/accordion-trigger:[scale:1]",
  );

const accordionPrefixVariants = (disabled?: boolean) =>
  cn("flex shrink-0 [&>svg]:size-[22px] [&>svg]:shrink-0", disabled ? "text-fg-disabled" : "text-fg-neutral");

const ACCORDION_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5";

// 제목 · 설명 — 늘 줄을 바꾼다(단어 단위 — 낱말 사이에서만, 한 줄보다 긴 낱말만 칸 끝에서)
const accordionTitleVariants = (disabled?: boolean) =>
  cn("font-sans text-t5 font-medium break-keep [overflow-wrap:break-word]", disabled ? "text-fg-disabled" : "text-fg-neutral");
const accordionDescriptionVariants = (disabled?: boolean) =>
  cn("font-sans text-t3 font-medium break-keep [overflow-wrap:break-word]", disabled ? "text-fg-disabled" : "text-fg-neutral-subtle");

// 꺾쇠 20 — 펼치면 180°(300ms easing, 모션 줄이기면 바로)
const accordionChevronVariants = (opts: { open?: boolean; disabled?: boolean } = {}) =>
  cn(
    "size-5 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none",
    opts.open && "rotate-180",
    opts.disabled ? "text-fg-disabled" : "text-fg-neutral-subtle",
  );

// 펼친 내용의 글 — 좌우 24 · 아래 16(위 0), text-article-note 14 / 22 · fg-neutral-muted, 줄바꿈 문자를 지킨다
const ACCORDION_PANEL_TEXT = "px-global-gutter pb-x4 pt-0 font-sans text-article-note font-normal text-fg-neutral-muted whitespace-pre-line break-keep [overflow-wrap:break-word]";

// ── 아코디언 ─────────────────────────────────────────────────
export type AccordionVariant = "inline" | "separated";

type AccordionContextValue = {
  variant: AccordionVariant;
  values: string[];
  toggle: (value: string) => void;
  disabled: boolean;
};
const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type ItemContextValue = { value: string; open: boolean; disabled: boolean; triggerId: string; contentId: string };
const ItemContext = React.createContext<ItemContextValue | null>(null);

function useAccordion(part: string) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error(`[Accordion] ${part} 는 Accordion 안에 둔다.`);
  return ctx;
}
function useItem(part: string) {
  const ctx = React.useContext(ItemContext);
  if (!ctx) throw new Error(`[Accordion] ${part} 는 AccordionItem 안에 둔다.`);
  return ctx;
}

// 줄(항목 · 상세가 없는 줄) 사이 선 — inline 만. 첫 줄 위 · 끝 줄 아래에는 긋지 않는다(1px · stroke-neutral-subtle · 좌우 24)
const ROOT: Record<AccordionVariant, string> = {
  inline: [
    "flex flex-col",
    "[&>[data-accordion-row]+[data-accordion-row]]:before:block [&>[data-accordion-row]+[data-accordion-row]]:before:h-px [&>[data-accordion-row]+[data-accordion-row]]:before:mx-x6",
    "[&>[data-accordion-row]+[data-accordion-row]]:before:bg-stroke-neutral-subtle [&>[data-accordion-row]+[data-accordion-row]]:before:content-['']",
  ].join(" "),
  // 항목마다 Card 면 — 사이 8
  separated: "flex flex-col gap-x2",
};

// 항목 면 — separated 는 Card 면(1px stroke-neutral-weak · 모서리 16 · 그림자 없음). 바탕은 놓인 면 그대로. 누름 바탕 · 펼친 내용을 모서리에서 자른다
const ITEM: Record<AccordionVariant, string> = {
  inline: "relative",
  separated: "relative overflow-hidden rounded-r4 border border-solid border-stroke-neutral-weak bg-transparent",
};

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** "inline"(기본 — 연속 목록 + 들인 사이 선) · "separated"(항목마다 Card 면) */
  variant?: AccordionVariant;
  /** 펼친 항목의 value 목록 — 쥐고 다룰 때 */
  values?: string[];
  /** 처음 펼친 항목 — 없으면 모두 접힘 */
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  /** 전체 막힘 */
  disabled?: boolean;
}

const KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ variant = "inline", values: valuesProp, defaultValues, onValuesChange, disabled = false, className, onKeyDown, ...props }, ref) => {
    const [values, setValues] = useControllable(valuesProp, defaultValues ?? [], onValuesChange);
    const toggle = React.useCallback(
      (value: string) => setValues(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]),
      [values, setValues],
    );
    const ctx = React.useMemo(() => ({ variant, values, toggle, disabled }), [variant, values, toggle, disabled]);
    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="accordion"
          data-variant={variant}
          className={cn(ROOT[variant], className)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || !KEYS.has(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
            const root = e.currentTarget;
            const target = e.target as HTMLElement;
            if (target.getAttribute("data-slot") !== "accordion-trigger" || target.closest('[data-slot="accordion"]') !== root) return;
            // 이 아코디언의 트리거만(안에 둔 다른 아코디언은 빼고) — 막힌 트리거는 건너뛴다
            const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slot="accordion-trigger"]')).filter(
              (t) => !t.disabled && t.closest('[data-slot="accordion"]') === root,
            );
            const i = triggers.indexOf(target as HTMLButtonElement);
            if (i < 0) return;
            e.preventDefault();
            const n = triggers.length;
            const next = e.key === "ArrowDown" ? triggers[(i + 1) % n] : e.key === "ArrowUp" ? triggers[(i - 1 + n) % n] : e.key === "Home" ? triggers[0] : triggers[n - 1];
            next?.focus();
          }}
          {...props}
        />
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 항목의 값 — Accordion 의 values 에 든다 */
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({ value, disabled: disabledProp = false, className, ...props }, ref) => {
  const acc = useAccordion("AccordionItem");
  const open = acc.values.includes(value);
  const disabled = acc.disabled || disabledProp;
  const base = React.useId();
  const ctx = React.useMemo(() => ({ value, open, disabled, triggerId: `${base}trigger`, contentId: `${base}content` }), [value, open, disabled, base]);
  return (
    <ItemContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="accordion-item"
        data-accordion-row=""
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        className={cn(ITEM[acc.variant], className)}
        {...props}
      />
    </ItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title" | "children" | "disabled"> {
  /** 제목 — 무엇의 상세인지(늘 줄을 바꾼다) */
  title: React.ReactNode;
  /** 설명 — 제목 아래 한 줄 요약(있을 때만, 높이 74) */
  description?: React.ReactNode;
  /** 앞 아이콘 — lucide 22(있을 때만) */
  prefixIcon?: React.ReactNode;
  /** 머리말 단계 — 놓인 자리를 따른다(기본 3 — 대화상자 · 시트 · 카드 제목(h2) 아래) */
  headingLevel?: HeadingLevel;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ title, description, prefixIcon, headingLevel = 3, className, onClick, onPointerDown, onKeyDown, id, ...props }, ref) => {
    const acc = useAccordion("AccordionTrigger");
    const item = useItem("AccordionTrigger");
    const Heading = `h${headingLevel}` as "h3";
    return (
      <Heading data-slot="accordion-heading" className="m-0 flex">
        <button
          {...props}
          ref={ref}
          type="button"
          id={id ?? item.triggerId}
          aria-expanded={item.open}
          aria-controls={item.contentId}
          disabled={item.disabled}
          data-slot="accordion-trigger"
          data-state={item.open ? "open" : "closed"}
          className={cn(accordionTriggerVariants({ ring: acc.variant === "separated" ? "r3_5" : "square" }), className)}
          onPointerDown={(e) => {
            measurePress(e.currentTarget);
            onPointerDown?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") measurePress(e.currentTarget);
            onKeyDown?.(e);
          }}
          onClick={(e) => {
            onClick?.(e);
            if (!e.defaultPrevented) acc.toggle(item.value);
          }}
        >
          <span data-slot="accordion-trigger-content" className={accordionTriggerContentVariants({ press: !item.disabled })}>
            {prefixIcon != null && (
              <span aria-hidden data-slot="accordion-prefix-icon" className={accordionPrefixVariants(item.disabled)}>
                {prefixIcon}
              </span>
            )}
            <span data-slot="accordion-trigger-body" className={ACCORDION_BODY}>
              <span data-slot="accordion-title" className={accordionTitleVariants(item.disabled)}>
                {title}
              </span>
              {description != null && (
                <span data-slot="accordion-description" className={accordionDescriptionVariants(item.disabled)}>
                  {description}
                </span>
              )}
            </span>
            <ChevronDown aria-hidden data-slot="accordion-chevron" strokeWidth={2} className={accordionChevronVariants({ open: item.open, disabled: item.disabled })} />
          </span>
        </button>
      </Heading>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  const item = useItem("AccordionContent");
  const { ref: motionRef, hidden } = useExpandMotion<HTMLDivElement>(item.open);
  return (
    <div
      ref={motionRef}
      id={item.contentId}
      data-slot="accordion-content"
      data-state={item.open ? "open" : "closed"}
      hidden={hidden}
    >
      <div ref={ref} data-slot="accordion-content-text" className={cn(ACCORDION_PANEL_TEXT, className)} {...props}>
        {children}
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export interface AccordionPlainItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  prefixIcon?: React.ReactNode;
}

// 상세가 없는 항목 — 트리거가 아닌 그냥 줄(사용자 결정 5A). 같은 위아래 16 · 좌우 24 · 글이라 높이 · 글 시작이 같다. 누르거나 올려도 바탕이 없다
const AccordionPlainItem = React.forwardRef<HTMLDivElement, AccordionPlainItemProps>(({ title, description, prefixIcon, className, ...props }, ref) => {
  const acc = useAccordion("AccordionPlainItem");
  return (
    <div ref={ref} data-slot="accordion-plain-item" data-accordion-row="" className={cn(ITEM[acc.variant], className)} {...props}>
      <div data-slot="accordion-plain-item-content" className={cn(accordionTriggerContentVariants(), "min-h-[54px]")}>
        {prefixIcon != null && (
          <span aria-hidden data-slot="accordion-prefix-icon" className={accordionPrefixVariants()}>
            {prefixIcon}
          </span>
        )}
        <span data-slot="accordion-trigger-body" className={ACCORDION_BODY}>
          <span data-slot="accordion-title" className={accordionTitleVariants()}>
            {title}
          </span>
          {description != null && (
            <span data-slot="accordion-description" className={accordionDescriptionVariants()}>
              {description}
            </span>
          )}
        </span>
      </div>
    </div>
  );
});
AccordionPlainItem.displayName = "AccordionPlainItem";

export interface AccordionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 목록 머리 제목 — 건수를 붙인다("혜택 상세 · 12건") */
  title: React.ReactNode;
}

// 목록 머리 — 시트 · 대화상자에서 아코디언 위 한 줄. 높이 36 · 아래 8 · 제목 t5 · 700(카드 머리와 같은 글) + 오른쪽 모두 펼치기
const AccordionHeader = React.forwardRef<HTMLDivElement, AccordionHeaderProps>(({ title, className, children, ...props }, ref) => (
  <div ref={ref} data-slot="accordion-header" className={cn("mb-x2 flex min-h-9 items-center justify-between gap-x2", className)} {...props}>
    <div data-slot="accordion-header-title" className="min-w-0 font-sans text-t5 font-bold text-fg-neutral break-keep [overflow-wrap:break-word]">
      {title}
    </div>
    {children}
  </div>
));
AccordionHeader.displayName = "AccordionHeader";

// 모두 펼치기 — Card 머리 동작과 같은 글 버튼(SEED Text Button, 2026-10-16 글자 역할 D2): 보이는 상자 36 · 좌우 14 · 모서리 8,
// 글 t4 · 700 · fg-neutral-muted · 아이콘 없음, 오른쪽 −14 로 내어 글자 끝이 머리 여백에. 누르는 영역 44(::before). 누르면 바탕 + 2px 거리 축소
const EXPAND_ALL = [
  "relative -mr-x3_5 inline-flex h-9 shrink-0 cursor-pointer items-center rounded-r2 border-0 bg-transparent px-x3_5",
  "font-sans text-t4 font-bold text-fg-neutral-muted",
  "before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[@media(hover:hover)]:hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

export interface AccordionExpandAllProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "value"> {
  /** 아코디언의 id — aria-controls */
  controls: string;
  /** 아코디언과 같은 펼친 항목 목록 */
  values: string[];
  /** 상세가 있는 항목의 value 목록 — 모두 펼치면 이것을 다 연다 */
  expandable: string[];
  onValuesChange: (values: string[]) => void;
}

const AccordionExpandAll = React.forwardRef<HTMLButtonElement, AccordionExpandAllProps>(
  ({ controls, values, expandable, onValuesChange, className, onClick, onPointerDown, onKeyDown, ...props }, ref) => {
    // 상세가 있는 항목이 모두 펼쳐져 있으면 "모두 접기" — 하나라도 접혀 있으면 "모두 펼치기"
    const allOpen = expandable.length > 0 && expandable.every((v) => values.includes(v));
    return (
      <button
        ref={ref}
        type="button"
        aria-controls={controls}
        data-slot="accordion-expand-all"
        data-state={allOpen ? "expanded" : "collapsed"}
        className={cn(EXPAND_ALL, className)}
        onPointerDown={(e) => {
          measurePress(e.currentTarget);
          onPointerDown?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") measurePress(e.currentTarget);
          onKeyDown?.(e);
        }}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          onValuesChange(allOpen ? values.filter((v) => !expandable.includes(v)) : [...values, ...expandable.filter((v) => !values.includes(v))]);
        }}
        {...props}
      >
        <span>{allOpen ? "모두 접기" : "모두 펼치기"}</span>
      </button>
    );
  },
);
AccordionExpandAll.displayName = "AccordionExpandAll";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionPlainItem,
  AccordionHeader,
  AccordionExpandAll,
  useExpandMotion,
  accordionTriggerVariants,
  accordionTriggerContentVariants,
  accordionPrefixVariants,
  accordionTitleVariants,
  accordionDescriptionVariants,
  accordionChevronVariants,
};
