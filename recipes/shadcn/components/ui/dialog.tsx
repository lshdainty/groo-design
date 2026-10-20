import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useLeaveConfirm } from "@/components/ui/alert-dialog";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { useInputButtonSurface } from "@/components/ui/input-button";
import { useScrollFog } from "@/components/ui/scroll-fog";

/*
 * Groo Dialog — 구조는 SEED Dialog · Responsive Dialog(2026-10-02). 수치 원본은 specs/components/dialog.yaml.
 *
 *   Dialog                  1280 이상의 가운데 대화상자(Radix Dialog) — open · defaultOpen · onOpenChange · form · dirty
 *   DialogTrigger           여는 버튼 — 닫으면 초점이 여기로 돌아온다
 *   DialogContent           대화상자 — title · description(있을 때만) · size medium 480(기본) | large 800.
 *                           조회 · 안내(form 이 아니면)는 머리 오른쪽에 닫기 버튼, 입력 폼은 두지 않는다(바닥 [취소])
 *   DialogBody              본문 — 이 안에서만 스크롤, 위로 스크롤되면 머리 아래 1px 선. scrollFog 면 끝 흐림(Scroll Fog —
 *                           늘 켜진 위 20 · 아래 80 + 본문 안 여백 위 20 · 아래 80) — 넘칠 수 있는 본문(목록 · 긴 폼)에만 준다
 *   DialogFooter            바닥 — 오른쪽 정렬, 사이 8. Button small 36 을 크기를 주지 않은 바로 아래 자식에 넣는다
 *   DialogCancel            바닥 [취소] — neutralWeak. 닫기를 청한다(바뀐 값이 있으면 먼저 묻는다)
 *
 *   ResponsiveDialog        폼 · 상세는 이것으로 짠다 — 1280 이상 Dialog, 미만 Bottom Sheet(Input Button 과 같은 경계,
 *                           useInputButtonSurface). ResponsiveDialogTrigger · Content · Body · Footer · Cancel 이 같은 자리에 맞는
 *                           표면의 부품을 그린다 — 머리 · 본문 · 바닥은 같고 닫는 자리만 바뀐다.
 *                           form: 대화상자는 바닥 ResponsiveDialogCancel(머리 닫기 없음), 시트는 위 닫기 버튼(Cancel 은 그리지 않는다).
 *                           form 이 아니면(조회 · 안내) 두 표면 모두 위 닫기 버튼이고 Cancel 을 두지 않는다.
 *                           열린 채 창 폭이 1280 을 넘나들면 표면이 바뀐다 — 열림은 ResponsiveDialog 가 들고 있어 이어지지만, 안의 부품은
 *                           새로 그려진다. 입력값은 폼(부모)의 상태로 든다 — 입력칸 안(비제어)에만 두면 바뀔 때 사라진다.
 *
 * 닫는 길(dialog.md Behavior)
 *   - 바닥 [취소] · 닫기 버튼 · Esc 는 닫는다. 바깥(딤) 누르기는 조회 · 안내만 닫고 입력 폼(form)은 무시한다.
 *   - dirty 면 어느 길이든 닫기 전에 "작성한 내용이 사라져요" 를 묻는다(Field 의 이탈 시 안내) — [계속 작성] 이면 그대로.
 *   - 뒤로 가기는 1280 미만(시트)에서만 닫는다 — 1280 이상에서 뒤로 가기는 "이전 페이지" 다(alert-dialog.tsx 의 useBackClose).
 *
 * 열면 초점은 대화상자(컨테이너)로 가고 열린 동안 안을 돈다. 닫으면 연 자리(트리거, 없으면 열 때 초점이 있던 곳)로 돌아간다.
 * 뒤 화면은 보조 기술에서 숨기고 스크롤을 잠근다(Radix). role="dialog" + aria-modal, 제목 aria-labelledby · 설명 aria-describedby
 * (설명이 없으면 걷는다). 보이는 제목이 없는 대화상자(명령 팔레트)는 aria-label 을 준다 — 숨은 제목으로 둔다.
 *
 * 모양: 화면 정중앙, 폭 480 · 800(좌우 20 은 남긴다), 높이는 내용만큼 화면의 80% 까지(dvh) — 넘치는 만큼 본문만 스크롤한다.
 * 모서리 r5 20, 그림자 없이 딤(overlay-dim 라이트 0.50 · 다크 0.65)과 표면 색으로 뜬다. 머리 위 24 · 좌우 24 · 아래 16 · 사이 6,
 * 제목 t8 22 / 30 · 700, 설명 t5 fg-neutral-muted. 닫기 버튼이 있으면 머리 오른쪽 52(24 + 아이콘 22 + 6).
 * 닫기 버튼은 52 투명 상자 · 아이콘 22 fg-neutral-subtle — 아이콘이 위 28 · 오른쪽 24. 누르면 bg-layer-floating-pressed + 2px 거리
 * 축소(기준 52), 호버는 누름 색. 이름 "닫기". 본문은 좌우 24 — 맨 끝(바닥이 없을 때)이면 아래 24, 맨 앞(머리가 없을 때)이면 위 24.
 * 바닥은 위 16 · 좌우 24 · 아래 24. 넘쳐 스크롤할 수 있는 본문은 키보드로도 스크롤하도록 Tab 이 선다(안쪽 링).
 * 끝 흐림(scrollFog, dialog.yaml · scroll-fog.yaml overlayBody) — 걸 본문인지는 내용의 종류로 정한다(칸 두셋처럼 늘 들어맞는 본문에는
 * 걸지 않는다). 걸면 넘쳤는지 · 스크롤 위치와 상관없이 늘 켜져 있고, 본문 안 여백이 위 20(머리가 없으면 24 그대로) · 아래 80
 * (바닥이 있어도)이 돼 끝까지 내리면 흐림이 빈 여백 위에 놓인다. 스크롤 여유도 위 20 · 아래 80. 머리 아래 선은 머리의 안쪽 아래
 * 1px 로 그린다 — 본문은 흐림 마스크가 걸려 그 안에 그린 선은 흐려진다.
 * 쌓임: 딤 z-modal 100 · 대화상자 z-modal-content 101(specs/z-index.md L2) — 그 안에서 연 Popover(L3) · Alert Dialog(L5)가 위에 뜬다.
 * 모션: 200ms enter-expressive 로 1.3 배에서 줄며 나타나고 100ms exit 로 줄지 않고 사라진다(딤 100ms). 모션 줄이기면 150ms 서서히.
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

function focusOpener(trigger: HTMLElement | null, opener: Element | null) {
  const target =
    trigger?.isConnected ? trigger : opener instanceof HTMLElement && opener.isConnected && opener !== opener.ownerDocument.body ? opener : null;
  target?.focus({ preventScroll: true });
}

// 본문의 스크롤 상태 — 위로 스크롤됨(data-scrolled, 머리 아래 선)과 넘침(Tab 이 서는지). 본문 · 그 아래 자식의 크기가 바뀌면
// 다시 잰다. 끝 흐림은 재지 않는다 — scrollFog 면 늘 켜져 있다.
// 다시 그리지 않고 DOM 에 바로 쓴다 — 열린 직후(Radix 가 처음 초점을 정하기 전)에 이미 넘친 본문이 Tab 순서에 있게
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

// ── 대화상자 문맥 ─────────────────────────────────────────────
type DialogContextValue = {
  form: boolean;
  /** 닫기를 청한다 — 바로 닫았으면 true, 바뀐 값이 있어 물었으면 false */
  requestClose: () => boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  openRef: React.RefObject<boolean>;
};
const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  /** 입력 폼 — 바깥(딤)을 눌러도 닫히지 않고 머리 닫기 버튼을 두지 않는다(바닥 [취소] [저장]) */
  form?: boolean;
  /** 바뀐 값이 있다 — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */
  dirty?: boolean;
  children?: React.ReactNode;
}

function Dialog({ open: openProp, defaultOpen, onOpenChange, form = false, dirty = false, children }: DialogProps) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const openRef = React.useRef(open);
  React.useLayoutEffect(() => {
    openRef.current = open;
  });
  const leave = useLeaveConfirm({ dirty, contentRef, leave: () => setOpen(false) });
  const value = React.useMemo<DialogContextValue>(
    () => ({ form, requestClose: leave.request, contentRef, triggerRef, openRef }),
    [form, leave.request],
  );
  return (
    <DialogContext.Provider value={value}>
      {/* Radix 가 닫으려 할 때(Esc · 바깥 · 닫기 · 취소) — 바뀐 값이 있으면 묻는다 */}
      <DialogPrimitive.Root open={open} onOpenChange={(next) => (next ? setOpen(true) : leave.request())}>
        {children}
      </DialogPrimitive.Root>
      {leave.node}
    </DialogContext.Provider>
  );
}
Dialog.displayName = "Dialog";

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>((props, ref) => {
  const ctx = React.useContext(DialogContext);
  return <DialogPrimitive.Trigger ref={mergeRefs(ref, ctx?.triggerRef)} data-slot="dialog-trigger" {...props} />;
});
DialogTrigger.displayName = "DialogTrigger";

// ── 모양 ─────────────────────────────────────────────────────
// 딤 — 100ms 로 나타나고 사라진다
const OVERLAY = [
  "fixed inset-0 z-(--z-modal) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d2)] data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// 대화상자 — 정중앙, 좌우 20 은 남긴다, 높이는 화면의 80% 까지. 열림 200ms enter-expressive 로 1.3 배에서 줄며 나타난다
// (모션 줄이기면 150ms 서서히). 닫힘 100ms exit 로 줄지 않고 사라진다
const CONTENT = [
  "fixed left-1/2 top-1/2 z-(--z-modal-content) flex max-h-[80dvh] max-w-[calc(100%-var(--spacing-x5)*2)] -translate-x-1/2 -translate-y-1/2 flex-col",
  "overflow-hidden rounded-r5 bg-bg-layer-floating font-sans text-fg-neutral outline-none",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  "motion-safe:data-[state=open]:zoom-in-130 motion-safe:data-[state=open]:duration-[var(--motion-duration-d4)] motion-safe:data-[state=open]:ease-[var(--motion-ease-enter-expressive)]",
  "motion-reduce:data-[state=open]:duration-[var(--motion-duration-d3)] motion-reduce:data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

const SIZE = { medium: "w-[480px]", large: "w-[800px]" } as const;

// 머리 — 위 24 · 좌우 24 · 아래 16 · 사이 6. 본문이 위로 스크롤되면 안쪽 아래 1px stroke-neutral-subtle(150ms) — 본문이 흐림 마스크를
// 걸어도 선이 흐려지지 않게 머리에 그린다
const HEADER = [
  "flex shrink-0 flex-col gap-x1_5 px-x6 pb-x4 pt-x6",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=dialog-body][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");

// 닫기 — 52 투명 상자 · 아이콘 22 fg-neutral-subtle. 아이콘이 위 28 · 오른쪽 24 에 오도록 상자를 (52 − 22) ÷ 2 = 15 만큼 당긴다.
// 누르면 bg-layer-floating-pressed + 2px 거리 축소(기준 52 → 0.962)
const CLOSE = [
  "absolute right-[calc(var(--spacing-x6)-15px)] top-[calc(var(--spacing-x7)-15px)] flex size-13 cursor-pointer items-center justify-center",
  "rounded-r3 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[22px]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed [--press-basis:52] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

export interface DialogContentProps extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, "title"> {
  /** 제목 — 하는 일("휴가 신청" · "거래 상세"). 없으면 aria-label 로 이름을 단다 */
  title?: React.ReactNode;
  /** 설명 — 덧붙일 말이 있을 때만 한 문장 */
  description?: React.ReactNode;
  /** medium 480(기본) — 일반 입력 폼 · 상세, large 800 — 복잡한 설정 · 많은 조회 */
  size?: keyof typeof SIZE;
}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  (
    {
      title,
      description,
      size = "medium",
      className,
      children,
      "aria-label": ariaLabel,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onInteractOutside,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useContext(DialogContext);
    const own = React.useRef<HTMLDivElement>(null);
    const openerRef = React.useRef<Element | null>(null);
    const form = ctx?.form ?? false;
    const hasHeader = title != null;
    // 닫기 버튼은 조회 · 안내의 머리에만 — 입력 폼은 바닥 [취소] 가 닫는다(닫기 버튼과 취소를 함께 두지 않는다)
    const showClose = hasHeader && !form;
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay data-slot="dialog-overlay" className={OVERLAY} />
        <DialogPrimitive.Content
          ref={mergeRefs(ref, own, ctx?.contentRef)}
          data-slot="dialog-content"
          data-size={size}
          data-form={form || undefined}
          aria-modal="true"
          {...(description == null ? { "aria-describedby": undefined } : null)}
          className={cn(CONTENT, SIZE[size], className)}
          // 처음 초점은 대화상자 — Radix 기본(첫 칸)을 쓰지 않는다
          onOpenAutoFocus={(e) => {
            openerRef.current = document.activeElement;
            // 이름이 없으면 개발 중에 알린다(열릴 때)
            if (import.meta.env.DEV && !hasHeader && !ariaLabel?.trim()) {
              console.warn('[Dialog] 제목이 없으면 aria-label 로 이름을 단다(예: "명령어 검색").', own.current);
            }
            onOpenAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            own.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(e) => {
            onCloseAutoFocus?.(e);
            if (e.defaultPrevented) return;
            e.preventDefault();
            // 아직 열려 있다 — 폭이 1280 아래로 내려가 시트로 바뀌어 다시 뜬다(ResponsiveDialog). 초점은 새 표면이 가져간다
            if (ctx?.openRef.current) return;
            focusOpener(ctx?.triggerRef.current ?? null, openerRef.current);
          }}
          // 입력 폼은 바깥(딤)을 눌러도 닫히지 않는다 — Radix 는 바깥 누르기 · 바깥 초점 모두 이 자리를 지나 닫을지 정한다
          onInteractOutside={(e) => {
            onInteractOutside?.(e);
            if (form) e.preventDefault();
          }}
          {...props}
        >
          {hasHeader && (
            <div data-slot="dialog-header" className={cn(HEADER, showClose && "pr-x13")}>
              <DialogPrimitive.Title data-slot="dialog-title" className="m-0 text-t8 font-bold text-fg-neutral">
                {title}
              </DialogPrimitive.Title>
              {description != null && (
                <DialogPrimitive.Description data-slot="dialog-description" className="m-0 text-t5 font-normal text-fg-neutral-muted">
                  {description}
                </DialogPrimitive.Description>
              )}
              {showClose && (
                <DialogPrimitive.Close aria-label="닫기" data-slot="dialog-close" className={CLOSE}>
                  <X aria-hidden strokeWidth={2} />
                </DialogPrimitive.Close>
              )}
            </div>
          )}
          {children}
          {/* 보이는 제목이 없을 때 — aria-label 을 숨은 제목으로(본문이 맨 앞 자식으로 남게 맨 뒤에 둔다) */}
          {!hasHeader && ariaLabel != null && <DialogPrimitive.Title className="sr-only">{ariaLabel}</DialogPrimitive.Title>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
DialogContent.displayName = "DialogContent";

// 본문 — 좌우 24, 이 안에서만 스크롤. 맨 앞 자식(머리가 없으면)이면 위 24, 맨 끝 자식(바닥이 없으면)이면 아래 24.
// 끝에 닿아도 뒤 화면이 따라 스크롤되지 않는다(overscroll-behavior: contain — Scroll Area, 2026-10-10)
const BODY = [
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-x6 first:pt-x6",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const BODY_PLAIN = "last:pb-x6";
// 끝 흐림(scrollFog) — 본문 안 여백 위 20(머리가 없으면 24 그대로) · 아래 80(바닥이 있어도), 스크롤 여유도 위 20 · 아래 80
const BODY_FOG = "pt-[20px] pb-[80px] scroll-pt-[20px] scroll-pb-[80px]";

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 끝 흐림(Scroll Fog overlayBody — 위 20 · 아래 80, 늘 켜짐) — 넘칠 수 있는 본문(목록 · 긴 폼)에만 */
  scrollFog?: boolean;
}

const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(({ scrollFog = false, className, ...props }, ref) => {
  const own = React.useRef<HTMLDivElement>(null);
  useBodyScroll(own);
  useScrollFog(own, scrollFog ? "overlayBody" : null);
  return (
    <div
      ref={mergeRefs(ref, own)}
      data-slot="dialog-body"
      data-scroll-fog={scrollFog ? "overlayBody" : undefined}
      className={cn(BODY, scrollFog ? BODY_FOG : BODY_PLAIN, className)}
      {...props}
    />
  );
});
DialogBody.displayName = "DialogBody";

// 바닥 — 위 16 · 좌우 24 · 아래 24, 오른쪽 정렬 [취소] [저장], 사이 8. Button small 36
const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={cn("flex shrink-0 items-center justify-end gap-x2 px-x6 pb-x6 pt-x4", className)}
      {...props}
    >
      {withButtonSize(children, "small")}
    </div>
  ),
);
DialogFooter.displayName = "DialogFooter";

// 바닥 [취소] — neutralWeak. Radix 의 닫기라 Dialog 가 받아 닫기를 청한다(바뀐 값이 있으면 먼저 묻는다)
const DialogCancel = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant" | "asChild">>((props, ref) => (
  <DialogPrimitive.Close asChild>
    <Button ref={ref} variant="neutralWeak" data-slot="dialog-cancel" {...props} />
  </DialogPrimitive.Close>
));
DialogCancel.displayName = "DialogCancel";

// ── Responsive Dialog ────────────────────────────────────────
type ResponsiveContextValue = { wide: boolean; form: boolean };
const ResponsiveContext = React.createContext<ResponsiveContextValue | null>(null);

function useResponsive(name: string) {
  const ctx = React.useContext(ResponsiveContext);
  if (!ctx) throw new Error(`${name} 는 ResponsiveDialog 안에 둔다.`);
  return ctx;
}

// 1280 이상 Dialog · 미만 Bottom Sheet. 열림은 여기서 든다 — 표면이 바뀌어도 열린 채로 이어진다
function ResponsiveDialog({ open: openProp, defaultOpen, onOpenChange, form = false, dirty = false, children }: DialogProps) {
  const wide = useInputButtonSurface() === "popover";
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const value = React.useMemo(() => ({ wide, form }), [wide, form]);
  return (
    <ResponsiveContext.Provider value={value}>
      {wide ? (
        <Dialog open={open} onOpenChange={setOpen} form={form} dirty={dirty}>
          {children}
        </Dialog>
      ) : (
        <BottomSheet open={open} onOpenChange={setOpen} form={form} dirty={dirty}>
          {children}
        </BottomSheet>
      )}
    </ResponsiveContext.Provider>
  );
}
ResponsiveDialog.displayName = "ResponsiveDialog";

const ResponsiveDialogTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>>(
  (props, ref) => {
    const { wide } = useResponsive("ResponsiveDialogTrigger");
    return wide ? <DialogTrigger ref={ref} {...props} /> : <BottomSheetTrigger ref={ref} {...props} />;
  },
);
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

export interface ResponsiveDialogContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 제목 — 두 표면 모두 늘 둔다 */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 대화상자의 폭 — medium 480(기본) | large 800. 시트는 최대 480 */
  size?: keyof typeof SIZE;
}

const ResponsiveDialogContent = React.forwardRef<HTMLDivElement, ResponsiveDialogContentProps>(({ size, ...props }, ref) => {
  const { wide } = useResponsive("ResponsiveDialogContent");
  return wide ? <DialogContent ref={ref} size={size} {...props} /> : <BottomSheetContent ref={ref} {...props} />;
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

// 본문 — scrollFog 는 두 표면 모두 같다(위 20 · 아래 80)
const ResponsiveDialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>((props, ref) => {
  const { wide } = useResponsive("ResponsiveDialogBody");
  return wide ? <DialogBody ref={ref} {...props} /> : <BottomSheetBody ref={ref} {...props} />;
});
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

// 바닥 — 대화상자는 오른쪽 정렬 small 36, 시트는 폭을 나눈 large 48
const ResponsiveDialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { wide } = useResponsive("ResponsiveDialogFooter");
  return wide ? <DialogFooter ref={ref} {...props} /> : <BottomSheetFooter ref={ref} {...props} />;
});
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

// 바닥 [취소] — 1280 이상(대화상자)에서만 그린다. 시트에서는 위 닫기 버튼이 맡는다. 입력 폼(form)에만 둔다 —
// 조회 · 안내는 머리 닫기 버튼이 닫는다(닫기 버튼과 취소를 함께 두지 않는다)
const ResponsiveDialogCancel = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant" | "asChild">>((props, ref) => {
  const { wide, form } = useResponsive("ResponsiveDialogCancel");
  React.useEffect(() => {
    if (import.meta.env.DEV && !form) {
      console.warn("[ResponsiveDialog] 조회 · 안내 대화상자에는 바닥 취소를 두지 않는다 — 머리 닫기 버튼이 닫는다(form 이면 취소를 쓴다).");
    }
  }, [form]);
  return wide ? <DialogCancel ref={ref} {...props} /> : null;
});
ResponsiveDialogCancel.displayName = "ResponsiveDialogCancel";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogCancel,
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  ResponsiveDialogCancel,
};
