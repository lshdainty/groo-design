'use client';
// Searchable List 의 플레이그라운드 · 키보드 데모 · 코드 미리보기 — 실제로 치고(거르기 · 서버 검색 300ms), ↓ ↑ 로 강조를 옮기고 Enter 로 고른다.
// 값은 searchable-list.yaml 을 푼 SearchLook 만 쓴다(data-look). 앞 붙이개(로고 타일 · 카드 그림 · 아바타)는 서버 그림이 넘긴다.
// 코드는 searchable-list.md 의 "코드" 절과 같은 레시피 API 다.
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ButtonView } from './button-view';
import type { ButtonLook } from './button-look';
import { SearchableListView, type SGroup, type SearchStatus } from './data-search-view';
import { type SearchLook, type ViewMode } from './data-shared';
import { InputButtonView } from './select-view';
import { IbSurface, SheetPanel } from './input-button-pickers';
import type { SelectLook } from './select-shared';
import type { OvKit, OverlayLook } from './overlay-shared';
import type { TfFieldLook } from './text-field-shared';
import { TfFieldView } from './text-field-view';
import { NavPlayFrame } from './nav-playground';
import { MODES, Seg } from './select-playground';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
function Said({ text, label = '읽는 글' }: { text: string; label?: string }) {
  return (
    <span className="inline-flex min-h-[26px] items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span className="text-[10px] font-bold text-fd-muted-foreground">{label}</span>
      {text || '—'}
    </span>
  );
}
export type SearchSet = { key: 'bank' | 'card' | 'people'; label: string; groups: SGroup[]; prefixes: Record<string, ReactNode>; prefixKind: 'logo' | 'cardArt' | 'avatar'; placeholder: string; target: string; server?: boolean; initial?: string; emptyDescription?: string };

// 판 — 시트(Bottom Sheet — bottom-sheet.yaml 의 머리 · 닫기) · 단계 안(흰 화면)
const surfaceOf = (look: SearchLook, mode: ViewMode, which: 'default' | 'floating') => (mode === 'auto' ? `var(--p-bg-layer-${which})` : look.list.surface[which][mode]);
function Stage({ look, ov, children, mode, sheet, title, footer }: { look: SearchLook; ov: OverlayLook; children: ReactNode; mode: ViewMode; sheet: boolean; title: string; footer?: ReactNode }) {
  if (sheet)
    return (
      <div style={{ width: '100%', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
        <SheetPanel ov={ov} mode={mode} title={title} bodyPad={false}>
          {children}
        </SheetPanel>
      </div>
    );
  return (
    <div style={{ width: '100%', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', overflow: 'hidden', borderRadius: look.highlight.radius, background: surfaceOf(look, mode, 'default'), paddingTop: look.option.padY, paddingBottom: look.option.padY, fontFamily: FONT }}>
      {children}
      {footer && <div style={{ paddingTop: look.option.padY, paddingLeft: look.option.padX, paddingRight: look.option.padX }}>{footer}</div>}
    </div>
  );
}

export function SearchPlayground({ look, ov, sets, next }: { look: SearchLook; ov: OverlayLook; sets: SearchSet[]; next: ButtonLook }) {
  const [setKey, setSetKey] = useState<SearchSet['key']>('bank');
  const [place, setPlace] = useState<'sheet' | 'inline'>('sheet');
  const [status, setStatus] = useState<SearchStatus | 'live'>('live');
  const [size, setSize] = useState<'responsive' | 'large' | 'medium'>('responsive');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [said, setSaid] = useState('');
  const [requests, setRequests] = useState(0);
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const [nonce, setNonce] = useState(0);
  const set = sets.find((s) => s.key === setKey) ?? sets[0];
  const value = picked ?? set.initial;
  const code = useMemo(() => {
    const item = set.key === 'bank' ? 'title={it.name} prefix={<LogoTile name={it.name} />}' : set.key === 'card' ? 'title={c.name} detail={…} prefix={<CardArt name={c.name} issuer={c.issuer} src={c.imageUrl} width={56} />}' : 'title={p.name} detail={p.team} prefix={<Avatar name={p.name} />}';
    const prefixImport = set.key === 'bank' ? 'import { LogoTile } from "@/components/ui/logo-tile"' : set.key === 'card' ? 'import { CardArt } from "@/components/ui/image-frame"' : 'import { Avatar } from "@/components/ui/avatar"';
    return [
      ...(place === 'inline' ? ['import { Button } from "@/components/ui/button"'] : []),
      prefixImport,
      'import { SearchableList, SearchableListEmpty, SearchableListError, SearchableListGroup, SearchableListInput, SearchableListItem, SearchableListResults, SearchableListSkeleton } from "@/components/ui/searchable-list"',
      '',
      `<SearchableList${place === 'inline' ? ' placement="inline"' : ''}${size !== 'responsive' ? ` size="${size}"` : ''} value={value} onValueChange={${place === 'sheet' ? '(v) => { setValue(v); setOpen(false) }' : 'setValue'}} query={query} onQueryChange={setQuery}${set.server ? ' onSearch={setSearch}' : ''}>`,
      `  <SearchableListInput placeholder="${set.placeholder}" />`,
      status === 'loading' ? '  <SearchableListSkeleton prefix="' + set.prefixKind + '" />' : status === 'failure' ? '  <SearchableListError onRetry={() => query.refetch()} />' : status === 'empty' ? '  <SearchableListEmpty />' : `  <SearchableListResults aria-label="${set.target}">`,
      ...(status === 'live' || status === 'results' ? [set.key === 'bank' ? '    {groups.map((g) => <SearchableListGroup key={g.label} label={g.label}>…</SearchableListGroup>)}' : `    {items.map((it) => <SearchableListItem key={it.id} value={it.id} ${item} />)}`, '  </SearchableListResults>'] : []),
      '</SearchableList>',
      ...(place === 'inline' ? ['<Button size="large" disabled={!value} onClick={next}>다음</Button>'] : []),
    ].join('\n');
  }, [set, place, size, status]);
  return (
    <NavPlayFrame
      surface={mode === 'auto' ? 'var(--p-bg-layer-basement)' : look.list.surface.basement[mode]}
      stage={
        <div className="flex flex-col items-center gap-3">
          <Stage look={look} ov={ov} mode={mode} sheet={place === 'sheet'} title={`${set.label} 선택`} footer={place === 'inline' ? <ButtonView look={next} mode={mode} label="다음" fill state={value ? 'live' : 'disabled'} onClick={() => setSaid(`${value} 로 다음 단계`)} /> : undefined}>
            <SearchableListView
              key={`${setKey}-${nonce}`}
              look={look}
              mode={mode}
              groups={set.groups}
              prefixes={set.prefixes}
              prefixKind={set.prefixKind}
              value={value}
              onValueChange={(v) => (setPicked(v), setSaid(place === 'sheet' ? `${v} — 시트가 닫히고 칸에 들어간다` : `${v} 고름 — "다음" 으로 넘긴다`))}
              size={size}
              placeholder={set.placeholder}
              ariaLabel={set.target}
              live
              status={status === 'live' ? undefined : status}
              server={set.server ? { latency: 500, onRequest: () => setRequests((n) => n + 1) } : undefined}
              emptyDescription={set.emptyDescription}
              onEscapeEmpty={() => setSaid(place === 'sheet' ? '시트를 닫는다(값은 그대로)' : '')}
              maxHeight={340}
            />
          </Stage>
          <div className="flex flex-wrap justify-center gap-2">
            <Said text={said} />
            {set.server && <Said label="서버 요청" text={`${requests}번`} />}
          </div>
        </div>
      }
      note={`검색칸에 초점이 있는 채로 ↓ ↑ 로 강조를 옮기고 Enter 로 고른다(콤보박스). ${set.server ? `서버 검색 — 마지막 입력 뒤 ${look.debounce}ms 에 한 번 보낸다.` : '들고 있는 목록은 치는 대로 거른다.'} Esc 는 검색어를 지우고, 비었으면 닫는다.`}
      controls={
        <>
          <Seg label="목록" value={setKey} options={sets.map((s) => [s.key, s.label] as const)} onChange={(v) => (setSetKey(v as SearchSet['key']), setPicked(undefined), setRequests(0), setNonce((k) => k + 1))} />
          <Seg label="놓인 자리" value={place} options={[['sheet', '검색 시트 — 고르면 닫힌다'], ['inline', '단계 안 — 라디오만 바뀐다']]} onChange={(v) => setPlace(v as 'sheet' | 'inline')} />
          <Seg label="상태" value={status} options={[['live', '직접 쳐 보기'], ['empty', '0건'], ['failure', '실패'], ['loading', '불러오는 중']]} onChange={(v) => setStatus(v as SearchStatus | 'live')} />
          <Seg label="검색칸 크기" value={size} options={[['responsive', `반응형 — ${look.breakpoint} 미만 large`], ['large', `large ${look.field.heights.large}`], ['medium', `medium ${look.field.heights.medium}`]]} onChange={(v) => setSize(v as 'responsive' | 'large' | 'medium')} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// 키보드 — 검색칸에서 ↓ ↓ Enter(눌린 키와 강조 · 고름을 적는다)
export function KeyboardDemo({ look, set }: { look: SearchLook; set: SearchSet }) {
  const [keys, setKeys] = useState<string[]>([]);
  const [said, setSaid] = useState('');
  const [value, setValue] = useState<string | undefined>(set.initial);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={ref}
        onKeyDownCapture={(e) => {
          if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(e.key)) setKeys((k) => [...k.slice(-7), e.key === 'ArrowDown' ? '↓' : e.key === 'ArrowUp' ? '↑' : e.key]);
        }}
        style={{ width: '100%', maxWidth: 360, borderRadius: look.highlight.radius, overflow: 'hidden', background: 'var(--p-bg-layer-floating)', paddingTop: look.option.padY, paddingBottom: look.option.padY }}
      >
        <SearchableListView look={look} groups={set.groups} prefixes={set.prefixes} prefixKind={set.prefixKind} value={value} onValueChange={(v) => setValue(v)} placeholder={set.placeholder} ariaLabel={set.target} live maxHeight={300} onSaid={setSaid} />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Said label="누른 키" text={keys.join(' ')} />
        <Said text={said} />
        <Said label="고른 값" text={value ?? ''} />
      </div>
    </div>
  );
}

// 은행 고르기 — Field + Input Button 이 여는 검색 시트(1280 미만) · 팝오버(이상). 고르면 닫힌다("완료" 없음)
export function ExInstitutionDemo({ look, set, select, field, kit }: { look: SearchLook; set: SearchSet; select: SelectLook; field: TfFieldLook; kit: OvKit }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(undefined);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btnRef.current?.focus());
  };
  return (
    <div style={{ width: '100%', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
      <TfFieldView look={field} label="은행">
        {(ctl) => (
          <InputButtonView look={select} id={ctl.id} describedBy={ctl.describedBy} ariaLabel={`은행, ${value ?? '은행 선택'}`} buttonRef={btnRef} value={value} placeholder="은행 선택" suffixIcon="chevron-down" haspopup="dialog" expanded={open} onClick={() => setOpen(true)} />
        )}
      </TfFieldView>
      <IbSurface kit={kit} mode="auto" open={open} onClose={close} anchor={btnRef.current} title="은행 선택" popoverWidth={360} bodyPad={false} autoFocus="[data-search] input">
        <span className="block" data-search>
          <SearchableListView look={look} groups={set.groups} prefixes={set.prefixes} prefixKind="logo" value={value} onValueChange={(v) => (setValue(v), close())} placeholder={set.placeholder} ariaLabel={set.target} live onEscapeEmpty={close} maxHeight={360} />
        </span>
      </IbSurface>
    </div>
  );
}

// 카드 상품 — 서버 검색(300ms) · 단계 안(라디오만 바뀌고 "다음" 이 반영한다)
export function ExCardDemo({ look, set, next }: { look: SearchLook; set: SearchSet; next: ButtonLook }) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [requests, setRequests] = useState(0);
  const [said, setSaid] = useState('');
  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: look.option.padY }}>
        <SearchableListView look={look} groups={set.groups} prefixes={set.prefixes} prefixKind="cardArt" value={value} onValueChange={(v) => (setValue(v), setSaid(`${set.groups[0].items.find((i) => i.value === v)?.title} 고름`))} placeholder={set.placeholder} ariaLabel={set.target} live server={{ latency: 500, onRequest: () => setRequests((n) => n + 1) }} emptyDescription={set.emptyDescription} maxHeight={320} />
        <div style={{ paddingLeft: look.option.padX, paddingRight: look.option.padX }}>
          <ButtonView look={next} label="다음" fill state={value ? 'live' : 'disabled'} onClick={() => setSaid('다음 단계로')} />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Said text={said} />
        <Said label="서버 요청" text={`${requests}번`} />
      </div>
    </div>
  );
}
