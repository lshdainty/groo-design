// Page Banner 페이지의 그림 — specs/components/page-banner.md 의 `[그림: …](../../site/components/specs/page-banner.tsx#<id>)` 자리.
// 띠는 page-banner.yaml 을 푼 값(pageBannerLook)으로, 같이 나오는 Callout · Snackbar 는 각자의 YAML 로 그린다.
// 띠는 늘 화면 폭 전체다 — 폰 화면(360) · 데스크톱 창 안에서 페이지 머리 바로 아래에 둔다.
import type { ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { calloutLook, pageBannerLook, snackbarLook, type FbTone, type PageBannerLook } from './feedback-look';
import { BannerDismissDemo, BannerDisplayDemo } from './feedback-demos';
import { PageBannerPlayground } from './feedback-playground';
import { Band, Legend, Muted, Pin, StockRows, markBox, type Fig } from './feedback-screens';
import { CalloutView, PageBannerView, type PageBannerViewProps } from './feedback-view';
import { Line, Phone, Verdict, WebWindow, rc, type Mode } from './kit';
import { Cap } from './select-screens';

const bl = (brand: 'desk' | 'hr' = 'desk') => pageBannerLook(brand);
const px = (v: string) => parseFloat(v);

// 멈춘 띠 하나 — 수치 · 색은 pageBannerLook 에서
function B(p: Omit<PageBannerViewProps, 'look' | 'state'> & { state?: PageBannerViewProps['state']; look?: PageBannerLook }) {
  const { state = 'enabled', look, ...rest } = p;
  return <PageBannerView look={look ?? bl()} state={state} {...rest} />;
}

// 비교 페이지에서 고른 그대로의 글(2026-10-02)
const DISCONNECTED = { tone: 'critical' as const, title: '연결 끊김', description: '증권 연결 키가 만료돼 시세를 받지 못해요.', button: { label: '다시 연결' } };
const EXPIRING = { tone: 'warning' as const, variant: 'solid' as const, title: '곧 만료', description: 'Pro 이용이 10월 31일에 끝나요.', button: { label: '구독 보기' } };
const NEW_VERSION = { tone: 'informative' as const, description: '새 버전 1.24.0을 받을 수 있어요.', button: { label: '업데이트' } };

// 폰 — 머리 바로 아래 띠, 그 아래 본문
function BannerPhone({ mode, title, banner, children, scale = 0.65, h = 560, tabs = true }: { mode: Mode; title: string; banner?: ReactNode; children?: ReactNode; scale?: number; h?: number; tabs?: boolean }) {
  return (
    <Phone title={title} back={false} mode={mode} scale={scale} h={h} bg="bg-layer-default" tabs={tabs}>
      {banner}
      <div className="flex flex-col px-6 pt-1">{children}</div>
    </Phone>
  );
}
function SettingRows({ mode }: { mode: Mode }) {
  return (
    <>
      {['구독 · Pro', '알림', '화면 · 글자', '데이터 내보내기'].map((t) => (
        <div key={t} className="flex h-[52px] items-center text-[15px]" style={{ color: rc('fg-neutral', mode) }}>
          {t}
        </div>
      ))}
    </>
  );
}
// Desk 웹 — 앱 막대 아래 띠(데스크톱도 화면 폭 · 좌우 24)
function DeskWeb({ mode, banner, w = 580 }: { mode: Mode; banner: ReactNode; w?: number }) {
  return (
    <WebWindow mode={mode} w={w} h={300} url="desk.groo.app">
      <div className="flex h-full flex-col" style={{ background: rc('bg-layer-default', mode) }}>
        <div className="flex h-12 shrink-0 items-center gap-6 px-6 text-[13px]" style={{ color: rc('fg-neutral-subtle', mode), boxShadow: `inset 0 -1px 0 ${rc('stroke-neutral-weak', mode)}` }}>
          <b className="text-[15px]" style={{ color: rc('fg-neutral', mode) }}>
            그루 담다
          </b>
          <span style={{ color: rc('fg-neutral', mode) }}>대시보드</span>
          <span>가계부</span>
          <span>자산</span>
          <span>캘린더</span>
        </div>
        {banner}
        <div className="flex flex-col gap-3 px-6 pt-5">
          <span className="text-[20px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
            대시보드
          </span>
          <Line w="70%" mode={mode} />
          <Line w="45%" mode={mode} />
        </div>
      </div>
    </WebWindow>
  );
}

// ── Overview ──────────────────────────────────────────────
// 증권 연결 끊김(옅은 위험 + 다시 연결) · Pro 만료 예정(짙은 주의 + 구독 보기) — 라이트 · 다크, 데스크톱 웹의 새 버전
const Hero: Fig = ({ caption }) => {
  const row = (mode: 'light' | 'dark') => (
    <div className="flex items-start gap-4">
      <BannerPhone mode={mode} title="증권" banner={<B mode={mode} {...DISCONNECTED} />}>
        <StockRows mode={mode} />
      </BannerPhone>
      <BannerPhone mode={mode} title="설정" banner={<B mode={mode} {...EXPIRING} />}>
        <SettingRows mode={mode} />
      </BannerPhone>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {row('light')}
        {row('dark')}
        <DeskWeb mode="light" banner={<B {...NEW_VERSION} mode="light" />} />
      </div>
    </Figure>
  );
};

const Playground: Fig = () => <PageBannerPlayground looks={{ desk: bl('desk'), hr: bl('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
function zoomed(l: PageBannerLook, k: number): PageBannerLook {
  const t = <T extends { fontSize: string; lineHeight: string }>(x: T): T => ({ ...x, fontSize: `${px(x.fontSize) * k}px`, lineHeight: `${px(x.lineHeight) * k}px` });
  return {
    ...l,
    root: { minHeight: l.root.minHeight * k, padX: l.root.padX * k, padY: l.root.padY * k, gap: l.root.gap * k, radius: l.root.radius * k },
    icon: { size: l.icon.size * k, marginTop: l.icon.marginTop * k },
    content: { ...l.content, gap: l.content.gap * k },
    title: t(l.title),
    description: t(l.description),
    button: { ...t(l.button), pad: l.button.pad * k, targetH: l.button.targetH * k },
    suffixIcon: l.suffixIcon * k,
    close: { ...l.close, size: l.close.size * k, icon: l.close.icon * k, margin: l.close.margin * k, radius: l.close.radius * k },
  };
}
const K = 1.5;
const Anatomy: Fig = ({ caption }) => {
  const z = zoomed(bl(), K);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-12 pb-8 pt-16">
        <div style={{ width: 500 }}>
          <B
            look={z}
            {...DISCONNECTED}
            zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 }, icon: markBox, title: markBox, description: markBox, button: markBox }}
            pins={{ root: <Pin n="ⓐ" />, icon: <Pin n="ⓑ" />, title: <Pin n="ⓒ" />, description: <Pin n="ⓓ" />, button: <Pin n="ⓔ" /> }}
            pinLine={MARK_LINE}
          />
        </div>
        <div className="flex w-[500px] flex-col gap-10 pt-8">
          <B tone="neutral" interaction="actionable" description="증권 계좌를 연결하면 보유 주식이 자산에 더해져요." zone={{ suffix: markBox }} pins={{ suffix: <Pin n="ⓕ" /> }} pinLine={MARK_LINE} />
          <B tone="informative" interaction="dismissible" title="새 기능" description="반복 거래를 자동으로 기록할 수 있어요." zone={{ close: markBox }} pins={{ close: <Pin n="ⓕ" /> }} pinLine={MARK_LINE} />
        </div>
        <Legend
          items={[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Icon'],
            ['ⓒ', 'Title'],
            ['ⓓ', 'Description'],
            ['ⓔ', 'Button'],
            ['ⓕ', 'Chevron · Close'],
          ]}
        />
        <span className="max-w-[480px] text-center text-[12px] leading-5 pk-muted">위는 1.5배 — 본문과 버튼이 한 줄에 안 들어가 버튼이 다음 줄로 내려갔다. 아래는 실제 크기 — 띠 전체를 누르는 띠의 뒤 화살표, 닫을 수 있는 띠의 닫기</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 띠의 여백 — 데스크톱(한 줄 — 버튼은 오른쪽 끝) · 폰(버튼이 다음 줄 본문 시작선으로) · 닫기
const Layout: Fig = ({ caption }) => {
  const l = bl();
  const tag = (s: string) => <span className="text-[12px] font-bold pk-text">{s}</span>;
  return (
    <Figure caption={caption}>
      <div className="flex w-[550px] flex-col gap-7 rounded-xl pk-surface px-6 py-8">
        <div className="flex flex-col gap-2">
          {tag('데스크톱 — 한 줄에 양 끝')}
          <div className="relative" style={{ width: 500 }}>
            <B {...DISCONNECTED} zone={{ button: markBox }} />
            <Band style={{ left: 0, top: 0, bottom: 0, width: l.root.padX }} label={String(l.root.padX)} />
            <Band style={{ right: 0, top: 0, bottom: 0, width: l.root.padX }} />
            <Band style={{ left: l.root.padX, right: l.root.padX, top: 0, height: l.root.padY }} label={String(l.root.padY)} />
            <Band style={{ left: l.root.padX + l.icon.size, top: l.root.padY, width: l.root.gap, height: px(l.description.lineHeight) }} label={String(l.root.gap)} below />
            <span aria-hidden className="absolute flex items-center" style={{ left: '100%', top: 0, bottom: 0, marginLeft: 6 }}>
              <span style={{ width: 1, height: '100%', background: MARK_LINE }} />
              <span className="ml-1 whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                최소 {l.root.minHeight}
              </span>
            </span>
          </div>
          <Muted>
            분홍 칸 — 버튼의 누르는 영역(글 + 사방 {l.button.pad} = 높이 {l.button.targetH}, 바깥 −{l.button.pad} 로 띠 높이는 그대로)
          </Muted>
        </div>
        <div className="flex flex-col gap-2">
          {tag('폰(360) — 버튼이 다음 줄로')}
          <div className="relative" style={{ width: 344 }}>
            <B {...DISCONNECTED} zone={{ content: { boxShadow: `inset 0 0 0 1px ${MARK_LINE}` } }} />
          </div>
          <Muted>
            본문과 버튼이 한 줄에 안 들어가면 버튼이 다음 줄 본문 시작선으로 — 줄 사이 {l.content.gap}. 아이콘은 첫 줄 가운데(위 {l.icon.marginTop})
          </Muted>
        </div>
        <div className="flex flex-col gap-2">
          {tag('닫기')}
          <div style={{ width: 344 }}>
            <B tone="informative" interaction="dismissible" title="새 기능" description="반복 거래를 자동으로 기록할 수 있어요." zone={{ close: { outline: `1px dashed ${MARK_LINE}`, background: 'rgba(236, 72, 153, 0.22)' } }} />
          </div>
          <Muted>
            투명 상자 {l.close.size}(분홍) · 바깥 {l.close.margin} — 아이콘 {l.close.icon} 은 오른쪽 끝에서 {l.root.padX + l.close.margin + (l.close.size - l.close.icon) / 2}, 글과 {l.root.gap}
          </Muted>
        </div>
        <div className="flex flex-col gap-2">
          {tag('포커스 — 안쪽 링')}
          <div className="flex flex-col gap-3" style={{ width: 344 }}>
            <B {...DISCONNECTED} state="focused" part="button" />
            <B {...DISCONNECTED} variant="solid" state="focused" part="button" />
            <B tone="neutral" interaction="actionable" description="증권 계좌를 연결하면 보유 주식이 자산에 더해져요." state="focused" part="root" />
          </div>
          <Muted>
            링 {l.ring.width} · 안쪽 {-l.ring.offset}(화면 끝까지 차는 띠라 바깥 링은 잘린다) — 옅은 바탕은 {l.faces.weak.critical.ring.name}, 짙은 바탕은 띠 글자색({l.faces.solid.critical.ring.name}). 버튼 링의 모서리 {l.button.radius}
          </Muted>
        </div>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-[12px] leading-5 pk-muted">
          <li>
            좌우 {l.root.padX}(화면 여백) · 위아래 {l.root.padY} · 최소 {l.root.minHeight} · 모서리 {l.root.radius}
          </li>
          <li>
            아이콘 {l.icon.size} · 제목 {px(l.title.fontSize)} / {px(l.title.lineHeight)} · {l.title.fontWeight} · 본문 {l.description.fontWeight} · 버튼 {px(l.button.fontSize)} / {px(l.button.lineHeight)} · {l.button.fontWeight}
          </li>
        </ul>
      </div>
    </Figure>
  );
};

// 톤 다섯 × 옅음 · 짙음 — 라이트 · 다크
const TONE_TEXT: Record<FbTone, { title: string; description: string }> = {
  neutral: { title: '점검 예정', description: '10월 5일 새벽 2시부터 30분 동안 점검해요.' },
  informative: { title: '새 버전', description: '1.24.0을 받을 수 있어요.' },
  positive: { title: '연결됨', description: '증권 시세를 다시 받아요.' },
  warning: { title: '곧 만료', description: 'Pro 이용이 10월 31일에 끝나요.' },
  critical: { title: '연결 끊김', description: '증권 연결 키가 만료돼 시세를 받지 못해요.' },
};
const Tones: Fig = ({ caption }) => {
  const l = bl();
  const tones = Object.keys(TONE_TEXT) as FbTone[];
  const block = (mode: 'light' | 'dark') => (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl" style={{ background: rc('bg-layer-default', mode) }}>
        <div className="grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: rc('stroke-neutral-subtle', mode) }}>
          {(['weak', 'solid'] as const).map((variant) => (
            <div key={variant} className="flex flex-col gap-3 pb-4 pt-3" style={{ background: rc('bg-layer-default', mode) }}>
              <span className="px-4 text-[12px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
                {variant === 'weak' ? 'weak(기본) — 옅은 바탕' : 'solid — 짙은 바탕, 무거운 상태에만'}
              </span>
              {tones.map((tone) => {
                const f = l.faces[variant][tone];
                return (
                  <div key={tone} className="flex flex-col gap-1">
                    <B mode={mode} tone={tone} variant={variant} {...TONE_TEXT[tone]} />
                    <span className="block px-4 leading-4">
                      <Muted mode={mode}>
                        <b>{tone}</b> — {f.bg.name} {f.bg[mode].toUpperCase()} · {f.fg.name} {f.fg[mode].toUpperCase()}
                      </Muted>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>옅은 바탕은 Callout 과 같은 짝, 짙은 바탕은 흰 글(neutral 은 반전 짝)</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-5">
        {block('light')}
        {block('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 머리 바로 아래 하나 — 그 기능의 안내는 본문 안 Callout
const PlacementGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4 md:flex-row">
      <Verdict ok note="페이지 머리 바로 아래에 하나 — 페이지 전체의 상태만. 그 기능 가까이의 안내는 본문 안 Callout">
        <BannerPhone mode="auto" title="증권" scale={0.6} banner={<B {...DISCONNECTED} />}>
          <div className="pt-3">
            <CalloutView look={calloutLook()} tone="informative" description="국내 주식은 15분 늦은 시세예요." state="enabled" />
          </div>
          <StockRows n={2} />
        </BannerPhone>
      </Verdict>
      <Verdict ok={false} note="한 화면에 배너 둘 — 무엇이 이 페이지의 상태인지 흐려진다. 새 기능 · 팁은 배너가 아니다">
        <BannerPhone
          mode="auto"
          title="증권"
          scale={0.6}
          banner={
            <>
              <B {...DISCONNECTED} />
              <B tone="informative" title="새 기능" description="관심 종목에 알림을 걸 수 있어요." />
            </>
          }
        >
          <StockRows n={2} />
        </BannerPhone>
      </Verdict>
    </div>
  </Panel>
);

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExDisplay: Fig = () => <BannerDisplayDemo look={bl()} snack={snackbarLook()} />;
const ExDismissible: Fig = () => <BannerDismissDemo look={bl()} />;

export const pageBannerFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  tones: Tones,
  'placement-guide': PlacementGuide,
  'ex-display': ExDisplay,
  'ex-dismissible': ExDismissible,
};
