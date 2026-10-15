import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Porest Field — 구조는 SEED Field(2026-10-01). 수치 원본은 specs/components/field.yaml.
 *
 *   Field            머리(라벨 · 필수 점 또는 "선택" · 보조 액션) · 입력 · 꼬리(설명 또는 오류 · 글자 수). 사이 8
 *   useFieldControl  입력(Input · Textarea)이 Field 의 id · 설명 · 오류 · 필수 · 막힘을 받는다
 *   useFieldGroup    묶음(Checkbox · Radio · Select Box)이 Field 의 라벨을 이름으로, 설명 · 오류를 설명으로 받는다
 *   useFieldGroupState  Checkbox · Radio 묶음이 Field 의 막힘 · 오류 · 필수(· 읽기 전용 — Quantity Picker · Attachment Input)를 받는다 —
 *                    묶음은 aria-disabled 와 칸마다 disabled,
 *                    radiogroup 은 aria-invalid · aria-required, 체크박스 묶음(role=group)은 오류를 칸마다 aria-invalid 로 건다
 *                    (role=group 은 aria-invalid · aria-required 를 받지 않는다 — SEED useFieldset 과 같다, 2026-10-08)
 *   submitImplicitly Checkbox · Radio 의 Enter — 진짜 input 처럼 폼의 기본 버튼을 누른다(2026-10-08)
 *   useTextControl   입력 · 여러 줄 입력의 글자 수 — 자소 단위로 세고 최대에서 자른다(한글 조합이 끝난 뒤)
 *
 * 라벨은 칸과 잇는다 — 입력이면 <label for>, 묶음이면 묶음의 aria-labelledby(라벨은 <span>).
 * 칸이 버튼(Input Button · Select 의 트리거)이면 라벨을 눌러도 포커스만 옮긴다 — 누르지 않는다(시트 · 목록을 열지 않는다, SEED).
 * 필수 점은 화면 읽기 프로그램에 숨기고 필수는 칸의 aria-required 가 알린다 — required 속성은 쓰지 않는다
 * (브라우저 기본 말풍선이 오류 글 대신 뜨지 않게). 필수 점 · "선택" 은 한 화면에서 섞지 않는다(2/3 규칙 — field.md).
 * 오류 글(invalid + errorMessage)은 설명 자리를 대신하고 칸의 aria-describedby 로 이어진다. 바뀔 때는 화면 밖의
 * polite 알림 자리가 한 번 읽는다 — 보이는 오류 글은 그 자리와 두 번 읽히지 않게 aria-hidden(설명으로는 그대로 읽힌다).
 * 글자 수(maxGraphemeCount)는 최대가 있는 칸에만 — 국기 이모지도 한 글자다. 입력은 최대에서 멈춘다.
 */

// ── 자소(grapheme) ────────────────────────────────────────────
const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter("ko", { granularity: "grapheme" }) : null;

function graphemesOf(value: string): string[] {
  return segmenter ? Array.from(segmenter.segment(value), (s) => s.segment) : Array.from(value);
}

export function countGraphemes(value: string) {
  return graphemesOf(value).length;
}

export function sliceGraphemes(value: string, max: number) {
  const all = graphemesOf(value);
  return all.length > max ? all.slice(0, max).join("") : value;
}

// 값을 바꾸고 input 이벤트를 보낸다 — 제어 · 비제어 · react-hook-form 모두 onChange 로 새 값을 받는다
export function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

// ── Field 문맥 ────────────────────────────────────────────────
type FieldContextValue = {
  controlId: string;
  labelId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  maxGraphemeCount: number | undefined;
  setGraphemeCount: (count: number) => void;
  setControlId: (id: string | undefined) => void;
  setGroup: (group: boolean) => void;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useField() {
  return React.useContext(FieldContext);
}

const join = (...ids: (string | undefined | false | null)[]) => ids.filter(Boolean).join(" ") || undefined;

type ControlProps = {
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
  "aria-describedby"?: string;
};

// 입력이 Field 안에 있으면 Field 의 값을 받는다. 입력에 직접 준 값이 이긴다(id 를 주면 라벨도 그 id 로 간다)
export function useFieldControl(props: ControlProps) {
  const field = useField();
  const setControlId = field?.setControlId;
  useIsoLayoutEffect(() => {
    if (!setControlId || !props.id) return;
    setControlId(props.id);
    return () => setControlId(undefined);
  }, [setControlId, props.id]);
  if (!field) return props;
  return {
    id: props.id ?? field.controlId,
    disabled: props.disabled ?? (field.disabled || undefined),
    readOnly: props.readOnly ?? (field.readOnly || undefined),
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
    "aria-required": props["aria-required"] ?? (field.required || undefined),
    "aria-describedby": join(field.describedBy, props["aria-describedby"]),
  };
}

// 묶음이 Field 안에 있으면 라벨을 이름으로, 설명 · 오류 · 글자 수를 설명으로 잇는다. 묶음에 직접 준 값이 이긴다
export function useFieldGroup<P extends { "aria-label"?: string; "aria-labelledby"?: string; "aria-describedby"?: string }>(props: P) {
  const field = useField();
  const setGroup = field?.setGroup;
  useIsoLayoutEffect(() => {
    if (!setGroup) return;
    setGroup(true);
    return () => setGroup(false);
  }, [setGroup]);
  if (!field) return props;
  return {
    ...props,
    "aria-labelledby": props["aria-labelledby"] ?? (props["aria-label"] ? undefined : field.labelId),
    "aria-describedby": join(field.describedBy, props["aria-describedby"]),
  };
}

// Field 의 막힘 · 오류 · 필수 · 읽기 전용 — Checkbox · Radio 묶음이 칸에 나눠 건다(useFieldGroupState 를 쓰는 자리마다 다르다 — 머리 주석).
// Quantity Picker · Attachment Input 은 읽기 전용도 받는다. Field 밖이면 모두 false. 묶음에 직접 준 값이 이기게 하는 것은 묶음이 한다
export function useFieldGroupState() {
  const field = useField();
  return {
    disabled: field?.disabled ?? false,
    invalid: field?.invalid ?? false,
    required: field?.required ?? false,
    readOnly: field?.readOnly ?? false,
  };
}

// Checkbox · Radio 의 Enter — 진짜 input 처럼 폼의 기본 버튼(첫 제출 버튼)을 누른다(암묵 제출). 기본 버튼이 없거나 막혀 있으면
// 아무것도 하지 않는다(크로미움의 진짜 input 과 같다). 버튼을 누르므로 그 버튼의 onClick(Button 의 누름 잠금 · 로딩)을 그대로 거친다
export function submitImplicitly(control: { form: HTMLFormElement | null }) {
  const submit = Array.from(control.form?.elements ?? []).find(
    (el): el is HTMLButtonElement | HTMLInputElement =>
      (el instanceof HTMLButtonElement && el.type === "submit") || (el instanceof HTMLInputElement && (el.type === "submit" || el.type === "image")),
  );
  if (submit && !submit.disabled) submit.click();
}

// 입력 · 여러 줄 입력이 함께 쓴다 — 값이 있는지(지우기 버튼) · 글자 수(Field)를 알리고, 최대에서 자른다.
// 한글을 조합하는 동안에는 자르지 않는다(조합이 깨진다) — 조합이 끝나면 자르고 onChange 로 새 값을 보낸다
export function useTextControl<E extends HTMLInputElement | HTMLTextAreaElement>(
  ref: React.RefObject<E | null>,
  handlers: { onChange?: React.ChangeEventHandler<E>; onCompositionEnd?: React.CompositionEventHandler<E> },
) {
  const field = useField();
  const max = field?.maxGraphemeCount;
  const setCount = field?.setGraphemeCount;
  const [hasValue, setHasValue] = React.useState(false);
  const sync = React.useCallback(
    (value: string) => {
      setHasValue(value !== "");
      setCount?.(countGraphemes(value));
    },
    [setCount],
  );
  // 값이 밖에서 바뀌어도(제어 값 · reset) 그린 뒤 다시 센다
  useIsoLayoutEffect(() => {
    if (ref.current) sync(ref.current.value);
  });
  const onChange = (e: React.ChangeEvent<E>) => {
    const el = e.currentTarget;
    if (max != null && !(e.nativeEvent as InputEvent).isComposing) {
      const sliced = sliceGraphemes(el.value, max);
      if (sliced !== el.value) el.value = sliced;
    }
    sync(el.value);
    handlers.onChange?.(e);
  };
  const onCompositionEnd = (e: React.CompositionEvent<E>) => {
    const el = e.currentTarget;
    if (max != null) {
      const sliced = sliceGraphemes(el.value, max);
      if (sliced !== el.value) setNativeValue(el, sliced);
    }
    handlers.onCompositionEnd?.(e);
  };
  return { hasValue, onChange, onCompositionEnd };
}

// ── Field ─────────────────────────────────────────────────────
export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "children"> {
  /** 칸 이름 — 명사형 · 마침표 없이 */
  label?: React.ReactNode;
  /** 라벨 굵기 — medium 500(기본) · bold 700 */
  labelWeight?: "medium" | "bold";
  /** 필수 — 칸의 aria-required. 점은 showRequiredIndicator 로 따로 켠다(2/3 규칙) */
  required?: boolean;
  /** 필수 점 — 한 화면 칸의 2/3 미만이 필수일 때 필수 칸에만. 켜면 필수(required)로 본다 */
  showRequiredIndicator?: boolean;
  /** 라벨 뒤 글 — 2/3 이상이 필수인 화면의 선택 칸에 "선택" */
  indicator?: React.ReactNode;
  /** 라벨 오른쪽 보조 액션 — Button ghost · neutralSubtle · xsmall · flush="right" */
  headerAction?: React.ReactNode;
  /** 설명 — 오류가 있으면 오류가 대신한다 */
  description?: React.ReactNode;
  /** 설명 앞 아이콘(16) */
  descriptionIcon?: React.ReactNode;
  /** 오류 글 — invalid 일 때 설명 자리에. 행동 지시형으로 짧게 */
  errorMessage?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** 최대 글자 수(자소 단위) — 있으면 꼬리 오른쪽에 "n/최대" 를 보이고 입력은 최대에서 멈춘다 */
  maxGraphemeCount?: number;
  /** 입력의 id — 라벨이 이 id 로 간다(없으면 만든다) */
  id?: string;
  children: React.ReactNode;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      labelWeight = "medium",
      required = false,
      showRequiredIndicator = false,
      indicator,
      headerAction,
      description,
      descriptionIcon,
      errorMessage,
      invalid = false,
      disabled = false,
      readOnly = false,
      maxGraphemeCount,
      id,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const auto = React.useId();
    const [controlIdOverride, setControlId] = React.useState<string>();
    const [group, setGroup] = React.useState(false);
    const [count, setGraphemeCount] = React.useState(0);
    const controlId = id ?? controlIdOverride ?? `${auto}control`;
    const labelId = `${auto}label`;
    const descriptionId = `${auto}description`;
    const errorId = `${auto}error`;
    const countId = `${auto}count`;
    const isRequired = required || showRequiredIndicator;
    const showError = invalid && errorMessage != null && errorMessage !== false && errorMessage !== "";
    const showDescription = !showError && description != null && description !== false && description !== "";
    const showCount = maxGraphemeCount != null;
    const describedBy = join(showError && errorId, showDescription && descriptionId, showCount && countId);

    const value = React.useMemo<FieldContextValue>(
      () => ({
        controlId,
        labelId,
        describedBy,
        invalid,
        required: isRequired,
        disabled,
        readOnly,
        maxGraphemeCount,
        setGraphemeCount,
        setControlId,
        setGroup,
      }),
      [controlId, labelId, describedBy, invalid, isRequired, disabled, readOnly, maxGraphemeCount],
    );

    const labelClass = cn("min-w-0 font-sans text-t5 text-fg-neutral", labelWeight === "bold" ? "font-bold" : "font-medium");
    // 칸이 버튼이면 라벨의 기본 동작(칸을 누르기)을 막고 포커스만 옮긴다 — 입력칸은 그대로(포커스 · 커서)
    const onLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
      const control = e.currentTarget.ownerDocument.getElementById(controlId);
      if (control?.tagName !== "BUTTON") return;
      e.preventDefault();
      control.focus();
    };
    const labelContent = (
      <>
        {label}
        {showRequiredIndicator && <span aria-hidden className="ml-[0.125rem] mt-[0.25rem] inline-block size-[0.375rem] rounded-full bg-fg-critical align-top" />}
        {!showRequiredIndicator && indicator != null && (
          <span className="pl-[0.25rem] align-bottom text-t4 font-normal leading-[var(--text-t5--line-height)] text-fg-neutral-subtle">{indicator}</span>
        )}
      </>
    );

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="field"
          data-invalid={invalid || undefined}
          data-disabled={disabled || undefined}
          className={cn("flex w-full min-w-0 flex-col gap-x2", className)}
          {...props}
        >
          {(label != null || headerAction != null) && (
            <div data-slot="field-header" className="flex items-center justify-between gap-x2_5 px-x0_5">
              {label != null &&
                (group ? (
                  <span id={labelId} className={labelClass}>
                    {labelContent}
                  </span>
                ) : (
                  <label id={labelId} htmlFor={controlId} className={labelClass} onClick={onLabelClick}>
                    {labelContent}
                  </label>
                ))}
              {headerAction != null && (
                <div data-slot="field-header-action" className="-my-[5px] ml-auto flex shrink-0 items-center">
                  {headerAction}
                </div>
              )}
            </div>
          )}
          {children}
          {(showError || showDescription || showCount) && (
            <div data-slot="field-footer" className="flex items-start gap-x2 px-x0_5 font-sans">
              {showError && (
                <p id={errorId} aria-hidden className="m-0 flex min-w-0 text-t4 text-fg-critical">
                  <CircleAlert aria-hidden className="mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] size-4 shrink-0" />
                  <span className="min-w-0">{errorMessage}</span>
                </p>
              )}
              {showDescription && (
                <p id={descriptionId} className="m-0 flex min-w-0 text-t4 text-fg-neutral-subtle">
                  {descriptionIcon != null && (
                    <span aria-hidden className="mr-x1_5 mt-[calc((var(--text-t4--line-height)_-_1rem)/2)] flex shrink-0 [&>svg]:size-4">
                      {descriptionIcon}
                    </span>
                  )}
                  <span className="min-w-0">{description}</span>
                </p>
              )}
              {showCount && (
                <p id={countId} className="m-0 ml-auto shrink-0 text-t4 tabular-nums">
                  <span className={invalid ? "text-fg-critical" : count === 0 ? "text-fg-neutral-subtle" : "text-fg-neutral"}>{count}</span>
                  <span className={invalid ? "text-fg-critical" : "text-fg-neutral-subtle"}>/{maxGraphemeCount}</span>
                </p>
              )}
            </div>
          )}
          <span className="sr-only" aria-live="polite">
            {showError ? errorMessage : null}
          </span>
        </div>
      </FieldContext.Provider>
    );
  },
);
Field.displayName = "Field";

export { Field };
