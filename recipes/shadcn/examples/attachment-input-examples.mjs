/*
 * shadcn Attachment Input 예제 — docs site components/attachment-input.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(영수증 첨부 — 타일 · 파일 하나 가져오기 — 드롭존 · 대표 사진 · 순서 바꾸기)은 차례 · 제목 · 코드가
 * specs/components/attachment-input.md 의 "코드" 절과 같고, 마지막(읽기 전용 · 막힘)은 md 의 State 를 코드로 더 보인다.
 * 구조는 당근 SEED Attachment Input(seed-design.io/components/attachment-input — rootage attachment-input · -trigger · -item · -item-action-button ·
 * -item-remove-button · -dropzone, Apache-2.0)을 따른다 — 첨부 타일 80 · 사진 80 · 파일 카드 160 × 80 · × 20 · 올리는 중 원 24 · 실패 다시 시도 · 대표 띠 ·
 * 순서 바꾸기 · 드롭존(2026-10-15 사용자 결정 3A · 4A · 5A). 드롭존 색 · 파일 이름 네 줄 · 항목 메뉴 · 포커스 링은 groo 가 정했다(11D · 12A · 13B · 14A).
 * groo 에 처음 두는 예제다 — DESIGN.md 의 옛 File Upload 절(v73)을 대신한다.
 *
 * ROOT · ROW_TILE · ROW_DROPZONE · ROW_CONTENT · LIST · TRIGGER · TRIGGER_ICON · COUNT · COUNT_NOW · COUNT_MAX · MASK · ITEM · ITEM_KIND · IMAGE · IMAGE_FALLBACK ·
 * THUMBNAIL · META · NAME · NAME_CLEAR · NAME_MEASURE · NAME_EXT · SIZE · BACKDROP · BACKDROP_UPLOADING · BACKDROP_ERROR · BADGE · BADGE_LABEL · ACTION · ACTION_KIND ·
 * REMOVE · ITEM_ROOT · DROPZONE · DROPZONE_LABEL · PICK_NARROW · MENU_LABEL 은 recipes/shadcn/components/ui/attachment-input.tsx 의 상수와 글자 하나까지 같아야
 * 한다 — 두 파일을 함께 고친다. 항목 줄의 FOG_* 는 scroll-fog.tsx(use row — scroll-fog-examples.mjs 의 것과 같다), 원의 PC_* 는 progress-circle.tsx,
 * 파일 선택의 BUTTON_* 는 button.tsx(neutralWeak · small · large), 칸 둘레의 FIELD_* 는 field.tsx 의 값이다(quantity-picker-examples.mjs 의 것과 같다).
 * attachment-input.tsx 가 cn() 으로 합칠 때 지워지는 것은 사진 항목의 하나뿐이다 — cn(ITEM, ITEM_KIND.image) 에서 tailwind-merge 가 ITEM 의
 * [transition:scale_…pressed-scale…] 을 지우고 사진의 [transition:opacity_… d4 · scale_… d4] 를 남긴다(merge()). 규칙은 specs/components/attachment-input.md,
 * 수치 원본은 attachment-input.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 칸 <div role="group" data-slot="attachment-input" data-layout> > (드롭존 <div data-slot="attachment-input-dropzone"> ·
 * 파일 선택 버튼) · 항목 줄(tile — Scroll Fog row <div data-slot="attachment-input-row" data-use="row"> > <div data-slot="scroll-fog-content"> > 첨부 타일 +
 * 목록 <ul data-slot="attachment-input-items">) > 항목 자리 <li data-slot="attachment-input-item-root" data-kind data-status> > 항목
 * <div data-slot="attachment-input-item">(사진 · 파일 카드 · 덮개 · 대표 띠) + 다시 시도 + ×(형제 — 단추 안 단추를 두지 않는다) · 고르기 창 <input type="file" hidden> ·
 * 실패 설명 · 읽기 글(polite). 끝 흐림은 레시피(useScrollFog)가 토큰 --gradient-fade-mask 에 방향을 붙여 style 로 넣는다 — 정적 HTML 은 같은 일을 빌드 때
 * DESIGN.md 의 토큰 값으로 해 style 에 적었다. id 는 레시피 · dnd-kit 이 만든다(미리보기는 읽을 수 있는 이름으로 미리 이었다). Radix · dnd-kit 이 실행 중에 붙이는
 * 것(메뉴 트리거의 id · type, 끌기 상태)과 lucide 의 class · xmlns 는 그리지 않는다. 레시피의 스크립트(고르기 · 다시 검사 · 끌어 놓기 · 순서 바꾸기 · 항목 메뉴 ·
 * 10초 멈춤 · 파일 이름 줄이기)는 정적 HTML 에 없다 — 이름이 네 줄을 넘으면 레시피는 글자 단위로 재서 셋째 줄 "…" + 넷째 줄 확장자로 줄이므로,
 * 미리보기는 재지 않아도 네 줄에 드는 이름으로 그렸다. 사진은 실제 사진이 아니라 손으로 칠한 그림(SVG)이고 가게 · 카드 이름은 지어낸 것이다.
 */

import { readFileSync } from "node:fs";

// ── attachment-input.tsx 의 상수와 같은 값 ────────────────────────────────

const ROOT = "flex min-w-0 flex-col gap-x2 font-sans";

// 항목 줄 — tile 은 화면 가장자리까지(Scroll Fog row 가 좌우 24 안쪽 여백 · 끝 흐림 20 · 스크롤바 숨김), dropzone 은 칸 안.
// 위 16 을 더 두고 같은 만큼 당긴다 — × 의 누르는 자리 44 가 위로 16(걸침 4 + 보이지 않는 여백 12) 나가도 가로 스크롤 줄에 잘리지 않는다.
// 당긴 16 은 위 칸(라벨 · 드롭존)에 겹치므로 줄 자체는 누르기를 받지 않고 안의 내용만 받는다
const ROW_TILE = "-mx-global-gutter -mt-x4 pt-x4 pointer-events-none [&>*]:pointer-events-auto";
const ROW_DROPZONE = "-mt-x4 flex flex-wrap items-start gap-x2 pt-x4 pointer-events-none [&>*]:pointer-events-auto";
const ROW_CONTENT = "flex items-start gap-x2";
const LIST = "m-0 flex list-none items-start gap-x2 p-0";

// 첨부 타일 — 80 · 모서리 12 · 안쪽 1px. 다 참 · 읽기 전용(aria-disabled) · 막힘(disabled)은 바탕 · 축소 없이 아이콘 · 개수만 fg-disabled
const TRIGGER = [
  "group/attachment-trigger relative flex size-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-x1 rounded-r3 bg-transparent font-sans",
  "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:80]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent aria-disabled:active:bg-transparent aria-disabled:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:bg-transparent disabled:active:[scale:1]",
].join(" ");
const TRIGGER_ICON =
  "size-6 shrink-0 text-fg-neutral-subtle group-aria-disabled/attachment-trigger:text-fg-disabled group-disabled/attachment-trigger:text-fg-disabled";
const COUNT = "text-t2 font-normal";
const COUNT_NOW = "text-fg-neutral group-aria-disabled/attachment-trigger:text-fg-disabled group-disabled/attachment-trigger:text-fg-disabled";
const COUNT_MAX = "text-fg-neutral-subtle group-aria-disabled/attachment-trigger:text-fg-disabled group-disabled/attachment-trigger:text-fg-disabled";

// × 둘레 구멍 — 지름 24, 가운데가 오른쪽 위 모서리에서 안쪽 6(× 의 가운데와 같다). 끄는 동안은 구멍이 없다
const MASK =
  "[mask-image:radial-gradient(circle_at_calc(100%_-_6px)_6px,transparent_12px,#000_12.5px)] group-data-[dragging]/attachment-item:[mask-image:none]";

// 항목 상자 — 높이 80 · 모서리 12 · 윤곽(::after, 그림 위). 끄는 동안 2px 거리 축소(기준 80).
// 누를 수 있는 항목(메뉴 · 순서 바꾸기)은 role="button" — 키보드 포커스 링은 안쪽 2px
const ITEM = [
  "relative flex h-20 shrink-0 items-center justify-center gap-x2_5 rounded-r3 bg-transparent",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
  MASK,
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:80]",
  "group-data-[dragging]/attachment-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-data-[dragging]/attachment-item:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "data-[pressable]:cursor-pointer data-[sortable]:cursor-grab group-data-[dragging]/attachment-item:cursor-grabbing",
].join(" ");
// 사진은 읽기 전용 · 끄는 동안 불투명도 0.5(SEED 그대로 — 사용자 결정 2026-10-15 마무리 13B, v106 의 예외는 이 두 상태뿐) —
// 흐림 · 축소는 motion-duration-d4 · ease-easing 으로 서서히(모션 줄이기면 바로)
const ITEM_KIND = {
  image:
    "w-20 after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] [transition:opacity_var(--motion-duration-d4)_var(--motion-ease-easing),scale_var(--motion-duration-d4)_var(--motion-ease-easing)] motion-reduce:[transition:none] group-data-[readonly]/attachment-item:opacity-50 group-data-[dragging]/attachment-item:opacity-50",
  file: "w-40 px-x4 after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
};

const IMAGE = "pointer-events-none size-full select-none rounded-[inherit] object-cover";
const IMAGE_FALLBACK = "flex size-full items-center justify-center rounded-[inherit] bg-bg-neutral-weak text-fg-neutral-subtle [&>svg]:size-6";

// 파일 카드 — 썸네일 칸 48 · 이름 · 크기. 실패면 다시 시도가 채운다. 읽기 전용 · 끄는 동안 글 · 아이콘 fg-disabled(SEED — 13B)
const THUMBNAIL =
  "flex size-12 shrink-0 items-center justify-center rounded-r2 bg-bg-neutral-weak text-fg-neutral-subtle [&>svg]:size-6 group-data-[readonly]/attachment-item:text-fg-disabled group-data-[dragging]/attachment-item:text-fg-disabled group-data-[status=error]/attachment-item:hidden";
const META = "flex min-w-0 flex-1 flex-col group-data-[status=error]/attachment-item:hidden";
// 이름은 글자 단위로 줄을 바꾼다(break-all — SEED 레시피 그대로, 사용자 결정 2026-10-15 마무리 11D)
const NAME =
  "relative block break-all text-t2 font-medium text-fg-neutral group-data-[readonly]/attachment-item:text-fg-disabled group-data-[dragging]/attachment-item:text-fg-disabled";
// 첫 줄만 오른쪽 4 를 비운다(YAML name.maskClear) — 오른쪽 float 4 × 한 줄
const NAME_CLEAR = "float-right h-[1lh] w-x1";
// 줄 수를 재는 보이지 않는 같은 글(같은 폭 · 같은 첫 줄 비움)
const NAME_MEASURE = "invisible absolute inset-x-0 top-0";
const NAME_EXT = "block";
const SIZE =
  "text-t1 font-normal text-fg-neutral-subtle group-data-[readonly]/attachment-item:text-fg-disabled group-data-[dragging]/attachment-item:text-fg-disabled";

// 사진 위 덮개 — 올리는 중(라이트 0.50 · 다크 0.65) · 실패(두 모드 0.65 — 글이 얹힌다)
const BACKDROP = "absolute inset-0 flex items-center justify-center rounded-[inherit]";
const BACKDROP_UPLOADING = "bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]";
const BACKDROP_ERROR = "bg-[var(--overlay-dim-dark)]";

// 대표 띠 — 첫 사진 아래 24, 두 모드 0.65
const BADGE =
  "absolute inset-x-0 bottom-0 flex h-x6 items-center justify-center rounded-b-r3 bg-[var(--overlay-dim-dark)] px-x1 text-t2 font-medium text-static-white";
const BADGE_LABEL = "truncate";

// 다시 시도 — 항목 위에 겹친 형제(항목이 단추일 수 있다). 누르면 이것만 2px 거리 축소(기준 80)
const ACTION = [
  "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-x1 rounded-r3 bg-transparent font-sans text-t2 font-medium [&>svg]:size-6",
  MASK,
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:80]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:active:[scale:1]",
].join(" ");
const ACTION_KIND = { image: "text-static-white", file: "text-fg-neutral-subtle" };

// × — 20 원이 모서리 밖으로 위 4 · 오른쪽 4. 누르는 자리 44(::before 12 씩). 끄는 동안 사라진다. 이웃 항목 위로 올린다
const REMOVE = [
  "absolute -right-x1 -top-x1 z-[1] flex size-5 cursor-pointer items-center justify-center rounded-full bg-bg-layer-default text-fg-neutral",
  "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] [&>svg]:size-[10px]",
  "before:absolute before:-inset-x3 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:24]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "aria-disabled:cursor-not-allowed aria-disabled:text-fg-disabled aria-disabled:hover:bg-bg-layer-default aria-disabled:active:bg-bg-layer-default aria-disabled:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:bg-bg-layer-default disabled:active:bg-bg-layer-default disabled:active:[scale:1]",
  "group-data-[dragging]/attachment-item:hidden",
].join(" ");

// 항목 자리(li) — 항목 · 다시 시도 · × 를 담는다. 끄는 항목이 위로
const ITEM_ROOT = "group/attachment-item relative shrink-0 [touch-action:manipulation] data-[dragging]:z-[2]";

// 드롭존(1280 이상) — 높이 120 · 1px 실선. 끌어 들어오면 테두리 · 바탕이 바뀐다. 막히면 옅은 테두리
const DROPZONE = [
  "group/attachment-dropzone hidden h-[120px] flex-col items-center justify-center gap-x2 rounded-r3 border border-solid border-stroke-neutral-solid bg-transparent px-x4 lg:flex",
  "[transition:border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "data-[drag-over]:border-stroke-neutral-contrast data-[drag-over]:bg-bg-layer-default-pressed",
  "data-[disabled]:border-stroke-neutral-weak",
].join(" ");
const DROPZONE_LABEL = "m-0 text-center text-t4 font-medium text-fg-neutral-subtle group-data-[disabled]/attachment-dropzone:text-fg-disabled";
// 1280 미만 — 드롭존 없이 파일 선택 버튼(large · 칸 폭 · 앞 아이콘)
const PICK_NARROW = "w-full lg:hidden";

// 항목 메뉴의 줄 이름 — 크게 보기는 사진 "크게 보기" · 파일 카드 "열기"(레시피의 JSX)
const MENU_LABEL = {
  badge: "대표로 정하기",
  forward: "앞으로 옮기기",
  backward: "뒤로 옮기기",
  remove: "지우기",
};

// ── scroll-fog.tsx 의 값 — 항목 줄(use row) ───────────────────────────────

const FOG_ROOT = "group/scroll-fog relative";
const FOG_ROW = "overflow-x-auto overflow-y-hidden scroll-px-global-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const FOG_CONTENT_ROW = "w-max min-w-full px-global-gutter";
const FOG_DEPTH_ROW = { start: "20px", end: "20px" };
const FOG_SOLID = "linear-gradient(#000, #000)";
const FOG_COMPOSITE = { "mask-composite": "intersect", "-webkit-mask-composite": "source-in" };
// 토큰 값 — 레시피는 그릴 때 getComputedStyle 로 읽는다. 정적 HTML 은 DESIGN.md 의 v104 표에서 읽는다
const FADE_MASK = /`gradient-fade-mask` \| `(linear-gradient\([^`]+\))`/.exec(readFileSync(new URL("../../../DESIGN.md", import.meta.url), "utf8"))[1];
// useScrollFog 가 상자의 style 에 넣는 값(가로 — 왼쪽 · 오른쪽 20) — mask-* 와 -webkit-mask-* 를 같이, 그리고 COMPOSITE
function rowFogStyle() {
  const layer = (depth, dir) =>
    parseFloat(depth) > 0 ? FADE_MASK.replace(/(\d+(?:\.\d+)?)%/g, (_m, p) => `calc(${depth} * ${Number(p) / 100})`).replace(/^linear-gradient\(/, `linear-gradient(${dir}, `) : FOG_SOLID;
  const mask = { image: [layer(FOG_DEPTH_ROW.start, "to right"), layer(FOG_DEPTH_ROW.end, "to left")].join(", "), size: "100% 100%, 100% 100%", position: "0 0, 0 0", repeat: "no-repeat" };
  return [
    ...["image", "size", "position", "repeat"].map((p) => `mask-${p}:${mask[p]}; -webkit-mask-${p}:${mask[p]};`),
    ...Object.entries(FOG_COMPOSITE).map(([p, v]) => `${p}:${v};`),
  ].join(" ");
}

// ── progress-circle.tsx 의 값 — 올리는 중 원(size 24 · 값 있는 원) ─────────────

const PC_SIZE = { 24: "[--pc-size:24px] [--pc-thickness:3px]" };
const PC_TONE = {
  neutral: "[--pc-track:var(--color-stroke-neutral-subtle)] [--pc-range:var(--color-stroke-neutral-solid)]",
  staticWhite: "[--pc-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--pc-range:var(--color-static-white)]",
};
const PC_ROOT = "inline-block shrink-0 overflow-visible align-middle";
const PC_CIRCLE =
  "fill-none [cx:calc(var(--pc-size)/2)] [cy:calc(var(--pc-size)/2)] [r:calc(var(--pc-size)/2_-_var(--pc-thickness)/2)] [stroke-width:var(--pc-thickness)]";
const PC_TRACK = `${PC_CIRCLE} [stroke:var(--pc-track)]`;
const PC_RANGE = `${PC_CIRCLE} [stroke:var(--pc-range)] [stroke-linecap:round] [transform-box:fill-box] [transform-origin:center] [transform:rotate(-90deg)]`;
const PC_RANGE_DETERMINATE =
  "[stroke-dasharray:100_200] [transition:stroke-dashoffset_var(--motion-duration-d6)_var(--motion-ease-enter)] motion-reduce:transition-none";

// ── button.tsx 의 값 — 파일 선택(neutralWeak · small 드롭존 안 · large 1280 미만) ──────

const BUTTON_BASE = [
  "relative inline-flex items-center justify-center whitespace-nowrap font-sans font-bold",
  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1] disabled:bg-bg-disabled disabled:text-fg-disabled",
  "aria-busy:cursor-progress aria-busy:text-transparent aria-busy:[&>svg:not([data-slot=progress-circle])]:invisible aria-busy:active:[scale:1]",
  "[--progress-thickness:2px]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");
const BUTTON_VARIANTS = {
  variant: {
    neutralWeak:
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    large: "h-12 rounded-r3 [--press-basis:48] [--progress-size:18px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "" },
};
const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "large", layout: "withText", className: "px-x5 py-x3 gap-x2 text-t6 [&_svg]:size-[22px]" },
];
const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// ── field.tsx 의 클래스 — 칸을 감싸는 둘레(묶음이라 라벨은 <span>) ──────────────

const FIELD_ROOT = "flex w-full min-w-0 flex-col gap-x2";
const FIELD_HEADER = "flex items-center justify-between gap-x2_5 px-x0_5";
const FIELD_LABEL = "min-w-0 font-sans text-t5 text-fg-neutral";
const FIELD_LABEL_WEIGHT = { medium: "font-medium", bold: "font-bold" };
const FIELD_FOOTER = "flex items-start gap-x2 px-x0_5 font-sans";
const FIELD_ERROR = "m-0 flex min-w-0 text-t4 text-fg-critical";
const FIELD_ERROR_ICON = "mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0";
const FIELD_DESCRIPTION = "m-0 flex min-w-0 text-t4 text-fg-neutral-subtle";
const FIELD_TEXT = "min-w-0";
// 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 —
// <p> 에는 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(레시피에는 없는 미리보기용 덧칠)
const P_FIX = {
  error: "margin:0; color:var(--color-fg-critical);",
  description: "margin:0; color:var(--color-fg-neutral-subtle);",
  dropzone: "margin:0;",
};

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);
function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      const hit = Object.entries(when).every(([k, v]) => (Array.isArray(v) ? v.includes(p[k]) : p[k] === v));
      if (hit) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}
const buttonVariants = cvaOf(BUTTON_BASE, { variants: BUTTON_VARIANTS, compoundVariants: BUTTON_COMPOUND, defaultVariants: BUTTON_DEFAULTS });

// "group-data-[dragging]/attachment-item:[scale:…]" → 변형 앞말 · 유틸리티 — 괄호 안의 ":" 는 가르지 않는다
function splitVariant(cls) {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) cut = i;
  }
  return [cls.slice(0, cut + 1), cls.slice(cut + 1)];
}
// cn()(twMerge) — 이 파일이 합치는 자리에서 겹치는 것은 임의 속성([transition:…])뿐이다: 같은 변형 앞말 · 같은 속성이면 뒤의 것만 남긴다
function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const [prefix, utility] = splitVariant(cls);
    const prop = /^\[([a-z-]+):/.exec(utility)?.[1];
    if (prop) {
      const key = `${prefix}|${prop}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (paths, { cls = "", strokeWidth = 2 } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const PATHS = {
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  paperclip: '<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>',
  fileText:
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  fileSpreadsheet:
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/>',
  rotateCw: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  upload: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  circleAlert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
};

// 사진 — 손으로 칠한 그림(실제 사진이 아니다). 영수증 한 장 · 풍경 넷
const svgUri = (body) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">${body}</svg>`)}`;
const scene = (sky1, sky2, sun, hill1, hill2) =>
  svgUri(
    `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient></defs><rect width="160" height="160" fill="url(#s)"/><circle cx="108" cy="52" r="14" fill="${sun}"/><path d="M0 112C29 93 54 96 80 109S131 90 160 99V160H0Z" fill="${hill1}"/><path d="M0 134C40 118 88 128 115 138S147 128 160 131V160H0Z" fill="${hill2}"/>`,
  );
const PICS = {
  receipt: svgUri(
    `<rect width="160" height="160" fill="#c8a27a"/><g transform="rotate(-6 80 80)"><rect x="45" y="18" width="70" height="126" rx="2" fill="#fbfaf7"/><rect x="53" y="30" width="54" height="5" rx="2.5" fill="#d9d6cf"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="53" y="${52 + i * 9}" width="${30 + (i % 3) * 6}" height="3" rx="1.5" fill="#e3e0d8"/><rect x="${95 - (i % 2) * 3}" y="${52 + i * 9}" width="12" height="3" rx="1.5" fill="#d3cfc6"/>`).join("")}<rect x="53" y="124" width="24" height="4" rx="2" fill="#bdb8ae"/><rect x="88" y="124" width="19" height="4" rx="2" fill="#bdb8ae"/></g>`,
  ),
  dusk: scene("#5b4a8a", "#e7a3a1", "#ffe0b0", "#6a4f74", "#3a2d4a"),
  forest: scene("#cfe7f2", "#eef6f1", "#ffffff", "#6fa77f", "#3f7552"),
  sea: scene("#9fc7ec", "#dcecf8", "#ffffff", "#4f86b8", "#245b8a"),
  dawn: scene("#f6c9a8", "#f7e6d3", "#fff3c4", "#c7a38a", "#8f6f5c"),
};
const PIC_ORDER = ["receipt", "dusk", "forest", "sea", "dawn"];
const MB = 1024 * 1024;
const photo = (i, extra = {}) => ({ id: `p${i}`, name: `IMG_20261015_0842${String(10 + i).padStart(2, "0")}.jpg`, size: Math.round([2.4, 1.8, 3.1, 2.2, 4.6, 2.9, 1.6, 3.4, 2.7][i % 9] * MB), type: "image/jpeg", status: "success", previewUrl: PICS[PIC_ORDER[i % PIC_ORDER.length]], ...extra });
// 영수증 10/10 — PDF 하나 + 사진 아홉(여덟째 올리는 중 62% · 아홉째 실패)
const RECEIPTS = [
  { id: "pdf", name: "2026-10-15_카드영수증.pdf", size: Math.round(9.8 * MB), type: "application/pdf", status: "success" },
  ...Array.from({ length: 9 }, (_, i) => photo(i, i === 7 ? { status: "uploading", progress: 0.62 } : i === 8 ? { status: "error" } : {})),
];

// formatFileSize — "512B" · "84KB" · "9.8MB"(MB · GB 는 소수 한 자리, 띄어 쓰지 않는다)
function formatFileSize(bytes) {
  const b = Math.max(0, Math.round(bytes));
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${Math.max(1, Math.round(b / 1024))}KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)}MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(1)}GB`;
}
const isImage = (e) => e.type.startsWith("image/");
const percentOf = (e) => (typeof e.progress === "number" ? Math.round(Math.min(Math.max(e.progress, 0), 1) * 100) : undefined);
// 항목의 이름(보조 기술) — 전체 파일 이름 · 크기 · 대표 · 상태(레시피의 describe)
function describe(e, badgeLabel) {
  const parts = [e.name, formatFileSize(e.size)];
  if (badgeLabel) parts.push(badgeLabel);
  if (e.status === "uploading") parts.push(typeof e.progress === "number" ? `올리는 중 ${percentOf(e)}%` : "올리는 중");
  if (e.status === "error") parts.push("올리지 못했어요");
  return parts.join(", ");
}
// <ProgressCircle size="24" tone value aria-hidden /> — 값 있는 원
const circle = (tone, percent) =>
  `<svg role="progressbar" aria-label="불러오는 중" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-valuetext="${percent}%" data-slot="progress-circle" data-size="24" data-tone="${tone}" data-mode="determinate" class="${PC_ROOT} ${PC_SIZE[24]} ${PC_TONE[tone]}" style="width:var(--pc-size); height:var(--pc-size);" aria-hidden="true"><circle data-slot="progress-circle-track" class="${PC_TRACK}"></circle><circle data-slot="progress-circle-range" pathLength="100" class="${PC_RANGE} ${PC_RANGE_DETERMINATE}" style="stroke-dashoffset:${100 - percent};${percent > 0 ? "" : " opacity:0;"}"></circle></svg>`;
const fileIcon = (e) => (e.type === "application/pdf" ? PATHS.fileText : PATHS.fileSpreadsheet);
// 파일 이름 — 줄 수를 재는 보이지 않는 같은 글 둘 · 첫 줄 비움 · 이름(재지 않는 정적 HTML 은 이름 그대로 — 네 줄에 드는 이름으로 그렸다)
const fileName = (name) =>
  `<span data-slot="attachment-input-name" class="${NAME}"><span aria-hidden="true" class="${NAME_MEASURE}"><span class="${NAME_CLEAR}"></span>${esc(name)}</span><span aria-hidden="true" class="${NAME_MEASURE}"><span class="${NAME_CLEAR}"></span><span></span></span><span aria-hidden="true" data-slot="attachment-input-name-clear" class="${NAME_CLEAR}"></span>${esc(name)}</span>`;

// 항목 자리 하나 — Item(attachment-input.tsx). sortable 은 dnd-kit 의 속성(role · tabindex · aria-roledescription · 설명), menu 는 메뉴 트리거(1280 이상 Menu)
function item(e, { badgeLabel, readOnly = false, disabled = false, sortable = false, menu = false, press = false, describedBy = "" } = {}) {
  const kind = isImage(e) ? "image" : "file";
  const pressable = sortable || menu || press;
  const pct = percentOf(e);
  const face =
    kind === "image"
      ? `${e.previewUrl ? `<img data-slot="attachment-input-image" src="${e.previewUrl}" alt="" draggable="false" class="${IMAGE}">` : `<span aria-hidden="true" data-slot="attachment-input-image" class="${IMAGE_FALLBACK}">${svg(PATHS.image)}</span>`}${
          badgeLabel ? `<span aria-hidden="true" data-slot="attachment-input-badge" class="${BADGE}"><span class="${BADGE_LABEL}">${esc(badgeLabel)}</span></span>` : ""
        }${
          e.status === "uploading" || e.status === "error"
            ? `<span aria-hidden="true" data-slot="attachment-input-backdrop" class="${BACKDROP} ${e.status === "uploading" ? BACKDROP_UPLOADING : BACKDROP_ERROR}">${e.status === "uploading" ? circle("staticWhite", pct ?? 0) : ""}</span>`
            : ""
        }`
      : `<span aria-hidden="true" data-slot="attachment-input-thumbnail" class="${THUMBNAIL}">${e.status === "uploading" ? circle("neutral", pct ?? 0) : svg(fileIcon(e))}</span><span aria-hidden="true" data-slot="attachment-input-meta" class="${META}">${fileName(e.name)}<span data-slot="attachment-input-size" class="${SIZE}">${esc(formatFileSize(e.size))}</span></span>`;
  const label = describe(e, badgeLabel);
  const element = `<div ${attrs([
    'data-slot="attachment-input-item"',
    `data-kind="${kind}"`,
    sortable && 'data-sortable=""',
    (menu || press) && 'data-pressable=""',
    `class="${merge(`${ITEM} ${ITEM_KIND[kind]}`)}"`,
    pressable && 'role="button"',
    pressable && 'tabindex="0"',
    sortable && 'aria-disabled="false"',
    sortable && 'aria-roledescription="순서를 바꿀 수 있는 항목"',
    sortable && `aria-describedby="${describedBy}"`,
    menu && 'aria-haspopup="menu"',
    menu && 'aria-expanded="false"',
    menu && 'data-state="closed"',
    pressable && `aria-label="${esc(label)}"`,
  ])}>${face}${pressable ? "" : `<span class="sr-only">${esc(label)}</span>`}</div>`;
  const retry =
    e.status === "error"
      ? `<button type="button" data-slot="attachment-input-retry" aria-label="${esc(`${e.name} 다시 시도`)}"${disabled ? " disabled" : ""} class="${ACTION} ${ACTION_KIND[kind]}">${svg(PATHS.rotateCw)}다시 시도</button>`
      : "";
  const remove = `<button type="button" data-slot="attachment-input-remove" aria-label="${esc(`${e.name} 지우기`)}"${readOnly && !disabled ? ' aria-disabled="true"' : ""}${disabled ? " disabled" : ""} class="${REMOVE}">${svg(PATHS.x, { strokeWidth: 2.5 })}</button>`;
  return `<li ${attrs([
    'data-slot="attachment-input-item-root"',
    `data-id="${e.id}"`,
    `data-kind="${kind}"`,
    `data-status="${e.status}"`,
    readOnly && 'data-readonly="true"',
    `class="${ITEM_ROOT}"`,
  ])}>${element}${retry}${remove}</li>`;
}

// <AttachmentInput> — 칸 하나. ids 는 Field 가 넘긴 이름 · 설명(field() 의 control 인자)
function attachmentInput({ uid, ids = {}, layout = "tile", entries = [], accept, maxFiles = 1, badgeLabel, sortable = false, menu = false, preview = false, readOnly = false, disabled = false }) {
  const limited = Number.isFinite(maxFiles);
  const full = entries.length >= maxFiles;
  const blocked = disabled || readOnly || full;
  const failures = entries.filter((e) => e.status === "error").length;
  const failureId = `${uid}-failure`;
  const triggerSuffixId = `${uid}-trigger`;
  const dndId = `${uid}-dnd`;
  const firstImage = badgeLabel ? entries.find(isImage) : undefined;
  const acceptsImages = !accept || accept.split(",").some((t) => /^(image\/|\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|avif)$)/i.test(t.trim()));
  const list = entries.length
    ? `<ul data-slot="attachment-input-items" class="${LIST}">${entries.map((e) => item(e, { badgeLabel: e === firstImage ? badgeLabel : undefined, readOnly, disabled, sortable: sortable && !readOnly && !disabled, menu: menu && !readOnly && !disabled, press: preview && readOnly && !disabled, describedBy: dndId })).join("")}</ul>`
    : "";
  const dnd = sortable && !readOnly && !disabled && entries.length ? `<div id="${dndId}" style="display:none;">Space 로 들고 ← → 로 옮긴 뒤 Space 로 놓아요. Esc 는 그만두기예요.</div>` : "";
  const suffix = limited ? `첨부, ${entries.length}/${maxFiles}` : "첨부";
  const trigger = `<button ${attrs([
    'type="button"',
    'data-slot="attachment-input-trigger"',
    !disabled && (readOnly || full) && 'aria-disabled="true"',
    disabled && "disabled",
    `class="${TRIGGER}"`,
    ids.labelledby ? `aria-labelledby="${ids.labelledby} ${triggerSuffixId}"` : `aria-label="파일 ${suffix}"`,
  ])}>${svg(acceptsImages ? PATHS.image : PATHS.paperclip, { cls: TRIGGER_ICON })}${
    limited ? `<span aria-hidden="true" data-slot="attachment-input-count" class="${COUNT}"><span class="${COUNT_NOW}">${entries.length}</span><span class="${COUNT_MAX}">/${maxFiles}</span></span>` : ""
  }<span id="${triggerSuffixId}" hidden>${suffix}</span></button>`;
  const button = (size, extra = "") => `<button type="button" data-slot="attachment-input-pick"${blocked ? " disabled" : ""} class="${buttonVariants({ variant: "neutralWeak", size })}${extra ? ` ${extra}` : ""}">`;
  const body =
    layout === "dropzone"
      ? `<div data-slot="attachment-input-dropzone"${blocked ? ' data-disabled="true"' : ""} class="${DROPZONE}"><p data-slot="attachment-input-dropzone-label" class="${DROPZONE_LABEL}" style="${P_FIX.dropzone}">파일을 여기로 끌어다 놓으세요</p>${button("small")}파일 선택</button></div>${button("large", PICK_NARROW)}${svg(PATHS.upload)}파일 선택</button>${
          entries.length ? `<div data-slot="attachment-input-row" class="${ROW_DROPZONE}">${list}</div>` : ""
        }`
      : `<div data-slot="attachment-input-row" data-use="row" class="${FOG_ROOT} ${FOG_ROW} ${ROW_TILE}" data-fog-axis="x" style="${rowFogStyle()}"><div data-slot="scroll-fog-content" class="${FOG_CONTENT_ROW}"><div class="${ROW_CONTENT}">${trigger}${list}</div></div></div>`;
  const describedby = [ids.describedby, failures ? failureId : ""].filter(Boolean).join(" ");
  return `<div ${attrs([
    'role="group"',
    'data-slot="attachment-input"',
    `data-layout="${layout}"`,
    disabled && 'data-disabled="true"',
    readOnly && 'data-readonly="true"',
    `class="${ROOT}"`,
    ids.labelledby && `aria-labelledby="${ids.labelledby}"`,
    describedby && `aria-describedby="${describedby}"`,
  ])}>${body}${dnd}<input type="file" hidden tabindex="-1"${accept ? ` accept="${esc(accept)}"` : ""}${maxFiles > 1 ? " multiple" : ""}${disabled ? " disabled" : ""} data-slot="attachment-input-picker"><span id="${failureId}" hidden>${
    failures ? `${failures}개는 올리지 못했어요.` : ""
  }</span><span aria-live="polite" class="sr-only" data-slot="attachment-input-status"></span></div>`;
}

// <Field> 둘레 — 묶음이라 라벨은 <span id> 이고 칸이 그 id 를 이름으로, 설명 · 오류를 설명으로 받는다(useFieldGroup)
function field({ id, label, description, errorMessage, invalid = false, disabled = false, control }) {
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const showError = invalid && errorMessage;
  const describedby = showError ? errorId : description ? descriptionId : "";
  const header = `<div data-slot="field-header" class="${FIELD_HEADER}"><span id="${labelId}" class="${FIELD_LABEL} ${FIELD_LABEL_WEIGHT.medium}">${esc(label)}</span></div>`;
  const footer = showError
    ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${errorId}" aria-hidden="true" class="${FIELD_ERROR}" style="${P_FIX.error}">${svg(PATHS.circleAlert, { cls: FIELD_ERROR_ICON })}<span class="${FIELD_TEXT}">${esc(errorMessage)}</span></p></div>`
    : description
      ? `<div data-slot="field-footer" class="${FIELD_FOOTER}"><p id="${descriptionId}" class="${FIELD_DESCRIPTION}" style="${P_FIX.description}"><span class="${FIELD_TEXT}">${esc(description)}</span></p></div>`
      : "";
  return `<div ${attrs(['data-slot="field"', invalid && 'data-invalid="true"', disabled && 'data-disabled="true"', `class="${FIELD_ROOT}"`])}>${header}${control({ labelledby: labelId, describedby })}${footer}<span class="sr-only" aria-live="polite">${showError ? esc(errorMessage) : ""}</span></div>`;
}

// 견본 면 — 시트 · 대화상자 본문처럼 좌우 24(spacing-global-gutter). 줄은 이 24 를 넘어 면 가장자리까지 넓어진다
const SURFACE =
  "overflow:hidden; padding:var(--spacing-x6) var(--spacing-global-gutter); border-radius:var(--radius-r4); background:var(--color-bg-layer-floating); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); font-family:var(--font-sans); color:var(--color-fg-neutral);";
const surface = (html, extra = "") => `<div style="${SURFACE}${extra}">${html}</div>`;
const stack = (items) => `<div style="display:flex; flex-direction:column; gap:var(--spacing-x6);">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const attachmentInputExamples = [
  {
    title: "영수증 첨부 — 타일",
    description:
      "여럿을 붙이고 사진이 섞이는 자리(거래 영수증 · 메모 첨부)는 tile 이다(4A) — 첨부 타일(80 · \"10/10\") 뒤에 항목을 한 줄로 놓는다. 사진(image/*)은 80 썸네일, 그 밖(PDF)은 160 × 80 파일 카드이고 한 줄에 섞인다. 줄은 시트 · 대화상자 본문 가장자리까지 넓히고(좌우 −24 · 안쪽 24) 넘치면 가로로 스크롤한다 — 좌우 끝은 늘 20 흐린다(Scroll Fog row). 위 16 을 더 두고 같은 만큼 당겨 × 의 누르는 자리 44 가 잘리지 않는다. 항목 목록은 쓰는 쪽이 쥔다(entries) — 고른 파일은 검사를 통과하면 onFilesAccept 로(상태 pending), 거절은 onFilesReject 로 모아 넘기고(붙인 것을 먼저 · 거절을 뒤에) 칸 아래 오류 글로 한 번 알린다. 올리는 중은 값 있는 원 24(사진 위 딤 · 파일 썸네일 칸), 실패는 덮개 + \"다시 시도\"(onRetry). 다 찬 타일은 aria-disabled 라 초점은 남는다. 미리보기는 열 장을 붙인 뒤의 모습(여덟째 올리는 중 · 아홉째 실패)이고 스크립트 없이 그렸다.",
    jsx: `import { useState } from "react"
import { AttachmentInput, type AttachmentEntry, type AttachmentRejection } from "@/components/ui/attachment-input"
import { Field } from "@/components/ui/field"

const MAX_SIZE = 10 * 1024 * 1024
const uploadReceipt = (file: File, onProgress: (ratio: number) => void) => {
  onProgress(1)
  return Promise.resolve(file.name) // POST /files/upload(EXPENSE_RECEIPT) — 진행을 알려 준다
}
const REJECT_TEXT = {
  FILE_TOO_LARGE: "10MB 넘는 파일은 올릴 수 없어요.",
  INVALID_TYPE: "사진 · PDF 만 올릴 수 있어요.",
  TOO_MANY_FILES: "10개까지 올릴 수 있어요.",
} as const

const [entries, setEntries] = useState<AttachmentEntry[]>([])
const [error, setError] = useState<string | null>(null)

const update = (id: string, patch: Partial<AttachmentEntry>) =>
  setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)))

const start = (entry: AttachmentEntry) => {
  if (!entry.file) return
  update(entry.id, { status: "uploading", progress: 0 })
  uploadReceipt(entry.file, (progress) => update(entry.id, { progress })).then(
    () => update(entry.id, { status: "success" }),
    () => update(entry.id, { status: "error" }),
  )
}

// 이유마다 한 문장 — 토스트가 아니라 칸 아래 오류 글
const reject = (rejections: AttachmentRejection[]) => {
  const codes = [...new Set(rejections.flatMap((r) => r.codes))]
  setError(codes.map((c) => REJECT_TEXT[c]).join(" "))
}

<Field
  label="영수증"
  description="사진 · PDF 를 10MB 까지 올려요. 10개까지."
  invalid={error !== null}
  errorMessage={error}
>
  <AttachmentInput
    accept="image/*,application/pdf"
    maxFiles={10}
    maxFileSize={MAX_SIZE}
    entries={entries}
    onFilesAccept={(added) => {
      setError(null)
      setEntries((list) => [...list, ...added])
      added.forEach(start)
    }}
    onFilesReject={reject}
    onRemove={(id) => setEntries((list) => list.filter((e) => e.id !== id))}
    onRetry={(id) => {
      const entry = entries.find((e) => e.id === id)
      if (entry) start(entry)
    }}
  />
</Field>`,
    render: () =>
      surface(
        field({
          id: "att-receipt",
          label: "영수증",
          description: "사진 · PDF 를 10MB 까지 올려요. 10개까지.",
          control: (ids) => attachmentInput({ uid: "att-receipt", ids, entries: RECEIPTS, accept: "image/*,application/pdf", maxFiles: 10 }),
        }),
        " max-width:390px;",
      ),
  },

  {
    title: "파일 하나 가져오기 — 드롭존",
    description:
      "파일 하나를 골라 바로 서버로 넘기는 자리(CSV · Excel 가져오기)는 dropzone 이다(5A). 1280 이상 웹은 드롭존 — 높이 120 · 모서리 12 · 늘 1px 실선 stroke-neutral-solid(12A) · 안내 \"파일을 여기로 끌어다 놓으세요\" + Button neutralWeak small \"파일 선택\"(키보드 길 — 상자 전체를 누르는 자리로 두지 않는다). 파일을 끌고 들어오면 테두리 stroke-neutral-contrast + 바탕 bg-layer-default-pressed 로 바뀐다. 1280 미만 · 앱은 끌어 놓기가 없어 드롭존 없이 \"파일 선택\"(large · 칸 폭 · 앞 아이콘 upload)뿐이다(이 미리보기 폭이 1280 미만이면 그 모습이다). 하나를 고르면 드롭존 · 파일 선택이 막히고(최대 1) 고른 파일은 아래 8 에 파일 카드로 보인다 — 분석 중이면 썸네일 칸에 원. 바꾸려면 × 로 지우고 다시 고른다. 미리보기는 파일을 고른 뒤 분석 중인 모습이다.",
    jsx: `import { useState } from "react"
import { AttachmentInput, type AttachmentEntry } from "@/components/ui/attachment-input"
import { Field } from "@/components/ui/field"

const analyze = (file: File) => Promise.resolve(file.size) // POST /import/analyze — 다음 단계로 넘긴다
const [entries, setEntries] = useState<AttachmentEntry[]>([])
const [error, setError] = useState<string | null>(null)

<Field
  label="파일 업로드"
  description="CSV(.csv) 또는 Excel(.xlsx, .xls) 파일을 올려주세요. 최대 10MB."
  invalid={error !== null}
  errorMessage={error}
>
  {/* 1280 이상 웹은 드롭존, 1280 미만 · 앱은 파일 선택 버튼 — 하나를 고르면 드롭존이 막힌다 */}
  <AttachmentInput
    layout="dropzone"
    accept=".csv,.xlsx,.xls"
    maxFiles={1}
    maxFileSize={10 * 1024 * 1024}
    entries={entries}
    onFilesAccept={(added) => {
      const entry = added[0] // 최대 1 — 하나만 온다
      if (!entry?.file) return
      setError(null)
      setEntries([{ ...entry, status: "uploading" }])
      analyze(entry.file).then(
        () => setEntries([{ ...entry, status: "success" }]),
        () => setEntries([{ ...entry, status: "error" }]),
      )
    }}
    onFilesReject={() => setError("CSV · Excel 파일을 10MB 까지 올릴 수 있어요.")}
    onRemove={() => setEntries([])}
  />
</Field>`,
    render: () =>
      surface(
        field({
          id: "att-import",
          label: "파일 업로드",
          description: "CSV(.csv) 또는 Excel(.xlsx, .xls) 파일을 올려주세요. 최대 10MB.",
          control: (ids) =>
            attachmentInput({
              uid: "att-import",
              ids,
              layout: "dropzone",
              accept: ".csv,.xlsx,.xls",
              maxFiles: 1,
              entries: [{ id: "x", name: "숲길가계부_2026-10_거래내역.xlsx", size: Math.round(4.2 * MB), type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", status: "uploading", progress: 0.55 }],
            }),
        }),
        " max-width:640px;",
      ),
  },

  {
    title: "대표 사진 · 순서 바꾸기",
    description:
      "SEED 의 두 능력을 그대로 둔다(3A) — badgeLabel 을 주면 첫 사진 아래 24 띠(검정 65% · 흰 글 \"대표\"), onReorder 를 주면 순서를 바꾼다. 마우스는 누른 채 8px 넘게 · 터치는 250ms 누른 채 움직이면 끈다 — 끄는 항목은 2px 줄어든 채 따라가고 × 와 구멍이 사라지며 사진은 불투명도 0.5(SEED 그대로 — 13B)다. 키보드는 항목에서 Space 로 들고 ← → 로 옮긴 뒤 Space · Enter 로 놓는다(Esc 는 그만두기 — 하나하나 한국어로 읽는다). 끌지 않는 길도 있다(14A — WCAG 2.5.7) — 항목을 누르거나 Enter 면 1280 미만 Menu Sheet(머리 = 파일 이름) · 이상 Menu(aria-label = 파일 이름)가 열린다: 크게 보기(onPreview — 파일 카드는 \"열기\") · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 | 지우기, 맨 앞은 앞으로 · 대표로, 맨 끝은 뒤로가 막힌 줄이다. 순서를 바꾸면 대표 띠는 새 첫 사진으로 옮겨 간다. 미리보기는 사진 넷을 붙인 뒤의 1280 이상 모습이다(메뉴는 닫힌 채).",
    jsx: `import { useState } from "react"
import { AttachmentInput, type AttachmentEntry } from "@/components/ui/attachment-input"
import { Field } from "@/components/ui/field"

const [photos, setPhotos] = useState<AttachmentEntry[]>([])
const openViewer = (id: string) => window.open(\`/files/\${id}\`, "_blank", "noopener") // 크게 보기 — 쓰는 쪽이 정한다

<Field label="사진" description="사진을 10장까지 올려요. 첫 사진이 대표예요.">
  <AttachmentInput
    accept="image/*"
    maxFiles={10}
    badgeLabel="대표"
    entries={photos}
    onFilesAccept={(added) => setPhotos((list) => [...list, ...added])}
    onRemove={(id) => setPhotos((list) => list.filter((p) => p.id !== id))}
    onReorder={setPhotos}
    onPreview={openViewer}
  />
</Field>`,
    render: () =>
      surface(
        field({
          id: "att-photos",
          label: "사진",
          description: "사진을 10장까지 올려요. 첫 사진이 대표예요.",
          control: (ids) => attachmentInput({ uid: "att-photos", ids, entries: [photo(0), photo(1), photo(2), photo(3)], accept: "image/*", maxFiles: 10, badgeLabel: "대표", sortable: true, menu: true }),
        }),
        " max-width:480px;",
      ),
  },

  {
    title: "읽기 전용 · 막힘",
    description:
      "읽기 전용(readOnly — 값은 제출된다)은 타일 · × 가 막힌 모습(aria-disabled — 초점은 남는다)이고 순서를 못 바꾸며, 메뉴 대신 누르면 바로 크게 보기(onPreview)다. 사진은 불투명도 0.5(사진 · 띠 · 윤곽이 함께), 파일 카드는 글 · 아이콘 fg-disabled — SEED 그대로이고 v106 \"불투명도로 흐리지 않는다\" 의 예외는 이 칸의 읽기 전용 · 끄는 사진뿐이다(13B). 막힘(disabled — 값을 내지 않는다)은 새로 고르지 못하고 × 도 막힌다 — 타일 · × 의 아이콘이 fg-disabled 이고 흐리게 하지 않는다. Field 안이면 Field 의 readOnly · disabled 를 받는다.",
    jsx: `{/* 읽기 전용 — 붙인 것은 보이고 값은 제출된다. 누르면 바로 크게 보기 */}
<AttachmentInput readOnly accept="image/*,application/pdf" maxFiles={10} badgeLabel="대표" entries={entries} onFilesAccept={add} onRemove={remove} onPreview={openViewer} />
{/* 막힘 — 새로 고르지 못하고 × 도 막힌다. 값을 내지 않는다 */}
<AttachmentInput disabled accept="image/*,application/pdf" maxFiles={10} entries={entries} onFilesAccept={add} onRemove={remove} />`,
    render: () => {
      const three = [photo(0), { id: "pdf", name: "2026-10-15_카드영수증.pdf", size: Math.round(9.8 * MB), type: "application/pdf", status: "success" }, photo(2)];
      return surface(
        stack([
          field({ id: "att-ro", label: "영수증 — 읽기 전용", control: (ids) => attachmentInput({ uid: "att-ro", ids, entries: three, accept: "image/*,application/pdf", maxFiles: 10, badgeLabel: "대표", preview: true, readOnly: true }) }),
          field({ id: "att-off", label: "영수증 — 막힘", disabled: true, control: (ids) => attachmentInput({ uid: "att-off", ids, entries: three, accept: "image/*,application/pdf", maxFiles: 10, disabled: true }) }),
        ]),
        " max-width:390px;",
      );
    },
  },
];
