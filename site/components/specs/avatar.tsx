// Avatar 페이지의 그림 — specs/components/avatar.md 의 `[그림: …](../../site/components/specs/avatar.tsx#<id>)` 자리.
// 아바타는 avatar.yaml(display-look 의 avatarLook), 묶음은 avatar-stack.yaml(stackLook), 배지 · 메타 줄은 badge · tag-group.yaml,
// 목록 줄은 list.yaml(ListView)로 그린다. 사진은 실제 사람이 아니라 칠한 그림이다. 이름 색은 이름의 코드 포인트 합 % 10(웹 · 앱 한 규칙).
import type { ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { axisDesc, loadComponentSpec } from '@/lib/component-spec';
import { contrast } from '@/lib/design-tokens';
import { AVATAR_SIZES, avatarHue, avatarHueIndex, avatarInitial, codePointSum, stackFit, stackWidth, type AvatarSize } from './display-look';
import { AvatarPlayground } from './display-playground';
import { AvatarStackView, AvatarView, DIcon, Reading } from './display-view';
import {
  A,
  B,
  Board,
  CalendarShareScreen,
  DUTCH,
  DutchScreen,
  DutchSummary,
  HrTeamScreen,
  Muted,
  Pair,
  Pin,
  Preview,
  Rows,
  S,
  SIX,
  T,
  W,
  dk,
  items,
  markBox,
  modeKo,
  PhoneBoard,
  tone,
} from './display-screens';
import { Cap } from './select-screens';
import { Logo } from './image-screens';
import { Verdict, rc, type Mode } from './kit';
import { avEditLook, icv } from './finish-look';
import { PhotoEditLive } from './finish-play';
import { AvatarEditView } from './finish-view';
import { buttonLook } from './button-look';
import { overlayLook } from './overlay-look';
import { EndButtons } from './overlay-view';
import { textFieldLook } from './text-field-look';
import { TfFieldView, TfInputView } from './text-field-view';

type Fig = (p: { caption?: string }) => ReactNode;
const al = (brand: 'desk' | 'hr' = 'desk') => dk(brand).avatar;
const sl = (brand: 'desk' | 'hr' = 'desk') => dk(brand).stack;
// 이름 색 10 — 나머지 0 ~ 9 마다 그 색이 나오는 이름(코드 포인트 합 % 10)
const HUE_NAMES = ['김민수', '박지훈', '한지우', '강도윤', '윤재현', '정유나', '조하은', '정하늘', '이서연', '홍채원'];

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <DutchScreen mode={mode} scale={0.5} h={520} />
          <CalendarShareScreen mode={mode} scale={0.5} h={520} />
          <HrTeamScreen mode={mode} scale={0.5} h={520} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <AvatarPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = al();
  const z = 2;
  const size: AvatarSize = '56';
  const d = lk.sizes[size].d * z;
  const ringSize: AvatarSize = '36';
  const ring = sl().sizes[ringSize];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-10 pb-8 pt-14">
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12">
          <span className="relative inline-flex">
            <AvatarView look={lk} size={size} name="김민수" zoom={z} zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 5 }, initial: markBox }} pins={{ root: <Pin n="ⓐ" style={{ left: -28, top: -18 }} />, initial: <Pin n="ⓒ" style={{ right: -26, top: -26 }} /> }} />
          </span>
          <span className="relative inline-flex">
            <AvatarView look={lk} size={size} name="서다은" photo={3} zoom={z} pins={{ image: <Pin n="ⓑ" style={{ left: d / 2 - 10, top: -30 }} />, border: <Pin n="ⓓ" style={{ right: -30, top: d / 2 - 10 }} /> }} />
          </span>
          <span className="relative inline-flex flex-col items-center gap-3">
            <AvatarStackView look={lk} stack={sl()} size={ringSize} zoom={z} people={SIX.slice(0, 3)} marks={{ overlap: { background: MARK, outline: `1px dashed ${MARK_LINE}` } }} />
            <span className="text-[11px] font-bold leading-4" style={{ color: MARK_LINE }}>
              겹침 {ring.overlap} · 바탕색 링 {ring.ring}(2배)
            </span>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Image'],
            ['ⓒ', 'Initial'],
            ['ⓓ', 'Border'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
        <span className="max-w-[560px] text-center text-[12px] leading-4 pk-muted">
          {lk.sizes[size].d} 을 2배로 그렸다 — 흰 배경 사진도 1px 안쪽 테두리({lk.border.width}px)가 바탕과 가른다. 묶음은 지름의 약 1/4 을 겹치고, 놓인 바탕색 링으로 앞 아바타를 끊는다(뒤가 위)
        </span>
      </div>
    </Figure>
  );
};

// ── Size ──────────────────────────────────────────────────
// avatar.yaml 의 자리 설명 — "36 — 댓글(SEED). groo 한 줄 목록 줄(…)" 에서 SEED 자리와 groo 자리
function places(size: AvatarSize) {
  const desc = axisDesc(loadComponentSpec('avatar'), 'size', size) ?? '';
  const seed = /—\s*([^(.]+)\(SEED\)/.exec(desc)?.[1]?.trim();
  const groo = /groo\s+([^(]+)/.exec(desc)?.[1]?.trim().replace(/\.$/, '');
  return { seed, groo };
}
const Size: Fig = ({ caption }) => {
  const lk = al();
  return (
    <Panel caption={caption}>
      <Board className="overflow-x-auto">
        <div className="flex flex-wrap items-end justify-center gap-x-5 gap-y-6">
          {AVATAR_SIZES.map((s) => {
            const p = places(s);
            return (
              <div key={s} className="flex w-[104px] flex-col items-center gap-1.5 text-center">
                <AvatarView look={lk} size={s} name="김민수" />
                <b className="text-[13px] tabular-nums pk-text">
                  {s}
                  {s === lk.defaultSize && <span className="font-normal pk-muted"> (기본)</span>}
                </b>
                <span className="text-[11px] leading-4 pk-muted">글자 {lk.sizes[s].font}</span>
                <span className="text-[11px] leading-4 pk-text">{p.groo}</span>
                {p.seed && <span className="text-[11px] leading-4 pk-muted">SEED {p.seed}</span>}
              </div>
            );
          })}
        </div>
      </Board>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">이니셜 글자는 지름의 40%(가장 작아도 10) · 굵기 {lk.initial.weight} · 모든 크기에 1px 안쪽 테두리. 이 밖의 크기를 만들지 않는다</p>
    </Panel>
  );
};

// ── 사진 · 이니셜 ─────────────────────────────────────────
const Initial: Fig = ({ caption }) => {
  const lk = al();
  const panel = (mode: 'light' | 'dark') => {
    const ratios = lk.order.map((h) => contrast(mode === 'dark' ? lk.initial.fg.dark : lk.initial.fg.light, mode === 'dark' ? lk.hues[h].dark : lk.hues[h].light));
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <Board mode={mode} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Muted mode={mode}>사진이 있으면 사진</Muted>
            <span className="flex gap-3">
              {[0, 1, 2].map((n) => (
                <A key={n} name={HUE_NAMES[n]} size="48" photo={n} mode={mode} />
              ))}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Muted mode={mode}>없으면 이니셜 + 이름 색 — 코드 포인트 합 % 10 → 차트 10색</Muted>
            <div className="grid grid-cols-5 gap-x-2 gap-y-3">
              {lk.order.map((h, i) => (
                <span key={h} className="flex flex-col items-center gap-1 text-center">
                  <A name={HUE_NAMES[i]} size="36" mode={mode} />
                  <span className="text-[11px] leading-[14px]" style={{ color: tone('fg-neutral', mode) }}>
                    {i} {h}
                  </span>
                  <span className="text-[10px] leading-[14px] tabular-nums" style={{ color: tone('fg-neutral-subtle', mode) }}>
                    {ratios[i].toFixed(2)}:1
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Board>
        <Cap strong={modeKo(mode)}>
          이니셜 fg-neutral-inverted({mode === 'light' ? '흰' : '짙은'} 글자) — 차트 색 위 {Math.min(...ratios).toFixed(2)} ~ {Math.max(...ratios).toFixed(2)}:1
        </Cap>
      </div>
    );
  };
  const worked = ['김민수', '이서연', 'Kim Minsu'];
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {panel('light')}
        {panel('dark')}
      </div>
      <Board className="mt-4 overflow-x-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {worked.map((n) => (
            <span key={n} className="flex items-center gap-3">
              <A name={n} size="42" />
              <span className="flex flex-col text-[12px] leading-[17px]">
                <b className="pk-text">{n}</b>
                <span className="tabular-nums pk-muted">
                  합 {codePointSum(n).toLocaleString('ko-KR')} · % 10 = {avatarHueIndex(n)}
                </span>
                <span className="pk-muted">
                  {avatarHue(n, lk.order)} · &ldquo;{avatarInitial(n)}&rdquo;
                </span>
              </span>
            </span>
          ))}
        </div>
      </Board>
    </Panel>
  );
};

// ── Avatar Stack ──────────────────────────────────────────
const Stack: Fig = ({ caption }) => {
  const lk = al();
  const st = sl();
  const big: AvatarSize = '24';
  const z = 3;
  const g = st.sizes[big];
  return (
    <Panel caption={caption}>
      <div className="grid gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[220px] flex-col items-center justify-center gap-4 overflow-x-auto">
            <AvatarStackView look={lk} stack={st} size={big} zoom={z} people={SIX} marks={{ overlap: { background: MARK, outline: `1px dashed ${MARK_LINE}` } }} />
            <span className="text-center text-[11px] font-bold leading-4" style={{ color: MARK_LINE }}>
              {big} 을 3배로 — 겹침 {g.overlap}(분홍) · 링 {g.ring} · 뒤가 위 · 앞 {st.max}명 + &ldquo;+{SIX.length - st.max}&rdquo;
            </span>
          </Board>
          <Cap strong="겹침 · 링 · 넘침">다음 아바타가 지름의 약 1/4 왼쪽으로 겹치고, 바탕색 링이 앞 아바타를 끊는다</Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="overflow-x-auto">
            <div className="flex flex-col gap-3">
              {AVATAR_SIZES.map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <span className="w-[112px] shrink-0 text-[11px] leading-4 tabular-nums pk-muted">
                    <b className="pk-text">{s}</b> 겹침 {st.sizes[s].overlap} · 링 {st.sizes[s].ring} · 글자 {st.sizes[s].plusFont}
                  </span>
                  <AvatarStackView look={lk} stack={st} size={s} people={SIX} />
                </div>
              ))}
            </div>
          </Board>
          <Cap strong="크기마다">크기는 묶음이 정하고 안의 아바타가 모두 따른다 — &ldquo;+N&rdquo; 도 같은 크기 · 같은 링</Cap>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(['default', 'floating'] as const).map((surface) => (
          <div key={surface} className="flex min-w-0 flex-col gap-2">
            <Board mode="dark" bg={surface === 'floating' ? 'bg-layer-floating' : 'bg-layer-default'} className="flex items-center justify-center">
              <AvatarStackView look={lk} stack={st} size="36" people={SIX} mode="dark" surface={surface} />
            </Board>
            <Cap strong={surface === 'floating' ? '시트 · 대화상자 안 — 링 bg-layer-floating' : '화면 위 — 링 bg-layer-default'}>다크 — 두 바탕이 달라 링도 그 바탕색이다</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 사람은 원 아바타 · 물건은 각진 타일
const ThingGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="사람(공유 멤버)은 원 아바타, 자산은 로고 타일 · 카테고리는 List 타일 — 둘 다 각진 타일">
        <PhoneBoard>
          <Rows
            rows={[
              { kind: 'view', prefix: { person: '김민수' }, title: '김민수' },
              { kind: 'view', prefix: { person: '이서연' }, title: '이서연' },
              { kind: 'button', prefix: { node: <Logo name="현대카드" /> }, title: '현대카드 M', detailNode: <T items={items('신용', '결제일 14일')} size="t3" truncate />, suffix: { chevron: true } },
              { kind: 'button', prefix: { tile: 'orange', icon: 'utensils' }, title: '식비', detailNode: <T items={items('이번 달', '12건')} size="t3" truncate />, suffix: { chevron: true } },
            ]}
          />
        </PhoneBoard>
      </Verdict>
      <Verdict ok={false} note="카드 · 카테고리를 원 아바타로 — 사람과 물건이 한 모양이 된다">
        <PhoneBoard>
          <Rows
            rows={[
              { kind: 'view', prefix: { person: '김민수' }, title: '김민수' },
              { kind: 'view', prefix: { person: '이서연' }, title: '이서연' },
              { kind: 'button', prefix: { person: '현대카드 M' }, title: '현대카드 M', detailNode: <T items={items('신용', '결제일 14일')} size="t3" truncate />, suffix: { chevron: true } },
              { kind: 'button', prefix: { person: '식비' }, title: '식비', detailNode: <T items={items('이번 달', '12건')} size="t3" truncate />, suffix: { chevron: true } },
            ]}
          />
        </PhoneBoard>
      </Verdict>
    </Pair>
  </Panel>
);

// 사람 줄(그림 조각) — 아바타 크기를 바꿔 그리는 나쁜 예를 위해 줄을 직접 그린다(여백 · 글자는 list.yaml 의 줄과 같은 자리)
function PersonLine({ name, size, zoom = 1, right }: { name: string; size: AvatarSize; zoom?: number; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <AvatarView look={al()} size={size} name={name} zoom={zoom} />
      <span className="min-w-0 flex-1 truncate text-[16px] leading-[22px] pk-text">{name}</span>
      {right}
    </div>
  );
}
const SizeGuide: Fig = ({ caption }) => {
  const people = DUTCH.map((d) => d.p.name);
  const d36 = al().sizes['36'].d;
  const mixed = [28, 32, 36, 40];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="한 줄 목록은 36 — 같은 자리는 어느 화면에서나 같은 크기">
          <W w={300}>
            {people.map((n) => (
              <PersonLine key={n} name={n} size="36" right={<span className="text-[15px] font-bold tabular-nums pk-text">103,000원</span>} />
            ))}
          </W>
        </Verdict>
        <Verdict ok={false} note="한 화면에 28 · 32 · 36 · 40 — 10단계 밖의 크기가 섞였다">
          <W w={300}>
            {people.map((n, i) => (
              <PersonLine key={n} name={n} size="36" zoom={mixed[i] / d36} right={<span className="text-[15px] font-bold tabular-nums pk-text">103,000원</span>} />
            ))}
          </W>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 이름 옆이면 장식, 혼자면 이름
function Sidebar({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div className="flex w-[64px] flex-col items-center gap-4 rounded-xl py-4" style={{ background: tone('bg-layer-default', mode) }}>
      <span className="text-[13px] font-bold" style={{ color: tone('fg-brand', mode) }}>
        P
      </span>
      {(['house', 'calendar', 'wallet'] as const).map((i) => (
        <DIcon key={i} name={i} size={20} color={tone('fg-neutral-subtle', mode)} />
      ))}
      <span className="mt-6">
        <A name="김민수" size="36" decorative={false} />
      </span>
    </div>
  );
}
const NameGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="이름 옆 아바타는 숨기고(이름을 한 번만), 혼자인 아바타는 이름을 가진다">
        <div className="flex flex-col items-center gap-3">
          <W w={260}>
            <PersonLine name="김민수" size="36" />
          </W>
          <Reading tone="ok">&ldquo;김민수&rdquo;</Reading>
          <div className="flex items-end gap-3">
            <Sidebar />
            <Reading tone="ok">&ldquo;김민수, 이미지&rdquo;</Reading>
          </div>
        </div>
      </Verdict>
      <Verdict ok={false} note='이름 옆 아바타를 읽는다 — "김 김민수". 혼자인 아바타는 이름이 없어 무엇인지 모른다'>
        <div className="flex flex-col items-center gap-3">
          <W w={260}>
            <PersonLine name="김민수" size="36" />
          </W>
          <Reading tone="bad">&ldquo;김, 김민수&rdquo;</Reading>
          <div className="flex items-end gap-3">
            <Sidebar />
            <Reading tone="bad">&ldquo;이미지&rdquo;</Reading>
          </div>
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// 같은 사람은 같은 색, 흐리게 하지 않는다 — 웹 · 앱 두 화면
function PaidRows({ app = false, bad = false }: { app?: boolean; bad?: boolean }) {
  const lk = al();
  const crew: { name: string; paid: boolean }[] = [
    { name: '김민수', paid: true },
    { name: '이서연', paid: false },
    { name: '박지훈', paid: true },
  ];
  return (
    <div className="flex flex-col">
      {crew.map(({ name, paid }, i) => {
        // 나쁜 예 — 앱이 다른 해시를 써 색이 갈린다(지금 앱의 h·31 + c 처럼 다른 순서)
        const wrong = bad && app ? rc(`chart-${lk.order[(avatarHueIndex(name) + 3 + i) % 10]}`) : undefined;
        return (
          <div key={name} className="flex items-center gap-3 py-2">
            <AvatarView look={lk} size="36" name={name} paint={{ bg: wrong, opacity: bad && !paid ? 0.5 : undefined }} />
            <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[15px] leading-5 pk-text">
              <span className="truncate">{name}</span>
              {!bad && paid && <B l="완료" t="positive" />}
            </span>
          </div>
        );
      })}
    </div>
  );
}
const ColorGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="웹 · 앱이 한 해시 · 한 순서 — 같은 이름은 같은 색. 낸 사람은 배지로 알리고 아바타는 그대로">
        <div className="grid w-full max-w-[340px] grid-cols-1 gap-3 sm:grid-cols-2">
          {['웹', '앱'].map((p, i) => (
            <Board key={p} pad={12}>
              <Muted>{p}</Muted>
              <PaidRows app={i === 1} />
            </Board>
          ))}
        </div>
      </Verdict>
      <Verdict ok={false} note="앱이 다른 해시를 써 같은 사람이 다른 색 · 안 낸 사람을 불투명도로 흐렸다">
        <div className="grid w-full max-w-[340px] grid-cols-1 gap-3 sm:grid-cols-2">
          {['웹', '앱'].map((p, i) => (
            <Board key={p} pad={12}>
              <Muted>{p}</Muted>
              <PaidRows app={i === 1} bad />
            </Board>
          ))}
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// 묶음은 넷까지 + "+N", 옆에 전체 수
function TripLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <span className="text-[16px] leading-[22px] pk-text">제주 여행</span>
      {children}
    </div>
  );
}
const StackGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note='앞 4명 + "+2" — 옆의 "6명" 이 수를 말하므로 묶음은 장식이다'>
        <W w={280}>
          <TripLine>
            <DutchSummary />
          </TripLine>
        </W>
      </Verdict>
      <Verdict ok={false} note="여섯을 모두 겹치고 수가 없다 — 줄이 길어지고 몇 명인지 세어야 안다">
        <W w={280}>
          <TripLine>
            <span className="flex items-center gap-2">
              <S people={SIX} size="24" max={6} />
              <T items={items('412,000원')} size="t3" />
            </span>
          </TripLine>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// 폭에 맞춘 묶음 — 큰 묶음이 놓인 폭보다 넓으면 보이는 사람 수를 줄이고 "+N" 이 커진다(2026-10-17 사용자 결정 — 03-E 결정 4 B).
// 폰 폭 360 의 안쪽 312. 몇 명이 보이는지는 stackFit(avatar-stack.yaml root.overflow 의 셈)이 정한다
const FIT_W = 312;
function FitCase({ size, fit }: { size: AvatarSize; fit: boolean }) {
  const lk = al();
  const st = sl();
  const d = lk.sizes[size].d;
  const ov = st.sizes[size].overlap;
  const shown = fit ? stackFit(SIX.length, d, ov, FIT_W, st.max) : Math.min(SIX.length, st.max);
  const circles = shown + (SIX.length > shown ? 1 : 0);
  const w = stackWidth(circles, d, ov);
  return (
    <div className="flex flex-col gap-1.5">
      <div className={fit ? '' : 'overflow-hidden'}>
        <AvatarStackView look={lk} stack={st} size={size} people={SIX} fitWidth={fit ? FIT_W : undefined} />
      </div>
      <Muted>
        {size} · {SIX.length}명 → {shown}명{SIX.length > shown ? ` + "+${SIX.length - shown}"` : ''} · 폭 {w}
        {w > FIT_W ? ` — ${w - FIT_W} 넘침` : ''}
      </Muted>
    </div>
  );
}
const StackFit: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note={`놓인 폭(${FIT_W})에 드는 만큼만 보이고 나머지는 "+N" — 크기는 그대로. 24 · 48 처럼 폭 안에 들면 앞 4명 + "+N" 그대로`}>
        <W w={FIT_W}>
          <div className="flex flex-col gap-4">
            <FitCase size="108" fit />
            <FitCase size="48" fit />
          </div>
        </W>
      </Verdict>
      <Verdict ok={false} note={`폭을 보지 않고 늘 앞 4명 — 108 묶음이 폰 폭을 넘어 넷째 사람과 "+2" 가 화면 밖으로 나간다`}>
        <W w={FIT_W}>
          <FitCase size="108" fit={false} />
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 예시(미리보기) — avatar.md 의 코드 그대로 ─────────
const ExRow: Fig = ({ caption }) => (
  <Preview caption={caption} w={280}>
    <div className="flex flex-col gap-3">
      {DUTCH.slice(0, 3).map(({ p }) => (
        <span key={p.name} className="flex items-center gap-3 text-[16px] leading-[22px] pk-text">
          <A name={p.name} size="36" />
          <span>{p.name}</span>
        </span>
      ))}
    </div>
  </Preview>
);
const ExAlone: Fig = ({ caption }) => (
  <Preview caption={caption} w={280}>
    <div className="flex items-center justify-center gap-8">
      <A name="김민수" size="36" decorative={false} />
      <A name="서다은" size="96" photo={1} decorative={false} brand="hr" />
    </div>
  </Preview>
);
const ExStack: Fig = ({ caption }) => (
  <Preview caption={caption} w={280}>
    <span className="flex items-center gap-2 text-[14px] leading-[19px] pk-text">
      <S people={SIX} size="24" />
      <span>{SIX.length}명 · 412,000원</span>
    </span>
  </Preview>
);

// ── 사진 바꾸기 — 늘 보이는 버튼(avatar.yaml edit photo · uploading) ──
const editErr = (mode: Mode) => {
  const e = textFieldLook('hr').field.error;
  return { color: icv(e.color, mode), text: { fontFamily: e.text.fontFamily, fontSize: e.text.fontSize, lineHeight: e.text.lineHeight, fontWeight: e.text.fontWeight }, icon: e.icon, iconGap: e.iconGap };
};
const PhotoGuide: Fig = ({ caption }) => {
  const av = al('hr');
  const ed = avEditLook('hr');
  const cells: { strong: string; cap: string; props: Partial<Parameters<typeof AvatarEditView>[0]> }[] = [
    { strong: '사진 있음', cap: `${ed.change.label} · ${ed.remove.label} — 아래 ${ed.marginTop} · 사이 ${ed.gap}`, props: { photo: 1 } },
    { strong: '올리는 중', cap: `딤 + 값 있는 원 ${ed.progress} · 두 버튼 막힘`, props: { photo: 1, progress: 0.4 } },
    { strong: '실패', cap: '그 자리 오류 글 — 성공은 따로 알리지 않는다', props: { photo: 1, error: '5MB 넘는 사진은 올릴 수 없어요.' } },
    { strong: '사진 없음', cap: `이니셜 + "${ed.change.label}" 하나`, props: {} },
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col gap-2">
            <div className="grid gap-6 rounded-xl p-5 sm:grid-cols-2" style={{ background: rc('bg-layer-floating', mode) }}>
              {cells.map((c) => (
                <div key={c.strong} className="flex flex-col items-center gap-3">
                  <AvatarEditView avatar={av} edit={ed} mode={mode} name="한지우" frozen errorStyle={editErr(mode)} {...c.props} />
                  <span className="text-center text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
                    <b style={{ color: rc('fg-neutral', mode) }}>{c.strong}</b>
                    <br />
                    {c.cap}
                  </span>
                </div>
              ))}
            </div>
            <Cap strong={mode === 'light' ? '라이트' : '다크'}>HR 사용자 수정 대화상자(떠 있는 면) — 108, 마우스를 올려야 나타나는 덮개를 두지 않는다</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};
const ExPhoto: Fig = ({ caption }) => {
  const o = overlayLook('hr');
  const tf = textFieldLook('hr');
  const s = o.dialog.footer.button.size;
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6" style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
        <PhotoEditLive
          avatar={al('hr')}
          edit={avEditLook('hr')}
          field={tf.field}
          name="한지우"
          photo={1}
          dialog={o.dialog}
          footer={
            <EndButtons
              items={[
                { label: '취소', look: buttonLook({ variant: 'neutralWeak', size: s }, 'hr') },
                { label: '저장', look: buttonLook({ variant: 'brandSolid', size: s }, 'hr') },
              ]}
            />
          }
        >
          <TfFieldView look={tf.field} label="이름">
            <TfInputView look={tf.input} size="medium" state="enabled" value="한지우" />
          </TfFieldView>
          <TfFieldView look={tf.field} label="이메일">
            <TfInputView look={tf.input} size="medium" state="enabled" value="jiwoo.han@example.com" />
          </TfFieldView>
        </PhotoEditLive>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
};

export const avatarFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  initial: Initial,
  stack: Stack,
  'thing-guide': ThingGuide,
  'size-guide': SizeGuide,
  'name-guide': NameGuide,
  'color-guide': ColorGuide,
  'stack-guide': StackGuide,
  'stack-fit': StackFit,
  'ex-row': ExRow,
  'ex-alone': ExAlone,
  'ex-stack': ExStack,
  'photo-guide': PhotoGuide,
  'ex-photo': ExPhoto,
};
