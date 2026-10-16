// Inclusive Design 페이지 — 대비는 역할 색으로 계산하고, 터치 영역은 touch-min, 오류 표현은 State 절 규칙을 따른다
import { CircleAlert, TrendingDown, TrendingUp, X } from 'lucide-react';
import { color, contrast, proseValue, px, specPartSize, specSize, type Brand } from '@/lib/design-tokens';
import { Figure, MARK, MARK_LINE, Table, Token, Verdict, Swatch } from './ui';

type Mode = 'light' | 'dark';
const rc = (name: string, mode: Mode = 'light', brand: Brand = 'desk') => color(mode === 'dark' ? `${name}-dark` : name, brand);

export function ColorOnlyFigure() {
  const row = (label: string, amount: string, up: boolean, withText: boolean) => (
    <div className="flex w-[210px] items-center justify-between py-1.5 text-[13px]" style={{ color: rc('fg-neutral') }}>
      <span>{label}</span>
      <span className="inline-flex items-center gap-1 font-bold" style={{ color: up ? rc('fg-critical') : rc('fg-positive') }}>
        {withText && (up ? <TrendingUp size={16} aria-hidden /> : <TrendingDown size={16} aria-hidden />)}
        {amount}
        {withText && <span className="font-normal">{up ? '늘었어요' : '줄었어요'}</span>}
      </span>
    </div>
  );
  return (
    <Figure>
      <div className="flex w-[540px] gap-4">
        <Verdict ok note="색과 함께 아이콘 · 글자로도 알린다">
          <div>{row('식비', '12%', true, true)}{row('교통', '4%', false, true)}</div>
        </Verdict>
        <Verdict ok={false} note="빨강 · 초록만으로는 색을 구분하기 어려운 사람에게 뜻이 전해지지 않는다">
          <div>{row('식비', '12%', true, false)}{row('교통', '4%', false, false)}</div>
        </Verdict>
      </div>
    </Figure>
  );
}

// 짝마다 WCAG 2 대비 — 검사기(design.md lint)가 재는 것과 같은 식
const PAIRS: [string, string, string][] = [
  ['fg-neutral', 'bg-layer-default', '본문'],
  ['fg-neutral-muted', 'bg-layer-default', '보조 글자'],
  ['fg-neutral-subtle', 'bg-layer-basement', '흐린 글자 · 바닥 위'],
  ['fg-critical', 'bg-layer-default', '오류 글자'],
  ['fg-brand', 'bg-layer-default', '브랜드 글자'],
  ['fg-disabled', 'bg-disabled', '비활성(WCAG 예외)'],
];
export function ContrastTable() {
  return (
    <Table head={['글자', '배경', '쓰는 곳', '라이트', '다크']} minWidth={680}>
      {PAIRS.map(([f, b, use]) => (
        <tr key={f + b}>
          <td><Token>{f}</Token></td>
          <td><Token>{b}</Token></td>
          <td className="whitespace-nowrap text-fd-muted-foreground">{use}</td>
          {(['light', 'dark'] as Mode[]).map((m) => {
            const r = contrast(rc(f, m), rc(b, m));
            const need = f === 'fg-disabled' ? 0 : 4.5;
            return (
              <td key={m} className="whitespace-nowrap tabular-nums">
                <Swatch hex={rc(f, m)} /> <b className="ml-1">{r.toFixed(2)}:1</b>{' '}
                {need ? <span style={{ color: r >= need ? color('fg-positive') : color('fg-critical') }}>{r >= need ? 'AA' : '미달'}</span> : <span className="text-fd-muted-foreground">—</span>}
              </td>
            );
          })}
        </tr>
      ))}
    </Table>
  );
}

export function TouchTargetFigure() {
  const touch = px(proseValue('touch-min'));
  const check = specPartSize('checkbox', { size: 'medium' }, 'checkmark');
  const small = (icon: number, label: string) => {
    const w = icon + 8;
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex items-center justify-center" style={{ width: touch, height: touch }}>
          <span className="absolute inset-0 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} aria-hidden />
          <span className="relative flex items-center justify-center rounded" style={{ width: w, height: w }}>
            <X size={icon} color={rc('fg-neutral-subtle')} aria-hidden />
          </span>
        </span>
        <span className="text-center text-[11px] leading-4 text-[#62697A]">{label}</span>
      </div>
    );
  };
  return (
    <Figure caption={`작은 요소도 누르는 영역은 ${touch} × ${touch} 이상 — 분홍이 보이지 않는 여백이다`}>
      <div className="flex items-end gap-10 rounded-xl bg-white px-10 py-6">
        {small(16, `닫기 아이콘 16 → 누르는 영역 ${touch}`)}
        <div className="flex flex-col items-center gap-3">
          <span className="relative flex items-center justify-center" style={{ width: touch, height: touch }}>
            <span className="absolute inset-0 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} aria-hidden />
            <span className="relative rounded" style={{ width: check.width ?? check.height, height: check.height, border: `1.5px solid ${rc('stroke-neutral-solid')}`, background: rc('bg-layer-default') }} />
          </span>
          <span className="text-center text-[11px] leading-4 text-[#62697A]">체크박스 {check.height} → 누르는 영역 {touch}</span>
        </div>
      </div>
    </Figure>
  );
}

export function ErrorAnnounceFigure() {
  const h = specSize('button', 'medium').height;
  return (
    <Figure caption="오류는 테두리 색과 함께 글자로, 입력칸 바로 아래에, 고칠 방법까지 — 보조 기술에도 바로 알린다">
      <div className="flex items-start gap-8 rounded-xl bg-white px-8 py-6">
        <div className="flex w-[220px] flex-col gap-1.5">
          <label className="text-[13px] font-bold" style={{ color: rc('fg-neutral') }}>카드 이름</label>
          <span className="flex items-center rounded-lg px-[11px] text-[14px]" style={{ height: h, border: `2px solid ${rc('stroke-critical-solid')}`, color: rc('fg-neutral') }}>
            현대카드
          </span>
          <span className="inline-flex items-start gap-1 text-[12px] leading-4" style={{ color: rc('fg-critical') }}>
            <CircleAlert size={16} className="shrink-0" aria-hidden />
            같은 이름의 카드가 있어요. 다른 이름으로 바꿔주세요.
          </span>
        </div>
        <pre className="m-0 rounded-lg px-4 py-3 text-[12px] leading-5" style={{ background: rc('bg-neutral-weak'), color: rc('fg-neutral') }}>
{`<input aria-invalid="true"
       aria-describedby="card-name-error" />
<p id="card-name-error" role="alert">
  같은 이름의 카드가 있어요. …
</p>`}
        </pre>
      </div>
    </Figure>
  );
}
