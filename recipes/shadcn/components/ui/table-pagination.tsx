import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Select, SelectItem } from "@/components/ui/select";

/*
 * Groo Table Pagination — 구조는 SEED Table Pagination(2026-10-04). 수치 원본은 specs/components/table-pagination.yaml.
 * 고르기 둘은 Select medium(select.tsx), 이전 · 다음은 Pagination 의 화살표 칸이다. 줄 · 범위 계산은 SEED useTablePagination 과 같다.
 *
 *   TablePagination   데이터 표 아래의 쪽 넘김 한 줄 — role="group" · aria-label="표 페이지 탐색"
 *     totalItems      전체 수를 알 때 — 범위 고르기 + "/ 총 N개"
 *     hasPreviousPage · hasNextPage · currentPageItemCount   전체 수를 모를 때 — 범위는 글로만("11-20")
 *     value · defaultValue({ page, pageSize }, 기본 { 1, 10 }) · onValueChange(value, { reason })
 *                     reason "previous" · "next" · "page-range" · "page-size" · "constraint"(줄이 줄어 지금 범위가 없어져 옮겼을 때)
 *     pageSizeOptions 줄 수 — 기본 [10, 25, 50](3 ~ 4개를 넘지 않는다)
 *     scrollTarget    표 상자 — 넘기면 그 위 끝이 보이게 스크롤한다
 *     disabled        막힌 줄 — 고르기 · 화살표 모두
 *
 * 줄 수를 바꾸면 첫 범위로 돌아간다. 줄이 줄어 지금 범위가 없어지면 마지막 범위로 옮긴다("Page 3 of 2" 가 되지 않게 — reason "constraint").
 * 범위 목록은 200개까지 모두, 넘으면 첫 · 마지막 · 지금 둘레(가운데 198)만 둔다. 하나뿐이면(빈 표 "0-0" · 한 범위) 범위 고르기를 막는다.
 * 이전 · 다음은 끝에서 숨기지 않고 막는다 — aria-disabled 라 초점이 그 자리에 남는다(SEED 는 disabled 라 초점이 떨어진다).
 * 넘기면(이전 · 다음 · 범위 · 줄 수) 표(scrollTarget)의 위 끝이 보이게 스크롤하고 숨은 상태 글(role="status")로
 *   "11-20, 총 237개"(전체를 모르면 "11-20")를 한 번 알린다. 초점은 누른 칸(고르기 · 화살표)에 그대로 둔다.
 *
 * 모양: 한 줄 40 · 줄바꿈 없음 · 양 끝 정렬, 왼쪽 묶음 ↔ 오른쪽 묶음 · 범위 묶음 ↔ 화살표 16, 고르기 ↔ 글 8, 표 아래 12(mt-component-default —
 *   이 줄이 갖는다. Table 의 pagination 자리는 좌우 24 만이라 자리에 넣어도 표 바로 뒤에 두어도 12, 2026-10-17 03-D 결정 5 B)
 *   (spacing-component-default). 좁은 화면에서는 표와 같은 가로 스크롤 상자 안에 둔다 — 줄은 내용 폭보다 줄지 않는다.
 *   고르기는 Select medium(트리거 40 · 최소 폭 96) — 화면 폭과 상관없이 medium 이다(Select 의 "1280 미만 large 52" 규칙의 예외 —
 *   사용자 결정 2026-10-08). 범위 목록은 최대 높이 240(Select 기본 480 대신 — SEED). 글은 t4 14 / 19 · 400 · fg-neutral, 수는 세 자리마다 쉼표.
 *   화살표는 Pagination 의 칸 그대로 — 40 × 40 · 아이콘 16 · 모서리 8, 누르는 영역은 위아래만 44(같은 예외), 호버 · 누름
 *   bg-layer-default-pressed + 2px 거리 축소(40 → 0.95), 키보드 포커스에만 바깥 2px 링, 막히면 fg-disabled.
 * 이름: 고르기 "페이지당 표시 개수" · "표시 범위", 화살표 "이전 페이지" · "다음 페이지"(SEED 문구). 영어를 쓰지 않는다.
 */

export interface TablePaginationValue {
  /** 1부터 시작하는 지금 범위 */
  page: number;
  /** 한 번에 보는 줄 수 */
  pageSize: number;
}

export type TablePaginationChangeReason = "previous" | "next" | "page-range" | "page-size" | "constraint";

export interface TablePaginationChangeDetails {
  reason: TablePaginationChangeReason;
}

type TablePaginationBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> & {
  value?: TablePaginationValue;
  defaultValue?: TablePaginationValue;
  onValueChange?: (value: TablePaginationValue, details: TablePaginationChangeDetails) => void;
  /** 줄 수 — 기본 [10, 25, 50] */
  pageSizeOptions?: readonly number[];
  /** 표 상자 — 넘기면 그 위 끝이 보이게 스크롤한다 */
  scrollTarget?: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
};

export type TablePaginationProps = TablePaginationBaseProps &
  (
    | {
        /** 전체 수(0 이상) — 알면 범위 고르기 + "/ 총 N개" */
        totalItems: number;
        hasPreviousPage?: never;
        hasNextPage?: never;
        currentPageItemCount?: never;
      }
    | {
        totalItems?: undefined;
        /** 전체 수를 모를 때 — 서버가 알려 주는 앞 · 뒤 범위가 있는지 */
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        /** 지금 범위에 실제로 든 줄 수 — 없으면 줄 수(pageSize), 줄 수보다 크면 줄 수 */
        currentPageItemCount?: number;
      }
  );

const DEFAULT_VALUE: TablePaginationValue = { page: 1, pageSize: 10 };
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const MAX_RANGE_OPTIONS = 200;

const formatNumber = (n: number) => n.toLocaleString("ko-KR");
const formatRange = (start: number, end: number) => `${formatNumber(start)}-${formatNumber(end)}`;

function clampPage(page: number, totalPages: number | undefined) {
  if (totalPages === 0) return 1;
  return totalPages === undefined ? Math.max(page, 1) : Math.min(Math.max(page, 1), totalPages);
}

function rangeOf(page: number, pageSize: number, itemCount: number) {
  if (itemCount <= 0) return { start: 0, end: 0 };
  const start = (page - 1) * pageSize + 1;
  return { start, end: start + itemCount - 1 };
}

const knownRange = (page: number, pageSize: number, totalItems: number) =>
  totalItems === 0 ? { start: 0, end: 0 } : rangeOf(page, pageSize, Math.min(pageSize, totalItems - (page - 1) * pageSize));

// 범위 목록의 쪽 — 200개까지 모두, 넘으면 첫 · 마지막 + 지금을 가운데에 둔 198(SEED createAutoPageOptions)
function rangePages(page: number, totalPages: number) {
  if (totalPages <= MAX_RANGE_OPTIONS) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const windowSize = MAX_RANGE_OPTIONS - 2;
  const start = Math.min(Math.max(page - Math.floor((windowSize - 1) / 2), 2), totalPages - windowSize);
  return [1, ...Array.from({ length: windowSize }, (_, i) => start + i), totalPages];
}

// ── 모양 ─────────────────────────────────────────────────────
// 화살표 — Pagination 의 칸(40 · 모서리 8 · 누르는 영역은 위아래만 44)
const ARROW = [
  "relative flex size-10 shrink-0 items-center justify-center rounded-r2 border-0 bg-transparent p-0 [&>svg]:size-4",
  "before:absolute before:inset-x-0 before:inset-y-[-2px] before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
const ARROW_ENABLED =
  "cursor-pointer text-fg-neutral hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/40)] motion-reduce:active:[scale:1]";
const ARROW_DISABLED = "cursor-not-allowed text-fg-disabled";
// 글 — t4 · 400 · fg-neutral, 숫자 폭 고정
const TEXT = "whitespace-nowrap text-t4 font-normal text-fg-neutral tabular-nums";
// 고르기 자리 — 최소 폭 96, 글만큼 넓어진다
const SELECT_BOX = "w-max min-w-[96px] shrink-0";

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>((props, ref) => {
  const {
    totalItems,
    hasPreviousPage: hasPreviousProp,
    hasNextPage: hasNextProp,
    currentPageItemCount,
    value: valueProp,
    defaultValue = DEFAULT_VALUE,
    onValueChange,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    scrollTarget,
    disabled = false,
    className,
    ...rest
  } = props;

  const [inner, setInner] = React.useState<TablePaginationValue>(defaultValue);
  const controlled = valueProp !== undefined;
  const raw = controlled ? valueProp : inner;
  const pageSize = Math.max(Math.floor(raw.pageSize) || 1, 1);
  const known = totalItems !== undefined;
  const total = known ? Math.max(Math.floor(totalItems), 0) : undefined;
  const totalPages = total === undefined ? undefined : Math.ceil(total / pageSize);
  const page = clampPage(Math.floor(raw.page) || 1, totalPages);

  const pendingRef = React.useRef(false);
  const [message, setMessage] = React.useState("");

  const commit = (next: TablePaginationValue, reason: TablePaginationChangeReason) => {
    if (reason !== "constraint") pendingRef.current = true;
    if (!controlled) setInner(next);
    onValueChange?.(next, { reason });
  };

  // 줄이 줄어 지금 범위가 없어졌다 — 마지막 범위로 옮긴다(한 번만 알린다)
  const constraintRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const rawPage = Math.floor(raw.page) || 1;
    if (rawPage === page) {
      constraintRef.current = null;
      return;
    }
    const key = `${rawPage}:${pageSize}:${page}`;
    if (constraintRef.current === key) return;
    constraintRef.current = key;
    commit({ page, pageSize }, "constraint");
  });

  // 범위 · 앞뒤
  let range: { start: number; end: number };
  let hasPrevious: boolean;
  let hasNext: boolean;
  if (total !== undefined && totalPages !== undefined) {
    range = knownRange(page, pageSize, total);
    hasPrevious = total > 0 && page > 1;
    hasNext = total > 0 && page < totalPages;
  } else {
    range = rangeOf(page, pageSize, Math.min(currentPageItemCount ?? pageSize, pageSize));
    hasPrevious = page > 1 && !!hasPreviousProp;
    hasNext = !!hasNextProp;
  }

  const sizeOptions = React.useMemo(() => [...new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b), [pageSizeOptions, pageSize]);
  const rangeOptions = React.useMemo(() => {
    if (total === undefined || totalPages === undefined) return [];
    const pages = new Set(rangePages(page, totalPages).filter((p) => p <= totalPages));
    pages.add(page);
    return [...pages].sort((a, b) => a - b).map((p) => ({ page: p, ...knownRange(p, pageSize, total) }));
  }, [page, pageSize, total, totalPages]);
  const rangeSelectDisabled = disabled || rangeOptions.length <= 1;

  // 넘겼다 — 표 맨 위로, 범위를 한 번 알린다(줄이 줄어 옮긴 것은 알리기만)
  const statusText = total !== undefined ? `${formatRange(range.start, range.end)}, 총 ${formatNumber(total)}개` : formatRange(range.start, range.end);
  const lastRef = React.useRef(`${page}:${pageSize}`);
  React.useLayoutEffect(() => {
    const key = `${page}:${pageSize}`;
    if (lastRef.current === key) return;
    lastRef.current = key;
    setMessage(statusText);
    if (pendingRef.current) scrollTarget?.current?.scrollIntoView({ block: "start" });
    pendingRef.current = false;
  });

  const goTo = (next: number, reason: "previous" | "next" | "page-range") => {
    if (disabled) return;
    const target = clampPage(next, totalPages);
    if (target === page) return;
    commit({ page: target, pageSize }, reason);
  };

  const arrow = (which: "previous" | "next") => {
    const blocked = disabled || (which === "previous" ? !hasPrevious : !hasNext);
    return (
      <button
        type="button"
        aria-label={which === "previous" ? "이전 페이지" : "다음 페이지"}
        aria-disabled={blocked || undefined}
        data-slot={`table-pagination-${which}`}
        className={cn(ARROW, blocked ? ARROW_DISABLED : ARROW_ENABLED)}
        onClick={() => {
          if (blocked) return;
          goTo(which === "previous" ? page - 1 : page + 1, which);
        }}
      >
        {which === "previous" ? <ChevronLeft aria-hidden /> : <ChevronRight aria-hidden />}
      </button>
    );
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label="표 페이지 탐색"
      aria-disabled={disabled || undefined}
      data-slot="table-pagination"
      className={cn("mt-component-default flex h-10 w-full min-w-max flex-nowrap items-center justify-between gap-x4 font-sans", className)}
      {...rest}
    >
      <div data-slot="table-pagination-page-size" className="flex shrink-0 items-center gap-x2">
        <div className={SELECT_BOX}>
          <Select
            size="medium"
            aria-label="페이지당 표시 개수"
            value={String(pageSize)}
            disabled={disabled}
            onValueChange={(v) => {
              const next = Number(v);
              if (!Number.isSafeInteger(next) || next < 1 || next === pageSize) return;
              commit({ page: 1, pageSize: next }, "page-size");
            }}
          >
            {sizeOptions.map((n) => (
              <SelectItem key={n} value={String(n)} label={`${formatNumber(n)}개`} />
            ))}
          </Select>
        </div>
        <span className={TEXT}>씩 보기</span>
      </div>
      <div className="flex shrink-0 items-center gap-x4">
        {total !== undefined ? (
          <div data-slot="table-pagination-range" className="flex shrink-0 items-center gap-x2">
            <div className={SELECT_BOX}>
              <Select
                size="medium"
                aria-label="표시 범위"
                value={String(page)}
                disabled={rangeSelectDisabled}
                listMaxHeight={240}
                onValueChange={(v) => {
                  const next = Number(v);
                  if (Number.isSafeInteger(next)) goTo(next, "page-range");
                }}
              >
                {rangeOptions.map((o) => (
                  <SelectItem key={o.page} value={String(o.page)} label={formatRange(o.start, o.end)} />
                ))}
              </Select>
            </div>
            <span data-slot="table-pagination-total" className={TEXT}>
              / 총 {formatNumber(total)}개
            </span>
          </div>
        ) : (
          <span data-slot="table-pagination-range" className={TEXT}>
            {formatRange(range.start, range.end)}
          </span>
        )}
        <div className="flex shrink-0 items-center">
          {arrow("previous")}
          {arrow("next")}
        </div>
      </div>
      {/* 넘기면 한 번 알린다 — 처음부터 빈 채로 있어야 읽힌다 */}
      <span role="status" data-slot="table-pagination-status" className="sr-only">
        {message}
      </span>
    </div>
  );
});
TablePagination.displayName = "TablePagination";

export { TablePagination };
