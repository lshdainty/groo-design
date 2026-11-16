# Avatar

> 사람 한 명을 보이는 원입니다. 사진이 있으면 사진, 없으면 이름의 첫 글자(이니셜) + 이름 색을 보이고, 여러 사람은 겹친 묶음(Avatar Stack — 이 문서 아래)으로 보입니다. 은행 · 증권 · 카드 같은 물건은 [Logo Tile](logo-tile.md)(각진 타일 — 같은 첫 글자 · 이름 색 규칙), 사진 · 카드 그림은 [Image Frame](image-frame.md), 카테고리는 [List](list.md) 의 타일입니다 — 아바타가 아닙니다.

수치 원본은 [`avatar.yaml`](avatar.yaml)(아바타)과 [`avatar-stack.yaml`](avatar-stack.yaml)(묶음)입니다.

[그림: 더치페이 참가자 · 캘린더 공유 멤버 · HR 구성원 — 라이트 · 다크](../../site/components/specs/avatar.tsx#hero)

### 직접 골라 보기

크기 · 사진 유무 · 이름 · 묶음 인원을 고르면 스펙대로 그린 아바타 · 묶음과 그 코드가 바뀝니다. 이름을 바꾸면 이니셜과 이름 색이 규칙대로 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/avatar.tsx#playground)

## Anatomy

[그림: 원 · 사진(또는 이니셜) · 1px 안쪽 테두리, 묶음은 바탕색 링](../../site/components/specs/avatar.tsx#anatomy)

| ⓐ Container | 원 — 폭 = 높이입니다. 사진 · 이니셜을 원으로 자릅니다. |
| ⓑ Image | 사진 — 원을 채웁니다. |
| ⓒ Initial | 이니셜 — 사진이 없을 때 보입니다. 이름의 첫 글자 + 이름 색 바탕입니다. |
| ⓓ Border | 1px 안쪽 투명 테두리 — 모든 크기에 둡니다. 흰 사진이 바탕에 묻히지 않게 합니다(Image Frame 의 윤곽과 같은 색). |

[표: 부위](avatar.yaml#slots)

## Properties

### Size

크기는 10단계입니다 — 20 · 24 · 36 · 42 · 48 · 56 · 64 · 80 · 96 · 108. 자리마다 대표 크기를 쓰고, 같은 자리는 어느 화면에서나 같은 크기입니다. 이 밖의 크기를 만들지 않습니다.

[그림: 크기 10단계 — 자리마다 대표 크기](../../site/components/specs/avatar.tsx#size)

[표: 크기 · 자리](avatar.yaml#size)

### 사진 · 이니셜

사진이 있으면 사진입니다(HR 의 프로필 사진). 사진이 없거나, 불러오는 동안이거나, 불러오지 못하면 이니셜이 보입니다 — 이니셜이 먼저 그려지고 사진이 오면 덮습니다. 이름이 이미 와 있으므로 스켈레톤을 쓰지 않습니다. 그림 · 사람 · 물건 자리에 무엇이 대신 보이는지는 [Content Placeholder 의 "대신 보이는 것 고르기"](content-placeholder.md#대신-보이는-것-고르기) 한 곳에서 고릅니다. 이니셜은 이름 색(차트 10색) 바탕에 `fg-neutral-inverted`(라이트 흰 · 다크 짙은 글자) · 700 이고, 글자는 지름의 40%(가장 작아도 10)입니다. 사람 그림 · 회색 한 색 · 브랜드 채움은 쓰지 않습니다.

[그림: 사진 · 이니셜 + 이름 색 — 라이트 · 다크](../../site/components/specs/avatar.tsx#initial)

[표: 공통](avatar.yaml#base.enabled)

#### 이니셜과 이름 색 — 웹 · 앱이 같은 규칙

같은 사람은 웹 · 앱 · 어느 화면에서나 같은 글자 · 같은 색입니다.

- **표시 이름** — 서버가 준 이름에서 앞뒤 공백만 뺀 글입니다. 정규화 · 바꾸기를 하지 않습니다(웹 · 앱이 같은 값을 받습니다).
- **이니셜** — 표시 이름의 첫 글자 하나입니다(사용자가 보는 글자 단위 — 웹 `Intl.Segmenter`, 앱 `characters.first`). 로마자는 대문자로 씁니다. 한글 · 숫자 · 그림 글자는 그대로입니다. "김민수" → "김", "Kim Minsu" → "K"(두 글자 "Ki" 가 아닙니다).
- **이름 색** — 표시 이름의 유니코드 코드 포인트(UTF-16 단위가 아닙니다 — 웹 `for…of` · `codePointAt`, 앱 `runes`)를 모두 더해 10 으로 나눈 나머지로 차트 10색을 고릅니다. 순서는 차트 색 순서 그대로입니다.

| 나머지 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| 색 | blue | green | orange | violet | pink | indigo | red | yellow | brown | gray |

| 이름 | 코드 포인트 | 합 | % 10 | 색 · 이니셜 |
|---|---|---|---|---|
| 김민수 | U+AE40 44608 · U+BBFC 48124 · U+C218 49688 | 142420 | 0 | blue · "김" |
| 이서연 | U+C774 51060 · U+C11C 49436 · U+C5F0 50672 | 151168 | 8 | brown · "이" |
| Kim Minsu | K 75 · i 105 · m 109 · 공백 32 · M 77 · i 105 · n 110 · s 115 · u 117 | 845 | 5 | indigo · "K" |

색은 뜻이 없습니다(장식) — 본인 · 역할 · 상태를 색으로 가르지 않습니다. 이름이 비어 있으면(정상 흐름에는 없습니다) 회색(`chart-gray`) 원에 글자를 넣지 않습니다.

### Avatar Stack

여러 사람은 겹쳐 묶습니다 — 다음 아바타가 지름의 약 1/4(−5 ~ −27) 왼쪽으로 겹치고, 놓인 바탕색 링(1 ~ 5)으로 앞 아바타를 끊으며, 뒤에 오는 아바타가 위에 그려집니다. 5명 이상이면 앞 4명 + 끝에 "+N" 원입니다 — 같은 크기 · 같은 링 · 옅은 면(`bg-neutral-weak`) + `fg-neutral-muted` 700(N = 전체 − 4). 크기는 묶음이 정하고 안의 아바타가 모두 따릅니다. 링은 놓인 바탕과 같은 색입니다 — 시트 · 대화상자 · 팝오버 안이면 `bg-layer-floating` 입니다(`surface` 축 — 다크에서 두 바탕이 다릅니다). 묶음이 놓인 폭보다 넓으면 폭에 드는 만큼만 보이고 "+N" 이 커집니다(아래 "폭이 모자라면 보이는 사람을 줄입니다").

[그림: 묶음 — 1/4 겹침 · 바탕색 링 · 뒤가 위 · 앞 4명 + "+2"](../../site/components/specs/avatar.tsx#stack)

[표: 묶음 — 크기](avatar-stack.yaml#size)

[표: 묶음 — 공통](avatar-stack.yaml#base.enabled)

[표: 묶음 — 바탕](avatar-stack.yaml#surface)

### State

상태는 `enabled` 하나입니다 — 아바타 · 묶음은 누르지 않습니다. 누르면 무언가 되는 자리(프로필 열기)는 아바타를 감싼 버튼 · 링크가 누름 · 포커스를 가집니다.

## Guidelines

### 사람만 아바타 — 물건은 타일

아바타는 사람(본인 · 더치페이 참가자 · 공유 멤버 · HR 구성원)에만 씁니다. 은행 · 증권 · 카드 · 코인 · 금 · 회사처럼 물건을 보이는 것은 [Logo Tile](logo-tile.md), 카테고리처럼 분류를 보이는 것은 [List](list.md) 의 타일입니다 — 둘 다 각진 타일이고, 원 아바타로 그리지 않습니다. 첫 글자 · 이름 색은 Logo Tile 도 이 규칙을 씁니다.

[그림: 사람은 원 아바타, 자산 · 카테고리는 각진 타일](../../site/components/specs/avatar.tsx#thing-guide)

### 자리마다 대표 크기

같은 자리는 같은 크기입니다 — 더치페이 참가자 줄이 화면마다 28 · 32 · 36 · 40 으로 갈리지 않게 위 표의 대표 크기를 씁니다. 목록 줄은 한 줄이면 36, 이름 + 설명 두 줄이면 42 입니다.

[그림: 한 화면의 같은 자리 — 크기를 맞춘다 · 섞는다](../../site/components/specs/avatar.tsx#size-guide)

### 이름 옆이면 장식, 혼자면 이름

아바타 옆에는 대개 이름이 있습니다 — 그때 아바타는 장식이라 보조 기술에 숨깁니다(이름을 한 번만 읽습니다 — "김 김민수" 가 아닙니다). 이름 없이 아바타만 있으면(접힌 사이드바 · 묶음) 아바타가 이름을 가집니다.

[그림: 이름 옆 아바타는 숨김 · 혼자인 아바타는 이름](../../site/components/specs/avatar.tsx#name-guide)

### 같은 사람은 같은 색, 흐리게 하지 않습니다

이름 색은 규칙으로만 정합니다 — 화면 · 플랫폼이 따로 해시를 두지 않습니다. 상태(안 낸 사람 · 나간 사람)는 아바타를 흐리게(불투명도) 하지 않고 이름 옆 글 · [Badge](badge.md) 로 알립니다(기초 원칙 — 불투명도로 흐리지 않는다).

[그림: 같은 이름은 웹 · 앱이 같은 색 · 상태는 배지로, 흐리지 않는다](../../site/components/specs/avatar.tsx#color-guide)

### 묶음은 넷까지 + "+N"

묶음에는 앞 4명까지 보이고 나머지는 "+N" 원입니다. 묶음 옆에는 전체 수를 글로 둡니다("6명 · 412,000원") — 그러면 묶음은 장식입니다. 묶음만 있으면 묶음이 이름을 가집니다("참여자 6명: 김민수, 이서연, 박지훈, 최유진 외 2명").

[그림: 앞 4명 + "+2" · 옆에 "6명"](../../site/components/specs/avatar.tsx#stack-guide)

### 폭이 모자라면 보이는 사람을 줄입니다

큰 묶음(80 ~ 108)은 앞 4명 + "+N" 이 폰 폭을 넘습니다(108 이면 432). 묶음은 자기가 차지할 수 있는 폭 W 를 재서, 원 c 개의 폭 = 지름 + (c − 1) × (지름 − 겹침) 으로 셉니다 — 모두(4명 이하)가 W 에 들면 모두 보이고, 아니면 "+N" 원까지 W 에 드는 원 수 c = 1 + ⌊(W − 지름) ÷ (지름 − 겹침)⌋ 에서 하나를 뺀 사람(4명까지 · 가장 적어도 1명)이 보입니다. 108 · 6명 · 폰 안쪽 312 면 2명 + "+4"(폭 270)입니다. 크기는 줄이지 않습니다 — 1명 + "+N" 도 넘치면 작은 크기를 씁니다. 폰 안쪽 312 에서 64 까지는 늘 앞 4명입니다.

폭이 바뀌면(창 크기 · 화면 돌림) 다시 셉니다 — 웹은 ResizeObserver, 앱은 LayoutBuilder. 그래서 같은 묶음도 폭마다 보이는 사람이 다르고, 묶음 이름의 "외 N명" 도 보이는 "+N" 과 같게 바뀝니다("참여자 6명: 김민수, 이서연 외 4명").

[그림: 폭에 맞춘 묶음 — 108 은 2명 + "+4" · 48 은 앞 4명 + "+2" · 폭을 보지 않은 108](../../site/components/specs/avatar.tsx#stack-fit)

### 사진 바꾸기 — 늘 보이는 버튼

프로필 사진을 바꾸는 자리(HR 직원 정보 수정 — 108)는 아바타 아래 16 에 버튼 둘을 늘 보입니다 — "사진 바꾸기"([Button](button.md) `neutralWeak` small) · "사진 지우기"(`ghost` small, 사진이 있을 때만 — 지우면 이니셜). 마우스를 올려야 나타나는 덮개는 두지 않습니다 — 키보드 · 터치 · 화면 읽기로 닿지 않기 때문입니다. 올리는 중에는 아바타 위 딤(라이트 50% · 다크 65%) 가운데 값 있는 원 24(`staticWhite` — [Progress Circle](progress-circle.md) "올리기 · 받기")를 두고 두 버튼을 막습니다. 실패는 [Field](field.md) 의 오류 글로 그 자리에 알립니다("5MB 넘는 사진은 올릴 수 없어요.") — 성공을 따로 알리지 않습니다(사진이 바뀐 것이 보입니다). 앱의 "사진 바꾸기" 는 [Menu Sheet](menu-sheet.md)(사진 찍기 · 앨범에서 고르기)를 엽니다. 여럿 · 파일을 붙이는 자리는 [Attachment Input](attachment-input.md) 입니다.

[그림: HR 사용자 수정 — 108 + "사진 바꾸기" · "사진 지우기" · 올리는 중(딤 + 원 24, 버튼 막힘) · 실패(오류 글) · 사진 없음(이니셜 + "사진 바꾸기" 하나)](../../site/components/specs/avatar.tsx#photo-guide)

[표: 사진 바꾸기 자리](avatar.yaml#matrix.edit.photo@uploadOverlay+editActions)

## 코드

레시피 `recipes/shadcn/components/ui/avatar.tsx` 를 씁니다 — `Avatar` · `AvatarStack` 과 규칙 함수 `avatarInitial(name)`(이니셜) · `avatarHue(name)`(이름 색 — `"blue"` … `"gray"`). `Avatar` 는 `name`(필수 — 이니셜 · 이름 색 · 이름) · `src`(사진, 없으면 이니셜) · `size`(`20` · `24` · `36` · `42` · `48` · `56` · `64` · `80` · `96` · `108`, 기본 `48` — 자리마다 고릅니다) · `decorative`(기본 `true` — 옆에 이름이 있을 때. `false` 면 이름을 읽습니다) · `uploadProgress`(0 ~ 1 — 주면 원 위 딤 + 값 있는 원 24 `staticWhite`, 이름 "프로필 사진 올리는 중" · 값 글 "40%")를 받습니다. `AvatarStack` 은 `size`(안의 아바타가 따릅니다 — 기본 `24`) · `max`(기본 4) · `surface`(링 색 — `"default"` 기본 · `"floating"`) · `aria-label`(주면 묶음을 그림 하나로 읽고, 없으면 장식으로 숨깁니다)을 받습니다. 앱은 같은 규칙 함수를 Dart 로 두고 아래 예시 이름으로 같은 답이 나오는지 시험합니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 이름 옆 — 장식

[그림: 더치페이 참가자 줄 — 36 · 이니셜 + 이름 색](../../site/components/specs/avatar.tsx#ex-row)

```tsx
import { Avatar } from "@/components/ui/avatar"

<span className="flex items-center gap-x3">
  <Avatar size={36} name={p.name} src={p.photoUrl} />
  <span>{p.name}</span>
</span>
```

### 혼자 — 이름을 읽습니다

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
| 사진을 불러오는 동안 | 이니셜이 보이고, 사진이 오면 덮습니다(스켈레톤을 따로 두지 않습니다) |
| 사진을 불러오지 못함 · 사진 없음 | 이니셜 그대로 — 깨진 그림 · 빈 원이 보이지 않습니다 |
| 이름이 바뀜 | 이니셜 · 이름 색이 규칙대로 바로 바뀝니다 |
| 묶음 인원이 바뀜 | 앞 4명 · "+N" 을 다시 셉니다 |
| 묶음이 놓인 폭이 바뀜 | 폭에 드는 사람 수 · "+N" · 묶음 이름의 "외 N명" 을 다시 셉니다(크기는 그대로) |
| 누르기 | 아바타 · 묶음 자체는 누르지 않습니다 — 감싼 버튼 · 링크의 동작 |
| 사진 바꾸기 · 사진 지우기 | 버튼이 늘 보입니다 — "사진 바꾸기" 는 고르기 창(앱은 메뉴 시트), "사진 지우기" 는 이니셜로. 올리는 동안 아바타 위 딤 + 값 있는 원 24 · 두 버튼 막힘, 실패는 Field 오류 글 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이니셜 `fg-neutral-inverted` on 차트 10색 — 라이트 4.55(yellow) ~ 5.50, 다크 6.07 ~ 7.70 ✓(다크에서 흰 글자는 1.88 ~ 2.39 라 쓰지 않습니다). "+N" `fg-neutral-muted` on `bg-neutral-weak` 6.58 · 5.93 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 1px 테두리 · 바탕색 링은 장식입니다(사진 · 이니셜이 사람을 알립니다). 이니셜 원은 흰 표면과 4.55 이상 |
| **WCAG 1.1.1** Non-text Content | 이름 옆 아바타는 장식(`aria-hidden`, 사진 `alt=""`) — 이름을 한 번만 읽습니다. 혼자인 아바타는 `role="img"` + 이름(`aria-label="김민수"`), 사진 실패 · 이니셜이어도 같은 이름 |
| **WCAG 1.4.1** Use of color | 이름 색은 뜻이 없습니다 — 상태 · 역할은 글 · 배지로 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않습니다. 감싼 버튼은 그 버튼의 규칙(20 · 24 아바타를 누르게 하려면 누르는 영역을 44 로) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않습니다. 사진 바꾸기 버튼은 Button small 36 · 누르는 영역 44 ✓ |
| **WCAG 2.1.1** Keyboard | 사진 바꾸기 · 지우기는 늘 보이는 버튼이라 `Tab` · `Enter` 로 닿습니다 — 마우스를 올려야 나타나는 덮개를 두지 않습니다 ✓ |
| **ARIA** | 묶음은 `aria-label` 이 있으면 `role="img"` 하나("참여자 6명: 김민수, 이서연, 박지훈, 최유진 외 2명" — 폭에 맞춰 사람을 줄이면 이름도 보이는 사람 + "외 N명"), 없으면 `aria-hidden`(옆 글이 수를 말합니다). 안의 아바타 · "+N" 은 따로 읽지 않습니다 |

## Do / Don't

### ✅ Do

- 사진이 있으면 사진, 없으면 이니셜 + 이름 색.
- 같은 자리는 같은 크기 — 10단계 안에서.
- 이름 옆 아바타는 장식으로 숨깁니다.
- 묶음은 앞 4명 + "+N", 옆에 전체 수를 글로 둡니다.
- 사진을 바꾸는 자리는 아바타 아래 늘 보이는 "사진 바꾸기" · "사진 지우기" 를 둡니다.

### ❌ Don't

- 자산 · 카드 · 카테고리를 원 아바타로.
- 화면 · 플랫폼마다 다른 해시 · 다른 색 순서.
- 브랜드 채움 · 회색 한 색 이니셜, 이니셜 두 글자("Ki").
- 아바타를 흐리게 해서 상태 알리기.
- 다크에서 차트 색 위 흰 이니셜.
- 사진 바꾸기를 마우스를 올려야 나타나는 덮개에만 두기.
- 아바타 오른쪽 아래에 배지(원 · 방패 · 꽃 모양)를 겹치기.

## Specification

`avatar.yaml` · `avatar-stack.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Avatar 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — avatar.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#avatar)

[그림: Specification — avatar-stack.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#avatar-stack)
