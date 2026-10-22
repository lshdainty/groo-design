// Result Section 페이지의 그림 — specs/components/result-section.md 의 `[그림: …](../../site/components/specs/result-section.tsx#<id>)` 자리.
// 결과는 result-section.yaml 을 푼 값(resultSectionLook)으로, 버튼은 button.yaml(neutralWeak medium · ghost small · 바닥 버튼 large)로 그린다.
// large 는 화면 전체(폰 화면의 본문 영역), medium 은 카드 · 섹션 · 시트 안이다. 결과는 놓인 자리의 가로 · 세로 가운데에 선다.
import type { ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { resultSectionLook, snackbarLook, type ResultKind, type ResultSectionLook } from './feedback-look';
import { ResultDoneDemo, ResultEmptyDemo, ResultFailureDemo } from './feedback-demos';
import { ResultSectionPlayground } from './feedback-playground';
import { Band, FilterStrip, Legend, Muted, Pair, Pin, markBox, type Fig } from './feedback-screens';
import { ResultSectionView, type ResultSectionViewProps } from './feedback-view';
import { Card, Phone, Stat, Verdict, cardStack, rc, type Mode } from './kit';
import { Cap, cta, tf } from './select-screens';
import { SheetOverlay, SheetPanel } from './input-button-pickers';
import { PHONE_SAFE, ov } from './overlay-screens';
import { cardFace } from './card-face';

const rl = (brand: 'desk' | 'hr' = 'desk') => resultSectionLook(brand);
const px = (v: string) => parseFloat(v);

// 멈춘 결과 하나 — 수치 · 색은 resultSectionLook 에서
function R(p: Omit<ResultSectionViewProps, 'look'> & { look?: ResultSectionLook }) {
  const { look, ...rest } = p;
  return <ResultSectionView look={look ?? rl()} {...rest} />;
}

// 비교 페이지에서 고른 그대로의 글(2026-10-02)
const EMPTY = { kind: 'empty' as const, icon: 'receipt-text' as const, title: '이번 달 거래가 없어요', description: '거래를 기록하면 여기에 모여요.', primary: { label: '거래 추가' } };
const FAILURE = { kind: 'failure' as const, title: '거래를 불러오지 못했어요', description: '잠시 뒤 다시 시도해 주세요.', primary: { label: '다시 시도' } };
const DONE = { kind: 'done' as const, title: '1,204건을 가져왔어요', description: '건너뛴 줄 3 · 실패 0', primary: { label: '가계부로 가기' }, secondary: { label: '다른 파일 가져오기' } };
const NOT_FOUND = { kind: 'empty' as const, icon: 'search-x' as const, title: '페이지를 찾을 수 없어요', primary: { label: '홈으로' } };

// 화면 전체(large) — 폰 본문을 채운다
function ResultPhone({ mode, title, scale = 0.65, h = 620, tabs = true, bottom, overlay, children }: { mode: Mode; title?: string; scale?: number; h?: number; tabs?: boolean; bottom?: ReactNode; overlay?: ReactNode; children: ReactNode }) {
  return (
    <Phone title={title} back={!tabs} mode={mode} scale={scale} h={h} bg="bg-layer-default" tabs={tabs} bottom={bottom} overlay={overlay}>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </Phone>
  );
}
// 화면 일부(medium) — 홈의 카드 안
function HomePhone({ mode, scale = 0.65, h = 620, children }: { mode: Mode; scale?: number; h?: number; children: ReactNode }) {
  return (
    <Phone title="홈" back={false} mode={mode} scale={scale} h={h} bg="bg-layer-basement" tabs>
      {/* 회색 바닥 위 카드 — card.yaml(흰 면 + 1px 테두리 · 여백 24 · 지표 카드 · 목록 카드 머리) */}
      <div style={cardStack()}>
        <Card mode={mode}>
          <Stat mode={mode} label="10월 지출" value="412,300원" />
        </Card>
        <Card mode={mode} body="list" title="최근 거래" style={{ minHeight: 280 }}>
          {/* 카드 안 결과 — 결과 자리의 좌우 0, 목록 카드의 24 는 감싼 칸이 맡는다(result-section.yaml root.paddingX 비고) */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', paddingLeft: cardFace().head.x, paddingRight: cardFace().head.x }}>{children}</div>
        </Card>
      </div>
    </Phone>
  );
}

// ── Overview ──────────────────────────────────────────────
// 라이트 — 이번 달 거래 없음(large) · 불러오기 실패(medium 카드), 다크 — 가져오기 완료(large) · 불러오기 실패
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <ResultPhone mode="light" title="가계부">
          <R mode="light" size="large" {...EMPTY} />
        </ResultPhone>
        <HomePhone mode="light">
          <R mode="light" size="medium" inCard {...FAILURE} />
        </HomePhone>
      </div>
      <div className="flex items-start gap-4">
        <ResultPhone mode="dark" title="가져오기" tabs={false}>
          <R mode="dark" size="large" {...DONE} />
        </ResultPhone>
        <HomePhone mode="dark">
          <R mode="dark" size="medium" inCard {...FAILURE} />
        </HomePhone>
      </div>
    </div>
  </Figure>
);

const Playground: Fig = () => <ResultSectionPlayground looks={{ desk: rl('desk'), hr: rl('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-14 py-8">
      <div className="rounded-2xl py-6" style={{ width: 360, boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-subtle')}` }}>
        <R
          size="large"
          {...DONE}
          zone={{ asset: markBox, title: markBox, description: markBox, primary: markBox, secondary: markBox }}
          pins={{ asset: <Pin n="ⓐ" />, title: <Pin n="ⓑ" />, description: <Pin n="ⓒ" />, primary: <Pin n="ⓓ" />, secondary: <Pin n="ⓔ" /> }}
          pinLine={MARK_LINE}
        />
      </div>
      <Legend
        items={[
          ['ⓐ', 'Asset'],
          ['ⓑ', 'Title'],
          ['ⓒ', 'Description'],
          ['ⓓ', 'First Button'],
          ['ⓔ', 'Second Button'],
        ]}
      />
      <span className="max-w-[460px] text-center text-[12px] leading-5 pk-muted">가져오기 완료(large) — 아이콘 · 제목 · 설명 · 버튼 둘이 가운데로 쌓인다. 바탕은 놓인 자리의 것이다(결과 자체에는 바탕이 없다)</span>
    </div>
  </Figure>
);

// ── Properties ────────────────────────────────────────────
// 크기 둘 — 치수 표시(분홍): 좌우 48 · 위아래 16 · 아이콘 아래 16 · 제목–설명 · 버튼 위
function Measured({ size }: { size: 'large' | 'medium' }) {
  const l = rl();
  const s = l.sizes[size];
  const mark = (y: number) => `0 ${y}px 0 0 ${MARK}`;
  const overlay = (
    <>
      <Band style={{ left: 0, top: 0, bottom: 0, width: l.root.padX }} label={String(l.root.padX)} />
      <Band style={{ right: 0, top: 0, bottom: 0, width: l.root.padX }} />
      <Band style={{ left: l.root.padX, right: l.root.padX, top: 0, height: l.root.padY }} label={String(l.root.padY)} />
      <Band style={{ left: l.root.padX, right: l.root.padX, bottom: 0, height: l.root.padY }} />
    </>
  );
  return (
    <R
      size={size}
      {...(size === 'large' ? EMPTY : FAILURE)}
      overlay={overlay}
      zone={{ asset: { boxShadow: mark(l.asset.marginBottom) }, description: { boxShadow: mark(-s.descGap) }, actions: { boxShadow: mark(-s.actionsTop) } }}
      grow={false}
    />
  );
}
const Sizes: Fig = ({ caption }) => {
  const l = rl();
  const line = (size: 'large' | 'medium') => {
    const s = l.sizes[size];
    return `제목 ${px(s.title.fontSize)} / ${px(s.title.lineHeight)} · 설명 ${px(s.description.fontSize)} / ${px(s.description.lineHeight)} · 사이 ${s.descGap} · 버튼 위 ${s.actionsTop}`;
  };
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <div className="flex w-[344px] max-w-full flex-col gap-2">
          <div className="flex min-h-[420px] flex-col justify-center rounded-2xl pk-surface">
            <Measured size="large" />
          </div>
          <Cap strong="large(기본) — 화면 전체">{line('large')}</Cap>
        </div>
        <div className="flex w-[344px] max-w-full flex-col gap-2">
          <div className="flex flex-col rounded-2xl pk-surface">
            <Measured size="medium" />
          </div>
          <Cap strong="medium — 섹션 · 시트 안">{line('medium')}</Cap>
        </div>
        <div className="flex w-[344px] max-w-full flex-col gap-2">
          <div className="rounded-2xl pk-basement" style={{ ...cardStack(), paddingTop: 24, paddingBottom: 24 }}>
            <Card title="최근 거래">
              <R size="medium" inCard grow={false} {...FAILURE} />
            </Card>
          </div>
          <Cap strong="medium — 카드 안">결과 자리의 좌우 {l.root.padXInCard} — 카드 안 여백 {cardFace().pad} 이 가장자리를 맡는다(둘 다 두면 {cardFace().pad + l.root.padX})</Cap>
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] leading-5 text-fd-muted-foreground">
        두 크기 모두 좌우 {l.root.padX}(카드 안에서는 {l.root.padXInCard}) · 위아래 {l.root.padY} · 아이콘 {l.asset.size}(굵기 {l.asset.strokeWidth}) + 아래 {l.asset.marginBottom} — 첫 버튼 {l.primary.variant} {l.primary.size} {l.primary.height}, 둘째 버튼 {l.secondary.variant} {l.secondary.size} {l.secondary.height}. 버튼 사이 {l.actions.gap} — 둘째 버튼이 위아래로 {l.secondary.padY} 블리드해 글 자리만 차지하므로 상자 사이는 {l.actions.gap - l.secondary.padY}
      </p>
    </Panel>
  );
};

// 결과 셋 — 아이콘 색이 갈린다(비어 있음은 그 내용의 아이콘)
const KIND_TEXT: Record<ResultKind, Omit<ResultSectionViewProps, 'look'>> = {
  empty: { kind: 'empty', icon: 'search', title: '검색 결과가 없어요', description: '다른 말로 찾아 보세요.' },
  failure: { kind: 'failure', title: '불러오지 못했어요', description: '잠시 뒤 다시 시도해 주세요.', primary: { label: '다시 시도' } },
  done: { kind: 'done', title: '1,204건을 가져왔어요', description: '건너뛴 줄 3 · 실패 0', primary: { label: '가계부로 가기' } },
};
const Kinds: Fig = ({ caption }) => {
  const l = rl();
  const col = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-xl p-3" style={{ background: rc('bg-layer-basement', mode) }}>
        {(Object.keys(KIND_TEXT) as ResultKind[]).map((k) => (
          <div key={k} className="flex flex-col gap-1">
            {/* 카드 안의 결과 — 좌우는 카드 여백 24 만(결과 자리의 좌우 0) */}
            <Card mode={mode}>
              <R mode={mode} size="medium" inCard {...KIND_TEXT[k]} />
            </Card>
            <Muted mode={mode} className="px-1">
              <b>{k}</b> — {l.asset.color[k].name} {l.asset.color[k][mode].toUpperCase()}
            </Muted>
          </div>
        ))}
      </div>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>실패는 느낌표 · 완료는 체크(lucide 선) — 아이콘은 장식, 상태는 제목이 말한다</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {col('light')}
        {col('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 실패를 비어 있음으로 보이지 않는다
const FailureGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="불러오기 실패는 실패로 — 무엇을 불러오지 못했는지와 다시 시도">
        <ResultPhone mode="auto" title="가계부" scale={0.6}>
          <R size="medium" {...FAILURE} />
        </ResultPhone>
      </Verdict>
      <Verdict ok={false} note='불러오기에 실패했는데 "내역이 없어요" — 비어 있다고 믿으면 기록을 다시 넣거나 떠난다'>
        <ResultPhone mode="auto" title="가계부" scale={0.6}>
          <R size="large" {...EMPTY} title="내역이 없어요" />
        </ResultPhone>
      </Verdict>
    </Pair>
  </Panel>
);

// 버튼 — SEED 의 두 표(버튼의 위계 · 실패에서 나가는 길, 2026-10-22 사용자 결정 3B):
// 화면 전체의 핵심 행동은 바닥 버튼(Bottom CTA) · 그 상태를 푸는 동작은 안 버튼(Contained) · 잠깐 연 시트는 머리 ✕ · 돌아갈 곳이 없으면 홈으로
const SHEET_FAILURE = { kind: 'failure' as const, title: '혜택을 불러오지 못했어요', description: '잠시 뒤 다시 시도해 주세요.', primary: { label: '다시 시도' } };
const ButtonsGuide: Fig = ({ caption }) => {
  const cell = (strong: string, note: string, node: ReactNode) => (
    <div className="flex w-[198px] flex-col items-center gap-2">
      {node}
      <Cap strong={strong}>{note}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="mx-auto flex max-w-[420px] flex-wrap items-start justify-center gap-2">
        {cell(
          'Bottom CTA — 바닥 버튼',
          '화면 전체 결과 — 다음 여정의 핵심 행동은 바닥 버튼(Button large), 보조는 안 글 버튼',
          <ResultPhone mode="auto" title="가져오기" scale={0.55} tabs={false} bottom={cta('가계부로 가기', 'auto')}>
            <R size="large" {...DONE} primary={undefined} secondary={{ label: '다른 파일 가져오기' }} />
          </ResultPhone>,
        )}
        {cell(
          'Contained — 안 버튼',
          '화면 일부(카드 · 띠 안) — 그 상태를 푸는 동작은 결과 안 버튼',
          <HomePhone mode="auto" scale={0.55}>
            <R size="medium" inCard {...EMPTY} title="이번 달 거래가 없어요" />
          </HomePhone>,
        )}
        {cell(
          '✕ 닫기 — 잠깐 연 시트',
          '나가는 길은 시트 머리 ✕, 같은 일을 다시는 안 버튼 "다시 시도"',
          <ResultPhone
            mode="auto"
            title="지어낸카드 플러스"
            scale={0.55}
            tabs={false}
            overlay={
              <SheetOverlay ov={ov()} mode="auto">
                <SheetPanel ov={ov()} mode="auto" title="카드 혜택 불러오기" safe={PHONE_SAFE}>
                  <R size="medium" {...SHEET_FAILURE} grow={false} />
                </SheetPanel>
              </SheetOverlay>
            }
          >
            <span />
          </ResultPhone>,
        )}
        {cell(
          '홈으로',
          '없는 주소 · 바로 들어온 링크 — 돌아갈 곳이 없으면',
          <ResultPhone mode="auto" scale={0.55} tabs={false}>
            <R size="large" {...NOT_FOUND} />
          </ResultPhone>,
        )}
      </div>
    </Panel>
  );
};

// 비어 있는 까닭마다(2026-10-22 사용자 결정 2B) — 처음은 할 일 + 첫 버튼, 걸러서 0건은 조건 탓을 말하고 버튼 없이(지우기는 필터 바 맨 앞), 검색 0건은 검색어로
const FIRST = { kind: 'empty' as const, icon: 'receipt-text' as const, title: '아직 기록한 거래가 없어요', description: '거래를 기록하면 날짜별로 여기에 모여요.', primary: { label: '거래 추가' } };
const FILTERED = { kind: 'empty' as const, icon: 'funnel-x' as const, title: '조건에 맞는 거래가 없어요', description: '조건을 바꾸거나 지워 보세요.' };
const SEARCHED = { kind: 'empty' as const, icon: 'search-x' as const, title: "'지어낸마트'에 대한 검색 결과가 없어요", description: '가맹점 이름으로도 찾아보세요.' };
const EmptyGuide: Fig = ({ caption }) => {
  const cell = (strong: string, note: string, node: ReactNode) => (
    <div className="flex w-[198px] flex-col items-center gap-2">
      {node}
      <Cap strong={strong}>{note}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-center gap-2">
          {cell(
            '처음 — 하나도 없음',
            '할 일 + 첫 버튼',
            <ResultPhone mode="auto" title="가계부" scale={0.55}>
              <R size="large" {...FIRST} />
            </ResultPhone>,
          )}
          {cell(
            '걸러서 0건',
            '조건 탓을 제목이 말한다 · 버튼 없음 — 지우기는 필터 바 맨 앞',
            <ResultPhone mode="auto" title="가계부" scale={0.55}>
              <FilterStrip on />
              <R size="large" {...FILTERED} />
            </ResultPhone>,
          )}
          {cell(
            '검색 0건',
            '검색어로 — 할 수 있는 일 한 줄 · 버튼 없음',
            <ResultPhone mode="auto" title="거래 검색" scale={0.55} tabs={false}>
              <R size="medium" {...SEARCHED} />
            </ResultPhone>,
          )}
        </div>
        <Pair>
          <Verdict ok note="걸러서 0건 — 조건 탓이라고 말한다 · 지우기는 필터 바 맨 앞">
            <ResultPhone mode="auto" title="가계부" scale={0.5}>
              <FilterStrip on />
              <R size="large" {...FILTERED} />
            </ResultPhone>
          </Verdict>
          <Verdict ok={false} note='걸러서 0건에 "거래를 기록하면 여기에 모여요" + "거래 추가" — 할 일이 틀린다'>
            <ResultPhone mode="auto" title="가계부" scale={0.5}>
              <FilterStrip on />
              <R size="large" {...EMPTY} />
            </ResultPhone>
          </Verdict>
        </Pair>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExEmpty: Fig = () => <ResultEmptyDemo look={rl()} snack={snackbarLook()} field={tf().field} input={tf().input} cta={buttonLook({ variant: 'neutralSolid', size: 'large' })} />;
const ExFailure: Fig = () => <ResultFailureDemo look={rl()} />;
const ExDone: Fig = () => <ResultDoneDemo look={rl()} />;

export const resultSectionFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  kinds: Kinds,
  'failure-guide': FailureGuide,
  'buttons-guide': ButtonsGuide,
  'empty-guide': EmptyGuide,
  'ex-empty': ExEmpty,
  'ex-failure': ExFailure,
  'ex-done': ExDone,
};
