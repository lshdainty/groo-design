// Skeleton 페이지의 그림 — specs/components/skeleton.md 의 `[그림: …](../../site/components/specs/skeleton.tsx#<id>)` 자리.
// 면 · 띠 · 모서리 · 글 자리 높이 · 시간표는 skeleton.yaml 을 푼 값(loadingKit().skeleton)으로, 목록 줄은 list.yaml, 결과는 result-section.yaml,
// 스낵바는 snackbar.yaml, 버튼은 button.yaml, 원은 progress-circle.yaml 로 그린다. 화면 틀(폰 · 카드 제목)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { axisDesc, loadComponentSpec, resolveState } from '@/lib/component-spec';
import { contrast } from '@/lib/design-tokens';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { listLook } from './list-look';
import { ButtonView } from './button-view';
import { resultSectionLook, snackbarLook } from './feedback-look';
import { ResultSectionView, SnackbarView } from './feedback-view';
import { Verdict, rc, type Mode } from './kit';
import { ChipGroupView, ChipView } from './chip-view';
import { chipLook } from './chip-look';
import { SK_RADII, type SkRadius, type SkText } from './loading-look';
import { imageFrameLook, imageFrameRadius } from './image-look';
import { SkeletonListDemo, SkeletonPeriodDemo } from './loading-demos';
import { SkeletonPlayground } from './loading-playground';
import { Bone, CardBox, Circle, L, LdPhone, MonthNav, SCREEN, SK_ROW, SlowText, SpendHead, StatRows, TimelineBar, TxList, TxSkeletonRows, cardStack, keepMark, ldCard, rowDims, type Fig } from './loading-screens';
import { Band, Legend, Note, Pin, Shot } from './overlay-screens';

const sk = () => L().skeleton;
const px = (v: string) => parseFloat(v);
const Pair = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={`flex w-full flex-col gap-4 ${wide ? 'max-w-[900px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
// 핀 — 부위의 왼쪽 위 바깥(absolute)
const pin = (n: string, style: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ zIndex: 6, ...style }}>
    <Pin n={n} />
  </span>
);

// ── 화면 예시 ─────────────────────────────────────────────
// 가계부 — 요약 머리 · 최근 거래(틀은 그리고 데이터 자리만)
function LedgerLoading({ mode, still }: { mode: Mode; still?: boolean }) {
  return (
    <div style={cardStack()}>
      <CardBox mode={mode}>
        <SpendHead mode={mode} still={still} />
      </CardBox>
      <CardBox mode={mode} title="최근 거래">
        <TxSkeletonRows n={4} mode={mode} still={still} />
      </CardBox>
    </div>
  );
}
// 카드 혜택 — 카드 그림 · 이름, 혜택 줄(썸네일). 그림 자리는 Image Frame 의 모서리(폭으로 — 112 → 8 · 40 → 6), 카드 면만 16
const CARD_W = 112;
function BenefitLoading({ mode }: { mode: Mode }) {
  const d = rowDims();
  const f = imageFrameLook();
  return (
    <div style={cardStack()}>
      <CardBox mode={mode}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Bone mode={mode} radius={imageFrameRadius(CARD_W, f.bands)} width={CARD_W} height={CARD_W / f.ratios.card.value} />
          <span className="flex flex-col" style={{ gap: d.bodyGap }}>
            <Bone mode={mode} text="t5" width={120} />
            <Bone mode={mode} text="t3" width={88} />
          </span>
        </div>
      </CardBox>
      <CardBox mode={mode} title="받을 수 있는 혜택">
        <TxSkeletonRows n={3} mode={mode} avatar={imageFrameRadius(SK_ROW.avatar, imageFrameLook().bands)} amount={false} widths={{ ...SK_ROW, title: 150, detail: 110 }} />
      </CardBox>
    </div>
  );
}
// 거래 상세 — 화면 폭 영수증 사진(0) · 제목 · 항목(이름은 틀)
function DetailLoading({ mode }: { mode: Mode }) {
  const keys = ['금액', '카테고리', '결제 수단', '날짜'];
  return (
    <div className="flex flex-col" style={{ background: rc('bg-layer-default', mode) }}>
      <Bone mode={mode} radius="0" width="100%" height={Math.round((344 * 3) / 4)} />
      <div style={{ padding: '20px 24px 0' }}>
        <Bone mode={mode} text="t7" width={170} />
      </div>
      <div style={{ padding: '8px 0' }}>
        {keys.map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
            <span style={{ fontSize: 14, lineHeight: '19px', color: rc('fg-neutral-subtle', mode) }}>{k}</span>
            <Bone mode={mode} text="t4" width={k === '날짜' ? 132 : 96} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LdPhone mode={mode} title="가계부" scale={0.52}>
            <LedgerLoading mode={mode} />
          </LdPhone>
          <LdPhone mode={mode} title="카드 혜택" back tabs={false} scale={0.52}>
            <BenefitLoading mode={mode} />
          </LdPhone>
          <LdPhone mode={mode} title="거래 상세" back tabs={false} scale={0.52} bg="bg-layer-default">
            <DetailLoading mode={mode} />
          </LdPhone>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <SkeletonPlayground kit={L()} screen={SCREEN()} result={resultSectionLook()} />;

// ── Anatomy ───────────────────────────────────────────────
// 최근 거래 카드 — 기다리는 영역(ⓐ) 안에 5초가 지나 오래 걸림 글(ⓓ)이 더해졌다. 띠(ⓒ)는 지나가는 한 순간에 멈춰 그렸다
const ANATOMY_BAND = -14;
const Anatomy: Fig = ({ caption }) => {
  const s = sk();
  const d = rowDims();
  const t4 = s.slowText;
  // 글 아래 → 첫 스켈레톤 위 = slowText.gap(줄의 위 여백만큼 덜 띄운다)
  const spacer = s.slowText.gap - d.padY;
  const cd = ldCard();
  const textTop = cd.borderW + cd.head.top + px(cd.title.lineHeight) + cd.head.bottom;
  const firstRowTop = textTop + px(t4.lineHeight) + spacer;
  const titleLeft = d.padX + SK_ROW.avatar + d.prefixGap;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative" style={{ width: 360 }}>
          <CardBox title="최근 거래" style={{ position: 'relative', overflow: 'visible', outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 }}>
            <div style={{ paddingLeft: sk().slowText.padXList, paddingRight: sk().slowText.padXList, marginBottom: spacer }}>
              <SlowText style={{ width: 'fit-content', outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 }} />
            </div>
            <TxSkeletonRows n={3} band={ANATOMY_BAND} marks={{ '0:title': { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 } }} />
          </CardBox>
          {pin('ⓐ', { left: -14, top: -14 })}
          {pin('ⓓ', { left: d.padX - 26, top: textTop - 1 })}
          {pin('ⓑ', { left: titleLeft + SK_ROW.title + 8, top: firstRowTop + d.padY + 1 })}
          {pin('ⓒ', { left: titleLeft + SK_ROW.title * (0.5 + ANATOMY_BAND / 100) - 10, top: firstRowTop + d.padY + d.titleLh / 2 - 10 })}
        </div>
        <Legend
          items={[
            ['ⓐ', 'Region — 기다리는 영역(쿼리 하나)'],
            ['ⓑ', 'Root — 면'],
            ['ⓒ', 'Shimmer — 면 위를 지나는 띠'],
            ['ⓓ', 'Slow Text — 5초부터 한 줄'],
          ]}
        />
        <Note>
          면 {sk().bg.name ?? ''} · 띠는 면과 같은 크기로 왼쪽 밖({s.motion.shimmer.from}%)에서 오른쪽 밖({s.motion.shimmer.to}%)으로 지나간다 — 그림은 지나가는 한 순간이다. 스켈레톤은 보조 기술에 숨기고(aria-hidden), 영역은 aria-busy · 화면의 상태 글 하나가 알린다
        </Note>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 모서리 — 값 · 토큰 · 쓰는 곳은 skeleton.yaml 의 radius 축. 그림 자리(썸네일 24 · 40 · 카드 그림 112)는 Image Frame 이 폭으로 고른 모서리와 같아야 한다
const PIC_W = { r4: 24, r6: 40, r8: 112 };
const Radius: Fig = ({ caption }) => {
  const spec = loadComponentSpec('skeleton');
  const f = imageFrameLook();
  const token = (r: SkRadius) => {
    const raw = resolveState(spec, { radius: r }, 'enabled')['root.radius'];
    const v = String(raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
    return v.startsWith('$') ? v.slice(1) : v;
  };
  // 그림 자리 — 그 폭의 Image Frame 모서리가 스켈레톤 값과 같은지(바뀌면 그림을 고친다)
  const pic = (w: number, want: SkRadius) => {
    const got = imageFrameRadius(w, f.bands);
    if (got !== want || f.radius[got].px !== sk().radius[want]) throw new Error(`skeleton.tsx — 폭 ${w} 그림 자리의 Image Frame 모서리(${got})가 스켈레톤 ${want} 과 다르다`);
    return want;
  };
  const cells: { r: SkRadius; what: string; shape: ReactNode }[] = [
    { r: '8', what: '글 · 숫자', shape: <Bone text="t4" width={120} /> },
    { r: pic(PIC_W.r4, '4'), what: `그림 ${PIC_W.r4}`, shape: <Bone radius="4" width={PIC_W.r4} height={PIC_W.r4} /> },
    { r: pic(PIC_W.r6, '6'), what: `그림 ${PIC_W.r6}`, shape: <Bone radius="6" width={PIC_W.r6} height={PIC_W.r6} /> },
    { r: pic(PIC_W.r8, '8'), what: `카드 그림 ${PIC_W.r8}`, shape: <Bone radius="8" width={PIC_W.r8} height={PIC_W.r8 / f.ratios.card.value} /> },
    { r: '12', what: '목록 앞 타일 40', shape: <Bone radius="12" width={40} height={40} /> },
    { r: '16', what: '카드 면', shape: <Bone radius="16" width={120} height={96} /> },
    { r: 'full', what: '아바타', shape: <Bone radius="full" width={40} height={40} /> },
    {
      r: '0',
      what: '화면 폭 사진',
      shape: (
        <div className="overflow-hidden" style={{ width: 120, borderRadius: 18, border: '5px solid var(--p-frame)', background: rc('bg-layer-default') }}>
          <Bone radius="0" width="100%" height={82} />
          <div className="flex flex-col gap-1.5 p-3">
            <Bone text="t4" width={70} />
          </div>
        </div>
      ),
    },
  ];
  const seen = new Set(cells.map((c) => c.r));
  if (SK_RADII.some((r) => !seen.has(r))) throw new Error('skeleton.tsx 의 모서리 그림이 radius 축을 모두 그리지 않는다');
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[680px] grid-cols-2 gap-3 md:grid-cols-4">
        {cells.map((c, i) => (
          <div key={i} className="flex min-w-0 flex-col items-center gap-3">
            <div className="flex h-[170px] w-full items-center justify-center overflow-hidden rounded-xl pk-surface">{c.shape}</div>
            <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
              <b className="text-[13px] pk-text">
                {c.r} · {token(c.r)}
                {c.r === sk().defaultRadius && i === 0 ? '(기본)' : ''}
              </b>
              <span className="pk-text">{c.what}</span>
              {axisDesc(spec, 'radius', c.r)}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 글자 자리 = 글줄 높이 — 12 · 14 · 16 · 20 글자(t2 · t4 · t5 · t7) 옆에 같은 높이의 스켈레톤
const TEXT_ROWS: SkText[] = ['t2', 't4', 't5', 't7'];
const TextHeight: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5 rounded-xl px-8 py-7 pk-surface">
      {TEXT_ROWS.map((t) => {
        const v = sk().text[t];
        return (
          <div key={t} className="flex items-center gap-6">
            <code className="w-[92px] shrink-0 text-[12px] pk-muted">
              {t} · {v.size} / {v.lineHeight}
            </code>
            <span className="relative shrink-0" style={{ width: 170, fontSize: v.size, lineHeight: `${v.lineHeight}px`, color: rc('fg-neutral'), outline: `1px dashed ${MARK_LINE}`, outlineOffset: 0, fontVariantNumeric: 'tabular-nums' }}>
              점심 식사 12,000원
            </span>
            <span className="relative shrink-0">
              <Bone text={t} width={150} />
              <span aria-hidden className="absolute flex items-center" style={{ left: '100%', top: 0, bottom: 0, marginLeft: 6, borderLeft: `2px solid ${MARK_LINE}`, paddingLeft: 4 }}>
                <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                  {v.lineHeight}
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  </Figure>
);

// 반짝임 — 라이트 · 다크에서 지나가는 띠 · 모션 줄이기면 면만, 아래는 한 번 지나가는 동안의 자리
const FRAMES = [0, 0.25, 0.5, 0.75, 1];
const Shimmer: Fig = ({ caption }) => {
  const m = sk().motion.shimmer;
  const card = (mode: Mode, still: boolean, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <CardBox mode={mode} body="list" style={{ width: 186 }}>
        <TxSkeletonRows n={2} mode={mode} still={still} amount={false} widths={{ ...SK_ROW, title: 72, detail: 48 }} />
      </CardBox>
      <span className="text-[12px] leading-4 pk-muted">{label}</span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {card('light', false, '라이트 — 띠가 지나간다')}
          {card('dark', false, '다크 — 흰 띠가 훨씬 옅다')}
          {card('light', true, '모션 줄이기 — 띠가 멈추고 면만')}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-3">
            {FRAMES.map((f) => (
              <div key={f} className="flex flex-col items-center gap-1.5">
                <div className="rounded-lg p-2.5 pk-surface">
                  <Bone text="t5" width={80} band={m.from + (m.to - m.from) * f} />
                </div>
                <span className="text-[11px] tabular-nums pk-muted">{String(Math.round(m.from + (m.to - m.from) * f)).replace('-', '−')}%</span>
              </div>
            ))}
          </div>
          <Note>
            띠는 면과 같은 폭으로 translateX {String(m.from).replace('-', '−')}% → {m.to}% — {m.ms / 1000}초 · {m.easing}, 쉬는 틈 없이 되풀이한다. 같은 화면의 스켈레톤은 한 박자로 지난다
          </Note>
        </div>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 틀은 먼저 — 탭 · 제목 · 필터 · 버튼은 그리고 데이터 자리만
function FilterChips({ mode = 'auto', bones = false }: { mode?: Mode; bones?: boolean }) {
  const lk = chipLook();
  if (bones)
    return (
      <div className="flex gap-2 px-6 py-1">
        {[56, 52, 52, 60].map((w, i) => (
          <Bone key={i} mode={mode} radius="full" width={w} height={lk.sizes.small.h} />
        ))}
      </div>
    );
  return (
    <ChipGroupView look={lk} mode={mode} layout="scroll" bleed={false} ariaLabel="거래 거르기">
      {['전체', '지출', '수입', '이체'].map((t, i) => (
        <ChipView key={t} look={lk} mode={mode} size="small" variant="solid" selected={i === 0} label={t} state="enabled" />
      ))}
    </ChipGroupView>
  );
}
const FrameGuide: Fig = ({ caption }) => {
  const add = buttonLook({ variant: 'neutralWeak', size: 'xsmall' });
  const section = (children: ReactNode) => <div style={{ padding: '16px 24px 4px', fontSize: 17, lineHeight: '24px', fontWeight: 700, color: rc('fg-neutral') }}>{children}</div>;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="화면 제목 · 필터 · 섹션 제목 · 버튼 · 탭 바는 처음부터 그리고, 서버에서 올 거래 자리만 스켈레톤" bg={BASEMENT}>
          <LdPhone title="가계부" scale={0.6} bg="bg-layer-default" right={<ButtonView look={add} label="추가" state="enabled" />}>
            <div className="flex flex-col pt-1">
              <FilterChips />
              {section('최근 거래')}
              <TxSkeletonRows n={4} />
            </div>
          </LdPhone>
        </Verdict>
        <Verdict ok={false} note="제목 · 필터 · 버튼까지 회색으로 — 바로 보일 틀을 가리고, 데이터가 오는 순간 틀이 바뀌며 화면이 튄다" bg={BASEMENT}>
          <LdPhone scale={0.6} bg="bg-layer-default">
            <div className="flex h-12 shrink-0 items-center justify-between px-4">
              <Bone text="t6" width={64} />
              <Bone radius="full" width={52} height={add.faces.light.enabled.height} />
            </div>
            <div className="flex flex-col pt-1">
              <FilterChips bones />
              {section(<Bone text="t6" width={80} />)}
              <TxSkeletonRows n={4} />
            </div>
          </LdPhone>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 흰 면 위에만 — 대비는 토큰 값으로 잰다
const SurfaceGuide: Fig = ({ caption }) => {
  const s = sk();
  const on = (bg: 'default' | 'basement', mode: 'light' | 'dark') => contrast(mode === 'dark' ? s.bg.dark : s.bg.light, mode === 'dark' ? s.surfaces[bg].dark : s.surfaces[bg].light).toFixed(2);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`흰 면(카드 · 시트 · 대화상자) 위 — 면과 ${on('default', 'light')}:1(다크 ${on('default', 'dark')}:1), 띠가 지나가며 모양이 드러난다`} bg={BASEMENT}>
          <CardBox body="list" style={{ width: 300 }}>
            <TxSkeletonRows n={3} widths={{ ...SK_ROW, title: 110, detail: 70 }} />
          </CardBox>
        </Verdict>
        <Verdict ok={false} note={`회색 페이지 바탕 위에 바로 — 바탕과 ${on('basement', 'light')}:1, 같은 색이라 사라진다. 카드 면을 먼저 그린다`} bg={BASEMENT}>
          <div className="relative w-[300px]" style={{ paddingBottom: 4, outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 }}>
            <TxSkeletonRows n={3} widths={{ ...SK_ROW, title: 110, detail: 70 }} />
            <span className="absolute right-2 top-2 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
              스켈레톤 세 줄이 여기 있다
            </span>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 모양은 내용대로 — 실제 줄과 같은 높이 · 글자보다 낮은 막대(옛 스켈레톤 — 모서리 4 · 막대 14 · 12)
const OLD = { r: 4, avatar: 36, title: 14, detail: 12, gap: 8 };
const ShapeGuide: Fig = ({ caption }) => {
  const d = rowDims();
  const oldRow = d.padY * 2 + Math.max(OLD.avatar, OLD.title + OLD.gap + OLD.detail);
  const shift = d.height - oldRow;
  const low = (
    <div aria-hidden style={{ display: 'flex', alignItems: 'center', padding: `${d.padY}px ${d.padX}px` }}>
      <span style={{ paddingRight: d.prefixGap, display: 'flex' }}>
        <span style={{ width: OLD.avatar, height: OLD.avatar, borderRadius: OLD.r, background: rc('bg-neutral-weak') }} />
      </span>
      <span style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: OLD.gap }}>
        <span style={{ width: 120, height: OLD.title, borderRadius: OLD.r, background: rc('bg-neutral-weak') }} />
        <span style={{ width: 80, height: OLD.detail, borderRadius: OLD.r, background: rc('bg-neutral-weak') }} />
      </span>
      <span style={{ width: 64, height: OLD.title, borderRadius: OLD.r, background: rc('bg-neutral-weak') }} />
    </div>
  );
  const pair = (top: ReactNode, h: number) => (
    <div className="flex items-start gap-3">
      <CardBox body="list" style={{ width: 300 }}>
        <div className="relative">
          {top}
          <Band style={{ right: -2, top: 0, height: h, width: 4 }} label={`${h}`} vertical />
        </div>
        <div style={{ borderTop: `1px dashed ${MARK_LINE}` }}>
          <TxList n={1} />
        </div>
      </CardBox>
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`줄 높이 ${d.height} 그대로 — 글 자리는 그 글자의 줄 높이(제목 ${d.titleLh} · 메타 ${d.detailLh}), 앞 원은 full. 데이터가 와도 아무것도 밀리지 않는다`} bg={BASEMENT}>
          {pair(<TxSkeletonRows n={1} widths={{ ...SK_ROW, title: 110, detail: 70 }} />, d.height)}
        </Verdict>
        <Verdict ok={false} note={`글자보다 낮은 막대 — 줄이 ${oldRow} 라 데이터가 오면 줄마다 ${shift} 씩, 네 줄이면 ${shift * 4} 밀린다`} bg={BASEMENT}>
          {pair(low, oldRow)}
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 한 자리에 하나 — 스켈레톤 위에 원을 얹지 않는다
const MixGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="구조가 보이는 자리는 스켈레톤 하나" bg={BASEMENT}>
        <div className="w-[300px]">
          <CardBox title="최근 거래">
            <TxSkeletonRows n={3} widths={{ ...SK_ROW, title: 110, detail: 70 }} />
          </CardBox>
        </div>
      </Verdict>
      <Verdict ok={false} note="스켈레톤 위에 원을 얹는다 — 두 가지가 같은 기다림을 겹쳐 말한다" bg={BASEMENT}>
        <div className="relative w-[300px]">
          <CardBox title="최근 거래">
            <TxSkeletonRows n={3} widths={{ ...SK_ROW, title: 110, detail: 70 }} />
          </CardBox>
          <div className="absolute inset-0 grid place-items-center" style={{ paddingTop: 24 }}>
            <Circle size="40" decorative />
          </div>
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 기다리는 동안 ─────────────────────────────────────────
// 시간표 — 같은 카드가 0 ~ 1초 · 1초 · 5초 · 10초에
function RecentCard({ mode = 'auto', phase }: { mode?: Mode; phase: 'quiet' | 'waiting' | 'slow' | 'failed' }) {
  const d = rowDims();
  const r = resultSectionLook();
  const spacer = sk().slowText.gap - d.padY;
  return (
    <CardBox mode={mode} title="최근 거래" style={{ width: 270, minHeight: 296 }}>
      {phase === 'failed' ? (
        // 카드 안 결과 — 좌우는 목록 카드의 24 만(결과 자리의 좌우 0)
        <div style={{ paddingTop: 24, paddingRight: sk().slowText.padXList, paddingBottom: 16, paddingLeft: sk().slowText.padXList }}>
          <ResultSectionView look={r} mode={mode} kind="failure" size="medium" inCard title="거래를 불러오지 못했어요" description="잠시 후 다시 시도해주세요." primary={{ label: '다시 시도' }} />
        </div>
      ) : (
        <>
          {phase === 'slow' && (
            <div style={{ paddingLeft: sk().slowText.padXList, paddingRight: sk().slowText.padXList, marginBottom: spacer }}>
              <SlowText mode={mode} />
            </div>
          )}
          <div style={phase === 'quiet' ? keepMark : undefined}>
            <TxSkeletonRows n={3} mode={mode} hidden={phase === 'quiet'} widths={{ ...SK_ROW, title: 88, detail: 60, amount: 48 }} />
          </div>
        </>
      )}
    </CardBox>
  );
}
const Timeline: Fig = ({ caption }) => {
  const r = sk().region;
  const s = (ms: number) => `${ms / 1000}초`;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <TimelineBar width={560} labels={['틀만', '스켈레톤 · 원', '+ 오래 걸림 글', '실패 + 다시 시도']} />
        <div className="grid grid-cols-1 gap-5 rounded-2xl p-4 sm:grid-cols-[270px_270px]" style={{ background: rc('bg-layer-basement') }}>
          <Shot strong={`0 ~ ${s(r.showAfter)}`} cap="틀만 — 데이터 자리는 보이지 않게 그려 높이를 지킨다(점선)">
            <RecentCard phase="quiet" />
          </Shot>
          <Shot strong={`${s(r.showAfter)} ~`} cap='스켈레톤 — 숨은 상태 글 "불러오는 중…"'>
            <RecentCard phase="waiting" />
          </Shot>
          <Shot strong={`${s(r.slowAfter)} ~`} cap="안내 글 한 줄 — 한 번 읽힌다">
            <RecentCard phase="slow" />
          </Shot>
          <Shot strong={s(r.timeout)} cap="요청 제한 — 실패 + 다시 시도(Result Section)">
            <RecentCard phase="failed" />
          </Shot>
        </div>
      </div>
    </Figure>
  );
};

// 오래 걸림 글 — 스켈레톤 위(왼쪽 맞춤) · 원 아래(가운데 맞춤), 사이 gap(분홍 띠)
const SlowGuide: Fig = ({ caption }) => {
  const s = sk();
  const d = rowDims();
  const spacer = s.slowText.gap - d.padY;
  const lh = px(s.slowText.lineHeight);
  const gap = <Band style={{ left: 0, right: 0, top: lh, height: s.slowText.gap }} label={String(s.slowText.gap)} />;
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Shot strong="스켈레톤 영역" cap={`첫 스켈레톤 위 ${s.slowText.gap} · 왼쪽 맞춤`}>
          <CardBox title="최근 거래" style={{ width: 280 }}>
            <div style={{ paddingLeft: sk().slowText.padXList, paddingRight: sk().slowText.padXList, marginBottom: spacer }}>
              <div className="relative">
                <SlowText />
                {gap}
              </div>
            </div>
            <TxSkeletonRows n={2} widths={{ ...SK_ROW, title: 96, detail: 64, amount: 48 }} />
          </CardBox>
        </Shot>
        <Shot strong="가운데 원" cap={`원 아래 ${s.slowText.gap} · 가운데 맞춤`}>
          <CardBox title="검색 결과" style={{ width: 280, minHeight: 220 }}>
            {/* 목록 카드 바로 아래 영역 — 글은 좌우 24 안에(skeleton.yaml slowText.paddingX 비고) */}
            <div className="flex flex-col items-center" style={{ paddingTop: 40, paddingLeft: s.slowText.padXList, paddingRight: s.slowText.padXList }}>
              <div className="relative flex flex-col items-center" style={{ gap: s.slowText.gap }}>
                <Circle size="40" decorative />
                <SlowText align="center" />
                <Band style={{ left: 0, right: 0, top: 40, height: s.slowText.gap }} label={String(s.slowText.gap)} />
              </div>
            </div>
          </CardBox>
        </Shot>
      </div>
    </Figure>
  );
};

// 무엇으로 기다리나 — 첫 진입 · 섹션 새로 고침 · 목록 끝 · 저장
const WhichGuide: Fig = ({ caption }) => {
  const save = buttonLook({ variant: 'neutralSolid', size: 'large' });
  const cell = (strong: string, cap: string, children: ReactNode) => (
    <Shot strong={strong} cap={cap}>
      <div className="w-[290px]">{children}</div>
    </Shot>
  );
  const small = { ...SK_ROW, title: 96, detail: 64, amount: 56 };
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[290px_290px]">
        {cell('첫 진입', '스켈레톤 — 틀은 그리고 데이터 자리만', (
          <CardBox title="최근 거래">
            <TxSkeletonRows n={2} widths={small} />
          </CardBox>
        ))}
        {cell('섹션 새로 고침', '제목 옆 원 24 — 내용은 그대로', (
          <CardBox title="최근 거래" right={<Circle size="24" label="최근 거래 새로 고치는 중" />}>
            <TxList n={2} compact />
          </CardBox>
        ))}
        {cell('목록 끝 더 불러오기', '목록 아래 가운데 원 24', (
          <CardBox title="거래">
            <TxList n={2} compact />
            <div className="flex justify-center py-3">
              <Circle size="24" label="거래 더 불러오는 중" />
            </div>
          </CardBox>
        ))}
        {cell('저장 · 제출', '누른 버튼의 로딩 — 폭은 그대로', (
          <CardBox>
            <div className="flex flex-col gap-3">
              <span className="text-[14px] pk-muted">메모를 저장하는 중이에요.</span>
              <ButtonView look={save} label="저장" fill state="loading" />
            </div>
          </CardBox>
        ))}
      </div>
    </Figure>
  );
};

// 다른 달 — 머리는 바로 9월, 숫자 · 목록 자리만 스켈레톤 · 9월 머리 아래 10월 숫자
const PeriodGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="고른 달 이름은 바로 9월 — 바뀔 숫자 자리만 스켈레톤, 10월 숫자는 지운다" bg={BASEMENT}>
        <LdPhone title="통계" scale={0.6} h={520} tabs={false}>
          <div style={cardStack()}>
            <CardBox body="list">
              <MonthNav month="2026년 9월" />
              <div style={{ paddingTop: 4, paddingRight: 24, paddingBottom: 8, paddingLeft: 24 }}>
                <SpendHead label="지출" bone={144} />
              </div>
              <StatRows amounts={false} />
            </CardBox>
          </div>
        </LdPhone>
      </Verdict>
      <Verdict ok={false} note="9월 머리 아래 10월 숫자 — 새 값이 올 때까지 돈 숫자가 잘못 읽힌다" bg={BASEMENT}>
        <LdPhone title="통계" scale={0.6} h={520} tabs={false}>
          <div style={cardStack()}>
            <CardBox body="list">
              <MonthNav month="2026년 9월" right={<span className="ml-1.5"><Circle size="24" decorative /></span>} />
              <div style={{ paddingTop: 4, paddingRight: 24, paddingBottom: 8, paddingLeft: 24 }}>
                <SpendHead label="지출" amount="656,500원" />
              </div>
              <StatRows />
            </CardBox>
          </div>
        </LdPhone>
      </Verdict>
    </Pair>
  </Panel>
);

// 같은 내용을 다시 받을 때 — 보던 내용 그대로 · 실패는 스낵바 · 스켈레톤으로 돌아간 화면
const RefreshGuide: Fig = ({ caption }) => {
  const sb = snackbarLook();
  const pull = L().pull;
  return (
    <Panel caption={caption}>
      <Pair wide>
        <Verdict ok note={`당겨서 새로 고침 — 원이 돌고 보던 내용은 그대로(${pull.threshold} 아래로 내려와 머문다)`} bg={BASEMENT}>
          <LdPhone title="가계부" scale={0.56} h={560}>
            <div className="relative h-full">
              <div className="absolute inset-x-0 top-0 flex items-center justify-center" style={{ height: pull.indicator }}>
                <Circle size="24" label="새로 고치는 중" />
              </div>
              <div style={{ ...cardStack(), transform: `translateY(${pull.threshold}px)` }}>
                <CardBox title="최근 거래">
                  <TxList n={3} />
                </CardBox>
              </div>
            </div>
          </LdPhone>
        </Verdict>
        <Verdict ok note="실패해도 내용을 둔 채 스낵바로 가볍게 알린다" bg={BASEMENT}>
          <LdPhone title="가계부" scale={0.56} h={560}>
            <div className="relative h-full">
              <div style={cardStack()}>
                <CardBox title="최근 거래">
                  <TxList n={3} />
                </CardBox>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-4">
                <SnackbarView look={sb} tone="critical" message="새로 고치지 못했어요. 잠시 후 다시 당겨주세요." state="enabled" />
              </div>
            </div>
          </LdPhone>
        </Verdict>
        <Verdict ok={false} note="다시 받는다고 스켈레톤으로 돌아간다 — 보던 내용이 사라지고 화면이 깜빡인다" bg={BASEMENT}>
          <LdPhone title="가계부" scale={0.56} h={560}>
            <div style={cardStack()}>
              <CardBox title="최근 거래">
                <TxSkeletonRows n={3} />
              </CardBox>
            </div>
          </LdPhone>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExList: Fig = () => <SkeletonListDemo kit={L()} screen={SCREEN()} result={resultSectionLook()} list={listLook()} />;
// 모양 다섯 — 코드 그대로: w-40(160) · size-10(40, 모서리 6 — 폭 40 의 Image Frame 모서리) · h-28 w-full(112) · size-10 · aspect-[4/3] w-full
const ExShapes: Fig = () => {
  if (imageFrameRadius(40, imageFrameLook().bands) !== '6') throw new Error('skeleton.md 의 썸네일 40 예시(radius="6")가 Image Frame 모서리와 다르다');
  return (
    <Figure>
      <div className="flex w-[320px] flex-col gap-4 rounded-2xl p-6 pk-surface">
        <Bone text="t4" width={160} />
        <Bone radius="6" width={40} height={40} />
        <Bone radius="16" width="100%" height={112} />
        <Bone radius="full" width={40} height={40} />
        <Bone radius="0" width="100%" style={{ aspectRatio: '4 / 3' }} />
      </div>
    </Figure>
  );
};
const ExPeriod: Fig = () => <SkeletonPeriodDemo kit={L()} screen={SCREEN()} />;

export const skeletonFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  radius: Radius,
  'text-height': TextHeight,
  shimmer: Shimmer,
  'frame-guide': FrameGuide,
  'surface-guide': SurfaceGuide,
  'shape-guide': ShapeGuide,
  'mix-guide': MixGuide,
  timeline: Timeline,
  'slow-guide': SlowGuide,
  'which-guide': WhichGuide,
  'period-guide': PeriodGuide,
  'refresh-guide': RefreshGuide,
  'ex-list': ExList,
  'ex-shapes': ExShapes,
  'ex-period': ExPeriod,
};

