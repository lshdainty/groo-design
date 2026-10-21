import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useInputButtonSurface } from "@/components/ui/input-button";

/*
 * Groo Alert Dialog — 구조는 SEED Alert Dialog(2026-10-02). 수치 원본은 specs/components/alert-dialog.yaml.
 *
 *   AlertDialog              되돌릴 수 없는 일 앞에서 묻는 확인창(Radix AlertDialog) — open · defaultOpen · onOpenChange
 *   AlertDialogTrigger       여는 버튼 — 닫으면 초점이 여기로 돌아온다
 *   AlertDialogContent       확인창 — 딤 위 화면 정중앙, 최대 272 · 좌우 32 를 남긴다. 닫기 버튼이 없다
 *   AlertDialogTitle         묻는 말 — 없어도 된다. 없으면 Content 에 aria-label 로 묻는 말을 단다(둘 다 없으면 개발 중에 경고)
 *   AlertDialogDescription   무엇이 어떻게 되는지 · 되돌릴 수 없다는 사실 — 늘 둔다. 제목 아래 6
 *   AlertDialogFooter        버튼 — [취소] [확정] 을 반씩. 한쪽 글이 반 폭을 넘으면 세로로 쌓고 확정이 위, 하나면 폭 전체
 *   AlertDialogCancel        취소 — neutralWeak. 누르면 닫힌다
 *   AlertDialogAction        확정 — variant criticalSolid(지우기 · 잃기) | neutralSolid(기본). 누르면 닫힌다.
 *                            onClick 에서 e.preventDefault() 하면 닫지 않고, loading 이면 누르기를 막는다(서버 응답을 기다릴 때)
 *
 * 바깥(딤)을 눌러도 닫히지 않는다. Esc · 뒤로 가기(1280 미만)는 취소와 같다. 열면 초점은 확인창(컨테이너)으로 가고
 * 열린 동안 확인창 안을 돌며, 닫으면 연 자리(트리거, 없으면 열 때 초점이 있던 곳)로 돌아간다. role="alertdialog" + aria-modal.
 * 버튼은 1280 미만 medium 40 · 이상 small 36 — Footer 가 Input Button 과 같은 경계(useInputButtonSurface)로 정해,
 * 크기를 주지 않은 바로 아래 자식에 넣는다. 배치는 CSS 가 정한다 — 버튼마다 반 폭(사이 8)을 바탕으로 두고 글 폭보다 줄지
 * 않게 해, 한쪽이 반을 넘으면 줄이 넘어가고(wrap-reverse) 둘째(확정)가 위로 간다. DOM 순서는 늘 [취소] [확정] 이다.
 * 딤 z-alert 300 · 확인창 z-alert-content 301(specs/z-index.md L5) — 열린 대화상자 · 시트 위에 뜬다. 딤은 overlay-dim(라이트 0.50 · 다크 0.65).
 * 모션: 200ms enter-expressive 로 1.3 배에서 줄며 나타나고 100ms exit 로 줄지 않고 사라진다(딤은 100ms 로 나타나고 사라진다).
 * 모션 줄이기면 150ms 서서히 나타난다.
 *
 * 다른 겹침 표면(Bottom Sheet · Dialog)이 함께 쓰는 것도 여기 둔다 — 둘 다 이 파일을 부른다.
 *   useBackClose      1280 미만에서 열린 표면을 뒤로 가기로 닫는다 — 열 때 히스토리에 같은 주소로 한 칸 쌓고, popstate 가 오면
 *                     맨 위 표면 하나만 닫는다. 버튼 · Esc 로 먼저 닫으면 쌓은 칸을 되돌린다(한꺼번에 닫히면 한 번에 되돌린다).
 *                     1280 이상(데스크톱)에는 걸지 않는다 — 거기서 뒤로 가기는 "이전 페이지" 다(Desk 웹 useBackClose 와 같다)
 *   useLeaveConfirm   바뀐 값(dirty)이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다(Field 의 이탈 시 안내).
 *                     [계속 작성] 은 묻기 전 초점 자리로 돌려놓고, [나가기] 는 표면을 닫는다
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

// 열림 — open 을 주면 그 값(제어), 아니면 안에서 든다
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
function withButtonSize(children: React.ReactNode, size: ButtonProps["size"]): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<{ size?: unknown; children?: React.ReactNode }>(child)) return child;
    if (child.type === React.Fragment) return withButtonSize(child.props.children, size);
    if (typeof child.type === "string" || child.props.size !== undefined) return child;
    return React.cloneElement(child, { size });
  });
}

// 닫힌 뒤 초점을 연 자리로 — 트리거, 없으면 열 때 초점이 있던 곳. 둘 다 문서에서 빠졌으면 그대로 둔다
function focusOpener(trigger: HTMLElement | null, opener: Element | null) {
  const target =
    trigger?.isConnected ? trigger : opener instanceof HTMLElement && opener.isConnected && opener !== opener.ownerDocument.body ? opener : null;
  target?.focus({ preventScroll: true });
}

// ── 뒤로 가기(1280 미만) ───────────────────────────────────────
// 열린 표면마다 히스토리에 같은 주소로 한 칸을 쌓는다. 칸은 서로 구별하지 않고 개수로 센다 — popstate 하나가 칸 하나를 쓴다.
// history.state 는 물려준다(react-router 가 위치를 세는 idx 가 사라지지 않게).
const BACK_FLAG = "grooOverlayBack";

type BackSlot = { onBack: () => void; inHistory: boolean };

const backStack: BackSlot[] = [];
let selfPops = 0;
let pendingBack = 0;
let backBound = false;

function pushBackSlot(slot: BackSlot) {
  window.history.pushState({ ...window.history.state, [BACK_FLAG]: true }, "", window.location.href);
  slot.inHistory = true;
}

function onPopState() {
  // 우리가 되돌린 칸이 만든 popstate 는 건너뛴다 — 아래 표면까지 닫지 않게
  if (selfPops > 0) {
    selfPops -= 1;
    return;
  }
  for (let i = backStack.length - 1; i >= 0; i--) {
    const slot = backStack[i];
    if (slot?.inHistory) {
      slot.inHistory = false;
      slot.onBack();
      return;
    }
  }
}

function flushBack() {
  const count = pendingBack;
  pendingBack = 0;
  // 표면 안에서 다른 화면으로 이동했으면 꼭대기가 우리 칸이 아니다 — 되돌리면 방금 연 화면을 떠나므로 둔다
  if (count === 0 || window.history.state?.[BACK_FLAG] !== true) return;
  selfPops += 1;
  window.history.go(-count);
}

/**
 * 1280 미만에서 열린 표면을 뒤로 가기로 닫는다. enabled 인 동안 칸 하나를 쌓고, 뒤로 가기가 오면 맨 위 표면의 onBack 을 부른다.
 * onBack 이 닫지 않았으면(바뀐 값이 있어 물었으면) 돌려준 함수를 불러 칸을 다시 쌓는다 — 다음 뒤로 가기도 이 표면으로 온다.
 */
function useBackClose(enabled: boolean, onBack: () => void) {
  const onBackRef = React.useRef(onBack);
  React.useEffect(() => {
    onBackRef.current = onBack;
  });
  const slotRef = React.useRef<BackSlot | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    if (!backBound) {
      backBound = true;
      window.addEventListener("popstate", onPopState);
    }
    const slot: BackSlot = { onBack: () => onBackRef.current(), inHistory: false };
    slotRef.current = slot;
    backStack.push(slot);
    pushBackSlot(slot);
    return () => {
      slotRef.current = null;
      const i = backStack.indexOf(slot);
      if (i >= 0) backStack.splice(i, 1);
      if (!slot.inHistory) return; // 뒤로 가기가 닫았다 — 칸도 함께 사라졌다
      slot.inHistory = false;
      // 시트와 그 위 확인창이 함께 닫히면 칸 둘을 한 번에 되돌린다
      pendingBack += 1;
      if (pendingBack === 1) queueMicrotask(flushBack);
    };
  }, [enabled]);
  return React.useCallback(() => {
    const slot = slotRef.current;
    if (slot && !slot.inHistory) pushBackSlot(slot);
  }, []);
}

// ── 확인창 ───────────────────────────────────────────────────
type AlertContextValue = { triggerRef: React.RefObject<HTMLButtonElement | null> };
const AlertContext = React.createContext<AlertContextValue | null>(null);

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OpenChange;
  children?: React.ReactNode;
}

function AlertDialog({ open: openProp, defaultOpen, onOpenChange, children }: AlertDialogProps) {
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const narrow = useInputButtonSurface() === "sheet";
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  // 뒤로 가기 = 취소
  useBackClose(open && narrow, () => setOpen(false));
  const value = React.useMemo(() => ({ triggerRef }), []);
  return (
    <AlertContext.Provider value={value}>
      <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
        {children}
      </AlertDialogPrimitive.Root>
    </AlertContext.Provider>
  );
}
AlertDialog.displayName = "AlertDialog";

const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>((props, ref) => {
  const ctx = React.useContext(AlertContext);
  return <AlertDialogPrimitive.Trigger ref={mergeRefs(ref, ctx?.triggerRef)} data-slot="alert-dialog-trigger" {...props} />;
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// 딤 — overlay-dim 라이트 0.50 · 다크 0.65. 100ms 로 나타나고 사라진다
const OVERLAY = [
  "fixed inset-0 z-(--z-alert) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d2)] data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// 확인창 — 최대 272, 좌우 32 를 남긴다(화면이 336 보다 좁으면 화면 폭 − 64). 안쪽 20 · 모서리 20, 그림자 없음.
// 높이는 안전 영역 안 화면까지 — 넘치면 확인창 전체(제목 · 설명 · 버튼)가 스크롤된다(SEED, 2026-10-17 03-F 1A).
// 열림 200ms enter-expressive 로 1.3 배에서 줄며 나타난다(모션 줄이기면 150ms 서서히). 닫힘 100ms exit 로 사라진다
const CONTENT = [
  "fixed left-1/2 top-1/2 z-(--z-alert-content) flex w-[calc(100%-var(--spacing-x8)*2)] max-w-[272px] -translate-x-1/2 -translate-y-1/2 flex-col",
  "max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] overflow-y-auto",
  "rounded-r5 bg-bg-layer-floating p-x5 font-sans text-fg-neutral outline-none",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  "motion-safe:data-[state=open]:zoom-in-130 motion-safe:data-[state=open]:duration-[var(--motion-duration-d4)] motion-safe:data-[state=open]:ease-[var(--motion-ease-enter-expressive)]",
  "motion-reduce:data-[state=open]:duration-[var(--motion-duration-d3)] motion-reduce:data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// 제목이 없으면 aria-label 이 이름이다 — 둘 다 없거나 둘 다 있으면 개발 중에 알린다(열릴 때 그려진 확인창을 본다)
function checkName(el: HTMLElement | null, ariaLabel: string | undefined) {
  if (!import.meta.env.DEV || !el) return;
  const titled = el.querySelector('[data-slot="alert-dialog-title"]') != null;
  if (!titled && !ariaLabel?.trim()) {
    console.warn('[AlertDialog] 제목이 없으면 aria-label 로 묻는 말을 단다(예: "거래를 삭제할까요?").', el);
  } else if (titled && ariaLabel) {
    console.warn("[AlertDialog] 제목과 aria-label 을 함께 주지 않는다 — 제목이 이름이다.", el);
  }
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, "aria-label": ariaLabel, onOpenAutoFocus, onCloseAutoFocus, ...props }, ref) => {
  const ctx = React.useContext(AlertContext);
  const own = React.useRef<HTMLDivElement>(null);
  const openerRef = React.useRef<Element | null>(null);
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay" className={OVERLAY} />
      <AlertDialogPrimitive.Content
        ref={mergeRefs(ref, own)}
        data-slot="alert-dialog-content"
        aria-modal="true"
        className={cn(CONTENT, className)}
        // 처음 초점은 확인창 — Radix 기본(취소 버튼)을 쓰지 않는다
        onOpenAutoFocus={(e) => {
          openerRef.current = document.activeElement;
          checkName(own.current, ariaLabel);
          onOpenAutoFocus?.(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          own.current?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(e) => {
          onCloseAutoFocus?.(e);
          if (e.defaultPrevented) return;
          e.preventDefault();
          focusOpener(ctx?.triggerRef.current ?? null, openerRef.current);
        }}
        {...props}
      >
        {children}
        {/* 보이는 제목이 없을 때 — aria-label 을 숨은 제목으로 둬 aria-labelledby 가 그 글을 가리킨다 */}
        {ariaLabel != null && <AlertDialogPrimitive.Title className="sr-only">{ariaLabel}</AlertDialogPrimitive.Title>}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

// 제목 t7 20 / 27 · 700
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("m-0 text-t7 font-bold text-fg-neutral", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

// 설명 t5 16 / 22 — 다른 떠 있는 표면과 달리 짙은 fg-neutral(꼭 읽어야 할 말이다). 제목 아래 6, 제목이 없으면 0
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn("m-0 text-t5 font-normal text-fg-neutral [[data-slot=alert-dialog-title]+&]:mt-x1_5", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

// 바닥 — 위 16, 버튼 사이 8. 버튼마다 반 폭을 바탕으로(늘어나 채운다) 글 폭보다 줄지 않는다 — 한쪽 글이 반을 넘으면
// 줄이 넘어가고 wrap-reverse 라 둘째(확정)가 위로 간다. 하나면 폭 전체
const AlertDialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const size = useInputButtonSurface() === "popover" ? "small" : "medium";
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-footer"
        className={cn(
          "flex flex-wrap-reverse gap-x2 pt-x4 [&>*]:min-w-max [&>*]:grow [&>*]:basis-[calc(50%-var(--spacing-x2)/2)]",
          className,
        )}
        {...props}
      >
        {withButtonSize(children, size)}
      </div>
    );
  },
);
AlertDialogFooter.displayName = "AlertDialogFooter";

// 취소 — neutralWeak(취소를 Critical 로 칠하지 않는다). 크기는 Footer 가 넣는다
const AlertDialogCancel = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant" | "asChild">>((props, ref) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button ref={ref} variant="neutralWeak" data-slot="alert-dialog-cancel" {...props} />
  </AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export interface AlertDialogActionProps extends Omit<ButtonProps, "variant" | "asChild"> {
  /** 확정의 무게 — 지우기 · 잃기는 criticalSolid, 그 밖은 neutralSolid(기본) */
  variant?: "criticalSolid" | "neutralSolid";
}

// 확정 — 누르면 닫힌다. onClick 에서 e.preventDefault() 하면 닫지 않는다. loading 이면 Button 이 누르기를 삼켜 닫히지도 않는다
const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ variant = "neutralSolid", onClick, ...props }, ref) => (
    <AlertDialogPrimitive.Action asChild onClick={onClick}>
      <Button ref={ref} variant={variant} data-slot="alert-dialog-action" {...props} />
    </AlertDialogPrimitive.Action>
  ),
);
AlertDialogAction.displayName = "AlertDialogAction";

// ── 작성 중 나가기 ────────────────────────────────────────────
export interface LeaveConfirmOptions {
  /** 바뀐 값이 있다 — 있으면 묻고, 없으면 바로 닫는다 */
  dirty: boolean;
  /** 닫는다(표면의 onOpenChange(false)) */
  leave: () => void;
  /** 묻기 전 초점 자리가 사라졌을 때 돌아갈 표면 */
  contentRef: React.RefObject<HTMLElement | null>;
}

/**
 * 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다(Field 의 이탈 시 안내). request() 는 닫기를 청한다 —
 * 바로 닫았으면 true, 물었으면 false. node 를 표면 곁에 그린다(확인창은 L5 라 시트 · 대화상자 위에 뜬다).
 */
function useLeaveConfirm({ dirty, leave, contentRef }: LeaveConfirmOptions) {
  const [asking, setAsking] = React.useState(false);
  const dirtyRef = React.useRef(dirty);
  const leaveRef = React.useRef(leave);
  React.useEffect(() => {
    dirtyRef.current = dirty;
    leaveRef.current = leave;
  });
  const returnRef = React.useRef<HTMLElement | null>(null);
  const leavingRef = React.useRef(false);
  const request = React.useCallback(() => {
    if (!dirtyRef.current) {
      leaveRef.current();
      return true;
    }
    const active = document.activeElement;
    returnRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    setAsking(true);
    return false;
  }, []);
  const node = (
    <AlertDialog open={asking} onOpenChange={setAsking}>
      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          // [나가기] — 표면도 닫히므로 초점은 표면이 연 자리로 돌려놓는다
          if (leavingRef.current) {
            leavingRef.current = false;
            return;
          }
          // [계속 작성] · Esc · 뒤로 가기 — 묻기 전 초점 자리(없으면 표면)로
          const back = returnRef.current?.isConnected ? returnRef.current : contentRef.current;
          back?.focus({ preventScroll: true });
        }}
      >
        <AlertDialogTitle>작성한 내용이 사라져요</AlertDialogTitle>
        <AlertDialogDescription>나가면 입력한 내용이 저장되지 않아요.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>계속 작성</AlertDialogCancel>
          <AlertDialogAction
            variant="criticalSolid"
            onClick={() => {
              leavingRef.current = true;
              leaveRef.current();
            }}
          >
            나가기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return { request, asking, node };
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  useBackClose,
  useLeaveConfirm,
};
