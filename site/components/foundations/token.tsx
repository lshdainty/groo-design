// Design Token 개요 — 층 · 모드의 예는 모두 DESIGN*.md 의 실제 토큰 값으로 그린다
import { color, colorStep, design, pressScale, proseValue, spacingScale } from '@/lib/design-tokens';
import { Figure, Swatch, Table, Token } from './ui';

function Box({ title, children, tone }: { title: string; children: React.ReactNode; tone: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-3">
      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: tone }}>{title}</span>
      {children}
    </div>
  );
}
// 긴 토큰 이름은 앞붙이(motion-duration- 들)를 작게 떼어 쪼개지지 않게
function Chip({ children, prefix }: { children: React.ReactNode; prefix?: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      {prefix && <code className="text-[10px] text-[#62697A]">{prefix}</code>}
      <code className="w-fit whitespace-nowrap rounded-md px-2 py-1 text-[12px]" style={{ background: color('bg-neutral-weak'), color: color('fg-neutral') }}>{children}</code>
    </span>
  );
}

export function TokenTierFigure() {
  const gutter = design().front.spacing['global-gutter'];
  const scaleName = spacingScale().byValue(gutter);
  const d3 = proseValue('motion-duration-d3');
  const brand = color('bg-brand-solid');
  const cols = ['Raw', 'Scale', 'Semantic', '컴포넌트'];
  const rows: [string, React.ReactNode, React.ReactNode, React.ReactNode, string][] = [
    ['간격', <Chip key="r">{gutter}</Chip>, <Chip key="s">{scaleName}</Chip>, <Chip key="m">global-gutter</Chip>, '화면 좌우 여백'],
    ['모션', <Chip key="r">{d3}</Chip>, <Chip key="s" prefix="motion-duration-">d3</Chip>, <Chip key="m" prefix="motion-duration-">color-transition</Chip>, '버튼의 색 전환'],
    ['색', <span key="r" className="inline-flex"><Swatch hex={brand} /></span>, <Chip key="s">{colorStep('bg-brand-solid')}</Chip>, <Chip key="m">bg-brand-solid</Chip>, '채움 버튼의 배경'],
  ];
  const tones = [color('fg-neutral-subtle'), color('fg-informative'), color('fg-brand'), color('fg-positive')];
  return (
    <Figure caption="값에 이름을 붙이고(Scale), 그 이름에 뜻을 붙이고(Semantic), 컴포넌트는 뜻으로 부른다">
      <div className="grid w-[600px] grid-cols-[48px_repeat(4,1fr)] items-center gap-2 rounded-xl p-1">
        <span />
        {cols.map((c, i) => <b key={c} className="text-center text-[12px]" style={{ color: tones[i] }}>{c}</b>)}
        {rows.map(([label, raw, scale, sem, use]) => (
          <div key={label} className="contents">
            <span className="text-[12px] font-bold text-fd-foreground">{label}</span>
            <Box title="값" tone={tones[0]}>{raw}</Box>
            <Box title="이름" tone={tones[1]}>{scale}</Box>
            <Box title="뜻" tone={tones[2]}>{sem}</Box>
            <Box title="쓰는 곳" tone={tones[3]}><span className="text-[12px] text-[#1A1F2E]">{use}</span></Box>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function TokenModesTable() {
  const { distance } = pressScale();
  const rows: [string, string, React.ReactNode, React.ReactNode][] = [
    ['테마', '라이트 · 다크', <Token key="t">bg-layer-default</Token>, <span key="v" className="inline-flex flex-wrap gap-2"><Swatch hex={color('bg-layer-default')} /> → <Swatch hex={color('bg-layer-default-dark')} /></span>],
    ['브랜드', 'HR · Desk', <Token key="t">bg-brand-solid</Token>, <span key="v" className="inline-flex flex-wrap gap-2"><Swatch hex={color('bg-brand-solid', 'hr')} /> · <Swatch hex={color('bg-brand-solid', 'desk')} /></span>],
    ['모션', '보통 · 줄이기', <span key="t">눌림 축소</span>, <span key="v">세로 {distance}px → 없음(배율 1)</span>],
    ['뷰포트', `${parseFloat(proseValue('breakpoint-md'))} 미만 · 이상`, <Token key="t">layout-gutter-narrow · layout-gutter</Token>, <span key="v">{proseValue('layout-gutter-narrow')} → {proseValue('layout-gutter')}</span>],
  ];
  return (
    <Table head={['모드', '갈래', '토큰', '값']} minWidth={640}>
      {rows.map(([m, w, t, v]) => (
        <tr key={m}>
          <td className="whitespace-nowrap font-bold">{m}</td>
          <td className="whitespace-nowrap text-fd-muted-foreground">{w}</td>
          <td>{t}</td>
          <td className="tabular-nums">{v}</td>
        </tr>
      ))}
    </Table>
  );
}
