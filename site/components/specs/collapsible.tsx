// Collapsible 페이지의 그림 — specs/components/collapsible.md 의 `[그림: …](../../site/components/specs/collapsible.tsx#<id>)` 자리.
// 트리거 · 펼친 내용 · 놓인 면(흰 면 · 카드 · 경고 상자)은 collapsible.yaml 을 푼 값(collapsibleLook — collapse-view)으로, 함께 놓이는
// 아코디언은 accordion.yaml, 카테고리 하위 줄은 list.yaml(list-nest-view), 화면 틀은 kit · nav-screens · overlay-view 로 그린다.
// 거래 · 분할 · 업무 보고 · 규정 글은 지어낸 것이다(collapse-data). 고정 값은 YAML 에서, 글 길이에 따라 달라지는 높이는 브라우저에서 잰다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { CollapsiblePlayground, ExFilterCardDemo, ExSplitDemo, ExWarningDemo, QuickFixes, ShortfallMessage } from './collapse-play';
import { MeasureH, MeasuredText, ScaledAuto } from './collapse-measure';
import { LedgerHeadView, LedgerListView } from './collapse-ledger';
import { screenTones, listNestLook } from './collapse-look';
import { AccCard, COL, HrReportMain, SPLIT_DESC, SPLIT_TITLE, SplitRows, SplitSheetPhone, TxDetailPhone, benefitItems, Legend } from './collapse-screens';
import { CollapsibleView, WarningBoxView } from './collapse-view';
import { BENEFITS, CATEGORIES, RULES, SPLIT_TOTAL } from './collapse-data';
import { triggerReadout, type ColSurface, type TriggerState } from './collapse-shared';
import { cardLook } from './data-look';
import { CardSurface } from './data-card-view';
import { listLook } from './list-look';
import { NestedListView } from './list-nest-view';
import { Phone, Verdict, rc, type Mode } from './kit';
import { Band, Cap, CodePreview, HrDesktop, MoneyTabs, Reading, Shot, pinAt } from './nav-screens';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col gap-4">{children}</div>;
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;
const dash: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
function Board({ mode = 'auto', bg = 'bg-layer-default', w, children, pad = 0, style, brand = 'desk' }: { mode?: Mode; bg?: string; w?: number; children: ReactNode; pad?: number; style?: CSSProperties; brand?: 'desk' | 'hr' }) {
  return <div style={{ width: w, boxSizing: 'border-box', background: rc(bg, mode, brand), borderRadius: 16, paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad, flexShrink: 0, ...style }}>{children}</div>;
}
const PHONE_BODY = 342;

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-6">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-3">
          <div className="flex items-start gap-4">
            <TxDetailPhone mode={mode} />
            <SplitSheetPhone mode={mode} />
          </div>
          <HrDesktop mode={mode} s={0.42} h={600} current="work">
            <HrReportMain mode={mode} />
          </HrDesktop>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <CollapsiblePlayground looks={{ desk: COL('desk'), hr: COL('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = COL();
  const body = l.minHDesc - l.padY * 2;
  const pins = (
    <>
      {pinAt('ⓐ', { left: -10, top: -10 })}
      {pinAt('ⓑ', { left: l.padX - 4, top: l.padY - 21 })}
      {pinAt('ⓒ', { left: 2, top: l.padY + parseFloat(l.title.lineHeight) + l.body.gap - 1 })}
      {pinAt('ⓓ', { left: PHONE_BODY - l.padX - l.chevron.size / 2 - 10, top: l.padY + (body - l.chevron.size) / 2 - 22 })}
    </>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Wide>
          <div style={{ padding: '14px 8px 4px' }}>
            <Board w={PHONE_BODY}>
              <CollapsibleView look={l} layout="rows" title={SPLIT_TITLE} description={SPLIT_DESC} open marks={{ trigger: dash }} decor={pins}>
                <div style={{ position: 'relative' }}>
                  {pinAt('ⓔ', { left: -l.panel.padX + 2, top: 10 })}
                  <SplitRows n={3} />
                </div>
              </CollapsibleView>
            </Board>
          </div>
        </Wide>
        <Legend
          items={[
            ['ⓐ', `Trigger — 위아래 ${l.padY} · 좌우 ${l.padX} · ${l.minH}(설명 있으면 ${l.minHDesc}) · 줄 전체가 누르는 자리`],
            ['ⓑ', `Title — ${parseFloat(l.title.fontSize)} / ${parseFloat(l.title.lineHeight)} · ${l.title.fontWeight} · 고정 이름`],
            ['ⓒ', `Description — ${parseFloat(l.description.fontSize)} / ${parseFloat(l.description.lineHeight)} · ${l.description.fontWeight} · 이름 아래 ${l.body.gap}`],
            ['ⓓ', `Chevron — ${l.chevron.size} · 본문 뒤 ${l.content.gap} · 펼치면 ${l.chevron.openRotate}°`],
            ['ⓔ', `Panel — 좌우 ${l.panel.padX} · 아래 ${l.panel.padBottom}(줄 목록이면 ${l.rowsPadBottom})`],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 트리거 ────────────────────────────────────────────────
const Trigger: Fig = ({ caption }) => {
  const l = COL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wide>
          <div className="flex flex-col gap-3" style={{ paddingRight: 48 }}>
            {[
              ['이름만', undefined],
              ['이름 + 설명', SPLIT_DESC],
            ].map(([k, d]) => (
              <Board key={k} w={PHONE_BODY}>
                <MeasureH>
                  <CollapsibleView look={l} title={SPLIT_TITLE} description={d}>
                    <SplitRows n={1} />
                  </CollapsibleView>
                </MeasureH>
              </Board>
            ))}
          </div>
        </Wide>
        <Cap w={620}>
          이름만 {l.minH}(위아래 {l.padY} + 이름 {parseFloat(l.title.lineHeight)}) · 설명이 있으면 {l.minHDesc}(+ {l.body.gap} + 설명 {parseFloat(l.description.lineHeight)}) — Accordion 항목과 같은 트리거라 줄 전체가 누르는 자리다(지금의 글 단추 18 · 16.5 를 걷는다). 돈은 원까지, 빼기는 U+2212
        </Cap>
      </div>
    </Panel>
  );
};

// ── Surface ───────────────────────────────────────────────
const Surface: Fig = ({ caption }) => {
  const l = COL();
  const w = 312;
  const col = (strong: string, cap: string, node: ReactNode, bg = 'bg-layer-default', pad = 0) => (
    <Shot strong={strong} cap={cap}>
      <Board bg={bg} pad={pad} w={w + pad * 2}>
        {node}
      </Board>
    </Shot>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {col(
          'default — 흰 면',
          `줄 폭 전체 · 좌우 ${l.padX} · 누름 bg-layer-default-pressed`,
          <div style={{ position: 'relative' }}>
            <CollapsibleView look={l} title={SPLIT_TITLE} description={SPLIT_DESC} state="pressed">
              <span />
            </CollapsibleView>
            <Band style={{ left: 0, width: l.padX, top: 0, height: l.minHDesc }} label={String(l.padX)} />
          </div>,
        )}
        {col(
          'card — 카드 면',
          `테두리 ${l.card.borderW} · 모서리 ${l.card.radius} · 펼친 내용 아래 ${l.card.panelPadBottom}`,
          <div style={{ position: 'relative' }}>
            <CollapsibleView look={l} surface="card" title="상세 검색 조건" description="2개 필터 적용 중" state="pressed">
              <span />
            </CollapsibleView>
            <Band style={{ left: l.card.borderW, width: l.padX, top: l.card.borderW, height: l.minHDesc }} label={String(l.padX)} />
          </div>,
          'bg-layer-basement',
          16,
        )}
        {col(
          'warning — 경고 상자 아래 줄',
          `좌우 ${l.warning.padX} · 위 선 ${l.warning.divider.height}px · 누름 bg-warning-weak-pressed · 상자 모서리 ${l.warning.box.radius}`,
          <WarningBoxView look={l} message={<ShortfallMessage look={l} />}>
            <div style={{ position: 'relative' }}>
              <CollapsibleView look={l} surface="warning" title="빠르게 맞추기" state="pressed">
                <QuickFixes />
              </CollapsibleView>
              <Band style={{ left: 0, width: l.warning.padX, top: l.warning.divider.height, height: l.minH }} label={String(l.warning.padX)} />
            </div>
          </WarningBoxView>,
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <Cap w={640}>
          같은 트리거 — 글 · 꺾쇠 · 높이는 같고 여백 · 선 · 누름 색만 다르다. 경고 상자는 바탕 · 1px 테두리 · 모서리 {l.warning.box.radius} · 경고 글 위 {l.warning.box.padTop} · 좌우 {l.warning.box.padX} · 아래 {l.warning.box.padBottom} — 상자의 넘침 숨김이 아래 줄의 누름 바탕을 모서리에서 자른다
        </Cap>
      </div>
    </Panel>
  );
};

// ── State ─────────────────────────────────────────────────
const STATE_KO: Record<TriggerState, string> = { enabled: '기본', hovered: '호버(웹)', focused: '포커스(키보드)', pressed: '누름', disabled: '막힘' };
const STATES: TriggerState[] = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'];
function StateCell({ mode, state, surface }: { mode: 'light' | 'dark'; state: TriggerState; surface: ColSurface }) {
  const l = COL();
  const v = <CollapsibleView look={l} mode={mode} surface={surface} title="상세 조건" state={state} disabled={state === 'disabled'}>{null}</CollapsibleView>;
  if (surface === 'warning')
    return (
      <div style={{ width: 160 }}>
        <WarningBoxView look={l} mode={mode} message={<span style={{ fontSize: 13, color: rc('fg-neutral', mode) }}>합계가 모자라요.</span>}>{v}</WarningBoxView>
      </div>
    );
  return <div style={{ width: 160, background: surface === 'default' ? rc('bg-layer-default', mode) : undefined, borderRadius: 8 }}>{v}</div>;
}
const States: Fig = ({ caption }) => {
  const l = COL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Wide>
              <div className="grid w-max grid-cols-[max-content_max-content_max-content_max-content] items-center gap-x-3 gap-y-3 rounded-xl p-4" style={{ background: rc('bg-layer-basement', mode) }}>
                <span />
                {['흰 면', '카드', '경고 상자'].map((v) => (
                  <span key={v} className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
                    {v}
                  </span>
                ))}
                {STATES.map((st) => (
                  <div key={st} className="contents">
                    <span className="text-[12px] font-semibold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                      {STATE_KO[st]}
                    </span>
                    <StateCell mode={mode} state={st} surface="default" />
                    <StateCell mode={mode} state={st} surface="card" />
                    <StateCell mode={mode} state={st} surface="warning" />
                  </div>
                ))}
              </div>
            </Wide>
            <Cap strong={modeKo(mode)} w={640}>
              호버 = 누름 바탕(좌우 {l.bg.insetX} 들임 · 모서리 {l.bg.radius} — 경고 상자는 bg-warning-weak-pressed) · 누름은 콘텐츠만 {l.content.press.distance}px 거리 축소 · 포커스 링 {l.ring.width}px 안쪽(카드 모서리 {l.card.ringRadius} · 경고 상자 {l.warning.ringRadius}) · 막힘은 fg-disabled
            </Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const WhenGuide: Fig = ({ caption }) => {
  const l = COL();
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="상세 하나를 접고 편다 — 분할 내역은 Collapsible">
          <div style={{ width: 312, flexShrink: 0, background: 'var(--p-bg-layer-default)' }}>
            <CollapsibleView look={l} layout="rows" title={SPLIT_TITLE} description={SPLIT_DESC} open>
              <SplitRows n={2} />
            </CollapsibleView>
          </div>
        </Verdict>
        <Verdict ok note="같은 모양의 상세가 여럿 — 혜택은 Accordion(모두 펼치기)" bg="var(--p-bg-layer-basement)">
          <div style={{ width: 312, flexShrink: 0 }}>
            <AccCard title={`혜택 · ${BENEFITS.length}건`} items={benefitItems({ only: ['coffee', 'transit', 'telecom'] })} />
          </div>
        </Verdict>
        <Verdict ok note="줄 자체가 편집을 열고 하위 줄만 접는다 — 카테고리는 List 하위 줄(줄 앞 꺾쇠 단추 44)">
          <div style={{ width: 312, flexShrink: 0, background: 'var(--p-bg-layer-default)' }}>
            <NestedListView list={listLook()} nest={listNestLook()} categories={CATEGORIES.slice(0, 2)} open={['food']} width={312} childLimit={2} />
          </div>
        </Verdict>
        <Verdict ok={false} note="같은 모양의 Collapsible 을 여럿 쌓기 — 모두 펼치기가 없고 묶음으로 읽히지 않는다. Accordion 을 쓴다">
          <div style={{ width: 312, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {benefitItems({ only: ['coffee', 'telecom', 'movie'] }).map((it) => (
              <CollapsibleView key={it.id} look={l} surface="card" title={it.title} description={it.description}>
                {null}
              </CollapsibleView>
            ))}
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

// 이름은 고정 — 펼침은 aria-expanded
function NowSplitHead({ mode = 'auto' }: { mode?: Mode }) {
  // 지금(웹 거래 상세) — 머리 "내역 분할 6개" 오른쪽 글 단추 "합계 123,456,789원 ⌄"(128.9 × 18 · 이름에 무엇을 여닫는지 · 빼기 없음)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: rc('fg-neutral', mode) }}>{SPLIT_TITLE}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 18, fontSize: 12, fontWeight: 600, color: rc('fg-brand', mode), outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 }}>
        합계 {Math.abs(SPLIT_TOTAL).toLocaleString('ko-KR')}원 ⌄
      </span>
    </div>
  );
}
const NameGuide: Fig = ({ caption }) => {
  const l = COL();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="줄 전체가 트리거 · 이름은 무엇을 여닫는지 그대로 — 펼침은 aria-expanded 가 알린다(APG Disclosure)">
          <div className="flex w-full max-w-[312px] flex-col items-center gap-3">
            <div style={{ width: 312, background: 'var(--p-bg-layer-default)' }}>
              <CollapsibleView look={l} layout="rows" title={SPLIT_TITLE} description={SPLIT_DESC} open state="focused">
                <SplitRows n={2} />
              </CollapsibleView>
            </div>
            <Reading tone="ok">{triggerReadout(SPLIT_TITLE, SPLIT_DESC, l.heading, true)}</Reading>
          </div>
        </Verdict>
        <Verdict ok={false} note="지금 — 오른쪽 글 단추 128.9 × 18 이 합계만 말하고 무엇을 여닫는지 · 펼침 · 빼기 부호가 없다">
          <div className="flex w-full max-w-[312px] flex-col items-center gap-3">
            <div style={{ width: 312, background: 'var(--p-bg-layer-default)' }}>
              <NowSplitHead />
            </div>
            <Reading tone="bad">합계 {Math.abs(SPLIT_TOTAL).toLocaleString('ko-KR')}원, 단추</Reading>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 잘린 글을 펼치지 않는다 — HR 규정 카드(데스크톱 4열), 한국어 · 영어
function RuleCards({ lang, clamp = false }: { lang: 'ko' | 'en'; clamp?: boolean }) {
  const c = cardLook();
  const sec = RULES[lang][0];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 16, alignItems: 'stretch' }}>
      {sec.cards.map((card) => (
        <CardSurface key={card.title} look={c} height="100%">
          <span style={{ fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: 'var(--p-fg-neutral)' }}>{card.title}</span>
          <span
            lang={lang}
            style={{
              marginTop: 8,
              fontSize: 14,
              lineHeight: '22px',
              color: 'var(--p-fg-neutral-muted)',
              ...(clamp ? { display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
            }}
          >
            {card.body}
          </span>
          {clamp && <span style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: 'var(--p-fg-brand)' }}>더 보기</span>}
        </CardSurface>
      ))}
    </div>
  );
}
const WrapGuide: Fig = ({ caption }) => {
  const W = 200 * 4 + 16 * 3;
  const block = (clamp: boolean) => (
    <div className="flex flex-col gap-3">
      {(['ko', 'en'] as const).map((lang) => (
        <ScaledAuto key={lang} w={W} s={0.66}>
          <div style={{ background: 'var(--p-bg-layer-basement)', padding: 0 }}>
            <RuleCards lang={lang} clamp={clamp} />
          </div>
        </ScaledAuto>
      ))}
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="본문을 자르지 않고 줄을 바꿔 다 보인다 — 한 줄의 카드 높이는 그 줄에서 가장 긴 카드에 맞춘다(한국어 · 영어 모두, 데스크톱 4열)" bg="var(--p-bg-layer-basement)">
          {block(false)}
        </Verdict>
        <Verdict ok={false} note="4줄에서 잘라 '더 보기' 로 펼치기 — 잘린 글을 읽으려고 한 번 더 누르고, 영어는 더 많이 잘린다" bg="var(--p-bg-layer-basement)">
          {block(true)}
        </Verdict>
      </div>
    </Panel>
  );
};

// 원장 머리 — 소비 요약과 월 달력은 하나만
function LedgerPhone({ mode = 'auto', summary, calendar, id }: { mode?: Mode; summary: boolean; calendar: boolean; id: string }) {
  const tones = screenTones('desk');
  return (
    <Phone title="가계부" back={false} mode={mode} scale={0.5} h={760} screenW={360} bg="bg-layer-default">
      <MoneyTabs mode={mode} />
      <LedgerHeadView tones={tones} mode={mode} summaryOpen={summary} calendarOpen={calendar} />
      <div data-measure={id} style={{ flex: 1, minHeight: 0, overflow: 'hidden', outline: `2px dashed ${MARK_LINE}`, outlineOffset: -2 }}>
        <LedgerListView tones={tones} mode={mode} limit={12} />
      </div>
    </Phone>
  );
}
const LedgerGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-4">
        {(
          [
            ['ledger-sum', true, false, '소비 요약을 열면 월 달력이 닫힌다'],
            ['ledger-cal', false, true, '월 달력을 열면 소비 요약이 닫힌다'],
          ] as const
        ).map(([id, s, c, t]) => (
          <div key={id} className="flex flex-col items-center gap-2">
            <LedgerPhone summary={s} calendar={c} id={id} />
            <Cap strong={t}>
              <MeasuredText target={id} template="거래 목록이 보이는 높이 {h}px(분홍 점선)" />
            </Cap>
          </div>
        ))}
      </div>
      <Verdict ok={false} note="둘 다 열리면 거래 목록이 화면 아래로 밀려 거의 보이지 않는다 — 웹 가계부도 앱처럼 하나만">
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone summary calendar id="ledger-both" />
          <Cap>
            <MeasuredText target="ledger-both" template="거래 목록이 보이는 높이 {h}px" />
          </Cap>
        </div>
      </Verdict>
    </div>
  </Panel>
);

// ── 코드 미리보기(실제로 누를 수 있다) — collapsible.md 의 코드 그대로 ──
const ExSplit: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={PHONE_BODY} pad={24} bg="bg-layer-default">
    <ExSplitDemo look={COL()} />
  </CodePreview>
);
const ExWarning: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={PHONE_BODY} pad={24} bg="bg-layer-floating">
    <ExWarningDemo look={COL()} />
  </CodePreview>
);
const ExCard: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={976} pad={24} padX={16} bg="bg-layer-basement" brand="hr">
    <ExFilterCardDemo look={COL('hr')} />
  </CodePreview>
);

export const collapsibleFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  trigger: Trigger,
  surface: Surface,
  states: States,
  'when-guide': WhenGuide,
  'name-guide': NameGuide,
  'wrap-guide': WrapGuide,
  'ledger-guide': LedgerGuide,
  'ex-split': ExSplit,
  'ex-warning': ExWarning,
  'ex-card': ExCard,
};
