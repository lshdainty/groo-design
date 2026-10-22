// 펼치고 접기 · 나누기 묶음 그림의 내용 — 지어낸 것이다(실제 사용자 · 조직 자료가 아니다).
// 가장 나쁜 값을 일부러 넣는다 — 줄을 바꾸는 28자 혜택 제목 · 7줄 상세 · 84자 유의사항 제목 · 248 패널의 긴 부서 이름 ·
// −123,456,789원 · 거래 40줄. 서버 그림 · 브라우저 그림이 함께 쓴다(파일 읽기 없음).

// ── 카드 혜택 · 유의사항(Desk 카드 상세) ──────────────────────
export const LONG_DETAIL = [
  '■ 할인 대상: 네이버페이 · 카카오페이 · 토스페이 · 페이코 · SSG페이에서 이 카드로 결제한 온라인 가맹점 이용금액',
  '■ 할인율: 이용금액의 10% 결제일 할인(건당 이용금액 1만 원 이상)',
  '■ 월 할인 한도: 전월 이용실적 30만 원 이상 50만 원 미만 5천 원 / 50만 원 이상 100만 원 미만 1만 원 / 100만 원 이상 2만 원',
  '■ 유의사항: 간편결제 내 충전 · 송금 · 상품권 구매 · 대학 등록금 · 아파트 관리비 · 국세 · 지방세 납부는 할인 대상에서 빠져요.',
  '■ 해외 가맹점 이용분, 무이자 할부 · 부분 무이자 할부 이용분은 할인과 실적 모두에서 빠져요.',
  '■ 할인 받은 이용금액은 다음 달 전월 실적에 들어가요. 다만 할인 금액만큼은 실적에서 빠져요.',
  '■ 결제일 할인은 결제일에 청구 금액에서 빠지고, 카드를 해지하면 남은 할인은 사라져요.',
].join('\n');

export type Benefit = { id: string; title: string; summary: string; detail: string | null };
// 열둘 — 첫 제목이 28자(줄을 바꾼다), 대중교통 · 편의점은 상세가 없다(그냥 줄)
export const BENEFITS: Benefit[] = [
  { id: 'pay', title: '온라인 간편결제 · 배달앱 · 해외 직구 통합 할인', summary: '네이버페이 · 카카오페이 · 토스페이 결제 시 이용금액의 10% 결제일 할인(월 최대 2만 원)', detail: LONG_DETAIL },
  { id: 'coffee', title: '커피', summary: '골목커피 · 숲속다방 · 달빛로스터리 50% 할인', detail: '■ 할인 대상: 골목커피 · 숲속다방 · 달빛로스터리 커피 매장 이용금액\n■ 월 2회 · 회당 최대 5천 원' },
  { id: 'transit', title: '대중교통', summary: '버스 · 지하철 10% 청구할인', detail: null },
  { id: 'telecom', title: '통신', summary: 'SKT · KT · LG U+ 자동이체 5천 원 할인', detail: '■ 통신요금을 이 카드로 자동이체할 때\n■ 전월 실적 30만 원 이상' },
  { id: 'store', title: '편의점', summary: 'GS25 · CU · 세븐일레븐 5% 할인', detail: null },
  { id: 'movie', title: '영화', summary: 'CGV · 롯데시네마 · 메가박스 4천 원 할인', detail: '■ 온라인 예매 포함 · 월 1회' },
  { id: 'fuel', title: '주유', summary: 'GS칼텍스 · SK에너지 리터당 60원 할인', detail: '■ 주유소 이용 시 · 월 최대 6천 원\n■ 셀프 주유소 포함' },
  { id: 'abroad', title: '해외', summary: '해외 이용금액 1.5% 적립 · 해외 결제 수수료 면제', detail: '■ 해외 가맹점(온 · 오프라인) 이용금액\n■ 수수료 면제는 브랜드 수수료 제외' },
  { id: 'shop', title: '쇼핑', summary: '쿠팡 · 11번가 · G마켓 7% 할인', detail: '■ 건당 2만 원 이상 · 월 최대 1만 원' },
  { id: 'clinic', title: '병원 · 약국', summary: '병원 · 약국 5% 할인', detail: '■ 월 최대 5천 원' },
  { id: 'sub', title: '구독', summary: '넷플릭스 · 유튜브 프리미엄 · 멜론 30% 할인', detail: '■ 정기결제 이용금액 · 월 최대 5천 원' },
  { id: 'lounge', title: '공항 라운지', summary: '국내외 공항 라운지 연 2회 무료', detail: '■ 본인만 · 동반자 제외\n■ 전월 실적 50만 원 이상' },
];
export const hasDetail = (b: { detail: string | null }) => !!b.detail;

export type Caution = { id: string; title: string; detail: string | null };
// 다섯 — 첫 제목이 84자, 셋째는 상세가 없다
export const CAUTIONS: Caution[] = [
  {
    id: 'c1',
    title: '전월 이용실적에서 제외되는 이용금액: 상품권 · 선불카드 구매 및 충전, 국세 · 지방세 · 공과금, 아파트 관리비, 대학 등록금, 무이자 할부 이용분',
    detail: '■ 위 이용금액은 전월 실적 산정에서 빠져요.\n■ 할인 받은 이용금액도 할인 금액만큼 실적에서 빠져요.',
  },
  { id: 'c2', title: '연회비 · 카드 발급 후 첫 달 실적 기준', detail: '■ 발급 후 첫 달은 실적 조건 없이 혜택을 받을 수 있어요.' },
  { id: 'c3', title: '할인 한도는 서비스별로 따로 적용돼요', detail: null },
  { id: 'c4', title: '혜택 변경 안내', detail: '■ 카드사 사정에 따라 혜택이 바뀔 수 있어요. 바뀌면 6개월 전에 알려요.' },
  { id: 'c5', title: '해외 원화결제(DCC) 이용 시 별도 수수료가 붙어요', detail: '■ 해외에서 원화로 결제하면 3 ~ 8% 수수료가 더해져요.' },
];

// 카드 요약 — 발급사는 실제, 상품 이름은 지어낸 것(데이터 표시 그림과 같은 방식)
export const CARD = { issuer: '신한카드', name: '데일리 플러스 Platinum+ 온라인 간편결제 특화형', fee: '15,000원', performance: '300,000원 이상' };

// ── HR 부서 나무(HR 관리 > 회사) — 20개(부모 3 · 잎 17) ─────────
export type DeptNode = { id: string; label: string; children?: DeptNode[] };
// 가장 긴 뿌리 이름 — 부서 패널(본문 × 목록 폭 25%, collapse-look deptPanelW)에서 줄을 바꾼다. 한글이라 영문 섞인 이름보다 넓다
export const DEPT_ROOT = '가람누리 디지털혁신본부 클라우드 플랫폼 운영 그룹';
export const DEPTS: DeptNode[] = [
  {
    id: 'root',
    label: DEPT_ROOT,
    children: [
      {
        id: 'infra',
        label: '클라우드 인프라팀',
        children: [
          { id: 'k8s', label: '쿠버네티스 운영 파트' },
          { id: 'net', label: '네트워크 · 보안 파트(야간 당직 포함)' },
        ],
      },
      {
        id: 'data',
        label: '데이터 플랫폼팀',
        children: [
          { id: 'eng', label: '데이터 엔지니어링 파트' },
          { id: 'ana', label: '분석 파트' },
        ],
      },
      { id: 'ops', label: '경영지원팀' },
      ...Array.from({ length: 12 }, (_, i) => ({ id: `p${i + 1}`, label: `프로젝트 ${i + 1}팀` })),
    ],
  },
];
// 부모 id(모두 펼친 채 연다 — 지금과 같다)
export const deptParents = (nodes: DeptNode[] = DEPTS): string[] => nodes.flatMap((n) => (n.children?.length ? [n.id, ...deptParents(n.children)] : []));
export const deptCount = (nodes: DeptNode[] = DEPTS): number => nodes.reduce((s, n) => s + 1 + deptCount(n.children ?? []), 0);
export function deptFind(id: string, nodes: DeptNode[] = DEPTS): DeptNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const f = n.children && deptFind(id, n.children);
    if (f) return f;
  }
  return undefined;
}

// ── 거래 상세 — 1억 넘는 거래를 6건으로 나눈 내역 ────────────────
export type Split = { title: string; category: string; amount: number; hue: string };
export const SPLITS: Split[] = [
  { title: '전세 보증금 잔금(계약금 · 중도금 제외)', category: '주거 · 월세', amount: 100000000, hue: 'indigo' },
  { title: '관리비', category: '주거 · 관리비', amount: 12000000, hue: 'indigo' },
  { title: '휴대폰 · 인터넷 · TV', category: '통신', amount: 456789, hue: 'indigo' },
  { title: '배달 · 포장 · 테이크아웃 주문', category: '식비', amount: 1000000, hue: 'orange' },
  { title: '택시', category: '교통', amount: 5000000, hue: 'blue' },
  { title: '사료 · 간식', category: '반려동물', amount: 5000000, hue: 'green' },
];
export const SPLIT_TOTAL = SPLITS.reduce((s, x) => s + x.amount, 0);
// 분할 합계가 모자랄 때(경고 상자)
export const SHORTFALL = 3456789;
export const QUICK_FIXES = ['첫 내역에 모자란 금액 더하기', '모자란 금액을 새 내역으로', '남은 금액을 내역마다 똑같이 나누기'];

// ── HR 업무 보고 — 상세 검색 조건 ─────────────────────────────
export const FILTER_FIELDS: [string, string][] = [
  ['기간', '2026. 10. 1. ~ 2026. 10. 31.'],
  ['작성자', '김민수 · 이서연'],
  ['프로젝트', '전체'],
  ['상태', '전체'],
];

// ── 가계부 원장 — 거래 40줄(10월 8일부터 하루 4줄씩, 첫 줄은 1억 넘는 이체) ──
export type LedgerTx = { title: string; sub: string; amount: number; hue: string };
export type LedgerDay = { label: string; rows: LedgerTx[] };
const POOL: [string, string, number, string][] = [
  ['김밥천국 강남점', '식비 · 삼성카드 taptap O', 9500, 'orange'],
  ['파리바게뜨', '카페 · 간식 · 토스 체크카드', 4800, 'brown'],
  ['티머니', '교통 · 토스 체크카드', 1450, 'blue'],
  ['무신사', '쇼핑 · 삼성카드 taptap O', 58900, 'pink'],
  ['골목커피 역삼점', '카페 · 간식 · 현대카드 M', 6300, 'brown'],
  ['GS25 역삼점', '식비 · 토스 체크카드', 3200, 'orange'],
  ['쿠팡', '쇼핑 · 현대카드 M', 27400, 'pink'],
  ['배달의민족', '식비 · 삼성카드 taptap O', 23900, 'orange'],
  ['카카오T 택시', '교통 · 현대카드 M', 12800, 'blue'],
  ['올리브영 강남역점', '쇼핑 · 토스 체크카드', 18700, 'pink'],
  ['이마트 역삼점', '식비 · 현대카드 M', 64200, 'orange'],
  ['넷플릭스', '문화생활 · 삼성카드 taptap O', 17000, 'violet'],
];
const DOW = ['월', '화', '수', '목', '금', '토', '일'];
export const LEDGER40: LedgerDay[] = (() => {
  const days: LedgerDay[] = [];
  let k = 0;
  for (let d = 0; d < 10; d++) {
    const day = 8 - d;
    const [mon, dd] = day >= 1 ? [10, day] : [9, 30 + day];
    // 2026-10-08 은 목요일
    const dow = DOW[(((3 - d) % 7) + 7) % 7];
    const rows: LedgerTx[] = [];
    for (let j = 0; j < 4; j++) {
      if (d === 0 && j === 0) rows.push({ title: '(주)한빛공인중개사사무소 · 한빛이사 · 깨끗한청소', sub: '주거 · 계좌이체 · 10:00', amount: -123456789, hue: 'indigo' });
      else {
        const [t, s, a, hue] = POOL[k % POOL.length];
        rows.push({ title: t, sub: `${s} · ${String(19 - j * 3).padStart(2, '0')}:${String((k * 7) % 60).padStart(2, '0')}`, amount: -(a + (k % 5) * 100), hue });
        k++;
      }
    }
    days.push({ label: `${mon}월 ${dd}일 (${dow})${d === 0 ? ' · 오늘' : ''}`, rows });
  }
  return days;
})();
export const LEDGER_TOTAL = LEDGER40.reduce((s, d) => s + d.rows.reduce((t, r) => t + r.amount, 0), 0);
export const dayTotal = (d: LedgerDay) => d.rows.reduce((t, r) => t + r.amount, 0);

// ── 지출 카테고리(설정 > 카테고리) — 부모 · 하위 두 단계 ─────────
export type CatIcon = 'utensils' | 'house' | 'bus' | 'paw' | 'shopping-bag' | 'ticket' | 'stethoscope' | 'gift' | 'tag' | 'wallet' | 'coins';
export type Category = { id: string; name: string; icon: CatIcon; hue: string; kind: '지출' | '수입'; children: string[] };
export const CATEGORIES: Category[] = [
  { id: 'food', name: '식비 · 외식 · 배달음식', icon: 'utensils', hue: 'orange', kind: '지출', children: ['배달 · 포장 주문 음식', '장보기 · 마트 · 시장', '회식 · 모임 식비', '카페 · 디저트 · 간식', '점심 · 구내식당 식비', '편의점 · 간편식 · 야식'] },
  { id: 'home', name: '주거 · 통신비 · 관리비', icon: 'house', hue: 'indigo', kind: '지출', children: ['월세 · 전세 대출 이자', '아파트 관리비 · 수도', '휴대폰 · 인터넷 · TV', '전기 · 가스 요금', '가전 · 가구 수리비'] },
  { id: 'move', name: '교통 · 자동차 · 주유비', icon: 'bus', hue: 'blue', kind: '지출', children: ['대중교통 · 지하철', '택시 · 대리운전', '주유 · 충전 · 세차', '주차 · 통행료 · 과태료'] },
  { id: 'pet', name: '반려동물 병원비 · 사료', icon: 'paw', hue: 'green', kind: '지출', children: ['동물병원 진료 · 예방접종', '사료 · 간식 · 모래', '미용 · 호텔 · 용품'] },
  { id: 'shop', name: '쇼핑', icon: 'shopping-bag', hue: 'pink', kind: '지출', children: ['의류 · 신발 · 잡화', '생활용품 · 소모품'] },
  { id: 'fun', name: '문화생활 · 여가 · 여행', icon: 'ticket', hue: 'violet', kind: '지출', children: ['영화 · 공연 · 전시', '도서 · 전자책 구독', 'OTT · 음악 구독료', '국내 여행 숙박 · 교통', '해외여행 항공권 · 숙소', '운동 · 헬스 · 레슨비'] },
  { id: 'health', name: '의료 · 건강 · 보험료', icon: 'stethoscope', hue: 'red', kind: '지출', children: ['병원 · 약국 · 건강검진'] },
  { id: 'gift', name: '경조사 · 선물 · 기부금', icon: 'gift', hue: 'brown', kind: '지출', children: ['결혼 · 장례 경조금', '명절 · 생일 선물', '기부 · 후원'] },
  { id: 'etc', name: '기타', icon: 'tag', hue: 'gray', kind: '지출', children: [] },
];

// ── HR 사내 규정 카드(데스크톱 4열) — 한국어 · 영어 ─────────────
export type RuleCard = { title: string; body: string };
export const RULES: Record<'ko' | 'en', { section: string; cards: RuleCard[] }[]> = {
  ko: [
    {
      section: '휴가',
      cards: [
        { title: '휴가 일수', body: '휴가는 1년에 총 15일이 주어지고, 1시간 단위로 나눠서 자유롭게 쓸 수 있어요.' },
        { title: '지급 시기', body: '분기마다 나눠서 주어지고 쌓이지만, 그해 안에 모두 써야 해요. 다음 해로 넘어가지 않으니 연말 전에 남은 휴가를 확인해주세요.' },
        { title: '경조 휴가', body: '결혼 · 출산처럼 기쁠 때나 가족을 잃는 슬플 때 경조 휴가가 주어져요. 날수는 관계와 일에 따라 달라요.' },
        { title: '기타 휴가', body: '건강검진 · 예비군 · 민방위 대상자는 그날 유급 휴가예요. 신청할 때 통지서를 함께 올려주세요.' },
      ],
    },
    {
      section: '교육 · 연장 근무',
      cards: [
        { title: '자기 계발', body: '일이 없을 때는 휴대폰을 잠시 내려두고 책을 읽거나 공부해 보세요.' },
        { title: '외부 교육', body: '외부 컨퍼런스에 다녀와 새 흐름을 익혀 보세요. 한 해 2번, 한 번에 3일 안이면 출근으로 인정돼요. 다녀온 뒤에는 배운 것을 팀에 짧게 나눠주세요.' },
        { title: '연장 근무', body: '운영 환경 특성상 야간 · 주말 작업이 생길 수 있어요.' },
        { title: '추가 휴가', body: '야간 · 주말 초과 근무에는 휴가가 더 주어져요. 기다린 시간은 빼고 1시간 단위로 셈해요.' },
      ],
    },
  ],
  en: [
    {
      section: 'Leave',
      cards: [
        { title: 'Annual leave', body: 'You get 15 days a year and can use them freely in one-hour units.' },
        { title: 'When it is granted', body: 'Leave is granted every quarter and accumulates, but it must all be used within the same year. It does not carry over, so check what is left before the year ends.' },
        { title: 'Family events', body: 'Special leave is given for happy occasions such as a wedding or birth, and for sad ones such as a loss in the family. The number of days depends on the event.' },
        { title: 'Other leave', body: 'Health checkups and reserve forces or civil defense training are paid leave. Attach the notice when you apply.' },
      ],
    },
    {
      section: 'Training · Overtime',
      cards: [
        { title: 'Self development', body: 'When there is no work at hand, put your phone down and read or study.' },
        { title: 'External training', body: 'Attend outside conferences to keep up with new trends. Up to twice a year, three days or fewer each time, counts as work. Share a short summary with your team afterwards.' },
        { title: 'Overtime', body: 'Night and weekend work may happen because of how our services run.' },
        { title: 'Extra leave', body: 'Night and weekend overtime earns extra leave, counted in one-hour units excluding waiting time.' },
      ],
    },
  ],
};

// ── HR 대시보드 위젯(편집 모드) · 나눈 자리의 본문 폭 ───────────
// 1280 화면의 본문 — 사이드바 240 · 여백 24 × 2 를 뺀 992(resizable.md)
export const BODY_W = 992;
export type Widget = { id: string; title: string; cols: number; rows: number; body?: string };
export const WIDGETS: Widget[] = [
  { id: 'leave', title: '내 휴가', cols: 6, rows: 3, body: '남은 연차 11.5일 · 이번 달 사용 2일' },
  { id: 'team', title: '팀 일정', cols: 6, rows: 3, body: '10월 12일 (월) 클라우드 인프라 점검 외 3건' },
  { id: 'notice', title: '공지사항', cols: 12, rows: 2, body: '10월 연말정산 서류 제출 안내' },
];

// HR 달력 일 보기 — 한 시간 한 줄의 높이(그림 속 화면의 값)
export const HOUR_H = 48;

// HR 휴가 정책(휴가 신청 대화상자 · 시트 안 스크롤 상자) — 초점 가는 것이 없는 글 상자
export const VACATION_POLICY = [
  '■ 연차는 1년에 15일이 주어지고 1시간 단위로 나눠 쓸 수 있어요.',
  '■ 분기마다 나눠 주어지고 쌓이지만, 그해 안에 모두 써야 해요. 다음 해로 넘어가지 않아요.',
  '■ 신청은 쓰는 날 3일 전까지 해주세요. 급한 일이면 팀장 승인 뒤 당일에도 쓸 수 있어요.',
  '■ 반차는 오전 9시 ~ 오후 1시 · 오후 2시 ~ 6시로 나뉘어요.',
  '■ 경조 휴가는 결혼 5일 · 출산 10일 · 가족상 3 ~ 5일이고 증빙을 올려주세요.',
  '■ 건강검진 · 예비군 · 민방위는 그날 유급 휴가예요. 통지서를 함께 올려주세요.',
  '■ 승인된 휴가를 취소하려면 쓰는 날 전날까지 신청을 거둬주세요.',
].join('\n');
