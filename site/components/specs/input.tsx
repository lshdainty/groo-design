// Input 페이지의 그림 — specs/components/input.md 의 `[그림: …](../../site/components/specs/input.tsx#<id>)` 자리.
// 입력칸은 input.yaml(+ field.yaml)을 푼 값(textFieldLook)으로 그린다. 휴대폰 화면 안은 large, 데스크톱 창 안은 medium 으로 고정한다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { textFieldLook, TF_STATES } from './text-field-look';
import { InputPlayground } from './text-field-playground';
import { TfFieldView, TfInputView, TfLiveField, type TfInputViewProps } from './text-field-view';
import { Phone, Verdict, WebDialog, WebWindow, rc, type Mode } from './kit';

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

// 입력칸 하나(멈춘 그림)
function I(p: Omit<TfInputViewProps, 'look'>) {
  return <TfInputView look={look().input} size="large" state="enabled" {...p} />;
}
// Field + 입력칸(멈춘 그림)
function F({ mode = 'auto', label, labelWeight, description, error, ...p }: Omit<TfInputViewProps, 'look'> & { label?: string; labelWeight?: 'medium' | 'bold'; description?: string; error?: string }) {
  const lk = look();
  return (
    <TfFieldView look={lk.field} mode={mode} label={label} labelWeight={labelWeight} description={description} errorMessage={error} invalid={!!error}>
      <TfInputView look={lk.input} mode={mode} size="large" state={error ? 'invalid' : 'enabled'} {...p} />
    </TfFieldView>
  );
}
function Form({ children, gap }: { children: ReactNode; gap?: number }) {
  return (
    <div className="flex flex-col" style={{ gap: gap ?? look().field.form.gapY }}>
      {children}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-start gap-4">
      <Phone title="거래 추가" mode="light" scale={0.62} h={640} bg="bg-layer-default" bottom={cta('저장', 'light')}>
        <div className="flex flex-col px-6 pt-4">
          <Form>
            <F mode="light" label="금액" value="12,000" suffix="원" state="focused" />
            <F mode="light" label="내용" value="점심 식사" clearable />
            <F mode="light" label="가맹점" placeholder="예: 포레 식당" />
          </Form>
        </div>
      </Phone>
      <Phone title="메모" mode="dark" scale={0.62} h={640} bg="bg-layer-default" back={false}>
        <div className="flex flex-col px-6 pt-2">
          <I mode="dark" variant="underline" prefixIcon="search" value="회의록" clearable />
          <div className="mt-4 flex flex-col gap-3">
            {['10월 회의록 — 디자인 시스템', '9월 회의록 — 분기 회고', '회의록 양식'].map((t) => (
              <span key={t} className="text-[15px]" style={{ color: rc('fg-neutral', 'dark') }}>
                {t}
              </span>
            ))}
          </div>
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
          <Form gap={20}>
            <F mode="light" size="medium" label="제목" placeholder="예: 개인 사유" />
            <F mode="light" size="medium" label="연락처" value="010-1234-5678" />
          </Form>
        </WebDialog>
      </WebWindow>
    </div>
  </Figure>
);

const Playground: Fig = () => <InputPlayground look={look()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = look();
  const s = lk.input.sizes.outline.large;
  const mark: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, background: MARK };
  const pin = (n: string) => (
    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-8 pb-8 pt-10">
        <div className="relative w-[340px]">
          <div className="absolute -top-7 left-0 right-0 flex text-[11px]" style={{ paddingInline: s.padX }}>
            <span className="flex w-[20px] justify-center">{pin('ⓑ')}</span>
            <span className="flex flex-1 justify-center">{pin('ⓒ')}</span>
            <span className="flex w-[22px] justify-center" style={{ marginRight: s.gap }}>{pin('ⓓ')}</span>
            <span className="flex w-[22px] justify-center">{pin('ⓔ')}</span>
          </div>
          <div className="relative">
            <I prefixIcon="search" value="회의록" suffix="12건" clearable zone={mark} />
            <span aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: s.radius, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }} />
            <span className="absolute -left-8 top-1/2 -translate-y-1/2">{pin('ⓐ')}</span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 text-center text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Prefix'],
            ['ⓒ', 'Value'],
            ['ⓓ', 'Suffix'],
            ['ⓔ', 'Clear'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Variant: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="금액" value="12,000" suffix="원" />
        </Surface>
        <Cap strong="outline">상자 — 기본</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="얼마를 썼나요?" labelWeight="bold" variant="underline" value="12,000" suffix="원" />
        </Surface>
        <Cap strong="underline">밑줄 — 화면에 입력이 하나뿐일 때</Cap>
      </div>
    </div>
  </Panel>
);

const Size: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Surface>
            <F label="내용" size="large" value="점심 식사" prefixIcon="tag" />
          </Surface>
          <Cap strong="large 52">폰 · 앱 — 글자 16 · 모서리 12 · 아이콘 20</Cap>
        </div>
        <div className="flex flex-col gap-2">
          <Surface>
            <F label="내용" size="medium" value="점심 식사" prefixIcon="tag" />
          </Surface>
          <Cap strong="medium 40">1280 이상 데스크톱 웹 — 글자 14 · 모서리 8 · 아이콘 16</Cap>
        </div>
        <div className="flex flex-col gap-2">
          <Surface>
            <F label="검색" variant="underline" size="large" prefixIcon="search" value="회의록" />
          </Surface>
          <Cap strong="underline large 40">글자 18 · 아이콘 24</Cap>
        </div>
        <div className="flex flex-col gap-2">
          <Surface>
            <F label="검색" variant="underline" size="medium" prefixIcon="search" value="회의록" />
          </Surface>
          <Cap strong="underline medium 34">글자 16 · 아이콘 20</Cap>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="반응형 — 지금 이 창의 폭으로" size="responsive" placeholder="1280 미만은 large, 이상은 medium" state={undefined} />
        </Surface>
        <Cap strong="responsive(웹 기본)">창 폭을 바꿔 보면 1280 에서 바뀐다</Cap>
      </div>
    </div>
  </Panel>
);

const STATE_KO = { enabled: '기본', focused: '포커스', invalid: '오류', 'invalid-focused': '오류 + 포커스', disabled: '비활성', readonly: '읽기 전용' } as const;
const States: Fig = ({ caption }) => {
  const list = [...TF_STATES.slice(0, 3), 'invalid-focused', ...TF_STATES.slice(3)] as const;
  const row = (variant: 'outline' | 'underline', mode: Mode) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
      {list.map((st) => (
        <div key={st} className="flex flex-col gap-1.5">
          <I mode={mode} variant={variant} state={st} value={st === 'enabled' ? '' : '12,000'} placeholder="금액" suffix="원" />
          <span className="text-center text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
            {STATE_KO[st]}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col gap-2">
            <Surface mode={mode}>
              <div className="flex flex-col gap-6">
                {row('outline', mode)}
                {row('underline', mode)}
              </div>
            </Surface>
            <Cap strong={mode === 'light' ? '라이트' : '다크'}>위 상자 · 아래 밑줄</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const Affix: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Surface>
        <F label="블로그 주소" prefix="https://" placeholder="example.com" />
      </Surface>
      <Surface>
        <F label="금액" value="12,000" suffix="원" />
      </Surface>
      <Surface>
        <F label="나이" prefix="만" value="34" suffix="세" />
      </Surface>
      <Surface>
        <F label="메모 검색" prefixIcon="search" placeholder="제목 · 본문으로 찾기" />
      </Surface>
    </div>
  </Panel>
);

const Clear: Fig = ({ caption }) => {
  const hit = look().input.clearHit;
  const L = look().input.sizes.outline;
  return (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Surface>
          <I prefixIcon="search" placeholder="메모 검색" clearable />
        </Surface>
        <Cap strong="비었을 때">지우기 없음</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <I prefixIcon="search" value="회의록" clearable state="focused" hitMark={{ fill: MARK, line: MARK_LINE }} />
        </Surface>
        <Cap strong="값이 있을 때">
          원 large {L.large.clear} · medium {L.medium.clear} — 분홍 점선은 누르는 영역 {hit}(상자 밖은 잘린다)
        </Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <I prefixIcon="search" value="회의록" clearable state="disabled" />
        </Surface>
        <Cap strong="막혔을 때">보이지 않는다</Cap>
      </div>
    </div>
  </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const UnderlineGuide: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Panel caption={caption}>
      <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
        <Verdict ok note="화면이 값 하나를 받으면 밑줄형으로 크게">
          <Phone title="" mode="light" scale={0.52} h={560} bg="bg-layer-default" bottom={cta('다음', 'light')}>
            <div className="px-6 pt-4">
              <TfFieldView look={lk.field} mode="light" label="얼마를 썼나요?" labelWeight="bold">
                <TfInputView look={lk.input} mode="light" variant="underline" size="large" state="focused" value="12,000" suffix="원" />
              </TfFieldView>
            </div>
          </Phone>
        </Verdict>
        <Verdict ok={false} note="상자형 칸 하나만 덩그러니 둔다">
          <Phone title="" mode="light" scale={0.52} h={560} bg="bg-layer-default" bottom={cta('다음', 'light')}>
            <div className="px-6 pt-4">
              <TfFieldView look={lk.field} mode="light" label="금액">
                <TfInputView look={lk.input} mode="light" size="large" state="focused" value="12,000" suffix="원" />
              </TfFieldView>
            </div>
          </Phone>
        </Verdict>
      </div>
    </Panel>
  );
};

const NumberGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
      <Verdict ok note="쓰는 동안 쉼표 · 단위는 뒤 글자 · 숫자 키보드">
        <div className="w-[280px]">
          <F label="금액" value="1,500,000" suffix="원" />
        </div>
      </Verdict>
      <Verdict ok={false} note="쉼표 없이 · 단위를 라벨에 붙인다">
        <div className="w-[280px]">
          <F label="금액(원)" value="1500000" />
        </div>
      </Verdict>
    </div>
  </Panel>
);

const FormatGuide: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Panel caption={caption}>
      <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
        <Verdict ok note="한 칸에서 쓰는 대로 하이픈을 맞춰 준다">
          <div className="w-[280px]">
            <F label="휴대폰 번호" value="010-1234-5678" inputMode="tel" />
          </div>
        </Verdict>
        <Verdict ok={false} note="세 칸으로 나눠 칸마다 옮겨 다니게 한다">
          <div className="w-[280px]">
            <TfFieldView look={lk.field} label="휴대폰 번호">
              <div className="flex items-center gap-2">
                <I value="010" />
                <span className="pk-muted">-</span>
                <I value="1234" />
                <span className="pk-muted">-</span>
                <I value="5678" />
              </div>
            </TfFieldView>
          </div>
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
      <TfLiveField field={lk.field} input={lk.input} label="제목" description="결재 목록에 이 제목으로 보여요." inputProps={{ placeholder: '예: 개인 사유' }} />
    </Live>
  );
};
const ExAffix: Fig = () => {
  const lk = look();
  return (
    <Live>
      <div className="flex flex-col" style={{ gap: lk.field.form.gapY }}>
        <TfLiveField field={lk.field} input={lk.input} label="금액" inputProps={{ format: 'amount', defaultValue: '12,000', suffix: '원', placeholder: '0' }} />
        <TfInputView look={lk.input} ariaLabel="메모 검색" prefixIcon="search" placeholder="메모 검색" clearable />
      </div>
    </Live>
  );
};
const ExUnderline: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveField field={lk.field} input={lk.input} label="얼마를 썼나요?" labelWeight="bold" inputProps={{ variant: 'underline', size: 'large', format: 'amount', suffix: '원', placeholder: '0' }} />
    </Live>
  );
};
const ExStates: Fig = () => {
  const lk = look();
  return (
    <Live>
      <div className="flex flex-col" style={{ gap: lk.field.form.gapY }}>
        <TfLiveField field={lk.field} input={lk.input} label="이름" invalid errorMessage="이름을 입력해주세요." />
        <TfLiveField field={lk.field} input={lk.input} label="계좌" inputProps={{ disabled: true, defaultValue: '국민 123-45-6789' }} />
        <TfLiveField field={lk.field} input={lk.input} label="아이디" inputProps={{ readOnly: true, defaultValue: 'groo' }} />
      </div>
    </Live>
  );
};

export const inputFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  variant: Variant,
  size: Size,
  states: States,
  affix: Affix,
  clear: Clear,
  'underline-guide': UnderlineGuide,
  'number-guide': NumberGuide,
  'format-guide': FormatGuide,
  'ex-basic': ExBasic,
  'ex-affix': ExAffix,
  'ex-underline': ExUnderline,
  'ex-states': ExStates,
};
