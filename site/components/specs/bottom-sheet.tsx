// Bottom Sheet 페이지의 그림 — specs/components/bottom-sheet.md 의 `[그림: …](../../site/components/specs/bottom-sheet.tsx#<id>)` 자리.
// 시트는 bottom-sheet.yaml 을 푼 값(overlayLook().sheet)으로, 칸 · 목록 줄 · 버튼은 그 컴포넌트의 YAML 로 그린다.
// 폰 그림의 안전 영역(홈 표시줄)은 기기 값이라 그림에서 정한다(PHONE_SAFE).
import { dateKit } from './date-look';
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { chipLook } from './chip-look';
import { listLook } from './list-look';
import { BottomSheetPlayground } from './overlay-playground';
import { PeriodPickDemo, TxFormSheetDemo } from './overlay-demos';
import {
  AlertOn,
  Band,
  CATEGORY,
  CategorySheet,
  DeleteAlert,
  DeleteFooter,
  DetailSheet,
  LedgerPhone,
  Legend,
  PHONE_SAFE,
  PeriodList,
  PeriodSheet,
  SheetOn,
  TxAddSheet,
  btn,
  Note,
  Shot,
  markBox,
  ov,
  overlayKit,
  pinAt,
  pinStyle,
  tileRowHeight,
} from './overlay-screens';
import { DimView, GestureMark, SheetButtons, SheetSurface } from './overlay-view';
import { F, Form, desk, tf } from './select-screens';
import { InputButtonView } from './select-view';
import { TfInputView } from './text-field-view';
import { Phone, Row, Verdict, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const sh = () => ov().sheet;
const px = (v: string) => parseFloat(v);
const line: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;
const Shots = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-start justify-center gap-4">{children}</div>;
const sheetBtn = (variant: string) => btn(variant, sh().footer.button.size);

// ── Overview ──────────────────────────────────────────────
// 거래 추가(입력 폼) · 기간(고르기) · 거래 상세(조회) — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LedgerPhone mode={mode} scale={0.52} overlay={<SheetOn mode={mode}><TxAddSheet mode={mode} /></SheetOn>} />
          <LedgerPhone mode={mode} scale={0.52} overlay={<SheetOn mode={mode}><PeriodSheet mode={mode} /></SheetOn>} />
          <LedgerPhone mode={mode} scale={0.52} overlay={<SheetOn mode={mode}><DetailSheet mode={mode} /></SheetOn>} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <BottomSheetPlayground kits={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} lists={{ desk: listLook('desk'), hr: listLook('hr') }} field={tf().field} input={tf().input} />;

// ── Anatomy ───────────────────────────────────────────────
// 기간 시트에 스냅 높이를 둔 모습(손잡이) — 부위마다 점선 · 핀
const Anatomy: Fig = ({ caption }) => {
  const s = sh();
  const c = s.close;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <LedgerPhone
          mode="auto"
          scale={1}
          overlay={
            <DimView dim={s.dim} place="end">
              {pinStyle('ⓐ', { right: 16, top: 58 })}
              <PeriodSheet
                mode="auto"
                handle
                marks={{ header: line, body: line, footer: line, close: markBox, handle: markBox }}
                decor={{
                  root: (
                    <>
                      {pinStyle('ⓑ', { left: 6, top: -26 })}
                      {pinStyle('ⓓ', { right: c.right + c.size + 8, top: c.top + (c.size - 20) / 2 })}
                      {pinStyle('ⓖ', { left: `calc(50% + ${s.handle.width / 2 + 8}px)`, top: s.handle.top + s.handle.height / 2 - 10 })}
                    </>
                  ),
                  header: pinAt('ⓒ', 2, s.header.padTop + 5),
                  body: pinAt('ⓔ', 2, 13),
                  footer: pinAt('ⓕ', 2, s.footer.padTop + 14),
                }}
              />
            </DimView>
          }
        />
        <Legend
          items={[
            ['ⓐ', 'Overlay'],
            ['ⓑ', 'Container'],
            ['ⓒ', 'Header'],
            ['ⓓ', 'Close Button'],
            ['ⓔ', 'Body'],
            ['ⓕ', 'Footer'],
            ['ⓖ', 'Handle — 스냅 높이를 둘 때만'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── 머리 · 본문 · 바닥의 여백 ──────────────────────────────
// 입력 폼(본문 좌우 24 · 바닥 버튼 하나) · 고르기(목록 줄이 여백을 가진다 · 바닥 버튼 둘) — 분홍 띠가 여백
function HeaderBands({ close = true, description = true }: { close?: boolean; description?: boolean }) {
  const s = sh();
  const h = s.header;
  return (
    <>
      <Band style={{ left: 0, right: 0, top: 0, height: h.padTop }} label={String(h.padTop)} />
      <Band style={{ left: 0, top: h.padTop, bottom: h.padBottom, width: h.padX }} label={String(h.padX)} />
      <Band style={{ right: 0, top: h.padTop, bottom: h.padBottom, width: close ? h.padRightClose : h.padX, alignItems: 'flex-end', paddingBottom: 2 }} label={String(close ? h.padRightClose : h.padX)} />
      <Band style={{ left: 0, right: 0, bottom: 0, height: h.padBottom }} label={String(h.padBottom)} />
      {description && <Band style={{ left: h.padX, right: close ? h.padRightClose : h.padX, top: h.padTop + px(s.title.lineHeight), height: h.gap }} label={String(h.gap)} />}
    </>
  );
}
function FooterBands({ two = false }: { two?: boolean }) {
  const f = sh().footer;
  return (
    <>
      <Band style={{ left: 0, right: 0, top: 0, height: f.padTop }} label={String(f.padTop)} />
      <Band style={{ left: 0, right: 0, bottom: 0, height: f.padBottom }} label={String(f.padBottom)} />
      <Band style={{ left: 0, top: f.padTop, bottom: f.padBottom, width: f.padX }} label={String(f.padX)} />
      <Band style={{ right: 0, top: f.padTop, bottom: f.padBottom, width: f.padX }} />
      {two && <Band style={{ left: `calc(50% - ${f.gap / 2}px)`, top: f.padTop, bottom: f.padBottom, width: f.gap }} label={String(f.gap)} />}
    </>
  );
}
// 안전 영역 — 빗금(기기마다 다른 값이라 수치 없이)
const SafeBand = () => <Band style={{ left: 0, right: 0, bottom: 0, height: PHONE_SAFE, background: `repeating-linear-gradient(135deg, ${MARK_LINE}55 0 3px, transparent 3px 7px)` }} />;
// 시트만 — 폰 아래쪽을 잘라 그린다(딤 조금 · 시트)
function Crop({ children, w = 360 }: { children: ReactNode; w?: number }) {
  return (
    <div className="relative flex flex-col justify-end overflow-hidden rounded-b-[28px]" style={{ width: w, paddingTop: 36, background: rc('bg-layer-default'), border: '8px solid var(--p-frame)', borderTop: 0 }}>
      <DimView dim={sh().dim} place="end" style={{ position: 'absolute' }} />
      <div className="relative">{children}</div>
    </div>
  );
}
const Layout: Fig = ({ caption }) => {
  const s = sh();
  const lk = desk();
  const t = tf();
  const rowPad = listLook('desk').faces.none.light.enabled.pad.x;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Shot strong="입력 폼" cap={`본문 좌우 ${s.body.padX} · 바닥 버튼 하나는 폭 전체`}>
          <Crop>
            <SheetSurface
              look={s}
              title="거래 추가"
              description="금액만 넣어도 저장할 수 있어요."
              safe={PHONE_SAFE}
              marks={{ closeTarget: markBox }}
              decor={{ header: <HeaderBands />, footer: <FooterBands />, root: <SafeBand />, body: <><Band style={{ left: 0, top: 0, bottom: 0, width: s.body.padX }} label={String(s.body.padX)} /><Band style={{ right: 0, top: 0, bottom: 0, width: s.body.padX }} /></> }}
              footer={<SheetButtons items={[{ label: '저장', look: sheetBtn('neutralSolid') }]} />}
            >
              <Form>
                <F label="금액">
                  <TfInputView look={t.input} size="large" state="enabled" value="12,000" suffix="원" />
                </F>
                <F label="날짜">
                  <InputButtonView look={lk} size="large" state="enabled" value="10월 1일 (목)" suffixIcon="calendar" />
                </F>
              </Form>
            </SheetSurface>
          </Crop>
        </Shot>
        <Shot strong="고르기" cap={`목록 줄은 줄 여백 ${rowPad} 을 가진다(본문 좌우 여백 없이) · 버튼 둘은 반씩`}>
          <Crop>
            <SheetSurface
              look={s}
              title="기간"
              description="고른 기간의 거래만 보여요."
              safe={PHONE_SAFE}
              bodyPad={false}
              decor={{ footer: <FooterBands two />, root: <SafeBand />, body: <Band style={{ left: 0, top: 0, bottom: 0, width: rowPad }} label={String(rowPad)} /> }}
              footer={
                <SheetButtons
                  items={[
                    { label: '초기화', look: sheetBtn('neutralWeak') },
                    { label: '적용', look: sheetBtn('neutralSolid') },
                  ]}
                />
              }
            >
              <PeriodList mode="auto" />
            </SheetSurface>
          </Crop>
        </Shot>
      </div>
      <p className="mx-auto mt-4 max-w-[600px] text-center text-[12px] leading-5 text-fd-muted-foreground">
        머리 위 {s.header.padTop} · 아래 {s.header.padBottom} · 좌우 {s.header.padX}(닫기 버튼이 있으면 오른쪽 {s.header.padRightClose}) · 제목 {px(s.title.fontSize)} / {px(s.title.lineHeight)} · {s.title.fontWeight} ↔ 설명 {px(s.description.fontSize)} / {px(s.description.lineHeight)} 사이 {s.header.gap}
        <br />
        닫기 {s.close.size} 원 · 누르는 영역 {s.close.target}(분홍) · 위 {s.close.top} · 오른쪽 {s.close.right} — 바닥 위 {s.footer.padTop} · 아래 {s.footer.padBottom} + 안전 영역(맨 아래 빗금, 기기마다) · 버튼 사이 {s.footer.gap} · Button {s.footer.button.size} {s.footer.button.height} · 바닥이 없으면 본문 아래 {s.body.padBottom} + 안전 영역
      </p>
    </Panel>
  );
};

// ── 손잡이 ────────────────────────────────────────────────
// 스냅 높이(절반 · 가득)가 있는 시트 — 절반에 멈춘 모습. 가득 높이를 점선으로
const MONTH_TX: [string, string, string, string][] = [
  ['점심 식사', '식비 · 10월 1일', '−12,000원', 'orange'],
  ['지하철', '교통 · 10월 1일', '−1,450원', 'blue'],
  ['스타벅스', '카페 · 9월 30일', '−5,600원', 'orange'],
  ['월급', '수입 · 9월 25일', '+3,200,000원', 'green'],
  ['영화', '문화 · 9월 20일', '−15,000원', 'violet'],
  ['편의점', '식비 · 9월 18일', '−4,300원', 'orange'],
  ['택시', '교통 · 9월 15일', '−9,800원', 'blue'],
];
function SnapPhone({ mode = 'auto' }: { mode?: Mode }) {
  const s = sh();
  const snap = 0.5;
  return (
    <LedgerPhone
      mode={mode}
      scale={0.6}
      title="자산"
      overlay={
        <DimView dim={s.dim} mode={mode} place="end">
          {/* 가득 — 화면 높이의 90%(시트의 상한) */}
          <span aria-hidden className="absolute left-0 right-0" style={{ top: `${(1 - s.maxHeight) * 100}%`, borderTop: `2px dashed ${MARK_LINE}`, zIndex: 3 }}>
            <span className="absolute right-3 top-1 rounded px-1.5 text-[12px] font-bold leading-5 text-white" style={{ background: MARK_LINE }}>
              가득 {Math.round(s.maxHeight * 100)}%
            </span>
          </span>
          <SheetSurface look={s} mode={mode} title="현대카드 M" description="10월 결제 예정 352,400원" handle safe={PHONE_SAFE} style={{ height: `${snap * 100}%` }} decor={{ root: <span className="absolute right-3 rounded px-1.5 text-[12px] font-bold leading-5 text-white" style={{ top: -26, background: MARK_LINE, zIndex: 3 }}>절반 {snap * 100}%</span> }}>
            <div className="-mt-1">
              {MONTH_TX.map(([t, sub, a, hue]) => (
                <Row key={t} mode={mode} title={t} sub={sub} amount={a} hue={hue} />
              ))}
            </div>
          </SheetSurface>
        </DimView>
      }
    />
  );
}
const Handle: Fig = ({ caption }) => {
  const s = sh();
  const h = s.handle;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="절반 · 가득 같은 스냅 높이가 있으면 손잡이를 단다 — 누르면 다음(더 높은) 스냅 높이로, 가장 높은 높이에서 누르면 닫힌다">
          <SnapPhone />
        </Verdict>
        <Verdict ok={false} note="스냅 높이가 없는데 손잡이를 장식으로 — 조회 · 고르기 시트는 손잡이 없이도 끌어 닫힌다">
          <LedgerPhone mode="auto" scale={0.6} overlay={<SheetOn mode="auto"><PeriodSheet mode="auto" handle /></SheetOn>} />
        </Verdict>
      </Pair>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">
        손잡이 {h.width} × {h.height} · 시트 위에서 {h.top} · 가로 가운데 · 누르는 영역 {h.target} × {h.target} · 보조 기술에는 숨긴다(SEED — 누르면 더 높은 스냅, 가장 높은 데서 닫힘)
      </p>
    </Panel>
  );
};

// ── 본문 끝 흐림 ──────────────────────────────────────────
// 카테고리 고르기(길이가 데이터에 따라 느는 목록 — scrollFog) — 맨 위 · 끝까지 내린 모습. 위 · 아래 흐림은 늘 그대로(마스크)이고
// 본문 안 여백이 그만큼이라 맨 위 · 끝에서는 흐림이 빈 여백 위에 놓인다. 시트는 화면 높이의 상한까지 차고 본문만 스크롤된다
const FOG_PHONE = 640;
const ScrollFogFigure: Fig = ({ caption }) => {
  const s = sh();
  const f = s.fog;
  // kit Phone 의 화면(틀 8 안쪽) · 시트 상한 · 머리(제목 한 줄)
  const screenH = FOG_PHONE - 16;
  const head = s.header.padTop + px(s.title.lineHeight) + s.header.padBottom;
  const bodyH = screenH * s.maxHeight - head - PHONE_SAFE;
  const end = f.padTop + CATEGORY.length * tileRowHeight() + f.padBottom - bodyH;
  const edge = { background: 'transparent', boxShadow: `inset 0 0 0 1px ${MARK_LINE}` };
  const bands = (
    <>
      <Band style={{ left: 0, right: 0, top: head, height: f.top, ...edge }} label={`위 ${f.top}`} />
      <Band style={{ left: 0, right: 0, bottom: PHONE_SAFE, height: f.bottom, ...edge }} label={`아래 ${f.bottom}`} />
    </>
  );
  const phone = (offset: number) => (
    <LedgerPhone
      mode="auto"
      scale={0.6}
      h={FOG_PHONE}
      overlay={
        <SheetOn mode="auto">
          <CategorySheet mode="auto" maxHeight={`${s.maxHeight * 100}%`} offset={offset} decor={{ root: bands }} />
        </SheetOn>
      }
    />
  );
  return (
    <Figure caption={caption}>
      <div className="flex items-start justify-center gap-6">
        <div className="w-[240px]">
          <Shot strong="맨 위" cap={`위 ${f.top} 흐림은 빈 여백(${f.padTop}) 위 — 아래 ${f.bottom} 이 흐려 더 있음을 알린다`}>
            {phone(0)}
          </Shot>
        </div>
        <div className="w-[240px]">
          <Shot strong="끝까지 내렸을 때" cap={`아래 ${f.bottom} 흐림은 빈 여백(${f.padBottom}) 위 — 마지막 줄은 흐림 밖에 다 보인다`}>
            {phone(end)}
          </Shot>
        </div>
      </div>
    </Figure>
  );
};

// ── 쓰임 ──────────────────────────────────────────────────
function ConfirmSheet({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <SheetSurface
      look={sh()}
      mode={mode}
      title="거래를 삭제할까요?"
      description="삭제한 거래는 되돌릴 수 없어요."
      safe={PHONE_SAFE}
      footer={
        <SheetButtons
          mode={mode}
          items={[
            { label: '취소', look: sheetBtn('neutralWeak') },
            { label: '삭제', look: sheetBtn('criticalSolid') },
          ]}
        />
      }
    />
  );
}
const RoleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <div className="flex min-w-0 flex-[2] flex-col">
        <Verdict ok note="폼 · 고르기 · 조회는 시트 — 되돌릴 수 없는 확인은 가운데 Alert Dialog(바깥을 눌러도 닫히지 않는다)">
          <div className="flex flex-wrap justify-center gap-4">
            <Shot strong="고르기 — 시트">
              <LedgerPhone mode="auto" scale={0.42} overlay={<SheetOn mode="auto"><PeriodSheet mode="auto" /></SheetOn>} />
            </Shot>
            <Shot strong="확인 — Alert Dialog">
              <LedgerPhone mode="auto" scale={0.42} overlay={<AlertOn mode="auto"><DeleteAlert mode="auto" /></AlertOn>} />
            </Shot>
          </div>
        </Verdict>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Verdict ok={false} note="되돌릴 수 없는 확인을 시트로 — 끌어내리기 · 바깥 누르기로 지나칠 수 있다">
          <LedgerPhone mode="auto" scale={0.42} overlay={<SheetOn mode="auto"><ConfirmSheet /></SheetOn>} />
        </Verdict>
      </div>
    </div>
  </Panel>
);

// ── 높이 ──────────────────────────────────────────────────
const CARD_TX: [string, string, string, string][] = [
  ['점심 식사', '10월 1일 · 일시불', '−12,000원', 'orange'],
  ['스타벅스', '9월 30일 · 일시불', '−5,600원', 'orange'],
  ['쿠팡', '9월 29일 · 3개월 할부', '−42,000원', 'violet'],
  ['택시', '9월 28일 · 일시불', '−9,800원', 'blue'],
  ['영화', '9월 27일 · 일시불', '−15,000원', 'violet'],
  ['마트', '9월 26일 · 일시불', '−61,200원', 'green'],
  ['주유', '9월 25일 · 일시불', '−70,000원', 'blue'],
  ['병원', '9월 24일 · 일시불', '−8,500원', 'green'],
  ['서점', '9월 23일 · 일시불', '−18,000원', 'violet'],
  ['편의점', '9월 22일 · 일시불', '−4,300원', 'orange'],
];
function CardPage({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <Phone title="현대카드 M" mode={mode} scale={0.42} h={640} bg="bg-layer-default">
      <div className="flex flex-col px-6 pt-2">
        <span className="text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
          10월 결제 예정
        </span>
        <span className="pb-2 text-[24px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
          352,400원
        </span>
        {CARD_TX.map(([t, sub, a, hue]) => (
          <Row key={t} mode={mode} title={t} sub={sub} amount={a} hue={hue} />
        ))}
      </div>
    </Phone>
  );
}
function TallSheet({ mode = 'auto' }: { mode?: Mode }) {
  const s = sh();
  return (
    <DimView dim={s.dim} mode={mode} place="end">
      <span aria-hidden className="absolute left-0 right-0" style={{ top: `${(1 - s.maxHeight) * 100}%`, borderTop: `2px dashed ${MARK_LINE}`, zIndex: 3 }}>
        <span className="absolute right-3 -top-6 rounded px-1.5 text-[12px] font-bold leading-5 text-white" style={{ background: MARK_LINE }}>
          {Math.round(s.maxHeight * 100)}%
        </span>
      </span>
      <SheetSurface look={s} mode={mode} title="현대카드 M" description="10월 결제 예정 352,400원" safe={PHONE_SAFE} maxHeight={`${s.maxHeight * 100}%`}>
        <div className="relative">
          {CARD_TX.map(([t, sub, a, hue]) => (
            <Row key={t} mode={mode} title={t} sub={sub} amount={a} hue={hue} />
          ))}
          {/* 스크롤 막대 — 시트 안에서 버티는 스크롤 */}
          <span aria-hidden className="absolute -right-3 top-2 h-24 w-1 rounded-full" style={{ background: rc('stroke-neutral-weak', mode) }} />
        </div>
      </SheetSurface>
    </DimView>
  );
}
const HeightGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <div className="flex min-w-0 flex-[2] flex-col">
        <Verdict ok note={`시트는 내용만큼 — 화면 높이의 ${Math.round(sh().maxHeight * 100)}% 를 넘을 내용(카드 상세 · 종목 검색)은 페이지로 옮긴다`}>
          <div className="flex flex-wrap justify-center gap-4">
            <Shot strong="내용만큼">
              <LedgerPhone mode="auto" scale={0.42} overlay={<SheetOn mode="auto"><PeriodSheet mode="auto" /></SheetOn>} />
            </Shot>
            <Shot strong="긴 내용 — 페이지">
              <CardPage />
            </Shot>
          </div>
        </Verdict>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Verdict ok={false} note="넘치는 내용을 시트 안 스크롤로 버틴다 — 뒤로 가기 · 주소가 없고, 끌어 닫기와 스크롤이 겹친다">
          <LedgerPhone mode="auto" scale={0.42} overlay={<TallSheet />} />
        </Verdict>
      </div>
    </div>
  </Panel>
);

// ── 닫기 — 입력 폼은 바깥 · 끌기로 닫히지 않는다 ─────────────────
// 손가락 — 딤 위를 누르고, 시트 머리를 아래로 끈다. 짧은 말이 결과
function DismissPhone({ form }: { form: boolean }) {
  const s = sh();
  const tap = <GestureMark kind="tap" x="50%" y={64} note={form ? '눌러도 그대로' : '누르면 닫힌다'} ok={!form} />;
  const drag = <GestureMark kind="drag" x="62%" y={0} drag={34} note={form ? '끌어도 그대로' : '끌면 닫힌다'} ok={!form} />;
  return (
    <LedgerPhone
      mode="auto"
      scale={0.6}
      overlay={
        <SheetOn mode="auto">
          {tap}
          {form ? <TxAddSheet mode="auto" decor={{ root: drag }} /> : <DetailSheet mode="auto" decor={{ root: drag }} />}
        </SheetOn>
      }
    />
  );
}
const DismissGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Shots>
      <Shot strong="입력 폼 — 거래 추가" cap="위 닫기 · 뒤로 가기 · Esc 로 닫는다. 바뀐 값이 있으면 먼저 묻는다">
        <DismissPhone form />
      </Shot>
      <Shot strong="조회 · 고르기 — 거래 상세" cap="바깥 누르기 · 끌어내리기 · 위 닫기 · Esc 로 닫힌다">
        <DismissPhone form={false} />
      </Shot>
    </Shots>
  </Panel>
);

// ── 닫기 버튼과 바닥 버튼 ───────────────────────────────────
const ButtonsGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4 lg:flex-row">
      <div className="flex min-w-0 flex-[2] flex-col">
        <Verdict ok note="입력 폼은 위 닫기 + 바닥 저장 하나 · 고르기는 고른 것을 넣을 때만 바닥 버튼(보조 왼쪽 · 주 버튼 오른쪽, 반씩)">
          <div className="flex flex-wrap justify-center gap-4">
            <Shot strong="입력 폼">
              <LedgerPhone mode="auto" scale={0.42} overlay={<SheetOn mode="auto"><TxAddSheet mode="auto" /></SheetOn>} />
            </Shot>
            <Shot strong="고르기">
              <LedgerPhone mode="auto" scale={0.42} overlay={<SheetOn mode="auto"><PeriodSheet mode="auto" /></SheetOn>} />
            </Shot>
          </div>
        </Verdict>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Verdict ok={false} note="위 닫기와 바닥 취소를 함께 — 닫는 길이 둘이라 어느 쪽인지 망설인다">
          <LedgerPhone
            mode="auto"
            scale={0.42}
            overlay={
              <SheetOn mode="auto">
                <TxAddSheet
                  mode="auto"
                  footer={
                    <SheetButtons
                      items={[
                        { label: '취소', look: sheetBtn('neutralWeak') },
                        { label: '저장', look: sheetBtn('neutralSolid') },
                      ]}
                    />
                  }
                />
              </SheetOn>
            }
          />
        </Verdict>
      </div>
    </div>
  </Panel>
);

// 바닥 왼쪽 [삭제] — 목록 줄을 눌러 들어간 시트에서 동작이 삭제 하나뿐일 때(2026-10-25 — menu.md "줄의 동작")
const DeleteGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap items-start justify-center gap-4">
      <Shot strong="상세 — 삭제 · 수정" cap="[삭제] 는 왼쪽 ghost critical 글자만큼, 주 버튼 [수정] 이 남은 폭">
        <LedgerPhone mode="auto" scale={0.5} overlay={<SheetOn mode="auto"><DetailSheet mode="auto" footer={<DeleteFooter mode="auto" primary="수정" />} /></SheetOn>} />
      </Shot>
      <Shot strong="수정이 없는 조회 — 삭제 하나" cap="주 버튼이 없으면 [삭제] 하나만 왼쪽에. 동작이 여럿이면 바닥이 아니라 머리 ⋮ → Menu Sheet">
        <LedgerPhone mode="auto" scale={0.5} overlay={<SheetOn mode="auto"><DetailSheet mode="auto" footer={<DeleteFooter mode="auto" />} /></SheetOn>} />
      </Shot>
    </div>
  </Panel>
);

// ── 코드 미리보기(실제로 열고 닫는다) ────────────────────────
const ExPick: Fig = () => <PeriodPickDemo kit={overlayKit()} chip={chipLook()} list={listLook()} />;
const ExForm: Fig = () => <TxFormSheetDemo kit={overlayKit()} date={dateKit()} sel={desk()} field={tf().field} input={tf().input} cta={btn('neutralSolid', 'small')} />;

export const bottomSheetFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  handle: Handle,
  scroll: ScrollFogFigure,
  'role-guide': RoleGuide,
  'height-guide': HeightGuide,
  'dismiss-guide': DismissGuide,
  'buttons-guide': ButtonsGuide,
  'delete-guide': DeleteGuide,
  'ex-pick': ExPick,
  'ex-form': ExForm,
};

