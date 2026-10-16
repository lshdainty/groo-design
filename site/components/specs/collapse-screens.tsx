// 펼치고 접기 · 나누기 묶음 그림이 같이 쓰는 화면 조각 — Desk 카드 상세(카드 요약 · 혜택 · 유의사항 카드), 카드 혜택 상세 시트,
// 거래 상세의 분할 내역, HR 업무 보고의 상세 검색 조건. 아코디언 · 접기는 YAML 을 푼 값(accordionLook · collapsibleLook — collapse-view)으로,
// 카드 면은 card.yaml(data-card-view), 시트 · 대화상자는 bottom-sheet · dialog.yaml(overlay-view)로 그린다. 화면 틀의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { tokenValue } from '@/lib/component-spec';
import { accordionLook, collapsibleLook, type AccLook, type ColLook, type TriggerState } from './collapse-look';
import { BENEFITS, CARD, CAUTIONS, FILTER_FIELDS, SPLITS, SPLIT_TOTAL, type Benefit } from './collapse-data';
import { AccHeaderView, AccordionView, CollapsibleView, ExpandAllView, WarningBoxView } from './collapse-view';
import { QuickFixes, ShortfallMessage } from './collapse-play';
import { allExpanded, BENEFIT_ICON, type AccItem } from './collapse-shared';
import { cardLook } from './data-look';
import { CardSurface, StatView } from './data-card-view';
import { overlayLook } from './overlay-look';
import { DimView, SheetSurface, DialogSurface } from './overlay-view';
import { PHONE_SAFE, Phone, rc, type Mode } from './kit';
import { won } from './collapse-shared';

type Brand = 'desk' | 'hr';
export const AL = (brand: Brand = 'desk') => accordionLook(brand);
export const COL = (brand: Brand = 'desk') => collapsibleLook(brand);
export const CDL = () => cardLook();
export const gutter = () => parseFloat(String(tokenValue('$spacing-global-gutter')));

// ── 항목 ──────────────────────────────────────────────────
export const has = (it: { detail?: ReactNode | null }) => it.detail !== null && it.detail !== undefined && it.detail !== '';
export function benefitItems({ only, desc = true, icons = false, states, disabled }: { only?: string[]; desc?: boolean; icons?: boolean; states?: Record<string, TriggerState>; disabled?: string[] } = {}): AccItem[] {
  const pick = only ? only.map((id) => BENEFITS.find((b) => b.id === id)).filter((b): b is Benefit => !!b) : BENEFITS;
  return pick.map((b) => ({ id: b.id, title: b.title, description: desc ? b.summary : undefined, detail: b.detail, icon: icons ? BENEFIT_ICON[b.id] : undefined, state: states?.[b.id], disabled: disabled?.includes(b.id) }));
}
export const cautionItems = (): AccItem[] => CAUTIONS.map((c) => ({ id: c.id, title: c.title, detail: c.detail }));
export const expandableOf = (items: AccItem[]) => items.filter(has).map((i) => i.id);

// ── 카드 ──────────────────────────────────────────────────
// 카드 안 inline 아코디언(card body="accordion") — 머리(제목 · 건수 + 모두 펼치기) 아래 트리거가 카드 가장자리까지, 카드 아래 8
export function AccCard({ mode = 'auto', title, items, open = [], expandAll = true, look = AL(), style, headerMark, live = false }: { mode?: Mode; title: string; items: AccItem[]; open?: string[]; expandAll?: boolean; look?: AccLook; style?: CSSProperties; headerMark?: CSSProperties; live?: boolean }) {
  const c = CDL();
  const ah = c.accordion.header;
  return (
    <CardSurface look={c} mode={mode} body="accordion" style={style}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: c.header.gap, paddingTop: ah.top, paddingRight: ah.x, paddingBottom: ah.bottom, paddingLeft: ah.x, ...headerMark }}>
        <span style={{ minWidth: 0, fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: rc('fg-neutral', mode) }}>{title}</span>
        {expandAll && <ExpandAllView look={look} mode={mode} allOpen={allExpanded(open, expandableOf(items))} />}
      </div>
      <AccordionView look={look} mode={mode} items={items} open={open} live={live} />
    </CardSurface>
  );
}

// 카드 요약 — 발급사 · 이름(줄을 바꾼다) · 연회비 · 전월 실적
export function CardSummary({ mode = 'auto' }: { mode?: Mode }) {
  const c = CDL();
  return (
    <CardSurface look={c} mode={mode}>
      <span style={{ fontFamily: c.stat.label.fontFamily, fontSize: c.stat.label.fontSize, lineHeight: c.stat.label.lineHeight, fontWeight: c.stat.label.fontWeight, color: rc('fg-neutral-subtle', mode) }}>{CARD.issuer}</span>
      <span style={{ marginTop: 4, fontFamily: c.title.fontFamily, fontSize: 20, lineHeight: '27px', fontWeight: 700, color: rc('fg-neutral', mode) }}>{CARD.name}</span>
      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <StatView look={c} mode={mode} label="연회비" value={CARD.fee} size="small" />
        <StatView look={c} mode={mode} label="전월 실적" value={CARD.performance} size="small" />
      </div>
    </CardSurface>
  );
}

// 카드 상세 화면의 몸 — 카드 요약 · 혜택 · 유의사항(카드 사이 8 · 화면 가장자리 24)
export function CardDetailBody({ mode = 'auto', benefitsOpen = [], cautionsOpen = [], bottom = 0 }: { mode?: Mode; benefitsOpen?: string[]; cautionsOpen?: string[]; bottom?: number }) {
  const c = CDL();
  const g = gutter();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: c.surface.gap, paddingTop: c.surface.gap, paddingLeft: g, paddingRight: g, paddingBottom: bottom }}>
      <CardSummary mode={mode} />
      <AccCard mode={mode} title={`혜택 · ${BENEFITS.length}건`} items={benefitItems()} open={benefitsOpen} />
      <AccCard mode={mode} title={`유의사항 · ${CAUTIONS.length}건`} items={cautionItems()} open={cautionsOpen} />
    </div>
  );
}
export function CardDetailPhone({ mode = 'auto', scale = 0.5, h = 640, benefitsOpen = [], cautionsOpen = [], screenW = 360 }: { mode?: Mode; scale?: number; h?: number; benefitsOpen?: string[]; cautionsOpen?: string[]; screenW?: number }) {
  return (
    <Phone title="카드 상세" mode={mode} scale={scale} h={h} screenW={screenW}>
      <CardDetailBody mode={mode} benefitsOpen={benefitsOpen} cautionsOpen={cautionsOpen} />
    </Phone>
  );
}

// ── 혜택 상세 시트(separated) ─────────────────────────────
// 시트 본문 — 목록 머리(혜택 상세 · 12건 + 모두 펼치기) + separated 아코디언
export function BenefitList({ mode = 'auto', open = [], items = benefitItems(), look = AL(), expandAllState, headerStyle }: { mode?: Mode; open?: string[]; items?: AccItem[]; look?: AccLook; expandAllState?: 'hovered' | 'pressed' | 'focused'; headerStyle?: CSSProperties }) {
  return (
    <>
      <AccHeaderView look={look} mode={mode} title={`혜택 상세 · ${BENEFITS.length}건`} style={headerStyle}>
        <ExpandAllView look={look} mode={mode} allOpen={allExpanded(open, expandableOf(items))} state={expandAllState} />
      </AccHeaderView>
      <AccordionView look={look} mode={mode} variant="separated" items={items} open={open} />
    </>
  );
}
export function BenefitSheet({ mode = 'auto', open = [], items, offset, title = '카드 상세' }: { mode?: Mode; open?: string[]; items?: AccItem[]; offset?: number; title?: string }) {
  const s = overlayLook('desk').sheet;
  return (
    <DimView dim={s.dim} mode={mode} place="end">
      <SheetSurface look={s} mode={mode} title={title} safe={PHONE_SAFE} maxHeight={`${s.maxHeight * 100}%`} fog offset={offset}>
        <BenefitList mode={mode} open={open} items={items} />
      </SheetSurface>
    </DimView>
  );
}
export function BenefitSheetPhone({ mode = 'auto', scale = 0.5, h = 640, open = [], items, offset, screenW = 360 }: { mode?: Mode; scale?: number; h?: number; open?: string[]; items?: AccItem[]; offset?: number; screenW?: number }) {
  return (
    <Phone title="카드 상세" mode={mode} scale={scale} h={h} screenW={screenW} overlay={<BenefitSheet mode={mode} open={open} items={items} offset={offset} />}>
      <CardDetailBody mode={mode} />
    </Phone>
  );
}
// 데스크톱 대화상자(medium) — 같은 목록
export function BenefitDialog({ mode = 'auto', open = [], items }: { mode?: Mode; open?: string[]; items?: AccItem[] }) {
  const d = overlayLook('desk').dialog;
  return (
    <DialogSurface look={d} mode={mode} title="카드 상세" close width={d.sizes.medium} scroll={{ scrolled: false }}>
      <BenefitList mode={mode} open={open} items={items} />
    </DialogSurface>
  );
}

// ── 거래 상세의 분할 내역 · HR 상세 검색 조건 ─────────────────
// 분할 줄 — 위아래 12, 카테고리 점 · 제목(줄을 바꾼다) · 금액(원까지)
export function SplitRows({ mode = 'auto', n = SPLITS.length }: { mode?: Mode; n?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {SPLITS.slice(0, n).map((s) => (
        <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingTop: 12, paddingBottom: 12 }}>
          <span aria-hidden style={{ width: 8, height: 8, marginTop: 7, borderRadius: 9999, flexShrink: 0, background: rc(`chart-${s.hue}`, mode) }} />
          <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column' }}>
            <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 500, color: rc('fg-neutral', mode) }}>{s.title}</span>
            <span style={{ fontSize: 13, lineHeight: '18px', color: rc('fg-neutral-subtle', mode) }}>{s.category}</span>
          </span>
          <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 700, color: rc('fg-neutral', mode), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{won(-s.amount)}</span>
        </div>
      ))}
    </div>
  );
}
export const SPLIT_TITLE = `내역 분할 ${SPLITS.length}개`;
export const SPLIT_DESC = `합계 ${won(-SPLIT_TOTAL)}`;

// HR 상세 검색 조건 — 칸 넷(라벨 · 값)
export function FilterFields({ mode = 'auto', brand = 'hr', cols = 4 }: { mode?: Mode; brand?: Brand; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 16 }}>
      {FILTER_FIELDS.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 14, lineHeight: '19px', fontWeight: 500, color: rc('fg-neutral', mode, brand) }}>{k}</span>
          <span style={{ display: 'flex', alignItems: 'center', height: 40, paddingLeft: 12, paddingRight: 12, borderRadius: 8, border: `1px solid ${rc('stroke-neutral-weak', mode, brand)}`, fontSize: 14, color: rc('fg-neutral', mode, brand), background: rc('bg-layer-default', mode, brand), whiteSpace: 'nowrap', overflow: 'hidden' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// 판 — 놓인 면의 바탕(라이트 · 다크)
export function Surface({ mode = 'auto', bg = 'bg-layer-default', children, style, brand = 'desk' }: { mode?: Mode; bg?: string; children: ReactNode; style?: CSSProperties; brand?: Brand }) {
  return <div style={{ background: rc(bg, mode, brand), borderRadius: 12, ...style }}>{children}</div>;
}
export type { ColLook };

// ── Collapsible 화면 ──────────────────────────────────────
// 거래 상세(Desk 폰) — 금액 · 가맹점 · 날짜 아래 분할 내역(surface default · layout rows)
export function TxDetailBody({ mode = 'auto', open = true, look = COL() }: { mode?: Mode; open?: boolean; look?: ColLook }) {
  const g = gutter();
  const kv = (k: string, v: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingTop: 8, paddingBottom: 8, fontSize: 14, lineHeight: '19px' }}>
      <span style={{ color: rc('fg-neutral-subtle', mode), flexShrink: 0 }}>{k}</span>
      <span style={{ color: rc('fg-neutral', mode), textAlign: 'right' }}>{v}</span>
    </div>
  );
  return (
    <div style={{ background: rc('bg-layer-default', mode) }}>
      <div style={{ paddingTop: 8, paddingLeft: g, paddingRight: g, paddingBottom: 12 }}>
        <div style={{ fontSize: 13, lineHeight: '18px', color: rc('fg-neutral-subtle', mode) }}>주거 · 계좌이체</div>
        <div style={{ marginTop: 4, fontSize: 26, lineHeight: '35px', fontWeight: 700, color: rc('fg-neutral', mode), fontVariantNumeric: 'tabular-nums' }}>{won(-SPLIT_TOTAL)}</div>
        <div style={{ marginTop: 4, fontSize: 15, lineHeight: '21px', color: rc('fg-neutral', mode) }}>(주)한빛공인중개사사무소 · 한빛이사 · 깨끗한청소</div>
        <div style={{ marginTop: 12 }}>
          {kv('날짜', '10월 8일 (목) 오전 10:00')}
          {kv('결제 수단', '급여통장')}
        </div>
      </div>
      <div style={{ height: 1, marginLeft: g, marginRight: g, background: rc('stroke-neutral-subtle', mode) }} />
      <CollapsibleView look={look} mode={mode} layout="rows" title={SPLIT_TITLE} description={SPLIT_DESC} open={open}>
        <SplitRows mode={mode} />
      </CollapsibleView>
    </div>
  );
}
export function TxDetailPhone({ mode = 'auto', scale = 0.5, h = 640, open = true }: { mode?: Mode; scale?: number; h?: number; open?: boolean }) {
  return (
    <Phone title="거래 상세" mode={mode} scale={scale} h={h} screenW={360} bg="bg-layer-default">
      <TxDetailBody mode={mode} open={open} />
    </Phone>
  );
}

// 분할(Desk 폰 시트) — 합계가 모자랄 때 경고 상자 + 아래 줄의 빠르게 맞추기(surface warning)
export function SplitSheet({ mode = 'auto', open = true, look = COL() }: { mode?: Mode; open?: boolean; look?: ColLook }) {
  const s = overlayLook('desk').sheet;
  return (
    <DimView dim={s.dim} mode={mode} place="end">
      <SheetSurface look={s} mode={mode} title="내역 나누기" safe={PHONE_SAFE} maxHeight={`${s.maxHeight * 100}%`}>
        <WarningBoxView look={look} mode={mode} message={<ShortfallMessage mode={mode} look={look} />}>
          <CollapsibleView look={look} mode={mode} surface="warning" title="빠르게 맞추기" open={open}>
            <QuickFixes bg={rc('bg-layer-default', mode)} fg={rc('fg-neutral', mode)} />
          </CollapsibleView>
        </WarningBoxView>
        <div style={{ marginTop: 8 }}>
          <SplitRows mode={mode} n={3} />
        </div>
      </SheetSurface>
    </DimView>
  );
}
export function SplitSheetPhone({ mode = 'auto', scale = 0.5, h = 640, open = true }: { mode?: Mode; scale?: number; h?: number; open?: boolean }) {
  return (
    <Phone title="거래 상세" mode={mode} scale={scale} h={h} screenW={360} bg="bg-layer-default" overlay={<SplitSheet mode={mode} open={open} />}>
      <TxDetailBody mode={mode} open={false} />
    </Phone>
  );
}

// HR 업무 보고(데스크톱) — 상세 검색 조건 카드(surface card) + 보고 목록
export function HrReportMain({ mode = 'auto', open = true, look = COL('hr'), cols = 4 }: { mode?: Mode; open?: boolean; look?: ColLook; cols?: number }) {
  const rows: [string, string, string][] = [
    ['10월 2주차 클라우드 인프라 점검 보고', '김민수', '10월 9일'],
    ['데이터 플랫폼 배치 지연 원인 분석', '이서연', '10월 8일'],
    ['프로젝트 3팀 주간 진행 보고', '박지훈', '10월 7일'],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24, paddingLeft: 32, paddingRight: 32 }}>
      <div style={{ fontSize: 24, lineHeight: '32px', fontWeight: 700, color: rc('fg-neutral', mode, 'hr') }}>업무 보고</div>
      <CollapsibleView look={look} mode={mode} surface="card" title="상세 검색 조건" description="2개 필터 적용 중" open={open}>
        <FilterFields mode={mode} cols={cols} />
      </CollapsibleView>
      <div style={{ background: rc('bg-layer-default', mode, 'hr'), border: `1px solid ${rc('stroke-neutral-weak', mode, 'hr')}`, borderRadius: 16, paddingTop: 8, paddingBottom: 8 }}>
        {rows.map(([t, who, when]) => (
          <div key={t} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24, fontSize: 15, lineHeight: '21px', color: rc('fg-neutral', mode, 'hr') }}>
            <span>{t}</span>
            <span style={{ color: rc('fg-neutral-subtle', mode, 'hr'), whiteSpace: 'nowrap' }}>
              {who} · {when}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 범례 — nav-screens 의 Legend 와 같은 모양이지만 줄이 넘치면 그 안에서 줄을 바꾼다(390 폭에서 잘리지 않게)
export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex max-w-[600px] flex-wrap justify-center gap-x-5 gap-y-1.5 text-center text-[12px] leading-4 pk-muted">
      {items.map(([n, t], i) => (
        <span key={`${n}${i}`} className="max-w-full">
          {n && <b className="pk-text">{n}</b>} {t}
        </span>
      ))}
    </div>
  );
}
