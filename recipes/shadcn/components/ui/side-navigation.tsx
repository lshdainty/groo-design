import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDown, PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/*
 * Groo Side Navigation — 구조는 SEED Side Navigation(2026-10-04). 수치 원본은 specs/components/side-navigation.yaml.
 * 옛 Sidebar(shadcn — 256 · 48 · 모바일 Sheet · 항목 32 · ⌘B · 쿠키 · floating · inset)를 대신한다.
 *
 *   SideNavigation           데스크톱(768 이상)의 주 메뉴 — <nav aria-label="주 메뉴">. collapsed · defaultCollapsed · onCollapsedChange
 *                            (손으로 다룰 때). 둘 다 주지 않으면 창 폭(768 ~ 1279 접힘 56 · 1280 이상 펼침 240) + 손으로 접은 기억
 *                            (localStorage "porest:side-navigation-collapsed")으로 정한다. 768 미만에서는 그리지 않는다 — Desk 는
 *                            Bottom Navigation, HR 은 ☰ 로 여는 왼쪽 Side Panel 에 SideNavigationContent 를 담는다
 *   SideNavigationHeader     머리 — logo(마크 + 서비스 이름, 누르지 않는다)와 접기 버튼(이름 "사이드바" · aria-expanded · aria-controls)
 *   SideNavigationContent    내용 — 이 안에서만 스크롤, 위 끝에서 떨어지면 머리 아래 1px 선, 아래 끝 24 늘 흐림. onNavigate(항목을 눌러
 *                            이동할 때 — 서랍을 닫는다). SideNavigation 밖(서랍)에서 쓰면 스스로 <nav aria-label="주 메뉴"> 가 되고 펼친 모양 —
 *                            스크롤 · 흐림은 Side Panel 본문이 맡는다
 *   SideNavigationGroup      묶음 — label(있을 때만 — 목록 ul 의 aria-labelledby). 접히면 이름은 보이지 않게 남고 묶음 사이에 1px 선
 *   SideNavigationItem       항목 — 하위가 없으면 링크: href · icon · label · current(aria-current="page") · disabled.
 *                            자식으로 SideNavigationSubItem 을 둘 이상 주면 부모(버튼 — 펼치기만, 이동하지 않는다): aria-expanded · aria-controls,
 *                            defaultOpen, 하위가 current 면 저절로 펼친다. 하위가 하나 이하이면 부모를 만들지 않고 href 의 단독 링크다
 *                            (href 가 없으면 그 하나의 href · 하위가 current 면 current) — 하위가 사람마다 다른 항목(Desk 증권 — 연결한
 *                            증권사)을 그대로 넘겨도 하나짜리 나무가 생기지 않는다(2026-10-16 Q-017-4 정리 — SEED Standalone Menu)
 *   SideNavigationSubItem    하위 항목(링크) — href · label · current · disabled. 아이콘 없이 이름만
 *   SideNavigationFooter     바닥 — 보조 링크(설명서 · 문의)만. 비면 그리지 않는다. 계정은 두지 않는다(2026-10-16 Q-018-1 C —
 *                            Desk 는 설정 · 로그아웃이 머리 ⚙ 에 있다)
 *
 * 폭 — 기본은 창 폭으로 정하고, 창 폭이 1280 을 넘나들면 다시 정한다(처음 열 때도 본다 — SEED 코드는 넘나들 때만). 1280 이상에서
 *   손으로 접고 펴면 기억해 다음에도 그 모양으로 연다. 768 ~ 1279 에서 손으로 편 것은 기억하지 않는다(다시 열면 접힌 채).
 *   펼침 ↔ 접힘 200ms easing(폭) — 이름은 접히기 시작할 때 사라지고 다 펴진 뒤 나타난다. 모션 줄이기면 바로 바뀐다.
 * 접혔을 때 — 하위가 없는 항목은 마우스를 올리면 200ms 뒤(키보드 초점이면 바로) 오른쪽에 이름 말풍선(tooltip.tsx — Help Bubble 툴팁,
 *   이름과 같은 글이라 aria-describedby 로 잇지 않는다). 하위가 있는 항목은 아이콘 옆 8(위 끝 맞춤 · 화면 끝과 8)에 펼침 메뉴 —
 *   Menu 와 같은 표면(폭 200 · 모서리 20 · s3 · 위아래 8) · 맨 위에 부모 이름 · 줄 44 · 지금 화면 줄은 지금 항목과 같은 바탕.
 *   1280 미만이어도 Menu Sheet 로 바꾸지 않는다 — Menu 의 1280 규칙의 예외(사용자 결정 2026-10-08).
 *   펼침 메뉴는 마우스를 올리면 200ms 뒤 열리고(다른 펼침 메뉴가 열려 있으면 바로) 트리거 · 메뉴를 모두 떠나면 100ms 뒤 닫힌다(옮겨 가는
 *   동안 닫히지 않는다). 누르거나 Enter · Space 로 열고 닫는다 — 키보드로 열면 첫 줄로 초점, 마우스 · 터치로 열면 옮기지 않는다.
 *   마우스로 열린 메뉴를 누르면 닫지 않고 붙들어 둔다(다시 누르면 닫는다). 열린 동안 부모에서 Tab 은 메뉴의 첫 줄로, 첫 줄에서 Shift+Tab 은
 *   부모로, 마지막 줄에서 Tab 은 부모 다음 칸으로 나가며 닫는다. Esc 는 닫고 초점을 부모로, 바깥 누르기 · 바깥으로 간 초점은 닫는다.
 *   펼침 메뉴는 디스클로저다 — role="menu" 를 쓰지 않고 role="group" + aria-labelledby(부모). 사이드바(nav) 안에 그려 주 메뉴의 링크로 남는다.
 *   한 번에 하나만 열린다. 쌓임은 z-floating 200(L3), 모션은 Menu 와 같다(150ms enter 로 0.95 → 1 · 투명도, 100ms exit).
 *
 * 모양: 흰 면 bg-layer-default + 오른쪽 안쪽 1px stroke-neutral-subtle(그림자 없음), 화면 왼쪽 · 높이 전체(sticky) — 본문과 따로 스크롤.
 *   머리 64 · 안쪽 8, 마크 24 + 이름 t5 16 / 22 · 700(화면 끝에서 16). 접기 버튼 40 · 아이콘 18 fg-neutral-subtle · 모서리 8 · 누르는 영역 44,
 *   위 12 · 오른쪽 12(접히면 8 — 56 의 가운데).
 *   내용 위 8 · 좌우 8 · 아래 24, 묶음 사이 8(접히면 1px 선 · 위아래 8 · 좌우 8). 묶음 이름 t4 14 / 19 · 700 · fg-neutral-muted · 안쪽 6.
 *   항목 최소 44 · 좌우 8 · 아이콘 20 fg-neutral-subtle ↔ 이름 12 · 이름 t4 · 500 · fg-neutral-muted · 위아래 6 · 모서리 10 — 긴 이름은 단어 단위로
 *   줄을 바꾼다(말줄임 없음). 접히면 항목 40(좌우 10 — 아이콘이 화면 끝에서 18). 꺾쇠 16 fg-neutral-subtle(펼치면 위로 300ms).
 *   하위 항목 최소 44 · 이름이 부모 이름과 같은 자리(40)에서 시작, 펼침 · 접힘은 높이 · 투명도 300ms(motion-duration-d6 — Accordion 과 같다,
 *   2026-10-10). 모션 줄이기면 높이를 움직이지 않고 150ms 서서히 나타나고 사라지며 꺾쇠는 바로 돈다.
 *   지금 항목 bg-neutral-weak-pressed + 아이콘 · 이름 fg-neutral(굵기 500 그대로 — 사용자 결정 2026-10-08). 접혔을 때는 하위가 지금인 부모가
 *   지금 항목이다. 지금 항목은 마우스를 올리거나 눌러도 바탕이 그대로다(그보다 짙은 불투명 역할이 없다).
 * 상태: 호버(웹) · 누름 bg-layer-default-pressed, 누르면 아이콘 · 이름만 2px 거리 축소(바탕은 그대로 — 모션 줄이기면 하지 않는다).
 *   키보드 포커스에만 항목 안쪽 2px 링(모서리 10). 막힌 항목은 fg-disabled · 바탕 없음 · 누르지 못한다(aria-disabled, 링크 주소 없음).
 *   펼침 메뉴의 줄 — 마우스를 올리면 좌우 8 들인 알약 bg-layer-floating-pressed(모서리 12), 누르면 글만 축소, 키보드 포커스는 알약 자리의 안쪽 링.
 */

// ── 폭 · 기억 ────────────────────────────────────────────────
const STORAGE_KEY = "porest:side-navigation-collapsed";
const DESKTOP_QUERY = "(min-width: 768px)";
const WIDE_QUERY = "(min-width: 1280px)";
// 펼침 메뉴 · 말풍선의 기다림(side-navigation.yaml flyout · tooltip)
const FLYOUT_OPEN_DELAY = 200;
const FLYOUT_CLOSE_DELAY = 100;

function readStored(): boolean | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "true" ? true : v === "false" ? false : null;
  } catch {
    return null;
  }
}
function writeStored(collapsed: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch {
    // 저장소를 쓰지 못하는 브라우저 — 기억 없이 쓴다
  }
}

function useMedia(query: string, server: boolean) {
  return React.useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}

// 창 폭의 기본 — 1280 이상은 기억(손으로 접어 뒀으면 접힘), 미만은 접힘
const widthDefault = (wide: boolean) => (wide ? readStored() === true : true);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
const isPressKey = (e: React.KeyboardEvent) => e.key === " " || e.key === "Enter";
// 새 탭 · 새 창으로 여는 누르기 — 이동이 아니다
const isModifiedClick = (e: React.MouseEvent) => e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

// ── 문맥 ─────────────────────────────────────────────────────
type RootContextValue = {
  /** 접힘(목표) — 항목의 자리 · 펼침 메뉴 */
  collapsed: boolean;
  /** 이름을 보이지 않게(sr-only) — 접히기 시작할 때부터 다 펴질 때까지 */
  labelsHidden: boolean;
  toggle: () => void;
  navId: string;
  /** 펼침 메뉴를 그릴 자리 — 사이드바(nav) 자신 */
  portal: HTMLElement | null;
  /** 지금 열린 펼침 메뉴 — 한 번에 하나 */
  activeFlyout: string | null;
  setActiveFlyout: (id: string | null) => void;
};
const RootContext = React.createContext<RootContextValue | null>(null);

type ContentContextValue = { onNavigate?: () => void };
const ContentContext = React.createContext<ContentContextValue>({});

// 하위 항목이 어디에 그려지는가 — 부모 아래 목록(펼침 · 서랍) · 펼침 메뉴(접힘)
type SubPlacement = { kind: "list" } | { kind: "flyout"; close: () => void };
const SubPlacementContext = React.createContext<SubPlacement>({ kind: "list" });

// ── 사이드바 ─────────────────────────────────────────────────
// 흰 면 + 오른쪽 안쪽 1px 선, 높이 전체 · 왼쪽에 붙는다. 폭 240 ↔ 56 200ms easing
const ROOT = [
  "sticky top-0 flex h-dvh shrink-0 flex-col overflow-hidden bg-bg-layer-default font-sans text-fg-neutral",
  "shadow-[inset_-1px_0_0_0_var(--color-stroke-neutral-subtle)]",
  "[transition:width_var(--motion-duration-d4)_var(--motion-ease-easing)] motion-reduce:transition-none",
].join(" ");

export interface SideNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** 접힘 — 주면 제어한다 */
  collapsed?: boolean;
  /** 처음 접힘 — 주면 창 폭 · 기억을 쓰지 않는다 */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SideNavigation = React.forwardRef<HTMLElement, SideNavigationProps>(
  ({ collapsed: collapsedProp, defaultCollapsed, onCollapsedChange, id: idProp, className, children, ...props }, ref) => {
    const desktop = useMedia(DESKTOP_QUERY, true);
    const wide = useMedia(WIDE_QUERY, true);
    const auto = collapsedProp === undefined && defaultCollapsed === undefined;
    const [inner, setInner] = React.useState<boolean>(() =>
      defaultCollapsed !== undefined ? defaultCollapsed : typeof window === "undefined" ? false : widthDefault(window.matchMedia(WIDE_QUERY).matches),
    );
    const controlled = collapsedProp !== undefined;
    const collapsed = controlled ? collapsedProp : inner;
    const collapsedRef = React.useRef(collapsed);
    const onChangeRef = React.useRef(onCollapsedChange);
    React.useLayoutEffect(() => {
      collapsedRef.current = collapsed;
      onChangeRef.current = onCollapsedChange;
    });
    const setCollapsed = React.useCallback(
      (next: boolean) => {
        if (next === collapsedRef.current) return;
        collapsedRef.current = next;
        if (!controlled) setInner(next);
        onChangeRef.current?.(next);
      },
      [controlled],
    );

    // 창 폭이 1280 을 넘나들면 기본으로 다시 — 1280 이상은 기억, 미만은 접힘
    const wideRef = React.useRef(wide);
    React.useEffect(() => {
      if (wideRef.current === wide) return;
      wideRef.current = wide;
      if (auto) setCollapsed(widthDefault(wide));
    }, [wide, auto, setCollapsed]);

    const toggle = React.useCallback(() => {
      const next = !collapsedRef.current;
      // 1280 이상에서 손으로 접고 편 것만 기억한다 — 768 ~ 1279 는 다시 열면 접힌 채
      if (auto && window.matchMedia(WIDE_QUERY).matches) writeStored(next);
      setCollapsed(next);
    }, [auto, setCollapsed]);

    // 이름 — 접히기 시작하면 바로 숨기고, 펴질 때는 다 펴진 뒤(200ms) 보인다. 모션 줄이기면 바로
    const [labelsHidden, setLabelsHidden] = React.useState(collapsed);
    React.useEffect(() => {
      if (collapsed) {
        setLabelsHidden(true);
        return;
      }
      if (prefersReducedMotion()) {
        setLabelsHidden(false);
        return;
      }
      const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--motion-duration-d4")) || 200;
      const timer = window.setTimeout(() => setLabelsHidden(false), duration);
      return () => window.clearTimeout(timer);
    }, [collapsed]);

    const [activeFlyout, setActiveFlyout] = React.useState<string | null>(null);
    // 펴지면 펼침 메뉴를 닫는다
    React.useEffect(() => {
      if (!collapsed) setActiveFlyout(null);
    }, [collapsed]);

    const [portal, setPortal] = React.useState<HTMLElement | null>(null);
    const autoId = React.useId();
    const navId = idProp ?? `side-navigation${autoId}`;
    const value = React.useMemo<RootContextValue>(
      () => ({ collapsed, labelsHidden, toggle, navId, portal, activeFlyout, setActiveFlyout }),
      [collapsed, labelsHidden, toggle, navId, portal, activeFlyout],
    );

    // 768 미만에서는 없다 — 하단 탭 바(Desk) · ☰ 주 메뉴(HR)
    if (!desktop) return null;
    return (
      <RootContext.Provider value={value}>
        <nav
          ref={mergeRefs(ref, setPortal)}
          id={navId}
          aria-label="주 메뉴"
          data-slot="side-navigation"
          data-collapsed={collapsed || undefined}
          className={cn(ROOT, collapsed ? "w-[var(--layout-sidebar-collapsed)]" : "w-[var(--layout-sidebar)]", className)}
          {...props}
        >
          {children}
        </nav>
      </RootContext.Provider>
    );
  },
);
SideNavigation.displayName = "SideNavigation";

function useRoot(name: string) {
  const ctx = React.useContext(RootContext);
  if (!ctx) throw new Error(`${name} 는 SideNavigation 안에 둔다.`);
  return ctx;
}

// ── 머리 ─────────────────────────────────────────────────────
// 높이 64 · 안쪽 8. 내용이 위 끝에서 떨어지면 안쪽 아래 1px 선(150ms) — 내용은 흐림 마스크를 걸어 그 안에 그린 선은 흐려진다
const HEADER = [
  "relative flex min-h-[64px] shrink-0 items-center p-x2",
  "[transition:box-shadow_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[&:has(~[data-slot=side-navigation-content][data-scrolled])]:shadow-[inset_0_-1px_0_0_var(--color-stroke-neutral-subtle)]",
].join(" ");
// 로고 — 마크 24 + 이름 t5 · 700, 화면 끝에서 16. 접기 버튼 자리(40 + 12)를 비운다
const LOGO = "ml-x2 mr-[52px] flex min-w-0 items-center gap-x2 overflow-hidden whitespace-nowrap text-t5 font-bold text-fg-neutral [&>img]:size-[24px] [&>img]:shrink-0 [&>svg]:size-[24px] [&>svg]:shrink-0";
// 접기 버튼 — 40 · 아이콘 18 · 모서리 8 · 누르는 영역 44, 위 12 · 오른쪽 12(접히면 8)
const TRIGGER = [
  "absolute top-x3 flex size-[40px] cursor-pointer items-center justify-center rounded-r2 border-0 bg-transparent p-0 text-fg-neutral-subtle [&>svg]:size-[18px]",
  "before:absolute before:left-1/2 before:top-1/2 before:size-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/40)] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

export interface SideNavigationHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 서비스 마크(24) + 이름("그루 담다" · "그루 이음") — 누르지 않는다(홈은 첫 항목) */
  logo?: React.ReactNode;
}

const SideNavigationHeader = React.forwardRef<HTMLDivElement, SideNavigationHeaderProps>(({ logo, className, children, ...props }, ref) => {
  const root = useRoot("SideNavigationHeader");
  return (
    <div ref={ref} data-slot="side-navigation-header" className={cn(HEADER, className)} {...props}>
      {logo != null && (
        <div data-slot="side-navigation-logo" className={cn(LOGO, root.labelsHidden && "hidden")}>
          {logo}
        </div>
      )}
      {children}
      <button
        type="button"
        aria-label="사이드바"
        aria-expanded={!root.collapsed}
        aria-controls={root.navId}
        data-slot="side-navigation-trigger"
        className={cn(TRIGGER, root.collapsed ? "right-x2" : "right-x3")}
        onPointerDown={(e) => measurePress(e.currentTarget)}
        onClick={root.toggle}
      >
        <PanelLeft aria-hidden />
      </button>
    </div>
  );
});
SideNavigationHeader.displayName = "SideNavigationHeader";

// ── 내용 ─────────────────────────────────────────────────────
// 아래 끝 24 를 늘 흐린다 — gradient-fade-mask(방향 없는 위 → 아래 토큰)를 아래에서 위로 붙여 내용 상자에 건다(사이드바의 제 안개)
const FOG_DEPTH = "24px";
function useBottomFog(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const token = getComputedStyle(el).getPropertyValue("--gradient-fade-mask").trim();
    if (!/^linear-gradient\(\s*(#|rgb|hsl|transparent)/i.test(token)) return;
    const mask = {
      image: `linear-gradient(#000, #000), ${token.replace(/^linear-gradient\(/, "linear-gradient(to top, ")}`,
      size: `100% calc(100% - ${FOG_DEPTH}), 100% ${FOG_DEPTH}`,
      position: "0 0, 0 100%",
      repeat: "no-repeat",
    };
    for (const [p, v] of Object.entries(mask)) {
      el.style.setProperty(`mask-${p}`, v);
      el.style.setProperty(`-webkit-mask-${p}`, v);
    }
    return () => {
      for (const p of Object.keys(mask)) {
        el.style.removeProperty(`mask-${p}`);
        el.style.removeProperty(`-webkit-mask-${p}`);
      }
    };
  }, [ref, enabled]);
}

// 내용 — 위 8 · 좌우 8 · 아래 24(흐림 깊이), 묶음 사이 8(접히면 0 — 선으로 가른다). 키보드로 옮긴 항목이 흐림 아래 멈추지 않게 스크롤 여유
const CONTENT = "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-x2 pb-[24px] pt-x2 scroll-pb-[24px] scroll-pt-x2";

export interface SideNavigationContentProps extends React.HTMLAttributes<HTMLElement> {
  /** 항목을 눌러 이동할 때 — 주 메뉴 서랍(Side Panel)을 닫는다 */
  onNavigate?: () => void;
}

const SideNavigationContent = React.forwardRef<HTMLElement, SideNavigationContentProps>(({ onNavigate, className, onScroll, children, ...props }, ref) => {
  const root = React.useContext(RootContext);
  const own = React.useRef<HTMLElement | null>(null);
  useBottomFog(own, root !== null);
  // 위 끝에서 떨어졌다 — 머리 아래 선
  React.useLayoutEffect(() => {
    const el = own.current;
    if (el && root) el.toggleAttribute("data-scrolled", el.scrollTop > 0);
  });
  const value = React.useMemo(() => ({ onNavigate }), [onNavigate]);
  if (!root) {
    // 서랍(Side Panel) — 스스로 주 메뉴가 되고 펼친 모양. 스크롤 · 흐림은 Side Panel 본문이 맡는다
    return (
      <ContentContext.Provider value={value}>
        <nav ref={ref} aria-label="주 메뉴" data-slot="side-navigation-content" data-standalone="" className={cn("flex flex-col gap-x2 font-sans", className)} {...props}>
          {children}
        </nav>
      </ContentContext.Provider>
    );
  }
  return (
    <ContentContext.Provider value={value}>
      <div
        ref={mergeRefs(ref as React.Ref<HTMLDivElement>, own as React.Ref<HTMLDivElement>)}
        data-slot="side-navigation-content"
        className={cn(CONTENT, root.labelsHidden ? "gap-0" : "gap-x2", className)}
        onScroll={(e) => {
          e.currentTarget.toggleAttribute("data-scrolled", e.currentTarget.scrollTop > 0);
          onScroll?.(e);
        }}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    </ContentContext.Provider>
  );
});
SideNavigationContent.displayName = "SideNavigationContent";

// ── 묶음 ─────────────────────────────────────────────────────
// 묶음 이름 — t4 · 700 · fg-neutral-muted · 안쪽 6(글은 화면 끝에서 14), 길면 단어 단위로 줄을 바꾼다
const GROUP_LABEL = "p-x1_5 text-t4 font-bold text-fg-neutral-muted break-keep [overflow-wrap:break-word]";
// 접혔을 때 묶음 사이 1px 선 — 위아래 8 · 좌우 8(선 폭 24, 아이콘 칸 가운데). 첫 묶음 위에는 없다
const GROUP_DIVIDER =
  "[[data-slot=side-navigation-group]+&]:before:mx-x2 [[data-slot=side-navigation-group]+&]:before:my-x2 [[data-slot=side-navigation-group]+&]:before:block [[data-slot=side-navigation-group]+&]:before:h-px [[data-slot=side-navigation-group]+&]:before:bg-stroke-neutral-subtle [[data-slot=side-navigation-group]+&]:before:content-['']";

export interface SideNavigationGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 묶음 이름 — 성격이 다른 항목을 나눌 때만(짧은 명사) */
  label?: React.ReactNode;
}

const SideNavigationGroup = React.forwardRef<HTMLDivElement, SideNavigationGroupProps>(({ label, className, children, ...props }, ref) => {
  const root = React.useContext(RootContext);
  const labelId = React.useId();
  const hidden = root?.labelsHidden ?? false;
  return (
    <div ref={ref} data-slot="side-navigation-group" className={cn("flex flex-col", hidden && GROUP_DIVIDER, className)} {...props}>
      {label != null && (
        <div id={labelId} data-slot="side-navigation-group-label" className={hidden ? "sr-only" : GROUP_LABEL}>
          {label}
        </div>
      )}
      <ul aria-labelledby={label != null ? labelId : undefined} className="m-0 flex list-none flex-col p-0">
        {children}
      </ul>
    </div>
  );
});
SideNavigationGroup.displayName = "SideNavigationGroup";

// ── 항목 ─────────────────────────────────────────────────────
// 항목 — 최소 44 · 좌우 8 · 모서리 10, 키보드 포커스에 안쪽 2px 링. 바탕은 지금 항목 · 호버 · 누름에만
// 펼침 ↔ 접힘에 좌우 여백(8 ↔ 10)도 사이드바 폭과 같이 200ms 로 바뀐다(모션 줄이기면 바로)
const ITEM = [
  "group/side-navigation-item relative flex min-h-[44px] w-full items-center rounded-r2_5 border-0 bg-transparent px-x2 text-left font-sans no-underline",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),padding_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 접힘 — 40(56 − 좌우 8) · 좌우 10, 아이콘이 화면 끝에서 18
const ITEM_COLLAPSED = "w-[40px] px-x2_5";
const ITEM_HOVER = "cursor-pointer hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";
// 지금 항목 — 한 단계 짙은 옅은 회색, 마우스를 올리거나 눌러도 그대로
const ITEM_CURRENT = "cursor-pointer bg-bg-neutral-weak-pressed";
const ITEM_DISABLED = "cursor-not-allowed";
// 콘텐츠 층 — 아이콘 ↔ 이름 12. 누르는 동안만 2px 거리 축소(바탕은 그대로)
const ITEM_CONTENT = "relative flex min-w-0 flex-1 items-center gap-x3 [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const ITEM_CONTENT_PRESS = "group-active/side-navigation-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/side-navigation-item:[scale:1]";
const ITEM_ICON = "flex shrink-0 [&>svg]:size-[20px]";
// 이름 — t4 · 500 · 위아래 6, 단어 단위로 줄을 바꾼다(말줄임 없음)
const ITEM_LABEL = "min-w-0 flex-1 py-x1_5 text-t4 font-medium break-keep [overflow-wrap:break-word]";
const tone = (current: boolean, disabled: boolean) =>
  disabled
    ? { icon: "text-fg-disabled", label: "text-fg-disabled" }
    : current
      ? { icon: "text-fg-neutral", label: "text-fg-neutral" }
      : { icon: "text-fg-neutral-subtle", label: "text-fg-neutral-muted" };

// 꺾쇠 — 16 · fg-neutral-subtle, 펼치면 위로(300ms — 하위 펼침과 같은 시간, 모션 줄이기면 바로)
const CHEVRON = "size-[16px] shrink-0 text-fg-neutral-subtle [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";

// 하위 목록 — 높이 · 투명도로 펼친다(300ms — Accordion 과 같다). 접히면 다 접힌 뒤 보이지 않게(보조 기술 · Tab 에서 빠진다).
// 모션 줄이기면 높이는 바로 바꾸고 투명도만 150ms — 접을 때는 다 흐려진 뒤 높이를 접는다
const SUB_LIST = "grid";
const SUB_LIST_OPEN = [
  "visible grid-rows-[1fr] opacity-100",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s]",
  "motion-reduce:[transition:opacity_var(--motion-duration-d3)_var(--motion-ease-easing),visibility_0s]",
].join(" ");
const SUB_LIST_CLOSED = [
  "invisible grid-rows-[0fr] opacity-0",
  "[transition:grid-template-rows_var(--motion-duration-d6)_var(--motion-ease-easing),opacity_var(--motion-duration-d6)_var(--motion-ease-easing),visibility_0s_linear_var(--motion-duration-d6)]",
  "motion-reduce:[transition:grid-template-rows_0s_linear_var(--motion-duration-d3),opacity_var(--motion-duration-d3)_var(--motion-ease-easing),visibility_0s_linear_var(--motion-duration-d3)]",
].join(" ");

// 펼침 메뉴 — Menu 표면(폭 200 · 모서리 20 · 떠 있는 바탕 + s3 · 위아래 8 · z-floating). 150ms enter · 100ms exit 로 0.95 ↔ 1 · 투명도
const FLYOUT = [
  "z-(--z-floating) w-[200px] overflow-hidden rounded-r5 bg-bg-layer-floating py-x2 font-sans text-fg-neutral shadow-[var(--shadow-s3)] outline-none",
  "origin-[var(--radix-popover-content-transform-origin)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:[--tw-animation-duration:var(--motion-duration-d3)] data-[state=open]:ease-[var(--motion-ease-enter)] motion-safe:data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-animation-duration:var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)] motion-safe:data-[state=closed]:zoom-out-95",
].join(" ");
// 펼침 메뉴의 묶음 이름 — 부모 이름. t3 · 400 · fg-neutral-subtle · 위아래 8 · 좌우 16
const FLYOUT_LABEL = "px-x4 py-x2 text-t3 font-normal text-fg-neutral-subtle break-keep [overflow-wrap:break-word]";

type SubItemElement = React.ReactElement<SideNavigationSubItemProps>;
// 부모 버튼에 넘길 속성 — title · data-* · aria-* 만(링크의 속성 · 이벤트 처리기는 넘기지 않는다. id 는 하위 목록 · 펼침 메뉴가 이름으로 쓴다)
function buttonAttributes(props: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === "title" || key.startsWith("aria-") || key.startsWith("data-")) out[key] = value;
  }
  return out as React.HTMLAttributes<HTMLButtonElement>;
}
const subItemsOf = (children: React.ReactNode) =>
  React.Children.toArray(children).filter((c): c is SubItemElement => React.isValidElement(c));

export interface SideNavigationItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** 그 화면 주소 — 하위가 없는 항목 */
  href?: string;
  /** lucide 선 아이콘 — 20 */
  icon: React.ReactNode;
  /** 이름 — 화면 이름과 같게, 짧게 */
  label: string;
  /** 지금 화면 — aria-current="page" */
  current?: boolean;
  /** 막힌 항목 — 누르지 못한다 */
  disabled?: boolean;
  /** 부모 — 처음부터 펼친다(하위가 지금이면 주지 않아도 펼친다) */
  defaultOpen?: boolean;
  /** 하위 항목(SideNavigationSubItem) — 둘 이상이면 부모가 된다(펼치기만, 이동하지 않는다). 하나 이하이면 단독 링크 */
  children?: React.ReactNode;
}

const SideNavigationItem = React.forwardRef<HTMLElement, SideNavigationItemProps>((props, ref) => {
  const subs = subItemsOf(props.children);
  if (subs.length >= 2) return <ParentItem ref={ref} {...props} subs={subs} />;
  // 하위가 하나 · 없으면 단독 항목 — 고를 것이 없는 나무를 만들지 않는다. href 가 없으면 그 하나의 주소로, 하위가 지금이면 지금 항목
  const only = subs[0]?.props;
  const { children: _children, ...leaf } = props;
  return <LeafItem ref={ref as React.Ref<HTMLAnchorElement>} {...leaf} href={props.href ?? only?.href} current={props.current ?? only?.current} />;
});
SideNavigationItem.displayName = "SideNavigationItem";

// 하위가 없는 항목 — 링크. 접히면 이름 말풍선(오른쪽)
const LeafItem = React.forwardRef<HTMLAnchorElement, SideNavigationItemProps>(
  ({ href, icon, label, current = false, disabled = false, defaultOpen: _defaultOpen, className, onClick, onPointerDown, onKeyDown, children: _children, ...props }, ref) => {
    const root = React.useContext(RootContext);
    const content = React.useContext(ContentContext);
    const collapsed = root?.collapsed ?? false;
    const hidden = root?.labelsHidden ?? false;
    const colors = tone(current, disabled);
    const link = (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        role={disabled ? "link" : undefined}
        aria-disabled={disabled || undefined}
        aria-current={current ? "page" : undefined}
        data-slot="side-navigation-item"
        data-current={current || undefined}
        data-disabled={disabled || undefined}
        className={cn(ITEM, collapsed && ITEM_COLLAPSED, disabled ? ITEM_DISABLED : current ? ITEM_CURRENT : ITEM_HOVER, className)}
        onPointerDown={(e) => {
          measurePress(e.currentTarget);
          onPointerDown?.(e);
        }}
        onKeyDown={(e) => {
          if (isPressKey(e)) measurePress(e.currentTarget);
          onKeyDown?.(e);
        }}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
          if (!isModifiedClick(e)) content.onNavigate?.();
        }}
        {...props}
      >
        <span data-slot="side-navigation-item-content" className={cn(ITEM_CONTENT, !disabled && ITEM_CONTENT_PRESS)}>
          <span aria-hidden data-slot="side-navigation-item-icon" className={cn(ITEM_ICON, colors.icon)}>
            {icon}
          </span>
          <span data-slot="side-navigation-item-label" className={hidden ? "sr-only" : cn(ITEM_LABEL, colors.label)}>
            {label}
          </span>
        </span>
      </a>
    );
    return (
      <li className="flex">
        {root ? (
          // 접혔을 때만 이름 말풍선 — 이름과 같은 글이라 aria-describedby 로 잇지 않는다
          <Tooltip disabled={!collapsed}>
            <TooltipTrigger asChild aria-describedby={undefined}>
              {link}
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ) : (
          link
        )}
      </li>
    );
  },
);
LeafItem.displayName = "SideNavigationLeafItem";

// 하위가 있는 항목 — 펼치기만 한다. 접히면 펼침 메뉴
const ParentItem = React.forwardRef<HTMLElement, SideNavigationItemProps & { subs: SubItemElement[] }>(
  ({ icon, label, disabled = false, defaultOpen = false, subs, className, href: _href, current: _current, children: _children, ...rest }, ref) => {
    // 부모는 버튼 — 링크 전용 속성(href · target · 이벤트)은 넘기지 않고 title · data-* · aria-* 만
    const attributes = buttonAttributes(rest);
    const root = React.useContext(RootContext);
    const collapsed = root?.collapsed ?? false;
    const hidden = root?.labelsHidden ?? false;
    const hasCurrentChild = subs.some((s) => s.props.current);
    const [open, setOpen] = React.useState(defaultOpen || hasCurrentChild);
    // 하위가 지금 화면이 되면 저절로 펼친다
    React.useEffect(() => {
      if (hasCurrentChild) setOpen(true);
    }, [hasCurrentChild]);
    const baseId = React.useId();
    const buttonId = `${baseId}button`;
    const listId = `${baseId}list`;
    // 접혔을 때는 하위가 지금인 부모가 지금 항목이다
    const current = collapsed && hasCurrentChild;
    const colors = tone(current, disabled);
    const press = {
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => measurePress(e.currentTarget),
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (isPressKey(e)) measurePress(e.currentTarget);
      },
    };
    const inner = (
      <span data-slot="side-navigation-item-content" className={cn(ITEM_CONTENT, !disabled && ITEM_CONTENT_PRESS)}>
        <span aria-hidden data-slot="side-navigation-item-icon" className={cn(ITEM_ICON, colors.icon)}>
          {icon}
        </span>
        <span data-slot="side-navigation-item-label" className={hidden ? "sr-only" : cn(ITEM_LABEL, colors.label)}>
          {label}
        </span>
        {!collapsed && <ChevronDown aria-hidden data-slot="side-navigation-chevron" className={cn(CHEVRON, open && "rotate-180")} />}
      </span>
    );
    const itemClass = cn(ITEM, collapsed && ITEM_COLLAPSED, disabled ? ITEM_DISABLED : current ? ITEM_CURRENT : ITEM_HOVER, className);

    if (collapsed && root) {
      return (
        <FlyoutParent
          ref={ref as React.Ref<HTMLButtonElement>}
          root={root}
          buttonId={buttonId}
          label={label}
          current={current}
          disabled={disabled}
          className={itemClass}
          press={press}
          subs={subs}
          attributes={attributes}
        >
          {inner}
        </FlyoutParent>
      );
    }
    return (
      <li className="flex flex-col">
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          id={buttonId}
          disabled={disabled}
          aria-expanded={open}
          aria-controls={listId}
          data-slot="side-navigation-item"
          data-parent=""
          data-state={open ? "open" : "closed"}
          {...attributes}
          className={itemClass}
          onClick={() => setOpen((o) => !o)}
          {...press}
        >
          {inner}
        </button>
        <div data-slot="side-navigation-sub-list" data-state={open ? "open" : "closed"} className={cn(SUB_LIST, open ? SUB_LIST_OPEN : SUB_LIST_CLOSED)}>
          <ul id={listId} aria-labelledby={buttonId} className="m-0 flex min-h-0 list-none flex-col overflow-hidden p-0">
            {subs}
          </ul>
        </div>
      </li>
    );
  },
);
ParentItem.displayName = "SideNavigationParentItem";

type FlyoutMode = "hover" | "pinned";

// 접힌 부모 — 아이콘 옆 펼침 메뉴(Radix Popover 비모달 · 사이드바 안에 그린다)
const FlyoutParent = React.forwardRef<
  HTMLButtonElement,
  {
    root: RootContextValue;
    buttonId: string;
    label: string;
    current: boolean;
    disabled: boolean;
    className: string;
    press: {
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    };
    subs: SubItemElement[];
    attributes: React.HTMLAttributes<HTMLButtonElement>;
    children: React.ReactNode;
  }
>(({ root, buttonId, label, current, disabled, className, press, subs, attributes, children }, ref) => {
  const flyoutId = `${buttonId}flyout`;
  const open = root.activeFlyout === flyoutId;
  const { setActiveFlyout } = root;
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const modeRef = React.useRef<FlyoutMode>("hover");
  const focusFirstRef = React.useRef(false);
  const escapedRef = React.useRef(false);
  const hoverRef = React.useRef({ trigger: false, content: false });
  const openTimer = React.useRef<number | undefined>(undefined);
  const closeTimer = React.useRef<number | undefined>(undefined);
  const activeRef = React.useRef(root.activeFlyout);
  React.useLayoutEffect(() => {
    activeRef.current = root.activeFlyout;
  });

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };
  React.useEffect(() => clearTimers, []);

  const show = (mode: FlyoutMode, focusFirst = false) => {
    clearTimers();
    modeRef.current = mode;
    focusFirstRef.current = focusFirst;
    setActiveFlyout(flyoutId);
  };
  const hide = () => {
    clearTimers();
    if (activeRef.current === flyoutId) setActiveFlyout(null);
  };
  // 트리거 · 메뉴를 모두 떠나면 100ms 뒤 — 마우스로 연 것만(누르거나 키보드로 연 것은 붙들어 둔다)
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    if (modeRef.current !== "hover") return;
    closeTimer.current = window.setTimeout(() => {
      if (!hoverRef.current.trigger && !hoverRef.current.content) hide();
    }, FLYOUT_CLOSE_DELAY);
  };
  const hover = (part: "trigger" | "content", inside: boolean, e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    hoverRef.current[part] = inside;
    if (inside) {
      window.clearTimeout(closeTimer.current);
      if (part === "trigger" && !open && !disabled) {
        window.clearTimeout(openTimer.current);
        // 다른 펼침 메뉴가 열려 있으면 바로
        if (activeRef.current !== null) show("hover");
        else openTimer.current = window.setTimeout(() => hoverRef.current.trigger && show("hover"), FLYOUT_OPEN_DELAY);
      }
      return;
    }
    if (part === "trigger") window.clearTimeout(openTimer.current);
    scheduleClose();
  };

  const rows = () => Array.from(contentRef.current?.querySelectorAll<HTMLElement>('[data-slot="side-navigation-flyout-item"]:not([aria-disabled])') ?? []);
  const placement = React.useMemo<SubPlacement>(() => ({ kind: "flyout", close: hide }), []);

  return (
    <li className="flex">
      <PopoverPrimitive.Root open={open} onOpenChange={(next) => (next ? show("pinned") : hide())}>
        <PopoverPrimitive.Anchor asChild>
          <button
            ref={mergeRefs(ref, buttonRef)}
            type="button"
            id={buttonId}
            disabled={disabled}
            aria-expanded={open}
            aria-controls={open ? flyoutId : undefined}
            data-slot="side-navigation-item"
            data-parent=""
            data-current={current || undefined}
            data-state={open ? "open" : "closed"}
            {...attributes}
            className={className}
            onPointerEnter={(e) => hover("trigger", true, e)}
            onPointerLeave={(e) => hover("trigger", false, e)}
            onClick={(e) => {
              // 키보드(Enter · Space — detail 0)로 열면 첫 줄로 초점. 마우스로 열린 메뉴는 붙들어 두고, 붙든 메뉴는 닫는다
              if (!open) show("pinned", e.detail === 0);
              else if (modeRef.current === "hover") modeRef.current = "pinned";
              else hide();
            }}
            onKeyDown={(e) => {
              press.onKeyDown(e);
              // 열린 동안 Tab 은 메뉴의 첫 줄로(메뉴는 사이드바 끝에 그려진다 — 디스클로저의 차례를 지킨다)
              if (e.key === "Tab" && !e.shiftKey && open) {
                const first = rows()[0];
                if (!first) return;
                e.preventDefault();
                modeRef.current = "pinned";
                first.focus();
              }
            }}
            onPointerDown={press.onPointerDown}
          >
            {children}
          </button>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal container={root.portal}>
          <PopoverPrimitive.Content
            ref={contentRef}
            id={flyoutId}
            role="group"
            aria-labelledby={buttonId}
            data-slot="side-navigation-flyout"
            side="right"
            align="start"
            sideOffset={8}
            collisionPadding={8}
            className={FLYOUT}
            onOpenAutoFocus={(e) => {
              // 키보드로 열었으면 첫 줄로, 마우스 · 터치로 열었으면 초점을 옮기지 않는다
              e.preventDefault();
              if (focusFirstRef.current) rows()[0]?.focus();
              focusFirstRef.current = false;
            }}
            onCloseAutoFocus={(e) => {
              // Esc 로 닫았으면 부모로. 그 밖에는(마우스가 떠남 · 바깥 · Tab) 초점을 옮기지 않는다
              e.preventDefault();
              if (escapedRef.current && buttonRef.current?.isConnected) buttonRef.current.focus({ preventScroll: true });
              escapedRef.current = false;
            }}
            onEscapeKeyDown={() => {
              escapedRef.current = true;
            }}
            // 부모를 누르면 바깥 누르기가 아니다 — 부모의 누르기가 열고 닫는다
            onInteractOutside={(e) => {
              if (e.target instanceof Node && buttonRef.current?.contains(e.target)) e.preventDefault();
            }}
            onPointerEnter={(e) => hover("content", true, e)}
            onPointerLeave={(e) => hover("content", false, e)}
            onKeyDown={(e) => {
              if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
              const list = rows();
              const at = list.indexOf(e.target as HTMLElement);
              const button = buttonRef.current;
              if (!button) return;
              if (e.shiftKey && at === 0) {
                // 첫 줄에서 Shift+Tab — 부모로
                e.preventDefault();
                button.focus({ preventScroll: true });
                hide();
              } else if (!e.shiftKey && at === list.length - 1) {
                // 마지막 줄에서 Tab — 부모에 초점을 두면 브라우저의 Tab 이 부모 다음 칸으로 간다
                button.focus({ preventScroll: true });
                hide();
              }
            }}
          >
            <div aria-hidden data-slot="side-navigation-flyout-label" className={FLYOUT_LABEL}>
              {label}
            </div>
            <SubPlacementContext.Provider value={placement}>
              <ul className="m-0 flex list-none flex-col p-0">{subs}</ul>
            </SubPlacementContext.Provider>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </li>
  );
});
FlyoutParent.displayName = "SideNavigationFlyoutParent";

// ── 하위 항목 ────────────────────────────────────────────────
// 부모 아래 목록 — 최소 44 · 이름이 부모 이름과 같은 자리(8 + 아이콘 20 + 12 = 40)
const SUB_ITEM = "pl-[40px] pr-x2";
// 펼침 메뉴의 줄 — 최소 44 · 좌우 16 · t4 · 400 · fg-neutral. 키보드 포커스는 알약 자리(좌우 8 · 모서리 12)의 안쪽 링
const FLYOUT_ITEM = [
  "group/side-navigation-flyout-item relative flex min-h-[44px] items-center px-x4 font-sans text-t4 font-normal no-underline outline-none scroll-my-x2",
  "after:pointer-events-none after:absolute after:inset-y-0 after:inset-x-x2 after:rounded-r3 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
].join(" ");
// 알약 — 마우스를 올리거나 누르면 좌우 8 들어오며 칠해진다. 지금 화면 줄은 늘 bg-neutral-weak-pressed
const FLYOUT_PILL =
  "pointer-events-none absolute inset-y-0 rounded-r3 [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing)]";
const FLYOUT_PILL_OTHER =
  "inset-x-0 bg-transparent group-hover/side-navigation-flyout-item:inset-x-x2 group-hover/side-navigation-flyout-item:bg-bg-layer-floating-pressed group-active/side-navigation-flyout-item:inset-x-x2 group-active/side-navigation-flyout-item:bg-bg-layer-floating-pressed";
const FLYOUT_PILL_CURRENT = "inset-x-x2 bg-bg-neutral-weak-pressed";
const FLYOUT_ITEM_CONTENT =
  "relative min-w-0 flex-1 break-keep [overflow-wrap:break-word] [transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const FLYOUT_ITEM_CONTENT_PRESS =
  "group-active/side-navigation-flyout-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/side-navigation-flyout-item:[scale:1]";

export interface SideNavigationSubItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  href: string;
  label: string;
  current?: boolean;
  disabled?: boolean;
}

const SideNavigationSubItem = React.forwardRef<HTMLAnchorElement, SideNavigationSubItemProps>(
  ({ href, label, current = false, disabled = false, className, onClick, onPointerDown, onKeyDown, ...props }, ref) => {
    const placement = React.useContext(SubPlacementContext);
    const content = React.useContext(ContentContext);
    const flyout = placement.kind === "flyout";
    const common = {
      ref,
      href: disabled ? undefined : href,
      role: disabled ? "link" : undefined,
      "aria-disabled": disabled || undefined,
      "aria-current": current ? ("page" as const) : undefined,
      "data-current": current || undefined,
      "data-disabled": disabled || undefined,
      onPointerDown: (e: React.PointerEvent<HTMLAnchorElement>) => {
        measurePress(e.currentTarget);
        onPointerDown?.(e);
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (isPressKey(e)) measurePress(e.currentTarget);
        onKeyDown?.(e);
      },
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
        if (isModifiedClick(e)) return;
        content.onNavigate?.();
        if (placement.kind === "flyout") placement.close();
      },
    };
    if (flyout) {
      return (
        <li className="flex flex-col">
          <a
            {...common}
            data-slot="side-navigation-flyout-item"
            className={cn(FLYOUT_ITEM, disabled ? "cursor-not-allowed text-fg-disabled" : "cursor-pointer text-fg-neutral", className)}
            {...props}
          >
            {!disabled && <span aria-hidden className={cn(FLYOUT_PILL, current ? FLYOUT_PILL_CURRENT : FLYOUT_PILL_OTHER)} />}
            <span className={cn(FLYOUT_ITEM_CONTENT, !disabled && FLYOUT_ITEM_CONTENT_PRESS)}>{label}</span>
          </a>
        </li>
      );
    }
    const colors = tone(current, disabled);
    return (
      <li className="flex">
        <a
          {...common}
          data-slot="side-navigation-sub-item"
          className={cn(ITEM, SUB_ITEM, disabled ? ITEM_DISABLED : current ? ITEM_CURRENT : ITEM_HOVER, className)}
          {...props}
        >
          <span className={cn(ITEM_CONTENT, !disabled && ITEM_CONTENT_PRESS)}>
            <span className={cn(ITEM_LABEL, colors.label)}>{label}</span>
          </span>
        </a>
      </li>
    );
  },
);
SideNavigationSubItem.displayName = "SideNavigationSubItem";

// ── 바닥 ─────────────────────────────────────────────────────
// 계정 · 보조 링크 — 고정, 안쪽 8. 비면 그리지 않는다
const SideNavigationFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  if (React.Children.toArray(children).length === 0) return null;
  return (
    <div ref={ref} data-slot="side-navigation-footer" className={cn("shrink-0 p-x2", className)} {...props}>
      {children}
    </div>
  );
});
SideNavigationFooter.displayName = "SideNavigationFooter";

export {
  SideNavigation,
  SideNavigationHeader,
  SideNavigationContent,
  SideNavigationGroup,
  SideNavigationItem,
  SideNavigationSubItem,
  SideNavigationFooter,
};
