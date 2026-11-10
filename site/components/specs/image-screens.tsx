// 이미지 묶음 페이지(Image Frame · Logo Tile · Aspect Ratio)와 Skeleton · List · Avatar · Content Placeholder 가 같이 쓰는 그림 조각 — 서버(빌드 때) 그림.
// 틀 · 카드 그림 · 타일 · 비율 상자는 image-look 이 YAML 에서 푼 값으로(기관 색은 institution-colors.yaml 에서 찾아 넘긴다), 목록 줄은 list.yaml(ListView),
// 배지 · 메타 줄은 badge · tag-group.yaml, 화면 틀은 kit 으로 그린다. 그림은 손으로 칠한 대역이다(실제 사진 · 카드 그림 · 기관 로고가 아니다).
// 화면 예시의 글(카드 · 자산 · 규정)은 비교 페이지(2026-10-04)에서 사용자가 본 것과 같은 결이다 — 카드 혜택, 자산 줄, HR 규정 그림.
import type { CSSProperties, ReactNode } from 'react';
import { listLook } from './list-look';
import type { RowSpec } from './list-shared';
import { ListView } from './list-view';
import { B, Header, PhoneBoard, Screen, T, items, tone, type Brand } from './display-screens';
import { aspectRatioLook, cardArtLook, cardFace, imageFrameLook, institutions, logoFace, logoTileLook, type IfPlacement, type LtFace, type LtImage, type LtSize, type PicKind } from './image-look';
import { CardArtView, ImageFrameView, IndicatorView, LogoTileView, type CardArtViewProps, type ImageFrameViewProps, type LogoState, type LogoTileViewProps } from './image-view';
import { rc, type Mode } from './kit';

export type Fig = (p: { caption?: string }) => ReactNode;
export const IFL = () => imageFrameLook();
export const CAL = () => cardArtLook();
export const LTL = () => logoTileLook();
export const ARL = () => aspectRatioLook();

// ── 부품(값은 YAML) ─────────────────────────────────────
export const Frame = (p: Omit<ImageFrameViewProps, 'look'>) => <ImageFrameView look={IFL()} {...p} />;
// 카드 그림 — 카드사 이름으로 기관 색 표에서 면을 찾아 넘긴다(모르면 대체 그림)
export function Card({ issuer, ...p }: Omit<CardArtViewProps, 'look' | 'ca' | 'face'>) {
  const f = cardFace(issuer, institutions(), CAL());
  return <CardArtView look={IFL()} ca={CAL()} face={f ? { bg: f.bg, fg: f.fg } : null} issuer={issuer} {...p} />;
}
// 로고 타일 — 이름으로 기관 색 표(face institution) 또는 이름 색(face name)
export function Logo({ name, face = 'institution', ...p }: Omit<LogoTileViewProps, 'look' | 'frame' | 'paint'> & { face?: LtFace }) {
  const f = logoFace(name, face, institutions(), LTL());
  return <LogoTileView look={LTL()} frame={IFL()} paint={{ bg: f.bg, fg: f.fg }} name={name} {...p} />;
}
export const Ind = ({ children, label, zoom }: { children: ReactNode; label: string; zoom?: number }) => (
  <IndicatorView look={IFL()} label={label} zoom={zoom}>
    {children}
  </IndicatorView>
);
// 그림 위 배지 — 늘 solid(SEED Badge — 이미지 위는 Solid), medium
export const Discontinued = ({ mode = 'auto' }: { mode?: Mode }) => <B l="단종" v="solid" mode={mode} />;
export const at = (placement: IfPlacement, node: ReactNode) => ({ placement, node });

// ── 화면 예시의 데이터 ─────────────────────────────────────
// 카드 혜택 — 그림 있음(가로 · 세로) · 그림 없음(아는 카드사 — 흰 글자 · 짙은 글자) · 모르는 카드사 · 단종
export type CardItem = { name: string; issuer: string; type: string; pic: PicKind | null; discontinued?: boolean };
export const CARDS: CardItem[] = [
  { name: '데일리 플러스', issuer: '신한카드', type: '신용', pic: 'card-h' },
  { name: '트래블로그', issuer: '하나카드', type: '체크', pic: 'card-v' },
  { name: 'NH올원 Pay', issuer: 'NH농협카드', type: '체크', pic: null },
  { name: '톡톡 With', issuer: 'KB국민카드', type: '신용', pic: null },
  { name: '바로 카드', issuer: 'BC카드', type: '신용', pic: null },
  { name: 'M 에디션', issuer: '현대카드', type: '신용', pic: 'card-h2', discontinued: true },
];
// 자산 — 은행 · 적금 · 증권 · 코인 · 기관 없는 자산(이름 색)
export type AssetItem = { name: string; institution?: string; type: string; balance: string };
export const ASSETS: AssetItem[] = [
  { name: '신한 주거래 통장', institution: '신한', type: '입출금', balance: '1,250,000원' },
  { name: '카카오뱅크 세이프박스', institution: '카카오뱅크', type: '저축', balance: '3,000,000원' },
  { name: '유안타증권 CMA', institution: '유안타증권', type: '증권', balance: '820,400원' },
  { name: '업비트', institution: '업비트', type: '코인', balance: '412,000원' },
  { name: '비상금', type: '현금', balance: '200,000원' },
];
export const assetDetail = (a: AssetItem) => [a.institution, a.type].filter(Boolean).join(' · ');
// HR 규정 그림 — 1:1 · 제목 · 설명이 내용을 말한다(그림은 장식)
export const RULES: { pic: PicKind; title: string; body: string }[] = [
  { pic: 'rule-vacation', title: '연차 일수', body: '입사 1년 차부터 15일이에요.' },
  { pic: 'rule-attire', title: '복장', body: '편한 옷차림이면 돼요.' },
  { pic: 'rule-education', title: '교육 지원', body: '한 해 100만 원까지 지원해요.' },
  { pic: 'rule-culture', title: '회의 문화', body: '회의는 30분을 넘기지 않아요.' },
];

// ── 목록 줄 ───────────────────────────────────────────────
export function Rows({ rows, mode = 'auto', brand = 'desk', ariaLabel }: { rows: RowSpec[]; mode?: Mode; brand?: Brand; ariaLabel?: string }) {
  return <ListView look={listLook(brand)} rows={rows} mode={mode} live={false} ariaLabel={ariaLabel} />;
}
// 카드 혜택 줄 — 카드 그림 56 · 이름 · "신용 · 신한카드"(image-frame.md 코드)
export function cardRow(c: CardItem, mode: Mode = 'auto', extra?: Partial<RowSpec>): RowSpec {
  return { kind: 'button', prefix: { node: <Card width={56} issuer={c.issuer} name={c.name} pic={c.pic} mode={mode} /> }, title: c.name, detail: `${c.type} · ${c.issuer}`, ...extra };
}
// 자산 줄 — 로고 타일 40 · 자산 이름 · "기관 · 종류" · 잔액(logo-tile.md 코드)
export function assetRow(a: AssetItem, mode: Mode = 'auto', extra?: Partial<RowSpec> & { image?: LtImage; pic?: PicKind; load?: LogoState; size?: LtSize }): RowSpec {
  const { image, pic, load, size, ...rest } = extra ?? {};
  return {
    kind: 'button',
    prefix: { node: <Logo name={a.institution ?? a.name} face={a.institution ? 'institution' : 'name'} mode={mode} image={image} pic={pic} state={load} size={size} /> },
    title: a.name,
    detail: assetDetail(a),
    suffix: { amount: a.balance },
    ...rest,
  };
}

// ── 화면 ──────────────────────────────────────────────────
// 카드 혜택 격자 — 칸 폭 150(화면 360 − 좌우 24 − 사이 12, 두 칸). 칸 아래 카드 이름(t4 700) · 카드사
export const GRID = { gutter: 24, gap: 12, cell: (360 - 24 * 2 - 12) / 2 };
export function CardCell({ c, mode = 'auto', width = GRID.cell }: { c: CardItem; mode?: Mode; width?: number }) {
  return (
    <div className="flex min-w-0 flex-col" style={{ gap: 6, width }}>
      <Card width={width} issuer={c.issuer} name={c.name} pic={c.pic} mode={mode} floaters={c.discontinued ? [at('top-start', <Discontinued mode={mode} />)] : undefined} />
      <span className="flex flex-col">
        <span className="truncate text-[14px] font-bold leading-[19px]" style={{ color: tone('fg-neutral', mode) }}>
          {c.name}
        </span>
        <span className="truncate text-[12px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
          {c.issuer}
        </span>
      </span>
    </div>
  );
}
export function BenefitGridScreen({ mode = 'auto', scale, h, n = 6 }: { mode?: Mode; scale?: number; h?: number; n?: number }) {
  return (
    <Screen title="카드 혜택" mode={mode} scale={scale} h={h}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(2, ${GRID.cell}px)`, columnGap: GRID.gap, rowGap: 16, paddingLeft: GRID.gutter, paddingRight: GRID.gutter, paddingTop: 8 }}>
        {CARDS.slice(0, n).map((c) => (
          <CardCell key={c.name} c={c} mode={mode} />
        ))}
      </div>
    </Screen>
  );
}
export function BenefitListScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="카드 혜택" mode={mode} scale={scale} h={h}>
      <Header title="내 카드 6장" mode={mode} />
      <Rows mode={mode} rows={CARDS.map((c) => cardRow(c, mode, c.discontinued ? { titleBadge: <B l="단종" mode={mode} /> } : undefined))} />
    </Screen>
  );
}
// HR 규정 — 두 칸 격자, 1:1 그림 · 제목 · 설명
export function RuleCard({ r, mode = 'auto', width }: { r: (typeof RULES)[number]; mode?: Mode; width: number }) {
  return (
    <div className="flex min-w-0 flex-col" style={{ gap: 8, width }}>
      <Frame ratio="1:1" width={width} pic={r.pic} mode={mode} />
      <span className="flex flex-col" style={{ gap: 2 }}>
        <span className="text-[15px] font-bold leading-5" style={{ color: tone('fg-neutral', mode, 'hr') }}>
          {r.title}
        </span>
        <span className="text-[13px] leading-[18px]" style={{ color: tone('fg-neutral-subtle', mode, 'hr') }}>
          {r.body}
        </span>
      </span>
    </div>
  );
}
export function RuleScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="회사 규정" mode={mode} scale={scale} h={h}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(2, ${GRID.cell}px)`, columnGap: GRID.gap, rowGap: 20, paddingLeft: GRID.gutter, paddingRight: GRID.gutter, paddingTop: 8 }}>
        {RULES.map((r) => (
          <RuleCard key={r.title} r={r} mode={mode} width={GRID.cell} />
        ))}
      </div>
    </Screen>
  );
}
// 자산 — 로고 타일 40 줄
export function AssetListScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="자산" mode={mode} scale={scale} h={h} back={false}>
      <div className="flex flex-col px-6 pb-2 pt-1" style={{ gap: 2 }}>
        <span className="text-[13px] leading-[18px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
          순자산
        </span>
        <span className="text-[22px] font-bold leading-[30px] tabular-nums" style={{ color: tone('fg-neutral', mode) }}>
          5,682,400원
        </span>
      </div>
      <Header title="계좌 · 현금" mode={mode} />
      <Rows mode={mode} rows={ASSETS.map((a) => assetRow(a, mode))} />
    </Screen>
  );
}
// 계좌 관리 — 같은 로고 타일 40, 뒤는 화살표
export function AccountManageScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  const rows: AssetItem[] = [ASSETS[0], { name: 'KB국민 적금', institution: 'KB국민', type: '적금', balance: '' }, { name: 'NH농협 통장', institution: 'NH농협', type: '입출금', balance: '' }, { name: '토스뱅크 통장', institution: '토스뱅크', type: '입출금', balance: '' }, ASSETS[4]];
  return (
    <Screen title="계좌 관리" mode={mode} scale={scale} h={h}>
      <Header title="계좌 5개" mode={mode} />
      <Rows mode={mode} rows={rows.map((a) => ({ ...assetRow(a, mode), suffix: { chevron: true } }))} />
    </Screen>
  );
}
// 자산 상세 머리 — 로고 타일 48 · 자산 이름 · 기관, 아래 잔액
export function AssetHead({ a, mode = 'auto' }: { a: AssetItem; mode?: Mode }) {
  return (
    <div className="flex flex-col px-6 pb-4 pt-2" style={{ gap: 16 }}>
      <span className="flex items-center" style={{ gap: 12 }}>
        <Logo size="48" name={a.institution ?? a.name} face={a.institution ? 'institution' : 'name'} mode={mode} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[17px] font-bold leading-6" style={{ color: tone('fg-neutral', mode) }}>
            {a.name}
          </span>
          <span className="truncate text-[13px] leading-[18px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
            {assetDetail(a)}
          </span>
        </span>
      </span>
      <span className="text-[26px] font-bold leading-[34px] tabular-nums" style={{ color: tone('fg-neutral', mode) }}>
        {a.balance}
      </span>
    </div>
  );
}
export function AssetDetailScreen({ mode = 'auto', scale, h }: { mode?: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="자산 상세" mode={mode} scale={scale} h={h}>
      <AssetHead a={ASSETS[0]} mode={mode} />
      <Header title="최근 거래" mode={mode} />
      <Rows
        mode={mode}
        rows={[
          { kind: 'button', prefix: { tile: 'brown', icon: 'coffee' }, title: '다라커피 강남역점', detailNode: <T items={items('카페', '오후 2:10')} size="t3" truncate mode={mode} />, suffix: { amount: '−5,600원' } },
          { kind: 'button', prefix: { tile: 'green', icon: 'wallet' }, title: '급여', detailNode: <T items={items('수입', '10월 25일')} size="t3" truncate mode={mode} />, suffix: { amount: '+3,200,000원' } },
        ]}
      />
    </Screen>
  );
}

// ── 판 · 글 ───────────────────────────────────────────────
export { PhoneBoard, tone };
// 회색 판 위의 흰 칸 — 그림 하나와 아래 두 줄
export function Cell({ children, strong, cap, mode = 'auto', pad = 16, bg = 'bg-layer-default', style }: { children: ReactNode; strong?: ReactNode; cap?: ReactNode; mode?: Mode; pad?: number; bg?: string; style?: CSSProperties }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <div className="flex max-w-full items-center justify-center rounded-xl" style={{ background: rc(bg, mode), padding: pad, ...style }}>
        {children}
      </div>
      {(strong || cap) && (
        <span className="flex max-w-[240px] flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
          {strong && <b className="text-[13px] pk-text">{strong}</b>}
          {cap}
        </span>
      )}
    </div>
  );
}
