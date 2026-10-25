// 데이터 표시 묶음 그림의 화면 데이터 — 서버 그림(data-screens · 페이지 그림)과 브라우저 미리보기(data-*-view · 플레이그라운드)가 함께 쓴다.
// 파일 읽기(서버 전용)를 들이지 않는다. 글은 Writing v106(해요체 · 문장은 마침표), 돈은 원까지 · 빼기는 U+2212(International Design).
// 지어낸 내용이다 — 사람 · 금액 · 기관은 그림을 위한 것.
import type { ChartHue, ColorItem, DeltaDir, SwipeKind } from './data-shared';

// ── 표 — HR 사용자 ───────────────────────────────────────
export type BadgeTone = 'positive' | 'warning' | 'neutral' | 'critical' | 'informative';
export type HrUser = { id: string; name: string; email: string; dept: string; title: string; days: number; status: string; tone: BadgeTone; joined: string };
export const HR_USERS: HrUser[] = [
  { id: 'u1', name: '김하늘', email: 'haneul.kim', dept: '개발팀', title: '팀원', days: 12.5, status: '재직', tone: 'positive', joined: '2023. 3. 2.' },
  { id: 'u2', name: '이도윤', email: 'doyun.lee', dept: '디자인팀', title: '팀장', days: 3, status: '휴직', tone: 'warning', joined: '2021. 7. 19.' },
  { id: 'u3', name: '박서연', email: 'seoyeon.park', dept: '인사팀', title: '팀원', days: 0.5, status: '재직', tone: 'positive', joined: '2024. 1. 8.' },
  { id: 'u4', name: '최민준', email: 'minjun.choi', dept: '영업팀', title: '팀원', days: 15, status: '재직', tone: 'positive', joined: '2020. 11. 30.' },
  { id: 'u5', name: '정예린', email: 'yerin.jung', dept: '개발팀', title: '팀원', days: 7, status: '초대 대기', tone: 'neutral', joined: '2026. 10. 6.' },
  { id: 'u6', name: '한지우', email: 'jiwoo.han', dept: '재무팀', title: '팀장', days: 9.5, status: '재직', tone: 'positive', joined: '2022. 5. 16.' },
  { id: 'u7', name: '오태윤', email: 'taeyun.oh', dept: '마케팅팀', title: '팀원', days: 11, status: '재직', tone: 'positive', joined: '2023. 9. 4.' },
  { id: 'u8', name: '윤서아', email: 'seoa.yoon', dept: '디자인팀', title: '팀원', days: 4.5, status: '재직', tone: 'positive', joined: '2025. 2. 3.' },
  { id: 'u9', name: '장민호', email: 'minho.jang', dept: '개발팀', title: '팀원', days: 13, status: '재직', tone: 'positive', joined: '2021. 4. 12.' },
  { id: 'u10', name: '서하은', email: 'haeun.seo', dept: '인사팀', title: '팀장', days: 6, status: '재직', tone: 'positive', joined: '2019. 8. 26.' },
  { id: 'u11', name: '문재희', email: 'jaehee.moon', dept: '영업팀', title: '팀원', days: 2, status: '휴직', tone: 'warning', joined: '2022. 12. 1.' },
  { id: 'u12', name: '배수빈', email: 'subin.bae', dept: '재무팀', title: '팀원', days: 8.5, status: '재직', tone: 'positive', joined: '2024. 6. 17.' },
];
// 남은 휴가 — 단위는 칸에("12.5일")
export const days = (n: number) => `${n.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}일`;

// ── 표 — HR 업무 보고(고르기 · 일괄 작업) ───────────────────
export type Report = { id: string; title: string; author: string; date: string; hours: number; status: string; tone: BadgeTone };
export const REPORTS: Report[] = [
  { id: 'r1', title: '10월 1주 주간 보고', author: '김하늘', date: '2026. 10. 5.', hours: 38, status: '제출', tone: 'informative' },
  { id: 'r2', title: '결제 화면 개편 회고', author: '이도윤', date: '2026. 10. 2.', hours: 12, status: '제출', tone: 'informative' },
  { id: 'r3', title: '9월 4주 주간 보고', author: '박서연', date: '2026. 9. 28.', hours: 40, status: '승인', tone: 'positive' },
  { id: 'r4', title: '채용 면접 정리', author: '최민준', date: '2026. 9. 25.', hours: 6.5, status: '반려', tone: 'critical' },
  { id: 'r5', title: '9월 3주 주간 보고', author: '한지우', date: '2026. 9. 21.', hours: 39, status: '승인', tone: 'positive' },
];
export const hours = (n: number) => `${n.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}시간`;

// ── 표 — 일별 시세(div 격자를 table 로) ─────────────────────
// 등락률은 ▲ · ▼ + 값(증감 표기 — 부호를 겹쳐 쓰지 않는다)
export type Quote = { date: string; close: number; dir: DeltaDir; rate: string; volume: number };
export const QUOTES: Quote[] = [
  { date: '10. 8.', close: 71200, dir: 'up', rate: '1.28%', volume: 12480310 },
  { date: '10. 7.', close: 70300, dir: 'down', rate: '0.85%', volume: 9812004 },
  { date: '10. 6.', close: 70900, dir: 'up', rate: '2.16%', volume: 15230998 },
  { date: '10. 2.', close: 69400, dir: 'flat', rate: '0.00%', volume: 7604215 },
  { date: '10. 1.', close: 69400, dir: 'down', rate: '1.00%', volume: 8233417 },
];

// ── 카드 — Desk 홈 ──────────────────────────────────────
export const NET_WORTH = { label: '순자산', amount: 42898100, delta: { direction: 'up' as DeltaDir, value: '1.8%', text: '지난달보다' } };
export type Stat = { label: string; amount: number; delta: { direction: DeltaDir; value: string; text: string; srText?: string } };
export const STATS: Stat[] = [
  { label: '이번 달 지출', amount: 1240000, delta: { direction: 'up', value: '12%', text: '지난달보다', srText: '지난달보다 12% 더 썼어요' } },
  { label: '이번 달 수입', amount: 4200000, delta: { direction: 'down', value: '3%', text: '지난달보다', srText: '지난달보다 3% 줄었어요' } },
  { label: '남은 예산', amount: 260000, delta: { direction: 'flat', value: '', text: '지난달보다' } },
  { label: '순자산', amount: 42898100, delta: { direction: 'up', value: '1.8%', text: '지난달보다', srText: '지난달보다 1.8% 늘었어요' } },
];
// 오늘 쓴 돈 — List 줄(앞 타일 · 제목 · 설명 · 금액)
export type Spend = { title: string; detail: string; amount: number; tile: string; icon: 'coffee' | 'bus' | 'shopping-bag' | 'utensils' | 'receipt' | 'star' };
export const TODAY: Spend[] = [
  { title: '스타벅스 강남점', detail: '식비 · 국민카드', amount: -6500, tile: 'orange', icon: 'coffee' },
  { title: '지하철', detail: '교통 · 국민카드', amount: -1450, tile: 'blue', icon: 'bus' },
  { title: '이마트 성수점', detail: '생활 · 신한카드', amount: -42300, tile: 'green', icon: 'shopping-bag' },
];
export const BUDGET = { name: '10월 식비', used: 384400, limit: 500000 };

// ── 차트 — 10월 수입 · 지출(오늘 8일에서 끝난다) ──────────────
// 날마다의 값 — 수입은 월급날(1일)이 크고, 지출은 하루 40만 아래(이중 축 0 ~ 400만 · 0 ~ 40만)
export const TREND_YEAR = 2026;
export const TREND_MONTH = 10;
export const TODAY_DAY = 8;
export const MONTH_DAYS = 31;
export type TrendDay = { day: number; income: number; expense: number };
export const TREND: TrendDay[] = [
  { day: 1, income: 3800000, expense: 152300 },
  { day: 2, income: 0, expense: 98400 },
  { day: 3, income: 0, expense: 286000 },
  { day: 4, income: 0, expense: 131500 },
  { day: 5, income: 280000, expense: 74200 },
  { day: 6, income: 0, expense: 352000 },
  { day: 7, income: 0, expense: 59200 },
  { day: 8, income: 120000, expense: 86400 },
];
export const TREND_TOTAL = { income: TREND.reduce((s, d) => s + d.income, 0), expense: TREND.reduce((s, d) => s + d.expense, 0) };
// 월별 합(막대) — 5월 ~ 10월(10월은 오늘까지)
export const MONTHLY: { label: string; income: number; expense: number }[] = [
  { label: '5월', income: 3600000, expense: 1320000 },
  { label: '6월', income: 3900000, expense: 1410000 },
  { label: '7월', income: 4100000, expense: 1360000 },
  { label: '8월', income: 3800000, expense: 1290000 },
  { label: '9월', income: 4250000, expense: 1380000 },
  { label: '10월', income: 4200000, expense: 1240000 },
];

// 카테고리 — 저장된 색이 있는 것(식비 · 교통 · 쇼핑 · 경조사 · 주거 · 생활)과 없는 것(구독 · 의료 · 반려동물 …). 상위 9 + 기타
export const CATEGORIES: ColorItem[] = [
  { key: 'food', label: '식비', amount: 384400, saved: 'blue' },
  { key: 'transport', label: '교통', amount: 173600, saved: 'green' },
  { key: 'shopping', label: '쇼핑', amount: 148800, saved: 'orange' },
  { key: 'events', label: '경조사', amount: 124000, saved: 'red' },
  { key: 'housing', label: '주거', amount: 111600, saved: 'violet' },
  { key: 'living', label: '생활', amount: 99200, saved: 'pink' },
  { key: 'subscription', label: '구독', amount: 74400 },
  { key: 'medical', label: '의료', amount: 49600 },
  { key: 'pet', label: '반려동물', amount: 22200 },
  { key: 'book', label: '도서', amount: 9800 },
  { key: 'gift', label: '선물', amount: 7900 },
  { key: 'beauty', label: '미용', amount: 34500 },
];
// 하위 카테고리가 있는 줄 — 누르면 하위 도넛으로
export const HAS_CHILDREN = new Set(['food', 'shopping', 'living']);

// 열지도 — 요일 × 시간대 지출(점심 · 저녁 … 4줄). 가장 큰 칸 240,000원(토 저녁)
export const HEAT_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
export const HEAT_DAYS_FULL = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
export type HeatRow = { key: string; label: string; sub: string; values: number[] };
export const HEAT_ROWS: HeatRow[] = [
  { key: 'morning', label: '아침', sub: '06~10시', values: [4500, 0, 5200, 3800, 12000, 0, 8000] },
  { key: 'lunch', label: '점심', sub: '10~14시', values: [9000, 21500, 8500, 11000, 64000, 23000, 0] },
  { key: 'afternoon', label: '오후', sub: '14~18시', values: [0, 6800, 15000, 0, 32000, 128000, 54000] },
  { key: 'evening', label: '저녁', sub: '18~22시', values: [54000, 12500, 35000, 96000, 187000, 240000, 61000] },
];

// 색 배정 그림 — 저장된 빨강(경조사) · 색 없는 구독 · 의료
export const PALETTE_DEMO: ColorItem[] = CATEGORIES.slice(0, 8);
export const HUE_KO: Record<ChartHue, string> = { blue: '파랑', green: '초록', orange: '주황', violet: '보라', pink: '분홍', indigo: '남색', red: '빨강', yellow: '노랑', brown: '갈색', gray: '회색' };

// ── 검색해서 고르기 — 은행(기관 색 표의 분류 차례) ───────────
export const BANK_GROUPS: { label: string; items: string[] }[] = [
  { label: '시중은행', items: ['신한', 'KB국민', '우리', '하나', 'NH농협', 'IBK기업', 'SC제일', '씨티'] },
  { label: '인터넷은행', items: ['카카오뱅크', '토스뱅크', '케이뱅크'] },
  { label: '지방은행', items: ['부산', '대구', '경남', '광주', '전북', '제주'] },
  { label: '특수은행', items: ['KDB산업', '수출입', '수협'] },
  { label: '저축기관', items: ['우체국', '새마을금고', '신협', '산림조합', 'SBI저축', 'OK저축'] },
  { label: '외국계', items: ['HSBC', 'ICBC', 'BoA', '도이치', 'JP모건'] },
  { label: '기타', items: ['현금'] },
];
// 증권사 — 투자 추가의 "기관 고르기"
export const BROKER_GROUPS: { label: string; items: string[] }[] = [
  { label: '증권사', items: ['삼성증권', '미래에셋', 'NH투자', '한국투자', 'KB증권', '신한투자', '키움증권', '토스증권'] },
  { label: '가상자산거래소', items: ['업비트', '빗썸', '코인원', '코빗'] },
];
// 카드 상품 — 서버 검색(300ms)
export type CardProduct = { id: string; name: string; issuer: string; kind: string; pic: 'card-h' | 'card-v' | 'card-h2' | null; discontinued?: boolean };
export const CARD_PRODUCTS: CardProduct[] = [
  { id: 'c1', name: '데일리 플러스', issuer: '신한카드', kind: '신용', pic: 'card-h' },
  { id: 'c2', name: '트래블로그', issuer: '하나카드', kind: '체크', pic: 'card-v' },
  { id: 'c3', name: '톡톡 With', issuer: 'KB국민카드', kind: '신용', pic: null },
  { id: 'c4', name: 'NH올원 Pay', issuer: 'NH농협카드', kind: '체크', pic: null },
  { id: 'c5', name: 'M 에디션', issuer: '현대카드', kind: '신용', pic: 'card-h2', discontinued: true },
  { id: 'c6', name: '탭탭 오', issuer: '삼성카드', kind: '신용', pic: null },
  { id: 'c7', name: '카드의정석', issuer: '우리카드', kind: '신용', pic: null },
  { id: 'c8', name: 'LOCA 365', issuer: '롯데카드', kind: '신용', pic: null },
];
// 사람 — HR 결재자 · 참조자(Avatar 줄)
export type PersonItem = { value: string; name: string; team: string };
export const APPROVERS: PersonItem[] = [
  { value: 'pore', name: '김포레', team: '디자인팀 · 팀장' },
  { value: 'haneul', name: '김하늘', team: '개발팀' },
  { value: 'minjun', name: '김민준', team: '인사팀' },
  { value: 'seoyeon', name: '김서연', team: '디자인팀' },
  { value: 'jiwoo', name: '이지우', team: '개발팀' },
  { value: 'doyun', name: '박도윤', team: '재무팀' },
  { value: 'yuna', name: '최유나', team: '인사팀 · 팀장' },
  { value: 'siwoo', name: '정시우', team: '영업팀' },
];

// ── 줄 밀기 — 가계부 거래 · 동작 ──────────────────────────
export type TxRow = { id: string; title: string; detail: string; amount: number; tile: string; icon: 'coffee' | 'bus' | 'shopping-bag' | 'utensils' | 'receipt' | 'star' | 'wallet' };
export const LEDGER: TxRow[] = [
  { id: 't1', title: '스타벅스 강남점', detail: '카페 · 오후 2:10', amount: -5600, tile: 'brown', icon: 'coffee' },
  { id: 't2', title: '점심 식사', detail: '식비 · 오후 12:40', amount: -12000, tile: 'orange', icon: 'utensils' },
  { id: 't3', title: '지하철', detail: '교통 · 오전 8:52', amount: -1450, tile: 'blue', icon: 'bus' },
  { id: 't4', title: '이마트 성수점', detail: '생활 · 오전 11:05', amount: -42300, tile: 'green', icon: 'shopping-bag' },
  { id: 't5', title: '월급', detail: '수입 · 오전 9:00', amount: 3800000, tile: 'blue', icon: 'wallet' },
];
export type SwipeActionSpec = { value: string; kind: SwipeKind; label: string; icon: 'pin' | 'pencil' | 'trash' | 'archive' | 'share' };
// 뜻의 차례 — 그리는 쪽이 뒤집어 파괴적인 것이 가장 안쪽(왼쪽)에 온다
export const TX_ACTIONS: SwipeActionSpec[] = [
  { value: 'edit', kind: 'primary', label: '수정', icon: 'pencil' },
  { value: 'delete', kind: 'destructive', label: '삭제', icon: 'trash' },
];
export const MEMO_ACTIONS: SwipeActionSpec[] = [
  { value: 'pin', kind: 'neutral', label: '고정', icon: 'pin' },
  { value: 'edit', kind: 'primary', label: '수정', icon: 'pencil' },
  { value: 'delete', kind: 'destructive', label: '삭제', icon: 'trash' },
];
// 확인 창 — 상세에서 지울 때와 같은 문구(부르는 쪽이 넘긴다)
export const deleteConfirm = (title: string) => ({ title: '거래 삭제', description: `${title} 거래를 지울까요?` });
