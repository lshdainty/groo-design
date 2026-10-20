// Field 페이지의 그림 — specs/components/field.md 의 `[그림: …](../../site/components/specs/field.tsx#<id>)` 자리.
// Field · 입력칸은 field · input · textarea.yaml 을 푼 값(textFieldLook)으로, 화면 예시는 kit 의 Desk · HR 화면 조각으로 그린다.
// 휴대폰 화면 안의 칸은 large, 데스크톱 웹 창 안의 칸은 medium 으로 고정해 그린다(반응형은 사이트 폭이 아니라 그 화면의 폭을 따른다).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { selectBoxLook } from './select-box-look';
import { SelectBoxGroupView } from './select-box-view';
import { textFieldLook } from './text-field-look';
import { FieldPlayground } from './text-field-playground';
import { TfFieldView, TfInputView, TfLiveField, TfSubmitDemo, TfTextareaView } from './text-field-view';
import { AlertBox, Phone, Row, Verdict, WebDialog, WebWindow, rc, type Mode } from './kit';

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
// 폼 — Field 를 form.gapY 간격으로 쌓는다
function Form({ children, gap }: { children: ReactNode; gap?: number }) {
  return (
    <div className="flex flex-col" style={{ gap: gap ?? look().field.form.gapY }}>
      {children}
    </div>
  );
}
const cta = (label: string, mode: Mode, variant = 'neutralSolid', state: 'enabled' | 'disabled' = 'enabled', brand: 'desk' | 'hr' = 'desk') => (
  <ButtonView look={buttonLook({ variant, size: 'large' }, brand)} mode={mode} label={label} fill state={state} />
);
const exampleAction = (mode: Mode = 'auto') => <ButtonView look={buttonLook({ variant: 'ghost', ghostColor: 'neutralSubtle', size: 'xsmall', flush: 'right' })} mode={mode} label="예시 보기" flush="right" />;

// 휴대폰 화면 — 흰 바탕, 아래에 CTA
function Screen({ title, children, mode = 'auto', scale = 0.62, h = 640, bottom }: { title: string; children: ReactNode; mode?: Mode; scale?: number; h?: number; bottom?: ReactNode }) {
  return (
    <Phone title={title} mode={mode} scale={scale} h={h} bg="bg-layer-default" bottom={bottom}>
      <div className="flex flex-col px-6 pt-4">{children}</div>
    </Phone>
  );
}

// Field + 한 줄 입력칸(멈춘 그림) — 화면 예시용
function F({
  mode = 'auto',
  size = 'large',
  label,
  value,
  placeholder,
  indicator,
  description,
  error,
  count,
  max,
  suffix,
  state,
  weight,
  action,
}: {
  mode?: Mode;
  size?: 'large' | 'medium';
  label?: string;
  value?: string;
  placeholder?: string;
  indicator?: 'required' | 'optional';
  description?: string;
  error?: string;
  count?: number;
  max?: number;
  suffix?: string;
  state?: 'enabled' | 'focused' | 'invalid' | 'invalid-focused' | 'disabled' | 'readonly';
  weight?: 'medium' | 'bold';
  action?: ReactNode;
}) {
  const lk = look();
  return (
    <TfFieldView look={lk.field} mode={mode} label={label} labelWeight={weight} indicator={indicator} description={description} errorMessage={error} invalid={!!error} max={max} count={count} headerAction={action}>
      <TfInputView look={lk.input} mode={mode} size={size} state={state ?? (error ? 'invalid' : 'enabled')} value={value} placeholder={placeholder} suffix={suffix} />
    </TfFieldView>
  );
}
// Field + 여러 줄 입력칸(멈춘 그림)
function FT({ mode = 'auto', size = 'large', label, value, placeholder, indicator, count, max, error, h }: { mode?: Mode; size?: 'large' | 'medium'; label: string; value?: string; placeholder?: string; indicator?: 'required' | 'optional'; count?: number; max?: number; error?: string; h?: number }) {
  const lk = look();
  return (
    <TfFieldView look={lk.field} mode={mode} label={label} indicator={indicator} max={max} count={count} errorMessage={error} invalid={!!error}>
      <TfTextareaView look={lk.textarea} input={lk.input} mode={mode} size={size} state={error ? 'invalid' : 'enabled'} value={value} placeholder={placeholder} autoSize={h === undefined} height={h} />
    </TfFieldView>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-start gap-4">
      <Screen title="거래 추가" mode="light" bottom={cta('저장', 'light')}>
        <Form>
          <F mode="light" label="금액" value="12,000" suffix="원" />
          <F mode="light" label="내용" value="점심 식사" />
          <FT mode="light" label="메모" indicator="optional" placeholder="예: 팀 점심, 회식 등" max={100} count={0} />
        </Form>
      </Screen>
      <Screen title="카테고리 추가" mode="dark" bottom={cta('추가', 'dark')}>
        <Form>
          <F mode="dark" label="카테고리 이름" value="반려동물" error="같은 이름의 카테고리가 있어요." max={12} count={4} action={exampleAction('dark')} />
        </Form>
      </Screen>
      </div>
      <WebWindow mode="light" w={600} h={480} url="hr.groo.app">
        <WebDialog
          mode="light"
          brand="hr"
          title="공지 작성"
          footer={
            <div className="ml-auto flex gap-2">
              <ButtonView look={buttonLook({ variant: 'neutralWeak', size: 'small' }, 'hr')} mode="light" label="취소" state="enabled" />
              <ButtonView look={buttonLook({ variant: 'brandSolid', size: 'small' }, 'hr')} mode="light" label="등록" state="enabled" />
            </div>
          }
        >
          <Form gap={20}>
            <F mode="light" size="medium" label="제목" value="10월 사내 행사 안내" max={100} count={11} />
            <FT mode="light" size="medium" label="본문" value={'10월 24일(금) 오후 3시부터 2층 라운지에서\n가을 사내 행사가 열려요.'} max={1000} count={45} />
          </Form>
        </WebDialog>
      </WebWindow>
    </div>
  </Figure>
);

const Playground: Fig = () => <FieldPlayground look={look()} action={buttonLook({ variant: 'ghost', ghostColor: 'neutralSubtle', size: 'xsmall', flush: 'right' })} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = look();
  const mark: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, background: MARK, borderRadius: 4 };
  const Tag = ({ n, t }: { n: string; t: string }) => (
    <span className="flex items-center gap-1.5 text-[12px] pk-muted">
      <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
        {n}
      </span>
      {t}
    </span>
  );
  return (
    <Figure caption={caption}>
      <div className="rounded-xl pk-surface px-8 py-10">
        <div className="relative w-[320px]" style={{ marginRight: 240 }}>
          <TfFieldView look={lk.field} label="카테고리 이름" indicator="required" description="목록과 통계에 이 이름으로 보여요." max={12} count={4} headerAction={exampleAction()} marks={{ header: mark, input: mark, footer: mark }}>
            <TfInputView look={lk.input} size="large" state="enabled" value="반려동물" />
          </TfFieldView>
          {(() => {
            // 부위의 가운데 — 머리(라벨 줄 높이) · 입력(large 높이) · 꼬리(설명 줄 높이), 사이는 Field 의 간격
            const g = lk.field.gap;
            const head = parseFloat(lk.field.label.text.lineHeight);
            const input = lk.input.sizes.outline.large.minHeight;
            const foot = parseFloat(lk.field.description.text.lineHeight);
            const mids = [head / 2, head + g + input / 2, head + g + input + g + foot / 2];
            const tags: [string, string][] = [
              ['ⓐ', 'Header — 라벨 · 필수 점 · 보조 액션'],
              ['ⓑ', 'Input — 입력칸'],
              ['ⓒ', 'Footer — 설명 · 글자 수'],
            ];
            return tags.map(([n, t], i) => (
              <span key={n} className="absolute left-[calc(100%+24px)] -translate-y-1/2 whitespace-nowrap" style={{ top: mids[i] }}>
                <Tag n={n} t={t} />
              </span>
            ));
          })()}
        </div>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Header: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="카테고리 이름" value="반려동물" />
        </Surface>
        <Cap strong="medium 500">기본</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="얼마를 썼나요?" weight="bold" value="12,000" suffix="원" />
        </Surface>
        <Cap strong="bold 700">칸 이름이 그 구역의 제목일 때</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="이름" indicator="required" value="김포레" />
        </Surface>
        <Cap strong="필수 점">빨간 점 6 — 필수 칸에만</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="휴대폰 번호" indicator="optional" placeholder="010-0000-0000" />
        </Surface>
        <Cap strong={'"선택"'}>14 · 옅은 회색 — 선택 칸에만</Cap>
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Surface className="mx-auto w-full max-w-[400px]">
          <F label="카테고리 이름" placeholder="예: 반려동물, 부수입" action={exampleAction()} />
        </Surface>
        <Cap strong="보조 액션">작은 텍스트 버튼 — 머리 높이를 바꾸지 않는다</Cap>
      </div>
    </div>
  </Panel>
);

const InputSlot: Fig = ({ caption }) => {
  const lk = look();
  const sb = selectBoxLook('desk');
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Surface>
            <F label="내용" value="점심 식사" />
          </Surface>
          <Cap strong="Input">한 줄</Cap>
        </div>
        <div className="flex flex-col gap-2">
          <Surface>
            <FT label="메모" value={'팀 점심 — 다음 달에\n정산하기로 했다'} max={100} count={21} />
          </Surface>
          <Cap strong="Textarea">여러 줄</Cap>
        </div>
        <div className="flex flex-col gap-2">
          <Surface>
            <TfFieldView look={lk.field} label="종료" description="정한 날까지 반복해요.">
              <SelectBoxGroupView
                look={sb}
                kind="radio"
                live={false}
                value="none"
                ariaLabel="종료"
                boxes={[
                  { value: 'none', title: '무기한' },
                  { value: 'count', title: '횟수 지정' },
                ]}
              />
            </TfFieldView>
          </Surface>
          <Cap strong="Select Box 묶음">라벨이 묶음의 이름</Cap>
        </div>
      </div>
    </Panel>
  );
};

const Footer: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="아이디" value="groo" description="영문 · 숫자 20자까지" max={20} count={6} />
        </Surface>
        <Cap strong="설명">14 · 옅은 회색</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="아이디" value="groo" error="이미 쓰고 있는 아이디예요." max={20} count={6} />
        </Surface>
        <Cap strong="오류">설명 자리를 대신한다 · 글자 수도 빨갛다</Cap>
      </div>
      <div className="flex flex-col gap-2">
        <Surface>
          <F label="아이디" placeholder="영문 · 숫자" description="영문 · 숫자 20자까지" max={20} count={0} />
        </Surface>
        <Cap strong="글자 수">비면 옅게 · 최대가 있는 칸만</Cap>
      </div>
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
const LayoutGuide: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Panel caption={caption}>
      <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
        <Verdict ok note="Field 사이 24 · 짧은 두 칸은 16 간격으로 나란히">
          <div className="w-[300px]">
            <Form>
              <F label="대출 이름" value="전세 자금" />
              <div className="flex" style={{ gap: lk.field.form.gapX }}>
                <F label="금리" value="3.8" suffix="%" />
                <F label="기간" value="24" suffix="개월" />
              </div>
              <F label="대출금" value="120,000,000" suffix="원" />
            </Form>
          </div>
        </Verdict>
        <Verdict ok={false} note="형식이 정해진 값(전화번호)을 칸 셋으로 나눈다 — 한 칸에서 하이픈을 맞춰 준다">
          <div className="w-[300px]">
            <TfFieldView look={lk.field} label="휴대폰 번호">
              <div className="flex items-center gap-2">
                <TfInputView look={lk.input} size="large" state="enabled" value="010" />
                <span className="pk-muted">-</span>
                <TfInputView look={lk.input} size="large" state="enabled" value="1234" />
                <span className="pk-muted">-</span>
                <TfInputView look={lk.input} size="large" state="enabled" value="5678" />
              </div>
            </TfFieldView>
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

const SubmitGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
      <Verdict ok note="버튼은 켜 두고, 누르면 빈 칸마다 오류 — 첫 오류 칸으로 포커스">
        <Screen title="휴가 신청" mode="light" scale={0.52} h={560} bottom={cta('신청', 'light', 'brandSolid', 'enabled', 'hr')}>
          <Form>
            <F mode="light" label="제목" placeholder="예: 개인 사유" error="제목을 입력해주세요." state="invalid-focused" />
            <FT mode="light" label="휴가 사유" placeholder="예: 가족 행사 참석" error="휴가 사유를 입력해주세요." max={1000} count={0} />
          </Form>
        </Screen>
      </Verdict>
      <Verdict ok={false} note="다 채울 때까지 버튼만 꺼 두면 무엇이 빠졌는지 알 수 없다">
        <Screen title="휴가 신청" mode="light" scale={0.52} h={560} bottom={cta('신청', 'light', 'brandSolid', 'disabled', 'hr')}>
          <Form>
            <F mode="light" label="제목" value="개인 사유" />
            <FT mode="light" label="휴가 사유" placeholder="예: 가족 행사 참석" max={1000} count={0} />
          </Form>
        </Screen>
      </Verdict>
    </div>
  </Panel>
);

const InlineGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto flex w-full max-w-[360px] flex-col gap-2">
      <Surface>
        <Form>
          <F label="새 비밀번호" value="••••••••••" description="영문 · 숫자 · 기호를 섞어 10자 이상" />
          <F label="새 비밀번호 확인" value="•••••••••" error="비밀번호가 서로 달라요." />
          <F label="현재 비밀번호" state="focused" />
        </Form>
      </Surface>
      <Cap>확인 칸을 떠나 다음 칸으로 가는 순간 알린다 — 입력하는 동안에는 띄우지 않는다</Cap>
    </div>
  </Panel>
);

const LeaveGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Phone
          title="거래 추가"
          mode="light"
          scale={0.56}
          h={600}
          bg="bg-layer-default"
          overlay={
            <AlertBox mode="light" title="작성한 내용이 사라져요" body="지금 나가면 쓴 내용은 저장되지 않아요." cancel="계속 작성" confirm="나가기" />
          }
        >
          <div className="flex flex-col px-6 pt-4">
            <Form>
              <F mode="light" label="금액" value="12,000" suffix="원" />
              <F mode="light" label="내용" value="점심" />
            </Form>
          </div>
        </Phone>
        <Cap strong="바뀐 값이 있으면">나가기 전에 묻는다</Cap>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Phone title="가계부" mode="light" scale={0.56} h={600} back={false} bg="bg-layer-default">
          <div className="flex flex-col px-6 pt-2">
            <Row title="점심 식사" sub="식비 · 오늘" amount="−12,000원" hue="orange" mode="light" />
            <Row title="버스" sub="교통 · 오늘" amount="−1,500원" hue="blue" mode="light" />
            <Row title="월급" sub="수입 · 10월 1일" amount="+3,200,000원" hue="green" mode="light" />
          </div>
        </Phone>
        <Cap strong="바뀐 값이 없거나 자동 저장이면">묻지 않고 바로 닫는다</Cap>
      </div>
    </div>
  </Panel>
);

const IndicatorGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid w-full max-w-[900px] gap-4 md:grid-cols-3">
      <Verdict ok note='셋 중 둘이 필수 — 선택 칸에만 "선택"'>
        <div className="w-[240px]">
          <Form gap={16}>
            <F label="이름" value="김포레" />
            <F label="휴대폰 번호" indicator="optional" placeholder="010-0000-0000" />
            <F label="이메일" value="groo@groo.app" />
          </Form>
        </div>
      </Verdict>
      <Verdict ok note="셋 중 하나가 필수 — 필수 칸에만 점">
        <div className="w-[240px]">
          <Form gap={16}>
            <F label="이름" indicator="required" value="김포레" />
            <F label="소개" placeholder="예: 가계부를 매일 쓰는 직장인" />
            <F label="웹사이트" placeholder="https://" />
          </Form>
        </div>
      </Verdict>
      <Verdict ok={false} note={'한 폼에 점과 "선택" 을 섞는다'}>
        <div className="w-[240px]">
          <Form gap={16}>
            <F label="이름" indicator="required" value="김포레" />
            <F label="휴대폰 번호" indicator="optional" placeholder="010-0000-0000" />
            <F label="이메일" indicator="required" value="groo@groo.app" />
          </Form>
        </div>
      </Verdict>
    </div>
  </Panel>
);

const TextGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">
      <Verdict ok note="라벨은 명사형, 오류는 무엇을 하면 되는지">
        <div className="w-[280px]">
          <F label="휴대폰 번호" value="010-1234" error="휴대폰 번호 10~11자리로 입력해주세요." />
        </div>
      </Verdict>
      <Verdict ok={false} note="placeholder 를 라벨 대신 쓰고, 오류는 이유만 말한다">
        <div className="w-[280px]">
          <F value="010-1234" error="잘못된 입력입니다." />
        </div>
      </Verdict>
    </div>
  </Panel>
);

const FlowGuide: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Screen title="거래 추가" mode="light" scale={0.56} h={600} bottom={cta('저장', 'light')}>
            <Form>
              <F mode="light" label="금액" value="12,000" suffix="원" />
              <F mode="light" label="내용" value="점심 식사" />
              <FT mode="light" label="메모" indicator="optional" placeholder="예: 팀 점심, 회식 등" max={100} count={0} />
            </Form>
          </Screen>
          <Cap strong="단일 화면 폼">만들기 · 고치기를 같은 구성으로</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Screen title="" mode="light" scale={0.56} h={600} bottom={cta('다음', 'light')}>
            <TfFieldView look={lk.field} mode="light" label="얼마를 썼나요?" labelWeight="bold">
              <TfInputView look={lk.input} mode="light" variant="underline" size="large" state="focused" value="12,000" suffix="원" />
            </TfFieldView>
          </Screen>
          <Cap strong="단계별 폼">한 단계에 입력 하나 — 밑줄형</Cap>
        </div>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
function Live({ children, w = 360 }: { children: ReactNode; w?: number }) {
  return (
    <Panel>
      <Surface className="mx-auto w-full" style={{ maxWidth: w }}>
        {children}
      </Surface>
    </Panel>
  );
}
const ExBasic: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveField field={lk.field} input={lk.input} label="카테고리 이름" description="목록과 통계에 이 이름으로 보여요." max={12} inputProps={{ placeholder: '예: 반려동물, 부수입', clearable: true }} />
    </Live>
  );
};
const ExIndicator: Fig = () => {
  const lk = look();
  return (
    <Live>
      <Form>
        <TfLiveField field={lk.field} input={lk.input} label="이름" indicator="required" inputProps={{ defaultValue: '김포레' }} />
        <TfLiveField field={lk.field} input={lk.input} label="휴대폰 번호" indicator="optional" inputProps={{ placeholder: '010-0000-0000', inputMode: 'tel' }} />
      </Form>
    </Live>
  );
};
const ExError: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveField field={lk.field} input={lk.input} label="아이디" description="영문 · 숫자 20자까지" max={20} invalid errorMessage="이미 쓰고 있는 아이디예요." inputProps={{ defaultValue: 'groo' }} />
    </Live>
  );
};
const ExAction: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfLiveField field={lk.field} input={lk.input} label="카테고리 이름" headerAction={exampleAction()} inputProps={{ placeholder: '예: 반려동물, 부수입' }} />
    </Live>
  );
};
const ExGroup: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfFieldView look={lk.field} label="종료" invalid errorMessage="종료를 골라주세요.">
        <SelectBoxGroupView
          look={selectBoxLook('desk')}
          kind="radio"
          ariaLabel="종료"
          boxes={[
            { value: 'none', title: '무기한', description: '중지할 때까지 계속 반복' },
            { value: 'count', title: '횟수 지정', description: '정한 횟수만큼 반복' },
          ]}
        />
      </TfFieldView>
    </Live>
  );
};
const ExForm: Fig = () => {
  const lk = look();
  return (
    <Live>
      <TfSubmitDemo
        field={lk.field}
        input={lk.input}
        textarea={lk.textarea}
        submit="신청"
        cta={buttonLook({ variant: 'brandSolid', size: 'large' }, 'hr')}
        fields={[
          { name: 'title', label: '제목', placeholder: '예: 개인 사유', error: '제목을 입력해주세요.' },
          { name: 'reason', label: '휴가 사유', placeholder: '예: 가족 행사 참석', multiline: true, max: 1000, error: '휴가 사유를 입력해주세요.' },
        ]}
      />
    </Live>
  );
};

export const fieldFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  header: Header,
  'input-slot': InputSlot,
  footer: Footer,
  'layout-guide': LayoutGuide,
  'submit-guide': SubmitGuide,
  'inline-guide': InlineGuide,
  'leave-guide': LeaveGuide,
  'indicator-guide': IndicatorGuide,
  'text-guide': TextGuide,
  'flow-guide': FlowGuide,
  'ex-basic': ExBasic,
  'ex-indicator': ExIndicator,
  'ex-error': ExError,
  'ex-action': ExAction,
  'ex-group': ExGroup,
  'ex-form': ExForm,
};
