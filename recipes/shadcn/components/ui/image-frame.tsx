import * as React from "react";
import { cva } from "class-variance-authority";
import { CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import { institutionColor, type InstitutionColor } from "@/lib/institution-colors";
import { aspectRatioVariants, type AspectRatioValue } from "@/components/ui/aspect-ratio";
import { avatarInitial } from "@/components/ui/avatar";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";
import { LOADING_TIMING, Skeleton } from "@/components/ui/skeleton";

/*
 * Groo Image Frame — 구조는 SEED Image Frame(2026-10-04). 수치 원본은 specs/components/image-frame.yaml(틀) · card-art.yaml(카드 그림 ·
 * 카드 면), 카드 면의 색은 institution-colors.yaml(lib/institution-colors.ts). 옛 Aspect Ratio + 손으로 짠 그림 틀을 대신한다.
 *
 *   ImageFrame           그림 한 장을 보이는 틀 — 비율 상자에 그림을 꽉 채우고(cover) 그림 위에 안쪽 1px 투명 윤곽을 늘 그린다.
 *                        불러오는 동안은 같은 모서리의 Skeleton, 없거나 · 못 불러오거나 · 10초가 지나도 안 오면 대체 그림(Content Placeholder)
 *     src                그림 — 없으면(undefined · null · "") 처음부터 대체 그림
 *     alt                필수 — 이름 옆 그림 · 장식 그림은 "", 혼자인 그림은 무엇인지. 대체 그림이 이 글을 이름으로 이어받는다
 *     ratio              "1:1" · "2:1" · "16:9" · "4:3"(기본) · "6:7" · "4:5" · "2:3" · "card"(1.586 — 세로 그림은 돌린다). Aspect Ratio 와 같은 여덟
 *     width              고정 폭(px — 목록 · 썸네일) — 모서리를 고른다. 없으면 부모 폭을 채우고 모서리 8
 *     bleed              화면 폭 — 좌우가 화면 끝에 닿는 그림, 모서리 0(윤곽은 그대로)
 *     fit                "cover"(기본 — 사진 · 카드 그림, 가운데를 남겨 자른다) · "contain"(로고 · 글이 든 그림 — 잘리지 않게, 둘레는 흰 판)
 *     fallbackIcon       대체 그림 아이콘 — 기본 ImageIcon(Content Placeholder)
 *     fallback           대체 그림을 통째로 바꿀 때(CardArt 가 카드 면을 넣는다)
 *     loading            "lazy"(기본 — 화면에 들어올 때 받는다) · "eager"(첫 화면의 큰 그림)
 *     srcSet · sizes     img 그대로
 *     children           ImageFrameFloater 둘까지. 그 밖은 바깥 div 속성
 *   ImageFrameFloater    그림 위 자리 — placement(필수) "top-start" · "top-end" · "bottom-start" · "bottom-end", 틀 가장자리에서 6
 *   ImageFrameIndicator  장수 · 길이 글 — 보이는 글(children — "1 / 12" · "+9")과 읽는 글(label, 필수 — "사진 12장 중 1번째")
 *   CardArt              카드 그림 — ratio card 의 Image Frame. 그림이 없거나 실패하면 아는 카드사는 카드 면, 모르는 카드사는 대체 그림(credit-card)
 *   imageFrameRadius     폭 → 모서리 "4" · "6" · "8" — 틀 밖에서 같은 모서리가 필요할 때(Skeleton 의 radius)
 *
 * 틀 — 폭은 부르는 쪽, 높이는 폭 ÷ 비율(CSS aspect-ratio)이라 그림이 오기 전에 자리를 잡는다. 모서리로 그림 · 스켈레톤 · 대체 그림을
 *   자르고(overflow hidden) 안의 층을 따로 쌓는다(isolation). 부모보다 넓어지지 않는다(max-width 100%). 틀이 크기 컨테이너
 *   (container image-frame)라 카드 면의 크기 · 그림 위 자리가 틀의 폭 · 높이로 갈린다.
 * 모서리 — 폭으로 고른다(SEED): 24 이하 4(radius-r1) · 48 이하 6(radius-r1_5) · 그 위 8(radius-r2) · 화면 폭 0. 작은 그림일수록
 *   줄인다(24 에 8 이면 알약처럼 보인다). 불러오는 동안 · 대체 그림도 같은 모서리다(틀이 자른다).
 * 윤곽 — 안쪽 1px stroke-neutral-overlay(v118 — 검정 4.7% · 다크 흰 5%), ::after 로 그림 · 스켈레톤 · 대체 그림 · 카드 면 위에 늘
 *   그린다(inset box-shadow — 크기가 변하지 않고 누르기를 막지 않는다). 흰 그림은 흰 바탕 위 1.11 로 잡히고 어두운 그림 위에서는
 *   보이지 않는다. 끄는 속성이 없다.
 * 그림 — 틀을 채운다(cover). contain 이면 잘리지 않게 넣고 둘레는 흰 판(static-white — 두 모드 같다, 그림의 바탕으로 칠한다).
 *   ratio card 에서 그림의 원래 폭이 높이보다 작으면(세로 카드) 시계 방향으로 90° 돌린다 — 그림 상자를 틀의 높이 × 폭으로 잡아
 *   가운데에 두고 돌린 뒤 cover 로 채운다(카드 전체가 거의 그대로 들어간다). 방향은 다 받은 뒤 원래 크기로 정하고, 그때까지는
 *   스켈레톤이다(돌기 전 모습이 보이지 않는다). 가로 · 정사각 그림은 그대로다.
 * 상태 — loading · loaded · fallback(data-state)
 *   loading   스켈레톤(면 bg-neutral-weak + 반짝임 — 화면의 다른 스켈레톤과 한 박자, 모션 줄이기면 멈춘다). 그림은 받는 동안 투명도 0
 *   loaded    스켈레톤을 걷고 그림이 투명도로 나타난다(motion-duration-d3 150ms · motion-ease-enter, 모션 줄이기면 바로 — 토큰
 *             키프레임 fade-in). 처음부터 받아 둔 그림(붙을 때 이미 다 받았다)은 그대로 보인다 — 스켈레톤이 보인 적이 없다
 *   fallback  그림이 없음 · 못 불러옴 · 10초(Skeleton 의 요청 제한 LOADING_TIMING.timeout)가 지나도 안 옴 — 대체 그림(옅은 면 +
 *             틀 높이의 50% 선 아이콘). img 를 걷어 깨진 그림 아이콘 · alt 글이 보이지 않는다. 10초는 틀이 화면에 들어온 때부터 잰다 —
 *             lazy 그림은 화면 가까이 와야 받기 시작하므로, 붙은 때부터 재면 아래쪽 그림이 보기도 전에 실패로 바뀐다.
 *             실패로 바뀐 뒤에는 그림이 와도 다시 바꾸지 않는다(화면이 다시 튀지 않게 — 다음에 열 때 다시 받는다)
 * 그림 위 요소 — 네 모서리(위 시작 · 위 끝 · 아래 시작 · 아래 끝)에 하나씩, 틀 하나에 둘까지, 틀 가장자리에서 6(spacing-x1_5).
 *   틀의 짧은 변이 80 이상일 때만 그린다(container query) — 그보다 작은 틀(목록 56 · 썸네일 40)은 배지 · 장수를 줄의 글로 둔다.
 *   얹는 것은 배지(Badge variant="solid" — 상태 · 분류)와 Indicator(장수 · 길이) 둘이다. 셋째 · 같은 자리의 둘째는 그리지 않는다
 *   (개발 중에 알린다). 그림 위 요소는 누르지 않는다(pointer-events none — 누르는 자리는 감싼 버튼 · 링크).
 * Indicator — 알약 · 바탕 overlay-dim-dark(검정 65% — 두 모드 같다, 그림은 모드를 따르지 않는다) · static-white · t1 11/15 500 ·
 *   좌우 6 · 위아래 2 · 높이 19(글이 커지면 따라 커진다). 흰 그림 위에서도 흰 글자가 7.00:1 이다. 보이는 글은 aria-hidden, label 을 숨은 글로 읽는다.
 *
 * 카드 그림(CardArt) — 그림이 있으면 그림(세로는 돌린다), 없거나 실패하면 카드사(issuer)로 가른다
 *   아는 카드사(기관 색 표에 있다 — institutionColor) — 카드 면: 기관 색 한 색(모드를 따르지 않는다) + 표의 글자색(white =
 *     static-white, dark = 라이트 fg-neutral · 다크 fg-neutral-inverted). 광택 띠 · 그라디언트가 없다. 면의 크기는 틀의 폭으로
 *     small(96 미만 — 회사 첫 글자만 가운데, 면 높이의 40% · 가장 작아도 10 · 700 · 줄 높이 1 · 로마자 대문자) ·
 *     medium(96 ~ 239 — 왼쪽 아래 회사 t2 500 한 줄 말줄임 · 카드 이름 t4 700 두 줄까지(단어 단위) · 좌우 10 · 아래 8) ·
 *     large(240 이상 — 회사 t3 · 카드 이름 t5 · 좌우 16 · 아래 14)
 *   모르는 카드사 — 대체 그림(credit-card). 브랜드 파랑 · 회색 면으로 회사 색인 척하지 않는다
 *   decorative(기본 true) — 옆에 이름이 있을 때 그림 · 면을 숨긴다. false 면 "카드사 카드 이름" 을 읽는다(그림의 alt · 면의 이름)
 *
 * 이름 — 틀은 역할이 없다. 그림은 <img alt>, 불러오는 동안 스켈레톤은 aria-hidden. 대체 그림은 alt 가 있으면 role="img" + 그 이름,
 *   alt 가 "" 면 숨긴다 — 실패해도 이름이 남는다. 파일 이름 · "Image" · "logo" 를 alt 로 두지 않는다.
 * 누르지 않는다 · 마우스에 키우지 않는다 — 누르는 자리는 감싼 버튼 · 링크(목록 줄 · 격자 칸)의 동작이다. 상태는 흐리지 않고 배지로 알린다.
 */

export type ImageFrameRatio = AspectRatioValue;
export type ImageFrameRadius = "4" | "6" | "8";
export type ImageFrameFit = "cover" | "contain";
export type ImageFramePlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";

// 그림 위 요소 — 틀 하나에 둘까지
const MAX_FLOATERS = 2;

/** 폭 → 모서리(SEED) — 24 이하 "4" · 48 이하 "6" · 그 위 "8". 폭을 모르면(부모 폭을 채운다) "8" */
function imageFrameRadius(width?: number | null): ImageFrameRadius {
  if (width == null || Number.isNaN(width)) return "8";
  return width <= 24 ? "4" : width <= 48 ? "6" : "8";
}

// ── 틀 ──────────────────────────────────────────────────────
// 비율 상자 · 모서리로 자르기 · 층 따로 쌓기 · 크기 컨테이너. ::after 가 안쪽 1px 투명 윤곽(그림 · 스켈레톤 · 대체 그림 위)
const imageFrameVariants = cva(
  [
    "relative isolate block max-w-full overflow-hidden [container-name:image-frame] [container-type:size]",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] after:content-['']",
  ].join(" "),
  {
    variants: {
      radius: {
        "0": "rounded-none",
        "4": "rounded-r1",
        "6": "rounded-r1_5",
        "8": "rounded-r2",
      },
    },
    defaultVariants: { radius: "8" },
  },
);

// 그림 — 틀을 채운다. rotate 는 카드 비율(1.586)의 틀에서만 쓴다 — 그림 상자를 틀의 높이 × 폭(100% ÷ 1.586 × 158.6%)으로 잡아
// 가운데에 두고 시계 방향으로 90° 돌린다. contain 은 둘레를 흰 판(그림의 바탕)으로 채운다
const imageFrameImageVariants = cva("absolute block", {
  variants: {
    rotate: {
      false: "inset-0 size-full",
      true: "left-1/2 top-1/2 h-[158.6%] w-[calc(100%/1.586)] -translate-x-1/2 -translate-y-1/2 rotate-90",
    },
    fit: {
      cover: "object-cover",
      contain: "bg-static-white object-contain",
    },
  },
  defaultVariants: { rotate: false, fit: "cover" },
});

// 받는 동안은 보이지 않게 · 다 받으면 투명도로(150ms, 모션 줄이기면 바로)
const IMAGE_LOADING = "opacity-0";
const IMAGE_REVEAL = "animate-[fade-in_var(--motion-duration-d3)_var(--motion-ease-enter)] motion-reduce:animate-none";

type ImageStatus = "loading" | "loaded" | "error";
type ImageState = { src?: string; status: ImageStatus; portrait: boolean; reveal: boolean };
const loadingState = (src: string | undefined): ImageState => ({ src, status: "loading", portrait: false, reveal: false });

// 그림 상태 — src 가 바뀌면 다시 loading. 붙기 전에 이미 끝난 그림(받아 둔 것)은 붙자마자 complete 로 읽고 그대로 보인다 —
// 크기가 없는 그림(SVG)도 0 으로 읽히므로 0 이면 decode 로 가른다. loading 이 아닌 뒤에는 바꾸지 않는다(실패 뒤에 온 그림 · 같은 그림의 두 번째 알림)
function useFrameImage(src: string | undefined) {
  const [state, setState] = React.useState<ImageState>(() => loadingState(src));
  const current = state.src === src ? state : loadingState(src);
  const settle = React.useCallback(
    (img: HTMLImageElement, reveal: boolean) =>
      setState((prev) => {
        const base = prev.src === src ? prev : loadingState(src);
        if (base.status !== "loading") return base;
        return { src, status: "loaded", portrait: img.naturalWidth < img.naturalHeight, reveal };
      }),
    [src],
  );
  const fail = React.useCallback(
    () =>
      setState((prev) => {
        const base = prev.src === src ? prev : loadingState(src);
        return base.status === "loading" ? { ...base, status: "error" } : base;
      }),
    [src],
  );
  const ref = React.useCallback(
    (img: HTMLImageElement | null) => {
      if (!img?.complete) return;
      if (img.naturalWidth > 0) settle(img, false);
      else img.decode().then(() => settle(img, false), fail);
    },
    [settle, fail],
  );
  return { ...current, ref, settle, fail };
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const warned = new Set<string>();
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[ImageFrame] ${message}`);
}

export interface ImageFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 그림 — 없으면(undefined · null · "") 처음부터 대체 그림 */
  src?: string | null;
  /** 필수 — 이름 옆 · 장식 그림은 "", 혼자인 그림은 무엇인지. 대체 그림이 이름으로 이어받는다 */
  alt: string;
  /** 비율 — 기본 "4:3". "card"(1.586)는 세로 그림을 시계 방향으로 90° 돌린다 */
  ratio?: ImageFrameRatio;
  /** 고정 폭(px) — 모서리를 고른다(24 이하 4 · 48 이하 6 · 그 위 8). 없으면 부모 폭을 채우고 모서리 8 */
  width?: number;
  /** 화면 폭 — 좌우가 화면 끝에 닿는 그림, 모서리 0 */
  bleed?: boolean;
  /** "cover"(기본) · "contain"(잘리지 않게 — 둘레는 흰 판) */
  fit?: ImageFrameFit;
  /** 대체 그림 아이콘 — 기본 ImageIcon */
  fallbackIcon?: React.ReactNode;
  /** 대체 그림을 통째로 바꿀 때(카드 면). 틀을 채운다 */
  fallback?: React.ReactNode;
  /** "lazy"(기본) · "eager"(첫 화면의 큰 그림) */
  loading?: "lazy" | "eager";
  srcSet?: string;
  sizes?: string;
}

const ImageFrame = React.forwardRef<HTMLDivElement, ImageFrameProps>(
  (
    { src, alt, ratio = "4:3", width, bleed = false, fit = "cover", fallbackIcon, fallback, loading = "lazy", srcSet, sizes, className, style, children, ...props },
    ref,
  ) => {
    const frameRef = React.useRef<HTMLDivElement | null>(null);
    const setRef = React.useMemo(() => mergeRefs(ref, frameRef), [ref]);
    const source = src != null && src !== "" ? src : undefined;
    const image = useFrameImage(source);
    const status: ImageStatus = source ? image.status : "error";
    const state = status === "error" ? "fallback" : status;
    const radius = bleed ? "0" : imageFrameRadius(width);
    const rotate = ratio === "card" && status === "loaded" && image.portrait;
    const named = alt.trim() !== "";

    // 그림 위 요소 — 자리마다 하나 · 둘까지(앞에서부터). 나머지는 그리지 않는다
    const all = React.Children.toArray(children).filter(React.isValidElement);
    const floaters: React.ReactElement[] = [];
    const taken = new Set<unknown>();
    for (const child of all) {
      const placement = (child.props as { placement?: unknown }).placement;
      if (floaters.length === MAX_FLOATERS || (placement != null && taken.has(placement))) continue;
      taken.add(placement);
      floaters.push(child);
    }
    const dropped = all.length - floaters.length;

    // 10초 — 틀이 화면에 들어온 때부터 잰다(lazy 그림은 그때 받기 시작한다). 지나면 실패와 같다
    const { fail } = image;
    React.useEffect(() => {
      if (!source || status !== "loading") return;
      let timer: number | undefined;
      const start = () => {
        if (timer === undefined) timer = window.setTimeout(fail, LOADING_TIMING.timeout);
      };
      const el = frameRef.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        start();
        return () => window.clearTimeout(timer);
      }
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start();
      });
      observer.observe(el);
      return () => {
        observer.disconnect();
        if (timer !== undefined) window.clearTimeout(timer);
      };
    }, [source, status, fail]);

    // 개발 중 — 셋째 · 같은 자리의 둘째 요소, 짧은 변이 80 보다 작은 틀의 요소
    React.useEffect(() => {
      if (!import.meta.env.DEV) return;
      if (dropped > 0) warnOnce("drop", `그림 위 요소는 네 모서리에 하나씩, 틀 하나에 둘까지다 — ${dropped}개를 그리지 않았다.`);
      const el = frameRef.current;
      if (!el || floaters.length === 0) return;
      const box = el.getBoundingClientRect();
      const short = Math.min(box.width, box.height);
      if (box.width > 0 && short < 80)
        warnOnce("small", `틀의 짧은 변이 80 보다 작다(${Math.round(short)}) — 그림 위 요소를 그리지 않는다. 배지 · 장수는 줄의 글로 둔다.`);
    }, [dropped, floaters.length]);

    return (
      <div
        ref={setRef}
        data-slot="image-frame"
        data-state={state}
        data-ratio={ratio}
        data-radius={radius}
        data-fit={fit}
        data-rotated={rotate || undefined}
        className={cn(imageFrameVariants({ radius }), aspectRatioVariants({ ratio }), width != null ? "shrink-0" : "w-full", className)}
        style={width != null ? { width, ...style } : style}
        {...props}
      >
        {source && status === "loading" && <Skeleton radius="0" className="absolute inset-0 size-full" />}
        {source && status !== "error" && (
          <img
            key={source}
            ref={image.ref}
            data-slot="image-frame-image"
            loading={loading}
            sizes={sizes}
            srcSet={srcSet}
            alt={alt}
            src={source}
            className={cn(
              imageFrameImageVariants({ rotate, fit }),
              status === "loading" && IMAGE_LOADING,
              status === "loaded" && image.reveal && IMAGE_REVEAL,
            )}
            onLoad={(e) => image.settle(e.currentTarget, true)}
            onError={image.fail}
          />
        )}
        {status === "error" && (
          <div data-slot="image-frame-fallback" className="absolute inset-0 flex" {...(named ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}>
            {fallback ?? <ContentPlaceholder icon={fallbackIcon} />}
          </div>
        )}
        {floaters}
      </div>
    );
  },
);
ImageFrame.displayName = "ImageFrame";

// ── 그림 위 자리 ─────────────────────────────────────────────
// 네 모서리 — 틀 가장자리 → 요소 바깥 상자 6. 틀의 짧은 변이 80 이상일 때만 보인다. 누르지 않는다
const imageFrameFloaterVariants = cva(
  "pointer-events-none absolute hidden [@container_image-frame_(min-width:80px)_and_(min-height:80px)]:flex",
  {
    variants: {
      placement: {
        "top-start": "start-x1_5 top-x1_5",
        "top-end": "end-x1_5 top-x1_5",
        "bottom-start": "bottom-x1_5 start-x1_5",
        "bottom-end": "bottom-x1_5 end-x1_5",
      } satisfies Record<ImageFramePlacement, string>,
    },
  },
);

export interface ImageFrameFloaterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 자리(필수) — 위 시작 · 위 끝 · 아래 시작 · 아래 끝 */
  placement: ImageFramePlacement;
  /** 하나 — Badge variant="solid"(상태 · 분류) 또는 ImageFrameIndicator(장수 · 길이) */
  children: React.ReactNode;
}

const ImageFrameFloater = React.forwardRef<HTMLDivElement, ImageFrameFloaterProps>(({ placement, className, ...props }, ref) => (
  <div ref={ref} data-slot="image-frame-floater" data-placement={placement} className={cn(imageFrameFloaterVariants({ placement }), className)} {...props} />
));
ImageFrameFloater.displayName = "ImageFrameFloater";

// ── Indicator ───────────────────────────────────────────────
// 알약 · 검정 65%(두 모드 같다) · 흰 11/15 500 · 좌우 6 · 위아래 2 · 높이 19(글이 커지면 따라 커진다)
const imageFrameIndicatorVariants = cva(
  "inline-flex min-h-[19px] items-center whitespace-nowrap rounded-full bg-[var(--overlay-dim-dark)] px-x1_5 py-x0_5 font-sans text-t1 font-medium text-static-white",
);

export interface ImageFrameIndicatorProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** 보이는 글 — "1 / 12"(지금 장 / 전체) · "+9"(나머지 장수). 보조 기술에는 숨긴다 */
  children: React.ReactNode;
  /** 읽는 글(필수) — 무엇의 수인지. "사진 12장 중 1번째" · "사진 9장 더 있음" */
  label: string;
}

const ImageFrameIndicator = React.forwardRef<HTMLSpanElement, ImageFrameIndicatorProps>(({ label, className, children, ...props }, ref) => (
  <span ref={ref} data-slot="image-frame-indicator" className={cn(imageFrameIndicatorVariants(), className)} {...props}>
    <span aria-hidden="true">{children}</span>
    <span className="sr-only">{label}</span>
  </span>
));
ImageFrameIndicator.displayName = "ImageFrameIndicator";

// ── 카드 그림 ────────────────────────────────────────────────
// 카드 면 — 기관 색 한 색 + 표의 글자색. 크기는 틀의 폭으로(container image-frame): 96 미만 첫 글자 · 96 ~ 239 medium · 240 이상 large
const CARD_FACE_TEXT: Record<InstitutionColor["text"], string> = {
  white: "text-static-white",
  dark: "text-fg-neutral dark:text-fg-neutral-inverted",
};
const CARD_FACE = "relative size-full overflow-hidden font-sans";
// small — 회사 첫 글자 가운데, 면 높이의 40%(가장 작아도 10 · 정수로) · 700 · 줄 높이 1 · 로마자 대문자.
// 줄 높이는 글자 크기 뒤에 붙인다 — tailwind-merge 는 뒤에 오는 글자 크기가 줄 높이를 지운다고 본다
const CARD_FACE_INITIAL = cn(
  "absolute inset-0 flex items-center justify-center font-bold uppercase @min-[96px]/image-frame:hidden",
  "text-[length:max(10px,round(40cqh,1px))]",
  "leading-none",
);
// medium · large — 왼쪽 아래 회사 · 카드 이름
const CARD_FACE_LABEL =
  "absolute inset-x-0 bottom-0 hidden flex-col px-x2_5 pb-x2 @min-[96px]/image-frame:flex @min-[240px]/image-frame:px-x4 @min-[240px]/image-frame:pb-x3_5";
const CARD_FACE_ISSUER = "truncate text-t2 font-medium @min-[240px]/image-frame:text-t3";
const CARD_FACE_NAME = "line-clamp-1 break-keep text-t4 font-bold [overflow-wrap:break-word] @min-[240px]/image-frame:line-clamp-2 @min-[240px]/image-frame:text-t5";

function CardFace({ issuer, name, institution }: { issuer: string; name: string; institution: InstitutionColor }) {
  return (
    <div
      data-slot="card-art-face"
      data-text={institution.text}
      className={cn(CARD_FACE, CARD_FACE_TEXT[institution.text])}
      style={{ backgroundColor: institution.color }}
    >
      <span data-slot="card-art-initial" className={CARD_FACE_INITIAL}>
        {avatarInitial(issuer)}
      </span>
      <span data-slot="card-art-label" className={CARD_FACE_LABEL}>
        <span data-slot="card-art-issuer" className={CARD_FACE_ISSUER}>
          {issuer.trim()}
        </span>
        {name.trim() !== "" && (
          <span data-slot="card-art-name" className={CARD_FACE_NAME}>
            {name.trim()}
          </span>
        )}
      </span>
    </div>
  );
}

export interface CardArtProps extends Omit<ImageFrameProps, "src" | "alt" | "ratio" | "bleed" | "fit" | "fallbackIcon" | "fallback" | "srcSet" | "sizes"> {
  /** 카드사 이름 — 기관 색 · 첫 글자 · 모르는 회사 가르기 */
  issuer: string;
  /** 카드 이름 */
  name: string;
  /** 카드 그림 — 없거나 실패하면 카드 면(아는 카드사) · 대체 그림(모르는 카드사) */
  src?: string | null;
  /** 기본 true — 옆에 이름이 있을 때(그림 · 면을 숨긴다). false 면 "카드사 카드 이름" 을 읽는다 */
  decorative?: boolean;
}

const CardArt = React.forwardRef<HTMLDivElement, CardArtProps>(({ issuer, name, src, decorative = true, ...props }, ref) => {
  const institution = institutionColor(issuer);
  const label = [issuer.trim(), name.trim()].filter((part) => part !== "").join(" ");
  return (
    <ImageFrame
      ref={ref}
      data-slot="card-art"
      data-issuer={institution ? "known" : "unknown"}
      ratio="card"
      src={src}
      alt={decorative ? "" : label}
      fallbackIcon={<CreditCard />}
      fallback={institution ? <CardFace issuer={issuer} name={name} institution={institution} /> : undefined}
      {...props}
    />
  );
});
CardArt.displayName = "CardArt";

export {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameIndicator,
  CardArt,
  imageFrameRadius,
  imageFrameVariants,
  imageFrameImageVariants,
  imageFrameFloaterVariants,
  imageFrameIndicatorVariants,
};
