'use client';
// Select 플레이그라운드 — 속성을 고르면 스펙대로 그린 칸과 그 코드가 바뀐다(실제로 열고 고를 수 있다).
import { useMemo, useState, type ReactNode } from 'react';
import type { SelGroup, SelIcon, SelItem, SelSizeProp, SelectLook, ViewMode } from './select-shared';
import { SelectField } from './select-view';
import type { TfFieldLook } from './text-field-shared';

export function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly (readonly [T, string])[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-fd-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(([v, t]) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === value}
            onClick={() => onChange(v)}
            className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors ${
              v === value ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PlayFrame({ surface, stage, controls, code }: { surface: string; stage: ReactNode; controls: ReactNode; code: string }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex min-h-[220px] items-center justify-center px-4 py-10" style={{ background: surface }}>
        <div className="w-full max-w-[360px]">{stage}</div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export const MODES = [['auto', '사이트 따라'], ['light', '라이트'], ['dark', '다크']] as const;
export const BRANDS = [['desk', 'Desk'], ['hr', 'HR']] as const;
export const SIZES = [['responsive', '반응형(기본)'], ['large', 'large 52'], ['medium', 'medium 40']] as const;
export const STATES = [['enabled', '기본'], ['invalid', '오류'], ['disabled', '비활성'], ['readonly', '읽기 전용']] as const;
const LUCIDE: Partial<Record<SelIcon, string>> = { wallet: 'Wallet', tag: 'Tag', 'circle-slash': 'CircleSlash', 'credit-card': 'CreditCard', landmark: 'Landmark', banknote: 'Banknote', utensils: 'Utensils', coffee: 'Coffee', 'shopping-bag': 'ShoppingBag', bus: 'Bus', film: 'Film', stethoscope: 'Stethoscope' };

// 하나 고르기 — 결제 수단(Desk 거래 추가). "없음" 은 맨 앞 따로 묶음
type Opt = SelItem & { icon: SelIcon };
const PAY: { label?: string; items: Opt[] }[] = [
  { items: [{ value: 'none', label: '결제 수단 없음', icon: 'circle-slash' }] },
  {
    label: '카드',
    items: [
      { value: 'kb-check', label: '국민 체크카드', description: '국민 주계좌에서 바로 출금', icon: 'credit-card' },
      { value: 'hyundai-m', label: '현대카드 신용카드', description: '매월 14일 결제', icon: 'credit-card' },
      { value: 'shinhan', label: '신한카드 체크카드', description: '매월 25일 결제', icon: 'credit-card' },
    ],
  },
  {
    label: '계좌 · 현금',
    items: [
      { value: 'toss', label: '토스뱅크 통장', description: '1000-1234-5678', icon: 'landmark' },
      { value: 'kakao', label: '카카오뱅크 통장', description: '3333-01-1234567', icon: 'landmark' },
      { value: 'cash', label: '현금', icon: 'banknote' },
    ],
  },
];
// 여럿 고르기 — 카테고리(Desk 필터)
const CAT: { label?: string; items: Opt[] }[] = [
  {
    label: '생활',
    items: [
      { value: 'food', label: '식비', description: '점심 · 저녁 · 장보기', icon: 'utensils' },
      { value: 'cafe', label: '카페', description: '커피 · 디저트', icon: 'coffee' },
      { value: 'shopping', label: '쇼핑', description: '옷 · 생활용품', icon: 'shopping-bag' },
    ],
  },
  {
    label: '이동 · 여가',
    items: [
      { value: 'transport', label: '교통', description: '버스 · 지하철 · 택시', icon: 'bus' },
      { value: 'culture', label: '문화', description: '영화 · 공연 · 책', icon: 'film' },
      { value: 'health', label: '의료', description: '병원 · 약국', icon: 'stethoscope' },
    ],
  },
];

const attr = (cond: boolean, s: string) => (cond ? [s] : []);

export function SelectPlayground({ looks, field }: { looks: Record<'desk' | 'hr', SelectLook>; field: TfFieldLook }) {
  const [size, setSize] = useState<SelSizeProp>('responsive');
  const [state, setState] = useState<(typeof STATES)[number][0]>('enabled');
  const [multiple, setMultiple] = useState<'no' | 'yes'>('no');
  const [icon, setIcon] = useState<'none' | 'icon'>('none');
  const [grouped, setGrouped] = useState<'no' | 'yes'>('yes');
  const [desc, setDesc] = useState<'no' | 'yes'>('no');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<'desk' | 'hr'>('desk');

  const multi = multiple === 'yes';
  const src = multi ? CAT : PAY;
  const kind = multi ? { label: '카테고리', placeholder: '카테고리 선택', error: '카테고리를 골라주세요.', trigger: 'tag' as SelIcon, state: 'categories', set: 'setCategories', initial: ['food', 'transport'] } : { label: '결제 수단', placeholder: '결제 수단 선택', error: '결제 수단을 골라주세요.', trigger: 'wallet' as SelIcon, state: 'asset', set: 'setAsset', initial: ['hyundai-m'] };
  const groups: SelGroup[] = useMemo(() => {
    const strip = (o: Opt): SelItem => ({ value: o.value, label: o.label, description: desc === 'yes' ? o.description : undefined, icon: icon === 'icon' ? o.icon : undefined });
    // 묶음이 없으면 "없음" 도 뺀다 — "없음" 은 맨 앞 따로 묶음에만 둔다
    return grouped === 'yes' ? src.map((g) => ({ label: g.label, items: g.items.map(strip) })) : [{ items: src.filter((g) => g.label).flatMap((g) => g.items.map(strip)) }];
  }, [src, desc, icon, grouped]);

  const code = useMemo(() => {
    const fieldAttrs = [`label="${kind.label}"`, ...attr(state === 'invalid', `invalid errorMessage="${kind.error}"`), ...attr(state === 'disabled', 'disabled'), ...attr(state === 'readonly', 'readOnly')];
    const selAttrs = [
      ...attr(multi, 'multiple'),
      `placeholder="${kind.placeholder}"`,
      `value={${kind.state}}`,
      `onValueChange={${kind.set}}`,
      ...attr(size !== 'responsive', `size="${size}"`),
      ...attr(icon === 'icon', `prefixIcon={<${LUCIDE[kind.trigger]} />}`),
    ];
    const item = (o: SelItem, pad: string) => {
      const a = [`value="${o.value}"`, `label="${o.label}"`, ...attr(!!o.description, `description="${o.description}"`), ...attr(!!o.icon, `prefixIcon={<${LUCIDE[o.icon as SelIcon]} />}`)];
      return `${pad}<SelectItem ${a.join(' ')} />`;
    };
    const body =
      grouped === 'yes'
        ? groups.map((g) => `    <SelectGroup${g.label ? ` label="${g.label}"` : ''}>\n${g.items.map((o) => item(o, '      ')).join('\n')}\n    </SelectGroup>`).join('\n')
        : groups[0].items.map((o) => item(o, '    ')).join('\n');
    const icons = [...new Set([...(icon === 'icon' ? [kind.trigger] : []), ...groups.flatMap((g) => g.items.map((o) => o.icon)).filter((i): i is SelIcon => !!i)])].map((i) => LUCIDE[i]).sort();
    const parts = ['Select', ...(grouped === 'yes' ? ['SelectGroup'] : []), 'SelectItem'];
    const head = `${icons.length ? `import { ${icons.join(', ')} } from "lucide-react"\n` : ''}import { Field } from "@/components/ui/field"\nimport { ${parts.join(', ')} } from "@/components/ui/select"\n\n`;
    return `${head}<Field ${fieldAttrs.join(' ')}>\n  <Select ${selAttrs.join(' ')}>\n${body}\n  </Select>\n</Field>`;
  }, [kind, state, multi, size, icon, grouped, groups]);

  const look = looks[brand];
  const surface = mode === 'auto' ? `var(--p-${look.tone['bg-layer-default'].name})` : look.tone['bg-layer-default'][mode];
  return (
    <PlayFrame
      surface={surface}
      code={code}
      stage={
        <SelectField
          key={JSON.stringify([state, multiple, grouped, brand, size])}
          look={look}
          field={field}
          mode={mode}
          label={kind.label}
          invalid={state === 'invalid'}
          errorMessage={kind.error}
          select={{
            groups,
            multiple: multi,
            size,
            placeholder: kind.placeholder,
            icon: icon === 'icon' ? kind.trigger : undefined,
            defaultValue: state === 'invalid' ? [] : kind.initial,
            disabled: state === 'disabled',
            readOnly: state === 'readonly',
          }}
        />
      }
      controls={
        <>
          <Seg label="크기 size" value={size} options={SIZES} onChange={setSize} />
          <Seg label="상태" value={state} options={STATES} onChange={setState} />
          <Seg label="여럿 고르기 multiple" value={multiple} options={[['no', '하나'], ['yes', '여럿']] as const} onChange={setMultiple} />
          <Seg label="앞 아이콘 prefixIcon" value={icon} options={[['none', '없음'], ['icon', '트리거 · 선택지']] as const} onChange={setIcon} />
          <Seg label="묶음 SelectGroup" value={grouped} options={[['no', '없음'], ['yes', '제목 · 사이 선']] as const} onChange={setGrouped} />
          <Seg label="설명 description" value={desc} options={[['no', '없음'], ['yes', '한 줄']] as const} onChange={setDesc} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}
