---
version: alpha
name: Porest
description: |
  People + Forest. Dual-brand design system for Porest HR (B2B) 
  and Porest Desk (B2C). Optimized for Korean-first audiences,
  all-ages accessibility.

colors:
  # === Brand-specific 토큰은 DESIGN.hr.md / DESIGN.desk.md로 분리 (v17) ===
  # primary, primary-light, border-focus, border-focus-light: 각 brand 파일에서 정의
  
  # @sync:shared-start (colors-0)
  # === v108 — 팔레트(SEED 식 모드별). 가족마다 100 ~ 1000(회색은 00 을 더해 11단), 단계마다 라이트 · 다크(-dark) ===
  # 역할(fg · bg · stroke)은 이 팔레트를 가리킨다. 다크는 SEED 처럼 뒤집혀 100 이 가장 어둡다
  gray-00: "#FFFFFF"
  gray-00-dark: "#1A1F2E"
  gray-100: "#F7F8FD"
  gray-100-dark: "#242938"
  gray-200: "#F5F6FA"
  gray-200-dark: "#2D3346"
  gray-300: "#EDEFF3"
  gray-300-dark: "#353B4D"
  gray-400: "#E5E8EF"
  gray-400-dark: "#404757"
  gray-500: "#8A91A0"
  gray-500-dark: "#656B78"
  gray-600: "#767C8B"
  gray-600-dark: "#838997"
  gray-700: "#62697A"
  gray-700-dark: "#A2A8B7"
  gray-800: "#535866"
  gray-800-dark: "#B7BDCC"
  gray-900: "#2F3541"
  gray-900-dark: "#D6DDEC"
  gray-1000: "#1A1F2E"
  gray-1000-dark: "#F5F6FA"
  red-100: "#FFEFEC"
  red-100-dark: "#3E231F"
  red-200: "#FFDEDA"
  red-200-dark: "#532722"
  red-300: "#FEC4BC"
  red-300-dark: "#722722"
  red-400: "#FCA195"
  red-400-dark: "#93231F"
  red-500: "#F8776B"
  red-500-dark: "#B51317"
  red-600: "#E95046"
  red-600-dark: "#CC0E17"
  red-700: "#D72323"
  red-700-dark: "#D82424"
  red-800: "#C01016"
  red-800-dark: "#FF8477"
  red-900: "#96030C"
  red-900-dark: "#FFBCB3"
  red-1000: "#5C0004"
  red-1000-dark: "#FEEDEA"
  green-100: "#EAF5EC"
  green-100-dark: "#202D23"
  green-200: "#D8EADB"
  green-200-dark: "#223927"
  green-300: "#BBDAC1"
  green-300-dark: "#20482B"
  green-400: "#95C49E"
  green-400-dark: "#1A582F"
  green-500: "#6AAC7A"
  green-500-dark: "#076931"
  green-600: "#43955B"
  green-600-dark: "#117539"
  green-700: "#167F3F"
  green-700-dark: "#198140"
  green-800: "#026E33"
  green-800-dark: "#25C062"
  green-900: "#075527"
  green-900-dark: "#AED6B6"
  green-1000: "#023214"
  green-1000-dark: "#E9F4EB"
  orange-100: "#FFEFE8"
  orange-100-dark: "#39251E"
  orange-200: "#FAE0D5"
  orange-200-dark: "#4B2B1F"
  orange-300: "#F5C7B6"
  orange-300-dark: "#65321D"
  orange-400: "#EDA98E"
  orange-400-dark: "#833615"
  orange-500: "#E18663"
  orange-500-dark: "#9F3901"
  orange-600: "#D1673B"
  orange-600-dark: "#B04209"
  orange-700: "#BE490D"
  orange-700-dark: "#BF4A10"
  orange-800: "#A53E0A"
  orange-800-dark: "#FF8758"
  orange-900: "#822E02"
  orange-900-dark: "#F9BFA9"
  orange-1000: "#4E1801"
  orange-1000-dark: "#FEEEE7"
  blue-100: "#EAF3FE"
  blue-100-dark: "#1F2A39"
  blue-200: "#D7E6FB"
  blue-200-dark: "#21344D"
  blue-300: "#B9D4F6"
  blue-300-dark: "#204069"
  blue-400: "#92BCF0"
  blue-400-dark: "#1C4E8A"
  blue-500: "#69A0E7"
  blue-500-dark: "#125AAA"
  blue-600: "#4387DA"
  blue-600-dark: "#0F65BF"
  blue-700: "#1D6EC9"
  blue-700-dark: "#1F70CB"
  blue-800: "#0F5FB3"
  blue-800-dark: "#69ABFF"
  blue-900: "#06498D"
  blue-900-dark: "#ACCEFB"
  blue-1000: "#022956"
  blue-1000-dark: "#E8F2FE"
  # v110 — 차트 10색을 팔레트에서 고르려고 더한 가족(700 = v21 ~ v24 차트 색)
  yellow-100: "#F5F2E8"
  yellow-100-dark: "#2D2A1D"
  yellow-200: "#EAE6D4"
  yellow-200-dark: "#3A331D"
  yellow-300: "#DAD2B4"
  yellow-300-dark: "#4A4019"
  yellow-400: "#C5B98A"
  yellow-400-dark: "#5C4D0B"
  yellow-500: "#AF9E5D"
  yellow-500-dark: "#6C5906"
  yellow-600: "#998331"
  yellow-600-dark: "#796400"
  yellow-700: "#8C7400"
  yellow-700-dark: "#846E04"
  yellow-800: "#725E01"
  yellow-800-dark: "#C5A721"
  yellow-900: "#574805"
  yellow-900-dark: "#D7CCA6"
  yellow-1000: "#332902"
  yellow-1000-dark: "#F3F1E6"
  indigo-100: "#EFF2FF"
  indigo-100-dark: "#26293A"
  indigo-200: "#E1E4FC"
  indigo-200-dark: "#2F324E"
  indigo-300: "#CACFF7"
  indigo-300-dark: "#383C6A"
  indigo-400: "#ADB4F1"
  indigo-400-dark: "#44468B"
  indigo-500: "#9098E9"
  indigo-500-dark: "#4F51AB"
  indigo-600: "#767CDC"
  indigo-600-dark: "#585AC1"
  indigo-700: "#5E60C8"
  indigo-700-dark: "#6264CC"
  indigo-800: "#5354B6"
  indigo-800-dark: "#99A1FE"
  indigo-900: "#3F3E92"
  indigo-900-dark: "#C3C9FC"
  indigo-1000: "#242359"
  indigo-1000-dark: "#EEF0FE"
  violet-100: "#F7EFFE"
  violet-100-dark: "#302638"
  violet-200: "#ECE1F8"
  violet-200-dark: "#3D2E4B"
  violet-300: "#DEC9F2"
  violet-300-dark: "#4F3565"
  violet-400: "#CCACEA"
  violet-400-dark: "#643C83"
  violet-500: "#B88BDF"
  violet-500-dark: "#7842A1"
  violet-600: "#A46DD1"
  violet-600-dark: "#8749B5"
  violet-700: "#8B4DBA"
  violet-700-dark: "#9153C0"
  violet-800: "#7F44AA"
  violet-800-dark: "#C793F3"
  violet-900: "#633089"
  violet-900-dark: "#DCC1F6"
  violet-1000: "#3B1A53"
  violet-1000-dark: "#F5EEFC"
  pink-100: "#FFEEF4"
  pink-100-dark: "#38242C"
  pink-200: "#FBDEE9"
  pink-200-dark: "#4C2938"
  pink-300: "#F5C5D7"
  pink-300-dark: "#642D47"
  pink-400: "#EDA3C2"
  pink-400-dark: "#813058"
  pink-500: "#E07FAA"
  pink-500-dark: "#9E3067"
  pink-600: "#D05E93"
  pink-600-dark: "#B23574"
  pink-700: "#B83B7A"
  pink-700-dark: "#BD407F"
  pink-800: "#A7326D"
  pink-800-dark: "#F485B6"
  pink-900: "#851F55"
  pink-900-dark: "#F9BBD3"
  pink-1000: "#510E31"
  pink-1000-dark: "#FEECF3"
  brown-100: "#F8F0EB"
  brown-100-dark: "#322821"
  brown-200: "#EFE3DA"
  brown-200-dark: "#3F3024"
  brown-300: "#E3CEBD"
  brown-300-dark: "#533B26"
  brown-400: "#D2B399"
  brown-400-dark: "#694628"
  brown-500: "#C09573"
  brown-500-dark: "#7E5127"
  brown-600: "#AC7B51"
  brown-600-dark: "#8E5A2A"
  brown-700: "#9A6536"
  brown-700-dark: "#986334"
  brown-800: "#855428"
  brown-800-dark: "#CF9F77"
  brown-900: "#693F18"
  brown-900-dark: "#E2C7B2"
  brown-1000: "#3F240A"
  brown-1000-dark: "#F7F0EA"
  # @sync:shared-end (colors-0)
  
  # @sync:shared-start (colors-1)
  # === Neutral - Page background (HR/Desk 공유) ===
  bg-page: "{colors.bg-layer-basement}"
  bg-page-dark: "{colors.bg-layer-basement-dark}"
  
  # === Neutral - Surface (카드/시트/입력 표면, 공통) ===
  surface-default: "{colors.bg-layer-default}"
  surface-default-dark: "{colors.bg-layer-default-dark}"
  surface-input: "{colors.bg-neutral-weak}"
  surface-input-dark: "{colors.bg-neutral-weak-dark}"
  
  # === Neutral - Text (본문/보조/3차/accent 위, 공통) ===
  text-primary: "{colors.fg-neutral}"
  text-primary-dark: "{colors.fg-neutral-dark}"
  text-secondary: "{colors.fg-neutral-muted}"
  text-secondary-dark: "{colors.fg-neutral-muted-dark}"
  text-tertiary: "{colors.fg-neutral-subtle}"
  text-tertiary-dark: "{colors.fg-neutral-subtle-dark}"
  text-disabled: "{colors.fg-disabled}"
  text-disabled-dark: "{colors.fg-disabled-dark}"
  text-on-accent: "{colors.static-white}"
  
  # === Neutral - Border (장식 외곽선/필수 UI 외곽선, 공통) ===
  border-default: "{colors.stroke-neutral-weak}"
  border-default-dark: "{colors.stroke-neutral-weak-dark}"
  border-strong: "{colors.stroke-neutral-solid}"
  border-strong-dark: "{colors.stroke-neutral-solid-dark}"
  # @sync:shared-end (colors-1)
  
  # === border-focus는 brand 파일로 분리 (v17) ===
  
  # @sync:shared-start (colors-2)
  # === Semantic - Status (functional palette, base + light 페어, 듀얼 브랜드 공유) ===
  success: "{colors.fg-positive}"
  success-light: "{colors.fg-positive-dark}"
  error: "{colors.fg-critical}"
  error-light: "{colors.fg-critical-dark}"
  warning: "{colors.fg-warning}"
  warning-light: "{colors.fg-warning-dark}"
  info: "{colors.fg-informative}"
  info-light: "{colors.fg-informative-dark}"
  
  # === Chart 10색 (v110 — 팔레트 단계에서: 라이트 700 · 다크 800-dark, 듀얼 브랜드 공유) ===
  # 저장된 옛 hex(카테고리 · 태그 · 캘린더 색)는 이름표로 두고, 그리는 색만 이 토큰을 따른다
  chart-red: "{colors.red-700}"
  chart-orange: "{colors.orange-700}"
  chart-yellow: "{colors.yellow-700}"
  chart-green: "{colors.green-700}"
  chart-blue: "{colors.blue-700}"
  chart-indigo: "{colors.indigo-700}"
  chart-violet: "{colors.violet-700}"
  chart-pink: "{colors.pink-700}"
  chart-brown: "{colors.brown-700}"
  chart-gray: "{colors.gray-700}"
  chart-red-dark: "{colors.red-800-dark}"
  chart-orange-dark: "{colors.orange-800-dark}"
  chart-yellow-dark: "{colors.yellow-800-dark}"
  chart-green-dark: "{colors.green-800-dark}"
  chart-blue-dark: "{colors.blue-800-dark}"
  chart-indigo-dark: "{colors.indigo-800-dark}"
  chart-violet-dark: "{colors.violet-800-dark}"
  chart-pink-dark: "{colors.pink-800-dark}"
  chart-brown-dark: "{colors.brown-800-dark}"
  chart-gray-dark: "{colors.gray-800-dark}"
  # v111 — 카테고리 옅은 바탕(작은 면 weak · 넓은 면 subtle)과 그 위 글자(contrast). 아이콘은 chart-{hue} 그대로
  chart-red-weak: "{colors.red-200}"
  chart-red-weak-dark: "{colors.red-300-dark}"
  chart-red-subtle: "{colors.red-100}"
  chart-red-subtle-dark: "{colors.red-200-dark}"
  chart-red-contrast: "{colors.red-800}"
  chart-red-contrast-dark: "{colors.red-900-dark}"
  chart-orange-weak: "{colors.orange-200}"
  chart-orange-weak-dark: "{colors.orange-300-dark}"
  chart-orange-subtle: "{colors.orange-100}"
  chart-orange-subtle-dark: "{colors.orange-200-dark}"
  chart-orange-contrast: "{colors.orange-800}"
  chart-orange-contrast-dark: "{colors.orange-900-dark}"
  chart-yellow-weak: "{colors.yellow-200}"
  chart-yellow-weak-dark: "{colors.yellow-300-dark}"
  chart-yellow-subtle: "{colors.yellow-100}"
  chart-yellow-subtle-dark: "{colors.yellow-200-dark}"
  chart-yellow-contrast: "{colors.yellow-800}"
  chart-yellow-contrast-dark: "{colors.yellow-900-dark}"
  chart-green-weak: "{colors.green-200}"
  chart-green-weak-dark: "{colors.green-300-dark}"
  chart-green-subtle: "{colors.green-100}"
  chart-green-subtle-dark: "{colors.green-200-dark}"
  chart-green-contrast: "{colors.green-800}"
  chart-green-contrast-dark: "{colors.green-900-dark}"
  chart-blue-weak: "{colors.blue-200}"
  chart-blue-weak-dark: "{colors.blue-300-dark}"
  chart-blue-subtle: "{colors.blue-100}"
  chart-blue-subtle-dark: "{colors.blue-200-dark}"
  chart-blue-contrast: "{colors.blue-800}"
  chart-blue-contrast-dark: "{colors.blue-900-dark}"
  chart-indigo-weak: "{colors.indigo-200}"
  chart-indigo-weak-dark: "{colors.indigo-300-dark}"
  chart-indigo-subtle: "{colors.indigo-100}"
  chart-indigo-subtle-dark: "{colors.indigo-200-dark}"
  chart-indigo-contrast: "{colors.indigo-800}"
  chart-indigo-contrast-dark: "{colors.indigo-900-dark}"
  chart-violet-weak: "{colors.violet-200}"
  chart-violet-weak-dark: "{colors.violet-300-dark}"
  chart-violet-subtle: "{colors.violet-100}"
  chart-violet-subtle-dark: "{colors.violet-200-dark}"
  chart-violet-contrast: "{colors.violet-800}"
  chart-violet-contrast-dark: "{colors.violet-900-dark}"
  chart-pink-weak: "{colors.pink-200}"
  chart-pink-weak-dark: "{colors.pink-300-dark}"
  chart-pink-subtle: "{colors.pink-100}"
  chart-pink-subtle-dark: "{colors.pink-200-dark}"
  chart-pink-contrast: "{colors.pink-800}"
  chart-pink-contrast-dark: "{colors.pink-900-dark}"
  chart-brown-weak: "{colors.brown-200}"
  chart-brown-weak-dark: "{colors.brown-300-dark}"
  chart-brown-subtle: "{colors.brown-100}"
  chart-brown-subtle-dark: "{colors.brown-200-dark}"
  chart-brown-contrast: "{colors.brown-800}"
  chart-brown-contrast-dark: "{colors.brown-900-dark}"
  chart-gray-weak: "{colors.gray-400}"
  chart-gray-weak-dark: "{colors.gray-400-dark}"
  chart-gray-subtle: "{colors.gray-300}"
  chart-gray-subtle-dark: "{colors.gray-300-dark}"
  chart-gray-contrast: "{colors.gray-800}"
  chart-gray-contrast-dark: "{colors.gray-900-dark}"
  # 옛 이름 — 다크 짝(v23 ~ v24). 제품 CSS 가 옮겨 가면 지운다
  chart-red-light: "{colors.chart-red-dark}"
  chart-orange-light: "{colors.chart-orange-dark}"
  chart-yellow-light: "{colors.chart-yellow-dark}"
  chart-green-light: "{colors.chart-green-dark}"
  chart-blue-light: "{colors.chart-blue-dark}"
  chart-indigo-light: "{colors.chart-indigo-dark}"
  chart-violet-light: "{colors.chart-violet-dark}"
  chart-pink-light: "{colors.chart-pink-dark}"
  chart-brown-light: "{colors.chart-brown-dark}"
  chart-gray-light: "{colors.chart-gray-dark}"
  # @sync:shared-end (colors-2)
  
  # @sync:shared-start (colors-3)
  # === v102 — SEED 역할 색 (fg · bg · stroke). 값은 porest 색이고, 옛 이름(text-* · surface-* · border-* · success …)은 같은 값의 별칭이다 ===
  # 글자 (fg)
  fg-neutral: "{colors.gray-1000}"
  fg-neutral-dark: "{colors.gray-1000-dark}"
  fg-neutral-muted: "{colors.gray-800}"
  fg-neutral-muted-dark: "{colors.gray-800-dark}"
  fg-neutral-subtle: "{colors.gray-700}"
  fg-neutral-subtle-dark: "{colors.gray-700-dark}"
  fg-neutral-inverted: "{colors.gray-00}"
  fg-neutral-inverted-dark: "{colors.gray-100-dark}"
  fg-placeholder: "{colors.gray-600}"
  fg-placeholder-dark: "{colors.gray-600-dark}"
  fg-disabled: "{colors.gray-500}"
  fg-disabled-dark: "{colors.gray-600-dark}"
  static-white: "#FFFFFF"
  fg-critical: "{colors.red-700}"
  fg-critical-dark: "{colors.red-800-dark}"
  fg-positive: "{colors.green-700}"
  fg-positive-dark: "{colors.green-800-dark}"
  fg-warning: "{colors.orange-700}"
  fg-warning-dark: "{colors.orange-800-dark}"
  fg-informative: "{colors.blue-700}"
  fg-informative-dark: "{colors.blue-800-dark}"
  fg-critical-contrast: "{colors.red-800}"
  fg-critical-contrast-dark: "{colors.red-900-dark}"
  fg-positive-contrast: "{colors.green-800}"
  fg-positive-contrast-dark: "{colors.green-900-dark}"
  fg-warning-contrast: "{colors.orange-800}"
  fg-warning-contrast-dark: "{colors.orange-900-dark}"
  fg-informative-contrast: "{colors.blue-800}"
  fg-informative-contrast-dark: "{colors.blue-900-dark}"
  # v115 — 반전 표면(bg-neutral-inverted — 스낵바) 위의 상태 아이콘. 라이트는 그 역할의 다크 값, 다크는 라이트 값(사용자 결정 2026-10-02)
  fg-positive-inverted: "{colors.green-800-dark}"
  fg-positive-inverted-dark: "{colors.green-700}"
  fg-critical-inverted: "{colors.red-800-dark}"
  fg-critical-inverted-dark: "{colors.red-700}"
  # 배경 (bg)
  bg-layer-basement: "{colors.gray-200}"
  bg-layer-basement-dark: "{colors.gray-00-dark}"
  bg-layer-default: "{colors.gray-00}"
  bg-layer-default-dark: "{colors.gray-100-dark}"
  bg-layer-default-pressed: "{colors.gray-100}"
  bg-layer-default-pressed-dark: "{colors.gray-300-dark}"
  bg-layer-floating: "{colors.gray-00}"
  bg-layer-floating-dark: "{colors.gray-200-dark}"
  bg-layer-floating-pressed: "{colors.gray-100}"
  bg-layer-floating-pressed-dark: "{colors.gray-300-dark}"
  bg-neutral-weak: "{colors.gray-200}"
  bg-neutral-weak-dark: "{colors.gray-300-dark}"
  bg-neutral-weak-pressed: "{colors.gray-300}"
  bg-neutral-weak-pressed-dark: "{colors.gray-400-dark}"
  # v120 — 회색 바닥(bg-layer-basement) 위 칩 · 세그먼트 트랙의 투명 짝. SEED bg.neutral-weak-alpha(-pressed) 의 값 그대로 —
  # 검정 4.7% · 6.3% / 다크 흰 12.5% · 18%. 투명도가 있어 팔레트 단계가 없다(사용자 결정 2026-10-16 기초 웹 01-040 B)
  bg-neutral-weak-alpha: "#0000000C"
  bg-neutral-weak-alpha-dark: "#FFFFFF20"
  bg-neutral-weak-alpha-pressed: "#00000010"
  bg-neutral-weak-alpha-pressed-dark: "#FFFFFF2E"
  bg-neutral-inverted: "{colors.gray-1000}"
  bg-neutral-inverted-dark: "{colors.gray-1000-dark}"
  # v112 — neutralSolid 버튼의 누름(SEED bg.neutral-inverted-pressed = gray-800)
  bg-neutral-inverted-pressed: "{colors.gray-800}"
  bg-neutral-inverted-pressed-dark: "{colors.gray-800-dark}"
  bg-disabled: "{colors.gray-200}"
  bg-disabled-dark: "{colors.gray-300-dark}"
  bg-critical-solid: "{colors.red-700}"
  bg-critical-solid-dark: "{colors.red-600-dark}"
  bg-critical-solid-pressed: "{colors.red-800}"
  bg-critical-solid-pressed-dark: "{colors.red-700-dark}"
  bg-critical-weak: "{colors.red-100}"
  bg-critical-weak-dark: "{colors.red-200-dark}"
  bg-critical-weak-pressed: "{colors.red-200}"
  bg-critical-weak-pressed-dark: "{colors.red-300-dark}"
  bg-positive-solid: "{colors.green-700}"
  bg-positive-solid-dark: "{colors.green-600-dark}"
  bg-positive-solid-pressed: "{colors.green-800}"
  bg-positive-solid-pressed-dark: "{colors.green-700-dark}"
  bg-positive-weak: "{colors.green-100}"
  bg-positive-weak-dark: "{colors.green-200-dark}"
  bg-positive-weak-pressed: "{colors.green-200}"
  bg-positive-weak-pressed-dark: "{colors.green-300-dark}"
  bg-warning-solid: "{colors.orange-700}"
  bg-warning-solid-dark: "{colors.orange-600-dark}"
  bg-warning-solid-pressed: "{colors.orange-800}"
  bg-warning-solid-pressed-dark: "{colors.orange-700-dark}"
  bg-warning-weak: "{colors.orange-100}"
  bg-warning-weak-dark: "{colors.orange-200-dark}"
  bg-warning-weak-pressed: "{colors.orange-200}"
  bg-warning-weak-pressed-dark: "{colors.orange-300-dark}"
  bg-informative-solid: "{colors.blue-700}"
  bg-informative-solid-dark: "{colors.blue-600-dark}"
  bg-informative-solid-pressed: "{colors.blue-800}"
  bg-informative-solid-pressed-dark: "{colors.blue-700-dark}"
  bg-informative-weak: "{colors.blue-100}"
  bg-informative-weak-dark: "{colors.blue-200-dark}"
  bg-informative-weak-pressed: "{colors.blue-200}"
  bg-informative-weak-pressed-dark: "{colors.blue-300-dark}"
  # 선 (stroke)
  stroke-neutral-subtle: "{colors.gray-300}"
  stroke-neutral-subtle-dark: "{colors.gray-300-dark}"
  stroke-neutral-weak: "{colors.gray-400}"
  stroke-neutral-weak-dark: "{colors.gray-400-dark}"
  stroke-neutral-solid: "{colors.gray-600}"
  stroke-neutral-solid-dark: "{colors.gray-600-dark}"
  # v113 — 고른 선택 상자(Select Box)의 짙은 테두리(SEED stroke.neutral-contrast = gray-1000)
  stroke-neutral-contrast: "{colors.gray-1000}"
  stroke-neutral-contrast-dark: "{colors.gray-1000-dark}"
  # v118 — 이미지 위 안쪽 1px 윤곽(Image Frame · Avatar · Logo Tile). SEED stroke.neutral-subtle 의 값 그대로 — 검정 4.7% · 다크 흰 5%.
  # 투명도가 있는 색이라 팔레트 단계가 없다(static-white 처럼 값을 바로 적는다). 구분선 stroke-neutral-subtle 은 불투명 그대로다(사용자 결정 2026-10-04 이미지 비교 1A)
  stroke-neutral-overlay: "#0000000C"
  stroke-neutral-overlay-dark: "#FFFFFF0D"
  stroke-critical-solid: "{colors.red-700}"
  stroke-critical-solid-dark: "{colors.red-800-dark}"
  stroke-positive-solid: "{colors.green-700}"
  stroke-positive-solid-dark: "{colors.green-800-dark}"
  stroke-warning-solid: "{colors.orange-700}"
  stroke-warning-solid-dark: "{colors.orange-800-dark}"
  stroke-informative-solid: "{colors.blue-700}"
  stroke-informative-solid-dark: "{colors.blue-800-dark}"
  # v117 — Badge outline 의 옅은 테두리(SEED stroke.*-weak = 300). 다크는 400 — 300 은 다크 표면과 1.4:1 · 시트 위 1.2:1 로 묻히고,
  # 800 은 글자(fg-*) · stroke-*-solid 와 같은 색이라 옅은 선이 아니다(사용자 결정 2026-10-03 표시 비교 2A — 토큰 넷을 알고 골랐다)
  stroke-critical-weak: "{colors.red-300}"
  stroke-critical-weak-dark: "{colors.red-400-dark}"
  stroke-positive-weak: "{colors.green-300}"
  stroke-positive-weak-dark: "{colors.green-400-dark}"
  stroke-warning-weak: "{colors.orange-300}"
  stroke-warning-weak-dark: "{colors.orange-400-dark}"
  stroke-informative-weak: "{colors.blue-300}"
  stroke-informative-weak-dark: "{colors.blue-400-dark}"
  # @sync:shared-end (colors-3)
  
  # (border-focus 정의 완료 — v16)

typography:
  # v100 — SEED 타입 스케일(2026-09-29). 크기 t1~t14 와 줄 높이는 SEED 와 같은 px, 굵기는 400 —
  # 강조는 500 · 700 인라인 modifier(SEED t5Medium · t5Bold). 긴 글은 article-body · article-note.
  t1:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 15px
  t2:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  t3:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  t4:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 19px
  t5:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 22px
  t6:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 24px
  t7:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 27px
  t8:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 30px
  t9:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 32px
  t10:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 35px
  t11:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 38px
  t12:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 42px
  t13:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 52px
  t14:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 48px
    fontWeight: 400
    lineHeight: 60px
  screen-title:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 35px
  article-body:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  article-note:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  # 옛 15단계(v82) — 쓰지 않는다(deprecated). 컴포넌트 스펙(YAML)은 모두 t1 ~ t14 · 역할 스타일로 옮겼다(2026-10-16 확인 0곳).
  # 걷지 못한 까닭: 아직 부르는 곳이 있다 — scripts/build-preview-html.mjs · build-site.mjs(옛 미리보기 · 사이트 HTML),
  # scripts/build-examples-html.mjs, recipes/shadcn/components/ui/typography.tsx · examples/typography-examples.mjs,
  # 사이트 Typography 의 "옛 이름" 표. 그곳들을 옮긴 뒤 걷는다. 새 자리에서 부르지 않는다.
  # v82 — Airbnb 태그명(display/title/body/label/caption/badge/overline) 채택,
  # 사양은 한국어 본문 가독성 우선(Pretendard, lh 본문 1.5+). 21 → 15.
  display-xl:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1.12px
  display-lg:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.4px
  display-md:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.32px
  display-sm:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
  title-lg:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  title-md:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  title-sm:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
  body-lg:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  label-sm:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  badge:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.2
  overline:
    fontFamily: "Pretendard, Inter, sans-serif"
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.8px

rounded:
  # v99 — SEED radius 스케일(2px ~ 24px 10단계 + full). 이름도 SEED 와 같다(r1 = 4px).
  r0_5: 2px
  r1: 4px
  r1_5: 6px
  r2: 8px
  r2_5: 10px
  r3: 12px
  r3_5: 14px
  r4: 16px
  r5: 20px
  r6: 24px
  full: 9999px
  # 옛 이름 — 옮기는 동안의 별칭(값은 위 SEED 이름과 같다). 스펙 · 제품이 다 옮기면 걷는다.
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px

spacing:
  # v98 — SEED dimension 스케일(2px 단위 19단계). 이름도 SEED 와 같다(x1 = 4px).
  x0_5: "2px"
  x1: "4px"
  x1_5: "6px"
  x2: "8px"
  x2_5: "10px"
  x3: "12px"
  x3_5: "14px"
  x4: "16px"
  x4_5: "18px"
  x5: "20px"
  x6: "24px"
  x7: "28px"
  x8: "32px"
  x9: "36px"
  x10: "40px"
  x12: "48px"
  x13: "52px"
  x14: "56px"
  x16: "64px"
  # 옛 이름 — 옮기는 동안의 별칭(값은 위 SEED 이름과 같다). 스펙 · 제품이 다 옮기면 걷는다.
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  # v101 — SEED 역할 간격(SEED spacing-x · spacing-y). 값은 위 스케일을 가리킨다.
  global-gutter: "24px"  # x6 — SEED 는 x4(16px). porest 는 앱 규칙(2026-09-14, 본문 24)을 둔다
  between-chips: "8px"  # x2
  component-default: "12px"  # x3
  between-text: "6px"  # x1_5
  nav-to-title: "20px"  # x5
  screen-bottom: "56px"  # x14

components:
  # === Brand-specific 컴포넌트(button-primary, button-outline-on-dark)는
  # === DESIGN.hr.md / DESIGN.desk.md로 분리 (v17)
  
  # === 옛 이름 짝(card · page-text · input · caption-on-card · caption-tertiary-on-card · placeholder-on-input ·
  # disabled-label · alert-text-*) — v102 의 role-* 짝이 같은 일을 새 이름으로 한다. 새 자리에서 부르지 않는다(2026-10-16).
  # 걷지 않은 까닭: 본문의 기록 절(v11 · v13 · v53 등)과 Card 절이 이 이름을 가리킨다 — 기록 절을 정리할 때 함께 걷는다.
  # === 카드 (surface 위 primary 텍스트) ===
  card-light:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-primary}"
  card-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.text-primary-dark}"
  
  # === 페이지 본문 (bg-page 위 primary 텍스트) ===
  page-text-light:
    backgroundColor: "{colors.bg-page}"
    textColor: "{colors.text-primary}"
  page-text-dark:
    backgroundColor: "{colors.bg-page-dark}"
    textColor: "{colors.text-primary-dark}"
  
  # === 입력 필드 (surface-input 위 primary 텍스트) ===
  input-light:
    backgroundColor: "{colors.surface-input}"
    textColor: "{colors.text-primary}"
  input-dark:
    backgroundColor: "{colors.surface-input-dark}"
    textColor: "{colors.text-primary-dark}"
  
  # === 캡션·메타 (secondary 텍스트, surface 위) ===
  caption-on-card-light:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-secondary}"
  caption-on-card-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.text-secondary-dark}"
  
  # === Divider / Outline (border 토큰을 1px 시각 요소의 배경색으로 사용) ===
  # NOTE: 이 컴포넌트들은 textColor 없음 — lint contrast 룰은 미발동.
  # border vs 인접 surface 대비는 spec에 borderColor 프로퍼티가 없어 자동 검증 불가.
  divider-light:
    backgroundColor: "{colors.border-default}"
  divider-dark:
    backgroundColor: "{colors.border-default-dark}"
  outline-strong-light:
    backgroundColor: "{colors.border-strong}"
  outline-strong-dark:
    backgroundColor: "{colors.border-strong-dark}"
  
  # === focus-ring 컴포넌트는 brand 파일로 분리 (v17)
  
  # === Semantic 채움 badge (semantic 배경 + 흰 텍스트) ===
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.text-on-accent}"
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.text-on-accent}"
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.text-on-accent}"
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.text-on-accent}"
  
  # === Semantic 인라인 텍스트 (흰 카드 위 semantic 텍스트) ===
  alert-text-success:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.success}"
  alert-text-error:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.error}"
  alert-text-warning:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.warning}"
  alert-text-info:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.info}"
  
  # === Semantic 다크 표면 위 인라인 텍스트 (-light 변형) ===
  alert-text-success-on-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.success-light}"
  alert-text-error-on-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.error-light}"
  alert-text-warning-on-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.warning-light}"
  alert-text-info-on-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.info-light}"
  
  # === User identification (v58: avatar — chart palette categorical) ===
  avatar:
    backgroundColor: "{colors.chart-blue}"
    textColor: "{colors.text-on-accent}"
  
  # === Chart elements (sparse, fill/stroke 용도 — chart 요소는 textColor 페어가 아님) ===
  chart-color-red:
    backgroundColor: "{colors.chart-red}"
  chart-color-orange:
    backgroundColor: "{colors.chart-orange}"
  chart-color-yellow:
    backgroundColor: "{colors.chart-yellow}"
  chart-color-green:
    backgroundColor: "{colors.chart-green}"
  chart-color-blue:
    backgroundColor: "{colors.chart-blue}"
  chart-color-indigo:
    backgroundColor: "{colors.chart-indigo}"
  chart-color-violet:
    backgroundColor: "{colors.chart-violet}"
  chart-color-pink:
    backgroundColor: "{colors.chart-pink}"
  chart-color-brown:
    backgroundColor: "{colors.chart-brown}"
  chart-color-gray:
    backgroundColor: "{colors.chart-gray}"
  # chart dark 변형 컴포넌트 (어두운 표면 위)
  chart-color-red-on-dark:
    backgroundColor: "{colors.chart-red-dark}"
  chart-color-orange-on-dark:
    backgroundColor: "{colors.chart-orange-dark}"
  chart-color-yellow-on-dark:
    backgroundColor: "{colors.chart-yellow-dark}"
  chart-color-green-on-dark:
    backgroundColor: "{colors.chart-green-dark}"
  chart-color-blue-on-dark:
    backgroundColor: "{colors.chart-blue-dark}"
  chart-color-indigo-on-dark:
    backgroundColor: "{colors.chart-indigo-dark}"
  chart-color-violet-on-dark:
    backgroundColor: "{colors.chart-violet-dark}"
  chart-color-pink-on-dark:
    backgroundColor: "{colors.chart-pink-dark}"
  chart-color-brown-on-dark:
    backgroundColor: "{colors.chart-brown-dark}"
  chart-color-gray-on-dark:
    backgroundColor: "{colors.chart-gray-dark}"
  # v111 — 옅은 바탕 위 글자 대비(lint 가 잰다)
  chart-red-contrast-on-weak-light:
    backgroundColor: "{colors.chart-red-weak}"
    textColor: "{colors.chart-red-contrast}"
  chart-red-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-red-weak-dark}"
    textColor: "{colors.chart-red-contrast-dark}"
  chart-red-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-red-subtle}"
    textColor: "{colors.chart-red-contrast}"
  chart-red-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-red-subtle-dark}"
    textColor: "{colors.chart-red-contrast-dark}"
  chart-orange-contrast-on-weak-light:
    backgroundColor: "{colors.chart-orange-weak}"
    textColor: "{colors.chart-orange-contrast}"
  chart-orange-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-orange-weak-dark}"
    textColor: "{colors.chart-orange-contrast-dark}"
  chart-orange-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-orange-subtle}"
    textColor: "{colors.chart-orange-contrast}"
  chart-orange-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-orange-subtle-dark}"
    textColor: "{colors.chart-orange-contrast-dark}"
  chart-yellow-contrast-on-weak-light:
    backgroundColor: "{colors.chart-yellow-weak}"
    textColor: "{colors.chart-yellow-contrast}"
  chart-yellow-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-yellow-weak-dark}"
    textColor: "{colors.chart-yellow-contrast-dark}"
  chart-yellow-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-yellow-subtle}"
    textColor: "{colors.chart-yellow-contrast}"
  chart-yellow-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-yellow-subtle-dark}"
    textColor: "{colors.chart-yellow-contrast-dark}"
  chart-green-contrast-on-weak-light:
    backgroundColor: "{colors.chart-green-weak}"
    textColor: "{colors.chart-green-contrast}"
  chart-green-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-green-weak-dark}"
    textColor: "{colors.chart-green-contrast-dark}"
  chart-green-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-green-subtle}"
    textColor: "{colors.chart-green-contrast}"
  chart-green-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-green-subtle-dark}"
    textColor: "{colors.chart-green-contrast-dark}"
  chart-blue-contrast-on-weak-light:
    backgroundColor: "{colors.chart-blue-weak}"
    textColor: "{colors.chart-blue-contrast}"
  chart-blue-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-blue-weak-dark}"
    textColor: "{colors.chart-blue-contrast-dark}"
  chart-blue-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-blue-subtle}"
    textColor: "{colors.chart-blue-contrast}"
  chart-blue-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-blue-subtle-dark}"
    textColor: "{colors.chart-blue-contrast-dark}"
  chart-indigo-contrast-on-weak-light:
    backgroundColor: "{colors.chart-indigo-weak}"
    textColor: "{colors.chart-indigo-contrast}"
  chart-indigo-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-indigo-weak-dark}"
    textColor: "{colors.chart-indigo-contrast-dark}"
  chart-indigo-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-indigo-subtle}"
    textColor: "{colors.chart-indigo-contrast}"
  chart-indigo-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-indigo-subtle-dark}"
    textColor: "{colors.chart-indigo-contrast-dark}"
  chart-violet-contrast-on-weak-light:
    backgroundColor: "{colors.chart-violet-weak}"
    textColor: "{colors.chart-violet-contrast}"
  chart-violet-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-violet-weak-dark}"
    textColor: "{colors.chart-violet-contrast-dark}"
  chart-violet-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-violet-subtle}"
    textColor: "{colors.chart-violet-contrast}"
  chart-violet-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-violet-subtle-dark}"
    textColor: "{colors.chart-violet-contrast-dark}"
  chart-pink-contrast-on-weak-light:
    backgroundColor: "{colors.chart-pink-weak}"
    textColor: "{colors.chart-pink-contrast}"
  chart-pink-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-pink-weak-dark}"
    textColor: "{colors.chart-pink-contrast-dark}"
  chart-pink-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-pink-subtle}"
    textColor: "{colors.chart-pink-contrast}"
  chart-pink-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-pink-subtle-dark}"
    textColor: "{colors.chart-pink-contrast-dark}"
  chart-brown-contrast-on-weak-light:
    backgroundColor: "{colors.chart-brown-weak}"
    textColor: "{colors.chart-brown-contrast}"
  chart-brown-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-brown-weak-dark}"
    textColor: "{colors.chart-brown-contrast-dark}"
  chart-brown-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-brown-subtle}"
    textColor: "{colors.chart-brown-contrast}"
  chart-brown-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-brown-subtle-dark}"
    textColor: "{colors.chart-brown-contrast-dark}"
  chart-gray-contrast-on-weak-light:
    backgroundColor: "{colors.chart-gray-weak}"
    textColor: "{colors.chart-gray-contrast}"
  chart-gray-contrast-on-weak-dark:
    backgroundColor: "{colors.chart-gray-weak-dark}"
    textColor: "{colors.chart-gray-contrast-dark}"
  chart-gray-contrast-on-subtle-light:
    backgroundColor: "{colors.chart-gray-subtle}"
    textColor: "{colors.chart-gray-contrast}"
  chart-gray-contrast-on-subtle-dark:
    backgroundColor: "{colors.chart-gray-subtle-dark}"
    textColor: "{colors.chart-gray-contrast-dark}"
  
  # === Tertiary 텍스트 (placeholder, caption-tertiary, hint) ===
  caption-tertiary-on-card-light:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-tertiary}"
  caption-tertiary-on-card-dark:
    backgroundColor: "{colors.surface-default-dark}"
    textColor: "{colors.text-tertiary-dark}"
  placeholder-on-input-light:
    backgroundColor: "{colors.surface-input}"
    textColor: "{colors.text-tertiary}"
  placeholder-on-input-dark:
    backgroundColor: "{colors.surface-input-dark}"
    textColor: "{colors.text-tertiary-dark}"
  
  # === Disabled 텍스트 (textColor만 — WCAG 1.4.3 incidental 예외 인정, lint contrast 룰 비대상) ===
  # textColor만 가진 sparse 컴포넌트는 contrastCheck 미발동. 부모 표면 색은 런타임 상속.
  disabled-label-light:
    textColor: "{colors.text-disabled}"
  disabled-label-dark:
    textColor: "{colors.text-disabled-dark}"
  
  # === v102 — 역할 색 짝 (SEED 역할 — 글자가 놓이는 배경과 함께). 짝마다 대비를 lint 가 잰다(라이트 · 다크) ===
  role-neutral-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-neutral}"
  role-neutral-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-neutral-dark}"
  role-neutral-muted-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-neutral-muted}"
  role-neutral-muted-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-neutral-muted-dark}"
  role-neutral-subtle-on-basement-light:
    backgroundColor: "{colors.bg-layer-basement}"
    textColor: "{colors.fg-neutral-subtle}"
  role-neutral-subtle-on-basement-dark:
    backgroundColor: "{colors.bg-layer-basement-dark}"
    textColor: "{colors.fg-neutral-subtle-dark}"
  # v119 — 자리 글은 SEED 처럼 gray-600(사용자 결정 2026-10-16 글자 역할 D7). 입력칸 위 3.87:1 · 다크 3.18:1 로 4.5:1 밑이라
  # 막힘 글자(role-disabled-label)처럼 textColor 만 두어 대비 검사에서 뺀다 — 대가는 Typography "글자 역할" 절 · v102 표 비고.
  role-placeholder-light:
    textColor: "{colors.fg-placeholder}"
  role-placeholder-dark:
    textColor: "{colors.fg-placeholder-dark}"
  role-neutral-on-default-pressed-light:
    backgroundColor: "{colors.bg-layer-default-pressed}"
    textColor: "{colors.fg-neutral}"
  role-neutral-on-default-pressed-dark:
    backgroundColor: "{colors.bg-layer-default-pressed-dark}"
    textColor: "{colors.fg-neutral-dark}"
  role-neutral-on-floating-light:
    backgroundColor: "{colors.bg-layer-floating}"
    textColor: "{colors.fg-neutral}"
  role-neutral-on-floating-dark:
    backgroundColor: "{colors.bg-layer-floating-dark}"
    textColor: "{colors.fg-neutral-dark}"
  role-neutral-on-floating-pressed-light:
    backgroundColor: "{colors.bg-layer-floating-pressed}"
    textColor: "{colors.fg-neutral}"
  role-neutral-on-floating-pressed-dark:
    backgroundColor: "{colors.bg-layer-floating-pressed-dark}"
    textColor: "{colors.fg-neutral-dark}"
  role-neutral-on-weak-pressed-light:
    backgroundColor: "{colors.bg-neutral-weak-pressed}"
    textColor: "{colors.fg-neutral}"
  role-neutral-on-weak-pressed-dark:
    backgroundColor: "{colors.bg-neutral-weak-pressed-dark}"
    textColor: "{colors.fg-neutral-dark}"
  role-inverted-light:
    backgroundColor: "{colors.bg-neutral-inverted}"
    textColor: "{colors.fg-neutral-inverted}"
  role-inverted-dark:
    backgroundColor: "{colors.bg-neutral-inverted-dark}"
    textColor: "{colors.fg-neutral-inverted-dark}"
  role-inverted-pressed-light:
    backgroundColor: "{colors.bg-neutral-inverted-pressed}"
    textColor: "{colors.fg-neutral-inverted}"
  role-inverted-pressed-dark:
    backgroundColor: "{colors.bg-neutral-inverted-pressed-dark}"
    textColor: "{colors.fg-neutral-inverted-dark}"
  role-positive-on-inverted-light:
    backgroundColor: "{colors.bg-neutral-inverted}"
    textColor: "{colors.fg-positive-inverted}"
  role-positive-on-inverted-dark:
    backgroundColor: "{colors.bg-neutral-inverted-dark}"
    textColor: "{colors.fg-positive-inverted-dark}"
  role-critical-on-inverted-light:
    backgroundColor: "{colors.bg-neutral-inverted}"
    textColor: "{colors.fg-critical-inverted}"
  role-critical-on-inverted-dark:
    backgroundColor: "{colors.bg-neutral-inverted-dark}"
    textColor: "{colors.fg-critical-inverted-dark}"
  role-critical-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-critical}"
  role-critical-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-critical-dark}"
  role-on-critical-solid-light:
    backgroundColor: "{colors.bg-critical-solid}"
    textColor: "{colors.static-white}"
  role-on-critical-solid-dark:
    backgroundColor: "{colors.bg-critical-solid-dark}"
    textColor: "{colors.static-white}"
  role-on-critical-solid-pressed-light:
    backgroundColor: "{colors.bg-critical-solid-pressed}"
    textColor: "{colors.static-white}"
  role-on-critical-solid-pressed-dark:
    backgroundColor: "{colors.bg-critical-solid-pressed-dark}"
    textColor: "{colors.static-white}"
  role-critical-contrast-on-weak-light:
    backgroundColor: "{colors.bg-critical-weak}"
    textColor: "{colors.fg-critical-contrast}"
  role-critical-contrast-on-weak-dark:
    backgroundColor: "{colors.bg-critical-weak-dark}"
    textColor: "{colors.fg-critical-contrast-dark}"
  role-critical-contrast-on-weak-pressed-light:
    backgroundColor: "{colors.bg-critical-weak-pressed}"
    textColor: "{colors.fg-critical-contrast}"
  role-critical-contrast-on-weak-pressed-dark:
    backgroundColor: "{colors.bg-critical-weak-pressed-dark}"
    textColor: "{colors.fg-critical-contrast-dark}"
  role-positive-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-positive}"
  role-positive-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-positive-dark}"
  role-on-positive-solid-light:
    backgroundColor: "{colors.bg-positive-solid}"
    textColor: "{colors.static-white}"
  role-on-positive-solid-dark:
    backgroundColor: "{colors.bg-positive-solid-dark}"
    textColor: "{colors.static-white}"
  role-on-positive-solid-pressed-light:
    backgroundColor: "{colors.bg-positive-solid-pressed}"
    textColor: "{colors.static-white}"
  role-on-positive-solid-pressed-dark:
    backgroundColor: "{colors.bg-positive-solid-pressed-dark}"
    textColor: "{colors.static-white}"
  role-positive-contrast-on-weak-light:
    backgroundColor: "{colors.bg-positive-weak}"
    textColor: "{colors.fg-positive-contrast}"
  role-positive-contrast-on-weak-dark:
    backgroundColor: "{colors.bg-positive-weak-dark}"
    textColor: "{colors.fg-positive-contrast-dark}"
  role-positive-contrast-on-weak-pressed-light:
    backgroundColor: "{colors.bg-positive-weak-pressed}"
    textColor: "{colors.fg-positive-contrast}"
  role-positive-contrast-on-weak-pressed-dark:
    backgroundColor: "{colors.bg-positive-weak-pressed-dark}"
    textColor: "{colors.fg-positive-contrast-dark}"
  role-warning-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-warning}"
  role-warning-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-warning-dark}"
  role-on-warning-solid-light:
    backgroundColor: "{colors.bg-warning-solid}"
    textColor: "{colors.static-white}"
  role-on-warning-solid-dark:
    backgroundColor: "{colors.bg-warning-solid-dark}"
    textColor: "{colors.static-white}"
  role-on-warning-solid-pressed-light:
    backgroundColor: "{colors.bg-warning-solid-pressed}"
    textColor: "{colors.static-white}"
  role-on-warning-solid-pressed-dark:
    backgroundColor: "{colors.bg-warning-solid-pressed-dark}"
    textColor: "{colors.static-white}"
  role-warning-contrast-on-weak-light:
    backgroundColor: "{colors.bg-warning-weak}"
    textColor: "{colors.fg-warning-contrast}"
  role-warning-contrast-on-weak-dark:
    backgroundColor: "{colors.bg-warning-weak-dark}"
    textColor: "{colors.fg-warning-contrast-dark}"
  role-warning-contrast-on-weak-pressed-light:
    backgroundColor: "{colors.bg-warning-weak-pressed}"
    textColor: "{colors.fg-warning-contrast}"
  role-warning-contrast-on-weak-pressed-dark:
    backgroundColor: "{colors.bg-warning-weak-pressed-dark}"
    textColor: "{colors.fg-warning-contrast-dark}"
  role-informative-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-informative}"
  role-informative-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-informative-dark}"
  role-on-informative-solid-light:
    backgroundColor: "{colors.bg-informative-solid}"
    textColor: "{colors.static-white}"
  role-on-informative-solid-dark:
    backgroundColor: "{colors.bg-informative-solid-dark}"
    textColor: "{colors.static-white}"
  role-on-informative-solid-pressed-light:
    backgroundColor: "{colors.bg-informative-solid-pressed}"
    textColor: "{colors.static-white}"
  role-on-informative-solid-pressed-dark:
    backgroundColor: "{colors.bg-informative-solid-pressed-dark}"
    textColor: "{colors.static-white}"
  role-informative-contrast-on-weak-light:
    backgroundColor: "{colors.bg-informative-weak}"
    textColor: "{colors.fg-informative-contrast}"
  role-informative-contrast-on-weak-dark:
    backgroundColor: "{colors.bg-informative-weak-dark}"
    textColor: "{colors.fg-informative-contrast-dark}"
  role-informative-contrast-on-weak-pressed-light:
    backgroundColor: "{colors.bg-informative-weak-pressed}"
    textColor: "{colors.fg-informative-contrast}"
  role-informative-contrast-on-weak-pressed-dark:
    backgroundColor: "{colors.bg-informative-weak-pressed-dark}"
    textColor: "{colors.fg-informative-contrast-dark}"
  role-disabled-surface-light:
    backgroundColor: "{colors.bg-disabled}"
  role-disabled-surface-dark:
    backgroundColor: "{colors.bg-disabled-dark}"
  role-disabled-label-light:
    textColor: "{colors.fg-disabled}"
  role-disabled-label-dark:
    textColor: "{colors.fg-disabled-dark}"
  role-stroke-neutral-subtle-light:
    backgroundColor: "{colors.stroke-neutral-subtle}"
  role-stroke-neutral-subtle-dark:
    backgroundColor: "{colors.stroke-neutral-subtle-dark}"
  role-stroke-neutral-weak-light:
    backgroundColor: "{colors.stroke-neutral-weak}"
  role-stroke-neutral-weak-dark:
    backgroundColor: "{colors.stroke-neutral-weak-dark}"
  role-stroke-neutral-solid-light:
    backgroundColor: "{colors.stroke-neutral-solid}"
  role-stroke-neutral-solid-dark:
    backgroundColor: "{colors.stroke-neutral-solid-dark}"
  role-stroke-neutral-contrast-light:
    backgroundColor: "{colors.stroke-neutral-contrast}"
  role-stroke-neutral-contrast-dark:
    backgroundColor: "{colors.stroke-neutral-contrast-dark}"
  # v118 — 이미지 위 투명 윤곽
  role-stroke-neutral-overlay-light:
    backgroundColor: "{colors.stroke-neutral-overlay}"
  role-stroke-neutral-overlay-dark:
    backgroundColor: "{colors.stroke-neutral-overlay-dark}"
  # v120 — 회색 바닥 위 칩 · 세그먼트 트랙의 투명 바탕
  role-bg-neutral-weak-alpha-light:
    backgroundColor: "{colors.bg-neutral-weak-alpha}"
  role-bg-neutral-weak-alpha-dark:
    backgroundColor: "{colors.bg-neutral-weak-alpha-dark}"
  role-bg-neutral-weak-alpha-pressed-light:
    backgroundColor: "{colors.bg-neutral-weak-alpha-pressed}"
  role-bg-neutral-weak-alpha-pressed-dark:
    backgroundColor: "{colors.bg-neutral-weak-alpha-pressed-dark}"
  role-stroke-critical-solid-light:
    backgroundColor: "{colors.stroke-critical-solid}"
  role-stroke-critical-solid-dark:
    backgroundColor: "{colors.stroke-critical-solid-dark}"
  role-stroke-positive-solid-light:
    backgroundColor: "{colors.stroke-positive-solid}"
  role-stroke-positive-solid-dark:
    backgroundColor: "{colors.stroke-positive-solid-dark}"
  role-stroke-warning-solid-light:
    backgroundColor: "{colors.stroke-warning-solid}"
  role-stroke-warning-solid-dark:
    backgroundColor: "{colors.stroke-warning-solid-dark}"
  role-stroke-informative-solid-light:
    backgroundColor: "{colors.stroke-informative-solid}"
  role-stroke-informative-solid-dark:
    backgroundColor: "{colors.stroke-informative-solid-dark}"
  # v117 — Badge outline 의 옅은 테두리
  role-stroke-critical-weak-light:
    backgroundColor: "{colors.stroke-critical-weak}"
  role-stroke-critical-weak-dark:
    backgroundColor: "{colors.stroke-critical-weak-dark}"
  role-stroke-positive-weak-light:
    backgroundColor: "{colors.stroke-positive-weak}"
  role-stroke-positive-weak-dark:
    backgroundColor: "{colors.stroke-positive-weak-dark}"
  role-stroke-warning-weak-light:
    backgroundColor: "{colors.stroke-warning-weak}"
  role-stroke-warning-weak-dark:
    backgroundColor: "{colors.stroke-warning-weak-dark}"
  role-stroke-informative-weak-light:
    backgroundColor: "{colors.stroke-informative-weak}"
  role-stroke-informative-weak-dark:
    backgroundColor: "{colors.stroke-informative-weak-dark}"
  # === v108 — 팔레트 보기용. 역할이 쓰지 않는 단계도 검사기가 "쓰는 색" 으로 세게 한다 ===
  palette-gray-00:
    backgroundColor: "{colors.gray-00}"
  palette-gray-00-dark:
    backgroundColor: "{colors.gray-00-dark}"
  palette-gray-100:
    backgroundColor: "{colors.gray-100}"
  palette-gray-100-dark:
    backgroundColor: "{colors.gray-100-dark}"
  palette-gray-200:
    backgroundColor: "{colors.gray-200}"
  palette-gray-200-dark:
    backgroundColor: "{colors.gray-200-dark}"
  palette-gray-300:
    backgroundColor: "{colors.gray-300}"
  palette-gray-300-dark:
    backgroundColor: "{colors.gray-300-dark}"
  palette-gray-400:
    backgroundColor: "{colors.gray-400}"
  palette-gray-400-dark:
    backgroundColor: "{colors.gray-400-dark}"
  palette-gray-500:
    backgroundColor: "{colors.gray-500}"
  palette-gray-500-dark:
    backgroundColor: "{colors.gray-500-dark}"
  palette-gray-600:
    backgroundColor: "{colors.gray-600}"
  palette-gray-600-dark:
    backgroundColor: "{colors.gray-600-dark}"
  palette-gray-700:
    backgroundColor: "{colors.gray-700}"
  palette-gray-700-dark:
    backgroundColor: "{colors.gray-700-dark}"
  palette-gray-800:
    backgroundColor: "{colors.gray-800}"
  palette-gray-800-dark:
    backgroundColor: "{colors.gray-800-dark}"
  palette-gray-900:
    backgroundColor: "{colors.gray-900}"
  palette-gray-900-dark:
    backgroundColor: "{colors.gray-900-dark}"
  palette-gray-1000:
    backgroundColor: "{colors.gray-1000}"
  palette-gray-1000-dark:
    backgroundColor: "{colors.gray-1000-dark}"
  palette-red-100:
    backgroundColor: "{colors.red-100}"
  palette-red-100-dark:
    backgroundColor: "{colors.red-100-dark}"
  palette-red-200:
    backgroundColor: "{colors.red-200}"
  palette-red-200-dark:
    backgroundColor: "{colors.red-200-dark}"
  palette-red-300:
    backgroundColor: "{colors.red-300}"
  palette-red-300-dark:
    backgroundColor: "{colors.red-300-dark}"
  palette-red-400:
    backgroundColor: "{colors.red-400}"
  palette-red-400-dark:
    backgroundColor: "{colors.red-400-dark}"
  palette-red-500:
    backgroundColor: "{colors.red-500}"
  palette-red-500-dark:
    backgroundColor: "{colors.red-500-dark}"
  palette-red-600:
    backgroundColor: "{colors.red-600}"
  palette-red-600-dark:
    backgroundColor: "{colors.red-600-dark}"
  palette-red-700:
    backgroundColor: "{colors.red-700}"
  palette-red-700-dark:
    backgroundColor: "{colors.red-700-dark}"
  palette-red-800:
    backgroundColor: "{colors.red-800}"
  palette-red-800-dark:
    backgroundColor: "{colors.red-800-dark}"
  palette-red-900:
    backgroundColor: "{colors.red-900}"
  palette-red-900-dark:
    backgroundColor: "{colors.red-900-dark}"
  palette-red-1000:
    backgroundColor: "{colors.red-1000}"
  palette-red-1000-dark:
    backgroundColor: "{colors.red-1000-dark}"
  palette-green-100:
    backgroundColor: "{colors.green-100}"
  palette-green-100-dark:
    backgroundColor: "{colors.green-100-dark}"
  palette-green-200:
    backgroundColor: "{colors.green-200}"
  palette-green-200-dark:
    backgroundColor: "{colors.green-200-dark}"
  palette-green-300:
    backgroundColor: "{colors.green-300}"
  palette-green-300-dark:
    backgroundColor: "{colors.green-300-dark}"
  palette-green-400:
    backgroundColor: "{colors.green-400}"
  palette-green-400-dark:
    backgroundColor: "{colors.green-400-dark}"
  palette-green-500:
    backgroundColor: "{colors.green-500}"
  palette-green-500-dark:
    backgroundColor: "{colors.green-500-dark}"
  palette-green-600:
    backgroundColor: "{colors.green-600}"
  palette-green-600-dark:
    backgroundColor: "{colors.green-600-dark}"
  palette-green-700:
    backgroundColor: "{colors.green-700}"
  palette-green-700-dark:
    backgroundColor: "{colors.green-700-dark}"
  palette-green-800:
    backgroundColor: "{colors.green-800}"
  palette-green-800-dark:
    backgroundColor: "{colors.green-800-dark}"
  palette-green-900:
    backgroundColor: "{colors.green-900}"
  palette-green-900-dark:
    backgroundColor: "{colors.green-900-dark}"
  palette-green-1000:
    backgroundColor: "{colors.green-1000}"
  palette-green-1000-dark:
    backgroundColor: "{colors.green-1000-dark}"
  palette-orange-100:
    backgroundColor: "{colors.orange-100}"
  palette-orange-100-dark:
    backgroundColor: "{colors.orange-100-dark}"
  palette-orange-200:
    backgroundColor: "{colors.orange-200}"
  palette-orange-200-dark:
    backgroundColor: "{colors.orange-200-dark}"
  palette-orange-300:
    backgroundColor: "{colors.orange-300}"
  palette-orange-300-dark:
    backgroundColor: "{colors.orange-300-dark}"
  palette-orange-400:
    backgroundColor: "{colors.orange-400}"
  palette-orange-400-dark:
    backgroundColor: "{colors.orange-400-dark}"
  palette-orange-500:
    backgroundColor: "{colors.orange-500}"
  palette-orange-500-dark:
    backgroundColor: "{colors.orange-500-dark}"
  palette-orange-600:
    backgroundColor: "{colors.orange-600}"
  palette-orange-600-dark:
    backgroundColor: "{colors.orange-600-dark}"
  palette-orange-700:
    backgroundColor: "{colors.orange-700}"
  palette-orange-700-dark:
    backgroundColor: "{colors.orange-700-dark}"
  palette-orange-800:
    backgroundColor: "{colors.orange-800}"
  palette-orange-800-dark:
    backgroundColor: "{colors.orange-800-dark}"
  palette-orange-900:
    backgroundColor: "{colors.orange-900}"
  palette-orange-900-dark:
    backgroundColor: "{colors.orange-900-dark}"
  palette-orange-1000:
    backgroundColor: "{colors.orange-1000}"
  palette-orange-1000-dark:
    backgroundColor: "{colors.orange-1000-dark}"
  palette-blue-100:
    backgroundColor: "{colors.blue-100}"
  palette-blue-100-dark:
    backgroundColor: "{colors.blue-100-dark}"
  palette-blue-200:
    backgroundColor: "{colors.blue-200}"
  palette-blue-200-dark:
    backgroundColor: "{colors.blue-200-dark}"
  palette-blue-300:
    backgroundColor: "{colors.blue-300}"
  palette-blue-300-dark:
    backgroundColor: "{colors.blue-300-dark}"
  palette-blue-400:
    backgroundColor: "{colors.blue-400}"
  palette-blue-400-dark:
    backgroundColor: "{colors.blue-400-dark}"
  palette-blue-500:
    backgroundColor: "{colors.blue-500}"
  palette-blue-500-dark:
    backgroundColor: "{colors.blue-500-dark}"
  palette-blue-600:
    backgroundColor: "{colors.blue-600}"
  palette-blue-600-dark:
    backgroundColor: "{colors.blue-600-dark}"
  palette-blue-700:
    backgroundColor: "{colors.blue-700}"
  palette-blue-700-dark:
    backgroundColor: "{colors.blue-700-dark}"
  palette-blue-800:
    backgroundColor: "{colors.blue-800}"
  palette-blue-800-dark:
    backgroundColor: "{colors.blue-800-dark}"
  palette-blue-900:
    backgroundColor: "{colors.blue-900}"
  palette-blue-900-dark:
    backgroundColor: "{colors.blue-900-dark}"
  palette-blue-1000:
    backgroundColor: "{colors.blue-1000}"
  palette-blue-1000-dark:
    backgroundColor: "{colors.blue-1000-dark}"
  palette-yellow-100:
    backgroundColor: "{colors.yellow-100}"
  palette-yellow-100-dark:
    backgroundColor: "{colors.yellow-100-dark}"
  palette-yellow-200:
    backgroundColor: "{colors.yellow-200}"
  palette-yellow-200-dark:
    backgroundColor: "{colors.yellow-200-dark}"
  palette-yellow-300:
    backgroundColor: "{colors.yellow-300}"
  palette-yellow-300-dark:
    backgroundColor: "{colors.yellow-300-dark}"
  palette-yellow-400:
    backgroundColor: "{colors.yellow-400}"
  palette-yellow-400-dark:
    backgroundColor: "{colors.yellow-400-dark}"
  palette-yellow-500:
    backgroundColor: "{colors.yellow-500}"
  palette-yellow-500-dark:
    backgroundColor: "{colors.yellow-500-dark}"
  palette-yellow-600:
    backgroundColor: "{colors.yellow-600}"
  palette-yellow-600-dark:
    backgroundColor: "{colors.yellow-600-dark}"
  palette-yellow-700:
    backgroundColor: "{colors.yellow-700}"
  palette-yellow-700-dark:
    backgroundColor: "{colors.yellow-700-dark}"
  palette-yellow-800:
    backgroundColor: "{colors.yellow-800}"
  palette-yellow-800-dark:
    backgroundColor: "{colors.yellow-800-dark}"
  palette-yellow-900:
    backgroundColor: "{colors.yellow-900}"
  palette-yellow-900-dark:
    backgroundColor: "{colors.yellow-900-dark}"
  palette-yellow-1000:
    backgroundColor: "{colors.yellow-1000}"
  palette-yellow-1000-dark:
    backgroundColor: "{colors.yellow-1000-dark}"
  palette-indigo-100:
    backgroundColor: "{colors.indigo-100}"
  palette-indigo-100-dark:
    backgroundColor: "{colors.indigo-100-dark}"
  palette-indigo-200:
    backgroundColor: "{colors.indigo-200}"
  palette-indigo-200-dark:
    backgroundColor: "{colors.indigo-200-dark}"
  palette-indigo-300:
    backgroundColor: "{colors.indigo-300}"
  palette-indigo-300-dark:
    backgroundColor: "{colors.indigo-300-dark}"
  palette-indigo-400:
    backgroundColor: "{colors.indigo-400}"
  palette-indigo-400-dark:
    backgroundColor: "{colors.indigo-400-dark}"
  palette-indigo-500:
    backgroundColor: "{colors.indigo-500}"
  palette-indigo-500-dark:
    backgroundColor: "{colors.indigo-500-dark}"
  palette-indigo-600:
    backgroundColor: "{colors.indigo-600}"
  palette-indigo-600-dark:
    backgroundColor: "{colors.indigo-600-dark}"
  palette-indigo-700:
    backgroundColor: "{colors.indigo-700}"
  palette-indigo-700-dark:
    backgroundColor: "{colors.indigo-700-dark}"
  palette-indigo-800:
    backgroundColor: "{colors.indigo-800}"
  palette-indigo-800-dark:
    backgroundColor: "{colors.indigo-800-dark}"
  palette-indigo-900:
    backgroundColor: "{colors.indigo-900}"
  palette-indigo-900-dark:
    backgroundColor: "{colors.indigo-900-dark}"
  palette-indigo-1000:
    backgroundColor: "{colors.indigo-1000}"
  palette-indigo-1000-dark:
    backgroundColor: "{colors.indigo-1000-dark}"
  palette-violet-100:
    backgroundColor: "{colors.violet-100}"
  palette-violet-100-dark:
    backgroundColor: "{colors.violet-100-dark}"
  palette-violet-200:
    backgroundColor: "{colors.violet-200}"
  palette-violet-200-dark:
    backgroundColor: "{colors.violet-200-dark}"
  palette-violet-300:
    backgroundColor: "{colors.violet-300}"
  palette-violet-300-dark:
    backgroundColor: "{colors.violet-300-dark}"
  palette-violet-400:
    backgroundColor: "{colors.violet-400}"
  palette-violet-400-dark:
    backgroundColor: "{colors.violet-400-dark}"
  palette-violet-500:
    backgroundColor: "{colors.violet-500}"
  palette-violet-500-dark:
    backgroundColor: "{colors.violet-500-dark}"
  palette-violet-600:
    backgroundColor: "{colors.violet-600}"
  palette-violet-600-dark:
    backgroundColor: "{colors.violet-600-dark}"
  palette-violet-700:
    backgroundColor: "{colors.violet-700}"
  palette-violet-700-dark:
    backgroundColor: "{colors.violet-700-dark}"
  palette-violet-800:
    backgroundColor: "{colors.violet-800}"
  palette-violet-800-dark:
    backgroundColor: "{colors.violet-800-dark}"
  palette-violet-900:
    backgroundColor: "{colors.violet-900}"
  palette-violet-900-dark:
    backgroundColor: "{colors.violet-900-dark}"
  palette-violet-1000:
    backgroundColor: "{colors.violet-1000}"
  palette-violet-1000-dark:
    backgroundColor: "{colors.violet-1000-dark}"
  palette-pink-100:
    backgroundColor: "{colors.pink-100}"
  palette-pink-100-dark:
    backgroundColor: "{colors.pink-100-dark}"
  palette-pink-200:
    backgroundColor: "{colors.pink-200}"
  palette-pink-200-dark:
    backgroundColor: "{colors.pink-200-dark}"
  palette-pink-300:
    backgroundColor: "{colors.pink-300}"
  palette-pink-300-dark:
    backgroundColor: "{colors.pink-300-dark}"
  palette-pink-400:
    backgroundColor: "{colors.pink-400}"
  palette-pink-400-dark:
    backgroundColor: "{colors.pink-400-dark}"
  palette-pink-500:
    backgroundColor: "{colors.pink-500}"
  palette-pink-500-dark:
    backgroundColor: "{colors.pink-500-dark}"
  palette-pink-600:
    backgroundColor: "{colors.pink-600}"
  palette-pink-600-dark:
    backgroundColor: "{colors.pink-600-dark}"
  palette-pink-700:
    backgroundColor: "{colors.pink-700}"
  palette-pink-700-dark:
    backgroundColor: "{colors.pink-700-dark}"
  palette-pink-800:
    backgroundColor: "{colors.pink-800}"
  palette-pink-800-dark:
    backgroundColor: "{colors.pink-800-dark}"
  palette-pink-900:
    backgroundColor: "{colors.pink-900}"
  palette-pink-900-dark:
    backgroundColor: "{colors.pink-900-dark}"
  palette-pink-1000:
    backgroundColor: "{colors.pink-1000}"
  palette-pink-1000-dark:
    backgroundColor: "{colors.pink-1000-dark}"
  palette-brown-100:
    backgroundColor: "{colors.brown-100}"
  palette-brown-100-dark:
    backgroundColor: "{colors.brown-100-dark}"
  palette-brown-200:
    backgroundColor: "{colors.brown-200}"
  palette-brown-200-dark:
    backgroundColor: "{colors.brown-200-dark}"
  palette-brown-300:
    backgroundColor: "{colors.brown-300}"
  palette-brown-300-dark:
    backgroundColor: "{colors.brown-300-dark}"
  palette-brown-400:
    backgroundColor: "{colors.brown-400}"
  palette-brown-400-dark:
    backgroundColor: "{colors.brown-400-dark}"
  palette-brown-500:
    backgroundColor: "{colors.brown-500}"
  palette-brown-500-dark:
    backgroundColor: "{colors.brown-500-dark}"
  palette-brown-600:
    backgroundColor: "{colors.brown-600}"
  palette-brown-600-dark:
    backgroundColor: "{colors.brown-600-dark}"
  palette-brown-700:
    backgroundColor: "{colors.brown-700}"
  palette-brown-700-dark:
    backgroundColor: "{colors.brown-700-dark}"
  palette-brown-800:
    backgroundColor: "{colors.brown-800}"
  palette-brown-800-dark:
    backgroundColor: "{colors.brown-800-dark}"
  palette-brown-900:
    backgroundColor: "{colors.brown-900}"
  palette-brown-900-dark:
    backgroundColor: "{colors.brown-900-dark}"
  palette-brown-1000:
    backgroundColor: "{colors.brown-1000}"
  palette-brown-1000-dark:
    backgroundColor: "{colors.brown-1000-dark}"
---

## Overview

Porest는 "사람과 일상이 숲처럼 자라나는" 가치를 담은 듀얼 브랜드 시스템입니다.
HR(조직 관리, B2B)과 Desk(개인 생산성, B2C)는 동일한 골격을 공유하되 primary 색상으로만 분기합니다.

레퍼런스 — 토스의 신뢰감 있는 미니멀리즘, 전 연령 가독성.

### 파일 분리 (v17부터)
- **`DESIGN.md`** (이 파일): 공유 baseline — typography, spacing, rounded, neutral colors, neutral components. brand-agnostic이므로 `primary` literal 미정의 → lint missingPrimary warning 1건 영구 수용(공유 라이브러리 진실 신호).
- **`DESIGN.hr.md`**: HR 브랜드 self-contained 시스템 — 공유 토큰 복제 + HR primary `#357B5F` + HR brand 컴포넌트. brand 컨텍스트가 암묵적이라 토큰명에 `-hr` 접미사 없음(`primary`, `border-focus`, `button-primary` 등).
- **`DESIGN.desk.md`**: Desk 브랜드 self-contained 시스템 — 공유 토큰 복제 + Desk primary `#0147AD`.
- **lint**: `npm run lint:all`로 3파일 검증. HR/Desk 파일은 0 warnings, DESIGN.md만 missingPrimary 1건.
- **공유 토큰 변경 시**: 3파일 모두 수동 동기 — design.md spec이 cross-file token reference 미지원이라 자동화 불가.

## Colors

### 증감 — 방향 색 (2026-10-08)

지난 기간에 견준 변화(증감)는 방향으로 칠한다 — 오르거나 늘면 ▲ `fg-critical`(빨강), 내리거나 줄면 ▼ `fg-informative`(파랑)다. 지출 · 수입 · 순자산 · 예산 · 주식 · HR 통계 어디서나 같다 — 증권 화면의 관례(오르면 빨강)와 한 규칙이다. 사용자가 데이터 표시 비교 페이지(https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj) 8B 로 정했다 — 좋고 나쁨으로 칠하기(지출 ▲ 빨강 · 순자산 ▲ 초록)와 색 없이 두기는 고르지 않았다.

| 방향 | 표시 | 색 | 흰 면 · 다크 카드 위 |
|---|---|---|---|
| 오름 · 늚 | ▲ + 값("▲ 12%") | `fg-critical` | 5.06 · 6.08 |
| 내림 · 줆 | ▼ + 값("▼ 3%") | `fg-informative` | 5.09 · 6.12 |
| 그대로 | "변화 없음" | `fg-neutral-subtle` | 5.50 · 6.09 |

- 늘 ▲ · ▼ 와 값을 함께 쓰고 색만으로 알리지 않는다(Inclusive Design). 부호는 화살표가 말한다 — "+12%" · "−12%" 를 화살표와 겹쳐 쓰지 않는다. 값 뒤의 기준("지난달보다")은 `fg-neutral-subtle` 이다.
- 좋고 나쁨은 글이 말한다 — "지난달보다 12% 더 썼어요". 보조 기술에는 문장으로 읽힌다(화살표는 숨긴다).
- 브랜드로 채운 면(Desk 순자산 카드) 위에서는 흰 글자 + ▲ · ▼ + 글이다 — 빨강 · 파랑이 채움 위 1.66 · 1.65 라 읽히지 않는다. 이 규칙의 하나뿐인 예외다(사용자 결정 2026-10-08).
- 부품은 `specs/components/card.md` 의 "증감 표기"(Delta) — 표 · 차트의 증감 칸도 같은 규칙이다. 빼기 부호는 International Design 의 U+2212 다.

### v111 — 카테고리 옅은 바탕 (2026-09-30)

SEED 의 배너 색(`$color.banner.*` 10색)을 porest 에 둘지 보고, 같은 자리에서 쓰는 porest 의 옅은 바탕을 팔레트 단계로 정했다. 사용자가 비교 페이지(https://claude.ai/artifact/Re8MSU1eb6VKwg3wfySbHS)에서 넷을 정했다 — 배너 10색은 두지 않음 · 작은 면 200 · 다크 300 · 넓은 면은 한 단계 옅게 따로 · 글자 · 아이콘은 v109 규칙.

**Desk 웹에는 2026-10-06 토큰 가져오기로 값이 들어갔다** — 카테고리 타일은 아직 화면에서 18% 를 섞는다. Desk 앱 · HR 은 아직이다(앱 적용 단계).

- SEED 의 안내 메시지(Callout · Page Banner)는 배너 색이 아니라 역할 색(약한 배경 + 대비 글자)을 쓴다 — porest 에는 v102 · v109 로 있다. `$color.banner.*` 는 SEED 컴포넌트 104개 가운데 쓰는 것이 없는 장식 색이고, porest 에는 홍보 배너 자리가 없어 두지 않는다.
- 대신 차트 10색을 화면마다 따로 섞던 옅은 바탕(웹 타일 18% · 캘린더 칩 17% · 메모 카드 12 ~ 16% · 앱 13 · 22%)을 토큰으로 둔다.

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| chart-{hue}-weak | 200(회색 400) | 300(회색 400) | 작은 면 — 카테고리 타일 · 캘린더 칩 · 주식 나라 표시 · 태그 배지. 지금 제품과 같은 진하기(흰 바탕과 1.25:1 이상, 다크 표면과 1.38:1 이상) |
| chart-{hue}-subtle | 100(회색 300) | 200(회색 300) | 넓은 면 — 메모 카드 · 배너 · 차트 위 지표 타일(켠 계열 — 2026-10-08). 한 단계 옅다(1.12:1 · 다크 1.15:1 이상) |
| chart-{hue}-contrast | 800 | 900 | 옅은 바탕 위 글자 — 일반 차트 색보다 한 단계 바깥(v109 규칙). 두 바탕 위 모두 5.02:1 이상 |

- 아이콘은 chart-{hue} 그대로다(라이트 700 · 다크 800) — 작은 면 위 3.63:1(라이트) · 4.35:1(다크) 이상으로 UI 3:1 을 넘는다.
- 회색은 라이트 100 · 200 이 바닥색과 같아서 한 단계씩 진하게 둔다.
- 대비는 머리말 `components` 의 chart-{hue}-contrast-on-{weak,subtle}-{light,dark} 40개로 lint 가 잰다.

### v110 — 차트 10색을 팔레트에서 (2026-09-30)

v108 에서 미뤄 둔 차트 10색을 팔레트 단계로 옮긴다. 사용자가 비교 페이지(https://claude.ai/artifact/QLVzEaAuyakobiWKAwXTUu)에서 넷을 정했다 — 팔레트 가족에서 · 다크 800-dark · 배정 순서는 제품 순서 · 10개가 넘으면 상위 9 + 기타. SEED 에는 차트 전용 색이 없다(팔레트 7가족과 배너 색 10개뿐).

**Desk 웹에는 2026-10-06 토큰 가져오기로 들어갔다.** Desk 앱은 옛 v21 상수, HR 은 recharts 데모 색 그대로다 — 앱 적용 단계에서 옮긴다. 축 · 툴팁 · 범례 · 빈 · 실패는 `specs/components/chart.md`(2026-10-08)다.

| 자리 | 값 |
|---|---|
| 가족 | 팔레트에 yellow · indigo · violet · pink · brown 을 더했다(100 ~ 1000, 라이트 · 다크). 700 이 v21 ~ v24 차트 색 그대로이고, 나머지 단계는 v108 규칙(목표 L* · SEED 채도 비율)으로 뽑았다 |
| 라이트 | chart-{hue} = {hue}-700(회색은 gray-700). 빨강 · 주황 · 초록 · 파랑은 의미 색 가족이라 위험 · 경고 · 긍정 · 정보 채움과 같은 색이다 |
| 다크 | chart-{hue}-dark = {hue}-800-dark — 다크 의미 색 글자와 같은 단계(L* 69, 다크 표면 위 6:1). 옛 chart-{hue}-light 는 별칭으로 남기고 제품 CSS 가 옮겨 가면 지운다 |
| 순서 | 색을 고르지 않은 항목(도넛 · 순위 막대 · 주식 비중)은 blue → green → orange → violet → pink → indigo → red → yellow → brown → gray 순으로 받는다 — 제품이 쓰는 순서. 저장된 색이 있는 항목과 한 차트에 있으면 그 색을 건너뛰고 아직 쓰지 않은 색부터 받는다 — 같은 색이 둘 나오지 않는다(2026-10-08) |
| 넘칠 때 | 한 차트에 10개가 넘으면 상위 9개 + 회색 "기타" 로 묶는다. 회색은 기타 전용이다 |

- 바뀌는 라이트 값은 다섯이다 — 빨강 #C73838 → #D72323(ΔE 4.8) · 주황 #B36418 → #BE490D(10.0) · 초록 #2D8060 → #167F3F(8.2) · 파랑 #2C70BF → #1D6EC9(1.2) · 회색 #6B7484 → #62697A(4.3). 노랑 · 남색 · 보라 · 분홍 · 갈색은 그대로다.
- 가장 헷갈리는 짝이 멀어졌다 — 주황–갈색 ΔE 7.0(다크 8.0) → 빨강–주황 11.3(다크 9.7). 다크의 빨강 · 주황은 둘 다 산호색이라 여전히 가장 가깝다 — 차트에는 범례 · 라벨을 늘 함께 쓴다(State · Inclusive Design 의 "색만으로 알리지 않는다").
- 노랑 800-dark 는 v109 규칙대로 채도를 지금 제품(#D4B83A)만큼 올렸다(#C5A721).
- **저장된 색은 옮기지 않는다.** Desk 는 카테고리 · 태그 · 캘린더 · 라벨 · 저축 목표 · 메모의 색을 라이트 hex 로 저장하고, 웹 · 앱이 그 값으로 다크 짝을 찾는다. 앱 적용 때 저장 값은 이름표로 두고 짝 표만 "옛 hex → 새 토큰" 으로 바꾼다 — 옛 앱은 옛 색을 그대로 그려 강제 업데이트가 필요 없다. DB 값을 새 hex 로 옮기면 옛 앱이 새 값을 몰라 편집할 때 빨강으로 되돌린다.
- 아바타 이니셜은 fg-neutral-inverted 다 — 라이트는 흰색(700 위 4.55:1 이상), 다크는 어두운 글자(800-dark 위 6.07:1 이상). 다크에서 흰 글자는 2.4:1 이다.
- HR 은 porest 차트 색을 쓰지 않는다(부서 색은 shadcn chart-1 ~ 5 이름을 저장한다). HR 앱 적용 때 그 다섯 이름을 porest 차트 색에 잇는다.

### v109 — v108 색 점검 반영 (2026-09-30)

v108 로 크게 바뀐 색을 지금 제품 값(Desk 웹 `porest-tokens.css` · 앱 `colors.dart` 가 복사해 쓰는 v108 직전 값) · v108 · 대안으로 나란히 그린 점검 페이지(https://claude.ai/artifact/RsFYD1ZoqgnBzDJ2irHm6r)에서 사용자가 정했다. 역할 → 단계와 SEED 에서 옮긴 이유는 아래 v108 절에 반영했다(`(v109)` 표시).

**Desk 웹 · 앱의 디자인 시스템 토큰에는 값이 들어갔다**(웹 `porest-tokens.css` · 앱 `porest_tokens.g.dart` — 2026-10-06 가져오기, 옛 색 이름은 역할 색에 이어 두었다). 화면은 아직 옛 이름을 쓰고 화면 이관 때 옮긴다. HR 은 아직이다(앱 적용 단계).

| 무엇 | 바꾼 것 | 왜 |
|---|---|---|
| 다크 글자 채도 | 의미 색 800-dark · 브랜드 900-dark 의 채도를 지금 제품 값만큼(밝기 · 색조는 그대로) | SEED 램프 모양대로 채도를 줄여 다크 링크 · 금액 글자가 회색 기를 띠었다(HR 브랜드는 채도가 절반 아래). 지금 제품 값과 ΔE 는 HR 9.5 → 3.0, Desk 7.6 → 5.0, 초록 10.9 → 7.8 |
| 다크 약한 배경 | 의미 색 · 브랜드의 약한 배경 · 눌림 100 · 200 → 200 · 300 | 100 이 다크 카드 표면과 같은 밝기(1.00 ~ 1.02:1)라 안내 띠 · 배지 배경이 보이지 않았다 |
| 대비 글자 | 라이트 900 → 800(다크는 900) | 라이트 900 이 거의 검정에 가깝게 짙었다 |
| 강한 선 | gray-800 → gray-600 | 체크박스 · 라디오 테두리와 꺼진 스위치가 보조 글자만큼 진했다 |
| 기본 테두리 | gray-400 라이트를 #E5E8EF 로 고정 | 스펙 40곳의 테두리가 진하고 푸르게 바뀌었다(다크는 입력칸 배경과 겹쳐 그대로) |
| 다크 비활성 글자 | gray-500 → gray-600 | 다크 비활성 글자가 라이트보다 흐렸다 |
| 브랜드 옅은 선 | Desk brand-300 채도 올림, HR 은 brand-400(채도 올림)으로 | 옅은 회청 · 회녹으로 바뀌었다 |
| 토스트 · 툴팁 배경 | gray-900 → gray-1000(#1A1F2E) | 지금 제품 값으로 — 사용자 결정 |

- 대비는 모두 다시 잰다 — `npm run lint:all` · `lint:dark` 가 통과한다. 다크 의미 색 글자는 다크 입력칸 위 4.67 ~ 4.71:1, 브랜드 글자는 4.69 · 4.79:1 이다.
- 이번에 hex 를 고친 본문 인용 줄의 대비 수치도 다시 쟀다.

### v108 — SEED 팔레트 층 (2026-09-30)

당근 SEED 처럼 색에 팔레트 층을 둔다. 팔레트는 가족마다 차례 번호를 붙인 색이고, 역할 색(v102)은 hex 대신 그 단계를 가리킨다. 사용자가 2026-09-30 SEED 와 나란히 놓은 비교 페이지에서 구조(SEED 식 모드별) · 채우기(가족마다 차례로) · 값(SEED 규칙대로 새로 뽑음)을 정하고, 값 제안표를 보고 그대로 넣기로 했다. 출처: seed-design.io Foundations › Color › Palette(Apache-2.0).

**Desk 웹 · 앱의 디자인 시스템 토큰에는 값이 들어갔다**(웹 `porest-tokens.css` · 앱 `porest_tokens.g.dart` — 2026-10-06 가져오기, 옛 색 이름은 역할 색에 이어 두었다). 화면은 역할 색 이름으로 이관할 때 이 단계를 따른다. HR 은 아직이다(앱 적용 단계).

| 자리 | 값 |
|---|---|
| 가족 | gray(00 · 100 ~ 1000) · red · green · orange · blue(100 ~ 1000), (v110) 차트용 yellow · indigo · violet · pink · brown(100 ~ 1000). 브랜드는 brand(100 ~ 1000)로 브랜드 파일에만 있다 |
| 모드 | 단계마다 라이트 · 다크 값이 있다. 다크 값은 이름 뒤에 -dark 를 붙인다(gray-100-dark) — 역할 색과 같은 규칙 |
| 차례 | 라이트는 100 이 가장 옅고 1000 이 가장 짙다. 다크는 뒤집혀 100 이 가장 어둡다 — 같은 번호가 두 모드에서 비슷한 무게로 보인다 |
| 참조 | 역할 색은 단계를 가리키고(`bg-layer-default: "{colors.gray-00}"`), 옛 이름은 역할 색을 가리킨다(`text-primary: "{colors.fg-neutral}"`). hex 는 팔레트에만 있다 |

- 화면 · 컴포넌트는 팔레트를 직접 부르지 않고 역할 색을 부른다. 팔레트를 직접 쓰는 것은 역할로 나타내기 어려운 예외적인 자리뿐이다(SEED 와 같다).
- 팔레트 이름은 gray-500 처럼 차례 번호다 — "토큰 이름은 의미 기반" 규칙의 예외로, 팔레트 층에만 쓴다.
- 역할이 가리키지 않는 단계(gray-600 · 의미 색 300 ~ 500 등)도 둔다. design.md 검사기는 어느 컴포넌트도 쓰지 않는 색을 경고하므로, 머리말 `components` 의 palette-* 가 단계마다 한 번씩 가리킨다 — 보기용이고 화면 컴포넌트가 아니다.
- 옛 이름은 컴포넌트 스펙을 역할 이름으로 옮기고 나면 지운다.
- (v110) 차트 10색은 팔레트 단계다 — 라이트 700 · 다크 800-dark. 새 가족 다섯의 700 은 v21 ~ v24 차트 색 그대로다.
- 본문 곳곳의 대비 수치는 대개 v108 전 값으로 잰 것이다. 지금 대비는 `npm run lint:all` · `npm run lint:dark` 가 잰 값이 기준이다.

#### 값을 뽑은 규칙

- OKLCH 에서 가족마다 색상각 하나로 뽑았다. 색상각은 지금 채움색에서 온다 — 의미 색은 라이트 700 이 그 색 그대로다(red #D72323 · green #167F3F · orange #BE490D · blue #1D6EC9, 흰 글자 4.5:1 이상).
- 단계마다 목표 밝기(CIELAB L*)를 두고, 채도는 SEED 램프 모양의 비율로 준다.
- 브랜드는 라이트 600 이 브랜드 색이다(Desk #0147AD · HR #357B5F). HR 은 다크 700 도 같은 색이다.
- 회색의 양 끝은 지금 값이다 — 라이트 00 #FFFFFF · 1000 #1A1F2E, 다크 00 #1A1F2E · 1000 #F5F6FA.
- 고정한 값 다섯 — 지금 화면의 바닥 · 뜬 표면 · 입력칸 · 흐린 글자가 그대로이게 계산값 대신 지금 hex 를 넣었다(계산값과 색차 ΔE 1.4 이하): gray-200 #F5F6FA · gray-700 #62697A · gray-100-dark #242938 · gray-200-dark #2D3346 · gray-300-dark #353B4D.
- 다크의 글자 단계(의미 색 800 · 브랜드 900)는 L* 69 다. 제안표 값이 다크 입력칸(bg-neutral-weak-dark #353B4D) 위에서 4.00 ~ 4.28:1 로 `npm run lint:dark` 에 걸려, 4.5:1 을 넘게 밝혔다. 의미 색 900 도 조금 밝아졌다(ΔE 1.7 이하).
- (v109) 그 글자 단계는 밝기 · 색조를 두고 채도만 지금 제품 값만큼 올렸다 — SEED 램프 모양대로 줄이니 다크 링크 · 금액 글자가 회색 기를 띠었다. Desk brand-300 · HR brand-400(브랜드 옅은 선)도 같은 방식이다. gray-400 은 지금 제품의 테두리 값(#E5E8EF)으로 고정했다.

#### 역할 → 단계

기본은 SEED 가 그 역할에 쓰는 단계다. porest 규칙 1번(WCAG AA)이 막거나 porest 에 없는 자리만 옮겼다(아래 "SEED 에서 옮긴 자리").

| 역할 | 라이트 | 다크 | SEED 와 다르면 (라이트 / 다크) |
|---|---|---|---|
| `bg-layer-basement` | gray-200 | gray-00 | — |
| `bg-layer-default` | gray-00 | gray-100 | — |
| `bg-layer-default-pressed` | gray-100 | gray-300 | — |
| `bg-layer-floating` | gray-00 | gray-200 | — |
| `bg-layer-floating-pressed` | gray-100 | gray-300 | — |
| `bg-neutral-weak` | gray-200 | gray-300 | — |
| `bg-neutral-weak-pressed` | gray-300 | gray-400 | — |
| `bg-neutral-weak-alpha` | 검정 4.7%(`#0000000C`) | 흰 12.5%(`#FFFFFF20`) | — (v120 — SEED bg.neutral-weak-alpha 의 값. 투명도가 있어 팔레트 단계가 아니다) |
| `bg-neutral-weak-alpha-pressed` | 검정 6.3%(`#00000010`) | 흰 18%(`#FFFFFF2E`) | — (v120 — SEED bg.neutral-weak-alpha-pressed 의 값) |
| `bg-neutral-inverted` | gray-1000 | gray-1000 | gray-900 / gray-1000 (v109) |
| `bg-disabled` | gray-200 | gray-300 | — |
| `fg-neutral` | gray-1000 | gray-1000 | — |
| `fg-neutral-muted` | gray-800 | gray-800 | — |
| `fg-neutral-subtle` | gray-700 | gray-700 | — |
| `fg-placeholder` | gray-600 | gray-600 | — (v119 — SEED 값으로 되돌림, 사용자 결정 2026-10-16 글자 역할 D7) |
| `fg-disabled` | gray-500 | gray-600 | gray-500 / gray-500 (v109) |
| `fg-neutral-inverted` | gray-00 | gray-100 | — |
| `fg-positive-inverted` | green-800(다크 팔레트) | green-700 | — (v115, SEED 에 없음 — 스낵바 아이콘) |
| `fg-critical-inverted` | red-800(다크 팔레트) | red-700 | — (v115, SEED 에 없음 — 스낵바 아이콘) |
| `stroke-neutral-subtle` | gray-300 | gray-300 | 투명도 있는 검정 · 흰색 |
| `stroke-neutral-weak` | gray-400 | gray-400 | — |
| `stroke-neutral-solid` | gray-600 | gray-600 | gray-800 / gray-800 (v109) |
| `stroke-neutral-contrast` | gray-1000 | gray-1000 | — (v113) |
| `stroke-neutral-overlay` | 검정 4.7%(`#0000000C`) | 흰 5%(`#FFFFFF0D`) | — (v118 — SEED stroke.neutral-subtle 의 값. 투명도가 있어 팔레트 단계가 아니다) |

의미 색은 네 역할이 같은 단계를 쓴다 — critical → red · positive → green · warning → orange · informative → blue.

| 역할(* = critical · positive · warning · informative) | 라이트 | 다크 | SEED 와 다르면 (라이트 / 다크) |
|---|---|---|---|
| bg-*-weak | 100 | 200 | 100 / 100 (v109) |
| bg-*-weak-pressed | 200 | 300 | 200 / 200 (v109) |
| bg-*-solid | 700 | 600 | positive 700 / 500 |
| bg-*-solid-pressed | 800 | 700 | positive 800 / 600 |
| fg-* | 700 | 800 | 700 / 700 |
| fg-*-contrast | 800 | 900 | 900 / 900 (v109) |
| stroke-*-solid | 700 | 800 | 700 / 700 |
| stroke-*-weak | 300 | 400 | 300 / 300 (v117 — Badge outline 의 옅은 테두리) |

SEED 의 warning 은 주황이 아니라 yellow 이고 단계도 다르다(채움 300 / 800 · 눌림 400 / 900 — 옅은 노랑 위 검은 글자).

| 역할 | Desk (라이트 / 다크) | HR (라이트 / 다크) | SEED (라이트 / 다크) |
|---|---|---|---|
| bg-brand-solid | 600 / 500 | 600 / 700 | 600 / 700 |
| bg-brand-solid-pressed | 700 / 700 | 700 / 600 | 700 / 800 |
| bg-brand-weak | 100 / 200 | 100 / 200 | 100 / 100 |
| bg-brand-weak-pressed | 200 / 300 | 200 / 300 | 200 / 200 |
| fg-brand | 600 / 900 | 600 / 900 | 600 / 700 |
| fg-brand-contrast | 700 / 900 | 700 / 900 | 700 / 700 |
| fg-brand-inverted | 900(다크 팔레트) / 600 | 900(다크 팔레트) / 600 | — (v115) |
| stroke-brand-solid | 600 / 900 | 600 / 900 | 700 / 700 |
| stroke-brand-weak | 300 / 800 | 400 / 800 | 300 / 300 |
| stroke-focus-ring | 600 / 900 | 600 / 900 | blue-600 / blue-600 |

#### SEED 에서 옮긴 자리

- (v119) fg-placeholder — v102 에서 SEED 600 → 700 으로 옮겼다가(600 은 입력칸 bg-neutral-weak 위 3.87:1 · 다크 3.18:1), 2026-10-16 사용자 결정(글자 역할 D7 B)으로 SEED 처럼 gray-600 에 되돌렸다. 자리 글이 앞뒤 글자 · 칸 아래 설명(gray-700)보다 한 단계 옅어 "아직 비었다" 가 색으로도 보인다. **대가** — 흰 면 4.18:1 · 다크 시트(bg-layer-floating) 3.58:1 로 4.5:1 밑이고(입력칸 위 3.87 · 다크 3.18), 다크 값 `#838997` 이 `fg-disabled` 다크와 같은 값이다 — 빈 칸과 막힌 칸은 글자색이 아니라 칸 바탕(`bg-disabled`) · 커서로 갈린다. 대비 짝은 막힘 글자처럼 textColor 만 둔다(`role-placeholder-*`). SEED 는 APCA 로 재고 자리 글을 AA 대상으로 보지 않는다.
- 의미 색 글자 · 선(fg-* · stroke-*-solid)의 다크 — SEED 700 → 800. 다크 700 은 어두운 표면 위 2.9:1 안팎이다 — 흰 글자를 얹는 채움 눌림 자리라 어두워야 한다.
- stroke-neutral-subtle — SEED 는 투명도 있는 검정 · 흰색이다. 검사기가 8자리 hex 를 받지 않아 gray-300 에 둔다.
- (v118) stroke-neutral-overlay — SEED stroke.neutral-subtle 의 투명한 값(검정 4.7% · 흰 5%)을 이미지 · 아바타 · 로고 타일 위 1px 윤곽에만 쓰는 역할로 따로 둔다. porest 의 stroke-neutral-subtle 은 구분선 · 목록 선이라 불투명 그대로다 — 같은 이름에 두 값을 둘 수 없어 이름을 나눴다. 이름의 overlay 는 "내용 위에 얹는"(SEED bg.overlay 와 같은 뜻)이다 — 굵기 단계(subtle · weak · solid · contrast)가 아니라 자리를 말한다. 불투명한 선을 그림 둘레에 그리면 어두운 사진 · 카드 둘레에 옅은 테가 생긴다(사용자 결정 2026-10-04 이미지 비교 1A). 검사기(`@google/design.md`)를 0.4 로 올려 8자리 hex 를 받는다 — 위 줄의 "받지 않아" 는 0.1 때 이유다.
- (v120) bg-neutral-weak-alpha · -pressed — SEED 의 투명한 약한 배경(검정 4.7% · 6.3% / 다크 흰 12.5% · 18%)을 그대로 들인다. 라이트에서 바닥 `bg-layer-basement` · 약한 배경 `bg-neutral-weak` · 비활성 `bg-disabled` 가 모두 gray-200 이라(SEED 도 같다) 회색 바닥 위에 놓인 채움이 바닥과 1.00:1 로 사라진다. SEED 처럼 바닥 위에 자주 놓이는 두 부품 — Chip `solid` 바탕 · Segmented Control 트랙 — 만 투명 짝을 쓰고(어느 바탕에서나 보인다 — 회색 위 1.11 · 흰 위 1.11 · 다크 1.47), 나머지 약한 배경 · 비활성 채움은 흰 표면 위에만 둔다(Elevation 의 "바닥 위의 채움"). 불투명 `bg-neutral-weak` 는 그대로다(사용자 결정 2026-10-16 기초 웹 01-040 B — 비교 페이지 https://claude.ai/artifact/U33bUxZkgQoHfAgdp2DEVK).
- warning — SEED 의 주의 색은 노랑이고 채움 위 글자가 검정이다. porest 는 주황 + 흰 글자를 그대로 두고, 단계는 다른 의미 색과 같은 규칙으로 앉혔다.
- bg-positive-solid 의 다크 — SEED 는 500(눌림 600)이다. 다른 의미 색과 맞춰 600(눌림 700)에 둔다.
- 브랜드 채움의 다크 — Desk 는 브랜드 색이 어두워(L* 33) 채움을 지금 값(#0147AD)과 같은 무게인 500 에 둔다(ΔE 1.4). 눌림은 SEED 의 800 이 흰 글자 3.76:1 이라 700 이다. HR 은 채움이 SEED 대로 700 이고, 눌림은 800 이 흰 글자 3.61:1 이라 600(더 어둡게)이다.
- 브랜드 글자 · 선 · 포커스 링의 다크 — SEED 700 → 900. 다크 700 은 어두운 표면 위 Desk 2.27:1 · HR 2.86:1 이다.
- stroke-brand-solid 의 라이트 — SEED 700 → 600. 브랜드 색 그대로다.
- stroke-brand-weak 의 다크 — SEED 300 → 800. 다크 300 은 표면과 1.3:1 안팎(Desk 1.29 · HR 1.36)이라 선이 보이지 않는다.
- (v117) 의미 색 stroke-*-weak 의 다크 — SEED 300 → 400. 다크 300 은 표면과 1.38 ~ 1.40:1(시트 위 1.19 ~ 1.21)로 선이 묻히고, 브랜드처럼 800 으로 올리면 글자(fg-*) · stroke-*-solid 와 같은 색이 되어 옅은 선이 아니다. 400 은 1.71 ~ 1.73:1 — SEED 다크(1.77)와 같은 관계이고 라이트 300(1.51 ~ 1.53)과 무게가 맞는다.
- stroke-focus-ring — SEED 는 파랑(blue-600)이다. porest 는 옛 border-focus 대로 브랜드 색이다.
- (v109) 다크 약한 배경 · 눌림(의미 색 · 브랜드) — SEED 100 · 200 → 200 · 300. porest 는 다크 카드 표면(#242938, L* 16.7)이 SEED(#16171B, L* 8)보다 밝아서, 100 단계가 표면과 1.00 ~ 1.02:1 로 묻혔다. 200 · 300 이 SEED 의 표면 대비 관계(약한 배경 1.2:1 · 눌림 1.4:1)와 같다 — 지금 1.15 · 1.4:1.
- (v109) 대비 글자의 라이트 — SEED 900 → 800. 900 은 거의 검정에 가까운 짙은 색(8:1)이었다. 800 은 약한 배경 · 눌림 위 5.0 ~ 5.7:1 이다. 규칙은 "대비 글자는 일반 글자보다 한 단계 바깥" — 라이트 700 → 800, 다크 800 → 900.
- (v109) stroke-neutral-solid — SEED 800 → 600. porest 는 이 선을 체크박스 · 라디오 테두리와 꺼진 스위치 트랙에 쓴다(SEED 는 그 자리에 옅은 선을 쓴다). UI 3:1 을 넘는 가장 옅은 단계이고, 지금 제품 값과 ΔE 3.5 다.
- (v109) fg-disabled 의 다크 — SEED 500 → 600. 다크 500 은 비활성 버튼 위 2.08:1 로 라이트(2.93:1)보다 흐렸다. 600 은 3.18:1 이다.
- (v109) bg-neutral-inverted 의 라이트 — SEED 900 → 1000. 지금 제품의 토스트 · 툴팁 배경(#1A1F2E)이다 — 사용자 결정.
- (v109) HR 의 stroke-brand-weak 라이트 — 300 → 400(채도 올림). 300 은 옅은 회녹이라 지금 제품 값과 ΔE 15.5 였다. 지금은 ΔE 1.5 다.

### v102 — SEED 역할 색 (2026-09-29)

당근 SEED 의 역할 기반 색 체계를 들인다. 사용자가 2026-09-29 porest 와 SEED 를 나란히 놓은 비교 페이지에서 네 가지(구조 · 값 · AA 미달 · HR 웹)를 정하고, 역할 색 제안표를 보고 그대로 넣기로 했다.

**Desk 웹 · 앱의 디자인 시스템 토큰에는 값이 들어갔다**(웹 `porest-tokens.css` · 앱 `porest_tokens.g.dart` — 2026-10-06 가져오기, 옛 색 이름은 역할 색에 이어 두었다). 화면은 아직 옛 이름(웹 · 앱 합쳐 4,700여 곳)을 쓰고 화면 이관 때 새 이름으로 옮긴다. HR 은 아직이다(앱 적용 단계).

이름은 SEED 처럼 속성 · 역할 · 변형 · 상태 순이다 — 예: fg-critical-contrast, bg-brand-solid-pressed.

| 자리 | 값 |
|---|---|
| 속성 | fg(글자 · 아이콘) · bg(배경) · stroke(선) |
| 역할 | neutral · layer · brand · critical · positive · warning · informative |
| 변형 | solid(채움) · weak(약한 배경) · contrast(약한 배경 위 글자) · muted · subtle · inverted |
| 상태 | pressed(눌림) |

- 값은 porest 색이다. SEED 는 대비를 APCA 로 재고 porest 는 WCAG AA 라 SEED 값은 가져오지 않았다 — SEED 의 흐린 글자는 흰 바탕에서 WCAG 3.42:1 이다. 당근 주황(carrot)은 쓰지 않는다.
- 옛 이름(text-primary · surface-default · border-default · success …)은 같은 값의 별칭으로 남긴다. 컴포넌트 스펙과 제품은 컴포넌트를 옮길 때 새 이름으로 바꾼다.
- 글자와 그 글자가 놓이는 배경의 짝은 머리말 `components` 의 `role-*` 로 적어 두어 `npm run lint` 가 라이트 · 다크 대비를 잰다(4.5:1 밑이면 경고).
- 흰 글자는 `static-white` 다(SEED palette.static-white). 채움(solid) 위 글자에 쓴다.

#### 글자 (fg)

| 역할 | 라이트 | 다크 | 옛 이름 | Desk 웹 이름 |
|---|---|---|---|---|
| `fg-neutral` | `#1A1F2E` | `#F5F6FA` | text-primary | fg-primary · fg-expense · fg-transfer |
| `fg-neutral-muted` | `#535866` | `#B7BDCC` | text-secondary | fg-secondary |
| `fg-neutral-subtle` | `#62697A` | `#A2A8B7` | text-tertiary | fg-tertiary |
| `fg-neutral-inverted` | `#FFFFFF` | `#242938` | — | — |
| `fg-placeholder` | `#767C8B` | `#838997` | — | fg-placeholder |
| `fg-disabled` | `#8A91A0` | `#838997` | text-disabled | fg-disabled |
| `static-white` | `#FFFFFF` | — | text-on-accent | fg-on-brand · fg-on-danger · fg-on-success |
| `fg-critical` | `#D72323` | `#FF8477` | error · error-light | status-danger-fg |
| `fg-positive` | `#167F3F` | `#25C062` | success · success-light | status-success-fg |
| `fg-warning` | `#BE490D` | `#FF8758` | warning · warning-light | status-warning-fg |
| `fg-informative` | `#1D6EC9` | `#69ABFF` | info · info-light | status-info-fg |
| `fg-critical-contrast` | `#C01016` | `#FFBCB3` | — | — |
| `fg-positive-contrast` | `#026E33` | `#AED6B6` | — | — |
| `fg-warning-contrast` | `#A53E0A` | `#F9BFA9` | — | — |
| `fg-informative-contrast` | `#0F5FB3` | `#ACCEFB` | — | — |
| `fg-positive-inverted` | `#25C062` | `#167F3F` | — | — |
| `fg-critical-inverted` | `#FF8477` | `#D72323` | — | — |

#### 배경 (bg)

| 역할 | 라이트 | 다크 | 옛 이름 | Desk 웹 이름 |
|---|---|---|---|---|
| `bg-layer-basement` | `#F5F6FA` | `#1A1F2E` | bg-page | bg-canvas · bg-table-head |
| `bg-layer-default` | `#FFFFFF` | `#242938` | surface-default | bg-surface |
| `bg-layer-default-pressed` | `#F7F8FD` | `#353B4D` | — | bg-hover · bg-row-hover |
| `bg-layer-floating` | `#FFFFFF` | `#2D3346` | — | bg-surface-raised |
| `bg-layer-floating-pressed` | `#F7F8FD` | `#353B4D` | — | — |
| `bg-neutral-weak` | `#F5F6FA` | `#353B4D` | surface-input | bg-sunken · bg-muted |
| `bg-neutral-weak-pressed` | `#EDEFF3` | `#404757` | — | bg-warm-press |
| `bg-neutral-weak-alpha` | `#0000000C` | `#FFFFFF20` | — | — |
| `bg-neutral-weak-alpha-pressed` | `#00000010` | `#FFFFFF2E` | — | — |
| `bg-neutral-inverted` | `#1A1F2E` | `#F5F6FA` | — | bg-inverse |
| `bg-disabled` | `#F5F6FA` | `#353B4D` | — | bg-disabled |
| `bg-critical-solid` | `#D72323` | `#CC0E17` | error | status-danger |
| `bg-critical-solid-pressed` | `#C01016` | `#D82424` | — | status-danger-press |
| `bg-critical-weak` | `#FFEFEC` | `#532722` | — | status-danger-subtle |
| `bg-critical-weak-pressed` | `#FFDEDA` | `#722722` | — | — |
| `bg-positive-solid` | `#167F3F` | `#117539` | success | status-success |
| `bg-positive-solid-pressed` | `#026E33` | `#198140` | — | — |
| `bg-positive-weak` | `#EAF5EC` | `#223927` | — | status-success-subtle |
| `bg-positive-weak-pressed` | `#D8EADB` | `#20482B` | — | — |
| `bg-warning-solid` | `#BE490D` | `#B04209` | warning | status-warning |
| `bg-warning-solid-pressed` | `#A53E0A` | `#BF4A10` | — | — |
| `bg-warning-weak` | `#FFEFE8` | `#4B2B1F` | — | status-warning-subtle |
| `bg-warning-weak-pressed` | `#FAE0D5` | `#65321D` | — | — |
| `bg-informative-solid` | `#1D6EC9` | `#0F65BF` | info | status-info |
| `bg-informative-solid-pressed` | `#0F5FB3` | `#1F70CB` | — | — |
| `bg-informative-weak` | `#EAF3FE` | `#21344D` | — | status-info-subtle |
| `bg-informative-weak-pressed` | `#D7E6FB` | `#204069` | — | — |

#### 선 (stroke)

| 역할 | 라이트 | 다크 | 옛 이름 | Desk 웹 이름 |
|---|---|---|---|---|
| `stroke-neutral-subtle` | `#EDEFF3` | `#353B4D` | — | border-subtle |
| `stroke-neutral-weak` | `#E5E8EF` | `#404757` | border-default | border-default |
| `stroke-neutral-solid` | `#767C8B` | `#838997` | border-strong | border-strong |
| `stroke-neutral-contrast` | `#1A1F2E` | `#F5F6FA` | — | — |
| `stroke-neutral-overlay` | `#0000000C` | `#FFFFFF0D` | — | — |
| `stroke-critical-solid` | `#D72323` | `#FF8477` | error | status-danger-border |
| `stroke-positive-solid` | `#167F3F` | `#25C062` | success | status-success-border |
| `stroke-warning-solid` | `#BE490D` | `#FF8758` | warning | status-warning-border |
| `stroke-informative-solid` | `#1D6EC9` | `#69ABFF` | info | status-info-border |
| `stroke-critical-weak` | `#FEC4BC` | `#93231F` | — | — |
| `stroke-positive-weak` | `#BBDAC1` | `#1A582F` | — | — |
| `stroke-warning-weak` | `#F5C7B6` | `#833615` | — | — |
| `stroke-informative-weak` | `#B9D4F6` | `#1C4E8A` | — | — |

#### 브랜드 역할

브랜드 파일(DESIGN.hr.md · DESIGN.desk.md)에만 있다 — fg-brand · fg-brand-contrast · bg-brand-solid · bg-brand-solid-pressed · bg-brand-weak · bg-brand-weak-pressed · stroke-focus-ring · stroke-brand-solid · stroke-brand-weak. 파일 안에서는 같은 이름이다.

#### 값을 만든 규칙

v102 때의 규칙이다. v108 부터 값은 팔레트 단계에서 온다 — 위 표의 값은 v108 값이고, 지금 규칙은 v108 절에 있다.

- **약한 배경(weak)**: 의미 색 12%(다크 18%) · 브랜드 8%(다크 12%)를 `bg-layer-default`(흰색 · 다크 #242938) 위에 섞은 불투명 값이다. Desk 가 투명하게 섞던 비율 그대로다 — design.md 검사기가 투명도 있는 색을 받지 않고, SEED 도 불투명 값이다. 페이지 배경 위에 바로 놓이면 전보다 조금 밝다.
- **약한 배경 눌림(weak-pressed)**: 의미 색 +6%(다크 +10%), 브랜드 14%(다크 22%).
- **채움 눌림(solid-pressed)**: Desk 앱 파랑 램프 500 → 600 과 같은 명도 폭만큼 어둡게. Desk 브랜드는 그 600 값(#013D97)이다.
- **contrast 글자**: 약한 배경과 그 눌림 위에서 4.5:1 이 되는 가장 밝은 값(색상 · 채도는 그대로)이다. 부드러운 배지처럼 약한 배경 위 글자에 쓴다.
- **의미 색 AA 보정**: success #16803F → #167F3F, error #DC2626 → #D72323, warning #C84D0E → #BE490D, info #1D6FCB → #1D6EC9. 명도만 낮춰 흰 바탕 · 페이지 · 입력칸 모두 4.5:1 을 넘긴다(전: 페이지 위 오류 4.47 · 경고 4.30).
- **다크 모드 의미 색 선**은 밝은 변형(-light)이다. 기본색은 어두운 표면 위 2.86:1 로 UI 3:1 에 못 미쳤다.

#### 들이지 않은 SEED 역할

porest 화면에 아직 쓰는 자리가 없다. 자리가 생기면 위 규칙으로 더한다.

- bg.neutral-solid — 짙은 회색 채움(bg.neutral-inverted-pressed 는 v112 에 Button 의 누름으로 들였다)
- bg.transparent-*(4) — 투명도 있는 배경. 필요하면 v118 의 stroke-neutral-overlay 처럼 역할 색으로 둔다(검사기 0.4 부터 8자리 hex 를 받는다). bg.neutral-weak-alpha(-pressed)는 v120 에 회색 바닥 위 칩 · 세그먼트 트랙의 바탕으로 들였다
- bg.overlay · bg.overlay-muted — Elevation 의 overlay-dim 이 같은 자리다
- stroke.neutral-muted — 구분선은 stroke-neutral-subtle 하나로 그린다(Divider 2026-10-03 — SEED 기본 neutral-muted 와 같은 진하기 1.15). stroke.neutral-contrast 는 v113 에 Select Box 의 고른 테두리로, stroke.*-weak(4)는 v117 에 Badge outline 의 옅은 테두리로, stroke.neutral-subtle 의 투명한 값은 v118 에 이미지 위 윤곽(stroke-neutral-overlay)으로 들였다
- bg.magic-weak · bg.layer-fill — 당근 AI 기능 전용 · SEED 에서도 없어질 이름

### v104 — 그라디언트 (2026-09-29)

당근 SEED 의 Gradient 가운데 두 가지만 들인다 — 콘텐츠 끝을 부드럽게 가리는 마스크와 스켈레톤 반짝임. 당근 AI 기능 전용(magic)은 두지 않는다. 투명도가 있어 overlay 처럼 표 토큰으로 둔다(검사기가 8자리 hex 를 받지 않는다). 출처: seed-design.io Foundations › Gradient(Apache-2.0).

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `gradient-fade-mask` | `linear-gradient(#00000000 0%, #00000003 8%, #00000005 16%, #0000000d 22%, #00000014 29%, #00000021 35%, #0000002e 41%, #00000040 47%, #00000052 53%, #00000066 59%, #0000007a 65%, #00000094 71%, #000000ab 78%, #000000c7 84%, #000000e3 92%, #000000ff 100%)` | 가림 마스크 — `mask-image` 로 써서 스크롤 영역의 끝을 부드럽게(Scroll Fog — `specs/components/scroll-fog.yaml`, 2026-10-03). 라이트 · 다크 같음 |
| `gradient-shimmer-neutral` | `linear-gradient(90deg, #ffffff00 0%, #ffffffab 46%, #ffffffab 54%, #ffffff00 100%)` | 스켈레톤 반짝임 띠 — 라이트 |
| `gradient-shimmer-neutral-dark` | `linear-gradient(90deg, #ffffff00 0%, #ffffff1a 46%, #ffffff1a 54%, #ffffff00 100%)` | 스켈레톤 반짝임 띠 — 다크 |

- 마스크는 방향 없이 적었다(위 → 아래). 쓰는 자리에서 방향을 붙인다(`to right` 등).
- 반짝임은 `motion-duration-loop`(1500ms) · `motion-ease-easing` 으로 지나가고(SEED Skeleton 의 곡선 — 2026-10-03, `specs/components/skeleton.yaml`), 모션 줄이기 모드에서는 멈춘다.

### Surface (v1 추가 · 기록 — 기준은 v102 역할 색 `bg-layer-*`)

`bg-page` 위에 카드·시트·입력을 그리기 위한 최소 표면 페어. 라이트·다크 모드 모두 동일한 시맨틱(`default` = 콘텐츠 표면, `input` = 입력·recessed 표면)을 유지하며, 시각적 elevation 방향만 모드에 따라 반전됩니다.

- **라이트**: `bg-page #F5F6FA` 위에 `surface-default #FFFFFF`(elevated 카드), 그 위 또는 옆에 `surface-input #F0F2F7`(recessed 입력 필드).
- **다크**: `bg-page-dark #1A1F2E`보다 한 단 밝은 `surface-default-dark #242938`(카드), 그보다 한 단 더 밝은 `surface-input-dark #2D3346`(입력 — 다크 모드에서는 입력이 elevated되어 시인성을 확보).

#### 추가 이유
1. 현재 `bg-page` 단일 토큰만으로는 카드/모달/입력 분리가 불가능 — 컴포넌트 스펙 작성의 전제 조건.
2. 다크 모드 페어를 동시 도입해 단일 모드 편향을 방지.
3. `border`·`text` 토큰의 대비비 검증은 표면 토큰이 확정되어야 가능하므로 선행.

#### WCAG 검증 (사전 계산)
- 본문 텍스트 4.5:1 대상
  - `#000` on `surface-default` = **21.0:1** ✅ / `#FFF` on `surface-default-dark` = **14.3:1** ✅
  - `#000` on `surface-input` = **18.8:1** ✅ / `#FFF` on `surface-input-dark` = **12.3:1** ✅
- 브랜드 primary 호환 (버튼/아이콘 1차 용도): brand 파일에서 자체 검증. v1 시점 `accent-*` 시리즈는 라이트 표면 위 ~5:1대로 본문 통과 (v14에서 `primary-*` 신규 값으로 갱신, brand 파일 v14 prose 참조).
- 표면 간 elevation 대비(`surface-default` vs `bg-page` ≈ 1.08:1)는 WCAG 3:1 비대상(본문/UI 컴포넌트 규정 아님). 의도된 미묘 elevation.

#### HR / Desk 듀얼 브랜드
- 두 accent 모두 라이트 모드 표면 위에서 본문 4.5:1 또는 그에 준하는 대비를 확보 — 단일 표면 페어로 양 브랜드 호환.
- 어두운 표면용 accent 변형(`accent-*-light`)은 추후 별도 토큰으로 분리 예정 — 현재 surface 토큰은 lightened accent 도입 시 재계산 없이 그대로 유효.

### Text (v2 추가 · 기록 — 기준은 v102 역할 색 `fg-*` 와 Typography 의 "글자 역할")

surface 페어 위에서 본문 가독성을 확보하기 위한 최소 텍스트 역할 5종. 모드별 페어(primary/secondary)와 모드 무관(on-accent)으로 구성하며, tertiary·disabled는 사용 사례가 명확해진 후 v3에서 추가합니다.

- **primary**: 본문 헤딩·메인 텍스트. 라이트 `#1A1F2E` / 다크 `#F5F6FA` — 의도적으로 `bg-page-dark` / `bg-page`와 동일 값을 사용해 라이트·다크 시맨틱 반전 일관성을 확보(역할이 다르므로 별도 토큰 유지).
- **secondary**: 보조 설명·메타 정보. 라이트 `#4E5968` / 다크 `#B0B8C4` — Toss 톤의 중성 그레이.
- **on-accent**: HR/Desk accent 배경(버튼 fill, badge) 위 텍스트. `#FFFFFF` 단일 — 모드 무관.

#### 추가 이유
1. surface 페어가 v1에서 확정됐으므로 텍스트 대비비 검증이 비로소 가능 — 후속 컴포넌트(버튼·카드·입력) 스펙 작성의 차단 요소 해소.
2. accent 위 텍스트 색상을 `#FFFFFF`로 명시 토큰화 — 양 브랜드 버튼에서 동일 처리 보장(분기 없음).
3. tertiary·disabled는 placeholder·비활성 컴포넌트 사용 패턴이 정해진 후 추가 — 추측성 선행 토큰 회피(CLAUDE.md "사용자가 명시적으로 요청하지 않은 토큰 추가 금지").

#### WCAG 검증 (사전 계산)
모든 페어가 본문 4.5:1 통과, 대부분 AAA 7:1 이상.

| 텍스트 | 표면 | 대비 | 등급 |
|---|---|---|---|
| text-primary `#1A1F2E` | surface-default | 16.22 | AAA |
| text-primary | surface-input | 14.49 | AAA |
| text-primary | bg-page | 15.02 | AAA |
| text-primary-dark `#F5F6FA` | surface-default-dark | 13.25 | AAA |
| text-primary-dark | surface-input-dark | 11.40 | AAA |
| text-primary-dark | bg-page-dark | 15.03 | AAA |
| text-secondary `#4E5968` | surface-default | 7.08 | AAA |
| text-secondary | surface-input | 6.32 | AA |
| text-secondary-dark `#B0B8C4` | surface-default-dark | 7.41 | AAA |
| text-secondary-dark | surface-input-dark | 6.37 | AA |
| text-on-accent `#FFFFFF` | (brand primary) | brand 파일에서 검증 | — |

#### HR / Desk 듀얼 브랜드
- `text-on-accent` 단일 값(`#FFFFFF`)이 양 브랜드 primary에서 본문 4.5:1 통과 (각 brand 파일에서 자체 검증) — 브랜드별 분기 불필요.
- primary·secondary는 neutral 토큰으로 양 브랜드 공유. accent 색상에 의존하지 않음.

### Border (v3 추가 · 기록 — 기준은 v102 역할 색 `stroke-*`)

border는 시맨틱 계층을 둘로 분리합니다 — 장식적 외곽선과 필수 UI 외곽선은 WCAG 1.4.11 (Non-text contrast 3:1) 적용 대상이 다르기 때문입니다.

- **default**: 카드 윤곽, 섹션 divider 등 **장식적** 분리. 표면과 1.1~1.5:1 대비로 미묘하게만 구분 — WCAG 3:1 비대상(콘텐츠 식별이 표면 색상으로 이미 가능).
- **strong**: 입력 필드 외곽선, 비채움 버튼 보더 등 **필수 UI 컴포넌트** 외곽선. 인접 모든 표면(`surface-default`, `bg-page`, `surface-input`)에 대해 3:1 이상 — UI 컴포넌트 식별이 외곽선에 의존하므로 strict.

#### 추가 이유
1. v1 surface 페어 + v2 text 페어가 확정됐으므로 표면 위 컴포넌트 외곽선 검증이 가능 — 입력·버튼 컴포넌트 스펙 작성의 차단 요소 해소.
2. 장식/필수 분리로 디자이너가 "어느 border를 써야 3:1을 충족하는가" 의사결정을 토큰 이름에서 즉시 판단 가능.
3. `border-focus`는 이번 배치에서 보류 — 당시 brand accent가 어두운 표면 대비 3:1 미달(brand 파일 v7 prose 참조)이라 brand light 변형 도입 후 추가가 안전. 임시로는 `border-strong` 활용 가능. (v7~v16에서 단계적 해소 완료, brand 파일에서 `border-focus` 토큰 정의됨.)

#### WCAG 검증 (사전 계산)

`border-strong` 페어 — **3:1 strict 통과**:

| border | 표면 | 대비 | 결과 |
|---|---|---|---|
| border-strong `#7D8593` | surface-default | 3.74 | ✅ |
| border-strong | bg-page | 3.46 | ✅ |
| border-strong | surface-input | 3.34 | ✅ |
| border-strong-dark `#8B95A8` | surface-default-dark | 4.71 | ✅ |
| border-strong-dark | bg-page-dark | 5.34 | ✅ |
| border-strong-dark | surface-input-dark | 4.05 | ✅ |

`border-default` 페어 — **장식적 미묘 대비** (3:1 비대상):

| border | 표면 | 대비 | 비고 |
|---|---|---|---|
| border-default `#E5E8EF` | surface-default | 1.22 | 의도된 subtle 분리 |
| border-default | bg-page | 1.13 | 의도된 subtle 분리 |
| border-default-dark `#353B4D` | surface-default-dark | 1.32 | 의도된 subtle 분리 |
| border-default-dark | bg-page-dark | 1.50 | 의도된 subtle 분리 |

#### HR / Desk 듀얼 브랜드
- 모든 border는 neutral 토큰 — 브랜드 accent에 의존하지 않음, 양 브랜드 공유.
- 미래 `border-focus`는 accent 기반(브랜드 분기) 또는 neutral 기반 단일 토큰 중 선택 — 다크 모드 accent 변형 결정 후 일관 적용.

### Text tertiary (v11 추가 · 기록 — 기준은 v102 `fg-neutral-subtle`)

3차 텍스트 위계 — placeholder, hint, caption-tertiary 등 본문보다 낮은 강조의 read-only 정보. 라이트/다크 페어 2개.

| 토큰 | hex | 사용 |
|---|---|---|
| `text-tertiary` | `#62697A` | 라이트 표면 위 placeholder·hint·메타 (text-secondary보다 미묘) |
| `text-tertiary-dark` | `#A2A8B7` | 다크 표면 위 placeholder·hint·메타 |

#### 추가 이유
1. v2 text 토큰(primary/secondary/on-accent)으로는 input placeholder의 시각 위계가 표현 불가 — secondary를 placeholder에 쓰면 입력값과 동등한 강조로 보여 혼란.
2. `text-disabled`와 분리: tertiary는 "강조가 낮을 뿐 읽을 수 있는 텍스트"(WCAG 1.4.3 4.5:1 대상), disabled는 "비활성 — 색상 대비 적용 면제 가능"(WCAG 1.4.3 incidental 예외). 시맨틱이 다르므로 별도 토큰.
3. **휘도 윈도우가 좁음**: 라이트 모드는 `text-secondary` L=0.098과 `surface-input` 위 4.5:1 ceiling L=0.158 사이 약 0.06 luminance gap만 가용. `#62697A`(L=0.141)로 윈도우 내 위치 확보.

#### WCAG 검증 — lint 실측 결과

4개 페어를 components(`caption-tertiary-on-card-{light,dark}`, `placeholder-on-input-{light,dark}`)로 정의하여 자동 검증:

| component | bg | text | lint 판정 |
|---|---|---|---|
| `caption-tertiary-on-card-light` | surface-default | text-tertiary | ✅ ≥4.5:1 |
| `caption-tertiary-on-card-dark` | surface-default-dark | text-tertiary-dark | ✅ ≥4.5:1 |
| `placeholder-on-input-light` | surface-input | text-tertiary | ✅ ≥4.5:1 (가장 빡빡, 손계산 4.91) |
| `placeholder-on-input-dark` | surface-input-dark | text-tertiary-dark | ✅ ≥4.5:1 (손계산 4.87) |

(`npm run lint` 출력 기준: 0 errors, 0 contrast warnings.)

#### bg-page 위 검증 미적용
`text-tertiary` on `bg-page` (페이지 배경 위 직접 노출 케이스, 손계산 5.09:1)는 별도 component 정의 안 함 — 실제 사용 시 거의 항상 `surface-*` 표면 위에 있음. 필요 시 v12+에서 페어 추가 가능.

#### HR / Desk 듀얼 브랜드
- neutral 토큰, 양 브랜드 동일 사용. accent에 의존하지 않음.

### Text disabled (v13 추가 · 기록 — 기준은 v102 `fg-disabled` 와 v106 상태)

비활성(disabled) 상태의 라벨·버튼 텍스트·입력값 등 — WCAG 1.4.3 *incidental text exception* 적용 대상으로, 색 대비 4.5:1 요건이 면제되는 시맨틱.

| 토큰 | hex | 사용 |
|---|---|---|
| `text-disabled` | `#8A91A0` | 라이트 표면 위 비활성 텍스트 |
| `text-disabled-dark` | `#838997` | 다크 표면 위 비활성 텍스트 |

#### 추가 이유
1. **시맨틱 분리 필수**: text-tertiary(placeholder)는 ≥4.5:1 본문 대비 대상, text-disabled는 incidental 면제 대상 — 두 시맨틱을 같은 토큰에 묶으면 placeholder가 부당하게 약해지거나 disabled가 부당하게 진해짐.
2. **시각 의도**: disabled는 "비활성"으로 보여야 하므로 의도적으로 ~3:1대 대비 — text-tertiary(~5:1)와 명확히 구분.

#### WCAG 검증 — incidental 예외 적용

**WCAG 1.4.3 (Contrast Minimum)**: "비활성 UI 컴포넌트의 일부인 텍스트는 대비 요건이 없다(no contrast requirement)." disabled 텍스트는 이 면제 조항에 해당.

대비비 손계산 (참고용 — incidental이라 통과 강제 아님):

| token | 표면 | 대비 (손계산) | 비고 |
|---|---|---|---|
| `text-disabled` `#828995` (L=0.248) | surface-default | 3.52 | <4.5:1 의도 — 비활성 시각 |
| `text-disabled` | surface-input | 3.15 | 동일 |
| `text-disabled` | bg-page | 3.26 | 동일 |
| `text-disabled-dark` `#7A8294` (L=0.222) | surface-default-dark | 3.71 | 동일 |
| `text-disabled-dark` | surface-input-dark | 3.20 | 동일 |
| `text-disabled-dark` | bg-page-dark | 4.21 | 동일 |

전 표면에서 ≥3:1 (UI 컴포넌트 식별 임계 통과) + <4.5:1 (incidental 의도) — 비활성으로 인지되되 식별 가능한 회색 균형.

#### Spec 충돌 회피 — sparse component 전략

design.md `contrastCheck` 룰은 incidental 인지 없이 모든 `backgroundColor`+`textColor` 페어에 4.5:1 강제. 현재 spec 한계로 disabled 시맨틱이 자동 검증과 충돌.

**해결**: 토큰을 textColor만 가진 sparse component(`disabled-label-light`/`-dark`)로 referencing. `backgroundColor` 미선언이면 contrastCheck 룰 미발동(둘 다 있어야 트리거). 동시에 토큰이 referenced되어 orphan 경고도 회피. 부모 표면 색은 런타임에 CSS·컴포넌트 레벨에서 상속/적용.

> **부수 효과 인지**: 이 sparse 패턴은 disabled 외 다른 시맨틱에 함부로 쓰면 lint의 contrast 안전망 무력화 위험 있음. disabled처럼 WCAG가 명시적 면제하는 케이스에만 적용.

#### 운영 가이드
- 컴포넌트 구현 시 `disabled-label-light/dark` 토큰을 textColor에 적용 + 추가로 `cursor: not-allowed` 와 호버 · 누름 모양 빼기를 동반. 포인터 이벤트는 끄지 않는다 — 끄면 커서가 보이지 않는다(2026-10-01, SEED 와 같다). 불투명도로 흐리게 하지 않는다(v106 — State 절).
- 단순 색만으로 비활성을 표시하지 않음 — 색·커서·인터랙션 비활성을 함께 사용해야 시각·기능적 비활성 일치.

#### HR / Desk 듀얼 브랜드
- neutral 토큰 — 양 브랜드 공유. accent에 의존 없음.

### Semantic colors (v10 추가 · 기록 — 기준은 v102 역할 색 · v108 팔레트)

상태 전달을 위한 functional palette — 브랜드 정체성과 분리된 4개 status. HR/Desk 양 브랜드 공유, 라이트 표면 base만 이번 배치에서 확정.

**현재 사용 hex는 v51-v52 vivid refresh 후** (아래 `Semantic refresh` 섹션 참조). v10 시점 hex는 변천 history.

| 토큰 | v10 hex (이전) | v51-v52 hex (**현재**) | 시맨틱 |
|---|---|---|---|
| `success` | `#117A3A` | `#16803F` | 완료·확인·긍정 결과 (Tailwind green-700 톤) |
| `error` | `#C53030` | `#DC2626` | 오류·파괴적 액션·필수 입력 누락 (Tailwind red-600) |
| `warning` | `#A85800` | `#C84D0E` | 경고·주의·임박 만료 (orange — v52 미세 brighten) |
| `info` | `#006395` | `#1D6FCB` | 안내·도움말·진행 중 (sky blue, Tailwind sky-600) |

#### 추가 이유
1. 폼 검증·토스트·alert·badge 컴포넌트는 모든 제품 공통 인터랙션 — accent로는 표현 불가능한 functional state 전달이 차단되어 있었음.
2. **functional palette ≠ brand palette**: HR/Desk 어디서도 동일한 success/error/warning/info를 사용 — 브랜드 분기 시 인지 부하 증가 회피. 이미 accent로 brand identity 차별화는 완료.
3. **라이트 표면 base만 4개** — 다크 표면용 `success-light` 등은 다크 모드 alert·toast 사용 사례 등장 시 v11+에서 추가(accent-light 패턴 답습). 5 한도 중 1개 여분.

#### 색상 대비 — lint 실측 결과 (손계산 아님)

8개 페어를 components 섹션에 정의해 lint contrast-ratio 룰로 직접 검증:

| component | bg | text | lint 판정 |
|---|---|---|---|
| `badge-success` | success | text-on-accent | ✅ ≥4.5:1 |
| `badge-error` | error | text-on-accent | ✅ ≥4.5:1 |
| `badge-warning` | warning | text-on-accent | ✅ ≥4.5:1 |
| `badge-info` | info | text-on-accent | ✅ ≥4.5:1 |
| `alert-text-success` | surface-default | success | ✅ ≥4.5:1 |
| `alert-text-error` | surface-default | error | ✅ ≥4.5:1 |
| `alert-text-warning` | surface-default | warning | ✅ ≥4.5:1 |
| `alert-text-info` | surface-default | info | ✅ ≥4.5:1 |

(`npm run lint` 출력 기준: 0 errors, 0 contrast warnings — 8 페어 전부 silent pass.)

#### 자동 검증 미적용 항목 (손계산 한계 명시)
- `surface-input` 위 semantic 텍스트 (input 검증 메시지 케이스): `surface-input` 표면이 카드 표면(`surface-default`)과 휘도 차 0.11 → 페어 정의해두면 lint 추가 검증 가능. 이번 배치 미정의.
- 다크 표면 위 semantic 표시: ~v19까지 `success`/`error` base 색은 다크 표면 위 contrast 미달 → **v20에서 `-light` 변형 도입으로 해소** (아래 v20 섹션 참조).
- `border-vs-surface` 패턴은 spec에 borderColor 없어 영구 자동 검증 불가 (v9 한계 그대로).

### Semantic refresh — vivid tone (v51 추가 · 기록 — 기준은 v102 역할 색 · v108 팔레트)

base 4개 vivid 갱신. light 변형은 v20에서 검증된 다크 alert contrast 회귀 회피 위해 보존.

| 토큰 | v10 → v51 | 변화 |
|---|---|---|
| `success` | `#117A3A` → `#16803F` | deep forest → emerald (Tailwind green-700 톤) |
| `error` | `#C53030` → `#DC2626` | brick → vivid red (Linear/Tailwind red-600 톤) |
| `warning` | `#A85800` → `#C84D0E` | brown amber → 명확한 orange. v52에서 미세 brighten (1차 `#C2410C` 어두운 인상 → L 0.15 → 0.17) |
| `info` | `#006395` → `#1D6FCB` | deep navy → sky blue |

#### 변경 이유
v10 base는 본문 4.5:1 안전 마진을 위해 L 0.13~0.17로 어둡게 잡혀 UI 무드가 칙칙. `text-on-accent`(white) 위 contrast 5~7:1로 과도한 마진 — L을 0.16~0.22로 조정해 4.5:1 통과 (`success`는 emerald hue 특성상 가장 빠듯하게 L 0.16). hue rotate는 최소화 (warning만 brown amber → orange로 미세 이동 — 갈색 인상이 칙칙함의 주범).

#### 색상 대비 — lint 실측 결과 (손계산 아님)

기존 8 페어를 그대로 사용 — components 섹션 변경 없음. lint가 새 hex 기준으로 contrast-ratio 자동 재검증.

| component | bg | text | v51 lint 판정 |
|---|---|---|---|
| `badge-success` | success `#16803F` | text-on-accent | ✅ ≥4.5:1 |
| `badge-error` | error `#DC2626` | text-on-accent | ✅ ≥4.5:1 |
| `badge-warning` | warning `#C84D0E` | text-on-accent | ✅ ≥4.5:1 |
| `badge-info` | info `#1D6FCB` | text-on-accent | ✅ ≥4.5:1 |
| `alert-text-success` | surface-default | success | ✅ ≥4.5:1 |
| `alert-text-error` | surface-default | error | ✅ ≥4.5:1 |
| `alert-text-warning` | surface-default | warning | ✅ ≥4.5:1 |
| `alert-text-info` | surface-default | info | ✅ ≥4.5:1 |

(`npm run lint:all` 통과 — 0 errors, 0 contrast warnings. 8 페어 전부 silent pass.)

#### light 변형 보존 이유 (v51 시점)
v51에서는 `success-light`/`error-light`/`warning-light`/`info-light`를 v20 검증 hex 그대로 유지 — 변경 시 다크 alert contrast 회귀 위험을 우선 고려. **v53에서 vivid 톤으로 갱신** — 아래 `Semantic light refresh` 섹션 참조.

### Semantic light refresh — vivid tone (v53 추가 · 기록 — 기준은 v102 역할 색 · v108 팔레트)

v51에서 보류했던 light 변형 4개를 base와 hue 일관성 + 시각 통일감 위해 vivid 톤으로 갱신. Tailwind 400 톤 채택 (base는 600/700, light는 400 — 표준 lighter scale).

| 토큰 | v20 → v53 | 변화 |
|---|---|---|
| `success-light` | `#5DC07B` → `#4ADE80` | cool emerald → vivid green-400 (saturation ↑) |
| `error-light` | `#F08080` → `#F87171` | coral 유지, 살짝 saturated red-400 |
| `warning-light` | `#E8A05A` → `#FB923C` | amber → 명확한 orange-400 (가장 큰 변화 — base와 hue 일치) |
| `info-light` | `#6FAEDF` → `#60A5FA` | sky 유지, vivid blue-400 |

#### 변경 이유
1. v51 base를 vivid 톤으로 갱신 후 v20 light는 hue 일관성 약간 어긋남 (warning base orange vs light amber, success base emerald vs light cool-green).
2. 다크 alert 4.5:1 contrast 마진은 v20 4.75~6.5:1로 충분 — vivid 톤(L 0.4~0.6)으로 가도 통과.
3. Tailwind 400 톤 채택 — base 600/700과 hue 일관, lighter scale 표준.

#### 색상 대비 — lint 실측 결과 (손계산 아님)

4 페어를 components 섹션의 `alert-text-{semantic}-on-dark`로 lint contrast-ratio 직접 검증:

| component | text | bg | v53 lint 판정 |
|---|---|---|---|
| `alert-text-success-on-dark` | success-light `#4ADE80` | surface-input-dark | ✅ ≥4.5:1 |
| `alert-text-error-on-dark` | error-light `#F87171` | surface-input-dark | ✅ ≥4.5:1 |
| `alert-text-warning-on-dark` | warning-light `#FB923C` | surface-input-dark | ✅ ≥4.5:1 |
| `alert-text-info-on-dark` | info-light `#60A5FA` | surface-input-dark | ✅ ≥4.5:1 |

(`npm run lint:all` 통과 — 0 errors, 0 contrast warnings. 4 페어 silent pass.)

#### 채움 fill 비호환 유지
v20과 동일 — light 위에 white 올리면 contrast 2~3:1 미달. 다크 모드 채움 badge는 여전히 base 색 + 외곽선 보강 또는 별도 패턴(향후 검토).

### Chart palette (v21 도입, 4 배치 완료 · 기록 — 기준은 v110 차트 10색)

**v110 에서 팔레트 단계로 옮겼다** — 아래 표는 v21 ~ v24 값의 기록이다. 지금 값은 Colors 의 v110 절(라이트 700 · 다크 800-dark)에 있다.

데이터 시각화용 hue-균등 10색 팔레트. 양 brand 공유(unified, primary는 brand-specific 유지). L≈0.16-0.18로 통일해 어떤 색이 데이터 차원을 강조하지 않게 시각 균형 확보.

| Batch | Status | 토큰 | 표면 | L 범위 |
|---|---|---|---|---|
| v21 (1/4) | ✅ | `chart-{red,orange,yellow,green,blue}` | light bg-page | 0.15-0.19 |
| v22 (2/4) | ✅ | `chart-{indigo,violet,pink,brown,gray}` | light bg-page | 0.16-0.19 |
| v23 (3/4) | ✅ | `chart-{red,orange,yellow,green,blue}-light` | dark surface | ≈0.45-0.55 |
| v24 (4/4) | ✅ | `chart-{indigo,violet,pink,brown,gray}-light` | dark surface | ≈0.45-0.55 |

#### 손계산 휘도 (lint sparse 검증, contrast 룰 미발동)

| 토큰 | v21 hex | L | bg-page 위 contrast | v110 |
|---|---|---|---|---|
| `chart-red` | `#C73838` | 0.153 | 4.85 | `#D72323` |
| `chart-orange` | `#B36418` | 0.187 | 4.10 | `#BE490D` |
| `chart-yellow` | `#8C7400` | 0.180 | 4.22 | `#8C7400` |
| `chart-green` | `#2D8060` | 0.169 | 4.45 | `#167F3F` |
| `chart-blue` | `#2C70BF` | 0.159 | 4.66 | `#1D6EC9` |

`chart-orange`(4.10), `chart-yellow`(4.22)는 본문 4.5:1 미달이나 chart fill 용도라 **UI 1.4.11 (3:1)** 기준 통과 — chart bar/line/marker로 사용 시 적정. 차트 위 inline 텍스트로는 사용 부적합 (텍스트는 `text-primary`/`text-secondary` 사용).

#### v22 hex (light surface 추가 5색 — sparse 손계산 휘도)

| 토큰 | v22 hex | v110 |
|---|---|---|
| `chart-indigo` | `#5E60C8` | `#5E60C8` |
| `chart-violet` | `#8B4DBA` | `#8B4DBA` |
| `chart-pink` | `#B83B7A` | `#B83B7A` |
| `chart-brown` | `#9A6536` | `#9A6536` |
| `chart-gray` | `#6B7484` | `#62697A` |

v21 동일 정책 — light 표면 위 chart fill, UI 1.4.11 (3:1) 기준 통과. 일부 본문 4.5:1 미달도 chart bar/line/marker 용도 적정.

#### v23-v24 hex (dark surface — `chart-*-light`, L≈0.45-0.55 — v110 에서 `chart-*-dark` 로, 옛 이름은 별칭)

| 토큰 | hex | 토큰 | hex |
|---|---|---|---|
| `chart-red-light` | `#ECA0A0` | `chart-indigo-light` | `#ABB0F0` |
| `chart-orange-light` | `#E8B266` | `chart-violet-light` | `#D2A8EC` |
| `chart-yellow-light` | `#D4B83A` | `chart-pink-light` | `#ECA0BC` |
| `chart-green-light` | `#6BCB86` | `chart-brown-light` | `#DCB088` |
| `chart-blue-light` | `#7BBBED` | `chart-gray-light` | `#B5BBC5` |

다크 표면 위 chart fill — 정량 lint 검증은 `chart-color-{name}-on-dark` 컴포넌트 sparse 매핑 시 활성 (현재 `chart-color-{name}` 단일 매핑, light surface 기준).

#### sparse component 패턴
각 chart 토큰은 `chart-color-{name}` (backgroundColor만)에서 referencing. v9 divider, v13 disabled-label, v16 focus-ring과 동일 — orphan 회피 + spec 한계(chart는 component property 아님) 우회.

#### 듀얼 브랜드 — unified (배치 1과 다름)
- chart는 functional data palette — brand 분기 비대상. HR/Desk 동일 10/20색 사용 (v22 5색 + v23-v24 dark 변형 모두 동일 정책).
- primary는 brand별 유지(`DESIGN.hr.md` `#357B5F`, `DESIGN.desk.md` `#0147AD`). chart-green과 primary-hr는 비슷한 hue지만 별도 토큰 — 역할 분리.

#### v20 추가 — semantic 다크 변형 4개

다크 표면 위 alert·toast·인라인 semantic 텍스트용 lightness 변형. base는 라이트 표면 전용(흰 텍스트 fill 4.5:1↑), light는 다크 표면 위 텍스트 4.5:1↑.

**현재 사용 hex는 v53 vivid refresh 후** (Tailwind 400 톤). v20 시점 hex는 변천 history.

| 토큰 | v20 hex (이전) | v53 hex (**현재**) | 다크 표면 contrast (Tailwind 400 톤) |
|---|---|---|---|
| `success-light` | `#5DC07B` | `#4ADE80` | surface-default-dark ≥4.5:1 ✅ (Tailwind green-400) |
| `error-light` | `#F08080` | `#F87171` | surface-default-dark ≥4.5:1 ✅ (Tailwind red-400) |
| `warning-light` | `#E8A05A` | `#FB923C` | surface-default-dark ≥4.5:1 ✅ (Tailwind orange-400) |
| `info-light` | `#6FAEDF` | `#60A5FA` | surface-default-dark ≥4.5:1 ✅ (Tailwind blue-400) |

4개 컴포넌트(`alert-text-{semantic}-on-dark`)에서 lint contrast 룰로 검증 — 모두 ≥4.5:1 통과.

**채움 fill 비호환** (의도): white(`text-on-accent`)을 light 변형 위에 올리면 L 0.35~0.43이라 contrast 2.2~2.7로 미달. 다크 모드 채움 badge는 base 색 유지 + 외곽선 보강 또는 별도 패턴(향후 v21+에서 검토).

#### HR / Desk 듀얼 브랜드
- 8개 토큰 모두 양 브랜드 동일 사용 — functional state 전달은 브랜드 분기 비대상.
- 시각 차별화: `success`(forest)는 HR primary(emerald 계열)와 미세 hue 분리, `info`(deep navy)는 Desk primary(vibrant blue 계열)와 채도 분리. 단 단독 노출 시 식별성을 위해 컴포넌트 레벨에서 아이콘(✓/✕/!/i) 동반을 권장(prose 가이드 영역).
- 컴포넌트는 brand 컨텍스트(HR vs Desk) × 모드 컨텍스트(light vs dark) 매트릭스로 4값 분기 — 토큰 자체에 분기 표현됨.

### Brand history (v7~v16) — brand 파일로 이전 (v17 분리 · 기록 — 기준은 v102 브랜드 역할)

v7 (brand light variants) · v14 (brand refresh + temporary bg-page fork) · v16 (border-focus) prose는 모두 brand-specific이므로 v17 file split 시 `DESIGN.hr.md` / `DESIGN.desk.md`로 이전. 본 파일은 brand-agnostic이라 history도 보유하지 않음.

요약 trace (전체는 brand 파일 참조):
- v7: 어두운 표면용 brand light variant 도입 (`primary-*-light`)
- v8: `accent-*-on-dark` → `accent-*-light` 명명 정정
- v14: `accent-*` → `primary-*` rename + brand 톤 갱신, bg-page를 일시 brand 분리
- v15: bg-page 단일 `#F5F6FA`로 재통합 (현재 상태)
- v16: `border-focus-*` 시맨틱 alias 도입

본 파일에 남은 v15 핵심 사실: **`bg-page` `#F5F6FA` 단일 — HR/Desk 공유**. 휘도 L=0.9223로 모든 neutral 텍스트 contrast headroom 충분.

## Typography

한국어 본문 가독성 우선. Pretendard를 기본 패밀리, 영문 fallback Inter. 크기 · 줄 높이 · 굵기는 v100(SEED t1 ~ t14 + 역할 스타일 셋), 자리마다 어느 크기 · 굵기 · 색을 쓰는지는 아래 "글자 역할"(2026-10-16)이 정한다. v82 의 15단계는 기록이다.

### v100 — SEED 타입 스케일 (2026-09-29)

당근 SEED 의 타이포그래피 토큰을 그대로 들인다. 크기는 t1(11px) ~ t14(48px) 14단계이고, 줄 높이는 크기마다 SEED 와 같은 px 로 정해져 있다. 굵기는 400 · 500 · 700 셋만 쓴다.

| 토큰 | 크기 | 줄 높이 | 배수 | 쓰는 곳(SEED 기준) |
|---|---|---|---|---|
| `text-t1` | 11px | 15px | ×1.36 | 본문 · 장식 글자 |
| `text-t2` | 12px | 16px | ×1.33 | 본문 · 장식 글자 |
| `text-t3` | 13px | 18px | ×1.38 | 본문 · 장식 글자 |
| `text-t4` | 14px | 19px | ×1.36 | 본문 · 장식 글자 |
| `text-t5` | 16px | 22px | ×1.38 | 본문 · 장식 글자 |
| `text-t6` | 18px | 24px | ×1.33 | 제목 · 주요 글자 |
| `text-t7` | 20px | 27px | ×1.35 | 제목 · 주요 글자 |
| `text-t8` | 22px | 30px | ×1.36 | 제목 · 주요 글자 |
| `text-t9` | 24px | 32px | ×1.33 | 제목 · 주요 글자 |
| `text-t10` | 26px | 35px | ×1.35 | 제목 · 주요 글자 |
| `text-t11` | 28px | 38px | ×1.36 | 큰 화면 제목 — `sm` 중단점 이상 |
| `text-t12` | 32px | 42px | ×1.31 | 큰 화면 제목 — `sm` 중단점 이상 |
| `text-t13` | 40px | 52px | ×1.30 | 큰 화면 제목 — `sm` 중단점 이상 |
| `text-t14` | 48px | 60px | ×1.25 | 큰 화면 제목 — `sm` 중단점 이상 |

역할 스타일:

| 토큰 | 크기 / 굵기 / 줄 높이 | 쓰는 곳 |
|---|---|---|
| `text-screen-title` | 26px / 700 / 35px | 화면 제목 |
| `text-article-body` | 16px / 400 / 24px | 긴 글 본문(×1.5) |
| `text-article-note` | 14px / 400 / 22px | 긴 글 보조(×1.57) |

- **굵기**: 토큰의 굵기는 400 이다. 강조는 `font-medium`(500) · `font-bold`(700) 인라인 modifier 로 준다 — SEED 의 t5Medium · t5Bold 와 같다. 600 은 쓰지 않는다. 옛 title-md · badge 가 쓰던 600 은 옮길 때 500 이나 700 으로 정한다.
- **줄 높이**: UI 글자는 SEED 값(×1.35 안팎), 긴 글은 article-body · article-note(×1.5 안팎). v82 의 "한국어 본문 줄 높이 1.5+" 는 이제 긴 글에만 적용한다.
- **옛 15단계**(아래 v82 — 기록)는 쓰지 않는다. 컴포넌트 스펙은 모두 새 스케일로 옮겼고(2026-10-16 확인 — YAML 에 옛 이름 0), 머리말의 값은 아직 부르는 스크립트 · 레시피(옛 미리보기 · 사이트 HTML 생성기, `typography.tsx`)를 옮길 때까지만 둔다. 본문 body-md(15px)는 자리마다 옮겼다 — 긴 글은 16(article-body), UI 는 14(t4) · 16(t5).
- **옛 이름 → 가까운 새 이름**(옮길 때 참고): display-lg → t13 · display-md → t12 · display-sm → t9 · title-lg → t7 + bold · title-md → t6 + 500 또는 700 · title-sm → t5 + medium · body-lg → t5 또는 article-body · body-md → 자리마다 t4 · t5 · article-body · body-sm → t4 · label-md → t4 + medium · label-sm → t3 · caption → t2 · badge → t1 + 500 또는 700. display-xl(56px) · overline(10px)은 SEED 범위 밖이고 스펙에서 쓰는 곳이 없어 걷을 후보다.
- **단위(v104)**: 값은 여기 px 로 적고, 웹에는 rem(÷16)으로 내보낸다 — 사용자의 글자 크기 설정을 따른다. 커지면 깨지는 자리(배지 · 탭 라벨 · 좁은 칸의 숫자)는 `-static`(px 그대로)을 쓴다(text-t5-static 처럼 — 내보낼 때 생긴다). 앱은 OS 글자 크기를 따르고(Flutter 기본), 같은 자리만 `TextScaler.noScaling` 으로 고정한다. SEED 의 rem · static 두 벌과 같다 — 사용자 결정(2026-09-29).
- 사용자 결정(2026-09-29 — 글자 A: SEED 스케일 그대로, 본문 15px 은 자리마다). "한 번에 토큰 5개" 규칙의 예외다.

### v114 — 줄바꿈: 단어 단위 (2026-10-01)

한국어는 띄어쓰기 단위(어절)로 줄을 바꾼다. 브라우저와 Flutter 의 기본값은 글자(음절) 사이 어디서나 끊어서, 좁은 칸에서 낱말이 두 줄로 갈린다("권한입니 / 다.", "3개 / 월"). 컴포넌트 예시 글 12개를 폰 폭에 그려 보니 7개가 낱말 중간에서 끊겼고, 단어 단위로 바꿔도 줄이 늘어난 글은 없었다.

```css
html {
  word-break: keep-all;
  overflow-wrap: break-word;
}
```

| 플랫폼 | 하는 일 | 어디에 |
|---|---|---|
| 웹 | `word-break: keep-all` + `overflow-wrap: break-word` — 낱말 사이에서만 줄을 바꾸고, 한 줄보다 긴 낱말만 칸 끝에서 끊는다 | 문서 맨 바깥(`html`) 한 번 — 모든 화면 |
| 앱(Flutter) | 낱말 안 글자 사이에 WORD JOINER(U+2060)를 넣어 보여 준다 — Flutter 에는 이 설정이 없다 | 공용 글자 위젯 한 곳 — 보여 주는 글만 |

- `keep-all` 만 쓰면 띄어쓰기 없는 긴 낱말(긴 이름 · 이메일 · 주소)이 칸 밖으로 넘친다 — `overflow-wrap: break-word` 가 그런 낱말만 칸 끝에서 끊는다. 지금 칸 밖으로 넘치던 긴 영문도 칸 안에 들어온다. `anywhere` 도 같은 결과지만 표 칸 폭까지 좁혀 코드 이름이 글자 단위로 쪼개진다 — SEED 와 같은 `break-word` 를 쓴다.
- 폭이 내용을 따르는 flex 항목은 `min-width: 0` 을 둬야 긴 낱말이 칸 안에서 끊긴다(컴포넌트 레시피는 이미 둔다).
- 영문은 원래 단어 단위라 바뀌지 않는다. 일본어는 `keep-all` 이 잘못 끊는다(SEED 레시피 주석) — porest 는 한국어 · 영문만 쓴다.
- 앱의 이음 문자는 보여 주는 글에만 넣는다 — 입력칸 · 복사할 글 · 검색어 · 서버로 보낼 값에는 넣지 않는다. Flutter 3.41 에서 시험했다: 기본값은 "휴 / 가를" · "권 / 한입니다" 처럼 끊고, 이음 문자를 넣으면 낱말 사이에서만 끊으며 한 줄보다 긴 낱말은 그래도 끊는다.
- 한 줄 말줄임 · 줄 수 제한은 그대로 쓴다 — 줄을 바꾸는 자리만 바뀐다.
- 예외 — 파일 이름(Attachment Input 의 파일 카드)은 글자 단위로 끊는다(`word-break: break-all` — SEED 레시피와 같다). 파일 이름은 문장이 아니라 이름표다 — 띄어쓰기 없이 밑줄 · 붙임표로 이어져 단어 단위의 이득이 없고, 글자 단위로 채워야 좁은 칸(폭 70)에 이름이 가장 많이 든다(사용자 결정 2026-10-15 마무리 11D, `specs/components/attachment-input.md`).
- 읽어야 하는 글은 자르지 않는다 — 규정 카드의 본문 · 유의사항(아코디언) 제목 · 나무의 부서 이름은 말줄임 · 줄 수 제한 없이 줄을 바꿔 다 보이고, "더 보기" · 눌러서 상세로 펼치게 하지 않는다(사용자 결정 2026-10-10 — 펼치고 접기 10A).
- 당근(SEED)은 전역 규칙 없이 읽는 글(게시글 본문 · 시트 · 패널 제목 · 도움말 말풍선)만 단어 단위이고, 컴포넌트 라벨 · 설명은 글자 단위다(daangn.com CSS · SEED 레시피, 2026-10-01). porest 는 컴포넌트 라벨 · 설명까지 단어 단위로 한다 — 사용자 결정(2026-10-01).
- 제품은 앱 적용 단계에서 옮긴다 — Desk 웹은 4곳(카드 혜택 2 · 일정 상세 2)에만 손으로 `keep-all` 을 걸었고 HR 웹 · Desk 앱은 없다. 전역 규칙을 걸고 그 4곳은 걷는다.

### 글자 역할 (2026-10-16)

v100 은 크기 · 줄 높이 · 굵기의 토큰을 정했고, v102 는 글자색의 이름을 정했다. 이 절은 그 둘을 **자리마다 어떻게 묶어 쓰는지**를 정한다 — 컴포넌트 스펙의 글자 부위 148곳(60 컴포넌트)을 뜻으로 묶은 열아홉 역할이다. 값 대부분은 SEED 컴포넌트 값을 옮긴 것이고(묶음마다 "SEED 구조 그대로" 를 고른 비교 페이지), SEED 에 짝이 없던 자리와 규칙이 없던 자리는 사용자가 정했다(2026-10-16 글자 역할 비교 페이지 https://claude.ai/artifact/X9n6tDZbKSP7GeLtodtz8N — D1 ~ D7). 새 자리를 그릴 때는 이 표에서 역할을 고르고, 표에 없는 (크기 · 굵기 · 색) 조합을 새로 만들지 않는다.

| 역할 | 글자 · 굵기 · 색 | 쓰는 자리 | 출처 |
|---|---|---|---|
| R1 화면 제목 | 데스크톱 `text-screen-title` 26/35 · 700 · `fg-neutral` / 폰 탭 첫 화면 t8 · 700 / 폰 들어간 화면 t6 · 700 | 데스크톱 본문 맨 위 h1 · 폰 상단 바. 폰 바 제목은 글자 크기 설정 1.2배까지 | 사용자 결정(화면 틀 2026-10-04) |
| R2 화면 부제 | t5 · 400 · `fg-neutral-muted` | 데스크톱 화면 제목 아래 · 폰 탭 첫 화면 바 아래 한 줄 | 사용자 결정 D6 |
| R3 떠 있는 표면 제목 | t8(시트 · 대화상자 · 옆 패널) / t7(팝오버 · 확인창) / t6(메뉴 시트) · 700 · `fg-neutral` | Bottom Sheet · Dialog · Side Panel · Popover · Alert Dialog · Menu Sheet — 표면이 클수록 크다 | SEED 값 |
| R4 구역 · 카드 · 목록 머리 제목 | t5 · 700 · `fg-neutral` | Card 머리 · 아코디언 목록 머리 · 페이지 안 카드 밖 구역 제목(데스크톱 h2) · 나무 패널 머리 | 사용자 결정(Card 6B · D3) |
| R5 묶음 이름 | 큰 목록 t4 · 500 · `fg-neutral-subtle` / 작은 목록 · 메뉴 t3 · 400 · `fg-neutral-subtle` / 사이드바 묶음 t4 · 700 · `fg-neutral-muted` / 푸터 열 제목 t3 · 500 · `fg-neutral-muted` | List Header mediumWeak · Select · Icon Picker / Menu · Select medium / Side Navigation / Footer | SEED 값(사이드바 · 푸터는 SEED 레시피 · 블록 값 — 사용자 결정 D4) |
| R6 줄 제목 | 목록 t5 · 400 · `fg-neutral` / 메뉴 · 표 · 나무 t4 · 400 / 고르는 상자 · 여닫는 머리 t5 · 500 / 사이드바 항목 t4 · 500 · `fg-neutral-muted` | List · Menu · Table · Tree View / Select Box · Accordion · Collapsible · Switch / Side Navigation | SEED 값 · 사용자 결정(List 400 · Select Box 500) |
| R7 표면 머리 설명 | 시트 · 대화상자 · 옆 패널 · 결과 t5 · 400 · `fg-neutral-muted` / 팝오버 · 메뉴 시트 t4 · 400 · `fg-neutral-muted` | 떠 있는 표면 · Result Section 머리. Select Box 설명(t3)도 muted | SEED 값 |
| R8 확인창 설명 | t5 · 400 · `fg-neutral` | Alert Dialog 만 — 꼭 읽어야 할 말 | SEED 값 |
| R9 줄 · 칸 안 설명 · 메타 | 줄 t3 · 400 · `fg-neutral-subtle` / 칸 t4 / 작은 메뉴 t2 | List 설명 · Tag Group · Field 설명 · Menu 설명 · 표 둘째 줄. 강조 · 누름 바탕 위에서만 muted | SEED 값 · 사용자 결정(강조 줄 2026-10-01) |
| R10 보조 숫자 · 축 · 단위 · 캡션 | 차트 축 t1 · 400 · `fg-neutral-subtle` / 툴팁 머리 t2 / 지표 라벨 t3 · 500 / 범례 이름 · 툴팁 줄 이름 · 색 칸 이름 t3(색 칸 t2) · 400 | Chart · Card 지표 라벨 · 파일 크기 · 증감 기준 글 · Color Swatch | 사용자 결정 D5 |
| R11 긴 글 본문 · 보조 | `text-article-body` 16/24 · 400 · `fg-neutral` / `text-article-note` 14/22 · 400 · `fg-neutral-muted` | 공지 · 약관 · 혜택 상세(Accordion 본문) · 메모 본문 | v100 |
| R12 값 | 큰 칸 t5 · 400 · `fg-neutral` / 작은 칸 t4 / 막힌 칸 `fg-disabled` | Input · Select · Input Button · Textarea | SEED 값 |
| R13 금액 · 큰 숫자 | 줄 금액 t5 · 700 · `fg-neutral`(수입만 브랜드 파일의 fg-brand) / 지표 카드 t9(데스크톱 격자 t7) · 700 · `fg-neutral` / 순자산 t12 · 700 · `static-white` | 거래 줄 · 상세 · 합계 · 지표 카드 · 도넛 가운데. 고정폭 숫자 · 빼기 U+2212 · 원까지 | 크기는 기존 값, 색은 사용자 결정 D1 |
| R14 증감 | t3 · 500 · ▲ `fg-critical` / ▼ `fg-informative` / 그대로 `fg-neutral-subtle` | Card 증감 · 통계 · 증권 · 예산. 브랜드 채움 위는 `static-white` | 사용자 결정(2026-10-08) |
| R15 버튼 글 | Button t3 ~ t6 · 700 / Chip t4 · 500 / 탭 · Segmented 700(쉬는 탭 `fg-neutral-subtle`) / 하단 탭 t1-static · 500 | Button · Chip · Tabs · Segmented Control · Bottom Navigation — 글자만, 색은 변형이 정한다 | SEED 값 |
| R16 글 버튼 | t4 · 700 · `fg-neutral-muted` — SEED Text Button | Card 머리 동작("전체 보기") · 아코디언 "모두 펼치기" · Result Section 둘째 버튼 · List Header 오른쪽 버튼 | 사용자 결정 D2 |
| R17 링크 | 글 안 링크 t4 · 400 · `fg-neutral` · 밑줄 / 푸터 사이트맵 t5 · 500 · `fg-neutral` / 푸터 정책 t4 · 500 · `fg-neutral-muted`(밑줄 없음) | Callout 링크 · Footer | SEED 값 |
| R18 칸 라벨 | t5 · 500(굵게 700) · `fg-neutral` | Field 라벨 — "라벨" 은 이 뜻 하나로 부른다(지표 라벨은 R10, 진행 막대 이름은 R6) | SEED 값 |
| R19 오류 · 자리 글 · 막힘 | 오류 t4 · 400 · `fg-critical`(+ 아이콘) / 자리 글 t5(작은 칸 t4) · 400 · `fg-placeholder` / 막힘 `fg-disabled` | Field 오류 · 입력칸 placeholder · 막힌 컨트롤. 도움말은 R9 | SEED 값 · 사용자 결정 D7 |

표에 없는 크기 — Button 은 크기마다 t3 ~ t6, 하단 탭 이름 t1-static 11/15 · 500, 순자산 t12 32/42 · 700, 열지도 칸 t1 · 700. 굵기는 400 · 500 · 700 셋이고 600 은 없다(v100).

- **muted 와 subtle(D5)** — `fg-neutral-subtle` 은 덧붙인 정보(축 · 시각 · 단위 · 범례 이름 · 메타 줄), `fg-neutral-muted` 는 문장으로 된 보조 글(떠 있는 표면 설명 · "더 불러오지 못했어요." 같은 상태 문구 · 긴 글 보조)이다. 같은 차트 안의 글자(축 · 툴팁 머리 · 범례 이름 · 툴팁 줄 이름)는 모두 subtle 한 색이다. 흰 면 위 muted 7.11 · subtle 5.50 이라 눈으로 잘 갈리지 않는다 — 고를 때 값이 아니라 이 규칙으로 고른다. SEED 에는 이 지침이 없고(색 이름 설명뿐), 규칙은 SEED 컴포넌트 값에서 읽었다.
- **금액 색(D1)** — 지출 · 이체 금액은 `fg-neutral`, 수입만 fg-brand("+" 부호와 함께)다. 빨강(`fg-critical`)은 증감(▲ 올랐다) 한 뜻으로만 쓰고, 금액을 빨갛게 칠하지 않는다 — 거래 종류는 부호 · 아이콘 타일 · 배지가 말한다. **대가**(Desk) — 파랑이 둘이다(수입 fg-brand · ▼ 내림 `fg-informative`). 라이트는 #0147AD · #1D6EC9(서로 1.65:1)로 갈리지만 다크는 #7AA9F6 · #69ABFF 로 **1.00:1** — 다크 통계 화면에서 수입 금액과 ▼ 증감이 같은 색으로 보인다.
- **구역 제목(D3)** — 페이지 안 카드 밖 구역 제목(데스크톱 h2 — "자산" 화면의 "입출금 · 저축" 같은)은 카드 머리와 같은 t5 · 700 · `fg-neutral` 한 벌이다. 위계는 크기가 아니라 자리(바닥 위 · 카드 밖)와 여백이 말한다 — 화면 제목 26 → 구역 16 → 카드 머리 16 → 카드 안 목록 제목 14. 나무 패널 머리도 t5 다(전 t6). 폼 안 묶음 제목(Fieldset)은 그대로 List Header 다(`specs/components/field.md`).
- **화면 부제(D6)** — 화면 제목 아래 한 줄은 t5 · 400 · `fg-neutral-muted` 다(바닥 위 6.58:1 · 다크 8.73:1). 떠 있는 표면 설명(R7)과 같은 뜻이다. 길면 줄을 바꾼다 — 폰에서는 바 아래 한 줄을 더 차지한다.
- **글 버튼(D2)** — SEED Text Button 값 그대로다: 글 t4 · 700 · `fg-neutral-muted`, 보이는 높이 36(`spacing-x9`) · 좌우 14(`spacing-x3_5`) · 위아래 8 · 모서리 8(`radius-r2`), 누름 바탕 `bg-layer-default-pressed`, 아이콘 · 꺾쇠 없음. 누르는 영역은 44 × 44(보이는 36 위아래로 4 씩 — WCAG 2.5.5 AAA ✓ · 2.5.8 AA ✓). 줄 끝에 둘 때는 오른쪽 여백만큼 바깥으로 내어(−14) 글자가 줄 끝 글자와 맞게 한다. 2026-10-08 Card 머리 동작 6B(14 · 500 · `fg-neutral-subtle` · 32 + 꺾쇠 16)를 사용자가 이 값으로 바꿨다. 상단 바 글 버튼(t5 · 500) · 스낵바 동작 · 페이지 배너 버튼 · 첨부 다시 시도 · 메뉴 시트 닫기는 SEED 가 각자 정한 값이라 이 역할에 들지 않는다.
- **자리 글(D7)** — `fg-placeholder` 는 SEED 처럼 gray-600 이다(v119 — v102 의 gray-700 을 바꿨다). 앞뒤 글자 · 칸 아래 설명(`fg-neutral-subtle`, gray-700)보다 한 단계 옅어 빈 칸이 색으로도 보인다. **대가** — 흰 면 4.18:1 · 다크 시트 3.58:1 로 4.5:1 밑이고, 다크 값(#838997)이 `fg-disabled` 다크와 같다. 빈 칸과 막힌 칸은 칸 바탕(`bg-disabled`)과 커서로 갈린다.
- **묶음 이름(D4)** — 사이드바 묶음(t4 · 700 · muted)과 푸터 열 제목(t3 · 500 · muted)은 List Header 규칙(subtle)과 다르지만 SEED 레시피(`side-navigation.css`) · 블록(footer-04) 값 그대로 둔다.
- **500 을 쓰는 줄 제목** — 고르는 상자 · 여닫는 머리 · 내비 항목 · 스위치 라벨만 500 이다. 나머지 줄 제목은 400 이고, 굵기는 목록 제목 · 금액에 남긴다.

### v82 — 15단계 타입 스케일 (기록 — 지금 스케일은 위 v100, 자리마다 쓰는 값은 위 "글자 역할")

> 기록이다 — 아래는 v82 때 적은 그대로다. body-md 15 "기본 본문" · 600(`font-semibold`) 강조 · display-xl hero 는 지금 쓰지 않는다. 지금 규칙은 v100(600 없음 · 큰 제목 t11 ~ t14) 과 "글자 역할" 이다.

| 토큰 | size | weight | lh | letter-spacing | 주 용도 |
|---|---|---|---|---|---|
| `display-xl` | 56px | 700 | 1.05 | -1.12px | Hero 큰 마케팅 헤더 (랜딩, KPI 영역) |
| `display-lg` | 40px | 700 | 1.1 | -0.4px | Tablet landscape hero, 큰 섹션 헤더 |
| `display-md` | 32px | 700 | 1.2 | -0.32px | 페이지 제목 (Toss 톤 한국어 헤더) |
| `display-sm` | 24px | 700 | 1.3 | — | 큰 섹션 제목 |
| `title-lg` | 20px | 700 | 1.4 | — | 큰 카드 제목, modal heading |
| `title-md` | 18px | 600 | 1.4 | — | 카드/섹션 제목 |
| `title-sm` | 16px | 500 | 1.4 | — | 작은 제목, 버튼/nav 텍스트 (한국어 16px Medium 가독) |
| `body-lg` | 16px | 400 | 1.6 | — | 강조 본문, hero subtitle |
| `body-md` | 15px | 400 | 1.6 | — | **default 본문** (한국어 가독성 — Toss/네이버 톤) |
| `body-sm` | 14px | 400 | 1.5 | — | 보조 본문, dense list |
| `label-md` | 14px | 500 | 1.4 | — | form label, 보조 버튼 |
| `label-sm` | 13px | 400 | 1.4 | — | 작은 라벨, helper text (Regular — 한국어 부드러움 우선) |
| `caption` | 12px | 400 | 1.5 | — | 캡션, 메타, 타임스탬프 |
| `badge` | 11px | 600 | 1.2 | — | 배지 마이크로 라벨 |
| `overline` | 10px | 700 | 1.3 | 0.8px | uppercase eyebrow / 카테고리 태그 |

#### 명명 정책 (Airbnb 태그명 + 한국어 사양)
- **카테고리**: `display`(헤드라인) / `title`(제목) / `body`(본문) / `label`(폼·버튼) / `caption`(메타) / `badge`(배지) / `overline`(eyebrow).
- **사이즈 modifier**: `xl > lg > md > sm` (각 카테고리 내 위계). Airbnb 14단계와 동일한 명명 컨벤션이지만 사양은 한국어 본문(15/1.6) 우선.
- **`body-md` 15px / 1.6**가 한국어 default 본문 — Pretendard hinting 안정성 + 한글 받침 영역 가독성을 위한 lh 1.6 유지.

#### 폰트 패밀리
모든 토큰: `Pretendard, Inter, sans-serif`
- **Pretendard**: 한국어 우선 가변폰트(CLAUDE.md 규칙). 한글·영문 자형 균형.
- **Inter**: 영문 fallback.
- **sans-serif**: 시스템 fallback.

#### WCAG 검증
- **1.4.3 Contrast (4.5:1 본문)**: 색상이 아닌 치수 토큰. 본문 색상 대비는 `text-*` 토큰이 담당, 모든 표면 페어 사전 통과.
- **1.4.12 Text Spacing (line-height ≥1.5 본문)**: `body-lg`/`body-md` 1.6, `body-sm`/`caption` 1.5 — 본문 카테고리 통과. 큰 헤딩(display/title)은 단락 본문 비대상.
- **1.4.4 Resize text (200% zoom)**: 모든 토큰 px 단위, 브라우저 zoom 정상 대응. 가독성 한계 사이즈(`badge` 11px, `overline` 10px)는 인라인 라벨/eyebrow에만 사용 — 본문 미사용 원칙.

#### Responsive hero (mobile-first)
페이지 hero typography는 viewport에 따라 스케일 분기. 토큰 재사용으로 4단계.

| Breakpoint | 토큰 | size / lh / weight | 사용 |
|---|---|---|---|
| `breakpoint-lg` (1280+) | `display-xl` | 56 / 1.05 / 700 | Desktop landing hero |
| `breakpoint-md` (768~) | `display-lg` | 40 / 1.1 / 700 | Tablet |
| `breakpoint-sm` (480~) | `display-md` | 32 / 1.2 / 700 | 큰 폰 · 작은 태블릿, 한국어 페이지 제목 |
| 기본 (~479) | `display-sm` | 24 / 1.3 / 700 | Phone |

v101 에서 중단점이 SEED 값(480 · 768 · 1280 · 1440)으로 바뀌며 단계를 옮겼다 — 데스크톱 hero(`display-xl`)는 v54 의 1069 대신 `breakpoint-lg`(1280)부터다.

CSS 패턴 (mobile-first, `@media (min-width)`):

```css
.hero-h1 {
  font: var(--text-display-sm--font-weight) var(--text-display-sm) / var(--text-display-sm--line-height) var(--font-sans);
}
@media (min-width: 480px) {
  .hero-h1 { font: var(--text-display-md--font-weight) var(--text-display-md) / var(--text-display-md--line-height) var(--font-sans); }
}
@media (min-width: 768px) {
  .hero-h1 { font: var(--text-display-lg--font-weight) var(--text-display-lg) / var(--text-display-lg--line-height) var(--font-sans); }
}
@media (min-width: 1280px) {
  .hero-h1 { font: var(--text-display-xl--font-weight) var(--text-display-xl) / var(--text-display-xl--line-height) var(--font-sans); }
}
```

#### v82 변경 정책 (옛 21 → 새 15)
- **카테고리 정리**: `display`/`title`/`body`/`label`/`caption`/`badge`/`overline` 7 카테고리. 각 카테고리 내 사이즈 modifier(`xl/lg/md/sm`)로 위계.
- **사이즈 통합**: 16px weight 600 계열을 `title-sm` 단일 토큰으로 통합.
- **사양 일원화**: 본문 카테고리(`body-lg`/`body-md`)는 한국어 lh 1.6 통일, 영문 1.5 분기 제거. weight 강조는 별도 토큰 대신 인라인 modifier(`font-semibold`).
- **추가**: `overline` 10px 700 +0.8px (uppercase eyebrow). 옛 prose-only spec(56/40 hero)을 `display-xl`/`display-lg`로 정형 토큰화.
- **삭제**: 옛 가독성 한계(8px) 및 영문 전용 모호 토큰. 사양은 `DESIGN.history/v82-typography-15.md`에 보존.

#### HR / Desk 듀얼 브랜드
모든 typography 토큰은 brand-neutral — 양 브랜드 동일 스케일. 사용 컨텍스트만 컴포넌트 레벨에서 분기 (HR 헤딩 weight 700 강조 / Desk 모바일 친화 사이즈 등).

#### 자동 검증
- design.md lint contrast 룰은 색상에만 적용 — typography 자체는 통과.
- letterSpacing은 modifier로 export (`--text-{name}--letter-spacing`). v82에서 `display-xl/lg/md` + `overline`이 letterSpacing 사용.

## Layout

### v101 — SEED 레이아웃 (2026-09-29)

당근 SEED 의 Layout 문서를 기준으로 중단점 · 콘텐츠 폭 · 여백 · 사이드바를 정한다. 사용자가 2026-09-29 porest 와 SEED 를 나란히 놓은 비교 페이지를 보고 네 가지 모두 SEED 쪽을 골랐다. 앱 화면 가장자리만 porest 값(24px)을 둔다 — 2026-09-14 에 정한 앱 규칙이다.

**Desk 웹 · 앱의 디자인 시스템 토큰에는 값이 들어갔다**(웹 `porest-tokens.css` · 앱 `porest_tokens.g.dart` — 2026-10-06 가져오기). 화면은 아직 옛 값을 쓰고 화면 이관 때 이 이름으로 옮긴다 — 그 전까지는 화면 코드의 값(Desk 웹 좌우 여백 28 · 사이드바 256 등)이 이 표와 다른 게 정상이다. 중단점만은 화면 이관을 기다리지 않는다(아래 "중단점"). HR 은 아직이다(HR 웹 Tailwind 기본 중단점 · 사이드바 288 — 앱 적용 단계).

출처: seed-design.io Foundations › Layout, `@seed-design/qvism-preset` 의 layout · side-navigation 레시피, rootage `dimension`(역할 간격). SEED 는 Apache-2.0 이다.

#### 중단점

| 토큰 | 값 | 구간 |
|---|---|---|
| `breakpoint-sm` | `480px` | 480 – 767 · 큰 폰 · 작은 태블릿 |
| `breakpoint-md` | `768px` | 768 – 1279 · 사이드 내비게이션이 보이기 시작한다 |
| `breakpoint-lg` | `1280px` | 1280 – 1439 · 데스크톱 |
| `breakpoint-xl` | `1440px` | 1440 이상 · 넓은 데스크톱 |

| 구간 | 폭 | 칸 | 칸 사이 | 좌우 여백 |
|---|---|---|---|---|
| 기본(base) | 0 – 479 | 한 줄 | 16 · `layout-gutter-narrow` | 24 · `spacing-global-gutter` |
| sm | 480 – 767 | 한 줄 | 16 · `layout-gutter-narrow` | 24 · `spacing-global-gutter` |
| md | 768 – 1279 | 밀도대로(8 · 12) | 24 · `layout-gutter` | 32 · `layout-margin` |
| lg | 1280 – 1439 | 밀도대로(8 · 12) | 24 · `layout-gutter` | 32 · `layout-margin` |
| xl | 1440 이상 | 밀도대로(8 · 12) | 24 · `layout-gutter` | 32 · `layout-margin` |

- 모바일 우선이다. 0 – 479 는 기본(base)이라 토큰이 없다.
- 화면 틀을 JS 로 바꾸는 기준도 이 값을 쓴다 — 모바일 틀(하단 탭바) ↔ 사이드바 틀은 `breakpoint-md`. 스타일(`md:`)과 화면 틀이 다른 폭에서 바뀌면 그 사이에서 모바일 틀 안에 태블릿 스타일이 켜진다(v101 전 Desk 웹의 736 – 767).
- 옛 `2xl`(1441px)은 없앴다 — 두 웹 모두 쓰는 곳이 없었다. Tailwind 로 내보낼 때 기본 중단점을 먼저 지운다(`--breakpoint-*: initial`). 안 지우면 Tailwind 기본 2xl(1536px)이 살아남는다.
- v54 의 Apple Store 기준(640 · 736 · 834 · 1069 · 1441)은 아래 기록 절과 `DESIGN.history/v101-seed-layout.md` 에 있다.
- **Desk 웹은 옛 중단점을 지금 모두 옮긴다**(2026-10-16 사용자 결정 — 기초 웹 비교 페이지 https://claude.ai/artifact/U33bUxZkgQoHfAgdp2DEVK 01-024 C). 화면에 남은 옛 값 — `min-[640px]:` → `sm`(480) · `min-[736px]:` · `min-[834px]:` → `md`(768) · `min-[1069px]:` → `lg`(1280), 화면 틀의 1100 문턱(`useDeviceSize`)은 위 "화면 틀" 의 768 · 1280 — 을 화면 이관을 기다리지 않고 한 번에 이 표의 이름으로 바꾼다. 대가로 그 사이 폭(480 ~ 639 · 768 ~ 833 · 1069 ~ 1279)의 겉모습이 바뀐다. desk-front `CLAUDE.md` 의 "겉모습이 바뀌지 않게 옛 값(640 · 736 · 834 · 1069)을 적어 고정" 규칙은 "이름 있는 중단점(`sm` · `md` · `lg` · `xl`)만 쓰고 `min-[NNNpx]:` 를 적지 않는다" 로 바꾼다.

#### 콘텐츠 폭 — 밀도

화면마다 밀도를 하나 고르고, 밀도가 콘텐츠의 최대 폭을 정한다. 폭을 제한하면 가운데 정렬한다(`margin-inline: auto`).

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-max-low` | `720px` | low 밀도의 최대 폭 · medium 밀도의 768 – 1279 최대 폭 |
| `layout-max-medium` | `1040px` | medium 밀도의 1280 이상 최대 폭 |

| 밀도 | 정렬 | 칸 | 칸 사이 | 좌우 여백 | 768 – 1279 | 1280 이상 | 쓰는 화면 |
|---|---|---|---|---|---|---|---|
| low | 가운데(Centered) | 8 | 24 | 32 | 720 | 720 | 간단한 설정 창 · 대시보드 요약 |
| medium (기본) | 가운데(Centered) | 12 | 24 | 32 | 720 | 1040 | 일반 관리 도구 · 데이터 목록 |
| high | 가변(Fluid) | 전체 폭 | — | 32 | 제한 없음 | 제한 없음 | 대량 데이터 시각화 · 편집 도구 |

- 768 미만은 밀도와 상관없이 칸 없이 화면 폭 전체를 쓴다. 칸 수는 밀도로만 정한다 — SEED 와 같다(v103, 2026-09-29).
- high 는 최소 폭도 두지 않는다. SEED 는 최소 1040 이지만 태블릿 세로(768)에서 가로 스크롤이 생겨 두지 않았다(v103).
- 어느 화면이 어느 밀도인지는 앱에 적용할 때 화면 목록을 만들어 정한다.

#### 콘텐츠 레이아웃

서비스 소개처럼 정보를 전하는 페이지(porest-home 등)에 쓴다 — 두 웹의 관리 화면은 위 밀도를 쓴다. 12칸이고 `breakpoint-lg`(1280) 이상에서 가운데 정렬한다(v103, 2026-09-29).

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-max-content` | `1040px` | 콘텐츠 레이아웃 기본 최대 폭 — 읽기에 몰입하게 |
| `layout-max-content-wide` | `1280px` | 넓게 훑어보는 페이지(검색 결과 · 목록)의 최대 폭 |

- `layout-max-medium` 과 값(1040)이 같지만 뜻이 달라 따로 둔다 — 한쪽만 바꿀 수 있게.
- 아직 porest-home 에 들어가지 않았다. 그 레포를 고칠 때 맞춘다.

#### 여백 · 칸 사이

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-margin` | `32px` | 웹 페이지 좌우 여백 · 768 이상 |
| `layout-gutter` | `24px` | 웹 칸 · 카드 사이 · 768 이상 |
| `layout-gutter-narrow` | `16px` | 칸 사이 · 768 미만(v103) — 위아래로 쌓은 카드 사이는 8(2026-10-08) |

- 768 미만의 화면 가장자리는 `spacing-global-gutter`(24px)다. 카드는 위아래로 8 띄워 쌓는다(2026-10-08 — SEED "8px Gap", `specs/components/card.md`) — 카드 사이가 가장자리보다 좁아 카드 묶음이 한 덩어리로 보인다.
- SEED 문서 안에서도 값이 둘이다 — Dashboard 격자 표는 여백 32 · 칸 사이 24, Breakpoint 표는 768 이상 여백 24 · 칸 사이 32(768 미만 여백 12 · 칸 사이 16). 두 웹 모두 관리 도구라 Dashboard 격자를 따른다.

#### 역할 간격

SEED 가 자리에 이름을 붙인 간격이다(SEED 이름은 `spacing-x.*` 수평 · `spacing-y.*` 수직). porest 는 머리말의 spacing 블록에 이름만 두고, 값은 v98 스케일 위에 있다.

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `spacing-global-gutter` | 24px · `spacing-x6` | 수평 — 화면 전체의 기본 좌우 여백. SEED 는 16px — porest 는 앱 규칙(2026-09-14, 본문 24)을 둔다 |
| `spacing-between-chips` | 8px · `spacing-x2` | 수평 — 칩 사이 |
| `spacing-component-default` | 12px · `spacing-x3` | 수직 — 따로 정한 간격이 없는 컴포넌트 사이 |
| `spacing-between-text` | 6px · `spacing-x1_5` | 수직 — 글 요소 사이 |
| `spacing-nav-to-title` | 20px · `spacing-x5` | 수직 — 상단 내비게이션과 화면 제목 사이 |
| `spacing-screen-bottom` | 56px · `spacing-x14` | 수직 — 화면 맨 아래 여백 |

- Desk 앱의 화면 좌우 여백(2026-09-14 규칙): 본문은 24. 주간 띠 · 캘린더 격자 안 칸의 인셋 · 카테고리 탭 바의 전폭은 의도한 예외다.

#### 사이드바 · 영역

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-sidebar` | `240px` | 사이드 내비게이션 폭 |
| `layout-sidebar-collapsed` | `56px` | 접은 사이드 내비게이션(아이콘만) |

- 화면은 머리(GNB) · 사이드 내비게이션 · 본문 · 오른쪽 보조 영역(Aside) 넷으로 나눈다.
- 사이드 내비게이션은 `breakpoint-md`(768px) 이상에서 보인다. 그 아래에서는 Desk 웹은 앱과 같은 하단 탭 바(Bottom Navigation), HR 은 상단 바의 ☰ 로 여는 왼쪽 주 메뉴(Side Panel)다 — 아래 "화면 틀".
- 머리(상단 바) 높이는 56 이다 — 폰 · 데스크톱 모든 화면(2026-10-04, `specs/components/top-navigation.md`). SEED 는 2026-10-01 에 iOS · Android 를 56 으로 통일했다.
- 사이드 내비게이션 안쪽 치수(머리 64 · 항목 44 · 아이콘 20 · 14 / 19 · 500 · 모서리 10)는 `specs/components/side-navigation.md` · `.yaml` 에 있다(2026-10-04 — SEED). 768 ~ 1279 는 아이콘만 56 으로 저절로 접힌다 — 아래 "화면 틀".

### 화면 틀 — 머리 · 하단 탭 바 · 사이드바 (2026-10-04)

화면을 감싸는 틀 — 머리(상단 바) · 주 메뉴(하단 탭 바 · 사이드바) · 본문 — 을 정한다. 사용자가 2026-10-04 화면 틀 · 이동 비교 페이지에서 골랐다. 부품의 값은 각 스펙에 있다 — `specs/components/top-navigation.md` · `bottom-navigation.md` · `side-navigation.md` · `side-panel.md` · `pagination.md` · `floating-action-button.md`.

**아직 두 웹 · 앱에는 들어가지 않았다.** 앱 적용 단계에서 옮긴다(각 스펙의 Migration notes).

#### 문턱 — 768 · 1280

화면 틀이 바뀌는 폭은 둘이다 — 768(`breakpoint-md` — 모바일 틀 ↔ 사이드바 틀)과 1280(`breakpoint-lg` — 사이드바 접힘 ↔ 펼침, 시트 ↔ 대화상자). Desk 웹 안의 1100 문턱('tablet')은 걷는다 — Desk 데스크톱 홈의 두 칸도 1280 부터이고 768 ~ 1279 는 한 칸이다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-017-6 A).

| 자리 | 0 – 767 | 768 – 1279 | 1280 이상 |
|---|---|---|---|
| 머리 | 상단 바 56 — 탭 첫 화면은 큰 제목, 그 아래는 ← + 제목 | Desk 데스크톱 머리 56 · HR 은 머리 없음 | 같다 |
| 주 메뉴 | Desk 하단 탭 바 · HR ☰ → 왼쪽 옆 패널 | 사이드바 접힘 56(손으로 펼침) | 사이드바 펼침 240(손으로 접음 · 기억) |
| 화면 제목 | 상단 바의 제목 | 본문 맨 위 `h1` | 같다 |
| 폼 · 상세 · 고르기 | Bottom Sheet | Bottom Sheet | Dialog · Popover |
| 줄의 동작 | Menu Sheet | Menu Sheet | Menu |
| 접힌 사이드바의 하위 | — | 옆 펼침 메뉴(줄 44 — Menu Sheet 로 바꾸지 않는다, 2026-10-08) | 같다(손으로 접었을 때) |
| 긴 목록 | 끝없이 불러오기 | Pagination | Pagination |
| 데이터 표 | Table Pagination(표와 함께 가로 스크롤) | Table Pagination | Table Pagination |
| 화면의 주 동작 | 탭 바 가운데 + · 탭 바 없는 화면은 떠 있는 버튼 | 머리의 버튼 | 같다 |
| 본문 폭 | 화면 폭 | 밀도 표(720) | 밀도 표(720 · 1040) |

- Pagination 의 칸 수는 480(`breakpoint-sm`)에서 9 ↔ 7 이다.
- 768 – 1279 는 사이드바 틀인데 겹치는 표면은 시트다 — 터치 태블릿과 작은 노트북이 섞인 폭이라 손가락에 맞는 쪽을 둔다(시트 · 대화상자 2026-10-02 결정의 1280).

#### 머리 · 화면 제목

- 머리(상단 바)는 높이 56 — 폰 · 데스크톱 모든 화면이 같다. 스크롤해도 선 · 그림자를 긋지 않는다(Elevation).
- 폰은 상단 바의 제목이 화면 제목(`h1`)이다 — 탭 첫 화면은 22 / 30(`text-t8`), 그 아래 화면은 18 / 24(`text-t6`), 둘 다 700 · 왼쪽.
- 데스크톱은 머리에 제목을 두지 않는다 — 본문 맨 위 `h1` 이 화면 제목이다. `text-screen-title`(26 / 35 · 700), 머리 아래 `spacing-nav-to-title`(20). 모든 화면에 하나다(홈 · 캘린더도). 제목 줄은 한 줄 — 제목(설명은 그 아래)이 왼쪽, 그 화면의 동작 버튼(Button small · `neutralOutline` — 회색 바닥 위, 2026-10-16 사용자 결정 174-3 A)이 오른쪽이다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-018-2 A).
- HR 은 데스크톱 머리를 두지 않는다 — 접기 버튼은 사이드바 머리로, 테마는 설정으로 갔고, 위치는 사이드바의 지금 항목이 알린다(빵부스러기는 걷었다).

#### 화면을 옮길 때

| 일 | 스크롤 | 초점 |
|---|---|---|
| 다른 화면으로(링크 · 사이드바 항목) | 맨 위 | 새 화면의 제목(`h1`) |
| 뒤로 가기 · ← | 그 화면에 있던 자리 | 그 화면의 제목 |
| 하단 탭 옮기기 | 그 탭의 마지막 화면 · 자리(탭마다 기억 — 웹도, 목록이 그려진 뒤 돌려놓는다 — 2026-10-16 Q-018-4 A) | 그 탭 화면의 제목 |
| 화면 맨 위 1차 탭 옮기기(가계부 · 자산 · 통계 · 예산) | 그 탭에 있던 자리(탭마다 기억 — Tabs) | 고른 탭 |
| 지금 탭을 다시 누름 | 맨 위 · 그 탭의 첫 화면 | 그대로 |
| 쪽 넘기기(Pagination) | 목록 맨 위 | 누른 칸 — "N페이지" 를 알린다 |

- 문서 제목은 화면마다 "{화면 제목} - Porest Desk" · "{화면 제목} - Porest HR" 이다.
- ← 는 들어온 화면으로(History), 앞 화면이 없으면 상위 화면으로 — 주소를 고쳐 쓴다. ✕ 는 모달 · 독립 흐름을 닫을 때만.

#### 화면 바탕 — 회색 바닥 위 흰 층

Desk 폰 화면(앱 · 768 미만 웹)의 바닥은 늘 `bg-layer-basement`(회색)다 — 셸이 칠하고, 화면은 바탕을 따로 칠하지 않는다. 그 위에 화면 종류에 따라 흰 층(`bg-layer-default`)을 놓는다(2026-10-16 사용자 결정 — 틀 앱 비교 페이지 https://claude.ai/artifact/CrbAnPAzjv5gAcTf3Mtu9m 02-005 · Q-019-3 C).

| 화면 | 바닥 위에 놓는 것 | 예 |
|---|---|---|
| 카드 화면 | 카드(Card — 모서리 16 · 1px `stroke-neutral-weak`) — 화면 끝 24 · 카드 사이 8 · 맨 위 8 | 홈 · 자산 · 통계 · 예산 · 카드 상세 |
| 띠 화면(기본) | 화면 폭 흰 띠 — 묶음(목록 제목 + 줄)마다 띠 하나. 띠 사이 8 은 바닥이 그대로 보이는 틈이다(SEED Divider "강함" — Basement 위에 Default 를 8 띄워 쌓는다). 띠는 화면 끝까지 닿고 모서리 · 테두리 · 그림자가 없다. 맨 위 8 · 띠 안 위 4 · 아래 8 | 설정 · 전체 · 캘린더(달력 띠 + 그날 일정 띠) · 알림 · 폼 |
| 흰 화면 | 화면 전체가 흰 층 하나 — 날짜 묶음은 목록 제목으로만 가른다 | 가계부 거래(그 달 거래 목록)만 |

- 한 화면은 한 방식만 쓴다 — 띠 안에 카드를 두거나, 카드 화면에 띠를 섞지 않는다.
- 줄 목록(List)은 바닥에 바로 두지 않는다 — 카드 · 띠 · 흰 화면 · 시트 위에 둔다. 누른 줄의 바탕(`bg-layer-default-pressed`)은 흰 면 위에서만 보인다(회색 위 1.02:1).
- 대가: 띠 사이 틈은 흰 띠와 바닥의 대비가 라이트 1.08:1 · 다크 1.13:1 이라 거의 안 보인다 — 띠가 하나로 붙어 보이고 묶음은 목록 제목으로 갈린다(라이트가 더 옅다). 카드(모서리 · 테두리) · 흰 화면과 다른 셋째 모양이 하나 는다.
- 가계부 묶음(거래 · 자산 · 통계 · 예산)을 좌우로 밀면 흰 화면(거래)과 회색 카드 화면(자산)이 이어 붙어 바탕이 바뀐다 — 그대로 둔다.
- 데스크톱(768 이상)은 이 표 밖이다 — 회색 바닥 위 카드다(Card).

#### 랜드마크

- 머리는 `header` — `main` 밖에 둔다.
- 주 메뉴는 이름 있는 `nav` — 하단 탭 바 · 사이드바 · 옆 패널의 주 메뉴 모두 "주 메뉴".
- 본문은 `main` 하나.
- 화면 맨 앞에 "본문 바로가기" 링크 — 키보드 초점이 오면 보이고, 누르면 `main` 으로 간다.
- 앱은 랜드마크가 없다(Flutter 의 `main` · `navigation` 역할은 웹 엔진만 쓴다). 그래서 상단 바의 제목을 머리말로 두고(`Semantics(header: true, headingLevel: 1)` — iOS 는 `header` 를, 안드로이드는 `headingLevel` 을 읽는다) 목록 제목(List Header) · 카드 머리는 단계 2 로 단다. 상단 바의 버튼마다 이름을 단다. 주 메뉴는 이름 있는 묶음(`Semantics(container: true, label)` — "주 메뉴", 번역 문구 `navMainMenu` · en "Main menu")이다. 본문 바로가기는 두지 않는다 — 화면 읽기는 제목 단위로 건너뛰고, 상단 바의 누를 것은 셋 이하다(2026-10-16 사용자 결정 — 틀 앱 비교 페이지 02-004).
- 이름은 모두 번역 문구다 — 코드에 한국어 상수를 두지 않는다(International Design). 알림 벨의 이름은 새 알림이 있으면 "알림, 새 알림 있음"(en "Notifications, new notifications"), 없으면 "알림"이다(Notification Badge — 점은 `aria-hidden` · 낭독 제외, 02-003).

### Safe Area — 안전 영역 (2026-10-04)

화면 가장자리는 상태 표시줄 · 홈 표시줄 · 카메라 자리(노치) · 둥근 모서리에 가릴 수 있다. 무엇을 안전 영역 안에 두고 무엇을 화면 끝까지 채울지 정한다 — 당근 SEED 의 Safe Area 패턴을 들인다(사용자 결정 2026-10-04, 화면 틀 · 이동 비교 페이지 "따라오는 것"). 출처: seed-design.io Patterns › Safe Area(Apache-2.0).

> 요소가 가려지거나 잘렸을 때 정보나 기능을 잃는지에 따라 배치 범위를 정합니다. — SEED

#### 안과 끝

| 무엇 | 어디까지 | 예 |
|---|---|---|
| 누르는 것 · 읽는 것(버튼 · 링크 · 입력칸 · 탭 · 글 · 아이콘 · 배지 · 뜻이 있는 그림) | 안전 영역 안 | 상단 바의 버튼 · 제목, 탭 바의 칸, 떠 있는 버튼, 바닥 버튼 |
| 배경 · 장식 | 화면 끝까지 | 상단 바 · 바닥 바의 바탕, Page Banner 의 바탕, 화면 폭 Divider, 장식 그림 |
| 스크롤 영역 | 화면 끝까지 — 스크롤하면 가려진 것을 안으로 가져올 수 있다 | 목록(아래 끝까지), 가로 칩 줄 · Tabs(좌우 끝까지) |
| 고정된 바 · 버튼 | 안전 영역 안 — 스크롤로 가져올 수 없다 | 탭 바 · 바닥 버튼 · 떠 있는 버튼 |

- 네 변의 안전 영역은 따로다 — 한 방향이 늘 0 이라고 가정하지 않고 늘 지금 값을 쓴다(웹 `env(safe-area-inset-*)` · 앱 `MediaQuery.viewPadding`).
- 한 요소에 바탕과 내용이 함께 있으면 부분마다 따로 — 바탕은 끝까지, 내용은 안.

#### 여백은 안전 영역 경계부터

- 좌우 여백(본문 `spacing-global-gutter` 24 · 상단 바의 6)은 화면 끝이 아니라 안전 영역 경계에서 잰다 — 안전 영역 + 여백.
- 바닥에 고정한 바의 버튼은 아래 안전 영역 경계에서 바의 안쪽 여백만큼 띄운다.
- 가운데 정렬은 안전 영역을 기준으로 한다 — 왼쪽 · 오른쪽 안전 영역이 다르면 화면 가운데가 아니다.
- 끝까지 스크롤하면 마지막 항목 전체가 안전 영역 안에 보이게, 스크롤 내용의 끝에 안전 영역 + 기본 여백을 둔다.
- 떠 있는 탭 바는 바의 아래 여백 6 만 홈 표시줄 영역에 걸치고 누르는 칸은 그 위에서 끝난다(Bottom Navigation).

#### 부품이 스스로 반영하는 방향

| 부품 | 반영하는 방향 |
|---|---|
| Top Navigation | 위(바가 그만큼 높아진다) · 좌우 |
| Bottom Navigation | 아래 · 좌우 |
| Bottom Sheet · Menu Sheet | 아래 |
| Side Panel | 위(머리) · 아래(패널 내용 끝) · 붙은 쪽(폭에 더한다) |
| Snackbar | 좌우 · 아래 |
| Floating Action Button | 오른쪽 · 아래 |
| 화면 본문 | 좌우 · 아래(스크롤 내용 끝) |

#### 웹 — viewport-fit=cover

안전 영역 값을 받으려면 문서의 `viewport` 메타에 `viewport-fit=cover` 를 둔다 — 없으면 iOS 사파리가 `env(safe-area-inset-*)` 를 0 으로 계산한다(SEED). 지금 두 웹 모두 없다 — 앱 적용 때 넣는다.

### v98 — SEED 간격 스케일 (2026-09-29)

당근 SEED 의 dimension 스케일을 그대로 들인다 — 2px 단위 19단계, 이름도 SEED 와 같다(`x1` = 4px). 지금까지의 7단계(`xs` … `3xl`)는 모두 이 눈금 위에 있어 값이 바뀌지 않고, 옮기는 동안 같은 값의 별칭으로 남는다.

| 토큰 | 값 | 옛 이름(별칭) |
|---|---|---|
| `spacing-x0_5` | 2px | — |
| `spacing-x1` | 4px | `spacing-xs` |
| `spacing-x1_5` | 6px | — |
| `spacing-x2` | 8px | `spacing-sm` |
| `spacing-x2_5` | 10px | — |
| `spacing-x3` | 12px | `spacing-md` |
| `spacing-x3_5` | 14px | — |
| `spacing-x4` | 16px | `spacing-lg` |
| `spacing-x4_5` | 18px | — |
| `spacing-x5` | 20px | — |
| `spacing-x6` | 24px | `spacing-xl` |
| `spacing-x7` | 28px | — |
| `spacing-x8` | 32px | `spacing-2xl` |
| `spacing-x9` | 36px | — |
| `spacing-x10` | 40px | — |
| `spacing-x12` | 48px | `spacing-3xl` |
| `spacing-x13` | 52px | — |
| `spacing-x14` | 56px | — |
| `spacing-x16` | 64px | — |

- 새로 쓰는 간격은 SEED 이름으로 적는다. 옛 이름은 컴포넌트 스펙 · 제품이 다 옮기면 걷는다 — 컴포넌트 스펙은 2단계에서 SEED 와 하나씩 비교할 때 옮긴다.
- "한 번에 토큰 5개까지" 규칙의 예외다. 사용자가 2026-09-29 SEED 스케일 전체를 고르며 그 대가를 알고 정했다.
- 역할 간격(SEED 의 global-gutter · component-default 등)은 Layout 단계에서 따로 정한다.
- 이유: 스펙 52개가 토큰 없이 px 로 적은 간격 22곳 가운데 20곳(2 · 10 · 14 · 18 · 20 · 36px)이 SEED 눈금에 있다. 7단계로는 이 값들을 토큰으로 가리킬 수 없었다.

### v4 추가 — 4px 베이스 5단계 (v98 에서 SEED 스케일로 바뀜 — 아래는 기록)

CLAUDE.md "4px 베이스 추천" 규칙을 준수하는 t-shirt 사이즈 스케일. 모든 값은 4의 배수이며, 의미 기반 명명(`xs/sm/md/lg/xl`)으로 값에 의존하지 않습니다.

| 토큰 | 값 | 주 용도 |
|---|---|---|
| `xs` | 4px | atomic — 아이콘 inner padding, hairline gap |
| `sm` | 8px | tight — 라벨↔입력 gap, 인라인 아이콘↔텍스트 |
| `md` | 12px | comfortable — 버튼 padding-y, 카드 inner |
| `lg` | 16px | default — 스택 gap, 카드 padding (가장 자주) |
| `xl` | 24px | section — 섹션 간 분리 |

#### 추가 이유
1. v1~v3 색상 토큰만으로는 컴포넌트 치수가 결정되지 않음 — 버튼 padding, 카드 inner, 스택 gap 의사결정의 차단 요소 해소.
2. 5단계는 80% 일반 컴포넌트 사용을 커버 — 추측성 hero/major(`2xl`, `3xl`)는 사용 사례 등장 후 추가.
3. t-shirt 사이즈는 의미 기반 명명 — `space-4` 같은 값-기반 명명을 피해 향후 base 수정(예: 8px 베이스 전환) 시 명명 안정성 확보.

#### 검증
- **WCAG 1.4.3 / 1.4.11**: 비대상(spacing은 색상 아님).
- **WCAG 2.5.5 (Target Size, AAA 권장 44×44px)**: 버튼 패턴 점검 — `body-lg` line-height = 15px × 1.6 = **24px**. `md(12px)` padding-y 적용 시 12+24+12 = **48px** ✅ (44px 통과). `sm(8px)` padding-y는 8+24+8 = 40px로 44px 미달 → 보조 액션·dense table 인라인 컨트롤에만 사용. (※ v4 작성 시 lh를 20px로 잘못 표기, v9에서 수정)
- **WCAG 1.4.12 (Text Spacing)**: 사용자가 letter/word spacing을 오버라이드해도 4px 베이스는 절대값이라 영향 없음.

#### HR / Desk 듀얼 브랜드
- spacing은 neutral 시스템 — 브랜드 분기 없음. HR(B2B 데이터 밀도 위주)·Desk(B2C 여백 위주) 모두 동일 스케일 사용, 화면별 적용 강도(예: HR은 `md` 위주, Desk는 `lg` 위주)로 분기.

### Breakpoints (v54 — v101 에서 SEED 값으로 바뀜, 아래는 기록)

아래는 v54 의 기록이다. 지금 값은 위 v101 절에 있다 — 이 표는 토큰으로 읽히지 않게 이름 · 값의 백틱을 뺐다.

반응형 layout breakpoint — 5단계 (Apple Store reference). spec이 breakpoint 카테고리 미지원이라 prose-token 패턴(shadow/motion/overlay와 동일) — yaml 정의 없이 표만 운영. 모든 파일(DESIGN.md / .hr.md / .desk.md) 수동 동기.

| 토큰 | 값 | 의미 (Apple Store 가이드) |
|---|---|---|
| breakpoint-sm | 640px | Phone max — 이하 single-column tiles, hero h1 34px |
| breakpoint-md | 736px | Tablet portrait — global nav hamburger collapse |
| breakpoint-lg | 834px | Tablet landscape — global nav full, 3-col → 2-col grids |
| breakpoint-xl | 1069px | Desktop — full layout, 4-5 col store grids |
| breakpoint-2xl | 1441px | Wide — content locks at 1440px |

#### 추가 이유
1. v1~v53까지 토큰은 색상·typography·spacing·radius·shadow·motion·overlay만 — 반응형 breakpoint 부재. 컴포넌트 spec(Button/Card/Tabs)에 "모바일 권장 사이즈 lg" prose는 있으나 *어떤 width에서* 모바일이 시작되는지 토큰화되지 않음 → 결정 차단.
2. **Apple Store reference**: iPad portrait/landscape 분리(736/834) + desktop 시작(1069) + wide lock(1441)로 한국 디자이너 친화적 모바일 우선 톤. iPad 라인업(mini portrait 768 / Air landscape 1180 / Pro 11" landscape 1194 / Pro 12.9" landscape 1366) 정합.

#### 단위·명명
- **px**: 한국 디자이너 친화적 + Figma frame 단위 일치 + Apple HIG 친화 (rem 변환은 build 단계에서 가능).
- **`breakpoint-{size}`**: Tailwind v4 namespace 표준 (`--breakpoint-*`). 값은 Apple Store 톤 — Tailwind default(640/768/1024/1280/1536)와 다름. 외부 라이브러리 마이그레이션 시 매핑 필요.

#### 사용 패턴
- min-width 기준 (mobile-first): `@media (min-width: var(--breakpoint-lg))` — 834 이상 적용 (tablet landscape +).
- max-width 기준: `@media (max-width: calc(var(--breakpoint-md) - 1px))` — 735 이하 (phone).

#### Touch targets (Apple reference)
- Pill CTAs: `touch-pill-w` (100) × `touch-min` (44 height) + `radius-full`. Button `large` (48px height — 2026-09-30 전 이름 `lg`)는 본 pill min(44)을 자연스럽게 초과 — pill CTA에 사용 시 padding 그대로 OK.
- Circular chips: `touch-circular` (44 × 44, icon button, Avatar)
- Global nav utility links: `touch-nav-w` (80) × `touch-nav-h` (32, precision desktop only, breakpoint-xl 이상)
- WCAG 2.5.5 AAA (44 × 44 minimum) 충족.

**v59에서 5 토큰화 완료** — 자세한 spec은 아래 `### Touch targets` sub-section 참조.

#### Collapsing strategy (Apple reference, 토큰화 미적용)
- Global nav: full row → 햄버거 collapse at 834px (`breakpoint-lg`)
- Product/data tiles: 2-col → 1-col at 834px
- Hero typography scale: 56px → 40px → 34px → 28px (responsive type 4단계 — breakpoint-xl/lg/md/sm 분기)

responsive container layout / responsive typography spec은 별도 작업.

#### 듀얼 브랜드 — unified
HR (B2B 데이터 밀도) / Desk (B2C 모바일 우선) 모두 동일 5단계. 컴포넌트 spec에서 brand별 권장 사이즈(HR 데이터 그리드 우선, Desk 모든 사이즈 44×44 hit area) 차이는 prose 가이드.

#### 자동 검증 미적용
breakpoint는 functional layout token — contrast 룰 무관. spec 외부(prose-token)라 lint missingPrimary/contrast 영향 0.

### Touch targets (v59 추가, prose-token · 기록 — 기준은 Inclusive Design 의 누르는 영역 44 × 44(`touch-min`) — 표는 내보내기 원본으로 남는다)

WCAG 2.5.5 AAA (Target Size 44×44 minimum) + Apple Store reference 톤을 정형 토큰화. spec이 layout/component size 카테고리 미지원이라 prose-token 패턴(shadow/motion/overlay/breakpoint와 동일). 5 토큰. v54 Breakpoints sub-sub의 reference 가이드를 토큰으로 격상.

| 토큰 | 값 | 의미 |
|---|---|---|
| `touch-min` | `44px` | WCAG 2.5.5 AAA minimum (default, 모든 hit target 권장) |
| `touch-pill-w` | `100px` | Pill CTA min-width (Apple Store: ~44 × 100) |
| `touch-circular` | `44px` | Circular chip / icon button (= touch-min, explicit alias) |

> `touch-nav-h`(32) · `touch-nav-w`(80) 은 쓰지 않아 이 표와 내보내기(웹 CSS · 앱 Dart)에서 뺐다(2026-10-16 사용자 결정 — 기초 웹 01-039 B). 데스크톱에서도 누르는 영역은 44 다(Inclusive Design). `touch-pill-w` · `touch-circular` 는 쓰는 곳이 없지만 그대로 둔다.

#### 추가 이유
1. v33-v48 컴포넌트 batch에 size prose 있으나 *어떤 토큰 값 기준* 인지 명시 부재 — 컴포넌트별 각자 hex/px 기재. 통합 토큰화로 시스템 일관성 ↑.
2. **WCAG 2.5.5 AAA 명시**: `touch-min` 44px는 hit target minimum — 모든 컴포넌트 spec에서 인용 가능. `touch-circular`는 의미적 alias (44 = touch-min, but circular shape 의도 명시).
3. **Apple Store reference**: Pill (44 × 100) / Nav utility (32 × 80) 정형화. v54 Breakpoints prose의 reference 가이드를 토큰으로 격상.

#### 사용 패턴
- 모든 hit target: `min-height: var(--touch-min); min-width: var(--touch-min);` (44 × 44 충족).
- Pill CTA: `height: var(--touch-min); min-width: var(--touch-pill-w); border-radius: var(--radius-full);`.
- Circular icon button: `width: var(--touch-circular); height: var(--touch-circular); border-radius: var(--radius-full);`.
- ~~Precision desktop nav — `touch-nav-h` · `touch-nav-w`~~ — 쓰지 않는다(2026-10-16 01-039 B).

#### 단위·명명
- **px**: 한국 디자이너 친화적 + Figma frame 단위 일치.
- **`touch-{name}`**: WCAG "target" / "hit target" 어휘. spec 외부(prose-token)라 자체 namespace.

#### 듀얼 브랜드 — unified
- HR (B2B 데이터 밀도) / Desk (B2C 모바일 우선) 모두 동일 5 토큰. brand-agnostic.
- 사용 강도 차이: HR은 `breakpoint-lg` 이상 정밀 desktop에서 `touch-nav-h`/`-w` 적극(2026-10-16 걷었다 — 44), Desk는 모든 viewport에서 `touch-min`/`touch-circular` 우선 (모바일 hit target).

#### 4px 베이스 호환
- 44/100/80/32 모두 4의 배수 (11×4, 25×4, 20×4, 8×4). v4 spacing 정신과 일치.
- spacing 카테고리 추가 안 함 — touch target은 padding/margin/gap과 의미적으로 다름(컴포넌트 outer size).

#### export 통합 (build-tailwind-v4.mjs)
v59에서 `parseTouchTargets` 추가, prose 표 직접 추출. CSS variable: `--touch-min`, `--touch-pill-w`, `--touch-circular`(`--touch-nav-h` · `--touch-nav-w` 는 2026-10-16 에 뺐다).

#### 자동 검증 미적용
touch target은 functional layout token — contrast 룰 무관. spec 외부(prose-token)라 lint 영향 0.

### Z-index (v65 추가, prose-token · 기록 — 기준은 `specs/z-index.md`(v116 층 이름))

v116(2026-10-03) — 층 이름으로 다시 정했다. 값은 `specs/z-index.md` 의 층 표(L0 ~ L9) 그대로이고, 이름은 그 층을 부른다. 이 표가 원본이다 — 층 표 · 컴포넌트 YAML · 레시피는 여기 값을 따른다. 사용자 결정(2026-10-03 — porest 층 표를 정본으로, 새 토큰은 층 이름으로). spec 이 z-index 카테고리를 지원하지 않아 prose-token 이다(shadow · motion · overlay · breakpoint · touch-target 과 같다).

| 토큰 | 값 | 층 · 쓰는 곳 |
|---|---|---|
| `z-base` | `auto` | L0 페이지 — 쌓임 맥락을 만들지 않는다 |
| `z-sticky` | `50` | L1 페이지에 붙은 것 — 상단 바(Top Navigation) · 하단 탭 바(Bottom Navigation) · 떠 있는 버튼(Floating Action Button) · 스피드 다이얼 |
| `z-modal` | `100` | L2 딤 — Dialog · Bottom Sheet · Menu Sheet · Side Panel(옆 패널) |
| `z-modal-content` | `101` | L2 표면 — 자기 딤 바로 위 |
| `z-floating` | `200` | L3 트리거에 붙어 뜨는 것 — Popover · Select 목록 · Menu. 페이지에서도 모달 안에서도 같은 값 |
| `z-tooltip` | `210` | L4 말풍선 — Help Bubble · Tooltip |
| `z-alert` | `300` | L5 Alert Dialog 딤 |
| `z-alert-content` | `301` | L5 Alert Dialog 표면 |
| `z-snackbar` | `400` | L6 Snackbar 자리 |
| `z-dev` | `9999` | L9 개발 환경 표시 — 운영에서는 그리지 않는다 |

#### 왜 이 순서인가

- **트리거에 붙어 뜨는 것(L3)은 모달(L2) 위다** — 대화상자 · 시트 안에서 연 Select 목록 · 메뉴가 표면(101) 위에 떠야 한다. 페이지에서 열어도 같은 200 이라, 부르는 자리마다 값을 고르지 않는다. 페이지에는 L2 가 없으니 고정 헤더(50) 위로 뜨는 것도 자연스럽다.
- **말풍선(L4)은 팝오버(L3) 위다** — 팝오버 · 메뉴 안의 ⓘ 로 연 말풍선이 가려지지 않는다.
- **확인창(L5)은 메뉴(L3) 위다** — 되돌릴 수 없는 결정은 열린 모든 표면을 덮는다. SEED Elevation 의 "Alert Dialog 는 맨 위(Global 3)" 와 같다. SEED 의 CSS 는 팝오버 · 메뉴를 99999 로 확인창 위에 띄우지만, porest 는 문서 쪽을 따른다.
- **스낵바(L6)는 모든 표면 위다** — 확인창이 열려 있어도 잠깐 뜨는 알림은 보인다.
- **딤과 표면은 1 차이다**(100 · 101, 300 · 301) — 표면이 자기 딤 바로 위에 놓인다. 층과 층 사이는 넉넉히 비운다.
- **화면 차례를 더하지 않는다** — SEED 는 대화상자 · 시트를 `2 + layerIndex`(쌓인 화면 차례 × 5)로 올리지만, porest 웹은 화면을 쌓지 않는다(주소가 바뀌면 화면이 바뀐다). 그래서 층마다 값이 하나다.
- **앱(Flutter)은 숫자 없이 같은 순서를 따른다** — Flutter 에는 z-index 가 없고, 라우트 · 오버레이가 연 순서로 쌓인다. 페이지 → 시트 · 대화상자 → 메뉴 · 말풍선 → 확인창 → 스낵바 순서가 되게 띄운다.

#### 쓰는 법

- CSS: `z-index: var(--z-modal);` — 딤은 `--z-modal`, 표면은 `--z-modal-content`.
- Tailwind v4: `z-(--z-floating)`(= `z-index: var(--z-floating)`). 숫자 클래스(`z-[200]` · `z-50`)로 층을 적지 않는다.
- 한 컴포넌트 안에서 겹침을 정리하는 작은 값(줄 끝 버튼 `z-[1]` · 포커스 칸 `z-10`)은 층이 아니다 — 토큰으로 부르지 않는다.
- 미리보기 · 문서 그림처럼 틀 안에 가둘 때는 틀에 `isolation: isolate` 를 둔다 — 안의 값이 틀 밖의 층과 겨루지 않는다.
- 확인창 안에서 팝오버를 띄우는 드문 자리는 호출처가 올린다 — `specs/z-index.md`.

#### v65 에서 바뀐 것

v65 의 6 토큰(z-base 0 · z-dropdown 1000 · z-sticky 1100 · z-drawer 1200 · z-modal 1300 · z-toast 1400)은 걷었다. 레시피 · 스펙은 그동안 층 표의 숫자(`z-[100]` …)를 따로 적어 토큰과 값이 달랐다. 이름이 남은 셋은 값이 바뀌었다 — `z-base` 0 → `auto`, `z-sticky` 1100 → 50, `z-modal` 1300 → 100(이제 딤이고 표면은 `z-modal-content`). 옛 값을 복사해 둔 제품이 토큰을 새로 받을 때는 그 이름을 부른 자리를 층으로 다시 고른다 — 같은 이름이 더 낮은 층을 가리킨다.

#### 듀얼 브랜드 — unified

HR / Desk 모두 같은 10 토큰. brand-agnostic.

#### export 통합 (build-tailwind-v4.mjs)

`parseZIndex` 가 이 표를 읽어 `--z-base` · `--z-sticky` · `--z-modal` · `--z-modal-content` · `--z-floating` · `--z-tooltip` · `--z-alert` · `--z-alert-content` · `--z-snackbar` · `--z-dev` 를 내보낸다. 값은 정수나 `auto` 만 받는다.

### RTL support (v76 추가, prose-only · 기록 — 기준은 v106 국제화 디자인)

CSS logical properties로 LTR(좌→우, 한국어/영어/일본어) ↔ RTL(우→좌, 아랍어/히브리어) 자동 분기. 컴포넌트 spec의 `padding-left`/`right` 같은 physical property를 `padding-inline-start`/`end` 로 일괄 치환하는 패턴.

#### 핵심 — Logical property 매핑

| Physical (LTR 가정) | Logical (방향 자동) | 의미 |
|---|---|---|
| `margin-left` | `margin-inline-start` | 시작 측 (LTR=왼쪽, RTL=오른쪽) |
| `margin-right` | `margin-inline-end` | 끝 측 (LTR=오른쪽, RTL=왼쪽) |
| `padding-left` | `padding-inline-start` | 동일 |
| `padding-right` | `padding-inline-end` | 동일 |
| `border-left` | `border-inline-start` | 동일 (예: Banner stripe) |
| `border-right` | `border-inline-end` | 동일 |
| `border-top-left-radius` | `border-start-start-radius` | 시작-시작 (LTR=좌상단, RTL=우상단) |
| `border-top-right-radius` | `border-start-end-radius` | 시작-끝 |
| `border-bottom-left-radius` | `border-end-start-radius` | 끝-시작 |
| `border-bottom-right-radius` | `border-end-end-radius` | 끝-끝 |
| `left: 0` | `inset-inline-start: 0` | 시작 측 위치 |
| `right: 0` | `inset-inline-end: 0` | 끝 측 위치 |
| `text-align: left` | `text-align: start` | 시작 측 정렬 |
| `text-align: right` | `text-align: end` | 끝 측 정렬 |
| `width` | `inline-size` | 가로 (writing-mode 종속, 가로쓰기에선 동일) |
| `height` | `block-size` | 세로 |
| `max-width` | `max-inline-size` | 동일 |

block 축(세로)은 `padding-block-start`/`padding-block-end` 등 — RTL과 무관(가로쓰기 기준 위/아래는 그대로). 하지만 일관성을 위해 모든 physical property를 logical로 통일하는 것을 권장.

#### `dir="rtl"` HTML 속성

```html
<html lang="ar" dir="rtl">
<!-- 또는 부분 영역 -->
<div dir="rtl">아랍어 콘텐츠 영역</div>
```

CSS logical property 사용 시 자동 mirror — 추가 CSS 작성 불필요. JS는 `document.dir` 또는 `getComputedStyle(el).direction`으로 감지 가능.

#### Direction-specific 처리

| 처리 | 패턴 |
|---|---|
| **drawer left/right** | LTR `slide-in-left` (왼쪽에서) → RTL 자동 `slide-in-right` (오른쪽에서). keyframe `translateX` 부호 반대로 — `:dir(rtl) .drawer { animation-name: slide-in-right; }` |
| **chevron / arrow icon** | `>` (forward), `<` (back) — RTL 시 `transform: scaleX(-1)` 또는 별도 RTL icon set |
| **breadcrumb separator** | (2026-10-04 Breadcrumb 를 걷었다 — 기록) `/` 그대로 (방향성 없음) — `>` 사용 시 mirror 필요 |
| **progress bar fill** | `width: 50%` + `inset-inline-start: 0` — 자동 mirror |
| **숫자 / 통화** | RTL 환경에서도 LTR로 표시 (`<bdi>` 또는 `unicode-bidi: embed`) — 1,234.56 같은 숫자는 항상 LTR |
| **이메일 / URL** | LTR 강제 — `direction: ltr` + `unicode-bidi: bidi-override` |

#### 컴포넌트별 RTL 가이드

| 컴포넌트 | RTL 처리 |
|---|---|
| Button (icon + text) | icon `margin-inline-end` — auto mirror |
| Input (icon prefix) | icon `inset-inline-start: 8px` — auto mirror |
| Dropdown (chevron) | chevron transform mirror 또는 `dir="ltr"` 영역 강제 |
| Tabs | text-align start, indent inline-start |
| Drawer right (LTR 우측 등장) | RTL 시 좌측에서 등장 (`slide-in-left` keyframe → `:dir(rtl) ... slide-in-right`) |
| Breadcrumb | (2026-10-04 걷었다 — 기록) separator 자체가 방향성 없는 `/` 권장. `>` 사용 시 RTL은 `<` 또는 mirror |
| Toast bottom-right | RTL 시 bottom-left (`inset-inline-end: 16px` → `inset-inline-end` 그대로 두면 자동) |
| Banner stripe | `border-inline-start: 4px solid info` — auto mirror |
| Calendar | weekday 헤더 / day cell layout direction 자동 |

#### Tailwind v4 RTL utility

Tailwind v4는 `me-*`/`ms-*` (margin-end/start), `pe-*`/`ps-*`, `text-start`/`text-end`, `start-0`/`end-0` 등 logical utility 기본 제공. v4 export에서 자동 활성. 변종 `rtl:` (예: `rtl:rotate-180`) 사용 가능.

#### 추가 이유
1. **Porest는 한국어 우선**이지만 향후 글로벌 확장 시 RTL 지원 vendor 이중 작업 회피.
2. logical property는 **추가 비용 거의 0** — physical과 동일 syntax, 브라우저 호환(Chrome 87+, Safari 15+, Firefox 66+ 모두 지원).
3. 컴포넌트 spec 작성 시 처음부터 logical property 사용 → 향후 RTL 추가 시 spec 자체 수정 불필요.
4. **새 토큰 0**, 새 yaml 컴포넌트 0 — prose-only 가이드.

#### Migration 가이드 (기존 spec 점진 변환)
- 기존 컴포넌트 spec에서 `padding-left`/`right`, `margin-left`/`right`, `text-align: left/right`, `border-radius` 4-corner notation 사용 시 단계적으로 logical로 변환 권장.
- 이번 v76엔 spec 변환 미시행 — RTL 문서만 명시. 향후 컴포넌트 추가/수정 시점에 logical 우선 작성.

#### WCAG / 자동 검증
- **1.4.10 Reflow**: logical property는 reflow 친화 (writing-mode 변경에도 의도 유지).
- **1.4.8 Visual Presentation**: text-align start/end는 사용자 설정 언어 방향 자동 존중.
- 자동 lint 비대상(prose-only). 시각 검토 — 향후 `dir="rtl"` 환경 preview 추가 가능.

#### HR / Desk 듀얼 브랜드
- direction은 brand-neutral. HR(B2B) / Desk(B2C) 모두 동일 logical property 가이드.
- Porest 1차 시장 한국어(LTR), RTL은 향후 확장 옵션. 현 시점 active 사용 사례 0.

## Elevation & Depth

### v104 — SEED 고도 (2026-09-29)

당근 SEED 의 Elevation 을 들인다. 사용자가 2026-09-29 "구조는 SEED, 값은 porest" 를 골랐다 — 고도 모델과 규칙은 SEED, 그림자 값은 porest 의 청회색 4단계(v12 · v25) 그대로 s1 ~ s4 로 부른다. 출처: seed-design.io Foundations › Elevation(Apache-2.0).

#### 쌓임 맥락 — Global · Local

- **Global** — 화면 전체의 구조적 층. 제품 화면 자체와 그 위를 덮는 컨테이너(시트 · 경고창).
- **Local** — 한 층 안에서 콘텐츠끼리의 깊이. 항상 자기가 속한 Global 층 위에 놓인다.
- 새로 덮인 층(시트)은 곧 새 기준이 된다 — 그 안의 툴팁 · 메뉴는 그 층을 바닥으로 쌓인다(페이지 위 페이지). 메뉴 · 팝오버 · Select 목록은 `z-floating`, 툴팁 · 말풍선은 `z-tooltip` 하나씩이라 어느 층에서 열어도 그 층 위에 뜬다.

| Global 층 | 무엇 | porest |
|---|---|---|
| 0 | 바닥 — 스크롤되는 모든 콘텐츠 뒤 | `bg-layer-basement` |
| 1 | 기본 — 카드 · 목록 · 입력칸 · 상단 내비게이션 | `bg-layer-default` |
| 2 | 시트 · 메뉴 시트 · 서랍 — 화면을 덮는 새 쌓임 맥락 | `z-modal` |
| 3 | 경고창 — 가장 급한 정보, 다른 모달보다도 위 | `z-alert` |

| Local 층 | 무엇 | porest |
|---|---|---|
| 1 | 기본 콘텐츠 — 목록 · 탭 · 알림 띠 · 상단 내비게이션 | 층의 표면 |
| 2 | 떠 있는 동작 — 플로팅 버튼 | `z-sticky` |
| 3 | 잠깐 뜨는 알림 — 스낵바 | `z-snackbar` |

- Global 2 · 3 의 토큰은 딤 자리다 — 표면은 그 바로 위 `z-modal-content` · `z-alert-content` 다. z-index 값과 이유는 Layout 의 Z-index 절(v116)에 있다.
- 같은 층 안에서 겹칠 때(스크롤되는 목록이 상단 내비게이션 아래로)는 층을 올리지 않는다. 상단 내비게이션은 선 · 그림자도 긋지 않는다 — SEED Top Navigation 의 "고정된 영역과 스크롤되는 영역을 구분하기 위해 별도의 시각적인 장치를 표시하지 않습니다" 를 따른다(2026-10-04 사용자 결정 — SEED Elevation 문서의 "그림자나 라인(스타일)을 추가하여 '구분감'을 줍니다" 와 SEED 안에서 갈리는 자리다). 데스크톱 머리 아래의 선도 긋지 않는다.
- 한 표면 안에서 머리와 본문이 따로 스크롤되는 대화상자 · 옆 패널(Side Panel) · 사이드바(Side Navigation)는 그 부품의 규칙대로 본문이 위로 스크롤되면 머리 아래 1px `stroke-neutral-subtle` 을 긋는다.

#### 고도를 드러내는 세 가지

- **표면 색** — 배경의 밝기 · 채도를 바꾼다(스낵바 · 플로팅 버튼). 다크 모드는 높을수록 밝아진다(`bg-layer-floating`).
- **그림자** — 떠 있는 높이를 그림자의 크기 · 퍼짐 · 투명도로. 다크 모드에서 잘 안 보이므로 **화면에서 주목도가 높은 몇 안 되는 요소에만** 쓴다(떠 있는 탭 바 · 떠 있는 버튼 · 메뉴 · 팝오버 — `shadow-s3`).
- **선** — 가장자리에 테두리를 둬 영역을 나눈다(사이드바의 오른쪽 선 · 떠 있는 탭 바의 안쪽 테두리 — 2026-10-04, 카드의 1px `stroke-neutral-weak` — 2026-10-08). 카드는 그림자 없이 선과 바닥(`bg-layer-basement`)으로 가른다.

#### 바닥 위의 채움 (2026-10-16)

라이트에서 바닥 `bg-layer-basement` · 약한 배경 `bg-neutral-weak` · 비활성 `bg-disabled` 는 모두 gray-200 이다(SEED 도 같다 — "layer-basement 와 neutral-weak 는 라이트에서 비슷하게 보일 수 있다"). 그래서 회색 바닥 위에 바로 놓인 채움은 바닥과 1.00:1 로 사라진다(다크는 1.47:1 로 갈린다). 사용자 결정 2026-10-16(기초 웹 비교 페이지 https://claude.ai/artifact/U33bUxZkgQoHfAgdp2DEVK 01-040 B):

- **`bg-neutral-weak` · `bg-disabled` 로 칠하는 것은 흰 표면(`bg-layer-default` · `bg-layer-floating`) 위에만 둔다** — neutralWeak 버튼 · 안내 상자(Callout) · 스켈레톤 · 막힌 칸의 바탕. 화면 바탕은 Layout 의 "화면 바탕" 이 정한다(카드 · 띠 · 흰 화면).
- 회색 바닥 위에 바로 놓이는 버튼은 neutralOutline 이다 — 데스크톱 화면 제목 줄의 버튼처럼. 입력칸은 테두리가 모양을 맡아 바닥 위에서도 보인다(막혀 바탕이 바닥과 같아도).
- 바닥 위에 자주 놓이는 두 부품 — Chip `solid` 바탕 · Segmented Control 트랙 — 은 투명 짝 `bg-neutral-weak-alpha`(누름 `bg-neutral-weak-alpha-pressed`)로 칠한다. 놓인 바탕에 섞여 어느 바탕에서나 보인다 — 회색 위 1.11:1 · 흰 위 1.11:1 · 다크 1.47:1(SEED 도 이 두 부품만 투명 짝을 쓴다). 흰 면 위에서는 불투명 `bg-neutral-weak`(1.08:1)보다 조금 짙다.

#### 그림자

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `shadow-s1` | `0 1px 2px 0 rgba(15, 18, 28, 0.05)` | 옛 `shadow-sm` — 슬라이더 손잡이(2026-10-09) · 카드(2026-10-08)는 그림자를 걷었다 |
| `shadow-s2` | `0 2px 8px -1px rgba(15, 18, 28, 0.08), 0 1px 3px -1px rgba(15, 18, 28, 0.04)` | 드롭다운 · 툴팁 · 떠 있는 버튼(옛 `shadow-md`) |
| `shadow-s3` | `0 8px 24px -4px rgba(15, 18, 28, 0.10), 0 2px 6px -2px rgba(15, 18, 28, 0.05)` | 팝오버 · 작은 모달(옛 `shadow-lg`) |
| `shadow-s4` | `0 24px 48px -8px rgba(15, 18, 28, 0.16), 0 8px 16px -4px rgba(15, 18, 28, 0.08)` | 큰 모달 · 서랍(옛 `shadow-xl`) |
| `shadow-s1-dark` | `0 1px 2px 0 rgba(0, 0, 0, 0.30), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)` | 다크 — s1 |
| `shadow-s2-dark` | `0 2px 8px -1px rgba(0, 0, 0, 0.40), 0 1px 3px -1px rgba(0, 0, 0, 0.20), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` | 다크 — s2 |
| `shadow-s3-dark` | `0 8px 24px -4px rgba(0, 0, 0, 0.50), 0 2px 6px -2px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)` | 다크 — s3 |
| `shadow-s4-dark` | `0 24px 48px -8px rgba(0, 0, 0, 0.60), 0 8px 16px -4px rgba(0, 0, 0, 0.30), inset 0 1px 0 0 rgba(255, 255, 255, 0.10)` | 다크 — s4 |

- SEED 는 3단계(s1 ~ s3, 검정 한 겹)다. porest 는 큰 모달 · 서랍용 한 단계를 더 둔다.
- 옛 이름(`shadow-sm` · `md` · `lg` · `xl` 과 `-dark`)은 같은 값의 별칭이다 — 아래 v12 · v25 표(기록). 웹 내보내기(`export:tailwind`)는 옛 이름을 값 대신 `var(--shadow-s1)` ~ `var(--shadow-s4)` 로 적는다 — Tailwind 가 그림자 값을 클래스 안에 박아 넣어 다크 블록이 옛 클래스(`shadow-lg` …)에 닿지 않던 것을, 옛 클래스도 s1 ~ s4 의 다크 값을 따라가게 한다(2026-10-16 사용자 결정 — 기초 웹 01-003 A). 새 이름도 같다 — `--shadow-s1` ~ `s4` 는 `var(--porest-shadow-s1)` ~ `s4` 를 가리키고 값은 @theme 밖 `:root` 에 두며, 다크 블록이 그 값을 바꾼다 — `shadow-s3` 클래스도 다크 값이 된다(2026-10-17 사용자 결정 — 01-003 A 를 새 이름에도). xs 단계 그림자는 두지 않는다(01-006 A — 웹의 shadow-xs 는 Tailwind 기본값이라 내보내기에 없다, 쓰는 곳을 걷는다).
- 모달 · 시트 뒤를 덮는 딤은 v43 의 `overlay-dim-light` · `overlay-dim-dark` 를 그대로 쓴다(SEED 의 overlay 0.45 · overlay-muted 0.17 은 들이지 않았다).

Porest는 **Tonal Layers**(표면 휘도 차)를 1차 elevation 수단으로, **Layered Shadow**를 2차 보조 수단으로 사용합니다 — Toss 톤의 절제된 깊이감.

### v12 추가 — 4단계 shadow 레시피 (prose-token · 기록 — 기준은 v104 그림자 표 — 옛 이름은 별칭)

> **spec 한계 명시**: design.md spec은 shadow를 공식 YAML 토큰 타입으로 형식화하지 않습니다(`### Design Tokens` 서브섹션 부재). 따라서 본 절의 토큰은 **prose-token** 형태로 markdown 표에 정의 — `colors:`/`typography:` 등의 정형 토큰과 달리 `npm run lint` 자동 검증 비대상. **export 통합(v30)**: `scripts/build-tailwind-v4.mjs`가 DESIGN\*.md를 직접 파싱해 **Tailwind v4 `@theme` CSS**로 빌드 — colors / typography(`--text-*` + `--line-height` / `--font-weight` modifier) / radius / spacing + prose shadow 8종을 모두 포함. 결과는 `exports/tokens.css` / `tokens.hr.css` / `tokens.desk.css`. DTCG export(`npm run export:dtcg`)는 design.md 기본 export 사용 — DTCG draft의 shadow `$type`은 단일 shadow object만 지원해 다중 layer/inset shadow는 매핑 손실 → DTCG에서는 shadow 누락, prose 정의를 직접 참조.

| 토큰 | 값 (CSS box-shadow) | 주 용도 |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(15, 18, 28, 0.05)` | 작은 손잡이(매우 미묘) — 옛 카드 정지 상태, 카드는 2026-10-08 부터 그림자 없음 |
| `shadow-md` | `0 2px 8px -1px rgba(15, 18, 28, 0.08), 0 1px 3px -1px rgba(15, 18, 28, 0.04)` | 드롭다운·툴팁(카드의 hover 그림자는 2026-10-08 걷었다) |
| `shadow-lg` | `0 8px 24px -4px rgba(15, 18, 28, 0.10), 0 2px 6px -2px rgba(15, 18, 28, 0.05)` | popover·작은 모달 |
| `shadow-xl` | `0 24px 48px -8px rgba(15, 18, 28, 0.16), 0 8px 16px -4px rgba(15, 18, 28, 0.08)` | 큰 모달·drawer·hero overlay |

shadow base color `rgba(15, 18, 28, ...)`는 `bg-page-dark`(`#1A1F2E`)에 가까운 cool-neutral 흑색으로, page bg(`#F5F6FA`)와 자연스럽게 어우러지도록 선택. 순수 검정(`#000`)은 명도 차가 과해 광택 인상.

#### 추가 이유
1. v1~v11에서 색상·텍스트·간격·라운드는 갖춰졌으나 popover·dropdown·modal 분리는 표면 휘도 차만으로 부족 — 동일한 `surface-default`(`#FFFFFF`) 위에 또 다른 `surface-default`를 띄울 때 식별 수단 필요.
2. **4단계로 한정**(5 한도 중 1개 여분): Toss 류 절제된 elevation. `2xl`은 hero 대형 overlay 등장 시 추가.
3. 모든 shadow는 동일 base color + opacity 누적 — 일관 톤.

#### Tonal Layers (1차 elevation)
shadow 추가 전에 surface 휘도 차로 해결 가능한지 확인 — 가능하면 그쪽 우선:
- **카드 vs 바닥**: 흰 면 on 바닥 1.08:1 · 다크 1.13:1 로 차이가 작다 → 1px `stroke-neutral-weak` 테두리가 경계를 맡고 그림자는 두지 않는다(2026-10-08 — `specs/components/card.md`).
- **다크 모드 shadow**: rgba 흑색 shadow는 다크 표면 위에서 거의 안 보임 — light용 `rgba(15, 18, 28, 0.05~0.16)`은 cool-neutral 흑색이라 다크 표면과 명도 차가 거의 없습니다. v25에서 다크 모드 전용 `shadow-*-dark` 변형 도입(아래 섹션 참조) — black opacity 강화 + inset top highlight 패턴. light·dark 모두 `border-default(-dark)` + 표면 휘도 차와 함께 사용하는 원칙은 유지.

#### WCAG 검증
- **1.4.3 / 1.4.11**: shadow 자체는 색 대비 비대상.
- **간접 영향**: 모달이 표면 위에 떠 있을 때, `shadow-xl`이 모달 외곽 vs 페이지 사이 시각 분리에 기여. 단 분리의 **정량적 보장**은 shadow 단독으로 어렵고 — 모달은 항상 `border-default` + dim overlay와 함께 사용해 식별성 확보(컴포넌트 스펙).
- **자동 검증 불가**: lint contrast 룰은 `backgroundColor`/`textColor` 페어만 검사. shadow는 spec 토큰 타입이 아니므로 검증 룰 부재. 본 prose-token은 손계산·시각 검토에만 의존 — `border-strong` 등과 동급의 자동 검증 한계.

#### HR / Desk 듀얼 브랜드
- 모든 shadow는 brand-neutral. HR(B2B 절제)·Desk(B2C 친근감) 모두 동일 스케일 사용.
- 다만 적용 강도 분기 권장: HR은 `shadow-sm`/`shadow-md` 위주(평면적 데이터 밀도), Desk는 `shadow-md`/`shadow-lg` 위주(친근한 입체감). 토큰 자체 분기 불필요.

### v25 추가 — 다크 모드 4단계 shadow (prose-token · 기록 — 기준은 v104 그림자 표 — 옛 이름은 별칭)

v12 시점에는 다크 모드 사용 사례가 적어 `shadow-*-dark` 변형 도입을 보류했으나, v23~v24에서 다크 차트 표면(`chart-color-*-on-dark` 10색)·다크 모달 케이스가 본격화되며 다크 elevation 솔루션이 필요해졌습니다. Material Design 3 dark elevation 가이드(2021~)·Apple Big Sur 패턴을 참고한 절충안을 채택합니다.

| 토큰 | 값 (CSS box-shadow) | 주 용도 |
|---|---|---|
| `shadow-sm-dark` | `0 1px 2px 0 rgba(0, 0, 0, 0.30), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)` | 다크 — 작은 손잡이(카드는 그림자 없음) |
| `shadow-md-dark` | `0 2px 8px -1px rgba(0, 0, 0, 0.40), 0 1px 3px -1px rgba(0, 0, 0, 0.20), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` | 다크 드롭다운·툴팁 |
| `shadow-lg-dark` | `0 8px 24px -4px rgba(0, 0, 0, 0.50), 0 2px 6px -2px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)` | 다크 popover·작은 모달 |
| `shadow-xl-dark` | `0 24px 48px -8px rgba(0, 0, 0, 0.60), 0 8px 16px -4px rgba(0, 0, 0, 0.30), inset 0 1px 0 0 rgba(255, 255, 255, 0.10)` | 다크 큰 모달·drawer·hero overlay |

#### 패턴 결정
- **drop shadow base를 `rgba(0, 0, 0, ...)`로 변경**: 다크 표면(`bg-page-dark` `#1A1F2E`, L=0.015) 위에서는 light용 cool-neutral 흑색(`rgba(15, 18, 28, ...)`)이 표면과 합쳐져 식별 거의 불가. 순수 검정으로 회귀해 명도 차 확보.
- **opacity 2~4배 강화** (light 0.05 → dark 0.30, light 0.16 → dark 0.60): 다크 표면이 이미 어두우므로 약한 그림자는 무효 — 명확한 cast shadow 형성에 필요한 강도.
- **`inset 0 1px 0 rgba(255, 255, 255, N%)` top highlight 추가**: drop shadow 단독으로는 다크 표면 위에서 "위로 올라온 느낌"보다 "아래로 들어간 느낌"이 강해짐. 1px 흰색 inset highlight로 광원 위치를 시뮬레이션해 elevation 인지를 보강(Big Sur·Material 3 공통 패턴). highlight opacity는 단계별 5% → 10%로 누적.

#### 추가 이유
1. v23~v24의 chart dark 변형 10색·다크 모달 케이스 본격화 — 보류 사유였던 "직관적 디자인 솔루션 미정착"이 Material 3 dark elevation·Big Sur 패턴 정착으로 해소.
2. **light scale과 1:1 대응** (`sm/md/lg/xl`): 컴포넌트 스펙 작성 시 mode pair 매핑이 자명 — `shadow-md` ↔ `shadow-md-dark`.
3. 4종 추가(5 한도 이내), 색상 토큰 미증가 — lint contrast 검증 비대상(prose-token).

#### WCAG / 자동 검증
- shadow 자체 비대상은 light와 동일(1.4.3 / 1.4.11 비대상).
- lint 자동 검증 불가도 동일 — `colors:` YAML 외부 prose 토큰. 본 토큰은 손계산·시각 검토에만 의존.
- 다크 모달 분리감은 `border-default-dark` + `shadow-xl-dark` + dim overlay 3중 보강(컴포넌트 스펙에서 명시).

#### HR / Desk 듀얼 브랜드
- light scale과 동일하게 brand-neutral. 토큰 자체 분기 불필요.
- 적용 강도 분기 권장: HR은 `sm-dark`/`md-dark` 위주, Desk는 `md-dark`/`lg-dark` 위주.

### v43 추가 — overlay dim (prose-token)

modal/sheet/drawer 등 floating surface가 페이지 위에 떠 있을 때 배경을 어둡게 처리하는 dim overlay. shadow와 동일한 **prose-token** — alpha 채널이 들어가 design.md spec의 정형 hex 색상 토큰으로 정의 어려움.

| 토큰 | 값 | 주 용도 |
|---|---|---|
| `overlay-dim-light` | `rgba(0, 0, 0, 0.50)` | 라이트 모드 modal/sheet 배경 dim |
| `overlay-dim-dark` | `rgba(0, 0, 0, 0.65)` | 다크 모드 modal/sheet 배경 dim — 다크 표면 위 분리감 강화 |

`scripts/build-tailwind-v4.mjs`가 prose 표에서 추출해 `--overlay-dim-light` / `--overlay-dim-dark`로 출력. lint 자동 검증 비대상.

## Motion

### v104 — SEED 모션 (2026-09-29)

당근 SEED 의 Motion · Feedback 을 들인다. 사용자가 2026-09-29 비교 페이지를 보고 지속 시간 · 이징 · 눌림 · 모션 줄이기 넷 다 SEED 쪽을 골랐다. 출처: seed-design.io Foundations › Motion · Feedback, rootage duration · timing-function · scale · collections(Apache-2.0).

**아직 두 웹 · 앱에는 들어가지 않았다.** Desk 앱은 이 밖의 값(`instant` 80ms · 곡선 `spring` · `decel`)을 따로 쓰고, Desk 웹은 500 · 600ms 를 직접 적은 곳이 있다 — 앱 PR 에서 아래 이름으로 옮긴다.

#### 매크로 · 마이크로 모션

- **마이크로 모션** — 버튼 누름 · 입력칸 포커스 · 스크롤처럼 작은 움직임. 200ms 이하.
- **매크로 모션** — 페이지 전환 · 모달 · 시트 · 메뉴처럼 큰 움직임. 200ms 초과.
- 사용자 입력에 대한 반응 가운데 누름은 아래 "눌림 피드백" 에서 따로 정한다.

#### 지속 시간

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `motion-duration-d1` | `50ms` | 아주 작은 상태 변화 |
| `motion-duration-d2` | `100ms` | 작은 상태 변화(옛 앱 `instant` 80ms 는 여기로) |
| `motion-duration-d3` | `150ms` | 마이크로 모션 기본 — 색 전환 · 눌림 |
| `motion-duration-d4` | `200ms` | 마이크로 모션 상한 — 메뉴 · 툴팁 |
| `motion-duration-d5` | `250ms` | 매크로 모션 — 시트 · 서랍 |
| `motion-duration-d6` | `300ms` | 매크로 모션 상한 — 모달 · 페이지 전환 |
| `motion-duration-color-transition` | `150ms` | 역할 — 색 전환(= d3) |
| `motion-duration-pressed-scale` | `150ms` | 역할 — 눌림 축소(= d3) |

- 색 전환과 눌림 축소는 같은 150ms 다 — 시작과 속도가 같아야 하나의 반응으로 읽힌다.
- 반복은 v63 의 `motion-duration-loop`(1500ms)를 그대로 쓴다(porest 역할) — 스켈레톤 반짝임. Progress Circle(옛 스피너)은 SEED 의 1.2초다(`specs/components/progress-circle.yaml`, 2026-10-03).
- 옛 이름은 같은 값의 별칭이다 — `motion-duration-fast` → d3, `motion-duration-base` → d4, `motion-duration-slow` → d6. `motion-duration-slower`(500ms)는 걷는 중이다 — 큰 전환도 d6(300) 안에서 끝낸다.

#### 이징

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `motion-ease-easing` | `cubic-bezier(0.35, 0, 0.35, 1)` | 버튼 · 포커스 같은 기능적 마이크로 모션 |
| `motion-ease-enter` | `cubic-bezier(0, 0, 0.15, 1)` | 다이얼로그 · 시트가 나타날 때 |
| `motion-ease-exit` | `cubic-bezier(0.35, 0, 1, 1)` | 다이얼로그 · 시트가 사라질 때 |
| `motion-ease-enter-expressive` | `cubic-bezier(0.03, 0.4, 0.1, 1)` | 특히 강조해야 하는 등장 |
| `motion-ease-exit-expressive` | `cubic-bezier(0.35, 0, 0.95, 0.55)` | 특히 강조해야 하는 퇴장 |
| `motion-ease-pressed-scale` | `cubic-bezier(0, 0, 0.15, 1)` | 눌림 축소 |

- 반복의 곡선은 컴포넌트가 정한다 — 스켈레톤 반짝임은 `motion-ease-easing`(SEED), Progress Circle 은 스펙의 숫자 곡선이다(2026-10-03). `motion-ease-linear` 는 일정한 속도가 필요한 반복에 남긴다.
- 옛 `motion-ease-out`(0.16, 1, 0.3, 1)은 걷는 중이다 — 나타나는 모션은 `motion-ease-enter` 로 옮긴다. 앱의 `spring` 은 `motion-ease-enter-expressive`, `decel` 은 `motion-ease-enter` 로.

#### 눌림 피드백

누르면 인터페이스가 입력이 닿았음을 바로 알린다. 색 · 크기 · 햅틱 셋으로 알리고, 셋은 하나의 반응으로 읽히게 같은 시간(150ms)을 쓴다. 햅틱은 기준이 생기면 더한다.

**색 — 기본.** 누를 수 있는 모든 요소는 누르는 동안 표면 색이 `-pressed` 역할로 바뀐다(v102). 동작 줄이기 설정에도 영향받지 않아 기본 요소다.

- 표면만 바뀐다 — 그 위 글자 · 아이콘 색은 그대로다. 글자용 pressed 역할은 두지 않는다.
- 평소 배경이 없는 요소(ghost 버튼)는 누르는 동안 `bg-layer-default-pressed` 표면이 생긴다. 떠 있는 표면(FAB · 메뉴) 위라면 `bg-layer-floating-pressed`. SEED 의 투명도 있는 transparent-pressed 는 검사기가 받지 않아 두지 않았다.
- 색이 이미 상태를 뜻하는 요소(Switch 의 켜짐 · 탭의 선택)는 색을 바꾸지 않고 축소만 한다 — 손을 떼기 전에 상태가 바뀐 것처럼 보이지 않게.

**크기 — 거리로 줄인다.** 누르는 동안 요소가 세로 2px 만큼 줄어든다. 배율을 고정하면 요소가 클수록 가로로 많이 움직이므로, 거리를 고정하고 배율은 요소 크기에서 계산한다.

| 값 | 크기 | 뜻 |
|---|---|---|
| 축소량 | 2px | 세로로 줄어드는 거리 |
| 폭 보정 | 폭 ÷ 4 | 가로로 긴 요소(목록 줄)가 지나치게 움직이지 않게 |
| 최소 기준 길이 | 24px | 아주 작은 요소의 축소 비율 상한(8.3%) |

```
기준 길이 = max(요소 높이, 요소 폭 ÷ 4, 24)
배율     = (기준 길이 − 2) ÷ 기준 길이
```

- 가운데를 기준으로 줄고, 차지하는 자리는 그대로다 — 옆 요소가 움직이지 않는다.
- 영역이 하나의 면으로 잡히는 요소에만 쓴다. 글 속 링크처럼 줄바꿈되는 요소에는 쓰지 않는다.
- 안의 동작이 요소 전체에 딸린 것(행 안의 Switch)이면 행 전체가 준다. 대등한 동작이 나란하면(카드 안의 닫기 · 좋아요) 누른 버튼만 준다.
- 요소 전체를 줄여 정렬 · 여백 · 모서리가 어긋나면(목록 줄 · 아코디언) 콘텐츠만 준다.
- 이미 줄어드는 요소 안의 요소는 따로 줄지 않는다.
- 선택된 요소도 준다. 불러오는 중 · 비활성은 줄지 않는다.
- 150ms · `motion-ease-pressed-scale`.

#### 모션 줄이기 모드

색의 라이트 · 다크처럼 "보통 · 줄이기" 두 모드를 둔다. 사용자가 기기에서 동작 줄이기를 켜면 줄이기 모드다 — 웹은 `prefers-reduced-motion: reduce`, 앱은 `MediaQuery.disableAnimations`.

| 무엇 | 보통 | 줄이기 |
|---|---|---|
| 눌림 축소 | 세로 2px | 없음(배율 1) — 색 전환만 남는다 |
| 색 전환 | 150ms | 그대로 |
| 매크로 모션(200ms 초과) | 이동 · 확대 · 미끄러짐 | 150ms 서서히 나타남 · 사라짐 |
| 반복(스켈레톤 · 로딩 원 · 펄스) | 계속 | 멈춘다 — 스켈레톤은 띠 없이 면만, Progress Circle 은 돌지 않는 3/4 호(2026-10-03) |

지금 이 모드를 따르는 곳은 웹 2곳 · 앱 스켈레톤 1곳이다(2026-09-29) — 앱 PR 에서 모든 모션이 따르게 한다.

### v32 추가 — 4단계 duration + ease-out (prose-token · 기록 — 기준은 v104 모션, 옛 이름은 별칭)

> **spec 한계**: design.md spec은 motion(transition) 토큰 타입을 정형화하지 않습니다. shadow와 동일한 **prose-token** — `npm run lint` 자동 검증 비대상이며, `scripts/build-tailwind-v4.mjs`가 prose 표에서 추출해 v4 `@theme` CSS의 `--motion-duration-*` / `--motion-ease-*`로 출력.

| 토큰 | 값 | 주 용도 |
|---|---|---|
| `motion-duration-fast` | `150ms` | 작은 hover/focus 전환, ripple |
| `motion-duration-base` | `200ms` | default — drawer/dropdown 일반 UI 전환 |
| `motion-duration-slow` | `300ms` | modal/page-level 전환 |
| `motion-duration-slower` | `500ms` | hero/large layout shift |
| `motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | default — 자연스러운 감속(Toss·Material 공통) |

#### 추가 이유
1. v25(shadow-*-dark) → v30(v4 build)으로 elevation·typography 인프라 도입 후, v32에서 motion으로 시간 차원 추가 — 컴포넌트 인터랙션(hover, modal entrance, drawer slide) 작성 단계 진입.
2. **4 duration + 1 easing**: Toss·Material 동일 절제 — 모든 전환을 같은 ease-out으로 통일해 일관 톤. 토큰 5종(5 한도 정확).
3. easing은 **`ease-out` 단독**으로 시작 — `ease-in` / `ease-in-out` / `spring`은 사용 사례 등장 시 추가.

#### WCAG / 자동 검증
- **2.3.3 Animation from Interactions**: 200ms 초과 large 전환(`slow`/`slower`)은 `prefers-reduced-motion: reduce` 미디어 쿼리로 비활성 권장. 컴포넌트 스펙에서 명시.
- 자동 검증 불가는 shadow와 동일 — prose-token이라 lint 비대상. 손계산·시각 검토 의존.

#### HR / Desk 듀얼 브랜드
- motion은 brand-neutral. HR/Desk 동일 스케일.
- 적용 강도 분기 권장: HR(B2B)은 `fast`/`base` 위주(절제), Desk(B2C)는 `base`/`slow` 위주(친근감).

### Loop motion (v63 추가, prose-token · 기록 — 기준은 v104 모션 — `motion-duration-loop` · `motion-ease-linear` 는 이 표가 원본)

skeleton shimmer · spinner · pulse 등 **반복 애니메이션** 용 토큰 2종. v32는 단발 전환(hover/modal entrance) 위주 → 반복 사용 사례(loading 상태) 등장으로 보완.

| 토큰 | 값 | 주 용도 |
|---|---|---|
| `motion-duration-loop` | `1500ms` | 스켈레톤 반짝임 1주기(곡선은 `motion-ease-easing` — 2026-10-03), pulse 1주기 |
| `motion-ease-linear` | `linear` | 일정한 속도가 필요한 반복 (`ease-out` 반복은 끝에 멈춰 어색) — 스켈레톤 · Progress Circle 은 쓰지 않는다(2026-10-03) |

#### 추가 이유
1. Skeleton/Loading 시나리오에서 `1500ms × linear` 반복이 표준 (Material progress, Toss skeleton 등 실측). 단발 전환용 `motion-duration-slower` (500ms)보다 길어야 자연.
2. `linear`는 v32에서 의도적으로 보류 — 단발 전환은 ease-out, 반복은 linear 분기가 자연스러움. 사용 사례(Skeleton) 등장으로 추가.
3. **2 토큰 한도 내** — duration + ease 페어. spinner/pulse는 같은 토큰 재사용.

#### WCAG / 자동 검증
- **2.2.2 Pause / Stop / Hide**: 반복 애니메이션은 사용자가 멈출 수 있어야 — skeleton은 데이터 도착 시 자동 정지(=일시 노출), spinner는 5초 이상 지속 시 cancel/refresh 옵션 제공 권장.
- **2.3.3**: `prefers-reduced-motion: reduce` 시 shimmer/spinner는 단순 색상 변화 또는 정지 — 컴포넌트 spec에서 명시.
- prose-token이라 lint 비대상.

### Animation library (v74 추가, prose-token · 기록 — 기준은 v104 모션과 각 컴포넌트 스펙의 motion — 키프레임 CSS 는 이 절이 원본)

> **v105(2026-09-29)**: 권장 지속 시간 · 이징을 v104 이름으로 옮겼다. 같은 값의 별칭은 새 이름으로(`motion-duration-fast` → `motion-duration-d3` · `base` → `d4` · `slow` → `d6`), 나타나는 키프레임은 `motion-ease-enter`, 사라지는 키프레임은 `motion-ease-exit`, 걷는 500ms 는 `motion-duration-d6` 로. 모션 줄이기는 v104 표를 따른다.

v32 duration·ease 토큰만으론 컴포넌트별 transition 작성 시 keyframe 직접 작성이 반복 → 정형 keyframe 12종 + 사용 패턴 prose 표준화. CSS keyframes 정의 + 권장 duration/ease 매핑.

#### Single-shot keyframes (10종 — 단발 전환)

| keyframe | 권장 duration | 권장 ease | 주 용도 |
|---|---|---|---|
| `fade-in` | `motion-duration-d4` (200ms) | `motion-ease-enter` | dropdown/popover/toast 등장 |
| `fade-out` | `motion-duration-d3` (150ms) | `motion-ease-exit` | dropdown/popover/toast 사라짐 (등장보다 빠르게) |
| `slide-in-up` | `motion-duration-d6` (300ms) | `motion-ease-enter` | drawer bottom / bottom sheet / Toast bottom |
| `slide-in-down` | `motion-duration-d4` (200ms) | `motion-ease-enter` | dropdown / banner 등장 |
| `slide-in-left` | `motion-duration-d6` (300ms) | `motion-ease-enter` | drawer right 등장 — Side Panel 은 스펙의 motion(2026-10-04) |
| `slide-in-right` | `motion-duration-d6` (300ms) | `motion-ease-enter` | drawer left — Side Panel 은 스펙의 motion(2026-10-04) |
| `scale-in` | `motion-duration-d4` (200ms) | `motion-ease-enter` | modal / dialog / popover (`scale(0.96 → 1)` + `opacity 0 → 1`) |
| `scale-out` | `motion-duration-d3` (150ms) | `motion-ease-exit` | modal / dialog / popover dismiss |
| `bounce-in` | `motion-duration-d6` (300ms) | `cubic-bezier(0.34, 1.56, 0.64, 1)` | empty state celebrate, success indicator (over-shoot) |
| `shake` | `motion-duration-d6` (300ms) | `cubic-bezier(.36,.07,.19,.97)` | form validation error, 잘못된 input 강조 |

#### Loop keyframes (4종 — 반복)

v63 `motion-duration-loop` (1500ms) + `motion-ease-linear` 페어 활용. 일부는 linear 외 ease 권장.

| keyframe | duration | ease | 주 용도 |
|---|---|---|---|
| `spin` | `motion-duration-loop` (1500ms) | `linear` | 새로 고침 아이콘처럼 일정하게 도는 것 — Progress Circle 은 쓰지 않는다(1.2초 · `progress-circle.yaml`, 2026-10-03) |
| `pulse` | `motion-duration-loop` (1500ms) | `cubic-bezier(0.4, 0, 0.6, 1)` | dot indicator, focus 강조 (in-out ease) |
| `shimmer` | `motion-duration-loop` (1500ms) | `motion-ease-easing` | 스켈레톤 반짝임 띠(왼쪽 밖 → 오른쪽 밖) — SEED 곡선(2026-10-03) |
| `ping` | `motion-duration-loop` (1500ms) | `cubic-bezier(0, 0, 0.2, 1)` | notification dot, attention attractor (`scale 1 → 2`, `opacity 1 → 0`) |

#### CSS keyframes 정의 (export 대상)

```css
@keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes fade-out { from { opacity: 1 } to { opacity: 0 } }
@keyframes slide-in-up { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
@keyframes slide-in-down { from { transform: translateY(-8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
@keyframes slide-in-left { from { transform: translateX(-8px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
@keyframes slide-in-right { from { transform: translateX(8px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
@keyframes scale-in { from { transform: scale(0.96); opacity: 0 } to { transform: scale(1); opacity: 1 } }
@keyframes scale-out { from { transform: scale(1); opacity: 1 } to { transform: scale(0.96); opacity: 0 } }
@keyframes bounce-in { 0% { transform: scale(0.3); opacity: 0 } 50% { transform: scale(1.05) } 70% { transform: scale(0.9) } 100% { transform: scale(1); opacity: 1 } }
@keyframes shake { 10%, 90% { transform: translateX(-1px) } 20%, 80% { transform: translateX(2px) } 30%, 50%, 70% { transform: translateX(-4px) } 40%, 60% { transform: translateX(4px) } }
@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
@keyframes shimmer { from { transform: translateX(-100%) } to { transform: translateX(100%) } }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0 } }
```

#### 권장 사용 패턴 — `animation` shorthand

| 패턴 | shorthand 예시 |
|---|---|
| Toast 등장 | `animation: slide-in-up var(--motion-duration-d6) var(--motion-ease-enter) both` |
| Modal 등장 | `animation: scale-in var(--motion-duration-d4) var(--motion-ease-enter) both` |
| Modal dismiss | `animation: scale-out var(--motion-duration-d3) var(--motion-ease-exit) both` |
| Skeleton 반짝임 | `animation: shimmer var(--motion-duration-loop) var(--motion-ease-easing) infinite` |
| Progress Circle | 회전 · 호 · 채움 — `progress-circle.yaml` 의 motion(1.2초 숫자 곡선, 2026-10-03) |
| Notification dot | `animation: ping var(--motion-duration-loop) cubic-bezier(0, 0, 0.2, 1) infinite` |
| Form error | `animation: shake var(--motion-duration-d6) cubic-bezier(.36,.07,.19,.97)` |
| 펼치고 접기(아코디언 · Collapsible · 하위 줄 · 나무 · 사이드바 하위) | `transition: height var(--motion-duration-d6) var(--motion-ease-easing)` + 꺾쇠 회전 같은 시간 — 모션 줄이기면 높이 대신 `opacity` 150ms(2026-10-10) |
| 숨는 머리 스냅(Scroll Auto Hide) | `transition: transform var(--motion-duration-d4) var(--motion-ease-enter)` — 스크롤이 끝났을 때만, 스크롤 중은 거리 1:1(2026-10-10) |

#### 추가 이유
1. v32(duration/ease) + v63(loop) → 직접 keyframe 작성 사용 사례 누적: Modal/Dialog scale-in, Drawer slide-in, Toast slide-in, Skeleton shimmer, Spinner spin 등 spec prose에 반복 등장.
2. **shadcn/ui + Material + Toss 표준 keyframe 합집합** — fade/slide/scale/bounce/shake (단발 8) + spin/pulse/shimmer/ping (loop 4). 14종 = "거의 모든 UI 애니메이션 cover".
3. duration/ease 토큰과 결합 → 컴포넌트 spec에서 `animation: <keyframe> <duration-token> <ease>` 형태로 일관 표기 가능.

#### WCAG / 자동 검증
- **2.3.3 Animation from Interactions**: 줄이기 모드는 v104 "모션 줄이기 모드" 표를 따른다 — 큰 전환은 150ms 서서히 나타남 · 사라짐으로 바꾸고, 반복은 멈추고, 색 전환은 남긴다. 모든 애니메이션을 0.01ms 로 끄는 전역 규칙은 쓰지 않는다 — 서서히 나타남 · 색 전환까지 사라져 무엇이 바뀌었는지 안 보인다(v105).
- **2.2.2 Pause/Stop/Hide**: loop 애니메이션은 데이터 도착 시 자동 정지(skeleton/shimmer) 또는 5초 이상 지속 시 cancel 옵션 제공.
- prose-token이라 lint 비대상. 시각 검토 + 컴포넌트 spec에서 정확한 keyframe 이름 인용 필수 (오타 시 silent failure).

#### HR / Desk 듀얼 브랜드
- keyframe brand-neutral. 지속 시간 분기 권장 — HR(`motion-duration-d3`/`d4`), Desk(`d4`/`d6`)(v105 — v32 가이드를 새 이름으로).
- HR(결재 row 등장 fade-in / Toast top-right slide-in-down / Skeleton shimmer) / Desk(메모 카드 scale-in / 가계부 거래 등장 slide-in-up / 알림 dot ping) 사용.

## State

### v106 — SEED 상태 (2026-09-30)

당근 SEED 의 State 를 들인다. 사용자가 2026-09-30 비교 페이지(https://claude.ai/artifact/11DmriLqavjqcSs1zFrjeZ)에서 다섯 가지를 골랐다 — 이름은 SEED + 웹 둘, 비활성은 전용 색, 호버는 누름 색, 포커스는 링 2px · 띄움 2px + 입력칸 테두리 2px, 선택은 반전. 출처: seed-design.io Foundations › State, rootage 컴포넌트 64개(Apache-2.0).

**아직 스펙 YAML 과 제품에는 들어가지 않았다.** 스펙은 컴포넌트 단계에서 SEED 와 비교할 때 이 이름 · 표현으로 옮기고(값은 그대로), 제품은 앱 적용 단계에서 옮긴다. 2026-09-30 제품은 비활성을 불투명도 0.5 로, 선택을 브랜드 색(Desk) · 회색(HR · SSO)으로 보인다.

#### 상태의 두 유형

- **상호작용 상태** — 사용자의 동작에 따라 바뀐다. `enabled` · `hovered` · `focused` · `pressed`.
- **옵션 상태** — 컴포넌트에 걸린 옵션이다. `selected` · `disabled`, 그리고 컴포넌트 상태 `invalid` · `loading` · `readonly`.
- 둘은 겹칠 수 있다 — 선택된 요소도 누를 수 있다. 겹치면 `selected + pressed` 처럼 함께 적는다.

#### 상태 이름

| 이름 | 뜻 | 어디서 |
|---|---|---|
| `enabled` | 기본 — 아무 상호작용이 없을 때 | 모두 |
| `hovered` | 포인터가 위에 있음 | 웹 — 마우스가 있는 기기에서만(`@media (hover: hover)`) |
| `focused` | 키보드 포커스(`:focus-visible`), 입력칸은 입력 중 | 모두 |
| `pressed` | 누르고 있는 동안 | 모두 |
| `selected` | 선택됨 · 켜짐 · 지금 항목 | 모두 |
| `disabled` | 비활성 — 상호작용을 받지 않는다 | 모두 |
| `invalid` | 값이 규칙에 맞지 않음 | 입력 요소 |
| `loading` | 진행 중 — 입력을 받지 않는다 | 누를 수 있는 요소 |
| `readonly` | 값은 보이지만 바꿀 수 없음 | 입력 요소 |

- 옛 이름(스펙 YAML 52개에 섞여 있다): `default` → `enabled`, `hover` → `hovered`, `focus-visible` · `focus` → `focused`, `active` → `pressed`, `checked` → `selected`, `error` → `invalid`. 컴포넌트에만 있는 상태(`open` · `dragging` 들)는 그대로 둔다.

#### 상태별 표현

| 상태 | 표면 | 글자 · 아이콘 | 테두리 · 링 | 더하는 것 |
|---|---|---|---|---|
| `hovered` | `-pressed` 역할 색(누름과 같다) | 그대로 | 그대로 | — |
| `focused` — 키보드 | 그대로 | 그대로 | 링 2px · 띄움 2px · `stroke-focus-ring` | `outline` 으로 그려 자리가 밀리지 않는다. 링은 상자 모서리를 따른다 — 링 바깥 반지름 = 상자 반지름 + 띄움 + 두께(띄움 2 면 + 4, 모서리 12 상자는 16). 모서리 0 이면 0, 원은 원이다. CSS `outline` 이 그리는 그대로라 앱은 이 셈으로 그린다(2026-10-15 구현 세션 질문 Q-007-5 정리) |
| `focused` — 입력 중 | 그대로 | 그대로 | 안쪽 2px `stroke-neutral-contrast` | 반투명 링은 쓰지 않는다. 안쪽에 덧그려 내용이 밀리지 않는다(Text Field 2026-10-01 — 처음엔 `stroke-focus-ring` 이었다) |
| `pressed` | `-pressed` 역할 색 | 그대로 | 그대로 | 축소(Feedback) |
| `selected` | `bg-neutral-inverted` | `fg-neutral-inverted` | — | 칩 · 세그먼트 · 날짜처럼 고르는 요소 |
| `disabled` | `bg-disabled`(배경이 있는 요소만) | `fg-disabled` | `stroke-neutral-weak` | 불투명도를 쓰지 않는다. 커서 not-allowed |
| `invalid` | 그대로 | 오류 문구 `fg-critical` | 테두리 2px `stroke-critical-solid` | 문구는 입력칸 가까이(Writing › 오류) |
| `loading` | `-pressed` 역할 색 | 글자 대신 진행 표시 | 그대로 | 누름 · 축소 없음 |
| `readonly` | `bg-disabled` | 값은 `fg-neutral` 로 읽히게 | 그대로 | — |

- 호버와 누름이 같은 색이라, 마우스로 누를 때는 색이 더 바뀌지 않고 축소만 더해진다. 호버는 마우스가 있는 기기에서만 켠다 — 터치 화면에 호버가 붙어 남지 않게.
- 불러오는 중 · 읽기 전용의 표면은 SEED 컴포넌트 값을 따랐다(불러오는 중 = 누름 색, 읽기 전용 = 비활성 배경).
- 선택을 테두리로 보이는 요소: Select Box 는 고른 상자만 2px `stroke-neutral-contrast`(v113 — SEED 와 같다, 바탕은 바꾸지 않는다). Icon Picker 의 고른 칸도 같은 안쪽 2px 이고, Color Swatch 의 고른 원은 2 를 띄운 2px 고리(같은 색) + 체크다 — 칸의 색이 곧 값이라 바탕을 바꿀 수 없다(2026-10-09). 목록 · 메뉴의 지금 항목은 그 컴포넌트 차례에 SEED 와 비교해 정한다.
- 켜고 끄는 아이콘 단추(Toggle)는 켬에 바탕을 칠하지 않는다 — 위 표의 `selected` 바탕(반전)은 칩 · 세그먼트 · 날짜처럼 여럿 가운데 고르는 요소의 것이다. 켬은 아이콘이 진한 색 + 선 2.5 로 말한다(Iconography, 2026-10-09).
- 누르는 순간 저장되는 컨트롤(Switch · Toggle · 할 일 완료 체크, 손을 뗄 때 저장되는 Slider)은 요청 중에도 `loading` · `disabled` 로 바꾸지 않는다 — 화면은 바로 바뀌고, 실패하면 되돌리고 그 자리에서 알린다. 한 요청이 화면의 다른 컨트롤을 막지도 않는다 — 막으면 키보드 초점이 본문으로 빠진다(2026-10-09).
- 스위치처럼 색으로 켜짐을 뜻하는 요소의 비활성도 컴포넌트 단계에서 정한다(SEED 스위치는 불투명도 0.58).
- 예외 — Attachment Input 의 사진 항목은 읽기 전용 · 끄는 중에 SEED 그대로 불투명도 0.5 다(파일 카드는 글 · 아이콘 `fg-disabled`). 사용자가 SEED 모양 그대로를 골랐다(2026-10-15 마무리 13B — 흐리지 않는 안은 고르지 않았다) — 이 두 상태의 사진 항목에만 쓰고, 막힘(`disabled`)은 그대로 불투명도를 쓰지 않는다.
- **앱의 키보드 포커스** — 앱도 하드웨어 키보드로 옮길 때만 웹과 같은 링(2px · 띄움 2px · `stroke-focus-ring`)을 그린다 — Flutter 의 `FocusHighlightMode.traditional` 일 때만이고, 손가락으로 누를 때는 그리지 않는다. 누를 수 있는 것은 모두 포커스를 받아 Tab 순서에 든다 — 버튼(`PButton`)도(사용자 결정 2026-10-08).

#### 겹칠 때

- 옵션 상태는 상호작용 상태와 겹친다 — `selected` 에 호버 · 누름 · 포커스가 더해진다. 선택된 요소를 누르면 선택 색은 그대로 두고 줄이기만 한다(Feedback › Color).
- `disabled` 는 다른 상호작용 상태와 함께 나타나지 않는다 — 호버 · 누름 색 · 축소가 없다. 키보드로 머무를 수 있는 비활성(`aria-disabled`)만 포커스 링을 받는다.
- `loading` 은 입력을 받지 않는다 — 누름 · 축소가 없다.
- `invalid` 와 입력 중(`focused`)이 겹치면 테두리는 오류 색이 이긴다.

## Iconography

### v106 — 아이콘 (2026-09-30)

당근 SEED 의 Iconography 를 들인다. 사용자가 2026-09-30 비교 페이지에서 골랐다 — 세트는 lucide 유지, 크기는 SEED 예시 3단계(16 · 20 · 24, 12 는 바닥, 큰 그림은 비율대로), 채움 대신 굵기와 색, 아이콘 버튼은 보이는 크기 40. 출처: seed-design.io Foundations › Iconography(Apache-2.0).

**아직 제품에는 들어가지 않았다.** 2026-09-30 제품에는 크기 18가지(8 ~ 48px)와 선 굵기 11가지가 섞여 있다 — 앱 적용 단계에서 옮긴다.

#### 세트

- lucide 하나를 쓴다 — 웹은 `lucide-react`, 앱은 `lucide_icons_flutter`. 네 제품이 이미 이 세트다.
- SEED 의 아이콘은 당근 로고의 모양을 딴 브랜드 자산이라 쓰지 않는다.
- 없는 아이콘은 lucide 의 모양 규칙대로 그려 더한다 — 24px 격자, 선 2, 둥근 끝 · 둥근 이음.

#### 크기

| 크기 | 뜻 |
|---|---|
| `16px` | 작은 UI 아이콘 — 가장 작은 단계 |
| `20px` | 가운데 단계 |
| `24px` | 기본 격자 — lucide · SEED 가 그리는 크기 |

- UI 아이콘은 16 · 20 · 24 셋만 쓴다. 옮길 때는 한 단계 위로 — 15px 이하는 16, 17 ~ 19px 는 20, 21 ~ 23px 는 24.
- 12px 은 넘지 말아야 할 바닥이다 — UI 아이콘으로는 쓰지 않는다.
- 빈 화면 · 큰 그림처럼 24px 보다 큰 아이콘은 24px 격자를 비율대로 키워 자리마다 정한다.
- 자리마다 어느 단계를 쓸지는 컴포넌트 단계에서 SEED 의 해당 컴포넌트와 비교해 정한다.

#### 선 굵기와 상태

- 선은 lucide 기본 2(24px 격자 기준 — 16px 에서는 그만큼 가늘게 그려진다).
- 켜짐 · 선택은 진한 색(또는 브랜드 색) + 선 2.5, 꺼짐은 lucide 의 `-off` 아이콘(사선)을 쓴다. SEED 의 "켜짐 = 채움" 을 이렇게 대신한다 — lucide 에는 채움 모양이 없고, 앱의 lucide 글꼴은 채울 수도 없다.
- 모으기 단추(관심 · 고정)는 꺼짐에 사선을 긋지 않는다 — 같은 아이콘이 꺼짐은 흐린 색(`fg-neutral-muted`) + 선 2, 켜짐은 진한 색(`fg-neutral`) + 선 2.5 로만 갈린다(채우지 않는다). 사선(`-off`)은 기능이 꺼지는 단추(눈 · 종)에 쓰고, 아이콘은 지금 상태를 그린다 — 금액을 가렸으면 `eye-off`(사용자 결정 2026-10-09, `specs/components/toggle.md`).
- 앱은 lucide 글꼴의 굵기 변형으로 같은 굵기를 맞춘다(앱 적용 때 고른다).

#### 아이콘만 있는 버튼

- 보이는 크기는 40px — 24px 아이콘이면 44px.
- 누르는 영역은 늘 44px 이상이다(Layout › Touch targets) — 40px 버튼은 보이지 않는 여백을 2px 씩 더한다.
- 이름을 반드시 단다 — 웹 `aria-label`, 앱 `tooltip` 또는 `Semantics` label. 이름도 번역 문구에 둔다.

#### 글자와 함께

- 한 줄에 둘 때는 높이 가운데로 맞추고, 사이는 간격 토큰으로 둔다(2026-09-30 제품은 대부분 8px).
- 아이콘만으로 뜻이 모호하면 글자를 함께 쓴다.
- 상단 내비게이션은 선 아이콘 24 로 둔다(상자 44 — Top Navigation, 2026-10-04). 하단 탭은 고른 탭을 짙은 글자색(`fg-neutral`) + 선 2.5 로, 다른 탭은 `fg-neutral-subtle` + 선 2 로 둔다 — 브랜드 색으로 칠하지 않는다(Bottom Navigation, 2026-10-04).

## Inclusive Design

### v106 — SEED 포용적 디자인 (2026-09-30)

당근 SEED 의 Inclusive Design 을 들인다 — 시각 · 청각 · 운동 · 인지 능력과 상황이 다른 모든 사용자가 쓸 수 있게. 규칙은 SEED 그대로이고, 대비는 porest 가 정한 WCAG 2 로 잰다(v102). 사용자가 2026-09-30 터치 영역은 "44 를 반드시"(Touch targets 의 지금 문구)로 골랐다. 출처: seed-design.io Foundations › Inclusive Design(Apache-2.0).

**아직 제품에는 들어가지 않았다.** 2026-09-30 조사에서 어긋난 자리 — Desk 웹이 화면 확대를 막음(`user-scalable=no`), Desk 웹 입력칸 오류를 보조 기술에 알리지 않음, 이름 없는 아이콘 버튼 90여 곳, HR 웹 `<html lang="en">`, 모션 줄이기를 따르지 않는 반복 모션 — 은 앱 적용 단계에서 고친다.

#### 보기

- **대비** — 글자와 배경은 WCAG 2 AA(본문 4.5:1 · UI 3:1)를 검사기로 잰다. SEED 는 APCA(Lc)로 재서 수치를 옮기지 않는다. 비활성 · 플레이스홀더는 WCAG 가 따지지 않지만 전용 색(`fg-disabled` · `fg-placeholder`)으로 읽히게 둔다.
- **색만으로 알리지 않는다** — 상태 · 오류 · 차트는 글자 · 아이콘 · 모양을 함께 쓴다. 색을 고르는 칸도 칸마다 색 이름("빨강")을 이름으로 달고, 고른 칸은 고리 · 체크로 보인다(Color Swatch, 2026-10-09).
- **위계와 순서** — 중요한 정보가 먼저 보이게 짜고, 화면 순서를 논리적으로 둔다. 스크린 리더가 그 순서로 읽는다.

#### 조작

- **터치 영역** — 누르는 영역은 모두 44 × 44 이상(`touch-min`). 보이는 크기가 작으면 보이지 않는 여백으로 넓힌다.
- **제스처 대신 누르기** — 밀기 · 끌기 · 핀치 같은 제스처로 하는 일은 누르기로도 할 수 있게 한다. Slider 는 트랙을 눌러 고르고 키보드로도 옮긴다(2026-10-09). 나누기 손잡이는 한 번 눌러 25 ↔ 40 · 키보드 5% 로, 대시보드 위젯 크기는 ⋮ "크기" 로도 바꾼다(Resizable, 2026-10-10).
- **보조 기술** — 모든 동작에 VoiceOver · TalkBack · 키보드로 닿는다. 키보드 포커스는 State › `focused`.
- **요청 중에도 막지 않는다** — 누르는 순간 저장되는 컨트롤을 응답을 기다리며 막지 않는다. 막으면 초점이 본문으로 빠져 키보드 · 화면 읽기 프로그램 사용자가 자리를 잃는다. 실패하면 되돌리고 그 자리에서 알린다(State, 2026-10-09).
- **앱의 키보드** — 앱도 누를 수 있는 것은 모두 키보드 포커스를 받는다(버튼 `PButton` 포함). 링은 키보드로 옮길 때만 웹과 같게 그리고, 손가락으로 누를 때는 그리지 않는다(State › 앱의 키보드 포커스, 사용자 결정 2026-10-08).
- **길 찾기** — 지금 어디 있는지를 이름과 선택 표시로 알 수 있게 하고, 주요 기능은 찾기 쉬운 자리에 둔다.

#### 콘텐츠

- **이름** — 아이콘만 있는 버튼 · 이미지에는 기능과 맥락을 짧게 적은 이름을 단다(웹 `aria-label` · `alt`, 앱 `Semantics` label · `tooltip`). 장식은 보조 기술에서 숨긴다(`alt=""` · `aria-hidden` · `ExcludeSemantics`). 이름도 번역 문구에 둔다. 켜고 끄는 단추는 이름을 고정하고 켬은 `aria-pressed`(앱 `toggled`)로 알린다 — 상태마다 이름을 바꾸지 않는다(Toggle, 2026-10-09). 펼치고 접는 트리거도 이름을 고정하고 펼침은 `aria-expanded`(앱 `expanded`)로 알린다 — "펼치기 · 접기" 로 바꾸지 않는다(Accordion · Collapsible, 2026-10-10).
- **오류** — 바로 알린다. 테두리 색(State › `invalid`)과 함께, 웹은 `aria-invalid` + `aria-describedby` 로 입력칸과 문구를 잇고 `role="alert"`(또는 `aria-live`)로 알린다. 앱은 `Semantics` liveRegion. 문구는 입력칸 가까이, 고칠 방법까지(Writing › 오류).

#### 개인 설정

- **글자 크기** — 웹 글자는 rem(v104)이라 브라우저 글자 크기를 따르고, 앱은 OS 글자 크기를 따른다. 커져도 레이아웃이 깨지지 않게 한다. 화면 확대를 막지 않는다 — `user-scalable=no` · `maximum-scale` 을 쓰지 않는다(WCAG 1.4.4).
- **애니메이션** — 모든 모션이 모션 줄이기 모드(Motion)를 따른다. 2초 넘는 애니메이션은 피하고, 쓰면 멈추거나 건너뛸 수 있게 한다. 초당 3번 넘게 번쩍이지 않는다.
- **자동 재생** — 소리 · 영상은 멈춰 둔 채로 시작한다. 필요하면 소리 없이 시작하고, 3초 넘는 소리는 멈춤 · 음량 조절을 준다.
- **언어** — 화면 언어를 고를 수 있고, 바꾸면 `<html lang>` 도 바뀐다(International Design).

## International Design

### v106 — SEED 국제화 디자인 (2026-09-30)

당근 SEED 의 International Design 을 들인다 — 언어 · 지역마다 날짜 · 시각 · 숫자 · 기호를 그 관습대로 쓴다. 사용자가 2026-09-30 날짜는 SEED 셋, 시각은 오전 · 오후 12시간, 지난 시간은 지금 porest 방식, 구간은 한국어 물결표 · 영어 en dash 로 골랐다. 출처: seed-design.io Foundations › International Design(Apache-2.0).

- 언어: 한국어(기본) · 영어 — Desk 웹 · Desk 앱 · HR 웹. SSO 는 한국어만.
- 표기는 코드에 직접 적지 않고 로케일 문구 · 로케일 포맷터로 낸다. 날짜 · 시각은 한국어 로케일을 넘겨야 "오후" 가 나온다.

**아직 제품에는 들어가지 않았다.** 2026-09-30 제품 — HR 웹 한국어 화면의 영어 시각(`3:30 PM`) 6곳, `2026-09-30` 을 그대로 보이는 곳 51곳(HR), Desk 달력 머리 `2026.09.28`, Desk 앱의 24시간 시각, 구간 기호 세 가지 — 는 앱 적용 단계에서 옮긴다.

#### 날짜

| 형식 | 한국어 | 패턴 | 영어 | 패턴 |
|---|---|---|---|---|
| 표준 | 2026년 9월 30일 | `yyyy년 M월 d일` | Sep 30, 2026 | `MMM d, yyyy` |
| 줄임 | 9월 30일 | `M월 d일` | Sep 30 | `MMM d` |
| 점 | 2026. 9. 30. | `yyyy. M. d.` | — | — |
| 요일 | 9월 30일 (수) | `M월 d일 (E)` | Wed, Sep 30 | `E, MMM d` |
| 요일 풀어 씀 | 9월 30일 수요일 | `M월 d일 EEEE` | Wednesday, Sep 30 | `EEEE, MMM d` |
| 요일 · 시각 | 9월 30일 (수) 오후 9:41 | `M월 d일 (E) a h:mm` | Wed, Sep 30 at 9:41 PM | `E, MMM d 'at' h:mm a` |

- 올해 날짜는 줄임, 다른 해면 표준, 표 · 목록 끝처럼 좁은 칸은 점으로 쓴다.
- 점 표기는 [연] · [월] · [일] 을 줄인 것이라 마지막 [일] 뒤에도 점을 찍고, 0 을 채우지 않는다(`2026. 9. 30.`).
- 입력칸 값 · 내보내기 파일 · API 의 `yyyy-MM-dd` 는 화면 표시가 아니므로 그대로 둔다.

#### 시각

| 형식 | 한국어 | 패턴 | 영어 | 패턴 |
|---|---|---|---|---|
| 시각 | 오후 9:41 | `a h:mm` | 9:41 PM | `h:mm a` |

- 모든 화면에 오전 · 오후 12시간을 쓴다. 초는 쓰지 않는다.

#### 지난 시간

| 지난 시간 | 한국어 | 영어 |
|---|---|---|
| 1분 미만 | 방금 전 | Just now |
| 1 ~ 59분 | n분 전 | n min ago |
| 1 ~ 23시간 | n시간 전 | n hr ago |
| 24 ~ 47시간 | 어제 | Yesterday |
| 2 ~ 6일 | n일 전 | n days ago |
| 7일 이상 | 날짜(위 규칙) | 날짜 |

- 2026-09-30 Desk 웹 · 앱의 방식이다. "방금" 만 SEED 처럼 "방금 전" 으로 바꾼다. SEED 의 주 · 달 · 년 표기는 쓰지 않는다.
- 흐른 시간으로 센다 — 달력 날짜가 아니다. 밤 11시에 온 알림은 다음 날 새벽 1시에도 "2시간 전" 이다(v107 — v106 표의 "어제 날짜" 를 제품 계산대로 바로잡음).

#### 숫자 · 돈

| 형식 | 한국어 | 영어 |
|---|---|---|
| 돈 | 1,234,567원 | ₩1,234,567 |
| 빼기 | −1,234원 | — |
| 차트 축 · 개수 줄임 | 1.2만 · 12.3만 · 123만 · 1.2억 | 12K · 123K · 1.2M |
| 전화번호 | 010-1234-5678 | — |

- 돈은 줄이지 않고 원 단위까지 쓴다. 줄임은 차트 축과 개수에만. 차트의 좁은 자리(열지도 칸 · 도넛 가운데)에 원까지 들어가지 않으면 줄여 쓰지 않고 글을 뺀다 — 열지도는 세기 색만 남기고, 도넛은 목록 위 합계로 옮긴다(2026-10-08, `specs/components/chart.md`).
- 2026-10-08 Desk 웹은 돈을 일곱 자리에서 줄여 쓴다 — 축 줄임 함수 `formatChartAxis`(desk-front `f05dd4f`, 2026-09-04)를 축 밖에서 쓴다: 열지도 칸(`StatsPage.tsx:1770`) · 통계 도넛 가운데(`StatsPage.tsx:1366`) · 자산 도넛 가운데(`AssetPage.tsx:366`) · 저축 목표 금액(`AssetPage.tsx:823`) · 빠른 금액 칩(`AddTxSheet.tsx:1116`) · "지난달보다" 문장(`pages/expense/lib/insight.ts:23`) · 주식 시가총액(`features/stock/lib/format.ts:46-47`). 차트 셋(열지도 칸 · 도넛 가운데 둘)은 Chart 스펙(2026-10-08)이 정했고, 나머지 넷은 그 자리의 컴포넌트 차례에 정한다.
- 한국어 줄임은 만 · 억 · 조에 소수 한 자리까지, `.0` 은 버린다(`1억`). 영어는 compact 표기(`Intl.NumberFormat` · `NumberFormat.compact`).
- 빼기는 붙임표(-) 대신 빼기 기호 `−`(U+2212)를 쓴다 — 2026-09-30 Desk 웹 · 앱과 같다.
- 증감은 ▲ · ▼ + 값으로 쓰고 부호(+ · −)를 겹치지 않는다 — Colors 의 "증감 — 방향 색"(2026-10-08).

#### 구간 · 괄호

- 구간은 한국어 물결표 `~`, 영어 en dash `–` 로 잇고 앞뒤를 붙여 쓴다 — `9월 1일~9월 30일` · `06~10시` · `Sep 1–30`.
- 구간 기호는 로케일 문구에 둬서 언어마다 바뀌게 한다 — 코드에 직접 쓰지 않는다.
- 괄호는 한국어는 앞 글자에 붙이고(`매일 운동(30분)`), 영어는 한 칸 띄운다(`Exercise (30 min)`).

#### 번역 여유

- 버튼 · 라벨처럼 폭이 정해진 자리는 번역하면 길어질 자리를 둔다 — 줄바꿈하거나 늘어나게.
- porest 실측(2026-09-30, 한국어 · 영어 문구 6,100여 쌍): 영어가 한국어의 2배(가운데값), 6자 이하 짧은 말은 2.5배, 58 ~ 60% 가 2배 이상.
- SEED 의 확장 비율(한국어 글자 수 기준): 10자 이하 150 ~ 250% · 11 ~ 20자 130 ~ 150% · 21 ~ 30자 110 ~ 130% · 31 ~ 50자 90 ~ 110% · 51 ~ 70자 80 ~ 90% · 71자 이상 80%.
- 화면은 영어로도 한 번씩 확인한다.

## Voice and Tone

### v106 — porest 목소리 (2026-09-30)

당근 SEED 의 Voice and Tone 을 바탕으로 porest 의 목소리를 정한다. 사용자가 2026-09-30 원칙은 SEED, 톤은 "차분하고 친절한" 으로 골랐다 — porest 의 기준 톤은 토스(심플, 신뢰감, 전 연령 범용)이고, 돈과 회사 일을 다룬다. 출처: seed-design.io Foundations › Voice and Tone(Apache-2.0).

#### 원칙 — 명확한 · 이해하기 쉬운 · 사려깊은

1. **명확하고 간결하게** — 꼭 필요한 정보를 짧게 전해 사용자가 결정하도록 돕는다. 그래서 믿을 수 있는 서비스가 된다.
2. **이해하기 쉽게** — 누구나 쉽게 쓸 수 있게 말한다.
3. **사려깊게** — 사용자의 입장에서 생각한다. 성별 · 나이 · 종교 · 혼인 여부 · 인종 · 장애 같은 다양성을 존중하고 배려한다. 말에는 정보뿐 아니라 감정도 담긴다.

#### 톤 — 차분하고 친절한

- 이야기하듯 친절하게, 들뜨지 않게 말한다. 돈과 회사 일을 다루므로 믿음이 먼저다.
- 느낌표와 감탄은 아낀다 — 목표를 이룬 순간처럼 축하할 자리에서만.
- 말투는 해요체다(Writing).

#### 역할

- 사용자의 행동을 이끌어 목적을 이루게 돕는다.
- 언어 · 문화와 상관없이 누구나 쉽게 쓸 수 있게 한다.
- 어느 화면 · 어느 서비스에서나 같은 경험을 준다 — Desk 와 HR 이 같은 목소리로 말한다.

## Writing

### v106 — porest 글쓰기 (2026-09-30)

당근 SEED 의 Writing 을 들인다. 사용자가 2026-09-30 골랐다 — 말투는 모두 해요체, 존칭은 줄임, 마침표는 SEED(문장이면 늘), 띄어쓰기는 SEED(이름은 붙이고 문장은 띄움) + 보조 용언은 붙임, 줄임표는 `…`, 오류는 무엇이 · 왜 · 어떻게. 출처: seed-design.io Foundations › Writing(Apache-2.0).

**아직 제품 문구에는 들어가지 않았다.** 2026-09-30 네 제품에는 한 문구 안에서 해요 · 합니다가 섞인 곳 100곳, "-시겠" 36곳, 고칠 방법이 없는 오류 문구 400여 개가 있다 — 앱 적용 단계에서 제품마다 문구를 다시 쓴다.

#### 말투

- 해요체로 쓴다 — `저장했어요.` · `삭제할까요?`
- "~니다" 는 두 자리에서만 쓴다 — ① 자동으로 나가고 사용자가 조심해야 하는 알림(보안 알림 · 계정 잠금 같은) ② 개인정보 처리방침 · 약관 같은 법적 문서.
- 사용자가 스스로 연 확인창은 해요체다 — `삭제할까요? 삭제하면 되돌릴 수 없어요.`
- 한 문구 안에서 해요체와 합니다체를 섞지 않는다.

#### 존칭

- "-시-" 를 쓰지 않는다 — `삭제하시겠습니까?` → `삭제할까요?`, `해지하시면` → `해지하면`, `비밀번호를 잊으셨나요?` → `비밀번호를 잊었나요?`
- 부탁 · 권유는 `~해주세요` · `~해보세요` 로 공손하게 한다.
- 사용자의 이름을 부를 때는 소리 내어 읽어 보고 정한다.

#### 쉬운 말

- 익숙한 단어를 쓴다 — 한자어 · 기술 용어는 풀어 쓴다(`삭제 불가` → `삭제할 수 없어요`, `처리` 대신 구체적인 동작).
- 숫자는 아라비아 숫자로 쓴다(`1개`). `한 번 더` 같은 관용 표현은 그대로 둔다.
- 줄임말 · 은어 · 유행어를 쓰지 않는다.
- 기능의 이름보다 목적을, 데이터의 변화보다 사용자의 행동을 쓴다 — `작성을 완료했어요` 대신 `메모를 저장했어요.`
- 같은 내용이면 긍정문 · 능동문으로 쓴다. 피동이 뜻을 더 잘 전하면 피동도 괜찮다.
- 한 문장에는 한 목적만 — 길어지면 나눈다.
- 영어 · 숫자 뒤 조사는 붙인다 — `CSV로` · `AltStore를`.

#### 오류

- 무엇이 안 됐는지, 알면 왜, 그리고 어떻게 고치는지를 쓴다 — `삭제하지 못했어요. 잠시 후 다시 시도해주세요.`
- "~하지 못했어요" 로 쓰고, `실패` 명사로 끝내지 않는다(`삭제 실패` 로 쓰지 않는다).
- 서버 코드 · enum(`MONTHLY`) · 영어 용어(`redirect_uri`)를 화면에 내지 않는다 — 서버가 준 문구를 그대로 보이지 말고 화면 문구로 바꾼다.

#### 문장 부호

- 문장(평서문 · 명령문)은 하나여도 마침표로 끝낸다 — `저장했어요.` · `제목을 입력해주세요.`
- 마침표를 쓰지 않는 자리 — 제목, 20px(`text-t7`) 이상 큰 글자, 버튼 · 메뉴 · 라벨.
- 버튼 문장에 `네` · `아니요` 가 있으면 쉼표를 넣는다 — `네, 삭제할게요`
- 느낌표는 꼭 필요한 순간에만 쓴다(Voice and Tone).
- 줄임표는 `…` 한 글자로 쓴다 — `불러오는 중…`

#### 띄어쓰기

- 기능 · 서비스 · 상태 이름 자체는 붙여 쓴다 — 배지 · 칸반 열 · 탭 · 메뉴의 `진행중` · `예약중` · `할일`.
- 문장 속의 뜻은 띄운다 — `진행 중인 일` · `할 일을 적어주세요.` · `불러오는 중…`
- 보조 용언은 붙인다 — `해주세요` · `해보세요` · `지워주세요`.

## Shapes

### v99 — SEED 모서리 스케일 (2026-09-29)

당근 SEED 의 radius 스케일을 그대로 들인다 — 2px ~ 24px 10단계와 `full`, 이름도 SEED 와 같다(`r1` = 4px). 지금까지의 7단계(`xs` 2 · `sm` 4 · `md` 8 · `lg` 12 · `xl` 16 · `2xl` 20 · `full`)는 모두 이 눈금 위라 값이 바뀌지 않고, 옮기는 동안 같은 값의 별칭으로 남는다. 새로 생긴 값은 6 · 10 · 14 · 24px 이다.

| 토큰 | 값 | 옛 이름(별칭) |
|---|---|---|
| `radius-r0_5` | 2px | `radius-xs` |
| `radius-r1` | 4px | `radius-sm` |
| `radius-r1_5` | 6px | — |
| `radius-r2` | 8px | `radius-md` |
| `radius-r2_5` | 10px | — |
| `radius-r3` | 12px | `radius-lg` |
| `radius-r3_5` | 14px | — |
| `radius-r4` | 16px | `radius-xl` |
| `radius-r5` | 20px | `radius-2xl` |
| `radius-r6` | 24px | — |
| `radius-full` | 9999px | `radius-full`(같은 이름) |

- 이번에는 **토큰만** 넓힌다. 컴포넌트마다 어느 모서리를 쓸지는 2단계에서 SEED 의 해당 컴포넌트와 하나씩 비교해 정한다 — SEED 는 porest 보다 둥글다(버튼 · 입력칸 8 ↔ porest 4, 대화상자 20 ↔ 12, 말풍선 12 ↔ 2). 그때까지 아래 v83 매핑(토스 톤)이 지금 값이다.
- 새로 쓰는 모서리는 SEED 이름으로 적는다. 옛 이름은 컴포넌트 스펙 · 제품이 다 옮기면 걷는다.
- 사용자 결정(2026-09-29 — 모서리 A: 토큰만 넓히고 컴포넌트는 하나씩). 이름 방식은 v98 간격과 같은 원칙이다 — 6 · 10 · 14 · 24 를 크기 이름(xs · sm …) 사이에 끼울 이름이 없다.

### v6 추가 — 5단계 라운드 스케일 (v99 에서 SEED 스케일로 바뀜 — 아래는 기록)

`sm/md/lg/xl`는 spacing 베이스(4px)와 정렬된 4px 배수, `full`은 완전 라운드(알약·원형) 관용값입니다.

| 토큰 | 값 | 주 용도 |
|---|---|---|
| `sm` | 4px | 칩·태그·작은 뱃지 |
| `md` | 8px | 버튼·입력 필드 default |
| `lg` | 12px | 카드 default |
| `xl` | 16px | 모달·큰 카드·시트 |
| `full` | 9999px | 알약 버튼·아바타·원형 아이콘 버튼 |

#### 추가 이유
1. v1~v5에서 색상·표면·텍스트·외곽선·간격·타이포가 모두 정의됐으나 컴포넌트 모서리 처리 의사결정이 미완 — 버튼·카드·모달 스펙 작성의 마지막 차단 요소.
2. `full` 포함 5단계는 80% 컴포넌트 사용 사례 커버. `2xl(24px+)`는 hero/major 사용 사례 등장 시 추가.
3. spacing과 동일한 4px 배수 베이스 — radius와 padding이 동일 리듬을 유지해 시각 정합성 확보.

#### WCAG 검증
- **1.4.3 / 1.4.11 색상 대비**: 비대상 (치수 토큰).
- **1.4.12 Text Spacing**: 비대상.
- **2.5.5 Target Size (44×44 AAA / 24×24 AA)**: rounded는 hit-area에 직접 영향 없음. 단, `full`을 작은 아이콘 버튼에 적용 시 padding(`md(12px)`+) 또는 `min-width: 44px`로 별도 확보 필요 — 토큰 자체가 target size를 보장하지 않음을 컴포넌트 스펙에 명시.

#### HR / Desk 듀얼 브랜드
- 모든 rounded 토큰은 brand-neutral — 양 브랜드 동일.
- 브랜드 톤 분기는 적용 강도로 처리: HR(B2B 절제) `md`/`lg` 위주, Desk(B2C 친근) `lg`/`xl` 위주. 토큰 분기 불필요.

### v83 추가 — 컴포넌트 ↔ radius 매핑 (Toss 톤)

토큰 스케일만으로는 컴포넌트별 일관성이 보장되지 않음 — "button과 input의 radius가 같은가" 같은 의사결정을 매번 반복하지 않도록, 컴포넌트마다 어떤 radius 토큰을 쓸지 spec으로 명시. **Toss 톤** 채택 — 절제된 4px 위주(컴포넌트 80% 이상), 컨테이너만 8px, 모서리 강조용 작은 라운드(`xs` 2px) + 알약(`full`) 분기.

| 컴포넌트 | radius | 값 | 비고 |
|---|---|---|---|
| **Form / Action** | | | |
| `button` | `r2` · `r3` · `full` | 8px · 12px · 9999px | small · medium 8, large 12, xsmall 알약 — 2026-09-30 SEED Action Button 구조(v112, `specs/components/button.yaml`) |
| `floating-action-button` | `full` | 9999px | 원 56 — 2026-10-04 SEED Floating Action Button(`floating-action-button.yaml`) |
| `input` / `textarea` | `r3` · `r2` | 12px · 8px | large · medium — 2026-10-01 SEED Text Input · Textarea(`specs/components/input.yaml` · `textarea.yaml`) |
| `select` 트리거 · Input Button | `r3` · `r2` | 12px · 8px | Input 과 같다 — 2026-10-01 SEED Select · Input Button(`select.yaml` · `input-button.yaml`) |
| `select` 목록 | `r5` | 20px | 칸 아래 뜨는 목록 |
| `select-box` | `r3` | 12px | 2026-09-30 SEED Select Box(`select-box.yaml`) |
| `slider` (트랙 · 손잡이 · 말풍선) | `full` · `r1_5` | 9999px · 6px | 트랙 · 손잡이는 원, 끄는 동안 뜨는 말풍선은 6 — 2026-10-09 SEED Slider(`slider.yaml`) |
| `toggle` (아이콘 단추) | `r2` | 8px | 누름 · 호버 바탕에만 보인다 — 2026-10-09(`toggle.yaml`). Toggle Group 은 걷었다 |
| 인증 코드 칸(Input OTP) | `r3` · `r2` | 12px · 8px | Input 한 칸 — large · medium, Input 과 같다. 2026-10-09(`input-otp.yaml`) |
| `color-swatch` (색 칸 · 고른 고리) | `full` | 9999px | 원 40 — 2026-10-09(`color-swatch.yaml`) |
| `icon-picker` (칸) | `r3` | 12px | 칸 48 — 2026-10-09(`icon-picker.yaml`). 트리거는 Input Button |
| `quantity-picker` (상자 · 버튼) | `r2` · `r3` | 8px · 12px | small · medium 8, large 12 — 버튼의 누름 바탕도 같은 모서리. 2026-10-15 SEED Quantity Picker(`quantity-picker.yaml`) |
| `attachment-input` (타일 · 항목 · 드롭존 · ×) | `r3` · `r2` · `full` | 12px · 8px · 9999px | 첨부 타일 · 사진 · 파일 카드 · 드롭존 12, 파일 카드의 썸네일 칸 8, × 는 원 — 2026-10-15 SEED Attachment Input(`attachment-input.yaml`) |
| `chip` | `full` | 9999px | 알약 — 2026-10-02 SEED Chip(`specs/components/chip.yaml`) |
| `checkbox` (칸) | `r1` | 4px | SEED Checkmark(2026-09-30, `specs/components/checkbox.yaml`). 이 표는 2px 이었지만 스펙 · 코드는 4px 이었다 |
| `radio-group` (동그라미 · 점) | `full` | 9999px | 원형 — SEED Radiomark(2026-09-30, `specs/components/radio-group.yaml`) |
| `switch` (track + thumb) | `full` | 9999px | 알약 |
| `list` 줄 바탕 · 타일 | `r2_5` · `r3` | 10px · 12px | 누르면 들어오는 바탕 · 앞 타일 — 카드 안 바탕은 동심 모서리(itemRadius). 2026-09-30 SEED List(`list.yaml`) |
| **Display** | | | |
| `badge` | `r1` · `r1_5` | 4px · 6px | medium · large — 둥근 사각(알약은 누르는 Chip). 2026-10-03 SEED Badge(`badge.yaml`) |
| `notification-badge` | `full` | 9999px | 점 · 숫자 알약 — 2026-10-03 SEED Notification Badge(`notification-badge.yaml`) |
| `avatar` | `full` | 9999px | 원 하나(사각 변형을 걷었다) — 2026-10-03 SEED Avatar(`avatar.yaml`) |
| `card` | `r4` | 16px | 바닥 위 흰 면 + 1px 테두리 · 그림자 없음 — 카드 안 목록의 누름 바탕은 동심 10. 순자산 카드도 같다 — 2026-10-08 SEED 면(`card.yaml`) |
| `callout` | `r2_5` | 10px | 본문 안 안내 상자 — 2026-10-02 SEED Callout(`callout.yaml`) |
| `page-banner` | — | 0 | 화면 폭 띠, 모서리 없음 — 2026-10-02 SEED Page Banner(`page-banner.yaml`) |
| `progress` (트랙 · 채움) | `full` | 9999px | 막대 8 — 2026-10-03(`progress.yaml`) |
| `progress-circle` | — | — | 원(SVG) · 끝이 둥근 호 — 2026-10-03 SEED Progress Circle(`progress-circle.yaml`) |
| `skeleton` | `r1` · `r1_5` · `r2` · `r3` · `r4` · `full` · — | 4px · 6px · 8px · 12px · 16px · 9999px · 0 | 글 8(기본) · 그림 자리는 Image Frame 대로 4 · 6 · 8 · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0 — 2026-10-03 SEED Skeleton · 그림 자리 2026-10-04(`skeleton.yaml`) |
| `content-placeholder` | — | 0 | 제 모서리 없음 — 담는 틀이 자른다. 2026-10-03 SEED Content Placeholder(`content-placeholder.yaml`) |
| `image-frame` | `r1` · `r1_5` · `r2` · — | 4px · 6px · 8px · 0 | 폭으로 — 24 이하 · 48 이하 · 그 위 · 화면 폭. 스켈레톤 · 대체 그림 · 카드 면도 같다 — 2026-10-04 SEED Image Frame(`image-frame.yaml` · `card-art.yaml`) |
| `logo-tile` | `r2_5` · `r3` · `r3_5` | 10px · 12px · 14px | 32 · 40 · 48 — 크기 × 0.3(List 타일과 같다) — 2026-10-04(`logo-tile.yaml`) |
| `aspect-ratio` | — | 0 | 비율 상자만 — 둥근 그림 틀은 Image Frame. 2026-10-04 SEED Aspect Ratio(`aspect-ratio.yaml`). Carousel 은 걷었다 |
| divider(옛 `separator`) | — | — | 1px 선, 모서리 무관 — 2026-10-03 SEED Divider(`divider.yaml`) |
| `scroll-area` (스크롤바 막대) | `full` | 9999px | 6px 알약 — 2026-10-10(`scroll-area.yaml`) |
| `resizable` (손잡이 표시 · 위젯 자리표시) | `r0_5` · `r4` | 2px · 16px | 손잡이 표시 4 × 24 · 자리표시는 위젯(Card 면)과 같다 — 2026-10-10(`resizable.yaml`) |
| `scroll-fog` | — | — | 마스크(모양 없음) — 2026-10-03 SEED Scroll Fog(`scroll-fog.yaml`) |
| `typography` | — | — | 텍스트, radius 무관 |
| **Overlay** | | | |
| `dialog` / `alert-dialog` | `r5` | 20px | 2026-10-02 SEED Dialog · Alert Dialog(`dialog.yaml` · `alert-dialog.yaml`) |
| `bottom-sheet` (위 모서리) | `r6` | 24px | 위 두 모서리만 — 2026-10-02 SEED Bottom Sheet(`bottom-sheet.yaml`) |
| `menu-sheet` (위 모서리 · 묶음) | `r5` · `r4` | 20px · 16px | 2026-10-02 SEED Menu Sheet(`menu-sheet.yaml`) |
| `side-panel` | — | 0 | 평평 — 높이 전체 · 모서리 없음. 2026-10-04 SEED Side Panel(`side-panel.yaml`), 옛 `sheet` 를 대신 |
| `popover` · `menu` | `r5` | 20px | 떠 있는 표면 — 2026-10-02 SEED Popover · Menu(`popover.yaml` · `menu.yaml`). 메뉴 줄의 알약은 `r3` 12px |
| `help-bubble` · `tooltip` | `r3` | 12px | 말풍선 — 2026-10-02 SEED Help Bubble(`help-bubble.yaml`) |
| `snackbar` | `r2` | 8px | 2026-10-02 SEED Snackbar(`snackbar.yaml`) |
| **Navigation** | | | |
| `tabs` (Line) | — | 0 | 각진 막대 — 2026-10-02 SEED Tabs(`tabs.yaml`). Chip Tabs 는 `chip` |
| `segmented-control` (트랙 · 알약) | `full` | 9999px | 2026-10-02 SEED Segmented Control(`segmented-control.yaml`) |
| `menu` 줄 바탕(알약) | `r3` | 12px | 좌우 8 들인 알약 — 표면은 위 Overlay 의 `menu` |
| `pagination` 칸 · `table-pagination` 화살표 | `r2` | 8px | 칸 40 — 지금 쪽 채움 · 누를 때 바탕. 2026-10-04 SEED Pagination(`pagination.yaml` · `table-pagination.yaml`) |
| `top-navigation` 아이콘 · 글 버튼 | `r2` | 8px | 누를 때만 보이는 바탕 — 바 자체는 모서리 없음. 2026-10-04 SEED Top Navigation(`top-navigation.yaml`) |
| `bottom-navigation` 바 · 가운데 + | `full` | 9999px | 떠 있는 알약 · 원 44 — 2026-10-04(`bottom-navigation.yaml`) |
| `side-navigation` 항목 · 펼침 메뉴 | `r2_5` · `r5` | 10px · 20px | 항목 바탕 10 · 펼침 메뉴는 Menu 와 같은 20(줄 알약 12) — 2026-10-04 SEED Side Navigation(`side-navigation.yaml`). breadcrumb · navigation-menu 는 걷었다 |
| **Disclosure** | | | |
| `accordion` · `collapsible` (separated 면 · 누름 바탕) | `r4` · `r2_5` | 16px · 10px | separated · 카드 면은 Card 16, 트리거의 누름 바탕은 10(동심) · 모두 펼치기 8 — 2026-10-10 SEED Accordion(`accordion.yaml` · `collapsible.yaml`) |
| `tree-view` 줄 · List 하위 줄 꺾쇠 단추 | `r2_5` | 10px | 줄 바탕 · 포커스 링 · 꺾쇠 단추 — Side Navigation 항목과 같다. 2026-10-10(`tree-view.yaml` · `list.yaml`) |
| **Data** | | | |
| `date-picker` 날짜 원 · 기간 띠 | `full` · — | 9999px · 0 | 원 42 · 띠는 줄 끝에서 각지게 끊는다 — 2026-10-03 SEED Date Picker(`date-picker.yaml`) |
| `wheel-picker` 선택 띠 | `r2` | 8px | 2026-10-03 SEED Wheel Picker(`wheel-picker.yaml`) — Time Picker · 연 · 월 휠 |
| `table` | — · `r3` | 0 · 12px | 표는 모서리 없이 카드 안에 붙는다 · 일괄 작업 바 12 — 2026-10-08(`table.yaml`) |
| `chart` | `r3` · `r1` | 12px · 4px | 툴팁 · 지표 타일 12 · 막대 위 · 열지도 칸 4 — 2026-10-08(`chart.yaml`) |
| `searchable-list` | — | — | 줄은 List · 검색칸은 Input 그대로 — 2026-10-08(`searchable-list.yaml`) |
| `swipe-actions` 배지 | `full` | 9999px | 원형 배지 36 — 2026-10-08(`swipe-actions.yaml`) |
| `footer` 링크 포커스 링 | `r1` | 4px | 바닥 자체는 모서리 없음 — 2026-10-15 SEED Footer(`footer.yaml`) |

#### Toss 톤 vs Material/shadcn 표준 비교
- **shadcn 표준**: button/input `md` 8px, card `lg` 12px, modal `lg` 12px (부드럽고 친근한 톤)
- **Material**: button `xs` 4px, card `md` 8px (절제 + 직사각 강조)
- **Toss (채택)**: button/input `sm` 4px, card `md` 8px, modal `md` 8px — 두 톤 사이 절충, 한국어 UI에 익숙한 절제. 지금은 위 표가 컴포넌트마다 SEED 값으로 바뀌었다(카드 16 — 2026-10-08)

#### 사용 가이드
1. 새 컴포넌트 작성 시 위 표를 먼저 참조 — 임의 결정 금지.
2. 표에 없는 컴포넌트는 가장 가까운 카테고리(Form/Display/Overlay/Nav)의 톤을 따름.
3. **className은 토큰명을 인용**: `rounded-sm` (Tailwind utility), `border-radius: var(--radius-sm)` (직접 CSS) — 픽셀 값 하드코딩 금지.
4. brand 분기 없음 — HR/Desk 양쪽 동일 매핑.

#### 자동 검증 미적용
컴포넌트별 radius 매핑은 prose-spec — design.md spec이 component → radius 자동 검증을 미지원. 매핑 위반은 시각 검토 + 코드 리뷰로 감지.

## Components

이 파일(`DESIGN.md`)은 brand-agnostic 공유 baseline이라 컴포넌트 스펙은 brand 파일(`DESIGN.hr.md` / `DESIGN.desk.md`)에 작성합니다 — `primary` 등 brand 토큰을 직접 참조해야 자연스러운 표현이 되기 때문(spec이 cross-file `{colors.X}` reference 미지원).

본 파일에서는 brand-neutral 컴포넌트(divider, page text, caption, chart color 등 — 공유 토큰만 사용)만 정의하고, brand-specific 컴포넌트(Button, Focus ring 등)는 brand 파일에서 자체 prose로 작성합니다.

### Button

수치 · 규칙의 원본은 `specs/components/button.md` · `specs/components/button.yaml` 이다 — 2026-09-30 SEED Action Button 구조로 다시 썼다(v112). 이 절은 토큰과 닿는 자리만 모은다.

#### 변형과 색

| 변형 | 쓰는 곳 | 바탕 → 누름 · 호버 | 글자 · 아이콘 |
|---|---|---|---|
| brandSolid | 서비스 핵심 액션 하나(Desk 거래 추가 · HR 휴가 신청) | 브랜드 채움 → 브랜드 누름(브랜드 파일) | `static-white` |
| neutralSolid (기본) | 대부분의 CTA — 저장 · 확인 · 다음 | `bg-neutral-inverted` → `bg-neutral-inverted-pressed` | `fg-neutral-inverted` |
| neutralWeak | CTA 옆 보조(취소) · CTA 를 뺀 대부분의 액션 | `bg-neutral-weak` → `bg-neutral-weak-pressed` | `fg-neutral` |
| criticalSolid | 되돌릴 수 없는 작업의 확정(주로 Alert Dialog) | `bg-critical-solid` → `bg-critical-solid-pressed` | `static-white` |
| brandOutline | Solid 보다 낮은 위계 — neutralOutline 과 짝 | 투명 + `stroke-neutral-weak` 1px → `bg-layer-default-pressed` | 브랜드 글자(브랜드 파일) |
| neutralOutline | 가장 낮은 위계의 보조 액션 | 투명 + `stroke-neutral-weak` 1px → `bg-layer-default-pressed` | `fg-neutral` |
| ghost | 메뉴 · 툴바 · 목록의 가벼운 액션 | 투명 → `bg-layer-default-pressed` | `fg-neutral` · `fg-neutral-subtle` · 브랜드 글자 · `fg-critical` |

브랜드마다 달라지는 건 브랜드 채움 · 누름과 브랜드 글자뿐이다 — 값과 대비는 `DESIGN.hr.md` · `DESIGN.desk.md` 의 Button 절. 한 화면의 Solid 버튼은 하나, 확인 창을 여는 삭제는 ghost + `fg-critical` 이다.

대비(라이트 · 다크, 글자 × 바탕):

| 조합 | 라이트 | 다크 |
|---|---|---|
| neutralSolid | 16.41:1 | 13.42:1 |
| neutralSolid 누름 | 7.11:1 | 7.70:1 |
| neutralWeak | 15.20:1 | 10.32:1 |
| criticalSolid | 5.06:1 | 5.77:1 |
| ghost `fg-neutral-subtle` × `bg-layer-default` | 5.50:1 | 6.09:1 |
| ghost `fg-critical` × `bg-layer-default` | 5.06:1 | 6.08:1 |

모두 본문 4.5:1 을 넘는다. Outline 테두리(`stroke-neutral-weak` × `bg-layer-default` 1.23:1)는 글자가 버튼을 알려 주므로 1.4.11 대상이 아니다 — SEED 도 같다.

#### 상태

| 상태 | 표현 |
|---|---|
| hovered | 누름 색(v106) — 마우스 기기에서만, 축소는 없다 |
| pressed | 누름 색 + 세로 2px 거리 축소(v104 — Motion 의 눌림 피드백). 축소는 `motion-duration-pressed-scale` · `motion-ease-pressed-scale`, 색은 `motion-duration-color-transition` · `motion-ease-easing` |
| focused | `stroke-focus-ring` 2px · 띄움 2px(v106) — 키보드 포커스(`focus-visible`)에만 |
| loading | 누름 색 위 로딩 원(Outline 은 투명 그대로), 라벨 자리 폭 유지 · 누르기를 막고 `aria-busy="true"` |
| disabled | `bg-disabled` · `fg-disabled`(2.93:1 — 1.4.3 incidental 예외). 불투명도로 흐리게 하지 않는다(v106) |

#### 크기

| 크기 | 높이 | 좌우 여백 | 글자 | 모서리 | 아이콘 |
|---|---|---|---|---|---|
| xsmall | 32px | `spacing-x3_5` (14px) | t3 13px | `radius-full` (알약) | 14px |
| small | 36px | `spacing-x3_5` (14px) | t4 14px | `radius-r2` (8px) | 14px |
| medium (기본) | 40px | `spacing-x4` (16px) | t4 14px | `radius-r2` (8px) | 16px |
| large | 48px | `spacing-x5` (20px) | t6 18px | `radius-r3` (12px) | 22px |

글자 굵기는 모두 700. 아이콘만 있는 버튼은 정사각(높이 = 폭)이다. 크기는 이름이 아니라 높이로 고른다 — 모달 footer 는 small, 모바일 하단 CTA 는 large.

#### 누르는 영역 · 배치

- 누르는 영역은 보이는 크기와 따로 44 × 44 까지 넓힌다(v106) — 2.5.5 (AAA 44 × 44) 충족.
- 2.5.8 (AA 24 × 24) 은 모든 크기가 충족한다.
- 나란히 두는 버튼 사이는 8px, 셋까지. 화면 하단에 채운 두 버튼(닫기 · CTA)은 3:7 — 모달 footer 는 Dialog · Drawer 의 폭 나누기(지금은 균등)를 따른다.

#### Accessibility 체크리스트
- [ ] keyboard: `Enter` / `Space` 로 누르고 `Tab` 으로 포커스가 들어온다
- [ ] 아이콘만 있는 버튼은 `aria-label` 필수
- [ ] 로딩은 `aria-busy="true"` — 포커스는 그대로 두고 누르기만 막는다
- [ ] 비활성: `aria-disabled="true"` 는 포커스가 남고, `disabled` 속성은 포커스를 뺀다 — 흐름에 맞춰 고른다

### Input · Textarea

수치 · 규칙의 원본은 `specs/components/input.md` · `input.yaml`(한 줄 — SEED Text Input)과 `textarea.md` · `textarea.yaml`(여러 줄)이다 — 2026-10-01 SEED Text Input · Textarea 구조로 다시 썼다. 라벨 · 설명 · 오류 · 글자 수는 Field(아래 Field 절)가 둘레에서 그린다. 이 절은 토큰과 닿는 자리만 모은다.

#### 모양과 색

| 요소 | 값 |
|---|---|
| 바탕 | 투명 — 놓인 표면(`bg-layer-default` · `bg-layer-floating`)이 비친다 |
| 테두리 | 안쪽 1px `stroke-neutral-weak`. 밑줄형은 아래만 |
| 포커스 | 안쪽에 2px `stroke-neutral-contrast` 를 덧그린다 — 마우스 · 터치로 눌러도(입력 중). 내용은 밀리지 않는다. 읽기 전용이면 없다 |
| 오류 | 안쪽 2px `stroke-critical-solid` — 포커스해도 그대로 |
| 비활성 | 바탕 `bg-disabled` · 글자 · 아이콘 `fg-disabled`. 불투명도로 흐리게 하지 않는다(v106) |
| 읽기 전용 | 바탕 `bg-disabled` · 값은 `fg-neutral` 그대로(밑줄형은 바탕 없이 값 `fg-neutral-muted`) |
| 값 · placeholder | `fg-neutral` · `fg-placeholder` |
| 앞 · 뒤 글자 · 아이콘 · 지우기 | `fg-neutral-subtle` · `fg-neutral-muted` · `fg-neutral-subtle` |

덧그린 2px 의 색만 `motion-duration-d2` (100ms) · `motion-ease-easing` 로 바뀐다 — 두께는 바로 바뀐다(SEED).

대비(라이트 · 다크, `bg-layer-default` 위): 값 16.41 · 13.42, 앞뒤 글자 5.50 · 6.09, placeholder 4.18 · 4.13(v119 — 4.5:1 밑, 사용자 결정 2026-10-16 글자 역할 D7), 포커스 테두리 16.41 · 13.42, 오류 테두리 5.06 · 6.08. 1px `stroke-neutral-weak`(1.23 · 1.56)는 칸을 알리는 유일한 표시가 아니다 — 라벨 · placeholder 가 함께 알린다(SEED 와 같다). lint 대비 쌍 `input-light` · `input-dark`(본문 × `surface-input`)는 읽기 전용 칸(값 × `bg-disabled` — 같은 색)을 잰다.

#### 크기

| 크기 | 높이 | 좌우 여백 | 글자 | 모서리 | 아이콘 · 지우기 |
|---|---|---|---|---|---|
| large | 52px | `spacing-x4` (16px) | `t5` 16px | `radius-r3` (12px) | 20 · 22 |
| medium | 40px | `spacing-x3_5` (14px) | `t4` 14px | `radius-r2` (8px) | 16 · 18 |
| underline large | 40px(위아래 8) | 0 | `t6` 18px | 0 | 24 · 22 |
| underline medium | 34px(위아래 6) | 0 | `t5` 16px | 0 | 20 · 18 |

- 웹의 기본은 반응형 — 1280 미만 large, 이상 medium(SEED `lg`). 앱은 늘 large. medium 은 데스크톱 웹(마우스)에서만 — 폰에서 40 은 누르는 영역 44(AAA)에 못 미친다. 한 폼 안에서 크기를 섞지 않는다.
- Textarea 는 상자형 하나 — 자동 높이 3줄(large 94 · medium 82, 위아래 14 · 12)에서 쓴 만큼 자라고, 끄면 2줄(72 · 62) 이상 고정 높이에서 칸 안 스크롤. 손잡이(resize)는 두지 않는다.

#### 쓰는 규칙

- 밑줄형은 화면에 입력이 하나뿐일 때(금액을 먼저 받는 화면 · 목록 위 검색 · 초대 코드 · 잠금 해제).
- 단위는 칸 안 뒤 글자로 — 라벨에 "(원)" 을 붙이지 않는다. 금액은 숫자 키보드 · 천 단위 쉼표, `type="number"` 는 쓰지 않는다.
- 고르는 값(날짜 · 시각 · 카테고리 · 자산)은 타이핑으로 받지 않는다 — Input Button 으로 시트 · 달력 · 목록을 연다.
- 형식이 정해진 값(전화번호 · 주민등록번호)은 칸을 나누지 않는다 — 한 칸에서 형식을 맞춰 준다.
- 지우기 버튼은 검색칸 · 선택 사항인 칸에, 값이 있을 때만(이름 "지우기").

#### Accessibility 체크리스트
- [ ] 모든 칸에 라벨(Field) — placeholder 를 이름으로 쓰지 않는다
- [ ] 오류면 `aria-invalid`, 설명 · 오류 · 글자 수 · 단위 글자는 `aria-describedby`
- [ ] 포커스하면 테두리가 2px 로 짙어진다(키보드 · 마우스 모두)
- [ ] 최대 글자 수는 자소 단위로 세고, 한글은 조합이 끝난 뒤 자른다

### Select · Input Button

수치 · 규칙의 원본은 `specs/components/select.md` · `select.yaml`(짧은 선택지를 칸 아래 목록으로 — SEED Select)과 `input-button.md` · `input-button.yaml`(입력칸 모양의 버튼 — 시트 · 팝오버를 연다, SEED Input Button)이다 — 2026-10-01 사용자 결정. 라벨 · 설명 · 오류는 Field(아래 Field 절)가 둘레에서 그린다. 이 절은 토큰과 닿는 자리만 모은다.

#### 나누기

| 이런 자리 | 컴포넌트 |
|---|---|
| 짧은 선택지 5개 이상(한 줄 설명까지)에서 폼 값을 고른다 | Select — 칸 아래 목록. 폰에서도 시트로 바꾸지 않는다 |
| 달력 · 시각 · 아이콘 격자 · 검색해 고르는 긴 목록 | Input Button — 1280 미만 아래 시트 · 이상 칸 아래 팝오버 |
| 설명 · 그림 · 딸린 입력이 붙는 2 ~ 6개를 견줘 고른다 | Select Box |
| 2 ~ 4개 짧은 선택지 | Chip — 글이 길면 Radio · Checkbox |

#### 트리거 · 칸

상자는 Input 의 상자형과 같다 — large 52 · medium 40 · 웹 기본 반응형(1280), 앱은 large. 모서리 `radius-r3` · `radius-r2`, 투명 바탕 + 안쪽 1px `stroke-neutral-weak`, 오류 안쪽 2px `stroke-critical-solid`, 비활성 · 읽기 전용 `bg-disabled`(흐림 없음 — 읽기 전용의 값은 진한 글자). 버튼이라 Input 과 다른 자리:

| 요소 | 값 |
|---|---|
| 누름 · 호버 | 바탕 `bg-layer-default-pressed` + 값 · 아이콘만 2px 거리 축소(v104). 마우스는 호버에 같은 바탕 |
| 포커스 | 키보드 포커스에만 바깥 링 2px · 띄움 2px `stroke-focus-ring` |
| 셰브론(Select) | 20 · 16 `fg-neutral-muted`, 열리면 180°(열 때 `motion-duration-d3` · 닫을 때 `motion-duration-d2`) |
| 뒤 아이콘(Input Button) | 무엇이 열리는지 — 달력 · 시계 · 아래 화살표 |
| 지우기(Input Button) | 선택 사항인 칸에 값이 있을 때만, 22 · 18 `fg-neutral-subtle` — 값 뒤 · 뒤 붙이개 앞 |

#### 목록(Select)

| 요소 | 값 |
|---|---|
| 목록 | 트리거 폭 · 아래 8(모자라면 위) · 모서리 `radius-r5` · `bg-layer-floating` · `shadow-s3` · 위아래 8 · 높이 min(480, 남은 화면 — 200 은 둔다) |
| 선택지 | large 46 · medium 39(설명이 있으면 66 · 57) · 좌우 16, 글 `t5` · `t4` `fg-neutral`, 설명 `t3` · `t2` `fg-neutral-subtle` |
| 고른 표시 | 오른쪽 체크 14 · 12(선 2.5) `fg-neutral` — 바탕 · 굵기는 바꾸지 않는다 |
| 누름 · 호버 · 키보드 위치 | 좌우 8 들인 알약(모서리 12) `bg-layer-floating-pressed` — 누르는 동안만 콘텐츠 2px 거리 축소 |
| 묶음 | 제목 `t4` 500 · `t3` 400 `fg-neutral-subtle`, 묶음 사이 1px `stroke-neutral-subtle`(좌우 16 들임 — 8 + 1 + 8) |
| 모션 | 열 때 `motion-duration-d3` · `motion-ease-enter`(0.95 → 1 · 투명 → 불투명), 닫을 때 `motion-duration-d2` · `motion-ease-exit` |

#### 쓰는 규칙

- 늘 Field 의 라벨과 함께. placeholder 는 "{값의 종류} 선택".
- "없음" 이 답이면 "{칸 이름} 없음" 선택지를 맨 앞 따로 묶음에 — Select 에는 지우기 버튼이 없다. 꼭 골라야 하는 칸은 없음 없이 제출 때 오류, 늘 값이 있는 칸은 기본값을 골라 둔다.
- 여럿 고르기는 열린 채 이어 고른다 — 칸에는 "식비, 교통", 넘치면 "식비 외 2개". 최대 개수는 Field 설명에, "전체 선택" 같은 선택지는 두지 않는다.
- 선택지 글은 명사형으로 짧게 — 코드값(Y · N · ANNUAL)을 내지 않는다. 폼 값을 탭으로 고르지 않는다. 요일 7개도 여럿 고르는 Select.
- Input Button 은 혼자 쓰지 않는다 — 늘 고르는 자리를 연다. 달력 · 시각은 "완료" 로 넣고(고르는 동안 칸의 값은 그대로), 목록은 누르면 바로 넣는다. 긴 목록은 검색 시트(Combobox 를 두지 않는다).

#### Accessibility 체크리스트
- [ ] 모든 칸에 라벨(Field) — placeholder 를 이름으로 쓰지 않는다. 라벨을 누르면 포커스만(열지 않는다)
- [ ] Select 트리거 `role="combobox"` · `aria-expanded`, 목록 `role="listbox"` · 선택지 `role="option" aria-selected` · 짚은 선택지 `aria-activedescendant`
- [ ] Input Button 이름은 라벨 + 고른 값, `aria-haspopup="dialog"` · `aria-expanded`, 필수는 설명으로 "필수"
- [ ] 키보드 포커스 링 — 트리거 · 칸
- [ ] large 52 · 선택지 46 은 AAA 44 ✓, medium 은 1280 이상 데스크톱(마우스)에서만

### Card

> 2026-10-08 — 원본은 [`specs/components/card.md`](specs/components/card.md) · `card.yaml`(SEED 면 · Feedback). 옛 변형 넷(default · interactive · outline · flat) · 여백 네 단계 · 모서리 8 · hover 그림자 상승은 걷었다.

회색 바닥(`bg-layer-basement`) 위 흰 면(`bg-layer-default`) + 1px `stroke-neutral-weak`, 그림자 없음 — 폰 · 데스크톱 · 라이트 · 다크가 같은 규칙이다(사용자 결정 — 데이터 표시 비교 페이지 4A · 5A · 6B · 7A · 8B).

| 자리 | 값 |
|---|---|
| 모서리 | 16(`radius-r4`) — 카드 안 목록의 누름 바탕은 10(동심 모서리) |
| 여백 | 24(`spacing-x6`) — 폭과 상관없이. List 줄 · Bottom Sheet 와 같은 값이다(카드 24 = 줄 24 = 시트 24). 목록 카드는 좌우 0 — 줄이 제 좌우 24 를 갖고, 머리 위 · 좌우 24, 카드 아래 12(줄 12 와 합쳐 24) |
| 카드 사이 | 위아래로 쌓으면 8(`spacing-x2` — SEED "8px Gap"), 데스크톱 격자 칸 사이는 `layout-gutter` 24 |
| 머리 | 제목 16 / 22 · 700 · `fg-neutral` + 오른쪽 동작 하나("전체 보기" — 글 버튼: 14 · 700 · `fg-neutral-muted` · 보이는 36 · 꺾쇠 없음, 누르는 영역 44. Typography 의 "글자 역할" R16 — 2026-10-16 사용자 결정 D2 로 6B 의 14 · 500 · subtle + 꺾쇠를 바꿨다) |
| 누름 | 면 `bg-layer-default-pressed` + 2px 거리 축소 — 안에 대등한 동작이 있으면 색만(SEED Feedback). 그림자 상승 · 위로 뜨기 없음 |
| 지표 카드 | 라벨 13 · 500 · `fg-neutral-subtle` · 숫자 24(데스크톱 격자에 셋 · 넷씩이면 20) · 700 · 고정폭 숫자 · 증감 줄(Colors 의 "증감 — 방향 색") — 폰은 한 줄에 하나, 숫자 굴림 애니메이션 없음 |
| 순자산 카드 | Desk 홈 · 자산 한 자리 — 브랜드 채움 135° + 흰 글자, 다크도 짙은 채움 · 증감도 흰 ▲ · ▼(Desk 파일의 Card 절) |
| 카드 안 아코디언 | 카드 상세의 혜택 · 유의사항(2026-10-10) — 좌우 0 · 머리 위 · 좌우 24 · 아래 4, 카드 아래 8(마지막 트리거 16 과 합쳐 24) · 머리 오른쪽에 모두 펼치기 |

- 변형은 `default` · `hero` 둘이다. 그림자 카드 · 흰 위 흰 그림자 카드(raised) · 회색 채움(muted) · 브랜드 틴트(brand)는 두지 않는다 — 시트 · 대화상자 안의 요약은 List 키-값 줄 · Callout.
- 카드 안에 카드를 두지 않는다. 카드의 데이터를 못 불러오면 그 카드 안에 Result Section `medium` + 다시 시도 — 화면 전체를 스켈레톤으로 되돌리지 않는다.
- `card-light` · `card-dark` 짝(흰 면 · 다크 면 위 본문 글자)은 lint 가 대비를 재는 자리로 남긴다.

### Page text

> 기록 — 기준은 Typography 의 "글자 역할"(2026-10-16)이다: 화면 제목 R1 · 화면 부제 R2 · 구역 제목 R4 · 긴 글 R11. 옛 내용(body-md 15 · 600 강조 · title-sm ~ title-md 헤딩 위계)은 `DESIGN.history/v119-text-roles.md` 에 있다.

### Caption

> 기록 — 기준은 Typography 의 "글자 역할"(2026-10-16)이다: 줄 · 칸 안 설명 · 메타는 R9(`fg-neutral-subtle` 한 색 — 메타 줄은 Tag Group, `specs/components/tag-group.md`), 축 · 단위 · 범례 같은 덧붙인 정보는 R10. 옛 secondary / tertiary 위계(카테고리 muted · 시각 subtle)는 쓰지 않는다 — `DESIGN.history/v119-text-roles.md`.

### Badge · Notification Badge · Tag Group

> 2026-10-03 SEED Badge · Notification Badge · Tag Group 구조로 다시 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G, 1A · 2A · 3A · 4A 와 "따라오는 것"). 수치 원본은 `specs/components/badge.yaml` · `notification-badge.yaml` · `tag-group.yaml`, 쓰는 규칙은 같은 이름의 `.md` 다. 옛 Badge 절(채운 의미 색 넷 · 18 · 22 · 28 · 알약 또는 모서리 4 · 개수는 `aria-live`)은 걷었다 — 옛 스펙은 `specs/components/badge.history/v-pre-seed-display.*`. 머리말의 `badge-success` · `badge-error` · `badge-warning` · `badge-info` 대비 쌍은 solid 배지의 흰 글자(라이트)를 잰다. 의미 색 outline 의 옅은 테두리 넷(`stroke-critical-weak` · `stroke-positive-weak` · `stroke-warning-weak` · `stroke-informative-weak`)을 이 묶음에서 들였다(v117).

#### 나누기

| 보이려는 것 | 쓰는 것 |
|---|---|
| 대상의 상태 · 분류(예정 · 연체 · 승인 · 신용) | Badge — 누르지 않는다 |
| 설명 줄의 메타(카테고리 이름 · 자산 · 시각 · 거리 · 개수 · 금액) | Tag Group — " · " 로 이은 글줄 |
| 안 읽은 알림이 있음 · 몇 개 | Notification Badge — 점 · 숫자 |
| 고르기 · 거르기 · 넣은 값 빼기 | Chip — 누르는 알약(Chip 절) |

#### 모양

| | Badge | Notification Badge | Tag Group |
|---|---|---|---|
| 크기 | medium 20(좌우 6 · 위아래 2 · 글 11/15) · large 24(8 · 4 · 12/16), 앞 아이콘 12 · 14 | 점 6 · 숫자 18(좌우 4 · 11/15 · 700 — 글자 크기 설정을 따르지 않는다) | 12/16(기본) · 13/18 · 14/19, 아이콘 12 · 13 · 14 |
| 모양 | 둥근 사각 — 모서리 `radius-r1` 4 · `radius-r1_5` 6. 알약은 Chip 에만 | 원 · 알약 | 글 — 항목 사이 " · " 글자(앞 항목에 붙는다) |
| 색 | weak `bg-*-weak` + `fg-*-contrast` · 500 / solid `bg-*-solid` + `static-white` · 700 / outline 투명 + 안쪽 1px `stroke-*-weak` + `fg-*` · 700. 중립은 `bg-neutral-weak` + `fg-neutral-muted` · `bg-neutral-inverted` + `fg-neutral-inverted` · `stroke-neutral-weak`, warning solid 는 주황 + 흰 글자 | 점은 브랜드 글자색(다크에서 밝은 짝), 숫자는 브랜드 채움 + 흰 글자 — 브랜드 파일 | 기본 `fg-neutral-subtle`(흰 바탕 5.50) · 앞세울 항목 `fg-neutral` 700 · 구분 `fg-disabled` |
| 자리 | 줄 · 상세 머리 — 한 대상에 둘까지, 사이 4 | 아이콘 상자 기준 — 점 오른쪽 위 안쪽 1(24 아이콘 x 17 ~ 23 · y 1 ~ 7), 숫자 왼쪽 아래 꼭짓점 (아이콘 폭 − 8, 14). 글이면 끝 + 2 · 줄 상자 위 | List 의 설명 줄 · 카드 · 상세 머리의 메타 |

#### 쓰는 규칙

- **배지는 누르지 않는다** — 누르는 라벨은 Chip(알약). 배지의 뜻을 더 알려야 하면 옆에 ⓘ Help Bubble.
- **반복되는 목록은 weak** — 한 목록 안은 한 변형, 뜻은 톤으로. brand 는 요금제 · 본인 표시처럼 브랜드와 닿는 자리에만.
- **흰 표면 위에** — 중립 weak 의 바탕은 회색 바탕(`bg-layer-basement`)과 같은 색이라 거기서 사라진다.
- **합계에 안 드는 줄(예정 · 환불)은 흐리지 않는다** — 제목 · 금액만 `fg-neutral-subtle`, 환불 금액은 취소선, 배지는 보통 대비(List 절).
- **알림 점 · 숫자는 확인할 새 것에만** — 보면 사라진다. 0 은 안 보이고 100 이상은 "99+". 한 화면에 아껴서(여러 탭에 동시에 달지 않는다).
- **메타 줄 구분은 " · " 글자** — 2px 점 그림 · "•" 를 쓰지 않는다. 항목은 6 ~ 10자, 한 묶음은 한 크기.
- **글** — 배지 · 메타에 영어 · 코드값을 내지 않는다("NEW" → "새로", `ROLE_ADMIN` → "관리자", "Day 2 of 3" → "2/3일째", "9:00 AM" → "오전 9:00"). 요금제 이름 Pro · Free 는 그대로.

#### 접근성

- Badge: 역할 없는 글 — 줄 이름에 이어 읽힌다. 뜻은 글이 말하고 색은 거든다. 모든 짝이 4.5:1 이상이다.
- Notification Badge: 점 · 숫자는 숨기고 붙은 버튼 · 탭 이름에 넣는다("알림, 새 알림 3개"). 수가 바뀌어도 소리로 알리지 않는다(라이브 영역 없음).
- Tag Group: 구분 " · " 는 숨기고 그 자리에 보이지 않는 ", " — 항목마다 끊어 읽는다. 뜻이 있는 아이콘 항목은 읽을 글("분할 2건")을 준다.

### Alert text

> 기록 — 기준은 Callout(`specs/components/callout.md` — 2026-10-02, 본문 t4 · 제목 700 · 톤 contrast 색)과 Field 오류(Typography 의 "글자 역할" R19 — t4 · `fg-critical` + 아이콘)다. 옛 alert-text 짝 · body-md 15 · 600 제목은 `DESIGN.history/v119-text-roles.md` 에 있다.

### Focus ring

모든 인터랙티브 컴포넌트(button / input / card-interactive / link / tab 등)의 focus 표현 통일 — 키보드 사용자의 시각적 navigation cue.

#### Mode pair (sparse — brand 토큰이 contrast 검증 담당)
- **focus-ring-on-light** (`focus-ring-on-light`): 라이트 표면 위 focus
- **focus-ring-on-dark** (`focus-ring-on-dark`): 다크 표면 위 focus

(색은 역할 색 `stroke-focus-ring` 하나다(v102) — 라이트 · 다크 값은 brand 파일의 v102 표. 옛 `border-focus` · `border-focus-light` 는 같은 값의 별칭이다.)

#### Spec
- **두께**: 2px outline (1px은 시인성 부족)
- **offset**: 컴포넌트 외곽 2px (즉 컴포넌트 + 2px gap + 2px ring → 총 4px 외곽 영역 — v106, 스펙 다수와 맞춤)
- **입력칸 · 선택 상자**: 입력 중에는 링 대신 같은 색의 테두리 2px(v106 — State 절)
- **shape**: 컴포넌트 outline 100% 둘러쌈 — `border-radius` 동일 적용
- **trigger**: `focus-visible` pseudo만 (마우스 클릭 시 미표시, Tab/keyboard로 진입 시만)

#### WCAG 검증
- **2.4.11 Focus Appearance** (AA — 2.2): focus indicator는 (a) 인접 표면 대비 **3:1 이상**, (b) 컴포넌트 외곽선 둘레의 **최소 2 CSS pixel 두께** + **인접한 비-focus 상태 대비 3:1** 충족 — 본 시스템 모두 충족
- **2.4.12 Focus Not Obscured (Minimum)** (AA — 2.2): focus 받은 요소가 author-created 컨텐츠에 의해 완전히 가려지면 안 됨 — sticky header / popup overlay 디자인 시 z-index + scroll-margin 고려
- **2.4.13 Focus Appearance Enhanced** (AAA — 2.2): 컴포넌트 둘레 둘레 100% × 두께 4 CSS pixel 또는 **기준 2배 이상 대비** 권장 — 향후 enhanced focus 옵션 (`focus-ring-enhanced` 토큰) 추가 후보

#### 사용 예시 (CSS 의사코드)
```css
.button:focus-visible {
  outline: 2px solid var(--color-stroke-focus-ring); /* 다크 값은 다크 블록이 바꾼다 */
  outline-offset: 2px;
}
```

#### Layout
- focus ring은 `outline` 사용 (box-shadow도 가능하지만 outline이 layout shift 없음 — focus 시 element 크기 안 변함)
- offset 2px → outline-offset: 2px (v106)

#### Motion
- focus ring 등장: `motion-duration-color-transition` × `motion-ease-easing` (opacity 0 → 1) — v106, v104 이름으로
- `prefers-reduced-motion: reduce` 시 즉시 표시 (focus 인지 지연은 a11y 저해)

#### Accessibility 체크리스트
- [ ] 2.4.11: 모든 컴포넌트의 focus state는 `focus-ring-on-{light,dark}` 토큰 사용
- [ ] `focus-visible`만 사용 — 마우스 사용자 방해 없음 (`:focus`로 일관 적용 시 클릭 후에도 ring 표시되어 산만)
- [ ] 2.4.12: focus 가려짐 방지 — sticky header 아래 focus 받으면 자동 scroll 보강 (`scroll-margin-top: <header height>`)
- [ ] 다크 모드 자동 전환: `[data-theme="dark"]` 또는 `prefers-color-scheme: dark` 블록이 `--color-stroke-focus-ring` 을 다크 값으로 바꾼다

### Divider

> 2026-10-03 SEED Divider 로 다시 정했다(옛 Separator 를 대신 — 사용자 결정, 비교 페이지 https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G 의 "따라오는 것"). 수치 원본은 `specs/components/divider.yaml`, 쓰는 규칙은 `divider.md` 다. 옛 절(`border-default` 1px · dashed 예약 · margin-only)은 걷었다 — 옛 스펙은 `specs/components/separator.history/v-pre-seed-display.*`. 머리말의 `divider-light` · `divider-dark` 는 옛 v40 짝(값은 옛 `border-default`)이고, 글자가 없어 대비 검사 대상이 아니다.

| 세기 | 쓰는 것 | 자리 |
|---|---|---|
| 약함 | 들인 선 — 양끝 16 | 같은 묶음 안 |
| 중간 | 끝까지 선 | 묶음 사이 · 액션 영역 위 · 스크롤되는 본문 위 머리 |
| 강함 | 8 간격 — 회색 바탕(`bg-layer-basement`) 위 흰 층(`bg-layer-default`) 사이. 선이 아니다 | 크게 다른 내용 사이 |

- 선은 하나 — 1px `stroke-neutral-subtle`(흰 바탕 1.15 · 다크 1.30, SEED 기본 neutral-muted 와 같은 진하기 — 새 토큰 없이). 굵은 선 · 짙은 선 · 점선 · "8px 구분선" 을 두지 않는다.
- 가로(부모 폭) · 세로(부모 높이 — 통계 세 칸 사이). 바깥 여백이 없다 — 간격은 쓰는 자리가 정한다.
- 반복되는 목록 줄 사이는 List 의 줄 사이 선(기본 없음 · 같은 색 · 들임 24). 화면 · 묶음의 마지막 아래에는 두지 않는다.
- 기본은 장식(보조 기술에 숨김) — 이름 있는 구획을 나눌 때만 `role="separator"`(SEED 는 `<hr>` 가 기본).
- 웹 · 앱의 border-subtle 과 border-default 가 같은 값이라 "옅은 구분선" 이 효과가 없다 — 구분선은 이 한 색으로 정리한다.

### Outline (border 시각 요소 · 기록 — 기준은 Dialog · Popover 스펙과 v104 의 선)

`border-strong` 토큰을 1px element의 배경색으로 사용 — 외곽선이 카드/section의 외곽 식별 강도를 높일 때.

#### Mode pair
- `outline-strong-light` (`outline-strong-light`): `border-strong` (`#7D8593`) 사용
- `outline-strong-dark` (`outline-strong-dark`): `border-strong-dark` (`#838997`) 사용

#### Spec
- 두께: 1px (border CSS 또는 1px element)
- 색상: `border-strong` (default border보다 강한 식별)

#### 사용 시나리오
- modal/dialog 외곽선 (`shadow-xl` + `outline-strong-light` 1px) — focus 가려짐 방지(2.4.12) 시 시각 분리감 보강
- highlighted card (선택된 list item, drag-over state)
- inline editor의 in-progress 표시

#### Contrast (UI 1.4.11)
- `border-strong` (`#7D8593`) vs `surface-default` (`#FFFFFF`) = **3.34:1** ✅ UI
- `border-strong` vs `bg-page` (`#F5F6FA`) = **3.13:1** ✅ UI (3:1 통과)
- `border-strong` vs `surface-input` (`#F5F6FA`) = **3.87:1** ✅ UI
- `border-strong-dark` (`#838997`) vs `bg-page-dark` (`#1A1F2E`) = **4.68:1** ✅ UI
- `border-strong-dark` vs `surface-default-dark` (`#242938`) = **4.13:1** ✅ UI
- `border-strong-dark` vs `surface-input-dark` (`#353B4D`) = **4.05:1** ✅ UI

모든 표면에서 UI 1.4.11 (3:1) 통과 — 단순 외곽선만으로 컴포넌트 식별 가능.

#### Accessibility
- [ ] 1.4.11: 위 contrast 충족 — outline-strong은 외곽선 **단독 식별** 가능 (`border-default` 1.16:1과 다름)
- [ ] 다크 모드에서 modal에 `outline-strong-dark` + `shadow-xl-dark` 동시 사용 권장 (다크 표면 위 elevation 보강)

### Disabled label (기록 — 기준은 v106 상태 — 막힌 글자 `fg-disabled` · 바탕 `bg-disabled`, 불투명도를 쓰지 않는다)

비활성 상태 컴포넌트(disabled button/input/menu item)의 텍스트 라벨. **WCAG 1.4.3 incidental 예외** 명시 — 사용 불가 컴포넌트 텍스트는 본문 4.5:1 비대상.

#### Mode pair (sparse — textColor만 정의, backgroundColor 없음)
- `disabled-label-light` (`disabled-label-light`): `text-disabled` (`#8A91A0`)
- `disabled-label-dark` (`disabled-label-dark`): `text-disabled-dark` (`#838997`)

contrast 참고 (incidental 예외라 통과 비대상):
- `text-disabled` (`#8A91A0`) on `surface-default` (`#FFFFFF`) = 약 **3.16:1** (본문 4.5:1 미달, AA UI 3:1 통과 — 시인성은 있되 본문 의도 아님)
- `text-disabled-dark` (`#838997`) on `surface-default-dark` (`#242938`) = 약 **4.13:1** (동일 패턴)

#### 의도
WCAG 1.4.3 (Contrast Minimum)의 명시적 예외:
> *Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.*

→ disabled 컴포넌트의 라벨은 **인터랙션 불가** 상태를 시각적으로 알리는 역할이라 일부러 약한 contrast 사용. 4.5:1 통과해버리면 active 상태와 구분이 어려워 오히려 UX 저해.

#### Spec
- text color: `text-disabled` / `text-disabled-dark`
- 추가 시각(v106): 불투명도를 쓰지 않는다 — 배경이 있으면 `bg-disabled`, 테두리는 `stroke-neutral-weak`, cursor:not-allowed (State 절)

#### Layout
- disabled 컴포넌트 옆의 이유 글(예: "비활성화됨" 부가 설명)은 Field 설명과 같은 t4 · 400 · `fg-neutral-subtle`(Typography 의 "글자 역할" R9)로 4.5:1 을 지킨다 — 이 글은 incidental 예외 비대상

#### Accessibility
- [ ] 1.4.3 incidental 예외 — text 자체 contrast는 비대상
- [ ] **그러나** 시각적 비활성 표현 보강 필수: 전용 색(`bg-disabled` · `fg-disabled` · `stroke-neutral-weak`) + cursor:not-allowed (v106 — 불투명도 0.5 는 걷음)
- [ ] aria: `disabled` HTML 속성 (form 제어) 또는 `aria-disabled="true"` (focus 가능, 메뉴 아이템 등)
- [ ] screen reader가 "비활성화됨"이라고 읽음 — 시각적 강조 없이도 전달
- [ ] **disabled 컴포넌트 옆에 reason text 권장** (예: "권한 없음", "기간 만료") — 글자 역할 R9 값으로

### Chart color (palette)

data visualization(bar/line/pie/donut/heatmap)·카테고리 색상·tag 분류용 10색 palette. fill / stroke 용도 sparse 매핑(`backgroundColor`만, `textColor` 페어 비대상).

#### Mode pair (10색 × 2 = 20 토큰)
**Light surface (`surface-default` 위)** — 팔레트 700 단계(v110, L* 45 ~ 50):
| Token | hex | Hue |
|---|---|---|
| `chart-color-red` | `#D72323` | red |
| `chart-color-orange` | `#BE490D` | orange |
| `chart-color-yellow` | `#8C7400` | yellow |
| `chart-color-green` | `#167F3F` | green |
| `chart-color-blue` | `#1D6EC9` | blue |
| `chart-color-indigo` | `#5E60C8` | indigo |
| `chart-color-violet` | `#8B4DBA` | violet |
| `chart-color-pink` | `#B83B7A` | pink |
| `chart-color-brown` | `#9A6536` | brown |
| `chart-color-gray` | `#62697A` | gray |

**Dark surface (`surface-default-dark` 위)** — `chart-*-dark` = 팔레트 800-dark(v110, L* 69):
| Token | hex |
|---|---|
| `chart-color-red-on-dark` | `#FF8477` |
| `chart-color-orange-on-dark` | `#FF8758` |
| `chart-color-yellow-on-dark` | `#C5A721` |
| `chart-color-green-on-dark` | `#25C062` |
| `chart-color-blue-on-dark` | `#69ABFF` |
| `chart-color-indigo-on-dark` | `#99A1FE` |
| `chart-color-violet-on-dark` | `#C793F3` |
| `chart-color-pink-on-dark` | `#F485B6` |
| `chart-color-brown-on-dark` | `#CF9F77` |
| `chart-color-gray-on-dark` | `#B7BDCC` |

#### Hue 정렬 의도
red → orange → yellow → green → blue → indigo → violet → pink → brown → gray 는 표의 차례(무지개 + 보조색)다. 차트에서 색을 받는 차례는 v110 의 배정 순서(blue → green → orange → violet → pink → indigo → red → yellow → brown)이고 회색은 "기타" 전용이다 — 저장된 색이 있으면 아직 쓰지 않은 색부터(2026-10-08, `specs/components/chart.md`).

#### L 통일의 의도
모든 chart 색상은 동일한 명도 → 휘도 차이로 인한 시각 우선순위 부여 없이 **hue 차이만으로** 카테고리 구분. 이는 색맹 사용자(특히 적-녹 색맹)에게 부분적 도움 — 명도 차이가 없으면 고대비 hue 색상도 동일 톤으로 보일 수 있어 **반드시 패턴/라벨 보강 필수**.

#### Variant
| 사용 | Token 그룹 | 비고 |
|---|---|---|
| 라이트 표면 fill | `chart-color-{hue}` | bar 채움, pie slice |
| 라이트 표면 stroke | `chart-color-{hue}` | line 그래프 stroke |
| 다크 표면 fill/stroke | `chart-color-{hue}-on-dark` | 다크 모드에서 `chart-{hue}-dark` 사용 |
| 카테고리 tag | `chart-color-{hue}` | category badge, label dot |
| 작은 면 옅은 바탕(v111) | `chart-{hue}-weak` + 글자 `chart-{hue}-contrast` · 아이콘 `chart-{hue}` | 카테고리 타일 · 캘린더 칩 · 주식 나라 표시 |
| 넓은 면 옅은 바탕(v111) | `chart-{hue}-subtle` + 글자 `chart-{hue}-contrast` | 메모 카드 · 배너 |

#### Layout
- pie/donut: 10개를 넘으면 상위 9 + 회색 "기타"(v110)
- bar/column: 카테고리 ≤7 권장
- line graph: ≤5 lines (더 많으면 지표 타일로 계열을 골라 보게 — 나머지를 회색으로 칠하지 않는다)
- 범례: 선 · 막대는 차트 위 지표 타일, 도넛은 카테고리 목록(2026-10-08 — `specs/components/chart.md`)

#### Motion
- chart entrance: `motion-duration-slow` (300ms) × `motion-ease-out` — 막대 grow / 선 draw 자연스럽게
- hover highlight: `motion-duration-fast` (150ms) opacity 변화
- `prefers-reduced-motion: reduce` 시 즉시 표시 (애니메이션 없이)

#### Accessibility
- [ ] **1.4.1 Use of Color (강조)**: chart에서 색상 단독 의존 절대 금지 — 패턴(diagonal/dot 등) 또는 라벨 직접 표시 보강 필수. 특히 적-녹(red/green) 동시 사용 시 색맹 대응 필수
- [ ] **1.4.11 Non-text Contrast**: chart element vs surface 대비 3:1 이상 — `chart-color-yellow` (`#8C7400`) vs `surface-default` = **4.55:1** ✅, 가장 약한 hue도 UI 3:1 통과
- [ ] **legend / data label**: 각 색상 옆에 텍스트 라벨 또는 패턴 표시. 시각만으로 식별하는 chart 금지
- [ ] **screen reader**: chart는 `<table>` fallback 또는 `<svg role="img" aria-label="...">` + 데이터 요약 텍스트 동반
- [ ] **focus**: 차트 상자 하나가 초점을 받고 ← · → 로 날짜를 옮기며 툴팁을 띄운다(2026-10-08 — `specs/components/chart.md`). 데이터 점마다 `tabindex` 를 두지 않는다

#### 사용 예시 (CSS 의사코드)
```css
.chart-bar-1 { background-color: var(--color-chart-color-red); }
.chart-bar-1[data-pattern="diagonal"] {
  background: repeating-linear-gradient(45deg, var(--color-chart-color-red), var(--color-chart-color-red) 4px, transparent 4px, transparent 8px);
}
@media (prefers-color-scheme: dark) {
  .chart-bar-1 { background-color: var(--color-chart-color-red-on-dark); }
}
```

### 시트 · 대화상자 · 확인창 · 팝오버

수치 · 규칙의 원본은 `specs/components/bottom-sheet.md` · `dialog.md` · `alert-dialog.md` · `popover.md` 와 각 `.yaml` 이다 — 2026-10-02 SEED Bottom Sheet · Dialog · Responsive Dialog · Alert Dialog · Popover 구조로 새로 정했다(옛 Modal · Drawer · Alert Dialog · Popover 절을 대신한다). 이 절은 토큰과 닿는 자리만 모은다.

#### 나누기

| 일 | 1280 미만 | 1280 이상 |
|---|---|---|
| 입력 폼 · 상세(지금 화면을 떠나지 않고) | Bottom Sheet | Dialog — 한 부품(Responsive Dialog)이 폭으로 바꾼다 |
| 날짜 · 시각 · 아이콘 격자 · 긴 목록 고르기 | Bottom Sheet(Input Button) | Popover |
| 되돌릴 수 없는 확인 · 꼭 알릴 일 | Alert Dialog | Alert Dialog |
| 줄의 동작 목록 | Menu Sheet(그 차례에) | Menu(그 차례에) |
| 화면 높이 90% 를 넘는 내용 | 페이지 | 페이지 |
| 옆에서 나오는 패널 | 주 메뉴만 — Side Panel 왼쪽(768 미만, HR 폰) | 보조 작업 — Side Panel 오른쪽(쓰는 곳 없음 — 1280 미만은 Bottom Sheet) |

#### 모양

| 표면 | 값 |
|---|---|
| 공통 | 표면 `bg-layer-floating`, 딤 `overlay-dim-light` · `overlay-dim-dark`(Popover 는 딤 없음), 시트 · 대화상자 · 확인창은 그림자 없음 |
| Bottom Sheet | 최대 480 · 위 모서리 `radius-r6` · 머리 위 24 · 제목 `t8` 22 · 700 · 설명 `t5` `fg-neutral-muted` · 좌우 `spacing-global-gutter` · 닫기 28 원(`bg-neutral-weak`, 누르는 영역 44) · 손잡이는 스냅 높이를 둘 때만 · 넘칠 수 있는 본문은 Scroll Fog 위 20 · 아래 80 · 바닥 버튼 large 48 + 안전 영역 · `motion-duration-d6` `motion-ease-enter-expressive` 로 올라오고 `d4` `exit` 로 내려간다 |
| Dialog | medium 480 · large 800 · 최대 높이 80% · `radius-r5` · 머리 24 · 제목 `t8` · 본문만 스크롤(넘칠 수 있는 본문은 Scroll Fog — 늘 켜진 위 20 · 아래 80, 위로 스크롤하면 머리 아래 1px `stroke-neutral-subtle`) · 바닥 버튼 small 36 오른쪽 · `d4` `enter-expressive` 로 1.3 배에서 줄며 나타남 |
| Alert Dialog | 최대 272 · `radius-r5` · 안쪽 20 · 제목 `t7` 20 · 700 · 설명 `t5` `fg-neutral`(짙은 글자) · 버튼 둘 나란히(길면 세로 · 확정 위) — 1280 미만 medium 40 · 이상 small 36 |
| Popover | 폭 320 ~ 480 · 최대 높이 600 · `radius-r5` · `shadow-s3` · 트리거와 8 · 머리 제목 `t7` + 닫기 · `d3` `enter` 로 0.95 배에서 커진다 |
| 쌓임 | specs/z-index.md — 시트 · 대화상자 L2(`z-modal` 100 · `z-modal-content` 101) · Popover L3(`z-floating` 200) · Alert Dialog L5(`z-alert` 300 · `z-alert-content` 301) |

#### 쓰는 규칙

- 입력 폼은 바깥 누르기 · 끌어내리기로 닫지 않는다 — 닫기 버튼 · 취소 · `Esc` · 뒤로 가기로 닫고, 바뀐 값이 있으면 "작성한 내용이 사라져요" 를 묻는다(Field).
- 닫기 버튼과 바닥 취소를 함께 두지 않는다 — 대화상자의 입력 폼은 바닥 [취소] [저장], 시트의 입력 폼은 위 닫기 + 바닥 [저장], 조회 · 안내 · 고르기는 위 닫기.
- 확인창은 닫기 버튼이 없고 바깥 누르기를 무시한다. `Esc` 는 취소. 확인창 안에 입력칸을 두지 않는다.
- 버튼 글은 동작 이름("삭제" · "저장" · "그룹 삭제") — "확인" 으로 뭉뚱그리지 않는다.

#### Accessibility 체크리스트
- [ ] 모달(시트 · 대화상자 · 확인창) — `role="dialog"` · 확인창 `role="alertdialog"`, `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby`, 열면 표면으로 초점 · 닫으면 연 자리로, 열린 동안 초점을 가두고 뒤 화면을 숨기고 스크롤을 잠근다
- [ ] Popover — `role="dialog"`(aria-modal 없음), 초점은 안으로 · 가두지 않음 · Tab 으로 나가면 닫힘, 트리거 `aria-haspopup="dialog"` · `aria-expanded`
- [ ] 닫기 버튼 이름 "닫기", 시트 닫기 누르는 영역 44
- [ ] 대화상자 높이 80% 상한 — 머리 · 바닥이 화면 밖으로 나가지 않는다

### 알림 메시지 — Snackbar · Callout · Page Banner · Result Section

> 2026-10-02 SEED Snackbar · Callout · Page Banner · Result Section 구조로 다시 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/8t85WkZ3HLhMu8KibW3Vk1). 수치 원본은 `specs/components/snackbar.yaml` · `callout.yaml` · `page-banner.yaml` · `result-section.yaml`, 쓰는 규칙은 각 스펙 md 다. 옛 Toast 절(흰 카드 · 위 오른쪽 · 3장 쌓기 · 오류 8초)과 Sonner(v72) · Banner(v73) 절은 걷었다. 반전 짝 역할 셋(v115 — `fg-brand-inverted` · `fg-positive-inverted` · `fg-critical-inverted`)을 이 묶음에서 들였다.

#### 나누기

| 이런 일 | 쓰는 것 |
|---|---|
| 방금 한 일의 결과 · 뒤에서 끝난 일 · 다시 하면 되는 가벼운 실패 | Snackbar(토스트) |
| 입력값이 틀림 | Field 의 오류 문구(칸 아래) |
| 그 기능 · 내용 가까이의 팁 · 주의, 그 자리의 오류(저장 실패) | Callout |
| 페이지 전체의 상태(연결 끊김 · 만료 예정 · 새 버전) | Page Banner — 페이지 맨 위, 한 화면 하나 |
| 비어 있음 · 불러오기 실패 · 완료 · 404 · 화면 오류 | Result Section |
| 되돌릴 수 없는 결정 | Alert Dialog |

오류는 자리에서 알린다 — 모든 실패를 한곳에서 토스트로 띄우지 않는다(서버가 보낸 글 · 영어 · 코드를 그대로 보이지 않는다). 시트 · 대화상자 안의 결과 · 오류는 그 안 Callout, 토스트는 시트가 닫힌 뒤.

#### 모양

| | Snackbar | Callout | Page Banner | Result Section |
|---|---|---|---|---|
| 자리 | 화면 아래 가운데 · 탭 바 · 플로팅 버튼 위 8 · 최대 464 | 본문 안 · 콘텐츠 폭 | 페이지 맨 위 · 화면 폭 | 놓인 자리 가운데 |
| 면 | `bg-neutral-inverted`(다크는 밝은 띠) · 모서리 8 · 그림자 없음 | `bg-*-weak` · 모서리 10 | `bg-*-weak` · `bg-*-solid` · 모서리 0 | 없음 |
| 크기 · 여백 | 최소 44 · 10 + 6(글은 16) | 최소 50 · 14 | 최소 40 · 10 / 24 | 좌우 48 · 위아래 16 |
| 글 | 14 / 19 | 14 / 19 · 제목 700 · 한 문단 | 14 / 19 · 제목 700 · 본문 500 | 제목 22 / 30 · 16 / 22 · 설명 muted |
| 아이콘 | 24 — 성공 · 실패만(`fg-*-inverted`) | 16 · 톤 색 | 16 · 톤 색 | 40 |
| 버튼 | 액션 하나 · `fg-brand-inverted` 14 · 700 | 링크 · 전체 누르기 · 닫기 | 글 버튼 하나 13 · 700 · 닫기 | neutralWeak 40 + 글 버튼 |
| 시간 · 쌓임 | 4초 · 액션 6초 · 머무는 동안 멈춤 · 한 번에 하나 · z L6(400) | 늘 보임 | 늘 보임 · 한 화면 하나 | 늘 보임 |

톤은 다섯(neutral · informative · positive · warning · critical) — 옅은 바탕은 `bg-*-weak` + `fg-*-contrast`, 짙은 바탕은 `bg-*-solid` + 흰 글(`static-white`). 아이콘은 lucide 선 아이콘(v106).

#### 쓰는 규칙

- **글** — 해요체 문장에 마침표(스낵바도 — Writing v106). 무엇이 됐는지 먼저("거래를 저장했어요."), 오류는 할 수 있는 일까지. "실패" 로 끝나는 말 · 서버가 보낸 글 · 영어 · 코드를 쓰지 않는다. 액션은 동작 이름("되돌리기").
- **닫기** — Callout · Page Banner 는 한 번 보면 되는 안내에만 닫기를 두고, 닫은 것을 기억한다. 경고 · 오류는 닫지 못한다.
- **실패는 비어 있음과 다르게** — 불러오기 실패를 "내역이 없어요" 로 보이지 않는다. Result Section 의 실패 + "다시 시도".

#### 접근성

- Snackbar: 자리 `aria-live="polite"` · 띠 `role="status"` + `aria-atomic`, 초점을 옮기지 않는다. 보조 기술용 닫기는 키보드 초점이 오면 보인다.
- 나중에 나타나는 경고 · 위험(Callout · Page Banner)은 `role="alert"`. Result Section 은 결과로 바뀌면 `role="status"`, 제목은 제목 태그.

### 메뉴 · 메뉴 시트 · 도움말 말풍선 · 툴팁

> 2026-10-02 SEED Menu · Menu Sheet · Help Bubble · Help Bubble Tooltip 구조로 다시 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/QoxJ7ZmQCedRWfPQrDvFgA, 여덟 다 SEED 쪽). 수치 원본은 `specs/components/menu.yaml` · `menu-sheet.yaml` · `help-bubble.yaml`(툴팁도 이 파일), 쓰는 규칙은 각 스펙 md 다. 옛 Tooltip 절(반전 · 모서리 4 · 240 · hover 500ms)과 Dropdown 절(테두리 1px · 모서리 8 · 줄 36 · menu · select · multi-select · combobox 변형)은 걷었다 — 값 고르기는 Select · Input Button 절, 메뉴는 여기. Menubar · Hover Card · Context Menu 는 세 제품 모두 쓰는 곳이 없어 걷었다.

#### 나누기

| 이런 일 | 1280 미만 | 1280 이상 |
|---|---|---|
| 줄 · 화면의 동작(수정 · 복사 · 삭제 · 내보내기) | Menu Sheet | Menu |
| 값 고르기(테마 · 정렬 · 보기) | Segmented Control · Select — 메뉴가 아니다 | 같다 |
| 아이콘 버튼 · 줄인 글의 짧은 설명 | — (툴팁은 터치에서 안 열린다 — 이름은 `aria-label`) | Tooltip |
| 몰라도 일은 할 수 있는 설명(규정 · 계산 방법) | Help Bubble(ⓘ 를 눌러서) | Help Bubble |
| 버튼 · 입력이 있는 내용 | Bottom Sheet | Popover |

#### 모양

| | Menu | Menu Sheet | Help Bubble · Tooltip |
|---|---|---|---|
| 표면 | `bg-layer-floating` · 모서리 20 · `shadow-s3` · 폭 200 · 위아래 8 | `bg-layer-floating` · 위 모서리 20 · 최대 480 · 손잡이 늘 · 딤 | `bg-neutral-inverted` · 모서리 12 · 최대 280 · 화살표 12×8 · 그림자 없음 |
| 줄 · 글 | 39(설명 있으면 57) · `t4` 14 · 아이콘 18 · 좌우 16 | 52 · `t5` 16 · 아이콘 22 · 묶음 `bg-neutral-weak` 모서리 16 | `t3` 13(제목 700) · 위아래 10 좌우 12 |
| 누름 · 호버 | 좌우 8 들인 알약 `bg-layer-floating-pressed` · 내용만 축소 | 줄 `bg-neutral-weak-pressed` · 내용만 축소 — 설명은 `fg-neutral-muted` · 위험 글자는 `fg-critical-contrast` 로(누름 바탕 위 4.5:1) | 닫기 버튼만 축소 |
| 키보드 | 알약 자리 2px 링(호버와 따로) · ↑↓ 순환 · 한 글자 찾기 | 줄 안쪽 링 · `Tab` | 닫기 버튼 안쪽 링(말풍선 글자색) |
| 묶음 · 위험 | 묶음 사이에만 선 · 위험은 맨 아래 묶음 `fg-critical` | 묶음 사이는 간격 · 위험은 맨 아래 묶음 | — |
| z-index | L3 `z-floating` 200 | L2 `z-modal` 100 / `z-modal-content` 101 | L4 `z-tooltip` 210 |

#### 쓰는 규칙

- **메뉴는 실행만** — 누르면 바로 실행하고 닫힌다. 고른 표시(체크 · 라디오) · 단축키 · 하위 메뉴가 없다.
- **데스크톱 줄의 동작은 줄 끝 ⋮ 하나 + Menu** — 이름 "{줄 이름} 더보기". 줄을 누르면 상세 · 수정. 수정 · 삭제 아이콘을 줄마다 늘 늘어놓지 않는다.
- **폰 스와이프는 지름길** — 같은 동작을 줄 끝 ⋮ → Menu Sheet 로도 연다(키보드 · 스크린리더의 길).
- **비모달 Menu** — 뒤 화면을 숨기지 않는다. `Tab` · 바깥 누르기로 나가면 닫히고, 고르면 실행하고 닫혀 초점은 트리거로.
- **툴팁은 마우스(200 / 100ms) · 키보드(바로)의 보조** — 이름은 `aria-label`, 막힌 이유는 가까운 글, 네이티브 `title` 은 쓰지 않는다. 폰에서도 읽어야 하는 설명은 Help Bubble.
- **글** — 메뉴 줄은 동사로 짧게(2 ~ 6자), 툴팁 · 말풍선은 해요체 · 문장이면 마침표.

#### 접근성

- Menu: 트리거 `aria-haspopup="menu"` · `aria-expanded`, `role="menu"` · `menuitem` · `group`. 키보드 위치는 링으로(바탕색만으로 알리지 않는다).
- Menu Sheet: `role="dialog"` + `aria-modal`, 줄은 `<button>`. 보이지 않는 "닫기" 는 키보드 초점이 오면 보인다.
- Help Bubble: `role="dialog"`(비모달) + 제목 `aria-labelledby`. Tooltip: `role="tooltip"` + 트리거 `aria-describedby`, WCAG 1.4.13(말풍선 위로 옮겨도 남는다 · `Esc`).

### Tabs · Segmented Control

수치 · 규칙의 원본은 `specs/components/tabs.md` · `tabs.yaml` · `chip-tabs.yaml` 과 `segmented-control.md` · `segmented-control.yaml` 이다 — 2026-10-02 SEED Tabs · Segmented Control 구조로 새로 정했다(옛 variant 넷 · 수동 활성화를 걷었다). 이 절은 토큰과 닿는 자리만 모은다.

#### 나누기

| 자리 | 컴포넌트 |
|---|---|
| 다른 구역 · 페이지로 옮긴다(1차, 화면 · 구역 맨 위) | Tabs — Line |
| 1차 탭 안에서 다시 나눈다(2차) | Tabs — Chip Tabs(필터 바가 같은 화면에 있으면 Line) |
| 같은 내용 2 ~ 4가지 거르기 · 정렬 · 보기(그 내용 바로 위, 한 화면 하나) | Segmented Control |
| 2 ~ 4개 짧은 폼 값 · 목록 조건 | Chip(하나 고르기 · 필터 바) |

#### Line

| 요소 | 값 |
|---|---|
| 크기 | `small` 40 · 글 `t4` 14(기본) · `medium` 44 · 글 `t5` 16. 탭 위아래 · 좌우 10, 글은 아래로 붙인다. 글은 고르든 안 고르든 700 |
| 색 | 안 고름 `fg-neutral-subtle`, 고름 `fg-neutral` + 아래 2px `fg-neutral` 막대(`motion-duration-d4` · `motion-ease-easing` 로 미끄러진다). 브랜드 색 · 굵기 변화 없음 — Desk · HR 이 같다 |
| 목록 | `bg-layer-default` + 바닥 안쪽 1px `stroke-neutral-subtle` |
| 폭 | Fill — 5개 이하 · 짧은 글, 칸을 나누고 막대를 좌우 16 들인다. Hug — 6개 이상 · 긴 글 · 넓은 데스크톱 자리, 목록 좌우 16 · 넘치면 가로 스크롤(고른 탭으로 16 여유를 두고 스크롤) |
| 누름 · 포커스 · 비활성 | 탭 2px 거리 축소만(색 · 호버 모양 없음) · 탭 안쪽 링 2px · 글 `fg-disabled` |
| 알림 점 | Notification Badge small — 6 · 브랜드 글자색(브랜드 파일의 fg-brand, 다크에서 밝은 짝), 글 끝 2 · 줄 상자 위 — 새 소식이 있는 탭 하나에만 |

#### Chip Tabs

칩 하나는 Chip(`chip.yaml`)의 Solid · Outline Strong 그대로다 — medium 36(기본) · large 40, 고르면 `bg-neutral-inverted` · `fg-neutral-inverted`. 목록은 좌우 `spacing-global-gutter` · 위아래 8 · 칩 사이 `spacing-between-chips`, 한 줄 가로 스크롤. 화면 전체 내용을 바꾸면 Solid, 일부면 Outline.

#### Segmented Control

| 요소 | 값 |
|---|---|
| 크기 | 트랙 안쪽 4 + 칸 34 = 42, 글 `t5` 16 · 700, 칸 좌우 12 — 칸이 트랙 폭을 똑같이 나눈다(최소 폭 없음 — 폰에서도 4개) |
| 색 | 트랙 `bg-neutral-weak-alpha`(투명 — 회색 바닥 위에서도 보인다, v120), 안 고른 글 `fg-neutral-subtle`, 고른 칸은 흰 알약 `bg-layer-default` + 안쪽 짙은 1px `stroke-neutral-contrast` 위 `fg-neutral`(`motion-duration-d4` 로 미끄러진다 — SEED 의 옅은 1px 은 트랙과 1.14:1 이라 바꿨다) |
| 누름 · 호버 | 안 고름 `bg-neutral-weak-pressed` + 1px `stroke-neutral-weak`(글 `fg-neutral-muted`) · 고름 `bg-layer-default-pressed` + 짙은 1px 그대로, 칸 안의 글만 2px 거리 축소 |
| 비활성 | 글 `fg-disabled`, 고른 채 막히면 칸에 `bg-disabled` + 1px `stroke-neutral-solid`(흐림 없음 — v106) |

#### 쓰는 규칙

- 화살표로 옮기면 바로 고른다(자동) — 바로 저장되거나 되돌리기 어려운 값은 탭 · Segmented 에 두지 않는다(폼 값은 Chip · Select).
- 탭 내용은 바로 바꾸고 탭마다 상태(스크롤 · 입력)를 남긴다. 폰의 1차 탭만 밀어 넘기고, 웹은 1차 탭을 주소에 남긴다.
- 탭 · Segmented 글에 개수를 붙이지 않는다 — 새 소식은 한 탭에 알림 점.

#### Accessibility 체크리스트
- [ ] Tabs — `tablist`(보이는 제목 또는 `aria-label`) · `tab`(`aria-selected` · `aria-controls`) · `tabpanel`(`aria-labelledby`), 고른 탭만 `tabindex="0"`, `←` `→` · `Home` · `End` 로 옮기며 고른다(끝에서 처음으로, 막힌 탭은 건너뛴다)
- [ ] Segmented Control — `radiogroup`(`aria-label`) + 라디오, 화살표로 옮기며 고른다
- [ ] 알림 점은 보조 기술에 "새 소식" 을 덧붙인다
- [ ] 키보드 포커스 링 — Line 은 탭 안쪽, Chip Tabs · Segmented 는 바깥
- [ ] 누르는 높이 — Line small 40 · Segmented 34 는 AAA(44)에 못 미친다(AA ✓)

### Switch / Checkbox / Radio (control 묶음)

binary on/off 상태 또는 group 선택을 표현하는 form control 3종. 공통 a11y 베이스 + 시맨틱 차이.

#### 의미 차이
| Component | 의미 | 변경 시점 |
|---|---|---|
| **Switch** | 즉시 적용되는 토글 (on/off) | 누르는 순간 적용 (e.g. 알림 켜기/끄기) |
| **Checkbox** | 다중 선택 또는 단일 confirm | form submit 시점 또는 즉시 적용 |
| **Radio** | 그룹 내 단일 선택 | form submit 또는 즉시 |

선택 기준: **즉시 적용 + on/off** → Switch, **다중 선택 + form** → Checkbox, **단일 선택 + group** → Radio. UI 혼동 회피를 위해 의미별 명확히 분기. Switch 는 누르는 순간 적용될 때만 쓴다 — 저장 · 실행을 눌러야 적용되는 켜고 끄기는 Checkbox 다(2026-09-30 사용자 결정 — SEED 와 같다). 누르면 화면이 바로 바뀌는 것(일정의 "종일")은 값이 저장 때 들어가더라도 Switch.

#### Spec 공통 (신규 토큰 없음)
세 컨트롤 모두 2026-09-30 SEED 구조로 바뀌었다(아래 Switch · Checkbox · Radio, `specs/components/switch.md` · `checkbox.md` · `radio-group.md`). 색 규칙은 셋이 같다(사용자 결정).

| 요소 | 값 |
|---|---|
| 선택 · 켜짐 채움 | `bg-neutral-inverted`(짙은 회색)가 기본. 브랜드 채움은 `tone="brand"` 일 때만 — 서비스 핵심 흐름 |
| 선택 · 켜짐 표시(체크 · 점 · 엄지) | `fg-neutral-inverted`. `tone="brand"` 면 `static-white` |
| 선택 안 됨 · 꺼짐 | `stroke-neutral-solid`(표면과 3:1 이상, v109) — Checkbox · Radio 는 1px 테두리, Switch 는 트랙 채움 |
| disabled | 전용 색(v106 — State 절), 불투명도로 흐리게 하지 않는다. 선택 · 켜진 채 막히면 모양 그대로 회색 — Checkbox · Radio 는 `bg-disabled` 채움 + `fg-disabled` 표시, Switch 는 `fg-disabled` 트랙 + `bg-disabled` 엄지. cursor:not-allowed |
| hover | Checkbox · Radio 는 누름 색. Switch 는 색이 바뀌지 않는다 — 켜짐 색이 상태를 뜻해서(v104) |
| pressed | 칸 · 동그라미 · 스위치만 세로 2px 거리 축소(v104) |
| focus | 키보드 포커스에만 링 2px · 띄움 2px(v106) |

#### Switch
> 상세 spec(Anatomy / Sizes / States / Motion / Accessibility / Do-Don't)은 [`specs/components/switch.md`](specs/components/switch.md)가 단일 SoT. 코드(`recipes/shadcn/components/ui/switch.tsx`) · 예제(`recipes/shadcn/examples/switch-examples.mjs`) · preview 4 source 동기.

- 구조: 스위치(Switchmark — 트랙 + 엄지) · 스위치 + 라벨(Switch) — SEED Switch(2026-09-30).
- 크기(이름은 트랙 높이): `16` 트랙 26 × 16 · 엄지 12 · 라벨 13 / `24` 38 × 24 · 20 · 14(기본) / `32` 52 × 32 · 26 · 16. 트랙 · 엄지 모서리 `radius-full`.
- 끄면 엄지가 0.8 로 작아진다 — 색 말고도 자리 · 크기로 켬 · 끔이 갈린다. 엄지에 그림자는 없다.
- 톤: `neutral`(짙은 회색, 기본) · `brand`.
- 모션: 엄지의 이동 · 크기 `motion-duration-d3` (150ms), 색은 20ms 뒤에 `motion-duration-d1` (50ms) — 둘 다 `motion-ease-easing`. 누르면 스위치만 세로 2px 거리 축소(색은 그대로).
- 누르는 순간 적용되는 설정에만 쓴다 — 저장해야 적용되는 값은 Checkbox.
- "라벨 왼쪽 · 스위치 오른쪽" 설정 줄(제목 · 설명 · 아이콘)은 List 의 스위치 줄(`ListSwitchItem` — 아래 List)이다. 그 줄에는 스위치 32 만(Switchmark) 끼우고 줄 전체가 누르는 영역이다 — 줄을 누르면 콘텐츠가 함께 줄고 스위치는 따로 줄지 않는다.
- 터치 타겟은 스위치 단독으론 작음(높이 16 · 24 · 32). **반드시 라벨까지 묶어 44** 확보(WCAG 2.5.5 AAA) — 설정 줄에 스위치만 넣으면 줄 전체.

#### Checkbox
> 상세 spec(Anatomy / Sizes / States / Motion / Accessibility / Do-Don't)은 [`specs/components/checkbox.md`](specs/components/checkbox.md)가 단일 SoT. 코드(`recipes/shadcn/components/ui/checkbox.tsx`) · 예제(`recipes/shadcn/examples/checkbox-examples.mjs`) · preview 4 source 동기.

- 구조: 칸(Checkmark) · 칸 + 라벨(Checkbox) · 묶음(Checkbox Group) — SEED Checkbox(2026-09-30).
- 크기: `medium` 칸 20 · 라벨 14 · 줄 32(기본) / `large` 24 · 16 · 36. 모서리 `radius-r1` (4px).
- 모양: `square`(칸 + 체크, 기본) · `ghost`(칸 없이 체크만 — 필수가 아니고 셋 이하). 톤: `neutral`(짙은 회색, 기본) · `brand`.
- 일부 선택(indeterminate): 가로줄 — 부모 · 자식 묶음에서 자식을 일부만 골랐을 때.
- 터치 타겟은 칸 단독으론 작음(20 · 24). **반드시 라벨까지 묶어 44** 확보(WCAG 2.5.5 AAA) — 목록 행에 칸만 넣으면 행 전체.
- 오류는 칸을 바꾸지 않는다 — 묶음 아래 글로 알린다.

#### Radio
> 상세 spec(Anatomy / Sizes / States / Motion / Accessibility / Do-Don't)은 [`specs/components/radio-group.md`](specs/components/radio-group.md)가 단일 SoT. 코드(`recipes/shadcn/components/ui/radio-group.tsx`) · 예제(`recipes/shadcn/examples/radio-group-examples.mjs`) · preview 4 source 동기.

- 구조: 동그라미(Radiomark) · 동그라미 + 라벨(Radio) · 묶음(Radio Group) — SEED Radio(2026-09-30).
- 크기: `medium` 동그라미 20 · 점 8 · 라벨 14 · 줄 32(기본) / `large` 24 · 10 · 16 · 36. 모서리 `radius-full`.
- 선택: 테두리 없이 채운 원 + 가운데 점. 톤: `neutral`(짙은 회색, 기본) · `brand`.
- 묶음은 세로로만 쌓는다(줄 사이 12 — 줄마다 누르는 영역 44 를 온전히 받게, SEED 는 4) — 짧은 선택지를 한 줄에서 고르게 하려면 Segmented · Chip.
- 설명 · 딸린 입력이 붙는 선택지는 Radio 가 아니라 Select Box(아래 Select Box).
- 오류는 동그라미를 바꾸지 않는다 — 묶음 아래 글로 알린다.

#### Layout
- label 위치: control 우측 (LTR) — control과 label 간 `sm` (8px) 간격
- 그룹 spacing:
  - vertical group: 항목 간 `md` (12px) ~ `lg` (16px) — Checkbox · Radio 묶음은 줄 최소 높이 32 · 36 에 줄 사이 12(`specs/components/checkbox.yaml` · `radio-group.yaml` — 줄마다 누르는 영역 44 를 온전히 받는다, 사용자 결정 2026-09-30. SEED 는 4)
  - horizontal group: 항목 간 `lg` (16px) — Radio 는 가로로 놓지 않는다(2026-09-30)
- group label (group 제목): control 위 `caption` + `xs` 간격

#### Touch target (WCAG 2.5.5)
- control 자체는 작음(Radio 동그라미 · Checkbox 칸 20 · 24, Switch 트랙 높이 16 · 24 · 32) — **반드시 label까지 포함한 hit area가 44×44px 이상** 확보 필수
- label 클릭으로도 toggle/select 가능 (`<label for="...">` 또는 control wrap)

#### Accessibility
- [ ] **HTML**: `<input type="checkbox|radio">` + `<label for="...">` 사용 — native a11y 자동
  - Switch는 HTML native 없음 → `<input type="checkbox" role="switch">` 또는 `role="switch"` + `aria-checked`. 스위치만 쓰는 설정 줄은 줄의 제목이 스위치의 이름이 되게 `<label>` 로 감싸거나 `aria-labelledby` 로 잇는다
- [ ] **focus ring**: control 외곽 + label 영역 모두 focus indicator 표시 (`border-focus` 2px outline)
- [ ] **aria 상태**:
  - Checkbox: `aria-checked="true|false|mixed"` (mixed = indeterminate)
  - Radio: group은 `role="radiogroup"` + `aria-labelledby="group-title"`
  - Switch: `role="switch"` + `aria-checked` (또는 native checkbox + `role="switch"`)
- [ ] **키보드**:
  - Checkbox/Switch: `Space`로 toggle (Switch 는 `Enter` 도)
  - Radio: arrow keys (`↑`/`↓` 또는 `←`/`→`)로 group 내 이동, 선택 즉시
  - Tab으로 group 진입 → 첫 번째 또는 현재 선택값으로 focus
- [ ] **disabled 상태**: control + label 모두 disabled 표시 + 1.4.3 incidental
- [ ] **error 상태** (form validation 실패): Checkbox · Radio 는 칸 · 동그라미를 바꾸지 않고 묶음 아래 글로(2026-09-30). Switch 에는 오류 상태가 없다 — 누르는 순간 적용되므로 검증할 값이 없고, 저장에 실패하면 스위치를 되돌리고 무엇이 안 됐는지 알린다

### List

> 상세 spec(Anatomy / 줄의 종류 / 상태 / 모션 / Accessibility / Do-Don't)은 [`specs/components/list.md`](specs/components/list.md)가 단일 SoT, 수치는 `list.yaml` · `list-header.yaml`. 코드(`recipes/shadcn/components/ui/list.tsx`) · 예제(`recipes/shadcn/examples/list-examples.mjs`) · preview 4 source 동기.

- 구조: 목록(List) · 한 줄(List Item) · 목록 제목(List Header) · 줄 사이 선(ListDivider) — SEED List(2026-10-01). 설정 · 메뉴 · 선택 · 키-값 줄과 거래 · 할 일 · 알림 같은 내용 줄을 모두 List 로 그린다. RadioList 는 걷었다 — 하나 고르기는 오른쪽 라디오 줄(`ListRadioItem`).
- 한 줄: 위아래 `spacing-x3` (12) · 좌우 `spacing-global-gutter` (24) · 제목 `t5` 16 · 400 `fg-neutral` · 설명 `t3` 13 `fg-neutral-subtle`(제목 아래 2) — 한 줄 46 · 두 줄 66.
- 앞: 설정 · 메뉴 줄은 아이콘 22(`fg-neutral`), 색이 뜻을 가진 내용 줄은 타일 40(모서리 `radius-r3` 12 · `chart-{색}-weak` 바탕 · 아이콘 20 — 아이콘이 없으면 태그 아이콘, 이체 줄은 회색). 은행 · 카드 같은 물건 줄은 로고 타일 40(Logo Tile), 카드 혜택 줄은 카드 그림 56(Image Frame). 체크 · 라디오는 24, 스위치는 32.
- 뒤: 값 글자(`t5` · `fg-neutral-subtle`) · 오른쪽 화살표 18(화면을 옮기는 줄에만) · 컨트롤 · 작은 버튼.
- 누름 · 호버(웹): 바탕 층이 좌우 6 들어와 모서리 10 의 `bg-layer-default-pressed` 가 되고, 콘텐츠 층만 2px 거리로 준다(v104). 끼운 컨트롤은 따로 줄지 않는다. 포커스 링은 줄 안쪽 2px.
- 강조: 바탕만 옅은 브랜드 색(브랜드 파일의 brand-weak 역할 색 — 누름 · 호버는 한 단계 짙은 짝, 그동안 설명 · 값 글자는 `fg-neutral-muted` 로 4.5:1 을 지킨다).
- 줄 사이 선은 기본 없음 — 필요할 때만 `ListDivider`(1px `stroke-neutral-subtle`, 줄 폭 또는 좌우 24 들임).
- 목록 제목: `t4` 14 · 위아래 8 · 좌우 24 — `mediumWeak`(500 · `fg-neutral-subtle`, 기본) · `boldSolid`(700 · `fg-neutral`).
- 하위 줄(2026-10-10): 부모 · 하위 두 단계에서 줄은 편집을 열고 하위만 접는 목록(카테고리) — 부모 줄 앞 꺾쇠 단추 44(이름 "{카테고리} 하위 카테고리" + `aria-expanded` · 펼치면 90° · 300ms) · 하위 줄은 부모 제목 자리 104 · 하위가 없는 줄도 꺾쇠 자리를 비워 부모 타일이 한 세로줄(52)에 선다(17B). 여러 단계에서 고르는 나무는 Tree View.
- 목록은 흰 바탕(`bg-layer-default`) · 시트(`bg-layer-floating`) 위에 둔다 — 회색 바탕(`bg-layer-basement`) 위에서는 누름 바탕이 보이지 않는다(카드에 담는다).

### Select Box

> 상세 spec(Anatomy / 컨트롤 / 배치 / 상태 / 펼침 / 모션 / Accessibility / Do-Don't)은 [`specs/components/select-box.md`](specs/components/select-box.md)가 단일 SoT, 수치는 `select-box.yaml`. 코드(`recipes/shadcn/components/ui/select-box.tsx`) · 예제(`recipes/shadcn/examples/select-box-examples.mjs`) · preview 4 source 동기.

- 구조: 하나 고르기(Radio Select Box) · 여럿 고르기(Check Select Box) · 묶음(Select Box Group) — SEED Select Box(2026-10-01). 설명 · 아이콘 · 딸린 입력이 붙는 선택지 2 ~ 6개를 견줘 고르고, 저장 · 다음 같은 버튼으로 반영한다. Tile 은 걷었다.
- 상자: 모서리 `radius-r3` (12) · 안쪽 1px `stroke-neutral-weak`. 고르면 안쪽에 2px `stroke-neutral-contrast`(v113)를 덧그린다 — 내용이 밀리지 않고, 바탕은 그대로다(브랜드 색 없음).
- 글자: 제목 `t5` 16 · 500 `fg-neutral` · 설명 `t3` 13 `fg-neutral-muted`(두 줄까지). 앞 아이콘 22(`fg-neutral`).
- 컨트롤은 오른쪽 — 라디오 20(neutral) · 칸 없는 체크(Checkbox Ghost) · 없음(테두리만, 좁은 3열 같은 자리). 컨트롤은 따로 줄지 않고 자기 포커스 링도 그리지 않는다.
- 배치: 1열은 가로형(위아래 16 · 왼쪽 20 · 오른쪽 16, 세로 가운데), 2 ~ 3열은 세로형(위아래 20 · 좌우 16, 앞이 위 · 컨트롤은 위 오른쪽). 묶음 줄 사이 `spacing-component-default` · 열 사이 12, 2열 이상이면 모든 상자가 가장 긴 상자의 높이다. 가장 작은 상자 54.
- 누름 · 호버(웹): 상자 바탕이 `bg-layer-default-pressed` 가 되고 누르는 자리(콘텐츠 + 컨트롤)만 2px 거리로 준다(v104). 키보드 포커스 링은 상자 바깥 2px · 띄움 2px.
- 펼침: 고른 상자 아래로 딸린 입력 · 안내가 열린다(안쪽 좌우 20 · 아래 16, 높이 400ms · 투명도 300ms). 닫히면 보이지 않고 Tab 도 닿지 않는다.
- 누르는 순간 바뀌는 고르기(테마 같은)는 List 의 라디오 줄, 누르면 바로 무언가를 하는 자리는 버튼이다.
- 권한을 주는 여럿 고르기(HR 사용자 역할)도 상자로 고르고 "저장" 한 번으로 반영한다 — 폰 · 데스크톱 같은 모양(2026-10-15 마무리 10A, 위 "마무리" 절).

### Avatar · Avatar Stack

> 2026-10-03 SEED Avatar · Avatar Stack 구조로 다시 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G, 5C · 6B). 수치 원본은 `specs/components/avatar.yaml` · `avatar-stack.yaml`, 쓰는 규칙은 `avatar.md` 다. 옛 Avatar v58 절(24 · 32 · 40 · 56 · 사각 변형 · 최대 3 + "+N more" · 호버 축소 · 상태 점)은 걷었다 — 옛 스펙은 `specs/components/avatar.history/v-pre-seed-display.*`. 머리말의 `avatar` 대비 쌍(`chart-blue` × 흰 글자)은 라이트 이니셜 하나를 잰다.

| | Avatar | Avatar Stack |
|---|---|---|
| 크기 | 20 · 24 · 36 · 42 · 48 · 56 · 64 · 80 · 96 · 108 — 자리마다 대표 크기(한 줄 목록 36 · 두 줄 목록 42 · 줄 안 묶음 24 · Desk 계정 머리 80 · HR 큰 사진 96 · 프로필 수정 108) | 같은 10단계 — 묶음이 정하고 안의 아바타가 모두 따른다 |
| 모양 | 원 하나 · 1px 안쪽 `stroke-neutral-overlay`(투명 — v118, 모든 크기) | 지름 1/4 겹침(−5 ~ −27) · 놓인 바탕색 링 1 ~ 5(`bg-layer-default`, 시트 안은 `bg-layer-floating`) · 뒤가 위 |
| 사진이 없을 때 | 이니셜 + 이름 색 — 차트 10색(v110) 바탕, 글자 `fg-neutral-inverted` 700(지름의 40%, 가장 작아도 10) | 앞 4명 + "+N" 원(같은 크기 · `bg-neutral-weak` + `fg-neutral-muted` 700) |

- **이니셜** = 표시 이름의 첫 글자 하나(로마자는 대문자 — "Kim Minsu" → "K"). **이름 색** = 표시 이름의 유니코드 코드 포인트 합 % 10 → blue · green · orange · violet · pink · indigo · red · yellow · brown · gray(v110 순서) — 웹 · 앱이 같다("김민수" → blue · "이서연" → brown · "Kim Minsu" → indigo). 대비 라이트 4.55 ~ 5.50 · 다크 6.07 ~ 7.70:1 — 다크에서 흰 글자는 2.4:1 이라 쓰지 않는다.
- **사람만 아바타다** — 은행 · 증권 · 카드 같은 물건은 Logo Tile, 카테고리는 List 의 타일이다("이미지" 절). 주식 타일은 증권 화면 차례에 정한다.
- **이름 옆 아바타는 장식**(이름을 한 번만 읽는다), 혼자면 이름을 가진다. 상태(안 낸 사람)는 흐리게 하지 않고 배지 · 글로.

### 날짜 · 시각 고르기 — Date Picker · Time Picker · Wheel Picker

> 2026-10-03 SEED 구조로 새로 정했다(옛 Calendar v61 · Date Range Picker v72 · Time Picker v72 를 대신). 수치 원본은 `specs/components/date-picker.yaml` · `time-picker.yaml` · `wheel-picker.yaml`, 쓰는 규칙은 같은 이름의 `.md`. 옛 Calendar 스펙은 `specs/components/calendar.history/v-pre-seed-date.*`.

날짜 · 시각은 치지 않고 고른다 — 칸은 Input Button 이고, 누르면 1280 미만은 아래 시트 · 이상은 칸 아래 팝오버가 열리며 "완료" 로 넣는다(고르는 동안 칸 값은 그대로, 닫으면 버림).

| 이런 값 | 고르는 것 |
|---|---|
| 날짜 하나 | Date Picker — 한 달, 늘 6주 |
| 기간 | Date Picker 기간 — 칸 하나("9월 28일~10월 6일"), 시트는 이어지는 달 · 팝오버는 두 달, 위에 빠른 기간 칩 |
| 여러 날 | Date Picker 여러 날 — 따로 그린 원 |
| 시각 | Time Picker — 오전·오후 → 시 → 분, 분 간격 기본 5 |
| 날짜 + 시각 | 날짜 칸 + 시각 칸 나란히 |
| 달만(예산 · 홈 · 카드 실적) | Wheel Picker 연 · 월 + "완료" |
| 1 ~ 31(매월 N일 · 결제일) | Select |

| | Date Picker | Time Picker · Wheel Picker |
|---|---|---|
| 크기 | 칸 48(폭 ÷ 7) · 원 42 · 머리 · 요일 48 · 늘 6주 · 팝오버 336 · 두 달 696 | 항목 44 × 5 = 220 · 연 · 월 휠 7칸 · small 36 |
| 글자 | 숫자 `t5` 500 `fg-neutral-muted` · 요일 `t4` 500 `fg-neutral-subtle` · 제목 `t5` 700 | 항목 26 / 35 · 500 — 고른 것 `fg-neutral` · 둘레 `fg-disabled` |
| 상태 | 오늘 옅은 원 `bg-neutral-weak` + 숫자 700 · 고름 `bg-neutral-inverted` · 기간 띠 `bg-neutral-weak` · 앞뒤 달 `fg-disabled`(누르지 못함) · 막힘 `fg-disabled` + 취소선 · 읽기 전용 `stroke-neutral-solid` | 띠 `bg-neutral-weak` 모서리 8 · 좌우 16 들임 · 안개 min(40%, 3칸) |
| 키보드 | WAI-ARIA Grid — ←→ 하루 · ↑↓ 한 주 · PageUp/Down 한 달 · Shift+Page 한 해 | 칼럼마다 Tab · ↑↓ · Home · End |
| 칸 표기 | 올해 "10월 15일 (목)" · 다른 해 "2027년 1월 3일 (일)" · 기간 물결표 | "오후 3:00" |

빠른 기간은 한 벌이다 — 이번 주(일 ~ 토) · 이번 달(1일 ~ 말일) · 지난 달 · 최근 7일 · 30일 · 최근 3개월 · 6개월 · 1년(이번 달을 넣은 달들) · 올해(1월 1일 ~ 12월 31일). 화면은 이 안에서 고른다.

### Field (폼 — 라벨 · 설명 · 오류)

수치 · 규칙의 원본은 `specs/components/field.md` · `field.yaml` 이다 — 2026-10-01 SEED Field 구조로 정했다. 옛 Label · Form 스펙과 v62 Form layout · v75 Form validation 의 규칙을 여기로 합쳤다(옛 글은 바로 앞 백업 `DESIGN.history/v114-korean-line-break.md` 의 Form layout · Form validation 절, 옛 스펙은 `specs/components/label.history/` · `form.history/`). 이 절은 토큰과 닿는 자리만 모은다.

#### 짜임

Field 는 머리(라벨 · 필수 점 또는 "선택" · 보조 액션) · 입력 · 꼬리(설명 또는 오류 · 글자 수)를 8 간격으로 쌓는다. 머리 · 꼬리는 좌우로 2 들어온다. 입력은 Text Input · Textarea · Select · Input Button · Checkbox · Radio · Select Box 묶음이고, 2026-10-09 부터 Slider(머리 오른쪽에 지금 값) · Input OTP · Color Swatch 묶음 · Icon Picker 도 감싼다.

| 부위 | 값 |
|---|---|
| 라벨 | `t5` 16px · 500(bold 700) · `fg-neutral` — 오류여도 그대로 |
| 필수 점 | 6px(0.375rem) `fg-critical` — 라벨 끝, 위 4 · 왼쪽 2. 화면 읽기 프로그램에는 숨기고 칸의 `aria-required` 로 알린다 |
| "선택" | `t4` 14px · 줄 높이 22 · `fg-neutral-subtle` |
| 설명 | `t4` 14px `fg-neutral-subtle`(앞 아이콘 16 은 선택) |
| 오류 | `t4` 14px `fg-critical` + 아이콘 16 — 설명 자리를 대신한다 |
| 글자 수 | `t4` 14px — 쓴 수 `fg-neutral`(비면 `fg-neutral-subtle`), 최대 `fg-neutral-subtle`, 오류면 둘 다 `fg-critical` |
| 폼 | Field 사이 `spacing-x6` (24px) · 나란히 둔 두 칸 사이 `spacing-x4` (16px, 768 미만은 한 줄에 하나) |

대비(라이트 · 다크): 라벨 16.41 · 13.42, 설명 · "선택" 5.50 · 6.09(시트 다크 5.27), 오류 5.06 · 6.08(시트 다크 5.27).

#### 규칙

- 필수 표시는 2/3 규칙 — 한 화면 칸의 2/3 이상이 필수면 선택 칸에만 "선택", 아니면 필수 칸에만 점. 한 폼에 섞지 않는다. 칸이 하나뿐이면 붙이지 않는다.
- 라벨은 칸 위에 둔다 — 왼쪽 라벨 배치(옛 horizontal)는 두지 않는다. 라벨은 명사형, 마침표 없이.
- 오류 글은 무엇을 하면 되는지 짧게(Writing — 해요체 · 마침표) — "휴대폰 번호 10~11자리로 입력해주세요.". 맞음 · 확인 중은 설명 자리에 글로 — 초록 테두리 · 돌림 표시를 두지 않는다.
- 묶음(Checkbox · Radio · Select Box)의 칸 이름 · 오류도 Field 가 그린다 — 라벨이 묶음의 이름(`aria-labelledby`)이다.
- 오류가 생기면 화면 밖 알림 자리(`aria-live="polite"`)가 한 번 읽는다.

#### 검증과 나가기

- 저장 · 신청 버튼은 켜 둔다. 누르면 비거나 틀린 칸마다 오류를 보이고 첫 오류 칸으로 포커스를 옮긴다(제출 시 검증 — 기본). 다 채울 때까지 버튼을 끄지 않는다.
- 잘못 넣으면 위험한 칸(보안 · 금융 — 비밀번호 확인 · 계좌번호 · 송금액)만 칸을 떠날 때 바로 알린다. 입력하는 동안 글자마다 오류를 띄우지 않는다.
- 서버 확인(아이디 중복)은 칸을 떠난 뒤 — 확인하는 동안 설명 자리에 "확인하는 중…", 결과도 설명 · 오류 자리에. 늦게 온 옛 응답이 새 응답을 덮지 않게 이전 요청을 취소한다.
- 작성 · 수정 화면에서 값이 바뀐 채 나가려 하면(뒤로 · 닫기 · 바깥 누름 · 시트 끌어내림) "작성한 내용이 사라져요" 를 묻는다(Alert Dialog). 바뀐 값이 없거나 자동 저장이면 묻지 않는다.

#### 오류 글 꼴(v75 에서 옮겨 Writing 에 맞췄다)

| 규칙 | 오류 글 |
|---|---|
| 필수 | "{칸 이름}을(를) 입력해주세요." · 고르는 칸은 "{칸 이름}을(를) 골라주세요." |
| 최소 · 최대 길이 | "{N}자 이상 입력해주세요." · "{N}자 이내로 입력해주세요." |
| 숫자 범위 | "{N} 이상으로 입력해주세요." · "{N} 이하로 입력해주세요." |
| 형식 | "{칸 이름}을(를) {형식}으로 입력해주세요."(예: "휴대폰 번호 10~11자리로 입력해주세요.") |
| 이메일 | "이메일 주소를 확인해주세요(예: kim@porest.app)." |
| 다시 입력 | "비밀번호가 서로 달라요." |
| 서버 확인 | "이미 쓰고 있는 {칸 이름}이에요." |

`{칸 이름}` 은 라벨과 같게 쓴다 — 오류만 보고도 어느 칸인지 안다.

### 기다림 — Skeleton · Progress Circle · Progress · Content Placeholder · Scroll Fog

> 2026-10-03 SEED Skeleton · Progress Circle · Pull To Refresh · Content Placeholder · Scroll Fog 와 Loading 패턴의 시간표로 새로 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G). 옛 Skeleton / Loading(v63) · Spinner / Progress(v67) 절을 대신한다. 수치 원본은 `specs/components/skeleton.yaml` · `progress-circle.yaml` · `pull-to-refresh.yaml` · `progress.yaml` · `content-placeholder.yaml` · `scroll-fog.yaml`, 쓰는 규칙은 같은 이름의 `.md`(당겨서 새로 고침은 `progress-circle.md`). 옛 스펙은 `skeleton.history` · `spinner.history` · `progress.history` 의 `v-pre-seed-loading.*`. 토큰은 더하지 않았다 — v104 의 `gradient-shimmer-neutral` · `gradient-fade-mask` · `motion-duration-loop` · `motion-ease-easing` 을 쓴다.

#### 나누기

| 이런 때 | 쓰는 것 |
|---|---|
| 목록 · 카드 · 상세를 처음 불러옴 | Skeleton — 틀은 그리고 데이터 자리만 |
| 섹션 새로 고침 · 목록 끝 더 불러오기 · 구조를 그릴 수 없는 화면 | Progress Circle — 요소 안 24 · 콘텐츠 가운데 40 |
| 저장 · 제출 | Button 의 로딩(원 14 · 14 · 16 · 18) |
| 올리기 · 받기 | 값 있는 Progress Circle 24 |
| 앱 목록 · 대시보드를 다시 받음 | 당겨서 새로 고침 — 원판 없는 원 24 |
| 예산 · 목표가 얼마나 찼나 | Progress — 막대(미터) |
| 이미지가 없거나 못 불러옴 | Content Placeholder — Image Frame 이 대체 그림으로 그린다(불러오는 동안은 같은 모서리의 Skeleton, "이미지" 절) |
| 스크롤 영역에 더 있음 | Scroll Fog |

#### 시간표 — 1초 · 5초 · 10초

모든 불러오기가 따른다 — 1초 안에 오면 아무것도 보이지 않고(틀만), 1초부터 스켈레톤 · 원, 5초에 "평소보다 오래 걸리고 있어요.", 10초에 실패(Result Section + "다시 시도"). 요청 제한은 10초이고 저절로 다시 시도하는 것(읽기만)은 그 안에서만이다. 달 · 기간을 바꾸면 머리는 바로 바뀌고 바뀔 숫자 · 목록 자리만 기다린다 — 옛 달 숫자는 지운다. 같은 내용을 다시 받으면 보던 내용을 지우지 않는다(Result Section). 원본은 `specs/components/skeleton.md` 의 "기다리는 동안" 한 곳이다.

#### 모양

| | Skeleton | Progress Circle | Progress | Content Placeholder | Scroll Fog |
|---|---|---|---|---|---|
| 크기 | 내용의 크기 · 글은 그 글자의 줄 높이(14 → 19) | 24(두께 3) · 40(두께 5) · 버튼 안은 Button | 높이 8 | 틀을 채움 · 그림 = 틀 높이의 50%(16 ~ 160) | 기본 20 · 가로 좌우 20 · 세로 위 20 · 아래 80 |
| 모양 | 모서리 글 8 · 그림 자리 4 · 6 · 8(Image Frame 대로) · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0 | 끝이 둥근 호 · 12시 시작 | 모서리 full | 제 모서리 없음 | 마스크 — 색이 없다 |
| 색 | 면 `bg-neutral-weak` + 흰 띠 `gradient-shimmer-neutral`(다크 짝) | 원 `stroke-neutral-solid` · 트랙 `stroke-neutral-subtle`, 톤 brand · staticWhite · inherit | 트랙 `bg-neutral-weak` · 채움 브랜드 글자색(넘친 한도만 `fg-critical`) | 면 `bg-neutral-weak` · 그림 `stroke-neutral-weak` | `gradient-fade-mask` |
| 움직임 | 반짝임 `motion-duration-loop` · `motion-ease-easing` | 1.2초 회전 + 호 · 채움 300ms | 채움 300ms | 없음 | 없음 — 늘 켜짐 |
| 모션 줄이기 | 띠가 멈춘다 | 돌지 않는 3/4 호 | 바로 바뀐다 | — | — |

#### 쓰는 규칙

- 틀(머리 · 탭 · 제목 · 버튼 · 카드 면)은 처음부터 그린다 — 화면을 덮는 회색 막 "Loading" · 틀 없는 화면 가운데 원은 두지 않는다.
- 스켈레톤은 흰 면(`bg-layer-default` · `bg-layer-floating`) 위에만 — 페이지 바탕(`bg-layer-basement`) 위에서는 같은 색이라 사라진다(1.00:1). 깜빡임(펄스)은 두지 않는다.
- 스켈레톤과 원을 한 자리에 같이 쓰지 않는다.
- 막대는 미터다 — 기다림 · 올리기에 쓰지 않는다. 높이 · 색은 하나이고 주의 구간 색 · 달성 색은 없다(달성은 글자 "달성").
- 끝 흐림은 늘 켜 두고 흐린 쪽에 깊이만큼 여백을 둔다 — 시트 · 대화상자의 "넘칠 때만 아래 48"(2026-10-02)은 이것으로 바뀌었다.
- 깨진 이미지 아이콘 · 빈 이미지 칸을 두지 않는다.

#### 접근성

- 기다리는 영역에 `aria-busy`, 화면에 상태 글 하나(`role="status"`) — "불러오는 중…" · "평소보다 오래 걸리고 있어요." 를 한 번씩 읽는다. 결과는 Result Section 이 알린다.
- Progress Circle 은 `role="progressbar"` — 이름 "불러오는 중", 값 글 "40%"(영어 · 세 점을 쓰지 않는다). Progress 는 `role="meter"` — 이름 "식비 예산 400,000원 중 350,000원".
- 스켈레톤 · 끝 흐림 · 대체 그림의 아이콘은 장식이다.

### 이미지 — Image Frame · Aspect Ratio · Logo Tile

> 2026-10-04 SEED Image Frame · Aspect Ratio 와 porest 의 물건 타일 · 카드 그림 규칙으로 새로 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X, 1A · 2A · 3A · 4B · 5A · 6B · 7A · 8A · "따라오는 것"). 수치 원본은 `specs/components/image-frame.yaml` · `card-art.yaml` · `aspect-ratio.yaml` · `logo-tile.yaml`, 기관 색은 `institution-colors.yaml`, 쓰는 규칙은 `image-frame.md` · `aspect-ratio.md` · `logo-tile.md`. 옛 Aspect Ratio(v72) · Carousel(v71) 절은 걷었다 — 옛 스펙은 `specs/components/aspect-ratio.history` · `carousel.history` 의 `v-pre-seed-image.*`. 토큰은 v118 의 `stroke-neutral-overlay` 하나를 더했다(이미지 위 투명 윤곽 — Avatar 의 테두리도 이 색).

#### 나누기

| 보이려는 것 | 쓰는 것 |
|---|---|
| 사람 | Avatar — 원, 사진 또는 이니셜 + 이름 색 |
| 은행 · 증권 · 카드 · 코인 · 금 · 회사(물건) | Logo Tile — 각진 타일, 기관 색 + 첫 글자(그림이 있으면 덮는다) |
| 사진 · 카드 그림 · 규정 그림 | Image Frame |
| 카테고리 · 기능 | List 의 타일 — 옅은 색 + 아이콘 |
| 그림이 아닌 비율 상자(동영상 · 지도) | Aspect Ratio |
| 그림 여러 장 | Scroll Fog `row` 가로 줄 + Indicator("1 / 12" · "+9") — Carousel 은 걷었다 |

#### 모양

| | Image Frame | Logo Tile | Aspect Ratio |
|---|---|---|---|
| 비율 · 크기 | 1:1 · 2:1 · 16:9 · 4:3(기본) · 6:7 · 4:5 · 2:3 · 카드 1.586 | 32 · 40(기본) · 48 | Image Frame 과 같은 여덟, 기본 4:3 |
| 모서리 | 폭으로 — 24 이하 4 · 48 이하 6 · 그 위 8 · 화면 폭 0 | 크기 × 0.3 — 10 · 12 · 14 | 0 |
| 윤곽 | 안쪽 1px `stroke-neutral-overlay`(v118 — 검정 4.7% · 다크 흰 5%), 그림 위에 늘 | 같다 | 없다 |
| 맞춤 | 사진 · 카드 그림 cover, 로고 contain(흰 판 `static-white`) | 카드 그림은 옅은 판 위 카드 전체 · 로고는 흰 판 위 contain | 동영상 cover |
| 불러오는 동안 | 같은 모서리의 Skeleton(면 `bg-neutral-weak` + 반짝임) | 첫 글자 먼저 — 그림이 오면 덮는다 | — |
| 없음 · 실패 | Content Placeholder(10초가 지나도 안 오면 실패) | 첫 글자 그대로 | — |

#### 그림 위 요소

네 모서리에 하나씩, 틀 하나에 둘까지, 틀 가장자리에서 6(`spacing-x1_5`) — 틀의 짧은 변이 80 이상일 때만. 상태 · 분류는 Badge `solid`, 장수 · 길이는 Indicator(알약 · `overlay-dim-dark` 검정 65% 두 모드 같게 · `static-white` 11/15 500 · 좌우 6 · 위아래 2 · 높이 19 — 흰 그림 위 7.00:1). 관심(하트) 버튼 · 콘텐츠 종류 아이콘 · 점 지시자 · 화살표 · 자동 넘김은 두지 않는다.

#### 카드 그림

- 비율 1.586(ISO 카드) — 목록 56 · 혜택 격자 · 상세 모두 같다. 최대 높이로 비율을 바꾸지 않는다.
- 세로 그림(원래 폭 < 높이)은 시계 방향으로 90° 돌려 가로 틀을 cover 로 채운다 — 다 받은 뒤 방향을 정한다.
- 그림이 없으면 아는 카드사는 카드 면(기관 색 한 색 + 회사 · 카드 이름, 폭 96 미만은 회사 첫 글자), 모르는 카드사는 Content Placeholder(카드 아이콘). 광택 띠 · 그라디언트 · 브랜드 파랑 대역은 두지 않는다.
- 상세는 그림이 떠도 카드 이름을 글로 둔다. 단종은 흐리지 않고 "단종" 배지.

#### 기관 색 — 브랜드 hex 는 표 하나에만

은행 · 증권 · 카드사 · 코인 · 금 기관의 브랜드 색은 디자인 토큰이 아니라 데이터다 — 모드를 따르지 않고(라이트 · 다크 같다), 기관이 늘면 행이 는다. 그래서 머리말 `colors` 가 아니라 `specs/components/institution-colors.yaml`(78곳 — 자산 70 + 카드사 8)에 둔다. 브랜드 hex 를 화면 · 컴포넌트 · 제품 코드에 따로 적지 않는다 — 웹 · 앱은 그 표에서 만든 파일(레시피 `lib/institution-colors.ts` — 앱도 같은 표에서)과 찾기 규칙(기관 이름으로만 — 공백을 뺀 이름 · 별칭이 같으면 그 기관, 아니면 든 가장 긴 이름)만 쓴다. 토큰이 아닌 raw 색은 이 표와 차트 팔레트뿐이다(앱의 "chart palette · bank colors 는 raw palette 예외" 가 가리키는 자리).

- 같은 회사는 한 색 — 하나 #008485 · NH농협 #00A651(두 표가 달랐다).
- 글자색은 표의 `text` — 흰 글자(`static-white`)가 4.5:1 이상이면 흰색, 아니면 짙은 글자(라이트 `fg-neutral` · 다크 `fg-neutral-inverted`). 둘 다 모자라던 중간 밝기 다섯 곳은 명도만 고쳤다(원래 색은 `ci`). 78곳 모두 4.52:1 이상이다.
- 표에 없는 기관은 Logo Tile 이 Avatar 의 이름 색(차트 10색 + `fg-neutral-inverted`)을, 카드 면이 Content Placeholder 를 쓴다.

#### 접근성

- 이름 옆 그림 · 타일은 장식이다 — 그림 `alt=""`, 타일은 첫 글자까지 숨긴다. 이름을 한 번만 읽는다. 혼자면 이름(그림의 `alt` · 타일의 `role="img"` + `aria-label`)이고, 실패해도 그 이름이 대체 그림 · 첫 글자에 남는다.
- Indicator 는 보이는 글("+9") 대신 무엇의 수인지 읽는 글("사진 9장 더 있음")을 읽는다.
- 파일 이름 · "Image" · "logo" 를 이름으로 두지 않는다. 마우스에 그림을 키우지 않는다.

### 화면 틀 · 이동 — Top Navigation · Bottom Navigation · Side Navigation · Side Panel · Pagination · Floating Action Button

> 2026-10-04 SEED Top Navigation · Bottom Navigation · Side Navigation · Side Panel · Pagination · Table Pagination · Floating Action Button 구조로 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a, 열하나 + 따라오는 것). 수치 원본은 `specs/components/top-navigation.yaml` · `bottom-navigation.yaml` · `side-navigation.yaml` · `side-panel.yaml` · `pagination.yaml`(+ `infinite-list.yaml`) · `table-pagination.yaml` · `floating-action-button.yaml`, 쓰는 규칙은 각 스펙 md 다. 화면 틀(문턱 · 머리 · 화면을 옮길 때 · 랜드마크)과 안전 영역은 Layout 의 "화면 틀" · "Safe Area" 절. 옛 Sidebar · Sheet(옆 패널) · Pagination 절은 다시 정했고, Breadcrumb · Navigation Menu 는 걷었다(SEED 에 없다 — 데스크톱의 위치는 사이드바의 지금 항목이 알린다).

#### 나누기

| 자리 | 0 – 767 | 768 – 1279 | 1280 이상 |
|---|---|---|---|
| 화면 맨 위 | Top Navigation 56 | Top Navigation(Desk 데스크톱 머리 — HR 은 없음) | 같다 |
| 주 메뉴 | Desk Bottom Navigation · HR ☰ → Side Panel(왼쪽) | Side Navigation 접힘 56 | Side Navigation 펼침 240 |
| 긴 목록 | 끝없이 불러오기 | Pagination | Pagination |
| 데이터 표 | Table Pagination | Table Pagination | Table Pagination |
| 화면의 주 동작 | 탭 바 가운데 + · 탭 바 없는 화면은 Floating Action Button | 머리의 버튼 | 같다 |

#### 모양

| | 값 |
|---|---|
| Top Navigation | 높이 56(위 안전 영역 더함) · `bg-layer-default` · 선 · 그림자 없음 · 아이콘 버튼 상자 44(= 누르는 영역) · 아이콘 24 · 화면 끝 6 · 버튼끼리 붙음 · 제목 왼쪽 — 탭 첫 화면 `text-t8` 22 / 30, 그 아래 `text-t6` 18 / 24, 700 · 글 버튼 44 · 좌우 10 · `text-t5` 500 · 누름 `bg-layer-default-pressed` + 2px 축소 · 알림은 점만 · `z-sticky` |
| Bottom Navigation | 떠 있는 알약 66(줄면 48) · 좌우 14(36) · 아래 max(14, 안전 영역 − 6) · 최대 480 · `bg-layer-floating`(불투명) · `shadow-s3` · 안쪽 1px `stroke-neutral-subtle` · 5칸 · 아이콘 24 · 라벨 `text-t1` 11 / 15 고정 크기 · 500 · 지금 탭 `fg-neutral` + 선 2.5 · 다른 탭 `fg-neutral-subtle` + 선 2 · 가운데 + 원 44 브랜드 채움 · `z-sticky` |
| Side Navigation | 240 · 접힘 56(`layout-sidebar` · `layout-sidebar-collapsed`) · 흰 면 `bg-layer-default` + 오른쪽 1px `stroke-neutral-subtle` · 머리 64 · 접기 버튼 40 · 18 · 항목 44 · 아이콘 20 · `text-t4` 500 · 모서리 10(`radius-r2_5`) · 묶음 이름 `text-t4` 700 · 지금 항목 `bg-neutral-weak-pressed` + `fg-neutral`(굵기 500 그대로 — 2026-10-08) · 접힌 사이드바의 펼침 메뉴는 Menu 표면 · 폭 200 · 줄 44, 1280 미만에서도(Menu Sheet 규칙의 예외 — 2026-10-08) |
| Side Panel | 왼쪽(768 미만 주 메뉴 — 화면 폭의 80%) · 오른쪽(1280 이상 — 480 · 720 · 960) · 높이 전체 · 모서리 · 그림자 · 선 없음 · `bg-layer-floating` · 딤 `overlay-dim-light` · `overlay-dim-dark` · 머리 24 / 24 / 16 · 제목 `text-t8` · 닫기 상자 52 · 아이콘 22 · 넘칠 수 있는 본문은 Scroll Fog 위 20 · 아래 80 · `z-modal` |
| Pagination | 칸 40 × 40 · 사이 0 · `text-t4` 700 · 모서리 8 · 지금 쪽 `bg-neutral-inverted` + `fg-neutral-inverted` · 이전 · 다음 아이콘만 16 · 9칸(480 이상) · 7칸 · 끝 쪽은 40 빈 칸 · 누르는 영역은 위아래만 44 |
| Table Pagination | 한 줄 40 · Select medium(최소 96 · 폭과 상관없이 — Select 1280 규칙의 예외, 2026-10-08) "{n}개" + "씩 보기" · 범위 "11-20" + "/ 총 N개"(목록 최대 240) · 이전 · 다음 40 — 끝에서 막힘 · 표 아래 12 |
| Floating Action Button | 원 56 · 아이콘 24 · 브랜드 채움 · 흰 아이콘 · `shadow-s3` · 오른쪽 아래 화면 끝 · 아래 고정 요소에서 20 + 안전 영역 · 화면에 하나 · `z-sticky` |

#### 쓰는 규칙

- **상단 바** — 높이 56 은 모든 화면이 같다. 스크롤해도 선 · 그림자를 긋지 않는다. 오른쪽 아이콘은 2개 권장 · 3개까지(넘치면 ⋯ + Menu · Menu Sheet), 글 버튼은 하나. ← 는 들어온 화면으로(앞 화면이 없으면 상위 화면), ✕ 는 모달 · 독립 흐름만. 투명 바는 두지 않는다.
- **하단 탭 바** — 다섯 칸이 어느 화면에서나 같다(더 나누면 화면 위 Tabs). 가운데 + 는 그 화면의 추가 — 이름은 화면마다("거래 추가" · "일정 추가"). 아래로 스크롤하면 48 로 줄되 이름은 남고, 누르면 펴진다. 탭마다 스크롤을 기억하고, 지금 탭을 다시 누르면 맨 위 · 첫 화면.
- **사이드바** — 1280 이상 펼침 · 768 ~ 1279 접힘, 손으로 접은 것은 기억. 하위가 있는 항목은 펼치기만, 하위가 지금이면 저절로 펼침. 접혔을 때 하위는 아이콘 옆 펼침 메뉴(1280 미만이어도 Menu Sheet 로 바꾸지 않는다 — 2026-10-08), 단독은 이름 말풍선. 긴 이름은 줄을 바꾼다.
- **옆 패널** — 왼쪽은 768 미만의 주 메뉴(HR 폰 — 이동하면 닫고, 지금 묶음을 펼친 채 연다), 오른쪽은 1280 이상의 보조 작업(1280 미만은 Bottom Sheet). 아래 · 위 패널은 두지 않는다.
- **목록 넘김** — 데스크톱 목록은 Pagination(쪽은 주소에 — 칸은 링크), 폰의 긴 목록은 끝없이 불러오기(받는 중 · 다시 시도 · 끝 글), 데이터 표는 Table Pagination. 칸 40 은 누르는 영역 44(v106)의 예외다(위아래만 44 — 사용자 결정 2026-10-04).
- **떠 있는 버튼** — 탭 바 없는 폰 화면의 주 동작 하나. 글을 붙이거나 스크롤에 접지 않는다.

#### 접근성

- 머리는 `header`(`main` 밖), 주 메뉴는 이름 있는 `nav`("주 메뉴"), 본문 바로가기 링크. 화면을 옮기면 맨 위 + 초점을 제목(`h1`)으로, 문서 제목은 "{화면 제목} - Porest Desk".
- 탭 · 사이드바 항목은 링크 + 지금 화면 `aria-current="page"`(앱은 selected). 사이드바의 부모 · 접기 버튼은 `aria-expanded`. 사이드바의 지금 항목은 한 단계 짙은 바탕 · 짙은 글자로만 보인다 — 굵기는 그대로(1.4.1 ⚠, 사용자 결정 2026-10-08).
- 아이콘만 있는 버튼(상단 바 · + · 떠 있는 버튼)은 이름 필수 — 알림 점은 이름에 넣는다("알림, 새 알림 있음").
- Pagination — `nav` "페이지 탐색" · 칸 "N페이지" · 끝 쪽에서 초점을 지금 쪽으로 · 쪽이 바뀌면 알린다. 칸 40 은 AA(2.5.8) ✓ · AAA(2.5.5) ⚠.

### 입력 — Slider · Toggle · Input OTP · Color Swatch · Icon Picker

> 2026-10-09 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/CwVJDATSmLtwQoH67wh1zj, 1B · 2C · 3B · 4B · 5A · 6B · 7A · 8A · 9A · 10A · 11B · 12C · 13B · 14B · 15A · 16A · 17A · 18A · 19B · 20A · 21A · 22A + 따라오는 것). SEED 가 컴포넌트로 가진 것은 Slider 와 Toggle Button(코드만)뿐이라, 인증 코드 칸 · 색 고르기 · 아이콘 고르기는 SEED 의 원칙(Text Input 의 "Input을 나누지 말고" · Iconography)에서 porest 가 정했다. 수치 원본은 `specs/components/slider.yaml` · `toggle.yaml` · `input-otp.yaml` · `color-swatch.yaml` · `icon-picker.yaml`, 아이콘 세트는 `category-icons.yaml`, 쓰는 규칙은 각 스펙 md 다. 옛 Slider · Toggle · Input OTP(v69) 절은 다시 정했고 Toggle Group 은 걷었다 — 옛 스펙은 각 `.history` 의 `v-pre-seed-input.*`. 토큰은 더하지 않았다.

#### 나누기

| 고르는 것 | 쓰는 것 |
|---|---|
| 범위 안의 자리(임계값 · 비율) · 2 ~ 5단계(별점) | Slider |
| 정확한 숫자 · 금액 | Input — 숫자 키보드 · 뒤 단위 |
| 단추 하나가 그 자리에서 켜고 끄는 상태(관심 · 고정 · 비밀값 보기) | Toggle — 아이콘 단추. 다른 화면으로 가는 눈(금액 가리기 설정)은 Toggle 이 아니다(2026-10-16) |
| 같은 내용을 2 ~ 4가지로 바로 다르게 보기 | Segmented Control |
| 2 ~ 4개 짧은 폼 값 · 거르기 · 제안 | Chip |
| 5개 이상 | Select |
| 누르는 순간 적용되는 설정 줄 | Switch |
| 저장해야 적용되는 켜고 끄기 · 할 일 완료 | Checkbox |
| 메일로 받은 인증 코드 | Input OTP — Input 한 칸 |
| 항목에 붙일 색 | Color Swatch |
| 카테고리 · 저축 목표의 아이콘 | Icon Picker — Input Button + 시트 · 팝오버 |

Toggle Group 은 두지 않는다 — 하나 고르기는 Segmented Control(2 ~ 4) · Chip, 여럿은 Chip, 5개 이상은 Select 다. 글이 있는 켜고 끄기 단추(SEED Toggle Button · 옛 porest Toggle)도 두지 않는다.

#### 모양

| | 값 |
|---|---|
| Slider | 손잡이 줄 44(줄 전체가 누르는 자리) · 트랙 4 `stroke-neutral-weak` · 채움 `fg-neutral` · 손잡이 원 20 `bg-neutral-inverted`(누르는 동안 24) · 테두리 · 그림자 없음 · 머리 값 16 / 22 · 700 · 말풍선 13 / 18 · 500(끄는 동안 · 호버 · 키보드 포커스) · 아래 양 끝 표식 · 눈금은 2 ~ 5 구간만(트랙을 끊는 틈 4) · 막힘 `bg-disabled` · `fg-disabled` |
| Toggle | 보이는 40 · 누르는 44 · 아이콘 20 · 바탕은 누름 · 호버에만 · 끔 `fg-neutral-muted` + 선 2 · 켬 `fg-neutral` + 선 2.5 · 브랜드 채움 위는 흰 아이콘 · 상단 바 안은 상자 44 · 아이콘 24 · 끔도 `fg-neutral`(굵기 · 아이콘으로만 가른다) |
| Input OTP | Input 상자형 한 칸 — large 52 · medium 40 · 숫자만 앞 6자리 · 고정폭 숫자 · 아래 설명 줄 · 다시 받기 Button `neutralWeak` medium(칸 아래 12, 보낸 뒤 60초 막힘) |
| Color Swatch | 원 40 · 누르는 44 · 5 × 2(사이 12 · 폭 248) · 차트 10색(라이트 700 · 다크 800-dark) 진한 채움 · 고름 = 2 띄운 2px `stroke-neutral-contrast` 고리 + 체크 16 `fg-neutral-inverted` |
| Icon Picker | 트리거 Input Button · 1280 미만 Bottom Sheet · 이상 Popover 408 · 찾기 칸 밑줄형 · 묶음 머리 14 · 500 · 칸 48 · 모서리 12 · 아이콘 24 · 고른 칸 안쪽 2px `stroke-neutral-contrast` + 선 2.5 |

#### 쓰는 규칙

- **요청 중에도 막지 않는다** — 누르는 순간 저장되는 Toggle · Switch 와 손을 뗄 때 한 번 저장되는 Slider 는 화면을 바로 바꾸고 요청은 뒤에서 보낸다. 실패하면 되돌리고 그 자리에서 알린다(Slider 는 Field 오류, Toggle 은 Snackbar). 단계마다 저장 · 지연 저장 · 저장 버튼은 두지 않는다.
- **슬라이더 값** — 지금 값은 Field 머리 오른쪽에 늘, 끄는 동안 말풍선, 아래 양 끝 표식. 단계마다 숫자를 늘어놓지 않는다. 2 ~ 5단계 고르기도 Slider 다(옛 "3개 이하 금지" 는 걷었다).
- **켜고 끄는 단추** — 이름은 고정하고 켬은 `aria-pressed`. 아이콘은 지금 상태를 그린다 — 키가 가려져 있으면 `eye-off`. 다른 화면으로 가는 버튼(순자산 카드의 금액 가리기 눈 → 설정)은 켜고 끄는 단추가 아니라 `aria-pressed` 를 달지 않는다(2026-10-16). 모으기 단추(관심 · 고정)의 꺼짐은 사선 없이(Iconography). 켬에 바탕을 칠하지 않는다. 상단 바에서는 끔도 이웃 버튼과 같은 진한 색이다(2026-10-09).
- **인증 코드** — 칸을 나누지 않는다. 붙여넣기 · 자동 채우기에서 숫자만 뽑고(`one-time-code` · 숫자 키보드), 6자리를 채워도 저절로 보내지 않는다. 설명 줄 "10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." 를 늘 두고, 다시 받기 단추는 남은 초를 붙여 막는다 — 시계로 세지 않는다.
- **색** — 새 항목은 v110 배정 순서에서 쓰지 않은 첫 색으로 시작한다(늘 빨강이 아니다). 고치기는 고르지 않으면 색을 바꾸지 않고, 팔레트 밖 색 · 색 없는 항목은 격자 앞 "지금 색" · "자동" 칸으로 보인다. 색을 꼭 고르게 하지 않는다.
- **아이콘** — lucide 전체가 아니라 `category-icons.yaml` 의 세트(148개 · 13 묶음)만 연다. 한국어 이름 · 찾는 말로 찾고, 0건이면 "'{검색어}'에 대한 아이콘이 없어요". "없음" 은 두지 않는다 — 기본은 태그. 세트 밖으로 저장된 아이콘은 그대로 그린다.

#### 접근성

- Slider 이름은 Field 라벨, `aria-valuetext` 에 단위("80%"), 키보드는 APG(포커스한 손잡이의 Home · End, PageUp · PageDown 10단계). 트랙을 눌러도 고른다(끌기 대신).
- Toggle 은 `<button aria-pressed>` + 고정 이름(앱 `Semantics` toggled — 라벨에 상태를 넣지 않는다).
- Input OTP 는 입력 하나 — Field 라벨 · `aria-describedby`(설명 · 오류) · 오류 알림. 코드를 보내면 초점을 칸으로.
- Color Swatch 는 radiogroup(이름 = Field 라벨) · 칸 이름 = 색 이름 · 묶음에 Tab 하나 + 2차원 화살표.
- Icon Picker 격자는 listbox · 칸 이름 = 한국어 이름 · 격자에 Tab 하나 + 2차원 화살표 · 찾으면 결과 수를 한 번 알린다.
- 누르는 영역은 44 이상 — 슬라이더 손잡이 줄 44 · 토글 44 · 색 칸 44 · 아이콘 칸 48. 인증 코드 칸 medium 40 은 1280 이상 데스크톱 웹만이다(Input 과 같다).

### 펼치고 접기 · 나누기 — Accordion · Collapsible · Tree View · Resizable · Scroll Area · Scroll Auto Hide

> 2026-10-10 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H, 1B · 2A · 3A · 4A · 5A · 6A · 7C · 8A · 9A · 10A · 11A · 12B · 13A · 14A · 15A + 따라오는 것, 스펙을 쓰다 나온 16D · 17B). SEED 가 컴포넌트로 가진 것은 Accordion(rootage 3.0.2 · react 2.0.0)과 Breeze 의 Scroll Auto Hide 뿐이라, Collapsible(Accordion 가이드의 한 줄) · 나무 · 나누기 · 스크롤바는 SEED 의 원칙과 porest 의 이웃 결정(List · Card · Side Navigation · Scroll Fog · v104 모션)에서 porest 가 정했다. 수치 원본은 `specs/components/accordion.yaml` · `collapsible.yaml` · `tree-view.yaml` · `resizable.yaml` · `scroll-area.yaml` · `scroll-auto-hide.yaml`, 하위 줄은 `list.yaml`, 카드 안 아코디언은 `card.yaml` 이고 쓰는 규칙은 각 스펙 md 다. 옛 Accordion · Collapsible(v70) · Scroll Area · Resizable(v71) · Treeview(v73) 절은 다시 정했다 — 옛 스펙은 각 `.history` 의 `v-pre-seed-collapse.*`. 토큰은 더하지 않았다.

#### 나누기

| 하는 일 | 쓰는 것 |
|---|---|
| 상세가 긴 항목 여럿을 묶어 접는다(카드 혜택 · 유의사항) | Accordion — 화면 · 카드 안은 `inline`, 혜택 상세 시트 · 대화상자는 `separated` |
| 상세 하나를 접고 편다(분할 내역 · 빠르게 맞추기 · 상세 검색 조건) | Collapsible — Accordion 항목 하나의 모양 |
| 부모 · 하위 두 단계에서 줄은 편집을 열고 하위만 접는다(카테고리) | List 하위 줄 — 줄 앞 꺾쇠 단추 |
| 여러 단계에서 하나를 골라 옆에 그 내용을 본다(HR 부서) | Tree View — APG 트리 |
| 목록 · 상세 두 패널의 목록 폭을 바꾼다(HR 관리, 768 이상) | Resizable `split` |
| 대시보드 위젯의 크기를 바꾼다(HR 편집 모드) | Resizable `widget` + ⋮ "크기" |
| 넘친 내용을 스크롤한다 | Scroll Area — 기본 스크롤 + 전역 스크롤바 한 벌 |
| 목록을 넓게 보려고 보조 머리를 스크롤에 숨긴다(폰 원장 머리) | Scroll Auto Hide |
| 읽어야 하는 긴 글(규정 · 유의사항 제목 · 부서 이름) | 자르지 않는다 — 줄을 바꾼다 |

#### 모양

| | 값 |
|---|---|
| Accordion | 트리거 위아래 16 · 좌우 24 · 제목 16 / 22 · 500 · 설명 13 / 18 · 500 `fg-neutral-subtle` · 꺾쇠 20 `fg-neutral-subtle` · 54(설명이 있으면 74) · 앞 아이콘 22 · 사이 12 · 폰 · 데스크톱 같음 · `inline` 들인 선 24 `stroke-neutral-subtle` · `separated` Card 면(16 · 1px `stroke-neutral-weak` · 사이 8 · 그림자 없음) · 누름 = List 누름(들임 6 · 모서리 10 · `bg-layer-default-pressed` · 콘텐츠만 2px) · 펼친 내용 0 / 24 / 16 · `text-article-note` · `fg-neutral-muted` · 모두 펼치기는 Card 머리 동작 모양(보이는 32 · 누르는 44) · 포커스 링은 트리거 안쪽 |
| Collapsible | 트리거는 Accordion 항목 하나(54 · 74) — 흰 면 · 시트의 줄 · 카드 면의 머리(펼친 내용 아래 24) · 경고 상자의 아래 줄(좌우 16 · 위 선 `stroke-warning-weak` · 누름 `bg-warning-weak-pressed`) |
| List 하위 줄 | 줄 앞 꺾쇠 단추 44(모서리 10 · `chevron-right` 20 · 펼치면 90°) · 줄 앞 4 · 하위 줄은 부모 제목 자리 104 · 하위가 없는 줄도 꺾쇠 자리를 비워 부모 타일이 52 에 선다(17B) |
| Tree View | 줄 44 · 위아래 12 · 좌우 8 · 단계마다 20 · 모서리 10 · `text-t4` · 꺾쇠 16(칸 20 · 표시만 — 누르는 자리는 줄 전체) · 아이콘 16 · 사이 6 · 고름 `bg-neutral-weak-pressed` · 누름 `bg-layer-default-pressed` + 콘텐츠만 2px · 패널 가장자리 8 · 노드 동작 ⋮ 하나(40 · 누르는 44) |
| Resizable | 선 1px `stroke-neutral-weak`(올리기 · 초점 · 끌기에 `stroke-neutral-solid`) · 손잡이 표시 4 × 24 `stroke-neutral-solid` · 누르는 폭 16 · 목록 25%(20 ~ 40%) · 위젯 모서리 24 · 표식 9 × 9 2px `stroke-neutral-solid` · 자리표시 브랜드 옅은 바탕 + 1px 브랜드 점선 · 모서리 16 |
| Scroll Area | 6px 알약 · 막대 `stroke-neutral-solid` · 바탕 투명 · Firefox `thin` + `scrollbar-color` 는 `@supports not selector(::-webkit-scrollbar)` 안 |
| Scroll Auto Hide | 스크롤 상자 맨 위 `sticky` · 스크롤 거리 1:1 · 끝나면 50% 스냅 `motion-duration-d4` `motion-ease-enter` · `translate3d` 로만(높이 그대로) · 바탕 `bg-layer-default` |

#### 쓰는 규칙

- **여럿을 함께 연다** — 아코디언은 늘 여럿을 열고, 목록 머리 오른쪽에 "모두 펼치기"(펼치면 "모두 접기")를 둔다. 항목은 둘 이상이고(하나면 Collapsible) 처음엔 모두 접혀 있다. 상세가 없는 항목은 꺾쇠 없는 그냥 줄이다 — 막힌 트리거 · 꺾쇠만 뒤집히는 줄을 두지 않는다.
- **줄 전체가 트리거** — Accordion · Collapsible 은 줄 전체를 누르고, 머리 글이 곧 이름이다. 이름은 고정하고 펼침은 `aria-expanded` 가 알린다. 줄이 따로 하는 일(편집)이 있으면 줄 앞 꺾쇠 단추 44 로 접는다(카테고리 — "{카테고리} 하위 카테고리").
- **펼쳐도 그 자리에** — 저절로 스크롤하거나 초점을 옮기지 않고, 패널 안에 스크롤 상자를 두지 않는다. 꺾쇠 · 높이는 `motion-duration-d6` `motion-ease-easing` 이고 모션 줄이기면 높이 움직임 없이 150ms 서서히 — 사이드바 하위 펼침 · 나무 · 하위 줄도 같다.
- **자르지 않는다** — 제목 · 이름 · 규정 글은 줄을 바꿔 다 보인다. "더 보기" · 눌러서 상세로 잘린 글을 펼치지 않는다(Typography v114).
- **카드 상세** — 혜택 · 유의사항은 웹 · 앱 모두 카드 안 `inline` 아코디언이고, 혜택 상세 시트 · 대화상자는 `separated` 다.
- **원장 머리** — 폰 가계부의 소비 요약과 월 달력은 하나만 펼친다. 원장 머리(월 · 총액 · 주 달력)는 스크롤하면 숨는다 — 상단 바 · Line Tabs 는 숨지 않고 하단 탭 바는 제 규칙으로 줄어든다.
- **나무** — `Tab` 하나 · 화살표로 다닌다. 줄 전체가 누르는 자리라 부모 줄을 누르면(`Enter` · `Space` 도) 고르면서 펴고 접고, 꺾쇠는 표시만이다(16D — SEED Accordion 의 "터치 영역은 Trigger 전체"). `→` `←` 는 고르지 않고 펴고 접기만 한다. 노드 동작은 나무 밖 ⋮ 하나, 머리말은 두지 않는다.
- **나누기** — HR 관리의 768 이상에서만, 목록 20 ~ 40%(오른쪽은 60% 아래로 줄지 않는다) · 화면마다 폭을 기억 · 손잡이를 한 번 누르면 25 ↔ 40. 위젯 크기는 모서리를 끌거나 ⋮ "크기" 로.
- **스크롤** — 기본 스크롤 + 전역 한 벌이고 Radix ScrollArea 는 걷는다. 세로 스크롤바는 숨기지 않는다(가로 줄만 — Scroll Fog).

#### 접근성

- Accordion · Collapsible 트리거는 `heading > button`(기본 `h3`) · `aria-expanded` · `aria-controls`, 펼친 내용에 `role="region"` 을 두지 않는다. 아코디언 트리거 사이 `↓` `↑`(돌아가며) · `Home` · `End`. 앱은 단추 + 펼침 상태로 읽고, 접힌 내용은 읽지 않는다.
- Tree View 는 `tree` · `treeitem`(`aria-level` · `aria-setsize` · `aria-posinset` · `aria-expanded` · `aria-selected`) · `group`, 나무 전체가 `Tab` 정지점 하나(roving tabindex). `Enter` · `Space` 는 누르기와 같다.
- Resizable 손잡이는 `role="separator"` · 이름 "목록 너비" · `aria-orientation` · 값(지금 · 최소 · 최대 %). 끌지 않는 대안 — 손잡이 한 번 누르기 · 키보드 · 위젯 ⋮ "크기"(WCAG 2.5.7).
- 안에 초점 가는 것이 없는 스크롤 상자는 `tabindex="0"` + `role="region"` + 이름, 시트 · 대화상자 · 팝오버 안 상자는 `overscroll-behavior: contain`. 숨는 머리는 모션 줄이기면 숨지 않고, 그 안으로 초점이 오면 드러난다.
- 누르는 영역 — 트리거 줄 54 이상 · 모두 펼치기 · 꺾쇠 단추 · 나무 줄(부모 줄도 줄 전체 — 꺾쇠만 누르는 자리는 없다) · ⋮ 44. 위젯 모서리 24 는 AAA(2.5.5) ✗ — 같은 일을 ⋮ "크기" 로 한다. 나누기 손잡이 16 은 AA(2.5.8)도 ⚠ — 데스크톱 마우스 경계라 사용자가 정했고(12B) 같은 일을 키보드 · 누르기로 한다.

### 마무리 — Quantity Picker · Attachment Input · Footer

> 2026-10-15 정했다(사용자 결정 — 비교 페이지 https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z, 1A · 2A · 3A · 4A · 5A · 6A · 7B · 8A · 9A · 10A + 따라오는 것, 스펙을 쓰다 나온 11D · 12A · 13B · 14A). SEED 가 컴포넌트로 가진 Quantity Picker · Attachment Input(rootage · React)과 조합 예시인 Footer(블록 코드)를 porest 에 처음 둔다 — 디자인 시스템의 마지막 묶음이다. 같은 날 Command(⌘K · cmdk)를 디자인 시스템과 제품에서 걷었다(아래 "Command" 절) — 그 자리였던 HR 역할 고르기는 Select Box 여럿 + "저장"(10A), 프로필 사진은 Avatar + 늘 보이는 버튼(6A)이다. 수치 원본은 `specs/components/quantity-picker.yaml` · `attachment-input.yaml` · `footer.yaml`(사진 바꾸기는 `avatar.yaml` 의 edit 축), 쓰는 규칙은 각 스펙 md 다. 옛 File Upload(v73) 절은 걷었다 — Attachment Input 이 대신한다. 토큰은 더하지 않았다.

#### 나누기

| 하는 일 | 쓰는 것 |
|---|---|
| 작은 정수를 한 단계씩 — 흔한 값이 열 단계 안쪽(승인 필요 횟수 · 반복 간격 · 부여 시간 · 소요시간) | Quantity Picker |
| 흔한 값이 열 단계보다 먼 정수(반복 거래 "총 n회") · 돈 · 소수 | Input — 숫자 칸 |
| 날짜 부분 · 띄엄띄엄 이름 붙은 값(반복 일자 · 할부) | Select |
| 여럿 · 사진이 섞이는 첨부(거래 영수증 · 메모 · 휴가 증빙) | Attachment Input — 타일 |
| 파일 하나를 골라 바로 넘긴다(CSV · Excel 가져오기) | Attachment Input — 드롭존(1280 이상 웹) · 파일 선택 버튼(1280 미만 · 앱) |
| 사람의 프로필 사진 한 장을 바꾼다 | Avatar + "사진 바꾸기" · "사진 지우기" |
| 여럿을 골라 한 번에 반영한다(HR 사용자 역할) | Select Box 여럿 + "저장" |
| 사이트 맨 아래 — 탐색 · 정책 · 저작권 | Footer — 블록 조립 |

#### 모양

| | 값 |
|---|---|
| Quantity Picker | 상자 1px `stroke-neutral-weak` · `bg-layer-default` · small 36 · medium 40 · large 52(모서리 8 · 8 · 12, 아이콘 16 · 18 · 22, 값 16 / 22 · 16 / 22 · 18 / 24 · 500) · 웹 폼 기본 responsive(1280 미만 52 · 이상 40) · 표 칸 36 · 선 1 × 16 `stroke-neutral-subtle` · 값 칸 좌우 8 · 가장 긴 값의 폭 · 누름 `bg-layer-default-pressed` + 그 버튼만 2px · 36 · 40 버튼은 누르는 자리 44 · 끝 `fg-disabled`(초점은 남는다) · 오류 안쪽 2px `stroke-critical-solid` · 로딩 원 16 · 18 · 22(Button ghost 의 원과 같은 값) |
| Attachment Input | 타일 80 · 모서리 12 · 1px `stroke-neutral-weak` · 아이콘 24 · 개수 12 / 16("3/10") · 사진 80(윤곽 `stroke-neutral-overlay`) · 파일 카드 160 × 80(좌우 16 · 썸네일 칸 48 · 이름 12 / 16 · 500 글자 단위 네 줄 · 넘치면 넷째 줄에 확장자 · 크기 11 / 15) · 사이 8 · × 20(4 걸침 · 구멍 24 · 누르는 44) · 올리는 중 원 24 · 실패 "다시 시도" · 대표 띠 24 · 줄은 화면 여백까지 + 끝 흐림 20 · 드롭존 높이 120 · 1px 실선 `stroke-neutral-solid`(끌기 `stroke-neutral-contrast` + `bg-layer-default-pressed`) · 안내 14 / 19 · 500 + "파일 선택" neutralWeak small · 항목을 누르면 메뉴(크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 \| 지우기) · 읽기 전용 · 끄는 사진은 불투명도 0.5(SEED) |
| Footer | 틀 1040(`layout-max-content`) · 위아래 40 · 좌우 32(1280 미만 24) · 영역 사이 40 · 위 선 · 브랜드 20 / 27 · 700 + 소개 13 / 18 · 사이트맵 열 최소 100 · 사이 32 · 열 제목 13 / 18 · 500 `fg-neutral-muted` · 링크 16 / 22 · 500 사이 16 · 선 `stroke-neutral-subtle` · 안내 영역 사이 16 · 정책 링크 14 / 19 · 500 `fg-neutral-muted` 사이 24 · 안내 글 13 / 18 `fg-neutral-subtle` · 저작권 14 / 19 · 500 · 소셜은 Button ghost large(사이 24) |
| Avatar 사진 바꾸기 | 108 아래 16 에 "사진 바꾸기"(neutralWeak small) · "사진 지우기"(ghost small · 사진이 있을 때만) · 올리는 중 원 위 딤 + 값 있는 원 24 · 실패는 Field 오류 글 |
| HR 역할 고르기 | 칸 없는 체크 상자(이름 16 · 500 + 역할 설명 13) 여럿 + 아래 "저장"(바뀐 것이 없으면 막힘) — 폰 · 데스크톱 같은 모양 |

#### 쓰는 규칙

- **수량 칸은 치지 못한다** — 값 칸은 보기만 하고 한 번에 1 씩이다. 누르고 있어도 반복하지 않고 화살표 키도 없다. 흔한 값이 열 단계보다 먼 자리는 숫자 칸이다. 최소 · 최대는 데이터로 건다(승인 필요 횟수의 최대 = 고를 수 있는 승인자 수). 단위는 값 칸의 글("3회"), 제출은 정수다.
- **옆 칸과 같은 높이** — 수량 칸은 Input 처럼 웹 responsive · 앱 52, 표 칸은 36. 버튼 줄의 48 에 맞추지 않는다.
- **첨부는 한 줄** — 항목은 줄을 바꾸지 않고 옆으로 스크롤하며, 사진 · 파일 카드가 파일 종류대로 섞인다. 다 차면 타일이 막힌다. "n/최대" 는 서버의 개수 한도가 있을 때만 그린다.
- **다시 검사하고 그 자리에서** — `accept` 를 믿지 않고 형식 · 크기 · 개수를 다시 본다. 거절은 Field 오류 글 한 번("10MB 넘는 파일은 올릴 수 없어요."), 올리기 실패는 항목 덮개 + "다시 시도", 진행은 값 있는 원 24 다(막대를 쓰지 않는다).
- **드롭존은 1280 이상 웹만** — 끌어 놓기가 없는 폰 · 앱은 "파일 선택" 버튼 + 파일 카드다. 상자 전체를 누르는 자리로 두지 않는다 — 키보드는 버튼으로 닿는다.
- **흐림은 사진의 두 상태만** — 막힘은 불투명도로 흐리지 않는다(v106). 예외로 사진 항목의 읽기 전용 · 끄는 중은 SEED 그대로 불투명도 0.5 이고, 파일 카드는 글 · 아이콘이 `fg-disabled` 다(사용자 결정 13B).
- **누르면 메뉴** — 항목을 누르면 1280 미만 Menu Sheet · 이상 Menu 로 크게 보기 · 대표로 정하기 · 앞으로 옮기기 · 뒤로 옮기기 | 지우기 — 끌지 않고 순서를 바꾸는 길이다(14A). 끝에서는 그 방향이 막히고, × 는 지름길로 남는다.
- **파일 이름** — 글자 단위로 네 줄까지 보이고(Typography v114 의 예외 — 11D), 넘치면 셋째 줄 끝을 "…" 로 줄이고 넷째 줄에 확장자를 남긴다. 보조 기술에는 전체 이름을 준다.
- **프로필 사진** — 늘 보이는 버튼으로 바꾸고 지운다. 마우스를 올려야 나타나는 덮개를 두지 않는다.
- **바닥은 블록 조립** — 순서는 SEED 그대로이고 필수 블록이 없다. 사업자 정보 · 연락처 · 소셜은 값이 생기면 넣는다(지어내지 않는다). 개인정보 처리방침은 로그인 전에도 닿는 바닥에 둔다. 저작권은 "© {해} POREST" 한 벌이다(홈 · SSO 로그인 · HR 문서 · Desk 설명서). porest-home 은 짜임 · 간격 · 글 크기만 따르고 색 · 글꼴은 홈 것을 쓴다 — 안내 글은 4.5 이상으로 짙게 한다.
- **권한은 저장 한 번** — 역할처럼 권한을 주는 여럿 고르기는 누를 때마다 저장하지 않는다.

#### 접근성

- Quantity Picker 는 `role="group"` + 이름(Field 라벨)이다. 버튼 이름은 "줄이기" · "늘리기", 끝은 `aria-disabled`(초점이 남는다), 값 칸은 `aria-live="polite"` · `aria-atomic`, 로딩은 `aria-busy`.
- Attachment Input 의 타일 이름은 "{칸 이름} 첨부, 3/10", × 는 "{파일 이름} 지우기", 항목 이름은 전체 파일 이름 + 크기 + 상태다. 포커스 링은 모두 부품 안쪽이다(가로 스크롤 줄이 바깥 링을 자른다). 순서 바꾸기는 끌기 · 항목 메뉴(포인터 한 번 — 2.5.7 ✓) · 키보드(Space · ← → · Space · Esc, 한국어 읽기 글) 셋으로 한다. 드롭존의 키보드 길은 "파일 선택" 버튼이다.
- Footer 는 `<footer>`(contentinfo) · 사이트맵 `<nav aria-label="사이트 지도">` 이고, 새 탭 링크는 보이지 않는 "(새 탭)" + ↗(장식)이다.
- 누르는 영역 — 수량 버튼 · × 는 보이지 않는 여백으로 44, 첨부 타일 80, "파일 선택" 은 Button 의 44. 바닥의 글 링크(22 · 19)는 AAA ⚠ — SEED 와 같고, 간격 예외로 AA 는 ✓.

### Pagination (v67 추가)

> 2026-10-04 다시 정했다 — 위 "화면 틀 · 이동" 절과 `specs/components/pagination.md` · `table-pagination.md`(SEED Pagination · Table Pagination). 옛 numbered · prev-next · load-more 변형, 지금 쪽 primary 채움, sm 32 · md 40 · lg 48 은 걷었다 — 폰의 긴 목록은 끝없이 불러오기이고 "더 보기" 버튼은 두지 않는다. 옛 스펙은 `specs/components/pagination.history/v-pre-seed-nav.*`.

### Sheet — 옆 패널 (v67 추가)

> 2026-10-04 다시 정했다 — 옆 패널은 Side Panel(`specs/components/side-panel.md` — 왼쪽 · 오른쪽만, 평평). 위 "화면 틀 · 이동" 절. 아래에서 올라오는 것은 Bottom Sheet, 위에서 내려오는 패널은 걷었다. 옛 스펙은 `specs/components/sheet.history/v-pre-seed-nav.*`.

### Spinner / Progress (v67 추가)

> 2026-10-03 걷었다 — 스피너는 Progress Circle, 막대는 미터인 Progress 다(위 "기다림" 절, `specs/components/progress-circle.md` · `progress.md`). 옛 스펙은 `spinner.history` · `progress.history` 의 `v-pre-seed-loading.*`.

### Stepper (v67 추가 · 기록 — 아직 SEED 와 다시 정하지 않았다)

다단계 form / 결재 흐름 / onboarding 시각화. **새 토큰 0** — primary + semantic + spacing 합성.

#### Variant
| Variant | 방향 | 사용 |
|---|---|---|
| **horizontal** (default) | 좌→우 | desktop form (HR 휴가 신청 3단계, Desk 가계부 분류 설정) |
| **vertical** | 위→아래 | mobile 또는 단계 라벨 길어 horizontal 부적절 시 |
| **simple progress** | 점 dot 진행 | minimal (Desk onboarding 5단계 dot indicator) |

#### State
| State | 시각 (step circle) |
|---|---|
| **completed** | `success` 채움 + ✓ icon (`text-on-accent`) |
| **current** | `primary` 채움 + 단계 번호 (`text-on-accent`) + outer ring `border-focus` 2px |
| **pending** | `surface-input` 배경 + 단계 번호 (`text-tertiary`) |
| **error** | `error` 채움 + `!` icon (단계 검증 실패) |
| **disabled** (skip 가능 단계) | `text-disabled` + opacity 0.5 |

#### Anatomy
- step circle: 32×32 default, sm 24, lg 40 (`touch-min` 44 충족 위해 sm은 padding 보강)
- 라벨: circle 아래 (horizontal) 또는 우측 (vertical), `caption` (12/400)
- connector line: step 사이 1px `border-default` (pending) 또는 2px `success` (completed)
- gap: step 사이 `lg` (16px) horizontal, `md` (12px) vertical

#### Layout
- horizontal: viewport `breakpoint-md` (768px) 이상에서만 사용. 그 이하는 vertical 자동 전환
- vertical: 좌측 dot column + 우측 라벨/내용
- 4단계 이상: 모바일에서 vertical 권장 (horizontal 너무 좁음)

#### Sequential vs Free navigation
- **sequential** (default): 이전 단계 완료 후 다음 단계 진입 가능. 비완료 단계 클릭 비활성
- **free**: 모든 단계 자유 이동 (settings 메뉴 등). 단, 의존성 있는 단계는 disabled

#### Motion
- 단계 전환: completed↔current 색 트랜지션 `motion-duration-base` (200ms) `motion-ease-out`
- connector line fill (next step 진입 시): width 0 → 100% `motion-duration-slow` (300ms) `motion-ease-out`
- error 단계: 진동 (`shake` keyframes 200ms) — `prefers-reduced-motion: reduce` 시 색만 변화

#### Accessibility
- [ ] `<nav aria-label="결재 단계">` wrapper
- [ ] `<ol>` + `<li>` (semantic order)
- [ ] current step `aria-current="step"`
- [ ] completed step `aria-label="단계 1: 신청자 정보, 완료"`, current `aria-label="단계 2: 기간 입력, 현재"`, pending `aria-label="단계 3: 사유, 미진행"`
- [ ] 키보드: Tab으로 단계 이동 (sequential은 disabled 단계 skip)
- [ ] sequential mode 진입 차단 시 screen reader "이전 단계 완료 후 진입 가능" 안내
- [ ] error 단계: `aria-invalid="true"` + alert text 동반

#### HR / Desk 듀얼 브랜드
spec brand-neutral. brand 파일 — HR(결재 단계 horizontal, sequential), Desk(onboarding dot indicator simple, free 옵션).

### Breadcrumb (v68 추가)

> 2026-10-04 걷었다 — SEED 에 없고, 데스크톱의 위치는 사이드바의 지금 항목(부모 자동 펼침)과 본문 제목이 알린다(화면 틀 · 이동 결정 9). 옛 스펙은 `specs/components/breadcrumb.history/v-pre-seed-nav.*`.

### Sidebar (v68 추가)

> 2026-10-04 다시 정했다 — Side Navigation(`specs/components/side-navigation.md` — 240 · 접힘 56 · 머리 64 · 항목 44). 위 "화면 틀 · 이동" 절. 옛 스펙은 `specs/components/sidebar.history/v-pre-seed-nav.*`.

### Navigation Menu (v68 추가)

> 2026-10-04 걷었다 — 데스크톱 머리의 메가 메뉴는 두 제품 모두 쓰는 곳이 없다(화면 틀 · 이동 추가 결정). 접힌 사이드바의 하위 펼침 메뉴는 Side Navigation 안에서 Menu 모양으로 정한다. 옛 스펙은 `specs/components/navigation-menu.history/v-pre-seed-nav.*`.

### Menubar (v68 추가)

> 2026-10-02 걷었다 — 세 제품 모두 쓰는 곳이 없다(메뉴 · 툴팁 결정 6). 옛 스펙은 `specs/components/menubar.history/v-pre-seed-menu.*`. 줄 · 화면의 동작은 "메뉴 · 메뉴 시트 · 도움말 말풍선 · 툴팁" 절.

### Command (Cmd+K menu, v68 추가)

> 2026-10-15 걷었다 — 세 제품 모두 ⌘K 팔레트를 쓰지 않는다(Desk 웹 팔레트는 2026-09-01 에 지웠다). cmdk 는 고르기 칸 두 곳의 검색 목록으로만 남아 있었다 — Desk 카드 상품 고르기(쓰는 곳 없음)는 지우고, HR 역할 고르기는 Select Box 여럿 고르기(`CheckSelectBox` — 이름 + 역할 설명) + 아래 "저장" 한 번으로 바꾼다(마무리 10A — 폰 · 데스크톱 같은 모양, 아래 "마무리" 절 · `specs/components/select-box.md`). 옛 스펙은 `specs/components/command.history/v-pre-drop.*`. 검색해 고르는 긴 목록은 Input Button + Searchable List.

#### HR / Desk 듀얼 브랜드 (v68 5종 공통)
spec brand-neutral. 사이드바 · 머리 메뉴는 2026-10-04 "화면 틀 · 이동" 절로 옮겼다(Menubar 는 2026-10-02 걷었다).

### Combobox (v69 추가)

> 2026-10-15 걷었다 — 칸에 바로 치는 콤보박스를 두지 않는다. 짧은 선택지는 Select, 검색해 고르는 긴 목록은 Input Button 이 여는 Searchable List 다(SEED 도 Combobox 를 두지 않는다 — Select 문서). 쓰는 곳 없는 카탈로그 항목만 남아 있었다.

### Slider (v69 추가)

> 2026-10-09 다시 정했다 — 위 "입력" 절과 `specs/components/slider.md`(SEED Slider). 옛 브랜드 채움 · 흰 손잡이 16 + 브랜드 테두리 · 그림자 · 손잡이 위 · 옆 라벨 · 5 / 10 단위 가는 눈금 · 세로 슬라이더 · 호버 1.1배 · 불투명도 막힘 · PageUp ±10% 는 걷었다. 옛 스펙은 `specs/components/slider.history/v-pre-seed-input.*`.

### Toggle (v69 추가)

> 2026-10-09 다시 정했다 — 켜고 끄는 아이콘 단추 하나(위 "입력" 절과 `specs/components/toggle.md`). 글 · 아이콘 + 글 변형, 켬의 바탕 · 테두리, 불투명도 막힘은 걷었다 — 거르기는 Chip, 설정은 Switch 이고 서식 툴바는 쓰는 곳이 없다. 옛 스펙은 `specs/components/toggle.history/v-pre-seed-input.*`.

### Toggle Group (v69 추가)

> 2026-10-09 걷었다 — 하나 고르기 2 ~ 4칸은 Segmented Control, 여럿 · 짧은 폼 값은 Chip, 5개 이상은 Select 다(위 "입력" 절). 옛 스펙은 `specs/components/toggle-group.history/v-pre-seed-input.*`.

### Input OTP (v69 추가)

> 2026-10-09 다시 정했다 — Input 한 칸(위 "입력" 절과 `specs/components/input-otp.md`). 칸마다 입력 · 6칸 · 3-3 구분 · 자동 다음 칸은 걷었다 — 칸을 나누지 않는다(SEED Text Input). 옛 스펙은 `specs/components/input-otp.history/v-pre-seed-input.*`.

#### HR / Desk 듀얼 브랜드 (v69 5종 공통)
spec brand-neutral. Slider · Toggle · Input OTP 의 쓰는 자리는 2026-10-09 "입력 — HR" · "입력 — Desk" 절로 옮겼다(Toggle Group 은 걷었다).

### Accordion (v70 추가)

> 2026-10-10 다시 정했다 — 위 "펼치고 접기 · 나누기" 절과 `specs/components/accordion.md`(SEED Accordion). 옛 single 기본 · 트리거 `surface-default` 바탕 + 1px 테두리 · 호버 바탕 · 펼침 200ms + 투명도 · 꺾쇠 150ms · 모션 줄이기면 즉시 · 펼친 내용 `region` 은 걷었다 — 늘 여럿 + 모두 펼치기, 펼침은 300ms · 줄이기면 150ms 서서히. 옛 스펙은 `specs/components/accordion.history/v-pre-seed-collapse.*`.

### Collapsible (v70 추가)

> 2026-10-10 다시 정했다 — 트리거는 Accordion 항목 하나의 모양(위 "펼치고 접기 · 나누기" 절과 `specs/components/collapsible.md`). 옛 글 · 아이콘 + 글 트리거 · "자세히" · 긴 코드 접기 쓰임 · 펼친 내용 `region` 은 걷었다 — 잘린 글은 펼치지 않고 자르지 않는다. 옛 스펙은 `specs/components/collapsible.history/v-pre-seed-collapse.md`.

### Hover Card (v70 추가)

> 2026-10-02 걷었다 — 쓰는 곳이 없다(메뉴 · 툴팁 결정 6). 옛 스펙은 `specs/components/hover-card.history/v-pre-seed-menu.*`. 짧은 설명은 Tooltip · Help Bubble, 버튼이 있는 내용은 Popover.

### Context Menu (v70 추가)

> 2026-10-02 걷었다 — 쓰는 곳이 없다(메뉴 · 툴팁 결정 6). 옛 스펙은 `specs/components/context-menu.history/v-pre-seed-menu.*`. 우클릭 · 길게 누르기로만 열리는 메뉴는 두지 않는다 — 줄의 동작은 줄 끝 ⋮.

### Alert Dialog (v70 추가)

> 2026-10-02 SEED Alert Dialog 로 다시 정했다 — 위 "시트 · 대화상자 · 확인창 · 팝오버" 절과 `specs/components/alert-dialog.md` 를 따른다.

### Table

> 2026-10-08 — 원본은 [`specs/components/table.md`](specs/components/table.md) · `table.yaml`(SEED 문서 표 · 디자인 그림). 옛 Table · Data Table(v71)을 합쳤다 — 회색 대문자 머리 · 머리 바탕 · 줄무늬 · compact · 고른 줄 브랜드 8% + 왼쪽 선 · 칸 사이 화살표 이동 · 열 크기 조절 · 열 순서 바꾸기는 걷었다.

| 자리 | 값 |
|---|---|
| 머리 줄 | 41 — 위아래 10 · 좌우 16 · 14 / 20 · 500 · `fg-neutral`, 바탕 없음 |
| 본문 줄 | 45 — 위아래 12 · 좌우 16 · 14 / 20 · 400. 썸네일 · 두 줄 칸이 있으면 72 |
| 줄 선 | 1px `stroke-neutral-subtle` — 마지막 줄까지, 세로 선 · 줄무늬 없음 |
| 숫자 열 | 오른쪽 + 고정폭 숫자(머리도), 고정폭 글꼴 없음 · 돈은 원까지 · 빼기 U+2212 |
| 정렬 | 머리 칸 전체가 버튼 · ↑↓ 늘 보임(`fg-neutral-muted`, 지금 방향만 `fg-neutral`) · `aria-sort` · 누를 때마다 내림 ↔ 오름 두 단계(숫자 · 날짜 열은 처음 내림) |
| 줄 동작 | 줄 끝 ⋮(보이는 40 · 누르는 44 · "{줄} 더보기", 머리 글 없음) · 줄을 누르면 상세 |
| 선택 | 첫 열 Checkbox 24 · 고른 줄은 바탕 없이 체크로만 · 고른 줄이 있으면 표 위 일괄 작업 바(브랜드 파일의 brand-weak 역할 색 한 값 · 48 · 모서리 12) |
| 768 미만 | List 줄 — 첫 열은 제목, 다음 열 1 ~ 2개는 설명, 핵심 숫자 · 상태는 오른쪽 값, 나머지는 상세. 넘김은 끝없이 불러오기 |
| 빈 · 실패 · 로딩 | 머리는 그리고 본문 자리에 줄 스켈레톤 · Result Section `medium`(실패는 다시 시도) |
| 의미 | `<table>` · `<caption>` · `<th scope>` · `aria-sort` — 표처럼 보이는 `div` 격자를 두지 않는다 |
| 넘김 | 표 아래 Table Pagination |

### Data Table (v71 추가)

> 2026-10-08 걷었다 — 위 Table 절과 `specs/components/table.md` 로 합쳤다(정렬 · 선택 · 일괄 작업 · 머리 고정 · 넘김). 열 거르기 · 표 위 검색 · 열 보이기 바꾸기 · 내보내기 줄은 이번에 정하지 않았다.

### Carousel (v71 추가)

> 2026-10-04 걷었다 — 세 제품에 쓰는 곳이 0이고 SEED 에도 캐러셀 컴포넌트가 없다(사용자 결정 — 이미지 비교 7A). 그림 여러 장은 끝이 보이는 가로 줄(Scroll Fog `row`)에 Image Frame 을 잇고, 장수는 Indicator 글("1 / 12" · "+9")로 알린다 — "이미지 — Image Frame · Aspect Ratio · Logo Tile" 절. 점 지시자 · 화살표 · 자동 넘김은 두지 않는다. 옛 스펙은 `specs/components/carousel.history/v-pre-seed-image.*`.

### Scroll Area (v71 추가)

> 2026-10-10 다시 정했다 — 기본 스크롤 + 전역 스크롤바 한 벌(위 "펼치고 접기 · 나누기" 절과 `specs/components/scroll-area.md`). 옛 always-visible · hover · scrolling 변형 · 6 ~ 8px · `surface-input` 바탕 · 불투명도 0.4 ~ 1 · "필요 시 이름" 은 걷었다 — 6px 알약 · Firefox 두 줄은 `@supports not selector(::-webkit-scrollbar)` 안 · 초점 가는 것이 없는 상자는 `tabindex="0"` + 이름. 옛 스펙은 `specs/components/scroll-area.history/v-pre-seed-collapse.*`.

### Resizable (v71 추가)

> 2026-10-10 다시 정했다 — HR 관리 화면 나누기 · 대시보드 위젯 크기(위 "펼치고 접기 · 나누기" 절과 `specs/components/resizable.md`). 옛 손잡이 4 ~ 6px · hover 브랜드 색 · 세로 · 중첩 · snap 25 / 50 / 75% · ±1% · `Enter` · `Space` 로 접기 · "localStorage 권장" 은 걷었다 — 선 1px + 손잡이 표시 · 누르는 폭 16 · 5% · 목록 20 ~ 40% · 화면마다 기억 · 한 번 누르면 25 ↔ 40. 옛 스펙은 `specs/components/resizable.history/v-pre-seed-collapse.*`.

#### HR / Desk 듀얼 브랜드 (v71 5종 공통)
spec brand-neutral. Scroll Area · Resizable 의 쓰는 자리는 2026-10-10 "펼치고 접기 · 나누기 — HR" · "— Desk" 절로 옮겼다. Table · Data Table 은 2026-10-08 Table 절로 합쳤고, Carousel 은 2026-10-04 걷었다.

### Sonner (v72 추가, Toast 강화)

> 2026-10-02 걷었다 — Snackbar 로 바꿨다("알림 메시지 — Snackbar · Callout · Page Banner · Result Section" 절). 옛 스펙은 `specs/components/sonner.history/v-pre-seed-feedback.*`.

### Aspect Ratio (v72 추가)

> 2026-10-04 SEED Aspect Ratio 로 다시 정했다 — "이미지 — Image Frame · Aspect Ratio · Logo Tile" 절과 `specs/components/aspect-ratio.md`. 그림이 아닌 자리(동영상 · 지도)의 비율 상자이고, 비율은 Image Frame 과 같은 여덟 가지다(기본 4:3 — 옛 16:9 기본 · 3:2 · 21:9 · 9:16 을 걷었다). 그림은 Image Frame 이다. 옛 스펙은 `specs/components/aspect-ratio.history/v-pre-seed-image.*`.

### Chart

> 2026-10-08 — 원본은 [`specs/components/chart.md`](specs/components/chart.md) · `chart.yaml`. 색은 Colors 의 v110 · v111 이다. 옛 v72 의 아래 범례 · hover card 툴팁 · 16:9 · 데이터 점마다 `tabindex` 는 걷었다.

| 자리 | 값 |
|---|---|
| 색 | 차트 10색 — 라이트 700 · 다크 800-dark. 저장된 색 먼저, 색이 없는 항목은 그 차트에서 아직 쓰지 않은 색부터 배정 순서로. 회색은 "기타" 전용 |
| 눈금 글자 | 11 / 15(`text-t1`) · `fg-neutral-subtle` · 고정폭 숫자 — 이중 축이면 그 계열의 색. 돈 축만 "만" 으로 줄인다 |
| 격자 | 가로 점선(3 · 3) `stroke-neutral-subtle` 만 — 세로 격자 · 축 선 없음 |
| 이중 축 | 크기가 열 배 넘게 다른 두 계열(수입 · 지출) — 왼쪽 · 오른쪽 눈금 |
| 툴팁 | 떠 있는 표면 `bg-layer-floating` · `shadow-s3` · 모서리 12 — 머리 12 · `fg-neutral-subtle`, 줄 "■ 라벨 값"(값 700 · 원까지) |
| 선 · 막대 범례 | 차트 위 지표 타일(점 + 이름 + 합계, 켠 계열 바탕 chart-{색}-subtle) — 누르면 계열을 켜고 끈다 |
| 도넛 범례 | 카테고리 목록(색 네모 + 이름 + % + 금액 "원") · 가운데 합계도 원까지 |
| 열지도 | 칸 정사각형 · 모서리 4 · 사이 6, 세기 다섯(브랜드 채움 18 ~ 100%) — 칸 폭 112 이상에서만 금액을 원까지(11 · 700), 좁으면 세기 색만 · 값은 툴팁 · 표로 보기 |
| 가로축 | 오늘에서 끝난다 — 오늘 뒤 날짜를 0 으로 그리지 않는다 |
| 빈 · 실패 · 로딩 | 차트 자리 Skeleton(모서리 16) · Result Section `medium`(실패는 다시 시도) |
| 보조 기술 | 차트 상자 `role="img"` + 요약 이름 · 범례 목록이 대체 · "표로 보기" · 모션 줄이기면 바로 그린다 |

### Date Range Picker (v72 추가)

> 2026-10-03 걷었다 — 기간은 Date Picker 기간("날짜 · 시각 고르기" 절)이다. 칸 하나 · 달력 하나, 빠른 기간은 한 벌(옛 "오늘 / 어제 / 지난 7일 …" + "취소 · 적용" 을 대신).

### Time Picker (v72 추가)

> 2026-10-03 걷었다 — 시각은 Time Picker("날짜 · 시각 고르기" 절 · `specs/components/time-picker.md`)다. 치는 칸 · 24시간("14:30")을 오전·오후 12시간 휠로 바꿨다.

#### HR / Desk 듀얼 브랜드 (v72 5종 공통)
spec brand-neutral. brand 파일 — HR(Sonner top-right 결재 알림 stack / Chart bar/line dashboard / Date Range Picker dual desktop / Time Picker 결재 일정 5분 step), Desk(Sonner bottom-center 모바일 / Chart pie 가계부 카테고리 / Aspect Ratio 16:9 메모 attachment / Date Range Picker single 모바일).

### Banner (v73 추가)

> 2026-10-02 걷었다 — 화면 안 안내는 Callout, 페이지 맨 위 띠는 Page Banner 다("알림 메시지 — Snackbar · Callout · Page Banner · Result Section" 절).

### Chip

수치 · 규칙의 원본은 `specs/components/chip.md` · `chip.yaml` 이다 — 2026-10-02 SEED Chip 구조로 새로 정했다(옛 v73 Tag / Chip 을 대신한다). 고르거나 넣은 값을 보이는 작은 알약이고, 누를 수 없는 표시(상태 · 분류 · 메타)는 Badge · Tag Group 이다(위 "Badge · Notification Badge · Tag Group" 절). 이 절은 토큰과 닿는 자리만 모은다.

#### 쓰임

| 쓰임 | 의미 | 고른 모습 |
|---|---|---|
| 고르기 — 하나(2 ~ 4개 짧은 폼 값 · 거르기의 한 축) | 라디오 — 다시 눌러도 풀리지 않는다, "전체" 는 맨 앞 선택지 | 있다 |
| 고르기 — 여럿 | 체크박스 — 다시 누르면 풀린다, "전체 선택" 칩은 두지 않는다 | 있다 |
| 제안(빠른 금액 · 빠른 기간 · 프리셋) | 버튼 — 누르면 칸에 값을 넣는다 | 없다 |
| 필터 바(목록 위, 조건마다 칩 · 뒤 아래 화살표) | 버튼 — 그 조건만 시트 · 팝오버로 연다 | 걸린 조건은 짙은 채움 + 값 요약("식비 외 2개") |
| 입력값 | 글 + "{글} 지우기" 버튼 | Outline Weak 고른 모습 |

#### 모양과 색

| 요소 | 값 |
|---|---|
| 크기 | `small` 32 · `medium` 36(기본) · `large` 40, 모서리 `radius-full`, 글 `t4` 14 · 500(세 크기 같다), 좌우 12 · 14 · 16, 앞 아이콘 14 · 16 · 16 과 글 사이 6 |
| Solid | 안 고름 `bg-neutral-weak-alpha`(투명 — 회색 바닥 · 흰 표면 어디서나, v120) · 고름 `bg-neutral-inverted` + `fg-neutral-inverted` |
| Outline Strong | 안 고름 투명 + 안쪽 1px `stroke-neutral-weak` · 고름 `bg-neutral-inverted`(테두리 없음) |
| Outline Weak(기본) | 안 고름 투명 + 1px `stroke-neutral-weak` · 고름 `bg-neutral-weak` + 1px `stroke-neutral-contrast`(글자 그대로) |
| 누름 · 호버 | `bg-neutral-weak-pressed` · `bg-layer-default-pressed` · `bg-neutral-inverted-pressed`, 칩 전체 2px 거리 축소(v104) |
| 비활성 | `bg-disabled` · `fg-disabled`(흐림 없음 — v106). 고른 채 막히면 1px `stroke-neutral-solid` 를 남긴다 |
| 묶음 | 칩 사이 `spacing-between-chips`(8). 폼 · 시트 안은 줄바꿈(줄 사이 8), 목록 위 줄은 가로 스크롤(안쪽 여백 `spacing-global-gutter`) |

고른 칩은 브랜드 색이 아니라 중립색이다 — Desk · HR 이 같고, 고른 칩이 여럿 보여도 브랜드 버튼과 다투지 않는다(사용자 결정 2026-10-02).

#### 쓰는 규칙

- 2 ~ 4개 짧은 폼 값은 Chip, 5개 이상은 Select, 글이 긴 2 ~ 4개는 Radio · Checkbox.
- 3상태 칩(고름 → 빼고 → 해제)은 두지 않는다 — 빼는 조건은 "고른 것만 · 고른 것 빼고" 를 먼저 고른다.
- 제안 칩은 고른 모습으로 남기지 않는다. 필터 바는 걸린 조건 칩의 글이 곧 조건이라 "필터 2" 같은 개수를 따로 두지 않는다.
- 칩 모양 탭(Tabs 의 Chip Tabs)과 필터 칩을 한 화면에 같은 모양으로 두지 않는다 — 탭을 Line 으로.

#### Accessibility 체크리스트
- [ ] 하나 고르기 `radiogroup`(화살표로 옮기면 고른다) · 여럿 체크박스 · 제안 · 여는 칩은 버튼(여는 칩 `aria-haspopup="dialog"`) — `aria-pressed` 는 쓰지 않는다
- [ ] 묶음 이름은 Field 라벨 · `aria-label`, 아이콘만 있는 칩은 `aria-label`
- [ ] 키보드 포커스에만 링 2px · 띄움 2px, 누르는 영역은 가로 · 세로 44 까지(아이콘만 있는 칩도)
- [ ] 입력값 지우기 이름 "{글} 지우기", 지운 뒤 포커스는 다음 칩

### Popover (v73 추가)

> 2026-10-02 SEED Popover 로 다시 정했다 — 위 "시트 · 대화상자 · 확인창 · 팝오버" 절과 `specs/components/popover.md` 를 따른다.

### File Upload (v73 추가)

> 2026-10-15 걷었다 — 사진 · 파일을 붙이는 칸은 Attachment Input(`specs/components/attachment-input.md` — SEED, 위 "마무리" 절)이다. 옛 2px 점선 상자 · 회색 바탕 · 📁 · 끌기 때 브랜드 테두리 + 8% 바탕 · 막힘 불투명도 0.5 · 성공 ✓ 글은 걷었다 — 드롭존은 1px 실선 `stroke-neutral-solid`(끌기 `stroke-neutral-contrast` + `bg-layer-default-pressed`)이고, 올리는 중은 값 있는 원 24, 실패는 "다시 시도" 다.

### Treeview (v73 추가)

> 2026-10-10 다시 정했다 — 여러 단계에서 고르는 나무는 Tree View(APG Treeview — `specs/components/tree-view.md`, HR 부서), 하위 줄을 접는 카테고리는 List 하위 줄(`specs/components/list.md`)이다(위 "펼치고 접기 · 나누기" 절). 옛 고름 `surface-input` + 왼쪽 브랜드 2px · 여럿 고르기 · 끌어서 옮기기 · 안내 선 · 메모 폴더 나무는 걷었다.

#### HR / Desk 듀얼 브랜드 (v73 5종 공통)
spec brand-neutral. brand 파일 — HR(Banner 약관 변경 / Chip 결재라인 입력값 칩 / Popover 결재 의견 입력), Desk(Banner 시스템 점검 / Chip 메모 태그 입력값 칩 / Popover 카테고리 quick edit). 나무의 쓰는 자리는 2026-10-10 "펼치고 접기 · 나누기 — HR" · "— Desk" 절로, 첨부의 쓰는 자리는 2026-10-15 "마무리 — HR" · "— Desk" 절로 옮겼다.
