// 컴포넌트 페이지의 화면 예시 조각 — Desk · HR 화면을 실제 크기로 그린다(SEED 가이드의 앱 화면 그림 자리).
// 색은 역할 색(DESIGN*.md)에서, 글자 크기는 화면 예시라 그림 안에서 정한다(컴포넌트 자체의 값은 YAML 에서 온다).
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { ChevronRight, Signal, Wifi, BatteryFull } from 'lucide-react';
import { color, design, type Brand } from '@/lib/design-tokens';
import { tokenValue } from '@/lib/component-spec';
import { buttonLook } from './button-look';
import { DESK_TABS, addLabelFor, tabForTitle } from './nav-data';
import { navKit } from './nav-look';
import { tabBottom, type TabSize } from './nav-shared';
import { TabBar as NavTabBar, TopNavBar } from './nav-view';
import { overlayLook } from './overlay-look';
import { AlertSurface, DialogSurface, DimView, SheetSurface } from './overlay-view';
import { textFieldLook } from './text-field-look';
import { TfFieldView, TfInputView } from './text-field-view';
import { cardLook } from './data-look';
import { CardHeaderView, CardSurface, StatView } from './data-card-view';

// auto 면 사이트의 라이트 · 다크 전환을 따른다 — 색을 hex 대신 --p-* 변수로(tokens-style.tsx 가 깐다)
export type Mode = 'light' | 'dark' | 'auto';
let hrDiff: Set<string> | undefined;
function hrOnly(name: string) {
  hrDiff ??= new Set(Object.keys(design('hr').front.colors).filter((n) => design('hr').front.colors[n] !== design('desk').front.colors[n]).map((n) => n.replace(/-dark$/, '')));
  return hrDiff.has(name);
}
export const rc = (name: string, mode: Mode = 'auto', brand: Brand = 'desk') => {
  if (mode === 'auto') return `var(--p-${brand === 'hr' && hrOnly(name) ? 'hr-' : ''}${name})`;
  return name === 'static-white' || name === 'static-black' ? color(name, brand) : color(mode === 'dark' ? `${name}-dark` : name, brand);
};
const deco = (mode: Mode, name: 'frame' | 'chrome' | 'chrome-url') =>
  mode === 'auto' ? `var(--p-${name})` : ({ frame: ['#1A1F2E', '#3A3F4C'], chrome: ['#E4E6EB', '#2B303D'], 'chrome-url': ['#F5F6FA', '#1E222C'] } as const)[name][mode === 'dark' ? 1 : 0];

export const PHONE_W = 360;
// 기기 틀 두께 — 틀은 화면 안쪽으로 그린다(screenW 를 주면 바깥으로 — 화면 폭이 그 값이 된다)
const FRAME = 8;

// 휴대폰 화면 — 상태 막대 · 상단 바(Top Navigation) · 본문 · 아래 고정 영역 · 하단 탭 바(Bottom Navigation). scale 로 줄여 그린다(나란히 둘 때).
// screenW 를 주면 틀 안 화면이 정확히 그 폭이다(스펙의 "360 폰" 수치를 그대로 재야 하는 그림)
// title 을 주면 상단 바다 — back 이면 ← + 제목(standard), 아니면 탭 첫 화면의 큰 제목(root). bar 를 주면 그것을 그대로 그린다.
// tabs 면 떠 있는 탭 바(홈 · 가계부 · + · 캘린더 · 전체) — 본문은 바 위 끝에서 끝난다(그림은 바 아래를 비운다). 지금 탭은 tab, 없으면 제목으로 고른다
export function Phone({
  children,
  title,
  back = true,
  right,
  bar,
  bottom,
  overlay,
  mode = 'auto',
  h = 600,
  scale = 1,
  bg = 'bg-layer-basement',
  tabs = false,
  tab,
  tabSize = 'regular',
  safe = 0,
  screenW,
  brand = 'desk',
}: {
  children?: ReactNode;
  title?: string;
  back?: boolean;
  right?: ReactNode;
  bar?: ReactNode;
  bottom?: ReactNode;
  overlay?: ReactNode;
  mode?: Mode;
  h?: number;
  scale?: number;
  bg?: string;
  tabs?: boolean;
  tab?: string;
  tabSize?: TabSize;
  // 아래 안전 영역(홈 표시줄) — 탭 바의 아래 자리
  safe?: number;
  screenW?: number;
  brand?: Brand;
}) {
  const nk = navKit(brand === 'hr' ? 'hr' : 'desk');
  const fg = rc('fg-neutral', mode);
  const w = screenW ? screenW + FRAME * 2 : PHONE_W;
  return (
    <div className="shrink-0" style={{ width: w * scale, height: h * scale }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: w,
          height: h,
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: 'top left',
          borderRadius: 36,
          border: `${FRAME}px solid ${deco(mode, 'frame')}`,
          background: rc(bg, mode),
          fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
          color: fg,
        }}
      >
        <div className="flex h-10 shrink-0 items-center justify-between px-6 text-[13px] font-bold" style={{ background: rc('bg-layer-default', mode) }}>
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Signal size={14} />
            <Wifi size={14} />
            <BatteryFull size={16} />
          </span>
        </div>
        {bar ?? (title !== undefined && <TopNavBar look={nk.top} mode={mode} type={back ? 'standard' : 'root'} title={title} trailing={right} />)}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        {bottom && (
          <div className="shrink-0 px-6 pb-7 pt-3" style={{ background: rc('bg-layer-default', mode) }}>
            {bottom}
          </div>
        )}
        {tabs && <TabZone mode={mode} tab={tab ?? tabForTitle(title)} size={tabSize} safe={safe} brand={brand === 'hr' ? 'hr' : 'desk'} />}
        {overlay}
      </div>
    </div>
  );
}

// 떠 있는 탭 바 자리 — 본문은 바 위 끝에서 끝나고(본문 아래 여백 — 끝까지 내린 목록), 바는 그 아래 떠 있다(Bottom Navigation)
export function TabZone({ mode = 'auto', tab = 'home', size = 'regular', safe = 0, brand = 'desk' }: { mode?: Mode; tab?: string; size?: TabSize; safe?: number; brand?: 'desk' | 'hr' }) {
  const look = navKit(brand).tab;
  const zoneH = tabBottom(look, 'regular', safe) + look.sizes.regular.h;
  return (
    <div className="relative shrink-0" style={{ height: zoneH, isolation: 'isolate' }}>
      <NavTabBar look={look} mode={mode} items={DESK_TABS} current={tab} addLabel={addLabelFor(tab)} size={size} safe={safe} />
    </div>
  );
}

// 흰 카드 — 회색 바탕(bg-layer-basement) 위의 한 묶음. 면 · 테두리 · 모서리 · 여백은 card.yaml(CardSurface) — 흰 바탕 위에 두지 않는다.
// title 을 주면 카드 머리(제목 16 / 22 · 700 + "전체 보기"). body="list" 는 줄이 가장자리까지(좌우 0 · 아래 12) —
// 머리 없는 목록 카드는 위도 12 를 둬 첫 줄의 위 12 와 합쳐 보이는 24 로 아래와 같게 한다(card.yaml 에 자리가 없어 아래 값을 따른다)
export function Card({ children, mode = 'auto', style, body = 'content', title, action }: { children: ReactNode; mode?: Mode; style?: CSSProperties; body?: 'content' | 'list'; title?: string; action?: string }) {
  const c = cardLook();
  return (
    <CardSurface look={c} mode={mode} body={body} style={body === 'list' && !title ? { paddingTop: c.list.padBottom, ...style } : style}>
      {title && <CardHeaderView look={c} mode={mode} title={title} action={action} body={body} heading="span" />}
      {children}
    </CardSurface>
  );
}
// 폰 화면의 카드 묶음 — 화면 끝 spacing-global-gutter(24) 안에 카드를 8(card.yaml root.gap) 띄워 쌓는다. 상단 바 아래도 8
export function cardStack(): CSSProperties {
  const gap = cardLook().surface.gap;
  const x = parseFloat(String(tokenValue('$spacing-global-gutter')));
  return { display: 'flex', flexDirection: 'column', gap, paddingTop: gap, paddingLeft: x, paddingRight: x };
}
// 지표 — 카드 안 라벨 · 큰 숫자 · 증감(card.yaml statLabel · statValue · delta)
export function Stat(p: Omit<Parameters<typeof StatView>[0], 'look'>) {
  return <StatView look={cardLook()} {...p} />;
}

// 목록 줄 — 앞 타일(카테고리 색 · 첫 글자) · 제목 · 부제 · 뒤 금액. 물건 · 분류는 각진 타일이다(원은 사람 Avatar — avatar.md) — 모서리는 크기 × 0.3(list.yaml 타일)
export function Row({
  title,
  sub,
  amount,
  hue = 'blue',
  mode = 'auto',
  trailing,
}: {
  title: string;
  sub?: string;
  amount?: string;
  hue?: string;
  mode?: Mode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[15px] font-bold" style={{ background: rc(`chart-${hue}-weak`, mode), color: rc(`chart-${hue}-contrast`, mode) }}>
        {title.slice(0, 1)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium" style={{ color: rc('fg-neutral', mode) }}>
          {title}
        </span>
        {/* 설명 줄 — 여러 메타를 " · " 로 이으면 Tag Group 의 모양(구분은 fg-disabled · 보조 기술에는 ", " — tag-group.yaml) */}
        {sub && (
          <span className="truncate text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
            {sub.split(' · ').map((part, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <>
                    <span aria-hidden style={{ color: rc('fg-disabled', mode) }}>
                      {'\u00A0·\u0020'}
                    </span>
                    <span className="sr-only">, </span>
                  </>
                )}
                {part}
              </Fragment>
            ))}
          </span>
        )}
      </span>
      {amount && (
        <span className="text-[15px] font-bold tabular-nums" style={{ color: rc('fg-neutral', mode) }}>
          {amount}
        </span>
      )}
      {trailing}
    </div>
  );
}

export function Heading({ children, mode = 'auto', sub }: { children: ReactNode; mode?: Mode; sub?: string }) {
  return (
    <div className="flex items-end justify-between">
      <span className="text-[17px] font-bold" style={{ color: rc('fg-neutral', mode) }}>
        {children}
      </span>
      {sub && (
        <span className="flex items-center text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
          {sub}
          <ChevronRight size={14} />
        </span>
      )}
    </div>
  );
}

export function Line({ w = '60%', mode = 'auto', h = 10, tone = 'stroke-neutral-weak' }: { w?: number | string; mode?: Mode; h?: number; tone?: string }) {
  return <span className="block rounded-full" style={{ width: w, height: h, background: rc(tone, mode) }} />;
}

// 입력칸 — 라벨 · 값. Field · Input 스펙(field · input.yaml)대로 — 휴대폰 화면 안은 large, 데스크톱 웹 창 안은 medium
export function Field({ label, value, mode = 'auto', placeholder = false, size = 'large' }: { label: string; value: string; mode?: Mode; placeholder?: boolean; size?: 'large' | 'medium' }) {
  const lk = textFieldLook('desk');
  return (
    <TfFieldView look={lk.field} mode={mode} label={label || undefined}>
      <TfInputView look={lk.input} mode={mode} size={size} state="enabled" value={placeholder ? undefined : value} placeholder={placeholder ? value : undefined} />
    </TfFieldView>
  );
}

// 그림 속 폰의 홈 표시줄 자리 — 시트 바닥 아래에 더하는 안전 영역(기기마다 다르다). Phone 의 아래 고정 영역(위 12 · 아래 28)과 맞춘다
export const PHONE_SAFE = 12;

// 아래에서 올라온 시트 — Bottom Sheet(bottom-sheet.yaml): 위 닫기(원) · 제목 · 본문 · 바닥 버튼, 손잡이 없음
export function Sheet({ title, children, footer, mode = 'auto', close = true }: { title: string; children?: ReactNode; footer?: ReactNode; mode?: Mode; close?: boolean }) {
  const o = overlayLook();
  return (
    <DimView dim={o.sheet.dim} mode={mode} place="end">
      <SheetSurface look={o.sheet} mode={mode} title={title} close={close} footer={footer} safe={PHONE_SAFE}>
        {children}
      </SheetSurface>
    </DimView>
  );
}

// 가운데 확인창 — Alert Dialog(alert-dialog.yaml). 폰 그림이라 버튼은 1280 미만의 크기(medium), 취소 왼쪽 · 확정 오른쪽(길면 세로)
export function AlertBox({ title, body, cancel = '취소', confirm, tone = 'critical', mode = 'auto', brand = 'desk' }: { title: string; body: string; cancel?: string; confirm: string; tone?: 'critical' | 'neutral'; mode?: Mode; brand?: Brand }) {
  const o = overlayLook(brand === 'hr' ? 'hr' : 'desk');
  const size = o.alert.footer.below.size;
  return (
    <DimView dim={o.alert.dim} mode={mode} place="center">
      <AlertSurface
        look={o.alert}
        mode={mode}
        title={title}
        description={body}
        cancel={{ label: cancel, look: buttonLook({ variant: 'neutralWeak', size }, brand) }}
        confirm={{ label: confirm, look: buttonLook({ variant: tone === 'critical' ? 'criticalSolid' : 'neutralSolid', size }, brand) }}
      />
    </DimView>
  );
}

// 웹 창 — 데스크탑 화면(Desk 웹 · HR 웹)
export function WebWindow({ children, mode = 'auto', w = 640, h = 380, url = 'desk.groo.app' }: { children: ReactNode; mode?: Mode; w?: number; h?: number; url?: string }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-black/10 shadow-sm" style={{ width: w, height: h, background: rc('bg-layer-basement', mode) }}>
      <div className="flex h-8 items-center gap-1.5 px-3" style={{ background: deco(mode, 'chrome') }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} className="block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} />
        ))}
        {/* 좁은 창에서는 점이 아니라 주소가 줄어든다 */}
        <span className="ml-3 min-w-0 truncate rounded px-3 text-[11px] leading-5" style={{ background: deco(mode, 'chrome-url'), color: '#8A91A0' }}>
          {url}
        </span>
      </div>
      <div className="relative" style={{ height: h - 32 }}>
        {children}
      </div>
    </div>
  );
}

// 웹의 가운데 대화상자 — Dialog(dialog.yaml) medium. 입력 폼은 바닥 [취소] [주 버튼] 이고 머리 닫기가 없다 — 조회 · 안내만 close
export function WebDialog({ title, description, children, footer, mode = 'auto', close = false, brand = 'desk' }: { title: string; description?: string; children: ReactNode; footer?: ReactNode; mode?: Mode; close?: boolean; brand?: Brand }) {
  const o = overlayLook(brand === 'hr' ? 'hr' : 'desk');
  return (
    <DimView dim={o.dialog.dim} mode={mode} place="center">
      <DialogSurface look={o.dialog} mode={mode} title={title} description={description} close={close} footer={footer} scroll={{ scrolled: false }}>
        {children}
      </DialogSurface>
    </DimView>
  );
}

// 키 · 값 한 줄(상세 모달 안)
export function KV({ k, v, mode = 'auto' }: { k: string; v: string; mode?: Mode }) {
  return (
    <div className="flex justify-between py-2 text-[14px]">
      <span style={{ color: rc('fg-neutral-subtle', mode) }}>{k}</span>
      <span className="font-medium" style={{ color: rc('fg-neutral', mode) }}>
        {v}
      </span>
    </div>
  );
}

// 이렇게 · 이렇게 하지 않는다 — 그림 칸 아래 색 띠와 한 줄(SEED 의 Do · Don't)
export function Verdict({ ok, children, note, bg = 'var(--p-bg-layer-default)' }: { ok: boolean; children: ReactNode; note: ReactNode; bg?: string }) {
  const tone = color(ok ? 'fg-positive' : 'fg-critical');
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex flex-1 items-center justify-center rounded-t-xl p-5" style={{ background: bg }}>
        {children}
      </div>
      <div className="h-1" style={{ background: tone }} />
      <div className="pt-2 text-[13px] leading-5">
        <b style={{ color: tone }}>{ok ? '이렇게' : '이렇게 하지 않는다'}</b>
        <span className="text-fd-muted-foreground"> — {note}</span>
      </div>
    </div>
  );
}
