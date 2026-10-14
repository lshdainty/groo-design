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
      <span className="absolute whitespace-nowrap rounded px-1 text-[10px] font-semibold leading-4 text-white" style={{ left: -1, top: 0, transform: 'translateX(-50%)', background: MARK_LINE }}>
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

// 코드 미리보기 — list.md 의 코드 그대로(식비 하위 6개 펼침 · 기타는 하위 없음)
export const ExNested: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={16} padX={0} bg="bg-layer-default">
    <NestedListView list={listLook()} nest={NL()} categories={[CATEGORIES[0], CATEGORIES.find((c) => c.id === 'etc')!]} width={360} live />
  </CodePreview>
);
