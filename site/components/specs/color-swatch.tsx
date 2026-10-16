// Color Swatch 페이지의 그림 — specs/components/color-swatch.md 의 `[그림: …](../../site/components/specs/color-swatch.tsx#<id>)` 자리.
// 묶음은 color-swatch.yaml 을 푼 값(swatchLook — swatch-view)으로, 칸의 색은 v110 차트 10색(DESIGN.md), 묶음 이름은 Field(field.yaml)로 그린다.
// 대화상자 · 시트는 dialog · bottom-sheet.yaml(kit), 아이콘 칸은 Icon Picker 의 트리거(Input Button — select-view). 카테고리는 지어낸 것이다.
import type { CSSProperties, ReactNode } from 'react';
import { Panel, MARK_LINE, Table } from '../foundations/ui';
import { color, contrast, design } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { categoryIconSet, iconPickerLook, swatchLook, type SwatchState } from './input-look';
import { menuKit } from './menu-look';
import { CURRENT, firstUnused, triggerValue, type SwatchCurrent } from './input-shared';
import { CategoryGlyph } from './icon-picker-view';
import { Phone, Sheet, Verdict, WebDialog, WebWindow, rc, type Mode } from './kit';
import { Band, Legend, ov, pinStyle } from './overlay-screens';
import { EndButtons } from './overlay-view';
import { ButtonView } from './button-view';
import { Cap, Surface, desk, tf } from './select-screens';
import { InputButtonView } from './select-view';
import { AutoFit, SwatchAutoDemo, SwatchEditDemo, SwatchNewDemo, SwatchPlayground } from './swatch-play';
import { SwatchGroupView } from './swatch-view';
import { TfFieldView, TfInputView } from './text-field-view';

type Fig = (p: { caption?: string }) => ReactNode;
const SW = () => swatchLook();
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;
const STATE_KO: Record<SwatchState, string> = { enabled: '기본', hovered: '호버(웹)', focused: '포커스(키보드)', pressed: '누름', disabled: '막힘' };
// 칸 툴팁의 말풍선(help-bubble.yaml) — 실제로 쓰는 묶음(플레이그라운드 · 코드 미리보기)
const TIP = () => menuKit('desk').bubble;

// 기본 지출 카테고리 여덟(서버 시드 — 이름 · 아이콘 · 색은 그림을 위해 지어냈다. 여덟 색을 쓰고 식비가 빨강)
export const DEFAULT_CATS: [string, string, string][] = [
  ['식비', 'utensils', 'red'],
  ['카페', 'coffee', 'orange'],
  ['교통', 'bus', 'yellow'],
  ['주거', 'house', 'green'],
  ['생활', 'shopping-cart', 'blue'],
  ['쇼핑', 'shirt', 'indigo'],
  ['건강', 'heart', 'violet'],
  ['문화', 'film', 'pink'],
];
const USED = DEFAULT_CATS.map(([, , c]) => c);

// 멈춘 묶음 — 묶음 이름(Field 라벨) + 격자
// 멈춘 그림은 배치를 정해 준다 — 기본은 옆으로(지금 색 칸 · 세로 선 · 격자), stack 이면 위 줄에 쌓은 모습
function G({ value, current, mode = 'auto', states, disabled = false, label = '색상', stack = false, marks, pins }: { value?: string; current?: SwatchCurrent; mode?: Mode; states?: Record<string, SwatchState>; disabled?: boolean; label?: string; stack?: boolean; marks?: Parameters<typeof SwatchGroupView>[0]['marks']; pins?: Parameters<typeof SwatchGroupView>[0]['pins'] }) {
  return (
    <TfFieldView look={tf().field} mode={mode} label={label ? <span style={{ color: disabled ? rc('fg-disabled', mode) : undefined }}>{label}</span> : undefined}>
      <SwatchGroupView look={SW()} mode={mode} value={value} current={current} states={states} disabled={disabled} stack={stack} marks={marks} pins={pins} />
    </TfFieldView>
  );
}

// ── 화면 — 카테고리 추가(이름 · 아이콘 · 색상) ─────────────
function IconTrigger({ mode, size }: { mode: Mode; size: 'large' | 'medium' }) {
  const ip = iconPickerLook();
  const v = triggerValue(ip, categoryIconSet(), 'tag');
  return (
    <TfFieldView look={tf().field} mode={mode} label={ip.trigger.label}>
      <InputButtonView look={desk()} mode={mode} size={size} state="enabled" value={v.text} prefixNode={<CategoryGlyph id={v.id} size={24} />} suffixIcon="chevron-down" />
    </TfFieldView>
  );
}
function CategoryForm({ mode, size }: { mode: Mode; size: 'large' | 'medium' }) {
  return (
    <div className="flex flex-col" style={{ gap: tf().field.form.gapY }}>
      <TfFieldView look={tf().field} mode={mode} label="이름">
        <TfInputView look={tf().input} mode={mode} size={size} state="enabled" value="반려동물" />
      </TfFieldView>
      <IconTrigger mode={mode} size={size} />
      <G mode={mode} value={firstUnused(SW(), USED)} />
    </div>
  );
}
function AddDialog({ mode }: { mode: Mode }) {
  const s = ov().dialog.footer.button.size;
  return (
    <WebWindow mode={mode} w={640} h={560}>
      <WebDialog
        title="카테고리 추가"
        mode={mode}
        footer={
          <EndButtons
            mode={mode}
            items={[
              { label: '취소', look: buttonLook({ variant: 'neutralWeak', size: s }), state: 'enabled' },
              { label: '추가', look: buttonLook({ size: s }), state: 'enabled' },
            ]}
          />
        }
      >
        <CategoryForm mode={mode} size="medium" />
      </WebDialog>
    </WebWindow>
  );
}
function AddSheet({ mode }: { mode: Mode }) {
  return (
    <Phone title="카테고리" mode={mode} scale={0.52} h={720} screenW={360} overlay={
      <Sheet title="카테고리 추가" mode={mode} footer={<ButtonView look={buttonLook({ size: ov().sheet.footer.button.size })} mode={mode} label="추가" fill state="enabled" />}>
        <CategoryForm mode={mode} size="large" />
      </Sheet>
    }>
      <div />
    </Phone>
  );
}
// 묶음(Field 머리 + 격자)의 폭 · 높이 — 판에 맞춰 줄여 그릴 때
const groupW = (current: boolean) => SW().width + (current ? SW().size + SW().divider.gap * 2 + SW().divider.width : 0);
const groupH = () => parseFloat(tf().field.label.text.lineHeight) + tf().field.gap + SW().size * 2 + SW().gap;
const Fit = ({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) => (
  <div style={{ width: w * s, height: h * s }}>
    <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
  </div>
);

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-wrap items-start justify-center gap-4">
          <AutoFit w={640} max={0.6}>
            <AddDialog mode={mode} />
          </AutoFit>
          <AddSheet mode={mode} />
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <SwatchPlayground looks={{ desk: swatchLook('desk'), hr: swatchLook('hr') }} fields={{ desk: tf().field, hr: tf().field }} surface={tf().surface.default} tips={{ desk: menuKit('desk').bubble, hr: menuKit('hr').bubble }} />;

// ── Anatomy ───────────────────────────────────────────────
// 묶음 둘레의 핀 자리(핀이 묶음 밖으로 12 ~ 24 나온다)
const ANAT_PAD = 24;
const Anatomy: Fig = ({ caption }) => {
  const l = SW();
  const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-4 pb-8 pt-6 sm:px-10 sm:pt-10">
        <AutoFit w={groupW(true) + ANAT_PAD * 2}>
        <div style={{ paddingTop: ANAT_PAD, paddingRight: ANAT_PAD, paddingBottom: ANAT_PAD, paddingLeft: ANAT_PAD }}>
        <div className="relative">
          <G
            value="blue"
            current={{ kind: 'custom', hex: l.custom.hex }}
            marks={{ group: dashed, divider: { background: MARK_LINE } }}
            pins={{
              group: pinStyle('ⓐ', { right: -12, bottom: -14 }),
              current: pinStyle('ⓔ', { left: -14, top: -12 }),
              swatch: (
                <>
                  {pinStyle('ⓓ', { right: -24, top: -22 })}
                  {pinStyle('ⓒ', { left: l.size / 2 + 4, top: l.size / 2 + 4 })}
                </>
              ),
            }}
            states={{ red: 'enabled' }}
          />
          {/* ⓑ — 격자 첫 칸(빨강)의 왼쪽 위. 격자는 지금 색 칸 · 세로 선 오른쪽, Field 머리 아래에서 시작한다 */}
          {pinStyle('ⓑ', { left: l.size + l.divider.gap * 2 + l.divider.width - 12, top: parseFloat(tf().field.label.text.lineHeight) + tf().field.gap - 12 })}
        </div>
        </div>
        </AutoFit>
        <Legend
          items={[
            ['ⓐ', `Group — ${l.columns} × ${l.colors.length / l.columns} · 사이 ${l.gap}`],
            ['ⓑ', `Swatch — 원 ${l.size} · 누르는 ${l.touch}`],
            ['ⓒ', `Check — ${l.check.size} · 선 ${l.check.stroke}`],
            ['ⓓ', `Ring — 띄움 ${l.ring.offset} · ${l.ring.width}px`],
            ['ⓔ', `Current — "${l.names.current}" · "${l.names.auto}"`],
          ]}
        />
        <span className="text-center text-[12px] pk-muted">파랑을 고른 묶음 — 고른 칸 가운데가 ⓒ 체크, 둘레가 ⓓ 고리</span>
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
// 10색 — 라이트 700 · 다크 800-dark, 칸마다 이름 · 대비
const Colors: Fig = ({ caption }) => {
  const l = SW();
  const c = design('desk').front.colors;
  const surface = { light: color('bg-layer-default'), dark: c['bg-layer-default-dark'] ?? color('bg-layer-default') };
  const check = { light: color('fg-neutral-inverted'), dark: c['fg-neutral-inverted-dark'] };
  const dot = (hex: string) => <span aria-hidden className="inline-block h-6 w-6 rounded-full align-middle" style={{ background: hex }} />;
  return (
    <Panel caption={caption}>
      <div className="w-full rounded-xl bg-white p-1 dark:bg-fd-card">
        <Table head={['이름', '라이트', '다크', '표면 대비(라이트 · 다크)', '체크 대비(라이트 · 다크)']} minWidth={560}>
          {l.colors.map((sw) => (
            <tr key={sw.key}>
              <td>
                <b>{sw.name}</b> <code className="text-[12px] text-fd-muted-foreground">chart-{sw.key}</code>
              </td>
              <td>
                {dot(sw.color.light)} <code className="ml-1 text-[12px]">{sw.color.light.toUpperCase()}</code>
              </td>
              <td>
                {dot(sw.color.dark)} <code className="ml-1 text-[12px]">{sw.color.dark.toUpperCase()}</code>
              </td>
              <td className="tabular-nums">
                {contrast(sw.color.light, surface.light).toFixed(2)} · {contrast(sw.color.dark, surface.dark).toFixed(2)}
              </td>
              <td className="tabular-nums">
                {contrast(check.light, sw.color.light).toFixed(2)} · {contrast(check.dark, sw.color.dark).toFixed(2)}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </Panel>
  );
};

// 크기 · 배치 — 원 40 · 5 × 2 · 사이 12, 데스크톱 476 · 폰 342 에서 같다
const Size: Fig = ({ caption }) => {
  const l = SW();
  const frame = (w: number, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <Surface style={{ width: w, paddingLeft: 0, paddingRight: 0 }}>
        <div className="relative" style={{ marginLeft: 20, marginRight: 20, paddingTop: 22 }}>
          <Band style={{ left: 0, width: l.width, top: 0, height: 3 }} />
          <span aria-hidden className="absolute text-[10px] font-bold leading-4" style={{ left: l.width / 2 - 20, top: 4, color: MARK_LINE }}>
            {`${l.width}`}
          </span>
          <div className="relative" style={{ paddingTop: 14 }}>
            <SwatchGroupView look={l} value="green" />
            <Band style={{ left: l.size, width: l.gap, top: 14, height: l.size }} label={String(l.gap)} />
            <Band style={{ left: 0, width: l.size, top: 14 + l.size + l.gap + l.size + 4, height: 3 }} />
            <span aria-hidden className="absolute text-[10px] font-bold leading-4" style={{ left: l.size / 2 - 8, top: 14 + l.size * 2 + l.gap + 8, color: MARK_LINE }}>
              {l.size}
            </span>
          </div>
          <div style={{ height: 22 }} />
        </div>
      </Surface>
      <Cap strong={label}>{`늘 ${l.columns}개씩 두 줄 — 남는 폭은 비워 둔다`}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4 overflow-x-auto">
        {frame(476, '데스크톱 대화상자 476')}
        {frame(342, '폰 시트 342')}
      </div>
    </Panel>
  );
};

// 고른 칸 — 고리(띄움 2 · 2px) + 체크, 라이트 흰 · 다크 짙은 체크
const Selected: Fig = ({ caption }) => {
  const l = SW();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Surface mode={mode}>
              <SwatchGroupView look={l} mode={mode} value="indigo" />
            </Surface>
            <Cap strong={mode === 'light' ? '라이트 — 흰 체크' : '다크 — 짙은 체크'}>{`고리 ${l.ring.width}px · 띄움 ${l.ring.offset}(stroke-neutral-contrast) · 체크 ${l.check.size}(fg-neutral-inverted)`}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 지금 색 · 자동 — 옆으로(대화상자 · 390 폰) 둘, 그리고 360 폰(본문 312)에서 위 줄에 쌓인 모습
const STACK_PHONE = 360;
const Current: Fig = ({ caption }) => {
  const l = SW();
  const D = l.divider;
  const padX = ov().sheet.body.padX;
  const body = STACK_PHONE - padX * 2;
  if (body >= D.stackBelow) throw new Error(`color-swatch.tsx#current — ${STACK_PHONE} 폰 본문(${body})이 쌓는 경계(${D.stackBelow})보다 좁지 않다 — 그림을 고친다`);
  // 쌓은 묶음의 세로 자리 — Field 머리 아래 지금 색 칸(+ 아래 글), 사이 · 선 · 사이, 격자
  const head = parseFloat(tf().field.label.text.lineHeight) + tf().field.gap;
  const col = l.size + l.currentLabel.gap + parseFloat(l.currentLabel.text.lineHeight);
  const TOP = 22;
  const gap1 = TOP + head + col;
  const gap2 = gap1 + D.gap + D.width;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-4">
        {[
          { cur: { kind: 'custom', hex: l.custom.hex } as SwatchCurrent, cap: `팔레트 밖 ${l.custom.hex} — "${l.names.current}" 칸이 골라져 있다` },
          { cur: { kind: 'auto', color: 'brown' } as SwatchCurrent, cap: `색 없음 — "${l.names.auto}"(차트가 줄 색을 점선 원으로)` },
        ].map(({ cur, cap }) => (
          <div key={cur.kind} className="flex max-w-full flex-col items-center gap-2">
            <AutoFit w={groupW(true) + 40}>
              <Surface>
                <G value={CURRENT} current={cur} />
              </Surface>
            </AutoFit>
            <Cap>{cap}</Cap>
          </div>
        ))}
        <div className="flex max-w-full flex-col items-center gap-2">
          <AutoFit w={STACK_PHONE}>
            <Surface style={{ width: STACK_PHONE, paddingLeft: padX, paddingRight: padX }}>
              <div className="relative" style={{ paddingTop: TOP }}>
                <Band style={{ left: 0, width: body, top: 0, height: 3 }} />
                <span aria-hidden className="absolute text-[10px] font-bold leading-4" style={{ left: body / 2 - 24, top: 4, color: MARK_LINE }}>
                  {`본문 ${body}`}
                </span>
                <G value={CURRENT} current={{ kind: 'custom', hex: l.custom.hex }} stack />
                {/* 사이 16 · 선 · 사이 16 — 띠는 왼쪽 칸 폭만큼(선이 보이게) */}
                <Band style={{ left: 0, width: l.size, top: gap1, height: D.gap }} label={String(D.gap)} />
                <Band style={{ left: 0, width: l.size, top: gap2, height: D.gap }} label={String(D.gap)} />
              </div>
            </Surface>
          </AutoFit>
          <Cap strong={`${STACK_PHONE} 폰 — 본문 ${body}`}>{`${D.stackBelow}(칸 · 선 · 격자)보다 좁으면 지금 색 칸을 격자 위 줄에 — 가로 선 ${D.width}px · 사이 ${D.gap}`}</Cap>
        </div>
      </div>
    </Panel>
  );
};

// 상태 — 기본 · 포커스 · 누름 · 막힘 × 안 고름 · 고름(라이트 · 다크)
const States: Fig = ({ caption }) => {
  const order: SwatchState[] = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'];
  const l = SW();
  const table = (mode: 'light' | 'dark') => (
    <div className="flex flex-col items-center gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        <div className="grid grid-cols-[max-content_max-content_max-content] items-center gap-x-8 gap-y-5">
          <span />
          {['안 고름', '고름'].map((h) => (
            <span key={h} className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {h}
            </span>
          ))}
          {order.map((st) => (
            <div key={st} className="contents">
              <span className="text-[12px] font-bold leading-4" style={{ color: rc('fg-neutral', mode) }}>
                {STATE_KO[st]}
              </span>
              {['orange', 'blue'].map((c) => (
                <span key={c} className="flex justify-center p-2">
                  <SingleSwatch mode={mode} color={c} selected={c === 'blue'} state={st} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>{`호버는 칸이 그대로(이름 툴팁만 뜬다) · 포커스 링 ${l.focus.width}px(띄움 ${l.focus.offset}) · 누름 2px 축소 · 막힘은 색 그대로, 고른 고리만 회색`}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};
// 칸 하나만 — 묶음에서 그 칸만 보이게(격자 한 칸)
function SingleSwatch({ mode, color: c, selected, state }: { mode: Mode; color: string; selected: boolean; state: SwatchState }) {
  const l = SW();
  const one = { ...l, colors: l.colors.filter((x) => x.key === c), columns: 1, width: l.size };
  return <SwatchGroupView look={one} mode={mode} value={selected ? c : undefined} states={{ [c]: state }} disabled={state === 'disabled'} />;
}

// ── Guidelines ────────────────────────────────────────────
function CatList({ extra }: { extra?: [string, string] }) {
  const rows: [string, string][] = [...DEFAULT_CATS.map(([n, , c]) => [n, c] as [string, string]), ...(extra ? [extra] : [])];
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
      {rows.map(([n, c], i) => (
        <span key={n} className="flex items-center gap-1.5 text-[13px] leading-[18px]" style={{ color: rc('fg-neutral'), fontWeight: extra && i === rows.length - 1 ? 700 : 400 }}>
          <span aria-hidden className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: rc(`chart-${c}`) }} />
          {n}
        </span>
      ))}
    </div>
  );
}
const NewGuide: Fig = ({ caption }) => {
  const l = SW();
  const first = firstUnused(l, USED);
  const name = l.colors.find((c) => c.key === first)!.name;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`쓰지 않은 첫 색(v110 배정 순서 — 회색은 빼고)으로 시작 — 기본 여덟이 쓰는 색을 빼면 ${name}`}>
          <div className="flex w-full max-w-[300px] flex-col gap-3">
            <CatList extra={['반려동물', first]} />
            <Surface style={{ padding: 10 }}>
              <G value={first} />
            </Surface>
          </div>
        </Verdict>
        <Verdict ok={false} note="늘 빨강으로 시작 — 아홉 번째가 식비와 같은 색이 되어 차트에서 둘을 가를 수 없다">
          <div className="flex w-full max-w-[300px] flex-col gap-3">
            <CatList extra={['반려동물', 'red']} />
            <Surface style={{ padding: 10 }}>
              <G value="red" />
            </Surface>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};
const EditGuide: Fig = ({ caption }) => {
  const l = SW();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`가져온 분류(${l.custom.hex})를 열면 "${l.names.current}" 이 골라져 있다 — 이름만 고쳐 저장해도 색은 그대로`}>
          <Surface style={{ padding: 10 }}>
            <Fit w={groupW(true)} h={groupH()} s={0.78}>
              <G value={CURRENT} current={{ kind: 'custom', hex: l.custom.hex }} />
            </Fit>
          </Surface>
        </Verdict>
        <Verdict ok={false} note="열면 빨강이 골라져 있다 — 이름만 고쳐 저장해도 몰래 빨강(#c73838)이 나간다(지금 웹 · 앱)">
          <Surface style={{ padding: 10 }}>
            <Fit w={groupW(false)} h={groupH()} s={0.78}>
              <G value="red" />
            </Fit>
          </Surface>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExNew: Fig = () => <SwatchNewDemo look={SW()} field={tf().field} used={USED} surface={tf().surface.default} tip={TIP()} />;
const ExEdit: Fig = () => <SwatchEditDemo look={SW()} field={tf().field} surface={tf().surface.default} tip={TIP()} />;
const ExAuto: Fig = () => <SwatchAutoDemo look={SW()} field={tf().field} surface={tf().surface.default} auto="brown" tip={TIP()} />;

export const colorSwatchFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  colors: Colors,
  size: Size,
  selected: Selected,
  current: Current,
  states: States,
  'new-guide': NewGuide,
  'edit-guide': EditGuide,
  'ex-new': ExNew,
  'ex-edit': ExEdit,
  'ex-auto': ExAuto,
};
