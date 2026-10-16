// Accordion 페이지의 그림 — specs/components/accordion.md 의 `[그림: …](../../site/components/specs/accordion.tsx#<id>)` 자리.
// 트리거 · 펼친 내용 · 선 · 면 · 모두 펼치기는 accordion.yaml 을 푼 값(accordionLook — collapse-view)으로, 카드 면은 card.yaml(data-card-view),
// 시트 · 대화상자는 bottom-sheet · dialog.yaml(overlay-view)로 그린다. 혜택 · 유의사항 · 카드 이름은 지어낸 것이다(collapse-data).
// 치수는 그림에 적지 않는다 — 고정 값은 YAML 에서, 글 길이에 따라 달라지는 높이는 브라우저에서 잰다(collapse-measure).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { AccMotionDemo, AccordionPlayground, ExAccCardDemo, ExAccSheetDemo } from './collapse-play';
import { MeasureH, ScaledAuto } from './collapse-measure';
import { AL, AccCard, BenefitList, BenefitSheetPhone, CDL, CardDetailBody, CardDetailPhone, SplitRows, SPLIT_DESC, SPLIT_TITLE, benefitItems, cautionItems, COL, Legend } from './collapse-screens';
import { AccHeaderView, AccordionView, CollapsibleView, ExpandAllView } from './collapse-view';
import type { AccItem } from './collapse-shared';
import { BENEFITS, CAUTIONS, LONG_DETAIL } from './collapse-data';
import { CATEGORIES } from './collapse-data';
import { listNestLook } from './collapse-look';
import { listLook } from './list-look';
import { NestedListView } from './list-nest-view';
import { overlayLook } from './overlay-look';
import { DialogSurface, DimView, SheetSurface } from './overlay-view';
import { PHONE_SAFE, Phone, Verdict, rc, type Mode } from './kit';
import { Band, Cap, CodePreview, Shot, pinAt } from './nav-screens';
import type { TriggerState } from './collapse-shared';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col gap-4">{children}</div>;
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;
const dash: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
// 흰 판 · 시트 판(떠 있는 표면)
function Board({ mode = 'auto', bg = 'bg-layer-default', w, children, pad = 0, style }: { mode?: Mode; bg?: string; w?: number; children: ReactNode; pad?: number; style?: CSSProperties }) {
  return <div style={{ width: w, boxSizing: 'border-box', background: rc(bg, mode), borderRadius: 16, paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad, ...style }}>{children}</div>;
}
// 시트 본문 폭(폰 390 − 좌우 24) · 대화상자 medium 본문 폭(480 − 좌우 24)
const sheetBody = () => 390 - overlayLook('desk').sheet.body.padX * 2;
const dialogBody = () => overlayLook('desk').dialog.sizes.medium - overlayLook('desk').dialog.body.padX * 2;

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <BenefitSheetPhone mode={mode} open={['coffee']} />
          <CardDetailPhone mode={mode} benefitsOpen={['pay']} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <AccordionPlayground looks={{ desk: AL('desk'), hr: AL('hr') }} card={CDL()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = AL();
  const W = dialogBody();
  const body = l.minHDesc - l.padY * 2;
  const titleX = l.padX + l.prefixIcon.size + l.content.gap;
  // 부위 핀 — 트리거(단추) 안 · 펼친 내용 안 · 둘째 트리거 위(선)에 붙인다. 자리는 YAML 값으로 셈한다
  const pinsA = (
    <>
      {pinAt('ⓐ', { left: -10, top: -10 })}
      {pinAt('ⓑ', { left: l.padX + l.prefixIcon.size / 2 - 10, top: l.padY + (body - l.prefixIcon.size) / 2 - 22 })}
      {pinAt('ⓒ', { left: titleX - 6, top: l.padY - 21 })}
      {pinAt('ⓓ', { left: titleX - 24, top: l.padY + parseFloat(l.title.lineHeight) + l.body.gap + 6 })}
      {pinAt('ⓔ', { left: W - l.padX - l.chevron.size / 2 - 10, top: l.padY + (body - l.chevron.size) / 2 - 22 })}
    </>
  );
  const detail = (
    <span style={{ position: 'relative', display: 'block' }}>
      {pinAt('ⓕ', { left: -l.panel.padX + 2, top: 0 })}
      {BENEFITS[1].detail}
    </span>
  );
  const items: AccItem[] = [
    { id: 'coffee', title: '커피', description: BENEFITS[1].summary, detail, icon: 'coffee', marks: { trigger: dash }, decor: pinsA },
    { id: 'telecom', title: '통신', description: BENEFITS[3].summary, detail: BENEFITS[3].detail, icon: 'phone', decor: pinAt('ⓖ', { left: l.divider.marginX - 2, top: -11 }) },
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Wide>
          <div style={{ padding: '16px 24px 8px' }}>
            <Board w={W + 32} pad={16} bg="bg-layer-floating">
              <AccHeaderView look={l} title={`혜택 상세 · ${BENEFITS.length}건`}>
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <ExpandAllView look={l} allOpen={false} showHit />
                  {pinAt('ⓗ', { right: -12, top: -18 })}
                </span>
              </AccHeaderView>
              <AccordionView look={l} items={items} open={['coffee']} />
            </Board>
          </div>
        </Wide>
        <Legend
          items={[
            ['ⓐ', `Trigger — 위아래 ${l.padY} · 좌우 ${l.padX} · ${l.minH}(설명 있으면 ${l.minHDesc}) · 줄 전체가 누르는 자리`],
            ['ⓑ', `Prefix Icon — ${l.prefixIcon.size} · 뒤 ${l.content.gap}`],
            ['ⓒ', `Title — ${parseFloat(l.title.fontSize)} / ${parseFloat(l.title.lineHeight)} · ${l.title.fontWeight}`],
            ['ⓓ', `Description — ${parseFloat(l.description.fontSize)} / ${parseFloat(l.description.lineHeight)} · ${l.description.fontWeight} · 제목 아래 ${l.body.gap}`],
            ['ⓔ', `Chevron — ${l.chevron.size} · 펼치면 ${l.chevron.openRotate}°`],
            ['ⓕ', `Panel — ${l.panel.padTop} / ${l.panel.padX} / ${l.panel.padBottom} · ${parseFloat(l.panelText.fontSize)} / ${parseFloat(l.panelText.lineHeight)}`],
            ['ⓖ', `Divider — ${l.divider.height}px · 좌우 ${l.divider.marginX} 들임`],
            ['ⓗ', `Expand All — 보이는 ${l.expandAll.h} · 누르는 ${l.expandAll.touch}(분홍)`],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Variant ───────────────────────────────────────────────
const VARIANT_ITEMS = () => benefitItems({ only: ['coffee', 'telecom', 'movie', 'fuel'], desc: false });
const Variant: Fig = ({ caption }) => {
  const l = AL();
  const c = CDL();
  const w = 312;
  // 카드 머리 = 위 + 머리 줄(모두 펼치기 높이) + 아래
  const head = c.accordion.header.top + Math.max(l.expandAll.h, parseFloat(c.title.lineHeight)) + c.accordion.header.bottom + c.surface.borderW;
  const div1 = head + l.minH;
  const sHead = l.header.minH + l.header.marginBottom;
  const item = l.minH + l.separated.borderW * 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-8">
        <Shot strong="inline — 카드 안 연속 목록" cap={`선 ${l.divider.height}px · 좌우 ${l.divider.marginX} 들임 · 마지막 항목 아래 선 없음`}>
          <Board bg="bg-layer-basement" pad={16} w={w + 32}>
            <div style={{ position: 'relative' }}>
              <AccCard title={`혜택 · ${BENEFITS.length}건`} items={VARIANT_ITEMS()} />
              <Band style={{ left: 0, width: l.divider.marginX, top: div1 - 6, height: 13 }} label={String(l.divider.marginX)} tag="above" />
              <Band style={{ right: 0, width: l.divider.marginX, top: div1 - 6, height: 13 }} label={String(l.divider.marginX)} tag="above" />
            </div>
          </Board>
        </Shot>
        <Shot strong="separated — 항목마다 Card 면" cap={`테두리 ${l.separated.borderW}px · 모서리 ${l.separated.radius} · 사이 ${l.separated.gap} · 그림자 없음`}>
          <Board bg="bg-layer-floating" pad={24} w={w + 48}>
            <div style={{ position: 'relative' }}>
              <BenefitList items={VARIANT_ITEMS()} />
              <Band style={{ left: '40%', width: 40, top: sHead + item, height: l.separated.gap }} label={String(l.separated.gap)} tag="right" />
              <span aria-hidden className="pointer-events-none absolute text-[10px] font-bold leading-4 text-white" style={{ left: -18, top: sHead - 14, background: MARK_LINE, borderRadius: 4, padding: '0 4px' }}>
                r{l.separated.radius}
              </span>
            </div>
          </Board>
        </Shot>
      </div>
    </Panel>
  );
};

// ── Size ──────────────────────────────────────────────────
const SIZE_ITEMS: AccItem[] = [
  { id: 'a', title: '영화', detail: BENEFITS[5].detail },
  { id: 'b', title: '영화', description: '월 1회 4천 원 할인', detail: BENEFITS[5].detail },
  { id: 'c', title: BENEFITS[0].title, description: BENEFITS[0].summary, detail: BENEFITS[0].detail },
];
function SizeColumn({ w, strong }: { w: number; strong: string }) {
  const l = AL();
  return (
    <Shot strong={strong} cap={`본문 폭 ${w} — 높이는 브라우저에서 잰 값`}>
      <Board bg="bg-layer-floating" pad={16} w={w + 32 + 56}>
        <div style={{ width: w, display: 'flex', flexDirection: 'column', gap: l.separated.gap }}>
          {SIZE_ITEMS.map((it) => (
            // 면(테두리 1 · 모서리)은 바깥에 — 잰 높이는 트리거만
            <div key={it.id} style={{ borderWidth: l.separated.borderW, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak'), borderRadius: l.separated.radius }}>
              <MeasureH>
                <AccordionView look={l} items={[it]} />
              </MeasureH>
            </div>
          ))}
        </div>
      </Board>
    </Shot>
  );
}
const Size: Fig = ({ caption }) => {
  const l = AL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-start justify-center gap-8">
          <SizeColumn w={sheetBody()} strong="폰 시트 390" />
          <SizeColumn w={dialogBody()} strong="데스크톱 대화상자 480" />
        </div>
        <Cap w={620}>
          제목만 {l.minH}(위아래 {l.padY} + 제목 {parseFloat(l.title.lineHeight)}) · 설명이 있으면 {l.minHDesc}(+ {l.body.gap} + 설명 {parseFloat(l.description.lineHeight)}) — 28자 제목은 폰 시트에서 두 줄, 대화상자에서는 설명이 두 줄로 줄을 바꾼 만큼 늘어난다. 폰 · 데스크톱이 같은 크기다(잰 높이는 트리거 — 면의 테두리 {l.separated.borderW} 는 뺐다)
        </Cap>
      </div>
    </Panel>
  );
};

// ── 펼친 내용 ─────────────────────────────────────────────
const PanelFig: Fig = ({ caption }) => {
  const l = AL();
  const t = l.panelText;
  const detail = (
    <span style={{ position: 'relative', display: 'block' }}>
      <Band style={{ left: -l.panel.padX, width: l.panel.padX, top: 0, bottom: 0 }} label={String(l.panel.padX)} />
      <Band style={{ right: -l.panel.padX, width: l.panel.padX, top: 0, bottom: 0 }} label={String(l.panel.padX)} />
      <Band style={{ left: 0, right: 0, bottom: -l.panel.padBottom, height: l.panel.padBottom }} label={String(l.panel.padBottom)} />
      {LONG_DETAIL}
    </span>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wide>
          <Board bg="bg-layer-floating" pad={24} w={sheetBody() + 48}>
            <AccordionView look={l} variant="separated" items={[{ id: 'pay', title: BENEFITS[0].title, description: BENEFITS[0].summary, detail }]} open={['pay']} />
          </Board>
        </Wide>
        <Cap w={620}>
          위 {l.panel.padTop} · 좌우 {l.panel.padX}(앞 아이콘이 있어도 같다) · 아래 {l.panel.padBottom} · 글 {parseFloat(t.fontSize)} / {parseFloat(t.lineHeight)} · {t.fontWeight} — 줄바꿈 문자는 그대로 줄을 바꾸고, 패널 안에서 스크롤하지 않는다(높이 제한 없음)
        </Cap>
      </div>
    </Panel>
  );
};

// ── 상세 없는 항목 ─────────────────────────────────────────
const NoDetail: Fig = ({ caption }) => {
  const l = AL();
  const items = benefitItems({ only: ['coffee', 'transit', 'telecom', 'store', 'movie'] });
  const W = dialogBody();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wide>
          <Board bg="bg-layer-floating" pad={16} w={W + 32 + 40}>
            <div style={{ position: 'relative', width: W }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: l.separated.gap }}>
                {items.map((it) => (
                  // 면(테두리)은 바깥에 — 잰 높이는 트리거 · 그냥 줄만
                  <div key={it.id} style={{ borderWidth: l.separated.borderW, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak'), borderRadius: l.separated.radius }}>
                    <MeasureH>
                      <AccordionView look={l} items={[it]} />
                    </MeasureH>
                  </div>
                ))}
              </div>
              {/* 글 시작 — 트리거와 그냥 줄이 같은 자리 */}
              <span aria-hidden className="pointer-events-none absolute" style={{ left: l.padX + l.separated.borderW, top: -8, bottom: -8, borderLeft: `1px dashed ${MARK_LINE}` }} />
            </div>
          </Board>
        </Wide>
        <Cap w={620}>대중교통 · 편의점은 트리거가 아닌 그냥 줄 — 꺾쇠 · 단추 · 머리말이 없고 Tab 이 건너뛴다. 위아래 {l.padY} · 좌우 {l.padX} · 글 크기가 같아 높이와 글 시작(점선)이 같다</Cap>
      </div>
    </Panel>
  );
};

// ── 모두 펼치기 ───────────────────────────────────────────
const ExpandAll: Fig = ({ caption }) => {
  const l = AL();
  const items = benefitItems({ only: ['coffee', 'transit', 'telecom'], desc: false });
  const a = l.expandAll;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-8">
        {[
          ['하나라도 접혀 있다', [] as string[]],
          ['모두 펼쳐져 있다', ['coffee', 'telecom']],
        ].map(([label, open]) => (
          <Shot key={label as string} strong={label as string} cap={(open as string[]).length ? `"${a.labels.collapse}" — 누르면 모두 접는다` : `"${a.labels.expand}" — 상세가 있는 항목을 모두 펼친다(대중교통은 그냥 줄)`}>
            <Board bg="bg-layer-floating" pad={24} w={sheetBody() + 48}>
              <div style={{ position: 'relative' }}>
                <AccHeaderView look={l} title={`혜택 상세 · ${BENEFITS.length}건`}>
                  <span style={{ position: 'relative', display: 'inline-flex' }}>
                    <ExpandAllView look={l} allOpen={(open as string[]).length > 0} showHit />
                    <Band style={{ left: -16, width: 10, top: 0, height: a.h }} label={String(a.h)} tag="left" />
                    <Band style={{ right: -12, width: 8, top: -(a.touch - a.h) / 2, height: a.touch }} label={String(a.touch)} tag="below" />
                  </span>
                </AccHeaderView>
                <AccordionView look={l} variant="separated" items={items} open={open as string[]} />
              </div>
            </Board>
          </Shot>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Cap w={620}>
          목록 머리 오른쪽 글 버튼(SEED Text Button) — {parseFloat(a.type.fontSize)} · {a.type.fontWeight} · fg-neutral-muted · 아이콘 없음 · 보이는 {a.h} · 누르는 {a.touch}(분홍). 머리는 제목 {parseFloat(l.header.title.fontSize)} / {parseFloat(l.header.title.lineHeight)} · {l.header.title.fontWeight} + 건수 · 높이 {l.header.minH} · 아래 {l.header.marginBottom}
        </Cap>
      </div>
    </Panel>
  );
};

// ── State ─────────────────────────────────────────────────
const STATE_KO: Record<TriggerState, string> = { enabled: '기본', hovered: '호버(웹)', focused: '포커스(키보드)', pressed: '누름', disabled: '막힘' };
const STATES: TriggerState[] = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'];
function StateCell({ mode, state, variant }: { mode: 'light' | 'dark'; state: TriggerState; variant: 'inline' | 'separated' }) {
  const l = AL();
  const it: AccItem = { id: `${variant}${state}`, title: '커피', description: '월 2회 할인', detail: 'x', icon: 'coffee', state };
  return (
    <div style={{ width: 230, boxSizing: 'content-box', background: rc(variant === 'separated' ? 'bg-layer-floating' : 'bg-layer-default', mode), paddingTop: variant === 'separated' ? 12 : 0, paddingBottom: variant === 'separated' ? 12 : 0, paddingLeft: variant === 'separated' ? 12 : 0, paddingRight: variant === 'separated' ? 12 : 0, borderRadius: 12 }}>
      <AccordionView look={l} mode={mode} variant={variant} items={[it]} />
    </div>
  );
}
const States: Fig = ({ caption }) => {
  const l = AL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Wide>
              <div className="grid w-max grid-cols-[max-content_max-content_max-content] items-center gap-x-4 gap-y-3 rounded-xl p-4" style={{ background: rc('bg-layer-basement', mode) }}>
                <span />
                {['inline', 'separated'].map((v) => (
                  <span key={v} className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
                    {v}
                  </span>
                ))}
                {STATES.map((st) => (
                  <div key={st} className="contents">
                    <span className="text-[12px] font-bold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                      {STATE_KO[st]}
                    </span>
                    <StateCell mode={mode} state={st} variant="inline" />
                    <StateCell mode={mode} state={st} variant="separated" />
                  </div>
                ))}
              </div>
            </Wide>
            <Cap strong={modeKo(mode)} w={640}>
              호버 = 누름 바탕(좌우 {l.bg.insetX} 들임 · 모서리 {l.bg.radius}) · 누름은 콘텐츠만 {l.content.press.distance}px 거리 축소 · 포커스는 안쪽 링 {l.ring.width}px(separated 모서리 {l.separated.ringRadius}) · 막힘은 아이콘 · 글 · 꺾쇠 모두 fg-disabled
            </Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── 모션 ──────────────────────────────────────────────────
const Motion: Fig = () => <AccMotionDemo look={AL()} />;

// ── Guidelines ────────────────────────────────────────────
// 언제 쓰나 — 혜택 열둘은 Accordion · 분할 내역 하나는 Collapsible · 카테고리는 List 하위 줄
const WhenGuide: Fig = ({ caption }) => {
  const col = COL();
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="같은 모양의 상세 여럿 — 혜택 열둘은 Accordion(모두 펼치기)" bg="var(--p-bg-layer-basement)">
          <div style={{ width: 312, flexShrink: 0 }}>
            <AccCard title={`혜택 · ${BENEFITS.length}건`} items={benefitItems({ only: ['pay', 'coffee', 'transit', 'telecom'] })} />
          </div>
        </Verdict>
        <Verdict ok note="상세 하나 — 분할 내역은 Collapsible(같은 트리거 모양)">
          <div style={{ width: 312, flexShrink: 0, background: 'var(--p-bg-layer-default)' }}>
            <CollapsibleView look={col} layout="rows" title={SPLIT_TITLE} description={SPLIT_DESC} open>
              <SplitRows n={3} />
            </CollapsibleView>
          </div>
        </Verdict>
        <Verdict ok note="줄은 편집, 하위만 접는다 — 카테고리는 List 하위 줄(줄 앞 꺾쇠 단추)">
          <div style={{ width: 312, flexShrink: 0, background: 'var(--p-bg-layer-default)' }}>
            <NestedListView list={listLook()} nest={listNestLook()} categories={CATEGORIES.slice(0, 2)} open={['food']} width={312} childLimit={3} />
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

// 여럿을 함께 연다 — 모두 펼치기 한 번 · 하나만 여는 모드는 두지 않는다
const MultiGuide: Fig = ({ caption }) => {
  const all = benefitItems().filter((i) => i.detail).map((i) => i.id);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`모두 펼치기 한 번으로 상세가 있는 ${all.length}개가 함께 열린다(그림은 앞 6건) — 둘을 나란히 견주며 읽고, 시트 본문이 그만큼 길어져 스크롤한다`} bg="#E9E9EC">
          <ScaledAuto w={390} s={0.6}>
            <div style={{ background: rc('bg-layer-floating'), borderRadius: 24, paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24 }}>
              <BenefitList open={all} items={benefitItems({ only: ['pay', 'coffee', 'transit', 'telecom', 'store', 'movie'] })} />
            </div>
          </ScaledAuto>
        </Verdict>
        <Verdict ok={false} note="하나만 여는 모드 — 커피를 열면 위의 간편결제가 닫혀 누른 자리가 위로 밀려 올라간다. 열 개를 비교하려면 열 번 누른다" bg="#E9E9EC">
          <ScaledAuto w={390} s={0.6}>
            <div style={{ position: 'relative', background: rc('bg-layer-floating'), borderRadius: 24, paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24 }}>
              <BenefitList open={['coffee']} items={benefitItems({ only: ['pay', 'coffee', 'transit', 'telecom', 'store', 'movie'] })} />
              <span aria-hidden className="absolute rounded-md px-2 py-1 text-[13px] font-bold text-white" style={{ right: 32, top: 150, background: '#B91C1C' }}>
                ↑ 앞 항목이 닫히며 밀려 올라감
              </span>
            </div>
          </ScaledAuto>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 펼쳐도 그 자리에 — 시트 본문이 스크롤 · 패널 안 스크롤 상자는 두지 않는다
const ScrollGuide: Fig = ({ caption }) => {
  const l = AL();
  const s = overlayLook('desk').sheet;
  const inner = (
    <div style={{ height: 120, overflowY: 'scroll', borderTop: `1px solid ${rc('stroke-neutral-subtle')}`, borderBottom: `1px solid ${rc('stroke-neutral-subtle')}` }} className="psa">
      {LONG_DETAIL}
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="첫 항목을 펼쳐도 트리거는 그 자리 · 초점도 트리거 — 길어진 내용은 시트 본문이 스크롤한다" bg="#E9E9EC">
          <Phone mode="auto" title="카드 상세" scale={0.55} h={640} screenW={360} overlay={<SheetOver open={['pay']} />}>
            <CardDetailBody />
          </Phone>
        </Verdict>
        <Verdict ok={false} note="패널에 높이를 정해 안에서 스크롤 — 스크롤이 겹쳐 손가락이 어느 쪽을 움직이는지 모른다" bg="#E9E9EC">
          <Phone mode="auto" title="카드 상세" scale={0.55} h={640} screenW={360}
            overlay={
              <DimView dim={s.dim} place="end">
                <SheetSurface look={s} title="카드 상세" safe={PHONE_SAFE} maxHeight={`${s.maxHeight * 100}%`}>
                  <AccHeaderView look={l} title={`혜택 상세 · ${BENEFITS.length}건`} />
                  <AccordionView look={l} variant="separated" items={[{ id: 'pay', title: BENEFITS[0].title, description: BENEFITS[0].summary, detail: inner }, ...benefitItems({ only: ['coffee', 'transit', 'telecom'] })]} open={['pay']} />
                </SheetSurface>
              </DimView>
            }
          >
            <CardDetailBody />
          </Phone>
        </Verdict>
      </Pair>
    </Panel>
  );
};
function SheetOver({ open }: { open: string[] }) {
  const s = overlayLook('desk').sheet;
  return (
    <DimView dim={s.dim} place="end">
      <SheetSurface look={s} title="카드 상세" safe={PHONE_SAFE} maxHeight={`${s.maxHeight * 100}%`} fog>
        <BenefitList open={open} />
      </SheetSurface>
    </DimView>
  );
}

// 카드 상세의 혜택 · 유의사항 — 처음 모습(모두 접힘)의 전체 길이
const CardGuide: Fig = ({ caption }) => {
  const c = CDL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <MeasureH prefix="전체 " suffix="px" scale={0.5}>
              <ScaledAuto w={360} s={0.5}>
                <div style={{ background: rc('bg-layer-basement', mode), borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ height: 56, display: 'flex', alignItems: 'center', paddingLeft: 24, fontSize: 18, fontWeight: 700, background: rc('bg-layer-default', mode), color: rc('fg-neutral', mode) }}>카드 상세</div>
                  <CardDetailBody mode={mode} bottom={24} />
                </div>
              </ScaledAuto>
            </MeasureH>
            <Cap strong={modeKo(mode)}>카드 요약 · 혜택 {BENEFITS.length}건 · 유의사항 {CAUTIONS.length}건 — 모두 접혀 있다</Cap>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Cap w={640}>
          카드 안 inline — 머리(위 {c.accordion.header.top} · 좌우 {c.accordion.header.x} · 아래 {c.accordion.header.bottom}) 아래 트리거가 카드 가장자리까지, 카드 아래 {c.accordion.padBottom}(마지막 트리거의 아래 {AL().padY} 와 합쳐 {c.accordion.padBottom + AL().padY}). 84자 유의사항 제목도 줄을 바꿔 다 보인다
        </Cap>
      </div>
    </Panel>
  );
};

// 제목은 자르지 않는다 — 84자 유의사항 제목
const WrapGuide: Fig = ({ caption }) => {
  const l = AL();
  const first = cautionItems().slice(0, 2);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`${CAUTIONS[0].title.length}자 제목도 줄을 바꿔 다 보인다(단어 단위) — 펼쳐도 상세만 나오므로 제목은 여기서 다 읽혀야 한다`} bg="var(--p-bg-layer-basement)">
          <div style={{ width: 312, flexShrink: 0 }}>
            <AccCard title={`유의사항 · ${CAUTIONS.length}건`} items={first} expandAll={false} />
          </div>
        </Verdict>
        <Verdict ok={false} note="한 줄 말줄임 — 잘린 제목은 어디에서도 다 읽을 수 없다(펼쳐도 다른 글)" bg="var(--p-bg-layer-basement)">
          <div style={{ width: 312, flexShrink: 0 }}>
            <AccCard title={`유의사항 · ${CAUTIONS.length}건`} items={first.map((it, i) => (i === 0 ? { ...it, title: '', decor: <Ellipsis text={it.title} l={l} /> } : it))} expandAll={false} />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};
// 나쁜 예 — 제목을 한 줄 말줄임으로 그린다(트리거의 제목 자리에 겹쳐)
function Ellipsis({ text, l }: { text: string; l: ReturnType<typeof AL> }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ left: l.padX, right: l.padX + l.chevron.size + l.content.gap, top: l.padY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: l.title.fontFamily, fontSize: l.title.fontSize, lineHeight: l.title.lineHeight, fontWeight: l.title.fontWeight, color: rc('fg-neutral') }}>
      {text}
    </span>
  );
}

// ── 코드 미리보기(실제로 누를 수 있다) — accordion.md 의 코드 그대로 ──
const ExSheet: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={sheetBody()} pad={24} bg="bg-layer-floating">
    <ExAccSheetDemo look={AL()} />
  </CodePreview>
);
const ExCard: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={312} pad={24} bg="bg-layer-basement">
    <ExAccCardDemo look={AL()} card={CDL()} />
  </CodePreview>
);

export const accordionFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  variant: Variant,
  size: Size,
  panel: PanelFig,
  'no-detail': NoDetail,
  'expand-all': ExpandAll,
  states: States,
  motion: Motion,
  'when-guide': WhenGuide,
  'multi-guide': MultiGuide,
  'scroll-guide': ScrollGuide,
  'card-guide': CardGuide,
  'wrap-guide': WrapGuide,
  'ex-sheet': ExSheet,
  'ex-card': ExCard,
};
