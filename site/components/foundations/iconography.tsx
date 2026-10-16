// Iconography 페이지 — 크기 단계 · 바닥 · 선 굵기 · 아이콘 버튼 크기는 DESIGN.md Iconography 절에서 읽는다
import type { ReactNode } from 'react';
import {
  Bell, BellOff, Calendar, ChartPie, Check, ChevronRight, CreditCard, EyeOff, Filter, House, ListTodo, Pencil, PiggyBank, Pin, Plus,
  Receipt, Search, Settings, Star, StickyNote, Trash2, Wallet, X, type LucideIcon,
} from 'lucide-react';
import { color, design, proseValue, px, sectionNumber, sectionTable } from '@/lib/design-tokens';
import { Figure, MARK, MARK_LINE, Measure } from './ui';

const INK = () => color('fg-neutral');
function sizes() {
  return sectionTable('크기').rows.map((r) => px(r[0].replace(/`/g, '')));
}
const floor = () => sectionNumber('크기', /(\d+)px 은 넘지 말아야 할 바닥/);
const baseStroke = () => sectionNumber('선 굵기와 상태', /선은 lucide 기본 (\d+(?:\.\d+)?)/);
const onStroke = () => sectionNumber('선 굵기와 상태', /선 (\d+\.\d+)/);

function Cap({ children }: { children: ReactNode }) {
  return <span className="text-center text-[11px] leading-4 text-[#62697A]">{children}</span>;
}

const SET: [LucideIcon, string][] = [
  [House, 'house'], [Wallet, 'wallet'], [CreditCard, 'credit-card'], [Receipt, 'receipt'], [PiggyBank, 'piggy-bank'], [ChartPie, 'chart-pie'],
  [Calendar, 'calendar'], [ListTodo, 'list-todo'], [StickyNote, 'sticky-note'], [Bell, 'bell'], [Search, 'search'], [Settings, 'settings'],
  [Plus, 'plus'], [Pencil, 'pencil'], [Trash2, 'trash-2'], [Check, 'check'], [X, 'x'], [Filter, 'filter'],
];
export function IconSetFigure() {
  const s = Math.max(...sizes());
  return (
    <Figure caption="lucide — Desk · HR 화면에서 쓰는 아이콘 몇 가지(24px 격자 · 선 2)">
      <div className="grid w-[520px] grid-cols-6 gap-3 rounded-xl bg-white p-5">
        {SET.map(([I, n]) => (
          <div key={n} className="flex flex-col items-center gap-1.5 py-1">
            <I size={s} strokeWidth={baseStroke()} color={INK()} aria-hidden />
            <code className="text-[10px] text-[#62697A]">{n}</code>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// 24 격자를 4배로 — lucide 가 그리는 틀
export function IconGridFigure() {
  const base = Math.max(...sizes());
  const k = 4, S = base * k;
  const line = color('stroke-neutral-weak');
  return (
    <Figure caption={`아이콘은 ${base}px 격자에 선 ${baseStroke()} 로 그린다 — 네 배로 키워 본 모습. 없는 아이콘도 이 틀로 그려 더한다`}>
      <div className="flex items-center gap-10 rounded-xl bg-white px-10 py-6">
        <div className="relative" style={{ width: S, height: S, backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`, backgroundSize: `${k}px ${k}px`, outline: `1px solid ${line}` }}>
          <span className="absolute" style={{ inset: 2 * k, background: MARK, opacity: 0.5 }} aria-hidden />
          <Calendar className="absolute inset-0" size={S} strokeWidth={baseStroke()} color={INK()} aria-hidden />
        </div>
        <ul className="flex flex-col gap-2 text-[13px] text-[#1A1F2E]">
          <li>격자 {base} × {base}</li>
          <li>선 {baseStroke()} · 둥근 끝 · 둥근 이음</li>
          <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: MARK }} />그리는 자리 — 가장자리 2px 는 비운다</li>
        </ul>
      </div>
    </Figure>
  );
}

export function IconSizeFigure() {
  const list = sizes();
  const min = floor();
  return (
    <Figure caption={`UI 아이콘은 ${list.join(' · ')} 셋만 쓴다. ${min}px 은 넘지 말아야 할 바닥이라 UI 아이콘으로 쓰지 않는다`}>
      <div className="flex items-end gap-8 rounded-xl bg-white px-10 py-6">
        <div className="flex flex-col items-center gap-2 opacity-60">
          <span className="flex h-12 items-end">
            <span className="relative inline-flex">
              <Calendar size={min} strokeWidth={baseStroke()} color={INK()} aria-hidden />
              <span className="absolute -left-1 -right-1 top-1/2 rotate-[-20deg] border-t-2" style={{ borderColor: color('fg-critical') }} aria-hidden />
            </span>
          </span>
          <code className="text-[12px] text-[#62697A]">{min}</code>
          <Cap>바닥 — 쓰지 않음</Cap>
        </div>
        {list.map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <span className="flex h-12 items-end"><Calendar size={s} strokeWidth={baseStroke()} color={INK()} aria-hidden /></span>
            <code className="text-[12px] text-[#1A1F2E]">{s}</code>
            <Cap>{s === Math.max(...list) ? '기본 격자' : 'UI'}</Cap>
          </div>
        ))}
        <div className="ml-4 flex flex-col items-center gap-2 border-l pl-8" style={{ borderColor: color('stroke-neutral-weak') }}>
          <span className="flex h-12 items-end"><ListTodo size={Math.max(...list) * 2} strokeWidth={baseStroke()} color={color('fg-neutral-subtle')} aria-hidden /></span>
          <code className="text-[12px] text-[#62697A]">{Math.max(...list)} × 2</code>
          <Cap>빈 화면 — 24 격자를 비율대로</Cap>
        </div>
      </div>
    </Figure>
  );
}

export function IconStateFigure() {
  const on = onStroke(), base = baseStroke();
  const muted = color('fg-neutral-muted'), strong = color('fg-neutral'), brand = color('fg-brand');
  const size = Math.max(...sizes());
  const item = (I: LucideIcon, c: string, w: number, label: string, sub: string) => (
    <div className="flex flex-col items-center gap-2">
      <I size={size} strokeWidth={w} color={c} aria-hidden />
      <b className="text-[12px] text-[#1A1F2E]">{label}</b>
      <Cap>{sub}</Cap>
    </div>
  );
  const row = (title: string, children: ReactNode) => (
    <div className="flex flex-col gap-3">
      <span className="text-[12px] font-bold text-[#62697A]">{title}</span>
      <div className="grid grid-cols-4 gap-4">{children}</div>
    </div>
  );
  return (
    <Figure caption="lucide 에는 채움이 없어, 켜짐 · 선택은 진한 색 + 굵은 선이다. 꺼짐의 사선(-off)은 기능이 꺼지는 단추만 — 모으기 단추(관심 · 고정)는 같은 아이콘이 흐린 선 · 진한 굵은 선으로 갈린다">
      <div className="flex w-[520px] flex-col gap-6 rounded-xl bg-white px-6 py-6">
        {row(
          '기능이 꺼지는 단추 — 알림 · 금액 가리기',
          <>
            {item(Bell, muted, base, '기본', `선 ${base}`)}
            {item(Bell, strong, on, '켜짐 · 선택', `진한 색 + 선 ${on}`)}
            {item(BellOff, muted, base, '꺼짐', `-off 아이콘 · 선 ${base}`)}
            {item(EyeOff, strong, on, '금액을 가림', `지금 상태 eye-off · 선 ${on}`)}
          </>,
        )}
        {row(
          '모으기 단추 — 관심 · 고정(사선 없이)',
          <>
            {item(Star, muted, base, '관심 — 꺼짐', `흐린 색 · 선 ${base}`)}
            {item(Star, strong, on, '관심 — 켜짐', `진한 색 · 선 ${on}`)}
            {item(Pin, muted, base, '고정 — 꺼짐', `흐린 색 · 선 ${base}`)}
            {item(Star, brand, on, '브랜드로 강조', `브랜드 색 + 선 ${on}`)}
          </>,
        )}
      </div>
    </Figure>
  );
}

export function IconButtonFigure() {
  const visible = sectionNumber('아이콘만 있는 버튼', /보이는 크기는 (\d+)px/);
  const big = sectionNumber('아이콘만 있는 버튼', /24px 아이콘이면 (\d+)px/);
  const touch = px(proseValue('touch-min'));
  const [, s20, s24] = sizes();
  const btn = (box: number, icon: number, name: string) => {
    const pad = (touch - box) / 2;
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex items-center justify-center" style={{ width: touch, height: touch }}>
          {pad > 0 && <span className="absolute inset-0 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} aria-hidden />}
          <span className="relative flex items-center justify-center rounded-lg" style={{ width: box, height: box, background: color('bg-neutral-weak') }}>
            <Settings size={icon} strokeWidth={baseStroke()} color={INK()} aria-hidden />
          </span>
        </span>
        <code className="text-[11px] text-[#62697A]">aria-label="{name}"</code>
        <Cap>보이는 {box} · 아이콘 {icon} · 누르는 영역 {touch}</Cap>
      </div>
    );
  };
  return (
    <Figure caption={`아이콘 버튼은 보이는 크기 ${visible}px(${s24}px 아이콘이면 ${big}px), 누르는 영역은 늘 ${touch}px 이상 — 분홍이 보이지 않는 여백이다. 이름은 반드시 단다`}>
      <div className="flex items-end gap-12 rounded-xl bg-white px-10 py-6">
        {btn(visible, s20, '설정')}
        {btn(big, s24, '설정')}
      </div>
    </Figure>
  );
}

export function IconTextFigure() {
  const gap = px(design().front.spacing.x2);
  const [s16] = sizes();
  return (
    <Figure caption="글자와 한 줄에 둘 때는 높이 가운데로 맞추고, 사이는 간격 토큰으로 둔다">
      <div className="flex gap-10 rounded-xl bg-white px-10 py-8">
        <span className="relative inline-flex items-center text-[14px] text-[#1A1F2E]" style={{ gap }}>
          <Calendar size={s16} strokeWidth={baseStroke()} color={INK()} aria-hidden />
          9월 30일 (수)
          <Measure style={{ left: s16, top: -6, width: gap, height: 32 }} label={`x2 ${gap}`} />
        </span>
        <span className="inline-flex items-center text-[14px] font-bold text-[#1A1F2E]" style={{ gap }}>
          카드 결제 예정
          <ChevronRight size={s16} strokeWidth={baseStroke()} color={color('fg-neutral-subtle')} aria-hidden />
        </span>
      </div>
    </Figure>
  );
}
