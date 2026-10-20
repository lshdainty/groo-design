// Aspect Ratio 페이지의 그림 — specs/components/aspect-ratio.md 의 `[그림: …](../../site/components/specs/aspect-ratio.tsx#<id>)` 자리.
// 비율 상자는 aspect-ratio.yaml(image-look 의 aspectRatioLook — 비율은 Image Frame 과 같은 여덟), 그림 틀 비교는 image-frame.yaml 로 그린다.
// 자식(동영상 · 지도 · 카메라 화면)은 손으로 칠한 대역이다.
import type { CSSProperties, ReactNode } from 'react';
import { ImageOff } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { tone } from './display-screens';
import { IF_RATIOS, imageTones, RATIO_KO, type IfRatio, type PicKind } from './image-look';
import { AspectRatioPlayground } from './image-playground';
import { AspectRatioView, MapChild, PicLayer, VideoChild } from './image-view';
import { ARL, CARDS, Frame, PhoneBoard, Rows, cardRow, type Fig } from './image-screens';
import { Legend, Note, pinStyle } from './overlay-screens';
import { Verdict, rc, type Mode } from './kit';

const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const modeKo = (m: Mode) => (m === 'dark' ? '다크' : '라이트');
const AR = ({ ratio, width, children, zone, style }: { ratio?: IfRatio; width?: number | string; children?: ReactNode; zone?: { root?: CSSProperties; child?: CSSProperties }; style?: CSSProperties }) => (
  <AspectRatioView look={ARL()} ratio={ratio} width={width} zone={zone} style={style}>
    {children}
  </AspectRatioView>
);
const v = (r: IfRatio) => ARL().ratios[r].value;
// 카드 촬영 화면 — 카드 모양 자리(카드 그림이 아닌 것). 카메라 화면 + 맞출 틀 안내
function CameraChild({ frame, mode = 'auto' }: { frame: number; mode?: Mode }) {
  return (
    <div role="img" aria-label="카드를 비추는 카메라 화면" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}>
      <PicLayer kind="dusk" frame={frame} fit="cover" />
      <span aria-hidden style={{ position: 'absolute', left: '8%', right: '8%', top: '12%', bottom: '12%', borderRadius: 10, boxShadow: '0 0 0 2px rgba(255,255,255,.9)' }} />
      <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: '3%', textAlign: 'center', fontSize: 11, lineHeight: '15px', color: rc('static-white', mode) }}>
        카드를 틀에 맞춰 주세요
      </span>
    </div>
  );
}
function Sub({ children, mode = 'auto', strong }: { children?: ReactNode; mode?: Mode; strong?: ReactNode }) {
  return (
    <span className="flex max-w-[200px] flex-col items-center gap-0.5 text-center text-[11px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
      {strong && (
        <b className="text-[12px]" style={{ color: tone('fg-neutral', mode) }}>
          {strong}
        </b>
      )}
      {children}
    </span>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => {
  const board = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-col items-center gap-4 rounded-xl p-5" style={{ background: rc('bg-layer-default', mode) }}>
        {(
          [
            ['4:3', '4:3 — 기본', '지도 미리보기', <MapChild key="m" frame={v('4:3')} label="가게 위치 지도" />],
            ['16:9', '16:9', '안내 동영상', <VideoChild key="v" frame={v('16:9')} label="자산 연결 안내 동영상" />],
            ['card', `card ${v('card')}`, '카드 촬영 — 카드 모양 자리', <CameraChild key="c" frame={v('card')} mode={mode} />],
          ] as [IfRatio, string, string, ReactNode][]
        ).map(([r, strong, cap, kid]) => (
          <div key={r} className="flex w-full max-w-[280px] flex-col gap-1.5">
            <AR ratio={r}>{kid}</AR>
            <Sub mode={mode} strong={strong}>
              {cap}
            </Sub>
          </div>
        ))}
      </div>
      <span className="text-center text-[12px] leading-4 pk-muted">{modeKo(mode)}</span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {board('light')}
        {board('dark')}
      </div>
    </Panel>
  );
};

const Playground: Fig = () => {
  const t = imageTones();
  return <AspectRatioPlayground look={ARL()} tones={{ 'bg-layer-basement': t['bg-layer-basement'], 'bg-layer-default': t['bg-layer-default'], 'fg-neutral-subtle': t['fg-neutral-subtle'] }} />;
};

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const W = 320;
  const H = W / v('16:9');
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative rounded-2xl px-12 pb-10 pt-12 pk-surface">
          <span className="relative block" style={{ width: W }}>
            <AR ratio="16:9" width={W} zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 } }}>
              <VideoChild frame={v('16:9')} label="자산 연결 안내 동영상" />
            </AR>
            <span aria-hidden className="absolute flex items-center" style={{ left: '100%', top: 0, bottom: 0, marginLeft: 10, borderLeft: `2px solid ${MARK_LINE}`, paddingLeft: 4 }}>
              <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                {H.toFixed(1)}
              </span>
            </span>
            <span aria-hidden className="absolute flex justify-center" style={{ left: 0, right: 0, top: '100%', marginTop: 10, borderTop: `2px solid ${MARK_LINE}`, paddingTop: 4 }}>
              <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                {W}
              </span>
            </span>
            {pinStyle('ⓐ', { left: -30, top: -30 })}
            {pinStyle('ⓑ', { left: W / 2 - 10, top: H / 2 - 40 })}
          </span>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Root — 폭은 부모, 높이는 폭 ÷ 비율'],
            ['ⓑ', 'Child — 자식 하나가 상자를 채운다'],
          ]}
        />
        <Note>16:9 상자(폭 {W} → 높이 {H.toFixed(1)}). 모서리 · 바탕 · 윤곽이 없다 — 점선은 상자의 자리다</Note>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Ratio: Fig = ({ caption }) => {
  const l = ARL();
  const w = 112;
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-4 items-start gap-x-5 gap-y-6 rounded-2xl px-8 py-7 pk-surface">
        {IF_RATIOS.map((r) => (
          <div key={r} className="flex w-[112px] flex-col items-center gap-2">
            <AR ratio={r} width={w} zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 0 } }}>
              <div className="grid h-full w-full place-items-center" style={{ background: MARK }}>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: MARK_LINE }}>
                  {r}
                </span>
              </div>
            </AR>
            <span className="flex flex-col items-center gap-0.5 text-center text-[11px] leading-4 pk-muted">
              <b className="text-[12px] pk-text">
                {l.ratios[r].expr}
                {r === l.defaults.ratio ? '(기본)' : ''}
              </b>
              <span className="tabular-nums">
                {w} × {(w / l.ratios[r].value).toFixed(1)}
              </span>
              <span>{r === 'card' ? 'groo — 카드 모양 자리' : RATIO_KO[r]}</span>
            </span>
          </div>
        ))}
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 그림은 Image Frame, 그 밖이 Aspect Ratio — 그림을 넣고 모서리를 손으로 두른 화면
const WhichGuide: Fig = ({ caption }) => {
  const cards = CARDS.slice(0, 3);
  const handRadius = [12, 6, 4];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="카드 그림은 Image Frame(폭으로 고른 모서리 · 윤곽 · 대체 그림), 동영상은 Aspect Ratio" bg={BASEMENT}>
          <div className="flex w-full flex-col gap-3">
            <PhoneBoard>
              <Rows rows={cards.map((c) => cardRow(c))} />
            </PhoneBoard>
            <span className="mx-auto block" style={{ width: 240 }}>
              <AR ratio="16:9">
                <VideoChild frame={v('16:9')} label="자산 연결 안내 동영상" />
              </AR>
            </span>
          </div>
        </Verdict>
        <Verdict ok={false} note="Aspect Ratio 에 그림을 넣고 모서리를 손으로 둘렀다 — 줄마다 12 · 6 · 4, 윤곽 · 대체 그림이 없다" bg={BASEMENT}>
          <div className="flex w-full flex-col gap-3">
            <PhoneBoard>
              <Rows
                rows={cards.map((c, i) => ({
                  ...cardRow(c),
                  prefix: {
                    node: (
                      <span className="block overflow-hidden" style={{ width: 56, borderRadius: handRadius[i] }}>
                        <AR ratio="card">{c.pic ? <PicLayer kind={c.pic} frame={v('card')} fit="cover" /> : <BrokenImg />}</AR>
                      </span>
                    ),
                  },
                }))}
              />
            </PhoneBoard>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};
// 깨진 그림 — 그림이 없는데 대체 그림이 없다(브라우저 기본)
function BrokenImg() {
  return (
    <span aria-hidden className="absolute grid place-items-center" style={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      <ImageOff size={14} strokeWidth={1.5} style={{ color: rc('fg-neutral-muted') }} />
    </span>
  );
}

// 한 화면은 한두 비율 — 한 격자는 한 비율 · 칸마다 다른 비율
const GRID_PICS: PicKind[] = ['meadow', 'sunset', 'sea', 'forest'];
const RatioGuide: Fig = ({ caption }) => {
  const mixed: IfRatio[] = ['1:1', '16:9', '4:5', '2:1'];
  const cell = (r: IfRatio, p: PicKind, i: number) => (
    <span key={i} className="flex flex-col gap-1.5" style={{ width: 120 }}>
      <Frame width={120} ratio={r} pic={p} />
      <span className="text-[12px] font-bold leading-4 pk-text">사진 {i + 1}</span>
    </span>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="한 격자는 4:3 하나 — 줄 높이가 고르다" bg={BASEMENT}>
          <div className="grid grid-cols-2 items-start gap-3 rounded-2xl p-4 pk-surface">{GRID_PICS.map((p, i) => cell('4:3', p, i))}</div>
        </Verdict>
        <Verdict ok={false} note="칸마다 1:1 · 16:9 · 4:5 · 2:1 — 줄 높이가 들쭉날쭉하다" bg={BASEMENT}>
          <div className="grid grid-cols-2 items-start gap-3 rounded-2xl p-4 pk-surface">{GRID_PICS.map((p, i) => cell(mixed[i], p, i))}</div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — aspect-ratio.md 의 코드 그대로 ─────
const ExVideo: Fig = ({ caption }) => (
  <figure className="not-prose mb-0 mt-6">
    <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border" style={{ background: rc('bg-layer-default'), paddingTop: 24, paddingBottom: 24, paddingLeft: 8, paddingRight: 8 }}>
      <div className="w-full" style={{ maxWidth: 360 }}>
        <AR ratio="16:9">
          <VideoChild frame={v('16:9')} label="자산 연결 안내 동영상" />
        </AR>
      </div>
    </div>
    {caption && <figcaption className="sr-only">{caption}</figcaption>}
  </figure>
);

export const aspectRatioFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  ratio: Ratio,
  'which-guide': WhichGuide,
  'ratio-guide': RatioGuide,
  'ex-video': ExVideo,
};
