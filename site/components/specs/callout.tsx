// Callout 페이지의 그림 — specs/components/callout.md 의 `[그림: …](../../site/components/specs/callout.tsx#<id>)` 자리.
// 상자는 callout.yaml 을 푼 값(calloutLook)으로, 같이 나오는 Page Banner · Snackbar 는 각자의 YAML 로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { calloutLook, pageBannerLook, snackbarLook, type CalloutLook, type FbTone } from './feedback-look';
import { CalloutDisplayDemo, CalloutErrorDemo, CalloutInteractiveDemo } from './feedback-demos';
import { CalloutPlayground } from './feedback-playground';
import { Band, Legend, Muted, Pair, Pin, SAVE_FAIL, SnackDock, StockRows, TxSheet, W, markBox, type Fig } from './feedback-screens';
import { CalloutView, PageBannerView, SnackbarView, type CalloutViewProps } from './feedback-view';
import { Line, Phone, Row, Verdict, rc } from './kit';
import { Cap, F, Form, tf } from './select-screens';
import { TfInputView } from './text-field-view';

const cl = (brand: 'desk' | 'hr' = 'desk') => calloutLook(brand);
const px = (v: string) => parseFloat(v);

// 멈춘 상자 하나 — 수치 · 색은 calloutLook 에서
function C(p: Omit<CalloutViewProps, 'look' | 'state'> & { state?: CalloutViewProps['state']; look?: CalloutLook }) {
  const { state = 'enabled', look, ...rest } = p;
  return <CalloutView look={look ?? cl()} state={state} {...rest} />;
}

// 비교 페이지에서 고른 그대로의 글(2026-10-02)
const IMPORT = { title: '안내', description: '가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요.', link: { label: '자세히' } };
const SPLIT = '총액이 바뀌어 분할 합계와 1,200원 달라요.';
const TONE_TEXT: Record<FbTone, { title?: string; description: string; link?: boolean }> = {
  neutral: { description: '가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요.' },
  informative: { title: '안내', description: '국내 주식은 15분 늦은 시세예요.', link: true },
  positive: { description: '분할 합계가 총액과 같아요.' },
  warning: { description: '카테고리 한도 합이 전체 상한을 12,000원 넘었어요.' },
  critical: { title: '주의', description: '토큰은 지금만 볼 수 있어요. 닫기 전에 복사해 두세요.' },
};

// ── Overview ──────────────────────────────────────────────
// 거래 추가 시트(저장 실패 — 폼 맨 위) + 같은 화면 밖의 안내 둘(가져오기 · 분할 합계)
const Hero: Fig = ({ caption }) => {
  const row = (mode: 'light' | 'dark') => (
    <div className="flex items-start gap-4">
      <Phone title="가계부" back={false} mode={mode} scale={0.65} h={600} bg="bg-layer-default" tabs overlay={<TxSheet mode={mode} />}>
        <div className="px-6">
          <Row mode={mode} title="점심 식사" sub="식비 · 현대카드 M" amount="−12,000원" hue="orange" />
        </div>
      </Phone>
      <div className="flex w-[344px] flex-col gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
        <Muted mode={mode}>{mode === 'light' ? '라이트' : '다크'} — 거래 가져오기</Muted>
        <C mode={mode} tone="informative" title={IMPORT.title} description={IMPORT.description} link={IMPORT.link} />
        <Muted mode={mode}>더치페이 — 분할 합계</Muted>
        <C mode={mode} tone="warning" description={SPLIT} />
        <Muted mode={mode}>거래 추가 — 저장 실패(폼 맨 위)</Muted>
        <C mode={mode} tone="critical" description={SAVE_FAIL} />
      </div>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-4">
        {row('light')}
        {row('dark')}
      </div>
    </Figure>
  );
};

const Playground: Fig = () => <CalloutPlayground looks={{ desk: cl('desk'), hr: cl('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
// 1.5배로 그린다 — 치수 · 글자를 모두 곱한 look(색은 그대로)
function zoomed(l: CalloutLook, k: number): CalloutLook {
  const t = <T extends { fontSize: string; lineHeight: string }>(x: T): T => ({ ...x, fontSize: `${px(x.fontSize) * k}px`, lineHeight: `${px(x.lineHeight) * k}px` });
  return {
    ...l,
    root: { minHeight: l.root.minHeight * k, pad: l.root.pad * k, gap: l.root.gap * k, radius: l.root.radius * k },
    icon: l.icon * k,
    suffixIcon: l.suffixIcon * k,
    title: t(l.title),
    description: t(l.description),
    link: { ...t(l.link), underlineOffset: l.link.underlineOffset * k, ringRadius: l.link.ringRadius * k },
    close: { ...l.close, size: l.close.size * k, icon: l.close.icon * k, margin: l.close.margin * k, radius: l.close.radius * k },
  };
}
const K = 1.5;
const Anatomy: Fig = ({ caption }) => {
  const z = zoomed(cl(), K);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-8 pb-8 pt-16">
        <div style={{ width: 500 }} className="pl-6">
          <CalloutView
            look={z}
            state="enabled"
            tone="informative"
            title="안내"
            description="국내 주식은 15분 늦은 시세예요."
            link={{ label: '자세히' }}
            zone={{ root: { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 4 }, icon: markBox, title: markBox, description: markBox, link: markBox }}
            pins={{ root: <Pin n="ⓐ" />, icon: <Pin n="ⓑ" />, title: <Pin n="ⓒ" />, description: <Pin n="ⓓ" />, link: <Pin n="ⓔ" /> }}
            pinLine={MARK_LINE}
          />
        </div>
        <div className="grid w-[500px] gap-10 pt-6 sm:grid-cols-2">
          <C tone="neutral" interaction="actionable" description="토스증권을 연결하면 보유 주식이 자산에 더해져요." zone={{ suffix: markBox }} pins={{ suffix: <Pin n="ⓕ" /> }} pinLine={MARK_LINE} />
          <C tone="informative" interaction="dismissible" title="새 기능" description="반복 거래를 자동으로 기록할 수 있어요." zone={{ close: markBox }} pins={{ close: <Pin n="ⓕ" /> }} pinLine={MARK_LINE} />
        </div>
        <Legend
          items={[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Icon'],
            ['ⓒ', 'Title'],
            ['ⓓ', 'Description'],
            ['ⓔ', 'Link'],
            ['ⓕ', 'Chevron · Close'],
          ]}
        />
        <span className="max-w-[480px] text-center text-[12px] leading-5 pk-muted">위는 1.5배 — 제목 · 본문 · 링크가 한 문단으로 흐른다. 아래는 실제 크기 — 전체를 누르는 상자의 뒤 화살표, 닫을 수 있는 상자의 닫기</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 상자의 여백 · 한 문단 — 1.5배. 안쪽 14 · 아이콘 16 · 사이 12 · 띄어쓰기 두 칸 · 최소 50, 닫기 40(바깥 −12)
const Layout: Fig = ({ caption }) => {
  const l = cl();
  const z = zoomed(l, K);
  const sepMark = { background: 'rgba(236, 72, 153, 0.35)' };
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-8 rounded-xl pk-surface px-8 py-10">
        <div className="relative" style={{ width: 460 }}>
          <CalloutView look={z} state="enabled" tone="informative" title="안내" description="국내 주식은 15분 늦은 시세예요." link={{ label: '자세히' }} zone={{ sep: sepMark }} />
          <Band style={{ left: 0, top: 0, bottom: 0, width: z.root.pad }} label={String(l.root.pad)} />
          <Band style={{ left: z.root.pad, right: 0, top: 0, height: z.root.pad }} />
          <Band style={{ left: z.root.pad + z.icon, top: z.root.pad, bottom: z.root.pad, width: z.root.gap }} label={String(l.root.gap)} below />
          <span aria-hidden className="absolute flex items-center" style={{ left: '100%', top: 0, bottom: 0, marginLeft: 6 }}>
            <span style={{ width: 1, height: '100%', background: MARK_LINE }} />
            <span className="ml-1 whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
              최소 {l.root.minHeight}
            </span>
          </span>
        </div>
        <div style={{ width: 460 }}>
          <CalloutView look={z} state="enabled" tone="informative" interaction="dismissible" title="새 기능" description="반복 거래를 자동으로 기록할 수 있어요." zone={{ close: { outline: `1px dashed ${MARK_LINE}`, background: 'rgba(236, 72, 153, 0.22)' } }} />
        </div>
        <div className="flex flex-col gap-2" style={{ width: 328 }}>
          <C tone="neutral" interaction="actionable" description="토스증권을 연결하면 보유 주식이 자산에 더해져요. 연결은 언제든 끊을 수 있어요." />
          <Muted>실제 크기 — 여러 줄이면 아이콘 · 화살표 · 닫기는 상자 가운데</Muted>
        </div>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-[12px] leading-5 pk-muted">
          <li>
            안쪽 {l.root.pad} · 최소 {l.root.minHeight} · 모서리 {l.root.radius} · 아이콘 {l.icon} · 사이 {l.root.gap}
          </li>
          <li>
            제목 · 본문 · 링크는 모두 {px(l.description.fontSize)} / {px(l.description.lineHeight)} — 제목 {l.title.fontWeight}, 사이는 띄어쓰기 두 칸(분홍), 링크는 밑줄(글과 {l.link.underlineOffset})
          </li>
          <li>
            닫기는 투명 상자 {l.close.size}(분홍) — 바깥 여백 {l.close.margin} 로 줄 높이를 늘리지 않고, 아이콘 {l.close.icon} 은 오른쪽 끝에서 {l.root.pad}
          </li>
        </ul>
      </div>
    </Figure>
  );
};

// 톤 다섯 — 옅은 톤 바탕 + 같은 색의 글 · 아이콘 · 링크
const Tones: Fig = ({ caption }) => {
  const l = cl();
  const panel = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
        {(Object.keys(TONE_TEXT) as FbTone[]).map((tone) => {
          const t = TONE_TEXT[tone];
          const f = l.faces[tone];
          return (
            <div key={tone} className="flex flex-col gap-1">
              <C mode={mode} tone={tone} title={t.title} description={t.description} link={t.link ? { label: '자세히' } : undefined} />
              <Muted mode={mode}>
                <b>{tone}</b> — {f.bg.name} {f.bg[mode].toUpperCase()} · {f.fg.name} {f.fg[mode].toUpperCase()}
              </Muted>
            </div>
          );
        })}
      </div>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>글 · 아이콘 · 링크 · 화살표 · 닫기가 모두 그 톤의 글자색</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {panel('light')}
        {panel('dark')}
      </div>
    </Panel>
  );
};

// 상호작용 셋 × 상태 — 보이기(링크) · 전체 누르기(상자) · 닫기(닫기 버튼)
const STATE_KO = { enabled: '기본', hovered: '호버(웹)', pressed: '누름', focused: '포커스(키보드)' } as const;
const Interactions: Fig = ({ caption }) => {
  const cell = (label: string, node: ReactNode) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      {node}
      <Muted>{label}</Muted>
    </div>
  );
  const block = (title: string, note: string, cells: ReactNode) => (
    <div className="flex flex-col gap-3 rounded-xl p-4 pk-surface">
      <span className="text-[13px] leading-5">
        <b className="pk-text">{title}</b> <span className="pk-muted">{note}</span>
      </span>
      <div className="grid gap-4 sm:grid-cols-2">{cells}</div>
    </div>
  );
  const act = { tone: 'neutral' as const, interaction: 'actionable' as const, description: '토스증권을 연결하면 보유 주식이 자산에 더해져요.' };
  const dis = { tone: 'informative' as const, interaction: 'dismissible' as const, title: '새 기능', description: '반복 거래를 자동으로 기록할 수 있어요.' };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {block(
          'display',
          '보이기만 — 링크를 둘 수 있다(보조 내용으로 갈 때만)',
          <>
            {cell(STATE_KO.enabled, <C tone="informative" title="안내" description="국내 주식은 15분 늦은 시세예요." link={{ label: '자세히' }} />)}
            {cell(`${STATE_KO.focused} — 링크 둘레(모서리 ${cl().link.ringRadius})`, <C tone="informative" title="안내" description="국내 주식은 15분 늦은 시세예요." link={{ label: '자세히' }} state="focused" part="link" />)}
          </>,
        )}
        {block(
          'actionable',
          '상자 전체가 버튼 — 뒤 화살표, 누르면 톤의 누름 바탕 + 상자 전체 2px 축소',
          <>
            {(['enabled', 'hovered', 'pressed', 'focused'] as const).map((st) => (
              <div key={st}>{cell(STATE_KO[st], <C {...act} state={st} part="root" />)}</div>
            ))}
          </>,
        )}
        {block(
          'dismissible',
          '닫기 버튼 — 한 번 보면 되는 안내에만. 닫기의 호버 · 누름은 톤의 누름 바탕',
          <>
            {(['enabled', 'hovered', 'pressed', 'focused'] as const).map((st) => (
              <div key={st}>{cell(st === 'enabled' ? STATE_KO[st] : `닫기 ${STATE_KO[st]}`, <C {...dis} state={st} part="close" />)}</div>
            ))}
          </>,
        )}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 그 자리 · 페이지 맨 위 · 잠깐 — 한 화면에서 셋의 자리. 번호는 화면 안 그 요소 옆(왼쪽 화면 여백 자리)
function RoleMark({ n, style }: { n: string; style: CSSProperties }) {
  return (
    <span aria-hidden className="absolute z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE, ...style }}>
      {n}
    </span>
  );
}
const RoleGuide: Fig = ({ caption }) => {
  const items: [string, string, string][] = [
    ['①', 'Page Banner', '페이지 맨 위 · 화면 폭 — 그 페이지 전체의 상태(연결 끊김). 한 화면에 하나'],
    ['②', 'Callout', '본문 안, 그 내용 바로 위 · 콘텐츠 폭 — 그 기능의 안내 · 주의 · 그 자리의 오류'],
    ['③', 'Snackbar', '잠깐 — 방금 한 일의 결과. 화면 아래 가운데, 탭 바 위 8'],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Phone title="증권" back={false} mode="auto" scale={0.75} h={600} bg="bg-layer-default" tabs>
          <div className="relative">
            <PageBannerView look={pageBannerLook()} tone="critical" title="연결 끊김" description="토스증권 키가 만료돼 시세를 받지 못해요." button={{ label: '다시 연결' }} state="enabled" />
            <RoleMark n="①" style={{ left: 3, top: 9 }} />
          </div>
          <div className="flex flex-col px-6 pt-4">
            <div className="relative">
              <C tone="informative" description="국내 주식은 15분 늦은 시세예요." />
              <RoleMark n="②" style={{ left: -21, top: 16 }} />
            </div>
            <StockRows />
          </div>
          <SnackDock>
            <div className="relative w-full">
              <SnackbarView look={snackbarLook()} state="enabled" tone="positive" message="관심 종목에 넣었어요." />
              <RoleMark n="③" style={{ right: 10, top: 13 }} />
            </div>
          </SnackDock>
        </Phone>
        <ol className="flex w-[300px] max-w-full flex-col gap-4">
          {items.map(([n, name, what]) => (
            <li key={n} className="flex gap-3 text-[13px] leading-5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: MARK_LINE }}>
                {n}
              </span>
              <span>
                <b className="text-fd-foreground">{name}</b>
                <span className="block text-fd-muted-foreground">{what}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
};

// 닫기 — 한 번 보면 되는 새 기능 안내만. 경고 · 오류는 문제가 남아 있는 동안 보여야 한다
const DismissGuide: Fig = ({ caption }) => {
  const t = tf();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="새 기능처럼 한 번 읽으면 되는 안내만 닫는다 — 닫은 것을 기억해 다시 띄우지 않는다">
          <W>
            <div className="flex flex-col gap-4">
              <C tone="informative" interaction="dismissible" title="새 기능" description="반복 거래를 자동으로 기록할 수 있어요." />
              <div className="flex flex-col gap-2">
                <Line w="85%" />
                <Line w="60%" />
              </div>
            </div>
          </W>
        </Verdict>
        <Verdict ok={false} note="경고를 닫을 수 있게 — 한도는 여전히 넘었는데 안내만 사라진다">
          <W>
            <Form gap={t.field.form.gapY}>
              <C tone="warning" interaction="dismissible" description="카테고리 한도 합이 전체 상한을 12,000원 넘었어요." />
              <F label="식비 한도">
                <TfInputView look={t.input} size="large" state="enabled" value="312,000" suffix="원" />
              </F>
            </Form>
          </W>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExDisplay: Fig = () => <CalloutDisplayDemo look={cl()} button={buttonLook({ variant: 'neutralWeak', size: 'medium' })} />;
const ExError: Fig = () => <CalloutErrorDemo look={cl()} snack={snackbarLook()} field={tf().field} input={tf().input} cta={buttonLook({ variant: 'neutralSolid', size: 'large' })} />;
const ExInteractive: Fig = () => <CalloutInteractiveDemo look={cl()} />;

export const calloutFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  tones: Tones,
  interactions: Interactions,
  'role-guide': RoleGuide,
  'dismiss-guide': DismissGuide,
  'ex-display': ExDisplay,
  'ex-error': ExError,
  'ex-interactive': ExInteractive,
};
