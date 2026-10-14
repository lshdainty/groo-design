import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Porest Scroll Fog — 구조는 SEED Scroll Fog(2026-10-03). 수치 원본은 specs/components/scroll-fog.yaml.
 * 스크롤되는 영역의 끝을 흐려 뒤에 더 있다는 것을 알린다. 색을 덮는 막이 아니라 스크롤 상자에 거는 투명도 마스크라 어느 바탕
 * (흰 면 · 회색 바탕 · 다크)에서도 같고, 흐린 자리의 칩 · 줄도 그대로 눌린다. 스크롤 위치 · 넘침을 재지 않고 늘 켜 둔다.
 *
 *   ScrollFog     스크롤 상자 — 이 상자가 곧 스크롤 상자다. 높이 · 폭은 부르는 쪽이 className 으로 정하고, 그 밖은 div 속성
 *     use         흐림의 방향 · 깊이와 안쪽 여백 · 스크롤 여유(scroll-padding)를 정한다
 *                 box(기본 — 카드 · 상자 안의 높이를 정한 스크롤. 넘치는 방향의 양 끝 20, 안쪽 여백 · 스크롤 여유 20) ·
 *                 row(칩 필터 바 · 제안 칩 줄 · 가로 카드 줄. 좌우 20, 안쪽 여백 · 스크롤 여유는 화면 여백 24, 스크롤바는 숨긴다) ·
 *                 overlayBody(시트 · 대화상자 · 팝오버의 넘칠 수 있는 본문. 위 20 · 아래 80, 안쪽 여백 · 스크롤 여유도 위 20 · 아래 80) ·
 *                 page(바닥 고정 버튼이 있는 화면 전체 스크롤. overlayBody 와 같은 위 20 · 아래 80 — 바닥 버튼 위에서 끝난다)
 *   useScrollFog  다른 부품의 스크롤 상자에 같은 흐림을 건다 — Dialog · Bottom Sheet · Popover 본문(scrollFog), Chip 의 가로 줄,
 *                 Chip Tabs 목록. 여백 · 스크롤 여유는 그 부품이 둔다
 *
 * box 는 세로가 기본이다. 가로로 넘기는 상자는 overflow-x-auto overflow-y-hidden 을 주면 흐림 · 여백 · 스크롤 여유가 좌우로 간다
 * (상자의 overflow 로 정한다 — 넘쳤는지는 재지 않는다).
 *
 * 마스크 — gradient-fade-mask(알파 0 → 1, 16단계, v104)를 흐린 쪽마다 상자 전체 크기의 층 하나로 깔고 겹친 층을 곱한다
 *   (mask-composite: intersect — scroll-fog.yaml fog.mask · SEED Scroll Fog 와 같다). 토큰은 방향이 없는(위 → 아래) 그라디언트라 쪽마다
 *   방향(to bottom · to top · to right · to left)을 붙이고, 퍼센트 단계를 그 쪽 깊이의 몫(calc(깊이 × 비율))으로 바꿔 깊이 안에서
 *   불투명에 닿게 한다 — 가운데는 두 층 모두 불투명이라 그대로 보인다. CSS 변수 하나에는 방향을 붙일 수 없어 처음 그릴 때(레이아웃 효과)
 *   토큰 값을 읽어 이 상자의 mask-* 로 넣는다. 층이 상자 전체 크기라 상자 크기가 바뀌어도 다시 재지 않는다. 토큰이 없으면 흐리지 않는다
 *   (개발 중에 알린다). 2026-10-08 까지는 처음 · 끝 흐림과 가운데 불투명 층을 겹치지 않게 이어 붙였다 — 상자가 두 깊이의 합보다 낮으면
 *   두 흐림이 겹친 자리에서 더해져(add) 덜 흐렸고, YAML 설명과도 달랐다.
 * 깊이만큼 여백 — 흐린 쪽에 깊이 이상의 안쪽 여백을 둬 끝까지 스크롤하면 흐림이 빈 여백 위에 놓인다. 안쪽 여백은 안쪽 감싸개에 둔다
 *   (내용과 함께 스크롤된다 — 흐림 아래에 깔린다). 키보드로 옮긴 요소가 흐림 아래 멈추지 않게 스크롤 여유를 같은 만큼 둔다.
 * 흐림은 장식이다 — 역할 · 이름이 없다. 안에 초점 가는 요소가 없으면 상자에 tabIndex={0} · role="region" 과 이름(aria-label)을 준다
 * (키보드 스크롤 — 역할 없는 div 에는 이름을 달 수 없다, Scroll Area). 시트 · 대화상자 · 팝오버 안의 상자는 className 에 overscroll-contain.
 * 스크롤바는 전역 한 벌(styles/porest-shadcn-bridge.css)이고 숨기는 것은 가로 줄(row)뿐이다.
 * 부품이 제 안개를 가진 자리(Wheel Picker · Date Picker 이어지는 달)에는 겹쳐 걸지 않는다.
 */

export type ScrollFogUse = "box" | "row" | "overlayBody" | "page";
type FogAxis = "x" | "y";

// 흐림 깊이(scroll-fog.yaml) — 시작 쪽(위 · 왼쪽) · 끝 쪽(아래 · 오른쪽)
const DEPTH: Record<ScrollFogUse, { start: string; end: string }> = {
  box: { start: "20px", end: "20px" },
  row: { start: "20px", end: "20px" },
  overlayBody: { start: "20px", end: "80px" },
  page: { start: "20px", end: "80px" },
};

// 방향 없이 적힌(위 → 아래) 그라디언트 토큰에 방향을 붙인다
const withDirection = (token: string, direction: string) => token.replace(/^linear-gradient\(/, `linear-gradient(${direction}, `);
// 꽉 찬 층 — 흐리지 않는 쪽(깊이 0). 곱해도 아무것도 가리지 않는다
const SOLID = "linear-gradient(#000, #000)";

// 한 축의 마스크 — 흐린 쪽마다 상자 전체 크기의 층 하나(시작 쪽은 투명 → 불투명, 끝 쪽은 반대 방향). 단계는 그 쪽 깊이의 몫이라
// 깊이 안에서 불투명에 닿는다. 두 층은 COMPOSITE 로 곱한다
function fogMask(token: string, axis: FogAxis, start: string, end: string) {
  const from = axis === "y" ? "to bottom" : "to right";
  const to = axis === "y" ? "to top" : "to left";
  const layers = [start, end].map((depth, i) =>
    parseFloat(depth) > 0 ? withDirection(token.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`), i === 0 ? from : to) : SOLID,
  );
  return { image: layers.join(", "), size: "100% 100%, 100% 100%", position: "0 0, 0 0" };
}

const MASK_PROPERTIES = ["image", "size", "position", "repeat"] as const;
// 겹친 층을 곱한다 — 두 층을 모두 지나야 보인다. -webkit-mask-composite 는 옛 이름만 받는다(source-in 이 intersect 와 같은 셈)
const COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" } as const;

// box 의 축 — 가로로만 스크롤하는 상자(overflow-x auto · scroll, overflow-y 는 아님)면 좌우, 아니면 위아래
function axisOf(el: HTMLElement, use: ScrollFogUse): FogAxis {
  if (use === "row") return "x";
  if (use !== "box") return "y";
  const style = getComputedStyle(el);
  const scrolls = (v: string) => v === "auto" || v === "scroll";
  return scrolls(style.overflowX) && !scrolls(style.overflowY) ? "x" : "y";
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
let warnedNoToken = false;

// 스크롤 상자에 흐림을 건다(use 가 null 이면 걸지 않는다). 축은 상자에 data-fog-axis 로 남긴다 — 여백 · 스크롤 여유가 따른다.
// rerunKey 가 바뀌면(상자의 overflow 를 바꾸는 className 등) 축을 다시 정한다
function useScrollFog(ref: React.RefObject<HTMLElement | null>, use: ScrollFogUse | null, rerunKey?: unknown) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !use) return;
    const token = getComputedStyle(el).getPropertyValue("--gradient-fade-mask").trim();
    // 방향 없이 색부터 시작하는 linear-gradient 여야 방향을 붙일 수 있다
    if (!/^linear-gradient\(\s*(#|rgb|hsl|transparent)/i.test(token)) {
      if (import.meta.env.DEV && !warnedNoToken) {
        warnedNoToken = true;
        console.warn("[ScrollFog] 토큰 --gradient-fade-mask 를 읽지 못해 흐리지 않는다 — tokens.css 를 불러왔는지 본다.", el);
      }
      return;
    }
    const axis = axisOf(el, use);
    const { start, end } = DEPTH[use];
    const mask = { ...fogMask(token, axis, start, end), repeat: "no-repeat" };
    el.setAttribute("data-fog-axis", axis);
    for (const p of MASK_PROPERTIES) {
      el.style.setProperty(`mask-${p}`, mask[p]);
      el.style.setProperty(`-webkit-mask-${p}`, mask[p]);
    }
    for (const [p, v] of Object.entries(COMPOSITE)) el.style.setProperty(p, v);
    return () => {
      el.removeAttribute("data-fog-axis");
      for (const p of MASK_PROPERTIES) {
        el.style.removeProperty(`mask-${p}`);
        el.style.removeProperty(`-webkit-mask-${p}`);
      }
      for (const p of Object.keys(COMPOSITE)) el.style.removeProperty(p);
    };
  }, [ref, use, rerunKey]);
}

// 스크롤 상자 — 자리마다 넘침 · 스크롤 여유. box 는 축(data-fog-axis)을 따른다
const ROOT: Record<ScrollFogUse, string> = {
  box: "overflow-y-auto scroll-py-[20px] data-[fog-axis=x]:scroll-py-0 data-[fog-axis=x]:scroll-px-[20px]",
  row: "overflow-x-auto overflow-y-hidden scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  overlayBody: "overflow-y-auto scroll-pt-[20px] scroll-pb-[80px]",
  page: "overflow-y-auto scroll-pt-[20px] scroll-pb-[80px]",
};

// 안쪽 감싸개 — 흐린 쪽에 깊이 이상의 여백(내용과 함께 스크롤된다). 가로면 내용 폭만큼 넓어져 끝 여백이 내용 끝에 붙는다
const CONTENT: Record<ScrollFogUse, string> = {
  box: "py-[20px] group-data-[fog-axis=x]/scroll-fog:w-max group-data-[fog-axis=x]/scroll-fog:min-w-full group-data-[fog-axis=x]/scroll-fog:px-[20px] group-data-[fog-axis=x]/scroll-fog:py-0",
  row: "w-max min-w-full px-global-gutter",
  overlayBody: "pb-[80px] pt-[20px]",
  page: "pb-[80px] pt-[20px]",
};

export interface ScrollFogProps extends React.HTMLAttributes<HTMLDivElement> {
  /** box(기본) · row(가로 줄) · overlayBody(시트 · 대화상자 · 팝오버 본문) · page(바닥 고정 버튼이 있는 화면) */
  use?: ScrollFogUse;
}

const ScrollFog = React.forwardRef<HTMLDivElement, ScrollFogProps>(({ use = "box", className, children, ...props }, ref) => {
  const own = React.useRef<HTMLDivElement>(null);
  useScrollFog(own, use, className);
  return (
    <div
      ref={mergeRefs(ref, own)}
      data-slot="scroll-fog"
      data-use={use}
      className={cn("group/scroll-fog relative", ROOT[use], className)}
      {...props}
    >
      <div data-slot="scroll-fog-content" className={CONTENT[use]}>
        {children}
      </div>
    </div>
  );
});
ScrollFog.displayName = "ScrollFog";

export { ScrollFog, useScrollFog };
