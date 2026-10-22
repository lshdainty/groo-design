'use client';
// 알림 메시지 넷의 플레이그라운드 — 속성을 고르면 스펙대로 그린 모습과 그 코드가 바뀐다(실제로 띄우고 · 누르고 · 닫을 수 있다).
// 코드는 각 스펙 md 의 "코드" 절과 같은 API(useSnackbar · Callout · PageBanner · ResultSection)로 쓴다.
import { useEffect, useMemo, useState } from 'react';
import { fcv, type BannerVariant, type CalloutLook, type FbInteraction, type FbTone, type PageBannerLook, type ResultKind, type ResultSectionLook, type ResultSize, type SnackTone, type SnackbarLook, type ViewMode } from './feedback-shared';
import { DemoRowView, DemoTabBar, ScreenFrame, type DemoRow } from './feedback-demos';
import { CalloutView, PageBannerView, ResultSectionView, SnackbarRegion, useSnackbarHost, type SnackbarHost } from './feedback-view';
import { BRANDS, MODES, PlayFrame, Seg } from './select-playground';

type Brand = 'desk' | 'hr';
const attr = (cond: boolean, s: string) => (cond ? [s] : []);
const q = (s: string) => JSON.stringify(s);

const ROWS: DemoRow[] = [
  { id: 'lunch', title: '점심 식사', sub: '식비 · 생활비 카드', amount: '−12,000원', hue: 'orange' },
  { id: 'cafe', title: '골목커피', sub: '카페 · 생활비 카드', amount: '−5,600원', hue: 'orange' },
  { id: 'subway', title: '지하철', sub: '교통 · 교통 체크카드', amount: '−1,450원', hue: 'blue' },
];

// ══ Snackbar ═════════════════════════════════════════════
const SNACK_TEXT: Record<SnackTone, [string, string]> = {
  neutral: ['거래를 삭제했어요.', '거래 3건을 삭제했어요. 휴지통에서 30일 동안 되살릴 수 있어요.'],
  positive: ['관심 종목에 넣었어요.', '미리 낸 돈 중 32,000원이 계좌로 돌아왔어요. 잔액이 맞는지 확인해 주세요.'],
  // 액션 없는 가벼운 실패 — 같은 단추를 한 번 더 누르면 되는 일(4초). 관심 등록 실패는 "다시 시도" 를 고르면(RETRY_TEXT)
  critical: ['계좌번호를 복사하지 못했어요.', '계좌번호를 복사하지 못했어요. 한 번 더 눌러주세요.'],
};
// 켜고 끄는 단추(관심 등록)의 실패 — 되돌린 뒤 같은 요청을 다시 보내는 "다시 시도"(6초 — Toggle 20A · snackbar.md 의 코드)
const RETRY_TEXT = '관심 종목에 넣지 못했어요. 다시 시도해주세요.';
const SNACK_ACTIONS = [
  ['none', '없음'],
  ['undo', '되돌리기'],
  ['fix', '잔액 고치기'],
  ['retry', '다시 시도'],
] as const;
type SnackActionKey = (typeof SNACK_ACTIONS)[number][0];
const ACTION_LABEL: Record<Exclude<SnackActionKey, 'none'>, [string, string]> = { undo: ['되돌리기', 'undo'], fix: ['잔액 고치기', 'openBalance'], retry: ['다시 시도', '() => setWatched(stock.id, true)'] };

// 남은 시간 — 띠가 떠 있는 동안만 0.1초마다 다시 센다
function useRemaining(host: SnackbarHost) {
  const [now, setNow] = useState(0);
  const run = host.run;
  useEffect(() => {
    if (!run || run.paused) return;
    setNow(performance.now());
    const t = window.setInterval(() => setNow(performance.now()), 100);
    return () => window.clearInterval(t);
  }, [run]);
  if (!run || !host.cur) return null;
  const at = now >= run.started ? now : run.started;
  return { total: run.duration, left: run.paused ? run.duration : Math.max(0, run.duration - (at - run.started)), paused: run.paused };
}

export function SnackbarPlayground({ looks }: { looks: Record<Brand, SnackbarLook> }) {
  const [tone, setTone] = useState<SnackTone>('neutral');
  const [act, setAct] = useState<SnackActionKey>('undo');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const look = looks[brand];
  const host = useSnackbarHost(look);
  const remain = useRemaining(host);
  const message = tone === 'critical' && act === 'retry' ? RETRY_TEXT : SNACK_TEXT[tone][len === 'short' ? 0 : 1];
  const action = act === 'none' ? undefined : { label: ACTION_LABEL[act][0] };
  const show = () => host.show({ tone, message, action });
  const code = useMemo(() => {
    const lines = [...attr(tone !== 'neutral', `  tone: ${q(tone)},`), `  message: ${q(message)},`, ...attr(act !== 'none', `  action: { label: ${q(act === 'none' ? '' : ACTION_LABEL[act][0])}, onClick: ${act === 'none' ? '' : ACTION_LABEL[act][1]} },`)];
    return `import { useSnackbar } from "@/components/ui/snackbar"\n\nconst snackbar = useSnackbar()\n\nsnackbar.show({\n${lines.join('\n')}\n})`;
  }, [tone, message, act]);
  const s = look.screen;
  const status = !remain
    ? '띠 없음 — 띄우기를 누른다'
    : remain.paused
      ? `멈춤 — 머무는 동안(떠나면 처음부터 ${remain.total / 1000}초)`
      : `${remain.total / 1000}초 중 ${(remain.left / 1000).toFixed(1)}초 남음`;
  return (
    <PlayFrame
      surface={fcv(s['bg-layer-basement'], mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3">
          <ScreenFrame screen={s} mode={mode} title="가계부" height={380} bottom={<DemoTabBar screen={s} mode={mode} />}>
            <ul style={{ margin: 0, padding: '8px 24px 0' }}>
              {ROWS.map((r) => (
                <DemoRowView key={r.id} screen={s} mode={mode} row={r} />
              ))}
            </ul>
            <SnackbarRegion host={host} look={look} mode={mode} />
          </ScreenFrame>
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={show} className="shrink-0 rounded-md bg-fd-foreground px-3 py-1.5 text-[13px] font-medium text-fd-background">
              띄우기
            </button>
            <span className="text-right text-[12px] tabular-nums text-fd-muted-foreground" aria-live="off">
              {status}
            </span>
          </div>
        </div>
      }
      controls={
        <>
          <Seg label="톤 tone" value={tone} options={[['neutral', 'neutral(기본)'], ['positive', 'positive'], ['critical', 'critical']] as const} onChange={setTone} />
          <Seg label="액션 action" value={act} options={SNACK_ACTIONS} onChange={setAct} />
          <Seg label="글" value={len} options={[['short', '한 줄'], ['long', '두 줄']] as const} onChange={setLen} />
          <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
            <span className="font-medium">시간</span>
            <span>
              액션이 없으면 {look.duration.plain / 1000}초, 있으면 {look.duration.withAction / 1000}초. 띄우기를 다시 누르면 지금 띠를 바로 바꾼다 — 액션이 달린 띠는 끝날 때까지 지키고 새 띠는 그 뒤에 뜬다.
            </span>
          </div>
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ══ Callout ══════════════════════════════════════════════
const CALLOUT_TEXT: Record<FbTone, { title: string; text: [string, string] }> = {
  neutral: { title: '안내', text: ['가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요.', '가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요. 같은 날짜 · 금액 · 가맹점의 거래는 한 번만 넣어요.'] },
  informative: { title: '안내', text: ['국내 주식은 15분 늦은 시세예요.', '국내 주식은 15분 늦은 시세예요. 실시간 시세는 증권사 앱에서 볼 수 있어요.'] },
  positive: { title: '완료', text: ['분할 합계가 총액과 같아요.', '분할 합계가 총액과 같아요. 이대로 저장하면 세 사람에게 나눠 기록해요.'] },
  warning: { title: '주의', text: ['카테고리 한도 합이 전체 상한을 12,000원 넘었어요.', '카테고리 한도 합이 전체 상한을 12,000원 넘었어요. 한도를 줄이거나 상한을 올려 주세요.'] },
  critical: { title: '주의', text: ['토큰은 지금만 볼 수 있어요.', '토큰은 지금만 볼 수 있어요. 닫기 전에 복사해 두세요.'] },
};
const TONES5 = [
  ['neutral', 'neutral(기본)'],
  ['informative', 'informative'],
  ['positive', 'positive'],
  ['warning', 'warning'],
  ['critical', 'critical'],
] as const;
const INTERACTIONS = [
  ['display', 'display(기본)'],
  ['actionable', 'actionable'],
  ['dismissible', 'dismissible'],
] as const;

export function CalloutPlayground({ looks }: { looks: Record<Brand, CalloutLook> }) {
  const [tone, setTone] = useState<FbTone>('informative');
  const [interaction, setInteraction] = useState<FbInteraction>('display');
  const [title, setTitle] = useState<'yes' | 'no'>('yes');
  const [link, setLink] = useState<'yes' | 'no'>('yes');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [open, setOpen] = useState(true);
  const [pressed, setPressed] = useState(0);
  const look = looks[brand];
  const t = CALLOUT_TEXT[tone];
  const text = t.text[len === 'short' ? 0 : 1];
  const withLink = link === 'yes' && interaction !== 'actionable';
  const code = useMemo(() => {
    const a = [...attr(tone !== 'neutral', `tone=${q(tone)}`), ...attr(interaction !== 'display', `interaction=${q(interaction)}`), ...attr(title === 'yes', `title=${q(t.title)}`), ...attr(withLink, 'link={{ label: "자세히", href: "/guide" }}')];
    if (interaction === 'actionable') a.push('onClick={openDetail}');
    if (interaction === 'dismissible') a.push('open={!seen}', 'onDismiss={markSeen}');
    return `import { Callout } from "@/components/ui/callout"\n\n<Callout${a.length ? ` ${a.join(' ')}` : ''}>\n  ${text}\n</Callout>`;
  }, [tone, interaction, title, t.title, withLink, text]);
  const s = look.screen;
  return (
    <PlayFrame
      surface={fcv(s['bg-layer-default'], mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3">
          {open || interaction !== 'dismissible' ? (
            <CalloutView
              key={`${interaction}-${tone}`}
              look={look}
              mode={mode}
              tone={tone}
              interaction={interaction}
              title={title === 'yes' ? t.title : undefined}
              description={text}
              link={withLink ? { label: '자세히', href: '/guide' } : undefined}
              onClick={() => setPressed((n) => n + 1)}
              onDismiss={() => setOpen(false)}
            />
          ) : (
            <button type="button" onClick={() => setOpen(true)} className="self-center rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[12px] text-fd-foreground">
              닫았다 — 다시 보이기
            </button>
          )}
          <span className="text-center text-[12px] text-fd-muted-foreground" aria-live="polite">
            {interaction === 'actionable' ? (pressed ? `상자를 ${pressed}번 눌렀다 — 실제로는 그 화면으로 간다` : '상자 전체가 버튼이다') : interaction === 'dismissible' ? '닫기는 한 번 보면 되는 안내에만' : withLink ? '링크는 보조 내용으로 갈 때만' : ' '}
          </span>
        </div>
      }
      controls={
        <>
          <Seg label="톤 tone" value={tone} options={TONES5} onChange={setTone} />
          <Seg label="상호작용 interaction" value={interaction} options={INTERACTIONS} onChange={(v) => (setInteraction(v), setOpen(true), setPressed(0))} />
          <Seg label="제목 title" value={title} options={[['yes', '있음'], ['no', '없음']] as const} onChange={setTitle} />
          {interaction === 'actionable' ? (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">링크 link</span>
              <span>전체를 누르는 상자에는 링크를 두지 않는다.</span>
            </div>
          ) : (
            <Seg label="링크 link" value={link} options={[['yes', '있음'], ['no', '없음']] as const} onChange={setLink} />
          )}
          <Seg label="본문" value={len} options={[['short', '한 줄'], ['long', '여러 줄']] as const} onChange={setLen} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ══ Page Banner ═══════════════════════════════════════════
const BANNER_TEXT: Record<FbTone, { title: string; text: string; button: string }> = {
  neutral: { title: '점검 예정', text: '10월 5일 새벽 2시부터 30분 동안 점검해요.', button: '자세히' },
  informative: { title: '새 버전', text: '새 버전 1.24.0을 받을 수 있어요.', button: '업데이트' },
  positive: { title: '연결됨', text: '증권 시세를 다시 받아요.', button: '자세히' },
  warning: { title: '곧 만료', text: 'Pro 이용이 10월 31일에 끝나요.', button: '구독 보기' },
  critical: { title: '연결 끊김', text: '증권 연결 키가 만료돼 시세를 받지 못해요.', button: '다시 연결' },
};

export function PageBannerPlayground({ looks }: { looks: Record<Brand, PageBannerLook> }) {
  const [tone, setTone] = useState<FbTone>('critical');
  const [variant, setVariant] = useState<BannerVariant>('weak');
  const [interaction, setInteraction] = useState<FbInteraction>('display');
  const [title, setTitle] = useState<'yes' | 'no'>('yes');
  const [button, setButton] = useState<'yes' | 'no'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [open, setOpen] = useState(true);
  const [pressed, setPressed] = useState(0);
  const look = looks[brand];
  const t = BANNER_TEXT[tone];
  const withButton = button === 'yes' && interaction === 'display';
  const code = useMemo(() => {
    const a = [...attr(tone !== 'neutral', `tone=${q(tone)}`), ...attr(variant !== 'weak', `variant=${q(variant)}`), ...attr(interaction !== 'display', `interaction=${q(interaction)}`), ...attr(title === 'yes', `title=${q(t.title)}`), ...attr(withButton, `button={{ label: ${q(t.button)}, onClick: handle }}`)];
    if (interaction === 'actionable') a.push('onClick={openDetail}');
    if (interaction === 'dismissible') a.push('open={!seen}', 'onDismiss={markSeen}');
    return `import { PageBanner } from "@/components/ui/page-banner"\n\n<PageBanner${a.length ? ` ${a.join(' ')}` : ''}>\n  ${t.text}\n</PageBanner>`;
  }, [tone, variant, interaction, title, t, withButton]);
  const s = look.screen;
  return (
    <PlayFrame
      surface={fcv(s['bg-layer-basement'], mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3">
          <ScreenFrame screen={s} mode={mode} title="증권" height={300}>
            {open || interaction !== 'dismissible' ? (
              <PageBannerView
                key={`${interaction}-${tone}-${variant}`}
                look={look}
                mode={mode}
                tone={tone}
                variant={variant}
                interaction={interaction}
                title={title === 'yes' ? t.title : undefined}
                description={t.text}
                button={withButton ? { label: t.button, onClick: () => setPressed((n) => n + 1) } : undefined}
                onClick={() => setPressed((n) => n + 1)}
                onDismiss={() => setOpen(false)}
              />
            ) : null}
            <ul style={{ margin: 0, padding: '4px 24px 0' }}>
              {ROWS.slice(0, 2).map((r) => (
                <DemoRowView key={r.id} screen={s} mode={mode} row={r} />
              ))}
            </ul>
          </ScreenFrame>
          {!open && interaction === 'dismissible' ? (
            <button type="button" onClick={() => setOpen(true)} className="self-center rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[12px] text-fd-foreground">
              닫았다 — 다시 보이기
            </button>
          ) : (
            <span className="text-center text-[12px] text-fd-muted-foreground" aria-live="polite">
              {pressed ? `${pressed}번 눌렀다 — 실제로는 그 동작을 한다` : variant === 'solid' ? '짙은 바탕은 무거운 상태에만' : '페이지 머리 바로 아래 · 한 화면에 하나'}
            </span>
          )}
        </div>
      }
      controls={
        <>
          <Seg label="톤 tone" value={tone} options={TONES5} onChange={(v) => (setTone(v), setPressed(0))} />
          <Seg label="바탕 variant" value={variant} options={[['weak', 'weak(기본)'], ['solid', 'solid']] as const} onChange={setVariant} />
          <Seg label="상호작용 interaction" value={interaction} options={INTERACTIONS} onChange={(v) => (setInteraction(v), setOpen(true), setPressed(0))} />
          <Seg label="제목 title" value={title} options={[['yes', '있음'], ['no', '없음']] as const} onChange={setTitle} />
          {interaction === 'display' ? (
            <Seg label="버튼 button" value={button} options={[['yes', '있음'], ['no', '없음']] as const} onChange={setButton} />
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">버튼 button</span>
              <span>{interaction === 'actionable' ? '띠 전체가 버튼이라 버튼을 따로 두지 않는다.' : '닫을 수 있는 띠에는 버튼을 두지 않는다.'}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ══ Result Section ════════════════════════════════════════
const RESULT_TEXT: Record<ResultKind, { title: string; text: string; primary: [string, string]; secondary: [string, string] }> = {
  empty: { title: '이번 달 거래가 없어요', text: '거래를 기록하면 여기에 모여요.', primary: ['거래 추가', 'openAddTx'], secondary: ['지난달 보기', 'showLastMonth'] },
  failure: { title: '거래를 불러오지 못했어요', text: '잠시 뒤 다시 시도해 주세요.', primary: ['다시 시도', '() => query.refetch()'], secondary: ['홈으로', 'goHome'] },
  done: { title: '1,204건을 가져왔어요', text: '건너뛴 줄 3 · 실패 0', primary: ['가계부로 가기', 'goLedger'], secondary: ['다른 파일 가져오기', 'reset'] },
};

export function ResultSectionPlayground({ looks }: { looks: Record<Brand, ResultSectionLook> }) {
  const [kind, setKind] = useState<ResultKind>('failure');
  const [size, setSize] = useState<ResultSize>('large');
  const [buttons, setButtons] = useState<'0' | '1' | '2'>('1');
  const [desc, setDesc] = useState<'yes' | 'no'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [busy, setBusy] = useState(false);
  const look = looks[brand];
  const t = RESULT_TEXT[kind];
  useEffect(() => {
    if (!busy) return;
    const id = window.setTimeout(() => setBusy(false), 1200);
    return () => window.clearTimeout(id);
  }, [busy]);
  const code = useMemo(() => {
    const a = [`kind=${q(kind)}`, ...attr(size !== 'large', `size=${q(size)}`), ...attr(kind === 'empty', 'icon={<ReceiptText />}'), `title=${q(t.title)}`, ...attr(desc === 'yes', `description=${q(t.text)}`)];
    if (buttons !== '0') a.push(`primaryAction={{ label: ${q(t.primary[0])}, onClick: ${t.primary[1]} }}`);
    if (buttons === '2') a.push(`secondaryAction={{ label: ${q(t.secondary[0])}, onClick: ${t.secondary[1]} }}`);
    return `${kind === 'empty' ? 'import { ReceiptText } from "lucide-react"\n' : ''}import { ResultSection } from "@/components/ui/result-section"\n\n<ResultSection\n${a.map((x) => `  ${x}`).join('\n')}\n/>`;
  }, [kind, size, t, desc, buttons]);
  const s = look.screen;
  // medium 은 카드 안 — 결과 자리의 좌우 0, 목록 카드라 카드의 24 를 감싼 칸이 맡는다(result-section.yaml root.paddingX 비고)
  const inCard = size === 'medium';
  const view = (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', paddingLeft: inCard ? s.card.head.x : 0, paddingRight: inCard ? s.card.head.x : 0 }}>
      <ResultSectionView
        look={look}
        mode={mode}
        kind={kind}
        size={size}
        inCard={inCard}
        icon={kind === 'empty' ? 'receipt-text' : undefined}
        title={t.title}
        description={desc === 'yes' ? t.text : undefined}
        primary={buttons !== '0' ? { label: t.primary[0], onClick: kind === 'failure' ? () => setBusy(true) : undefined, loading: busy } : undefined}
        secondary={buttons === '2' ? { label: t.secondary[0] } : undefined}
        heading={3}
        live
      />
    </div>
  );
  return (
    <PlayFrame
      surface={fcv(s['bg-layer-basement'], mode)}
      code={code}
      stage={
        size === 'large' ? (
          <ScreenFrame screen={s} mode={mode} title="가계부" height={440}>
            {view}
          </ScreenFrame>
        ) : (
          <ScreenFrame screen={s} mode={mode} title="홈" height={440} bg="bg-layer-basement">
            {/* 회색 바닥 위 목록 카드 — card.yaml(흰 면 + 1px 테두리 · 머리 위 24 · 좌우 24 · 아래 4 · 카드 아래 12) */}
            <div style={{ paddingTop: s.card.gap, paddingRight: s.card.edge, paddingBottom: s.card.edge, paddingLeft: s.card.edge }}>
              <section aria-label="최근 거래" style={{ display: 'flex', flexDirection: 'column', minHeight: 300, boxSizing: 'border-box', borderRadius: s.card.radius, borderWidth: s.card.borderW, borderStyle: 'solid', borderColor: fcv(s['stroke-neutral-weak'], mode), background: fcv(s['bg-layer-default'], mode), paddingTop: 0, paddingRight: 0, paddingBottom: s.card.listBottom, paddingLeft: 0 }}>
                <span style={{ paddingTop: s.card.head.top, paddingRight: s.card.head.x, paddingBottom: s.card.head.bottom, paddingLeft: s.card.head.x, fontFamily: s.card.title.fontFamily, fontSize: s.card.title.fontSize, lineHeight: s.card.title.lineHeight, fontWeight: s.card.title.fontWeight }}>최근 거래</span>
                {view}
              </section>
            </div>
          </ScreenFrame>
        )
      }
      controls={
        <>
          <Seg label="결과 kind" value={kind} options={[['empty', 'empty(기본)'], ['failure', 'failure'], ['done', 'done']] as const} onChange={(v) => (setKind(v), setBusy(false))} />
          <Seg label="크기 size" value={size} options={[['large', 'large(기본) — 화면 전체'], ['medium', 'medium — 카드 · 시트 안']] as const} onChange={setSize} />
          <Seg label="버튼" value={buttons} options={[['0', '없음'], ['1', '하나'], ['2', '둘']] as const} onChange={setButtons} />
          <Seg label="설명 description" value={desc} options={[['yes', '있음'], ['no', '없음']] as const} onChange={setDesc} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}
