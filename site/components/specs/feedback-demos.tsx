'use client';
// 알림 메시지 넷의 실제로 누르는 미리보기 — 각 페이지의 코드 절(ex-*)이 쓴다.
// 띠 · 상자 · 결과는 YAML 대로(feedback-view), 칸 · Field 는 field · input.yaml(text-field-view), 버튼은 button.yaml(button-view) 그대로다.
// 화면 틀(폰 폭 360 · 머리 · 탭 바)은 그림 장식이라 역할 색으로 간단히 그린다. 미리보기 밖의 조작 버튼은 사이트 모양이다(제품 화면이 아니다).
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import { FONT, fcv, ms, type CalloutLook, type FbScreen, type FbScreenTone, type PageBannerLook, type ResultSectionLook, type SnackbarLook, type ViewMode } from './feedback-shared';
import { CalloutView, PageBannerView, ResultSectionView, SnackbarRegion, useSnackbarHost, type SnackbarHost } from './feedback-view';
import type { TfFieldLook, TfInputLook } from './text-field-shared';
import { TfFieldView, TfInputView } from './text-field-view';
import { DESK_TABS, addLabelFor } from './nav-data';
import { tabBottom } from './nav-shared';
import { TabBar, TopNavBar } from './nav-view';

const c = (s: FbScreen, name: FbScreenTone, mode: ViewMode) => fcv(s[name], mode);

// ── 화면 틀 — 폭 360(좁으면 줄어든다) · 머리 · 본문(띠 자리) · 아래(탭 바 · 바닥 버튼) ─────────
export function ScreenFrame({
  screen,
  mode = 'auto',
  title,
  onBack,
  height = 520,
  children,
  bottom,
  overlay,
  bg = 'bg-layer-default',
  label,
}: {
  screen: FbScreen;
  mode?: ViewMode;
  title?: string;
  onBack?: () => void;
  height?: number;
  children: ReactNode;
  bottom?: ReactNode;
  overlay?: ReactNode;
  bg?: FbScreenTone;
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label ?? title}
      data-demo-screen
      style={{
        position: 'relative',
        isolation: 'isolate',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 360,
        height,
        margin: '0 auto',
        borderRadius: 20,
        overflow: 'hidden',
        background: c(screen, bg, mode),
        color: c(screen, 'fg-neutral', mode),
        fontFamily: FONT,
      }}
    >
      {/* 화면 테두리 — 머리 · 아래 바탕이 덮지 않게 맨 위 층에 */}
      <span aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1000, borderRadius: 20, boxShadow: `inset 0 0 0 1px ${c(screen, 'stroke-neutral-subtle', mode)}`, pointerEvents: 'none' }} />
      {/* 머리 — Top Navigation(탭 첫 화면은 큰 제목, ← 가 있으면 그 아래 화면) */}
      {title !== undefined && <TopNavBar look={screen.nav.top} mode={mode} type={onBack ? 'standard' : 'root'} title={title} live={!!onBack} onLeading={onBack} />}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>{children}</div>
      {bottom}
      {overlay}
    </div>
  );
}

// 탭 바 — Bottom Navigation 의 떠 있는 알약(홈 · 가계부 · + · 캘린더 · 전체). 장식(누르지 않는다).
// 본문은 바 위 끝에서 끝난다 — 띠(스낵바)는 그 위 8 에 선다
export function DemoTabBar({ screen, mode = 'auto', tab = 'ledger' }: { screen: FbScreen; mode?: ViewMode; tab?: string }) {
  const look = screen.nav.tab;
  return (
    <div style={{ position: 'relative', flexShrink: 0, height: tabBottom(look, 'regular', 0) + look.sizes.regular.h, isolation: 'isolate' }}>
      <TabBar look={look} mode={mode} items={DESK_TABS} current={tab} addLabel={addLabelFor(tab)} />
    </div>
  );
}

// 바닥 고정 버튼 — 띠는 그 위 8 에 선다(버튼 자리는 본문 영역 밖)
export function BottomCta({ screen, mode = 'auto', look, label, onClick, loading = false }: { screen: FbScreen; mode?: ViewMode; look: ButtonLook; label: string; onClick?: () => void; loading?: boolean }) {
  return (
    <div style={{ flexShrink: 0, padding: '12px 24px 20px', background: c(screen, 'bg-layer-default', mode) }}>
      <ButtonView look={look} mode={mode} label={label} fill state={loading ? 'loading' : 'live'} onClick={onClick} />
    </div>
  );
}

// 목록 줄 — 앞 동그라미(카테고리 색) · 제목 · 부제 · 뒤 금액(+ 뒤 버튼)
export type DemoRow = { id: string; title: string; sub: string; amount: string; hue: 'orange' | 'blue' | 'green' | 'violet' | 'red' };
export function DemoRowView({ screen, mode = 'auto', row, trailing, highlight = false }: { screen: FbScreen; mode?: ViewMode; row: DemoRow; trailing?: ReactNode; highlight?: boolean }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', listStyle: 'none', transition: 'background-color 600ms', background: highlight ? c(screen, 'bg-neutral-weak', mode) : 'transparent', borderRadius: 12 }}>
      <span aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 40, height: 40, borderRadius: 9999, fontSize: 15, fontWeight: 700, background: c(screen, `chart-${row.hue}-weak` as FbScreenTone, mode), color: c(screen, `chart-${row.hue}-contrast` as FbScreenTone, mode) }}>
        {row.title.slice(0, 1)}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0 }}>
        <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.title}</span>
        <span style={{ fontSize: 13, lineHeight: '18px', color: c(screen, 'fg-neutral-subtle', mode), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.sub}</span>
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{row.amount}</span>
      {trailing}
    </li>
  );
}

// 미리보기 판 — 회색 판 위 화면 · 아래 조작 줄(사이트 모양)
export function DemoStage({ children, controls, note }: { children: ReactNode; controls?: ReactNode; note?: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="flex flex-wrap items-start justify-center gap-4">{children}</div>
        {controls && <div className="flex flex-wrap items-center justify-center gap-2">{controls}</div>}
        {note && <p className="text-center text-[12px] leading-5 text-fd-muted-foreground">{note}</p>}
      </div>
    </figure>
  );
}
// 미리보기 밖 조작 버튼 — 사이트 모양(제품 화면의 버튼이 아니다)
export function DemoButton({ children, onClick, disabled = false }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[13px] text-fd-foreground transition-colors hover:bg-fd-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

const LEDGER: DemoRow[] = [
  { id: 'lunch', title: '점심 식사', sub: '식비 · 현대카드 M', amount: '−12,000원', hue: 'orange' },
  { id: 'cafe', title: '스타벅스', sub: '카페 · 현대카드 M', amount: '−5,600원', hue: 'orange' },
  { id: 'subway', title: '지하철', sub: '교통 · 국민 체크카드', amount: '−1,450원', hue: 'blue' },
  { id: 'salary', title: '월급', sub: '수입 · 토스뱅크 통장', amount: '+3,200,000원', hue: 'green' },
];
const DayLine = ({ screen, mode = 'auto', label = '10월 2일 (금)' }: { screen: FbScreen; mode?: ViewMode; label?: string }) => (
  <div style={{ paddingTop: 12, fontSize: 13, lineHeight: '18px', color: c(screen, 'fg-neutral-subtle', mode) }}>{label}</div>
);

// ══ Snackbar ═════════════════════════════════════════════
// 거래 저장 — 저장할 때마다 목록 맨 위에 거래가 더해지고, 띠는 탭 바 위 8 에 뜬다(누를 때마다 지금 띠를 바로 바꾼다)
export function SnackBasicDemo({ look, cta }: { look: SnackbarLook; cta: ButtonLook }) {
  const s = look.screen;
  const host = useSnackbarHost(look);
  const [rows, setRows] = useState<DemoRow[]>(LEDGER.slice(1));
  const [fresh, setFresh] = useState<string | null>(null);
  const n = useRef(0);
  const save = () => {
    const id = `new-${++n.current}`;
    const row: DemoRow = { id, title: '점심 식사', sub: '식비 · 현대카드 M', amount: '−12,000원', hue: 'orange' };
    setRows((r) => [row, ...r].slice(0, 6));
    setFresh(id);
    host.show({ message: '거래를 저장했어요.' });
  };
  useEffect(() => {
    if (!fresh) return;
    const t = window.setTimeout(() => setFresh(null), 900);
    return () => window.clearTimeout(t);
  }, [fresh]);
  return (
    <DemoStage
      controls={
        <div className="w-full max-w-[240px]">
          <ButtonView look={cta} label="거래 저장하기" fill onClick={save} />
        </div>
      }
      note="저장하면 띠가 4초 동안 뜬다 — 마우스를 올리거나 Tab 으로 띠에 들어가면 멈추고, 떠나면 처음부터 센다."
    >
      <ScreenFrame screen={s} title="가계부" height={460} bottom={<DemoTabBar screen={s} />}>
        <ul style={{ margin: 0, padding: '0 24px' }}>
          <DayLine screen={s} />
          {rows.map((r) => (
            <DemoRowView key={r.id} screen={s} row={r} highlight={r.id === fresh} />
          ))}
        </ul>
        <SnackbarRegion host={host} look={look} />
      </ScreenFrame>
    </DemoStage>
  );
}

// 거래 삭제 · 되돌리기(6초) — 가볍게 실패(관심 종목)는 critical + "다시 시도"(6초 — Toggle 20A). 한 번에 하나
export function SnackActionDemo({ look }: { look: SnackbarLook }) {
  const s = look.screen;
  const host = useSnackbarHost(look);
  const [rows, setRows] = useState<DemoRow[]>(LEDGER);
  const remove = (i: number) => {
    const row = rows[i];
    setRows((r) => r.filter((x) => x.id !== row.id));
    host.show({
      message: '거래를 삭제했어요.',
      action: {
        label: '되돌리기',
        onClick: () =>
          setRows((r) => {
            if (r.some((x) => x.id === row.id)) return r;
            const next = [...r];
            next.splice(Math.min(i, next.length), 0, row);
            return next;
          }),
      },
    });
  };
  return (
    <DemoStage
      controls={
        <>
          <DemoButton
            onClick={() =>
              host.show({
                tone: 'critical',
                message: '관심 종목에 넣지 못했어요. 다시 시도해주세요.',
                // 같은 요청을 다시 보낸다 — 그림에서는 이번에는 넣어진다
                action: { label: '다시 시도', onClick: () => host.show({ tone: 'positive', message: '관심 종목에 넣었어요.' }) },
              })
            }
          >
            관심 종목 넣기 — 실패
          </DemoButton>
          <DemoButton onClick={() => setRows(LEDGER)} disabled={rows.length === LEDGER.length}>
            목록 되돌리기
          </DemoButton>
        </>
      }
      note="휴지통을 누르면 거래가 빠지고 띠가 6초 동안 뜬다(액션이 있으면 6초). 되돌리기를 누르면 그 자리로 돌아오고 띠는 닫힌다. 관심 종목 넣기가 실패하면 띠에 다시 시도가 달린다(6초)."
    >
      <ScreenFrame screen={s} title="가계부" height={460} bottom={<DemoTabBar screen={s} />}>
        <ul style={{ margin: 0, padding: '0 16px 0 24px' }}>
          <DayLine screen={s} />
          {rows.map((r, i) => (
            <DemoRowView
              key={r.id}
              screen={s}
              row={r}
              trailing={
                <button
                  type="button"
                  aria-label={`${r.title} 삭제`}
                  onClick={() => remove(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 40, height: 40, padding: 0, border: 0, borderRadius: 8, background: 'transparent', color: c(s, 'fg-neutral-subtle', 'auto'), cursor: 'pointer' }}
                >
                  <Trash2 aria-hidden size={18} strokeWidth={2} />
                </button>
              }
            />
          ))}
          {!rows.length && <li style={{ listStyle: 'none', padding: '32px 0', textAlign: 'center', fontSize: 14, color: c(s, 'fg-neutral-subtle', 'auto') }}>오늘 거래를 모두 지웠어요.</li>}
        </ul>
        <SnackbarRegion host={host} look={look} />
      </ScreenFrame>
    </DemoStage>
  );
}

// ══ Callout ══════════════════════════════════════════════
const IMPORT_GUIDE = { label: '자세히', href: '/guide/import' };
// 가져오기 안내 — 링크는 보조 내용으로(미리보기라 실제로 옮겨 가지 않는다)
export function CalloutDisplayDemo({ look, button }: { look: CalloutLook; button: ButtonLook }) {
  const s = look.screen;
  const [went, setWent] = useState(false);
  return (
    <DemoStage note={went ? `"자세히" 는 ${IMPORT_GUIDE.href} 로 간다 — 미리보기라 옮겨 가지 않는다.` : '링크는 Tab 으로 닿고, 키보드 초점에만 링이 보인다.'}>
      <ScreenFrame screen={s} title="거래 가져오기" onBack={() => undefined} height={380}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 24px 24px' }}>
          <CalloutView look={look} tone="informative" title="안내" description="가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요." link={{ ...IMPORT_GUIDE, onClick: () => setWent(true) }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '28px 16px', borderRadius: 16, boxShadow: `inset 0 0 0 1px ${c(s, 'stroke-neutral-weak', 'auto')}`, textAlign: 'center' }}>
            <span style={{ fontSize: 14, lineHeight: '19px', color: c(s, 'fg-neutral-muted', 'auto') }}>은행 · 카드사에서 받은 엑셀(.xlsx) · CSV 파일</span>
            <ButtonView look={button} label="파일 고르기" />
          </div>
        </div>
      </ScreenFrame>
    </DemoStage>
  );
}

// 거래 저장 실패 → 폼 맨 위 Callout(나중에 나타나니 role="alert"), 폼은 연 채로. 다시 저장하면 닫히고 목록 위에 스낵바
export function CalloutErrorDemo({ look, snack, field, input, cta }: { look: CalloutLook; snack: SnackbarLook; field: TfFieldLook; input: TfInputLook; cta: ButtonLook }) {
  const s = look.screen;
  const host = useSnackbarHost(snack);
  const [stage, setStage] = useState<'form' | 'list'>('form');
  const [tries, setTries] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [amount, setAmount] = useState('12,000');
  const [memo, setMemo] = useState('점심 식사');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const save = () => {
    if (busy) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      // 처음은 실패, 다음은 성공 — 미리보기
      if (tries === 0) {
        setError(true);
        setTries(1);
        return;
      }
      setError(false);
      setStage('list');
      host.show({ message: '거래를 저장했어요.' });
    }, 700);
  };
  const reset = () => {
    setStage('form');
    setTries(0);
    setError(false);
    setAmount('12,000');
    setMemo('점심 식사');
  };
  return (
    <DemoStage controls={<DemoButton onClick={reset}>처음부터</DemoButton>} note="첫 저장은 실패하게 해 두었다 — 폼 맨 위에 Callout 이 나타나고 입력은 그대로다. 다시 저장하면 폼이 닫히고 목록 위에 스낵바가 뜬다.">
      {stage === 'form' ? (
        <ScreenFrame screen={s} title="거래 추가" onBack={reset} height={480} bottom={<BottomCta screen={s} look={cta} label="저장" onClick={save} loading={busy} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: field.form.gapY, padding: '8px 24px 24px' }}>
            {error && <CalloutView look={look} tone="critical" role="alert" description="저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 다시 저장해 주세요." />}
            <TfFieldView look={field} label="금액">
              {(ctl) => <TfInputView look={input} size="large" id={ctl.id} describedBy={ctl.describedBy} value={amount} onValue={setAmount} format="amount" suffix="원" />}
            </TfFieldView>
            <TfFieldView look={field} label="메모">
              {(ctl) => <TfInputView look={input} size="large" id={ctl.id} describedBy={ctl.describedBy} value={memo} onValue={setMemo} />}
            </TfFieldView>
          </div>
        </ScreenFrame>
      ) : (
        <ScreenFrame screen={s} title="가계부" height={480} bottom={<DemoTabBar screen={s} />}>
          <ul style={{ margin: 0, padding: '0 24px' }}>
            <DayLine screen={s} />
            <DemoRowView screen={s} row={{ id: 'saved', title: memo || '거래', sub: '식비 · 현대카드 M', amount: `−${amount || '0'}원`, hue: 'orange' }} />
            {LEDGER.slice(1, 3).map((r) => (
              <DemoRowView key={r.id} screen={s} row={r} />
            ))}
          </ul>
          <SnackbarRegion host={host} look={snack} />
        </ScreenFrame>
      )}
    </DemoStage>
  );
}

// 전체 누르기(증권 연결로 간다) · 닫기(새 기능 — 닫으면 초점은 다음 요소로)
const BROKERS = ['토스증권', '키움증권', '한국투자증권'];
export function CalloutInteractiveDemo({ look }: { look: CalloutLook }) {
  const s = look.screen;
  const [page, setPage] = useState<'assets' | 'connect'>('assets');
  const [seen, setSeen] = useState(false);
  const after = useRef<HTMLButtonElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [focusAfter, setFocusAfter] = useState(false);
  useEffect(() => {
    if (!focusAfter) return;
    after.current?.focus();
    setFocusAfter(false);
  }, [focusAfter]);
  const back = () => {
    setPage('assets');
    requestAnimationFrame(() => opener.current?.focus());
  };
  const rowBtn: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 52, padding: '0 4px', border: 0, borderRadius: 8, background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 15, lineHeight: '21px', textAlign: 'left', cursor: 'pointer' };
  return (
    <DemoStage controls={seen ? <DemoButton onClick={() => setSeen(false)}>새 기능 안내 다시 보기</DemoButton> : undefined} note="회색 상자는 전체가 버튼이라 누르면 증권 연결로 간다. 새 기능 안내는 닫으면 다시 뜨지 않고, 초점은 다음 요소로 간다.">
      {page === 'assets' ? (
        <ScreenFrame screen={s} title="자산" height={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 24px 24px' }}>
            {!seen && <CalloutView look={look} tone="informative" interaction="dismissible" title="새 기능" description="반복 거래를 자동으로 기록할 수 있어요." onDismiss={() => (setSeen(true), setFocusAfter(true))} />}
            <CalloutView look={look} tone="neutral" interaction="actionable" description="토스증권을 연결하면 보유 주식이 자산에 더해져요." rootRef={(el) => void (opener.current = el)} onClick={() => setPage('connect')} />
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
              <button ref={after} type="button" style={rowBtn}>
                <span>현금 · 계좌</span>
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>4,120,000원</span>
              </button>
              <button type="button" style={rowBtn}>
                <span>카드</span>
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>−412,300원</span>
              </button>
            </div>
          </div>
        </ScreenFrame>
      ) : (
        <ScreenFrame screen={s} title="증권 연결" onBack={back} height={420}>
          <ul style={{ margin: 0, padding: '8px 24px' }}>
            {BROKERS.map((b) => (
              <li key={b} style={{ listStyle: 'none' }}>
                <button type="button" style={rowBtn}>
                  {b}
                  <span style={{ fontSize: 13, color: c(s, 'fg-neutral-subtle', 'auto') }}>연결</span>
                </button>
              </li>
            ))}
          </ul>
        </ScreenFrame>
      )}
    </DemoStage>
  );
}

// ══ Page Banner ═══════════════════════════════════════════
const STOCKS: DemoRow[] = [
  { id: 'samsung', title: '삼성전자', sub: '10주 · 국내', amount: '712,000원', hue: 'blue' },
  { id: 'hynix', title: 'SK하이닉스', sub: '2주 · 국내', amount: '452,000원', hue: 'red' },
  { id: 'apple', title: 'Apple', sub: '3주 · 해외', amount: '1,021,500원', hue: 'violet' },
];
// 증권 연결 끊김 — 다시 연결하면 띠가 걷히고 결과는 스낵바로
export function BannerDisplayDemo({ look, snack }: { look: PageBannerLook; snack: SnackbarLook }) {
  const s = look.screen;
  const host = useSnackbarHost(snack);
  const [connected, setConnected] = useState(false);
  return (
    <DemoStage controls={connected ? <DemoButton onClick={() => setConnected(false)}>연결 끊김 다시 보기</DemoButton> : undefined} note="띠는 페이지 머리 바로 아래 화면 폭 전체다. 다시 연결하면 띠를 걷고 결과는 스낵바로 알린다.">
      <ScreenFrame screen={s} title="증권" height={440} bottom={<DemoTabBar screen={s} tab="home" />}>
        {!connected && <PageBannerView look={look} tone="critical" title="연결 끊김" description="토스증권 키가 만료돼 시세를 받지 못해요." button={{ label: '다시 연결', onClick: () => (setConnected(true), host.show({ message: '토스증권을 다시 연결했어요.' })) }} />}
        <ul style={{ margin: 0, padding: '0 24px' }}>
          <DayLine screen={s} label={connected ? '방금 받은 시세' : '10월 1일 (목) 오후 3:30 시세'} />
          {STOCKS.map((r) => (
            <DemoRowView key={r.id} screen={s} row={r} />
          ))}
        </ul>
        <SnackbarRegion host={host} look={snack} />
      </ScreenFrame>
    </DemoStage>
  );
}

// 새 기능(닫기 — 다시 띄우지 않는다) · 곧 만료(짙은 바탕 + 구독 보기) — 한 화면에 하나라 화면 둘
export function BannerDismissDemo({ look }: { look: PageBannerLook }) {
  const s = look.screen;
  const [seen, setSeen] = useState(false);
  const [plan, setPlan] = useState(false);
  const next = useRef<HTMLButtonElement | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const rowBtn: CSSProperties = { display: 'flex', alignItems: 'center', width: '100%', minHeight: 52, padding: '0 24px', border: 0, background: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 15, lineHeight: '21px', textAlign: 'left', cursor: 'pointer' };
  return (
    <DemoStage controls={seen ? <DemoButton onClick={() => setSeen(false)}>새 기능 띠 다시 보기</DemoButton> : undefined} note="닫으면 바로 사라지고 다시 띄우지 않는다(닫음을 기억한다) — 초점은 다음 요소로. 짙은 바탕은 무거운 상태에만 쓴다.">
      <ScreenFrame screen={s} title="가계부" height={300} label="가계부 — 새 기능 띠">
        {!seen && (
          <PageBannerView
            look={look}
            tone="informative"
            interaction="dismissible"
            title="새 기능"
            description="반복 거래를 자동으로 기록할 수 있어요."
            onDismiss={() => {
              setSeen(true);
              requestAnimationFrame(() => next.current?.focus());
            }}
          />
        )}
        <button ref={next} type="button" style={rowBtn}>
          반복 거래 설정
        </button>
        <button type="button" style={rowBtn}>
          카테고리 관리
        </button>
      </ScreenFrame>
      {plan ? (
        <ScreenFrame screen={s} title="구독" onBack={() => (setPlan(false), requestAnimationFrame(() => opener.current?.focus()))} height={300}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 24px' }}>
            <span style={{ fontSize: 17, lineHeight: '24px', fontWeight: 700 }}>Pro · 월 2,900원</span>
            <span style={{ fontSize: 14, lineHeight: '19px', color: c(s, 'fg-neutral-muted', 'auto') }}>10월 31일까지 이용할 수 있어요.</span>
          </div>
        </ScreenFrame>
      ) : (
        <ScreenFrame screen={s} title="설정" height={300} label="설정 — 곧 만료 띠">
          <PageBannerView look={look} tone="warning" variant="solid" title="곧 만료" description="Pro 이용이 10월 31일에 끝나요." button={{ label: '구독 보기', onClick: () => setPlan(true) }} rootRef={(el) => void (opener.current = (el?.querySelector('[data-banner-button]') as HTMLButtonElement | null) ?? null)} />
          <button type="button" style={rowBtn}>
            알림
          </button>
          <button type="button" style={rowBtn}>
            화면 · 글자
          </button>
        </ScreenFrame>
      )}
    </DemoStage>
  );
}

// ══ Result Section ════════════════════════════════════════
// 이번 달 거래 없음 → 거래 추가 → 저장하면 목록 + 스낵바
export function ResultEmptyDemo({ look, snack, field, input, cta }: { look: ResultSectionLook; snack: SnackbarLook; field: TfFieldLook; input: TfInputLook; cta: ButtonLook }) {
  const s = look.screen;
  const host = useSnackbarHost(snack);
  const [page, setPage] = useState<'empty' | 'form' | 'list'>('empty');
  const [amount, setAmount] = useState('12,000');
  return (
    <DemoStage controls={page !== 'empty' ? <DemoButton onClick={() => setPage('empty')}>처음부터</DemoButton> : undefined} note="비어 있으면 무엇을 하면 되는지 한 줄과 첫 동작을 둔다.">
      {page === 'form' ? (
        <ScreenFrame
          screen={s}
          title="거래 추가"
          onBack={() => setPage('empty')}
          height={460}
          bottom={
            <BottomCta
              screen={s}
              look={cta}
              label="저장"
              onClick={() => {
                setPage('list');
                host.show({ message: '거래를 저장했어요.' });
              }}
            />
          }
        >
          <div style={{ padding: '8px 24px' }}>
            <TfFieldView look={field} label="금액">
              {(ctl) => <TfInputView look={input} size="large" id={ctl.id} describedBy={ctl.describedBy} value={amount} onValue={setAmount} format="amount" suffix="원" />}
            </TfFieldView>
          </div>
        </ScreenFrame>
      ) : (
        <ScreenFrame screen={s} title="가계부" height={460} bottom={<DemoTabBar screen={s} />}>
          {page === 'empty' ? (
            <div role="status" style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
              <ResultSectionView look={look} kind="empty" size="large" icon="receipt-text" title="이번 달 거래가 없어요" description="거래를 기록하면 여기에 모여요." primary={{ label: '거래 추가', onClick: () => setPage('form') }} heading={3} live />
            </div>
          ) : (
            <ul style={{ margin: 0, padding: '0 24px' }}>
              <DayLine screen={s} />
              <DemoRowView screen={s} row={{ id: 'first', title: '점심 식사', sub: '식비 · 현대카드 M', amount: `−${amount || '0'}원`, hue: 'orange' }} />
            </ul>
          )}
          <SnackbarRegion host={host} look={snack} />
        </ScreenFrame>
      )}
    </DemoStage>
  );
}

// 불러오기 실패 → 다시 시도(버튼에 로딩) → 내용이 투명도로 나타난다. 결과는 role="status" 로 알린다
export function ResultFailureDemo({ look }: { look: ResultSectionLook }) {
  const s = look.screen;
  const [phase, setPhase] = useState<'failed' | 'loading' | 'done'>('failed');
  const list = useRef<HTMLUListElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (phase !== 'done' || !list.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const a = list.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms(look.motion.enter.duration), easing: look.motion.enter.easing });
    return () => a.cancel();
  }, [phase, look.motion.enter.duration, look.motion.enter.easing]);
  const retry = () => {
    setPhase('loading');
    timer.current = window.setTimeout(() => setPhase('done'), 1200);
  };
  return (
    <DemoStage controls={phase === 'done' ? <DemoButton onClick={() => setPhase('failed')}>실패 다시 보기</DemoButton> : undefined} note="다시 시도를 누르면 버튼에 로딩이 걸리고, 불러오면 내용이 투명도로 바뀐다. 이미 보이던 내용이 있으면 지우지 않는다.">
      <ScreenFrame screen={s} title="홈" height={440} bg="bg-layer-basement" bottom={<DemoTabBar screen={s} tab="home" />}>
        {/* 회색 바닥 위 목록 카드 — card.yaml(흰 면 + 1px 테두리 · 머리 위 24 · 좌우 24 · 아래 4 · 카드 아래 12) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: s.card.gap, paddingTop: s.card.gap, paddingRight: s.card.edge, paddingBottom: s.card.edge, paddingLeft: s.card.edge }}>
          <section aria-label="최근 거래" style={{ display: 'flex', flexDirection: 'column', minHeight: 300, boxSizing: 'border-box', borderRadius: s.card.radius, borderWidth: s.card.borderW, borderStyle: 'solid', borderColor: c(s, 'stroke-neutral-weak', 'auto'), background: c(s, 'bg-layer-default', 'auto'), paddingTop: 0, paddingRight: 0, paddingBottom: s.card.listBottom, paddingLeft: 0 }}>
            <span style={{ paddingTop: s.card.head.top, paddingRight: s.card.head.x, paddingBottom: s.card.head.bottom, paddingLeft: s.card.head.x, fontFamily: s.card.title.fontFamily, fontSize: s.card.title.fontSize, lineHeight: s.card.title.lineHeight, fontWeight: s.card.title.fontWeight }}>최근 거래</span>
            <div role="status" style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
              {phase === 'done' ? (
                <ul ref={list} style={{ margin: 0, paddingTop: 0, paddingRight: s.card.head.x, paddingBottom: 0, paddingLeft: s.card.head.x }}>
                  {LEDGER.slice(0, 3).map((r) => (
                    <DemoRowView key={r.id} screen={s} row={r} />
                  ))}
                </ul>
              ) : (
                // 카드 안 — 결과 자리의 좌우 0, 목록 카드의 24 는 감싼 칸이 맡는다
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', paddingLeft: s.card.head.x, paddingRight: s.card.head.x }}>
                  <ResultSectionView look={look} kind="failure" size="medium" inCard title="거래를 불러오지 못했어요" description="잠시 뒤 다시 시도해 주세요." primary={{ label: '다시 시도', onClick: retry, loading: phase === 'loading' }} heading={3} live />
                </div>
              )}
            </div>
          </section>
        </div>
      </ScreenFrame>
    </DemoStage>
  );
}

// 가져오기 완료 · 찾을 수 없는 페이지(404)
export function ResultDoneDemo({ look }: { look: ResultSectionLook }) {
  const s = look.screen;
  return (
    <DemoStage note="완료 · 404 도 같은 틀이다 — 첫 버튼은 다음 동작, 둘째는 보조(글 버튼).">
      <ScreenFrame screen={s} title="가져오기" height={420}>
        <ResultSectionView look={look} kind="done" size="large" title="1,204건을 가져왔어요" description="건너뛴 줄 3 · 실패 0" primary={{ label: '가계부로 가기' }} secondary={{ label: '다른 파일 가져오기' }} heading={3} live />
      </ScreenFrame>
      <ScreenFrame screen={s} height={420} label="찾을 수 없는 페이지">
        <ResultSectionView look={look} kind="empty" size="large" icon="search-x" title="페이지를 찾을 수 없어요" primary={{ label: '홈으로' }} heading={3} live />
      </ScreenFrame>
    </DemoStage>
  );
}

export type { SnackbarHost };
