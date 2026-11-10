// Segmented Control 페이지의 화면 예시 값 — 서버 그림(segmented-control.tsx)과 브라우저 미리보기(데모 · 플레이그라운드)가 함께 쓴다.
// 'use client' 파일에서 값을 내보내면 서버 그림에는 값 대신 참조가 가므로, 값은 여기에 둔다.
import type { SegItem } from './segmented-control-shared';

// 칸 수마다 화면 — 2 증권 시장(국내 · 미국) · 3 가계부 목록 · 4 할 일. long 은 글이 길어 줄이 바뀌는 모습(플레이그라운드)
export type SegSet = { key: 'market' | 'ledger' | 'todo'; aria: string; items: SegItem[]; long: string[] };
export const SEG_SETS: Record<number, SegSet> = {
  2: {
    key: 'market',
    aria: '시장',
    items: [
      { value: 'domestic', label: '국내' },
      { value: 'us', label: '미국' },
    ],
    long: ['국내 상장 주식만 보기', '미국 상장 주식만 보기'],
  },
  3: {
    key: 'ledger',
    aria: '가계부 보기',
    items: [
      { value: 'all', label: '전체' },
      { value: 'expense', label: '지출' },
      { value: 'income', label: '수입' },
    ],
    long: ['전체 거래 내역', '지출 거래만', '수입 거래만'],
  },
  4: {
    key: 'todo',
    aria: '할 일 보기',
    items: [
      { value: 'today', label: '오늘' },
      { value: 'week', label: '이번 주' },
      { value: 'all', label: '전체' },
      { value: 'done', label: '완료' },
    ],
    long: ['오늘 할 일', '이번 주 할 일', '전체 할 일', '완료한 할 일'],
  },
};
// 글이 길어 두 줄이 되는 나쁜 예 — 프리셋 정렬(많이 쓴 순 · 최근 사용 · 이름순)을 문장으로
export const PRESET_SORT_LONG: SegItem[] = [
  { value: 'used', label: '사용 횟수가 많은 순' },
  { value: 'recent', label: '최근에 사용한 순' },
  { value: 'name', label: '이름 가나다순' },
];
export const ASSET_RANGE: SegItem[] = [
  { value: '3m', label: '3개월' },
  { value: '6m', label: '6개월' },
  { value: '1y', label: '1년' },
];
// 토스 발견 — 지금 한 화면에 셋 쌓인 자리(앱 적용 때 나눈다)
export const RANKING: SegItem[] = [
  { value: 'rise', label: '급상승' },
  { value: 'fall', label: '급하락' },
  { value: 'volume', label: '거래량' },
];

// 할 일 — 오늘 2026. 10. 1. (목), 이번 주는 10. 4. (일)까지
export type Todo = { title: string; due: string; when: 'today' | 'week' | 'later'; done: boolean };
export const TODOS: Todo[] = [
  { title: '카드 대금 확인', due: '오늘', when: 'today', done: false },
  { title: '관리비 이체', due: '오늘', when: 'today', done: false },
  { title: '장보기', due: '10월 3일 (토)', when: 'week', done: false },
  { title: '운동 등록', due: '10월 8일 (목)', when: 'later', done: false },
  { title: '통신비 납부', due: '9월 30일 (수)', when: 'today', done: true },
  { title: '병원 예약', due: '9월 29일 (화)', when: 'week', done: true },
];
export const todoFilter = (view: string) => (t: Todo) => (view === 'done' ? t.done : !t.done && (view === 'all' || (view === 'week' ? t.when !== 'later' : t.when === 'today')));

// 가계부 — 10월 1일 (목)
export type Tx = { title: string; sub: string; amount: string; hue: 'orange' | 'brown' | 'blue' | 'green' | 'violet'; type: 'expense' | 'income' };
export const TXS: Tx[] = [
  { title: '점심 식사', sub: '식비 · 현대카드 신용카드', amount: '−12,000원', hue: 'orange', type: 'expense' },
  { title: '급여', sub: '수입 · 국민은행', amount: '+3,200,000원', hue: 'green', type: 'income' },
  { title: '다라커피', sub: '카페 · 현대카드 신용카드', amount: '−5,600원', hue: 'brown', type: 'expense' },
  { title: '지하철', sub: '교통 · 국민 체크카드', amount: '−1,450원', hue: 'blue', type: 'expense' },
  { title: '중고 거래', sub: '수입 · 토스뱅크 통장', amount: '+25,000원', hue: 'green', type: 'income' },
];

// 증권 보유 — 시장
export type Holding = { name: string; sub: string; amount: string; market: 'domestic' | 'us' };
export const HOLDINGS: Holding[] = [
  { name: '가람전자', sub: '10주', amount: '712,000원', market: 'domestic' },
  { name: '나래반도체', sub: '3주', amount: '621,000원', market: 'domestic' },
  { name: '파인테크', sub: '5주', amount: '1,234,000원', market: 'us' },
  { name: '볼트모터스', sub: '2주', amount: '1,102,000원', market: 'us' },
];
