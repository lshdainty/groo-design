# Footer

> 사이트 맨 아래의 바닥입니다. 브랜드 · 사이트맵(탐색 영역)과 정책 링크 · 안내 글 · 저작권(안내 영역)을 블록으로 골라 조립하며, groo-home · SSO 로그인 · 가입 · 설명서 · 문서 사이트의 맨 아래에 둡니다. Desk · HR 의 제품 화면에는 두지 않습니다 — 정책 링크는 설정 목록의 줄([List](list.md))입니다.

Footer 는 정해진 한 덩어리가 아니라 자리마다 필요한 블록을 골라 조립합니다. 필수 블록은 없고 위 → 아래 순서만 있습니다.

수치 원본은 [`footer.yaml`](footer.yaml)입니다.

[그림: groo-home 맨 아래 — 브랜드 · 서비스 · 계정 | 선 | 개인정보 처리방침 ↗ · 안내 글 · © 2026 그루, 1280 · 390, 라이트 · 다크](../../site/components/specs/footer.tsx#hero)

### 직접 골라 보기

블록(브랜드 · 사이트맵 · 선 · 정책 링크 · 안내 글 · 저작권 · 자리만 있는 사업자 정보 · 연락처 · 소셜)과 폭을 고르면 스펙대로 그린 바닥과 그 코드가 바뀝니다. 폭을 줄이면 사이트맵 열이 줄을 바꾸고 저작권 · 소셜이 위아래로 놓입니다. 링크에 마우스를 올리거나 Tab 으로 옮겨 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/footer.tsx#playground)

## Anatomy

[그림: 탐색 영역(브랜드 · 사이트맵 열) · 선 · 안내 영역(정책 링크 · 안내 글 · 저작권 줄)](../../site/components/specs/footer.tsx#anatomy)

| ⓐ Brand | 브랜드 — 글자 로고 "그루" + 소개 한 줄입니다. |
| ⓑ Country | 국가 선택 — 나라 링크 목록입니다. groo 는 한국어 사이트 하나라 두지 않습니다. |
| ⓒ Sitemap | 사이트맵 — 열 제목 + 링크 목록의 열들입니다. `<nav aria-label="사이트 지도">`. |
| ⓓ Divider | 선 — 탐색 영역과 안내 영역을 함께 쓸 때만 둡니다. |
| ⓔ Policy Links | 정책 링크 줄 — 개인정보 처리방침 ↗. |
| ⓕ Business Info · Contact | 사업자 정보 · 연락처 — " \| " 로 이은 글입니다. 값이 생기면 둡니다. |
| ⓖ Copyright | 저작권 — "© 2026 그루", 안내 영역의 마지막입니다. |
| ⓗ Social Links | 소셜 링크 — 아이콘 버튼, 저작권 줄의 끝입니다. 값이 생기면 둡니다. |

블록 순서는 탐색 영역(ⓐ ⓑ ⓒ) · 선(ⓓ) · 안내 영역(ⓔ ⓕ ⓖ ⓗ)입니다. 필수 블록은 없고, 자리에 맞는 블록만 고릅니다. 블록을 빼도 순서는 바꾸지 않습니다.

[표: 부위](footer.yaml#slots)

## Properties

### 틀

`<footer>` 는 최대 1040(`layout-max-content`)의 가운데 틀입니다 — 위아래 40, 좌우 32(1280 미만 24 — groo 화면 가장자리), 영역 사이 40. 바닥 위에는 화면 폭 전체로 1px `stroke-neutral-subtle` 선을 그어 본문과 가릅니다. 바탕은 페이지 바탕 그대로입니다.

[그림: 틀 — 1040 · 위아래 40 · 좌우 32(1280 미만 24) · 영역 사이 40 · 위 선](../../site/components/specs/footer.tsx#frame)

[표: 틀](footer.yaml#base.enabled@root)

[표: 위 선](footer.yaml#base.enabled@topLine)

[표: 폭](footer.yaml#width)

### 탐색 영역

브랜드와 사이트맵이 한 줄에 놓이고(사이 32) 넘치면 사이트맵이 아래로 내려갑니다. 브랜드는 글자 로고 "그루"(20 / 27 · 700 `fg-neutral`) 아래 8 에 소개 한 줄(13 / 18 `fg-neutral-subtle` · 최대 340)을 둡니다. 사이트맵은 열을 가로로 놓고(사이 32 · 넘치면 줄을 바꿉니다) 열마다 제목(13 / 18 · 500 `fg-neutral-muted`) 아래 16 에 링크를 16 사이로 쌓습니다(16 / 22 · 500 `fg-neutral` — 링크 `large`). 열은 최소 100 입니다. 링크가 없는 글은 열에 넣지 않습니다 — 눌리는 것처럼 보이기 때문입니다.

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

정책 링크 줄(링크 `medium` 사이 24 · 줄을 바꾸면 8) · 안내 글(13 / 18 `fg-neutral-subtle`) · 저작권 줄을 16 사이로 쌓습니다. 저작권(14 / 19 · 500 `fg-neutral-muted`)은 늘 마지막이고, 소셜 링크는 그 줄의 끝(1280 미만은 저작권 아래)입니다. 정책 문서(개인정보 처리방침 · 이용약관 · 운영정책)는 정책 링크 줄에 둡니다. 사업자 정보 · 연락처는 안내 글 모양으로 항목을 " | " 로 잇고 묶음이 바뀌면 줄을 바꿉니다 — 값이 정해질 때까지 블록만 두고 비워 둡니다(아래 Guidelines).

[그림: 정책 링크 ↗ · 안내 글 · 저작권 — 사업자 정보 · 연락처 · 소셜은 자리표시로만](../../site/components/specs/footer.tsx#info)

[표: 안내 영역](footer.yaml#base.enabled@info)

[표: 정책 링크 줄](footer.yaml#base.enabled@policy)

[표: 안내 글 · 사업자 정보 · 연락처](footer.yaml#base.enabled@infoText)

[표: 저작권 줄](footer.yaml#base.enabled@bottom)

[표: 저작권](footer.yaml#base.enabled@copyright)

[표: 소셜 링크](footer.yaml#base.enabled@social)

[표: 선](footer.yaml#base.enabled@divider)

### Link

링크는 두 크기입니다 — `large`(사이트맵 — 16 / 22 · 500 `fg-neutral`, 올리면 · 누르면 `fg-neutral-subtle`)와 `medium`(정책 · 국가 — 14 / 19 · 500 `fg-neutral-muted`, 올리면 · 누르면 `fg-neutral`). 밑줄은 없고 색으로만 알립니다. 새 탭으로 여는 링크(처리방침처럼 읽고 돌아오는 문서 · 다른 사이트)만 뒤에 ↗(14 · 12)를 둡니다 — 같은 탭으로 가는 서비스 링크에는 두지 않습니다.

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
| groo-home 맨 아래 | 브랜드 · 사이트맵(서비스 · 계정) \| 선 \| 개인정보 처리방침 ↗ · 안내 글 · 저작권 |
| SSO 로그인 · 가입 아래 | 정책 링크 + 저작권 한 줄 |
| Desk 설명서 · HR 문서 사이트의 바닥 | 정책 링크 + 저작권 |
| Desk · HR 제품 화면 · 앱 | 두지 않습니다 — 처리방침 · 설명서는 설정 목록의 줄 |

[그림: 홈 · SSO 로그인 아래 · 설명서 바닥](../../site/components/specs/footer.tsx#places-guide)

### 값이 없는 블록은 비워 둡니다

사업자 정보 · 연락처 · 소셜 링크는 값(상호 · 사업자 등록번호 · 대표자 · 주소 · 전화 · 문의 메일 · 공개 소셜 채널)이 정해질 때까지 블록만 둡니다. 값을 지어내 넣지 않습니다 — 그림 · 예시도 "(상호) \| 사업자 등록번호 000-00-00000" 처럼 자리표시임이 드러나게만 씁니다. 값이 생기면 안내 글 아래(사업자 정보 → 연락처), 소셜은 저작권 줄 끝에 넣습니다.

[그림: 자리표시로 그린 사업자 정보 · 연락처 · 소셜 · 그럴듯한 가짜 값을 넣은 바닥](../../site/components/specs/footer.tsx#placeholder-guide)

### 저작권 한 벌

저작권은 "© {해} 그루" 하나입니다 — 해는 그리는 때(빌드 · 화면)의 해라 낡지 않습니다. 홈 · SSO 로그인 · HR 문서 · Desk 설명서 네 곳이 같은 줄을 씁니다. 정적 문서 사이트(VitePress · Docusaurus)는 설정 파일에서 빌드 때의 해를 넣습니다. "All rights reserved." · "Copyright" 를 덧붙이지 않고, 사이트 이름("그루 담다 사용자 설명서")을 저작권 자리에 쓰지 않습니다.

[그림: 네 곳 — 제각각인 줄 · "© 2026 그루" 한 벌](../../site/components/specs/footer.tsx#copyright-guide)

### 새 탭 링크만 ↗ · 밑줄 없이

↗ 는 새 탭으로 여는 링크에만 둡니다 — 처리방침 같은 문서 · 다른 사이트 · 소셜. 같은 탭으로 가는 서비스 링크(HR · Desk · 로그인)에는 두지 않습니다. 새 탭 링크는 보이지 않는 "(새 탭)" 을 붙여 읽습니다. 링크에 밑줄을 긋지 않습니다 — 올림 · 누름은 색으로 알립니다.

[그림: 처리방침 ↗(새 탭) · 서비스 링크(같은 탭) · 모든 링크에 ↗ · 밑줄](../../site/components/specs/footer.tsx#external-guide)

### groo-home 은 짜임만 따릅니다

groo-home 은 그룹 소개 페이지라 일부러 다른 인상을 내므로 groo-design 을 따르지 않습니다. 그래서 홈은 이 스펙의 **짜임 · 간격 · 글 크기**만 쓰고 **색 · 글꼴은 홈 것**(Noto Sans KR · `--ink` · `--ink2` · `--ink3` · `--line` · 브랜드 글자는 `--blue`)을 씁니다. 짝은 `fg-neutral` → `--ink` · `fg-neutral-muted` → `--ink2` · `fg-neutral-subtle` → `--ink3` · `stroke-neutral-subtle` → `--line` 입니다. 다만 안내 글 색 `--ink3`(#8B95A1 — 흰 바탕 3.04)은 13px 글에 4.5 가 모자라므로 4.5 이상으로 짙게 합니다.

[그림: 홈에 넣은 모습 — 짜임은 스펙, 색 · 글꼴은 홈(Noto Sans KR), 안내 글은 짙게](../../site/components/specs/footer.tsx#home-guide)

### 글

열 제목은 묶음 이름 명사로("서비스" · "계정"), 링크는 가는 곳의 이름으로("HR" · "그루 담다 설명서" · "로그인") 씁니다. 정책 링크는 문서 제목 그대로("개인정보 처리방침") 씁니다. 저작권은 "© {해} 그루" 입니다. 안내 글은 그 페이지가 알려야 할 사실만 한 문장씩 씁니다(홈 — "화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.").

## 코드

레시피 `recipes/shadcn/components/ui/footer.tsx` 를 씁니다(웹 — 설명서 · 문서 사이트 · SSO 가 씁니다. groo-home 은 빌드 없는 정적 페이지라 같은 짜임을 HTML 로 옮깁니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Footer` — `<footer>` 틀(최대 1040 · 위아래 40 · 좌우 32 · 1280 미만 24 · 영역 사이 40). `topLine`(기본 `true` — 위 선).
- `FooterNav` — 탐색 영역 줄(사이 32 · 줄바꿈). `FooterBrand` — `name`(필수) · `description`. `FooterSitemap` — `<nav>`, `aria-label` 기본 `"사이트 지도"`. `FooterColumn` — `title`(필수 — 링크 목록의 이름으로 잇습니다), 안의 `FooterLink` 는 `large`.
- `FooterDivider` — 선. `FooterInfo` — 안내 영역(사이 16). `FooterLinks` — 정책 링크 줄(사이 24 · 줄을 바꾸면 8). `FooterText` — 안내 글 · 사업자 정보 · 연락처(13 / 18 `fg-neutral-subtle`).
- `FooterBottom` — 저작권 줄(저작권 앞 · 소셜 끝 · 1280 미만 위아래). `FooterCopyright` — `owner`(필수) · `year`(기본 그리는 때의 해) → "© 2026 그루". `FooterSocial` — 소셜 버튼 묶음(사이 24 — 안에는 [Button](button.md) `ghost` · `large` · `iconOnly` + 이름).
- `FooterLink` — `href`(필수) · `size`(`"large"` · `"medium"` — 기본은 놓인 자리: 열 안 `large`, 그 밖 `medium`) · `external`(새 탭 · `rel="noopener"` · ↗ · 보이지 않는 "(새 탭)").

### groo-home

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
        <FooterLink href="#">그루 이음</FooterLink>
        <FooterLink href="#">그루 담다</FooterLink>
        <FooterLink href="#">그루 담다 설명서</FooterLink>
      </FooterColumn>
      <FooterColumn title="계정">
        <FooterLink href="#">로그인</FooterLink>
        <FooterLink href="#">회원가입</FooterLink>
      </FooterColumn>
    </FooterSitemap>
  </FooterNav>
  <FooterDivider />
  <FooterInfo>
    <FooterLinks>
      {/* 읽고 돌아오는 문서 — 새 탭 + ↗ */}
      <FooterLink href="#" external>
        개인정보 처리방침
      </FooterLink>
    </FooterLinks>
    <FooterText>화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.</FooterText>
    {/* 사업자 정보 · 연락처 · 소셜은 값이 생기면 이 자리에 — 지어내지 않습니다 */}
    <FooterBottom>
      <FooterCopyright owner="그루" />
    </FooterBottom>
  </FooterInfo>
</Footer>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 링크 누르기 · `Enter` | 같은 탭으로 갑니다. `external` 이면 새 탭(`rel="noopener"`) |
| 링크에 마우스 올리기 | 글자색만 바뀝니다(밑줄 없음) |
| `Tab` | 위 → 아래, 줄 안에서는 앞 → 끝 — 브랜드(링크가 아니면 건너뜀) · 사이트맵 열 차례 · 정책 링크 · 소셜 |
| 폭이 줄면 | 사이트맵이 브랜드 아래로, 열이 줄을 바꿉니다(열 최소 100). 1280 미만은 좌우 24 · 소셜이 저작권 아래 |
| 글자 크기 설정 | 브랜드 · 소개 · 열 제목 · 링크 · 안내 · 저작권 글은 글자 크기 설정을 따라 커지고 줄을 바꿉니다. 링크 뒤 ↗ 와 소셜 버튼 · 아이콘은 px 로 그대로입니다. |
| 저작권의 해 | 그리는 때(정적 페이지는 빌드 · 스크립트, 앱 · 사이트는 화면)의 해 |
| 모션 줄이기 | 바뀌는 것 없음 — 색 전환만 있습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 사이트맵 링크 · 브랜드 이름 `fg-neutral` 흰 면 16.41 · 다크 13.42, 열 제목 · 정책 링크 · 저작권 `fg-neutral-muted` 7.11 · 7.70, 소개 · 안내 글 · 사이트맵 링크 올림 `fg-neutral-subtle` 5.50 · 6.09 ✓. groo-home 의 `--ink3`(3.04)은 4.5 이상으로 짙게 합니다(Guidelines) |
| **WCAG 1.4.4** Resize text | 모든 글이 글자 크기 설정을 따라 커지고 줄을 바꿉니다 — 열은 폭이 모자라면 줄을 바꿔 아래로 내려갑니다 ✓. ↗ · 소셜 아이콘은 글이 아니라 크기를 그대로 둡니다 |
| **WCAG 1.4.1** Use of color | 링크는 밑줄 없이 색으로 — 바닥의 링크는 문장 속이 아니라 따로 놓인 목록 · 줄이라 위치로 링크임을 압니다. 키보드 포커스는 링으로 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 선 · 위 선(1.15 · 1.30)은 장식 — 영역은 간격 · 글이 가릅니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.3.1** Info and Relationships | `<footer>`(contentinfo — 한 페이지에 하나, article · section 안에 두지 않습니다) · 사이트맵 `<nav aria-label="사이트 지도">` · 열의 링크 목록은 열 제목을 이름으로(`aria-labelledby`) ✓ |
| **WCAG 2.4.4** Link purpose | 링크 글이 가는 곳 그대로 — 새 탭 링크는 "(새 탭)" 을 함께 읽습니다(↗ 는 `aria-hidden`) ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링크 둘레 링 2px · 띄움 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 사이트맵 링크 22 · 정책 링크 19 — 이웃 링크와 16 · 24 떨어져 24 원이 겹치지 않습니다(간격 예외) ✓. 소셜 버튼 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 글 링크 22 · 19 ⚠ — 바닥의 글 링크는 글 높이 그대로입니다. 소셜 버튼 48 ✓ |
| **WCAG 3.2.3** Consistent navigation | 같은 사이트의 모든 페이지에 같은 바닥 · 같은 순서 ✓ |
| **Reduced motion** | 색 전환만 — 바뀌는 것 없음 |

## Do / Don't

### ✅ Do

- 블록을 정해진 순서대로 — 탐색 영역 · 선 · 안내 영역, 저작권은 마지막.
- 정책 링크(처리방침)는 로그인 전에도 닿는 바닥에 둡니다.
- 새 탭으로 여는 링크에만 ↗ + "(새 탭)".
- 저작권은 "© {해} 그루" 한 벌 — 해는 그리는 때의 해.
- 값이 없는 블록은 비워 두고, 그림은 자리표시임이 드러나게.

### ❌ Don't

- 링크가 아닌 글 목록을 사이트맵 열로 두기(눌리는 것처럼 보입니다).
- 사업자 정보 · 연락처 · 소셜 값을 지어내 넣기.
- 모든 링크에 ↗ · 링크에 밑줄.
- 해를 박아 두기("© 2025") · "All rights reserved." · 사이트 이름을 저작권 자리에.
- 제품 화면(Desk · HR · 앱)에 바닥을 두기.

## Specification

`footer.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹이 Footer 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — footer.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#footer)
