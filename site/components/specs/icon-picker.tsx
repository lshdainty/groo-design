// Icon Picker 페이지의 그림 — specs/components/icon-picker.md 의 `[그림: …](../../site/components/specs/icon-picker.tsx#<id>)` 자리.
// 격자 · 칸 · 고른 표시 · 찾기는 icon-picker.yaml 을 푼 값(iconPickerLook — icon-picker-view), 아이콘 세트는 category-icons.yaml(categoryIconSet),
// 트리거는 Input Button(input-button.yaml — select-view), 여는 자리는 Bottom Sheet · Popover(overlay-view), 찾기 칸은 Input 밑줄형,
// 결과 없음은 Result Section(result-section.yaml)이다. 찾기 칸은 본문 위에 붙고(스크롤 상자 밖 — 흐리지 않는다), 묶음 머리 · 격자는
// 끝 흐림 상자(본문 — scroll.scrollFog 켬이면 Scroll Fog overlayBody, 시트 · 팝오버의 fog 값) 안이다. 카테고리 이름은 지어낸 것이다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { LUCIDE_FIRST } from './category-glyphs';
import { resultSectionLook } from './feedback-look';
import { CategoryGlyph, IpCellView, IpGridView, IpListView, IpSearchView } from './icon-picker-view';
import { IconKeyboardDemo, IconPickerExDemo, IconPickerPlayground, type IpKit } from './icon-picker-play';
import { categoryIconSet, iconPickerLook, type IpState } from './input-look';
import { menuKit } from './menu-look';
import { IP_COUNT, gridColumns, searchIcons, triggerValue, type CategoryIcon } from './input-shared';
import { Phone, Verdict, WebWindow, rc, type Mode } from './kit';
import { Band, Legend, ov, pinStyle } from './overlay-screens';
import { DimView, PopoverSurface, SheetSurface, type OvDecor } from './overlay-view';
import { Cap, Surface, desk, tf } from './select-screens';
import { InputButtonView } from './select-view';
import { TfFieldView, TfInputView } from './text-field-view';
import { Readout } from './toggle-play';

type Fig = (p: { caption?: string }) => ReactNode;
const IP = () => iconPickerLook();
const SET = () => categoryIconSet();
const kit = (): IpKit => ({ look: IP(), set: SET(), select: desk(), field: tf().field, input: tf().input, result: resultSectionLook('desk'), ov: ov(), tip: menuKit('desk').bubble });
const STATE_KO: Record<IpState, string> = { enabled: '기본', hovered: '호버(웹)', focused: '포커스(키보드)', pressed: '누름' };
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;
// 폰 시트 본문 · 팝오버 본문 폭(여는 자리 폭 − 좌우 여백) — 칸이 들어가는 열 수의 기준
const SHEET_BODY = 360 - IP().surfaces.sheet.padX * 2;
const POP_BODY = () => IP().popoverWidth - IP().surfaces.popover.padX * 2;
// 여는 자리의 본문 여백 — icon-picker.yaml 의 값이 Bottom Sheet · Popover 의 본문 여백과 같아야 그림(SheetSurface · PopoverSurface)과 열이 맞는다
if (IP().surfaces.sheet.padX !== ov().sheet.body.padX || IP().surfaces.popover.padX !== ov().popover.body.padX) throw new Error(`icon-picker.yaml 의 surface.paddingX(${IP().surfaces.sheet.padX} · ${IP().surfaces.popover.padX})가 bottom-sheet · popover.yaml 본문 여백(${ov().sheet.body.padX} · ${ov().popover.body.padX})과 다르다`);
const entry = (id: string) => SET().entries.find((e) => e.id === id)!;

// 트리거 — 라벨 "아이콘" · 앞 지금 아이콘 · 값 이름 · 아래 화살표
function Trigger({ value, size = 'large', mode = 'auto', state = 'enabled', zone }: { value: string | null; size?: 'large' | 'medium'; mode?: Mode; state?: 'enabled' | 'pressed' | 'focused'; zone?: Parameters<typeof InputButtonView>[0]['zone'] }) {
  const v = triggerValue(IP(), SET(), value);
  return (
    <TfFieldView look={tf().field} mode={mode} label={IP().trigger.label}>
      <InputButtonView look={desk()} mode={mode} size={size} state={state} value={v.text} prefixNode={<CategoryGlyph id={v.id} size={24} />} suffixIcon="chevron-down" zone={zone} />
    </TfFieldView>
  );
}
// 여는 자리(멈춘 그림) — 찾기 칸은 본문 위(스크롤 상자 밖), 묶음 머리 · 격자는 본문(끝 흐림 상자) 안
type Where = 'sheet' | 'popover';
function Search({ surface, mode = 'auto', query = '', focused = false, pin }: { surface: Where; mode?: Mode; query?: string; focused?: boolean; pin?: ReactNode }) {
  return (
    <div className="relative">
      <IpSearchView look={IP()} input={tf().input} mode={mode} surface={surface} query={query} focused={focused} />
      {pin}
    </div>
  );
}
function List({ surface, mode = 'auto', value = 'coffee', query = '', groups, rows, states }: { surface: Where; mode?: Mode; value?: string | null; query?: string; groups?: string[]; rows?: number; states?: Record<string, IpState> }) {
  return <IpListView look={IP()} set={SET()} result={resultSectionLook('desk')} mode={mode} surface={surface} value={value} query={query} width={surface === 'sheet' ? SHEET_BODY : POP_BODY()} groups={groups} maxRowsPerGroup={rows} states={states} />;
}
type FrameProps = { mode?: Mode; children: ReactNode; h?: number; query?: string; focused?: boolean; searchPin?: ReactNode; offset?: number; decor?: OvDecor };
function Sheet_({ mode = 'auto', children, h, query, focused, searchPin, offset, decor }: FrameProps) {
  return (
    <SheetSurface look={ov().sheet} mode={mode} title={IP().title} top={<Search surface="sheet" mode={mode} query={query} focused={focused} pin={searchPin} />} fog={IP().surfaces.sheet.fog} offset={offset} decor={decor} style={h ? { height: h } : undefined}>
      {children}
    </SheetSurface>
  );
}
function Pop({ mode = 'auto', children, h, query, focused, searchPin, offset, decor }: FrameProps) {
  // 멈춘 그림 — 높이를 정하면 그 안에서 자른다(실제로는 본문이 스크롤된다)
  return (
    <PopoverSurface look={ov().popover} mode={mode} width={IP().popoverWidth} scroll={{ scrolled: false, offset }} maxHeight={h} top={<Search surface="popover" mode={mode} query={query} focused={focused} pin={searchPin} />} fog={IP().surfaces.popover.fog} decor={decor} style={h ? { height: h, overflow: 'hidden' } : undefined}>
      {children}
    </PopoverSurface>
  );
}
// 본문(스크롤 상자)의 위 끝 — 여는 자리 위에서 잰다: 시트는 머리 아래 찾기 칸, 머리 없는 팝오버는 본문 위 여백 + 찾기 칸
const sheetHead = () => ov().sheet.header.padTop + parseFloat(ov().sheet.title.lineHeight) + ov().sheet.header.padBottom;
const bodyTop = (w: Where) => (w === 'sheet' ? sheetHead() + IP().search.sheetH : ov().popover.body.padTop + IP().search.popoverH);
const fogOf = (w: Where) => (w === 'sheet' ? ov().sheet.fog : ov().popover.scroll.fog);
// 끝 흐림 자리 — 여는 자리 기준(본문의 마스크가 띠까지 흐리지 않게): 본문 위 · 바닥
const fogBands = (w: Where) => {
  const f = fogOf(w);
  const edge: CSSProperties = { background: 'transparent', boxShadow: `inset 0 0 0 1px ${MARK_LINE}` };
  return (
    <>
      <Band style={{ left: 0, right: 0, top: bodyTop(w), height: f.top, ...edge }} label={`위 ${f.top}`} />
      <Band style={{ left: 0, right: 0, bottom: 0, height: f.bottom, ...edge }} label={`아래 ${f.bottom}`} />
    </>
  );
};

// ── 화면 ──────────────────────────────────────────────────
function AppScreen({ mode }: { mode: Mode }) {
  return (
    <Phone title="카테고리 추가" mode={mode} scale={0.52} h={720} screenW={360} bg="bg-layer-default" overlay={
      <DimView dim={ov().sheet.dim} mode={mode} place="end">
        <Sheet_ mode={mode} h={560}>
          <List surface="sheet" mode={mode} groups={['식비', '카페', '교통']} />
        </Sheet_>
      </DimView>
    }>
      <div className="flex flex-col px-6 pt-4" style={{ gap: tf().field.form.gapY }}>
        <TfFieldView look={tf().field} mode={mode} label="이름">
          <TfInputView look={tf().input} mode={mode} size="large" state="enabled" value="카페" />
        </TfFieldView>
        <Trigger value="coffee" mode={mode} />
      </div>
    </Phone>
  );
}
// 데스크톱 창 — 팝오버가 트리거 아래 남은 자리를 채운다(묶음 머리 · 격자 몇 줄 + 아래 끝 흐림이 보이게)
const WEB_H = 680;
const WEB_POP_H = 330;
function WebScreen({ mode }: { mode: Mode }) {
  return (
    <WebWindow mode={mode} w={620} h={WEB_H}>
      <div className="h-full px-8 pt-6" style={{ background: rc('bg-layer-basement', mode) }}>
        <span className="block pb-4 text-[22px] font-bold leading-[30px]" style={{ color: rc('fg-neutral', mode) }}>
          카테고리 추가
        </span>
        <div className="flex flex-col" style={{ width: 408, gap: tf().field.form.gapY }}>
          <TfFieldView look={tf().field} mode={mode} label="이름">
            <TfInputView look={tf().input} mode={mode} size="medium" state="enabled" value="카페" />
          </TfFieldView>
          <div className="relative">
            <Trigger value="coffee" size="medium" mode={mode} state="pressed" />
            <div className="absolute left-0" style={{ top: `calc(100% + ${ov().popover.offset}px)`, zIndex: 5 }}>
              {/* 창 아래 끝까지 남은 높이만큼 — 팝오버의 최대 높이는 트리거 아래 남은 자리(Popover) */}
              <Pop mode={mode} h={WEB_POP_H}>
                <List surface="popover" mode={mode} groups={['식비', '카페', '교통']} />
              </Pop>
            </div>
          </div>
        </div>
      </div>
    </WebWindow>
  );
}
const Scaled = ({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) => (
  <div className="shrink-0" style={{ width: w * s, height: h * s }}>
    <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
  </div>
);

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <AppScreen mode={mode} />
          <Scaled w={620} h={WEB_H} s={0.6}>
            <WebScreen mode={mode} />
          </Scaled>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <IconPickerPlayground kit={kit()} surface={tf().surface.default} />;

// ── Anatomy ───────────────────────────────────────────────
// 해부의 시트 높이 — 두 묶음(머리 + 한 줄씩)이 아래 흐림 위에 다 보이게: 머리 + 찾기 칸 + 흐림 위 여백 + (묶음 머리 + 칸) × 2 + 흐림 아래 여백
const ANATOMY_H = () => {
  const l = IP();
  const f = fogOf('sheet');
  const group = l.header.padTop + parseFloat(l.header.text.lineHeight) + l.header.padBottom + l.cell.size;
  return bodyTop('sheet') + (l.surfaces.sheet.fog ? f.padTop + f.padBottom : 0) + group * 2;
};
const Anatomy: Fig = ({ caption }) => {
  const l = IP();
  const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-6 pb-8 pt-10">
        <div className="flex flex-wrap items-start justify-center gap-8">
          <div className="relative" style={{ width: 300 }}>
            <Trigger value="coffee" zone={{ box: dashed }} />
            {pinStyle('ⓐ', { left: -14, top: 20 })}
          </div>
          <div className="relative rounded-2xl" style={{ width: 360, ...dashed, outlineOffset: 4 }}>
            <Sheet_ h={ANATOMY_H()} searchPin={pinStyle('ⓒ', { left: -16, top: l.search.sheetH / 2 - 10 })}>
              <div className="relative">
                <List surface="sheet" groups={['식비', '카페']} rows={1} />
                {pinStyle('ⓓ', { left: -16, top: l.header.padTop + parseFloat(l.header.text.lineHeight) / 2 - 10 })}
              </div>
            </Sheet_>
            {pinStyle('ⓑ', { left: -12, top: -12 })}
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-center gap-6">
          <div className="relative flex flex-col items-center gap-2">
            <IpCellView look={l} entry={entry('cup-soda')} state="enabled" mark={dashed} />
            {pinStyle('ⓔ', { right: -14, top: -12 })}
            <Cap>{`칸 ${l.cell.size} · 아이콘 ${l.icon.size}`}</Cap>
          </div>
          <div className="relative flex flex-col items-center gap-2">
            <IpCellView look={l} entry={entry('coffee')} selected state="enabled" />
            {pinStyle('ⓕ', { right: -14, top: -12 })}
            <Cap>{`고름 — 안쪽 ${l.selected.borderWidth}px · 선 ${l.icon.selectedStroke}`}</Cap>
          </div>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Trigger — Input Button'],
            ['ⓑ', `Surface — Bottom Sheet · Popover ${l.popoverWidth}`],
            ['ⓒ', 'Search — Input 밑줄형'],
            ['ⓓ', 'Group Header'],
            ['ⓔ', `Cell — ${l.cell.size}`],
            ['ⓕ', 'Selected'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const TriggerFig: Fig = ({ caption }) => {
  const l = IP();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-4">
          {(['large', 'medium'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Surface style={{ width: 300 }}>
                <Trigger value="coffee" size={s} />
              </Surface>
              <Cap strong={`${s} ${desk().ib.sizes[s].h}`}>{s === 'large' ? `${l.breakpoint} 미만 · 앱 — 앞 아이콘 ${desk().ib.sizes.large.icon}` : `${l.breakpoint} 이상 — 앞 아이콘 ${desk().ib.sizes.medium.icon}`}</Cap>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            [null, `아이콘이 없는 항목 — "${l.trigger.none}"`],
            ['a-arrow-down', `세트 밖에 저장된 아이콘 — "${l.trigger.outside}"`],
          ].map(([v, cap]) => (
            <div key={String(v)} className="flex flex-col items-center gap-2">
              <Surface style={{ width: 300 }}>
                <Trigger value={v} />
              </Surface>
              <Cap>{cap}</Cap>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// 여는 자리 — 폰 시트 6열 · 데스크톱 팝오버 7열. 묶음 머리 · 격자는 끝 흐림 상자(위 · 아래 흐림 + 그만큼 안 여백) 안에서 스크롤하고
// 찾기 칸은 그 밖이라 흐리지 않는다 — 찾기 칸 ↔ 첫 머리 글 = 흐림 여백 + 머리 위 여백
const SurfaceFig: Fig = ({ caption }) => {
  const l = IP();
  const sheet = gridColumns(l, SHEET_BODY, l.surfaces.sheet.columns);
  const pop = gridColumns(l, POP_BODY(), l.surfaces.popover.columns);
  const fogCap = (w: Where) => {
    if (!l.surfaces[w].fog) return '';
    const f = fogOf(w);
    return ` · 끝 흐림 위 ${f.top} · 아래 ${f.bottom}(찾기 칸은 밖) · 찾기 칸 ↔ 첫 머리 글 ${f.padTop + l.header.padTop}`;
  };
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="flex max-w-[360px] flex-col items-center gap-2">
          <div style={{ width: 360 }}>
            <Sheet_ h={440} decor={l.surfaces.sheet.fog ? { root: fogBands('sheet') } : undefined}>
              <List surface="sheet" groups={['식비', '카페', '교통']} />
            </Sheet_>
          </div>
          <Cap strong={`Bottom Sheet — ${sheet.cols}열`}>{`${l.breakpoint} 미만 · 앱. 본문 ${SHEET_BODY} · 칸 사이 ${sheet.gap.toFixed(1)}${fogCap('sheet')}`}</Cap>
        </div>
        <div className="flex max-w-[408px] flex-col items-center gap-2">
          <Pop h={440} decor={l.surfaces.popover.fog ? { root: fogBands('popover') } : undefined}>
            <List surface="popover" groups={['식비', '카페', '교통']} />
          </Pop>
          <Cap strong={`Popover ${l.popoverWidth} — ${pop.cols}열`}>{`${l.breakpoint} 이상. 본문 ${POP_BODY()} · 칸 사이 ${pop.gap}${fogCap('popover')}`}</Cap>
        </div>
      </div>
    </Panel>
  );
};

// 세트 전체 — 13 묶음 148개, 이름과 함께
const SetFig: Fig = ({ caption }) => {
  const l = IP();
  const s = SET();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-5 rounded-xl p-5" style={{ background: rc('bg-layer-default') }}>
        {s.groups.map((g) => {
          const list = s.entries.filter((e) => e.group === g);
          return (
            <section key={g} className="flex flex-col gap-2">
              <h4 className="m-0 text-[14px] font-medium leading-[19px]" style={{ color: rc('fg-neutral-subtle') }}>
                {g} <span className="tabular-nums">{list.length}</span>
              </h4>
              <div className="grid gap-x-1 gap-y-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${l.cell.size + 24}px, 1fr))` }}>
                {list.map((e) => (
                  <div key={e.id} className="flex flex-col items-center gap-1">
                    <IpCellView look={l} entry={e} state="enabled" />
                    <span className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral') }}>
                      {e.name}
                    </span>
                    <code className="text-center text-[10px] leading-3" style={{ color: rc('fg-neutral-subtle') }}>
                      {e.id}
                    </code>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        <p className="m-0 text-center text-[12px] leading-5" style={{ color: rc('fg-neutral-subtle') }}>
          {`모두 ${s.entries.length}개 · ${s.groups.length} 묶음 — 기본(아이콘 없는 항목)은 ${entry(s.default).name}`}
        </p>
      </div>
    </Panel>
  );
};

// 격자 · 칸 — 칸 48 · 아이콘 24 · 사이 · 묶음 머리, 폰 342 · 팝오버 360
const GridFig: Fig = ({ caption }) => {
  const l = IP();
  const frame = (w: number, label: string) => {
    const { cols, gap } = gridColumns(l, w);
    const headH = parseFloat(l.header.text.lineHeight) + l.header.padTop + l.header.padBottom;
    return (
      <div className="flex flex-col items-center gap-2">
        <Surface style={{ paddingTop: 24, paddingLeft: 44 }}>
          <div className="relative" style={{ width: w }}>
            <IpGridView look={l} set={SET()} width={w} groups={['카페', '교통']} entries={SET().entries.filter((e) => ['카페', '교통'].includes(e.group))} value="coffee" maxRowsPerGroup={1} />
            <Band style={{ left: 0, right: 0, top: 0, height: l.header.padTop }} label={String(l.header.padTop)} />
            <Band style={{ left: 0, right: 0, top: headH - l.header.padBottom, height: l.header.padBottom }} label={String(l.header.padBottom)} />
            {cols > 1 && <Band style={{ left: l.cell.size, width: gap, top: headH, height: l.cell.size }} label={gap % 1 ? gap.toFixed(1) : String(gap)} />}
            <Band style={{ left: -12, width: 3, top: headH, height: l.cell.size }} />
            <span aria-hidden className="absolute text-[10px] font-bold leading-4" style={{ left: -18, top: headH + l.cell.size / 2 - 8, transform: 'translateX(-100%)', color: MARK_LINE }}>{`${l.cell.size}`}</span>
          </div>
        </Surface>
        <Cap strong={label}>{`${cols}열 · 칸 사이 ${gap % 1 ? gap.toFixed(1) : gap} · 줄 사이 ${l.grid.rowGap} · 머리 위 ${l.header.padTop} 아래 ${l.header.padBottom}`}</Cap>
      </div>
    );
  };
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-4 overflow-x-auto">
        {frame(342, '폰 342')}
        {frame(POP_BODY(), `팝오버 ${POP_BODY()}`)}
      </div>
    </Panel>
  );
};

// 고른 칸 — 안쪽 2px 짙은 테두리 · 선 2.5(라이트 · 다크)
const SelectedFig: Fig = ({ caption }) => {
  const l = IP();
  const ids = ['coffee', 'cup-soda', 'beer', 'bean'];
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <div className="flex gap-1 rounded-xl p-4" style={{ background: rc('bg-layer-floating', mode) }}>
              {ids.map((id) => (
                <IpCellView key={id} look={l} mode={mode} entry={entry(id)} selected={id === 'coffee'} state="enabled" />
              ))}
            </div>
            <Cap strong={mode === 'light' ? '라이트' : '다크'}>{`커피를 골랐다 — 바탕은 칠하지 않는다(시트 · 팝오버 면 그대로)`}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 찾기 — "커피" → 커피 · 원두 · "월세" → 집 · "유니콘" → 결과 없음
const SearchFig: Fig = ({ caption }) => {
  const l = IP();
  // 찾는 동안 찾기 칸 ↔ 격자 — 스크롤 상자 위 여백(끝 흐림) + searchGap
  const gap = (l.surfaces.sheet.fog ? fogOf('sheet').padTop : 0) + l.grid.searchGap;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-3">
        {['커피', '월세', '유니콘'].map((q) => {
          const n = searchIcons(SET(), q).length;
          return (
            <div key={q} className="flex flex-col items-center gap-2">
              <Scaled w={360} h={330} s={0.58}>
                <Sheet_ h={330} query={q} focused>
                  <List surface="sheet" query={q} value={null} />
                </Sheet_>
              </Scaled>
              <Cap strong={`“${q}”`}>{n ? `${IP_COUNT.text.replace('{n}', String(n))} — 치기를 멈추면 화면 밖으로 한 번 읽는다. 찾기 칸 ↔ 격자 ${gap}` : 'Result Section medium — role="status"'}</Cap>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

// 상태 — 기본 · 호버 · 포커스 · 누름 × 안 고름 · 고름(라이트 · 다크)
const States: Fig = ({ caption }) => {
  const order: IpState[] = ['enabled', 'hovered', 'focused', 'pressed'];
  const l = IP();
  const table = (mode: 'light' | 'dark') => (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl p-5" style={{ background: rc('bg-layer-floating', mode) }}>
        <div className="grid grid-cols-[max-content_max-content_max-content] items-center gap-x-6 gap-y-3">
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
              {[false, true].map((sel) => (
                <span key={String(sel)} className="flex justify-center p-1">
                  <IpCellView look={l} mode={mode} entry={entry('coffee')} selected={sel} state={st} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>호버 = 누름 바탕(bg-layer-floating-pressed) · 누름은 2px 축소 · 포커스 링은 칸 바깥</Cap>
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

// ── Guidelines ────────────────────────────────────────────
function LucideFirst() {
  const l = IP();
  const fake: CategoryIcon[] = LUCIDE_FIRST.map((id) => ({ id, group: '', name: id, aliases: [] }));
  const w = SHEET_BODY;
  const { cols, gap } = gridColumns(l, w);
  return (
    <div className="flex flex-col gap-1">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, ${l.cell.size}px)`, columnGap: gap, rowGap: l.grid.rowGap }}>
        {fake.slice(0, cols * 2).map((e) => (
          <IpCellView key={e.id} look={l} entry={e} state="enabled" />
        ))}
      </div>
      <span className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle') }}>
        a-arrow-down · a-arrow-up · a-large-small … 2,007개
      </span>
    </div>
  );
}
const SCOPE_H = 400;
const ScopeGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="고른 세트(148개 · 13 묶음)만 — 첫 화면이 식비 · 카페 … 로 열려 찾지 않고도 고른다">
        <Scaled w={360} h={SCOPE_H} s={0.78}>
          <Sheet_ h={SCOPE_H}>
            <List surface="sheet" groups={['식비', '카페']} rows={2} />
          </Sheet_>
        </Scaled>
      </Verdict>
      <Verdict ok={false} note="lucide 전체(2,007) — 첫 화면이 'a-arrow-down …' 이라 사실상 찾기로만 고른다(지금 웹 · 앱)">
        <Scaled w={360} h={SCOPE_H} s={0.78}>
          <Sheet_ h={SCOPE_H}>
            <LucideFirst />
          </Sheet_>
        </Scaled>
      </Verdict>
    </Pair>
  </Panel>
);

const NameGuide: Fig = ({ caption }) => {
  const l = IP();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="칸 이름은 한국어 이름 — '커피, 선택됨'. 트리거 값도 같은 글">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1 rounded-xl p-4" style={{ background: rc('bg-layer-floating') }}>
              {['coffee', 'cup-soda', 'beer'].map((id) => (
                <IpCellView key={id} look={l} entry={entry(id)} selected={id === 'coffee'} state={id === 'coffee' ? 'focused' : 'enabled'} />
              ))}
            </div>
            <Readout text="커피, 선택됨, 3개 중 1번째" />
          </div>
        </Verdict>
        <Verdict ok={false} note="영어 lucide 이름을 이름으로 — 'a-arrow-down' 이 그대로 읽히고 툴팁에 뜬다(지금 웹)">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1 rounded-xl p-4" style={{ background: rc('bg-layer-floating') }}>
              {LUCIDE_FIRST.slice(0, 3).map((id) => (
                <IpCellView key={id} look={l} entry={{ id, group: '', name: id, aliases: [] }} state={id === 'a-arrow-down' ? 'focused' : 'enabled'} />
              ))}
            </div>
            <Readout text="a-arrow-down, 버튼" />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 직접 눌러 보기 — 커피에서 ↓ → 교통 묶음의 같은 열(팝오버 7열 — 카페 일곱이 한 줄)
const Keyboard: Fig = () => <IconKeyboardDemo kit={kit()} width={POP_BODY()} groups={['카페', '교통']} surface={ov().popover.bg} />;

// ── 코드 미리보기 ─────────────────────────────────────────
const ExBasic: Fig = () => <IconPickerExDemo kit={kit()} surface={tf().surface.default} />;
// 트리거 값 — 세트 안 "커피" · 옛 이름 home → 집 · 세트 밖 "지금 아이콘" · 비었으면 "태그"
const ExName: Fig = ({ caption }) => {
  const rows: [string, string | null][] = [
    ['findCategoryIcon("coffee")', 'coffee'],
    ['findCategoryIcon("home") — 서버 시드의 옛 이름', 'home'],
    ['findCategoryIcon("a-arrow-down") → null', 'a-arrow-down'],
    ['"" · null — 아이콘이 없는 항목', null],
  ];
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid w-full max-w-[680px] gap-3 sm:grid-cols-2">
        {rows.map(([code, v]) => (
          <div key={code} className="flex flex-col gap-2">
            <code className="text-[12px] text-fd-muted-foreground">{code}</code>
            <Surface style={{ padding: 16 }}>
              <Trigger value={v} />
            </Surface>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export const iconPickerFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  trigger: TriggerFig,
  surface: SurfaceFig,
  set: SetFig,
  grid: GridFig,
  selected: SelectedFig,
  search: SearchFig,
  states: States,
  'scope-guide': ScopeGuide,
  'name-guide': NameGuide,
  keyboard: Keyboard,
  'ex-basic': ExBasic,
  'ex-name': ExName,
};
