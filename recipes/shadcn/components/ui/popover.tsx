import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollFog } from "@/components/ui/scroll-fog";

/*
 * Porest Popover — 구조는 SEED Popover(2026-10-02). 수치 원본은 specs/components/popover.yaml.
 *
 *   Popover           트리거에 붙어 떠 있는 비모달 표면(Radix Popover) — open · defaultOpen · onOpenChange
 *   PopoverTrigger    여는 버튼 — aria-haspopup="dialog" · aria-expanded, 열린 동안 aria-controls
 *   PopoverAnchor     트리거와 다른 요소에 붙일 때의 기준(Radix 그대로)
 *   PopoverContent    표면 — title(있으면 머리 + 오른쪽 위 닫기) · description. 머리 없는 고르는 패널은 aria-label 로 이름을 단다
 *   PopoverBody       본문 — 이 안에서만 스크롤, 위로 스크롤되면 머리 아래 1px 선. scrollFog 면 끝 흐림(Scroll Fog — 늘 켜진
 *                     위 20 · 아래 80 + 본문 안 여백 위 20 · 아래 80) — 넘칠 수 있는 본문에만 준다(Dialog 와 같다)
 *   PopoverFooter     바닥 — 오른쪽 정렬, 사이 8. Button small 36 을 크기를 주지 않은 바로 아래 자식에 넣는다
 *
 * 1280 이상에서 쓴다 — 같은 내용을 1280 미만에서는 Bottom Sheet 로 띄운다(Input Button 의 useInputButtonSurface).
 *
 * 비모달 — 딤 · 스크롤 잠금이 없고 뒤 화면을 숨기지 않으며 초점을 가두지 않는다.
 *   - 열면 초점이 안으로 간다 — 머리 닫기 버튼이 아니라 내용의 첫 칸, 칸이 없으면 표면. autoFocus 를 단 칸이 있으면 그 칸.
 *   - Tab 은 트리거 → 표면 안 → 트리거 다음 칸 순서다. 마지막 칸에서 Tab 을 누르면 초점을 트리거에 두어 브라우저가 트리거 다음 칸으로
 *     보내고, 표면은 바깥으로 나간 초점에 닫힌다(초점은 나간 자리에 남는다). Shift+Tab 은 거꾸로 — 내용 첫 칸 다음은 머리 닫기 버튼,
 *     그다음 트리거다(보이는 순서와 같다 — 2026-10-15 사용자 결정 Q-006). 열린 동안 트리거에서 Tab 은 표면 안으로 — 표면은 문서 끝
 *     (portal)에 있어 브라우저에 맡기면 순서가 끊긴다.
 *   - 바깥 누르기 · Esc · 닫기 버튼으로 닫으면 초점은 트리거로 돌아간다 — 바깥을 눌러 다른 칸에 초점이 갔으면 그 자리에 둔다.
 *   - 대화상자 · 시트 안에서 열면 그 위에 뜨고(z-floating 200), 그 표면이 닫히면 함께 닫힌다.
 *
 * 모양: 폭은 내용만큼 320 ~ 480, 화면 가장자리와 16 을 남긴다(가용 폭이 더 좁으면 가용 폭). 높이는 600 과 남은 공간 중 작은 쪽까지 —
 * 넘치면 본문이 스크롤한다. 트리거와 8 떨어져 아래(모자라면 위)에 뜨고 옆으로 넘치면 화면 안으로 민다. 모서리 r5 20 · 그림자 s3 —
 * 딤 없이 그림자로 뜬다. 머리 위 24 · 좌우 24 · 아래 16 · 사이 6, 제목 t7 20 / 27 · 700 · 설명 t4 fg-neutral-muted.
 * 닫기 버튼(머리가 있을 때)은 52 투명 상자 · 아이콘 22 fg-neutral-subtle — 아이콘이 위 27 · 오른쪽 24, 머리 오른쪽 52 를 비운다.
 * 누르면 bg-layer-floating-pressed + 2px 거리 축소(기준 52), 호버는 누름 색. 본문은 좌우 24 — 맨 끝(바닥이 없을 때)이면 아래 24,
 * 맨 앞(머리가 없을 때)이면 위 24. 바닥은 위 16 · 좌우 24 · 아래 24.
 * 모션: 150ms enter 로 트리거 쪽 변에서 0.95 → 1 커지며 나타나고, 100ms exit 로 0.95 로 줄며 사라진다(모션 줄이기면 투명도만).
 * 휠 스크롤은 표면 안에서 멈춘다 — 대화상자 안에서 열었을 때 대화상자의 스크롤 잠금(문서에 건다)이 팝오버의 휠을 막지 않게.
 */

type OpenChange = (open: boolean) => void;

// ── 작은 도구 ─────────────────────────────────────────────────
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

function useOpenState(prop: boolean | undefined, defaultOpen: boolean | undefined, onChange: OpenChange | undefined) {
  const [inner, setInner] = React.useState(defaultOpen ?? false);
  const controlled = prop !== undefined;
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );
  return [controlled ? prop : inner, setOpen] as const;
}

// 바닥 버튼의 크기 — 크기를 주지 않은 바로 아래 자식(컴포넌트)에만 넣는다. Fragment 는 펼친다
function withButtonSize(children: React.ReactNode, size: "small"): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<{ size?: unknown; children?: React.ReactNode }>(child)) return child;
    if (child.type === React.Fragment) return withButtonSize(child.props.children, size);
    if (typeof child.type === "string" || child.props.size !== undefined) return child;
    return React.cloneElement(child, { size });
  });
}

// 표면 안에서 Tab 이 서는 칸 — 문서 순서대로, 막히거나 숨은 칸은 뺀다
function tabbablesOf(root: HTMLElement) {
  const out: HTMLElement[] = [];
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const el = node as HTMLElement & { disabled?: boolean; type?: string };
      if (el.disabled || el.hidden || (el.tagName === "INPUT" && el.type === "hidden")) return NodeFilter.FILTER_SKIP;
      return el.tabIndex >= 0 && el.getClientRects().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) out.push(walker.currentNode as HTMLElement);
  return out;
}

// 내용의 첫 칸 — 머리 닫기 버튼은 건너뛴다. 칸이 없으면 표면
function focusContent(content: HTMLElement | null) {
  if (!content) return;
  const first = tabbablesOf(content).find((el) => !el.closest('[data-slot="popover-close"]'));
  (first ?? content).focus({ preventScroll: true });
}

// 본문의 스크롤 상태 — dialog.tsx 의 DialogBody 와 같다(위로 스크롤됨 · 넘치면 Tab 이 선다, DOM 에 바로 쓴다)
function useBodyScroll(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const overflow = el.scrollHeight > el.clientHeight + 1;
      el.toggleAttribute("data-scrolled", el.scrollTop > 0);
      // 넘쳐 스크롤할 수 있으면 키보드로도 스크롤하도록 Tab 이 선다
      if (overflow) el.tabIndex = 0;
      else el.removeAttribute("tabindex");
    };
    const resize = new ResizeObserver(measure);
    const observeChildren = () => {
      resize.observe(el);
      for (const child of Array.from(el.children)) resize.observe(child);
    };
    const mutation = new MutationObserver(() => {
      observeChildren();
      measure();
    });
    observeChildren();
    mutation.observe(el, { childList: true });
    el.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => {
      resize.disconnect();
      mutation.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [ref]);
}

// ── 팝오버 ───────────────────────────────────────────────────
type PopoverContextValue = {
  open: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};
const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function Popover({ open: openProp, defaultOpen, onOpenChange, ...props }: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const value = React.useMemo(() => ({ open, triggerRef, contentRef }), [open]);
  return (
    <PopoverContext.Provider value={value}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </PopoverContext.Provider>
  );
}
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ onKeyDown, ...props }, ref) => {
  const ctx = React.useContext(PopoverContext);
  return (
    <PopoverPrimitive.Trigger
      ref={mergeRefs(ref, ctx?.triggerRef)}
      data-slot="popover-trigger"
      // aria-controls 는 열린 동안만 — 닫혀 있으면 가리킬 표면이 문서에 없다
      {...(ctx && !ctx.open ? { "aria-controls": undefined } : null)}
      {...props}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        // 열린 동안 트리거에서 Tab — 표면 안으로(표면은 트리거 바로 다음 순서다)
        if (e.defaultPrevented || !ctx?.open || e.key !== "Tab" || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
        const content = ctx.contentRef.current;
        if (!content) return;
        e.preventDefault();
        focusContent(content);
      }}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverAnchor = PopoverPrimitive.Anchor;

// 표면 — 폭 320 ~ 480(가용 폭까지) · 높이 600(가용 높이까지), 모서리 20 · 그림자 s3 · z-floating 200.
// 열림 150ms enter 로 트리거 쪽 변에서 0.95 → 1 · 투명도, 닫힘 100ms exit 로 0.95 · 투명도(모션 줄이기면 투명도만)
const CONTENT = [
  "relative z-(--z-floating) flex flex-col overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  // 가용 폭 · 높이는 Radix 가 자리를 잰 뒤에 들어온다 — 그 전에는 320 · 480 · 600 으로 둔다
  "min-w-[min(320px,var(--radix-popover-content-available-width,320px))] max-w-[min(480px,var(--radix-popover-content-available-width,480px))]",
  "max-h-[min(600px,var(--radix-popover-content-available-height,600px))]",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 머리 — 위 24 · 좌우 24 · 아래 16 · 사이 6, 오른쪽 52(닫기). 본문이 위로 스크롤되면 안쪽 아래 1px stroke-neutral-subtle(150ms) —
// 본문이 흐림 마스크를 걸어도 선이 흐려지지 않게 머리에 그린다(Dialog 와 같다)
const HEADER = [
  "flex shrink-0 flex-col gap-x1_5 px-x6 pb-x4 pr-x13 pt-x6",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=popover-body][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");

// 닫기 — 52 투명 상자 · 아이콘 22. 아이콘이 위 27 · 오른쪽 24 에 오도록 상자를 15 당긴다. 누르면 bg-layer-floating-pressed + 2px 거리 축소(기준 52)
const CLOSE = [
  "absolute right-[calc(var(--spacing-x6)-15px)] top-[12px] flex size-13 cursor-pointer items-center justify-center",
  "rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[22px]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed [--press-basis:52] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

export interface PopoverContentProps extends Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, "title"> {
  /** 제목 — 무엇에 대한 안내인지("연차 사용 규정"). 있으면 머리와 닫기 버튼을 둔다. 고르는 패널은 두지 않고 aria-label 을 준다 */
  title?: React.ReactNode;
  /** 설명 — 머리의 제목 아래 */
  description?: React.ReactNode;
}

const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(
  (
    {
      title,
      description,
      className,
      children,
      side = "bottom",
      align = "center",
      sideOffset = 8,
      collisionPadding = 16,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onKeyDown,
      onWheel,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useContext(PopoverContext);
    const own = React.useRef<HTMLDivElement>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();
    const hasHeader = title != null;
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={mergeRefs(ref, own, ctx?.contentRef)}
          data-slot="popover-content"
          side={side}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (hasHeader ? titleId : undefined)}
          aria-describedby={description != null && hasHeader ? descriptionId : undefined}
          className={cn(CONTENT, className)}
          // 열면 초점은 내용의 첫 칸(머리 닫기 버튼이 아니라), 칸이 없으면 표면
          onOpenAutoFocus={(e) => {
            // 이름이 없으면 개발 중에 알린다(열릴 때)
            if (import.meta.env.DEV && !hasHeader && !ariaLabel?.trim() && !ariaLabelledBy) {
              console.warn('[Popover] 머리(title)가 없는 팝오버는 aria-label 로 이름을 단다(예: "날짜 고르기").', own.current);
            }
            onOpenAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            focusContent(own.current);
          }}
          // 닫힌 뒤 — 초점이 갈 곳을 잃었으면(Esc · 닫기 버튼 · 빈 자리를 누름) 트리거로. Tab 으로 나갔거나 바깥의 다른 칸을
          // 눌렀으면 그 자리에 둔다
          onCloseAutoFocus={(e) => {
            onCloseAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            const active = document.activeElement;
            if (!active || active === document.body) ctx?.triggerRef.current?.focus({ preventScroll: true });
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            const content = own.current;
            const trigger = ctx?.triggerRef.current;
            if (e.defaultPrevented || e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey || !content || !trigger) return;
            const items = tabbablesOf(content);
            const active = document.activeElement;
            if (e.shiftKey) {
              // 표면의 첫 칸(머리 닫기 버튼이 있으면 그것, 없으면 내용 첫 칸 · 표면)에서 Shift+Tab — 트리거로. 내용 첫 칸 → 닫기 버튼은 브라우저 순서 그대로
              if (items.length === 0 || active === items[0] || active === content) {
                e.preventDefault();
                trigger.focus({ preventScroll: true });
              }
              return;
            }
            // 마지막 칸에서 Tab — 초점을 트리거에 두면 브라우저가 트리거 다음 칸으로 보낸다(기본 동작은 막지 않는다)
            if (items.length === 0 || active === items[items.length - 1]) trigger.focus({ preventScroll: true });
          }}
          onWheel={(e) => {
            onWheel?.(e);
            e.stopPropagation();
          }}
          {...props}
        >
          {hasHeader && (
            <div data-slot="popover-header" className={HEADER}>
              <h2 id={titleId} data-slot="popover-title" className="m-0 text-t7 font-bold text-fg-neutral">
                {title}
              </h2>
              {description != null && (
                <p id={descriptionId} data-slot="popover-description" className="m-0 text-t4 font-normal text-fg-neutral-muted">
                  {description}
                </p>
              )}
            </div>
          )}
          {hasHeader && (
            <PopoverPrimitive.Close aria-label="닫기" data-slot="popover-close" className={CLOSE}>
              <X aria-hidden strokeWidth={2} />
            </PopoverPrimitive.Close>
          )}
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

// 본문 — Dialog 의 본문과 같다(좌우 24, 맨 앞이면 위 24 · 맨 끝이면 아래 24 · 끝에서 뒤 화면을 끌고 가지 않는다 — overscroll contain)
const BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-x6 first:pt-x6",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const BODY_PLAIN = "last:pb-x6";
// 끝 흐림(scrollFog) — 본문 안 여백 위 20(머리가 없으면 24 그대로) · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

export interface PopoverBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 끝 흐림(Scroll Fog overlayBody — 위 20 · 아래 80, 늘 켜짐) — 넘칠 수 있는 본문에만 */
  scrollFog?: boolean;
}

const PopoverBody = React.forwardRef<HTMLDivElement, PopoverBodyProps>(({ scrollFog = false, className, ...props }, ref) => {
  const own = React.useRef<HTMLDivElement>(null);
  useBodyScroll(own);
  useScrollFog(own, scrollFog ? "overlayBody" : null);
  return (
    <div
      ref={mergeRefs(ref, own)}
      data-slot="popover-body"
      data-scroll-fog={scrollFog ? "overlayBody" : undefined}
      className={cn(BODY, scrollFog ? BODY_FOG : BODY_PLAIN, className)}
      {...props}
    />
  );
});
PopoverBody.displayName = "PopoverBody";

// 바닥 — 위 16 · 좌우 24 · 아래 24, 오른쪽 정렬, 사이 8. Button small 36
const PopoverFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="popover-footer"
      className={cn("flex shrink-0 items-center justify-end gap-x2 px-x6 pb-x6 pt-x4", className)}
      {...props}
    >
      {withButtonSize(children, "small")}
    </div>
  ),
);
PopoverFooter.displayName = "PopoverFooter";

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent, PopoverBody, PopoverFooter };
