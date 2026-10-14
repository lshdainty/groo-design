'use client';
// 그린 것을 재서 숫자를 단다 — 줄을 바꾼 제목의 높이 · 펼친 내용의 높이 · 화면의 전체 길이처럼 글 길이 · 폭에 따라 달라지는 값은
// 그림에 적지 않고 브라우저에서 잰다(YAML 의 고정 값은 그림이 YAML 에서 바로 적는다).
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
// 그림 표시 분홍(foundations/ui 의 MARK_LINE 과 같은 값) — 그 파일은 DESIGN.md 를 읽는 서버 모듈이라 브라우저 그림이 들이지 않는다
const MARK_LINE = '#DB2777';

export function useBoxSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: Math.round(el.getBoundingClientRect().width * 10) / 10, h: Math.round(el.offsetHeight * 10) / 10 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

// 오른쪽(또는 왼쪽) 바깥에 높이 괄호 + 숫자. 그림은 줄여 그려도(scale) 실제 px 를 적는다 — offsetHeight 는 변형 전 값이다.
// 서버 그림이 부르므로 함수를 넘기지 않는다 — 글은 앞 · 뒤 글자(prefix · suffix)로
// scale — 안의 그림을 줄여 그렸으면 그 배율(적는 값은 잰 높이 ÷ 배율 = 실제 px)
export function MeasureH({ children, prefix = '', suffix = '', side = 'right', style, gap = 8, scale = 1 }: { children: ReactNode; prefix?: string; suffix?: string; side?: 'right' | 'left'; style?: CSSProperties; gap?: number; scale?: number }) {
  const { ref, size } = useBoxSize<HTMLDivElement>();
  return (
    <div style={{ position: 'relative', ...style }}>
      <div ref={ref}>{children}</div>
      {size && (
        <span aria-hidden className="pointer-events-none absolute flex items-center" style={{ top: 0, height: size.h, [side]: -gap - 6, flexDirection: side === 'right' ? 'row' : 'row-reverse', zIndex: 4 } as CSSProperties}>
          <span style={{ alignSelf: 'stretch', width: 6, borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}`, [side === 'right' ? 'borderRight' : 'borderLeft']: `1px solid ${MARK_LINE}` } as CSSProperties} />
          <span className="whitespace-nowrap px-1 text-[11px] font-semibold leading-4" style={{ color: MARK_LINE, position: 'absolute', [side === 'right' ? 'left' : 'right']: 10 } as CSSProperties}>
            {`${prefix}${Math.round(size.h / scale).toLocaleString('ko-KR')}${suffix}`}
          </span>
        </span>
      )}
    </div>
  );
}

// 잰 값을 글로 — 그림 아래 한 줄에 "전체 1,742px" 처럼. template 의 {h} · {w} 자리에 잰 값(서버 그림이 부르므로 글로 넘긴다)
export function MeasuredText({ target, template }: { target: string; template: string }) {
  const [v, setV] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-measure="${target}"]`);
    if (!el) return;
    const measure = () => setV({ w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.offsetHeight) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [target]);
  return <>{v ? template.replace('{h}', v.h.toLocaleString('ko-KR')).replace('{w}', v.w.toLocaleString('ko-KR')) : '—'}</>;
}

// 줄여 그린다 — 높이를 모르는 그림(전체 길이 화면)은 재서 자리를 잡는다
export function ScaledAuto({ w, s, children, style }: { w: number; s: number; children: ReactNode; style?: CSSProperties }) {
  const { ref, size } = useBoxSize<HTMLDivElement>();
  return (
    <div className="shrink-0" style={{ width: w * s, height: size ? size.h * s : undefined, overflow: 'hidden', ...style }}>
      <div ref={ref} style={{ width: w, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

// 그림을 한 항목 아래에서 끊는다 — 패널 폭에 따라 이름이 줄을 바꿔 높이가 바뀌어도 그 항목이 마지막에 오게 재서 높이를 정한다
export function CropAfter({ selector, children, style }: { selector: string; children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | undefined>(undefined);
  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const measure = () => {
      const el = box.querySelector<HTMLElement>(selector);
      if (!el) return;
      const b = box.getBoundingClientRect();
      // 테두리 안쪽에서 잰다 — 끊는 항목의 아래 끝 + 아래 테두리
      setH(Math.ceil(el.getBoundingClientRect().bottom - b.top + box.clientTop));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.firstElementChild) ro.observe(box.firstElementChild);
    return () => ro.disconnect();
  }, [selector]);
  return (
    <div ref={ref} style={{ boxSizing: 'border-box', height: h, overflow: 'hidden', flexShrink: 0, ...style }}>
      {children}
    </div>
  );
}

// 나무 줄의 높이 · 이름 줄 수 — 줄 안(decor)에 두면 그 줄을 재서 글로 쓴다. template 의 {h} 는 줄 높이, {n} 은 이름 줄 수
export function RowNote({ template, lineHeight, style }: { template: string; lineHeight: number; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState<{ h: number; n: number } | null>(null);
  useEffect(() => {
    const row = ref.current?.closest('[data-tree-item]')?.firstElementChild as HTMLElement | null | undefined;
    if (!row) return;
    const label = row.querySelector<HTMLElement>(':scope > div > span:last-child');
    const measure = () => setV({ h: row.offsetHeight, n: label ? Math.round(label.offsetHeight / lineHeight) : 1 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [lineHeight]);
  return (
    <span ref={ref} style={style}>
      {v ? template.replace('{h}', String(v.h)).replace('{n}', String(v.n)) : ''}
    </span>
  );
}
