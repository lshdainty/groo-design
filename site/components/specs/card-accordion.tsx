// Card 페이지의 카드 안 아코디언 그림 — card.md 의 `#accordion-card` 자리(card.tsx 의 cardFigures 에 더한다).
// 카드 면 · 머리 여백은 card.yaml body accordion(cardLook().accordion), 트리거 · 선 · 모두 펼치기는 accordion.yaml(accordionLook)이다.
import type { ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { BENEFITS } from './collapse-data';
import { AL, AccCard, CDL, benefitItems } from './collapse-screens';
import { Band, Cap } from './nav-screens';

type Fig = (p: { caption?: string }) => ReactNode;

export const AccordionCard: Fig = ({ caption }) => {
  const c = CDL();
  const a = AL();
  const ah = c.accordion.header;
  const w = 312;
  const b = c.surface.borderW;
  // 머리 줄 높이 — 제목 줄과 모두 펼치기(보이는 상자) 가운데 큰 쪽
  const headRow = Math.max(parseFloat(c.title.lineHeight), a.expandAll.h);
  const items = benefitItems({ only: ['coffee', 'transit', 'telecom'], desc: false });
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div style={{ position: 'relative', width: w, padding: 0, marginTop: 8 }}>
          <AccCard title={`혜택 · ${BENEFITS.length}건`} items={items} />
          {/* 머리 — 위 24 · 좌우 24 · 아래 4 */}
          <Band style={{ left: b, right: b, top: b, height: ah.top }} label={String(ah.top)} />
          <Band style={{ left: b, width: ah.x, top: b + ah.top, height: headRow }} label={String(ah.x)} />
          <Band style={{ left: b, right: b, top: b + ah.top + headRow, height: ah.bottom }} label={String(ah.bottom)} tag="right" />
          {/* 카드 아래 8 — 마지막 트리거의 아래 16 과 합쳐 보이는 24 */}
          <Band style={{ left: b, right: b, bottom: b, height: c.accordion.padBottom }} label={String(c.accordion.padBottom)} />
          <Band style={{ right: b + 40, width: 10, bottom: b + c.accordion.padBottom, height: a.padY }} label={String(a.padY)} tag="left" />
        </div>
        <Cap w={620}>
          {`카드 좌우 여백 0 — 트리거가 제 좌우 ${a.padX} · 위아래 ${a.padY} 를 가져 카드 가장자리까지 간다. 머리는 목록 카드와 같은 위 ${ah.top} · 좌우 ${ah.x} · 아래 ${ah.bottom}, 카드 아래 ${c.accordion.padBottom} 은 마지막 트리거의 아래 ${a.padY} 와 합쳐 보이는 ${c.accordion.padBottom + a.padY}. 누름 바탕은 카드 ${c.surface.radius} 안에서 동심 ${a.bg.radius}`}
        </Cap>
      </div>
    </Panel>
  );
};
