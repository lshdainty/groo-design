// Menu Sheet 페이지의 그림 — specs/components/menu-sheet.md 의 `[그림: …](../../site/components/specs/menu-sheet.tsx#<id>)` 자리.
// 시트는 menu-sheet.yaml 을 푼 값(menuKit().sheet — menu-view 의 MenuSheetSurface)으로, 딤은 Bottom Sheet 와 같은 값, 메뉴는 menu.yaml,
// 스와이프 트레이는 swipe-actions.yaml 로 그린다. 폰 그림의 안전 영역(홈 표시줄)은 기기 값이라 그림에서 정한다(PHONE_SAFE).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { HeaderSheetDemo, MenuSheetPlayground, PhotoSheetDemo } from './menu-demos';
import { DELETE, DUPLICATE, EDIT, EXPORT_LEAVE, HEADER_MENU, MEMOS, MEMO_MENU, PHOTO_MENU, PIN, RESET_PASSWORD, SWIPE_SHEET } from './menu-data';
import type { MenuGroup } from './menu-look';
import { DesktopMemoMenu, Kebab, MemoPhone, PHONE_SAFE, PhoneMemoSheet, Sheet, SheetCrop, SheetOn, iconBtn, mk, modeName } from './menu-screens';
import { Band, Legend, Note, Shot, overlayKit, pinAt, pinStyle } from './overlay-screens';
import { Cap } from './select-screens';
import { Verdict } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const px = (v: string) => parseFloat(v);
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const markBox: CSSProperties = { ...dashed, background: MARK };
const BASEMENT = 'var(--p-bg-layer-basement)';
// 높이 표시 — 부위 오른쪽 안쪽의 수
const Tag = ({ label, style }: { label: string; style: CSSProperties }) => (
  <span aria-hidden className="pointer-events-none absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, zIndex: 5, ...style }}>
    {label}
  </span>
);
// 폭을 정한 그림 칸 — 아래 설명이 길어도 칸이 넓어지지 않는다
const NShot = ({ w, strong, cap, children }: { w: number; strong: ReactNode; cap: ReactNode; children: ReactNode }) => (
  <div className="flex max-w-full flex-col items-center gap-2" style={{ width: w }}>
    <div className="max-w-full overflow-x-auto">{children}</div>
    <Cap strong={strong}>{cap}</Cap>
  </div>
);
// 안전 영역 — 빗금(기기마다 다른 값이라 수치 없이)
const SafeBand = () => <Band style={{ left: 0, right: 0, bottom: 0, height: PHONE_SAFE, background: `repeating-linear-gradient(135deg, ${MARK_LINE}55 0 3px, transparent 3px 7px)` }} />;

// HR 직원 시트 — 설명이 있는 줄 · 막힌 줄(상태 그림)
const PERSON_SHEET: MenuGroup[] = [{ items: [EDIT, { ...RESET_PASSWORD, icon: 'key' }, { ...EXPORT_LEAVE, icon: 'download' }] }, { items: [DELETE] }];

// ── Overview ──────────────────────────────────────────────
// 메모 줄 ⋮ 의 시트 · 메모 화면 머리 더보기 — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-wrap items-start justify-center gap-4">
          <MemoPhone
            mode={mode}
            scale={0.52}
            overlay={
              <SheetOn mode={mode}>
                <Sheet mode={mode} title="주간 회의 메모" />
              </SheetOn>
            }
          />
          <MemoPhone
            mode={mode}
            scale={0.52}
            right={<Kebab label="메모" mode={mode} />}
            overlay={
              <SheetOn mode={mode}>
                <Sheet mode={mode} title="메모" groups={HEADER_MENU} />
              </SheetOn>
            }
          />
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <MenuSheetPlayground kits={{ desk: mk('desk'), hr: mk('hr') }} ovs={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} kebabs={{ desk: iconBtn('desk'), hr: iconBtn('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const s = mk().sheet;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <MemoPhone
          scale={1}
          overlay={
            <SheetOn>
              {pinStyle('ⓐ', { right: 16, top: 58 })}
              <Sheet
                title="주간 회의 메모"
                marks={{ handle: markBox, header: dashed, groups: { 1: dashed }, items: { edit: dashed } }}
                decor={{
                  root: (
                    <>
                      {pinStyle('ⓑ', { left: 6, top: -26 })}
                      {pinStyle('ⓒ', { left: `calc(50% + ${s.handle.width / 2 + 8}px)`, top: s.handle.top + s.handle.height / 2 - 10 })}
                    </>
                  ),
                  header: pinAt('ⓓ', -12, 2),
                  groups: { 1: pinAt('ⓔ', 6, (s.item.minHeight - 20) / 2) },
                  items: { edit: pinStyle('ⓕ', { right: 8, top: (s.item.minHeight - 20) / 2 }) },
                }}
              />
            </SheetOn>
          }
        />
        <Legend
          items={[
            ['ⓐ', 'Overlay'],
            ['ⓑ', 'Container'],
            ['ⓒ', 'Handle — 늘 있다'],
            ['ⓓ', 'Header'],
            ['ⓔ', 'Group'],
            ['ⓕ', 'Item'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── 머리 · 묶음 · 줄의 여백 ──────────────────────────────
const Layout: Fig = ({ caption }) => {
  const s = mk().sheet;
  const it = s.item;
  const p = s.pad;
  const titleH = px(s.title.lineHeight);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <SheetCrop w={360}>
          <Sheet
            title="주간 회의 메모"
            description="10월 2일에 쓴 메모예요."
            marks={{ handle: markBox }}
            decor={{
              root: (
                <>
                  <Band style={{ left: 0, right: 0, top: 0, height: p.top }} label={String(p.top)} />
                  <Band style={{ left: 0, top: p.top, bottom: p.bottom + PHONE_SAFE, width: p.x }} label={String(p.x)} />
                  <Band style={{ right: 0, top: p.top, bottom: p.bottom + PHONE_SAFE, width: p.x }} />
                  <Band style={{ left: 0, right: 0, bottom: PHONE_SAFE, height: p.bottom }} label={String(p.bottom)} />
                  <SafeBand />
                  <Tag label={`${s.handle.width} × ${s.handle.height} · 위 ${s.handle.top}`} style={{ left: `calc(50% + ${s.handle.width / 2 + 6}px)`, top: s.handle.top - 6 }} />
                </>
              ),
              header: (
                <>
                  <Band style={{ left: 0, right: 0, top: titleH, height: s.header.gap }} />
                  <Band style={{ left: 0, right: 0, bottom: 0, height: s.header.padBottom }} label={String(s.header.padBottom)} />
                </>
              ),
              groups: { 1: <Band style={{ left: 0, right: 0, bottom: '100%', height: s.group.gap }} label={String(s.group.gap)} /> },
              items: {
                pin: (
                  <>
                    <Band style={{ left: 0, top: 0, bottom: 0, width: it.padX }} label={String(it.padX)} />
                    <Band style={{ left: it.padX, right: it.padX, top: 0, height: it.padY }} label={String(it.padY)} />
                    <Band style={{ left: it.padX + it.icon, top: it.padY, bottom: it.padY, width: it.gap }} label={String(it.gap)} />
                    <Tag label={`${it.minHeight}`} style={{ right: 8, top: (it.minHeight - 16) / 2 }} />
                  </>
                ),
              },
            }}
          />
        </SheetCrop>
        <Note>
          위 {p.top}(손잡이 자리) · 좌우 {p.x} · 아래 {p.bottom} + 안전 영역(빗금, 기기마다) · 위 모서리 {s.radius} · 손잡이 {s.handle.width} × {s.handle.height}(위 {s.handle.top}) — 머리 가운데 정렬, 제목 {px(s.title.fontSize)} / {px(s.title.lineHeight)} · {s.title.fontWeight} ↔ 설명 {px(s.description.fontSize)} / {px(s.description.lineHeight)} 사이 {s.header.gap} · 아래 {s.header.padBottom}
          <br />
          묶음 모서리 {s.group.radius} · 묶음 사이 {s.group.gap} — 줄 최소 {it.minHeight} · 위아래 {it.padY} · 좌우 {it.padX} · 아이콘 {it.icon} · 사이 {it.gap} · 이름 {px(it.label.fontSize)} / {px(it.label.lineHeight)} · 줄 사이 선 {s.divider.height}(묶음의 마지막 줄 아래에는 없다)
        </Note>
      </div>
    </Panel>
  );
};

// ── Layout — 아이콘 + 글 · 글만 ───────────────────────────
const Layouts: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap items-start justify-center gap-6">
      <Shot strong="textWithIcon(기본)" cap="아이콘 + 글 — 왼쪽 정렬, 줄 설명을 둘 수 있다">
        <SheetCrop w={320}>
          <Sheet title="메모" groups={HEADER_MENU} />
        </SheetCrop>
      </Shot>
      <Shot strong="textOnly" cap="글만 — 가운데 정렬, 줄 설명은 두지 않는다">
        <SheetCrop w={320}>
          <Sheet title="사진" groups={PHOTO_MENU} layout="textOnly" />
        </SheetCrop>
      </Shot>
    </div>
  </Panel>
);

// ── State ─────────────────────────────────────────────────
// 누름(바탕 + 내용 축소 — 설명 · 위험한 이름은 진한 색) · 막힌 줄 · 키보드(줄 안쪽 링) · 보조 기술용 닫기 — 라이트 · 다크
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-6">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="grid justify-items-center gap-4 md:grid-cols-2">
          <NShot w={300} strong={`${modeName(mode)} — 누름 · 막힘`} cap="누르는 줄은 바탕 + 내용 축소(설명 · 위험한 이름은 진한 색) · 막힌 줄은 전용 색">
            <SheetCrop w={300} mode={mode}>
              <Sheet mode={mode} title="김하늘" groups={PERSON_SHEET} states={{ reset: 'pressed', export: 'disabled', delete: 'pressed' }} />
            </SheetCrop>
          </NShot>
          <NShot w={300} strong={`${modeName(mode)} — 키보드`} cap="키보드 초점은 줄 안쪽 링 · Tab 이 닫기에 오면 닫기가 보인다">
            <div className="flex flex-col gap-3">
              <SheetCrop w={300} mode={mode}>
                <Sheet mode={mode} title="주간 회의 메모" states={{ edit: 'focused' }} />
              </SheetCrop>
              <SheetCrop w={300} mode={mode} top={20}>
                <Sheet mode={mode} groups={[{ items: [PIN, EDIT] }]} closeShown />
              </SheetCrop>
            </div>
          </NShot>
        </div>
      ))}
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
// 1280 에서 — 메뉴 시트 ↔ 메뉴(같은 줄 · 같은 순서)
const ResponsiveGuide: Fig = ({ caption }) => {
  const k = mk();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Shot strong={`${k.menu.breakpoint} 미만 — Menu Sheet`} cap={`손가락용 · 줄 ${k.sheet.item.minHeight} · 화면 아래라 엄지가 닿는다`}>
          <PhoneMemoSheet />
        </Shot>
        <Shot strong={`${k.menu.breakpoint} 이상 — Menu`} cap={`마우스용 · 줄 ${k.menu.item.height} · 같은 줄 · 같은 순서 · 같은 막힘`}>
          <DesktopMemoMenu />
        </Shot>
      </div>
    </Panel>
  );
};

// 스와이프는 지름길 · ⋮ 는 같은 동작의 시트
const SWIPE_MEMOS = [{ title: '주간 회의 메모 — 다음 분기 목표', sub: MEMOS[0].sub }, ...MEMOS.slice(1)];
const SwipeGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap items-start justify-center gap-6">
      <NShot w={240} strong="밀면 바로 — 지름길" cap="첫 줄을 왼쪽으로 민 모습(고정 · 수정 · 삭제) · 줄 끝 ⋮ 는 줄과 함께 밀린다">
        <MemoPhone scale={0.62} swiped memos={SWIPE_MEMOS} />
      </NShot>
      <NShot w={240} strong="⋮ → 같은 동작의 시트" cap="미는 법을 모르는 사람 · 키보드 · 스크린리더의 길 — 같은 이름 · 같은 확인창">
        <MemoPhone
          scale={0.62}
          memos={SWIPE_MEMOS}
          overlay={
            <SheetOn>
              <Sheet title={SWIPE_MEMOS[0].title} groups={SWIPE_SHEET} />
            </SheetOn>
          }
        />
      </NShot>
    </div>
  </Panel>
);

// 묶음 — 3개부터 · 최대 3묶음 · 아이콘은 모두 또는 없음
const GroupGuide: Fig = ({ caption }) => {
  const split: MenuGroup[] = [{ items: [EDIT] }, { items: [DELETE] }];
  const mixed: MenuGroup[] = [{ items: [PIN, { ...EDIT, icon: undefined }, DUPLICATE] }, { items: [{ ...DELETE, icon: undefined }] }];
  return (
    <Panel caption={caption}>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Verdict ok note="줄이 3개 이상이면 묶음 — 위험한 동작은 맨 아래 묶음에 따로(하나여도 된다)" bg={BASEMENT}>
          <SheetCrop w={280}>
            <Sheet title="주간 회의 메모" groups={MEMO_MENU} />
          </SheetCrop>
        </Verdict>
        <Verdict ok={false} note="줄이 둘뿐인데 하나씩 묶음으로 — 줄이 적으면 한 묶음에 둔다" bg={BASEMENT}>
          <SheetCrop w={280}>
            <Sheet title="주간 회의 메모" groups={split} />
          </SheetCrop>
        </Verdict>
        <Verdict ok={false} note="일부 줄에만 아이콘 — 모든 줄에 두거나 모두 뺀다(아이콘 줄과 글만 줄을 섞지 않는다)" bg={BASEMENT}>
          <SheetCrop w={280}>
            <Sheet title="주간 회의 메모" groups={mixed} />
          </SheetCrop>
        </Verdict>
        <Verdict ok={false} note="묶음이 넷 — 최대 3묶음, 한 묶음에는 2개 이상(위험한 동작 묶음만 하나여도 된다)" bg={BASEMENT}>
          <SheetCrop w={280}>
            <Sheet title="주간 회의 메모" groups={[{ items: [PIN, EDIT] }, { items: [DUPLICATE] }, { items: [HEADER_MENU[0].items[1]] }, { items: [DELETE] }]} />
          </SheetCrop>
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 닫는다) ────────────────────────
const ExHeader: Fig = () => <HeaderSheetDemo kit={mk()} ov={overlayKit()} kebab={iconBtn()} groups={HEADER_MENU} />;
const ExTextOnly: Fig = () => <PhotoSheetDemo kit={mk()} ov={overlayKit()} button={buttonLook({ variant: 'neutralWeak', size: 'small' })} groups={PHOTO_MENU} />;

export const menuSheetFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  layouts: Layouts,
  states: States,
  'responsive-guide': ResponsiveGuide,
  'swipe-guide': SwipeGuide,
  'group-guide': GroupGuide,
  'ex-header': ExHeader,
  'ex-text-only': ExTextOnly,
};
