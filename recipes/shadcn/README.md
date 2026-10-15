# Porest × shadcn

Porest 디자인 시스템 토큰을 shadcn/ui 컴포넌트에 주입한 recipe.
shadcn 코드 구조(cva + Slot + forwardRef)는 그대로, 색상·typography만 Porest 토큰으로 교체.

## 핵심 아이디어

shadcn 컴포넌트는 두 종류의 CSS variable에 의존:
- `--primary` / `--primary-foreground` / `--background` / `--border` / `--ring` ...

이걸 우리 Porest 토큰(`--color-primary`, `--color-text-on-accent` 등)으로 alias하는
**bridge CSS** 한 장으로 해결.
shadcn 컴포넌트 코드는 한 줄도 손대지 않아도 됨.

```
Porest 토큰 (exports/tokens*.css)
        │
        ▼
porest-shadcn-bridge.css   ← 이 recipe가 제공
        │
        ▼
shadcn variables (--primary, --background, ...)
        │
        ▼
shadcn 컴포넌트 (.tsx)      ← cva + Tailwind utility
```

## 다른 React 프로젝트에 적용하는 법

1. **Porest 토큰 export 복사** — `exports/tokens.css`(또는 `.hr.css` / `.desk.css`)를
   프로젝트의 `public/` 또는 `src/styles/`로 복사.
2. **Bridge 복사** — 이 디렉터리의 `styles/porest-shadcn-bridge.css`를 같이 복사.
3. **글로벌 stylesheet에서 import**:
   ```css
   @import "./porest-tokens.css";
   @import "./porest-shadcn-bridge.css";
   @import "tailwindcss";
   ```
4. **컴포넌트 복사** — `components/ui/button.tsx`를 프로젝트로 복사. 같은 디렉터리에
   shadcn 표준대로 `lib/utils.ts` (cn helper)도 함께 복사. **`cn` 은 이 레시피 것을 써야 한다** —
   porest 스케일(`text-t4` · `px-x4` · `rounded-r2`)을 tailwind-merge 에 등록해 둔 것으로, 기본
   tailwind-merge 는 `text-t4` 를 글자색으로 읽어 버튼의 글자색 클래스를 지운다.
5. **의존성 설치**:
   ```bash
   npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot
   ```
6. **Tailwind v4 + Pretendard 적용** — `<html lang="ko">` + Pretendard 폰트 로드.
7. **브랜드 토글** — `<html data-brand="default|hr|desk">`로 색상 분기.
   다크모드는 `<html data-theme="dark">`.

## 디렉터리

```
recipes/shadcn/
├── README.md                        ← 이 파일
├── lib/utils.ts                     ← cn() helper (clsx + tailwind-merge)
├── styles/porest-shadcn-bridge.css  ← Porest 토큰 → shadcn variables alias
├── components/ui/button.tsx         ← shadcn Button + Porest 토큰
└── examples/*-examples.mjs          ← 컴포넌트별 예제(정적 HTML) — 옛 문서 사이트가 그린다
```

## 미리보기

`npm run build:site` 가 옛 문서 사이트(`exports/site/components/<이름>.html`)와 미리보기
(`exports/preview*.html`)를 만든다. 수치 · 규칙은 `site/` 문서 사이트의 컴포넌트 페이지가 원본이다.
(예전의 `preview/button-demo.html` 은 2026-09-30 에 걷었다 — 옛 버튼을 따로 한 벌 들고 있었다.)

## Button — 변형 · 크기 · 배치

구조는 SEED Action Button(2026-09-30). 수치 · 규칙의 원본은 `specs/components/button.md` · `button.yaml`.

| variant | 쓰는 곳 |
|---|---|
| `brandSolid` | 서비스 핵심 액션 하나(Desk 거래 추가 · HR 휴가 신청) |
| `neutralSolid` *(기본)* | 대부분의 CTA — 저장 · 확인 · 다음 |
| `neutralWeak` | CTA 옆 보조(취소) · CTA 를 뺀 대부분의 액션 |
| `criticalSolid` | 되돌릴 수 없는 작업의 확정 |
| `brandOutline` · `neutralOutline` | 낮은 위계의 보조 액션(둘이 짝) |
| `ghost` | 메뉴 · 툴바 · 목록의 가벼운 액션 — `ghostColor` 로 `neutralSubtle` · `brand` · `critical` |

| size | 높이 | 모서리 | 글자 |
|---|---|---|---|
| `xsmall` | 32 | 알약 | t3 13px |
| `small` | 36 | 8 | t4 14px |
| `medium` *(기본)* | 40 | 8 | t4 14px |
| `large` | 48 | 12 | t6 18px |

`layout` 은 `withText`(기본) · `iconOnly`(정사각, `aria-label` 필수). `loading` 은 누름 색 위 로딩 원 +
누르기 막기 + `aria-busy`. `flush="left" | "right"` 는 ghost 텍스트 버튼의 가장자리 맞춤.

## 사용 예

```tsx
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function EditFooter({ saving }: { saving: boolean }) {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" ghostColor="critical" size="small" className="mr-auto">삭제</Button>
      <Button variant="neutralWeak" size="small">취소</Button>
      <Button size="small" loading={saving}>저장</Button>
    </div>
  )
}

export function AddTransaction() {
  return (
    <Button variant="brandSolid" size="large" className="w-full">
      <Plus />
      거래 추가
    </Button>
  )
}
```

## 다음 단계 후보 컴포넌트

button 다음에 만들 컴포넌트 우선순위 (Porest 사용처 기준):
1. **Input / Textarea** — form 영역 핵심
2. **Card** — listing detail / 정보 그룹
3. **Dialog (Modal)** — confirm / form modal
4. **Badge** — 상태 표시 (승인/대기/반려, 카테고리)
5. **Select · Input Button** — form 영역
6. **Toast** — 시스템 알림
7. **Tabs** — 탭 네비
8. **Menu** — 줄 · 화면의 동작(1280 미만은 Menu Sheet — `menu.tsx` 의 ResponsiveMenu)

각 컴포넌트도 동일 패턴: shadcn 표준 코드 + Porest 토큰 + 한국어 라벨 데모.
