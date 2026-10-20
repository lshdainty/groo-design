// Button 페이지의 가이드 그림 — "언제 어떤 버튼을 쓰나" 를 Desk · HR 화면으로 보인다(SEED 가이드의 앱 화면 자리).
// 버튼은 button.yaml 을 푼 값으로, 화면 조각은 kit 로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel } from '../foundations/ui';
import { buttonLook, type ButtonCombo, type ButtonState } from './button-look';
import { ButtonView, LoadingDemo, type IconName } from './button-view';
import { chipLook } from './chip-look';
import { ChipGroupView, ChipView } from './chip-view';
import { AlertBox, Card, Field, Heading, KV, Line, Phone, Row, Sheet, Stat, Verdict, WebDialog, WebWindow, cardStack, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';

function B(p: ButtonCombo & { label?: string; prefix?: IconName; suffix?: IconName; icon?: IconName; state?: ButtonState | 'live'; mode?: Mode; fill?: boolean; width?: number | string; flush?: 'left' | 'right'; brand?: Brand; truncate?: boolean; grow?: number; style?: CSSProperties }) {
  const { variant, size, layout, ghostColor, brand, grow, ...rest } = p;
  const look = buttonLook({ variant, size, layout: layout ?? (p.icon ? 'iconOnly' : 'withText'), ghostColor }, brand ?? 'desk');
  const el = <ButtonView look={look} label={p.label ?? '라벨'} ariaLabel={p.icon ? p.label ?? '버튼' : undefined} {...rest} fill={p.fill || grow !== undefined} />;
  return grow !== undefined ? <div style={{ flex: grow, minWidth: 0, display: 'flex' }}>{el}</div> : el;
}

const SCALE = 0.66;
function Pair({ children }: { children: ReactNode }) {
  return <div className="flex w-full max-w-[620px] gap-4">{children}</div>;
}
function Cap({ children, strong }: { children: ReactNode; strong?: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
      {strong && <b className="text-[13px] pk-text">{strong}</b>}
      {children}
    </span>
  );
}

// ── 화면 조각 — Desk 홈 · 예산 · HR 휴가 ──────────────────
function SpendCard({ mode = 'auto', actions }: { mode?: Mode; actions?: ReactNode }) {
  return (
    <Card mode={mode}>
      <Stat mode={mode} label="9월에 쓴 돈" value="1,284,500원" />
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: rc('bg-neutral-weak', mode) }}>
        <div className="h-full rounded-full" style={{ width: '64%', background: rc('chart-blue', mode) }} />
      </div>
      <span className="mt-2 block text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
        예산 2,000,000원의 64%
      </span>
      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </Card>
  );
}
function RecentCard({ mode = 'auto', action }: { mode?: Mode; action?: ReactNode }) {
  return (
    <Card mode={mode} title="최근 거래" action={action ? undefined : '전체 보기'}>
      <Row title="점심 식사" sub="식비 · 오늘" amount="−12,000원" hue="orange" mode={mode} />
      <Row title="버스" sub="교통 · 오늘" amount="−1,500원" hue="blue" mode={mode} />
      <Row title="월급" sub="수입 · 9월 25일" amount="+3,200,000원" hue="green" mode={mode} />
      {action && <div className="mt-2 flex justify-center">{action}</div>}
    </Card>
  );
}

// ── Hierarchy ─────────────────────────────────────────────
const Hierarchy: Fig = ({ caption }) => {
  const col = (title: string, count: string, note: string, buttons: ReactNode) => (
    <div className="flex flex-1 flex-col items-center gap-4 rounded-xl pk-surface px-4 pb-5 pt-6">
      <div className="flex flex-col items-center gap-2.5">{buttons}</div>
      <Cap strong={title}>
        {count}
        <br />
        {note}
      </Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex w-[600px] gap-3">
        {col('강 — 대비가 강한 배경', '화면에 1개', '가장 중요한 CTA', <>
          <B variant="brandSolid" label="거래 추가" />
          <B variant="neutralSolid" label="저장" />
          <B variant="criticalSolid" label="삭제" />
        </>)}
        {col('중 — 대비가 약한 배경', '여러 개', '대부분의 액션, 강과 짝', <B variant="neutralWeak" label="취소" />)}
        {col('약 — 투명한 배경', '여러 개', '중요도가 낮은 보조 액션', <>
          <B variant="brandOutline" label="자세히" />
          <B variant="neutralOutline" label="건너뛰기" />
          <B variant="ghost" label="더보기" />
        </>)}
      </div>
    </Figure>
  );
};

// ── 상황에 따라 적절한 변형 ───────────────────────────────
const Usage: Fig = ({ caption }) => {
  const s = 0.62;
  const cell = (el: ReactNode, strong: string, note: string) => (
    <div className="flex flex-col items-center gap-3">
      {el}
      <Cap strong={strong}>{note}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-6">
        {cell(
          <Phone title="휴가" back={false} h={560} scale={s} bottom={<B variant="brandSolid" size="large" fill label="휴가 신청" brand="hr" />}>
            <div style={cardStack()}>
              <Card>
                <Stat label="남은 연차" value="12.5일" />
                <span className="mt-1 text-[12px]" style={{ color: rc('fg-neutral-subtle') }}>
                  올해 15일 중 2.5일 사용
                </span>
              </Card>
              <Card title="신청 내역">
                <Row title="연차" sub="10월 2일 · 승인 대기" hue="green" />
                <Row title="반차" sub="9월 12일 · 승인" hue="indigo" />
              </Card>
            </div>
          </Phone>,
          'brandSolid',
          'HR 휴가 신청 — 서비스의 핵심 액션 하나',
        )}
        {cell(
          <Phone title="예산 설정" h={560} scale={s} bg="bg-layer-default" bottom={<B variant="neutralSolid" size="large" fill label="저장" />}>
            <div className="flex flex-col gap-4 px-6 pt-4">
              <Field label="이번 달 예산" value="2,000,000원" />
              <Field label="식비" value="450,000원" />
              <Field label="교통" value="120,000원" />
            </div>
          </Phone>,
          'neutralSolid',
          '저장 · 확인 · 다음 — 대부분의 CTA',
        )}
        {cell(
          <Phone
            title="메모"
            h={560}
            scale={s}
            bg="bg-layer-default"
            overlay={
              <AlertBox title="메모를 삭제할까요?" body="'장보기 목록' 을 지우면 되돌릴 수 없어요." confirm="삭제" />
            }
          >
            <div className="flex flex-col gap-3 px-6 pt-4">
              <span className="text-[20px] font-bold">장보기 목록</span>
              <Line w="80%" />
              <Line w="64%" />
              <Line w="72%" />
            </div>
          </Phone>,
          'criticalSolid + neutralWeak',
          '되돌릴 수 없는 삭제의 확정 — Alert Dialog',
        )}
        {cell(
          <Phone title="고정 지출" h={560} scale={s}>
            <div style={cardStack()}>
              {[
                ['넷플릭스', '매달 18일 · 13,500원', 'red'],
                ['휴대폰 요금', '매달 25일 · 49,000원', 'blue'],
              ].map(([t, sub, hue]) => (
                <Card key={t}>
                  <Row title={t} sub={sub} hue={hue} />
                  <div className="mt-2 flex gap-2">
                    <B variant="neutralOutline" size="small" grow={1} label="건너뛰기" />
                    <B variant="brandOutline" size="small" grow={1} label="지금 기록" />
                  </div>
                </Card>
              ))}
            </div>
          </Phone>,
          'neutralOutline + brandOutline',
          '한 화면에 여러 번 나오는 보조 액션',
        )}
      </div>
    </Panel>
  );
};

// ── 브랜드 색은 꼭 필요한 곳에만 ──────────────────────────
function Home({ brandy }: { brandy: boolean }) {
  return (
    <Phone
      title="홈"
      back={false}
      h={600}
      scale={SCALE}
      right={<B variant={brandy ? 'brandSolid' : 'ghost'} ghostColor="neutralSubtle" size="small" layout="iconOnly" icon="bell" label="알림" />}
      bottom={<B variant="brandSolid" size="large" fill label="거래 추가" prefix="plus" />}
    >
      <div style={cardStack()}>
        <SpendCard
          actions={
            <>
              <B variant={brandy ? 'brandSolid' : 'neutralWeak'} size="small" grow={1} label="예산 설정" />
              <B variant={brandy ? 'brandSolid' : 'neutralWeak'} size="small" grow={1} label="카테고리" />
            </>
          }
        />
        <RecentCard action={<B variant={brandy ? 'brandOutline' : 'neutralWeak'} size="small" label="내역 더보기" />} />
      </div>
    </Phone>
  );
}
const BrandColor: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="브랜드 색은 거래 추가 하나 — 서비스의 핵심 액션">
        <Home brandy={false} />
      </Verdict>
      <Verdict ok={false} note="여기저기 브랜드 색을 쓰면 무엇이 중요한지 흩어진다">
        <Home brandy />
      </Verdict>
    </Pair>
  </Panel>
);

// ── 버튼 조합 ─────────────────────────────────────────────
const ComboSolid: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4 rounded-xl pk-surface px-10 py-8">
      <div className="flex w-[320px] gap-2">
        <B variant="neutralWeak" size="large" grow={1} label="취소" />
        <B variant="neutralSolid" size="large" grow={1} label="저장" />
      </div>
      <div className="flex w-[320px] gap-2">
        <B variant="neutralWeak" size="large" grow={1} label="나중에" />
        <B variant="brandSolid" size="large" grow={1} label="거래 추가" />
      </div>
    </div>
  </Figure>
);

const ComboOutline: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="Outline 은 Outline 끼리 — 여러 번 나오는 보조 액션">
        <div className="flex w-full flex-col gap-2">
          <div className="flex gap-2">
            <B variant="neutralOutline" size="small" grow={1} label="건너뛰기" />
            <B variant="brandOutline" size="small" grow={1} label="지금 기록" />
          </div>
        </div>
      </Verdict>
      <Verdict ok={false} note="Outline 과 Solid 를 한 줄에 두면 위계가 흐려진다">
        <div className="flex w-full gap-2">
          <B variant="neutralOutline" size="small" grow={1} label="건너뛰기" />
          <B variant="neutralSolid" size="small" grow={1} label="지금 기록" />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 버튼 배치 ─────────────────────────────────────────────
// 화면 하단에 채운 두 버튼(닫기 · 초기화 + CTA). 모달 footer 는 Dialog · Drawer 의 폭 나누기를 따른다(지금 균등)
const FilterPage = ({ equal = false }: { equal?: boolean }) => (
  <Phone
    title="필터"
    h={560}
    scale={SCALE}
    bg="bg-layer-default"
    bottom={
      <div className="flex gap-2">
        <B variant="neutralWeak" size="large" grow={equal ? 1 : 3} label="초기화" />
        <B variant="neutralSolid" size="large" grow={equal ? 1 : 7} label="적용" />
      </div>
    }
  >
    <div className="flex flex-col gap-2 px-6 pt-3">
      <span className="text-[13px] font-medium" style={{ color: rc('fg-neutral-muted') }}>
        종류
      </span>
      <div className="flex gap-2">
        {['전체', '지출', '수입'].map((t, i) => (
          <span
            key={t}
            className="flex h-9 items-center rounded-full px-4 text-[14px] font-medium"
            style={{ background: rc(i === 1 ? 'bg-neutral-inverted' : 'bg-neutral-weak'), color: rc(i === 1 ? 'fg-neutral-inverted' : 'fg-neutral') }}
          >
            {t}
          </span>
        ))}
      </div>
      <span className="mt-4 text-[13px] font-medium" style={{ color: rc('fg-neutral-muted') }}>
        카테고리
      </span>
      <div className="flex flex-wrap gap-2">
        {['식비', '교통', '쇼핑', '주거', '의료', '문화'].map((t, i) => (
          <span
            key={t}
            className="flex h-9 items-center rounded-full border px-4 text-[14px] font-medium"
            style={{ borderColor: rc(i < 2 ? 'fg-neutral' : 'stroke-neutral-weak'), color: rc('fg-neutral') }}
          >
            {t}
          </span>
        ))}
      </div>
      <span className="mt-4 text-[13px] font-medium" style={{ color: rc('fg-neutral-muted') }}>
        기간
      </span>
      <Field label="" value="2026. 9. 1 ~ 9. 30" />
    </div>
  </Phone>
);
const Placement: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="닫기 · 초기화 같은 neutralWeak 와 CTA 를 화면 하단에 채울 땐 3:7">
        <FilterPage />
      </Verdict>
      <Verdict ok={false} note="반반이면 초기화와 적용의 무게가 같아 보인다">
        <FilterPage equal />
      </Verdict>
    </Pair>
  </Panel>
);

const SideBySide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="위계가 비슷한 neutralWeak 둘은 나란히 둘 수 있다" bg="var(--p-bg-layer-basement)">
        <div className="w-[260px]">
          <Card>
            <Row title="팀 회식" sub="10월 2일 (목) 19:00" hue="violet" />
            <div className="mt-2 flex gap-2">
              <B variant="neutralWeak" size="small" grow={1} label="캘린더에 추가" />
              <B variant="neutralWeak" size="small" grow={1} label="공유" />
            </div>
          </Card>
        </div>
      </Verdict>
      <Verdict ok={false} note="셋 이상 나란히 두지 않는다 — 더 있으면 아이콘만 버튼(더보기)으로 넘긴다">
        <div className="flex w-[260px] gap-1.5">
          <B variant="neutralWeak" size="small" grow={1} label="공유" />
          <B variant="neutralWeak" size="small" grow={1} label="복사" />
          <B variant="neutralWeak" size="small" grow={1} label="수정" />
          <B variant="neutralWeak" size="small" grow={1} label="삭제" />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 모달 footer(groo) ───────────────────────────────────
function DeskWebPage() {
  return (
    <div className="flex h-full">
      <div className="w-[120px] shrink-0 p-3" style={{ background: rc('bg-layer-default') }}>
        {['홈', '가계부', '캘린더', '메모'].map((t, i) => (
          <div key={t} className="rounded-md px-2 py-1.5 text-[12px] font-medium" style={{ background: i === 1 ? rc('bg-neutral-weak') : undefined, color: rc('fg-neutral') }}>
            {t}
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Line w="30%" h={12} tone="fg-neutral-muted" />
        <Card>
          <Line w="70%" />
          <div className="h-2" />
          <Line w="50%" />
        </Card>
      </div>
    </div>
  );
}
const ModalFooter: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2">
        <WebWindow w={600} h={330}>
          <DeskWebPage />
          <WebDialog
            title="거래 상세"
            close
            footer={
              <>
                <div className="mr-auto">
                  <B variant="ghost" ghostColor="critical" size="small" label="삭제" />
                </div>
                <B variant="neutralSolid" size="small" label="수정" />
              </>
            }
          >
            <KV k="금액" v="−12,000원" />
            <KV k="내용" v="점심 식사" />
            <KV k="카테고리" v="식비" />
          </WebDialog>
        </WebWindow>
        <Cap strong="상세 — 삭제 · 수정">확인 창을 여는 삭제는 왼쪽 ghost + critical, 주 액션은 오른쪽 neutralSolid</Cap>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WebWindow w={600} h={330}>
          <DeskWebPage />
          <WebDialog
            title="거래 수정"
            footer={
              <div className="ml-auto flex gap-2">
                <B variant="neutralWeak" size="small" label="취소" />
                <B variant="neutralSolid" size="small" label="저장" />
              </div>
            }
          >
            <div className="flex flex-col gap-3">
              <Field label="금액" value="12,000원" size="medium" />
            </div>
          </WebDialog>
        </WebWindow>
        <Cap strong="편집 폼 — 취소 · 저장">웹은 small(36), 취소는 neutralWeak</Cap>
      </div>
    </div>
  </Figure>
);

// ── 놓는 바탕 ─────────────────────────────────────────────
// 라이트에서만 생기는 문제라 라이트로 고정해 그린다(다크의 약한 채움은 페이지 바탕 위에서도 보인다)
const Surface: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="neutralWeak 는 흰 표면(카드 · 시트 · 모달) 위에" bg={rc('bg-layer-basement', 'light')}>
        <div className="w-[240px]">
          <RecentCard mode="light" action={<B variant="neutralWeak" size="small" mode="light" label="내역 더보기" />} />
        </div>
      </Verdict>
      <Verdict ok={false} note="라이트에서 페이지 바탕 위에 바로 두면 채움이 사라진다 — neutralOutline 을 쓴다" bg={rc('bg-layer-basement', 'light')}>
        <div className="flex w-[240px] flex-col items-center gap-3">
          <RecentCard mode="light" />
          <B variant="neutralWeak" size="small" mode="light" label="내역 더보기" />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 라벨 ──────────────────────────────────────────────────
const Label: Fig = ({ caption }) => {
  const sheet = (label: string) => (
    <Phone
      title="설정"
      h={440}
      scale={SCALE}
      overlay={
        <Sheet title="알림 받을 시간" footer={<B variant="neutralSolid" size="large" fill label={label} />}>
          <div className="flex gap-2">
            {['오전 9시', '오후 1시', '오후 9시'].map((t, i) => (
              <span
                key={t}
                className="flex h-10 flex-1 items-center justify-center rounded-xl text-[14px] font-medium"
                style={{ background: rc(i === 2 ? 'bg-neutral-inverted' : 'bg-neutral-weak'), color: rc(i === 2 ? 'fg-neutral-inverted' : 'fg-neutral') }}
              >
                {t}
              </span>
            ))}
          </div>
        </Sheet>
      }
    >
      <div className="p-5" />
    </Phone>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="무엇을 하는지 동사로 — 누르면 무슨 일이 일어나는지 보인다">{sheet('알림 시간 저장')}</Verdict>
        <Verdict ok={false} note="'확인' 만으로는 무엇이 저장되는지 모른다">{sheet('확인')}</Verdict>
      </Pair>
    </Panel>
  );
};

// ── 긴 라벨 ───────────────────────────────────────────────
const LongLabel: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="넘치면 세로로 쌓는다 — 주 버튼이 위">
        <div className="flex w-[260px] flex-col gap-2">
          <B variant="neutralSolid" size="medium" fill label="남은 예산을 다음 달로 옮기기" />
          <B variant="neutralWeak" size="medium" fill label="이번 달에 그대로 두기" />
        </div>
      </Verdict>
      <Verdict ok={false} note="한 줄에 억지로 넣으면 라벨이 잘린다">
        <div className="flex w-[260px] gap-2">
          <B variant="neutralWeak" size="medium" grow={1} truncate label="이번 달에 그대로 두기" style={{ overflow: 'hidden' }} />
          <B variant="neutralSolid" size="medium" grow={1} truncate label="남은 예산을 다음 달로 옮기기" style={{ overflow: 'hidden' }} />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 아이콘 ────────────────────────────────────────────────
const IconUse: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full max-w-[620px] flex-col gap-4">
      <Pair>
        <Verdict ok note="앞 아이콘은 동작의 뜻을 돕는다">
          <B variant="brandSolid" prefix="plus" label="거래 추가" />
        </Verdict>
        <Verdict ok note="뒤 아이콘은 동작을 돕는다(다음 · 펼치기)">
          <B variant="neutralWeak" suffix="chevron-right" label="전체 보기" />
        </Verdict>
      </Pair>
      <Pair>
        <Verdict ok={false} note="모든 버튼에 아이콘을 붙이지 않는다">
          <div className="flex gap-2">
            <B variant="neutralWeak" size="small" prefix="pencil" label="수정" />
            <B variant="neutralWeak" size="small" prefix="share" label="공유" />
            <B variant="neutralWeak" size="small" prefix="download" label="저장" />
          </div>
        </Verdict>
        <Verdict ok={false} note="앞 · 뒤 아이콘을 함께 쓰지 않는다">
          <B variant="neutralSolid" prefix="plus" suffix="chevron-right" label="거래 추가" />
        </Verdict>
      </Pair>
    </div>
  </Panel>
);

// ── 로딩 ──────────────────────────────────────────────────
const Loading: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="로딩 원만 바꾸고 폭은 그대로 — 눌러 보면 잠시 로딩이 된다">
        <div className="flex flex-col items-center gap-3">
          <LoadingDemo look={buttonLook({ variant: 'neutralSolid', size: 'large' })} label="저장" />
          <B variant="neutralSolid" size="large" state="loading" label="저장" />
        </div>
      </Verdict>
      <Verdict ok={false} note="라벨을 바꾸면 폭이 흔들리고, 비활성으로 두면 고장처럼 보인다">
        <div className="flex flex-col items-center gap-3">
          <B variant="neutralSolid" size="large" label="저장" />
          <B variant="neutralSolid" size="large" state="disabled" label="저장하는 중…" />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── Button 과 Chip ────────────────────────────────────────
const ChipCompare: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full max-w-[620px] gap-4">
      <div className="flex flex-1 flex-col items-center gap-4 rounded-xl pk-surface p-6">
        <div className="flex gap-2">
          <B variant="neutralWeak" size="small" label="취소" />
          <B variant="neutralSolid" size="small" label="완료" />
        </div>
        <Cap strong="Button">액션을 실행한다 — 라벨만 봐도 무슨 일이 일어날지 안다</Cap>
      </div>
      <div className="flex flex-1 flex-col items-center gap-4 rounded-xl pk-surface p-6">
        {/* 고르기 칩 — chip.yaml 그대로(하나 고르기 · 고른 칩은 짙은 채움). Toggle Group 은 2026-10-09 걷었다 */}
        <ChipGroupView look={chipLook()}>
          {['전체', '식비', '교통', '쇼핑'].map((t, i) => (
            <ChipView key={t} look={chipLook()} state="enabled" selected={i === 1} label={t} />
          ))}
        </ChipGroupView>
        <Cap strong="고르기(Chip)">지금 켜진 조건을 보인다 — 둘 이상 묶어서 쓴다</Cap>
      </div>
    </div>
  </Panel>
);

// ── groo 에만 있는 것 ───────────────────────────────────
const SplitBar: Fig = ({ caption }) => {
  const f = buttonLook({ variant: 'ghost', size: 'xsmall' }).faces.light.enabled;
  return (
    <Figure caption={caption}>
      <div className="w-[340px] rounded-xl pk-surface p-5">
        <Row title="점심 식사" sub="3명 · 36,000원" hue="orange" />
        <div className="mt-2 flex items-center overflow-hidden" style={{ height: f.height, background: rc('bg-layer-basement'), border: `1px solid ${rc('stroke-neutral-weak')}`, borderRadius: buttonLook({ size: 'small' }).faces.light.enabled.radius }}>
          <B variant="ghost" size="xsmall" grow={1} prefix="plus" label="항목 추가" style={{ borderRadius: 0 }} />
          <span className="h-3.5 w-px shrink-0" style={{ background: rc('stroke-neutral-weak') }} />
          <B variant="ghost" size="xsmall" grow={1} prefix="sliders" label="균등 분할" style={{ borderRadius: 0 }} />
        </div>
      </div>
    </Figure>
  );
};

const Flush: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="w-[340px] rounded-xl pk-surface px-6 py-5">
      <Heading>할 일</Heading>
      <Row title="장보기" sub="오늘" hue="green" />
      <Row title="관리비 이체" sub="내일" hue="blue" />
      <div className="relative">
        <span className="absolute -left-px bottom-0 top-0 w-px" style={{ background: '#DB2777' }} />
        <B variant="ghost" ghostColor="neutralSubtle" size="small" flush="left" prefix="plus" label="할 일 추가" />
      </div>
    </div>
  </Figure>
);

// ── 코드 예시(미리보기) ───────────────────────────────────
function Preview({ children, caption, dark }: { children: ReactNode; caption?: string; dark?: boolean }) {
  return (
    <figure className="not-prose mt-6 mb-0">
      <div className="flex min-h-[120px] flex-wrap items-center justify-center gap-3 rounded-t-xl border border-b-0 border-fd-border px-6 py-8" style={{ background: dark ? rc('bg-layer-default', 'dark') : rc('bg-layer-default') }}>
        {children}
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExBasic: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <B label="저장" />
  </Preview>
);
const ExVariants: Fig = ({ caption }) => (
  <Preview caption={caption}>
    {(['brandSolid', 'neutralSolid', 'neutralWeak', 'criticalSolid', 'brandOutline', 'neutralOutline', 'ghost'] as const).map((v) => (
      <B key={v} variant={v} label={v} />
    ))}
  </Preview>
);
const ExSizes: Fig = ({ caption }) => (
  <Preview caption={caption}>
    {(['xsmall', 'small', 'medium', 'large'] as const).map((s) => (
      <B key={s} size={s} label={s} />
    ))}
  </Preview>
);
const ExIcons: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <B variant="brandSolid" prefix="plus" label="거래 추가" />
    <B variant="neutralWeak" suffix="chevron-right" label="전체 보기" />
    <B variant="ghost" ghostColor="neutralSubtle" icon="search" label="검색" />
  </Preview>
);
const ExGhost: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <B variant="ghost" label="편집" />
    <B variant="ghost" ghostColor="neutralSubtle" label="더보기" />
    <B variant="ghost" ghostColor="brand" label="자세히 보기" />
    <B variant="ghost" ghostColor="critical" label="삭제" />
  </Preview>
);
const ExStates: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <B label="저장" state="disabled" />
    <LoadingDemo look={buttonLook({})} label="저장" />
  </Preview>
);
const ExFill: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <div className="w-[320px]">
      <B size="large" fill label="저장" />
    </div>
  </Preview>
);
const ExFooter: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <div className="flex w-[380px] items-center gap-2">
      <div className="mr-auto">
        <B variant="ghost" ghostColor="critical" size="small" label="삭제" />
      </div>
      <B variant="neutralWeak" size="small" label="취소" />
      <B size="small" label="저장" />
    </div>
  </Preview>
);

export const buttonGuideFigures: Record<string, Fig> = {
  hierarchy: Hierarchy,
  usage: Usage,
  'brand-color': BrandColor,
  'combo-solid': ComboSolid,
  'combo-outline': ComboOutline,
  placement: Placement,
  'side-by-side': SideBySide,
  'modal-footer': ModalFooter,
  surface: Surface,
  label: Label,
  'long-label': LongLabel,
  icon: IconUse,
  loading: Loading,
  chip: ChipCompare,
  'split-bar': SplitBar,
  flush: Flush,
  'ex-basic': ExBasic,
  'ex-variants': ExVariants,
  'ex-sizes': ExSizes,
  'ex-icons': ExIcons,
  'ex-ghost': ExGhost,
  'ex-states': ExStates,
  'ex-fill': ExFill,
  'ex-footer': ExFooter,
};

