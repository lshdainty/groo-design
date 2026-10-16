// Tag Group 페이지의 그림 — specs/components/tag-group.md 의 `[그림: …](../../site/components/specs/tag-group.tsx#<id>)` 자리.
// 메타 줄은 tag-group.yaml 을 푼 값(display-look 의 tagLook)으로, 배지는 badge.yaml, 목록 줄은 list.yaml(ListView)로 그린다.
import type { ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { TAG_SIZES, TAG_TONES, TAG_WEIGHTS, tagReading, type TagItem, type TagSize, type TagTone, type TagWeight } from './display-look';
import { TagGroupPlayground } from './display-playground';
import { Reading, TagGroupView } from './display-view';
import { B, Board, CardHead, Header, Muted, Pair, PhoneBoard, Pin, Preview, Rows, Screen, T, TX, W, dk, items, markBox, markLine, modeKo, tone, txRow, type Brand } from './display-screens';
import { Cap } from './select-screens';
import { Verdict, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const tl = (brand: Brand = 'desk') => dk(brand).tag;
const px = (v: string) => parseFloat(v);
const TONE_KO: Record<TagTone, string> = { neutralSubtle: '흐린 글자(기본)', neutral: '본문 글자', brand: '브랜드 글자' };
const WEIGHT_KO: Record<TagWeight, string> = { regular: 'regular 400', bold: 'bold 700' };
const VIEWS: TagItem = { label: '12', prefixIcon: 'eye', srLabel: '조회 12' };

// ── 화면 ──────────────────────────────────────────────────
// HR 공지 목록 — 작성 팀 · 날짜 · 조회(눈 아이콘 + 숫자, 읽을 글 "조회 12")
function NoticeScreen({ mode, scale = 0.5, h = 520 }: { mode: Mode; scale?: number; h?: number }) {
  const notice = (title: string, team: string, date: string, views: string) => ({
    kind: 'button' as const,
    title,
    detailNode: <T items={items(team, date, { label: views, prefixIcon: 'eye', srLabel: `조회 ${views}`, shrink: 0 })} size="t3" truncate mode={mode} brand="hr" />,
    suffix: { chevron: true },
  });
  return (
    <Screen title="공지" mode={mode} scale={scale} h={h}>
      <Header title="이번 주" mode={mode} brand="hr" />
      <Rows mode={mode} brand="hr" rows={[notice('10월 전사 워크숍 안내', '인사팀', '10월 2일', '12'), notice('연말 정산 서류 제출', '재무팀', '9월 30일', '48'), notice('사내 동호회 모집', '총무팀', '9월 28일', '7')]} />
    </Screen>
  );
}
// 카드 상세 — 머리 메타(t2 · 줄바꿈) · 혜택 조건(앞세운 항목 하나) · 이번 달 거래(t3 · 한 줄 말줄임)
function CardScreen({ mode, scale = 0.5, h = 520 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="카드" mode={mode} scale={scale} h={h}>
      <CardHead mode={mode} />
      <Header title="혜택" mode={mode} />
      <div className="flex flex-col px-6 pb-2" style={{ gap: 4 }}>
        <span className="text-[16px] leading-[22px]" style={{ color: tone('fg-neutral', mode) }}>
          커피 10% 할인
        </span>
        <T items={items({ label: '전월 30만원 이상', tone: 'neutral', weight: 'bold' }, '할인형', '연회비 2만원')} mode={mode} />
      </div>
      <Header title="10월 거래" mode={mode} />
      <Rows mode={mode} rows={[txRow(TX.starbucks, mode), txRow(TX.lunch, mode)]} />
    </Screen>
  );
}
function LedgerScreen({ mode, scale = 0.5, h = 520 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="가계부" back={false} mode={mode} scale={scale} h={h}>
      <Header title="10월 2일 (금)" mode={mode} />
      <Rows mode={mode} rows={[txRow(TX.starbucks, mode), txRow(TX.netflix, mode), txRow(TX.lunch, mode), txRow(TX.bus, mode)]} />
    </Screen>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LedgerScreen mode={mode} />
          <NoticeScreen mode={mode} />
          <CardScreen mode={mode} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <TagGroupPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const lk = tl();
  const z = 3;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-12 rounded-xl pk-surface px-10 pb-8 pt-16">
        <TagGroupView
          look={lk}
          zoom={z}
          items={[{ label: '12', prefixIcon: 'eye', srLabel: '조회 12' }, { label: '인사팀' }, { label: '10월 2일' }]}
          zone={{ item: { ...markLine, outlineOffset: 3 }, icon: markBox, separator: markBox }}
          pins={{ item: <Pin n="ⓐ" style={{ left: '50%', bottom: -34, marginLeft: -10 }} />, icon: <Pin n="ⓑ" style={{ left: '50%', top: -30, marginLeft: -10 }} />, separator: <Pin n="ⓒ" style={{ left: '50%', top: -30, marginLeft: -10 }} /> }}
        />
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Item'],
            ['ⓑ', 'Icon'],
            ['ⓒ', 'Separator'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
        <span className="text-center text-[12px] leading-4 pk-muted">3배로 그렸다(t2) — 구분 &ldquo; · &rdquo; 는 글자다. 앞 공백이 줄이 안 바뀌는 공백이라 앞 항목에 붙는다</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Size: Fig = ({ caption }) => {
  const lk = tl();
  return (
    <Panel caption={caption}>
      <Board>
        <div className="flex flex-col">
          {TAG_SIZES.map((s, i) => {
            const v = lk.sizes[s];
            return (
              <div key={s} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:gap-6" style={{ borderTop: i ? `1px solid ${tone('stroke-neutral-subtle')}` : undefined }}>
                <div className="flex w-[220px] shrink-0 flex-col gap-0.5">
                  <b className="text-[14px] pk-text">
                    {s} {px(v.text.fontSize)} / {px(v.text.lineHeight)}
                    {s === lk.defaults.size && <span className="font-normal pk-muted"> (기본)</span>}
                  </b>
                  <span className="text-[12px] leading-4 pk-muted">
                    아이콘 {v.icon} · 아이콘과 글 사이 {lk.itemGap}
                  </span>
                </div>
                <TagGroupView look={lk} size={s} items={items('식비', '신한카드', '오후 2:10', VIEWS)} />
              </div>
            );
          })}
        </div>
      </Board>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">크기는 묶음에 하나 — 한 줄 안에서 섞지 않는다. 글은 글자 크기 설정을 따른다</p>
    </Panel>
  );
};

const Tone: Fig = ({ caption }) => {
  const lk = tl();
  const panel = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Board mode={mode}>
        <div className="grid items-center gap-x-5 gap-y-2.5" style={{ gridTemplateColumns: 'max-content max-content max-content' }}>
          <span />
          {TAG_WEIGHTS.map((w) => (
            <Muted key={w} mode={mode}>
              {WEIGHT_KO[w]}
            </Muted>
          ))}
          {TAG_TONES.map((t) => (
            <div key={t} className="contents">
              <span className="text-[12px] leading-4" style={{ color: tone('fg-neutral', mode) }}>
                <b>{t}</b>
                <span className="block" style={{ color: tone('fg-neutral-subtle', mode) }}>
                  {TONE_KO[t]}
                </span>
              </span>
              {TAG_WEIGHTS.map((w) => (
                <TagGroupView key={w} look={lk} mode={mode} items={[{ label: '12,000원', tone: t, weight: w }]} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t pt-3" style={{ borderColor: tone('stroke-neutral-subtle', mode) }}>
          <Muted mode={mode}>금액 하나만 진하게</Muted>
          <TagGroupView look={lk} mode={mode} items={items({ label: '12,000원', tone: 'neutral', weight: 'bold' }, '식비', '오후 2:10')} />
        </div>
      </Board>
      <Cap strong={modeKo(mode)}>구분 &ldquo; · &rdquo; 는 톤과 관계없이 늘 fg-disabled — 글보다 한 단계 흐리다</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {panel('light')}
        {panel('dark')}
      </div>
    </Panel>
  );
};

const Icon: Fig = ({ caption }) => {
  const lk = tl();
  const split = (at: 'prefix' | 'suffix'): TagItem[] =>
    at === 'prefix'
      ? [
          { label: '2', prefixIcon: 'git-branch', srLabel: '분할 2건' },
          { label: '12', prefixIcon: 'eye', srLabel: '조회 12' },
        ]
      : [
          { label: '2', suffixIcon: 'git-branch', srLabel: '분할 2건' },
          { label: '12', suffixIcon: 'eye', srLabel: '조회 12' },
        ];
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {(['prefix', 'suffix'] as const).map((at) => (
          <div key={at} className="flex min-w-0 flex-col gap-2">
            <Board className="flex flex-col items-start gap-3">
              <TagGroupView look={lk} size="t4" items={split(at)} />
              <Reading>&ldquo;{tagReading(split(at), lk.srSep)}&rdquo;</Reading>
            </Board>
            <Cap strong={at === 'prefix' ? '앞 아이콘 prefixIcon' : '뒤 아이콘 suffixIcon'}>항목에 하나만 — 앞뒤 모두 두지 않는다. 뜻은 읽을 글(srLabel)이 말한다</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 줄바꿈 · 말줄임 · 줄어드는 정도 · 최소 폭 — 같은 좁은 폭(200)
function Narrow({ children, w = 200 }: { children: ReactNode; w?: number }) {
  return (
    <div className="relative" style={{ width: w, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }}>
      {children}
    </div>
  );
}
const Overflow: Fig = ({ caption }) => {
  const lk = tl();
  const long = items('교통', '신한카드 Deep Dream 체크(1234)', '오후 2:10');
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[560px] gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[120px] items-center justify-center">
            <Narrow>
              <TagGroupView look={lk} size="t3" items={long} />
            </Narrow>
          </Board>
          <Cap strong="wrap — 줄바꿈(기본)">낱말 단위로 바꾼다 — 구분은 앞 줄 끝에 남고, 다음 줄은 항목으로 시작한다</Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[120px] items-center justify-center">
            <Narrow>
              <TagGroupView look={lk} size="t3" truncate items={long} />
            </Narrow>
          </Board>
          <Cap strong="truncate — 한 줄 말줄임">항목 글이 각자 말줄임 — 구분은 줄지 않는다</Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[120px] items-center justify-center">
            <Narrow>
              <TagGroupView look={lk} size="t3" truncate items={items({ label: '교통', shrink: 0 }, { label: '신한카드 Deep Dream 체크(1234)', shrink: 2 }, { label: '오후 2:10', shrink: 0 })} />
            </Narrow>
          </Board>
          <Cap strong="shrink — 줄어드는 정도">0 은 줄지 않고 1 이상은 글 폭 × shrink 비율로 함께 준다 — 긴 자산 이름만 줄었다</Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[120px] items-center justify-center">
            <Narrow>
              <TagGroupView look={lk} size="t3" truncate items={items('간식 · 디저트 모음 아주 긴 카테고리 이름', '지어낸카드 체크카드 개인(1234)', '오후 2:10', '분할 2건')} />
            </Narrow>
          </Board>
          <Cap strong="최소 폭 — 첫 글자 + …">모두 shrink 1 이어도 항목마다 첫 글자 + "…"(2.1em)는 남는다 — 글자 조각만 남지 않는다</Cap>
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">분홍 점선 — 폭 200. 말줄임해도 글 전체는 보조 기술이 읽는다</p>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const RoleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair stack>
      <Verdict ok note="상태(예정)는 제목 옆 배지, 메타(분류 · 자산 · 날짜)는 설명 줄 Tag Group">
        <PhoneBoard>
          <Rows rows={[txRow(TX.netflix), txRow(TX.starbucks)]} />
        </PhoneBoard>
      </Verdict>
      <Verdict ok={false} note="메타를 배지로 · 상태를 메타 줄에 — 무엇이 상태인지 갈리지 않는다">
        <PhoneBoard>
          <Rows
            rows={[
              {
                ...txRow({ ...TX.netflix, badge: undefined, excluded: undefined }),
                detailNode: (
                  <span className="flex gap-1">
                    <B l="구독" />
                    <B l="현대카드 M" />
                    <B l="10월 18일" />
                  </span>
                ),
              },
              { ...txRow(TX.starbucks), detailNode: <T items={items('카페', '현대카드 M', '결제 완료')} size="t3" truncate /> },
            ]}
          />
        </PhoneBoard>
      </Verdict>
    </Pair>
  </Panel>
);

const WritingGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="6 ~ 10자 · 조사와 군말을 뺐다 — 화면마다 같은 순서(분류 · 자산 · 시각)">
        <W w={300}>
          <T items={items('식비', '신한카드', '오후 2:10')} size="t3" />
        </W>
      </Verdict>
      <Verdict ok={false} note="항목이 문장이 됐다 — 길어져 잘리고 읽기 어렵다. 문장은 설명 글이다">
        <W w={300}>
          <T items={items('식비로 분류됨', '신한카드로 결제함', '오후 2시 10분에 결제했어요')} size="t3" />
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

const SeparatorGuide: Fig = ({ caption }) => {
  const lk = tl();
  const list = items('500m', '역삼동', '3분 전');
  return (
    <Panel caption={caption}>
      <Pair three>
        <Verdict ok note='글자 " · " — 앞뒤 띄어쓰기, 글보다 한 단계 흐리게(fg-disabled). 글자 크기를 따라간다'>
          <span className="flex flex-col items-center gap-2">
            <TagGroupView look={lk} size="t2" items={list} />
            <TagGroupView look={lk} size="t4" items={list} />
          </span>
        </Verdict>
        <Verdict ok={false} note="2px 점 그림 — 글자가 커져도 그대로이고 화면마다 크기 · 색이 갈린다">
          <span className="flex flex-col items-center gap-2">
            <TagGroupView look={lk} size="t2" items={list} badSeparator="dot2" />
            <TagGroupView look={lk} size="t4" items={list} badSeparator="dot2" />
          </span>
        </Verdict>
        <Verdict ok={false} note='"•" · "|" — 구분이 글보다 무거워 항목처럼 보인다'>
          <span className="flex flex-col items-center gap-2">
            <TagGroupView look={lk} size="t3" items={list} badSeparator="bullet" />
            <TagGroupView look={lk} size="t3" items={list} badSeparator="bar" />
          </span>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 섞인 크기(나쁜 예) — 항목마다 글자 크기를 바꿨다
function Mixed() {
  const lk = tl();
  const sz: TagSize[] = ['t4', 't2', 't3'];
  const words = ['12,000원', '식비', '오후 2:10'];
  return (
    <span>
      {words.map((w, i) => {
        const t = lk.sizes[sz[i]].text;
        return (
          <span key={w}>
            <span style={{ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: i === 0 ? 700 : 400, color: tone(i === 0 ? 'fg-neutral' : 'fg-neutral-subtle') }}>{w}</span>
            {i < words.length - 1 && <span style={{ fontSize: lk.sizes.t3.text.fontSize, color: tone('fg-disabled'), whiteSpace: 'pre' }}>{lk.sep.glyph}</span>}
          </span>
        );
      })}
    </span>
  );
}
const SizeGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="한 크기 — 금액은 톤 · 굵기로 앞세운다">
        <T items={items({ label: '12,000원', tone: 'neutral', weight: 'bold' }, '식비', '오후 2:10')} size="t3" />
      </Verdict>
      <Verdict ok={false} note="항목마다 크기를 바꿨다 — 글줄이 들쭉날쭉하고 높이가 흔들린다">
        <Mixed />
      </Verdict>
    </Pair>
  </Panel>
);

const ReadingGuide: Fig = ({ caption }) => {
  const lk = tl();
  const notice = items('인사팀', '10월 2일', VIEWS);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='구분 자리에 보이지 않는 ", " · 아이콘 항목은 읽을 글("조회 12")'>
          <span className="flex flex-col items-center gap-3">
            <TagGroupView look={lk} items={notice} />
            <Reading tone="ok">&ldquo;{tagReading(notice, lk.srSep)}&rdquo;</Reading>
          </span>
        </Verdict>
        <Verdict ok={false} note="구분을 숨기기만 했다 — 항목이 붙어 읽히고 숫자만 남는다">
          <span className="flex flex-col items-center gap-3">
            <TagGroupView look={lk} items={notice} />
            <Reading tone="bad">&ldquo;인사팀10월 2일12&rdquo;</Reading>
          </span>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — tag-group.md 의 코드 그대로 ─────
const ExRow: Fig = ({ caption }) => (
  <Preview caption={caption} w={312}>
    <T items={items('식비', '신한카드', { label: '오후 2:10', shrink: 0 })} size="t3" truncate />
  </Preview>
);
const ExEmphasis: Fig = ({ caption }) => (
  <Preview caption={caption} w={312}>
    <div className="flex flex-col items-start gap-3">
      <T items={items({ label: '전월 30만원 이상', tone: 'neutral', weight: 'bold' }, '할인형', '연회비 2만원')} />
      <T items={items('인사팀', '10월 2일', VIEWS)} />
    </div>
  </Preview>
);
const ExTruncate: Fig = ({ caption }) => (
  <Preview caption={caption} w={312}>
    <div className="flex flex-col items-start gap-2">
      <div style={{ width: 220, maxWidth: '100%', outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3, background: MARK }}>
        <T items={items({ label: '교통', shrink: 0 }, { label: '신한카드 Deep Dream 체크(1234)', shrink: 2 }, { label: '오후 2:10', shrink: 0 })} size="t3" truncate />
      </div>
      <span className="text-[12px] leading-4 pk-muted">분홍 칸 — 폭 220</span>
    </div>
  </Preview>
);

export const tagGroupFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  tone: Tone,
  icon: Icon,
  overflow: Overflow,
  'role-guide': RoleGuide,
  'writing-guide': WritingGuide,
  'separator-guide': SeparatorGuide,
  'size-guide': SizeGuide,
  'reading-guide': ReadingGuide,
  'ex-row': ExRow,
  'ex-emphasis': ExEmphasis,
  'ex-truncate': ExTruncate,
};
