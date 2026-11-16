// Radius 페이지 — 값은 DESIGN.md rounded 블록에서만 온다
import { color, px, radiusScale } from '@/lib/design-tokens';
import { Figure, Table, Token } from './ui';

export function RadiusScaleFigure() {
  const { scale } = radiusScale();
  const fill = color('bg-brand-weak'), line = color('stroke-brand-solid');
  return (
    <Figure caption="모서리 눈금 — 64px 상자에 각 값을 준 모습입니다">
      <div className="grid grid-cols-4 gap-x-6 gap-y-5 sm:grid-cols-6">
        {scale.map((r) => (
          <div key={r.name} className="flex flex-col items-center gap-2">
            <span className="block h-16 w-16" style={{ borderRadius: r.name === 'full' ? 9999 : px(r.value), background: fill, border: `1.5px solid ${line}` }} />
            <code className="text-[13px] text-fd-foreground">{r.name}</code>
            <span className="text-[12px] tabular-nums text-fd-muted-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function RadiusTokenTable() {
  const { scale } = radiusScale();
  return (
    <Table head={['토큰', '값']}>
      {scale.map((r) => (
        <tr key={r.name}>
          <td><Token>radius-{r.name}</Token></td>
          <td className="tabular-nums">{r.value}</td>
        </tr>
      ))}
    </Table>
  );
}
