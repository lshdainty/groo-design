// Specification — 컴포넌트 YAML 의 규칙을 하나도 빼지 않고 조건마다 표로 그린다(SEED 문서 끝의 Specification 자리).
// 웹 · 앱이 컴포넌트를 만들 때 보는 최종 값이다: 부위 · 상태 · 속성 · 값(토큰 이름과 라이트 · 다크 · 브랜드별 실제 값).
import type { ReactNode } from 'react';
import { loadComponentSpec, stateNames } from '@/lib/component-spec';
import { design, proseValue } from '@/lib/design-tokens';
import { PROP_ORDER, propLabelFor, setsWeight } from '../../scripts/spec-tables.mjs';

type Boxed = { value: unknown; dark?: unknown; note?: string };
const isBoxed = (v: unknown): v is Boxed => !!v && typeof v === 'object' && 'value' in (v as object);

function Chip({ hex }: { hex: string }) {
  return <span aria-hidden className="inline-block h-3.5 w-3.5 shrink-0 rounded-[4px] border border-black/10 dark:border-white/20" style={{ background: hex }} />;
}

function hexAlpha(hex: string, pct: number) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${pct / 100})`;
}

// 색 토큰 — Desk · HR 의 라이트 · 다크 값. 브랜드에 따라 다르면 둘 다
function ColorValue({ name, alpha }: { name: string; alpha?: number }) {
  const pick = (brand: 'desk' | 'hr', dark: boolean) => {
    const c = design(brand).front.colors;
    const hex = (dark ? c[`${name}-dark`] : undefined) ?? c[name];
    return hex ? (alpha !== undefined ? hexAlpha(hex, alpha) : hex.toUpperCase()) : undefined;
  };
  const desk = [pick('desk', false), pick('desk', true)];
  const hr = [pick('hr', false), pick('hr', true)];
  const same = desk[0] === hr[0] && desk[1] === hr[1];
  const line = (label: string | undefined, [l, d]: (string | undefined)[]) => (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fd-muted-foreground">
      {label && <span className="w-9 shrink-0">{label}</span>}
      {l && (
        <span className="inline-flex items-center gap-1.5">
          <Chip hex={l} />
          <span className="tabular-nums">{l}</span>
        </span>
      )}
      {d && d !== l && (
        <span className="inline-flex items-center gap-1.5">
          <Chip hex={d} />
          <span className="tabular-nums">다크 {d}</span>
        </span>
      )}
    </span>
  );
  return (
    <span className="flex flex-col gap-1">
      <code className="text-[12.5px] text-fd-foreground">
        {name}
        {alpha !== undefined ? ` / ${alpha}%` : ''}
      </code>
      {same ? line(undefined, desk) : (
        <>
          {line('Desk', desk)}
          {line('HR', hr)}
        </>
      )}
    </span>
  );
}

// omitWeight — 그 부위의 굵기를 컴포넌트가 따로 정하면 글자 토큰에 딸린 굵기는 적지 않는다(spec-tables 의 setsWeight)
function ScalarValue({ raw, omitWeight = false }: { raw: unknown; omitWeight?: boolean }): ReactNode {
  const v = String(raw).trim();
  const color = /^\$color-([a-z0-9-]+)(?:\s*\/\s*(\d+)%)?$/.exec(v);
  if (color) return <ColorValue name={color[1]} alpha={color[2] ? Number(color[2]) : undefined} />;
  // 그라디언트(v104 표 토큰) — 이름 · 미리보기 · 값. 마스크는 방향을 붙여(→), 반짝임 띠는 스켈레톤 면 위에 그린다
  const gr = /^\$gradient-([a-z0-9-]+)$/.exec(v);
  if (gr) {
    const value = proseValue(`gradient-${gr[1]}`);
    const dark = gr[1].endsWith('-dark');
    const face = design('desk').front.colors[dark ? 'bg-neutral-weak-dark' : 'bg-neutral-weak'];
    const preview = gr[1].startsWith('fade-mask') ? value.replace(/^linear-gradient\(/, 'linear-gradient(to right, ') : `${value}, ${face}`;
    return (
      <span className="flex flex-col gap-1">
        <code className="text-[12.5px] text-fd-foreground">{v.slice(1)}</code>
        <span className="flex items-start gap-2">
          <span aria-hidden className="mt-0.5 inline-block h-3.5 w-14 shrink-0 rounded-[4px] border border-black/10 dark:border-white/20" style={{ background: preview }} />
          <span className="break-all font-mono text-[11px] leading-4 text-fd-muted-foreground">{value}</span>
        </span>
      </span>
    );
  }
  // 딤(prose 표 토큰 — overlay-dim-light · -dark). 모드를 따르지 않는 값이라 이름 · 견본 · 값 하나(Image Frame 의 Indicator 바탕)
  const ov = /^\$(overlay-[a-z0-9-]+)$/.exec(v);
  if (ov) {
    const value = proseValue(ov[1]);
    return (
      <span className="flex flex-col gap-1">
        <code className="text-[12.5px] text-fd-foreground">{ov[1]}</code>
        <span className="flex items-center gap-1.5 text-[12px] tabular-nums text-fd-muted-foreground">
          <Chip hex={value} />
          {value}
        </span>
      </span>
    );
  }
  const m = /^\$(spacing|radius|text|font|motion|shadow)-(.+)$/.exec(v);
  if (m) {
    const front = design().front;
    let resolved: string | undefined;
    if (m[1] === 'spacing') resolved = front.spacing[m[2]];
    if (m[1] === 'radius') resolved = m[2] === 'full' ? '9999px(알약)' : front.rounded[m[2]];
    if (m[1] === 'text') {
      const t = front.typography[m[2]];
      resolved = t ? [t.fontSize, t.lineHeight ?? '—', ...(omitWeight ? [] : [t.fontWeight ?? 400])].join(' / ') : undefined;
    }
    if (m[1] === 'font') resolved = front.typography.t4?.fontFamily;
    if (m[1] === 'motion') resolved = proseValue(`motion-${m[2]}`);
    // 그림자(v105) — 라이트 값과 다크 짝을 함께
    if (m[1] === 'shadow') {
      const prose = (n: string) => {
        try {
          return proseValue(n);
        } catch {
          return undefined;
        }
      };
      const dark = prose(`shadow-${m[2]}-dark`);
      resolved = [prose(`shadow-${m[2]}`), dark && `다크 ${dark}`].filter(Boolean).join(' · ');
    }
    return (
      <span className="flex flex-col gap-0.5">
        <code className="text-[12.5px] text-fd-foreground">{v.slice(1)}</code>
        {resolved && <span className="text-[12px] tabular-nums text-fd-muted-foreground">{resolved}</span>}
      </span>
    );
  }
  return <code className="text-[12.5px] text-fd-foreground">{v}</code>;
}

function Value({ raw, omitWeight = false }: { raw: unknown; omitWeight?: boolean }) {
  if (!isBoxed(raw)) return <ScalarValue raw={raw} omitWeight={omitWeight} />;
  return (
    <span className="flex flex-col gap-1">
      <ScalarValue raw={raw.value} omitWeight={omitWeight} />
      {raw.dark !== undefined && (
        <span className="flex items-center gap-1.5 text-[12px] text-fd-muted-foreground">
          다크 <ScalarValue raw={raw.dark} />
        </span>
      )}
      {raw.note && <span className="text-[12px] leading-[18px] text-fd-muted-foreground">{raw.note}</span>}
    </span>
  );
}

const ORDER = PROP_ORDER as string[];
// 이름표 — 컴포넌트 것(Wheel Picker 의 띠 들임)이 먼저, 없으면 공용(spec-tables 의 propLabelFor)
const labelFor = propLabelFor as (name: string, slot: string, prop: string) => string;

export function SpecSheet({ component }: { component: string }) {
  const spec = loadComponentSpec(component);
  const states = stateNames(spec);
  const slots = Object.keys(spec.slots);
  const weightSet = new Set(slots.filter((s) => setsWeight(spec, s)));
  return (
    <div className="not-prose my-6 flex flex-col gap-6">
      {spec.rules.map((rule, i) => {
        const when = Object.entries(rule.when ?? {});
        const title = when.length ? when.map(([k, v]) => `${k}=${v}`).join(', ') : 'Base';
        const rows: { slot: string; state: string; prop: string; raw: unknown }[] = [];
        for (const st of states) {
          const block = rule[st] as Record<string, Record<string, unknown>> | undefined;
          if (!block) continue;
          const entries = Object.entries(block).flatMap(([slot, props]) => Object.entries(props ?? {}).map(([prop, raw]) => ({ slot, state: st, prop, raw })));
          entries.sort((a, b) => slots.indexOf(a.slot) - slots.indexOf(b.slot) || (ORDER.indexOf(a.prop) + 1 || 999) - (ORDER.indexOf(b.prop) + 1 || 999));
          rows.push(...entries);
        }
        if (!rows.length) return null;
        return (
          <section key={i} className="flex flex-col gap-2">
            <h4 className="font-mono text-[13px] font-bold text-fd-foreground">{title}</h4>
            <div className="overflow-x-auto rounded-xl border border-fd-border">
              <table className="w-full min-w-[560px] border-collapse text-[13px]">
                <thead>
                  <tr className="bg-fd-secondary/60 text-left text-fd-muted-foreground">
                    <th className="w-[110px] border-b border-fd-border px-3 py-2 font-medium">부위</th>
                    <th className="w-[92px] border-b border-fd-border px-3 py-2 font-medium">상태</th>
                    <th className="w-[140px] border-b border-fd-border px-3 py-2 font-medium">속성</th>
                    <th className="border-b border-fd-border px-3 py-2 font-medium">값</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, j) => {
                    const first = j === 0 || rows[j - 1].slot !== r.slot || rows[j - 1].state !== r.state;
                    return (
                      <tr key={j} className="align-top [&>td]:border-b [&>td]:border-fd-border [&>td]:px-3 [&>td]:py-2 last:[&>td]:border-b-0">
                        <td>{first && <code className="text-[12.5px] text-fd-foreground">{r.slot}</code>}</td>
                        <td className="text-fd-muted-foreground">{first && r.state}</td>
                        <td>
                          <span className="text-fd-foreground">{labelFor(spec.name, r.slot, r.prop)}</span>
                          <span className="ml-1 font-mono text-[11px] text-fd-muted-foreground">{r.prop}</span>
                        </td>
                        <td>
                          <Value raw={r.raw} omitWeight={r.prop === 'typography' && weightSet.has(r.slot)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
