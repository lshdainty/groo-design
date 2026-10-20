// Snackbar 페이지의 그림 — specs/components/snackbar.md 의 `[그림: …](../../site/components/specs/snackbar.tsx#<id>)` 자리.
// 띠는 snackbar.yaml 을 푼 값(snackbarLook)으로, 다른 알림(Callout · Page Banner · Result Section)도 각자의 YAML 로 그린다.
// 폰 화면 안의 띠는 화면 폭에서 좌우 8 을 뺀 폭이고 탭 바 위 8 에 선다. 데스크톱 창 안의 띠는 최대 464 로 아래 가운데다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { calloutLook, pageBannerLook, resultSectionLook, snackbarLook, type SnackbarLook } from './feedback-look';
import { SnackActionDemo, SnackBasicDemo } from './feedback-demos';
import { SnackbarPlayground } from './feedback-playground';
import { Band, DayHead, DialogCard, Legend, LedgerRows, ModeTag, Muted, Pair, Pin, SnackDock, TxSheet, W, markBox, markLine, type Fig } from './feedback-screens';
import { CalloutView, PageBannerView, ResultSectionView, SnackbarView, type SnackbarViewProps } from './feedback-view';
import { Phone, Verdict, WebWindow, rc, type Mode } from './kit';
import { Cap, F, Surface, tf } from './select-screens';
import { TfInputView } from './text-field-view';

const sl = (brand: 'desk' | 'hr' = 'desk') => snackbarLook(brand);
const px = (v: string) => parseFloat(v);

// 멈춘 띠 하나 — 수치 · 색은 snackbarLook 에서
function S(p: Omit<SnackbarViewProps, 'look' | 'state'> & { brand?: 'desk' | 'hr'; state?: SnackbarViewProps['state']; look?: SnackbarLook }) {
  const { brand = 'desk', state = 'enabled', look, ...rest } = p;
  return <SnackbarView look={look ?? sl(brand)} state={state} {...rest} />;
}

// 가계부 폰(탭 바) — 띠는 목록 영역 아래 가운데, 곧 탭 바 위 8
function LedgerPhone({ mode, scale = 0.65, h = 600, snack, marks = false }: { mode: Mode; scale?: number; h?: number; snack?: ReactNode; marks?: boolean }) {
  return (
    <Phone title="가계부" back={false} mode={mode} scale={scale} h={h} bg="bg-layer-default" tabs>
      <div className="flex flex-col px-6">
        <DayHead mode={mode} />
        <LedgerRows mode={mode} />
      </div>
      {snack && <SnackDock>{snack}</SnackDock>}
      {marks && <RegionMarks />}
    </Phone>
  );
}
// 화면 키보드가 올라온 폰 — 키보드(그림, OS 가 그린다 · 높이 KB)가 탭 바를 덮고 띠는 키보드 바로 위 8(자리의 아래 여백).
// 2026-10-15 사용자 결정 Q-003-1 — 웹 폰 브라우저도 같다
const KB = 260;
function SoftKeyboard({ mode }: { mode: Mode }) {
  const rows = ['ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ', 'ㅁㄴㅇㄹㅎㅗㅓㅏㅣ', 'ㅋㅌㅊㅍㅠㅜㅡ'];
  const key = (k: string, basis = 30) => (
    <span key={k} className="grid place-items-center" style={{ flex: `0 1 ${basis}px`, height: 42, borderRadius: 6, background: rc('bg-layer-default', mode), color: rc('fg-neutral', mode), fontSize: basis > 30 ? 13 : 17 }}>
      {k}
    </span>
  );
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 flex flex-col justify-center gap-[10px]" style={{ height: KB, padding: '8px 4px 16px', background: rc('bg-neutral-weak', mode), zIndex: 3 }}>
      {rows.map((r) => (
        <div key={r} className="flex justify-center gap-[5px]">
          {[...r].map((k) => key(k))}
        </div>
      ))}
      <div className="flex justify-center gap-[5px]">
        {key('?123', 60)}
        {key('한국어', 150)}
        {key('검색', 60)}
      </div>
    </div>
  );
}
function KeyboardPhone({ mode, scale = 0.65, h = 600, marks = false }: { mode: Mode; scale?: number; h?: number; marks?: boolean }) {
  const r = sl().region;
  return (
    <Phone
      title="관심 종목"
      mode={mode}
      scale={scale}
      h={h}
      bg="bg-layer-default"
      tabs
      overlay={
        <>
          <SoftKeyboard mode={mode} />
          <SnackDock style={{ bottom: KB, zIndex: 4 }}>
            <S mode={mode} tone="critical" message="관심 종목에 넣지 못했어요. 다시 시도해주세요." action={{ label: '다시 시도' }} />
          </SnackDock>
          {marks && <Band style={{ left: 0, right: 0, bottom: KB, height: r.padBottom, zIndex: 4 }} />}
        </>
      }
    >
      <div className="flex flex-col px-6">
        <div className="flex h-10 items-center" style={{ boxShadow: `inset 0 -2px 0 ${rc('stroke-neutral-contrast', mode)}`, color: rc('fg-neutral', mode), fontSize: 18 }}>
          숲길
          <span style={{ display: 'inline-block', width: 1.5, height: 20, marginLeft: 1, background: rc('fg-neutral', mode) }} />
        </div>
        <LedgerRows mode={mode} />
      </div>
    </Phone>
  );
}

// 자리의 여백 표시 — 좌우 · 아래(탭 바 위). 폰은 줄여 그려 글은 그림 아래 설명에 적는다
function RegionMarks() {
  const r = sl().region;
  const h = sl().root.minHeight;
  return (
    <>
      <Band style={{ left: 0, bottom: r.padBottom, width: r.padX, height: h }} />
      <Band style={{ right: 0, bottom: r.padBottom, width: r.padX, height: h }} />
      <Band style={{ left: r.padX, right: r.padX, bottom: 0, height: r.padBottom }} />
    </>
  );
}

// ── Overview ──────────────────────────────────────────────
const MESSAGES: { tone?: 'neutral' | 'positive' | 'critical'; message: string; action?: string }[] = [
  { message: '거래를 저장했어요.' },
  { message: '거래를 삭제했어요.', action: '되돌리기' },
  // 켜고 끄는 단추(관심 등록)의 실패 — 되돌린 뒤 "다시 시도"(Toggle 20A)
  { tone: 'critical', message: '관심 종목에 넣지 못했어요. 다시 시도해주세요.', action: '다시 시도' },
];
const Hero: Fig = ({ caption }) => {
  const row = (mode: 'light' | 'dark') => (
    <div className="flex items-start gap-4">
      <LedgerPhone mode={mode} snack={<S mode={mode} message="거래를 삭제했어요." action={{ label: '되돌리기' }} />} />
      <div className="flex w-[344px] flex-col gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
        <ModeTag mode={mode} />
        {MESSAGES.map((m) => (
          <S key={m.message} mode={mode} tone={m.tone} message={m.message} action={m.action ? { label: m.action } : undefined} />
        ))}
      </div>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-4">
        {row('light')}
        {row('dark')}
      </div>
    </Figure>
  );
};

const Playground: Fig = () => (
  <SnackbarPlayground looks={{ desk: sl('desk'), hr: sl('hr') }} />
);

// ── Anatomy ───────────────────────────────────────────────
// 1.5배로 그린다 — 치수 · 글자를 모두 곱한 look(색은 그대로)
function zoomed(l: SnackbarLook, k: number): SnackbarLook {
  const t = (x: { fontSize: string; lineHeight: string }) => ({ fontSize: `${px(x.fontSize) * k}px`, lineHeight: `${px(x.lineHeight) * k}px` });
  return {
    ...l,
    region: { ...l.region, padX: l.region.padX * k, padBottom: l.region.padBottom * k },
    root: { ...l.root, maxWidth: l.root.maxWidth * k, minHeight: l.root.minHeight * k, pad: l.root.pad * k, radius: l.root.radius * k },
    icon: { ...l.icon, size: l.icon.size * k, padRight: l.icon.padRight * k },
    content: { padX: l.content.padX * k, gap: l.content.gap * k },
    message: { ...l.message, ...t(l.message) },
    action: { ...l.action, ...t(l.action), targetPadX: l.action.targetPadX * k, targetH: l.action.targetH * k, radius: l.action.radius * k },
    close: { ...l.close, size: l.close.size * k, icon: l.close.icon * k, margin: l.close.margin * k, radius: l.close.radius * k },
  };
}
const K = 1.5;
const Anatomy: Fig = ({ caption }) => {
  const z = zoomed(sl(), K);
  const r = z.region;
  const w = 328 * K;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-10 pb-8 pt-16">
        <div className="relative flex flex-col items-stretch" style={{ width: w + r.padX * 2 }}>
          {/* ⓐ 자리 — 좌우 · 아래 8, 탭 바 위 */}
          <div className="relative flex justify-center" style={{ padding: `0 ${r.padX}px ${r.padBottom}px`, ...markLine }}>
            <span aria-hidden className="absolute -right-9 top-1/2 flex -translate-y-1/2 items-center">
              <span style={{ width: 12, height: 1, background: MARK_LINE }} />
              <Pin n="ⓐ" />
            </span>
            <SnackbarView
              look={z}
              state="enabled"
              tone="positive"
              message="미리 낸 돈 중 32,000원이 계좌로 돌아왔어요."
              action={{ label: '잔액 고치기' }}
              width={w}
              zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 }, icon: markBox, message: markBox, action: markBox }}
              pins={{ root: <Pin n="ⓑ" />, icon: <Pin n="ⓒ" />, message: <Pin n="ⓓ" />, action: <Pin n="ⓔ" /> }}
              pinLine={MARK_LINE}
            />
          </div>
          <div className="flex h-10 items-center justify-around border-t text-[11px]" style={{ borderColor: rc('stroke-neutral-weak'), color: rc('fg-neutral-subtle'), background: rc('bg-layer-default') }}>
            탭 바 · 플로팅 버튼 · 바닥 버튼
          </div>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Region'],
            ['ⓑ', 'Container'],
            ['ⓒ', 'Icon'],
            ['ⓓ', 'Message'],
            ['ⓔ', 'Action'],
          ]}
        />
        <span className="max-w-[480px] text-center text-[12px] leading-5 pk-muted">1.5배로 그렸다 — 두 줄이면 아이콘 · 액션은 띠 가운데에 선다. 보조 기술용 닫기는 키보드 초점이 올 때만 보인다</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 띠의 여백 — 1.5배. 왼쪽 여백 10 · 글 좌우 6(글은 16) · 아이콘 24(오른쪽 2 포함 — 글은 40) · 최소 44 · 액션 누르는 영역
function LayoutStrip({ tone, message, action, note }: { tone?: 'positive'; message: string; action?: string; note: string }) {
  const z = zoomed(sl(), K);
  const l = sl();
  const w = 328 * K;
  const start = tone ? l.root.pad + l.icon.size + l.content.padX : l.root.pad + l.content.padX;
  return (
    <div className="flex flex-col gap-7 pt-5">
      <div className="relative" style={{ width: w }}>
        <SnackbarView look={z} state="enabled" tone={tone} message={message} action={action ? { label: action } : undefined} width={w} zone={action ? { target: markBox } : undefined} />
        {/* 왼쪽 여백 · 글 좌우 여백 · 아이콘 */}
        <Band style={{ left: 0, top: 0, bottom: 0, width: z.root.pad }} label={String(l.root.pad)} />
        {tone ? (
          <Band style={{ left: z.root.pad, top: z.root.pad, width: z.icon.size, height: z.icon.size }} label={`${l.icon.size}(오른쪽 ${l.icon.padRight} 포함)`} below />
        ) : (
          <Band style={{ left: z.root.pad, top: 0, bottom: 0, width: z.content.padX }} label={String(l.content.padX)} below />
        )}
        <Band style={{ left: z.root.pad, right: 0, top: 0, height: z.root.pad }} />
        {/* 최소 높이 */}
        <span aria-hidden className="absolute flex items-center" style={{ left: '100%', top: 0, bottom: 0, marginLeft: 6 }}>
          <span style={{ width: 1, height: '100%', background: MARK_LINE }} />
          <span className="ml-1 whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
            {l.root.minHeight}
          </span>
        </span>
      </div>
      <Muted>
        {note} — 글은 띠 가장자리에서 {start}
      </Muted>
    </div>
  );
}
const Layout: Fig = ({ caption }) => {
  const l = sl();
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-6 rounded-xl pk-surface px-6 py-8">
        <LayoutStrip message="거래를 삭제했어요." action="되돌리기" note={`아이콘 없음 · 액션 — 분홍 칸은 누르는 영역(글 + 좌우 ${l.action.targetPadX} × ${l.action.targetH})`} />
        <LayoutStrip tone="positive" message="관심 종목에 넣었어요." note={`아이콘 ${l.icon.size}`} />
        <div className="flex flex-col gap-2">
          <div style={{ width: 328 }}>
            <S message="미리 낸 돈 중 32,000원이 계좌로 돌아왔어요. 잔액이 맞는지 확인해 주세요." action={{ label: '잔액 고치기' }} tone="positive" />
          </div>
          <Muted>실제 크기(폰 360 · 띠 328) — 글이 길면 줄을 바꾸고 자르지 않는다. 아이콘 · 액션은 띠 가운데</Muted>
        </div>
        {/* 상태 — 키보드 포커스 링(띠 글자색, 어느 링이든 띠 위) · 액션 누름 */}
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-bold pk-text">상태 — 실제 크기</span>
          {(
            [
              ['focused', 'root', `띠 포커스 — 안쪽 ${-l.ring.offset}`],
              ['focused', 'action', `액션 포커스 — 바깥 ${l.ring.actionOffset} · 모서리 ${l.action.radius}`],
              ['focused', 'close', `닫기 포커스 — 키보드 초점이 오면 X ${l.close.icon} · 상자 ${l.close.size}(위 · 아래 · 오른쪽 ${l.close.margin}), 안쪽 ${-l.ring.offset} · 모서리 ${l.close.radius}`],
              ['pressed', 'action', `액션 누름 — 글만 ${l.press.distance}px 거리 축소`],
            ] as const
          ).map(([st, part, note]) => (
            <div key={`${st}-${part}`} className="flex flex-col gap-1.5" style={{ width: 328 }}>
              <S message="거래를 삭제했어요." action={{ label: '되돌리기' }} state={st} focus={part} />
              <Muted>{note}</Muted>
            </div>
          ))}
        </div>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-[12px] leading-5 pk-muted">
          <li>
            최소 {l.root.minHeight} · 여백 {l.root.pad} + 글 좌우 {l.content.padX} · 모서리 {l.root.radius} · 그림자 {l.root.shadow === 'none' ? '없음' : l.root.shadow}
          </li>
          <li>
            글 {px(l.message.fontSize)} / {px(l.message.lineHeight)} · {l.message.fontWeight} · 액션 {px(l.action.fontSize)} · {l.action.fontWeight} · 글과 액션은 양 끝(사이 적어도 {l.content.gap})
          </li>
          <li>폭은 자리 폭(화면 − 좌우 {l.region.padX} × 2), 최대 {l.root.maxWidth}</li>
        </ul>
      </div>
    </Figure>
  );
};

// 톤 셋 — 아이콘 색만 바뀐다. 액션은 브랜드의 반전 짝(Desk · HR)
const TONE_ROWS: { tone: 'neutral' | 'positive' | 'critical'; message: string; note: (l: SnackbarLook, m: 'light' | 'dark') => string }[] = [
  { tone: 'neutral', message: '거래를 저장했어요.', note: () => 'neutral(기본) — 아이콘 없음' },
  { tone: 'positive', message: '관심 종목에 넣었어요.', note: (l, m) => `positive — fg-positive-inverted ${l.icon.color.positive[m].toUpperCase()}` },
  // 액션 없는 가벼운 실패 — 같은 단추를 한 번 더 누르면 되는 일(관심 등록 실패는 "다시 시도" 가 달려 이 자리에 두지 않는다)
  { tone: 'critical', message: '계좌번호를 복사하지 못했어요.', note: (l, m) => `critical — fg-critical-inverted ${l.icon.color.critical[m].toUpperCase()}` },
];
const Tones: Fig = ({ caption }) => {
  const panel = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
        {TONE_ROWS.map((r) => (
          <div key={r.tone} className="flex flex-col gap-1">
            <S mode={mode} tone={r.tone} message={r.message} />
            <Muted mode={mode}>{r.note(sl(), mode)}</Muted>
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <S mode={mode} message="거래를 삭제했어요." action={{ label: '되돌리기' }} />
          <Muted mode={mode}>Desk 액션 — fg-brand-inverted {sl('desk').action.color[mode].toUpperCase()}</Muted>
        </div>
        <div className="flex flex-col gap-1">
          <S mode={mode} brand="hr" message="휴가 신청을 취소했어요." action={{ label: '되돌리기' }} />
          <Muted mode={mode}>HR 액션 — fg-brand-inverted {sl('hr').action.color[mode].toUpperCase()}</Muted>
        </div>
      </div>
      <Cap strong={mode === 'light' ? '라이트 — 짙은 띠' : '다크 — 밝은 띠'}>bg-neutral-inverted {sl().root.bg[mode].toUpperCase()}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {panel('light')}
        {panel('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 스낵바에 알리는 것 · 다른 자리 — 일마다 그 컴포넌트로
function RoleRow({ what, name, children, bleed = false }: { what: string; name: string; children: ReactNode; bleed?: boolean }) {
  return (
    <div className="flex flex-col gap-2 border-b py-3 last:border-b-0" style={{ borderColor: rc('stroke-neutral-subtle') }}>
      <span className="flex items-baseline justify-between gap-2 text-[12px] leading-4">
        <span style={{ color: rc('fg-neutral-subtle') }}>{what}</span>
        <b className="text-[13px]" style={{ color: rc('fg-neutral') }}>
          {name}
        </b>
      </span>
      <div className={bleed ? '-mx-5' : ''}>{children}</div>
    </div>
  );
}
const RoleGuide: Fig = ({ caption }) => {
  const t = tf();
  return (
    <Panel caption={caption}>
      <Surface className="mx-auto w-full max-w-[420px] py-2">
        <RoleRow what="방금 한 일의 결과 · 가벼운 실패" name="Snackbar">
          <S message="거래를 삭제했어요." action={{ label: '되돌리기' }} />
        </RoleRow>
        <RoleRow what="입력값이 틀림" name="Field 오류(칸 아래)">
          <F label="금액" error="금액을 입력해 주세요.">
            <TfInputView look={t.input} size="large" state="invalid" placeholder="예: 5,600" suffix="원" />
          </F>
        </RoleRow>
        <RoleRow what="그 자리의 안내 · 주의 · 저장 실패" name="Callout">
          <CalloutView look={calloutLook()} tone="warning" description="총액이 바뀌어 분할 합계와 1,200원 달라요." state="enabled" />
        </RoleRow>
        <RoleRow what="페이지 전체의 상태" name="Page Banner" bleed>
          <PageBannerView look={pageBannerLook()} tone="critical" title="연결 끊김" description="토스증권 키가 만료돼 시세를 받지 못해요." button={{ label: '다시 연결' }} state="enabled" />
        </RoleRow>
        <RoleRow what="비어 있음 · 불러오기 실패 · 완료" name="Result Section">
          <ResultSectionView look={resultSectionLook()} kind="failure" size="medium" title="거래를 불러오지 못했어요" description="잠시 뒤 다시 시도해 주세요." primary={{ label: '다시 시도' }} />
        </RoleRow>
        <RoleRow what="되돌릴 수 없는 결정" name="Alert Dialog">
          <DialogCard title="거래를 삭제할까요?" body="삭제한 거래는 되돌릴 수 없어요." confirm="삭제" />
        </RoleRow>
      </Surface>
    </Panel>
  );
};

// 오류는 자리에서 — 불러오기 실패는 그 자리 Result Section, 저장 실패는 폼 맨 위 Callout. 전역 오류 토스트를 두지 않는다
function FailedLedger({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <Phone title="가계부" back={false} mode={mode} scale={0.6} h={600} bg="bg-layer-default" tabs>
      <div className="flex min-h-0 flex-1 flex-col">
        <ResultSectionView look={resultSectionLook()} mode={mode} kind="failure" size="medium" title="거래를 불러오지 못했어요" description="잠시 뒤 다시 시도해 주세요." primary={{ label: '다시 시도' }} />
      </div>
    </Phone>
  );
}
function SheetPhone({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <Phone title="가계부" back={false} mode={mode} scale={0.6} h={600} bg="bg-layer-default" tabs overlay={<TxSheet mode={mode} />}>
      <div className="flex flex-col px-6">
        <DayHead mode={mode} />
        <LedgerRows mode={mode} n={3} />
      </div>
    </Phone>
  );
}
function GlobalToastPhone({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <Phone title="가계부" back={false} mode={mode} scale={0.6} h={600} bg="bg-layer-default" tabs>
      <div className="flex flex-1 items-center justify-center pb-24 text-[14px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
        내역이 없어요
      </div>
      <SnackDock>
        <S mode={mode} tone="critical" message="Request failed with status code 500" />
        <S mode={mode} tone="critical" message="거래를 불러오지 못했어요." />
      </SnackDock>
    </Phone>
  );
}
const ErrorGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4">
      <Verdict ok note="불러오기 실패는 그 자리에 Result Section + 다시 시도, 저장 실패는 폼을 연 채 맨 위 Callout — 무엇이 안 됐고 무엇을 하면 되는지 그 자리에서 보인다">
        <div className="flex flex-wrap items-start justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <FailedLedger />
            <Cap strong="불러오기 실패">그 자리 Result Section</Cap>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SheetPhone />
            <Cap strong="저장 실패">폼 맨 위 Callout — 입력은 그대로</Cap>
          </div>
        </div>
      </Verdict>
      <Verdict ok={false} note="모든 실패를 한곳에서 토스트로 — 서버가 보낸 영어가 그대로 나가고, 화면이 같은 실패를 또 띄운다. 목록은 비어 보여 실패를 숨긴다">
        <div className="flex flex-col items-center gap-2">
          <GlobalToastPhone />
          <Cap strong="전역 오류 토스트">띠 둘 · 서버 글 · 빈 목록</Cap>
        </div>
      </Verdict>
    </div>
  </Panel>
);

// 자리 — 폰은 탭 바 위 8, 데스크톱은 아래 가운데 최대 464
const PlacementGuide: Fig = ({ caption }) => {
  const l = sl();
  const winW = 600;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <LedgerPhone mode="auto" scale={0.75} h={560} marks snack={<S message="거래를 삭제했어요." action={{ label: '되돌리기' }} />} />
          <div className="flex w-[240px] flex-col gap-2 text-[13px] leading-5">
            <b className="pk-text">폰 — 탭 바 위 {l.region.padBottom}</b>
            <span className="pk-muted">
              분홍은 자리의 여백 — 좌우 {l.region.padX} · 아래 {l.region.padBottom}. 띠 폭은 화면 − {l.region.padX * 2}. 아래는 안전 영역과 피할 자리(탭 바 · 플로팅 버튼 · 바닥 버튼) 중 큰 쪽 위 {l.region.padBottom} — 탭 바는 안전 영역을 품고 있다.
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <KeyboardPhone mode="auto" scale={0.75} h={560} marks />
          <div className="flex w-[240px] flex-col gap-2 text-[13px] leading-5">
            <b className="pk-text">화면 키보드 — 키보드 바로 위 {l.region.keyboardGap}</b>
            <span className="pk-muted">
              키보드도 피할 자리다 — 탭 바가 키보드 뒤로 가도 띠는 키보드 위 {l.region.keyboardGap} 에 선다. 웹도 폰 브라우저에서 같다(보이는 화면의 아래 끝을 잰다). 자리가 옮겨 갈 때는 {l.region.offset.duration} easing.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <WebWindow w={winW} h={340} url="desk.groo.app">
            <div className="flex h-full flex-col px-8 pt-6" style={{ background: rc('bg-layer-default') }}>
              <span className="pb-3 text-[20px] font-bold" style={{ color: rc('fg-neutral') }}>
                가계부
              </span>
              <DayHead />
              <LedgerRows n={2} />
            </div>
            <SnackDock>
              <div className="relative flex w-full justify-center">
                <S message="거래를 삭제했어요." action={{ label: '되돌리기' }} />
                <span aria-hidden className="absolute -top-5 flex items-center justify-center text-[10px] font-bold" style={{ width: l.root.maxWidth }}>
                  <span className="absolute inset-x-0 top-1/2 h-px" style={{ background: MARK_LINE }} />
                  <span className="relative rounded px-1 leading-4 text-white" style={{ background: MARK_LINE }}>
                    최대 {l.root.maxWidth}
                  </span>
                </span>
              </div>
            </SnackDock>
            <Band style={{ left: 0, right: 0, bottom: 0, height: l.region.padBottom }} />
          </WebWindow>
          <Cap strong="데스크톱 — 아래 가운데">
            넓은 화면에서는 최대 {l.root.maxWidth} 로 가운데에 선다 · 아래 {l.region.padBottom}
          </Cap>
        </div>
      </div>
    </Figure>
  );
};

// 시간 — 4초 · 액션 6초 · 머무는 동안 멈춤(떠나면 처음부터) · 한 번에 하나
const TimingGuide: Fig = ({ caption }) => {
  const l = sl();
  const s = (v: number) => v / 1000;
  const plain = s(l.duration.plain);
  const withAction = s(l.duration.withAction);
  const exitS = s(px(l.motion.exit.duration));
  const hold = 3;
  const before = 2;
  const max = Math.ceil(before + hold + plain + 1);
  const pct = (v: number) => `${(v / max) * 100}%`;
  const bar = (from: number, to: number, label: string, tone: 'show' | 'hold' | 'next' = 'show'): CSSProperties & { label: string } => ({
    left: pct(from),
    width: pct(to - from),
    label,
    background: tone === 'hold' ? rc('bg-brand-solid') : tone === 'next' ? rc('fg-neutral-muted') : rc('bg-neutral-inverted'),
  });
  const rows: { title: string; bars: ReturnType<typeof bar>[] }[] = [
    { title: '액션 없음', bars: [bar(0, plain, `보임 ${plain}초`)] },
    { title: '액션 있음("되돌리기")', bars: [bar(0, withAction, `보임 ${withAction}초`)] },
    { title: '마우스 · 손가락 · 키보드 초점이 머무르면 — 멈췄다가, 떠나면 처음부터', bars: [bar(0, before, `${before}초`), bar(before, before + hold, '멈춤', 'hold'), bar(before + hold, before + hold + plain, `다시 ${plain}초`)] },
    { title: '새 띠가 오면 — 지금 띠를 바로 바꾼다', bars: [bar(0, 1.5, '지금 띠'), bar(1.5 + exitS, 1.5 + exitS + plain, `새 띠 ${plain}초`, 'next')] },
  ];
  return (
    <Panel caption={caption}>
      <Surface className="mx-auto flex w-full max-w-[640px] flex-col gap-5">
        {rows.map((r) => (
          <div key={r.title} className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold leading-5 pk-text">{r.title}</span>
            <div className="relative h-7">
              {r.bars.map(({ label, ...st }) => (
                <span key={label} className="absolute top-0 flex h-7 items-center overflow-hidden whitespace-nowrap rounded-md px-2 text-[11px] font-medium" style={{ ...st, color: rc('fg-neutral-inverted'), boxShadow: `inset -1px 0 0 ${rc('bg-layer-default')}` }}>
                  {label}
                </span>
              ))}
            </div>
            <div className="relative h-4 text-[10px] tabular-nums pk-muted">
              {Array.from({ length: max / 2 + 1 }, (_, i) => i * 2).map((v) => (
                <span key={v} className="absolute -translate-x-1/2" style={{ left: pct(v) }}>
                  {v}초
                </span>
              ))}
            </div>
          </div>
        ))}
        <span className="text-[12px] leading-5 pk-muted">
          머무름이 끝나면 남은 시간이 아니라 처음부터 다시 센다. 한 번에 하나 — 새 띠가 오면 지금 띠가 {px(l.motion.exit.duration)}ms 로 사라지고 새 띠가 {px(l.motion.enter.duration)}ms 로 나타난다. 되돌리기 같은 액션은 같은 일을 할 다른 길(목록 · 상세)도 둔다.
        </span>
      </Surface>
    </Panel>
  );
};

// 글 — 결과 먼저 · 해요체 · 마침표 · 액션은 동작 이름
const WritingGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note='무엇이 됐는지 먼저, 해요체 문장에 마침표 — 액션은 "되돌리기" 처럼 동작 이름'>
        <W>
          <div className="flex flex-col gap-2">
            <S message="거래를 저장했어요." />
            <S message="거래를 삭제했어요." action={{ label: '되돌리기' }} />
            <S tone="critical" message="관심 종목에 넣지 못했어요. 다시 시도해주세요." action={{ label: '다시 시도' }} />
          </div>
        </W>
      </Verdict>
      <Verdict ok={false} note='시스템 말 · "실패" 로 끝나는 말 · 마침표 없음 · "확인" 액션 — 무엇이 됐는지, 무엇을 하면 되는지 알 수 없다'>
        <W>
          <div className="flex flex-col gap-2">
            <S message="처리가 완료되었습니다" />
            <S message="거래가 삭제되었습니다." action={{ label: '확인' }} />
            <S tone="critical" message="로드 실패" />
          </div>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 미리보기(실제로 띄울 수 있다) ───────────────────
const cta = () => buttonLook({ variant: 'neutralSolid', size: 'large' });
const ExBasic: Fig = () => <SnackBasicDemo look={sl()} cta={cta()} />;
const ExAction: Fig = () => <SnackActionDemo look={sl()} />;

export const snackbarFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  tones: Tones,
  'role-guide': RoleGuide,
  'error-guide': ErrorGuide,
  'placement-guide': PlacementGuide,
  'timing-guide': TimingGuide,
  'writing-guide': WritingGuide,
  'ex-basic': ExBasic,
  'ex-action': ExAction,
};

