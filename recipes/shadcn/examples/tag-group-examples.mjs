/*
 * shadcn Tag Group 예제 — docs site components/tag-group.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 셋(목록 줄의 설명 · 앞세울 항목과 아이콘 · 줄어드는 정도)은 차례 · 제목 · 코드가
 * specs/components/tag-group.md 의 "코드" 절과 같고, 뒤의 셋(크기 · 줄바꿈 · 톤과 뒤 아이콘)은 md 의 Properties 를 코드로 더 보인다.
 * porest 에 처음 두는 컴포넌트다 — 웹의 2px 점 · HR 의 "•" 로 가르던 메타 줄을 대신한다.
 *
 * TAG_GROUP_BASE · TAG_GROUP_VARIANTS · TAG_GROUP_DEFAULTS · ITEM_BASE · ITEM_VARIANTS · ITEM_DEFAULTS 는 recipes/shadcn/components/ui/tag-group.tsx 의
 * cva(tagGroupVariants · tagGroupItemVariants)와, ICON · ICON_SIZE · LABEL · UNIT · SEPARATOR · SEPARATOR_MODE · SEPARATOR_GLYPH 는 그 파일의 상수와,
 * GLUED 는 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다.
 * 규칙은 specs/components/tag-group.md, 수치 원본은 specs/components/tag-group.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음 <span data-slot="tag-group"> > 칸 <span data-slot="tag-group-unit">(항목 + 뒤 구분) >
 * 항목 <span data-slot="tag-group-item">(앞 · 뒤 아이콘 <span aria-hidden data-slot="tag-group-item-prefix-icon | -suffix-icon"> ·
 * 글 <span data-slot="tag-group-item-label"> · 읽을 글 <span class="sr-only">) · 구분 <span data-slot="tag-group-separator">(보이는 " · " <span aria-hidden> +
 * 보이지 않는 ", " <span class="sr-only">). truncate 면 항목에 style 의 flex-shrink(기본 1) · min-width(첫 글자 + "…" 2.1em + 아이콘, 두 글자 이하는 max-content)가 붙는다(React 의 style={{ flexShrink, minWidth }}).
 * 줄바꿈(wrap)의 뒤 아이콘은 글 안으로 들어가 마지막 낱말과 함께 줄이 안 바뀌는 칸(GLUED)에 놓인다 — 레시피의 withSuffixIcon 과 같다
 * (truncate 는 아이콘이 글 밖 — 글만 말줄임하고 아이콘은 잘리지 않는다).
 * tag-group.tsx 는 cva 결과를 cn() 에 넣지만 지워지는 클래스가 없다 — 그래서 그대로 잇는다. 묶음은 누르지 않아 스크립트가 없다.
 * 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는 그리지 않는다).
 */

// ── tag-group.tsx 의 cva 와 같은 값 ──────────────────────────────────────

// 묶음(tagGroupVariants) — 글자는 묶음이 정한다. wrap 은 inline-block · 낱말 단위 줄바꿈, truncate 는 한 줄(inline-flex · 최대 폭 100%)
const TAG_GROUP_BASE = "font-sans";

const TAG_GROUP_VARIANTS = {
  size: {
    t2: "text-t2",
    t3: "text-t3",
    t4: "text-t4",
  },
  truncate: {
    false: "inline-block break-keep [overflow-wrap:break-word]",
    // min-width 0 — 제목 옆처럼 flex 줄의 칸이어도 줄어들어 말줄임한다
    true: "inline-flex min-w-0 max-w-full items-center whitespace-nowrap",
  },
};

const TAG_GROUP_DEFAULTS = { size: "t2", truncate: false };

// 항목(tagGroupItemVariants) — 톤 · 굵기는 항목마다. wrap 은 글 흐름 안(inline), truncate 는 한 줄의 칸(줄어들며 말줄임)
const ITEM_BASE = "";

const ITEM_VARIANTS = {
  tone: {
    neutralSubtle: "text-fg-neutral-subtle",
    neutral: "text-fg-neutral",
    brand: "text-fg-brand",
  },
  weight: {
    regular: "font-normal",
    bold: "font-bold",
  },
  truncate: {
    false: "inline",
    true: "inline-flex min-w-0 items-center",
  },
};

const ITEM_DEFAULTS = { tone: "neutralSubtle", weight: "regular", truncate: false };

// ── tag-group.tsx 의 상수와 같은 값 ──────────────────────────────────────

// 아이콘 — 상자 높이를 줄 높이(1lh)로 두고 가운데, 12 · 13 · 14. cn(ICON, ICON_SIZE[size], 앞 "mr-x0_5" | 뒤 "ml-x0_5")
const ICON = "inline-flex h-[1lh] shrink-0 items-center align-top [&>svg]:shrink-0";
const ICON_SIZE = {
  t2: "[&>svg]:size-x3",
  t3: "[&>svg]:size-[13px]",
  t4: "[&>svg]:size-x3_5",
};

// 항목 글 — wrap 은 안쪽 띄어쓰기에서 줄을 바꾸고, truncate 는 각자 말줄임
const LABEL = {
  wrap: "whitespace-normal",
  truncate: "min-w-0 truncate",
};

// 묶음 칸 — 항목 하나 + 뒤 구분. wrap 은 nowrap(아이콘 ↔ 글 · 글 ↔ 구분 사이에서 줄이 안 바뀐다), truncate 는 contents
const UNIT = {
  wrap: "whitespace-nowrap",
  truncate: "contents",
};

// 구분 — 보이는 " · "(숨김) + 보이지 않는 ", "(읽힘). 늘 fg-disabled · 400
const SEPARATOR = "font-normal text-fg-disabled";
const SEPARATOR_MODE = {
  wrap: "whitespace-normal",
  truncate: "shrink-0 whitespace-pre",
};
const SEPARATOR_GLYPH = "\u00A0\u00B7\u0020";

// ── tag-group.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

// wrap 의 뒤 아이콘 — 글의 마지막 낱말과 아이콘을 줄이 안 바뀌는 칸에 함께(아이콘이 홀로 다음 줄로 가지 않게)
const GLUED = "whitespace-nowrap";

// ── cva 풀이 ──────────────────────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 참 · 거짓 축(truncate)은 cva 처럼 "true" · "false" 글자 키로 찾는다
const variantKey = (v) => (typeof v === "boolean" ? String(v) : v);

function cvaOf(base, { variants = {}, compoundVariants = [], defaultVariants = {} } = {}) {
  return (props = {}) => {
    const p = { ...defaultVariants };
    for (const [k, v] of Object.entries(props)) if (v !== undefined) p[k] = v;
    const parts = [base];
    for (const [axis, map] of Object.entries(variants)) parts.push(map[variantKey(p[axis])]);
    for (const { class: cls, className, ...when } of compoundVariants) {
      if (Object.entries(when).every(([k, v]) => p[k] === v)) parts.push(cls, className);
    }
    return parts.filter(Boolean).join(" ");
  };
}

const tagGroupVariants = cvaOf(TAG_GROUP_BASE, { variants: TAG_GROUP_VARIANTS, defaultVariants: TAG_GROUP_DEFAULTS });
const tagGroupItemVariants = cvaOf(ITEM_BASE, { variants: ITEM_VARIANTS, defaultVariants: ITEM_DEFAULTS });

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 의 eye · split(24 격자) — 크기는 감싼 자리의 [&>svg]:size-* 가 정한다
const svg = (paths) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const LUCIDE = {
  eye: svg('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
  split: svg('<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/>'),
};

// <TagGroupItem> — tag-group.tsx 그대로. text 는 글(문자열), group 은 묶음의 문맥(size · truncate · tone · weight)
function tagItem({ text, tone, weight, prefixIcon, suffixIcon, shrink = 1, srLabel }, group) {
  const mode = group.truncate ? "truncate" : "wrap";
  const hideText = srLabel != null && srLabel !== "";
  const icon = (node, side) =>
    `<span aria-hidden="true" data-slot="tag-group-item-${side}-icon" class="${ICON} ${ICON_SIZE[group.size]} ${side === "prefix" ? "mr-x0_5" : "ml-x0_5"}">${node}</span>`;
  // 줄바꿈의 뒤 아이콘 — 글 안, 마지막 낱말과 같은 줄이 안 바뀌는 칸에 둔다(withSuffixIcon). truncate 는 글 밖(글만 말줄임)
  const glued = mode === "wrap" && suffixIcon != null;
  let body = esc(text);
  if (glued) {
    const cut = text.search(/\s\S+\s*$/) + 1;
    body = `${esc(text.slice(0, cut))}<span class="${GLUED}">${esc(text.slice(cut))}${icon(suffixIcon, "suffix")}</span>`;
  }
  const cls = tagGroupItemVariants({ tone: tone ?? group.tone, weight: weight ?? group.weight, truncate: group.truncate });
  // 최소 폭 — 첫 글자 + "…"(2.1em) + 아이콘 · 사이, 두 글자 이하는 글 폭(레시피의 itemMinWidth — React 의 style={{ flexShrink, minWidth }})
  const short = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(String(text).trim())].length <= 2;
  const minWidth = short ? "max-content" : prefixIcon != null || suffixIcon != null ? `calc(2.1em + ${{ t2: 12, t3: 13, t4: 14 }[group.size]}px + var(--spacing-x0_5))` : "2.1em";
  const style = group.truncate ? ` style="flex-shrink:${shrink}; min-width:${minWidth}"` : "";
  return `<span data-slot="tag-group-item" class="${cls}"${style}>${prefixIcon != null ? icon(prefixIcon, "prefix") : ""}<span data-slot="tag-group-item-label"${hideText ? ' aria-hidden="true"' : ""} class="${LABEL[mode]}">${body}</span>${suffixIcon != null && !glued ? icon(suffixIcon, "suffix") : ""}${hideText ? `<span class="sr-only">${esc(srLabel)}</span>` : ""}</span>`;
}

// <TagGroup> — tag-group.tsx 그대로. items 는 항목 인자 목록이고 빈 글은 건너뛴다. 칸마다 항목 + 뒤 구분(마지막 칸은 구분 없음)
function tagGroup({ size = "t2", truncate = false, tone = "neutralSubtle", weight = "regular", items = [] }) {
  const group = { size, truncate, tone, weight };
  const mode = truncate ? "truncate" : "wrap";
  const list = items.filter((it) => (it.text != null && String(it.text).trim() !== "") || it.prefixIcon != null || it.suffixIcon != null);
  const separator = `<span data-slot="tag-group-separator" class="${SEPARATOR} ${SEPARATOR_MODE[mode]}"><span aria-hidden="true">${SEPARATOR_GLYPH}</span><span class="sr-only">, </span></span>`;
  const units = list.map((it, i) => `<span data-slot="tag-group-unit" class="${UNIT[mode]}">${tagItem(it, group)}${i < list.length - 1 ? separator : ""}</span>`);
  return `<span data-slot="tag-group" class="${tagGroupVariants({ size, truncate })}">${units.join("")}</span>`;
}

// 보조 기술이 읽는 글 — 항목(또는 srLabel)을 ", " 로 잇는다(미리보기의 이름표)
const reading = (items) => items.map((it) => it.srLabel || it.text).join(", ");

// 흰 표면 · 폰 화면 · 이름표 — 미리보기 틀(레시피가 아니다)
const SURFACE =
  "background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x5) var(--spacing-x6); color:var(--color-fg-neutral); font-family:var(--font-sans);";
const surface = (html) => `<div style="${SURFACE}">${html}</div>`;
const SCREEN =
  "max-width:360px; background:var(--color-bg-layer-default); border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); padding:var(--spacing-x3) 0; color:var(--color-fg-neutral); font-family:var(--font-sans);";
const stack = (items, gap = "var(--spacing-x5)") => `<div style="display:flex; flex-direction:column; gap:${gap};">${items.join("")}</div>`;
const CAPTION = "font-size:var(--text-t2); line-height:var(--text-t2--line-height); font-weight:400; color:var(--color-fg-neutral-subtle);";
const CODE = `${CAPTION} font-family:ui-monospace, SFMono-Regular, Menlo, monospace;`;
const labeled = (html, caption, style = CAPTION) =>
  `<div style="display:flex; flex-direction:column; gap:var(--spacing-x1_5); min-width:0;">${html}<span style="${style}">${caption}</span></div>`;
// 목록 줄 흉내 — 제목(t5) + 설명 줄(묶음) + 금액. 좌우 24(화면 여백)
const ledgerRow = (title, tags, amount) =>
  `<div style="display:flex; align-items:center; gap:var(--spacing-x2_5); padding:var(--spacing-x3) var(--spacing-global-gutter);"><span style="display:flex; flex:1; flex-direction:column; align-items:flex-start; gap:var(--spacing-x0_5); min-width:0;"><span style="font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);">${esc(title)}</span>${tags}</span><span style="flex-shrink:0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); font-weight:700; color:var(--color-fg-neutral);">${esc(amount)}</span></div>`;

// ── 화면 예시의 값 ────────────────────────────────────────────────────────

const TX = [{ text: "식비" }, { text: "신한카드" }, { text: "오후 2:10", shrink: 0 }];
const CARD_BENEFIT = [{ text: "전월 30만원 이상", tone: "neutral", weight: "bold" }, { text: "할인형" }, { text: "연회비 2만원" }];
const NOTICE = [{ text: "인사팀" }, { text: "10월 2일" }, { text: "12", prefixIcon: LUCIDE.eye, srLabel: "조회 12" }];
const LONG_ASSET = [{ text: "교통", shrink: 0 }, { text: "신한카드 Deep Dream 체크(1234)", shrink: 2 }, { text: "오후 2:10", shrink: 0 }];

// ── 예제 ──────────────────────────────────────────────────────────────────

export const tagGroupExamples = [
  {
    title: "목록 줄의 설명 — 한 줄",
    description:
      "여러 메타 정보(카테고리 · 자산 · 시각)를 \" · \" 로 이어 한 줄로 보이는 글줄이다 — 읽기만 한다. 목록 줄의 설명 줄은 t3 13/18 · truncate(한 줄 — 줄 높이가 늘지 않는다)이고, 시각처럼 꼭 보일 항목은 shrink={0} 으로 줄지 않게 한다. 항목 사이 구분은 묶음이 스스로 넣는다 — 보이는 \" · \"(앞 공백은 줄이 안 바뀌는 공백 · fg-disabled)는 보조 기술에 숨기고 그 자리에 보이지 않는 \", \" 를 둬 \"식비, 신한카드, 오후 2:10\" 으로 끊어 읽는다. 글은 fg-neutral-subtle · 400(흰 바탕 5.50:1)이다. 같은 자리의 항목은 화면마다 같은 순서다(분류 · 자산 · 시각).",
    jsx: `import { TagGroup, TagGroupItem } from "@/components/ui/tag-group"

<TagGroup size="t3" truncate>
  <TagGroupItem>{tx.category}</TagGroupItem>
  <TagGroupItem>{tx.assetName}</TagGroupItem>
  <TagGroupItem shrink={0}>{formatTime(tx.at)}</TagGroupItem>
</TagGroup>`,
    render: () =>
      stack(
        [
          `<div style="${SCREEN}">${ledgerRow("스타벅스 강남역점", tagGroup({ size: "t3", truncate: true, items: TX }), "5,600원")}</div>`,
          `<span style="${CAPTION}">읽는 글 — "${esc(reading(TX))}"</span>`,
        ],
        "var(--spacing-x2)",
      ),
  },

  {
    title: "앞세울 항목 · 아이콘",
    description:
      "톤 · 굵기는 항목마다 고른다 — 금액 · 핵심 수치처럼 앞세울 항목 하나만 tone=\"neutral\"(fg-neutral) · weight=\"bold\"(700)로 둔다. 기본 크기는 t2 12/16 이고 넘치면 낱말 단위로 줄을 바꾼다. 아이콘은 항목의 앞(prefixIcon) 또는 뒤(suffixIcon) 하나 — 글자색을 따르고 크기는 묶음이 정한다(12 · 13 · 14 · 글과 2). 눈(조회)처럼 뜻이 있는 아이콘은 srLabel 로 읽을 글을 준다 — 주면 보이는 글을 숨기고 \"조회 12\" 를 읽는다.",
    jsx: `import { Eye } from "lucide-react"

<TagGroup>
  <TagGroupItem tone="neutral" weight="bold">전월 30만원 이상</TagGroupItem>
  <TagGroupItem>할인형</TagGroupItem>
  <TagGroupItem>연회비 2만원</TagGroupItem>
</TagGroup>

<TagGroup>
  <TagGroupItem>인사팀</TagGroupItem>
  <TagGroupItem>10월 2일</TagGroupItem>
  <TagGroupItem prefixIcon={<Eye />} srLabel="조회 12">12</TagGroupItem>
</TagGroup>`,
    render: () =>
      surface(
        stack([
          labeled(tagGroup({ items: CARD_BENEFIT }), `읽는 글 — "${esc(reading(CARD_BENEFIT))}"`),
          labeled(tagGroup({ items: NOTICE }), `읽는 글 — "${esc(reading(NOTICE))}"`),
        ]),
      ),
  },

  {
    title: "줄어드는 정도",
    description:
      "truncate 는 한 줄이다 — 넘치면 항목 글이 각자 말줄임(…)하고 구분은 줄지 않는다. 줄어드는 정도는 항목의 shrink — 기본 1, 0 은 줄지 않고 1 이상은 넘친 폭을 '글 폭 × shrink' 비율로 나눠 함께 준다(차례대로가 아니다). 줄어드는 항목도 첫 글자 + \"…\"(2.1em) 까지만 준다 — 두 글자 이하 항목은 글 폭 그대로다. 좁은 폭에서 긴 자산 이름(shrink={2})만 줄고 분류 · 시각(shrink={0})은 그대로다. 말줄임해도 보조 기술은 글 전체를 읽는다. 가게 이름 · 주소처럼 말줄임하면 읽기 어려운 자리는 줄바꿈(기본)이 낫다. 미리보기 칸은 폭 240 이다.",
    jsx: `<TagGroup size="t3" truncate>
  <TagGroupItem shrink={0}>교통</TagGroupItem>
  <TagGroupItem shrink={2}>신한카드 Deep Dream 체크(1234)</TagGroupItem>
  <TagGroupItem shrink={0}>오후 2:10</TagGroupItem>
</TagGroup>`,
    render: () =>
      surface(
        stack([
          labeled(`<div style="display:flex; max-width:240px;">${tagGroup({ size: "t3", truncate: true, items: LONG_ASSET })}</div>`, "shrink={0} · {2} · {0} — 긴 자산 이름만 준다", CODE),
          labeled(
            `<div style="display:flex; max-width:240px;">${tagGroup({ size: "t3", truncate: true, items: LONG_ASSET.map(({ shrink, ...it }) => it) })}</div>`,
            "모두 shrink 1(기본) — 함께 준다",
            CODE,
          ),
        ]),
      ),
  },

  {
    title: "크기 — t2 · t3 · t4",
    description:
      "크기는 묶음에 하나다 — t2 12/16(기본 — 카드 · 상세 머리의 메타) · t3 13/18(목록 줄의 설명 줄) · t4 14/19(상세 본문 위 · 넓은 화면). 아이콘은 12 · 13 · 14 로 글자에 맞추고 글과 사이 2 다. 한 줄 안에서 크기를 섞지 않는다 — 강조는 톤 · 굵기로 한다. 글은 글자 크기 설정을 따른다(rem).",
    jsx: `<TagGroup size="t2">…</TagGroup>   {/* 기본 */}
<TagGroup size="t3">…</TagGroup>
<TagGroup size="t4">…</TagGroup>`,
    render: () =>
      surface(
        stack(
          ["t2", "t3", "t4"].map((size) =>
            labeled(tagGroup({ size, items: [{ text: "인사팀" }, { text: "10월 2일" }, { text: "12", prefixIcon: LUCIDE.eye, srLabel: "조회 12" }] }), `size="${size}"`, CODE),
          ),
        ),
      ),
  },

  {
    title: "줄바꿈 — 낱말 단위 · 구분은 줄 끝에",
    description:
      "넘치면 기본(wrap)은 낱말 단위로 줄을 바꾼다(keep-all · break-word — v114). 구분 \" · \" 는 앞 공백이 줄이 안 바뀌는 공백(U+00A0)이라 앞 항목에 붙어 줄 끝에 남고, 다음 줄은 항목으로 시작한다(SEED 웹은 음절에서 끊고 구분이 줄 첫머리에 남는다). 항목 안 띄어쓰기에서도 줄이 바뀌고, 한 줄보다 긴 낱말만 칸 끝에서 끊는다. 미리보기 칸은 폭 200 이다.",
    jsx: `<TagGroup>
  <TagGroupItem>서울 서초구 서초4동</TagGroupItem>
  <TagGroupItem>500m</TagGroupItem>
  <TagGroupItem>어제</TagGroupItem>
  <TagGroupItem>조회수 128</TagGroupItem>
</TagGroup>`,
    render: () =>
      surface(`<div style="max-width:200px;">${tagGroup({ items: [{ text: "서울 서초구 서초4동" }, { text: "500m" }, { text: "어제" }, { text: "조회수 128" }] })}</div>`),
  },

  {
    title: "톤 brand · 뒤 아이콘",
    description:
      "brand(fg-brand)는 내 항목 표시처럼 브랜드와 닿는 자리에만 아껴 쓴다. 뒤 아이콘(suffixIcon)은 글 뒤 2 에 붙는다 — 줄바꿈 묶음에서는 글의 마지막 낱말과 아이콘을 한 덩어리로 묶어 아이콘만 다음 줄로 가지 않는다. 갈래(분할)처럼 뜻이 있는 아이콘은 srLabel(\"분할 2건\")로 읽을 글을 준다. 구분 \" · \" 는 톤과 관계없이 fg-disabled 다.",
    jsx: `import { Split } from "lucide-react"

<TagGroup>
  <TagGroupItem tone="brand">내가 씀</TagGroupItem>
  <TagGroupItem>인사팀</TagGroupItem>
  <TagGroupItem>3분 전</TagGroupItem>
</TagGroup>

<TagGroup size="t3">
  <TagGroupItem>식비</TagGroupItem>
  <TagGroupItem>신한카드</TagGroupItem>
  <TagGroupItem suffixIcon={<Split />} srLabel="분할 2건">2</TagGroupItem>
</TagGroup>`,
    render: () => {
      const mine = [{ text: "내가 씀", tone: "brand" }, { text: "인사팀" }, { text: "3분 전" }];
      const split = [{ text: "식비" }, { text: "신한카드" }, { text: "2", suffixIcon: LUCIDE.split, srLabel: "분할 2건" }];
      return surface(
        stack([
          labeled(tagGroup({ items: mine }), `읽는 글 — "${esc(reading(mine))}"`),
          labeled(tagGroup({ size: "t3", items: split }), `읽는 글 — "${esc(reading(split))}"`),
        ]),
      );
    },
  },
];
