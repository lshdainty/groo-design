import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Groo Typography (shadcn 베이스 + Groo 디자인 토큰)
 *
 * shadcn/ui의 Typography는 컴포넌트가 아닌 prose 가이드 — 마크다운 렌더링 결과의
 * 표준 클래스 모음. 우리는 Groo typography 토큰을 사용하는 wrapper 컴포넌트를
 * 옵션으로 제공 (선택 사항 — Tailwind utility로 직접 사용해도 됨).
 *
 * - h1/h2/h3/h4/p/blockquote/code/lead/large/small/muted 11종
 * - 모든 요소는 Groo typography 토큰(--text-display-md, --text-body-md 등) 사용
 */

const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("text-display-md font-bold tracking-tight text-text-primary", className)}
    {...props}
  />
));
TypographyH1.displayName = "TypographyH1";

const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-display-sm font-bold tracking-tight text-text-primary border-b border-border-default pb-2",
      className,
    )}
    {...props}
  />
));
TypographyH2.displayName = "TypographyH2";

const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-title-lg font-bold tracking-tight text-text-primary", className)}
    {...props}
  />
));
TypographyH3.displayName = "TypographyH3";

const TypographyH4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-title-md font-semibold tracking-tight text-text-primary", className)}
    {...props}
  />
));
TypographyH4.displayName = "TypographyH4";

const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-body-md text-text-primary", className)} {...props} />
));
TypographyP.displayName = "TypographyP";

const TypographyBlockquote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      "border-l-4 border-border-default pl-4 italic text-text-secondary",
      className,
    )}
    {...props}
  />
));
TypographyBlockquote.displayName = "TypographyBlockquote";

const TypographyInlineCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "rounded bg-surface-input px-1.5 py-0.5 font-mono text-body-sm text-text-primary",
      className,
    )}
    {...props}
  />
));
TypographyInlineCode.displayName = "TypographyInlineCode";

const TypographyLead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-lg text-text-secondary", className)}
    {...props}
  />
));
TypographyLead.displayName = "TypographyLead";

const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-label-sm text-text-tertiary", className)}
    {...props}
  />
));
TypographyMuted.displayName = "TypographyMuted";

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyLead,
  TypographyMuted,
};
