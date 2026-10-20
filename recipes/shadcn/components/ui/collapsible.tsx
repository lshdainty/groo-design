import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  accordionChevronVariants,
  accordionDescriptionVariants,
  accordionTitleVariants,
  accordionTriggerContentVariants,
  accordionTriggerVariants,
  useExpandMotion,
  type HeadingLevel,
} from "@/components/ui/accordion";

/*
 * Groo Collapsible — 트리거는 Accordion 항목 하나의 모양(2026-10-10). 수치 원본은 specs/components/collapsible.yaml.
 * 내용 하나를 접고 편다 — 거래 상세의 분할 내역, 분할의 "빠르게 맞추기", HR 업무 보고의 상세 검색 조건. 같은 모양의 상세가 여럿이면 Accordion 이다.
 * SEED 에는 Collapsible 이 없다 — Accordion 가이드의 한 줄("단일 콘텐츠를 접고 펼치는 용도는 해당 아이템에 Collapsible 동작을 활용", Apache-2.0)대로
 * Accordion 트리거 · 상태 · 모션을 그대로 쓴다(accordion.tsx). 옛 "스타일 0 · 동작만"(Radix 그대로) · Button 으로 감싼 트리거는 걷었다.
 *
 *   Collapsible          접는 자리 — open · defaultOpen · onOpenChange(open) · disabled · surface, 나머지는 div 속성
 *                        surface "default"(기본 — 흰 면 · 시트 · 대화상자의 줄, 좌우 24) ·
 *                                "card"(Collapsible 이 Card 면을 그린다 — 1px stroke-neutral-weak · 모서리 16 · bg-layer-default, 트리거가 카드 머리) ·
 *                                "warning"(경고 상자의 맨 아래 줄 — 좌우 16 · 위 1px stroke-warning-weak · 누름 bg-warning-weak-pressed.
 *                                상자 — 바탕 · 테두리 · 모서리 12 · 경고 글 여백 — 는 화면이 그리고, 상자의 overflow: hidden 이 누름 바탕을 자른다)
 *   CollapsibleTrigger   트리거 — title(필수 — 고정 이름) · description · headingLevel(2 ~ 6, 기본 3). 머리말 안의 단추(aria-expanded ·
 *                        aria-controls)와 꺾쇠 20 — Accordion 트리거와 같은 모양(54 · 74)
 *   CollapsibleContent   펼친 내용 — layout "text"(기본 — 아래 16) · "rows"(줄 목록 — 아래 8), 나머지는 div 속성. 좌우는 트리거와 같고
 *                        card 는 아래 24. 접혀 있으면 그리지 않는다(hidden)
 *
 * 이름은 무엇을 여닫는지 고정하고 상태마다 바꾸지 않는다 — 펼침은 aria-expanded 가 알린다(APG Disclosure). 설명(합계 · 필터 수)은 이름 뒤에
 * 함께 읽힌다. 펼쳐도 초점은 트리거에 그대로, 화면을 저절로 스크롤하지 않는다. 펼친 내용에 role="region" 을 두지 않는다.
 * 키보드 포커스에만 트리거 안쪽 2px 링 — 흰 면은 각진 링, 카드는 모서리 14(16 − 2), 경고 상자는 10(12 − 2).
 * 모션은 Accordion 과 같다 — 꺾쇠 · 높이 300ms ease-easing, 모션 줄이기면 높이를 움직이지 않고 150ms 서서히 · 꺾쇠는 바로.
 * 원장 머리의 "소비 요약" · "월 달력" 은 이 부품이 아니라 원장 머리의 단추다 — aria-expanded · aria-controls 를 달고, 하나를 열면
 * 다른 하나를 닫는 것은 화면이 쥔다.
 */

export type CollapsibleSurface = "default" | "card" | "warning";
export type CollapsibleLayout = "text" | "rows";

type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
  surface: CollapsibleSurface;
  triggerId: string;
  contentId: string;
};
const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsible(part: string) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error(`[Collapsible] ${part} 는 Collapsible 안에 둔다.`);
  return ctx;
}

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로 — 콘텐츠 층이 물려받는다
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

// 놓인 면 — card 는 Card 면(바닥 위 흰 면 + 1px · 모서리 16, 누름 바탕 · 펼친 내용을 모서리에서 자른다), warning 은 트리거 위 1px 선(상자 폭 끝까지)
const ROOT: Record<CollapsibleSurface, string> = {
  default: "relative",
  card: "relative overflow-hidden rounded-r4 border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  warning: "relative border-0 border-t border-solid border-stroke-warning-weak",
};

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** 놓인 면 — "default"(기본) · "card"(Card 면을 그린다) · "warning"(경고 상자의 맨 아래 줄) */
  surface?: CollapsibleSurface;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: openProp, defaultOpen = false, onOpenChange, disabled = false, surface = "default", className, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultOpen);
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : inner;
    const toggle = React.useCallback(() => {
      const next = !open;
      if (!controlled) setInner(next);
      onOpenChange?.(next);
    }, [open, controlled, onOpenChange]);
    const base = React.useId();
    const ctx = React.useMemo(
      () => ({ open, toggle, disabled, surface, triggerId: `${base}trigger`, contentId: `${base}content` }),
      [open, toggle, disabled, surface, base],
    );
    return (
      <CollapsibleContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="collapsible"
          data-state={open ? "open" : "closed"}
          data-surface={surface}
          data-disabled={disabled ? "" : undefined}
          className={cn(ROOT[surface], className)}
          {...props}
        />
      </CollapsibleContext.Provider>
    );
  },
);
Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title" | "children" | "disabled"> {
  /** 이름 — 무엇을 여닫는지(고정 — 상태마다 바꾸지 않는다) */
  title: React.ReactNode;
  /** 설명 — 접혀 있어도 알아야 할 값(합계 · 적용한 필터 수), 있을 때만 */
  description?: React.ReactNode;
  /** 머리말 단계 — 놓인 자리를 따른다(기본 3) */
  headingLevel?: HeadingLevel;
}

// 트리거 — Accordion 항목과 같은 짜임(바탕 층 + 콘텐츠 층). 경고 상자는 좌우 16 · 누름 bg-warning-weak-pressed
const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ title, description, headingLevel = 3, className, onClick, onPointerDown, onKeyDown, id, ...props }, ref) => {
    const ctx = useCollapsible("CollapsibleTrigger");
    const Heading = `h${headingLevel}` as "h3";
    const ring = ctx.surface === "card" ? "r3_5" : ctx.surface === "warning" ? "r2_5" : "square";
    return (
      <Heading data-slot="collapsible-heading" className="m-0 flex">
        <button
          {...props}
          ref={ref}
          type="button"
          id={id ?? ctx.triggerId}
          aria-expanded={ctx.open}
          aria-controls={ctx.contentId}
          disabled={ctx.disabled}
          data-slot="collapsible-trigger"
          data-state={ctx.open ? "open" : "closed"}
          className={cn(accordionTriggerVariants({ ring, pressed: ctx.surface === "warning" ? "warning" : "layer" }), className)}
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
            if (!e.defaultPrevented) ctx.toggle();
          }}
        >
          <span
            data-slot="collapsible-trigger-content"
            className={accordionTriggerContentVariants({ padX: ctx.surface === "warning" ? "x4" : "gutter", press: !ctx.disabled })}
          >
            <span data-slot="collapsible-trigger-body" className="flex min-w-0 flex-1 flex-col items-start gap-x0_5">
              <span data-slot="collapsible-title" className={accordionTitleVariants(ctx.disabled)}>
                {title}
              </span>
              {description != null && (
                <span data-slot="collapsible-description" className={accordionDescriptionVariants(ctx.disabled)}>
                  {description}
                </span>
              )}
            </span>
            <ChevronDown aria-hidden data-slot="collapsible-chevron" strokeWidth={2} className={accordionChevronVariants({ open: ctx.open, disabled: ctx.disabled })} />
          </span>
        </button>
      </Heading>
    );
  },
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

// 펼친 내용의 여백 — 위 0 · 좌우는 트리거와 같다(흰 면 · 카드 24, 경고 상자 16). 아래는 글 16 · 줄 목록 8(줄이 제 위아래 12 를 가진다) ·
// 카드 24(카드 안 여백 — 줄 목록이어도 24)
function panelPadding(surface: CollapsibleSurface, layout: CollapsibleLayout) {
  const x = surface === "warning" ? "px-x4" : "px-global-gutter";
  const bottom = surface === "card" ? "pb-x6" : layout === "rows" ? "pb-x2" : "pb-x4";
  return cn("pt-0", x, bottom);
}

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "text"(기본 — 글 · 카드 · 칸, 아래 16) · "rows"(줄 목록 — 아래 8) */
  layout?: CollapsibleLayout;
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(({ layout = "text", className, children, ...props }, ref) => {
  const ctx = useCollapsible("CollapsibleContent");
  const { ref: motionRef, hidden } = useExpandMotion<HTMLDivElement>(ctx.open);
  return (
    <div ref={motionRef} id={ctx.contentId} data-slot="collapsible-content" data-state={ctx.open ? "open" : "closed"} hidden={hidden}>
      <div ref={ref} data-slot="collapsible-content-inner" data-layout={layout} className={cn(panelPadding(ctx.surface, layout), className)} {...props}>
        {children}
      </div>
    </div>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
