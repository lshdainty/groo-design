// 컴포넌트 수치 원본(specs/components/<이름>.yaml)으로 마크다운 표를 그린다.
//
// 스펙 md 의 `[표: 제목](<이름>.yaml#<구역>)` 한 줄이 표 하나로 바뀐다. GitHub 에서는 그 줄이
// YAML 로 가는 링크로 보인다. 원본에 없는 토큰·변형·상태·부위·구역을 가리키면 빌드를 멈춘다 —
// 조용히 빈 칸을 내보내면 그게 곧 어긋남이 된다.
//
// YAML 형식은 specs/components/button.yaml 머리 주석과 specs/CLAUDE.md 에 있다.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

export const PLACEHOLDER = /^\[표: ([^\]]+)\]\(([a-z0-9-]+)\.yaml#([a-zA-Z0-9.@+-]+)\)\s*$/;

// 표 머리글. `부위.속성` 이 먼저, 없으면 속성 이름으로 찾고, 그것도 없으면 키를 그대로 쓴다.
// 순서가 곧 표의 칸 순서다(크기 → 여백 → 모양 → 색 → 글자 → 효과).
// 속성 이름표 — 표와 컴포넌트 페이지의 Specification(site/components/specs/spec-sheet.tsx)이 같이 쓴다
export const PROP_LABEL = {
  'label.typography': '글자',
  'label.fontFamily': '글꼴',
  'label.fontWeight': '굵기',
  'label.lineHeight': '줄 높이',
  'label.textDecoration': '밑줄',
  'prefixIcon.size': '앞 아이콘',
  'suffixIcon.size': '뒤 아이콘',
  'prefixIcon.color': '앞 아이콘 색',
  'suffixIcon.color': '뒤 아이콘 색',
  'value.typography': '값 글자',
  'value.foreground': '값 글자색',
  'value.caretColor': '캐럿 색',
  'value.paddingY': '입력 상하 여백',
  'value.paddingX': '입력 좌우 여백',
  'value.minHeight': '최소 높이',
  'value.maxHeight': '최대 높이',
  'placeholder.foreground': 'placeholder 색',
  'prefixText.typography': '앞 글자',
  'prefixText.foreground': '앞 글자색',
  'suffixText.typography': '뒤 글자',
  'suffixText.foreground': '뒤 글자색',
  'clearButton.size': '지우기 버튼',
  'clearButton.color': '지우기 색',
  'clearButton.touchTarget': '지우기 누르는 영역',
  'removeButton.size': '지우기 버튼',
  'removeButton.color': '지우기 색',
  'progressCircle.size': '로딩 원',
  'progressCircle.thickness': '로딩 원 두께',
  'progressCircle.track': '로딩 원 트랙',
  'progressCircle.range': '로딩 원 채움',
  'icon.size': '아이콘',
  'focusRing.width': '링 두께',
  'focusRing.offset': '링 간격',
  'focusRing.color': '링 색',
  'focusRing.actionOffset': '액션 링 간격',
  'focusRing.closeButtonOffset': '닫기 링 간격',
  'focusRing.rootOffset': '말풍선 링 간격',
  'focusRing.rootColor': '말풍선 링 색',
  'indicator.insetX': '막대 들임',
  'indicator.inset': '알약 들임',
  'trigger.chip': '칩',
  'trigger.chipSize': '칩 크기',
  'dayLabel.textDecoration': '취소선',
  'wheel.columns': '칼럼',
  height: '높이',
  minHeight: '최소 높이',
  maxHeight: '최대 높이',
  width: '너비',
  minWidth: '최소 너비',
  maxWidth: '최대 너비',
  size: '크기',
  iconSize: '아이콘 크기',
  buttonSize: '버튼 크기',
  padding: '여백',
  paddingY: '상하 여백',
  paddingX: '좌우 여백',
  paddingTop: '위 여백',
  paddingBottom: '아래 여백',
  paddingLeft: '왼쪽 여백',
  paddingRight: '오른쪽 여백',
  margin: '바깥 여백',
  marginTop: '위 바깥 여백',
  marginBottom: '아래 바깥 여백',
  marginY: '상하 바깥 여백',
  marginX: '좌우 바깥 여백',
  marginLeft: '왼쪽 바깥 여백',
  marginRight: '오른쪽 바깥 여백',
  gap: '간격',
  rowGap: '줄 간격',
  columnGap: '칸 간격',
  columns: '칸 수',
  alignSelf: '줄 맞춤',
  alignItems: '세로 맞춤',
  justifyContent: '가로 정렬',
  direction: '쌓는 방향',
  grow: '남는 자리 채움',
  gapX: '열 사이',
  gapY: '줄 사이',
  insetX: '바탕 들임',
  radius: '모서리',
  background: '배경',
  foreground: '글자·아이콘',
  color: '색',
  borderColor: '테두리',
  borderWidth: '테두리 두께',
  borderStyle: '테두리 모양',
  borderBottomColor: '아래 테두리',
  borderBottomWidth: '아래 테두리 두께',
  outlineColor: '외곽선',
  outlineWidth: '외곽선 두께',
  shadow: '그림자',
  typography: '글자',
  fontSize: '글자 크기',
  fontWeight: '굵기',
  lineHeight: '줄 높이',
  letterSpacing: '자간',
  fontFamily: '글꼴',
  textDecoration: '밑줄',
  brightness: '밝기',
  scale: '배율',
  translateX: '가로 이동',
  translateY: '세로 이동',
  opacity: '불투명도',
  cursor: '커서',
  pointerEvents: '포인터 이벤트',
  zIndex: 'z-index',
  touchTarget: '터치 영역',
  rotate: '회전',
  marginBlock: '위아래 바깥 여백',
  aspectRatio: '비율',
  objectFit: '맞춤',
  textTransform: '대소문자',
  outlineOffset: '외곽선 간격',
  glyph: '글리프',
  transitionProperty: '전환 대상',
  transitionDuration: '전환 시간',
  transitionEasing: '전환 곡선',
  transitionDelay: '전환 지연',
  duration: '보이는 시간',
  openDelay: '열림 지연',
  closeDelay: '닫힘 지연',
  skipDelay: '이어 열기 시간',
  scaleDuration: '축소 시간',
  scaleEasing: '축소 곡선',
  press: '누름',
  breakpoint: '바뀌는 폭',
  resize: '크기 조절',
  track: '트랙',
  range: '채움',
  thickness: '두께',
  top: '위 거리',
  right: '오른쪽 거리',
  overflowY: '세로 넘침',
  justifyContent: '가로 맞춤',
  buttonSize: '버튼 크기',
  offset: '트리거와 거리',
  overflowX: '넘칠 때',
  scrollPadding: '스크롤 여유',
  textAlign: '글 맞춤',
  shrink: '줄어듦',
  align: '정렬',
  transform: '변형',
  chip: '칩',
  weeks: '주 수',
  position: '자리',
  items: '항목',
  columnOrder: '칼럼 순서',
  valueFormat: '값 형식',
  selectedForeground: '고른 글자색',
  numerals: '숫자 폭',
  // 앱 적용이 남긴 것(2026-10-08) — 입력칸의 캐럿 색(고른 글은 기기 기본)
  caretColor: '캐럿 색',
  // 기다림 묶음(2026-10-03) — Skeleton 의 기다리는 영역 · Progress Circle 의 호 · 당겨서 새로 고침 · Scroll Fog · Content Placeholder
  showAfter: '보이기 시작',
  slowAfter: '오래 걸림 글',
  timeout: '요청 제한',
  retry: '다시 시도',
  linecap: '끝 모양',
  start: '시작 자리',
  length: '호 길이',
  threshold: '문턱',
  multiplier: '당김 비율',
  mode: '채움 방식',
  mask: '마스크',
  placement: '흐리는 쪽',
  fog: '끝 흐림',
  strokeWidth: '선 굵기',
  // 이미지 묶음(2026-10-04) — Image Frame · 카드 그림 · Logo Tile · Aspect Ratio
  overflow: '넘침',
  loading: '받기',
  display: '보이기',
  shimmer: '반짝임',
  glyphSize: '그림 크기',
  glyphColor: '그림 색',
  lineClamp: '줄 수',
  inset: '자리',
  // 데이터 표시 묶음(2026-10-08) — Table · Card · Chart · Searchable List · Swipe Actions
  itemRadius: '줄 바탕 모서리',
  gradientEnd: '그라디언트 끝',
  variant: '모양',
  role: '역할',
  debounce: '보내기 전 기다림',
  // 입력 묶음(2026-10-09) — Slider · Toggle · Input OTP · Color Swatch · Icon Picker
  'resend.label': '단추 글',
  order: '차례',
  keyboard: '키보드',
  name: '이름',
  component: '컴포넌트',
  match: '찾는 방법',
  inputMode: '키보드 종류',
  autoComplete: '자동 채우기',
  filter: '받는 글자',
  autoSubmit: '저절로 보내기',
  content: '내용',
  cooldown: '막는 시간',
  focus: '초점',
  label: '글',
  commit: '저장 시점',
  touchAction: '터치 동작',
  offsetY: '손잡이와 거리',
  clamp: '끝에서',
  span: '채우는 범위',
  target: '뜨는 자리',
  snap: '서는 자리',
  arrowWidth: '화살표 너비',
  arrowHeight: '화살표 높이',
  columnGapMin: '칸 사이 최소',
  searchGap: '찾기 칸 ↔ 격자',
  strokeWidthOn: '켬 선 굵기',
  pageStep: '한 번에 옮기는 단계',
  backgroundOnFloating: '시트 · 팝오버 위 바탕',
  enterScale: '나타날 때 크기',
  enterOpacity: '나타날 때 불투명도',
  enterOffsetY: '나타날 때 아래 거리',
  exitOpacity: '사라질 때 불투명도',
  exitOffsetY: '사라질 때 아래 거리',
  scrollFog: '끝 흐림',
  dragStart: '끌기 시작',
  // 펼치고 접기 · 나누기 묶음(2026-10-10) — Accordion · Collapsible · Tree View · Resizable · Scroll Area · Scroll Auto Hide · List 하위 줄
  'heading.level': '머리말 단계',
  level: '단계',
  indent: '단계 들임',
  toggleWidth: '누르면 넓게',
  persist: '폭 기억',
  step: '한 번에',
  rowHeight: '격자 한 줄',
  bottom: '아래 거리',
  scrollbarWidth: '스크롤바 굵기',
  thumbColor: '막대 색',
  trackColor: '바탕 색',
  overscrollBehavior: '끝에서 넘침',
  tabIndex: 'Tab 정지점',
  follow: '따라가기',
  snapThreshold: '스냅 기준',
  snapDuration: '스냅 시간',
  snapEasing: '스냅 곡선',
  // 마무리 묶음(Quantity Picker · Attachment Input · Footer · Avatar 사진 바꾸기, 2026-10-15)
  touchExtend: '누르는 자리 넓힘',
  ariaDisabled: 'aria-disabled',
  iconColor: '아이콘 색',
  icon: '아이콘',
  repeat: '누르고 있기',
  fontVariantNumeric: '숫자 폭',
  ariaLive: '읽기(live)',
  flexGrow: '늘어남',
  bleedX: '가장자리까지',
  wordBreak: '줄바꿈',
  overflowWrap: '넘칠 때 끊기',
  maxLines: '최대 줄',
  format: '형식',
  keys: '키',
  dropTarget: '놓기 받음',
  prefixIcon: '앞 아이콘',
  alt: '대체 글',
  tone: '톤',
  text: '글',
  disabled: '막힘',
  surface: '판',
  title: '머리',
  groups: '묶음',
  preview: '크게 보기 줄',
  makeCover: '대표로 정하기 줄',
  moveEarlier: '앞으로 옮기기 줄',
  moveLater: '뒤로 옮기기 줄',
  remove: '지우기',
  afterAction: '고른 뒤 초점',
  change: '바꾸기',
  progress: '진행',
  landmark: '랜드마크',
  wrap: '줄바꿈(넘칠 때)',
  flex: '늘고 줄기',
  element: '요소',
  separator: '잇는 글',
  button: '버튼',
  newTab: '새 탭',
};
export const PROP_ORDER = Object.keys(PROP_LABEL);

// 컴포넌트마다 다른 이름표 — 같은 키라도 부위의 뜻이 다르다(Tabs 의 indicator 는 막대, WheelPicker 의 indicator 는 선택 띠).
// 키는 YAML 의 name. 칸 순서는 PROP_LABEL 의 것을 그대로 쓴다
export const PROP_LABEL_BY_COMPONENT = {
  WheelPicker: { 'indicator.insetX': '띠 들임' },
  // 알림 숫자 — 글 부위(label)는 알약 안의 숫자다
  NotificationBadge: { 'root.gap': '글 끝과 사이', 'label.foreground': '숫자 색', 'label.numerals': '숫자 폭', 'label.typography': '숫자 글자', 'label.fontWeight': '숫자 굵기' },
  // 메타 줄 — 부위마다 항목 · 구분(보이는 글자) · 읽는 구분(보이지 않는 글)
  TagGroup: {
    'item.typography': '항목 글자',
    'item.foreground': '항목 글자색',
    'item.fontWeight': '항목 굵기',
    'item.gap': '아이콘과 글 사이',
    'item.shrink': '항목 줄어듦',
    'icon.size': '아이콘',
    'icon.color': '아이콘 색',
    'separator.glyph': '구분 글자',
    'separator.typography': '구분 글자 크기',
    'separator.foreground': '구분 색',
    'separator.fontWeight': '구분 굵기',
    'separator.shrink': '구분 줄어듦',
    'srSeparator.glyph': '읽는 구분',
  },
  // 이니셜 · 사진 · 안쪽 테두리
  Avatar: {
    'initial.background': '이니셜 바탕',
    'initial.foreground': '이니셜 글자색',
    'initial.fontSize': '이니셜 글자',
    'initial.fontWeight': '이니셜 굵기',
    'initial.lineHeight': '이니셜 줄 높이',
    'initial.textTransform': '이니셜 대소문자',
    'image.objectFit': '사진 맞춤',
    'border.borderWidth': '안쪽 테두리 두께',
    'border.borderColor': '안쪽 테두리',
  },
  // 묶음 — 겹침(음수 간격) · 바탕색 링(바깥 외곽선) · "+N" 원
  AvatarStack: {
    'root.gap': '겹침',
    'root.items': '보이는 사람',
    'item.size': '아바타 크기',
    'item.outlineWidth': '링 두께',
    'item.outlineColor': '링 색',
    'overflow.size': '"+N" 크기',
    'overflow.outlineWidth': '"+N" 링 두께',
    'overflow.outlineColor': '"+N" 링 색',
    'overflow.fontSize': '"+N" 글자',
    'overflow.fontWeight': '"+N" 굵기',
    'overflow.background': '"+N" 바탕',
    'overflow.foreground': '"+N" 글자색',
  },
  // 배지 묶음의 사이
  Badge: { 'root.gap': '앞 아이콘과 글 사이', 'group.gap': '배지 사이' },
  // 나눈 자리 — 목록 | 상세를 가로로 나눈다(쌓는 방향이 아니다)
  Resizable: { 'group.direction': '나누는 방향' },
  // 나무 줄을 누르면 하는 일(고른다 · 고르며 편다 · 고르며 접는다) — 다른 부품의 누름 피드백(누름)과 다르다
  TreeView: { 'row.press': '누르면' },
  // 틀 · 그림 · 윤곽 · 그림 위 자리 · 불러오는 동안 · 대체 그림 — 부위 이름까지 한국어로
  ImageFrame: {
    'image.width': '그림 너비',
    'image.height': '그림 높이',
    'image.objectFit': '그림 맞춤',
    'image.loading': '그림 받기',
    'image.opacity': '그림 불투명도',
    'image.display': '그림 보이기',
    'image.rotate': '그림 회전',
    'plate.background': '판 배경',
    'stroke.borderWidth': '윤곽 두께',
    'stroke.borderColor': '윤곽 색',
    'floater.offset': '가장자리와 거리',
    'skeleton.background': '스켈레톤 면',
    'skeleton.shimmer': '스켈레톤 반짝임',
    'fallback.background': '대체 그림 면',
    'fallback.glyphSize': '대체 그림 크기',
    'fallback.glyphColor': '대체 그림 색',
  },
  // 카드 면 — 회사 이름 · 카드 이름 · 작은 면의 첫 글자
  CardArt: {
    'face.background': '면 배경',
    'face.foreground': '면 글자색',
    'label.paddingX': '글 묶음 좌우 여백',
    'label.paddingBottom': '글 묶음 아래 여백',
    'issuer.typography': '회사 이름 글자',
    'issuer.fontWeight': '회사 이름 굵기',
    'issuer.overflowX': '회사 이름 넘칠 때',
    'name.typography': '카드 이름 글자',
    'name.fontWeight': '카드 이름 굵기',
    'name.lineClamp': '카드 이름 줄 수',
    'initial.fontSize': '첫 글자 크기',
    'initial.fontWeight': '첫 글자 굵기',
    'initial.lineHeight': '첫 글자 줄 높이',
    'initial.textTransform': '첫 글자 대소문자',
  },
  // 타일 · 첫 글자 · 그림 판 · 윤곽
  LogoTile: {
    'initial.fontSize': '첫 글자 크기',
    'initial.fontWeight': '첫 글자 굵기',
    'initial.lineHeight': '첫 글자 줄 높이',
    'initial.textTransform': '첫 글자 대소문자',
    'initial.foreground': '첫 글자 색',
    'plate.padding': '판 여백',
    'plate.background': '판 배경',
    'stroke.borderWidth': '윤곽 두께',
    'stroke.borderColor': '윤곽 색',
    'image.objectFit': '그림 맞춤',
    'image.radius': '그림 모서리',
  },
  // 비율 상자의 자식 하나
  AspectRatio: { 'child.inset': '자식 자리', 'child.objectFit': '자식 맞춤' },
  // 이름 줄 — 이름과 오른쪽 글 사이
  Progress: { 'header.gap': '이름 ↔ 오른쪽 글' },
  // 데이터 표시 묶음(2026-10-08) — 부위 이름까지 한국어로(표 · Specification 이 같이 쓴다)
  Table: {
    'root.display': '그리는 모양',
    'caption.display': '표 이름 보이기',
    'headerRow.minHeight': '머리 줄 최소 높이',
    'headerRow.background': '머리 줄 배경',
    'headerRow.borderBottomWidth': '머리 줄 아래 선 두께',
    'headerRow.borderBottomColor': '머리 줄 아래 선',
    'headerRow.position': '머리 줄 자리',
    'headerRow.zIndex': '머리 줄 z-index',
    'headerCell.paddingY': '머리 칸 상하 여백',
    'headerCell.paddingX': '머리 칸 좌우 여백',
    'headerCell.typography': '머리 칸 글자',
    'headerCell.lineHeight': '머리 칸 줄 높이',
    'headerCell.fontWeight': '머리 칸 굵기',
    'headerCell.foreground': '머리 칸 글자색',
    'headerCell.textAlign': '머리 칸 맞춤',
    'sortButton.width': '정렬 버튼 너비',
    'sortButton.gap': '글 ↔ 정렬 표시',
    'sortButton.cursor': '정렬 버튼 커서',
    'sortButton.background': '정렬 버튼 배경',
    'sortIcon.size': '정렬 표시 크기',
    'sortIcon.color': '정렬 표시 색',
    'row.minHeight': '줄 최소 높이',
    'row.borderBottomWidth': '줄 아래 선 두께',
    'row.borderBottomColor': '줄 아래 선',
    'row.background': '줄 배경',
    'row.cursor': '줄 커서',
    'row.transitionProperty': '줄 전환 대상',
    'row.transitionDuration': '줄 전환 시간',
    'row.transitionEasing': '줄 전환 곡선',
    'cell.paddingY': '칸 상하 여백',
    'cell.paddingX': '칸 좌우 여백',
    'cell.typography': '칸 글자',
    'cell.lineHeight': '칸 줄 높이',
    'cell.fontWeight': '칸 굵기',
    'cell.foreground': '칸 글자색',
    'cell.alignItems': '칸 세로 맞춤',
    'cell.textAlign': '칸 맞춤',
    'cell.numerals': '칸 숫자 폭',
    'cell.display': '칸 → 줄 자리',
    'detail.typography': '둘째 줄 글자',
    'detail.foreground': '둘째 줄 글자색',
    'detail.gap': '윗줄 ↔ 둘째 줄',
    'thumbnail.size': '썸네일 크기',
    'thumbnail.gap': '썸네일 ↔ 글',
    'badge.size': '상태 배지',
    'checkbox.display': '선택 칸',
    'checkbox.size': '선택 칸 크기',
    'checkbox.touchTarget': '선택 칸 누르는 영역',
    'moreButton.display': '줄 끝 ⋮',
    'moreButton.size': '⋮ 크기',
    'moreButton.touchTarget': '⋮ 누르는 영역',
    'bulkBar.display': '일괄 작업 바',
    'bulkBar.minHeight': '일괄 작업 바 최소 높이',
    'bulkBar.paddingX': '일괄 작업 바 좌우 여백',
    'bulkBar.radius': '일괄 작업 바 모서리',
    'bulkBar.background': '일괄 작업 바 배경',
    'bulkBar.gap': '일괄 작업 바 간격',
    'bulkBar.marginBottom': '바 ↔ 표 머리',
  },
  Card: {
    'root.gap': '카드 사이',
    'header.alignItems': '머리 세로 맞춤',
    'header.justifyContent': '머리 가로 맞춤',
    'header.gap': '머리 간격',
    'header.paddingTop': '머리 위 여백',
    'header.paddingBottom': '머리 ↔ 본문',
    'header.paddingX': '머리 좌우 여백',
    'title.typography': '제목 글자',
    'title.fontWeight': '제목 굵기',
    'title.foreground': '제목 글자색',
    'headerAction.height': '머리 동작 높이',
    'headerAction.paddingLeft': '머리 동작 왼쪽 여백',
    'headerAction.paddingRight': '머리 동작 오른쪽 여백',
    'headerAction.radius': '머리 동작 모서리',
    'headerAction.typography': '머리 동작 글자',
    'headerAction.fontWeight': '머리 동작 굵기',
    'headerAction.foreground': '머리 동작 글자색',
    'headerAction.iconSize': '머리 동작 아이콘',
    'headerAction.gap': '글 ↔ chevron',
    'headerAction.touchTarget': '머리 동작 누르는 영역',
    'headerAction.background': '머리 동작 배경',
    'headerAction.scale': '머리 동작 배율',
    'content.gap': '본문 요소 사이',
    'list.itemRadius': '목록 누름 바탕 모서리',
    'statLabel.typography': '지표 라벨 글자',
    'statLabel.fontWeight': '지표 라벨 굵기',
    'statLabel.foreground': '지표 라벨 글자색',
    'statValue.typography': '지표 숫자 글자',
    'statValue.fontWeight': '지표 숫자 굵기',
    'statValue.foreground': '지표 숫자 글자색',
    'statValue.numerals': '지표 숫자 폭',
    'statValue.marginTop': '라벨 ↔ 숫자',
    'delta.typography': '증감 글자',
    'delta.fontWeight': '증감 굵기',
    'delta.foreground': '증감 색',
    'delta.numerals': '증감 숫자 폭',
    'delta.marginTop': '숫자 ↔ 증감 줄',
    'deltaText.typography': '증감 글 글자',
    'deltaText.fontWeight': '증감 글 굵기',
    'deltaText.foreground': '증감 글 글자색',
    'deltaText.gap': '증감 값 ↔ 글',
    'heroGlow.size': '장식 빛 크기',
    'heroGlow.background': '장식 빛 색',
    'heroLabel.typography': '순자산 라벨 글자',
    'heroLabel.fontWeight': '순자산 라벨 굵기',
    'heroLabel.foreground': '순자산 라벨 글자색',
    'heroAmount.typography': '순자산 금액 글자',
    'heroAmount.fontWeight': '순자산 금액 굵기',
    'heroAmount.foreground': '순자산 금액 글자색',
    'heroAmount.numerals': '순자산 금액 숫자 폭',
    'heroAmount.marginTop': '라벨 ↔ 금액',
    'heroDetail.typography': '아래 글 글자',
    'heroDetail.fontWeight': '아래 글 굵기',
    'heroDetail.foreground': '아래 글 글자색',
    'heroDetail.marginTop': '금액 ↔ 아래 글',
  },
  Chart: {
    'tickLabel.typography': '눈금 글자',
    'tickLabel.foreground': '눈금 글자색',
    'tickLabel.numerals': '눈금 숫자 폭',
    'gridLine.borderWidth': '격자 두께',
    'gridLine.borderStyle': '격자 모양',
    'gridLine.borderColor': '격자 색',
    'series.color': '계열 색',
    'series.thickness': '도넛 두께',
    'line.strokeWidth': '선 굵기',
    'bar.maxWidth': '막대 최대 너비',
    'bar.radius': '막대 모서리',
    'bar.gap': '막대 사이',
    'point.size': '가리킨 점 크기',
    'crosshair.borderWidth': '가리킴 선 두께',
    'crosshair.borderStyle': '가리킴 선 모양',
    'crosshair.borderColor': '가리킴 선 색',
    'tooltip.minWidth': '툴팁 최소 너비',
    'tooltip.paddingY': '툴팁 상하 여백',
    'tooltip.paddingX': '툴팁 좌우 여백',
    'tooltip.radius': '툴팁 모서리',
    'tooltip.background': '툴팁 배경',
    'tooltip.shadow': '툴팁 그림자',
    'tooltip.gap': '툴팁 줄 사이',
    'tooltip.zIndex': '툴팁 z-index',
    'tooltipHead.typography': '툴팁 머리 글자',
    'tooltipHead.foreground': '툴팁 머리 글자색',
    'tooltipRow.typography': '툴팁 줄 글자',
    'tooltipRow.foreground': '툴팁 라벨 글자색',
    'tooltipRow.gap': '네모 ↔ 라벨 ↔ 값',
    'swatch.size': '색 네모 크기',
    'swatch.radius': '색 네모 모서리',
    'legendTile.radius': '지표 타일 모서리',
    'legendTile.paddingY': '지표 타일 상하 여백',
    'legendTile.paddingX': '지표 타일 좌우 여백',
    'legendTile.gap': '타일 사이',
    'legendTile.typography': '타일 이름 글자',
    'legendTile.foreground': '타일 이름 글자색',
    'legendTile.cursor': '지표 타일 커서',
    'legendTile.touchTarget': '지표 타일 누르는 영역',
    'legendTile.transitionProperty': '지표 타일 전환 대상',
    'legendTile.transitionDuration': '지표 타일 전환 시간',
    'legendTile.transitionEasing': '지표 타일 전환 곡선',
    'legendTile.background': '지표 타일 배경',
    'legendTile.borderWidth': '지표 타일 테두리 두께',
    'legendTile.borderColor': '지표 타일 테두리',
    'legendTile.scale': '지표 타일 배율',
    'legendTile.scaleDuration': '지표 타일 축소 시간',
    'legendTile.scaleEasing': '지표 타일 축소 곡선',
    'legendList.minHeight': '범례 줄 최소 높이',
    'legendList.typography': '범례 줄 글자',
    'legendList.gap': '범례 줄 간격',
    'legendList.background': '범례 줄 배경',
    'donutCenter.typography': '도넛 가운데 글자',
    'donutCenter.fontWeight': '도넛 가운데 굵기',
    'donutCenter.foreground': '도넛 가운데 글자색',
    'donutCenter.numerals': '도넛 가운데 숫자 폭',
    'heatmapCell.aspectRatio': '열지도 칸 비율',
    'heatmapCell.radius': '열지도 칸 모서리',
    'heatmapCell.background': '열지도 칸 배경',
    'heatmapCell.gap': '열지도 칸 사이',
    'heatmapValue.threshold': '글을 두는 칸 폭',
    'heatmapValue.typography': '칸 금액 글자',
    'heatmapValue.fontWeight': '칸 금액 굵기',
    'heatmapValue.numerals': '칸 금액 숫자 폭',
    'heatmapValue.foreground': '칸 금액 글자색',
  },
  SearchableList: {
    'root.gap': '검색칸 ↔ 결과',
    'field.variant': '검색칸 모양',
    'field.height': '검색칸 높이',
    'field.marginX': '검색칸 좌우 바깥 여백',
    'field.position': '검색칸 자리',
    'results.role': '결과 목록 역할',
    'results.debounce': '서버 검색 기다림',
    'results.filter': '거르는 규칙',
    'results.pointerLeave': '마우스가 목록을 떠나면',
    'results.maxHeight': '결과 최대 높이',
    'groupHeader.variant': '분류 머리 모양',
    'option.role': '결과 줄 역할',
    'option.paddingY': '결과 줄 상하 여백',
    'option.paddingX': '결과 줄 좌우 여백',
    'option.cursor': '결과 줄 커서',
    'option.touchTarget': '결과 줄 누르는 영역',
    'option.scale': '결과 줄 배율',
    'option.press': '결과 줄을 누르면',
    'highlight.background': '강조 바탕',
    'highlight.insetX': '강조 바탕 들임',
    'highlight.radius': '강조 바탕 모서리',
    'title.typography': '제목 글자',
    'title.fontWeight': '제목 굵기',
    'title.foreground': '제목 글자색',
    'detail.typography': '설명 글자',
    'detail.foreground': '설명 글자색',
    'radio.size': '라디오 크기',
    'radio.display': '라디오',
    'status.size': '결과 없음 · 실패',
    'skeleton.size': '불러오는 줄',
    'prefix.size': '앞 붙이개 크기',
    'prefix.width': '앞 붙이개 너비',
  },
  'Swipe Actions': {
    'badge.background': '배지 배경',
    'badge.borderWidth': '배지 테두리 두께',
    'badge.borderColor': '배지 테두리',
    'badge.size': '배지 크기',
    'badge.radius': '배지 모서리',
    'action.brightness': '칸 밝기',
    'action.shadow': '칸 그림자',
    'action.transform': '칸 이동',
    'action.cursor': '칸 커서',
    'action.height': '칸 높이',
    'action.width': '칸 너비',
    'action.paddingY': '칸 상하 여백',
    'action.paddingX': '칸 좌우 여백',
    'action.gap': '배지 ↔ 라벨',
    'action.touchTarget': '칸 누르는 영역',
    'moreButton.size': '⋮ 크기',
    'icon.color': '아이콘 색',
    'icon.size': '아이콘 크기',
    'label.color': '라벨 색',
    'label.typography': '라벨 글자',
    'label.fontWeight': '라벨 굵기',
    'label.lineHeight': '라벨 줄 높이',
  },
};
// `부위.속성` 의 이름표 — 컴포넌트 것 → 공용 `부위.속성` → 공용 속성 → 키 그대로
export function propLabelFor(name, slot, prop) {
  const key = `${slot}.${prop}`;
  return PROP_LABEL_BY_COMPONENT[name]?.[key] ?? PROP_LABEL[key] ?? PROP_LABEL[prop] ?? prop;
}

class SpecError extends Error {}

// ── 토큰 ────────────────────────────────────────────────────────

// 레포의 내보내기 스크립트가 만든 CSS 변수를 읽는다 — 토큰 원본은 DESIGN*.md 다.
export function loadTokens(repo) {
  const read = (file) => {
    const css = execFileSync(
      process.execPath,
      [join(repo, 'scripts/build-tailwind-v4.mjs'), '--source', join(repo, file)],
      { encoding: 'utf8' },
    );
    const vars = new Map();
    for (const m of css.matchAll(/--([a-z0-9_-]+):\s*([^;]+);/g)) if (!vars.has(m[1])) vars.set(m[1], m[2].trim());
    // v108 — 역할은 var(--color-gray-00) 처럼 팔레트를 가리킨다. 표에는 값을 보이게 사슬을 푼다
    const res = (v, d = 0) => { const r = /^var\(--([a-z0-9_-]+)\)$/.exec(v); return r && d < 8 && vars.has(r[1]) ? res(vars.get(r[1]), d + 1) : v; };
    for (const [k, v] of vars) vars.set(k, res(v));
    return vars;
  };
  return { shared: read('DESIGN.md'), hr: read('DESIGN.hr.md'), desk: read('DESIGN.desk.md') };
}

const hex = (v) => (/^#[0-9a-f]{3,8}$/i.test(v) ? v.toUpperCase() : v);

function parseRef(value) {
  const m = String(value).match(/^\$([a-z0-9_-]+)(?:\s*\/\s*(\d+%))?$/);
  return m ? { name: m[1], alpha: m[2] } : null;
}

function hasToken(tokens, name) {
  return tokens.shared.has(name) || tokens.hr.has(name) || tokens.desk.has(name);
}

// 토큰 하나를 "`이름` 값" 으로. 브랜드마다 다르면 둘 다, 다크 짝이 있으면 같이 적는다.
// 그림자는 값이 길어 이름만 둔다 — 값은 기초 › Elevation & Depth 에 있다.
function formatToken(tokens, { name, alpha }, { withDark, omitWeight }) {
  const { shared, hr, desk } = tokens;
  const tag = `\`${name}\``;
  const short = (v) => (v && !name.startsWith('shadow-') && v.length <= 36 ? hex(v) : null);
  const mix = (v) => (v && alpha ? `${v} × ${alpha}` : v);
  if (shared.has(name)) {
    if (name.startsWith('text-')) {
      // v104 부터 글자는 rem 으로 내보낸다 — 스펙 표는 사람이 읽는 px(-static)로 보인다
      const px = (k) => shared.get(`${name}-static${k}`) ?? shared.get(`${name}${k}`);
      const parts = [px(''), omitWeight ? null : shared.get(`${name}--font-weight`), px('--line-height')];
      return `${tag} ${parts.filter(Boolean).join(' / ')}`;
    }
    const light = mix(short(shared.get(name)));
    const dark = withDark ? mix(short(shared.get(`${name}-dark`))) : null;
    return [tag, light ?? (alpha && `× ${alpha}`), dark && `· 다크 ${dark}`].filter(Boolean).join(' ');
  }
  if (hr.has(name) || desk.has(name)) {
    const h = mix(short(hr.get(name)));
    const d = mix(short(desk.get(name)));
    return h === d ? `${tag} ${h}` : `${tag} HR ${h} · Desk ${d}`;
  }
  throw new SpecError(`없는 토큰 $${name}`);
}

function formatScalar(tokens, value, { withDark = true, omitWeight = false } = {}) {
  const ref = parseRef(value);
  if (ref) return formatToken(tokens, ref, { withDark, omitWeight });
  if (/\$[a-z]/.test(String(value))) throw new SpecError(`토큰은 값 하나로만 쓴다: ${value}`);
  return `\`${value}\``;
}

// ── 값 ──────────────────────────────────────────────────────────
// 속성 값은 스칼라이거나 { value, dark?, note? } 다.

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function unpack(pv) {
  return isObj(pv) ? { value: pv.value, dark: pv.dark, note: pv.note } : { value: pv };
}

// 값 칸의 글자와 비고를 따로 돌려준다 — 목록 표는 비고를 칸으로, 나머지는 칸 안에 붙인다.
function cell(tokens, pv, opts = {}) {
  if (pv === undefined) return { text: '—', note: undefined };
  const { value, dark, note } = unpack(pv);
  const text =
    dark === undefined
      ? formatScalar(tokens, value, opts)
      : `${formatScalar(tokens, value, { ...opts, withDark: false })} · 다크 ${formatScalar(tokens, dark, { ...opts, withDark: false })}`;
  return { text, note };
}

function inline(tokens, pv, opts) {
  const { text, note } = cell(tokens, pv, opts);
  return note ? `${text} — ${note}` : text;
}

const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');

// ── 스펙 해석 ───────────────────────────────────────────────────

// 축·상태는 목록이거나 { 값: 설명 } 이다.
const namesOf = (def) => (Array.isArray(def) ? def : Object.keys(def ?? {}));
const descOf = (def, name) => (Array.isArray(def) ? undefined : def?.[name]);

const axisValues = (spec, axis) => namesOf(spec.variants[axis]);
const stateNames = (spec) => namesOf(spec.states);
// 기본 상태는 상태 목록의 첫째다(보통 enabled, 컴포넌트에 따라 default). 다른 상태는 여기서 바뀌는 값만 적는다.
const baseState = (spec) => stateNames(spec)[0];
const whenKeys = (rule) => Object.keys(rule.when ?? {});
const isBase = (rule) => whenKeys(rule).length === 0;

// 부위의 굵기를 컴포넌트가 늘 따로 정하면 — 공통 규칙에 있거나, 한 축의 모든 값이 정하거나 — 글자 토큰에 딸린 굵기는
// 적지 않는다. 토큰의 400 과 컴포넌트의 굵기가 나란히 보이면 어느 쪽이 맞는지 알 수 없다(Button 라벨 700 · Switch 라벨 500).
// 일부 조건에서만 굵기를 바꾸는 부위(선택된 탭만 600)는 토큰의 굵기가 나머지 조건의 값이라 그대로 적는다.
export function setsWeight(spec, slot) {
  const st = baseState(spec);
  const has = (rule) => rule[st]?.[slot]?.fontWeight !== undefined;
  if (spec.rules.some((r) => isBase(r) && has(r))) return true;
  return Object.keys(spec.variants).some((axis) =>
    axisValues(spec, axis).every((v) => spec.rules.some((r) => whenKeys(r).length === 1 && r.when[axis] === v && has(r))),
  );
}
// 표의 칸("부위.속성")에 넘길 값 표기 옵션
const fmt = (spec, key) => {
  const [slot, prop] = key.split('.');
  return { omitWeight: prop === 'typography' && setsWeight(spec, slot) };
};

function walkValues(spec, fn) {
  for (const rule of spec.rules) {
    for (const state of stateNames(spec)) {
      for (const props of Object.values(rule[state] ?? {})) {
        for (const pv of Object.values(props)) {
          const { value, dark } = unpack(pv);
          fn(value);
          if (dark !== undefined) fn(dark);
        }
      }
    }
  }
  for (const m of Object.values(spec.motion ?? {})) for (const k of ['duration', 'easing']) if (m[k] !== undefined) fn(m[k]);
}

function validate(spec, tokens) {
  for (const key of ['name', 'slots', 'variants', 'states', 'rules']) {
    if (!spec?.[key]) throw new SpecError(`${key} 가 없다`);
  }
  const axes = spec.variants;
  for (const [axis, def] of Object.entries(axes)) {
    if (namesOf(def).length === 0) throw new SpecError(`변형 축 ${axis} 가 비었다`);
  }
  for (const [axis, v] of Object.entries(spec.defaults ?? {})) {
    if (!axes[axis] || !namesOf(axes[axis]).includes(v)) throw new SpecError(`defaults.${axis} 에 없는 값 ${v}`);
  }
  const states = stateNames(spec);
  for (const rule of spec.rules) {
    for (const [axis, v] of Object.entries(rule.when ?? {})) {
      if (!axes[axis]) throw new SpecError(`없는 변형 축 ${axis}`);
      if (!namesOf(axes[axis]).includes(v)) throw new SpecError(`${axis} 에 없는 값 ${v}`);
    }
    for (const key of Object.keys(rule)) {
      if (key === 'when') continue;
      if (!states.includes(key)) throw new SpecError(`없는 상태 ${key}`);
      for (const [slot, props] of Object.entries(rule[key])) {
        if (!(slot in spec.slots)) throw new SpecError(`없는 부위 ${slot}`);
        for (const [prop, pv] of Object.entries(props)) {
          if (isObj(pv) && !('value' in pv)) throw new SpecError(`${slot}.${prop} 에 value 가 없다`);
        }
      }
    }
  }
  // 표에 안 그려지는 규칙의 토큰도 미리 확인한다.
  walkValues(spec, (value) => {
    const ref = parseRef(value);
    if (ref && !hasToken(tokens, ref.name)) throw new SpecError(`없는 토큰 $${ref.name}`);
  });
}

// "부위.속성" → 값.
function flatten(slots) {
  const out = {};
  for (const [slot, props] of Object.entries(slots ?? {})) {
    for (const [prop, value] of Object.entries(props)) out[`${slot}.${prop}`] = value;
  }
  return out;
}

// root 부위는 속성 이름만, 나머지 부위는 `부위 속성` 으로 적는다(tabs 의 `list 높이`).
function label(spec, key) {
  const [slot, prop] = key.split('.');
  const exact = PROP_LABEL_BY_COMPONENT[spec.name]?.[key] ?? PROP_LABEL[key];
  if (exact) return exact;
  const name = PROP_LABEL[prop] ?? prop;
  return slot === 'root' ? name : `${slot} ${name}`;
}

// 칸 순서: 부위는 YAML slots 순서, 부위 안에서는 PROP_LABEL 순서, 모르는 속성은 뒤로.
function orderKeys(spec, keys) {
  const slots = Object.keys(spec.slots);
  const rank = (key) => {
    const [slot, prop] = key.split('.');
    const exact = PROP_ORDER.indexOf(key);
    const p = exact !== -1 ? exact : PROP_ORDER.indexOf(prop);
    return [slots.indexOf(slot), p === -1 ? PROP_ORDER.length : p];
  };
  return [...keys].sort((a, b) => {
    const [sa, pa] = rank(a);
    const [sb, pb] = rank(b);
    return sa - sb || pa - pb;
  });
}

// @부위 로 고른 부위의 키만 — `+` 로 여러 부위를 묶는다(`size@trigger+value+chevron`).
const inSlot = (pick) => {
  const picks = pick ? pick.split('+') : null;
  return (key) => !picks || picks.some((p) => key.startsWith(`${p}.`));
};

function unionKeys(rows) {
  const keys = [];
  for (const row of rows) for (const key of Object.keys(row)) if (!keys.includes(key)) keys.push(key);
  return keys;
}

function table(head, rows) {
  const line = (cells) => `| ${cells.map(esc).join(' | ')} |`;
  return [line(head), line(head.map(() => '---')), ...rows.map(line)].join('\n');
}

const code = (v) => `\`${v}\``;

function stateCell(spec, state) {
  const desc = descOf(spec.states, state);
  return desc ? `${code(state)} ${desc}` : code(state);
}

function valueCell(spec, axis, v) {
  return `${code(v)}${v === spec.defaults?.[axis] ? ' (기본)' : ''}`;
}

const px = (tokens, pv) => {
  const { value } = unpack(pv);
  const ref = parseRef(value);
  const raw = ref ? tokens.shared.get(ref.name) : String(value);
  const m = raw?.match(/^(\d+(?:\.\d+)?)px$/);
  return m ? Number(m[1]) : null;
};

// WCAG 2.5.8(AA) 24 · 2.5.5(AAA) 44 — 짧은 변 기준. hit 은 공통 규칙의 누르는 영역(touchTarget 이
// "44 × 44" 처럼 수로 시작할 때) — 보이는 상자보다 넓게 잡는 컴포넌트(Button 의 ::before)는 그 값으로 잰다.
function touch(tokens, row, rootSlot, hit = 0) {
  const h = px(tokens, row[`${rootSlot}.height`]);
  if (h === null) return '—';
  const w = row[`${rootSlot}.width`] !== undefined ? px(tokens, row[`${rootSlot}.width`]) : h;
  const side = Math.max(Math.min(h, w ?? h), hit);
  return `${side >= 24 ? '✓' : '⚠'} · ${side >= 44 ? '✓' : '⚠'}`;
}

function hitArea(spec, rootSlot) {
  const base = spec.rules.find((r) => whenKeys(r).length === 0)?.[baseState(spec)]?.[rootSlot]?.touchTarget;
  const m = base === undefined ? null : String(unpack(base).value).match(/^(\d+(?:\.\d+)?)\s*(?:px)?\s*×/);
  return m ? Number(m[1]) : 0;
}

// combo 에 걸리는 규칙(when ⊆ combo).
const appliesTo = (combo) => (rule) => whenKeys(rule).every((k) => combo[k] === rule.when[k]);

// "a.b.c.d" → { a: b, c: d }
function pairs(parts, section) {
  if (parts.length % 2) throw new SpecError(`구역 #${section} — 축과 값을 짝으로 적는다`);
  const out = {};
  for (let i = 0; i < parts.length; i += 2) out[parts[i]] = parts[i + 1];
  return out;
}

function checkCombo(spec, combo) {
  for (const [axis, v] of Object.entries(combo)) {
    if (!spec.variants[axis]) throw new SpecError(`없는 변형 축 ${axis}`);
    if (!axisValues(spec, axis).includes(v)) throw new SpecError(`${axis} 에 없는 값 ${v}`);
  }
}

// ── 구역 ────────────────────────────────────────────────────────

// base[.<상태>] — 조건 없는 규칙(상태를 적으면 그 상태만). 부위·상태·비고 칸은 필요할 때만 둔다. 부위는 + 로 여럿을 고른다(@body+title)
function baseTable(spec, tokens, only, pick) {
  const rows = [];
  const picks = pick ? pick.split('+') : null;
  for (const rule of spec.rules.filter(isBase)) {
    for (const state of only ? [only] : stateNames(spec)) {
      for (const [slot, props] of Object.entries(rule[state] ?? {})) {
        if (picks && !picks.includes(slot)) continue;
        for (const [prop, pv] of Object.entries(props)) rows.push({ slot, state, prop, ...cell(tokens, pv, fmt(spec, `${slot}.${prop}`)) });
      }
    }
  }
  if (rows.length === 0) throw new SpecError('조건 없는 규칙이 없다 — #base 를 쓸 수 없다');
  const multiSlot = new Set(rows.map((r) => r.slot)).size > 1;
  const multiState = new Set(rows.map((r) => r.state)).size > 1;
  const anyNote = rows.some((r) => r.note);
  return table(
    [...(multiSlot ? ['부위'] : []), ...(multiState ? ['상태'] : []), '속성', '값', ...(anyNote ? ['비고'] : [])],
    rows.map((r) => [
      ...(multiSlot ? [code(r.slot)] : []),
      ...(multiState ? [code(r.state)] : []),
      propLabelFor(spec.name, r.slot, r.prop),
      r.text,
      ...(anyNote ? [r.note ?? ''] : []),
    ]),
  );
}

// slots — 부위와 설명.
function slotsTable(spec) {
  return table(['부위', '설명'], Object.entries(spec.slots).map(([k, d]) => [code(k), d ?? '']));
}

// <축> — 축 값마다 한 줄. 그 축만 조건으로 건 규칙의 기본 상태 값.
function axisTable(spec, tokens, axis, pick) {
  const values = axisValues(spec, axis);
  const rows = values.map((v) => {
    const merged = {};
    for (const rule of spec.rules) {
      const keys = whenKeys(rule);
      if (keys.length === 1 && keys[0] === axis && rule.when[axis] === v) Object.assign(merged, flatten(rule[baseState(spec)]));
    }
    return merged;
  });
  const cols = orderKeys(spec, unionKeys(rows)).filter(inSlot(pick));
  const root = Object.keys(spec.slots)[0];
  // 터치 칸 — 높이가 수(px)인 줄이 하나도 없으면(전부 "—") 칸을 싣지 않는다(Date Picker 의 보이는 범위처럼 높이가 식인 축).
  // 뿌리가 누르는 자리가 아니고 다른 부위가 터치 영역을 적었으면(Bottom Navigation 의 바 · 칸) 뿌리 높이로 셈하지 않는다
  const otherTarget = spec.rules.some((r) => Object.entries(r[baseState(spec)] ?? {}).some(([slot, props]) => slot !== root && isObj(props) && 'touchTarget' in props));
  const rootIsTarget = !otherTarget || hitArea(spec, root) > 0;
  const touches = rootIsTarget && cols.includes(`${root}.height`) ? rows.map((row) => touch(tokens, row, root, hitArea(spec, root))) : [];
  const withTouch = touches.some((t) => t !== '—');
  const withDesc = values.some((v) => descOf(spec.variants[axis], v));
  return table(
    [axis, ...cols.map((c) => label(spec, c)), ...(withTouch ? ['터치 (AA · AAA)'] : []), ...(withDesc ? ['설명'] : [])],
    rows.map((row, i) => [
      valueCell(spec, axis, values[i]),
      ...cols.map((c) => inline(tokens, row[c], fmt(spec, c))),
      ...(withTouch ? [touches[i]] : []),
      ...(withDesc ? [descOf(spec.variants[axis], values[i]) ?? ''] : []),
    ]),
  );
}

// grid.<축>[.<축>.<값>…] — 속성마다 한 줄, 축 값마다 한 칸. 뒤의 짝은 고정 조건.
// 그 조합에 걸리는 규칙 가운데 고정 조건의 축을 모두 적은 규칙만 합친다(조건 없는 규칙은 뺀다).
// 그래서 grid.variant 는 변형별 바탕 값, grid.variant.selected.active 는 선택됐을 때 바뀌는 값만 보인다.
function gridTable(spec, tokens, axis, fixed, pick) {
  const values = axisValues(spec, axis);
  const mentionsFixed = (rule) => Object.keys(fixed).every((k) => k in (rule.when ?? {}));
  const columns = values.map((v) => {
    const combo = { ...fixed, [axis]: v };
    const merged = {};
    for (const rule of spec.rules.filter((r) => !isBase(r) && appliesTo(combo)(r) && mentionsFixed(r))) {
      Object.assign(merged, flatten(rule[baseState(spec)]));
    }
    return merged;
  });
  const keys = orderKeys(spec, unionKeys(columns)).filter(inSlot(pick));
  return table(
    ['속성', ...values.map((v) => valueCell(spec, axis, v))],
    keys.map((k) => [label(spec, k), ...columns.map((col) => inline(tokens, col[k], fmt(spec, k)))]),
  );
}

// states.<축>[.<축>…] — 축 값(여럿이면 곱한 조합)마다, 기본 상태에서 바뀌는 값을 상태별로.
// 조건 없는 규칙(포커스 링처럼 모두 같은 것)은 빼고 그 조합에 걸리는 규칙만 — 공통은 #base 에 있다.
function stateDeltaTable(spec, tokens, axes, pick) {
  let combos = [{}];
  for (const axis of axes) combos = combos.flatMap((c) => axisValues(spec, axis).map((v) => ({ ...c, [axis]: v })));
  const states = stateNames(spec).filter((s) => s !== baseState(spec));
  const cells = combos.map((combo) =>
    states.map((state) => {
      const merged = {};
      for (const rule of spec.rules.filter((r) => !isBase(r) && appliesTo(combo)(r))) Object.assign(merged, flatten(rule[state]));
      const keys = orderKeys(spec, Object.keys(merged)).filter(inSlot(pick));
      return keys.length ? keys.map((k) => `${label(spec, k)} ${inline(tokens, merged[k], fmt(spec, k))}`).join(' · ') : '—';
    }),
  );
  const used = states.filter((_, i) => cells.some((row) => row[i] !== '—'));
  return table(
    [...axes, ...used.map((s) => stateCell(spec, s))],
    combos.map((combo, r) => [...axes.map((a) => code(combo[a])), ...used.map((s) => cells[r][states.indexOf(s)])]),
  );
}

// matrix[.<축>.<값>…] — 한 조합의 상태 매트릭스. 공통 규칙 + 그 조합에 걸리는 규칙을 상태마다 누적한다.
// 칸은 상태에 따라 바뀌는 속성, 상태를 정의한 조건부 규칙이 정한 속성, 그리고 구역에 직접 적은 축
// (matrix.pressed.on 의 pressed)을 거는 규칙이 정한 속성 — defaults 로만 따라온 크기 규칙처럼
// 상태와 무관한 값은 빼고, 그 표가 보여 주려는 조건(켜짐 · 체크)의 값은 늘 보인다.
// 공통 규칙의 시각 속성(배경 · 글자 · 테두리 · 그림자)은 바뀌지 않아도 칸으로 둔다 — 스펙의 상태 표는
// 늘 이 칸을 보였다(textarea 의 배경 surface-input 처럼 모든 상태에서 같아도).
// 부위를 고르면 그 부위가 바뀌는 상태만 줄로 둔다.
const VISUAL_PROPS = ['background', 'foreground', 'borderColor', 'borderWidth', 'shadow', 'outlineColor'];

function stateMatrix(spec, tokens, combo, pick, explicit = []) {
  const rules = spec.rules.filter(appliesTo(combo));
  const base = {};
  for (const rule of rules) Object.assign(base, flatten(rule[baseState(spec)]));
  const states = stateNames(spec);
  const rows = states.map((state) => {
    const row = { ...base };
    if (state !== baseState(spec)) for (const rule of rules) Object.assign(row, flatten(rule[state]));
    return row;
  });
  const hasStates = (rule) => states.some((st) => st !== baseState(spec) && rule[st]);
  const asked = (rule) => whenKeys(rule).some((k) => explicit.includes(k));
  const own = new Set();
  for (const rule of rules.filter((r) => !isBase(r) && (hasStates(r) || asked(r)))) {
    for (const state of states) for (const k of Object.keys(flatten(rule[state]))) own.add(k);
  }
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const changes = (c) => rows.some((r) => !same(r[c], rows[0][c]));
  // 상태에 따라 바뀌는 부위만 — breadcrumb 의 Link 표에 page · separator 글자색이 끼지 않게.
  const inPlay = new Set([...unionKeys(rows).filter(changes), ...own].map((k) => k.split('.')[0]));
  for (const rule of rules.filter(isBase)) {
    for (const k of Object.keys(flatten(rule[baseState(spec)]))) {
      const [slot, prop] = k.split('.');
      if (inPlay.has(slot) && VISUAL_PROPS.includes(prop)) own.add(k);
    }
  }
  const cols = orderKeys(spec, unionKeys(rows))
    .filter(inSlot(pick))
    .filter((c) => own.has(c) || changes(c));
  const keep = rows.map((row, i) => i === 0 || !pick || cols.some((c) => !same(row[c], rows[0][c])));
  return table(
    ['상태', ...cols.map((c) => label(spec, c))],
    rows.filter((_, i) => keep[i]).map((row) => [stateCell(spec, states[rows.indexOf(row)]), ...cols.map((c) => inline(tokens, row[c], fmt(spec, c)))]),
  );
}

// compound — 두 축 이상을 함께 건 규칙.
function compoundTable(spec, tokens, pick) {
  const rows = [];
  for (const rule of spec.rules.filter((r) => whenKeys(r).length > 1)) {
    const combo = Object.entries(rule.when).map(([k, v]) => `${k}=${code(v)}`).join(' + ');
    for (const state of stateNames(spec)) {
      for (const [key, pv] of Object.entries(flatten(rule[state])).filter(([k]) => inSlot(pick)(k))) rows.push([combo, code(state), label(spec, key), inline(tokens, pv, fmt(spec, key))]);
    }
  }
  if (rows.length === 0) throw new SpecError('두 축 이상을 건 규칙이 없다 — #compound 를 쓸 수 없다');
  return table(['조합', '상태', '속성', '값'], rows);
}

// motion — 전환마다 시간 · 곡선 · 대상.
function motionTable(spec, tokens) {
  const entries = Object.entries(spec.motion ?? {});
  if (entries.length === 0) throw new SpecError('motion 이 없다');
  const anyNote = entries.some(([, m]) => m.note);
  return table(
    ['전환', '시간', '곡선', '대상', ...(anyNote ? ['비고'] : [])],
    entries.map(([name, m]) => [
      code(name),
      m.duration === undefined ? '—' : formatScalar(tokens, m.duration),
      m.easing === undefined ? '—' : formatScalar(tokens, m.easing),
      m.properties ? [].concat(m.properties).map(code).join(', ') : '—',
      ...(anyNote ? [m.note ?? ''] : []),
    ]),
  );
}

// 구역 이름 → 표.
//   base[.<상태>]           조건 없는 공통 값(상태를 적으면 그 상태만 — 부위별 목록 표)
//   slots                   부위와 설명
//   <축>                    축 값마다 기본 상태 값           예: size
//   grid.<축>[.<축>.<값>…]  속성 × 축 값 격자(뒤 짝은 고정)   예: grid.variant, grid.variant.selected.active
//   states.<축>[.<축>…]     축 값(여럿이면 곱한 조합)마다 상태별로 바뀌는 값
//   matrix[.<축>.<값>…]     그 조합(나머지는 defaults)의 상태 매트릭스
//   compound                두 축 이상을 건 규칙
//   motion                  전환 시간 · 곡선
// 뒤에 @<부위> 를 붙이면 그 부위만 그린다 — 예: matrix@input, base.default@palette. 여러 부위는 + 로 묶는다(size@trigger+value).
export function renderSection(spec, tokens, section) {
  const [name, pick, extra] = section.split('@');
  if (extra !== undefined) throw new SpecError(`구역 #${section} — @부위 는 하나만`);
  if (pick !== undefined) for (const p of pick.split('+')) if (!(p in spec.slots)) throw new SpecError(`없는 부위 ${p}`);
  const [head, ...rest] = name.split('.');
  if (head === 'base' && rest.length === 0) return baseTable(spec, tokens, undefined, pick);
  if (head === 'base' && rest.length === 1) {
    if (!stateNames(spec).includes(rest[0])) throw new SpecError(`없는 상태 ${rest[0]}`);
    return baseTable(spec, tokens, rest[0], pick);
  }
  if (head === 'slots' && rest.length === 0) return slotsTable(spec);
  if (head === 'compound' && rest.length === 0) return compoundTable(spec, tokens, pick);
  if (head === 'motion' && rest.length === 0) return motionTable(spec, tokens);
  if (head === 'states' && rest.length >= 1) {
    for (const axis of rest) if (!spec.variants[axis]) throw new SpecError(`없는 변형 축 ${axis}`);
    return stateDeltaTable(spec, tokens, rest, pick);
  }
  if (head === 'grid' && rest.length >= 1) {
    const [axis, ...fixedParts] = rest;
    if (!spec.variants[axis]) throw new SpecError(`없는 변형 축 ${axis}`);
    const fixed = pairs(fixedParts, section);
    checkCombo(spec, fixed);
    return gridTable(spec, tokens, axis, fixed, pick);
  }
  if (head === 'matrix') {
    const asked = pairs(rest, section);
    const combo = { ...spec.defaults, ...asked };
    checkCombo(spec, combo);
    return stateMatrix(spec, tokens, combo, pick, Object.keys(asked));
  }
  if (rest.length === 0 && spec.variants[head]) return axisTable(spec, tokens, head, pick);
  throw new SpecError(`없는 구역 #${section}`);
}

export function loadSpec(file, tokens) {
  const spec = parseYaml(readFileSync(file, 'utf8'));
  validate(spec, tokens);
  return spec;
}

// 스펙 md 본문의 표 자리 줄을 표로 바꾼다. 실패하면 파일·줄을 붙여 던진다.
export function fillSpecTables(body, { specDir, tokens, source }) {
  const cache = new Map();
  return body
    .split('\n')
    .map((line, i) => {
      const m = line.match(PLACEHOLDER);
      if (!m) return line;
      const [, title, name, section] = m;
      const file = join(specDir, `${name}.yaml`);
      try {
        if (!cache.has(file)) cache.set(file, loadSpec(file, tokens));
        // 제목을 표 위에 붙인다 — 한 자리를 여러 표로 나눈 곳(toggle 의 off · on)에서 표끼리 가를 수 있게.
        return `**${title}**\n\n${renderSection(cache.get(file), tokens, section)}`;
      } catch (e) {
        if (e instanceof SpecError || e.code === 'ENOENT') {
          throw new Error(`${source}:${i + 1} ${name}.yaml#${section} — ${e.message}`);
        }
        throw e;
      }
    })
    .join('\n');
}
