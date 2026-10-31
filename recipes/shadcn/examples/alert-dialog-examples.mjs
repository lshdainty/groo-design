/*
 * shadcn Alert Dialog 예제 — docs site components/alert-dialog.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(지우기 · 작성 중 나가기)은 차례 · 제목 · 코드가 specs/components/alert-dialog.md 의
 * "코드" 절과 같고, 뒤의 넷(세로 · 하나 · 크기 · 제목 없이)은 md 의 Properties · Guidelines 를 코드로 더 보인다.
 *
 * OVERLAY · CONTENT 는 recipes/shadcn/components/ui/alert-dialog.tsx 의 상수와, TITLE · DESCRIPTION · FOOTER · SR_ONLY 는 그 파일의 JSX 에
 * 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 버튼 BUTTON_* 는 button.tsx 의 cva 와 같다(button-examples.mjs 의
 * 것과 같다) — 이 파일이 쓰는 변형(neutralWeak · neutralSolid · criticalSolid) · 크기(medium · small)와 그에 걸리는 compound 만 옮겼다.
 * 규칙은 specs/components/alert-dialog.md, 수치 원본은 specs/components/alert-dialog.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 딤 <div data-slot="alert-dialog-overlay"> 와 확인창 <div role="alertdialog" data-slot="alert-dialog-content">
 * > 제목 <h2 data-slot="alert-dialog-title"> · 설명 <p data-slot="alert-dialog-description"> · 바닥 <div data-slot="alert-dialog-footer">
 * > [취소] <button data-slot="alert-dialog-cancel"> · [확정] <button data-slot="alert-dialog-action">. 보이는 제목이 없으면 aria-label 의 글을
 * 숨은 제목(sr-only)으로 맨 뒤에 둔다. 바닥의 배치는 CSS 가 글 폭으로 정한다 — 한쪽 글이 반 폭을 넘으면 줄이 넘어가고 확정이 위로 간다.
 * Radix 가 실행 중에 붙이는 것 중 열림(data-state="open" — 모션 클래스가 읽는다) · 이름 잇기(id · aria-labelledby · aria-describedby) ·
 * tabindex="-1" 을 그리고, 딤 · 확인창의 style(pointer-events)과 뒤 화면의 aria-hidden 은 그리지 않는다.
 * 확인창은 화면(fixed)에 뜬다 — 미리보기 틀(STAGE)에 transform 을 줘 fixed 의 기준을 틀로 바꾸고, isolation 으로 z-index(딤 z-alert 300 · 확인창 z-alert-content 301)를
 * 틀 안에 가둔다(사이트 머리 막대 위로 올라오지 않게). 틀과 그 안의 뒤 화면(가계부 줄)은 미리보기 그림이다.
 * 사이트의 `.content p { margin: 12px 0; color: text-primary }` 는 층(@layer) 밖 규칙이라 Tailwind utility 를 늘 이긴다 — 설명 <p> 에는
 * 클래스가 정한 바깥 여백 · 글자색을 style 로 한 번 더 적는다(P_FIX — 레시피에는 없는 미리보기용 덧칠).
 * 모션 클래스(animate-in · zoom-in-130 …)는 tw-animate-css 의 것이라 사이트에서는 아무 일도 하지 않는다 — 열린 순간을 멈춘 그림이다.
 * 레시피의 스크립트(처음 초점 · Esc = 취소 · 바깥 누르기 무시 · 초점 되돌리기 · 뒤로 가기 · 버튼 크기 고르기)는 정적 HTML 에 없다.
 */

// ── alert-dialog.tsx 의 상수와 같은 값 ─────────────────────────────────────

// 딤 — overlay-dim 라이트 0.50 · 다크 0.65. 100ms 로 나타나고 사라진다
const OVERLAY = [
  "fixed inset-0 z-(--z-alert) bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[var(--motion-duration-d2)] data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// 확인창 — 최대 272, 좌우 32 를 남긴다. 안쪽 20 · 모서리 20, 그림자 없음
const CONTENT = [
  "fixed left-1/2 top-1/2 z-(--z-alert-content) flex w-[calc(100%-var(--spacing-x8)*2)] max-w-[272px] -translate-x-1/2 -translate-y-1/2 flex-col",
  "rounded-r5 bg-bg-layer-floating p-x5 font-sans text-fg-neutral outline-none",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0",
  "motion-safe:data-[state=open]:zoom-in-130 motion-safe:data-[state=open]:duration-[var(--motion-duration-d4)] motion-safe:data-[state=open]:ease-[var(--motion-ease-enter-expressive)]",
  "motion-reduce:data-[state=open]:duration-[var(--motion-duration-d3)] motion-reduce:data-[state=open]:ease-[var(--motion-ease-enter)]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[var(--motion-duration-d2)] data-[state=closed]:ease-[var(--motion-ease-exit)]",
].join(" ");

// ── alert-dialog.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────

// 제목 t7 20 / 27 · 700
const TITLE = "m-0 text-t7 font-bold text-fg-neutral";
// 설명 t5 16 / 22 · 짙은 fg-neutral — 제목 아래 6, 제목이 없으면 0
const DESCRIPTION = "m-0 text-t5 font-normal text-fg-neutral [[data-slot=alert-dialog-title]+&]:mt-x1_5";
// 바닥 — 위 16 · 사이 8. 버튼마다 반 폭을 바탕으로(늘어나 채운다) 글 폭보다 줄지 않는다 — 넘치면 줄이 넘어가고 확정이 위
const FOOTER = "flex flex-wrap-reverse gap-x2 pt-x4 [&>*]:min-w-max [&>*]:grow [&>*]:basis-[calc(50%-var(--spacing-x2)/2)]";
// 보이는 제목이 없을 때의 숨은 제목
const SR_ONLY = "sr-only";

// ── button.tsx 의 cva 와 같은 값 — 바닥 버튼 ─────────────────────────────

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
    neutralSolid:
      "bg-bg-neutral-inverted text-fg-neutral-inverted hover:bg-bg-neutral-inverted-pressed active:bg-bg-neutral-inverted-pressed aria-busy:bg-bg-neutral-inverted-pressed [--progress-track:color-mix(in_srgb,var(--color-fg-neutral-inverted)_30%,transparent)] [--progress-range:var(--color-fg-neutral-inverted)]",
    neutralWeak:
      "bg-bg-neutral-weak text-fg-neutral hover:bg-bg-neutral-weak-pressed active:bg-bg-neutral-weak-pressed aria-busy:bg-bg-neutral-weak-pressed [--progress-track:var(--color-gray-500)] [--progress-range:var(--color-fg-neutral)]",
    criticalSolid:
      "bg-bg-critical-solid text-static-white hover:bg-bg-critical-solid-pressed active:bg-bg-critical-solid-pressed aria-busy:bg-bg-critical-solid-pressed [--progress-track:color-mix(in_srgb,var(--color-static-white)_30%,transparent)] [--progress-range:var(--color-static-white)]",
  },
  size: {
    small: "h-9 rounded-r2 [--press-basis:36] [--progress-size:14px]",
    medium: "h-10 rounded-r2 [--press-basis:40] [--progress-size:16px]",
  },
  layout: { withText: "", iconOnly: "" },
  ghostColor: { neutral: "", neutralSubtle: "", brand: "", critical: "" },
  flush: { left: "", right: "" },
};

const BUTTON_COMPOUND = [
  { size: "small", layout: "withText", className: "px-x3_5 py-x2 gap-x1 text-t4 [&_svg]:size-3.5" },
  { size: "medium", layout: "withText", className: "px-x4 py-x2_5 gap-x1_5 text-t4 [&_svg]:size-4" },
];

const BUTTON_DEFAULTS = { variant: "neutralSolid", size: "medium", layout: "withText", ghostColor: "neutral" };

// 사이트의 `.content p` 를 덮는 미리보기용 덧칠 — 설명의 바깥 여백(제목 아래 6 · 제목이 없으면 0)과 글자색
const P_FIX = {
  titled: "margin:var(--spacing-x1_5) 0 0; color:var(--color-fg-neutral);",
  untitled: "margin:0; color:var(--color-fg-neutral);",
};

// ── cva 풀이 · 미리보기 조각 ───────────────────────────────────────────────

// cva 와 같은 순서로 붙인다 — base → 축(선언 순) → 맞는 compound(선언 순). 고르지 않은 축은 기본값을 쓴다.
// 이 파일이 합치는 클래스에는 같은 속성을 다시 쓰는 자리가 없어 cn()(twMerge)은 이어 붙인 것과 같다
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

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 미리보기 틀 — 레시피의 딤 · 확인창은 화면(fixed)에 뜬다. transform 이 fixed 의 기준을 틀로 바꾸고 isolation 이 z-index 를 틀 안에 가둔다
const STAGE = (height) =>
  `position:relative; isolation:isolate; transform:translateZ(0); overflow:hidden; width:100%; height:${height}px; border:1px solid var(--color-stroke-neutral-subtle); border-radius:var(--radius-r4); background:var(--color-bg-layer-default);`;
// 뒤 화면 — 가계부 줄(미리보기 그림). 확인창이 열린 동안 보조 기술에는 숨는다
const PAGE_ROW =
  "display:flex; justify-content:space-between; gap:var(--spacing-x3); padding:var(--spacing-x3) 0; font-size:var(--text-t5); line-height:var(--text-t5--line-height); color:var(--color-fg-neutral);";
const page = () =>
  `<div aria-hidden="true" style="padding:var(--spacing-x6); font-family:var(--font-sans);"><div style="margin-bottom:var(--spacing-x2); font-size:var(--text-t7); line-height:var(--text-t7--line-height); font-weight:700; color:var(--color-fg-neutral);">가계부</div>${[
    ["김밥천국", "8,000원"],
    ["버스", "1,500원"],
    ["다이소", "12,300원"],
    ["월급", "3,200,000원"],
  ]
    .map(([title, amount]) => `<div style="${PAGE_ROW}"><span>${title}</span><span style="font-weight:700;">${amount}</span></div>`)
    .join("")}</div>`;
// 미리보기 칸 위의 이름표
const CAPTION =
  "display:block; margin-bottom:var(--spacing-x2); font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:var(--text-t2); line-height:var(--text-t2--line-height); color:var(--color-fg-neutral-subtle);";

// <Button> — button.tsx 그대로(cn(buttonVariants({ variant, size }))). 확인창 바닥은 크기를 Footer 가 넣는다(1280 미만 medium · 이상 small)
const button = ({ variant, size, slot, label }) =>
  `<button ${attrs(['type="button"', `class="${buttonVariants({ variant, size })}"`, slot && `data-slot="${slot}"`])}>${esc(label)}</button>`;

// <AlertDialog open> — 딤 + 확인창. uid 는 Radix 가 만드는 id 의 앞말(예제마다 달리한다).
// title 이 없으면 ariaLabel 이 이름이다 — 레시피는 그 글을 숨은 제목으로 그려 aria-labelledby 가 가리키게 한다(Content 에 aria-label 을 달지 않는다).
// cancel = null 이면 알리기만 하는 확인창(버튼 하나). size 는 Footer 가 고르는 크기(medium · small)
function alertDialog({ uid, title, ariaLabel, description, cancel = "취소", action, variant = "neutralSolid", size = "medium", height = 360 }) {
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const content = attrs([
    'role="alertdialog"',
    `id="${uid}"`,
    `aria-describedby="${descriptionId}"`,
    `aria-labelledby="${titleId}"`,
    'data-state="open"',
    'tabindex="-1"',
    'data-slot="alert-dialog-content"',
    'aria-modal="true"',
    `class="${CONTENT}"`,
  ]);
  const titleHtml = title != null ? `<h2 id="${titleId}" data-slot="alert-dialog-title" class="${TITLE}">${esc(title)}</h2>` : "";
  const descriptionHtml = `<p id="${descriptionId}" data-slot="alert-dialog-description" class="${DESCRIPTION}" style="${title != null ? P_FIX.titled : P_FIX.untitled}">${esc(description)}</p>`;
  const buttons = [
    cancel != null ? button({ variant: "neutralWeak", size, slot: "alert-dialog-cancel", label: cancel }) : "",
    button({ variant, size, slot: "alert-dialog-action", label: action }),
  ].join("");
  const hiddenTitle = title == null && ariaLabel != null ? `<h2 id="${titleId}" class="${SR_ONLY}">${esc(ariaLabel)}</h2>` : "";
  return `<div style="${STAGE(height)}">${page()}<div data-state="open" data-slot="alert-dialog-overlay" class="${OVERLAY}"></div><div ${content}>${titleHtml}${descriptionHtml}<div data-slot="alert-dialog-footer" class="${FOOTER}">${buttons}</div>${hiddenTitle}</div></div>`;
}

// ── 예제 ──────────────────────────────────────────────────────────────────

export const alertDialogExamples = [
  {
    title: "지우기",
    description:
      "되돌릴 수 없는 일 앞에서 묻는다 — 둘 중 하나를 고르는 자리다. 지우는 확정은 variant=\"criticalSolid\", 취소는 neutralWeak(Critical 은 확정에만). 버튼 글은 동작 이름이다(\"삭제\" — \"확인\" · \"예\" 로 뭉뚱그리지 않는다 — 고를 것이 없는 결과 알림만 \"확인\" 하나). 대상은 무엇인지 알 만큼 짚는다 — 이름 있는 대상은 이름, 거래 한 건은 날짜 · 금액. 닫기 버튼이 없고 바깥(딤)을 눌러도 닫히지 않는다 — Esc · 뒤로 가기는 취소와 같다. 열면 초점은 확인창으로 가고, 닫으면 연 자리로 돌아간다. 확인창은 최대 272 · 안쪽 20 · 모서리 20 이고 그림자 없이 딤(0.50 · 다크 0.65) 위에 뜬다(z-index L5 — 딤 z-alert 300 · 확인창 z-alert-content 301).",
    jsx: `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog"

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>거래 삭제</AlertDialogTitle>
    {/* 이름 없는 대상은 무엇인지 알 만큼 — 날짜 · 금액 */}
    <AlertDialogDescription>{tx.dateLabel} {tx.title} {formatWon(tx.amount)} 거래를 지워요. 삭제한 거래는 되돌릴 수 없어요.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction variant="criticalSolid" onClick={remove}>삭제</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    render: () =>
      alertDialog({
        uid: "alert-dialog-ex-delete",
        title: "거래 삭제",
        description: "10월 22일 점심 식사 12,000원 거래를 지워요. 삭제한 거래는 되돌릴 수 없어요.",
        action: "삭제",
        variant: "criticalSolid",
      }),
  },

  {
    title: "작성 중 나가기",
    description:
      "바뀐 값이 있는 폼을 닫으려 할 때 묻는다(Field 의 이탈 시 안내) — 대화상자 · 시트의 dirty 가 이 확인창을 띄운다. 취소 자리는 \"계속 작성\", 확정은 잃는 일이라 criticalSolid \"나가기\". 설명에 무엇이 사라지는지 적는다. 열린 대화상자 · 시트 위에 뜨고(L5), 닫으면 묻기 전 초점 자리로 돌아간다.",
    jsx: `<AlertDialogContent>
  <AlertDialogTitle>작성한 내용이 사라져요</AlertDialogTitle>
  <AlertDialogDescription>나가면 입력한 금액과 날짜가 저장되지 않아요.</AlertDialogDescription>
  <AlertDialogFooter>
    <AlertDialogCancel>계속 작성</AlertDialogCancel>
    <AlertDialogAction variant="criticalSolid" onClick={leave}>나가기</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`,
    render: () =>
      alertDialog({
        uid: "alert-dialog-ex-leave",
        title: "작성한 내용이 사라져요",
        description: "나가면 입력한 금액과 날짜가 저장되지 않아요.",
        cancel: "계속 작성",
        action: "나가기",
        variant: "criticalSolid",
      }),
  },

  {
    title: "세로 — 한쪽 글이 반 폭을 넘으면",
    description:
      "버튼 배치를 고르는 prop 은 없다 — AlertDialogFooter 가 글 폭으로 정한다. 버튼마다 반 폭(사이 8 을 뺀)을 바탕으로 두고 글 폭보다 줄지 않게 해, 한쪽 글이 반 폭을 넘으면 줄이 넘어가 세로로 쌓이고(wrap-reverse) 확정이 위, 취소가 아래로 간다 — 둘 다 폭 전체다. 코드의 차례(DOM 순서)는 늘 [취소] [확정] 이다.",
    jsx: `<AlertDialogContent>
  <AlertDialogTitle>관심 그룹 삭제</AlertDialogTitle>
  <AlertDialogDescription>그룹에 담은 종목 12개도 함께 빠져요.</AlertDialogDescription>
  <AlertDialogFooter>
    <AlertDialogCancel>취소</AlertDialogCancel>
    <AlertDialogAction variant="criticalSolid" onClick={remove}>그룹과 종목 함께 삭제</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`,
    render: () =>
      alertDialog({
        uid: "alert-dialog-ex-vertical",
        title: "관심 그룹 삭제",
        description: "그룹에 담은 종목 12개도 함께 빠져요.",
        action: "그룹과 종목 함께 삭제",
        variant: "criticalSolid",
      }),
  },

  {
    title: "하나 — 알리기",
    description:
      "꼭 알아야 할 일을 알리기만 할 때는 확정 버튼 하나를 둔다 — 폭 전체다. 지우거나 잃는 일이 아니라 variant 는 기본 neutralSolid 이고, 글은 버튼이 일을 하면 그 동작 이름(\"다시 로그인\"), 닫기만 하면 \"확인\" 이다(고를 것이 없는 결과 알림). Esc · 뒤로 가기는 그대로 닫는다.",
    jsx: `<AlertDialogContent>
  <AlertDialogTitle>로그인이 만료됐어요</AlertDialogTitle>
  <AlertDialogDescription>30분 동안 쓰지 않아 로그아웃했어요. 다시 로그인해 주세요.</AlertDialogDescription>
  <AlertDialogFooter>
    <AlertDialogAction onClick={login}>다시 로그인</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`,
    render: () =>
      alertDialog({
        uid: "alert-dialog-ex-single",
        title: "로그인이 만료됐어요",
        description: "30분 동안 쓰지 않아 로그아웃했어요. 다시 로그인해 주세요.",
        cancel: null,
        action: "다시 로그인",
      }),
  },

  {
    title: "크기 — 1280 미만 medium 40 · 이상 small 36",
    description:
      "버튼 크기는 고르지 않는다 — AlertDialogFooter 가 화면 폭으로 크기를 주지 않은 바로 아래 버튼에 넣는다(Input Button 과 같은 경계, useInputButtonSurface). 1280 미만은 Button medium 40, 1280 이상은 small 36 — 대화상자 바닥(36)과 같다. 확인창의 모양은 두 폭에서 같다.",
    jsx: `// 크기를 주지 않는다 — 1280 미만 medium 40 · 이상 small 36
<AlertDialogFooter>
  <AlertDialogCancel>취소</AlertDialogCancel>
  <AlertDialogAction variant="criticalSolid" onClick={remove}>삭제</AlertDialogAction>
</AlertDialogFooter>`,
    render: () =>
      [
        ["medium", "1280 미만 — medium 40"],
        ["small", "1280 이상 — small 36"],
      ]
        .map(
          ([size, caption]) =>
            `<div><span style="${CAPTION}">${caption}</span>${alertDialog({
              uid: `alert-dialog-ex-size-${size}`,
              title: "거래 삭제",
              description: "삭제한 거래는 되돌릴 수 없어요.",
              action: "삭제",
              variant: "criticalSolid",
              size,
              height: 240,
            })}</div>`,
        )
        .join(`<div style="height:var(--spacing-x4);"></div>`),
  },

  {
    title: "제목 없이 — aria-label",
    description:
      "설명만으로 충분하면 제목을 빼도 된다 — 그때는 AlertDialogContent 에 aria-label 로 묻는 말을 단다. 레시피가 그 글을 숨은 제목으로 그려 확인창의 이름이 된다(제목도 aria-label 도 없으면 개발 중에 경고한다). 설명은 제목이 없으면 위 여백 없이 맨 위에서 시작한다.",
    jsx: `<AlertDialogContent aria-label="알림을 끌까요?">
  <AlertDialogDescription>예산 알림을 끄면 예산을 넘어도 알려드리지 않아요.</AlertDialogDescription>
  <AlertDialogFooter>
    <AlertDialogCancel>취소</AlertDialogCancel>
    <AlertDialogAction onClick={turnOff}>알림 끄기</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`,
    render: () =>
      alertDialog({
        uid: "alert-dialog-ex-untitled",
        ariaLabel: "알림을 끌까요?",
        description: "예산 알림을 끄면 예산을 넘어도 알려드리지 않아요.",
        action: "알림 끄기",
      }),
  },
];
