import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";
import { BottomSheet, BottomSheetSurface, BottomSheetTrigger } from "@/components/ui/bottom-sheet";

/*
 * Groo Menu Sheet — 구조는 SEED Swipeable Menu Sheet(2026-10-02). 수치 원본은 specs/components/menu-sheet.yaml.
 * Bottom Sheet(bottom-sheet.tsx — vaul) 위에 짰다.
 *
 *   MenuSheet          화면 아래에서 올라오는 동작 목록 — open · defaultOpen · onOpenChange
 *   MenuSheetTrigger   여는 버튼 — aria-haspopup="dialog" · aria-expanded. 닫으면 초점이 여기로 돌아온다
 *   MenuSheetContent   시트 — title · description(둘 다 없어도 된다) · layout(textWithIcon 기본 | textOnly).
 *                      손잡이는 늘 있고 위 닫기 버튼은 없다. 목록 뒤에 보조 기술용 닫기(키보드 초점이 오면 보인다)
 *   MenuSheetGroup     묶음 — 옅은 회색 상자(모서리 16). 묶음 사이는 10 간격만
 *   MenuSheetItem      줄 — label · description · icon · tone(neutral | critical) · disabled · onSelect. <button type="button">
 *
 * 줄의 동작은 menu.tsx 의 ResponsiveMenu 로 짠다 — 1280 미만에서 이 시트를, 이상에서 Menu 를 그린다. 늘 시트인 자리
 * (폰 전용 화면의 머리 더보기)만 MenuSheet 를 바로 쓴다.
 *
 * 줄을 누르면 시트를 먼저 닫고, 다 닫혀 초점이 트리거로 돌아온 뒤 onSelect 를 부른다 — 확인이 필요한 동작(삭제)은 그 안에서
 * Alert Dialog 를 열면 된다. 닫히는 시트와 열리는 확인창이 겹치지 않고, 확인창을 닫으면 초점이 트리거로 돌아간다(Menu 와 같다).
 * 막힌 줄(disabled)은 눌러도 실행하지 않고 닫히지 않는다 — 전용 색이고 Tab 이 서지 않는다.
 *
 * 딤 · 끌어내리기(0.4px/ms 넘게 · 높이의 25%, 열린 뒤 0.5초는 끌리지 않음) · Esc · 뒤로 가기(1280 미만) · 초점 가두기 ·
 * 뒤 화면 숨김 · 스크롤 잠금 · 쌓임(딤 100 · 시트 101) · 모션(300ms enter-expressive · 200ms exit)은 Bottom Sheet 그대로다
 * (BottomSheet · BottomSheetSurface). 다른 것은 위 모서리 20(r5) · 손잡이가 늘 있음 · 위 닫기 버튼 없음 · 머리 가운데다.
 * 열면 처음 초점은 시트(첫 줄 위)에 가고, Tab · Shift+Tab 은 줄 → 보조 기술용 닫기 → 첫 줄로 돈다.
 *
 * 이름: 제목이 있으면 aria-labelledby(제목) · 설명 aria-describedby. 제목이 없으면 aria-label, 그것도 없으면 트리거의 이름
 * ("주간 회의 메모 더보기")을 숨은 제목으로 단다 — 셋 다 없으면 개발 중에 알린다.
 *
 * 모양: 시트 위 24(손잡이 자리) · 좌우 화면 여백 24 · 아래 16 + 안전 영역. 머리는 가운데 — 제목 t6 18 / 24 · 700 ·
 * 설명 t4 fg-neutral-muted, 사이 4 · 아래 16. 묶음은 bg-neutral-weak · 모서리 16, 사이 10. 줄은 최소 52 · 위아래 14 · 좌우 16 ·
 * 아이콘 22 ↔ 이름 14, 이름 t5 400 · 설명 t3 500 fg-neutral-subtle(사이 2). 줄 사이 선은 안쪽 아래 1px stroke-neutral-weak —
 * 묶음의 마지막 줄에는 없다. 호버 · 누름은 bg-neutral-weak-pressed + 아이콘 · 글만 2px 거리 축소(기준 max(높이, 폭 ÷ 4, 24) 를
 * 누르는 순간 잰다 · 모션 줄이기면 축소하지 않는다). 그 바탕 위에서는 설명을 fg-neutral-muted 로, 위험한 줄의 이름 · 아이콘을
 * fg-critical-contrast 로 바꾼다(누름 바탕 위 4.5:1). 키보드 포커스는 줄 안쪽 2px 링.
 * textOnly 는 이름을 가운데에 두고 아이콘 · 설명을 그리지 않는다(넘겨도 개발 중에 알리고 버린다).
 * 보조 기술용 닫기는 평소 보이지 않다가(읽기 프로그램은 읽는다) 키보드 초점이 오면 위 10 · 최소 52 · 좌우 20 · 모서리 12 ·
 * bg-neutral-weak · t5 500 의 폭 전체 버튼으로 보인다.
 */

type OpenChange = (open: boolean) => void;
export type MenuSheetLayout = "textWithIcon" | "textOnly";

// ── 작은 도구 ─────────────────────────────────────────────────
// 열림 — 같은 값을 거듭 청하면(닫으면서 Radix 도 닫기를 청한다) 한 번만 알린다
function useOpenState(prop: boolean | undefined, defaultOpen: boolean | undefined, onChange: OpenChange | undefined) {
  const [inner, setInner] = React.useState(defaultOpen ?? false);
  const controlled = prop !== undefined;
  const value = controlled ? prop : inner;
  const onChangeRef = React.useRef(onChange);
  const lastRef = React.useRef(value);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
    lastRef.current = value;
  });
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next === lastRef.current) return;
      lastRef.current = next;
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );
  return [value, setOpen] as const;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로(Button · List 와 같은 식) — 콘텐츠 층이 물려받는다
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

const isPressKey = (e: React.KeyboardEvent) => e.key === " " || e.key === "Enter";

// 트리거의 이름 — aria-label, 없으면 보이는 글
function accessibleNameOf(el: HTMLElement | null) {
  if (!el) return "";
  return (el.getAttribute("aria-label") ?? el.textContent ?? "").trim();
}

// 고른 줄의 동작 — 표면이 다 닫혀 초점이 트리거로 돌아온 뒤 부른다(Menu 도 쓴다). 닫힘을 놓쳐도(표면이 통째로 사라짐) 1초 뒤에는 부른다
function usePendingSelect() {
  const pendingRef = React.useRef<{ run?: () => void; id: number } | null>(null);
  const idRef = React.useRef(0);
  const flush = React.useCallback((id?: number) => {
    const pending = pendingRef.current;
    if (!pending || (id !== undefined && pending.id !== id)) return;
    pendingRef.current = null;
    pending.run?.();
  }, []);
  const queue = React.useCallback(
    (run?: () => void) => {
      const id = ++idRef.current;
      pendingRef.current = { run, id };
      window.setTimeout(() => flush(id), 1000);
    },
    [flush],
  );
  return React.useMemo(() => ({ queue, flush }), [queue, flush]);
}

// ── 시트 문맥 ─────────────────────────────────────────────────
type MenuSheetContextValue = {
  open: boolean;
  setOpen: OpenChange;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** 줄을 골랐다 — 시트를 닫고, 다 닫히면 run 을 부른다 */
  select: (run?: () => void) => void;
  /** 닫힘이 끝났다(초점이 트리거로 돌아온 뒤) — 기다리던 동작을 부른다 */
  flushSelect: () => void;
};
const MenuSheetContext = React.createContext<MenuSheetContextValue | null>(null);

function useMenuSheet(name: string) {
  const ctx = React.useContext(MenuSheetContext);
  if (!ctx) throw new Error(`${name} 는 MenuSheet 안에 둔다.`);
  return ctx;
}

const LayoutContext = React.createContext<MenuSheetLayout>("textWithIcon");

export interface MenuSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  children?: React.ReactNode;
}

function MenuSheet({ open: openProp, defaultOpen, onOpenChange, children }: MenuSheetProps) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const pending = usePendingSelect();
  const select = React.useCallback(
    (run?: () => void) => {
      pending.queue(run);
      setOpen(false);
    },
    [pending, setOpen],
  );
  const flushSelect = React.useCallback(() => pending.flush(), [pending]);
  const value = React.useMemo(() => ({ open, setOpen, triggerRef, select, flushSelect }), [open, setOpen, select, flushSelect]);
  return (
    <MenuSheetContext.Provider value={value}>
      {/* 입력 폼이 아니라서 바깥(딤) 누르기 · 끌어내리기로 닫힌다 — 끌기는 시트 어디서나(손잡이만이 아니다) */}
      <BottomSheet open={open} onOpenChange={setOpen}>
        {children}
      </BottomSheet>
    </MenuSheetContext.Provider>
  );
}
MenuSheet.displayName = "MenuSheet";

const MenuSheetTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof BottomSheetTrigger>>(
  (props, ref) => {
    const ctx = useMenuSheet("MenuSheetTrigger");
    // aria-haspopup="dialog" · aria-expanded · aria-controls 는 Bottom Sheet 의 트리거(Radix Dialog)가 단다
    return <BottomSheetTrigger ref={mergeRefs(ref, ctx.triggerRef)} data-slot="menu-sheet-trigger" {...props} />;
  },
);
MenuSheetTrigger.displayName = "MenuSheetTrigger";

// ── 모양 ─────────────────────────────────────────────────────
// 시트 — Bottom Sheet 의 바탕 위에 모서리 20 · 위 24(손잡이 자리) · 좌우 화면 여백 · 아래 16 + 안전 영역
const SURFACE = "rounded-t-r5 px-global-gutter pt-x6 pb-[calc(var(--spacing-x4)+env(safe-area-inset-bottom))]";

// 목록 — 묶음 사이 10. 화면의 90% 를 넘으면 목록만 스크롤한다(머리는 그대로)
const LIST = "flex min-h-0 flex-col gap-x2_5 overflow-y-auto";

// 보조 기술용 닫기 — 평소에는 화면에서 숨기고(읽기 프로그램은 읽는다), 키보드 초점이 오면 폭 전체 버튼으로 보인다
const CLOSE = [
  "absolute -m-px size-px shrink-0 overflow-hidden whitespace-nowrap border-0 p-0 [clip-path:inset(50%)]",
  "cursor-pointer bg-bg-neutral-weak font-sans text-t5 font-medium text-fg-neutral",
  "focus-visible:relative focus-visible:m-0 focus-visible:mt-x2_5 focus-visible:flex focus-visible:h-auto focus-visible:min-h-13 focus-visible:w-full",
  "focus-visible:items-center focus-visible:justify-center focus-visible:overflow-visible focus-visible:whitespace-normal focus-visible:[clip-path:none]",
  "focus-visible:rounded-r3 focus-visible:px-x5",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed",
].join(" ");

export interface MenuSheetContentProps extends Omit<React.ComponentPropsWithoutRef<typeof BottomSheetSurface>, "title" | "handle"> {
  /** 제목 — 무엇의 동작인지("주간 회의 메모"). 없으면 aria-label, 그것도 없으면 트리거의 이름을 숨은 제목으로 단다 */
  title?: React.ReactNode;
  /** 설명 — 제목만으로 모자랄 때만 */
  description?: React.ReactNode;
  /** textWithIcon(기본) — 아이콘 + 글, 글은 왼쪽. textOnly — 글만 가운데(줄 설명 · 아이콘을 두지 않는다). 한 시트에서 섞지 않는다 */
  layout?: MenuSheetLayout;
}

const MenuSheetContent = React.forwardRef<React.ElementRef<typeof BottomSheetSurface>, MenuSheetContentProps>(
  ({ title, description, layout = "textWithIcon", className, children, onCloseAutoFocus, "aria-label": ariaLabel, ...props }, ref) => {
    const ctx = useMenuSheet("MenuSheetContent");
    const hasTitle = title != null;
    const hasHeader = hasTitle || description != null;
    // 제목이 없을 때의 이름 — aria-label, 없으면 트리거의 이름(열 때마다 다시 읽는다 — 줄 이름이 바뀔 수 있다)
    const [triggerName, setTriggerName] = React.useState("");
    React.useLayoutEffect(() => {
      if (ctx.open) setTriggerName(accessibleNameOf(ctx.triggerRef.current));
    }, [ctx.open, ctx.triggerRef]);
    const hiddenName = hasTitle ? "" : (ariaLabel?.trim() || triggerName);
    React.useEffect(() => {
      if (import.meta.env.DEV && ctx.open && !hasTitle && !ariaLabel?.trim() && !accessibleNameOf(ctx.triggerRef.current)) {
        console.warn('[MenuSheet] 제목이 없으면 aria-label 로 이름을 단다(예: "주간 회의 메모") — 트리거에도 이름이 없다.', ctx.triggerRef.current);
      }
    }, [ctx.open, ctx.triggerRef, hasTitle, ariaLabel]);
    return (
      <LayoutContext.Provider value={layout}>
        <BottomSheetSurface
          ref={ref}
          handle="always"
          data-slot="menu-sheet-content"
          data-layout={layout}
          // 설명이 없으면 aria-describedby 를 걷는다(가리킬 곳이 없다)
          {...(description == null ? { "aria-describedby": undefined } : null)}
          className={cn(SURFACE, className)}
          // 다 닫혔다 — 바탕이 초점을 트리거로 돌린 뒤(같은 처리 안에서 이어진다) 고른 줄의 동작을 부른다
          onCloseAutoFocus={(e) => {
            onCloseAutoFocus?.(e);
            queueMicrotask(ctx.flushSelect);
          }}
          {...props}
        >
          {hasHeader && (
            <div data-slot="menu-sheet-header" className="flex shrink-0 flex-col gap-x1 pb-x4 text-center">
              {hasTitle && (
                <DrawerPrimitive.Title data-slot="menu-sheet-title" className="m-0 text-t6 font-bold text-fg-neutral">
                  {title}
                </DrawerPrimitive.Title>
              )}
              {description != null && (
                <DrawerPrimitive.Description data-slot="menu-sheet-description" className="m-0 text-t4 font-normal text-fg-neutral-muted">
                  {description}
                </DrawerPrimitive.Description>
              )}
            </div>
          )}
          {/* 보이는 제목이 없을 때 — aria-label 이나 트리거의 이름을 숨은 제목으로(Radix Dialog 는 제목을 찾는다) */}
          {!hasTitle && <DrawerPrimitive.Title className="sr-only">{hiddenName}</DrawerPrimitive.Title>}
          <div data-slot="menu-sheet-list" className={LIST}>
            {children}
          </div>
          <button type="button" data-slot="menu-sheet-close" className={CLOSE} onClick={() => ctx.setOpen(false)}>
            닫기
          </button>
        </BottomSheetSurface>
      </LayoutContext.Provider>
    );
  },
);
MenuSheetContent.displayName = "MenuSheetContent";

// 묶음 — 옅은 회색 상자 · 모서리 16. 줄의 링은 줄 안쪽이라 상자가 자르지 않는다
const MenuSheetGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="menu-sheet-group"
    className={cn("flex shrink-0 flex-col overflow-hidden rounded-r4 bg-bg-neutral-weak", className)}
    {...props}
  />
));
MenuSheetGroup.displayName = "MenuSheetGroup";

// 줄 — 최소 52 · 위아래 14 · 좌우 16. 줄 사이 선은 안쪽 아래 1px(묶음의 마지막 줄에는 없다). 호버 · 누름 바탕은 막히지 않은 줄만
const ITEM = [
  "group/menu-sheet-item relative flex min-h-13 w-full shrink-0 cursor-pointer select-none items-center border-0 bg-transparent px-x4 py-x3_5 font-sans",
  "not-last:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed",
].join(" ");
const ITEM_ENABLED = "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed";

// 콘텐츠 층 — 아이콘 22 ↔ 글 14. 누르는 동안만 준다(바탕은 그대로)
const ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-x3_5 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS =
  "group-active/menu-sheet-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/menu-sheet-item:[scale:1]";

// 글자색 — 쉴 때 · 호버 · 누름(누름 바탕 위 4.5:1). 막힌 줄은 전용 색 하나
const TONE = {
  neutral: {
    fg: "text-fg-neutral",
    description: "text-fg-neutral-subtle group-hover/menu-sheet-item:text-fg-neutral-muted group-active/menu-sheet-item:text-fg-neutral-muted",
  },
  critical: {
    fg: "text-fg-critical group-hover/menu-sheet-item:text-fg-critical-contrast group-active/menu-sheet-item:text-fg-critical-contrast",
    description: "text-fg-neutral-subtle group-hover/menu-sheet-item:text-fg-neutral-muted group-active/menu-sheet-item:text-fg-neutral-muted",
  },
} as const;

export interface MenuSheetItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect" | "children"> {
  /** 이름 — 동사로 짧게(Menu 와 같다) */
  label: React.ReactNode;
  /** 설명 — 이름이 추상적이라 잘못 누를 수 있을 때만. textOnly 에서는 두지 않는다 */
  description?: React.ReactNode;
  /** 앞 아이콘(lucide) — 모든 줄에 두거나 모두 뺀다. textOnly 에서는 두지 않는다 */
  icon?: React.ReactNode;
  /** critical — 되돌릴 수 없는 동작(삭제 · 나가기). 이름 · 아이콘만 빨갛다 */
  tone?: "neutral" | "critical";
  /** 시트가 다 닫히고 초점이 트리거로 돌아온 뒤 부른다 */
  onSelect?: () => void;
}

const MenuSheetItem = React.forwardRef<HTMLButtonElement, MenuSheetItemProps>(
  ({ label, description, icon, tone = "neutral", disabled = false, onSelect, className, onClick, onPointerDown, onKeyDown, ...props }, ref) => {
    const ctx = useMenuSheet("MenuSheetItem");
    const layout = React.useContext(LayoutContext);
    const textOnly = layout === "textOnly";
    React.useEffect(() => {
      if (import.meta.env.DEV && textOnly && (icon != null || description != null)) {
        console.warn("[MenuSheet] textOnly 시트의 줄에는 아이콘 · 설명을 두지 않는다 — 그리지 않는다.", label);
      }
    }, [textOnly, icon, description, label]);
    // 누른 자리 — 끌거나 줄 밖에서 떼면 실행하지 않는다(아래 onClick)
    const downRef = React.useRef<{ x: number; y: number } | null>(null);
    const colors = TONE[tone];
    const fg = disabled ? "text-fg-disabled" : colors.fg;
    const descriptionColor = disabled ? "text-fg-disabled" : colors.description;
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        data-slot="menu-sheet-item"
        data-tone={tone}
        className={cn(ITEM, !disabled && ITEM_ENABLED, className)}
        onPointerDown={(e) => {
          measurePress(e.currentTarget);
          downRef.current = { x: e.clientX, y: e.clientY };
          onPointerDown?.(e);
        }}
        onKeyDown={(e) => {
          if (isPressKey(e)) measurePress(e.currentTarget);
          onKeyDown?.(e);
        }}
        onClick={(e) => {
          onClick?.(e);
          const down = downRef.current;
          downRef.current = null;
          if (e.defaultPrevented || disabled) return;
          // 포인터로 누른 채 끌었거나(시트를 끌어내리다 놓음) 줄 밖에서 뗐다 — 실행하지 않는다. vaul 이 누른 줄에 포인터를 붙잡아
          // 두어 어디서 떼든 이 줄에 click 이 온다(버튼이 원래 하는 "밖에서 떼면 취소"가 사라진다)
          if (e.detail > 0) {
            const r = e.currentTarget.getBoundingClientRect();
            const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
            const dragged = down !== null && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10;
            if (outside || dragged) return;
          }
          ctx.select(onSelect);
        }}
        {...props}
      >
        <span data-slot="menu-sheet-item-content" className={cn(ITEM_CONTENT, textOnly && "justify-center", !disabled && ITEM_CONTENT_PRESS)}>
          {!textOnly && icon != null && (
            <span aria-hidden data-slot="menu-sheet-item-icon" className={cn("flex shrink-0 [&>svg]:size-[22px]", fg)}>
              {icon}
            </span>
          )}
          <span
            className={cn(
              "flex min-w-0 flex-col gap-x0_5 break-keep [overflow-wrap:break-word]",
              textOnly ? "items-center text-center" : "flex-1 items-start text-left",
            )}
          >
            <span data-slot="menu-sheet-item-label" className={cn("text-t5 font-normal", fg)}>
              {label}
            </span>
            {!textOnly && description != null && (
              <span data-slot="menu-sheet-item-description" className={cn("text-t3 font-medium", descriptionColor)}>
                {description}
              </span>
            )}
          </span>
        </span>
      </button>
    );
  },
);
MenuSheetItem.displayName = "MenuSheetItem";

export { MenuSheet, MenuSheetTrigger, MenuSheetContent, MenuSheetGroup, MenuSheetItem, usePendingSelect };
