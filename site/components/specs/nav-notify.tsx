// Desk 데스크톱 벨의 알림 목록 그림(서버) — 1280 이상 벨 아래 Popover · 768 ~ 1279 Bottom Sheet(2026-10-16 사용자 결정 Q-017-3b B).
// 표면은 popover.yaml · bottom-sheet.yaml 을 푼 값(overlayLook — PopoverSurface · SheetSurface), 폭 · 높이는 popover.yaml 의 notificationList,
// 머리 · 버튼 자리는 top-navigation.yaml(navKit().top)이다. 알림 글은 지어낸 것 — 가장 긴 줄은 두 줄을 넘긴다.
import type { ReactNode } from 'react';
import { loadComponentSpec, resolveState } from '@/lib/component-spec';
import { DimView, EndButtons, PopoverSurface, SheetButtons, SheetSurface } from './overlay-view';
import { btn, ov } from './overlay-screens';
import { DeskHeader, DeskMain, Desktop, NK, Shell, Side } from './nav-screens';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { rc, type Mode } from './kit';

const UNREAD = 12;
export const NOTICES: [string, string, string][] = [
  ['카드 결제일이 다가와요', '지어낸카드 프리미엄 체크 · 10월 25일 결제 예정 1,234,567원 — 결제 계좌 잔액이 모자라요', '방금'],
  ['예산을 넘었어요', '식비 예산의 104%를 썼어요 — 이번 달 남은 날 12일', '12분 전'],
  ['반복 거래를 기록했어요', '지어낸마트 월간 정기 배송 18,900원', '1시간 전'],
  ['일정 알림', '오후 3시 · 지어낸치과 정기 검진', '3시간 전'],
  ['더치페이 요청', '지어낸 이름 열두글자사용자 님이 32,000원을 보냈어요', '어제'],
  ['카드 실적을 채웠어요', '지어낸카드 플러스 · 이번 달 실적 30만원 달성', '어제'],
  ['증권 연결이 끊겼어요', '가나증권 — 다시 연결해 주세요', '2일 전'],
  ['예산 80% 사용', '교통 예산 · 10월', '3일 전'],
];

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
// popover.yaml 의 notificationList — 폭 · 최대 높이
export function notifyLook() {
  const v = resolveState(loadComponentSpec('popover'), {}, 'enabled');
  const n = (k: string) => parseFloat(String(unbox(v[`notificationList.${k}`])));
  const width = n('width');
  const maxHeight = n('maxHeight');
  if (!width || !maxHeight) throw new Error('popover.yaml notificationList 의 width · maxHeight 를 읽지 못했다');
  // 줄 끝 ⋮ — "Button ghost neutralSubtle iconOnly xsmall 32"(2026-10-22 알림 지우기 B)
  const moreRaw = String(unbox(v['notificationList.rowMore']));
  const mm = /^Button\s+(ghost)\s+(\w+)\s+(iconOnly)\s+(\w+)\s+(\d+)$/.exec(moreRaw);
  if (!mm) throw new Error(`popover.yaml notificationList.rowMore(${moreRaw})가 "Button ghost <색> iconOnly <크기> <높이>" 꼴이 아니다`);
  const more = buttonLook({ variant: mm[1], ghostColor: mm[2], layout: 'iconOnly', size: mm[4] });
  if (more.faces.light.enabled.height !== Number(mm[5])) throw new Error(`popover.yaml notificationList.rowMore 의 높이 ${mm[5]} 가 Button ${mm[4]} 높이(${more.faces.light.enabled.height})와 다르다`);
  return { width, maxHeight, more };
}

// 알림 줄 — 안 읽은 줄은 앞에 점(fg-brand) · 제목 굵게. 설명은 두 줄까지. 줄 끝 ⋮(이름 "{알림 제목} 더보기")는 줄과 형제다
export function NoticeList({ mode = 'auto', n = NOTICES.length, pad = 24 }: { mode?: Mode; n?: number; pad?: number }) {
  const { more } = notifyLook();
  return (
    <div className="flex flex-col">
      {Array.from({ length: n }, (_, i) => {
        const [t, d, when] = NOTICES[i % NOTICES.length];
        const unread = i < UNREAD;
        return (
          <div key={i} className="flex gap-3" style={{ paddingLeft: pad, paddingRight: pad, paddingTop: 12, paddingBottom: 12 }}>
            <span aria-hidden className="mt-[7px] block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: unread ? rc('fg-brand', mode) : 'transparent' }} />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[14px] leading-[19px]" style={{ fontWeight: unread ? 700 : 500, color: rc('fg-neutral', mode) }}>
                  {t}
                </span>
                <span className="shrink-0 text-[12px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
                  {when}
                </span>
              </span>
              <span className="text-[13px] leading-[18px]" style={{ color: rc('fg-neutral-muted', mode), display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
                {d}
              </span>
            </span>
            <span className="shrink-0 self-start">
              <ButtonView look={more} mode={mode} icon="more-vertical" ariaLabel={`${t} 더보기`} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

const desc = (empty: boolean) => (empty ? '새 알림이 없어요' : `읽지 않은 알림 ${UNREAD}개`);
const EmptyBody = ({ mode }: { mode: Mode }) => (
  <div className="py-10 text-center text-[14px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
    아직 알림이 없어요
  </div>
);

// 벨 아래 Popover — 폭 380 · 높이 600 과 남은 공간 중 작은 쪽
export function NotifyPopover({ mode = 'auto', maxHeight, empty = false }: { mode?: Mode; maxHeight?: number; empty?: boolean }) {
  const p = ov('desk').popover;
  const l = notifyLook();
  return (
    <PopoverSurface
      look={p}
      mode={mode}
      width={l.width}
      title="알림"
      description={desc(empty)}
      close
      maxHeight={Math.min(l.maxHeight, maxHeight ?? l.maxHeight)}
      scroll={{ scrolled: false }}
      fog={!empty}
      bodyPad={false}
      footer={
        <EndButtons
          mode={mode}
          items={[
            { label: '알림 설정', look: btn('neutralWeak', p.footer.button.size) },
            { label: '모두 읽음', look: btn('neutralSolid', p.footer.button.size), state: empty ? 'disabled' : 'enabled' },
          ]}
        />
      }
    >
      {empty ? <EmptyBody mode={mode} /> : <NoticeList mode={mode} />}
    </PopoverSurface>
  );
}

// 768 ~ 1279 — 아래 시트(같은 내용, 바닥 버튼은 large 반씩)
export function NotifySheet({ mode = 'auto', maxHeight }: { mode?: Mode; maxHeight?: number }) {
  const s = ov('desk').sheet;
  return (
    <SheetSurface
      look={s}
      mode={mode}
      title="알림"
      description={desc(false)}
      maxHeight={maxHeight}
      fog
      bodyPad={false}
      footer={<SheetButtons mode={mode} items={[{ label: '알림 설정', look: btn('neutralWeak', 'large') }, { label: '모두 읽음', look: btn('neutralSolid', 'large') }]} />}
    >
      <NoticeList mode={mode} />
    </SheetSurface>
  );
}

// 데스크톱 화면 + 벨의 알림 목록. w 1280 이상이면 벨 아래 Popover(벨 오른쪽 끝 맞춤 · 트리거와 8), 미만이면 딤 + 아래 시트(최대 480 가운데)
export function NotifyDesk({ mode = 'auto', w, h = 720, s = 0.45, empty = false, surface }: { mode?: Mode; w: number; h?: number; s?: number; empty?: boolean; surface?: 'popover' | 'sheet' }) {
  const t = NK().top;
  const p = ov('desk').popover;
  const kind = surface ?? (w >= 1280 ? 'popover' : 'sheet');
  // 벨 — 머리 오른쪽 끝에서 6 + 설정 44 → 벨 상자의 오른쪽 끝은 화면 끝에서 50, 아래 끝은 (56 − 44) ÷ 2 + 44 = 50
  const bellRight = t.desktop.padRight + t.icon.size;
  const bellBottom = (t.height - t.icon.size) / 2 + t.icon.size;
  const top = bellBottom + p.offset;
  let overlay: ReactNode;
  if (kind === 'popover') {
    overlay = (
      <div className="absolute" style={{ right: Math.max(bellRight, p.edge), top, zIndex: 5 }}>
        <NotifyPopover mode={mode} empty={empty} maxHeight={h - top - p.edge} />
      </div>
    );
  } else {
    overlay = (
      <div className="absolute inset-0" style={{ zIndex: 5 }}>
        <DimView dim={ov('desk').sheet.dim} mode={mode} place="end">
          <NotifySheet mode={mode} maxHeight={Math.round(h * 0.9)} />
        </DimView>
      </div>
    );
  }
  return (
    <Desktop mode={mode} w={w} h={h} s={s}>
      <div className="relative" style={{ width: w, height: h }}>
        <Shell mode={mode} side={<Side mode={mode} current="ledger" collapsed={w < 1280} />} header={<DeskHeader mode={mode} />}>
          <DeskMain mode={mode} />
        </Shell>
        {overlay}
      </div>
    </Desktop>
  );
}
