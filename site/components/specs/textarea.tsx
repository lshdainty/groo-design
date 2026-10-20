// Textarea 페이지의 그림 — specs/components/textarea.md 의 `[그림: …](../../site/components/specs/textarea.tsx#<id>)` 자리.
// 여러 줄 입력칸은 textarea.yaml(+ input.yaml 의 상자 · 색, field.yaml)을 푼 값(textFieldLook)으로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { textFieldLook } from './text-field-look';
import { TextareaPlayground } from './text-field-playground';
import { TfFieldView, TfInputView, TfLiveTextareaField, TfTextareaView, type TfTextareaViewProps } from './text-field-view';
import { Phone, Sheet, Verdict, WebDialog, WebWindow, rc, type Mode } from './kit';
import { overlayLook } from './overlay-look';
import { SheetSurface } from './overlay-view';

type Fig = (p: { caption?: string }) => ReactNode;
const look = () => textFieldLook('desk');

function Cap({ children, strong }: { children?: ReactNode; strong?: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
      {strong && <b className="text-[13px] pk-text">{strong}</b>}
      {children}
    </span>
  );
}
function Surface({ mode = 'auto', children, className = '', style }: { mode?: Mode; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ background: rc('bg-layer-default', mode), ...style }}>
      {children}
    </div>
  );
}
const cta = (label: string, mode: Mode, variant = 'neutralSolid', brand: 'desk' | 'hr' = 'desk') => <ButtonView look={buttonLook({ variant, size: 'large' }, brand)} mode={mode} label={label} fill state="enabled" />;

// 여러 줄 입력칸(멈춘 그림)
function T(p: Omit<TfTextareaViewProps, 'look' | 'input'>) {
  const lk = look();
  return <TfTextareaView look={lk.textarea} input={lk.input} size="large" state="enabled" {...p} />;
}
// Field + 여러 줄 입력칸(멈춘 그림)
function FT({ mode = 'auto', label, indicator, max, count, error, ...p }: Omit<TfTextareaViewProps, 'look' | 'input'> & { label: string; indicator?: 'required' | 'optional'; max?: number; count?: number; error?: string }) {
  const lk = look();
  return (
    <TfFieldView look={lk.field} mode={mode} label={label} indicator={indicator} max={max} count={count} errorMessage={error} invalid={!!error}>
      <TfTextareaView look={lk.textarea} input={lk.input} mode={mode} size="large" state={error ? 'invalid' : 'enabled'} {...p} />
    </TfFieldView>
  );
}
const MEMO = '팀 점심 — 다음 달 회식비에서 정산하기로 했다.\n영수증은 사진으로 올려 둠.';
const REASON = '가족 행사 참석으로 연차를 씁니다.\n결재 뒤 인수인계 문서를 공유할게요.';

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-4">
      <div className="flex items-start gap-4">
        <Phone title="거래 수정" mode="light" scale={0.62} h={640} bg="bg-layer-default" bottom={cta('저장', 'light')}>
          <div className="flex flex-col px-6 pt-4" style={{ gap: lk.field.form.gapY }}>
            <TfFieldView look={lk.field} mode="light" label="내용">
              <TfInputView look={lk.input} mode="light" size="large" state="enabled" value="점심 식사" />
            </TfFieldView>
            <FT mode="light" label="메모" indicator="optional" value={MEMO} max={100} count={46} state="focused" />
          </div>
        </Phone>
        <Phone title="메모" mode="dark" scale={0.62} h={640} bg="bg-layer-default">
          <div className="flex flex-col px-6 pt-4">
            <FT mode="dark" label="본문" value={'10월 회의록\n\n- 디자인 시스템 입력칸을 SEED 로\n- 고르는 칸은 다음 차례에\n- 앱 적용은 컴포넌트를 다 정한 뒤'} max={10000} count={64} />
          </div>
        </Phone>
      </div>
        <WebWindow mode="light" w={600} h={420} url="hr.groo.app">
          <WebDialog
            mode="light"
            title="휴가 신청"
            brand="hr"
            footer={
              <div className="ml-auto flex gap-2">
                <ButtonView look={buttonLook({ variant: 'neutralWeak', size: 'small' }, 'hr')} mode="light" label="취소" state="enabled" />
                <ButtonView look={buttonLook({ variant: 'brandSolid', size: 'small' }, 'hr')} mode="light" label="신청" state="enabled" />
              </div>
            }
          >
            <TfFieldView look={lk.field} mode="light" label="휴가 사유" max={1000} count={39}>
              <TfTextareaView look={lk.textarea} input={lk.input} mode="light" size="medium" state="enabled" value={REASON} />
            </TfFieldView>
          </WebDialog>
        </WebWindow>
      </div>
    </Figure>
  );
};

const Playground: Fig = () => <TextareaPlayground look={look()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = look();
  const s = lk.textarea.sizes.large;
  const pin = (n: string) => (
    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
  return (
    <Figure caption={caption}>
      <div className="flex items-center gap-6 rounded-xl pk-surface px-8 py-10">
        <div className="relative w-[320px]">
          <T value={MEMO} />
          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: s.radius, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }} />
          <span aria-hidden className="pointer-events-none absolute" style={{ inset: 0, margin: `${s.padY}px ${s.padX}px`, background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
        </div>
        <div className="flex flex-col gap-4 text-[12px] pk-muted">
          <span className="flex items-center gap-1.5">{pin('ⓐ')} Container — 상자</span>
          <span className="flex items-center gap-1.5">{pin('ⓑ')} Value — 글(여백 안)</span>
        </div>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const AutoSize: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Surface>
          <T placeholder="예: 가족 행사 참석" />
        </Surface>
        <Cap strong="3줄에서 시작">large 94 · medium 82</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <T value={`${REASON}\n돌아와서 바로 이어서 할게요.\n급한 건 메신저로 연락 주세요.`} />
        </Surface>
        <Cap strong="쓴 만큼 자란다">최대 높이는 자리마다</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <T autoSize={false} height={72} value={`${REASON}\n돌아와서 바로 이어서 할게요.`} />
        </Surface>
        <Cap strong="고정 높이(autoSize false)">2줄 72 이상 · 넘치면 스크롤</Cap>
      </div>
    </div>
  </Panel>
);

const STATE_KO = { enabled: '기본', focused: '포커스', invalid: '오류', disabled: '비활성', readonly: '읽기 전용' } as const;
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 lg:grid-cols-2">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-col gap-2">
          <Surface mode={mode}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              {(['enabled', 'focused', 'invalid', 'disabled', 'readonly'] as const).map((st) => (
                <div key={st} className="flex flex-col gap-1.5">
                  <T mode={mode} state={st} value={st === 'enabled' ? '' : '가족 행사 참석'} placeholder="예: 가족 행사 참석" />
                  <span className="text-center text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
                    {STATE_KO[st]}
                  </span>
                </div>
              ))}
            </div>
          </Surface>
          <Cap strong={mode === 'light' ? '라이트' : '다크'} />
        </div>
      ))}
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
const LongGuide: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Panel caption={caption}>
      <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
        <Verdict ok note="긴 글은 자라는 칸에 · 최대 길이가 있으면 글자 수">
          <div className="w-[280px]">
            <FT label="탈퇴 사유" indicator="optional" value={'자주 쓰지 않게 됐어요. 가계부는 다른 앱으로 옮겼고, 메모만 가끔 썼어요.'} max={200} count={42} />
          </div>
        </Verdict>
        <Verdict ok={false} note="한 줄 칸에 200자를 받는다 — 쓴 글을 한눈에 볼 수 없다">
          <div className="w-[280px]">
            <TfFieldView look={lk.field} label="탈퇴 사유">
              <TfInputView look={lk.input} size="large" state="enabled" value="자주 쓰지 않게 됐어요. 가계부는 다른 앱으로 옮겼고" />
            </TfFieldView>
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

const MaxGuide: Fig = ({ caption }) => {
  const lk = look();
  const long = `${REASON}\n돌아와서 바로 이어서 할게요.\n급한 건 메신저로 연락 주세요.\n10월 24일 오후에는 연락이 어려워요.\n대신 처리할 사람은 김포레 님입니다.`;
  return (
    <Panel caption={caption}>
      <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
        <Verdict ok note="시트 안에서는 최대 높이 — 저장 버튼이 제자리에">
          <Phone title="" mode="light" scale={0.5} h={600} bg="bg-layer-basement" overlay={<Sheet title="메모 추가" mode="light" footer={cta('저장', 'light')}><TfFieldView look={lk.field} mode="light" label="메모"><TfTextareaView look={lk.textarea} input={lk.input} mode="light" size="large" state="enabled" value={long} maxHeight={140} /></TfFieldView></Sheet>} />
        </Verdict>
        <Verdict ok={false} note="칸이 끝없이 자라 저장 버튼을 화면 밖으로 밀어낸다">
          <Phone
            title=""
            mode="light"
            scale={0.5}
            h={600}
            bg="bg-layer-basement"
            overlay={
              // 시트가 화면 높이를 넘어 아래가 잘린다 — 저장 버튼은 화면 밖(Bottom Sheet 모양 그대로, 높이만 넘친다)
              <div className="absolute inset-0" style={{ background: 'var(--p-overlay-dim)' }}>
                <div className="absolute inset-x-0 top-14">
                  <SheetSurface look={overlayLook().sheet} mode="light" title="메모 추가" footer={cta('저장', 'light')}>
                    <TfFieldView look={lk.field} mode="light" label="메모">
                      <TfTextareaView look={lk.textarea} input={lk.input} mode="light" size="large" state="enabled" value={`${long}\n${long}\n${long}`} />
                    </TfFieldView>
                  </SheetSurface>
                </div>
              </div>
            }
          />
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 쓸 수 있다) ──────────────────────
function Live({ children }: { children: ReactNode }) {
  return (
    <Panel>
      <Surface className="mx-auto w-full max-w-[360px]">{children}</Surface>
    </Panel>
  );
}
const ExBasic: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveTextareaField field={lk.field} textarea={lk.textarea} input={lk.input} label="휴가 사유" max={1000} textareaProps={{ placeholder: '예: 가족 행사 참석' }} />
    </Live>
  );
};
const ExMax: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveTextareaField field={lk.field} textarea={lk.textarea} input={lk.input} label="메모" textareaProps={{ maxHeight: 240, defaultValue: MEMO }} />
    </Live>
  );
};
const ExFixed: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveTextareaField field={lk.field} textarea={lk.textarea} input={lk.input} label="공지 본문" textareaProps={{ autoSize: false, height: 240, defaultValue: '10월 24일(금) 오후 3시부터 2층 라운지에서 가을 사내 행사가 열려요.' }} />
    </Live>
  );
};

export const textareaFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  autosize: AutoSize,
  states: States,
  'long-guide': LongGuide,
  'max-guide': MaxGuide,
  'ex-basic': ExBasic,
  'ex-max': ExMax,
  'ex-fixed': ExFixed,
};
