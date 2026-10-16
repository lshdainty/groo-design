'use client';
// 스펙대로 그린 Input OTP — 인증 코드 칸은 Input 상자형 한 칸(text-field-view), 라벨 · 설명 · 오류는 Field, 다시 받기는 Button neutralWeak.
// 값은 OtpLook(input-otp.yaml)에서 — 숫자만 앞 6자리 · placeholder · 설명 줄 · 다시 받기 글 · 60초.
// state 를 주면 멈춘 그림, 안 주면 실제 칸 — 치기 · 붙여넣기 · 자동 채우기 모두 숫자만 뽑는다(maxLength 를 걸지 않는다).
import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import { otpDigits, resendLabel, type OtpLook, type OtpResend, type ViewMode } from './input-shared';
import type { TfFieldLook, TfInputLook, TfSizeProp } from './text-field-shared';
import { TfFieldView, TfInputView } from './text-field-view';

export type OtpFieldState = 'enabled' | 'focused' | 'invalid' | 'disabled';
export type OtpFieldViewProps = {
  look: OtpLook;
  field: TfFieldLook;
  input: TfInputLook;
  mode?: ViewMode;
  size?: TfSizeProp;
  label: string;
  value: string;
  onValue?: (v: string) => void;
  invalid?: boolean;
  error?: string;
  disabled?: boolean;
  // 멈춘 그림 — 없으면 실제 칸
  state?: OtpFieldState;
  id?: string;
  inputRef?: Ref<HTMLInputElement>;
  marks?: Partial<Record<'header' | 'input' | 'footer', CSSProperties>>;
};

export function OtpFieldView({ look, field, input: inputLook, mode = 'auto', size = 'responsive', label, value, onValue, invalid = false, error, disabled = false, state, id, inputRef, marks }: OtpFieldViewProps) {
  // 막혀도 자리 글은 켜진 칸의 색 — input-otp.yaml disabled › placeholder(Input 의 막힘 색을 덮는다)
  const input = look.placeholderKeep ? { ...inputLook, color: { ...inputLook.color, placeholderDisabled: inputLook.color.placeholder } } : inputLook;
  const live = state === undefined;
  const bad = invalid || state === 'invalid';
  const errorMessage = error ?? look.error;
  if (!live)
    return (
      <TfFieldView look={field} mode={mode} label={label} description={look.description} invalid={bad} errorMessage={errorMessage} marks={marks}>
        <TfInputView look={input} mode={mode} size={size} state={state === 'invalid' ? 'invalid' : state === 'disabled' ? 'disabled' : state} value={value || undefined} placeholder={look.placeholder} zone={{ fontVariantNumeric: 'tabular-nums' }} />
      </TfFieldView>
    );
  return (
    <TfFieldView look={field} mode={mode} label={label} description={look.description} invalid={bad} errorMessage={errorMessage} marks={marks}>
      {(ctl) => (
        <TfInputView
          look={input}
          mode={mode}
          size={size}
          id={id ?? ctl.id}
          describedBy={ctl.describedBy}
          invalid={bad}
          disabled={disabled}
          value={value}
          placeholder={look.placeholder}
          inputMode="numeric"
          // 숫자만 뽑아 앞 6자리 — "123 456" · "인증 코드: 123456" 도 123456
          onValue={(raw) => onValue?.(otpDigits(raw, look.length))}
          inputRef={inputRef}
          inputProps={{ autoComplete: 'one-time-code', name: 'one-time-code', style: { fontVariantNumeric: 'tabular-nums' } }}
        />
      )}
    </TfFieldView>
  );
}

// 다시 받기 — 보내기 전 "코드 받기", 보낸 뒤 60초 동안 "다시 받기(52초)" + 막힘, 지나면 "다시 받기"
export function OtpResendView({ look, button, mode = 'auto', kind, left = 0, live = false, onClick, style }: { look: OtpLook; button: ButtonLook; mode?: ViewMode; kind: OtpResend; left?: number; live?: boolean; onClick?: () => void; style?: CSSProperties }) {
  const label = resendLabel(look, kind, left);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: look.resend.marginTop, ...style }}>
      <ButtonView look={button} mode={mode} label={label} state={kind === 'cooldown' ? 'disabled' : live ? 'live' : 'enabled'} onClick={onClick} />
    </div>
  );
}

// 시계 — speed 배로 흐르는 지금(ms). 플레이그라운드가 시계를 빨리 돌린다
export function useClock(running: boolean, speed = 1) {
  const [now, setNow] = useState(() => Date.now());
  const virtual = useRef({ real: Date.now(), at: Date.now() });
  useEffect(() => {
    if (!running) return;
    virtual.current = { real: Date.now(), at: now };
    const t = window.setInterval(() => {
      const real = Date.now();
      const v = virtual.current;
      const at = v.at + (real - v.real) * speed;
      virtual.current = { real, at };
      setNow(at);
    }, 200);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed]);
  return now;
}
