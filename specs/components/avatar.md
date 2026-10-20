# Avatar

> 사람 한 명을 보이는 원 — 사진이 있으면 사진, 없으면 이름의 첫 글자(이니셜) + 이름 색. 여러 사람은 겹친 묶음(Avatar Stack — 이 문서 아래)이다. 은행 · 증권 · 카드 같은 물건은 [Logo Tile](logo-tile.md)(각진 타일 — 같은 첫 글자 · 이름 색 규칙), 사진 · 카드 그림은 [Image Frame](image-frame.md), 카테고리는 [List](list.md) 의 타일이다 — 아바타가 아니다.

구조는 당근 [SEED Avatar](https://seed-design.io/components/avatar)(Apache-2.0)를 따른다 — 원 · 사진 · 1px 안쪽 테두리, 크기 10단계(20 ~ 108)와 자리마다 대표 크기, 묶음은 지름의 1/4 겹침 · 바탕색 링. 사진이 없을 때는 SEED 의 사람 그림이 아니라 이니셜 + 이름 색이고, 넘친 사람은 "+N" 원이다 — 맨 아래 "SEED 와 다른 점"(2026-10-03 사용자 결정). 옛 Avatar(32 · 40 · 48 · 64 · 회색 · 브랜드 채움 · 600)를 대신한다.

수치 원본은 [`avatar.yaml`](avatar.yaml)(아바타)과 [`avatar-stack.yaml`](avatar-stack.yaml)(묶음)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 더치페이 참가자 · 캘린더 공유 멤버 · HR 구성원 — 라이트 · 다크](../../site/components/specs/avatar.tsx#hero)

### 직접 골라 보기

크기 · 사진 유무 · 이름 · 묶음 인원을 고르면 스펙대로 그린 아바타 · 묶음과 그 코드가 바뀐다. 이름을 바꾸면 이니셜과 이름 색이 규칙대로 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/avatar.tsx#playground)

## Anatomy

[그림: 원 · 사진(또는 이니셜) · 1px 안쪽 테두리, 묶음은 바탕색 링](../../site/components/specs/avatar.tsx#anatomy)

| ⓐ Container | 원 — 폭 = 높이. 사진 · 이니셜을 원으로 자른다. |
| ⓑ Image | 사진 — 원을 채운다. |
| ⓒ Initial | 이니셜 — 사진이 없을 때. 이름의 첫 글자 + 이름 색 바탕. |
| ⓓ Border | 1px 안쪽 투명 테두리 — 모든 크기. 흰 사진이 바탕에 묻히지 않게(Image Frame 의 윤곽과 같은 색). |

[표: 부위](avatar.yaml#slots)

## Properties

### Size

크기는 SEED 의 10단계다 — 20 · 24 · 36 · 42 · 48 · 56 · 64 · 80 · 96 · 108. 자리마다 대표 크기를 쓰고, 같은 자리는 어느 화면에서나 같은 크기다. 이 밖의 크기를 만들지 않는다.

[그림: 크기 10단계 — 자리마다 대표 크기](../../site/components/specs/avatar.tsx#size)

[표: 크기 · 자리](avatar.yaml#size)

### 사진 · 이니셜

사진이 있으면 사진이다(HR 의 프로필 사진). 사진이 없거나(Desk 는 지금 사진이 없다), 불러오는 동안이거나, 불러오지 못하면 이니셜이 보인다 — 이니셜이 먼저 그려지고 사진이 오면 덮는다. 이니셜은 이름 색(차트 10색) 바탕에 `fg-neutral-inverted`(라이트 흰 · 다크 짙은 글자) · 700 이고, 글자는 지름의 40%(가장 작아도 10)다. 사람 그림(SEED Identity Placeholder) · 회색 한 색 · 브랜드 채움은 쓰지 않는다.

[그림: 사진 · 이니셜 + 이름 색 — 라이트 · 다크](../../site/components/specs/avatar.tsx#initial)

[표: 공통](avatar.yaml#base.enabled)

#### 이니셜과 이름 색 — 웹 · 앱이 같은 규칙

같은 사람은 웹 · 앱 · 어느 화면에서나 같은 글자 · 같은 색이다.

- **표시 이름** — 서버가 준 이름에서 앞뒤 공백만 뺀 글. 정규화 · 바꾸기를 하지 않는다(웹 · 앱이 같은 값을 받는다).
- **이니셜** — 표시 이름의 첫 글자 하나(사용자가 보는 글자 단위 — 웹 `Intl.Segmenter`, 앱 `characters.first`). 로마자는 대문자로. 한글 · 숫자 · 그림 글자는 그대로다. "김민수" → "김", "Kim Minsu" → "K"(지금 앱은 앞 두 글자 "Ki").
- **이름 색** — 표시 이름의 유니코드 코드 포인트(UTF-16 단위가 아니다 — 웹 `for…of` · `codePointAt`, 앱 `runes`)를 모두 더해 10 으로 나눈 나머지로 차트 10색을 고른다. 순서는 차트 색 순서(v110) 그대로다.

| 나머지 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| 색 | blue | green | orange | violet | pink | indigo | red | yellow | brown | gray |

| 이름 | 코드 포인트 | 합 | % 10 | 색 · 이니셜 |
|---|---|---|---|---|
| 김민수 | U+AE40 44608 · U+BBFC 48124 · U+C218 49688 | 142420 | 0 | blue · "김" |
| 이서연 | U+C774 51060 · U+C11C 49436 · U+C5F0 50672 | 151168 | 8 | brown · "이" |
| Kim Minsu | K 75 · i 105 · m 109 · 공백 32 · M 77 · i 105 · n 110 · s 115 · u 117 | 845 | 5 | indigo · "K" |

색은 뜻이 없다(장식) — 본인 · 역할 · 상태를 색으로 가르지 않는다. 이름이 비어 있으면(정상 흐름에는 없다) 회색(`chart-gray`) 원에 글자를 넣지 않는다.

### Avatar Stack

여러 사람은 겹쳐 묶는다 — 다음 아바타가 지름의 약 1/4(−5 ~ −27) 왼쪽으로 겹치고, 놓인 바탕색 링(1 ~ 5)으로 앞 아바타를 끊으며, 뒤에 오는 아바타가 위에 그려진다. 5명 이상이면 앞 4명 + 끝에 "+N" 원이다 — 같은 크기 · 같은 링 · 옅은 면(`bg-neutral-weak`) + `fg-neutral-muted` 700(N = 전체 − 4). 크기는 묶음이 정하고 안의 아바타가 모두 따른다. 링은 놓인 바탕과 같은 색 — 시트 · 대화상자 · 팝오버 안이면 `bg-layer-floating` 이다(`surface` 축 — 다크에서 두 바탕이 다르다). 묶음이 놓인 폭보다 넓으면 폭에 드는 만큼만 보이고 "+N" 이 커진다(아래 "폭이 모자라면 보이는 사람을 줄인다").

[그림: 묶음 — 1/4 겹침 · 바탕색 링 · 뒤가 위 · 앞 4명 + "+2"](../../site/components/specs/avatar.tsx#stack)

[표: 묶음 — 크기](avatar-stack.yaml#size)

[표: 묶음 — 공통](avatar-stack.yaml#base.enabled)

[표: 묶음 — 바탕](avatar-stack.yaml#surface)

### State

상태는 `enabled` 하나다 — 아바타 · 묶음은 누르지 않는다. 누르면 무언가 되는 자리(프로필 열기)는 아바타를 감싼 버튼 · 링크가 누름 · 포커스를 가진다.

## Guidelines

### 사람만 아바타 — 물건은 타일

아바타는 사람(본인 · 더치페이 참가자 · 공유 멤버 · HR 구성원)에만 쓴다. 은행 · 증권 · 카드 · 코인 · 금 · 회사처럼 물건을 보이는 것은 [Logo Tile](logo-tile.md), 카테고리처럼 분류를 보이는 것은 [List](list.md) 의 타일이다 — 둘 다 각진 타일이고, 원 아바타로 그리지 않는다. 첫 글자 · 이름 색은 Logo Tile 도 이 규칙을 쓴다.

[그림: 사람은 원 아바타, 자산 · 카테고리는 각진 타일](../../site/components/specs/avatar.tsx#thing-guide)

### 자리마다 대표 크기

같은 자리는 같은 크기다 — 더치페이 참가자 줄이 화면마다 28 · 32 · 36 · 40 으로 갈리지 않게 위 표의 대표 크기를 쓴다. 목록 줄은 한 줄이면 36, 이름 + 설명 두 줄이면 42 다.

[그림: 한 화면의 같은 자리 — 크기를 맞춘다 · 섞는다](../../site/components/specs/avatar.tsx#size-guide)

### 이름 옆이면 장식, 혼자면 이름

아바타 옆에는 대개 이름이 있다 — 그때 아바타는 장식이라 보조 기술에 숨긴다(이름을 한 번만 읽는다 — "김 김민수" 가 아니다). 이름 없이 아바타만 있으면(접힌 사이드바 · 묶음) 아바타가 이름을 가진다.

[그림: 이름 옆 아바타는 숨김 · 혼자인 아바타는 이름](../../site/components/specs/avatar.tsx#name-guide)

### 같은 사람은 같은 색, 흐리게 하지 않는다

이름 색은 규칙으로만 정한다 — 화면 · 플랫폼이 따로 해시를 두지 않는다. 상태(안 낸 사람 · 나간 사람)는 아바타를 흐리게(불투명도) 하지 않고 이름 옆 글 · [Badge](badge.md) 로 알린다(v106 — 불투명도로 흐리지 않는다).

[그림: 같은 이름은 웹 · 앱이 같은 색 · 상태는 배지로, 흐리지 않는다](../../site/components/specs/avatar.tsx#color-guide)

### 묶음은 넷까지 + "+N"

묶음에는 앞 4명까지 보이고 나머지는 "+N" 원이다. 묶음 옆에는 전체 수를 글로 둔다("6명 · 412,000원") — 그러면 묶음은 장식이다. 묶음만 있으면 묶음이 이름을 가진다("참여자 6명: 김민수, 이서연, 박지훈, 최유진 외 2명").

[그림: 앞 4명 + "+2" · 옆에 "6명"](../../site/components/specs/avatar.tsx#stack-guide)

### 폭이 모자라면 보이는 사람을 줄인다

큰 묶음(80 ~ 108)은 앞 4명 + "+N" 이 폰 폭을 넘는다(108 이면 432). 묶음은 자기가 차지할 수 있는 폭 W 를 재서, 원 c 개의 폭 = 지름 + (c − 1) × (지름 − 겹침) 으로 센다 — 모두(4명 이하)가 W 에 들면 모두 보이고, 아니면 "+N" 원까지 W 에 드는 원 수 c = 1 + ⌊(W − 지름) ÷ (지름 − 겹침)⌋ 에서 하나를 뺀 사람(4명까지 · 가장 적어도 1명)이 보인다. 108 · 6명 · 폰 안쪽 312 면 2명 + "+4"(폭 270)다. 크기는 줄이지 않는다 — 1명 + "+N" 도 넘치면 작은 크기를 쓴다. 폰 안쪽 312 에서 64 까지는 늘 앞 4명이다.

폭이 바뀌면(창 크기 · 화면 돌림) 다시 센다 — 웹은 ResizeObserver, 앱은 LayoutBuilder. 그래서 같은 묶음도 폭마다 보이는 사람이 다르고, 묶음 이름의 "외 N명" 도 보이는 "+N" 과 같게 바뀐다("참여자 6명: 김민수, 이서연 외 4명"). 묶음 크기를 48 까지로 묶는 안(A)은 고르지 않았다(2026-10-17 사용자 결정 — 03-E 결정 4 B). SEED 는 넘침 · 폭 규칙이 없다.

[그림: 폭에 맞춘 묶음 — 108 은 2명 + "+4" · 48 은 앞 4명 + "+2" · 폭을 보지 않은 108](../../site/components/specs/avatar.tsx#stack-fit)

### 사진 바꾸기 — 늘 보이는 버튼

프로필 사진을 바꾸는 자리(HR 직원 정보 수정 — 108)는 아바타 아래 16 에 버튼 둘을 늘 보인다 — "사진 바꾸기"([Button](button.md) `neutralWeak` small) · "사진 지우기"(`ghost` small, 사진이 있을 때만 — 지우면 이니셜). 마우스를 올려야 나타나는 덮개는 두지 않는다 — 키보드 · 터치 · 화면 읽기로 닿지 않는다(사용자 결정 2026-10-15 마무리 6A — 호버 덮개 6C · 첨부 칸 한 장 6B 는 고르지 않았다). 올리는 중에는 아바타 위 딤(라이트 50% · 다크 65%) 가운데 값 있는 원 24(`staticWhite` — [Progress Circle](progress-circle.md) "올리기 · 받기")를 두고 두 버튼을 막는다. 실패는 [Field](field.md) 의 오류 글로 그 자리에 알린다("5MB 넘는 사진은 올릴 수 없어요.") — 성공을 따로 알리지 않는다(사진이 바뀐 것이 보인다). 앱의 "사진 바꾸기" 는 [Menu Sheet](menu-sheet.md)(사진 찍기 · 앨범에서 고르기)를 연다. 여럿 · 파일을 붙이는 자리는 [Attachment Input](attachment-input.md) 이다.

[그림: HR 사용자 수정 — 108 + "사진 바꾸기" · "사진 지우기" · 올리는 중(딤 + 원 24, 버튼 막힘) · 실패(오류 글) · 사진 없음(이니셜 + "사진 바꾸기" 하나)](../../site/components/specs/avatar.tsx#photo-guide)

[표: 사진 바꾸기 자리](avatar.yaml#matrix.edit.photo@uploadOverlay+editActions)

## 코드

레시피 `recipes/shadcn/components/ui/avatar.tsx` 를 쓴다 — `Avatar` · `AvatarStack` 과 규칙 함수 `avatarInitial(name)`(이니셜) · `avatarHue(name)`(이름 색 — `"blue"` … `"gray"`). `Avatar` 는 `name`(필수 — 이니셜 · 이름 색 · 이름) · `src`(사진, 없으면 이니셜) · `size`(`20` · `24` · `36` · `42` · `48` · `56` · `64` · `80` · `96` · `108`, 기본 `48` — 자리마다 고른다) · `decorative`(기본 `true` — 옆에 이름이 있을 때. `false` 면 이름을 읽는다) · `uploadProgress`(0 ~ 1 — 주면 원 위 딤 + 값 있는 원 24 `staticWhite`, 이름 "프로필 사진 올리는 중" · 값 글 "40%")를 받는다. `AvatarStack` 은 `size`(안의 아바타가 따른다 — 기본 `24`) · `max`(기본 4) · `surface`(링 색 — `"default"` 기본 · `"floating"`) · `aria-label`(주면 묶음을 그림 하나로 읽고, 없으면 장식으로 숨긴다)을 받는다. 앱은 같은 규칙 함수를 Dart 로 두고 아래 예시 이름으로 같은 답이 나오는지 시험한다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 이름 옆 — 장식

[그림: 더치페이 참가자 줄 — 36 · 이니셜 + 이름 색](../../site/components/specs/avatar.tsx#ex-row)

```tsx
import { Avatar } from "@/components/ui/avatar"

<span className="flex items-center gap-x3">
  <Avatar size={36} name={p.name} src={p.photoUrl} />
  <span>{p.name}</span>
</span>
```

### 혼자 — 이름을 읽는다

[그림: 접힌 사이드바의 내 아바타 · HR 프로필 사진 96](../../site/components/specs/avatar.tsx#ex-alone)

```tsx
<Avatar size={36} name={me.name} decorative={false} />
<Avatar size={96} name={user.name} src={user.profileUrl} decorative={false} />
```

### 묶음 — 앞 4명 + "+N"

[그림: 더치페이 목록 — 24 묶음 · 옆에 "6명"](../../site/components/specs/avatar.tsx#ex-stack)

```tsx
import { Avatar, AvatarStack } from "@/components/ui/avatar"

<span className="flex items-center gap-x2">
  <AvatarStack size={24}>
    {people.map((p) => <Avatar key={p.id} name={p.name} src={p.photoUrl} />)}
  </AvatarStack>
  <span>{people.length}명 · {formatWon(total)}</span>
</span>
```

### 사진 바꾸기 — HR 직원 정보 수정

[그림: 사용자 수정 대화상자 — 108 + 늘 보이는 버튼 둘, 올리는 중 · 실패](../../site/components/specs/avatar.tsx#ex-photo)

```tsx
import { useRef, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"

const MAX_SIZE = 5 * 1024 * 1024
const user = { name: "한지우", profileUrl: "/profiles/jiwoo.webp" }
// POST /users/profiles — 진행을 알려 주고 새 사진 주소를 돌려준다
const uploadProfile = (file: File, onProgress: (ratio: number) => void) => {
  onProgress(1)
  return Promise.resolve(URL.createObjectURL(file))
}

const fileRef = useRef<HTMLInputElement>(null)
const [photoUrl, setPhotoUrl] = useState<string | undefined>(user.profileUrl)
const [progress, setProgress] = useState<number | undefined>(undefined)
const [error, setError] = useState<string | null>(null)

const pick = (file: File | undefined) => {
  if (!file) return
  if (!file.type.startsWith("image/")) return setError("사진 파일만 올릴 수 있어요.")
  if (file.size > MAX_SIZE) return setError("5MB 넘는 사진은 올릴 수 없어요.")
  setError(null)
  setProgress(0)
  uploadProfile(file, setProgress)
    .then(setPhotoUrl, () => setError("사진을 올리지 못했어요. 다시 해주세요."))
    .finally(() => setProgress(undefined))
}

{/* 버튼은 늘 보인다 — 마우스를 올려야 나타나는 덮개를 두지 않는다 */}
<Field invalid={error !== null} errorMessage={error}>
  <div className="flex flex-col items-center gap-x4">
    <Avatar size={108} name={user.name} src={photoUrl} decorative={false} uploadProgress={progress} />
    <div className="flex flex-wrap justify-center gap-x2">
      <Button variant="neutralWeak" size="small" disabled={progress !== undefined} onClick={() => fileRef.current?.click()}>
        사진 바꾸기
      </Button>
      {photoUrl && (
        <Button variant="ghost" size="small" disabled={progress !== undefined} onClick={() => setPhotoUrl(undefined)}>
          사진 지우기
        </Button>
      )}
    </div>
    <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
  </div>
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 사진을 불러오는 동안 | 이니셜이 보이고, 사진이 오면 덮는다(스켈레톤을 따로 두지 않는다) |
| 사진을 불러오지 못함 · 사진 없음 | 이니셜 그대로 — 깨진 그림 · 빈 원이 보이지 않는다 |
| 이름이 바뀜 | 이니셜 · 이름 색이 규칙대로 바로 바뀐다 |
| 묶음 인원이 바뀜 | 앞 4명 · "+N" 을 다시 센다 |
| 묶음이 놓인 폭이 바뀜 | 폭에 드는 사람 수 · "+N" · 묶음 이름의 "외 N명" 을 다시 센다(크기는 그대로) |
| 누르기 | 아바타 · 묶음 자체는 누르지 않는다 — 감싼 버튼 · 링크의 동작 |
| 사진 바꾸기 · 사진 지우기 | 버튼이 늘 보인다 — "사진 바꾸기" 는 고르기 창(앱은 메뉴 시트), "사진 지우기" 는 이니셜로. 올리는 동안 아바타 위 딤 + 값 있는 원 24 · 두 버튼 막힘, 실패는 Field 오류 글 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이니셜 `fg-neutral-inverted` on 차트 10색 — 라이트 4.55(yellow) ~ 5.50, 다크 6.07 ~ 7.70 ✓(다크에서 흰 글자는 1.88 ~ 2.39 라 쓰지 않는다). "+N" `fg-neutral-muted` on `bg-neutral-weak` 6.58 · 5.93 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 1px 테두리 · 바탕색 링은 장식이다(사진 · 이니셜이 사람을 알린다). 이니셜 원은 흰 표면과 4.55 이상 |
| **WCAG 1.1.1** Non-text Content | 이름 옆 아바타는 장식(`aria-hidden`, 사진 `alt=""`) — 이름을 한 번만 읽는다. 혼자인 아바타는 `role="img"` + 이름(`aria-label="김민수"`), 사진 실패 · 이니셜이어도 같은 이름 |
| **WCAG 1.4.1** Use of color | 이름 색은 뜻이 없다 — 상태 · 역할은 글 · 배지로 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않는다. 감싼 버튼은 그 버튼의 규칙(20 · 24 아바타를 누르게 하려면 누르는 영역을 44 로) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다. 사진 바꾸기 버튼은 Button small 36 · 누르는 영역 44 ✓ |
| **WCAG 2.1.1** Keyboard | 사진 바꾸기 · 지우기는 늘 보이는 버튼이라 `Tab` · `Enter` 로 닿는다 — 마우스를 올려야 나타나는 덮개를 두지 않는다 ✓ |
| **ARIA** | 묶음은 `aria-label` 이 있으면 `role="img"` 하나("참여자 6명: 김민수, 이서연, 박지훈, 최유진 외 2명" — 폭에 맞춰 사람을 줄이면 이름도 보이는 사람 + "외 N명"), 없으면 `aria-hidden`(옆 글이 수를 말한다). 안의 아바타 · "+N" 은 따로 읽지 않는다 |

## Do / Don't

### ✅ Do

- 사진이 있으면 사진, 없으면 이니셜 + 이름 색.
- 같은 자리는 같은 크기 — 10단계 안에서.
- 이름 옆 아바타는 장식으로 숨긴다.
- 묶음은 앞 4명 + "+N", 옆에 전체 수를 글로.
- 사진을 바꾸는 자리는 아바타 아래 늘 보이는 "사진 바꾸기" · "사진 지우기".

### ❌ Don't

- 자산 · 카드 · 카테고리를 원 아바타로.
- 화면 · 플랫폼마다 다른 해시 · 다른 색 순서.
- 브랜드 채움 · 회색 한 색 이니셜, 이니셜 두 글자("Ki").
- 아바타를 흐리게 해서 상태 알리기.
- 다크에서 차트 색 위 흰 이니셜.
- 사진 바꾸기를 마우스를 올려야 나타나는 덮개에만 두기.

## Specification

`avatar.yaml` · `avatar-stack.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Avatar 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — avatar.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#avatar)

[그림: Specification — avatar-stack.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#avatar-stack)

## SEED 와 다른 점

- **사진이 없으면 이니셜 + 이름 색** — SEED 는 사람 그림(Identity Placeholder)이고 이니셜이 없다. Desk 는 사진이 없어 사람이 모두 같은 회색 그림이 되고, 묶음에서 누가 누구인지 갈리지 않는다(사용자 결정 5C). 이름 색은 차트 10색(v110)에서 이름 해시로 하나, 글자는 `fg-neutral-inverted`.
- **넘친 사람은 "+N" 원** — SEED 는 "앞에서부터 숨긴다" 뿐이다(사용자 결정 6B).
- **링은 놓인 바탕색** — SEED 는 `bg.layer-default` 하나. groo 다크에서 시트(`bg-layer-floating`)는 기본 표면과 달라 그 바탕색을 쓴다.
- **오른쪽 아래 배지(원 · 방패 · 꽃 마스크)는 두지 않는다** — groo 에 쓰는 자리가 없다.
- **80 · 96 의 자리는 groo 화면에서** — SEED 는 설명이 없다(Desk 계정 머리 · HR 큰 프로필 사진).
- **이름 옆 아바타는 장식, 혼자면 이름** — SEED 는 `alt` 가 선택이고 예제에 없어 이름 없는 그림으로 읽힌다.

## Migration notes

### 2026-10-17 — 폭에 맞춘 묶음(03-E 결정 4 B)

구현 조사에서 108 묶음(앞 4명 + "+2")이 폭 432 로 폰 폭을 120 넘는 것을 찾았다. 사용자가 [비교 페이지](https://claude.ai/artifact/FKYaqu7zAR5T2HVwFnx5oD)에서 "폭에 맞춰 보이는 사람 수를 줄인다"(B)를 골랐다 — 크기를 48 까지로 묶는 안(A)은 고르지 않았다. `avatar-stack.yaml` 에 `root.overflow`(셈 · 예 · 다시 세는 때 · 이름)를 적고, 사이트 그림 `avatar.tsx#stack-fit` 이 같은 셈(`stackFit`)으로 그린다. 레시피 `AvatarStack` 은 아직 앞 `max` 명만 센다 — 웹 `AvatarStack` · 앱 `PAvatarStack` 이 놓인 폭을 재어(ResizeObserver · LayoutBuilder) 보이는 사람 수와 이름의 "외 N명" 을 함께 바꾸게 한다. 지금 Desk 화면은 묶음을 아직 쓰지 않는다(더치페이는 손 아바타). 옛 스펙은 `avatar.history/v-pre-03e-03b.md` · `avatar-stack.history/v-pre-03e-03b.yaml`.

### 2026-10-15 — 사진 바꾸기는 늘 보이는 버튼

사용자가 [마무리 비교 페이지](https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z) 6A 에서 정했다 — 프로필 사진 하나를 바꾸는 자리는 Avatar + 늘 보이는 "사진 바꾸기"(neutralWeak small) · "사진 지우기"(ghost small), 올리는 중은 아바타 위 딤 + 값 있는 원 24, 실패는 Field 오류 글. Attachment Input 한 장(6B — 고칠 때만 네모가 된다) · 지금의 호버 덮개(6C)는 고르지 않았다. `avatar.yaml` 에 `edit`(none · photo) 축과 `uploading` 상태, 레시피에 `uploadProgress` 를 더했다.

- **HR 사용자 수정 대화상자의 사진**(사이드바 계정 `widgets/sidebar/ui/SidebarFooter.tsx:117-119` · 관리자 사용자 표 `UserTable.tsx:322` 두 곳에서 열림) — 160 원 위에 마우스를 올려야 검정 50% 덮개 + 흰 20% 원 48 둘(업로드 · 삭제)이 나타나고, 덮개가 `div onClick` 이라 **키보드로 닿지 않고 터치에선 보이지 않는 채로 눌러야 한다**(`features/user-profile/ui/UserEditDialog.tsx:244-305`). 108 + 늘 보이는 버튼 둘로. 올리는 중의 스켈레톤 + 스피너 "처리 중..." 은 딤 + 값 있는 원 24 로, 빨간 Alert(`imageFileOnly` · `fileSizeLimit`) · 초록 Alert 3초는 Field 오류 글 하나로(성공 알림 없음). 사진을 못 불러오면 `https://github.com/shadcn.png` 로 바꿔 끼우는 것(`:267`)을 걷고 이니셜로. 개발 서버의 이미지 주소 디버그 상자도 걷는다. 고르는 즉시 800px · 품질 0.8 로 줄이는 것(`:69-94`)과 5MB 한도(`:159` · hr-back `UserServiceImpl.java:58`)는 그대로다.
- **번역 키 두 벌** — `common,fileSizeLimit` 이 문구가 다른 두 줄("5MB 이하여야 합니다" · "5MB를 초과할 수 없습니다"), `imageFileOnly` 도 두 줄이다(`i18n/translations.csv:710 · 1043`) — 해요체 한 줄로("5MB 넘는 사진은 올릴 수 없어요." · "사진 파일만 올릴 수 있어요.").

### 2026-10-08 — 묶음의 바탕(surface)을 YAML 축으로

떠 있는 바탕(시트 · 대화상자 · 팝오버)에서 링 색이 `bg-layer-floating` 이어야 한다는 말이 비고에만 있고 축이 없었다 — YAML 대로 만들면 다크의 떠 있는 바탕(#2D3346) 위에 화면 색(#242938) 링이 짙은 테로 보인다(desk-front #428). `avatar-stack.yaml` 에 `surface`(default · floating) 축을 두고 floating 의 링 · "+N" 링을 `bg-layer-floating` 으로 적었다. 레시피는 이미 `surface` 를 받는다. 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 5.

### 2026-10-03 — SEED Avatar · Avatar Stack 으로

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 정했다 — 사진이 없으면 이니셜 + 이름 색(5C — 차트 10색 중 이름 해시로 하나, 웹 · 앱 한 해시 · 한 순서, 글자 `fg-neutral-inverted`), 크기 · 묶음은 SEED + "+N"(6B — 10단계 · 1px 안쪽 테두리 `stroke-neutral-subtle` · 겹침 지름 1/4 · 링 1 ~ 5 `bg-layer-default` · 넘치면 끝에 "+N" 원). 사람 그림 · 이니셜 한 색 · 옛 32 · 40 · 48 · 64 는 고르지 않았다. 옛 Avatar(neutral · primary 채움 · 600 · `-space-x-2` 8 겹침 · 2px 링)와 DESIGN.md 의 Avatar v58 절(24 · 32 · 40 · 56 · 사각 변형 · 최대 3 + "+N more")은 걷었다 — 옛 스펙은 `avatar.history/v-pre-seed-display.*`.

| 옛 | 새 |
|---|---|
| sm 32 · md 40 · lg 48 · xl 64 | 자리마다 대표 크기 — 한 줄 목록 36 · 두 줄 42 · 계정 머리 80 … |
| neutral(회색) · primary(브랜드) 채움 이니셜 | 이니셜 + 이름 색(차트 10색) |
| 사각 아바타(HR 데이터 그리드 · 사이드바) | 원 하나 |
| 묶음 겹침 8 · 링 2 · 4 ~ 5 + "+N" | 겹침 · 링은 크기마다, 앞 4명 + "+N" |

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **Desk 웹에 공용 아바타가 없다** — 사람이 네 갈래로 그려진다: 사이드바 32 브랜드 옅은 이니셜(`widgets/layout/ui/GrooSidebar.tsx:228-237` — 이름이 비면 "·"), 설정 46 · 72 브랜드 채움(`pages/settings/ui/SettingsPage.tsx:695-710 · 924-938` — 다크 채움 : 표면 1.73, 이름이 비면 "?"), 더치페이 28 ~ 40 차트 해시(`pages/dutch-pay/ui/DutchPayPage.tsx:57-77 · 631-663`), 캘린더 공유 멤버는 권한 아이콘 원(`widgets/calendar-manage/ui/CalendarShareSection.tsx:74-85 · 772-788` — 아이콘 이름 없음, 다크 2.54 · 2.57). 사람은 모두 Avatar 로, 권한은 [Badge](badge.md) 로.
- **더치페이 다크 흰 이니셜 1.91 ~ 2.08:1** — 웹 · 앱 모두 밝은 다크 차트 색 위 흰 글자다. `fg-neutral-inverted` 로.
- **같은 사람이 웹 · 앱에서 다른 색** — 웹은 UTF-16 글자 코드 합 % 10(파랑부터, 7 갈색 · 8 노랑), 앱은 `h·31 + c`(빨강부터 — `features/dutch_pay/presentation/dutch_pay_screen.dart:358-366`)라 무작위 이름 2,000개 중 84.5% 가 다른 색이다. 웹 주석 "앱 정합" 은 사실이 아니다. 새 규칙(코드 포인트 합 % 10 · v110 순서)으로 웹은 나머지 7 · 8 인 이름만 노랑 ↔ 갈색이 바뀌고, 앱은 대부분 바뀐다.
- **안 낸 사람 흐림** — 더치페이 아바타를 불투명도 0.5 로 흐려 앱 라이트 1.43:1 이다. 흐리지 않고 배지 · 글로 알린다.
- **Desk 앱 `PAvatar`** — 낭독이 "김 김"(라벨 + 글자 — `shared/widgets/p_avatar.dart:56-59`), 영문 이름은 앞 두 글자 "Ki"(`:82-87`). `PAvatarGroup` 은 쓰는 곳이 없다("+3 +3" 으로 읽힌다).
- **HR shadcn Avatar** — 대체 글자가 크기와 관계없이 16 / 400(`shared/ui/shadcn/avatar.tsx:37-50`, 24 ~ 160), 사이드바만 모서리 8 사각(`widgets/sidebar/ui/SidebarFooter.tsx:80-83`), 근무표는 `alt` 가 없고 `baseUrl` 없이 `profile_url` 을 써 사진이 깨질 수 있다(`work-schedule/ui/ScheduleTable.tsx:258-261`), 일정 필터의 `text-xxs` 는 정의가 없다(`calendar/ui/header/event-filter.tsx:142`). 사진이 실패하면 이름 없이 "김" 만 읽힌다.
- **물건 타일은 Logo Tile 로 정했다**(2026-10-04) — 자산 로고(웹 · 앱 모두 모서리 12 고정 — 2026-10-03 표시 조사의 "웹 크기 × 0.3" 은 틀렸다, 렌더로 다시 쟀다 · 웹 800 · oklch 해시 ↔ 앱 700 · HSL 해시 — `entities/asset/ui/asset-logo.tsx:23-87` ↔ `asset_logo.dart`)는 [Logo Tile](logo-tile.md) 의 Migration notes, 카테고리 타일은 [List](list.md) 의 Migration notes 에 있다. 주식 타일은 증권 화면 차례에 정한다.

### 2026-10-04 — 테두리를 투명 윤곽으로(v118)

사용자가 [이미지 비교 페이지](https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X) 1A 에서 정했다 — "투명 윤곽 토큰 하나를 새로 두고 Avatar 윤곽도 이 색으로". 1px 안쪽 테두리가 불투명한 `stroke-neutral-subtle`(#EDEFF3 · 다크 #353B4D)에서 `stroke-neutral-overlay`(검정 4.7% · 다크 흰 5% — SEED stroke.neutral-subtle 의 값, v118)로 바뀐다. 흰 사진 둘레는 그대로 잡히고, 어두운 사진 · 이니셜 원 둘레에 생기던 옅은 테가 사라진다. 크기 · 두께는 그대로다. 사람 아바타의 "SEED 와 다른 점" 에서 이 줄이 빠졌다 — 이제 SEED 와 같다.
