// Footer 페이지의 그림 — specs/components/footer.md 의 `[그림: …](../../site/components/specs/footer.tsx#<id>)` 자리.
// 바닥은 footer.yaml 을 푼 값(ftLook — finish-view 의 FooterView)으로 그린다. 그림은 실제 폭(1280 · 768 · 390)으로 그리고 칸 폭에 맞춰 줄인다(Fit).
// 사업자 정보 · 연락처 · 소셜은 값이 없다 — 분홍 점선 자리표시로만 그린다(footer.md "값이 없는 블록은 비워 둔다").
// 나쁜 예(placeholder-guide)의 가짜 값만 지어낸 것이고, 실제 회사 · 사람의 값이 아니다.
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { contrast } from '@/lib/design-tokens';
import { FT_HOME, FT_PLACEHOLDER, HOME_INK3_BEFORE, HOME_SKIN, copyrightText, ftLook } from './finish-look';
import { FooterPlayground } from './finish-play';
import { Fit, FooterView, FtLinkView, MARK, MARK_LINE, type FtBlocks } from './finish-view';
import { Verdict, rc, type Mode } from './kit';
import { Legend, pinAt } from './overlay-screens';
import { Cap } from './select-screens';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const F = () => ftLook();
// 그리는 때의 해(빌드 때) — 저작권의 해는 박아 두지 않는다
const YEAR = new Date().getFullYear();
const HOME: FtBlocks = { ...FT_HOME, divider: true, copyright: { owner: 'POREST', year: YEAR } };

// 페이지 바닥 — 본문 끝(회색 글 줄) 아래에 바닥. 바탕은 페이지 바탕(bg-layer-default)
function PageBottom({ mode = 'auto', width, children, body = true }: { mode?: Mode; width: number; children: ReactNode; body?: boolean }) {
  return (
    <div style={{ width, background: rc('bg-layer-default', mode) }}>
      {body && (
        <div aria-hidden style={{ paddingTop: 24, paddingBottom: 32, paddingLeft: 24, paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1040, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>
          <span style={{ display: 'block', height: 10, width: '62%', borderRadius: 9999, background: rc('bg-neutral-weak', mode) }} />
          <span style={{ display: 'block', height: 10, width: '44%', borderRadius: 9999, background: rc('bg-neutral-weak', mode) }} />
        </div>
      )}
      {children}
    </div>
  );
}
function Shot({ w, children, strong, cap, max = 1 }: { w: number; children: ReactNode; strong?: ReactNode; cap?: ReactNode; max?: number }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-2">
      <div className="w-full overflow-hidden rounded-xl" style={{ maxWidth: w * max }}>
        <Fit w={w} max={max}>
          {children}
        </Fit>
      </div>
      {(strong || cap) && <Cap strong={strong}>{cap}</Cap>}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-6">
      {MODES.map((mode) => (
        <Shot key={mode} w={1280} strong={`${modeKo(mode)} · 1280`}>
          <PageBottom mode={mode} width={1280}>
            <FooterView look={F()} mode={mode} width={1280} blocks={HOME} frozen />
          </PageBottom>
        </Shot>
      ))}
      <div className="grid items-start gap-4 sm:grid-cols-2">
        {MODES.map((mode) => (
          <Shot key={mode} w={390} strong={`${modeKo(mode)} · 390`}>
            <PageBottom mode={mode} width={390}>
              <FooterView look={F()} mode={mode} width={390} blocks={HOME} frozen />
            </PageBottom>
          </Shot>
        ))}
      </div>
    </div>
  </Panel>
);

const Playground: Fig = () => <FooterPlayground look={F()} year={YEAR} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = F();
  const blocks: FtBlocks = { ...HOME, business: FT_PLACEHOLDER.business, contact: FT_PLACEHOLDER.contact, social: 2 };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Shot w={1280}>
          <PageBottom width={1280} body={false}>
            <FooterView
              look={l}
              width={1280}
              blocks={blocks}
              frozen
              pins={{
                brand: pinAt('ⓐ', -26, -4),
                sitemap: pinAt('ⓒ', -26, -4),
                divider: pinAt('ⓓ', -26, -10),
                policy: pinAt('ⓔ', -26, -2),
                business: pinAt('ⓕ', -26, 0),
                copyright: pinAt('ⓖ', -26, 0),
                social: pinAt('ⓗ', -26, 14),
              }}
            />
          </PageBottom>
        </Shot>
        <Legend
          items={[
            ['ⓐ', 'Brand'],
            ['ⓑ', 'Country — 두지 않는다'],
            ['ⓒ', 'Sitemap'],
            ['ⓓ', 'Divider'],
            ['ⓔ', 'Policy Links'],
            ['ⓕ', 'Business Info · Contact(자리)'],
            ['ⓖ', 'Copyright'],
            ['ⓗ', 'Social Links(자리)'],
          ]}
        />
        <span className="text-center text-[12px] pk-muted">탐색 영역(ⓐ ⓑ ⓒ) · 선(ⓓ) · 안내 영역(ⓔ ⓕ ⓖ ⓗ) — 분홍 점선은 값이 없는 자리</span>
      </div>
    </Panel>
  );
};

// ── 틀 ────────────────────────────────────────────────────
// 여백 · 영역 사이를 분홍으로 — 틀(분홍) 위에 블록을 흰 면으로 얹으면 남는 분홍이 위아래 · 좌우 여백과 영역 사이다
function FrameMarks({ width, mode = 'auto', fs = 10 }: { width: number; mode?: Mode; fs?: number }) {
  const l = F();
  const narrow = width < l.breakpoint;
  const px = narrow ? l.root.padXNarrow : l.root.padXWide;
  const bg = rc('bg-layer-default', mode);
  const tag = (t: string, style: CSSProperties) => (
    <span aria-hidden className="pointer-events-none absolute rounded px-1 font-bold text-white" style={{ background: MARK_LINE, zIndex: 5, fontSize: fs, lineHeight: `${fs * 1.5}px`, ...style }}>
      {t}
    </span>
  );
  return (
    <FooterView
      look={l}
      mode={mode}
      width={width}
      blocks={HOME}
      frozen
      marks={{ root: { background: MARK }, navigation: { background: bg }, info: { background: bg } }}
      pins={{
        root: (
          <>
            {tag(`위 ${l.root.padY}`, { top: l.root.padY / 2 - fs * 0.75, left: '50%' })}
            {tag(`아래 ${l.root.padY}`, { bottom: l.root.padY / 2 - fs * 0.75, left: '50%' })}
            {tag(`${px}`, { top: '40%', left: px / 2 - fs })}
            {!narrow && tag(`최대 ${l.root.maxW}`, { top: 4, right: px })}
          </>
        ),
        navigation: tag(`사이 ${l.root.gap}`, { bottom: -(l.root.gap / 2) - fs * 0.75, left: 0 }),
        info: tag(`사이 ${l.root.gap}`, { top: -(l.root.gap / 2) - fs * 0.75, left: 0 }),
      }}
    />
  );
}
const Frame: Fig = ({ caption }) => {
  const l = F();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        <Shot w={1280} strong="1280" cap={`틀 최대 ${l.root.maxW} · 위아래 ${l.root.padY} · 좌우 ${l.root.padXWide} · 영역 사이 ${l.root.gap} · 위 선 ${l.topLine.h}px(화면 폭)`}>
          <FrameMarks width={1280} fs={20} />
        </Shot>
        <Shot w={390} strong="390" cap={`1280 미만 — 좌우 ${l.root.padXNarrow}(화면 가장자리)`}>
          <FrameMarks width={390} />
        </Shot>
      </div>
    </Panel>
  );
};

// ── 탐색 영역 ─────────────────────────────────────────────
const NAV: FtBlocks = { brand: FT_HOME.brand, columns: FT_HOME.columns };
const Navigation: Fig = ({ caption }) => {
  const l = F();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <Shot w={1280} strong="1280 — 한 줄" cap={`브랜드(남은 폭, ${l.brand.basis} 아래로 줄면 사이트맵이 아래로) · 사이 ${l.nav.gap} · 열 최소 ${l.column.minW}`}>
          <FooterView look={l} width={1280} blocks={NAV} topLine={false} frozen />
        </Shot>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <Shot w={768} strong="768 — 아직 한 줄" cap={`좌우 ${l.root.padXNarrow}`}>
            <FooterView look={l} width={768} blocks={NAV} topLine={false} frozen />
          </Shot>
          <Shot w={390} strong="390 — 사이트맵이 브랜드 아래로" cap={`위아래도 ${l.nav.gap}`}>
            <FooterView look={l} width={390} blocks={NAV} topLine={false} frozen />
          </Shot>
        </div>
      </div>
    </Panel>
  );
};

// ── 안내 영역 ─────────────────────────────────────────────
const Info: Fig = ({ caption }) => {
  const l = F();
  const blocks: FtBlocks = { policy: FT_HOME.policy, text: FT_HOME.text, business: FT_PLACEHOLDER.business, contact: FT_PLACEHOLDER.contact, copyright: { owner: 'POREST', year: YEAR }, social: 2 };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        <Shot w={1280} strong="1280" cap={`줄 사이 ${l.info.gap} · 저작권 앞 · 소셜 끝(한 줄 양 끝)`}>
          <FooterView look={l} width={1280} blocks={blocks} topLine={false} frozen />
        </Shot>
        <Shot w={390} strong="390" cap="소셜은 저작권 아래">
          <FooterView look={l} width={390} blocks={blocks} topLine={false} frozen />
        </Shot>
      </div>
    </Panel>
  );
};

// ── Link ──────────────────────────────────────────────────
const LINK_STATES = [
  [undefined, '기본'],
  ['hovered', '올림(웹)'],
  ['pressed', '누름'],
  ['focused', '포커스(키보드)'],
] as const;
const Link: Fig = ({ caption }) => {
  const l = F();
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="overflow-x-auto rounded-xl" style={{ background: rc('bg-layer-default', mode) }}>
        <div className="mx-auto grid w-max items-center gap-x-6 gap-y-4 px-5 py-5" style={{ gridTemplateColumns: 'max-content max-content max-content' }}>
          <span />
          <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>
            large · 사이트맵
          </span>
          <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>
            medium · 정책
          </span>
          {LINK_STATES.map(([st, ko]) => (
            <div key={ko} className="contents">
              <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
                {ko}
              </span>
              <span>
                <FtLinkView look={l} mode={mode} link={{ label: 'Desk 설명서' }} size="large" state={st} frozen />
              </span>
              <span>
                <FtLinkView look={l} mode={mode} link={{ label: '개인정보 처리방침', external: true }} size="medium" state={st} frozen />
              </span>
            </div>
          ))}
          <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
            새 탭 ↗
          </span>
          <span>
            <FtLinkView look={l} mode={mode} link={{ label: 'HR 문서', external: true }} size="large" frozen />
          </span>
          <span className="text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
            ↗ {l.link.large.icon} · {l.link.medium.icon}, 사이 {l.link.gap}
          </span>
        </div>
      </div>
      <Cap strong={modeKo(mode)}>밑줄 없이 글자색만 — large 는 옅게, medium 은 짙게. 포커스는 글 둘레 링 {l.ring.width}px · 띄움 {l.ring.offset}</Cap>
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
// SSO 로그인 아래 · 설명서 바닥 — 나중의 자리. 정책 링크 + 저작권 줄로(그 차례에 정한다)
function LoginStub({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div aria-hidden style={{ paddingTop: 48, paddingBottom: 24, paddingLeft: 24, paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ fontSize: 22, lineHeight: '30px', fontWeight: 700, color: rc('fg-neutral', mode) }}>로그인</span>
      {[0, 1].map((i) => (
        <span key={i} style={{ height: 52, borderRadius: 12, boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak', mode)}` }} />
      ))}
      <span style={{ height: 48, borderRadius: 12, background: rc('bg-neutral-weak', mode) }} />
    </div>
  );
}
const PlacesGuide: Fig = ({ caption }) => {
  const l = F();
  const small: FtBlocks = { policy: FT_HOME.policy, copyright: { owner: 'POREST', year: YEAR } };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <Shot w={1280} strong="porest-home 맨 아래(지금)" cap="7B — 브랜드 · 사이트맵 | 선 | 정책 링크 · 안내 글 · 저작권">
          <PageBottom width={1280}>
            <FooterView look={l} width={1280} blocks={HOME} frozen />
          </PageBottom>
        </Shot>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <Shot w={390} strong="SSO 로그인 아래(나중)" cap="정책 링크 + 저작권 — 그 차례에 정한다">
            <div style={{ width: 390, background: rc('bg-layer-default') }}>
              <LoginStub />
              <FooterView look={l} width={390} blocks={small} frozen />
            </div>
          </Shot>
          <Shot w={768} strong="설명서 · 문서 사이트 바닥(나중)" cap="정책 링크 + 저작권 — 저작권은 지금 바꾼다">
            <PageBottom width={768}>
              <FooterView look={l} width={768} blocks={small} frozen />
            </PageBottom>
          </Shot>
        </div>
      </div>
    </Panel>
  );
};

// 값이 없는 블록 — 자리표시(이렇게) · 그럴듯한 가짜 값(이렇게 하지 않는다 — 실제 회사 · 사람의 값이 아니다)
const FAKE = {
  business: [['주식회사 포레스트', '대표 홍길동', '사업자 등록번호 123-45-67890'], ['서울특별시 중구 세종대로 110']],
  contact: [['고객센터 1588-0000', 'help@example.com']],
};
function FakeSocial({ mode = 'auto' }: { mode?: Mode }) {
  const l = F();
  const s = l.social.button.faces.light.enabled.height;
  return (
    <>
      {['인', '유'].map((t) => (
        <span key={t} aria-hidden style={{ width: s, height: s, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9999, background: rc('bg-neutral-weak', mode), color: rc('fg-neutral', mode), fontSize: 14, fontWeight: 700 }}>
          {t}
        </span>
      ))}
    </>
  );
}
const PlaceholderGuide: Fig = ({ caption }) => {
  const l = F();
  const base: FtBlocks = { policy: FT_HOME.policy, text: FT_HOME.text, copyright: { owner: 'POREST', year: YEAR } };
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Verdict ok note="값이 없으면 블록을 비워 둔다 — 그림 · 예시는 자리표시임이 드러나게(분홍 점선)">
          <Fit w={390}>
            <FooterView look={l} width={390} blocks={{ ...base, business: FT_PLACEHOLDER.business, contact: FT_PLACEHOLDER.contact, social: 2 }} topLine={false} frozen />
          </Fit>
        </Verdict>
        <Verdict ok={false} note="그럴듯한 가짜 상호 · 대표 · 번호 · 주소 · 소셜을 넣기 — 사실처럼 읽힌다(그림의 값도 지어낸 것이다)">
          <Fit w={390}>
            <FooterView look={l} width={390} blocks={{ ...base, business: FAKE.business, contact: FAKE.contact, social: 2 }} topLine={false} frozen slots={false} socialSlot={<FakeSocial />} />
          </Fit>
        </Verdict>
      </div>
    </Panel>
  );
};
const NOW = [
  ['porest-home', '© POREST'],
  ['SSO 로그인', 'Copyright © POREST. All Rights Reserved.'],
  ['HR 문서(VitePress)', '© 2025 POREST. All rights reserved.'],
  ['Desk 설명서(Docusaurus)', 'POREST Desk 사용자 설명서'],
] as const;
const CopyrightGuide: Fig = ({ caption }) => {
  const l = F();
  const c = l.copyright;
  const line = (place: string, text: string) => (
    <div key={place} className="flex flex-col gap-0.5 py-2" style={{ borderBottom: `1px solid ${rc('stroke-neutral-subtle')}` }}>
      <span className="text-[11px]" style={{ color: rc('fg-neutral-subtle') }}>
        {place}
      </span>
      <span style={{ fontFamily: c.text.fontFamily, fontSize: c.text.fontSize, lineHeight: c.text.lineHeight, fontWeight: c.text.fontWeight, color: rc('fg-neutral-muted') }}>{text}</span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Verdict ok={false} note="지금 — 네 곳이 네 벌. 해가 2025 에 멈추고, 사이트 이름이 저작권 자리에 있다">
          <div className="w-full max-w-[320px]">{NOW.map(([p, t]) => line(p, t))}</div>
        </Verdict>
        <Verdict ok note={`바꾼 뒤 — "${c.format}" 한 벌. 해는 그리는 때(빌드 · 화면)의 해`}>
          <div className="w-full max-w-[320px]">{NOW.map(([p]) => line(p, copyrightText(c.format, 'POREST', YEAR)))}</div>
        </Verdict>
      </div>
    </Panel>
  );
};

const ExternalGuide: Fig = ({ caption }) => {
  const l = F();
  const blocks = (all: boolean): FtBlocks => ({
    columns: [{ title: '서비스', links: FT_HOME.columns[0].links.map((x) => ({ ...x, external: all })) }],
    policy: FT_HOME.policy,
  });
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Verdict ok note="새 탭으로 여는 처리방침만 ↗ + 보이지 않는 '(새 탭)'. 같은 탭으로 가는 서비스 링크에는 두지 않는다 · 밑줄 없이 색으로">
          <Fit w={390}>
            <FooterView look={l} width={390} blocks={blocks(false)} topLine={false} frozen />
          </Fit>
        </Verdict>
        <Verdict ok={false} note="모든 링크에 ↗ · 밑줄 — 어디가 새 탭인지 알 수 없고 바닥이 시끄럽다">
          <Fit w={390}>
            <FooterView look={l} width={390} blocks={blocks(true)} topLine={false} frozen underline />
          </Fit>
        </Verdict>
      </div>
    </Panel>
  );
};

const HomeGuide: Fig = ({ caption }) => {
  const l = F();
  const before = contrast(HOME_INK3_BEFORE, HOME_SKIN.bg);
  const after = contrast(HOME_SKIN.ink3, HOME_SKIN.bg);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <Shot w={1280} strong="porest-home · 1280">
            <FooterView look={l} mode="light" width={1280} blocks={HOME} skin={HOME_SKIN} frozen />
          </Shot>
          <Shot w={390} strong="390">
            <FooterView look={l} mode="light" width={390} blocks={HOME} skin={HOME_SKIN} frozen />
          </Shot>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] pk-muted">
          <span>짜임 · 간격 · 글 크기 — 스펙</span>
          <span>색 · 글꼴 — 홈(Noto Sans KR · --ink · --ink2 · --ink3 · --line · 브랜드 글자 --blue)</span>
          <span className="flex items-center gap-1.5">
            안내 글 --ink3
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: HOME_INK3_BEFORE }} />
            {HOME_INK3_BEFORE} {before.toFixed(2)}
            <span aria-hidden>→</span>
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: HOME_SKIN.ink3 }} />
            {HOME_SKIN.ink3} {after.toFixed(2)}(흰 바탕, 4.5 이상)
          </span>
        </div>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExHome: Fig = ({ caption }) => (
  <figure className="not-prose my-6">
    <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-xl">
          <Fit w={1280}>
            <FooterView look={F()} width={1280} blocks={HOME} />
          </Fit>
        </div>
        <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-xl">
          <Fit w={390}>
            <FooterView look={F()} width={390} blocks={HOME} />
          </Fit>
        </div>
      </div>
    </div>
    {caption && <figcaption className="sr-only">{caption}</figcaption>}
  </figure>
);

export const footerFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  frame: Frame,
  navigation: Navigation,
  info: Info,
  link: Link,
  'places-guide': PlacesGuide,
  'placeholder-guide': PlaceholderGuide,
  'copyright-guide': CopyrightGuide,
  'external-guide': ExternalGuide,
  'home-guide': HomeGuide,
  'ex-home': ExHome,
};
