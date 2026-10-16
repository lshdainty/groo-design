// Writing 페이지 — SEED 처럼 규칙마다 "이렇게 / 이렇게 하지 않는다" 예시를 표로
import { color } from '@/lib/design-tokens';

export function DoDont({ rows }: { rows: [string, string][] }) {
  const ok = color('fg-positive'), no = color('fg-critical');
  return (
    <div className="not-prose my-5 overflow-x-auto rounded-xl border border-fd-border">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="bg-fd-secondary/60">
            <th className="w-1/2 border-b border-fd-border px-4 py-2.5 text-left font-bold" style={{ color: ok }}>이렇게</th>
            <th className="w-1/2 border-b border-fd-border px-4 py-2.5 text-left font-bold" style={{ color: no }}>이렇게 하지 않는다</th>
          </tr>
        </thead>
        <tbody className="[&_td]:border-b [&_td]:border-fd-border [&_td]:px-4 [&_td]:py-2.5 [&_tr:last-child_td]:border-b-0">
          {rows.map(([d, n], i) => (
            <tr key={i}>
              <td className="align-top">{d}</td>
              <td className="align-top text-fd-muted-foreground">{n || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
