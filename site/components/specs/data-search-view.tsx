'use client';
// 스펙대로 그린 Searchable List — SearchLook(searchable-list.yaml + list · input · radio-group.yaml 을 푼 값)만 받아 그린다.
// 위 밑줄형 검색칸(콤보박스 — 초점은 늘 검색칸, ↓ ↑ 는 강조만 옮기고 Enter 로 고른다), 아래 결과 목록(listbox · option).
// live 면 실제로 치고 거르고 고른다. 서버 검색(server)은 마지막 입력 뒤 300ms 에 한 번 보내고, 1초가 넘으면 줄 스켈레톤이다.
// highlight · fieldState 를 주면 그 자리에 멈춘 그림이다. 인라인 스타일은 단축 속성과 개별 속성을 섞지 않는다(PR #154).
import { Fragment, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { pressRatio, type SearchLook, type SearchPrefix, type SearchSize, type ViewMode } from './data-shared';
import { srOnly, useReducedMotion } from './data-card-view';
import { dcv } from './display-shared';
import { ResultSectionView } from './feedback-view';
import { ListHeaderView } from './list-view';
import { SkeletonView } from './loading-view';
import { RadioView } from './radio-group-view';
import { TfInputView } from './text-field-view';

export type SOption = { value: string; title: string; detail?: ReactNode; detailText?: string; keywords?: string[]; badge?: ReactNode };
export type SGroup = { label?: string; items: SOption[] };
export type SearchStatus = 'results' | 'empty' | 'failure' | 'loading';
export type SearchPart = 'field' | 'header' | 'option' | 'prefix' | 'radio' | 'highlight' | 'title' | 'detail';

// 거르는 규칙 — NFC 로 맞추고 대소문자 · 공백을 무시해 이름 · 별칭 중 하나에 들어 있으면(searchable-list.yaml results.filter — Q-007-1 C).
// 초성 검색은 아직 정하지 않았다. 줄이 남지 않은 분류는 머리째 숨긴다
const fold = (t: string) => t.normalize('NFC').toLowerCase().replace(/\s+/g, '');
export function filterGroups(groups: SGroup[], q: string) {
  const k = fold(q);
  if (!k) return groups;
  return groups.map((g) => ({ ...g, items: g.items.filter((it) => [it.title, it.detailText ?? '', ...(it.keywords ?? [])].some((t) => fold(t).includes(k))) })).filter((g) => g.items.length > 0);
}

export type SearchableListProps = {
  look: SearchLook;
  mode?: ViewMode;
  groups: SGroup[];
  // 앞 붙이개 — 값마다 그림(로고 타일 · 카드 그림 · 아바타)
  prefixes?: Record<string, ReactNode>;
  prefixKind?: SearchPrefix;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  placement?: 'sheet' | 'inline';
  size?: SearchSize | 'responsive';
  placeholder: string;
  ariaLabel: string;
  live?: boolean;
  // 멈춘 그림 — 검색어 · 강조한 줄 · 누른 줄 · 검색칸 초점 · 상태
  query?: string;
  highlight?: string | null;
  pressed?: string | null;
  focused?: boolean;
  status?: SearchStatus;
  // 서버 검색 — 마지막 입력 뒤 debounce 에 한 번(onRequest 로 센다)
  server?: { latency?: number; fail?: boolean; onRequest?: (q: string) => void };
  emptyDescription?: string;
  onEscapeEmpty?: () => void;
  // 결과 자리 높이(스크롤) — 시트는 시트를 채운다
  maxHeight?: number | string;
  autoFocus?: boolean;
  marks?: Partial<Record<SearchPart, CSSProperties>>;
  pins?: Partial<Record<SearchPart, ReactNode>>;
  // 나쁜 예 — 상자형 52 검색칸 · 고른 줄 브랜드 바탕 · 라디오 목록 키보드(Tab 으로 줄마다)
  bad?: { boxField?: boolean; brandTint?: boolean; tabRows?: boolean };
  onSaid?: (s: string) => void;
};

export function SearchableListView({
  look,
  mode = 'auto',
  groups,
  prefixes = {},
  prefixKind = 'none',
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'responsive',
  placeholder,
  ariaLabel,
  live = false,
  query: queryProp,
  highlight: hlProp,
  pressed: pressedProp,
  focused = false,
  status: statusProp,
  server,
  emptyDescription,
  onEscapeEmpty,
  maxHeight,
  autoFocus = false,
  marks,
  pins,
  bad,
  onSaid,
}: SearchableListProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const listId = `sl${uid}`;
  const [ownValue, setOwnValue] = useState(defaultValue);
  const value = valueProp ?? ownValue;
  const [q, setQ] = useState(queryProp ?? '');
  const [sent, setSent] = useState(queryProp ?? '');
  const [pending, setPending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [hl, setHl] = useState<string | null>(null);
  const [hlByKey, setHlByKey] = useState(false);
  const [press, setPress] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [said, setSaid] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const query = live ? q : (queryProp ?? '');
  const fq = server ? (live ? sent : query) : query;
  const shownGroups = useMemo(() => filterGroups(groups, fq), [groups, fq]);
  const options = shownGroups.flatMap((g) => g.items);
  const status: SearchStatus = statusProp ?? (live && server && pending && slow ? 'loading' : live && failed ? 'failure' : options.length === 0 ? 'empty' : 'results');
  const highlight = live ? hl : (hlProp ?? null);
  const pressed = live ? press : (pressedProp ?? null);
  const say = (s: string) => {
    setSaid(s);
    onSaid?.(s);
  };

  useEffect(() => {
    if (live && autoFocus) inputRef.current?.focus();
  }, [live, autoFocus]);
  // 서버 검색 — 마지막 입력 뒤 debounce 에 한 번(다시 시도는 바로). 받는 동안 옛 결과를 남기고, 1초가 넘으면 줄 스켈레톤
  const [retryN, setRetryN] = useState(0);
  const firstRun = useRef(true);
  useEffect(() => {
    if (!live || !server) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPending(true);
    const timers: number[] = [];
    const t = window.setTimeout(
      () => {
        server.onRequest?.(q);
        timers.push(window.setTimeout(() => setSlow(true), 1000));
        timers.push(
          window.setTimeout(() => {
            setSlow(false);
            setPending(false);
            setFailed(!!server.fail);
            setSent(q);
          }, server.latency ?? 400),
        );
      },
      retryN > 0 && q === sent ? 0 : look.debounce,
    );
    return () => {
      window.clearTimeout(t);
      timers.forEach((x) => window.clearTimeout(x));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, retryN, live]);
  // 0건 · 실패는 바뀌면 한 번 알린다(결과가 있을 때는 개수를 알리지 않는다)
  useEffect(() => {
    if (!live) return;
    if (status === 'empty') say(`'${fq}'에 대한 검색 결과가 없어요`);
    else if (status === 'failure') say('검색 결과를 불러오지 못했어요');
    else say('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fq, live]);

  const optId = (v: string) => `${listId}-${v}`;
  const pick = (v: string) => {
    if (valueProp === undefined) setOwnValue(v);
    onValueChange?.(v);
  };
  const scrollTo = (v: string) => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(v)}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!live) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!options.length || status !== 'results') return;
      const i = hl ? options.findIndex((o) => o.value === hl) : -1;
      const n = e.key === 'ArrowDown' ? (i === -1 ? 0 : Math.min(options.length - 1, i + 1)) : i === -1 ? options.length - 1 : Math.max(0, i - 1);
      setHl(options[n].value);
      setHlByKey(true);
      scrollTo(options[n].value);
    } else if (e.key === 'Enter') {
      // 강조가 없으면 아무것도 하지 않는다 — 폼을 제출하지 않는다
      e.preventDefault();
      if (hl && status === 'results') {
        pick(hl);
        const o = options.find((x) => x.value === hl);
        say(`${o?.title ?? ''} 고름`);
      }
    } else if (e.key === 'Escape') {
      if (q) {
        e.preventDefault();
        e.stopPropagation();
        setQ('');
        setHl(null);
      } else onEscapeEmpty?.();
    }
  };

  const sizeOf: SearchSize | 'responsive' = size;
  const f = look.list.faces.none.light.enabled;
  const hlBg = dcv(look.highlight.bg, mode);
  const radioState = (v: string) => (pressed === v || highlight === v ? 'hovered' : 'enabled');

  const option = (o: SOption, gi: number, ii: number) => {
    const on = o.value === value;
    const isHl = highlight === o.value;
    const isPress = pressed === o.value;
    const first = gi === 0 && ii === 0;
    const reduceMove = reduce;
    const ratio = isPress && !reduceMove ? pressRatio(look.press, 320, f.pad.y * 2 + 40) : 1;
    return (
      <div
        key={o.value}
        id={optId(o.value)}
        role="option"
        aria-selected={on}
        data-value={o.value}
        tabIndex={bad?.tabRows ? 0 : undefined}
        onPointerEnter={live ? (e) => e.pointerType === 'mouse' && (setHl(o.value), setHlByKey(false)) : undefined}
        onPointerDown={live ? (e) => (e.preventDefault(), setPress(o.value)) : undefined}
        onPointerUp={live ? () => setPress(null) : undefined}
        onPointerLeave={live ? () => setPress(null) : undefined}
        onClick={
          live
            ? () => {
                pick(o.value);
                say(`${o.title} 고름`);
                inputRef.current?.focus();
              }
            : undefined
        }
        style={{ position: 'relative', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', ...(first ? marks?.option : undefined) }}
      >
        {first && pins?.option}
        {/* 강조 바탕 — 줄 폭 전체(0 · 모서리 0)에서 짚으면 좌우 6 · 모서리 10 으로 들어오며 150ms 에(Menu 알약 · List — Q-009-3 B).
            화살표로 옮길 때는 전환 없이 */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: isHl || isPress ? look.highlight.insetX : 0,
            right: isHl || isPress ? look.highlight.insetX : 0,
            borderRadius: isHl || isPress ? look.highlight.radius : 0,
            background: bad?.brandTint && on ? `var(--p-bg-brand-weak)` : isHl || isPress ? hlBg : 'transparent',
            transition: hlByKey ? 'none' : ['background-color', 'left', 'right', 'border-radius'].map((p) => `${p} ${look.color.duration} ${look.color.easing}`).join(', '),
            ...(first ? marks?.highlight : undefined),
          }}
        />
        {first && pins?.highlight}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            paddingTop: look.option.padY,
            paddingBottom: look.option.padY,
            paddingLeft: look.option.padX,
            paddingRight: look.option.padX,
            fontFamily: f.title.fontFamily,
            transform: ratio !== 1 ? `scale(${ratio})` : undefined,
            transition: `transform ${look.press.motion.duration} ${look.press.motion.easing}`,
          }}
        >
          {prefixKind !== 'none' && prefixes[o.value] && (
            <span aria-hidden style={{ position: 'relative', display: 'flex', flexShrink: 0, paddingRight: f.prefix.padRight, ...(first ? marks?.prefix : undefined) }}>
              {first && pins?.prefix}
              {prefixes[o.value]}
            </span>
          )}
          <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column', gap: f.body.gap, paddingRight: f.body.padRight }}>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: look.list.titleGap, minWidth: 0, fontFamily: look.title.fontFamily, fontSize: look.title.fontSize, lineHeight: look.title.lineHeight, fontWeight: look.title.fontWeight, color: bad?.brandTint && on ? `var(--p-fg-brand)` : dcv(look.title.fg, mode), ...(first ? marks?.title : undefined) }}>
              {first && pins?.title}
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.title}</span>
              {o.badge}
            </span>
            {o.detail && (
              <span style={{ position: 'relative', display: 'flex', minWidth: 0, fontFamily: look.detail.fontFamily, fontSize: look.detail.fontSize, lineHeight: look.detail.lineHeight, fontWeight: look.detail.fontWeight, color: dcv(look.detail.fg, mode), ...(first ? marks?.detail : undefined) }}>
                {first && pins?.detail}
                {o.detail}
              </span>
            )}
          </span>
          {!bad?.brandTint && (
            <span aria-hidden style={{ position: 'relative', display: 'flex', flexShrink: 0, pointerEvents: 'none', ...(first ? marks?.radio : undefined) }}>
              {first && pins?.radio}
              <RadioView look={look.radio} mode={mode} checked={on ? 'checked' : 'unchecked'} state={radioState(o.value)} tabIndex={-1} />
            </span>
          )}
        </div>
      </div>
    );
  };

  const results = () => {
    if (status === 'loading')
      return (
        <div aria-hidden style={{ display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: look.skeletonRows }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', paddingTop: look.option.padY, paddingBottom: look.option.padY, paddingLeft: look.option.padX, paddingRight: look.option.padX }}>
              {prefixKind !== 'none' && (
                <span style={{ display: 'flex', paddingRight: f.prefix.padRight }}>
                  {prefixKind === 'cardArt' ? (
                    <SkeletonView look={look.sk} mode={mode} radius="8" width={look.prefix.cardArt} height={Math.round(look.prefix.cardArt / 1.586)} />
                  ) : prefixKind === 'avatar' ? (
                    <SkeletonView look={look.sk} mode={mode} radius="full" width={Number(look.prefix.avatar.two)} height={Number(look.prefix.avatar.two)} />
                  ) : (
                    <SkeletonView look={look.sk} mode={mode} radius="12" width={Number(look.prefix.logo)} height={Number(look.prefix.logo)} />
                  )}
                </span>
              )}
              <span style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: f.body.gap }}>
                <SkeletonView look={look.sk} mode={mode} text="t5" width="40%" />
                <SkeletonView look={look.sk} mode={mode} text="t3" width="60%" />
              </span>
            </div>
          ))}
        </div>
      );
    if (status === 'failure')
      return <ResultSectionView look={look.result} mode={mode} kind="failure" size="medium" title="검색 결과를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요." primary={{ label: '다시 시도', onClick: () => (setFailed(false), setRetryN((n) => n + 1)) }} live={live} />;
    if (status === 'empty') return <ResultSectionView look={look.result} mode={mode} kind="empty" size="medium" title={`'${fq}'에 대한 검색 결과가 없어요`} description={emptyDescription} live={live} />;
    return shownGroups.map((g, gi) => (
      <Fragment key={g.label ?? gi}>
        {g.label ? (
          <div role="group" aria-labelledby={`${listId}-g${gi}`}>
            <div id={`${listId}-g${gi}`} style={{ position: 'relative', ...(gi === 0 ? marks?.header : undefined) }}>
              {gi === 0 && pins?.header}
              <ListHeaderView look={look.list} variant="mediumWeak" title={g.label} mode={mode} />
            </div>
            {g.items.map((o, ii) => option(o, gi, ii))}
          </div>
        ) : (
          g.items.map((o, ii) => option(o, gi, ii))
        )}
      </Fragment>
    ));
  };

  const fieldSize = sizeOf === 'responsive' ? 'responsive' : sizeOf;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: look.gap, width: '100%', minHeight: 0, fontFamily: f.title.fontFamily }}>
      <div style={{ position: 'relative', marginLeft: look.field.marginX, marginRight: look.field.marginX, ...marks?.field }}>
        {pins?.field}
        <TfInputView
          look={look.field.look}
          variant={bad?.boxField ? 'outline' : 'underline'}
          size={bad?.boxField ? 'large' : fieldSize}
          mode={mode}
          state={live ? undefined : focused ? 'focused' : 'enabled'}
          value={live ? q : query}
          onValue={
            live
              ? (v) => {
                  setQ(v);
                  setHl(null);
                }
              : undefined
          }
          placeholder={placeholder}
          prefixIcon="search"
          clearable
          ariaLabel="검색"
          inputRef={inputRef}
          inputProps={{
            role: 'combobox',
            'aria-expanded': true,
            'aria-controls': listId,
            'aria-autocomplete': 'list',
            'aria-activedescendant': highlight && status === 'results' ? optId(highlight) : undefined,
            autoComplete: 'off',
            onKeyDown: onKey,
            enterKeyHint: 'search',
          }}
          onClear={() => setHl(null)}
        />
      </div>
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={ariaLabel}
        // 마우스가 목록을 떠나면 마우스로 짚은 강조를 지운다 — 키보드로 짚은 강조는 남는다(Q-007-2 B)
        onPointerLeave={live ? (e) => e.pointerType === 'mouse' && !hlByKey && setHl(null) : undefined}
        style={{ position: 'relative', overflowY: maxHeight ? 'auto' : undefined, maxHeight, minHeight: 0, display: status === 'results' ? 'flex' : 'none', flexDirection: 'column' }}>
        {status === 'results' && results()}
      </div>
      {status !== 'results' && results()}
      {live && (
        <span role="status" style={srOnly}>
          {said}
        </span>
      )}
    </div>
  );
}
