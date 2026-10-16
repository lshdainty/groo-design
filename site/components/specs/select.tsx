// Select 페이지의 그림 — specs/components/select.md 의 `[그림: …](../../site/components/specs/select.tsx#<id>)` 자리.
// 트리거 · 목록은 select.yaml 을 푼 값(selectLook)으로, Field 는 field.yaml(textFieldLook)으로, 화면 예시는 kit 의 Desk · HR 화면 조각으로 그린다.
// 휴대폰 화면 안의 칸은 large, 데스크톱 창 안의 칸은 medium 으로 고정한다(반응형은 사이트 폭이 아니라 그 화면의 폭을 따른다).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { radioLook } from './radio-group-look';
import { RadioView } from './radio-group-view';
import { selectBoxLook } from './select-box-look';
import { SelectBoxGroupView } from './select-box-view';
import { SheetOverlay, SheetPanel } from './input-button-pickers';
import { PHONE_SAFE, ov } from './overlay-screens';
import type { ItemState, SelGroup, SelSize, SelectLook, TriggerState } from './select-look';
import { SelectPlayground } from './select-playground';
import { CATS, Cap, Cell, DateTimeFields, F, Form, HeroScreens, Live, PAY_FLAT, PAY_GROUPS, PAY_NONE, POLICY, Surface, desk, hr, plain, tf } from './select-screens';
import { InputButtonView, SelectFieldList, SelectField, SelectListView, SelectOpenView, SelectTriggerView } from './select-view';
import { TfInputView } from './text-field-view';
import { Phone, Verdict, rc } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const px = (v: string) => parseFloat(v);

// 목록 안 줄의 위치 — 위아래 여백 · 묶음 사이(간격 + 선 + 아래 여백) · 묶음 제목 · 선택지 높이로 쌓는다(그림의 핀 · 치수가 YAML 을 따르게)
type Row = { kind: 'item' | 'label' | 'divider'; y: number; h: number; value?: string; group: number };
function rowsOf(lk: SelectLook, size: SelSize, groups: SelGroup[], top = 0) {
  const it = lk.item.sizes[size];
  const gl = lk.groupLabel.sizes[size];
  const rows: Row[] = [];
  let y = top + lk.content.padY;
  groups.forEach((g, gi) => {
    if (gi > 0) {
      y += lk.content.gap;
      rows.push({ kind: 'divider', y, h: lk.divider.height, group: gi });
      y += lk.divider.height + lk.divider.marginBottom;
    }
    if (g.label) {
      rows.push({ kind: 'label', y, h: gl.height, group: gi });
      y += gl.height;
    }
    for (const i of g.items) {
      const h = i.description ? it.heightDesc : it.height;
      rows.push({ kind: 'item', y, h, value: i.value, group: gi });
      y += h;
    }
  });
  return { rows, bottom: y + lk.content.padY };
}

function Pin({ n }: { n: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
}
const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, background: MARK };

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <HeroScreens />
  </Figure>
);

const Playground: Fig = () => <SelectPlayground looks={{ desk: desk(), hr: hr() }} field={tf().field} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = desk();
  const W = 320;
  const b = lk.trigger.sizes.large;
  const groups = plain(PAY_GROUPS);
  const { rows } = rowsOf(lk, 'large', groups, b.h + lk.content.gutter);
  const at = (pred: (r: Row) => boolean) => rows.find(pred)!;
  const label = at((r) => r.kind === 'label');
  const item = at((r) => r.kind === 'item' && r.value === 'hyundai-m');
  const divider = at((r) => r.kind === 'divider');
  const listTop = b.h + lk.content.gutter;
  const right = [
    { n: 'ⓕ', y: label.y + label.h / 2, box: label },
    { n: 'ⓖ', y: item.y + item.h / 2, box: item },
    { n: 'ⓗ', y: divider.y + divider.h / 2, box: { ...divider, y: divider.y - 3, h: divider.h + 6 } },
  ];
  const zone = { icon: markBox, value: markBox, end: markBox };
  // 위 핀 — 앞 아이콘 · 값 자리 · 셰브론의 가운데(여백 · 아이콘 · 간격에서)
  const valueStart = b.padX + b.icon + b.gap;
  const valueEnd = W - b.padX - b.end - b.gap;
  const top = [
    { n: 'ⓑ', x: b.padX + b.icon / 2 },
    { n: 'ⓒ', x: (valueStart + valueEnd) / 2 },
    { n: 'ⓓ', x: W - b.padX - b.end / 2 },
  ];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-12 pb-8 pt-12">
        <div className="relative" style={{ width: W }}>
          {top.map((p) => (
            <span key={p.n} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: p.x, top: -30 }}>
              <Pin n={p.n} />
              <span className="h-2 w-px" style={{ background: MARK_LINE }} />
            </span>
          ))}
          <span className="absolute flex -translate-y-1/2 items-center" style={{ left: -34, top: b.h / 2 }}>
            <Pin n="ⓐ" />
            <span className="h-px w-2" style={{ background: MARK_LINE }} />
          </span>
          <span className="absolute flex -translate-y-1/2 items-center" style={{ left: -34, top: listTop + 28 }}>
            <Pin n="ⓔ" />
            <span className="h-px w-2" style={{ background: MARK_LINE }} />
          </span>
          <SelectOpenView look={lk} size="large" groups={groups} selected={['hyundai-m']} icon="credit-card" zone={zone} />
          <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, top: 0, width: W, height: b.h, borderRadius: b.radius, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }} />
          <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, top: listTop, width: W, bottom: 0, borderRadius: lk.content.radius, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }} />
          {right.map((p) => (
            <span key={p.n}>
              <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, width: W, top: p.box.y, height: p.box.h, ...markBox }} />
              <span className="absolute flex -translate-y-1/2 items-center" style={{ left: W, top: p.y }}>
                <span className="h-px w-3" style={{ background: MARK_LINE }} />
                <Pin n={p.n} />
              </span>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted sm:grid-cols-4">
          {[
            ['ⓐ', 'Trigger'],
            ['ⓑ', 'Prefix Icon'],
            ['ⓒ', 'Value'],
            ['ⓓ', 'Chevron'],
            ['ⓔ', 'Content'],
            ['ⓕ', 'Group Label'],
            ['ⓖ', 'Item'],
            ['ⓗ', 'Divider'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Size: Fig = ({ caption }) => {
  const lk = desk();
  const col = (size: SelSize, where: string) => {
    const b = lk.trigger.sizes[size];
    const i = lk.item.sizes[size];
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <Surface>
          <F label="결제 수단">
            <SelectOpenView look={lk} size={size} groups={plain([PAY_FLAT])} selected={['hyundai-m']} />
          </F>
        </Surface>
        <Cap strong={`${size} — 트리거 ${b.h} · 선택지 ${i.height}`}>
          {where} — 글자 {px(b.text.fontSize)} · 모서리 {b.radius} · 셰브론 {b.end} · 체크 {i.indicator}
        </Cap>
      </div>
    );
  };
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        {col('large', '폰 · 앱')}
        {col('medium', '1280 이상 데스크톱 웹')}
      </div>
    </Panel>
  );
};

const STATE_KO: Record<TriggerState, string> = { enabled: '기본', pressed: '누름', focused: '포커스(키보드)', open: '열림', invalid: '오류', disabled: '비활성', readonly: '읽기 전용' };
const States: Fig = ({ caption }) => {
  const lk = desk();
  const list: TriggerState[] = ['enabled', 'pressed', 'focused', 'open', 'invalid', 'disabled', 'readonly'];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <div key={mode} className="flex flex-col gap-2">
            <Surface mode={mode}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
                {list.map((st) => (
                  <div key={st} className="flex min-w-0 flex-col gap-1.5">
                    <SelectTriggerView look={lk} mode={mode} size="large" state={st} labels={st === 'enabled' || st === 'invalid' ? [] : ['현대카드 M']} placeholder="결제 수단 선택" />
                    <span className="text-center text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
                      {STATE_KO[st]}
                    </span>
                  </div>
                ))}
              </div>
            </Surface>
            <Cap strong={mode === 'light' ? '라이트' : '다크'} />
          </div>
        ))}
      </div>
    </Panel>
  );
};

const ITEM_KO: Record<string, string> = { enabled: '기본', pressed: '누름', keyboard: '키보드 위치', selected: '고름', disabled: '비활성' };
const ItemStates: Fig = ({ caption }) => {
  const lk = desk();
  const it = lk.item.sizes.large;
  // 알약 둘(누름 · 키보드 위치)이 붙지 않게 사이에 고른 줄을 둔다
  const states: Record<string, ItemState> = { cash: 'enabled', 'kb-check': 'pressed', 'hyundai-m': 'selected', toss: 'keyboard', kakao: 'disabled' };
  const groups = plain([PAY_FLAT]);
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {(['light', 'dark'] as const).map((mode) => (
          <Surface key={mode} mode={mode}>
            <div className="flex items-start gap-3">
              <div className="w-[200px] sm:w-[240px]">
                <SelectListView look={lk} mode={mode} size="large" groups={groups} states={states} />
              </div>
              <div className="flex w-[72px] flex-col" style={{ paddingTop: lk.content.padY }}>
                {groups[0].items.map((i) => (
                  <span key={i.value} className="flex items-center text-[12px] leading-4" style={{ height: it.height, color: rc('fg-neutral-subtle', mode) }}>
                    {ITEM_KO[states[i.value]]}
                  </span>
                ))}
              </div>
            </div>
            <span className="mt-3 block text-center text-[12px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {mode === 'light' ? '라이트' : '다크'} — 키보드 위치 · 호버는 누름과 같은 알약(축소 없음)
            </span>
          </Surface>
        ))}
      </div>
    </Panel>
  );
};

const Selection: Fig = ({ caption }) => {
  const lk = desk();
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          <Surface>
            <F label="결제 수단">
              <SelectOpenView look={lk} size="large" groups={plain([PAY_FLAT])} selected={['hyundai-m']} />
            </F>
          </Surface>
          <Cap strong="하나 고르기">고르면 닫히고 값이 칸에 · 다시 눌러도 풀리지 않는다</Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Surface>
            <F label="카테고리">
              <SelectOpenView look={lk} size="large" multiple groups={plain(CATS)} selected={['food', 'transport']} />
            </F>
          </Surface>
          <Cap strong="여럿 고르기 multiple">열린 채로 이어서 고른다 · 다시 누르면 풀린다 · 고른 순서대로 쉼표</Cap>
        </div>
      </div>
    </Panel>
  );
};

const PrefixIcon: Fig = ({ caption }) => {
  const lk = desk();
  const row = (strong: string, sub: string, node: ReactNode) => (
    <div className="flex flex-col gap-1.5">
      {node}
      <Cap strong={strong}>{sub}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          <Surface>
            <F label="결제 수단">
              <SelectOpenView look={lk} size="large" groups={[PAY_FLAT]} selected={['hyundai-m']} icon="wallet" />
            </F>
          </Surface>
          <Cap strong="선택지 아이콘">묶음 안에서 모두 두거나 모두 뺀다 — 고르면 그 아이콘이 트리거로</Cap>
        </div>
        <Surface className="flex flex-col justify-center gap-5">
          {row('고르기 전', '트리거에 준 아이콘(wallet)', <SelectTriggerView look={lk} size="large" state="enabled" icon="wallet" placeholder="결제 수단 선택" />)}
          {row('하나를 골랐다', '그 선택지의 아이콘이 덮는다', <SelectTriggerView look={lk} size="large" state="enabled" icon="credit-card" labels={['현대카드 M']} />)}
          {row('둘 이상 골랐다', '트리거의 아이콘(tag)', <SelectTriggerView look={lk} size="large" state="enabled" icon="tag" multiple labels={['식비', '교통']} />)}
        </Surface>
      </div>
    </Panel>
  );
};

// 목록의 자리 — 폰 화면(360) 안에서 칸 둘레의 남은 화면으로 아래 · 위 · 높이를 정한다
const CURRENCY: SelGroup = {
  items: [
    { value: 'KRW', label: '원', description: 'KRW' },
    { value: 'USD', label: '미국 달러', description: 'USD' },
    { value: 'JPY', label: '일본 엔', description: 'JPY' },
    { value: 'EUR', label: '유로', description: 'EUR' },
    { value: 'CNY', label: '중국 위안', description: 'CNY' },
    { value: 'GBP', label: '영국 파운드', description: 'GBP' },
    { value: 'AUD', label: '호주 달러', description: 'AUD' },
    { value: 'CAD', label: '캐나다 달러', description: 'CAD' },
    { value: 'CHF', label: '스위스 프랑', description: 'CHF' },
    { value: 'HKD', label: '홍콩 달러', description: 'HKD' },
    { value: 'SGD', label: '싱가포르 달러', description: 'SGD' },
    { value: 'VND', label: '베트남 동', description: 'VND' },
  ],
};
function GutterMark({ top, h, side = 'below' }: { top: number; h: number; side?: 'below' | 'above' }) {
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 z-10 flex w-24 -translate-x-1/2 items-center justify-center" style={{ ...(side === 'below' ? { top } : { bottom: top }), height: h, background: MARK }}>
      <span className="rounded px-1 text-[10px] font-bold leading-3 text-white" style={{ background: MARK_LINE }}>
        {h}
      </span>
    </span>
  );
}
const Content: Fig = ({ caption }) => {
  const lk = desk();
  const t = tf();
  const b = lk.trigger.sizes.large;
  const g = lk.content.gutter;
  const H = 600;
  const scale = 0.56;
  // 폰 그림의 틀(상태 막대 40 · 앱 막대 48 · 본문 위 16 · 테두리 8) — 칸 아래 남은 화면을 셈한다
  const chrome = { status: 40, bar: 48, pad: 16, frame: 8 };
  const fieldTop = chrome.status + chrome.bar + chrome.pad + px(t.field.label.text.lineHeight) + t.field.gap;
  const room = H - chrome.frame * 2 - fieldTop - b.h - g - lk.content.edge;
  const maxH = Math.max(lk.content.minHeight, Math.min(lk.content.maxHeight, room));
  const itD = lk.item.sizes.large.heightDesc;
  const selIdx = CURRENCY.items.findIndex((i) => i.value === 'EUR');
  const scrollTop = Math.max(0, lk.content.padY + selIdx * itD - (maxH - itD) / 2);
  const phone = (cap: [string, string], body: ReactNode) => (
    <div className="flex flex-col items-center gap-2">
      <Phone title="거래 추가" mode="light" scale={scale} h={H} bg="bg-layer-default">
        <div className="flex flex-col px-6 pt-4" style={{ gap: t.field.form.gapY }}>
          {body}
        </div>
      </Phone>
      <Cap strong={cap[0]}>{cap[1]}</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap justify-center gap-6">
        {phone(
          ['아래에 붙는다', `칸 아래 ${g} · 칸 폭 그대로`],
          <F mode="light" label="결제 수단">
            <div className="relative">
              <SelectOpenView look={lk} mode="light" size="large" groups={plain([PAY_FLAT])} selected={['hyundai-m']} placement="overlay" />
              <GutterMark top={b.h} h={g} />
            </div>
          </F>,
        )}
        {phone(
          ['모자라면 위로', `칸 위 ${g} — 아래 남은 화면이 목록보다 좁을 때`],
          <>
            <F mode="light" label="금액">
              <TfInputView look={t.input} mode="light" size="large" state="enabled" value="12,000" suffix="원" />
            </F>
            <F mode="light" label="내용">
              <TfInputView look={t.input} mode="light" size="large" state="enabled" value="점심 식사" />
            </F>
            <F mode="light" label="날짜">
              <InputButtonView look={lk} mode="light" size="large" state="enabled" value="10월 1일 (목)" suffixIcon="calendar" />
            </F>
            <F mode="light" label="결제 수단">
              <div className="relative">
                <SelectOpenView look={lk} mode="light" size="large" groups={plain([PAY_FLAT])} selected={['hyundai-m']} placement="above" />
                <GutterMark top={b.h} h={g} side="above" />
              </div>
            </F>
          </>,
        )}
        {phone(
          ['길면 안에서 스크롤', `높이 min(${lk.content.maxHeight}, 남은 화면) · 하한 ${lk.content.minHeight} — 고른 선택지가 보이게 연다`],
          <F mode="light" label="통화">
            <SelectOpenView look={lk} mode="light" size="large" groups={[CURRENCY]} selected={['EUR']} placement="overlay" maxHeight={maxH} scrollTop={scrollTop} />
          </F>,
        )}
      </div>
    </Panel>
  );
};

const Group: Fig = ({ caption }) => {
  const lk = desk();
  const W = 300;
  const groups = plain(PAY_GROUPS);
  const { rows, bottom } = rowsOf(lk, 'large', groups);
  const div = rows.find((r) => r.kind === 'divider')!;
  const label = rows.filter((r) => r.kind === 'label').at(-1)!;
  const gap = lk.content.gap;
  const d = lk.divider;
  const total = gap + d.height + d.marginBottom;
  const band = (top: number, h: number, extra?: CSSProperties) => <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, width: W, top, height: h, background: MARK, ...extra }} />;
  const note = (y: number, children: ReactNode) => (
    <span className="absolute flex -translate-y-1/2 items-center gap-2 whitespace-nowrap text-[12px] leading-4 pk-muted" style={{ left: W + 8, top: y }}>
      <span className="h-px w-4" style={{ background: MARK_LINE }} />
      {children}
    </span>
  );
  return (
    <Figure caption={caption}>
      <div className="rounded-xl pk-surface px-8 py-8">
        <div className="relative" style={{ width: W, height: bottom, marginRight: 230 }}>
          <SelectListView look={lk} size="large" groups={groups} selected={['hyundai-m']} />
          {band(div.y - gap, gap)}
          {band(div.y, d.height, { background: MARK_LINE, opacity: 0.6 })}
          {band(div.y + d.height, d.marginBottom)}
          <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, width: d.marginX, top: div.y - 3, height: d.height + 6, background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
          <span aria-hidden className="pointer-events-none absolute" style={{ right: 0, width: d.marginX, top: div.y - 3, height: d.height + 6, background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
          <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, width: W, top: label.y, height: label.h, outline: `1px dashed ${MARK_LINE}` }} />
          {note(div.y, <b className="pk-text">묶음 사이 {gap} + {d.height} + {d.marginBottom} = {total}</b>)}
          {note(div.y + 16, `선은 좌우 ${d.marginX} 들인 ${d.height}px — 선택지 사이에는 없다`)}
          {note(label.y + label.h / 2, `묶음 제목 — ${lk.groupLabel.sizes.large.height}(없어도 된다)`)}
        </div>
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 이렇게 · 이렇게 하지 않는다 — 좁은 화면에서는 위아래로
const Pair = ({ children, three = false }: { children: ReactNode; three?: boolean }) => <div className={`flex w-full flex-col gap-4 ${three ? 'max-w-[760px] lg:flex-row' : 'max-w-[720px] md:flex-row'}`}>{children}</div>;
const W280 = ({ children, w = 280 }: { children: ReactNode; w?: number }) => (
  <div className="max-w-full" style={{ width: w }}>
    {children}
  </div>
);

const LabelGuide: Fig = ({ caption }) => {
  const lk = desk();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="Field 의 라벨 — 고른 뒤에도 무엇을 고른 칸인지 보인다">
          <W280>
            <Form gap={16}>
              <F label="결제 수단">
                <SelectTriggerView look={lk} size="large" state="enabled" labels={['현대카드 M']} />
              </F>
              <F label="통화">
                <SelectTriggerView look={lk} size="large" state="enabled" labels={['원']} />
              </F>
            </Form>
          </W280>
        </Verdict>
        <Verdict ok={false} note="라벨 없이 값만 — placeholder 는 고르면 사라져 칸의 뜻이 남지 않는다">
          <W280>
            <div className="flex flex-col gap-4">
              <SelectTriggerView look={lk} size="large" state="enabled" labels={['현대카드 M']} />
              <SelectTriggerView look={lk} size="large" state="enabled" labels={['원']} />
            </div>
          </W280>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const NoneGuide: Fig = ({ caption }) => {
  const lk = desk();
  const bad: SelGroup[] = [{ items: [...plain([PAY_FLAT])[0].items.slice(0, 4), { value: 'na', label: '해당 없음' }] }];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='"{칸 이름} 없음" 을 맨 앞 따로 묶음에 — 고르면 칸에 그 글이 들어간다'>
          <W280>
            <F label="결제 수단">
              <SelectOpenView look={lk} size="large" groups={plain([PAY_NONE, PAY_FLAT])} selected={['none']} />
            </F>
          </W280>
        </Verdict>
        <Verdict ok={false} note='맨 뒤 "해당 없음" — 칸마다 글이 달라지고 다른 선택지와 섞인다'>
          <W280>
            <F label="결제 수단">
              <SelectOpenView look={lk} size="large" groups={bad} selected={['na']} />
            </F>
          </W280>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const MultiGuide: Fig = ({ caption }) => {
  const lk = desk();
  const all: SelGroup[] = [{ items: [{ value: 'all', label: '전체 선택' }, ...plain(CATS)[0].items] }];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="몇 개까지 고를 수 있는지 Field 설명에 적는다">
          <W280>
            <F label="카테고리" description="최대 3개까지 고를 수 있어요.">
              <SelectTriggerView look={lk} size="large" state="enabled" multiple labels={['식비', '교통']} />
            </F>
          </W280>
        </Verdict>
        <Verdict ok={false} note='"전체 선택" — 다른 선택지를 바꿔 결과를 짐작하기 어렵다'>
          <W280>
            <F label="카테고리">
              <SelectOpenView look={lk} size="large" multiple groups={all} selected={['all', 'food', 'transport', 'shopping', 'culture', 'health']} />
            </F>
          </W280>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const SummaryGuide: Fig = ({ caption }) => {
  const lk = desk();
  // 셋을 이으면 넘치는 폭 — 넘치면 "첫 값 외 N개"
  const w = 150;
  const one = (labels: string[], text?: string) => (
    <W280 w={w}>
      <F label="카테고리">
        <SelectTriggerView look={lk} size="large" state="enabled" multiple labels={labels} text={text} />
      </F>
    </W280>
  );
  return (
    <Panel caption={caption}>
      <Pair three>
        <Verdict ok note="다 보이면 고른 순서대로 쉼표">
          {one(['식비', '교통'])}
        </Verdict>
        <Verdict ok note='넘치면 첫 값 외 나머지 개수(셋을 골랐다) — 값이 동등하면 "3개 고름"'>
          {one(['식비', '교통', '쇼핑'])}
        </Verdict>
        <Verdict ok={false} note='"등 2개" — 모두 두 개라는 뜻이 되어 틀린다'>
          {one(['식비', '교통', '쇼핑'], '식비 등 2개')}
        </Verdict>
      </Pair>
    </Panel>
  );
};

const ItemLabelGuide: Fig = ({ caption }) => {
  const lk = desk();
  const good: SelGroup[] = [{ items: [{ value: 'd', label: '매일' }, { value: 'w', label: '매주' }, { value: 'm', label: '매월', description: '매달 같은 날' }, { value: 'y', label: '매년' }] }];
  const bad: SelGroup[] = [{ items: [{ value: 'd', label: '매일 반복하기' }, { value: 'w', label: '매주 선택' }, { value: 'm', label: '한 달에 한 번씩 같은 날에 반복해요' }, { value: 'y', label: '매년' }] }];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="명사형으로 짧게 · 낱말과 길이를 맞추고, 부연은 한 줄 설명에">
          <W280 w={248}>
            <F label="반복 단위">
              <SelectOpenView look={lk} size="large" groups={good} selected={['m']} />
            </F>
          </W280>
        </Verdict>
        <Verdict ok={false} note="동작을 붙이고 말투가 섞였다 — 목록에서는 다 보여도 트리거에서는 잘린다">
          <W280 w={248}>
            <F label="반복 단위">
              <SelectOpenView look={lk} size="large" groups={bad} selected={['m']} />
            </F>
          </W280>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const PlaceholderGuide: Fig = ({ caption }) => {
  const lk = desk();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='"{값의 종류} 선택" — 무엇을 고르는 칸인지 알린다'>
          <W280>
            <F label="결제 수단">
              <SelectTriggerView look={lk} size="large" state="enabled" placeholder="결제 수단 선택" />
            </F>
          </W280>
        </Verdict>
        <Verdict ok={false} note="막연한 글 — 칸이 무엇을 받는지 알 수 없다">
          <W280>
            <F label="결제 수단">
              <SelectTriggerView look={lk} size="large" state="enabled" placeholder="여기를 눌러 펼쳐 보기" />
            </F>
          </W280>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 폰 — 금액 · 결제 수단 · 날짜(결제 수단 아래에 목록이 들어갈 자리가 있다)
function PayPhone({ payment, overlay }: { payment: ReactNode; overlay?: ReactNode }) {
  const lk = desk();
  const t = tf();
  return (
    <Phone title="거래 추가" mode="light" scale={0.52} h={600} bg="bg-layer-default" overlay={overlay} screenW={360}>
      <div className="flex flex-col px-6 pt-4" style={{ gap: t.field.form.gapY }}>
        <F mode="light" label="금액">
          <TfInputView look={t.input} mode="light" size="large" state="enabled" value="12,000" suffix="원" />
        </F>
        <F mode="light" label="결제 수단">
          {payment}
        </F>
        <DateTimeFields mode="light" label="날짜" date="10월 1일 (목)" time="오후 3:00" />
      </div>
    </Phone>
  );
}
const MobileGuide: Fig = ({ caption }) => {
  const lk = desk();
  const groups = plain([PAY_FLAT]);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="칸 아래 목록 — 폼이 보이고 한 번에 고른다(아래가 모자라면 위로)">
          <PayPhone payment={<SelectOpenView look={lk} mode="light" size="large" groups={groups} selected={['hyundai-m']} placement="overlay" />} />
        </Verdict>
        <Verdict ok={false} note="짧은 선택지를 시트로 — 손이 더 가고 폼이 가려진다(시트는 Input Button 의 몫)">
          <PayPhone
            payment={<SelectTriggerView look={lk} mode="light" size="large" state="open" labels={['현대카드 M']} />}
            overlay={
              <SheetOverlay ov={ov()} mode="light">
                <SheetPanel ov={ov()} mode="light" title="결제 수단" bodyPad={false} safe={PHONE_SAFE}>
                  <SelectListView look={lk} mode="light" size="large" groups={groups} selected={['hyundai-m']} style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0, padding: 0 }} />
                </SheetPanel>
              </SheetOverlay>
            }
          />
        </Verdict>
      </Pair>
    </Panel>
  );
};

function ChipShape({ label, on }: { label: string; on?: boolean }) {
  return (
    <span
      className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium"
      style={on ? { background: rc('bg-neutral-inverted'), color: rc('fg-neutral-inverted') } : { boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak')}`, color: rc('fg-neutral') }}
    >
      {label}
    </span>
  );
}
const PickGuide: Fig = ({ caption }) => {
  const lk = desk();
  const radio = radioLook({ size: 'medium' });
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Cell label={<><b className="pk-text">1 · Select Box</b> 그림 · 여러 줄 설명 · 딸린 입력이 필요하다</>}>
          <F label="종료">
            <SelectBoxGroupView
              look={selectBoxLook('desk')}
              kind="radio"
              live={false}
              value="count"
              ariaLabel="종료"
              boxes={[
                { value: 'none', title: '무기한', description: '중지할 때까지 계속 반복' },
                { value: 'count', title: '횟수 지정', description: '정한 횟수만큼 반복' },
              ]}
            />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">2 · Select</b> 5개 이상이거나 한 줄 설명이면 충분하다</>}>
          <F label="결제 수단">
            <SelectTriggerView look={lk} size="large" state="enabled" labels={['현대카드 M']} />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">3 · Chip</b> 2 ~ 4개, 설명 없이 글이 짧다(모양만 — Chip 차례에 정한다)</>}>
          <F label="거래 종류">
            <div className="flex flex-wrap gap-2">
              <ChipShape label="지출" on />
              <ChipShape label="수입" />
              <ChipShape label="이체" />
            </div>
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">3 · Radio · Checkbox</b> 2 ~ 4개, 설명 없이 글이 길다</>}>
          <F label="공개 범위">
            <div className="flex flex-col gap-3">
              <RadioView look={radio} checked="checked" state="enabled" label="나만 볼 수 있게" />
              <RadioView look={radio} checked="unchecked" state="enabled" label="같은 가계부 멤버에게 공개" />
            </div>
          </F>
        </Cell>
      </div>
    </Panel>
  );
};

const MenuGuide: Fig = ({ caption }) => {
  const lk = desk();
  const currency: SelGroup[] = [{ items: CURRENCY.items.slice(0, 5).map(({ description, ...i }) => (void description, i)) }];
  const menu: SelGroup[] = [{ items: [{ value: 'sort', label: '정렬 바꾸기', icon: 'arrow-up-down' }, { value: 'share', label: '공유', icon: 'share' }, { value: 'delete', label: '삭제', icon: 'trash' }] }];
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Cell label={<><b className="pk-text">Select</b> 폼에 넣을 값 · 오른쪽 체크 · 저장해야 반영</>}>
          <F label="통화">
            <SelectOpenView look={lk} size="large" groups={currency} selected={['KRW']} />
          </F>
        </Cell>
        <Cell label={<><b className="pk-text">Menu(그 차례에)</b> 더 보기 버튼에서 · 체크 없음 · 누르면 바로 실행</>}>
          <div className="flex flex-col items-end gap-2">
            <div className="flex w-full items-center justify-between">
              <span className="text-[17px] font-bold pk-text">거래 내역</span>
              <ButtonView look={buttonLook({ variant: 'ghost', size: 'medium', layout: 'iconOnly' })} icon="more" ariaLabel="더 보기" state="enabled" />
            </div>
            <div className="w-[200px]">
              <SelectListView look={lk} size="large" groups={menu} />
            </div>
          </div>
        </Cell>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 고를 수 있다) ───────────────
const CUR_LIVE: SelGroup[] = [{ items: CURRENCY.items.slice(0, 5) }];
const DAYS: SelGroup[] = [{ items: ['월', '화', '수', '목', '금', '토', '일'].map((d) => ({ value: d, label: `${d}요일` })) }];
const DEPTS: SelGroup[] = [{ items: [{ value: 'design', label: '디자인팀' }, { value: 'dev', label: '개발팀' }, { value: 'hr', label: '인사팀' }, { value: 'finance', label: '재무팀' }, { value: 'sales', label: '영업팀' }] }];

const ExBasic: Fig = () => (
  <Live>
    <SelectField look={desk()} field={tf().field} label="통화" select={{ groups: CUR_LIVE, placeholder: '통화 선택' }} />
  </Live>
);
// md 의 "묶음 · 아이콘 · "없음"" 코드와 같은 선택지
const PAY_CODE: SelGroup[] = [
  PAY_NONE,
  { label: '카드', items: [{ value: 'hyundai-m', label: '현대카드 M', icon: 'credit-card' }, { value: 'shinhan-deep', label: '신한카드 Deep', icon: 'credit-card' }] },
  { label: '계좌 · 현금', items: [{ value: 'kb', label: '국민 주계좌', description: '123-45-6789', icon: 'landmark' }, { value: 'cash', label: '현금', icon: 'banknote' }] },
];
const ExGroup: Fig = () => (
  <Live>
    <SelectField look={desk()} field={tf().field} label="결제 수단" select={{ groups: PAY_CODE, placeholder: '결제 수단 선택' }} />
  </Live>
);
const ExMultiple: Fig = () => (
  <Live>
    <SelectField look={desk()} field={tf().field} label="반복 요일" description="고른 요일마다 거래를 만들어요." select={{ groups: DAYS, multiple: true, placeholder: '요일 선택', defaultValue: ['월', '수'] }} />
  </Live>
);
const ExStates: Fig = () => (
  <Live>
    <SelectFieldList
      look={desk()}
      field={tf().field}
      gap={tf().field.form.gapY}
      items={[
        { label: '휴가 정책', invalid: true, errorMessage: '휴가 정책을 골라주세요.', select: { groups: POLICY, placeholder: '휴가 정책 선택' } },
        { label: '통화', select: { groups: CUR_LIVE, defaultValue: ['KRW'], disabled: true } },
        { label: '부서', select: { groups: DEPTS, defaultValue: ['design'], readOnly: true } },
      ]}
    />
  </Live>
);

export const selectFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  states: States,
  'item-states': ItemStates,
  selection: Selection,
  'prefix-icon': PrefixIcon,
  content: Content,
  group: Group,
  'label-guide': LabelGuide,
  'none-guide': NoneGuide,
  'multi-guide': MultiGuide,
  'summary-guide': SummaryGuide,
  'item-label-guide': ItemLabelGuide,
  'placeholder-guide': PlaceholderGuide,
  'mobile-guide': MobileGuide,
  'pick-guide': PickGuide,
  'menu-guide': MenuGuide,
  'ex-basic': ExBasic,
  'ex-group': ExGroup,
  'ex-multiple': ExMultiple,
  'ex-states': ExStates,
};
