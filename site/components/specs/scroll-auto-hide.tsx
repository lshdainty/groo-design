// Scroll Auto Hide 페이지의 그림 — specs/components/scroll-auto-hide.md 의 `[그림: …](../../site/components/specs/scroll-auto-hide.tsx#<id>)` 자리.
// 숨는 머리의 자리 · 따라가기 · 스냅(비율 · 시간 · 곡선) · 바탕 · z 는 scroll-auto-hide.yaml 을 푼 값(autoHideLook — collapse-scroll)으로,
// 상단 바 · 탭 바는 top-navigation · bottom-navigation.yaml(nav-view), Line Tabs 는 tabs.yaml 로 그린다. 원장(머리 · 거래 40줄)은 지어낸 것이다.
// 머리 높이 · 목록이 보이는 높이는 글 길이 · 폭에 따라 달라 브라우저에서 잰다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { autoHideLook, screenTones } from './collapse-look';
import { AutoHideControls, AutoHideLedger, AutoHideProvider, type AHFrozen } from './collapse-scroll';
import { MeasuredText } from './collapse-measure';
import { chipLook } from './chip-look';
import { ChipGroupView, ChipView } from './chip-view';
import { Phone, Verdict, type Mode } from './kit';
import { Cap, CodePreview, MoneyTabs, pinAt } from './nav-screens';
import { Legend } from './collapse-screens';
import type { TabSize } from './nav-shared';
import { CARD_ROW_H, CardBenefitPhone, SEARCH_ROW_H, SearchPhone } from './nav-search';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const AH = () => autoHideLook();
const tones = () => screenTones('desk');

// 폰 가계부 — 상단 바 · Line Tabs(숨지 않는다) 아래가 스크롤 상자, 그 안 맨 위가 숨는 머리. 탭 바는 따로(제 규칙으로 줄어든다)
function LedgerPhone({ mode = 'auto', frozen, scale = 0.5, h = 760, reduce, header, measureId, tabSize, decor, hideBars = false, marks }: { mode?: Mode; frozen?: AHFrozen; scale?: number; h?: number; reduce?: boolean; header?: ReactNode; measureId?: string; tabSize?: TabSize; decor?: ReactNode; hideBars?: boolean; marks?: { box?: CSSProperties; head?: CSSProperties } }) {
  return (
    <Phone title={hideBars ? undefined : '가계부'} back={false} mode={mode} scale={scale} h={h} screenW={360} bg="bg-layer-default" tabs tab="ledger" tabSize={tabSize} overlay={decor}>
      {!hideBars && <MoneyTabs mode={mode} />}
      <AutoHideLedger look={AH()} tones={tones()} mode={mode} frozen={frozen} reduce={reduce} header={header} measureId={measureId} marks={marks} />
    </Phone>
  );
}
// 필터를 걸면 같은 자리에 나오는 필터 칩 줄(머리)
function FilterHead({ mode = 'auto' }: { mode?: Mode }) {
  const chip = chipLook();
  return (
    <div style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 24, background: 'transparent' }}>
      <ChipGroupView look={chip} layout="scroll" ariaLabel="적용한 필터" mode={mode}>
        {['식비', '현대카드 M', '10월 1일 ~ 8일', '1만 원 이상'].map((t) => (
          <ChipView key={t} look={chip} mode={mode} state="enabled" selected label={t} />
        ))}
      </ChipGroupView>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-3">
          <LedgerPhone mode={mode} frozen={{ scroll: 0, hidden: 0 }} scale={0.42} />
          <LedgerPhone mode={mode} frozen={{ scroll: 900, hidden: 'all' }} scale={0.42} tabSize="compact" />
          <LedgerPhone mode={mode} frozen={{ scroll: 740, hidden: 0 }} scale={0.42} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => (
  <figure className="not-prose my-6">
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
      <AutoHideProvider>
        <LedgerPhone scale={0.8} h={760} />
        <AutoHideControls snapLabel={`스냅 ${AH().threshold * 100}% · ${AH().snap.duration}`} />
      </AutoHideProvider>
    </div>
  </figure>
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const a = AH();
  // 화면 위 상태 막대 40 · 상단 바 56 · Line Tabs 44 아래부터가 스크롤 상자 — 핀은 폰 화면의 자리
  const decor = (
    <>
      {pinAt('ⓐ', { left: 6, top: 146 })}
      {pinAt('ⓑ', { right: 8, top: 146 })}
      {pinAt('ⓒ', { left: 6, top: 300 })}
    </>
  );
  const dash = (c: string): CSSProperties => ({ outline: `2px dashed ${c}`, outlineOffset: -2 });
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <LedgerPhone scale={0.8} h={720} frozen={{ scroll: 120, hidden: 120 }} decor={decor} marks={{ box: dash(MARK_LINE), head: dash('#2563EB') }} />
        <Legend
          items={[
            ['ⓐ', 'Scroll Container(분홍 점선) — 상단 바 · 탭 아래부터(쓰는 쪽)'],
            ['ⓑ', `Root(파란 점선) — ${a.position} · top ${a.top} · z ${a.z}`],
            ['', `translate3d 로 위로 옮겨 숨는다 — 높이 그대로(그림은 120 숨음) · 바탕 bg-layer-default`],
            ['ⓒ', 'Content — 거래 목록. 머리가 숨으면 화면을 다 쓴다'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 따라가고, 멈추면 스냅 ──────────────────────────────────
const Follow: Fig = ({ caption }) => {
  const a = AH();
  const shots: [string, AHFrozen, string][] = [
    ['900 내림', { scroll: 900, hidden: 'all' }, '머리가 다 숨었다'],
    ['160 올림 — 스크롤 중', { scroll: 740, hidden: { fromAll: 160 } }, '올린 160 만큼 드러났다'],
    ['멈춤 — 스냅', { scroll: 740, hidden: 0 }, `${a.threshold * 100}% 아래만 숨어 있어 ${a.snap.duration} 에 다 드러난다`],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-start justify-center gap-3">
          {shots.map(([t, f, cap], i) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <LedgerPhone frozen={f} scale={0.42} measureId={i === 0 ? 'ah-follow-head' : undefined} tabSize={i === 0 ? 'compact' : 'regular'} />
              <Cap strong={t}>{cap}</Cap>
            </div>
          ))}
        </div>
        <Cap w={640}>
          <MeasuredText target="ah-follow-head" template={`머리 {h}px — 스크롤하는 동안 거리를 1:1 로 따라간다(시간 · 곡선 없음). 스크롤이 끝나면 머리 높이의 ${a.threshold * 100}% 를 기준으로 다 숨거나 다 드러난다(${a.snap.duration} ${a.snap.easing}). 아래 탭 바는 제 규칙으로 줄어든다(따로)`} />
        </Cap>
      </div>
    </Panel>
  );
};

// ── 모션 줄이기 · 초점 ─────────────────────────────────────
const Reduced: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone frozen={{ scroll: 900, hidden: 0 }} reduce scale={0.45} />
          <Cap strong="모션 줄이기">자동 숨김을 끈다 — 900 내려도 머리는 늘 보이고, 목록이 그 아래에서 스크롤한다</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone frozen={{ scroll: 900, hidden: 0, focusSummary: true }} scale={0.45} />
          <Cap strong="숨은 머리로 Tab">"소비 요약" 에 초점이 오면 바로 다 드러낸다 — 보이지 않는 단추에 초점이 머물지 않는다</Cap>
        </div>
      </div>
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
const PlaceGuide: Fig = ({ caption }) => {
  const bracket: CSSProperties = { position: 'absolute', left: 4, width: 6, borderLeft: `2px solid ${MARK_LINE}`, borderTop: `2px solid ${MARK_LINE}`, borderBottom: `2px solid ${MARK_LINE}` };
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone frozen={{ scroll: 0, hidden: 0 }} scale={0.45} measureId="ah-place-head" decor={<span aria-hidden style={{ ...bracket, top: 140, height: 236 }} />} />
          <Cap strong="원장 머리">
            <MeasuredText target="ah-place-head" template="월 · 총액 · 소비 요약 · 주 달력이 한 덩어리({h}px)로 숨는다" />
          </Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <LedgerPhone frozen={{ scroll: 0, hidden: 0 }} scale={0.45} header={<FilterHead />} />
          <Cap strong="필터를 걸었을 때">같은 자리에 나오는 필터 칩 줄도 같은 머리다</Cap>
        </div>
      </div>
    </Panel>
  );
};

const KeepGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <Verdict ok note="상단 바(가계부)와 Line Tabs 는 그 자리 — 숨는 것은 원장 머리뿐이다. 하단 탭 바는 Bottom Navigation 규칙으로 줄어든다(이 부품이 아니다)">
        <LedgerPhone frozen={{ scroll: 900, hidden: 'all' }} scale={0.5} tabSize="compact" />
      </Verdict>
      <Verdict ok={false} note="상단 바 · Line Tabs 까지 숨기기 — 화면 이름과 묶음 이동이 사라진다(시트 · 대화상자 머리도 숨기지 않는다)">
        <LedgerPhone frozen={{ scroll: 900, hidden: 'all' }} scale={0.5} hideBars tabSize="compact" />
      </Verdict>
    </div>
  </Panel>
);

// ── 코드 미리보기 — scroll-auto-hide.md 의 코드 그대로 ──────
const ExLedger: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={24} bg="bg-layer-basement">
    <div style={{ display: 'flex', flexDirection: 'column', height: 560, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--p-stroke-neutral-weak)' }}>
      <AutoHideLedger look={AH()} tones={tones()} />
    </div>
  </CodePreview>
);

// 거르는 줄 — 거래 검색(40) · 카드 혜택(140). 600 내림 → 다 숨음, 조금 올리고 손을 떼면 50% 를 기준으로 다 숨거나 다 드러난다(Q-017-5 C)
function Frame({ cap, children }: { cap: string; children: ReactNode }) {
  return (
    <div className="flex w-[180px] shrink-0 flex-col items-center gap-2">
      {children}
      <Cap>{cap}</Cap>
    </div>
  );
}
const FilterGuide: Fig = ({ caption }) => {
  const sc = 0.46;
  const H = 600;
  return (
    <Figure caption={caption}>
      <div className="flex w-full flex-col items-center gap-6">
        <div className="max-w-full overflow-x-auto">
          <div className="mx-auto flex w-max items-start gap-3">
            <Frame cap={`거래 검색 맨 위 — 줄 ${SEARCH_ROW_H}`}>
              <SearchPhone scale={sc} h={H} />
            </Frame>
            <Frame cap="600 내림 — 줄이 다 숨는다">
              <SearchPhone scale={sc} h={H} scroll={600} hidden={SEARCH_ROW_H} />
            </Frame>
            <Frame cap={`30 올림 — ${Math.round((30 / SEARCH_ROW_H) * 100)}% 나옴 · 손을 떼면 다 드러난다`}>
              <SearchPhone scale={sc} h={H} scroll={570} hidden={0} />
            </Frame>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="mx-auto flex w-max items-start gap-3">
            <Frame cap={`카드 혜택 맨 위 — 줄 ${CARD_ROW_H}`}>
              <CardBenefitPhone scale={sc} h={H} />
            </Frame>
            <Frame cap={`30 올림 — ${Math.round((30 / CARD_ROW_H) * 100)}% · 손을 떼면 다시 숨는다`}>
              <CardBenefitPhone scale={sc} h={H} scroll={570} hidden={CARD_ROW_H} />
            </Frame>
            <Frame cap={`${CARD_ROW_H / 2} 올림 — 50% · 손을 떼면 200ms 에 다 드러난다`}>
              <CardBenefitPhone scale={sc} h={H} scroll={600 - CARD_ROW_H / 2} hidden={0} />
            </Frame>
          </div>
        </div>
      </div>
    </Figure>
  );
};

export const scrollAutoHideFigures: Record<string, Fig> = {
  'filter-guide': FilterGuide,
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  follow: Follow,
  reduced: Reduced,
  'place-guide': PlaceGuide,
  'keep-guide': KeepGuide,
  'ex-ledger': ExLedger,
};
