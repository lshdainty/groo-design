import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useExpandMotion } from "@/components/ui/accordion";
import { Checkmark, type CheckmarkProps } from "@/components/ui/checkbox";
import { Radiomark, submitOnRadioEnter, type RadiomarkProps } from "@/components/ui/radio-group";
import { Switchmark, type SwitchmarkProps } from "@/components/ui/switch";

/*
 * Porest List — 구조는 SEED List(2026-10-01). 수치 원본은 specs/components/list.yaml · list-header.yaml.
 *
 *   List · ListItem          목록(ul) · 보기만 하는 줄
 *   ListButtonItem · ListLinkItem   줄 전체가 버튼 · 링크(뒤 붙이개의 작은 버튼은 따로 눌린다)
 *   ListSwitchItem · ListCheckItem · ListRadioItem   줄 전체가 라벨 — 줄 어디를 눌러도 끼운 컨트롤이 바뀐다
 *   ListRadioGroup · ListCheckGroup   하나 고르기(role=radiogroup) · 여럿 고르기(fieldset) 묶음 — 줄은 li 대신 div
 *   itemRadius               목록 · 묶음의 누름 바탕 모서리(기본 radius-r2_5) — 카드 안에서는 카드 모서리 − 카드 가장자리에서 바탕까지 거리
 *   ListDivider · ListHeader · ListTile   줄 사이 선(필요할 때만) · 목록 제목 · 내용 줄의 앞 타일
 *   ListParentItem           하위 줄을 접는 부모 줄(2026-10-10 — 카테고리). ListButtonItem 의 속성에 collapsible(기본 true) · expandLabel(꺾쇠 단추의
 *                            고정 이름 — "{카테고리} 하위 카테고리", 접는 줄이면 필수 · 하위가 없는 줄에도 준다) · open · defaultOpen · onOpenChange(open) 를
 *                            더 받고, 자식(ListButtonItem …)이 하위 줄이 된다. 두 갈래는 유니언 타입이다 — collapsible={false} 없이 expandLabel 을
 *                            빠뜨리면 타입 오류(2026-10-15 사용자 결정 — 구현 세션 질문 Q-002, 안 B). 줄 앞 4 · 꺾쇠 단추 44(보이는 상자 = 누르는 영역, 모서리 10 · chevron-right 20 fg-neutral-subtle ·
 *                            펼치면 90° 300ms) · 그 뒤 4 를 지나 앞 붙이개가 52 에서 시작한다. 단추는 줄과 따로 눌린다(aria-expanded · aria-controls,
 *                            이름은 상태마다 바꾸지 않는다) — 줄을 누르면 하는 일(편집)은 그대로. 하위 줄은 부모의 제목 자리 104 에서 시작하고
 *                            (누름 바탕은 줄 폭 그대로), 높이 300ms 로 펼치고 접는다(모션 줄이기면 150ms 서서히 — Accordion 과 같다).
 *                            자식이 없거나 collapsible={false}(늘 펼친 편집 화면 — Tree View 의 collapsible 과 같은 뜻)면 꺾쇠 자리를 같은 폭으로 비운다 —
 *                            collapsible={false} 면 하위 줄이 늘 보이고 aria-expanded 가 없다. 한 목록의 맨 위 단계 줄은 모두 ListParentItem 으로 두어
 *                            타일 · 제목이 같은 자리에 서게 한다
 *
 * 한 줄은 두 층이다 — 바탕 층(li::before: 누름 · 호버 · 강조 바탕, 줄지 않는다)과 콘텐츠 층(앞 · 본문 · 뒤).
 * 누르면 바탕이 좌우 6 들어와 모서리 10 이 되고(SEED), 콘텐츠 층만 2px 거리로 준다(기초 Feedback v104) —
 * 배율 = (기준 − 2) ÷ 기준, 기준 = max(높이, 폭 ÷ 4, 24). Button 과 같이 누르는 순간(포인터 · 키) 줄을 재서 --press-basis 로 넘긴다.
 * 호버는 마우스 있는 기기에서만 누름과 같은 바탕(v106). 줄 안의 스위치 · 체크 · 라디오는 따로 줄지 않는다.
 * 누르는 줄의 버튼 · 링크는 ::after 로 줄 전체를 덮어 줄 어디를 눌러도 눌리고(포커스 링도 그 안쪽 2px),
 * 뒤 붙이개 안의 버튼 · 링크는 z-index 1 로 그 위에 올라 따로 눌린다(SEED 와 같은 짜임).
 * 글자: 제목 t5 · 400, 설명 t3 · fg-neutral-subtle(사용자 결정 — SEED 그대로). 좌우 여백은 spacing-global-gutter(24).
 *
 * 값이 길 때(2026-10-15 사용자 결정 — 구현 세션 질문 Q-001, 안 A): 뒤 붙이개는 줄지 않고(SEED suffix flexShrink 0) 본문이 양보한다(content flexGrow 1).
 * 겹침만 막는다 — 본문은 한 글자(제목 글자 1em, 뒤 여백 10 은 따로)까지 주고, 제목 · 글 설명은 칸 끝에서 끊는다(overflow-wrap: anywhere). suffix 에 글을 그대로 넘긴
 * 값 글자(이메일 · 계좌번호 · 긴 이름)는 본문이 1em 이 된 뒤에야 줄고 줄 끝에서 끊는다 — 본문 위로 넘쳐 덮지 않는다. 금액 · 화살표 · 컨트롤 같은
 * 요소는 한 덩어리 그대로다. 값을 줄여 적는 것(억 단위 등)은 그 화면이 정한다.
 */

const listVariants = cva("flex w-full flex-col");

// 줄(li) — 바탕 층과 컨테이너. 누르는 줄의 상태는 안쪽 [data-list-action](버튼 · 링크 · 라벨)에서 읽는다
const listItemVariants = cva(
  [
    "group/list-item relative flex w-full",
    "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-0 before:rounded-none before:bg-transparent before:content-['']",
    "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),inset_var(--motion-duration-color-transition)_var(--motion-ease-easing),border-radius_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
    "[@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:inset-x-x1_5 [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-layer-default-pressed",
    "has-[[data-list-action]:not([data-disabled]):active]:before:inset-x-x1_5 has-[[data-list-action]:not([data-disabled]):active]:before:rounded-[var(--list-item-radius,var(--radius-r2_5))] has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-layer-default-pressed",
  ].join(" "),
  {
    variants: {
      highlight: {
        none: "",
        highlighted:
          "before:bg-bg-brand-weak [@media(hover:hover)]:has-[[data-list-action]:not([data-disabled]):hover]:before:bg-bg-brand-weak-pressed has-[[data-list-action]:not([data-disabled]):active]:before:bg-bg-brand-weak-pressed",
      },
    },
    defaultVariants: { highlight: "none" },
  },
);

// 콘텐츠 층 — 앞 · 본문 · 뒤. 누르면 이 층만 준다. 하위 줄(nest) — 부모 줄은 줄 앞 4(꺾쇠 단추 44 + 4 를 지나 앞 붙이개가 52),
// 하위 줄은 부모의 제목 자리 104(= 4 + 44 + 4 + 타일 40 + 12)에서 시작한다
const listContentVariants = cva(
  [
    "relative flex w-full py-x3",
    "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
    "group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-has-[[data-list-action]:not([data-disabled]):active]/list-item:[scale:1]",
  ].join(" "),
  {
    variants: {
      align: {
        center: "items-center",
        top: "items-start",
      },
      nest: {
        none: "px-global-gutter",
        parent: "pl-x1 pr-global-gutter",
        child: "pl-[104px] pr-global-gutter",
      },
    },
    defaultVariants: { align: "center", nest: "none" },
  },
);

// 앞 붙이개 — 아이콘 22(fg-neutral). 막히면 아이콘 · 타일 모두 비활성 색(타일은 부르는 쪽의 카테고리 색을 덮는다)
const listPrefixVariants = cva("flex shrink-0 items-center pr-x3 text-fg-neutral [&>svg]:size-[22px]", {
  variants: { disabled: { true: "text-fg-disabled [&_[data-list-tile]]:bg-bg-disabled [&_[data-list-tile]]:text-fg-disabled", false: "" } },
  defaultVariants: { disabled: false },
});

// 본문 — 남는 폭을 쓰고 먼저 양보한다. 한 글자(1em) + 뒤 여백 10 아래로는 줄지 않는다(Q-001 A). 1em 은 제목 글자(t5) —
// 버튼이 물려받은 글자(14)가 아니라 --text-t5 로 잰다(보통 글자에서 16 + 10 = 26, 2026-10-17 고침 03D-005)
const listBodyVariants = cva("flex min-w-[calc(var(--text-t5)+var(--spacing-x2_5))] flex-1 flex-col items-start gap-x0_5 pr-x2_5 text-left");

// 제목 — 평소에는 단어 단위로 바꾸고, 본문이 낱말 하나보다 좁아질 때만 글자 사이에서 끊는다(칸 밖으로 넘치지 않게)
const listTitleVariants = cva("font-sans text-t5 font-normal text-fg-neutral [overflow-wrap:anywhere]", {
  variants: { disabled: { true: "text-fg-disabled", false: "" } },
  defaultVariants: { disabled: false },
});

// 강조 줄을 올리거나 누르는 동안 — 짙은 강조 바탕 위라 설명 · 값 글자를 한 단계 짙게(fg-neutral-subtle 은 4.32:1 로 모자란다)
const HIGHLIGHT_MUTED =
  "[@media(hover:hover)]:group-has-[[data-list-action]:not([data-disabled]):hover]/list-item:text-fg-neutral-muted group-has-[[data-list-action]:not([data-disabled]):active]/list-item:text-fg-neutral-muted";

// 설명 — 글 설명도 제목처럼 본문이 낱말 하나보다 좁아질 때만 글자 사이에서 끊는다(Q-001 A — 뒤 붙이개에 닿지 않게). Tag Group 설명은 그 스펙대로 한 줄 말줄임
const listDetailVariants = cva("font-sans text-t3 text-fg-neutral-subtle [overflow-wrap:anywhere]", {
  variants: {
    disabled: { true: "text-fg-disabled", false: "" },
    highlighted: { true: HIGHLIGHT_MUTED, false: "" },
  },
  defaultVariants: { disabled: false, highlighted: false },
});

// 뒤 붙이개 — 값 글자(t5 · 옅은 색) · 화살표 18. 안의 버튼 · 링크는 줄의 ::after 위로 올라 따로 눌린다
// 강조 줄을 올리거나 누르면 값 글자만 짙어진다 — 화살표는 그대로 옅은 색
// value: node(기본 — 금액 · 화살표 · 컨트롤 · 작은 버튼, 줄지 않는다) · text(suffix 에 글을 그대로 넘긴 값 글자 — 본문이 1em 이 된 뒤에야 줄고
// 줄 끝에서 끊는다, Q-001 A). 줄은 suffix 가 글(string · number)이면 text 를 고른다
const listSuffixVariants = cva(
  "flex items-center gap-x1 font-sans text-t5 text-fg-neutral-subtle [&>svg]:size-[18px] [&_a]:relative [&_a]:z-[1] [&_button]:relative [&_button]:z-[1]",
  {
    variants: {
      value: { node: "shrink-0", text: "min-w-0 shrink [overflow-wrap:anywhere]" },
      disabled: { true: "text-fg-disabled", false: "" },
      highlighted: { true: HIGHLIGHT_MUTED, false: "" },
    },
    compoundVariants: [{ disabled: false, highlighted: true, class: "[&>svg]:text-fg-neutral-subtle" }],
    defaultVariants: { value: "node", disabled: false, highlighted: false },
  },
);

// 뒤 붙이개의 갈래 — 글을 그대로 넘긴 값 글자면 text(줄 끝에서 끊는다), 그 밖의 요소는 node(한 덩어리)
const suffixValue = (suffix: React.ReactNode) => (typeof suffix === "string" || typeof suffix === "number" ? "text" : "node");

// 누르는 줄의 본문 버튼 · 링크 — ::after 가 줄 전체를 덮는다(누르는 영역 · 포커스 링)
const listActionVariants = cva(
  [
    "cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit] no-underline outline-none",
    "after:absolute after:inset-0 after:content-['']",
    "focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-stroke-focus-ring",
    "data-[disabled]:cursor-not-allowed",
  ].join(" "),
);

// 컨트롤 줄 — 줄 전체가 라벨
const listControlVariants = cva("cursor-pointer select-none data-[disabled]:cursor-not-allowed");

// 줄 사이 선 — 필요할 때만. 기본은 줄 폭 전체, inset 이면 좌우 24 들인다
const listDividerVariants = cva("h-px shrink-0 bg-stroke-neutral-subtle", {
  variants: { inset: { true: "mx-global-gutter", false: "w-full" } },
  defaultVariants: { inset: false },
});

const listHeaderVariants = cva("flex w-full items-center justify-between gap-x2_5 px-global-gutter py-x2 font-sans text-t4", {
  variants: {
    variant: {
      mediumWeak: "font-medium text-fg-neutral-subtle",
      boldSolid: "font-bold text-fg-neutral",
    },
  },
  defaultVariants: { variant: "mediumWeak" },
});

// 내용 줄의 앞 타일 — 40 · 모서리 12(크기 × 0.3). 바탕 · 아이콘 색은 카테고리 색(chart-{색}-weak · chart-{색})
const listTileVariants = cva("inline-grid size-10 shrink-0 place-items-center rounded-r3 [&>svg]:size-5");

// 끼운 컨트롤은 따로 줄지 않는다 — 줄의 콘텐츠가 함께 준다(v104). 라벨의 누름이 컨트롤로 넘어오므로 축소만 끈다.
// 컨트롤에도 data-list-action 을 단다 — 키보드(Space)로 누르면 :active 가 라벨이 아니라 컨트롤에 걸린다
const MARK_NO_SCALE = "active:[scale:1]";

type ItemBase = {
  title: React.ReactNode;
  detail?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** 새 알림처럼 주목이 필요한 줄 — 옅은 브랜드 바탕(list.yaml highlight) */
  highlighted?: boolean;
} & Pick<VariantProps<typeof listContentVariants>, "align">;

const hl = (highlighted?: boolean) => (highlighted ? "highlighted" : "none");

// 누르는 순간 기준 길이 max(높이, 폭 ÷ 4, 24) 를 --press-basis 로(Button 과 같은 식) — 줄은 폭 ÷ 4 가 커서 세로로는 2px 보다 덜 준다.
// 키보드(Space)로 눌러도 :active 가 걸리므로 keydown 에서도 잰다. 줄(li)에 달고 콘텐츠 층이 물려받는다.
function measurePress(el: HTMLElement) {
  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
}

function withPress<P extends React.HTMLAttributes<HTMLElement>>(props: P): P {
  return {
    ...props,
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      measurePress(e.currentTarget);
      // 누르는 동안 콘텐츠 층(누르는 영역)이 줄어 가장자리를 누른 포인터가 영역 밖에 남아도 click 이 그 줄로 가게 잡아 둔다.
      // 마우스 · 펜만 — 터치는 브라우저가 처음 누른 요소에 이미 잡는다
      const target = e.target as Element;
      if (e.pointerType !== "touch" && target.closest("[data-list-action]")) target.setPointerCapture?.(e.pointerId);
      props.onPointerDown?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      measurePress(e.currentTarget);
      props.onKeyDown?.(e);
    },
  };
}

function Body({ title, detail, disabled, highlighted }: { title: React.ReactNode; detail?: React.ReactNode; disabled?: boolean; highlighted?: boolean }) {
  return (
    <>
      <span className={cn(listTitleVariants({ disabled }))}>{title}</span>
      {detail && <span className={cn(listDetailVariants({ disabled, highlighted }))}>{detail}</span>}
    </>
  );
}

// 줄의 태그 — 목록(ul) 안에서는 li, 묶음(radiogroup · fieldset) 안에서는 div
const ListRowTag = React.createContext<"li" | "div">("li");

// 하위 줄인가 — ListParentItem 의 하위 줄 묶음 안이면 "child"(부모의 제목 자리 104 에서 시작)
const ListNestContext = React.createContext<"none" | "child">("none");
const useNest = () => React.useContext(ListNestContext);

type ItemRadius = {
  /** 누름 · 호버 바탕의 모서리(기본 radius-r2_5 10) — 카드 안에서는 카드 모서리 − 카드 가장자리에서 바탕까지 거리 */
  itemRadius?: string;
};
const radiusStyle = (itemRadius: string | undefined, style: React.CSSProperties | undefined) =>
  itemRadius ? ({ ...style, "--list-item-radius": itemRadius } as React.CSSProperties) : style;

export interface ListProps extends React.HTMLAttributes<HTMLUListElement>, ItemRadius {}

const List = React.forwardRef<HTMLUListElement, ListProps>(({ className, itemRadius, style, ...props }, ref) => (
  <ul ref={ref} className={cn(listVariants(), className)} style={radiusStyle(itemRadius, style)} {...props} />
));
List.displayName = "List";

export interface ListItemProps extends ItemBase, Omit<React.LiHTMLAttributes<HTMLLIElement>, "title" | "prefix"> {}

// 보기만 하는 줄 — 누르지 않는다(호버 · 누름 바탕 없음)
const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, title, detail, prefix, suffix, align, highlighted, ...props }, ref) => (
    <li ref={ref} className={cn(listItemVariants({ highlight: hl(highlighted) }), className)} {...props}>
      <div className={listContentVariants({ align, nest: useNest() })}>
        {prefix && <span className={listPrefixVariants()}>{prefix}</span>}
        <span className={listBodyVariants()}>
          <Body title={title} detail={detail} />
        </span>
        {suffix && <span className={listSuffixVariants({ value: suffixValue(suffix) })}>{suffix}</span>}
      </div>
    </li>
  ),
);
ListItem.displayName = "ListItem";

export interface ListButtonItemProps extends ItemBase, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title" | "prefix"> {
  rootProps?: React.LiHTMLAttributes<HTMLLIElement>;
}

// 누르는 줄 — 줄 전체가 버튼. 화면을 옮기면 suffix 에 오른쪽 화살표를 둔다
const ListButtonItem = React.forwardRef<HTMLButtonElement, ListButtonItemProps>(
  ({ className, title, detail, prefix, suffix, align, highlighted, disabled, rootProps: { className: rootClassName, ...rootRest } = {}, type = "button", ...props }, ref) => (
    <li className={cn(listItemVariants({ highlight: hl(highlighted) }), rootClassName)} {...withPress(rootRest)}>
      <div className={listContentVariants({ align, nest: useNest() })}>
        {prefix && <span className={cn(listPrefixVariants({ disabled }))}>{prefix}</span>}
        <button
          ref={ref}
          type={type}
          disabled={disabled}
          data-list-action=""
          data-disabled={disabled ? "" : undefined}
          className={cn(listActionVariants(), listBodyVariants(), className)}
          {...props}
        >
          <Body title={title} detail={detail} disabled={disabled} highlighted={highlighted} />
        </button>
        {suffix && <span className={cn(listSuffixVariants({ value: suffixValue(suffix), disabled, highlighted }))}>{suffix}</span>}
      </div>
    </li>
  ),
);
ListButtonItem.displayName = "ListButtonItem";

export interface ListLinkItemProps extends ItemBase, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title" | "prefix"> {
  asChild?: boolean;
  rootProps?: React.LiHTMLAttributes<HTMLLIElement>;
}

// 링크 줄 — 줄 전체가 링크. asChild 면 라우터의 Link 를 자식으로 — 제목 · 설명은 그 안에 넣어 준다
const ListLinkItem = React.forwardRef<HTMLAnchorElement, ListLinkItemProps>(
  ({ className, title, detail, prefix, suffix, align, highlighted, asChild = false, rootProps: { className: rootClassName, ...rootRest } = {}, children, ...props }, ref) => {
    const actionProps = { "data-list-action": "", className: cn(listActionVariants(), listBodyVariants(), className), ...props };
    const nest = useNest();
    return (
      <li className={cn(listItemVariants({ highlight: hl(highlighted) }), rootClassName)} {...withPress(rootRest)}>
        <div className={listContentVariants({ align, nest })}>
          {prefix && <span className={listPrefixVariants()}>{prefix}</span>}
          {asChild ? (
            <Slot ref={ref} {...actionProps}>
              <Slottable>{children}</Slottable>
              <Body title={title} detail={detail} highlighted={highlighted} />
            </Slot>
          ) : (
            <a ref={ref} {...actionProps}>
              <Body title={title} detail={detail} highlighted={highlighted} />
            </a>
          )}
          {suffix && <span className={cn(listSuffixVariants({ value: suffixValue(suffix), highlighted }))}>{suffix}</span>}
        </div>
      </li>
    );
  },
);
ListLinkItem.displayName = "ListLinkItem";

// 줄 앞 꺾쇠 단추 — 보이는 상자 = 누르는 영역 44 · 모서리 10 · 단추 뒤 4. 줄과 따로 눌린다(줄의 누름 바탕은 생기지 않는다):
// 올리거나 누르면 단추만 bg-layer-default-pressed, 누르면 2px 거리 축소(기준 44 → 0.955). 키보드 포커스에만 단추 안쪽 2px 링.
// 위아래 2 를 줄의 여백에 겹쳐 타일 40 줄의 높이(64)를 그대로 둔다. 줄의 버튼 ::after 위(z 1)에 놓인다
const LIST_EXPAND_BUTTON = [
  "relative z-[1] -my-x0_5 mr-x1 inline-flex size-11 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-r2_5 border-0 bg-transparent p-0 text-fg-neutral-subtle",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[--press-basis:44] [@media(hover:hover)]:hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 꺾쇠 20 — 접혀 있으면 오른쪽, 펼치면 아래(90° · 300ms easing, 모션 줄이기면 바로)
const LIST_EXPAND_ICON = "size-5 shrink-0 [transition:rotate_var(--motion-duration-d6)_var(--motion-ease-easing)] motion-reduce:transition-none";
// 하위가 없는 부모 줄 · 늘 펼친 편집 화면(collapsible={false}) — 꺾쇠 단추와 같은 폭의 빈 자리
const LIST_EXPAND_SLOT = "-my-x0_5 mr-x1 size-11 shrink-0";

/** 접는 부모 줄(기본) — 꺾쇠 단추의 이름이 필수다 */
type ListParentFoldProps = {
  /** 하위 줄을 접는다(기본 true) — Tree View 의 collapsible 과 같은 이름 · 같은 뜻 */
  collapsible?: true;
  /** 꺾쇠 단추의 고정 이름 — "{카테고리} 하위 카테고리". 필수 — 하위가 없는 줄에도 준다(꺾쇠 자리는 비운다) */
  expandLabel: string;
  /** 하위 줄 펼침 — 쥐고 다룰 때 */
  open?: boolean;
  /** 처음 펼침 — 화면이 정한다(카테고리는 모두 펼친 채 연다) */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** 늘 펼친 편집 화면 — 꺾쇠 자리는 비우고 하위 줄이 늘 보인다(aria-expanded 없음). 이름 · 펼침 상태를 받지 않는다 */
type ListParentFixedProps = {
  collapsible: false;
  expandLabel?: never;
  open?: never;
  defaultOpen?: never;
  onOpenChange?: never;
};

export type ListParentItemProps = ListButtonItemProps &
  (ListParentFoldProps | ListParentFixedProps) & {
    /** 하위 줄(ListButtonItem …) */
    children?: React.ReactNode;
  };

// 하위 줄을 접는 부모 줄 — li > 줄(바탕 층 · 콘텐츠 층) + 하위 줄 묶음(ul). 줄을 누르면 onClick(편집), 꺾쇠 단추는 펼치고 접기만
const ListParentItem = React.forwardRef<HTMLButtonElement, ListParentItemProps>(
  (
    {
      className,
      title,
      detail,
      prefix,
      suffix,
      align,
      highlighted,
      disabled,
      rootProps: { className: rootClassName, ...rootRest } = {},
      type = "button",
      collapsible = true,
      expandLabel,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      children,
      ...props
    },
    ref,
  ) => {
    const hasChildren = React.Children.toArray(children).length > 0;
    const foldable = hasChildren && collapsible;
    const [inner, setInner] = React.useState(defaultOpen);
    // 늘 펼친 편집 화면(collapsible={false})이면 하위 줄은 늘 보인다
    const open = foldable ? (openProp ?? inner) : hasChildren;
    const setOpen = (next: boolean) => {
      if (openProp === undefined) setInner(next);
      onOpenChange?.(next);
    };
    const subId = React.useId();
    const { ref: motionRef, hidden } = useExpandMotion<HTMLUListElement>(open);
    return (
      <li data-slot="list-parent-item" className={cn("flex w-full flex-col", rootClassName)} {...rootRest}>
        <div data-slot="list-parent-row" className={listItemVariants({ highlight: hl(highlighted) })} {...withPress({})}>
          <div className={listContentVariants({ align, nest: "parent" })}>
            {foldable ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={subId}
                aria-label={expandLabel}
                data-slot="list-expand-button"
                data-state={open ? "open" : "closed"}
                className={LIST_EXPAND_BUTTON}
                onClick={() => setOpen(!open)}
              >
                <ChevronRight aria-hidden strokeWidth={2} className={cn(LIST_EXPAND_ICON, open && "rotate-90")} />
              </button>
            ) : (
              <span aria-hidden data-slot="list-expand-slot" className={LIST_EXPAND_SLOT} />
            )}
            {prefix && <span className={cn(listPrefixVariants({ disabled }))}>{prefix}</span>}
            <button
              ref={ref}
              type={type}
              disabled={disabled}
              data-list-action=""
              data-disabled={disabled ? "" : undefined}
              className={cn(listActionVariants(), listBodyVariants(), className)}
              {...props}
            >
              <Body title={title} detail={detail} disabled={disabled} highlighted={highlighted} />
            </button>
            {suffix && <span className={cn(listSuffixVariants({ value: suffixValue(suffix), disabled, highlighted }))}>{suffix}</span>}
          </div>
        </div>
        {hasChildren && (
          <ListNestContext.Provider value="child">
            <ul ref={motionRef} id={subId} data-slot="list-sub-list" data-state={open ? "open" : "closed"} hidden={hidden} className={cn(listVariants(), "m-0 list-none p-0")}>
              {children}
            </ul>
          </ListNestContext.Provider>
        )}
      </li>
    );
  },
);
ListParentItem.displayName = "ListParentItem";

type ControlRowProps = ItemBase & { rootProps?: React.HTMLAttributes<HTMLElement> };

// 컨트롤 줄의 짜임 — li(묶음 안에서는 div) > label(콘텐츠 층 · 누르는 영역) > 앞 · 본문 · 뒤
function ControlRow({
  as,
  title,
  detail,
  prefix,
  suffix,
  align,
  highlighted,
  disabled,
  rootProps: { className: rootClassName, ...rootRest } = {},
  htmlFor,
}: ControlRowProps & { as?: "li" | "div"; disabled?: boolean; htmlFor?: string }) {
  const tag = React.useContext(ListRowTag);
  const nest = useNest();
  const Comp = (as ?? tag) as React.ElementType;
  return (
    <Comp className={cn(listItemVariants({ highlight: hl(highlighted) }), rootClassName)} {...withPress(rootRest)}>
      <label
        htmlFor={htmlFor}
        data-list-action=""
        data-disabled={disabled ? "" : undefined}
        className={cn(listContentVariants({ align, nest }), listControlVariants())}
      >
        {prefix && <span className={cn(listPrefixVariants({ disabled }))}>{prefix}</span>}
        <span className={listBodyVariants()}>
          <Body title={title} detail={detail} disabled={disabled} highlighted={highlighted} />
        </span>
        {suffix && <span className={cn(listSuffixVariants({ value: suffixValue(suffix), disabled, highlighted }))}>{suffix}</span>}
      </label>
    </Comp>
  );
}

export interface ListSwitchItemProps extends Omit<SwitchmarkProps, "title" | "prefix">, Omit<ControlRowProps, "suffix"> {}

// 스위치 줄 — 스위치는 뒤에, 제목 16 줄이라 32(Switch 스펙)
const ListSwitchItem = React.forwardRef<React.ElementRef<typeof Switchmark>, ListSwitchItemProps>(
  ({ title, detail, prefix, align, highlighted, rootProps, size = "32", className, id, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const sid = id ?? autoId;
    return (
      <ControlRow
        title={title}
        detail={detail}
        prefix={prefix}
        align={align}
        highlighted={highlighted}
        rootProps={rootProps}
        disabled={disabled}
        htmlFor={sid}
        suffix={<Switchmark ref={ref} id={sid} data-list-action="" size={size} disabled={disabled} className={cn(MARK_NO_SCALE, className)} {...props} />}
      />
    );
  },
);
ListSwitchItem.displayName = "ListSwitchItem";

export interface ListCheckItemProps extends Omit<CheckmarkProps, "title" | "prefix">, Omit<ControlRowProps, "suffix"> {
  /** 체크를 앞(기본) · 뒤 어디에 둘지 */
  markPosition?: "prefix" | "suffix";
}

// 체크 줄 — 여럿 고르기. 체크 24 를 앞(기본)이나 뒤에
const ListCheckItem = React.forwardRef<React.ElementRef<typeof Checkmark>, ListCheckItemProps>(
  ({ title, detail, prefix, align, highlighted, rootProps, markPosition = "prefix", size = "large", className, id, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const cid = id ?? autoId;
    const mark = <Checkmark ref={ref} id={cid} data-list-action="" size={size} disabled={disabled} className={cn(MARK_NO_SCALE, className)} {...props} />;
    return (
      <ControlRow
        title={title}
        detail={detail}
        prefix={markPosition === "prefix" ? mark : prefix}
        suffix={markPosition === "suffix" ? mark : undefined}
        align={align}
        highlighted={highlighted}
        rootProps={rootProps}
        disabled={disabled}
        htmlFor={cid}
      />
    );
  },
);
ListCheckItem.displayName = "ListCheckItem";

// 하나 고르기 목록 — 라디오 묶음(role=radiogroup, aria-label · aria-labelledby 필수). Enter 는 폼을 제출한다(Radio 와 같다)
const ListRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & ItemRadius
>(({ className, itemRadius, style, onKeyDown, ...props }, ref) => (
  <ListRowTag.Provider value="div">
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(listVariants(), className)}
      style={radiusStyle(itemRadius, style)}
      {...props}
      onKeyDown={submitOnRadioEnter(onKeyDown)}
    />
  </ListRowTag.Provider>
));
ListRadioGroup.displayName = "ListRadioGroup";

export interface ListCheckGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement>, ItemRadius {}

// 여럿 고르기 묶음 — fieldset(role=group, aria-label · aria-labelledby 필수). 체크 줄을 담는다(SEED 와 같다)
const ListCheckGroup = React.forwardRef<HTMLFieldSetElement, ListCheckGroupProps>(({ className, itemRadius, style, ...props }, ref) => (
  <ListRowTag.Provider value="div">
    <fieldset ref={ref} className={cn(listVariants(), "m-0 min-w-0 border-0 p-0", className)} style={radiusStyle(itemRadius, style)} {...props} />
  </ListRowTag.Provider>
));
ListCheckGroup.displayName = "ListCheckGroup";

export interface ListRadioItemProps extends Omit<RadiomarkProps, "title" | "prefix">, Omit<ControlRowProps, "suffix" | "rootProps"> {
  /** 라디오를 뒤(기본) · 앞 어디에 둘지 */
  markPosition?: "prefix" | "suffix";
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
}

// 라디오 줄 — 하나 고르기. 라디오 24 를 뒤(기본)에. ListRadioGroup 안에 둔다
const ListRadioItem = React.forwardRef<React.ElementRef<typeof Radiomark>, ListRadioItemProps>(
  ({ title, detail, prefix, align, highlighted, rootProps, markPosition = "suffix", size = "large", className, id, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const rid = id ?? autoId;
    const mark = <Radiomark ref={ref} id={rid} data-list-action="" size={size} disabled={disabled} className={cn(MARK_NO_SCALE, className)} {...props} />;
    return (
      <ControlRow
        title={title}
        detail={detail}
        prefix={markPosition === "prefix" ? mark : prefix}
        suffix={markPosition === "suffix" ? mark : undefined}
        align={align}
        highlighted={highlighted}
        rootProps={rootProps}
        disabled={disabled}
        htmlFor={rid}
      />
    );
  },
);
ListRadioItem.displayName = "ListRadioItem";

export interface ListDividerProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof listDividerVariants> {}

// 줄 사이 선 — 필요할 때만(기본은 선 없음). 목록 안에서는 li, 묶음 안에서는 div
const ListDivider = React.forwardRef<HTMLElement, ListDividerProps>(({ className, inset, ...props }, ref) => {
  const Comp = React.useContext(ListRowTag) as React.ElementType;
  return <Comp ref={ref} aria-hidden className={cn(listDividerVariants({ inset }), className)} {...props} />;
});
ListDivider.displayName = "ListDivider";

export interface ListHeaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listHeaderVariants> {
  asChild?: boolean;
}

// 목록 제목 — 목록 밖, 바로 위. 오른쪽에 작은 버튼을 둘 수 있다. 글이면 글 버튼(SEED Text Button, 2026-10-16 글자 역할 D2 —
// list-header.yaml action): <Button variant="ghost" size="small" className="-my-x2 -mr-x3_5 text-fg-neutral-muted"> — 14 · 700 · 보이는 36,
// 위아래로 블리드해 줄 높이를 바꾸지 않고 글자 끝이 줄 여백에 선다
const ListHeader = React.forwardRef<HTMLDivElement, ListHeaderProps>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={cn(listHeaderVariants({ variant }), className)} {...props} />;
});
ListHeader.displayName = "ListHeader";

// 내용 줄의 앞 타일 — 바탕 · 아이콘 색은 부르는 쪽이(카테고리 색)
const ListTile = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} data-list-tile="" className={cn(listTileVariants(), className)} {...props} />
));
ListTile.displayName = "ListTile";

export {
  List,
  ListItem,
  ListButtonItem,
  ListLinkItem,
  ListSwitchItem,
  ListCheckItem,
  ListRadioGroup,
  ListRadioItem,
  ListCheckGroup,
  ListDivider,
  ListHeader,
  ListTile,
  ListParentItem,
  listVariants,
  listItemVariants,
  listContentVariants,
  listPrefixVariants,
  listBodyVariants,
  listTitleVariants,
  listDetailVariants,
  listSuffixVariants,
  listActionVariants,
  listControlVariants,
  listDividerVariants,
  listHeaderVariants,
  listTileVariants,
};
