// Scroll Fog 페이지의 그림 — specs/components/scroll-fog.md 의 `[그림: …](../../site/components/specs/scroll-fog.tsx#<id>)` 자리.
// 흐림(gradient-fade-mask 마스크) · 깊이 · 여백 · 스크롤 여유는 scroll-fog.yaml 을 푼 값(loadingKit().fog)으로, 칩은 chip.yaml, 목록 줄은 list.yaml,
// 시트는 bottom-sheet.yaml, 버튼은 button.yaml 로 그린다. 화면 틀(폰 · 카드 제목)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { axisDesc, loadComponentSpec } from '@/lib/component-spec';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { chipLook } from './chip-look';
import { ChipView } from './chip-view';
import { Verdict, rc, type Mode } from './kit';
import { listLook } from './list-look';
import { ListView } from './list-view';
import { CATEGORY, FILTER_CHIPS, TERMS } from './loading-data';
import { FogRowDemo, FogSheetDemo } from './loading-demos';
import { FOG_USES, fogMaskStyle, type FogUse } from './loading-look';
import { ScrollFogPlayground } from './loading-playground';
import { ScrollFogView, type ScrollFogViewProps } from './loading-view';
import { L, LdPhone, SCREEN, TxList, type Fig } from './loading-screens';
import { CategorySheet, Legend, Pin, SheetOn, Shot, overlayKit, tileRowHeight } from './overlay-screens';

const fog = () => L().fog;
const Pair = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={`flex w-full flex-col gap-4 ${wide ? 'max-w-[900px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const Fog = (p: Omit<ScrollFogViewProps, 'look'>) => <ScrollFogView look={fog()} {...p} />;
const pin = (n: string, style: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ zIndex: 6, ...style }}>
    <Pin n={n} />
  </span>
);
// 깊이 표시 — 흐린 자리에 분홍 테두리 + 수(마스크 밖에 겹친다)
function Depth({ style, label, below = false }: { style: CSSProperties; label: string; below?: boolean }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ boxShadow: `inset 0 0 0 1px ${MARK_LINE}`, zIndex: 4, ...style }}>
      <span className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ right: 4, ...(below ? { bottom: 3 } : { top: 3 }), background: MARK_LINE }}>
        {label}
      </span>
    </span>
  );
}

// ── 화면 조각 ─────────────────────────────────────────────
// 칩 필터 줄 — 멈춘 그림(offset 만큼 민 자리 · at="end" 면 끝까지). 회색 바탕 위에서는 Outline 칩(Solid 의 옅은 바탕은 흰 면 위에서만 보인다)
function ChipRow({ mode = 'auto', offset = 0, at = 'start', fogOn = true, onBasement = false, picked = '전체' }: { mode?: Mode; offset?: number; at?: 'start' | 'end'; fogOn?: boolean; onBasement?: boolean; picked?: string }) {
  const lk = chipLook();
  const r = lk.scrollRow;
  return (
    <Fog use="row" live={false} offset={offset} at={at} fog={fogOn} style={{ paddingTop: r.padY, paddingBottom: r.padY, marginTop: r.marginY, marginBottom: r.marginY }} innerStyle={{ columnGap: lk.group.gap }}>
      {FILTER_CHIPS.map((t) => (
        <ChipView key={t} look={lk} mode={mode} variant={onBasement ? 'outlineStrong' : 'solid'} label={t} selected={t === picked} state="enabled" />
      ))}
    </Fog>
  );
}
// 카테고리 목록 — 시트 본문(overlayBody) 멈춘 그림
function CategoryBody({ mode = 'auto', h, offset = 0, at = 'start', fogOn = true, pad = true }: { mode?: Mode; h: number; offset?: number; at?: 'start' | 'end'; fogOn?: boolean; pad?: boolean }) {
  return (
    <Fog use="overlayBody" live={false} offset={offset} at={at} fog={fogOn} pad={pad} style={{ height: h }}>
      <ListView look={listLook()} rows={CATEGORY} mode={mode} live={false} ariaLabel="카테고리" />
    </Fog>
  );
}
// 시트(그림) — 위 두 모서리 둥근 떠 있는 면 · 제목
function SheetBox({ mode = 'auto', title, children, w = 300 }: { mode?: Mode; title: string; children: ReactNode; w?: number }) {
  const s = overlayKit().ov.sheet;
  return (
    <div className="relative overflow-hidden" style={{ width: w, borderRadius: `${s.radius}px ${s.radius}px 0 0`, background: rc('bg-layer-floating', mode) }}>
      <div style={{ padding: `${s.header.padTop}px ${s.header.padX}px ${s.header.padBottom}px`, fontSize: s.title.fontSize, lineHeight: s.title.lineHeight, fontWeight: s.title.fontWeight, color: rc('fg-neutral', mode) }}>{title}</div>
      {children}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => {
  const s = overlayKit().ov.sheet;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex items-start gap-4">
            <LdPhone mode={mode} title="가계부" scale={0.56} bg="bg-layer-default">
              <div className="flex flex-col gap-2 pt-1">
                <ChipRow mode={mode} offset={36} />
                <TxList mode={mode} n={5} />
              </div>
            </LdPhone>
            <LdPhone
              mode={mode}
              title="가계부"
              scale={0.56}
              bg="bg-layer-default"
              overlay={
                <SheetOn mode={mode}>
                  <CategorySheet mode={mode} maxHeight={`${s.maxHeight * 100}%`} offset={tileRowHeight() * 1.1} />
                </SheetOn>
              }
            >
              <TxList mode={mode} n={6} />
            </LdPhone>
          </div>
        ))}
      </div>
    </Figure>
  );
};

const Playground: Fig = () => <ScrollFogPlayground kit={L()} screen={SCREEN()} chip={chipLook()} list={listLook()} cta={buttonLook({ variant: 'neutralSolid', size: 'large' })} />;

// ── Anatomy ───────────────────────────────────────────────
// 시트 본문(overlayBody) — 처음(위 흐림은 빈 여백 위) · 끝(아래 흐림은 빈 여백 위)
const BODY_H = 300;
const Anatomy: Fig = ({ caption }) => {
  const u = fog().uses.overlayBody;
  // 핀이 상자 밖(왼쪽 · 오른쪽)에 붙으므로 둘레를 비워 둔다 — Shot 의 가로 스크롤 칸이 자르지 않게
  const box = (at: 'start' | 'end', withPins: boolean) => (
    <div style={{ padding: '14px 26px 4px 20px' }}>
    <div className="relative" style={{ width: 230 }}>
      <div style={{ borderRadius: 16, background: rc('bg-layer-floating'), outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }}>
        <CategoryBody h={BODY_H} at={at} />
      </div>
      <Depth style={{ left: 0, right: 0, top: 0, height: u.sides.top }} label={`흐림 ${u.sides.top}`} />
      <Depth style={{ left: 0, right: 0, bottom: 0, height: u.sides.bottom }} label={`흐림 ${u.sides.bottom}`} below />
      {at === 'start' && <span aria-hidden className="absolute" style={{ left: 0, width: 6, top: 0, height: u.pad.top, background: MARK, zIndex: 5 }} />}
      {at === 'end' && <span aria-hidden className="absolute" style={{ left: 0, width: 6, bottom: 0, height: u.pad.bottom, background: MARK, zIndex: 5 }} />}
      {withPins && (
        <>
          {pin('ⓐ', { left: -16, top: BODY_H / 2 - 10 })}
          {pin('ⓑ', { right: -26, top: BODY_H - (u.sides.bottom ?? 0) / 2 - 10 })}
          {pin('ⓒ', { left: -16, top: -4 })}
        </>
      )}
    </div>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-start justify-center gap-6">
          <Shot strong="처음" cap={`위 여백 ${u.pad.top} — 흐림 ${u.sides.top} 은 빈 여백 위`}>
            {box('start', true)}
          </Shot>
          <Shot strong="끝까지 스크롤" cap={`아래 여백 ${u.pad.bottom} — 흐림 ${u.sides.bottom} 은 빈 여백 위`}>
            {box('end', false)}
          </Shot>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Scroll Area — 마스크를 거는 스크롤 상자'],
            ['ⓑ', 'Fog — 가장자리에서 깊이만큼 투명 → 불투명'],
            ['ⓒ', 'Padding — 흐린 쪽에 깊이 이상'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 마스크 — 같은 흐림이 흰 면 · 회색 바탕 · 다크에서 / 색 막(바탕색 그라디언트)은 바탕이 바뀌면 띠가 보인다
const Mask: Fig = ({ caption }) => {
  const r = fog().uses.row;
  const cell = (label: string, bg: string, mode: Mode, onBasement = false) => (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[180px] overflow-hidden rounded-2xl py-4" style={{ background: bg }}>
        <ChipRow mode={mode} offset={44} onBasement={onBasement} />
      </div>
      <span className="text-[12px] leading-4 pk-muted">{label}</span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="마스크 — 내용의 투명도만 바꾼다. 바탕색을 덧칠하지 않아 어느 바탕에서도 같은 값이고, 흐린 자리의 칩도 그대로 눌린다" bg="transparent">
          <div className="flex flex-wrap justify-center gap-4">
            {cell('흰 면', rc('bg-layer-default', 'light'), 'light')}
            {cell('회색 바탕', rc('bg-layer-basement', 'light'), 'light', true)}
            {cell('다크', rc('bg-layer-default', 'dark'), 'dark')}
          </div>
        </Verdict>
        <Verdict ok={false} note="색 막 — 흰색 그라디언트를 덮어 흐린다. 바탕이 바뀌면(회색 바탕 · 다크) 흰 띠가 보이고, 막이 칩을 덮어 누르기를 가로챈다" bg="transparent">
          <div className="flex flex-wrap justify-center gap-4">
            {(['흰 면', '회색 바탕', '다크'] as const).map((t, i) => (
              <div key={t} className="flex flex-col items-center gap-2">
                <div className="relative w-[180px] overflow-hidden rounded-2xl py-4" style={{ background: i === 0 ? rc('bg-layer-default', 'light') : i === 1 ? rc('bg-layer-basement', 'light') : rc('bg-layer-default', 'dark') }}>
                  <ChipRow mode={i === 2 ? 'dark' : 'light'} offset={44} onBasement={i === 1} fogOn={false} />
                  <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: r.sides.left, background: `linear-gradient(to right, #FFFFFF, rgba(255,255,255,0))` }} />
                  <span aria-hidden className="absolute inset-y-0 right-0" style={{ width: r.sides.right, background: `linear-gradient(to left, #FFFFFF, rgba(255,255,255,0))` }} />
                </div>
                <span className="text-[12px] leading-4 pk-muted">{t}</span>
              </div>
            ))}
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

// 자리마다 — 칩 줄 좌우 20 · 시트 본문 위 20 아래 80 · 바닥 버튼 화면 · 상자 20
const USE_ORDER: FogUse[] = ['row', 'overlayBody', 'page', 'box'];
const Uses: Fig = ({ caption }) => {
  const spec = loadComponentSpec('scroll-fog');
  if (USE_ORDER.length !== FOG_USES.length) throw new Error('scroll-fog.tsx 의 자리 그림이 use 축과 다르다');
  const u = fog().uses;
  const cta = buttonLook({ variant: 'neutralSolid', size: 'large' });
  const shot: Record<FogUse, ReactNode> = {
    row: (
      <div className="relative w-[280px] overflow-hidden rounded-2xl py-5 pk-surface">
        <ChipRow offset={60} />
        <Depth style={{ left: 0, top: 8, bottom: 8, width: u.row.sides.left }} label={String(u.row.sides.left)} />
        <Depth style={{ right: 0, top: 8, bottom: 8, width: u.row.sides.right }} label={String(u.row.sides.right)} />
      </div>
    ),
    overlayBody: (
      <div className="relative">
        <SheetBox title="카테고리 고르기" w={280}>
          <CategoryBody h={260} offset={tileRowHeight() * 1.5} />
        </SheetBox>
        <Depth style={{ left: 0, right: 0, bottom: 0, height: u.overlayBody.sides.bottom }} label={`아래 ${u.overlayBody.sides.bottom}`} below />
      </div>
    ),
    page: (
      <div className="relative flex flex-col overflow-hidden" style={{ width: 280, height: 360, borderRadius: 24, border: '6px solid var(--p-frame)', background: rc('bg-layer-default') }}>
        <div className="flex h-12 shrink-0 items-center px-6 text-[16px] font-bold pk-text">약관 동의</div>
        <div className="relative min-h-0 flex-1">
          <Fog use="page" live={false} offset={60} style={{ position: 'absolute', inset: 0 }} innerStyle={{ paddingLeft: 24, paddingRight: 24 }}>
            {TERMS.map((t) => (
              <p key={t} style={{ margin: '0 0 12px', fontSize: 14, lineHeight: '22px', color: rc('fg-neutral-muted') }}>
                {t}
              </p>
            ))}
          </Fog>
          <Depth style={{ left: 0, right: 0, top: 0, height: u.page.sides.top }} label={`위 ${u.page.sides.top}`} />
          <Depth style={{ left: 0, right: 0, bottom: 0, height: u.page.sides.bottom }} label={`아래 ${u.page.sides.bottom}`} below />
        </div>
        <div className="shrink-0 px-5 pb-5 pt-2">
          <ButtonView look={cta} label="동의하기" fill state="enabled" />
        </div>
      </div>
    ),
    box: (
      <div className="relative w-[280px] rounded-2xl px-5 pk-surface">
        <Fog use="box" live={false} offset={40} style={{ height: 200 }}>
          {TERMS.map((t) => (
            <p key={t} style={{ margin: '0 0 12px', fontSize: 14, lineHeight: '22px', color: rc('fg-neutral-muted') }}>
              {t}
            </p>
          ))}
        </Fog>
        <Depth style={{ left: 0, right: 0, top: 0, height: u.box.sides.top }} label={String(u.box.sides.top)} />
        <Depth style={{ left: 0, right: 0, bottom: 0, height: u.box.sides.bottom }} label={String(u.box.sides.bottom)} below />
      </div>
    ),
  };
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-[280px_280px]">
        {USE_ORDER.map((use) => (
          <Shot key={use} strong={`${use}${use === fog().defaultUse ? '(기본)' : ''}`} cap={axisDesc(spec, 'use', use)}>
            {shot[use]}
          </Shot>
        ))}
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 늘 켜 둔다 — 처음 · 가운데 · 끝 / 넘친 쪽만
const AlwaysGuide: Fig = ({ caption }) => {
  const frame = (child: ReactNode, label: string) => (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-[176px] overflow-hidden rounded-xl py-3 pk-surface">{child}</div>
      <span className="text-[11px] pk-muted">{label}</span>
    </div>
  );
  const r = fog().uses.row;
  // 넘친 쪽만 — 같은 마스크를 넘친 쪽에만(스크롤 위치를 재서 켜고 끈다)
  const onlyOver = (side: 'left' | 'right' | 'both', offset: number, at: 'start' | 'end') => (
    <div style={fogMaskStyle(fog().mask, { left: side !== 'right' ? r.sides.left : 0, right: side !== 'left' ? r.sides.right : 0 })}>
      <ChipRow offset={offset} at={at} fogOn={false} />
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="처음 · 가운데 · 끝 어디서나 그대로 — 처음 · 끝에서는 흐림이 빈 여백(24) 위에 놓여 칩이 흐려지지 않는다" bg={BASEMENT}>
          <div className="flex flex-wrap justify-center gap-3">
            {frame(<ChipRow />, '처음')}
            {frame(<ChipRow offset={100} />, '가운데')}
            {frame(<ChipRow at="end" />, '끝')}
          </div>
        </Verdict>
        <Verdict ok={false} note="넘친 쪽만 흐린다 — 스크롤을 시작하고 멈출 때마다 흐림이 나타났다 사라져 화면이 깜빡인다" bg={BASEMENT}>
          <div className="flex flex-wrap justify-center gap-3">
            {frame(onlyOver('right', 0, 'start'), '처음 — 오른쪽만')}
            {frame(onlyOver('both', 100, 'start'), '가운데 — 양쪽')}
            {frame(onlyOver('left', 0, 'end'), '끝 — 왼쪽만')}
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

// 깊이만큼 여백 — 아래 여백 80 · 여백 없이 흐림에 덮인 마지막 줄
const PaddingGuide: Fig = ({ caption }) => {
  const u = fog().uses.overlayBody;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`끝까지 내리면 아래 흐림 ${u.sides.bottom} 은 빈 여백(${u.pad.bottom}) 위 — 마지막 줄 "주거" 가 다 보인다`} bg={BASEMENT}>
          <div className="relative">
            <SheetBox title="카테고리 고르기" w={280}>
              <CategoryBody h={300} at="end" />
            </SheetBox>
            <Depth style={{ left: 0, right: 0, bottom: 0, height: u.sides.bottom }} label={`여백 ${u.pad.bottom}`} below />
          </div>
        </Verdict>
        <Verdict ok={false} note="여백 없이 흐린다 — 끝까지 내려도 마지막 줄이 흐림 아래 남아 옅게 보이고, 키보드로 옮긴 줄도 흐림 아래 멈춘다" bg={BASEMENT}>
          <SheetBox title="카테고리 고르기" w={280}>
            <CategoryBody h={300} at="end" pad={false} />
          </SheetBox>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 어디에 거나 — 칩 줄 · 긴 시트 본문 / 짧은 폼 · 탭 바 위 목록
const WhereGuide: Fig = ({ caption }) => {
  const u = fog().uses.overlayBody;
  const save = buttonLook({ variant: 'neutralSolid', size: 'large' });
  const field = (label: string, value: string) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] font-medium pk-text">{label}</span>
      <span className="flex h-12 items-center rounded-lg px-4 text-[16px] pk-text" style={{ boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak')}` }}>
        {value}
      </span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="넘칠 수 있는 영역 — 가로로 넘기는 칩 줄, 데이터에 따라 길어지는 시트 본문(목록)" bg={BASEMENT}>
          <div className="flex flex-wrap items-start justify-center gap-4">
            <div className="w-[260px] overflow-hidden rounded-2xl py-4 pk-surface">
              <ChipRow offset={60} />
            </div>
            <SheetBox title="카테고리 고르기" w={260}>
              <CategoryBody h={220} offset={tileRowHeight()} />
            </SheetBox>
          </div>
        </Verdict>
        <Pair>
          <Verdict ok={false} note={`칸 두셋뿐인 시트 본문 — 스크롤이 생기지 않는데 아래 ${u.pad.bottom} 이 빈자리만 늘린다`} bg={BASEMENT}>
            <SheetBox title="메모 이름 바꾸기" w={260}>
              <Fog use="overlayBody" live={false} innerStyle={{ paddingLeft: 24, paddingRight: 24 }}>
                {field('이름', '장보기 목록')}
              </Fog>
              <div className="px-6 pb-5">
                <ButtonView look={save} label="저장" fill state="enabled" />
              </div>
            </SheetBox>
          </Verdict>
          <Verdict ok={false} note={`탭 바 위의 목록 화면 — 화면 끝이 곧 영역의 끝이라 탭 바 위 ${u.sides.bottom} 이 늘 흐려진다`} bg={BASEMENT}>
            <LdPhone title="가계부" scale={0.52} bg="bg-layer-default">
              <Fog use="page" live={false} style={{ flex: 1, minHeight: 0 }}>
                <TxList n={7} />
              </Fog>
            </LdPhone>
          </Verdict>
        </Pair>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExSheet: Fig = () => <FogSheetDemo kit={overlayKit()} list={listLook()} trigger={buttonLook({ variant: 'neutralWeak', size: 'medium' })} />;
const ExRow: Fig = () => <FogRowDemo kit={L()} chip={chipLook()} screen={SCREEN()} />;

export const scrollFogFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  mask: Mask,
  uses: Uses,
  'always-guide': AlwaysGuide,
  'padding-guide': PaddingGuide,
  'where-guide': WhereGuide,
  'ex-sheet': ExSheet,
  'ex-row': ExRow,
};

