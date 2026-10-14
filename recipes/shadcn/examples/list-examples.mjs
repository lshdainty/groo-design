/*
 * shadcn List 예제 — docs site components/list.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 차례 · 제목 · 코드는 specs/components/list.md 의 "코드" 절을 따르고(하위 줄 — 카테고리까지), 마지막(앞 붙이개 —
 * 타일 · 로고 타일 · 카드 그림)은 md 의 Prefix 를 코드로 더 보인다 — 그 줄의 Logo Tile · 카드 그림(CardArt)은 LOGO_* 가 logo-tile.tsx,
 * FRAME_* · IMAGE_* · CARD_FACE_* · FIXED_WIDTH 가 image-frame.tsx, RATIO_* 가 aspect-ratio.tsx 의 것(logo-tile-examples.mjs · image-frame-examples.mjs 의 것)과 같다 —
 * 이 줄이 쓰는 크기 · 모서리만 옮겼다. 기관 색은 recipes/shadcn/lib/institution-colors.ts 의 표를 그대로 읽고, institutionColor · avatarInitial ·
 * avatarHue · imageFrameRadius 는 레시피의 규칙 함수와 같은 답을 낸다.
 *
 * LIST_BASE · CHECK_GROUP · ITEM_* · CONTENT_* · PREFIX_* · BODY_BASE · TITLE_* · HIGHLIGHT_MUTED · DETAIL_* · SUFFIX_* · ACTION_BASE ·
 * CONTROL_BASE · DIVIDER_* · HEADER_* · TILE_BASE · MARK_NO_SCALE · LIST_EXPAND_BUTTON · LIST_EXPAND_ICON · LIST_EXPAND_SLOT 는
 * recipes/shadcn/components/ui/list.tsx 의 cva 정의 · 상수와, PARENT_ITEM · SUB_LIST 는 그 파일의 ListParentItem JSX 에 적힌 클래스와
 * 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 하위 줄(nest — 부모 줄 · 하위 줄의 콘텐츠 층 좌우)은 CONTENT_VARIANTS 의 축이다(2026-10-10).
 * 줄에 끼우는 컨트롤의 SWITCHMARK_* · THUMB_* · CHECKMARK_* · INDICATOR* · CHECK_ICON · MINUS_ICON · RADIOMARK_* · DOT_* 는 switch.tsx · checkbox.tsx · radio-group.tsx 의 것(그 예제 파일의 것)과 같다.
 * 규칙은 specs/components/list.md, 수치 원본은 specs/components/list.yaml · list-header.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 목록 <ul>, 줄 <li> > 콘텐츠 층 > 앞 · 본문 · 뒤. 묶음(ListRadioGroup 의 role="radiogroup" ·
 * ListCheckGroup 의 <fieldset>) 안에서는 줄 · 구분선이 <div> 다(레시피의 ListRowTag). 목록 · 묶음의 itemRadius 는 style 의 --list-item-radius 다.
 * 누르는 줄은 <button data-list-action>, 컨트롤 줄은 줄 전체가 <label for data-list-action> 이고 끼운 컨트롤에도 data-list-action 이
 * 붙는다. 막히면 data-disabled 가 붙는다. 앞 타일은 <span data-list-tile> 이다(막힌 줄의 앞 붙이개가 타일 색을 덮는다).
 * 레시피가 cn() 으로 합치는 자리는 merge() 로 똑같이 합친다 — 같은 속성을 다시 쓴 클래스는 뒤의 것만 남는다.
 * 스위치 · 체크 · 라디오는 Radix 가 그리는 모양 그대로 <button role data-state> 다 — 바꾸는 동작은 React 에서 Radix 가 맡는다.
 * Radix 가 실행 중에 붙이는 것(라디오의 tabindex · data-radix-collection-item, 묶음의 tabindex · dir · aria-required · style 의
 * outline:none, 스위치 · 체크의 기본 value="on")과 lucide 의 class · xmlns 는 그리지 않는다 — 아이콘은 lucide-react 와 같은 모양의 inline SVG 다.
 * 줄(li)은 누르는 순간(포인터 · 키) 레시피의 스크립트(withPress)가 줄을 재서 --press-basis 를 달고, 마우스 · 펜이면 누른 요소에
 * 포인터를 잡아 둔다(setPointerCapture — 콘텐츠 층이 줄어 가장자리를 누른 포인터가 밖에 남아도 click 이 그 줄로 간다).
 * 정적 HTML 에는 그 스크립트가 없어 미리보기를 눌러도 바탕만 바뀌고 콘텐츠 층은 줄지 않는다.
 */

import { readFileSync } from "node:fs";

// ── list.tsx 의 cva 와 같은 값 ─────────────────────────────────────────────

// 목록(listVariants)
const LIST_BASE = "flex w-full flex-col";

// 여럿 고르기 묶음(ListCheckGroup) — fieldset 의 기본 바깥 · 안쪽 여백 · 테두리 · 최소 폭을 걷는다(listVariants 뒤에 붙인다)
const CHECK_GROUP = "m-0 min-w-0 border-0 p-0";

// 줄(listItemVariants) — 바탕 층(li::before)과 컨테이너. 누르는 줄의 상태는 안쪽 [data-list-action] 에서 읽는다
const ITEM_BASE = [
  "group/list-item relative flex w-full",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:inset-x-x1_5 [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-layer-default-pressed",
  "has-[[data-list-action]:not([data-disabled]):active]:before:inset-x-x1_5 has-[[data-list-action]:not([data-disabled]):active]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-layer-default-pressed",
].join(" ");

const ITEM_VARIANTS = {
  highlight: {
    none: "",
    highlighted:
      "before:bg-bg-brand-weak [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-brand-weak-pressed has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-brand-weak-pressed",
  },
};

const ITEM_DEFAULTS = { highlight: "none" };

// 콘텐츠 층(listContentVariants) — 앞 · 본문 · 뒤. 누르면 이 층만 준다. 좌우는 단계(nest)가 건다 — 보통 줄 24 · 부모 줄 앞 4(꺾쇠 단추 44 + 4 를 지나
// 앞 붙이개가 52) · 하위 줄 104(부모의 제목 자리 = 4 + 44 + 4 + 타일 40 + 12)
const CONTENT_BASE = [
  "relative flex w-full py-x3",
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:1]",
].join(" ");

const CONTENT_VARIANTS = {
  align: {
    center: "items-center",
    top: "items-start",
  },
  nest: {
    none: "px-global-gutter",
    parent: "pl-x1 pr-global-gutter",
    child: "pl-[104px] pr-global-gutter",
  },
};

const CONTENT_DEFAULTS = { align: "center", nest: "none" };

// 앞 붙이개(listPrefixVariants) — 아이콘 22. 막히면 아이콘 · 타일 모두 비활성 색(타일은 부르는 쪽의 카테고리 색을 덮는다)
const PREFIX_BASE = "flex shrink-0 items-center pr-x3 text-fg-neutral [&>svg]:size-[22px]";
const PREFIX_VARIANTS = {
  disabled: {
    true: "text-fg-disabled [&_[data-list-tile]]:bg-bg-disabled [&_[data-list-tile]]:text-fg-disabled",
    false: "",
  },
};
const PREFIX_DEFAULTS = { disabled: false };

// 본문(listBodyVariants) — 제목 + 설명
const BODY_BASE = "flex min-w-0 flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left";

// 제목(listTitleVariants)
const TITLE_BASE = "font-sans text-t5 font-normal text-fg-neutral";
const TITLE_VARIANTS = { disabled: { true: "text-fg-disabled", false: "" } };
const TITLE_DEFAULTS = { disabled: false };

// 강조 줄을 올리거나 누르는 동안 — 설명 · 값 글자를 한 단계 짙게(HIGHLIGHT_MUTED)
const HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";

// 설명(listDetailVariants)
const DETAIL_BASE = "font-sans text-t3 text-fg-neutral-subtle";

const DETAIL_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: HIGHLIGHT_MUTED, false: "" },
};

const DETAIL_DEFAULTS = { disabled: false, highlighted: false };

// 뒤 붙이개(listSuffixVariants) — 값 글자 · 화살표 18. 강조 줄을 올리거나 누르면 값 글자만 짙어지고 화살표는 그대로
const SUFFIX_BASE =
  "flex shrink-0 items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]";

const SUFFIX_VARIANTS = {
  disabled: { true: "text-fg-disabled", false: "" },
  highlighted: { true: HIGHLIGHT_MUTED, false: "" },
};

const SUFFIX_COMPOUND = [{ disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" }];

const SUFFIX_DEFAULTS = { disabled: false, highlighted: false };

// 누르는 줄의 본문 버튼 · 링크(listActionVariants) — ::after 가 줄 전체를 덮는다(누르는 영역 · 포커스 링)
const ACTION_BASE = [
  "cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit] no-underline outline-none",
  "after:absolute after:inset-0 after:content-['']",
  "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
  "data-[disabled]:cursor-not-allowed",
].join(" ");

// 컨트롤 줄(listControlVariants) — 줄 전체가 라벨
const CONTROL_BASE = "cursor-pointer select-none data-[disabled]:cursor-not-allowed";

// 줄 사이 선(listDividerVariants) — 필요할 때만
const DIVIDER_BASE = "h-px shrink-0 bg-stroke-neutral-subtle";
const DIVIDER_VARIANTS = { inset: { true: "mx-global-gutter", false: "w-full" } };
const DIVIDER_DEFAULTS = { inset: false };

// 목록 제목(listHeaderVariants)
const HEADER_BASE = "flex w-full items-center justify-between gap-x2_5 px-global-gutter py-x2 font-sans text-t4";

const HEADER_VARIANTS = {
  variant: {
    mediumWeak: "font-medium text-fg-neutral-subtle",
    boldSolid: "font-bold text-fg-neutral",
  },
};

const HEADER_DEFAULTS = { variant: "mediumWeak" };

// 내용 줄의 앞 타일(listTileVariants) — 바탕 · 아이콘 색은 부르는 쪽이(카테고리 색)
const TILE_BASE = "inline-grid size-10 shrink-0 place-items-center rounded-r3 [&>svg]:size-5";

// 끼운 컨트롤은 따로 줄지 않는다 — 줄의 콘텐츠가 함께 준다. 컨트롤에도 data-list-action 을 단다(switchmark · checkmark · radiomark) —
// 키보드(Space)로 누르면 :active 가 라벨이 아니라 컨트롤에 걸려도 줄의 누름이 선다
const MARK_NO_SCALE = "active:[scale:1]";

// 하위 줄을 접는 부모 줄(ListParentItem) — 줄 앞 꺾쇠 단추: 보이는 상자 = 누르는 영역 44 · 모서리 10 · 단추 뒤 4. 줄과 따로 눌린다(줄의 누름 바탕은 생기지 않는다):
// 올리거나 누르면 단추만 bg-layer-default-pressed, 누르면 2px 거리 축소(기준 44). 키보드 포커스에만 단추 안쪽 2px 링. 위아래 2 를 줄의 여백에 겹쳐
// 타일 40 줄의 높이(64)를 그대로 둔다. 줄의 버튼 ::after 위(z 1)에 놓인다
const LIST_EXPAND_BUTTON = [
  "relative z-[1] -my-x0_5 mr-x1 inline-flex size-11 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-r2_5 border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[--press-basis:44] [@media(hover:hover)]:hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 꺾쇠 20 — 접혀 있으면 오른쪽, 펼치면 아래(90° · 300ms easing, 모션 줄이기면 바로)
const LIST_EXPAND_ICON = "size-5 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";
// 하위가 없는 부모 줄 · 늘 펼쳐 두는 화면 — 꺾쇠 단추와 같은 폭의 빈 자리
const LIST_EXPAND_SLOT = "-my-x0_5 mr-x1 size-11 shrink-0";
// 부모 줄의 li · 하위 줄 묶음(ul — listVariants 뒤에 붙인다) — list.tsx 의 JSX
const PARENT_ITEM = "flex w-full flex-col";
const SUB_LIST = "m-0 list-none p-0";

// ── logo-tile.tsx 의 상수와 같은 값 — 물건 줄의 앞(Logo Tile 40) ─────────────

const LOGO_SIZES = { 40: { box: "size-[40px] rounded-r3", initial: "text-[16px]", card: 32 } };
const LOGO_HUE_BG = { indigo: "bg-chart-indigo" };
const LOGO_INSTITUTION_TEXT = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};
const LOGO_ROOT = [
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden align-middle",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");
const LOGO_INITIAL = "absolute inset-0 flex items-center justify-center font-sans font-bold uppercase";
const LOGO_LINE_HEIGHT_1 = "leading-none";
// logo-tile.tsx 의 JSX — 이름 색 면의 글자
const LOGO_NAME_TEXT = "text-fg-neutral-inverted";

// ── image-frame.tsx · aspect-ratio.tsx 의 cva · 상수와 같은 값 — 카드 혜택 줄의 앞(카드 그림 56) ──

const FRAME_BASE = [
  "relative isolate block max-w-full overflow-hidden [container-name:image-frame] [container-type:size]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");
const FRAME_VARIANTS = { radius: { "8": "rounded-r2" } };
const FRAME_DEFAULTS = { radius: "8" };
const IMAGE_BASE = "absolute block";
const IMAGE_VARIANTS = {
  rotate: {
    false: "inset-0 size-full",
    true: "left-1/2 top-1/2 h-[158.6%] w-[calc(100%/1.586)] -translate-x-1/2 -translate-y-1/2 rotate-90",
  },
  fit: { cover: "object-cover" },
};
const IMAGE_DEFAULTS = { rotate: false, fit: "cover" };
const RATIO_VARIANTS = { ratio: { card: "aspect-[1.586]" } };
const RATIO_DEFAULTS = { ratio: "4:3" };
const CARD_FACE_TEXT = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};
const CARD_FACE = "relative size-full overflow-hidden font-sans";
const CARD_FACE_INITIAL = [
  "absolute inset-0 flex items-center justify-center font-bold uppercase @min-[96px]/image-frame:hidden",
  "text-[length:max(10px,round(40cqh,1px))]",
  "leading-none",
].join(" ");
const CARD_FACE_LABEL =
  "absolute inset-x-0 bottom-0 hidden flex-col px-x2_5 pb-x2 @min-[96px]/image-frame:flex @min-[240px]/image-frame:px-x4 @min-[240px]/image-frame:pb-x3_5";
const CARD_FACE_ISSUER = "truncate text-t2 font-medium @min-[240px]/image-frame:text-t3";
const CARD_FACE_NAME = "line-clamp-1 break-keep text-t4 font-bold [overflow-wrap:break-word] @min-[240px]/image-frame:line-clamp-2 @min-[240px]/image-frame:text-t5";
// image-frame.tsx 의 JSX — 고정 폭 · 대체 그림 자리
const FIXED_WIDTH = "shrink-0";
const FALLBACK = "absolute inset-0 flex";

// 기관 색 표 — lib/institution-colors.ts 의 INSTITUTION_COLORS 를 그대로 읽는다(정적 미리보기는 TS 를 불러오지 못해 표의 글자를 푼다)
const INSTITUTION_COLORS = new Function(
  `return ${/export const INSTITUTION_COLORS[^=]*=\s*(\[[\s\S]*?\n\]);/.exec(readFileSync(new URL("../lib/institution-colors.ts", import.meta.url), "utf8"))[1]};`,
)();

// ── switch.tsx · checkbox.tsx · radio-group.tsx 의 cva 와 같은 값 ──────────

// Switchmark — 스위치(switchmarkVariants). 트랙이다
const SWITCHMARK_BASE = [
  "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
  "[transition:background-color_var(--motion-duration-d1)_var(--motion-ease-easing)_20ms,scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/switch:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/switch:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  // 끔 — 꺼진 트랙. 켬은 톤에서 채운다
  "bg-stroke-neutral-solid",
  // 막힘 — 끔은 옅은 트랙 + 안쪽 선, 켬은 켜진 모양 그대로 회색 채움
  "disabled:bg-bg-disabled disabled:inset-ring disabled:inset-ring-stroke-neutral-weak",
  "data-[state=checked]:disabled:bg-fg-disabled data-[state=checked]:disabled:inset-ring-0",
].join(" ");

// 크기 이름은 글자다("16" · "24" · "32") — .mjs 에서는 prettier 가 숫자 꼴 키의 따옴표를 떼지만 같은 글자 키다
const SWITCHMARK_VARIANTS = {
  size: {
    16: "h-4 w-[26px] p-0.5 [--press-basis:24]",
    24: "h-6 w-[38px] p-0.5 [--press-basis:24]",
    32: "h-8 w-[52px] p-[3px] [--press-basis:32]",
  },
  tone: {
    neutral: "data-[state=checked]:bg-bg-neutral-inverted",
    brand: "data-[state=checked]:bg-bg-brand-solid",
  },
};

const SWITCHMARK_DEFAULTS = {
  size: "24",
  tone: "neutral",
};

// 엄지(switchmarkThumbVariants)
const THUMB_BASE = [
  "pointer-events-none block scale-[0.8] rounded-full",
  "[transition:translate_var(--motion-duration-d3)_var(--motion-ease-easing),scale_var(--motion-duration-d3)_var(--motion-ease-easing),background-color_var(--motion-duration-d1)_var(--motion-ease-easing)_20ms]",
  "data-[state=checked]:scale-100",
  "data-[disabled]:bg-fg-disabled data-[disabled]:data-[state=checked]:bg-bg-disabled",
].join(" ");

const THUMB_VARIANTS = {
  size: {
    16: "size-3 data-[state=checked]:translate-x-[10px]",
    24: "size-5 data-[state=checked]:translate-x-[14px]",
    32: "size-[26px] data-[state=checked]:translate-x-5",
  },
  tone: {
    neutral: "bg-fg-neutral-inverted",
    brand: "bg-static-white",
  },
};

const THUMB_DEFAULTS = {
  size: "24",
  tone: "neutral",
};

// Checkmark — 칸(checkmarkVariants)
const CHECKMARK_BASE = [
  "peer group/checkmark relative inline-grid shrink-0 cursor-pointer place-items-center rounded-r1",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/checkbox:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/checkbox:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  "[&_svg]:pointer-events-none",
].join(" ");

const CHECKMARK_VARIANTS = {
  size: {
    medium: "size-5 [--press-basis:24]",
    large: "size-6 [--press-basis:24]",
  },
  shape: {
    // 선택 안 됨: 테두리 칸. 선택 · 일부 선택: 테두리 없이 채움(톤 조합에서)
    square:
      "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed data-[state=checked]:border-0 data-[state=indeterminate]:border-0 disabled:border-stroke-neutral-weak disabled:bg-bg-disabled data-[state=checked]:disabled:bg-bg-disabled data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-bg-disabled data-[state=indeterminate]:disabled:text-fg-disabled",
    // 칸 없이 체크만 — 선택 안 됨도 옅은 체크(fg-placeholder)
    ghost:
      "border-0 bg-transparent text-fg-placeholder hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/checkbox:bg-bg-layer-default-pressed group-active/checkbox:bg-bg-layer-default-pressed disabled:bg-transparent disabled:text-fg-disabled data-[state=checked]:disabled:bg-transparent data-[state=checked]:disabled:text-fg-disabled data-[state=indeterminate]:disabled:bg-transparent data-[state=indeterminate]:disabled:text-fg-disabled",
  },
  tone: {
    neutral: "",
    brand: "",
  },
};

const CHECKMARK_COMPOUND = [
  // 크기 × 모양 — 아이콘(Ghost 는 칸이 없어 크다)
  { size: "medium", shape: "square", className: "[&_svg]:size-3" },
  { size: "large", shape: "square", className: "[&_svg]:size-3.5" },
  { size: "medium", shape: "ghost", className: "[&_svg]:size-3.5" },
  { size: "large", shape: "ghost", className: "[&_svg]:size-[18px]" },
  // Square × 톤 — 선택 · 일부 선택의 채움, 누름 · 호버는 -pressed
  {
    shape: "square",
    tone: "neutral",
    className:
      "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:text-fg-neutral-inverted data-[state=indeterminate]:bg-bg-neutral-inverted data-[state=indeterminate]:text-fg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:hover:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:active:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-inverted-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-inverted-pressed",
  },
  {
    shape: "square",
    tone: "brand",
    className:
      "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:text-static-white data-[state=indeterminate]:bg-bg-brand-solid data-[state=indeterminate]:text-static-white data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/checkbox:bg-bg-brand-solid-pressed data-[state=checked]:group-active/checkbox:bg-bg-brand-solid-pressed data-[state=indeterminate]:hover:bg-bg-brand-solid-pressed data-[state=indeterminate]:active:bg-bg-brand-solid-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-brand-solid-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-brand-solid-pressed",
  },
  // Ghost × 톤 — 선택 · 일부 선택의 글자색, 누름 · 호버 바탕
  {
    shape: "ghost",
    tone: "neutral",
    className:
      "data-[state=checked]:text-fg-neutral data-[state=indeterminate]:text-fg-neutral data-[state=checked]:hover:bg-bg-neutral-weak data-[state=checked]:active:bg-bg-neutral-weak data-[state=checked]:group-hover/checkbox:bg-bg-neutral-weak data-[state=checked]:group-active/checkbox:bg-bg-neutral-weak data-[state=indeterminate]:hover:bg-bg-neutral-weak data-[state=indeterminate]:active:bg-bg-neutral-weak data-[state=indeterminate]:group-hover/checkbox:bg-bg-neutral-weak data-[state=indeterminate]:group-active/checkbox:bg-bg-neutral-weak",
  },
  {
    shape: "ghost",
    tone: "brand",
    className:
      "data-[state=checked]:text-fg-brand data-[state=indeterminate]:text-fg-brand data-[state=checked]:hover:bg-bg-brand-weak-pressed data-[state=checked]:active:bg-bg-brand-weak-pressed data-[state=checked]:group-hover/checkbox:bg-bg-brand-weak-pressed data-[state=checked]:group-active/checkbox:bg-bg-brand-weak-pressed data-[state=indeterminate]:hover:bg-bg-brand-weak-pressed data-[state=indeterminate]:active:bg-bg-brand-weak-pressed data-[state=indeterminate]:group-hover/checkbox:bg-bg-brand-weak-pressed data-[state=indeterminate]:group-active/checkbox:bg-bg-brand-weak-pressed",
  },
];

const CHECKMARK_DEFAULTS = {
  size: "medium",
  shape: "square",
  tone: "neutral",
};

// 칸 안의 표시(Radix Indicator, forceMount) — Square 는 선택 안 됨에 숨기고, Ghost 는 늘 보인다
const INDICATOR = "grid place-items-center";
const INDICATOR_HIDDEN = "data-[state=unchecked]:invisible";
// 체크 · 가로줄 — 일부 선택이면 체크를 숨기고 가로줄을 보인다
const CHECK_ICON = "group-data-[state=indeterminate]/checkmark:hidden";
const MINUS_ICON = "hidden group-data-[state=indeterminate]/checkmark:block";

// Radiomark — 동그라미(radiomarkVariants)
const RADIOMARK_BASE = [
  "peer relative inline-grid shrink-0 cursor-pointer place-items-center rounded-full",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] group-active/radio:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] motion-reduce:group-active/radio:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:[scale:1]",
  // 선택 안 됨 — 테두리 원. 호버 · 누름은 누름 바탕
  "border border-stroke-neutral-solid bg-transparent hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed group-hover/radio:bg-bg-layer-default-pressed group-active/radio:bg-bg-layer-default-pressed",
  "disabled:border-stroke-neutral-weak disabled:bg-bg-disabled",
  // 선택 — 테두리 없이 채운 원(톤에서). 비활성은 채움 그대로 색만
  "data-[state=checked]:border-0 data-[state=checked]:disabled:bg-bg-disabled",
].join(" ");

const RADIOMARK_VARIANTS = {
  size: {
    medium: "size-5 [--press-basis:24]",
    large: "size-6 [--press-basis:24]",
  },
  tone: {
    neutral:
      "data-[state=checked]:bg-bg-neutral-inverted data-[state=checked]:hover:bg-bg-neutral-inverted-pressed data-[state=checked]:active:bg-bg-neutral-inverted-pressed data-[state=checked]:group-hover/radio:bg-bg-neutral-inverted-pressed data-[state=checked]:group-active/radio:bg-bg-neutral-inverted-pressed",
    brand:
      "data-[state=checked]:bg-bg-brand-solid data-[state=checked]:hover:bg-bg-brand-solid-pressed data-[state=checked]:active:bg-bg-brand-solid-pressed data-[state=checked]:group-hover/radio:bg-bg-brand-solid-pressed data-[state=checked]:group-active/radio:bg-bg-brand-solid-pressed",
  },
};

const RADIOMARK_DEFAULTS = {
  size: "medium",
  tone: "neutral",
};

// 가운데 점(radiomarkDotVariants)
const DOT_BASE =
  "pointer-events-none block rounded-full bg-transparent [transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)] data-[disabled]:data-[state=checked]:bg-fg-disabled";

const DOT_VARIANTS = {
  size: {
    medium: "size-2",
    large: "size-2.5",
  },
  tone: {
    neutral: "data-[state=checked]:bg-fg-neutral-inverted",
    brand: "data-[state=checked]:bg-static-white",
  },
};

const DOT_DEFAULTS = {
  size: "medium",
  tone: "neutral",
};

// ── cva · cn 풀이 ─────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(disabled · highlighted · inset)은 cva 처럼 "true" · "false" 글자 키로 찾고, compound 는 값 그대로 견준다.
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

const listVariants = cvaOf(LIST_BASE);
const listItemVariants = cvaOf(ITEM_BASE, { variants: ITEM_VARIANTS, defaultVariants: ITEM_DEFAULTS });
const listContentVariants = cvaOf(CONTENT_BASE, { variants: CONTENT_VARIANTS, defaultVariants: CONTENT_DEFAULTS });
const listPrefixVariants = cvaOf(PREFIX_BASE, { variants: PREFIX_VARIANTS, defaultVariants: PREFIX_DEFAULTS });
const listBodyVariants = cvaOf(BODY_BASE);
const listTitleVariants = cvaOf(TITLE_BASE, { variants: TITLE_VARIANTS, defaultVariants: TITLE_DEFAULTS });
const listDetailVariants = cvaOf(DETAIL_BASE, { variants: DETAIL_VARIANTS, defaultVariants: DETAIL_DEFAULTS });
const listSuffixVariants = cvaOf(SUFFIX_BASE, {
  variants: SUFFIX_VARIANTS,
  compoundVariants: SUFFIX_COMPOUND,
  defaultVariants: SUFFIX_DEFAULTS,
});
const listActionVariants = cvaOf(ACTION_BASE);
const listControlVariants = cvaOf(CONTROL_BASE);
const listDividerVariants = cvaOf(DIVIDER_BASE, { variants: DIVIDER_VARIANTS, defaultVariants: DIVIDER_DEFAULTS });
const listHeaderVariants = cvaOf(HEADER_BASE, { variants: HEADER_VARIANTS, defaultVariants: HEADER_DEFAULTS });
const listTileVariants = cvaOf(TILE_BASE);
const imageFrameVariants = cvaOf(FRAME_BASE, { variants: FRAME_VARIANTS, defaultVariants: FRAME_DEFAULTS });
const imageFrameImageVariants = cvaOf(IMAGE_BASE, { variants: IMAGE_VARIANTS, defaultVariants: IMAGE_DEFAULTS });
const aspectRatioVariants = cvaOf("", { variants: RATIO_VARIANTS, defaultVariants: RATIO_DEFAULTS });

// ── 레시피의 규칙 함수와 같은 답 — 기관 찾기(lib/institution-colors.ts) · 첫 글자 · 이름 색(avatar.tsx) · 모서리(image-frame.tsx) ──

const squash = (value) => value.replace(/\s+/g, "");
const KEYS = INSTITUTION_COLORS.map((entry) => ({ entry, keys: [entry.name, ...entry.aliases].map(squash).filter((key) => key !== "") }));

/** 기관 이름 → 기관 색 표의 한 줄(color · text …). 같은 이름 · 별칭, 아니면 든 가장 긴 이름, 없으면 null */
function institutionColor(name) {
  const query = squash(name ?? "");
  if (query === "") return null;
  for (const { entry, keys } of KEYS) if (keys.includes(query)) return entry;
  let found = null;
  let longest = 0;
  for (const { entry, keys } of KEYS) {
    for (const key of keys) {
      if (key.length > longest && query.includes(key)) {
        found = entry;
        longest = key.length;
      }
    }
  }
  return found;
}

const AVATAR_HUES = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown", "gray"];
const displayName = (name) => String(name).trim();
const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** 이니셜 — 표시 이름의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자. 이름이 비면 "" */
function avatarInitial(name) {
  const shown = displayName(name);
  if (shown === "") return "";
  return (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "").toUpperCase();
}

/** 이름 색 — 표시 이름의 유니코드 코드 포인트 합 % 10 → 차트 10색(v110 순서). 이름이 비면 gray */
function avatarHue(name) {
  const shown = displayName(name);
  if (shown === "") return "gray";
  let sum = 0;
  for (const ch of shown) sum += ch.codePointAt(0) ?? 0;
  return AVATAR_HUES[sum % 10] ?? "gray";
}

/** 폭 → 모서리(SEED) — 24 이하 "4" · 48 이하 "6" · 그 위 "8". 폭을 모르면(부모 폭을 채운다) "8" */
function imageFrameRadius(width) {
  if (width == null || Number.isNaN(width)) return "8";
  return width <= 24 ? "4" : width <= 48 ? "6" : "8";
}
const switchmarkVariants = cvaOf(SWITCHMARK_BASE, {
  variants: SWITCHMARK_VARIANTS,
  defaultVariants: SWITCHMARK_DEFAULTS,
});
const switchmarkThumbVariants = cvaOf(THUMB_BASE, { variants: THUMB_VARIANTS, defaultVariants: THUMB_DEFAULTS });
const checkmarkVariants = cvaOf(CHECKMARK_BASE, {
  variants: CHECKMARK_VARIANTS,
  compoundVariants: CHECKMARK_COMPOUND,
  defaultVariants: CHECKMARK_DEFAULTS,
});
const radiomarkVariants = cvaOf(RADIOMARK_BASE, { variants: RADIOMARK_VARIANTS, defaultVariants: RADIOMARK_DEFAULTS });
const radiomarkDotVariants = cvaOf(DOT_BASE, { variants: DOT_VARIANTS, defaultVariants: DOT_DEFAULTS });

// "has-[[data-list-action]:not([data-disabled]):hover]:before:bg-x" → ["has-[…]", "before", "bg-x"] — 괄호 안의 ":" 는 가르지 않는다.
function splitVariants(cls) {
  const segs = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) {
      segs.push(cls.slice(start, i));
      start = i + 1;
    }
  }
  segs.push(cls.slice(start));
  return segs;
}

// cn()(twMerge) 처럼 같은 속성을 다시 쓴 클래스는 뒤의 것만 남긴다. 이 파일이 합치는 클래스에 나오는 무리만 안다 —
// 배경 · 글자색 · 글자 크기 · 임의 속성([prop:…]). text-t* 는 글자 크기라 글자색과 겹치지 않는다(recipes/shadcn/lib/utils.ts).
// 그래서 막힌 줄의 text-fg-disabled 가 기본 글자색을, 강조 줄의 before:bg-bg-brand-weak 가 before:bg-transparent 를,
// 끼운 컨트롤의 active:[scale:1] 이 active:[scale:calc(…)] 를 지운다. 누르는 줄의 버튼 · 링크는 레시피처럼 listActionVariants 를
// 먼저 넣는다 — 뒤에 오는 listBodyVariants 의 pr-x2_5 가 p-0 과 함께 남는다(CSS 에서 pr 이 p 뒤라 10 이 선다).
const GROUPS = [
  [/^bg-/, "bg"],
  [/^text-(?:fg-|static-)/, "color"],
  [/^text-t\d+$/, "font-size"],
];

function merge(classList) {
  const seen = new Set();
  const kept = [];
  for (const cls of classList.split(/\s+/).filter(Boolean).reverse()) {
    const segs = splitVariants(cls);
    const utility = segs.pop();
    const prop = /^\[([\w-]+):/.exec(utility);
    const group = prop ? `[${prop[1]}]` : GROUPS.find(([re]) => re.test(utility))?.[1];
    if (group) {
      const key = `${segs.join(":")}|${group}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    kept.push(cls);
  }
  return kept.reverse().join(" ");
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const hl = (highlighted) => (highlighted ? "highlighted" : "none");

// lucide-react 의 아이콘과 같은 모양(24 격자) — 크기는 앞 · 뒤 붙이개의 [&>svg]:size-* 가 정한다(24 는 lucide 기본값)
const svg = (paths, { strokeWidth = 2, cls = "" } = {}) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;

const ICONS = {
  user: svg('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  globe: svg(
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  ),
  bell: svg(
    '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  ),
  info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  utensils: svg('<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>'),
  arrowLeftRight: svg('<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>'),
  tag: svg('<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>'),
  house: svg('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  chevronRight: svg('<path d="m9 18 6-6-6-6"/>'),
};

// 칸 안의 체크 · 가로줄 — checkbox.tsx 처럼 선 3. 둘 다 넣어 두고 칸의 data-state 로 하나만 보인다
const CHECK_ICONS =
  svg('<path d="M20 6 9 17l-5-5"/>', { strokeWidth: 3, cls: CHECK_ICON }) +
  svg('<path d="M5 12h14"/>', { strokeWidth: 3, cls: MINUS_ICON });

// <Switchmark> — Radix Switch.Root · Thumb 가 그리는 모양. 줄에 끼우면 레시피가 MARK_NO_SCALE 을 더해 cn() 으로 합친다
function switchmark({ id, size, tone, checked = false, disabled = false }) {
  const radix = attrs([`data-state="${checked ? "checked" : "unchecked"}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="switch"',
    `aria-checked="${checked}"`,
    radix,
    disabled && "disabled",
    `class="${merge(`${switchmarkVariants({ size, tone })} ${MARK_NO_SCALE}`)}"`,
    `id="${id}"`,
    'data-list-action=""',
  ]);
  return `<button ${root}><span ${radix} class="${switchmarkThumbVariants({ size, tone })}"></span></button>`;
}

// <Checkmark> — Radix Checkbox.Root · Indicator(forceMount)가 그리는 모양. state = "unchecked" · "checked" · "indeterminate"
function checkmark({ id, size, shape, tone, state = "unchecked", disabled = false }) {
  const radix = attrs([`data-state="${state}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="checkbox"',
    `aria-checked="${state === "indeterminate" ? "mixed" : state === "checked"}"`,
    radix,
    disabled && "disabled",
    `class="${merge(`${checkmarkVariants({ size, shape, tone })} ${MARK_NO_SCALE}`)}"`,
    `id="${id}"`,
    'data-list-action=""',
  ]);
  const indicator = merge([INDICATOR, shape !== "ghost" && INDICATOR_HIDDEN].filter(Boolean).join(" "));
  return `<button ${root}><span ${radix} class="${indicator}" style="pointer-events:none;">${CHECK_ICONS}</span></button>`;
}

// <Radiomark> — Radix RadioGroup.Item · Indicator(forceMount)가 그리는 모양. value 는 코드가 넘긴 값이다
function radiomark({ id, value, size, tone, checked = false, disabled = false }) {
  const radix = attrs([`data-state="${checked ? "checked" : "unchecked"}"`, disabled && 'data-disabled=""']);
  const root = attrs([
    'type="button"',
    'role="radio"',
    `aria-checked="${checked}"`,
    radix,
    disabled && "disabled",
    `value="${value}"`,
    `class="${merge(`${radiomarkVariants({ size, tone })} ${MARK_NO_SCALE}`)}"`,
    `id="${id}"`,
    'data-list-action=""',
  ]);
  return `<button ${root}><span ${radix} class="${radiomarkDotVariants({ size, tone })}"></span></button>`;
}

// 제목 + 설명(레시피의 Body) — 설명이 없으면 그리지 않는다
function body({ title, detail, disabled, highlighted }) {
  const text = `<span class="${merge(listTitleVariants({ disabled }))}">${title}</span>`;
  return detail
    ? `${text}<span class="${merge(listDetailVariants({ disabled, highlighted }))}">${detail}</span>`
    : text;
}

const part = (html, cls) => (html ? `<span class="${cls}">${html}</span>` : "");

// 목록 · 묶음의 itemRadius — 누름 · 호버 바탕의 모서리를 --list-item-radius 로 넘긴다(레시피의 radiusStyle)
const radius = (itemRadius) => itemRadius && `style="--list-item-radius:${itemRadius}"`;

// <List> — 목록(<ul>). 이름은 aria-label, 목록 제목이 있으면 aria-labelledby
const list = (rows, { ariaLabel, labelledBy, itemRadius } = {}) =>
  `<ul ${attrs([`class="${merge(listVariants())}"`, radius(itemRadius), ariaLabel && `aria-label="${ariaLabel}"`, labelledBy && `aria-labelledby="${labelledBy}"`])}>${rows.join("")}</ul>`;

// <ListItem> — 보기만 하는 줄. 레시피는 앞 · 본문 · 뒤에 cn() 을 쓰지 않고 막힘 · 강조도 넘기지 않는다
function listItem({ title, detail, prefix, suffix, align, highlighted }) {
  const content = `${part(prefix, listPrefixVariants())}<span class="${listBodyVariants()}">${body({ title, detail })}</span>${part(suffix, listSuffixVariants())}`;
  return `<li class="${merge(listItemVariants({ highlight: hl(highlighted) }))}"><div class="${listContentVariants({ align })}">${content}</div></li>`;
}

// <ListButtonItem> — 줄 전체가 버튼. 막히면 disabled · data-disabled. 부모 줄(ListParentItem) 안의 하위 줄이면 nest "child"(레시피의 ListNestContext)
function listButtonItem({ title, detail, prefix, suffix, align, highlighted, disabled = false, nest }) {
  const button = attrs([
    'type="button"',
    disabled && "disabled",
    'data-list-action=""',
    disabled && 'data-disabled=""',
    `class="${merge(`${listActionVariants()} ${listBodyVariants()}`)}"`,
  ]);
  const content = `${part(prefix, merge(listPrefixVariants({ disabled })))}<button ${button}>${body({ title, detail, disabled, highlighted })}</button>${part(suffix, merge(listSuffixVariants({ disabled, highlighted })))}`;
  return `<li class="${merge(listItemVariants({ highlight: hl(highlighted) }))}"><div class="${listContentVariants({ align, nest })}">${content}</div></li>`;
}

// <ListParentItem expandLabel open> — 하위 줄을 접는 부모 줄. li > 줄(바탕 층 · 콘텐츠 층 — 앞 4 · 꺾쇠 단추 44 · 앞 붙이개 52) + 하위 줄 묶음(ul — 접히면 hidden).
// 자식(children — 이미 그린 하위 줄)이 없거나 expandLabel 이 없으면 꺾쇠 자리를 같은 폭으로 비운다(하위가 없으면 묶음도 없다)
function listParentItem({ uid, title, detail, prefix, suffix, align, highlighted, disabled = false, expandLabel, open = false, children = [] }) {
  const hasChildren = children.length > 0;
  const foldable = hasChildren && expandLabel != null;
  const isOpen = foldable ? open : hasChildren;
  const subId = `${uid}-sub`;
  const lead = foldable
    ? `<button ${attrs([
        'type="button"',
        `aria-expanded="${isOpen}"`,
        `aria-controls="${subId}"`,
        `aria-label="${expandLabel}"`,
        'data-slot="list-expand-button"',
        `data-state="${isOpen ? "open" : "closed"}"`,
        `class="${LIST_EXPAND_BUTTON}"`,
      ])}>${svg('<path d="m9 18 6-6-6-6"/>', { cls: [LIST_EXPAND_ICON, isOpen && "rotate-90"].filter(Boolean).join(" ") })}</button>`
    : `<span aria-hidden="true" data-slot="list-expand-slot" class="${LIST_EXPAND_SLOT}"></span>`;
  const button = attrs([
    'type="button"',
    disabled && "disabled",
    'data-list-action=""',
    disabled && 'data-disabled=""',
    `class="${merge(`${listActionVariants()} ${listBodyVariants()}`)}"`,
  ]);
  const content = `${lead}${part(prefix, merge(listPrefixVariants({ disabled })))}<button ${button}>${body({ title, detail, disabled, highlighted })}</button>${part(suffix, merge(listSuffixVariants({ disabled, highlighted })))}`;
  const sub = hasChildren
    ? `<ul id="${subId}" data-slot="list-sub-list" data-state="${isOpen ? "open" : "closed"}"${isOpen ? "" : ' hidden=""'} class="${merge(`${listVariants()} ${SUB_LIST}`)}">${children.join("")}</ul>`
    : "";
  return `<li data-slot="list-parent-item" class="${PARENT_ITEM}"><div data-slot="list-parent-row" class="${merge(listItemVariants({ highlight: hl(highlighted) }))}"><div class="${listContentVariants({ align, nest: "parent" })}">${content}</div></div>${sub}</li>`;
}

// <ListLinkItem> — 줄 전체가 링크. 코드 절에는 아직 없지만 레시피의 부품이라 같은 짜임으로 그려 둔다
function listLinkItem({ href, title, detail, prefix, suffix, align, highlighted }) {
  const link = attrs([
    'data-list-action=""',
    `class="${merge(`${listActionVariants()} ${listBodyVariants()}`)}"`,
    `href="${href}"`,
  ]);
  const content = `${part(prefix, listPrefixVariants())}<a ${link}>${body({ title, detail, highlighted })}</a>${part(suffix, merge(listSuffixVariants({ highlighted })))}`;
  return `<li class="${merge(listItemVariants({ highlight: hl(highlighted) }))}"><div class="${listContentVariants({ align })}">${content}</div></li>`;
}

// 컨트롤 줄(레시피의 ControlRow) — 줄(li · div) > <label>(콘텐츠 층 · 누르는 영역) > 앞 · 본문 · 뒤
function controlRow({ as = "li", htmlFor, title, detail, prefix, suffix, align, highlighted, disabled = false }) {
  const label = attrs([
    `for="${htmlFor}"`,
    'data-list-action=""',
    disabled && 'data-disabled=""',
    `class="${merge(`${listContentVariants({ align })} ${listControlVariants()}`)}"`,
  ]);
  const content = `${part(prefix, merge(listPrefixVariants({ disabled })))}<span class="${listBodyVariants()}">${body({ title, detail, disabled, highlighted })}</span>${part(suffix, merge(listSuffixVariants({ disabled, highlighted })))}`;
  return `<${as} class="${merge(listItemVariants({ highlight: hl(highlighted) }))}"><label ${label}>${content}</label></${as}>`;
}

// <ListSwitchItem> — 스위치는 뒤에, 32 가 기본
function listSwitchItem({ id, size = "32", tone, checked, disabled, ...row }) {
  return controlRow({ ...row, disabled, htmlFor: id, suffix: switchmark({ id, size, tone, checked, disabled }) });
}

// <ListCheckItem> — 체크 24(large)를 앞(기본)이나 뒤에
function listCheckItem({ id, markPosition = "prefix", size = "large", shape, tone, state, disabled, prefix, ...row }) {
  const mark = checkmark({ id, size, shape, tone, state, disabled });
  const at = markPosition === "prefix" ? { prefix: mark } : { prefix, suffix: mark };
  return controlRow({ ...row, ...at, disabled, htmlFor: id });
}

// <ListRadioItem> — 라디오 24(large)를 뒤(기본)나 앞에. ListRadioGroup 안에 둔다
function listRadioItem({
  id,
  value,
  markPosition = "suffix",
  size = "large",
  tone,
  checked,
  disabled,
  prefix,
  ...row
}) {
  const mark = radiomark({ id, value, size, tone, checked, disabled });
  const at = markPosition === "prefix" ? { prefix: mark } : { prefix, suffix: mark };
  return controlRow({ ...row, ...at, disabled, htmlFor: id });
}

// 묶음 안의 줄 — 레시피는 묶음이 ListRowTag 로 줄 · 구분선을 li 대신 <div> 로 그리게 한다.
// 묶음 도우미는 줄의 속성을 받아 as: "div" 로 그리고, 글자(이미 그린 구분선 등)는 그대로 둔다
const inGroup = (items, row) => items.map((it) => (typeof it === "string" ? it : row({ ...it, as: "div" }))).join("");

// <ListRadioGroup> — Radix RadioGroup.Root 가 role="radiogroup" 을 단다. 이름은 aria-label
const listRadioGroup = (items, { ariaLabel, itemRadius } = {}) =>
  `<div ${attrs(['role="radiogroup"', `class="${merge(listVariants())}"`, radius(itemRadius), ariaLabel && `aria-label="${ariaLabel}"`])}>${inGroup(items, listRadioItem)}</div>`;

// <ListCheckGroup> — 여럿 고르기 묶음. <fieldset>(role=group)이고 이름은 aria-label
const listCheckGroup = (items, { ariaLabel, itemRadius } = {}) =>
  `<fieldset ${attrs([`class="${merge(`${listVariants()} ${CHECK_GROUP}`)}"`, radius(itemRadius), ariaLabel && `aria-label="${ariaLabel}"`])}>${inGroup(items, listCheckItem)}</fieldset>`;

// <ListHeader> — 목록 밖, 바로 위. id 를 목록의 aria-labelledby 로 잇는다
const listHeader = (text, { variant, id } = {}) =>
  `<div ${attrs([`class="${merge(listHeaderVariants({ variant }))}"`, id && `id="${id}"`])}>${text}</div>`;

// <ListDivider> · <ListTile> — 코드 절에는 아직 없지만 레시피의 부품이라 같은 클래스로 그려 둔다. 구분선은 묶음 안에서 <div>
const listDivider = (inset, as = "li") =>
  `<${as} aria-hidden="true" class="${merge(listDividerVariants({ inset }))}"></${as}>`;
const listTile = (html, className = "") =>
  `<span data-list-tile="" class="${merge(`${listTileVariants()} ${className}`)}">${html}</span>`;

// <LogoTile name face> — logo-tile.tsx 그대로(크기 40 · 그림 없음 — 첫 글자 타일). 옆에 이름이 있어 장식(aria-hidden)
function logoTile({ name, face = "institution" }) {
  const shown = name.trim();
  const institution = face === "institution" ? institutionColor(shown) : null;
  const box = LOGO_SIZES[40];
  const tone = institution ? LOGO_INSTITUTION_TEXT[institution.text] : `${LOGO_HUE_BG[avatarHue(shown)]} ${LOGO_NAME_TEXT}`;
  const initial = `<span ${attrs([
    'aria-hidden="true"',
    'data-slot="logo-tile-initial"',
    `class="${[LOGO_INITIAL, tone, box.initial, LOGO_LINE_HEIGHT_1].join(" ")}"`,
    institution && `style="background-color:${institution.color}"`,
  ])}>${avatarInitial(shown)}</span>`;
  return `<span data-slot="logo-tile" data-face="${institution ? "institution" : "name"}" data-image="none" data-status="none" aria-hidden="true" class="${LOGO_ROOT} ${box.box}">${initial}</span>`;
}

// <CardArt width={56}> — image-frame.tsx 그대로(카드 비율 · 고정 폭 56 → 모서리 8 · 장식). 그림이 있으면 그림(세로는 다 받은 모습 — 돌림),
// 없으면 아는 카드사의 카드 면(폭 96 미만 — 회사 첫 글자만)
function cardArt56({ issuer, name, src, portrait = false }) {
  const institution = institutionColor(issuer);
  const radius = imageFrameRadius(56);
  const rotate = !!src && portrait;
  const inner = src
    ? `<img data-slot="image-frame-image" loading="lazy" alt="" src="${src}" class="${imageFrameImageVariants({ rotate })}">`
    : `<div data-slot="image-frame-fallback" class="${FALLBACK}" aria-hidden="true"><div data-slot="card-art-face" data-text="${institution.text}" class="${CARD_FACE} ${CARD_FACE_TEXT[institution.text]}" style="background-color:${institution.color}"><span data-slot="card-art-initial" class="${CARD_FACE_INITIAL}">${avatarInitial(issuer)}</span><span data-slot="card-art-label" class="${CARD_FACE_LABEL}"><span data-slot="card-art-issuer" class="${CARD_FACE_ISSUER}">${issuer}</span><span data-slot="card-art-name" class="${CARD_FACE_NAME}">${name}</span></span></div></div>`;
  return `<div ${attrs([
    'data-slot="card-art"',
    `data-state="${src ? "loaded" : "fallback"}"`,
    'data-ratio="card"',
    `data-radius="${radius}"`,
    'data-fit="cover"',
    rotate && 'data-rotated="true"',
    `data-issuer="${institution ? "known" : "unknown"}"`,
    `class="${imageFrameVariants({ radius })} ${aspectRatioVariants({ ratio: "card" })} ${FIXED_WIDTH}"`,
    'style="width:56px"',
  ])}>${inner}</div>`;
}

// 세로 카드 그림(540 × 856) — 손으로 칠한 대역(SVG). 실제 카드 그림이 아니다
const CARD_PORTRAIT = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="540" height="856" viewBox="0 0 540 856"><defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e52d27"/><stop offset="1" stop-color="#7b1fa2"/></linearGradient></defs><rect width="540" height="856" fill="url(#c)"/><rect x="76" y="72" width="150" height="104" rx="14" fill="#d9b44a"/><text transform="translate(300 470) rotate(-90)" text-anchor="middle" font-family="sans-serif" font-size="76" font-weight="800" letter-spacing="5" fill="#ffffff">SELECT ALL</text></svg>',
)}`;

// 줄은 화면의 기본 면(bg-layer-default) 위에 놓인다 — 폭 360 의 휴대폰 화면처럼 그린다. 사이트 미리보기 칸의 바탕(bg-page)은
// 누름 바탕(bg-layer-default-pressed)과 거의 같은 색이라 그 위에 바로 그리면 호버 · 누름이 보이지 않는다.
// 면의 모서리 16 · 위아래 6 은 누름 바탕(좌우 6 · 모서리 10)과 동심이다(list.md "카드 안의 목록").
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x1_5) 0;";
const screen = (html) => `<div style="${SCREEN}">${html}</div>`;

const CAPTION =
  "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";

// 위 이름표 + 화면 — 둘을 나란히 두고, 좁으면 아래로 내린다
const captioned = (caption, html) =>
  `<div style="display:flex; flex:1 1 280px; flex-direction:column; gap:var(--spacing-x2); max-width:360px;"><span style="${CAPTION}">${caption}</span>${screen(html)}</div>`;

// 지출 카테고리(설정 > 카테고리) — 부모 · 하위 두 단계. 지어낸 이름이다(가장 긴 부모 이름 · 하위 6개)
const CATEGORIES = [
  { id: "food", name: "식비 · 외식 · 배달음식", icon: "utensils", hue: "orange", children: ["배달 · 포장 주문 음식", "장보기 · 마트 · 시장", "회식 · 모임 식비", "카페 · 디저트 · 간식", "점심 · 구내식당 식비", "편의점 · 간편식 · 야식"] },
  { id: "home", name: "주거 · 통신비 · 관리비", icon: "house", hue: "indigo", children: ["월세 · 전세 대출 이자", "아파트 관리비 · 수도", "휴대폰 · 인터넷 · TV", "전기 · 가스 요금", "가전 · 가구 수리비"] },
  { id: "etc", name: "기타", icon: "tag", hue: "gray", children: [] },
];
const categoryTile = (c) => listTile(ICONS[c.icon], `bg-chart-${c.hue}-weak text-chart-${c.hue}`);
const categoryRows = (uid, open = ["food"]) =>
  CATEGORIES.map((c) =>
    listParentItem({
      uid: `${uid}-${c.id}`,
      prefix: categoryTile(c),
      title: c.name,
      detail: `지출 · ${c.children.length ? `하위 ${c.children.length}개` : "하위 없음"}`,
      expandLabel: c.children.length ? `${c.name} 하위 카테고리` : undefined,
      open: open.includes(c.id),
      children: c.children.map((k) => listButtonItem({ nest: "child", prefix: categoryTile(c), title: k, detail: "지출" })),
    }),
  );

// ── 예제 ──────────────────────────────────────────────────────────────────

export const listExamples = [
  {
    title: "기본",
    description:
      "보기만 하는 줄(ListItem)이다 — 누르지 않아 호버 · 누름 바탕이 없고 Tab 으로도 가지 않는다. 목록(List)은 <ul>, 줄은 <li> 이고 줄 사이에 간격 · 선을 두지 않는다 — 줄의 위아래 여백 12 가 줄을 가른다. 제목은 16 · 400, 뒤의 값 글자는 16 · fg-neutral-subtle 이다.",
    jsx: `import { List, ListItem } from "@/components/ui/list"

<List>
  <ListItem title="가입일" suffix="2026년 3월 2일" />
  <ListItem title="이메일" suffix="porest@example.com" />
</List>`,
    render: () =>
      screen(
        list([
          listItem({ title: "가입일", suffix: "2026년 3월 2일" }),
          listItem({ title: "이메일", suffix: "porest@example.com" }),
        ]),
      ),
  },

  {
    title: "누르는 줄",
    description:
      "줄 전체가 버튼인 줄(ListButtonItem)이다 — 버튼의 ::after 가 줄을 덮어 줄 어디를 눌러도 눌리고, 키보드 포커스 링(2px)도 줄 안쪽에 선다. 올리거나 누르면 바탕이 좌우 6 들어온 bg-layer-default-pressed(모서리 10)가 된다. 누르면 콘텐츠 층도 준다 — 정적 미리보기에는 줄을 재는 스크립트가 없어 바탕만 바뀐다. 화면을 옮기는 줄에만 오른쪽 화살표(18)를 단다. 앞 아이콘은 22 · fg-neutral, 값 글자 · 화살표는 fg-neutral-subtle 이다. 목록 제목(ListHeader)은 목록 밖, 바로 위에 두고 그 id 를 목록의 aria-labelledby 로 잇는다 — 기본은 14 · 500 · fg-neutral-subtle 이다.",
    jsx: `import { ChevronRight, Globe, User } from "lucide-react"
import { List, ListButtonItem, ListHeader } from "@/components/ui/list"

<ListHeader id="settings-general">일반</ListHeader>
<List aria-labelledby="settings-general">
  <ListButtonItem prefix={<User />} title="계정" suffix={<ChevronRight />} onClick={openAccount} />
  <ListButtonItem prefix={<Globe />} title="기본 통화" suffix={<>대한민국 원<ChevronRight /></>} onClick={openCurrency} />
</List>`,
    render: () =>
      screen(
        listHeader("일반", { id: "settings-general" }) +
          list(
            [
              listButtonItem({ prefix: ICONS.user, title: "계정", suffix: ICONS.chevronRight }),
              listButtonItem({ prefix: ICONS.globe, title: "기본 통화", suffix: `대한민국 원${ICONS.chevronRight}` }),
            ],
            { labelledBy: "settings-general" },
          ),
      ),
  },

  {
    title: "컨트롤 줄",
    description:
      "스위치를 끼운 줄(ListSwitchItem)이다 — 줄 전체가 <label> 이라 줄 어디를 눌러도 스위치가 바뀌고, 스위치의 이름은 그 label 의 글자(제목 · 설명)다. 스위치는 제목 16 줄이라 32 다. 누르면 줄의 콘텐츠가 함께 줄고 스위치는 따로 줄지 않는다. 미리보기는 켠 한 순간이다 — 바꾸는 동작은 React 에서 Radix 가 맡는다.",
    jsx: `import { Bell } from "lucide-react"
import { List, ListSwitchItem } from "@/components/ui/list"

<List>
  <ListSwitchItem
    prefix={<Bell />}
    title="결제 알림"
    detail="결제 예정일 D-1, 결제일 당일 알림"
    checked={on}
    onCheckedChange={setOn}
  />
</List>`,
    render: () =>
      screen(
        list([
          listSwitchItem({
            id: "list-ex-pay-alert",
            prefix: ICONS.bell,
            title: "결제 알림",
            detail: "결제 예정일 D-1, 결제일 당일 알림",
            checked: true,
          }),
        ]),
      ),
  },

  {
    title: "하나 고르기 · 여럿 고르기",
    description:
      '하나를 고르면 ListRadioGroup 안에 ListRadioItem(라디오 24 를 뒤에)을, 여럿을 고르면 ListCheckGroup 안에 ListCheckItem(체크 24 를 앞에)을 둔다. 고른 것과 안 고른 것이 모두 보이고, 한 묶음에서 라디오와 체크를 섞지 않는다. 묶음은 role="radiogroup" · <fieldset> 이라 그 안의 줄은 <li> 가 아니라 <div> 다. 두 묶음 모두 aria-label 로 이름을 단다.',
    jsx: `import { ListCheckGroup, ListCheckItem, ListRadioGroup, ListRadioItem } from "@/components/ui/list"

<ListRadioGroup value={currency} onValueChange={setCurrency} aria-label="기본 통화">
  <ListRadioItem value="KRW" title="대한민국 원" detail="KRW" />
  <ListRadioItem value="USD" title="미국 달러" detail="USD" />
</ListRadioGroup>

<ListCheckGroup aria-label="내보낼 항목">
  <ListCheckItem title="거래 내역" defaultChecked />
  <ListCheckItem title="예산" />
</ListCheckGroup>`,
    render: () => {
      const radios = listRadioGroup(
        [
          { id: "list-ex-currency-krw", value: "KRW", title: "대한민국 원", detail: "KRW", checked: true },
          { id: "list-ex-currency-usd", value: "USD", title: "미국 달러", detail: "USD" },
        ],
        { ariaLabel: "기본 통화" },
      );
      const checks = listCheckGroup(
        [
          { id: "list-ex-export-tx", title: "거래 내역", state: "checked" },
          { id: "list-ex-export-budget", title: "예산" },
        ],
        { ariaLabel: "내보낼 항목" },
      );
      return `<div style="display:flex; flex-wrap:wrap; align-items:flex-start; gap:var(--spacing-x5) var(--spacing-x6);">
  ${captioned("하나 고르기 · ListRadioGroup", radios)}
  ${captioned("여럿 고르기 · ListCheckGroup", checks)}
</div>`;
    },
  },

  {
    title: "강조 · 비활성 · 맞춤",
    description:
      'highlighted 는 새 알림처럼 주목이 필요한 줄의 바탕을 bg-brand-weak 로 바꾼다 — 점 · 막대는 두지 않는다. 올리거나 누르면 바탕은 bg-brand-weak-pressed 가 되고 설명 · 값 글자는 fg-neutral-muted 로 한 단계 짙어진다(화살표는 그대로). disabled 는 제목 · 설명 · 앞뒤 아이콘을 모두 fg-disabled 로(앞 타일은 bg-disabled 바탕) 바꾸고 누르기 · 포커스에서 뺀다 — 흐리게 하지 않는다. 제목이 두 줄을 넘거나 설명이 길면 align="top" 으로 앞 · 뒤를 위에 맞춘다.',
    jsx: `import { Info } from "lucide-react"
import { List, ListButtonItem, ListItem } from "@/components/ui/list"

<List>
  <ListButtonItem highlighted title="예산 80% 도달" detail="식비 예산의 80%를 썼어요" />
  <ListButtonItem disabled title="주간 리포트" detail="푸시 알림이 꺼져 있어요" />
  <ListItem align="top" prefix={<Info />} title="긴 제목은 두 줄을 넘으면 앞 · 뒤를 위로 맞춘다" detail="설명이 길 때도 같다" />
</List>`,
    render: () =>
      screen(
        list([
          listButtonItem({ highlighted: true, title: "예산 80% 도달", detail: "식비 예산의 80%를 썼어요" }),
          listButtonItem({ disabled: true, title: "주간 리포트", detail: "푸시 알림이 꺼져 있어요" }),
          listItem({
            align: "top",
            prefix: ICONS.info,
            title: "긴 제목은 두 줄을 넘으면 앞 · 뒤를 위로 맞춘다",
            detail: "설명이 길 때도 같다",
          }),
        ]),
      ),
  },

  {
    title: "하위 줄 — 카테고리",
    description:
      "카테고리처럼 부모 · 하위 두 단계로 된 목록에서 줄 자체는 편집을 열고 하위 줄만 접을 때는 ListParentItem 을 쓴다 — 부모 줄 앞에 꺾쇠 단추를 둔다(사용자 결정 7C). 단추는 보이는 상자가 곧 누르는 영역 44(모서리 10)이고, 줄 앞 4 · 단추 뒤 4 를 지나 앞 붙이개가 52 에서 시작한다. 꺾쇠는 chevron-right 20 · fg-neutral-subtle — 접혀 있으면 오른쪽, 펼치면 아래로 90° 돈다(300ms — Accordion 과 같다). 이름은 \"{카테고리} 하위 카테고리\" 로 고정하고 펼침은 aria-expanded 가 알린다 — \"접기 · 펼치기\" 로 바꾸지 않는다. 단추는 줄과 따로 눌린다 — 줄을 누르면 편집이 열리고, 단추는 펼치고 접기만 한다(Tab 은 단추 → 줄 → 펼친 하위 줄). 하위 줄은 부모의 제목 자리 104 에서 시작해 하위 타일이 부모 제목 아래에 선다 — 누름 바탕은 줄 폭 그대로다. 하위가 없는 부모(기타)도 꺾쇠 자리를 같은 폭으로 비워 부모 타일이 모두 52 에 선다 — 타일이 두 세로줄(52 · 104)로 정리된다(사용자 결정 17B). 편집을 여는 줄이라 오른쪽 화살표를 달지 않는다. 그림은 식비를 펼치고 주거를 접은 모습이다.",
    jsx: `import { Tag, Utensils } from "lucide-react"
import { List, ListButtonItem, ListParentItem, ListTile } from "@/components/ui/list"

<List aria-label="지출 카테고리">
  {/* 줄을 누르면 편집, 앞 꺾쇠 단추가 하위 줄을 접는다 — 이름은 고정 */}
  <ListParentItem
    prefix={<ListTile className="bg-chart-orange-weak text-chart-orange"><Utensils /></ListTile>}
    title="식비 · 외식 · 배달음식"
    detail="지출 · 하위 6개"
    onClick={() => editCategory(food.id)}
    expandLabel="식비 · 외식 · 배달음식 하위 카테고리"
    defaultOpen
  >
    {food.children.map((c) => (
      <ListButtonItem key={c.id} prefix={renderTile(c)} title={c.name} detail="지출" onClick={() => editCategory(c.id)} />
    ))}
  </ListParentItem>
  {/* 하위가 없으면 꺾쇠 자리만 비운다 — 타일 · 제목이 같은 자리 */}
  <ListParentItem
    prefix={<ListTile className="bg-chart-gray-weak text-chart-gray"><Tag /></ListTile>}
    title="기타"
    detail="지출 · 하위 없음"
    onClick={() => editCategory(etc.id)}
  />
</List>`,
    render: () => screen(list(categoryRows("list-ex-nest"), { ariaLabel: "지출 카테고리" })),
  },

  {
    title: "앞 붙이개 — 타일 · 로고 타일 · 카드 그림",
    description:
      "색이 뜻을 가진 내용 줄(거래 · 카테고리 · 알림 종류)은 타일 40(ListTile — 모서리 12) — 카테고리 색의 옅은 바탕(chart-{색}-weak) 위에 그 색의 아이콘 20 이다. 아이콘이 없는 카테고리는 태그 아이콘 하나로 그리고(빈 칸 · 첫 글자를 넣지 않는다), 이체 줄은 회색(chart-gray-weak + chart-gray)이다 — 카테고리가 아니라 돈의 이동이다. 은행 · 증권 · 카드 · 코인 · 금 같은 물건 줄은 로고 타일 40(Logo Tile — 기관 색 + 첫 글자, 기관이 없으면 이름 색)이고 막힌 줄에서도 그대로다. 카드 혜택처럼 카드 자체가 줄인 자리는 카드 그림 56(Image Frame 카드 비율 · 모서리 8 — 세로 그림은 돌리고, 그림이 없는 아는 카드사는 카드 면의 첫 글자)이다. 한 목록 안에서 섞지 않는다 — 자산 목록은 로고 타일, 거래 목록은 카테고리 타일.",
    jsx: `import { ArrowLeftRight, Tag, Utensils } from "lucide-react"
import { CardArt } from "@/components/ui/image-frame"
import { List, ListButtonItem, ListItem, ListTile } from "@/components/ui/list"
import { LogoTile } from "@/components/ui/logo-tile"

{/* 거래 — 카테고리 타일(아이콘이 없으면 Tag), 이체는 회색 */}
<List>
  <ListItem prefix={<ListTile className="bg-chart-orange-weak text-chart-orange"><Utensils /></ListTile>} title="김밥천국" detail="식비 · 현대카드" />
  <ListItem prefix={<ListTile className="bg-chart-violet-weak text-chart-violet"><Tag /></ListTile>} title="동네 서점" detail="취미 · 현대카드" />
  <ListItem prefix={<ListTile className="bg-chart-gray-weak text-chart-gray"><ArrowLeftRight /></ListTile>} title="비상금으로 이체" detail="신한 주거래 → 비상금" />
</List>

{/* 자산 — 로고 타일 */}
<List>
  <ListButtonItem prefix={<LogoTile name="신한" />} title="신한 주거래" detail="신한 · 입출금" />
  <ListButtonItem prefix={<LogoTile name="비상금" face="name" />} title="비상금" detail="현금" />
</List>

{/* 카드 혜택 — 카드 그림 56 */}
<List>
  <ListButtonItem prefix={<CardArt width={56} src={card.imgUrl} issuer="삼성카드" name="iD SELECT ALL" />} title="iD SELECT ALL" detail="신용 · 삼성카드" />
  <ListButtonItem prefix={<CardArt width={56} src={null} issuer="NH농협카드" name="올원 Pay" />} title="올원 Pay" detail="체크 · NH농협카드" />
</List>`,
    render: () =>
      `<div style="display:flex; flex-wrap:wrap; align-items:flex-start; gap:var(--spacing-x5) var(--spacing-x6);">
  ${captioned(
    "거래 · ListTile — 카테고리 · 태그 · 이체(회색)",
    list([
      listItem({ prefix: listTile(ICONS.utensils, "bg-chart-orange-weak text-chart-orange"), title: "김밥천국", detail: "식비 · 현대카드" }),
      listItem({ prefix: listTile(ICONS.tag, "bg-chart-violet-weak text-chart-violet"), title: "동네 서점", detail: "취미 · 현대카드" }),
      listItem({ prefix: listTile(ICONS.arrowLeftRight, "bg-chart-gray-weak text-chart-gray"), title: "비상금으로 이체", detail: "신한 주거래 → 비상금" }),
    ]),
  )}
  ${captioned(
    "자산 · LogoTile 40",
    list([
      listButtonItem({ prefix: logoTile({ name: "신한" }), title: "신한 주거래", detail: "신한 · 입출금" }),
      listButtonItem({ prefix: logoTile({ name: "비상금", face: "name" }), title: "비상금", detail: "현금" }),
    ]),
  )}
  ${captioned(
    "카드 혜택 · CardArt 56",
    list([
      listButtonItem({ prefix: cardArt56({ issuer: "삼성카드", name: "iD SELECT ALL", src: CARD_PORTRAIT, portrait: true }), title: "iD SELECT ALL", detail: "신용 · 삼성카드" }),
      listButtonItem({ prefix: cardArt56({ issuer: "NH농협카드", name: "올원 Pay" }), title: "올원 Pay", detail: "체크 · NH농협카드" }),
    ]),
  )}
</div>`,
  },
];
