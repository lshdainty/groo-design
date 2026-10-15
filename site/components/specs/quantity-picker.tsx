// Quantity Picker 페이지의 그림 — specs/components/quantity-picker.md 의 `[그림: …](../../site/components/specs/quantity-picker.tsx#<id>)` 자리.
// 컨트롤은 quantity-picker.yaml 을 푼 값(qpLook — finish-view 의 QpView)으로, 칸 이름 · 설명 · 오류는 Field(field.yaml — text-field-view),
// 옆 칸은 input.yaml · select.yaml, 대화상자 · 시트는 dialog · bottom-sheet.yaml(overlay-view), 버튼은 button.yaml 로 그린다.
// 그림은 실제 크기(폰 390 · 데스크톱 1280)로 그리고 칸 폭에 맞춰 줄인다(Fit). 정책 이름 · 업무 내용은 지어낸 것이다.
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { QP_SIZES, qpLook, type QpLook, type QpSize } from './finish-look';
import { ExQpBasicDemo, ExQpServerDemo, ExQpTableDemo, QpField, QpPlayground } from './finish-play';
import { QP_PRESETS, type QpPreset } from './finish-shared';
import { Fit, MARK, MARK_LINE, QpView } from './finish-view';
import { Phone, Verdict, rc, type Mode } from './kit';
import { overlayLook } from './overlay-look';
import { Legend, pinAt } from './overlay-screens';
import { DialogSurface, DimView, EndButtons, SheetButtons, SheetSurface } from './overlay-view';
import { ocv } from './overlay-shared';
import { selectLook } from './select-look';
import { Cap } from './select-screens';
import { SelectTriggerView } from './select-view';
import { textFieldLook } from './text-field-look';
import { TfFieldView, TfInputView } from './text-field-view';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const QL = (brand: Brand = 'hr') => qpLook(brand);
const TF = (brand: Brand = 'hr') => textFieldLook(brand);
const SIZE_KO: Record<QpSize, string> = { small: 'small', medium: 'medium', large: 'large' };
const PHONE = 390;
const gutter = () => overlayLook('hr').sheet.body.padX;

// 흰 판 — 컨트롤은 흰 면 위에 둔다
function Board({ mode = 'auto', children, style, bg = 'bg-layer-default', className }: { mode?: Mode; children: ReactNode; style?: CSSProperties; bg?: string; className?: string }) {
  return <div className={className} style={{ background: rc(bg, mode), borderRadius: 16, paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, boxSizing: 'border-box', ...style }}>{children}</div>;
}
// 칸 폭을 따라 줄바꿈하는 판 묶음
const Row = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`flex flex-wrap items-start justify-center gap-4 ${className}`}>{children}</div>;

// ── 화면 — HR 휴가 정책 수정 ───────────────────────────────
// 휴가 정책 이름 · [반복 단위 | 반복 간격] · [반복 여부 | 최대 부여 횟수] · 승인 필요 횟수(0 ~ 고를 수 있는 승인자 수 3)
function PolicyFields({ mode, size, fill = false }: { mode: Mode; size: 'large' | 'medium'; fill?: boolean }) {
  const tf = TF();
  const sel = selectLook('hr');
  const l = QL();
  const two: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', columnGap: tf.field.form.gapX, alignItems: 'start' };
  const layout = fill ? 'fill' : 'hug';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tf.field.form.gapY }}>
      <TfFieldView look={tf.field} mode={mode} label="휴가 정책 이름" indicator="required">
        <TfInputView look={tf.input} mode={mode} size={size} state="enabled" value="연차 (입사 1년 미만 · 매월 1일 발생)" />
      </TfFieldView>
      <div style={two}>
        <TfFieldView look={tf.field} mode={mode} label="반복 단위" indicator="required">
          <SelectTriggerView look={sel} mode={mode} size={size} state="enabled" labels={['매월']} />
        </TfFieldView>
        <QpField look={l} field={tf.field} mode={mode} preset={QP_PRESETS.interval} size={size} layout={layout} indicator="required" frozen />
      </div>
      <div style={two}>
        <TfFieldView look={tf.field} mode={mode} label="반복 여부" indicator="required">
          <SelectTriggerView look={sel} mode={mode} size={size} state="enabled" labels={['N (1회성 부여)']} />
        </TfFieldView>
        <QpField look={l} field={tf.field} mode={mode} preset={QP_PRESETS.maxGrant} size={size} layout={layout} indicator="required" frozen />
      </div>
      <QpField look={l} field={tf.field} mode={mode} preset={{ ...QP_PRESETS.approvals, value: 3 }} size={size} frozen />
    </div>
  );
}
const btn = (variant: string, size: string) => buttonLook({ variant, size }, 'hr');
// 데스크톱(1280 이상) — 딤 위 가운데 대화상자 large(두 칸 줄이 있는 폼). 그림은 대화상자 둘레만 잘라 그린다(DIALOG_BOARD 폭)
const dialogBoard = () => overlayLook('hr').dialog.sizes.large + 80;
function PolicyDesktop({ mode }: { mode: Mode }) {
  const o = overlayLook('hr');
  const s = o.dialog.footer.button.size;
  return (
    <div style={{ width: dialogBoard(), background: rc('bg-layer-basement', mode) }}>
      <div style={{ background: ocv(o.dialog.dim, mode), paddingTop: 32, paddingBottom: 32, paddingLeft: 40, paddingRight: 40 }}>
        <DialogSurface
          look={o.dialog}
          mode={mode}
          width={o.dialog.sizes.large}
          title="휴가 정책 수정"
          description="반복 부여 — 정한 간격마다 휴가를 부여해요."
          footer={
            <EndButtons
              mode={mode}
              items={[
                { label: '취소', look: btn('neutralWeak', s) },
                { label: '저장', look: btn('brandSolid', s) },
              ]}
            />
          }
        >
          <PolicyFields mode={mode} size="medium" />
        </DialogSurface>
      </div>
    </div>
  );
}
// 폰 390 — 시트(1280 미만), 같은 폼이 large 52. 두 칸 줄의 컨트롤은 칸 폭을 채운다(fill)
function PolicyPhone({ mode, h = 800 }: { mode: Mode; h?: number }) {
  const o = overlayLook('hr');
  return (
    <Phone mode={mode} h={h} screenW={PHONE} brand="hr" title="휴가 정책" back bg="bg-layer-basement">
      <DimView dim={o.sheet.dim} mode={mode} place="end">
        <SheetSurface
          look={o.sheet}
          mode={mode}
          title="휴가 정책 수정"
          safe={12}
          fog
          maxHeight={h - 110}
          footer={
            <SheetButtons
              mode={mode}
              items={[
                { label: '취소', look: btn('neutralWeak', 'large') },
                { label: '저장', look: btn('brandSolid', 'large') },
              ]}
            />
          }
        >
          <PolicyFields mode={mode} size="large" fill />
        </SheetSurface>
      </DimView>
    </Phone>
  );
}

const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-6">
      {MODES.map((mode) => (
        <div key={mode} className="grid items-start gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-2">
            <Fit w={dialogBoard()}>
              <PolicyDesktop mode={mode} />
            </Fit>
            <Cap strong={`${modeKo(mode)} · 1280 이상`}>대화상자 large {overlayLook('hr').dialog.sizes.large} — medium {QL().sizes.medium.h}, 옆 Input · Select 와 같은 높이</Cap>
          </div>
          <div className="mx-auto flex w-full min-w-0 max-w-[300px] flex-col gap-2">
            <Fit w={PHONE + 16}>
              <PolicyPhone mode={mode} />
            </Fit>
            <Cap strong={`${modeKo(mode)} · 390`}>시트 — large {QL().sizes.large.h}, 칸 폭을 채운다(fill)</Cap>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <QpPlayground looks={{ desk: qpLook('desk'), hr: qpLook('hr') }} fields={{ desk: textFieldLook('desk').field, hr: TF().field }} />;

// ── Anatomy ───────────────────────────────────────────────
// 키운 그림 — 치수 · 글자를 k 배로(Anatomy)
function zoomQp(l: QpLook, k: number): QpLook {
  const z = (x: QpLook['sizes']['medium']) => ({
    ...x,
    h: x.h * k,
    radius: x.radius * k,
    icon: x.icon * k,
    touch: x.touch * k,
    extend: x.extend * k,
    progress: x.progress * k,
    text: { ...x.text, fontSize: `${parseFloat(x.text.fontSize) * k}px`, lineHeight: `${parseFloat(x.text.lineHeight) * k}px` },
  });
  return {
    ...l,
    sizes: { small: z(l.sizes.small), medium: z(l.sizes.medium), large: z(l.sizes.large) },
    root: { ...l.root, borderW: l.root.borderW * k, invalidW: l.root.invalidW * k },
    divider: { ...l.divider, w: l.divider.w * k, h: l.divider.h * k },
    value: { ...l.value, padX: l.value.padX * k },
    ring: { ...l.ring, width: l.ring.width * k, offset: l.ring.offset * k },
  };
}
const Anatomy: Fig = ({ caption }) => {
  const l = QL();
  const k = 2;
  const zl = zoomQp(l, k);
  const s = l.sizes.medium;
  const H = s.h * k;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-4 pb-8 pt-12">
        <div className="max-w-full overflow-x-auto px-6 pb-6 pt-6">
          <QpView
            look={zl}
            size="medium"
            value={3}
            min={0}
            max={99}
            unit="회"
            frozen
            ariaLabel="승인 필요 횟수"
            marks={{ value: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1, background: MARK } }}
            pins={{
              root: pinAt('ⓐ', -14, -14),
              decrement: pinAt('ⓑ', H / 2 - 10, -26),
              divider: pinAt('ⓒ', -10, zl.divider.h + 6),
              value: pinAt('ⓓ', -4, -26),
              increment: pinAt('ⓔ', H / 2 - 10, -26),
            }}
          />
        </div>
        <Legend
          items={[
            ['ⓐ', `Root — ${l.root.borderW}px 테두리 · 높이 ${s.h}`],
            ['ⓑ', `Decrement — ${s.h} × ${s.h} · 아이콘 ${s.icon}`],
            ['ⓒ', `Divider — ${l.divider.w} × ${l.divider.h}`],
            ['ⓓ', `Value — ${parseFloat(s.text.fontSize)} / ${parseFloat(s.text.lineHeight)} · ${l.value.weight} · 좌우 ${l.value.padX}`],
            ['ⓔ', 'Increment'],
          ]}
        />
        <span className="text-center text-[12px] pk-muted">{k}배로 그렸다 — medium · "3회". 값 칸(분홍)은 누르지 않는 자리, 누르는 자리는 두 버튼뿐</span>
      </div>
    </Panel>
  );
};

// ── Size ──────────────────────────────────────────────────
// 같은 줄의 높이 표시 — 줄 오른쪽에 분홍 괄호 + 숫자
function HeightTag({ h }: { h: number }) {
  return (
    <span aria-hidden className="relative flex shrink-0 items-center" style={{ height: h, marginLeft: 6 }}>
      <span style={{ width: 6, alignSelf: 'stretch', borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }} />
      <span className="pl-1 text-[11px] font-semibold leading-4" style={{ color: MARK_LINE }}>
        {h}
      </span>
    </span>
  );
}
const Size: Fig = ({ caption }) => {
  const l = QL();
  const tf = TF();
  const sel = selectLook('hr');
  const rows: { size: QpSize; cap: string; strong: string; other: ReactNode }[] = [
    {
      size: 'large',
      strong: `폰 폼 — large ${l.sizes.large.h}`,
      cap: '1280 미만 · 앱. 옆 Input · Select large 와 같은 높이',
      other: <SelectTriggerView look={sel} size="large" state="enabled" labels={['매월']} width={120} />,
    },
    {
      size: 'medium',
      strong: `데스크톱 폼 — medium ${l.sizes.medium.h}`,
      cap: `1280 이상. 누르는 자리 ${l.sizes.medium.touch}(분홍 — 둘레 ${l.sizes.medium.extend} 씩)`,
      other: <TfInputView look={tf.input} size="medium" state="enabled" value="연차" width={120} />,
    },
    {
      size: 'small',
      strong: `표 칸 — small ${l.sizes.small.h}`,
      cap: `표 · 목록 줄 안. 옆 Button small 과 같은 높이, 누르는 자리 ${l.sizes.small.touch}(둘레 ${l.sizes.small.extend} 씩)`,
      other: <ButtonView look={buttonLook({ variant: 'neutralSolid', size: 'small' }, 'hr')} label="저장" state="enabled" />,
    },
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.size} className="flex flex-col items-center gap-2">
            <Board className="w-full">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4" style={{ paddingTop: 6, paddingBottom: 6 }}>
                <span className="flex items-center gap-3">
                  {r.other}
                  <QpView look={l} size={r.size} value={8} min={0} max={24} unit="h" frozen showHit ariaLabel="소요시간" />
                </span>
                <HeightTag h={l.sizes[r.size].h} />
              </div>
            </Board>
            <Cap strong={r.strong}>{r.cap}</Cap>
          </div>
        ))}
        <Legend
          items={QP_SIZES.map((s) => [SIZE_KO[s], `${l.sizes[s].h} · 모서리 ${l.sizes[s].radius} · 아이콘 ${l.sizes[s].icon} · 값 ${parseFloat(l.sizes[s].text.fontSize)} / ${parseFloat(l.sizes[s].text.lineHeight)}`] as [string, string])}
        />
      </div>
    </Panel>
  );
};
// ── Layout ────────────────────────────────────────────────
const Layout: Fig = ({ caption }) => {
  const l = QL();
  const tf = TF();
  const w = PHONE - gutter() * 2;
  return (
    <Panel caption={caption}>
      <Row>
        <div className="flex flex-col items-center gap-2">
          <Board>
            <div className="flex flex-col items-start gap-3">
              <QpView look={l} size="large" value={3} min={1} max={99} unit="회" frozen ariaLabel="최대 부여 횟수" />
              <QpView look={l} size="large" value={99} min={1} max={99} unit="회" frozen ariaLabel="최대 부여 횟수" />
            </div>
          </Board>
          <Cap strong="hug(기본)">값 칸은 가장 긴 값 "99회" 의 폭 — 3 이어도 99 여도 상자 폭이 같다</Cap>
        </div>
        <div className="flex flex-col items-center gap-2" style={{ width: '100%', maxWidth: w + 40 }}>
          <Board style={{ width: '100%' }}>
            <QpField look={l} field={tf.field} preset={QP_PRESETS.interval} size="large" layout="fill" frozen />
          </Board>
          <Cap strong="fill">폰 폼의 칸 폭을 채운다 — 늘어나는 것은 값 칸뿐, 두 버튼은 정사각</Cap>
        </div>
      </Row>
    </Panel>
  );
};

// ── 끝 ────────────────────────────────────────────────────
const Edge: Fig = ({ caption }) => {
  const l = QL();
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { v: 0, st: { decrement: 'focused' as const }, strong: '최소 0', cap: '줄이기 막힘 — aria-disabled 라 초점(링)이 남는다' },
          { v: 2, st: {}, strong: '범위 안', cap: '두 버튼 모두 누를 수 있다' },
          { v: 3, st: {}, strong: '최대 3', cap: '늘리기 막힘 — 올려도 바탕이 생기지 않는다' },
        ].map((x) => (
          <div key={x.v} className="flex flex-col items-center gap-2">
            <Board style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <QpView look={l} size="medium" value={x.v} min={0} max={3} unit="회" frozen states={x.st} ariaLabel="승인 필요 횟수" />
            </Board>
            <Cap strong={x.strong}>{x.cap}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── 지우기 ────────────────────────────────────────────────
const Removable: Fig = ({ caption }) => {
  const l = QL('desk');
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { v: 2, strong: '수량 2개', cap: '줄이기 "줄이기" — 한 단계 줄인다' },
          { v: 1, strong: '수량 1개(최소)', cap: '줄이기 자리가 휴지통 — 이름 "점심 도시락 지우기", 누르면 onRemove(값은 그대로)' },
        ].map((x) => (
          <div key={x.v} className="flex flex-col items-center gap-2">
            <Board style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <QpView look={l} size="medium" value={x.v} min={1} max={9} unit="개" removable removeLabel="점심 도시락 지우기" frozen ariaLabel="수량" />
            </Board>
            <Cap strong={x.strong}>{x.cap}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── State ─────────────────────────────────────────────────
const STATE_ROWS: { key: string; ko: string; props: Partial<Parameters<typeof QpView>[0]> }[] = [
  { key: 'enabled', ko: '기본', props: {} },
  { key: 'hovered', ko: '호버(웹) — 늘리기', props: { states: { increment: 'hovered' } } },
  { key: 'focused', ko: '포커스 — 늘리기', props: { states: { increment: 'focused' } } },
  { key: 'pressed', ko: '누름 — 늘리기', props: { states: { increment: 'pressed' } } },
  { key: 'loading', ko: '로딩 — 늘리기', props: { loading: 'increment' } },
  { key: 'invalid', ko: '오류', props: { invalid: true } },
  { key: 'disabled', ko: '막힘', props: { disabled: true } },
];
const States: Fig = ({ caption }) => {
  const l = QL();
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="overflow-x-auto rounded-xl" style={{ background: rc('bg-layer-default', mode) }}>
        <div className="mx-auto grid w-max items-center gap-x-5 gap-y-3 px-5 py-5" style={{ gridTemplateColumns: 'max-content repeat(3, max-content)' }}>
          <span />
          {(['small', 'medium', 'large'] as const).map((s) => (
            <span key={s} className="text-center text-[12px] font-semibold" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {s} {l.sizes[s].h}
            </span>
          ))}
          {STATE_ROWS.map((r) => (
            <div key={r.key} className="contents">
              <span className="text-[12px] font-semibold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                {r.ko}
              </span>
              {(['small', 'medium', 'large'] as const).map((s) => (
                <span key={s} className="flex justify-center" style={{ paddingTop: 2, paddingBottom: 2 }}>
                  <QpView look={l} mode={mode} size={s} value={2} min={0} max={9} unit="회" frozen ariaLabel={`${r.ko} ${s}`} {...r.props} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Cap strong={modeKo(mode)}>상태는 누른 그 버튼에만 — 오류는 상자 테두리 안쪽 {l.root.invalidW}px, 막힘은 전용 색(흐리게 하지 않는다)</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const WhenGuide: Fig = ({ caption }) => {
  const l = QL();
  const tf = TF('desk');
  const sel = selectLook('desk');
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2">
          <Board style={{ width: '100%' }}>
            <QpField look={l} field={TF().field} preset={{ ...QP_PRESETS.approvals, value: 2 }} size="large" description={false} frozen />
          </Board>
          <Cap strong="Quantity Picker">승인 필요 횟수 0 ~ 3 — 흔한 값이 열 단계 안쪽</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Board style={{ width: '100%' }}>
            <TfFieldView look={tf.field} label="반복 횟수">
              <TfInputView look={tf.input} size="large" state="enabled" prefix="총" value="12" suffix="회" />
            </TfFieldView>
          </Board>
          <Cap strong="Input 숫자 칸">반복 거래 "총 12회" — 흔한 값 12 · 24 · 36 이 멀다</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Board style={{ width: '100%' }}>
            <TfFieldView look={tf.field} label="할부">
              <SelectTriggerView look={sel} size="large" state="enabled" labels={['3개월']} />
            </TfFieldView>
          </Board>
          <Cap strong="Select">할부 — 일시불 · 2 ~ 12 · 18 · 24개월, 띄엄띄엄 이름 붙은 값</Cap>
        </div>
      </div>
    </Panel>
  );
};

// 12 → 36 — 숫자 칸 두 글자 · + 스물네 번
function Presses({ n, mode = 'auto' }: { n: number; mode?: Mode }) {
  return (
    <span className="flex flex-wrap justify-center gap-1" style={{ maxWidth: 240 }} aria-label={`+ ${n}번`}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} aria-hidden className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: rc('bg-neutral-weak', mode), color: rc('fg-neutral-subtle', mode) }}>
          +
        </span>
      ))}
    </span>
  );
}
const StepsGuide: Fig = ({ caption }) => {
  const l = QL('desk');
  const tf = TF('desk');
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Verdict ok note="흔한 값이 열 단계보다 먼 자리는 숫자 칸 — 12 를 지우고 3 · 6 두 글자">
          <div className="flex w-full max-w-[300px] flex-col items-center gap-3">
            <TfFieldView look={tf.field} label="반복 횟수">
              <TfInputView look={tf.input} size="large" state="focused" prefix="총" value="36" suffix="회" />
            </TfFieldView>
            <span className="text-[12px] font-semibold" style={{ color: rc('fg-positive') }}>
              두 글자
            </span>
          </div>
        </Verdict>
        <Verdict ok={false} note="Quantity Picker 로 12 → 36 — + 를 스물네 번. 값 칸은 치지 못하고 누르고 있어도 오르지 않는다">
          <div className="flex w-full max-w-[300px] flex-col items-center gap-3">
            <QpView look={l} size="large" value={36} min={1} max={999} unit="회" placeholder="999회" frozen states={{ increment: 'pressed' }} ariaLabel="반복 횟수" />
            <Presses n={24} />
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

// 폰 폼 한 줄 — 반복 단위 Select 52 와 반복 간격 Quantity Picker 가 같은 줄. 나쁜 예는 Button large 높이로 그린 컨트롤
const SizeGuide: Fig = ({ caption }) => {
  const l = QL();
  const tf = TF();
  const sel = selectLook('hr');
  const bh = buttonLook({ size: 'large' }, 'hr').faces.light.enabled.height;
  // 버튼 줄 높이(Button large)로 맞춘 나쁜 예 — 스펙에 없는 크기를 그림에서만 만든다
  const wrong: QpLook = { ...l, sizes: { ...l.sizes, large: { ...l.sizes.large, h: bh, touch: bh } } };
  const w = PHONE - gutter() * 2;
  const row = (look: QpLook, mark: boolean) => (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', columnGap: tf.field.form.gapX, alignItems: 'start', width: w }}>
      <TfFieldView look={tf.field} label="반복 단위">
        <SelectTriggerView look={sel} size="large" state="enabled" labels={['매월']} />
      </TfFieldView>
      <QpField look={look} field={tf.field} preset={QP_PRESETS.interval} size="large" layout="fill" frozen />
      {mark && (
        <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, right: 0, bottom: l.sizes.large.h - bh, height: 0, borderTop: `1px dashed ${MARK_LINE}` }}>
          <span className="absolute rounded px-1 text-[10px] font-semibold leading-4 text-white" style={{ right: 0, top: 2, background: MARK_LINE }}>
            {l.sizes.large.h - bh}
          </span>
        </span>
      )}
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Verdict ok note={`옆 칸과 같은 large ${l.sizes.large.h} — 한 줄의 아래 끝이 맞는다`}>
          <Fit w={w}>{row(l, false)}</Fit>
        </Verdict>
        <Verdict ok={false} note={`버튼 줄 높이(${bh})에 맞춘 컨트롤 — 옆 칸과 ${l.sizes.large.h - bh} 어긋난다(분홍 점선)`}>
          <Fit w={w}>{row(wrong, true)}</Fit>
        </Verdict>
      </div>
    </Panel>
  );
};

const RangeGuide: Fig = ({ caption }) => {
  const l = QL();
  const tf = TF();
  const base: QpPreset = { ...QP_PRESETS.approvals, value: 3 };
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <Board style={{ width: '100%' }}>
            <QpField look={l} field={tf.field} preset={{ ...base, description: '고를 수 있는 승인자는 3명이에요.' }} size="large" frozen states={{ increment: 'focused' }} />
          </Board>
          <Cap strong="승인자 3명 — 0 ~ 3">최대에서 늘리기 막힘 — 위 끝을 데이터로 걸어 범위 밖 값이 들어오지 않는다</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Board style={{ width: '100%' }}>
            <QpField look={l} field={tf.field} preset={{ ...base, max: 2 }} size="large" invalid frozen />
          </Board>
          <Cap strong="승인자가 2명으로 — 3 이 범위 밖">값을 저절로 고치지 않고 오류 테두리 + Field 오류 글</Cap>
        </div>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExBasic: Fig = () => <ExQpBasicDemo look={QL()} field={TF().field} />;
const ExTable: Fig = () => <ExQpTableDemo look={QL()} saveLook={buttonLook({ variant: 'neutralSolid', size: 'small' }, 'hr')} />;
const ExServer: Fig = () => <ExQpServerDemo look={QL('desk')} />;

export const quantityPickerFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  layout: Layout,
  edge: Edge,
  removable: Removable,
  states: States,
  'when-guide': WhenGuide,
  'steps-guide': StepsGuide,
  'size-guide': SizeGuide,
  'range-guide': RangeGuide,
  'ex-basic': ExBasic,
  'ex-table': ExTable,
  'ex-server': ExServer,
};
