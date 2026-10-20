/*
 * shadcn Accordion 예제 — docs site components/accordion.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(혜택 상세 — 시트 · 대화상자(separated) · 카드 상세 — 혜택(inline))은 차례 · 제목 · 코드가
 * specs/components/accordion.md 의 "코드" 절과 같고, 뒤의 둘(모두 접기 — 유의사항 · 앞 아이콘 · 막힌 항목)은 md 의 모두 펼치기 · State 를 코드로 더 보인다.
 * 구조는 SEED Accordion(rootage accordion.json · accordion-item.json, @seed-design/react 2.0.0 — Apache-2.0)이다 — 변형 inline · separated, 크기 medium 하나,
 * 꺾쇠 · 펼침 300ms. 여럿 열기 · "모두 펼치기" · 상세 없는 항목 · 카드 상세의 쓰임은 groo 가 정했다(2026-10-10). 옛 예제(Radix 베이스 · 아래 선만 ·
 * 꺾쇠 16 · 하나만 여는 Single · 인라인 style)를 대신한다.
 *
 * ROOT · ITEM · ACCORDION_BODY · ACCORDION_PANEL_TEXT · EXPAND_ALL 은 recipes/shadcn/components/ui/accordion.tsx 의 상수와, TRIGGER_* · CONTENT_* · PREFIX_* ·
 * TITLE_* · DESCRIPTION_* · CHEVRON_* 는 그 파일의 짜임 함수(accordionTriggerVariants · accordionTriggerContentVariants …)가 cn() 으로 잇는 글과,
 * HEADING · PLAIN_MIN · HEADER · HEADER_TITLE 은 그 파일의 JSX 에 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 카드 상세의 카드 면은
 * card.tsx 의 값을 옮겨 썼다 — CARD_* 는 card-examples.mjs 의 것과 같다. 규칙은 specs/components/accordion.md, 수치 원본은 specs/components/accordion.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 아코디언 <div data-slot="accordion" data-variant> > 항목 <div data-slot="accordion-item" data-accordion-row data-state> >
 * 머리말 <h3 data-slot="accordion-heading"> > 트리거 <button aria-expanded aria-controls data-slot="accordion-trigger"> > 콘텐츠 층
 * <span data-slot="accordion-trigger-content">(앞 아이콘 · 본문(제목 · 설명) · 꺾쇠) + 펼친 내용 <div data-slot="accordion-content" hidden?> >
 * <div data-slot="accordion-content-text">. 상세가 없는 항목은 <div data-slot="accordion-plain-item" data-accordion-row> — 단추 · 머리말 · 꺾쇠가 없다.
 * 트리거 · 내용의 id 는 레시피가 useId 로 만든다 — 미리보기는 읽을 수 있는 이름으로 미리 이었다.
 * 레시피의 스크립트(누르면 펼치고 접기 · 높이 300ms · ↓ ↑ Home End · 누르는 순간 --press-basis 재기)는 정적 HTML 에 없다 — 트리거를 누르면 바탕은
 * 레시피 그대로 바뀌지만 펼침은 그대로다. 그림은 펼친 순간을 멈춘 것이다. 아이콘은 lucide-react 와 같은 모양의 inline SVG 다(lucide 의 class · xmlns 는
 * 그리지 않는다).
 */

// ── accordion.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 줄(항목 · 상세가 없는 줄) 사이 선 — inline 만. 첫 줄 위 · 끝 줄 아래에는 긋지 않는다(1px · stroke-neutral-subtle · 좌우 24)
const ROOT = {
  inline: [
    "flex flex-col",
    "[&>[data-accordion-row]+[data-accordion-row]]:before:block [&>[data-accordion-row]+[data-accordion-row]]:before:h-px [&>[data-accordion-row]+[data-accordion-row]]:before:mx-x6",
    "[&>[data-accordion-row]+[data-accordion-row]]:before:bg-stroke-neutral-subtle [&>[data-accordion-row]+[data-accordion-row]]:before:content-['']",
  ].join(" "),
  // 항목마다 Card 면 — 사이 8
  separated: "flex flex-col gap-x2",
};

// 항목 면 — separated 는 Card 면(1px stroke-neutral-weak · 모서리 16 · 그림자 없음). 바탕은 놓인 면 그대로
const ITEM = {
  inline: "relative",
  separated: "relative overflow-hidden rounded-r4 border border-solid border-stroke-neutral-weak bg-transparent",
};

const ACCORDION_BODY = "flex min-w-0 flex-1 flex-col items-start gap-x0_5";

// 펼친 내용의 글 — 좌우 24 · 아래 16(위 0), text-article-note 14 / 22 · fg-neutral-muted, 줄바꿈 문자를 지킨다
const ACCORDION_PANEL_TEXT = "px-global-gutter pb-x4 pt-0 font-sans text-article-note font-normal text-fg-neutral-muted whitespace-pre-line break-keep [overflow-wrap:break-word]";

// 모두 펼치기 — Card 머리 동작과 같은 글 버튼(SEED Text Button): 보이는 상자 36 · 좌우 14 · 모서리 8, 글 t4 · 700 · fg-neutral-muted · 아이콘 없음, 누르는 영역 44
const EXPAND_ALL = [
  "relative -mr-x3_5 inline-flex h-9 shrink-0 cursor-pointer items-center rounded-r2 border-0 bg-transparent px-x3_5",
  "font-sans text-t4 font-bold text-fg-neutral-muted",
  "before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[@media(hover:hover)]:hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// ── accordion.tsx 의 짜임 함수가 잇는 글 ────────────────────────────────

// 트리거(accordionTriggerVariants) — 줄 전체가 누르는 자리. 바탕 층은 ::before(누르거나 올리면 좌우 6 들어와 모서리 10), 포커스 링은 안쪽 2px.
// 누름 색은 --trigger-pressed(흰 면 bg-layer-default-pressed · 경고 상자 bg-warning-weak-pressed — Collapsible), 링의 모서리는 놓인 면을 따른다
const TRIGGER_BASE = "group/accordion-trigger relative flex min-h-[54px] w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left font-sans";
const TRIGGER_PRESSED = {
  layer: "[--trigger-pressed:var(--color-bg-layer-default-pressed)]",
  warning: "[--trigger-pressed:var(--color-bg-warning-weak-pressed)]",
};
const TRIGGER_STATE = [
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:enabled:hover:before:inset-x-x1_5 [@media(hover:hover)]:enabled:hover:before:rounded-r2_5 [@media(hover:hover)]:enabled:hover:before:bg-(--trigger-pressed)",
  "enabled:active:before:inset-x-x1_5 enabled:active:before:rounded-r2_5 enabled:active:before:bg-(--trigger-pressed)",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed",
].join(" ");
const TRIGGER_RING = { square: "rounded-none", r3_5: "rounded-r3_5", r2_5: "rounded-r2_5" };

// 콘텐츠 층(accordionTriggerContentVariants) — 앞 아이콘 · 본문 · 꺾쇠. 위아래 16 · 좌우 24(경고 상자 16), 사이 12. 누르는 동안 이 층만 2px 거리 축소
const CONTENT_BASE = "relative flex w-full min-w-0 items-center gap-x3 py-x4";
const CONTENT_PADX = { gutter: "px-global-gutter", x4: "px-x4" };
const CONTENT_TRANSITION = "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]";
const CONTENT_PRESS = "group-active/accordion-trigger:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-active/accordion-trigger:[scale:1]";

// 앞 아이콘(accordionPrefixVariants) — 22 · fg-neutral(막히면 fg-disabled)
const PREFIX_BASE = "flex shrink-0 [&>svg]:size-[22px] [&>svg]:shrink-0";
const PREFIX_COLOR = { enabled: "text-fg-neutral", disabled: "text-fg-disabled" };

// 제목 · 설명(accordionTitleVariants · accordionDescriptionVariants) — 늘 줄을 바꾼다(단어 단위)
const TITLE_BASE = "font-sans text-t5 font-medium break-keep [overflow-wrap:break-word]";
const TITLE_COLOR = { enabled: "text-fg-neutral", disabled: "text-fg-disabled" };
const DESCRIPTION_BASE = "font-sans text-t3 font-medium break-keep [overflow-wrap:break-word]";
const DESCRIPTION_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };

// 꺾쇠(accordionChevronVariants) — 20, 펼치면 180°(300ms easing, 모션 줄이기면 바로)
const CHEVRON_BASE = "size-5 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";
const CHEVRON_OPEN = "rotate-180";
const CHEVRON_COLOR = { enabled: "text-fg-neutral-subtle", disabled: "text-fg-disabled" };

// ── accordion.tsx 의 JSX 에 적힌 클래스 ────────────────────────────────

const HEADING = "m-0 flex";
// 상세가 없는 항목 — 콘텐츠 층과 같은 짜임에 높이 54
const PLAIN_MIN = "min-h-[54px]";
// 목록 머리(AccordionHeader) — 높이 32 · 아래 8 · 제목 t5 · 700
const HEADER = "mb-x2 flex min-h-9 items-center justify-between gap-x2";
const HEADER_TITLE = "min-w-0 font-sans text-t5 font-bold text-fg-neutral break-keep [overflow-wrap:break-word]";

// ── card.tsx 의 값 — 카드 상세의 카드 면(default · body accordion) · 머리 ──

const CARD_ROOT = "relative isolate block overflow-hidden rounded-r4 text-start font-sans text-fg-neutral no-underline";
const CARD_VARIANT = { default: "border border-solid border-stroke-neutral-weak bg-bg-layer-default" };
const CARD_BODY = { accordion: "pb-x2 [&:not(:has(>[data-slot=card-header]))]:pt-x2" };
const CARD_HEADER = "flex items-center justify-between gap-x2";
const CARD_HEADER_BODY = { accordion: "px-x6 pb-x1 pt-x6" };
const CARD_TITLE = "min-w-0 font-sans text-t5 font-bold text-fg-neutral";

// ── 짜임 함수 — 레시피처럼 차례대로 잇는다 ───────────────────────────────

const triggerClass = ({ ring = "square", pressed = "layer" } = {}) => [TRIGGER_BASE, TRIGGER_PRESSED[pressed], TRIGGER_STATE, TRIGGER_RING[ring]].join(" ");
const contentClass = ({ padX = "gutter", press = false } = {}) => [CONTENT_BASE, CONTENT_PADX[padX], CONTENT_TRANSITION, press && CONTENT_PRESS].filter(Boolean).join(" ");
const tone = (disabled) => (disabled ? "disabled" : "enabled");
const prefixClass = (disabled) => `${PREFIX_BASE} ${PREFIX_COLOR[tone(disabled)]}`;
const titleClass = (disabled) => `${TITLE_BASE} ${TITLE_COLOR[tone(disabled)]}`;
const descriptionClass = (disabled) => `${DESCRIPTION_BASE} ${DESCRIPTION_COLOR[tone(disabled)]}`;
const chevronClass = ({ open = false, disabled = false } = {}) => [CHEVRON_BASE, open && CHEVRON_OPEN, CHEVRON_COLOR[tone(disabled)]].filter(Boolean).join(" ");

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// lucide-react 1.28 과 같은 모양(24 격자) — 크기는 놓인 자리의 [&>svg]:size-* · [&_svg]:size-* · size-5 가 정한다
const svg = (paths, cls = "") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ""} aria-hidden="true">${paths}</svg>`;
const PATHS = {
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  creditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
};

// 혜택 열둘 — 첫 이름이 28자(줄을 바꾼다), 대중교통 · 편의점은 상세가 없다(그냥 줄). 지어낸 혜택이다
const LONG_DETAIL = [
  "■ 할인 대상: 네이버페이 · 카카오페이 · 토스페이 · 페이코 · SSG페이에서 이 카드로 결제한 온라인 가맹점 이용금액",
  "■ 할인율: 이용금액의 10% 결제일 할인(건당 이용금액 1만 원 이상)",
  "■ 월 할인 한도: 전월 이용실적 30만 원 이상 50만 원 미만 5천 원 / 50만 원 이상 100만 원 미만 1만 원 / 100만 원 이상 2만 원",
  "■ 유의사항: 간편결제 내 충전 · 송금 · 상품권 구매 · 대학 등록금 · 아파트 관리비 · 국세 · 지방세 납부는 할인 대상에서 빠져요.",
  "■ 해외 가맹점 이용분, 무이자 할부 · 부분 무이자 할부 이용분은 할인과 실적 모두에서 빠져요.",
  "■ 할인 받은 이용금액은 다음 달 전월 실적에 들어가요. 다만 할인 금액만큼은 실적에서 빠져요.",
  "■ 결제일 할인은 결제일에 청구 금액에서 빠지고, 카드를 해지하면 남은 할인은 사라져요.",
].join("\n");
const BENEFITS = [
  { id: "pay", category: "온라인 간편결제 · 배달앱 · 해외 직구 통합 할인", summary: "네이버페이 · 카카오페이 · 토스페이 결제 시 이용금액의 10% 결제일 할인(월 최대 2만 원)", detail: LONG_DETAIL },
  { id: "coffee", category: "커피", summary: "스타벅스 · 투썸플레이스 · 이디야 50% 할인", detail: "■ 할인 대상: 스타벅스 · 투썸플레이스 · 이디야 커피 매장 이용금액\n■ 월 2회 · 회당 최대 5천 원" },
  { id: "transit", category: "대중교통", summary: "버스 · 지하철 10% 청구할인", detail: null },
  { id: "telecom", category: "통신", summary: "SKT · KT · LG U+ 자동이체 5천 원 할인", detail: "■ 통신요금을 이 카드로 자동이체할 때\n■ 전월 실적 30만 원 이상" },
  { id: "store", category: "편의점", summary: "GS25 · CU · 세븐일레븐 5% 할인", detail: null },
  { id: "movie", category: "영화", summary: "CGV · 롯데시네마 · 메가박스 4천 원 할인", detail: "■ 온라인 예매 포함 · 월 1회" },
  { id: "fuel", category: "주유", summary: "GS칼텍스 · SK에너지 리터당 60원 할인", detail: "■ 주유소 이용 시 · 월 최대 6천 원\n■ 셀프 주유소 포함" },
  { id: "abroad", category: "해외", summary: "해외 이용금액 1.5% 적립 · 해외 결제 수수료 면제", detail: "■ 해외 가맹점(온 · 오프라인) 이용금액\n■ 수수료 면제는 브랜드 수수료 제외" },
  { id: "shop", category: "쇼핑", summary: "쿠팡 · 11번가 · G마켓 7% 할인", detail: "■ 건당 2만 원 이상 · 월 최대 1만 원" },
  { id: "clinic", category: "병원 · 약국", summary: "병원 · 약국 5% 할인", detail: "■ 월 최대 5천 원" },
  { id: "sub", category: "구독", summary: "넷플릭스 · 유튜브 프리미엄 · 멜론 30% 할인", detail: "■ 정기결제 이용금액 · 월 최대 5천 원" },
  { id: "lounge", category: "공항 라운지", summary: "국내외 공항 라운지 연 2회 무료", detail: "■ 본인만 · 동반자 제외\n■ 전월 실적 50만 원 이상" },
];
// 유의사항 다섯 — 첫 제목이 84자, 셋째는 상세가 없다
const CAUTIONS = [
  { id: "c1", title: "전월 이용실적에서 제외되는 이용금액: 상품권 · 선불카드 구매 및 충전, 국세 · 지방세 · 공과금, 아파트 관리비, 대학 등록금, 무이자 할부 이용분", detail: "■ 위 이용금액은 전월 실적 산정에서 빠져요.\n■ 할인 받은 이용금액도 할인 금액만큼 실적에서 빠져요." },
  { id: "c2", title: "연회비 · 카드 발급 후 첫 달 실적 기준", detail: "■ 발급 후 첫 달은 실적 조건 없이 혜택을 받을 수 있어요." },
  { id: "c3", title: "할인 한도는 서비스별로 따로 적용돼요", detail: null },
  { id: "c4", title: "혜택 변경 안내", detail: "■ 카드사 사정에 따라 혜택이 바뀔 수 있어요. 바뀌면 6개월 전에 알려요." },
  { id: "c5", title: "해외 원화결제(DCC) 이용 시 별도 수수료가 붙어요", detail: "■ 해외에서 원화로 결제하면 3 ~ 8% 수수료가 더해져요." },
];

// 제목 + 설명 — 레시피의 accordion-trigger-body
const body = ({ title, description, disabled }) =>
  `<span data-slot="accordion-trigger-body" class="${ACCORDION_BODY}"><span data-slot="accordion-title" class="${titleClass(disabled)}">${esc(title)}</span>${
    description ? `<span data-slot="accordion-description" class="${descriptionClass(disabled)}">${esc(description)}</span>` : ""
  }</span>`;
const prefixIcon = (icon, disabled) => (icon ? `<span aria-hidden="true" data-slot="accordion-prefix-icon" class="${prefixClass(disabled)}">${svg(PATHS[icon])}</span>` : "");

// <AccordionItem value> + <AccordionTrigger title description prefixIcon headingLevel> + <AccordionContent> — 펼침이 아니면 내용은 hidden
function item({ uid, variant, title, description, icon, detail, open = false, disabled = false, level = 3 }) {
  const triggerId = `${uid}-trigger`;
  const contentId = `${uid}-content`;
  const state = open ? "open" : "closed";
  const button = attrs([
    'type="button"',
    `id="${triggerId}"`,
    `aria-expanded="${open}"`,
    `aria-controls="${contentId}"`,
    disabled && "disabled",
    'data-slot="accordion-trigger"',
    `data-state="${state}"`,
    `class="${triggerClass({ ring: variant === "separated" ? "r3_5" : "square" })}"`,
  ]);
  const content = `<span data-slot="accordion-trigger-content" class="${contentClass({ press: !disabled })}">${prefixIcon(icon, disabled)}${body({ title, description, disabled })}${svg(PATHS.chevronDown, chevronClass({ open, disabled }))}</span>`;
  const panel = `<div id="${contentId}" data-slot="accordion-content" data-state="${state}"${open ? "" : ' hidden=""'}><div data-slot="accordion-content-text" class="${ACCORDION_PANEL_TEXT}">${esc(detail)}</div></div>`;
  return `<div ${attrs(['data-slot="accordion-item"', 'data-accordion-row=""', `data-state="${state}"`, disabled && 'data-disabled=""', `class="${ITEM[variant]}"`])}><h${level} data-slot="accordion-heading" class="${HEADING}"><button ${button}>${content}</button></h${level}>${panel}</div>`;
}

// <AccordionPlainItem title description> — 상세가 없는 항목. 단추 · 머리말 · 꺾쇠 없이 같은 높이 · 같은 글 시작
const plainItem = ({ variant, title, description, icon }) =>
  `<div data-slot="accordion-plain-item" data-accordion-row="" class="${ITEM[variant]}"><div data-slot="accordion-plain-item-content" class="${contentClass()} ${PLAIN_MIN}">${prefixIcon(icon, false)}${body({ title, description })}</div></div>`;

// <Accordion id variant> — 항목 · 그냥 줄을 잇는다
const accordion = ({ id, variant, rows }) => `<div data-slot="accordion" data-variant="${variant}" class="${ROOT[variant]}" id="${id}">${rows.join("")}</div>`;

// <AccordionExpandAll controls values expandable> — 상세가 있는 항목이 모두 펼쳐져 있으면 "모두 접기"
const expandAll = ({ controls, allOpen }) =>
  `<button type="button" aria-controls="${controls}" data-slot="accordion-expand-all" data-state="${allOpen ? "expanded" : "collapsed"}" class="${EXPAND_ALL}"><span>${allOpen ? "모두 접기" : "모두 펼치기"}</span></button>`;

// <AccordionHeader title> — 시트 · 대화상자의 목록 머리
const header = (title, right) => `<div data-slot="accordion-header" class="${HEADER}"><div data-slot="accordion-header-title" class="${HEADER_TITLE}">${esc(title)}</div>${right}</div>`;

// 혜택 목록 — 상세가 있으면 항목, 없으면 그냥 줄
const benefitRows = (variant, uid, openIds = []) =>
  BENEFITS.map((b) =>
    b.detail
      ? item({ uid: `${uid}-${b.id}`, variant, title: b.category, description: b.summary, detail: b.detail, open: openIds.includes(b.id) })
      : plainItem({ variant, title: b.category, description: b.summary }),
  );

// <Card body="accordion"> + <CardHeader><CardTitle /> + 오른쪽 모두 펼치기</CardHeader> — card.tsx 그대로(머리 위 24 · 좌우 24 · 아래 4, 카드 아래 8)
const accordionCard = ({ uid, title, right, accordionHtml }) =>
  `<div data-slot="card" data-variant="default" data-body="accordion" data-press="none" class="${CARD_ROOT} ${CARD_VARIANT.default} ${CARD_BODY.accordion}"><div data-slot="card-header" class="${CARD_HEADER} ${CARD_HEADER_BODY.accordion}"><h2 id="${uid}-title" data-slot="card-title" class="${CARD_TITLE}">${esc(title)}</h2>${right}</div>${accordionHtml}</div>`;

// 미리보기 틀 — 시트 본문(떠 있는 표면 bg-layer-floating · 좌우 24 · 위 모서리 24)과 카드가 놓이는 바닥(bg-layer-basement · 여백 24).
// 레시피의 Bottom Sheet · 화면이 아니라 그 자리만 그린 그림이다
const sheetBody = (html) =>
  `<div style="max-width:390px; padding:var(--spacing-x6) var(--spacing-global-gutter) var(--spacing-x4); border-radius:var(--radius-r6) var(--radius-r6) 0 0; background:var(--color-bg-layer-floating); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle); color:var(--color-fg-neutral); font-family:var(--font-sans);">${html}</div>`;
const floor = (html) =>
  `<div style="max-width:438px; padding:var(--spacing-x6) var(--spacing-x4); border-radius:var(--radius-r4); background:var(--color-bg-layer-basement); font-family:var(--font-sans);">${html}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const accordionExamples = [
  {
    title: "혜택 상세 — 시트 · 대화상자(separated)",
    description:
      "항목 하나하나가 따로 읽히는 정보 묶음(카드 혜택 상세 시트 · 대화상자)은 separated 다 — 항목마다 Card 면(1px stroke-neutral-weak · 모서리 16 · 그림자 없음)이고 사이 8, 면은 놓인 표면 그대로다(시트의 bg-layer-floating). 트리거는 줄 전체가 누르는 자리 — 위아래 16 · 좌우 24, 제목 16 / 22 · 500 · fg-neutral, 설명 13 / 18 · 500 · fg-neutral-subtle(제목 아래 2), 꺾쇠 20 · fg-neutral-subtle 이고 제목만이면 54, 설명이 있으면 74 다. 제목 · 설명은 늘 줄을 바꾼다 — 28자 첫 혜택도 자르지 않는다. 펼친 내용은 좌우 24 · 아래 16(위 0) · 14 / 22 · fg-neutral-muted 이고 줄바꿈 문자를 지키며, 안에서 스크롤하지 않는다. 상세가 없는 대중교통 · 편의점은 그냥 줄(AccordionPlainItem)이다 — 꺾쇠 · 단추 · 머리말 없이 같은 높이 · 같은 글 시작이고 Tab 이 건너뛴다. 목록 머리(제목 16 / 22 · 700 + 건수, 높이 32 · 아래 8) 오른쪽의 \"모두 펼치기\" 는 상세가 있는 열 항목을 한 번에 펼친다. 그림은 커피를 펼친 순간이다.",
    jsx: `import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionExpandAll,
  AccordionHeader,
  AccordionItem,
  AccordionPlainItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const [open, setOpen] = useState<string[]>([]) // 처음에는 모두 접힘
const expandable = benefits.filter((b) => b.detail).map((b) => b.id)

<AccordionHeader title={\`혜택 상세 · \${benefits.length}건\`}>
  <AccordionExpandAll controls="benefit-detail" values={open} expandable={expandable} onValuesChange={setOpen} />
</AccordionHeader>
<Accordion id="benefit-detail" variant="separated" values={open} onValuesChange={setOpen}>
  {benefits.map((b) =>
    b.detail ? (
      <AccordionItem key={b.id} value={b.id}>
        <AccordionTrigger title={b.category} description={b.summary} />
        <AccordionContent>{b.detail}</AccordionContent>
      </AccordionItem>
    ) : (
      // 상세가 없으면 그냥 줄 — 막힌 트리거로 그리지 않는다
      <AccordionPlainItem key={b.id} title={b.category} description={b.summary} />
    ),
  )}
</Accordion>`,
    render: () =>
      sheetBody(
        `${header(`혜택 상세 · ${BENEFITS.length}건`, expandAll({ controls: "acc-ex-benefit-detail", allOpen: false }))}${accordion({
          id: "acc-ex-benefit-detail",
          variant: "separated",
          rows: benefitRows("separated", "acc-ex-sheet", ["coffee"]),
        })}`,
      ),
  },

  {
    title: "카드 상세 — 혜택(inline)",
    description:
      "화면 · 카드 안에서 목록으로 읽히는 자리는 inline(기본)이다 — 연속 목록 + 항목 사이 선(1px stroke-neutral-subtle · 좌우 24 — List 의 들인 선, 첫 항목 위 · 마지막 항목 아래에는 긋지 않는다). 카드 상세의 혜택 · 유의사항은 웹 · 앱 모두 카드 안의 inline 아코디언이다 — Card body=\"accordion\" 은 좌우 여백 0 이라 트리거가 카드 가장자리까지 가고, 머리는 목록 카드와 같은 위 24 · 좌우 24 · 아래 4, 카드 아래 여백 8 이 마지막 트리거의 아래 16 과 합쳐 보이는 24 다. 머리 오른쪽 동작 자리에 모두 펼치기를 두고 건수는 제목에 붙인다(\"혜택 · 12건\"). 카드 제목이 h2 라 트리거는 h3(기본)이다. 누르거나 올리면 바탕이 좌우 6 들어와 모서리 10 — 카드 모서리 16 과 동심이고, 누르는 동안 콘텐츠 층만 2px 거리로 준다.",
    jsx: `import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionExpandAll,
  AccordionItem,
  AccordionPlainItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

const [open, setOpen] = useState<string[]>([])
const expandable = benefits.filter((b) => b.detail).map((b) => b.id)

{/* 카드 제목이 h2 라 트리거는 h3(기본) — 트리거가 카드 가장자리까지, 카드 아래 8 */}
<Card body="accordion">
  <CardHeader>
    <CardTitle>혜택 · {benefits.length}건</CardTitle>
    <AccordionExpandAll controls="card-benefits" values={open} expandable={expandable} onValuesChange={setOpen} />
  </CardHeader>
  <Accordion id="card-benefits" values={open} onValuesChange={setOpen}>
    {benefits.map((b) =>
      b.detail ? (
        <AccordionItem key={b.id} value={b.id}>
          <AccordionTrigger title={b.category} description={b.summary} />
          <AccordionContent>{b.detail}</AccordionContent>
        </AccordionItem>
      ) : (
        <AccordionPlainItem key={b.id} title={b.category} description={b.summary} />
      ),
    )}
  </Accordion>
</Card>`,
    render: () =>
      floor(
        accordionCard({
          uid: "acc-ex-card",
          title: `혜택 · ${BENEFITS.length}건`,
          right: expandAll({ controls: "acc-ex-card-benefits", allOpen: false }),
          accordionHtml: accordion({ id: "acc-ex-card-benefits", variant: "inline", rows: benefitRows("inline", "acc-ex-card") }),
        }),
      ),
  },

  {
    title: "유의사항 — 모두 펼치면 \"모두 접기\"",
    description:
      "여럿을 함께 연다 — 다른 항목을 열어도 앞 항목은 닫히지 않는다(하나만 여는 모드는 없다). 모두 펼치기는 상세가 있는 항목만 연다 — 상세가 없는 셋째 줄은 그대로 그냥 줄이다. 상세가 있는 항목이 모두 펼쳐지면 글이 \"모두 접기\" · 아이콘 chevrons-down-up 으로 바뀌고, 하나라도 접히면 다시 \"모두 펼치기\" 다(이름은 보이는 글 · aria-controls 는 아코디언 id). 유의사항은 설명 없이 제목만 있는 트리거(54)다 — 84자 첫 제목도 한 줄 말줄임 없이 줄을 바꿔 다 보인다(펼쳐도 상세만 나와 잘린 제목은 어디에서도 읽을 수 없다). 펼쳐도 화면을 저절로 스크롤하지 않고 초점은 트리거 · 단추에 그대로다 — 길면 페이지가 스크롤한다.",
    jsx: `const expandable = cautions.filter((c) => c.detail).map((c) => c.id)

<Card body="accordion">
  <CardHeader>
    <CardTitle>유의사항 · {cautions.length}건</CardTitle>
    {/* 모두 펼쳐져 있으면 글 · 아이콘이 "모두 접기" 로 — 단추가 정한다 */}
    <AccordionExpandAll controls="card-cautions" values={open} expandable={expandable} onValuesChange={setOpen} />
  </CardHeader>
  <Accordion id="card-cautions" values={open} onValuesChange={setOpen}>
    {cautions.map((c) =>
      c.detail ? (
        <AccordionItem key={c.id} value={c.id}>
          <AccordionTrigger title={c.title} />
          <AccordionContent>{c.detail}</AccordionContent>
        </AccordionItem>
      ) : (
        <AccordionPlainItem key={c.id} title={c.title} />
      ),
    )}
  </Accordion>
</Card>`,
    render: () =>
      floor(
        accordionCard({
          uid: "acc-ex-caution",
          title: `유의사항 · ${CAUTIONS.length}건`,
          right: expandAll({ controls: "acc-ex-card-cautions", allOpen: true }),
          accordionHtml: accordion({
            id: "acc-ex-card-cautions",
            variant: "inline",
            rows: CAUTIONS.map((c) =>
              c.detail ? item({ uid: `acc-ex-caution-${c.id}`, variant: "inline", title: c.title, detail: c.detail, open: true }) : plainItem({ variant: "inline", title: c.title }),
            ),
          }),
        }),
      ),
  },

  {
    title: "앞 아이콘 · 막힌 항목",
    description:
      "앞 아이콘(prefixIcon)은 22 · fg-neutral 이고 본문과 12 떨어진다 — 있을 때만 두고, 한 목록 안에서는 모두 두거나 모두 뺀다. 아이콘이 있어도 펼친 내용은 24 에서 시작해 줄 폭을 쓴다. 막힌 항목(disabled)은 앞 아이콘 · 제목 · 설명 · 꺾쇠가 모두 fg-disabled 이고 흐리게 하지 않는다 — 누르기 · 키보드가 막히고 ↓ ↑ 이동에서 빠진다. 상세가 없는 항목을 막힌 트리거로 그리지 않는다 — \"사용할 수 없음\" 으로 읽혀 혜택이 막힌 것처럼 들린다(그냥 줄로). separated 의 키보드 포커스 링은 항목 모서리를 따라 14(16 − 2)다.",
    jsx: `import { Coffee, CreditCard, Ticket } from "lucide-react"

<Accordion variant="separated">
  <AccordionItem value="coffee">
    <AccordionTrigger prefixIcon={<Coffee />} title="커피" description="스타벅스 · 투썸플레이스 · 이디야 50% 할인" />
    <AccordionContent>{coffeeDetail}</AccordionContent>
  </AccordionItem>
  <AccordionItem value="movie">
    <AccordionTrigger prefixIcon={<Ticket />} title="영화" description="CGV · 롯데시네마 · 메가박스 4천 원 할인" />
    <AccordionContent>{movieDetail}</AccordionContent>
  </AccordionItem>
  {/* 이번 달 실적이 모자라 쓸 수 없는 혜택 — 전용 색으로 막는다 */}
  <AccordionItem value="annual" disabled>
    <AccordionTrigger prefixIcon={<CreditCard />} title="연회비 캐시백" description="전월 실적 50만 원 이상부터" />
    <AccordionContent>{annualDetail}</AccordionContent>
  </AccordionItem>
</Accordion>`,
    render: () =>
      sheetBody(
        accordion({
          id: "acc-ex-icons",
          variant: "separated",
          rows: [
            item({ uid: "acc-ex-icons-coffee", variant: "separated", icon: "coffee", title: "커피", description: "스타벅스 · 투썸플레이스 · 이디야 50% 할인", detail: BENEFITS[1].detail, open: true }),
            item({ uid: "acc-ex-icons-movie", variant: "separated", icon: "ticket", title: "영화", description: "CGV · 롯데시네마 · 메가박스 4천 원 할인", detail: BENEFITS[5].detail }),
            item({ uid: "acc-ex-icons-annual", variant: "separated", icon: "creditCard", title: "연회비 캐시백", description: "전월 실적 50만 원 이상부터", detail: "■ 연회비의 100% 캐시백", disabled: true }),
          ],
        }),
      ),
  },
];
