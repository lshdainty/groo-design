// Table 페이지의 그림 — specs/components/table.md 의 `[그림: …](../../site/components/specs/table.tsx#<id>)` 자리.
// 표는 table.yaml 을 푼 값(tableLook — data-table-view, 진짜 <table>)으로, 카드 면은 card.yaml(data-card-view), 768 미만 줄은 list.yaml(ListView),
// 배지 · 체크 · ⋮ 는 badge · checkbox · button.yaml, 빈 · 실패는 result-section.yaml 로 그린다. 사람 · 숫자는 지어낸 HR 화면이다.
// 치수 표시는 열 폭을 정해 둔 표(fixed) 기준으로 셈한다 — 칸 자리를 알아야 분홍 치수를 놓을 수 있다.
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { CardHeaderView, CardSurface } from './data-card-view';
import { HR_USERS, QUOTES, REPORTS, days, hours } from './data-data';
import { CL, DimH, DimV, MODES, ModeLabel, PINK, SCREEN_W, TL, UsersDesktop, UsersPhone, pinkFill, type Fig } from './data-screens';
import { textWidth } from './data-shared';
import { ExBasicDemo, ExNarrowDemo, ExSelectDemo, ExStatusDemo, TablePlayground } from './data-table-play';
import { SortHeadView, TableView, type TCol, type TRow } from './data-table-view';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { Reading } from './display-view';
import { Verdict, rc } from './kit';
import { menuKit } from './menu-look';
import { Arrow, Cap, CodePreview, Legend, pinAt } from './nav-screens';
import { overlayKit } from './overlay-screens';

const L = () => TL('hr');
const MENU = () => ({ kit: menuKit('hr'), ov: overlayKit('hr') });
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
const At = ({ n, x, y }: { n: string; x: number; y: number }) => pinAt(n, { left: x, top: y });
const box: CSSProperties = { outline: `1px dashed ${PINK}`, outlineOffset: -1 };

// 표를 담은 카드 — 머리(제목) + 표가 가장자리까지
function TableCard({ title, children, width, mode = 'auto' }: { title?: string; children: ReactNode; width?: number | string; mode?: 'light' | 'dark' | 'auto' }) {
  const c = CL();
  return (
    <CardSurface look={c} mode={mode} body="list" width={width}>
      {title && <CardHeaderView look={c} mode={mode} title={title} body="list" />}
      {title ? children : <div style={{ paddingTop: c.header.list.top - L().head.padY }}>{children}</div>}
    </CardSurface>
  );
}
const userRows = (n: number, rich = false): TRow[] =>
  HR_USERS.slice(0, n).map((u) => ({
    id: u.id,
    name: u.name,
    cells: {
      name: rich ? { text: u.name, detail: u.email, avatar: u.name, sortValue: u.name } : { text: u.name, sortValue: u.name },
      dept: rich ? { text: u.dept, detail: u.title } : u.dept,
      days: { text: days(u.days), sortValue: u.days },
      status: { badge: { label: u.status, tone: u.tone } },
    },
  }));
const cols = (w?: [number, number, number, number]): TCol[] => [
  { key: 'name', label: '이름', sortable: true, width: w?.[0] },
  { key: 'dept', label: '부서', width: w?.[1] },
  { key: 'days', label: '남은 휴가', align: 'end', sortable: true, width: w?.[2] },
  { key: 'status', label: '상태', width: w?.[3] },
];
const SORT = { key: 'days', dir: 'descending' as const };
// 머리 줄 · 줄 높이 — 카드 머리(제목 줄)까지 더한 표의 위 끝
const headTop = () => {
  const c = CL();
  return c.surface.borderW + c.header.list.top + parseFloat(c.title.lineHeight) + c.header.list.bottom;
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
              <UsersDesktop mode={mode} s={0.45} h={560} />
            </Col>
            <Col>
              <UsersPhone mode={mode} scale={0.55} h={620} />
            </Col>
          </Wrap>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <TablePlayground look={L()} card={CL()} menu={MENU()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const t = L();
  const c = CL();
  const w: [number, number, number, number] = [120, 96, 112, 96];
  const bw = c.surface.borderW;
  const barTop = headTop();
  const top = barTop + t.bulk.minH + t.bulk.marginBottom;
  const r1 = top + t.head.minH;
  const tableW = t.check.colW + w.reduce((s, x) => s + x, 0) + t.more.colW;
  const nameW = textWidth('이름', parseFloat(t.head.type.fontSize));
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Col>
          <div style={{ position: 'relative', width: tableW + bw * 2 + 28, paddingLeft: 12, paddingTop: 4 }}>
            <div style={{ position: 'relative', width: tableW + bw * 2 }}>
              <TableCard title="사용자 12명">
                <TableView look={t} caption="사용자" columns={cols(w)} rows={userRows(4)} sort={SORT} selectable selected={['u1', 'u3']} bulkActions={[{ label: '내보내기' }, { label: '삭제', tone: 'critical' }]} more fixed marks={{ bulk: box, headerRow: box }} />
              </TableCard>
              <At n="ⓙ" x={-12} y={barTop + 14} />
              <At n="ⓐ" x={-12} y={top + t.head.minH + t.row.minH.text * 4 - 22} />
              <At n="ⓑ" x={tableW + bw * 2 - 2} y={top + 10} />
              <At n="ⓒ" x={bw + t.check.colW + w[0] + t.cell.padX - 4} y={top - 10} />
              <At n="ⓓ" x={bw + t.check.colW + t.cell.padX + nameW + t.sort.gap - 2} y={top - 10} />
              <At n="ⓔ" x={tableW + bw * 2 - 2} y={r1 + 12} />
              <At n="ⓕ" x={bw + t.check.colW + w[0] + w[1] - 30} y={r1 + 12} />
              <At n="ⓖ" x={bw + t.check.colW + w[0] + w[1] + w[2] + t.cell.padX - 12} y={r1 - 2} />
              <At n="ⓗ" x={bw + tableW - t.edge - t.more.size - 12} y={r1 - 2} />
              <At n="ⓘ" x={bw + t.edge - 14} y={r1 - 2} />
            </div>
          </div>
        </Col>
        <Legend
          items={[
            ['ⓐ', 'Root'],
            ['ⓑ', 'Header Row'],
            ['ⓒ', 'Header Cell'],
            ['ⓓ', 'Sort Icon'],
            ['ⓔ', 'Row'],
            ['ⓕ', 'Cell'],
            ['ⓖ', 'Badge'],
            ['ⓗ', 'More Button'],
            ['ⓘ', 'Checkbox'],
            ['ⓙ', 'Bulk Bar'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const Rows: Fig = ({ caption }) => {
  const t = L();
  const c = CL();
  const w: [number, number, number, number] = [150, 130, 130, 110];
  const bw = c.surface.borderW;
  const top = headTop();
  const tableW = w.reduce((s, x) => s + x, 0);
  const n = 3;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Col>
          {/* 가로 치수는 카드 아래에 — 칸 글자를 가리지 않는다. 마지막 줄의 선은 분홍 점선으로 짚는다 */}
          <div style={{ position: 'relative', width: tableW + bw * 2 + 64, paddingLeft: 56, paddingBottom: 40 }}>
            <div style={{ position: 'relative', width: tableW + bw * 2 }}>
              <TableCard title="사용자">
                <TableView look={t} caption="사용자" columns={cols(w)} rows={userRows(n)} fixed />
              </TableCard>
              <DimV at={{ left: -14, top }} h={t.head.minH} label={`머리 ${t.head.minH}`} side="left" />
              <DimV at={{ left: -14, top: top + t.head.minH }} h={t.row.minH.text} label={`줄 ${t.row.minH.text}`} side="left" />
              <span aria-hidden className="pointer-events-none absolute" style={{ left: bw, right: bw, top: top + t.head.minH + t.row.minH.text * n - t.row.lineW, borderTopWidth: 2, borderTopStyle: 'dashed', borderTopColor: PINK, zIndex: 26 }} />
              <DimH at={{ left: bw, top: top + t.head.minH + t.row.minH.text * n + c.list.padBottom + bw + 10 }} w={t.edge} label={`${t.edge}`} />
              <DimH at={{ left: bw + w[0] - t.cell.padX, top: top + t.head.minH + t.row.minH.text * n + c.list.padBottom + bw + 10 }} w={t.cell.padX * 2} label={`${t.cell.padX} · ${t.cell.padX}`} />
              <DimH at={{ left: bw + tableW - t.edge, top: top + t.head.minH + t.row.minH.text * n + c.list.padBottom + bw + 10 }} w={t.edge} label={`${t.edge}`} />
            </div>
          </div>
        </Col>
        <Legend
          items={[
            ['머리', `${t.head.minH} — 위아래 ${t.head.padY} · ${parseFloat(t.head.type.fontSize)} / ${parseFloat(t.head.type.lineHeight)} · ${t.head.type.fontWeight} · fg-neutral, 바탕 없음`],
            ['줄', `${t.row.minH.text} — 위아래 ${t.cell.padY} · ${parseFloat(t.cell.type.fontSize)} / ${parseFloat(t.cell.type.lineHeight)} · ${t.cell.type.fontWeight}`],
            ['칸', `좌우 ${t.cell.padX} · 첫 칸 앞 · 끝 칸 뒤 ${t.edge}(카드 여백)`],
            ['선', `${t.row.lineW}px stroke-neutral-subtle — 마지막 줄 아래까지(분홍 점선). 세로 선 · 줄무늬 없음`],
          ]}
        />
      </div>
    </Panel>
  );
};

const RowKinds: Fig = ({ caption }) => {
  const t = L();
  const top = headTop();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Col strong={`한 줄 표 — ${t.row.minH.text}`} cap="글만 있는 칸">
          <div style={{ position: 'relative', width: 560 }}>
            <TableCard title="사용자">
              <TableView look={t} caption="사용자" columns={cols()} rows={userRows(3)} sort={SORT} minWidth={520} />
            </TableCard>
            <DimV at={{ left: 562, top: top + t.head.minH }} h={t.row.minH.text} label={`${t.row.minH.text}`} />
          </div>
        </Col>
        <Col strong={`썸네일 · 두 줄 표 — ${t.row.minH.rich}`} cap={`Avatar ${t.thumb.avatar} + 둘째 줄 ${parseFloat(t.detail.type.fontSize)} · fg-neutral-subtle — 한 칸이라도 있으면 모든 줄이 ${t.row.minH.rich}`}>
          <div style={{ position: 'relative', width: 560 }}>
            <TableCard title="사용자">
              <TableView look={t} caption="사용자" columns={cols()} rows={userRows(3, true)} rowKind="rich" sort={SORT} minWidth={520} />
            </TableCard>
            <DimV at={{ left: 562, top: top + t.head.minH }} h={t.row.minH.rich} label={`${t.row.minH.rich}`} />
          </div>
        </Col>
      </div>
    </Panel>
  );
};

// 회비 — 날짜(왼쪽) · 내용 · 금액(오른쪽 · 고정폭 숫자, 빼기 U+2212)
const DUES = [
  { id: 'd1', date: '2026. 10. 5.', memo: '10월 회비', amount: 1240000 },
  { id: 'd2', date: '2026. 10. 2.', memo: '간식 구입', amount: -35000 },
  { id: 'd3', date: '2026. 9. 28.', memo: '워크숍 장소', amount: -480000 },
  { id: 'd4', date: '2026. 9. 5.', memo: '9월 회비', amount: 1180000 },
];
const duesCols: TCol[] = [
  { key: 'date', label: '날짜' },
  { key: 'memo', label: '내용' },
  { key: 'amount', label: '금액', align: 'end' },
];
const duesRows = (): TRow[] => DUES.map((d) => ({ id: d.id, name: d.memo, cells: { date: d.date, memo: d.memo, amount: { text: `${d.amount < 0 ? '−' : ''}${Math.abs(d.amount).toLocaleString('ko-KR')}원`, sortValue: d.amount } } }));
const Numbers: Fig = ({ caption }) => {
  const t = L();
  return (
    <Panel caption={caption}>
      <Wrap>
        <Col strong="오른쪽 · 고정폭 숫자 · 머리도 오른쪽" cap="자릿수가 위아래로 맞아 큰 값이 한눈에 — 돈은 원까지, 빼기 U+2212" w={300}>
          <TableCard title="회비" width={380}>
            <TableView look={t} caption="회비" columns={duesCols} rows={duesRows()} />
          </TableCard>
        </Col>
        <Col strong="왼쪽에 둔 숫자" cap="자릿수가 어긋나 크기를 견주기 어렵다" w={300}>
          <TableCard title="회비" width={380}>
            <TableView look={t} caption="회비" columns={duesCols} rows={duesRows()} bad={{ numbersStart: true }} />
          </TableCard>
        </Col>
      </Wrap>
    </Panel>
  );
};

const Sort: Fig = ({ caption }) => {
  const t = L();
  const steps: [string, 'none' | 'ascending' | 'descending'][] = [
    ['처음', 'none'],
    ['한 번', 'descending'],
    ['두 번', 'ascending'],
    ['세 번', 'descending'],
  ];
  const textSteps: [string, 'none' | 'ascending' | 'descending'][] = [
    ['처음', 'none'],
    ['한 번', 'ascending'],
    ['두 번', 'descending'],
    ['세 번', 'ascending'],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Col strong="늘 보이는 ↑↓ — 지금 방향만 짙게" cap={`정렬할 수 있는 열(이름 · 남은 휴가)에 늘 ↑↓(${t.sort.icon}) — 흐린 fg-neutral-muted 둘에서 지금 방향만 fg-neutral. 머리 칸 전체가 버튼, aria-sort 는 정렬된 열에만`} w={520}>
          <TableCard title="사용자" width={560}>
            <TableView look={t} caption="사용자" columns={cols()} rows={userRows(3)} sort={SORT} minWidth={520} />
          </TableCard>
        </Col>
        <Wrap gap="gap-8">
          <Col strong="숫자 · 날짜 열 — 처음 내림" cap="누를 때마다 내림 ↔ 오름(두 단계 — 정렬 없음으로 돌아가지 않는다)" w={300}>
            <div className="flex flex-col gap-2 rounded-xl" style={{ background: rc('bg-layer-default', 'auto', 'hr'), paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
              {steps.map(([k, d]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="w-10 text-[12px] pk-muted">{k}</span>
                  <SortHeadView look={t} label="남은 휴가" dir={d} align="end" width={150} />
                </div>
              ))}
            </div>
          </Col>
          <Col strong="글 열 — 처음 오름(가나다)" cap="다른 열을 누르면 그 열의 처음 방향으로 옮긴다" w={300}>
            <div className="flex flex-col gap-2 rounded-xl" style={{ background: rc('bg-layer-default', 'auto', 'hr'), paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
              {textSteps.map(([k, d]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="w-10 text-[12px] pk-muted">{k}</span>
                  <SortHeadView look={t} label="이름" dir={d} width={150} />
                </div>
              ))}
            </div>
          </Col>
        </Wrap>
      </div>
    </Panel>
  );
};

const More: Fig = ({ caption }) => {
  const t = L();
  const c = CL();
  const w: TCol[] = [
    { key: 'name', label: '이름', width: 150 },
    { key: 'days', label: '남은 휴가', align: 'end', width: 130 },
  ];
  const rows: TRow[] = HR_USERS.slice(0, 2).map((u) => ({ id: u.id, name: u.name, cells: { name: u.name, days: days(u.days) } }));
  const bw = c.surface.borderW;
  const top = headTop();
  const tableW = 150 + 130 + t.more.colW;
  const btnX = bw + 150 + 130 + t.cell.padX;
  const r1 = top + t.head.minH;
  const btnY = r1 + (t.row.minH.text - t.row.lineW - t.more.size) / 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Col>
          <div style={{ position: 'relative', width: tableW + bw * 2 + 70, paddingRight: 70 }}>
            <div style={{ position: 'relative', width: tableW + bw * 2 }}>
              <TableCard title="사용자">
                <TableView look={t} caption="사용자" columns={w} rows={rows} more fixed />
              </TableCard>
              {/* 누르는 영역 44 — 보이는 40 바깥으로 2 씩 */}
              <span aria-hidden className="pointer-events-none absolute" style={{ left: btnX - (t.more.touch - t.more.size) / 2, top: btnY - (t.more.touch - t.more.size) / 2, width: t.more.touch, height: t.more.touch, background: pinkFill, outline: `1px dashed ${PINK}`, outlineOffset: -1, zIndex: 20 }} />
              <DimH at={{ left: btnX - t.cell.padX, top: r1 + t.row.minH.text * 2 + 6 }} w={t.cell.padX} label={`${t.cell.padX}`} />
              <DimH at={{ left: btnX, top: r1 + t.row.minH.text * 2 + 6 }} w={t.more.size} label={`${t.more.size}`} />
              <DimH at={{ left: btnX + t.more.size, top: r1 + t.row.minH.text * 2 + 6 }} w={t.edge} label={`${t.edge}`} />
              <DimV at={{ left: tableW + bw * 2 + 8, top: btnY - (t.more.touch - t.more.size) / 2 }} h={t.more.touch} label={`누르는 ${t.more.touch}`} />
            </div>
          </div>
        </Col>
        <div className="flex flex-wrap justify-center gap-2">
          <Reading>머리 칸: 동작(숨긴 글)</Reading>
          <Reading>⋮: 김하늘 더보기, 메뉴 버튼</Reading>
        </div>
        <Cap w={520}>
          열 폭 {t.more.colW}(앞 {t.cell.padX} + {t.more.size} + 끝 {t.edge}) · Button ghost iconOnly medium · 1280 이상 Menu, 미만 Menu Sheet. 머리 칸에는 글을 쓰지 않는다
        </Cap>
      </div>
    </Panel>
  );
};

const reportCols: TCol[] = [
  { key: 'title', label: '제목' },
  { key: 'author', label: '작성자' },
  { key: 'date', label: '제출일', sortable: true, first: 'descending' },
  { key: 'status', label: '상태' },
];
const reportRows = (): TRow[] => REPORTS.map((r) => ({ id: r.id, name: r.title, cells: { title: r.title, author: r.author, date: { text: r.date, sortValue: r.date }, hours: hours(r.hours), status: { badge: { label: r.status, tone: r.tone } } } }));
const Selection: Fig = ({ caption }) => {
  const t = L();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <Col>
          <TableCard title="업무 보고" width={640}>
            <TableView look={t} caption="업무 보고" columns={reportCols} rows={reportRows()} sort={{ key: 'date', dir: 'descending' }} selectable selected={['r1', 'r3']} bulkActions={[{ label: '내보내기' }, { label: '삭제', tone: 'critical' }]} minWidth={600} />
          </TableCard>
        </Col>
        <Cap w={560}>
          고른 줄은 바탕 없이 체크(Checkbox large {t.check.size})로만 — 머리 체크는 일부(indeterminate). 일괄 작업 바 {t.bulk.minH} · 모서리 {t.bulk.radius} · bg-brand-weak, 표 위 {t.bulk.marginBottom}
        </Cap>
      </div>
    </Panel>
  );
};

const Sticky: Fig = ({ caption }) => {
  const t = L();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <Col>
          <TableCard title="휴가 현황" width={560}>
            <TableView look={t} caption="사용자" columns={cols()} rows={userRows(12)} sort={SORT} stickyHeader maxHeight={t.head.minH + t.row.minH.text * 4} scrollTop={64} minWidth={520} />
          </TableCard>
        </Col>
        <Cap w={520}>상자 안에서 스크롤하면 머리 줄은 맨 위에 붙고 카드 면과 같은 bg-layer-default 로 지나가는 줄을 가린다 — 페이지 스크롤에는 붙이지 않는다</Cap>
      </div>
    </Panel>
  );
};

const States: Fig = ({ caption }) => {
  const t = L();
  const ko = { enabled: '기본', hovered: '호버(웹)', pressed: '누름', focused: '포커스(웹)' } as const;
  const st = ['enabled', 'hovered', 'pressed', 'focused'] as const;
  const rows = userRows(4).map((r, i) => ({ ...r, cells: { ...r.cells, name: { text: `${r.name} — ${ko[st[i]]}`, sortValue: r.name } } }));
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Col strong="누르는 줄" cap="호버 · 누름은 같은 bg-layer-default-pressed — 축소는 없다. 포커스는 이름 링크 안쪽 2px 링">
          <TableCard title="사용자" width={600}>
            <TableView look={t} caption="사용자" columns={cols()} rows={rows} sort={SORT} pressable rowStates={{ u1: 'enabled', u2: 'hovered', u3: 'pressed', u4: 'focused' }} minWidth={560} />
          </TableCard>
        </Col>
        <Col strong="정렬 버튼">
          <div className="flex flex-wrap justify-center gap-3">
            {st.map((s) => (
              <div key={s} className="flex flex-col items-center gap-1.5 rounded-xl" style={{ background: rc('bg-layer-default', 'auto', 'hr'), paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
                <SortHeadView look={t} label="남은 휴가" dir="descending" align="end" state={s} width={140} />
                <span className="text-[12px] pk-muted">{ko[s]}</span>
              </div>
            ))}
          </div>
        </Col>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const NarrowGuide: Fig = ({ caption }) => {
  const t = L();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
        <Col strong={`${t.breakpoint} 이상 — 표`} cap="이름 · 부서 · 남은 휴가 · 상태 · ⋮">
          <TableCard title="사용자" width={520}>
            <TableView look={t} caption="사용자" columns={cols()} rows={userRows(5)} sort={SORT} more minWidth={480} />
          </TableCard>
        </Col>
        <Arrow label={`${t.breakpoint} 미만`} />
        <Col strong="List 줄" cap="제목 이름 · 설명 &quot;부서 · 상태&quot; · 오른쪽 남은 휴가(16 · 고정폭 숫자). 나머지는 줄을 눌러 상세">
          <UsersPhone scale={0.62} h={560} n={5} title="사용자" />
        </Col>
      </div>
    </Panel>
  );
};

const LineGuide: Fig = ({ caption }) => {
  const t = L();
  const mini = (bad?: Parameters<typeof TableView>[0]['bad']) => (
    <TableCard width={300}>
      <TableView look={t} caption="사용자" columns={[cols()[0], cols()[1], cols()[2]]} rows={userRows(3)} sort={SORT} bad={bad} minWidth={280} />
    </TableCard>
  );
  return (
    <Panel caption={caption}>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <Verdict ok note="줄 사이 선 하나 — 마지막 줄 아래까지">
          {mini()}
        </Verdict>
        <Verdict ok={false} note="세로 선 — 칸이 갇혀 줄을 따라 읽기 어렵다">
          {mini({ vlines: true })}
        </Verdict>
        <Verdict ok={false} note="줄무늬(짝수 줄 바탕) — 줄이 길면 열을 줄인다">
          {mini({ stripes: true })}
        </Verdict>
        <Verdict ok={false} note="작은 대문자 회색 머리 · 머리 바탕">
          {mini({ head: 'grey' })}
        </Verdict>
      </div>
    </Panel>
  );
};

const NumberGuide: Fig = ({ caption }) => {
  const t = L();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="숫자는 머리까지 오른쪽 · 고정폭 숫자, 돈은 원까지">
          <TableCard width={300}>
            <TableView look={t} caption="회비" columns={duesCols} rows={duesRows()} minWidth={280} />
          </TableCard>
        </Verdict>
        <Verdict ok={false} note="왼쪽 · 고정폭 글꼴(mono) — 자릿수가 어긋나고 글꼴이 섞인다">
          <TableCard width={300}>
            <TableView look={t} caption="회비" columns={duesCols} rows={duesRows()} bad={{ numbersStart: true, mono: true }} minWidth={280} />
          </TableCard>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const ActionsGuide: Fig = ({ caption }) => {
  const t = L();
  const iconCols: TCol[] = [cols()[0], cols()[2], { key: 'act', label: '' }];
  const ghost = buttonLook({ variant: 'ghost', layout: 'iconOnly', size: 'xsmall' }, 'hr');
  const iconRows: TRow[] = HR_USERS.slice(0, 3).map((u) => ({
    id: u.id,
    name: u.name,
    cells: {
      name: u.name,
      days: days(u.days),
      act: {
        node: (
          <span style={{ display: 'flex', gap: 2 }}>
            <ButtonView look={ghost} icon="pencil" ariaLabel="" state="enabled" />
            <ButtonView look={ghost} icon="trash" ariaLabel="" state="enabled" />
          </span>
        ),
      },
    },
  }));
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="줄 끝 ⋮ 하나 — 이름 &quot;{줄 이름} 더보기&quot;, 줄을 누르면 상세">
          <TableCard width={300}>
            <TableView look={t} caption="사용자" columns={[cols()[0], cols()[2]]} rows={userRows(3)} more minWidth={280} />
          </TableCard>
        </Verdict>
        <Verdict ok={false} note="줄마다 늘어놓은 수정 · 삭제 아이콘 — 누르는 것이 줄마다 늘고 이름이 없다">
          <TableCard width={300}>
            <TableView look={t} caption="사용자" columns={iconCols} rows={iconRows} minWidth={280} />
          </TableCard>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const GridGuide: Fig = ({ caption }) => {
  const t = L();
  const qCols: TCol[] = [
    { key: 'date', label: '날짜' },
    { key: 'close', label: '종가', align: 'end' },
    { key: 'rate', label: '등락률', align: 'end' },
    { key: 'volume', label: '거래량', align: 'end' },
  ];
  const qRows: TRow[] = QUOTES.map((q, i) => ({ id: `q${i}`, name: q.date, cells: { date: q.date, close: `${q.close.toLocaleString('ko-KR')}원`, rate: { delta: { dir: q.dir, value: q.rate } }, volume: q.volume.toLocaleString('ko-KR') } }));
  const tdStyle: CSSProperties = { paddingTop: 12, paddingBottom: 12, fontSize: 14, lineHeight: '20px' };
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="&lt;table&gt; — 칸마다 열 이름 · 줄 이름이 읽힌다">
          <div className="flex flex-col items-center gap-2">
            <TableCard width={320}>
              <TableView look={TL('desk')} caption="삼성전자 일별 시세" columns={qCols} rows={qRows.slice(0, 3)} minWidth={300} />
            </TableCard>
            <Reading tone="ok">10. 8., 등락률, 1.28% 올랐어요</Reading>
          </div>
        </Verdict>
        <Verdict ok={false} note="div 격자 — 보이는 것은 같지만 보조 기술이 열 이름을 모른다">
          <div className="flex flex-col items-center gap-2">
            <div style={{ width: 320, boxSizing: 'border-box', borderRadius: CL().surface.radius, borderWidth: 1, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak'), background: rc('bg-layer-default'), paddingTop: 14, paddingBottom: 12, paddingLeft: t.edge, paddingRight: t.edge, fontFamily: t.cell.type.fontFamily }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', fontSize: 11, fontWeight: 700, color: rc('fg-neutral-subtle'), paddingBottom: 6 }}>
                {['날짜', '종가', '등락률', '거래량'].map((h) => (
                  <span key={h} style={{ textAlign: h === '날짜' ? 'left' : 'right' }}>{h}</span>
                ))}
              </div>
              {QUOTES.slice(0, 3).map((q) => (
                <div key={q.date} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', color: rc('fg-neutral'), ...tdStyle }}>
                  <span>{q.date}</span>
                  <span style={{ textAlign: 'right' }}>{q.close.toLocaleString('ko-KR')}</span>
                  <span style={{ textAlign: 'right', color: q.dir === 'down' ? rc('fg-informative') : rc('fg-critical') }}>{q.dir === 'down' ? '-' : ''}{q.rate}</span>
                  <span style={{ textAlign: 'right' }}>{Math.round(q.volume / 10000)}만</span>
                </div>
              ))}
            </div>
            <Reading tone="bad">10. 8. 71,200 1.28% 1248만</Reading>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const StatusGuide: Fig = ({ caption }) => {
  const t = L();
  const three = cols().slice(0, 3);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Col strong="불러오는 동안" cap={`머리는 처음부터, 줄 자리만 Skeleton(줄 높이 그대로 · 글 자리 t4 ${t.sk.text.t4.lineHeight})`}>
          <TableCard title="사용자" width={520}>
            <TableView look={t} caption="사용자" columns={three} rows={[]} status={{ kind: 'loading', rows: 3 }} minWidth={480} />
          </TableCard>
        </Col>
        <Col strong="비었음" cap="거르기 때문이면 &quot;조건에 맞는 사용자가 없어요&quot; + 필터 초기화">
          <TableCard title="사용자" width={520}>
            <TableView look={t} caption="사용자" columns={three} rows={[]} status={{ kind: 'empty', icon: 'search-x', title: '조건에 맞는 사용자가 없어요', action: '필터 초기화' }} minWidth={480} />
          </TableCard>
        </Col>
        <Col strong="실패" cap="실패를 빈 표로 보이지 않는다 — Result Section failure + 다시 시도">
          <TableCard title="사용자" width={520}>
            <TableView look={t} caption="사용자" columns={three} rows={[]} status={{ kind: 'failure', title: '사용자를 불러오지 못했어요', description: '잠시 뒤 다시 시도해주세요.', action: '다시 시도' }} minWidth={480} />
          </TableCard>
        </Col>
      </div>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — table.md 의 코드 그대로 ────────────
const ExBasic: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={680} pad={24} bg="bg-layer-basement" brand="hr">
    <ExBasicDemo look={L()} card={CL()} menu={MENU()} />
  </CodePreview>
);
const ExSelect: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={680} pad={24} bg="bg-layer-basement" brand="hr">
    <ExSelectDemo look={L()} card={CL()} />
  </CodePreview>
);
const ExNarrow: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={SCREEN_W} pad={24} bg="bg-layer-basement" brand="hr">
    <ExNarrowDemo look={L()} card={CL()} />
  </CodePreview>
);
const ExStatus: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={680} pad={24} bg="bg-layer-basement" brand="hr">
    <ExStatusDemo look={L()} card={CL()} />
  </CodePreview>
);

export const tableFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  rows: Rows,
  'row-kinds': RowKinds,
  numbers: Numbers,
  sort: Sort,
  more: More,
  selection: Selection,
  sticky: Sticky,
  states: States,
  'narrow-guide': NarrowGuide,
  'line-guide': LineGuide,
  'number-guide': NumberGuide,
  'actions-guide': ActionsGuide,
  'grid-guide': GridGuide,
  'status-guide': StatusGuide,
  'ex-basic': ExBasic,
  'ex-select': ExSelect,
  'ex-narrow': ExNarrow,
  'ex-status': ExStatus,
};

