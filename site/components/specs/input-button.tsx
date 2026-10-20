// Input Button 페이지의 그림 — specs/components/input-button.md 의 `[그림: …](../../site/components/specs/input-button.tsx#<id>)` 자리.
// 칸은 input-button.yaml 을 푼 값(selectLook().ib)으로, Field 는 field.yaml, 시트 · 팝오버 · 대화상자는 bottom-sheet · popover · dialog.yaml(overlay-look)로 그린다.
// 달력은 Date Picker(date-picker.yaml), 시각 휠은 Time Picker(time-picker · wheel-picker.yaml)다 — date-look 이 푼 값으로 그린다.
// 휴대폰 화면 안의 칸은 large, 데스크톱 창 안의 칸은 medium 으로 고정한다. 달력을 여는 폰은 스펙의 360 화면이다(시트 달력 312).
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { InputButtonPlayground } from './input-button-playground';
import { avatarLook } from './display-look';
import { PEOPLE } from './input-button-data';
import { CategoryGrid, InputButtonDemo, SheetOverlay, SheetPanel } from './input-button-pickers';
import { searchLook } from './data-look';
import { SearchableListView } from './data-search-view';
import { AvatarView } from './display-view';
import { D, DONE, DeskPopover, PickerPopover, PickerSheet, SCREEN, dk, popFooter, popoverH, sheetFooter } from './date-screens';
import { DatePickerView } from './date-view';
import { TimePickerView } from './wheel-view';
import type { IbState } from './select-look';
import { PHONE_SAFE, overlayKit, ov } from './overlay-screens';
import { Cap, Cell, DeskTxPhone, F, Form, Live, ScaledBox, Surface, desk, hr, tf } from './select-screens';
import { InputButtonView, SelectOpenView, SelectTriggerView } from './select-view';
import { Phone, Verdict, WebWindow, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const px = (v: string) => parseFloat(v);
// 확정 버튼 — 시트는 Bottom Sheet 바닥(large), 팝오버는 Popover 바닥(small)
const done = (brand: 'desk' | 'hr' = 'desk') => ({ sheet: buttonLook({ variant: 'neutralSolid', size: ov(brand).sheet.footer.button.size }, brand), popover: buttonLook({ variant: 'neutralSolid', size: ov(brand).popover.footer.button.size }, brand) });

function Pin({ n }: { n: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
}
const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, background: MARK };

// 휴대폰 화면 — 흰 바탕 폼 + (열면) 시트. 달력 · 시각 시트를 여는 화면은 360 폭(screenW) · 칸이 시트 위로 보이는 높이
function Screen({ title, mode = 'light', children, overlay, scale = 0.52, h = 600, bottom, screenW }: { title: string; mode?: Mode; children: ReactNode; overlay?: ReactNode; scale?: number; h?: number; bottom?: ReactNode; screenW?: number }) {
  return (
    <Phone title={title} mode={mode} scale={scale} h={h} bg="bg-layer-default" overlay={overlay} bottom={bottom} screenW={screenW}>
      <div className="flex flex-col px-6 pt-4" style={{ gap: tf().field.form.gapY }}>
        {children}
      </div>
    </Phone>
  );
}
// 달력 시트 — 제목(고를 값의 종류 "날짜 선택") · Date Picker(시트 폭 − 좌우 24) · 완료. 고르던 날(draft)은 칸 값과 따로다
function DateSheet({ mode = 'light', selected }: { mode?: Mode; selected?: number }) {
  return (
    <SheetOverlay ov={ov()} mode={mode}>
      <PickerSheet mode={mode} title="날짜 선택" footer={sheetFooter(mode, [{ ...DONE, disabled: !selected }])}>
        <DatePickerView kit={dk()} mode={mode} value={selected ? D(10, selected) : undefined} width="100%" />
      </PickerSheet>
    </SheetOverlay>
  );
}
// 달력 시트를 연 폰 — 칸이 시트 위로 보이는 높이
const DATE_PHONE_H = 760;

// ── Overview ──────────────────────────────────────────────
// HR 휴가 신청(데스크톱 · medium) — 날짜 칸 아래 8 에 달력 팝오버(머리 없는 고르는 패널 · Date Picker 336)를 열었다(1280 이상).
// 팝오버(484)가 칸 아래로 다 보이게 페이지의 폼으로 그린다 — 가운데 대화상자 안이면 창이 지나치게 길어진다
function HrDateWindow({ mode }: { mode: Mode }) {
  const h = hr();
  const t = tf();
  const field = px(t.field.label.text.lineHeight) + t.field.gap + h.ib.sizes.medium.h;
  return (
    <DeskPopover
      mode={mode}
      brand="hr"
      w={460}
      title="휴가 신청"
      scale={0.66}
      fieldW={320}
      fieldsH={field * 2 + t.field.form.gapY}
      field={
        <Form>
          <F mode={mode} label="휴가 정책">
            <SelectTriggerView look={h} mode={mode} size="medium" state="enabled" labels={['연차']} />
          </F>
          <F mode={mode} label="날짜">
            <InputButtonView look={h} mode={mode} size="medium" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
          </F>
        </Form>
      }
      popH={popoverH('hr')}
      popover={
        <PickerPopover mode={mode} brand="hr" footer={popFooter(mode, [DONE], 'hr')}>
          <DatePickerView kit={dk('hr')} mode={mode} value={D(10, 14)} />
        </PickerPopover>
      }
    />
  );
}

// 거래 추가(날짜 시트 — 1280 미만) · 휴가 신청(날짜 팝오버 — 1280 이상) — 라이트 줄 · 다크 줄. 고르는 동안 칸의 값은 그대로다
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <DeskTxPhone mode={mode} screenW={SCREEN} overlay={<DateSheet mode={mode} selected={12} />} />
          <HrDateWindow mode={mode} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <InputButtonPlayground looks={{ desk: desk(), hr: hr() }} field={tf().field} done={{ desk: done('desk'), hr: done('hr') }} kits={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = desk();
  const W = 340;
  const b = lk.ib.sizes.large;
  // 위 핀 — 앞 아이콘 · 값 자리 · 지우기 · 뒤 아이콘의 가운데(여백 · 아이콘 · 간격 · 지우기 크기에서)
  const valueStart = b.padX + b.icon + b.gap;
  const suffixX = W - b.padX - b.end / 2;
  const clearX = W - b.padX - b.end - b.gap - b.clear / 2;
  const valueEnd = W - b.padX - b.end - b.gap - b.clear - b.gap;
  const top = [
    { n: 'ⓑ', x: b.padX + b.icon / 2 },
    { n: 'ⓒ', x: (valueStart + valueEnd) / 2 },
    { n: 'ⓓ', x: clearX },
    { n: 'ⓔ', x: suffixX },
  ];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-12 pb-8 pt-12">
        <div className="relative" style={{ width: W }}>
          {top.map((p) => (
            <span key={p.n} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: p.x, top: -30 }}>
              <Pin n={p.n} />
              <span className="h-2 w-px" style={{ background: MARK_LINE }} />
            </span>
          ))}
          <span className="absolute flex -translate-y-1/2 items-center" style={{ left: -34, top: b.h / 2 }}>
            <Pin n="ⓐ" />
            <span className="h-px w-2" style={{ background: MARK_LINE }} />
          </span>
          <InputButtonView look={lk} size="large" state="enabled" prefixIcon="utensils" value="식비 · 점심" clearable suffixIcon="chevron-down" zone={{ prefix: markBox, value: markBox, clear: markBox, suffix: markBox }} />
          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: b.radius, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }} />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted sm:grid-cols-5">
          {[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Prefix'],
            ['ⓒ', 'Value'],
            ['ⓓ', 'Clear Button'],
            ['ⓔ', 'Suffix'],
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
const Size: Fig = ({ caption }) => {
  const lk = desk();
  const cap = (size: 'large' | 'medium', where: string) => {
    const b = lk.ib.sizes[size];
    return (
      <Cap strong={`${size} ${b.h}`}>
        {where} — 글자 {px(b.text.fontSize)} · 모서리 {b.radius} · 아이콘 {b.icon}
      </Cap>
    );
  };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {(['large', 'medium'] as const).map((size) => (
            <div key={size} className="flex min-w-0 flex-col gap-2">
              <Surface>
                <F label="날짜">
                  <InputButtonView look={lk} size={size} state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
                </F>
              </Surface>
              {cap(size, size === 'large' ? '폰 · 앱' : '1280 이상 데스크톱 웹')}
            </div>
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-2">
          <Surface>
            <F label="날짜">
              <InputButtonView look={lk} size="responsive" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
            </F>
          </Surface>
          <Cap strong="responsive(웹 기본)">지금 이 창의 폭으로 — {lk.ib.breakpoint} 미만은 large, 이상은 medium</Cap>
        </div>
      </div>
    </Panel>
  );
};

const STATE_KO: Record<IbState, string> = { enabled: '기본', pressed: '누름', focused: '포커스(키보드)', invalid: '오류', disabled: '비활성', readonly: '읽기 전용' };
const States: Fig = ({ caption }) => {
  const lk = desk();
  const list: IbState[] = ['enabled', 'pressed', 'focused', 'invalid', 'disabled', 'readonly'];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col gap-2">
            <Surface mode={mode}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
                {list.map((st) => (
                  <div key={st} className="flex min-w-0 flex-col gap-1.5">
                    <InputButtonView look={lk} mode={mode} size="large" state={st} value={st === 'enabled' || st === 'invalid' ? undefined : '10월 12일 (월)'} placeholder="날짜 선택" suffixIcon="calendar" />
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
};

const Affix: Fig = ({ caption }) => {
  const lk = desk();
  const ib = lk.ib.sizes.large;
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Cell label={<><b className="pk-text">달력</b> calendar — 누르면 달력이 열린다</>}>
          <F label="날짜">
            <InputButtonView look={lk} size="large" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">시계</b> clock — 시각 휠</>}>
          <F label="시각">
            <InputButtonView look={lk} size="large" state="enabled" value="오후 12:30" suffixIcon="clock" />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">아래 화살표</b> chevron-down — 목록 · 격자</>}>
          <F label="결재자">
            <InputButtonView look={lk} size="large" state="enabled" value="김포레" suffixIcon="chevron-down" />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">고른 카테고리 아이콘</b> 앞 아이콘 — 값에 딸린 아이콘</>}>
          <F label="카테고리">
            <InputButtonView look={lk} size="large" state="enabled" value="식비 · 점심" prefixIcon="utensils" suffixIcon="chevron-down" />
          </F>
        </Cell>
        <Cell className="sm:col-span-2 sm:mx-auto sm:w-[calc(50%-8px)]" label={<><b className="pk-text">단위 글자</b> 앞 · 뒤 글자 — 값과 같은 {px(ib.text.fontSize)} · fg-neutral-subtle</>}>
          <F label="적금 기간">
            <InputButtonView look={lk} size="large" state="enabled" prefix="총" value="12" suffix="개월" suffixIcon="chevron-down" />
          </F>
        </Cell>
      </div>
    </Panel>
  );
};

const Clear: Fig = ({ caption }) => {
  const lk = desk();
  const ib = lk.ib;
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-3">
        <Cell label={<><b className="pk-text">비었을 때</b> 지우기 없음</>}>
          <F label="참조자" indicator="optional">
            <InputButtonView look={lk} size="large" state="enabled" placeholder="참조자 선택" suffixIcon="chevron-down" clearable />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">값이 있을 때</b> 값 바로 뒤 · 뒤 아이콘 앞 — large {ib.sizes.large.clear} · medium {ib.sizes.medium.clear}</>}>
          <F label="참조자" indicator="optional">
            <InputButtonView look={lk} size="large" state="enabled" value="김포레" suffixIcon="chevron-down" clearable />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">막혔을 때</b> 보이지 않는다</>}>
          <F label="참조자" indicator="optional">
            <InputButtonView look={lk} size="large" state="disabled" value="김포레" suffixIcon="chevron-down" clearable />
          </F>
        </Cell>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">{children}</div>;

const AloneGuide: Fig = ({ caption }) => {
  const lk = desk();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="늘 고르는 자리를 연다 — 달력 · 시각 휠 · 격자 · 목록 · 검색 시트">
          <Screen title="거래 추가" screenW={SCREEN} h={DATE_PHONE_H} overlay={<DateSheet selected={12} />}>
            <F mode="light" label="날짜">
              <InputButtonView look={lk} mode="light" size="large" state="pressed" value="10월 12일 (월)" suffixIcon="calendar" />
            </F>
          </Screen>
        </Verdict>
        <Verdict ok={false} note="다른 화면으로 가는 칸 — 그건 List 의 줄이다">
          <Screen title="설정" screenW={SCREEN} h={DATE_PHONE_H}>
            <F mode="light" label="알림">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="켜짐" suffixIcon="chevron-right" />
            </F>
            <F mode="light" label="계좌 관리">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="계좌 3개" suffixIcon="chevron-right" />
            </F>
          </Screen>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const OpenGuide: Fig = ({ caption }) => {
  const lk = desk();
  const h = hr();
  const b = h.ib.sizes.medium;
  const t = tf();
  const o = ov('hr');
  const p = o.popover;
  const popTop = px(t.field.label.text.lineHeight) + t.field.gap + b.h + p.offset;
  // 창 높이 — 창 막대 32 · 위 여백 24 + 칸 + 팝오버(본문 위 여백 · 달력 · 바닥) + 아래 여백 24
  const popWindowH = 32 + 24 + popTop + popoverH('hr') + 24;
  // 팝오버 폭 — 달력 336 + 본문 좌우 여백
  const popW = dk('hr').date.width + p.body.padX * 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Screen title="거래 추가" screenW={SCREEN} h={DATE_PHONE_H} overlay={<DateSheet selected={12} />}>
            <F mode="light" label="날짜">
              <InputButtonView look={lk} mode="light" size="large" state="pressed" value="10월 12일 (월)" suffixIcon="calendar" />
            </F>
          </Screen>
          <Cap strong={`${lk.ib.breakpoint} 미만 — 아래 시트`}>위에 제목(고를 값의 종류) · 닫기, 아래에 완료</Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ScaledBox w={popW + p.edge * 2} h={popWindowH} s={0.8}>
          <WebWindow mode="light" w={popW + p.edge * 2} h={popWindowH} url="hr.groo.app">
            <div className="h-full pt-6" style={{ background: rc('bg-layer-default', 'light', 'hr'), paddingLeft: p.edge, paddingRight: p.edge }}>
              <div className="relative w-[240px]">
                <F mode="light" label="날짜">
                  <InputButtonView look={h} mode="light" size="medium" state="enabled" value="10월 12일 (월)" suffixIcon="calendar" />
                </F>
                <div className="absolute left-0 z-10" style={{ top: popTop }}>
                  <PickerPopover mode="light" brand="hr" footer={popFooter('light', [DONE], 'hr')}>
                    <DatePickerView kit={dk('hr')} mode="light" value={D(10, 12)} />
                  </PickerPopover>
                </div>
              </div>
            </div>
          </WebWindow>
          </ScaledBox>
          <Cap strong={`${lk.ib.breakpoint} 이상 — 칸 아래 ${p.offset} 팝오버`}>칸 왼쪽에 맞추고, 아래가 모자라면 위로</Cap>
        </div>
      </div>
    </Panel>
  );
};

const ConfirmGuide: Fig = ({ caption }) => {
  const lk = desk();
  const k = dk();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='고르는 동안 칸은 그대로(1일) — "완료" 를 누를 때 12일이 들어간다'>
          <Screen title="거래 추가" screenW={SCREEN} h={DATE_PHONE_H} overlay={<DateSheet selected={12} />}>
            <F mode="light" label="날짜">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="10월 1일 (목)" suffixIcon="calendar" />
            </F>
          </Screen>
        </Verdict>
        <Verdict ok={false} note="휠을 굴리는 대로 칸이 바뀐다 — 지나가던 값이 들어가고, 닫아도 되돌릴 수 없다">
          <Screen
            title="거래 추가"
            screenW={SCREEN}
            h={DATE_PHONE_H}
            overlay={
              <SheetOverlay ov={ov()} mode="light">
                <PickerSheet mode="light" title="시간 선택" footer={undefined}>
                  <TimePickerView wheel={k.wheel} time={k.time} mode="light" value={{ hour: 15, minute: 30 }} at={{ minute: 6.45 }} />
                </PickerSheet>
              </SheetOverlay>
            }
          >
            <F mode="light" label="시각">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="오후 3:30" suffixIcon="clock" />
            </F>
          </Screen>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const ListGuide: Fig = ({ caption }) => {
  const lk = desk();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2">
          <Screen
            title="거래 추가"
            overlay={
              <SheetOverlay ov={ov()} mode="light">
                <SheetPanel ov={ov()} mode="light" title="카테고리" safe={PHONE_SAFE}>
                  <CategoryGrid look={lk} mode="light" selected="breakfast" pressed="lunch" />
                </SheetPanel>
              </SheetOverlay>
            }
          >
            <F mode="light" label="카테고리">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="식비 · 아침" prefixIcon="sunrise" suffixIcon="chevron-down" />
            </F>
          </Screen>
          <Cap strong="누르는 순간 고른다">격자 · 하나 고르는 목록에는 &quot;완료&quot; 가 없다</Cap>
        </div>
        <ArrowRight aria-hidden size={24} className="rotate-90 pk-muted md:rotate-0" />
        <div className="flex flex-col items-center gap-2">
          <Screen title="거래 추가">
            <F mode="light" label="카테고리">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="식비 · 점심" prefixIcon="utensils" suffixIcon="chevron-down" />
            </F>
          </Screen>
          <Cap strong="닫히고 칸에 들어간다">여럿 고르는 목록만 &quot;완료&quot; 로 넣는다</Cap>
        </div>
      </div>
    </Panel>
  );
};

// 검색 시트 — 위 밑줄형 검색칸(Searchable List · input.md "화면에 입력이 하나뿐이면 밑줄"), 아래 결재자 목록(List 줄 + 오른쪽 라디오)
const SearchGuide: Fig = ({ caption }) => {
  const lk = desk();
  const sl = searchLook();
  const all = [{ items: PEOPLE.map((p) => ({ value: p.value, label: p.name, description: p.team })) }];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="시트 위에 밑줄형 검색칸, 아래 목록 — 치는 대로 걸러지고, 고르면 닫힌다">
          <Screen
            title="휴가 신청"
            overlay={
              <SheetOverlay ov={ov()} mode="light">
                <SheetPanel ov={ov()} mode="light" title="결재자" bodyPad={false} safe={PHONE_SAFE}>
                  <SearchableListView
                    look={sl}
                    mode="light"
                    groups={[{ items: PEOPLE.map((p) => ({ value: p.value, title: p.name, detail: p.team, detailText: p.team })) }]}
                    prefixes={Object.fromEntries(PEOPLE.map((p) => [p.value, <AvatarView key={p.value} look={avatarLook()} mode="light" size={sl.prefix.avatar.two} name={p.name} />]))}
                    prefixKind="avatar"
                    query="김"
                    focused
                    placeholder="이름 · 팀 검색"
                    ariaLabel="결재자"
                  />
                </SheetPanel>
              </SheetOverlay>
            }
          >
            <F mode="light" label="결재자">
              <InputButtonView look={lk} mode="light" size="large" state="pressed" placeholder="결재자 선택" suffixIcon="chevron-down" />
            </F>
          </Screen>
        </Verdict>
        <Verdict ok={false} note="검색 없는 긴 Select — 스크롤로 한 사람씩 찾아야 한다">
          <Screen title="휴가 신청">
            <F mode="light" label="결재자">
              <SelectOpenView look={lk} mode="light" size="large" groups={all} placeholder="결재자 선택" placement="overlay" maxHeight={340} scrollTop={120} />
            </F>
          </Screen>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 고를 수 있다 — 이 창의 폭으로 시트 · 팝오버) ─────
const ExDate: Fig = () => (
  <Live>
    <InputButtonDemo look={desk()} kit={overlayKit()} field={tf().field} kind="date" date={dk()} label="날짜" placeholder="날짜 선택" initial="12" done={done()} />
  </Live>
);
const ExList: Fig = () => (
  <Live>
    <InputButtonDemo look={desk()} kit={overlayKit()} field={tf().field} kind="category" label="카테고리" placeholder="카테고리 선택" initial="lunch" />
  </Live>
);
const ExSearch: Fig = () => (
  <Live>
    <InputButtonDemo look={desk()} kit={overlayKit()} avatar={avatarLook()} search={searchLook()} field={tf().field} input={tf().input} kind="people" label="참조자" indicator="optional" placeholder="참조자 선택" clearable initial="pore" />
  </Live>
);
const ExStates: Fig = () => {
  const lk = desk();
  return (
    <Live>
      <Form>
        <InputButtonDemo look={lk} kit={overlayKit()} field={tf().field} kind="date" date={dk()} label="날짜" placeholder="날짜 선택" invalid errorMessage="날짜를 골라주세요." done={done()} />
        <F label="날짜">
          <InputButtonView look={lk} disabled value="10월 1일 (목)" suffixIcon="calendar" ariaLabel="날짜, 10월 1일 (목)" />
        </F>
        <F label="입사일">
          <InputButtonView look={lk} readOnly value="2024년 3월 4일 (월)" suffixIcon="calendar" ariaLabel="입사일, 2024년 3월 4일 (월)" />
        </F>
      </Form>
    </Live>
  );
};

export const inputButtonFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  states: States,
  affix: Affix,
  clear: Clear,
  'alone-guide': AloneGuide,
  'open-guide': OpenGuide,
  'confirm-guide': ConfirmGuide,
  'list-guide': ListGuide,
  'search-guide': SearchGuide,
  'ex-date': ExDate,
  'ex-list': ExList,
  'ex-search': ExSearch,
  'ex-states': ExStates,
};
