import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { NotificationBadge } from "@/components/ui/notification-badge";

/*
 * Porest Bottom Navigation — porest 의 떠 있는 알약(2026-10-04 사용자 결정 4B · 5A · 6B · 7A). 규칙은 SEED Bottom Navigation
 * (5칸 · 라벨 5자 · 최대 480 · 배지 2칸 · 글자 크기 설정을 따르지 않음). 수치 원본은 specs/components/bottom-navigation.yaml.
 *
 *   BottomNavigation           바(<nav aria-label="주 메뉴">) — Desk 앱 · Desk 웹 768 미만의 주 메뉴. 칸 다섯(홈 · 가계부 · + · 캘린더 · 전체)이
 *                              어느 화면에서나 같다. compact · defaultCompact · onCompactChange(손으로 다룰 때), scrollRoot(줄어들기를 셀
 *                              스크롤 상자 — 주지 않으면 화면 안의 세로 스크롤 모두). 줄어든 바를 누르면 펴진다
 *   BottomNavigationItem       탭 칸(<a>) — href · icon(lucide) · label(한글 5자 이내) · current(aria-current="page") ·
 *                              notification(알림 점 — 칸 이름 뒤에 "새 소식") · onReselect(지금 탭을 다시 눌렀을 때)
 *   BottomNavigationAddButton  가운데 +(<button type="button">) — 그 화면의 추가. aria-label 필수("거래 추가" · "일정 추가")
 *   BOTTOM_NAVIGATION_INSET    본문 아래 여백 CSS 식 — 셸이 본문 스크롤의 padding-bottom 에 쓴다(마지막 줄이 바 위 24 에서 끝난다)
 *
 * 줄어들기 — 아래로 20 이상 스크롤하면 줄어들고(48), 위로 28 이상 스크롤하거나 맨 위 40 안으로 오면 펴진다(스크롤 방향이 바뀌면 다시 센다).
 *   가로 스크롤 · 시트 · 대화상자 · 떠 있는 목록(팝오버) 안의 스크롤은 세지 않는다. 줄어든 바 어디를 눌러도 펴진다 — 칸을 눌렀으면 그 칸의 일도 한다
 *   (다른 탭이면 그 탭으로, 지금 탭이면 다시 누르기 — 첫 화면 · 맨 위로. 2026-10-15 Q-014).
 *   줄어들어도 칸마다 이름은 남는다(라벨은 보이지 않게만 — sr-only). 라벨은 줄어들기 시작할 때 사라지고 다 펴진 뒤(200ms) 나타난다.
 *   화면 키보드가 열리면 바를 가린다(visualViewport 가 화면보다 150 넘게 작을 때).
 * 다시 누르기 — 지금 탭(current)을 누르면 링크로 옮기지 않고(같은 주소를 쌓지 않는다) onReselect 를 부른다(그 칸의 onClick 대신).
 *   onReselect 를 주지 않으면: 맨 위로 스크롤하고, 지금 주소가 그 탭의 첫 화면(href)이 아니면 주소를 href 로 고쳐 간다(location.replace).
 *   라우터를 쓰는 셸은 onReselect 에서 navigate(href, { replace: true }) 와 받은 scrollToTop() 을 부른다. 탭마다 스크롤을 기억하는 것은 셸의 몫이다.
 *
 * 바: 떠 있는 알약 — 펼침 66(위아래 6 · 좌우 10) · 화면 끝에서 좌우 14 · 아래 max(14, 아래 안전 영역 − 6), 줄어듦 48(위아래 4 · 좌우 8) ·
 *   좌우 36 · 아래 max(12, 아래 안전 영역 − 8). 좌우 안전 영역을 더한다. 최대 480 으로 가운데. 칸 다섯을 똑같이 나눈다(사이 2).
 *   불투명 bg-layer-floating(흐림 없음) · shadow-s3(다크는 -dark 짝) · 안쪽 1px stroke-neutral-subtle · 모서리 full · z-sticky 50.
 * 칸: 아이콘 24 위 · 라벨 아래(사이 2), 라벨 t1 11 / 15 · 500 고정 크기(text-t1-static — 글자 크기 설정을 따르지 않는다) · 한 줄.
 *   지금 탭은 아이콘 · 라벨 fg-neutral + 선 2.5, 다른 탭은 fg-neutral-subtle + 선 2 — 브랜드 색으로 칠하지 않는다. 굵기 · 크기는 그대로.
 *   알림 점은 Notification Badge small(아이콘 상자 x 17 ~ 23 · y 1 ~ 7) — 2칸까지(개발 중에 셋째부터 알린다).
 * 가운데 +: 칸 전체가 누르는 자리, 브랜드 원 44(bg-brand-solid) + 흰 + 24(선 2.5) · 줄어듦 원 36 + 20. 라벨이 없다.
 * 상태: 호버 모양이 없다. 칸은 누르면 2px 거리 축소만(색은 그대로 — 손을 떼기 전에 고른 것처럼 보이지 않게, 기준 max(높이, 폭 ÷ 4, 24)),
 *   + 는 bg-brand-solid-pressed + 원 2px 거리 축소. 키보드 포커스에만 링 — 칸은 안쪽 2px(모서리 12), + 는 원 바깥 2px.
 * 모션: 펼침 ↔ 줄어듦 200ms easing(높이 · 자리 · 여백) · 누름 150ms pressed-scale. 모션 줄이기면 바로 바뀌고 축소하지 않는다.
 * 스낵바는 바 위 8 에 뜬다 — 바를 SnackbarAvoidOverlap 으로 감싼다(ref 는 바에 닿는다). 바가 있는 화면에 Floating Action Button 을 두지 않는다.
 */

/** 본문 아래 여백 — 바의 아래 자리 + 66 + 24. 바가 줄어도 그대로 둔다(줄 때마다 본문이 밀리지 않게) */
const BOTTOM_NAVIGATION_INSET = "calc(max(14px, env(safe-area-inset-bottom) - 6px) + 90px)";

// 줄어들기 기준(지금 Desk 웹 · 앱 값) — 아래로 20 · 위로 28 · 맨 위 40
const SHRINK_AFTER = 20;
const EXPAND_AFTER = 28;
const TOP_ZONE = 40;
// 화면 키보드 — visualViewport 가 화면보다 이만큼 작으면 열렸다고 본다
const KEYBOARD_GAP = 150;
// 세지 않는 스크롤 — 시트 · 대화상자 · 떠 있는 목록 안
const IGNORED_SCROLL = '[role="dialog"], [role="alertdialog"], [data-vaul-drawer], [data-radix-popper-content-wrapper]';

type ScrollRoot = React.RefObject<HTMLElement | null> | HTMLElement | null | undefined;
const resolveRoot = (root: ScrollRoot) => (root && "current" in root ? root.current : (root ?? null));

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type BottomNavigationContextValue = {
  compact: boolean;
  /** 라벨을 보이지 않게(sr-only) — 줄어들기 시작할 때 · 다 펴질 때까지 */
  labelsHidden: boolean;
  scrollToTop: () => void;
};
const BottomNavigationContext = React.createContext<BottomNavigationContextValue | null>(null);

function useBottomNavigation(name: string) {
  const ctx = React.useContext(BottomNavigationContext);
  if (!ctx) throw new Error(`${name} 는 BottomNavigation 안에 둔다.`);
  return ctx;
}

// ── 바 ───────────────────────────────────────────────────────
const ROOT = [
  "fixed z-(--z-sticky) mx-auto grid max-w-[480px] grid-cols-5 gap-[2px] rounded-full bg-bg-layer-floating font-sans",
  "shadow-[var(--shadow-s3),inset_0_0_0_1px_var(--color-stroke-neutral-subtle)]",
  "[transition:height_var(--motion-duration-d4)_var(--motion-ease-easing),left_var(--motion-duration-d4)_var(--motion-ease-easing),right_var(--motion-duration-d4)_var(--motion-ease-easing),bottom_var(--motion-duration-d4)_var(--motion-ease-easing),padding_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:transition-none",
].join(" ");
// 펼침 66 · 화면 끝 14 · 아래 max(14, 안전 영역 − 6) / 줄어듦 48 · 36 · max(12, 안전 영역 − 8)
const ROOT_REGULAR = [
  "h-[66px] px-x2_5 py-x1_5",
  "left-[calc(var(--spacing-x3_5)+env(safe-area-inset-left))] right-[calc(var(--spacing-x3_5)+env(safe-area-inset-right))]",
  "bottom-[max(14px,calc(env(safe-area-inset-bottom)-6px))]",
].join(" ");
const ROOT_COMPACT = [
  "h-[48px] cursor-pointer px-x2 py-0",
  "left-[calc(var(--spacing-x9)+env(safe-area-inset-left))] right-[calc(var(--spacing-x9)+env(safe-area-inset-right))]",
  "bottom-[max(12px,calc(env(safe-area-inset-bottom)-8px))]",
].join(" ");

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  /** 줄어든 바 — 주면 제어한다(줄어들기 · 펴지기를 onCompactChange 로 알린다) */
  compact?: boolean;
  defaultCompact?: boolean;
  onCompactChange?: (compact: boolean) => void;
  /** 줄어들기를 셀 스크롤 상자 — 주지 않으면 화면 안의 세로 스크롤 모두(시트 · 가로 줄 빼고) */
  scrollRoot?: React.RefObject<HTMLElement | null> | HTMLElement | null;
}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  ({ compact: compactProp, defaultCompact = false, onCompactChange, scrollRoot, className, onClick, children, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultCompact);
    const controlled = compactProp !== undefined;
    const compact = controlled ? compactProp : inner;
    const compactRef = React.useRef(compact);
    const onChangeRef = React.useRef(onCompactChange);
    React.useLayoutEffect(() => {
      compactRef.current = compact;
      onChangeRef.current = onCompactChange;
    });
    const setCompact = React.useCallback(
      (next: boolean) => {
        if (next === compactRef.current) return;
        compactRef.current = next;
        if (!controlled) setInner(next);
        onChangeRef.current?.(next);
      },
      [controlled],
    );

    // 라벨 — 줄어들기 시작하면 바로 숨기고, 펴질 때는 다 펴진 뒤(200ms) 보인다. 모션 줄이기면 바로
    const [labelsHidden, setLabelsHidden] = React.useState(compact);
    React.useEffect(() => {
      if (compact) {
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
    }, [compact]);

    // 줄어들기 — 세로 스크롤마다 방향별로 거리를 센다(방향이 바뀌면 다시)
    const lastScrolledRef = React.useRef<Element | null>(null);
    React.useEffect(() => {
      const lastY = new WeakMap<Element, number>();
      let direction = 0;
      let distance = 0;
      const doc = document;
      if (doc.scrollingElement) lastY.set(doc.scrollingElement, doc.scrollingElement.scrollTop);
      const onScroll = (e: Event) => {
        const target = e.target === doc ? doc.scrollingElement : e.target;
        if (!(target instanceof Element)) return;
        const root = resolveRoot(scrollRoot);
        if (root ? target !== root : target !== doc.scrollingElement && target.closest(IGNORED_SCROLL)) return;
        const y = target.scrollTop;
        const prev = lastY.get(target);
        lastY.set(target, y);
        // 가로 스크롤 — 세로 위치가 그대로다
        if (prev === undefined || y === prev) {
          if (prev === undefined && y <= TOP_ZONE) setCompact(false);
          return;
        }
        lastScrolledRef.current = target;
        if (y <= TOP_ZONE) {
          direction = 0;
          distance = 0;
          setCompact(false);
          return;
        }
        const next = y > prev ? 1 : -1;
        if (next !== direction) {
          direction = next;
          distance = 0;
        }
        distance += Math.abs(y - prev);
        if (direction === 1 && distance >= SHRINK_AFTER) setCompact(true);
        else if (direction === -1 && distance >= EXPAND_AFTER) setCompact(false);
      };
      doc.addEventListener("scroll", onScroll, { capture: true, passive: true });
      return () => doc.removeEventListener("scroll", onScroll, { capture: true });
    }, [scrollRoot, setCompact]);

    // 화면 키보드가 열리면 가린다
    const [keyboardOpen, setKeyboardOpen] = React.useState(false);
    React.useEffect(() => {
      const vv = window.visualViewport;
      if (!vv) return;
      const check = () => setKeyboardOpen(window.innerHeight - vv.height * vv.scale > KEYBOARD_GAP);
      vv.addEventListener("resize", check);
      check();
      return () => vv.removeEventListener("resize", check);
    }, []);

    const scrollToTop = React.useCallback(() => {
      const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
      const root = resolveRoot(scrollRoot);
      const box = root ?? (lastScrolledRef.current?.isConnected ? lastScrolledRef.current : null);
      if (box && box !== document.scrollingElement) box.scrollTo({ top: 0, behavior });
      window.scrollTo({ top: 0, behavior });
    }, [scrollRoot]);

    const own = React.useRef<HTMLElement | null>(null);
    // 알림 배지는 2칸까지(SEED) — 개발 중에 알린다
    React.useEffect(() => {
      if (!import.meta.env.DEV) return;
      const marked = own.current?.querySelectorAll("[data-notification]").length ?? 0;
      if (marked > 2) console.warn("[BottomNavigation] 알림 배지는 2칸까지 단다 — 3칸 이상에 달지 않는다.");
    });

    const value = React.useMemo(() => ({ compact, labelsHidden, scrollToTop }), [compact, labelsHidden, scrollToTop]);
    return (
      <BottomNavigationContext.Provider value={value}>
        <nav
          ref={(node) => {
            own.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          aria-label="주 메뉴"
          data-slot="bottom-navigation"
          data-compact={compact || undefined}
          className={cn(ROOT, compact ? ROOT_COMPACT : ROOT_REGULAR, keyboardOpen && "invisible", className)}
          // 줄어든 바 어디를 눌러도 펴진다 — 칸을 눌렀으면 그 탭으로도 간다
          onClick={(e) => {
            onClick?.(e);
            if (compactRef.current) setCompact(false);
          }}
          {...props}
        >
          {children}
        </nav>
      </BottomNavigationContext.Provider>
    );
  },
);
BottomNavigation.displayName = "BottomNavigation";

// ── 칸 ───────────────────────────────────────────────────────
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

// 칸 — 아이콘 위 · 라벨 아래(사이 2), 칸 전체가 누르는 자리. 누르면 칸만 2px 거리 축소(색은 그대로), 키보드 포커스에 안쪽 2px 링
const ITEM = [
  "relative flex h-full min-w-0 cursor-pointer flex-col items-center justify-center gap-[2px] rounded-r3 no-underline",
  "[&_svg]:size-6 [&_svg]:shrink-0",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis,54))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 지금 탭 — 짙은 글자색 + 선 2.5 / 다른 탭 — fg-neutral-subtle + 선 2
const ITEM_CURRENT = "text-fg-neutral [&_svg]:[stroke-width:2.5]";
const ITEM_OTHER = "text-fg-neutral-subtle [&_svg]:[stroke-width:2]";
// 라벨 — 11 / 15 · 500 고정 크기 · 한 줄
const LABEL = "block max-w-full truncate whitespace-nowrap text-t1-static font-medium";

export interface BottomNavigationItemProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  href: string;
  /** lucide 선 아이콘 — 24, 선 2(지금 탭 2.5) */
  icon: React.ReactNode;
  /** 라벨 — 한글 5자 이내의 명사. 줄어든 바에서도 칸의 이름으로 남는다 */
  label: string;
  /** 지금 탭 — aria-current="page" */
  current?: boolean;
  /** 알림 점 — 칸 이름 뒤에 "새 소식". 2칸까지 */
  notification?: boolean;
  /** 지금 탭을 다시 눌렀을 때(onClick 대신) — 주지 않으면 맨 위로 + 첫 화면(href)이 아니면 주소를 고쳐 간다 */
  onReselect?: (detail: { href: string; scrollToTop: () => void }) => void;
}

// 지금 주소가 그 탭의 첫 화면인가
function isAt(href: string) {
  const url = new URL(href, window.location.href);
  const here = window.location;
  return url.pathname === here.pathname && url.search === here.search && url.hash === here.hash;
}

const BottomNavigationItem = React.forwardRef<HTMLAnchorElement, BottomNavigationItemProps>(
  ({ href, icon, label, current = false, notification = false, onReselect, className, onClick, onPointerDown, onKeyDown, ...props }, ref) => {
    const ctx = useBottomNavigation("BottomNavigationItem");
    return (
      <a
        ref={ref}
        href={href}
        aria-current={current ? "page" : undefined}
        data-slot="bottom-navigation-item"
        data-current={current || undefined}
        data-notification={notification || undefined}
        className={cn(ITEM, current ? ITEM_CURRENT : ITEM_OTHER, className)}
        onPointerDown={(e) => {
          measurePress(e.currentTarget);
          onPointerDown?.(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") measurePress(e.currentTarget);
          onKeyDown?.(e);
        }}
        onClick={(e) => {
          if (!current) {
            onClick?.(e);
            return;
          }
          // 지금 탭 — 같은 주소를 쌓지 않는다. 새 탭으로 여는 누르기는 브라우저에 맡긴다
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          if (onReselect) {
            onReselect({ href, scrollToTop: ctx.scrollToTop });
            return;
          }
          ctx.scrollToTop();
          if (!isAt(href)) window.location.replace(href);
        }}
        {...props}
      >
        <NotificationBadge aria-hidden visible={notification}>
          {icon}
        </NotificationBadge>
        <span data-slot="bottom-navigation-label" className={ctx.labelsHidden ? "sr-only" : LABEL}>
          {label}
        </span>
        {notification && <span className="sr-only">새 소식</span>}
      </a>
    );
  },
);
BottomNavigationItem.displayName = "BottomNavigationItem";

// ── 가운데 + ────────────────────────────────────────────────
// 칸 전체가 누르는 자리 — 브랜드 원 44(줄어듦 36) + 흰 + 24(20). 누르면 원만 누름 색 + 2px 거리 축소, 키보드 포커스에 원 바깥 2px 링
const ADD = "group/bottom-navigation-add relative flex h-full min-w-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none";
const ADD_CIRCLE = [
  "flex shrink-0 items-center justify-center rounded-full bg-bg-brand-solid text-static-white [&_svg]:shrink-0 [&_svg]:[stroke-width:2.5]",
  "[transition:background-color_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale),width_var(--motion-duration-d4)_var(--motion-ease-easing),height_var(--motion-duration-d4)_var(--motion-ease-easing)]",
  "motion-reduce:[transition:background-color_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-active/bottom-navigation-add:bg-bg-brand-solid-pressed group-active/bottom-navigation-add:[scale:calc(1-2/var(--add-basis))] motion-reduce:group-active/bottom-navigation-add:[scale:1]",
  "group-focus-visible/bottom-navigation-add:outline-2 group-focus-visible/bottom-navigation-add:outline-offset-2 group-focus-visible/bottom-navigation-add:outline-stroke-focus-ring",
].join(" ");

export interface BottomNavigationAddButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label"> {
  /** 그 화면의 추가 — "거래 추가"(홈 · 가계부 · 전체) · "일정 추가"(캘린더) */
  "aria-label": string;
}

const BottomNavigationAddButton = React.forwardRef<HTMLButtonElement, BottomNavigationAddButtonProps>(({ className, ...props }, ref) => {
  const { compact } = useBottomNavigation("BottomNavigationAddButton");
  return (
    <button ref={ref} type="button" data-slot="bottom-navigation-add" className={cn(ADD, className)} {...props}>
      <span
        aria-hidden
        data-slot="bottom-navigation-add-circle"
        className={cn(ADD_CIRCLE, compact ? "size-9 [--add-basis:36] [&_svg]:size-5" : "size-11 [--add-basis:44] [&_svg]:size-6")}
      >
        <Plus />
      </span>
    </button>
  );
});
BottomNavigationAddButton.displayName = "BottomNavigationAddButton";

export { BottomNavigation, BottomNavigationItem, BottomNavigationAddButton, BOTTOM_NAVIGATION_INSET };
