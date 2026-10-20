import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useField, useFieldControl } from "@/components/ui/field";
import { inputButtonSurfaceVariants, inputButtonVariants } from "@/components/ui/input-button";

/*
 * Groo Select — 구조는 SEED Select(2026-10-01). 수치 원본은 specs/components/select.yaml.
 *
 *   Select        트리거(button role=combobox) + 칸 아래 목록(role=listbox). 하나 고르기(기본) · 여럿 고르기(multiple)
 *   SelectGroup   묶음 — 제목(label)은 없어도 된다. 묶음이 둘 이상이면 사이에 선을 저절로 그린다
 *   SelectItem    선택지 — value · label(글) · description(한 줄 설명) · prefixIcon · disabled
 *
 * 선택지는 Select 의 자식으로 바로 적는다 — Select 가 자식(SelectGroup · SelectItem, Fragment · 배열 · 감싼 요소의
 * children 까지)을 읽어 목록을 직접 그린다. 그래서 목록이 닫혀 있어도 트리거 글 · 앞 아이콘 · 글자로 찾기가 선택지의
 * 글을 안다. 선택지를 돌려주는 컴포넌트(<MyItems />)로 감싸면 읽지 못한다 — map 이나 Fragment 로 적는다.
 * 묶음 밖에 이어 적은 선택지는 제목 없는 한 묶음이 된다. 묶음 안의 묶음은 바깥 묶음에 잇는다. SelectGroup · SelectItem 은
 * Select 밖에서는 아무것도 그리지 않는다. Radix Select 는 여럿 고르기를 받지 않아 Radix Popover 위에 목록을 직접 짰다.
 *
 * 트리거는 Input Button 과 같은 상자다(inputButtonVariants · inputButtonSurfaceVariants) — 투명 바탕 + 안쪽 1px,
 * 누르면 바탕 + 콘텐츠만 2px 거리 축소(기준 max(높이, 폭 ÷ 4, 24) 를 누르는 순간 잰다), 키보드 포커스에만 링,
 * 오류 안쪽 2px, 비활성 · 읽기 전용은 회색 바탕. 이름은 Field 의 라벨(<label for>, 없으면 aria-label)이고 고른 글은
 * combobox 의 값으로 읽힌다. 읽기 전용은 포커스는 되고 열리지 않는다(누르기 · 키 · 글자로 찾기 모두).
 * 트리거 글: 하나면 그 글, 여럿이면 고른 순서대로 ", " 로 잇고 칸 폭을 넘으면 "첫 값 외 N개"(formatValue 로 바꾼다).
 * 트리거 앞 아이콘: 하나를 골랐고 그 선택지에 아이콘이 있으면 그 아이콘, 아니면 Select 의 prefixIcon.
 *
 * 목록은 트리거 폭 그대로 아래 8(모자라면 위)에 붙고 화면 가장자리와 8 을 둔다. 높이는 min(480, 남은 화면) — 남은 화면이
 * 200 보다 좁아도 200 은 둔다. listMaxHeight 를 주면 480 대신 그 값이다(Table Pagination 의 범위 목록 240 — SEED).
 * 열면 DOM 포커스가 목록으로 가고 짚은 선택지는 aria-activedescendant 로 알린다.
 * 포인터로 열면 짚지 않고 고른 선택지가 보이게 스크롤만, 키(↓ ↑ Enter Space)로 열면 고른 선택지(없으면 첫 선택지)를 짚는다.
 * 짚은 선택지 · 누르는 선택지는 좌우 8 들인 알약(SEED 그대로 — 키보드 위치도 같은 알약), 누르는 동안만 콘텐츠가 준다.
 * 마우스는 호버로 짚고, 터치는 짚지 않는다(손가락 아래 미리 칠한 알약은 눌린 채 멈춘 것처럼 보인다 — SEED).
 * 하나 고르기는 고르면 닫히고(다시 눌러도 풀리지 않는다), 여럿 고르기는 열린 채 고르거나 푼다(고른 순서를 지킨다).
 * Esc · 바깥 누르기 · Tab 은 닫는다 — Esc · 고르기로 닫으면 트리거로 포커스가 돌아오고, Tab 은 트리거 다음(Shift 는 앞) 칸으로 간다.
 * 닫힌 트리거에서 글자 키는 하나 고르기면 그 글자로 시작하는 다음 선택지로 값을 바로 바꾼다(열지 않는다 — 네이티브 select).
 * 휠 스크롤은 목록 안에서 멈춘다 — 대화상자 · 시트 안에서 열었을 때 그 표면의 스크롤 잠금(문서에 건다)이 목록의 휠을 막지 않게
 * (Popover 와 같다).
 * name 을 주면 고른 값마다 hidden input 을 둔다(비활성이면 보내지 않는다).
 */

// ── 크기 ─────────────────────────────────────────────────────
// 트리거는 Input Button 의 크기를 그대로 쓰고, 목록 안은 여기서 — Tailwind 는 소스의 글자 그대로를 읽으므로 세 크기를 다 적는다
const SIZES = {
  large: {
    item: "py-x3",
    itemContent: "gap-x3",
    itemIcon: "[&>svg]:size-[22px]",
    itemLabel: "text-t5",
    itemDescription: "text-t3",
    indicator: "size-[14px]",
    groupLabel: "py-x2_5 text-t4 font-medium",
  },
  medium: {
    item: "py-x2_5",
    itemContent: "gap-x2",
    itemIcon: "[&>svg]:size-[18px]",
    itemLabel: "text-t4",
    itemDescription: "text-t2",
    indicator: "size-[12px]",
    groupLabel: "py-x2 text-t3 font-normal",
  },
  responsive: {
    item: "py-x3 lg:py-x2_5",
    itemContent: "gap-x3 lg:gap-x2",
    itemIcon: "[&>svg]:size-[22px] lg:[&>svg]:size-[18px]",
    itemLabel: "text-t5 lg:text-t4",
    itemDescription: "text-t3 lg:text-t2",
    indicator: "size-[14px] lg:size-[12px]",
    groupLabel: "py-x2_5 text-t4 font-medium lg:py-x2 lg:text-t3 lg:font-normal",
  },
} as const;

// 트리거의 콘텐츠 층 — 앞 아이콘 · 값 · 셰브론. 트리거를 누르는 동안만 준다(테두리 · 바탕은 그대로)
const TRIGGER_CONTENT =
  "relative flex min-w-0 flex-1 items-center gap-[inherit] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const TRIGGER_CONTENT_PRESS =
  "group-active/select-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/select-trigger:[scale:1]";

// 셰브론 — 열 때 150ms · 닫을 때 100ms 로 돈다(바뀐 쪽의 transition 이 걸린다)
const CHEVRON_OPEN = "rotate-180 [transition:rotate_var(--motion-duration-d3)_var(--motion-ease-easing)]";
const CHEVRON_CLOSED = "rotate-0 [transition:rotate_var(--motion-duration-d2)_var(--motion-ease-easing)]";

// 목록 — 트리거 폭 · 모서리 20 · 떠 있는 바탕 + s3. 열 때 150ms enter · 닫을 때 100ms exit 로 0.95 ↔ 1 · 투명도, 붙은 쪽에서 커진다.
// 모션 줄이기면 투명도만(크기는 motion-safe 에서만)
const CONTENT = [
  "z-(--z-floating) w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-r5 bg-bg-layer-floating font-sans shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");

// 스크롤 자리 — 위아래 8 · 묶음 사이 8. 높이는 min(480, max(200, 남은 화면)) — 자리를 재기 전에는 480. 480 은 listMaxHeight 가 바꾼다
const SCROLL =
  "relative flex max-h-[min(var(--select-list-max-height,480px),max(200px,var(--radix-popover-content-available-height,480px)))] flex-col gap-x2 overflow-y-auto py-x2";

// 묶음 — 둘째 묶음부터 위에 1px 선(좌우 16 들임 · 아래 8). 위쪽 8 은 스크롤 자리의 gap — 묶음 사이 8 + 1 + 8 = 17
const GROUP =
  "flex flex-col [[data-select-group]+&]:before:mx-x4 [[data-select-group]+&]:before:mb-x2 [[data-select-group]+&]:before:h-px [[data-select-group]+&]:before:bg-stroke-neutral-subtle [[data-select-group]+&]:before:content-['']";

// 선택지 — 줄은 그대로, 알약(바탕 층)이 좌우 8 들어오며 칠해지고 콘텐츠 층만 누르는 동안 준다
const ITEM = "group/select-item relative flex cursor-pointer select-none items-center px-x4 scroll-my-x2";
const PILL =
  "pointer-events-none absolute inset-y-0 rounded-r3 [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const PILL_OFF = "inset-x-0 bg-transparent";
const PILL_ON = "inset-x-x2 bg-bg-layer-floating-pressed";
const PILL_PRESS = "group-active/select-item:inset-x-x2 group-active/select-item:bg-bg-layer-floating-pressed";
const ITEM_CONTENT =
  "relative flex min-w-0 flex-1 items-center [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS =
  "group-active/select-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/select-item:[scale:1]";

// ── 선택지 · 묶음(표시만 — Select 가 읽어 그린다) ──────────────
export interface SelectItemProps {
  value: string;
  /** 선택지 글 — 명사형으로 짧게. 트리거 · 글자로 찾기가 이 글을 쓴다 */
  label: string;
  /** 한 줄 설명 — 목록에만 보인다(트리거에는 없다) */
  description?: string;
  /** 앞 아이콘 — 묶음 안에서 모두 두거나 모두 뺀다. 하나를 고르면 트리거의 아이콘이 된다 */
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectGroupProps {
  /** 묶음 제목 — 없어도 된다 */
  label?: string;
  children?: React.ReactNode;
}

function SelectItem(_props: SelectItemProps): React.ReactElement | null {
  return null;
}
SelectItem.displayName = "SelectItem";

function SelectGroup(_props: SelectGroupProps): React.ReactElement | null {
  return null;
}
SelectGroup.displayName = "SelectGroup";

type GroupData = { label?: string; items: SelectItemProps[] };

// 자식을 읽어 묶음 목록을 만든다 — 묶음 밖에 이어 적은 선택지는 제목 없는 한 묶음, 빈 묶음은 버린다
function collectGroups(children: React.ReactNode): GroupData[] {
  const groups: GroupData[] = [];
  let loose: GroupData | null = null;
  const walk = (node: React.ReactNode, group: GroupData | null) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.type === SelectItem) {
        const item = child.props as SelectItemProps;
        if (group) {
          group.items.push(item);
        } else {
          if (!loose) {
            loose = { items: [] };
            groups.push(loose);
          }
          loose.items.push(item);
        }
      } else if (child.type === SelectGroup) {
        const { label, children: groupChildren } = child.props as SelectGroupProps;
        if (group) {
          walk(groupChildren, group);
          return;
        }
        loose = null;
        const next: GroupData = { label, items: [] };
        groups.push(next);
        walk(groupChildren, next);
      } else {
        walk((child.props as { children?: React.ReactNode }).children, group);
      }
    });
  };
  walk(children, null);
  return groups.filter((g) => g.items.length > 0);
}

// 글자로 찾기 — 지금 짚은 것 다음부터 그 글자로 시작하는 선택지(같은 글자를 거듭 치면 돌아가며). Radix 와 같은 규칙
function nextMatch(items: SelectItemProps[], search: string, current: string | undefined) {
  const chars = Array.from(search);
  const repeated = chars.length > 1 && chars.every((c) => c === chars[0]);
  const query = (repeated ? chars[0] : search).toLocaleLowerCase();
  const start = Math.max(
    items.findIndex((i) => i.value === current),
    0,
  );
  let ordered = [...items.slice(start), ...items.slice(0, start)];
  if (Array.from(query).length === 1) ordered = ordered.filter((i) => i.value !== current);
  const found = ordered.find((i) => i.label.toLocaleLowerCase().startsWith(query));
  return found && found.value !== current ? found : undefined;
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useControllable<T>(prop: T | undefined, defaultProp: T, onChange?: (value: T) => void): [T, (value: T) => void] {
  const [inner, setInner] = React.useState(defaultProp);
  const controlled = prop !== undefined;
  const value = controlled ? (prop as T) : inner;
  const set = (next: T) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  return [value, set];
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

const isPrintable = (e: React.KeyboardEvent) => e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

// ── Select ───────────────────────────────────────────────────
type SelectBaseProps = {
  /** 고르기 전의 글 — "{값의 종류} 선택"("결제 수단 선택"). 마침표 없이 */
  placeholder?: string;
  /** 트리거 앞 아이콘 — 하나를 골랐고 그 선택지에 아이콘이 있으면 그 아이콘으로 바뀐다 */
  prefixIcon?: React.ReactNode;
  /** large(트리거 52 · 선택지 46) · medium(40 · 39, 1280 이상 데스크톱 웹만) · responsive(웹 기본 — 1280 에서 바뀐다). 앱은 large */
  size?: "large" | "medium" | "responsive";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 트리거 글을 바꾼다 — 고른 순서대로 받는다. 기본은 ", " 로 잇고 넘치면 "첫 값 외 N개" */
  formatValue?: (selected: { value: string; label: string }[]) => string;
  /** 폼으로 보낼 이름 — 고른 값마다 hidden input */
  name?: string;
  /** 트리거의 id — Field 안이면 Field 가 준다 */
  id?: string;
  disabled?: boolean;
  /** 읽기 전용 — 포커스는 되고 열리지 않는다 */
  readOnly?: boolean;
  /** 열린 목록의 최대 높이 px — 기본 480. Table Pagination 의 범위 목록만 240(SEED)을 준다 */
  listMaxHeight?: number;
  /** 트리거(button)의 className */
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
};

export type SelectSingleProps = SelectBaseProps & {
  multiple?: false;
  /** 고른 값 — 고르지 않았으면 ""(제어) */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type SelectMultipleProps = SelectBaseProps & {
  multiple: true;
  /** 고른 값 — 고른 순서대로 */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;

type Highlight = { value: string; keyboard: boolean } | null;

const Select = React.forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const { placeholder, prefixIcon, size = "responsive", open: openProp, defaultOpen = false, onOpenChange, formatValue, name, className, listMaxHeight, children } = props;
  const multiple = props.multiple === true;
  const sizes = SIZES[size];
  const field = useField();
  const control = useFieldControl({
    id: props.id,
    disabled: props.disabled,
    readOnly: props.readOnly,
    "aria-invalid": props["aria-invalid"],
    "aria-required": props["aria-required"],
    "aria-describedby": props["aria-describedby"],
  });
  const disabled = !!control.disabled;
  const readOnly = !!control.readOnly;
  const invalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
  const interactive = !disabled && !readOnly;
  const baseId = React.useId();

  // 선택지
  const groups = React.useMemo(() => collectGroups(children), [children]);
  const items = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const enabledItems = React.useMemo(() => items.filter((i) => !i.disabled), [items]);
  const indexOf = React.useMemo(() => new Map(items.map((item, i) => [item.value, i])), [items]);
  const optionId = (value: string) => `${baseId}option${indexOf.get(value)}`;

  // 값 — 안에서는 늘 고른 순서의 배열
  const singleProp = props.multiple ? undefined : props.value;
  const multiProp = props.multiple ? props.value : undefined;
  const valueProp = React.useMemo<string[] | undefined>(
    () => (multiple ? multiProp : singleProp === undefined ? undefined : singleProp === "" ? [] : [singleProp]),
    [multiple, singleProp, multiProp],
  );
  const [values, setValues] = useControllable<string[]>(
    valueProp,
    props.multiple ? (props.defaultValue ?? []) : props.defaultValue ? [props.defaultValue] : [],
    (next) => {
      if (props.multiple) props.onValueChange?.(next);
      else props.onValueChange?.(next[0] ?? "");
    },
  );
  const selectedItems = values.flatMap((v) => {
    const i = indexOf.get(v);
    return i === undefined ? [] : [items[i]];
  });

  // 열림 · 짚은 선택지
  const [open, setOpenState] = useControllable<boolean>(openProp, defaultOpen, onOpenChange);
  const [highlight, setHighlight] = React.useState<Highlight>(null);
  const anchorRef = React.useRef<string | null>(null); // 마지막으로 짚었던 선택지 — 짚은 것이 없을 때 화살표의 출발점
  const skipReturnFocusRef = React.useRef(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef("");
  const searchTimerRef = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(searchTimerRef.current), []);

  const setOpen = (next: boolean) => {
    if (next === open || (next && !interactive)) return;
    if (!next) {
      setHighlight(null);
      searchRef.current = "";
    }
    setOpenState(next);
  };

  // 열린 채 막히면 닫는다
  React.useEffect(() => {
    if (open && !interactive) setOpen(false);
  }, [open, interactive]);

  const openWith = (mode: "pointer" | "keyboard") => {
    if (!interactive) return;
    skipReturnFocusRef.current = false;
    if (mode === "keyboard") {
      const start = enabledItems.find((i) => values.includes(i.value)) ?? enabledItems[0];
      anchorRef.current = start?.value ?? null;
      setHighlight(start ? { value: start.value, keyboard: true } : null);
    } else {
      anchorRef.current = null;
      setHighlight(null);
    }
    setOpen(true);
  };

  // 목록 안에서 짚은 선택지가 보이게 — 스크롤 자리만 움직인다(페이지는 그대로). 위아래 8 은 scroll-margin
  const scrollToItem = (value: string) => {
    const area = scrollRef.current;
    const el = area && indexOf.has(value) ? area.ownerDocument.getElementById(optionId(value)) : null;
    if (!area || !el) return;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const top = el.offsetTop - margin;
    const bottom = el.offsetTop + el.offsetHeight + margin;
    if (top < area.scrollTop) area.scrollTop = top;
    else if (bottom > area.scrollTop + area.clientHeight) area.scrollTop = bottom - area.clientHeight;
  };

  const highlightItem = (item: SelectItemProps | undefined) => {
    if (!item) return;
    anchorRef.current = item.value;
    setHighlight({ value: item.value, keyboard: true });
    scrollToItem(item.value);
  };

  const choose = (value: string) => {
    const index = indexOf.get(value);
    const item = index === undefined ? undefined : items[index];
    if (!item || item.disabled) return;
    if (multiple) {
      setValues(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
    } else {
      if (values.length !== 1 || values[0] !== value) setValues([value]);
      setOpen(false);
    }
  };

  const typeahead = (key: string, current: string | undefined) => {
    const search = searchRef.current + key;
    searchRef.current = search;
    window.clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(() => {
      searchRef.current = "";
    }, 500);
    return nextMatch(enabledItems, search, current);
  };

  // ── 트리거 ──
  const onTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Radix 의 열고 닫기 대신 여기서 — 포인터로 열면 짚지 않는다. 화면 읽기 프로그램의 누르기(detail 0)는 키처럼 짚는다
    e.preventDefault();
    if (!interactive) return;
    if (open) setOpen(false);
    else openWith(e.detail === 0 ? "keyboard" : "pointer");
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") measurePress(e.currentTarget);
    if (!interactive || e.altKey || e.ctrlKey || e.metaKey) return;
    const typing = searchRef.current !== "";
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || (e.key === " " && !typing)) {
      e.preventDefault();
      openWith("keyboard");
      return;
    }
    // 닫힌 채 글자 키 — 하나 고르기면 값을 바로 바꾼다(열지 않는다)
    if (!multiple && isPrintable(e)) {
      e.preventDefault();
      const match = typeahead(e.key, values[0]);
      if (match && match.value !== values[0]) setValues([match.value]);
    }
  };

  // ── 목록 ──
  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open || e.altKey || e.ctrlKey || e.metaKey) return;
    const index = highlight ? enabledItems.findIndex((i) => i.value === highlight.value) : -1;
    // 짚은 것이 없으면 마지막으로 짚었던 것 → 고른 것 → 처음 · 끝에서 시작한다
    const start = (edge: "first" | "last") =>
      enabledItems.find((i) => i.value === anchorRef.current) ??
      enabledItems.find((i) => values.includes(i.value)) ??
      (edge === "first" ? enabledItems[0] : enabledItems[enabledItems.length - 1]);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlightItem(index < 0 ? start("first") : enabledItems[Math.min(index + 1, enabledItems.length - 1)]);
        return;
      case "ArrowUp":
        e.preventDefault();
        highlightItem(index < 0 ? start("last") : enabledItems[Math.max(index - 1, 0)]);
        return;
      case "Home":
        e.preventDefault();
        highlightItem(enabledItems[0]);
        return;
      case "End":
        e.preventDefault();
        highlightItem(enabledItems[enabledItems.length - 1]);
        return;
      case "Tab":
        // 트리거로 포커스를 옮겨 두면 브라우저의 Tab 이 트리거 다음(Shift 는 앞) 칸으로 간다 — 목록은 body 끝에 있다
        skipReturnFocusRef.current = true;
        triggerRef.current?.focus();
        setOpen(false);
        return;
    }
    const typing = searchRef.current !== "";
    if (e.key === "Enter" || (e.key === " " && !typing)) {
      e.preventDefault();
      if (highlight) choose(highlight.value);
      else setOpen(false);
      return;
    }
    if (isPrintable(e)) {
      e.preventDefault();
      highlightItem(typeahead(e.key, highlight?.value));
    }
  };

  // ── 트리거 글 · 아이콘 ──
  const valueBoxRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = React.useState(false);
  const joined = selectedItems.map((i) => i.label).join(", ");
  const measure = multiple && !formatValue && selectedItems.length > 1;
  // 여럿 고른 글이 칸에 다 들어가는지 — 숨긴 한 줄 글의 폭을 칸 폭과 견준다(폭 · 글꼴이 바뀌면 다시)
  useIsoLayoutEffect(() => {
    const box = valueBoxRef.current;
    const full = measureRef.current;
    if (!measure || !box || !full) {
      setOverflow(false);
      return;
    }
    const check = () => setOverflow(full.getBoundingClientRect().width > box.getBoundingClientRect().width);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(box);
    observer.observe(full);
    return () => observer.disconnect();
  }, [measure, joined]);

  let text: string | undefined;
  if (selectedItems.length > 0) {
    if (formatValue) text = formatValue(selectedItems.map(({ value, label }) => ({ value, label })));
    else if (selectedItems.length === 1) text = selectedItems[0].label;
    else text = overflow ? `${selectedItems[0].label} 외 ${selectedItems.length - 1}개` : joined;
  }
  const hasValue = text !== undefined;
  const icon = selectedItems.length === 1 && selectedItems[0].prefixIcon != null ? selectedItems[0].prefixIcon : prefixIcon;
  const iconColor = disabled ? "text-fg-disabled" : "text-fg-neutral-muted";
  const valueColor = disabled ? "text-fg-disabled" : hasValue ? "text-fg-neutral" : "text-fg-placeholder";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={mergeRefs(ref, triggerRef)}
          type="button"
          role="combobox"
          id={control.id}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={control["aria-invalid"]}
          aria-required={control["aria-required"]}
          aria-readonly={readOnly || undefined}
          aria-describedby={control["aria-describedby"]}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          disabled={disabled}
          data-slot="select-trigger"
          data-size={size}
          data-invalid={invalid || undefined}
          data-readonly={readOnly || undefined}
          data-placeholder={hasValue ? undefined : ""}
          className={cn(
            "group/select-trigger relative flex w-full min-w-0 items-center text-left",
            inputButtonVariants({ size }),
            inputButtonSurfaceVariants({ state: disabled ? "disabled" : readOnly ? "readonly" : "enabled", hover: "self", invalid }),
            className,
          )}
          onClick={onTriggerClick}
          onKeyDown={onTriggerKeyDown}
          onPointerDown={(e) => measurePress(e.currentTarget)}
        >
          <span data-slot="select-trigger-content" className={cn(TRIGGER_CONTENT, interactive && TRIGGER_CONTENT_PRESS)}>
            {icon != null && (
              <span aria-hidden data-slot="select-prefix-icon" className={cn("flex shrink-0 [&>svg]:size-[var(--input-button-icon)]", iconColor)}>
                {icon}
              </span>
            )}
            <span ref={valueBoxRef} data-slot="select-value" className={cn("relative min-w-0 flex-1 truncate", valueColor)}>
              {hasValue ? text : placeholder}
              {measure && (
                <span ref={measureRef} aria-hidden className="invisible absolute left-0 top-0 whitespace-nowrap">
                  {joined}
                </span>
              )}
            </span>
            <ChevronDown
              aria-hidden
              data-slot="select-chevron"
              className={cn("size-[var(--input-button-icon)] shrink-0", iconColor, open ? CHEVRON_OPEN : CHEVRON_CLOSED)}
            />
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      {name != null && values.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={disabled} />)}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          role="listbox"
          tabIndex={-1}
          aria-multiselectable={multiple || undefined}
          aria-activedescendant={highlight && indexOf.has(highlight.value) ? optionId(highlight.value) : undefined}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"] ?? (props["aria-label"] ? undefined : field?.labelId)}
          data-slot="select-content"
          data-size={size}
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={8}
          className={CONTENT}
          style={listMaxHeight != null ? ({ "--select-list-max-height": `${listMaxHeight}px` } as React.CSSProperties) : undefined}
          onOpenAutoFocus={(e) => {
            // 목록에 포커스 — 짚은 선택지(키로 열었을 때)나 고른 선택지가 보이게 한 프레임 뒤 스크롤한다(자리를 잰 뒤)
            e.preventDefault();
            contentRef.current?.focus({ preventScroll: true });
            const target = highlight?.value ?? items.find((i) => values.includes(i.value))?.value;
            if (target !== undefined) requestAnimationFrame(() => scrollToItem(target));
          }}
          onCloseAutoFocus={(e) => {
            // Tab 으로 닫았으면 브라우저가 옮긴 포커스를 그대로 둔다. 그 밖에는 Radix 가 트리거로 돌린다(바깥을 눌렀으면 그대로)
            if (skipReturnFocusRef.current) {
              e.preventDefault();
              skipReturnFocusRef.current = false;
            }
          }}
          onKeyDown={onListKeyDown}
          // 휠은 목록에서 멈춘다 — 대화상자 안이면 그 스크롤 잠금이 문서에서 휠을 막는다
          onWheel={(e) => e.stopPropagation()}
        >
          <div ref={scrollRef} data-slot="select-scroll" className={SCROLL}>
            {groups.map((group, g) => {
              const labelId = `${baseId}group${g}`;
              return (
                <div
                  key={g}
                  role="group"
                  data-select-group=""
                  data-slot="select-group"
                  aria-labelledby={group.label ? labelId : undefined}
                  className={GROUP}
                >
                  {group.label && (
                    <div role="presentation" id={labelId} data-slot="select-group-label" className={cn("px-x4 text-fg-neutral-subtle", sizes.groupLabel)}>
                      {group.label}
                    </div>
                  )}
                  {group.items.map((item) => {
                    const selected = values.includes(item.value);
                    const itemDisabled = !!item.disabled;
                    const on = !itemDisabled && highlight?.value === item.value;
                    return (
                      <div
                        key={item.value}
                        role="option"
                        id={optionId(item.value)}
                        aria-selected={selected}
                        aria-disabled={itemDisabled || undefined}
                        data-slot="select-item"
                        data-highlighted={on || undefined}
                        data-keyboard={(on && highlight?.keyboard) || undefined}
                        data-selected={selected || undefined}
                        data-disabled={itemDisabled || undefined}
                        className={cn(ITEM, sizes.item, itemDisabled && "cursor-not-allowed")}
                        onPointerDown={(e) => measurePress(e.currentTarget)}
                        // 마우스만 호버로 짚는다 — 터치는 짚지 않는다
                        onPointerMove={(e) => {
                          if (e.pointerType !== "mouse" || itemDisabled || (on && !highlight?.keyboard)) return;
                          anchorRef.current = item.value;
                          setHighlight({ value: item.value, keyboard: false });
                        }}
                        onPointerLeave={(e) => {
                          if (e.pointerType === "mouse" && on && !highlight?.keyboard) setHighlight(null);
                        }}
                        // 눌러도 포커스는 목록에 둔다
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (open && !itemDisabled) choose(item.value);
                        }}
                      >
                        <span aria-hidden className={cn(PILL, on ? PILL_ON : PILL_OFF, !itemDisabled && PILL_PRESS)} />
                        <span className={cn(ITEM_CONTENT, sizes.itemContent, !itemDisabled && ITEM_CONTENT_PRESS)}>
                          {item.prefixIcon != null && (
                            <span aria-hidden className={cn("flex shrink-0", sizes.itemIcon, itemDisabled ? "text-fg-disabled" : "text-fg-neutral")}>
                              {item.prefixIcon}
                            </span>
                          )}
                          <span className="flex min-w-0 flex-1 flex-col items-start gap-x0_5 text-left">
                            <span className={cn("font-normal", sizes.itemLabel, itemDisabled ? "text-fg-disabled" : "text-fg-neutral")}>{item.label}</span>
                            {item.description && (
                              <span className={cn(sizes.itemDescription, itemDisabled ? "text-fg-disabled" : "text-fg-neutral-subtle")}>{item.description}</span>
                            )}
                          </span>
                          {selected && (
                            <Check
                              aria-hidden
                              strokeWidth={2.5}
                              className={cn("shrink-0", sizes.indicator, itemDisabled ? "text-fg-disabled" : "text-fg-neutral")}
                            />
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
Select.displayName = "Select";

export { Select, SelectGroup, SelectItem };
