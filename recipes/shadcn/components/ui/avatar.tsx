import * as React from "react";

import { cn } from "@/lib/utils";
import { ProgressCircle } from "@/components/ui/progress-circle";

/*
 * Groo Avatar — 구조는 SEED Avatar · Avatar Stack(2026-10-03). 수치 원본은 specs/components/avatar.yaml · avatar-stack.yaml.
 *
 *   Avatar         사람 한 명을 보이는 원 — 사진(src)이 있으면 사진, 없거나 · 불러오는 동안 · 못 불러오면 이니셜 + 이름 색
 *   AvatarStack    여러 사람 — 겹친 묶음. 앞 max(기본 4)명 + 끝에 "+N" 원
 *   avatarInitial  이니셜 — 표시 이름(앞뒤 공백만 뺀 글)의 첫 글자 하나(사용자가 보는 글자 단위 — Intl.Segmenter). 로마자는
 *                  대문자로, 한글 · 숫자 · 그림 글자는 그대로. "김민수" → "김", "Kim Minsu" → "K"
 *   avatarHue      이름 색 — 표시 이름의 유니코드 코드 포인트(UTF-16 단위가 아니다) 합 % 10 → 차트 10색(v110 순서)
 *                  blue · green · orange · violet · pink · indigo · red · yellow · brown · gray.
 *                  "김민수" 142420 → blue · "이서연" 151168 → brown · "Kim Minsu" 845 → indigo. 이름이 비면 gray(글자 없음)
 *                  앱은 같은 규칙을 Dart 로 두고(characters.first · runes) 이 예시 이름으로 같은 답이 나오는지 시험한다.
 *                  물건(은행 · 증권 · 카드 · 코인 · 금 · 회사)의 Logo Tile 도 이 두 함수로 첫 글자 · 이름 색을 고른다(logo-tile.tsx)
 *
 * 크기 10단계 — 20 · 24 · 36 · 42 · 48(기본) · 56 · 64 · 80 · 96 · 108. 자리마다 대표 크기를 쓴다(한 줄 목록 36 · 두 줄 42 ·
 * 줄 안 묶음 24 · Desk 계정 머리 80 · HR 큰 사진 96 · 사진 수정 108). 이 밖의 크기를 만들지 않는다.
 * 모든 크기에 1px 안쪽 투명 테두리 stroke-neutral-overlay(v118 — 검정 4.7% · 다크 흰 5%, SEED stroke.neutral-subtle 의 값) —
 * ::after 로 사진 · 이니셜 위에 겹친다(크기가 변하지 않는다). 흰 사진이 흰 바탕에 묻히지 않고, 어두운 사진 · 이니셜 원 둘레에는
 * 옅은 테가 생기지 않는다. Image Frame · Logo Tile 의 윤곽과 같은 색이다.
 * 이니셜은 이름 색(chart-{색} — 라이트 700 · 다크 800-dark) 바탕에 fg-neutral-inverted(라이트 흰 · 다크 짙은 글자 — 다크에서
 * 흰 글자는 1.88 ~ 2.39 라 쓰지 않는다) · 700 · 줄 높이 1, 글자는 지름의 40%(가장 작아도 10)이고 글자 크기 설정을 따르지 않는
 * px 다(원 안에서 넘치지 않게). 사람 그림 · 회색 한 색 · 브랜드 채움 · 두 글자 이니셜은 쓰지 않는다.
 * 이니셜이 먼저 그려지고 사진이 오면 덮는다(다 불러오면 이니셜을 걷는다 — 스켈레톤을 따로 두지 않는다). 사진을 못 불러오면
 * 이니셜 그대로라 깨진 그림 · 빈 원이 보이지 않는다. 이름이 바뀌면 이니셜 · 이름 색이 바로 바뀐다.
 *
 * 묶음 — 다음 아바타가 지름의 약 1/4(−5 ~ −27) 왼쪽으로 겹치고, 놓인 바탕색 링(바깥 box-shadow 1 ~ 5)으로 앞 아바타를 끊는다.
 * 뒤에 오는 아바타가 위에 그려진다. 크기는 묶음이 정하고 안의 아바타가 모두 따른다(기본 24 — 한 묶음 안에서 크기를 섞지 않는다).
 * 링 색은 놓인 바탕 — surface="default"(기본, bg-layer-default) · "floating"(시트 · 대화상자 · 팝오버 안, bg-layer-floating —
 * 다크에서 두 바탕이 다르다). max 를 넘으면 앞 max 명 + "+N" 원 — 같은 크기 · 같은 링 · bg-neutral-weak + fg-neutral-muted ·
 * 700, 글자는 지름의 36%(가장 작아도 10). N = 전체 − max, 99 를 넘으면 "+99". 인원이 바뀌면 다시 센다.
 *
 * 이름 — 아바타 옆에는 대개 이름이 있다. decorative(기본 true)면 아바타를 보조 기술에 숨긴다(이름을 한 번만 읽는다 —
 * "김 김민수" 가 아니다). 이름 없이 아바타만 있으면(접힌 사이드바 · 큰 프로필 사진) decorative={false} — role="img" +
 * aria-label={이름}(사진 실패 · 이니셜이어도 같은 이름). 사진의 alt 는 늘 "" 다.
 * 묶음은 aria-label(또는 aria-labelledby)을 주면 role="img" 하나로 읽고("참여자 6명: 김민수, 이서연, 박지훈, 최유진 외 2명"),
 * 없으면 aria-hidden — 묶음 옆 글이 수를 말한다("6명 · 412,000원"). 안의 아바타 · "+N" 은 따로 읽지 않는다.
 * 누르지 않는다 — 누르는 자리(프로필 열기)는 감싼 버튼 · 링크가 누름 · 포커스를 가진다(20 · 24 를 누르게 하려면 누르는 영역 44).
 * 상태(안 낸 사람 · 나간 사람)는 아바타를 흐리게 하지 않고 이름 옆 글 · Badge 로 알린다(v106).
 *
 * 사진 바꾸기 자리(2026-10-15 마무리 6A — avatar.yaml edit photo) — 아바타 아래 16 에 늘 보이는 버튼 둘("사진 바꾸기" Button neutralWeak small ·
 * "사진 지우기" ghost small, 사진이 있을 때만 — 사이 8 · 가운데)을 쓰는 쪽이 둔다(마우스를 올려야 나타나는 덮개를 두지 않는다).
 * uploadProgress(0 ~ 1)를 주면 올리는 중이다 — 원 위 딤(overlay-dim 라이트 0.50 · 다크 0.65) 가운데 값 있는 원 24(Progress Circle
 * staticWhite · 이름 "프로필 사진 올리는 중" · 값 글 "40%"). 올리는 동안은 아바타를 보조 기술에 숨기지 않는다 — role="img" 는 안의
 * 진행 원을 읽지 않으므로 이름이 있으면 role="group" + 이름으로 바꾼다. 두 버튼을 막는 것 · 실패를 Field 오류 글로 알리는 것은 쓰는 쪽이 한다.
 */

const AVATAR_HUES = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown", "gray"] as const;
export type AvatarHue = (typeof AVATAR_HUES)[number];
export type AvatarSize = 20 | 24 | 36 | 42 | 48 | 56 | 64 | 80 | 96 | 108;

// 표시 이름 — 서버가 준 이름에서 앞뒤 공백만 뺀다(정규화 · 바꾸기를 하지 않는다)
const displayName = (name: string) => name.trim();

const graphemes =
  typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

/** 이니셜 — 표시 이름의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자. 이름이 비면 "" */
function avatarInitial(name: string): string {
  const shown = displayName(name);
  if (shown === "") return "";
  const first = graphemes ? (graphemes.segment(shown)[Symbol.iterator]().next().value?.segment ?? "") : (Array.from(shown)[0] ?? "");
  return first.toUpperCase();
}

/** 이름 색 — 표시 이름의 유니코드 코드 포인트 합 % 10 → 차트 10색(v110 순서). 이름이 비면 gray */
function avatarHue(name: string): AvatarHue {
  const shown = displayName(name);
  if (shown === "") return "gray";
  let sum = 0;
  for (const ch of shown) sum += ch.codePointAt(0) ?? 0;
  return AVATAR_HUES[sum % 10] ?? "gray";
}

// ── 아바타 ───────────────────────────────────────────────────
// 원 — 사진 · 이니셜을 원으로 자른다. ::after 가 1px 안쪽 투명 테두리(사진 · 이니셜 위)
const ROOT = [
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full align-middle",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
].join(" ");

// 이니셜 — 이름 색 바탕 · fg-neutral-inverted · 700 · 줄 높이 1(px — 글자 크기 설정을 따르지 않는다).
// 줄 높이는 크기의 글자 뒤에 붙인다 — tailwind-merge 는 뒤에 오는 글자 크기가 줄 높이를 지운다고 본다
const INITIAL = "flex size-full items-center justify-center font-sans font-bold uppercase text-fg-neutral-inverted";
const LINE_HEIGHT_1 = "leading-none";
const HUE_BG: Record<AvatarHue, string> = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  orange: "bg-chart-orange",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  indigo: "bg-chart-indigo",
  red: "bg-chart-red",
  yellow: "bg-chart-yellow",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};

const IMAGE = "absolute inset-0 size-full object-cover";

// 올리는 중 — 원 위 딤(라이트 0.50 · 다크 0.65) 가운데 값 있는 원 24(staticWhite). 1px 테두리(::after)는 이 위에 그려진다
const UPLOAD = "absolute inset-0 flex items-center justify-center rounded-full bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]";

// 크기 — 지름 · 이니셜 글자(지름의 40%, 가장 작아도 10). Tailwind 는 소스의 글자 그대로를 읽으므로 크기마다 다 적는다
const SIZES: Record<AvatarSize, { box: string; initial: string }> = {
  20: { box: "size-[20px]", initial: "text-[10px]" },
  24: { box: "size-[24px]", initial: "text-[10px]" },
  36: { box: "size-[36px]", initial: "text-[14px]" },
  42: { box: "size-[42px]", initial: "text-[17px]" },
  48: { box: "size-[48px]", initial: "text-[19px]" },
  56: { box: "size-[56px]", initial: "text-[22px]" },
  64: { box: "size-[64px]", initial: "text-[26px]" },
  80: { box: "size-[80px]", initial: "text-[32px]" },
  96: { box: "size-[96px]", initial: "text-[38px]" },
  108: { box: "size-[108px]", initial: "text-[43px]" },
};

type ImageStatus = "loading" | "loaded" | "error";

// 사진 상태 — src 가 바뀌면 다시 loading. 붙기 전에 이미 끝난 사진(서버에서 그린 뒤 붙을 때)은 붙자마자 complete 로 읽는다 —
// 크기가 없는 사진(SVG)도 0 으로 읽히므로 0 이면 decode 로 가른다
function useImageStatus(src: string | undefined) {
  const [state, setState] = React.useState<{ src?: string; status: ImageStatus }>({ src, status: "loading" });
  const status: ImageStatus = state.src === src ? state.status : "loading";
  const set = React.useCallback((next: ImageStatus) => setState({ src, status: next }), [src]);
  const ref = React.useCallback(
    (img: HTMLImageElement | null) => {
      if (!img?.complete) return;
      if (img.naturalWidth > 0) set("loaded");
      else img.decode().then(() => set("loaded"), () => set("error"));
    },
    [set],
  );
  return { status, set, ref };
}

type AvatarStackContextValue = { size: AvatarSize };
const AvatarStackContext = React.createContext<AvatarStackContextValue | null>(null);

// 묶음 안 — 놓인 바탕색 링(바깥 box-shadow, 두께 · 색은 묶음이 정한다)
const STACK_RING = "shadow-[0_0_0_var(--avatar-stack-ring-width)_var(--avatar-stack-ring-color)]";

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** 이름(필수) — 이니셜 · 이름 색 · 보조 기술이 읽는 이름(decorative={false}) */
  name: string;
  /** 사진 — 없으면(undefined · null · "") 이니셜 */
  src?: string | null;
  /** 지름 — 기본 48. 자리마다 대표 크기를 고른다. 묶음 안에서는 묶음의 크기를 따른다 */
  size?: AvatarSize;
  /** 기본 true — 옆에 이름이 있을 때(보조 기술에 숨긴다). false 면 role="img" + 이름 */
  decorative?: boolean;
  /** 사진 바꾸기 자리에서 올리는 중 — 0 ~ 1. 주면 원 위 딤 + 값 있는 원 24(staticWhite, "프로필 사진 올리는 중" · "40%") */
  uploadProgress?: number;
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, name, src, size: sizeProp = 48, decorative = true, uploadProgress, ...props }, ref) => {
    const stack = React.useContext(AvatarStackContext);
    const size = stack?.size ?? sizeProp;
    const shown = displayName(name);
    const photo = src != null && src !== "" ? src : undefined;
    const image = useImageStatus(photo);
    // 묶음 안의 아바타는 따로 읽지 않는다 — 묶음이 이름을 가진다
    const hidden = decorative || stack != null;
    // 올리는 중 — 진행 원을 읽히게 숨기지 않는다(role="img" 는 안을 읽지 않는다)
    const uploading = typeof uploadProgress === "number" && Number.isFinite(uploadProgress);
    const percent = uploading ? Math.round(Math.min(Math.max(uploadProgress, 0), 1) * 100) : 0;
    return (
      <span
        ref={ref}
        data-slot="avatar"
        data-status={photo ? image.status : "none"}
        data-uploading={uploading || undefined}
        role={hidden ? undefined : uploading ? "group" : "img"}
        aria-label={hidden ? undefined : shown}
        aria-hidden={(hidden && !uploading) || undefined}
        className={cn(ROOT, SIZES[size].box, stack && STACK_RING, className)}
        {...props}
      >
        {image.status !== "loaded" || !photo ? (
          <span aria-hidden data-slot="avatar-initial" className={cn(INITIAL, HUE_BG[avatarHue(shown)], SIZES[size].initial, LINE_HEIGHT_1)}>
            {avatarInitial(shown)}
          </span>
        ) : null}
        {photo && image.status !== "error" && (
          <img
            key={photo}
            ref={image.ref}
            data-slot="avatar-image"
            src={photo}
            alt=""
            className={IMAGE}
            onLoad={() => image.set("loaded")}
            onError={() => image.set("error")}
          />
        )}
        {uploading && (
          <span data-slot="avatar-upload" className={UPLOAD}>
            <ProgressCircle size="24" tone="staticWhite" value={percent} aria-label="프로필 사진 올리는 중" />
          </span>
        )}
      </span>
    );
  },
);
Avatar.displayName = "Avatar";

// ── 묶음 ─────────────────────────────────────────────────────
// 겹침 = 다음 아바타의 왼쪽 바깥 여백(음수, 지름의 약 1/4) · 링 두께. 크기마다 다 적는다
const STACK_SIZES: Record<AvatarSize, { root: string; overflow: string }> = {
  20: { root: "[--avatar-stack-ring-width:1px] [&>*+*]:-ml-[5px]", overflow: "size-[20px] text-[10px]" },
  24: { root: "[--avatar-stack-ring-width:1px] [&>*+*]:-ml-[6px]", overflow: "size-[24px] text-[10px]" },
  36: { root: "[--avatar-stack-ring-width:2px] [&>*+*]:-ml-[8px]", overflow: "size-[36px] text-[13px]" },
  42: { root: "[--avatar-stack-ring-width:2px] [&>*+*]:-ml-[10px]", overflow: "size-[42px] text-[15px]" },
  48: { root: "[--avatar-stack-ring-width:2px] [&>*+*]:-ml-[12px]", overflow: "size-[48px] text-[17px]" },
  56: { root: "[--avatar-stack-ring-width:3px] [&>*+*]:-ml-[13px]", overflow: "size-[56px] text-[20px]" },
  64: { root: "[--avatar-stack-ring-width:3px] [&>*+*]:-ml-[16px]", overflow: "size-[64px] text-[23px]" },
  80: { root: "[--avatar-stack-ring-width:4px] [&>*+*]:-ml-[20px]", overflow: "size-[80px] text-[29px]" },
  96: { root: "[--avatar-stack-ring-width:5px] [&>*+*]:-ml-[24px]", overflow: "size-[96px] text-[35px]" },
  108: { root: "[--avatar-stack-ring-width:5px] [&>*+*]:-ml-[27px]", overflow: "size-[108px] text-[39px]" },
};

const STACK = "inline-flex shrink-0 items-center align-middle";
const STACK_SURFACE = {
  default: "[--avatar-stack-ring-color:var(--color-bg-layer-default)]",
  floating: "[--avatar-stack-ring-color:var(--color-bg-layer-floating)]",
} as const;

// "+N" 원 — 아바타와 같은 크기 · 같은 링, 옅은 면 + 숫자(글자 크기 설정을 따르지 않는 px)
const OVERFLOW = cn(
  "relative inline-flex shrink-0 select-none items-center justify-center rounded-full bg-bg-neutral-weak font-sans font-bold text-fg-neutral-muted",
  STACK_RING,
);

export interface AvatarStackProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 지름 — 기본 24. 안의 아바타가 모두 따른다 */
  size?: AvatarSize;
  /** 보이는 사람 수 — 기본 4. 넘치면 앞 max 명 + "+N" */
  max?: number;
  /** 링 색 = 놓인 바탕 — default(기본, bg-layer-default) · floating(시트 · 대화상자 · 팝오버 안) */
  surface?: keyof typeof STACK_SURFACE;
}

const AvatarStack = React.forwardRef<HTMLSpanElement, AvatarStackProps>(
  ({ className, size = 24, max = 4, surface = "default", children, ...props }, ref) => {
    const context = React.useMemo(() => ({ size }), [size]);
    const people = React.Children.toArray(children).filter(React.isValidElement);
    const limit = Math.max(1, Math.floor(max));
    const shown = people.slice(0, limit);
    const rest = people.length - shown.length;
    const named = props["aria-label"] != null || props["aria-labelledby"] != null;
    return (
      <AvatarStackContext.Provider value={context}>
        <span
          ref={ref}
          data-slot="avatar-stack"
          role={named ? "img" : undefined}
          aria-hidden={named ? undefined : true}
          className={cn(STACK, STACK_SIZES[size].root, STACK_SURFACE[surface], className)}
          {...props}
        >
          {shown}
          {rest > 0 && (
            <span aria-hidden data-slot="avatar-stack-overflow" className={cn(OVERFLOW, STACK_SIZES[size].overflow, LINE_HEIGHT_1)}>
              +{Math.min(rest, 99)}
            </span>
          )}
        </span>
      </AvatarStackContext.Provider>
    );
  },
);
AvatarStack.displayName = "AvatarStack";

export { Avatar, AvatarStack, avatarInitial, avatarHue };
