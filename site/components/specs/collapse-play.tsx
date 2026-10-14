'use client';
// Accordion · Collapsible 플레이그라운드와 코드 미리보기 — 고르면 스펙대로 그린 아코디언 · 접기(collapse-view)와 그 코드가 바뀐다.
// 트리거를 눌러 펼치고, 초점을 두고 ↓ ↑ · Home · End · Enter · Space 를 누를 수 있다. 아래 글이 화면 읽기(이름 · 펼침)를 따라간다.
// 코드는 accordion.md · collapsible.md 의 "코드" 절과 같은 API 로 쓴다. 내용은 지어낸 것이다(collapse-data).
import { useMemo, useState, type ReactNode } from 'react';
import { BENEFITS, QUICK_FIXES, SHORTFALL, SPLITS, SPLIT_TOTAL, FILTER_FIELDS, type Benefit } from './collapse-data';
import { icv, won, type AccLook, type ColLook, type ColSurface, type ViewMode } from './collapse-shared';
import { AccHeaderView, AccordionView, CollapsibleView, ExpandAllView, WarningBoxView } from './collapse-view';
import { allExpanded, toggleAll, triggerReadout, BENEFIT_ICON, type AccItem } from './collapse-shared';
import { MeasureH } from './collapse-measure';
import type { CardLook } from './data-shared';
import { CardSurface } from './data-card-view';
import { MODES, BRANDS, PlayFrame, Seg } from './select-playground';
import { Readout } from './toggle-play';

type Brand = 'desk' | 'hr';
const ICON_JSX: Record<string, string> = { pay: 'CreditCard', coffee: 'Coffee', transit: 'Bus', telecom: 'Smartphone', store: 'Store', movie: 'Clapperboard', fuel: 'Fuel', abroad: 'Globe', shop: 'ShoppingBag', clinic: 'Stethoscope', sub: 'Tv', lounge: 'Armchair' };
const has = (it: { detail?: ReactNode | null }) => it.detail !== null && it.detail !== undefined && it.detail !== '';
const q = (s: string) => JSON.stringify(s);

// 카드 안 아코디언의 머리 — card.yaml 의 accordion 머리 여백 · 제목 글자, 오른쪽 모두 펼치기
function CardAccHeader({ card, mode, title, children, live }: { card: CardLook; mode: ViewMode; title: string; children?: ReactNode; live?: boolean }) {
  const ah = card.accordion.header;
  const T = (live ? 'h2' : 'span') as 'h2';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: card.header.gap, paddingTop: ah.top, paddingRight: ah.x, paddingBottom: ah.bottom, paddingLeft: ah.x }}>
      <T style={{ margin: 0, minWidth: 0, fontFamily: card.title.fontFamily, fontSize: card.title.fontSize, lineHeight: card.title.lineHeight, fontWeight: card.title.fontWeight, color: icv(card.title.fg, mode) }}>{title}</T>
      {children}
    </div>
  );
}

// 화면 읽기 — 초점이 떠나면 글은 바뀌어도 높이는 마지막 초점의 글만큼 둔다. 줄면 가운데 맞춘 무대가 흔들려
// 누르던 단추가 누르는 사이에 밀리고 클릭이 사라진다(모션 · 막힘 단추를 눌러도 안 바뀌던 까닭)
const PLACEHOLDER = '트리거에 초점을 두면 읽는 글이 나온다';
function SteadyReadout({ mode, text, reserve }: { mode: ViewMode; text: string; reserve: string }) {
  return (
    <div className="grid">
      <div style={{ gridArea: '1 / 1' }}>
        <Readout mode={mode} text={text} />
      </div>
      <div aria-hidden style={{ gridArea: '1 / 1', visibility: 'hidden' }}>
        <Readout mode={mode} text={reserve} />
      </div>
    </div>
  );
}

// ── Accordion 플레이그라운드 ────────────────────────────────
const POOL = ['pay', 'coffee', 'transit', 'telecom', 'store', 'movie'];
export function AccordionPlayground({ looks, card }: { looks: Record<Brand, AccLook>; card: CardLook }) {
  const [variant, setVariant] = useState<'inline' | 'separated'>('separated');
  const [desc, setDesc] = useState<'on' | 'off'>('on');
  const [icon, setIcon] = useState<'off' | 'on'>('off');
  const [plain, setPlain] = useState<'on' | 'off'>('on');
  const [dis, setDis] = useState<'none' | 'one'>('none');
  const [motion, setMotion] = useState<'system' | 'reduce'>('system');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [open, setOpen] = useState<string[]>([]);
  const [focus, setFocus] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);
  const look = looks[brand];
  const benefits = POOL.map((id) => BENEFITS.find((b) => b.id === id) as Benefit).filter((b) => plain === 'on' || b.detail);
  const items: AccItem[] = benefits.map((b) => ({ id: b.id, title: b.title, description: desc === 'on' ? b.summary : undefined, detail: b.detail, icon: icon === 'on' ? BENEFIT_ICON[b.id] : undefined, disabled: dis === 'one' && b.id === 'telecom' }));
  const expandable = items.filter((i) => has(i) && !i.disabled).map((i) => i.id);
  const reduce = motion === 'reduce' ? true : undefined;
  const sep = variant === 'separated';
  const title = sep ? `혜택 상세 · ${BENEFITS.length}건` : `혜택 · ${BENEFITS.length}건`;
  const expandAll = <ExpandAllView look={look} mode={mode} live allOpen={allExpanded(open, expandable)} controls="pg-benefits" onClick={() => setOpen(toggleAll(open, expandable))} />;
  const acc = <AccordionView look={look} mode={mode} id="pg-benefits" variant={variant} items={items} open={open} onOpenChange={setOpen} live reduce={reduce} onFocusItem={(id) => (setFocus(id), id && setLast(id))} />;
  const f = items.find((i) => i.id === focus);
  const l = items.find((i) => i.id === last);
  const read = (i: AccItem) => triggerReadout(i.title, i.description, look.heading, open.includes(i.id), i.disabled);
  const code = useMemo(() => {
    const icons = icon === 'on' ? [...new Set(benefits.filter((b) => b.detail || plain === 'on').map((b) => ICON_JSX[b.id]))].sort() : [];
    const parts = sep
      ? ['Accordion', 'AccordionContent', 'AccordionExpandAll', 'AccordionHeader', 'AccordionItem', ...(plain === 'on' ? ['AccordionPlainItem'] : []), 'AccordionTrigger']
      : ['Accordion', 'AccordionContent', 'AccordionExpandAll', 'AccordionItem', ...(plain === 'on' ? ['AccordionPlainItem'] : []), 'AccordionTrigger'];
    const pad = sep ? '  ' : '    ';
    const row = (b: Benefit) => {
      const attrs = [`title=${q(b.title)}`, ...(desc === 'on' ? [`description=${q(b.summary)}`] : []), ...(icon === 'on' ? [`prefixIcon={<${ICON_JSX[b.id]} />}`] : [])].join(' ');
      if (!b.detail) return [`${pad}{/* 상세가 없으면 그냥 줄 — 막힌 트리거로 그리지 않는다 */}`, `${pad}<AccordionPlainItem ${attrs} />`];
      const d = dis === 'one' && b.id === 'telecom' ? ' disabled' : '';
      return [`${pad}<AccordionItem value=${q(b.id)}${d}>`, `${pad}  <AccordionTrigger ${attrs} />`, `${pad}  <AccordionContent>{details.${b.id}}</AccordionContent>`, `${pad}</AccordionItem>`];
    };
    const head = [
      'import { useState } from "react"',
      ...(icons.length ? [`import { ${icons.join(', ')} } from "lucide-react"`] : []),
      `import {\n  ${parts.join(',\n  ')},\n} from "@/components/ui/accordion"`,
      ...(sep ? [] : ['import { Card, CardHeader, CardTitle } from "@/components/ui/card"']),
      '',
      'const [open, setOpen] = useState<string[]>([]) // 처음에는 모두 접힘',
      `const expandable = [${expandable.map(q).join(', ')}] // 상세가 있는 항목`,
      ...(motion === 'reduce' ? [`// 모션 줄이기는 기기 설정을 따른다 — 높이 대신 ${look.motion.reduced.duration} 서서히`] : []),
      '',
    ];
    const body = sep
      ? [
          `<AccordionHeader title={${q(title)}}>`,
          '  <AccordionExpandAll controls="benefit-detail" values={open} expandable={expandable} onValuesChange={setOpen} />',
          '</AccordionHeader>',
          '<Accordion id="benefit-detail" variant="separated" values={open} onValuesChange={setOpen}>',
          ...benefits.flatMap(row),
          '</Accordion>',
        ]
      : [
          '<Card body="accordion">',
          '  <CardHeader>',
          `    <CardTitle>${title}</CardTitle>`,
          '    <AccordionExpandAll controls="card-benefits" values={open} expandable={expandable} onValuesChange={setOpen} />',
          '  </CardHeader>',
          '  <Accordion id="card-benefits" values={open} onValuesChange={setOpen}>',
          ...benefits.flatMap(row).map((l) => `  ${l}`),
          '  </Accordion>',
          '</Card>',
        ];
    return [...head, ...body].join('\n');
  }, [benefits, sep, desc, icon, plain, dis, motion, expandable, title, look]);
  const stage = (
    <div className="flex flex-col items-stretch gap-3">
      {sep ? (
        <div>
          <AccHeaderView look={look} mode={mode} title={title} live>
            {expandAll}
          </AccHeaderView>
          {acc}
        </div>
      ) : (
        <CardSurface look={card} mode={mode} body="accordion">
          <CardAccHeader card={card} mode={mode} title={title} live>
            {expandAll}
          </CardAccHeader>
          {acc}
        </CardSurface>
      )}
      <SteadyReadout mode={mode} text={f ? read(f) : PLACEHOLDER} reserve={l ? read(l) : PLACEHOLDER} />
    </div>
  );
  return (
    <PlayFrame
      surface={sep ? icv(look.surfaces.floating, mode) : icv(look.surfaces.basement, mode)}
      code={code}
      stage={stage}
      controls={
        <>
          <Seg label="변형 variant" value={variant} options={[['inline', 'inline — 카드 안 목록'], ['separated', 'separated — 시트 · 대화상자']]} onChange={setVariant} />
          <Seg label="설명 description" value={desc} options={[['on', `있음 — ${look.minHDesc}`], ['off', `없음 — ${look.minH}`]]} onChange={setDesc} />
          <Seg label="앞 아이콘 prefixIcon" value={icon} options={[['off', '없음'], ['on', `있음 — ${look.prefixIcon.size}`]]} onChange={setIcon} />
          <Seg label="상세 없는 항목" value={plain} options={[['on', '대중교통 · 편의점 — 그냥 줄'], ['off', '빼기']]} onChange={(v) => (setPlain(v), setOpen([]))} />
          <Seg label="막힘 disabled" value={dis} options={[['none', '없음'], ['one', '통신 막힘']]} onChange={(v) => (setDis(v), setOpen((o) => o.filter((x) => v === 'none' || x !== 'telecom')))} />
          <Seg label="모션" value={motion} options={[['system', '기기 설정 따라'], ['reduce', `모션 줄이기 — ${look.motion.reduced.duration} 서서히`]]} onChange={setMotion} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
        </>
      }
    />
  );
}

// ── 펼침 모션 — 보통 300ms · 모션 줄이기 150ms 서서히 ─────────────
export function AccMotionDemo({ look }: { look: AccLook }) {
  const [open, setOpen] = useState(false);
  const item: AccItem = { id: 'pay', title: BENEFITS[0].title, description: BENEFITS[0].summary, detail: BENEFITS[0].detail };
  const col = (reduce: boolean, label: string, cap: string) => (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <b className="text-[13px] pk-text">{label}</b>
      <div style={{ width: 342, background: 'var(--p-bg-layer-floating)', borderRadius: 16, paddingTop: 16, paddingBottom: 16, paddingLeft: 0, paddingRight: 48 }}>
        <div style={{ marginLeft: 16 }}>
          <MeasureH prefix="" suffix="px">
            <div style={{ width: 294 }}>
              <AccordionView look={look} variant="separated" items={[item]} open={open ? ['pay'] : []} onOpenChange={(ids) => setOpen(ids.includes('pay'))} live reduce={reduce} />
            </div>
          </MeasureH>
        </div>
      </div>
      <span className="text-center text-[12px] leading-4 pk-muted" style={{ maxWidth: 320 }}>
        {cap}
      </span>
    </div>
  );
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mb-4 flex justify-center">
          <button type="button" onClick={() => setOpen((o) => !o)} className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] font-medium text-fd-foreground hover:bg-fd-accent">
            {open ? '둘 다 접기' : '둘 다 펼치기'}
          </button>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-6">
          {col(false, `보통 — 높이 ${look.motion.height.duration}`, `꺾쇠 ${look.chevron.openRotate}° · 높이 모두 ${look.motion.height.duration} ${look.motion.height.easing} — 7줄 상세가 밀려 내려간다`)}
          {col(true, `모션 줄이기 — ${look.motion.reduced.duration} 서서히`, `높이는 바로 · 내용만 ${look.motion.reduced.duration} 서서히 나타나고 사라진다 · 꺾쇠는 바로 뒤집힌다 · 누름 축소 없음`)}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">펼침 {look.motion.height.duration} — 7줄 상세가 밀려 내려간다 · 모션 줄이기 {look.motion.reduced.duration} 서서히(트리거를 눌러도 된다 — 오른쪽 숫자는 항목의 높이)</figcaption>
    </figure>
  );
}

// ── 코드 미리보기 — accordion.md 의 코드 그대로 ─────────────
const ALL_ITEMS = (): AccItem[] => BENEFITS.map((b) => ({ id: b.id, title: b.title, description: b.summary, detail: b.detail }));
export function ExAccSheetDemo({ look }: { look: AccLook }) {
  const [open, setOpen] = useState<string[]>(['coffee']);
  const items = ALL_ITEMS();
  const expandable = items.filter(has).map((i) => i.id);
  return (
    <div>
      <AccHeaderView look={look} title={`혜택 상세 · ${BENEFITS.length}건`} live>
        <ExpandAllView look={look} live allOpen={allExpanded(open, expandable)} controls="benefit-detail" onClick={() => setOpen(toggleAll(open, expandable))} />
      </AccHeaderView>
      <AccordionView look={look} id="benefit-detail" variant="separated" items={items} open={open} onOpenChange={setOpen} live />
    </div>
  );
}
export function ExAccCardDemo({ look, card }: { look: AccLook; card: CardLook }) {
  const [open, setOpen] = useState<string[]>([]);
  const items = ALL_ITEMS();
  const expandable = items.filter(has).map((i) => i.id);
  return (
    <CardSurface look={card} body="accordion">
      <CardAccHeader card={card} mode="auto" title={`혜택 · ${BENEFITS.length}건`} live>
        <ExpandAllView look={look} live allOpen={allExpanded(open, expandable)} controls="card-benefits" onClick={() => setOpen(toggleAll(open, expandable))} />
      </CardAccHeader>
      <AccordionView look={look} id="card-benefits" items={items} open={open} onOpenChange={setOpen} live />
    </CardSurface>
  );
}

// ── Collapsible 내용 ──────────────────────────────────────
// 모드를 정한 그림은 글자색(fg · sub)을 넘긴다
export function SplitRowsLive({ n = SPLITS.length, fg = 'var(--p-fg-neutral)', sub = 'var(--p-fg-neutral-subtle)' }: { n?: number; fg?: string; sub?: string }) {
  const c = (name: string) => (name === 'fg-neutral' ? fg : sub);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {SPLITS.slice(0, n).map((s) => (
        <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingTop: 12, paddingBottom: 12 }}>
          <span aria-hidden style={{ width: 8, height: 8, marginTop: 7, borderRadius: 9999, flexShrink: 0, background: `var(--p-chart-${s.hue})` }} />
          <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column' }}>
            <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 500, color: c('fg-neutral') }}>{s.title}</span>
            <span style={{ fontSize: 13, lineHeight: '18px', color: c('fg-neutral-subtle') }}>{s.category}</span>
          </span>
          <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 600, color: c('fg-neutral'), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{won(-s.amount)}</span>
        </div>
      ))}
    </div>
  );
}
const tone = (mode: ViewMode, name: string, look: ColLook) => (mode === 'auto' ? `var(--p-${name})` : name === 'fg-neutral' ? icv(look.title.fg, mode) : icv(look.description.fg, mode));
export function ShortfallMessage({ mode = 'auto', look }: { mode?: ViewMode; look: ColLook }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 600, color: tone(mode, 'fg-neutral', look) }}>분할 합계가 {won(SHORTFALL)} 모자라요.</span>
      <span style={{ fontSize: 13, lineHeight: '18px', color: tone(mode, 'fg-neutral-subtle', look), fontVariantNumeric: 'tabular-nums' }}>
        거래 {won(SPLIT_TOTAL)} · 분할 합계 {won(SPLIT_TOTAL - SHORTFALL)}
      </span>
    </div>
  );
}
// 빠르게 맞추기의 고를 것 — 모드를 정한 그림은 바탕 · 글자색(bg · fg)을 넘긴다
export function QuickFixes({ bg = 'var(--p-bg-layer-default)', fg = 'var(--p-fg-neutral)' }: { bg?: string; fg?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {QUICK_FIXES.map((t) => (
        <span key={t} style={{ display: 'flex', alignItems: 'center', minHeight: 40, paddingLeft: 12, paddingRight: 12, borderRadius: 10, background: bg, fontSize: 14, lineHeight: '19px', fontWeight: 500, color: fg }}>
          {t}
        </span>
      ))}
    </div>
  );
}
export function FilterFieldsLive({ cols = 4 }: { cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 16 }}>
      {FILTER_FIELDS.map(([k, v]) => (
        <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 14, lineHeight: '19px', fontWeight: 500, color: 'var(--p-fg-neutral)' }}>{k}</span>
          <input readOnly value={v} style={{ height: 40, paddingLeft: 12, paddingRight: 12, borderRadius: 8, border: '1px solid var(--p-stroke-neutral-weak)', fontSize: 14, color: 'var(--p-fg-neutral)', background: 'var(--p-bg-layer-default)', minWidth: 0 }} />
        </label>
      ))}
    </div>
  );
}

// ── Collapsible 플레이그라운드 ─────────────────────────────
const PLACES: Record<ColSurface, { title: string; desc: string; jsx: string }> = {
  default: { title: `내역 분할 ${SPLITS.length}개`, desc: `합계 ${won(-SPLIT_TOTAL)}`, jsx: '<CollapsibleContent layout="rows">{splits.map(renderSplitRow)}</CollapsibleContent>' },
  card: { title: '상세 검색 조건', desc: '2개 필터 적용 중', jsx: '<CollapsibleContent>{filterFields}</CollapsibleContent>' },
  warning: { title: '빠르게 맞추기', desc: `모자란 금액 ${won(SHORTFALL)}`, jsx: '<CollapsibleContent>{quickFixes}</CollapsibleContent>' },
};
export function CollapsiblePlayground({ looks }: { looks: Record<Brand, ColLook> }) {
  const [surface, setSurface] = useState<ColSurface>('default');
  const [desc, setDesc] = useState<'on' | 'off'>('on');
  const [dis, setDis] = useState<'no' | 'yes'>('no');
  const [motion, setMotion] = useState<'system' | 'reduce'>('system');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [open, setOpen] = useState(false);
  const look = looks[brand];
  const p = PLACES[surface];
  const description = desc === 'on' ? p.desc : undefined;
  const reduce = motion === 'reduce' ? true : undefined;
  const view = (
    <CollapsibleView look={look} mode={mode} surface={surface} layout={surface === 'default' ? 'rows' : 'text'} title={p.title} description={description} open={open} onOpenChange={setOpen} live disabled={dis === 'yes'} reduce={reduce}>
      {surface === 'default' ? <SplitRowsLive n={3} fg={icv(look.title.fg, mode)} sub={icv(look.description.fg, mode)} /> : surface === 'card' ? <FilterFieldsLive cols={1} /> : <QuickFixes bg={icv(look.surfaces.default, mode)} fg={icv(look.title.fg, mode)} />}
    </CollapsibleView>
  );
  const code = useMemo(() => {
    const attrs = [...(surface !== 'default' ? [`surface=${q(surface)}`] : []), 'open={open}', 'onOpenChange={setOpen}', ...(dis === 'yes' ? ['disabled'] : [])].join(' ');
    const trig = `<CollapsibleTrigger title=${q(p.title)}${description ? ` description=${q(description)}` : ''} />`;
    const inner = [`<Collapsible ${attrs}>`, `  ${trig}`, `  ${p.jsx}`, '</Collapsible>'];
    const box =
      surface === 'warning'
        ? ['{/* 경고 상자(box)는 화면이 그린다 — 경고 글 아래 맨 끝 줄이 Collapsible */}', '<div className="overflow-hidden rounded-r3 border border-stroke-warning-weak bg-bg-warning-weak">', '  <div className="px-x4 pb-x3 pt-x3_5">{shortfallMessage}</div>', ...inner.map((l) => `  ${l}`), '</div>']
        : inner;
    return ['import { useState } from "react"', 'import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"', '', 'const [open, setOpen] = useState(false)', ...(motion === 'reduce' ? [`// 모션 줄이기는 기기 설정을 따른다 — 높이 대신 ${look.motion.reduced.duration} 서서히`] : []), '', ...box].join('\n');
  }, [surface, description, dis, motion, p, look]);
  const stage = (
    <div className="flex flex-col items-stretch gap-3">
      {surface === 'warning' ? (
        <WarningBoxView look={look} mode={mode} message={<ShortfallMessage mode={mode} look={look} />}>
          {view}
        </WarningBoxView>
      ) : (
        view
      )}
      <Readout mode={mode} text={triggerReadout(p.title, description, look.heading, open, dis === 'yes')} />
    </div>
  );
  return (
    <PlayFrame
      surface={icv(surface === 'card' ? look.surfaces.basement : look.surfaces.default, mode)}
      code={code}
      stage={stage}
      controls={
        <>
          <Seg label="놓인 면 surface" value={surface} options={[['default', '흰 면 — 분할 내역'], ['card', '카드 — 상세 검색 조건'], ['warning', '경고 상자 — 빠르게 맞추기']]} onChange={(v) => (setSurface(v), setOpen(false))} />
          <Seg label="설명 description" value={desc} options={[['on', `있음 — ${look.minHDesc}`], ['off', `없음 — ${look.minH}`]]} onChange={setDesc} />
          <Seg label="막힘 disabled" value={dis} options={[['no', '아니오'], ['yes', '예']]} onChange={setDis} />
          <Seg label="모션" value={motion} options={[['system', '기기 설정 따라'], ['reduce', `모션 줄이기 — ${look.motion.reduced.duration} 서서히`]]} onChange={setMotion} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
        </>
      }
    />
  );
}

// ── Collapsible 코드 미리보기 — collapsible.md 의 코드 그대로 ──────
export function ExSplitDemo({ look }: { look: ColLook }) {
  return (
    <CollapsibleView look={look} layout="rows" title={`내역 분할 ${SPLITS.length}개`} description={`합계 ${won(-SPLIT_TOTAL)}`} defaultOpen live>
      <SplitRowsLive />
    </CollapsibleView>
  );
}
export function ExWarningDemo({ look }: { look: ColLook }) {
  return (
    <WarningBoxView look={look} message={<ShortfallMessage look={look} />}>
      <CollapsibleView look={look} surface="warning" title="빠르게 맞추기" live>
        <QuickFixes />
      </CollapsibleView>
    </WarningBoxView>
  );
}
export function ExFilterCardDemo({ look }: { look: ColLook }) {
  const [open, setOpen] = useState(true);
  const applied = 2;
  return (
    <CollapsibleView look={look} surface="card" open={open} onOpenChange={setOpen} title="상세 검색 조건" description={applied > 0 ? `${applied}개 필터 적용 중` : undefined} live>
      <FilterFieldsLive cols={4} />
    </CollapsibleView>
  );
}
