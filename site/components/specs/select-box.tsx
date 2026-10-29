// Select Box 페이지의 그림 — specs/components/select-box.md 의 `[그림: …](../../site/components/specs/select-box.tsx#<id>)` 자리.
// 상자는 select-box.yaml 을 푼 값(selectBoxLook)으로, 화면 예시는 kit 의 Desk · HR 화면 조각으로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Hash } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { sbGroupVars, selectBoxLook, SB_STATES, type BoxSpec, type SbState } from './select-box-look';
import { FooterContent, SelectBoxGroupView, type SelectBoxGroupViewProps } from './select-box-view';
import { SelectBoxPlayground } from './select-box-playground';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { checkLook } from './checkbox-look';
import { CheckboxView } from './checkbox-view';
import { RadioView } from './radio-group-view';
import { selectLook } from './select-look';
import { formatDay } from './date-shared';
import { Phone, Verdict, rc, type Mode } from './kit';
import { RolesLive } from './finish-play';
import { HR_USER } from './finish-shared';
import { Fit } from './finish-view';
import { textFieldLook } from './text-field-look';

type Fig = (p: { caption?: string }) => ReactNode;
const look = () => selectBoxLook('desk');

// 묶음 하나 — 서버 그림에서 브라우저 그림(SelectBoxGroupView)으로
function G({ brand = 'desk', ...p }: Omit<SelectBoxGroupViewProps, 'look'> & { brand?: 'desk' | 'hr' }) {
  return <SelectBoxGroupView look={selectBoxLook(brand)} {...p} />;
}

function Cap({ children, strong }: { children?: ReactNode; strong?: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
      {strong && <b className="text-[13px] pk-text">{strong}</b>}
      {children}
    </span>
  );
}
// 흰 판 — 상자는 흰 바탕 위에 둔다. 포커스 링(상자 바깥 4px)이 잘리지 않게 여백을 둔다
function Surface({ mode = 'auto', children, className = '', style }: { mode?: Mode; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-xl p-4 ${className}`} style={{ background: rc('bg-layer-default', mode), ...style }}>
      {children}
    </div>
  );
}
function Cell({ label, children, mode = 'auto' }: { label?: ReactNode; children: ReactNode; mode?: Mode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode}>{children}</Surface>
      {label && <Cap>{label}</Cap>}
    </div>
  );
}
// 묶음의 칸 이름 — 묶음 바로 위(aria-labelledby 로 잇는다)
function Label({ children, mode = 'auto', id }: { children: ReactNode; mode?: Mode; id?: string }) {
  return (
    <span id={id} className="mb-2 block text-[13px] font-bold" style={{ color: rc('fg-neutral-muted', mode) }}>
      {children}
    </span>
  );
}
const STATE_KO: Record<SbState, string> = { enabled: '기본', hovered: '호버', focused: '포커스', pressed: '누름', disabled: '비활성' };

// ── 화면 예시의 선택지 ────────────────────────────────────
// Desk — 반복 거래 종료(고르면 반복 횟수 · 종료일 칸이 열린다)
const END_DAY = { y: 2027, m: 3, d: 31 };
const END: BoxSpec[] = [
  { value: 'none', title: '무기한', description: '중지할 때까지 계속 반복' },
  { value: 'count', title: '횟수 지정', description: '정한 횟수만큼 반복', footer: { before: '총', value: '12', after: '회', aria: '반복 횟수' } },
  // 종료일은 타이핑하지 않고 달력으로 고른다 — Input Button(input-button.md), 값은 Date Picker 의 표시 형식
  { value: 'date', title: '종료일 지정', description: '정한 날까지 반복', footer: { button: formatDay(END_DAY), aria: '종료일', look: selectLook('desk') } },
];
// Desk — 내보내기 파일 형식 · 기간
const FORMAT: BoxSpec[] = [
  { value: 'csv', title: 'CSV', description: '구글시트', prefix: { icon: 'file-text' } },
  { value: 'xlsx', title: 'Excel', description: '엑셀', prefix: { icon: 'sheet' } },
  { value: 'json', title: 'JSON', description: '백업용', prefix: { icon: 'braces' } },
];
const PERIOD: BoxSpec[] = [
  { value: 'month', title: '이번 달', prefix: { icon: 'calendar' } },
  { value: 'last3', title: '최근 3개월', prefix: { icon: 'calendar-range' } },
  { value: 'year', title: '올해', prefix: { icon: 'calendar-days' } },
  { value: 'custom', title: '직접 지정', prefix: { icon: 'calendar-clock' } },
];
// Desk — 필터의 거래 종류(여럿)
const TYPES: BoxSpec[] = [
  { value: 'expense', title: '지출', prefix: { icon: 'arrow-up-right' }, checked: true },
  { value: 'income', title: '수입', prefix: { icon: 'arrow-down-left' }, checked: true },
  { value: 'transfer', title: '이체', prefix: { icon: 'arrow-left-right' } },
];
// Desk — 더치페이 분배 방식
const SPLIT: BoxSpec[] = [
  { value: 'even', title: 'N분의 1', description: '모두 똑같이 나눠요', prefix: { icon: 'divide' } },
  { value: 'ratio', title: '비율', description: '사람마다 비율을 정해요', prefix: { icon: 'percent' } },
  { value: 'each', title: '개별 금액', description: '사람마다 금액을 적어요', prefix: { icon: 'coins' } },
];
// HR — 역할의 휴가 권한(여럿)
const PERM: BoxSpec[] = [
  { value: 'view', title: '휴가 조회', description: '본인 휴가 내역을 조회할 수 있는 권한입니다.', checked: true },
  { value: 'apply', title: '휴가 신청', description: 'OT, 경조 휴가 등 휴가를 신청할 수 있는 권한입니다.' },
  { value: 'approve', title: '휴가 승인', description: '팀원의 휴가 신청을 승인할 수 있는 권한입니다.' },
];
// HR — 휴가 정책의 가변 부여 여부(고정이면 부여 시간 칸)
const FLEX: BoxSpec[] = [
  { value: 'fixed', title: '고정 시간', description: '정책에 등록된 부여 시간을 사용합니다.', footer: { before: '부여 시간', value: '8', after: '시간', width: 64, aria: '부여 시간' } },
  { value: 'flex', title: '가변 시간', description: '사용자 또는 관리자가 입력한 시간 값으로 부여합니다.' },
];
// Desk — 계좌 종류(2열 높이 맞춤)
const ACCOUNT: BoxSpec[] = [
  { value: 'cash', title: '입출금', description: '월급 · 생활비', prefix: { icon: 'wallet' } },
  { value: 'saving', title: '저축', description: '적금 · 예금', prefix: { icon: 'piggy-bank' } },
  { value: 'invest', title: '투자', description: '증권 · 연금', prefix: { icon: 'trending-up' } },
  { value: 'loan', title: '대출', description: '빌린 돈 · 이자 · 갚을 날', prefix: { icon: 'landmark' } },
  { value: 'etc', title: '기타', description: '포인트 · 상품권', prefix: { icon: 'gift' } },
];
// Desk — 자산 추가 1단계 "무엇을 추가할까요?" 의 종류 아홉(계좌 여섯 · 카드 둘 · 투자 하나) — 2열 · 앞 아이콘 · 컨트롤 없음
const KINDS: { label: string; boxes: BoxSpec[] }[] = [
  {
    label: '계좌',
    boxes: [
      { value: 'checking', title: '입출금', prefix: { icon: 'landmark' } },
      { value: 'deposit', title: '예금', prefix: { icon: 'piggy-bank' } },
      { value: 'savings', title: '적금', prefix: { icon: 'calendar-days' } },
      { value: 'overdraft', title: '마이너스 통장', prefix: { icon: 'percent' } },
      { value: 'cash', title: '현금', prefix: { icon: 'wallet' } },
      { value: 'loan', title: '대출', prefix: { icon: 'coins' } },
    ],
  },
  {
    label: '카드',
    boxes: [
      { value: 'credit', title: '신용카드', prefix: { icon: 'credit-card' } },
      { value: 'check', title: '체크카드', prefix: { icon: 'credit-card' } },
    ],
  },
  { label: '투자', boxes: [{ value: 'invest', title: '투자', prefix: { icon: 'trending-up' } }] },
];
// Desk — 홈에 둘 요약(여럿 · 최대 2)
const SUMMARY: BoxSpec[] = [
  { value: 'spend', title: '이번 달 지출', prefix: { icon: 'wallet' } },
  { value: 'budget', title: '예산', prefix: { icon: 'piggy-bank' } },
  { value: 'asset', title: '자산', prefix: { icon: 'landmark' } },
  { value: 'due', title: '다가오는 결제', prefix: { icon: 'calendar-clock' } },
];

// 휴대폰 화면 — 흰 바탕, 아래에 반영 버튼(고른 값은 버튼으로 반영한다)
function Screen({ title, children, mode = 'auto', scale = 0.56, h = 600, cta }: { title: string; children: ReactNode; mode?: Mode; scale?: number; h?: number; cta?: string }) {
  return (
    <Phone title={title} mode={mode} scale={scale} h={h} bg="bg-layer-default" bottom={cta ? <ButtonView look={buttonLook({ variant: 'neutralSolid', size: 'large' })} mode={mode} label={cta} fill state="enabled" /> : undefined}>
      <div className="flex flex-col gap-6 px-6 pt-3">{children}</div>
    </Phone>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-3">
      <Screen title="반복 설정" mode="light" cta="저장">
        <div>
          <Label mode="light">종료</Label>
          <G kind="radio" boxes={END} value="count" mode="light" live={false} ariaLabel="종료" />
        </div>
      </Screen>
      <Screen title="내보내기" mode="dark" cta="내보내기">
        <div>
          <Label mode="dark">파일 형식</Label>
          <G kind="radio" control="none" columns={3} boxes={FORMAT} value="csv" mode="dark" live={false} ariaLabel="파일 형식" />
        </div>
        <div>
          <Label mode="dark">기간</Label>
          <G kind="radio" control="none" columns={2} boxes={PERIOD.map((b) => ({ ...b, prefix: undefined }))} value="month" mode="dark" live={false} ariaLabel="기간" />
        </div>
      </Screen>
      <Screen title="필터" mode="light" cta="적용하기">
        <div>
          <Label mode="light">거래 종류</Label>
          <G kind="check" control="none" columns={3} boxes={TYPES} mode="light" live={false} ariaLabel="거래 종류" />
        </div>
        <div>
          <Label mode="light">분배 방식</Label>
          <G kind="radio" boxes={SPLIT.slice(0, 2)} value="even" mode="light" live={false} ariaLabel="분배 방식" />
        </div>
      </Screen>
    </div>
  </Figure>
);

const Playground: Fig = () => <SelectBoxPlayground looks={{ desk: selectBoxLook('desk'), hr: selectBoxLook('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
// 번호 핀 — 위 · 아래 · 오른쪽으로 뽑는다(펼침이 바로 아래에 있어 설명은 오른쪽으로)
function Pin({ n, children, side = 'top', className = '' }: { n: string; children: ReactNode; side?: 'top' | 'bottom' | 'right'; className?: string }) {
  const at = { top: '-top-10 left-1/2 -translate-x-1/2 flex-col', bottom: '-bottom-10 left-1/2 -translate-x-1/2 flex-col-reverse', right: '-right-9 top-1/2 -translate-y-1/2 flex-row-reverse' }[side];
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span className={`absolute z-[2] flex items-center ${at}`}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
          {n}
        </span>
        <span className={side === 'right' ? 'h-px w-4' : 'h-4 w-px'} style={{ background: MARK_LINE }} />
      </span>
      {children}
    </span>
  );
}
const Anatomy: Fig = ({ caption }) => {
  const lk = look();
  const f = lk.faces.selected.light.enabled;
  const lay = lk.layouts.horizontal;
  const mark = (extra?: CSSProperties): CSSProperties => ({ outline: `1px dashed ${MARK_LINE}`, background: MARK, ...extra });
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-14 rounded-xl pk-surface px-6 pb-12 pt-16">
        <div className="psb w-[400px]" data-mode="auto" style={{ ...sbGroupVars(lk), position: 'relative', fontFamily: f.label.fontFamily, borderRadius: f.radius }}>
          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit', border: `${f.border.width}px solid ${rc('stroke-neutral-contrast')}` }} />
          <div className="flex justify-between" style={{ alignItems: lay.alignItems, gap: f.trigger.gap, padding: `${lay.pad.top}px ${lay.pad.right}px ${lay.pad.bottom}px ${lay.pad.left}px` }}>
            <span className="flex min-w-0 flex-1 items-center" style={{ gap: lay.content.gap }}>
              <Pin n="ⓐ">
                <span className="inline-flex" style={mark({ color: rc('fg-neutral') })}>
                  <Hash aria-hidden size={f.prefix.size} strokeWidth={2} />
                </span>
              </Pin>
              <span className="flex min-w-0 flex-col items-start" style={{ marginRight: 'auto', gap: f.body.gap, paddingRight: f.body.padRight }}>
                <Pin n="ⓑ">
                  <span style={{ fontSize: f.label.fontSize, lineHeight: f.label.lineHeight, fontWeight: f.label.fontWeight, color: rc('fg-neutral'), ...mark() }}>횟수 지정</span>
                </Pin>
                <Pin n="ⓒ" side="right">
                  <span style={{ fontSize: f.description.fontSize, lineHeight: f.description.lineHeight, color: rc('fg-neutral-muted'), ...mark() }}>정한 횟수만큼 반복</span>
                </Pin>
              </span>
            </span>
            <Pin n="ⓓ">
              <span className="inline-flex rounded-full" style={mark()}>
                <RadioView look={lk.marks.radio} checked="checked" state="enabled" ariaLabel="횟수 지정" />
              </span>
            </Pin>
          </div>
          <div style={{ padding: `0 ${f.footer.padX}px ${f.footer.padBottom}px` }}>
            <Pin n="ⓔ" side="bottom">
              <span className="inline-flex" style={mark()}>
                <FooterContent spec={{ before: '총', value: '12', after: '회', aria: '반복 횟수' }} look={lk} mode="auto" />
              </span>
            </Pin>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 text-center text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Prefix'],
            ['ⓑ', 'Title'],
            ['ⓒ', 'Description'],
            ['ⓓ', 'Control'],
            ['ⓔ', 'Footer'],
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
const Control: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Cell label={<><b className="pk-text">라디오</b> RadioSelectBox — 하나 고르기</>}>
          <G kind="radio" boxes={END.slice(0, 2).map((b) => ({ ...b, footer: undefined }))} value="count" ariaLabel="종료" />
        </Cell>
        <Cell label={<><b className="pk-text">칸 없는 체크</b> CheckSelectBox — 여럿 고르기</>}>
          <G kind="check" boxes={PERM.slice(0, 2)} ariaLabel="휴가 권한" brand="hr" />
        </Cell>
      </div>
      <div className="mx-auto w-full max-w-[400px]">
        <Cell label={<><b className="pk-text">없음</b> control="none" — 테두리만으로 고른 것이 보일 때(좁은 3열 같은)</>}>
          <G kind="radio" control="none" columns={3} boxes={FORMAT} value="csv" ariaLabel="파일 형식" />
        </Cell>
      </div>
    </div>
  </Panel>
);

// 화면 폭(360 − 여백 24 × 2)에서 그린다 — 열 수마다 상자 폭이 실제와 같다
const Wide = ({ children }: { children: ReactNode }) => <div className="w-[344px] max-w-full">{children}</div>;
const Layout: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap justify-center gap-6">
      <Wide>
        <Cell label={<><b className="pk-text">1열 · 가로형</b> 앞 · 본문 · 컨트롤이 한 줄, 세로 가운데</>}>
          <G kind="radio" boxes={SPLIT} value="even" ariaLabel="분배 방식" />
        </Cell>
      </Wide>
      <Wide>
        <Cell label={<><b className="pk-text">2열 · 세로형</b> 앞이 위, 컨트롤은 위 오른쪽</>}>
          <G kind="radio" columns={2} boxes={PERIOD} value="month" ariaLabel="기간" />
        </Cell>
      </Wide>
      <Wide>
        <Cell label={<><b className="pk-text">3열 · 세로형</b> 좁으니 제목 · 짧은 설명만, 컨트롤은 없음</>}>
          <G kind="radio" control="none" columns={3} boxes={FORMAT} value="csv" ariaLabel="파일 형식" />
        </Cell>
      </Wide>
    </div>
  </Panel>
);

// 밀도 — 같은 종류 아홉을 기본 · 낮은 상자로. 여백 · 사이 값은 select-box.yaml(look)에서
function Kinds({ density, mode = 'auto' }: { density: 'default' | 'compact'; mode?: Mode }) {
  return (
    <div className="flex flex-col gap-3">
      {KINDS.map((g, i) => (
        <div key={g.label}>
          <Label mode={mode}>{g.label}</Label>
          <G kind="radio" control="none" columns={2} density={density} boxes={g.boxes} value={i === 0 ? 'checking' : undefined} ariaLabel={g.label} mode={mode} />
        </div>
      ))}
    </div>
  );
}
const Density: Fig = ({ caption }) => {
  const d = look().layouts.vertical;
  const c = look().compact;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Wide>
          <Cell label={<><b className="pk-text">기본 default</b> 위아래 {d.pad.top} · 앞 ↔ 글 {d.content.gap} — 선택지 2 ~ 4개 · 설명이 붙는 상자</>}>
            <Kinds density="default" />
          </Cell>
        </Wide>
        <Wide>
          <Cell label={<><b className="pk-text">낮은 상자 compact</b> 위아래 {c.pad.top} · 앞 ↔ 글 {c.content.gap} — 한 시트에 상자가 많을 때만(자산 종류 아홉). 좌우 {c.pad.left} · 앞 · 글자 · 열 · 줄 사이는 그대로</>}>
            <Kinds density="compact" />
          </Cell>
        </Wide>
      </div>
    </Panel>
  );
};

const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-[72px_1fr_1fr]">
      <span className="hidden sm:block" />
      <span className="hidden text-center text-[12px] font-bold pk-text sm:block">고르지 않음</span>
      <span className="hidden text-center text-[12px] font-bold pk-text sm:block">고름 selected</span>
      {SB_STATES.map((st) => (
        <div key={st} className="contents">
          <span className="self-center text-[12px] pk-text">
            {STATE_KO[st]}
            <br />
            <span className="font-mono text-[10px] pk-muted">{st}</span>
          </span>
          {[false, true].map((on) => (
            <Surface key={String(on)}>
              <G kind="radio" boxes={[{ value: 'count', title: '횟수 지정', description: '정한 횟수만큼 반복', prefix: { icon: 'hash' }, state: st, disabled: st === 'disabled' }]} value={on ? 'count' : undefined} ariaLabel={`${STATE_KO[st]} ${on ? '고름' : '고르지 않음'}`} />
            </Surface>
          ))}
        </div>
      ))}
    </div>
  </Panel>
);

const Live: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Surface>
        <Label id="sb-live-end">종료</Label>
        <G kind="radio" boxes={[END[0], END[1], { ...END[2], disabled: true }]} value="none" ariaLabelledby="sb-live-end" />
      </Surface>
      <Surface>
        <Label id="sb-live-perm">휴가 권한</Label>
        <G kind="check" boxes={[PERM[0], PERM[1], { ...PERM[2], disabled: true, checked: true }]} ariaLabelledby="sb-live-perm" brand="hr" />
      </Surface>
    </div>
  </Panel>
);

const Prefix: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap justify-center gap-6">
      <Wide>
        <Cell label={<><b className="pk-text">아이콘 22</b> 가로형 — 본문 왼쪽</>}>
          <G kind="radio" boxes={SPLIT.slice(0, 2)} value="even" ariaLabel="분배 방식" />
        </Cell>
      </Wide>
      <Wide>
        <Cell label={<><b className="pk-text">세로형</b> 아이콘이 위에 선다</>}>
          <G kind="radio" columns={2} boxes={[{ ...SPLIT[0], description: '똑같이 나눠요' }, { ...SPLIT[1], description: '비율대로 나눠요' }]} value="even" ariaLabel="분배 방식" />
        </Cell>
      </Wide>
      <Wide>
        <Cell label={<><b className="pk-text">없음</b> 제목부터</>}>
          <G kind="radio" boxes={SPLIT.slice(0, 2).map((b) => ({ ...b, prefix: undefined }))} value="even" ariaLabel="분배 방식" />
        </Cell>
      </Wide>
    </div>
  </Panel>
);

const Footer: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Cell label="고르기 전 — 칸이 숨어 있다(Tab 도 닿지 않는다)">
        <G kind="radio" boxes={END} value="none" ariaLabel="종료" />
      </Cell>
      <Cell label="횟수 지정을 고르면 그 상자 아래로 칸이 열린다">
        <G kind="radio" boxes={END} value="count" ariaLabel="종료" />
      </Cell>
    </div>
  </Panel>
);

const Group: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto max-w-[420px]">
      <Surface>
        <Label id="sb-group-flex">가변 부여 여부</Label>
        <G kind="radio" boxes={FLEX} ariaLabelledby="sb-group-flex" brand="hr" />
        <span className="mt-2 block text-[12px]" style={{ color: rc('fg-critical') }}>
          가변 부여 여부를 선택해 주세요.
        </span>
      </Surface>
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
// 이렇게 · 이렇게 하지 않는다 — 좁은 화면에서는 위아래로(상자는 폭이 있어야 줄바꿈이 실제와 같다). 2열 상자는 더 넓을 때만 나란히
const Pair = ({ children, wide }: { children: ReactNode; wide?: boolean }) => (
  <div className={`flex w-full max-w-[680px] flex-col gap-4 ${wide ? 'xl:flex-row' : 'lg:flex-row'}`}>{children}</div>
);
// 화면 폭으로 그려 줄여 보인다 — 2열 상자를 나란히 견줄 때(글자 줄바꿈이 실제와 같다)
function PhoneWidth({ children }: { children: ReactNode }) {
  return (
    <Surface style={{ width: 344, maxWidth: '100%', zoom: 0.8 }} className="shrink-0">
      {children}
    </Surface>
  );
}
const ZONE = { fill: MARK, line: MARK_LINE };

const TouchGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="상자 전체가 누르는 영역(분홍) — 어디를 눌러도 고른다">
        <Surface className="w-full">
          <G kind="check" boxes={PERM.slice(0, 2)} zone={ZONE} ariaLabel="휴가 권한" brand="hr" />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="체크와 제목만 눌린다 — 설명이나 빈 자리를 누르면 아무 일도 없다">
        <Surface className="w-full">
          <G kind="check" boxes={PERM.slice(0, 2)} zone={ZONE} partialTarget ariaLabel="휴가 권한" brand="hr" />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const SubmitGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="상자로 고르고 내보내기 버튼으로 반영한다">
        <Screen title="내보내기" scale={0.62} h={560} cta="내보내기">
          <div>
            <Label>파일 형식</Label>
            <G kind="radio" control="none" columns={3} boxes={FORMAT} value="csv" ariaLabel="파일 형식" />
          </div>
          <div>
            <Label>기간</Label>
            <G kind="radio" control="none" columns={2} boxes={PERIOD.map((b) => ({ ...b, prefix: undefined }))} value="month" ariaLabel="기간" />
          </div>
        </Screen>
      </Verdict>
      <Verdict ok={false} note="상자를 누르는 순간 내보내기가 시작된다 — 잘못 누르면 되돌릴 수 없다. 실행은 버튼이다">
        <Screen title="내보내기" scale={0.62} h={560}>
          <div>
            <Label>파일 형식</Label>
            <G kind="radio" control="none" columns={3} boxes={FORMAT} ariaLabel="파일 형식" live={false} />
          </div>
          <span className="text-[13px]" style={{ color: rc('fg-neutral-muted') }}>
            누르면 바로 이번 달 거래를 내보내요
          </span>
        </Screen>
      </Verdict>
    </Pair>
  </Panel>
);

const ConciseGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="짧은 제목 · 한두 줄 설명 — 둘을 한눈에 견준다">
        <Surface className="w-full">
          <G kind="radio" boxes={FLEX.map((b) => ({ ...b, footer: undefined }))} value="fixed" ariaLabel="가변 부여 여부" brand="hr" />
        </Surface>
      </Verdict>
      <Verdict ok={false} note="설명을 길게 써서 견줄 것을 찾기 어렵다">
        <Surface className="w-full">
          <G
            kind="radio"
            value="fixed"
            ariaLabel="가변 부여 여부"
            brand="hr"
            boxes={[
              { value: 'fixed', title: '고정 시간', description: '정책에 등록된 부여 시간을 그대로 사용합니다. 부여 시간은 휴가 정책 관리 화면에서 바꿀 수 있고, 바꾸면 다음 부여부터 적용되며 이미 부여된 휴가에는 영향이 없습니다.' },
              { value: 'flex', title: '가변 시간', description: '부여할 때마다 사용자 또는 관리자가 시간을 직접 입력합니다. 입력하지 않으면 부여되지 않으며, 입력한 값은 정책의 최대 부여 시간을 넘을 수 없습니다.' },
            ]}
          />
        </Surface>
      </Verdict>
    </Pair>
  </Panel>
);

const HeightGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair wide>
      <Verdict ok note="모든 상자가 가장 긴 상자의 높이 · 칸이 비지 않는다">
        <PhoneWidth>
          <G kind="radio" columns={2} boxes={ACCOUNT.slice(0, 4)} value="cash" ariaLabel="계좌 종류" />
        </PhoneWidth>
      </Verdict>
      <Verdict ok={false} note="상자마다 높이가 다르고, 다섯을 2열에 두어 칸이 비었다">
        <PhoneWidth>
          <G kind="radio" columns={2} boxes={ACCOUNT} value="cash" ragged ariaLabel="계좌 종류" />
        </PhoneWidth>
      </Verdict>
    </Pair>
  </Panel>
);

const MaxGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair wide>
      <Verdict ok note="몇 개까지인지 미리 적는다 — 셋째를 누르면 고르지 않고 안내를 띄운다(눌러 보기)">
        <PhoneWidth>
          <Label id="sb-max-ok">홈에 둘 요약</Label>
          <span className="-mt-1 mb-3 block text-[13px]" style={{ color: rc('fg-neutral-muted') }}>
            2개까지 고를 수 있어요.
          </span>
          <G kind="check" control="none" columns={2} boxes={SUMMARY.map((b, i) => ({ ...b, checked: i < 2 }))} max={2} ariaLabelledby="sb-max-ok" />
        </PhoneWidth>
      </Verdict>
      <Verdict ok={false} note="안내가 없다 — 컨트롤이 없는 상자는 몇 개까지 고르는지 알 수 없다">
        <PhoneWidth>
          <Label id="sb-max-no">홈에 둘 요약</Label>
          <G kind="check" control="none" columns={2} boxes={SUMMARY.map((b, i) => ({ ...b, checked: i < 2 }))} max={2} ariaLabelledby="sb-max-no" />
        </PhoneWidth>
      </Verdict>
    </Pair>
  </Panel>
);

// Chip 은 차례 전이라 모양만 그린다
function ChipShape({ label, on }: { label: string; on?: boolean }) {
  return (
    <span
      className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium"
      style={on ? { background: rc('bg-neutral-inverted'), color: rc('fg-neutral-inverted') } : { boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak')}`, color: rc('fg-neutral') }}
    >
      {label}
    </span>
  );
}
const EdgeGuide: Fig = ({ caption }) => {
  const lk = look();
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Cell label={<><b className="pk-text">Checkbox</b> 선택지가 하나 — 켜면 금액 칸</>}>
          <div className="psb flex flex-col gap-3" data-mode="auto" style={sbGroupVars(lk)}>
            <CheckboxView look={checkLook({ size: 'large' })} defaultChecked="checked" label="고정 금액 사용" />
            <span className="pl-8">
              <FooterContent spec={{ value: '550,000', after: '원', width: 120, aria: '고정 금액' }} look={lk} mode="auto" />
            </span>
          </div>
        </Cell>
        <Cell label={<><b className="pk-text">Select Box</b> 거래 종류 — 셋 중 여럿</>}>
          <G kind="check" control="none" columns={3} boxes={TYPES} ariaLabel="거래 종류" />
        </Cell>
        <div className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%-8px)]">
        <Cell label={<><b className="pk-text">Chip</b> 짧은 이름 여럿 — 금액을 가릴 카드(모양만 — Chip 차례에 정한다)</>}>
          <div className="flex flex-wrap gap-2">
            <ChipShape label="신한카드" on />
            <ChipShape label="현대카드" />
            <ChipShape label="삼성카드" on />
            <ChipShape label="국민카드" />
          </div>
        </Cell>
        </div>
      </div>
    </Panel>
  );
};

// ── 코드 예시(미리보기) ───────────────────────────────────
function Preview({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="not-prose mt-6 mb-0">
      <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border px-4 py-6" style={{ background: rc('bg-layer-default') }}>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExRadio: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G kind="radio" boxes={END.map((b) => ({ ...b, footer: undefined }))} value="none" ariaLabel="종료" />
  </Preview>
);
const ExFooter: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G kind="radio" boxes={[END[1]]} value="count" ariaLabel="종료" />
  </Preview>
);
const ExCheck: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G kind="check" boxes={PERM.slice(0, 2)} ariaLabel="휴가 권한" brand="hr" />
  </Preview>
);
const ExColumns: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G kind="radio" control="none" columns={3} boxes={FORMAT} value="csv" ariaLabel="파일 형식" />
  </Preview>
);
const ExCompact: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G kind="radio" control="none" columns={2} density="compact" boxes={KINDS[0].boxes} value="checking" ariaLabel="계좌" />
  </Preview>
);
const ExStates: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G kind="radio" boxes={FLEX.map((b) => ({ ...b, footer: undefined, disabled: true }))} value="fixed" ariaLabel="가변 부여 여부" brand="hr" />
  </Preview>
);

// 여럿 고르고 저장 — HR 역할(8개: 기본 넷 + 관리자가 더한 넷). 데스크톱은 사용자 상세 칸(역할 및 권한 > 사용자), 폰은 사용자 상세 화면 — 같은 모양
const HR_DETAIL_W = 760;
function HrUserHead({ back = false }: { back?: boolean }) {
  return (
    <div style={{ paddingTop: 24, paddingBottom: 20, paddingLeft: 24, paddingRight: 24, borderBottom: `1px solid ${rc('stroke-neutral-subtle')}` }}>
      {!back && (
        <span style={{ display: 'block', fontSize: 24, lineHeight: '32px', fontWeight: 700, color: rc('fg-neutral') }}>{HR_USER.name}</span>
      )}
      <span style={{ display: 'block', fontSize: 15, lineHeight: '22px', color: rc('fg-neutral-subtle') }}>{HR_USER.email}</span>
      <span style={{ display: 'block', marginTop: 8, fontSize: 14, lineHeight: '19px', color: rc('fg-neutral-subtle') }}>
        {HR_USER.dept} · {HR_USER.position}
      </span>
    </div>
  );
}
const ExRoles: Fig = ({ caption }) => {
  const sb = selectBoxLook('hr');
  const field = textFieldLook('hr').field;
  const save = buttonLook({}, 'hr');
  return (
    <figure className="not-prose my-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-full overflow-hidden rounded-xl" style={{ maxWidth: HR_DETAIL_W }}>
            <Fit w={HR_DETAIL_W}>
              <div style={{ width: HR_DETAIL_W, background: rc('bg-layer-default') }}>
                <HrUserHead />
                <div style={{ paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24 }}>
                  <RolesLive look={sb} field={field} save={save} />
                </div>
              </div>
            </Fit>
          </div>
          <Cap strong="데스크톱 — 사용자 상세 칸">역할을 골라도 바로 바뀌지 않는다 — "저장" 한 번(바뀐 것이 없으면 막힘)</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full" style={{ maxWidth: 406 }}>
            <Fit w={406}>
              <Phone screenW={390} h={1210} title={HR_USER.name} back brand="hr" bg="bg-layer-default">
                <HrUserHead back />
                <div style={{ paddingTop: 24, paddingLeft: 24, paddingRight: 24 }}>
                  <RolesLive look={sb} field={field} save={save} />
                </div>
              </Phone>
            </Fit>
          </div>
          <Cap strong="폰 390 — 같은 모양">검색 시트 · 팝오버 두 벌을 걷었다 — 역할이 늘어도 상자를 쌓는다</Cap>
        </div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
};

export const selectBoxFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  control: Control,
  layout: Layout,
  density: Density,
  states: States,
  live: Live,
  prefix: Prefix,
  footer: Footer,
  group: Group,
  'touch-guide': TouchGuide,
  'submit-guide': SubmitGuide,
  'concise-guide': ConciseGuide,
  'height-guide': HeightGuide,
  'max-guide': MaxGuide,
  'edge-guide': EdgeGuide,
  'ex-radio': ExRadio,
  'ex-footer': ExFooter,
  'ex-check': ExCheck,
  'ex-columns': ExColumns,
  'ex-compact': ExCompact,
  'ex-states': ExStates,
  'ex-roles': ExRoles,
};
