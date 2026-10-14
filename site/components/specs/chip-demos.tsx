'use client';
// Chip 페이지의 실제로 누르는 미리보기 — 코드 절(하나 고르기 · 여럿 고르기 · 필터 바 · 제안 · 입력값)과 플레이그라운드가 쓴다.
// 칩은 chip.yaml(chip-view), 칸 · Field 는 field · input.yaml(text-field-view), 버튼은 button.yaml(button-view) 그대로다.
// 필터 바가 여는 시트는 Bottom Sheet(bottom-sheet.yaml — overlay-view · overlay-live)다 — 미리보기 화면 안에 띄운다.
import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import type { OvKit } from './overlay-shared';
import { ModalLayer } from './overlay-live';
import { SheetButtons, SheetSurface } from './overlay-view';
import { ccv, summarize, type ChipIcon, type ChipLook, type ChipSize, type ChipTone, type ChipVariant, type ViewMode } from './chip-shared';
import { ChipField, ChipGroupView, ChipRadioGroupLive, ChipSuggestLive, ChipToggleGroupLive, ChipView, InputChipGroupLive, type ChipItem } from './chip-view';
import type { TfFieldLook, TfInputLook } from './text-field-shared';
import { TfFieldView, TfInputView } from './text-field-view';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const t = (look: ChipLook, name: ChipTone, mode: ViewMode) => ccv(look.tone[name], mode);

// ── 화면 예시의 값 ─────────────────────────────────────
export const TX_TYPES: ChipItem[] = [
  { value: 'expense', label: '지출', icon: 'arrow-up-right' },
  { value: 'income', label: '수입', icon: 'arrow-down-left' },
  { value: 'transfer', label: '이체', icon: 'arrow-left-right' },
];
export const ALARMS: ChipItem[] = ['당일', '1일 전', '3일 전', '1주 전'].map((v) => ({ value: v, label: v, icon: 'bell' as ChipIcon }));
export const PEOPLE: ChipItem[] = [
  { value: 'minji', label: '김민지', icon: 'user' },
  { value: 'seojun', label: '박서준', icon: 'user' },
  { value: 'doyun', label: '이도윤', icon: 'user' },
];
// 빠른 금액 — 누르면 금액이 그 값으로 바뀐다(더하지 않는다)
export const AMOUNTS = [100000, 300000, 500000];
export const formatMan = (v: number) => `${v / 10000}만`;
const comma = (v: number) => v.toLocaleString('ko-KR');

// 가계부 거르기 — 기간(하나) · 카테고리(여럿) · 결제 수단(여럿)
type Cond = { key: 'period' | 'category' | 'pay'; label: string; icon: ChipIcon; kind: 'single' | 'multi'; items: ChipItem[] };
export const CONDS: Cond[] = [
  {
    key: 'period',
    label: '기간',
    icon: 'calendar',
    kind: 'single',
    items: [
      { value: 'all', label: '전체' },
      { value: 'this', label: '이번 달' },
      { value: 'last', label: '지난 달' },
      { value: 'q', label: '최근 3개월' },
    ],
  },
  {
    key: 'category',
    label: '카테고리',
    icon: 'tag',
    kind: 'multi',
    items: [
      { value: 'food', label: '식비' },
      { value: 'cafe', label: '카페' },
      { value: 'transport', label: '교통' },
      { value: 'shopping', label: '쇼핑' },
      { value: 'culture', label: '문화' },
      { value: 'health', label: '의료' },
    ],
  },
  {
    key: 'pay',
    label: '결제 수단',
    icon: 'credit-card',
    kind: 'multi',
    items: [
      { value: 'hyundai', label: '현대카드 M' },
      { value: 'kb', label: '국민 체크카드' },
      { value: 'cash', label: '현금' },
    ],
  },
];
const CAT_HUE: Record<string, 'orange' | 'blue' | 'green' | 'violet'> = { food: 'orange', cafe: 'orange', transport: 'blue', shopping: 'violet', culture: 'green', health: 'blue' };
// 달 — 10 이번 달 · 9 지난 달 · 8 그 전 달(오늘 2026. 10. 1. 목)
const TXS = [
  { title: '점심 식사', cat: 'food', pay: 'hyundai', month: 10, amount: 12000 },
  { title: '스타벅스', cat: 'cafe', pay: 'hyundai', month: 10, amount: 5600 },
  { title: '지하철', cat: 'transport', pay: 'kb', month: 10, amount: 1450 },
  { title: '편의점', cat: 'food', pay: 'cash', month: 10, amount: 4300 },
  { title: '영화', cat: 'culture', pay: 'kb', month: 9, amount: 15000 },
  { title: '약국', cat: 'health', pay: 'cash', month: 9, amount: 8200 },
  { title: '저녁 식사', cat: 'food', pay: 'hyundai', month: 9, amount: 23000 },
  { title: '운동화', cat: 'shopping', pay: 'hyundai', month: 8, amount: 89000 },
];
const labelOf = (c: Cond, v: string) => c.items.find((i) => i.value === v)?.label ?? v;

// ── 하나 고르기 · 여럿 고르기(Field 안) ───────────────────
export function SingleDemo({ look, field, mode = 'auto', variant, size }: { look: ChipLook; field: TfFieldLook; mode?: ViewMode; variant?: ChipVariant; size?: ChipSize }) {
  return (
    <ChipField field={field} mode={mode} label="거래 종류">
      {(ids) => <ChipRadioGroupLive look={look} mode={mode} variant={variant} size={size} items={TX_TYPES.map(({ icon, ...i }) => (void icon, i))} defaultValue="expense" ariaLabelledby={ids.labelledBy} />}
    </ChipField>
  );
}

export function MultiDemo({ look, field, mode = 'auto' }: { look: ChipLook; field: TfFieldLook; mode?: ViewMode }) {
  return (
    <ChipField field={field} mode={mode} label="알림" description="고른 때마다 알려줘요.">
      {(ids) => <ChipToggleGroupLive look={look} mode={mode} items={ALARMS.map(({ icon, ...i }) => (void icon, i))} defaultValue={['당일']} ariaLabelledby={ids.labelledBy} ariaDescribedby={ids.describedBy} />}
    </ChipField>
  );
}

// ── 제안(예산 금액) · 입력값(더치페이 참여자) ──────────────
export function BudgetField({
  look,
  field,
  input,
  mode = 'auto',
  variant = 'solid',
  size,
  icons = false,
  disabled = 'none',
}: {
  look: ChipLook;
  field: TfFieldLook;
  input: TfInputLook;
  mode?: ViewMode;
  variant?: ChipVariant;
  size?: ChipSize;
  icons?: boolean;
  disabled?: 'none' | 'one' | 'all';
}) {
  const [amount, setAmount] = useState(comma(300000));
  const items: ChipItem[] = AMOUNTS.map((v, i) => ({ value: String(v), label: formatMan(v), icon: icons ? 'banknote' : undefined, disabled: disabled === 'one' && i === AMOUNTS.length - 1 }));
  return (
    <TfFieldView look={field} mode={mode} label="예산" description="누르면 금액이 그 값으로 바뀌어요.">
      {(ctl) => (
        <div className="flex flex-col" style={{ gap: field.gap }}>
          <TfInputView look={input} mode={mode} size="large" id={ctl.id} describedBy={ctl.describedBy} value={amount} onValue={setAmount} format="amount" suffix="원" />
          <ChipSuggestLive look={look} mode={mode} variant={variant} size={size} items={items} disabled={disabled === 'all'} ariaLabel="빠른 금액" onPick={(v) => setAmount(comma(Number(v)))} />
        </div>
      )}
    </TfFieldView>
  );
}

export function PeopleField({ look, field, mode = 'auto', size, icons = false, disabled = 'none' }: { look: ChipLook; field: TfFieldLook; mode?: ViewMode; size?: ChipSize; icons?: boolean; disabled?: 'none' | 'one' | 'all' }) {
  const all = PEOPLE.map((p, i) => ({ ...p, icon: icons ? p.icon : undefined, disabled: disabled === 'one' && i === PEOPLE.length - 1 }));
  const [items, setItems] = useState(all.map((p) => p.value));
  const shown = all.filter((p) => items.includes(p.value));
  return (
    <ChipField field={field} mode={mode} label="참여자" description="지우기로 한 명씩 빼요.">
      {(ids) => (
        <div className="flex flex-col gap-2">
          {/* 다 지워도 묶음은 남는다 — 마지막 칩을 지우면 포커스가 묶음으로 오고 묶음이 링을 그린다 */}
          <InputChipGroupLive look={look} mode={mode} size={size} items={shown} disabled={disabled === 'all'} ariaLabelledby={ids.labelledBy} ariaDescribedby={ids.describedBy} onRemove={(v) => setItems((x) => x.filter((y) => y !== v))} />
          {!shown.length && (
            <span className="flex items-center gap-3" style={{ fontSize: look.text.fontSize, lineHeight: look.text.lineHeight, color: t(look, 'fg-neutral-subtle', mode) }}>
              모두 뺐어요.
              <button type="button" className="cursor-pointer underline underline-offset-4" style={{ color: t(look, 'fg-neutral', mode) }} onClick={() => setItems(all.map((p) => p.value))}>
                다시 넣기
              </button>
            </span>
          )}
        </div>
      )}
    </ChipField>
  );
}

// ── 필터 바 — 조건마다 칩, 누르면 그 조건만 시트로(폰 화면 안) ──────────
type FilterState = { period: string; category: string[]; pay: string[] };
const EMPTY: FilterState = { period: 'all', category: [], pay: [] };

function isOn(f: FilterState, c: Cond) {
  return c.kind === 'single' ? f.period !== 'all' : f[c.key as 'category' | 'pay'].length > 0;
}
function chipText(f: FilterState, c: Cond) {
  if (!isOn(f, c)) return c.label;
  if (c.kind === 'single') return labelOf(c, f.period);
  return summarize(f[c.key as 'category' | 'pay'].map((v) => labelOf(c, v)));
}

// 시트 — 그 조건만(Bottom Sheet 고르기: 위 닫기 · 바깥 누르기 · 끌어내리기 · Esc 로 닫힌다). 제목 · 그 조건의 칩(Outline Weak — 시트 안 고르기) · 완료.
// 바뀐 값은 바로 걸린다. 미리보기 화면(frame) 안에 띄운다
function FilterSheet({
  look,
  kit,
  cta,
  mode,
  cond,
  open,
  f,
  setF,
  size,
  onClose,
  container,
  returnFocus,
  id,
}: {
  look: ChipLook;
  kit: OvKit;
  cta: ButtonLook;
  mode: ViewMode;
  cond: Cond | null;
  open: boolean;
  f: FilterState;
  setF: (f: FilterState) => void;
  size?: ChipSize;
  onClose: () => void;
  container: HTMLElement | null;
  returnFocus: () => HTMLElement | null;
  id: string;
}) {
  const titleId = useId();
  if (!cond || !container) return null;
  return (
    <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside="close" drag container={container} onRequestClose={onClose} labelledBy={titleId} returnFocus={returnFocus} focusSelector='[aria-checked="true"]'>
      {({ ref, rootProps, style, maxHeight }) => (
        <SheetSurface ref={ref} rootProps={{ ...rootProps, id }} style={style} maxHeight={maxHeight} look={kit.ov.sheet} mode={mode} title={cond.label} titleId={titleId} onClose={onClose} footer={<SheetButtons mode={mode} items={[{ label: '완료', look: cta, onClick: onClose }]} />}>
          {cond.kind === 'single' ? (
            <ChipRadioGroupLive look={look} mode={mode} variant="outlineWeak" size={size} items={cond.items} value={f.period} onValue={(v) => setF({ ...f, period: v })} ariaLabelledby={titleId} />
          ) : (
            <ChipToggleGroupLive look={look} mode={mode} variant="outlineWeak" size={size} items={cond.items} value={f[cond.key as 'category' | 'pay']} onValue={(v) => setF({ ...f, [cond.key]: v })} ariaLabelledby={titleId} />
          )}
        </SheetSurface>
      )}
    </ModalLayer>
  );
}

function TxRows({ look, mode, f }: { look: ChipLook; mode: ViewMode; f: FilterState }) {
  const months = f.period === 'this' ? [10] : f.period === 'last' ? [9] : [10, 9, 8];
  const rows = TXS.filter((x) => months.includes(x.month) && (!f.category.length || f.category.includes(x.cat)) && (!f.pay.length || f.pay.includes(x.pay)));
  const cat = CONDS[1];
  const pay = CONDS[2];
  if (!rows.length)
    return (
      <p className="py-10 text-center text-[14px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
        조건에 맞는 거래가 없어요.
      </p>
    );
  return (
    <ul className="flex flex-col" aria-label="거래">
      {rows.map((x) => {
        const hue = CAT_HUE[x.cat];
        return (
          <li key={x.title} className="flex items-center gap-3 py-2.5">
            <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[14px] font-bold" style={{ background: t(look, `chart-${hue}-weak` as ChipTone, mode), color: t(look, `chart-${hue}-contrast` as ChipTone, mode) }}>
              {x.title.slice(0, 1)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[15px] font-medium" style={{ color: t(look, 'fg-neutral', mode) }}>
                {x.title}
              </span>
              <span className="truncate text-[13px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
                {labelOf(cat, x.cat)} · {labelOf(pay, x.pay)} · {x.month}월
              </span>
            </span>
            <span className="text-[15px] font-semibold tabular-nums" style={{ color: t(look, 'fg-neutral', mode) }}>
              -{comma(x.amount)}원
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function FilterBarDemo({
  look,
  kit,
  cta,
  mode = 'auto',
  variant = 'solid',
  size,
  icons = false,
  disabled = 'none',
  list = true,
  height,
  keys = ['period', 'category'],
  initial = { period: 'this', category: ['food', 'cafe', 'transport'], pay: [] },
}: {
  look: ChipLook;
  kit: OvKit;
  cta: ButtonLook;
  mode?: ViewMode;
  variant?: ChipVariant;
  size?: ChipSize;
  icons?: boolean;
  disabled?: 'none' | 'one' | 'all';
  list?: boolean;
  height: number;
  // 바에 둘 조건 — chip.md 코드는 기간 · 카테고리
  keys?: Cond['key'][];
  initial?: FilterState;
}) {
  const [f, setF] = useState<FilterState>(initial);
  const [open, setOpen] = useState<Cond['key'] | null>(null);
  // 닫히는 동안에도 시트에 그 조건을 그린다
  const [shownKey, setShownKey] = useState<Cond['key'] | null>(null);
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const openers = useRef(new Map<string, HTMLButtonElement | null>());
  const sheetId = useId();
  const conds = CONDS.filter((c) => keys.includes(c.key));
  const active = conds.filter((c) => isOn(f, c)).length;
  const close = () => setOpen(null);
  const cond = CONDS.find((c) => c.key === shownKey) ?? null;
  const frameStyle: CSSProperties = { position: 'relative', isolation: 'isolate', display: 'flex', flexDirection: 'column', height, overflow: 'hidden', borderRadius: 16, background: t(look, 'bg-layer-default', mode), padding: `16px ${look.scrollRow.padX}px 0`, fontFamily: FONT };
  return (
    <div ref={setFrame} style={frameStyle}>
      <ChipGroupView look={look} mode={mode} layout="scroll" ariaLabel="거래 거르기">
        {active > 0 && (
          <ChipView
            look={look}
            mode={mode}
            variant="outlineStrong"
            size={size}
            icon="rotate-ccw"
            ariaLabel="필터 지우기"
            disabled={disabled === 'all'}
            onClick={() => {
              setF(EMPTY);
              // 지우기 칩이 사라지므로 포커스는 첫 조건 칩으로
              requestAnimationFrame(() => openers.current.get(conds[0].key)?.focus());
            }}
          />
        )}
        {conds.map((c, i) => (
          <ChipView
            key={c.key}
            look={look}
            mode={mode}
            variant={variant}
            size={size}
            selected={isOn(f, c)}
            label={chipText(f, c)}
            prefixIcon={icons ? c.icon : undefined}
            suffixIcon="chevron-down"
            haspopup="dialog"
            expanded={open === c.key}
            controls={open === c.key ? sheetId : undefined}
            disabled={disabled === 'all' || (disabled === 'one' && i === conds.length - 1)}
            buttonRef={(el) => void openers.current.set(c.key, el)}
            onClick={() => {
              setShownKey(c.key);
              setOpen(c.key);
            }}
          />
        ))}
      </ChipGroupView>
      {list && (
        <div className="psa min-h-0 flex-1 overflow-y-auto pt-2" style={{ '--psa-thumb': t(look, 'stroke-neutral-solid', mode) } as CSSProperties}>
          {/* 세로 스크롤바는 숨기지 않는다(scroll-area — 6px 알약, .psa). 모드를 정한 그림은 막대 색을 그 모드 값으로 */}
          <TxRows look={look} mode={mode} f={f} />
        </div>
      )}
      <FilterSheet look={look} kit={kit} cta={cta} mode={mode} cond={cond} open={open !== null} f={f} setF={setF} size={size} onClose={close} container={frame} returnFocus={() => (shownKey ? (openers.current.get(shownKey) ?? null) : null)} id={sheetId} />
    </div>
  );
}

// 코드 미리보기 판 — 회색 판 위 흰 화면(폭 360). 필터 바는 줄이 화면 끝까지 나가므로 안쪽 여백을 따로 두지 않는다
export function DemoFrame({ children, w = 360, pad = true, look, mode = 'auto' }: { children: ReactNode; w?: number; pad?: boolean; look: ChipLook; mode?: ViewMode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto w-full rounded-xl" style={{ maxWidth: w, background: pad ? t(look, 'bg-layer-default', mode) : undefined, padding: pad ? 20 : 0 }}>
          {children}
        </div>
      </div>
    </figure>
  );
}
