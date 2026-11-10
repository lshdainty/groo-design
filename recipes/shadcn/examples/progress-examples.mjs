/*
 * shadcn Progress 예제 — docs site components/progress.html 에서 Preview + Code 토글로 보인다.
 * 각 예제 = { title, description, jsx, render() }. 앞의 둘(예산 — 한도 · 저축 목표 · 카드 실적 — 목표)은 차례 · 제목 · 코드가
 * specs/components/progress.md 의 "코드" 절과 같고, 뒤의 둘(막대만 · 값이 0 일 때)은 md 의 코드 설명 · Properties 를 코드로 더 보인다.
 * 옛 Progress 예제(높이 2 · 4 · 8 · bg-primary 채움 · Radix)를 대신한다 — Progress 는 "얼마나 찼나" 의 미터다(진행은 Progress Circle).
 *
 * TRACK · FILL · STATUS 는 recipes/shadcn/components/ui/progress.tsx 의 상수와, ROOT · HEADER · LABEL · AMOUNT · FILL_MIN 은 그 파일의 JSX 에
 * 적힌 클래스와 글자 하나까지 같아야 한다 — 두 파일을 함께 고친다. 상태 · 오른쪽 글을 정하는 measure() 도 레시피의 것과 같은 셈이다.
 * 규칙은 specs/components/progress.md, 수치 원본은 specs/components/progress.yaml.
 *
 * Preview 는 정적 HTML 이다 — 페이지의 Tailwind v4 browser CDN 이 클래스를 utility 로 만든다.
 * 짜임은 레시피가 그리는 DOM 그대로다 — 묶음 <div data-slot="progress" data-meaning data-state> > 이름 줄 <div aria-hidden data-slot="progress-header">
 * (이름 <span data-slot="progress-label"> · 오른쪽 글 <span data-slot="progress-status" data-state>) · 막대 <div role="meter" data-slot="progress-track">
 * (aria-label "{이름} {목표} 중 {현재}" · aria-valuemin 0 · aria-valuemax 목표 · aria-valuenow(목표를 넘으면 목표) · aria-valuetext 오른쪽 글) >
 * 채움 <div data-slot="progress-fill" data-state style="width"> · 금액 줄 <span aria-hidden data-slot="progress-amount">.
 * 채움 폭의 300ms 전환은 값이 바뀔 때만 보인다 — 정적 그림은 그 값에 멈춰 있다. 카드는 미리보기 그림이다.
 */

// ── progress.tsx 의 상수와 같은 값 ─────────────────────────────────────────

// 트랙 — 높이 8 · 모서리 full · bg-neutral-weak
const TRACK = "relative h-2 w-full overflow-hidden rounded-full bg-bg-neutral-weak";
// 채움 — 브랜드 글자색, 넘친 한도는 위험 색. 폭이 바뀌면 300ms enter(모션 줄이기면 바로)
const FILL =
  "h-full rounded-full bg-fg-brand data-[state=over]:bg-fg-critical [transition:width_var(--motion-duration-d6)_var(--motion-ease-enter)] motion-reduce:transition-none";
// 오른쪽 글 — 비율은 fg-neutral-subtle, 넘침은 fg-critical 700, 달성은 fg-neutral 700
const STATUS =
  "shrink-0 text-t3 font-normal tabular-nums text-fg-neutral-subtle data-[state=over]:font-bold data-[state=over]:text-fg-critical data-[state=reached]:font-bold data-[state=reached]:text-fg-neutral";

// ── progress.tsx 의 JSX 에 적힌 클래스 ─────────────────────────────────────

// 묶음 — 세로 · 사이 6
const ROOT = "flex flex-col gap-x1_5 font-sans";
// 이름 줄 — 이름 · 오른쪽 글을 양 끝에 글자 바탕선으로, 사이 적어도 8
const HEADER = "flex items-baseline justify-between gap-x2";
const LABEL = "min-w-0 text-t4 font-medium text-fg-neutral break-keep [overflow-wrap:break-word]";
// 금액 줄 — "현재 / 목표"
const AMOUNT = "text-t2 font-normal tabular-nums text-fg-neutral-subtle";
// 값이 0 보다 크면 채움은 적어도 높이만큼(8) — 둥근 끝이 찌그러지지 않게
const FILL_MIN = "min-w-2";

// ── 레시피의 셈(measure) ──────────────────────────────────────────────────

const won = new Intl.NumberFormat("ko-KR");
const formatWon = (n) => `${won.format(n)}원`;

// 값 → 상태 · 채움 비율(0 ~ 1) · 오른쪽 글. 0 보다 작은 값은 0 으로 본다
function measure(value, max, meaning, formatValue) {
  const current = Math.max(value, 0);
  const ratio = max > 0 ? current / max : current > 0 ? 1 : 0;
  const state = meaning === "limit" ? (current > max ? "over" : "enabled") : current >= max ? "reached" : "enabled";
  const status =
    state === "over" ? `${formatValue(current - max)} 초과` : state === "reached" ? "달성" : `${Math.round(Math.min(ratio, 1) * 100)}%`;
  return { current, state, status, fill: Math.min(ratio, 1) };
}

// ── 미리보기 조각 ─────────────────────────────────────────────────────────

const attrs = (list) => list.filter(Boolean).join(" ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// <ProgressBar> — 막대만. 이름(label → aria-label) · 값 글(valueText → aria-valuetext)은 부르는 쪽이 준다
function progressBar({ value, max, meaning = "limit", label, valueText }) {
  const { current, state, fill } = measure(value, max, meaning, formatWon);
  const track = attrs([
    'role="meter"',
    'aria-valuemin="0"',
    `aria-valuemax="${max}"`,
    `aria-valuenow="${Math.min(current, max)}"`,
    'data-slot="progress-track"',
    `data-meaning="${meaning}"`,
    `data-state="${state}"`,
    `class="${TRACK}"`,
    label && `aria-label="${esc(label)}"`,
    valueText && `aria-valuetext="${esc(valueText)}"`,
  ]);
  const fillCls = [FILL, current > 0 && FILL_MIN].filter(Boolean).join(" ");
  return `<div ${track}><div data-slot="progress-fill" data-state="${state}" class="${fillCls}" style="width:${+(fill * 100).toFixed(4)}%;"></div></div>`;
}

// <Progress> — 이름 줄 · 막대 · 금액 줄 한 묶음
function progress({ label, value, max, meaning = "limit", formatValue = formatWon }) {
  const { current, state, status } = measure(value, max, meaning, formatValue);
  const head = `<div aria-hidden="true" data-slot="progress-header" class="${HEADER}"><span data-slot="progress-label" class="${LABEL}">${esc(label)}</span><span data-slot="progress-status" data-state="${state}" class="${STATUS}">${esc(status)}</span></div>`;
  const bar = progressBar({ value, max, meaning, label: `${label} ${formatValue(max)} 중 ${formatValue(current)}`, valueText: status });
  const amount = `<span aria-hidden="true" data-slot="progress-amount" class="${AMOUNT}">${esc(formatValue(current))} / ${esc(formatValue(max))}</span>`;
  return `<div data-slot="progress" data-meaning="${meaning}" data-state="${state}" class="${ROOT}">${head}${bar}${amount}</div>`;
}

// 흰 카드(미리보기 그림) — 트랙이 페이지 바탕과 같은 색이라 흰 면 위에 둔다. 막대 사이 24
const CARD =
  "display:flex; flex-direction:column; gap:var(--spacing-x6); width:100%; max-width:400px; padding:var(--spacing-x5) var(--spacing-x6); border-radius:var(--radius-r4); background:var(--color-bg-layer-default); box-shadow:inset 0 0 0 1px var(--color-stroke-neutral-subtle);";
const card = (items) => `<div style="${CARD}">${items.join("")}</div>`;

// ── 예제 ──────────────────────────────────────────────────────────────────

export const progressExamples = [
  {
    title: "예산 — 한도",
    description:
      "쓸수록 차는 막대(meaning=\"limit\" — 기본)다. 이름 줄(이름 t4 · 500 · 오른쪽 글 t3 · 숫자 폭 같게) · 막대(높이 8 · 모서리 full · 트랙 bg-neutral-weak) · 금액 줄(\"현재 / 목표\" t2 · fg-neutral-subtle)이 한 묶음이고 사이는 6 이다. 채움은 브랜드 글자색 fg-brand(다크는 밝은 짝)이고 오른쪽 글은 반올림한 정수 비율(\"88%\")이다. 한도를 넘으면 채움을 끝까지 칠하고 fg-critical 로 바꾸며, 얼마나 넘었는지는 막대가 아니라 오른쪽 글이 말한다 — \"20,000원 초과\"(fg-critical · 700). 주의 구간 색은 없다. 보조 기술에는 미터로 — \"식비 예산 400,000원 중 350,000원\" · 값 글 \"88%\".",
    jsx: `import { Progress } from "@/components/ui/progress"

<Progress label="식비 예산" value={350000} max={400000} />
{/* 넘치면 — 끝까지 위험 색, 오른쪽 "20,000원 초과" */}
<Progress label="교통 예산" value={120000} max={100000} />`,
    render: () =>
      card([progress({ label: "식비 예산", value: 350000, max: 400000 }), progress({ label: "교통 예산", value: 120000, max: 100000 })]),
  },

  {
    title: "저축 목표 · 카드 실적 — 목표",
    description:
      "모을수록 차는 막대(meaning=\"goal\")다. 목표에 닿으면 채움은 끝까지 차고 색은 브랜드 그대로, 오른쪽 글만 \"달성\"(fg-neutral · 700)으로 바뀐다 — 성공 색 · 축하 모양을 더하지 않는다. 넘어도(130%) 막대는 끝까지만 차고 금액 줄이 실제 값을 보인다. 돈이 아닌 값은 formatValue 로 단위를 바꾼다(\"6시간 / 8시간\").",
    jsx: `<Progress meaning="goal" label="여행 자금" value={1200000} max={2000000} />
<Progress meaning="goal" label="현대카드 신용카드 전월 실적" value={390000} max={300000} />  {/* "달성" — 막대는 끝까지 */}

{/* 돈이 아닌 값 — 단위를 바꾼다 */}
<Progress meaning="goal" label="오늘 근무" value={6} max={8} formatValue={(h) => \`\${h}시간\`} />`,
    render: () =>
      card([
        progress({ meaning: "goal", label: "여행 자금", value: 1200000, max: 2000000 }),
        progress({ meaning: "goal", label: "현대카드 신용카드 전월 실적", value: 390000, max: 300000 }),
        progress({ meaning: "goal", label: "오늘 근무", value: 6, max: 8, formatValue: (h) => `${h}시간` }),
      ]),
  },

  {
    title: "막대만 — ProgressBar",
    description:
      "이름 · 오른쪽 글을 직접 그릴 때는 막대(ProgressBar)만 쓴다 — 그때도 이름(aria-label \"{이름} {목표} 중 {현재}\")과 값 글(aria-valuetext — 보이는 오른쪽 글과 같은 말)을 꼭 준다. 빠지면 개발 중에 알린다. 보이는 글은 보조 기술에 숨겨 같은 말을 두 번 읽지 않게 한다.",
    jsx: `import { ProgressBar } from "@/components/ui/progress"

<div aria-hidden="true" className="flex justify-between text-t4">
  <span>식비</span>
  <span>88%</span>
</div>
<ProgressBar value={350000} max={400000} aria-label="식비 예산 400,000원 중 350,000원" aria-valuetext="88%" />`,
    render: () =>
      card([
        `<div style="display:flex; flex-direction:column; gap:var(--spacing-x1_5);"><div aria-hidden="true" class="flex justify-between text-t4" style="font-family:var(--font-sans); color:var(--color-fg-neutral);"><span>식비</span><span>88%</span></div>${progressBar({ value: 350000, max: 400000, label: "식비 예산 400,000원 중 350,000원", valueText: "88%" })}</div>`,
      ]),
  },

  {
    title: "값이 0 · 끝까지 · 넘침",
    description:
      "값이 0 이면 채움이 없고 트랙만 보인다. 0 보다 크면 채움은 적어도 높이만큼(8 — min-w-2) 그려 둥근 끝이 찌그러지지 않는다. 한도에 딱 닿으면(100%) 끝까지 브랜드 색이고, 넘어야 위험 색이다. 값이 바뀌면 채움 폭이 300ms(motion-duration-d6 · enter)로 따라 차고, 처음 그릴 때와 모션 줄이기면 바로 바뀐다.",
    jsx: `<Progress label="교통 예산" value={0} max={100000} />
<Progress label="교통 예산" value={1500} max={100000} />     {/* 1.5% — 채움은 적어도 8 */}
<Progress label="교통 예산" value={100000} max={100000} />   {/* 100% — 넘지 않았다 */}
<Progress label="교통 예산" value={100001} max={100000} />   {/* 1원 초과 */}`,
    render: () =>
      card([0, 1500, 100000, 100001].map((value) => progress({ label: "교통 예산", value, max: 100000 }))),
  },
];
