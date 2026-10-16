// List 페이지의 하위 줄 그림 — list.md 의 `#nested` · `#ex-nested` 자리(list.tsx 의 listFigures 에 더한다).
// 줄의 글 · 타일 · 누름은 list.yaml 의 줄 값(listLook), 꺾쇠 단추 · 들임 · 펼침은 nest · expanded 규칙(listNestLook — list-nest-view)이다.
// 카테고리 이름은 지어낸 것이다(collapse-data — 입력 상한 14자까지).
import type { ReactNode } from 'react';
import { Panel, MARK_LINE } from '../foundations/ui';
import { CATEGORIES } from './collapse-data';
import { listNestLook } from './collapse-look';
import { listLook } from './list-look';
import { NestedListView } from './list-nest-view';
import { Cap, CodePreview } from './nav-screens';

type Fig = (p: { caption?: string }) => ReactNode;
const NL = () => listNestLook();
// 세로 기준선 — 앞 붙이개 · 하위 타일이 서는 자리
function Guide({ x, label, row = 0 }: { x: number; label: string; row?: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ left: x, top: -18 - row * 18, bottom: 0, borderLeft: `1px dashed ${MARK_LINE}`, zIndex: 5 }}>
      <span className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ left: -1, top: 0, transform: 'translateX(-50%)', background: MARK_LINE }}>
        {label}
      </span>
    </span>
  );
}
function NestBlock({ w, strong, cap }: { w: number; strong: string; cap: string }) {
  const n = NL();
  const f = listLook().faces.none.light.enabled;
  const tileX = n.parentPadL + n.button.size + n.button.marginRight;
  const cats = [CATEGORIES[0], CATEGORIES[1], CATEGORIES.find((c) => c.id === 'etc')!];
  return (
    <div className="flex max-w-full flex-col items-center gap-2">
      <div className="max-w-full overflow-x-auto">
        <div style={{ position: 'relative', width: w, marginTop: 38, background: 'var(--p-bg-layer-default)', borderRadius: 12 }}>
          <NestedListView list={listLook()} nest={n} categories={cats} open={['food']} width={w} childLimit={3} showHit />
          <Guide x={tileX} label={`타일 ${tileX}`} />
          {/* 하위 줄의 시작 = 부모의 제목 자리 — 한 선 */}
          <Guide x={n.childPadL} row={1} label={`하위 ${n.childPadL} = 제목 ${tileX + f.tile.size + f.prefix.padRight}`} />
        </div>
      </div>
      <Cap strong={strong}>{cap}</Cap>
    </div>
  );
}

export const Nested: Fig = ({ caption }) => {
  const n = NL();
  const f = listLook().faces.none.light.enabled;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <NestBlock w={360} strong="폰 360" cap="식비는 펼침(하위 3줄까지 그림) · 주거는 접힘 · 기타는 하위 없음 — 꺾쇠 자리를 비운다" />
        <NestBlock w={600} strong="데스크톱 — 설정 > 카테고리" cap="폭이 넓어도 들임은 같다" />
        <Cap w={640}>
          줄 앞 {n.parentPadL} · 꺾쇠 단추 {n.button.size}(보이는 상자 = 누르는 영역, 분홍) · 단추 뒤 {n.button.marginRight} 를 지나 앞 붙이개가 {n.parentPadL + n.button.size + n.button.marginRight} 에서 시작한다. 하위 줄은 부모의 제목 자리 {n.childPadL}(= {n.parentPadL} + {n.button.size} + {n.button.marginRight} + 타일 {f.tile.size} + {f.prefix.padRight}) — 꺾쇠 {n.button.icon} chevron-right · 펼치면 {n.button.openRotate}° · 하위 줄은 높이로 {n.motion.sub.duration}. 이름은 "{'{카테고리}'} 하위 카테고리" 로 고정, 오른쪽 화살표는 달지 않는다(줄은 편집을 연다)
        </Cap>
      </div>
    </Panel>
  );
};

// 늘 펼친 편집 화면(collapsible={false}, list.yaml mode fixed — 2026-10-15 Q-002) — 같은 카테고리를 보통 화면(접는 줄)과 나란히.
// 꺾쇠 단추가 없어도 그 자리를 같은 폭으로 비워 부모 타일이 같은 자리에 선다
export const NestedFixed: Fig = ({ caption }) => {
  const n = NL();
  const cats = [CATEGORIES[0], CATEGORIES[1], CATEGORIES.find((c) => c.id === 'etc')!];
  const tileX = n.parentPadL + n.button.size + n.button.marginRight;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex max-w-full flex-wrap items-start justify-center gap-6">
          {([
            ['보통 화면 — 접는 줄', '꺾쇠 단추 · 이름 "{카테고리} 하위 카테고리" + aria-expanded', false],
            ['편집 화면 — collapsible={false}', '꺾쇠 자리는 비우고 하위 줄은 늘 보인다 · aria-expanded 없음', true],
          ] as const).map(([strong, cap, fixed]) => (
            <div key={strong} className="flex max-w-full flex-col items-center gap-2">
              <div className="max-w-full overflow-x-auto">
                <div style={{ position: 'relative', width: 360, marginTop: 20, background: 'var(--p-bg-layer-default)', borderRadius: 12 }}>
                  <NestedListView list={listLook()} nest={n} categories={cats} open={['food']} width={360} childLimit={2} fixed={fixed} ariaLabel={fixed ? '지출 카테고리 편집' : '지출 카테고리'} />
                  <Guide x={tileX} label={`타일 ${tileX}`} />
                </div>
              </div>
              <Cap strong={strong}>{cap}</Cap>
            </div>
          ))}
        </div>
        <Cap w={640}>
          늘 펼친 편집 화면도 꺾쇠 자리 {n.button.size} + {n.button.marginRight} 를 비워 부모 타일이 {tileX} 에 선다 — 두 화면을 오가도 타일 · 제목이 움직이지 않는다(17B). 하위 줄(그림은 둘까지)은 늘 보이고 펼침 상태가 없다 — Tree View 의 collapsible 과 같은 뜻이다. 접는 줄은 이름(expandLabel)이 필수다
        </Cap>
      </div>
    </Panel>
  );
};

// 코드 미리보기 — list.md 의 코드 그대로(식비 하위 6개 펼침 · 기타는 하위 없음)
export const ExNested: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={16} padX={0} bg="bg-layer-default">
    <NestedListView list={listLook()} nest={NL()} categories={[CATEGORIES[0], CATEGORIES.find((c) => c.id === 'etc')!]} width={360} live />
  </CodePreview>
);

// 코드 미리보기 — list.md 의 "하위 줄 — 늘 펼친 편집 화면" 코드(collapsible={false})
export const ExNestedFixed: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={16} padX={0} bg="bg-layer-default">
    <NestedListView list={listLook()} nest={NL()} categories={[CATEGORIES[0], CATEGORIES.find((c) => c.id === 'etc')!]} width={360} fixed live ariaLabel="지출 카테고리 편집" />
  </CodePreview>
);
