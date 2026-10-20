import * as React from "react";

import { cn } from "@/lib/utils";
import { useFieldGroup, useFieldGroupState } from "@/components/ui/field";

/*
 * Groo Slider — 구조는 SEED Slider(2026-10-09). 수치 원본은 specs/components/slider.yaml.
 *
 *   Slider        값 하나 — min · max · step(기본 1) · value · defaultValue · onValueChange(value — 움직일 때마다, 화면만) ·
 *                 onValueCommit(value — 손을 뗄 때 · 키마다 한 번, 바로 적용하는 저장은 여기서) · formatValue(value — 단위를 붙인 글,
 *                 기본은 숫자 그대로) · disabled · name · dir. 구간이 2 ~ 5개면 눈금 · 단계 표식을 스스로 그린다
 *   RangeSlider   값 둘 — value · defaultValue 가 [최소, 최대], onValueChange · onValueCommit 도 두 값. thumbLabels(기본 ["최소", "최대"] —
 *                 손잡이 이름은 "{라벨} {thumbLabels}"). 나머지는 Slider 와 같다
 *   SliderValue   머리 값 — Field 의 headerAction 자리에 둔다. 16 / 22 · 700 · 고정폭 숫자, 보조 기술에는 숨긴다(값은 손잡이가 읽힌다)
 *
 * Field 안이면 Field 의 라벨이 손잡이 이름(aria-labelledby), 설명 · 오류가 설명(aria-describedby)이 되고(useFieldGroup), Field 의 막힘 ·
 * 오류를 받는다(useFieldGroupState). 라벨이 없으면 aria-label. 이름 자리에 값을 넣지 않는다 — 값은 aria-valuetext(formatValue — "80%")다.
 *
 * 자리: 위 24 는 말풍선 자리다(root paddingTop) — Field 머리 ↔ 손잡이 줄 32(Field 간격 8 + 24)라 말풍선(26)이 라벨 · 머리 값을 덮지 않는다.
 *   누르는 자리는 손잡이 줄 44 뿐이다(위 24 는 누르는 자리가 아니다).
 * 모양(사용자 결정 1B — SEED 무채색): 손잡이 줄 44(줄 전체가 누르는 자리) 가운데에 트랙 4 stroke-neutral-weak · 채움 fg-neutral ·
 *   손잡이 20 bg-neutral-inverted(테두리 · 그림자 없음, 끄는 동안 24 — 1.2배). 손잡이 가운데는 트랙 양 끝에서 10 들어온 자리까지만 가고,
 *   채움은 트랙 끝(범위는 앞 손잡이)에서 손잡이 가운데까지다. 브랜드 색으로 칠하지 않는다.
 * 값(2C): 머리 값(SliderValue) · 말풍선(끄는 동안 · 마우스를 손잡이에 올렸을 때 · 키보드 포커스일 때 — 손잡이 위 12, 13 / 18 · 500,
 *   bg-neutral-inverted · 위아래 4 · 좌우 8 · 모서리 6 · 아래 8 × 6 화살표, 트랙 끝에서는 상자만 안으로 밀린다) · 아래 2 의 표식(양 끝 값,
 *   13 / 18 fg-neutral-muted). 말풍선 · 표식은 보조 기술에 숨긴다.
 * 눈금(3B): 구간((max − min) ÷ step)이 2 ~ 5개면 양 끝을 뺀 단계 자리마다 트랙 · 채움을 끊는 틈 4(놓인 표면이 비친다 — 마스크로 끊어
 *   시트 · 팝오버 위에서도 표면 색 그대로)와 단계마다 표식. 6개 이상이면 눈금 없이 양 끝 표식만 — 숫자를 늘어놓지 않는다.
 * 누르기: 손잡이를 누르면 바로 끈다(24 + 말풍선). 손잡이 밖(손잡이 줄 어디든)을 누르면 가장 가까운 손잡이가 그 자리(가장 가까운 단계)로
 *   150ms 에 건너뛰고, 그대로 움직이거나 150ms 넘게 누르고 있으면 끌기가 된다 — 짧게 누르고 떼기만 하면(Tap jump) 말풍선은 뜨지 않는다(SEED).
 *   끄는 동안은 손가락을 1:1 로 따른다(전환 없음). 두 손잡이는 서로를 넘지 않는다.
 * 저장(4B): 손을 뗄 때 한 번 onValueCommit — 값이 바뀌었을 때만. 키보드는 키마다 한 번. 요청 중이라고 스스로 막지 않는다(막으면 손잡이가
 *   Tab 순서에서 빠져 초점이 본문으로 떨어진다). 실패하면 부르는 쪽이 값을 되돌리고 Field 오류로 알린다.
 * 키보드(APG): ← ↓ · → ↑ 한 단계, Shift + 화살표 · PageDown · PageUp 10단계(끝에서 멈춘다), Home · End 는 포커스한 손잡이를 최솟값 ·
 *   최댓값으로(범위면 다른 손잡이 값까지). RTL 은 ← → 만 뒤집고 ↑ 는 늘 늘린다. 손잡이마다 Tab 한 번.
 * 상태: 키보드 포커스에만 손잡이 둘레 링 2px · 띄움 2px + 말풍선. 막힘은 전용 색(트랙 bg-disabled · 채움 · 손잡이 · 표식 fg-disabled) —
 *   흐리게 하지 않고 Tab 순서에서 빠진다. 오류는 모양을 바꾸지 않는다(Field 꼬리의 글).
 * 모션: 건너뛰기(누름 · 키보드)는 손잡이 · 채움 150ms easing, 누름 크기 150ms, 말풍선은 200ms enter(0.9배 · 투명 · 아래 5 에서) ·
 *   200ms easing(투명 · 아래 5 로). 모션 줄이기면 건너뛰기 · 크기는 바로, 말풍선은 투명도만.
 */

// 손잡이 반지름 — 손잡이 가운데가 트랙 양 끝에서 이만큼 들어온 자리까지만 간다
const INSET = 10;
// 짧게 누르기(Tap jump)와 끌기를 가르는 시간 · 거리 — 손잡이 밖을 누른 채 이만큼 지나거나 움직이면 끌기
const HOLD_MS = 150;
const MOVE_PX = 3;

type Dir = "ltr" | "rtl";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const decimalsOf = (n: number) => {
  const s = String(n);
  const at = s.indexOf(".");
  return at < 0 ? 0 : s.length - at - 1;
};

// 단계 자리 — 진행 비율(0 ~ 1) 계산의 길이 식. CSS 의 % 는 손잡이 줄(= 트랙) 폭이다
const at = (p: number) => `calc(${INSET}px + (100% - ${INSET * 2}px) * ${p})`;

// 눈금 — 양 끝을 뺀 단계 자리마다 폭 4 의 틈. 트랙(채움 포함)을 마스크로 끊어 놓인 표면이 비치게 한다
function tickMask(intervals: number) {
  const stops: string[] = [];
  let from = "0px";
  for (let k = 1; k < intervals; k++) {
    const x = `${INSET}px + (100% - ${INSET * 2}px) * ${k} / ${intervals}`;
    stops.push(`#000 ${from} calc(${x} - 2px)`, `transparent calc(${x} - 2px) calc(${x} + 2px)`);
    from = `calc(${x} + 2px)`;
  }
  stops.push(`#000 ${from} 100%`);
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

// 말풍선 화살표 — 8 × 6, 아래를 가리키고 끝을 둥글린다(SEED 모서리 2)
const ARROW_PATH = "M0 0H8L4.67 5A0.8 0.8 0 0 1 3.33 5Z";

// 마지막 입력이 키보드인가 — 손잡이에 초점이 올 때 키보드로 왔는지 가른다. 손잡이를 누르면 레시피가 손잡이에 초점을 직접 두는데,
// 브라우저의 :focus-visible 은 그 앞의 키보드 초점을 이어받아 마우스 · 손가락으로 누른 손잡이에도 링이 뜬다(Chromium) — 링 · 말풍선은
// 이 값과 손잡이의 키 누름으로만 건다. 문서에 한 번 단다(잡는 단계 — 다른 처리보다 먼저)
let lastInput: "keyboard" | "pointer" = "pointer";
let tracking = false;
function trackInput() {
  if (tracking || typeof document === "undefined") return;
  tracking = true;
  document.addEventListener(
    "keydown",
    (e) => {
      if (!e.metaKey && !e.ctrlKey && !e.altKey) lastInput = "keyboard";
    },
    true,
  );
  document.addEventListener("pointerdown", () => (lastInput = "pointer"), true);
}

type Interaction = {
  pointerId: number;
  /** 움직이는 손잡이 — 두 손잡이가 같은 자리에서 눌렸으면 첫 움직임의 방향으로 정한다(-1) */
  index: number;
  /** 손잡이를 잡은 자리 ↔ 손잡이 가운데(손잡이 줄의 시작 쪽에서 잰 거리) — 잡은 자리가 손가락 밑에 그대로 남는다 */
  offset: number;
  downX: number;
  startValues: number[];
  dragging: boolean;
  timer: number | undefined;
};

type CoreProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> & {
  values: number[];
  onValuesChange: (values: number[]) => void;
  onValuesCommit: (values: number[]) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
  disabled?: boolean;
  name?: string;
  dir?: Dir;
  thumbLabels?: readonly string[];
};

const SliderCore = React.forwardRef<HTMLDivElement, CoreProps>(
  (
    {
      values,
      onValuesChange,
      onValuesCommit,
      min,
      max,
      step,
      formatValue,
      disabled: disabledProp,
      name,
      dir: dirProp,
      thumbLabels,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      onPointerDown: onRootPointerDown,
      onPointerMove: onRootPointerMove,
      ...props
    },
    ref,
  ) => {
    const field = useFieldGroupState();
    const labelling = useFieldGroup({ "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy });
    const disabled = disabledProp ?? field.disabled;
    const auto = React.useId();
    const controlRef = React.useRef<HTMLDivElement>(null);
    const thumbRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const boxRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    // 손을 대는 동안의 값 — 렌더한 값(제어 값)으로 맞춰 두고, 이벤트가 바꾼 값은 다음 렌더 전까지 여기에 둔다
    const latest = React.useRef(values);
    React.useLayoutEffect(() => {
      latest.current = values;
    });
    const interaction = React.useRef<Interaction | null>(null);
    const [dragging, setDragging] = React.useState<number | null>(null);
    const [hovered, setHovered] = React.useState<number | null>(null);
    const [keyboard, setKeyboard] = React.useState<number | null>(null);
    React.useEffect(trackInput, []);
    const [top, setTop] = React.useState(values.length - 1);

    const span = max - min;
    const precision = Math.max(decimalsOf(step), decimalsOf(min));
    const intervals = span / step;
    const discrete = Number.isInteger(Math.round(intervals * 1e9) / 1e9) && intervals >= 2 && intervals <= 5;
    const stepCount = Math.round(intervals);
    const ratio = (v: number) => (span > 0 ? (clamp(v, min, max) - min) / span : 0);
    const snap = (v: number) => {
      const k = Math.round((v - min) / step);
      return clamp(Number((min + k * step).toFixed(precision)), min, max);
    };

    const isRtl = () => (dirProp ?? (controlRef.current ? getComputedStyle(controlRef.current).direction : "ltr")) === "rtl";

    // 손잡이 줄의 시작 쪽(LTR 왼쪽 · RTL 오른쪽)에서 잰 포인터 자리
    const logicalX = (clientX: number) => {
      const el = controlRef.current;
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return isRtl() ? r.right - clientX : clientX - r.left;
    };
    const valueAt = (x: number) => {
      const w = controlRef.current?.getBoundingClientRect().width ?? 0;
      const p = w > INSET * 2 ? clamp((x - INSET) / (w - INSET * 2), 0, 1) : 0;
      return snap(min + p * span);
    };
    const centerOf = (v: number) => {
      const w = controlRef.current?.getBoundingClientRect().width ?? 0;
      return INSET + ratio(v) * Math.max(0, w - INSET * 2);
    };

    // 한 손잡이를 옮긴 값들 — 두 손잡이는 서로를 넘지 않는다
    const withValue = (index: number, v: number) => {
      const cur = latest.current;
      const lo = index > 0 ? (cur[index - 1] ?? min) : min;
      const hi = index < cur.length - 1 ? (cur[index + 1] ?? max) : max;
      const next = [...cur];
      next[index] = clamp(snap(v), lo, hi);
      return next;
    };
    const same = (a: readonly number[], b: readonly number[]) => a.length === b.length && a.every((v, i) => v === b[i]);
    const emit = (next: number[]) => {
      if (same(next, latest.current)) return false;
      latest.current = next;
      onValuesChange(next);
      return true;
    };

    // 누른 자리에서 가장 가까운 손잡이(같은 거리면 앞 손잡이) — 두 손잡이가 겹쳐 있으면 정하지 않는다(-1, 첫 움직임의 방향으로)
    const closest = (v: number) => {
      const cur = latest.current;
      if (cur.length === 1) return 0;
      const [a = min, b = max] = cur;
      if (a === b) return v < a ? 0 : v > b ? 1 : -1;
      return Math.abs(v - a) <= Math.abs(v - b) ? 0 : 1;
    };

    const focusThumb = (index: number) => thumbRefs.current[index]?.focus({ preventScroll: true });

    const startDrag = (it: Interaction) => {
      it.dragging = true;
      window.clearTimeout(it.timer);
      setDragging(it.index);
    };

    const end = (e: React.PointerEvent<HTMLDivElement>) => {
      const it = interaction.current;
      if (!it || e.pointerId !== it.pointerId) return;
      window.clearTimeout(it.timer);
      interaction.current = null;
      setDragging(null);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      // 손을 뗄 때 한 번 — 값이 바뀌었을 때만
      if (!same(latest.current, it.startValues)) onValuesCommit(latest.current);
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      onRootPointerDown?.(e);
      if (disabled || e.defaultPrevented || e.button !== 0 || interaction.current) return;
      // 손잡이 줄 밖으로 나가도 끌기가 이어지게 포인터를 잡는다(이미 끝난 포인터면 잡지 못한다 — 그대로 둔다)
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* 잡지 못해도 끌기는 손잡이 줄 안에서 이어진다 */
      }
      // 마우스 호환 이벤트를 막는다 — 글 고르기 · 초점 옮김 없이 손잡이에 초점을 직접 둔다
      e.preventDefault();
      const x = logicalX(e.clientX);
      const thumb = (e.target as Element).closest<HTMLElement>('[data-slot="slider-thumb"]');
      const startValues = latest.current;
      if (thumb && controlRef.current?.contains(thumb)) {
        // 손잡이를 누르면 바로 끈다 — 잡은 자리를 그대로 둔다. 두 손잡이가 겹쳐 있으면 어느 쪽인지 첫 움직임의 방향으로 정한다
        // (위에 그려진 손잡이가 움직일 수 없는 쪽이어도 끌린다)
        const pressed = Number(thumb.dataset.index);
        const coincide = startValues.length > 1 && startValues[0] === startValues[1];
        const it: Interaction = {
          pointerId: e.pointerId,
          index: coincide ? -1 : pressed,
          offset: x - centerOf(startValues[pressed] ?? min),
          downX: x,
          startValues,
          dragging: true,
          timer: undefined,
        };
        interaction.current = it;
        setTop(pressed);
        setDragging(pressed);
        focusThumb(pressed);
        return;
      }
      // 손잡이 밖 — 가장 가까운 손잡이가 그 자리로 건너뛴다(전환 150ms). 그대로 누르고 있거나 움직이면 끌기
      const v = valueAt(x);
      const index = closest(v);
      const it: Interaction = { pointerId: e.pointerId, index, offset: 0, downX: x, startValues, dragging: false, timer: undefined };
      interaction.current = it;
      if (index >= 0) {
        setTop(index);
        emit(withValue(index, v));
        focusThumb(index);
        it.timer = window.setTimeout(() => {
          if (interaction.current === it && !it.dragging) startDrag(it);
        }, HOLD_MS);
      }
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      onRootPointerMove?.(e);
      const it = interaction.current;
      if (!it || e.pointerId !== it.pointerId) return;
      const x = logicalX(e.clientX);
      // 짧은 떨림은 끌기가 아니다 — 겹친 두 손잡이는 방향이 뚜렷해질 때까지 기다린다
      if ((!it.dragging || it.index < 0) && Math.abs(x - it.downX) < MOVE_PX) return;
      if (it.index < 0) {
        // 겹친 두 손잡이 — 시작 쪽으로 끌면 앞 손잡이, 끝 쪽이면 뒤 손잡이
        it.index = x < it.downX ? 0 : 1;
        setTop(it.index);
        setDragging(it.index);
        focusThumb(it.index);
      }
      if (!it.dragging) startDrag(it);
      emit(withValue(it.index, valueAt(x - it.offset)));
    };

    const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;
      const cur = latest.current;
      const v = cur[index] ?? min;
      const rtl = isRtl();
      const big = step * 10;
      let next: number | null = null;
      switch (e.key) {
        case "ArrowRight":
          next = v + (rtl ? -1 : 1) * (e.shiftKey ? big : step);
          break;
        case "ArrowLeft":
          next = v + (rtl ? 1 : -1) * (e.shiftKey ? big : step);
          break;
        case "ArrowUp":
          next = v + (e.shiftKey ? big : step);
          break;
        case "ArrowDown":
          next = v - (e.shiftKey ? big : step);
          break;
        case "PageUp":
          next = v + big;
          break;
        case "PageDown":
          next = v - big;
          break;
        case "Home":
          next = index > 0 ? (cur[index - 1] ?? min) : min;
          break;
        case "End":
          next = index < cur.length - 1 ? (cur[index + 1] ?? max) : max;
          break;
        default:
          return;
      }
      e.preventDefault();
      setKeyboard(index);
      setTop(index);
      const values2 = withValue(index, next);
      // 키마다 한 번 — 값이 바뀌었을 때만
      if (emit(values2)) onValuesCommit(values2);
    };

    // 말풍선 상자 — 손잡이가 트랙 끝에 가면 상자만 안으로 민다(화살표는 손잡이 가운데 그대로). 그릴 때마다, 손잡이 줄 폭이 바뀔 때마다
    const placeBoxes = React.useRef<() => void>(() => undefined);
    React.useLayoutEffect(() => {
      const place = () => {
        const control = controlRef.current;
        if (!control) return;
        const w = control.getBoundingClientRect().width;
        const rtl = (dirProp ?? getComputedStyle(control).direction) === "rtl";
        boxRefs.current.forEach((box, i) => {
          if (!box) return;
          const v = latest.current[i] ?? min;
          const c = INSET + (span > 0 ? (clamp(v, min, max) - min) / span : 0) * Math.max(0, w - INSET * 2);
          const center = rtl ? w - c : c;
          const bw = box.offsetWidth;
          const left = center - bw / 2;
          const shift = clamp(left, 0, Math.max(0, w - bw)) - left;
          box.style.translate = `calc(-50% + ${shift}px) 0`;
        });
      };
      placeBoxes.current = place;
      place();
    });
    React.useLayoutEffect(() => {
      const control = controlRef.current;
      if (!control || typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(() => placeBoxes.current());
      ro.observe(control);
      return () => ro.disconnect();
    }, []);

    React.useEffect(() => () => window.clearTimeout(interaction.current?.timer), []);

    const range = values.length > 1;
    const p0 = ratio(values[0] ?? min);
    const p1 = range ? ratio(values[1] ?? max) : p0;
    const fillStyle: React.CSSProperties = range
      ? { insetInlineStart: at(p0), width: `calc((100% - ${INSET * 2}px) * ${p1 - p0})` }
      : { insetInlineStart: 0, width: at(p0) };
    const mask = discrete ? tickMask(stepCount) : undefined;
    const markers = discrete
      ? Array.from({ length: stepCount + 1 }, (_, k) => Number((min + k * step).toFixed(precision)))
      : [min, max];
    const thumbLabelId = (i: number) => `${auto}thumb${i}`;
    const name0 = labelling["aria-labelledby"];

    return (
      <div
        ref={ref}
        data-slot="slider"
        data-disabled={disabled || undefined}
        data-dragging={dragging != null || undefined}
        data-ticks={discrete ? "discrete" : "none"}
        dir={dirProp}
        className={cn("relative flex w-full min-w-0 select-none flex-col gap-x0_5 pt-x6 font-sans", className)}
        {...props}
      >
        <div
          ref={controlRef}
          data-slot="slider-control"
          className={cn(
            "relative h-11 w-full touch-none",
            disabled ? "cursor-not-allowed" : dragging != null ? "cursor-grabbing" : "cursor-pointer",
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={end}
          onPointerCancel={end}
          onLostPointerCapture={end}
        >
          <div
            data-slot="slider-track"
            className={cn(
              "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full",
              disabled ? "bg-bg-disabled" : "bg-stroke-neutral-weak",
            )}
            style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
          >
            <div
              data-slot="slider-fill"
              className={cn(
                "absolute inset-y-0",
                disabled ? "bg-fg-disabled" : "bg-fg-neutral",
                dragging == null &&
                  "[transition:inset-inline-start_var(--motion-duration-d3)_var(--motion-ease-easing),width_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:transition-none",
              )}
              style={fillStyle}
            />
          </div>
          {values.map((v, i) => {
            const shown = !disabled && (dragging === i || hovered === i || keyboard === i);
            const thumbName = range ? (thumbLabels?.[i] ?? (i === 0 ? "최소" : "최대")) : null;
            const nameProps: React.AriaAttributes =
              thumbName == null
                ? name0 != null
                  ? { "aria-labelledby": name0 }
                  : { "aria-label": labelling["aria-label"] }
                : name0 != null
                  ? { "aria-labelledby": `${name0} ${thumbLabelId(i)}` }
                  : { "aria-label": labelling["aria-label"] ? `${labelling["aria-label"]} ${thumbName}` : thumbName };
            return (
              <span
                key={i}
                data-slot="slider-thumb-anchor"
                className={cn(
                  "absolute inset-y-0 w-0",
                  top === i && "z-[1]",
                  dragging == null &&
                    "[transition:inset-inline-start_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:transition-none",
                )}
                style={{ insetInlineStart: at(ratio(v)) }}
              >
                <span
                  ref={(node) => {
                    thumbRefs.current[i] = node;
                  }}
                  role="slider"
                  data-slot="slider-thumb"
                  data-index={i}
                  data-pressed={dragging === i || undefined}
                  data-focus-visible={keyboard === i || undefined}
                  tabIndex={disabled ? undefined : 0}
                  aria-orientation="horizontal"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={v}
                  aria-valuetext={formatValue(v)}
                  aria-disabled={disabled || undefined}
                  aria-invalid={field.invalid || undefined}
                  aria-describedby={labelling["aria-describedby"]}
                  {...nameProps}
                  className={cn(
                    "absolute left-0 top-1/2 block size-5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                    disabled ? "cursor-not-allowed bg-fg-disabled" : dragging === i ? "cursor-grabbing bg-bg-neutral-inverted" : "cursor-grab bg-bg-neutral-inverted",
                    "[transition:scale_var(--motion-duration-d3)_var(--motion-ease-easing)] motion-reduce:transition-none data-[pressed]:[scale:1.2]",
                    // 키보드 포커스에만 링 — :focus-visible 이 아니라 키보드로 왔을 때(위 trackInput)
                    "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-solid data-[focus-visible]:outline-stroke-focus-ring",
                  )}
                  onKeyDown={onKeyDown(i)}
                  onFocus={() => {
                    if (lastInput === "keyboard") setKeyboard(i);
                  }}
                  onBlur={() => setKeyboard((k) => (k === i ? null : k))}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setHovered(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setHovered((h) => (h === i ? null : h));
                  }}
                />
                {thumbName != null && name0 != null && (
                  <span id={thumbLabelId(i)} hidden>
                    {thumbName}
                  </span>
                )}
                {/* 말풍선 — 상자 아래 끝이 손잡이 위 12, 아래 8 × 6 화살표가 손잡이 가운데를 가리킨다 */}
                <span
                  aria-hidden
                  data-slot="slider-value-indicator"
                  data-state={shown ? "open" : "closed"}
                  className={cn(
                    "pointer-events-none absolute left-0 top-0 size-0",
                    shown
                      ? "opacity-100 [scale:1] [translate:0_0] [transition:opacity_var(--motion-duration-d4)_var(--motion-ease-enter),translate_var(--motion-duration-d4)_var(--motion-ease-enter),scale_var(--motion-duration-d4)_var(--motion-ease-enter)]"
                      : "opacity-0 [scale:0.9] [translate:0_5px] [transition:opacity_var(--motion-duration-d4)_var(--motion-ease-easing),translate_var(--motion-duration-d4)_var(--motion-ease-easing),scale_0s_linear_var(--motion-duration-d4)]",
                    "motion-reduce:[scale:1] motion-reduce:[translate:0_0] motion-reduce:[transition-property:opacity]",
                  )}
                >
                  <span
                    ref={(node) => {
                      boxRefs.current[i] = node;
                    }}
                    data-slot="slider-value-indicator-box"
                    className="absolute bottom-0 left-0 block min-w-6 whitespace-nowrap rounded-r1_5 bg-bg-neutral-inverted px-x2 py-x1 text-center text-t3 font-medium tabular-nums text-fg-neutral-inverted"
                  >
                    {formatValue(v)}
                  </span>
                  <svg
                    data-slot="slider-value-indicator-arrow"
                    width="8"
                    height="6"
                    viewBox="0 0 8 6"
                    className="absolute left-0 top-0 block -translate-x-1/2 fill-bg-neutral-inverted"
                  >
                    <path d={ARROW_PATH} />
                  </svg>
                </span>
              </span>
            );
          })}
        </div>
        {/* 표식 — 양 끝 값(구간 2 ~ 5 면 단계마다). 끝 둘은 트랙 끝에 맞추고 가운데는 단계 자리 가운데 */}
        <div
          aria-hidden
          data-slot="slider-markers"
          className={cn("relative h-[var(--text-t3--line-height)] text-t3", disabled ? "text-fg-disabled" : "text-fg-neutral-muted")}
        >
          {markers.map((m, k) => {
            const last = k === markers.length - 1;
            return (
              <span
                key={k}
                data-slot="slider-marker"
                className={cn("absolute top-0 whitespace-nowrap", k > 0 && !last && "-translate-x-1/2 rtl:translate-x-1/2")}
                style={k === 0 ? { insetInlineStart: 0 } : last ? { insetInlineEnd: 0 } : { insetInlineStart: at(k / stepCount) }}
              >
                {formatValue(m)}
              </span>
            );
          })}
        </div>
        {name != null && values.map((v, i) => <input key={i} type="hidden" name={name} value={String(v)} disabled={disabled} />)}
      </div>
    );
  },
);
SliderCore.displayName = "SliderCore";

// 제어 · 비제어 — 값이 주어지면 그대로, 아니면 안에서 든다
function useValues<T>(value: T | undefined, defaultValue: T) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  return [controlled ? value : inner, (next: T) => !controlled && setInner(next)] as const;
}

type SliderShared = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> & {
  /** 최솟값(기본 0) */
  min?: number;
  /** 최댓값(기본 100) */
  max?: number;
  /** 단계(기본 1) — 구간((max − min) ÷ step)이 2 ~ 5개면 눈금 · 단계 표식 */
  step?: number;
  /** 단위를 붙인 글("80%") — aria-valuetext · 말풍선 · 표식. 기본은 숫자 그대로 */
  formatValue?: (value: number) => string;
  /** 막힘 — 전용 색, Tab 순서에서 빠진다. Field 의 disabled 도 받는다 */
  disabled?: boolean;
  /** 폼으로 보낼 이름 — 숨은 입력(범위는 같은 이름으로 둘) */
  name?: string;
  /** 쓰는 방향 — 주지 않으면 놓인 자리의 방향 */
  dir?: Dir;
};

export type SliderProps = SliderShared & {
  value?: number;
  defaultValue?: number;
  /** 움직일 때마다 — 화면만 바꾼다 */
  onValueChange?: (value: number) => void;
  /** 손을 뗄 때 · 키마다 한 번(값이 바뀌었을 때만) — 바로 적용하는 저장은 여기서 */
  onValueCommit?: (value: number) => void;
};

const defaultFormat = (v: number) => String(v);

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, defaultValue, onValueChange, onValueCommit, min = 0, max = 100, step = 1, formatValue = defaultFormat, ...props }, ref) => {
    const [current, setCurrent] = useValues(value, defaultValue ?? min);
    return (
      <SliderCore
        ref={ref}
        values={[current]}
        onValuesChange={(next) => {
          const v = next[0] ?? min;
          setCurrent(v);
          onValueChange?.(v);
        }}
        onValuesCommit={(next) => onValueCommit?.(next[0] ?? min)}
        min={min}
        max={max}
        step={step}
        formatValue={formatValue}
        {...props}
      />
    );
  },
);
Slider.displayName = "Slider";

export type RangeSliderProps = SliderShared & {
  /** [최소, 최대] */
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
  /** 손잡이마다 이름 — "{라벨} {이름}", 기본 ["최소", "최대"]("시작" · "끝" 처럼 바꿀 수 있다) */
  thumbLabels?: [string, string];
};

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    { value, defaultValue, onValueChange, onValueCommit, min = 0, max = 100, step = 1, formatValue = defaultFormat, thumbLabels = ["최소", "최대"], ...props },
    ref,
  ) => {
    const [current, setCurrent] = useValues<[number, number]>(value, defaultValue ?? [min, max]);
    const pair = (next: number[]): [number, number] => [next[0] ?? min, next[1] ?? max];
    return (
      <SliderCore
        ref={ref}
        values={current}
        onValuesChange={(next) => {
          const v = pair(next);
          setCurrent(v);
          onValueChange?.(v);
        }}
        onValuesCommit={(next) => onValueCommit?.(pair(next))}
        min={min}
        max={max}
        step={step}
        formatValue={formatValue}
        thumbLabels={thumbLabels}
        {...props}
      />
    );
  },
);
RangeSlider.displayName = "RangeSlider";

export interface SliderValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 막힘 — Field 의 disabled 를 받는다. 슬라이더에만 disabled 를 줬으면 여기에도 준다 */
  disabled?: boolean;
}

// 머리 값 — Field 머리 오른쪽(headerAction). 16 / 22 · 700 · 고정폭 숫자, 보조 기술에는 숨긴다
const SliderValue = React.forwardRef<HTMLSpanElement, SliderValueProps>(({ disabled, className, ...props }, ref) => {
  const field = useFieldGroupState();
  const off = disabled ?? field.disabled;
  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="slider-value"
      data-disabled={off || undefined}
      className={cn("whitespace-nowrap font-sans text-t5 font-bold tabular-nums", off ? "text-fg-disabled" : "text-fg-neutral", className)}
      {...props}
    />
  );
});
SliderValue.displayName = "SliderValue";

export { Slider, RangeSlider, SliderValue };
