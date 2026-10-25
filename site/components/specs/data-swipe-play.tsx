'use client';
// Swipe Actions 의 미리보기 — 가계부 줄을 실제로 밀어 트레이를 열고(한 번에 한 줄 · 스크롤하면 닫힘), 줄을 누르면 상세(같은 동작은 상세에 — 줄 끝 ⋮ 는 두지 않는다, 2026-10-25).
// 삭제는 트레이를 먼저 닫고 상세와 같은 문구의 확인 창(alert-dialog.yaml)을 띄운다. 값은 swipe-actions.yaml 을 푼 SwipeKitLook 만 쓴다.
import { useId, useState } from 'react';
import { LEDGER, TX_ACTIONS, deleteConfirm, type TxRow } from './data-data';
import { formatWon, type SwipeKitLook } from './data-shared';
import { SwipeGroup, SwipeRowView, type SwipeAct } from './data-swipe-view';
import type { ListLook, RowSpec } from './list-shared';
import { ListView } from './list-view';
import { ModalLayer, useMinWidth } from './overlay-live';
import type { OvKit } from './overlay-shared';
import { AlertSurface } from './overlay-view';

function Said({ text }: { text: string }) {
  return (
    <span role="status" className="inline-flex min-h-[26px] items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span className="text-[10px] font-bold text-fd-muted-foreground">읽는 글</span>
      {text || '—'}
    </span>
  );
}
// 트레이의 동작 — 같은 동작 · 같은 이름이 줄을 눌러 들어간 상세에도 있다
export const txActs = (): SwipeAct[] => TX_ACTIONS.map((a) => ({ value: a.value, kind: a.kind, label: a.label, icon: a.icon }));

function Confirm({ ov, open, title, description, onCancel, onConfirm }: { ov: OvKit; open: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void }) {
  const id = useId();
  const wide = useMinWidth(ov.ov.breakpoint);
  const b = wide ? ov.alert.above : ov.alert.below;
  return (
    <ModalLayer open={open} kind="alert" look={ov.ov} outside="ignore" onRequestClose={onCancel} labelledBy={`${id}t`} describedBy={`${id}d`}>
      {({ ref, rootProps, style }) => (
        <AlertSurface ref={ref} rootProps={rootProps} style={style} look={ov.ov.alert} title={title} description={description} titleId={`${id}t`} descId={`${id}d`} cancel={{ label: '취소', look: b.weak, onClick: onCancel }} confirm={{ label: '삭제', look: b.critical, onClick: onConfirm }} />
      )}
    </ModalLayer>
  );
}

export function LedgerSwipeDemo({ look, list, ov, rowHeight }: { look: SwipeKitLook; list: ListLook; ov: OvKit; rowHeight: number }) {
  const [rows, setRows] = useState<TxRow[]>(LEDGER);
  const [said, setSaid] = useState('');
  const [ask, setAsk] = useState<TxRow | null>(null);
  const act = (r: TxRow, value: string) => {
    if (value === 'delete') setAsk(r);
    else setSaid(`${r.title} 수정`);
  };
  const rowOf = (r: TxRow): RowSpec => ({
    kind: 'button',
    prefix: { tile: r.tile, icon: r.icon },
    title: r.title,
    detail: r.detail,
    suffix: { amount: r.amount > 0 ? `+${formatWon(r.amount)}` : formatWon(r.amount) },
  });
  return (
    <div className="flex flex-col items-center gap-3">
      {/* 그림 속 폰(360) — 폰이라 늘 밀린다(768 이상 화면에서는 감싸기를 걷어 줄만 — 아래 그림) */}
      <div style={{ width: '100%', maxWidth: 360, overflow: 'hidden', borderRadius: 16, background: 'var(--p-bg-layer-default)' }}>
        <SwipeGroup>
          {rows.map((r) => (
            <SwipeRowView key={r.id} look={look} actions={txActs()} rowLabel={r.title} rowHeight={rowHeight} onAction={(a) => act(r, a.value)} onRowClick={() => setSaid(`${r.title} 상세를 열어요.`)} onSaid={setSaid}>
              <ListView look={list} rows={[rowOf(r)]} live ariaLabel={r.title} />
            </SwipeRowView>
          ))}
        </SwipeGroup>
      </div>
      <Said text={said} />
      <Confirm
        ov={ov}
        open={!!ask}
        title={ask ? deleteConfirm(ask.title).title : ''}
        description={ask ? deleteConfirm(ask.title).description : ''}
        onCancel={() => setAsk(null)}
        onConfirm={() => {
          if (ask) {
            setRows((rs) => rs.filter((x) => x.id !== ask.id));
            setSaid(`${ask.title} 거래를 지웠어요.`);
          }
          setAsk(null);
        }}
      />
    </div>
  );
}
