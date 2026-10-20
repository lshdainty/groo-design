import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Groo Card — 면은 SEED Elevation · stroke.neutral-weak · Feedback(2026-10-08). 수치 원본은 specs/components/card.yaml.
 * SEED 에는 카드 컴포넌트가 없다 — 바닥 위 흰 면 + 1px 테두리 · 그림자 없음 · 누름은 SEED 를, 머리 · 여백 · 지표 · 순자산 · 증감은 groo 가 정했다.
 * 옛 변형 넷(shadow · bordered · muted · brand) · 모서리 12 · 여백 16 / 24 · 그림자 상승은 걷었다.
 *
 *   Card            카드 면. variant "default"(바닥 위 흰 면 + 1px 테두리) · "hero"(순자산 — 브랜드 채움 · 흰 글자, 한 화면에 하나).
 *                   body "content"(기본 — 여백 24) · "list"(List 를 담는다 — 좌우 여백 0, 머리 위 · 좌우 24 · 아래 4, 카드 아래 12) ·
 *                   "accordion"(Accordion inline 을 담는다 — 좌우 여백 0, 머리는 목록 카드와 같다, 카드 아래 8 — 마지막 트리거의 아래 16 과
 *                   합쳐 보이는 24. 머리 오른쪽 동작 자리에는 AccordionExpandAll, 2026-10-10).
 *                   press "none"(기본) · "whole"(카드 전체가 한 곳 — <a href> 또는 <button>, 누름 색 + 2px 축소) · "peers"(카드를 누르면
 *                   열리고 안에 대등한 동작이 더 있다 — 카드 위에 깐 CardLink 가 누르는 자리, 색만 바뀐다). href · onClick 을 주면 "whole"
 *   CardHeader      머리 — 제목과 오른쪽 동작 한 줄, 아래 8(목록 · 아코디언 카드 4)
 *   CardTitle       제목 16 / 22 · 700 · fg-neutral — as(기본 h2)
 *   CardAction      머리 동작("전체 보기") — href · onClick. 글 버튼(SEED Text Button, 2026-10-16 글자 역할 D2): 14 · 700 · fg-neutral-muted,
 *                   꺾쇠 없음, 보이는 상자 36 · 좌우 14 · 모서리 8(오른쪽 −14 로 내어 글자 끝이 카드 여백에), 누르는 영역 44.
 *                   이름은 "{제목} {글}"(aria-labelledby — 제목이 있을 때)
 *   CardContent     본문 — 여백 안, 요소 사이 12. 목록 카드는 CardContent 없이 List 를 바로 넣는다
 *   CardLink        peers 카드의 누르는 자리 — 카드 전체를 덮는 링크(href) · 버튼(onClick), 글은 제목 모양(이름은 카드 제목)
 *   CardStat        지표 — label(13 · 500 · fg-neutral-subtle) · value(700 · 고정폭 숫자 — large 24 / 32 · small 20 / 27) · delta
 *   Delta           증감 줄 — direction "up"(▲ fg-critical) · "down"(▼ fg-informative) · "flat"(화살표 없이 "변화 없음" · fg-neutral-subtle) ·
 *                   value("12%") · text("지난달보다" · fg-neutral-subtle) · srText(보조 기술 문장 — 기본 "{text} {value} 늘었어요 · 줄었어요").
 *                   표 · 차트의 증감 칸도 이것을 쓴다. 순자산 카드 안에서는 모두 흰 글자(채움 위 빨강 · 파랑은 1.66 · 1.65 — 하나뿐인 예외)
 *   CardHeroLabel · CardHeroAmount · CardHeroDetail   순자산 카드의 흰 글자 셋 — 라벨 13 · 500, 금액 32 / 42 · 700(아래 6), 아래 글 13(아래 4)
 *
 * 면: 바닥(bg-layer-basement) 위 bg-layer-default + 1px stroke-neutral-weak, 그림자 없음 — 폰 · 데스크톱 · 라이트 · 다크가 같다.
 *   모서리 16(radius-r4 — 카드 안 목록의 누름 바탕 10 = 16 − 6), 여백 24(폭과 상관없이 — List 줄 · 시트와 같다). 쌓은 카드 사이 8 ·
 *   데스크톱 격자 칸 사이 24 는 감싸는 쪽이 정한다. 넘친 것(목록 줄의 누름 바탕 · 순자산 장식 빛)은 모서리에서 자른다.
 * 누름(SEED Feedback): whole — 마우스를 올리면 면이 bg-layer-default-pressed, 누르는 동안 같은 면 + 카드 전체 2px 거리 축소
 *   (기준 max(높이, 폭 ÷ 4, 24) 를 누르는 순간 잰다 · 모션 줄이기면 축소하지 않는다). peers — 면 색만(축소 없음), 안의 버튼 · 링크는
 *   카드 링크 위(z 1)에 놓여 각자 눌리고, 눌러도 카드가 열리지 않는다. 테두리 · 글자색은 그대로, 그림자 · 위로 뜨기는 없다.
 *   키보드 포커스에만 카드 바깥 2px 링(띄움 2). 보기만 하는 카드(none)는 역할이 없고 바뀌지 않는다.
 * 순자산(hero): 135° 그라디언트 bg-brand-solid → 라이트 brand-900(#002460) · 다크 brand-300-dark(#1F3A69) — 다크도 짙은 채움이고 흰 글자는
 *   두 모드 모두 4.5 이상. 테두리 없음 · 여백 24 · 모서리 16. 오른쪽 위 장식 빛(240 원 · 오른쪽 −40 · 위 −80, 흰 22% → 70% 에서 투명)은
 *   글자 뒤에 깔린다(보조 기술에 숨긴다). 글자를 흐리게(불투명도) 두지 않는다.
 */

export type CardVariant = "default" | "hero";
export type CardBody = "content" | "list" | "accordion";
export type CardPress = "none" | "whole" | "peers";

type CardContextValue = {
  variant: CardVariant;
  body: CardBody;
  titleId: string | undefined;
  setTitleId: (id: string | undefined) => void;
};

const CardContext = React.createContext<CardContextValue | null>(null);

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로(Button · List 와 같은 식) — 넓은 카드도 세로 2px 만큼만 준다
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

// ── 면 ───────────────────────────────────────────────────────
const ROOT = "relative isolate block overflow-hidden rounded-r4 text-start font-sans text-fg-neutral no-underline";
const VARIANT: Record<CardVariant, string> = {
  default: "border border-solid border-stroke-neutral-weak bg-bg-layer-default",
  // 그라디언트 끝은 모드마다 다른 단계 — 다크에서 brand-900 은 밝은 #7AA9F6 이라 쓰지 않는다
  hero: [
    "border-0 text-static-white",
    "bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-900))]",
    "dark:bg-[linear-gradient(135deg,var(--color-bg-brand-solid),var(--color-brand-300-dark))]",
  ].join(" "),
};
const BODY: Record<CardBody, string> = {
  content: "p-x6",
  // 좌우 · 위 0 — 머리가 위 24 · 좌우 24 를 갖고, 줄이 제 좌우 24 · 위아래 12 를 가진다. 아래 12 + 마지막 줄 12 = 보이는 24.
  // 머리가 없으면 위도 12 — 첫 줄 12 와 합쳐 보이는 24(위 · 아래 같게)
  list: "pb-x3 [&:not(:has(>[data-slot=card-header]))]:pt-x3",
  // 좌우 · 위 0 — 머리가 위 24 · 좌우 24 를 갖고, 트리거가 제 좌우 24 · 위아래 16 을 가진다. 아래 8 + 마지막 트리거 16 = 보이는 24.
  // 머리가 없으면 위도 8 — 첫 트리거 16 과 합쳐 보이는 24(위 · 아래 같게, 목록 카드와 같은 셈)
  accordion: "pb-x2 [&:not(:has(>[data-slot=card-header]))]:pt-x2",
};

// whole — 면 색 + 축소, 키보드 포커스에만 바깥 링
const PRESS_WHOLE = [
  "w-full cursor-pointer",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 순자산 카드는 채움이라 면 색을 바꾸지 않는다
const PRESS_WHOLE_SURFACE = "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed";

// peers — 카드 링크를 올리거나 누르면 면 색만. 안의 버튼 · 링크는 카드 링크 위(z 1)
const PRESS_PEERS = [
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "[@media(hover:hover)]:has-[[data-slot=card-link]:hover]:bg-bg-layer-default-pressed has-[[data-slot=card-link]:active]:bg-bg-layer-default-pressed",
  "has-[[data-slot=card-link]:focus-visible]:outline-2 has-[[data-slot=card-link]:focus-visible]:outline-offset-2 has-[[data-slot=card-link]:focus-visible]:outline-stroke-focus-ring",
  "[&_button:not([data-slot=card-link])]:relative [&_button:not([data-slot=card-link])]:z-[1] [&_a:not([data-slot=card-link])]:relative [&_a:not([data-slot=card-link])]:z-[1]",
].join(" ");

// 장식 빛 — 오른쪽 위, 글자 뒤(카드 안 쌓임의 맨 아래)
const HERO_GLOW =
  "pointer-events-none absolute -right-[40px] -top-[80px] -z-10 size-[240px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-static-white)_22%,transparent),transparent_70%)]";

type CardOwnProps = {
  /** "default"(기본 — 바닥 위 흰 면 + 테두리) · "hero"(순자산 — 브랜드 채움 · 흰 글자) */
  variant?: CardVariant;
  /** "content"(기본 — 여백 24) · "list"(List 를 담는다 — 줄이 가장자리까지) · "accordion"(Accordion inline 을 담는다 — 트리거가 가장자리까지) */
  body?: CardBody;
  /** "none"(기본) · "whole"(카드 전체가 한 곳) · "peers"(카드 링크 + 대등한 동작). href · onClick 을 주면 "whole" */
  press?: CardPress;
  /** 카드 전체가 링크(<a>) — press "whole" */
  href?: string;
  /** 카드 전체가 버튼(<button>) — press "whole" */
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export type CardProps = CardOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, "onClick"> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "download">;

const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    { variant = "default", body = "content", press: pressProp, href, onClick, target, rel, download, className, children, onPointerDown, onKeyDown, ...props },
    ref,
  ) => {
    const [titleId, setTitleId] = React.useState<string | undefined>(undefined);
    const ctx = React.useMemo(() => ({ variant, body: variant === "hero" ? "content" : body, titleId, setTitleId }), [variant, body, titleId]);
    const press: CardPress = pressProp === "peers" ? "peers" : href != null || onClick != null ? "whole" : "none";
    if (import.meta.env.DEV && pressProp === "whole" && href == null && onClick == null) {
      console.warn("[Card] press=\"whole\" 은 href · onClick 과 함께 쓴다 — 누를 곳이 없어 보기만 하는 카드로 그린다.");
    }
    const hero = variant === "hero";
    const classes = cn(
      ROOT,
      VARIANT[variant],
      hero ? "p-x6" : BODY[body],
      press === "whole" && PRESS_WHOLE,
      press === "whole" && !hero && PRESS_WHOLE_SURFACE,
      press === "peers" && !hero && PRESS_PEERS,
      className,
    );
    const content = (
      <>
        {hero && <span aria-hidden data-slot="card-hero-glow" className={HERO_GLOW} />}
        {children}
      </>
    );
    const shared = {
      "data-slot": "card",
      "data-variant": variant,
      "data-body": hero ? "content" : body,
      "data-press": press,
      className: classes,
    };
    let node: React.ReactNode;
    if (press === "whole" && href != null) {
      node = (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          download={download}
          onClick={onClick}
          onPointerDown={(e) => {
            measurePress(e.currentTarget);
            onPointerDown?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") measurePress(e.currentTarget);
            onKeyDown?.(e);
          }}
          {...shared}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    } else if (press === "whole") {
      node = (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          onPointerDown={(e) => {
            measurePress(e.currentTarget);
            onPointerDown?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") measurePress(e.currentTarget);
            onKeyDown?.(e);
          }}
          {...shared}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    } else {
      node = (
        <div ref={ref as React.Ref<HTMLDivElement>} onPointerDown={onPointerDown} onKeyDown={onKeyDown} {...shared} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
          {content}
        </div>
      );
    }
    return <CardContext.Provider value={ctx}>{node}</CardContext.Provider>;
  },
);
Card.displayName = "Card";

// ── 머리 ─────────────────────────────────────────────────────
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const ctx = React.useContext(CardContext);
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "flex items-center justify-between gap-x2",
        // 목록 · 아코디언 카드 — 위 24 · 좌우 24 · 아래 4(줄 · 트리거가 제 위 여백 12 · 16 을 가진다). 글 카드는 카드 여백 안 · 아래 8
        ctx?.body === "list" || ctx?.body === "accordion" ? "px-x6 pb-x1 pt-x6" : "pb-x2",
        className,
      )}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 제목 태그 — 기본 h2(화면 제목 아래 단계) */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ as: Heading = "h2", id: idProp, className, ...props }, ref) => {
  const ctx = React.useContext(CardContext);
  const auto = React.useId();
  const id = idProp ?? auto;
  const setTitleId = ctx?.setTitleId;
  React.useLayoutEffect(() => {
    setTitleId?.(id);
    return () => setTitleId?.(undefined);
  }, [setTitleId, id]);
  return <Heading ref={ref} id={id} data-slot="card-title" className={cn("min-w-0 font-sans text-t5 font-bold text-fg-neutral", className)} {...props} />;
});
CardTitle.displayName = "CardTitle";

// 머리 동작 — 글 버튼(SEED Text Button): 보이는 상자 36 · 누르는 영역 44(::before), 누르면 바탕 + 2px 거리 축소
const CARD_ACTION = [
  "relative -mr-x3_5 inline-flex h-9 shrink-0 cursor-pointer items-center rounded-r2 border-0 bg-transparent px-x3_5",
  "font-sans text-t4 font-bold text-fg-neutral-muted no-underline",
  "before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

export interface CardActionProps extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  /** 그 목록 · 화면으로 — 링크 */
  href?: string;
  /** 그 동작 — 버튼 */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const CardAction = React.forwardRef<HTMLElement, CardActionProps>(
  ({ href, onClick, className, children, onPointerDown, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }, ref) => {
    const ctx = React.useContext(CardContext);
    const textId = React.useId();
    // 이름 "{제목} {글}" — 무엇의 동작인지 넣는다. aria-label · aria-labelledby 를 주면 그것을 쓴다
    const labelledBy = ariaLabel != null ? undefined : (ariaLabelledBy ?? (ctx?.titleId ? `${ctx.titleId} ${textId}` : undefined));
    const inner = (
      <>
        <span id={textId}>{children}</span>
      </>
    );
    const shared = {
      "data-slot": "card-action",
      "aria-label": ariaLabel,
      "aria-labelledby": labelledBy,
      className: cn(CARD_ACTION, className),
      onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
        measurePress(e.currentTarget);
        onPointerDown?.(e);
      },
    };
    if (href != null) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} onClick={onClick} {...shared} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {inner}
        </a>
      );
    }
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} type="button" onClick={onClick} {...shared} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {inner}
      </button>
    );
  },
);
CardAction.displayName = "CardAction";

// ── 본문 ─────────────────────────────────────────────────────
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="card-content" className={cn("flex flex-col gap-x3", className)} {...props} />
));
CardContent.displayName = "CardContent";

export interface CardLinkProps extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// peers 카드의 누르는 자리 — ::after 가 카드 전체를 덮는다(카드가 relative). 포커스 링은 카드가 그린다
const CARD_LINK = [
  "cursor-pointer border-0 bg-transparent p-0 text-start font-sans text-t5 font-bold text-fg-neutral no-underline",
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none",
].join(" ");

const CardLink = React.forwardRef<HTMLElement, CardLinkProps>(({ href, onClick, className, ...props }, ref) => {
  if (href != null) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        data-slot="card-link"
        className={cn(CARD_LINK, className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      data-slot="card-link"
      className={cn(CARD_LINK, className)}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});
CardLink.displayName = "CardLink";

// ── 증감 ─────────────────────────────────────────────────────
export type DeltaDirection = "up" | "down" | "flat";

export interface DeltaProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** "up"(▲ fg-critical) · "down"(▼ fg-informative) · "flat"(화살표 없이 "변화 없음") — 좋고 나쁨이 아니라 방향 */
  direction: DeltaDirection;
  /** 변화량 — "12%" · "1,240원". 부호는 화살표가 말한다(앞의 + · − 는 떼어 낸다) */
  value?: React.ReactNode;
  /** 기준 — "지난달보다"(fg-neutral-subtle) */
  text?: React.ReactNode;
  /** 보조 기술이 읽는 문장 — 기본 "{text} {value} 늘었어요 · 줄었어요"(flat 은 "{text} 변화가 없어요"). 좋고 나쁨을 말하려면 준다("지난달보다 12% 더 썼어요") */
  srText?: string;
}

const DELTA_TONE: Record<DeltaDirection, string> = {
  up: "text-fg-critical",
  down: "text-fg-informative",
  flat: "text-fg-neutral-subtle",
};
const ARROW: Record<DeltaDirection, string | null> = { up: "▲", down: "▼", flat: null };

const plain = (node: React.ReactNode) => (typeof node === "string" || typeof node === "number" ? String(node).trim() : "");
// 앞의 부호를 떼어 낸다 — "+12%" · "−12%" · "+-12.5%" 를 화살표와 겹쳐 쓰지 않는다
const unsigned = (node: React.ReactNode) => (typeof node === "string" ? node.replace(/^[\s+\-\u2212]+/, "") : node);

function deltaSentence(direction: DeltaDirection, value: React.ReactNode, text: React.ReactNode) {
  const base = plain(text);
  if (direction === "flat") return [base, "변화가 없어요"].filter(Boolean).join(" ");
  const amount = plain(unsigned(value));
  return [base, amount, direction === "up" ? "늘었어요" : "줄었어요"].filter(Boolean).join(" ");
}

const Delta = React.forwardRef<HTMLSpanElement, DeltaProps>(({ direction, value, text, srText, className, ...props }, ref) => {
  const hero = React.useContext(CardContext)?.variant === "hero";
  const arrow = ARROW[direction];
  return (
    <span
      ref={ref}
      data-slot="delta"
      data-direction={direction}
      className={cn("inline-flex flex-wrap items-baseline gap-x1 font-sans text-t3", className)}
      {...props}
    >
      <span aria-hidden data-slot="delta-value" className={cn("font-medium tabular-nums", hero ? "text-static-white" : DELTA_TONE[direction])}>
        {arrow != null ? (
          <>
            {arrow} {unsigned(value)}
          </>
        ) : (
          "변화 없음"
        )}
      </span>
      {/* flat 은 "변화 없음" 만 — "변화 없음 지난달보다" 가 되지 않게 기준 글은 숨긴 문장에만 */}
      {direction !== "flat" && text != null && text !== "" && (
        <span aria-hidden data-slot="delta-text" className={cn("font-normal", hero ? "text-static-white" : "text-fg-neutral-subtle")}>
          {text}
        </span>
      )}
      <span className="sr-only">{srText ?? deltaSentence(direction, value, text)}</span>
    </span>
  );
});
Delta.displayName = "Delta";

// ── 지표 ─────────────────────────────────────────────────────
export interface CardStatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 무엇의 숫자인지 — "이번 달 지출" */
  label: React.ReactNode;
  /** 숫자 — 쓰는 쪽이 원까지 만든다("1,240,000원" · 빼기는 U+2212). 카드보다 길면 쉼표 뒤에서만 줄을 바꾼다 — 금액 함수가 쉼표 뒤마다 <wbr /> 를 넣어 넘긴다(card.yaml statValue.lineBreak) */
  value: React.ReactNode;
  /** "large"(기본 — 24 / 32, 카드 하나에 숫자 하나) · "small"(20 / 27 — 데스크톱 격자에 셋 · 넷씩) */
  size?: "large" | "small";
  /** 증감 줄 */
  delta?: DeltaProps;
}

const CardStat = React.forwardRef<HTMLDivElement, CardStatProps>(({ label, value, size = "large", delta, className, ...props }, ref) => (
  <div ref={ref} data-slot="card-stat" data-size={size} className={cn("flex flex-col items-start", className)} {...props}>
    <span data-slot="card-stat-label" className="font-sans text-t3 font-medium text-fg-neutral-subtle">
      {label}
    </span>
    <span data-slot="card-stat-value" className={cn("mt-x1 font-sans font-bold tabular-nums text-fg-neutral", size === "small" ? "text-t7" : "text-t9")}>
      {value}
    </span>
    {delta != null && <Delta {...delta} className={cn("mt-x1", delta.className)} />}
  </div>
));
CardStat.displayName = "CardStat";

// ── 순자산 ───────────────────────────────────────────────────
const CardHeroLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="card-hero-label" className={cn("font-sans text-t3 font-medium text-static-white", className)} {...props} />
));
CardHeroLabel.displayName = "CardHeroLabel";

const CardHeroAmount = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="card-hero-amount" className={cn("mt-x1_5 font-sans text-t12 font-bold tabular-nums text-static-white", className)} {...props} />
));
CardHeroAmount.displayName = "CardHeroAmount";

const CardHeroDetail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="card-hero-detail" className={cn("mt-x1 font-sans text-t3 font-normal text-static-white", className)} {...props} />
));
CardHeroDetail.displayName = "CardHeroDetail";

export { Card, CardHeader, CardTitle, CardAction, CardContent, CardLink, CardStat, Delta, CardHeroLabel, CardHeroAmount, CardHeroDetail };
