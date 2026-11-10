// 화면 틀 · 이동 묶음의 그림 속 내용 — 탭 · 사이드바 항목 · 목록 줄(지어낸 내용이다). 서버 · 브라우저가 함께 쓴다.
import type { SideGroup, TabItem } from './nav-shared';

// Desk 하단 탭 바 — 어느 화면에서나 홈 · 가계부 · + · 캘린더 · 전체(가운데 + 는 탭이 아니라 그 화면의 추가)
export const DESK_TABS: TabItem[] = [
  { value: 'home', label: '홈', icon: 'house', href: '/desk' },
  { value: 'ledger', label: '가계부', icon: 'ledger', href: '/desk/ledger' },
  { value: 'calendar', label: '캘린더', icon: 'calendar', href: '/desk/calendar' },
  { value: 'more', label: '전체', icon: 'menu', href: '/desk/more' },
];
// + 의 이름 — 화면마다(캘린더는 일정 추가, 나머지는 거래 추가)
export const addLabelFor = (tab: string) => (tab === 'calendar' ? '일정 추가' : '거래 추가');
// 화면 제목 → 지금 탭(그림 속 폰이 제목만 줄 때)
export const tabForTitle = (title?: string) => (title === '가계부' || title === '자산' || title === '통계' || title === '예산' ? 'ledger' : title === '캘린더' ? 'calendar' : title === '전체' ? 'more' : 'home');
// 가계부 화면 위 Line Tabs(가계부 · 자산 · 통계 · 예산) — 탭 바 칸이 아니다
export const MONEY_TABS = [
  { value: 'ledger', label: '가계부' },
  { value: 'assets', label: '자산' },
  { value: 'stats', label: '통계' },
  { value: 'budget', label: '예산' },
];

// Desk 사이드바 — 워크스페이스 · 기록, 증권은 하위가 있는 부모(펼치기만)
export const DESK_NAV: SideGroup[] = [
  {
    label: '워크스페이스',
    items: [
      { value: 'home', label: '홈', icon: 'grid' },
      { value: 'assets', label: '자산', icon: 'wallet' },
      {
        value: 'stocks',
        label: '증권',
        icon: 'trend',
        children: [
          { value: 'namu', label: '나무증권' },
          { value: 'toss', label: '토스증권' },
        ],
      },
      { value: 'ledger', label: '가계부', icon: 'ledger' },
      { value: 'stats', label: '통계', icon: 'pie' },
      { value: 'budget', label: '예산', icon: 'target' },
    ],
  },
  {
    label: '기록',
    items: [
      { value: 'calendar', label: '캘린더', icon: 'calendar' },
      { value: 'todo', label: '할 일', icon: 'todo' },
      { value: 'dutch', label: '더치페이', icon: 'users' },
      { value: 'memo', label: '메모', icon: 'memo' },
      { value: 'benefit', label: '카드 혜택', icon: 'card' },
    ],
  },
];
// md 코드 예시와 같은 항목(ex-desk · ex-collapsed)
export const DESK_NAV_CODE: SideGroup[] = [
  {
    label: '워크스페이스',
    items: [
      { value: 'home', label: '홈', icon: 'grid' },
      { value: 'assets', label: '자산', icon: 'wallet' },
      {
        value: 'stocks',
        label: '증권',
        icon: 'trend',
        children: [
          { value: 'namu', label: '나무증권' },
          { value: 'toss', label: '토스증권' },
        ],
      },
      { value: 'ledger', label: '가계부', icon: 'ledger' },
    ],
  },
  { label: '기록', items: [{ value: 'calendar', label: '캘린더', icon: 'calendar' }] },
];
// HR 사이드바 — 근무 · 관리. 묶음 이름은 바뀌지 않는 짧은 명사(회사 이름이 아니다)
export const HR_NAV: SideGroup[] = [
  {
    label: '근무',
    items: [
      { value: 'home', label: '홈', icon: 'grid' },
      { value: 'calendar', label: '캘린더', icon: 'calendar' },
      { value: 'notice', label: '공지사항', icon: 'megaphone' },
      {
        value: 'leave',
        label: '휴가',
        icon: 'plane',
        children: [
          { value: 'leave-history', label: '휴가 현황' },
          { value: 'leave-apply', label: '휴가 신청' },
        ],
      },
      { value: 'work', label: '업무', icon: 'briefcase' },
      {
        value: 'culture',
        label: '조직문화',
        icon: 'heart',
        children: [
          { value: 'dues', label: '회비' },
          { value: 'club', label: '동호회' },
        ],
      },
    ],
  },
  {
    label: '관리',
    items: [
      { value: 'users', label: '사용자 관리', icon: 'users' },
      { value: 'company', label: '회사 설정', icon: 'settings' },
    ],
  },
];
// md 의 주 메뉴 서랍 코드(ex-drawer)와 같은 항목
export const HR_NAV_CODE: SideGroup[] = [
  {
    label: '근무',
    items: [
      { value: 'calendar', label: '캘린더', icon: 'calendar' },
      {
        value: 'leave',
        label: '휴가',
        icon: 'plane',
        children: [
          { value: 'leave-history', label: '휴가 현황' },
          { value: 'leave-apply', label: '휴가 신청' },
        ],
      },
    ],
  },
];

// 목록 줄 — 제목 · 부제 · 금액 · 카테고리 색
export type NavRow = [string, string, string, string];
export const LEDGER_ROWS: NavRow[] = [
  ['점심 식사', '식비 · 현대카드 신용카드', '−12,000원', 'orange'],
  ['지하철', '교통 · 국민 체크카드', '−1,450원', 'blue'],
  ['월급', '수입 · 국민 주계좌', '+3,200,000원', 'green'],
  ['편의점', '식비 · 현금', '−4,300원', 'orange'],
  ['영화', '문화 · 국민 체크카드', '−15,000원', 'violet'],
  ['다라커피', '카페 · 현대카드 신용카드', '−5,600원', 'brown'],
  ['택시', '교통 · 현대카드 신용카드', '−9,800원', 'blue'],
  ['마트 장보기', '식비 · 국민 체크카드', '−46,200원', 'orange'],
  ['관리비', '주거 · 국민 주계좌', '−182,000원', 'violet'],
  ['책', '문화 · 현대카드 신용카드', '−16,800원', 'violet'],
];
// 가계부 › 자산 — 계좌 · 카드 · 증권(합계 12,067,700원)
export const ASSET_ROWS: NavRow[] = [
  ['국민 주계좌', '입출금', '2,450,000원', 'blue'],
  ['저축 통장', '저축', '1,200,000원', 'green'],
  ['나무증권', '투자', '8,830,000원', 'violet'],
  ['현대카드 신용카드', '이번 달 사용', '−412,300원', 'orange'],
];
export const NOTICE_ROWS: [string, string][] = [
  ['카드 결제 예정', '현대카드 신용카드 — 10월 14일 412,300원'],
  ['예산을 넘었어요', '식비 예산의 104%를 썼어요'],
  ['일정 알림', '오후 3시 · 치과 예약'],
  ['더치페이 요청', '김민수 님이 32,000원을 보냈어요'],
  ['증권 연결이 끊겼어요', '나무증권 — 다시 연결해 주세요'],
];
export const TODO_ROWS = ['장보기', '관리비 내기', '책 반납', '운동 30분', '세탁소 맡기기', '보험 갱신 확인', '부모님 선물 고르기', '이메일 정리', '분리수거', '화분 물 주기', '치과 예약 확인', '택배 반품'];
export const DUTCH_ROWS: [string, string, string][] = [
  ['제주 여행', '4명 · 10월 3일', '412,000원'],
  ['팀 점심', '6명 · 9월 30일', '96,000원'],
  ['생일 선물', '3명 · 9월 21일', '75,000원'],
  ['캠핑 장보기', '5명 · 9월 14일', '138,500원'],
  ['영화', '2명 · 9월 7일', '30,000원'],
];
// 카드 혜택(카드 · 혜택 한 줄) — 쪽 넘김 · 끝없이 불러오기 그림
export const BENEFITS: [string, string][] = [
  ['신한카드 체크카드', '카페 · 편의점 10% 할인'],
  ['KB국민카드 체크카드', '대중교통 · 통신 7% 할인'],
  ['현대카드 신용카드', '주유 · 마트 포인트 적립'],
  ['삼성카드 신용카드', '배달 · 쇼핑 20% 할인'],
  ['하나카드 신용카드', '해외 결제 수수료 면제'],
  ['우리카드 신용카드', '구독 · OTT 15% 할인'],
  ['롯데카드 신용카드', '간편결제 1.5% 할인'],
  ['NH농협카드 체크카드', '병원 · 약국 5% 할인'],
  ['BC카드 신용카드', '영화 · 공연 3,000원 할인'],
];
// HR 사용자 표 · 휴가 내역 표
export const HR_USERS: [string, string, string, string][] = [
  ['김민수', '개발팀', '팀원', '재직'],
  ['이서연', '디자인팀', '팀장', '재직'],
  ['박지훈', '개발팀', '팀원', '휴직'],
  ['최유진', '인사팀', '팀원', '재직'],
  ['정하늘', '영업팀', '팀원', '재직'],
  ['한지우', '개발팀', '팀원', '재직'],
  ['오세린', '재무팀', '팀원', '재직'],
  ['윤도현', '영업팀', '팀장', '재직'],
  ['장예린', '디자인팀', '팀원', '재직'],
  ['서준호', '개발팀', '팀원', '재직'],
];
export const HR_LEAVES: [string, string, string, string][] = [
  ['2026-09-21', '연차', '1일', '승인'],
  ['2026-09-04', '반차(오후)', '0.5일', '승인'],
  ['2026-08-18', '연차', '2일', '승인'],
  ['2026-07-31', '병가', '1일', '승인'],
  ['2026-07-10', '연차', '1일', '반려'],
];
