// Table Pagination 페이지의 그림 — specs/components/table-pagination.md 의 `[그림: …](../../site/components/specs/table-pagination.tsx#<id>)` 자리.
// 줄은 table-pagination.yaml 을 푼 값(navKit().table — nav-page-view 의 TablePaginationView)으로, 두 고르기는 select.yaml medium(select-view)으로 그린다.
// 표는 table.yaml 대로 카드 안에 가장자리까지 붙고(nav-screens MiniTable — TableView), 줄은 표와 같은 상자 안 표 아래 12 다(지어낸 내용).
import type { ReactNode } from 'react';
import { Figure, Panel as Plate } from '../foundations/ui';
import { Verdict, rc, type Mode } from './kit';
import { HR_LEAVES, HR_USERS } from './nav-data';
import { TablePaginationPlayground } from './nav-page-playground';
import { cardFace } from './card-face';
import { cardLook, tableLook } from './data-look';
import { TablePaginationLive, TablePaginationView } from './nav-page-view';
import { SelectOpenView } from './select-view';
import { Band, Cap, CodePreview, Legend, MiniTable, NK, PagingSlot, markBox, markLine, modeKo, pinAt, tableCardH, type Fig } from './nav-screens';
import { CardHeaderView, CardSurface } from './data-card-view';

const TL = (brand: 'desk' | 'hr' = 'hr') => NK(brand).table;
const MODES = ['light', 'dark'] as const;
const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[820px] md:flex-row'}`}>{children}</div>;
const W = 560;
// 반으로 줄인 표 카드 — 자리(폭 W · 높이 h)도 같이 줄인다
const Shrunk = ({ h, children }: { h: number; children: ReactNode }) => (
  <div style={{ width: W / 2, height: h / 2 }}>
    <div style={{ width: W, transform: 'scale(0.5)', transformOrigin: 'left top' }}>{children}</div>
  </div>
);
const USERS_HEAD = ['이름', '부서', '직책', '상태'];
// 표 카드 — 머리(표 이름) + 표 + 아래 줄. 줄은 표와 같은 상자 안 표 아래 12(spacing-component-default — 넘김 줄의 위 여백, 표의 자리는 좌우 24 만)
function TableBlock({ mode = 'auto', w = W, rows = 4, head = USERS_HEAD, data = HR_USERS, total = 21, page = 2, pageSize = 10, row, title = '사용자' }: { mode?: Mode; w?: number; rows?: number; head?: string[]; data?: string[][]; total?: number; page?: number; pageSize?: number; row?: ReactNode; title?: string }) {
  return (
    <div style={{ width: w }}>
      <MiniTable mode={mode} brand="hr" title={title} head={head} rows={data.slice(0, rows)} empty={rows === 0 ? '사용자가 없어요' : undefined}>
        <PagingSlot>{row ?? <TablePaginationView look={TL()} mode={mode} total={total} page={page} pageSize={pageSize} />}</PagingSlot>
      </MiniTable>
    </div>
  );
}
// 판 — 표 카드를 놓는 회색 바닥(bg-layer-basement). face 면 카드 면(흰 면 + 1px 테두리 · 모서리 16, card.yaml) —
// 줄은 표와 같은 카드 안에 있으므로 줄만 떼어 그릴 때도 카드 면 위에 둔다
function Board({ children, mode = 'auto', pad = 24, face = false }: { children: ReactNode; mode?: Mode; pad?: number; face?: boolean }) {
  const c = cardLook().surface;
  return (
    <div
      className="flex flex-col gap-3"
      style={{
        background: rc(face ? 'bg-layer-default' : 'bg-layer-basement', mode, 'hr'),
        borderWidth: face ? c.borderW : 0,
        borderStyle: 'solid',
        borderColor: rc('stroke-neutral-weak', mode, 'hr'),
        borderRadius: face ? c.radius : 12,
        paddingTop: pad,
        paddingBottom: pad,
        paddingLeft: pad,
        paddingRight: pad,
      }}
    >
      {children}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {MODES.map((mode) => (
        <Board key={mode} mode={mode}>
          <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>{modeKo(mode)}</span>
          {mode === 'light' ? <TableBlock mode={mode} title="사용자 21명" /> : <TableBlock mode={mode} title="휴가 내역" head={['날짜', '종류', '일수', '상태']} data={HR_LEAVES} rows={4} total={23} page={1} pageSize={10} />}
        </Board>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <TablePaginationPlayground look={TL()} tones={NK('hr').tone} table={tableLook('hr')} card={cardFace()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-5">
      <Board face>
        <div className="relative" style={{ width: W, marginTop: 24, marginBottom: 6 }}>
          <TablePaginationView look={TL()} total={237} page={2} pageSize={10} zone={{ pageSize: markLine, pageRange: markLine, arrows: markBox }} pins={{ pageSize: pinAt('ⓐ', { left: -8, top: -28 }), pageRange: pinAt('ⓑ', { left: -8, top: -28 }), arrows: pinAt('ⓒ', { left: 30, top: -28 }) }} />
        </div>
      </Board>
      <Legend
        items={[
          ['ⓐ', 'Rows Per Page — 줄 수 고르기 + "씩 보기"'],
          ['ⓑ', 'Page Range — 범위 고르기 + "/ 총 N개"'],
          ['ⓒ', 'Previous · Next'],
        ]}
      />
    </div>
  </Figure>
);

// ── Properties ────────────────────────────────────────────
const Layout: Fig = ({ caption }) => {
  const t = TL();
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <Board face>
        <div className="relative" style={{ width: W, marginTop: 18, marginBottom: 18, marginLeft: 16 }}>
          <TablePaginationView look={t} total={237} page={2} pageSize={10} zone={{ root: markLine }} />
          <Band style={{ left: -16, top: 0, width: 6, height: t.height }} label={`${t.height}`} vertical tag="left" />
          <Band style={{ right: t.arrow.size * 2, top: t.height + 4, width: t.gap, height: 4 }} label={`${t.gap}`} tag="below" />
          <Band style={{ right: 0, top: -8, width: t.arrow.size * 2, height: 4 }} label={`${t.arrow.size} × 2`} tag="above" />
          <Band style={{ left: t.pageSize.minW, top: t.height + 4, width: t.pageSize.gap, height: 4 }} label={`${t.pageSize.gap}`} tag="below" />
        </div>
        </Board>
        <Cap w={520}>
          한 줄 {t.height} · 양 끝 정렬 — 왼쪽 묶음 ↔ 오른쪽 묶음 · 범위 묶음 ↔ 화살표 {t.gap}, 고르기 ↔ 글 {t.pageSize.gap}. 고르기는 Select medium(최소 폭 {t.pageSize.minW}), 화살표는 Pagination 의 칸 {t.arrow.size} 둘
        </Cap>
      </div>
    </Figure>
  );
};

const Total: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <Board face>
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div style={{ width: W }}>
          <TablePaginationView look={TL()} total={237} page={2} pageSize={10} />
        </div>
        <Cap>전체를 앎 — 범위는 고르기 + &ldquo;/ 총 237개&rdquo;(세 자리마다 쉼표)</Cap>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div style={{ width: W }}>
          <TablePaginationView look={TL()} page={2} pageSize={10} hasNext />
        </div>
        <Cap>전체를 모름 — 범위는 &ldquo;11-20&rdquo; 글만(다음이 있는지만 안다)</Cap>
      </div>
    </div>
    </Board>
  </Figure>
);

const Ends: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <Board>
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Board face pad={12}>
          <div style={{ width: W - 48 }}>
            <TablePaginationView look={TL()} total={237} page={1} pageSize={10} />
          </div>
        </Board>
        <Cap>첫 범위 — 이전이 막힌다(숨기지 않는다 · 초점은 남는다)</Cap>
      </div>
      <div className="flex flex-col items-center gap-2">
        <TableBlock rows={0} total={0} page={1} pageSize={10} title="사용자 0명" />
        <Cap>빈 표 — &ldquo;0-0 / 총 0개&rdquo;, 이전 · 다음 모두 막힘. 줄 수는 그대로 바꿀 수 있다</Cap>
      </div>
    </div>
    </Board>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
const PlaceGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="데이터 표 아래에 한 줄" bg="var(--p-bg-layer-basement)">
        <Shrunk h={tableCardH(4)}>
          <TableBlock rows={4} />
        </Shrunk>
      </Verdict>
      <Verdict ok={false} note="표 위에 둔 줄" bg="var(--p-bg-layer-basement)">
        <Shrunk h={tableCardH(4)}>
          <div style={{ width: W }}>
            <MiniTable brand="hr" title="사용자" head={USERS_HEAD} rows={HR_USERS.slice(0, 4)} above={<PagingSlot above><TablePaginationView look={TL()} total={21} page={2} pageSize={10} /></PagingSlot>} />
          </div>
        </Shrunk>
      </Verdict>
    </Pair>
  </Plate>
);

const OptionsGuide: Fig = ({ caption }) => {
  const t = TL();
  const ranges = Array.from({ length: 24 }, (_, i) => ({ value: String(i + 1), label: `${i * 10 + 1}-${Math.min(237, (i + 1) * 10)}` }));
  const txt = { fontSize: t.suffix.fontSize, lineHeight: t.suffix.lineHeight, color: rc('fg-neutral', 'auto', 'hr') };
  return (
    <Figure caption={caption}>
      <Board face>
        <div className="flex items-start gap-10">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-start" style={{ columnGap: t.pageSize.gap, height: 230 }}>
              <div style={{ width: t.pageSize.minW }}>
                <SelectOpenView look={t.select} size="medium" groups={[{ items: t.options.map((n) => ({ value: String(n), label: `${n}개` })) }]} selected={['10']} labels={['10개']} placement="flow" />
              </div>
              <span style={{ ...txt, paddingTop: 10 }}>씩 보기</span>
            </div>
            <Cap w={220}>줄 수 — {t.options.join(' · ')}(3 ~ 4개를 넘지 않는다). 바꾸면 첫 범위로</Cap>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-start" style={{ columnGap: t.range.gap, height: t.range.maxH + 60 }}>
              <div style={{ width: t.range.minW + 20 }}>
                <SelectOpenView look={t.select} size="medium" groups={[{ items: ranges }]} selected={['2']} labels={['11-20']} placement="flow" maxHeight={t.range.maxH} />
              </div>
              <span style={{ ...txt, paddingTop: 10 }}>/ 총 237개</span>
            </div>
            <Cap w={240}>범위 — 목록 최대 높이 {t.range.maxH}, 지금 범위가 보이게 열린다(200개를 넘으면 첫 · 마지막 · 지금 둘레만)</Cap>
          </div>
        </div>
      </Board>
    </Figure>
  );
};

const NarrowGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="좁은 칸 — 카드 안 표 상자에서 표와 줄이 함께 가로로 민다(카드 머리는 그대로)" bg="var(--p-bg-layer-basement)">
        <div style={{ width: 300 }}>
          <CardSurface look={cardLook()} body="list">
            <CardHeaderView look={cardLook()} title="사용자" body="list" heading="span" />
            <div className="relative">
              <MiniTable bare brand="hr" title="사용자" head={USERS_HEAD} rows={HR_USERS.slice(0, 3)} minWidth={W} scrollLeft={120}>
                <PagingSlot>
                  <TablePaginationView look={TL()} total={21} page={2} pageSize={10} />
                </PagingSlot>
              </MiniTable>
              <span aria-hidden className="absolute -bottom-2 left-6 right-6 block h-1 rounded-full" style={{ background: rc('stroke-neutral-weak') }}>
                <span className="block h-1 rounded-full" style={{ width: '45%', marginLeft: '25%', background: rc('fg-neutral-subtle') }} />
              </span>
            </div>
          </CardSurface>
        </div>
      </Verdict>
      <Verdict ok={false} note="줄만 두 줄로 접는다 — 줄은 늘 한 줄" bg="var(--p-bg-layer-basement)">
        <div style={{ width: 300 }}>
          <MiniTable brand="hr" title="사용자" head={['이름', '부서']} rows={HR_USERS.slice(0, 3).map((u) => [u[0], u[1]])}>
            <PagingSlot>
              <TablePaginationView look={TL()} total={21} page={2} pageSize={10} wrap />
            </PagingSlot>
          </MiniTable>
        </div>
      </Verdict>
    </Pair>
  </Plate>
);

// ── 코드 예시(미리보기) — table-pagination.md 의 코드 그대로 ──────
// 표 상자(overflow-x-auto) 안에 표와 줄 — 카드 머리(표 이름)는 표를 담는 카드의 것
const ExTable: Fig = ({ caption }) => (
  <CodePreview caption={caption} pad={24} w={W + 48} brand="hr" bg="bg-layer-basement">
    <MiniTable brand="hr" title="사용자 21명" head={USERS_HEAD} rows={HR_USERS.slice(0, 4)} minWidth={W - 2}>
      <PagingSlot>
        <TablePaginationLive look={TL()} total={21} page={2} pageSize={10} />
      </PagingSlot>
    </MiniTable>
  </CodePreview>
);

export const tablePaginationFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  total: Total,
  ends: Ends,
  'place-guide': PlaceGuide,
  'options-guide': OptionsGuide,
  'narrow-guide': NarrowGuide,
  'ex-table': ExTable,
};
