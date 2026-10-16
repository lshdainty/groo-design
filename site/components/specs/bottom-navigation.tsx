// Bottom Navigation 페이지의 그림 — specs/components/bottom-navigation.md 의 `[그림: …](../../site/components/specs/bottom-navigation.tsx#<id>)` 자리.
// 탭 바는 bottom-navigation.yaml 을 푼 값(navKit().tab — nav-view 의 TabBar)으로, 상단 바는 top-navigation.yaml, 가계부 위 Line Tabs 는 tabs.yaml,
// 스낵바 · 시트는 snackbar · bottom-sheet.yaml 로 그린다. 화면 속 목록은 역할 색으로 간단히 그린 대역이다(지어낸 내용).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel as Plate } from '../foundations/ui';
import { snackbarLook } from './feedback-look';
import { SnackDock } from './feedback-screens';
import { SnackbarView } from './feedback-view';
import { Sheet, Verdict, cardStack, rc, type Mode } from './kit';
import { ASSET_ROWS, DESK_TABS } from './nav-data';
import { BottomNavPlayground } from './nav-playground';
import {
  FloorBands,
  TxCard,
  Arrow,
  Band,
  Bar,
  Cap,
  CodePreview,
  DayHead,
  Fab,
  HOME_ACTIONS,
  HomeIndicator,
  HomeScreen,
  LedgerScreen,
  Legend,
  NK,
  NPhone,
  PHONE,
  Pill,
  Reading,
  Tap,
  TxRows,
  markBox,
  markLine,
  modeKo,
  pinAt,
  type Fig,
} from './nav-screens';
import { tabBottom, type TabSize } from './nav-shared';

const L = (brand: 'desk' | 'hr' = 'desk') => NK(brand).tab;
const MODES = ['light', 'dark'] as const;
const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[820px] md:flex-row'}`}>{children}</div>;
// 칸의 가운데(x) — 화면 폭 w 에서 바의 i 번째 칸(+ 포함 다섯)
function cellX(i: number, size: TabSize = 'regular', w = PHONE) {
  const S = L().sizes[size];
  const barW = Math.min(L().maxWidth, w - S.marginX * 2);
  const left = (w - barW) / 2;
  const col = (barW - S.padX * 2 - L().gap * (L().columns - 1)) / L().columns;
  return left + S.padX + col / 2 + i * (col + L().gap);
}
// 화면 아래 끝만 — 바와 아래 자리(그림 속 폰의 아래 조각)
function BottomStrip({ mode = 'auto', size = 'regular', safe = 0, tab = 'home', h, children, brand = 'desk', w = PHONE, style }: { mode?: Mode; size?: TabSize; safe?: number; tab?: string; h?: number; children?: ReactNode; brand?: 'desk' | 'hr'; w?: number; style?: CSSProperties }) {
  const zone = tabBottom(L(brand), 'regular', safe) + L(brand).sizes.regular.h;
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: w, height: h ?? zone + 20, background: rc('bg-layer-default', mode, brand), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle', mode, brand)}`, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, ...style }}>
      <Pill brand={brand} mode={mode} tab={tab} size={size} safe={safe} />
      {safe > 0 && <HomeIndicator mode={mode} />}
      {children}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <HomeScreen mode={mode} scale={0.5} h={600} />
          <LedgerScreen mode={mode} scale={0.5} h={600} tabSize="compact" from={3} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <BottomNavPlayground look={L()} top={NK().top} tones={NK().tone} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const S = L().sizes.regular;
  const bottom = tabBottom(L(), 'regular', 0);
  const H = S.h + bottom + 40;
  const barTop = H - bottom - S.h;
  // 칸 안의 아이콘 + 라벨은 가운데 — 라벨의 위 끝
  const labelH = parseFloat(L().label.type.lineHeight);
  const content = L().icon.size + L().item.gap + labelH;
  const labelTop = barTop + S.padY + (S.h - S.padY * 2 - content) / 2 + L().icon.size + L().item.gap;
  const items = DESK_TABS.map((it) => (it.value === 'more' ? { ...it, notification: true } : it));
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative" style={{ width: PHONE, height: H, marginTop: 20, background: rc('bg-layer-default'), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle')}` }}>
          <Pill items={items} tab="home" zone={{ root: markLine }} />
          {/* 칸 · 라벨 · + · 알림 — 자리에 칠 */}
          <span aria-hidden className="absolute" style={{ left: cellX(0) - 30, top: barTop + S.padY, width: 60, height: S.h - S.padY * 2, ...markBox, zIndex: 60 }} />
          <span aria-hidden className="absolute" style={{ left: cellX(1) - 20, top: labelTop, width: 40, height: labelH, ...markBox, zIndex: 60 }} />
          <span aria-hidden className="absolute" style={{ left: cellX(2) - S.add / 2, top: barTop + (S.h - S.add) / 2, width: S.add, height: S.add, borderRadius: 9999, ...markLine, zIndex: 60 }} />
          {pinAt('ⓐ', { left: -28, top: barTop + S.h / 2 - 10 })}
          {pinAt('ⓑ', { left: cellX(0) - 10, top: barTop - 28 })}
          {pinAt('ⓒ', { left: cellX(1) - 10, top: barTop + S.h + 8 })}
          {pinAt('ⓓ', { left: cellX(2) - 10, top: barTop - 28 })}
          {pinAt('ⓔ', { left: cellX(4) + L().icon.size / 2 - L().dot.right - L().dot.size / 2 - 10, top: barTop - 28 })}
        </div>
        <Legend
          items={[
            ['ⓐ', 'Root — 떠 있는 알약'],
            ['ⓑ', 'Item'],
            ['ⓒ', 'Label'],
            ['ⓓ', 'Add Button'],
            ['ⓔ', 'Notification'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Size: Fig = ({ caption }) => {
  const cases: { size: TabSize; safe: number; label: string }[] = [
    { size: 'regular', safe: 0, label: '펼침 · 홈 표시줄 없음' },
    { size: 'regular', safe: 34, label: '펼침 · 홈 표시줄 34' },
    { size: 'compact', safe: 0, label: '줄어듦 · 홈 표시줄 없음' },
    { size: 'compact', safe: 34, label: '줄어듦 · 홈 표시줄 34' },
  ];
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2" style={{ width: 'max-content' }}>
        {cases.map((c) => {
          const S = L().sizes[c.size];
          const b = tabBottom(L(), c.size, c.safe);
          const h = tabBottom(L(), 'regular', 34) + L().sizes.regular.h + 26;
          return (
            <div key={c.label} className="flex flex-col items-center gap-2">
              <BottomStrip size={c.size} safe={c.safe} h={h} w={280}>
                <Band style={{ left: 0, bottom: b + S.h - 10, width: S.marginX, height: 6 }} label={`${S.marginX}`} tag="above" />
                <Band style={{ right: 0, bottom: b + S.h - 10, width: S.marginX, height: 6 }} label={`${S.marginX}`} tag="above" />
                <Band style={{ left: S.marginX + 26, bottom: 0, width: 6, height: b }} label={`${b}`} vertical tag="right" />
                <Band style={{ right: S.marginX - 8, bottom: b, width: 6, height: S.h }} label={`${S.h}`} vertical tag="right" />
              </BottomStrip>
              <Cap>
                {c.label} — 높이 {S.h} · 좌우 {S.marginX} · 아래 {b}
                {c.safe ? `(${c.safe} − ${S.bottomMinus})` : ''}
              </Cap>
            </div>
          );
        })}
      </div>
    </Figure>
  );
};

const Selected: Fig = ({ caption }) => {
  const row = (label: string, node: ReactNode) => (
    <div className="flex flex-col items-center gap-1.5">
      {node}
      <Cap>{label}</Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        {row('Desk — 지금 탭 홈', <BottomStrip tab="home" />)}
        {row('Desk — 지금 탭 캘린더(+ 의 이름은 일정 추가)', <BottomStrip tab="calendar" />)}
        {row('HR 브랜드 — + 만 브랜드 색', <BottomStrip brand="hr" tab="ledger" />)}
        {row(`다크 — 지금 탭 짙은 글자색 · 선 ${L().icon.selStroke}, 다른 탭 선 ${L().icon.stroke}`, <BottomStrip mode="dark" tab="home" />)}
      </div>
    </Figure>
  );
};

const Add: Fig = ({ caption }) => {
  const S = L().sizes.regular;
  const z = 2;
  return (
    <Figure caption={caption}>
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative overflow-hidden rounded-xl" style={{ width: 150, height: 150, background: rc('bg-layer-floating') }}>
            <div className="absolute" style={{ left: 75 - cellX(2) * z, top: 75 - (S.h / 2) * z, transform: `scale(${z})`, transformOrigin: 'left top' }}>
              <div className="relative" style={{ width: PHONE, height: S.h + tabBottom(L(), 'regular', 0) }}>
                <Pill tab="home" />
              </div>
            </div>
            <Band style={{ left: 75 - (S.add * z) / 2, top: 75 + (S.add * z) / 2 + 4, width: S.add * z, height: 6 }} label={`${S.add}`} tag="below" />
          </div>
          <Cap>원 {S.add} · + {S.addIcon}(선 {L().add.iconStroke}) · 브랜드 채움</Cap>
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-1.5">
            <BottomStrip tab="home" w={300} />
            <Reading tone="ok">거래 추가, 버튼</Reading>
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <BottomStrip tab="calendar" w={300} />
            <Reading tone="ok">일정 추가, 버튼</Reading>
          </div>
        </div>
      </div>
    </Figure>
  );
};

// 끝까지 내린 목록 — 마지막 줄이 바 위 inset 의 끝(24)에서 끝난다
const Inset: Fig = ({ caption }) => {
  const k = L();
  const gap = k.inset.gap;
  const zone = tabBottom(k, 'regular', 0) + k.sizes.regular.h;
  return (
    <Plate caption={caption}>
      <Pair>
        <Verdict ok note={`본문 아래 여백(바의 아래 자리 + ${k.sizes.regular.h} + ${gap}) — 끝까지 내리면 마지막 줄이 바 위 ${gap} 에서 끝난다`}>
          <NPhone scale={0.5} h={600} tabs tab="ledger" bar={<Bar type="root" title="가계부" actions={[{ icon: 'search', label: '검색' }]} />}>
            <div className="flex h-full flex-col justify-end">
              <TxRows n={10} from={0} />
              <div className="relative" style={{ height: gap }}>
                <Band style={{ left: 24, width: 8, top: 0, bottom: 0 }} label={`${gap}`} tag="right" />
              </div>
            </div>
          </NPhone>
        </Verdict>
        <Verdict ok={false} note="여백 없이 — 끝까지 내려도 마지막 줄(책)이 바에 덮인다">
          <NPhone scale={0.5} h={600} bar={<Bar type="root" title="가계부" actions={[{ icon: 'search', label: '검색' }]} />} overlay={<Pill tab="ledger" />}>
            <div className="flex h-full flex-col justify-end" style={{ paddingBottom: zone - 40 }}>
              <TxRows n={10} from={0} />
            </div>
          </NPhone>
        </Verdict>
      </Pair>
    </Plate>
  );
};

// 칸 하나를 잘라 크게 — 상태 그림
function CellCrop({ mode, cell, state, label }: { mode: Mode; cell: number; state?: 'pressed' | 'focused'; label: string }) {
  const S = L().sizes.regular;
  const b = tabBottom(L(), 'regular', 0);
  const w = 72;
  const h = S.h + 20;
  const value = DESK_TABS[cell < 2 ? cell : cell - 1]?.value;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative overflow-hidden rounded-lg" style={{ width: w, height: h, background: rc('bg-layer-basement', mode) }}>
        <div className="absolute" style={{ left: w / 2 - cellX(cell), top: h - (S.h + b) - 10 }}>
          <div className="relative" style={{ width: PHONE, height: S.h + b }}>
            <Pill mode={mode} tab="ledger" states={cell !== 2 && state && value ? { [value]: state } : undefined} addState={cell === 2 ? state : undefined} />
          </div>
        </div>
      </div>
      <span className="text-[11px]" style={{ color: rc('fg-neutral-subtle', mode) }}>{label}</span>
    </div>
  );
}
const States: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col gap-2 rounded-xl" style={{ background: rc('bg-layer-default', mode), paddingTop: 12, paddingBottom: 12, paddingLeft: 14, paddingRight: 14 }}>
          <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>{modeKo(mode)}</span>
          <div className="flex gap-4">
            <CellCrop mode={mode} cell={1} label="칸 — 기본" />
            <CellCrop mode={mode} cell={1} state="pressed" label="칸 — 누름(축소만)" />
            <CellCrop mode={mode} cell={1} state="focused" label="칸 — 포커스(안쪽)" />
            <CellCrop mode={mode} cell={2} state="pressed" label="+ — 누름" />
            <CellCrop mode={mode} cell={2} state="focused" label="+ — 포커스(바깥)" />
          </div>
        </div>
      ))}
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
const MONEY_BAD = [
  { value: 'back', label: '홈', icon: 'chevron-left' as const },
  { value: 'ledger', label: '가계부', icon: 'ledger' as const },
  { value: 'assets', label: '자산', icon: 'wallet' as const },
  { value: 'stats', label: '통계', icon: 'pie' as const },
  { value: 'budget', label: '예산', icon: 'target' as const },
];
const MoneyGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="탭 바는 홈 · 가계부 · + · 캘린더 · 전체 그대로 — 가계부 · 자산 · 통계 · 예산은 화면 위 Line Tabs">
        <LedgerScreen scale={0.46} h={600} value="assets" />
      </Verdict>
      <Verdict ok={false} note="가계부에 들어가면 탭 바 칸을 ← · 넷으로 바꾼다 — 캘린더 · 전체로 바로 못 간다">
        <NPhone scale={0.46} h={600} bg="bg-layer-basement" bar={<Bar type="root" title="자산" actions={[{ icon: 'search', label: '검색' }]} />} overlay={<Pill items={MONEY_BAD} tab="assets" noAdd />}>
          <div style={cardStack()}>
            <TxCard title="계좌" action="관리">
              <TxRows n={4} rows={ASSET_ROWS} />
            </TxCard>
          </div>
        </NPhone>
      </Verdict>
    </Pair>
  </Plate>
);

const CompactGuide: Fig = ({ caption }) => {
  const k = L();
  const step = (node: ReactNode, cap: string) => (
    <div className="flex w-[118px] flex-col items-center gap-2">
      {node}
      <Cap>{cap}</Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-start gap-1">
          {step(<LedgerScreen scale={0.32} h={600} />, '맨 위 — 펼침')}
          <Arrow label={`↓ ${k.scroll.shrink}`} />
          {step(<LedgerScreen scale={0.32} h={600} tabSize="compact" from={3} />, `아래로 ${k.scroll.shrink} 이상 — 줄어듦 ${k.sizes.compact.h}`)}
          <Arrow label={`↑ ${k.scroll.expand}`} />
          {step(<LedgerScreen scale={0.32} h={600} from={2} />, `위로 ${k.scroll.expand} 이상 · 맨 위 ${k.scroll.top} 안 — 펼침`)}
          <Arrow label="누름" />
          {step(
            <div className="relative">
              <LedgerScreen scale={0.32} h={600} tabSize="compact" from={3} />
              <Tap x={PHONE * 0.32 * 0.5} y={600 * 0.32 - 24} />
            </div>,
            '줄어든 바를 누르면 펴진다',
          )}
        </div>
        <Reading tone="ok">줄어든 바도 칸마다 이름 — 홈 · 가계부 · 거래 추가 · 캘린더 · 전체</Reading>
      </div>
    </Figure>
  );
};

function ScrollMark({ y, label }: { y: string; label: string }) {
  return (
    <span className="absolute right-1 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ top: y, background: '#DB2777', zIndex: 150 }}>
      {label}
    </span>
  );
}
const RetapGuide: Fig = ({ caption }) => {
  const s = 0.3;
  const cell = (i: number) => cellX(i) * s;
  const tapY = 600 * s - (tabBottom(L(), 'regular', 0) + L().sizes.regular.h / 2) * s;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="relative">
              <HomeScreen scale={s} h={600} scrolled />
              <ScrollMark y="40%" label="600" />
              <Tap x={cell(3)} y={tapY} />
            </div>
            <Arrow label="캘린더" />
            <NPhone scale={s} h={600} tabs tab="calendar" bg="bg-layer-basement" bar={<Bar type="root" title="캘린더" />}>
              <FloorBands>
                <>
                  <DayHead day="10월 8일 (목)" total="일정 2" />
                  <TxRows n={5} from={4} />
                </>
              </FloorBands>
            </NPhone>
            <Arrow label="홈" />
            <div className="relative">
              <HomeScreen scale={s} h={600} scrolled />
              <ScrollMark y="40%" label="600" />
            </div>
          </div>
          <Cap>탭마다 기억 — 홈을 600 내려 두고 캘린더를 다녀와도 홈은 600</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="relative">
              <HomeScreen scale={s} h={600} scrolled />
              <ScrollMark y="40%" label="600" />
              <Tap x={cell(0)} y={tapY} />
            </div>
            <Arrow label="홈 다시" />
            <HomeScreen scale={s} h={600} />
          </div>
          <Cap>지금 탭을 다시 누르면 그 탭의 첫 화면 · 맨 위로(같은 주소를 쌓지 않는다)</Cap>
        </div>
      </div>
    </Figure>
  );
};

const AddGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <Pair>
        <Verdict ok note="홈 · 가계부 · 전체 — + 의 이름은 &ldquo;거래 추가&rdquo;">
          <div className="flex flex-col items-center gap-2">
            <HomeScreen scale={0.42} h={600} />
            <Reading tone="ok">거래 추가, 버튼</Reading>
          </div>
        </Verdict>
        <Verdict ok note="캘린더 — 같은 자리 + 의 이름이 &ldquo;일정 추가&rdquo;">
          <div className="flex flex-col items-center gap-2">
            <NPhone scale={0.42} h={600} tabs tab="calendar" bg="bg-layer-basement" bar={<Bar type="root" title="캘린더" />}>
              <FloorBands>
                <>
                  <DayHead day="10월 8일 (목)" total="일정 2" />
                  <TxRows n={6} from={4} />
                </>
              </FloorBands>
            </NPhone>
            <Reading tone="ok">일정 추가, 버튼</Reading>
          </div>
        </Verdict>
      </Pair>
      <Pair>
        <Verdict ok={false} note="+ 를 라벨 붙은 탭 칸으로 — 탭이 아니라 그 화면의 추가다">
          <BottomStrip tab="home" w={260}>
            <span aria-hidden className="absolute flex flex-col items-center gap-0.5" style={{ left: cellX(2, 'regular', 260) - 24, bottom: tabBottom(L(), 'regular', 0) + 6, width: 48, height: 54, paddingTop: 6, background: rc('bg-layer-floating'), zIndex: 80 }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-[7px] text-[16px] font-bold leading-none text-white" style={{ background: rc('bg-brand-solid') }}>
                +
              </span>
              <span className="text-[11px] font-medium leading-[15px]" style={{ color: rc('fg-neutral-subtle') }}>
                추가
              </span>
            </span>
          </BottomStrip>
        </Verdict>
        <Verdict ok={false} note="+ 를 탭 바에서 빼 떠 있는 버튼으로 — 탭 바가 있는 화면에 떠 있는 버튼을 두지 않는다">
          <NPhone scale={0.42} h={600} bar={<Bar type="root" title="홈" actions={HOME_ACTIONS} />} overlay={<><Pill tab="home" noAdd /><Fab place="absolute" label="거래 추가" bottom={tabBottom(L(), 'regular', 0) + L().sizes.regular.h + NK().fab.bottom} /></>}>
            <TxRows n={8} />
          </NPhone>
        </Verdict>
      </Pair>
    </div>
  </Plate>
);

const StackGuide: Fig = ({ caption }) => {
  const sl = snackbarLook();
  return (
    <Plate caption={caption}>
      <Pair>
        <Verdict ok note={`스낵바는 탭 바 위 ${sl.region.padBottom} — 탭 바를 SnackbarAvoidOverlap 으로 감싼다`}>
          <NPhone scale={0.46} h={600} tabs tab="ledger" bar={<Bar type="root" title="가계부" actions={[{ icon: 'search', label: '검색' }]} />}>
            <DayHead />
            <TxRows n={8} />
            <SnackDock>
              <SnackbarView look={sl} state="enabled" message="거래를 삭제했어요." action={{ label: '되돌리기' }} />
            </SnackDock>
          </NPhone>
        </Verdict>
        <Verdict ok note="입력은 시트로 — 시트 · 딤이 탭 바를 덮는다">
          <NPhone
            scale={0.46}
            h={600}
            tabs
            tab="ledger"
            bar={<Bar type="root" title="가계부" actions={[{ icon: 'search', label: '검색' }]} />}
            overlay={
              <Sheet title="거래 추가">
                <div className="flex flex-col gap-3 px-6 pb-2">
                  {['금액', '내용', '카테고리'].map((l) => (
                    <span key={l} className="flex items-center rounded-xl text-[15px]" style={{ height: 52, paddingLeft: 16, background: rc('bg-neutral-weak'), color: rc('fg-placeholder') }}>
                      {l}
                    </span>
                  ))}
                </div>
              </Sheet>
            }
          >
            <DayHead />
            <TxRows n={8} />
          </NPhone>
        </Verdict>
      </Pair>
    </Plate>
  );
};

// ── 코드 예시(미리보기) — bottom-navigation.md 의 코드 그대로 ──────
const ExShell: Fig = ({ caption }) => {
  const S = L().sizes.regular;
  return (
    <CodePreview caption={caption} pad={0} bg="bg-layer-basement" padX={0}>
      <div className="relative mx-auto" style={{ width: PHONE, height: S.h + tabBottom(L(), 'regular', 0) * 2 }}>
        <Pill tab="home" live />
      </div>
    </CodePreview>
  );
};

export const bottomNavigationFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  selected: Selected,
  add: Add,
  inset: Inset,
  states: States,
  'money-guide': MoneyGuide,
  'compact-guide': CompactGuide,
  'retap-guide': RetapGuide,
  'add-guide': AddGuide,
  'stack-guide': StackGuide,
  'ex-shell': ExShell,
};

