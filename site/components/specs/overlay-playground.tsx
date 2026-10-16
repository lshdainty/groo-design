'use client';
// Bottom Sheet · Dialog · Alert Dialog · Popover 플레이그라운드 — 속성을 고르면 스펙대로 그린 표면과 그 코드가 바뀐다.
// 그림 속 화면(폰 · 데스크톱 창) 안에서 실제로 열고 닫는다 — Esc · 바깥 누르기 · 끌어내리기 · 바뀐 값 묻기 · 본문 스크롤 · 저절로 세로 · Tab 으로 빠져나가기.
// 코드는 각 md 의 "코드" 절과 같은 레시피 API(BottomSheet · ResponsiveDialog · AlertDialog · Popover)로 쓴다.
import { useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { ButtonView } from './button-view';
import { DatePickerView } from './date-view';
import { formatDay, type DateKit, type Day } from './date-shared';
import type { ListLook, RowSpec } from './list-shared';
import { ListView } from './list-view';
import { ocv, type AlertLayout, type OvKit, type OvTone, type ViewMode } from './overlay-shared';
import { ModalLayer, PopoverLayer, type CloseReason } from './overlay-live';
import { AlertSurface, DialogSurface, EndButtons, PopoverSurface, SheetButtons, SheetSurface } from './overlay-view';
import { BRANDS, MODES, Seg } from './select-playground';
import type { SelectLook } from './select-shared';
import type { TfFieldLook, TfInputLook } from './text-field-shared';
import { TfFieldView, TfInputView } from './text-field-view';

type Brand = 'desk' | 'hr';
const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const tone = (kit: OvKit, name: OvTone, mode: ViewMode) => ocv(kit.ov.tone[name], mode);
const attr = (cond: boolean, s: string) => (cond ? [s] : []);

// ── 판 · 그림 속 화면 ──────────────────────────────────────
function Frame({ stage, controls, code, wide = false }: { stage: ReactNode; controls: ReactNode; code: string; wide?: boolean }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex items-center justify-center bg-[#E9E9EC] px-4 py-8 dark:bg-fd-muted">
        <div className="w-full" style={{ maxWidth: wide ? 720 : 360 }}>
          {stage}
        </div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
// 폰 · 데스크톱 창 — 표면은 이 안(absolute)에 뜬다. 앞의 줄은 열 트리거
function Screen({ kit, mode, desktop, height, title, setEl, children }: { kit: OvKit; mode: ViewMode; desktop: boolean; height: number; title: string; setEl: (el: HTMLDivElement | null) => void; children: ReactNode }) {
  return (
    <div
      ref={setEl}
      className="relative w-full overflow-hidden"
      style={{ isolation: 'isolate', height, borderRadius: desktop ? 12 : 28, border: `${desktop ? 1 : 6}px solid ${desktop ? 'var(--p-chrome)' : 'var(--p-frame)'}`, background: tone(kit, desktop ? 'bg-layer-basement' : 'bg-layer-default', mode), fontFamily: FONT }}
    >
      <div className="flex flex-col gap-3" style={{ padding: desktop ? '20px 24px' : '20px 24px 0' }}>
        <span className="text-[17px] font-bold" style={{ color: tone(kit, 'fg-neutral', mode) }}>
          {title}
        </span>
        {children}
      </div>
    </div>
  );
}
function Rows({ kit, mode, n = 4 }: { kit: OvKit; mode: ViewMode; n?: number }) {
  const rows: [string, string, string, 'orange' | 'blue' | 'green' | 'violet'][] = [
    ['점심 식사', '식비 · 현대카드 M', '−12,000원', 'orange'],
    ['지하철', '교통 · 국민 체크카드', '−1,450원', 'blue'],
    ['월급', '수입 · 국민 주계좌', '+3,200,000원', 'green'],
    ['영화', '문화 · 국민 체크카드', '−15,000원', 'violet'],
    ['편의점', '식비 · 현금', '−4,300원', 'orange'],
  ];
  return (
    <div className="flex flex-col rounded-xl" style={{ background: tone(kit, 'bg-layer-default', mode) }}>
      {rows.slice(0, n).map(([t, s, a, hue]) => (
        <div key={t} className="flex items-center gap-3 py-2">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[14px] font-bold" style={{ background: tone(kit, `chart-${hue}-weak` as OvTone, mode), color: tone(kit, `chart-${hue}-contrast` as OvTone, mode) }}>
            {t.slice(0, 1)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-medium" style={{ color: tone(kit, 'fg-neutral', mode) }}>
              {t}
            </span>
            <span className="truncate text-[13px]" style={{ color: tone(kit, 'fg-neutral-subtle', mode) }}>
              {s}
            </span>
          </span>
          <span className="text-[15px] font-bold tabular-nums" style={{ color: tone(kit, 'fg-neutral', mode) }}>
            {a}
          </span>
        </div>
      ))}
    </div>
  );
}
// 트리거 — 버튼을 감싸 초점을 돌려줄 자리를 쥔다
function Trigger({ kit, mode, label, onOpen, holder, look }: { kit: OvKit; mode: ViewMode; label: string; onOpen: () => void; holder: { current: HTMLElement | null }; look?: OvKit['dialog']['weak'] }) {
  return (
    <span className="self-start" ref={(el) => void (holder.current = el?.querySelector('button') ?? null)}>
      <ButtonView look={look ?? kit.dialog.weak} mode={mode} label={label} onClick={onOpen} />
    </span>
  );
}

// 작성 중 나가기 — 그림 속 화면 안에 띄운다
function LeaveAsk({ kit, mode, open, wide, container, onStay, onLeave, description }: { kit: OvKit; mode: ViewMode; open: boolean; wide: boolean; container: HTMLElement | null; onStay: () => void; onLeave: () => void; description: string }) {
  const id = useId();
  const b = wide ? kit.alert.above : kit.alert.below;
  if (!container) return null;
  return (
    <ModalLayer open={open} kind="alert" look={kit.ov} mode={mode} outside="ignore" container={container} onRequestClose={onStay} labelledBy={`${id}t`} describedBy={`${id}d`}>
      {({ ref, rootProps, style }) => (
        <AlertSurface ref={ref} rootProps={rootProps} style={style} look={kit.ov.alert} mode={mode} title="작성한 내용이 사라져요" description={description} titleId={`${id}t`} descId={`${id}d`} cancel={{ label: '계속 작성', look: b.weak, onClick: onStay }} confirm={{ label: '나가기', look: b.critical, onClick: onLeave }} />
      )}
    </ModalLayer>
  );
}

// ── Bottom Sheet ──────────────────────────────────────────
type SheetUse = 'form' | 'pick' | 'view';
const PERIODS = [
  { value: 'this', label: '이번 달' },
  { value: 'last', label: '지난 달' },
  { value: 'q', label: '최근 3개월' },
];
const DETAIL: RowSpec[] = [
  { kind: 'view', title: '금액', suffix: { text: '−12,000원' } },
  { kind: 'view', title: '내용', suffix: { text: '점심 식사' } },
  { kind: 'view', title: '카테고리', suffix: { text: '식비' } },
  { kind: 'view', title: '결제 수단', suffix: { text: '현대카드 M' } },
];
// 스냅 높이 — 절반 · 가득(화면 높이에 대해, 가득은 시트 상한)
const snapsOf = (kit: OvKit) => [0.5, kit.ov.sheet.maxHeight];

function sheetCode(use: SheetUse, o: { desc: boolean; foot: 'none' | 'one' | 'two'; handle: boolean; fog: boolean }) {
  const root = ['open={open}', 'onOpenChange={setOpen}', ...attr(use === 'form', 'form'), ...attr(use === 'form', 'dirty={isDirty}'), ...attr(o.handle, 'snapPoints={[0.5, 0.9]}')];
  const title = use === 'form' ? '거래 추가' : use === 'pick' ? '기간' : '거래 상세';
  const desc = use === 'form' ? '금액만 넣어도 저장할 수 있어요.' : use === 'pick' ? '고른 기간의 거래만 보여요.' : '10월 1일 (목) 오후 12:30';
  const body = use === 'form' ? '      <Field label="금액">…</Field>' : use === 'pick' ? `      <ListRadioGroup value={draft} onValueChange={${o.foot === 'none' ? 'pick' : 'setDraft'}}>…</ListRadioGroup>` : '      <List>…</List>';
  // 본문에 List 를 바로 두면 줄이 제 좌우 여백(24)을 가진다 — 본문 좌우 여백을 뺀다
  // 넘칠 수 있는 본문(목록 · 긴 폼)은 scrollFog — 위 20 · 아래 80 이 늘 흐리다(Scroll Fog)
  const bodyAttr = `${o.fog ? ' scrollFog' : ''}${use === 'form' ? '' : ' className="px-0"'}`;
  const foot =
    use === 'form'
      ? '      <Button size="large" type="submit">저장</Button>'
      : use === 'pick' && o.foot === 'two'
        ? '      <Button variant="neutralWeak" size="large" onClick={reset}>초기화</Button>\n      <Button size="large" onClick={apply}>적용</Button>'
        : use === 'pick' && o.foot === 'one'
          ? '      <Button size="large" onClick={apply}>적용</Button>'
          : '';
  const ui = ['BottomSheet', 'BottomSheetBody', 'BottomSheetContent', ...(foot ? ['BottomSheetFooter'] : [])];
  return `import { ${ui.join(', ')} } from "@/components/ui/bottom-sheet"\n\n${use === 'form' ? '{/* form — 바깥 누르기 · 끌어내리기로 닫지 않는다(손잡이 없음). dirty — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */}\n' : ''}<BottomSheet ${root.join(' ')}>\n  <BottomSheetContent title="${title}"${o.desc ? ` description="${desc}"` : ''}>\n    <BottomSheetBody${bodyAttr}>\n${body}\n    </BottomSheetBody>${foot ? `\n    <BottomSheetFooter>\n${foot}\n    </BottomSheetFooter>` : ''}\n  </BottomSheetContent>\n</BottomSheet>`;
}

export function BottomSheetPlayground({ kits, lists, field, input }: { kits: Record<Brand, OvKit>; lists: Record<Brand, ListLook>; field: TfFieldLook; input: TfInputLook }) {
  const [use, setUse] = useState<SheetUse>('pick');
  const [desc, setDesc] = useState<'no' | 'yes'>('yes');
  const [foot, setFoot] = useState<'none' | 'one' | 'two'>('two');
  const [handle, setHandle] = useState<'no' | 'yes'>('no');
  const [fog, setFog] = useState<'off' | 'on'>('off');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState(0);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('this');
  const [draft, setDraft] = useState('this');
  const [asking, setAsking] = useState(false);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const id = useId();
  const kit = kits[brand];
  const form = use === 'form';
  const withHandle = !form && handle === 'yes';
  const snaps = snapsOf(kit);
  const code = useMemo(() => sheetCode(use, { desc: desc === 'yes', foot, handle: withHandle, fog: fog === 'on' }), [use, desc, foot, withHandle, fog]);
  const close = () => {
    setOpen(false);
    setAmount('');
  };
  const request = (r: CloseReason) => {
    if (form && (r === 'outside' || r === 'drag')) return;
    if (form && amount) setAsking(true);
    else close();
  };
  const title = form ? '거래 추가' : use === 'pick' ? '기간' : '거래 상세';
  const description = desc === 'yes' ? (form ? '금액만 넣어도 저장할 수 있어요.' : use === 'pick' ? '고른 기간의 거래만 보여요.' : '10월 1일 (목) 오후 12:30') : undefined;
  const rows: RowSpec[] = PERIODS.map((p) => ({ kind: 'radio', title: p.label, value: p.value, checked: p.value === draft }));
  let footer: ReactNode = null;
  if (form) footer = <SheetButtons mode={mode} items={[{ label: '저장', look: kit.sheet.solid, onClick: close }]} />;
  else if (use === 'pick' && foot !== 'none')
    footer = (
      <SheetButtons
        mode={mode}
        items={[
          ...(foot === 'two' ? [{ label: '초기화', look: kit.sheet.weak, onClick: () => setDraft('this') }] : []),
          { label: '적용', look: kit.sheet.solid, onClick: () => (setPeriod(draft), setOpen(false)) },
        ]}
      />
    );
  const body = form ? (
    <TfFieldView look={field} mode={mode} label="금액">
      {(ctl) => <TfInputView look={input} mode={mode} size="large" id={ctl.id} describedBy={ctl.describedBy} value={amount} onValue={setAmount} format="amount" suffix="원" placeholder="0" />}
    </TfFieldView>
  ) : use === 'pick' ? (
    <ListView
      look={lists[brand]}
      rows={rows}
      mode={mode}
      value={draft}
      onValue={(v) => {
        setDraft(v);
        // 바닥 버튼이 없으면 누르는 순간 고르고 닫힌다
        if (foot === 'none') {
          setPeriod(v);
          setOpen(false);
        }
      }}
      ariaLabel="기간"
    />
  ) : (
    <ListView look={lists[brand]} rows={DETAIL} mode={mode} live={false} />
  );
  return (
    <Frame
      code={code}
      stage={
        <Screen kit={kit} mode={mode} desktop={false} height={560} title="가계부" setEl={setEl}>
          <Trigger kit={kit} mode={mode} holder={trigger} label={form ? '거래 추가' : use === 'pick' ? `기간 · ${PERIODS.find((p) => p.value === period)?.label}` : '거래 상세 보기'} onOpen={() => (setDraft(period), setSnap(0), setOpen(true))} />
          <Rows kit={kit} mode={mode} />
          {el && (
            <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} container={el} outside={form ? 'ignore' : 'close'} drag={!form} onRequestClose={request} labelledBy={`${id}t`} describedBy={description ? `${id}d` : undefined} returnFocus={() => trigger.current}>
              {({ ref, rootProps, style, maxHeight }) => (
                <SheetSurface
                  ref={ref}
                  rootProps={rootProps}
                  style={withHandle ? { ...style, height: `${snaps[snap] * 100}%` } : style}
                  maxHeight={maxHeight}
                  look={kit.ov.sheet}
                  mode={mode}
                  title={title}
                  description={description}
                  titleId={`${id}t`}
                  descId={`${id}d`}
                  onClose={() => request('close')}
                  handle={withHandle}
                  onHandle={() => (snap + 1 < snaps.length ? setSnap(snap + 1) : setOpen(false))}
                  bodyPad={form}
                  fog={fog === 'on'}
                  footer={footer}
                >
                  {body}
                </SheetSurface>
              )}
            </ModalLayer>
          )}
          <LeaveAsk kit={kit} mode={mode} open={asking} wide={false} container={el} description="나가면 입력한 금액이 저장되지 않아요." onStay={() => setAsking(false)} onLeave={() => (setAsking(false), close())} />
        </Screen>
      }
      controls={
        <>
          <Seg label="쓰임" value={use} options={[['form', '입력 폼'], ['pick', '고르기'], ['view', '조회']] as const} onChange={(v) => (setUse(v), setOpen(false))} />
          <Seg label="설명 description" value={desc} options={[['no', '없음'], ['yes', '있음']] as const} onChange={setDesc} />
          {use === 'pick' ? (
            <Seg label="바닥 버튼" value={foot} options={[['none', '없음(누르면 바로)'], ['one', '적용'], ['two', '초기화 · 적용']] as const} onChange={setFoot} />
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">바닥 버튼</span>
              <span>{form ? '입력 폼은 바닥 저장 하나 — 닫기는 위 닫기 버튼(바닥 취소 없음).' : '조회는 바닥 버튼이 없다 — 위 닫기 · 바깥 · 끌기로 닫는다.'}</span>
            </div>
          )}
          {form ? (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">손잡이 snapPoints</span>
              <span>입력 폼은 손잡이를 달지 않는다 — 바깥 누르기 · 끌어내리기로 닫히지 않는다.</span>
            </div>
          ) : (
            <Seg label="손잡이 snapPoints(절반 · 가득)" value={handle} options={[['no', '없음(기본)'], ['yes', '있음']] as const} onChange={setHandle} />
          )}
          <Seg label="끝 흐림 scrollFog" value={fog} options={[['off', '끔(기본) — 늘 들어맞는 본문'], ['on', '켬 — 넘칠 수 있는 본문']] as const} onChange={setFog} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ── Dialog(Responsive Dialog) ──────────────────────────────
type DialogUse = 'form' | 'view';
const LONG_DETAIL: RowSpec[] = [
  ...DETAIL,
  { kind: 'view', title: '날짜', suffix: { text: '10월 1일 (목) 오후 12:30' } },
  { kind: 'view', title: '할부', suffix: { text: '일시불' } },
  { kind: 'view', title: '청구 회차', suffix: { text: '11월 14일 결제' } },
  { kind: 'view', title: '태그', suffix: { text: '팀 점심' } },
  { kind: 'view', title: '메모', suffix: { text: '회의 뒤 점심' } },
  { kind: 'view', title: '더치페이', suffix: { text: '4명 · 3,000원씩' } },
  { kind: 'view', title: '받을 돈', suffix: { text: '9,000원' } },
  { kind: 'view', title: '위치', suffix: { text: '서울 중구' } },
  { kind: 'view', title: '만든 날', suffix: { text: '10월 1일 오후 12:41' } },
  { kind: 'view', title: '고친 날', suffix: { text: '10월 2일 오전 9:10' } },
];
const FORM_FIELDS = ['사유', '연락처', '인수인계 담당자', '맡긴 일', '돌아오는 날', '메모'];

function dialogCode(use: DialogUse, o: { size: 'medium' | 'large'; desc: boolean; long: boolean; fog: boolean }) {
  const form = use === 'form';
  const ui = ['ResponsiveDialog', 'ResponsiveDialogBody', ...(form ? ['ResponsiveDialogCancel'] : []), 'ResponsiveDialogContent', ...(form ? ['ResponsiveDialogFooter'] : [])];
  const content = [`title="${form ? '휴가 신청' : '거래 상세'}"`, ...attr(o.desc, `description="${form ? '승인되면 알려드려요.' : '10월 1일 (목) 오후 12:30'}"`), ...attr(o.size === 'large', 'size="large"')];
  const body = form ? (o.long ? FORM_FIELDS : FORM_FIELDS.slice(0, 2)).map((f) => `      <Field label="${f}">…</Field>`).join('\n') : '      <List>…</List>';
  return `${form ? 'import { Button } from "@/components/ui/button"\n' : ''}import { ${ui.join(', ')} } from "@/components/ui/dialog"\n\n${form ? '{/* form — 바깥 누르기 · 끌어내리기로 닫지 않는다. dirty — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */}\n' : '{/* 조회 — 머리 닫기 버튼(시트에서는 오른쪽 위 원), 바깥 누르기로도 닫힌다 */}\n'}<ResponsiveDialog open={open} onOpenChange={setOpen}${form ? ' form dirty={isDirty}' : ''}>\n  <ResponsiveDialogContent ${content.join(' ')}>\n    <ResponsiveDialogBody${o.fog ? ' scrollFog' : ''}${form ? '' : ' className="px-0"'}>\n${body}\n    </ResponsiveDialogBody>${form ? '\n    <ResponsiveDialogFooter>\n      {/* 1280 이상에서만 그린다 — 시트에서는 위 닫기 버튼이 맡는다 */}\n      <ResponsiveDialogCancel>취소</ResponsiveDialogCancel>\n      <Button onClick={submit}>신청</Button>\n    </ResponsiveDialogFooter>' : ''}\n  </ResponsiveDialogContent>\n</ResponsiveDialog>`;
}

export function DialogPlayground({ kits, lists, field, input }: { kits: Record<Brand, OvKit>; lists: Record<Brand, ListLook>; field: TfFieldLook; input: TfInputLook }) {
  const [size, setSize] = useState<'medium' | 'large'>('medium');
  const [use, setUse] = useState<DialogUse>('form');
  const [desc, setDesc] = useState<'no' | 'yes'>('yes');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [fog, setFog] = useState<'off' | 'on'>('off');
  const [width, setWidth] = useState<'wide' | 'narrow'>('wide');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('hr');
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [asking, setAsking] = useState(false);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const id = useId();
  const kit = kits[brand];
  const form = use === 'form';
  const wide = width === 'wide';
  const long = len === 'long';
  const code = useMemo(() => dialogCode(use, { size, desc: desc === 'yes', long, fog: fog === 'on' }), [use, size, desc, long, fog]);
  const dirty = Object.values(values).some((v) => v);
  const close = () => {
    setOpen(false);
    setValues({});
  };
  const request = (r: CloseReason) => {
    if (form && (r === 'outside' || r === 'drag')) return;
    if (form && dirty) setAsking(true);
    else close();
  };
  const title = form ? '휴가 신청' : '거래 상세';
  const description = desc === 'yes' ? (form ? '승인되면 알려드려요.' : '10월 1일 (목) 오후 12:30') : undefined;
  const fields = long ? FORM_FIELDS : FORM_FIELDS.slice(0, 2);
  const body = form ? (
    <div className="flex flex-col" style={{ gap: field.form.gapY }}>
      {fields.map((f) => (
        <TfFieldView key={f} look={field} mode={mode} label={f}>
          {(ctl) => <TfInputView look={input} mode={mode} size={wide ? 'medium' : 'large'} id={ctl.id} describedBy={ctl.describedBy} value={values[f] ?? ''} onValue={(v) => setValues((x) => ({ ...x, [f]: v }))} />}
        </TfFieldView>
      ))}
    </div>
  ) : (
    <ListView look={lists[brand]} rows={long ? LONG_DETAIL : DETAIL} mode={mode} live={false} />
  );
  const head = { title, description, titleId: `${id}t`, descId: description ? `${id}d` : undefined };
  return (
    <Frame
      wide={wide}
      code={code}
      stage={
        <Screen kit={kit} mode={mode} desktop={wide} height={wide ? 520 : 600} title={brand === 'hr' ? '휴가' : '가계부'} setEl={setEl}>
          <Trigger kit={kit} mode={mode} holder={trigger} label={form ? '휴가 신청' : '거래 상세 보기'} onOpen={() => setOpen(true)} look={form && brand === 'hr' ? kit.dialog.brand : kit.dialog.weak} />
          <Rows kit={kit} mode={mode} n={wide ? 4 : 5} />
          {el &&
            (wide ? (
              <ModalLayer open={open} kind="dialog" look={kit.ov} mode={mode} container={el} outside={form ? 'ignore' : 'close'} onRequestClose={request} labelledBy={head.titleId} describedBy={head.descId} returnFocus={() => trigger.current}>
                {({ ref, rootProps, style, maxHeight }) => (
                  <DialogSurface
                    ref={ref}
                    rootProps={rootProps}
                    style={style}
                    maxHeight={maxHeight}
                    look={kit.ov.dialog}
                    width={kit.ov.dialog.sizes[size]}
                    mode={mode}
                    {...head}
                    close={!form}
                    onClose={() => request('close')}
                    bodyPad={form}
                    fog={fog === 'on'}
                    footer={
                      form && (
                        <EndButtons
                          mode={mode}
                          items={[
                            { label: '취소', look: kit.dialog.weak, onClick: () => request('close') },
                            { label: '신청', look: brand === 'hr' ? kit.dialog.brand : kit.dialog.solid, onClick: close },
                          ]}
                        />
                      )
                    }
                  >
                    {body}
                  </DialogSurface>
                )}
              </ModalLayer>
            ) : (
              <ModalLayer open={open} kind="sheet" look={kit.ov} mode={mode} container={el} outside={form ? 'ignore' : 'close'} drag={!form} onRequestClose={request} labelledBy={head.titleId} describedBy={head.descId} returnFocus={() => trigger.current}>
                {({ ref, rootProps, style, maxHeight }) => (
                  <SheetSurface
                    ref={ref}
                    rootProps={rootProps}
                    style={style}
                    maxHeight={maxHeight}
                    look={kit.ov.sheet}
                    mode={mode}
                    {...head}
                    onClose={() => request('close')}
                    bodyPad={form}
                    fog={fog === 'on'}
                    footer={form && <SheetButtons mode={mode} items={[{ label: '신청', look: brand === 'hr' ? kit.sheet.brand : kit.sheet.solid, onClick: close }]} />}
                  >
                    {body}
                  </SheetSurface>
                )}
              </ModalLayer>
            ))}
          <LeaveAsk kit={kit} mode={mode} open={asking} wide={wide} container={el} description="나가면 입력한 내용이 저장되지 않아요." onStay={() => setAsking(false)} onLeave={() => (setAsking(false), close())} />
        </Screen>
      }
      controls={
        <>
          <Seg label="크기 size" value={size} options={[['medium', `medium ${kit.ov.dialog.sizes.medium}(기본)`], ['large', `large ${kit.ov.dialog.sizes.large}`]] as const} onChange={setSize} />
          <Seg label="쓰임" value={use} options={[['form', '입력 폼'], ['view', '조회']] as const} onChange={(v) => (setUse(v), setOpen(false))} />
          <Seg label="설명 description" value={desc} options={[['no', '없음'], ['yes', '있음']] as const} onChange={setDesc} />
          <Seg label="본문 길이" value={len} options={[['short', '짧게'], ['long', '길게(넘쳐 스크롤)']] as const} onChange={setLen} />
          <Seg label="끝 흐림 scrollFog" value={fog} options={[['off', '끔(기본) — 늘 들어맞는 본문'], ['on', '켬 — 넘칠 수 있는 본문']] as const} onChange={setFog} />
          <Seg label={`창 폭 — ${kit.ov.breakpoint} 에서 바뀐다`} value={width} options={[['wide', `${kit.ov.breakpoint} 이상 — 대화상자`], ['narrow', `${kit.ov.breakpoint} 미만 — 시트`]] as const} onChange={(v) => setWidth(v)} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
          <p className="text-[12px] leading-5 text-fd-muted-foreground sm:col-span-2">
            창 폭은 그림 속 화면을 바꾼다(열린 채 바꾸면 쓰던 값은 그대로 표면만 바뀐다). large 는 이 그림 속 창보다 넓어 화면 폭 − {kit.ov.dialog.marginX * 2} 로 줄어든다.
          </p>
        </>
      }
    />
  );
}

// ── Alert Dialog ──────────────────────────────────────────
type AlertPick = 'horizontal' | 'vertical' | 'single';
const ALERT_TEXT: Record<AlertPick, { title: string; short: string; long: string; cancel?: string; confirm: string; noTitle: string }> = {
  horizontal: { title: '거래를 삭제할까요?', short: '삭제한 거래는 되돌릴 수 없어요.', long: '삭제한 거래는 되돌릴 수 없어요. 이 거래로 맞춘 예산과 카드 실적도 다시 계산해요.', cancel: '취소', confirm: '삭제', noTitle: '거래 삭제' },
  vertical: { title: '관심 그룹을 삭제할까요?', short: '그룹에 담은 종목 12개도 함께 빠져요.', long: '그룹에 담은 종목 12개도 함께 빠져요. 빠진 종목은 전체 종목에서 다시 담을 수 있어요.', cancel: '취소', confirm: '그룹과 종목 함께 삭제', noTitle: '관심 그룹 삭제' },
  single: { title: '저장하지 못했어요', short: '연결을 확인하고 다시 저장해 주세요.', long: '연결이 끊겨 거래를 저장하지 못했어요. 쓴 내용은 그대로 있으니 연결을 확인하고 다시 저장해 주세요.', confirm: '다시 저장', noTitle: '저장 실패' },
};

function alertCode(pick: AlertPick, o: { critical: boolean; title: boolean; long: boolean }) {
  const t = ALERT_TEXT[pick];
  const ui = ['AlertDialog', 'AlertDialogAction', ...(t.cancel ? ['AlertDialogCancel'] : []), 'AlertDialogContent', 'AlertDialogDescription', 'AlertDialogFooter', ...(o.title ? ['AlertDialogTitle'] : [])];
  const variant = o.critical ? ' variant="criticalSolid"' : '';
  return `import { ${ui.join(', ')} } from "@/components/ui/alert-dialog"\n\n${pick === 'vertical' ? '{/* 한쪽 글이 반 폭을 넘어 AlertDialogFooter 가 저절로 세로로 — 확정이 위 */}\n' : ''}<AlertDialog open={open} onOpenChange={setOpen}>\n  <AlertDialogContent${o.title ? '' : ` aria-label="${t.noTitle}"`}>\n${o.title ? `    <AlertDialogTitle>${t.title}</AlertDialogTitle>\n` : ''}    <AlertDialogDescription>${o.long ? t.long : t.short}</AlertDialogDescription>\n    <AlertDialogFooter>\n${t.cancel ? `      <AlertDialogCancel>${t.cancel}</AlertDialogCancel>\n` : ''}      <AlertDialogAction${variant} onClick={${pick === 'single' ? 'retry' : 'remove'}}>${t.confirm}</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`;
}

export function AlertDialogPlayground({ kits }: { kits: Record<Brand, OvKit> }) {
  const [pick, setPick] = useState<AlertPick>('horizontal');
  const [weight, setWeight] = useState<'critical' | 'neutral'>('critical');
  const [withTitle, setWithTitle] = useState<'yes' | 'no'>('yes');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [width, setWidth] = useState<'narrow' | 'wide'>('narrow');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<AlertLayout>('horizontal');
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const id = useId();
  const kit = kits[brand];
  const wide = width === 'wide';
  const b = wide ? kit.alert.above : kit.alert.below;
  const t = ALERT_TEXT[pick];
  const critical = weight === 'critical' && pick !== 'single';
  const code = useMemo(() => alertCode(pick, { critical, title: withTitle === 'yes', long: len === 'long' }), [pick, critical, withTitle, len]);
  return (
    <Frame
      wide={wide}
      code={code}
      stage={
        <Screen kit={kit} mode={mode} desktop={wide} height={wide ? 420 : 520} title="가계부" setEl={setEl}>
          <Trigger kit={kit} mode={mode} holder={trigger} label={pick === 'single' ? '저장하기' : pick === 'vertical' ? '관심 그룹 삭제' : '거래 삭제'} onOpen={() => setOpen(true)} />
          <Rows kit={kit} mode={mode} n={3} />
          {el && (
            <ModalLayer open={open} kind="alert" look={kit.ov} mode={mode} container={el} outside="ignore" onRequestClose={() => setOpen(false)} labelledBy={withTitle === 'yes' ? `${id}t` : undefined} describedBy={`${id}d`} returnFocus={() => trigger.current}>
              {({ ref, rootProps, style }) => (
                <AlertSurface
                  ref={ref}
                  rootProps={{ ...rootProps, 'aria-label': withTitle === 'yes' ? undefined : t.noTitle }}
                  style={style}
                  look={kit.ov.alert}
                  mode={mode}
                  title={withTitle === 'yes' ? t.title : undefined}
                  titleId={`${id}t`}
                  descId={`${id}d`}
                  description={len === 'long' ? t.long : t.short}
                  cancel={t.cancel ? { label: t.cancel, look: b.weak, onClick: () => setOpen(false) } : undefined}
                  confirm={{ label: t.confirm, look: critical ? b.critical : b.solid, onClick: () => setOpen(false) }}
                  onLayout={setShown}
                />
              )}
            </ModalLayer>
          )}
        </Screen>
      }
      controls={
        <>
          <Seg label="버튼 배치 layout" value={pick} options={[['horizontal', '나란히(기본)'], ['vertical', '세로(긴 글)'], ['single', '하나(알리기)']] as const} onChange={(v) => (setPick(v), setOpen(false))} />
          {pick === 'single' ? (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">확정 버튼의 무게</span>
              <span>알리기는 되돌릴 수 없는 확정이 아니라 neutralSolid 다.</span>
            </div>
          ) : (
            <Seg label="확정 버튼의 무게" value={weight} options={[['critical', 'Critical(지우기 · 잃기)'], ['neutral', 'Neutral(그 밖의 확정)']] as const} onChange={setWeight} />
          )}
          <Seg label="제목" value={withTitle} options={[['yes', '있음'], ['no', '없음(aria-label)']] as const} onChange={setWithTitle} />
          <Seg label="글 길이" value={len} options={[['short', '짧게'], ['long', '길게']] as const} onChange={setLen} />
          <Seg label="창 폭" value={width} options={[['narrow', `${kit.ov.breakpoint} 미만 — 버튼 ${kit.ov.alert.footer.below.height}`], ['wide', `${kit.ov.breakpoint} 이상 — 버튼 ${kit.ov.alert.footer.above.height}`]] as const} onChange={setWidth} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
          <p className="text-[12px] leading-5 text-fd-muted-foreground sm:col-span-2">
            배치는 글 길이로 저절로 정한다 — 지금 {open ? (shown === 'vertical' ? '세로(확정이 위)' : shown === 'single' ? '하나' : '나란히') : '열면 보인다'}. 바깥을 눌러도 닫히지 않고, Esc 는 취소와 같다.
          </p>
        </>
      }
    />
  );
}

// ── Popover ───────────────────────────────────────────────
const RULE = '입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.';
const RULE_LONG = [
  RULE,
  '쓰지 않은 연차는 다음 해 3월에 정산해요. 정산은 그해 마지막 날의 통상임금으로 계산해요.',
  '반차는 0.5일로 세고, 오전 반차는 오후 1시부터 · 오후 반차는 오후 1시까지 일해요.',
  '경조 휴가 · 공가 · 병가는 연차에서 빠지지 않아요. 증빙은 신청할 때 함께 올려요.',
  '팀장이 승인하면 알림이 가요. 승인 전에는 신청을 고치거나 거둘 수 있어요.',
  '연차를 미리 당겨 쓸 수는 없어요. 남은 연차보다 많이 신청하면 신청 단계에서 막혀요.',
];
type Place = 'top' | 'bottom' | 'edge';
function popoverCode(o: { head: boolean; foot: boolean; long: boolean; fog: boolean }) {
  const ui = ['Popover', 'PopoverBody', 'PopoverContent', ...(o.foot ? ['PopoverFooter'] : []), 'PopoverTrigger'];
  const content = o.head ? 'title="연차 사용 규정"' : 'aria-label="날짜 선택"';
  const body = o.head ? (o.long ? '…(긴 안내 — 넘치면 본문만 스크롤)' : RULE) : '<DatePicker selection="single" value={draft} onValueChange={setDraft} />';
  return `import { Info } from "lucide-react"\nimport { Button } from "@/components/ui/button"\nimport { ${ui.join(', ')} } from "@/components/ui/popover"\n\n<Popover>\n  <PopoverTrigger asChild>\n    ${o.head ? '<Button variant="ghost" size="xsmall" layout="iconOnly" aria-label="연차 사용 규정"><Info /></Button>' : '<InputButton value={…} suffixIcon={<CalendarDays />} />'}\n  </PopoverTrigger>\n  <PopoverContent ${content}>\n    <PopoverBody${o.fog ? ' scrollFog' : ''}>${body}</PopoverBody>${o.foot ? '\n    <PopoverFooter>\n      <Button size="small" onClick={done}>완료</Button>\n    </PopoverFooter>' : ''}\n  </PopoverContent>\n</Popover>`;
}

export function PopoverPlayground({ kits, sels, field, dates }: { kits: Record<Brand, OvKit>; sels: Record<Brand, SelectLook>; field: TfFieldLook; dates: Record<Brand, DateKit> }) {
  const [head, setHead] = useState<'yes' | 'no'>('yes');
  const [foot, setFoot] = useState<'no' | 'yes'>('no');
  const [len, setLen] = useState<'short' | 'long'>('short');
  const [fog, setFog] = useState<'off' | 'on'>('off');
  const [place, setPlace] = useState<Place>('top');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('hr');
  const [open, setOpen] = useState(false);
  // 고르는 패널의 달력 — 칸의 날(day)과 고르던 날(draft). "완료" 로 넣는다(date-picker.md)
  const [day, setDay] = useState<Day | undefined>({ y: 2026, m: 10, d: 12 });
  const [draft, setDraft] = useState<Day | undefined>(day);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const btn = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const kit = kits[brand];
  const p = kit.ov.popover;
  const withHead = head === 'yes';
  // 달력 패널은 늘 바닥 "완료" — 날짜를 누르는 순간 넣고 닫지 않는다
  const withFoot = !withHead || foot === 'yes';
  // 끝 흐림 — 안내(머리가 있는 팝오버)의 넘칠 수 있는 본문에. 달력 패널은 늘 들어맞는다
  const withFog = withHead && fog === 'on';
  const code = useMemo(() => popoverCode({ head: withHead, foot: withFoot, long: len === 'long', fog: withFog }), [withHead, withFoot, len, withFog]);
  const text: CSSProperties = { margin: 0, fontFamily: p.description.fontFamily, fontSize: p.description.fontSize, lineHeight: p.description.lineHeight, color: ocv(p.description.color, mode) };
  const body = withHead ? (
    len === 'long' ? (
      <div className="flex flex-col gap-3">
        {RULE_LONG.map((t) => (
          <p key={t} style={text}>
            {t}
          </p>
        ))}
      </div>
    ) : (
      <p style={text}>{RULE}</p>
    )
  ) : (
    <DatePickerView kit={dates[brand]} mode={mode} live autoFocus value={draft} onValue={(v) => setDraft(v as Day | undefined)} ariaLabel="날짜 선택" />
  );
  // 트리거 자리 — 화면 위(아래로 뜬다) · 아래(위로 뒤집힌다) · 오른쪽 가장자리(화면 안으로 민다)
  const pos: CSSProperties = place === 'top' ? { left: 24, top: 64 } : place === 'bottom' ? { left: 24, bottom: 24 } : { right: 8, top: 64 };
  return (
    <Frame
      wide
      code={code}
      stage={
        <Screen kit={kit} mode={mode} desktop height={withHead ? 480 : 640} title="휴가" setEl={setEl}>
          <Rows kit={kit} mode={mode} n={3} />
          <div className="absolute flex items-center gap-1" style={pos}>
            {withHead && (
              <span className="text-[14px] font-medium" style={{ color: tone(kit, 'fg-neutral', mode) }}>
                연차 사용 규정
              </span>
            )}
            <button
              ref={btn}
              type="button"
              aria-label={withHead ? '연차 사용 규정' : `날짜, ${day ? formatDay(day) : '날짜 선택'}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? `${id}pop` : undefined}
              onClick={() => {
                setDraft(day);
                setOpen((o) => !o);
              }}
              className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-0 px-2"
              style={{ background: withHead ? 'transparent' : tone(kit, 'bg-layer-default', mode), color: tone(kit, withHead ? 'fg-neutral-subtle' : 'fg-neutral', mode), boxShadow: withHead ? undefined : `inset 0 0 0 1px ${tone(kit, 'stroke-neutral-weak', mode)}`, fontFamily: FONT, fontSize: 14 }}
            >
              {withHead ? <Info aria-hidden size={18} strokeWidth={2} /> : day ? formatDay(day) : '날짜 선택'}
            </button>
          </div>
          <PopoverLayer open={open} anchor={btn.current} look={p} mode={mode} align={withHead ? 'center' : 'start'} container={el} id={`${id}pop`} labelledBy={withHead ? `${id}t` : undefined} ariaLabel={withHead ? undefined : '날짜'} onRequestClose={() => setOpen(false)}>
            {({ ref, rootProps, style, maxHeight, avail }) => (
              <PopoverSurface
                ref={ref}
                rootProps={rootProps}
                style={style}
                maxHeight={maxHeight}
                avail={avail}
                look={p}
                mode={mode}
                title={withHead ? '연차 사용 규정' : undefined}
                titleId={`${id}t`}
                fog={withFog}
                onClose={() => (setOpen(false), btn.current?.focus())}
                footer={
                  withFoot ? (
                    <EndButtons
                      mode={mode}
                      items={[
                        {
                          label: '완료',
                          look: kit.dialog.solid,
                          state: !withHead && !draft ? 'disabled' : undefined,
                          onClick: () => {
                            if (!withHead && draft) setDay(draft);
                            setOpen(false);
                          },
                        },
                      ]}
                    />
                  ) : undefined
                }
              >
                {body}
              </PopoverSurface>
            )}
          </PopoverLayer>
        </Screen>
      }
      controls={
        <>
          <Seg label="머리" value={head} options={[['yes', '제목 + 닫기(안내)'], ['no', '없음(고르는 패널)']] as const} onChange={(v) => (setHead(v), setOpen(false))} />
          {withHead ? (
            <Seg label="바닥" value={foot} options={[['no', '없음'], ['yes', '완료']] as const} onChange={setFoot} />
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">바닥</span>
              <span>달력은 늘 &quot;완료&quot; — 고르는 동안 칸 값은 그대로다(Date Picker).</span>
            </div>
          )}
          {withHead ? (
            <>
              <Seg label="본문 길이" value={len} options={[['short', '짧게'], ['long', '길게(넘쳐 스크롤)']] as const} onChange={setLen} />
              <Seg label="끝 흐림 scrollFog" value={fog} options={[['off', '끔(기본) — 늘 들어맞는 본문'], ['on', '켬 — 넘칠 수 있는 본문']] as const} onChange={setFog} />
            </>
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">본문 길이</span>
              <span>고르는 패널은 달력(Date Picker 336) — 고르고 &quot;완료&quot;.</span>
            </div>
          )}
          <Seg label="트리거 자리" value={place} options={[['top', '화면 위'], ['bottom', '화면 아래(위로 뒤집힌다)'], ['edge', '오른쪽 가장자리']] as const} onChange={(v) => (setPlace(v), setOpen(false))} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
          <p className="text-[12px] leading-5 text-fd-muted-foreground sm:col-span-2">
            열면 초점이 팝오버 안으로 간다(가두지 않는다) — 마지막에서 Tab 을 누르면 다음 자리로 나가며 닫힌다. Esc 는 닫고 트리거로, 바깥을 누르면 누른 자리로(초점을 못 받는 자리면 트리거로) 간다. 1280 미만에서는 같은 내용을 시트로 띄운다(이 그림은 1280 이상의 창이다).
          </p>
        </>
      }
    />
  );
}
