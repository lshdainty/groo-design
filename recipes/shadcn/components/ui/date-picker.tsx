import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChipRadio, ChipRadioGroup } from "@/components/ui/chip";
import { WheelPicker, WheelPickerColumn } from "@/components/ui/wheel-picker";

/*
 * Groo Date Picker — 구조는 SEED Date Picker(2026-10-03). 수치 원본은 specs/components/date-picker.yaml. 옛 Calendar(react-day-picker)를 대신한다.
 *
 *   DatePicker          달력 — selection(single · range · multiple) × visibleRange(month · twoMonths · continuous).
 *                       value · onValueChange 는 쓰는 쪽이 가진다(제어 — 시트 · 팝오버의 draft). min · max · isDateDisabled ·
 *                       readOnlyStart(range) · maxSelectionCount(multiple) · presets · presetsLayout(range) · yearRange · today ·
 *                       autoFocus · labels · aria-label(기본 "날짜 선택") · aria-labelledby
 *   getPresetRange      빠른 기간의 범위 — 달력 단위, 주는 일요일부터(date-picker.md "빠른 기간")
 *   formatDateValue     칸에 넣는 하루 — 올해 "10월 15일 (목)", 다른 해 "2027년 1월 3일 (일)"
 *   formatRangeValue    칸에 넣는 기간 — "10월 1일~10월 31일"(물결표를 앞뒤에 붙여 쓴다 — International Design), 올해가 아닌 날이
 *                       끼면 양쪽에 연도("2026년 12월 28일~2027년 1월 3일"). 끝이 없으면 ""
 *   DATE_PICKER_LABELS  글 한 벌(한국어) — 다른 언어는 같은 꼴로 labels 에 넘긴다
 *   DATE_PICKER_TWO_MONTHS_POPOVER   두 달 보기를 담는 PopoverContent 의 className — 팝오버 폭 744(Popover 최대 480 의 예외)
 *
 * 값(Date 는 그 날의 0시로 다룬다 — 시간은 보지 않는다)
 *   single    Date | undefined — 누르면 고른다. 다시 눌러도 풀리지 않는다
 *   range     { start?, end? } — 첫 탭이 시작, 시작 뒤의 날은 끝(같은 날이면 하루짜리), 시작 앞의 날은 새 시작(둘을 바꾸지 않는다),
 *             완성된 뒤 누르면 새로 시작. onValueChange 는 { start } 다음 { start, end }. readOnlyStart 면 시작은 그대로이고
 *             시작 뒤의 날만 끝이 된다(시작 앞은 막힌 날)
 *   multiple  Date[] — 누를 때마다 고르고 풀린다, 늘 날짜 순 · 겹침 없음. maxSelectionCount 에 닿으면 고르지 않은 날이 막힌 날이
 *             된다(더 넣지 못하고 빼기는 된다 — SEED 의 제약과 같다)
 * 고르는 동안 칸 값은 그대로다 — 쓰는 쪽은 draft 에 받고 "완료" 로 칸에 넣는다(input-button.md). 기간은 끝을 고르기 전에 "완료" 를 막는다.
 *
 * 보이는 범위
 *   month      머리 48(연 · 월 제목 + 셰브론 20 · 이전 · 다음 Button ghost iconOnly medium 40, 아이콘 18, 둘 사이 0 · 오른쪽 끝) ·
 *              요일 줄 48 · 늘 6주(앞뒤 달 날짜를 흐리게 채운다 — 달을 넘겨도 높이가 그대로다). 폭은 부모(시트 — 시트 폭 − 48),
 *              팝오버 안이면 336(칸 48 × 7, data-slot=popover-content 를 보고 정한다). 제목을 누르면 요일 줄 · 날짜 자리(336)에
 *              연 | 월 휠(Wheel Picker medium × 7 — 연 120 오른쪽 정렬 · 월 96 왼쪽 정렬, 월은 돈다)이 뜨고 셰브론이 위로 돈다(150ms).
 *              휠이 열린 동안 이전 · 다음은 막힌다. 제목을 다시 누르면 고른 달로 옮기고 그 달 1일이 Tab 자리가 된다
 *   twoMonths  696(336 + 24 + 336) — 1280 이상 팝오버의 기간. 머리를 나누지 않는다 — 달 이름은 달마다 가운데(48), 이전은 첫 달
 *              왼쪽 끝 · 다음은 둘째 달 오른쪽 끝(위 4). 이전 · 다음은 한 달씩, PageUp · PageDown 은 두 달씩. 연 · 월 휠은 없다
 *   continuous 1280 미만 시트의 기간 — 머리 · 휠이 없고 달이 위아래로 이어진다. 요일 줄이 위에 붙고, 달마다 왼쪽 달 이름(48) ·
 *              그 달의 주 수(4 ~ 6, 앞뒤 달 날짜는 비운다) · 아래 16. 아래 끝 안개 96(투명 → 바탕색). 부모가 준 높이를 채운다 —
 *              시트는 BottomSheetContent 에 h-[90dvh] 를 준다. 달 높이가 정해져 있어(48 + 48 × 주 + 16) 보이는 달 ± 2달만 그린다.
 *              손으로 스크롤해 맨 위 달이 바뀌면 그 달 1일이 Tab 자리가 된다. 키로 달을 넘으면 그 날이 보이게 가장 적게 스크롤한다
 *
 * 날짜 칸 — 높이 최소 48(글자가 크면 그만큼만 늘어난다 — 칸 · 머리 · 요일 줄 · 원 · 이전 · 다음은 px, 글자만 배율 — 03-C 1B · SEED) · 폭 = 달력 폭 ÷ 7, 칸 전체가 누르는 자리. 원은 칸 가운데 42(위 3 — 원 · 띠끼리 6 떨어진다), 칸이 44 보다
 * 좁으면(320 화면) 칸 폭 − 2. 기간 띠도 원과 같은 높이다. 숫자 t5 16 / 22 · 500 · tabular-nums. 달 그리드가 크기 컨테이너라
 * --day = min(42px, 칸 폭 − 2px) 를 한 번 셈해 원 · 띠 · 링이 같이 쓴다.
 *
 * 상태(date-picker.yaml · "상태가 겹칠 때")
 *   보통       숫자 fg-neutral-muted · 원 없음
 *   호버 · 누름 원 bg-neutral-weak-alpha-pressed(SEED 투명 색 — 03-C 2B) — 호버는 고운 포인터(마우스)만, 터치는 누르는 동안. 날짜는 줄지 않는다. 오늘(옅은 원) ·
 *              기간 사이 날(띠) 위에서는 한 단계 짙은 bg-neutral-weak-pressed — 옅은 원 · 띠와 같은 색이 되어 안 보이지 않게
 *              (투명 색을 띠 위에 얹으면 띠와 겹쳐 또 다른 색이 된다). 고른 날 · 막힌 날 · 읽기 전용 · 앞뒤 달에는 없다
 *   오늘       원 bg-neutral-weak + 숫자 700 · fg-neutral. 고른 날 · 기간 안에서도 700 은 남는다. aria-current="date"
 *   고름       원 bg-neutral-inverted + 숫자 fg-neutral-inverted — 하루 · 여러 날의 고른 날, 기간의 시작 · 끝. 오늘이어도 이 모양
 *   기간 사이   원 없이 띠(bg-neutral-weak, 원 높이) — 시작 칸은 원 가운데부터 오른쪽, 끝 칸은 왼쪽부터 원 가운데까지, 사이 칸은 칸 폭
 *              전체(줄 끝에서 둥글리지 않는다). 숫자 fg-neutral-muted. 띠는 기간이 완성됐을 때만(하루짜리 · 시작만이면 없다)
 *   앞뒤 달    fg-disabled 숫자만 — 버튼이 아니라 누르지 못하고 cursor default. 칸(gridcell)은 남기고 숫자를 aria-hidden 으로 숨긴다 —
 *              칸째 숨기면 그 주의 칸 수가 줄어 보조 기술이 요일을 잘못 짝짓는다(목요일 칸을 일요일로 읽는다)
 *   막힌 날    fg-disabled + 취소선 · cursor not-allowed · aria-disabled(초점은 간다 · Enter · Space · 누르기는 무시). 기간 안이면
 *              띠는 그대로. 미완성 기간의 시작이 막힌 날이어도 시작 원 위에는 취소선을 긋지 않는다
 *   읽기 전용   확정된 시작일(readOnlyStart) — 원 stroke-neutral-solid + 숫자 fg-neutral-inverted · cursor default · aria-disabled ·
 *              이름 끝에 ", 읽기 전용 시작일"
 *   초점       키보드 초점에만 원 둘레 안쪽 2px 링(stroke-focus-ring)
 *
 * 빠른 기간(range) — 달력 위 칩 한 줄(ChipRadioGroup · ChipRadio outlineStrong medium, 칩 사이 8 · 아래 12). 누르면 그 기간을 칠하고
 * 시작이 든 달로 옮긴다(열 때와 같다). 달력에서 날을 누르면 칩 고름이 풀린다. 고른 칩은 값이 그 범위일 때만 남는다(초기화 등으로
 * 값이 바뀌면 풀린다) — 처음 그릴 때 값이 어느 칩의 범위와 같으면 그 칩을 골라 둔다. min · max · isDateDisabled 에 걸려 시작이나
 * 끝을 고를 수 없는 칩은 막는다(이름은 어디서나 같은 기간이라 범위를 잘라 넣지 않는다).
 * presetsLayout — scroll(시트, 한 줄 가로 스크롤 · 화면 끝까지 bleed) · wrap(팝오버, 줄바꿈). 기본은 continuous 면 scroll, 아니면 wrap.
 *
 * 키보드(WAI-ARIA Grid) — 날짜 하나만 Tab 순서에 든다(roving tabindex: 보이는 달의 고른 날 → 오늘 → 1일).
 *   ← → 하루 · ↑ ↓ 한 주 · Home End 그 주의 일요일 · 토요일 · PageUp PageDown 한 달(같은 날, 없으면 말일 — 두 달 보기는 두 달) ·
 *   Shift + PageUp PageDown 한 해 · Enter Space 고르기(막힌 날 · 읽기 전용은 무시). 보이는 달 밖으로 옮기면 달이 따라 넘어간다.
 *   보이는 달이 바뀌면 숨은 aria-live="polite" 가 "2026년 11월" 을 읽는다(두 달 보기는 "2026년 10월~2026년 11월" — 물결표를 붙여 쓴다, International Design).
 * autoFocus — 처음 그릴 때 그 날짜(고른 날, 없으면 오늘)에 초점을 둔다. 시트 · 팝오버가 처음 초점을 둔 뒤(바깥 표면의 effect 가
 * 나중에 돈다) 그리기 전에 옮긴다 — 표면은 연 자리(트리거)를 그대로 기억해 닫으면 초점이 칸으로 돌아온다.
 *
 * 이름: 달력 role="group"(aria-label 기본 "날짜 선택" — 칸 라벨이 있으면 aria-labelledby), 달마다 role="grid" + 달 제목으로
 * aria-labelledby · 기간 · 여러 날은 aria-multiselectable. 요일은 columnheader(이름 "일요일" — 보이는 "일" 은 숨긴다. 이어지는 달은
 * 붙은 요일 줄을 숨기고 달마다 숨은 columnheader 줄을 둔다). 날짜 버튼 이름 "2026년 10월 15일 목요일", 고른 날 · 기간 칸은
 * gridcell 에 aria-selected. 이전 · 다음 "이전 달" · "다음 달", 제목 버튼 aria-expanded · aria-controls(휠). 글은 labels 한 벌.
 */

// ── 날짜 도구(그 날의 0시 Date — 시간은 보지 않는다) ─────────────
const pad2 = (n: number) => String(n).padStart(2, "0");
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
// 한 달 · 한 해 옮기기 — 같은 날, 없으면 그 달 말일
const addMonths = (d: Date, n: number) => {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), daysInMonth(first.getFullYear(), first.getMonth())));
};
const compareDay = (a: Date, b: Date) => a.getFullYear() - b.getFullYear() || a.getMonth() - b.getMonth() || a.getDate() - b.getDate();
const sameDay = (a: Date | undefined, b: Date | undefined) => !!a && !!b && compareDay(a, b) === 0;
const monthNumber = (d: Date) => d.getFullYear() * 12 + d.getMonth();
const fromMonthNumber = (n: number) => new Date(Math.floor(n / 12), ((n % 12) + 12) % 12, 1);
const dayKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
// 주는 일요일부터
const weekStart = (d: Date) => addDays(d, -d.getDay());
const weekEnd = (d: Date) => addDays(d, 6 - d.getDay());
// 그 달의 주 수 — 4 ~ 6
const weeksInMonth = (year: number, month: number) => Math.ceil((new Date(year, month, 1).getDay() + daysInMonth(year, month)) / 7);
const clampDay = (d: Date, min: Date, max: Date) => (compareDay(d, min) < 0 ? min : compareDay(d, max) > 0 ? max : d);

// ── 글 ───────────────────────────────────────────────────────
export type DatePresetName =
  | "thisWeek"
  | "thisMonth"
  | "lastMonth"
  | "last7Days"
  | "last30Days"
  | "last3Months"
  | "last6Months"
  | "last1Year"
  | "thisYear";

/** 빠른 기간 이름 — date-picker.md "빠른 기간" 의 순서 */
export const DATE_PRESETS: readonly DatePresetName[] = [
  "thisWeek",
  "thisMonth",
  "lastMonth",
  "last7Days",
  "last30Days",
  "last3Months",
  "last6Months",
  "last1Year",
  "thisYear",
];

export interface DatePickerLabels {
  /** 달력 이름 — 칸 라벨이 없을 때 */
  root: string;
  previousMonth: string;
  nextMonth: string;
  /** 연 · 월 휠의 칼럼 이름 */
  yearWheel: string;
  monthWheel: string;
  /** 읽기 전용 시작일 이름 끝에 붙는 말 */
  readOnlyRangeStart: string;
  /** 빠른 기간 칩 묶음 이름 */
  presets: string;
  /** 보이는 요일(일요일부터 일곱) */
  weekdays: readonly string[];
  /** 읽는 요일(일요일부터 일곱) */
  weekdaysLong: readonly string[];
  /** 달 제목 · 알림 — month 는 1 ~ 12 */
  month: (year: number, month: number) => string;
  /** 날짜 버튼 이름 */
  day: (date: Date) => string;
  /** 연 · 월 휠 항목 */
  yearOption: (year: number) => string;
  monthOption: (month: number) => string;
  /** 빠른 기간 칩 글 */
  presetNames: Record<DatePresetName, string>;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const WEEKDAYS_LONG = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const;

/** 한국어 글 한 벌 */
export const DATE_PICKER_LABELS: DatePickerLabels = {
  root: "날짜 선택",
  previousMonth: "이전 달",
  nextMonth: "다음 달",
  yearWheel: "연도",
  monthWheel: "월",
  readOnlyRangeStart: "읽기 전용 시작일",
  presets: "빠른 기간",
  weekdays: WEEKDAYS,
  weekdaysLong: WEEKDAYS_LONG,
  month: (year, month) => `${year}년 ${month}월`,
  day: (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS_LONG[d.getDay()]}`,
  yearOption: (year) => `${year}년`,
  monthOption: (month) => `${month}월`,
  presetNames: {
    thisWeek: "이번 주",
    thisMonth: "이번 달",
    lastMonth: "지난 달",
    last7Days: "최근 7일",
    last30Days: "최근 30일",
    last3Months: "최근 3개월",
    last6Months: "최근 6개월",
    last1Year: "최근 1년",
    thisYear: "올해",
  },
};

// ── 값 ───────────────────────────────────────────────────────
export interface DateRange {
  start?: Date;
  end?: Date;
}

/** 빠른 기간의 범위 — 달력 단위(끝은 그 단위의 마지막 날, 앞으로의 날도 든다), 주는 일요일부터. today 는 오늘(기본 지금) */
export function getPresetRange(name: DatePresetName, today: Date = new Date()): { start: Date; end: Date } {
  const t = startOfDay(today);
  const y = t.getFullYear();
  const m = t.getMonth();
  // 이번 달을 넣은 n 달 — n − 1 달 전 1일 ~ 이번 달 말일
  const months = (n: number) => ({ start: new Date(y, m - (n - 1), 1), end: new Date(y, m + 1, 0) });
  switch (name) {
    case "thisWeek":
      return { start: weekStart(t), end: weekEnd(t) };
    case "thisMonth":
      return months(1);
    case "lastMonth":
      return { start: new Date(y, m - 1, 1), end: new Date(y, m, 0) };
    case "last7Days":
      return { start: addDays(t, -6), end: t };
    case "last30Days":
      return { start: addDays(t, -29), end: t };
    case "last3Months":
      return months(3);
    case "last6Months":
      return months(6);
    case "last1Year":
      return months(12);
    case "thisYear":
      return { start: new Date(y, 0, 1), end: new Date(y, 11, 31) };
  }
}

/** 칸에 넣는 하루 — 올해 "10월 15일 (목)", 다른 해 "2027년 1월 3일 (일)". 비었으면 "" */
export function formatDateValue(date: Date | undefined | null, today: Date = new Date()): string {
  if (!date) return "";
  const text = `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
  return date.getFullYear() === today.getFullYear() ? text : `${date.getFullYear()}년 ${text}`;
}

/** 칸에 넣는 기간 — "10월 1일~10월 31일"(물결표를 앞뒤에 붙여 쓴다 — International Design). 올해가 아닌 날이 끼면(두 해에 걸치거나 다른 해)
 *  양쪽에 연도("2026년 12월 28일~2027년 1월 3일"). 끝이 없으면 "" */
export function formatRangeValue(range: DateRange | undefined | null, today: Date = new Date()): string {
  if (!range?.start || !range.end) return "";
  const year = today.getFullYear();
  const withYear = range.start.getFullYear() !== year || range.end.getFullYear() !== year;
  const text = (d: Date) => `${withYear ? `${d.getFullYear()}년 ` : ""}${d.getMonth() + 1}월 ${d.getDate()}일`;
  return `${text(range.start)}~${text(range.end)}`;
}

/** 두 달 보기를 담는 PopoverContent 의 className — 팝오버 폭 744(달력 696 + 좌우 24). Popover 최대 480 의 예외(date-picker.md) */
export const DATE_PICKER_TWO_MONTHS_POPOVER = "max-w-[min(744px,var(--radix-popover-content-available-width,744px))]";

// ── 모양 ─────────────────────────────────────────────────────
// 달력 — bg-layer-floating. 폭은 부모(시트), 팝오버 안이면 336, 두 달은 696. 이어지는 달은 부모가 준 높이를 채운다
const ROOT = "relative flex min-w-0 flex-col bg-bg-layer-floating font-sans";
const ROOT_SIZE = {
  month: "w-full [[data-slot=popover-content]_&]:w-[336px]",
  twoMonths: "w-[696px]",
  continuous: "h-full min-h-0 w-full",
} as const;

// 빠른 기간 칩 줄 — 머리와 12
const PRESETS = "shrink-0 pb-x3";

// 머리 48 — 왼쪽 제목, 오른쪽 이전 · 다음(사이 0)
// 이전 · 다음 — Button ghost iconOnly medium 을 px 40 으로 고정한다(글자 크기를 따르지 않는다 — 03-C 1B, SEED)
const NAV_PX = "h-[40px] w-[40px]";
const HEADER = "flex min-h-[48px] shrink-0 items-center justify-between";
// 제목 — 누르는 자리는 머리 높이 48 전체, 글자는 왼쪽에서 4 · 셰브론과 4. 바탕이 없어 모서리 8 은 초점 링에만 보인다
const TITLE = [
  "inline-flex min-h-[48px] min-w-0 cursor-pointer items-center gap-x1 rounded-r2 border-0 bg-transparent px-x1 font-sans text-t5 font-bold text-fg-neutral outline-none",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 셰브론 20 — 휠이 열리면 위로(150ms easing). 모션 줄이기면 바로
const TITLE_ICON = "size-[20px] shrink-0 text-fg-neutral [transition:rotate_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:[transition:none]";
const NAV = "flex shrink-0 items-center";

// 두 달 — 사이 24, 달마다 가운데 이름 48 · 이전은 첫 달 왼쪽 끝 · 다음은 둘째 달 오른쪽 끝(위 4)
const TWO_MONTHS = "grid grid-cols-2 gap-x-x6";
const TWO_MONTHS_HEADER = "relative flex min-h-[48px] items-center justify-center";
const MONTH_NAME = "text-t5 font-bold text-fg-neutral whitespace-nowrap";
const NAV_START = "absolute left-0 top-x1";
const NAV_END = "absolute right-0 top-x1";

// 이어지는 달 — 스크롤 칸(스크롤바 숨김) · 위에 붙는 요일 줄 · 달마다 왼쪽 이름 48 + 아래 16 · 아래 안개 96
const CONTINUOUS_SCROLL = "relative min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const CONTINUOUS_WEEKDAYS = "sticky top-0 z-[2] grid min-h-[48px] grid-cols-7 bg-bg-layer-floating";
const CONTINUOUS_MONTH = "pb-x4";
const CONTINUOUS_MONTH_NAME = "flex min-h-[48px] items-center px-x1 text-t5 font-bold text-fg-neutral";
const FOG = "pointer-events-none sticky bottom-0 z-[3] -mt-24 h-24 [background:linear-gradient(to_bottom,transparent,var(--color-bg-layer-floating))]";

// 연 · 월 휠 자리 — 요일 줄 + 6주(336)를 덮는다. 휠 308 은 가운데(위아래 14)
const WHEEL = "flex h-[336px] items-center bg-bg-layer-floating";
const WHEEL_YEAR = "w-[120px]";
const WHEEL_MONTH = "w-[96px]";

// 달 그리드 — 크기 컨테이너. --day = min(42, 칸 폭 − 2) 를 원 · 띠 · 링이 같이 쓴다
const GRID = "@container [--day:min(42px,calc(100cqw_/_7_-_2px))]";
const WEEK = "grid grid-cols-7";
const WEEKDAY_ROW = "grid min-h-[48px] grid-cols-7";
const WEEKDAY = "flex items-center justify-center text-t4 font-medium text-fg-neutral-subtle";

// 칸 — 높이 48 · 폭 = 달력 폭 ÷ 7. 기간 띠는 칸의 ::before(원 높이, 칸 세로 가운데)
const CELL = "relative isolate min-h-[48px] min-w-0";
const BAND = "before:pointer-events-none before:absolute before:top-1/2 before:h-[var(--day)] before:-translate-y-1/2 before:bg-bg-neutral-weak before:content-['']";
const BAND_SIDE = {
  start: "before:left-1/2 before:right-0",
  middle: "before:inset-x-0",
  end: "before:left-0 before:right-1/2",
} as const;

// 날짜 버튼 — 칸 전체. 원은 ::before(칸 가운데 --day · 바탕만 color-transition), 키보드 초점 링은 ::after(원 둘레 안쪽 2px)
const DAY = [
  "relative isolate flex h-full w-full items-center justify-center border-0 bg-transparent p-0 font-sans text-t5 font-medium tabular-nums outline-none select-none [-webkit-tap-highlight-color:transparent]",
  "before:absolute before:left-1/2 before:top-1/2 before:-z-10 before:size-[var(--day)] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-transparent before:content-[''] before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:size-[var(--day)] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
].join(" ");
// 호버(마우스 — 고운 포인터만) · 누름(터치) — 원 bg-neutral-weak-alpha-pressed(SEED 투명 색 — 2026-10-21 03-C 2B), 축소 없음
const DAY_PRESS = "[@media(hover:hover)_and_(pointer:fine)]:hover:before:bg-bg-neutral-weak-alpha-pressed active:before:bg-bg-neutral-weak-alpha-pressed";
// 오늘(옅은 원) · 기간 사이 날(띠) 위의 호버 · 누름 — 한 단계 짙은 bg-neutral-weak-pressed(옅은 원 · 띠와 같은 색이면 안 보인다)
const DAY_PRESS_ON_WEAK = "[@media(hover:hover)_and_(pointer:fine)]:hover:before:bg-bg-neutral-weak-pressed active:before:bg-bg-neutral-weak-pressed";
const DAY_STATE = {
  enabled: "cursor-pointer text-fg-neutral-muted",
  today: "cursor-pointer text-fg-neutral before:bg-bg-neutral-weak",
  selected: "cursor-pointer text-fg-neutral-inverted before:bg-bg-neutral-inverted",
  inRange: "cursor-pointer text-fg-neutral-muted",
  disabled: "cursor-not-allowed text-fg-disabled",
  readOnly: "cursor-default text-fg-neutral-inverted before:bg-stroke-neutral-solid",
} as const;
const DAY_TODAY_WEIGHT = "font-bold";
const DAY_STRIKE = "line-through";
// 앞뒤 달 — 숫자만(버튼 아님), 흐리게 · 누르지 못한다
const OUTSIDE = "flex h-full w-full cursor-default select-none items-center justify-center text-t5 font-medium tabular-nums text-fg-disabled";

const LIVE = "sr-only";

// ── 작은 도구 ─────────────────────────────────────────────────
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 이어지는 달의 높이 — 달 이름 48 + 48 × 주 + 아래 16
const MONTH_LABEL_HEIGHT = 48;
const ROW_HEIGHT = 48;
const MONTH_GAP = 16;
const WEEKDAY_HEIGHT = 48;
const CONTINUOUS_FOG = 96;
const CONTINUOUS_OVERSCAN = 2;

// 정렬된 위치 목록에서 그 위치를 가진 달 — 이진 탐색
function monthAt(offsets: readonly number[], heights: readonly number[], offset: number) {
  let low = 0;
  let high = offsets.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const top = offsets[mid] ?? 0;
    if (offset < top) high = mid - 1;
    else if (offset >= top + (heights[mid] ?? 0)) low = mid + 1;
    else return mid;
  }
  return Math.min(Math.max(low, 0), Math.max(offsets.length - 1, 0));
}

// ── 속성 ─────────────────────────────────────────────────────
type DatePickerBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> & {
  /** month(기본 — 하루 · 여러 날) · twoMonths(1280 이상 팝오버의 기간) · continuous(1280 미만 시트의 기간) */
  visibleRange?: "month" | "twoMonths" | "continuous";
  /** 고를 수 있는 첫날 — 그 앞은 막힌 날 */
  min?: Date;
  /** 고를 수 있는 마지막 날 — 그 뒤는 막힌 날 */
  max?: Date;
  /** 그 밖의 막힌 날 */
  isDateDisabled?: (date: Date) => boolean;
  /** 옮기고 고를 수 있는 연도(양끝 포함) — 기본 오늘 ± 100년 */
  yearRange?: { start: number; end: number };
  /** 오늘 — 기본 지금(테스트 · 서버 날짜에 맞출 때) */
  today?: Date;
  /** 처음 그릴 때 고른 날(없으면 오늘)에 초점 — 시트 · 팝오버가 열 때 */
  autoFocus?: boolean;
  /** 글 한 벌(기본 한국어) */
  labels?: Partial<DatePickerLabels>;
};

export type DatePickerSingleProps = DatePickerBaseProps & {
  selection?: "single";
  value?: Date;
  onValueChange?: (value: Date) => void;
};

export type DatePickerRangeProps = DatePickerBaseProps & {
  selection: "range";
  value?: DateRange;
  /** { start } 다음 { start, end } */
  onValueChange?: (value: DateRange) => void;
  /** 확정된 시작일 — 시작은 그대로, 시작 뒤의 날만 끝이 된다(진행 중인 기간 늘리기) */
  readOnlyStart?: boolean;
  /** 빠른 기간 칩 — date-picker.md 의 한 벌에서 고른다 */
  presets?: readonly DatePresetName[];
  /** 칩 줄 — scroll(시트, 한 줄 가로 스크롤) · wrap(팝오버, 줄바꿈). 기본은 continuous 면 scroll, 아니면 wrap */
  presetsLayout?: "scroll" | "wrap";
};

export type DatePickerMultipleProps = DatePickerBaseProps & {
  selection: "multiple";
  value?: readonly Date[];
  /** 날짜 순 · 겹침 없음 */
  onValueChange?: (value: Date[]) => void;
  /** 최대 개수 — 닿으면 더 넣지 못한다(빼기는 된다) */
  maxSelectionCount?: number;
};

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps | DatePickerMultipleProps;

type AnyProps = DatePickerBaseProps & {
  selection?: "single" | "range" | "multiple";
  value?: Date | DateRange | readonly Date[];
  onValueChange?: (value: never) => void;
  readOnlyStart?: boolean;
  presets?: readonly DatePresetName[];
  presetsLayout?: "scroll" | "wrap";
  maxSelectionCount?: number;
};

type CellState = {
  date: Date;
  today: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  complete: boolean;
  disabled: boolean;
  readOnly: boolean;
};

// ── 달력 ─────────────────────────────────────────────────────
const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const {
    selection = "single",
    value,
    onValueChange,
    readOnlyStart = false,
    presets,
    presetsLayout,
    maxSelectionCount,
    visibleRange = "month",
    min,
    max,
    isDateDisabled,
    yearRange: yearRangeProp,
    today: todayProp,
    autoFocus = false,
    labels: labelsProp,
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = props as AnyProps;
  const labels = React.useMemo(() => ({ ...DATE_PICKER_LABELS, ...labelsProp }), [labelsProp]);
  const twoMonths = visibleRange === "twoMonths";
  const continuous = visibleRange === "continuous";

  // 오늘 · 연도 범위 — 오늘을 주지 않으면 처음 그릴 때의 오늘
  const [autoToday] = React.useState(() => startOfDay(new Date()));
  const today = todayProp ? startOfDay(todayProp) : autoToday;
  const yearStart = yearRangeProp?.start ?? today.getFullYear() - 100;
  const yearEnd = yearRangeProp?.end ?? today.getFullYear() + 100;
  const firstDay = React.useMemo(() => new Date(yearStart, 0, 1), [yearStart]);
  const lastDay = React.useMemo(() => new Date(yearEnd, 11, 31), [yearEnd]);
  const firstMonth = yearStart * 12;
  // 두 달 보기는 둘째 달까지 범위 안이어야 한다
  const lastViewMonth = yearEnd * 12 + 11 - (twoMonths ? 1 : 0);
  const clampView = (d: Date) => fromMonthNumber(Math.min(Math.max(monthNumber(d), firstMonth), lastViewMonth));

  // 값 — 안에서는 한 꼴로
  const single = selection === "single" ? (value as Date | undefined) : undefined;
  const range = selection === "range" ? (value as DateRange | undefined) : undefined;
  const rangeStart = range?.start ? startOfDay(range.start) : undefined;
  const rangeEnd = range?.end && rangeStart ? startOfDay(range.end) : undefined;
  const multiple = React.useMemo(() => {
    if (selection !== "multiple") return [] as Date[];
    const list = ((value as readonly Date[] | undefined) ?? []).map(startOfDay).sort(compareDay);
    return list.filter((d, i) => i === 0 || !sameDay(d, list[i - 1]));
  }, [selection, value]);
  const emit = (next: Date | DateRange | Date[]) => (onValueChange as ((v: Date | DateRange | Date[]) => void) | undefined)?.(next);
  const readOnlyStartActive = selection === "range" && readOnlyStart && !!rangeStart;
  const maxReached = selection === "multiple" && maxSelectionCount !== undefined && multiple.length >= maxSelectionCount;

  // 처음 보일 달 — 고른 날(기간은 시작, 여러 날은 가장 이른 날), 없으면 오늘
  const anchor = selection === "single" ? single && startOfDay(single) : selection === "range" ? rangeStart : multiple[0];

  const visibleMonths = (view: Date) => (twoMonths ? [view, fromMonthNumber(monthNumber(view) + 1)] : [view]);
  const isVisible = (d: Date, view: Date) => visibleMonths(view).some((m) => m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth());
  // Tab 자리 — 보이는 달의 고른 날 → 오늘 → 1일
  const tabStopFor = (view: Date) => {
    const picked =
      selection === "single" ? (single ? [startOfDay(single)] : []) : selection === "range" ? [rangeStart, rangeEnd].filter((d): d is Date => !!d) : multiple;
    return picked.find((d) => isVisible(d, view)) ?? (isVisible(today, view) ? today : view);
  };

  const [view, setView] = React.useState(() => clampView(monthStart(anchor ?? today)));
  const [focused, setFocused] = React.useState(() => tabStopFor(clampView(monthStart(anchor ?? today))));
  const [wheelOpen, setWheelOpen] = React.useState(false);
  const [wheel, setWheel] = React.useState({ year: view.getFullYear(), month: view.getMonth() + 1 });

  // 고를 수 없는 날
  const isDisabled = (d: Date) =>
    compareDay(d, firstDay) < 0 ||
    compareDay(d, lastDay) > 0 ||
    (!!min && compareDay(d, startOfDay(min)) < 0) ||
    (!!max && compareDay(d, startOfDay(max)) > 0) ||
    !!isDateDisabled?.(d) ||
    (readOnlyStartActive && !!rangeStart && compareDay(d, rangeStart) < 0) ||
    (maxReached && !multiple.some((x) => sameDay(x, d)));

  const cellState = (d: Date): CellState => {
    const isToday = sameDay(d, today);
    const complete = !!rangeStart && !!rangeEnd;
    let selected = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let inRange = false;
    if (selection === "single") selected = sameDay(d, single);
    else if (selection === "multiple") selected = multiple.some((x) => sameDay(x, d));
    else if (rangeStart) {
      isRangeStart = sameDay(d, rangeStart);
      isRangeEnd = sameDay(d, rangeEnd);
      inRange = complete && compareDay(d, rangeStart) > 0 && compareDay(d, rangeEnd!) < 0;
      selected = isRangeStart || isRangeEnd;
    }
    return {
      date: d,
      today: isToday,
      selected,
      rangeStart: isRangeStart,
      rangeEnd: isRangeEnd,
      inRange,
      complete,
      disabled: isDisabled(d),
      readOnly: readOnlyStartActive && isRangeStart,
    };
  };

  // ── 빠른 기간 ──
  const presetList = selection === "range" ? (presets ?? []) : [];
  const presetAvailable = (name: DatePresetName) => {
    const r = getPresetRange(name, today);
    if (compareDay(r.start, firstDay) < 0 || compareDay(r.end, lastDay) > 0) return false;
    if ((min && compareDay(r.start, startOfDay(min)) < 0) || (max && compareDay(r.end, startOfDay(max)) > 0)) return false;
    if (isDateDisabled?.(r.start) || isDateDisabled?.(r.end)) return false;
    if (readOnlyStartActive && rangeStart && !sameDay(r.start, rangeStart)) return false;
    return true;
  };
  const matchesValue = (name: DatePresetName) => {
    const r = getPresetRange(name, today);
    return sameDay(r.start, rangeStart) && sameDay(r.end, rangeEnd);
  };
  const [presetPick, setPresetPick] = React.useState<DatePresetName | null>(() => presetList.find(matchesValue) ?? null);
  // 고른 칩은 값이 그 범위일 때만 — 초기화 등으로 값이 바뀌면 풀린다
  const activePreset = presetPick && matchesValue(presetPick) ? presetPick : null;

  // ── 초점 · 스크롤 요청(커밋 뒤 처리) ──
  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const focusRequestRef = React.useRef(false);
  const scrollRequestRef = React.useRef<number | null>(null);
  const userScrollRef = React.useRef(false);

  const id = React.useId();
  const titleId = `${id}title`;
  const wheelId = `${id}wheel`;
  const monthLabelId = (d: Date) => `${id}m${monthNumber(d)}`;

  // ── 이어지는 달: 달 위치 ──
  const monthCount = continuous ? (yearEnd - yearStart + 1) * 12 : 0;
  const layout = React.useMemo(() => {
    const heights: number[] = [];
    const offsets: number[] = [];
    let offset = 0;
    for (let i = 0; i < monthCount; i++) {
      const d = fromMonthNumber(firstMonth + i);
      const h = MONTH_LABEL_HEIGHT + weeksInMonth(d.getFullYear(), d.getMonth()) * ROW_HEIGHT + MONTH_GAP;
      offsets.push(offset);
      heights.push(h);
      offset += h;
    }
    return { offsets, heights, total: offset };
  }, [firstMonth, monthCount]);
  const offsetOf = (d: Date) => layout.offsets[monthNumber(d) - firstMonth] ?? 0;
  const [scrollTop, setScrollTop] = React.useState(() => (continuous ? offsetOf(view) : 0));
  const [viewport, setViewport] = React.useState(0);
  const scrollTopRef = React.useRef(scrollTop);

  // 그 날이 보이게 가장 적게 스크롤할 자리 — 위에 붙은 요일 줄 48 · 아래 안개 96 을 피한다
  const revealTop = (d: Date, current: number, height: number) => {
    const row = Math.floor((new Date(d.getFullYear(), d.getMonth(), 1).getDay() + d.getDate() - 1) / 7);
    const rowTop = WEEKDAY_HEIGHT + offsetOf(d) + MONTH_LABEL_HEIGHT + row * ROW_HEIGHT;
    if (rowTop < current + WEEKDAY_HEIGHT) return rowTop - WEEKDAY_HEIGHT;
    if (height > 0 && rowTop + ROW_HEIGHT > current + height - CONTINUOUS_FOG) return Math.min(rowTop + ROW_HEIGHT - height + CONTINUOUS_FOG, rowTop - WEEKDAY_HEIGHT);
    return current;
  };
  const requestScroll = (top: number) => {
    const next = Math.max(0, top);
    scrollRequestRef.current = next;
    scrollTopRef.current = next;
    setScrollTop(next);
  };

  // 보이는 달을 바꾼다 — 이어지는 달이면 그 달을 맨 위로
  const showMonth = (month: Date, tabStop: Date) => {
    const next = clampView(month);
    setView(next);
    setFocused(tabStop);
    if (continuous) requestScroll(offsetOf(next));
  };

  // 키로 초점을 옮긴다 — 보이는 달 밖이면 달이 따라 넘어간다(이어지는 달은 그 날이 보이게 가장 적게 스크롤)
  const moveFocus = (target: Date) => {
    const next = clampDay(target, firstDay, lastDay);
    focusRequestRef.current = true;
    setFocused(next);
    if (continuous) {
      if (monthNumber(next) !== monthNumber(view)) setView(monthStart(next));
      const el = scrollRef.current;
      const top = revealTop(next, scrollTopRef.current, el?.clientHeight ?? viewport);
      if (top !== scrollTopRef.current) requestScroll(top);
      return;
    }
    if (!isVisible(next, view)) setView(clampView(monthStart(next)));
  };

  const selectDate = (d: Date) => {
    const state = cellState(d);
    if (state.disabled || state.readOnly) return;
    setFocused(d);
    setPresetPick(null);
    if (selection === "single") {
      if (!sameDay(d, single)) emit(d);
      return;
    }
    if (selection === "multiple") {
      const exists = multiple.some((x) => sameDay(x, d));
      emit(exists ? multiple.filter((x) => !sameDay(x, d)) : [...multiple, d].sort(compareDay));
      return;
    }
    if (readOnlyStartActive && rangeStart) {
      if (compareDay(d, rangeStart) <= 0 || sameDay(d, rangeEnd)) return;
      emit({ start: rangeStart, end: d });
      return;
    }
    if (!rangeStart || rangeEnd) emit({ start: d });
    else if (compareDay(d, rangeStart) < 0) emit({ start: d });
    else emit({ start: rangeStart, end: d });
  };

  const choosePreset = (name: string) => {
    if (!presetList.includes(name as DatePresetName)) return;
    const r = getPresetRange(name as DatePresetName, today);
    setPresetPick(name as DatePresetName);
    emit({ start: r.start, end: r.end });
    // 시작이 든 달로 — Tab 자리는 시작
    showMonth(monthStart(r.start), r.start);
  };

  const onDayKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, d: Date) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.nativeEvent.isComposing) return;
    let next: Date;
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(d, -1);
        break;
      case "ArrowRight":
        next = addDays(d, 1);
        break;
      case "ArrowUp":
        next = addDays(d, -7);
        break;
      case "ArrowDown":
        next = addDays(d, 7);
        break;
      case "Home":
        next = weekStart(d);
        break;
      case "End":
        next = weekEnd(d);
        break;
      case "PageUp":
        next = addMonths(d, e.shiftKey ? -12 : twoMonths ? -2 : -1);
        break;
      case "PageDown":
        next = addMonths(d, e.shiftKey ? 12 : twoMonths ? 2 : 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectDate(d);
        return;
      default:
        return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  // 이전 · 다음 — 한 달씩(두 달 보기도). Tab 자리는 새 달의 고른 날 → 오늘 → 1일
  const viewNumber = monthNumber(view);
  const canPrev = !wheelOpen && viewNumber > firstMonth;
  const canNext = !wheelOpen && viewNumber < lastViewMonth;
  const step = (dir: -1 | 1) => {
    const next = clampView(fromMonthNumber(viewNumber + dir));
    setView(next);
    setFocused(tabStopFor(next));
  };

  // 연 · 월 휠 — 열 때 지금 달에서, 닫을 때 고른 달로 옮기고 그 달 1일이 Tab 자리
  const toggleWheel = () => {
    if (!wheelOpen) {
      setWheel({ year: view.getFullYear(), month: view.getMonth() + 1 });
      setWheelOpen(true);
      return;
    }
    setWheelOpen(false);
    const picked = clampView(new Date(wheel.year, wheel.month - 1, 1));
    if (monthNumber(picked) === viewNumber) return;
    setView(picked);
    setFocused(picked);
  };
  const yearOptions = React.useMemo(
    () => Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => ({ value: String(yearStart + i), label: labels.yearOption(yearStart + i) })),
    [labels, yearEnd, yearStart],
  );
  const monthOptions = React.useMemo(() => Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: labels.monthOption(i + 1) })), [labels]);

  // ── 커밋 뒤 — 스크롤 요청을 먼저(그 날이 그려진 뒤) 그다음 초점 ──
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && scrollRequestRef.current !== null) {
      userScrollRef.current = false;
      el.scrollTop = scrollRequestRef.current;
      scrollRequestRef.current = null;
    }
    if (!focusRequestRef.current) return;
    focusRequestRef.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-date="${dayKey(focused)}"]`)?.focus({ preventScroll: true });
  });

  // 처음 그릴 때 — 이어지는 달은 보일 달을 맨 위로
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!continuous || !el) return;
    el.scrollTop = scrollTopRef.current;
    setViewport(el.clientHeight);
    const observer = new ResizeObserver(() => setViewport(el.clientHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [continuous]);

  // autoFocus — 처음 그릴 때만. 시트 · 팝오버가 처음 초점을 둔 뒤 그리기 전에(바깥 표면의 effect 가 나중에 돈다 — 그다음 차례).
  // 지금 값은 ref 로 읽는다
  const autoFocusRef = React.useRef(autoFocus);
  const focusedRef = React.useRef(focused);
  const revealRef = React.useRef(revealTop);
  React.useLayoutEffect(() => {
    focusedRef.current = focused;
    revealRef.current = revealTop;
  });
  React.useEffect(() => {
    if (!autoFocusRef.current) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const target = focusedRef.current;
      const el = scrollRef.current;
      if (el) {
        const top = Math.max(0, revealRef.current(target, el.scrollTop, el.clientHeight));
        if (top !== el.scrollTop) {
          el.scrollTop = top;
          scrollTopRef.current = top;
          setScrollTop(top);
        }
      }
      rootRef.current?.querySelector<HTMLElement>(`[data-date="${dayKey(target)}"]`)?.focus({ preventScroll: true });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 이어지는 달 스크롤 — 그릴 달을 고르고, 손으로 스크롤해 맨 위 달이 바뀌면 그 달 1일이 Tab 자리
  const frameRef = React.useRef<number | null>(null);
  const viewRef = React.useRef(view);
  React.useLayoutEffect(() => {
    viewRef.current = view;
  });
  const onContinuousScroll = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const el = scrollRef.current;
      if (!el) return;
      const top = el.scrollTop;
      scrollTopRef.current = top;
      setScrollTop(top);
      if (!userScrollRef.current) return;
      const index = monthAt(layout.offsets, layout.heights, top);
      const month = fromMonthNumber(firstMonth + index);
      if (monthNumber(month) !== monthNumber(viewRef.current)) {
        setView(month);
        setFocused(month);
      }
    });
  };
  React.useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);
  const markUserScroll = () => {
    userScrollRef.current = true;
  };

  // ── 그리기 ──
  const multiselectable = selection !== "single" || undefined;
  const liveText = twoMonths
    ? `${labels.month(view.getFullYear(), view.getMonth() + 1)}~${labels.month(fromMonthNumber(viewNumber + 1).getFullYear(), fromMonthNumber(viewNumber + 1).getMonth() + 1)}`
    : labels.month(view.getFullYear(), view.getMonth() + 1);

  const weekdayHeader = (hidden: boolean) => (
    <div role="row" className={hidden ? "sr-only" : WEEKDAY_ROW}>
      {labels.weekdays.map((w, i) => (
        <div key={i} role="columnheader" aria-label={labels.weekdaysLong[i]} className={WEEKDAY}>
          <span aria-hidden>{w}</span>
        </div>
      ))}
    </div>
  );

  const renderDay = (d: Date) => {
    const s = cellState(d);
    const band = s.complete && !sameDay(rangeStart, rangeEnd) ? (s.rangeStart ? "start" : s.rangeEnd ? "end" : s.inRange ? "middle" : null) : null;
    const tone = s.readOnly ? "readOnly" : s.selected ? "selected" : s.disabled ? "disabled" : s.inRange ? "inRange" : s.today ? "today" : "enabled";
    // 호버 · 누름 — 보통 날은 bg-neutral-weak-alpha-pressed, 오늘 · 기간 사이 날은 한 단계 짙게. 고른 날 · 막힌 날 · 읽기 전용에는 없다
    const press = tone === "enabled" ? DAY_PRESS : tone === "today" || tone === "inRange" ? DAY_PRESS_ON_WEAK : null;
    // 미완성 기간의 시작은 막힌 날이어도 취소선을 긋지 않는다
    const strike = s.disabled && !s.readOnly && !(s.rangeStart && !s.complete);
    const name = s.readOnly ? `${labels.day(d)}, ${labels.readOnlyRangeStart}` : labels.day(d);
    return (
      <div
        key={dayKey(d)}
        role="gridcell"
        aria-selected={s.selected || s.inRange || undefined}
        data-band={band ?? undefined}
        className={cn(CELL, band && BAND, band && BAND_SIDE[band])}
      >
        <button
          type="button"
          tabIndex={sameDay(d, focused) ? 0 : -1}
          aria-label={name}
          aria-current={s.today ? "date" : undefined}
          aria-disabled={s.disabled || s.readOnly || undefined}
          data-date={dayKey(d)}
          data-today={s.today || undefined}
          data-selected={s.selected || undefined}
          data-in-range={s.inRange || undefined}
          data-disabled={s.disabled || undefined}
          data-readonly={s.readOnly || undefined}
          className={cn(DAY, DAY_STATE[tone], press, s.today && DAY_TODAY_WEIGHT, s.selected && s.disabled && "cursor-not-allowed")}
          onClick={() => selectDate(d)}
          onFocus={() => {
            if (!sameDay(d, focused)) setFocused(d);
          }}
          onKeyDown={(e) => onDayKeyDown(e, d)}
        >
          <span data-slot="date-picker-day" className={cn(strike && DAY_STRIKE)}>
            {d.getDate()}
          </span>
        </button>
      </div>
    );
  };

  // 한 달 — fixed 는 늘 6주(앞뒤 달은 흐리게), natural 은 그 달의 주 수(앞뒤 달은 비운다)
  const renderGrid = (month: Date, mode: "fixed" | "natural", labelledBy: string) => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = weekStart(new Date(y, m, 1));
    const weeks = mode === "fixed" ? 6 : weeksInMonth(y, m);
    return (
      <div role="grid" aria-labelledby={labelledBy} aria-multiselectable={multiselectable} data-month={`${y}-${pad2(m + 1)}`} className={GRID}>
        {weekdayHeader(mode === "natural")}
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} role="row" className={WEEK}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = addDays(first, w * 7 + i);
              if (d.getMonth() === m) return renderDay(d);
              return (
                <div key={dayKey(d)} role="gridcell" data-outside="" className={CELL}>
                  {mode === "fixed" && (
                    <span aria-hidden data-slot="date-picker-outside" className={OUTSIDE}>
                      {d.getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const prevButton = (extra?: string) => (
    <Button
      variant="ghost"
      size="medium"
      layout="iconOnly"
      aria-label={labels.previousMonth}
      data-slot="date-picker-previous"
      disabled={!canPrev}
      className={cn(NAV_PX, extra)}
      onClick={() => step(-1)}
    >
      <ChevronLeft aria-hidden />
    </Button>
  );
  const nextButton = (extra?: string) => (
    <Button
      variant="ghost"
      size="medium"
      layout="iconOnly"
      aria-label={labels.nextMonth}
      data-slot="date-picker-next"
      disabled={!canNext}
      className={cn(NAV_PX, extra)}
      onClick={() => step(1)}
    >
      <ChevronRight aria-hidden />
    </Button>
  );

  const layoutOfPresets = presetsLayout ?? (continuous ? "scroll" : "wrap");
  const presetRow = presetList.length > 0 && (
    <ChipRadioGroup
      aria-label={labels.presets}
      data-slot="date-picker-presets"
      layout={layoutOfPresets}
      bleed={layoutOfPresets === "scroll"}
      value={activePreset ?? ""}
      onValueChange={choosePreset}
      className={PRESETS}
    >
      {presetList.map((name) => (
        <ChipRadio key={name} variant="outlineStrong" size="medium" value={name} disabled={!presetAvailable(name)}>
          {labels.presetNames[name]}
        </ChipRadio>
      ))}
    </ChipRadioGroup>
  );

  // 이어지는 달 — 보이는 달 ± 2달(Tab 자리의 달은 늘)
  let body: React.ReactNode;
  if (continuous) {
    const height = Math.max(viewport, ROW_HEIGHT * 8);
    const topIndex = monthAt(layout.offsets, layout.heights, scrollTop);
    const bottomIndex = monthAt(layout.offsets, layout.heights, scrollTop + height);
    const focusIndex = monthNumber(focused) - firstMonth;
    const from = Math.max(0, Math.min(topIndex - CONTINUOUS_OVERSCAN, focusIndex));
    const to = Math.min(monthCount - 1, Math.max(bottomIndex + CONTINUOUS_OVERSCAN, focusIndex));
    const topSpace = layout.offsets[from] ?? 0;
    const bottomSpace = layout.total - ((layout.offsets[to] ?? 0) + (layout.heights[to] ?? 0));
    body = (
      <div
        ref={scrollRef}
        data-slot="date-picker-scroll"
        className={CONTINUOUS_SCROLL}
        onScroll={onContinuousScroll}
        onWheel={markUserScroll}
        onTouchStart={markUserScroll}
        onPointerDown={markUserScroll}
      >
        <div aria-hidden className={CONTINUOUS_WEEKDAYS}>
          {labels.weekdays.map((w, i) => (
            <div key={i} className={WEEKDAY}>
              {w}
            </div>
          ))}
        </div>
        <div aria-hidden style={{ height: topSpace }} />
        {Array.from({ length: to - from + 1 }, (_, k) => {
          const month = fromMonthNumber(firstMonth + from + k);
          const labelId = monthLabelId(month);
          return (
            <div key={monthNumber(month)} data-slot="date-picker-month" className={CONTINUOUS_MONTH}>
              <div id={labelId} className={CONTINUOUS_MONTH_NAME}>
                {labels.month(month.getFullYear(), month.getMonth() + 1)}
              </div>
              {renderGrid(month, "natural", labelId)}
            </div>
          );
        })}
        <div aria-hidden style={{ height: bottomSpace }} />
        <div aria-hidden data-slot="date-picker-fog" className={FOG} />
      </div>
    );
  } else if (twoMonths) {
    body = (
      <div className={TWO_MONTHS}>
        {visibleMonths(view).map((month, i) => {
          const labelId = monthLabelId(month);
          return (
            <div key={monthNumber(month)} data-slot="date-picker-month" className="min-w-0">
              <div className={TWO_MONTHS_HEADER}>
                <span id={labelId} className={MONTH_NAME}>
                  {labels.month(month.getFullYear(), month.getMonth() + 1)}
                </span>
                {i === 0 ? prevButton(NAV_START) : nextButton(NAV_END)}
              </div>
              {renderGrid(month, "fixed", labelId)}
            </div>
          );
        })}
      </div>
    );
  } else {
    body = (
      <>
        <div data-slot="date-picker-header" className={HEADER}>
          <button
            type="button"
            id={titleId}
            aria-expanded={wheelOpen}
            aria-controls={wheelOpen ? wheelId : undefined}
            data-slot="date-picker-title"
            className={TITLE}
            onClick={toggleWheel}
          >
            <span className="truncate">{labels.month(view.getFullYear(), view.getMonth() + 1)}</span>
            <ChevronDown aria-hidden strokeWidth={2} className={cn(TITLE_ICON, wheelOpen && "rotate-180")} />
          </button>
          <div className={NAV}>
            {prevButton()}
            {nextButton()}
          </div>
        </div>
        {wheelOpen ? (
          <div id={wheelId} data-slot="date-picker-wheel" className={WHEEL}>
            <WheelPicker size="medium" visibleItems={7} aria-label={labels.month(wheel.year, wheel.month)}>
              <WheelPickerColumn
                aria-label={labels.yearWheel}
                className={WHEEL_YEAR}
                align="right"
                options={yearOptions}
                value={String(wheel.year)}
                onValueChange={(year) => setWheel((w) => ({ ...w, year: Number(year) }))}
              />
              <WheelPickerColumn
                aria-label={labels.monthWheel}
                className={WHEEL_MONTH}
                align="left"
                loop
                options={monthOptions}
                value={String(wheel.month)}
                onValueChange={(month) => setWheel((w) => ({ ...w, month: Number(month) }))}
              />
            </WheelPicker>
          </div>
        ) : (
          renderGrid(view, "fixed", titleId)
        )}
      </>
    );
  }

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      role="group"
      aria-label={ariaLabelledBy ? ariaLabel : (ariaLabel ?? labels.root)}
      aria-labelledby={ariaLabelledBy}
      data-slot="date-picker"
      data-selection={selection}
      data-visible-range={visibleRange}
      className={cn(ROOT, ROOT_SIZE[visibleRange], className)}
      {...rest}
    >
      {presetRow}
      {body}
      <span aria-live="polite" aria-atomic="true" data-slot="date-picker-live" className={LIVE}>
        {liveText}
      </span>
    </div>
  );
});
DatePicker.displayName = "DatePicker";

export { DatePicker };
