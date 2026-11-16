// 기초 개요 — 기초 항목마다 카드 한 장(작은 그림 + 이름, 4:3)을 한 페이지에 모은다.
// 그림은 그 항목의 실제 토큰 값(색 · 글자 · 간격 · 모서리 · 그림자 · 이징 …)으로 그린 작은 견본이다. 카드 전체가 링크다.
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Bell, CalendarDays, House, Search, Settings, Wallet } from 'lucide-react';
import { color, palette, proseValue, px, radiusScale, spacingScale, typeScale } from '@/lib/design-tokens';

const c = (name: string) => color(name, 'desk');
const INK = () => c('fg-neutral');
const SUBTLE = () => c('fg-neutral-subtle');
const SURFACE = () => c('bg-layer-default');
const LINE = () => c('stroke-neutral-weak');
const MARK = 'rgba(236, 72, 153, 0.22)';

function bezier(v: string) {
  const m = v.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) throw new Error(`이징 ${v} 를 읽지 못했다`);
  return m[1].split(',').map(Number) as [number, number, number, number];
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-w-[200px] flex-col items-stretch gap-2 rounded-xl p-4" style={{ background: SURFACE(), boxShadow: `inset 0 0 0 1px ${LINE()}` }}>
      {children}
    </div>
  );
}

function DesignTokenThumb() {
  const step = 'gray-1000';
  const rows: [string, string][] = [
    ['Scale', step],
    ['Semantic', 'bg-neutral-inverted'],
    ['컴포넌트', 'button'],
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      {rows.map(([tier, name], i) => (
        <div key={tier} className="flex items-center gap-2">
          <span className="w-16 text-right text-[11px] font-bold" style={{ color: SUBTLE() }}>{tier}</span>
          <span
            className="rounded-lg px-3 py-1.5 text-[12px] font-bold"
            style={i === 2 ? { background: c('bg-neutral-inverted'), color: c('fg-neutral-inverted') } : { background: SURFACE(), color: INK(), boxShadow: `inset 0 0 0 1px ${LINE()}` }}
          >
            {i === 2 ? '저장' : name}
          </span>
        </div>
      ))}
    </div>
  );
}

function ColorThumb() {
  const fams = ['blue', 'green', 'orange', 'red', 'violet', 'gray'];
  const steps = ['200', '400', '600', '800'];
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {steps.map((s) =>
        fams.map((f) => {
          const hex = palette(f).find((p) => p.step === s)?.light;
          return <span key={`${f}-${s}`} className="block h-8 w-8 rounded-md" style={{ background: hex }} />;
        }),
      )}
    </div>
  );
}

function GradientThumb() {
  const shimmer = proseValue('gradient-shimmer-neutral');
  const mask = proseValue('gradient-fade-mask');
  return (
    <div className="flex w-[220px] flex-col gap-3">
      <div className="relative h-10 overflow-hidden rounded-lg" style={{ background: c('bg-neutral-weak') }}>
        <div className="absolute inset-y-0 left-[20%] w-[60%]" style={{ background: shimmer }} />
      </div>
      <div className="flex gap-1.5 overflow-hidden" style={{ maskImage: mask.replace('linear-gradient(', 'linear-gradient(to left, '), WebkitMaskImage: mask.replace('linear-gradient(', 'linear-gradient(to left, ') }}>
        {['전체', '식비', '교통', '쇼핑', '문화'].map((t) => (
          <span key={t} className="shrink-0 rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: c('bg-neutral-weak'), color: INK() }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function TypographyThumb() {
  const { scale } = typeScale();
  const t = (n: string) => scale.find((s) => s.name === n)!;
  const big = t('t13'), mid = t('t6'), small = t('t3');
  return (
    <div className="flex items-end gap-4" style={{ color: INK() }}>
      <span style={{ fontSize: big.fontSize, lineHeight: big.lineHeight, fontWeight: 700 }}>가</span>
      <span className="flex flex-col pb-1.5">
        <span style={{ fontSize: mid.fontSize, lineHeight: mid.lineHeight, fontWeight: 700 }}>그루 담다</span>
        <span style={{ fontSize: small.fontSize, lineHeight: small.lineHeight, color: SUBTLE() }}>Pretendard · Inter</span>
      </span>
    </div>
  );
}

function IconographyThumb() {
  const icons = [House, Wallet, CalendarDays, Bell, Search, Settings];
  return (
    <div className="grid grid-cols-3 gap-3">
      {icons.map((I, i) => (
        <span key={i} className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: SURFACE(), boxShadow: `inset 0 0 0 1px ${LINE()}` }}>
          <I size={24} strokeWidth={2} color={INK()} />
        </span>
      ))}
    </div>
  );
}

function SpacingThumb() {
  const { scale } = spacingScale();
  const pick = ['x1', 'x2', 'x3', 'x4', 'x6', 'x8', 'x12'].map((n) => scale.find((s) => s.name === n)!).filter(Boolean);
  return (
    <div className="flex flex-col gap-1.5">
      {pick.map((s) => (
        <div key={s.name} className="flex items-center gap-2">
          <code className="w-8 text-right text-[11px]" style={{ color: SUBTLE() }}>{s.name}</code>
          <span className="block h-3 rounded-sm" style={{ width: px(s.value) * 2.5, background: c('bg-brand-solid') }} />
        </div>
      ))}
    </div>
  );
}

function RadiusThumb() {
  const { scale } = radiusScale();
  const pick = ['r1', 'r3', 'r5', 'full'].map((n) => scale.find((s) => s.name === n)!).filter(Boolean);
  return (
    <div className="flex items-center gap-3">
      {pick.map((r) => (
        <span key={r.name} className="flex flex-col items-center gap-1.5">
          <span className="block h-12 w-12" style={{ borderRadius: r.value, background: c('bg-brand-weak'), boxShadow: `inset 0 0 0 2px ${c('stroke-brand-solid')}` }} />
          <code className="text-[11px]" style={{ color: SUBTLE() }}>{r.name}</code>
        </span>
      ))}
    </div>
  );
}

function LayoutThumb() {
  return (
    <div className="flex h-[120px] w-[220px] overflow-hidden rounded-lg" style={{ background: c('bg-layer-basement'), boxShadow: `inset 0 0 0 1px ${LINE()}` }}>
      <div className="w-10 shrink-0" style={{ background: SURFACE(), borderRight: `1px solid ${LINE()}` }} />
      <div className="grid flex-1 grid-cols-12 gap-[3px] p-2.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="block h-full rounded-[2px]" style={{ background: MARK }} />
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="relative h-[150px] w-[78px] overflow-hidden rounded-[18px]" style={{ background: SURFACE(), boxShadow: `inset 0 0 0 2px ${INK()}` }}>
      <span className="absolute left-1/2 top-[6px] h-[8px] w-[26px] -translate-x-1/2 rounded-full" style={{ background: INK() }} />
      <span className="absolute bottom-[5px] left-1/2 h-[3px] w-[28px] -translate-x-1/2 rounded-full" style={{ background: INK() }} />
      {children}
    </div>
  );
}

function SafeAreaThumb() {
  return (
    <PhoneFrame>
      <div className="absolute inset-x-[2px] top-[2px] h-[20px]" style={{ background: MARK }} />
      <div className="absolute inset-x-[2px] bottom-[2px] h-[14px]" style={{ background: MARK }} />
      <div className="absolute inset-x-[8px] bottom-[18px] top-[28px] rounded-md" style={{ border: `1.5px dashed ${c('stroke-brand-solid')}` }} />
    </PhoneFrame>
  );
}

function ElevationThumb() {
  const levels = [1, 2, 3] as const;
  return (
    <div className="relative h-[120px] w-[200px]">
      {levels.map((n, i) => (
        <div
          key={n}
          className="absolute h-[64px] w-[120px] rounded-xl"
          style={{ left: i * 36, top: i * 22, background: SURFACE(), boxShadow: proseValue(`shadow-s${n + 1}`) }}
        />
      ))}
    </div>
  );
}

function MotionThumb() {
  const [x1, y1, x2, y2] = bezier(proseValue('motion-ease-enter'));
  const W = 160, H = 100;
  const pt = (x: number, y: number) => `${x * W} ${H - y * H}`;
  return (
    <svg width={W + 20} height={H + 20} viewBox={`-10 -10 ${W + 20} ${H + 20}`} aria-hidden>
      <rect x={0} y={0} width={W} height={H} fill="none" stroke={LINE()} />
      <path d={`M ${pt(0, 0)} C ${pt(x1, y1)} ${pt(x2, y2)} ${pt(1, 1)}`} fill="none" stroke={c('bg-brand-solid')} strokeWidth={3} strokeLinecap="round" />
      <circle cx={W} cy={0} r={5} fill={c('bg-brand-solid')} />
    </svg>
  );
}

function FeedbackThumb() {
  return (
    <div className="flex items-center gap-4">
      {[false, true].map((pressed) => (
        <span
          key={String(pressed)}
          className="flex h-12 items-center rounded-xl px-5 text-[15px] font-bold"
          style={{ background: c(pressed ? 'bg-brand-solid-pressed' : 'bg-brand-solid'), color: c('static-white'), transform: pressed ? 'scale(0.96)' : undefined }}
        >
          {pressed ? '누름' : '기본'}
        </span>
      ))}
    </div>
  );
}

function StateThumb() {
  const chips: { label: string; bg: string; fg: string }[] = [
    { label: '기본', bg: 'bg-neutral-weak', fg: 'fg-neutral' },
    { label: '누름', bg: 'bg-neutral-weak-pressed', fg: 'fg-neutral' },
    { label: '선택', bg: 'bg-neutral-inverted', fg: 'fg-neutral-inverted' },
    { label: '비활성', bg: 'bg-disabled', fg: 'fg-disabled' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {chips.map((s) => (
        <span key={s.label} className="rounded-full px-4 py-1.5 text-center text-[13px] font-medium" style={{ background: c(s.bg), color: c(s.fg) }}>{s.label}</span>
      ))}
    </div>
  );
}

function InclusiveThumb() {
  const touch = px(proseValue('touch-min'));
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex items-center justify-center" style={{ width: touch * 1.6, height: touch * 1.6, background: MARK, borderRadius: 12 }}>
        <Bell size={24} color={INK()} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: c('fg-critical') }}>
          <span className="flex h-4 w-4 items-center justify-center rounded-full text-[11px] text-white" style={{ background: c('bg-critical-solid') }}>!</span>
          금액을 입력해 주세요
        </span>
        <span className="text-[12px]" style={{ color: SUBTLE() }}>색과 글로 함께 알립니다</span>
      </span>
    </div>
  );
}

function InternationalThumb() {
  return (
    <Card>
      <span className="text-[13px]" style={{ color: SUBTLE() }}>11월 16일 (월) 오후 3:30</span>
      <span className="text-[22px] font-bold tabular-nums" style={{ color: INK() }}>−1,234,500원</span>
      <span className="text-[12px] tabular-nums" style={{ color: SUBTLE() }}>Nov 16 (Mon) 3:30 PM</span>
    </Card>
  );
}

function VoiceThumb() {
  return (
    <div className="flex flex-col gap-2">
      <span className="self-start rounded-2xl rounded-bl-md px-4 py-2.5 text-[14px]" style={{ background: SURFACE(), color: INK(), boxShadow: `inset 0 0 0 1px ${LINE()}` }}>
        메모를 저장했어요.
      </span>
      <span className="self-end rounded-2xl rounded-br-md px-4 py-2.5 text-[14px]" style={{ background: c('bg-brand-weak'), color: c('fg-brand-contrast') }}>
        불러오지 못했어요. 잠시 뒤 다시 시도해주세요.
      </span>
    </div>
  );
}

function WritingThumb() {
  const row = (ok: boolean, text: string) => (
    <span className="flex items-center gap-2 text-[13px]" style={{ color: INK() }}>
      <span className="h-4 w-1 rounded-full" style={{ background: c(ok ? 'fg-positive' : 'fg-critical') }} />
      {text}
    </span>
  );
  return (
    <Card>
      {row(true, '삭제할까요?')}
      {row(false, '삭제하시겠습니까?')}
    </Card>
  );
}

function TouchTargetThumb() {
  const touch = px(proseValue('touch-min'));
  return (
    <span className="relative flex items-center justify-center rounded-xl" style={{ width: touch * 2, height: touch * 2, background: MARK }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: SURFACE(), boxShadow: `inset 0 0 0 1px ${LINE()}` }}>
        <Settings size={24} color={INK()} />
      </span>
      <span className="absolute -bottom-6 text-[11px] tabular-nums" style={{ color: SUBTLE() }}>{touch} × {touch}</span>
    </span>
  );
}

function RtlThumb() {
  const line = (rtl: boolean) => (
    <div className={`flex w-[200px] items-center gap-2 rounded-lg px-3 py-2 ${rtl ? 'flex-row-reverse' : ''}`} style={{ background: SURFACE(), boxShadow: `inset 0 0 0 1px ${LINE()}` }}>
      {rtl ? <ArrowRight size={16} color={INK()} /> : <ArrowLeft size={16} color={INK()} />}
      <span className="h-2 flex-1 rounded-full" style={{ background: c('bg-neutral-weak-pressed') }} />
      <span className="h-2 w-6 rounded-full" style={{ background: c('bg-brand-solid') }} />
    </div>
  );
  return (
    <div className="flex flex-col gap-2">
      {line(false)}
      {line(true)}
    </div>
  );
}

function ZIndexThumb() {
  const layers = ['bg-layer-basement', 'bg-layer-default', 'bg-layer-floating', 'bg-neutral-inverted'];
  return (
    <div className="relative h-[120px] w-[180px]">
      {layers.map((l, i) => (
        <div
          key={l}
          className="absolute h-[56px] w-[110px] rounded-lg"
          style={{ left: i * 22, top: 56 - i * 18, background: c(l), boxShadow: `${proseValue('shadow-s2')}, inset 0 0 0 1px ${LINE()}`, transform: 'skewY(-8deg)' }}
        />
      ))}
    </div>
  );
}

const THUMBS: Record<string, () => ReactNode> = {
  'design-token': DesignTokenThumb,
  color: ColorThumb,
  gradient: GradientThumb,
  typography: TypographyThumb,
  iconography: IconographyThumb,
  spacing: SpacingThumb,
  radius: RadiusThumb,
  layout: LayoutThumb,
  'safe-area': SafeAreaThumb,
  elevation: ElevationThumb,
  motion: MotionThumb,
  feedback: FeedbackThumb,
  state: StateThumb,
  'inclusive-design': InclusiveThumb,
  'international-design': InternationalThumb,
  'voice-and-tone': VoiceThumb,
  writing: WritingThumb,
  'touch-targets': TouchTargetThumb,
  rtl: RtlThumb,
  'z-index': ZIndexThumb,
};

export function FoundationGallery({ items }: { items: { slug: string; title: string }[] }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3" data-gallery>
      {items.map(({ slug, title }) => {
        const Thumb = THUMBS[slug];
        if (!Thumb) throw new Error(`기초 개요 그림 ${slug} 이 없다 — site/components/foundations/gallery.tsx 의 THUMBS 에 더한다`);
        return (
          <div key={slug} className="group relative flex flex-col gap-3">
            <div aria-hidden inert className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#eef0f1] transition-[filter] group-hover:brightness-[0.97]">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                <Thumb />
              </div>
            </div>
            <a href={`/docs/foundations/${slug}`} className="text-[17px] font-semibold text-fd-foreground after:absolute after:inset-0 after:rounded-xl">
              {title}
            </a>
          </div>
        );
      })}
    </div>
  );
}
