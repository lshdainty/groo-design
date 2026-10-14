import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBackClose, useLeaveConfirm } from "@/components/ui/alert-dialog";
import { useInputButtonSurface } from "@/components/ui/input-button";
import { useScrollFog } from "@/components/ui/scroll-fog";

/*
 * Porest Bottom Sheet — 구조는 SEED Bottom Sheet(2026-10-02). 수치 원본은 specs/components/bottom-sheet.yaml. vaul 위에 짰다.
 *
 *   BottomSheet          화면 아래에서 올라오는 모달 — open · defaultOpen · onOpenChange · form · dirty · snapPoints
 *   BottomSheetTrigger   여는 버튼 — 닫으면 초점이 여기로 돌아온다
 *   BottomSheetContent   시트 — title(늘) · description(덧붙일 말이 있을 때만). 오른쪽 위 닫기 버튼(showCloseButton, 기본 켬)
 *   BottomSheetBody      본문 — 좌우 화면 여백 24, 넘치면 이 안에서 스크롤. scrollFog 면 끝 흐림(Scroll Fog — 늘 켜진
 *                        위 20 · 아래 80 + 본문 안 여백 위 20 · 아래 80) — 넘칠 수 있는 본문(목록 · 긴 폼)에만 준다
 *   BottomSheetFooter    바닥 — 버튼 하나면 폭 전체, 둘이면 반씩(사이 8). Button large 48 을 크기를 주지 않은 바로 아래 자식에 넣는다
 *   BottomSheetSurface   바탕 — 딤 · 시트 · 손잡이와 닫는 길(Esc · 바깥 · 끌기 · 초점)만. 머리가 다른 시트(Menu Sheet)가 이 위에 짠다.
 *                        BottomSheetContent 도 이것 위에 머리 · 닫기 버튼을 얹은 것이다. handle="always" 면 스냅 높이가 없어도 손잡이를 단다
 *
 * 폼 · 상세는 1280 에서 Dialog 와 바뀌는 ResponsiveDialog(dialog.tsx)로 짠다 — 늘 시트인 자리(Input Button 의 고르기)만 바로 쓴다.
 *
 * 닫는 길(bottom-sheet.md Behavior)
 *   - 닫기 버튼 · Esc · 뒤로 가기(1280 미만)는 늘 닫는다.
 *   - 바깥(딤) 누르기 · 아래로 끌기는 조회 · 고르기 시트만 닫는다. form(입력 폼)이면 둘 다 아무 일도 하지 않는다 — 손잡이도 없다.
 *   - 끌기는 vaul 의 기준 그대로다 — 놓을 때 0.4px/ms 보다 빠르거나 높이의 25% 이상 내려왔으면 닫고 아니면 200ms exit 로 제자리.
 *     열린 뒤 0.5초는 끌리지 않고, 본문이 스크롤돼 있으면(맨 위가 아니면) 끌지 않고 스크롤한다.
 *   - dirty 면 어느 길이든 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 — [계속 작성] 이면 그대로(끌던 시트는 제자리로).
 *
 * 열면 초점은 시트(컨테이너)로 가고 열린 동안 시트 안을 돈다. 닫으면 연 자리(트리거, 없으면 열 때 초점이 있던 곳)로 돌아간다.
 * 뒤 화면은 보조 기술에서 숨기고 스크롤을 잠근다(Radix Dialog). role="dialog" + aria-modal, 제목 aria-labelledby · 설명 aria-describedby.
 *
 * 모양: 최대 480 으로 가운데, 위 두 모서리 r6 24, 그림자 없이 딤(overlay-dim 라이트 0.50 · 다크 0.65)과 표면 색으로 뜬다.
 * 높이는 내용만큼이고 화면 높이의 90% 를 넘지 않는다(넘을 내용은 페이지로). 바닥 버튼 아래에 안전 영역을 더한다.
 * 머리 위 24 · 아래 16 · 사이 8, 제목 t8 22 / 30 · 700 · 설명 t5 fg-neutral-muted. 닫기 버튼이 있으면 제목 오른쪽 64(24 + 원 28 + 12).
 * 닫기 버튼은 28 원(bg-neutral-weak · 아이콘 14 fg-neutral) · 누르는 영역 44, 위 24 · 오른쪽 24. 누르면 bg-neutral-weak-pressed +
 * 2px 거리 축소(기준 28), 호버는 누름 색. 이름 "닫기". 본문이 맨 끝(바닥이 없을 때)이면 아래 16 을 둔다.
 * 끝 흐림(scrollFog, bottom-sheet.yaml · scroll-fog.yaml overlayBody) — 걸 본문인지는 내용의 종류로 정한다(칸 두셋처럼 늘 들어맞는
 * 본문에는 걸지 않는다). 걸면 늘 켜져 있고 본문 안 여백이 위 20(머리 아래 16 은 그대로) · 아래 80(바닥이 있어도 — 바닥이 없으면 그
 * 아래 안전 영역)이 돼 끝까지 내리면 흐림이 빈 여백 위에 놓인다. 스크롤 여유도 위 20 · 아래 80. 1280 이상의 Dialog 와 같다.
 * 쌓임: 딤 z-modal 100 · 시트 z-modal-content 101(specs/z-index.md L2) — 그 위에 Popover(L3) · Alert Dialog(L5).
 * 모션: 300ms enter-expressive 로 올라오고(딤 300ms enter) 200ms exit 로 내려간다(딤 200ms exit). 모션 줄이기면 150ms 서서히 나타남 ·
 * 사라짐. vaul 이 넣는 0.5s 는 덮는다 — vaul 의 CSS 는 나중에 들어오고 끌다 놓을 때는 인라인으로 넣으므로 !important 로 이긴다.
 *
 * 스냅 높이(snapPoints — vaul 그대로, 화면 높이 비율 0 ~ 1 또는 "300px")를 주면 시트를 화면의 90% 높이로 두고 손잡이를 단다
 * (36 × 4 · stroke-neutral-weak · 위 6, 누르는 영역 44, 보조 기술에는 숨긴다). 손잡이를 누르면 다음(더 높은) 스냅 높이로 올라가고,
 * 가장 높은 높이에서 누르면 닫는다(SEED · vaul 의 Handle 과 같다). 스냅 높이 사이 이동은 300ms enter-expressive. form 이면 스냅 높이를
 * 쓰지 않는다.
 */

type OpenChange = (open: boolean) => void;
type SnapPoint = number | string;

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
function withButtonSize(children: React.ReactNode, size: "large"): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<{ size?: unknown; children?: React.ReactNode }>(child)) return child;
    if (child.type === React.Fragment) return withButtonSize(child.props.children, size);
    if (typeof child.type === "string" || child.props.size !== undefined) return child;
    return React.cloneElement(child, { size });
  });
}

function focusOpener(trigger: HTMLElement | null, opener: Element | null) {
  const target =
    trigger?.isConnected ? trigger : opener instanceof HTMLElement && opener.isConnected && opener !== opener.ownerDocument.body ? opener : null;
  target?.focus({ preventScroll: true });
}

// ── 시트 문맥 ─────────────────────────────────────────────────
type SheetContextValue = {
  form: boolean;
  /** 닫기를 청한다 — 바로 닫았으면 true, 바뀐 값이 있어 물었으면 false */
  requestClose: () => boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  openRef: React.RefObject<boolean>;
  snapPoints: SnapPoint[] | undefined;
  snap: SnapPoint | null;
  setSnap: (point: SnapPoint | null) => void;
};
const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(name: string) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error(`${name} 는 BottomSheet 안에 둔다.`);
  return ctx;
}

export interface BottomSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  /** 입력 폼 — 바깥 누르기 · 끌어내리기로 닫지 않는다(손잡이 없음). 위 닫기 버튼 · Esc · 뒤로 가기로 닫는다 */
  form?: boolean;
  /** 바뀐 값이 있다 — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */
  dirty?: boolean;
  /** 스냅 높이(vaul — 화면 높이 비율 0 ~ 1 또는 "300px", 낮은 것부터) — 주면 손잡이를 단다. form 이면 쓰지 않는다 */
  snapPoints?: SnapPoint[];
  /** 지금 스냅 높이 — 주면 제어한다(기본은 가장 낮은 높이에서 연다) */
  activeSnapPoint?: SnapPoint | null;
  onActiveSnapPointChange?: (point: SnapPoint | null) => void;
  children?: React.ReactNode;
}

function BottomSheet({
  open: openProp,
  defaultOpen,
  onOpenChange,
  form = false,
  dirty = false,
  snapPoints,
  activeSnapPoint,
  onActiveSnapPointChange,
  children,
}: BottomSheetProps) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const narrow = useInputButtonSurface() === "sheet";
  const contentRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const openRef = React.useRef(open);
  React.useLayoutEffect(() => {
    openRef.current = open;
  });
  const leave = useLeaveConfirm({ dirty, contentRef, leave: () => setOpen(false) });
  // 뒤로 가기(1280 미만) — 바뀐 값이 있어 물었으면 칸을 다시 쌓는다
  const keepBackSlot = useBackClose(open && narrow, () => {
    if (!leave.request()) keepBackSlot();
  });

  const snaps = form ? undefined : snapPoints;
  const [snapInner, setSnapInner] = React.useState<SnapPoint | null>(snaps?.[0] ?? null);
  const snap = activeSnapPoint !== undefined ? activeSnapPoint : snapInner;
  const snapChangeRef = React.useRef(onActiveSnapPointChange);
  React.useEffect(() => {
    snapChangeRef.current = onActiveSnapPointChange;
  });
  const controlledSnap = activeSnapPoint !== undefined;
  const setSnap = React.useCallback(
    (point: SnapPoint | null) => {
      if (!controlledSnap) setSnapInner(point);
      snapChangeRef.current?.(point);
    },
    [controlledSnap],
  );

  // vaul 이 끌어 닫으려 했는데 닫지 않았을 때(물었을 때) — 끌던 자리(인라인 transform · 딤 투명도)를 지워 제자리로 돌린다.
  // 되돌아가는 시간 · 곡선은 클래스가 정한다(200ms exit)
  const snapBack = React.useCallback(() => {
    contentRef.current?.style.removeProperty("transform");
    overlayRef.current?.style.removeProperty("opacity");
  }, []);

  const value = React.useMemo<SheetContextValue>(
    () => ({ form, requestClose: leave.request, contentRef, overlayRef, triggerRef, openRef, snapPoints: snaps, snap, setSnap }),
    [form, leave.request, snaps, snap, setSnap],
  );

  return (
    <SheetContext.Provider value={value}>
      <DrawerPrimitive.Root
        open={open}
        // vaul 이 닫으려 할 때(끌어내리기 · 손잡이) — 바뀐 값이 있으면 묻고 시트는 제자리로
        onOpenChange={(next) => {
          if (next) setOpen(true);
          else if (!leave.request()) snapBack();
        }}
        // 입력 폼은 끌리지 않는다 — 손잡이가 없으므로 어디서도 끌 수 없다
        handleOnly={form}
        snapPoints={snaps}
        activeSnapPoint={snaps ? snap : undefined}
        setActiveSnapPoint={snaps ? setSnap : undefined}
      >
        {children}
      </DrawerPrimitive.Root>
      {leave.node}
    </SheetContext.Provider>
  );
}
BottomSheet.displayName = "BottomSheet";

const BottomSheetTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>((props, ref) => {
  const ctx = useSheetContext("BottomSheetTrigger");
  return <DrawerPrimitive.Trigger ref={mergeRefs(ref, ctx.triggerRef)} data-slot="bottom-sheet-trigger" {...props} />;
});
BottomSheetTrigger.displayName = "BottomSheetTrigger";

// ── 모양 ─────────────────────────────────────────────────────
// 딤 — 300ms enter 로 나타나고 200ms exit 로 사라진다(모션 줄이기면 150ms). 끌다 놓아 제자리로 갈 때도 200ms exit 로 돌아오고,
// 끄는 동안(바로 뒤 시트에 .vaul-dragging)은 손가락을 바로 따른다
const OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  "motion-reduce:data-[state]:data-[vaul-overlay]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "[&:not(:has(+.vaul-dragging))]:[transition:opacity_var(--motion-duration-d4)_var(--motion-ease-exit)]!",
].join(" ");

// 시트 — 최대 480 가운데, 위 모서리 r6, 내용만큼(최대 90%), 바닥 아래 안전 영역
const CONTENT = [
  "fixed inset-x-0 bottom-0 z-(--z-modal-content) mx-auto flex max-h-[90dvh] w-full max-w-[480px] flex-col",
  "rounded-t-r6 bg-bg-layer-floating pb-[env(safe-area-inset-bottom)] font-sans text-fg-neutral outline-none",
  // 열림 300ms enter-expressive · 닫힘 200ms exit(vaul 의 slideFromBottom · slideToBottom 그대로, 시간 · 곡선만)
  "[animation-duration:var(--sheet-anim-duration)]! [animation-timing-function:var(--sheet-anim-ease)]!",
  "data-[state=open]:[--sheet-anim-duration:var(--motion-duration-d6)] data-[state=open]:[--sheet-anim-ease:var(--motion-ease-enter-expressive)]",
  "data-[state=closed]:[--sheet-anim-duration:var(--motion-duration-d4)] data-[state=closed]:[--sheet-anim-ease:var(--motion-ease-exit)]",
  // 끌다 놓아 제자리로 200ms exit · 스냅 높이 사이 300ms enter-expressive. 끄는 동안은 손가락을 바로 따른다
  "[&:not(.vaul-dragging)]:[transition:transform_var(--sheet-move-duration)_var(--sheet-move-ease)]!",
  "[--sheet-move-duration:var(--motion-duration-d4)] [--sheet-move-ease:var(--motion-ease-exit)]",
  "data-[vaul-snap-points=true]:[--sheet-move-duration:var(--motion-duration-d6)] data-[vaul-snap-points=true]:[--sheet-move-ease:var(--motion-ease-enter-expressive)]",
  // 모션 줄이기 — 미끄러지지 않고 150ms 서서히 나타나고 사라진다. 제자리 · 스냅 이동은 바로
  "motion-reduce:data-[state=open]:[animation-name:fadeIn]! motion-reduce:data-[state=closed]:[animation-name:fadeOut]!",
  "motion-reduce:data-[state]:data-[vaul-drawer]:[--sheet-anim-duration:var(--motion-duration-d3)]",
  "motion-reduce:data-[vaul-drawer]:data-[vaul-snap-points]:[--sheet-move-duration:0s]",
].join(" ");

// 닫기 — 28 원 · 아이콘 14, 누르는 영역 44(::before). 누르면 bg-neutral-weak-pressed + 2px 거리 축소(기준 28 → 0.929)
const CLOSE = [
  "absolute right-global-gutter top-x6 flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-bg-neutral-weak p-0 text-fg-neutral [&>svg]:size-3.5",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed [--press-basis:28] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 손잡이 — 36 × 4 · 위 6 가운데, 누르는 영역 44. 누름 색은 두지 않는다(bottom-sheet.yaml)
const HANDLE = [
  "absolute left-1/2 top-x1_5 h-1 w-9 -translate-x-1/2 cursor-pointer rounded-full bg-stroke-neutral-weak",
  "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
].join(" ");

// 손잡이를 누르면 다음(더 높은) 스냅 높이로, 가장 높은 높이에서는 닫는다(SEED · vaul 의 Handle 과 같다).
// 스냅 높이가 없으면 손잡이를 달지 않는다 — always(Menu Sheet)면 달고, 누르면 닫는다(가장 높은 높이와 같다)
function SheetHandle({ always = false }: { always?: boolean }) {
  const { snapPoints, snap, setSnap, requestClose } = useSheetContext("BottomSheetContent");
  if (!snapPoints?.length) {
    if (!always) return null;
    return <div aria-hidden data-slot="bottom-sheet-handle" className={HANDLE} onClick={() => requestClose()} />;
  }
  const index = snap == null ? 0 : Math.max(snapPoints.indexOf(snap), 0);
  return (
    <div
      aria-hidden
      data-slot="bottom-sheet-handle"
      className={HANDLE}
      onClick={() => {
        const higher = snapPoints[index + 1];
        if (higher === undefined) requestClose();
        else setSnap(higher);
      }}
    />
  );
}

export interface BottomSheetSurfaceProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  /** 손잡이 — snap(스냅 높이가 있을 때만, 기본) · always(늘 — Menu Sheet. 스냅 높이가 없으면 누를 때 닫는다) */
  handle?: "snap" | "always";
}

// 바탕 — 딤 · 시트(최대 480 · 위 모서리 · 모션 · 안전 영역) · 손잡이와 닫는 길. 머리 · 본문은 쓰는 쪽이 children 으로 넣는다
const BottomSheetSurface = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, BottomSheetSurfaceProps>(
  ({ handle = "snap", className, children, onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, ...props }, ref) => {
    const ctx = useSheetContext("BottomSheetContent");
    const openerRef = React.useRef<Element | null>(null);
    return (
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay ref={ctx.overlayRef} data-slot="bottom-sheet-overlay" className={OVERLAY} />
        <DrawerPrimitive.Content
          ref={mergeRefs(ref, ctx.contentRef)}
          data-slot="bottom-sheet-content"
          aria-modal="true"
          className={cn(CONTENT, ctx.snapPoints?.length && "h-[90dvh]", className)}
          // 처음 초점은 시트(본문 위) — vaul 은 기본으로 아무 데도 두지 않는다
          onOpenAutoFocus={(e) => {
            openerRef.current = document.activeElement;
            onOpenAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            ctx.contentRef.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(e) => {
            onCloseAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            // 아직 열려 있다 — 폭이 1280 을 넘어 대화상자로 바뀌어 다시 뜬다(ResponsiveDialog). 초점은 새 표면이 가져간다
            if (ctx.openRef.current) return;
            focusOpener(ctx.triggerRef.current, openerRef.current);
          }}
          // Esc 는 늘 닫는다(바뀐 값이 있으면 먼저 묻는다) — vaul 을 거치지 않고 직접 청한다
          onEscapeKeyDown={(e) => {
            onEscapeKeyDown?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            ctx.requestClose();
          }}
          // 바깥(딤) 누르기 — 입력 폼은 무시하고, 조회 · 고르기는 닫는다. 오른쪽 클릭은 닫지 않는다(Radix 와 같다)
          onPointerDownOutside={(e) => {
            onPointerDownOutside?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            const pointer = e.detail.originalEvent;
            const secondary = pointer.button === 2 || (pointer.button === 0 && pointer.ctrlKey);
            if (!ctx.form && !secondary) ctx.requestClose();
          }}
          {...props}
        >
          <SheetHandle always={handle === "always"} />
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  },
);
BottomSheetSurface.displayName = "BottomSheetSurface";

export interface BottomSheetContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>, "title"> {
  /** 제목 — 무엇을 하는 시트인지("거래 추가" · "기간"). 늘 둔다 */
  title: React.ReactNode;
  /** 설명 — 덧붙일 말이 있을 때만 한 문장 */
  description?: React.ReactNode;
  /** 오른쪽 위 닫기 버튼(기본 켬) — 조회 · 고르기 · 시트의 입력 폼 모두에 둔다 */
  showCloseButton?: boolean;
}

const BottomSheetContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, BottomSheetContentProps>(
  ({ title, description, showCloseButton = true, children, ...props }, ref) => {
    const ctx = useSheetContext("BottomSheetContent");
    return (
      <BottomSheetSurface
        ref={ref}
        data-form={ctx.form || undefined}
        // 설명이 없으면 aria-describedby 를 걷는다(가리킬 곳이 없다)
        {...(description == null ? { "aria-describedby": undefined } : null)}
        {...props}
      >
        <div data-slot="bottom-sheet-header" className="flex shrink-0 flex-col gap-x2 px-global-gutter pb-x4 pt-x6">
          <DrawerPrimitive.Title
            data-slot="bottom-sheet-title"
            className={cn("m-0 text-t8 font-bold text-fg-neutral", showCloseButton && "pr-x10")}
          >
            {title}
          </DrawerPrimitive.Title>
          {description != null && (
            <DrawerPrimitive.Description data-slot="bottom-sheet-description" className="m-0 text-t5 font-normal text-fg-neutral-muted">
              {description}
            </DrawerPrimitive.Description>
          )}
        </div>
        {showCloseButton && (
          <button
            type="button"
            aria-label="닫기"
            data-slot="bottom-sheet-close"
            className={CLOSE}
            onClick={() => ctx.requestClose()}
          >
            <X aria-hidden strokeWidth={2} />
          </button>
        )}
        {children}
      </BottomSheetSurface>
    );
  },
);
BottomSheetContent.displayName = "BottomSheetContent";

// 본문 — 좌우 화면 여백 24, 넘치면 이 안에서 스크롤. 바닥이 없어 맨 끝이면 아래 16(바닥의 아래 여백).
// 끝에 닿아도 뒤 화면이 따라 스크롤되지 않는다(overscroll-behavior: contain — Scroll Area, 2026-10-10)
const BODY = "min-h-0 flex-1 overflow-y-auto overscroll-contain px-global-gutter";
const BODY_PLAIN = "last:pb-x4";
// 끝 흐림(scrollFog) — 본문 안 여백 위 20 · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

export interface BottomSheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 끝 흐림(Scroll Fog overlayBody — 위 20 · 아래 80, 늘 켜짐) — 넘칠 수 있는 본문(목록 · 긴 폼)에만 */
  scrollFog?: boolean;
}

const BottomSheetBody = React.forwardRef<HTMLDivElement, BottomSheetBodyProps>(({ scrollFog = false, className, ...props }, ref) => {
  const own = React.useRef<HTMLDivElement>(null);
  useScrollFog(own, scrollFog ? "overlayBody" : null);
  return (
    <div
      ref={mergeRefs(ref, own)}
      data-slot="bottom-sheet-body"
      data-scroll-fog={scrollFog ? "overlayBody" : undefined}
      className={cn(BODY, scrollFog ? BODY_FOG : BODY_PLAIN, className)}
      {...props}
    />
  );
});
BottomSheetBody.displayName = "BottomSheetBody";

// 바닥 — 위 12 · 아래 16(그 아래 안전 영역은 시트가 둔다), 버튼 하나면 폭 전체 · 둘이면 반씩(사이 8). Button large 48
const BottomSheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="bottom-sheet-footer"
      className={cn("flex shrink-0 gap-x2 px-global-gutter pb-x4 pt-x3 [&>*]:min-w-0 [&>*]:flex-1", className)}
      {...props}
    >
      {withButtonSize(children, "large")}
    </div>
  ),
);
BottomSheetFooter.displayName = "BottomSheetFooter";

export { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetBody, BottomSheetFooter, BottomSheetSurface };
