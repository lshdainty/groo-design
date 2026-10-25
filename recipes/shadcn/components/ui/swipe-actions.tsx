import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Groo Swipe Actions — groo 에만 있는 패턴(SEED 에는 줄 밀기가 없다). 수치 원본은 specs/components/swipe-actions.yaml.
 * 2026-10-02 — 미는 지름길은 남기고 같은 동작을 줄 끝 ⋮ → Menu Sheet 로도 열었다. 2026-10-08 — 다크 배지 · 중립 배지 · 라벨 색 ·
 * 줄 높이 1.3 · Esc 뒤 초점을 고쳤다(데이터 표시 결정의 "줄 밀기"). 2026-10-25 — 목록 줄의 ⋮ 를 걷었다(SwipeActionsMenu 걷음) —
 * 같은 동작은 줄을 눌러 들어간 화면(바닥 [삭제] · 머리 ⋮)에 다 둔다(menu.md "줄의 동작").
 *
 *   SwipeActions          폰(768 미만) 목록 줄을 감싼다 — 왼쪽으로 밀면 오른쪽에서 동작 칸이 드러난다. actions(1 ~ 3개 —
 *                         { kind, label, icon, disabled, onSelect }, 뜻의 차례로) · enabled(폰일 때만 true — 768 이상이면 false 로 넘겨
 *                         줄만 그린다) · rowLabel(동작 이름에 붙는 줄 제목 — "삭제: 스타벅스"). 동작을 누르면 트레이를 닫은 뒤 onSelect.
 *                         감싼 줄은 tabIndex -1 로 초점을 받을 수 있고, 열린 트레이를 Esc 로 닫으면 초점을 줄로 옮긴다
 *   SwipeActionsProvider  목록의 조상 — 한 번에 한 줄만 열리고(다른 줄을 끌면 열린 줄이 닫힌다), 목록을 스크롤하면 닫힌다
 *
 * 줄을 다시 만들지 않는다 — 기존 줄을 감싸기만 한다(모양 · 누르기는 그대로). 동작은 고정 목록이 아니라 부르는 쪽이 1 ~ 3개를 조립한다.
 * 판정은 뷰포트 폭(768 미만)이고 이 컴포넌트는 판정하지 않고 enabled 로 받는다. 끝까지 밀어도 실행하지 않는다(되돌리기가 없다).
 *
 * 동작 칸: 원형 배지 36 · 아이콘 18 + 아래 라벨(사이 2), 세로 가운데. 간격은 배지 앞에만 — 첫 칸 앞 20 · 칸 사이 12, 마지막 칸은
 *   화면 끝에 붙는다. 칸 폭은 첫 칸 56 · 다음부터 48(트레이 56 · 104 · 152). 높이는 줄을 따르되 56 보다 낮으면 56 — 누르는 자리는 칸 전체.
 *   destructive 는 가장 안쪽(화면에서 가장 왼쪽)에 그린다 — 부르는 쪽은 뜻의 차례 그대로 넘기고 그리는 쪽이 뒤집는다.
 * 색은 원형 배지만 — 트랙(줄 뒤에 드러나는 자리)은 칠하지 않는다.
 *   primary · destructive — 배지를 그 동작의 글자색(fg-informative · fg-critical)으로 채우고 아이콘은 반전 글자(fg-neutral-inverted):
 *     라이트 짙은 배지 + 흰 아이콘, 다크 밝은 배지 + 짙은 아이콘 — 두 모드 모두 줄 바탕과 3:1 을 넘는다(5.06 · 5.09 · 다크 6.08 · 6.12).
 *   neutral — 옅은 바탕(bg-neutral-weak) + 안쪽 1px stroke-neutral-weak, 아이콘 fg-neutral(바탕만으로는 줄과 1.08 · 다크 1.30).
 *   라벨은 배지 밖이라 본문 색 — neutral · primary fg-neutral-muted, destructive 만 fg-critical(라이트 · 다크 한 토큰).
 * 라벨 12 / 700 / 1.3(크기만 t2 — 칸 폭 48 이라 기본 줄 높이면 두 줄에서 넘친다). 한글 두 글자 동사.
 * 상태: 호버(웹)는 누름과 같다 — 배지 · 라벨 밝기 88%, 움직이지 않는다(밀어 둔 트레이와 이중으로 움직이면 어지럽다).
 *   키보드 포커스에만 칸 안쪽 2px 링(stroke-focus-ring — 트레이 바깥으로 나가면 줄 경계에서 잘린다). 막힘은 배지 bg-disabled ·
 *   아이콘 · 라벨 fg-disabled — 흐리게 하지 않는다. neutral 배지의 안쪽 1px stroke-neutral-weak 은 막혀도 남는다(v106 · Q-012-4).
 * 제스처: 데드존 8 · 축 확정 abs(dx) > abs(dy) × 1.5 · 세로는 브라우저에 남긴다(touch-action: pan-y) · 미는 동안 글 고르기 · 길게
 *   누름 메뉴를 막는다 · 놓을 때 트레이 폭의 40% 이상이면 열린 채로 · 열린 채 되돌려 25% 이상이면 닫힌다. 끄는 동안은 손가락을 1:1 로
 *   따라가고, 놓은 뒤 자리를 잡는 것만 150ms(motion-duration-d3) 감속(motion-ease-enter) — 모션 줄이기면 바로. RTL 은 미는 방향이 뒤집힌다.
 * 열린 채 줄을 누르면 닫기만 한다(상세로 가지 않는다). 동작을 누르면 트레이를 먼저 닫고 실행한다 — 확인 창은 그 뒤에 뜬다.
 * 보조 기술: 닫힌 트레이는 aria-hidden · 버튼 tabindex -1(줄마다 "수정 삭제" 를 읽지 않게). 동작 이름은 "라벨: 줄 제목".
 *   키보드 · 스크린리더는 줄을 눌러 들어간 화면에서 같은 동작에 닿는다 — 트레이의 동작은 모두 그 화면에도 둔다.
 */

/** 원형 배지 지름(px). 줄 높이 안에 배지 + 라벨이 함께 들어가는 최대치. */
export const SWIPE_BADGE_SIZE = 36;

/** 배지 안 아이콘(px). */
export const SWIPE_ICON_SIZE = 18;

/** 줄 내용과 첫 동작 사이. 바짝 붙으면 배지가 줄에 얹힌 것처럼 보인다. */
export const SWIPE_GAP_LEAD = 20;

/** 동작끼리 사이. 배지 둘이 붙으면 하나의 알약처럼 뭉쳐 보인다. */
export const SWIPE_GAP_BETWEEN = 12;

/** 배지와 라벨 사이. */
export const SWIPE_LABEL_GAP = 2;

/** 칸 최소 높이 — WCAG 2.5.5(AAA, 44×44)를 밑돌지 않게. */
export const SWIPE_MIN_HEIGHT = 56;

/**
 * 동작 하나가 차지하는 폭 — 배지 + 그 **앞** 간격.
 *
 * 간격을 앞에만 둔다. 뒤에도 두면 마지막 배지와 화면 끝이 벌어져 덜 열린 것처럼 보인다.
 */
export const swipeSlotWidth = (index: number) => SWIPE_BADGE_SIZE + (index === 0 ? SWIPE_GAP_LEAD : SWIPE_GAP_BETWEEN);

/** 트레이 전체 폭 — 1개 56 / 2개 104 / 3개 152. */
export const swipeTrayWidth = (count: number) => Array.from({ length: count }, (_, i) => swipeSlotWidth(i)).reduce((a, b) => a + b, 0);

/** 닫힌 상태에서 이 비율 이상 밀면 열린 채로 자리를 잡는다. */
const OPEN_THRESHOLD = 0.4;

/**
 * 열린 상태에서 **되돌려 민** 거리가 이 비율 이상이면 닫는다.
 *
 * 여는 문턱(0.4)을 닫는 쪽에 그대로 걸지 않는다 — 두 범위가 맞물려 아예 열리지 않는다.
 */
const CLOSE_THRESHOLD = 0.25;

/** 이보다 짧은 이동은 누르기로 본다 — 축을 판정하지 않는다. */
const DEAD_ZONE = 8;

/** 가로로 확정하는 기울기. 45°(1배)면 세로로 훑는 중 스크롤이 끊긴다. */
const AXIS_RATIO = 1.5;

type SwipeAxis = "none" | "x" | "y";

/** 데드존을 넘은 뒤 어느 축의 제스처인지 확정한다. */
const resolveAxis = (dx: number, dy: number): SwipeAxis => {
  if (Math.hypot(dx, dy) < DEAD_ZONE) return "none";
  return Math.abs(dx) > Math.abs(dy) * AXIS_RATIO ? "x" : "y";
};

/** 트레이 폭에서 멈춘다. 반대 방향으로 밀면 0 에 머문다. */
const clampOffset = (dragged: number, tray: number) => Math.max(0, Math.min(dragged, tray));

/**
 * 동작 칸 = 원형 배지(아이콘) + 그 아래 라벨.
 *
 * 색은 배지만 갖는다 — 트레이에 색을 깔면 줄 옆에 상자가 하나 더 생긴 것처럼 보이고, 색 덩어리가 화면을 반 갈라 줄보다 먼저 눈에 들어온다.
 * 배지 · 라벨 색은 kind 마다(머리 주석). 칸 자신은 움직이지 않는다 — 누름 · 호버는 밝기 88% 만.
 */
// 칸(버튼) — 라벨 색 · 글자 · 밝기 · 링. 막히면 라벨 fg-disabled
const swipeActionVariants = cva(
  [
    "flex shrink-0 cursor-pointer flex-col items-center justify-center gap-x0_5 self-stretch border-0 bg-transparent",
    "min-h-14 font-sans text-t2 font-bold leading-[1.3]",
    "[transition:filter_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "hover:brightness-[0.88] active:brightness-[0.88]",
    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
    "disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:brightness-100 disabled:active:brightness-100",
  ].join(" "),
  {
    variants: {
      kind: {
        neutral: "text-fg-neutral-muted",
        primary: "text-fg-neutral-muted",
        destructive: "text-fg-critical",
      },
    },
    defaultVariants: { kind: "neutral" },
  },
);

// 원형 배지 — 색은 여기만. primary · destructive 는 그 동작의 글자색 + 반전 아이콘, neutral 은 옅은 바탕 + 안쪽 1px 테두리
const swipeBadgeVariants = cva("flex items-center justify-center rounded-full [&>svg]:size-[18px]", {
  variants: {
    kind: {
      neutral: "bg-bg-neutral-weak text-fg-neutral shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
      primary: "bg-fg-informative text-fg-neutral-inverted",
      destructive: "bg-fg-critical text-fg-neutral-inverted",
    },
    disabled: {
      // neutral 의 안쪽 1px 테두리(shadow)는 남긴다 — v106 막힘의 테두리 색이 stroke-neutral-weak 다(Q-012-4)
      true: "bg-bg-disabled text-fg-disabled",
      false: "",
    },
  },
  defaultVariants: { kind: "neutral", disabled: false },
});

export interface SwipeAction extends VariantProps<typeof swipeActionVariants> {
  /** 라벨 — 한글 두 글자 동사("수정" · "삭제" · "고정"). 그보다 길면 줄바꿈된다 */
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /**
   * destructive 는 여기서 바로 지우지 말고 확인 창(Alert Dialog)부터 — 제목 · 설명은 상세에서 지울 때와 같은 문구를 부르는 쪽이 넘긴다.
   * 트레이는 **먼저 닫히고** 나서 부른다 — 열어 둔 채 띄우면 취소하고 돌아왔을 때 그대로 열려 있다.
   */
  onSelect: () => void;
}

// ── 한 번에 한 줄 ─────────────────────────────────────────────
type SwipeActionsContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const SwipeActionsContext = React.createContext<SwipeActionsContextValue | null>(null);

/** 목록의 조상 — 한 번에 한 줄만 열리고, 목록(또는 화면)을 스크롤하면 열린 줄이 닫힌다 */
function SwipeActionsProvider({ children }: { children?: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (openId == null) return;
    const close = () => setOpenId(null);
    window.addEventListener("scroll", close, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", close, { capture: true });
  }, [openId]);
  const value = React.useMemo(() => ({ openId, setOpenId }), [openId]);
  return <SwipeActionsContext.Provider value={value}>{children}</SwipeActionsContext.Provider>;
}

export interface SwipeActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 1 ~ 3개 — 뜻의 차례로(그리는 쪽이 뒤집어 destructive 를 가장 안쪽에 둔다) */
  actions: SwipeAction[];
  /** 폰(768 미만)일 때만 true — false 면 트레이 없이 줄만 그린다 */
  enabled?: boolean;
  /** 동작 이름에 붙는 줄 제목 — "삭제: 스타벅스". 열린 트레이를 훑을 때 어느 줄인지 알 수 있게 */
  rowLabel?: string;
  children: React.ReactNode;
}

const SwipeActions = React.forwardRef<HTMLDivElement, SwipeActionsProps>(
  ({ actions, enabled = true, rowLabel, className, children, onKeyDown, ...props }, ref) => {
    const group = React.useContext(SwipeActionsContext);
    const id = React.useId();
    const [open, setOpen] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);
    const rowRef = React.useRef<HTMLDivElement>(null);
    /** 제스처 시작점 + 시작 때의 오프셋. 끄는 동안에만 값이 있다. */
    const start = React.useRef<{ x: number; y: number; offset: number } | null>(null);
    const axis = React.useRef<SwipeAxis>("none");
    /** 지금 오프셋. 끄는 동안에는 다시 그리지 않고 CSS 변수로만 반영한다. */
    const offset = React.useRef(0);

    // 동작마다 칸 폭이 다르다 — 첫 동작만 줄에서 더 떨어뜨린다.
    const trayWidth = swipeTrayWidth(actions.length);

    /** 끄는 동안은 손가락을 1:1 로 따라간다 — 다시 그리면 따라오는 속도가 어긋난다. */
    const paint = (next: number) => {
      offset.current = next;
      rowRef.current?.style.setProperty("--swipe-offset", `${next}px`);
    };

    const close = React.useCallback(() => {
      setOpen(false);
      paint(0);
    }, []);

    // 다른 줄이 열리거나 목록을 스크롤하면 닫힌다(SwipeActionsProvider)
    const openId = group?.openId;
    React.useEffect(() => {
      if (group && open && openId !== id) close();
    }, [group, open, openId, id, close]);

    const commit = (next: boolean) => {
      setOpen(next);
      paint(next ? trayWidth : 0);
      if (next) group?.setOpenId(id);
      else if (group?.openId === id) group.setOpenId(null);
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      start.current = { x: e.clientX, y: e.clientY, offset: offset.current };
      axis.current = "none";
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const s = start.current;
      if (!s) return;

      const rawX = e.clientX - s.x;
      const rawY = e.clientY - s.y;

      if (axis.current === "none") {
        const next = resolveAxis(rawX, rawY);
        if (next === "none") return;
        axis.current = next;
        // 세로로 확정되면 이번 제스처는 포기한다 — 스크롤은 브라우저가 맡는다.
        if (next === "y") {
          start.current = null;
          return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        // 이 줄을 끌기 시작했다 — 열려 있던 다른 줄은 닫힌다
        group?.setOpenId(id);
      }

      // RTL 은 미는 방향이 뒤집힌다 — 트레이가 드러나는 거리를 양수로 맞춘다.
      const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
      const revealed = s.offset + (rtl ? rawX : -rawX);
      paint(clampOffset(revealed, trayWidth));
    };

    const settle = () => {
      const s = start.current;
      start.current = null;
      if (axis.current !== "x") {
        axis.current = "none";
        return;
      }
      axis.current = "none";
      setDragging(false);

      // 열 때와 닫을 때가 다른 문턱 — 같은 값을 걸면 두 범위가 맞물려 아예 열리지 않는다.
      const wasOpen = (s?.offset ?? 0) > 0;
      commit(wasOpen ? trayWidth - offset.current < trayWidth * CLOSE_THRESHOLD : offset.current >= trayWidth * OPEN_THRESHOLD);
    };

    if (!enabled || actions.length === 0) return <>{children}</>;

    return (
      <div
        ref={ref}
        data-slot="swipe-actions"
        data-state={open ? "open" : "closed"}
        className={cn(
          // 트랙은 칠하지 않는다 — 놓인 면이 그대로 보인다
          "relative overflow-hidden touch-pan-y select-none",
          "[--swipe-offset:0px] [--swipe-dir:-1] rtl:[--swipe-dir:1]",
          "[-webkit-touch-callout:none]",
          className,
        )}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          // 열린 트레이를 Esc 로 닫고 초점을 줄로 — 숨긴 트레이 버튼에 초점이 남지 않게
          if (e.key === "Escape" && open) {
            commit(false);
            rowRef.current?.focus({ preventScroll: true });
          }
        }}
        {...props}
      >
        {/* 트레이는 줄 뒤에 늘 있다. 닫혀 있을 땐 보조 기술에서 감춘다 — 안 그러면 줄마다 "수정 삭제" 를 읽는다. */}
        <div data-slot="swipe-actions-tray" className="absolute inset-y-0 end-0 flex" aria-hidden={!open}>
          {/* 뒤집어 그린다 — 조금만 밀면 바깥쪽부터 드러나므로, 차례대로 두면 파괴적 동작이 제일 먼저 손에 닿는다. */}
          {[...actions].reverse().map((a, i) => (
            <button
              key={a.label}
              type="button"
              disabled={a.disabled}
              tabIndex={open ? 0 : -1}
              aria-label={rowLabel ? `${a.label}: ${rowLabel}` : a.label}
              data-slot="swipe-action"
              data-kind={a.kind ?? "neutral"}
              className={swipeActionVariants({ kind: a.kind })}
              // 간격을 배지 앞에만 둬 마지막 동작이 트레이 끝에 딱 붙는다.
              style={{
                inlineSize: swipeSlotWidth(i),
                paddingInlineStart: i === 0 ? SWIPE_GAP_LEAD : SWIPE_GAP_BETWEEN,
                minBlockSize: SWIPE_MIN_HEIGHT,
              }}
              // 트레이를 먼저 닫고 실행한다 — 열어 둔 채 확인 창을 띄우면 취소하고 돌아왔을 때 그대로 열려 있다.
              onClick={() => {
                commit(false);
                a.onSelect();
              }}
            >
              <span
                aria-hidden
                data-slot="swipe-action-badge"
                className={cn(swipeBadgeVariants({ kind: a.kind, disabled: !!a.disabled }))}
                style={{ inlineSize: SWIPE_BADGE_SIZE, blockSize: SWIPE_BADGE_SIZE }}
              >
                {a.icon}
              </span>
              <span data-slot="swipe-action-label">{a.label}</span>
            </button>
          ))}
        </div>

        <div
          ref={rowRef}
          tabIndex={-1}
          data-slot="swipe-actions-row"
          className={cn(
            "relative bg-bg-layer-default",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
            // 끄는 동안에는 손가락을 1:1 로 따라간다 — 손을 뗀 뒤 자리를 잡을 때만 전환을 쓴다.
            !dragging &&
              "[transition:transform_var(--motion-duration-d3)_var(--motion-ease-enter)] motion-reduce:[transition:none]",
          )}
          style={{ transform: "translateX(calc(var(--swipe-dir) * var(--swipe-offset)))" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={settle}
          onPointerCancel={settle}
          // 열려 있으면 누르기는 닫기만 한다 — 열어 둔 걸 못 보고 누르는 일이 많다.
          onClickCapture={(e) => {
            if (!open) return;
            e.preventDefault();
            e.stopPropagation();
            commit(false);
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
SwipeActions.displayName = "SwipeActions";

export { SwipeActions, SwipeActionsProvider, swipeActionVariants, swipeBadgeVariants };
