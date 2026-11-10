// 기다림 묶음 그림의 화면 데이터 — 서버 그림(loading-screens · 페이지 그림)과 브라우저 미리보기(loading-demos · 플레이그라운드)가 함께 쓴다.
// 파일 읽기(서버 전용)를 들이지 않는다. 글은 Writing v106(해요체 · 문장은 마침표).
import type { RowSpec } from './list-shared';

// 가계부 거래 — 앞 타일(카테고리 색 · List 타일 40 · 모서리 12) · 제목 · 메타 · 금액. 스켈레톤의 앞 자리(radius 12)와 같은 모양이다
export const TX: RowSpec[] = [
  { kind: 'view', title: '점심 식사', detail: '식비 · 현대카드 신용카드', prefix: { tile: 'orange', icon: 'utensils' }, suffix: { amount: '−12,000원' } },
  { kind: 'view', title: '다라커피', detail: '카페 · 현대카드 신용카드', prefix: { tile: 'brown', icon: 'coffee' }, suffix: { amount: '−5,600원' } },
  { kind: 'view', title: '지하철', detail: '교통 · 국민 체크카드', prefix: { tile: 'green', icon: 'bus' }, suffix: { amount: '−1,450원' } },
  { kind: 'view', title: '월급', detail: '수입 · 토스뱅크 통장', prefix: { tile: 'blue', icon: 'wallet' }, suffix: { amount: '+3,200,000원' } },
  { kind: 'view', title: '편의점', detail: '식비 · 현금', prefix: { tile: 'orange', icon: 'utensils' }, suffix: { amount: '−4,300원' } },
  { kind: 'view', title: '영화', detail: '문화 · 국민 체크카드', prefix: { tile: 'violet', icon: 'star' }, suffix: { amount: '−15,000원' } },
];

// 카테고리 고르기 — 하나 고르기 줄(앞 타일 · 오른쪽 라디오). 길이가 데이터에 따라 느는 본문이라 끝 흐림(scrollFog)을 건다
export const CATEGORY: RowSpec[] = [
  { kind: 'radio', title: '식비', value: 'food', prefix: { tile: 'orange', icon: 'utensils' }, checked: true },
  { kind: 'radio', title: '교통', value: 'transport', prefix: { tile: 'green', icon: 'bus' } },
  { kind: 'radio', title: '쇼핑', value: 'shopping', prefix: { tile: 'violet', icon: 'shopping-bag' } },
  { kind: 'radio', title: '카페', value: 'cafe', prefix: { tile: 'brown', icon: 'coffee' } },
  { kind: 'radio', title: '구독', value: 'subscription', prefix: { tile: 'red', icon: 'smartphone' } },
  { kind: 'radio', title: '의료', value: 'medical', prefix: { tile: 'blue', icon: 'stethoscope' } },
  { kind: 'radio', title: '여행', value: 'travel', prefix: { tile: 'indigo', icon: 'plane' } },
  { kind: 'radio', title: '주거', value: 'housing', prefix: { tile: 'yellow', icon: 'house' } },
];

// 칩 필터 줄 — 비교 페이지의 줄(전체 · 식비 · 교통 …)
export const FILTER_CHIPS = ['전체', '식비', '교통', '쇼핑', '카페', '구독', '의료', '여행'];

// 통계 — 달마다 지출 · 카테고리 금액
export type MonthStat = { total: string; rows: [string, string, string][] };
export const MONTH_STATS: Record<string, MonthStat> = {
  '2026-07': { total: '598,200원', rows: [['식비', 'orange', '401,000원'], ['교통', 'green', '112,700원'], ['쇼핑', 'violet', '84,500원']] },
  '2026-08': { total: '702,900원', rows: [['식비', 'orange', '455,400원'], ['교통', 'green', '131,000원'], ['쇼핑', 'violet', '116,500원']] },
  '2026-09': { total: '656,500원', rows: [['식비', 'orange', '432,000원'], ['교통', 'green', '128,500원'], ['쇼핑', 'violet', '96,000원']] },
  '2026-10': { total: '412,300원', rows: [['식비', 'orange', '268,000원'], ['교통', 'green', '84,300원'], ['쇼핑', 'violet', '60,000원']] },
};

// 약관 — 카드 안 높이를 정한 스크롤(Scroll Fog box)
export const TERMS = [
  '가계부는 입력한 거래를 기기와 서버에 함께 저장해요. 서버에 저장한 거래는 같은 계정으로 들어온 기기에서 볼 수 있어요.',
  '카드 · 계좌를 연결하면 거래를 하루에 한 번 불러와요. 불러온 거래는 직접 고치거나 지울 수 있어요.',
  '이용을 해지하면 계정은 남고 거래 기록은 30일 뒤 지워요. 그 사이에 다시 들어오면 그대로 쓸 수 있어요.',
  '알림은 설정에서 종류마다 끌 수 있어요. 예산 알림은 정한 기준에 닿을 때 한 번만 보내요.',
  '내보내기는 CSV 로 받을 수 있어요. 받은 파일에는 메모와 태그도 함께 들어가요.',
];
