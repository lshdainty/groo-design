'use client';
// International Design 의 "지금 시각으로 보기" — 브라우저의 Intl 로 DESIGN.md 의 날짜 · 시각 · 지난 시간 규칙을 계산한다.
// 빌드 때가 아니라 보는 순간의 시각을 쓰므로 화면에 붙은 뒤(useEffect)에 그린다.
import { useEffect, useState } from 'react';

type Row = [string, string, string];

const ko = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('ko-KR', o).format(d);
const en = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', o).format(d);
const TIME: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };

function dateRows(now: Date): Row[] {
  const lastYear = new Date(now);
  lastYear.setFullYear(now.getFullYear() - 1);
  return [
    ['표준', ko(lastYear, { year: 'numeric', month: 'long', day: 'numeric' }), en(lastYear, { year: 'numeric', month: 'short', day: 'numeric' })],
    ['줄임', ko(now, { month: 'long', day: 'numeric' }), en(now, { month: 'short', day: 'numeric' })],
    ['점', ko(now, { year: 'numeric', month: 'numeric', day: 'numeric' }), '—'],
    ['점 · 두 자리 연도', ko(now, { year: '2-digit', month: 'numeric', day: 'numeric' }), `${en(now, { month: 'short', day: 'numeric' })}, '${String(now.getFullYear()).slice(2)}`],
    ['요일', `${ko(now, { month: 'long', day: 'numeric' })} (${ko(now, { weekday: 'short' })})`, en(now, { weekday: 'short', month: 'short', day: 'numeric' })],
    ['요일 풀어 씀', `${ko(now, { month: 'long', day: 'numeric' })} ${ko(now, { weekday: 'long' })}`, en(now, { weekday: 'long', month: 'short', day: 'numeric' })],
    ['요일 · 시각', `${ko(now, { month: 'long', day: 'numeric' })} (${ko(now, { weekday: 'short' })}) ${ko(now, TIME)}`, `${en(now, { weekday: 'short', month: 'short', day: 'numeric' })} at ${en(now, TIME)}`],
    ['시각', ko(now, TIME), en(now, TIME)],
  ];
}

// 지난 시간 — 흐른 시간으로 센다(Desk relativeTime 과 같은 계산). 7일 이상은 날짜 규칙(올해면 줄임, 다른 해면 표준)
function relative(then: Date, now: Date): [string, string] {
  const m = Math.floor((now.getTime() - then.getTime()) / 60_000);
  if (m < 1) return ['방금 전', 'Just now'];
  if (m < 60) return [`${m}분 전`, `${m} min ago`];
  const h = Math.floor(m / 60);
  if (h < 24) return [`${h}시간 전`, `${h} hr ago`];
  const d = Math.floor(h / 24);
  if (d === 1) return ['어제', 'Yesterday'];
  if (d < 7) return [`${d}일 전`, `${d} days ago`];
  const sameYear = then.getFullYear() === now.getFullYear();
  return sameYear
    ? [ko(then, { month: 'long', day: 'numeric' }), en(then, { month: 'short', day: 'numeric' })]
    : [ko(then, { year: 'numeric', month: 'long', day: 'numeric' }), en(then, { year: 'numeric', month: 'short', day: 'numeric' })];
}
const AGO: [string, number][] = [
  ['30초 전', 30_000], ['5분 전', 5 * 60_000], ['3시간 전', 3 * 3_600_000], ['30시간 전', 30 * 3_600_000], ['3일 전', 3 * 86_400_000], ['10일 전', 10 * 86_400_000],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-fd-border bg-fd-background">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-fd-secondary/60">{head.map((h) => <th key={h} className="whitespace-nowrap border-b border-fd-border px-4 py-2.5 text-left font-medium text-fd-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="[&_td]:border-b [&_td]:border-fd-border [&_td]:px-4 [&_td]:py-2.5 [&:last-child_td]:border-b-0">
              {r.map((c, i) => <td key={i} className={i ? 'whitespace-nowrap tabular-nums' : 'whitespace-nowrap text-fd-muted-foreground'}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IntlNowDemo() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  if (!now) return <p className="text-sm text-fd-muted-foreground">지금 시각으로 계산하는 중…</p>;
  return (
    <div className="flex flex-col gap-4">
      <Table head={['형식', '한국어', '영어']} rows={dateRows(now)} />
      <Table head={['지금으로부터', '한국어', '영어']} rows={AGO.map(([label, ms]) => [label, ...relative(new Date(now.getTime() - ms), now)])} />
      <p className="text-[12px] text-fd-muted-foreground">표준 줄은 다른 해의 예로 1년 전 오늘을 넣었다. 브라우저의 <code>Intl.DateTimeFormat</code>(ko-KR · en-US)으로 계산했다.</p>
    </div>
  );
}
