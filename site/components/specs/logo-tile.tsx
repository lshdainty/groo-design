// Logo Tile 페이지의 그림 — specs/components/logo-tile.md 의 `[그림: …](../../site/components/specs/logo-tile.tsx#<id>)` 자리.
// 타일은 logo-tile.yaml(image-look 의 logoTileLook), 기관 색은 institution-colors.yaml(표 전체 — 대비는 값에서 잰다), 이름 색 · 첫 글자는 Avatar 규칙,
// 카드 그림 판은 image-frame.yaml, 목록 줄은 list.yaml, 아바타는 avatar.yaml 로 그린다. 그림(카드 · 로고)은 손으로 칠한 대역이다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { avatarLook } from './display-look';
import { AvatarView, Reading } from './display-view';
import { Header, Screen, tone } from './display-screens';
import { listLook } from './list-look';
import { avatarHue, avatarHueIndex, avatarInitial, codePointSum, contrastOf, imageTones, institutionContrast, institutions, logoFace, LT_SIZES, over, ratioText, type Institution } from './image-look';
import { LogoCardDemo } from './image-demos';
import { LogoTilePlayground } from './image-playground';
import { ASSETS, AccountManageScreen, AssetDetailScreen, AssetHead, AssetListScreen, IFL, LTL, Logo, PhoneBoard, Rows, assetDetail, assetRow, type Fig } from './image-screens';
import { Legend, Note, pinStyle } from './overlay-screens';
import { Verdict, rc, type Mode } from './kit';

const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const modeKo = (m: Mode) => (m === 'dark' ? '다크' : '라이트');
const inst = (name: string) => {
  const e = institutions().find((x) => x.name === name);
  if (!e) throw new Error(`institution-colors.yaml 에 ${name} 이 없다 — logo-tile.tsx 의 그림을 고친다`);
  return e;
};
const crText = (e: Institution) => {
  const c = institutionContrast(e);
  return c.kind === 'white' ? ratioText(c.white) : `${ratioText(c.light)} · 다크 ${ratioText(c.dark)}`;
};
function Sub({ children, mode = 'auto', strong }: { children?: ReactNode; mode?: Mode; strong?: ReactNode }) {
  return (
    <span className="flex max-w-[180px] flex-col items-center gap-0.5 text-center text-[11px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
      {strong && (
        <b className="text-[12px]" style={{ color: tone('fg-neutral', mode) }}>
          {strong}
        </b>
      )}
      {children}
    </span>
  );
}
const ModeBoard = ({ mode, children }: { mode: Mode; children: ReactNode }) => (
  <div className="flex min-w-0 flex-col gap-2">
    <div className="rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
      {children}
    </div>
    <span className="text-center text-[12px] leading-4 pk-muted">{modeKo(mode)}</span>
  </div>
);

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <AssetListScreen mode={mode} scale={0.5} h={600} />
          <AccountManageScreen mode={mode} scale={0.5} h={600} />
          <AssetDetailScreen mode={mode} scale={0.5} h={600} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => {
  checkCodeTable();
  const t = imageTones();
  return <LogoTilePlayground look={LTL()} frame={IFL()} table={institutions()} list={listLook('desk')} tones={{ 'bg-layer-basement': t['bg-layer-basement'], 'bg-layer-default': t['bg-layer-default'], 'fg-neutral-subtle': t['fg-neutral-subtle'] }} />;
};

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = LTL();
  const z = 3;
  const s = l.sizes['40'].size * z;
  const pad = l.platePad * z;
  const dash: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 };
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-7">
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 rounded-2xl px-10 pb-8 pt-12 pk-surface">
          <span className="relative inline-flex">
            <Logo name="신한" zoom={z} zone={{ root: dash, initial: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 } }} />
            {pinStyle('ⓐ', { left: -28, top: -28 })}
            {pinStyle('ⓑ', { left: s / 2 + 18, top: s / 2 - 34 })}
          </span>
          <span className="relative inline-flex">
            <Logo name="삼성카드" image="card" pic="card-v" zoom={z} zone={{ plate: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -pad } }} />
            {pinStyle('ⓒ', { left: s / 2 - 10, top: -28 })}
            {pinStyle('ⓓ', { left: s + 8, top: s / 2 - 10 })}
          </span>
          <span className="relative inline-flex">
            <Logo name="숲길" face="name" image="logo" pic="logo-leaf" zoom={z} />
            {pinStyle('ⓒ', { left: s / 2 - 10, top: -28 })}
          </span>
        </div>
        <Legend
          items={[
            ['ⓐ', `Container — ${l.sizes['40'].size} · 모서리 ${l.sizes['40'].radius}`],
            ['ⓑ', `Initial — 첫 글자 ${l.sizes['40'].font} · ${l.initial.weight}`],
            ['ⓒ', `Plate · Image — 판 안쪽 ${l.platePad}`],
            ['ⓓ', `Stroke — 안쪽 ${l.stroke.width}px 투명 윤곽`],
          ]}
        />
        <Note>40 을 3배로 그렸다 — 카드 그림은 옅은 판 위에 카드 전체(세로 그림은 돌린다), 로고 그림은 흰 판 위에 잘리지 않게. 점선 안쪽이 판의 여백 {l.platePad} 를 뺀 그림 자리다</Note>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Size: Fig = ({ caption }) => {
  const l = LTL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5 rounded-2xl px-4 py-8 pk-surface">
        <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
          {LT_SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <span className="flex items-end gap-3">
                <Logo size={s} name="신한" />
                <Logo size={s} name="KB국민" />
                <Logo size={s} name="비상금" face="name" />
              </span>
              <span className="flex flex-col items-center text-center text-[11px] leading-4 pk-muted">
                <b className="text-[13px] tabular-nums pk-text">
                  {s}
                  {s === l.defaults.size ? '(기본)' : ''}
                </b>
                모서리 {l.sizes[s].radius}({l.sizes[s].radiusToken}) · 글자 {l.sizes[s].font}
              </span>
            </div>
          ))}
        </div>
        <Note>모서리는 크기 × 0.3, 첫 글자는 크기의 40%(반올림). 32 는 좁은 줄 · 카드 옆 회사, 40 은 목록 줄, 48 은 상세 머리 — 이 밖의 크기를 만들지 않는다</Note>
      </div>
    </Panel>
  );
};

// 면 — 기관 색(흰 글자 · 짙은 글자) · 이름 색, 라이트 · 다크. 대비는 값에서 잰다
const FACE_ROWS: { label: string; names: string[]; face: 'institution' | 'name' }[] = [
  { label: '기관 색 · 흰 글자', names: ['신한', '우리', '삼성증권', '업비트'], face: 'institution' },
  { label: '기관 색 · 짙은 글자', names: ['KB국민', 'NH농협', '유안타증권', '카카오뱅크'], face: 'institution' },
  { label: '이름 색 — 기관이 없는 자산', names: ['비상금', '여행 적금', '생활비', '용돈'], face: 'name' },
];
const Face: Fig = ({ caption }) => {
  const l = LTL();
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="flex flex-col gap-4">
        {FACE_ROWS.map((row) => (
          <div key={row.label} className="flex flex-col gap-2">
            <span className="text-[12px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
              {row.label}
            </span>
            <div className="grid grid-cols-4 gap-2">
              {row.names.map((n) => {
                const f = logoFace(n, row.face, institutions(), l);
                const fg = mode === 'dark' ? f.fg.dark : f.fg.light;
                const bg = mode === 'dark' ? f.bg.dark : f.bg.light;
                return (
                  <span key={n} className="flex flex-col items-center gap-1">
                    <Logo name={n} face={row.face} mode={mode} />
                    <span className="text-center text-[10px] leading-[13px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
                      {f.found ? f.found.inst.name : `${f.hue}`}
                      <br />
                      <span className="tabular-nums">{ratioText(contrastOf(fg, bg))}:1</span>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ModeBoard>
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

// 기관 색 표 — institution-colors.yaml 78곳 그대로. 대비는 색과 글자색 토큰에서 잰다(짙은 글자는 라이트 · 다크)
const InstitutionColors: Fig = ({ caption }) => {
  const rows = institutions();
  const cats = [...new Set(rows.map((r) => r.category))];
  const min = Math.min(...rows.map((e) => {
    const c = institutionContrast(e);
    return c.kind === 'white' ? c.white : Math.min(c.light, c.dark);
  }));
  const dark = rows.filter((r) => r.text === 'dark').length;
  const fixed = rows.filter((r) => r.ci).length;
  // 캡션의 "78곳" 이 표의 줄 수와 같은지(스펙 md 의 글)
  const said = /(\d+)곳/.exec(caption ?? '')?.[1];
  if (said && Number(said) !== rows.length) throw new Error(`logo-tile.md 기관 색 표 캡션의 ${said}곳이 institution-colors.yaml 의 ${rows.length}줄과 다르다`);
  // 78줄 — 표 안에서 세로로 민다(머리는 붙어 있다). 키보드로도 밀 수 있게 초점을 받고 이름을 가진다
  const th = 'sticky top-0 z-[1] border-b border-fd-border bg-fd-card px-3 py-2 font-medium';
  return (
    <figure className="not-prose my-6">
      <div role="region" aria-label="기관 색 표" tabIndex={0} className="max-h-[640px] overflow-auto rounded-xl border border-fd-border">
        <table className="w-full min-w-[600px] border-collapse text-[13px]">
          <thead>
            <tr className="text-left text-fd-muted-foreground">
              <th className={th}>타일 · 라이트 · 다크</th>
              <th className={th}>기관 · 별칭</th>
              <th className={th}>색</th>
              <th className={th}>글자</th>
              <th className={th}>대비</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((cat) => (
              <CatRows key={cat} cat={cat} rows={rows.filter((r) => r.category === cat)} />
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">
          {caption} — 짙은 글자 {dark}곳 · 색을 고친 곳 {fixed}곳(원래 색은 옆에) · 가장 낮은 대비 {ratioText(min)}:1
        </figcaption>
      )}
    </figure>
  );
};
function CatRows({ cat, rows }: { cat: string; rows: Institution[] }) {
  return (
    <>
      <tr>
        <td colSpan={5} className="border-b border-fd-border bg-fd-secondary/30 px-3 py-1.5 text-[12px] font-bold text-fd-foreground">
          {cat} <span className="font-normal text-fd-muted-foreground">{rows.length}</span>
        </td>
      </tr>
      {rows.map((e) => (
        <tr key={e.name} className="align-middle [&>td]:border-b [&>td]:border-fd-border [&>td]:px-3 [&>td]:py-1.5">
          <td>
            <span className="flex gap-1.5">
              <Logo size="32" name={e.name} mode="light" />
              <Logo size="32" name={e.name} mode="dark" />
            </span>
          </td>
          <td>
            <span className="flex flex-col">
              <span className="text-fd-foreground">{e.name}</span>
              {e.aliases.length > 0 && <span className="text-[11px] leading-4 text-fd-muted-foreground">{e.aliases.join(' · ')}</span>}
            </span>
          </td>
          <td>
            <span className="flex flex-col gap-0.5 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-[4px] border border-black/10 dark:border-white/20" style={{ background: e.color }} />
                <code className="text-[12px] text-fd-foreground">{e.color}</code>
              </span>
              {e.ci && <span className="text-[11px] leading-4 text-fd-muted-foreground">원래 {e.ci}</span>}
            </span>
          </td>
          <td className="whitespace-nowrap text-fd-foreground">{e.text === 'white' ? '흰 글자' : '짙은 글자'}</td>
          <td className="whitespace-nowrap tabular-nums text-fd-foreground">{crText(e)}</td>
        </tr>
      ))}
    </>
  );
}

// 그림 — 카드 그림(옅은 판 위 카드 전체 · 세로는 돌림) · 로고 그림(흰 판), 라이트 · 다크
const ImageFig: Fig = ({ caption }) => {
  const l = LTL();
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-center gap-4">
          {LT_SIZES.map((s) => (
            <span key={s} className="flex flex-col items-center gap-1.5">
              <Logo size={s} name="삼성카드" image="card" pic="card-v" mode={mode} />
              <Sub mode={mode}>
                <span className="whitespace-nowrap">
                  {s} → {Number(s) - l.platePad * 2}×{Math.round((Number(s) - l.platePad * 2) / l.cardRatio)}
                </span>
              </Sub>
            </span>
          ))}
          <span className="flex flex-col items-center gap-1.5">
            <Logo name="신한카드" image="card" pic="card-h" mode={mode} />
            <Sub mode={mode}>가로 그림</Sub>
          </span>
        </div>
        <div className="flex items-end justify-center gap-4">
          {LT_SIZES.map((s) => (
            <span key={s} className="flex flex-col items-center gap-1.5">
              <Logo size={s} name="숲길" face="name" image="logo" pic="logo-leaf" mode={mode} />
              <Sub mode={mode}>{s}</Sub>
            </span>
          ))}
          <span className="flex flex-col items-center gap-1.5">
            <Logo name="오렌지랩" face="name" image="logo" pic="logo-word" mode={mode} />
            <Sub mode={mode}>긴 로고</Sub>
          </span>
        </div>
        <Sub mode={mode}>카드 — 옅은 판(bg-neutral-weak) · 로고 — 흰 판(static-white, 두 모드 같다)</Sub>
      </div>
    </ModeBoard>
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

// 그림이 늦을 때 · 실패할 때 — 첫 글자 먼저 → 그림이 오면 덮기 → 실패하면 첫 글자 그대로
const Loading: Fig = ({ caption }) => {
  const a = { name: '삼성카드 데일리', institution: '삼성카드', type: '신용카드', balance: '−352,400원' };
  const step = (strong: string, cap: string, state: 'initial' | 'loaded' | 'failed') => (
    <div className="flex flex-col items-center gap-2">
      <PhoneBoard>
        <Rows rows={[assetRow(a, 'auto', { image: 'card', pic: 'card-v', load: state })]} />
      </PhoneBoard>
      <Sub strong={strong}>{cap}</Sub>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-3">
        {step('처음 그릴 때', '이름을 아니까 첫 글자 타일 — 스켈레톤을 두지 않는다', 'initial')}
        <ArrowRight aria-hidden size={18} className="rotate-90 pk-muted" />
        {step('그림이 옴', '판과 카드 그림이 첫 글자를 덮는다(전환 없이)', 'loaded')}
        <span className="text-[12px] pk-muted">또는</span>
        {step('못 불러옴', '첫 글자 그대로 — 깨진 그림 · 빈 칸이 없다', 'failed')}
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 물건은 타일, 사람은 원 — 분류는 List 타일
const ThingGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="사람은 원 아바타, 은행 · 증권은 로고 타일, 카테고리는 List 타일 — 목록마다 하나로" bg={BASEMENT}>
        <PhoneBoard>
          <Header title="함께 쓰는 사람" />
          <Rows rows={[{ kind: 'view', prefix: { person: '김민수' }, title: '김민수' }]} />
          <Header title="자산" />
          <Rows rows={[assetRow(ASSETS[0]), assetRow(ASSETS[2])]} />
          <Header title="최근 거래" />
          <Rows rows={[{ kind: 'button', prefix: { tile: 'orange', icon: 'utensils' }, title: '점심 식사', detail: '식비 · 오후 12:40', suffix: { amount: '−12,000원' } }]} />
        </PhoneBoard>
      </Verdict>
      <Verdict ok={false} note="은행 · 증권을 원 아바타로 — 사람과 물건이 한 모양이 된다" bg={BASEMENT}>
        <PhoneBoard>
          <Header title="자산" />
          <Rows
            rows={[ASSETS[0], ASSETS[2]].map((a) => ({
              ...assetRow(a),
              prefix: { node: <AvatarView look={avatarLook()} size="42" name={a.institution ?? a.name} /> },
            }))}
          />
        </PhoneBoard>
      </Verdict>
    </Pair>
  </Panel>
);

// 흰 글자가 모자라면 짙은 글자 — 유안타 · 대신 · NH농협(지금 흰 글자)
const CONTRAST_NAMES = ['유안타증권', '대신증권', 'NH농협'];
const ContrastGuide: Fig = ({ caption }) => {
  const l = LTL();
  const white = l.text.white.light;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="표의 글자색 — 흰 글자가 4.5:1 에 못 미치면 짙은 글자" bg={BASEMENT}>
          <div className="flex gap-4 rounded-2xl p-4 pk-surface">
            {CONTRAST_NAMES.map((n) => (
              <span key={n} className="flex flex-col items-center gap-1.5">
                <Logo size="48" name={n} />
                <Sub strong={n.replace('증권', '')}>{crText(inst(n))}:1</Sub>
              </span>
            ))}
          </div>
        </Verdict>
        <Verdict ok={false} note="모든 기관 색에 흰 글자(지금) — 4.5:1 에 못 미쳐 첫 글자가 읽기 어렵다" bg={BASEMENT}>
          <div className="flex gap-4 rounded-2xl p-4 pk-surface">
            {CONTRAST_NAMES.map((n) => (
              <span key={n} className="flex flex-col items-center gap-1.5">
                <Logo size="48" name={n} bad={{ fg: white }} />
                <Sub strong={n.replace('증권', '')}>{ratioText(contrastOf(white, inst(n).color))}:1</Sub>
              </span>
            ))}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 투명 윤곽으로 둘레를 잡는다 — 다크의 짙은 남색 · 흰 바탕의 노랑, 윤곽 있음 · 없음.
// 타일은 표에서 그 표면과 대비가 가장 낮은 셋(같은 색은 하나로). 대비는 타일 : 표면, 윤곽 : 타일(타일 위에 겹친 투명 선 — logo-tile.md 의 1.14 · 1.11 과 같은 잣대)
const StrokeGuide: Fig = ({ caption }) => {
  const l = LTL();
  const t = imageTones();
  const lowest = (mode: 'light' | 'dark') => {
    const surface = mode === 'dark' ? t['bg-layer-default'].dark : t['bg-layer-default'].light;
    const seen = new Set<string>();
    return [...institutions()]
      .sort((a, b) => contrastOf(a.color, surface) - contrastOf(b.color, surface))
      .filter((e) => (seen.has(e.color) ? false : (seen.add(e.color), true)))
      .slice(0, 3);
  };
  const set = (mode: 'light' | 'dark', stroke: boolean) => {
    const surface = mode === 'dark' ? t['bg-layer-default'].dark : t['bg-layer-default'].light;
    const line = mode === 'dark' ? l.stroke.color.dark : l.stroke.color.light;
    return (
      <span className="flex flex-col items-center gap-2 rounded-xl p-3" style={{ background: rc('bg-layer-default', mode) }}>
        <span className="flex gap-3">
          {lowest(mode).map((e) => (
            <span key={e.name} className="flex w-[60px] flex-col items-center gap-1">
              <Logo size="48" name={e.name} mode={mode} bad={stroke ? undefined : { stroke: false }} />
              <span className="text-center text-[10px] leading-[13px] tabular-nums" style={{ color: tone('fg-neutral-subtle', mode) }}>
                {e.name}
                <br />
                표면 {ratioText(contrastOf(e.color, surface))}
                {stroke && (
                  <>
                    <br />
                    윤곽 {ratioText(contrastOf(over(line, e.color), e.color))}
                  </>
                )}
              </span>
            </span>
          ))}
        </span>
        <span className="text-[11px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
          {modeKo(mode)} 표면 위
        </span>
      </span>
    );
  };
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="투명 윤곽(stroke-neutral-overlay)이 둘레를 잡는다 — 타일 색은 그대로. 윤곽은 장식이라 대비는 작아도 된다(이름 글이 물건을 알린다)" bg={BASEMENT}>
          <div className="flex flex-wrap justify-center gap-3">
            {set('dark', true)}
            {set('light', true)}
          </div>
        </Verdict>
        <Verdict ok={false} note="윤곽 없이 — 짙은 남색은 다크 표면에, 노랑은 흰 표면에 묻혀 글자만 뜬다" bg={BASEMENT}>
          <div className="flex flex-wrap justify-center gap-3">
            {set('dark', false)}
            {set('light', false)}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 같은 기관은 같은 색 — 같은 자산이 웹 · 앱에서 같은 색 · 웹 · 앱이 다른 해시로 갈린 지금(값은 캡션의 지금 색)
const ColorGuide: Fig = ({ caption }) => {
  const m = /웹\s*(#[0-9a-f]{6})\s*·\s*앱\s*(#[0-9a-f]{6})/i.exec(caption ?? '');
  if (!m) throw new Error('logo-tile.md color-guide 캡션에서 "웹 #… · 앱 #…" 를 찾지 못했다 — 그림을 고친다');
  const [, web, app] = m;
  const t = imageTones();
  const asset = ASSETS[4];
  const board = (label: string, bad?: string) => (
    <span className="flex flex-col gap-1.5">
      <span className="text-[12px] pk-muted">{label}</span>
      <PhoneBoard>
        <Rows rows={[{ ...assetRow(asset), prefix: { node: bad ? <Logo name={asset.name} face="name" bad={{ fg: t['static-white'].light }} style={{ background: bad }} /> : <Logo name={asset.name} face="name" /> } }]} />
      </PhoneBoard>
    </span>
  );
  return (
    <Panel caption={caption}>
      <Pair stack>
        <Verdict ok note={`웹 · 앱이 Avatar 와 같은 함수로 이름 색을 고른다 — "${asset.name}" 은 어디서나 ${avatarHue(asset.name, LTL().order)}`} bg={BASEMENT}>
          <div className="flex flex-col gap-3">
            {board('웹')}
            {board('앱')}
          </div>
        </Verdict>
        <Verdict ok={false} note={`웹은 oklch 해시(${web}), 앱은 HSL 해시(${app}) — 같은 자산이 다른 색이다(지금)`} bg={BASEMENT}>
          <div className="flex flex-col gap-3">
            {board('웹', web)}
            {board('앱', app)}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 이름 옆이면 장식, 혼자면 이름
const NameGuide: Fig = ({ caption }) => {
  const a = ASSETS[0];
  const alone = (named: boolean) => (
    <span className="flex items-center gap-3 rounded-xl px-4 py-3 pk-surface">
      <Logo name="신한" decorative={!named} />
      <span className="text-[12px] pk-muted">혼자인 타일(고르는 칸 · 접힌 메뉴)</span>
    </span>
  );
  return (
    <Panel caption={caption}>
      <Pair stack>
        <Verdict ok note="이름 옆 타일은 숨긴다(첫 글자도, 그림도) — 혼자인 타일은 이름을 가진다" bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <PhoneBoard>
              <Rows rows={[assetRow(a)]} />
            </PhoneBoard>
            <Reading tone="ok">&ldquo;{a.name}, {assetDetail(a)}, {a.balance}, 버튼&rdquo;</Reading>
            {alone(true)}
            <Reading tone="ok">&ldquo;신한, 이미지&rdquo;</Reading>
          </div>
        </Verdict>
        <Verdict ok={false} note='첫 글자를 읽는다 — "신 신한 주거래 통장". 혼자인 타일은 이름이 없다' bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <PhoneBoard>
              <Rows rows={[assetRow(a)]} />
            </PhoneBoard>
            <Reading tone="bad">&ldquo;{avatarInitial('신한')}, {a.name}, {assetDetail(a)}, {a.balance}, 버튼&rdquo;</Reading>
            {alone(false)}
            <Reading tone="bad">&ldquo;이미지&rdquo;</Reading>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — logo-tile.md 의 코드 그대로 ───────
function Preview({ children, caption, w = 360, pad = 16 }: { children: ReactNode; caption?: string; w?: number; pad?: number }) {
  return (
    <figure className="not-prose mb-0 mt-6">
      <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border" style={{ background: rc('bg-layer-default'), paddingTop: pad, paddingBottom: pad, paddingLeft: 8, paddingRight: 8 }}>
        <div className="w-full" style={{ maxWidth: w }}>
          {children}
        </div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExAssetRow: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <Rows rows={[ASSETS[0], ASSETS[2], ASSETS[3], ASSETS[4]].map((a) => assetRow(a))} />
  </Preview>
);
const ExCard: Fig = ({ caption }) => {
  const f = logoFace('삼성카드', 'institution', institutions(), LTL());
  return (
    <Preview caption={caption}>
      <LogoCardDemo look={LTL()} frame={IFL()} list={listLook('desk')} paint={{ bg: f.bg, fg: f.fg }} name="삼성카드" title="삼성카드 데일리" detail="삼성카드 · 신용카드" amount="−352,400원" pic="card-v" />
    </Preview>
  );
};
const ExDetail: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <AssetHead a={ASSETS[0]} />
  </Preview>
);
// HR 회사별 인원 — 회사 로고 32(face name · 흰 판), 로고가 없는 회사는 이름 색 첫 글자. 회사 이름은 h3(제목)
const COMPANIES: { name: string; logo?: 'logo-leaf' | 'logo-word' }[] = [{ name: '숲길', logo: 'logo-leaf' }, { name: '오렌지랩', logo: 'logo-word' }, { name: '새회사' }];
const ExCompany: Fig = ({ caption }) => (
  <Preview caption={caption} w={312}>
    <div className="flex flex-col" style={{ gap: 16 }}>
      {COMPANIES.map((c) => (
        <span key={c.name} className="flex items-center" style={{ gap: 8 }}>
          <Logo size="32" name={c.name} face="name" image="logo" pic={c.logo} state={c.logo ? 'loaded' : 'failed'} />
          <h3 className="m-0 text-[16px] font-bold leading-[22px]" style={{ color: tone('fg-neutral', 'auto', 'hr') }}>
            {c.name}
          </h3>
        </span>
      ))}
    </div>
  </Preview>
);

// 코드 절의 예시 표(이름 → 찾은 기관 · 면 → 글자)가 찾기 함수 · 표 · 대비와 맞는지 — 표는 스펙 md 의 글이라 바뀌면 여기서 멈춘다
function checkCodeTable() {
  const md = readFileSync(join(process.cwd(), '..', 'specs/components/logo-tile.md'), 'utf8');
  const rows = md.split('\n').filter((l) => /^\| (신한|NH농협카드 올원|IBK기업은행|비상금)/.test(l));
  if (rows.length !== 4) throw new Error(`logo-tile.md 코드 절의 예시 표(${rows.length}줄)를 찾지 못했다 — logo-tile.tsx 를 고친다`);
  for (const row of rows) {
    const [name, foundCell, textCell] = row.split('|').slice(1, 4).map((c) => c.trim());
    const n = name.replace(/\(.*$/, '').trim();
    const face = /face="name"/.test(name) ? 'name' : 'institution';
    const f = logoFace(n, face, institutions(), LTL());
    const initial = /"(.)"/.exec(textCell)?.[1];
    if (initial !== avatarInitial(n)) throw new Error(`logo-tile.md 예시 ${n} 의 첫 글자 "${initial}" 가 함수("${avatarInitial(n)}")와 다르다`);
    if (f.found) {
      const e = f.found.inst;
      if (!foundCell.startsWith(e.name) || !foundCell.includes(e.color)) throw new Error(`logo-tile.md 예시 ${n} → ${foundCell} 가 찾은 기관(${e.name} · ${e.color})과 다르다`);
      if (!textCell.includes(crText(e).split(' · 다크 ')[0])) throw new Error(`logo-tile.md 예시 ${n} 의 대비(${textCell})가 잰 값(${crText(e)})과 다르다`);
    } else {
      const m = /이름 색 ([a-z]+)\(코드 포인트 합 % 10 = (\d+)\)/.exec(foundCell);
      if (!m || m[1] !== f.hue || Number(m[2]) !== avatarHueIndex(n)) throw new Error(`logo-tile.md 예시 ${n} 의 이름 색(${foundCell})이 함수(${f.hue} · 합 ${codePointSum(n)})와 다르다`);
    }
  }
}

export const logoTileFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  face: Face,
  'institution-colors': InstitutionColors,
  image: ImageFig,
  loading: Loading,
  'thing-guide': ThingGuide,
  'contrast-guide': ContrastGuide,
  'stroke-guide': StrokeGuide,
  'color-guide': ColorGuide,
  'name-guide': NameGuide,
  'ex-asset-row': ExAssetRow,
  'ex-card': ExCard,
  'ex-detail': ExDetail,
  'ex-company': ExCompany,
};
