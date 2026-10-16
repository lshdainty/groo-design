// List 의 모양 — 서버(list-look) · 브라우저(list-view · 플레이그라운드)가 함께 쓰는 상수 · 타입.
// 파일 읽기(서버 전용)를 들이지 않는다.
import type { ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import type { CheckLook } from './checkbox-shared';
import type { AvatarLook } from './display-shared';
import type { RadioLook } from './radio-group-shared';
import type { SwitchLook } from './switch-shared';

type Mode = 'light' | 'dark';

export const LIST_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
export type ListState = (typeof LIST_STATES)[number];
export const LIST_HIGHLIGHTS = ['none', 'highlighted'] as const;
export type ListHighlight = (typeof LIST_HIGHLIGHTS)[number];
export const LIST_ALIGNS = ['center', 'top'] as const;
export type ListAlign = (typeof LIST_ALIGNS)[number];
export const HEADER_VARIANTS = ['mediumWeak', 'boldSolid'] as const;
export type HeaderVariant = (typeof HEADER_VARIANTS)[number];

export type ListType = { fontSize: string; lineHeight?: string; fontWeight: number | string; fontFamily: string };

// 한 줄의 모습 — 강조 · 모드 · 상태마다(맞춤은 세로 맞춤 하나만 바꾸므로 따로)
export type ListFace = {
  pad: { y: number; x: number };
  cursor: string;
  // 바탕 층 — 누름 · 호버면 좌우로 들어오고 둥글어진다
  bg: { color: string; insetX: number; radius: number };
  prefix: { padRight: number; iconSize: number; iconColor: string };
  // 타일 — 바탕 · 아이콘 색은 카테고리 색(tiles). 막히면 YAML 의 비활성 색(bg · fg)
  tile: { size: number; radius: number; iconSize: number; bg?: string; fg?: string };
  // 본문 — 값이 길면 먼저 양보하고 minWidth(1em — 뒤 여백은 따로)까지 준다(Q-001 A)
  body: { gap: number; padRight: number; minWidth: string };
  // 제목 — 본문이 낱말 하나보다 좁아지면 글자 사이에서 끊는다(overflow-wrap)
  title: ListType & { color: string; overflowWrap: string };
  detail: ListType & { color: string; overflowWrap: string };
  // 뒤 붙이개 — 요소는 줄지 않고(shrink 0), 글을 그대로 넘긴 값 글자는 본문이 1em 이 된 뒤에야 줄고(textShrink) 줄 끝에서 끊는다(textOverflowWrap)
  suffix: ListType & { gap: number; color: string; iconSize: number; iconColor: string; shrink: number; textShrink: number; textOverflowWrap: string };
  ring: { width: number; offset: number; color: string };
  divider: { height: number; color: string };
  // 누름 — 콘텐츠 층만 준다(2px 거리)
  scale: boolean;
  motion: { bg: { duration: string; easing: string }; content: { duration: string; easing: string } };
};

export type HeaderFace = ListType & { padX: number; padY: number; gap: number; color: string };

export type TileColor = { bg: Record<Mode, string>; fg: Record<Mode, string>; contrast: Record<Mode, string> };

export type ListLook = {
  faces: Record<ListHighlight, Record<Mode, Record<ListState, ListFace>>>;
  alignItems: Record<ListAlign, string>;
  header: Record<HeaderVariant, Record<Mode, HeaderFace>>;
  press: { distance: number; widthDivisor: number; minBasis: number };
  tiles: Record<string, TileColor>;
  // 줄에 끼우는 컨트롤 · 작은 버튼 — 그 컴포넌트의 YAML 에서(스위치 32 · 체크 · 라디오 large)
  marks: { switch: SwitchLook; check: CheckLook; radio: RadioLook; headerAction: ButtonLook; iconButton: ButtonLook };
  surface: Record<'default' | 'basement' | 'floating', Record<Mode, string>>;
  // 사람 줄의 앞 붙이개 — Avatar(avatar.yaml). 한 줄이면 36, 이름 + 설명 두 줄이면 42(list.md Prefix)
  avatar: AvatarLook;
  avatarSize: { one: '36'; two: '42' };
  // 제목 ↔ 제목 옆 배지(badge.md 코드의 gap-x1_5)
  titleGap: number;
  // 좁은 줄(width narrow) — 줄 안 폭이 below × 제목 글자보다 좁으면 값을 본문 아래로(설명 ↔ 값 = 본문 사이 + marginTop)
  narrow: { below: number; marginTop: number; bodyPadRight: number; alignItems: string };
};

// 그림의 아이콘 — 이름으로 넘긴다(서버 그림 → 브라우저 그림)
export const LIST_ICONS = [
  'bell',
  'globe',
  'user',
  'wallet',
  'lock',
  'moon',
  'coffee',
  'bus',
  'utensils',
  'shopping-bag',
  'help',
  'calendar',
  'smartphone',
  'log-out',
  'palette',
  'languages',
  'download',
  'shield',
  'credit-card',
  'piggy-bank',
  'receipt',
  'megaphone',
  'gift',
  'house',
  'trending-up',
  'star',
  'more',
  'pencil',
  'trash',
  'info',
  'check',
  'external',
  'stethoscope',
  'plane',
] as const;
export type ListIcon = (typeof LIST_ICONS)[number];

// 사람은 Avatar(이름으로 이니셜 · 이름 색, photo 는 사진 그림 번호) — 분류는 타일. 물건(Logo Tile) · 카드 그림(Image Frame)은
// 그 부품의 그림을 node 로 넘긴다(막힌 줄에서도 그대로 — logo-tile.md)
export type PrefixSpec = { icon: ListIcon } | { tile: string; icon: ListIcon } | { person: string; photo?: number } | { node: ReactNode };
export type SuffixSpec = { text?: string; chevron?: boolean; amount?: string; buttons?: ListIcon[]; icon?: ListIcon };

// 한 줄 — 종류 · 글 · 앞 · 뒤. state 를 주면 그 상태로 멈춘 그림
export type RowSpec = {
  kind: 'view' | 'button' | 'link' | 'switch' | 'check' | 'radio';
  title: string;
  detail?: string;
  prefix?: PrefixSpec;
  suffix?: SuffixSpec;
  highlighted?: boolean;
  disabled?: boolean;
  align?: ListAlign;
  checked?: boolean;
  value?: string;
  // 체크(기본 앞) · 라디오(기본 뒤)를 둘 자리
  markPosition?: 'prefix' | 'suffix';
  // 나쁜 예 — 컨트롤만 막고 줄은 그대로 둔 모습
  markDisabled?: boolean;
  state?: ListState;
  // 제목 옆 상태 배지(Badge) · 설명 줄을 Tag Group 으로(분류 · 자산 · 시각)
  titleBadge?: ReactNode;
  detailNode?: ReactNode;
  // 뒤 붙이개 자리에 직접 그린 것(권한 배지처럼)
  suffixNode?: ReactNode;
  // 합계에 안 드는 줄(list.md) — 제목 · 금액만 fg-neutral-subtle, 환불은 금액에 취소선. 배지 · 앞 타일 · 설명은 보통 줄과 같다
  excluded?: 'scheduled' | 'refunded';
};
