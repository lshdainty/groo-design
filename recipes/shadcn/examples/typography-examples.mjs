/*
 * shadcn Typography 예제 — Groo typography 토큰을 사용한 prose 위계.
 */

const H1 = "text-display-md font-bold tracking-tight text-text-primary";
const H2 = "text-display-sm font-bold tracking-tight text-text-primary border-b border-border-default pb-2";
const H3 = "text-title-lg font-bold tracking-tight text-text-primary";
const H4 = "text-title-md font-semibold tracking-tight text-text-primary";
const P = "text-body-md text-text-primary";
const LEAD = "text-body-lg text-text-secondary";
const MUTED = "text-label-sm text-text-tertiary";
const BLOCKQUOTE = "border-l-4 border-border-default pl-4 italic text-text-secondary";
const CODE = "rounded bg-surface-input px-1.5 py-0.5 font-mono text-body-sm text-text-primary";

function el(tag, cls, content, extra = "") {
  return `<${tag} class="${cls}"${extra}>${content}</${tag}>`;
}

export const typographyExamples = [
  {
    title: "Heading hierarchy",
    description: "h1 → h4 위계 — display-md / display-sm / title-lg / title-md.",
    jsx: `<>
  <TypographyH1>가장 큰 제목</TypographyH1>
  <TypographyH2>섹션 제목</TypographyH2>
  <TypographyH3>하위 섹션 제목</TypographyH3>
  <TypographyH4>작은 제목</TypographyH4>
</>`,
    render: () => `<div style="display:flex; flex-direction:column; gap:16px; max-width:640px;">
  ${el("h1", H1, "가장 큰 제목")}
  ${el("h2", H2, "섹션 제목")}
  ${el("h3", H3, "하위 섹션 제목")}
  ${el("h4", H4, "작은 제목")}
</div>`,
  },

  {
    title: "Paragraph",
    description: "본문 — body-md 15/400/1.6 (한국어 lh 1.6 가독성).",
    jsx: `<TypographyP>
  사람과 일상이 숲처럼 자라나는 두 서비스의 단일 디자인 시스템. 한국어 본문
  가독성을 우선해 Pretendard를 기본 폰트로 사용하고, 영문 fallback으로 Inter를
  지정합니다.
</TypographyP>`,
    render: () => `<p class="${P}" style="margin:0; max-width:640px;">사람과 일상이 숲처럼 자라나는 두 서비스의 단일 디자인 시스템. 한국어 본문 가독성을 우선해 Pretendard를 기본 폰트로 사용하고, 영문 fallback으로 Inter를 지정합니다.</p>`,
  },

  {
    title: "Lead vs muted",
    description: "Lead(body-lg, 강조) vs Muted(label-sm, 보조).",
    jsx: `<div className="space-y-3">
  <TypographyLead>
    프로젝트 소개를 한 단락으로 요약합니다.
  </TypographyLead>
  <TypographyP>
    일반 본문. 페이지 전반에 사용됩니다.
  </TypographyP>
  <TypographyMuted>
    부가 정보 — 작성일, 카테고리, 추가 설명.
  </TypographyMuted>
</div>`,
    render: () => `<div style="display:flex; flex-direction:column; gap:12px; max-width:640px;">
  <p class="${LEAD}" style="margin:0;">프로젝트 소개를 한 단락으로 요약합니다.</p>
  <p class="${P}" style="margin:0;">일반 본문. 페이지 전반에 사용됩니다.</p>
  <p class="${MUTED}" style="margin:0;">부가 정보 — 작성일, 카테고리, 추가 설명.</p>
</div>`,
  },

  {
    title: "Blockquote + inline code",
    description: "인용 — 좌측 4px border + italic. 인라인 코드 — surface-input 배경.",
    jsx: `<TypographyP>
  Groo는 두 브랜드(<TypographyInlineCode>HR</TypographyInlineCode>,
  <TypographyInlineCode>Desk</TypographyInlineCode>)의 단일 디자인 시스템입니다.
</TypographyP>
<TypographyBlockquote>
  사람과 일상이 숲처럼 자라나는 조직.
</TypographyBlockquote>`,
    render: () => `<div style="display:flex; flex-direction:column; gap:16px; max-width:640px;">
  <p class="${P}" style="margin:0;">Groo는 두 브랜드(<code class="${CODE}">HR</code>, <code class="${CODE}">Desk</code>)의 단일 디자인 시스템입니다.</p>
  <blockquote class="${BLOCKQUOTE}" style="margin:0;">사람과 일상이 숲처럼 자라나는 조직.</blockquote>
</div>`,
  },

  {
    title: "Article composition",
    description: "전체 위계 — 글 한 편 구조.",
    jsx: `<article className="space-y-4">
  <TypographyH1>5월 회고</TypographyH1>
  <TypographyLead>
    한 달간 만든 디자인 시스템 정리.
  </TypographyLead>
  <TypographyH2>핵심 결정</TypographyH2>
  <TypographyP>
    본문 가독성을 위해 한국어 lh 1.6을 모든 본문 토큰에 통일했습니다.
  </TypographyP>
  <TypographyH3>토큰 정리</TypographyH3>
  <TypographyP>
    21 토큰을 15로 정리. <TypographyInlineCode>display</TypographyInlineCode>,
    <TypographyInlineCode>title</TypographyInlineCode>,
    <TypographyInlineCode>body</TypographyInlineCode> 카테고리로 재분류.
  </TypographyP>
  <TypographyMuted>2026-05-10 작성</TypographyMuted>
</article>`,
    render: () => `<article style="display:flex; flex-direction:column; gap:16px; max-width:640px;">
  ${el("h1", H1, "5월 회고")}
  <p class="${LEAD}" style="margin:0;">한 달간 만든 디자인 시스템 정리.</p>
  ${el("h2", H2, "핵심 결정")}
  <p class="${P}" style="margin:0;">본문 가독성을 위해 한국어 lh 1.6을 모든 본문 토큰에 통일했습니다.</p>
  ${el("h3", H3, "토큰 정리")}
  <p class="${P}" style="margin:0;">21 토큰을 15로 정리. <code class="${CODE}">display</code>, <code class="${CODE}">title</code>, <code class="${CODE}">body</code> 카테고리로 재분류.</p>
  <p class="${MUTED}" style="margin:0;">2026-05-10 작성</p>
</article>`,
  },
];
