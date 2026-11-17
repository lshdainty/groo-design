'use client';
// Text Field 플레이그라운드 — Field · Input · Textarea 페이지마다 하나. 속성을 고르면 스펙대로 그린 칸과 그 코드가 바뀐다(실제로 쓸 수 있다).
import { useMemo, useState, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import type { TfIcon, TfLook, TfSizeProp, TfVariant } from './text-field-shared';
import { TfFieldView, TfInputView, TfTextareaView, type ViewMode } from './text-field-view';

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly (readonly [T, string])[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-fd-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(([v, t]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors ${
              v === value ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function Frame({ look, mode, stage, controls, code }: { look: TfLook; mode: ViewMode; stage: ReactNode; controls: ReactNode; code: string }) {
  const surface = mode === 'auto' ? 'var(--p-bg-layer-default)' : look.surface.default[mode];
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex min-h-[220px] items-center justify-center px-4 py-10" style={{ background: surface }}>
        <div className="w-full max-w-[360px]">{stage}</div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const MODES = [['auto', '사이트 따라'], ['light', '라이트'], ['dark', '다크']] as const;
const SIZES = [['responsive', '반응형(기본)'], ['large', 'large 52'], ['medium', 'medium 40']] as const;
const attr = (cond: boolean, s: string) => (cond ? [s] : []);

// ── Field ─────────────────────────────────────────────────
export function FieldPlayground({ look, action }: { look: TfLook; action: ButtonLook }) {
  const [weight, setWeight] = useState<'medium' | 'bold'>('medium');
  const [indicator, setIndicator] = useState<'none' | 'required' | 'optional'>('none');
  const [headerAction, setHeaderAction] = useState<'no' | 'yes'>('no');
  const [desc, setDesc] = useState<'no' | 'yes'>('yes');
  const [error, setError] = useState<'no' | 'yes'>('no');
  const [count, setCount] = useState<'no' | 'yes'>('yes');
  const [control, setControl] = useState<'input' | 'textarea'>('input');
  const [mode, setMode] = useState<ViewMode>('auto');

  const code = useMemo(() => {
    const a = [
      'label="카테고리 이름"',
      ...attr(weight === 'bold', 'labelWeight="bold"'),
      ...attr(indicator === 'required', 'showRequiredIndicator'),
      ...attr(indicator === 'optional', 'indicator="선택"'),
      ...attr(headerAction === 'yes', 'headerAction={<Button type="button" variant="ghost" ghostColor="neutralSubtle" size="xsmall">예시 보기</Button>}'),
      ...attr(desc === 'yes', 'description="목록과 통계에 이 이름으로 보여요."'),
      ...attr(count === 'yes', 'maxGraphemeCount={12}'),
      ...attr(error === 'yes', 'invalid errorMessage="이름은 12자 이내로 입력해주세요."'),
    ];
    const inner = control === 'input' ? '<Input placeholder="예: 반려동물, 부수입" />' : '<Textarea placeholder="예: 반려동물, 부수입" />';
    return `import { Field } from "@/components/ui/field"\nimport { ${control === 'input' ? 'Input' : 'Textarea'} } from "@/components/ui/${control}"\n\n<Field\n  ${a.join('\n  ')}\n>\n  ${inner}\n</Field>`;
  }, [weight, indicator, headerAction, desc, count, error, control]);

  return (
    <Frame
      look={look}
      mode={mode}
      code={code}
      stage={
        <TfFieldView
          key={control}
          look={look.field}
          mode={mode}
          label="카테고리 이름"
          labelWeight={weight}
          indicator={indicator === 'none' ? undefined : indicator}
          headerAction={headerAction === 'yes' ? <ButtonView look={action} mode={mode} label="예시 보기" /> : undefined}
          description={desc === 'yes' ? '목록과 통계에 이 이름으로 보여요.' : undefined}
          errorMessage="이름은 12자 이내로 입력해주세요."
          invalid={error === 'yes'}
          max={count === 'yes' ? 12 : undefined}
        >
          {(ctl) =>
            control === 'input' ? (
              <TfInputView look={look.input} mode={mode} id={ctl.id} describedBy={ctl.describedBy} invalid={ctl.invalid} onCount={ctl.onCount} maxGraphemes={count === 'yes' ? 12 : undefined} defaultValue="반려동물" placeholder="예: 반려동물, 부수입" clearable />
            ) : (
              <TfTextareaView look={look.textarea} input={look.input} mode={mode} id={ctl.id} describedBy={ctl.describedBy} invalid={ctl.invalid} onCount={ctl.onCount} maxGraphemes={count === 'yes' ? 12 : undefined} defaultValue="반려동물" placeholder="예: 반려동물, 부수입" />
            )
          }
        </TfFieldView>
      }
      controls={
        <>
          <Seg label="라벨 굵기 labelWeight" value={weight} options={[['medium', 'medium 500'], ['bold', 'bold 700']] as const} onChange={setWeight} />
          <Seg label="필수 · 선택 표시" value={indicator} options={[['none', '없음'], ['required', '필수 점'], ['optional', '"선택"']] as const} onChange={setIndicator} />
          <Seg label="보조 액션 headerAction" value={headerAction} options={[['no', '없음'], ['yes', '예시 보기']] as const} onChange={setHeaderAction} />
          <Seg label="설명 description" value={desc} options={[['no', '없음'], ['yes', '있음']] as const} onChange={setDesc} />
          <Seg label="오류 invalid" value={error} options={[['no', '아니요'], ['yes', '오류']] as const} onChange={setError} />
          <Seg label="글자 수 maxGraphemeCount" value={count} options={[['no', '없음'], ['yes', '12']] as const} onChange={setCount} />
          <Seg label="입력" value={control} options={[['input', 'Input'], ['textarea', 'Textarea']] as const} onChange={setControl} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
    />
  );
}

// ── Input ─────────────────────────────────────────────────
export function InputPlayground({ look }: { look: TfLook }) {
  const [variant, setVariant] = useState<TfVariant>('outline');
  const [size, setSize] = useState<TfSizeProp>('responsive');
  const [state, setState] = useState<'enabled' | 'invalid' | 'disabled' | 'readonly'>('enabled');
  const [prefix, setPrefix] = useState<'none' | 'icon' | 'text'>('none');
  const [suffix, setSuffix] = useState<'none' | 'text'>('text');
  const [clear, setClear] = useState<'no' | 'yes'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');

  const icon: TfIcon | undefined = prefix === 'icon' ? 'search' : undefined;
  const code = useMemo(() => {
    const field = [`label="금액"`, ...attr(state === 'invalid', 'invalid errorMessage="금액을 입력해주세요."'), ...attr(state === 'disabled', 'disabled'), ...attr(state === 'readonly', 'readOnly')];
    const input = [
      ...attr(variant === 'underline', 'variant="underline"'),
      ...attr(size !== 'responsive', `size="${size}"`),
      'inputMode="numeric"',
      ...attr(prefix === 'icon', 'prefixIcon={<Search />}'),
      ...attr(prefix === 'text', 'prefix="−"'),
      ...attr(suffix === 'text', 'suffix="원"'),
      ...attr(clear === 'yes', 'clearable'),
    ];
    return `${prefix === 'icon' ? 'import { Search } from "lucide-react"\n' : ''}import { Field } from "@/components/ui/field"\nimport { Input } from "@/components/ui/input"\n\n<Field ${field.join(' ')}>\n  <Input ${input.join(' ')} />\n</Field>`;
  }, [variant, size, state, prefix, suffix, clear]);

  return (
    <Frame
      look={look}
      mode={mode}
      code={code}
      stage={
        <TfFieldView key={`${state}-${variant}-${size}`} look={look.field} mode={mode} label="금액" invalid={state === 'invalid'} errorMessage="금액을 입력해주세요.">
          {(ctl) => (
            <TfInputView
              look={look.input}
              mode={mode}
              variant={variant}
              size={size}
              id={ctl.id}
              describedBy={ctl.describedBy}
              invalid={ctl.invalid}
              disabled={state === 'disabled'}
              readOnly={state === 'readonly'}
              format="amount"
              defaultValue={state === 'invalid' ? '' : '12,000'}
              placeholder="0"
              prefixIcon={icon}
              prefix={prefix === 'text' ? '−' : undefined}
              suffix={suffix === 'text' ? '원' : undefined}
              clearable={clear === 'yes'}
            />
          )}
        </TfFieldView>
      }
      controls={
        <>
          <Seg label="모양 variant" value={variant} options={[['outline', '상자 outline'], ['underline', '밑줄 underline']] as const} onChange={setVariant} />
          <Seg label="크기 size" value={size} options={SIZES} onChange={setSize} />
          <Seg label="상태" value={state} options={[['enabled', '기본'], ['invalid', '오류'], ['disabled', '비활성'], ['readonly', '읽기 전용']] as const} onChange={setState} />
          <Seg label="앞 prefix" value={prefix} options={[['none', '없음'], ['icon', '아이콘'], ['text', '글자 −']] as const} onChange={setPrefix} />
          <Seg label="뒤 suffix" value={suffix} options={[['none', '없음'], ['text', '글자 원']] as const} onChange={setSuffix} />
          <Seg label="지우기 clearable" value={clear} options={[['no', '없음'], ['yes', '있음']] as const} onChange={setClear} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
    />
  );
}

// ── Textarea ──────────────────────────────────────────────
export function TextareaPlayground({ look }: { look: TfLook }) {
  const [size, setSize] = useState<TfSizeProp>('responsive');
  const [auto, setAuto] = useState<'on' | 'max' | 'off'>('on');
  const [state, setState] = useState<'enabled' | 'invalid' | 'disabled' | 'readonly'>('enabled');
  const [count, setCount] = useState<'no' | 'yes'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');
  const text = '가족 행사 참석으로 연차를 씁니다.\n결재 뒤 인수인계 문서를 공유할게요.';

  const code = useMemo(() => {
    const field = [`label="휴가 사유"`, ...attr(count === 'yes', 'maxGraphemeCount={1000}'), ...attr(state === 'invalid', 'invalid errorMessage="휴가 사유를 입력해주세요."'), ...attr(state === 'disabled', 'disabled'), ...attr(state === 'readonly', 'readOnly')];
    const ta = [...attr(size !== 'responsive', `size="${size}"`), ...attr(auto === 'max', 'className="max-h-40"'), ...attr(auto === 'off', 'autoSize={false} className="h-32"'), 'placeholder="예: 가족 행사 참석"'];
    return `import { Field } from "@/components/ui/field"\nimport { Textarea } from "@/components/ui/textarea"\n\n<Field ${field.join(' ')}>\n  <Textarea ${ta.join(' ')} />\n</Field>`;
  }, [size, auto, state, count]);

  return (
    <Frame
      look={look}
      mode={mode}
      code={code}
      stage={
        <TfFieldView key={`${state}-${auto}-${size}`} look={look.field} mode={mode} label="휴가 사유" invalid={state === 'invalid'} errorMessage="휴가 사유를 입력해주세요." max={count === 'yes' ? 1000 : undefined}>
          {(ctl) => (
            <TfTextareaView
              look={look.textarea}
              input={look.input}
              mode={mode}
              size={size}
              id={ctl.id}
              describedBy={ctl.describedBy}
              invalid={ctl.invalid}
              disabled={state === 'disabled'}
              readOnly={state === 'readonly'}
              onCount={ctl.onCount}
              maxGraphemes={count === 'yes' ? 1000 : undefined}
              autoSize={auto !== 'off'}
              maxHeight={auto === 'max' ? 160 : undefined}
              height={auto === 'off' ? 128 : undefined}
              defaultValue={state === 'invalid' ? '' : text}
              placeholder="예: 가족 행사 참석"
            />
          )}
        </TfFieldView>
      }
      controls={
        <>
          <Seg label="크기 size" value={size} options={SIZES} onChange={setSize} />
          <Seg label="높이" value={auto} options={[['on', '자동'], ['max', '자동 · 최대 160'], ['off', '고정 128']] as const} onChange={setAuto} />
          <Seg label="상태" value={state} options={[['enabled', '기본'], ['invalid', '오류'], ['disabled', '비활성'], ['readonly', '읽기 전용']] as const} onChange={setState} />
          <Seg label="글자 수" value={count} options={[['no', '없음'], ['yes', '1000']] as const} onChange={setCount} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
    />
  );
}
