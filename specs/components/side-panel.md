# Side Panel

> 화면 옆(왼쪽 · 오른쪽)에서 미끄러져 나오는 모달 패널입니다. 왼쪽은 HR 폰(768 미만)의 주 메뉴 서랍으로, ☰ 를 누르면 왼쪽에서 나와 [Side Navigation](side-navigation.md) 의 항목을 보입니다. 오른쪽은 1280 이상에서 지금 화면을 떠나지 않는 보조 작업에 씁니다. 아래에서 올라오는 모달은 [Bottom Sheet](bottom-sheet.md), 가운데 대화상자는 [Dialog](dialog.md) 입니다. 이동 부품(하단 탭 바 · 사이드바 · 상단 바 · Tabs)을 고르는 표는 DESIGN.md Layout 의 "이동 부품 고르기" 한 곳에 있습니다.

수치 원본은 [`side-panel.yaml`](side-panel.yaml)입니다.

[그림: HR 폰 주 메뉴 서랍 · 1280 오른쪽 패널 — 라이트 · 다크](../../site/components/specs/side-panel.tsx#hero)

### 직접 골라 보기

방향(왼쪽 주 메뉴 · 오른쪽 패널) · 크기 · 설명 · 본문 길이 · 바닥 버튼을 고르면 스펙대로 그린 패널과 그 코드가 바뀝니다. 실제로 열고, 끌어 닫고, 본문을 스크롤할 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/side-panel.tsx#playground)

## Anatomy

[그림: 패널은 딤 · 패널 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥으로, 높이 전체 · 모서리 없음](../../site/components/specs/side-panel.tsx#anatomy)

| ⓐ Overlay | 딤 — 패널 뒤 화면 전체입니다. 입력 폼이 아니면 누르면 닫힙니다. |
| ⓑ Container | 패널 — 왼쪽 또는 오른쪽 끝, 높이 전체입니다. 모서리 · 그림자 · 선 없이 딤과 면 색으로 뜹니다. |
| ⓒ Header | 머리 — 제목(늘 있음) · 설명(있을 때만) · 닫기 버튼입니다. |
| ⓓ Body | 본문 — 넘치면 이 안에서만 스크롤합니다. 스크롤되면 머리 아래 1px 선이 생깁니다. |
| ⓔ Footer | 바닥 — 버튼을 오른쪽으로 정렬합니다(오른쪽 패널). |

[표: 부위](side-panel.yaml#slots)

## Properties

### 방향

| 방향 | 쓰는 곳 | 폭 |
|---|---|---|
| `left` | 768 미만의 주 메뉴 서랍 — HR 폰 | 화면 폭의 80% |
| `right` | 1280 이상의 보조 작업 | 크기(480 · 720 · 960) |

왼쪽은 내비게이션(모바일의 주 메뉴), 오른쪽은 상세 조회 · 설정 같은 보조 작업입니다. 아래에서 올라오는 패널은 [Bottom Sheet](bottom-sheet.md) 이고, 위에서 내려오는 패널은 두지 않습니다.

[그림: 방향 — 왼쪽 주 메뉴 80% · 오른쪽 720](../../site/components/specs/side-panel.tsx#side)

[표: 방향](side-panel.yaml#side)

### 크기

오른쪽 패널의 폭입니다 — `small` 480(단순한 상세) · `medium` 720 *(기본)*(두 줄 폼 · 목록과 상세 나란히) · `large` 960(복잡한 설정). 어느 크기든 화면의 80% 를 넘지 않아 딤이 늘 20% 남습니다. 높이는 화면 전체입니다.

[그림: 크기 — 480 · 720 · 960, 1280 화면에서](../../site/components/specs/side-panel.tsx#size)

[표: 크기](side-panel.yaml#size)

### 머리 · 본문 · 바닥

머리는 위 24 · 좌우 24 · 아래 16 · 최소 70, 제목 22 / 30 · 700 · 설명 16 / 22(`fg-neutral-muted`) · 사이 6 입니다. 닫기 버튼은 투명 상자 52 · 아이콘 22(`fg-neutral-subtle`)이고 아이콘이 위 28 · 오른쪽 24 에 놓입니다 — [Dialog](dialog.md) 의 닫기와 같습니다. 본문은 좌우 24 이고 넘치면 본문만 스크롤됩니다 — 위로 스크롤하면 머리 아래 1px 선이 생깁니다. 바닥은 위 16 · 좌우 24 · 아래 24 에 Button small 36 을 오른쪽으로 모읍니다. 머리 위에는 위 안전 영역을, 패널 맨 아래에는 아래 안전 영역을 더합니다(바닥이 없어도). 가로 화면에서 노치가 패널 쪽이면 폭에 안전 영역을 더해, 내용 폭이 줄지 않게 합니다.

[그림: 머리 · 본문 · 바닥의 여백, 스크롤하면 머리 아래 선](../../site/components/specs/side-panel.tsx#layout)

[표: 공통](side-panel.yaml#base.enabled)

### 본문 끝 흐림

넘칠 수 있는 본문(주 메뉴 · 목록 · 긴 폼)은 [Scroll Fog](scroll-fog.md) 를 겁니다(`scrollFog`) — 위 20 · 아래 80 이 늘 흐리고 본문 안에 그만큼 여백을 둡니다. 시트 · 대화상자와 같은 규칙입니다. 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않습니다.

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

오른쪽 패널은 1280 이상에서만 씁니다 — 1280 미만에서는 같은 내용을 Bottom Sheet 로 띄웁니다. 1280 은 [Dialog](dialog.md) 의 Responsive Dialog · [Input Button](input-button.md) 과 같은 경계입니다 — 768 ~ 1279 에서 오른쪽 패널을 두면 그 안의 고르기 칸은 시트로, 같은 내용의 폼은 시트로 열려 표면이 엇갈려 겹칩니다. 새 경계를 두지 않습니다. 옆에 둘 까닭은 본문을 보면서 함께 다룰 때(목록을 보며 한 줄의 상세)입니다 — 그렇지 않으면 Dialog 입니다. 다른 표면과 견준 "상황 → 고를 것" 표는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 한 벌입니다.

[그림: 쓰는 자리 — 폰 주 메뉴 · 1280 이상 오른쪽 패널 · 1280 미만은 시트](../../site/components/specs/side-panel.tsx#role-guide)

### 주 메뉴 서랍(HR 폰)

HR 웹 768 미만의 [Top Navigation](top-navigation.md) ☰ 가 엽니다.

- 왼쪽 · 화면 폭의 80% 이고, 제목은 서비스 이름("그루 이음")입니다.
- 본문은 [Side Navigation](side-navigation.md) 의 묶음 · 항목을 펼친 모양 그대로 담습니다 — 본문 좌우 16 에 항목(좌우 8)이 들어와 아이콘이 제목과 같은 24 에 섭니다. 넘칠 수 있어 `scrollFog` 를 겁니다.
- 지금 화면의 묶음은 펼쳐진 채 열리고 지금 항목이 보입니다.
- 항목을 누르면 이동하고 서랍이 닫힙니다 — 다음 화면의 초점 · 스크롤은 Top Navigation 의 "화면을 옮길 때" 를 따릅니다.
- 바닥에는 계정(Side Navigation 의 바닥과 같은 것)을 둡니다.
- 창이 768 이상으로 넓어지면 닫힙니다 — 사이드바가 그 자리를 맡습니다.

[그림: HR 주 메뉴 서랍 — 휴가 묶음이 펼쳐진 채, 항목을 누르면 닫힘](../../site/components/specs/side-panel.tsx#drawer-guide)

### 입력 폼은 실수로 닫히지 않게

오른쪽 패널에 입력 폼을 띄우면 [Dialog](dialog.md) 와 같습니다 — 바깥(딤)을 눌러도, 끌어도 닫히지 않고, 바닥 [취소] · `Esc` 로 닫으며, 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻습니다. 입력 폼에는 머리 닫기 버튼을 두지 않습니다(닫기와 취소는 하나만). 조회 · 주 메뉴는 머리 닫기 · 딤 누르기 · `Esc` · 끌기로 닫힙니다.

**저장 중에는 닫히지 않습니다** — 바닥 [저장] 이 로딩인 동안은 [취소] · `Esc` · 딤 누르기 · 끌기 · 뒤로 가기를 모두 무시합니다. [Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md) 와 같은 계약입니다 — 표면이 막아야 합니다. [취소] 만 막으면 `Esc` · 딤으로 닫혀 쓰기 실패를 알릴 폼 맨 위 [Callout](callout.md) 자리가 사라지기 때문입니다.

[그림: 닫기 — 주 메뉴는 딤 · 끌기로 닫힘 · 폼은 바닥 취소](../../site/components/specs/side-panel.tsx#dismiss-guide)

### 평평하게

패널은 화면 높이 전체에 붙고 모서리 · 그림자 · 테두리가 없습니다 — 딤과 면 색(`bg-layer-floating`)으로 뜹니다. 패널 위에 또 패널을 겹치지 않습니다 — 그 안에서는 Popover · Select 목록 · 확인창(Alert Dialog)만 뜹니다. 쌓임 순서는 specs/z-index.md 의 L2(딤 `z-modal` 100 · 패널 `z-modal-content` 101)입니다. 패널은 늘 모달입니다 — 딤 없이 배경과 함께 다루는 비모달 패널은 두지 않습니다.

### 글

제목은 무엇을 하는 패널인지 적습니다 — 주 메뉴 서랍은 서비스 이름입니다. 설명은 덧붙일 말이 있을 때만 한 문장(해요체 · 마침표)으로 씁니다. 바닥 버튼은 동작 이름("저장")입니다 — "확인" 으로 뭉뚱그리지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/side-panel.tsx` 를 씁니다(Radix Dialog 위 — 끌어 닫기 · 뒤로 가기 닫기는 레시피가 더합니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `SidePanel` — `open` · `onOpenChange` · `form`(바깥 누르기 · 끌기로 닫지 않는다) · `dirty`(닫기 전에 묻는다) · `busy`(저장 중 — 모든 닫는 길을 무시합니다, Bottom Sheet 의 `busy` 와 같습니다).
- `SidePanelTrigger` — `asChild`.
- `SidePanelContent` — 패널. `side`(`"left"` · `"right"` 기본) · `size`(`"small"` · `"medium"` 기본 · `"large"` — 오른쪽만) · `title`(필수) · `description` · `showCloseButton`(기본 `true`, `form` 이면 그리지 않습니다).
- `SidePanelBody` — 본문. `scrollFog`(위 20 · 아래 80).
- `SidePanelFooter` — 바닥 버튼, 오른쪽 정렬.

1280 미만에서 오른쪽 패널을 Bottom Sheet 로 바꾸는 부품은 Responsive Dialog 처럼 둡니다.

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

### 오른쪽 패널 — 1280 이상

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
| 열기 | 붙은 쪽에서 300ms 로 미끄러져 들어옵니다. 처음 초점은 패널에 갑니다 |
| 닫기 버튼 · `Esc` | 닫습니다. 입력 폼에 바뀐 값이 있으면 먼저 묻습니다. 저장 중(`busy`)에는 무시합니다 |
| 뒤로 가기(기기 · 브라우저) | 1280 미만에서만 닫습니다 — 열 때 기록을 하나 쌓고 뒤로 가기가 그것을 걷습니다(Dialog · Bottom Sheet 와 같은 규칙). 1280 이상의 오른쪽 패널은 기록을 쌓지 않아 뒤로 가기가 화면을 옮깁니다 |
| 바깥(딤) 누르기 | 주 메뉴 · 조회는 닫습니다. **입력 폼은 무시합니다** |
| 붙은 쪽으로 끌기(손가락 · 펜) | 놓을 때 빠르게(0.4px/ms 넘게) 끌었거나 폭의 25% 이상 밀었으면 닫고, 아니면 제자리로 돌아갑니다(Bottom Sheet 와 같은 기준). 마우스로는 끌지 않습니다 — 글 고르기와 겹칩니다. **입력 폼은 끌리지 않습니다** |
| 주 메뉴의 항목 누르기 | 이동하고 닫습니다 |
| 창이 768 이상으로 넓어짐(주 메뉴) | 닫습니다 — 사이드바가 맡습니다 |
| 본문 스크롤 | 본문만 스크롤됩니다 — 위로 스크롤되면 머리 아래 선이 생깁니다. 끝 흐림(`scrollFog`)은 걸었으면 늘 그대로입니다 |
| 닫힌 뒤 | 300ms 로 나가고, 초점은 연 자리(☰ · 트리거)로 돌아갑니다 |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠급니다. 초점은 패널 안을 돕니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 떠 있는 표면(`bg-layer-floating`) 위 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 6.67, 주 메뉴 항목 이름 7.11 · 6.67 · 지금 항목 15.20 · 10.32 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 닫기 아이콘 `fg-neutral-subtle` 5.50 · 5.27 ✓, 주 메뉴 아이콘 같은 값 ✓. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 2.4.3** Focus order | 열면 패널로, 닫으면 연 자리로 초점이 갑니다. 열린 동안 초점이 뒤 화면으로 나가지 않습니다 ✓ |
| **WCAG 2.5.1** Pointer Gestures | 끌기 말고도 딤 누르기 · 닫기 · `Esc` · 뒤로 가기로 닫힙니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 52 · 주 메뉴 항목 44 · 바닥 버튼 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 52 ✓ · 항목 44 ✓ · 바닥 버튼은 누르는 영역을 44 까지(Button) ✓ |
| **ARIA** | `role="dialog"` + `aria-modal="true"`, 제목 `aria-labelledby`(제목 `h2`) · 설명 `aria-describedby`(있을 때만), 닫기 버튼 이름 "닫기". 주 메뉴 서랍 안의 목록은 `<nav aria-label="주 메뉴">`(Side Navigation 의 내용) |

## Do / Don't

### ✅ Do

- 왼쪽은 768 미만의 주 메뉴, 오른쪽은 1280 이상의 보조 작업 — 1280 미만은 Bottom Sheet.
- 평평하게 — 높이 전체 · 모서리 · 그림자 · 선 없음.
- 주 메뉴는 지금 묶음을 펼친 채 열고, 이동하면 닫습니다.
- 입력 폼은 바깥 · 끌기로 닫지 않고, 바뀐 값이 있으면 묻습니다.

### ❌ Don't

- 아래 · 위에서 나오는 패널(아래는 Bottom Sheet).
- 1280 미만에서 오른쪽 패널.
- 이동한 뒤에도 열려 있는 서랍 · 지금 묶음이 접힌 채 여는 서랍.
- 패널 위에 패널 · 그림자 · 둥근 모서리.
- 영어 이름("Sidebar" · "Close").

## Specification

`side-panel.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹이 Side Panel 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — side-panel.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#side-panel)
