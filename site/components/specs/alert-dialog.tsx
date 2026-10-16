// Alert Dialog 페이지의 그림 — specs/components/alert-dialog.md 의 `[그림: …](../../site/components/specs/alert-dialog.tsx#<id>)` 자리.
// 확인창은 alert-dialog.yaml 을 푼 값(overlayLook().alert)으로, 버튼은 button.yaml 로 그린다 — 1280 미만 medium · 이상 small.
// 배치는 글 길이로 저절로 정한다(한쪽 글이 반 폭을 넘으면 세로 · 확정이 위) — 그림도 같은 규칙으로 잰다.
import type { ReactNode } from 'react';
import { Keyboard } from 'lucide-react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { AlertDialogPlayground } from './overlay-playground';
import { AlertDemo } from './overlay-demos';
import { AlertOn, DeleteAlert, GroupAlert, LeaveAlert, LedgerPhone, Legend, Note, Scaled, Shot, TxFields, WebPage, alertButtons, ov, overlayKit, pinAt } from './overlay-screens';
import { AlertSurface, GestureMark } from './overlay-view';
import { F, cta, desk, tf } from './select-screens';
import { TfInputView } from './text-field-view';
import { InputButtonView } from './select-view';
import { Phone, Row, Verdict, WebWindow, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const al = () => ov().alert;
const px = (v: string) => parseFloat(v);
const line = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;

// ── 뒤 화면 ───────────────────────────────────────────────
// 거래 추가(작성 중) — 금액 · 날짜 · 카테고리 + 아래 저장
function TxFormPhone({ mode, scale = 0.56, overlay }: { mode: Mode; scale?: number; overlay?: ReactNode }) {
  return (
    <Phone title="거래 추가" mode={mode} scale={scale} h={640} bg="bg-layer-default" bottom={cta('저장', mode)} overlay={overlay}>
      <div className="flex flex-col px-6 pt-4">
        <TxFields mode={mode} size="large" />
      </div>
    </Phone>
  );
}
// 관심 종목 — 그룹 줄
const STOCKS: [string, string, string, string][] = [
  ['삼성전자', '국내 · 30주', '+1.2%', 'blue'],
  ['애플', '미국 · 4주', '-0.4%', 'violet'],
  ['카카오', '국내 · 12주', '+0.8%', 'orange'],
  ['테슬라', '미국 · 2주', '+3.1%', 'green'],
  ['네이버', '국내 · 5주', '-1.1%', 'green'],
];
function StockPhone({ mode, scale = 0.56, overlay }: { mode: Mode; scale?: number; overlay?: ReactNode }) {
  return (
    <Phone title="관심 그룹 · 성장주" mode={mode} scale={scale} h={640} bg="bg-layer-default" overlay={overlay}>
      <div className="flex flex-col px-6 pt-2">
        {STOCKS.map(([t, sub, a, hue]) => (
          <Row key={t} mode={mode} title={t} sub={sub} amount={a} hue={hue} />
        ))}
      </div>
    </Phone>
  );
}

// ── Overview ──────────────────────────────────────────────
// 거래 삭제 · 작성 중 나가기 · 관심 그룹 삭제(긴 글 — 세로) — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LedgerPhone mode={mode} scale={0.52} overlay={<AlertOn mode={mode}><DeleteAlert mode={mode} /></AlertOn>} />
          <TxFormPhone mode={mode} scale={0.52} overlay={<AlertOn mode={mode}><LeaveAlert mode={mode} /></AlertOn>} />
          <StockPhone mode={mode} scale={0.52} overlay={<AlertOn mode={mode}><GroupAlert mode={mode} /></AlertOn>} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <AlertDialogPlayground kits={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const a = al();
  const titleH = px(a.title.lineHeight);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <LedgerPhone
          mode="auto"
          scale={1}
          overlay={
            <AlertOn mode="auto">
              {pinAt('ⓐ', 16, 64)}
              <DeleteAlert
                mode="auto"
                marks={{ title: line, description: line, footer: line }}
                decor={{
                  root: (
                    <>
                      {pinAt('ⓑ', -10, -10)}
                      {pinAt('ⓒ', -24, a.padding + titleH / 2 - 10)}
                      {pinAt('ⓓ', -24, a.padding + titleH + a.description.marginTop + px(a.description.lineHeight) / 2 - 10)}
                    </>
                  ),
                  footer: pinAt('ⓔ', -24, a.footer.padTop + a.footer.below.height / 2 - 10),
                }}
              />
            </AlertOn>
          }
        />
        <Legend
          items={[
            ['ⓐ', 'Overlay — 눌러도 닫히지 않는다'],
            ['ⓑ', 'Container'],
            ['ⓒ', 'Title'],
            ['ⓓ', 'Description'],
            ['ⓔ', 'Actions — 닫기 버튼 없음'],
          ]}
        />
        <Note>
          최대 {a.maxWidth} · 좌우 {a.marginX} 을 남긴다 · 안쪽 {a.padding} · 모서리 {a.radius} — 제목 {px(a.title.fontSize)} / {titleH} · {a.title.fontWeight}, 설명 {px(a.description.fontSize)} / {px(a.description.lineHeight)}(짙은 글자) · 사이 {a.description.marginTop} · 버튼 위 {a.footer.padTop} · 버튼 사이 {a.footer.gap}
        </Note>
      </div>
    </Figure>
  );
};

// ── Layout ────────────────────────────────────────────────
// 나란히(기본) · 세로(한쪽 글이 반 폭을 넘는다 — 확정이 위) · 하나(알리기)
// 그림 속 화면 — 폭은 확인창 최대 폭 + 좌우 남김(이보다 좁으면 확인창이 준다)
function Stage({ children, h = 300, s = 0.62 }: { children: ReactNode; h?: number; s?: number }) {
  const a = al();
  const w = a.maxWidth + a.marginX * 2;
  return (
    <Scaled w={w} h={h} s={s}>
      <div className="relative overflow-hidden rounded-2xl" style={{ width: w, height: h, background: rc('bg-layer-default') }}>
        <AlertOn mode="auto">{children}</AlertOn>
      </div>
    </Scaled>
  );
}
const Layout: Fig = ({ caption }) => {
  const b = alertButtons(false);
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-5">
        <Shot strong="horizontal — 나란히(기본)" cap="취소 왼쪽 · 확정 오른쪽, 반씩">
          <Stage s={0.75}>
            <DeleteAlert mode="auto" />
          </Stage>
        </Shot>
        <Shot strong="vertical — 세로" cap="한쪽 글이 반 폭을 넘으면 저절로 — 확정이 위">
          <Stage s={0.75}>
            <GroupAlert mode="auto" />
          </Stage>
        </Shot>
        <Shot strong="single — 하나" cap="알리기만 할 때 — 폭 전체, 결과에 맞는 동작 이름">
          <Stage s={0.75}>
            <AlertSurface look={al()} title="저장하지 못했어요" description="연결을 확인하고 다시 저장해 주세요." confirm={{ label: '다시 저장', look: b('neutralSolid') }} />
          </Stage>
        </Shot>
      </div>
    </Panel>
  );
};

// ── 쓰임 ──────────────────────────────────────────────────
// 되돌릴 수 없는 확인 · 확인창 안의 입력칸(→ Dialog · Bottom Sheet)
const RoleGuide: Fig = ({ caption }) => {
  const b = alertButtons(false);
  const t = tf();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="되돌릴 수 없는 일 앞에서 둘 중 하나를 고르게 — 무엇이 어떻게 되는지 설명에">
          <LedgerPhone mode="auto" scale={0.56} overlay={<AlertOn mode="auto"><DeleteAlert mode="auto" /></AlertOn>} />
        </Verdict>
        <Verdict ok={false} note="확인창 안에 입력칸 — 입력이 필요하면 Dialog · Bottom Sheet 로">
          <LedgerPhone
            mode="auto"
            scale={0.56}
            overlay={
              <AlertOn mode="auto">
                <AlertSurface
                  look={al()}
                  title="환불할까요?"
                  description={
                    <span className="flex flex-col gap-3">
                      환불 날짜를 넣어 주세요.
                      <F label="환불 날짜">
                        <InputButtonView look={desk()} size="large" state="enabled" value="10월 2일 (금)" suffixIcon="calendar" />
                      </F>
                      <F label="금액">
                        <TfInputView look={t.input} size="large" state="enabled" value="12,000" suffix="원" />
                      </F>
                    </span>
                  }
                  cancel={{ label: '취소', look: b('neutralWeak') }}
                  confirm={{ label: '환불', look: b('neutralSolid') }}
                />
              </AlertOn>
            }
          />
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 확정 — 되돌릴 수 없으면 Critical ────────────────────────
const ToneGuide: Fig = ({ caption }) => {
  const b = alertButtons(false);
  return (
    <Panel caption={caption}>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        <Verdict ok note="지우는 · 잃는 확정은 criticalSolid, 그 밖의 확정은 neutralSolid · 취소는 neutralWeak">
          <div className="flex flex-wrap justify-center gap-4">
            <Stage h={260}>
              <DeleteAlert mode="auto" />
            </Stage>
            <Stage h={260}>
              <AlertSurface look={al()} title="기본 통화를 바꿀까요?" description="지난 거래의 금액은 그대로예요." cancel={{ label: '취소', look: b('neutralWeak') }} confirm={{ label: '바꾸기', look: b('neutralSolid') }} />
            </Stage>
          </div>
        </Verdict>
        <Verdict ok={false} note="취소를 Critical 로 — 위험한 쪽이 어느 버튼인지 헷갈린다">
          <Stage h={260}>
            <AlertSurface look={al()} title="거래를 삭제할까요?" description="삭제한 거래는 되돌릴 수 없어요." cancel={{ label: '취소', look: b('criticalSolid') }} confirm={{ label: '삭제', look: b('neutralSolid') }} />
          </Stage>
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 닫는 길 ───────────────────────────────────────────────
// 폰 — 딤을 눌러도 그대로. 데스크톱 — Esc 는 취소와 같다(1280 이상은 버튼 small)
function EscBadge() {
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold text-white" style={{ bottom: 28, background: 'rgba(26,31,46,0.86)', zIndex: 5 }}>
      <Keyboard size={14} aria-hidden /> Esc — 취소와 같다
    </span>
  );
}
const DismissGuide: Fig = ({ caption }) => {
  const k = ov().breakpoint;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-5">
        <Shot strong={`${k} 미만 — 버튼 ${al().footer.below.height}`} cap="바깥(딤)을 눌러도 닫히지 않는다 — Esc · 뒤로 가기는 취소와 같다">
          <LedgerPhone
            mode="auto"
            scale={0.6}
            overlay={
              <AlertOn mode="auto">
                <GestureMark kind="tap" x="50%" y={92} note="눌러도 그대로" ok={false} />
                <DeleteAlert mode="auto" />
              </AlertOn>
            }
          />
        </Shot>
        <Shot strong={`${k} 이상 — 버튼 ${al().footer.above.height}`} cap="Esc 는 취소와 같다 — 닫기 버튼은 없다">
          <Scaled w={560} h={384} s={0.66}>
            <WebWindow mode="auto" w={560} h={384}>
              <WebPage mode="auto" title="가계부" />
              <AlertOn mode="auto">
                <DeleteAlert mode="auto" wide />
                <EscBadge />
              </AlertOn>
            </WebWindow>
          </Scaled>
        </Shot>
      </div>
    </Panel>
  );
};

// ── 글 ────────────────────────────────────────────────────
const WritingGuide: Fig = ({ caption }) => {
  const b = alertButtons(false);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='묻는 말 · 해요체 · 버튼은 동작 이름("삭제") — 작성 중 나가기는 "계속 작성 · 나가기"'>
          <Stage h={260}>
            <DeleteAlert mode="auto" />
          </Stage>
        </Verdict>
        <Verdict ok={false} note='"정말 … 하시겠습니까?" 합니다체 · 겁주는 말 · "확인" · "아니요" 로 뭉뚱그린 버튼'>
          <Stage h={260}>
            <AlertSurface look={al()} title="정말 삭제하시겠습니까?" description="삭제된 데이터는 절대 복구할 수 없습니다!" cancel={{ label: '아니요', look: b('neutralWeak') }} confirm={{ label: '확인', look: b('criticalSolid') }} />
          </Stage>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 Esc 로 닫는다) ──────────────────
const ExDelete: Fig = () => <AlertDemo kit={overlayKit()} kind="delete" />;
const ExLeave: Fig = () => <AlertDemo kit={overlayKit()} kind="leave" />;

export const alertDialogFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  'role-guide': RoleGuide,
  'tone-guide': ToneGuide,
  'dismiss-guide': DismissGuide,
  'writing-guide': WritingGuide,
  'ex-delete': ExDelete,
  'ex-leave': ExLeave,
};

