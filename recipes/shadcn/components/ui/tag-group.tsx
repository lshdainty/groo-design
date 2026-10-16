import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Porest Tag Group — 구조는 SEED Tag Group(2026-10-03). 수치 원본은 specs/components/tag-group.yaml.
 *
 *   TagGroup       여러 메타 정보(카테고리 이름 · 자산 · 시각 · 거리 · 개수 · 금액)를 " · " 로 이은 글줄 — 묶음 <span>, 역할 없음
 *                  (목록 역할을 주지 않는다 — "목록, 항목 3개" 를 줄마다 읽지 않게). 항목 사이 구분은 묶음이 스스로 넣는다
 *   TagGroupItem   항목 — 글 하나 + 아이콘 하나(앞 prefixIcon 또는 뒤 suffixIcon — 앞뒤 모두 두지 않는다)
 *
 *   size      t2 12/16(기본) · t3 13/18 · t4 14/19 — 묶음에 하나(한 줄 안에서 섞지 않는다). 아이콘 12 · 13 · 14, 아이콘 ↔ 글 2
 *   tone      neutralSubtle(기본 — fg-neutral-subtle) · neutral(fg-neutral) · brand(fg-brand, 아껴서) — 항목마다 고른다
 *   weight    regular 400(기본) · bold 700 — 항목마다. 금액처럼 앞세울 항목 하나만 neutral · bold
 *             묶음의 tone · weight 는 항목의 기본값이다
 *   truncate  false(기본) — 넘치면 낱말 단위로 줄을 바꾼다(keep-all + break-word, v114 — 항목 사이 · 항목 안 띄어쓰기에서)
 *             true — 한 줄(inline-flex · 최대 폭 100%). 넘치면 항목 글이 각자 말줄임(…)하고 구분은 줄지 않는다.
 *             줄어드는 정도는 항목의 shrink — 기본 1, 0 은 줄지 않고 1 이상은 넘친 폭을 '글 폭 × shrink' 비율로 나눠 함께 준다
 *             (차례대로가 아니다 — 금액처럼 꼭 보일 항목은 0). 줄어드는 항목도 첫 글자 + "…" 까지만 — 글 칸의 최소 폭 2.1em,
 *             두 글자 이하면 글 폭(max-content — 넓히지 않는다). 모두 최소 폭이어도 넘치면 줄 끝이 잘린다(2026-10-17 사용자 결정 — 03-E 결정 5 B)
 *
 * 구분 " · " 는 줄이 안 바뀌는 공백(U+00A0) · 가운뎃점(U+00B7) · 공백 — 앞 항목에 붙어, 줄이 바뀌면 앞 줄 끝에 남고 다음 줄은
 * 항목으로 시작한다. 아이콘은 그 글과 한 줄에 붙어 있다(아이콘만 줄 끝에 남지 않는다 — 항목 + 구분을 한 칸으로 묶어 칸 안은
 * 글 안 띄어쓰기에서만 줄을 바꾼다). 색은 톤과 관계없이 fg-disabled · 400(글보다 한 단계 흐린 장식). 보조 기술에는 구분을 숨기고 그 자리에
 * 보이지 않는 ", " 를 둔다 — "식비, 신한카드, 오후 2:10" 처럼 끊어 읽는다(SEED 는 "식비신한카드오후 2:10" 처럼 붙는다).
 * 빈 항목은 건너뛴다 — 자식이 null · false · "" 이거나, 글 · 아이콘이 모두 없는 TagGroupItem 이면 구분도 넣지 않는다.
 * 아이콘은 늘 aria-hidden(항목 글자색을 따른다). 뜻이 있는 아이콘(갈래 = 분할 · 눈 = 조회)은 srLabel 로 읽을 글을 준다 —
 * 주면 보이는 글 · 아이콘을 숨기고 그 글을 읽는다("분할 2건" · "조회 12"). 말줄임해도 글 전체를 읽는다.
 * 글은 글자 크기 설정을 따른다(rem) — wrap 이면 줄이 늘고, truncate 면 더 일찍 말줄임한다. 아이콘은 px 그대로다.
 * 누르지 않는다 — 상태가 없다. 막힌 줄 안이면 그 줄의 규칙(모든 글 fg-disabled)을 부르는 쪽이 className 으로 준다.
 */

type TagGroupSize = "t2" | "t3" | "t4";
type TagGroupTone = "neutralSubtle" | "neutral" | "brand";
type TagGroupWeight = "regular" | "bold";

type TagGroupContextValue = { size: TagGroupSize; truncate: boolean; tone: TagGroupTone; weight: TagGroupWeight };
const TagGroupContext = React.createContext<TagGroupContextValue>({ size: "t2", truncate: false, tone: "neutralSubtle", weight: "regular" });

// 묶음 — 글자는 묶음이 정한다(줄 상자 = 그 크기의 줄 높이). wrap 은 inline-block 이라 둘레 글의 줄 높이를 따르지 않는다
const tagGroupVariants = cva("font-sans", {
  variants: {
    size: {
      t2: "text-t2",
      t3: "text-t3",
      t4: "text-t4",
    },
    truncate: {
      false: "inline-block break-keep [overflow-wrap:break-word]",
      // min-width 0 — 제목 옆처럼 flex 줄의 칸이어도 줄어들어 말줄임한다
      true: "inline-flex min-w-0 max-w-full items-center whitespace-nowrap",
    },
  },
  defaultVariants: { size: "t2", truncate: false },
});

const tagGroupItemVariants = cva("", {
  variants: {
    tone: {
      neutralSubtle: "text-fg-neutral-subtle",
      neutral: "text-fg-neutral",
      brand: "text-fg-brand",
    },
    weight: {
      regular: "font-normal",
      bold: "font-bold",
    },
    // wrap 은 글 흐름 안(inline — 항목 안 띄어쓰기에서도 줄이 바뀐다), truncate 는 한 줄의 칸(줄어들며 말줄임).
    // truncate 의 최소 폭은 style 이 준다(itemMinWidth — 첫 글자 + "…" + 아이콘)
    truncate: {
      false: "inline",
      true: "inline-flex min-w-0 items-center",
    },
  },
  defaultVariants: { tone: "neutralSubtle", weight: "regular", truncate: false },
});

// 아이콘 — 상자 높이를 줄 높이(1lh)로 두고 가운데. wrap 은 줄 상자 위에 맞춰(vertical-align top) 줄 높이를 늘리지 않는다
const ICON = "inline-flex h-[1lh] shrink-0 items-center align-top [&>svg]:shrink-0";
const ICON_SIZE: Record<TagGroupSize, string> = {
  t2: "[&>svg]:size-x3",
  t3: "[&>svg]:size-[13px]",
  t4: "[&>svg]:size-x3_5",
};

// 항목 글 — wrap 은 안쪽 띄어쓰기에서 줄을 바꾸고(묶음 칸의 nowrap 을 푼다), truncate 는 각자 말줄임
const LABEL: Record<"wrap" | "truncate", string> = {
  wrap: "whitespace-normal",
  truncate: "min-w-0 truncate",
};

// 줄어드는 항목의 최소 폭 — 글 칸에 첫 글자 + "…" 가 남는 2.1em(글자 크기를 따른다) + 아이콘(12 · 13 · 14) · 사이 2.
// 두 글자 이하인 글은 글 폭 그대로(max-content — 넓히지 않는다). 최소 폭은 항목 칸에 준다 — 글 칸(overflow hidden)의 최소 폭은
// 항목의 최소 크기로 올라가지 않는다. 사용자 결정 2026-10-17 — 03-E 결정 5 B
const LABEL_MIN = "2.1em";
const ICON_PX: Record<TagGroupSize, number> = { t2: 12, t3: 13, t4: 14 };
const graphemes =
  typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemeCount = (text: string) => (graphemes ? Array.from(graphemes.segment(text)).length : Array.from(text).length);
const itemMinWidth = (node: React.ReactNode, size: TagGroupSize, icon: boolean) =>
  (typeof node === "string" || typeof node === "number") && graphemeCount(String(node).trim()) <= 2
    ? "max-content"
    : icon
      ? `calc(${LABEL_MIN} + ${ICON_PX[size]}px + var(--spacing-x0_5))`
      : LABEL_MIN;

// 묶음 칸 — 항목 하나 + 뒤 구분. wrap 은 칸을 nowrap 으로 두어 아이콘 ↔ 글 · 글(아이콘) ↔ 구분 사이에서 줄이 바뀌지 않게 한다.
// 아이콘은 한 덩어리(inline-flex)라 그 앞뒤는 NBSP · 이음 문자가 있어도 줄바꿈 자리가 된다(CSS Text) — 둘의 가장 가까운 공통
// 조상의 white-space 만 그 자리를 막는다. 글 안 · 구분 뒤 공백은 normal 로 풀어 거기서만 줄이 바뀐다.
// truncate 는 칸을 contents 로 지워 항목 · 구분이 묶음의 flex 칸이 된다
const UNIT: Record<"wrap" | "truncate", string> = {
  wrap: "whitespace-nowrap",
  truncate: "contents",
};

// 구분 — 보이는 " · "(숨김) + 보이지 않는 ", "(읽힘). wrap 은 normal — 뒤 공백이 줄바꿈 자리라 다음 항목이 다음 줄에서 시작한다.
// truncate 의 칸은 줄지 않고, 앞뒤 공백을 지키게 pre 로 둔다
const SEPARATOR = "font-normal text-fg-disabled";
const SEPARATOR_MODE: Record<"wrap" | "truncate", string> = {
  wrap: "whitespace-normal",
  truncate: "shrink-0 whitespace-pre",
};
const SEPARATOR_GLYPH = "\u00A0\u00B7\u0020";

const isBlank = (node: React.ReactNode) =>
  React.Children.toArray(node).every((n) => typeof n === "string" && n.trim() === "");

// wrap 의 뒤 아이콘 — Chromium 은 글 바로 뒤 아이콘 앞의 줄바꿈 자리를 글 쪽 white-space 로 정해, 칸이 nowrap 이어도 아이콘만
// 다음 줄로 넘긴다. 그래서 아이콘을 글의 마지막 낱말과 같은 nowrap 칸 안에 둔다(글 안 다른 띄어쓰기에서는 그대로 줄을 바꾼다).
// 글이 문자열이 아니면 글 전체를 아이콘과 함께 nowrap 으로 둔다
function withSuffixIcon(children: React.ReactNode, icon: React.ReactNode): { label: React.ReactNode; nowrap: boolean } {
  if (typeof children !== "string" && typeof children !== "number") return { label: <>{children}{icon}</>, nowrap: true };
  const text = String(children);
  const cut = text.search(/\s\S+\s*$/) + 1;
  return {
    label: (
      <>
        {text.slice(0, cut)}
        <span className="whitespace-nowrap">
          {text.slice(cut)}
          {icon}
        </span>
      </>
    ),
    nowrap: false,
  };
}

export interface TagGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 글자 크기 — t2 12/16(기본) · t3 13/18 · t4 14/19. 묶음에 하나 */
  size?: TagGroupSize;
  /** true 면 한 줄 + 항목마다 말줄임, false(기본)면 낱말 단위 줄바꿈 */
  truncate?: boolean;
  /** 항목의 기본 톤 — 기본 neutralSubtle */
  tone?: TagGroupTone;
  /** 항목의 기본 굵기 — 기본 regular */
  weight?: TagGroupWeight;
}

const TagGroup = React.forwardRef<HTMLSpanElement, TagGroupProps>(
  ({ className, size = "t2", truncate = false, tone = "neutralSubtle", weight = "regular", children, ...props }, ref) => {
    const context = React.useMemo(() => ({ size, truncate, tone, weight }), [size, truncate, tone, weight]);
    const mode = truncate ? "truncate" : "wrap";
    // 빈 항목을 뺀다 — 구분이 두 번 찍히거나 끝에 남지 않게
    const items = React.Children.toArray(children).filter((child) => {
      if (typeof child === "string") return child.trim() !== "";
      if (React.isValidElement<TagGroupItemProps>(child) && child.type === TagGroupItem) {
        const { children: label, prefixIcon, suffixIcon } = child.props;
        return !isBlank(label) || prefixIcon != null || suffixIcon != null;
      }
      return true;
    });
    return (
      <TagGroupContext.Provider value={context}>
        <span ref={ref} data-slot="tag-group" className={cn(tagGroupVariants({ size, truncate }), className)} {...props}>
          {items.map((child, i) => (
            <span key={React.isValidElement(child) && child.key != null ? child.key : i} data-slot="tag-group-unit" className={UNIT[mode]}>
              {typeof child === "string" || typeof child === "number" ? <TagGroupItem>{child}</TagGroupItem> : child}
              {i < items.length - 1 && (
                <span data-slot="tag-group-separator" className={cn(SEPARATOR, SEPARATOR_MODE[mode])}>
                  <span aria-hidden>{SEPARATOR_GLYPH}</span>
                  <span className="sr-only">, </span>
                </span>
              )}
            </span>
          ))}
        </span>
      </TagGroupContext.Provider>
    );
  },
);
TagGroup.displayName = "TagGroup";

type TagGroupItemIcon =
  | {
      /** 앞 아이콘 — 항목 글자색을 따른다(보조 기술에는 숨긴다) */
      prefixIcon?: React.ReactNode;
      suffixIcon?: never;
    }
  | {
      prefixIcon?: never;
      /** 뒤 아이콘 — 항목 글자색을 따른다(보조 기술에는 숨긴다) */
      suffixIcon?: React.ReactNode;
    };

export type TagGroupItemProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  TagGroupItemIcon & {
    /** 글 — 6 ~ 10자, 조사 · 접속어 없이 */
    children?: React.ReactNode;
    /** 톤 — 묶음의 tone 을 덮는다 */
    tone?: TagGroupTone;
    /** 굵기 — 묶음의 weight 를 덮는다 */
    weight?: TagGroupWeight;
    /** truncate 일 때 줄어드는 정도 — 기본 1, 0 은 줄지 않고 1 이상은 넘친 폭을 '글 폭 × shrink' 비율로 나눠 함께 준다 */
    shrink?: number;
    /** 보조 기술이 읽을 글 — 주면 보이는 글 · 아이콘을 숨기고 이 글을 읽는다("분할 2건" · "조회 12") */
    srLabel?: string;
  };

const TagGroupItem = React.forwardRef<HTMLSpanElement, TagGroupItemProps>(
  ({ className, style, tone, weight, prefixIcon, suffixIcon, shrink = 1, srLabel, children, ...props }, ref) => {
    const group = React.useContext(TagGroupContext);
    const mode = group.truncate ? "truncate" : "wrap";
    const hideText = srLabel != null && srLabel !== "";
    const icon = (node: React.ReactNode, side: "prefix" | "suffix") => (
      <span
        aria-hidden
        data-slot={`tag-group-item-${side}-icon`}
        className={cn(ICON, ICON_SIZE[group.size], side === "prefix" ? "mr-x0_5" : "ml-x0_5")}
      >
        {node}
      </span>
    );
    // wrap 의 뒤 아이콘은 글 안(마지막 낱말과 한 칸), truncate 는 글 밖(글만 말줄임 — 아이콘은 잘리지 않는다)
    const glued = mode === "wrap" && suffixIcon != null ? withSuffixIcon(children, icon(suffixIcon, "suffix")) : null;
    return (
      <span
        ref={ref}
        data-slot="tag-group-item"
        className={cn(tagGroupItemVariants({ tone: tone ?? group.tone, weight: weight ?? group.weight, truncate: group.truncate }), className)}
        style={group.truncate ? { flexShrink: shrink, minWidth: itemMinWidth(children, group.size, prefixIcon != null || suffixIcon != null), ...style } : style}
        {...props}
      >
        {prefixIcon != null && icon(prefixIcon, "prefix")}
        <span data-slot="tag-group-item-label" aria-hidden={hideText || undefined} className={glued?.nowrap ? "whitespace-nowrap" : LABEL[mode]}>
          {glued ? glued.label : children}
        </span>
        {suffixIcon != null && !glued && icon(suffixIcon, "suffix")}
        {hideText && <span className="sr-only">{srLabel}</span>}
      </span>
    );
  },
);
TagGroupItem.displayName = "TagGroupItem";

export { TagGroup, TagGroupItem, tagGroupVariants, tagGroupItemVariants };
