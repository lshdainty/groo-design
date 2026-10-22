// Divider 페이지의 그림 — specs/components/divider.md 의 `[그림: …](../../site/components/specs/divider.tsx#<id>)` 자리.
// 선은 divider.yaml 을 푼 값(display-look 의 dividerLook)으로, 목록 줄은 list.yaml(ListView)로 그린다.
// 크게 다른 내용 사이는 선이 아니라 회색 바탕(bg-layer-basement) 위 흰 층(bg-layer-default) 사이 8 간격이다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { DividerPlayground } from './display-playground';
import { DividerView } from './display-view';
import { Board, D, Header, Pair, PhoneBoard, Pin, Preview, Rows, Screen, TX, W, dk, modeKo, tone, txRow, type Brand } from './display-screens';
import { Cap } from './select-screens';
import { Verdict, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const dl = (brand: Brand = 'desk') => dk(brand).divider;
// 크게 다른 내용 사이 — 선이 아니라 바탕 층 사이 간격(divider.md "세 가지 나누기")
const GAP = 8;

// ── 화면 조각 ─────────────────────────────────────────────
function KV({ k, v, mode = 'auto', pad = 24 }: { k: string; v: string; mode?: Mode; pad?: number }) {
  return (
    <p className="flex justify-between text-[15px] leading-5" style={{ margin: 0, paddingTop: 12, paddingBottom: 12, paddingLeft: pad, paddingRight: pad }}>
      <span style={{ color: tone('fg-neutral-subtle', mode) }}>{k}</span>
      <span style={{ color: tone('fg-neutral', mode) }}>{v}</span>
    </p>
  );
}
// 거래 상세 — 머리(금액) · 끝까지 선 · 키-값 묶음(안은 들인 선) · 끝까지 선 · 메모
function TxDetail({ mode = 'auto', marks = false }: { mode?: Mode; marks?: boolean }) {
  const pin = (n: string, style: CSSProperties) => (marks ? <Pin n={n} style={style} /> : null);
  return (
    <div className="flex flex-col" style={{ background: tone('bg-layer-default', mode) }}>
      <div className="flex flex-col gap-1 px-6 pb-4 pt-2">
        <span className="text-[13px] leading-[18px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
          골목커피 강남역점
        </span>
        <span className="text-[24px] font-bold leading-8 tabular-nums" style={{ color: tone('fg-neutral', mode) }}>
          −5,600원
        </span>
      </div>
      <span className="relative flex flex-col">
        <D mode={mode} />
        {pin('ⓑ', { right: 8, top: -10 })}
      </span>
      <KV k="결제 수단" v="생활비 카드" mode={mode} />
      <span className="relative flex flex-col" style={{ marginLeft: 8, marginRight: 8 }}>
        <D mode={mode} inset />
        {pin('ⓐ', { right: -4, top: -10 })}
      </span>
      <KV k="할부" v="일시불" mode={mode} />
      <span className="flex flex-col" style={{ marginLeft: 8, marginRight: 8 }}>
        <D mode={mode} inset />
      </span>
      <KV k="카테고리" v="카페" mode={mode} />
      <D mode={mode} />
      <div className="flex flex-col gap-1 px-6 pb-4 pt-3">
        <span className="text-[14px] font-bold leading-5" style={{ color: tone('fg-neutral', mode) }}>
          메모
        </span>
        <span className="text-[14px] leading-5" style={{ color: tone('fg-neutral-subtle', mode) }}>
          팀 회의 전에 샀어요.
        </span>
      </div>
    </div>
  );
}
// 통계 세 칸 — 칸 사이 세로선(위아래 16 들임)
function Stats({ mode = 'auto', inset = true, pad = 0 }: { mode?: Mode; inset?: boolean; pad?: number }) {
  const cell = (k: string, v: string) => (
    <p className="flex flex-1 flex-col items-center text-center" style={{ margin: 0, paddingTop: 16, paddingBottom: 16, gap: 2 }}>
      <span className="text-[13px] leading-[18px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
        {k}
      </span>
      <span className="text-[15px] font-bold leading-5 tabular-nums" style={{ color: tone('fg-neutral', mode) }}>
        {v}
      </span>
    </p>
  );
  return (
    <div className="flex items-stretch" style={{ paddingLeft: pad, paddingRight: pad }}>
      {cell('수입', '320만원')}
      <D mode={mode} orientation="vertical" inset={inset} />
      {cell('지출', '148만원')}
      <D mode={mode} orientation="vertical" inset={inset} />
      {cell('남은 돈', '172만원')}
    </div>
  );
}
// 회색 바탕 위 흰 층 — 크게 다른 내용 사이는 8 간격
function Layer({ children, mode = 'auto', style }: { children: ReactNode; mode?: Mode; style?: CSSProperties }) {
  return (
    <div className="flex flex-col" style={{ background: tone('bg-layer-default', mode), ...style }}>
      {children}
    </div>
  );
}
function TxScreen({ mode, scale = 0.5, h = 560 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="거래 상세" mode={mode} scale={scale} h={h}>
      <TxDetail mode={mode} />
    </Screen>
  );
}
function StatsScreen({ mode, scale = 0.5, h = 560 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="10월 통계" mode={mode} scale={scale} h={h} bg="bg-layer-basement">
      <Layer mode={mode}>
        <Stats mode={mode} />
      </Layer>
      <Layer mode={mode} style={{ marginTop: GAP }}>
        <Header title="많이 쓴 곳" mode={mode} />
        <Rows mode={mode} rows={[txRow(TX.starbucks, mode), txRow(TX.lunch, mode)]} />
      </Layer>
    </Screen>
  );
}
function SettingsScreen({ mode, scale = 0.5, h = 560 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="설정" mode={mode} scale={scale} h={h} bg="bg-layer-basement">
      <Layer mode={mode}>
        <Header title="일반" mode={mode} />
        <Rows
          mode={mode}
          rows={[
            { kind: 'button', prefix: { icon: 'user' }, title: '계정', suffix: { chevron: true } },
            { kind: 'button', prefix: { icon: 'globe' }, title: '기본 통화', suffix: { text: '대한민국 원', chevron: true } },
          ]}
        />
      </Layer>
      <Layer mode={mode} style={{ marginTop: GAP }}>
        <Header title="알림" mode={mode} />
        <Rows
          mode={mode}
          rows={[
            { kind: 'switch', prefix: { icon: 'bell' }, title: '결제 알림', checked: true },
            { kind: 'switch', prefix: { icon: 'piggy-bank' }, title: '예산 알림', checked: false },
          ]}
        />
      </Layer>
    </Screen>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <SettingsScreen mode={mode} />
          <TxScreen mode={mode} />
          <StatsScreen mode={mode} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <DividerPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
function Inset({ w, label, vertical = false }: { w: number; label?: string; vertical?: boolean }) {
  return (
    <span aria-hidden className="relative flex shrink-0 items-center justify-center" style={vertical ? { height: w, width: 12, background: MARK } : { width: w, height: 12, background: MARK }}>
      {label && (
        <span className="absolute rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, ...(vertical ? { left: 14 } : { top: 14 }) }}>
          {label}
        </span>
      )}
    </span>
  );
}
const Anatomy: Fig = ({ caption }) => {
  const lk = dl();
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-8 pb-8 pt-10">
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
          <div className="flex w-[280px] flex-col gap-8">
            <div className="relative flex flex-col gap-2">
              <span className="text-[12px] leading-4 pk-muted">끝까지(full) — 기본</span>
              <D />
              <Pin n="ⓐ" style={{ right: -26, top: 14 }} />
            </div>
            <div className="flex flex-col gap-2 pb-4">
              <span className="text-[12px] leading-4 pk-muted">들임(inset) — 양끝 {lk.inset}</span>
              <span className="flex items-center">
                <Inset w={lk.inset} label={String(lk.inset)} />
                <span className="flex-1">
                  <DividerView look={lk} />
                </span>
                <Inset w={lk.inset} />
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] leading-4 pk-muted">세로(vertical) · 들임 — 위아래 {lk.inset}</span>
            <span className="flex h-[120px] w-[120px] flex-col items-center rounded-lg" style={{ boxShadow: `inset 0 0 0 1px ${tone('stroke-neutral-weak')}` }}>
              <Inset w={lk.inset} vertical label={String(lk.inset)} />
              <span className="flex flex-1">
                <DividerView look={lk} orientation="vertical" />
              </span>
              <Inset w={lk.inset} vertical />
            </span>
          </div>
        </div>
        <div className="text-[12px] leading-4 pk-muted">
          <b className="pk-text">ⓐ</b> Line — {lk.thickness}px · stroke-neutral-subtle · 바깥 여백 {lk.margin}(사이 간격은 쓰는 자리가 정한다)
        </div>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Orientation: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 md:grid-cols-2">
      {(['horizontal', 'vertical'] as const).map((o) => (
        <div key={o} className="flex min-w-0 flex-col gap-2">
          <Board pad={0} className="overflow-hidden" style={{ paddingTop: 4, paddingBottom: 4 }}>
            {o === 'horizontal' ? (
              <>
                <KV k="결제 수단" v="생활비 카드" />
                <D />
                <KV k="할부" v="일시불" />
              </>
            ) : (
              <Stats />
            )}
          </Board>
          <Cap strong={o === 'horizontal' ? 'horizontal — 기본' : 'vertical'}>{o === 'horizontal' ? '세로로 쌓인 내용 사이 — 부모 폭 전체, 높이 1' : '가로로 놓인 칸 사이 — 높이는 부모(flex)가 정한다, 폭 1'}</Cap>
        </div>
      ))}
    </div>
  </Panel>
);

const InsetFig: Fig = ({ caption }) => {
  const lk = dl();
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {[false, true].map((inset) => (
          <div key={String(inset)} className="flex min-w-0 flex-col gap-2">
            <Board pad={0} className="overflow-hidden" style={{ paddingTop: 4, paddingBottom: 4 }}>
              <KV k="결제 수단" v="생활비 카드" pad={16} />
              <span className="relative flex flex-col">
                <D inset={inset} />
                {inset && (
                  <>
                    <span aria-hidden className="absolute left-0" style={{ top: -6, width: lk.inset, height: 13, background: MARK }} />
                    <span aria-hidden className="absolute right-0" style={{ top: -6, width: lk.inset, height: 13, background: MARK }} />
                  </>
                )}
              </span>
              <KV k="할부" v="일시불" pad={16} />
            </Board>
            <Cap strong={inset ? `inset — 양끝 ${lk.inset}` : 'full — 끝까지(기본)'}>{inset ? '같은 묶음 안을 나눌 때' : '묶음 사이 · 액션 영역 위'}</Cap>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">화면 여백(24)에 붙은 목록 줄 사이는 Divider 가 아니라 List 의 줄 사이 선(들임 24 — 줄 글과 맞는다)이다</p>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const StrengthGuide: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-start justify-center gap-6">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <div className="w-[340px] overflow-hidden rounded-2xl" style={{ background: tone('bg-layer-basement', mode) }}>
              <TxDetail mode={mode} marks={mode === 'light'} />
              <div className="relative" style={{ height: GAP }}>
                {mode === 'light' && <Pin n="ⓒ" style={{ right: 8, top: -6 }} />}
              </div>
              <Layer mode={mode}>
                <Header title="같은 가게 거래" mode={mode} />
                <Rows mode={mode} rows={[txRow(TX.starbucks, mode)]} />
              </Layer>
            </div>
            <Cap strong={modeKo(mode)} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted">
        <span>
          <b className="pk-text">ⓐ 약함</b> 들인 선 — 같은 묶음 안
        </span>
        <span>
          <b className="pk-text">ⓑ 중간</b> 끝까지 선 — 묶음 사이
        </span>
        <span>
          <b className="pk-text">ⓒ 강함</b> {GAP} 간격 — 크게 다른 내용 사이(선이 아니다)
        </span>
      </div>
    </div>
  </Figure>
);

const NeededGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="줄의 위아래 여백이 줄을 가른다 — 선이 없는 것이 기본">
        <PhoneBoard>
          <Rows rows={[txRow(TX.starbucks), txRow(TX.lunch), txRow(TX.bus)]} />
        </PhoneBoard>
      </Verdict>
      <Verdict ok={false} note="줄마다 선 + 여백 — 화면이 촘촘한 칸처럼 보이고 무엇이 묶음인지 흐려진다">
        <PhoneBoard>
          <Rows rows={[txRow(TX.starbucks), txRow(TX.lunch), txRow(TX.bus)]} divider="full" />
        </PhoneBoard>
      </Verdict>
    </Pair>
  </Panel>
);

function DetailCard({ last }: { last: boolean }) {
  return (
    <Board pad={0} className="w-full max-w-[320px] overflow-hidden" style={{ paddingTop: 4 }}>
      <KV k="결제 수단" v="생활비 카드" />
      <span className="flex flex-col" style={{ marginLeft: 8, marginRight: 8 }}>
        <D inset />
      </span>
      <KV k="할부" v="일시불" />
      {last && <D />}
      <div style={{ height: 12 }} />
      {last && <D />}
    </Board>
  );
}
const LastGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="선은 내용 사이에만 — 마지막 줄 아래 · 카드 끝에는 없다">
        <W w={320}>
          <DetailCard last={false} />
        </W>
      </Verdict>
      <Verdict ok={false} note="마지막 줄 아래 · 카드 맨 아래에 선 — 나눌 것이 없는데 선이 남는다">
        <W w={320}>
          <DetailCard last />
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 예시(미리보기) — divider.md 의 코드 그대로 ────────
const ExBasic: Fig = ({ caption }) => (
  <Preview caption={caption} w={320}>
    <div className="flex flex-col text-[15px] leading-5 pk-text">
      <div className="flex flex-col">
        <p className="flex justify-between py-3" style={{ margin: 0 }}>
          결제 수단<span>생활비 카드</span>
        </p>
        <D inset />
        <p className="flex justify-between py-3" style={{ margin: 0 }}>
          할부<span>3개월</span>
        </p>
      </div>
      <D />
      <section aria-labelledby="ex-divider-memo" className="flex flex-col gap-1 pt-3">
        <span id="ex-divider-memo" className="text-[14px] font-bold">
          메모
        </span>
        <span className="text-[14px] pk-muted">…</span>
      </section>
    </div>
  </Preview>
);
const ExVertical: Fig = ({ caption }) => (
  <Preview caption={caption} w={340}>
    <div className="flex items-stretch text-[14px] leading-5 pk-text">
      <p className="flex-1 text-center" style={{ margin: 0, paddingTop: 16, paddingBottom: 16 }}>
        수입
        <br />
        3,200,000원
      </p>
      <D orientation="vertical" inset />
      <p className="flex-1 text-center" style={{ margin: 0, paddingTop: 16, paddingBottom: 16 }}>
        지출
        <br />
        1,486,200원
      </p>
      <D orientation="vertical" inset />
      <p className="flex-1 text-center" style={{ margin: 0, paddingTop: 16, paddingBottom: 16 }}>
        남은 돈
        <br />
        1,713,800원
      </p>
    </div>
  </Preview>
);

export const dividerFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  orientation: Orientation,
  inset: InsetFig,
  'strength-guide': StrengthGuide,
  'needed-guide': NeededGuide,
  'last-guide': LastGuide,
  'ex-basic': ExBasic,
  'ex-vertical': ExVertical,
};
