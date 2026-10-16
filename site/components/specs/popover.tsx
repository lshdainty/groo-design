// Popover 페이지의 그림 — specs/components/popover.md 의 `[그림: …](../../site/components/specs/popover.tsx#<id>)` 자리.
// 팝오버는 popover.yaml 을 푼 값(overlayLook().popover)으로 그린다 — 폭 320 ~ 480 · 트리거와 8 · 가장자리와 16 · 그림자 s3.
// 칸 · 버튼은 그 컴포넌트의 YAML, 달력은 Date Picker(date-picker.yaml — 336 · 칸 48)다. 팝오버는 1280 이상의 데스크톱에만 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { dateKit } from './date-look';
import { DatePickerView } from './date-view';
import { PopoverPlayground } from './overlay-playground';
import { RulePopoverDemo } from './overlay-demos';
import { Band, Legend, Note, RULE_TEXT, RuleBody, RulePopover, Scaled, Shot, btn, ov, overlayKit, pinAt } from './overlay-screens';
import { EndButtons, PopoverSurface, type OvDecor, type OvMarks } from './overlay-view';
import { F, Form, desk, hr, tf } from './select-screens';
import { InputButtonView, SelectTriggerView } from './select-view';
import { TfInputView } from './text-field-view';
import { NotifyDesk, NotifyPopover } from './nav-notify';
import { Verdict, WebWindow, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const pv = () => ov('hr').popover;
const px = (v: string) => parseFloat(v);
const line: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };

// ── 그림 속 데스크톱 페이지 ─────────────────────────────────
// 창 안 페이지(HR) — 제목 · 줄. 자리(absolute)는 창 안쪽 기준이다
function Page({ mode, title, children }: { mode: Mode; title: string; children?: ReactNode }) {
  return (
    <div className="relative h-full px-8 pt-6" style={{ background: rc('bg-layer-default', mode, 'hr') }}>
      <div className="pb-3 text-[20px] font-bold" style={{ color: rc('fg-neutral', mode, 'hr') }}>
        {title}
      </div>
      {children}
    </div>
  );
}
// "연차 사용 규정 ⓘ" 줄 — 아이콘이 트리거(누르면 연다). focus 면 키보드 링
function RuleTrigger({ mode, focus = false, style }: { mode: Mode; focus?: boolean; style?: CSSProperties }) {
  const p = pv();
  return (
    <span className="absolute flex items-center gap-1 text-[15px] font-medium" style={{ color: rc('fg-neutral', mode, 'hr'), ...style }}>
      연차 사용 규정
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ color: rc('fg-neutral-subtle', mode, 'hr'), outline: focus ? `${p.ring.width}px solid ${rc('stroke-focus-ring', mode, 'hr')}` : undefined, outlineOffset: p.ring.offset }}
      >
        <Info aria-hidden size={18} strokeWidth={2} />
      </span>
    </span>
  );
}
// 줄 · 요약 — 팝오버 뒤 페이지
function Summary({ mode, top, focus = false }: { mode: Mode; top: number; focus?: boolean }) {
  return (
    <div className="absolute left-8 right-8 flex flex-col gap-2 text-[14px]" style={{ top, color: rc('fg-neutral-subtle', mode, 'hr') }}>
      <span>남은 연차 11일 · 올해 쓴 연차 4일</span>
      <span
        className="flex w-max items-center gap-0.5 rounded-md font-medium"
        style={{ color: rc('fg-neutral', mode, 'hr'), outline: focus ? `${pv().ring.width}px solid ${rc('stroke-focus-ring', mode, 'hr')}` : undefined, outlineOffset: pv().ring.offset }}
      >
        휴가 내역 보기 <ChevronRight size={14} aria-hidden />
      </span>
      <span className="mt-2 block h-2.5 w-3/4 rounded-full" style={{ background: rc('stroke-neutral-weak', mode, 'hr') }} />
      <span className="block h-2.5 w-1/2 rounded-full" style={{ background: rc('stroke-neutral-weak', mode, 'hr') }} />
    </div>
  );
}
// 트리거 줄의 자리 · 높이 — 페이지 위 24 + 제목(28 + 아래 12) 아래
const TRIG_TOP = 24 + 28 + 12;
const TRIG_H = 32;
// 안내 팝오버의 높이(글이 몇 줄로 꺾이는지는 폭에 달려 넉넉히) — 머리 + 본문 줄 + 바닥 아래 여백
const ruleH = (lines: number) => {
  const p = pv();
  return p.header.padTop + px(p.title.lineHeight) + p.header.padBottom + lines * px(p.description.lineHeight) + p.body.padBottom;
};
// 날짜 패널의 높이 — 본문 위 여백(머리 없음) + 달력(머리 · 요일 줄 · 6주) + 바닥
const dateH = () => {
  const p = pv();
  const d = dateKit('hr').date;
  return p.body.padTop + d.header.height + d.weekday.height + d.cell.height * d.cell.weeks + p.footer.padTop + p.footer.button.height + p.footer.padBottom;
};

// 연차 사용 규정 — 아이콘 아래 8 에 팝오버(가로는 가장자리 16 안으로 민다)
function RuleWindow({ mode, w = 540, s = 1, marks, decor, short = false }: { mode: Mode; w?: number; s?: number; marks?: OvMarks; decor?: OvDecor; short?: boolean }) {
  const p = pv();
  const top = TRIG_TOP + TRIG_H + p.offset;
  const h = 32 + top + ruleH(short ? 1 : 2) + 40;
  return (
    <Scaled w={w} h={h} s={s}>
      <WebWindow mode={mode} w={w} h={h} url="hr.porest.app">
        <Page mode={mode} title="휴가">
          <RuleTrigger mode={mode} style={{ left: 32, top: TRIG_TOP }} />
          <Summary mode={mode} top={TRIG_TOP + TRIG_H + 16} />
        </Page>
        <div className="absolute" style={{ left: p.edge, top }}>
          <RulePopover mode={mode} marks={marks} decor={decor} avail={w - p.edge * 2} scroll={{ scrolled: false }}>
            <RuleBody mode={mode} short={short} />
          </RulePopover>
        </div>
      </WebWindow>
    </Scaled>
  );
}
// 날짜 고르기 — 휴가 신청 페이지의 날짜 칸 아래 8 에 머리 없는 고르는 패널(달력 · 완료)
function DateWindow({ mode, w = 448, s = 1, marks, decor }: { mode: Mode; w?: number; s?: number; marks?: OvMarks; decor?: OvDecor }) {
  const p = pv();
  const t = tf();
  const lk = hr();
  const field = px(t.field.label.text.lineHeight) + t.field.gap + lk.ib.sizes.medium.h;
  const fieldsTop = TRIG_TOP;
  const top = fieldsTop + field * 2 + t.field.form.gapY + p.offset;
  const h = 32 + top + dateH() + 24;
  return (
    <Scaled w={w} h={h} s={s}>
      <WebWindow mode={mode} w={w} h={h} url="hr.porest.app">
        <Page mode={mode} title="휴가 신청">
          <div className="absolute left-8" style={{ top: fieldsTop, width: 320 }}>
            <Form>
              <F mode={mode} label="휴가 종류">
                <SelectTriggerView look={lk} mode={mode} size="medium" state="enabled" labels={['연차']} />
              </F>
              <F mode={mode} label="날짜">
                <InputButtonView look={lk} mode={mode} size="medium" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
              </F>
            </Form>
          </div>
        </Page>
        <div className="absolute" style={{ left: 32, top }}>
          <DatePanel mode={mode} marks={marks} decor={decor} />
        </div>
      </WebWindow>
    </Scaled>
  );
}
function DatePanel({ mode, marks, decor }: { mode: Mode; marks?: OvMarks; decor?: OvDecor }) {
  const p = pv();
  return (
    <PopoverSurface look={p} mode={mode} scroll={{ scrolled: false }} marks={marks} decor={decor} footer={<EndButtons mode={mode} items={[{ label: '완료', look: btn('neutralSolid', p.footer.button.size, 'hr') }]} />}>
      <DatePickerView kit={dateKit('hr')} mode={mode} value={{ y: 2026, m: 10, d: 12 }} />
    </PopoverSurface>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <RuleWindow mode={mode} s={0.55} />
          <DateWindow mode={mode} s={0.55} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <PopoverPlayground kits={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} sels={{ desk: desk(), hr: hr() }} field={tf().field} dates={{ desk: dateKit('desk'), hr: dateKit('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
// 안내(머리 · 본문) · 고르는 패널(본문 · 바닥) — 트리거와 8
const Anatomy: Fig = ({ caption }) => {
  const p = pv();
  const gap = <Band style={{ left: 0, top: -p.offset, width: 64, height: p.offset }} label={String(p.offset)} />;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-start justify-center gap-6">
          <Shot strong="안내 — 머리 + 본문">
            <RuleWindow mode="auto" s={0.8} marks={{ header: line, body: line }} decor={{ root: <>{pinAt('ⓐ', -10, -10)}{gap}</>, header: pinAt('ⓑ', 2, p.header.padTop + 3), body: pinAt('ⓒ', 2, 0) }} />
          </Shot>
          <Shot strong="고르는 패널 — 본문 + 바닥">
            <DateWindow mode="auto" s={0.8} marks={{ body: line, footer: line }} decor={{ root: gap, body: pinAt('ⓒ', 2, p.body.padTop), footer: pinAt('ⓓ', 2, p.footer.padTop + 8) }} />
          </Shot>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Header — 제목 · 닫기'],
            ['ⓒ', 'Body'],
            ['ⓓ', 'Footer — 고른 것을 넣을 때만'],
          ]}
        />
        <Note>
          폭 {p.minWidth} ~ {p.maxWidth} · 높이 {p.maxHeight} 까지 · 모서리 {p.radius} · 그림자 s3 · 트리거와 {p.offset} · 화면 가장자리와 {p.edge} — 머리 위 {p.header.padTop} · 좌우 {p.header.padX} · 아래 {p.header.padBottom}, 제목 {px(p.title.fontSize)} / {px(p.title.lineHeight)} · 설명 {px(p.description.fontSize)} / {px(p.description.lineHeight)} · 닫기 아이콘 {p.close.icon}(누르는 영역 {p.close.target}) · 바닥 위 {p.footer.padTop} · 아래 {p.footer.padBottom} · 머리 · 바닥이 없으면 본문 위 · 아래 {p.body.padTop}
        </Note>
      </div>
    </Panel>
  );
};

// ── 자리 ──────────────────────────────────────────────────
// 아래(기본) · 아래가 모자라면 위 · 옆으로 넘치면 화면 안으로 민다(가장자리 16)
const PLACE_W = 420;
const PLACE_H = 300;
function PlaceWindow({ kind }: { kind: 'below' | 'above' | 'edge' }) {
  const p = pv();
  const w = PLACE_W;
  const pop = ruleH(1);
  const h = PLACE_H;
  const trigW = 150;
  // 트리거 자리 — 창 안쪽(창 막대 아래) 기준
  const trig = kind === 'below' ? { x: 32, y: 24 } : kind === 'above' ? { x: 32, y: h - 32 - 24 - TRIG_H } : { x: w - 24 - trigW, y: 24 };
  const popW = p.minWidth;
  const center = trig.x + trigW - 16;
  const left = Math.max(p.edge, Math.min(center - popW / 2, w - p.edge - popW));
  const top = kind === 'above' ? trig.y - p.offset - pop : trig.y + TRIG_H + p.offset;
  return (
    <WebWindow mode="auto" w={w} h={h} url="hr.porest.app">
      <Page mode="auto" title="">
        <RuleTrigger mode="auto" style={{ left: trig.x, top: trig.y }} />
      </Page>
      <div className="absolute" style={{ left, top }}>
        <PopoverSurface look={p} title="연차 사용 규정" width={popW} scroll={{ scrolled: false }} decor={{ root: kind === 'above' ? <Band style={{ left: 24, bottom: -p.offset, width: 48, height: p.offset }} label={String(p.offset)} /> : kind === 'edge' ? <Band style={{ right: -p.edge, top: 0, bottom: 0, width: p.edge }} label={String(p.edge)} /> : <Band style={{ left: 24, top: -p.offset, width: 48, height: p.offset }} label={String(p.offset)} /> }}>
          <RuleBody mode="auto" short />
        </PopoverSurface>
      </div>
    </WebWindow>
  );
}
const Placement: Fig = ({ caption }) => {
  const p = pv();
  const shot = (kind: 'below' | 'above' | 'edge') => (
    <Scaled w={PLACE_W} h={PLACE_H} s={0.62}>
      <PlaceWindow kind={kind} />
    </Scaled>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-5">
        <Shot strong="아래(기본)" cap={`트리거 아래 ${p.offset}`}>
          {shot('below')}
        </Shot>
        <Shot strong="아래가 모자라면 위" cap={`트리거 위 ${p.offset} — 높이는 남은 공간까지`}>
          {shot('above')}
        </Shot>
        <Shot strong="옆으로 넘치면 민다" cap={`화면 가장자리와 ${p.edge} 을 남긴다`}>
          {shot('edge')}
        </Shot>
      </div>
    </Panel>
  );
};

// ── 쓰임 ──────────────────────────────────────────────────
// 칸 옆 안내 · 그 칸에 넣을 값 고르기 — 폼 · 상세는 Dialog
function FormPopoverWindow() {
  const p = pv();
  const t = tf();
  const w = 560;
  const top = TRIG_TOP + TRIG_H + p.offset;
  const h = 360;
  return (
    <WebWindow mode="auto" w={w} h={h} url="hr.porest.app">
      <Page mode="auto" title="휴가">
        <span className="absolute left-8 flex h-8 items-center rounded-lg px-3 text-[14px] font-bold text-white" style={{ top: TRIG_TOP, background: rc('bg-brand-solid', 'auto', 'hr') }}>
          휴가 신청
        </span>
      </Page>
      <div className="absolute" style={{ left: 32, top }}>
        <PopoverSurface look={p} title="휴가 신청" scroll={{ scrolled: false }} width={360} footer={<EndButtons items={[{ label: '신청', look: btn('brandSolid', p.footer.button.size, 'hr') }]} />}>
          <Form>
            <F label="사유">
              <TfInputView look={t.input} size="medium" state="enabled" value="가족 행사" />
            </F>
            <F label="날짜">
              <InputButtonView look={hr()} size="medium" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
            </F>
          </Form>
        </PopoverSurface>
      </div>
    </WebWindow>
  );
}
const RoleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
      <Verdict ok note="그 트리거에 대한 것만 — 칸 옆 안내 · 그 칸에 넣을 값 고르기(달력 · 목록)">
        <div className="flex flex-wrap justify-center gap-4">
          <Shot strong="칸 옆 안내">
            <RuleWindow mode="auto" s={0.46} />
          </Shot>
          <Shot strong="고르는 패널">
            <DateWindow mode="auto" s={0.46} />
          </Shot>
        </div>
      </Verdict>
      <Verdict ok={false} note="팝오버에 폼 — 바깥을 누르면 닫혀 쓰던 값이 사라진다. 폼 · 상세는 Dialog">
        <Scaled w={560} h={360} s={0.46}>
          <FormPopoverWindow />
        </Scaled>
      </Verdict>
    </div>
  </Panel>
);

// ── 닫기 — 바깥 · Esc · Tab ─────────────────────────────────
// 열면 초점이 안으로(가두지 않음) → Esc · 바깥은 닫고 트리거로 → 마지막에서 Tab 은 다음 자리로 나가며 닫힌다
function FocusWindow({ step }: { step: 'open' | 'back' | 'tab' }) {
  const p = pv();
  const w = 400;
  const top = TRIG_TOP + TRIG_H + p.offset;
  const h = 32 + top + ruleH(1) + 56;
  return (
    <Scaled w={w} h={h} s={0.62}>
      <WebWindow mode="auto" w={w} h={h} url="hr.porest.app">
        <Page mode="auto" title="휴가">
          <RuleTrigger mode="auto" style={{ left: 32, top: TRIG_TOP }} focus={step === 'back'} />
          <Summary mode="auto" top={TRIG_TOP + TRIG_H + 16} focus={step === 'tab'} />
        </Page>
        {step === 'open' && (
          <div className="absolute" style={{ left: p.edge, top }}>
            <RulePopover mode="auto" avail={w - p.edge * 2} scroll={{ scrolled: false }} marks={{ root: { outline: `${p.ring.width}px solid ${rc('stroke-focus-ring', 'auto', 'hr')}`, outlineOffset: p.ring.offset } }}>
              <RuleBody mode="auto" short />
            </RulePopover>
          </div>
        )}
      </WebWindow>
    </Scaled>
  );
}
const DismissGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap items-start justify-center gap-5">
      <Shot strong="열면" cap="초점이 팝오버 안으로 — 가두지 않는다(딤 · 스크롤 잠금 없음)">
        <FocusWindow step="open" />
      </Shot>
      <Shot strong="Esc · 바깥 누르기" cap="Esc 는 트리거로 — 바깥을 누르면 누른 자리로(초점을 못 받는 자리면 트리거로)">
        <FocusWindow step="back" />
      </Shot>
      <Shot strong="마지막에서 Tab" cap="다음 자리로 나가며 닫힌다 — 초점은 나간 자리에">
        <FocusWindow step="tab" />
      </Shot>
    </div>
  </Panel>
);

// ── 코드 미리보기(실제로 열고 Tab 으로 빠져나간다 — 1280 미만은 같은 내용을 시트로) ─────
const ExInfo: Fig = () => <RulePopoverDemo kit={overlayKit('hr')} text={RULE_TEXT} field={tf().field} />;

// 알림 목록 — Desk 데스크톱 벨(Q-017-3b B): 1280 벨 아래 팝오버 · 1024 아래 시트 · 알림 0개
const NotificationGuide: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="max-w-full overflow-x-auto">
      <div className="mx-auto flex w-max items-start gap-4">
        <Shot cap="1280 — 벨 아래 8 · 벨 오른쪽 끝 맞춤 · 폭 380 · 높이 600 까지(목록만 스크롤 · 끝 흐림)">
          <NotifyDesk w={1280} h={760} s={0.42} />
        </Shot>
        <Shot cap="1024 — 같은 내용을 Bottom Sheet 로(딤 · 최대 480)">
          <NotifyDesk w={1024} h={760} s={0.42} />
        </Shot>
        <Shot cap="알림 0개 — 설명 '새 알림이 없어요' · 모두 읽음 막힘">
          <div className="rounded-xl p-4" style={{ background: rc('bg-layer-basement') }}>
            <NotifyPopover empty />
          </div>
        </Shot>
      </div>
    </div>
  </Figure>
);
const ExNotifications: Fig = () => (
  <figure className="not-prose mb-0 mt-6">
    <div className="flex items-start justify-center overflow-x-auto rounded-t-xl border border-b-0 border-fd-border p-6" style={{ background: rc('bg-layer-basement') }}>
      <NotifyPopover maxHeight={460} />
    </div>
  </figure>
);

export const popoverFigures: Record<string, Fig> = {
  'notification-guide': NotificationGuide,
  'ex-notifications': ExNotifications,
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  placement: Placement,
  'role-guide': RoleGuide,
  'dismiss-guide': DismissGuide,
  'ex-info': ExInfo,
};

