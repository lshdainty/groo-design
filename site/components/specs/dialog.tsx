// Dialog 페이지의 그림 — specs/components/dialog.md 의 `[그림: …](../../site/components/specs/dialog.tsx#<id>)` 자리.
// 대화상자는 dialog.yaml 을 푼 값(overlayLook().dialog)으로, 1280 미만의 시트는 bottom-sheet.yaml(overlayLook().sheet)로 그린다.
// 칸 · 목록 줄 · 버튼은 그 컴포넌트의 YAML 로 그린다. 데스크톱 창 · 폰의 크기는 그림 안에서 정한다.
import { dateKit } from './date-look';
import type { ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { listLook } from './list-look';
import type { RowSpec } from './list-shared';
import { DialogPlayground } from './overlay-playground';
import { DetailDialogDemo, LeaveDialogDemo } from './overlay-demos';
import {
  Band,
  CenterOn,
  DETAIL,
  DetailDialog,
  DetailList,
  LeaveDialog,
  LedgerPhone,
  Legend,
  Scaled,
  SheetOn,
  TxAddDialog,
  TxAddSheet,
  WebPage,
  btn,
  dialogChrome,
  leaveFieldsHeight,
  listRowHeight,
  markBox,
  Note,
  Shot,
  ov,
  overlayKit,
  pinAt,
  txFieldsHeight,
} from './overlay-screens';
import { DialogSurface, EndButtons, GestureMark, type OvDecor, type OvMarks } from './overlay-view';
import { hr, tf } from './select-screens';
import { Verdict, WebWindow, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const dg = () => ov().dialog;
const line = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
// 데스크톱 창 — 뒤 페이지 위 딤 · 가운데 대화상자. 창 높이는 대화상자 + 위아래 margin
function Win({ mode = 'auto', w = 600, h, brand = 'desk', title, children, s = 1, url }: { mode?: Mode; w?: number; h: number; brand?: 'desk' | 'hr'; title: string; children: ReactNode; s?: number; url?: string }) {
  return (
    <Scaled w={w} h={h} s={s}>
      <WebWindow mode={mode} w={w} h={h} url={url ?? (brand === 'hr' ? 'hr.porest.app' : 'desk.porest.app')}>
        <WebPage mode={mode} title={title} brand={brand} />
        {children}
      </WebWindow>
    </Scaled>
  );
}
// 대화상자 높이 — 머리(설명 있으면 두 줄) + 본문 + 바닥(없으면 바닥 아래 여백만)
const dialogH = (body: number, o: { description?: boolean; footer?: boolean; brand?: 'desk' | 'hr' } = {}) => {
  const c = dialogChrome(o.brand ?? 'desk', o.description);
  return c.head + body + (o.footer === false ? dg().body.padBottom : c.foot);
};
const LEAVE_H = () => dialogH(leaveFieldsHeight('medium'), { description: true, brand: 'hr' });
const DETAIL_H = () => dialogH(DETAIL.length * listRowHeight(), { footer: false });
const TXADD_H = () => dialogH(txFieldsHeight('medium'));
const MARGIN = 24;
const winH = (dialog: number) => 32 + MARGIN * 2 + dialog;

// ── Overview ──────────────────────────────────────────────
// HR 휴가 신청(입력 폼 — 바닥 취소 · 신청) · Desk 거래 상세(조회 — 머리 닫기) — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => {
  const h = winH(Math.max(LEAVE_H(), DETAIL_H()));
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex items-start gap-4">
            <Win mode={mode} w={560} h={h} s={0.52} brand="hr" title="휴가">
              <CenterOn mode={mode}>
                <LeaveDialog mode={mode} />
              </CenterOn>
            </Win>
            <Win mode={mode} w={560} h={h} s={0.52} title="가계부">
              <CenterOn mode={mode}>
                <DetailDialog mode={mode} />
              </CenterOn>
            </Win>
          </div>
        ))}
      </div>
    </Figure>
  );
};

const Playground: Fig = () => <DialogPlayground kits={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} lists={{ desk: listLook('desk'), hr: listLook('hr') }} field={tf().field} input={tf().input} />;

// ── Anatomy ───────────────────────────────────────────────
// 거래 상세(조회 — 머리 닫기 · 바닥은 다른 동작이 있을 때만: 삭제 · 수정). 길이가 데이터에 따라 느는 본문이라 끝 흐림(scrollFog)을 걸었고,
// 위로 스크롤돼 머리 아래 선이 있다
const LONG: RowSpec[] = [
  ...DETAIL,
  { kind: 'view', title: '할부', suffix: { text: '일시불' } },
  { kind: 'view', title: '청구 회차', suffix: { text: '11월 14일 결제' } },
  { kind: 'view', title: '메모', suffix: { text: '회의 뒤 점심' } },
];
function DetailWithActions({ mode = 'auto', scroll, fog = true, marks, decor, maxHeight }: { mode?: Mode; scroll: { scrolled: boolean; offset?: number }; fog?: boolean; marks?: OvMarks; decor?: OvDecor; maxHeight?: number }) {
  const s = dg().footer.button.size;
  return (
    <DialogSurface
      look={dg()}
      mode={mode}
      title="거래 상세"
      close
      bodyPad={false}
      maxHeight={maxHeight}
      scroll={scroll}
      fog={fog}
      marks={marks}
      decor={decor}
      footer={
        <EndButtons
          mode={mode}
          items={[
            { label: '삭제', look: btn('neutralWeak', s) },
            { label: '수정', look: btn('neutralSolid', s) },
          ]}
        />
      }
    >
      <DetailList mode={mode} rows={LONG} />
    </DialogSurface>
  );
}
const Anatomy: Fig = ({ caption }) => {
  const d = dg();
  const c = dialogChrome();
  // 본문 — 줄 다섯 반쯤 보이게 높이를 막는다(넘침). 위로 한 줄 반 올렸다(스크롤됨) — 끝 흐림은 위 · 아래 늘 켜져 있다
  const bodyH = listRowHeight() * 4.6 + d.scroll.fog.padTop;
  const h = c.head + bodyH + c.foot;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Win h={winH(h) + 24} w={592} title="가계부">
          <CenterOn mode="auto">
            {pinAt('ⓐ', 16, 16)}
            <DetailWithActions
              maxHeight={h}
              scroll={{ scrolled: true, offset: listRowHeight() * 1.4 }}
              marks={{ header: line, body: line, footer: line, close: markBox }}
              decor={{ root: pinAt('ⓑ', -10, -10), header: pinAt('ⓒ', 2, d.header.padTop + 5), body: pinAt('ⓓ', 2, 13), footer: pinAt('ⓔ', 2, d.footer.padTop + 8) }}
            />
          </CenterOn>
        </Win>
        <Legend
          items={[
            ['ⓐ', 'Overlay'],
            ['ⓑ', 'Container'],
            ['ⓒ', 'Header — 닫기는 조회 · 안내만'],
            ['ⓓ', 'Body — 넘치면 이 안만 스크롤 · 넘칠 수 있으면 끝 흐림'],
            ['ⓔ', 'Footer'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Size ──────────────────────────────────────────────────
// medium 480(입력 폼 · 상세) · large 800(복잡한 설정 · 많은 조회) — 같은 배율로 위아래
const SETTLE: RowSpec[] = [
  { kind: 'view', title: '기본급', suffix: { text: '3,200,000원' } },
  { kind: 'view', title: '식대', suffix: { text: '200,000원' } },
  { kind: 'view', title: '야근 수당', suffix: { text: '184,000원' } },
  { kind: 'view', title: '국민연금', suffix: { text: '−144,000원' } },
  { kind: 'view', title: '건강보험', suffix: { text: '−113,440원' } },
];
const SETTLE2: RowSpec[] = [
  { kind: 'view', title: '근무일', suffix: { text: '22일' } },
  { kind: 'view', title: '연장 근무', suffix: { text: '8시간' } },
  { kind: 'view', title: '쓴 연차', suffix: { text: '1일' } },
  { kind: 'view', title: '소득세', suffix: { text: '−98,320원' } },
  { kind: 'view', title: '실지급액', suffix: { text: '3,228,240원' } },
];
const Size: Fig = ({ caption }) => {
  const d = dg();
  const s = 0.6;
  const medH = LEAVE_H();
  const largeH = dialogH(SETTLE.length * listRowHeight(), { description: true, footer: false, brand: 'hr' });
  const sizeBand = (w: number) => <Band style={{ left: 0, right: 0, top: -22, height: 16, background: 'transparent', borderTop: `1px solid ${MARK_LINE}` }} label={String(w)} />;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Shot strong={`medium ${d.sizes.medium}(기본)`} cap="일반 입력 폼 · 상세">
          <Win w={d.sizes.medium + 160} h={winH(medH) + 16} s={s} brand="hr" title="휴가">
            <CenterOn mode="auto">
              <LeaveDialog mode="auto" style={{ overflow: 'visible' }} decor={{ root: sizeBand(d.sizes.medium) }} />
            </CenterOn>
          </Win>
        </Shot>
        <Shot strong={`large ${d.sizes.large}`} cap="복잡한 설정 · 많은 조회 — 넓은 표 · 두 단">
          <Win w={d.sizes.large + 120} h={winH(largeH) + 16} s={s} brand="hr" title="급여">
            <CenterOn mode="auto">
              <DialogSurface look={ov('hr').dialog} width={d.sizes.large} title="10월 급여 명세" description="10월 25일에 들어와요." close bodyPad={false} style={{ overflow: 'visible' }} decor={{ root: sizeBand(d.sizes.large) }}>
                <div className="grid grid-cols-2">
                  <DetailList mode="auto" rows={SETTLE} brand="hr" />
                  <DetailList mode="auto" rows={SETTLE2} brand="hr" />
                </div>
              </DialogSurface>
            </CenterOn>
          </Win>
        </Shot>
        <Note>
          높이는 내용만큼, 화면 높이의 {Math.round(d.maxHeight * 100)}% 까지 — 넘치는 만큼 본문이 스크롤된다. 화면이 좁으면 좌우 {d.marginX} 을 남기고 준다. 모서리 {d.radius} · 그림자 없음(딤과 표면 색으로 뜬다)
        </Note>
      </div>
    </Figure>
  );
};

// ── 본문 끝 흐림 · 스크롤 ─────────────────────────────────
const SCROLL_S = 0.56;
// 넘칠 수 있는 본문(scrollFog) — 맨 위 · 스크롤됨 · 끝까지. 위 · 아래 흐림은 늘 그대로이고(마스크), 본문 안 여백이 그만큼이라
// 맨 위 · 끝에서는 흐림이 빈 여백 위에 놓인다. 위로 스크롤되면 머리 아래 선이 생긴다
const Scroll: Fig = ({ caption }) => {
  const d = dg();
  const c = dialogChrome();
  const f = d.scroll.fog;
  const rowH = listRowHeight();
  const bodyH = rowH * 4.6 + f.padTop;
  const h = c.head + bodyH + c.foot;
  // 끝까지 — 위 여백 + 줄 전부 + 아래 여백 − 본문 높이
  const end = f.padTop + LONG.length * rowH + f.padBottom - bodyH;
  // 흐림 자리 — 판 기준(본문의 마스크가 띠까지 흐리지 않게): 본문 위 · 바닥 바로 위
  const fogBands = (
    <>
      <Band style={{ left: 0, right: 0, top: c.head, height: f.top, background: 'transparent', boxShadow: `inset 0 0 0 1px ${MARK_LINE}` }} label={`위 ${f.top}`} />
      <Band style={{ left: 0, right: 0, bottom: c.foot, height: f.bottom, background: 'transparent', boxShadow: `inset 0 0 0 1px ${MARK_LINE}` }} label={`아래 ${f.bottom}`} />
    </>
  );
  const lineTag = (
    <span aria-hidden className="pointer-events-none absolute right-3 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ top: 4, background: MARK_LINE, zIndex: 5 }}>
      ↑ {d.scroll.divider.height}px 선
    </span>
  );
  const shot = (offset: number, scrolled: boolean, body?: ReactNode) => (
    <Scaled w={d.sizes.medium} h={h} s={SCROLL_S}>
      <DetailWithActions maxHeight={h} scroll={{ scrolled, offset }} decor={{ root: fogBands, body }} />
    </Scaled>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <div style={{ width: d.sizes.medium * SCROLL_S }}>
        <Shot strong="맨 위" cap={`위 ${f.top} 흐림은 빈 여백(${f.padTop}) 위 — 아래 ${f.bottom} 이 흐려 더 있음을 알린다`}>
          {shot(0, false)}
        </Shot>
        </div>
        <div style={{ width: d.sizes.medium * SCROLL_S }}>
        <Shot strong="위로 스크롤됨" cap={`흐림은 그대로 · 머리 아래 ${d.scroll.divider.height}px 선이 본문과 머리를 가른다`}>
          {shot(rowH * 1.6, true, lineTag)}
        </Shot>
        </div>
        <div style={{ width: d.sizes.medium * SCROLL_S }}>
        <Shot strong="끝까지" cap={`아래 ${f.bottom} 흐림은 빈 여백 위 — 마지막 줄은 흐림 밖에 다 보인다`}>
          {shot(end, true, lineTag)}
        </Shot>
        </div>
      </div>
    </Panel>
  );
};

// ── 한 부품이 폭으로 바뀐다 ────────────────────────────────
const ResponsiveGuide: Fig = ({ caption }) => {
  const k = ov().breakpoint;
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-5">
        <Shot strong={`${k} 이상 — 대화상자`} cap="바닥 취소 · 저장(머리 닫기 없음) · 날짜 칸은 팝오버로">
          <Win h={winH(TXADD_H())} s={0.6} title="가계부">
            <CenterOn mode="auto">
              <TxAddDialog mode="auto" />
            </CenterOn>
          </Win>
        </Shot>
        <Shot strong={`${k} 미만 — 시트`} cap="위 닫기 + 바닥 저장(바닥 취소 없음) · 날짜 칸은 시트로">
          <LedgerPhone mode="auto" scale={0.6} overlay={<SheetOn mode="auto"><TxAddSheet mode="auto" /></SheetOn>} />
        </Shot>
      </div>
    </Figure>
  );
};

// ── 입력 폼은 바깥을 눌러도 닫히지 않는다 ───────────────────
// 창을 넓게 — 대화상자 옆 딤을 누르는 자리(왼쪽 여백 가운데)에 커서
const DismissGuide: Fig = ({ caption }) => {
  const d = dg();
  const w = 720;
  const h = winH(Math.max(LEAVE_H(), DETAIL_H()));
  const x = (w - d.sizes.medium) / 4;
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-5">
        <Shot strong="입력 폼 — 휴가 신청" cap="바닥 취소 · Esc 로 닫는다(뒤로 가기는 1280 미만의 시트만). 바뀐 값이 있으면 먼저 묻는다">
          <Win w={w} h={h} s={0.52} brand="hr" title="휴가">
            <CenterOn mode="auto">
              <GestureMark kind="click" x={x} y="50%" note="눌러도 그대로" ok={false} />
              <LeaveDialog mode="auto" />
            </CenterOn>
          </Win>
        </Shot>
        <Shot strong="조회 — 거래 상세" cap="바깥 누르기 · Esc · 머리 닫기로 닫힌다">
          <Win w={w} h={h} s={0.52} title="가계부">
            <CenterOn mode="auto">
              <GestureMark kind="click" x={x} y="50%" note="누르면 닫힌다" ok />
              <DetailDialog mode="auto" />
            </CenterOn>
          </Win>
        </Shot>
      </div>
    </Panel>
  );
};

// ── 닫는 자리 — 하나만 ─────────────────────────────────────
const CloseGuide: Fig = ({ caption }) => {
  const h = winH(Math.max(LEAVE_H(), DETAIL_H()));
  const s = ov('hr').dialog.footer.button.size;
  const k = 0.46;
  return (
    <Panel caption={caption}>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        <Verdict ok note="입력 폼은 바닥 [취소] [신청], 조회 · 안내는 머리 닫기 — 닫는 자리가 하나다">
          <div className="flex flex-wrap justify-center gap-4">
            <Shot strong="입력 폼">
              <Win w={560} h={h} s={k} brand="hr" title="휴가">
                <CenterOn mode="auto">
                  <LeaveDialog mode="auto" />
                </CenterOn>
              </Win>
            </Shot>
            <Shot strong="조회">
              <Win w={560} h={h} s={k} title="가계부">
                <CenterOn mode="auto">
                  <DetailDialog mode="auto" />
                </CenterOn>
              </Win>
            </Shot>
          </div>
        </Verdict>
        <Verdict ok={false} note="머리 닫기와 바닥 취소를 함께 — 닫는 길이 둘이라 어느 쪽인지 망설인다">
          <Win w={560} h={h} s={k} brand="hr" title="휴가">
            <CenterOn mode="auto">
              <LeaveDialog
                mode="auto"
                close
                footer={
                  <EndButtons
                    items={[
                      { label: '취소', look: btn('neutralWeak', s, 'hr') },
                      { label: '신청', look: btn('brandSolid', s, 'hr') },
                    ]}
                  />
                }
              />
            </CenterOn>
          </Win>
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 닫는다 — 이 창의 폭으로 대화상자 · 시트) ─────
const ExForm: Fig = () => <LeaveDialogDemo kit={overlayKit('hr')} date={dateKit('hr')} sel={hr()} field={tf().field} trigger={btn('brandSolid', 'small', 'hr')} />;
const ExView: Fig = () => <DetailDialogDemo kit={overlayKit()} list={listLook()} rows={DETAIL} />;

export const dialogFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  scroll: Scroll,
  'responsive-guide': ResponsiveGuide,
  'dismiss-guide': DismissGuide,
  'close-guide': CloseGuide,
  'ex-form': ExForm,
  'ex-view': ExView,
};

