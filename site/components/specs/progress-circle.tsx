// Progress Circle 페이지의 그림 — specs/components/progress-circle.md 의 `[그림: …](../../site/components/specs/progress-circle.tsx#<id>)` 자리.
// 원의 크기 · 두께 · 색 · 움직임은 progress-circle.yaml(loadingKit().circle), 당겨서 새로 고침은 pull-to-refresh.yaml(loadingKit().pull),
// 시간표는 skeleton.yaml 의 region, 버튼 안의 원은 button.yaml 로 그린다. 화면 틀(폰 · 카드 제목)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { axisDesc, loadComponentSpec } from '@/lib/component-spec';
import { contrast } from '@/lib/design-tokens';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { resultSectionLook, snackbarLook } from './feedback-look';
import { ResultSectionView } from './feedback-view';
import { Verdict, rc, type Mode } from './kit';
import { listLook } from './list-look';
import { CircleBasicDemo, CircleUploadDemo, PullToRefreshDemo } from './loading-demos';
import { PC_SIZES, PC_TONES, lcv, type PcTone } from './loading-look';
import { ProgressCirclePlayground } from './loading-playground';
import { CardBox, Circle, L, LdPhone, SCREEN, SK_ROW, SlowText, SpendHead, TxList, TxSkeletonRows, cardStack, type Fig } from './loading-screens';
import { Band, Legend, Note, Pin, Shot } from './overlay-screens';
import { PcArc } from './pc-arc';
import { searchLook } from './data-look';
import { TfInputView } from './text-field-view';

const pc = (brand: 'desk' | 'hr' = 'desk') => L(brand).circle;
const Pair = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={`flex w-full flex-col gap-4 ${wide ? 'max-w-[900px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const pin = (n: string, style: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ zIndex: 6, ...style }}>
    <Pin n={n} />
  </span>
);

// ── 화면 조각 ─────────────────────────────────────────────
// 영수증 사진(그림) — 흰 종이 위 글줄
function ReceiptPhoto({ size, tilt = -6 }: { size: number; tilt?: number }) {
  return (
    <span aria-hidden className="block overflow-hidden" style={{ width: size, height: size, borderRadius: 8, background: 'linear-gradient(160deg, #C9B79C 0%, #A58E6F 100%)' }}>
      <span className="mx-auto block" style={{ marginTop: size * 0.12, width: size * 0.62, height: size, background: '#FBFAF6', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: `rotate(${tilt}deg)`, padding: size * 0.08, boxSizing: 'border-box' }}>
        {[0.9, 0.6, 0.75, 0.5, 0.8].map((w, i) => (
          <span key={i} className="block" style={{ height: 3, width: `${w * 100}%`, marginBottom: 4, background: '#B9B4A8', borderRadius: 2 }} />
        ))}
      </span>
    </span>
  );
}
// 올리는 중인 사진 — 딤(overlay-dim) 위 흰 원 24(staticWhite, 값 있는 원)
function Uploading({ mode = 'auto', value, size = 80 }: { mode?: Mode; value: number; size?: number }) {
  return (
    <span className="relative block" style={{ width: size, height: size }}>
      <ReceiptPhoto size={size} />
      <span className="absolute inset-0 grid place-items-center" style={{ borderRadius: 8, background: lcv(SCREEN().dim, mode) }}>
        <Circle mode={mode} size="24" tone="staticWhite" value={value} label="영수증 사진 올리는 중" />
      </span>
    </span>
  );
}
// 검색 화면 — 머리 아래 밑줄형 검색칸(틀). 목록 위 검색은 Input 의 밑줄형이다(searchable-list.yaml 검색칸 · large — 폰)
function SearchBar({ mode = 'auto', value = '점심' }: { mode?: Mode; value?: string }) {
  const s = searchLook();
  return (
    <div style={{ paddingTop: 4, paddingBottom: s.gap, paddingLeft: s.field.marginX, paddingRight: s.field.marginX, background: rc('bg-layer-default', mode) }}>
      <TfInputView look={s.field.look} variant="underline" size="large" mode={mode} state="enabled" value={value} prefixIcon="search" clearable ariaLabel="검색" />
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LdPhone mode={mode} title="홈" scale={0.52}>
            <div style={cardStack()}>
              <CardBox mode={mode}>
                <SpendHead mode={mode} amount="412,300원" />
              </CardBox>
              <CardBox mode={mode} title="최근 거래" right={<Circle mode={mode} size="24" label="최근 거래 새로 고치는 중" />}>
                <TxList mode={mode} n={3} />
              </CardBox>
            </div>
          </LdPhone>
          <LdPhone mode={mode} title="검색" back tabs={false} scale={0.52} bg="bg-layer-default">
            <SearchBar mode={mode} />
            <div className="grid flex-1 place-items-center" style={{ paddingBottom: 60 }}>
              <Circle mode={mode} size="40" label="검색 결과 불러오는 중" />
            </div>
          </LdPhone>
          <LdPhone mode={mode} title="거래 추가" back tabs={false} scale={0.52} bg="bg-layer-default">
            <div className="flex flex-col gap-2 px-6 pt-2">
              <span style={{ fontSize: 14, lineHeight: '19px', fontWeight: 500, color: rc('fg-neutral', mode) }}>영수증 사진</span>
              <div className="flex gap-2">
                <Uploading mode={mode} value={40} />
                <ReceiptPhoto size={80} tilt={4} />
              </div>
            </div>
          </LdPhone>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <ProgressCirclePlayground kits={{ desk: L('desk'), hr: L('hr') }} screens={{ desk: SCREEN('desk'), hr: SCREEN('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
// 40 원을 4배로 — 값 있는 원(40%)이라 트랙 · 호가 함께 보인다. 호는 12시에서 시작해 시계 방향, 끝이 둥글다
const ZOOM = 4;
const Anatomy: Fig = ({ caption }) => {
  const s = pc().sizes['40'];
  const S = s.size * ZOOM;
  const t = s.thickness * ZOOM;
  const face = pc().tones.neutral;
  const r = (S - t) / 2;
  // 호의 끝(40% = 144°) — 12시에서 시계 방향
  const a = ((pc().start + 360 * 0.4) * Math.PI) / 180;
  const end = { x: S / 2 + r * Math.cos(a), y: S / 2 + r * Math.sin(a) };
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative rounded-2xl pk-surface" style={{ padding: 40 }}>
          <div className="relative" style={{ width: S, height: S }}>
            <PcArc size={S} thickness={t} track={lcv(face.track, 'auto')} range={lcv(face.range, 'auto')} ratio={0.4} />
            {/* 12시 — 시작 */}
            <span aria-hidden className="absolute" style={{ left: S / 2 - 1, top: -14, width: 2, height: t + 20, background: MARK_LINE }} />
            {pin('ⓐ', { left: S / 2 - r * Math.cos(Math.PI / 4) - 10 - t / 2 - 6, top: S / 2 + r * Math.sin(Math.PI / 4) - 10 + t / 2 + 6 })}
            {pin('ⓑ', { left: S / 2 + r * Math.cos(-Math.PI / 6) + t / 2 + 6, top: S / 2 + r * Math.sin(-Math.PI / 6) - 10 })}
            <span aria-hidden className="absolute rounded-full" style={{ left: end.x - t / 2 - 3, top: end.y - t / 2 - 3, width: t + 6, height: t + 6, outline: `1px dashed ${MARK_LINE}` }} />
          </div>
          <span className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ left: '50%', top: 10, transform: 'translateX(8px)', background: MARK_LINE }}>
            12시에서 시작
          </span>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Track — 원 전체, 옅은 색'],
            ['ⓑ', 'Range — 진행, 12시에서 시계 방향 · 끝이 둥글다(점선)'],
          ]}
        />
        <Note>40 원을 {ZOOM}배로 그렸다(값 40%). 트랙과 호는 같은 두께 · 같은 반지름의 원이고, 값 없는 원은 이 호가 늘었다 줄며 돈다.</Note>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 24 · 40 — 실제 크기 · 3배, 두께 · 선 가운데 반지름. 버튼 안 원은 Button 이 정한다(button.yaml progressCircle)
const SIZE_ZOOM = 3;
const BTN_SIZES = ['xsmall', 'small', 'medium', 'large'] as const;
const Sizes: Fig = ({ caption }) => {
  const spec = loadComponentSpec('progress-circle');
  const face = pc().tones.neutral;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-end justify-center gap-10 rounded-2xl px-8 py-8 pk-surface">
          {PC_SIZES.map((sz) => {
            const s = pc().sizes[sz];
            const Z = s.size * SIZE_ZOOM;
            const T = s.thickness * SIZE_ZOOM;
            return (
              <div key={sz} className="flex w-[230px] flex-col items-center gap-3">
                <div className="flex items-end gap-6">
                  <Circle size={sz} decorative />
                  <span className="relative block" style={{ width: Z, height: Z }}>
                    <PcArc size={Z} thickness={T} track={lcv(face.track, 'auto')} range={lcv(face.range, 'auto')} ratio={0.75} still />
                    <Band style={{ left: 0, right: 0, bottom: -14, height: 6, background: 'transparent', borderTop: `1px solid ${MARK_LINE}` }} label={String(s.size)} />
                    {/* 두께 — 12시 자리의 선 굵기 */}
                    <span aria-hidden className="absolute" style={{ left: Z / 2 - 1, top: 0, width: 2, height: T, background: MARK_LINE, zIndex: 4 }} />
                    <span aria-hidden className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ left: Z / 2 + 6, top: T / 2 - 8, background: MARK_LINE, zIndex: 4 }}>
                      두께 {s.thickness}
                    </span>
                  </span>
                </div>
                <span className="mt-3 flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
                  <b className="text-[13px] pk-text">
                    {sz}
                    {sz === pc().defaults.size ? '(기본)' : ''} · 두께 {s.thickness}
                  </b>
                  {axisDesc(spec, 'size', sz)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl px-6 py-5 pk-surface">
          {BTN_SIZES.map((size) => {
            const b = buttonLook({ variant: 'neutralSolid', size });
            return (
              <div key={size} className="flex flex-col items-center gap-2">
                <ButtonView look={b} label="저장" state="loading" />
                <span className="text-[11px] tabular-nums pk-muted">
                  {size} — 원 {b.faces.light.enabled.progress.size}
                </span>
              </div>
            );
          })}
        </div>
        <Note>버튼 안의 원은 Button 이 크기 · 두께 · 색을 넘긴다(inherit — 두께 {buttonLook({ variant: 'neutralSolid', size: 'medium' }).faces.light.enabled.progress.thickness}). 그 밖의 크기(16 · 32 · 48)는 두지 않는다</Note>
      </div>
    </Figure>
  );
};

// 톤 넷 — 흰 면 · 앱 첫 화면 · 사진 위 딤 · 글자색. 대비는 토큰 값으로 잰다
const TONE_ORDER: PcTone[] = ['neutral', 'brand', 'staticWhite', 'inherit'];
const Tones: Fig = ({ caption }) => {
  const spec = loadComponentSpec('progress-circle');
  if (TONE_ORDER.length !== PC_TONES.length) throw new Error('progress-circle.tsx 의 톤 그림이 tone 축과 다르다');
  const ratio = (tone: 'neutral' | 'brand', mode: 'light' | 'dark', surf: string) => {
    const r = pc().tones[tone].range;
    return contrast(mode === 'dark' ? r.dark : r.light, surf).toFixed(2);
  };
  const S = SCREEN();
  const cell = (mode: Mode, tone: PcTone) => {
    const m = mode === 'dark' ? 'dark' : 'light';
    const white = m === 'dark' ? S['bg-layer-default'].dark : S['bg-layer-default'].light;
    if (tone === 'neutral')
      return (
        <div className="grid h-[132px] place-items-center rounded-xl" style={{ background: rc('bg-layer-default', mode) }}>
          <span className="flex flex-col items-center gap-2">
            <Circle mode={mode} size="40" />
            <span className="text-[11px] tabular-nums" style={{ color: rc('fg-neutral-subtle', mode) }}>
              원 : 흰 면 {ratio('neutral', m, white)}:1
            </span>
          </span>
        </div>
      );
    if (tone === 'brand')
      return (
        <div className="flex h-[132px] flex-col items-center justify-center gap-3 rounded-xl" style={{ background: rc('bg-layer-default', mode) }}>
          <span className="text-[16px] font-bold" style={{ color: rc('fg-brand', mode) }}>
            그루 담다
          </span>
          <Circle mode={mode} size="40" tone="brand" label="시작하는 중" />
          <span className="text-[11px] tabular-nums" style={{ color: rc('fg-neutral-subtle', mode) }}>
            원 : 흰 면 {ratio('brand', m, white)}:1
          </span>
        </div>
      );
    if (tone === 'staticWhite')
      return (
        <div className="relative grid h-[132px] place-items-center overflow-hidden rounded-xl">
          <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #9DB7D5 0%, #6E8FB3 45%, #5A6E52 46%, #7F9A6A 100%)' }} />
          <span aria-hidden className="absolute inset-0" style={{ background: lcv(SCREEN().dim, mode) }} />
          <span className="relative">
            <Circle mode={mode} size="40" tone="staticWhite" />
          </span>
        </div>
      );
    return (
      <div className="grid h-[132px] place-items-center rounded-xl" style={{ background: rc('bg-layer-default', mode) }}>
        <span className="flex items-center gap-2 text-[14px] font-bold" style={{ color: rc('fg-brand', mode) }}>
          <Circle mode={mode} size="24" tone="inherit" decorative />
          영수증 올리는 중
        </span>
      </div>
    );
  };
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {TONE_ORDER.map((t) => (
          <div key={t} className="flex w-[150px] flex-col gap-2">
            {cell('light', t)}
            {cell('dark', t)}
            <span className="flex flex-col gap-0.5 text-center text-[12px] leading-4 pk-muted">
              <b className="text-[13px] pk-text">
                {t}
                {t === pc().defaults.tone ? '(기본)' : ''}
              </b>
              {axisDesc(spec, 'tone', t)}
            </span>
          </div>
        ))}
      </div>
    </Figure>
  );
};

// 값 없는 원 · 값 있는 원 0 · 40 · 100
const Modes: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-wrap items-start justify-center gap-4 rounded-2xl px-6 py-8 pk-surface">
      {(
        [
          ['값 없는 원', undefined, `${pc().motion.rotate.ms / 1000}초에 한 바퀴 — 호가 늘었다 줄며 돈다`],
          ['값 0', 0, '트랙만 — 호를 지운다(둥근 점이 남지 않게)'],
          ['값 40', 40, '12시부터 40%'],
          ['값 100', 100, '꽉 찬 원 — 부르는 쪽이 결과로 바꾼다'],
        ] as [string, number | undefined, string][]
      ).map(([t, v, cap]) => (
        <div key={t} className="flex w-[120px] flex-col items-center gap-3">
          <Circle size="40" value={v} />
          <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
            <b className="text-[13px] pk-text">{t}</b>
            {cap}
          </span>
        </div>
      ))}
    </div>
  </Figure>
);

// 모션 줄이기 — 돌지 않는 3/4 호(24 · 40, 라이트 · 다크)
const ReducedMotion: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex items-center gap-6 rounded-2xl px-8 py-6" style={{ background: rc('bg-layer-default', mode) }}>
            {PC_SIZES.map((s) => (
              <Circle key={s} mode={mode} size={s} still />
            ))}
            <Circle mode={mode} size="40" value={40} still />
          </div>
        ))}
      </div>
      <Note>값 없는 원은 12시부터 시계 방향 {pc().reducedArc}% 에 멈춘 호, 값 있는 원은 채움이 바로 바뀐다(전환 0). 기기에서 동작 줄이기를 켜면 이 모습이다</Note>
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
// 자리가 범위를 말한다 — 섹션 제목 옆 24 · 목록 끝 24 · 콘텐츠 가운데 40 / 회색 막 "Loading" · 틀 없는 원
const PlacementGuide: Fig = ({ caption }) => {
  const small = { ...SK_ROW, title: 84, detail: 56, amount: 48 };
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="원이 놓인 자리가 무엇을 기다리는지 말한다 — 틀(머리 · 탭 바)은 그대로 그리고 원은 콘텐츠 영역에만" bg={BASEMENT}>
          <div className="flex flex-wrap items-start justify-center gap-4">
            <Shot strong="섹션 제목 옆 24" cap="그 섹션 — 보던 내용은 그대로">
              <div className="w-[280px]">
                <CardBox title="최근 거래" right={<Circle size="24" label="최근 거래 새로 고치는 중" />}>
                  <TxList n={2} compact />
                </CardBox>
              </div>
            </Shot>
            <Shot strong="목록 아래 가운데 24" cap="다음 묶음">
              <div className="w-[280px]">
                <CardBox title="거래">
                  <TxList n={2} compact />
                  <div className="flex justify-center py-3">
                    <Circle size="24" label="거래 더 불러오는 중" />
                  </div>
                </CardBox>
              </div>
            </Shot>
            <Shot strong="콘텐츠 가운데 40" cap="그 화면 · 시트 · 카드 전체">
              <LdPhone title="검색" back tabs={false} scale={0.5} h={520} bg="bg-layer-default">
                <SearchBar />
                <div className="grid flex-1 place-items-center" style={{ paddingBottom: 60 }}>
                  <Circle size="40" label="검색 결과 불러오는 중" />
                </div>
              </LdPhone>
            </Shot>
          </div>
        </Verdict>
        <Pair>
          <Verdict ok={false} note='화면을 덮는 회색 막 위 원 · "Loading" — 뒤 화면이 보이지 않고 무엇을 기다리는지 알 수 없다' bg={BASEMENT}>
            <LdPhone title="가계부" scale={0.5} h={520}>
              <div className="relative h-full">
                <div style={cardStack()}>
                  <CardBox title="최근 거래">
                    <TxSkeletonRows n={3} widths={small} />
                  </CardBox>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: 'rgba(120,124,135,0.72)' }}>
                  <Circle size="40" tone="staticWhite" decorative />
                  <span className="text-[15px] font-bold text-white">Loading</span>
                </div>
              </div>
            </LdPhone>
          </Verdict>
          <Verdict ok={false} note="앱 틀 없이 화면 가운데 원 하나 — 첫 진입이어도 머리 · 탭 바는 먼저 그린다" bg={BASEMENT}>
            <LdPhone scale={0.5} h={520} tabs={false} bg="bg-layer-default">
              <div className="grid h-full place-items-center">
                <Circle size="40" decorative />
              </div>
            </LdPhone>
          </Verdict>
        </Pair>
      </div>
    </Panel>
  );
};

// 기다리는 동안 — 가운데 원: 1초에 나타남 · 5초 안내 글 · 10초 실패
function SearchCard({ mode = 'auto', phase }: { mode?: Mode; phase: 'quiet' | 'waiting' | 'slow' | 'failed' }) {
  const g = L().skeleton.slowText.gap;
  return (
    <CardBox mode={mode} title="검색 결과" style={{ width: 264, minHeight: 280 }}>
      {phase === 'failed' ? (
        // 카드 안 결과 — 좌우는 목록 카드의 24 만(결과 자리의 좌우 0)
        <div style={{ paddingTop: 20, paddingRight: L().skeleton.slowText.padXList, paddingBottom: 12, paddingLeft: L().skeleton.slowText.padXList }}>
          <ResultSectionView look={resultSectionLook()} mode={mode} kind="failure" size="medium" inCard title="검색 결과를 불러오지 못했어요" description="잠시 후 다시 시도해주세요." primary={{ label: '다시 시도' }} />
        </div>
      ) : (
        // 목록 카드 바로 아래 영역 — 원 · 오래 걸림 글은 좌우 24 안에(skeleton.yaml slowText.paddingX 비고)
        <div className="flex flex-col items-center" style={{ paddingTop: 64, paddingLeft: L().skeleton.slowText.padXList, paddingRight: L().skeleton.slowText.padXList, gap: g, visibility: phase === 'quiet' ? 'hidden' : undefined }}>
          <Circle mode={mode} size="40" decorative />
          {phase === 'slow' && <SlowText mode={mode} align="center" />}
        </div>
      )}
    </CardBox>
  );
}
const TimelineGuide: Fig = ({ caption }) => {
  const r = L().skeleton.region;
  const s = (ms: number) => `${ms / 1000}초`;
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-1 gap-5 rounded-2xl p-4 sm:grid-cols-[264px_264px]" style={{ background: rc('bg-layer-basement') }}>
        <Shot strong={`0 ~ ${s(r.showAfter)}`} cap="보이지 않는다 — 1초 안에 끝나면 깜빡이지 않는다">
          <SearchCard phase="quiet" />
        </Shot>
        <Shot strong={`${s(r.showAfter)} ~`} cap="콘텐츠 가운데 원 40">
          <SearchCard phase="waiting" />
        </Shot>
        <Shot strong={`${s(r.slowAfter)} ~`} cap={`원 아래 ${L().skeleton.slowText.gap} · 가운데 맞춤 안내 글`}>
          <SearchCard phase="slow" />
        </Shot>
        <Shot strong={s(r.timeout)} cap="실패 + 다시 시도(Result Section)">
          <SearchCard phase="failed" />
        </Shot>
      </div>
    </Figure>
  );
};

// 올리기 · 받기 — 값 있는 원 24: 사진 위 딤 · 파일 옆 / 올리기를 막대로
function FileRow({ mode = 'auto', value, bar = false }: { mode?: Mode; value: number; bar?: boolean }) {
  const p = L().progress;
  return (
    <div className="flex items-center gap-3" style={{ padding: '12px 0' }}>
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[12px] font-bold" style={{ background: rc('chart-red-weak', mode), color: rc('chart-red-contrast', mode) }}>
        PDF
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[15px] font-medium" style={{ color: rc('fg-neutral', mode) }}>
          10월 카드 명세서.pdf
        </span>
        {bar ? (
          <span className="block overflow-hidden" style={{ height: p.track.height, borderRadius: p.track.radius, background: rc('bg-neutral-weak', mode) }}>
            <span className="block h-full" style={{ width: `${value}%`, borderRadius: p.fill.radius, background: rc('fg-brand', mode) }} />
          </span>
        ) : (
          <span className="text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
            1.2MB
          </span>
        )}
      </span>
      {!bar && <Circle mode={mode} size="24" value={value} label="10월 카드 명세서 올리는 중" />}
    </div>
  );
}
const DeterminateGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="사진은 딤 위 가운데 흰 원(staticWhite), 파일 · 앱 업데이트는 이름 옆 회색 원(neutral) — 다 차면 원을 걷는다" bg={BASEMENT}>
        <div className="flex w-[300px] flex-col gap-3 rounded-2xl px-6 py-5 pk-surface">
          <div className="flex gap-2">
            <Uploading value={40} />
            <Uploading value={75} />
          </div>
          <FileRow value={60} />
        </div>
      </Verdict>
      <Verdict ok={false} note="올리기를 막대로 — 막대(Progress)는 얼마나 찼나를 보이는 미터다. 진행은 값 있는 원" bg={BASEMENT}>
        <div className="flex w-[300px] flex-col gap-3 rounded-2xl px-6 py-5 pk-surface">
          <FileRow value={60} bar />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 당겨서 새로 고침 ──────────────────────────────────────
// 직접 당겨 보기(실제로 끈다) + 단계 넷(당기는 중 · 문턱 · 새로 고치는 중 · 끝남)
function PullFrame({ mode = 'auto', pull, phase, w = 136, h = 250 }: { mode?: Mode; pull: number; phase: 'pulling' | 'ready' | 'refreshing' | 'done'; w?: number; h?: number }) {
  const p = L().pull;
  const ratio = Math.min(pull / p.threshold, 1);
  const refreshing = phase === 'refreshing';
  const y = refreshing ? 0 : Math.min(pull - p.indicator, 0);
  return (
    <div className="relative overflow-hidden" style={{ width: w, height: h, borderRadius: 18, border: '5px solid var(--p-frame)', background: rc('bg-layer-basement', mode) }}>
      <div className="relative z-[2] flex h-10 items-center px-4 text-[14px] font-bold" style={{ background: rc('bg-layer-default', mode), color: rc('fg-neutral', mode) }}>
        가계부
      </div>
      <div className="relative" style={{ height: 'calc(100% - 40px)' }}>
        {phase !== 'done' && (
          <div aria-hidden className="absolute inset-x-0 top-0 z-[1] grid place-items-center" style={{ height: p.indicator, transform: `translateY(${y}px)`, opacity: refreshing ? 1 : ratio }}>
            {refreshing ? <Circle mode={mode} size="24" decorative /> : <Circle mode={mode} size="24" value={ratio * 100} decorative />}
          </div>
        )}
        <div className="px-2.5 pt-2" style={{ transform: `translateY(${pull}px)` }}>
          <div className="flex flex-col gap-2 rounded-xl p-3" style={{ background: rc('bg-layer-default', mode) }}>
            {[70, 55, 80, 45].map((w, i) => (
              <span key={i} className="block h-3 rounded-full" style={{ width: `${w}%`, background: rc('stroke-neutral-weak', mode) }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
const Ptr: Fig = ({ caption }) => {
  const p = L().pull;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <PullToRefreshDemo kit={L()} screen={SCREEN()} list={listLook()} snack={snackbarLook()} />
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
          <Shot strong={`당기는 중 ${Math.round(p.threshold / 2)}`} cap={`원이 ${Math.round(50)}% 차고 짙어진다 — 손가락 × ${p.multiplier}`}>
            <PullFrame pull={p.threshold / 2} phase="pulling" />
          </Shot>
          <Shot strong={`문턱 ${p.threshold}`} cap="꽉 찬 원 — 놓으면 새로 고친다">
            <PullFrame pull={p.threshold + 16} phase="ready" />
          </Shot>
          <Shot strong="새로 고치는 중" cap={`원이 돌고 내용은 ${p.threshold} 에 머문다 — 끝날 때까지`}>
            <PullFrame pull={p.threshold} phase="refreshing" />
          </Shot>
          <Shot strong="끝남" cap={`${p.motion.done.ms}ms 에 제자리로 — 보던 내용은 그대로`}>
            <PullFrame pull={0} phase="done" />
          </Shot>
        </div>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExBasic: Fig = () => <CircleBasicDemo kit={L()} screen={SCREEN()} list={listLook()} search={buttonLook({ variant: 'neutralSolid', size: 'small' })} />;
const ExDeterminate: Fig = () => <CircleUploadDemo kit={L()} screen={SCREEN()} start={buttonLook({ variant: 'neutralWeak', size: 'small' })} />;

export const progressCircleFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  tones: Tones,
  modes: Modes,
  'reduced-motion': ReducedMotion,
  'placement-guide': PlacementGuide,
  'timeline-guide': TimelineGuide,
  'determinate-guide': DeterminateGuide,
  ptr: Ptr,
  'ex-basic': ExBasic,
  'ex-determinate': ExDeterminate,
};

