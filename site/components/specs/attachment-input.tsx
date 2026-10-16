// Attachment Input 페이지의 그림 — specs/components/attachment-input.md 의 `[그림: …](../../site/components/specs/attachment-input.tsx#<id>)` 자리.
// 칸은 attachment-input.yaml 을 푼 값(atLook — finish-view 의 AtTriggerView · AtItemView · AtRowView · AtDropzoneView)으로, 칸 이름 · 설명 · 오류는
// Field(field.yaml — text-field-view), 시트 · 대화상자는 bottom-sheet · dialog.yaml(overlay-view), 항목 메뉴는 menu-sheet · menu.yaml(menu-view),
// 프로필 사진 자리는 avatar.yaml(AvatarEditView)로 그린다. 사진은 칠한 그림이다. 가게 · 파일 이름은 지어낸 것이다(finish-shared 의 AT_*).
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { AtNameCard, AtPlayground, ExImportDemo, ExReceiptDemo, ExReorderDemo } from './finish-attach';
import { AT_PDF_FIT, AT_REJECT, AT_TX, AT_WORST, atLook, avEditLook, mb, pdfEntry, photoEntry, xlsxEntry, type AtEntry } from './finish-look';
import { AtDropzoneView, AtItemView, AtPickButtonView, AtRowView, AtTriggerView, AvatarEditView, Fit, MARK, MARK_LINE } from './finish-view';
import { displayKit } from './display-look';
import { Phone, Verdict, rc, type Mode } from './kit';
import { menuKit } from './menu-look';
import type { MenuGroup } from './menu-shared';
import { MenuPanel, MenuSheetSurface } from './menu-view';
import { overlayLook } from './overlay-look';
import { Legend, overlayKit, pinAt } from './overlay-screens';
import { ocv } from './overlay-shared';
import { DialogSurface, DimView, GestureMark, SheetSurface } from './overlay-view';
import { Cap } from './select-screens';
import { textFieldLook } from './text-field-look';
import { TfFieldView } from './text-field-view';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const L = () => atLook('desk');
const TF = () => textFieldLook('desk');
const OV = () => overlayLook('desk');
const MK = () => menuKit('desk');
const PHONE = 390;
// 시트 본문 폭(폰 390 − 좌우 여백)
const sheetBody = () => PHONE - OV().sheet.body.padX * 2;
const LABEL = '영수증';
const DESC = '사진 · PDF 를 10MB 까지 올려요. 10개까지.';

function Board({ mode = 'auto', children, style, bg = 'bg-layer-default', className }: { mode?: Mode; children: ReactNode; style?: CSSProperties; bg?: string; className?: string }) {
  return (
    <div className={className} style={{ background: rc(bg, mode), borderRadius: 16, paddingTop: 20, paddingBottom: 20, paddingLeft: 24, paddingRight: 24, boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}

// ── 멈춘 그림 조각 ────────────────────────────────────────
function Row({ entries, count, max = 10, mode = 'auto', at = 'start', badge, readOnly, accept = 'image', dragging, extra, triggerPin }: { entries: AtEntry[]; count?: number; max?: number; mode?: Mode; at?: 'start' | 'end'; badge?: string; readOnly?: boolean; accept?: 'image' | 'file'; dragging?: string; extra?: (e: AtEntry, i: number) => Partial<Parameters<typeof AtItemView>[0]>; triggerPin?: ReactNode }) {
  const l = L();
  return (
    <AtRowView look={l} at={at} live={false}>
      <AtTriggerView look={l} mode={mode} count={count ?? entries.length} max={max} label={LABEL} accept={accept} readOnly={readOnly} frozen pins={triggerPin} />
      {entries.map((e, i) => (
        <AtItemView key={e.id} look={l} mode={mode} entry={e} badge={i === 0 && badge ? badge : undefined} readOnly={readOnly} dragging={dragging === e.id} frozen {...extra?.(e, i)} />
      ))}
    </AtRowView>
  );
}
function ReceiptField({ mode = 'auto', children, error }: { mode?: Mode; children: ReactNode; error?: string }) {
  return (
    <TfFieldView look={TF().field} mode={mode} label={LABEL} description={DESC} invalid={!!error} errorMessage={error}>
      {children}
    </TfFieldView>
  );
}
function TxHead({ mode = 'auto' }: { mode?: Mode }) {
  const t = (n: string) => rc(n, mode);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 20 }}>
      <span style={{ fontSize: 14, lineHeight: '19px', color: t('fg-neutral-subtle') }}>{AT_TX.merchant}</span>
      <span style={{ fontSize: 26, lineHeight: '35px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: t('fg-neutral') }}>{AT_TX.amount}</span>
      <span style={{ fontSize: 14, lineHeight: '19px', color: t('fg-neutral-subtle') }}>{AT_TX.meta}</span>
    </div>
  );
}
// 폰 390 — 가계부 위 거래 상세 시트(조회 — 머리 닫기). overlay 를 주면 그 위에 하나 더(메뉴 시트)
function TxPhone({ mode, body, h = 600, overlay }: { mode: Mode; body: ReactNode; h?: number; overlay?: ReactNode }) {
  const o = OV();
  return (
    <Phone mode={mode} h={h} screenW={PHONE} title="가계부" back={false} bg="bg-layer-basement">
      <DimView dim={o.sheet.dim} mode={mode} place="end">
        <SheetSurface look={o.sheet} mode={mode} title="거래 상세" safe={12} maxHeight={h - 100}>
          <TxHead mode={mode} />
          {body}
        </SheetSurface>
      </DimView>
      {overlay}
    </Phone>
  );
}
// 폰 390 — 거래 상세 화면(시트가 아니라 화면 — 그 위에 메뉴 시트를 띄워도 누른 항목이 보인다)
function TxPage({ mode, body, h = 720, overlay }: { mode: Mode; body: ReactNode; h?: number; overlay?: ReactNode }) {
  const g = OV().sheet.body.padX;
  return (
    <Phone mode={mode} h={h} screenW={PHONE} title="거래 상세" back bg="bg-layer-default">
      <div style={{ paddingTop: 16, paddingLeft: g, paddingRight: g }}>
        <TxHead mode={mode} />
        {body}
      </div>
      {overlay}
    </Phone>
  );
}
// 데스크톱 — 딤 위 거래 상세 대화상자 medium(조회 — 머리 닫기). 그림은 대화상자 둘레만 잘라 그린다
const dialogBoard = () => OV().dialog.sizes.medium + 80;
function TxDialog({ mode, body, after, padBottom = 32 }: { mode: Mode; body: ReactNode; after?: ReactNode; padBottom?: number }) {
  const o = OV();
  return (
    <div style={{ width: dialogBoard(), background: rc('bg-layer-basement', mode) }}>
      <div style={{ background: ocv(o.dialog.dim, mode), paddingTop: 32, paddingBottom: padBottom, paddingLeft: 40, paddingRight: 40, position: 'relative' }}>
        <DialogSurface look={o.dialog} mode={mode} width={o.dialog.sizes.medium} title="거래 상세" close unclipped>
          <TxHead mode={mode} />
          {body}
        </DialogSurface>
        {after}
      </div>
    </div>
  );
}
function Shot({ w, children, strong, cap }: { w: number; children: ReactNode; strong?: ReactNode; cap?: ReactNode }) {
  return (
    <div className="mx-auto flex w-full min-w-0 flex-col items-center gap-2" style={{ maxWidth: w }}>
      <div className="w-full">
        <Fit w={w}>{children}</Fit>
      </div>
      {(strong || cap) && <Cap strong={strong}>{cap}</Cap>}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-6">
      {MODES.map((mode) => (
        <div key={mode} className="grid items-start gap-4 sm:grid-cols-2">
          <Shot w={PHONE + 16} strong={`${modeKo(mode)} · 390`} cap="시트 — 한 줄(80), 화면 가장자리까지 · 끝 흐림">
            <TxPhone
              mode={mode}
              body={
                <ReceiptField mode={mode}>
                  <Row entries={AT_WORST} mode={mode} />
                </ReceiptField>
              }
            />
          </Shot>
          <Shot w={dialogBoard()} strong={`${modeKo(mode)} · 1280 이상`} cap={`대화상자 medium ${OV().dialog.sizes.medium} — 끝까지 민 모습(올리는 중 · 실패)`}>
            <TxDialog
              mode={mode}
              body={
                <ReceiptField mode={mode}>
                  <Row entries={AT_WORST} mode={mode} at="end" />
                </ReceiptField>
              }
            />
          </Shot>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => (
  <AtPlayground
    looks={{ desk: atLook('desk'), hr: atLook('hr') }}
    fields={{ desk: TF().field, hr: textFieldLook('hr').field }}
    menu={{ desk: menuKit('desk'), hr: menuKit('hr') }}
    ov={{ desk: overlayKit('desk'), hr: overlayKit('hr') }}
    initial={[pdfEntry(), photoEntry(0), photoEntry(1)]}
  />
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = L();
  const pin = (n: string, x: number, y: number) => pinAt(n, x, y);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Board className="w-full max-w-[560px]" style={{ paddingTop: 36 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: l.items.gap, alignItems: 'flex-start' }}>
            <AtTriggerView look={l} count={3} max={10} label={LABEL} frozen pins={pin('ⓐ', -10, -14)} />
            <AtItemView look={l} entry={photoEntry(0)} badge={l.badge.label} frozen pins={{ item: <>{pin('ⓑ', -10, -14)}{pin('ⓔ', -12, l.item.h - l.badge.h / 2 - 10)}</>, remove: pin('ⓓ', 12, -18) }} />
            <AtItemView look={l} entry={pdfEntry()} frozen pins={{ item: pin('ⓒ', -10, -14) }} />
          </div>
          <div style={{ marginTop: 28, position: 'relative' }}>
            <AtDropzoneView look={l} buttonState="enabled" pins={{ root: pin('ⓕ', -10, -10) }} style={{ position: 'relative' }} />
          </div>
        </Board>
        <Legend
          items={[
            ['ⓐ', `Trigger — ${l.trigger.size} · 아이콘 ${l.trigger.icon} · "3/10"`],
            ['ⓑ', `Image Item — ${l.item.imageW} × ${l.item.h}`],
            ['ⓒ', `File Item — ${l.item.fileW} × ${l.item.h}`],
            ['ⓓ', `Remove — ${l.remove.size} · 누르는 ${l.remove.touch}`],
            ['ⓔ', `Badge — ${l.badge.h} 띠`],
            ['ⓕ', `Dropzone — ${l.dropzone.h} · 파일 선택`],
            ['ⓖ', 'Item Menu — 항목을 누르면(아래 항목 메뉴)'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Layout ────────────────────────────────────────────────
const Layout: Fig = ({ caption }) => {
  const l = L();
  const w = sheetBody();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {(['start', 'end'] as const).map((at) => (
            <Shot key={at} w={w + 48} strong={at === 'start' ? 'tile — 처음' : 'tile — 끝까지 민 모습'} cap={at === 'start' ? `10/10 한 줄 — 첫 항목은 다른 칸과 같은 자리, 좌우 끝 흐림 ${l.items.fog}` : '올리는 중 · 실패가 끝에 있으면 밀어야 보인다'}>
              <Board>
                <ReceiptField>
                  <Row entries={AT_WORST} at={at} />
                </ReceiptField>
              </Board>
            </Shot>
          ))}
        </div>
        <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Shot w={640} strong="dropzone — 1280 이상" cap={`높이 ${l.dropzone.h} · ${l.dropzone.borderW}px 실선 · 안내 + 파일 선택`}>
            <Board>
              <ImportField>
                <AtDropzoneView look={l} buttonState="enabled" />
              </ImportField>
            </Board>
          </Shot>
          <Shot w={w + 48} strong="dropzone — 1280 미만 · 앱" cap="끌어 놓기가 없다 — 파일 선택 버튼만">
            <Board>
              <ImportField>
                <AtPickButtonView look={l} state="enabled" />
              </ImportField>
            </Board>
          </Shot>
        </div>
      </div>
    </Panel>
  );
};
function ImportField({ mode = 'auto', children }: { mode?: Mode; children: ReactNode }) {
  return (
    <TfFieldView look={TF().field} mode={mode} label="파일 업로드" description="CSV(.csv) 또는 Excel(.xlsx, .xls) 파일을 올려주세요. 최대 10MB.">
      {children}
    </TfFieldView>
  );
}

// ── Trigger ───────────────────────────────────────────────
const Trigger: Fig = ({ caption }) => {
  const l = L();
  const cells: { count: number; max?: number; accept?: 'image' | 'file'; strong: string; cap: string }[] = [
    { count: 0, max: 10, strong: '0/10', cap: '지금 개수는 0 이어도 같은 색' },
    { count: 3, max: 10, strong: '3/10', cap: '"/10" 은 옅은 색' },
    { count: 10, max: 10, strong: '10/10 — 막힘', cap: 'aria-disabled — 초점이 남아 "10/10, 사용할 수 없음"' },
    { count: 3, accept: 'file', strong: '개수 없음', cap: '최대가 없으면(서버 한도 없음) 개수를 두지 않는다 · 파일만 받으면 클립' },
  ];
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-4">
        {cells.map((c) => (
          <div key={c.strong} className="flex flex-col items-center gap-2">
            <Board style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <AtTriggerView look={l} count={c.count} max={c.max} accept={c.accept} label={LABEL} frozen />
            </Board>
            <Cap strong={c.strong}>{c.cap}</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── Item ──────────────────────────────────────────────────
const box = (label: string, style?: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ top: 0, left: 0, right: 0, bottom: 0, outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1, background: MARK, zIndex: 4, ...style }}>
    <span className="absolute rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, left: '50%', bottom: -18, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  </span>
);
const Items: Fig = ({ caption }) => {
  const l = L();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Board style={{ paddingBottom: 40 }}>
          <div style={{ display: 'flex', gap: l.items.gap, alignItems: 'flex-start', paddingTop: 4 }}>
            <AtItemView look={l} entry={photoEntry(1)} frozen removable={false} pins={{ item: box(`${l.item.imageW} × ${l.item.h}`, { background: 'transparent' }) }} />
            <AtItemView look={l} entry={pdfEntry({ name: '카드영수증_10월.pdf', size: 412 * 1024 })} frozen removable={false} pins={{ thumb: box(`${l.thumb.size}`), name: box(`폭 ${l.meta.width}`) }} />
          </div>
        </Board>
        <Legend
          items={[
            ['사진', `${l.item.imageW} × ${l.item.h} · 윤곽 ${l.item.borderW}px(투명)`],
            ['파일 카드', `${l.item.fileW} × ${l.item.h} · 좌우 ${l.item.filePadX}`],
            ['썸네일 칸', `${l.thumb.size} · 아이콘 ${l.thumb.icon} · 사이 ${l.item.gap}`],
            ['이름', `${parseFloat(l.name.text.fontSize)} / ${parseFloat(l.name.text.lineHeight)} · ${l.name.text.fontWeight} — 크기 ${parseFloat(l.size.text.fontSize)} / ${parseFloat(l.size.text.lineHeight)}`],
          ]}
        />
      </div>
    </Panel>
  );
};

const Name: Fig = ({ caption }) => {
  const l = L();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Board mode={mode} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              <AtNameCard look={l} mode={mode} entry={pdfEntry({ id: 'fit', name: AT_PDF_FIT, size: mb(3.2) })} />
              <AtNameCard look={l} mode={mode} entry={pdfEntry()} />
              <AtNameCard look={l} mode={mode} entry={xlsxEntry()} />
            </Board>
            <Cap strong={modeKo(mode)}>
              글자 단위(break-all) · 폭 {l.meta.width}(첫 줄은 오른쪽 {l.name.maskClear} 비움) · {l.name.maxLines}줄까지 — 보조 기술에는 늘 전체 이름
            </Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── Remove ────────────────────────────────────────────────
const Remove: Fig = ({ caption }) => {
  const l = L();
  const z = 2;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Board style={{ paddingTop: 48, paddingBottom: 40, paddingLeft: 56, paddingRight: 56 }}>
          <div style={{ zoom: z }}>
            <AtItemView look={l} entry={photoEntry(2)} frozen showHit />
          </div>
        </Board>
        <Legend
          items={[
            ['×', `${l.remove.size} 원 · 아이콘 ${l.remove.icon} · 위 ${l.remove.offset} · 오른쪽 ${l.remove.offset} 걸침`],
            ['구멍', `지름 ${l.mask.size} — × 둘레 ${(l.mask.size - l.remove.size) / 2}`],
            ['누르는 자리', `${l.remove.touch}(분홍 — 둘레 ${l.remove.extend} 씩)`],
          ]}
        />
        <span className="text-center text-[12px] pk-muted">{z}배로 그렸다</span>
      </div>
    </Panel>
  );
};

// ── Status ────────────────────────────────────────────────
const Status: Fig = ({ caption }) => {
  const l = L();
  const list: AtEntry[] = [pdfEntry({ id: 'a', status: 'uploading', progress: 0.4 }), pdfEntry({ id: 'b', status: 'error' }), photoEntry(3, { id: 'c', status: 'uploading', progress: 0.62 }), photoEntry(1, { id: 'd', status: 'error' })];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Board mode={mode} className="w-full overflow-x-auto">
              <div style={{ display: 'flex', gap: l.items.gap, paddingTop: l.items.padTop, width: 'max-content', marginLeft: 'auto', marginRight: 'auto' }}>
                {list.map((e) => (
                  <AtItemView key={e.id} look={l} mode={mode} entry={e} frozen />
                ))}
              </div>
            </Board>
            <Cap strong={modeKo(mode)}>파일 올리는 중 · 실패 · 사진 올리는 중 · 실패 — 값 있는 원 {l.progress.size}, 실패는 덮개 + "{l.action.label}"</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── 대표 배지 · 순서 바꾸기 ───────────────────────────────
const FOUR = () => [photoEntry(0), photoEntry(2), photoEntry(4), photoEntry(5)];
const BadgeReorder: Fig = ({ caption }) => {
  const l = L();
  const w = sheetBody() + 48;
  const kb = [photoEntry(4), photoEntry(0), photoEntry(2), photoEntry(5)];
  return (
    <Panel caption={caption}>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <Shot w={w} strong="대표 띠" cap={`첫 사진 아래 ${l.badge.h} — "${l.badge.label}"`}>
          <Board>
            <Row entries={FOUR()} count={4} badge={l.badge.label} accept="image" />
          </Board>
        </Shot>
        <Shot w={w} strong="끄는 사진" cap={`2px 줄어듦 · 불투명도 ${l.imageFade.dragging} · × 와 구멍 없음`}>
          <Board style={{ position: 'relative' }}>
            <Row entries={FOUR()} count={4} badge={l.badge.label} accept="image" dragging="p2" extra={(e) => (e.id === 'p2' ? { style: { transform: 'translateX(24px)', zIndex: 3 } } : {})} />
            <GestureMark kind="drag" x={24 + l.trigger.size + l.items.gap * 2 + l.item.imageW + l.item.imageW / 2 + 24} y={20 + l.item.h / 2} />
          </Board>
        </Shot>
        <div className="sm:col-span-2">
        <Shot w={w} strong="키보드 — 3번째를 1번째로" cap="Space 들기 · ← ← · Space 놓기 — 끌지 않는 포인터 길은 항목 메뉴(아래)">
          <Board>
            <Row entries={kb} count={4} badge={l.badge.label} accept="image" extra={(e) => (e.id === 'p4' ? { state: { item: 'focused' } } : {})} />
            <ol className="m-0 mt-3 flex list-none flex-col gap-1 p-0 text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle') }}>
              {['"3번째 항목을 들었어요."', '"2번째 자리예요."', '"1번째 자리예요."', '"1번째 자리에 놓았어요."'].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </Board>
        </Shot>
        </div>
      </div>
    </Panel>
  );
};

// ── 항목 메뉴 ─────────────────────────────────────────────
// 줄 — 크게 보기(파일 열기) · 대표로 정하기(사진만) · 앞으로 · 뒤로 | 지우기. 자리(position)에 따라 막힌 줄
function menuGroups(kind: 'image' | 'file', position: 'first' | 'middle' | 'last', cover = true): MenuGroup[] {
  const m = L().menu;
  return [
    {
      items: [
        { value: 'preview', label: kind === 'image' ? m.preview : m.open },
        ...(kind === 'image' && cover ? [{ value: 'cover', label: m.makeCover, disabled: position === 'first' }] : []),
        { value: 'earlier', label: m.moveEarlier, disabled: position === 'first' },
        { value: 'later', label: m.moveLater, disabled: position === 'last' },
      ],
    },
    { items: [{ value: 'remove', label: m.remove, tone: 'critical' }] },
  ];
}
const MENU_ROW = () => [photoEntry(0), photoEntry(2), pdfEntry(), photoEntry(4)];
const ItemMenu: Fig = ({ caption }) => {
  const l = L();
  const mk = MK();
  const second = MENU_ROW()[1];
  // 둘째 사진의 왼쪽 — 줄 안 여백 0(밀지 않은 처음) · 타일 + 사이 + 첫 사진 + 사이
  const x2 = l.trigger.size + l.items.gap + l.item.imageW + l.items.gap;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {MODES.map((mode) => (
            <Shot key={mode} w={PHONE + 16} strong={`${modeKo(mode)} · 390`} cap="둘째 사진을 누름 — 메뉴 시트(머리에 파일 이름)">
              <TxPage
                mode={mode}
                h={760}
                body={
                  <ReceiptField mode={mode}>
                    <Row entries={MENU_ROW()} mode={mode} badge={l.badge.label} extra={(e) => (e.id === second.id ? { pins: { item: <GestureMark kind="tap" x="50%" y="50%" /> } } : {})} />
                  </ReceiptField>
                }
                overlay={
                  <div style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0 }}>
                    <DimView dim={OV().sheet.dim} mode={mode} place="end">
                      <MenuSheetSurface look={mk.sheet} mode={mode} title={second.name} groups={menuGroups('image', 'middle')} layout="textOnly" safe={12} />
                    </DimView>
                  </div>
                }
              />
            </Shot>
          ))}
        </div>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {MODES.map((mode) => (
            <Shot key={mode} w={dialogBoard()} strong={`${modeKo(mode)} · 1280 이상`} cap={`대화상자 위 메뉴 — 누른 사진 아래 ${mk.menu.content.offset}`}>
              <TxDialog
                mode={mode}
                padBottom={200}
                body={
                  <ReceiptField mode={mode}>
                    <div style={{ position: 'relative' }}>
                      <Row entries={MENU_ROW()} mode={mode} badge={l.badge.label} extra={(e) => (e.id === second.id ? { state: { item: 'focused' } } : {})} />
                      <div style={{ position: 'absolute', left: x2, top: l.item.h + mk.menu.content.offset, zIndex: 6 }}>
                        <MenuPanel look={mk.menu} mode={mode} groups={menuGroups('image', 'middle')} rootProps={{ 'aria-label': second.name }} />
                      </div>
                    </div>
                  </ReceiptField>
                }
              />
            </Shot>
          ))}
        </div>
        <div className="grid items-start gap-4 sm:grid-cols-3">
          {[
            { k: 'image' as const, p: 'first' as const, strong: '맨 앞(대표) 사진', cap: `"${l.menu.moveEarlier}" · "${l.menu.makeCover}" 막힘` },
            { k: 'image' as const, p: 'last' as const, strong: '맨 끝 사진', cap: `"${l.menu.moveLater}" 막힘` },
            { k: 'file' as const, p: 'middle' as const, strong: '파일 카드', cap: `첫 줄 "${l.menu.open}" · "${l.menu.makeCover}" 없음` },
          ].map((c) => (
            <div key={c.strong} className="flex flex-col items-center gap-2">
              <Board style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <MenuPanel look={mk.menu} groups={menuGroups(c.k, c.p)} />
              </Board>
              <Cap strong={c.strong}>{c.cap}</Cap>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// ── Dropzone ──────────────────────────────────────────────
const Dropzone: Fig = ({ caption }) => {
  const l = L();
  const picked = xlsxEntry({ status: 'uploading', progress: 0.55 });
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        <div className="grid items-start gap-4 sm:grid-cols-3">
          {[
            { strong: '1280 — 기본', cap: `테두리 ${l.dropzone.borderW}px 실선`, el: <AtDropzoneView look={l} buttonState="enabled" /> },
            { strong: '끌어 들어옴', cap: '테두리 짙게 + 누름 바탕', el: <AtDropzoneView look={l} drag buttonState="enabled" /> },
            {
              strong: '고른 뒤',
              cap: '드롭존 막힘(최대 1) · 파일 카드 + 분석 중 원',
              el: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: l.root.gap }}>
                  <AtDropzoneView look={l} disabled />
                  <div style={{ paddingTop: l.items.padTop }}>
                    <AtItemView look={l} entry={picked} frozen />
                  </div>
                </div>
              ),
            },
          ].map((c) => (
            <div key={c.strong} className="flex flex-col items-center gap-2">
              <Board style={{ width: '100%' }}>{c.el}</Board>
              <Cap strong={c.strong}>{c.cap}</Cap>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <Board style={{ width: '100%', maxWidth: sheetBody() + 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: l.root.gap }}>
              <AtPickButtonView look={l} state="enabled" disabled />
              <div style={{ paddingTop: l.items.padTop }}>
                <AtItemView look={l} entry={picked} frozen />
              </div>
            </div>
          </Board>
          <Cap strong="390 · 앱">파일 선택 버튼(고른 뒤 막힘) + 파일 카드 — 바꾸려면 × 로 지우고 다시 고른다</Cap>
        </div>
      </div>
    </Panel>
  );
};

// ── State ─────────────────────────────────────────────────
const States: Fig = ({ caption }) => {
  const l = L();
  const table = (mode: 'light' | 'dark') => {
    const c = (n: string) => rc(n, mode);
    const head = (t: string) => (
      <span className="text-[12px] font-bold leading-4" style={{ color: c('fg-neutral') }}>
        {t}
      </span>
    );
    const cell = (node: ReactNode, t: string) => (
      <div className="flex flex-col items-center gap-1.5">
        <div style={{ paddingTop: 6 }}>{node}</div>
        <span className="text-center text-[11px] leading-4" style={{ color: c('fg-neutral-subtle') }}>
          {t}
        </span>
      </div>
    );
    const ph = (extra?: Partial<Parameters<typeof AtItemView>[0]>) => <AtItemView look={l} mode={mode} entry={photoEntry(1)} frozen {...extra} />;
    const fc = (extra?: Partial<Parameters<typeof AtItemView>[0]>) => <AtItemView look={l} mode={mode} entry={pdfEntry({ name: '카드영수증_10월.pdf', size: 412 * 1024 })} frozen {...extra} />;
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <div className="overflow-x-auto rounded-xl" style={{ background: c('bg-layer-default') }}>
          <div className="flex flex-col gap-5 px-5 py-5">
            {head('첨부 타일')}
            <div className="flex flex-wrap gap-4">
              {cell(<AtTriggerView look={l} mode={mode} count={3} max={10} frozen />, '기본')}
              {cell(<AtTriggerView look={l} mode={mode} count={3} max={10} frozen state="hovered" />, '호버(웹)')}
              {cell(<AtTriggerView look={l} mode={mode} count={3} max={10} frozen state="focused" />, '포커스')}
              {cell(<AtTriggerView look={l} mode={mode} count={3} max={10} frozen state="pressed" />, '누름')}
              {cell(<AtTriggerView look={l} mode={mode} count={10} max={10} frozen />, '다 참')}
              {cell(<AtTriggerView look={l} mode={mode} count={3} max={10} frozen readOnly />, '읽기 전용')}
              {cell(<AtTriggerView look={l} mode={mode} count={3} max={10} frozen disabled />, '막힘')}
            </div>
            {head('사진 · ×')}
            <div className="flex flex-wrap gap-4">
              {cell(ph(), '기본')}
              {cell(ph({ state: { remove: 'hovered' } }), '× 호버')}
              {cell(ph({ state: { remove: 'focused' } }), '× 포커스')}
              {cell(ph({ state: { remove: 'pressed' } }), '× 누름')}
              {cell(ph({ state: { item: 'focused' } }), '항목 포커스')}
              {cell(ph({ dragging: true }), `끄는 중 — ${l.imageFade.dragging}`)}
              {cell(ph({ readOnly: true }), `읽기 전용 — ${l.imageFade.readonly}`)}
              {cell(ph({ disabled: true }), '막힘')}
            </div>
            {head('파일 카드')}
            <div className="flex flex-wrap gap-4">
              {cell(fc(), '기본')}
              {cell(fc({ dragging: true }), '끄는 중 — 글 · 아이콘 막힌 색')}
              {cell(fc({ readOnly: true }), '읽기 전용 — 글 · 아이콘 막힌 색')}
            </div>
            {head('드롭존')}
            <div className="flex flex-wrap gap-4">
              {cell(<div style={{ width: 240 }}><AtDropzoneView look={l} mode={mode} buttonState="enabled" /></div>, '기본')}
              {cell(<div style={{ width: 240 }}><AtDropzoneView look={l} mode={mode} drag buttonState="enabled" /></div>, '끌어 들어옴')}
              {cell(<div style={{ width: 240 }}><AtDropzoneView look={l} mode={mode} disabled /></div>, '막힘 · 다 참')}
            </div>
          </div>
        </div>
        <Cap strong={modeKo(mode)}>포커스 링은 모두 부품 안쪽 — 불투명도는 사진의 끄는 중 · 읽기 전용에만(SEED 그대로), 막힘은 전용 색</Cap>
      </div>
    );
  };
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const WhenGuide: Fig = ({ caption }) => {
  const l = L();
  const av = displayKit('hr').avatar;
  return (
    <Panel caption={caption}>
      <div className="grid items-start gap-4 sm:grid-cols-3">
        <Shot w={sheetBody() + 48} strong="영수증 — tile" cap="여럿 · 사진이 섞인다">
          <Board>
            <ReceiptField>
              <Row entries={[pdfEntry(), photoEntry(0), photoEntry(1)]} />
            </ReceiptField>
          </Board>
        </Shot>
        <Shot w={sheetBody() + 48} strong="가져오기 — dropzone" cap="파일 하나를 골라 바로 넘긴다">
          <Board>
            <ImportField>
              <AtDropzoneView look={l} buttonState="enabled" />
            </ImportField>
          </Board>
        </Shot>
        <Shot w={sheetBody() + 48} strong="프로필 사진 — Avatar + 버튼" cap="사람 사진 한 장(Avatar 페이지)">
          <Board style={{ display: 'flex', justifyContent: 'center' }}>
            <AvatarEditView avatar={av} edit={avEditLook('hr')} name="한지우" photo={1} frozen />
          </Board>
        </Shot>
      </div>
    </Panel>
  );
};

const RowGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid items-start gap-4 sm:grid-cols-2">
      {(['start', 'end'] as const).map((at) => (
        <Shot key={at} w={sheetBody() + 48} strong={at === 'start' ? '처음 — 끝 흐림이 더 있다고 알린다' : '끝까지 민 모습'} cap={at === 'start' ? '대부분이 옆으로 숨는다 — 실패는 칸 이름에도 들린다("1개는 올리지 못했어요")' : '올리는 중 · 실패가 여기 있었다'}>
          <Board>
            <ReceiptField>
              <Row entries={AT_WORST} at={at} />
            </ReceiptField>
          </Board>
        </Shot>
      ))}
    </div>
  </Panel>
);

const ValidationGuide: Fig = ({ caption }) => {
  const added = [pdfEntry({ id: 'v1', status: 'uploading', progress: 0.3 }), pdfEntry({ id: 'v2', name: '2026-10-15_카드영수증_숲길커피_리저브_광화문점_2차.pdf', size: 3355443, status: 'uploading', progress: 0.1 })];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-2">
        <Board style={{ width: '100%', maxWidth: sheetBody() + 48 }}>
          <ReceiptField error={AT_REJECT.FILE_TOO_LARGE}>
            <Row entries={added} />
          </ReceiptField>
        </Board>
        <Cap strong="고른 셋 — PDF 둘은 붙고, 12MB 사진은 거절">거절은 붙이지 않고 칸 아래 오류 글로 한 번 — 토스트가 아니다. 이유마다 한 문장</Cap>
      </div>
    </Panel>
  );
};

const AppGuide: Fig = ({ caption }) => {
  const mk = MK();
  const groups: MenuGroup[] = [{ items: [{ value: 'camera', label: '사진 찍기' }, { value: 'album', label: '앨범에서 고르기' }, { value: 'file', label: '파일 고르기' }] }];
  return (
    <Panel caption={caption}>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        {MODES.map((mode) => (
          <Shot key={mode} w={PHONE + 16} strong={`${modeKo(mode)} · 앱`} cap="첨부 타일을 누름 — 받는 형식에 없는 줄은 뺀다">
            <TxPage
              mode={mode}
              h={760}
              body={
                <ReceiptField mode={mode}>
                  <Row entries={[pdfEntry(), photoEntry(0)]} mode={mode} triggerPin={<GestureMark kind="tap" x="50%" y="50%" />} />
                </ReceiptField>
              }
              overlay={
                <div style={{ position: 'absolute', top: 40, left: 0, right: 0, bottom: 0 }}>
                  <DimView dim={OV().sheet.dim} mode={mode} place="end">
                    <MenuSheetSurface look={mk.sheet} mode={mode} title={`${LABEL} 첨부`} groups={groups} layout="textOnly" safe={12} />
                  </DimView>
                </div>
              }
            />
          </Shot>
        ))}
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const kits = () => ({ look: L(), field: TF().field, menu: MK(), ov: overlayKit('desk') });
const ExReceipt: Fig = () => <ExReceiptDemo {...kits()} initial={[pdfEntry(), photoEntry(0)]} />;
const ExImport: Fig = () => <ExImportDemo {...kits()} />;
const ExReorder: Fig = () => <ExReorderDemo {...kits()} initial={FOUR()} />;

export const attachmentInputFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  trigger: Trigger,
  items: Items,
  name: Name,
  remove: Remove,
  status: Status,
  'badge-reorder': BadgeReorder,
  'item-menu': ItemMenu,
  dropzone: Dropzone,
  states: States,
  'when-guide': WhenGuide,
  'row-guide': RowGuide,
  'validation-guide': ValidationGuide,
  'app-guide': AppGuide,
  'ex-receipt': ExReceipt,
  'ex-import': ExImport,
  'ex-reorder': ExReorder,
};
