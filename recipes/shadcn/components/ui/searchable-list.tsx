import * as React from "react";
import { Search, SearchX } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";
import { listHeaderVariants } from "@/components/ui/list";
import { radiomarkDotVariants, radiomarkVariants } from "@/components/ui/radio-group";
import { ResultSection } from "@/components/ui/result-section";
import { Skeleton } from "@/components/ui/skeleton";
import { imageFrameRadius } from "@/components/ui/image-frame";

/*
 * Groo Searchable List — 위 검색칸에 치는 대로 아래 목록이 걸러지고 하나를 고르는 묶음(2026-10-08). 수치 원본은
 * specs/components/searchable-list.yaml(줄 · 검색칸의 나머지 값은 list.yaml · input.yaml).
 * SEED 에는 이 컴포넌트가 없다(Combobox 를 아직 두지 않았다) — 부품마다 SEED 를 따른다: 검색칸은 Text Input 밑줄형, 결과는 List 줄 +
 * 오른쪽 Radiomark, 결과 없음은 Result Section, 키보드는 SEED 문서 사이트 검색 창(초점은 입력칸, 화살표는 강조만 옮긴다).
 * 옛 Searchable List(상자 안 결과 · 제목 13 · 썸네일 44 × 28 · 고른 줄 브랜드 바탕)를 대신한다.
 *
 *   SearchableList          묶음. value · onValueChange(value — 고르면. 시트는 여기서 닫는다) · query · onQueryChange(query — 치는 대로) ·
 *                           onSearch(query — 서버 검색, 마지막 입력 뒤 searchDelay 기본 300ms 에 한 번) · placement "sheet"(기본 —
 *                           Input Button 의 검색 시트 · 팝오버, 고르면 닫힌다) · "inline"(화면 · 단계 안 — 라디오만 바뀐다) ·
 *                           size "responsive"(기본 — 1280 미만 large 40 · 이상 medium 34, 앱은 large)
 *   SearchableListInput     검색칸 — Input variant="underline" 을 스스로 건다(앞 돋보기 · 지우기). placeholder("{무엇} 검색") · aria-label(기본 "검색").
 *                           role="combobox" · aria-expanded · aria-controls · aria-autocomplete="list" · aria-activedescendant(강조한 줄, 없으면 비움).
 *                           ↓ ↑ 강조 · Enter 고름 · Esc 지움(비었으면 시트 · 팝오버를 닫게 둔다). 스스로 초점을 옮기지 않는다 —
 *                           시트 · 팝오버가 열릴 때 focusSearchableList 로 넘겨받는다
 *   SearchableListResults   결과 목록 — role="listbox", aria-label(대상 — "은행")
 *   SearchableListGroup     분류 — label(List Header mediumWeak — 14 · 500 · fg-neutral-subtle), role="group" 의 이름. 줄이 없으면 머리째 숨긴다
 *   SearchableListItem      결과 줄 — role="option" · aria-selected(지금 값). value · title · detail · prefix(Logo Tile 40 · 카드 그림 56 · Avatar).
 *                           오른쪽 라디오(24)는 스스로 그린다(보는 표시 — 보조 기술에 숨긴다)
 *   SearchableListEmpty     0건 — Result Section medium "'{검색어}'에 대한 검색 결과가 없어요"(제목은 검색어로 만든다 · role="status" 로 알린다) · description
 *   SearchableListError     실패 — Result Section failure "검색 결과를 불러오지 못했어요" + "다시 시도"(onRetry) · 0건과 따로
 *   SearchableListSkeleton  불러오는 줄 — rows(기본 5) · prefix "logo" · "cardArt" · "avatar" · "none"(기본). 줄 높이 그대로
 *   focusSearchableList     시트 · 팝오버의 onOpenAutoFocus 에 건다 — 첫 초점을 표면 대신 검색칸에, 지금 값을 가운데로(열린 뒤 다시 옮기지 않는다 —
 *                           2026-10-15 구현 세션 질문 Q-007-3 정리)
 *   matchesSearch           거르는 규칙 — 검색어와 이름 · 별칭을 NFC 로 맞추고 대소문자 · 공백을 무시해, 하나에 들어 있으면 true. 들고 있는 목록 ·
 *                           서버 검색이 같은 규칙이다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-007-1, 안 C). 초성 검색은 아직 정하지 않았다
 *
 * 검색칸: Input 밑줄형(화면에 입력이 하나뿐인 목록 위 검색 — 사용자 결정 17A, 상자형 52 는 고르지 않았다) — 아래 1px stroke-neutral-weak,
 *   치는 동안 2px stroke-neutral-contrast, 모서리 · 좌우 여백 없음. 좌우 24 안에 두어 돋보기와 줄의 앞 붙이개가 한 줄에 선다. 목록이
 *   스크롤해도 위에 붙어 있다(sticky — 바탕은 놓인 자리의 면: 시트 · 팝오버 bg-layer-floating, 화면 · 단계 bg-layer-default). 칸 ↔ 목록 8.
 * 결과 줄: List 의 누르는 줄 — 위아래 12 · 좌우 24, 제목 16 / 22 · 400 · fg-neutral, 설명 13 / 18 · fg-neutral-subtle, 앞 붙이개 ↔ 글 12.
 *   고른 줄의 바탕은 칠하지 않는다 — 오른쪽 라디오만 켠다(채운 원 + 점, radio-group.yaml). 단종처럼 알릴 것은 흐리지 않고 Badge 를 단다.
 * 강조: 화살표로 짚은 줄 · 마우스를 올린 줄이 같은 바탕 — 좌우 6 들어온 bg-layer-default-pressed · 모서리 10(List 의 누름 바탕). 한 번에
 *   한 줄, 초점은 검색칸에 그대로다. 누르면 같은 바탕 + 콘텐츠만 2px 거리 축소(기준 max(높이, 폭 ÷ 4, 24) — 모션 줄이기면 하지 않는다).
 *   마우스 · 누름은 바탕이 좌우 0 → 6 들어오며 모서리 0 → 10 으로 150ms 에 둥글어진다(Menu 알약과 같다 — 2026-10-15 Q-009-3 안 B).
 *   화살표로 옮길 때는 바로 바뀐다(전환 없음). 마우스로 짚은 강조는 포인터가 목록을 떠나면 지운다 — 키보드로 짚은 강조는 남는다
 *   (2026-10-15 사용자 결정 — 구현 세션 질문 Q-007-2, 안 B). 강조한 줄은 붙은 검색칸에 가리지 않게 보이도록 스크롤한다.
 * 키보드(콤보박스 — 사용자 결정 12A): 글자는 거르고 강조를 지운다 · ↓ ↑ 는 한 줄씩(강조가 없으면 ↓ 첫 줄 · ↑ 마지막 줄, 끝에서 멈춘다 —
 *   분류 머리는 건너뛴다) · Enter 는 강조한 줄을 고른다(강조가 없으면 아무것도 하지 않고 폼을 제출하지 않는다) · Esc 는 검색어가 있으면 지우고
 *   (시트 · 팝오버는 그대로) 비었으면 시트 · 팝오버의 Esc 로 닫힌다 · Tab 은 검색칸을 떠난다. 줄은 Tab 으로 들어가지 않는다.
 *   글자를 조합하는 동안(한글 입력)의 화살표 · Enter · Esc 는 조합의 것이다.
 * 서버 검색은 마지막 입력 뒤 300ms 에 한 번 — 글자마다 보내지 않는다. 들고 있는 목록은 onQueryChange 로 바로 거른다.
 * 결과 개수는 알리지 않는다(SEED 문서 검색과 같다) — 0건 · 실패만 Result Section 의 role="status" 가 한 번 알린다.
 */

export type SearchableListPlacement = "sheet" | "inline";
export type SearchableListSize = "large" | "medium" | "responsive";

type HighlightSource = "keyboard" | "pointer";

type SearchableListContextValue = {
  value: string | undefined;
  select: (value: string) => void;
  query: string;
  changeQuery: (query: string) => void;
  placement: SearchableListPlacement;
  size: SearchableListSize;
  listboxId: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  listboxRef: React.MutableRefObject<HTMLElement | null>;
  highlighted: string | null;
  highlightSource: HighlightSource;
  highlight: (id: string | null, source: HighlightSource) => void;
  /** 줄이 빠질 때 — 그 줄이 강조돼 있었으면 강조를 지운다 */
  release: (id: string) => void;
};

const SearchableListContext = React.createContext<SearchableListContextValue | null>(null);

function useSearchableList(name: string) {
  const ctx = React.useContext(SearchableListContext);
  if (!ctx) throw new Error(`${name} 는 SearchableList 안에 둔다.`);
  return ctx;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

// 결과 줄 — 문서 순서대로(분류 머리는 줄이 아니라 건너뛴다)
const optionsOf = (listbox: HTMLElement | null) =>
  listbox ? Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')) : [];

// 스크롤하는 조상 — 시트 본문 · 팝오버 · 화면
function scrollParentOf(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p);
    if ((overflowY === "auto" || overflowY === "scroll") && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}

// 줄이 보이게 스크롤한다 — 위에 붙은 검색칸 아래로(가리지 않게). center 는 처음 열 때 지금 값을 가운데로
function revealOption(option: HTMLElement, field: HTMLElement | null, block: "nearest" | "center") {
  const scroller = scrollParentOf(option);
  if (!scroller) return;
  const box = scroller.getBoundingClientRect();
  const rect = option.getBoundingClientRect();
  const covered = field && scroller.contains(field) ? Math.max(0, field.getBoundingClientRect().bottom - box.top) : 0;
  const top = box.top + covered;
  if (block === "center") {
    scroller.scrollTop += rect.top + rect.height / 2 - (top + (box.bottom - top) / 2);
    return;
  }
  if (rect.top < top) scroller.scrollTop -= top - rect.top;
  else if (rect.bottom > box.bottom) scroller.scrollTop += rect.bottom - box.bottom;
}

// ── 거르는 규칙 ───────────────────────────────────────────────
// NFC 로 맞추고 소문자로 바꾸고 공백을 모두 지운다 — "kx 은행" · "KX은행" · 조합형 한글이 같은 글이 된다
const foldForSearch = (text: string) => text.normalize("NFC").toLowerCase().replace(/\s+/g, "");

/** 거르는 규칙 — 이름 · 별칭 중 하나에 검색어가 들어 있으면 true(빈 검색어는 모두 남긴다). 초성 검색은 하지 않는다 */
export function matchesSearch(query: string, ...names: (string | null | undefined)[]): boolean {
  const q = foldForSearch(query);
  if (q === "") return true;
  return names.some((name) => name != null && foldForSearch(name).includes(q));
}

// ── 첫 초점 ──────────────────────────────────────────────────
/**
 * 시트 · 팝오버의 onOpenAutoFocus 에 건다 — 표면 대신 검색칸에 첫 초점을 주고, 지금 값이 보이게 가운데로 스크롤한다.
 * 열린 뒤 다시 옮기지 않는다(시트가 넘겨주는 한 번뿐이다).
 */
export function focusSearchableList(event: Event) {
  const surface = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  const input = surface?.querySelector<HTMLInputElement>('[data-slot="searchable-list-field"] input');
  if (!surface || !input) return;
  event.preventDefault();
  input.focus({ preventScroll: true });
  const current = surface.querySelector<HTMLElement>('[data-slot="searchable-list-item"][aria-selected="true"]');
  const field = input.closest<HTMLElement>('[data-slot="searchable-list-field"]');
  if (current) revealOption(current, field, "center");
}

// ── 묶음 ─────────────────────────────────────────────────────
export interface SearchableListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  /** 지금 고른 값 — 오른쪽 라디오가 켜진 줄 */
  value?: string;
  defaultValue?: string;
  /** 고르면 — 시트는 여기서 닫는다(placement "sheet") */
  onValueChange?: (value: string) => void;
  /** 검색어(제어) */
  query?: string;
  defaultQuery?: string;
  /** 치는 대로 — 들고 있는 목록은 여기서 바로 거른다 */
  onQueryChange?: (query: string) => void;
  /** 서버 검색 — 마지막 입력 뒤 searchDelay 에 한 번 */
  onSearch?: (query: string) => void;
  /** 서버 검색을 기다리는 시간(ms) — 기본 300 */
  searchDelay?: number;
  /** "sheet"(기본 — 검색 시트 · 팝오버, 고르면 닫힌다) · "inline"(화면 · 단계 안, 라디오만 바뀐다) */
  placement?: SearchableListPlacement;
  /** "responsive"(기본 — 1280 미만 large 40 · 이상 medium 34) · "large"(앱) · "medium" */
  size?: SearchableListSize;
}

const SearchableList = React.forwardRef<HTMLDivElement, SearchableListProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      query: queryProp,
      defaultQuery = "",
      onQueryChange,
      onSearch,
      searchDelay = 300,
      placement = "sheet",
      size = "responsive",
      className,
      ...props
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const [innerQuery, setInnerQuery] = React.useState(defaultQuery);
    const value = valueProp !== undefined ? valueProp : innerValue;
    const query = queryProp !== undefined ? queryProp : innerQuery;
    const [highlighted, setHighlighted] = React.useState<string | null>(null);
    const [highlightSource, setHighlightSource] = React.useState<HighlightSource>("keyboard");
    const listboxId = `${React.useId()}listbox`;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listboxRef = React.useRef<HTMLElement | null>(null);
    const timer = React.useRef<number | undefined>(undefined);
    const latest = React.useRef({ onValueChange, onQueryChange, onSearch, searchDelay, controlledValue: valueProp !== undefined, controlledQuery: queryProp !== undefined });
    React.useLayoutEffect(() => {
      latest.current = { onValueChange, onQueryChange, onSearch, searchDelay, controlledValue: valueProp !== undefined, controlledQuery: queryProp !== undefined };
    });
    React.useEffect(() => () => window.clearTimeout(timer.current), []);

    const select = React.useCallback((next: string) => {
      if (!latest.current.controlledValue) setInnerValue(next);
      latest.current.onValueChange?.(next);
    }, []);

    // 치기 · 지우기 · Esc — 강조는 지우고, 서버 검색은 마지막 입력 뒤 한 번
    const changeQuery = React.useCallback((next: string) => {
      setHighlighted(null);
      if (!latest.current.controlledQuery) setInnerQuery(next);
      latest.current.onQueryChange?.(next);
      if (latest.current.onSearch) {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => latest.current.onSearch?.(next), latest.current.searchDelay);
      }
    }, []);

    const highlight = React.useCallback((id: string | null, source: HighlightSource) => {
      setHighlighted(id);
      setHighlightSource(source);
    }, []);

    // 강조한 줄이 사라지면(걸러짐 · 새 결과) 강조도 지운다 — aria-activedescendant 가 없는 줄을 가리키지 않게. 줄이 빠질 때 알린다
    const highlightedRef = React.useRef<string | null>(null);
    React.useLayoutEffect(() => {
      highlightedRef.current = highlighted;
    });
    const release = React.useCallback((id: string) => {
      if (highlightedRef.current === id) setHighlighted(null);
    }, []);

    const ctx = React.useMemo<SearchableListContextValue>(
      () => ({ value, select, query, changeQuery, placement, size, listboxId, inputRef, listboxRef, highlighted, highlightSource, highlight, release }),
      [value, select, query, changeQuery, placement, size, listboxId, highlighted, highlightSource, highlight, release],
    );

    return (
      <SearchableListContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="searchable-list"
          data-placement={placement}
          className={cn("flex flex-col gap-x2 font-sans", className)}
          {...props}
        />
      </SearchableListContext.Provider>
    );
  },
);
SearchableList.displayName = "SearchableList";

// ── 검색칸 ───────────────────────────────────────────────────
export interface SearchableListInputProps
  extends Omit<InputProps, "variant" | "size" | "prefixIcon" | "clearable" | "value" | "defaultValue" | "onChange" | "type" | "role"> {
  /** 이름 — 기본 "검색"(라벨이 없으니 aria-label) */
  "aria-label"?: string;
}

const SearchableListInput = React.forwardRef<HTMLInputElement, SearchableListInputProps>(
  ({ "aria-label": ariaLabel = "검색", onKeyDown, className, ...props }, ref) => {
    const ctx = useSearchableList("SearchableListInput");
    const fieldRef = React.useRef<HTMLDivElement>(null);
    const queryRef = React.useRef(ctx.query);
    React.useLayoutEffect(() => {
      queryRef.current = ctx.query;
    });
    const { inputRef, changeQuery } = ctx;

    // Esc — 검색어가 있으면 지운다. 시트 · 팝오버(Radix)는 문서에서 먼저 Esc 를 받아 닫으므로 창(window)에서 더 먼저 받아
    // 막아 둔다(막힌 Esc 는 닫지 않는다). 비었으면 그대로 두어 시트 · 팝오버가 닫힌다
    React.useEffect(() => {
      const onEscape = (e: KeyboardEvent) => {
        if (e.key !== "Escape" || e.isComposing || e.target !== inputRef.current || queryRef.current === "") return;
        e.preventDefault();
        changeQuery("");
      };
      window.addEventListener("keydown", onEscape, true);
      return () => window.removeEventListener("keydown", onEscape, true);
    }, [inputRef, changeQuery]);

    const move = (step: 1 | -1) => {
      const options = optionsOf(ctx.listboxRef.current);
      if (options.length === 0) return;
      const at = options.findIndex((o) => o.id === ctx.highlighted);
      const next = at < 0 ? (step === 1 ? 0 : options.length - 1) : Math.min(options.length - 1, Math.max(0, at + step));
      const option = options[next];
      if (!option) return;
      ctx.highlight(option.id, "keyboard");
      revealOption(option, fieldRef.current, "nearest");
    };

    return (
      <div
        ref={fieldRef}
        data-slot="searchable-list-field"
        className={cn("sticky top-0 z-[1] px-x6", ctx.placement === "sheet" ? "bg-bg-layer-floating" : "bg-bg-layer-default")}
      >
        <Input
          ref={mergeRefs(ref, inputRef)}
          variant="underline"
          size={ctx.size}
          prefixIcon={<Search />}
          clearable
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={ctx.listboxId}
          aria-autocomplete="list"
          aria-activedescendant={ctx.highlighted ?? undefined}
          aria-label={ariaLabel}
          autoComplete="off"
          spellCheck={false}
          className={className}
          {...props}
          value={ctx.query}
          onChange={(e) => changeQuery(e.target.value)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            // 글자를 조합하는 동안(한글)의 키는 조합의 것이다
            if (e.defaultPrevented || e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              move(e.key === "ArrowDown" ? 1 : -1);
            } else if (e.key === "Enter") {
              // 강조가 없으면 아무것도 하지 않는다 — 폼을 제출하지 않는다
              e.preventDefault();
              const option = ctx.highlighted ? document.getElementById(ctx.highlighted) : null;
              const value = option?.getAttribute("data-value");
              if (value != null) ctx.select(value);
            }
          }}
        />
      </div>
    );
  },
);
SearchableListInput.displayName = "SearchableListInput";

// ── 결과 ─────────────────────────────────────────────────────
const SearchableListResults = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, onPointerLeave, ...props }, ref) => {
  const ctx = useSearchableList("SearchableListResults");
  return (
    <div
      ref={mergeRefs(ref, ctx.listboxRef as React.MutableRefObject<HTMLDivElement | null>)}
      id={ctx.listboxId}
      role="listbox"
      data-slot="searchable-list-results"
      // 화살표로 옮기는 동안은 바탕 전환을 끈다 — 떠나는 줄도 바로 지워진다
      data-highlight-source={ctx.highlightSource}
      className={cn("flex flex-col", className)}
      // 마우스가 목록을 떠나면 마우스로 짚은 강조를 지운다 — 키보드로 짚은 강조는 남는다
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        if (e.pointerType === "mouse" && ctx.highlightSource === "pointer" && ctx.highlighted) ctx.highlight(null, "pointer");
      }}
      {...props}
    />
  );
});
SearchableListResults.displayName = "SearchableListResults";

export interface SearchableListGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 분류 이름 — "시중은행" · "증권사"(짧은 명사) */
  label: React.ReactNode;
}

const SearchableListGroup = React.forwardRef<HTMLDivElement, SearchableListGroupProps>(({ label, className, children, ...props }, ref) => {
  const labelId = `${React.useId()}label`;
  // 걸러져 줄이 남지 않은 분류는 머리째 숨긴다
  if (React.Children.toArray(children).length === 0) return null;
  return (
    <div ref={ref} role="group" aria-labelledby={labelId} data-slot="searchable-list-group" className={cn("flex flex-col", className)} {...props}>
      <div id={labelId} role="presentation" data-slot="searchable-list-group-label" className={listHeaderVariants({ variant: "mediumWeak" })}>
        {label}
      </div>
      {children}
    </div>
  );
});
SearchableListGroup.displayName = "SearchableListGroup";

// 줄 — 바탕 층(::before — 강조 · 누름, 줄지 않는다)과 콘텐츠 층(누르면 2px 거리 축소). 바탕은 줄 폭 전체(0 · 모서리 0)에서
// 짚으면 좌우 6 · 모서리 10 으로 들어오며 150ms 에 색과 함께 바뀐다(Menu · List). 화살표로 옮기는 동안은 전환 없이 바로
const OPTION = [
  "group/sl-option relative flex w-full cursor-pointer select-none outline-none",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "data-[highlighted]:before:inset-x-x1_5 data-[highlighted]:before:rounded-r2_5 data-[highlighted]:before:bg-bg-layer-default-pressed",
  "active:before:inset-x-x1_5 active:before:rounded-r2_5 active:before:bg-bg-layer-default-pressed",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[[data-highlight-source=keyboard]_&]:before:transition-none",
].join(" ");
const OPTION_CONTENT = [
  "relative flex w-full items-center px-global-gutter py-x3",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-active/sl-option:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/sl-option:[scale:1]",
].join(" ");

export interface SearchableListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "prefix"> {
  /** 고르면 onValueChange 로 가는 값 */
  value: string;
  /** 제목 — 16 / 22 */
  title: React.ReactNode;
  /** 설명 — 13 / 18 · fg-neutral-subtle(카드사 · 종류 — 여럿이면 " · ") */
  detail?: React.ReactNode;
  /** 앞 붙이개 — Logo Tile 40(기관) · 카드 그림 56(카드 상품) · Avatar 36 · 42(사람). 이름 옆이라 보조 기술에 숨긴다 */
  prefix?: React.ReactNode;
}

const SearchableListItem = React.forwardRef<HTMLDivElement, SearchableListItemProps>(
  ({ value, title, detail, prefix, className, onClick, onPointerDown, onPointerMove, onMouseDown, ...props }, ref) => {
    const ctx = useSearchableList("SearchableListItem");
    const id = `${React.useId()}option`;
    const { release } = ctx;
    React.useLayoutEffect(() => () => release(id), [release, id]);
    const selected = ctx.value === value;
    const highlighted = ctx.highlighted === id;
    const state = selected ? "checked" : "unchecked";
    return (
      <div
        ref={ref}
        id={id}
        role="option"
        aria-selected={selected}
        data-value={value}
        data-slot="searchable-list-item"
        data-highlighted={highlighted ? ctx.highlightSource : undefined}
        className={cn(OPTION, className)}
        // 줄을 눌러도 초점은 검색칸에 남는다
        onMouseDown={(e) => {
          onMouseDown?.(e);
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          const el = e.currentTarget;
          el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
          onPointerDown?.(e);
        }}
        // 마우스를 움직여 올린 줄만 강조한다 — 화살표로 스크롤해 줄이 마우스 밑으로 지나가도 강조가 튀지 않게
        onPointerMove={(e) => {
          onPointerMove?.(e);
          if (e.pointerType === "mouse" && !highlighted) ctx.highlight(id, "pointer");
        }}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.select(value);
        }}
        {...props}
      >
        <div data-slot="searchable-list-item-content" className={OPTION_CONTENT}>
          {prefix != null && (
            <span aria-hidden data-slot="searchable-list-item-prefix" className="flex shrink-0 items-center pr-x3">
              {prefix}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left">
            <span data-slot="searchable-list-item-title" className="text-t5 font-normal text-fg-neutral">
              {title}
            </span>
            {detail != null && (
              <span data-slot="searchable-list-item-detail" className="text-t3 text-fg-neutral-subtle">
                {detail}
              </span>
            )}
          </span>
          {/* 지금 값 — 라디오 모양(보는 표시). 고름은 줄의 aria-selected 가 알린다 */}
          <span aria-hidden data-slot="searchable-list-item-radio" data-state={state} className={cn(radiomarkVariants({ size: "large" }), "pointer-events-none")}>
            <span data-state={state} className={radiomarkDotVariants({ size: "large" })} />
          </span>
        </div>
      </div>
    );
  },
);
SearchableListItem.displayName = "SearchableListItem";

// ── 0건 · 실패 · 불러오는 동안 ────────────────────────────────
export interface SearchableListEmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 제목 — 기본 "'{검색어}'에 대한 검색 결과가 없어요" */
  title?: React.ReactNode;
  /** 할 수 있는 일 — "카드사 이름으로도 찾아보세요." */
  description?: React.ReactNode;
}

const SearchableListEmpty = React.forwardRef<HTMLDivElement, SearchableListEmptyProps>(({ title, description, ...props }, ref) => {
  const ctx = useSearchableList("SearchableListEmpty");
  const query = ctx.query.trim();
  return (
    <ResultSection
      ref={ref}
      kind="empty"
      size="medium"
      icon={<SearchX />}
      data-slot="searchable-list-empty"
      title={title ?? (query ? `'${query}'에 대한 검색 결과가 없어요` : "검색 결과가 없어요")}
      description={description}
      {...props}
    />
  );
});
SearchableListEmpty.displayName = "SearchableListEmpty";

export interface SearchableListErrorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 다시 시도 */
  onRetry: () => void;
  /** 다시 시도하는 동안 — 버튼 로딩 */
  retrying?: boolean;
  /** 제목 — 기본 "검색 결과를 불러오지 못했어요" */
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const SearchableListError = React.forwardRef<HTMLDivElement, SearchableListErrorProps>(({ onRetry, retrying, title, description, ...props }, ref) => (
  <ResultSection
    ref={ref}
    kind="failure"
    size="medium"
    data-slot="searchable-list-error"
    title={title ?? "검색 결과를 불러오지 못했어요"}
    description={description}
    primaryAction={{ label: "다시 시도", onClick: () => onRetry(), loading: retrying }}
    {...props}
  />
));
SearchableListError.displayName = "SearchableListError";

export type SearchableListSkeletonPrefix = "logo" | "cardArt" | "avatar" | "none";

export interface SearchableListSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 줄 수 — 기본 5 */
  rows?: number;
  /** 앞 자리 — "logo"(Logo Tile 40 · 모서리 12) · "cardArt"(카드 그림 56 · 그 폭의 모서리) · "avatar"(42 원) · "none"(기본) */
  prefix?: SearchableListSkeletonPrefix;
}

// 카드 그림 56 — 카드 비율 1.586, 모서리는 그 폭의 Image Frame 모서리
const CARD_ART_RADIUS = imageFrameRadius(56);

// 줄 높이 그대로 — 위아래 12 · 좌우 24, 제목 t5(22) 40% + 설명 t3(18) 60%. 보조 기술에는 숨긴다
const SearchableListSkeleton = React.forwardRef<HTMLDivElement, SearchableListSkeletonProps>(({ rows = 5, prefix = "none", className, ...props }, ref) => (
  <div ref={ref} aria-hidden="true" data-slot="searchable-list-skeleton" className={cn("flex flex-col", className)} {...props}>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} data-slot="searchable-list-skeleton-row" className="flex w-full items-center px-global-gutter py-x3">
        {prefix !== "none" && (
          <span className="flex shrink-0 items-center pr-x3">
            {prefix === "logo" && <Skeleton radius="12" className="size-10" />}
            {prefix === "cardArt" && <Skeleton radius={CARD_ART_RADIUS} className="aspect-[1.586] w-14" />}
            {prefix === "avatar" && <Skeleton radius="full" className="size-[42px]" />}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col gap-x0_5">
          <Skeleton text="t5" className="w-[40%]" />
          <Skeleton text="t3" className="w-[60%]" />
        </span>
      </div>
    ))}
  </div>
));
SearchableListSkeleton.displayName = "SearchableListSkeleton";

export {
  SearchableList,
  SearchableListInput,
  SearchableListResults,
  SearchableListGroup,
  SearchableListItem,
  SearchableListEmpty,
  SearchableListError,
  SearchableListSkeleton,
};
