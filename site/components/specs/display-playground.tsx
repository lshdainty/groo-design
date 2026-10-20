'use client';
// 표시 묶음의 플레이그라운드 — Badge · Notification Badge · Tag Group · Avatar(+ 묶음) · Divider.
// 속성을 고르면 스펙대로 그린 모습 · 그 코드(레시피 API — 각 md 의 "코드" 절과 같다) · 보조 기술이 읽는 글이 바뀐다.
import { useMemo, useState, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import type { DisplayKit } from './display-look';
import {
  AVATAR_SIZES,
  BADGE_TONES,
  avatarHue,
  avatarInitial,
  codePointSum,
  dcv,
  formatNotificationCount,
  stackSlots,
  tagReading,
  type AvatarSize,
  type BadgeSize,
  type BadgeTone,
  type BadgeVariant,
  type DisplayIcon,
  type NotifAttach,
  type NotifSize,
  type Person,
  type TagItem,
  type TagSize,
  type TagTone,
  type TagWeight,
  type ViewMode,
} from './display-shared';
import { AvatarStackView, AvatarView, BadgeView, DIcon, DividerView, NotificationBadgeView, Reading, TagGroupView } from './display-view';
import type { ListLook } from './list-shared';
import { ListView } from './list-view';
import { BRANDS, MODES, Seg } from './select-playground';

type Brand = 'desk' | 'hr';
type Kits = Record<Brand, DisplayKit>;
const FONT = "'Pretendard Variable', Pretendard, sans-serif";

// 판 — 무대(놓인 바탕) · 보조 기술이 읽는 글 · 고르는 칸 · 코드.
// 무대는 실제 화면 폭(stageW)으로 그린다 — 좁은 화면에서는 무대 안에서 가로로 민다(줄여 그리면 말줄임이 실제와 달라진다)
function Frame({ surface, stage, reading, controls, code, stageW = 360 }: { surface: string; stage: ReactNode; reading?: ReactNode; controls: ReactNode; code: string; stageW?: number }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex min-h-[220px] flex-col justify-center overflow-x-auto px-4 py-10" style={{ background: surface }}>
        <div className="mx-auto flex w-max flex-col items-center gap-5">
          <div style={{ width: stageW }}>{stage}</div>
          {reading && (
            <div className="flex justify-center" style={{ maxWidth: stageW }}>
              {reading}
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
const attr = (cond: boolean, s: string) => (cond ? [s] : []);
const jsx = (tag: string, attrs: string[], body: string) => `<${tag}${attrs.length ? ` ${attrs.join(' ')}` : ''}>${body}</${tag}>`;
const ModeBrand = ({ mode, setMode, brand, setBrand }: { mode: ViewMode; setMode: (m: ViewMode) => void; brand: Brand; setBrand: (b: Brand) => void }) => (
  <div className="flex flex-wrap gap-5">
    <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
    <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
  </div>
);

// ── Badge ─────────────────────────────────────────────────
const TONE_ICON: Record<BadgeTone, [DisplayIcon, string]> = {
  neutral: ['clock', 'Clock'],
  brand: ['sparkles', 'Sparkles'],
  informative: ['eye', 'Eye'],
  positive: ['circle-check', 'CircleCheck'],
  warning: ['triangle-alert', 'TriangleAlert'],
  critical: ['triangle-alert', 'TriangleAlert'],
};
const SHORT: Record<BadgeTone, string> = { neutral: '예정', brand: 'Pro', informative: '읽기 전용', positive: '달성', warning: '만료 임박', critical: '연체 3' };
const LONG: Record<BadgeTone, string> = { neutral: '다음 달 자동 이체 예정', brand: 'Pro 무료 체험 7일 남음', informative: '읽기 전용 · 공유받은 캘린더', positive: '이번 달 목표 금액 달성', warning: '카드 유효기간 만료 임박', critical: '연체 3회 · 한도 초과' };

export function BadgePlayground({ kits, lists }: { kits: Kits; lists: Record<Brand, ListLook> }) {
  const d = kits.desk.badge.defaults;
  const [variant, setVariant] = useState<BadgeVariant>(d.variant);
  const [tone, setTone] = useState<BadgeTone>(d.tone);
  const [size, setSize] = useState<BadgeSize>(d.size);
  const [icon, setIcon] = useState<'none' | 'icon'>('none');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const k = kits[brand];
  const label = len === 'short' ? SHORT[tone] : LONG[tone];
  const [iconName, lucide] = TONE_ICON[tone];
  const badge = (
    <BadgeView look={k.badge} mode={mode} variant={variant} tone={tone} size={size} prefixIcon={icon === 'icon' ? iconName : undefined}>
      {label}
    </BadgeView>
  );
  const code = useMemo(() => {
    const a = [...attr(variant !== d.variant, `variant="${variant}"`), ...attr(tone !== d.tone, `tone="${tone}"`), ...attr(size !== d.size, `size="${size}"`), ...attr(icon === 'icon', `prefixIcon={<${lucide} />}`)];
    return `${icon === 'icon' ? `import { ${lucide} } from "lucide-react"\n` : ''}import { Badge } from "@/components/ui/badge"\n\n${jsx('Badge', a, label)}`;
  }, [variant, tone, size, icon, lucide, label, d]);
  const surface = dcv(k.tone['bg-layer-basement'], mode);
  const card = dcv(k.tone['bg-layer-default'], mode);
  const sub = dcv(k.tone['fg-neutral-subtle'], mode);
  const stage = (
    <div className="flex flex-col gap-4" style={{ fontFamily: FONT }}>
      <span className="text-[12px] leading-4" style={{ color: sub }}>
        줄 안 — 제목 옆
      </span>
      <div className="overflow-hidden rounded-2xl" style={{ background: card, paddingTop: 6, paddingBottom: 6 }}>
        <ListView
          look={lists[brand]}
          mode={mode}
          live={false}
          rows={[
            {
              kind: 'button',
              prefix: { tile: 'red', icon: 'receipt' },
              title: '넷플릭스',
              titleBadge: badge,
              detailNode: <TagGroupView look={k.tag} mode={mode} size="t3" truncate items={[{ label: '구독', shrink: 0 }, { label: '현대카드 M' }, { label: '10월 18일', shrink: 0 }]} />,
              suffix: { amount: '−17,000원' },
            },
          ]}
        />
      </div>
      <span className="text-[12px] leading-4" style={{ color: sub }}>
        상세 머리 — 이름 아래
      </span>
      <div className="flex flex-col rounded-2xl px-6 py-5" style={{ background: card, gap: 8 }}>
        <span style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, color: dcv(k.tone['fg-neutral'], mode) }}>현대카드 M</span>
        <span className="flex min-w-0">{badge}</span>
      </div>
    </div>
  );
  return (
    <Frame
      surface={surface}
      stage={stage}
      code={code}
      controls={
        <>
          <Seg label="변형 variant" value={variant} options={(['weak', 'outline', 'solid'] as const).map((v) => [v, `${v}${v === d.variant ? '(기본)' : ''}`] as const)} onChange={setVariant} />
          <Seg label="톤 tone" value={tone} options={BADGE_TONES.map((t) => [t, `${t}${t === d.tone ? '(기본)' : ''}`] as const)} onChange={setTone} />
          <Seg label="크기 size" value={size} options={(['medium', 'large'] as const).map((s) => [s, `${s} ${k.badge.sizes[s].minH}${s === d.size ? '(기본)' : ''}`] as const)} onChange={setSize} />
          <Seg label="앞 아이콘 prefixIcon" value={icon} options={[['none', '없음'], ['icon', '있음']] as const} onChange={setIcon} />
          <Seg label="글 길이" value={len} options={[['short', '한두 낱말'], ['long', '긴 글(말줄임)']] as const} onChange={setLen} />
          <ModeBrand mode={mode} setMode={setMode} brand={brand} setBrand={setBrand} />
        </>
      }
    />
  );
}

// ── Notification Badge ────────────────────────────────────
const COUNTS = ['0', '1', '3', '12', '99', '100', '128'] as const;
export function NotificationPlayground({ kits, buttons }: { kits: Kits; buttons: Record<Brand, ButtonLook> }) {
  const d = kits.desk.notif.defaults;
  const [size, setSize] = useState<NotifSize>(d.size);
  const [attach, setAttach] = useState<NotifAttach>(d.attach);
  const [count, setCount] = useState<(typeof COUNTS)[number]>('3');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const k = kits[brand];
  const n = Number(count);
  const has = n > 0;
  const btn = buttons[brand];
  const iconSize = btn.faces.light.enabled.icon;
  const fg = dcv(k.tone['fg-neutral'], mode);
  const sub = dcv(k.tone['fg-neutral-subtle'], mode);
  const name = attach === 'icon' ? (has ? (size === 'small' ? '알림, 새 알림 있음' : `알림, 새 알림 ${n}개`) : '알림') : has ? (size === 'small' ? '승인 내역 새 소식' : `승인 내역 새 소식 ${n}개`) : '승인 내역';
  const shown = size === 'small' ? (has ? '점' : '없음') : (formatNotificationCount(n) ?? '없음');
  const code = useMemo(() => {
    if (attach === 'icon') {
      const label = size === 'small' ? 'aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"}' : 'aria-label={unread > 0 ? `알림, 새 알림 ${unread}개` : "알림"}';
      const nb = size === 'small' ? '<NotificationBadge visible={hasUnread}>' : '<NotificationBadge size="large" count={unread}>';
      return `import { Bell } from "lucide-react"\nimport { Button } from "@/components/ui/button"\nimport { NotificationBadge } from "@/components/ui/notification-badge"\n\n<Button variant="ghost" layout="iconOnly" ${label} onClick={openNotifications}>\n  ${nb}\n    <Bell />\n  </NotificationBadge>\n</Button>`;
    }
    const nb = size === 'small' ? '<NotificationBadge attach="text" visible={hasNew}>' : '<NotificationBadge attach="text" size="large" count={pending}>';
    const sr = size === 'small' ? '{hasNew && <span className="sr-only">새 소식</span>}' : '{pending > 0 && <span className="sr-only">새 소식 {pending}개</span>}';
    return `import { NotificationBadge } from "@/components/ui/notification-badge"\n\n${nb}승인 내역</NotificationBadge>\n${sr}`;
  }, [attach, size]);
  const badged = (target: ReactNode) => (
    <NotificationBadgeView look={k.notif} mode={mode} size={size} attach={attach} visible={has} count={n}>
      {target}
    </NotificationBadgeView>
  );
  const t5 = k.text.t5;
  const stage =
    attach === 'icon' ? (
      <div className="flex items-center justify-between rounded-2xl pl-6 pr-2" style={{ height: 56, background: dcv(k.tone['bg-layer-default'], mode), fontFamily: FONT }}>
        <span style={{ fontSize: 17, lineHeight: '24px', fontWeight: 700, color: dcv(k.tone['fg-brand'], mode) }}>groo {brand}</span>
        <ButtonView look={btn} mode={mode} iconNode={badged(<DIcon name="bell" size={iconSize} strokeWidth={2.2} />)} ariaLabel={name} />
      </div>
    ) : (
      <div className="flex items-end rounded-2xl px-6 pt-4" style={{ background: dcv(k.tone['bg-layer-default'], mode), boxShadow: `inset 0 -1px 0 ${dcv(k.tone['stroke-neutral-subtle'], mode)}`, gap: 28, fontFamily: FONT }}>
        {[
          ['내 신청', true],
          ['승인 내역', false],
        ].map(([l, on]) => (
          <span key={String(l)} className="flex flex-col" style={{ paddingBottom: 10, boxShadow: on ? `inset 0 -2px 0 ${fg}` : undefined }}>
            <span style={{ fontSize: t5.fontSize, lineHeight: t5.lineHeight, fontWeight: 700, color: on ? fg : sub }}>{on ? l : badged(<span>{l}</span>)}</span>
          </span>
        ))}
      </div>
    );
  return (
    <Frame
      surface={dcv(k.tone['bg-layer-basement'], mode)}
      stage={stage}
      reading={
        <Reading label="보조 기술이 읽는 이름">
          &ldquo;{name}&rdquo;<span className="text-fd-muted-foreground"> — 보이는 것: {shown}</span>
        </Reading>
      }
      code={code}
      controls={
        <>
          <Seg label="크기 size" value={size} options={[['small', `small 점 ${k.notif.dot.size}(기본)`], ['large', `large 숫자 ${k.notif.count.h}`]] as const} onChange={setSize} />
          <Seg label="붙는 자리 attach" value={attach} options={[['icon', 'icon 아이콘(기본)'], ['text', 'text 글']] as const} onChange={setAttach} />
          <Seg label={size === 'small' ? '새 알림 수(점은 있음 · 없음만)' : '새 알림 수 count'} value={count} options={COUNTS.map((c) => [c, c] as const)} onChange={setCount} />
          <ModeBrand mode={mode} setMode={setMode} brand={brand} setBrand={setBrand} />
        </>
      }
    />
  );
}

// ── Tag Group ─────────────────────────────────────────────
const TAG_ALL: TagItem[] = [{ label: '식비' }, { label: '신한카드 Deep Dream 체크(1234)' }, { label: '오후 2:10' }, { label: '조회 12' }];
const WIDTHS = [
  ['180', '180'],
  ['240', '240'],
  ['312', '312(폰)'],
] as const;
export function TagGroupPlayground({ kits }: { kits: Kits }) {
  const d = kits.desk.tag.defaults;
  const [size, setSize] = useState<TagSize>(d.size);
  const [count, setCount] = useState<'2' | '3' | '4'>('3');
  const [focus, setFocus] = useState<'none' | '1' | '3'>('none');
  const [focusTone, setFocusTone] = useState<TagTone>('neutral');
  const [focusWeight, setFocusWeight] = useState<TagWeight>('bold');
  const [icon, setIcon] = useState<'none' | 'prefix' | 'suffix'>('none');
  const [truncate, setTruncate] = useState<'wrap' | 'truncate'>('wrap');
  const [width, setWidth] = useState<(typeof WIDTHS)[number][0]>('240');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const k = kits[brand];
  const n = Number(count);
  const list: TagItem[] = TAG_ALL.slice(0, n).map((it, i) => {
    const out: TagItem = { ...it };
    if (focus !== 'none' && i === Number(focus) - 1) {
      out.tone = focusTone;
      out.weight = focusWeight;
    }
    // 마지막 항목 — 조회 12 는 아이콘을 고르면 눈 아이콘 + 숫자(읽을 글 "조회 12")
    if (i === 3 && icon !== 'none') {
      out.label = '12';
      out.srLabel = '조회 12';
      if (icon === 'prefix') out.prefixIcon = 'eye';
      else out.suffixIcon = 'eye';
    }
    // 말줄임이면 시각 · 조회는 줄지 않게
    if (truncate === 'truncate' && (i === 2 || i === 3)) out.shrink = 0;
    return out;
  });
  const reading = tagReading(list, k.tag.srSep);
  const code = useMemo(() => {
    const root = [...attr(size !== d.size, `size="${size}"`), ...attr(truncate === 'truncate', 'truncate')];
    const lines = list.map((it) => {
      const a = [
        ...attr(!!it.tone && it.tone !== d.tone, `tone="${it.tone}"`),
        ...attr(!!it.weight && it.weight !== d.weight, `weight="${it.weight}"`),
        ...attr(!!it.prefixIcon, 'prefixIcon={<Eye />}'),
        ...attr(!!it.suffixIcon, 'suffixIcon={<Eye />}'),
        ...attr(it.shrink !== undefined, `shrink={${it.shrink}}`),
        ...attr(!!it.srLabel, `srLabel="${it.srLabel}"`),
      ];
      return `  ${jsx('TagGroupItem', a, it.label)}`;
    });
    return `${icon !== 'none' && n === 4 ? 'import { Eye } from "lucide-react"\n' : ''}import { TagGroup, TagGroupItem } from "@/components/ui/tag-group"\n\n<TagGroup${root.length ? ` ${root.join(' ')}` : ''}>\n${lines.join('\n')}\n</TagGroup>`;
  }, [list, size, truncate, icon, n, d]);
  const stage = (
    <div className="flex flex-col items-start gap-2" style={{ fontFamily: FONT }}>
      <span className="text-[12px] leading-4" style={{ color: dcv(k.tone['fg-neutral-subtle'], mode) }}>
        폭 {width}
      </span>
      <div className="max-w-full rounded-xl px-0 py-3" style={{ width: Number(width), outline: `1px dashed ${dcv(k.tone['stroke-neutral-weak'], mode)}`, outlineOffset: 4 }}>
        <TagGroupView look={k.tag} mode={mode} size={size} truncate={truncate === 'truncate'} items={list} />
      </div>
    </div>
  );
  return (
    <Frame
      surface={dcv(k.tone['bg-layer-default'], mode)}
      stage={stage}
      reading={<Reading>&ldquo;{reading}&rdquo;</Reading>}
      code={code}
      controls={
        <>
          <Seg label="크기 size" value={size} options={(['t2', 't3', 't4'] as const).map((s) => [s, `${s} ${parseFloat(k.tag.sizes[s].text.fontSize)} / ${parseFloat(k.tag.sizes[s].text.lineHeight)}${s === d.size ? '(기본)' : ''}`] as const)} onChange={setSize} />
          <Seg label="항목 수" value={count} options={[['2', '2'], ['3', '3'], ['4', '4']] as const} onChange={setCount} />
          <Seg label="앞세울 항목" value={focus} options={[['none', '없음'], ['1', '첫째(식비)'], ['3', '셋째(시각)']] as const} onChange={setFocus} />
          {focus !== 'none' && (
            <div className="flex flex-wrap gap-5">
              <Seg label="그 항목의 톤 tone" value={focusTone} options={[['neutralSubtle', 'neutralSubtle(기본)'], ['neutral', 'neutral'], ['brand', 'brand']] as const} onChange={setFocusTone} />
              <Seg label="굵기 weight" value={focusWeight} options={[['regular', 'regular(기본)'], ['bold', 'bold']] as const} onChange={setFocusWeight} />
            </div>
          )}
          <Seg label="아이콘(넷째 항목 — 조회)" value={icon} options={[['none', '없음'], ['prefix', '앞 prefixIcon'], ['suffix', '뒤 suffixIcon']] as const} onChange={setIcon} />
          <Seg label="넘칠 때" value={truncate} options={[['wrap', '줄바꿈(기본)'], ['truncate', '한 줄 말줄임 truncate']] as const} onChange={setTruncate} />
          <Seg label="폭" value={width} options={WIDTHS} onChange={setWidth} />
          <ModeBrand mode={mode} setMode={setMode} brand={brand} setBrand={setBrand} />
        </>
      }
    />
  );
}

// ── Avatar ────────────────────────────────────────────────
const CREW: Person[] = [{ name: '이서연' }, { name: '박지훈' }, { name: '최유진' }, { name: '정하늘' }, { name: '한지우' }, { name: '윤재현' }, { name: '서다은' }];
export function AvatarPlayground({ kits }: { kits: Kits }) {
  const [name, setName] = useState('김민수');
  const [size, setSize] = useState<AvatarSize>(kits.desk.avatar.defaultSize);
  const [photo, setPhoto] = useState<'none' | 'photo'>('none');
  const [count, setCount] = useState<'3' | '4' | '6' | '8'>('6');
  const [surface, setSurface] = useState<'default' | 'floating'>('default');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const k = kits[brand];
  const display = name.trim();
  const hue = avatarHue(display, k.avatar.order);
  const sum = codePointSum(display);
  const people: Person[] = [{ name: display || ' ', photo: photo === 'photo' ? 0 : undefined }, ...CREW].slice(0, Number(count));
  const { shown, more } = stackSlots(people, k.stack.max);
  const label = `참여자 ${people.length}명: ${shown.map((p) => p.name.trim()).join(', ')}${more ? ` 외 ${more}명` : ''}`;
  const code = useMemo(
    () =>
      `import { Avatar, AvatarStack } from "@/components/ui/avatar"\n\n<Avatar${size !== kits.desk.avatar.defaultSize ? ` size={${size}}` : ''} name="${display}"${photo === 'photo' ? ' src={user.photoUrl}' : ''} />\n\n<AvatarStack${size !== kits.desk.stack.defaultSize ? ` size={${size}}` : ''}${surface === 'floating' ? ' surface="floating"' : ''} aria-label="${label}">\n  {people.map((p) => <Avatar key={p.id} name={p.name} src={p.photoUrl} />)}\n</AvatarStack>`,
    [size, display, photo, surface, label, kits.desk.avatar.defaultSize, kits.desk.stack.defaultSize],
  );
  const bg = dcv(surface === 'floating' ? k.tone['bg-layer-floating'] : k.tone['bg-layer-default'], mode);
  const fg = dcv(k.tone['fg-neutral'], mode);
  const sub = dcv(k.tone['fg-neutral-subtle'], mode);
  const stage = (
    <div className="flex flex-col items-start gap-5 rounded-2xl p-5" style={{ background: bg, fontFamily: FONT, boxShadow: surface === 'floating' ? 'var(--p-shadow-s3)' : undefined }}>
      <span className="text-[12px] leading-4" style={{ color: sub }}>
        {surface === 'floating' ? '시트 · 대화상자 안(bg-layer-floating)' : '화면(bg-layer-default)'}
      </span>
      <span className="flex items-center gap-3">
        <AvatarView look={k.avatar} mode={mode} size={size} name={display} photo={photo === 'photo' ? 0 : undefined} />
        <span style={{ fontSize: 16, lineHeight: '22px', color: fg }}>{display || '(이름 없음)'}</span>
      </span>
      <span className="flex items-center gap-2">
        <AvatarStackView look={k.avatar} stack={k.stack} mode={mode} size={size} people={people} surface={surface} ariaLabel={label} />
      </span>
    </div>
  );
  return (
    <Frame
      surface={dcv(k.tone['bg-layer-basement'], mode)}
      stageW={560}
      stage={stage}
      reading={
        <div className="flex flex-col items-center gap-2">
          <span className="text-center text-[12.5px] leading-5 text-fd-muted-foreground">
            {display ? (
              <>
                코드 포인트 합 <b className="text-fd-foreground">{sum.toLocaleString('ko-KR')}</b> → % 10 = <b className="text-fd-foreground">{sum % 10}</b> → <b className="text-fd-foreground">{hue}</b> · 이니셜 &ldquo;{avatarInitial(display)}&rdquo;
              </>
            ) : (
              '이름이 비면 회색 원에 글자를 넣지 않는다'
            )}
          </span>
          <Reading>
            아바타 — 읽지 않는다(옆 이름 &ldquo;{display}&rdquo; 을 한 번만) · 묶음 — &ldquo;{label}&rdquo;
          </Reading>
        </div>
      }
      code={code}
      controls={
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-fd-muted-foreground">이름 name — 바꾸면 이니셜 · 이름 색이 바뀐다</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="h-9 rounded-md border border-fd-border bg-fd-background px-2.5 text-[14px] text-fd-foreground" />
          </label>
          <Seg label="크기 size" value={size} options={AVATAR_SIZES.map((s) => [s, `${s}${s === kits.desk.avatar.defaultSize ? '(기본)' : ''}`] as const)} onChange={setSize} />
          <Seg label="사진 src" value={photo} options={[['none', '없음 — 이니셜'], ['photo', '있음']] as const} onChange={setPhoto} />
          <Seg label="묶음 인원" value={count} options={[['3', '3명'], ['4', '4명'], ['6', '6명'], ['8', '8명']] as const} onChange={setCount} />
          <Seg label="놓인 바탕 surface(링 색)" value={surface} options={[['default', 'default(기본)'], ['floating', 'floating — 시트 안']] as const} onChange={setSurface} />
          <ModeBrand mode={mode} setMode={setMode} brand={brand} setBrand={setBrand} />
        </>
      }
    />
  );
}

// ── Divider ───────────────────────────────────────────────
export function DividerPlayground({ kits }: { kits: Kits }) {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [inset, setInset] = useState<'full' | 'inset'>('full');
  const [decorative, setDecorative] = useState<'yes' | 'no'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const k = kits[brand];
  const fg = dcv(k.tone['fg-neutral'], mode);
  const sub = dcv(k.tone['fg-neutral-subtle'], mode);
  const line = <DividerView look={k.divider} mode={mode} orientation={orientation} inset={inset === 'inset'} decorative={decorative === 'yes'} />;
  const kv = (key: string, v: string) => (
    <p className="flex justify-between" style={{ margin: 0, paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24, fontSize: 15, lineHeight: '20px' }}>
      <span style={{ color: sub }}>{key}</span>
      <span style={{ color: fg }}>{v}</span>
    </p>
  );
  const stat = (key: string, v: string) => (
    <p className="flex flex-1 flex-col items-center" style={{ margin: 0, paddingTop: 16, paddingBottom: 16, gap: 2 }}>
      <span style={{ fontSize: 13, lineHeight: '18px', color: sub }}>{key}</span>
      <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700, color: fg, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
    </p>
  );
  const stage =
    orientation === 'horizontal' ? (
      <div className="flex flex-col overflow-hidden rounded-2xl" style={{ background: dcv(k.tone['bg-layer-default'], mode), fontFamily: FONT }}>
        {kv('결제 수단', '신한카드')}
        {line}
        {kv('할부', '3개월')}
      </div>
    ) : (
      <div className="flex items-stretch overflow-hidden rounded-2xl" style={{ background: dcv(k.tone['bg-layer-default'], mode), fontFamily: FONT }}>
        {stat('수입', '3,200,000원')}
        {line}
        {stat('지출', '1,486,200원')}
        {line}
        {stat('남은 돈', '1,713,800원')}
      </div>
    );
  const code =
    `import { Divider } from "@/components/ui/divider"\n\n` +
    `<Divider${orientation === 'vertical' ? ' orientation="vertical"' : ''}${inset === 'inset' ? ' inset' : ''}${decorative === 'no' ? ' decorative={false}' : ''} />`;
  const read = decorative === 'yes' ? '읽지 않는다 — aria-hidden(장식)' : `"구분선"${orientation === 'vertical' ? '(세로)' : ''} — role="separator"${orientation === 'vertical' ? ' · aria-orientation="vertical"' : ''}`;
  return (
    <Frame
      surface={dcv(k.tone['bg-layer-basement'], mode)}
      stage={stage}
      reading={<Reading label="보조 기술">{read}</Reading>}
      code={code}
      controls={
        <>
          <Seg label="방향 orientation" value={orientation} options={[['horizontal', 'horizontal(기본)'], ['vertical', 'vertical']] as const} onChange={setOrientation} />
          <Seg label={`들임 inset — ${k.divider.inset}`} value={inset} options={[['full', '끝까지(기본)'], ['inset', `inset — 양끝 ${k.divider.inset}`]] as const} onChange={setInset} />
          <Seg label="장식 decorative" value={decorative} options={[['yes', '장식(기본)'], ['no', '의미 있는 구분선']] as const} onChange={setDecorative} />
          <ModeBrand mode={mode} setMode={setMode} brand={brand} setBrand={setBrand} />
        </>
      }
    />
  );
}
