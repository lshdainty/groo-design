'use client';
// Bottom Sheet · Dialog · Alert Dialog · Popover 페이지의 실제로 여닫는 미리보기 — 코드 절(ex-*)이 쓴다.
// 표면은 overlay-view, 여닫기는 overlay-live(Esc · 바깥 · 끌기 · 초점 · 스크롤 잠금 · 쌓임)다. 페이지 전체에 띄운다 —
// 시트로만 뜨는 자리(BottomSheet)를 빼면 이 창의 폭이 1280 이상이면 대화상자 · 팝오버, 미만이면 시트다(Responsive Dialog).
// 입력 폼은 바깥 누르기 · 끌기로 닫히지 않고, 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다.
import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { ButtonView } from './button-view';
import type { ChipLook } from './chip-shared';
import { ChipView } from './chip-view';
import { DatePickerView } from './date-view';
import { TODAY, formatDay, formatRange, isComplete, type DateKit, type DateValue, type Day, type RangeValue } from './date-shared';
import type { ListLook, RowSpec } from './list-shared';
import { ListView } from './list-view';
import { ocv, type OvKit, type OvTone, type ViewMode } from './overlay-shared';
import { ModalLayer, PopoverLayer, useMinWidth, type CloseReason } from './overlay-live';
import { AlertSurface, DialogSurface, EndButtons, PopoverSurface, SheetButtons, SheetSurface } from './overlay-view';
import type { SelGroup, SelectLook } from './select-shared';
import { InputButtonView, SelectView } from './select-view';
import type { TfFieldLook, TfInputLook } from './text-field-shared';
import { TfFieldView, TfInputView } from './text-field-view';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const SAFE = 'env(safe-area-inset-bottom, 0px)';
const tone = (kit: OvKit, name: OvTone, mode: ViewMode) => ocv(kit.ov.tone[name], mode);
const comma = (v: number) => v.toLocaleString('ko-KR');

// ── 미리보기 판의 뒤 화면 ──────────────────────────────────
type Tx = { title: string; sub: string; amount: number; hue: 'orange' | 'blue' | 'green' | 'violet'; month: number };
const TXS: Tx[] = [
  { title: '점심 식사', sub: '식비 · 생활비 카드', amount: -12000, hue: 'orange', month: 10 },
  { title: '지하철', sub: '교통 · 교통 체크카드', amount: -1450, hue: 'blue', month: 10 },
  { title: '영화', sub: '문화 · 교통 체크카드', amount: -15000, hue: 'violet', month: 9 },
  { title: '약국', sub: '의료 · 현금', amount: -8200, hue: 'green', month: 9 },
  { title: '운동화', sub: '쇼핑 · 생활비 카드', amount: -89000, hue: 'violet', month: 8 },
];
function TxRow({ kit, mode, tx }: { kit: OvKit; mode: ViewMode; tx: Pick<Tx, 'title' | 'sub' | 'amount' | 'hue'> }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[14px] font-bold" style={{ background: tone(kit, `chart-${tx.hue}-weak` as OvTone, mode), color: tone(kit, `chart-${tx.hue}-contrast` as OvTone, mode) }}>
        {tx.title.slice(0, 1)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium" style={{ color: tone(kit, 'fg-neutral', mode) }}>
          {tx.title}
        </span>
        <span className="truncate text-[13px]" style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}>
          {tx.sub}
        </span>
      </span>
      <span className="text-[15px] font-bold tabular-nums" style={{ color: tone(kit, 'fg-neutral', mode) }}>
        {tx.amount > 0 ? '+' : ''}
        {comma(tx.amount)}원
      </span>
    </li>
  );
}
// 미리보기 판 — 회색 판 위 흰 화면
export function DemoFrame({ kit, children, w = 400, mode = 'auto', brand }: { kit: OvKit; children: ReactNode; w?: number; mode?: ViewMode; brand?: 'desk' | 'hr' }) {
  return (
    <figure className="not-prose my-6" data-brand={brand}>
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto w-full rounded-xl" style={{ maxWidth: w, background: tone(kit, 'bg-layer-default', mode), padding: 20, fontFamily: FONT }}>
          {children}
        </div>
      </div>
    </figure>
  );
}
const Heading = ({ kit, mode, children, right }: { kit: OvKit; mode: ViewMode; children: ReactNode; right?: ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[17px] font-bold" style={{ color: tone(kit, 'fg-neutral', mode) }}>
      {children}
    </span>
    {right}
  </div>
);

// ── 작성 중 나가기 — 바뀐 값이 있을 때 닫으려 하면 묻는다 ─────────
function LeaveConfirm({ kit, mode, open, description, onStay, onLeave }: { kit: OvKit; mode: ViewMode; open: boolean; description: string; onStay: () => void; onLeave: () => void }) {
  const id = useId();
  const wide = useMinWidth(kit.ov.breakpoint);
  const b = wide ? kit.alert.above : kit.alert.below;
  return (
    <ModalLayer open={open} kind="alert" look={kit.ov} mode={mode} outside="ignore" onRequestClose={onStay} labelledBy={`${id}t`} describedBy={`${id}d`}>
      {({ ref, rootProps, style }) => (
        <AlertSurface
          ref={ref}
          rootProps={rootProps}
          style={style}
          look={kit.ov.alert}
          mode={mode}
          title="작성한 내용이 사라져요"
          description={description}
          titleId={`${id}t`}
          descId={`${id}d`}
          cancel={{ label: '계속 작성', look: b.weak, onClick: onStay }}
          confirm={{ label: '나가기', look: b.critical, onClick: onLeave }}
        />
      )}
    </ModalLayer>
  );
}

// 입력 폼 닫기 — 바깥 누르기 · 끌기는 무시, 닫기 버튼 · 취소 · Esc 는 바뀐 값이 있으면 먼저 묻는다
function useFormClose(dirty: boolean, close: () => void) {
  const [asking, setAsking] = useState(false);
  const request = (reason: CloseReason) => {
    if (reason === 'outside' || reason === 'drag') return;
    if (dirty) setAsking(true);
    else close();
  };
  return { asking, request, stay: () => setAsking(false), leave: () => (setAsking(false), close()) };
}

// ── Bottom Sheet — 고르기(기간) ────────────────────────────
export const PERIOD_ITEMS = [
  { value: 'this', label: '이번 달', months: [10] },
  { value: 'last', label: '지난 달', months: [9] },
  { value: 'q', label: '최근 3개월', months: [10, 9, 8] },
];
export function PeriodPickDemo({ kit, chip, list, mode = 'auto' }: { kit: OvKit; chip: ChipLook; list: ListLook; mode?: ViewMode }) {
  const [applied, setApplied] = useState('this');
  const [draft, setDraft] = useState('this');
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const cur = PERIOD_ITEMS.find((p) => p.value === applied)!;
  const rows: RowSpec[] = PERIOD_ITEMS.map((p) => ({ kind: 'radio', title: p.label, value: p.value, checked: p.value === draft }));
  return (
    <DemoFrame kit={kit} mode={mode}>
      <Heading
        kit={kit}
        mode={mode}
        right={
          <ChipView
            look={chip}
            mode={mode}
            variant="solid"
            selected
            label={cur.label}
            suffixIcon="chevron-down"
            haspopup="dialog"
            expanded={open}
            controls={open ? `${id}sheet` : undefined}
            buttonRef={(el) => void (trigger.current = el)}
            onClick={() => {
              setDraft(applied);
              setOpen(true);
            }}
          />
        }
      >
        가계부
      </Heading>
      <ul className="mt-2 flex flex-col">
        {TXS.filter((t) => cur.months.includes(t.month)).map((t) => (
          <TxRow key={t.title} kit={kit} mode={mode} tx={t} />
        ))}
      </ul>
      <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside="close" drag onRequestClose={() => setOpen(false)} labelledBy={`${id}t`} describedBy={`${id}d`} returnFocus={() => trigger.current}>
        {({ ref, rootProps, style, maxHeight }) => (
          <SheetSurface
            ref={ref}
            rootProps={{ ...rootProps, id: `${id}sheet` }}
            style={style}
            maxHeight={maxHeight}
            look={kit.ov.sheet}
            mode={mode}
            title="기간"
            description="고른 기간의 거래만 보여요."
            titleId={`${id}t`}
            descId={`${id}d`}
            onClose={() => setOpen(false)}
            bodyPad={false}
            safe={SAFE}
            footer={
              <SheetButtons
                mode={mode}
                items={[
                  { label: '초기화', look: kit.sheet.weak, onClick: () => setDraft('this') },
                  {
                    label: '적용',
                    look: kit.sheet.solid,
                    onClick: () => {
                      setApplied(draft);
                      setOpen(false);
                    },
                  },
                ]}
              />
            }
          >
            <ListView look={list} rows={rows} value={draft} onValue={setDraft} mode={mode} ariaLabel="기간" />
          </SheetSurface>
        )}
      </ModalLayer>
    </DemoFrame>
  );
}

// ── 날짜 칸 — 시트 안에서는 시트로, 대화상자 안에서는 팝오버로 연다(Input Button 의 1280) ─────
// 달력은 Date Picker(date-picker.yaml) — 하루는 한 달, 기간은 시트에서 이어지는 달 · 팝오버에서 두 달. "완료" 로 넣는다
function DateField({
  kit,
  date,
  sel,
  field,
  mode,
  label,
  value,
  onValue,
  range = false,
}: {
  kit: OvKit;
  date: DateKit;
  sel: SelectLook;
  field: TfFieldLook;
  mode: ViewMode;
  label: string;
  value: DateValue;
  onValue: (v: DateValue) => void;
  // 기간 — 시작 · 끝을 한 달력에서. 둘을 다 고르기 전에는 "완료" 를 막는다
  range?: boolean;
}) {
  const wide = useMinWidth(kit.ov.breakpoint);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateValue>(undefined);
  const btn = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const selection = range ? 'range' : 'single';
  const r = value as RangeValue | undefined;
  const text = range ? (r?.start && r.end ? formatRange({ start: r.start, end: r.end }) : '') : value ? formatDay(value as Day) : '';
  const title = range ? '기간 선택' : '날짜 선택';
  const visible = range ? (wide ? 'twoMonths' : 'continuous') : 'month';
  const ready = isComplete(selection, draft);
  // 닫힌 뒤 초점은 칸으로(팝오버는 스스로 돌려주지 않는다)
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btn.current?.focus());
  };
  const done = () => {
    if (!ready) return;
    onValue(draft);
    close();
  };
  const cal = <DatePickerView kit={date} mode={mode} live autoFocus selection={selection} visibleRange={visible} value={draft} onValue={setDraft} width={wide ? undefined : '100%'} fill={visible === 'continuous'} ariaLabel={label} />;
  const buttons = (b: OvKit['sheet']) => [...(range ? [{ label: '초기화', look: b.weak, onClick: () => setDraft(undefined) }] : []), { label: '완료', look: b.solid, onClick: done, state: ready ? undefined : ('disabled' as const) }];
  const popW = visible === 'twoMonths' ? date.date.twoMonths.width + kit.ov.popover.body.padX * 2 : undefined;
  return (
    <>
      <TfFieldView look={field} mode={mode} label={label}>
        {(ctl) => (
          <InputButtonView
            look={sel}
            mode={mode}
            id={ctl.id}
            describedBy={ctl.describedBy}
            ariaLabel={`${label}, ${text || title}`}
            buttonRef={btn}
            value={text}
            placeholder={title}
            suffixIcon="calendar"
            haspopup="dialog"
            expanded={open}
            onClick={() => {
              setDraft(value);
              setOpen(true);
            }}
          />
        )}
      </TfFieldView>
      {wide ? (
        <PopoverLayer open={open} anchor={btn.current} look={kit.ov.popover} mode={mode} onRequestClose={close} ariaLabel={title}>
          {({ ref, rootProps, style: st, maxHeight, avail }) => (
            <PopoverSurface ref={ref} rootProps={rootProps} style={popW ? { ...st, maxWidth: popW } : st} maxHeight={maxHeight} avail={popW ? undefined : avail} look={kit.ov.popover} mode={mode} footer={<EndButtons mode={mode} items={buttons(kit.dialog)} />}>
              {cal}
            </PopoverSurface>
          )}
        </PopoverLayer>
      ) : (
        <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside="close" drag={visible !== 'continuous'} onRequestClose={() => setOpen(false)} labelledBy={`${id}t`} returnFocus={() => btn.current} focusSelector="[data-autofocus]">
          {({ ref, rootProps, style: st, maxHeight }) => (
            <SheetSurface
              ref={ref}
              rootProps={rootProps}
              style={visible === 'continuous' ? { ...st, height: maxHeight } : st}
              maxHeight={maxHeight}
              look={kit.ov.sheet}
              mode={mode}
              title={title}
              titleId={`${id}t`}
              onClose={() => setOpen(false)}
              safe={SAFE}
              bodyStyle={visible === 'continuous' ? { display: 'flex', flexDirection: 'column' } : undefined}
              footer={<SheetButtons mode={mode} items={buttons(kit.sheet)} />}
            >
              {cal}
            </SheetSurface>
          )}
        </ModalLayer>
      )}
    </>
  );
}

// ── Bottom Sheet — 입력 폼(거래 추가) ───────────────────────
// 시트로만 뜬다(BottomSheet form) — 위 닫기 + 바닥 저장, 바깥 누르기 · 끌기로 닫히지 않는다
export function TxFormSheetDemo({ kit, date, sel, field, input, mode = 'auto', cta }: { kit: OvKit; date: DateKit; sel: SelectLook; field: TfFieldLook; input: TfInputLook; mode?: ViewMode; cta: OvKit['sheet']['solid'] }) {
  const [saved, setSaved] = useState<{ amount: number; day: Day }[]>([]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState<DateValue>(TODAY);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const dirty = amount !== '' || day !== TODAY;
  const reset = () => {
    setAmount('');
    setDay(TODAY);
  };
  const close = () => {
    setOpen(false);
    reset();
  };
  const guard = useFormClose(dirty, close);
  const value = Number(amount.replace(/[^0-9]/g, ''));
  return (
    <DemoFrame kit={kit} mode={mode}>
      <Heading
        kit={kit}
        mode={mode}
        right={
          <span ref={(el) => void (trigger.current = el?.querySelector('button') ?? null)}>
            <ButtonView look={cta} mode={mode} label="거래 추가" prefix="plus" onClick={() => setOpen(true)} />
          </span>
        }
      >
        가계부
      </Heading>
      <ul className="mt-2 flex flex-col">
        {saved.map((s, i) => (
          <TxRow key={i} kit={kit} mode={mode} tx={{ title: '새 거래', sub: formatDay(s.day), amount: -s.amount, hue: 'green' }} />
        ))}
        {TXS.slice(0, 2).map((t) => (
          <TxRow key={t.title} kit={kit} mode={mode} tx={t} />
        ))}
      </ul>
      <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside="ignore" onRequestClose={guard.request} labelledBy={`${id}t`} returnFocus={() => trigger.current}>
        {({ ref, rootProps, style, maxHeight }) => (
          <SheetSurface
            ref={ref}
            rootProps={rootProps}
            style={style}
            maxHeight={maxHeight}
            look={kit.ov.sheet}
            mode={mode}
            title="거래 추가"
            titleId={`${id}t`}
            onClose={() => guard.request('close')}
            safe={SAFE}
            footer={
              <SheetButtons
                mode={mode}
                items={[
                  {
                    label: '저장',
                    look: kit.sheet.solid,
                    onClick: () => {
                      if (value > 0) setSaved((x) => [{ amount: value, day: (day as Day | undefined) ?? TODAY }, ...x]);
                      close();
                    },
                  },
                ]}
              />
            }
          >
            <div className="flex flex-col" style={{ gap: field.form.gapY }}>
              <TfFieldView look={field} mode={mode} label="금액">
                {(ctl) => <TfInputView look={input} mode={mode} size="large" id={ctl.id} describedBy={ctl.describedBy} value={amount} onValue={setAmount} format="amount" suffix="원" placeholder="0" />}
              </TfFieldView>
              <DateField kit={kit} date={date} sel={sel} field={field} mode={mode} label="날짜" value={day} onValue={setDay} />
            </div>
          </SheetSurface>
        )}
      </ModalLayer>
      <LeaveConfirm kit={kit} mode={mode} open={guard.asking} description="나가면 입력한 금액과 날짜가 저장되지 않아요." onStay={guard.stay} onLeave={guard.leave} />
    </DemoFrame>
  );
}

// ── Responsive Dialog — 1280 이상 대화상자 · 미만 시트, 머리 · 본문 · 바닥은 같다 ─────────
// form 이면 대화상자는 바닥 취소(머리 닫기 없음) · 시트는 위 닫기(바닥 취소 없음). 조회는 둘 다 위 닫기.
// fog 는 본문 끝 흐림(scrollFog) — 넘칠 수 있는 본문에 걸고, 걸면 두 표면 모두 늘 켜진 위 · 아래 흐림이다
export function ResponsiveLayer({
  kit,
  mode,
  open,
  form,
  onRequestClose,
  title,
  description,
  children,
  bodyPad = true,
  fog = false,
  submit,
  trigger,
}: {
  kit: OvKit;
  mode: ViewMode;
  open: boolean;
  form: boolean;
  onRequestClose: (r: CloseReason) => void;
  title: string;
  description?: string;
  children: ReactNode;
  bodyPad?: boolean;
  fog?: boolean;
  // 입력 폼의 주 버튼(신청 · 저장)
  submit?: { label: string; onClick: () => void; brand?: boolean };
  trigger: () => HTMLElement | null;
}) {
  const wide = useMinWidth(kit.ov.breakpoint);
  const id = useId();
  const head = { titleId: `${id}t`, descId: description ? `${id}d` : undefined };
  if (wide)
    return (
      <ModalLayer open={open} kind="dialog" look={kit.ov} mode={mode} outside={form ? 'ignore' : 'close'} onRequestClose={onRequestClose} labelledBy={head.titleId} describedBy={head.descId} returnFocus={trigger}>
        {({ ref, rootProps, style, maxHeight }) => (
          <DialogSurface
            ref={ref}
            rootProps={rootProps}
            style={style}
            maxHeight={maxHeight}
            look={kit.ov.dialog}
            mode={mode}
            title={title}
            description={description}
            {...head}
            close={!form}
            onClose={() => onRequestClose('close')}
            bodyPad={bodyPad}
            fog={fog}
            footer={
              submit && (
                <EndButtons
                  mode={mode}
                  items={[
                    { label: '취소', look: kit.dialog.weak, onClick: () => onRequestClose('close') },
                    { label: submit.label, look: submit.brand ? kit.dialog.brand : kit.dialog.solid, onClick: submit.onClick },
                  ]}
                />
              )
            }
          >
            {children}
          </DialogSurface>
        )}
      </ModalLayer>
    );
  return (
    <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside={form ? 'ignore' : 'close'} drag={!form} onRequestClose={onRequestClose} labelledBy={head.titleId} describedBy={head.descId} returnFocus={trigger}>
      {({ ref, rootProps, style, maxHeight }) => (
        <SheetSurface
          ref={ref}
          rootProps={rootProps}
          style={style}
          maxHeight={maxHeight}
          look={kit.ov.sheet}
          mode={mode}
          title={title}
          description={description}
          {...head}
          onClose={() => onRequestClose('close')}
          bodyPad={bodyPad}
          fog={fog}
          safe={SAFE}
          footer={submit && <SheetButtons mode={mode} items={[{ label: submit.label, look: submit.brand ? kit.sheet.brand : kit.sheet.solid, onClick: submit.onClick }]} />}
        >
          {children}
        </SheetSurface>
      )}
    </ModalLayer>
  );
}

// ── Dialog — 입력 폼(HR 휴가 신청) ──────────────────────────
export const POLICY_GROUPS: SelGroup[] = [
  {
    items: [
      { value: 'annual', label: '연차', description: '남은 연차 11일' },
      { value: 'half-am', label: '반차(오전)' },
      { value: 'half-pm', label: '반차(오후)' },
      { value: 'family', label: '경조 휴가' },
      { value: 'sick', label: '병가' },
    ],
  },
];
const LEAVE: RangeValue = { start: { y: 2026, m: 10, d: 12 }, end: { y: 2026, m: 10, d: 13 } };
export function LeaveDialogDemo({ kit, date, sel, field, mode = 'auto', trigger: trigLook }: { kit: OvKit; date: DateKit; sel: SelectLook; field: TfFieldLook; mode?: ViewMode; trigger: OvKit['dialog']['solid'] }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<string[]>([]);
  const [period, setPeriod] = useState<DateValue>(LEAVE);
  const [sent, setSent] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const dirty = kind.length > 0 || period !== LEAVE;
  const close = () => {
    setOpen(false);
    setKind([]);
    setPeriod(LEAVE);
  };
  const guard = useFormClose(dirty, close);
  const label = (v: string) => POLICY_GROUPS[0].items.find((i) => i.value === v)?.label ?? '';
  return (
    <DemoFrame kit={kit} mode={mode} brand="hr">
      <Heading
        kit={kit}
        mode={mode}
        right={
          <span ref={(el) => void (trigger.current = el?.querySelector('button') ?? null)}>
            <ButtonView look={trigLook} mode={mode} label="휴가 신청" onClick={() => setOpen(true)} />
          </span>
        }
      >
        휴가
      </Heading>
      <p className="mt-3 text-[14px] leading-5" style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}>
        {sent ?? '남은 연차 11일'}
      </p>
      <ResponsiveLayer
        kit={kit}
        mode={mode}
        open={open}
        form
        onRequestClose={guard.request}
        title="휴가 신청"
        description="승인되면 알려드려요."
        trigger={() => trigger.current}
        submit={{
          label: '신청',
          brand: true,
          onClick: () => {
            const r = period as RangeValue;
            setSent(`${label(kind[0] ?? 'annual')} 신청 — ${r.start && r.end ? formatRange({ start: r.start, end: r.end }) : ''}, 승인을 기다려요.`);
            close();
          },
        }}
      >
        <div className="flex flex-col" style={{ gap: field.form.gapY }}>
          <TfFieldView look={field} mode={mode} label="휴가 종류">
            {(ctl) => <SelectView look={sel} mode={mode} groups={POLICY_GROUPS} placeholder="휴가 종류 선택" value={kind} onValue={setKind} id={ctl.id} describedBy={ctl.describedBy} />}
          </TfFieldView>
          <DateField kit={kit} date={date} sel={sel} field={field} mode={mode} label="기간" value={period} onValue={setPeriod} range />
        </div>
      </ResponsiveLayer>
      <LeaveConfirm kit={kit} mode={mode} open={guard.asking} description="나가면 입력한 내용이 저장되지 않아요." onStay={guard.stay} onLeave={guard.leave} />
    </DemoFrame>
  );
}

// ── Dialog — 조회(거래 상세) ───────────────────────────────
export function DetailDialogDemo({ kit, list, rows, mode = 'auto' }: { kit: OvKit; list: ListLook; rows: RowSpec[]; mode?: ViewMode }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  return (
    <DemoFrame kit={kit} mode={mode}>
      <Heading kit={kit} mode={mode}>
        가계부
      </Heading>
      <ul className="mt-2 flex flex-col">
        <li>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="w-full cursor-pointer rounded-lg border-0 bg-transparent p-0 text-left"
            ref={(el) => void (trigger.current = el)}
            onClick={() => setOpen(true)}
            style={{ fontFamily: FONT }}
          >
            <ul className="m-0 p-0">
              <TxRow kit={kit} mode={mode} tx={TXS[0]} />
            </ul>
          </button>
        </li>
        <TxRow kit={kit} mode={mode} tx={TXS[1]} />
      </ul>
      {/* 길이가 데이터에 따라 느는 본문 — scrollFog(위 · 아래 끝 흐림, 늘 켜짐) */}
      <ResponsiveLayer kit={kit} mode={mode} open={open} form={false} onRequestClose={() => setOpen(false)} title="거래 상세" bodyPad={false} fog trigger={() => trigger.current}>
        <ListView look={list} rows={rows} mode={mode} live={false} />
      </ResponsiveLayer>
    </DemoFrame>
  );
}

// ── Alert Dialog — 지우기 · 작성 중 나가기 ───────────────────
export function AlertDemo({ kit, mode = 'auto', kind }: { kit: OvKit; mode?: ViewMode; kind: 'delete' | 'leave' }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(TXS.slice(0, 3));
  const [memo, setMemo] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const wide = useMinWidth(kit.ov.breakpoint);
  const b = wide ? kit.alert.above : kit.alert.below;
  const id = useId();
  const trigger = useRef<HTMLElement | null>(null);
  const del = kind === 'delete';
  return (
    <DemoFrame kit={kit} mode={mode}>
      {del ? (
        <>
          <Heading kit={kit} mode={mode}>
            가계부
          </Heading>
          <ul className="mt-2 flex flex-col">
            {rows.map((t) => (
              <TxRow key={t.title} kit={kit} mode={mode} tx={t} />
            ))}
          </ul>
          {rows.length ? (
            <span ref={(el) => void (trigger.current = el?.querySelector('button') ?? null)}>
              <ButtonView look={kit.dialog.weak} mode={mode} label={`${rows[0].title} 삭제`} onClick={() => setOpen(true)} />
            </span>
          ) : (
            <span className="text-[14px]" style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}>
              모두 삭제했어요.{' '}
              <button type="button" className="cursor-pointer underline underline-offset-4" style={{ color: tone(kit, 'fg-neutral', mode) }} onClick={() => setRows(TXS.slice(0, 3))}>
                다시 넣기
              </button>
            </span>
          )}
        </>
      ) : (
        <>
          <Heading kit={kit} mode={mode}>
            메모 쓰기
          </Heading>
          <textarea
            aria-label="메모"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="아무 글이나 쓰고 나가기를 눌러 보세요."
            rows={3}
            className="mt-3 w-full resize-none rounded-xl p-3 text-[15px] outline-none"
            style={{ background: tone(kit, 'bg-neutral-weak', mode), color: tone(kit, 'fg-neutral', mode), fontFamily: FONT, border: 0 }}
          />
          <div className="mt-3 flex items-center gap-3">
            <span ref={(el) => void (trigger.current = el?.querySelector('button') ?? null)}>
              <ButtonView look={kit.dialog.weak} mode={mode} label="나가기" onClick={() => (memo ? setOpen(true) : setNote('바뀐 값이 없어 묻지 않고 나갔어요.'))} />
            </span>
            {note && (
              <span className="text-[13px]" style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}>
                {note}
              </span>
            )}
          </div>
        </>
      )}
      <ModalLayer open={open} kind="alert" look={kit.ov} mode={mode} outside="ignore" onRequestClose={() => setOpen(false)} labelledBy={`${id}t`} describedBy={`${id}d`} returnFocus={() => trigger.current}>
        {({ ref, rootProps, style }) => (
          <AlertSurface
            ref={ref}
            rootProps={rootProps}
            style={style}
            look={kit.ov.alert}
            mode={mode}
            titleId={`${id}t`}
            descId={`${id}d`}
            title={del ? '거래를 삭제할까요?' : '작성한 내용이 사라져요'}
            description={del ? `${rows[0]?.month ?? 10}월 ${rows[0]?.title ?? ''} ${comma(Math.abs(rows[0]?.amount ?? 0))}원 거래를 지워요. 삭제한 거래는 되돌릴 수 없어요.` : '나가면 쓴 메모가 저장되지 않아요.'}
            cancel={{ label: del ? '취소' : '계속 작성', look: b.weak, onClick: () => setOpen(false) }}
            confirm={{
              label: del ? '삭제' : '나가기',
              look: b.critical,
              onClick: () => {
                setOpen(false);
                if (del) setRows((r) => r.slice(1));
                else {
                  setMemo('');
                  setNote('쓴 메모를 버리고 나갔어요.');
                }
              },
            }}
          />
        )}
      </ModalLayer>
    </DemoFrame>
  );
}

// ── Popover — 안내(HR 연차 사용 규정) ────────────────────────
// 1280 이상은 아이콘 아래 팝오버(초점은 안으로 · 가두지 않음 · Tab 으로 나가면 닫힘), 미만은 같은 내용을 시트로(조회 — 위 닫기)
export function RulePopoverDemo({ kit, mode = 'auto', text, field }: { kit: OvKit; mode?: ViewMode; text: string; field: TfFieldLook }) {
  const wide = useMinWidth(kit.ov.breakpoint);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const p = kit.ov.popover;
  const body = <p style={{ margin: 0, fontFamily: p.description.fontFamily, fontSize: p.description.fontSize, lineHeight: p.description.lineHeight, color: ocv(p.description.color, mode) }}>{text}</p>;
  const label: CSSProperties = { fontFamily: field.label.text.fontFamily, fontSize: field.label.text.fontSize, lineHeight: field.label.text.lineHeight, fontWeight: field.label.weight.medium, color: tone(kit, 'fg-neutral', mode) };
  return (
    <DemoFrame kit={kit} mode={mode} brand="hr">
      <div className="flex items-center gap-1">
        <span style={label}>연차 사용 규정</span>
        <button
          ref={btn}
          type="button"
          aria-label="연차 사용 규정"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? `${id}pop` : undefined}
          onClick={() => setOpen((o) => !o)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent"
          style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}
        >
          <Info aria-hidden size={18} strokeWidth={2} />
        </button>
      </div>
      <p className="mt-1 text-[14px] leading-5" style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}>
        남은 연차 11일 · 올해 쓴 연차 4일
      </p>
      <button type="button" className="mt-3 cursor-pointer rounded-md border-0 bg-transparent p-0 text-[14px] underline underline-offset-4" style={{ color: tone(kit, 'fg-neutral', mode), fontFamily: FONT }}>
        휴가 내역 보기
      </button>
      {wide ? (
        <PopoverLayer open={open} anchor={btn.current} look={p} mode={mode} align="center" id={`${id}pop`} labelledBy={`${id}t`} onRequestClose={() => setOpen(false)}>
          {({ ref, rootProps, style, maxHeight, avail }) => (
            <PopoverSurface ref={ref} rootProps={rootProps} style={style} maxHeight={maxHeight} avail={avail} look={p} mode={mode} title="연차 사용 규정" titleId={`${id}t`} onClose={() => (setOpen(false), btn.current?.focus())}>
              {body}
            </PopoverSurface>
          )}
        </PopoverLayer>
      ) : (
        <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} outside="close" drag onRequestClose={() => setOpen(false)} labelledBy={`${id}t`} returnFocus={() => btn.current}>
          {({ ref, rootProps, style, maxHeight }) => (
            <SheetSurface ref={ref} rootProps={{ ...rootProps, id: `${id}pop` }} style={style} maxHeight={maxHeight} look={kit.ov.sheet} mode={mode} title="연차 사용 규정" titleId={`${id}t`} onClose={() => setOpen(false)} safe={SAFE}>
              {body}
            </SheetSurface>
          )}
        </ModalLayer>
      )}
    </DemoFrame>
  );
}

