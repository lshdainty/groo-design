// Input OTP 페이지의 그림 — specs/components/input-otp.md 의 `[그림: …](../../site/components/specs/input-otp.tsx#<id>)` 자리.
// 코드 칸은 Input 상자형 한 칸(input.yaml — text-field-view), 라벨 · 설명 · 오류는 Field(field.yaml), 코드 칸이 더하는 것(숫자만 · 설명 줄 ·
// 다시 받기의 글 · 60초)은 input-otp.yaml 을 푼 값(otpLook — otp-view)이다. 다시 받기 단추는 Button neutralWeak medium(button.yaml),
// 화면은 Bottom Sheet · Dialog(bottom-sheet · dialog.yaml — kit). 메일 · 코드는 지어낸 것이다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { snackbarLook } from './feedback-look';
import { otpLook, resendLabel, type OtpResend } from './input-look';
import { Phone, Sheet, Verdict, WebDialog, WebWindow, rc, type Mode } from './kit';
import { OtpExDemo, OtpPlayground } from './otp-play';
import { OtpFieldView, OtpResendView, type OtpFieldState } from './otp-view';
import { Legend, ov, pinStyle } from './overlay-screens';
import { EndButtons } from './overlay-view';
import { Cap, Surface, tf } from './select-screens';
import { TfFieldView, TfInputView } from './text-field-view';

type Fig = (p: { caption?: string }) => ReactNode;
const L = () => otpLook();
const LABEL = '인증 코드';
const px = (v: string) => parseFloat(v);
const resendBtn = () => buttonLook({ variant: L().resend.variant, size: L().resend.size });
const STATE_KO: Record<OtpFieldState, string> = { enabled: '기본', focused: '포커스', invalid: '오류', disabled: '막힘' };
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;

// 멈춘 코드 칸 + 다시 받기
function Otp({ mode = 'auto', size = 'large', value = '', state = 'enabled', resend = 'cooldown', left = 52, error, marks, showResend = true }: { mode?: Mode; size?: 'large' | 'medium'; value?: string; state?: OtpFieldState; resend?: OtpResend; left?: number; error?: string; marks?: Partial<Record<'header' | 'input' | 'footer', CSSProperties>>; showResend?: boolean }) {
  const t = tf();
  return (
    <div>
      <OtpFieldView look={L()} field={t.field} input={t.input} mode={mode} size={size} label={LABEL} value={value} state={state} error={error} marks={marks} />
      {showResend && <OtpResendView look={L()} button={resendBtn()} mode={mode} kind={resend} left={left} />}
    </div>
  );
}

// ── 화면 — 이용 해지 > 본인 확인 ───────────────────────────
const INTRO = '가입한 메일로 받은 인증 코드를 입력해주세요.';
function Intro({ mode }: { mode: Mode }) {
  return (
    <p className="m-0 pb-5 text-[15px] leading-[22px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
      {INTRO}
    </p>
  );
}
const confirmBtn = (mode: Mode) => <ButtonView look={buttonLook({ size: ov().sheet.footer.button.size })} mode={mode} label="확인" fill state="enabled" />;
function AppScreen({ mode }: { mode: Mode }) {
  return (
    <Phone title="설정" mode={mode} scale={0.55} h={640} screenW={360} overlay={
      <Sheet title="이용 해지" mode={mode} footer={confirmBtn(mode)}>
        <Intro mode={mode} />
        <Otp mode={mode} value="4821" state="focused" />
      </Sheet>
    }>
      <div className="px-6 pt-4 text-[15px] leading-6" style={{ color: rc('fg-neutral', mode) }}>
        계정
      </div>
    </Phone>
  );
}
function WebScreen({ mode }: { mode: Mode }) {
  return (
    <WebWindow mode={mode} w={620} h={460}>
      <WebDialog
        title="이용 해지"
        mode={mode}
        footer={
          <EndButtons
            mode={mode}
            items={[
              { label: '취소', look: buttonLook({ variant: 'neutralWeak', size: ov().dialog.footer.button.size }), state: 'enabled' },
              { label: '확인', look: buttonLook({ size: ov().dialog.footer.button.size }), state: 'enabled' },
            ]}
          />
        }
      >
        <Intro mode={mode} />
        <Otp mode={mode} size="medium" value="4821" state="focused" />
      </WebDialog>
    </WebWindow>
  );
}
const Scaled = ({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) => (
  <div className="shrink-0" style={{ width: w * s, height: h * s }}>
    <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
  </div>
);

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <AppScreen mode={mode} />
          <Scaled w={620} h={460} s={0.62}>
            <WebScreen mode={mode} />
          </Scaled>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <OtpPlayground look={L()} field={tf().field} input={tf().input} resend={resendBtn()} surface={tf().surface.default} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = L();
  const t = tf();
  const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 };
  const headH = px(t.field.label.text.lineHeight);
  const inputY = headH + t.field.gap;
  const footY = inputY + l.sizes.large.height + t.field.gap;
  const resendY = footY + px(t.field.description.text.lineHeight) + l.resend.marginTop;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-4 pb-8 pt-10 sm:px-10">
        <div className="relative" style={{ width: 312, maxWidth: 'calc(100% - 32px)', marginLeft: 32 }}>
          <Otp value="4821" resend="cooldown" marks={{ header: dashed, input: dashed, footer: dashed }} />
          {pinStyle('ⓐ', { left: -30, top: headH / 2 - 10 })}
          {pinStyle('ⓑ', { left: -30, top: inputY + l.sizes.large.height / 2 - 10 })}
          {pinStyle('ⓒ', { left: -30, top: footY })}
          {pinStyle('ⓓ', { left: -30, top: resendY + l.resend.height / 2 - 10 })}
        </div>
        <Legend
          items={[
            ['ⓐ', 'Label — "인증 코드"'],
            ['ⓑ', `Field — Input 한 칸(large ${l.sizes.large.height})`],
            ['ⓒ', 'Description — 늘 보이는 설명 줄'],
            ['ⓓ', `Resend — 칸 아래 ${l.resend.marginTop} · 보낸 뒤 ${l.cooldown}초 막힘`],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const Size: Fig = ({ caption }) => {
  const l = L();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {(['large', 'medium'] as const).map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <Surface style={{ width: 300 }}>
              <Otp size={s} value="123456" state="enabled" showResend={false} />
            </Surface>
            <Cap strong={`${s} ${l.sizes[s].height}`}>{s === 'large' ? `폰 · 앱 — 모서리 ${l.sizes.large.radius} · 좌우 ${l.sizes.large.padX}` : `${l.breakpoint} 이상 데스크톱 웹 — 모서리 ${l.sizes.medium.radius} · 좌우 ${l.sizes.medium.padX}`}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 붙여넣기 — 숫자만 뽑아 앞 6자리
function Clip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-[12px] leading-4" style={{ background: rc('bg-neutral-weak'), color: rc('fg-neutral') }}>
      <span style={{ color: rc('fg-neutral-subtle') }}>붙인 글</span>“{text}”
    </span>
  );
}
const Paste: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="치기 · 붙여넣기 · 자동 채우기 모두 숫자만 뽑아 앞 6자리 — 메일의 띄어 쓴 코드 · 앞에 붙은 글도 그대로 붙는다">
        <div className="flex w-full max-w-[300px] flex-col gap-4">
          {['123 456', '인증 코드: 123456'].map((p) => (
            <div key={p} className="flex flex-col gap-2">
              <Clip text={p} />
              <Surface style={{ padding: 16 }}>
                <Otp value="123456" state="focused" showResend={false} />
              </Surface>
            </div>
          ))}
        </div>
      </Verdict>
      <Verdict ok={false} note="maxLength 로 먼저 자르기 — 브라우저가 붙인 글을 6글자로 자른 뒤에 숫자만 남겨 '12345' · 빈 칸이 된다(지금 웹)">
        <div className="flex w-full max-w-[300px] flex-col gap-4">
          {[
            ['123 456', '12345'],
            ['인증 코드: 123456', ''],
          ].map(([p, v]) => (
            <div key={p} className="flex flex-col gap-2">
              <Clip text={p} />
              <Surface style={{ padding: 16 }}>
                <Otp value={v} state="focused" showResend={false} />
              </Surface>
            </div>
          ))}
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// 다시 받기 — 코드 받기 · 다시 받기(52초) 막힘 · 다시 받기
const Resend: Fig = ({ caption }) => {
  const l = L();
  const items: [OtpResend, number, string][] = [
    ['first', 0, '처음 — 보내기 전'],
    ['cooldown', 52, `보낸 뒤 ${l.cooldown}초 동안 — 남은 초 · 막힘`],
    ['ready', 0, `${l.cooldown}초가 지나면`],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {items.map(([k, left, cap]) => (
          <div key={k} className="flex flex-col items-center gap-2">
            <Surface style={{ paddingTop: 8 }}>
              <OtpResendView look={l} button={resendBtn()} kind={k} left={left} />
            </Surface>
            <Cap strong={resendLabel(l, k, left)}>{cap}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 상태 — 기본 · 포커스 · 오류 · 막힘(라이트 · 다크)
const States: Fig = ({ caption }) => {
  const order: OtpFieldState[] = ['enabled', 'focused', 'invalid', 'disabled'];
  const block = (mode: 'light' | 'dark') => (
    <div className="flex flex-col items-center gap-2">
      <Surface mode={mode}>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {order.map((st) => (
            <div key={st} className="flex flex-col gap-1.5" style={{ width: 260 }}>
              <span className="text-[12px] font-bold leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
                {STATE_KO[st]}
              </span>
              <Otp mode={mode} value={st === 'enabled' ? '' : '4821'} state={st} showResend={false} />
            </div>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>포커스 · 오류는 안쪽 2px(내용이 밀리지 않는다) · 오류 글이 설명 줄을 대신한다 · 막힘은 전용 색</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {block('light')}
        {block('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 6칸으로 나눈 칸(나쁜 예 그림) — 칸 크기는 옛 스펙의 모양을 흉내 낸다
function SixCells() {
  const l = L();
  const s = l.sizes.large;
  const stroke = tf().input.stroke;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[16px] font-medium leading-[22px]" style={{ color: rc('fg-neutral') }}>
        {LABEL}
      </span>
      <div className="flex gap-1.5">
        {['4', '8', '2', '1', '', ''].map((d, i) => (
          <span key={i} className="flex flex-1 items-center justify-center text-[20px] font-bold" style={{ height: s.height, borderRadius: s.radius, boxShadow: `inset 0 0 0 ${i === 4 ? stroke.active : stroke.base}px ${rc(i === 4 ? 'stroke-neutral-contrast' : 'stroke-neutral-weak')}`, color: rc('fg-neutral') }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
const SplitGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="한 칸 — 붙여넣기 · 지우기 · 고치기가 보통 글 칸처럼 되고, 크기 · 포커스 · 막힘 규칙을 따로 지킬 일이 없다">
        <Surface className="w-full max-w-[300px]">
          <Otp value="4821" state="focused" />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="자릿수만큼 나눈 칸 · 한 칸 위에 그린 6칸 모양 — 지우기 · 고치기가 칸마다 끊기고 붙여넣기가 한 칸에만 들어간다">
        <Surface className="w-full max-w-[300px]">
          <SixCells />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

// 오류는 칸 아래 — 화면 글로
function RawServerError() {
  const t = tf();
  return (
    <div className="flex flex-col">
      <TfFieldView look={t.field} label={LABEL} description={L().description}>
        <TfInputView look={t.input} size="large" state="enabled" value="482193" />
      </TfFieldView>
      <span className="pt-2 text-[14px] leading-[19px]" style={{ color: rc('fg-critical') }}>
        코드를 방금 보냈어요. 잠시 뒤에 다시 받아 주세요
      </span>
      <div style={{ marginTop: L().resend.marginTop }}>
        <ButtonView look={resendBtn()} label={resendLabel(L(), 'ready')} state="enabled" />
      </div>
    </div>
  );
}
const ErrorGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="칸 2px 빨강 · 오류 글이 설명 줄을 대신한다(무엇이 안 됐는지와 할 일) · 다시 받기는 그대로">
        <Surface className="w-full max-w-[300px]">
          <Otp value="482193" state="invalid" resend="ready" />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="서버가 보낸 글을 그대로 칸 아래 빨갛게 — 칸에는 오류 표시가 없고, 설명 줄과 겹쳐 무엇을 할지 모른다(지금 웹)">
        <Surface className="w-full max-w-[300px]">
          <RawServerError />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 미리보기 ─────────────────────────────────────────
const ExBasic: Fig = () => <OtpExDemo look={L()} field={tf().field} input={tf().input} resend={resendBtn()} cta={buttonLook({ size: 'large' })} snack={snackbarLook()} />;

export const inputOtpFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  paste: Paste,
  resend: Resend,
  states: States,
  'split-guide': SplitGuide,
  'error-guide': ErrorGuide,
  'ex-basic': ExBasic,
};
