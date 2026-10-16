// Pagination 페이지의 그림 — specs/components/pagination.md 의 `[그림: …](../../site/components/specs/pagination.tsx#<id>)` 자리.
// 넘김 줄은 pagination.yaml 을 푼 값(navKit().page — nav-page-view 의 PaginationView)으로, 목록 끝 자리는 infinite-list.yaml(+ Progress Circle · Button),
// 표 넘김은 table-pagination.yaml, 상단 바는 top-navigation.yaml 로 그린다. 카드 · 목록은 역할 색으로 간단히 그린 대역이다(지어낸 내용).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel as Plate } from '../foundations/ui';
import { Verdict, rc, type Mode } from './kit';
import { BENEFITS, HR_USERS } from './nav-data';
import { PaginationPlayground } from './nav-page-playground';
import { cardFace } from './card-face';
import { InfiniteListEndView, PaginationLive, PaginationView, PgCell, TablePaginationView, type PgPart } from './nav-page-view';
import { Band, Bar, Cap, CodePreview, Desktop, Legend, MiniTable, NK, NPhone, PHONE, PagingSlot, Reading, Shell, Side, DeskHeader, ScreenTitle, Wide, circleLook, markBox, markLine, modeKo, pinAt, tableCardH, type Fig } from './nav-screens';
import type { PgState } from './nav-shared';

const G = (brand: 'desk' | 'hr' = 'desk') => NK(brand).page;
const MODES = ['light', 'dark'] as const;
const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[820px] md:flex-row'}`}>{children}</div>;
function Row({ page, total, slots, mode = 'auto', states, showHit, zone, pins }: { page: number; total: number; slots?: number; mode?: Mode; states?: Partial<Record<string, PgState>>; showHit?: boolean; zone?: Partial<Record<PgPart, CSSProperties>>; pins?: Partial<Record<PgPart, ReactNode>> }) {
  return <PaginationView look={G()} mode={mode} page={page} total={total} slots={slots ?? G().slots.regular} states={states} showHit={showHit} zone={zone} pins={pins} />;
}
function Board({ children, mode = 'auto', pad = 16 }: { children: ReactNode; mode?: Mode; pad?: number }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl" style={{ background: rc('bg-layer-default', mode), paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad }}>
      {children}
    </div>
  );
}
// 카드 혜택 격자(데스크톱) — 카드 그림 + 이름 · 혜택
function BenefitGrid({ mode = 'auto', page = 5, cols = 3, n = 6 }: { mode?: Mode; page?: number; cols?: number; n?: number }) {
  const from = ((page - 1) * 3) % BENEFITS.length;
  const list = Array.from({ length: n }, (_, i) => BENEFITS[(from + i) % BENEFITS.length]);
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {list.map(([name, b], i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="block rounded-lg" style={{ aspectRatio: '1.586 / 1', background: rc(['bg-brand-solid', 'bg-neutral-inverted', 'bg-neutral-weak'][i % 3], mode) }} />
          <span className="truncate text-[14px] font-bold" style={{ color: rc('fg-neutral', mode) }}>{name}</span>
          <span className="truncate text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>{b}</span>
        </div>
      ))}
    </div>
  );
}
// 폰 카드 혜택 목록 줄
function BenefitRows({ mode = 'auto', n = 6, from = 0 }: { mode?: Mode; n?: number; from?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24 }}>
      {Array.from({ length: n }, (_, i) => BENEFITS[(from + i) % BENEFITS.length]).map(([name, b], i) => (
        <div key={i} className="flex items-center gap-3" style={{ minHeight: 64 }}>
          <span className="block shrink-0 rounded" style={{ width: 52, height: 33, background: rc(['bg-brand-solid', 'bg-neutral-inverted', 'bg-neutral-weak'][(from + i) % 3], mode) }} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-medium" style={{ color: rc('fg-neutral', mode) }}>{name}</span>
            <span className="truncate text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>{b}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {MODES.map((mode) => (
        <Board key={mode} mode={mode} pad={20}>
          <span className="self-start text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>{modeKo(mode)}</span>
          <div className="flex flex-col items-center gap-1.5">
            <Row mode={mode} page={5} total={12} />
            <Cap mode={mode}>카드 혜택(데스크톱) — 5 / 12쪽, {G().slots.regular}칸</Cap>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Row mode={mode} page={1} total={12} />
            <Cap mode={mode}>첫 쪽 — 이전 자리는 빈 칸</Cap>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Row mode={mode} page={5} total={12} slots={G().slots.narrow} />
            <Cap mode={mode}>좁은 화면({G().slots.breakpoint} 미만) — {G().slots.narrow}칸</Cap>
          </div>
        </Board>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <PaginationPlayground look={G()} tones={NK().tone} card={cardFace()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const c = G().cell.size;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative" style={{ marginTop: 34, marginBottom: 34, marginLeft: 30, transform: 'scale(1.25)', transformOrigin: 'center' }}>
          <Row page={5} total={12} zone={{ root: markLine, arrow: markBox, current: { outline: '2px dashed #DB2777', outlineOffset: 2 }, ellipsis: markBox }} />
          {pinAt('ⓐ', { left: -28, top: c / 2 - 10 })}
          {pinAt('ⓑ', { left: c / 2 - 10, top: -26 })}
          {pinAt('ⓒ', { left: c * 4 + c / 2 - 10, top: -26 })}
          {pinAt('ⓓ', { left: c * 2 + c / 2 - 10, top: c + 6 })}
          {pinAt('ⓑ', { left: c * 8 + c / 2 - 10, top: -26 })}
        </div>
        <Legend
          items={[
            ['ⓐ', 'Root — 칸 40 을 사이 없이'],
            ['ⓑ', 'Previous · Next'],
            ['ⓒ', 'Page(지금 쪽 채움)'],
            ['ⓓ', 'Ellipsis'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Current: Fig = ({ caption }) => {
  const c = G().cell.size;
  const z = 2;
  return (
    <Figure caption={caption}>
      <div className="flex gap-5">
        {MODES.map((mode) => (
          <Board key={mode} mode={mode}>
            <div style={{ width: c * 3 * z, height: c * z }}>
              <div className="flex" style={{ transform: `scale(${z})`, transformOrigin: 'left top' }}>
                {[1, 2, 3].map((n) => (
                  <PgCell key={n} look={G()} mode={mode} slot={{ type: 'page', page: n }} current={n === 2} live={false} link={false} disabled={false} />
                ))}
              </div>
            </div>
            <Cap mode={mode}>{modeKo(mode)} — 지금 쪽 짙은 채움 · 반전 글자</Cap>
          </Board>
        ))}
      </div>
    </Figure>
  );
};

// 칸 자리 안내선 — 9 · 7 칸의 칸 경계
function SlotGuide({ slots, children }: { slots: number; children: ReactNode }) {
  const c = G().cell.size;
  return (
    <div className="relative" style={{ width: slots * c }}>
      {Array.from({ length: slots + 1 }, (_, i) => (
        <span key={i} aria-hidden className="absolute" style={{ left: i * c, top: -4, bottom: -4, width: 1, background: 'rgba(219, 39, 119, 0.35)' }} />
      ))}
      {children}
    </div>
  );
}
const Slots: Fig = ({ caption }) => {
  const total = 12;
  const rows = (slots: number, cases: [number, string][]) => (
    <div className="flex flex-col gap-3">
      <b className="text-[13px] pk-text">{slots}칸 — {slots === G().slots.regular ? `${G().slots.breakpoint} 이상` : `${G().slots.breakpoint} 미만`}</b>
      {cases.map(([p, label]) => (
        <div key={p} className="flex items-center gap-4">
          <span className="w-[86px] text-right text-[12px] pk-muted">{label}</span>
          <SlotGuide slots={slots}>
            <Row page={p} total={total} slots={slots} />
          </SlotGuide>
        </div>
      ))}
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-6">
        {rows(G().slots.regular, [
          [3, '앞쪽 3 / 12'],
          [6, '가운데 6 / 12'],
          [10, '뒤쪽 10 / 12'],
        ])}
        {rows(G().slots.narrow, [
          [2, '앞쪽 2 / 12'],
          [6, '가운데 6 / 12'],
          [11, '뒤쪽 11 / 12'],
        ])}
      </div>
    </Figure>
  );
};

const Ends: Fig = ({ caption }) => {
  const c = G().cell.size;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Row page={1} total={12} zone={{ empty: markLine }} />
            <Band style={{ left: 0, top: c + 4, width: c, height: 4 }} label={`빈 칸 ${c}`} tag="below" />
          </div>
          <span className="pt-4">
            <Cap>첫 쪽 — 이전 자리를 비운다(막힌 화살표를 그리지 않는다)</Cap>
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Row page={12} total={12} states={{ '12': 'focused' }} zone={{ empty: markLine }} />
          <Cap>마지막 쪽 — 키보드로 &ldquo;다음&rdquo; 을 눌러 닿으면 그 자리가 빈 칸이 되어 초점을 지금 쪽(12)으로</Cap>
        </div>
      </div>
    </Figure>
  );
};

const HitArea: Fig = ({ caption }) => {
  const C = G().cell;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ transform: 'scale(1.5)', transformOrigin: 'center', marginTop: 24, marginBottom: 24 }}>
          <Row page={5} total={12} showHit />
        </div>
        <Cap w={460}>
          칸 {C.size} × {C.size} — 누르는 영역은 위아래만 {C.touchH}(보이지 않는 여백 {(C.touchH - C.size) / 2} 씩), 옆은 칸 폭 {C.size} 그대로. v106 &ldquo;누르는 영역 44&rdquo; 의 예외(AA ✓ · AAA ⚠)
        </Cap>
      </div>
    </Figure>
  );
};

const STATE_KO: Record<PgState, string> = { enabled: '기본', hovered: '호버', pressed: '누름', focused: '포커스', disabled: '막힘' };
const States: Fig = ({ caption }) => {
  const states = Object.keys(STATE_KO) as PgState[];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-4">
        {MODES.map((mode) => (
          <Board key={mode} mode={mode}>
            <div className="grid items-center gap-x-3 gap-y-3" style={{ gridTemplateColumns: `72px repeat(${states.length}, 76px)` }}>
              <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>{modeKo(mode)}</span>
              {states.map((st) => (
                <span key={st} className="text-center text-[11px]" style={{ color: rc('fg-neutral-subtle', mode) }}>{STATE_KO[st]}</span>
              ))}
              <span className="text-[12px]" style={{ color: rc('fg-neutral-muted', mode) }}>다른 쪽</span>
              {states.map((st) => (
                <span key={st} className="flex justify-center">
                  <PgCell look={G()} mode={mode} slot={{ type: 'page', page: 2 }} current={false} live={false} link={false} state={st} disabled={false} />
                </span>
              ))}
              <span className="text-[12px]" style={{ color: rc('fg-neutral-muted', mode) }}>지금 쪽</span>
              {states.map((st) => (
                <span key={st} className="flex justify-center">
                  <PgCell look={G()} mode={mode} slot={{ type: 'page', page: 2 }} current live={false} link={false} state={st} disabled={false} />
                </span>
              ))}
              <span className="text-[12px]" style={{ color: rc('fg-neutral-muted', mode) }}>화살표</span>
              {states.map((st) => (
                <span key={st} className="flex justify-center">
                  <PgCell look={G()} mode={mode} slot={{ type: 'next' }} current={false} live={false} link={false} state={st} disabled={false} />
                </span>
              ))}
            </div>
          </Board>
        ))}
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
const RoleGuide: Fig = ({ caption }) => {
  const tl = NK().table;
  return (
    <Plate caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Pair stack>
          <Verdict ok note="데스크톱의 긴 목록(카드 혜택 격자) — 목록 아래 가운데 넘김 줄">
            <Wide>
            <Desktop w={1280} h={760} s={0.4} cw={1000} ch={700}>
              <Shell side={<Side current="benefit" />} header={<DeskHeader />}>
                <ScreenTitle>카드 혜택</ScreenTitle>
                <div style={{ paddingTop: 20, paddingLeft: NK().margin, paddingRight: NK().margin }}>
                  <BenefitGrid cols={4} n={8} />
                  <div style={{ paddingTop: G().marginTop, display: 'flex', justifyContent: 'center' }}>
                    <Row page={5} total={12} />
                  </div>
                </div>
              </Shell>
            </Desktop>
            </Wide>
          </Verdict>
        </Pair>
        <Pair>
          <Verdict ok note="폰의 긴 목록 — 쪽을 나누지 않고 끝없이 불러온다">
            <NPhone scale={0.42} h={600} bar={<Bar title="카드 혜택" />}>
              <div style={{ marginTop: -140 }}>
                <BenefitRows n={8} />
                <InfiniteListEndView look={NK().list} circle={circleLook()} status="loading" />
              </div>
            </NPhone>
          </Verdict>
          <Verdict ok note="데이터 표 — Table Pagination(줄 수 · 범위 · 이전 · 다음)">
            {/* 표 카드(표 + 같은 상자 안 표 아래 줄)를 0.56 배로 — 자리도 같이 줄인다 */}
            <div style={{ width: 528 * 0.56, height: tableCardH(4) * 0.56 }}>
              <div style={{ width: 528, transform: 'scale(0.56)', transformOrigin: 'left top' }}>
                <MiniTable brand="hr" title="사용자" head={['이름', '부서']} rows={HR_USERS.slice(0, 4).map((u) => [u[0], u[1]])}>
                  <PagingSlot>
                    <TablePaginationView look={tl} total={21} page={2} pageSize={10} />
                  </PagingSlot>
                </MiniTable>
              </div>
            </div>
          </Verdict>
        </Pair>
        <Pair stack>
          <Verdict ok={false} note="폰에 쪽 넘김 · &ldquo;더 보기&rdquo; 버튼 — 폰은 끝없이 불러오기">
            <NPhone scale={0.42} h={600} bar={<Bar title="카드 혜택" />}>
              <BenefitRows n={5} />
              <div className="flex justify-center pt-4">
                <PaginationView look={G()} page={1} total={12} slots={G().slots.narrow} />
              </div>
            </NPhone>
          </Verdict>
        </Pair>
      </div>
    </Plate>
  );
};

const ChangeGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <Desktop w={1280} h={760} s={0.34} cw={880} ch={620}>
            <Shell side={<Side current="benefit" />} header={<DeskHeader />}>
              <div style={{ marginTop: -170 }}>
                <ScreenTitle>카드 혜택</ScreenTitle>
                <div style={{ paddingTop: 20, paddingLeft: NK().margin, paddingRight: NK().margin }}>
                  <BenefitGrid cols={3} n={6} page={1} />
                  <div style={{ paddingTop: G().marginTop, display: 'flex', justifyContent: 'center' }}>
                    <Row page={1} total={12} states={{ next: 'pressed' }} />
                  </div>
                </div>
              </div>
            </Shell>
          </Desktop>
          <Cap>1쪽 끝에서 다음(›)을 누름</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Desktop w={1280} h={760} s={0.34} cw={880} ch={620}>
            <Shell side={<Side current="benefit" />} header={<DeskHeader />}>
              <ScreenTitle>카드 혜택</ScreenTitle>
              <div style={{ paddingTop: 20, paddingLeft: NK().margin, paddingRight: NK().margin }}>
                <BenefitGrid cols={3} n={6} page={2} />
                <div style={{ paddingTop: G().marginTop, display: 'flex', justifyContent: 'center' }}>
                  <Row page={2} total={12} states={{ next: 'focused' }} />
                </div>
              </div>
            </Shell>
          </Desktop>
          <Cap>2쪽 — 목록의 위 끝이 화면 위에, 초점은 누른 칸(›)에 남는다</Cap>
        </div>
      </div>
      <Reading tone="ok">2페이지, 전체 12페이지</Reading>
    </div>
  </Plate>
);

const InfiniteGuide: Fig = ({ caption }) => {
  const list = NK().list;
  const end = (status: 'loading' | 'error' | 'end', label: string) => (
    <div className="flex flex-col items-center gap-2">
      <NPhone scale={0.42} h={600} bar={<Bar title="카드 혜택" />}>
        <div className="flex h-full flex-col justify-end">
          <BenefitRows n={6} from={3} />
          <InfiniteListEndView look={list} circle={circleLook()} status={status} endText={status === 'end' ? '카드를 모두 봤어요.' : undefined} />
        </div>
      </NPhone>
      <Cap w={160}>{label}</Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-4">
        {end('loading', `받는 중 — 원 ${list.circle}, ${list.showAfter / 1000}초가 지나야 보인다`)}
        {end('error', `못 불러옴 — 받은 줄은 그대로 + ${list.texts.retry}`)}
        {end('end', '끝 — 목록마다 맞춘 끝 글')}
      </div>
    </Figure>
  );
};

// ── 코드 예시(미리보기) — pagination.md 의 코드 그대로 ──────
const ExDesktop: Fig = ({ caption }) => (
  <CodePreview caption={caption} pad={24} w={400}>
    <div className="flex justify-center">
      <PaginationLive look={G()} page={5} total={12} slots={G().slots.regular} links ariaLabel="카드 혜택 페이지 탐색" />
    </div>
  </CodePreview>
);
const ExInfinite: Fig = ({ caption }) => {
  const list = NK().list;
  return (
    <CodePreview caption={caption} pad={12} w={PHONE}>
      <BenefitRows n={2} from={4} />
      <InfiniteListEndView look={list} circle={circleLook()} status="loading" />
      <div style={{ height: 1, background: rc('stroke-neutral-subtle'), marginLeft: 24, marginRight: 24 }} />
      <BenefitRows n={2} from={7} />
      <InfiniteListEndView look={list} circle={circleLook()} status="end" endText="카드를 모두 봤어요." />
    </CodePreview>
  );
};

export const paginationFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  current: Current,
  slots: Slots,
  ends: Ends,
  'hit-area': HitArea,
  states: States,
  'role-guide': RoleGuide,
  'change-guide': ChangeGuide,
  'infinite-guide': InfiniteGuide,
  'ex-desktop': ExDesktop,
  'ex-infinite': ExInfinite,
};

