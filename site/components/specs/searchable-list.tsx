// Searchable List 페이지의 그림 — specs/components/searchable-list.md 의 `[그림: …](../../site/components/specs/searchable-list.tsx#<id>)` 자리.
// 묶음은 searchable-list.yaml 을 푼 값(searchLook — data-search-view)으로, 검색칸은 input.yaml 밑줄형(TfInputView), 줄은 list.yaml,
// 라디오 · 로고 타일 · 카드 그림 · 아바타 · 배지는 그 YAML 로, 시트 · 팝오버는 bottom-sheet · popover.yaml 로 그린다.
// 은행 · 카드 · 사람은 지어낸 것이다(기관 색은 institution-colors.yaml — 진짜 로고가 아니라 첫 글자 타일).
import type { CSSProperties, ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { APPROVERS, BANK_GROUPS, CARD_PRODUCTS } from './data-data';
import { ExCardDemo, ExInstitutionDemo, KeyboardDemo, SearchPlayground, type SearchSet } from './data-search-play';
import { SearchableListView, type SGroup } from './data-search-view';
import { DimV, EDGE, GuideV, MODES, ModeLabel, PINK, SCREEN_W, SL, bankPrefix, personPrefix, type Fig } from './data-screens';
import { B } from './display-screens';
import { Card } from './image-screens';
import { institutions, logoFace, logoTileLook } from './image-look';
import { PopoverPanel, SheetOverlay, SheetPanel } from './input-button-pickers';
import { PHONE_SAFE, Phone, Verdict, rc, type Mode } from './kit';
import { Arrow, Cap, CodePreview, Legend, pinAt } from './nav-screens';
import { overlayLook } from './overlay-look';
import { overlayKit } from './overlay-screens';
import { selectLook } from './select-look';
import { InputButtonView } from './select-view';
import { textFieldLook } from './text-field-look';
import { TfFieldView } from './text-field-view';
import { cardFace } from './card-face';
import { tokenValue } from '@/lib/component-spec';

const Wrap = ({ children, gap = 'gap-6' }: { children: ReactNode; gap?: string }) => <div className={`flex flex-wrap items-start justify-center ${gap}`}>{children}</div>;
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col gap-4 md:flex-row">{children}</div>;
const Col = ({ children, cap, strong, w }: { children: ReactNode; cap?: ReactNode; strong?: ReactNode; w?: number }) => (
  <div className="flex min-w-0 max-w-full flex-col items-center gap-2">
    <div className="max-w-full overflow-x-auto">{children}</div>
    {(cap || strong) && (
      <Cap strong={strong} w={w}>
        {cap}
      </Cap>
    )}
  </div>
);
const box: CSSProperties = { outline: `1px dashed ${PINK}`, outlineOffset: -1 };

// ── 목록 셋(앞 붙이개는 서버가 그려 넘긴다) ─────────────────
const bankGroups = (groups = BANK_GROUPS): SGroup[] => groups.map((g) => ({ label: g.label, items: g.items.map((n) => ({ value: n, title: n, keywords: institutions().find((x) => x.name === n)?.aliases ?? [] })) }));
const bankPrefixes = (mode: Mode = 'auto') => Object.fromEntries(BANK_GROUPS.flatMap((g) => g.items).map((n) => [n, bankPrefix(n, mode)]));
const cardGroups = (mode: Mode = 'auto'): SGroup[] => [
  {
    items: CARD_PRODUCTS.map((c) => ({
      value: c.id,
      title: c.name,
      detailText: `${c.issuer} ${c.kind}`,
      keywords: [c.issuer],
      detail: (
        // searchable-list.md 코드 그대로 — flex · items-center · gap-x1_5(6), 단종 배지는 줄지 않는다(shrink-0)
        <span style={{ display: 'flex', alignItems: 'center', gap: parseFloat(String(tokenValue('$spacing-x1_5'))), minWidth: 0 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.issuer} · {c.kind}
          </span>
          {c.discontinued && (
            <span style={{ display: 'flex', flexShrink: 0 }}>
              <B l="단종" v="weak" t="neutral" mode={mode} />
            </span>
          )}
        </span>
      ),
    })),
  },
];
const cardPrefixes = (mode: Mode = 'auto') => Object.fromEntries(CARD_PRODUCTS.map((c) => [c.id, <Card key={c.id} width={SL().prefix.cardArt} issuer={c.issuer} name={c.name} pic={c.pic} mode={mode} />]));
const peopleGroups = (): SGroup[] => [{ items: APPROVERS.map((p) => ({ value: p.value, title: p.name, detail: p.team, detailText: p.team })) }];
const peoplePrefixes = (mode: Mode = 'auto') => Object.fromEntries(APPROVERS.map((p) => [p.value, personPrefix(p.name, mode, SL().prefix.avatar.two)]));
const SETS = (mode: Mode = 'auto'): SearchSet[] => [
  { key: 'bank', label: '은행', groups: bankGroups(), prefixes: bankPrefixes(mode), prefixKind: 'logo', placeholder: '은행 이름 검색', target: '은행', initial: '신한' },
  { key: 'card', label: '카드 상품', groups: cardGroups(mode), prefixes: cardPrefixes(mode), prefixKind: 'cardArt', placeholder: '카드 이름 검색', target: '카드 상품', server: true, emptyDescription: '카드사 이름으로도 찾아보세요.' },
  { key: 'people', label: '결재자', groups: peopleGroups(), prefixes: peoplePrefixes(mode), prefixKind: 'avatar', placeholder: '이름 · 팀 검색', target: '결재자' },
];
type ListProps = Omit<Parameters<typeof SearchableListView>[0], 'look' | 'groups' | 'placeholder' | 'ariaLabel'> & { groups?: SGroup[]; placeholder?: string; ariaLabel?: string };
function Banks({ mode = 'auto', groups = bankGroups(), ...p }: ListProps & { mode?: Mode }) {
  return <SearchableListView look={SL()} mode={mode} groups={groups} prefixes={bankPrefixes(mode)} prefixKind="logo" placeholder="은행 이름 검색" ariaLabel="은행" {...p} />;
}
function Cards({ mode = 'auto', ...p }: ListProps & { mode?: Mode }) {
  return <SearchableListView look={SL()} mode={mode} groups={cardGroups(mode)} prefixes={cardPrefixes(mode)} prefixKind="cardArt" placeholder="카드 이름 검색" ariaLabel="카드 상품" {...p} />;
}
function People({ mode = 'auto', ...p }: ListProps & { mode?: Mode }) {
  return <SearchableListView look={SL()} mode={mode} groups={peopleGroups()} prefixes={peoplePrefixes(mode)} prefixKind="avatar" placeholder="이름 · 팀 검색" ariaLabel="결재자" {...p} />;
}
// 종목 — 지어낸 이름(실제 회사가 아니다). 누르면 바로 더하는 목록이라 앞 붙이개 · 지금 값이 없다
const STOCKS = [
  ['하늘전자', '코스피'],
  ['하늘바이오', '코스닥'],
  ['하늘화학', '코스피'],
  ['하늘에너지', '코스닥'],
] as const;
const stockGroups = (): SGroup[] => [{ items: STOCKS.map(([name, market]) => ({ value: name, title: name, detail: market, detailText: market })) }];
function Stocks({ mode = 'auto', ...p }: ListProps & { mode?: Mode }) {
  return <SearchableListView look={SL()} mode={mode} groups={stockGroups()} placeholder="종목 이름 검색" ariaLabel="종목" mark={false} {...p} />;
}
const firstGroups = (n: number, k = 4) => bankGroups(BANK_GROUPS.slice(0, n).map((g) => ({ ...g, items: g.items.slice(0, k) })));
// 시트 판 · 흰 판
const ov = () => overlayLook('desk');
function SheetBox({ title, children, mode = 'auto', w = SCREEN_W }: { title: string; children: ReactNode; mode?: Mode; w?: number }) {
  return (
    <div style={{ width: w }}>
      <SheetPanel ov={ov()} mode={mode} title={title} bodyPad={false} safe={PHONE_SAFE}>
        {children}
      </SheetPanel>
    </div>
  );
}
function WhiteBox({ children, mode = 'auto', w = SCREEN_W, pad = SL().option.padY }: { children: ReactNode; mode?: Mode; w?: number; pad?: number }) {
  return <div style={{ width: w, borderRadius: SL().highlight.radius + 6, background: rc('bg-layer-default', mode), paddingTop: pad, paddingBottom: pad }}>{children}</div>;
}
// 폰 위 검색 시트 — 계좌 추가 화면 위
function SheetPhone({ mode = 'auto', scale = 0.62, h = 720, title = '은행 선택', children, under }: { mode?: Mode; scale?: number; h?: number; title?: string; children: ReactNode; under?: ReactNode }) {
  return (
    <Phone title="계좌 추가" mode={mode} scale={scale} h={h} screenW={SCREEN_W} overlay={<SheetOverlay ov={ov()} mode={mode}><SheetPanel ov={ov()} mode={mode} title={title} bodyPad={false} safe={PHONE_SAFE}>{children}</SheetPanel></SheetOverlay>}>
      {under ?? <span />}
    </Phone>
  );
}
const tf = () => textFieldLook('desk');

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col gap-2">
          <ModeLabel mode={mode} />
          <Wrap gap="gap-5">
            <Col strong="폰 — 검색 시트" w={240}>
              <SheetPhone mode={mode} scale={0.6} h={760}>
                <Banks mode={mode} value="신한" groups={firstGroups(2, 4)} />
              </SheetPhone>
            </Col>
            <Col strong="데스크톱 — 팝오버" w={320}>
              {/* 데스크톱 카드 안 칸 — card.yaml 의 면(1px 테두리 · 모서리 16 · 여백 24) */}
              <div style={{ boxSizing: 'border-box', width: 400, background: rc('bg-layer-default', mode), borderRadius: cardFace().radius, borderWidth: cardFace().borderW, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak', mode), paddingTop: cardFace().pad, paddingBottom: cardFace().pad, paddingLeft: cardFace().pad, paddingRight: cardFace().pad }}>
                <TfFieldView look={tf().field} mode={mode} label="카드">
                  <InputButtonView look={selectLook('desk')} mode={mode} size="medium" state="pressed" placeholder="카드 선택" suffixIcon="chevron-down" />
                </TfFieldView>
                <div style={{ marginTop: 8 }}>
                  {/* 줄 다섯까지 — 나머지는 목록 안에서 스크롤한다 */}
                  <PopoverPanel ov={ov()} mode={mode} width={360} bodyPad={false}>
                    <Cards mode={mode} size="medium" value="c1" groups={cardGroups(mode).map((g) => ({ ...g, items: g.items.slice(0, 5) }))} />
                  </PopoverPanel>
                </div>
              </div>
            </Col>
          </Wrap>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <SearchPlayground look={SL()} ov={ov()} sets={SETS()} next={buttonLook({ variant: 'neutralSolid', size: 'large' })} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-5">
      <Col>
        <div style={{ paddingLeft: 14, paddingTop: 10 }}>
          <SheetBox title="은행 선택">
            <Banks
              value="신한"
              groups={firstGroups(2, 3)}
              highlight="신한"
              focused
              marks={{ field: box, header: box, option: box }}
              pins={{ field: pinAt('ⓐ', { left: -12, top: -8 }), header: pinAt('ⓑ', { left: 2, top: 2 }), option: pinAt('ⓒ', { left: 2, top: 2 }), prefix: pinAt('ⓓ', { left: -10, top: -10 }), radio: pinAt('ⓔ', { left: -10, top: -10 }), highlight: pinAt('ⓕ', { right: 2, top: 2 }) }}
            />
          </SheetBox>
        </div>
      </Col>
      <Legend
        items={[
          ['ⓐ', 'Field — 밑줄형 · 돋보기 · 지우기'],
          ['ⓑ', 'Group Header'],
          ['ⓒ', 'Option'],
          ['ⓓ', 'Prefix'],
          ['ⓔ', 'Radio — 지금 값'],
          ['ⓕ', 'Highlight — ↓ · 마우스로 짚은 줄의 바탕'],
        ]}
      />
    </div>
  </Panel>
);

// ── Properties ────────────────────────────────────────────
const Field: Fig = ({ caption }) => {
  const s = SL();
  const L = s.field.look.sizes.underline;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Wrap gap="gap-5">
          <Col strong={`large ${s.field.heights.large} — 1280 미만 · 앱`} cap={`글 ${parseFloat(L.large.text.fontSize)} / ${parseFloat(L.large.text.lineHeight)} · 돋보기 ${L.large.icon} · 지우기 ${L.large.clear}(누르는 영역 ${s.field.look.clearHit}) · 아래 ${s.field.look.stroke.base}px → 치는 동안 ${s.field.look.stroke.active}px`} w={330}>
            <div style={{ position: 'relative' }}>
              <WhiteBox>
                <Banks query="신" size="large" focused groups={bankGroups()} value="신한" />
              </WhiteBox>
              <GuideV x={EDGE} top={0} bottom={0} />
              <DimV at={{ left: SCREEN_W + 6, top: s.option.padY }} h={s.field.heights.large} label={`${s.field.heights.large}`} />
            </div>
          </Col>
          <Col strong={`medium ${s.field.heights.medium} — 1280 이상 웹`} cap={`글 ${parseFloat(L.medium.text.fontSize)} / ${parseFloat(L.medium.text.lineHeight)} · 돋보기 ${L.medium.icon} · 지우기 ${L.medium.clear}. 좌우는 줄과 같은 ${s.field.marginX} 안 — 돋보기와 줄의 앞 붙이개가 한 줄(분홍 점선)`} w={330}>
            <div style={{ position: 'relative' }}>
              <WhiteBox>
                <Banks size="medium" groups={firstGroups(1, 2)} value="신한" />
              </WhiteBox>
              <GuideV x={EDGE} top={0} bottom={0} />
              <DimV at={{ left: SCREEN_W + 6, top: s.option.padY }} h={s.field.heights.medium} label={`${s.field.heights.medium}`} />
            </div>
          </Col>
        </Wrap>
      </div>
    </Panel>
  );
};

const Rows: Fig = ({ caption }) => {
  const s = SL();
  return (
    <Panel caption={caption}>
      <Wrap gap="gap-4">
        <Col strong={`물건 — Logo Tile ${s.prefix.logo}`} cap="은행 · 증권 · 카드사" w={300}>
          <WhiteBox>
            <Banks groups={[{ items: bankGroups()[0].items.slice(0, 3) }]} value="신한" />
          </WhiteBox>
        </Col>
        <Col strong={`카드 상품 — 카드 그림 ${s.prefix.cardArt}`} cap="단종은 흐리게 두지 않고 Badge(weak neutral)" w={300}>
          <WhiteBox>
            <SearchableListView look={s} groups={[{ items: cardGroups()[0].items.filter((c) => ['c1', 'c3', 'c5'].includes(c.value)) }]} prefixes={cardPrefixes()} prefixKind="cardArt" placeholder="카드 이름 검색" ariaLabel="카드 상품" value="c1" />
          </WhiteBox>
        </Col>
        <Col strong={`사람 — Avatar ${s.prefix.avatar.one} · ${s.prefix.avatar.two}`} cap="제목 한 줄 36 · 제목 + 설명 42" w={300}>
          <WhiteBox>
            <SearchableListView look={s} groups={[{ items: peopleGroups()[0].items.slice(0, 3) }]} prefixes={peoplePrefixes()} prefixKind="avatar" placeholder="이름 · 팀 검색" ariaLabel="결재자" value="haneul" />
          </WhiteBox>
        </Col>
      </Wrap>
    </Panel>
  );
};

const Selected: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-3">
      <WhiteBox>
        <Banks groups={firstGroups(1, 5)} value="신한" />
      </WhiteBox>
      <Cap w={480}>오른쪽 라디오({SL().radioSize}) — 고른 것과 안 고른 것이 모두 보인다. 고른 줄의 바탕을 칠하지 않는다, 고름은 줄의 aria-selected 가 알린다</Cap>
    </div>
  </Panel>
);

const Groups: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-3">
      <Col>
        <SheetPhone scale={0.75} h={760}>
          <Banks value="신한" groups={firstGroups(2, 4)} />
        </SheetPhone>
      </Col>
      <Cap w={480}>분류는 List Header mediumWeak(14 · 500 · fg-neutral-subtle) — 은행은 시중은행 · 인터넷은행 · 지방은행 · 특수은행 · 저축기관 · 외국계 · 기타 차례. 거르면 줄이 남지 않은 분류는 머리째 숨긴다</Cap>
    </div>
  </Panel>
);

const Placement: Fig = ({ caption }) => {
  const sel = selectLook('desk');
  const next = buttonLook({ variant: 'neutralSolid', size: 'large' });
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Col strong="검색 시트(sheet)" cap="줄을 누르면 고르고 닫힌다 — &quot;완료&quot; 없음" w={220}>
            <SheetPhone scale={0.55} h={720}>
              <Banks value="신한" groups={firstGroups(1, 4)} pressed="우리" />
            </SheetPhone>
          </Col>
          <Arrow label="닫힘" />
          <Col strong="칸에 들어간다" w={220}>
            <Phone title="계좌 추가" scale={0.55} h={720} screenW={SCREEN_W}>
              <div style={{ paddingTop: 8, paddingLeft: EDGE, paddingRight: EDGE }}>
                <TfFieldView look={tf().field} label="은행">
                  <InputButtonView look={sel} size="large" value="우리" suffixIcon="chevron-down" />
                </TfFieldView>
              </div>
            </Phone>
          </Col>
        </div>
        <Col strong="단계 안(inline)" cap="라디오만 바뀌고 닫거나 넘기지 않는다 — 단계의 버튼(&quot;다음&quot;)이 반영한다" w={320}>
          <Phone title="기관 고르기" scale={0.6} h={760} screenW={SCREEN_W} bottom={<ButtonView look={next} label="다음" fill state="enabled" />}>
            <Banks value="토스뱅크" groups={[firstGroups(2, 3)[1], firstGroups(2, 3)[0]]} />
          </Phone>
        </Col>
      </div>
    </Panel>
  );
};

const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Wrap gap="gap-4">
      <Col strong="강조 — 키보드(↓)" cap="초점은 검색칸에 그대로 — 강조한 줄이 aria-activedescendant" w={300}>
        <WhiteBox>
          <Banks groups={firstGroups(1, 3)} value="신한" highlight="KB국민" focused query="" />
        </WhiteBox>
      </Col>
      <Col strong="강조 — 마우스" cap="올린 줄도 같은 바탕 — 한 번에 한 줄" w={300}>
        <WhiteBox>
          <Banks groups={firstGroups(1, 3)} value="신한" highlight="우리" />
        </WhiteBox>
      </Col>
      <Col strong="누름" cap={`같은 바탕 + 콘텐츠만 ${SL().press.distance}px 거리 축소(List)`} w={300}>
        <WhiteBox>
          <Banks groups={firstGroups(1, 3)} value="신한" pressed="우리" />
        </WhiteBox>
      </Col>
    </Wrap>
  </Panel>
);

const Keyboard: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-3">
      <KeyboardDemo look={SL()} set={SETS()[0]} />
      <Cap w={520}>검색칸에서 ↓ 는 첫 줄 · 다음 줄, ↑ 는 마지막 줄 · 앞 줄(끝에서 멈춘다 · 분류 머리는 건너뛴다). Enter 는 강조한 줄을 고르고, 강조가 없으면 아무것도 하지 않는다. Esc 는 검색어를 지운다. 줄은 Tab 으로 들어가지 않는다</Cap>
    </div>
  </Panel>
);

// "taptap" 여섯 글자 — 마지막 입력 뒤 300ms 에 한 번(서버 검색)
const DebounceGuide: Fig = ({ caption }) => {
  const s = SL();
  const keys = [0, 140, 260, 420, 560, 700];
  const end = keys[keys.length - 1] + s.debounce;
  const W = 300;
  const x = (ms: number) => 16 + (ms / (end + 160)) * (W - 32);
  const line = (reqs: number[], ok: boolean) => (
    <div style={{ position: 'relative', width: W, height: 110, borderRadius: 12, background: rc('bg-layer-default') }}>
      <span style={{ position: 'absolute', left: 16, right: 16, top: 40, height: 2, background: rc('stroke-neutral-weak') }} />
      {keys.map((k, i) => (
        <span key={k} style={{ position: 'absolute', left: x(k) - 9, top: 14, width: 18, height: 18, borderRadius: 4, background: rc('bg-neutral-weak'), color: rc('fg-neutral'), fontSize: 12, lineHeight: '18px', fontWeight: 700, textAlign: 'center' }}>
          {'taptap'[i]}
        </span>
      ))}
      {reqs.map((r, i) => (
        <span key={i} style={{ position: 'absolute', left: x(r) - 4, top: 56, width: 8, height: 30, borderRadius: 4, background: ok ? rc('fg-informative') : rc('fg-critical') }} />
      ))}
      {ok && (
        <span className="whitespace-nowrap rounded px-1.5 text-[10px] font-bold leading-[15px] text-white" style={{ position: 'absolute', left: x(keys[5]), top: 44, width: x(end) - x(keys[5]), background: PINK, textAlign: 'center' }}>
          {s.debounce}ms
        </span>
      )}
      <span style={{ position: 'absolute', left: 16, bottom: 8, fontSize: 12, lineHeight: '16px', color: rc('fg-neutral-subtle') }}>요청 {reqs.length}번</span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`마지막 입력 뒤 ${s.debounce}ms 에 한 번 — 받는 동안 옛 결과를 남긴다`}>{line([end], true)}</Verdict>
        <Verdict ok={false} note="글자마다 서버 요청 — 6자에 6번(지금 카드 상품 검색)">{line(keys, false)}</Verdict>
      </Pair>
    </Panel>
  );
};

const StatusGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Wrap gap="gap-4">
      <Col strong="0건" cap="&quot;'{검색어}'에 대한 검색 결과가 없어요&quot; — role=&quot;status&quot; 로 한 번 알린다" w={300}>
        <WhiteBox>
          <Banks query="하나로" groups={bankGroups()} status="empty" />
        </WhiteBox>
      </Col>
      <Col strong="실패" cap="0건과 다르게 — &quot;검색 결과를 불러오지 못했어요&quot; + 다시 시도" w={300}>
        <WhiteBox>
          <Cards query="트래블" status="failure" />
        </WhiteBox>
      </Col>
      <Col strong="불러오는 동안" cap={`줄 모양 Skeleton ${SL().skeletonRows} — 앞 자리 · 제목 · 설명, 줄 높이 그대로`} w={300}>
        <WhiteBox>
          <Cards query="데일리" status="loading" />
        </WhiteBox>
      </Col>
    </Wrap>
  </Panel>
);

// 기관 칩 묶음(나쁜 예 — 지금 Desk 웹 자산 추가) — 32 알약 · 고르면 기관 색 채움
function ChipGroups() {
  const lt = logoTileLook();
  const groups = BANK_GROUPS.slice(0, 2).map((g) => ({ ...g, items: g.items.slice(0, 6) }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
      {groups.map((g) => (
        <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', color: rc('fg-neutral-subtle') }}>{g.label}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.items.map((n) => {
              const on = n === '신한';
              const f = logoFace(n, 'institution', institutions(), lt);
              return (
                <span key={n} style={{ height: 32, display: 'inline-flex', alignItems: 'center', paddingLeft: 12, paddingRight: 12, borderRadius: 9999, fontSize: 12.5, fontWeight: 500, background: on ? f.bg.light : rc('bg-neutral-weak'), color: on ? '#FFFFFF' : rc('fg-neutral') }}>
                  {n}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
// 누르면 바로 더하는 목록 — 라디오 없음(selectionMark off) · 칸에 넣는 고르기 — 라디오(2026-10-29 17-1 Q4 = B)
const ActionGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Wrap>
      <Col strong="종목 추가 — 라디오 없음" cap={`누르면 그 종목을 더하고 닫는다 — 지금 값이 없어 동그라미가 채워질 일이 없다. 줄은 최소 ${SL().option.minHeight} · 좌우 ${SL().option.padX} 그대로`} w={SCREEN_W}>
        <SheetBox title="종목 추가">
          <Stocks query="하늘" pressed="하늘바이오" />
        </SheetBox>
      </Col>
      <Col strong="은행 고르기 — 라디오" cap="고른 값이 칸에 들어간다 — 지금 값이 보여야 해서 오른쪽 라디오" w={SCREEN_W}>
        <SheetBox title="은행 선택">
          <Banks value="신한" groups={firstGroups(1, 4)} />
        </SheetBox>
      </Col>
    </Wrap>
  </Panel>
);

const ChipsGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="검색칸 + 분류 머리 + 로고 타일 줄 + 오른쪽 라디오 — 다른 고르기 화면과 같은 줄">
        <WhiteBox w={300}>
          <Banks groups={firstGroups(2, 2)} value="신한" />
        </WhiteBox>
      </Verdict>
      <Verdict ok={false} note="기관 색 칩 34개를 분류로 묶은 것 — 칩은 2 ~ 4개 짧은 폼 값에만">
        <ChipGroups />
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 예시(미리보기) — searchable-list.md 의 코드 그대로 ────
const ExInstitution: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={24}>
    <ExInstitutionDemo look={SL()} set={SETS()[0]} select={selectLook('desk')} field={tf().field} kit={overlayKit('desk')} />
  </CodePreview>
);
// 종목 추가 — searchable-list.md 코드 그대로(selectionMark={false}). 멈춘 그림 — "하늘" 을 친 순간
const ExStock: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={24}>
    <SheetBox title="종목 추가">
      <Stocks query="하늘" />
    </SheetBox>
  </CodePreview>
);
const ExCard: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={24}>
    <ExCardDemo look={SL()} set={SETS()[1]} next={buttonLook({ variant: 'neutralSolid', size: 'large' })} />
  </CodePreview>
);

export const searchableListFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  field: Field,
  rows: Rows,
  selected: Selected,
  groups: Groups,
  placement: Placement,
  states: States,
  keyboard: Keyboard,
  'debounce-guide': DebounceGuide,
  'status-guide': StatusGuide,
  'chips-guide': ChipsGuide,
  'action-guide': ActionGuide,
  'ex-institution': ExInstitution,
  'ex-card': ExCard,
  'ex-stock': ExStock,
};
