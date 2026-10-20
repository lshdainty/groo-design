import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Groo Notification Badge — 구조는 SEED Notification Badge(2026-10-03). 수치 원본은 specs/components/notification-badge.yaml.
 *
 *   NotificationBadge         붙을 대상(아이콘 · 글)을 감싸고 그 상자 위에 점 · 숫자를 겹쳐 놓는다 — 자리를 차지하지 않아
 *                             아이콘 크기 · 버튼 높이 · 탭 폭 · 줄 높이가 그대로다
 *   formatNotificationCount   숫자 표기 — 0 이하 null(배지 없음) · 1 ~ 99 그대로 · 100 이상 "99+". 앱과 같은 규칙
 *
 *   size    small(기본) — 점 6, 브랜드 글자색 fg-brand(다크에서 밝은 짝 — bg-brand-solid 는 다크 표면과 1.73 · 2.86 이라
 *           쓰지 않는다). 새 것이 있는지만. visible 로 보일지 고른다(기본 true)
 *           large — 숫자 알약: 높이 18 · 최소 폭 18 · 좌우 4, bg-brand-solid + 흰 숫자 11/15 · 700 · 숫자 폭 고정. 몇 개인지가
 *           판단에 필요할 때만. count 로 수를 준다 — 0 이하면 숨기고 100 이상이면 "99+"
 *   attach  icon(기본) — 아이콘 상자에서 잰다(버튼 상자가 아니다). 점은 오른쪽 위 안쪽 1 — 24 아이콘이면 x 17 ~ 23 · y 1 ~ 7.
 *           숫자는 왼쪽 아래 꼭짓점이 (아이콘 폭 − 8, 14) — 24 아이콘이면 left 16 · top −4, 위 · 오른쪽으로 튀어나와
 *           숫자가 길수록 오른쪽으로 자란다(한 자리면 아이콘 버튼 안, 두 자리 · 99+ 는 버튼 밖으로 나간다)
 *           text — 글 끝 + 2 · 글 줄 상자의 위 끝(글자 상자보다 1 위). 점 · 알약 모두
 *
 * 크기 · 자리는 고정이다 — 화면마다 옮기지 않는다. 숫자는 글자 크기 설정을 따르지 않는다(text-t1-static — px): 커지면 아이콘을
 * 덮기 때문이다(SEED 와 같다). 그래서 높이는 늘 18 이고 폭만 숫자를 따른다(1 · 8 은 18 × 18). 점 · 숫자 · 자리도 px 그대로다.
 * 나타나고 사라질 때 모션이 없고, 반복 모션(깜빡임 · 퍼짐)도 없다. 배지는 누르지 않는다 — 붙은 버튼 · 탭이 누른다.
 *
 * 이름 — 점 · 숫자는 aria-hidden 이라 보조 기술이 읽지 않는다. 알림은 붙은 버튼 · 탭의 이름에 직접 넣는다:
 *   아이콘 버튼 · 점     aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"}
 *   아이콘 버튼 · 숫자   aria-label={unread > 0 ? `알림, 새 알림 ${unread}개` : "알림"} — 줄이지 않은 수("새 알림 128개")
 *   탭 · 점              탭 글 뒤 숨은 글 "새 소식"(Tabs · Segmented Control — 하나로, 2026-10-15 Q-010-4)
 * 수가 바뀌어도 소리로 알리지 않는다(라이브 영역 없음) — 버튼에 초점이 오면 새 이름을 읽는다. 꼭 바로 알려야 하면 Snackbar.
 * 보면(목록을 열면 · 그 탭을 고르면) 바로 지운다. 늘 있는 개수(걸린 필터 2개 · 거래 3건)는 알림 배지가 아니다.
 */

/** 숫자 표기 — 0 이하(소수는 버림)면 null(배지 없음), 100 이상이면 "99+". 앱과 같은 규칙 */
function formatNotificationCount(count: number): string | null {
  const n = Math.floor(count);
  if (!(n > 0)) return null;
  return n >= 100 ? "99+" : String(n);
}

// 붙을 대상 — 상자가 곧 아이콘 · 글의 상자다(inline-flex: 아이콘이면 아이콘 크기, 글이면 글 줄 상자)
const TARGET = "relative inline-flex";

const notificationBadgeVariants = cva("absolute", {
  variants: {
    size: {
      small: "size-x1_5 rounded-full bg-fg-brand",
      large: [
        "inline-flex min-h-x4_5 min-w-x4_5 items-center justify-center rounded-full bg-bg-brand-solid px-x1",
        "whitespace-nowrap font-sans text-t1-static font-bold text-static-white tabular-nums",
      ].join(" "),
    },
    attach: {
      icon: "",
      text: "left-[calc(100%+2px)] top-0",
    },
  },
  compoundVariants: [
    // 점 — 오른쪽 위 꼭짓점이 (아이콘 폭 − 1, 1)
    { size: "small", attach: "icon", className: "right-px top-px" },
    // 숫자 — 왼쪽 아래 꼭짓점이 (아이콘 폭 − 8, 14)
    { size: "large", attach: "icon", className: "bottom-[calc(100%-14px)] left-[calc(100%-8px)]" },
  ],
  defaultVariants: { size: "small", attach: "icon" },
});

type NotificationBadgeKind =
  | {
      /** 점(기본) — 새 것이 있는지만 */
      size?: "small";
      /** 점을 보일지 — 기본 true. 사용자가 보면 끈다 */
      visible?: boolean;
      count?: never;
    }
  | {
      /** 숫자 — 몇 개인지가 판단에 필요할 때만 */
      size: "large";
      /** 안 읽은 수 — 0 이하면 배지가 없고, 100 이상이면 "99+". 버튼 이름에는 줄이지 않은 수를 넣는다 */
      count: number;
      visible?: never;
    };

export type NotificationBadgeProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  NotificationBadgeKind & {
    /** 붙는 자리 — icon(기본, 아이콘 상자에서 잰다) · text(글 끝 + 2 · 줄 상자 위 끝) */
    attach?: "icon" | "text";
    /** 붙을 대상 — 아이콘(lucide) 또는 글 */
    children: React.ReactNode;
  };

const NotificationBadge = React.forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  ({ className, size = "small", attach = "icon", visible = true, count, children, ...props }, ref) => {
    const label = size === "large" ? formatNotificationCount(count ?? 0) : null;
    const shown = size === "large" ? label !== null : visible;
    return (
      <span ref={ref} data-slot="notification-badge-target" className={cn(TARGET, className)} {...props}>
        {children}
        {shown && (
          <span aria-hidden data-slot="notification-badge" data-size={size} className={notificationBadgeVariants({ size, attach })}>
            {label}
          </span>
        )}
      </span>
    );
  },
);
NotificationBadge.displayName = "NotificationBadge";

export { NotificationBadge, formatNotificationCount, notificationBadgeVariants };
