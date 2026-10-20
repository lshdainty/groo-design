import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Groo Badge — 구조는 SEED Badge(2026-10-03). 수치 원본은 specs/components/badge.yaml.
 *
 *   Badge        대상의 상태 · 분류를 한두 낱말로 보이는 작은 라벨 — <span>. 누르지 않는다(호버 · 누름 · 포커스 · 비활성이 없다)
 *   BadgeGroup   한 대상의 배지 묶음 — 둘까지, 사이 4. 줄을 바꾸지 않는다
 *
 *   variant  weak(기본) — 옅은 바탕 bg-{톤}-weak + 진한 글자 fg-{톤}-contrast · 500. 반복되는 목록 · 분류 · 부가 정보
 *            solid — 채움 bg-{톤}-solid + 흰 글자 · 700. 한 화면에서 꼭 눈에 띄어야 할 상태 하나 · 사진 위
 *            outline — 투명 + 안쪽 1px 옅은 선 stroke-{톤}-weak + 의미 색 글자 fg-{톤} · 700. 상세 · 본문의 중간 강조
 *   tone     neutral(기본) · brand · informative · positive · warning · critical — 색은 variant × tone 두 축이 함께 정한다
 *   size     medium 20(기본) — 좌우 6 · 위아래 2 · 모서리 4 · t1 11/15 · 앞 아이콘 12
 *            large 24 — 좌우 8 · 위아래 4 · 모서리 6 · t2 12/16 · 앞 아이콘 14
 *
 * 중립만 짝이 다르다 — weak 는 bg-neutral-weak + fg-neutral-muted, solid 는 bg-neutral-inverted + fg-neutral-inverted(다크에서
 * 밝은 면 + 짙은 글자로 뒤집힌다), outline 은 stroke-neutral-weak + fg-neutral-muted. warning solid 는 주황 + 흰 글자다(SEED 의
 * 노랑 + 검정 글자가 아니다). outline 테두리는 안쪽 1px(inset box-shadow)이라 상자 크기가 변하지 않는다.
 * 중립 weak 의 바탕은 회색 바탕(bg-layer-basement)과 같은 색이라 흰 표면(bg-layer-default) · 시트 위에 둔다 — 회색 위면 outline.
 *
 * 글은 글자 크기 설정을 따르고(t1 · t2 — rem) 최소 높이 20 · 24 는 px 그대로라, 글이 커지면 상자가 따라 커진다.
 * 최대 폭이 없다 — 한 줄이고, 부모가 좁거나(flex 안) 쓰는 쪽이 폭을 막을 때만 글이 말줄임(…)한다. 글 전체는 DOM 에 남아
 * 보조 기술이 다 읽는다. 역할이 없는 글이라 앞뒤 글(줄 이름)과 이어 읽힌다. 앞 아이콘은 aria-hidden — 글자색을 따르고,
 * 크기는 배지가 정한다. 상태가 바뀌면 글 · 색이 바로 바뀐다(모션 없음).
 * 배지 안에 버튼을 넣지 않는다 — 뜻을 더 설명해야 하면 배지 옆에 ⓘ Help Bubble. 누르는 라벨은 Chip 이다.
 */

type BadgeSize = "medium" | "large";

const badgeVariants = cva(
  "inline-flex min-w-0 cursor-default items-center gap-x0_5 overflow-hidden whitespace-nowrap font-sans",
  {
    variants: {
      variant: {
        weak: "font-medium",
        solid: "font-bold",
        outline: "bg-transparent font-bold",
      },
      tone: {
        neutral: "",
        brand: "",
        informative: "",
        positive: "",
        warning: "",
        critical: "",
      },
      size: {
        medium: "min-h-x5 rounded-r1 px-x1_5 py-x0_5 text-t1",
        large: "min-h-x6 rounded-r1_5 px-x2 py-x1 text-t2",
      },
    },
    compoundVariants: [
      // weak — 옅은 바탕 + 진한 글자
      { variant: "weak", tone: "neutral", className: "bg-bg-neutral-weak text-fg-neutral-muted" },
      { variant: "weak", tone: "brand", className: "bg-bg-brand-weak text-fg-brand-contrast" },
      { variant: "weak", tone: "informative", className: "bg-bg-informative-weak text-fg-informative-contrast" },
      { variant: "weak", tone: "positive", className: "bg-bg-positive-weak text-fg-positive-contrast" },
      { variant: "weak", tone: "warning", className: "bg-bg-warning-weak text-fg-warning-contrast" },
      { variant: "weak", tone: "critical", className: "bg-bg-critical-weak text-fg-critical-contrast" },
      // solid — 채움 + 흰 글자(중립은 뒤집힌 면 + 뒤집힌 글자)
      { variant: "solid", tone: "neutral", className: "bg-bg-neutral-inverted text-fg-neutral-inverted" },
      { variant: "solid", tone: "brand", className: "bg-bg-brand-solid text-static-white" },
      { variant: "solid", tone: "informative", className: "bg-bg-informative-solid text-static-white" },
      { variant: "solid", tone: "positive", className: "bg-bg-positive-solid text-static-white" },
      { variant: "solid", tone: "warning", className: "bg-bg-warning-solid text-static-white" },
      { variant: "solid", tone: "critical", className: "bg-bg-critical-solid text-static-white" },
      // outline — 안쪽 1px 옅은 선 + 의미 색 글자
      { variant: "outline", tone: "neutral", className: "text-fg-neutral-muted shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]" },
      { variant: "outline", tone: "brand", className: "text-fg-brand shadow-[inset_0_0_0_1px_var(--color-stroke-brand-weak)]" },
      { variant: "outline", tone: "informative", className: "text-fg-informative shadow-[inset_0_0_0_1px_var(--color-stroke-informative-weak)]" },
      { variant: "outline", tone: "positive", className: "text-fg-positive shadow-[inset_0_0_0_1px_var(--color-stroke-positive-weak)]" },
      { variant: "outline", tone: "warning", className: "text-fg-warning shadow-[inset_0_0_0_1px_var(--color-stroke-warning-weak)]" },
      { variant: "outline", tone: "critical", className: "text-fg-critical shadow-[inset_0_0_0_1px_var(--color-stroke-critical-weak)]" },
    ],
    defaultVariants: {
      variant: "weak",
      tone: "neutral",
      size: "medium",
    },
  },
);

// 앞 아이콘 — 12 · 14(px 그대로), 글자색. Tailwind 는 소스의 글자 그대로를 읽으므로 크기마다 다 적는다
const PREFIX_ICON = "flex shrink-0 items-center justify-center [&>svg]:shrink-0";
const PREFIX_ICON_SIZE: Record<BadgeSize, string> = {
  medium: "[&>svg]:size-x3",
  large: "[&>svg]:size-x3_5",
};

// 글 — 한 줄. 부모가 좁을 때만 말줄임(min-width 0 · overflow hidden)
const LABEL = "min-w-0 truncate";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** 글 — 한두 낱말 · 명사("예정" · "연체 3" · "한도 초과") */
  children: React.ReactNode;
  /** 앞 아이콘(lucide) — 크기는 배지가 정하고(12 · 14) 색은 글자색을 따른다. 보조 기술에는 숨긴다 */
  prefixIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, tone, size, prefixIcon, children, ...props }, ref) => (
    <span ref={ref} data-slot="badge" className={cn(badgeVariants({ variant, tone, size }), className)} {...props}>
      {prefixIcon != null && prefixIcon !== false && (
        <span aria-hidden data-slot="badge-prefix-icon" className={cn(PREFIX_ICON, PREFIX_ICON_SIZE[size ?? "medium"])}>
          {prefixIcon}
        </span>
      )}
      <span data-slot="badge-label" className={LABEL}>
        {children}
      </span>
    </span>
  ),
);
Badge.displayName = "Badge";

// 묶음 — 배지 사이 4, 줄을 바꾸지 않는다(넘치면 배지가 글을 말줄임 — 셋 이상 필요하면 중요한 것만 남긴다)
const badgeGroupVariants = cva("inline-flex min-w-0 max-w-full flex-nowrap items-center gap-x1");

export type BadgeGroupProps = React.HTMLAttributes<HTMLSpanElement>;

const BadgeGroup = React.forwardRef<HTMLSpanElement, BadgeGroupProps>(({ className, ...props }, ref) => (
  <span ref={ref} data-slot="badge-group" className={cn(badgeGroupVariants(), className)} {...props} />
));
BadgeGroup.displayName = "BadgeGroup";

export { Badge, BadgeGroup, badgeVariants, badgeGroupVariants };
