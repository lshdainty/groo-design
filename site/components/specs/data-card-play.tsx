'use client';
// Card 의 플레이그라운드와 코드 미리보기 — 속성을 고르면 스펙대로 그린 카드와 그 코드가 바뀐다(누르는 카드는 실제로 눌린다).
// 값은 card.yaml 을 푼 CardLook 만 쓴다(data-look). 코드는 card.md 의 "코드" 절과 같은 레시피 API 다.
import { useMemo, useState, type ReactNode } from 'react';
import { CardHeaderView, CardSurface, HeroCardView, StatView, type DeltaSpec } from './data-card-view';
import { TODAY, type Stat } from './data-data';
import { formatWon, type CardLook, type CardPress, type CardStatSize, type DeltaDir, type ViewMode } from './data-shared';
import { dcv } from './display-shared';
import type { ResultSectionLook } from './feedback-shared';
import { ResultSectionView } from './feedback-view';
import type { RowSpec } from './list-shared';
import { ListView } from './list-view';
import type { SkeletonLook } from './loading-shared';
import { SkeletonView } from './loading-view';
import { NavPlayFrame } from './nav-playground';
import { MODES, Seg } from './select-playground';
import type { ToggleLook } from './input-shared';
import { ToggleView } from './toggle-view';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const floor = (look: CardLook, mode: ViewMode) => dcv(look.floor, mode);
export const spendRows = (live = true): RowSpec[] => TODAY.map((s) => ({ kind: live ? 'button' : 'view', prefix: { tile: s.tile, icon: s.icon }, title: s.title, detail: s.detail, suffix: { amount: formatWon(s.amount) } }));

// 고른 동작을 알려 주는 한 줄(보조 기술에도 읽힌다)
function Said({ text }: { text: string }) {
  return (
    <span role="status" className="inline-flex min-h-[26px] items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span className="text-[10px] font-bold text-fd-muted-foreground">읽는 글</span>
      {text || '—'}
    </span>
  );
}

type Content = 'content' | 'list' | 'stat' | 'hero';
type Data = 'shown' | 'loading' | 'failure';
const DELTA: Record<DeltaDir, DeltaSpec> = {
  up: { direction: 'up', value: '12%', text: '지난달보다', srText: '지난달보다 12% 더 썼어요' },
  down: { direction: 'down', value: '3%', text: '지난달보다', srText: '지난달보다 3% 덜 썼어요' },
  flat: { direction: 'flat', value: '', text: '지난달보다' },
};

export function CardPlayground({ look, sk, result, toggle }: { look: CardLook; sk: SkeletonLook; result: ResultSectionLook; toggle: ToggleLook }) {
  const [pinned, setPinned] = useState(false);
  const [content, setContent] = useState<Content>('list');
  const [press, setPress] = useState<CardPress>('none');
  const [size, setSize] = useState<CardStatSize>('large');
  const [dir, setDir] = useState<DeltaDir>('up');
  const [width, setWidth] = useState<'phone' | 'desktop'>('phone');
  const [data, setData] = useState<Data>('shown');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [said, setSaid] = useState('');
  const w = width === 'phone' ? 312 : size === 'small' && content === 'stat' ? 226 : 476;
  // 지표 카드는 none · whole 만(대등한 동작은 제목이 있는 글 카드에서), 순자산은 카드 전체로만 — 누르면 2px 축소만
  const p: CardPress = content === 'content' ? press : (content === 'stat' || content === 'hero') && press !== 'none' ? 'whole' : 'none';
  const body = () => {
    if (data === 'failure')
      return <ResultSectionView look={result} mode={mode} kind="failure" size="medium" inCard title="데이터를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요." primary={{ label: '다시 시도', onClick: () => (setData('shown'), setSaid('다시 불러왔어요.')) }} live />;
    if (content === 'stat')
      return data === 'loading' ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: look.stat.label.fontFamily, fontSize: look.stat.label.fontSize, lineHeight: look.stat.label.lineHeight, fontWeight: look.stat.label.fontWeight, color: dcv(look.stat.label.fg, mode) }}>이번 달 지출</span>
          <span style={{ marginTop: look.stat.value.marginTop }}>
            <SkeletonView look={sk} mode={mode} text={size === 'large' ? 't9' : 't7'} width={140} />
          </span>
        </div>
      ) : (
        <StatView look={look} mode={mode} label="이번 달 지출" value={formatWon(1240000)} size={size} delta={DELTA[dir]} />
      );
    return (
      <>
        {p === 'peers' ? (
          // 제목 줄 오른쪽 고정 버튼 — card.md 의 peers 코드(flex · items-start · justify-between · gap-x2, 버튼 -mr-x2 · -mt-x2 · shrink-0)
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: look.header.gap, paddingBottom: look.header.padBottom }}>
            <span style={{ fontFamily: look.title.fontFamily, fontSize: look.title.fontSize, lineHeight: look.title.lineHeight, fontWeight: look.title.fontWeight, color: dcv(look.title.fg, mode) }}>10월 식비 예산</span>
            {/* 고정 — 켜고 끄는 아이콘 단추(Toggle — toggle.yaml). 카드의 누름과 따로 */}
            <span style={{ display: 'flex', flexShrink: 0, marginTop: -look.header.gap, marginRight: -look.header.gap }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              <ToggleView look={toggle} mode={mode} ariaLabel="10월 식비 예산 고정" pressed={pinned} icon="pin" onPressedChange={(v) => (setPinned(v), setSaid(v ? '고정했어요.' : '고정을 풀었어요.'))} />
            </span>
          </div>
        ) : (
          <CardHeaderView look={look} mode={mode} title="10월 식비 예산" action={p === 'none' ? '관리' : undefined} live onAction={() => setSaid('10월 식비 예산 관리')} />
        )}
        {data === 'loading' ? (
          <SkeletonView look={sk} mode={mode} text="t9" width={160} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: look.content.gap }}>
            <span style={{ fontFamily: FONT, fontSize: look.stat.value.sizes.large.fontSize, lineHeight: look.stat.value.sizes.large.lineHeight, fontWeight: look.stat.value.weight, color: dcv(look.stat.value.fg, mode), fontVariantNumeric: 'tabular-nums' }}>{formatWon(115600)} 남았어요</span>
            <span style={{ fontFamily: FONT, fontSize: look.stat.label.fontSize, lineHeight: look.stat.label.lineHeight, color: dcv(look.stat.label.fg, mode) }}>{formatWon(500000)} 중 77% 썼어요</span>
          </div>
        )}
      </>
    );
  };
  const card = (): ReactNode => {
    if (content === 'hero')
      return data === 'shown' ? (
        <HeroCardView look={look} mode={mode} label="순자산" amount={formatWon(42898100)} delta={{ ...DELTA[dir], value: dir === 'flat' ? '' : '1.8%', srText: undefined }} press={p === 'whole' ? 'whole' : 'none'} live onClick={() => setSaid('자산으로')} />
      ) : (
        <CardSurface look={look} mode={mode}>
          {data === 'loading' ? <SkeletonView look={sk} mode={mode} text="t12" width={200} /> : body()}
        </CardSurface>
      );
    if (content === 'list')
      return (
        <CardSurface look={look} mode={mode} body="list">
          <CardHeaderView look={look} mode={mode} title="오늘 쓴 돈" action="전체 보기" body="list" live onAction={() => setSaid('오늘 쓴 돈 전체 보기')} />
          {data === 'failure' ? (
            <div style={{ paddingLeft: look.surface.pad, paddingRight: look.surface.pad }}>{body()}</div>
          ) : data === 'loading' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 12, paddingBottom: 12, paddingLeft: look.surface.pad, paddingRight: look.surface.pad }}>
              {[0, 1, 2].map((i) => (
                <SkeletonView key={i} look={sk} mode={mode} text="t5" width={`${70 - i * 10}%`} />
              ))}
            </div>
          ) : (
            <ListView look={look.list.look} rows={spendRows()} mode={mode} live bgRadius={look.list.itemRadius} ariaLabel="오늘 쓴 돈" />
          )}
        </CardSurface>
      );
    return (
      <CardSurface look={look} mode={mode} press={p} live label={content === 'stat' ? '이번 달 지출' : '10월 식비 예산'} onClick={() => setSaid(content === 'stat' ? '이번 달 지출 상세로' : '10월 식비 예산 상세로')}>
        {body()}
      </CardSurface>
    );
  };
  const code = useMemo(() => {
    if (content === 'hero')
      return [
        'import { Card, CardHeroAmount, CardHeroDetail, CardHeroLabel, Delta } from "@/components/ui/card"',
        '',
        `<Card variant="hero"${p === 'whole' ? ' href="/desk/assets"' : ''}>`,
        '  <CardHeroLabel>순자산</CardHeroLabel>',
        '  <CardHeroAmount>42,898,100원</CardHeroAmount>',
        `  <CardHeroDetail><Delta direction="${dir}" value="${dir === 'flat' ? '' : '1.8%'}" text="지난달보다" /></CardHeroDetail>`,
        '</Card>',
      ].join('\n');
    if (content === 'list')
      return [
        'import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"',
        'import { List } from "@/components/ui/list"',
        '',
        '<Card body="list">',
        '  <CardHeader>',
        '    <CardTitle>오늘 쓴 돈</CardTitle>',
        '    <CardAction href="/desk/ledger">전체 보기</CardAction>',
        '  </CardHeader>',
        '  <List aria-label="오늘 쓴 돈">{today.map(renderExpenseRow)}</List>',
        '</Card>',
      ].join('\n');
    if (content === 'stat')
      return [
        'import { Card, CardStat } from "@/components/ui/card"',
        '',
        `<Card${p === 'none' ? '' : p === 'whole' ? ' href="/desk/stats/expense"' : ' press="peers"'}>`,
        `  <CardStat label="이번 달 지출" value="1,240,000원"${size === 'small' ? ' size="small"' : ''}`,
        `    delta={{ direction: "${dir}", value: "${DELTA[dir].value}", text: "지난달보다"${DELTA[dir].srText ? `, srText: "${DELTA[dir].srText}"` : ''} }} />`,
        '</Card>',
      ].join('\n');
    return [
      ...(p === 'peers' ? ['import { Pin } from "lucide-react"', 'import { Card, CardContent, CardLink } from "@/components/ui/card"', 'import { Toggle } from "@/components/ui/toggle"'] : ['import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"']),
      '',
      `<Card${p === 'whole' ? ' href={`/desk/budget/${budget.id}`}' : p === 'peers' ? ' press="peers"' : ''}>`,
      ...(p === 'peers'
        ? [
            '  {/* 고정 버튼은 제목 줄 오른쪽 — 켜고 끄는 아이콘 단추(Toggle). 상자 40 이 줄 높이를 밀지 않게 위 · 오른쪽 8 을 당긴다 */}',
            '  <div className="flex items-start justify-between gap-x2">',
            '    <CardLink href={`/desk/budget/${budget.id}`}>10월 식비 예산</CardLink>',
            '    <Toggle className="-mr-x2 -mt-x2 shrink-0" aria-label="10월 식비 예산 고정" pressed={budget.pinned} onPressedChange={(pinned) => setPinned(budget.id, pinned)} icon={<Pin />} />',
            '  </div>',
          ]
        : ['  <CardHeader>', '    <CardTitle>10월 식비 예산</CardTitle>', ...(p === 'none' ? ['    <CardAction href="/desk/budget">관리</CardAction>'] : []), '  </CardHeader>']),
      '  <CardContent>…</CardContent>',
      '</Card>',
    ].join('\n');
  }, [content, p, size, dir]);
  return (
    <NavPlayFrame
      surface={floor(look, mode)}
      wide={width === 'desktop'}
      stage={
        <div className="flex flex-col items-center gap-4" style={{ fontFamily: FONT }}>
          <div style={{ width: '100%', maxWidth: w }}>{card()}</div>
          <Said text={said} />
        </div>
      }
      note={`카드 여백 ${look.surface.pad}(폭과 상관없이) · 모서리 ${look.surface.radius} · 1px 테두리 · 그림자 없음. 누르는 카드는 면 색 + ${look.press.distance}px 축소(whole), 대등한 동작이 있으면 색만(peers).`}
      controls={
        <>
          <Seg label="내용" value={content} options={[['content', '글(예산)'], ['list', '목록(오늘 쓴 돈)'], ['stat', '지표'], ['hero', '순자산']]} onChange={(v) => setContent(v as Content)} />
          <Seg
            label="누름"
            value={p}
            options={content === 'content' ? [['none', '없음'], ['whole', '카드 전체(whole)'], ['peers', '대등한 동작(peers)']] : content === 'stat' ? [['none', '없음'], ['whole', '카드 전체(whole)']] : content === 'hero' ? [['none', '없음'], ['whole', '카드 전체 — 2px 축소만']] : [['none', '없음 — 목록은 안의 줄이 눌린다']]}
            onChange={(v) => setPress(v as CardPress)}
          />
          <Seg label="지표 크기" value={size} options={[['large', 'large 24 — 한 줄에 하나'], ['small', 'small 20 — 데스크톱 격자 넷']]} onChange={(v) => setSize(v as CardStatSize)} />
          <Seg label="증감" value={dir} options={[['up', '▲ 올랐다'], ['down', '▼ 내렸다'], ['flat', '변화 없음']]} onChange={(v) => setDir(v as DeltaDir)} />
          <Seg label="폭" value={width} options={[['phone', '폰 312'], ['desktop', '데스크톱 격자']]} onChange={(v) => setWidth(v as 'phone' | 'desktop')} />
          <Seg label="데이터" value={data} options={[['shown', '보임'], ['loading', '기다림'], ['failure', '실패']]} onChange={(v) => setData(v as Data)} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ── 코드 미리보기 — card.md 의 코드 그대로 ──────────────────
export function ExListDemo({ look }: { look: CardLook }) {
  const [said, setSaid] = useState('');
  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: '100%' }}>
        <CardSurface look={look} body="list">
          <CardHeaderView look={look} title="오늘 쓴 돈" action="전체 보기" body="list" live onAction={() => setSaid('오늘 쓴 돈 전체 보기')} />
          <ListView look={look.list.look} rows={spendRows()} live bgRadius={look.list.itemRadius} ariaLabel="오늘 쓴 돈" />
        </CardSurface>
      </div>
      <Said text={said} />
    </div>
  );
}
export function ExStatDemo({ look, stats }: { look: CardLook; stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: look.surface.gap }}>
      {stats.map((s) => (
        <CardSurface key={s.label} look={look}>
          <StatView look={look} label={s.label} value={formatWon(s.amount)} delta={s.delta} />
        </CardSurface>
      ))}
    </div>
  );
}
export function ExPressDemo({ look, toggle }: { look: CardLook; toggle: ToggleLook }) {
  const [said, setSaid] = useState('');
  const [pinned, setPinned] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full flex-col" style={{ gap: look.surface.gap }}>
        <CardSurface look={look} press="whole" live label="10월 식비 예산" onClick={() => setSaid('10월 식비 예산 상세로')}>
          <CardHeaderView look={look} title="10월 식비 예산" />
          <span style={{ fontFamily: FONT, fontSize: look.stat.label.fontSize, lineHeight: look.stat.label.lineHeight, color: dcv(look.stat.label.fg, 'auto') }}>{formatWon(500000)} 중 77% 썼어요</span>
        </CardSurface>
        {/* card.md 코드 그대로 — 제목 줄(flex · items-start · justify-between · gap-x2) 오른쪽에 고정 버튼(-mr-x2 · -mt-x2 · shrink-0), 아래 본문 */}
        <CardSurface look={look} press="peers" live label="장보기 목록" onClick={() => setSaid('장보기 목록 열기')}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: look.header.gap }}>
            <span style={{ fontFamily: look.title.fontFamily, fontSize: look.title.fontSize, lineHeight: look.title.lineHeight, fontWeight: look.title.fontWeight, color: dcv(look.title.fg, 'auto') }}>장보기 목록</span>
            {/* 고정 — Toggle(card.md 코드): 이름 "{메모 제목} 고정" 고정 · aria-pressed · pin 같은 아이콘(끔 흐린 선 2 · 켬 진한 선 2.5), 바탕은 칠하지 않는다 */}
            <span style={{ display: 'flex', flexShrink: 0, marginTop: -look.header.gap, marginRight: -look.header.gap }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              <ToggleView look={toggle} ariaLabel="장보기 목록 고정" pressed={pinned} icon="pin" onPressedChange={(v) => (setPinned(v), setSaid(v ? '고정했어요.' : '고정을 풀었어요.'))} />
            </span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: look.stat.label.fontSize, lineHeight: look.stat.label.lineHeight, color: dcv(look.stat.label.fg, 'auto') }}>우유 · 계란 · 두부 · 대파</span>
        </CardSurface>
      </div>
      <Said text={said} />
    </div>
  );
}
export function ExHeroDemo({ look, amount }: { look: CardLook; amount: string }) {
  return <HeroCardView look={look} label="순자산" amount={amount} delta={{ direction: 'up', value: '1.8%', text: '지난달보다' }} />;
}
