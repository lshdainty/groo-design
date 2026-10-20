import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";
import { useInputButtonSurface } from "@/components/ui/input-button";
import {
  MenuSheet,
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetTrigger,
  usePendingSelect,
  type MenuSheetLayout,
} from "@/components/ui/menu-sheet";

/*
 * Groo Menu — 구조는 SEED Menu(small, 2026-10-02). 수치 원본은 specs/components/menu.yaml. Radix DropdownMenu 위(비모달)에 짰다.
 *
 *   Menu              트리거에 붙어 여는 동작 목록 — open · defaultOpen · onOpenChange
 *   MenuTrigger       여는 버튼(⋮ — Button ghost · iconOnly, 이름 "{줄 이름} 더보기") — aria-haspopup="menu" · aria-expanded,
 *                     열린 동안 aria-controls
 *   MenuContent       메뉴 — 폭 200 · 모서리 20 · s3 · 위아래 8 · z-floating 200. 트리거 아래 8(모자라면 위 · 옆), 화면 가장자리와 8.
 *                     트리거의 오른쪽 끝에 맞춘다(align end — 줄 끝 ⋮ · 머리 더보기, SEED 기본은 가운데). 왼쪽에 놓인 트리거는
 *                     align="start". 모자라면 화면 안으로 민다
 *   MenuGroup         묶음 — 묶음 사이에만 선(좌우 16 들임, 8 + 1 + 8 · stroke-neutral-subtle). 선은 장식이라 보조 기술에 없다
 *   MenuGroupLabel    묶음 이름 — 묶음이 무엇인지 말해야 할 때만. 묶음의 aria-labelledby 가 된다
 *   MenuItem          줄 — label · description · icon · suffixIcon · tone(neutral | critical) · disabled · onSelect
 *
 *   ResponsiveMenu · ResponsiveMenuTrigger · ResponsiveMenuContent · ResponsiveMenuGroup · ResponsiveMenuItem
 *                     줄의 동작은 이것으로 짠다 — 1280 이상 Menu, 미만 Menu Sheet(menu-sheet.tsx). 경계는 Dialog · Input Button 과
 *                     같은 useInputButtonSurface 다. 열림은 ResponsiveMenu 가 들고 있어 열린 채 폭이 바뀌어도 새 표면으로 이어진다.
 *                     title · description · layout 은 Menu Sheet 에만 쓰인다(메뉴에는 머리가 없다), suffixIcon 은 메뉴에만.
 *
 * 메뉴는 실행만 한다 — 고른 표시(체크 · 라디오) · 단축키 · 하위 메뉴가 없다. 값을 고르는 일은 Select · Segmented Control 이다.
 *
 * 키보드(WAI-ARIA 메뉴 버튼) — 트리거에서 Enter · Space · ↓ 는 열고 첫 줄로, ↑ 는 마지막 줄로. ↓ ↑ 는 끝에서 처음으로 돌고
 * Home · End 는 첫 줄 · 마지막 줄, 글자는 그 글자로 시작하는 줄로 간다. 막힌 줄은 건너뛴다. Enter · Space 는 실행하고 닫는다.
 * Esc 는 닫고 초점을 트리거로. Tab 은 닫고 트리거 다음 칸으로, Shift+Tab 은 닫고 트리거로(메뉴는 트리거 바로 뒤다).
 * 포인터로 열면 초점은 메뉴(컨테이너)에 가고 링을 그리지 않는다 — 그다음 ↓ · End · 글자로 줄에 들어간다.
 *
 * 호버와 키보드 위치를 따로 그린다 — 마우스를 올린 줄은 좌우 8 들인 알약 바탕(bg-layer-floating-pressed · 모서리 12 — 줄 폭 전체에서
 * 들어오며 150ms 에 둥글어진다),
 * 키보드로 옮긴 줄은 같은 자리에 안쪽 2px 링(바탕 없음). 호버는 초점을 옮기지 않는다(Radix 는 포인터를 따라 초점을 옮긴다 —
 * 줄의 pointermove · pointerleave 에서 그 처리를 건너뛴다). 그래서 둘이 서로 다른 줄에 함께 보일 수 있다.
 * 누르면 알약 + 아이콘 · 글만 2px 거리 축소(기준 max(높이, 폭 ÷ 4, 24) 를 누르는 순간 잰다 · 모션 줄이기면 축소하지 않는다).
 * 막힌 줄은 fg-disabled · 알약 없음 · aria-disabled — 눌러도 실행하지 않고 닫히지 않는다.
 * 위험한 줄(critical)은 이름 · 아이콘만 fg-critical, 설명은 fg-neutral-subtle 그대로.
 *
 * 고르면 메뉴를 닫고, 다 닫혀 초점이 트리거로 돌아온 뒤 onSelect 를 부른다(Menu Sheet 와 같다). 확인이 필요한 동작은 onSelect 안에서
 * Alert Dialog 를 열면 된다 — 닫히는 메뉴와 열리는 확인창이 겹치지 않고, 확인창은 트리거를 연 자리로 알아 닫으면 초점이 ⋮ 로 돌아온다.
 * 비모달이라 뒤 화면을 숨기지 않고 스크롤도, 포인터(body 의 pointer-events)도 잠그지 않는다 — 옛 모달 메뉴의 잠금이 남는 문제가 없다.
 *
 *   const [asking, setAsking] = React.useState(false)
 *   <MenuItem label="삭제" tone="critical" onSelect={() => setAsking(true)} />
 *   <AlertDialog open={asking} onOpenChange={setAsking}>…</AlertDialog>
 *
 * 바깥을 누르면 닫는다 — 다른 칸을 눌러 초점이 거기로 갔으면 그대로, 갈 곳을 잃었으면 트리거로. 대화상자 · 시트 안에서도 그 위(z 200)에
 * 뜨고, Esc · 바깥 누르기는 메뉴만 닫는다 — 그 표면의 딤을 눌러도 메뉴만 닫히고 표면은 남는다(맨 위 표면 하나만, Esc 와 같다).
 * 휠 스크롤은 메뉴 안에서 멈춘다(대화상자의 스크롤 잠금이 막지 않게).
 *
 * 모양: 폭 200(글이 길면 줄을 바꾼다 — 단어 단위, 말줄임 없음). 높이는 min(480, 남은 화면) — 남은 화면이 200 보다 좁아도 200 은 둔다.
 * 자리를 재기 전의 높이를 200 으로 두어, 아래가 200 이상 남으면 줄여서 아래에 두고 200 아래일 때만 위로 뒤집는다(SEED — Radix 는
 * 뒤집기를 먼저 재므로 처음 잴 때 높이를 200 으로 준다). 줄은 위아래 10 · 좌우 16 · 아이콘 18 ↔ 이름 8, 이름 t4 14 / 19 · 설명 t2
 * fg-neutral-subtle(사이 2) — 한 줄 39, 설명이 있으면 57. 뒤 아이콘 16. 묶음 이름 t3 fg-neutral-subtle · 위아래 8 · 좌우 16.
 * 모션: 150ms enter 로 트리거 쪽 변에서 0.95 → 1 · 투명도, 100ms exit 로 0.95 · 투명도(모션 줄이기면 투명도만).
 */

type OpenChange = (open: boolean) => void;

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

// 메뉴 안의 막히지 않은 줄 — 문서 순서대로
const enabledItemsOf = (content: HTMLElement | null) =>
  content ? Array.from(content.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])')) : [];

// ── 메뉴 문맥 ─────────────────────────────────────────────────
type MenuContextValue = {
  open: boolean;
  setOpen: OpenChange;
  /** 트리거의 id — 쓰는 쪽이 트리거에 id 를 주면 Radix 가 단 id 를 덮으므로 그려진 것을 읽는다(메뉴의 aria-labelledby) */
  triggerId: string | undefined;
  setTriggerId: (id: string | undefined) => void;
  openRef: React.RefObject<boolean>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  /** ↑ 로 열었다 — 처음 초점을 마지막 줄에 */
  focusLastRef: React.MutableRefObject<boolean>;
  /** Tab 으로 닫았다 — 초점은 브라우저가 옮긴 자리에 둔다 */
  tabbedOutRef: React.MutableRefObject<boolean>;
  /** 줄을 골랐다 — 다 닫히면 run 을 부른다(닫기는 Radix 가 한다) */
  queueSelect: (run?: () => void) => void;
  flushSelect: () => void;
};
const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenu(name: string) {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error(`${name} 는 Menu 안에 둔다.`);
  return ctx;
}

export interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  children?: React.ReactNode;
}

function Menu({ open: openProp, defaultOpen, onOpenChange, children }: MenuProps) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const openRef = React.useRef(open);
  React.useLayoutEffect(() => {
    openRef.current = open;
  });
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const focusLastRef = React.useRef(false);
  const tabbedOutRef = React.useRef(false);
  const [triggerId, setTriggerId] = React.useState<string | undefined>(undefined);
  const pending = usePendingSelect();
  const value = React.useMemo<MenuContextValue>(
    () => ({ open, setOpen, triggerId, setTriggerId, openRef, triggerRef, focusLastRef, tabbedOutRef, queueSelect: pending.queue, flushSelect: () => pending.flush() }),
    [open, setOpen, triggerId, pending],
  );
  return (
    <MenuContext.Provider value={value}>
      {/* 비모달 — 뒤 화면을 숨기지 않고 스크롤 · 포인터를 잠그지 않는다 */}
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
        {children}
      </DropdownMenuPrimitive.Root>
    </MenuContext.Provider>
  );
}
Menu.displayName = "Menu";

const MenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ onKeyDown, ...props }, ref) => {
  const ctx = useMenu("MenuTrigger");
  const { setTriggerId } = ctx;
  React.useLayoutEffect(() => {
    setTriggerId(ctx.triggerRef.current?.id || undefined);
  });
  return (
    <DropdownMenuPrimitive.Trigger
      ref={mergeRefs(ref, ctx.triggerRef)}
      data-slot="menu-trigger"
      {...props}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        // ↑ — 열고 마지막 줄로(Radix 는 ↑ 로 열지 않는다). Enter · Space · ↓ 는 Radix 가 열고 첫 줄로 간다
        if (e.defaultPrevented || ctx.open || e.key !== "ArrowUp" || e.altKey || e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        ctx.focusLastRef.current = true;
        ctx.setOpen(true);
      }}
    />
  );
});
MenuTrigger.displayName = "MenuTrigger";

// ── 모양 ─────────────────────────────────────────────────────
// 메뉴 — 폭 200 · 모서리 20 · 떠 있는 바탕 + s3 · z-floating 200. 열 때 150ms enter · 닫을 때 100ms exit 로 0.95 ↔ 1 · 투명도,
// 트리거 쪽 변에서 커진다. 모션 줄이기면 투명도만(크기는 motion-safe 에서만). 길이는 --tw-animation-duration 으로 준다 —
// duration-* 는 transition-duration 도 바꿔(transition-property 의 처음 값은 all) 테마를 바꿀 때 색까지 번지게 한다
const CONTENT = [
  "z-(--z-floating) w-[200px] overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-dropdown-menu-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 스크롤 자리 — 위아래 8 · 묶음 사이 8. 높이는 min(480, max(200, 남은 화면)) — 자리를 재기 전에는 200(위 머리 주석)
const SCROLL =
  "relative flex max-h-[min(480px,max(200px,var(--radix-dropdown-menu-content-available-height,200px)))] flex-col gap-x2 overflow-y-auto py-x2";

// 묶음 — 둘째 묶음부터 위에 1px 선(좌우 16 들임 · 아래 8). 위쪽 8 은 스크롤 자리의 gap — 묶음 사이 8 + 1 + 8 = 17
const GROUP =
  "flex flex-col [[data-slot=menu-group]+&]:before:mx-x4 [[data-slot=menu-group]+&]:before:mb-x2 [[data-slot=menu-group]+&]:before:h-px [[data-slot=menu-group]+&]:before:shrink-0 [[data-slot=menu-group]+&]:before:bg-stroke-neutral-subtle [[data-slot=menu-group]+&]:before:content-['']";

// 줄 — 위아래 10 · 좌우 16. 키보드 위치는 ::after 의 링(알약 자리 · 안쪽 2px, 바탕 없음)
const ITEM = [
  "group/menu-item relative flex cursor-pointer select-none items-center px-x4 py-x2_5 outline-none scroll-my-x2",
  "after:pointer-events-none after:absolute after:inset-y-0 after:inset-x-x2 after:rounded-r3 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
  "data-[disabled]:cursor-not-allowed",
].join(" ");

// 알약 — 줄은 그대로, 마우스를 올리거나(마우스가 있는 기기에서만) 누르면 줄 폭 전체에서 좌우 0 → 8 들어오며 모서리 0 → 12 로
// 둥글어지고 칠해진다 — 150ms(SEED menu-item, 2026-10-15 Q-009-3 안 B). 떠나면 거꾸로 펴지며 투명해진다. 막힌 줄에는 없다
const PILL =
  "pointer-events-none absolute inset-y-0 inset-x-0 rounded-none bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const PILL_ON =
  "group-hover/menu-item:inset-x-x2 group-hover/menu-item:rounded-r3 group-hover/menu-item:bg-bg-layer-floating-pressed group-active/menu-item:inset-x-x2 group-active/menu-item:rounded-r3 group-active/menu-item:bg-bg-layer-floating-pressed";

// 콘텐츠 층 — 아이콘 18 ↔ 글 8. 누르는 동안만 준다(알약은 그대로)
const ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-x2 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS =
  "group-active/menu-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/menu-item:[scale:1]";

export interface MenuContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>, "sideOffset" | "collisionPadding" | "loop" | "asChild"> {}

const MenuContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Content>, MenuContentProps>(
  ({ className, children, align = "end", onFocus, onCloseAutoFocus, onKeyDownCapture, onWheel, ...props }, ref) => {
    const ctx = useMenu("MenuContent");
    const own = React.useRef<HTMLDivElement>(null);
    const { open, setOpen, triggerRef } = ctx;
    // 대화상자 · 시트 안에서 연 메뉴 — 그 표면의 바깥(딤)을 누르면 메뉴만 닫는다(Esc 와 같이 맨 위 표면 하나만).
    // Radix 는 메뉴와 아래 표면을 함께 닫는다 — 그 누름을 문서에서 먼저 받아 아래 표면에 닿지 않게 한다
    React.useEffect(() => {
      if (!open) return;
      const host = triggerRef.current?.closest<HTMLElement>('[role="dialog"][aria-modal="true"]');
      if (!host) return;
      const doc = host.ownerDocument;
      const onPointerDown = (e: PointerEvent) => {
        const target = e.target instanceof Node ? e.target : null;
        if (!target || host.contains(target) || own.current?.contains(target)) return;
        e.stopPropagation();
        e.preventDefault();
        setOpen(false);
      };
      // 메뉴를 연 누름이 곧바로 잡히지 않게 다음 차례에 단다(Radix 와 같다)
      const timer = window.setTimeout(() => doc.addEventListener("pointerdown", onPointerDown, true), 0);
      return () => {
        window.clearTimeout(timer);
        doc.removeEventListener("pointerdown", onPointerDown, true);
      };
    }, [open, setOpen, triggerRef]);
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={mergeRefs(ref, own)}
          data-slot="menu-content"
          aria-labelledby={ctx.triggerId}
          align={align}
          sideOffset={8}
          collisionPadding={8}
          loop
          className={cn(CONTENT, className)}
          // 키로 열어 메뉴에 초점이 들어왔다 — Radix 는 이어서 첫 줄로 보낸다. ↑ 로 열었으면 그 처리를 건너뛰고 마지막 줄로
          // (긴 메뉴면 목록이 그 줄까지 스크롤된다)
          onFocus={(e) => {
            onFocus?.(e);
            if (e.defaultPrevented || e.target !== e.currentTarget || !ctx.focusLastRef.current) return;
            ctx.focusLastRef.current = false;
            const items = enabledItemsOf(own.current);
            const last = items[items.length - 1];
            if (!last) return;
            e.preventDefault();
            last.focus();
          }}
          onCloseAutoFocus={(e) => {
            onCloseAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            // 아직 열려 있다 — 폭이 1280 아래로 내려가 Menu Sheet 로 바뀌어 다시 뜬다(ResponsiveMenu). 초점은 새 표면이 가져간다
            if (ctx.openRef.current) return;
            if (ctx.tabbedOutRef.current) {
              ctx.tabbedOutRef.current = false;
            } else {
              // 초점이 갈 곳을 잃었으면(고르기 · Esc · 빈 자리를 누름) 트리거로. 바깥의 다른 칸을 눌렀으면 그 자리에 둔다
              const active = document.activeElement;
              const trigger = ctx.triggerRef.current;
              if ((!active || active === document.body) && trigger?.isConnected) trigger.focus({ preventScroll: true });
            }
            // 다 닫혔다 — 고른 줄의 동작을 부른다(초점이 트리거로 돌아온 뒤)
            ctx.flushSelect();
          }}
          // Radix 메뉴는 Tab 을 막는다 — 잡는 단계에서 넘겨받아 닫고, 브라우저의 Tab 이 트리거 다음 칸으로 가게 한다
          onKeyDownCapture={(e) => {
            onKeyDownCapture?.(e);
            if (e.defaultPrevented || e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
            // 전파를 끊어 Radix 의 Tab 처리(기본 동작 막기)를 건너뛴다 — 기본 동작은 살린다
            e.stopPropagation();
            const trigger = ctx.triggerRef.current;
            ctx.tabbedOutRef.current = true;
            if (e.shiftKey) {
              // Shift+Tab — 트리거로(메뉴는 트리거 바로 뒤다)
              e.preventDefault();
              trigger?.focus({ preventScroll: true });
            } else {
              // 트리거에 초점을 두면 브라우저의 Tab 이 트리거 다음 칸으로 간다(메뉴는 문서 끝에 있다)
              trigger?.focus({ preventScroll: true });
            }
            ctx.setOpen(false);
          }}
          // 휠은 메뉴에서 멈춘다 — 대화상자 안이면 그 스크롤 잠금이 문서에서 휠을 막는다
          onWheel={(e) => {
            onWheel?.(e);
            e.stopPropagation();
          }}
          {...props}
        >
          <div data-slot="menu-scroll" className={SCROLL}>
            {children}
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  },
);
MenuContent.displayName = "MenuContent";

// ── 묶음 ─────────────────────────────────────────────────────
type GroupContextValue = { setLabelId: (id: string | null) => void };
const GroupContext = React.createContext<GroupContextValue | null>(null);

// 묶음 — role="group". 묶음 이름(MenuGroupLabel)이 있으면 그 이름으로 aria-labelledby
const MenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>(({ className, ...props }, ref) => {
  const [labelId, setLabelId] = React.useState<string | null>(null);
  const value = React.useMemo(() => ({ setLabelId }), []);
  return (
    <GroupContext.Provider value={value}>
      <DropdownMenuPrimitive.Group
        ref={ref}
        data-slot="menu-group"
        aria-labelledby={labelId ?? undefined}
        className={cn(GROUP, className)}
        {...props}
      />
    </GroupContext.Provider>
  );
});
MenuGroup.displayName = "MenuGroup";

// 묶음 이름 — t3 · fg-neutral-subtle · 위아래 8 · 좌우 16. 누를 수 없다
const MenuGroupLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, id: idProp, ...props }, ref) => {
  const group = React.useContext(GroupContext);
  const auto = React.useId();
  const id = idProp ?? auto;
  React.useLayoutEffect(() => {
    group?.setLabelId(id);
    return () => group?.setLabelId(null);
  }, [group, id]);
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      id={id}
      data-slot="menu-group-label"
      className={cn("select-none px-x4 py-x2 text-t3 font-normal text-fg-neutral-subtle break-keep [overflow-wrap:break-word]", className)}
      {...props}
    />
  );
});
MenuGroupLabel.displayName = "MenuGroupLabel";

// ── 줄 ───────────────────────────────────────────────────────
export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "children"> {
  /** 이름 — 동사로 짧게(2 ~ 6자). 글자로 찾기가 이 글을 쓴다 */
  label: string;
  /** 설명 — 이름만으로 무엇을 하는지 모를 줄에만 한 줄로 */
  description?: React.ReactNode;
  /** 앞 아이콘(lucide) — 모든 줄에 두거나 모두 뺀다. 뒤 아이콘과 함께 두지 않는다 */
  icon?: React.ReactNode;
  /** 뒤 아이콘 — 바깥 링크처럼 방향을 알릴 때만 */
  suffixIcon?: React.ReactNode;
  /** critical — 되돌릴 수 없는 동작(삭제 · 나가기). 맨 아래 묶음에 */
  tone?: "neutral" | "critical";
  /** 막힌 줄 — 눌러도 실행하지 않고 닫히지 않는다. 화살표 키가 건너뛴다 */
  disabled?: boolean;
  /** 메뉴가 다 닫히고 초점이 트리거로 돌아온 뒤 부른다 */
  onSelect?: () => void;
}

const MenuItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>, MenuItemProps>(
  (
    { label, description, icon, suffixIcon, tone = "neutral", disabled = false, onSelect, className, onPointerMove, onPointerLeave, onPointerDown, ...props },
    ref,
  ) => {
    const ctx = useMenu("MenuItem");
    const fg = disabled ? "text-fg-disabled" : tone === "critical" ? "text-fg-critical" : "text-fg-neutral";
    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        data-slot="menu-item"
        data-tone={tone}
        disabled={disabled}
        textValue={label}
        className={cn(ITEM, className)}
        onSelect={() => ctx.queueSelect(onSelect)}
        // 호버는 알약만 — Radix 가 포인터를 따라 초점(키보드 위치)을 옮기는 처리를 건너뛴다(줄을 떠날 때 메뉴로 초점을 돌리는 것도)
        onPointerMove={(e) => {
          onPointerMove?.(e);
          e.preventDefault();
        }}
        onPointerLeave={(e) => {
          onPointerLeave?.(e);
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          measurePress(e.currentTarget);
          onPointerDown?.(e);
        }}
        {...props}
      >
        <span aria-hidden data-slot="menu-item-pill" className={cn(PILL, !disabled && PILL_ON)} />
        <span data-slot="menu-item-content" className={cn(ITEM_CONTENT, !disabled && ITEM_CONTENT_PRESS)}>
          {icon != null && (
            <span aria-hidden data-slot="menu-item-icon" className={cn("flex shrink-0 [&>svg]:size-[18px]", fg)}>
              {icon}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col items-start gap-x0_5 text-left break-keep [overflow-wrap:break-word]">
            <span data-slot="menu-item-label" className={cn("text-t4 font-normal", fg)}>
              {label}
            </span>
            {description != null && (
              <span data-slot="menu-item-description" className={cn("text-t2 font-normal", disabled ? "text-fg-disabled" : "text-fg-neutral-subtle")}>
                {description}
              </span>
            )}
          </span>
          {suffixIcon != null && (
            <span aria-hidden data-slot="menu-item-suffix-icon" className={cn("flex shrink-0 [&>svg]:size-4", fg)}>
              {suffixIcon}
            </span>
          )}
        </span>
      </DropdownMenuPrimitive.Item>
    );
  },
);
MenuItem.displayName = "MenuItem";

// ── Responsive Menu ──────────────────────────────────────────
const ResponsiveContext = React.createContext<{ wide: boolean } | null>(null);

function useResponsive(name: string) {
  const ctx = React.useContext(ResponsiveContext);
  if (!ctx) throw new Error(`${name} 는 ResponsiveMenu 안에 둔다.`);
  return ctx;
}

// 1280 이상 Menu · 미만 Menu Sheet. 열림은 여기서 든다 — 열린 채 폭이 바뀌어도 새 표면으로 이어진다
function ResponsiveMenu({ open: openProp, defaultOpen, onOpenChange, children }: MenuProps) {
  const wide = useInputButtonSurface() === "popover";
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const value = React.useMemo(() => ({ wide }), [wide]);
  return (
    <ResponsiveContext.Provider value={value}>
      {wide ? (
        <Menu open={open} onOpenChange={setOpen}>
          {children}
        </Menu>
      ) : (
        <MenuSheet open={open} onOpenChange={setOpen}>
          {children}
        </MenuSheet>
      )}
    </ResponsiveContext.Provider>
  );
}
ResponsiveMenu.displayName = "ResponsiveMenu";

const ResponsiveMenuTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>>(
  (props, ref) => {
    const { wide } = useResponsive("ResponsiveMenuTrigger");
    return wide ? <MenuTrigger ref={ref} {...props} /> : <MenuSheetTrigger ref={ref} {...props} />;
  },
);
ResponsiveMenuTrigger.displayName = "ResponsiveMenuTrigger";

export interface ResponsiveMenuContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Menu Sheet 의 제목 — 무엇의 동작인지("주간 회의 메모"). 1280 이상 메뉴에는 머리가 없다 */
  title?: React.ReactNode;
  /** Menu Sheet 의 설명 */
  description?: React.ReactNode;
  /** Menu Sheet 의 정렬 — textWithIcon(기본, 아이콘이 없어도 글은 왼쪽 · 설명을 그린다) | textOnly */
  layout?: MenuSheetLayout;
  /** 메뉴의 자리(1280 이상) — 기본 아래 · 트리거 오른쪽 끝(end). 왼쪽에 놓인 트리거는 start */
  side?: MenuContentProps["side"];
  align?: MenuContentProps["align"];
}

const ResponsiveMenuContent = React.forwardRef<HTMLDivElement, ResponsiveMenuContentProps>(
  ({ title, description, layout, side, align, ...props }, ref) => {
    const { wide } = useResponsive("ResponsiveMenuContent");
    return wide ? (
      <MenuContent ref={ref} side={side} align={align} {...props} />
    ) : (
      <MenuSheetContent ref={ref} title={title} description={description} layout={layout} {...props} />
    );
  },
);
ResponsiveMenuContent.displayName = "ResponsiveMenuContent";

const ResponsiveMenuGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { wide } = useResponsive("ResponsiveMenuGroup");
  return wide ? <MenuGroup ref={ref} {...props} /> : <MenuSheetGroup ref={ref} {...props} />;
});
ResponsiveMenuGroup.displayName = "ResponsiveMenuGroup";

// 시트의 줄(<button>)에 넘길 속성 — 이름 · 모양 · aria-* · data-* 만(이벤트 처리기는 메뉴 줄(div)의 것이라 넘기지 않는다)
function sheetItemAttributes(props: Omit<MenuItemProps, "label" | "description" | "icon" | "suffixIcon" | "tone" | "disabled" | "onSelect">) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === "id" || key === "className" || key === "style" || key === "title" || key.startsWith("aria-") || key.startsWith("data-")) out[key] = value;
  }
  return out as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect">;
}

// 줄 — 두 표면에 같은 이름 · 같은 순서 · 같은 막힘. suffixIcon 은 메뉴에만(시트의 줄에는 뒤 아이콘이 없다)
const ResponsiveMenuItem = React.forwardRef<HTMLElement, MenuItemProps>(({ suffixIcon, ...props }, ref) => {
  const { wide } = useResponsive("ResponsiveMenuItem");
  if (wide) return <MenuItem ref={ref as React.Ref<HTMLDivElement>} suffixIcon={suffixIcon} {...props} />;
  const { label, description, icon, tone, disabled, onSelect, ...rest } = props;
  return (
    <MenuSheetItem
      ref={ref as React.Ref<HTMLButtonElement>}
      label={label}
      description={description}
      icon={icon}
      tone={tone}
      disabled={disabled}
      onSelect={onSelect}
      {...sheetItemAttributes(rest)}
    />
  );
});
ResponsiveMenuItem.displayName = "ResponsiveMenuItem";

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  ResponsiveMenu,
  ResponsiveMenuTrigger,
  ResponsiveMenuContent,
  ResponsiveMenuGroup,
  ResponsiveMenuItem,
};
