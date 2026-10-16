// Card 페이지의 그림 — specs/components/card.md 의 `[그림: …](../../site/components/specs/card.tsx#<id>)` 자리.
// 카드 면 · 머리 · 지표 · 증감 · 순자산 카드는 card.yaml 을 푼 값(cardLook — data-card-view)으로, 카드 안 목록은 list.yaml(ListView)로,
// 화면 틀은 kit · nav-screens 로 그린다. 화면 예시는 Desk 홈(순자산 · 지표 · 오늘 쓴 돈)이고 내용은 지어낸 것이다.
// 치수 표시(분홍)는 카드 밖 감싼 상자 기준으로 둔다 — 카드는 모서리 밖을 자른다(overflow hidden).
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { CardActionView, CardHeaderView, CardSurface, HeroCardView, StatView } from './data-card-view';
import { CardPlayground, ExHeroDemo, ExListDemo, ExPressDemo, ExStatDemo } from './data-card-play';
import { toggleLook } from './input-look';
import { ToggleView } from './toggle-view';
import { contrastPair } from './data-contrast';
import { AccordionCard } from './card-accordion';
import { NET_WORTH, STATS, TODAY } from './data-data';
import { BudgetCard, CL, DimH, DimV, EDGE, Floor, GuideV, HomeDesktop, HomePhone, ListCard, MODES, ModeLabel, NetWorth, PINK, SCREEN_W, StatCard, pinkFill, spendRow, won, type Fig } from './data-screens';
import { resultSectionLook } from './feedback-look';
import { ResultSectionView } from './feedback-view';
import { Phone, Sheet, Verdict, rc, type Mode } from './kit';
import { listLook } from './list-look';
import { ListView } from './list-view';
import { loadingKit } from './loading-look';
import { SkeletonView } from './loading-view';
import { Cap, CodePreview, Legend, pinAt } from './nav-screens';

const W = SCREEN_W - EDGE * 2; // 폰 카드 폭 312
const Wrap = ({ children, gap = 'gap-6', align = 'items-start' }: { children: ReactNode; gap?: string; align?: string }) => <div className={`flex flex-wrap justify-center ${gap} ${align}`}>{children}</div>;
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
// 감싼 상자 기준 핀(카드 모서리 밖으로 나가도 잘리지 않게)
const At = ({ n, x, y }: { n: string; x: number | string; y: number | string }) => pinAt(n, { left: x, top: y });
const statH = () => {
  const c = CL();
  const s = c.stat;
  return c.surface.borderW * 2 + c.surface.pad * 2 + parseFloat(s.label.lineHeight) + s.value.marginTop + parseFloat(s.value.sizes.large.lineHeight) + s.delta.marginTop + parseFloat(s.delta.type.lineHeight);
};

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col gap-2">
          <ModeLabel mode={mode} />
          <Wrap gap="gap-4">
            <Col>
              <HomeDesktop mode={mode} s={0.45} h={600} />
            </Col>
            <Col>
              <HomePhone mode={mode} scale={0.5} h={900} />
            </Col>
          </Wrap>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <CardPlayground look={CL()} sk={loadingKit('desk').skeleton} result={resultSectionLook('desk')} toggle={toggleLook()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const c = CL();
  const b = c.surface.borderW;
  const p = c.surface.pad;
  const tl = parseFloat(c.title.lineHeight);
  const lh = c.header.list;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Floor gap={16} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', width: W }}>
            <CardSurface look={c}>
              <CardHeaderView look={c} title="10월 식비 예산" action="관리" marks={{ title: box, action: box }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: c.content.gap, ...box }}>
                <StatView look={c} label="남은 돈" value={won(115600)} />
                <span style={{ display: 'block', height: 8, borderRadius: 9999, background: rc('bg-neutral-weak') }}>
                  <span style={{ display: 'block', width: '77%', height: 8, borderRadius: 9999, background: rc('fg-neutral') }} />
                </span>
              </div>
            </CardSurface>
            <At n="ⓐ" x={-10} y={-10} />
            <At n="ⓒ" x={-10} y={b + p + 1} />
            <At n="ⓓ" x={W - b - p - 14} y={b + p - 16} />
            <At n="ⓔ" x={-10} y={b + p + tl + c.header.padBottom + 16} />
          </div>
          <div style={{ position: 'relative', width: W }}>
            <ListCard marks={{ header: box, list: box }} />
            <At n="ⓑ" x={-10} y={b + lh.top - 4} />
            <At n="ⓕ" x={-10} y={b + lh.top + tl + lh.bottom + 8} />
          </div>
        </Floor>
        <Legend
          items={[
            ['ⓐ', 'Root — 바닥 위 흰 면 + 1px 테두리'],
            ['ⓑ', 'Header'],
            ['ⓒ', 'Title'],
            ['ⓓ', 'Header Action'],
            ['ⓔ', 'Content'],
            ['ⓕ', 'List — 줄이 가장자리까지'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const Surface: Fig = ({ caption }) => {
  const c = CL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Col strong="데스크톱" cap={`바닥 bg-layer-basement 위 흰 면 + ${c.surface.borderW}px stroke-neutral-weak, 그림자 없음 — 면 ↔ 바닥 ${contrastPair('bg-layer-default', 'bg-layer-basement')}`} w={560}>
          <HomeDesktop mode="light" s={0.45} h={600} />
        </Col>
        <Wrap gap="gap-5">
          <Col strong="폰" cap="폰도 바닥이 회색 — 흰 바탕 평면 묶음 · raised 를 두지 않는다" w={240}>
            <HomePhone mode="light" scale={0.5} h={900} />
          </Col>
          <Col strong="다크" cap={`같은 규칙 — 면 ↔ 바닥 ${contrastPair('bg-layer-default', 'bg-layer-basement', 'dark')}, 선이 경계를 맡는다`} w={240}>
            <HomePhone mode="dark" scale={0.5} h={900} />
          </Col>
        </Wrap>
      </div>
    </Panel>
  );
};

const RadiusGap: Fig = ({ caption }) => {
  const c = CL();
  const r = c.surface.radius;
  const h = statH();
  return (
    <Panel caption={caption}>
      <Wrap>
        <Col strong="쌓은 카드 — 폰" cap={`모서리 ${r} · 카드 사이 ${c.surface.gap}(SEED "8px Gap") · 화면 끝 ${EDGE}`} w={300}>
          <Floor style={{ width: SCREEN_W, position: 'relative' }}>
            <StatCard i={0} />
            <StatCard i={1} />
            {/* 모서리 — 왼쪽 위 사분원 */}
            <span aria-hidden className="pointer-events-none absolute" style={{ left: EDGE, top: EDGE, width: r, height: r, borderTopLeftRadius: r, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 0, borderBottomWidth: 0, borderStyle: 'solid', borderColor: PINK, zIndex: 25 }} />
            <span aria-hidden className="pointer-events-none absolute whitespace-nowrap rounded px-1.5 text-[10px] font-bold leading-[15px] text-white" style={{ left: EDGE + r + 4, top: EDGE - 7, background: PINK, zIndex: 26 }}>
              모서리 {r}
            </span>
            <DimV at={{ left: SCREEN_W / 2, top: EDGE + h }} h={c.surface.gap} label={`${c.surface.gap}`} />
          </Floor>
        </Col>
        <Col strong="데스크톱 격자" cap={`나란한 칸 사이 layout-gutter ${c.gutter}`} w={300}>
          <Floor style={{ width: 600, position: 'relative', flexDirection: 'row', gap: c.gutter }}>
            <StatCard i={0} />
            <StatCard i={1} />
            <DimH at={{ left: (600 - c.gutter) / 2, top: EDGE + h / 2 }} w={c.gutter} label={`${c.gutter}`} />
          </Floor>
        </Col>
      </Wrap>
    </Panel>
  );
};

// 여백 — 카드 24 = List 줄 24 = 시트 24. 분홍 점선은 글자가 시작하는 줄
const Padding: Fig = ({ caption }) => {
  const c = CL();
  const p = c.surface.pad;
  const lh = c.header.list;
  const row = c.list.look.faces.none.light.enabled.pad;
  return (
    <Panel caption={caption}>
      <Wrap>
        <Col strong="카드" cap={`글 · 지표 · 목록 카드 모두 안쪽 ${p} — 화면 끝 ${EDGE} + ${p} = ${EDGE + p} 에 글자가 선다(분홍 점선)`} w={340}>
          <Phone mode="light" title="홈" back={false} h={760} bg="bg-layer-basement" screenW={SCREEN_W} overlay={<><GuideV x={EDGE + p} top={96} bottom={0} /><GuideV x={SCREEN_W - EDGE - p} top={96} bottom={0} /></>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: c.surface.gap, paddingTop: 8, paddingLeft: EDGE, paddingRight: EDGE }}>
              <div style={{ position: 'relative' }}>
                <NetWorth mode="light" />
                <DimV at={{ left: '62%', top: 0 }} h={p} label={`위 ${p}`} />
                <DimH at={{ left: 0, top: '50%' }} w={p} label={`${p}`} />
              </div>
              <div style={{ position: 'relative' }}>
                <StatCard mode="light" i={0} />
                <DimH at={{ right: 0, top: '42%' }} w={p} label={`${p}`} />
                <DimV at={{ left: '62%', bottom: 0 }} h={p} label={`아래 ${p}`} />
              </div>
              <div style={{ position: 'relative' }}>
                <ListCard mode="light" rows={TODAY.slice(0, 2).map((s) => spendRow(s))} />
                <DimV at={{ left: '62%', top: 0 }} h={lh.top} label={`위 ${lh.top}`} />
                <DimH at={{ left: 0, bottom: row.y + 20 }} w={row.x} label={`줄 ${row.x}`} />
                <DimV at={{ left: '62%', bottom: 0 }} h={row.y + c.list.padBottom} label={`줄 ${row.y} + 카드 ${c.list.padBottom} = ${row.y + c.list.padBottom}`} />
              </div>
            </div>
          </Phone>
        </Col>
        <Col strong="시트" cap={`Bottom Sheet — 머리 위 · 좌우 ${EDGE}, 목록은 본문 좌우를 빼고 줄이 제 ${row.x}`} w={340}>
          <Phone
            mode="light"
            title="홈"
            back={false}
            h={560}
            bg="bg-layer-basement"
            screenW={SCREEN_W}
            overlay={
              <>
                <Sheet title="오늘 쓴 돈" mode="light">
                  <ListView look={listLook('desk')} mode="light" live={false} rows={TODAY.map((s) => spendRow(s))} />
                </Sheet>
                <GuideV x={EDGE} top={150} bottom={0} />
                <GuideV x={SCREEN_W - EDGE} top={150} bottom={0} />
              </>
            }
          >
            <span />
          </Phone>
        </Col>
      </Wrap>
    </Panel>
  );
};

const Header: Fig = ({ caption }) => {
  const c = CL();
  const a = c.action;
  const b = c.surface.borderW;
  const p = c.surface.pad;
  const tl = parseFloat(c.title.lineHeight);
  // 머리 줄 높이는 제목과 글 버튼 중 큰 쪽 — 작은 쪽이 가운데에 선다
  const row = Math.max(tl, a.h);
  const top = b + p + (row - a.h) / 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Floor style={{ width: W + EDGE * 2 + 110 }}>
          <div style={{ position: 'relative', width: W }}>
            <CardSurface look={c}>
              <CardHeaderView look={c} title="오늘 쓴 돈" action="전체 보기" actionHit />
              <div style={{ height: 40, borderRadius: 8, background: rc('bg-neutral-weak') }} />
            </CardSurface>
            <DimV at={{ left: W + 12, top }} h={a.h} label={`보이는 ${a.h}`} />
            <DimV at={{ left: W + 70, top: top - (a.touch - a.h) / 2 }} h={a.touch} label={`${a.touch}`} />
            <DimV at={{ left: b + p + 132, top: b + p + row }} h={c.header.padBottom} label={`${c.header.padBottom}`} />
          </div>
        </Floor>
        <Legend
          items={[
            ['제목', `${parseFloat(c.title.fontSize)} / ${tl} · ${c.title.fontWeight} · fg-neutral`],
            ['전체 보기', `글 버튼(SEED Text Button) ${parseFloat(a.type.fontSize)} · ${a.type.fontWeight} · fg-neutral-muted · 꺾쇠 없음`],
            ['보이는 상자', `${a.h} · 모서리 ${a.radius} · 좌우 ${a.padL} — 오른쪽 ${a.padR} 만큼 바깥으로 내어 글자 끝이 여백 선에`],
            ['누르는 영역', `${a.touch}(분홍 칸)`],
            ['머리 ↔ 본문', `${c.header.padBottom}`],
          ]}
        />
      </div>
    </Panel>
  );
};

// 메모 카드 — 카드를 누르면 열리고 고정 버튼이 따로(peers)
function MemoCard({ mode = 'auto', state }: { mode?: Mode; state?: 'pressed' | 'hovered' }) {
  const c = CL();
  return (
    <CardSurface look={c} mode={mode} press="peers" state={state} label="장보기 목록">
      {/* 제목 줄 오른쪽 고정 버튼(-mr-x2 · -mt-x2) — card.md 의 peers 코드와 같다 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: c.header.gap }}>
        <span style={{ fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: rc('fg-neutral', mode), minWidth: 0 }}>장보기 목록</span>
        {/* 고정 — 켜고 끄는 아이콘 단추(Toggle — toggle.yaml): 끔은 흐린 선 2, 바탕은 누를 때만 */}
        <ToggleView look={toggleLook()} mode={mode} state="enabled" icon="pin" ariaLabel="장보기 목록 고정" style={{ marginTop: -c.header.gap, marginRight: -c.header.gap }} />
      </div>
      <span style={{ fontFamily: c.stat.label.fontFamily, fontSize: c.stat.label.fontSize, lineHeight: c.stat.label.lineHeight, color: rc('fg-neutral-subtle', mode) }}>우유 · 계란 · 두부 · 대파</span>
    </CardSurface>
  );
}
const Press: Fig = ({ caption }) => {
  const c = CL();
  return (
    <Panel caption={caption}>
      <Wrap>
        <Col strong="카드 전체가 한 곳으로(whole)" cap={`위 기본 · 아래 누름 — 면 bg-layer-default-pressed + 카드 전체 ${c.press.distance}px 거리 축소`} w={320}>
          <Floor style={{ width: SCREEN_W }}>
            <BudgetCard press="whole" />
            <BudgetCard press="whole" state="pressed" />
          </Floor>
        </Col>
        <Col strong="대등한 동작이 있는 카드(peers)" cap="위 기본 · 아래 누름 — 면 색만, 고정 버튼이 제 누름을 가진다" w={320}>
          <Floor style={{ width: SCREEN_W }}>
            <MemoCard />
            <MemoCard state="pressed" />
          </Floor>
        </Col>
        <Col strong="순자산 카드(hero)" cap={`위 기본 · 아래 누름 — ${c.press.distance}px 거리 축소만. 브랜드 채움에는 누름 색 짝이 없어 면은 그대로`} w={320}>
          <Floor style={{ width: SCREEN_W }}>
            <HeroCardView look={c} label={NET_WORTH.label} amount={won(NET_WORTH.amount)} delta={NET_WORTH.delta} press="whole" />
            <HeroCardView look={c} label={NET_WORTH.label} amount={won(NET_WORTH.amount)} delta={NET_WORTH.delta} press="whole" state="pressed" />
          </Floor>
        </Col>
      </Wrap>
    </Panel>
  );
};

const ListCardFig: Fig = ({ caption }) => {
  const c = CL();
  const f = c.list.look.faces.none.light;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <Floor style={{ width: SCREEN_W }}>
          <ListCard rows={TODAY.map((s, i) => spendRow(s, i === 1 ? 'pressed' : undefined))} />
        </Floor>
        <Cap w={520}>
          누름 바탕은 좌우 {f.pressed.bg.insetX} 들어와 모서리 {c.list.itemRadius}(카드 {c.surface.radius} − {f.pressed.bg.insetX}) — 줄은 좌우 {f.enabled.pad.x} · 위아래 {f.enabled.pad.y}, 줄 사이 선은 두지 않는다
        </Cap>
      </div>
    </Panel>
  );
};

const Stat: Fig = ({ caption }) => {
  const c = CL();
  const L = c.stat.value.sizes.large;
  const S = c.stat.value.sizes.small;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Col strong="폰 — 한 줄에 하나" cap={`large — 숫자 ${parseFloat(L.fontSize)} / ${parseFloat(L.lineHeight)} · ${c.stat.value.weight}, 여백 ${c.surface.pad}`} w={320}>
          <Floor style={{ width: SCREEN_W }}>
            <StatCard i={0} />
            <StatCard i={1} />
          </Floor>
        </Col>
        <Col strong="데스크톱 격자 넷" cap={`small — 숫자 ${parseFloat(S.fontSize)} / ${parseFloat(S.lineHeight)}, 여백은 그대로 ${c.surface.pad} · 칸 사이 ${c.gutter}`} w={420}>
          <Floor style={{ width: 1000, flexDirection: 'row', gap: c.gutter }}>
            {[0, 1, 2, 3].map((i) => (
              <StatCard key={i} i={i} size="small" />
            ))}
          </Floor>
        </Col>
      </div>
    </Panel>
  );
};

const Delta: Fig = ({ caption }) => {
  const c = CL();
  const items: [string, number, { direction: 'up' | 'down' | 'flat'; value: string; text: string; srText?: string }][] = [
    ['이번 달 지출', 1240000, STATS[0].delta],
    ['이번 달 수입', 4200000, STATS[1].delta],
    ['순자산', 42898100, { direction: 'up', value: '1.8%', text: '지난달보다' }],
    ['삼성전자', 71200, { direction: 'up', value: '1.28%', text: '어제보다' }],
    ['남은 예산', 260000, { direction: 'flat', value: '', text: '지난달보다' }],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {MODES.map((mode) => (
          <Floor key={mode} mode={mode} style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: c.surface.gap }}>
            {items.map(([label, amount, d]) => (
              <div key={label} style={{ width: 224 }}>
                <StatCard mode={mode} label={label} amount={amount} delta={d} />
              </div>
            ))}
          </Floor>
        ))}
        <Cap>▲ fg-critical · ▼ fg-informative · 변화 없음 fg-neutral-subtle — 지출 · 수입 · 순자산 · 주식이 같은 규칙. 보조 기술에는 문장("지난달보다 12% 더 썼어요")으로 읽힌다</Cap>
      </div>
    </Panel>
  );
};

const HeroCard: Fig = ({ caption }) => {
  const c = CL();
  const h = c.hero;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wrap gap="gap-5">
          {MODES.map((mode) => {
            const start = mode === 'dark' ? h.start.dark : h.start.light;
            const end = mode === 'dark' ? h.end.dark : h.end.light;
            return (
              <Col key={mode} strong={mode === 'dark' ? '다크' : '라이트'} cap={`${start.toUpperCase()} → ${end.toUpperCase()} · ${h.angle}° · 흰 글자 ${contrastPair('static-white', start)} ~ ${contrastPair('static-white', end)}`} w={320}>
                <Floor mode={mode} style={{ width: SCREEN_W }}>
                  <HeroCardView look={c} mode={mode} label={NET_WORTH.label} amount={won(NET_WORTH.amount)} delta={NET_WORTH.delta} />
                </Floor>
              </Col>
            );
          })}
        </Wrap>
        <Legend
          items={[
            ['라벨', `${parseFloat(h.label.fontSize)} · ${h.label.fontWeight}`],
            ['금액', `${parseFloat(h.amount.fontSize)} / ${parseFloat(h.amount.lineHeight)} · ${h.amount.fontWeight}`],
            ['아래 글', `${parseFloat(h.detail.fontSize)} — 흰 ▲ · ▼ + 글`],
            ['장식 빛', `${h.glow.size} · 흰 22% → 지름의 ${h.glow.stop}% 에서 투명`],
            ['모서리 · 여백', `${h.radius} · ${h.pad}`],
          ]}
        />
      </div>
    </Panel>
  );
};

const States: Fig = ({ caption }) => {
  const c = CL();
  const states = ['enabled', 'hovered', 'pressed', 'focused'] as const;
  const ko = { enabled: '기본', hovered: '호버(웹)', pressed: '누름', focused: '포커스(웹)' };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-5">
        <Wrap gap="gap-4">
          {states.map((s) => (
            <Col key={s} strong={ko[s]}>
              <Floor style={{ width: 268 }}>
                <StatCard i={0} press="whole" state={s} />
              </Floor>
            </Col>
          ))}
        </Wrap>
        <Wrap gap="gap-4">
          {states.map((s) => (
            <Col key={s} strong={`머리 동작 — ${ko[s]}`}>
              <div className="rounded-xl" style={{ width: 160, display: 'flex', justifyContent: 'center', background: rc('bg-layer-default'), paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
                <CardActionView look={c} label="전체 보기" title="오늘 쓴 돈" state={s} />
              </div>
            </Col>
          ))}
        </Wrap>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const FloorGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="회색 바닥 위 흰 면 — 면 · 테두리가 한 덩어리를 말한다">
        <Floor style={{ width: 296 }}>
          <StatCard i={0} />
        </Floor>
      </Verdict>
      <Verdict ok={false} note="흰 바탕(시트 · 흰 화면) 위 카드 — 면이 바탕과 같아 테두리만 남는다. 요약은 List 키-값 줄 · Callout">
        <div className="rounded-xl" style={{ width: 280, background: rc('bg-layer-default'), paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
          <StatCard i={0} />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

function ShadowStat({ raised = false }: { raised?: boolean }) {
  const c = CL();
  return (
    <CardSurface look={c} override={{ borderColor: 'transparent', boxShadow: raised ? 'var(--p-shadow-s3)' : 'var(--p-shadow-s1)' }}>
      <StatView look={c} label={STATS[0].label} value={won(STATS[0].amount)} delta={STATS[0].delta} />
    </CardSurface>
  );
}
const ShadowGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <Verdict ok note="테두리 카드 — 그림자 없음">
        <Floor style={{ width: 256 }}>
          <StatCard i={0} />
        </Floor>
      </Verdict>
      <Verdict ok={false} note="그림자 카드 — 면 ↔ 바닥이 거의 같아 옅은 그림자가 경계를 맡는다(다크에서 거의 안 보인다)">
        <Floor style={{ width: 256 }}>
          <ShadowStat />
        </Floor>
      </Verdict>
      <Verdict ok={false} note="raised — 흰 바탕 위 흰 카드를 그림자로만 가른다">
        <div className="rounded-xl" style={{ width: 240, background: rc('bg-layer-default'), paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
          <ShadowStat raised />
        </div>
      </Verdict>
    </div>
  </Panel>
);

const NestGuide: Fig = ({ caption }) => {
  const c = CL();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="지표 카드를 따로 — 폰은 한 줄에 하나">
          <Floor style={{ width: 296 }}>
            <StatCard i={0} />
            <StatCard i={1} />
          </Floor>
        </Verdict>
        <Verdict ok={false} note="카드 안에 테두리 상자를 또 — 어느 것이 한 덩어리인지 흐려진다">
          <Floor style={{ width: 296 }}>
            <CardSurface look={c}>
              <CardHeaderView look={c} title="이번 달" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[0, 1].map((i) => (
                  <CardSurface key={i} look={c} override={{ paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, borderRadius: 12 }}>
                    <StatView look={c} label={STATS[i].label} value={won(STATS[i].amount)} size="small" />
                  </CardSurface>
                ))}
              </div>
            </CardSurface>
          </Floor>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const HeaderGuide: Fig = ({ caption }) => {
  const c = CL();
  const lh = c.header.list;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`"전체 보기" 보이는 ${c.action.h} · 누르는 영역 ${c.action.touch}(분홍), 이름 "오늘 쓴 돈 전체 보기"`}>
          <Floor style={{ width: 316 }}>
            <CardSurface look={c} body="list">
              <CardHeaderView look={c} title="오늘 쓴 돈" action="전체 보기" body="list" actionHit />
              <ListView look={c.list.look} rows={TODAY.slice(0, 1).map((s) => spendRow(s))} live={false} bgRadius={c.list.itemRadius} />
            </CardSurface>
          </Floor>
        </Verdict>
        <Verdict ok={false} note="글자만큼인 링크(높이 18.6) — 손가락으로 맞추기 어렵다">
          <Floor style={{ width: 316 }}>
            <CardSurface look={c} body="list">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: lh.top, paddingLeft: lh.x, paddingRight: lh.x, paddingBottom: lh.bottom }}>
                <span style={{ fontFamily: c.title.fontFamily, fontSize: c.title.fontSize, lineHeight: c.title.lineHeight, fontWeight: c.title.fontWeight, color: rc('fg-neutral') }}>오늘 쓴 돈</span>
                <span style={{ fontFamily: c.action.type.fontFamily, fontSize: 13, lineHeight: '18.6px', fontWeight: 500, color: rc('fg-neutral-subtle'), background: pinkFill, outline: `1px dashed ${PINK}` }}>전체 보기</span>
              </div>
              <ListView look={c.list.look} rows={TODAY.slice(0, 1).map((s) => spendRow(s))} live={false} bgRadius={c.list.itemRadius} />
            </CardSurface>
          </Floor>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const DeltaGuide: Fig = ({ caption }) => {
  const c = CL();
  const s = c.stat;
  const L = s.value.sizes.large;
  // 나쁜 예 — 좋고 나쁨 색(지출이 늘면 빨강 · 순자산이 늘면 초록)
  const BadStat = ({ label, amount, dir, value, good }: { label: string; amount: number; dir: 'up' | 'down'; value: string; good: boolean }) => (
    <CardSurface look={c}>
      <span style={{ fontFamily: s.label.fontFamily, fontSize: s.label.fontSize, lineHeight: s.label.lineHeight, fontWeight: s.label.fontWeight, color: rc('fg-neutral-subtle') }}>{label}</span>
      <span style={{ marginTop: s.value.marginTop, fontFamily: L.fontFamily, fontSize: L.fontSize, lineHeight: L.lineHeight, fontWeight: s.value.weight, color: rc('fg-neutral'), fontVariantNumeric: 'tabular-nums' }}>{won(amount)}</span>
      <span style={{ marginTop: s.delta.marginTop, fontFamily: s.delta.type.fontFamily, fontSize: s.delta.type.fontSize, lineHeight: s.delta.type.lineHeight, fontWeight: s.delta.type.fontWeight, color: good ? 'var(--p-fg-positive)' : 'var(--p-fg-critical)' }}>
        {dir === 'up' ? '▲' : '▼'} {value} <span style={{ fontWeight: s.deltaText.fontWeight, color: rc('fg-neutral-subtle') }}>지난달보다</span>
      </span>
    </CardSurface>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="방향 색 — ▲ 빨강 · ▼ 파랑, 어디서나. 좋고 나쁨은 글이 말한다">
          <Floor style={{ width: 296 }}>
            <StatCard i={0} />
            <StatCard label="순자산" amount={42898100} delta={{ direction: 'up', value: '1.8%', text: '지난달보다' }} />
          </Floor>
        </Verdict>
        <Verdict ok={false} note="좋고 나쁨 색 — 지출 ▲ 빨강 · 순자산 ▲ 초록. 같은 화면의 주식(▲ 빨강 = 올랐다)과 뜻이 엇갈린다">
          <Floor style={{ width: 296 }}>
            <BadStat label="이번 달 지출" amount={1240000} dir="up" value="12%" good={false} />
            <BadStat label="순자산" amount={42898100} dir="up" value="1.8%" good />
          </Floor>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 카드마다 기다림 · 실패 — 틀 · 머리 · 라벨은 처음부터, 숫자 · 줄 자리만 Skeleton. 실패한 카드만 Result Section
const StatusGuide: Fig = ({ caption }) => {
  const c = CL();
  const sk = loadingKit('desk').skeleton;
  const r = resultSectionLook('desk');
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <div className="max-w-full overflow-x-auto">
          <Phone mode="light" title="홈" back={false} h={760} bg="bg-layer-basement" screenW={SCREEN_W}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: c.surface.gap, paddingTop: 8, paddingLeft: EDGE, paddingRight: EDGE }}>
              <CardSurface look={c} mode="light">
                <ResultSectionView look={r} mode="light" kind="failure" size="medium" inCard title="순자산을 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요." primary={{ label: '다시 시도' }} />
              </CardSurface>
              <CardSurface look={c} mode="light">
                <span style={{ fontFamily: c.stat.label.fontFamily, fontSize: c.stat.label.fontSize, lineHeight: c.stat.label.lineHeight, fontWeight: c.stat.label.fontWeight, color: rc('fg-neutral-subtle', 'light') }}>{STATS[0].label}</span>
                <span style={{ marginTop: c.stat.value.marginTop }}>
                  <SkeletonView look={sk} mode="light" text="t9" width={140} />
                </span>
              </CardSurface>
              <ListCard mode="light" />
            </div>
          </Phone>
        </div>
        <Cap w={520}>순자산 카드만 실패 + 다시 시도, 지출 카드는 숫자 자리만 기다리고, 오늘 쓴 돈은 보인다 — 화면 전체를 스켈레톤으로 되돌리지 않는다</Cap>
      </div>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — card.md 의 코드 그대로 ─────────────
const ExList: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={W} pad={24} bg="bg-layer-basement">
    <ExListDemo look={CL()} />
  </CodePreview>
);
const ExStat: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={720} pad={24} bg="bg-layer-basement">
    <ExStatDemo look={CL()} stats={STATS.slice(0, 2)} />
  </CodePreview>
);
const ExPress: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={W} pad={24} bg="bg-layer-basement">
    <ExPressDemo look={CL()} toggle={toggleLook()} />
  </CodePreview>
);
const ExHero: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={W} pad={24} bg="bg-layer-basement">
    <ExHeroDemo look={CL()} amount={won(NET_WORTH.amount)} />
  </CodePreview>
);

export const cardFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  surface: Surface,
  'radius-gap': RadiusGap,
  padding: Padding,
  header: Header,
  press: Press,
  'list-card': ListCardFig,
  'accordion-card': AccordionCard,
  stat: Stat,
  delta: Delta,
  'hero-card': HeroCard,
  states: States,
  'floor-guide': FloorGuide,
  'shadow-guide': ShadowGuide,
  'nest-guide': NestGuide,
  'header-guide': HeaderGuide,
  'delta-guide': DeltaGuide,
  'status-guide': StatusGuide,
  'ex-list': ExList,
  'ex-stat': ExStat,
  'ex-press': ExPress,
  'ex-hero': ExHero,
};
