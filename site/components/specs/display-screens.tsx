// 표시 묶음 페이지(Badge · Notification Badge · Tag Group · Avatar · Divider)와 List 가 같이 쓰는 그림 조각 — 서버(빌드 때) 그림.
// 배지 · 알림 점 · 메타 줄 · 아바타 · 선은 display-look 이 YAML 에서 푼 값으로, 목록 줄은 list.yaml(ListView), 화면 틀은 kit 으로 그린다.
// 화면 예시의 글(가게 · 사람 · 금액)은 비교 페이지(2026-10-03)에서 사용자가 본 것과 같다 — 가계부 스타벅스 · 넷플릭스 · 쿠팡, 현대카드 M, 캘린더 공유, 제주 여행 더치페이, 인사팀 구성원.
import type { CSSProperties, ReactNode } from 'react';
import { MARK, MARK_LINE } from '../foundations/ui';
import { displayKit, type AvatarSize, type BadgeSize, type BadgeTone, type BadgeVariant, type DisplayIcon, type DisplayKit, type DisplayTone, type NotifSize, type Person, type TagItem, type TagSize } from './display-look';
import { AvatarStackView, AvatarView, BadgeGroupView, BadgeView, DIcon, DividerView, NotificationBadgeView, TagGroupView } from './display-view';
import { listLook } from './list-look';
import { navKit } from './nav-look';
import type { ListIcon, RowSpec } from './list-shared';
import { ListHeaderView, ListView } from './list-view';
import { Phone, rc, type Mode } from './kit';

export type Brand = 'desk' | 'hr';
export const dk = (brand: Brand = 'desk'): DisplayKit => displayKit(brand);
// 역할 색 — 모드를 정하지 않으면 사이트 테마를 따른다
export const tone = (name: DisplayTone, mode: Mode = 'auto', brand: Brand = 'desk') => rc(name, mode, brand);
export const FONT = "'Pretendard Variable', Pretendard, sans-serif";

// ── 부품 ──────────────────────────────────────────────────
// 배지 하나 — variant · tone · size · 앞 아이콘
export function B({ l, v, t, s, i, mode = 'auto', brand = 'desk', style }: { l: ReactNode; v?: BadgeVariant; t?: BadgeTone; s?: BadgeSize; i?: DisplayIcon; mode?: Mode; brand?: Brand; style?: CSSProperties }) {
  return (
    <BadgeView look={dk(brand).badge} mode={mode} variant={v} tone={t} size={s} prefixIcon={i} style={style}>
      {l}
    </BadgeView>
  );
}
export const BG = ({ children, brand = 'desk' }: { children: ReactNode; brand?: Brand }) => <BadgeGroupView look={dk(brand).badge}>{children}</BadgeGroupView>;
// 메타 줄 — 글만 넘기면 항목 하나씩
export const items = (...labels: (string | TagItem)[]): TagItem[] => labels.map((l) => (typeof l === 'string' ? { label: l } : l));
export function T({ items: list, size, truncate, mode = 'auto', brand = 'desk', style }: { items: TagItem[]; size?: TagSize; truncate?: boolean; mode?: Mode; brand?: Brand; style?: CSSProperties }) {
  return <TagGroupView look={dk(brand).tag} mode={mode} size={size} truncate={truncate} items={list} style={style} />;
}
export function A({ name, size, photo, mode = 'auto', brand = 'desk', decorative = true, style }: { name: string; size?: AvatarSize; photo?: number; mode?: Mode; brand?: Brand; decorative?: boolean; style?: CSSProperties }) {
  return <AvatarView look={dk(brand).avatar} mode={mode} size={size} name={name} photo={photo} decorative={decorative} style={style} />;
}
export function S({ people, size, mode = 'auto', brand = 'desk', surface, max, ariaLabel }: { people: Person[]; size?: AvatarSize; mode?: Mode; brand?: Brand; surface?: 'default' | 'floating'; max?: number; ariaLabel?: string }) {
  return <AvatarStackView look={dk(brand).avatar} stack={dk(brand).stack} mode={mode} size={size} people={people} surface={surface} max={max} ariaLabel={ariaLabel} />;
}
export function D({ mode = 'auto', brand = 'desk', orientation, inset, style }: { mode?: Mode; brand?: Brand; orientation?: 'horizontal' | 'vertical'; inset?: boolean; style?: CSSProperties }) {
  return <DividerView look={dk(brand).divider} mode={mode} orientation={orientation} inset={inset} style={style} />;
}
// 알림이 붙은 아이콘 — 상단 바의 24 아이콘(누르는 자리는 감싼 상자 44 — Top Navigation)
export function NotifIcon({ icon = 'bell', size = 24, notif, count, visible = true, mode = 'auto', brand = 'desk', color }: { icon?: DisplayIcon; size?: number; notif?: NotifSize; count?: number; visible?: boolean; mode?: Mode; brand?: Brand; color?: string }) {
  return (
    <NotificationBadgeView look={dk(brand).notif} mode={mode} size={notif} attach="icon" visible={visible} count={count}>
      <DIcon name={icon} size={size} color={color ?? tone('fg-neutral', mode, brand)} />
    </NotificationBadgeView>
  );
}
// 상단 바 아이콘 버튼 자리 — Top Navigation 의 상자(44, top-navigation.yaml). 그림이라 누르지 않는다
export function BarButton({ children }: { children: ReactNode }) {
  const s = navKit().top.icon.size;
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: s, height: s, flexShrink: 0 }}>{children}</span>;
}

// ── 목록 줄 ───────────────────────────────────────────────
export const people = {
  minsu: { name: '김민수' },
  seoyeon: { name: '이서연' },
  jihun: { name: '박지훈' },
  yujin: { name: '최유진' },
  haneul: { name: '정하늘' },
  jiwoo: { name: '한지우' },
};
// 앞 넷이 서로 다른 이름 색(김민수 blue · 이서연 brown · 박지훈 green · 한지우 orange)
export const SIX: Person[] = [people.minsu, people.seoyeon, people.jihun, people.jiwoo, people.yujin, people.haneul];

export function Rows({ rows, mode = 'auto', brand = 'desk', divider, ariaLabel }: { rows: RowSpec[]; mode?: Mode; brand?: Brand; divider?: 'none' | 'full' | 'inset'; ariaLabel?: string }) {
  return <ListView look={listLook(brand)} rows={rows} mode={mode} live={false} divider={divider} ariaLabel={ariaLabel} />;
}
export function Header({ title, mode = 'auto', brand = 'desk', variant }: { title: string; mode?: Mode; brand?: Brand; variant?: 'mediumWeak' | 'boldSolid' }) {
  return <ListHeaderView look={listLook(brand)} title={title} variant={variant} mode={mode} />;
}
// 가계부 줄 — 타일 · 제목(+ 상태 배지) · 설명 줄 Tag Group(t3 · 한 줄 말줄임) · 금액.
// 설명 줄은 분류 · 자산 · 시각(tag-group.md 의 같은 순서) — 분류 · 시각은 줄지 않고(shrink 0) 자산만 준다. 카드 상세처럼 자산이 화면 제목이면 뺀다
export type Tx = { title: string; hue: string; icon: ListIcon; cat: string; asset?: string; when: string; amount: string; badge?: { l: string; t?: BadgeTone; v?: BadgeVariant }; excluded?: 'scheduled' | 'refunded' };
export function txMeta(tx: Tx, asset = true): TagItem[] {
  return [{ label: tx.cat, shrink: 0 }, ...(asset && tx.asset ? [{ label: tx.asset }] : []), { label: tx.when, shrink: 0 }];
}
export function txRow(tx: Tx, mode: Mode = 'auto', brand: Brand = 'desk', extra?: Partial<RowSpec> & { asset?: boolean }): RowSpec {
  const { asset = true, ...rest } = extra ?? {};
  return {
    kind: 'button',
    prefix: { tile: tx.hue, icon: tx.icon },
    title: tx.title,
    titleBadge: tx.badge ? <B l={tx.badge.l} t={tx.badge.t} v={tx.badge.v} mode={mode} brand={brand} /> : undefined,
    detailNode: <T items={txMeta(tx, asset)} size="t3" truncate mode={mode} brand={brand} />,
    suffix: { amount: tx.amount },
    excluded: tx.excluded,
    ...rest,
  };
}
export const TX = {
  starbucks: { title: '스타벅스 강남역점', hue: 'brown', icon: 'coffee', cat: '카페', asset: '현대카드 M', when: '오후 2:10', amount: '−5,600원' },
  netflix: { title: '넷플릭스', hue: 'red', icon: 'receipt', cat: '구독', asset: '현대카드 M', when: '10월 18일', amount: '−17,000원', badge: { l: '예정' }, excluded: 'scheduled' },
  coupang: { title: '쿠팡', hue: 'violet', icon: 'shopping-bag', cat: '쇼핑', asset: '현대카드 M', when: '10월 2일', amount: '−32,000원', badge: { l: '환불됨' }, excluded: 'refunded' },
  lunch: { title: '점심 식사', hue: 'orange', icon: 'utensils', cat: '식비', asset: '신한카드', when: '오후 12:40', amount: '−12,000원' },
  bus: { title: '교통 정기권', hue: 'blue', icon: 'bus', cat: '교통', asset: '국민 체크카드', when: '3/12회', amount: '−62,000원', badge: { l: '연체 3', t: 'critical' } },
  trip: { title: '여행 자금', hue: 'green', icon: 'piggy-bank', cat: '저축', when: '목표 2,000,000원', amount: '+200,000원', badge: { l: '달성', t: 'positive' } },
} satisfies Record<string, Tx>;

// ── 화면 ──────────────────────────────────────────────────
// 흰 바탕 화면(폰 · 화면 폭 360) — 목록은 흰 바탕 위
export function Screen({ title, children, mode = 'auto', scale = 0.62, h = 560, right, back = true, bg = 'bg-layer-default', tabs = false }: { title: string; children: ReactNode; mode?: Mode; scale?: number; h?: number; right?: ReactNode; back?: boolean; bg?: string; tabs?: boolean }) {
  return (
    <Phone title={title} mode={mode} scale={scale} h={h} bg={bg} right={right} back={back} tabs={tabs} screenW={360}>
      <div className="flex flex-col">{children}</div>
    </Phone>
  );
}
// 카드 상세 머리 — 이름 · 상태 배지 둘(large) · 메타 줄
export function CardHead({ mode = 'auto', brand = 'desk' }: { mode?: Mode; brand?: Brand }) {
  return (
    <div className="flex flex-col px-6 pb-3 pt-2" style={{ gap: 8 }}>
      <span className="text-[20px] font-bold leading-7" style={{ color: tone('fg-neutral', mode, brand) }}>
        현대카드 M
      </span>
      <BG brand={brand}>
        <B l="신용" s="large" mode={mode} brand={brand} />
        <B l="단종" s="large" v="solid" mode={mode} brand={brand} />
      </BG>
      <T items={items('결제일 14일', '연회비 2만원', '포인트형')} mode={mode} brand={brand} />
    </div>
  );
}
// 현대카드 M 의 이번 달 거래 — 보통 줄 · 예정(합계에 안 든다) · 환불(취소선)
export function CardTxScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="카드" mode={mode} scale={scale} h={h}>
      <CardHead mode={mode} />
      <Header title="10월 거래" mode={mode} />
      <Rows mode={mode} rows={[txRow(TX.starbucks, mode, 'desk', { asset: false }), txRow(TX.netflix, mode, 'desk', { asset: false }), txRow(TX.coupang, mode, 'desk', { asset: false })]} />
    </Screen>
  );
}
// 캘린더 공유 — 사람(아바타 36) · 권한 배지(outline)
export const SHARE: { p: Person; me?: boolean; badge: { l: string; t: BadgeTone; i: DisplayIcon } }[] = [
  { p: people.minsu, me: true, badge: { l: '소유자', t: 'neutral', i: 'crown' } },
  { p: people.seoyeon, badge: { l: '편집 가능', t: 'positive', i: 'pencil' } },
  { p: people.jihun, badge: { l: '읽기 전용', t: 'informative', i: 'eye' } },
];
export function shareRows(mode: Mode = 'auto'): RowSpec[] {
  return SHARE.map(({ p, me, badge }) => ({
    kind: 'view',
    prefix: { person: p.name },
    title: p.name,
    titleBadge: me ? <B l="나" t="brand" mode={mode} /> : undefined,
    suffixNode: <B l={badge.l} v="outline" t={badge.t} i={badge.i} mode={mode} />,
  }));
}
export function CalendarShareScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="캘린더 공유" mode={mode} scale={scale} h={h}>
      <div className="px-6 pb-2 pt-2 text-[14px] leading-5" style={{ color: tone('fg-neutral-subtle', mode) }}>
        &lsquo;우리 집&rsquo; 캘린더를 함께 보는 사람이에요.
      </div>
      <Header title="함께 보는 사람 3명" mode={mode} />
      <Rows mode={mode} rows={shareRows(mode)} />
    </Screen>
  );
}
// 제주 여행 더치페이 — 참가자(아바타 36 · 한 줄) · 머리에 묶음(24) + 옆에 "4명 · 412,000원"
export const DUTCH: { p: Person; amount: string; payer?: boolean; me?: boolean }[] = [
  { p: people.minsu, amount: '103,000원', payer: true, me: true },
  { p: people.seoyeon, amount: '103,000원' },
  { p: people.jihun, amount: '103,000원' },
  { p: people.jiwoo, amount: '103,000원' },
];
export function dutchRows(mode: Mode = 'auto'): RowSpec[] {
  return DUTCH.map(({ p, amount, payer, me }) => ({
    kind: 'view',
    prefix: { person: p.name },
    title: p.name,
    // 본인 표시(나)는 brand · 결제자는 분류(neutral) — 한 줄에 둘까지
    titleBadge:
      me || payer ? (
        <BG>
          {me && <B l="나" t="brand" mode={mode} />}
          {payer && <B l="결제자" mode={mode} />}
        </BG>
      ) : undefined,
    suffix: { amount },
  }));
}
// 묶음 + 옆에 전체 수(글) — 묶음은 장식
export function DutchSummary({ mode = 'auto', brand = 'desk', size = '24', crew = SIX, total = '412,000원' }: { mode?: Mode; brand?: Brand; size?: AvatarSize; crew?: Person[]; total?: string }) {
  return (
    <span className="flex items-center" style={{ gap: 8 }}>
      <S people={crew} size={size} mode={mode} brand={brand} />
      <T items={items(`${crew.length}명`, total)} size="t3" mode={mode} brand={brand} />
    </span>
  );
}
export function DutchScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="제주 여행 더치페이" mode={mode} scale={scale} h={h}>
      <div className="px-6 pb-3 pt-2">
        <DutchSummary mode={mode} crew={DUTCH.map((d) => d.p)} />
      </div>
      <Header title="나눌 사람" mode={mode} />
      <Rows mode={mode} rows={dutchRows(mode)} />
    </Screen>
  );
}
// 인사팀 구성원(HR) — 사진이 있으면 사진, 없으면 이니셜(42 · 두 줄)
export const HR_TEAM: { p: Person; role: string }[] = [
  { p: { name: '윤재현', photo: 0 }, role: '팀장' },
  { p: { name: '서다은', photo: 1 }, role: '매니저' },
  { p: { name: '강도윤' }, role: '사원' },
];
export function hrRows(mode: Mode = 'auto'): RowSpec[] {
  return HR_TEAM.map(({ p, role }) => ({ kind: 'button', prefix: { person: p.name, photo: p.photo }, title: p.name, detailNode: <T items={items('인사팀', role)} size="t3" truncate mode={mode} brand="hr" />, suffix: { chevron: true } }));
}
export function HrTeamScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="인사팀 구성원" mode={mode} scale={scale} h={h}>
      <Header title="3명" mode={mode} brand="hr" />
      <ListView look={listLook('hr')} rows={hrRows(mode)} mode={mode} live={false} />
    </Screen>
  );
}

// ── 판 · 글 ───────────────────────────────────────────────
// 목록 줄 판 — 실제 폰 화면 폭(360)으로 그린다. 좁은 칸에 줄여 그리면 말줄임 · 줄바꿈이 실제와 달라진다 — 좁은 화면에서는 판 안에서 가로로 민다
export const SCREEN_W = 360;
export function PhoneBoard({ children, mode = 'auto', brand = 'desk', bg = 'bg-layer-default', pad = 6 }: { children: ReactNode; mode?: Mode; brand?: Brand; bg?: string; pad?: number }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-xl">
      <div className="rounded-xl" style={{ width: SCREEN_W, background: rc(bg, mode, brand), paddingTop: pad, paddingBottom: pad }}>
        {children}
      </div>
    </div>
  );
}
// 흰 판 — 그림 속 화면 조각
export function Board({ children, mode = 'auto', brand = 'desk', pad = 20, bg = 'bg-layer-default', style, className = '' }: { children: ReactNode; mode?: Mode; brand?: Brand; pad?: number; bg?: string; style?: CSSProperties; className?: string }) {
  return (
    <div className={`rounded-xl ${className}`} style={{ background: rc(bg, mode, brand), padding: pad, ...style }}>
      {children}
    </div>
  );
}
// 이렇게 · 이렇게 하지 않는다 — 좁은 화면에서는 위아래로
// stack — 목록 줄처럼 폭이 필요한 그림은 늘 위아래로(문서 본문 폭에서 둘로 나누면 줄이 눌린다)
export const Pair = ({ children, three = false, stack = false }: { children: ReactNode; three?: boolean; stack?: boolean }) => (
  <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : three ? 'max-w-[960px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>
);
export const W = ({ children, w = 312 }: { children: ReactNode; w?: number }) => (
  <div className="max-w-full" style={{ width: w }}>
    {children}
  </div>
);
export function Muted({ children, mode = 'auto', brand = 'desk' }: { children: ReactNode; mode?: Mode; brand?: Brand }) {
  return (
    <span className="text-[12px] leading-4" style={{ color: tone('fg-neutral-subtle', mode, brand) }}>
      {children}
    </span>
  );
}
// 부위 핀 · 칠
export function Pin({ n, style }: { n: string; style?: CSSProperties }) {
  return (
    <span aria-hidden className="pointer-events-none absolute z-[6] flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE, ...style }}>
      {n}
    </span>
  );
}
export const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1, background: MARK };
export const markLine: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 };
// 수치 띠 — 자리(absolute)에 분홍 띠 + 숫자
export function Band({ style, label, vertical = false }: { style: CSSProperties; label?: string; vertical?: boolean }) {
  return (
    <span aria-hidden className="pointer-events-none absolute z-[4] flex items-center justify-center" style={{ background: MARK, ...style }}>
      {label && (
        <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, writingMode: vertical ? 'vertical-rl' : undefined }}>
          {label}
        </span>
      )}
    </span>
  );
}
// 코드 예시의 미리보기 — 흰 판(사이트 테마를 따른다), 아래 코드 블록에 붙는다
export function Preview({ children, caption, w = 400, pad = 24, bg = 'bg-layer-default', brand = 'desk' }: { children: ReactNode; caption?: string; w?: number; pad?: number; bg?: string; brand?: Brand }) {
  return (
    <figure className="not-prose mb-0 mt-6">
      <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border" style={{ background: rc(bg, 'auto', brand), paddingTop: pad, paddingBottom: pad, paddingLeft: 8, paddingRight: 8 }}>
        <div className="w-full" style={{ maxWidth: w }}>
          {children}
        </div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
export const modeKo = (m: Mode) => (m === 'dark' ? '다크' : m === 'light' ? '라이트' : '');
