'use client';
// Attachment Input 의 실제로 쓰는 그림 — 플레이그라운드 · 코드 미리보기(영수증 · 가져오기 · 대표 사진). 스펙대로 그린 칸(finish-view — attachment-input.yaml)에
// 실제로 파일을 고르고 끌어 놓는다. 고른 파일은 브라우저 안에서만 다룬다 — 올리기는 시늉(진행이 차오르고, "다음 올리기" 를 실패로 두면 실패)이다.
// 항목을 누르면 메뉴(1280 이상 Menu · 미만 Menu Sheet — menu-demos 의 ResponsiveMenu), 키보드는 Enter 메뉴 · Space 들기 → ← → → Space 놓기 · Esc 그만두기,
// 마우스는 누른 채 문턱(attachment-input.yaml item.dragStart)을 넘게 움직이면 끌기다.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { AT_REJECT, FONT, formatFileSize, icv, type AtEntry, type AtLook, type AtRejectCode, type ViewMode } from './finish-shared';
import { AtDropzoneView, AtFileName, AtItemView, AtPickButtonView, AtRowView, AtTriggerView, srOnly } from './finish-view';
import { ResponsiveMenu } from './menu-demos';
import type { MenuGroup, MenuKit } from './menu-shared';
import type { TriggerRender } from './menu-view';
import { useMinWidth } from './overlay-live';
import type { OvKit } from './overlay-shared';
import { BRANDS, MODES, Seg } from './select-playground';
import type { TfFieldLook } from './text-field-shared';
import { TfFieldView } from './text-field-view';
import { DemoFrame, WidePlayFrame } from './finish-play';

type Brand = 'desk' | 'hr';

// accept 글("image/*,application/pdf" · ".csv,.xlsx") — 고르기 창의 편의일 뿐이라 고른 뒤 다시 검사한다
function accepts(accept: string, f: { name: string; type: string }) {
  const rules = accept.split(',').map((r) => r.trim().toLowerCase()).filter(Boolean);
  if (!rules.length) return true;
  const name = f.name.toLowerCase();
  const type = (f.type || '').toLowerCase();
  return rules.some((r) => (r.startsWith('.') ? name.endsWith(r) : r.endsWith('/*') ? type.startsWith(r.slice(0, -1)) : type === r));
}
const glyphOf = (name: string, type: string): AtEntry['glyph'] => (type === 'application/pdf' || /\.pdf$/i.test(name) ? 'pdf' : /\.(csv|xlsx?|numbers)$/i.test(name) ? 'sheet' : 'file');

export type AtLiveProps = {
  look: AtLook;
  field: TfFieldLook;
  menu: MenuKit;
  ov: OvKit;
  mode?: ViewMode;
  layout?: 'tile' | 'dropzone';
  accept: string;
  acceptKind?: 'image' | 'file';
  maxFiles?: number;
  maxFileSize: number;
  label: string;
  description: string;
  badge?: string;
  reorder?: boolean;
  preview?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  initial?: AtEntry[];
  // 1280 이상(드롭존 · Menu) · 미만(파일 선택 버튼 · Menu Sheet) — auto 면 화면 폭
  screen?: 'auto' | 'wide' | 'narrow';
  rejectText?: Partial<Record<AtRejectCode, string>>;
  failNext?: boolean;
  onLog?: (t: string) => void;
};

export function AtLive({
  look,
  field,
  menu,
  ov,
  mode = 'auto',
  layout = 'tile',
  accept,
  acceptKind = 'image',
  maxFiles,
  maxFileSize,
  label,
  description,
  badge,
  reorder = false,
  preview = false,
  disabled = false,
  readOnly = false,
  initial = [],
  screen = 'auto',
  rejectText = AT_REJECT,
  failNext = false,
  onLog,
}: AtLiveProps) {
  const [entries, setEntries] = useState<AtEntry[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [heard, setHeard] = useState('');
  const [drag, setDrag] = useState(false);
  const [lifted, setLifted] = useState<{ id: string; from: AtEntry[] } | null>(null);
  const [dragging, setDragging] = useState<{ id: string; dx: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const timers = useRef(new Map<string, number>());
  const urls = useRef(new Set<string>());
  const failRef = useRef(failNext);
  failRef.current = failNext;
  const wideMedia = useMinWidth(look.breakpoint);
  const wide = screen === 'auto' ? wideMedia : screen === 'wide';
  const max = maxFiles ?? Infinity;
  const full = entries.length >= max;
  const announce = (t: string) => {
    setHeard('');
    window.setTimeout(() => setHeard(t), 30);
    onLog?.(t);
  };
  useEffect(() => {
    const t = timers.current;
    const u = urls.current;
    return () => {
      t.forEach((id) => window.clearInterval(id));
      u.forEach((x) => URL.revokeObjectURL(x));
    };
  }, []);
  // 드롭존 밖에 놓아도 브라우저가 파일을 열지 않게(드롭존이 있을 때만)
  useEffect(() => {
    if (layout !== 'dropzone' || !wide) return;
    const stop = (e: DragEvent) => e.preventDefault();
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, [layout, wide]);

  // 올리기 시늉 — 진행이 차오르고(값 있는 원), 다 차면 올림 · "다음 올리기" 가 실패면 중간에 실패
  const upload = (id: string) => {
    const fail = failRef.current;
    window.clearInterval(timers.current.get(id));
    let p = 0;
    setEntries((l) => l.map((e) => (e.id === id ? { ...e, status: 'uploading', progress: 0 } : e)));
    const t = window.setInterval(() => {
      p = Math.min(1, p + 0.12);
      if (fail && p >= 0.48) {
        window.clearInterval(t);
        setEntries((l) => l.map((e) => (e.id === id ? { ...e, status: 'error', progress: p } : e)));
        announce('1개는 올리지 못했어요.');
        return;
      }
      setEntries((l) => l.map((e) => (e.id === id ? { ...e, progress: p, status: p >= 1 ? 'success' : 'uploading' } : e)));
      if (p >= 1) window.clearInterval(t);
    }, 160);
    timers.current.set(id, t);
  };

  const take = (files: File[]) => {
    if (disabled || readOnly || !files.length) return;
    const codes = new Set<AtRejectCode>();
    const room = Math.max(0, max - entries.length);
    const ok: AtEntry[] = [];
    for (const f of files) {
      if (!accepts(accept, f)) codes.add('INVALID_TYPE');
      else if (f.size > maxFileSize) codes.add('FILE_TOO_LARGE');
      else if (ok.length >= room) codes.add('TOO_MANY_FILES');
      else {
        const image = f.type.startsWith('image/');
        const url = image ? URL.createObjectURL(f) : undefined;
        if (url) urls.current.add(url);
        ok.push({ id: `f${Date.now()}${ok.length}${Math.random().toString(36).slice(2, 6)}`, name: f.name, size: f.size, kind: image ? 'image' : 'file', glyph: glyphOf(f.name, f.type), status: 'pending', previewUrl: url });
      }
    }
    setError(codes.size ? [...codes].map((c) => rejectText[c] ?? AT_REJECT[c]).join(' ') : null);
    if (ok.length) {
      const next = max === 1 ? ok.slice(0, 1) : [...entries, ...ok];
      setEntries(next);
      announce(`${ok.every((e) => e.kind === 'image') ? `사진 ${ok.length}장을` : `파일 ${ok.length}개를`} 붙였어요.`);
      ok.forEach((e) => window.setTimeout(() => upload(e.id), 60));
    } else if (codes.size) announce('붙이지 못했어요.');
  };
  const pick = () => {
    if (disabled || readOnly || full) return;
    inputRef.current?.click();
  };
  const focusAfterRemove = (list: AtEntry[], i: number) => {
    window.requestAnimationFrame(() => {
      const next = list[i] ?? list[i - 1];
      const el = next ? itemRefs.current.get(next.id)?.querySelector<HTMLElement>('.pat-x') : null;
      (el ?? triggerRef.current)?.focus();
    });
  };
  const remove = (id: string) => {
    const i = entries.findIndex((e) => e.id === id);
    const gone = entries[i];
    window.clearInterval(timers.current.get(id));
    if (gone?.previewUrl) URL.revokeObjectURL(gone.previewUrl);
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    setError(null);
    announce(`지웠어요 — ${gone?.name ?? ''}`);
    focusAfterRemove(next, i);
  };
  const move = (id: string, to: number, focus = true) => {
    const from = entries.findIndex((e) => e.id === id);
    if (from < 0 || to < 0 || to >= entries.length || to === from) return;
    const next = [...entries];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setEntries(next);
    if (focus) window.requestAnimationFrame(() => itemRefs.current.get(id)?.focus());
    return next;
  };

  // ── 키보드 순서 바꾸기 — Space 들기 · ← → 옮기기 · Space · Enter 놓기 · Esc 그만두기 ──
  const onItemKey = (e: KeyboardEvent<HTMLElement>, id: string, openMenu: () => void) => {
    if (e.target !== e.currentTarget) return;
    const i = entries.findIndex((x) => x.id === id);
    if (lifted) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const to = i + (e.key === 'ArrowLeft' ? -1 : 1);
        if (move(id, to) !== undefined) announce(`${to + 1}번째 자리예요.`);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setLifted(null);
        announce(`${i + 1}번째 자리에 놓았어요.`);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEntries(lifted.from);
        setLifted(null);
        announce('옮기기를 그만뒀어요. 처음 자리예요.');
        window.requestAnimationFrame(() => itemRefs.current.get(id)?.focus());
      }
      return;
    }
    if (e.key === ' ' && reorder && !readOnly && !disabled) {
      e.preventDefault();
      setLifted({ id, from: entries });
      announce(`${i + 1}번째 항목을 들었어요.`);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openMenu();
    }
  };

  // ── 끌기 — 마우스는 누른 채 문턱(px)을 넘게, 터치 · 펜은 문턱(ms) 누른 뒤 움직이면 끌기. 그 전에 떼면 누르기(메뉴) ──
  const press = useRef<{ id: string; x: number; t: number; type: string; started: boolean } | null>(null);
  const onDown = (e: RPointerEvent<HTMLElement>, id: string) => {
    if (e.button !== 0 || disabled) return;
    // 실패한 항목 — 덮개 전체가 "다시 시도" 다. 메뉴 · 끌기는 다시 올린 뒤에(포인터). 키보드 Enter 메뉴 · × 는 그대로
    if (entries.find((x) => x.id === id)?.status === 'error') return;
    press.current = { id, x: e.clientX, t: performance.now(), type: e.pointerType, started: false };
  };
  const onMove = (e: RPointerEvent<HTMLElement>) => {
    const p = press.current;
    if (!p || !reorder || readOnly) return;
    const dx = e.clientX - p.x;
    if (!p.started) {
      const go = p.type === 'mouse' ? Math.abs(dx) > look.itemPress.mouse : performance.now() - p.t >= look.itemPress.touch && Math.abs(dx) > 2;
      if (!go) return;
      p.started = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    setDragging({ id: p.id, dx });
  };
  const onUp = (e: RPointerEvent<HTMLElement>, openMenu: () => void) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    if (!p.started) {
      if (readOnly) {
        if (preview) announce(`크게 보기 — ${entries.find((x) => x.id === p.id)?.name}`);
        return;
      }
      openMenu();
      return;
    }
    // 놓은 자리 — 끄는 항목의 가운데가 넘어간 항목들의 가운데 수
    const el = itemRefs.current.get(p.id);
    const from = entries.findIndex((x) => x.id === p.id);
    if (el && from >= 0) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      let to = 0;
      entries.forEach((x, k) => {
        if (x.id === p.id) return;
        const o = itemRefs.current.get(x.id)?.getBoundingClientRect();
        if (o && cx > o.left + o.width / 2) to += 1;
      });
      if (to !== from) {
        move(p.id, to, false);
        announce(`${to + 1}번째 자리에 놓았어요.`);
      }
    }
    setDragging(null);
    void e;
  };

  // 항목 메뉴 — 크게 보기(파일은 열기) · 대표로 정하기(띠를 쓸 때 사진만) · 앞으로 · 뒤로 | 지우기
  const groupsFor = (e: AtEntry, i: number): MenuGroup[] => [
    {
      items: [
        ...(preview ? [{ value: 'preview', label: e.kind === 'image' ? look.menu.preview : look.menu.open }] : []),
        ...(badge && e.kind === 'image' ? [{ value: 'cover', label: look.menu.makeCover, disabled: i === 0 }] : []),
        ...(reorder ? [{ value: 'earlier', label: look.menu.moveEarlier, disabled: i === 0 }] : []),
        ...(reorder ? [{ value: 'later', label: look.menu.moveLater, disabled: i === entries.length - 1 }] : []),
      ],
    },
    { items: [{ value: 'remove', label: look.menu.remove, tone: 'critical' as const }] },
  ];
  const act = (e: AtEntry) => (v: string) => {
    const i = entries.findIndex((x) => x.id === e.id);
    if (v === 'preview') announce(`${e.kind === 'image' ? '크게 보기' : '열기'} — ${e.name}`);
    else if (v === 'cover') {
      move(e.id, 0);
      announce('대표로 정했어요. 1번째 자리예요.');
    } else if (v === 'earlier') {
      move(e.id, i - 1);
      announce(`${i}번째 자리예요.`);
    } else if (v === 'later') {
      move(e.id, i + 1);
      announce(`${i + 2}번째 자리예요.`);
    } else if (v === 'remove') remove(e.id);
  };
  const menuOn = (reorder || preview) && !readOnly && !disabled;
  const firstImage = entries.findIndex((x) => x.kind === 'image');

  const item = (e: AtEntry, i: number) => {
    const base = {
      look,
      mode,
      entry: e,
      badge: badge && i === firstImage && i === 0 ? badge : undefined,
      readOnly,
      disabled,
      dragging: dragging?.id === e.id,
      onRemove: () => remove(e.id),
      onRetry: () => upload(e.id),
    };
    const lift = lifted?.id === e.id;
    const style: CSSProperties | undefined = dragging?.id === e.id ? { transform: `translateX(${dragging.dx}px)`, zIndex: 3 } : lift ? { outline: `2px dashed ${icv(look.ring.color, mode)}`, outlineOffset: 2 } : undefined;
    const register = (el: HTMLElement | null) => {
      if (el) itemRefs.current.set(e.id, el);
      else itemRefs.current.delete(e.id);
    };
    const reorderProps = {
      'data-reorder': '',
      role: 'button',
      tabIndex: disabled ? -1 : 0,
      'aria-roledescription': reorder ? '순서를 바꿀 수 있는 항목' : undefined,
      'aria-label': `${e.name}, ${formatFileSize(e.size)}${e.status === 'uploading' ? `, 올리는 중 ${Math.round((e.progress ?? 0) * 100)}%` : e.status === 'error' ? ', 올리지 못했어요' : ''}${i === 0 && badge && e.kind === 'image' ? `, ${badge}` : ''}`,
      'aria-pressed': lift ? true : undefined,
      'aria-describedby': reorder ? 'at-reorder-help' : undefined,
    };
    if (!menuOn) {
      return (
        <div key={e.id} ref={register} style={{ flexShrink: 0 }}>
          <AtItemView {...base} itemProps={reorder || preview ? { ...reorderProps, onPointerDown: (ev) => onDown(ev, e.id), onPointerUp: (ev) => onUp(ev, () => undefined), style } : undefined} />
        </div>
      );
    }
    const trigger: TriggerRender = (r) => {
      const open = () => {
        const kd = r.props.onKeyDown as ((ev: unknown) => void) | undefined;
        const ck = r.props.onClick as ((ev: unknown) => void) | undefined;
        if (kd) kd({ key: 'Enter', preventDefault: () => undefined });
        else ck?.({ detail: 0 });
      };
      return (
        <AtItemView
          {...base}
          itemProps={{
            ...reorderProps,
            id: r.props.id,
            'aria-haspopup': r.props['aria-haspopup'],
            'aria-expanded': r.props['aria-expanded'],
            'aria-controls': r.props['aria-controls'],
            ref: (el: HTMLDivElement | null) => {
              r.ref(el);
              register(el);
            },
            onKeyDown: (ev) => onItemKey(ev, e.id, open),
            onPointerDown: (ev) => onDown(ev, e.id),
            onPointerMove: onMove,
            onPointerUp: (ev) => onUp(ev, open),
            onPointerCancel: () => ((press.current = null), setDragging(null)),
            onClick: (ev) => {
              if (ev.detail === 0 && ev.target === ev.currentTarget) open();
            },
            style,
          } as AtItemViewItemProps}
        />
      );
    };
    return <ResponsiveMenu key={e.id} kit={menu} ov={ov} mode={mode} groups={groupsFor(e, i)} title={e.name} label={e.name} onAction={act(e)} trigger={trigger} force={wide ? 'menu' : 'sheet'} />;
  };

  const tileRow = (
    <AtRowView look={look} ariaLabel={`${label} 목록`}>
      <AtTriggerView
        look={look}
        mode={mode}
        count={entries.length}
        max={maxFiles}
        accept={acceptKind}
        label={label}
        disabled={disabled}
        readOnly={readOnly}
        onPress={pick}
        style={{}}
      />
      {entries.map(item)}
    </AtRowView>
  );
  const dropzone =
    layout === 'dropzone' &&
    (wide ? (
      <AtDropzoneView
        look={look}
        mode={mode}
        drag={drag && !full}
        disabled={disabled || full}
        onPick={pick}
        dropProps={{
          onDragEnter: (e) => (e.preventDefault(), !disabled && !full && setDrag(true)),
          onDragOver: (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = disabled || full ? 'none' : 'copy';
          },
          onDragLeave: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrag(false);
          },
          onDrop: (e) => {
            e.preventDefault();
            setDrag(false);
            if (!disabled && !full) take(Array.from(e.dataTransfer.files));
          },
        }}
      />
    ) : (
      <AtPickButtonView look={look} mode={mode} disabled={disabled || full} onPick={pick} />
    ));
  return (
    <div style={{ fontFamily: FONT, position: 'relative' }}>
      <TfFieldView look={field} mode={mode} group label={label} description={description} invalid={error !== null} errorMessage={error ?? undefined}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: look.root.gap }}>
          {layout === 'tile' ? (
            tileRow
          ) : (
            <>
              {dropzone}
              {entries.length > 0 && (
                <AtRowView look={look} bleed={false} fog={false}>
                  {entries.map((e) => (
                    <AtItemView key={e.id} look={look} mode={mode} entry={e} disabled={disabled} onRemove={() => remove(e.id)} onRetry={() => upload(e.id)} />
                  ))}
                </AtRowView>
              )}
            </>
          )}
        </div>
      </TfFieldView>
      <input ref={inputRef} type="file" hidden accept={accept} multiple={max > 1} disabled={disabled || readOnly} onChange={(e) => (take(Array.from(e.target.files ?? [])), (e.target.value = ''))} />
      <span id="at-reorder-help" style={srOnly}>
        Space 로 들고 ← → 로 옮긴 뒤 Space 로 놓아요. Esc 는 그만두기예요. Enter 는 메뉴예요.
      </span>
      <div role="status" aria-live="polite" style={srOnly}>
        {heard}
      </div>
    </div>
  );
}
type AtItemViewItemProps = NonNullable<Parameters<typeof AtItemView>[0]['itemProps']>;

// 화면 읽기 · 요청 기록(보이는 줄) — 마지막이 위
function Log({ items, empty }: { items: string[]; empty: string }) {
  return (
    <div className="flex min-h-[44px] flex-col items-center gap-0.5 text-center text-[12px] leading-5 text-fd-muted-foreground">
      {items.length ? items.map((t, i) => <span key={`${i}${t}`} className={i === 0 ? 'font-semibold text-fd-foreground' : undefined}>{t}</span>) : <span>{empty}</span>}
    </div>
  );
}
function useLog() {
  const [log, setLog] = useState<string[]>([]);
  return { log, push: (t: string) => setLog((l) => [t, ...l].slice(0, 3)), clear: () => setLog([]) };
}

// ── 플레이그라운드 ────────────────────────────────────────
type Acc = 'mixed' | 'image' | 'sheet';
const ACCEPT: Record<Acc, { accept: string; kind: 'image' | 'file'; label: string; description: string; invalid: string; size: number }> = {
  mixed: { accept: 'image/*,application/pdf', kind: 'image', label: '영수증', description: '사진 · PDF 를 10MB 까지 올려요. 10개까지.', invalid: AT_REJECT.INVALID_TYPE, size: 10 },
  image: { accept: 'image/*', kind: 'image', label: '사진', description: '사진을 10장까지 올려요. 첫 사진이 대표예요.', invalid: '사진만 올릴 수 있어요.', size: 10 },
  sheet: { accept: '.csv,.xlsx,.xls', kind: 'file', label: '파일 업로드', description: 'CSV(.csv) 또는 Excel(.xlsx, .xls) 파일을 올려주세요. 최대 10MB.', invalid: 'CSV · Excel 파일만 올릴 수 있어요.', size: 10 },
};
export function AtPlayground({ looks, fields, menu, ov, initial }: { looks: Record<Brand, AtLook>; fields: Record<Brand, TfFieldLook>; menu: Record<Brand, MenuKit>; ov: Record<Brand, OvKit>; initial: AtEntry[] }) {
  const [layout, setLayout] = useState<'tile' | 'dropzone'>('tile');
  const [acc, setAcc] = useState<Acc>('mixed');
  const [max, setMax] = useState<'10' | '3' | '1' | 'none'>('10');
  const [badge, setBadge] = useState<'no' | 'yes'>('no');
  const [reorder, setReorder] = useState<'no' | 'yes'>('yes');
  const [state, setState] = useState<'enabled' | 'readonly' | 'disabled'>('enabled');
  const [screen, setScreen] = useState<'auto' | 'wide' | 'narrow'>('auto');
  const [fail, setFail] = useState<'ok' | 'fail'>('ok');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const { log, push, clear } = useLog();
  const a = ACCEPT[layout === 'dropzone' ? 'sheet' : acc];
  const maxFiles = layout === 'dropzone' ? 1 : max === 'none' ? undefined : Number(max);
  const look = looks[brand];
  const key = `${layout}${acc}${max}${badge}${reorder}${state}${brand}`;
  const start = layout === 'dropzone' ? [] : initial.filter((e) => acc !== 'image' || e.kind === 'image').slice(0, maxFiles ?? initial.length);
  const code = useMemo(() => {
    const attrs = [
      ...(layout === 'dropzone' ? ['layout="dropzone"'] : []),
      `accept="${a.accept}"`,
      ...(maxFiles !== undefined ? [`maxFiles={${maxFiles}}`] : ['maxFiles={Infinity}']),
      `maxFileSize={${a.size} * 1024 * 1024}`,
      ...(badge === 'yes' && layout === 'tile' ? ['badgeLabel="대표"'] : []),
      'entries={entries}',
      'onFilesAccept={accept}',
      'onFilesReject={reject}',
      'onRemove={remove}',
      'onRetry={retry}',
      ...(reorder === 'yes' && layout === 'tile' ? ['onReorder={setEntries}', 'onPreview={openViewer}'] : []),
      ...(state === 'readonly' ? ['readOnly'] : state === 'disabled' ? ['disabled'] : []),
    ];
    return [
      'import { AttachmentInput } from "@/components/ui/attachment-input"',
      'import { Field } from "@/components/ui/field"',
      '',
      `<Field label="${a.label}" description="${a.description}" invalid={error !== null} errorMessage={error}>`,
      '  <AttachmentInput',
      ...attrs.map((x) => `    ${x}`),
      '  />',
      '</Field>',
    ].join('\n');
  }, [layout, a, maxFiles, badge, reorder, state]);
  return (
    <WidePlayFrame
      surface={icv(look.surface.default, mode)}
      code={code}
      stage={
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-4 px-2">
          <AtLive
            key={key}
            look={look}
            field={fields[brand]}
            menu={menu[brand]}
            ov={ov[brand]}
            mode={mode}
            layout={layout}
            accept={a.accept}
            acceptKind={a.kind}
            maxFiles={maxFiles}
            maxFileSize={a.size * 1024 * 1024}
            label={a.label}
            description={a.description}
            badge={badge === 'yes' && layout === 'tile' ? '대표' : undefined}
            reorder={reorder === 'yes' && layout === 'tile'}
            preview={reorder === 'yes' && layout === 'tile'}
            readOnly={state === 'readonly'}
            disabled={state === 'disabled'}
            initial={start}
            screen={screen}
            rejectText={{ INVALID_TYPE: a.invalid, TOO_MANY_FILES: `${maxFiles ?? 10}개까지 올릴 수 있어요.`, FILE_TOO_LARGE: `${a.size}MB 넘는 파일은 올릴 수 없어요.` }}
            failNext={fail === 'fail'}
            onLog={push}
          />
          <Log items={log} empty="타일을 눌러 파일을 고르거나 끌어 놓아 보세요 — 항목을 누르면 메뉴, Space 로 들어 ← → 로 옮겨요." />
        </div>
      }
      controls={
        <>
          <Seg
            label="모양 layout"
            value={layout}
            options={[
              ['tile', 'tile — 타일 + 줄'],
              ['dropzone', 'dropzone — 파일 하나'],
            ]}
            onChange={(v) => (setLayout(v), clear())}
          />
          <Seg
            label="받는 형식 accept"
            value={acc}
            options={[
              ['mixed', '사진 · PDF'],
              ['image', '사진만'],
              ['sheet', 'CSV · Excel'],
            ]}
            onChange={(v) => (setAcc(v), clear())}
          />
          <Seg
            label="최대 개수 maxFiles"
            value={max}
            options={[
              ['10', '10'],
              ['3', '3'],
              ['1', '1'],
              ['none', '없음(개수 안 그림)'],
            ]}
            onChange={(v) => (setMax(v), clear())}
          />
          <Seg
            label="대표 배지 badgeLabel"
            value={badge}
            options={[
              ['no', '없음'],
              ['yes', '"대표"'],
            ]}
            onChange={setBadge}
          />
          <Seg
            label="순서 바꾸기 onReorder"
            value={reorder}
            options={[
              ['no', '없음'],
              ['yes', '메뉴 · 끌기 · 키보드'],
            ]}
            onChange={setReorder}
          />
          <Seg
            label="상태"
            value={state}
            options={[
              ['enabled', '기본'],
              ['readonly', '읽기 전용'],
              ['disabled', '막힘'],
            ]}
            onChange={setState}
          />
          <Seg
            label="폭(드롭존 · 메뉴)"
            value={screen}
            options={[
              ['auto', '화면 따라'],
              ['wide', '1280 이상'],
              ['narrow', '1280 미만'],
            ]}
            onChange={setScreen}
          />
          <Seg
            label="다음 올리기"
            value={fail}
            options={[
              ['ok', '성공'],
              ['fail', '실패 — 다시 시도'],
            ]}
            onChange={setFail}
          />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ── 코드 미리보기 ─────────────────────────────────────────
type Kits = { look: AtLook; field: TfFieldLook; menu: MenuKit; ov: OvKit };
function FailToggle({ value, onChange }: { value: 'ok' | 'fail'; onChange: (v: 'ok' | 'fail') => void }) {
  return (
    <Seg
      label="다음 올리기"
      value={value}
      options={[
        ['ok', '성공'],
        ['fail', '실패 — 다시 시도'],
      ]}
      onChange={onChange}
    />
  );
}
// 영수증 — 사진 · PDF, 올리는 중 · 실패 · 다시 시도, 거절은 칸 아래 오류 글
export function ExReceiptDemo({ look, field, menu, ov, initial }: Kits & { initial: AtEntry[] }) {
  const [fail, setFail] = useState<'ok' | 'fail'>('ok');
  const { log, push } = useLog();
  return (
    <DemoFrame bg={icv(look.surface.default, 'auto')} w={440}>
      <AtLive look={look} field={field} menu={menu} ov={ov} accept="image/*,application/pdf" maxFiles={10} maxFileSize={10 * 1024 * 1024} label="영수증" description="사진 · PDF 를 10MB 까지 올려요. 10개까지." initial={initial} failNext={fail === 'fail'} onLog={push} />
      <div className="flex flex-col items-center gap-2 border-t border-fd-border pt-3">
        <FailToggle value={fail} onChange={setFail} />
        <Log items={log} empty="타일을 눌러 사진 · PDF 를 골라 보세요 — 10MB 넘는 파일 · 다른 형식은 칸 아래 한 문장으로 알려요." />
      </div>
    </DemoFrame>
  );
}
// 파일 하나 가져오기 — 1280 이상 드롭존, 미만 파일 선택 버튼. 하나를 고르면 드롭존이 막힌다
export function ExImportDemo({ look, field, menu, ov }: Kits) {
  const [fail, setFail] = useState<'ok' | 'fail'>('ok');
  const { log, push } = useLog();
  return (
    <DemoFrame bg={icv(look.surface.default, 'auto')} w={560}>
      <AtLive
        look={look}
        field={field}
        menu={menu}
        ov={ov}
        layout="dropzone"
        acceptKind="file"
        accept=".csv,.xlsx,.xls"
        maxFiles={1}
        maxFileSize={10 * 1024 * 1024}
        label="파일 업로드"
        description="CSV(.csv) 또는 Excel(.xlsx, .xls) 파일을 올려주세요. 최대 10MB."
        rejectText={{ INVALID_TYPE: 'CSV · Excel 파일을 10MB 까지 올릴 수 있어요.', FILE_TOO_LARGE: 'CSV · Excel 파일을 10MB 까지 올릴 수 있어요.', TOO_MANY_FILES: 'CSV · Excel 파일을 10MB 까지 올릴 수 있어요.' }}
        failNext={fail === 'fail'}
        onLog={push}
      />
      <div className="flex flex-col items-center gap-2 border-t border-fd-border pt-3">
        <FailToggle value={fail} onChange={setFail} />
        <Log items={log} empty="1280 이상은 파일을 끌어다 놓거나 '파일 선택', 미만은 버튼만 — 고르면 분석 중 원이 돌아요." />
      </div>
    </DemoFrame>
  );
}
// 대표 사진 · 순서 바꾸기 — 누르면 메뉴, 끌기, 키보드
export function ExReorderDemo({ look, field, menu, ov, initial }: Kits & { initial: AtEntry[] }) {
  const { log, push } = useLog();
  return (
    <DemoFrame bg={icv(look.surface.default, 'auto')} w={440}>
      <AtLive look={look} field={field} menu={menu} ov={ov} accept="image/*" maxFiles={10} maxFileSize={10 * 1024 * 1024} label="사진" description="사진을 10장까지 올려요. 첫 사진이 대표예요." badge="대표" reorder preview initial={initial} onLog={push} />
      <div className="border-t border-fd-border pt-3">
        <Log items={log} empty="사진을 눌러 메뉴로 옮기거나, 끌거나, Tab 으로 가서 Space · ← → · Space 로 옮겨 보세요." />
      </div>
    </DemoFrame>
  );
}

// 파일 이름 — 잰 줄 수를 함께 보인다(가장 나쁜 이름이 네 줄에 드는지)
export function AtNameCard({ look, mode = 'auto', entry }: { look: AtLook; mode?: ViewMode; entry: AtEntry }) {
  const [lines, setLines] = useState<number | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <AtItemView look={look} mode={mode} entry={entry} frozen />
      <span aria-hidden style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
        <AtFileName look={look} name={entry.name} onLines={setLines} />
      </span>
      <span className="text-[12px] leading-4" style={{ color: icv(look.size.color, mode) }}>
        {lines === null ? '—' : lines <= look.name.maxLines ? `${lines}줄 — 다 든다` : `${lines}줄 — 셋째 줄 "…" + 넷째 줄 확장자`}
      </span>
    </div>
  );
}
export type { ReactNode };
