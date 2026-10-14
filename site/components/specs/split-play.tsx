'use client';
// Resizable 플레이그라운드 · 코드 미리보기 — HR 관리 > 회사(1280 의 본문 992)를 칸 폭에 맞춰 줄여 그리고(FitScale) 손잡이를 끌거나,
// 한 번 눌러 25 ↔ 40, 키보드 ← → · Home · End · Enter 로 바꾼다. 아래 글이 왼쪽 · 오른쪽 폭과 읽기를 따라가고, "화면 다시 열기" 는
// 기억한 폭으로 연다(localStorage). 위젯은 모서리를 끌거나 ⋮ → 크기로 바꾼다. 코드는 resizable.md 의 "코드" 절과 같은 API.
import { useState, type ReactNode } from 'react';
import { FitScale, SplitView, WidgetBoard, readSaved } from './collapse-split';
import { BODY_W, WIDGETS } from './collapse-data';
import { icv, type SplitLook, type Tones, type ViewMode, type WidgetLook } from './collapse-shared';
import type { ButtonLook } from './button-look';
import type { MenuKit } from './menu-shared';
import { MODES, Seg } from './select-playground';
import { KebabTrigger } from './menu-demos';
import { MenuControl } from './menu-view';

const STORE = 'hr-admin-company';

// 화면 틀의 테두리(1 × 2)는 본문 바깥 — 안쪽 나눈 자리가 본문 폭 그대로(목록 25% = 1280 의 248)
const FRAME_W = BODY_W + 2;

export function SplitPlayground({ look, wlook, tones, kit, kebab, left, right }: { look: SplitLook; wlook: WidgetLook; tones: Tones; kit: MenuKit; kebab: ButtonLook; left: ReactNode; right: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>('auto');
  const [open, setOpen] = useState(0);
  const [value, setValue] = useState(look.panel.def);
  const [how, setHow] = useState('—');
  const [saved, setSaved] = useState<number | null>(null);
  const [wHow, setWHow] = useState('—');
  const px = Math.round((BODY_W * value) / 100);
  const code = `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

{/* 768 이상만 — 목록 ${look.panel.min} ~ ${look.panel.max}%(오른쪽은 ${100 - look.panel.max}% 아래로 줄지 않는다), 화면마다 폭을 기억 */}
<ResizablePanelGroup storageKey="${STORE}">
  <ResizablePanel id="company-tree" defaultSize={${look.panel.def}} minSize={${look.panel.min}} maxSize={${look.panel.max}}>
    {departmentTree}
  </ResizablePanel>
  <ResizableHandle label="${look.handle.name}" toggleSize={${look.panel.toggle}} />
  <ResizablePanel>{orgChart}</ResizablePanel>
</ResizablePanelGroup>
{/* 지금 목록 ${value}% — ${how} */}`;
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex flex-col gap-4 px-4 py-6" style={{ background: icv(tones['bg-layer-basement'], mode) }}>
        <FitScale w={FRAME_W}>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${icv(tones['stroke-neutral-weak'], mode)}`, background: icv(tones['bg-layer-default'], mode) }}>
            <SplitView
              key={open}
              look={look}
              mode={mode}
              storageKey={STORE}
              live
              height={380}
              left={left}
              right={right}
              onValueChange={(v, h) => {
                setValue(v);
                setHow(h);
                setSaved(readSaved(STORE));
              }}
            />
          </div>
        </FitScale>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] leading-[18px] text-fd-muted-foreground">
          <span>
            <b className="text-fd-foreground">폭</b> 왼쪽 {px}px({value}%) · 오른쪽 {BODY_W - px - look.handle.width}px — {how}
          </span>
          <span>
            <b className="text-fd-foreground">읽기</b> {look.handle.name}, 세로 분리자, {value}
          </span>
          <span>
            <b className="text-fd-foreground">기억</b> {saved === null ? '없음 — 다시 열면 기본' : `${saved}%`}
          </span>
          <button type="button" onClick={() => setOpen((k) => k + 1)} className="rounded-md border border-fd-border bg-fd-background px-2.5 py-1 text-[12px] font-medium text-fd-foreground hover:bg-fd-accent">
            ↻ 화면 다시 열기
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                window.localStorage.removeItem(`porest-split:${STORE}`);
              } catch {
                /* 저장소가 막혀 있어도 된다 */
              }
              setSaved(null);
              setOpen((k) => k + 1);
            }}
            className="rounded-md border border-fd-border bg-fd-background px-2.5 py-1 text-[12px] font-medium text-fd-foreground hover:bg-fd-accent"
          >
            기억 지우기
          </button>
        </div>
        <span className="text-[12px] text-fd-muted-foreground">
          1280 화면의 본문 {BODY_W} 을 칸 폭에 맞춰 줄여 그렸다 — {look.breakpoint} 미만 화면은 나누지 않는다(목록 → 상세 · 탭).
        </span>
        <span className="text-[12px] text-fd-muted-foreground">
          대시보드 편집 모드 — 모서리를 끌거나 ⋮ → {wlook.sizeMenu.label}. 지금: {wHow}
        </span>
        <FitScale w={BODY_W}>
          <WidgetBoard look={wlook} tones={tones} mode={mode} widgets={WIDGETS} live width={BODY_W} menuKit={kit} kebab={kebab} onChange={(ws, h) => setWHow(`${h} — ${ws.map((w) => `${w.title} ${w.cols}칸`).join(' · ')}`)} />
        </FitScale>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">
        <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
      </div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 코드 미리보기 — resizable.md 의 코드 그대로
export function ExSplitDemo({ look, left, right }: { look: SplitLook; left: ReactNode; right: ReactNode }) {
  return (
    <FitScale w={FRAME_W}>
      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--p-stroke-neutral-weak)', background: 'var(--p-bg-layer-default)' }}>
        <SplitView look={look} storageKey={STORE} live height={360} left={left} right={right} />
      </div>
    </FitScale>
  );
}
export function ExWidgetDemo({ wlook, tones, kit, kebab }: { wlook: WidgetLook; tones: Tones; kit: MenuKit; kebab: ButtonLook }) {
  const [cols, setCols] = useState(6);
  const w = WIDGETS[0];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 8, paddingRight: 8, paddingBottom: 8, paddingLeft: 20, borderRadius: wlook.placeholder.radius, border: '1px solid var(--p-stroke-neutral-weak)', background: 'var(--p-bg-layer-default)' }}>
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700, color: 'var(--p-fg-neutral)' }}>{w.title}</span>
        <span style={{ fontSize: 13, lineHeight: '18px', color: 'var(--p-fg-neutral-subtle)' }}>지금 {cols}칸 · 높이는 그대로</span>
      </span>
      <MenuControl
        look={kit.menu}
        groups={[{ label: wlook.sizeMenu.label, items: wlook.sizeMenu.items.map((i) => ({ value: String(i.columns), label: i.label, description: cols === i.columns ? '지금 크기' : undefined })) }]}
        onAction={(v) => setCols(Number(v))}
        trigger={(r) => <KebabTrigger look={kebab} mode="auto" label={`${w.title} 더보기`} render={r} />}
      />
    </div>
  );
}
