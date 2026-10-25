// Swipe Actions 페이지의 그림 — specs/components/swipe-actions.md 의 `[그림: …](../../site/components/specs/swipe-actions.tsx#<id>)` 자리.
// 트레이는 swipe-actions.yaml 을 푼 값(swipeKit — data-swipe-view)으로, 감싼 줄은 list.yaml(ListView), 줄을 눌러 들어간 상세는 bottom-sheet.yaml ·
// button.yaml, 확인 창은 alert-dialog.yaml 로 그린다. 목록 줄에는 ⋮ 를 두지 않는다(menu.md "줄의 동작", 2026-10-25). 가계부 · 메모 · 계좌 줄은 지어낸 것이다.
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { contrastPair } from './data-contrast';
import { LEDGER, MEMO_ACTIONS, TX_ACTIONS, type TxRow } from './data-data';
import { DimH, DimV, MODES, ModeLabel, PINK, SCREEN_W, SW, type Fig } from './data-screens';
import { formatWon, trayWidth } from './data-shared';
import { LedgerSwipeDemo } from './data-swipe-play';
import { SwipeRowStatic, SwipeTrayView, type SwipeAct } from './data-swipe-view';
import { AlertBox, Phone, Verdict, rc, type Mode } from './kit';
import { listLook } from './list-look';
import type { RowSpec } from './list-shared';
import { ListView } from './list-view';
import { rowDims } from './loading-screens';
import { Arrow, Cap, CodePreview, DeskHeader, Desktop, Legend, ScreenTitle, Shell, Side, pinAt } from './nav-screens';
import { DeleteFooter, DetailSheet, SheetOn, overlayKit } from './overlay-screens';

const Wrap = ({ children, gap = 'gap-6' }: { children: ReactNode; gap?: string }) => <div className={`flex flex-wrap items-start justify-center ${gap}`}>{children}</div>;
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col gap-4 md:flex-row">{children}</div>;
const Col = ({ children, cap, strong, w }: { children: ReactNode; cap?: ReactNode; strong?: ReactNode; w?: number }) => (
  <div className="flex min-w-0 max-w-full flex-col items-center gap-2">
    <div className="max-w-full overflow-x-auto">{children}</div>
    {(cap || strong) && (
      <Cap strong={strong} w={w}>
        {cap}
      </Cap>
    )}
  </div>
);
const box: CSSProperties = { outline: `1px dashed ${PINK}`, outlineOffset: -1 };
const ROW_H = () => rowDims().height;
const acts = (list = TX_ACTIONS): SwipeAct[] => list.map((a) => ({ value: a.value, kind: a.kind, label: a.label, icon: a.icon }));
// 가계부 줄 — 앞 타일 · 제목 · 설명 · 금액. 줄 끝 ⋮ 는 두지 않는다 — 같은 동작은 줄을 눌러 들어간 상세에(2026-10-25)
function txRow(r: TxRow): RowSpec {
  return {
    kind: 'button',
    prefix: { tile: r.tile, icon: r.icon },
    title: r.title,
    detail: r.detail,
    suffix: { amount: r.amount > 0 ? `+${formatWon(r.amount)}` : formatWon(r.amount) },
  };
}
const Row = ({ r, mode = 'auto' }: { r: TxRow; mode?: Mode }) => <ListView look={listLook('desk')} rows={[txRow(r)]} mode={mode} live={false} />;
// 가계부 목록 — 첫 줄을 밀어 둔 모습(swiped)
function LedgerList({ mode = 'auto', swiped = 0, actions = acts(), n = 5, states, bad }: { mode?: Mode; swiped?: number | null; actions?: SwipeAct[]; n?: number; states?: Parameters<typeof SwipeRowStatic>[0]['states']; bad?: Parameters<typeof SwipeRowStatic>[0]['bad'] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {LEDGER.slice(0, n).map((r, i) =>
        i === swiped ? (
          <SwipeRowStatic key={r.id} look={SW()} mode={mode} actions={actions} rowLabel={r.title} rowHeight={ROW_H()} states={states} bad={bad} bg={rc('bg-layer-default', mode)}>
            <Row r={r} mode={mode} />
          </SwipeRowStatic>
        ) : (
          <Row key={r.id} r={r} mode={mode} />
        ),
      )}
    </div>
  );
}
function LedgerPhone({ mode = 'auto', scale = 0.62, h = 600, overlay, children }: { mode?: Mode; scale?: number; h?: number; overlay?: ReactNode; children?: ReactNode }) {
  return (
    <Phone title="가계부" back={false} mode={mode} scale={scale} h={h} screenW={SCREEN_W} bg="bg-layer-default" overlay={overlay}>
      <div style={{ paddingTop: 4 }}>{children ?? <LedgerList mode={mode} />}</div>
    </Phone>
  );
}
function TrayOnly({ mode = 'auto', actions = acts(MEMO_ACTIONS), states, zoom = 1, marks, pins, bad }: { mode?: Mode; actions?: SwipeAct[]; states?: Parameters<typeof SwipeTrayView>[0]['states']; zoom?: number; marks?: Parameters<typeof SwipeTrayView>[0]['marks']; pins?: Parameters<typeof SwipeTrayView>[0]['pins']; bad?: Parameters<typeof SwipeTrayView>[0]['bad'] }) {
  return (
    <div style={{ zoom, display: 'inline-flex', borderRadius: 12, background: rc('bg-layer-default', mode), paddingRight: 0 }}>
      <SwipeTrayView look={SW()} mode={mode} actions={actions} height={ROW_H()} rowLabel="장보기 목록" states={states} marks={marks} pins={pins} bad={bad} />
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Wrap gap="gap-5">
      {MODES.map((mode) => (
        <Col key={mode} strong={<ModeLabel mode={mode} />}>
          <LedgerPhone mode={mode} scale={0.7} h={560} />
        </Col>
      ))}
    </Wrap>
  </Panel>
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const s = SW();
  const tw = trayWidth(s, 2);
  const h = Math.max(ROW_H(), s.rowMin);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Col>
          <div style={{ position: 'relative', width: SCREEN_W, paddingTop: 16, paddingBottom: 30 }}>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: rc('bg-layer-default') }}>
              <SwipeRowStatic look={s} actions={acts()} rowLabel={LEDGER[0].title} rowHeight={ROW_H()} marks={{ track: box, action: box }} rowMark={box}>
                <Row r={LEDGER[0]} />
              </SwipeRowStatic>
            </div>
            {pinAt('ⓐ', { left: 4, top: 6 })}
            {pinAt('ⓑ', { left: SCREEN_W - tw - 12, top: 6 })}
            {pinAt('ⓒ', { left: SCREEN_W - tw + s.first.lead - 4, top: 6 })}
            <DimH at={{ left: SCREEN_W - tw, top: 16 + h + 6 }} w={s.first.lead} label={`${s.first.lead}`} />
            <DimH at={{ left: SCREEN_W - tw + s.first.width, top: 16 + h + 6 }} w={s.rest.lead} label={`${s.rest.lead}`} />
          </div>
        </Col>
        <Legend
          items={[
            ['ⓐ', 'Row — 감싼 줄(높이 · 여백 · 바탕은 원래 줄)'],
            ['ⓑ', 'Track — 바탕을 칠하지 않는다'],
            ['ⓒ', 'Action — 원형 배지 + 라벨'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const Kinds: Fig = ({ caption }) => {
  const s = SW();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wrap gap="gap-5">
          {MODES.map((mode) => (
            <Col key={mode} strong={<ModeLabel mode={mode} />}>
              {/* 트레이만 — 줄 바탕(bg-layer-default) 위 세 칸. 줄은 왼쪽으로 밀려 나갔다 */}
              <div style={{ width: SCREEN_W, display: 'flex', justifyContent: 'flex-end', borderRadius: 12, overflow: 'hidden', background: rc('bg-layer-default', mode) }}>
                <TrayOnly mode={mode} />
              </div>
            </Col>
          ))}
        </Wrap>
        <Legend
          items={[
            ['고정(neutral)', `bg-neutral-weak + 안쪽 ${s.kinds.neutral.border?.width}px stroke-neutral-weak · 아이콘 fg-neutral · 라벨 fg-neutral-muted`],
            ['수정(primary)', `fg-informative 배지 + 반전 아이콘 — 줄 바탕과 ${contrastPair('fg-informative', 'bg-layer-default')} · 다크 ${contrastPair('fg-informative', 'bg-layer-default', 'dark')}`],
            ['삭제(destructive)', `fg-critical 배지 · 라벨도 fg-critical — ${contrastPair('fg-critical', 'bg-layer-default')} · 다크 ${contrastPair('fg-critical', 'bg-layer-default', 'dark')}, 가장 안쪽`],
          ]}
        />
      </div>
    </Panel>
  );
};

const Size: Fig = ({ caption }) => {
  const s = SW();
  const z = 1.6;
  const h = Math.max(ROW_H(), s.rowMin);
  const tw = trayWidth(s, 3);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Col>
          {/* 치수 글이 판 안에 들도록 — 위 칸 폭 글 · 오른쪽 줄 높이 글의 자리를 비운다 */}
          <div style={{ position: 'relative', paddingLeft: 30, paddingRight: 70, paddingTop: 44, paddingBottom: 36 }}>
            <div style={{ position: 'relative', width: tw * z, height: h * z }}>
              <TrayOnly zoom={z} />
              <DimH at={{ left: 0, top: -14 }} w={s.first.width * z} label={`첫 칸 ${s.first.width}`} below={false} />
              <DimH at={{ left: s.first.width * z, top: -14 }} w={s.rest.width * z} label={`${s.rest.width}`} below={false} />
              <DimH at={{ left: (s.first.width + s.rest.width) * z, top: -14 }} w={s.rest.width * z} label={`${s.rest.width}`} below={false} />
              <DimH at={{ left: 0, top: h * z + 8 }} w={s.first.lead * z} label={`앞 ${s.first.lead}`} />
              <DimH at={{ left: s.first.width * z, top: h * z + 8 }} w={s.rest.lead * z} label={`사이 ${s.rest.lead}`} />
              <DimV at={{ left: tw * z + 8, top: 0 }} h={h * z} label={`줄 ${h}`} />
            </div>
          </div>
        </Col>
        <Legend
          items={[
            ['배지', `${s.badge.size} · 원형`],
            ['아이콘', `${s.icon}`],
            ['라벨', `${parseFloat(s.label.fontSize)} / ${s.label.fontWeight} / ${s.label.lineHeight}`],
            ['배지 ↔ 라벨', `${s.gap}`],
            ['높이', `줄을 따른다 — ${s.rowMin} 보다 낮으면 ${s.rowMin}`],
            ['트레이', `하나 ${trayWidth(s, 1)} · 둘 ${trayWidth(s, 2)} · 셋 ${trayWidth(s, 3)}`],
          ]}
        />
      </div>
    </Panel>
  );
};

const States: Fig = ({ caption }) => {
  const ko = { enabled: '기본', pressed: '누름(호버 같음)', focused: '포커스', disabled: '막힘' } as const;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <Wrap gap="gap-4">
          {(['enabled', 'pressed', 'focused', 'disabled'] as const).map((st) => (
            <Col key={st} strong={ko[st]}>
              <TrayOnly actions={acts()} states={{ edit: st, delete: st }} />
            </Col>
          ))}
        </Wrap>
        <Cap w={520}>누름 · 호버는 배지 · 라벨 밝기 {Math.round(SW().brightness * 100)}% — 움직이지 않는다. 포커스는 칸 안쪽 {SW().ring.width}px 링, 막힘은 bg-disabled · fg-disabled(흐리게 하지 않는다)</Cap>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const MoreGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Col strong="밀어 연 트레이(지름길)" w={240}>
        <LedgerPhone scale={0.62} h={560} />
      </Col>
      <Col strong="줄을 누르면 상세(늘 있는 길)" cap="같은 동작 · 같은 이름 · 같은 확인 창 — 바닥 왼쪽 [삭제] · [수정]. 동작이 더 많으면 머리 ⋮ → Menu Sheet" w={240}>
        <LedgerPhone
          scale={0.62}
          h={560}
          overlay={
            <SheetOn mode="auto">
              <DetailSheet mode="auto" footer={<DeleteFooter mode="auto" primary="수정" />} />
            </SheetOn>
          }
        >
          <LedgerList swiped={null} />
        </LedgerPhone>
      </Col>
    </div>
  </Panel>
);

const CountGuide: Fig = ({ caption }) => {
  const four: SwipeAct[] = [
    { value: 'pin', kind: 'neutral', label: '고정', icon: 'pin' },
    { value: 'share', kind: 'neutral', label: '공유', icon: 'share' },
    { value: 'edit', kind: 'primary', label: '수정', icon: 'pencil' },
    { value: 'delete', kind: 'destructive', label: '삭제', icon: 'trash' },
  ];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="동작 둘 — 무엇을 미는지 줄이 보인다. 나머지는 줄을 눌러 들어간 상세에만">
          <div style={{ width: SCREEN_W - 40, overflow: 'hidden', borderRadius: 12, background: rc('bg-layer-default') }}>
            <LedgerList n={2} />
          </div>
        </Verdict>
        <Verdict ok={false} note="넷 — 트레이가 줄 폭을 먹어 무엇을 미는지 안 보인다">
          <div style={{ width: SCREEN_W - 40, overflow: 'hidden', borderRadius: 12, background: rc('bg-layer-default') }}>
            <LedgerList n={2} actions={four} />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const ConfirmGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Col strong="삭제를 누른다" w={220}>
        <LedgerPhone scale={0.6} h={540}>
          <LedgerList states={{ delete: 'pressed' }} />
        </LedgerPhone>
      </Col>
      <Arrow label="트레이를 먼저 닫고" />
      <Col strong="상세와 같은 확인 창" cap="제목 · 설명은 그 줄을 아는 부르는 쪽이 넘긴다 — 확인 버튼은 누른 동작의 라벨(삭제)" w={260}>
        <LedgerPhone scale={0.6} h={540} overlay={<AlertBox title="거래 삭제" body={`${LEDGER[0].title} 거래를 지울까요?`} confirm="삭제" />}>
          <LedgerList swiped={null} />
        </LedgerPhone>
      </Col>
    </div>
  </Panel>
);

// 폰은 트레이 · 데스크톱은 줄만 — 둘 다 줄을 누르면 상세(목록 줄에는 ⋮ 를 두지 않는다)
const PlatformGuide: Fig = ({ caption }) => {
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-5">
        <Col strong={`폰(${SW().breakpoint} 미만)`} cap="밀기(지름길) · 줄을 누르면 상세" w={240}>
          <LedgerPhone scale={0.62} h={520} />
        </Col>
        <Col strong="데스크톱(1280 이상)" cap="트레이 없음 — 줄을 누르면 상세(동작이 여럿이면 상세 머리 ⋮ → Menu)" w={360}>
          <Desktop w={1280} h={560} s={0.42}>
            <Shell side={<Side current="ledger" />} header={<DeskHeader />}>
              <ScreenTitle>가계부</ScreenTitle>
              <div style={{ position: 'relative', paddingTop: 20, paddingLeft: 32, paddingRight: 32 }}>
                <div style={{ position: 'relative', width: 620, borderRadius: 16, background: rc('bg-layer-default'), paddingTop: 8, paddingBottom: 8 }}>
                  {LEDGER.slice(0, 4).map((r) => (
                    <Row key={r.id} r={r} />
                  ))}
                </div>
              </div>
            </Shell>
          </Desktop>
        </Col>
      </div>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — swipe-actions.md 의 코드 그대로 ────
const ExRow: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={SCREEN_W} pad={24} bg="bg-layer-basement">
    <LedgerSwipeDemo look={SW()} list={listLook('desk')} ov={overlayKit('desk')} rowHeight={ROW_H()} />
  </CodePreview>
);

export const swipeActionsFigures: Record<string, Fig> = {
  hero: Hero,
  anatomy: Anatomy,
  kinds: Kinds,
  size: Size,
  states: States,
  'more-guide': MoreGuide,
  'count-guide': CountGuide,
  'confirm-guide': ConfirmGuide,
  'platform-guide': PlatformGuide,
  'ex-row': ExRow,
};

