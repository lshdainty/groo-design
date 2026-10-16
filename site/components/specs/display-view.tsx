'use client';
// 스펙대로 그린 표시 묶음 — Badge · Notification Badge · Tag Group · Avatar · Avatar Stack · Divider.
// 모양은 display-look 이 YAML 에서 푼 값(BadgeLook …)만 받는다. 색은 mode 가 auto 면 --p-<토큰> 변수(사이트 라이트 · 다크를 따른다).
// 인라인 스타일은 단축 속성(padding · margin)과 개별 속성을 한 객체에 섞지 않는다 — 링크로 들어올 때 React 가 단축 값을 지운다(#154).
import type { CSSProperties, ReactNode } from 'react';
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Coffee,
  CreditCard,
  Crown,
  Eye,
  GitBranch,
  House,
  Landmark,
  Lock,
  MapPin,
  Megaphone,
  Menu,
  Pencil,
  PiggyBank,
  Plane,
  Receipt,
  Repeat,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  TriangleAlert,
  Tv,
  Users,
  Utensils,
  Bus,
  Volume2,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  avatarHue,
  avatarInitial,
  dcv,
  formatNotificationCount,
  pxOf,
  graphemeCount,
  stackFit,
  stackSlots,
  type AvatarLook,
  type AvatarSize,
  type BadgeLook,
  type BadgeSize,
  type BadgeTone,
  type BadgeVariant,
  type DColor,
  type DisplayIcon,
  type DividerLook,
  type NotifAttach,
  type NotifLook,
  type NotifSize,
  type Person,
  type StackLook,
  type TagItem,
  type TagLook,
  type TagSize,
  type ViewMode,
} from './display-shared';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
export const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };

const ICONS: Record<DisplayIcon, LucideIcon> = {
  pencil: Pencil,
  eye: Eye,
  crown: Crown,
  check: Check,
  clock: Clock,
  'triangle-alert': TriangleAlert,
  lock: Lock,
  sparkles: Sparkles,
  'circle-check': CircleCheck,
  repeat: Repeat,
  bell: Bell,
  'git-branch': GitBranch,
  'map-pin': MapPin,
  users: Users,
  star: Star,
  coffee: Coffee,
  tv: Tv,
  'shopping-bag': ShoppingBag,
  bus: Bus,
  'credit-card': CreditCard,
  wallet: Wallet,
  'piggy-bank': PiggyBank,
  landmark: Landmark,
  utensils: Utensils,
  plane: Plane,
  receipt: Receipt,
  x: X,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  menu: Menu,
  search: Search,
  house: House,
  calendar: Calendar,
  settings: Settings,
  megaphone: Megaphone,
  sliders: SlidersHorizontal,
};
export function DIcon({ name, size, color, strokeWidth = 2, style }: { name: DisplayIcon; size: number; color?: string; strokeWidth?: number; style?: CSSProperties }) {
  const I = ICONS[name];
  return <I aria-hidden size={size} strokeWidth={strokeWidth} color={color} style={{ display: 'block', flexShrink: 0, ...style }} />;
}

// ── Badge ─────────────────────────────────────────────────
export type BadgePart = 'root' | 'icon' | 'label';
export type BadgeViewProps = {
  look: BadgeLook;
  mode?: ViewMode;
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  prefixIcon?: DisplayIcon;
  children: ReactNode;
  // 그림을 키워 그릴 때(Anatomy) — 치수 · 글자를 모두 곱한다
  zoom?: number;
  // 부위 칠 · 핀(Anatomy)
  zone?: Partial<Record<BadgePart, CSSProperties>>;
  pins?: Partial<Record<BadgePart, ReactNode>>;
  style?: CSSProperties;
};
// 배지 하나 — <span>, 누르지 않는다(포커스 · 호버 없음). 글이 넘치면(부모가 좁을 때) 한 줄 말줄임
export function BadgeView({ look, mode = 'auto', variant, tone, size, prefixIcon, children, zoom = 1, zone, pins, style }: BadgeViewProps) {
  const v = variant ?? look.defaults.variant;
  const t = tone ?? look.defaults.tone;
  const s = look.sizes[size ?? look.defaults.size];
  const f = look.faces[v][t];
  const k = zoom;
  const box: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    minWidth: 0,
    minHeight: s.minH * k,
    padding: `${s.padY * k}px ${s.padX * k}px`,
    gap: look.gap * k,
    borderRadius: s.radius * k,
    background: f.bg ? dcv(f.bg, mode) : 'transparent',
    color: dcv(f.fg, mode),
    boxShadow: f.border ? `inset 0 0 0 ${f.border.width * k}px ${dcv(f.border.color, mode)}` : 'none',
    fontFamily: s.text.fontFamily === 'inherit' ? FONT : s.text.fontFamily,
    fontSize: pxOf(s.text.fontSize) * k,
    lineHeight: `${pxOf(s.text.lineHeight) * k}px`,
    fontWeight: f.weight,
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    cursor: look.cursor,
    ...zone?.root,
    ...style,
  };
  return (
    <span data-pbadge="" style={box}>
      {pins?.root}
      {prefixIcon && (
        <span aria-hidden style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...zone?.icon }}>
          <DIcon name={prefixIcon} size={s.icon * k} strokeWidth={2.2} />
          {pins?.icon}
        </span>
      )}
      {/* 글 — 넘치면 한 줄 말줄임. 핀은 말줄임 상자 밖에 둔다(잘리지 않게) */}
      <span style={{ position: 'relative', display: 'inline-flex', minWidth: 0, ...zone?.label }}>
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
        {pins?.label}
      </span>
    </span>
  );
}
export function BadgeGroupView({ look, children, style, zoom = 1 }: { look: BadgeLook; children: ReactNode; style?: CSSProperties; zoom?: number }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: look.groupGap * zoom, minWidth: 0, flexWrap: 'nowrap', verticalAlign: 'middle', ...style }}>{children}</span>;
}

// ── Notification Badge ────────────────────────────────────
export function NotifDotView({ look, mode = 'auto', zoom = 1, style }: { look: NotifLook; mode?: ViewMode; zoom?: number; style?: CSSProperties }) {
  const d = look.dot.size * zoom;
  return <span aria-hidden data-pnotif="dot" style={{ display: 'block', width: d, height: d, borderRadius: 9999, background: dcv(look.dot.color, mode), ...style }} />;
}
// label — 나쁜 예(알림 자리에 얹은 말)를 같은 알약으로 그릴 때만
export function NotifCountView({ look, mode = 'auto', count, zoom = 1, style, label }: { look: NotifLook; mode?: ViewMode; count: number; zoom?: number; style?: CSSProperties; label?: string }) {
  const c = look.count;
  const text = label ?? formatNotificationCount(count);
  if (text === null) return null;
  return (
    <span
      aria-hidden
      data-pnotif="count"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        minWidth: c.minW * zoom,
        height: c.h * zoom,
        padding: `0 ${c.padX * zoom}px`,
        borderRadius: 9999,
        background: dcv(c.bg, mode),
        color: dcv(c.fg, mode),
        fontFamily: c.text.fontFamily === 'inherit' ? FONT : c.text.fontFamily,
        fontSize: pxOf(c.text.fontSize) * zoom,
        lineHeight: `${pxOf(c.text.lineHeight) * zoom}px`,
        fontWeight: c.text.fontWeight,
        fontVariantNumeric: c.numerals,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </span>
  );
}
export type NotificationBadgeViewProps = {
  look: NotifLook;
  mode?: ViewMode;
  size?: NotifSize;
  attach?: NotifAttach;
  // small — 점을 보일지 · large — 개수(0 이하면 없음, 100 이상 "99+")
  visible?: boolean;
  count?: number;
  // 붙을 대상 — 아이콘(그 상자가 기준) 또는 글
  children: ReactNode;
  zoom?: number;
  // 점 · 알약 칠(자리 재기 그림)
  mark?: CSSProperties;
  pin?: ReactNode;
};
// 붙을 대상을 감싸고 그 상자 위에 점 · 숫자를 겹친다 — 자리를 차지하지 않는다(대상의 크기 · 줄 높이를 바꾸지 않는다)
export function NotificationBadgeView({ look, mode = 'auto', size, attach, visible = true, count = 0, children, zoom = 1, mark, pin }: NotificationBadgeViewProps) {
  const sz = size ?? look.defaults.size;
  const at = attach ?? look.defaults.attach;
  const show = sz === 'small' ? visible : formatNotificationCount(count) !== null;
  const c = look.count;
  let place: CSSProperties = {};
  if (at === 'text') place = { left: `calc(100% + ${look.textGap * zoom}px)`, top: 0 };
  else if (sz === 'small') place = { top: look.dot.top * zoom, right: look.dot.right * zoom };
  else place = { left: `calc(100% - ${c.fromRight * zoom}px)`, top: (c.bottom - c.h) * zoom };
  return (
    <span data-pnotif-target={at} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, verticalAlign: 'top' }}>
      {children}
      {show && (
        <span aria-hidden style={{ position: 'absolute', display: 'flex', pointerEvents: 'none', ...place }}>
          {sz === 'small' ? <NotifDotView look={look} mode={mode} zoom={zoom} style={mark} /> : <NotifCountView look={look} mode={mode} count={count} zoom={zoom} style={mark} />}
          {pin}
        </span>
      )}
    </span>
  );
}

// ── Tag Group ─────────────────────────────────────────────
export type TagGroupViewProps = {
  look: TagLook;
  mode?: ViewMode;
  size?: TagSize;
  truncate?: boolean;
  items: TagItem[];
  zoom?: number;
  // 부위 칠(Anatomy) — 항목 · 아이콘 · 구분
  zone?: { item?: CSSProperties; icon?: CSSProperties; separator?: CSSProperties };
  pins?: { item?: ReactNode; icon?: ReactNode; separator?: ReactNode };
  style?: CSSProperties;
  // 나쁜 예 — 구분을 다른 글자 · 그림으로
  badSeparator?: 'dot2' | 'bullet' | 'bar' | 'none';
};
// 항목을 " · " 로 잇는다 — 구분은 보조 기술에 숨기고 그 자리에 보이지 않는 ", ". 빈 항목은 건너뛴다
export function TagGroupView({ look, mode = 'auto', size, truncate = false, items, zoom = 1, zone, pins, style, badSeparator }: TagGroupViewProps) {
  const s = look.sizes[size ?? look.defaults.size];
  const k = zoom;
  const list = items.filter((i) => i.label !== '');
  const fs = pxOf(s.text.fontSize) * k;
  const lh = pxOf(s.text.lineHeight) * k;
  // 줄바꿈(기본)은 글 흐름 — 줄 사이는 이 묶음의 줄 높이(놓인 자리의 줄 높이가 끼어들지 않게 inline-block)
  const root: CSSProperties = truncate
    ? { display: 'inline-flex', alignItems: 'flex-start', maxWidth: '100%', minWidth: 0, verticalAlign: 'top', whiteSpace: 'nowrap' }
    : { display: 'inline-block', maxWidth: '100%', verticalAlign: 'top', wordBreak: 'keep-all', overflowWrap: 'break-word' };
  const sepText = badSeparator === 'bullet' ? ' • ' : badSeparator === 'bar' ? ' | ' : badSeparator === 'none' ? ' ' : look.sep.glyph;
  return (
    <span
      data-ptag=""
      style={{
        position: 'relative',
        fontFamily: s.text.fontFamily === 'inherit' ? FONT : s.text.fontFamily,
        fontSize: fs,
        lineHeight: `${lh}px`,
        ...root,
        ...style,
      }}
    >
      {list.map((it, i) => {
        const tone = look.tones[it.tone ?? look.defaults.tone];
        const weight = look.weights[it.weight ?? look.defaults.weight];
        const icon = it.prefixIcon ?? it.suffixIcon;
        const at = it.prefixIcon ? 'prefix' : 'suffix';
        const iconNode = icon && (
          <span aria-hidden style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...zone?.icon }}>
            <DIcon name={icon} size={s.icon * k} strokeWidth={2.2} />
            {i === 0 && pins?.icon}
          </span>
        );
        const labelText = it.srLabel ? (
          <>
            <span aria-hidden>{it.label}</span>
            <span style={srOnly}>{it.srLabel}</span>
          </>
        ) : (
          it.label
        );
        // 항목 칸의 최소 폭 — 글 칸 첫 글자 + "…"(tag-group.yaml label.minWidth) + 아이콘. 두 글자 이하는 글 폭(넓히지 않는다).
        // 최소 폭은 항목 칸에 준다 — 글 칸(overflow hidden)의 최소 폭은 항목의 최소 크기로 올라가지 않는다
        const short = graphemeCount(it.label.trim()) <= 2;
        const itemMin = short ? 'max-content' : icon ? `calc(${look.labelMin} + ${(s.icon + look.itemGap) * k}px)` : look.labelMin;
        const itemStyle: CSSProperties = truncate
          ? { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: look.itemGap * k, minWidth: itemMin, flexShrink: it.shrink ?? look.shrink, height: lh, color: dcv(tone, mode), fontWeight: weight }
          : icon
            ? { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: look.itemGap * k, height: lh, verticalAlign: 'top', color: dcv(tone, mode), fontWeight: weight }
            : { position: 'relative', color: dcv(tone, mode), fontWeight: weight };
        const textBox = truncate ? <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{labelText}</span> : labelText;
        return (
          <span key={i} style={{ display: truncate ? 'contents' : 'inline' }}>
            <span data-ptag-item="" style={{ ...itemStyle, ...(i === 0 ? zone?.item : undefined) }}>
              {at === 'prefix' && iconNode}
              {textBox}
              {at === 'suffix' && iconNode}
              {i === 0 && pins?.item}
            </span>
            {i < list.length - 1 &&
              (badSeparator === 'dot2' ? (
                <span aria-hidden style={{ display: 'inline-block', width: 2 * k, height: 2 * k, borderRadius: 9999, background: dcv(look.sep.color, mode), verticalAlign: 'middle', marginLeft: 6 * k, marginRight: 6 * k, flexShrink: 0, alignSelf: 'center' }} />
              ) : (
                <>
                  <span aria-hidden data-ptag-sep="" style={{ position: 'relative', color: dcv(look.sep.color, mode), fontWeight: look.sep.weight, whiteSpace: 'pre', flexShrink: 0, ...(i === 0 ? zone?.separator : undefined) }}>
                    {sepText}
                    {i === 0 && pins?.separator}
                  </span>
                  {!badSeparator && <span style={srOnly}>{look.srSep}</span>}
                </>
              ))}
          </span>
        );
      })}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────
// 사진 자리 — 사람 사진 대신 칠한 그림(실제 사람 · 스톡 사진을 쓰지 않는다). 3 은 흰 배경 사진(1px 테두리가 하는 일을 보일 때)
const PHOTOS: [string, string, string, string, string][] = [
  ['#B9C9D9', '#7D8FA3', '#3D342E', '#F1D5BD', '#F4F4F4'],
  ['#E3C9B0', '#C19A7A', '#2B2320', '#EBC9A8', '#3E4A5C'],
  ['#CFD8C8', '#94A38B', '#4A3A2C', '#F3D9C2', '#E9DDCB'],
  ['#FFFFFF', '#FBFBFB', '#5A4636', '#F1D5BD', '#FFFFFF'],
];
export function AvatarPhoto({ size, n = 0 }: { size: number; n?: number }) {
  const [a, b, hair, skin, shirt] = PHOTOS[n % PHOTOS.length];
  return (
    <span aria-hidden data-pavatar-photo="" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'block', overflow: 'hidden', borderRadius: 9999, background: `linear-gradient(160deg, ${a}, ${b})` }}>
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
        <circle cx="12" cy="10" r="4.6" fill={skin} />
        <path d="M7.2 9.2c0-3.3 2.2-5 4.8-5s4.8 1.7 4.8 5c-1-.9-2.6-1.6-4.8-1.6s-3.8.7-4.8 1.6Z" fill={hair} />
        <path d="M3 24c0-5 4-8.6 9-8.6s9 3.6 9 8.6Z" fill={shirt} />
      </svg>
    </span>
  );
}
export type AvatarPart = 'root' | 'image' | 'initial' | 'border';
export type AvatarViewProps = {
  look: AvatarLook;
  mode?: ViewMode;
  size?: AvatarSize;
  name: string;
  // 사진 — 그림 번호(없으면 이니셜). 불러오지 못한 사진은 이니셜로 그린다
  photo?: number;
  decorative?: boolean;
  // 묶음의 바탕색 링(바깥 box-shadow)
  ring?: { width: number; color: DColor };
  zoom?: number;
  zone?: Partial<Record<AvatarPart, CSSProperties>>;
  pins?: Partial<Record<AvatarPart, ReactNode>>;
  // 나쁜 예 — 이니셜 색 · 글자를 바꿔 그린다
  paint?: { bg?: string; fg?: string; text?: string; opacity?: number };
  style?: CSSProperties;
};
// 아바타 하나 — 원 · 사진 또는 이니셜 + 이름 색 · 1px 안쪽 테두리. 이름 옆이면 장식(aria-hidden), 혼자면 role="img" + 이름
export function AvatarView({ look, mode = 'auto', size, name, photo, decorative = true, ring, zoom = 1, zone, pins, paint, style }: AvatarViewProps) {
  const sz = look.sizes[size ?? look.defaultSize];
  const d = sz.d * zoom;
  const hue = avatarHue(name, look.order);
  const bg = paint?.bg ?? dcv(look.hues[hue], mode);
  const fg = paint?.fg ?? dcv(look.initial.fg, mode);
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name.trim() };
  return (
    <span
      {...a11y}
      data-pavatar=""
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: d,
        height: d,
        borderRadius: 9999,
        background: photo === undefined ? bg : 'transparent',
        color: fg,
        fontFamily: FONT,
        fontSize: sz.font * zoom,
        lineHeight: look.initial.lineHeight,
        fontWeight: look.initial.weight,
        boxShadow: ring ? `0 0 0 ${ring.width * zoom}px ${dcv(ring.color, mode)}` : 'none',
        opacity: paint?.opacity,
        verticalAlign: 'middle',
        ...zone?.root,
        ...style,
      }}
    >
      {photo === undefined ? (
        <span aria-hidden style={{ position: 'relative', ...zone?.initial }}>
          {paint?.text ?? avatarInitial(name)}
          {pins?.initial}
        </span>
      ) : (
        <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'block', ...zone?.image }}>
          <AvatarPhoto size={d} n={photo} />
          {pins?.image}
        </span>
      )}
      <span aria-hidden data-pavatar-border="" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 9999, boxShadow: `inset 0 0 0 ${look.border.width * zoom}px ${dcv(look.border.color, mode)}`, pointerEvents: 'none', ...zone?.border }}>
        {pins?.border}
      </span>
      {pins?.root}
    </span>
  );
}
export type AvatarStackViewProps = {
  look: AvatarLook;
  stack: StackLook;
  mode?: ViewMode;
  size?: AvatarSize;
  people: Person[];
  max?: number;
  surface?: 'default' | 'floating';
  ariaLabel?: string;
  zoom?: number;
  // 겹침 · 링 칠(묶음 그림)
  marks?: { overlap?: CSSProperties; plus?: CSSProperties };
  // 나쁜 예 — 겹침 · 링을 바꿔 그린다
  overlap?: number;
  ring?: number;
  // 놓인 폭 — 주면 폭에 맞춰 보이는 사람 수를 줄인다(avatar-stack.yaml root.overflow — stackFit)
  fitWidth?: number;
  style?: CSSProperties;
};
// 묶음 — 다음 아바타가 지름의 약 1/4 왼쪽으로 겹치고 바탕색 링으로 앞 아바타를 끊는다. 뒤가 위. 넘치면 앞 max 명 + "+N",
// 폭이 모자라면 폭에 드는 만큼 + "+N"
export function AvatarStackView({ look, stack, mode = 'auto', size, people, max, surface = 'default', ariaLabel, zoom = 1, marks, overlap, ring, fitWidth, style }: AvatarStackViewProps) {
  const sz = size ?? stack.defaultSize;
  const st = stack.sizes[sz];
  const d = look.sizes[sz].d * zoom;
  const ov = (overlap ?? st.overlap) * zoom;
  const rg = { width: ring ?? st.ring, color: surface === 'floating' ? stack.ring.floating : stack.ring.default };
  const limit = max ?? stack.max;
  const { shown, more } = stackSlots(people, fitWidth === undefined ? limit : stackFit(people.length, d, ov, fitWidth, limit));
  const a11y = ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : { 'aria-hidden': true };
  return (
    <span {...a11y} data-pstack="" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0, verticalAlign: 'middle', ...style }}>
      {shown.map((p, i) => (
        <span key={`${p.name}-${i}`} style={{ position: 'relative', display: 'inline-flex', zIndex: i, marginLeft: i === 0 ? 0 : -ov }}>
          <AvatarView look={look} mode={mode} size={sz} name={p.name} photo={p.photo} ring={rg} zoom={zoom} />
          {i === 1 && marks?.overlap && <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: ov, height: d, ...marks.overlap }} />}
        </span>
      ))}
      {more > 0 && (
        <span
          data-pstack-plus=""
          style={{
            position: 'relative',
            zIndex: shown.length,
            marginLeft: -ov,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: d,
            height: d,
            borderRadius: 9999,
            background: dcv(stack.plus.bg, mode),
            color: dcv(stack.plus.fg, mode),
            fontFamily: FONT,
            fontSize: st.plusFont * zoom,
            lineHeight: 1,
            fontWeight: stack.plus.weight,
            boxShadow: `0 0 0 ${rg.width * zoom}px ${dcv(rg.color, mode)}`,
            ...marks?.plus,
          }}
        >
          +{more}
        </span>
      )}
    </span>
  );
}

// ── Divider ───────────────────────────────────────────────
export type DividerViewProps = {
  look: DividerLook;
  mode?: ViewMode;
  orientation?: 'horizontal' | 'vertical';
  inset?: boolean;
  decorative?: boolean;
  // 나쁜 예 — 두께 · 색을 바꿔 그린다
  paint?: { thickness?: number; color?: string };
  style?: CSSProperties;
};
// 1px 선 — <div>. 장식이면 aria-hidden, 아니면 role="separator"(세로는 aria-orientation)
export function DividerView({ look, mode = 'auto', orientation = 'horizontal', inset = false, decorative = true, paint, style }: DividerViewProps) {
  const t = paint?.thickness ?? look.thickness;
  const bg = paint?.color ?? dcv(look.color, mode);
  const m = inset ? look.inset : look.margin;
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'separator', 'aria-orientation': orientation === 'vertical' ? ('vertical' as const) : undefined };
  const box: CSSProperties =
    orientation === 'horizontal'
      ? { flexShrink: 0, alignSelf: 'stretch', height: t, marginTop: look.margin, marginBottom: look.margin, marginLeft: m, marginRight: m, background: bg }
      : { flexShrink: 0, alignSelf: 'stretch', width: t, marginTop: m, marginBottom: m, marginLeft: look.margin, marginRight: look.margin, background: bg };
  return <div {...a11y} data-pdivider={orientation} style={{ ...box, ...style }} />;
}

// ── 보조 기술이 읽는 글 ───────────────────────────────────
// 그림 아래에 붙이는 말풍선 — 화면 읽기 프로그램이 읽는 글을 그대로
export function Reading({ children, tone = 'neutral', label = '보조 기술이 읽는 글' }: { children: ReactNode; tone?: 'neutral' | 'ok' | 'bad'; label?: string }) {
  const border = tone === 'ok' ? 'rgba(11, 122, 85, 0.45)' : tone === 'bad' ? 'rgba(194, 38, 29, 0.45)' : 'var(--color-fd-border)';
  return (
    <span className="inline-flex max-w-full items-start gap-2 rounded-lg border bg-fd-card px-3 py-2 text-left text-[12.5px] leading-5 text-fd-foreground" style={{ borderColor: border, fontFamily: FONT }}>
      <Volume2 aria-hidden size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-fd-muted-foreground" />
      <span className="min-w-0">
        <span className="sr-only">{label}: </span>
        {children}
      </span>
    </span>
  );
}
