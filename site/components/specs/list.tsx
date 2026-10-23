// List 페이지의 그림 — specs/components/list.md 의 `[그림: …](../../site/components/specs/list.tsx#<id>)` 자리.
// 줄 · 목록 제목은 list.yaml · list-header.yaml 을 푼 값(listLook)으로, 화면 예시는 kit 의 Desk 화면 조각으로 그린다.
import { Children, Fragment, isValidElement, type CSSProperties, type ReactNode } from 'react';
import { Coffee, Utensils } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { listLook, LIST_STATES, type ListState, type RowSpec } from './list-look';
import { ListHeaderView, ListView, type ViewMode } from './list-view';
import { ListPlayground } from './list-playground';
import { ExNested, ExNestedFixed, Nested, NestedFixed } from './list-nest';
import { Card, Phone, Verdict, rc, type Mode } from './kit';
import { PhoneBoard, T, TX, items, txRow, type Tx } from './display-screens';
import { Card as CardArt, LTL, Logo } from './image-screens';

type Fig = (p: { caption?: string }) => ReactNode;
const look = () => listLook('desk');

// 목록 하나 — 서버 그림에서 브라우저 그림(ListView)으로
function L({ rows, mode = 'auto', live = true, divider, width = '100%', ariaLabel, bgRadius, padX, style }: { rows: RowSpec[]; mode?: ViewMode; live?: boolean; divider?: 'none' | 'full' | 'inset'; width?: number | string; ariaLabel?: string; bgRadius?: number; padX?: (number | undefined)[]; style?: CSSProperties }) {
  return <ListView look={look()} rows={rows} mode={mode} live={live} divider={divider} width={width} ariaLabel={ariaLabel} bgRadius={bgRadius} padX={padX} style={style} />;
}
function H({ title, variant, action, mode = 'auto' }: { title: string; variant?: 'mediumWeak' | 'boldSolid'; action?: string; mode?: ViewMode }) {
  return <ListHeaderView look={look()} title={title} variant={variant} action={action} mode={mode} />;
}

function Cap({ children, strong }: { children?: ReactNode; strong?: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
      {strong && <b className="text-[13px] pk-text">{strong}</b>}
      {children}
    </span>
  );
}
// 흰 판 — 목록은 좌우 여백을 스스로 가지므로 판에는 위아래만
function Surface({ mode = 'auto', children, className = '', bg = 'bg-layer-default', flush = false, style }: { mode?: Mode; children: ReactNode; className?: string; bg?: string; flush?: boolean; style?: CSSProperties }) {
  return (
    <div className={`overflow-hidden rounded-xl ${flush ? '' : 'py-2'} ${className}`} style={{ background: rc(bg, mode), ...style }}>
      {children}
    </div>
  );
}
function Cell({ label, children, mode = 'auto' }: { label?: ReactNode; children: ReactNode; mode?: Mode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode}>{children}</Surface>
      {label && <Cap>{label}</Cap>}
    </div>
  );
}
const STATE_KO: Record<ListState, string> = { enabled: '기본', hovered: '호버', focused: '포커스', pressed: '누름', disabled: '비활성' };

// ── 화면 예시의 줄 ────────────────────────────────────────
const SETTINGS: RowSpec[] = [
  { kind: 'button', prefix: { icon: 'user' }, title: '계정', suffix: { chevron: true } },
  { kind: 'button', prefix: { icon: 'globe' }, title: '기본 통화', suffix: { text: '대한민국 원', chevron: true } },
  { kind: 'button', prefix: { icon: 'moon' }, title: '화면 모드', suffix: { text: '시스템 설정', chevron: true } },
];
const NOTI: RowSpec[] = [
  { kind: 'switch', prefix: { icon: 'bell' }, title: '결제 알림', detail: '결제 예정일 하루 전 · 당일', checked: true },
  { kind: 'switch', prefix: { icon: 'piggy-bank' }, title: '예산 알림', detail: '카테고리 예산 80% · 100%', checked: true },
  { kind: 'switch', prefix: { icon: 'receipt' }, title: '주간 리포트', detail: '매주 월요일 오전 9시', checked: false },
];
const CURRENCY: RowSpec[] = [
  { kind: 'radio', title: '대한민국 원', detail: 'KRW', value: 'KRW', checked: true },
  { kind: 'radio', title: '미국 달러', detail: 'USD', value: 'USD' },
  { kind: 'radio', title: '유로', detail: 'EUR', value: 'EUR' },
  { kind: 'radio', title: '일본 엔', detail: 'JPY', value: 'JPY' },
];
// 거래 줄의 설명은 Tag Group(t3 · 한 줄 말줄임 — list.md Detail). 그림의 모드를 따라 그린다
const meta = (mode: ViewMode, ...labels: string[]) => <T items={items(...labels)} size="t3" truncate mode={mode} />;
const ledger = (mode: ViewMode = 'auto'): RowSpec[] => [
  { kind: 'button', prefix: { tile: 'brown', icon: 'coffee' }, title: '스타벅스 강남점', detailNode: meta(mode, '카페', '신한카드'), suffix: { amount: '−5,800원' } },
  { kind: 'button', prefix: { tile: 'blue', icon: 'bus' }, title: '지하철', detailNode: meta(mode, '교통', '체크카드'), suffix: { amount: '−1,450원' } },
  { kind: 'button', prefix: { tile: 'green', icon: 'wallet' }, title: '급여', detailNode: meta(mode, '수입', '국민은행'), suffix: { amount: '+3,200,000원' } },
];
const LEDGER = ledger();
const ALERTS: RowSpec[] = [
  { kind: 'button', highlighted: true, prefix: { tile: 'orange', icon: 'piggy-bank' }, title: '예산 80% 도달', detail: '식비 예산의 80%를 썼어요 · 방금' },
  { kind: 'button', highlighted: true, prefix: { tile: 'blue', icon: 'credit-card' }, title: '내일 카드 결제', detail: '신한카드 125,000원 · 1시간 전' },
  { kind: 'button', prefix: { tile: 'violet', icon: 'receipt' }, title: '주간 리포트가 도착했어요', detail: '9월 넷째 주 · 어제' },
];

// 화면 — DESIGN.md Layout 의 "화면 바탕"(2026-10-16 Q-019-3 C). 묶음 목록 화면(설정 · 알림 …)은 회색 바닥 위에 묶음(목록 제목 + 줄)마다
// 화면 폭 흰 띠를 8 띄워 쌓는다 — 띠 안 위 4 · 아래 8, 첫 띠 위 · 마지막 띠 아래에는 틈이 없다(2026-10-23). 가계부 거래 목록만 흰 화면(floor="white")이다
function Screen({ title, children, mode = 'auto', scale = 0.56, h = 600, floor = 'bands' }: { title: string; children: ReactNode; mode?: Mode; scale?: number; h?: number; floor?: 'bands' | 'white' }) {
  if (floor === 'white') {
    return (
      <Phone title={title} mode={mode} scale={scale} h={h} bg="bg-layer-default">
        <div className="flex flex-col pt-1">{children}</div>
      </Phone>
    );
  }
  // 목록 제목(H)이 나올 때마다 새 띠
  const bands: ReactNode[][] = [];
  for (const c of Children.toArray(children)) {
    if (!bands.length || (isValidElement(c) && c.type === H && bands[bands.length - 1].length)) bands.push([]);
    bands[bands.length - 1].push(c);
  }
  return (
    <Phone title={title} mode={mode} scale={scale} h={h} bg="bg-layer-basement">
      <div className="flex flex-col gap-2">
        {bands.map((b, i) => (
          <div key={i} className="flex flex-col pb-2 pt-1" style={{ background: rc('bg-layer-default', mode) }}>
            {b}
          </div>
        ))}
      </div>
    </Phone>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-3">
      <Screen title="설정" mode="light" h={500}>
        <H title="일반" mode="light" />
        <L rows={SETTINGS} mode="light" live={false} />
        <H title="알림" mode="light" />
        <L rows={NOTI.slice(0, 2)} mode="light" live={false} />
      </Screen>
      <Screen title="기본 통화" mode="dark" h={500}>
        <L rows={CURRENCY} mode="dark" live={false} ariaLabel="기본 통화" />
      </Screen>
      <Screen title="알림" mode="light" h={500}>
        <L rows={ALERTS} mode="light" live={false} />
        <H title="이번 주" mode="light" />
        <L rows={ledger('light').slice(0, 2)} mode="light" live={false} />
      </Screen>
    </div>
  </Figure>
);

const Playground: Fig = () => <ListPlayground looks={{ desk: listLook('desk'), hr: listLook('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
function Pin({ n, children, below, className = '' }: { n: string; children: ReactNode; below?: boolean; className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span className={`absolute left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center ${below ? '-bottom-10 flex-col-reverse' : '-top-10'}`}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
          {n}
        </span>
        <span className="h-4 w-px" style={{ background: MARK_LINE }} />
      </span>
      {children}
    </span>
  );
}
const Anatomy: Fig = ({ caption }) => {
  const lk = look();
  const f = lk.faces.none.light.enabled;
  const h = lk.header.mediumWeak.light;
  const box = (extra?: CSSProperties): CSSProperties => ({ outline: `1px dashed ${MARK_LINE}`, background: MARK, ...extra });
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-14 rounded-xl pk-surface px-6 pb-8 pt-16">
        <div className="w-[400px]" style={{ fontFamily: f.title.fontFamily }}>
          <div style={{ padding: `${h.padY}px ${h.padX}px`, fontSize: h.fontSize, lineHeight: h.lineHeight, fontWeight: h.fontWeight, color: rc('fg-neutral-subtle') }}>
            <Pin n="ⓔ">
              <span style={{ outline: `1px dashed ${MARK_LINE}`, background: MARK }}>일반</span>
            </Pin>
          </div>
          <div className="mt-8 flex items-center" style={{ padding: `${f.pad.y}px ${f.pad.x}px`, outline: `1px solid ${rc('stroke-neutral-weak')}` }}>
            <span className="flex shrink-0" style={{ paddingRight: f.prefix.padRight }}>
              <Pin n="ⓐ" below>
                <span className="inline-grid place-items-center" style={box({ width: f.prefix.iconSize, height: f.prefix.iconSize })}>
                  <svg width={f.prefix.iconSize} height={f.prefix.iconSize} viewBox="0 0 24 24" fill="none" stroke={rc('fg-neutral')} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </span>
              </Pin>
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-start" style={{ gap: f.body.gap, paddingRight: f.body.padRight }}>
              <Pin n="ⓑ">
                <span style={{ fontSize: f.title.fontSize, lineHeight: f.title.lineHeight, fontWeight: f.title.fontWeight, color: rc('fg-neutral'), ...box() }}>기본 통화</span>
              </Pin>
              <Pin n="ⓒ" below>
                <span style={{ fontSize: f.detail.fontSize, lineHeight: f.detail.lineHeight, color: rc('fg-neutral-subtle'), ...box() }}>새 거래에 먼저 들어가요</span>
              </Pin>
            </span>
            <Pin n="ⓓ">
              <span className="flex items-center" style={{ gap: f.suffix.gap, fontSize: f.suffix.fontSize, lineHeight: f.suffix.lineHeight, color: rc('fg-neutral-subtle'), ...box() }}>
                대한민국 원
                <svg width={f.suffix.iconSize} height={f.suffix.iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </Pin>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 text-center text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Prefix'],
            ['ⓑ', 'Title'],
            ['ⓒ', 'Detail'],
            ['ⓓ', 'Suffix'],
            ['ⓔ', 'List Header'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Kinds: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Cell label={<><b className="pk-text">보기만 하는 줄</b> ListItem — 누르지 않는다</>}>
        <L rows={[{ kind: 'view', title: '가입일', suffix: { text: '2026년 3월 2일' } }, { kind: 'view', title: '버전', suffix: { text: '1.23.0' } }]} />
      </Cell>
      <Cell label={<><b className="pk-text">누르는 줄</b> ListButtonItem — 줄 전체가 버튼</>}>
        <L rows={SETTINGS.slice(0, 2)} />
      </Cell>
      <Cell label={<><b className="pk-text">링크 줄</b> ListLinkItem — 다른 페이지로</>}>
        <L rows={[{ kind: 'link', prefix: { icon: 'help' }, title: '도움말', suffix: { chevron: true } }, { kind: 'link', prefix: { icon: 'shield' }, title: '개인정보 처리방침', suffix: { icon: 'external' } }]} />
      </Cell>
      <Cell label={<><b className="pk-text">컨트롤 줄</b> 줄 어디를 눌러도 바뀐다</>}>
        <L rows={[{ kind: 'switch', title: '결제 알림', checked: true }, { kind: 'check', title: '거래 내역', checked: true }]} />
      </Cell>
    </div>
  </Panel>
);

const Align: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Cell label={<><b className="pk-text">center</b> 기본 — 앞 · 뒤가 본문의 세로 가운데</>}>
        <L rows={[{ kind: 'switch', prefix: { icon: 'bell' }, title: '결제 알림', detail: '결제 예정일 하루 전 · 당일', checked: true }]} />
      </Cell>
      <Cell label={<><b className="pk-text">top</b> 설명이 길 때 — 앞 · 뒤를 위에</>}>
        <L rows={[{ kind: 'switch', align: 'top', prefix: { icon: 'shield' }, title: '민감 정보 가리기', detail: '내보낸 파일에서 계좌번호 · 카드번호의 가운데 자리를 별표로 바꿔요. 받는 사람이 번호 전체를 보지 못해요', checked: true }]} />
      </Cell>
    </div>
  </Panel>
);

const Highlight: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      {(['light', 'dark'] as Mode[]).map((m) => (
        <Cell key={m} mode={m} label={m === 'light' ? '라이트' : '다크'}>
          <L rows={ALERTS} mode={m} />
        </Cell>
      ))}
    </div>
  </Panel>
);

const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[72px_1fr_1fr]">
      <span className="hidden sm:block" />
      <span className="hidden text-center text-[12px] font-bold pk-text sm:block">기본</span>
      <span className="hidden text-center text-[12px] font-bold pk-text sm:block">강조 highlighted</span>
      {LIST_STATES.map((st) => (
        <div key={st} className="contents">
          <span className="self-center text-[12px] pk-text">
            {STATE_KO[st]}
            <br />
            <span className="font-mono text-[10px] pk-muted">{st}</span>
          </span>
          {[false, true].map((hl) => (
            <Surface key={String(hl)} flush>
              <L rows={[{ kind: 'button', state: st, highlighted: hl, disabled: st === 'disabled', prefix: { icon: 'globe' }, title: '기본 통화', detail: '새 거래에 먼저', suffix: { text: '원', chevron: true } }]} />
            </Surface>
          ))}
        </div>
      ))}
    </div>
  </Panel>
);

const Live: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Surface>
        <H title="일반" />
        <L rows={[...SETTINGS.slice(0, 2), { kind: 'link', prefix: { icon: 'help' }, title: '도움말', suffix: { chevron: true } }, { kind: 'button', prefix: { icon: 'download' }, title: '내보내기', detail: '준비 중이에요', disabled: true }]} />
        <H title="알림" />
        <L rows={[ALERTS[0], NOTI[0], { ...NOTI[2], disabled: true }]} />
      </Surface>
      <Surface>
        <H title="기본 통화" />
        <L rows={CURRENCY.slice(0, 3)} ariaLabel="기본 통화" />
        <H title="내보낼 항목" />
        <L rows={[{ kind: 'check', title: '거래 내역', checked: true }, { kind: 'check', title: '예산' }, { kind: 'check', title: '자산', disabled: true, checked: true }]} ariaLabel="내보낼 항목" />
      </Surface>
    </div>
  </Panel>
);

// 카드 혜택 목록의 카드 그림 폭 — list.md Prefix 의 "카드 그림 56"
const CARD_ROW_W = 56;
const Prefix: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto max-w-[420px]">
      <Surface>
        <L
          rows={[
            { kind: 'button', prefix: { icon: 'bell' }, title: '알림', detail: '아이콘 22 — 설정 · 메뉴 줄', suffix: { chevron: true } },
            { kind: 'button', prefix: { tile: 'orange', icon: 'utensils' }, title: '점심 식사', detail: '타일 40 — 색이 뜻을 가진 내용 줄', suffix: { amount: '−12,000원' } },
            { kind: 'button', prefix: { node: <Logo name="신한" /> }, title: '신한 주거래 통장', detail: `로고 타일 ${LTL().sizes[LTL().defaults.size].size} — 은행 · 카드 같은 물건 줄`, suffix: { amount: '1,250,000원' } },
            { kind: 'button', prefix: { node: <CardArt width={CARD_ROW_W} issuer="신한카드" name="데일리 플러스" pic="card-h" /> }, title: '데일리 플러스', detail: `카드 그림 ${CARD_ROW_W} — 카드 자체가 줄인 자리`, suffix: { chevron: true } },
            { kind: 'button', prefix: { person: '김포레' }, title: '김포레', detail: `아바타 ${look().avatarSize.two} — 사람(한 줄이면 ${look().avatarSize.one})`, suffix: { chevron: true } },
            { kind: 'check', title: '거래 내역', detail: '체크 24 — 여럿 고르기', checked: true },
          ]}
        />
      </Surface>
    </div>
  </Panel>
);

const Suffix: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto max-w-[420px]">
      <Surface>
        <L
          rows={[
            { kind: 'button', title: '기본 통화', detail: '값 글자 + 화살표', suffix: { text: '대한민국 원', chevron: true } },
            { kind: 'button', title: '계정', detail: '화살표 — 화면을 옮긴다', suffix: { chevron: true } },
            { kind: 'switch', title: '결제 알림', detail: '스위치 32', checked: true },
            { kind: 'check', title: '예산', detail: '체크 24', markPosition: 'suffix', checked: true },
            { kind: 'button', title: '스타벅스 강남점', detail: '금액 — 그 화면이 정한다', suffix: { amount: '−5,800원' } },
            { kind: 'button', title: '즐겨찾는 가맹점', detail: '작은 버튼 — 따로 눌린다', suffix: { buttons: ['more'] } },
          ]}
        />
        <L rows={[{ kind: 'radio', title: '대한민국 원', detail: '라디오 24 — 하나 고르기', value: 'a', checked: true }]} ariaLabel="라디오 예" />
      </Surface>
    </div>
  </Panel>
);

// 값이 길 때 — 가장 나쁜 값(list.md Suffix "값이 길 때", 2026-10-15 사용자 결정 Q-001 A). 이름은 지어낸 것이다
const LONG_TX: RowSpec[] = [
  { kind: 'button', prefix: { tile: 'violet', icon: 'shopping-bag' }, title: '동네 정육점 본점 지하 1층 식품관 명절 한우 선물세트 · 추석 대량 구매', detail: '쇼핑 · 체크카드 · 해외결제', suffix: { amount: '−1,234,567,890,123원' } },
  { kind: 'button', prefix: { tile: 'indigo', icon: 'wallet' }, title: '입출금 통장', suffix: { amount: '−1,234,567,890,123원' } },
  { kind: 'button', prefix: { tile: 'orange', icon: 'utensils' }, title: '점심', detail: '식비 · 현금', suffix: { amount: '−12,000원' } },
];
const LONG_KV: RowSpec[] = [
  { kind: 'view', title: '이메일', suffix: { text: 'groo.desk.design.system@example-company-domain.com' } },
  { kind: 'view', title: '가입일', suffix: { text: '2026년 3월 2일' } },
];
const LongValues: Fig = ({ caption }) => {
  const f = look().faces.none.light.enabled;
  const block = (w: number, rows: RowSpec[], m: 'light' | 'dark', strong: string, cap: string) => (
    <div className="flex max-w-full flex-col items-center gap-2">
      <div className="max-w-full overflow-x-auto">
        <Surface mode={m} style={{ width: w }}>
          <L rows={rows} mode={m} live={false} width={w} />
        </Surface>
      </div>
      <Cap strong={`${strong} · ${m === 'light' ? '라이트' : '다크'}`}>{cap}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        {(['light', 'dark'] as const).map((m) => (
          <div key={m} className="flex max-w-full flex-wrap items-start justify-center gap-6">
            {block(320, LONG_TX, m, '320 · 거래 줄', '금액은 한 줄 그대로 — 본문이 양보하고 제목 · 설명은 칸 끝에서 끊긴다')}
            {block(360, LONG_KV, m, '360 · 키-값 줄', '52자 이메일은 줄 끝에서 끊긴다 — "이메일" 은 한 글자 폭까지 눌린다')}
          </div>
        ))}
        <Cap>
          값은 줄지 않고 본문이 양보한다(SEED 와 같다) — 본문은 {f.body.minWidth}(뒤 여백 {f.body.padRight} 은 따로)까지 주고, 제목 · 설명은 overflow-wrap: {f.title.overflowWrap}(Tag Group 설명은 한 줄 말줄임). 글을 그대로 넘긴 값 글자만 본문이 한 글자 폭이 된 뒤에 줄 끝에서 끊긴다 — 겹치지 않는다. 값을 줄여 적는 것은 그 화면이 정한다
        </Cap>
      </div>
    </Panel>
  );
};

// 큰 글자 — 줄 안 폭이 제목 글자 16개(16em)보다 좁으면 값을 본문 아래로(list.md "큰 글자에서 값을 본문 아래로", 2026-10-17 03-D 결정 1 B).
// 글자만 배율로 키운다(앱처럼 — 타일 · 여백은 그대로). 금액은 쉼표 뒤에서만 줄을 바꾼다(결정 2 B — <wbr>). 이름 · 가게는 지어낸 것이다
type NarrowRow = { title: string; detail?: string; icon?: 'utensils' | 'coffee'; hue?: string; text?: string; amount?: string };
const NARROW_ROWS: NarrowRow[] = [
  { title: '이메일', text: 'groo.demo.long.address@example-company.co.kr' },
  { title: '점심 — 아주 긴 가게 이름이 두 줄 이상으로 이어질 때', detail: '식비 · 지어낸카드', icon: 'utensils', hue: 'orange', amount: '−123,456,789,012원' },
  { title: '숲길커피', detail: '카페 · 간식', icon: 'coffee', hue: 'brown', amount: '−4,500원' },
];
const NARROW_W = 360;
const NARROW_SCALES = [1, 1.3, 2];
// 금액 — 쉼표 뒤마다 줄바꿈 자리(<wbr>). 읽는 이름 · 복사에는 남지 않는다
const commaBreaks = (v: string) => v.split(',').map((part, i, all) => (
  <Fragment key={i}>
    {part}
    {i < all.length - 1 && <>,<wbr /></>}
  </Fragment>
));
function NarrowList({ mode, s }: { mode: 'light' | 'dark'; s: number }) {
  const lk = look();
  const f = lk.faces.none[mode].enabled;
  const n = lk.narrow;
  const t = parseFloat(f.title.fontSize);
  const inner = NARROW_W - f.pad.x * 2;
  const stacked = inner < n.below * t * s;
  const px = (v: string) => `${parseFloat(v) * s}px`;
  const title: CSSProperties = { fontSize: px(f.title.fontSize), lineHeight: px(f.title.lineHeight ?? f.title.fontSize), fontWeight: f.title.fontWeight, color: f.title.color, overflowWrap: 'anywhere', maxWidth: '100%' };
  const detail: CSSProperties = { fontSize: px(f.detail.fontSize), lineHeight: px(f.detail.lineHeight ?? f.detail.fontSize), color: f.detail.color, overflowWrap: 'anywhere', maxWidth: '100%' };
  const valueText: CSSProperties = { fontSize: px(f.suffix.fontSize), lineHeight: px(f.suffix.lineHeight ?? f.suffix.fontSize), color: f.suffix.color, overflowWrap: 'anywhere' };
  const amount: CSSProperties = { ...title, fontWeight: 700, fontVariantNumeric: 'tabular-nums', overflowWrap: 'normal', wordBreak: 'keep-all' };
  return (
    <div style={{ width: NARROW_W, background: lk.surface.default[mode], fontFamily: f.title.fontFamily }} className="flex flex-col py-2">
      {NARROW_ROWS.map((r) => {
        const Icon = r.icon === 'coffee' ? Coffee : Utensils;
        const value = r.amount ? <span style={{ ...amount, whiteSpace: stacked ? 'normal' : 'nowrap' }}>{commaBreaks(r.amount)}</span> : <span style={valueText}>{r.text}</span>;
        return (
          <div key={r.title} style={{ display: 'flex', alignItems: stacked ? n.alignItems : 'center', padding: `${f.pad.y}px ${f.pad.x}px` }}>
            {r.icon && r.hue && (
              <span style={{ display: 'flex', flexShrink: 0, paddingRight: f.prefix.padRight }}>
                <span aria-hidden style={{ display: 'inline-grid', placeItems: 'center', width: f.tile.size, height: f.tile.size, borderRadius: f.tile.radius, background: lk.tiles[r.hue].bg[mode], color: lk.tiles[r.hue].fg[mode] }}>
                  <Icon size={f.tile.iconSize} strokeWidth={2} />
                </span>
              </span>
            )}
            <span style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'flex-start', gap: f.body.gap, fontSize: px(f.title.fontSize), minWidth: stacked ? 0 : `calc(${f.body.minWidth} + ${f.body.padRight}px)`, paddingRight: stacked ? n.bodyPadRight : f.body.padRight }}>
              <span style={title}>{r.title}</span>
              {r.detail && <span style={detail}>{r.detail}</span>}
              {stacked && <span style={{ marginTop: n.marginTop, maxWidth: '100%', textAlign: 'left' }}>{value}</span>}
            </span>
            {!stacked && (r.amount ? <span style={{ flexShrink: 0 }}>{value}</span> : <span style={{ flexShrink: 1, minWidth: 0, textAlign: 'right' }}>{value}</span>)}
          </div>
        );
      })}
    </div>
  );
}
const Narrow: Fig = ({ caption }) => {
  const lk = look();
  const t = parseFloat(lk.faces.none.light.enabled.title.fontSize);
  const inner = NARROW_W - lk.faces.none.light.enabled.pad.x * 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        {(['light', 'dark'] as const).map((m) => (
          <div key={m} className="flex max-w-full flex-wrap items-start justify-center gap-6">
            {NARROW_SCALES.map((s) => {
              const em = inner / (t * s);
              const stacked = em < lk.narrow.below;
              return (
                <div key={s} className="flex max-w-full flex-col items-center gap-2">
                  <div className="max-w-full overflow-x-auto rounded-xl">
                    <NarrowList mode={m} s={s} />
                  </div>
                  <Cap strong={`글자 ${Math.round(s * 100)}% · ${m === 'light' ? '라이트' : '다크'}`}>
                    줄 안 {inner} = 제목 글자 {Number(em.toFixed(1))}개 — {stacked ? `${lk.narrow.below} 미만이라 값이 본문 아래로` : `${lk.narrow.below} 이상이라 한 줄(Q-001 A)`}
                  </Cap>
                </div>
              );
            })}
          </div>
        ))}
        <Cap>
          폭 360(좌우 {lk.faces.none.light.enabled.pad.x}) · 글자만 배율로 키웠다. 기준은 값의 길이가 아니라 줄 안 폭이다 — {lk.narrow.below}em 이상이면 값이 아무리 길어도 한 줄이다. 금액은 쉼표 뒤에서만 줄을 바꾼다
        </Cap>
      </div>
    </Panel>
  );
};

const Detail: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Cell label="한 줄">
        <L rows={[{ kind: 'button', prefix: { icon: 'calendar' }, title: '반복 거래', detail: '매달 25일 · 자동 기록', suffix: { chevron: true } }]} />
      </Cell>
      <Cell label="두 줄 — 그 이상이면 위 맞춤">
        <L rows={[{ kind: 'button', prefix: { icon: 'calendar' }, title: '반복 거래', detail: '매달 25일 · 자동 기록 · 하루 전 알림 · 주말이면 앞당겨요', suffix: { chevron: true } }]} />
      </Cell>
    </div>
  </Panel>
);

const Header: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Cell label={<><b className="pk-text">mediumWeak</b> 기본 — 14 · 500 · 옅은 색</>}>
        <H title="일반" />
        <L rows={SETTINGS.slice(0, 2)} />
      </Cell>
      <Cell label={<><b className="pk-text">boldSolid</b> 크게 나누는 묶음 — 14 · 700</>}>
        <H title="최근 거래" variant="boldSolid" action="전체 보기" />
        <L rows={LEDGER.slice(0, 2)} />
      </Cell>
    </div>
  </Panel>
);

const Divider: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-3">
      {(
        [
          ['none', '없음 — 기본'],
          ['full', '줄 폭'],
          ['inset', '들임 24'],
        ] as const
      ).map(([d, t]) => (
        <Cell key={d} label={t}>
          <L rows={SETTINGS.slice(0, 3).map((r) => ({ ...r, prefix: undefined }))} divider={d} />
        </Cell>
      ))}
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
// 좁은 화면에서는 위아래로 — 나란히 두면 줄의 본문이 몇 px 로 눌려 낱말이 칸 밖으로 넘친다(단어 단위 줄바꿈 v114)
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[640px] flex-col gap-4 sm:flex-row">{children}</div>;

const AllRows: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-4">
      <Screen title="설정" scale={0.7} h={560}>
        <H title="일반" />
        <L rows={SETTINGS} live={false} />
        <H title="알림" />
        <L rows={NOTI} live={false} />
      </Screen>
      <Screen title="가계부" scale={0.7} h={560} floor="white">
        <H title="오늘" variant="boldSolid" />
        <L rows={LEDGER} live={false} />
        <H title="어제" variant="boldSolid" />
        <L rows={[{ kind: 'button', prefix: { tile: 'orange', icon: 'utensils' }, title: '점심 식사', detailNode: meta('auto', '식비', '현대카드'), suffix: { amount: '−12,000원' } }, { kind: 'button', prefix: { tile: 'pink', icon: 'shopping-bag' }, title: '올리브영', detailNode: meta('auto', '쇼핑', '네이버페이'), suffix: { amount: '−23,400원' } }]} live={false} />
      </Screen>
    </div>
  </Figure>
);

const GroupGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="같은 묶음은 같은 목록 제목 — 어느 화면에서나 같은 모양">
        <Screen title="설정" scale={0.62} h={560}>
          <H title="일반" />
          <L rows={SETTINGS.slice(1)} live={false} />
          <H title="알림" />
          <L rows={NOTI.slice(0, 2)} live={false} />
          <H title="보안" />
          <L rows={[{ kind: 'button', prefix: { icon: 'lock' }, title: '앱 잠금', suffix: { text: '켜짐', chevron: true } }]} live={false} />
        </Screen>
      </Verdict>
      <Verdict ok={false} note="묶음마다 제목을 따로 짰다 — 크기 · 굵기 · 색이 제각각이다">
        <Screen title="설정" scale={0.62} h={560}>
          <div className="px-6 pb-1 pt-3 text-[18px] font-bold" style={{ color: rc('fg-neutral') }}>
            일반
          </div>
          <L rows={SETTINGS.slice(1)} live={false} />
          <div className="px-6 pb-1 pt-4 text-[12px] font-bold uppercase tracking-wide" style={{ color: rc('fg-brand') }}>
            알림
          </div>
          <L rows={NOTI.slice(0, 2)} live={false} />
          <div className="px-6 pb-1 pt-4 text-[15px] font-medium" style={{ color: rc('fg-neutral') }}>
            보안
          </div>
          <L rows={[{ kind: 'button', prefix: { icon: 'lock' }, title: '앱 잠금', suffix: { text: '켜짐', chevron: true } }]} live={false} />
        </Screen>
      </Verdict>
    </Pair>
  </Panel>
);

const ChevronGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="화면을 옮기는 줄에만 화살표 — 보기만 하는 줄(버전)은 값만">
        <Surface className="w-full">
          <L rows={[...SETTINGS.slice(0, 2), { kind: 'view', prefix: { icon: 'info' }, title: '버전', suffix: { text: '1.23.0' } }]} />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="버전에 화살표가 있는데 안 눌리고, 계정은 눌리는데 표시가 없다">
        <Surface className="w-full">
          <L rows={[{ ...SETTINGS[0], suffix: undefined }, SETTINGS[1], { kind: 'view', prefix: { icon: 'info' }, title: '버전', suffix: { text: '1.23.0', chevron: true } }]} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const TargetsGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      {/* 누르는 자리 하나 · 둘 · 셋(SEED List 그림처럼) — 넷 이상은 피한다(2026-10-22 5B) */}
      <Verdict ok note="하나(줄) · 둘(줄 + ⋮) · 셋(줄 + 즐겨찾기 + ⋮) — 셋 이하로 둔다">
        <Surface className="w-full">
          <L
            rows={[
              { kind: 'button', prefix: { tile: 'brown', icon: 'coffee' }, title: '동네 카페', detail: '하나 — 줄' },
              { kind: 'button', prefix: { tile: 'brown', icon: 'coffee' }, title: '동네 카페', detail: '둘 — 줄 · 더보기', suffix: { buttons: ['more'] } },
              { kind: 'button', prefix: { tile: 'brown', icon: 'coffee' }, title: '동네 카페', detail: '셋 — 줄 · 즐겨찾기 · 더보기', suffix: { buttons: ['star', 'more'] } },
            ]}
          />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="넷 — 줄 · 즐겨찾기 · 고치기 · 지우기. 피한다 — 줄을 나누거나 상세 화면으로">
        <Surface className="w-full">
          <L rows={[{ kind: 'button', prefix: { tile: 'brown', icon: 'coffee' }, title: '동네 카페', detail: '즐겨찾는 가맹점', suffix: { buttons: ['star', 'pencil', 'trash'] } }]} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

function Zone({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
      {children}
    </div>
  );
}
const ControlGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="줄 전체가 라벨 — 글자를 눌러도 스위치가 바뀐다(분홍이 누르는 영역)">
        <Surface className="w-full">
          <Zone>
            <L rows={[NOTI[0]]} />
          </Zone>
          <L rows={[NOTI[1]]} />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="컨트롤 줄에 따로 누르는 버튼 — 줄을 누르면 무엇이 바뀌는지 알 수 없다">
        <Surface className="w-full">
          <L rows={[{ ...NOTI[0], suffix: { buttons: ['more'] } }, NOTI[1]]} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const SelectGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="오른쪽 라디오 — 고른 것과 안 고른 것이 모두 보인다">
        <Surface className="w-full">
          <L rows={CURRENCY.slice(0, 3)} ariaLabel="기본 통화" />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="고른 줄에만 체크 — 나머지가 고를 수 있는 줄인지 보이지 않는다(옛 RadioList)">
        <Surface className="w-full">
          <L rows={CURRENCY.slice(0, 3).map((r) => ({ kind: 'button', title: r.title, detail: r.detail, suffix: r.checked ? { icon: 'check' } : undefined }))} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const SpacingGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="줄마다 같은 여백 — 아이콘 · 글자 · 화살표가 한 줄로 맞는다">
        <Surface className="w-full">
          <L rows={SETTINGS} />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="줄마다 여백이 달라(24 · 16 · 20) 아이콘 · 글자의 세로 줄이 어긋난다">
        <Surface className="w-full">
          <L rows={SETTINGS} padX={[undefined, 16, 20]} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const pressedMiddle = (rows: RowSpec[]) => rows.map((r, i) => (i === 1 ? { ...r, state: 'pressed' as const } : r));
const SurfaceGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="흰 바탕 위 — 누른 줄의 바탕이 보인다">
        <Surface className="w-full">
          <L rows={pressedMiddle(SETTINGS)} />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="회색 바탕(bg-layer-basement) 위 — 누름 바탕이 바탕과 거의 같아 보이지 않는다. 카드 · 흰 띠에 담는다">
        <Surface className="w-full" bg="bg-layer-basement">
          <L rows={pressedMiddle(SETTINGS)} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

// 누름 바탕이 잘 보이게 다크로 그린다
const ConcentricGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="카드 16 − 들임 6 = 10 — 누름 바탕이 카드와 같은 곡선" bg={rc('bg-layer-basement', 'dark')}>
        <Card mode="dark" body="list">
          <L rows={pressedMiddle(SETTINGS)} mode="dark" />
        </Card>
      </Verdict>
      <Verdict ok={false} note="누름 바탕을 카드와 같은 16 으로 — 안쪽 곡선이 바깥보다 커 보여 어긋난다" bg={rc('bg-layer-basement', 'dark')}>
        <Card mode="dark" body="list">
          <L rows={pressedMiddle(SETTINGS)} mode="dark" bgRadius={16} />
        </Card>
      </Verdict>
    </Pair>
  </Panel>
);

const PrefixGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="설정은 아이콘, 가계부는 타일 — 한 목록 안에서는 하나로">
        <div className="flex w-full flex-col gap-3">
          <Surface className="w-full">
            <L rows={SETTINGS.slice(0, 2)} />
          </Surface>
          <Surface className="w-full">
            <L rows={LEDGER.slice(0, 2)} />
          </Surface>
        </div>
      </Verdict>
      <Verdict ok={false} note="한 목록에 아이콘 · 타일 · 앞 없음이 섞였다 — 글자의 왼쪽 줄이 어긋난다">
        <Surface className="w-full">
          <L rows={[SETTINGS[0], LEDGER[0], { kind: 'button', title: '지하철', detailNode: meta('auto', '교통', '체크카드'), suffix: { amount: '−1,450원' } }, SETTINGS[1]]} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

// 섞이는 결과 — 다른 물건이 한 결과에 나오면(거래와 자산을 함께 찾는 검색) 목록 제목으로 묶음을 나눈다(2026-10-22 사용자 결정 6B). 이름은 지어냈다
const MIX_TX: RowSpec[] = [
  { kind: 'button', prefix: { tile: 'orange', icon: 'utensils' }, title: '하늘 식당', detailNode: meta('auto', '10월 19일', '식비'), suffix: { amount: '−23,000원' } },
  { kind: 'button', prefix: { tile: 'violet', icon: 'receipt' }, title: '하늘 정기 결제', detailNode: meta('auto', '10월 14일', '구독'), suffix: { amount: '−9,900원' } },
];
const MIX_ASSET: RowSpec = { kind: 'button', prefix: { node: <Logo name="하늘은행" /> }, title: '하늘은행 파킹통장', detailNode: meta('auto', '자산', '입출금'), suffix: { amount: '1,250,000원' } };
const MixGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="거래 · 자산을 목록 제목으로 나눈다 — 묶음마다 앞 붙이개가 하나(타일 · 로고 타일)">
        <Surface className="w-full">
          <H title="거래" />
          <L rows={MIX_TX} />
          <H title="자산" />
          <L rows={[MIX_ASSET]} />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="한 목록에 거래 타일과 자산 로고 타일이 섞였다 — 무엇이 거래이고 무엇이 계좌인지 줄마다 읽어야 한다">
        <Surface className="w-full">
          <L rows={[MIX_TX[0], MIX_ASSET, MIX_TX[1]]} />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

// 합계에 안 드는 줄 — 예정 · 환불(제목 · 금액만 옅게, 환불 금액 취소선, 배지는 보통 대비) · 줄 전체를 불투명도로 흐린 옛 모습
function ExcludedList({ dim = false }: { dim?: boolean }) {
  const ex = (tx: Tx) => (dim ? txRow({ ...tx, excluded: undefined }) : txRow(tx));
  return (
    <PhoneBoard pad={8}>
      <div className="flex items-baseline justify-between px-6 pb-1 pt-2">
        <span className="text-[13px] leading-[18px] pk-muted">10월 지출 · 합계에 드는 줄만</span>
        <span className="text-[17px] font-bold tabular-nums pk-text">−17,600원</span>
      </div>
      <L rows={[txRow(TX.starbucks)]} live={false} />
      {dim ? (
        <div style={{ opacity: 0.6 }}>
          <L rows={[ex(TX.netflix), ex(TX.coupang)]} live={false} />
        </div>
      ) : (
        <L rows={[ex(TX.netflix), ex(TX.coupang)]} live={false} />
      )}
      <L rows={[txRow(TX.lunch)]} live={false} />
    </PhoneBoard>
  );
}
const ExcludedRows: Fig = ({ caption }) => (
  <Panel caption={caption}>
    {/* 금액이 있는 거래 줄이라 늘 위아래로 — 둘로 나누면 줄이 눌린다 */}
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4">
      <Verdict ok note="제목 · 금액만 옅게(환불은 금액에 취소선) — 배지는 보통 대비라 줄을 가르는 단서가 또렷하다">
        <ExcludedList />
      </Verdict>
      <Verdict ok={false} note="줄 전체를 불투명도로 흐린다 — 그 줄을 가르는 배지까지 흐려진다">
        <ExcludedList dim />
      </Verdict>
    </div>
  </Panel>
);

// ── 코드 예시(미리보기) ───────────────────────────────────
function Preview({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="not-prose mt-6 mb-0">
      <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border px-2 py-6" style={{ background: rc('bg-layer-default') }}>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExBasic: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <L rows={[{ kind: 'view', title: '가입일', suffix: { text: '2026년 3월 2일' } }, { kind: 'view', title: '이메일', suffix: { text: 'groo@example.com' } }]} />
  </Preview>
);
const ExButton: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <H title="일반" />
    <L rows={SETTINGS.slice(0, 2)} />
  </Preview>
);
const ExSwitch: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <L rows={[{ kind: 'switch', prefix: { icon: 'bell' }, title: '결제 알림', detail: '결제 예정일 D-1, 결제일 당일 알림', checked: true }]} />
  </Preview>
);
const ExSelect: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <L rows={CURRENCY.slice(0, 2)} ariaLabel="기본 통화" />
    <div className="h-4" />
    <L rows={[{ kind: 'check', title: '거래 내역', checked: true }, { kind: 'check', title: '예산' }]} ariaLabel="내보낼 항목" />
  </Preview>
);
const ExStates: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <L
      rows={[
        { kind: 'button', highlighted: true, title: '예산 80% 도달', detail: '식비 예산의 80%를 썼어요' },
        { kind: 'button', disabled: true, title: '주간 리포트', detail: '푸시 알림이 꺼져 있어요' },
        { kind: 'view', align: 'top', prefix: { icon: 'info' }, title: '긴 제목은 두 줄을 넘으면 앞 · 뒤를 위로 맞춘다', detail: '설명이 길 때도 같다' },
      ]}
    />
  </Preview>
);

export const listFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  kinds: Kinds,
  align: Align,
  highlight: Highlight,
  states: States,
  live: Live,
  prefix: Prefix,
  suffix: Suffix,
  'long-values': LongValues,
  narrow: Narrow,
  detail: Detail,
  header: Header,
  divider: Divider,
  nested: Nested,
  'nested-fixed': NestedFixed,
  'all-rows': AllRows,
  'group-guide': GroupGuide,
  'chevron-guide': ChevronGuide,
  'targets-guide': TargetsGuide,
  'control-guide': ControlGuide,
  'select-guide': SelectGuide,
  'spacing-guide': SpacingGuide,
  'surface-guide': SurfaceGuide,
  'concentric-guide': ConcentricGuide,
  'prefix-guide': PrefixGuide,
  'mix-guide': MixGuide,
  'excluded-rows': ExcludedRows,
  'ex-basic': ExBasic,
  'ex-button': ExButton,
  'ex-switch': ExSwitch,
  'ex-select': ExSelect,
  'ex-states': ExStates,
  'ex-nested': ExNested,
  'ex-nested-fixed': ExNestedFixed,
};
