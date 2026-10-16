// 펼치고 접기 · 나누기 묶음(Accordion · Collapsible · Tree View · Resizable · Scroll Area · Scroll Auto Hide)의 모양 — 서버(collapse-look) ·
// 브라우저(collapse-view · collapse-tree · collapse-split · collapse-scroll · 플레이그라운드)가 함께 쓰는 타입 · 계산.
// 파일 읽기(서버 전용)를 들이지 않는다. 수치는 모두 collapse-look 이 YAML 의 속성에서 풀어 넘긴다 — 비고(note)는 읽지 않는다.
import type { CSSProperties, ReactNode } from 'react';
import { icv, type IColor, type IMotion, type IPress, type IType, type ViewMode } from './input-shared';
export { FONT, icv, ms, pressRatio, typeStyle, type IColor, type IMotion, type IPress, type IRing, type IType, type ViewMode } from './input-shared';

// 그림자(표 토큰) — 사이트 모드를 따르면 --p-<이름>, 모드를 정하면 그 값
export type IShadow = { name: string; light: string; dark: string };
export const shadowOf = (s: IShadow, mode: ViewMode) => (mode === 'auto' ? `var(--p-${s.name})` : mode === 'dark' ? s.dark : s.light);

// 키보드 포커스 링(안쪽) — 두께 · 들임(음수면 안쪽) · 색 · 모서리
export type CRing = { width: number; offset: number; color: IColor; radius: number };

// ── 트리거(Accordion 항목 · Collapsible) ─────────────────────
// 줄 전체가 누르는 자리 — 바탕 층(누름 · 호버 바탕, 좌우 들임 + 모서리)과 콘텐츠 층(앞 아이콘 · 본문 · 꺾쇠, 누르면 이 층만 준다)
export type TriggerLook = {
  minH: number;
  minHDesc: number;
  padY: number;
  padX: number;
  cursor: string;
  disabledCursor: string;
  bg: { insetX: number; radius: number; color: IColor; motion: IMotion };
  content: { gap: number; press: IPress };
  prefixIcon: { size: number; color: IColor; disabled: IColor };
  body: { gap: number };
  title: IType & { fg: IColor; disabled: IColor };
  description: IType & { fg: IColor; disabled: IColor };
  chevron: { size: number; color: IColor; disabled: IColor; openRotate: number; motion: IMotion };
  panel: { padTop: number; padX: number; padBottom: number };
  ring: CRing;
  // 머리말 단계(h3)
  heading: number;
  // 펼침 · 접힘 — 높이(d6), 모션 줄이기면 서서히(d3)
  motion: { height: IMotion; reduced: IMotion };
};

export type AccLook = TriggerLook & {
  panelText: IType & { fg: IColor };
  divider: { height: number; color: IColor; marginX: number };
  separated: { gap: number; borderW: number; border: IColor; radius: number; ringRadius: number };
  // 시트 · 대화상자의 목록 머리 — 제목 + 모두 펼치기
  header: { minH: number; gap: number; marginBottom: number; title: IType & { fg: IColor } };
  expandAll: { h: number; padL: number; padR: number; radius: number; type: IType; fg: IColor; touch: number; bg: IColor; press: IPress; motion: IMotion; labels: { expand: string; collapse: string }; ring: { width: number; offset: number; color: IColor } };
  // 놓인 면 — 화면 · 카드(bg-layer-default) · 시트 · 대화상자(bg-layer-floating) · 바닥
  surfaces: { default: IColor; floating: IColor; basement: IColor };
};

export const COL_SURFACES = ['default', 'card', 'warning'] as const;
export type ColSurface = (typeof COL_SURFACES)[number];
export type ColLook = TriggerLook & {
  // 펼친 내용이 줄 목록이면 아래 여백(layout rows)
  rowsPadBottom: number;
  card: { bg: IColor; borderW: number; border: IColor; radius: number; panelPadBottom: number; ringRadius: number };
  warning: {
    box: { bg: IColor; borderW: number; border: IColor; radius: number; padTop: number; padX: number; padBottom: number };
    padX: number;
    divider: { height: number; color: IColor };
    pressBg: IColor;
    ringRadius: number;
  };
  surfaces: { default: IColor; floating: IColor; basement: IColor };
};

export const TRIGGER_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
export type TriggerState = (typeof TRIGGER_STATES)[number];

// ── Tree View ─────────────────────────────────────────────
export type TreeLook = {
  root: { padX: number; padBottom: number };
  // touch — 누르는 자리(row.touchTarget, "줄 전체")
  row: { minH: number; padY: number; padL: number; padR: number; indent: number; radius: number; hoverBg: IColor; pressBg: IColor; selectedBg: IColor; motion: IMotion; cursor: string; touch: string };
  // 줄을 누르면(마우스 · 터치 · Enter · Space) — 접힌 부모 · 펼친 부모 · 잎 · 늘 펼친 나무(row.press, 16D)
  press: { collapsed: string; expanded: string; leaf: string; fixed: string };
  content: { gap: number; press: IPress };
  // 꺾쇠 칸(폭 · 첫 줄 높이) · 아이콘 · 펼치면 도는 각 — 표시만이다(따로 누르는 자리가 없다)
  chevron: { w: number; h: number; icon: number; color: IColor; openRotate: number; motion: IMotion };
  icon: { size: number; h: number; color: IColor };
  label: IType & { fg: IColor };
  header: { padTop: number; padRight: number; padBottom: number; padLeft: number; gap: number };
  title: IType & { fg: IColor };
  more: { size: number; icon: number; touch: number };
  ring: CRing;
  motion: { group: IMotion; reduced: IMotion };
  surface: IColor;
  border: IColor;
  basement: IColor;
};
export const TREE_STATES = ['enabled', 'hovered', 'focused', 'pressed'] as const;
export type TreeState = (typeof TREE_STATES)[number];

// ── Resizable ─────────────────────────────────────────────
export type SplitLook = {
  breakpoint: number;
  // 목록 패널 % — 기본 · 최소 · 최대 · 한 번 누르면 넓게
  panel: { def: number; min: number; max: number; toggle: number };
  handle: { width: number; step: number; dragStart: number; cursor: string; name: string };
  line: { width: number; color: IColor; activeColor: IColor; motion: IMotion };
  grip: { w: number; h: number; radius: number; color: IColor };
  ring: CRing;
};
export type WidgetLook = {
  columns: number;
  rowHeight: number;
  gap: number;
  handle: { size: number; cursor: string };
  mark: { size: number; borderW: number; color: IColor; right: number; bottom: number };
  placeholder: { bg: IColor; borderW: number; borderStyle: string; border: IColor; radius: number };
  ghost: { shadow: IShadow; radius: number };
  more: { size: number; icon: number; touch: number };
  sizeMenu: { label: string; items: { label: string; columns: number }[] };
  ring: { width: number; offset: number; color: IColor };
};
export const SPLIT_STATES = ['enabled', 'hovered', 'focused', 'pressed'] as const;
export type SplitState = (typeof SPLIT_STATES)[number];

// ── Scroll Area ───────────────────────────────────────────
export type ScrollAreaLook = {
  bar: { width: number; height: number; thumb: IColor; radius: number; track: string };
  firefox: { width: string; thumb: IColor; track: string };
  overscroll: string;
  // 초점 가는 것이 없는 상자 — tabindex · 역할 · 키보드 포커스 링(안쪽)
  focus: { tabIndex: number; role: string; ring: { width: number; offset: number; color: IColor } };
  surfaces: { default: IColor; basement: IColor; floating: IColor };
};

// ── Scroll Auto Hide ──────────────────────────────────────
export type AutoHideLook = {
  position: string;
  top: number;
  // 스크롤이 끝나면 영역 높이의 이 비율(0 ~ 1)을 기준으로 다 숨거나 다 드러난다
  threshold: number;
  snap: IMotion;
  bg: IColor;
  z: number;
};

// ── List 하위 줄(list.yaml nest · expanded) ─────────────────
export type NestLook = {
  parentPadL: number;
  childPadL: number;
  button: { size: number; radius: number; icon: number; color: IColor; marginRight: number; hoverBg: IColor; pressBg: IColor; press: IPress; ring: { width: number; offset: number; color: IColor }; openRotate: number };
  motion: { sub: IMotion; chevron: IMotion; reduced: IMotion };
};

// ── 계산 ──────────────────────────────────────────────────
// 아코디언 트리거 높이 — 위아래 + 제목 줄(+ 사이 + 설명 줄)
export const triggerHeight = (l: TriggerLook, desc: boolean) => l.padY * 2 + parseFloat(l.title.lineHeight) + (desc ? l.body.gap + parseFloat(l.description.lineHeight) : 0);
// 나무 줄 왼쪽 여백 — 단계마다 들임(1단계는 줄 왼쪽 여백 그대로)
export const treePadLeft = (l: TreeLook, level: number, fixed = false) => l.row.padL + (level - 1) * l.row.indent + (fixed ? 0 : 0);
// 숫자 → 원(U+2212 빼기)
export const MINUS = '−';
export const won = (n: number) => `${n < 0 ? MINUS : ''}${Math.abs(Math.round(n)).toLocaleString('ko-KR')}원`;
export const cv = (c: IColor, mode: ViewMode) => icv(c, mode);

// ── 아코디언 항목 · 펼침 계산(서버 그림 · 브라우저 그림이 함께) ──────
export type AccIcon = 'pay' | 'coffee' | 'bus' | 'phone' | 'store' | 'film' | 'fuel' | 'globe' | 'shop' | 'clinic' | 'tv' | 'lounge';
// 혜택 id → 앞 아이콘(collapse-data 의 BENEFITS)
export const BENEFIT_ICON: Record<string, AccIcon> = { pay: 'pay', coffee: 'coffee', transit: 'bus', telecom: 'phone', store: 'store', movie: 'film', fuel: 'fuel', abroad: 'globe', shop: 'shop', clinic: 'clinic', sub: 'tv', lounge: 'lounge' };
// 그림 표시(Anatomy · 치수) — 부위마다 칠
export type TriggerPart = 'trigger' | 'bg' | 'content' | 'prefix' | 'body' | 'title' | 'description' | 'chevron';
export type TriggerMarks = Partial<Record<TriggerPart, CSSProperties>>;
export type AccItem = { id: string; title: string; description?: string; detail?: ReactNode | null; icon?: AccIcon; disabled?: boolean; state?: TriggerState; marks?: TriggerMarks; decor?: ReactNode };
// 상세가 있는 항목을 모두 펼쳤는지 · 모두 펼치기를 누르면 바뀌는 펼침
export const allExpanded = (open: string[], expandable: string[]) => expandable.length > 0 && expandable.every((id) => open.includes(id));
export const toggleAll = (open: string[], expandable: string[]) => (allExpanded(open, expandable) ? open.filter((id) => !expandable.includes(id)) : [...new Set([...open, ...expandable])]);

// 화면 조각의 색 — 서버(collapse-look 의 screenTones)가 풀어 넘긴 역할 색. 모드를 따르면 --p-<이름>
export type Tones = Record<string, IColor>;
export const tc = (t: Tones, name: string, mode: ViewMode) => {
  const c = t[name];
  if (!c) throw new Error(`screenTones 에 ${name} 이 없다 — collapse-look.ts 의 TONE_NAMES 에 더한다`);
  return icv(c, mode);
};

// 화면 읽기 — "커피, 스타벅스 …, 머리말 3, 단추, 접힘"
export const triggerReadout = (title: string, desc: string | undefined, level: number, open: boolean, disabled = false) => [title, desc, `머리말 ${level}`, '단추', open ? '펼쳐짐' : '접힘', disabled ? '사용 불가' : ''].filter(Boolean).join(', ');
