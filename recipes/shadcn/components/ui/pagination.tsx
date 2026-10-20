import * as React from "react";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { useWaitPhase } from "@/components/ui/skeleton";

/*
 * Groo Pagination — 구조는 SEED Pagination(2026-10-04). 수치 원본은 specs/components/pagination.yaml(넘김 줄) ·
 * infinite-list.yaml(폰의 끝없이 불러오기 — 목록 끝 자리). 옛 Pagination(shadcn — 지금 쪽 테두리 · 칸 사이 4 · 이전 · 다음 글자)을 대신한다.
 *
 *   Pagination        데스크톱(768 이상) 목록 아래 가운데의 넘김 줄 — <nav aria-label="페이지 탐색">
 *     totalPages      전체 쪽 수 — 1 이하면 그리지 않는다
 *     page · defaultPage(1) · onPageChange(page, { reason })   reason "page-item" · "previous" · "next"
 *     getHref(page)   주면 칸이 링크(<a>) — 쪽이 주소(?page=3)에 있을 때. 없으면 <button type="button">
 *     scrollTarget    목록 상자 — 쪽이 바뀌면 그 위 끝이 보이게 스크롤한다
 *     disabled        목록을 다시 받는 동안 — 넘기지 않는다(두 번 넘기지 않게)
 *     aria-label      기본 "페이지 탐색" — 목록이 둘 이상이면 "카드 혜택 페이지 탐색" 처럼
 *   paginationItems(page, totalPages, slots)   칸 배열을 돌려주는 규칙 함수(앱도 같은 규칙) — 아래 "칸 수"
 *   InfiniteListEnd   폰(768 미만)의 긴 목록 끝 자리 — status "loading" · "error" · "end", onRetry · endText · onReachEnd
 *
 * 칸 수 — 화면 폭으로 고정이다(breakpoint-sm 480): 480 이상 9칸 · 미만 7칸(화살표 둘 포함). 쪽이 바뀌어도 줄의 폭과 칸 자리는
 *   그대로이고 생략(…)만 옮겨 간다. 전체 쪽이 칸 수보다 적으면 모든 번호를 보인다(SEED usePagination 과 같은 식).
 *     9칸  앞쪽(지금 ≤ 4)   ‹ 1 2 3 4 5 … N ›   가운데   ‹ 1 … p−1 p p+1 … N ›   뒤쪽(지금 ≥ N−3)   ‹ 1 … N−4 N−3 N−2 N−1 N ›
 *     7칸  앞쪽(지금 ≤ 3)   ‹ 1 2 3 4 … ›       가운데   ‹ … p−1 p p+1 … ›       뒤쪽(지금 ≥ N−2)   ‹ … N−3 N−2 N−1 N ›
 *   7칸의 가운데 구간에는 첫 · 마지막 번호가 없다(SEED). 첫 쪽의 이전 · 마지막 쪽의 다음 자리는 40 빈 칸(보조 기술에 숨긴다).
 *
 * 쪽을 넘기면 — 목록(scrollTarget)의 위 끝이 보이게 스크롤하고, 숨은 상태 글(role="status")로 "N페이지, 전체 M페이지" 를 한 번 알린다.
 *   초점은 누른 칸에 남는다 — 번호를 눌렀으면 그 쪽 번호(칸 자리가 바뀌어도 따라간다), 화살표를 눌렀으면 그 화살표.
 *   끝 쪽에 닿아 누르던 화살표가 빈 칸이 되면 초점을 지금 쪽 번호로 옮긴다(초점이 화면 맨 앞으로 떨어지지 않게 — SEED 는 body 로 떨어진다).
 *   누를 때 초점이 이 줄 밖에 있었으면(초점을 주지 않는 브라우저의 마우스 누르기) 옮기지 않는다.
 * 링크(getHref) — 새 탭 · 수정 키 누르기는 브라우저에 맡긴다. 그냥 누르기는 onPageChange 를 주었으면 그쪽으로 넘기고(라우터가 주소를
 *   바꾸는 자리 — 링크의 기본 이동은 막는다), 주지 않았으면 브라우저가 그 주소로 간다. 지금 쪽 · 막힌 줄은 눌러도 아무것도 하지 않는다.
 * 막힘(disabled) — 칸은 aria-disabled 로 남긴다(초점이 그 자리를 잃지 않게). 번호 · 화살표 fg-disabled, 지금 쪽은 bg-disabled.
 *
 * 모양: 칸 40 × 40 을 사이 없이 잇는다(9칸 360 · 7칸 280), 목록 끝 → 줄 24, 가운데. 번호 t4 14 / 19 · 700 · fg-neutral · 숫자 폭 고정 ·
 *   세 자리마다 쉼표, 칸을 넘으면 말줄임(숫자는 칸 이름에 있다). 화살표는 아이콘만 16(chevron). 생략은 40 상자 + 점 셋 16. 모서리 r2 8.
 *   지금 쪽은 짙은 채움 bg-neutral-inverted + fg-neutral-inverted(다크는 밝은 반전) — 브랜드 색이 아니다. aria-current="page".
 *   누르는 영역은 위아래만 44(보이지 않는 여백 2 씩), 옆은 칸 폭 40 — v106 "누르는 영역 44" 의 예외(사용자 결정 2026-10-04).
 * 상태: 호버(웹) · 누름 bg-layer-default-pressed(지금 쪽은 bg-neutral-inverted-pressed), 누르면 2px 거리 축소(40 → 0.95 — 모션 줄이기면
 *   하지 않는다), 키보드 포커스에만 칸 바깥 2px 링(띄움 2 — 붙은 이웃 칸 위에 그린다).
 * 모션: 바탕 색 150ms easing · 축소 150ms pressed-scale.
 * 이름: 줄 "페이지 탐색", 칸 "N페이지", 화살표 "이전 페이지" · "다음 페이지"(SEED 문구) — 생략 · 빈 칸은 aria-hidden.
 */

// ── 칸 수 · 칸 배열 ──────────────────────────────────────────
export type PaginationSlots = 7 | 9;
export type PaginationChangeReason = "page-item" | "previous" | "next";
export interface PaginationChangeDetails {
  reason: PaginationChangeReason;
}

/** 칸 하나 — 쪽 번호 · 이전 · 다음(누르면 갈 쪽) · 생략 · 빈 칸(끝 쪽의 화살표 자리) */
export type PaginationItem =
  | { type: "page"; page: number }
  | { type: "previous"; page: number }
  | { type: "next"; page: number }
  | { type: "ellipsis"; page?: undefined }
  | { type: "empty"; page?: undefined };

const range = (start: number, end: number): PaginationItem[] =>
  Array.from({ length: end - start + 1 }, (_, i) => ({ type: "page", page: start + i }));

const ELLIPSIS: PaginationItem = { type: "ellipsis" };

// 번호 · 생략 칸(화살표 둘을 뺀 칸) — SEED usePagination 의 createItems · createCompactItems 와 같은 식
function middleItems(page: number, total: number, slots: PaginationSlots): PaginationItem[] {
  const available = slots - 2;
  if (total <= available) return range(1, total);
  if (available === 5) {
    if (page <= 3) return [...range(1, 4), ELLIPSIS];
    if (page >= total - 2) return [ELLIPSIS, ...range(total - 3, total)];
    return [ELLIPSIS, ...range(page - 1, page + 1), ELLIPSIS];
  }
  const siblings = Math.floor((available - 5) / 2); // 9칸이면 1
  const edge = available - 2; // 앞 · 뒤 구간의 번호 수 — 9칸이면 5
  const threshold = edge - siblings; // 9칸이면 4
  if (page <= threshold) return [...range(1, edge), ELLIPSIS, { type: "page", page: total }];
  if (page >= total - threshold + 1) return [{ type: "page", page: 1 }, ELLIPSIS, ...range(total - edge + 1, total)];
  return [{ type: "page", page: 1 }, ELLIPSIS, ...range(page - siblings, page + siblings), ELLIPSIS, { type: "page", page: total }];
}

/**
 * 칸 배열 — 앞뒤 화살표(끝 쪽이면 빈 칸) + 번호 · 생략. 1쪽 이하면 빈 배열(넘김 줄을 그리지 않는다).
 * page 는 1 ~ totalPages 로 맞춘다. slots 는 화살표를 포함한 칸 수(480 이상 9 · 미만 7).
 */
function paginationItems(page: number, totalPages: number, slots: PaginationSlots = 9): PaginationItem[] {
  const total = Number.isFinite(totalPages) ? Math.floor(totalPages) : 0;
  if (total <= 1) return [];
  const p = Math.min(Math.max(Number.isFinite(page) ? Math.floor(page) : 1, 1), total);
  const n: PaginationSlots = slots === 7 ? 7 : 9;
  return [
    p > 1 ? { type: "previous", page: p - 1 } : { type: "empty" },
    ...middleItems(p, total, n),
    p < total ? { type: "next", page: p + 1 } : { type: "empty" },
  ];
}

// 480(breakpoint-sm) 이상 9칸 · 미만 7칸 — rem 으로 적으면 브라우저 글자 크기 설정에 따라 어긋난다. 서버에서는 7칸
const WIDE_QUERY = "(min-width: 480px)";
function subscribeWide(onChange: () => void) {
  const mql = window.matchMedia(WIDE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
function usePaginationSlots(): PaginationSlots {
  return React.useSyncExternalStore(
    subscribeWide,
    () => (window.matchMedia(WIDE_QUERY).matches ? 9 : 7),
    () => 7,
  );
}

const formatNumber = (n: number) => n.toLocaleString("ko-KR");

// ── 모양 ─────────────────────────────────────────────────────
// 칸 — 40 × 40 · 모서리 8, 누르는 영역은 위아래만 44(::before 2 씩). 키보드 포커스에만 바깥 2px 링 — 이웃 칸 위로 올린다
const CELL = [
  "relative flex size-10 shrink-0 items-center justify-center rounded-r2 border-0 bg-transparent p-0 font-sans no-underline",
  "before:absolute before:inset-x-0 before:inset-y-[-2px] before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 누를 수 있는 칸 — 호버(마우스 기기) · 누름 바탕 + 2px 거리 축소(40 → 0.95)
const CELL_ENABLED = "cursor-pointer text-fg-neutral active:[scale:calc(1-2/40)] motion-reduce:active:[scale:1]";
const CELL_OTHER = "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
const CELL_CURRENT = "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed";
// 막힌 칸 — 전용 색, 바탕 · 축소 없음(지금 쪽은 bg-disabled)
const CELL_DISABLED = "cursor-not-allowed text-fg-disabled";
const CELL_DISABLED_CURRENT = "bg-bg-disabled";
// 번호 — t4 · 700 · 숫자 폭 고정, 칸을 넘으면 말줄임
const LABEL = "block min-w-0 max-w-full truncate text-t4 font-bold tabular-nums";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange" | "children"> {
  /** 전체 쪽 수 — 1 이하면 그리지 않는다 */
  totalPages: number;
  /** 지금 쪽(1부터) — 주면 제어한다 */
  page?: number;
  /** 처음 쪽 — 기본 1 */
  defaultPage?: number;
  /** 쪽이 바뀔 때 — reason "page-item" · "previous" · "next" */
  onPageChange?: (page: number, details: PaginationChangeDetails) => void;
  /** 주면 칸이 링크 — 쪽이 주소에 있을 때(`(p) => \`?page=${p}\``) */
  getHref?: (page: number) => string;
  /** 목록 상자 — 쪽이 바뀌면 그 위 끝이 보이게 스크롤한다 */
  scrollTarget?: React.RefObject<HTMLElement | null>;
  /** 목록을 다시 받는 동안 — 넘기지 않는다 */
  disabled?: boolean;
  /** 기본 "페이지 탐색" */
  "aria-label"?: string;
}

type FocusIntent = { kind: "page" } | { kind: "previous" | "next" };
type Pending = { page: number; focus: FocusIntent | null };

// 링크를 새 탭 · 새 창으로 여는 누르기 — 브라우저에 맡긴다
const isModifiedClick = (e: React.MouseEvent) => e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      totalPages,
      page: pageProp,
      defaultPage = 1,
      onPageChange,
      getHref,
      scrollTarget,
      disabled = false,
      "aria-label": ariaLabel = "페이지 탐색",
      className,
      ...props
    },
    ref,
  ) => {
    const slots = usePaginationSlots();
    const [inner, setInner] = React.useState(defaultPage);
    const controlled = pageProp !== undefined;
    const total = Number.isFinite(totalPages) ? Math.max(Math.floor(totalPages), 0) : 0;
    const current = Math.min(Math.max(Math.floor((controlled ? pageProp : inner) ?? 1), 1), Math.max(total, 1));
    const items = paginationItems(current, total, slots);

    const rowRef = React.useRef<HTMLDivElement>(null);
    const pendingRef = React.useRef<Pending | null>(null);
    const [message, setMessage] = React.useState("");

    const change = (next: number, reason: PaginationChangeReason, focus: FocusIntent) => {
      if (disabled || next === current || next < 1 || next > total) return;
      const active = rowRef.current?.ownerDocument.activeElement ?? null;
      pendingRef.current = { page: next, focus: active && rowRef.current?.contains(active) ? focus : null };
      if (!controlled) setInner(next);
      onPageChange?.(next, { reason });
    };

    // 쪽이 바뀌었다 — 알리고, 이 줄에서 넘겼으면 목록 맨 위로 · 초점을 누른 칸에(빈 칸이 됐으면 지금 쪽 번호에)
    const lastPageRef = React.useRef(current);
    React.useLayoutEffect(() => {
      if (lastPageRef.current === current) return;
      lastPageRef.current = current;
      setMessage(`${formatNumber(current)}페이지, 전체 ${formatNumber(total)}페이지`);
      const pending = pendingRef.current;
      pendingRef.current = null;
      if (!pending || pending.page !== current) return;
      scrollTarget?.current?.scrollIntoView({ block: "start" });
      const row = rowRef.current;
      if (!pending.focus || !row) return;
      const currentCell = row.querySelector<HTMLElement>(`[data-slot="pagination-item"][data-page="${current}"]`);
      const target =
        pending.focus.kind === "page" ? currentCell : (row.querySelector<HTMLElement>(`[data-slot="pagination-${pending.focus.kind}"]`) ?? currentCell);
      if (target && row.ownerDocument.activeElement !== target) target.focus({ preventScroll: true });
    }, [current, total, scrollTarget]);

    if (total <= 1) return null;

    const renderCell = (item: PaginationItem, index: number) => {
      if (item.type === "ellipsis") {
        return (
          <span key={index} aria-hidden data-slot="pagination-ellipsis" className="flex size-10 shrink-0 items-center justify-center text-fg-neutral [&>svg]:size-4">
            <Ellipsis />
          </span>
        );
      }
      if (item.type === "empty") {
        return <span key={index} aria-hidden data-slot="pagination-empty" className="size-10 shrink-0" />;
      }
      const isArrow = item.type === "previous" || item.type === "next";
      const isCurrent = item.type === "page" && item.page === current;
      const label = item.type === "previous" ? "이전 페이지" : item.type === "next" ? "다음 페이지" : `${formatNumber(item.page)}페이지`;
      const reason: PaginationChangeReason = item.type === "page" ? "page-item" : item.type;
      const focus: FocusIntent = item.type === "page" ? { kind: "page" } : { kind: item.type };
      const cellClass = cn(
        CELL,
        disabled ? cn(CELL_DISABLED, isCurrent && CELL_DISABLED_CURRENT) : cn(CELL_ENABLED, isCurrent ? CELL_CURRENT : CELL_OTHER),
      );
      const common = {
        "aria-label": label,
        "aria-current": isCurrent ? ("page" as const) : undefined,
        "aria-disabled": disabled || undefined,
        "data-slot": isArrow ? `pagination-${item.type}` : "pagination-item",
        "data-page": item.page,
        "data-current": isCurrent || undefined,
        className: cellClass,
      };
      const content = isArrow ? (
        item.type === "previous" ? <ChevronLeft aria-hidden className="size-4" /> : <ChevronRight aria-hidden className="size-4" />
      ) : (
        <span className={LABEL}>{formatNumber(item.page)}</span>
      );
      if (getHref) {
        return (
          <a
            key={index}
            href={getHref(item.page)}
            {...common}
            onClick={(e) => {
              if (disabled || isCurrent) {
                e.preventDefault();
                return;
              }
              if (isModifiedClick(e)) return;
              // onPageChange 가 있으면 라우터가 옮긴다 — 링크의 기본 이동은 막는다. 없으면 브라우저가 그 주소로 간다
              if (onPageChange || !controlled) {
                if (onPageChange) e.preventDefault();
                change(item.page, reason, focus);
              }
            }}
          >
            {content}
          </a>
        );
      }
      return (
        <button key={index} type="button" {...common} onClick={() => !isCurrent && change(item.page, reason, focus)}>
          {content}
        </button>
      );
    };

    return (
      <nav ref={ref} aria-label={ariaLabel} data-slot="pagination" data-slots={slots} className={cn("mt-x6 flex justify-center", className)} {...props}>
        <div ref={rowRef} data-slot="pagination-row" className="flex items-center">
          {items.map(renderCell)}
        </div>
        {/* 쪽이 바뀌면 한 번 알린다 — 처음부터 빈 채로 있어야 읽힌다 */}
        <span role="status" data-slot="pagination-status" className="sr-only">
          {message}
        </span>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

// ── 끝없이 불러오기 — 목록 끝 자리 ──────────────────────────
export type InfiniteListStatus = "loading" | "error" | "end";

export interface InfiniteListEndProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** loading — 다음 쪽이 있다(받는 중 · 곧 받는다, 원) · error — 못 불러옴(글 + 다시 시도) · end — 끝(글) */
  status: InfiniteListStatus;
  /** "다시 시도" — 그 쪽을 다시 받는다 */
  onRetry?: () => void;
  /** 끝 글 — 기본 "모두 봤어요."(목록마다 "카드를 모두 봤어요." 처럼) */
  endText?: React.ReactNode;
  /** 목록 끝이 화면(스크롤 상자) 아래에서 300 안으로 오면 부른다 — loading 일 때만, 한 번 와서 받는 동안은 다시 부르지 않는다 */
  onReachEnd?: () => void;
}

// 받는 시점 — 목록 끝이 화면 아래 끝에서 300 안(infinite-list.yaml sentinel)
const REACH_THRESHOLD = 300;

// 가장 가까운 세로 스크롤 상자 — 없으면 화면(null)
function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let node = el.parentElement; node && node !== node.ownerDocument.body && node !== node.ownerDocument.documentElement; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") return node;
  }
  return null;
}

/*
 * 폰의 긴 목록 끝 자리 — 목록(ul) 바로 다음에 둔다. 위아래 24, 가운데.
 *   loading  Progress Circle 24 · neutral — 1초가 지나야 보인다(그 전에는 보이지 않게 그려 높이만 지킨다 — skeleton.tsx 의 useWaitPhase)
 *   error    "더 불러오지 못했어요."(t4 · 400 · fg-neutral-muted) + 12 아래 Button neutralWeak small "다시 시도" — 이미 받은 줄은 그대로
 *   end      endText(기본 "모두 봤어요." — t4 · 400 · fg-neutral-subtle). 한 쪽으로 끝나는 짧은 목록에는 두지 않는다
 * 못 불러옴 · 끝 글은 상태 글(role="status")로 한 번 읽힌다. 받는 동안 목록에 aria-busy 를 거는 것은 목록(쓰는 쪽)의 몫이다.
 * onReachEnd — 이 자리가 가장 가까운 스크롤 상자(없으면 화면) 아래 끝에서 300 안으로 오면 부른다. 한 번 부르면 목록이 자라거나
 *   (바로 앞 목록 · 부모의 크기가 바뀜) 300 밖으로 나갔다 올 때까지 다시 부르지 않는다 — 받는 동안 거듭 부르지 않게. 못 불러온 뒤
 *   "다시 시도" 로 돌아온 loading 은 다시 시도가 받고 있으니 부르지 않는다. "더 보기" 버튼은 두지 않는다(폰은 끝없이).
 */
const InfiniteListEnd = React.forwardRef<HTMLDivElement, InfiniteListEndProps>(
  ({ status, onRetry, endText = "모두 봤어요.", onReachEnd, className, ...props }, ref) => {
    const own = React.useRef<HTMLDivElement | null>(null);
    const phase = useWaitPhase(status === "loading");
    const onReachEndRef = React.useRef(onReachEnd);
    React.useEffect(() => {
      onReachEndRef.current = onReachEnd;
    });
    const prevStatusRef = React.useRef<InfiniteListStatus | null>(null);

    React.useEffect(() => {
      const prev = prevStatusRef.current;
      prevStatusRef.current = status;
      const el = own.current;
      if (!el || status !== "loading" || typeof IntersectionObserver === "undefined") return;
      // 다시 시도로 돌아왔으면 그 요청이 받고 있다 — 목록이 자라거나 나갔다 올 때까지 기다린다
      let armed = prev !== "error";
      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (!entry?.isIntersecting) {
            armed = true;
            return;
          }
          if (!armed) return;
          armed = false;
          onReachEndRef.current?.();
        },
        { root: scrollParent(el), rootMargin: `0px 0px ${REACH_THRESHOLD}px 0px` },
      );
      io.observe(el);
      // 목록이 자랐다(새 쪽이 붙었다) — 다시 재서 아직 300 안이면 다음 쪽을 부른다. 목록(바로 앞 형제)과 부모의 크기를 본다 —
      // 부모가 높이를 정한 스크롤 상자면 부모의 크기는 그대로라 목록을 따로 본다
      const parent = el.parentElement;
      const list = el.previousElementSibling;
      const size = () => `${parent?.scrollHeight ?? 0}:${list instanceof HTMLElement ? list.offsetHeight : 0}`;
      let lastSize = size();
      const ro =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => {
              const now = size();
              if (now === lastSize) return;
              lastSize = now;
              armed = true;
              io.unobserve(el);
              io.observe(el);
            })
          : null;
      if (parent) ro?.observe(parent);
      if (list) ro?.observe(list);
      return () => {
        io.disconnect();
        ro?.disconnect();
      };
    }, [status]);

    return (
      <div
        ref={(node) => {
          own.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="infinite-list-end"
        data-status={status}
        className={cn("flex flex-col items-center justify-center py-x6 font-sans", className)}
        {...props}
      >
        {status === "loading" && (
          <ProgressCircle size="24" data-slot="infinite-list-end-progress" className={phase === "quiet" ? "invisible" : undefined} />
        )}
        <div role="status" data-slot="infinite-list-end-message" className="flex flex-col items-center text-center break-keep [overflow-wrap:break-word]">
          {status === "error" && <p className="m-0 text-t4 font-normal text-fg-neutral-muted">더 불러오지 못했어요.</p>}
          {status === "end" && <p className="m-0 text-t4 font-normal text-fg-neutral-subtle">{endText}</p>}
        </div>
        {status === "error" && (
          <Button variant="neutralWeak" size="small" data-slot="infinite-list-end-retry" className="mt-x3" onClick={() => onRetry?.()}>
            다시 시도
          </Button>
        )}
      </div>
    );
  },
);
InfiniteListEnd.displayName = "InfiniteListEnd";

export { Pagination, paginationItems, InfiniteListEnd };
