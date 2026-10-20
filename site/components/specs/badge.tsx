// Badge 페이지의 그림 — specs/components/badge.md 의 `[그림: …](../../site/components/specs/badge.tsx#<id>)` 자리.
// 배지는 badge.yaml 을 푼 값(display-look 의 badgeLook)으로, 메타 줄은 tag-group.yaml, 아바타는 avatar.yaml, 칩은 chip.yaml(chipLook),
// 목록 줄은 list.yaml(ListView)로 그린다. 화면의 글은 비교 페이지(2026-10-03)와 같다 — 현대카드 M · 가계부 · 캘린더 공유.
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { chipLook } from './chip-look';
import { listLook } from './list-look';
import { ChipView } from './chip-view';
import { BADGE_TONES, type BadgeSize, type BadgeTone, type BadgeVariant } from './display-look';
import { BadgePlayground } from './display-playground';
import { BadgeGroupView, BadgeView, DIcon } from './display-view';
import {
  B,
  BG,
  Band,
  Board,
  CalendarShareScreen,
  CardHead,
  CardTxScreen,
  Muted,
  Pair,
  PhoneBoard,
  Pin,
  Preview,
  Rows,
  T,
  TX,
  W,
  dk,
  items,
  markBox,
  markLine,
  modeKo,
  tone,
  txMeta,
  txRow,
} from './display-screens';
import { Cap } from './select-screens';
import { Verdict, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const bl = (brand: 'desk' | 'hr' = 'desk') => dk(brand).badge;
const px = (v: string) => parseFloat(v);
const TONE_KO: Record<BadgeTone, string> = { neutral: '중립', brand: '브랜드', informative: '안내', positive: '긍정', warning: '주의', critical: '위험' };
// 톤마다 badge.md 의 groo 예
const TONE_EX: Record<BadgeTone, string> = { neutral: '예정', brand: 'Pro', informative: '읽기 전용', positive: '달성', warning: '만료 임박', critical: '연체' };
// 같은 톤이면 weak → outline → solid 순으로 강해진다(badge.md)
const STRENGTH: BadgeVariant[] = ['weak', 'outline', 'solid'];

// ── Overview ──────────────────────────────────────────────
// 라이트 · 다크 — 현대카드 M 상세(머리 large 둘 · 이번 달 거래의 예정 · 환불) · 캘린더 공유(권한 outline + 앞 아이콘)
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <CardTxScreen mode={mode} scale={0.62} h={560} />
          <CalendarShareScreen mode={mode} scale={0.62} h={560} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <BadgePlayground kits={{ desk: dk('desk'), hr: dk('hr') }} lists={{ desk: listLook('desk'), hr: listLook('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const at = (n: string, style: CSSProperties) => <Pin n={n} style={style} />;
const Anatomy: Fig = ({ caption }) => {
  const lk = bl();
  const z = 3;
  const s = lk.sizes.large;
  // 부위 핀은 배지 위 바깥에 — 아이콘 · 글은 상자 안에서 세로 가운데라 그만큼 더 올린다
  const iconTop = ((s.minH - s.icon) / 2) * z;
  const labelTop = ((s.minH - px(s.text.lineHeight)) / 2) * z;
  const g = 2;
  const m = lk.sizes.medium;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-10 pb-8 pt-14">
        <div className="flex flex-wrap items-end justify-center gap-x-16 gap-y-12">
          <BadgeView
            look={lk}
            variant="outline"
            tone="positive"
            size="large"
            prefixIcon="pencil"
            zoom={z}
            zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 }, icon: markBox, label: markBox }}
            pins={{ root: at('ⓐ', { left: -30, top: -16 }), icon: at('ⓑ', { left: '50%', top: -(iconTop + 30), marginLeft: -10 }), label: at('ⓒ', { left: '50%', top: -(labelTop + 30), marginLeft: -10 }) }}
          >
            편집 가능
          </BadgeView>
          {/* 한 대상의 배지 둘 — 사이(묶음 간격)를 분홍 띠로 */}
          <span className="relative inline-flex items-center">
            <BadgeView look={lk} zoom={g}>
              신용
            </BadgeView>
            <span aria-hidden className="relative flex shrink-0 justify-center" style={{ width: lk.groupGap * g, height: m.minH * g, background: MARK }}>
              <span className="absolute -top-6 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                {lk.groupGap}
              </span>
            </span>
            <BadgeView look={lk} variant="solid" zoom={g}>
              단종
            </BadgeView>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Prefix Icon'],
            ['ⓒ', 'Label'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
        <span className="text-center text-[12px] leading-4 pk-muted">
          왼쪽은 outline 앞 아이콘 배지(large, 3배), 오른쪽은 한 대상의 배지 둘(medium, 2배) — 사이 {lk.groupGap}
        </span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 변형 셋 × 톤 여섯 — 라이트 · 다크
const Variant: Fig = ({ caption }) => {
  const lk = bl();
  const grid = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Board mode={mode} className="overflow-x-auto">
        <div className="mx-auto grid items-center gap-x-5 gap-y-3" style={{ gridTemplateColumns: 'max-content repeat(3, max-content)', width: 'max-content' }}>
          <span />
          {STRENGTH.map((v) => (
            <Muted key={v} mode={mode}>
              {v}
              {v === lk.defaults.variant ? ' (기본)' : ''}
            </Muted>
          ))}
          {BADGE_TONES.map((t) => (
            <Fragment key={t}>
              <span className="text-[12px] leading-4" style={{ color: tone('fg-neutral', mode) }}>
                <b>{TONE_KO[t]}</b> <span style={{ color: tone('fg-neutral-subtle', mode) }}>{t}</span>
              </span>
              {STRENGTH.map((v) => (
                <span key={v}>
                  <B l={TONE_EX[t]} v={v} t={t} mode={mode} />
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      </Board>
      <Cap strong={modeKo(mode)}>같은 톤이면 weak → outline → solid 순으로 강해진다</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[560px] gap-4">
        {grid('light')}
        {grid('dark')}
      </div>
    </Panel>
  );
};

// 크기 둘 — 3배로 그려 높이 · 좌우 · 아이콘 사이를 재고, 아래에 제 자리(줄 안 · 상세 머리)
function Measured({ size }: { size: BadgeSize }) {
  const lk = bl();
  const s = lk.sizes[size];
  const z = 3;
  return (
    <span className="relative inline-flex" style={{ marginLeft: 34 }}>
      <BadgeView look={lk} size={size} prefixIcon="clock" zoom={z}>
        예정
      </BadgeView>
      <Band style={{ left: -30, top: 0, width: 20, height: s.minH * z }} label={String(s.minH)} vertical />
      <Band style={{ left: 0, top: 0, width: s.padX * z, height: s.minH * z }} label={String(s.padX)} />
      <Band style={{ right: 0, top: 0, width: s.padX * z, height: s.minH * z }} />
      <Band style={{ left: (s.padX + s.icon) * z, top: 0, width: lk.gap * z, height: s.minH * z }} />
      <Band style={{ left: s.padX * z, top: 0, width: s.icon * z, height: s.padY * z }} />
    </span>
  );
}
const SIZE_WHERE: Record<BadgeSize, string> = { medium: '목록 줄 · 표 · 이름 옆', large: '상세 머리 · 카드 제목 옆' };
const Size: Fig = ({ caption }) => {
  const lk = bl();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {(['medium', 'large'] as const).map((size) => {
          const s = lk.sizes[size];
          return (
            <div key={size} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_360px]">
              <Board className="flex flex-col items-center gap-5 overflow-hidden" pad={24}>
                <div className="flex w-full flex-col gap-0.5">
                  <b className="text-[14px] pk-text">
                    {size} {s.minH}
                    {size === lk.defaults.size && <span className="font-normal pk-muted"> (기본)</span>}
                  </b>
                  <span className="text-[12px] leading-4 pk-muted">{SIZE_WHERE[size]}</span>
                </div>
                <Measured size={size} />
                <span className="text-center text-[12px] leading-4 pk-muted">
                  최소 높이 {s.minH} · 위아래 {s.padY} · 좌우 {s.padX} · 모서리 {s.radius} · 글자 {px(s.text.fontSize)} / {px(s.text.lineHeight)} · 앞 아이콘 {s.icon} · 아이콘과 글 사이 {lk.gap}
                </span>
              </Board>
              <div className="flex min-w-0 flex-col gap-2">
                <PhoneBoard pad={8}>{size === 'medium' ? <Rows rows={[txRow(TX.netflix), txRow(TX.bus)]} /> : <CardHead />}</PhoneBoard>
                <Cap>{size === 'medium' ? `줄 안 — 제목 옆, 사이 ${dk().titleGap}` : '상세 머리 — 이름 아래 둘'}</Cap>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">분홍 띠 — 높이 · 좌우 여백 · 위 여백 · 아이콘과 글 사이(3배). 글이 커지면(글자 크기 설정) 최소 높이는 그대로 두고 상자가 글을 따라 커진다</p>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 상태는 배지 · 메타는 Tag Group · 고르기는 Chip — 한 화면에
function ZoneMark({ n, children, style }: { n: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="relative inline-flex max-w-full" style={{ ...markLine, borderRadius: 6, ...style }}>
      {children}
      <Pin n={n} style={{ right: -12, top: -12 }} />
    </span>
  );
}
const RoleGuide: Fig = ({ caption }) => {
  const ck = chipLook('desk');
  const rows = [
    {
      ...txRow(TX.netflix),
      titleBadge: (
        <ZoneMark n="ⓑ">
          <B l="예정" />
        </ZoneMark>
      ),
      detailNode: (
        <ZoneMark n="ⓒ" style={{ minWidth: 0 }}>
          <T items={txMeta(TX.netflix)} size="t3" truncate />
        </ZoneMark>
      ),
    },
    txRow(TX.starbucks),
    txRow(TX.bus),
  ];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="w-[360px] overflow-hidden rounded-2xl pk-surface pb-2 pt-5">
          <div className="px-6 pb-3 text-[20px] font-bold leading-7 pk-text">가계부</div>
          <div className="px-6 pb-2">
            <ZoneMark n="ⓐ" style={{ padding: 2 }}>
              <span className="flex gap-2">
                <ChipView look={ck} variant="solid" selected state="enabled" label="이번 달" suffixIcon="chevron-down" />
                <ChipView look={ck} variant="solid" state="enabled" label="카테고리" suffixIcon="chevron-down" />
              </span>
            </ZoneMark>
          </div>
          <Rows rows={rows} />
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted">
          <span>
            <b className="pk-text">ⓐ Chip</b> 고르기 · 거르기(누른다)
          </span>
          <span>
            <b className="pk-text">ⓑ Badge</b> 상태 · 분류(누르지 않는다)
          </span>
          <span>
            <b className="pk-text">ⓒ Tag Group</b> 메타 — 분류 · 자산 · 시각
          </span>
        </div>
      </div>
    </Figure>
  );
};

// 누르는 것은 알약 Chip — 배지는 누르지 않는다
function TitleLine({ title, badge }: { title: string; badge: ReactNode }) {
  return (
    <span className="flex items-center text-[16px] leading-[22px] pk-text" style={{ gap: dk().titleGap }}>
      <span className="truncate">{title}</span>
      {badge}
    </span>
  );
}
const PressGuide: Fig = ({ caption }) => {
  const ck = chipLook('desk');
  const lk = bl();
  const fake = (l: string) => (
    <BadgeView look={lk} style={{ borderRadius: 9999 }}>
      <span className="inline-flex items-center" style={{ gap: lk.gap }}>
        {l}
        <DIcon name="x" size={lk.sizes.medium.icon} strokeWidth={2.4} />
      </span>
    </BadgeView>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="거르기는 알약 Chip(누르면 걸리고 풀린다) · 상태는 둥근 사각 Badge(누르지 않는다)">
          <div className="flex flex-col items-start gap-4">
            <span className="flex flex-wrap gap-2">
              <ChipView look={ck} variant="solid" selected state="enabled" label="식비" suffixIcon="chevron-down" />
              <ChipView look={ck} variant="solid" state="enabled" label="결제 수단" suffixIcon="chevron-down" />
            </span>
            <TitleLine title="넷플릭스" badge={<B l="예정" />} />
            <TitleLine title="교통 정기권" badge={<B l="연체 3" t="critical" />} />
          </div>
        </Verdict>
        <Verdict ok={false} note="배지에 지우기 × 를 달아 거르기에 썼다 — 누르는 것은 Chip(입력값 칩 · 필터 칩)이다">
          <div className="flex flex-col items-start gap-4">
            <span className="flex flex-wrap gap-1.5">
              {fake('식비')}
              {fake('카페')}
            </span>
            <TitleLine title="넷플릭스" badge={<B l="예정" />} />
            <TitleLine title="교통 정기권" badge={<B l="연체 3" t="critical" />} />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 반복되는 줄은 weak — 줄마다 solid
const weakRows = (v: BadgeVariant) => [
  txRow({ ...TX.netflix, badge: { l: '예정', v } }),
  txRow({ ...TX.bus, badge: { l: '연체 3', t: 'critical', v } }),
  txRow({ ...TX.trip, badge: { l: '달성', t: 'positive', v } }),
  txRow({ ...TX.coupang, badge: { l: '환불됨', v } }),
];
const WeakGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="목록은 weak — 줄마다 있어도 무겁지 않고, 뜻은 톤으로 가른다">
        <PhoneBoard>
          <Rows rows={weakRows('weak')} />
        </PhoneBoard>
      </Verdict>
      <Verdict ok={false} note="줄마다 solid — 화면이 무거워지고 정작 눈에 띄어야 할 연체가 묻힌다">
        <PhoneBoard>
          <Rows rows={weakRows('solid')} />
        </PhoneBoard>
      </Verdict>
    </Pair>
  </Panel>
);

// 흰 표면 위에서 — 라이트에서 bg-neutral-weak 와 회색 바탕(bg-layer-basement)이 같은 색이라 라이트로 그린다
const SurfaceGuide: Fig = ({ caption }) => {
  const m: Mode = 'light';
  const basement = rc('bg-layer-basement', m);
  const set = (v: BadgeVariant) => (
    <span className="flex flex-wrap gap-1.5">
      <B l="예정" v={v} mode={m} />
      <B l="기록만" v={v} mode={m} />
      <B l="일시정지" v={v} mode={m} />
    </span>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok bg={basement} note="흰 표면(카드 · 시트) 위 weak · 회색 바탕 위는 outline">
          <div className="flex w-full max-w-[300px] flex-col gap-4">
            <Board mode={m} pad={16}>
              <div className="flex flex-col gap-1.5">
                <Muted mode={m}>흰 표면(bg-layer-default) — weak</Muted>
                {set('weak')}
              </div>
            </Board>
            <div className="flex flex-col gap-1.5 px-1">
              <Muted mode={m}>회색 바탕(bg-layer-basement) — outline</Muted>
              {set('outline')}
            </div>
          </div>
        </Verdict>
        <Verdict ok={false} bg={basement} note="회색 바탕 위 중립 weak — 바탕과 같은 색이라 상자가 사라진다">
          <div className="flex w-full max-w-[300px] flex-col gap-1.5 px-1">
            <Muted mode={m}>회색 바탕(bg-layer-basement) — weak</Muted>
            {set('weak')}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 한 대상에 둘까지 — 카드 줄(타일 · 제목 옆 배지 · 메타)
const cardRow = (badges: ReactNode) => [{ kind: 'view' as const, prefix: { tile: 'blue', icon: 'credit-card' as const }, title: '현대카드 M', titleBadge: badges, detailNode: <T items={items('결제일 14일', '포인트형')} size="t3" truncate /> }];
function CardLine({ badges }: { badges: ReactNode }) {
  return (
    <PhoneBoard>
      <Rows rows={cardRow(badges)} />
    </PhoneBoard>
  );
}
const CountGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="한 줄에 둘까지 — 사이 4, 줄바꿈하지 않는다">
        <W w={360}>
          <CardLine
            badges={
              <BG>
                <B l="신용" />
                <B l="단종" v="solid" />
              </BG>
            }
          />
        </W>
      </Verdict>
      <Verdict ok={false} note="배지 넷 — 제목이 밀려 잘리고 무엇이 중요한지 흐려진다. 나머지는 상세에서">
        <W w={360}>
          <CardLine
            badges={
              <BG>
                <B l="신용" />
                <B l="단종" v="solid" />
                <B l="포인트형" />
                <B l="연회비 없음" t="informative" />
              </BG>
            }
          />
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// 색은 뜻으로, 브랜드는 아껴서
const ToneGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note='"달성" 은 완료라 positive — 브랜드는 요금제처럼 브랜드와 닿는 자리에만'>
        <PhoneBoard>
          <Rows rows={[txRow(TX.trip), { kind: 'button', prefix: { icon: 'trending-up' }, title: '증권 연동', titleBadge: <B l="Pro" t="brand" />, suffix: { chevron: true } }]} />
        </PhoneBoard>
      </Verdict>
      <Verdict ok={false} note='"달성" 을 브랜드 색으로 — 같은 뜻이 화면마다 다른 색이 되고 브랜드 버튼과 다툰다'>
        <PhoneBoard>
          <Rows rows={[txRow({ ...TX.trip, badge: { l: '달성', t: 'brand' } }), { kind: 'button', prefix: { icon: 'trending-up' }, title: '증권 연동', titleBadge: <B l="Pro" t="brand" />, suffix: { chevron: true } }]} />
        </PhoneBoard>
      </Verdict>
    </Pair>
  </Panel>
);

// 글 — 한두 낱말 · 문장 · 코드값과 영어 대문자
const WritingGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair three>
      <Verdict ok note='명사로 짧게 — "예정" · "연체 3" · "한도 초과"'>
        <span className="flex flex-wrap justify-center gap-1.5">
          <B l="예정" />
          <B l="연체 3" t="critical" />
          <B l="한도 초과" t="critical" />
          <B l="새로" t="informative" />
        </span>
      </Verdict>
      <Verdict ok={false} note="문장이 된 배지 — 글로 쓰거나 Callout 이다">
        <span className="flex flex-wrap justify-center gap-1.5">
          <B l="결제가 예정되어 있어요" />
        </span>
      </Verdict>
      <Verdict ok={false} note='영어 대문자 · 코드값 — "새로" · "관리자" 로 바꾼다'>
        <span className="flex flex-wrap justify-center gap-1.5">
          <B l="NEW" t="informative" v="solid" style={{ letterSpacing: '0.08em' }} />
          <B l="ROLE_ADMIN" brand="hr" />
        </span>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 예시(미리보기) — badge.md 의 코드 그대로 ─────────
const ExRow: Fig = ({ caption }) => (
  <Preview caption={caption} w={320}>
    <div className="flex flex-col items-start gap-4 text-[16px] leading-[22px] pk-text">
      <span className="flex items-center" style={{ gap: dk().titleGap }}>
        <span className="truncate">넷플릭스</span>
        <B l="예정" />
      </span>
      <B l="연체 3" t="critical" />
    </div>
  </Preview>
);
const ExDetail: Fig = ({ caption }) => (
  <Preview caption={caption} w={320}>
    <div className="flex justify-center">
      <BG>
        <B l="신용" s="large" />
        <B l="단종" s="large" v="solid" />
      </BG>
    </div>
  </Preview>
);
const ExOutline: Fig = ({ caption }) => (
  <Preview caption={caption} w={320}>
    <div className="flex flex-wrap justify-center gap-2">
      <B l="편집 가능" v="outline" t="positive" i="pencil" />
      <B l="읽기 전용" v="outline" t="informative" i="eye" />
    </div>
  </Preview>
);

export const badgeFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  variant: Variant,
  size: Size,
  'role-guide': RoleGuide,
  'press-guide': PressGuide,
  'weak-guide': WeakGuide,
  'surface-guide': SurfaceGuide,
  'count-guide': CountGuide,
  'tone-guide': ToneGuide,
  'writing-guide': WritingGuide,
  'ex-row': ExRow,
  'ex-detail': ExDetail,
  'ex-outline': ExOutline,
};
