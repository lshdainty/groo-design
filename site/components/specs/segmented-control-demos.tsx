'use client';
// Segmented Control 페이지의 실제로 누르는 미리보기 — 코드 절(할 일)과 플레이그라운드가 쓴다.
// 컨트롤은 segmented-control.yaml(segmented-control-view) 그대로다. 고르면 바로 아래 같은 목록이 걸러진다(같은 내용 조작).
// 화면 속 목록은 아직 스펙이 없다 — 역할 색 토큰으로 간단히 그린다.
import { useState, type ReactNode } from 'react';
import { HOLDINGS, SEG_SETS, TODOS, TXS, todoFilter, type SegSet } from './segmented-control-data';
import { scv, type SegLook, type SegTone, type ViewMode } from './segmented-control-shared';
import { SegmentedView } from './segmented-control-view';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const t = (look: SegLook, name: SegTone, mode: ViewMode) => scv(look.tone[name], mode);

// 코드 미리보기 판 — 회색 판 위 흰 화면(폭 w). 안쪽 좌우는 화면 여백
export function SegDemoFrame({ look, children, w = 360, mode = 'auto' }: { look: SegLook; children: ReactNode; w?: number; mode?: ViewMode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto w-full overflow-hidden rounded-xl" style={{ maxWidth: w, background: t(look, 'bg-layer-default', mode), fontFamily: FONT, paddingTop: 20, paddingBottom: 12, paddingLeft: look.gutter, paddingRight: look.gutter }}>
          {children}
        </div>
      </div>
    </figure>
  );
}

function Row({ look, mode, title, sub, amount, hue, lead }: { look: SegLook; mode: ViewMode; title: string; sub?: string; amount?: string; hue?: 'orange' | 'brown' | 'blue' | 'green' | 'violet'; lead?: ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      {lead ?? (
        <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[14px] font-bold" style={{ background: t(look, `chart-${hue ?? 'blue'}-weak` as SegTone, mode), color: t(look, `chart-${hue ?? 'blue'}-contrast` as SegTone, mode) }}>
          {title.slice(0, 1)}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium" style={{ color: t(look, 'fg-neutral', mode) }}>
          {title}
        </span>
        {sub && (
          <span className="truncate text-[13px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
            {sub}
          </span>
        )}
      </span>
      {amount && (
        <span className="text-[15px] font-bold tabular-nums" style={{ color: t(look, 'fg-neutral', mode) }}>
          {amount}
        </span>
      )}
    </li>
  );
}

// 고른 칸에 맞춰 거른 목록 — 칸 수의 화면(할 일 · 가계부 · 시장)
export function SegContent({ look, mode = 'auto', set, value }: { look: SegLook; mode?: ViewMode; set: SegSet; value?: string }) {
  const empty = (text: string) => (
    <p className="py-8 text-center text-[14px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
      {text}
    </p>
  );
  if (set.key === 'todo') {
    const rows = TODOS.filter(todoFilter(value ?? 'today'));
    if (!rows.length) return empty('할 일이 없어요.');
    return (
      <ul aria-label="할 일" className="flex flex-col pt-1">
        {rows.map((x) => (
          <Row
            key={x.title}
            look={look}
            mode={mode}
            title={x.title}
            sub={x.done ? `${x.due} 완료` : x.due}
            lead={<span aria-hidden className="block h-5 w-5 shrink-0 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${t(look, x.done ? 'fg-neutral-subtle' : 'stroke-neutral-solid', mode)}`, background: x.done ? t(look, 'fg-neutral-subtle', mode) : undefined }} />}
          />
        ))}
      </ul>
    );
  }
  if (set.key === 'ledger') {
    const rows = TXS.filter((x) => !value || value === 'all' || x.type === value);
    return (
      <ul aria-label="거래" className="flex flex-col pt-1">
        {rows.map((x) => (
          <Row key={x.title} look={look} mode={mode} title={x.title} sub={x.sub} amount={x.amount} hue={x.hue} />
        ))}
      </ul>
    );
  }
  const rows = HOLDINGS.filter((x) => x.market === (value ?? 'domestic'));
  return (
    <ul aria-label="보유 종목" className="flex flex-col pt-1">
      {rows.map((x) => (
        <Row key={x.name} look={look} mode={mode} title={x.name} sub={x.sub} amount={x.amount} hue={x.market === 'domestic' ? 'blue' : 'violet'} />
      ))}
    </ul>
  );
}

// 할 일 — 오늘 · 이번 주 · 전체 · 완료(코드 절의 미리보기)
export function TodoDemo({ look, mode = 'auto' }: { look: SegLook; mode?: ViewMode }) {
  const set = SEG_SETS[4];
  const [view, setView] = useState('today');
  return (
    <div className="flex flex-col gap-2">
      <SegmentedView look={look} mode={mode} items={set.items} value={view} onValue={setView} ariaLabel={set.aria} />
      <SegContent look={look} mode={mode} set={set} value={view} />
    </div>
  );
}
