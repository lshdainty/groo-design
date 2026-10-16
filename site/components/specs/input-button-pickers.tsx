'use client';
// Input Button 이 여는 자리 — 시트(1280 미만) · 팝오버(1280 이상)와 그 안의 달력 · 격자 · 검색 목록.
// 시트 · 팝오버는 Bottom Sheet · Popover 스펙(bottom-sheet · popover.yaml — overlay-view · overlay-live)대로 그린다.
// 달력은 Date Picker(date-picker.yaml — date-view), 칸(Input Button)과 Field 는 YAML 대로다(select-view · text-field-view).
// 카테고리 격자 · 사람 목록은 아직 스펙이 없다 — 역할 색 토큰으로 간단히 그린다.
import { useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import { CATEGORIES, PEOPLE, catText, type CatItem, type Person } from './input-button-data';
import type { AvatarLook } from './display-shared';
import { AvatarView } from './display-view';
import { TODAY, formatDay, type DateKit, type Day } from './date-shared';
import { DatePickerView } from './date-view';
import type { OvKit, OverlayLook } from './overlay-shared';
import { ModalLayer, PopoverLayer, useMinWidth } from './overlay-live';
import { DimView, PopoverSurface, SheetSurface } from './overlay-view';
import { scv, type SelIcon, type SelSizeProp, type SelTone, type SelectLook, type ViewMode } from './select-shared';
import { InputButtonView, SelIconView, labelFocusOnly } from './select-view';
import type { TfFieldLook, TfInputLook } from './text-field-shared';
import { TfFieldView, TfInputView } from './text-field-view';
import { SearchableListView } from './data-search-view';
import type { SearchLook } from './data-shared';

const tone = (look: SelectLook, name: SelTone, mode: ViewMode) => scv(look.tone[name], mode);
const FONT = "'Pretendard Variable', Pretendard, sans-serif";

// ── 시트 · 팝오버의 판(멈춘 그림) ──────────────────────────
// 시트 — 제목(고를 값의 종류) · 위 닫기, 아래에 확정 버튼(있을 때만). 사람 목록처럼 줄이 화면 여백을 가지면 본문 여백을 뺀다(bodyPad)
export function SheetPanel({ ov, mode = 'auto', title, children, footer, bodyPad = true, safe }: { ov: OverlayLook; mode?: ViewMode; title: string; children: ReactNode; footer?: ReactNode; bodyPad?: boolean; safe?: number }) {
  return (
    <SheetSurface look={ov.sheet} mode={mode} title={title} footer={footer} bodyPad={bodyPad} safe={safe}>
      {children}
    </SheetSurface>
  );
}

// 시트를 폰 화면 위에 — 딤 위 아래쪽
export function SheetOverlay({ ov, mode = 'auto', children }: { ov: OverlayLook; mode?: ViewMode; children: ReactNode }) {
  return (
    <DimView dim={ov.sheet.dim} mode={mode} place="end">
      {children}
    </DimView>
  );
}

// 팝오버 — 머리 없는 고르는 패널(무엇을 고르는지는 칸이 말한다), 아래에 확정 버튼(있을 때만)
export function PopoverPanel({ ov, mode = 'auto', children, footer, width, bodyPad = true }: { ov: OverlayLook; mode?: ViewMode; children: ReactNode; footer?: ReactNode; width?: number | string; bodyPad?: boolean }) {
  return (
    <PopoverSurface look={ov.popover} mode={mode} footer={footer} width={width} bodyPad={bodyPad} scroll={{ scrolled: false }}>
      {children}
    </PopoverSurface>
  );
}

// ── 격자 · 사람 목록(그림 · 실제 둘 다) ─────────────
// 카테고리 격자 — 묶음 제목 아래 아이콘 칸. 고른 칸은 체크
export function CategoryGrid({ look, mode = 'auto', items = CATEGORIES, selected, pressed, onPick, cellRef }: { look: SelectLook; mode?: ViewMode; items?: CatItem[]; selected?: string; pressed?: string; onPick?: (v: string) => void; cellRef?: (v: string, el: HTMLButtonElement | null) => void }) {
  const groups = [...new Set(items.map((i) => i.group))];
  return (
    <div className="flex flex-col gap-3" style={{ fontFamily: FONT }}>
      {groups.map((g) => (
        <div key={g} className="flex flex-col gap-1">
          <span className="px-2 text-[13px] font-medium leading-[18px]" style={{ color: tone(look, 'fg-neutral-subtle', mode) }}>
            {g}
          </span>
          <div className="grid grid-cols-4">
            {items
              .filter((i) => i.group === g)
              .map((i) => {
                const on = i.value === selected;
                const body = (
                  <>
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-[13px]" style={{ background: tone(look, `chart-${i.hue}-weak` as SelTone, mode) }}>
                      <SelIconView name={i.icon} size={22} color={tone(look, `chart-${i.hue}-contrast` as SelTone, mode)} />
                      {on && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full" style={{ background: tone(look, 'bg-neutral-inverted', mode), boxShadow: `0 0 0 2px ${tone(look, 'bg-layer-floating', mode)}` }}>
                          <Check aria-hidden size={11} strokeWidth={3} style={{ color: tone(look, 'fg-neutral-inverted', mode) }} />
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] leading-[18px]" style={{ color: tone(look, 'fg-neutral', mode), fontWeight: on ? 700 : 400 }}>
                      {i.label}
                    </span>
                  </>
                );
                const style: CSSProperties = { background: i.value === pressed ? tone(look, 'bg-layer-floating-pressed', mode) : 'transparent', fontFamily: FONT };
                return onPick ? (
                  <button key={i.value} ref={(el) => cellRef?.(i.value, el)} type="button" aria-pressed={on} aria-label={catText(i)} onClick={() => onPick(i.value)} className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-0 py-2" style={style}>
                    {body}
                  </button>
                ) : (
                  <span key={i.value} className="flex flex-col items-center gap-1.5 rounded-xl py-2" style={style}>
                    {body}
                  </span>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

// 사람 — 결재자 · 참조자
export function PeopleList({ look, avatar, mode = 'auto', people, query = '', selected, onPick, rowRef }: { look: SelectLook; avatar: AvatarLook; mode?: ViewMode; people: Person[]; query?: string; selected?: string; onPick?: (v: string) => void; rowRef?: (v: string, el: HTMLButtonElement | null) => void }) {
  const fg = tone(look, 'fg-neutral', mode);
  const sub = tone(look, 'fg-neutral-subtle', mode);
  if (!people.length)
    return (
      <p className="px-6 py-6 text-center text-[15px]" style={{ color: sub, fontFamily: FONT }}>
        &lsquo;{query}&rsquo;(으)로 찾은 사람이 없어요.
      </p>
    );
  return (
    <div className="flex flex-col" style={{ fontFamily: FONT }}>
      {people.map((p) => {
        const on = p.value === selected;
        const body = (
          <>
            {/* 사람 — Avatar 42(이름 + 팀 두 줄). 이름이 옆에 있어 장식 */}
            <AvatarView look={avatar} mode={mode} size="42" name={p.name} />
            <span className="flex min-w-0 flex-1 flex-col text-left">
              <span className="text-[16px] leading-[22px]" style={{ color: fg }}>
                {query && p.name.startsWith(query) ? (
                  <>
                    <b>{query}</b>
                    {p.name.slice(query.length)}
                  </>
                ) : (
                  p.name
                )}
              </span>
              <span className="text-[13px] leading-[18px]" style={{ color: sub }}>
                {p.team}
              </span>
            </span>
            {on && <Check aria-hidden size={16} strokeWidth={2.5} style={{ color: fg, flexShrink: 0 }} />}
          </>
        );
        return onPick ? (
          <button key={p.value} ref={(el) => rowRef?.(p.value, el)} type="button" aria-pressed={on} onClick={() => onPick(p.value)} className="flex cursor-pointer items-center gap-3 border-0 bg-transparent px-6 py-2.5" style={{ fontFamily: FONT }}>
            {body}
          </button>
        ) : (
          <span key={p.value} className="flex items-center gap-3 px-6 py-2.5">
            {body}
          </span>
        );
      })}
    </div>
  );
}

// ── 실제로 여는 자리 ─────────────────────────────────────
// 1280 미만은 아래 시트(Bottom Sheet — 고르기: 위 닫기 · 바깥 누르기 · 끌어내리기 · Esc 로 닫힌다), 이상은 칸 아래 8 의 팝오버
// (Popover — 칸 왼쪽에 맞추고 아래가 모자라면 위로 · 바깥 · Esc · Tab 으로 빠져나가면 닫힌다). 열면 고른 날 · 고른 칸 · 검색칸으로 초점이 간다
export function IbSurface({
  kit,
  mode,
  open,
  onClose,
  anchor,
  title,
  children,
  footer,
  popoverWidth,
  bodyPad = true,
  autoFocus = '[data-autofocus]',
}: {
  kit: OvKit;
  mode: ViewMode;
  open: boolean;
  onClose: () => void;
  anchor: HTMLElement | null;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  popoverWidth?: number;
  bodyPad?: boolean;
  // 열린 뒤 포커스를 받을 것 — 검색칸 · 고른 날 · 고른 칸
  autoFocus?: string;
}) {
  const wide = useMinWidth(kit.ov.breakpoint);
  const titleId = useId();
  const box = anchor?.closest('.psel-box') as HTMLElement | null;
  if (wide)
    return (
      <PopoverLayer open={open} anchor={box} look={kit.ov.popover} mode={mode} align="start" ariaLabel={title} focusSelector={autoFocus} onRequestClose={onClose}>
        {({ ref, rootProps, style, maxHeight, avail }) => (
          <PopoverSurface ref={ref} rootProps={rootProps} style={style} maxHeight={maxHeight} avail={avail} width={popoverWidth} look={kit.ov.popover} mode={mode} footer={footer} bodyPad={bodyPad}>
            {children}
          </PopoverSurface>
        )}
      </PopoverLayer>
    );
  return (
    <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside="close" drag onRequestClose={onClose} labelledBy={titleId} returnFocus={() => anchor} focusSelector={autoFocus}>
      {({ ref, rootProps, style, maxHeight }) => (
        <SheetSurface ref={ref} rootProps={rootProps} style={style} maxHeight={maxHeight} look={kit.ov.sheet} mode={mode} title={title} titleId={titleId} onClose={onClose} footer={footer} bodyPad={bodyPad} safe="env(safe-area-inset-bottom, 0px)">
          {children}
        </SheetSurface>
      )}
    </ModalLayer>
  );
}

// ── Field + Input Button + 여는 자리(실제로 써 보는 칸) ─────────
export type IbDemoKind = 'date' | 'category' | 'people';
export type InputButtonDemoProps = {
  look: SelectLook;
  field: TfFieldLook;
  // 검색칸(people) — input.yaml 의 상자형
  input?: TfInputLook;
  mode?: ViewMode;
  size?: SelSizeProp;
  kind: IbDemoKind;
  label: string;
  placeholder: string;
  indicator?: 'required' | 'optional';
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  // 처음 값 — date 는 2026년 10월의 날("12") 또는 "2026-10-12", category · people 은 value
  initial?: string;
  // 달력(date) — Date Picker 의 모양(date-picker.yaml)
  date?: DateKit;
  // 앞 · 뒤 붙이개 — 카테고리(category)
  affix?: { prefix: 'none' | 'icon' | 'text'; suffix: 'none' | 'icon' };
  // 확정 버튼 — 시트(넓게) · 팝오버(작게)
  done?: { sheet: ButtonLook; popover: ButtonLook };
  width?: number | string;
  // 여는 자리(시트 · 팝오버)의 모양 — bottom-sheet · popover.yaml
  kit: OvKit;
  // 사람(people) 줄의 아바타 — avatar.yaml
  avatar?: AvatarLook;
  // 사람(people) — 검색 시트의 묶음(Searchable List — 위 밑줄형 검색칸 · 아래 List 줄 + 오른쪽 라디오, 콤보박스 키보드)
  search?: SearchLook;
  // 값이 바뀔 때(폼의 바뀐 값 확인)
  onValue?: (v: string | undefined) => void;
};

// 날짜 값 — "2026-10-12"(날만 적으면 2026년 10월)
const toDay = (v?: string): Day | undefined => {
  if (!v) return undefined;
  const p = v.split('-').map(Number);
  return p.length === 3 ? { y: p[0], m: p[1], d: p[2] } : { y: TODAY.y, m: TODAY.m, d: p[0] };
};
const fromDay = (d: Day) => `${d.y}-${d.m}-${d.d}`;

export function InputButtonDemo({
  look,
  field,
  input,
  mode = 'auto',
  size = 'responsive',
  kind,
  label,
  placeholder,
  indicator,
  description,
  errorMessage,
  invalid: invalidProp = false,
  disabled = false,
  readOnly = false,
  clearable = false,
  initial,
  date,
  affix,
  done,
  width,
  kit,
  avatar,
  search,
  onValue,
}: InputButtonDemoProps) {
  const [value, setOwnValue] = useState<string | undefined>(initial);
  const setValue = (v: string | undefined) => {
    setOwnValue(v);
    onValue?.(v);
  };
  const [open, setOpen] = useState(false);
  // 달력에서 고르던 날 — "완료" 를 누를 때 칸에 들어간다
  const [draft, setDraft] = useState<Day | undefined>(undefined);
  const wide = useMinWidth(kit.ov.breakpoint);
  // 붙이개 — 주지 않으면 카테고리의 기본(고른 아이콘 + 아래 화살표)
  const fx = affix ?? { prefix: 'icon', suffix: 'icon' };
  const [query, setQuery] = useState('');
  const [touched, setTouched] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btnRef.current?.focus());
  };
  const commit = (v: string | undefined) => {
    setValue(v);
    setTouched(true);
    close();
  };
  // 오류는 값을 고르면 걷는다
  const invalid = invalidProp && !(touched && value);

  const cat = CATEGORIES.find((c) => c.value === value);
  const person = PEOPLE.find((p) => p.value === value);
  let text: string | undefined;
  let prefix: string | undefined;
  let prefixIcon: SelIcon | undefined;
  let suffixIcon: SelIcon | undefined;
  if (kind === 'date') {
    const day = toDay(value);
    text = day ? formatDay(day) : undefined;
    suffixIcon = 'calendar';
  } else if (kind === 'category') {
    // 앞 붙이개 — 고른 카테고리의 아이콘(값에 딸린 아이콘) · 글자, 뒤 붙이개 — 아래 화살표(격자를 연다)
    text = cat ? catText(cat) : undefined;
    if (fx.prefix === 'icon') prefixIcon = cat?.icon;
    if (fx.prefix === 'text') prefix = '지출';
    if (fx.suffix === 'icon') suffixIcon = 'chevron-down';
  } else {
    text = person?.name;
    suffixIcon = 'chevron-down';
  }

  const filtered = useMemo(() => (query ? PEOPLE.filter((p) => p.name.includes(query) || p.team.includes(query)) : PEOPLE), [query]);
  // "완료" — 하루를 고르기 전에는 막힌다(date-picker.md)
  const doneBtn = (where: 'sheet' | 'popover') =>
    done && (
      <ButtonView
        look={done[where]}
        mode={mode}
        label="완료"
        fill={where === 'sheet'}
        state={draft ? 'live' : 'disabled'}
        onClick={() => {
          if (draft) commit(fromDay(draft));
        }}
      />
    );

  let content: ReactNode = null;
  let footer: ReactNode = null;
  let popoverWidth: number | undefined;
  if (kind === 'date' && date) {
    // 1280 미만 시트는 시트 폭 − 좌우 24, 이상 팝오버는 336(칸 48 × 7). 열면 고른 날(없으면 오늘)로 초점
    content = <DatePickerView kit={date} mode={mode} live autoFocus value={draft} onValue={(v) => setDraft(v as Day | undefined)} width={wide ? undefined : '100%'} ariaLabel={label} />;
    footer = <SurfaceFooter look={look} sheet={doneBtn('sheet')} popover={doneBtn('popover')} />;
  } else if (kind === 'category') {
    content = (
      <CategoryGrid
        look={look}
        mode={mode}
        selected={value}
        onPick={(v) => commit(v)}
        cellRef={(v, el) => {
          if (el && v === (value ?? CATEGORIES[0].value)) el.setAttribute('data-autofocus', '');
          else el?.removeAttribute('data-autofocus');
        }}
      />
    );
    popoverWidth = 360;
  } else {
    popoverWidth = 360;
    // 긴 목록은 검색 시트 — Searchable List(밑줄형 검색칸 · 콤보박스). 고르면 닫힌다("완료" 없음)
    content =
      search && avatar ? (
        <span className="block" data-search>
          <SearchableListView
            look={search}
            mode={mode}
            groups={[{ items: PEOPLE.map((p) => ({ value: p.value, title: p.name, detail: p.team, detailText: p.team })) }]}
            prefixes={Object.fromEntries(PEOPLE.map((p) => [p.value, <AvatarView key={p.value} look={avatar} mode={mode} size={search.prefix.avatar.two} name={p.name} />]))}
            prefixKind="avatar"
            value={value}
            onValueChange={(v) => commit(v)}
            placeholder="이름 · 팀 검색"
            ariaLabel={label}
            live
            onEscapeEmpty={close}
            maxHeight={320}
          />
        </span>
      ) : (
        <div className="flex flex-col gap-2">
          <div style={{ padding: `0 ${kit.ov.popover.body.padX}px` }}>
            {input && (
              <span className="block" data-search>
                <TfInputView look={input} mode={mode} variant="underline" prefixIcon="search" placeholder="이름 · 팀 검색" ariaLabel="검색" value={query} onValue={setQuery} clearable />
              </span>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {avatar && <PeopleList look={look} avatar={avatar} mode={mode} people={filtered} query={query} selected={value} onPick={(v) => commit(v)} />}
          </div>
        </div>
      );
  }

  return (
    <div onClick={labelFocusOnly} style={{ width: width ?? '100%' }}>
      <TfFieldView look={field} mode={mode} label={label} indicator={indicator} description={description} errorMessage={errorMessage} invalid={invalid}>
        {(ctl) => (
          <InputButtonView
            look={look}
            mode={mode}
            size={size}
            id={ctl.id}
            describedBy={ctl.describedBy}
            ariaLabel={`${label}, ${text ?? placeholder}`}
            buttonRef={btnRef}
            invalid={invalid}
            disabled={disabled}
            readOnly={readOnly}
            value={text}
            placeholder={placeholder}
            prefix={prefix}
            prefixIcon={prefixIcon}
            suffixIcon={suffixIcon}
            clearable={clearable}
            onClear={() => setValue(undefined)}
            haspopup="dialog"
            expanded={open}
            onClick={() => {
              setDraft(kind === 'date' ? toDay(value) : undefined);
              setQuery('');
              setOpen(true);
            }}
          />
        )}
      </TfFieldView>
      <IbSurface kit={kit} mode={mode} open={open} onClose={close} anchor={btnRef.current} title={kind === 'date' ? placeholder : label} footer={footer} popoverWidth={popoverWidth} bodyPad={kind !== 'people'} autoFocus={kind === 'people' ? '[data-search] input' : undefined}>
        {content}
      </IbSurface>
    </div>
  );
}

// 확정 버튼 — 시트는 넓은 버튼 하나, 팝오버는 오른쪽에 작은 버튼(폭에 따라 하나만 보인다)
function SurfaceFooter({ look, sheet, popover }: { look: SelectLook; sheet: ReactNode; popover: ReactNode }) {
  const wide = useMinWidth(look.ib.breakpoint);
  return <>{wide ? popover : sheet}</>;
}
