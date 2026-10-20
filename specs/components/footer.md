# Footer

> 사이트 맨 아래의 바닥 — 브랜드 · 사이트맵(탐색 영역)과 정책 링크 · 안내 글 · 저작권(안내 영역)을 블록으로 골라 조립한다. 지금은 groo-home(porest.cloud) 맨 아래 하나이고, 나중에 SSO 로그인 · 가입 아래와 설명서 · 문서 사이트의 바닥이 같은 블록을 쓴다. Desk · HR 의 제품 화면에는 두지 않는다 — 정책 링크는 설정 목록의 줄([List](list.md))이다.

구조는 당근 [SEED Footer](https://seed-design.io/components/footer)(디자인 문서 · registry block `footer-01` ~ `footer-04` · qvism-preset `footer` recipe — Apache-2.0)를 따른다 — 정해진 한 덩어리가 아니라 "제품마다 필요한 구성을 골라 조립하는 조합 예시" 이고, 필수 블록 없이 위 → 아래 순서만 있다. SEED 에는 rootage 가 없어 수치는 블록 코드(틀 1040 · 40 / 32 · 영역 사이 40 · 열 최소 100 …)와 `Footer.LinkText` 레시피에서 가져왔다. groo-home 의 짜임(7B — SEED footer-04 를 줄인 것) · 1280 미만 좌우 24 · 위 선 · 저작권 형식(9A)은 groo 가 정했다(2026-10-15 사용자 결정 — 마무리 7B · 8A · 9A). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. groo 에 처음 두는 부품이다.

수치 원본은 [`footer.yaml`](footer.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: groo-home 맨 아래 — 브랜드 · 서비스 · 계정 | 선 | 개인정보 처리방침 ↗ · 안내 글 · © 2026 그루, 1280 · 390, 라이트 · 다크](../../site/components/specs/footer.tsx#hero)

### 직접 골라 보기

블록(브랜드 · 사이트맵 · 선 · 정책 링크 · 안내 글 · 저작권 · 자리만 있는 사업자 정보 · 연락처 · 소셜)과 폭을 고르면 스펙대로 그린 바닥과 그 코드가 바뀐다. 폭을 줄이면 사이트맵 열이 줄을 바꾸고 저작권 · 소셜이 위아래로 놓인다. 링크에 올리고 Tab 으로 옮겨 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/footer.tsx#playground)

## Anatomy

[그림: 탐색 영역(브랜드 · 사이트맵 열) · 선 · 안내 영역(정책 링크 · 안내 글 · 저작권 줄)](../../site/components/specs/footer.tsx#anatomy)

| ⓐ Brand | 브랜드 — 글자 로고 "그루" + 소개 한 줄. |
| ⓑ Country | 국가 선택 — 나라 링크 목록. groo 는 두지 않는다(한국어 사이트 하나). |
| ⓒ Sitemap | 사이트맵 — 열 제목 + 링크 목록의 열들. `<nav aria-label="사이트 지도">`. |
| ⓓ Divider | 선 — 탐색 영역과 안내 영역을 함께 쓸 때만. |
| ⓔ Policy Links | 정책 링크 줄 — 개인정보 처리방침 ↗. |
| ⓕ Business Info · Contact | 사업자 정보 · 연락처 — " \| " 로 이은 글. 값이 생기면. |
| ⓖ Copyright | 저작권 — "© 2026 그루", 안내 영역의 마지막. |
| ⓗ Social Links | 소셜 링크 — 아이콘 버튼, 저작권 줄의 끝. 값이 생기면. |

블록 순서는 SEED 그대로다 — 탐색 영역(ⓐ ⓑ ⓒ) · 선(ⓓ) · 안내 영역(ⓔ ⓕ ⓖ ⓗ). 필수 블록은 없고, 자리에 맞는 블록만 고른다. 블록을 빼도 순서는 바꾸지 않는다.

[표: 부위](footer.yaml#slots)

## Properties

### 틀

`<footer>` 는 최대 1040(`layout-max-content`)의 가운데 틀이다 — 위아래 40, 좌우 32(1280 미만 24 — groo 화면 가장자리), 영역 사이 40. 바닥 위에는 화면 폭 전체로 1px `stroke-neutral-subtle` 선을 그어 본문과 가른다. 바탕은 페이지 바탕 그대로다.

[그림: 틀 — 1040 · 위아래 40 · 좌우 32(1280 미만 24) · 영역 사이 40 · 위 선](../../site/components/specs/footer.tsx#frame)

[표: 틀](footer.yaml#base.enabled@root)

[표: 위 선](footer.yaml#base.enabled@topLine)

[표: 폭](footer.yaml#width)

### 탐색 영역

브랜드와 사이트맵이 한 줄에 놓이고(사이 32) 넘치면 사이트맵이 아래로 내려간다. 브랜드는 글자 로고 "그루"(20 / 27 · 700 `fg-neutral`) 아래 8 에 소개 한 줄(13 / 18 `fg-neutral-subtle` · 최대 340)이다. 사이트맵은 열을 가로로 놓고(사이 32 · 넘치면 줄을 바꾼다) 열마다 제목(13 / 18 · 500 `fg-neutral-muted`) 아래 16 에 링크를 16 사이로 쌓는다(16 / 22 · 500 `fg-neutral` — 링크 `large`). 열은 최소 100 이다. 링크가 없는 글은 열에 넣지 않는다(지금 홈의 "HR 기능" 열 — 7B 에서 걷었다).

[그림: 브랜드 + 서비스 · 계정 두 열 — 1280 한 줄 · 768 · 390 줄바꿈](../../site/components/specs/footer.tsx#navigation)

[표: 탐색 영역](footer.yaml#base.enabled@navigation)

[표: 브랜드](footer.yaml#base.enabled@brand)

[표: 브랜드 이름](footer.yaml#base.enabled@brandName)

[표: 브랜드 소개](footer.yaml#base.enabled@brandIntro)

[표: 사이트맵](footer.yaml#base.enabled@sitemap)

[표: 열](footer.yaml#base.enabled@column)

[표: 열 제목](footer.yaml#base.enabled@columnTitle)

[표: 열의 링크](footer.yaml#base.enabled@columnLinks)

[표: 국가 선택](footer.yaml#base.enabled@country)

### 안내 영역

정책 링크 줄(링크 `medium` 사이 24 · 줄을 바꾸면 8) · 안내 글(13 / 18 `fg-neutral-subtle`) · 저작권 줄을 16 사이로 쌓는다. 저작권(14 / 19 · 500 `fg-neutral-muted`)은 늘 마지막이고, 소셜 링크는 그 줄의 끝(1280 미만은 저작권 아래)이다. 사업자 정보 · 연락처는 안내 글 모양으로 항목을 " | " 로 잇고 묶음이 바뀌면 줄을 바꾼다 — **지금 groo 에는 그 값이 어디에도 없어** 블록만 두고 비워 둔다(아래 Guidelines).

[그림: 정책 링크 ↗ · 안내 글 · 저작권 — 사업자 정보 · 연락처 · 소셜은 자리표시로만](../../site/components/specs/footer.tsx#info)

[표: 안내 영역](footer.yaml#base.enabled@info)

[표: 정책 링크 줄](footer.yaml#base.enabled@policy)

[표: 안내 글 · 사업자 정보 · 연락처](footer.yaml#base.enabled@infoText)

[표: 저작권 줄](footer.yaml#base.enabled@bottom)

[표: 저작권](footer.yaml#base.enabled@copyright)

[표: 소셜 링크](footer.yaml#base.enabled@social)

[표: 선](footer.yaml#base.enabled@divider)

### Link

링크는 SEED `Footer.LinkText` 의 두 크기다 — `large`(사이트맵 — 16 / 22 · 500 `fg-neutral`, 올리면 · 누르면 `fg-neutral-subtle`)와 `medium`(정책 · 국가 — 14 / 19 · 500 `fg-neutral-muted`, 올리면 · 누르면 `fg-neutral`). 밑줄은 없고 색으로만 알린다. 새 탭으로 여는 링크(처리방침처럼 읽고 돌아오는 문서 · 다른 사이트)만 뒤에 ↗(14 · 12)를 둔다 — 같은 탭으로 가는 서비스 링크에는 두지 않는다.

[그림: 링크 large · medium — 기본 · 올림 · 누름 · 포커스, 새 탭 링크의 ↗](../../site/components/specs/footer.tsx#link)

[표: 링크 크기](footer.yaml#linkSize)

[표: 링크 공통](footer.yaml#base.enabled@link)

[표: ↗](footer.yaml#base.enabled@linkIcon)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 사이트맵 링크 `fg-neutral` · 정책 링크 `fg-neutral-muted`, 밑줄 없음 |
| `hovered` | 웹 — 사이트맵 링크는 옅게(`fg-neutral-subtle`), 정책 링크는 짙게(`fg-neutral`) |
| `focused` | 키보드 포커스에만 링크 둘레 링 2px · 띄움 2px · 모서리 4 |
| `pressed` | 올림과 같은 색 |

[표: 상태 — 사이트맵 링크](footer.yaml#matrix.linkSize.large@link+focusRing)

[표: 상태 — 정책 링크](footer.yaml#matrix@link+focusRing)

[표: 모션](footer.yaml#motion)

## Guidelines

### 쓰는 자리

| 자리 | 블록 |
|---|---|
| groo-home 맨 아래(지금) | 브랜드 · 사이트맵(서비스 · 계정) \| 선 \| 개인정보 처리방침 ↗ · 안내 글 · 저작권 — 7B |
| SSO 로그인 · 가입 아래(나중) | 정책 링크 + 저작권 한 줄 — 그 차례에 정한다 |
| Desk 설명서 · HR 문서 사이트의 바닥(나중) | 정책 링크 + 저작권 — 저작권은 지금 바꾼다(아래 "저작권 한 벌") |
| Desk · HR 제품 화면 · 앱 | 두지 않는다 — 처리방침 · 설명서는 설정 목록의 줄 |

[그림: 홈 — 7B 짜임 · SSO 로그인 아래 · 설명서 바닥(나중의 자리)](../../site/components/specs/footer.tsx#places-guide)

### 값이 없는 블록은 비워 둔다

사업자 정보 · 연락처 · 소셜 링크는 블록만 있다 — groo 의 상호 · 사업자 등록번호 · 대표자 · 주소 · 전화 · 문의 메일 · 공개 소셜 채널은 아직 어느 레포에도 없다(개인정보 처리방침의 보호책임자도 "미지정"). 값을 지어내 넣지 않는다 — 그림 · 예시도 "(상호) \| 사업자 등록번호 000-00-00000" 처럼 자리표시임이 드러나게만 쓴다. 값이 생기면 안내 글 아래(사업자 정보 → 연락처), 소셜은 저작권 줄 끝에 넣는다.

[그림: 자리표시로 그린 사업자 정보 · 연락처 · 소셜 · 그럴듯한 가짜 값을 넣은 바닥](../../site/components/specs/footer.tsx#placeholder-guide)

### 저작권 한 벌

저작권은 "© {해} 그루" 하나다(SEED 형식, 사용자 결정 9A) — 해는 그리는 때(빌드 · 화면)의 해라 낡지 않는다. 홈 · SSO 로그인 · HR 문서 · Desk 설명서 네 곳이 같은 줄을 쓴다. "All rights reserved." · "Copyright" 를 덧붙이지 않고, 사이트 이름("그루 담다 사용자 설명서")을 저작권 자리에 쓰지 않는다.

[그림: 네 곳 — 지금 네 벌 · 바꾼 뒤 "© 2026 그루" 한 벌](../../site/components/specs/footer.tsx#copyright-guide)

### 새 탭 링크만 ↗ · 밑줄 없이

↗ 는 새 탭으로 여는 링크에만 둔다 — 처리방침 같은 문서 · 다른 사이트 · 소셜. 같은 탭으로 가는 서비스 링크(HR · Desk · 로그인)에는 두지 않는다. 새 탭 링크는 보이지 않는 "(새 탭)" 을 붙여 읽는다. 링크에 밑줄을 긋지 않는다 — 올림 · 누름은 색으로 알린다(SEED).

[그림: 처리방침 ↗(새 탭) · 서비스 링크(같은 탭) · 모든 링크에 ↗ · 밑줄](../../site/components/specs/footer.tsx#external-guide)

### groo-home 은 짜임만 따른다

groo-home 은 "groo-design 을 따르지 않는다 — 그룹 소개 페이지라 일부러 다른 인상을 낸다"(홈 `CLAUDE.md:9-10`). 그래서 홈은 이 스펙의 **짜임 · 간격 · 글 크기**만 쓰고 **색 · 글꼴은 홈 것**(Noto Sans KR · `--ink` · `--ink2` · `--ink3` · `--line` · 브랜드 글자는 `--blue`)을 쓴다(사용자 결정 8A). 짝은 `fg-neutral` → `--ink` · `fg-neutral-muted` → `--ink2` · `fg-neutral-subtle` → `--ink3` · `stroke-neutral-subtle` → `--line` 이다. 다만 안내 글 색 `--ink3`(#8B95A1 — 흰 바탕 3.04)은 13px 글에 4.5 가 모자라 4.5 이상으로 짙게 한다(질문에서 약속). groo 토큰 · Pretendard 를 홈에 그대로 들이는 안(8B)과 스펙만 두고 홈을 그대로 두는 안(8C)은 고르지 않았다.

[그림: 홈에 넣은 모습 — 짜임은 스펙, 색 · 글꼴은 홈(Noto Sans KR), 안내 글은 짙게](../../site/components/specs/footer.tsx#home-guide)

### 글

열 제목은 묶음 이름 명사로("서비스" · "계정"), 링크는 가는 곳의 이름으로("HR" · "Desk 설명서" · "로그인"). 정책 링크는 문서 제목 그대로("개인정보 처리방침"). 저작권은 "© {해} 그루". 안내 글은 그 페이지가 알려야 할 사실만 한 문장씩(홈 — "화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.").

## 코드

레시피 `recipes/shadcn/components/ui/footer.tsx` 를 쓴다(웹 — 설명서 · 문서 사이트 · SSO 가 쓴다. groo-home 은 빌드 없는 정적 페이지라 같은 짜임을 HTML 로 옮긴다). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Footer` — `<footer>` 틀(최대 1040 · 위아래 40 · 좌우 32 · 1280 미만 24 · 영역 사이 40). `topLine`(기본 `true` — 위 선).
- `FooterNav` — 탐색 영역 줄(사이 32 · 줄바꿈). `FooterBrand` — `name`(필수) · `description`. `FooterSitemap` — `<nav>`, `aria-label` 기본 `"사이트 지도"`. `FooterColumn` — `title`(필수 — 링크 목록의 이름으로 잇는다), 안의 `FooterLink` 는 `large`.
- `FooterDivider` — 선. `FooterInfo` — 안내 영역(사이 16). `FooterLinks` — 정책 링크 줄(사이 24 · 줄을 바꾸면 8). `FooterText` — 안내 글 · 사업자 정보 · 연락처(13 / 18 `fg-neutral-subtle`).
- `FooterBottom` — 저작권 줄(저작권 앞 · 소셜 끝 · 1280 미만 위아래). `FooterCopyright` — `owner`(필수) · `year`(기본 그리는 때의 해) → "© 2026 그루". `FooterSocial` — 소셜 버튼 묶음(사이 24 — 안에는 [Button](button.md) `ghost` · `large` · `iconOnly` + 이름).
- `FooterLink` — `href`(필수) · `size`(`"large"` · `"medium"` — 기본은 놓인 자리: 열 안 `large`, 그 밖 `medium`) · `external`(새 탭 · `rel="noopener"` · ↗ · 보이지 않는 "(새 탭)").

### groo-home — 7B 짜임

[그림: groo-home 바닥 — 1280 · 390](../../site/components/specs/footer.tsx#ex-home)

```tsx
import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterColumn,
  FooterCopyright,
  FooterDivider,
  FooterInfo,
  FooterLink,
  FooterLinks,
  FooterNav,
  FooterSitemap,
  FooterText,
} from "@/components/ui/footer"

<Footer>
  <FooterNav>
    <FooterBrand
      name="그루"
      description="People + Forest. 사람(People)이 모여 숲(Forest)처럼 자라나는 조직 생태계를 설계합니다."
    />
    <FooterSitemap>
      <FooterColumn title="서비스">
        <FooterLink href="https://hr.porest.cloud">HR</FooterLink>
        <FooterLink href="https://desk.porest.cloud">Desk</FooterLink>
        <FooterLink href="https://desk.porest.cloud/guide/">Desk 설명서</FooterLink>
      </FooterColumn>
      <FooterColumn title="계정">
        <FooterLink href="https://sso.porest.cloud">로그인</FooterLink>
        <FooterLink href="https://sso.porest.cloud">회원가입</FooterLink>
      </FooterColumn>
    </FooterSitemap>
  </FooterNav>
  <FooterDivider />
  <FooterInfo>
    <FooterLinks>
      {/* 읽고 돌아오는 문서 — 새 탭 + ↗ */}
      <FooterLink href="https://sso.porest.cloud/privacy" external>
        개인정보 처리방침
      </FooterLink>
    </FooterLinks>
    <FooterText>화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.</FooterText>
    {/* 사업자 정보 · 연락처 · 소셜은 값이 생기면 이 자리에 — 지어내지 않는다 */}
    <FooterBottom>
      <FooterCopyright owner="그루" />
    </FooterBottom>
  </FooterInfo>
</Footer>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 링크 누르기 · `Enter` | 같은 탭으로 간다. `external` 이면 새 탭(`rel="noopener"`) |
| 링크에 마우스 올리기 | 글자색만 바뀐다(밑줄 없음) |
| `Tab` | 위 → 아래, 줄 안에서는 앞 → 끝 — 브랜드(링크가 아니면 건너뜀) · 사이트맵 열 차례 · 정책 링크 · 소셜 |
| 폭이 줄면 | 사이트맵이 브랜드 아래로, 열이 줄을 바꾼다(열 최소 100). 1280 미만은 좌우 24 · 소셜이 저작권 아래 |
| 저작권의 해 | 그리는 때(정적 페이지는 빌드 · 스크립트, 앱 · 사이트는 화면)의 해 |
| 모션 줄이기 | 바뀌는 것 없음 — 색 전환만 있다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 사이트맵 링크 · 브랜드 이름 `fg-neutral` 흰 면 16.41 · 다크 13.42, 열 제목 · 정책 링크 · 저작권 `fg-neutral-muted` 7.11 · 7.70, 소개 · 안내 글 · 사이트맵 링크 올림 `fg-neutral-subtle` 5.50 · 6.09 ✓. groo-home 의 `--ink3`(3.04)은 4.5 이상으로 짙게 한다(Migration notes) |
| **WCAG 1.4.1** Use of color | 링크는 밑줄 없이 색으로 — 바닥의 링크는 문장 속이 아니라 따로 놓인 목록 · 줄이라 위치로 링크임을 안다(SEED). 키보드 포커스는 링으로 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 선 · 위 선(1.15 · 1.30)은 장식 — 영역은 간격 · 글이 가른다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.3.1** Info and Relationships | `<footer>`(contentinfo — 한 페이지에 하나, article · section 안에 두지 않는다) · 사이트맵 `<nav aria-label="사이트 지도">` · 열의 링크 목록은 열 제목을 이름으로(`aria-labelledby`) ✓ |
| **WCAG 2.4.4** Link purpose | 링크 글이 가는 곳 그대로 — 새 탭 링크는 "(새 탭)" 을 함께 읽는다(↗ 는 `aria-hidden`) ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링크 둘레 링 2px · 띄움 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 사이트맵 링크 22 · 정책 링크 19 — 이웃 링크와 16 · 24 떨어져 24 원이 겹치지 않는다(간격 예외) ✓. 소셜 버튼 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 글 링크 22 · 19 ⚠ — SEED 와 같다(바닥의 글 링크는 글 높이 그대로). 소셜 버튼 48 ✓ |
| **WCAG 3.2.3** Consistent navigation | 같은 사이트의 모든 페이지에 같은 바닥 · 같은 순서 ✓ |
| **Reduced motion** | 색 전환만 — 바뀌는 것 없음 |

## Do / Don't

### ✅ Do

- 블록을 SEED 순서대로 — 탐색 영역 · 선 · 안내 영역, 저작권은 마지막.
- 정책 링크(처리방침)는 로그인 전에도 닿는 바닥에 둔다.
- 새 탭으로 여는 링크에만 ↗ + "(새 탭)".
- 저작권은 "© {해} 그루" 한 벌 — 해는 그리는 때의 해.
- 값이 없는 블록은 비워 두고, 그림은 자리표시임이 드러나게.

### ❌ Don't

- 링크가 아닌 글 목록을 사이트맵 열로 두기(눌리는 것처럼 보인다).
- 사업자 정보 · 연락처 · 소셜 값을 지어내 넣기.
- 모든 링크에 ↗ · 링크에 밑줄.
- 해를 박아 두기("© 2025") · "All rights reserved." · 사이트 이름을 저작권 자리에.
- 제품 화면(Desk · HR · 앱)에 바닥을 두기.

## Specification

`footer.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹이 Footer 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — footer.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#footer)

## SEED 와 다른 점

- **1280 미만 좌우 24**(`spacing-global-gutter` — groo 화면 가장자리 규칙). SEED 블록은 늘 32 다.
- **위 선** — 바닥 위에 화면 폭 1px `stroke-neutral-subtle` 로 본문과 가른다. SEED 블록에는 없다(비교 페이지가 그린 모양).
- **선은 `stroke-neutral-subtle` 하나**(Divider 2026-10-03) — SEED 블록은 stroke.neutral(muted 쪽).
- **브랜드는 글자 로고**("그루" 20 / 27 · 700) + 소개 한 줄 — SEED 는 로고 그림(57 × 32) + 국가 링크. 국가 선택은 두지 않는다.
- **정책 링크 줄의 위아래 사이 8** — SEED 는 가로 · 세로 모두 24(비교 페이지 그림을 따랐다).
- **저작권 "© {해} 그루"** — SEED 블록은 ⓒ(동그라미 c)를 쓴다. groo 는 SEED 문서의 © 다.
- **새 탭 링크만 ↗ + "(새 탭)"** · **링크의 키보드 포커스 링**(v106)을 적는다 — SEED 는 "외부 이동 링크에 ↗" 만 적었다.
- 국가 선택 · 사업자 정보 · 연락처 · 소셜의 수치는 SEED 그대로 두되 값은 비워 둔다.

## Migration notes

### 2026-10-15 — SEED Footer 로 새로 둔다

사용자가 [마무리 비교 페이지](https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z)에서 정했다 — SEED 짜임(7B — footer-04 를 줄여 브랜드 + 사이트맵 서비스 · 계정 | 선 | 개인정보 처리방침 ↗ · 안내 글 · © 2026 그루, "HR 기능" 열 · 도메인 줄을 걷고, 사업자 · 연락처 · 소셜은 값이 생기면), 홈에 이번에 넣는다(8A — 짜임 · 간격 · 글 크기는 스펙, 색 · 글꼴은 홈 그대로 Noto Sans KR, 안내 글 `--ink3` 은 4.5 이상으로 짙게), "© 2026 그루"(9A — SEED 형식, 해는 그 해, 네 곳 모두). 그리고 "따라오는 것" — 블록 순서는 SEED 그대로 · `<footer>`(contentinfo) · 사이트맵은 `<nav aria-label="사이트 지도">` · 링크 밑줄 없음(올림 · 누름은 색) · 새 탭으로 나가는 링크만 ↗ · 사업자 정보 · 연락처 · 소셜은 지어내지 않는다. 지금 그대로(7A) · 최소(7C) · groo 토큰 그대로(8B) · 스펙만(8C) · 해 없이(9B) · 제각각(9C)은 고르지 않았다.

제품은 각 레포에서 옮긴다(2026-10-15 조사 — 각 레포 origin/main 을 코드로 읽었다). 홈은 코디네이터가 이번에 고친다.

- **groo-home 바닥** — `index.html:327-333`(CSS `:110-116` · 반응형 `:127` · `:129`). 지금은 4열 격자(`1.4fr 1fr 1fr 1fr` → 960 이하 2열 → 560 이하 1열) — 브랜드(`<b>` "그루" 17 · `--blue` + "People + Forest." 소개) · "서비스"(HR · Desk · Desk 가이드) · "계정"(로그인 · 회원가입 — 둘 다 `https://sso.porest.cloud`) · **"HR 기능" — 링크 없는 글 넷**(일정관리 · 휴가관리 · 전자결재 · 권한 관리) · `.fine`(도메인 넷 · "화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash." · "© 그루" — 위 `border-top`). 글 13 · 제목 14, 작은 글은 모두 `--ink3`(#8B95A1 — 흰 바탕 3.04). 7B 짜임으로 — "HR 기능" 열과 도메인 줄을 걷고, "Desk 가이드" 는 "Desk 설명서" 로, 처리방침 링크를 더하고, 저작권은 "© {해} 그루"(정적 페이지라 스크립트 한 줄 또는 빌드 때). 색 · 글꼴은 홈 것 — `--ink3` 은 4.5 이상으로 짙게.
- **개인정보 처리방침 — 공개 진입점이 없다** — 문서는 SSO 의 공개 라우트 하나뿐이다(`https://sso.porest.cloud/privacy` — sso-front `src/pages/privacy/ui/PrivacyPolicyPage.tsx`, `src/app/router/routes.tsx:44-46`). 링크는 Desk 웹 · 앱 설정 안쪽(로그인 뒤)에만 있다(desk-front `src/pages/settings/ui/SettingsPage.tsx:233-239` · desk-app `lib/features/settings/presentation/settings_screen.dart:134-137`) — SSO 로그인 · 가입 · 홈 · HR 웹 어디에도 없다. 홈 바닥이 첫 공개 진입점이 된다(새 탭 ↗). 처리방침의 보호책임자는 "미지정"(`PrivacyPolicyPage.tsx:17-21`)이다. 이용약관 · 운영정책 문서는 어느 레포에도 없다 — 생기면 정책 링크 줄에 더한다.
- **저작권 네 벌 → 한 벌(9A)** — 홈 "© 그루"(`index.html:332`) · SSO 로그인 "Copyright © 그루. All Rights Reserved."(sso-front `src/pages/login/ui/LoginPage.tsx:125-128`) · HR 문서 VitePress "© 2025 그루. All rights reserved."(groo-ieum-docs `.vitepress/config.ts:241-244` — 해가 2025 에 멈춰 있다) · Desk 설명서 Docusaurus "그루 담다 사용자 설명서"(porest-desk-guide `docusaurus.config.ts:87-91` — 저작권이 아니다. 이름은 위 막대 "그루 담다 가이드" 에 있다). 네 곳 모두 "© {해} 그루" — VitePress · Docusaurus 는 설정 파일에서 빌드 때의 해를 넣는다. Desk · HR 제품 화면에는 저작권 줄이 없다(그대로 둔다).
- **나중 — SSO 로그인 · 가입 아래와 문서 사이트 바닥** — 로그인 아래는 "비밀번호 찾기 | 회원가입" + 저작권이고(`LoginPage.tsx:114-128`), 가입 화면(`RegisterPage.tsx`)에는 저작권 · 정책 링크가 없다. 설명서 바닥은 링크 0(`links: []`), HR 문서 바닥은 "Where People Grow into a Forest" + GitHub 링크 하나(`config.ts:237-239` — 공개 소셜 채널이 아니라 개발 레포)다. 정책 링크 + 저작권 줄로 맞추는 것은 그 차례에 정한다.
- **사업자 · 운영자 정보 — 값이 없다** — groo-home · desk · hr · sso · 설명서 · 문서 · 앱 · 백엔드 어디에도 상호 · 사업자 등록번호 · 대표자 · 주소 · 통신판매업 신고번호 · 전화 · 문의 메일이 없다(처리방침도 "운영 주체 확정 후 채운다"). 처리방침이 Desk 의 유료 구독을 말하므로(`PrivacyPolicyPage.tsx:149`) 표시가 필요해질 수 있다 — 값은 사용자만 정한다.
