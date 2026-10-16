// State 페이지 — 상태마다의 색은 DESIGN*.md 의 역할 색, 크기는 컴포넌트 YAML, 축소는 "눌림 피드백" 표에서 온다
import type { CSSProperties, ReactNode } from 'react';
import { color, pressScale, specSize, type Brand } from '@/lib/design-tokens';
import { Figure, Verdict } from './ui';
import { textFieldLook } from '../specs/text-field-look';
import { TfFieldView, TfInputView } from '../specs/text-field-view';
import { buttonLook } from '../specs/button-look';
import { PcArc } from '../specs/pc-arc';

type Mode = 'light' | 'dark';
const rc = (name: string, mode: Mode = 'light', brand: Brand = 'desk') => (name === 'static-white' ? color(name, brand) : color(mode === 'dark' ? `${name}-dark` : name, brand));

function Cell({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex h-14 items-center justify-center">{children}</div>
      <b className="text-[13px] text-[#1A1F2E]">{label}</b>
      {sub && <span className="max-w-[128px] text-center text-[11px] leading-4 text-[#62697A]">{sub}</span>}
    </div>
  );
}

function Button({ bg, fg, style, children, w = 112 }: { bg: string; fg: string; style?: CSSProperties; children: ReactNode; w?: number }) {
  const h = specSize('button', 'medium').height;
  return (
    <span className="relative inline-flex items-center justify-center rounded-lg text-[14px] font-bold" style={{ width: w, height: h, background: bg, color: fg, ...style }}>
      {children}
    </span>
  );
}

export function InteractionStatesFigure() {
  const { ratio } = pressScale();
  const h = specSize('button', 'medium').height;
  const w = 112;
  const brand = rc('bg-brand-solid'), pressed = rc('bg-brand-solid-pressed'), white = rc('static-white'), ring = rc('stroke-focus-ring');
  return (
    <Figure caption="상호작용 상태 — 사용자의 동작에 따라 바뀐다. 호버와 누름은 같은 색이고, 누르면 축소가 더해진다">
      <div className="grid grid-cols-4 gap-4 rounded-xl bg-white px-6 pb-5 pt-6">
        <Cell label="enabled" sub="기본">
          <Button bg={brand} fg={white}>저장</Button>
        </Cell>
        <Cell label="hovered" sub="누름 색 · 마우스 기기만">
          <Button bg={pressed} fg={white}>저장</Button>
        </Cell>
        <Cell label="focused" sub="키보드 — 링 2px · 띄움 2px">
          <Button bg={brand} fg={white} style={{ outline: `2px solid ${ring}`, outlineOffset: 2 }}>저장</Button>
        </Cell>
        <Cell label="pressed" sub="누름 색 + 축소">
          <span className="relative inline-flex" style={{ width: w, height: h }}>
            <span className="absolute inset-0 rounded-lg border border-dashed" style={{ borderColor: rc('stroke-neutral-solid') }} />
            <Button bg={pressed} fg={white} style={{ transform: `scale(${ratio(w, h)})` }}>저장</Button>
          </span>
        </Cell>
      </div>
    </Figure>
  );
}

// 채운 브랜드 버튼(medium)의 로딩 원 — button.yaml progressCircle
const loadingCircle = () => {
  const p = buttonLook({ variant: 'brandSolid', size: 'medium' }).faces.light.loading.progress;
  return { size: p.size, thickness: p.thickness, track: p.track, range: p.range };
};

export function OptionStatesFigure() {
  const white = rc('static-white');
  return (
    <Figure caption="옵션 상태 — 컴포넌트에 걸린 옵션. 선택은 반전, 비활성은 전용 색, 불러오는 중은 누름 색 + 진행 표시">
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-white px-6 pb-5 pt-6">
        <Cell label="selected" sub="반전 — 고르는 요소">
          <span className="flex gap-1.5">
            <span className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-bold" style={{ background: rc('bg-neutral-inverted'), color: rc('fg-neutral-inverted') }}>식비</span>
            <span className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-bold" style={{ background: rc('bg-neutral-weak'), color: rc('fg-neutral') }}>교통</span>
          </span>
        </Cell>
        <Cell label="disabled" sub="배경 · 글자 전용 색, 불투명도 없음">
          <Button bg={rc('bg-disabled')} fg={rc('fg-disabled')}>저장</Button>
        </Cell>
        <Cell label="loading" sub="누름 색 + 진행 표시, 누름 없음">
          <Button bg={rc('bg-brand-solid-pressed')} fg={white}>
            {/* 로딩 원 — Button 이 넘기는 크기 · 두께 · 색(button.yaml progressCircle), 움직임은 Progress Circle */}
            <PcArc {...loadingCircle()} />
          </Button>
        </Cell>
      </div>
    </Figure>
  );
}

// 입력칸 — input.yaml 의 상자형 medium(좁은 칸이라). 오류는 Field 의 꼬리 글
function Field({ state }: { state: 'enabled' | 'focused' | 'invalid' | 'readonly' | 'disabled' }) {
  const lk = textFieldLook('desk');
  const input = <TfInputView look={lk.input} mode="light" size="medium" state={state} value={state === 'enabled' ? undefined : '장보기 목록'} placeholder="메모 제목" />;
  return (
    <div className="w-[160px]">
      {state === 'invalid' ? (
        <TfFieldView look={lk.field} mode="light" invalid errorMessage="제목을 입력해주세요.">
          {input}
        </TfFieldView>
      ) : (
        input
      )}
    </div>
  );
}
export function FieldStatesFigure() {
  const states = ['enabled', 'focused', 'invalid', 'readonly', 'disabled'] as const;
  const sub: Record<(typeof states)[number], string> = {
    enabled: '기본',
    focused: '입력 중 — 안쪽 2px 짙은 테두리',
    invalid: '오류 — 안쪽 2px 오류 색, 아래 오류 글',
    readonly: '읽기 전용 — 값은 읽힌다',
    disabled: '비활성 — 전용 색',
  };
  return (
    <Figure caption="입력칸의 상태 — 입력 중과 오류는 안쪽에 2px 를 덧그린다(내용이 밀리지 않는다), 읽기 전용 · 비활성은 비활성 배경(Input 스펙)">
      <div className="grid grid-cols-3 gap-x-5 gap-y-4 rounded-xl bg-white px-6 pb-5 pt-6">
        {states.map((s) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <Field state={s} />
            <b className="text-[13px] text-[#1A1F2E]">{s}</b>
            <span className="text-center text-[11px] leading-4 text-[#62697A]">{sub[s]}</span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function OverlapFigure() {
  const { ratio } = pressScale();
  const chip = (bg: string, fg: string, scaled: boolean) => (
    <span className="relative inline-flex" style={{ width: 64, height: 32 }}>
      {scaled && <span className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: rc('stroke-neutral-solid') }} />}
      <span className="inline-flex h-8 w-16 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: bg, color: fg, transform: scaled ? `scale(${ratio(64, 32)})` : undefined }}>식비</span>
    </span>
  );
  const disabledBtn = (hover: boolean) => (
    <span className="inline-flex h-10 w-[104px] items-center justify-center rounded-lg text-[14px] font-bold" style={{ background: hover ? rc('bg-neutral-weak-pressed') : rc('bg-disabled'), color: rc('fg-disabled') }}>
      저장
    </span>
  );
  return (
    <Figure>
      <div className="grid w-[540px] grid-cols-2 gap-4">
        <Verdict ok note="선택된 칩을 누르면 선택 색은 그대로, 줄어들기만 한다">{chip(rc('bg-neutral-inverted'), rc('fg-neutral-inverted'), true)}</Verdict>
        <Verdict ok={false} note="누르는 동안 선택 색이 바뀌면 손을 떼기 전에 선택이 풀린 것처럼 보인다">{chip(rc('bg-neutral-weak'), rc('fg-neutral'), true)}</Verdict>
        <Verdict ok note="비활성은 마우스를 올려도 그대로다">{disabledBtn(false)}</Verdict>
        <Verdict ok={false} note="비활성에 호버 색이 생기면 누를 수 있는 것처럼 보인다">{disabledBtn(true)}</Verdict>
      </div>
    </Figure>
  );
}
