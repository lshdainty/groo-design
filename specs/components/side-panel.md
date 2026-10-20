# Side Panel

> 화면 옆(왼쪽 · 오른쪽)에서 미끄러져 나오는 모달 패널. 지금 쓰는 곳은 HR 폰(768 미만)의 주 메뉴 서랍 하나다 — ☰ 를 누르면 왼쪽에서 나와 [Side Navigation](side-navigation.md) 의 항목을 보인다. 오른쪽 패널(1280 이상의 보조 작업)은 쓰는 곳이 아직 없다. 아래에서 올라오는 모달은 [Bottom Sheet](bottom-sheet.md), 가운데 대화상자는 [Dialog](dialog.md) 다.

구조는 당근 [SEED Side Panel](https://seed-design.io/components/side-panel)(Apache-2.0)을 따른다 — "화면의 측면에서 슬라이드되어 나타나며, 현재 맥락을 유지한 채 상세 정보를 확인하거나 부수적인 작업을 수행하는 레이아웃 컴포넌트" 로, 딤 · 패널 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥, 크기 480 · 720 · 960 · 768 미만 80%, 높이 전체, 모서리 · 그림자 · 선 없음. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). 옛 Sheet 스펙(shadcn — 네 방향 · 75% · 384 · 그림자 · 선)을 대신한다 — 아래는 Bottom Sheet 가 맡고, 위에서 내려오는 패널은 걷었다.

수치 원본은 [`side-panel.yaml`](side-panel.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: HR 폰 주 메뉴 서랍 · 1280 오른쪽 패널 — 라이트 · 다크](../../site/components/specs/side-panel.tsx#hero)

### 직접 골라 보기

방향(왼쪽 주 메뉴 · 오른쪽 패널) · 크기 · 설명 · 본문 길이 · 바닥 버튼을 고르면 스펙대로 그린 패널과 그 코드가 바뀐다. 실제로 열고, 끌어 닫고, 본문을 스크롤할 수 있다.

[그림: 플레이그라운드](../../site/components/specs/side-panel.tsx#playground)

## Anatomy

[그림: 패널은 딤 · 패널 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥으로, 높이 전체 · 모서리 없음](../../site/components/specs/side-panel.tsx#anatomy)

| ⓐ Overlay | 딤 — 패널 뒤 화면 전체. 입력 폼이 아니면 누르면 닫힌다. |
| ⓑ Container | 패널 — 왼쪽 또는 오른쪽 끝, 높이 전체. 모서리 · 그림자 · 선 없이 딤과 면 색으로 뜬다. |
| ⓒ Header | 머리 — 제목(늘 있다) · 설명(있을 때만) · 닫기 버튼. |
| ⓓ Body | 본문 — 넘치면 이 안에서만 스크롤한다. 스크롤되면 머리 아래 1px 선. |
| ⓔ Footer | 바닥 — 버튼, 오른쪽 정렬(오른쪽 패널). |

[표: 부위](side-panel.yaml#slots)

## Properties

### 방향

| 방향 | 쓰는 곳 | 폭 |
|---|---|---|
| `left` | 768 미만의 주 메뉴 서랍 — 지금 HR 폰 하나 | 화면 폭의 80% |
| `right` | 1280 이상의 보조 작업 — 쓰는 곳 없음 | 크기(480 · 720 · 960) |

왼쪽은 내비게이션(SEED — "모바일 사이드바, 글로벌 내비게이션 메뉴"), 오른쪽은 상세 조회 · 설정 같은 보조 작업이다. 아래에서 올라오는 패널은 [Bottom Sheet](bottom-sheet.md) 이고, 위에서 내려오는 패널은 두지 않는다.

[그림: 방향 — 왼쪽 주 메뉴 80% · 오른쪽 720](../../site/components/specs/side-panel.tsx#side)

[표: 방향](side-panel.yaml#side)

### 크기

오른쪽 패널의 폭이다 — `small` 480(단순한 상세) · `medium` 720 *(기본)*(두 줄 폼 · 목록과 상세 나란히) · `large` 960(복잡한 설정). 어느 크기든 화면의 80% 를 넘지 않아 딤이 늘 20% 남는다. 높이는 화면 전체다.

[그림: 크기 — 480 · 720 · 960, 1280 화면에서](../../site/components/specs/side-panel.tsx#size)

[표: 크기](side-panel.yaml#size)

### 머리 · 본문 · 바닥

머리는 위 24 · 좌우 24 · 아래 16 · 최소 70, 제목 22 / 30 · 700 · 설명 16 / 22(`fg-neutral-muted`) · 사이 6 이다. 닫기 버튼은 투명 상자 52 · 아이콘 22(`fg-neutral-subtle`)이고 아이콘이 위 28 · 오른쪽 24 에 놓인다 — [Dialog](dialog.md) 의 닫기와 같다. 본문은 좌우 24 이고 넘치면 본문만 스크롤된다 — 위로 스크롤하면 머리 아래 1px 선이 생긴다. 바닥은 위 16 · 좌우 24 · 아래 24 에 Button small 36 을 오른쪽으로 모은다. 머리 위에는 위 안전 영역을, 패널 맨 아래에는 아래 안전 영역을 더한다(바닥이 없어도).

[그림: 머리 · 본문 · 바닥의 여백, 스크롤하면 머리 아래 선](../../site/components/specs/side-panel.tsx#layout)

[표: 공통](side-panel.yaml#base.enabled)

### 본문 끝 흐림

넘칠 수 있는 본문(주 메뉴 · 목록 · 긴 폼)은 [Scroll Fog](scroll-fog.md) 를 건다(`scrollFog`) — 위 20 · 아래 80 이 늘 흐리고 본문 안에 그만큼 여백을 둔다. 시트 · 대화상자와 같은 규칙이다(SEED Side Panel 의 늘 켜진 아래 48 대신). 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않는다.

[표: 본문 끝 흐림](side-panel.yaml#scrollFog)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 열림 — 딤 위 패널 |
| `scrolled` | 본문이 위로 스크롤됨 — 머리 아래 1px `stroke-neutral-subtle` |
| `pressed` | 닫기 버튼 — `bg-layer-floating-pressed` + 2px 거리 축소 |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px |

[표: 상태](side-panel.yaml#matrix)

[표: 모션](side-panel.yaml#motion)

## Guidelines

### 쓰는 자리

| 이런 일 | 768 미만 | 768 ~ 1279 | 1280 이상 |
|---|---|---|---|
| 주 메뉴 | Desk 하단 탭 바 · HR **Side Panel**(왼쪽) | [Side Navigation](side-navigation.md)(접힘) | Side Navigation(펼침) |
| 지금 화면을 떠나지 않는 보조 작업(상세 · 설정) | [Bottom Sheet](bottom-sheet.md) | Bottom Sheet | [Dialog](dialog.md) — 옆에 둘 까닭이 있으면 **Side Panel**(오른쪽) |
| 아래에서 올라오는 모달 | Bottom Sheet | Bottom Sheet | — |

오른쪽 패널은 1280 이상에서만이다 — 1280 미만에서는 같은 내용을 Bottom Sheet 로 띄운다(폼 · 상세의 Responsive Dialog 와 같은 경계 — 새 경계를 두지 않는다). 옆에 둘 까닭은 본문을 보면서 함께 다룰 때(목록을 보며 한 줄의 상세)다 — 그렇지 않으면 Dialog 다. 지금은 오른쪽 패널을 쓰는 곳이 없다.

[그림: 쓰는 자리 — 폰 주 메뉴 · 1280 이상 오른쪽 패널 · 1280 미만은 시트](../../site/components/specs/side-panel.tsx#role-guide)

### 주 메뉴 서랍(HR 폰)

HR 웹 768 미만의 [Top Navigation](top-navigation.md) ☰ 가 연다.

- 왼쪽 · 화면 폭의 80% · 제목은 서비스 이름("그루 이음").
- 본문은 [Side Navigation](side-navigation.md) 의 묶음 · 항목을 펼친 모양 그대로 담는다 — 본문 좌우 16 에 항목(좌우 8)이 들어와 아이콘이 제목과 같은 24 에 선다. 넘칠 수 있어 `scrollFog` 를 건다.
- 지금 화면의 묶음은 펼쳐진 채 열리고 지금 항목이 보인다.
- 항목을 누르면 이동하고 서랍이 닫힌다 — 다음 화면의 초점 · 스크롤은 Top Navigation 의 "화면을 옮길 때".
- 바닥에는 계정(Side Navigation 의 바닥과 같은 것)을 둔다.
- 창이 768 이상으로 넓어지면 닫힌다 — 사이드바가 그 자리를 맡는다.

[그림: HR 주 메뉴 서랍 — 휴가 묶음이 펼쳐진 채, 항목을 누르면 닫힘](../../site/components/specs/side-panel.tsx#drawer-guide)

### 입력 폼은 실수로 닫히지 않게

오른쪽 패널에 입력 폼을 띄우면 [Dialog](dialog.md) 와 같다 — 바깥(딤)을 눌러도, 끌어도 닫히지 않고, 바닥 [취소] · `Esc` 로 닫으며, 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다. 입력 폼에는 머리 닫기 버튼을 두지 않는다(닫기와 취소는 하나만). 조회 · 주 메뉴는 머리 닫기 · 딤 누르기 · `Esc` · 끌기로 닫힌다.

[그림: 닫기 — 주 메뉴는 딤 · 끌기로 닫힘 · 폼은 바닥 취소](../../site/components/specs/side-panel.tsx#dismiss-guide)

### 평평하게

패널은 화면 높이 전체에 붙고 모서리 · 그림자 · 테두리가 없다 — 딤과 면 색(`bg-layer-floating`)으로 뜬다. 패널 위에 또 패널을 겹치지 않는다 — 그 안에서는 Popover · Select 목록 · 확인창(Alert Dialog)만 뜬다(SEED 고도 — Side Panel 은 Level 2, Dialog 는 Level 3).

### 글

제목은 무엇을 하는 패널인지 — 주 메뉴 서랍은 서비스 이름. 설명은 덧붙일 말이 있을 때만 한 문장(해요체 · 마침표). 바닥 버튼은 동작 이름("저장") — "확인" 으로 뭉뚱그리지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/side-panel.tsx` 를 쓴다(Radix Dialog 위 — 끌어 닫기 · 뒤로 가기 닫기는 레시피가 더한다). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `SidePanel` — `open` · `onOpenChange` · `form`(바깥 누르기 · 끌기로 닫지 않는다) · `dirty`(닫기 전에 묻는다).
- `SidePanelTrigger` — `asChild`.
- `SidePanelContent` — 패널. `side`(`"left"` · `"right"` 기본) · `size`(`"small"` · `"medium"` 기본 · `"large"` — 오른쪽만) · `title`(필수) · `description` · `showCloseButton`(기본 `true`, `form` 이면 그리지 않는다).
- `SidePanelBody` — 본문. `scrollFog`(위 20 · 아래 80).
- `SidePanelFooter` — 바닥 버튼, 오른쪽 정렬.

1280 미만에서 오른쪽 패널을 Bottom Sheet 로 바꾸는 부품은 오른쪽 패널을 쓸 자리가 생길 때 Responsive Dialog 처럼 더한다.

### 주 메뉴 서랍 — HR 폰

[그림: HR 주 메뉴 — 서비스 이름 · 지금 묶음 펼침](../../site/components/specs/side-panel.tsx#ex-drawer)

```tsx
import { SidePanel, SidePanelBody, SidePanelContent } from "@/components/ui/side-panel"
import { SideNavigationContent, SideNavigationGroup, SideNavigationItem, SideNavigationSubItem } from "@/components/ui/side-navigation"

<SidePanel open={menuOpen} onOpenChange={setMenuOpen}>
  <SidePanelContent side="left" title="그루 이음" id="main-menu">
    <SidePanelBody scrollFog className="px-x4">
      {/* 사이드바와 같은 항목 — 지금 묶음은 저절로 펼쳐지고, 항목을 누르면 이동하고 닫힌다 */}
      <SideNavigationContent onNavigate={() => setMenuOpen(false)}>
        <SideNavigationGroup label="근무">
          <SideNavigationItem href="/calendar" icon={<CalendarDays />} label="캘린더" current={path === "/calendar"} />
          <SideNavigationItem icon={<Plane />} label="휴가">
            <SideNavigationSubItem href="/vacation/history" label="휴가 현황" current={path === "/vacation/history"} />
            <SideNavigationSubItem href="/vacation/application" label="휴가 신청" current={path === "/vacation/application"} />
          </SideNavigationItem>
        </SideNavigationGroup>
      </SideNavigationContent>
    </SidePanelBody>
  </SidePanelContent>
</SidePanel>
```

### 오른쪽 패널 — 1280 이상(쓰는 곳 없음)

```tsx
<SidePanel open={open} onOpenChange={setOpen} form dirty={isDirty}>
  <SidePanelContent side="right" size="medium" title="알림 설정">
    <SidePanelBody>…</SidePanelBody>
    <SidePanelFooter>
      <Button variant="neutralWeak" size="small" onClick={() => setOpen(false)}>취소</Button>
      <Button size="small" onClick={save}>저장</Button>
    </SidePanelFooter>
  </SidePanelContent>
</SidePanel>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 열기 | 붙은 쪽에서 300ms 로 미끄러져 들어온다. 처음 초점은 패널에 간다 |
| 닫기 버튼 · `Esc` | 닫는다. 입력 폼에 바뀐 값이 있으면 먼저 묻는다 |
| 뒤로 가기(기기 · 브라우저) | 1280 미만에서만 닫는다 — 열 때 기록을 하나 쌓고 뒤로 가기가 그것을 걷는다(Dialog · Bottom Sheet 와 같은 규칙). 1280 이상의 오른쪽 패널은 기록을 쌓지 않아 뒤로 가기가 화면을 옮긴다 |
| 바깥(딤) 누르기 | 주 메뉴 · 조회는 닫는다. **입력 폼은 무시한다** |
| 붙은 쪽으로 끌기(손가락 · 펜) | 놓을 때 빠르게(0.4px/ms 넘게) 끌었거나 폭의 25% 이상 밀었으면 닫고, 아니면 제자리로(Bottom Sheet 와 같은 기준). 마우스로는 끌지 않는다 — 글 고르기와 겹친다. **입력 폼은 끌리지 않는다** |
| 주 메뉴의 항목 누르기 | 이동하고 닫는다 |
| 창이 768 이상으로 넓어짐(주 메뉴) | 닫는다 — 사이드바가 맡는다 |
| 본문 스크롤 | 본문만 — 위로 스크롤되면 머리 아래 선. 끝 흐림(`scrollFog`)은 걸었으면 늘 그대로 |
| 닫힌 뒤 | 300ms 로 나가고, 초점은 연 자리(☰ · 트리거)로 돌아간다 |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠근다. 초점은 패널 안을 돈다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 떠 있는 표면(`bg-layer-floating`) 위 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 6.67, 주 메뉴 항목 이름 7.11 · 6.67 · 지금 항목 15.20 · 10.32 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 닫기 아이콘 `fg-neutral-subtle` 5.50 · 5.27 ✓, 주 메뉴 아이콘 같은 값 ✓. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 5.06 · 5.39 ✓ |
| **WCAG 2.4.3** Focus order | 열면 패널로, 닫으면 연 자리로 초점이 간다. 열린 동안 초점이 뒤 화면으로 나가지 않는다 ✓ |
| **WCAG 2.5.1** Pointer Gestures | 끌기 말고도 딤 누르기 · 닫기 · `Esc` · 뒤로 가기로 닫힌다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 52 · 주 메뉴 항목 44 · 바닥 버튼 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 52 ✓ · 항목 44 ✓ · 바닥 버튼은 누르는 영역을 44 까지(Button) ✓ |
| **ARIA** | `role="dialog"` + `aria-modal="true"`, 제목 `aria-labelledby`(제목 `h2`) · 설명 `aria-describedby`(있을 때만), 닫기 버튼 이름 "닫기". 주 메뉴 서랍 안의 목록은 `<nav aria-label="주 메뉴">`(Side Navigation 의 내용) |

## Do / Don't

### ✅ Do

- 왼쪽은 768 미만의 주 메뉴, 오른쪽은 1280 이상의 보조 작업 — 1280 미만은 Bottom Sheet.
- 평평하게 — 높이 전체 · 모서리 · 그림자 · 선 없음.
- 주 메뉴는 지금 묶음을 펼친 채 열고, 이동하면 닫는다.
- 입력 폼은 바깥 · 끌기로 닫지 않고, 바뀐 값이 있으면 묻는다.

### ❌ Don't

- 아래 · 위에서 나오는 패널(아래는 Bottom Sheet).
- 1280 미만에서 오른쪽 패널.
- 이동한 뒤에도 열려 있는 서랍 · 지금 묶음이 접힌 채 여는 서랍.
- 패널 위에 패널 · 그림자 · 둥근 모서리.
- 영어 이름("Sidebar" · "Close").

## Specification

`side-panel.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹이 Side Panel 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — side-panel.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#side-panel)

## SEED 와 다른 점

- **딤은 groo 0.50 · 다크 0.65**(v102) — SEED 0.455.
- **본문 끝 흐림은 Scroll Fog**(2026-10-03) — 넘칠 수 있는 본문에 늘 켜진 위 20 · 아래 80. SEED Side Panel 은 본문 아래 48 을 늘 흐린다.
- **반투명 색을 불투명 짝으로**(v102) — 머리 아래 선 `stroke-neutral-subtle`, 닫기 버튼 누름 `bg-layer-floating-pressed`.
- **1280 미만의 오른쪽 패널은 Bottom Sheet** — SEED Responsive Side Panel 은 md(768)에서 바꾼다. groo 는 Responsive Dialog · Input Button 과 같은 1280 이다.
- **기본 크기는 medium 720** — SEED React · CSS 와 같다(rootage JSON 기본은 small).
- **가로 화면의 노치** — SEED 문서는 "패널 너비에 safe-area-inset을 더합니다", 코드는 폭 안에서 뺀다. groo 는 문서를 따른다(내용 폭이 줄지 않게).
- **입력 폼은 바깥 · 끌기로 닫지 않는다** — Dialog · Bottom Sheet 와 같은 groo 규칙(2026-10-02). SEED 는 모든 패널이 바깥 누르기 · 가로 끌기(25%)로 닫힌다.
- **모션 줄이기면 150ms 서서히 나타남**(v104) — SEED 는 300ms 미끄러짐 그대로.
- **Persistent(비모달) 패널은 두지 않는다** — 쓸 자리가 없다.
- **z-index 는 specs/z-index.md 의 L2**(딤 `z-modal` 100 · 패널 `z-modal-content` 101).

## Migration notes

### 2026-10-04 — SEED Side Panel 로 새로 둔다(옛 Sheet 를 대신)

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)의 "따라오는 것" 으로 정했다 — Sheet 를 Side Panel 로: 왼쪽 · 오른쪽만(아래는 Bottom Sheet, 위는 걷음), 480 · 720 · 960 · 768 미만 80%, 평평(모서리 · 그림자 없음), 머리 24 · 제목 22 / 30 · 닫기 상자 52 · 아이콘 22. 지금 쓰는 곳은 HR 폰 메뉴 서랍(왼쪽) 하나 — 이동하면 닫고, 지금 묶음을 펼친 채 연다. 2026-10-02 Bottom Sheet 의 "오른쪽에서 나오는 패널은 Side Panel 차례에 정한다" 가 이것이다. 옛 Sheet(shadcn — 네 방향 · 폭 75% · 최대 384 · `shadow-xl` · 가장자리 1px 선 · 제목 18 / 600 · 닫기 28)는 걷었다 — 옛 스펙은 `sheet.history/v-pre-seed-nav.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사).

- **HR 폰 메뉴 서랍** — shadcn Sheet 왼쪽 288(80%) · `#FAFAFA`. 이름이 "Sidebar" · 설명 "Displays the mobile sidebar."(영어), 열면 지금 화면의 묶음도 접혀 있고(`treeView.tsx:263-265` — 펼침 초기값은 첫 마운트에만), 잎을 눌러 이동해도 서랍이 열린 채 남는다(`SidebarContent.tsx:101-108` · `shared/ui/shadcn/sidebar.tsx:198-201`, F12). Side Panel(왼쪽) + Side Navigation 항목으로.
- **Desk 웹** — 모바일 사이드바 시트는 닿지 않는 코드다(768 미만은 하단 탭 바 — F27). 옆 패널을 쓰는 화면이 없다.
- **HR 나눔 패널 4**(회사 · 부서 · 역할 · 사용자 — Resizable 25 / 75, `CompanyContent.tsx:116-140` 외)은 화면 안의 나눔이지 Side Panel 이 아니다 — [Resizable](resizable.md)(2026-10-10 — 목록 20 ~ 40%).
- 앱 적용 때 정할 자리 — HR 전체 화면 Dialog 3(페이지 · 시트 · 오른쪽 Side Panel — dialog.md), 데스크톱 필터(Dialog · Popover · 오른쪽 Side Panel).
