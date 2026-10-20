import * as React from "react";
import { EllipsisVertical, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkmark } from "@/components/ui/checkbox";
import { ResponsiveMenu, ResponsiveMenuTrigger } from "@/components/ui/menu";
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Groo Table — 구조는 SEED 문서 사이트의 표(TableRoot)와 디자인 그림의 데이터 표(2026-10-08). 수치 원본은 specs/components/table.yaml.
 * 옛 Table(작은 대문자 회색 머리 · 머리 바탕 · 칸 8 · 금액 고정폭 글꼴)과 DESIGN.md 의 Data Table(v71)을 대신한다.
 *
 *   Table               표 상자(가로 스크롤) + <table>. caption 필수(숨긴 표 이름 — 보이는 제목은 카드 머리) · rowHeight "text"(기본 45) ·
 *                       "rich"(72 — 썸네일 · 두 줄 칸이 하나라도 있으면 모든 줄) · stickyHeader(상자가 스스로 스크롤할 때 머리를 붙인다 —
 *                       높이는 className 의 max-h-*) · pagination(표 아래 12 의 Table Pagination — 표와 같은 상자라 함께 가로로 밀린다.
 *                       자리는 좌우 24 만 — 위 12 는 Table Pagination 이 갖는다, 2026-10-17 03-D 결정 5 B)
 *   TableHeader · TableBody · TableRow   <thead> · <tbody> · <tr>. 본문의 TableRow 에 onClick 을 주면 누르는 줄(호버 · 누름 바탕) —
 *                       줄 안의 체크 · ⋮ · 링크를 누른 것은 줄 누르기가 아니다. 키보드로는 첫 열 이름(TableRowHeader 의 href · onClick)으로 간다
 *   TableHead           머리 칸 <th scope="col">. align "start"(기본) · "end"(숫자 — 머리도 오른쪽). sort 를 주면 정렬할 수 있는 열 —
 *                       칸 전체가 버튼, ↑↓ 를 늘 그리고 정렬된 열에만 aria-sort. onSortChange(next) — 누를 때마다 내림 ↔ 오름 두 단계
 *                       ("none" 으로 돌아가지 않는다). 처음 방향은 defaultSortDirection(기본: align "end" 면 내림, 아니면 오름 — 날짜 열은
 *                       "descending" 을 준다)
 *   TableRowHeader      첫 열 <th scope="row"> — 그 줄의 이름. href 면 링크, onClick 이면 버튼
 *   TableCell           본문 칸 <td>. align "end" 는 오른쪽 + 고정폭 숫자(tabular-nums — 고정폭 글꼴은 쓰지 않는다)
 *   TableCellContent    썸네일 · 두 줄 칸 — media(Image Frame 48 · Avatar 42 · Logo Tile 40) · title · detail(13 · fg-neutral-subtle)
 *   TableSelectHead · TableSelectCell   선택 칸 — Checkbox large 24 · 누르는 영역 44. 머리는 checked(true · false · "indeterminate") ·
 *                       onCheckedChange · 이름 "모두 선택", 줄은 label → 이름 "{label} 선택". 줄 누르기와 따로다
 *   TableMoreHead · TableMoreCell       ⋮ 열 — 머리는 글 없이 숨긴 "동작", 칸은 Button ghost · iconOnly · medium(보이는 40 · 누르는 44) ·
 *                       이름 "{label} 더보기" + 자식에 ResponsiveMenuContent(1280 이상 Menu · 미만 Menu Sheet — menu.tsx)
 *   TableBulkBar        일괄 작업 바 — count(0 이면 그리지 않는다) · onClear(✕ "선택 해제" — 초점은 뒤따르는 표의 머리 체크로) ·
 *                       자식은 동작 버튼(Button ghost small). 고른 수 "{count}개 선택됨" 을 role="status" 로 알린다
 *   TableStatusRow      본문 자리 한 칸(colSpan 은 머리 줄의 칸 수 — 주면 그 값) — 자식은 ResultSection size="medium"(비었음 · 실패).
 *                       칸 좌우 24(첫 칸 앞 · 끝 칸 뒤와 같다)가 가장자리를 맡고, 표가 카드 안이라 Result Section 은 좌우 0 이다(23B)
 *   TableSkeletonRows   불러오는 동안의 줄 — rows(기본 10) · columns({ align, width }[]). 줄 높이 그대로 · 글 자리 t4 19
 *   useTableLayout()    "table"(768 이상) · "list"(미만) — 768 미만이면 쓰는 쪽이 같은 데이터를 List 줄로 그린다
 *
 * 머리 줄 41(위아래 10 + 글 20 + 선 1) · 본문 줄 45(12 + 20 + 1) — SEED 문서 표. 칸 좌우 16, 첫 칸 앞 · 끝 칸 뒤만 카드 여백과 같은 24
 *   (표는 카드 안에 가장자리까지 붙는다 — 줄 선은 상자 끝까지). 글은 t4 14 에 줄 높이 20. 머리는 같은 14 · 500 · fg-neutral, 바탕 없음.
 * 줄 선은 1px stroke-neutral-subtle — 머리 아래 · 줄마다 · 마지막 줄 아래까지. 세로 선 · 줄무늬 · 바깥 테두리는 없다.
 *   선은 칸의 아래 테두리다(border-separate) — 줄 높이가 칸 높이 그대로 41 · 45 · 72 가 되고, 붙은 머리도 선을 데리고 붙는다.
 * 정렬 버튼: 칸 전체(누르는 영역 칸 폭 × 41, 위아래로 44 까지 넓힌다), 글 ↔ ↑↓ 6. ↑↓ 는 16 상자에 ↑ 와 ↓ 를 나란히 그리고 따로 칠한다 —
 *   둘 다 fg-neutral-muted, 지금 방향 하나만 fg-neutral. 호버 · 누름은 bg-layer-default-pressed(축소 없음). 바꾸면 "{열} 오름차순으로
 *   정렬했어요." 를 표의 숨긴 상태 글(role="status")로 알린다.
 * 누르는 줄: 호버 · 누름 바탕 bg-layer-default-pressed(줄 전체, 선은 그대로) — 표의 줄은 이웃과 붙어 있어 줄지 않는다. 고른 줄에는
 *   바탕을 칠하지 않는다 — 체크가 고른 것을 말한다(사용자 결정 21A). 브랜드 옅은 바탕은 일괄 작업 바(bg-brand-weak · 48 · 모서리 12 ·
 *   왼쪽 16 · 오른쪽 8 · 표 위 8)에만 있다.
 * 키보드 포커스에만 안쪽 2px 링(stroke-focus-ring) — 링크 · 정렬 버튼 · ⋮. 표 상자 가장자리에서 잘리지 않게 안쪽이다.
 * 선택 칸 · ⋮ 칸은 줄 높이를 지키려고 위아래 여백을 줄인다 — 본문 체크 10 · 머리 체크 8 · ⋮ 2(45 · 41 안에 24 · 40 이 든다).
 */

export type TableRowHeight = "text" | "rich";
export type TableAlign = "start" | "end";
export type TableSort = "none" | "ascending" | "descending";
export type TableSortDirection = Exclude<TableSort, "none">;

type TableContextValue = {
  rowHeight: TableRowHeight;
  stickyHeader: boolean;
  /** 표의 숨긴 상태 글 — 정렬 결과 */
  announce: (text: string) => void;
};

const TableContext = React.createContext<TableContextValue>({ rowHeight: "text", stickyHeader: false, announce: () => {} });

// 칸이 머리 줄(thead)에 있는지 본문(tbody)에 있는지
const SectionContext = React.createContext<"head" | "body">("body");

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 숨긴 상태 글 — 같은 글을 다시 넣어도 읽히도록 끝에 보이지 않는 공백을 번갈아 붙인다
function useAnnouncer() {
  const [message, setMessage] = React.useState("");
  const flip = React.useRef(false);
  const announce = React.useCallback((text: string) => {
    flip.current = !flip.current;
    setMessage(text + (flip.current ? " " : ""));
  }, []);
  return [message, announce] as const;
}

// ── 칸 ───────────────────────────────────────────────────────
// 모든 칸 — 아래 선 1px · 좌우 16(첫 칸 앞 · 끝 칸 뒤 24) · 14 / 20 · 세로 가운데
const CELL = [
  "border-b border-solid border-stroke-neutral-subtle px-x4 align-middle font-sans text-t4 leading-[1.25rem] text-fg-neutral",
  "first:pl-x6 last:pr-x6",
].join(" ");
// 머리 칸 — 위아래 10 · 500 · 한 줄. 붙은 머리는 카드 면과 같은 바탕으로 지나가는 줄을 가린다
const HEAD_CELL = "py-x2_5 font-medium whitespace-nowrap";
const HEAD_STICKY = "sticky top-0 z-[1] bg-bg-layer-default";
// 본문 칸 — 위아래 12 · 400. 칸 안의 인라인 블록(배지 · 이름 링크)은 줄 위에 맞춘다 — 글자 기준선에 맞추면 줄이 45 를 넘는다.
// 썸네일 · 두 줄 칸이 있는 표는 72 — 칸 여백보다 높이가 먼저다(위아래 여백 없이 72 안 세로 가운데)
const BODY_CELL = "py-x3 font-normal [&>*]:align-top";
const BODY_RICH = "h-[72px] py-0";
const ALIGN: Record<TableAlign, string> = {
  start: "text-start",
  end: "text-end tabular-nums",
};

// 정렬 버튼 — 머리 칸의 여백을 버튼이 가진다(칸 어디를 눌러도 정렬). 누르는 영역은 위아래로 44 까지(::before)
const SORT_BUTTON = [
  "relative flex w-full cursor-pointer items-center gap-x1_5 border-0 bg-transparent px-x4 py-x2_5 font-[inherit] text-[length:inherit] leading-[inherit] text-fg-neutral",
  "[th:first-child>&]:pl-x6 [th:last-child>&]:pr-x6",
  "before:absolute before:inset-x-0 before:-inset-y-0.5 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 누르는 줄 — 줄 전체 바탕(선은 그대로), 축소 없음
const ROW = "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const ROW_PRESSABLE = "cursor-pointer hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";

// 줄 안의 이름 링크 · 버튼 — 안쪽 2px 링이 글자에 닿지 않게 둘레 여백을 두고 그만큼 바깥 여백으로 되돌린다
const ROW_HEADER_ACTION = [
  "-mx-x1 -my-x0_5 inline-block cursor-pointer rounded-r1 align-top border-0 bg-transparent px-x1 py-x0_5 text-start font-[inherit] text-[length:inherit] leading-[inherit] text-fg-neutral no-underline",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 체크 · ⋮ 의 누르는 영역 44 — 보이는 상자 둘레로(Checkmark 는 relative)
const HIT_44 = "before:absolute before:left-1/2 before:top-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']";

// ── 표 ───────────────────────────────────────────────────────
export interface TableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 표 이름 — 숨긴 <caption>. 보이는 제목(카드 머리)과 같은 글 */
  caption: React.ReactNode;
  /** "text"(기본 — 45) · "rich"(72 — 썸네일 · 두 줄 칸이 있는 표) */
  rowHeight?: TableRowHeight;
  /** 상자가 스스로 세로로 스크롤할 때 머리를 붙인다 — 높이는 className 의 max-h-*. 페이지 스크롤에는 쓰지 않는다 */
  stickyHeader?: boolean;
  /** 표 아래 12 의 넘김 줄(Table Pagination) — 표와 같은 가로 스크롤 상자 안. 12 는 넘김 줄의 위 여백이다(자리는 좌우 24 만) */
  pagination?: React.ReactNode;
  /** <table> 의 className — className 은 표 상자(div)에 간다 */
  tableClassName?: string;
  children?: React.ReactNode;
}

const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ caption, rowHeight = "text", stickyHeader = false, pagination, className, tableClassName, children, ...props }, ref) => {
    const [message, announce] = useAnnouncer();
    const value = React.useMemo(() => ({ rowHeight, stickyHeader, announce }), [rowHeight, stickyHeader, announce]);
    return (
      <TableContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="table"
          data-row-height={rowHeight}
          className={cn("relative w-full overflow-x-auto", stickyHeader && "overflow-y-auto", className)}
          {...props}
        >
          {/* 표와 넘김 줄이 같은 폭 — 상자보다 좁으면 상자 폭, 열이 넘치면 표의 최소 폭(그만큼 함께 가로로 밀린다) */}
          <div data-slot="table-frame" className="w-fit min-w-full">
            <table className={cn("w-full border-separate border-spacing-0 font-sans text-t4 text-fg-neutral", tableClassName)}>
              <caption className="sr-only">{caption}</caption>
              {children}
            </table>
            {pagination != null && (
              <div data-slot="table-pagination-slot" className="px-x6">
                {pagination}
              </div>
            )}
          </div>
          <span role="status" data-slot="table-status" className="sr-only">
            {message}
          </span>
        </div>
      </TableContext.Provider>
    );
  },
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => (
  <SectionContext.Provider value="head">
    <thead ref={ref} data-slot="table-header" {...props} />
  </SectionContext.Provider>
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>((props, ref) => (
  <SectionContext.Provider value="body">
    <tbody ref={ref} data-slot="table-body" {...props} />
  </SectionContext.Provider>
));
TableBody.displayName = "TableBody";

// 줄 누르기로 볼지 — 줄 안의 누르는 것(체크 · ⋮ · 링크 · 버튼)이나 줄 밖(포털로 뜬 메뉴 · 시트)에서 온 누름, 글을 고르던 끌기는 아니다
const INTERACTIVE =
  'a[href], button, input, select, textarea, label, summary, [role="button"], [role="checkbox"], [role="link"], [role="menuitem"], [tabindex]:not([tabindex="-1"])';
function isRowPress(e: React.MouseEvent<HTMLTableRowElement>) {
  const row = e.currentTarget;
  const target = e.target instanceof Element ? e.target : null;
  if (!target || !row.contains(target)) return false;
  const inner = target.closest(INTERACTIVE);
  if (inner && inner !== row && row.contains(inner)) return false;
  const selected = row.ownerDocument.getSelection?.();
  if (selected && !selected.isCollapsed && row.contains(selected.anchorNode)) return false;
  return true;
}

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, onClick, ...props }, ref) => {
  const section = React.useContext(SectionContext);
  const pressable = section === "body" && onClick != null;
  return (
    <tr
      ref={ref}
      data-slot="table-row"
      data-pressable={pressable || undefined}
      className={cn(ROW, pressable && ROW_PRESSABLE, className)}
      onClick={
        pressable
          ? (e) => {
              if (isRowPress(e)) onClick?.(e);
            }
          : onClick
      }
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

// ↑↓ — 16 상자에 ↑(왼쪽) · ↓(오른쪽)를 나란히(lucide arrow-up-down 의 모양). 둘을 따로 칠한다
function SortIcon({ sort }: { sort: TableSort }) {
  return (
    <svg
      aria-hidden
      data-slot="table-sort-icon"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0"
    >
      <g data-arrow="up" className={sort === "ascending" ? "stroke-fg-neutral" : "stroke-fg-neutral-muted"}>
        <path d="m3 8 4-4 4 4" />
        <path d="M7 4v16" />
      </g>
      <g data-arrow="down" className={sort === "descending" ? "stroke-fg-neutral" : "stroke-fg-neutral-muted"}>
        <path d="m21 16-4 4-4-4" />
        <path d="M17 20V4" />
      </g>
    </svg>
  );
}

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** "start"(기본) · "end"(금액 · 개수 · 비율 — 머리도 오른쪽) */
  align?: TableAlign;
  /** 주면 정렬할 수 있는 열 — "none"(지금은 아님) · "ascending" · "descending" */
  sort?: TableSort;
  /** 누를 때마다 내림 ↔ 오름(두 단계) — 다음 방향을 받는다 */
  onSortChange?: (next: TableSortDirection) => void;
  /** 그 열을 처음 누를 때의 방향 — 기본은 align "end" 면 "descending", 아니면 "ascending"(날짜 열은 "descending") */
  defaultSortDirection?: TableSortDirection;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ align = "start", sort, onSortChange, defaultSortDirection, className, children, ...props }, ref) => {
    const ctx = React.useContext(TableContext);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const sortable = sort !== undefined;
    const next: TableSortDirection =
      sort === "ascending" ? "descending" : sort === "descending" ? "ascending" : (defaultSortDirection ?? (align === "end" ? "descending" : "ascending"));
    return (
      <th
        ref={ref}
        scope="col"
        data-slot="table-head"
        data-align={align}
        aria-sort={sort === "ascending" || sort === "descending" ? sort : undefined}
        className={cn(CELL, HEAD_CELL, ALIGN[align], ctx.stickyHeader && HEAD_STICKY, sortable && "p-0 first:pl-0 last:pr-0", className)}
        {...props}
      >
        {sortable ? (
          <button
            ref={buttonRef}
            type="button"
            data-slot="table-sort-button"
            className={cn(SORT_BUTTON, align === "end" ? "justify-end text-end" : "justify-start text-start")}
            onClick={() => {
              onSortChange?.(next);
              const name = buttonRef.current?.textContent?.trim();
              if (name) ctx.announce(`${name} ${next === "ascending" ? "오름차순" : "내림차순"}으로 정렬했어요.`);
            }}
          >
            <span>{children}</span>
            <SortIcon sort={sort} />
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

// 본문 칸의 공통 — 맞춤 · 줄 종류
function useBodyCell(align: TableAlign) {
  const ctx = React.useContext(TableContext);
  return cn(CELL, BODY_CELL, ALIGN[align], ctx.rowHeight === "rich" && BODY_RICH);
}

export interface TableRowHeaderProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align" | "onClick"> {
  align?: TableAlign;
  /** 이름을 링크로 — 줄을 누를 때와 같은 곳 */
  href?: string;
  /** 이름을 버튼으로 — 줄을 누를 때와 같은 동작 */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const TableRowHeader = React.forwardRef<HTMLTableCellElement, TableRowHeaderProps>(
  ({ align = "start", href, onClick, className, children, ...props }, ref) => {
    const cell = useBodyCell(align);
    return (
      <th ref={ref} scope="row" data-slot="table-row-header" className={cn(cell, className)} {...props}>
        {href != null ? (
          <a href={href} data-slot="table-row-link" className={ROW_HEADER_ACTION}>
            {children}
          </a>
        ) : onClick != null ? (
          <button type="button" data-slot="table-row-link" className={ROW_HEADER_ACTION} onClick={onClick}>
            {children}
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableRowHeader.displayName = "TableRowHeader";

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  /** "start"(기본) · "end"(숫자 — 오른쪽 + 고정폭 숫자) */
  align?: TableAlign;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ align = "start", className, ...props }, ref) => {
  const cell = useBodyCell(align);
  return <td ref={ref} data-slot="table-cell" className={cn(cell, className)} {...props} />;
});
TableCell.displayName = "TableCell";

export interface TableCellContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 앞 그림 — Image Frame 1:1 48 · 사람은 Avatar 42 · 기관은 Logo Tile 40. 그림 ↔ 글 12 */
  media?: React.ReactNode;
  /** 윗줄 — 칸의 글(14 / 20) */
  title: React.ReactNode;
  /** 둘째 줄 — ID · 부서 · 단위(13 · fg-neutral-subtle), 윗줄과 2 */
  detail?: React.ReactNode;
}

const TableCellContent = React.forwardRef<HTMLDivElement, TableCellContentProps>(({ media, title, detail, className, ...props }, ref) => (
  <div ref={ref} data-slot="table-cell-content" className={cn("flex items-center gap-x3", className)} {...props}>
    {media != null && (
      <span data-slot="table-cell-media" className="flex shrink-0">
        {media}
      </span>
    )}
    <span className="flex min-w-0 flex-col gap-x0_5">
      <span data-slot="table-cell-title">{title}</span>
      {detail != null && (
        <span data-slot="table-cell-detail" className="text-t3 text-fg-neutral-subtle">
          {detail}
        </span>
      )}
    </span>
  </div>
));
TableCellContent.displayName = "TableCellContent";

// ── 선택 ─────────────────────────────────────────────────────
export interface TableSelectHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "onChange"> {
  /** 지금 쪽의 줄 — 모두 true · 일부 "indeterminate" · 없음 false */
  checked: boolean | "indeterminate";
  /** 누르면 — 일부 고른 상태면 모두 고른다(쓰는 쪽이 지금 쪽의 줄 전부를 고르거나 푼다) */
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

// 선택 열 — 24 + 여백(첫 칸이라 앞 24 · 뒤 16) = 64. 머리는 위아래 8(41 안에 24)
const TableSelectHead = React.forwardRef<HTMLTableCellElement, TableSelectHeadProps>(
  ({ checked, onCheckedChange, disabled, className, ...props }, ref) => {
    const ctx = React.useContext(TableContext);
    return (
      <th
        ref={ref}
        scope="col"
        data-slot="table-select-head"
        className={cn(CELL, HEAD_CELL, "w-16 py-x2", ctx.stickyHeader && HEAD_STICKY, className)}
        {...props}
      >
        <div className="flex items-center">
          <Checkmark
            size="large"
            aria-label="모두 선택"
            checked={checked}
            disabled={disabled}
            onCheckedChange={() => onCheckedChange(checked !== true)}
            className={HIT_44}
          />
        </div>
      </th>
    );
  },
);
TableSelectHead.displayName = "TableSelectHead";

export interface TableSelectCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "onChange"> {
  /** 그 줄의 이름 — 체크의 이름 "{label} 선택" */
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

// 줄의 체크 — 위아래 10(45 안에 24, 누르는 영역 44 가 줄 안에 든다)
const TableSelectCell = React.forwardRef<HTMLTableCellElement, TableSelectCellProps>(
  ({ label, checked, onCheckedChange, disabled, className, ...props }, ref) => {
    const ctx = React.useContext(TableContext);
    return (
      <td
        ref={ref}
        data-slot="table-select-cell"
        className={cn(CELL, BODY_CELL, "w-16 py-x2_5", ctx.rowHeight === "rich" && BODY_RICH, className)}
        {...props}
      >
        <div className="flex items-center">
          <Checkmark
            size="large"
            aria-label={`${label} 선택`}
            checked={checked}
            disabled={disabled}
            onCheckedChange={(v) => onCheckedChange(v === true)}
            className={HIT_44}
          />
        </div>
      </td>
    );
  },
);
TableSelectCell.displayName = "TableSelectCell";

// ── ⋮ ───────────────────────────────────────────────────────
// ⋮ 열 — 80(앞 16 + 40 + 끝 24). 머리는 글 없이 보조 기술에만 "동작"
const TableMoreHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => {
  const ctx = React.useContext(TableContext);
  return (
    <th ref={ref} scope="col" data-slot="table-more-head" className={cn(CELL, HEAD_CELL, "w-20", ctx.stickyHeader && HEAD_STICKY, className)} {...props}>
      <span className="sr-only">동작</span>
    </th>
  );
});
TableMoreHead.displayName = "TableMoreHead";

export interface TableMoreCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** 그 줄의 이름 — ⋮ 의 이름 "{label} 더보기" */
  label: string;
  /** 메뉴를 연 채로 그릴 때(제어) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** ResponsiveMenuContent — 1280 이상 Menu · 미만 Menu Sheet */
  children: React.ReactNode;
}

// ⋮ — 위아래 2(45 안에 40). 링은 안쪽(줄 끝 · 표 상자 가장자리에서 잘리지 않게)
const TableMoreCell = React.forwardRef<HTMLTableCellElement, TableMoreCellProps>(
  ({ label, open, onOpenChange, className, children, ...props }, ref) => {
    const ctx = React.useContext(TableContext);
    return (
      <td ref={ref} data-slot="table-more-cell" className={cn(CELL, BODY_CELL, "w-20 py-x0_5", ctx.rowHeight === "rich" && BODY_RICH, className)} {...props}>
        <div className="flex items-center">
          <ResponsiveMenu open={open} onOpenChange={onOpenChange}>
            <ResponsiveMenuTrigger asChild>
              <Button
                variant="ghost"
                layout="iconOnly"
                size="medium"
                aria-label={`${label} 더보기`}
                data-slot="table-more-button"
                className="focus-visible:-outline-offset-2"
              >
                <EllipsisVertical />
              </Button>
            </ResponsiveMenuTrigger>
            {children}
          </ResponsiveMenu>
        </div>
      </td>
    );
  },
);
TableMoreCell.displayName = "TableMoreCell";

// ── 일괄 작업 바 ──────────────────────────────────────────────
export interface TableBulkBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 고른 줄 수 — 0 이면 바를 그리지 않는다 */
  count: number;
  /** ✕ "선택 해제" — 고른 것을 모두 푼다. 초점은 뒤따르는 표의 머리 체크로 */
  onClear?: () => void;
}

// 바 뒤의 첫 표 — 그 표의 머리 체크("모두 선택")
function selectAllAfter(bar: HTMLElement | null): HTMLElement | null {
  for (let el = bar?.nextElementSibling ?? null; el; el = el.nextElementSibling) {
    const table = el.matches('[data-slot="table"]') ? el : el.querySelector('[data-slot="table"]');
    if (table) return table.querySelector<HTMLElement>('[data-slot="table-select-head"] [role="checkbox"]');
  }
  return null;
}

const TableBulkBar = React.forwardRef<HTMLDivElement, TableBulkBarProps>(({ count, onClear, className, children, ...props }, ref) => {
  const own = React.useRef<HTMLDivElement>(null);
  const message = count > 0 ? `${count}개 선택됨` : "";
  const clear = () => {
    // 바가 사라지기 전에 초점을 머리 체크로 옮긴다 — ✕ 가 사라지며 초점을 잃지 않게
    selectAllAfter(own.current)?.focus({ preventScroll: true });
    onClear?.();
  };
  return (
    <>
      {/* 고른 수 — 바가 없을 때도 자리를 두어야 처음 고를 때 읽힌다 */}
      <span role="status" data-slot="table-bulk-status" className="sr-only">
        {message}
      </span>
      {count > 0 && (
        <div
          ref={mergeRefs(ref, own)}
          role="region"
          aria-label="선택한 항목"
          data-slot="table-bulk-bar"
          className={cn("mb-x2 flex min-h-12 items-center gap-x2 rounded-r3 bg-bg-brand-weak pl-x4 pr-x2 font-sans", className)}
          {...props}
        >
          {/* 보이는 고른 수 — 읽는 글은 위 상태 글이 맡는다 */}
          <span aria-hidden data-slot="table-bulk-count" className="text-t4 font-medium text-fg-neutral">
            {message}
          </span>
          <div className="ml-auto flex items-center gap-x2">
            {children}
            <Button variant="ghost" size="small" layout="iconOnly" aria-label="선택 해제" data-slot="table-bulk-clear" onClick={clear}>
              <X />
            </Button>
          </div>
        </div>
      )}
    </>
  );
});
TableBulkBar.displayName = "TableBulkBar";

// ── 비었음 · 실패 · 불러오는 동안 ────────────────────────────
export interface TableStatusRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** 한 칸이 덮을 열 수 — 주지 않으면 머리 줄의 칸 수 */
  colSpan?: number;
}

const TableStatusRow = React.forwardRef<HTMLTableRowElement, TableStatusRowProps>(({ colSpan, className, children, ...props }, ref) => {
  const rowRef = React.useRef<HTMLTableRowElement>(null);
  const [span, setSpan] = React.useState(colSpan ?? 1);
  React.useLayoutEffect(() => {
    if (colSpan != null) {
      setSpan(colSpan);
      return;
    }
    const head = rowRef.current?.closest("table")?.tHead?.rows[0];
    const count = head ? Array.from(head.cells).reduce((sum, cell) => sum + cell.colSpan, 0) : 1;
    setSpan(Math.max(1, count));
  }, [colSpan]);
  return (
    <tr ref={mergeRefs(ref, rowRef)} data-slot="table-status-row" className={className} {...props}>
      {/* 칸은 좌우 24 만 — 위아래는 Result Section 의 16(사이트 그림 · SEED 처럼 제 여백만), 좌우는 카드 안이라 Result Section 이 0 */}
      <td colSpan={span} className="border-b border-solid border-stroke-neutral-subtle px-x6 py-0">
        {children}
      </td>
    </tr>
  );
});
TableStatusRow.displayName = "TableStatusRow";

export interface TableSkeletonColumn {
  align?: TableAlign;
  /** 글 자리의 폭 — "40%" · "120px"(기본 60%) */
  width?: string;
}

export interface TableSkeletonRowsProps {
  /** 줄 수 — 기본 10(줄 수 보기) */
  rows?: number;
  /** 열마다 맞춤 · 폭 */
  columns: TableSkeletonColumn[];
}

// 줄 높이 그대로(45 · 72) — 글 자리는 t4 19. 보조 기술에는 숨긴다(기다리는 상태는 영역의 aria-busy 가 알린다)
function TableSkeletonRows({ rows = 10, columns }: TableSkeletonRowsProps) {
  const ctx = React.useContext(TableContext);
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} aria-hidden="true" data-slot="table-skeleton-row">
          {columns.map((column, c) => (
            <td key={c} className={cn(CELL, BODY_CELL, ctx.rowHeight === "rich" ? BODY_RICH : "h-[45px]")}>
              <Skeleton text="t4" className={cn(column.align === "end" && "ml-auto")} style={{ width: column.width ?? "60%" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
TableSkeletonRows.displayName = "TableSkeletonRows";

// ── 폭 ───────────────────────────────────────────────────────
// 768 — Tailwind md(--breakpoint-md) 와 같은 식
const TABLE_QUERY = "(min-width: 768px)";

function subscribeLayout(onChange: () => void) {
  const mql = window.matchMedia(TABLE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** "table"(768 이상) · "list"(미만 — 쓰는 쪽이 같은 데이터를 List 줄로). 서버에서는 "list" */
function useTableLayout(): "table" | "list" {
  return React.useSyncExternalStore(
    subscribeLayout,
    () => (window.matchMedia(TABLE_QUERY).matches ? "table" : "list"),
    () => "list",
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableRowHeader,
  TableCell,
  TableCellContent,
  TableSelectHead,
  TableSelectCell,
  TableMoreHead,
  TableMoreCell,
  TableBulkBar,
  TableStatusRow,
  TableSkeletonRows,
  useTableLayout,
};
