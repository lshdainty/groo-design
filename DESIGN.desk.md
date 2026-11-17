---
version: alpha
name: Groo
description: |
  People + Forest. Dual-brand design system for 그루 이음 (B2B) 
  and 그루 담다 (B2C). Optimized for Korean-first audiences,
  all-ages accessibility.

colors:
  # @sync:brand-start (colors-0)
  # === 브랜드 팔레트(담다 파랑). 파일 안에서는 접미사 없이 brand-100 ~ 1000, 단계마다 라이트 · 다크(-dark) ===
  brand-100: "#E8F1FE"
  brand-100-dark: "#202A3C"
  brand-200: "#D7E5FC"
  brand-200-dark: "#20314E"
  brand-300: "#79A6F3"
  brand-300-dark: "#1F3A69"
  brand-400: "#6587C1"
  brand-400-dark: "#1A4386"
  brand-500: "#3765B1"
  brand-500-dark: "#1049A4"
  brand-600: "#0147AD"
  brand-600-dark: "#1052B8"
  brand-700: "#013D96"
  brand-700-dark: "#1A5AC2"
  brand-800: "#00307A"
  brand-800-dark: "#4C83DC"
  brand-900: "#002460"
  brand-900-dark: "#7AA9F6"
  brand-1000: "#001948"
  brand-1000-dark: "#CCD5E3"
  # @sync:brand-end (colors-0)
  
  # @sync:shared-start (colors-0)
  # === 팔레트 — 가족마다 100 ~ 1000(회색은 00 을 더해 11단), 단계마다 라이트 · 다크(-dark) ===
  # 역할(fg · bg · stroke)은 이 팔레트를 가리킵니다. 다크는 차례가 뒤집혀 100 이 가장 어둡습니다
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
  # 차트 10색을 고르는 가족(700 = 차트 라이트 색)
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
  
  # @sync:brand-start (colors-1)
  primary: "{colors.fg-brand}"
  # @sync:brand-end (colors-1)
  
  # @sync:shared-start (colors-1)
  
  
  
  # @sync:shared-end (colors-1)
  
  # @sync:brand-start (colors-2)
  # @sync:brand-end (colors-2)
  
  # @sync:shared-start (colors-2)
  
  # === 차트 10색 — 팔레트 단계(라이트 700 · 다크 800-dark), 두 브랜드 공유 ===
  # 저장된 색(카테고리 · 태그 · 캘린더)은 이름표로 두고, 그리는 색만 이 토큰을 따릅니다
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
  # 카테고리 옅은 바탕(작은 면 weak · 넓은 면 subtle)과 그 위 글자(contrast). 아이콘은 chart-{hue} 그대로
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
  # @sync:shared-end (colors-2)
  
  # @sync:brand-start (colors-3)
  # === 브랜드 역할 색. 파일 안에서는 접미사 없이 같은 이름 ===
  # 글자 (fg)
  fg-brand: "{colors.brand-600}"
  fg-brand-dark: "{colors.brand-900-dark}"
  fg-brand-contrast: "{colors.brand-700}"
  fg-brand-contrast-dark: "{colors.brand-900-dark}"
  # 반전 표면(bg-neutral-inverted — 스낵바 액션) 위의 브랜드 글자. 라이트는 fg-brand 의 다크 값, 다크는 라이트 값
  fg-brand-inverted: "{colors.brand-900-dark}"
  fg-brand-inverted-dark: "{colors.brand-600}"
  # 배경 (bg)
  bg-brand-solid: "{colors.brand-600}"
  bg-brand-solid-dark: "{colors.brand-500-dark}"
  bg-brand-solid-pressed: "{colors.brand-700}"
  bg-brand-solid-pressed-dark: "{colors.brand-700-dark}"
  bg-brand-weak: "{colors.brand-100}"
  bg-brand-weak-dark: "{colors.brand-200-dark}"
  bg-brand-weak-pressed: "{colors.brand-200}"
  bg-brand-weak-pressed-dark: "{colors.brand-300-dark}"
  # 선 (stroke)
  stroke-focus-ring: "{colors.brand-600}"
  stroke-focus-ring-dark: "{colors.brand-900-dark}"
  stroke-brand-solid: "{colors.brand-600}"
  stroke-brand-solid-dark: "{colors.brand-900-dark}"
  stroke-brand-weak: "{colors.brand-300}"
  stroke-brand-weak-dark: "{colors.brand-800-dark}"
  # @sync:brand-end (colors-3)
  
  # @sync:shared-start (colors-3)
  # === 역할 색 (fg · bg · stroke) — 팔레트 단계를 가리킵니다 ===
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
  # 반전 표면(bg-neutral-inverted — 스낵바) 위의 상태 아이콘. 라이트는 그 역할의 다크 값, 다크는 라이트 값
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
  # 회색 바닥(bg-layer-basement) 위 칩 · 세그먼트 트랙의 투명 바탕 —
  # 검정 4.7% · 6.3% / 다크 흰 12.5% · 18%. 투명도가 있어 팔레트 단계가 없습니다
  bg-neutral-weak-alpha: "#0000000C"
  bg-neutral-weak-alpha-dark: "#FFFFFF20"
  bg-neutral-weak-alpha-pressed: "#00000010"
  bg-neutral-weak-alpha-pressed-dark: "#FFFFFF2E"
  bg-neutral-inverted: "{colors.gray-1000}"
  bg-neutral-inverted-dark: "{colors.gray-1000-dark}"
  # neutralSolid 버튼의 누름(gray-800)
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
  # 고른 선택 상자(Select Box)의 짙은 테두리(gray-1000)
  stroke-neutral-contrast: "{colors.gray-1000}"
  stroke-neutral-contrast-dark: "{colors.gray-1000-dark}"
  # 이미지 위 안쪽 1px 윤곽(Image Frame · Avatar · Logo Tile) — 검정 4.7% · 다크 흰 5%.
  # 투명도가 있는 색이라 팔레트 단계가 없습니다(static-white 처럼 값을 바로 적습니다). 구분선 stroke-neutral-subtle 은 불투명합니다
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
  # Badge outline 의 옅은 테두리(300). 다크는 400 — 300 은 다크 표면과 1.4:1 · 시트 위 1.2:1 로 묻히고,
  # 800 은 글자(fg-*) · stroke-*-solid 와 같은 색이라 옅은 선이 되지 않습니다
  stroke-critical-weak: "{colors.red-300}"
  stroke-critical-weak-dark: "{colors.red-400-dark}"
  stroke-positive-weak: "{colors.green-300}"
  stroke-positive-weak-dark: "{colors.green-400-dark}"
  stroke-warning-weak: "{colors.orange-300}"
  stroke-warning-weak-dark: "{colors.orange-400-dark}"
  stroke-informative-weak: "{colors.blue-300}"
  stroke-informative-weak-dark: "{colors.blue-400-dark}"
  # @sync:shared-end (colors-3)
  

typography:
  # 타입 스케일 t1 ~ t14 와 역할 스타일. 굵기는 400 —
  # 강조는 500 · 700 인라인 modifier. 긴 글은 article-body · article-note.
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
rounded:
  # 모서리 스케일(2px ~ 24px 10단계 + full, r1 = 4px).
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

spacing:
  # 간격 스케일(2px 단위 19단계, x1 = 4px).
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
  # 역할 간격(수평 · 수직). 값은 위 스케일을 가리킵니다.
  global-gutter: "24px"  # x6 — 화면 전체의 기본 좌우 여백
  between-chips: "8px"  # x2
  component-default: "12px"  # x3
  between-text: "6px"  # x1_5
  nav-to-title: "20px"  # x5
  screen-bottom: "56px"  # x14

components:
  # === 브랜드 채움 버튼(브랜드 채움 + 흰 글자) ===
  button-primary:
    backgroundColor: "{colors.fg-brand}"
    textColor: "{colors.static-white}"
  
  # === 어두운 표면 위 외곽선 버튼(브랜드 다크 글자) ===
  button-outline-on-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-brand-dark}"
  
  # === 카드 (surface 위 primary 텍스트) ===
  card-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-neutral}"
  card-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-neutral-dark}"
  
  # === 페이지 본문 (bg-layer-basement 위 fg-neutral 글자) ===
  page-text-light:
    backgroundColor: "{colors.bg-layer-basement}"
    textColor: "{colors.fg-neutral}"
  page-text-dark:
    backgroundColor: "{colors.bg-layer-basement-dark}"
    textColor: "{colors.fg-neutral-dark}"
  
  # === 입력 필드 (bg-neutral-weak 위 fg-neutral 글자) ===
  input-light:
    backgroundColor: "{colors.bg-neutral-weak}"
    textColor: "{colors.fg-neutral}"
  input-dark:
    backgroundColor: "{colors.bg-neutral-weak-dark}"
    textColor: "{colors.fg-neutral-dark}"
  
  # === 캡션·메타 (secondary 텍스트, surface 위) ===
  caption-on-card-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-neutral-muted}"
  caption-on-card-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-neutral-muted-dark}"
  
  # === Divider / Outline (border 토큰을 1px 시각 요소의 배경색으로 사용) ===
  # NOTE: 이 컴포넌트들은 textColor 없음 — lint contrast 룰은 미발동.
  # border vs 인접 surface 대비는 spec에 borderColor 프로퍼티가 없어 자동 검증 불가.
  divider-light:
    backgroundColor: "{colors.stroke-neutral-weak}"
  divider-dark:
    backgroundColor: "{colors.stroke-neutral-weak-dark}"
  outline-strong-light:
    backgroundColor: "{colors.stroke-neutral-solid}"
  outline-strong-dark:
    backgroundColor: "{colors.stroke-neutral-solid-dark}"
  
  # === 포커스 링(1px 선 — 색 대비는 브랜드 역할 색 짝이 잽니다) ===
  focus-ring-on-light:
    backgroundColor: "{colors.stroke-focus-ring}"
  focus-ring-on-dark:
    backgroundColor: "{colors.stroke-focus-ring-dark}"
  
  # === Semantic 채움 badge (semantic 배경 + 흰 텍스트) ===
  badge-success:
    backgroundColor: "{colors.fg-positive}"
    textColor: "{colors.static-white}"
  badge-error:
    backgroundColor: "{colors.fg-critical}"
    textColor: "{colors.static-white}"
  badge-warning:
    backgroundColor: "{colors.fg-warning}"
    textColor: "{colors.static-white}"
  badge-info:
    backgroundColor: "{colors.fg-informative}"
    textColor: "{colors.static-white}"
  
  # === Semantic 인라인 텍스트 (흰 카드 위 semantic 텍스트) ===
  alert-text-success:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-positive}"
  alert-text-error:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-critical}"
  alert-text-warning:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-warning}"
  alert-text-info:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-informative}"
  
  # === Semantic 다크 표면 위 인라인 텍스트 (-light 변형) ===
  alert-text-success-on-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-positive-dark}"
  alert-text-error-on-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-critical-dark}"
  alert-text-warning-on-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-warning-dark}"
  alert-text-info-on-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-informative-dark}"
  
  # === 사용자 표시(avatar — 차트 색) ===
  avatar:
    backgroundColor: "{colors.chart-blue}"
    textColor: "{colors.static-white}"
  
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
  # 옅은 바탕 위 글자 대비(lint 가 잽니다)
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
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-neutral-subtle}"
  caption-tertiary-on-card-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-neutral-subtle-dark}"
  placeholder-on-input-light:
    backgroundColor: "{colors.bg-neutral-weak}"
    textColor: "{colors.fg-neutral-subtle}"
  placeholder-on-input-dark:
    backgroundColor: "{colors.bg-neutral-weak-dark}"
    textColor: "{colors.fg-neutral-subtle-dark}"
  
  # === Disabled 텍스트 (textColor만 — WCAG 1.4.3 incidental 예외 인정, lint contrast 룰 비대상) ===
  # textColor만 가진 sparse 컴포넌트는 contrastCheck 미발동. 부모 표면 색은 런타임 상속.
  disabled-label-light:
    textColor: "{colors.fg-disabled}"
  disabled-label-dark:
    textColor: "{colors.fg-disabled-dark}"
  
  # === 역할 색 짝 — 글자가 놓이는 배경과 함께. 짝마다 대비를 lint 가 잽니다(라이트 · 다크) ===
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
  # 자리 글(gray-600)은 입력칸 위 3.87:1 · 다크 3.18:1 로 4.5:1 밑이라
  # 막힘 글자(role-disabled-label)처럼 textColor 만 두어 대비 검사에서 뺍니다 — Typography "글자 역할" 참고.
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
  role-brand-on-inverted-light:
    backgroundColor: "{colors.bg-neutral-inverted}"
    textColor: "{colors.fg-brand-inverted}"
  role-brand-on-inverted-dark:
    backgroundColor: "{colors.bg-neutral-inverted-dark}"
    textColor: "{colors.fg-brand-inverted-dark}"
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
  # 이미지 위 투명 윤곽
  role-stroke-neutral-overlay-light:
    backgroundColor: "{colors.stroke-neutral-overlay}"
  role-stroke-neutral-overlay-dark:
    backgroundColor: "{colors.stroke-neutral-overlay-dark}"
  # 회색 바닥 위 칩 · 세그먼트 트랙의 투명 바탕
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
  # Badge outline 의 옅은 테두리
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
  
  # === 브랜드 역할 색 짝. 짝마다 대비를 lint 가 잽니다(라이트 · 다크) ===
  role-brand-on-layer-light:
    backgroundColor: "{colors.bg-layer-default}"
    textColor: "{colors.fg-brand}"
  role-brand-on-layer-dark:
    backgroundColor: "{colors.bg-layer-default-dark}"
    textColor: "{colors.fg-brand-dark}"
  role-on-brand-solid-light:
    backgroundColor: "{colors.bg-brand-solid}"
    textColor: "{colors.static-white}"
  role-on-brand-solid-dark:
    backgroundColor: "{colors.bg-brand-solid-dark}"
    textColor: "{colors.static-white}"
  role-on-brand-solid-pressed-light:
    backgroundColor: "{colors.bg-brand-solid-pressed}"
    textColor: "{colors.static-white}"
  role-on-brand-solid-pressed-dark:
    backgroundColor: "{colors.bg-brand-solid-pressed-dark}"
    textColor: "{colors.static-white}"
  role-brand-contrast-on-weak-light:
    backgroundColor: "{colors.bg-brand-weak}"
    textColor: "{colors.fg-brand-contrast}"
  role-brand-contrast-on-weak-dark:
    backgroundColor: "{colors.bg-brand-weak-dark}"
    textColor: "{colors.fg-brand-contrast-dark}"
  role-brand-contrast-on-weak-pressed-light:
    backgroundColor: "{colors.bg-brand-weak-pressed}"
    textColor: "{colors.fg-brand-contrast}"
  role-brand-contrast-on-weak-pressed-dark:
    backgroundColor: "{colors.bg-brand-weak-pressed-dark}"
    textColor: "{colors.fg-brand-contrast-dark}"
  role-stroke-focus-ring-light:
    backgroundColor: "{colors.stroke-focus-ring}"
  role-stroke-focus-ring-dark:
    backgroundColor: "{colors.stroke-focus-ring-dark}"
  role-stroke-brand-solid-light:
    backgroundColor: "{colors.stroke-brand-solid}"
  role-stroke-brand-solid-dark:
    backgroundColor: "{colors.stroke-brand-solid-dark}"
  role-stroke-brand-weak-light:
    backgroundColor: "{colors.stroke-brand-weak}"
  role-stroke-brand-weak-dark:
    backgroundColor: "{colors.stroke-brand-weak-dark}"
  # === 팔레트 보기용. 역할이 쓰지 않는 단계도 검사기가 "쓰는 색" 으로 세게 합니다 ===
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
  palette-brand-100:
    backgroundColor: "{colors.brand-100}"
  palette-brand-100-dark:
    backgroundColor: "{colors.brand-100-dark}"
  palette-brand-200:
    backgroundColor: "{colors.brand-200}"
  palette-brand-200-dark:
    backgroundColor: "{colors.brand-200-dark}"
  palette-brand-300:
    backgroundColor: "{colors.brand-300}"
  palette-brand-300-dark:
    backgroundColor: "{colors.brand-300-dark}"
  palette-brand-400:
    backgroundColor: "{colors.brand-400}"
  palette-brand-400-dark:
    backgroundColor: "{colors.brand-400-dark}"
  palette-brand-500:
    backgroundColor: "{colors.brand-500}"
  palette-brand-500-dark:
    backgroundColor: "{colors.brand-500-dark}"
  palette-brand-600:
    backgroundColor: "{colors.brand-600}"
  palette-brand-600-dark:
    backgroundColor: "{colors.brand-600-dark}"
  palette-brand-700:
    backgroundColor: "{colors.brand-700}"
  palette-brand-700-dark:
    backgroundColor: "{colors.brand-700-dark}"
  palette-brand-800:
    backgroundColor: "{colors.brand-800}"
  palette-brand-800-dark:
    backgroundColor: "{colors.brand-800-dark}"
  palette-brand-900:
    backgroundColor: "{colors.brand-900}"
  palette-brand-900-dark:
    backgroundColor: "{colors.brand-900-dark}"
  palette-brand-1000:
    backgroundColor: "{colors.brand-1000}"
  palette-brand-1000-dark:
    backgroundColor: "{colors.brand-1000-dark}"
---

## Overview

이 파일은 그루 담다(B2C · 개인 메모 · 할 일 · 가계부)의 디자인 시스템입니다. 공유 원본 `DESIGN.md` 의 토큰과 기초 문서를 그대로 담고, 브랜드 팔레트와 브랜드 역할 색을 더합니다. 브랜드 색은 `#0147AD`(`brand-600`)입니다. 그루 이음은 `DESIGN.hr.md` 입니다(브랜드 색 `#075B3C`).

두 서비스는 글자 · 간격 · 모서리 · 공용 색 · 상태 색과 컴포넌트 규칙을 함께 쓰고, 브랜드 색만 나눕니다. 화면과 컴포넌트는 팔레트 단계가 아니라 역할 이름(`fg-neutral` · `bg-brand-solid` …)으로 색을 부릅니다. 토큰 이름에는 브랜드 접미사를 붙이지 않습니다 — 이 파일 안에서 `fg-brand` · `bg-brand-solid` 는 담다 파랑입니다.

### 파일

- **`DESIGN.md`** — 공유 원본입니다. 글자 · 간격 · 모서리 · 팔레트 · 공용 역할 색과 기초 문서를 정의합니다. 그룹 화면(그루 계정 · 그룹 문서)이 이 파일을 씁니다.
- **`DESIGN.hr.md`** · **`DESIGN.desk.md`** — 브랜드 파일입니다. 공유 토큰의 복사본에 브랜드 팔레트(`brand-100` ~ `brand-1000`)와 브랜드 역할 색을 더합니다.
- 공유 토큰을 바꾸면 `npm run sync` 로 브랜드 파일의 복사본을 맞춥니다. 공유 영역은 손으로 고치지 않습니다.

## Colors

색은 두 층으로 둡니다. 팔레트는 가족마다 차례 번호를 붙인 색이고, 역할 색은 화면이 부르는 이름으로 모드마다 팔레트의 한 단계를 가리킵니다. 화면 · 컴포넌트는 역할 색만 부릅니다.


### 그룹 색 · 로고

- **그룹(그루)에는 브랜드 색이 없습니다.** 그룹 화면 — 홈의 그룹 쪽 · 그루 계정 로그인 · 그룹 문서 — 의 채움 · 링크는 짙은 회색 `bg-neutral-inverted`(라이트 `#1A1F2E` · 다크 `#F5F6FA`)이고, 그 위 글자는 `fg-neutral-inverted`(라이트 흰색 · 다크 `#242938`)입니다. 그룹용 브랜드 토큰은 두지 않습니다.
- **그룹 화면의 포커스 링도 짙은 회색입니다.** 그룹 화면은 `DESIGN.md` 를 쓰고, 그 파일의 `stroke-focus-ring` 은 채움과 같은 `gray-1000` 입니다. 이 파일에서는 같은 이름이 브랜드 색입니다.
- **색은 로고에만 있습니다.** 로고 칠은 고정값이고 라이트 · 다크가 같습니다 — 진한 잎 `#075B3C` · 겹침 `#218D49` · 밝은 잎 `#43BF5E` · 기둥 `#A96D57`. 로고를 그릴 때만 쓰는 값이라 UI 토큰이 아니며, 화면의 채움 · 글자 · 선에 쓰지 않습니다. 다크 바탕(`#1A1F2E`)에서 진한 잎은 2.01:1 로 어둡지만, 잎을 밝히거나 타일 · 테두리를 두르지 않습니다.
- **서비스 색** — 담다는 파랑(`DESIGN.desk.md` 브랜드 팔레트), 이음은 그룹 초록입니다. 이음 브랜드 팔레트의 600 이 로고의 진한 잎 `#075B3C` 입니다.

#### 로고 쓰는 자리

칠은 위 고정값 그대로입니다 — 알림 작은 아이콘만 OS 가 한 색으로 칠합니다. 서비스 이름은 그 서비스의 이름입니다(담다 앱이면 "그루 담다").

| 자리 | 모양 | 크기 · 배치 |
|---|---|---|
| 앱 아이콘 | 흰 타일 + 시안 나무(`groo_icon.svg` 그대로) | OS 아이콘 크기 |
| 앱 첫 화면(스플래시) | 나무 + 서비스 이름을 한 묶음으로 화면 정중앙에, 그 아래 [Progress Circle](specs/components/progress-circle.md) `brand` 40 | 나무 96 · 나무 ↔ 이름 16 · 이름 32 / 40 · 700 · 묶음 ↔ 원 32 · 바닥 `bg-layer-default`(Layout "화면 바탕" — 셸 밖 화면) |
| 로그인 | 가로 묶음 — 나무 + 서비스 이름 | 나무 56 + 8 + 이름 32 / 40 · 700(사이드바 머리 — 나무 24 + 8 + 이름 — 와 같은 짜임) |
| 알림 작은 아이콘(안드로이드) | 한 색 나무 실루엣 — OS 가 투명도만 보고 한 색으로 칠합니다 | 24dp · 업데이트 · 결제 감지 알림 모두 |

### 팔레트

| 자리 | 값 |
|---|---|
| 가족 | gray(00 · 100 ~ 1000) · red · green · orange · blue(100 ~ 1000), 차트용 yellow · indigo · violet · pink · brown(100 ~ 1000). 브랜드는 brand(100 ~ 1000)로 브랜드 파일에만 있습니다 |
| 모드 | 단계마다 라이트 · 다크 값이 있습니다. 다크 값은 이름 뒤에 -dark 를 붙입니다(gray-100-dark) — 역할 색과 같은 규칙입니다 |
| 차례 | 라이트는 100 이 가장 옅고 1000 이 가장 짙습니다. 다크는 뒤집혀 100 이 가장 어둡습니다 — 같은 번호가 두 모드에서 비슷한 무게로 보이기 때문입니다 |
| 참조 | 역할 색은 단계를 가리킵니다(`bg-layer-default: "{colors.gray-00}"`). hex 는 팔레트에만 적습니다 |

- 화면 · 컴포넌트는 팔레트를 직접 부르지 않고 역할 색을 부릅니다. 팔레트를 직접 쓰는 것은 역할로 나타내기 어려운 예외적인 자리뿐입니다.
- 팔레트 이름은 gray-500 처럼 차례 번호입니다 — "토큰 이름은 의미 기반" 규칙의 예외로, 팔레트 층에만 씁니다.
- 역할이 가리키지 않는 단계(gray-600 · 의미 색 300 ~ 500 등)도 둡니다. design.md 검사기는 어느 컴포넌트도 쓰지 않는 색을 경고하므로, 머리말 `components` 의 palette-* 가 단계마다 한 번씩 가리킵니다 — 보기용이고 화면 컴포넌트가 아닙니다.
- 차트 10색은 팔레트 단계입니다 — 라이트 700 · 다크 800-dark(아래 "차트 10색").
- 대비는 `npm run lint:all` · `npm run lint:dark` 가 잰 값이 기준입니다.

#### 값을 뽑은 규칙

- OKLCH 에서 가족마다 색상각 하나로 뽑습니다. 색상각은 채움색에서 옵니다 — 의미 색은 라이트 700 이 그 채움색입니다(red #D72323 · green #167F3F · orange #BE490D · blue #1D6EC9, 흰 글자 4.5:1 이상).
- 단계마다 목표 밝기(CIELAB L*)를 두고, 채도는 단계마다 정한 비율로 줍니다.
- 브랜드는 라이트 600 이 브랜드 색입니다(Desk #0147AD · HR #075B3C). 두 브랜드 모두 어두운 색(L* 33 · 34)이라 단계의 목표 밝기가 같습니다.
- 회색의 양 끝은 라이트 00 #FFFFFF · 1000 #1A1F2E, 다크 00 #1A1F2E · 1000 #F5F6FA 입니다.
- 회색 다섯 단계는 화면의 바닥 · 뜬 표면 · 입력칸 · 흐린 글자 값으로 고정합니다(계산값과 색차 ΔE 1.4 이하): gray-200 #F5F6FA · gray-700 #62697A · gray-100-dark #242938 · gray-200-dark #2D3346 · gray-300-dark #353B4D. gray-400 은 테두리 값 #E5E8EF 로 고정합니다.
- 다크의 글자 단계(의미 색 800 · 브랜드 900)는 L* 69 입니다 — 다크 입력칸(bg-neutral-weak-dark #353B4D) 위에서도 4.5:1 을 넘게 밝혔습니다. 의미 색 글자는 그 위 4.67 ~ 4.71:1, 브랜드 글자는 Desk 4.69:1 · HR 4.67:1 입니다.
- 그 글자 단계와 Desk 의 브랜드 옅은 선(brand-300)은 밝기 · 색조를 두고 채도만 램프 비율보다 올립니다 — 램프 비율대로면 다크 링크 · 금액 글자가 회색 기를 띠기 때문입니다.
- 노랑 800-dark 는 같은 방식으로 채도를 올린 #C5A721 입니다.

#### 역할 → 단계

| 역할 | 라이트 | 다크 |
|---|---|---|
| `bg-layer-basement` | gray-200 | gray-00 |
| `bg-layer-default` | gray-00 | gray-100 |
| `bg-layer-default-pressed` | gray-100 | gray-300 |
| `bg-layer-floating` | gray-00 | gray-200 |
| `bg-layer-floating-pressed` | gray-100 | gray-300 |
| `bg-neutral-weak` | gray-200 | gray-300 |
| `bg-neutral-weak-pressed` | gray-300 | gray-400 |
| `bg-neutral-weak-alpha` | 검정 4.7%(`#0000000C`) | 흰 12.5%(`#FFFFFF20`) |
| `bg-neutral-weak-alpha-pressed` | 검정 6.3%(`#00000010`) | 흰 18%(`#FFFFFF2E`) |
| `bg-neutral-inverted` | gray-1000 | gray-1000 |
| `bg-disabled` | gray-200 | gray-300 |
| `fg-neutral` | gray-1000 | gray-1000 |
| `fg-neutral-muted` | gray-800 | gray-800 |
| `fg-neutral-subtle` | gray-700 | gray-700 |
| `fg-placeholder` | gray-600 | gray-600 |
| `fg-disabled` | gray-500 | gray-600 |
| `fg-neutral-inverted` | gray-00 | gray-100 |
| `fg-positive-inverted` | green-800(다크 팔레트) | green-700 |
| `fg-critical-inverted` | red-800(다크 팔레트) | red-700 |
| `stroke-neutral-subtle` | gray-300 | gray-300 |
| `stroke-neutral-weak` | gray-400 | gray-400 |
| `stroke-neutral-solid` | gray-600 | gray-600 |
| `stroke-neutral-contrast` | gray-1000 | gray-1000 |
| `stroke-neutral-overlay` | 검정 4.7%(`#0000000C`) | 흰 5%(`#FFFFFF0D`) |
| 역할(* = critical · positive · warning · informative) | 라이트 | 다크 |

의미 색은 네 역할이 같은 단계를 씁니다 — critical → red · positive → green · warning → orange · informative → blue.

|---|---|---|
| bg-*-weak | 100 | 200 |
| bg-*-weak-pressed | 200 | 300 |
| bg-*-solid | 700 | 600 |
| bg-*-solid-pressed | 800 | 700 |
| fg-* | 700 | 800 |
| fg-*-contrast | 800 | 900 |
| stroke-*-solid | 700 | 800 |
| stroke-*-weak | 300 | 400 |
| 역할 | Desk (라이트 / 다크) | HR (라이트 / 다크) |

| 역할 | Desk (라이트 / 다크) | HR (라이트 / 다크) |
|---|---|---|
| bg-brand-solid | 600 / 500 | 600 / 500 |
| bg-brand-solid-pressed | 700 / 700 | 700 / 700 |
| bg-brand-weak | 100 / 200 | 100 / 200 |
| bg-brand-weak-pressed | 200 / 300 | 200 / 300 |
| fg-brand | 600 / 900 | 600 / 900 |
| fg-brand-contrast | 700 / 900 | 700 / 900 |
| fg-brand-inverted | 900(다크 팔레트) / 600 | 900(다크 팔레트) / 600 |
| stroke-brand-solid | 600 / 900 | 600 / 900 |
| stroke-brand-weak | 300 / 800 | 300 / 800 |
| stroke-focus-ring | 600 / 900 | 600 / 900 |

#### 단계를 고른 까닭

- **fg-placeholder** 는 gray-600 입니다. 앞뒤 글자 · 칸 아래 설명(`fg-neutral-subtle`, gray-700)보다 한 단계 옅어 "아직 비었다" 가 색으로도 보이기 때문입니다. 흰 면 4.18:1 · 입력칸 위 3.87:1 · 다크 시트(bg-layer-floating) 3.58:1 · 다크 입력칸 3.18:1 로 4.5:1 밑이고, 다크 값 `#838997` 이 `fg-disabled` 다크와 같습니다 — 빈 칸과 막힌 칸은 글자색이 아니라 칸 바탕(`bg-disabled`) · 커서로 갈립니다. 대비 짝은 막힘 글자처럼 textColor 만 둡니다(`role-placeholder-*`).
- **의미 색 글자 · 선(fg-* · stroke-*-solid)의 다크** 는 800 입니다. 다크 700 은 어두운 표면 위 2.9:1 안팎이라, 흰 글자를 얹는 채움 눌림 자리에 씁니다.
- **stroke-neutral-subtle** 은 불투명한 gray-300 입니다 — 구분선 · 목록 선에 씁니다.
- **stroke-neutral-overlay** 는 투명한 값(검정 4.7% · 흰 5%)으로 이미지 · 아바타 · 로고 타일 위 1px 윤곽에만 씁니다. 불투명한 선을 그림 둘레에 그리면 어두운 사진 · 카드 둘레에 옅은 테가 생기기 때문입니다. 이름의 overlay 는 "내용 위에 얹는" 뜻입니다 — 굵기 단계(subtle · weak · solid · contrast)가 아니라 자리를 말합니다.
- **bg-neutral-weak-alpha · -pressed** 는 투명한 약한 배경(검정 4.7% · 6.3% / 다크 흰 12.5% · 18%)입니다. 라이트에서 바닥 `bg-layer-basement` · 약한 배경 `bg-neutral-weak` · 비활성 `bg-disabled` 가 모두 gray-200 이라 회색 바닥 위의 채움이 바닥과 1.00:1 로 사라집니다. 그래서 바닥 위에 자주 놓이는 두 부품 — Chip `solid` 바탕 · Segmented Control 트랙 — 만 투명 짝을 씁니다(회색 위 1.11 · 흰 위 1.11 · 다크 1.47:1). 나머지 약한 배경 · 비활성 채움은 흰 표면 위에만 둡니다(Elevation 의 "바닥 위의 채움"). 불투명 `bg-neutral-weak` 는 그대로 씁니다.
- **warning** 은 주황 채움 + 흰 글자이고, 단계는 다른 의미 색과 같은 규칙입니다.
- **bg-positive-solid 의 다크** 는 다른 의미 색과 맞춰 600(눌림 700)입니다.
- **브랜드 채움의 다크** 는 500 입니다. 두 브랜드 모두 브랜드 색이 어두워(Desk L* 33 · HR L* 34) 500 이 브랜드 색과 같은 무게로 보입니다. 눌림은 700 입니다 — 800 은 흰 글자 3.76:1(HR 3.79:1)이라 쓰지 않습니다.
- **브랜드 글자 · 선 · 포커스 링의 다크** 는 900 입니다. 다크 700 은 어두운 표면 위 Desk 2.27:1 · HR 2.25:1 입니다.
- **stroke-brand-solid 의 라이트** 는 600 — 브랜드 색 그대로입니다.
- **stroke-brand-weak** 는 라이트 300(흰 면 위 Desk 2.45:1 · HR 2.47:1), 다크 800 입니다. 다크 300 은 표면과 1.29:1 이라 선이 보이지 않습니다.
- **의미 색 stroke-*-weak 의 다크** 는 400 입니다. 다크 300 은 표면과 1.38 ~ 1.40:1(시트 위 1.19 ~ 1.21)로 선이 묻히고, 800 은 글자(fg-*) · stroke-*-solid 와 같은 색이라 옅은 선이 아닙니다. 400 은 1.71 ~ 1.73:1 로 라이트 300(1.51 ~ 1.53)과 무게가 맞습니다.
- **stroke-focus-ring** 은 브랜드 색입니다(그룹 파일 `DESIGN.md` 는 짙은 회색입니다).
- **다크 약한 배경 · 눌림(의미 색 · 브랜드)** 은 200 · 300 입니다. 다크 카드 표면(#242938, L* 16.7)이 밝아 100 단계는 표면과 1.00 ~ 1.02:1 로 묻히기 때문입니다. 200 · 300 은 표면과 1.15 · 1.4:1 입니다.
- **대비 글자(fg-*-contrast)** 는 일반 글자보다 한 단계 바깥입니다 — 라이트 700 → 800, 다크 800 → 900. 라이트 800 은 약한 배경 · 눌림 위 5.0 ~ 5.7:1 입니다.
- **stroke-neutral-solid** 는 gray-600 입니다. 체크박스 · 라디오 테두리와 꺼진 스위치 트랙에 쓰며, UI 3:1 을 넘는 가장 옅은 단계입니다.
- **fg-disabled 의 다크** 는 600 입니다 — 비활성 버튼 위 3.18:1 입니다(500 이면 2.08:1 로 라이트 2.93:1 보다 흐립니다).
- **bg-neutral-inverted 의 라이트** 는 gray-1000(#1A1F2E) — 스낵바 · 툴팁 배경입니다.

### 역할 색

이름은 속성 · 역할 · 변형 · 상태 순입니다 — 예: fg-critical-contrast, bg-brand-solid-pressed.

| 자리 | 값 |
|---|---|
| 속성 | fg(글자 · 아이콘) · bg(배경) · stroke(선) |
| 역할 | neutral · layer · brand · critical · positive · warning · informative |
| 변형 | solid(채움) · weak(약한 배경) · contrast(약한 배경 위 글자) · muted · subtle · inverted |
| 상태 | pressed(눌림) |

- 대비는 WCAG AA 로 잽니다 — 본문 4.5:1, UI 3:1.
- contrast 글자는 약한 배경과 그 눌림 위에서 4.5:1 을 넘는 글자입니다. 부드러운 배지처럼 약한 배경 위 글자에 씁니다.
- 흰 글자는 `static-white` 입니다. 채움(solid) 위 글자에 쓰고, 두 모드에서 같습니다.
- 투명도가 있는 역할(`bg-neutral-weak-alpha` · `stroke-neutral-overlay`)은 팔레트 단계 없이 값을 바로 적습니다.
- 글자와 그 글자가 놓이는 배경의 짝은 머리말 `components` 의 `role-*` 로 적어 두어 `npm run lint` 가 라이트 · 다크 대비를 잽니다(4.5:1 밑이면 경고).

#### 글자 (fg)

| 역할 | 라이트 | 다크 |
|---|---|---|
| `fg-neutral` | `#1A1F2E` | `#F5F6FA` |
| `fg-neutral-muted` | `#535866` | `#B7BDCC` |
| `fg-neutral-subtle` | `#62697A` | `#A2A8B7` |
| `fg-neutral-inverted` | `#FFFFFF` | `#242938` |
| `fg-placeholder` | `#767C8B` | `#838997` |
| `fg-disabled` | `#8A91A0` | `#838997` |
| `static-white` | `#FFFFFF` | — |
| `fg-critical` | `#D72323` | `#FF8477` |
| `fg-positive` | `#167F3F` | `#25C062` |
| `fg-warning` | `#BE490D` | `#FF8758` |
| `fg-informative` | `#1D6EC9` | `#69ABFF` |
| `fg-critical-contrast` | `#C01016` | `#FFBCB3` |
| `fg-positive-contrast` | `#026E33` | `#AED6B6` |
| `fg-warning-contrast` | `#A53E0A` | `#F9BFA9` |
| `fg-informative-contrast` | `#0F5FB3` | `#ACCEFB` |
| `fg-positive-inverted` | `#25C062` | `#167F3F` |
| `fg-critical-inverted` | `#FF8477` | `#D72323` |

#### 배경 (bg)

| 역할 | 라이트 | 다크 |
|---|---|---|
| `bg-layer-basement` | `#F5F6FA` | `#1A1F2E` |
| `bg-layer-default` | `#FFFFFF` | `#242938` |
| `bg-layer-default-pressed` | `#F7F8FD` | `#353B4D` |
| `bg-layer-floating` | `#FFFFFF` | `#2D3346` |
| `bg-layer-floating-pressed` | `#F7F8FD` | `#353B4D` |
| `bg-neutral-weak` | `#F5F6FA` | `#353B4D` |
| `bg-neutral-weak-pressed` | `#EDEFF3` | `#404757` |
| `bg-neutral-weak-alpha` | `#0000000C` | `#FFFFFF20` |
| `bg-neutral-weak-alpha-pressed` | `#00000010` | `#FFFFFF2E` |
| `bg-neutral-inverted` | `#1A1F2E` | `#F5F6FA` |
| `bg-disabled` | `#F5F6FA` | `#353B4D` |
| `bg-critical-solid` | `#D72323` | `#CC0E17` |
| `bg-critical-solid-pressed` | `#C01016` | `#D82424` |
| `bg-critical-weak` | `#FFEFEC` | `#532722` |
| `bg-critical-weak-pressed` | `#FFDEDA` | `#722722` |
| `bg-positive-solid` | `#167F3F` | `#117539` |
| `bg-positive-solid-pressed` | `#026E33` | `#198140` |
| `bg-positive-weak` | `#EAF5EC` | `#223927` |
| `bg-positive-weak-pressed` | `#D8EADB` | `#20482B` |
| `bg-warning-solid` | `#BE490D` | `#B04209` |
| `bg-warning-solid-pressed` | `#A53E0A` | `#BF4A10` |
| `bg-warning-weak` | `#FFEFE8` | `#4B2B1F` |
| `bg-warning-weak-pressed` | `#FAE0D5` | `#65321D` |
| `bg-informative-solid` | `#1D6EC9` | `#0F65BF` |
| `bg-informative-solid-pressed` | `#0F5FB3` | `#1F70CB` |
| `bg-informative-weak` | `#EAF3FE` | `#21344D` |
| `bg-informative-weak-pressed` | `#D7E6FB` | `#204069` |

#### 선 (stroke)

| 역할 | 라이트 | 다크 |
|---|---|---|
| `stroke-neutral-subtle` | `#EDEFF3` | `#353B4D` |
| `stroke-neutral-weak` | `#E5E8EF` | `#404757` |
| `stroke-neutral-solid` | `#767C8B` | `#838997` |
| `stroke-neutral-contrast` | `#1A1F2E` | `#F5F6FA` |
| `stroke-neutral-overlay` | `#0000000C` | `#FFFFFF0D` |
| `stroke-critical-solid` | `#D72323` | `#FF8477` |
| `stroke-positive-solid` | `#167F3F` | `#25C062` |
| `stroke-warning-solid` | `#BE490D` | `#FF8758` |
| `stroke-informative-solid` | `#1D6EC9` | `#69ABFF` |
| `stroke-critical-weak` | `#FEC4BC` | `#93231F` |
| `stroke-positive-weak` | `#BBDAC1` | `#1A582F` |
| `stroke-warning-weak` | `#F5C7B6` | `#833615` |
| `stroke-informative-weak` | `#B9D4F6` | `#1C4E8A` |

#### 브랜드 역할

이 파일의 브랜드 역할은 그루 담다(Desk)의 브랜드 색입니다. `DESIGN.hr.md` 에 같은 이름으로 다른 브랜드 값이 있습니다.

| 역할 | 라이트 | 다크 |
|---|---|---|
| `fg-brand` | `#0147AD` | `#7AA9F6` |
| `fg-brand-contrast` | `#013D96` | `#7AA9F6` |
| `fg-brand-inverted` | `#7AA9F6` | `#0147AD` |
| `bg-brand-solid` | `#0147AD` | `#1049A4` |
| `bg-brand-solid-pressed` | `#013D96` | `#1A5AC2` |
| `bg-brand-weak` | `#E8F1FE` | `#20314E` |
| `bg-brand-weak-pressed` | `#D7E5FC` | `#1F3A69` |
| `stroke-focus-ring` | `#0147AD` | `#7AA9F6` |
| `stroke-brand-solid` | `#0147AD` | `#7AA9F6` |
| `stroke-brand-weak` | `#79A6F3` | `#4C83DC` |

### 증감 — 방향 색

지난 기간에 견준 변화(증감)는 방향으로 칠합니다 — 오르거나 늘면 ▲ `fg-critical`(빨강), 내리거나 줄면 ▼ `fg-informative`(파랑)입니다. 지출 · 수입 · 순자산 · 예산 · 주식 · HR 통계 어디서나 같고, 증권 화면의 관례(오르면 빨강)와도 한 규칙입니다.

| 방향 | 표시 | 색 | 흰 면 · 다크 카드 위 |
|---|---|---|---|
| 오름 · 늚 | ▲ + 값("▲ 12.00%") | `fg-critical` | 5.06 · 6.08 |
| 내림 · 줆 | ▼ + 값("▼ 3%") | `fg-informative` | 5.09 · 6.12 |
| 그대로 | "변화 없음" | `fg-neutral-subtle` | 5.50 · 6.09 |

- 늘 ▲ · ▼ 와 값을 함께 쓰고 색만으로 알리지 않습니다(Inclusive Design). 부호는 화살표가 말합니다 — "+12.00%" · "−12.00%" 를 화살표와 겹쳐 쓰지 않습니다. 값 뒤의 기준("지난달보다")은 `fg-neutral-subtle` 입니다.
- 좋고 나쁨은 글이 말합니다 — "지난달보다 12.00% 더 썼어요". 보조 기술에는 문장으로 읽힙니다(화살표는 숨깁니다).
- 브랜드로 채운 면(Desk 순자산 카드) 위에서는 흰 글자 + ▲ · ▼ + 글입니다 — 빨강 · 파랑이 채움 위 1.66 · 1.65:1 이라 읽히지 않기 때문입니다. 이 규칙의 하나뿐인 예외입니다.
- 부품은 `specs/components/card.md` 의 "증감 표기"(Delta)입니다 — 표 · 차트의 증감 칸도 같은 규칙입니다. 빼기 부호는 International Design 의 U+2212 입니다.

### 차트 10색

데이터 시각화 · 카테고리 색은 팔레트의 열 가족에서 고릅니다. 축 · 툴팁 · 범례 · 빈 · 실패 모습은 `specs/components/chart.md` 에 있습니다.

| 자리 | 값 |
|---|---|
| 라이트 | chart-{hue} = {hue}-700(회색은 gray-700). 빨강 · 주황 · 초록 · 파랑은 의미 색 가족이라 위험 · 경고 · 긍정 · 정보 채움과 같은 색입니다 |
| 다크 | chart-{hue}-dark = {hue}-800-dark — 다크 의미 색 글자와 같은 단계(L* 69, 다크 표면 위 6:1)입니다 |
| 순서 | 색을 고르지 않은 항목(도넛 · 순위 막대 · 주식 비중)은 blue → green → orange → violet → pink → indigo → red → yellow → brown → gray 순으로 받습니다. 저장된 색이 있는 항목과 한 차트에 있으면 그 색을 건너뛰고 아직 쓰지 않은 색부터 받습니다 — 같은 색이 둘 나오지 않습니다 |
| 넘칠 때 | 한 차트에 10개가 넘으면 상위 9개 + 회색 "기타" 로 묶습니다. 회색은 기타 전용입니다 |

- 가장 가까운 짝은 빨강–주황입니다(ΔE 11.3, 다크 9.7 — 다크에서는 둘 다 산호색). 차트에는 범례 · 라벨을 늘 함께 씁니다(State · Inclusive Design 의 "색만으로 알리지 않는다").
- 카테고리 · 태그 · 캘린더 · 라벨 · 저축 목표 · 메모의 색은 라이트 hex 로 저장하고, 웹 · 앱이 그 값으로 다크 짝을 찾습니다. 저장된 값은 이름표로 두고 그리는 색만 이 토큰을 따릅니다 — 저장 값을 바꾸면 그 값을 모르는 설치된 앱이 편집할 때 색을 되돌리기 때문입니다.
- 아바타 이니셜은 `fg-neutral-inverted` 입니다 — 라이트는 흰색(700 위 4.55:1 이상), 다크는 어두운 글자(800-dark 위 6.07:1 이상)입니다. 다크에서 흰 글자는 2.4:1 이라 쓰지 않습니다.
- 차트 색은 본문 글자로 쓰지 않습니다 — 차트 위 글은 `fg-neutral` · `fg-neutral-subtle` 입니다.

### 카테고리 옅은 바탕

카테고리 색을 옅게 깐 면과 그 위 글자는 팔레트 단계로 둡니다.

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| chart-{hue}-weak | 200(회색 400) | 300(회색 400) | 작은 면 — 카테고리 타일 · 캘린더 칩 · 주식 나라 표시 · 태그 배지. 흰 바탕과 1.25:1 이상, 다크 표면과 1.38:1 이상 |
| chart-{hue}-subtle | 100(회색 300) | 200(회색 300) | 넓은 면 — 메모 카드 · 배너 · 차트 위 지표 타일(켠 계열). 한 단계 옅습니다(1.12:1 · 다크 1.15:1 이상) |
| chart-{hue}-contrast | 800 | 900 | 옅은 바탕 위 글자 — 일반 차트 색보다 한 단계 바깥입니다. 두 바탕 위 모두 5.02:1 이상 |

- 아이콘은 chart-{hue} 그대로입니다(라이트 700 · 다크 800) — 작은 면 위 3.63:1(라이트) · 4.35:1(다크) 이상으로 UI 3:1 을 넘습니다.
- 회색은 라이트 100 · 200 이 바닥색과 같아서 한 단계씩 진하게 둡니다.
- 대비는 머리말 `components` 의 chart-{hue}-contrast-on-{weak,subtle}-{light,dark} 40개로 lint 가 잽니다.
- 안내 메시지(Callout · Page Banner)는 카테고리 색이 아니라 역할 색(약한 배경 + 대비 글자)을 씁니다.

### 그라디언트

콘텐츠 끝을 부드럽게 가리는 마스크와 스켈레톤 반짝임, 두 가지만 둡니다. 투명도가 있어 머리말 색이 아니라 표 토큰입니다.

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `gradient-fade-mask` | `linear-gradient(#00000000 0%, #00000003 8%, #00000005 16%, #0000000d 22%, #00000014 29%, #00000021 35%, #0000002e 41%, #00000040 47%, #00000052 53%, #00000066 59%, #0000007a 65%, #00000094 71%, #000000ab 78%, #000000c7 84%, #000000e3 92%, #000000ff 100%)` | 가림 마스크 — `mask-image` 로 써서 스크롤 영역의 끝을 부드럽게 가립니다(Scroll Fog — `specs/components/scroll-fog.yaml`). 라이트 · 다크 같음 |
| `gradient-shimmer-neutral` | `linear-gradient(90deg, #ffffff00 0%, #ffffffab 46%, #ffffffab 54%, #ffffff00 100%)` | 스켈레톤 반짝임 띠 — 라이트 |
| `gradient-shimmer-neutral-dark` | `linear-gradient(90deg, #ffffff00 0%, #ffffff1a 46%, #ffffff1a 54%, #ffffff00 100%)` | 스켈레톤 반짝임 띠 — 다크 |

- 마스크는 방향 없이(위 → 아래) 적습니다. 쓰는 자리에서 방향을 붙입니다(`to right` 등).
- 반짝임은 `motion-duration-loop`(1500ms) · `motion-ease-easing` 으로 지나가고(`specs/components/skeleton.yaml`), 모션 줄이기 모드에서는 멈춥니다.

## Typography

한국어 본문 가독성을 우선합니다. 글꼴은 Pretendard 이고 영문 대체는 Inter 입니다. 크기 · 줄 높이 · 굵기는 아래 타입 스케일이 정하고, 자리마다 어느 크기 · 굵기 · 색을 쓰는지는 "글자 역할" 이 정합니다.

### 타입 스케일

크기는 t1(11px) ~ t14(48px) 14단계이고, 줄 높이는 크기마다 px 로 정해져 있습니다. 굵기는 400 · 500 · 700 셋만 씁니다.

| 토큰 | 크기 | 줄 높이 | 배수 | 쓰는 곳 |
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

- **굵기**: 토큰의 굵기는 400 입니다. 강조는 `font-medium`(500) · `font-bold`(700) 인라인 modifier 로 줍니다. 600 은 쓰지 않습니다.
- **줄 높이**: UI 글자는 ×1.35 안팎, 긴 글은 article-body · article-note(×1.5 안팎)입니다. 한국어 본문의 줄 높이 1.5 이상은 긴 글에 적용합니다.
- **단위**: 값은 여기 px 로 적고, 웹에는 rem(÷16)으로 내보냅니다 — 사용자의 글자 크기 설정을 따르기 위해서입니다. 커지면 깨지는 자리(배지 · 탭 라벨 · Segmented 칸 글 · 좁은 칸의 숫자)는 `-static`(px 그대로)을 씁니다(text-t5-static 처럼 — 내보낼 때 생깁니다). 이 자리의 글은 WCAG 1.4.4(글 200%)의 예외입니다 — Segmented 칸 글(t5-static 16)은 4칸이 폰 폭에서 한 글자씩 쪼개지지 않게 고정합니다(하단 탭 라벨과 같습니다). 앱은 OS 글자 크기를 따르고(Flutter 기본), 같은 자리만 `TextScaler.noScaling` 으로 고정합니다.
- **상자 · 아이콘 · 원은 px** — 위 단위 규칙은 글자에만 겁니다. 틀 부품의 상자 · 아이콘 · 원(상단 바 56 · 아이콘 버튼 44 · 아이콘 24, 하단 바 66 · 칸 · + 원 44, FAB 56, 탭 줄 40 · 44, 사이드바 머리 64 · 접기 40 · 항목 44)과 Date Picker 의 칸 · 머리 · 요일 줄(48) · 원 42 · 이전 · 다음 40, 켜고 끄는 단추([Toggle](specs/components/toggle.md))의 상자 · 아이콘은 px 입니다 — 글자 크기를 따르지 않습니다(치수 토큰은 px, 글자만 rem). 글이 상자보다 커지는 자리(탭 줄 · 날짜 칸)는 그 값이 최소 높이라 글을 따라 늘어납니다. 아이콘은 WCAG 1.4.4(글 크기)의 대상이 아닙니다.
- **숫자 — 고정폭만, 자간 · 글꼴 옵션 없음** — 숫자는 고정폭 숫자(`tabular-nums`)만 겁니다. 숫자에 자간을 주지 않고(`letter-spacing` 0 — 글자 토큰에도 자간이 없습니다), 글꼴 옵션(`font-feature-settings` 의 `cv01` · `ss03`)을 켜지 않습니다 — 웹 · 앱이 같은 폭 · 같은 모양이 되게 하기 위해서입니다.

### 줄바꿈

한국어는 띄어쓰기 단위(어절)로 줄을 바꿉니다. 브라우저와 Flutter 의 기본값은 글자(음절) 사이 어디서나 끊어서, 좁은 칸에서 낱말이 두 줄로 갈리기 때문입니다("권한입니 / 다.", "3개 / 월").

```css
html {
  word-break: keep-all;
  overflow-wrap: break-word;
}
```

| 플랫폼 | 하는 일 | 어디에 |
|---|---|---|
| 웹 | `word-break: keep-all` + `overflow-wrap: break-word` — 낱말 사이에서만 줄을 바꾸고, 한 줄보다 긴 낱말만 칸 끝에서 끊습니다 | 문서 맨 바깥(`html`) 한 번 — 모든 화면 |
| 앱(Flutter) | 낱말 안 글자 사이에 WORD JOINER(U+2060)를 넣어 보여 줍니다 — Flutter 에는 이 설정이 없습니다 | 공용 글자 위젯 한 곳 — 보여 주는 글만 |

- `keep-all` 만 쓰면 띄어쓰기 없는 긴 낱말(긴 이름 · 이메일 · 주소)이 칸 밖으로 넘칩니다 — `overflow-wrap: break-word` 가 그런 낱말만 칸 끝에서 끊습니다. `anywhere` 는 표 칸 폭까지 좁혀 코드 이름이 글자 단위로 쪼개지므로 쓰지 않습니다.
- 폭이 내용을 따르는 flex 항목은 `min-width: 0` 을 둬야 긴 낱말이 칸 안에서 끊깁니다(컴포넌트 레시피는 이미 둡니다).
- 영문은 원래 단어 단위라 바뀌지 않습니다. 일본어는 `keep-all` 이 잘못 끊습니다 — groo 는 한국어 · 영문만 씁니다.
- 컴포넌트 라벨 · 설명도 단어 단위로 줄을 바꿉니다.
- 앱의 이음 문자는 보여 주는 글에만 넣습니다 — 입력칸 · 복사할 글 · 검색어 · 서버로 보낼 값에는 넣지 않습니다. 이음 문자를 넣으면 낱말 사이에서만 끊고, 한 줄보다 긴 낱말은 그래도 끊습니다.
- 한 줄 말줄임 · 줄 수 제한은 그대로 씁니다 — 줄을 바꾸는 자리만 바뀝니다.
- 예외 — **금액은 쉼표 뒤에서만 줄을 바꿉니다**. 칸보다 긴 금액(큰 글자 · 큰 수)을 아무 글자에서 끊으면 세 자리 묶음이 갈라져("−123,456,7 / 89,012원") 금액을 한 번에 읽기 어렵기 때문입니다. 금액 글을 만드는 함수가 보이는 글의 쉼표 뒤마다 줄바꿈 자리를 넣습니다 — 웹 `<wbr>` · 앱 U+200B(ZERO WIDTH SPACE). 읽는 이름(보조 기술) · 복사할 글 · 서버로 보낼 값에는 넣지 않습니다 — 웹 `<wbr>` 은 글자가 아니라 이름 · 복사에 남지 않고, 앱은 `semanticsLabel` 에 원래 글을 주고 고르기 · 복사에서 뺍니다. 쉼표 사이 묶음 하나가 칸보다 길 때만 위의 칸 끝 끊기가 남습니다. 줄이 하나 늘 수 있습니다(글자 200% 순자산 3 → 4줄). 쓰는 자리 — 지표 카드 · 순자산 금액(`specs/components/card.md`), 목록 금액(`specs/components/list.md` 의 "큰 글자에서 값을 본문 아래로"), 상세 합계 — 모두 같은 함수입니다.
- **띄어쓰기에서 먼저 넘깁니다** — 금액 앞뒤에 다른 말이 있으면 줄은 먼저 띄어쓰기에서 넘기고, 금액 안 쉼표 뒤 자리는 **금액 낱말 하나가 칸보다 길 때만** 씁니다. 쉼표 뒤마다 자리를 그냥 두면 줄을 앞에서부터 채워 "이체 1,000," / "000원" 이 되기 때문입니다. 그래서 "이체 100,000원" 은 "이체" / "100,000원" 으로 금액이 통째로 넘어가고, "한도 1,000,000원" 은 "한도" / "1,000,000원" 입니다. 금액 낱말이 새 줄보다도 길면 그때 쉼표 뒤에서 꺾습니다 — **앞 말은 앞 줄에 홀로 남고 금액은 새 줄 맨 앞에서 시작합니다**("이체" / "123,456," / "789원"). 금액을 한 덩어리로 읽고 그 시작을 찾기 쉽게 하기 위해서입니다. 금액 하나뿐인 글은 앞 말이 없어 쉼표 뒤에서 바로 꺾습니다. 구현 — 웹 `withCommaBreaks` 가 금액 낱말을 `inline-block` 상자로 싸고 상자 안 쉼표 뒤에 `<wbr>` 을 넣습니다(상자 폭 = 낱말 폭과 칸 폭 가운데 작은 값). 앱 `keepAllFit` · `KeepAllFitText` · `PListValue.fit` 이 칸 폭을 재 줄바꿈 자리를 고릅니다 — 긴 금액에서도 웹과 같은 모양(앞 말은 앞 줄, 금액은 새 줄 맨 앞)이어야 합니다.
- 예외 — 파일 이름(Attachment Input 의 파일 카드)은 글자 단위로 끊습니다(`word-break: break-all`). 파일 이름은 문장이 아니라 이름표입니다 — 띄어쓰기 없이 밑줄 · 붙임표로 이어져 단어 단위의 이득이 없고, 글자 단위로 채워야 좁은 칸(폭 70)에 이름이 가장 많이 들기 때문입니다(`specs/components/attachment-input.md`).
- 읽어야 하는 글은 자르지 않습니다 — 규정 카드의 본문 · 유의사항(아코디언) 제목 · 나무의 부서 이름은 말줄임 · 줄 수 제한 없이 줄을 바꿔 다 보이고, "더 보기" · 눌러서 상세로 펼치게 하지 않습니다.

### 글자 역할

타입 스케일은 크기 · 줄 높이 · 굵기를, 역할 색은 글자색의 이름을 정합니다. 이 절은 그 둘을 **자리마다 어떻게 묶어 쓰는지** 정합니다 — 컴포넌트의 글자 부위를 뜻으로 묶은 열아홉 역할입니다. 새 자리를 그릴 때는 이 표에서 역할을 고르고, 표에 없는 (크기 · 굵기 · 색) 조합을 새로 만들지 않습니다.

| 역할 | 글자 · 굵기 · 색 | 쓰는 자리 |
|---|---|---|
| R1 화면 제목 | 데스크톱 `text-screen-title` 26/35 · 700 · `fg-neutral` / 폰 탭 첫 화면 t8 · 700 / 폰 들어간 화면 t6 · 700 | 데스크톱 본문 맨 위 h1 · 폰 상단 바. 폰 바 제목은 글자 크기 설정 1.2배까지 |
| R2 화면 부제 | t5 · 400 · `fg-neutral-muted` | 데스크톱 화면 제목 아래 · 폰 탭 첫 화면 바 아래 한 줄 |
| R3 떠 있는 표면 제목 | t8(시트 · 대화상자 · 옆 패널) / t7(팝오버 · 확인창) / t6(메뉴 시트) · 700 · `fg-neutral` | Bottom Sheet · Dialog · Side Panel · Popover · Alert Dialog · Menu Sheet — 표면이 클수록 크다 |
| R4 구역 · 카드 · 목록 머리 제목 | t5 · 700 · `fg-neutral` | Card 머리 · 아코디언 목록 머리 · 페이지 안 카드 밖 구역 제목(데스크톱 h2) · 나무 패널 머리 |
| R5 묶음 이름 | 큰 목록 t4 · 500 · `fg-neutral-subtle` / 작은 목록 · 메뉴 t3 · 400 · `fg-neutral-subtle` / 사이드바 묶음 t4 · 700 · `fg-neutral-muted` / 푸터 열 제목 t3 · 500 · `fg-neutral-muted` | List Header mediumWeak · Select · Icon Picker / Menu · Select medium / Side Navigation / Footer |
| R6 줄 제목 | 목록 t5 · 400 · `fg-neutral` / 메뉴 · 표 · 나무 t4 · 400 / 고르는 상자 · 여닫는 머리 t5 · 500 / 사이드바 항목 t4 · 500 · `fg-neutral-muted` | List · Menu · Table · Tree View / Select Box · Accordion · Collapsible · Switch / Side Navigation |
| R7 표면 머리 설명 | 시트 · 대화상자 · 옆 패널 · 결과 t5 · 400 · `fg-neutral-muted` / 팝오버 · 메뉴 시트 t4 · 400 · `fg-neutral-muted` | 떠 있는 표면 · Result Section 머리. Select Box 설명(t3)도 muted |
| R8 확인창 설명 | t5 · 400 · `fg-neutral` | Alert Dialog 만 — 꼭 읽어야 할 말 |
| R9 줄 · 칸 안 설명 · 메타 · 혼자 서는 안내 | 줄 t3 · 400 · `fg-neutral-subtle` / 칸 t4 / 혼자 서는 안내 · 빈 글 t4 / 작은 메뉴 t2 / 여닫는 머리 설명 t3 · 500 | List 설명 · Tag Group · Field 설명 · Menu 설명 · 표 둘째 줄 · Accordion · Collapsible 설명. 혼자 서는 안내 · 빈 글 — 목록 위 안내 한 줄 · 폼 아래 안내 · 띠 · 카드 안 "없어요" 한 줄(빈 화면 전체는 Result Section). 강조 · 누름 바탕 위에서만 muted |
| R10 보조 숫자 · 축 · 단위 · 캡션 | 차트 축 t1 · 400 · `fg-neutral-subtle` / 툴팁 머리 t2 / 지표 라벨 t3 · 500 / 범례 이름 · 툴팁 줄 이름 · 색 칸 이름 t3(색 칸 t2) · 400 | Chart · Card 지표 라벨 · 파일 크기 · 증감 기준 글 · Color Swatch |
| R11 긴 글 본문 · 보조 | `text-article-body` 16/24 · 400 · `fg-neutral` / `text-article-note` 14/22 · 400 · `fg-neutral-muted` | 공지 · 약관 · 혜택 상세(Accordion 본문) · 메모 본문 |
| R12 값 | 큰 칸 t5 · 400 · `fg-neutral` / 작은 칸 t4 / 막힌 칸 `fg-disabled` | Input · Select · Input Button · Textarea |
| R13 금액 · 큰 숫자 | 줄 금액 t5 · 700 · `fg-neutral`(수입만 `fg-brand`) / 지표 카드 t9(데스크톱 격자 t7) · 700 · `fg-neutral` / 순자산 t12 · 700 · `static-white` | 거래 줄 · 상세 · 합계 · 지표 카드 · 도넛 가운데. 고정폭 숫자 · 빼기 U+2212 · 원까지 |
| R14 증감 | t3 · 500 · ▲ `fg-critical` / ▼ `fg-informative` / 그대로 `fg-neutral-subtle` | Card 증감 · 통계 · 증권 · 예산. 브랜드 채움 위는 `static-white` |
| R15 버튼 글 | Button t3 ~ t6 · 700 / Chip t4 · 500 / 탭 · Segmented 700(쉬는 탭 `fg-neutral-subtle`) / 하단 탭 t1-static · 500 | Button · Chip · Tabs · Segmented Control · Bottom Navigation — 글자만, 색은 변형이 정한다 |
| R16 글 버튼 | t4 · 700 · `fg-neutral-muted` | Card 머리 동작("전체 보기") · 아코디언 "모두 펼치기" · Result Section 둘째 버튼 · List Header 오른쪽 버튼 |
| R17 링크 | 글 안 링크 t4 · 400 · `fg-neutral` · 밑줄 / 푸터 사이트맵 t5 · 500 · `fg-neutral` / 푸터 정책 t4 · 500 · `fg-neutral-muted`(밑줄 없음) | Callout 링크 · Footer |
| R18 칸 라벨 | t5 · 500(굵게 700) · `fg-neutral` | Field 라벨 — "라벨" 은 이 뜻 하나로 부른다(지표 라벨은 R10, 진행 막대 이름은 R6) |
| R19 오류 · 자리 글 · 막힘 | 오류 t4 · 400 · `fg-critical`(+ 아이콘) / 자리 글 t5(작은 칸 t4) · 400 · `fg-placeholder` / 막힘 `fg-disabled` | Field 오류 · 입력칸 placeholder · 막힌 컨트롤. 도움말은 R9 |

표에 없는 크기 — Button 은 크기마다 t3 ~ t6, 하단 탭 이름 t1-static 11/15 · 500, Segmented 칸 글 t5-static 16/22 · 700, 순자산 t12 32/42 · 700, 열지도 칸 t1 · 700. 굵기는 400 · 500 · 700 셋이고 600 은 없습니다.

- **muted 와 subtle** — `fg-neutral-subtle` 은 덧붙인 정보(축 · 시각 · 단위 · 범례 이름 · 메타 줄), `fg-neutral-muted` 는 문장으로 된 보조 글(떠 있는 표면 설명 · "더 불러오지 못했어요." 같은 상태 문구 · 긴 글 보조)입니다. 같은 차트 안의 글자(축 · 툴팁 머리 · 범례 이름 · 툴팁 줄 이름)는 모두 subtle 한 색입니다. 흰 면 위 muted 7.11 · subtle 5.50 이라 눈으로 잘 갈리지 않습니다 — 값이 아니라 이 규칙으로 고릅니다.
- **금액 색** — 지출 · 이체 금액은 `fg-neutral`, 수입만 `fg-brand`("+" 부호와 함께)입니다. 빨강(`fg-critical`)은 증감(▲ 올랐다) 한 뜻으로만 쓰고, 금액을 빨갛게 칠하지 않습니다 — 거래 종류는 부호 · 아이콘 타일 · 배지가 말합니다. 한계 — 파랑이 둘입니다(수입 `fg-brand` · ▼ 내림 `fg-informative`). 라이트는 #0147AD · #1D6EC9(서로 1.65:1)로 갈리지만 다크는 #7AA9F6 · #69ABFF 로 **1.00:1** 이라, 다크 통계 화면에서 수입 금액과 ▼ 증감이 같은 색으로 보입니다.
- **구역 제목** — 페이지 안 카드 밖 구역 제목(데스크톱 h2 — "자산" 화면의 "입출금 · 저축" 같은)은 카드 머리와 같은 t5 · 700 · `fg-neutral` 한 벌입니다. 위계는 크기가 아니라 자리(바닥 위 · 카드 밖)와 여백이 말합니다 — 화면 제목 26 → 구역 16 → 카드 머리 16 → 카드 안 목록 제목 14. 나무 패널 머리도 t5 입니다. 폼 안 묶음 제목(Fieldset)은 List Header 입니다(`specs/components/field.md`).
- **화면 부제** — 화면 제목 아래 한 줄은 t5 · 400 · `fg-neutral-muted` 입니다(바닥 위 6.58:1 · 다크 8.73:1). 떠 있는 표면 설명(R7)과 같은 뜻입니다. 길면 줄을 바꿉니다 — 폰에서는 바 아래 한 줄을 더 차지합니다.
- **글 버튼** — 글 t4 · 700 · `fg-neutral-muted`, 보이는 높이 36(`spacing-x9`) · 좌우 14(`spacing-x3_5`) · 위아래 8 · 모서리 8(`radius-r2`), 누름 바탕 `bg-layer-default-pressed`, 아이콘 · 꺾쇠 없음입니다. 누르는 영역은 44 × 44(보이는 36 위아래로 4 씩 — WCAG 2.5.5 AAA ✓ · 2.5.8 AA ✓)입니다. 줄 끝에 둘 때는 오른쪽 여백만큼 바깥으로 내어(−14) 글자가 줄 끝 글자와 맞게 합니다. 상단 바 글 버튼(t5 · 500) · 스낵바 동작 · 페이지 배너 버튼 · 첨부 다시 시도 · 메뉴 시트 닫기는 각 부품이 정한 값이라 이 역할에 들지 않습니다.
- **자리 글** — `fg-placeholder` 는 gray-600 입니다. 앞뒤 글자 · 칸 아래 설명(`fg-neutral-subtle`, gray-700)보다 한 단계 옅어 빈 칸이 색으로도 보입니다. 한계 — 흰 면 4.18:1 · 다크 시트 3.58:1 로 4.5:1 밑이고, 다크 값(#838997)이 `fg-disabled` 다크와 같습니다. 빈 칸과 막힌 칸은 칸 바탕(`bg-disabled`)과 커서로 갈립니다. 막힌 칸의 자리 글은 Input · Textarea · Select 가 `fg-disabled` 이고, Input OTP 만 막혀도 `fg-placeholder` 그대로입니다(`specs/components/input-otp.md`).
- **묶음 이름** — 사이드바 묶음(t4 · 700 · muted)과 푸터 열 제목(t3 · 500 · muted)은 List Header 규칙(subtle)과 다른 값을 씁니다.
- **500 을 쓰는 줄 제목** — 고르는 상자 · 여닫는 머리 · 내비 항목 · 스위치 라벨만 500 입니다. 나머지 줄 제목은 400 이고, 굵기는 목록 제목 · 금액에 남깁니다. 설명은 400 이고, 여닫는 머리(Accordion · Collapsible)의 설명만 500 입니다 — 머리 제목 500 과 한 벌이기 때문입니다.

## Layout

화면의 격자(중단점 · 콘텐츠 폭 · 여백), 간격 눈금, 화면을 감싸는 틀, 안전 영역, 누르는 영역, 쌓는 층, 오른쪽에서 왼쪽으로 쓰는 언어 대응을 정합니다.

### 그리드

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

- 모바일 우선입니다. 0 – 479 는 기본(base)이라 토큰이 없습니다.
- 화면 틀을 JS 로 바꾸는 기준도 이 값을 씁니다 — 모바일 틀(하단 탭 바) ↔ 사이드바 틀은 `breakpoint-md` 입니다. 스타일(`md:`)과 화면 틀이 다른 폭에서 바뀌면 그 사이 폭에서 모바일 틀 안에 태블릿 스타일이 켜지기 때문입니다.
- 화면 코드는 이름 있는 중단점(`sm` · `md` · `lg` · `xl`)만 쓰고, `min-[NNNpx]:` 처럼 폭을 직접 적지 않습니다.
- Tailwind 로 내보낼 때는 기본 중단점을 먼저 지웁니다(`--breakpoint-*: initial`). 지우지 않으면 Tailwind 기본 `2xl`(1536px)이 남습니다.

#### 콘텐츠 폭 — 밀도

화면마다 밀도를 하나 고르고, 밀도가 콘텐츠의 최대 폭을 정합니다. 폭을 제한하면 가운데 정렬합니다(`margin-inline: auto`).

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-max-low` | `720px` | low 밀도의 최대 폭 · medium 밀도의 768 – 1279 최대 폭 |
| `layout-max-medium` | `1040px` | medium 밀도의 1280 이상 최대 폭 |

| 밀도 | 정렬 | 칸 | 칸 사이 | 좌우 여백 | 768 – 1279 | 1280 이상 | 쓰는 화면 |
|---|---|---|---|---|---|---|---|
| low | 가운데(Centered) | 8 | 24 | 32 | 720 | 720 | 간단한 설정 창 · 대시보드 요약 |
| medium (기본) | 가운데(Centered) | 12 | 24 | 32 | 720 | 1040 | 일반 관리 도구 · 데이터 목록 |
| high | 가변(Fluid) | 전체 폭 | — | 32 | 제한 없음 | 제한 없음 | 대량 데이터 시각화 · 편집 도구 |

- 768 미만은 밀도와 상관없이 칸 없이 화면 폭 전체를 씁니다. 칸 수는 밀도로만 정합니다.
- 앱도 화면 폭 768 이상(폴더블을 펼친 화면 · 태블릿)이면 본문을 `layout-max-low` 720 에서 멈추고 가운데에 둡니다. 로그인처럼 혼자 서는 폼은 480 에서 멈춥니다(시트 폭과 같습니다). 하단 탭 바 · 시트는 폰과 같습니다.
- high 는 최소 폭도 두지 않습니다 — 최소 폭이 있으면 태블릿 세로(768)에서 가로 스크롤이 생기기 때문입니다.
- **최대 폭은 글이 놓이는 폭입니다 — 1040 에서 멈추고 가운데에 섭니다.** medium 화면은 1280 이상에서 글 상자가 `layout-max-medium` 1040 에서 멈추고 가운데에 섭니다. 좌우 여백 32 는 그 상자 바깥입니다 — 여백을 상자 안에 넣어 글 폭을 976 으로 줄이지 않습니다. 남은 폭이 1040 보다 좁으면(1280 · 사이드바 240 이면 976) 그 폭을 다 씁니다. 넓은 모니터(1920 · 2560)에서는 양옆이 빕니다 — 담을 내용(카드 · 목록 줄 · 막대 · 도넛)은 늘지 않고 줄만 길어지기 때문입니다. 표 · 달력처럼 high 밀도 화면은 끝까지 늘어납니다(위 표 — 제한 없음).

#### 콘텐츠 레이아웃

서비스 소개처럼 정보를 전하는 페이지(groo-home 등)에 씁니다 — 두 웹의 관리 화면은 위 밀도를 씁니다. 12칸이고 `breakpoint-lg`(1280) 이상에서 가운데 정렬합니다.

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-max-content` | `1040px` | 콘텐츠 레이아웃 기본 최대 폭 — 읽기에 몰입하게 |
| `layout-max-content-wide` | `1280px` | 넓게 훑어보는 페이지(검색 결과 · 목록)의 최대 폭 |

- `layout-max-medium` 과 값(1040)이 같지만 뜻이 달라 따로 둡니다 — 한쪽만 바꿀 수 있게 하기 위해서입니다.

#### 여백 · 칸 사이

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-margin` | `32px` | 웹 페이지 좌우 여백 · 768 이상 |
| `layout-gutter` | `24px` | 웹 칸 · 카드 사이 · 768 이상 |
| `layout-gutter-narrow` | `16px` | 칸 사이 · 768 미만 — 위아래로 쌓은 카드 사이는 8 |

- 768 미만의 화면 가장자리는 `spacing-global-gutter`(24px)입니다. 카드는 위아래로 8 띄워 쌓습니다(`specs/components/card.md`) — 카드 사이가 가장자리보다 좁아 카드 묶음이 한 덩어리로 보입니다.

#### 역할 간격

자리에 이름을 붙인 간격입니다. 이름은 머리말의 spacing 블록에 두고, 값은 아래 간격 눈금 위에 있습니다.

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `spacing-global-gutter` | 24px · `spacing-x6` | 수평 — 화면 전체의 기본 좌우 여백 |
| `spacing-between-chips` | 8px · `spacing-x2` | 수평 — 칩 사이 |
| `spacing-component-default` | 12px · `spacing-x3` | 수직 — 따로 정한 간격이 없는 컴포넌트 사이 |
| `spacing-between-text` | 6px · `spacing-x1_5` | 수직 — 글 요소 사이 |
| `spacing-nav-to-title` | 20px · `spacing-x5` | 수직 — 상단 내비게이션과 화면 제목 사이 |
| `spacing-screen-bottom` | 56px · `spacing-x14` | 수직 — 화면 맨 아래 여백 |

- Desk 앱 화면의 좌우 여백은 본문 24 입니다. 주간 띠 · 캘린더 격자 안 칸의 인셋 · 카테고리 탭 바의 전폭은 의도한 예외입니다.

#### 사이드바 · 영역

| 토큰 | 값 | 뜻 |
|---|---|---|
| `layout-sidebar` | `240px` | 사이드 내비게이션 폭 |
| `layout-sidebar-collapsed` | `56px` | 접은 사이드 내비게이션(아이콘만) |

- 화면은 머리(GNB) · 사이드 내비게이션 · 본문 · 오른쪽 보조 영역(Aside) 넷으로 나눕니다.
- 사이드 내비게이션은 `breakpoint-md`(768px) 이상에서 보입니다. 그 아래에서는 Desk 웹은 앱과 같은 하단 탭 바(Bottom Navigation), HR 은 상단 바의 ☰ 로 여는 왼쪽 주 메뉴(Side Panel)입니다 — 아래 "화면 틀".
- 머리(상단 바) 높이는 56 입니다 — 폰 · 데스크톱 모든 화면이 같습니다(`specs/components/top-navigation.md`).
- 사이드 내비게이션 안쪽 치수(머리 64 · 항목 44 · 아이콘 20 · 14 / 19 · 500 · 모서리 10)는 `specs/components/side-navigation.md` · `.yaml` 에 있습니다. 768 ~ 1279 는 아이콘만 남긴 56 으로 저절로 접힙니다 — 아래 "화면 틀".

### 간격

간격은 2px 단위 19단계 눈금입니다. 이름의 숫자는 4px 의 배수입니다(`x1` = 4px, `x0_5` = 2px).

| 토큰 | 값 |
|---|---|
| `spacing-x0_5` | 2px |
| `spacing-x1` | 4px |
| `spacing-x1_5` | 6px |
| `spacing-x2` | 8px |
| `spacing-x2_5` | 10px |
| `spacing-x3` | 12px |
| `spacing-x3_5` | 14px |
| `spacing-x4` | 16px |
| `spacing-x4_5` | 18px |
| `spacing-x5` | 20px |
| `spacing-x6` | 24px |
| `spacing-x7` | 28px |
| `spacing-x8` | 32px |
| `spacing-x9` | 36px |
| `spacing-x10` | 40px |
| `spacing-x12` | 48px |
| `spacing-x13` | 52px |
| `spacing-x14` | 56px |
| `spacing-x16` | 64px |

- 간격은 이 눈금의 이름으로 적습니다. 자리에 이름이 있는 간격은 위 "역할 간격" 을 씁니다.

### 화면 틀

화면을 감싸는 틀 — 머리(상단 바) · 주 메뉴(하단 탭 바 · 사이드바) · 본문 — 을 정합니다. 부품의 값은 각 스펙에 있습니다 — `specs/components/top-navigation.md` · `bottom-navigation.md` · `side-navigation.md` · `side-panel.md` · `pagination.md` · `floating-action-button.md`.

#### 문턱 — 768 · 1280

화면 틀이 바뀌는 폭은 둘입니다 — 768(`breakpoint-md` — 모바일 틀 ↔ 사이드바 틀)과 1280(`breakpoint-lg` — 사이드바 접힘 ↔ 펼침, 시트 ↔ 대화상자). 이 둘 밖에 문턱을 두지 않습니다 — Desk 데스크톱 홈의 두 칸도 1280 부터이고 768 ~ 1279 는 한 칸입니다.

| 자리 | 0 – 767 | 768 – 1279 | 1280 이상 |
|---|---|---|---|
| 머리 | 상단 바 56 — 탭 첫 화면은 큰 제목, 그 아래는 ← + 제목 | Desk 데스크톱 머리 56 · HR 은 머리 없음 | 같다 |
| 주 메뉴 | Desk 하단 탭 바 · HR ☰ → 왼쪽 옆 패널 | 사이드바 접힘 56(손으로 펼침) | 사이드바 펼침 240(손으로 접음 · 기억) |
| 화면 제목 | 상단 바의 제목 | 본문 맨 위 `h1` | 같다 |
| 폼 · 상세 · 고르기 | Bottom Sheet | Bottom Sheet | Dialog · Popover |
| 동작 목록(들어간 화면 머리 ⋮ · 표 줄 ⋮ — 목록 줄에는 ⋮ 없음) | Menu Sheet | Menu Sheet | Menu |
| 접힌 사이드바의 하위 | — | 옆 펼침 메뉴(줄 44 — Menu Sheet 로 바꾸지 않는다) | 같다(손으로 접었을 때) |
| 긴 목록 | 끝없이 불러오기 | 상황에 따라 — 아래 "목록 넘기기" | 같다 |
| 데이터 표 | Table Pagination(표와 함께 가로 스크롤) | Table Pagination | Table Pagination |
| 화면의 주 동작 | 탭 바 가운데 + · 탭 바 없는 화면은 떠 있는 버튼 | 머리의 버튼 | 같다 |
| 본문 폭 | 화면 폭 | 밀도 표(720) | 밀도 표(720 · 1040) |

- Pagination 의 칸 수는 480(`breakpoint-sm`)에서 9 ↔ 7 입니다.
- 768 – 1279 는 사이드바 틀이지만 겹치는 표면은 시트입니다 — 터치 태블릿과 작은 노트북이 섞인 폭이라 손가락에 맞는 쪽을 둡니다.

#### 목록 넘기기

긴 목록을 나누는 방식은 상황에 따라 고릅니다 — 늘 한 방식으로 정해 두지 않습니다. 스크롤로 내려가는 환경은 끝에 닿으면 저절로 더 불러오는 쪽이 자연스럽고, 쪽 단위로 훑는 자리는 Pagination 이 나을 수 있습니다.

| 상황 | 고를 것 | 예 |
|---|---|---|
| 스크롤로 내려가는 환경 — 폰 · 긴 목록 | 끝없이 불러오기 — 끝에 닿으면 저절로 더 불러온다(받는 중 · 다시 시도 · 끝 글) | 폰 카드 혜택 |
| 쪽 단위로 훑는 자리 — 데스크톱 | Pagination 이 좋을 수 있다(쪽은 주소에 — 칸은 링크) | 데스크톱 카드 혜택 격자 |
| 자연스러운 묶음이 있는 목록(달) | 묶음 옮기기가 쪽 넘김 — 묶음 하나가 한 쪽이고, 넘김 줄을 따로 두지 않는다 | 가계부 거래(달 하나 = 한 쪽 — 달 이동) |
| 데이터 표 | Table Pagination | 직원 · 휴가 내역 · 회비 |
| 전체가 화면 3 ~ 4개 분량 이하 | 나누지 않고 한 번에 | — |

같은 목록도 폭 · 환경에 따라 다르게 고를 수 있습니다 — 고르는 표와 부품의 값은 `specs/components/pagination.md` 의 "언제 쪽을 나누나" 에 있습니다.

#### 머리 · 화면 제목

- 머리(상단 바)는 높이 56 입니다 — 폰 · 데스크톱 모든 화면이 같습니다. 스크롤해도 선 · 그림자를 긋지 않습니다(Elevation).
- 폰은 상단 바의 제목이 화면 제목(`h1`)입니다 — 탭 첫 화면은 22 / 30(`text-t8`), 그 아래 화면은 18 / 24(`text-t6`), 둘 다 700 · 왼쪽입니다.
- 데스크톱은 머리에 제목을 두지 않습니다 — 본문 맨 위 `h1` 이 화면 제목입니다. `text-screen-title`(26 / 35 · 700)이고, 머리 아래 `spacing-nav-to-title`(20)을 둡니다. 모든 화면에 하나입니다(홈 · 캘린더도). 제목 줄은 한 줄입니다 — 제목(설명은 그 아래)이 왼쪽, 그 화면의 동작 버튼(Button small · `neutralOutline` — 회색 바닥 위)이 오른쪽입니다.
- HR 은 데스크톱 머리를 두지 않습니다 — 접기 버튼은 사이드바 머리에, 테마는 사이드바 바닥 계정 메뉴의 "화면 테마"(기기 설정 · 라이트 · 다크)에 두고, 지금 위치는 사이드바의 지금 항목이 알립니다.

#### 화면을 옮길 때

| 일 | 스크롤 | 초점 |
|---|---|---|
| 다른 화면으로(링크 · 사이드바 항목) | 맨 위 | 새 화면의 제목(`h1`) |
| 뒤로 가기 · ← | 그 화면에 있던 자리 | 그 화면의 제목 |
| 하단 탭 옮기기 | 그 탭의 마지막 화면 · 자리(탭마다 기억 — 웹도 목록이 그려진 뒤 돌려놓는다) | 그 탭 화면의 제목 |
| 화면 맨 위 1차 탭 옮기기(가계부 · 자산 · 통계 · 예산) | 그 탭에 있던 자리(탭마다 기억 — Tabs) | 고른 탭 |
| 지금 탭을 다시 누름 | 맨 위 · 그 탭의 첫 화면 | 그대로 |
| 쪽 넘기기(Pagination) | 목록 맨 위 | 누른 칸 — "N페이지" 를 알린다 |

- 문서 제목은 화면마다 "{화면 제목} - 그루 담다" · "{화면 제목} - 그루 이음" 입니다.
- ← 는 들어온 화면으로(History) 가는 것이 기본이고, 앞 화면이 없으면 상위 화면으로 가며 주소를 고쳐 씁니다. 설정처럼 "어디서 왔든 같은 곳" 이 나은 화면은 화면마다 상위 화면(Hierarchy)을 고를 수 있습니다 — 고르는 표는 `specs/components/top-navigation.md` 의 "← 는 어디로" 에 있습니다. ✕ 는 모달 · 독립 흐름을 닫을 때만 씁니다.

#### 이동 부품 고르기

화면 사이 · 화면 안을 오가는 부품을 고르는 표는 여기 한 벌입니다 — Top Navigation · Bottom Navigation · Side Navigation · Side Panel · Tabs 스펙은 이 표를 가리키고 제 값 · 동작만 둡니다.

| 이동 | 부품 | 자리 | 언제 |
|---|---|---|---|
| 서비스의 최상위 갈래 — 폰 | **Bottom Navigation** | 화면 아래 떠 있는 알약 · 다섯 칸 | 루트 화면들 사이 — 칸은 어느 화면에서나 같다 |
| 서비스의 최상위 갈래 — 768 이상 | **Side Navigation** | 왼쪽 240(1280 미만은 접힌 56) | 같은 갈래를 넓은 화면에서 |
| HR 폰의 주 메뉴 | **Side Panel**(☰) | 왼쪽에서 열린다 | 하단 탭 바가 없는 서비스 |
| 지금 화면 · 한 단계 위로 | **Top Navigation** | 맨 위 56 | 탭 첫 화면은 큰 제목, 그 아래는 ← + 제목, 흐름을 닫을 때만 ✕ |
| 한 탭 안의 구역 | **Tabs** — Line(1차) · Chip Tabs(2차) | 상단 바 바로 아래 | 탭 바 칸을 늘리지 않고 더 나눌 때 — 내용 전체가 바뀐다 |
| 같은 내용의 보기 · 거르기 | Segmented Control · Chip — 이동이 아니다 | 내용 바로 위 | 목록은 그대로, 보이는 것만 바뀐다 |

#### 화면 바탕 — 회색 바닥 위 흰 층

Desk 폰 화면(앱 · 768 미만 웹)의 바닥은 늘 `bg-layer-basement`(회색)입니다 — 셸이 칠하고, 화면은 바탕을 따로 칠하지 않습니다(셸 밖 화면만 흰 면 — 아래 표의 끝 줄). 그 위에 화면 종류에 따라 흰 층(`bg-layer-default`)을 놓습니다.

화면 안을 나누는 방식 — 띠 구역(구역 · 묶음마다 띠) · 흰 면 하나(띠 없이 구역 제목 · 여백) · 띠 안 가르기(띠는 주제가 바뀔 때만, 띠 안은 구역 제목 · 여백 · 선) — 은 화면마다 아래 "화면을 나누는 법" 의 세 표를 참고해 고릅니다. 화면마다 나은 방식이 다르기 때문입니다. 데스크톱(768 이상)은 카드입니다.

| 화면 | 바닥 위에 놓는 것 | 쓰는 화면 |
|---|---|---|
| 띠 화면 | 화면 폭 흰 띠 — 묶음(목록 제목 + 줄) · 구역(머리 + 내용)마다 띠 하나. 띠 사이 8 은 바닥이 그대로 보이는 틈이다(바닥 위에 흰 층을 8 띄워 쌓는다). 띠는 화면 끝까지 닿고 모서리 · 테두리 · 그림자가 없다. 첫 띠는 머리 바로 아래에 붙고 마지막 띠 아래에도 틈이 없다 — 8 은 띠 사이에만 · 띠 안 위 4 · 아래 8 | 홈 · 자산 · 통계 · 예산 · 카드 상세 · 설정 · 전체 · 알림 · 폼 · 밤하늘 · 숲 리포트 · 증권 |
| 흰 화면(흰 면 하나) | 화면 전체가 흰 층 하나 — 묶음 · 구역은 목록 제목 · 구역 제목 · 여백으로 가른다 | 가계부 거래(그 달 거래 목록 — 날짜 묶음은 목록 제목) · 캘린더(달력 격자만) · 거래 검색(검색 칸 · 칩 · 결과가 한 면, 날짜는 목록 제목) · 메모(목록 — "고정 · N" · "모든 메모 · N" 은 목록 제목, 띠 · 카드 · 줄 사이 선 없음) |
| 셸 밖 화면 | 회색 바닥 없이 바닥이 흰 면(`bg-layer-default`) 하나 — 웹 · 앱. 띠 · 카드를 쌓지 않는 한 면짜리 화면이다 | 로그인 · 스플래시(앱 첫 화면) · 해지 완료 · 업데이트 게이트 · 앱 잠금(해지 완료와 같은 틀 — Result Section + 바닥 large 버튼) |

이 표가 Desk 폰 화면의 이름을 적는 유일한 자리입니다 — Divider · List · Card · Accordion 스펙은 화면 이름을 되풀이하지 않고 "놓이는 바탕에 따라" 만 말하며 이 절로 링크합니다.

- **띠 화면의 시작 · 끝에 틈을 두지 않습니다** — 머리(상단 바 · 가계부 묶음 탭) 바로 아래 첫 띠 위에 8 틈을 두지 않고, 마지막 띠 아래에도 두지 않습니다. 8 틈은 띠와 띠 사이에만 있습니다. 틈은 두 내용 사이를 가르는 것이라, 시작에 두면 머리와 첫 띠 사이에 가를 것 없는 회색 줄이 생겨 화면 전체가 어긋나 보이기 때문입니다. 첫 띠 안의 위 여백(머리 글 위 24 · 띠 안 위 4)은 다른 띠와 같습니다.
- 숫자 · 그림 · 차트 구역을 띠에 담을 때 띠 안은 카드 안과 같은 값입니다 — 머리(제목 t5 16/22 · 700 + 오른쪽 글 버튼)는 글 위 24 · 좌우 24 · 아래 4, 글 · 숫자 내용은 좌우 24 · 아래 24, 목록은 줄이 제 좌우 24 를 갖습니다. 띠 안 위 4 · 아래 8 은 이 24 안에 듭니다. 묶음 목록(설정 · 전체)의 머리는 목록 제목(List Header)입니다.
- 홈의 순자산(Card `hero`)도 폰에서는 띠입니다 — 화면 폭 · 모서리 0 · 테두리 없음이고, 그라디언트 · 흰 글자 · 안 24 는 카드와 같습니다. 홈 머리 바로 아래 첫 띠라 틈 없이 붙습니다. 채움 그라디언트라 다른 구역과 한 띠에 넣지 않습니다. 자산 화면의 순자산 요약은 `hero` 가 아니라 흰 띠입니다.
- 띠 · 흰 화면 위에는 테두리 카드를 두지 않습니다 — 흰 위 흰이라 면은 사라지고 테두리만 남기 때문입니다. 띠 안을 나누는 것은 구역 제목 · 여백 · 선입니다. 예외로 Accordion `separated` · 안내 상자([Callout](specs/components/callout.md)) · [Select Box](specs/components/select-box.md) 는 흰 면 위에 그대로 둡니다.
- 줄 목록(List)은 바닥에 바로 두지 않습니다 — 카드 · 띠 · 흰 화면 · 시트 위에 둡니다. 누른 줄의 바탕(`bg-layer-default-pressed`)은 흰 면 위에서만 보이기 때문입니다(회색 위 1.02:1).
- 띠 사이 틈은 흰 띠와 바닥의 대비가 라이트 1.08:1 · 다크 1.13:1 이라 거의 보이지 않습니다 — 묶음은 목록 제목이 함께 가릅니다. 구역이 많은 화면(홈 · 통계)도 모서리 · 테두리 없이 머리 글로 갈립니다. 띠는 글이 화면 끝 24 에서 시작해 줄 안 폭이 카드보다 48 넓습니다.
- 가계부 묶음(거래 · 자산 · 통계 · 예산)을 좌우로 밀면 흰 화면(거래)과 회색 띠 화면(자산)이 이어 붙어 바탕이 바뀝니다 — 그대로 둡니다.
- 데스크톱(768 이상)은 이 표 밖입니다 — 회색 바닥 위 카드입니다(Card). 같은 구역이 폰은 띠, 데스크톱은 카드입니다.

#### 화면을 나누는 법 — 상황 → 고를 것 (참고)

화면 안을 무엇으로 나눌지 고르는 **참고 표**입니다 — "늘 X" 로 정해 두는 규칙이 아닙니다. 폰 화면은 이 표를 보며 화면마다 고릅니다. 값(1px 선 · 8 틈 · 24 여백)은 [Divider](specs/components/divider.md) · [List](specs/components/list.md) · [Card](specs/components/card.md) 스펙 그대로입니다. 가르는 세기는 셋입니다 — 약함(같은 묶음 안에서 내용을 가를 때) · 중간(묶음이나 동작 영역을 가를 때) · 강함(앞 내용과 크게 다른 내용을 가를 때). 강함의 8 틈은 선이 아니라, 회색 바닥 위에 흰 층을 올리고 그 사이를 띄운 것입니다.

**① 상황 → 고를 것**

| 상황 | 고를 것 | 세기 | 예 |
|---|---|---|---|
| 같은 묶음 안의 키-값 · 설명 줄(상세의 결제 정보) | 들인 선 — 또는 선 없이 줄 여백 | 약함 | 거래 상세 결제 정보 |
| 되풀이되는 같은 모양의 줄(거래 · 계좌 · 검색 결과) | 선 없음 — 줄의 위아래 12 가 가른다. 촘촘하거나 설명 없는 긴 목록만 줄 사이 선 | — | 오늘 쓴 돈 · 거래 검색 |
| 한 면 안에서 묶음이 바뀜 · 바닥 버튼 영역 · 스크롤되는 본문 위 머리 | 끝까지 선 | 중간 | 상세의 정보 ↔ 메모 · 바닥 버튼 위 |
| 같은 이야기가 이어지는 구역 · 소묶음(날짜 묶음, 이번 달 요약 ↔ 예산) | 한 면 안에서 구역 제목(카드 머리 글) 또는 목록 제목 + 여백 | 약함 ~ 중간 | 홈 이번 달 · 예산, 검색 날짜 |
| 주제가 크게 바뀜 — 다른 일을 하는 묶음 | 8 틈(띠를 끊는다) — 폰 띠 화면 | 강함 | 설정 묶음 · 순자산 ↔ 이번 달 |
| 데스크톱(768 이상)에서 구역이 바뀜 | 카드 — 쌓으면 8, 나란하면 24 | 강함 | 데스크톱 홈 |
| 화면 전체가 하나의 목록 | 흰 화면 — 날짜는 목록 제목으로만 | — | 가계부 거래 |

고르는 차례는 이렇습니다 — ① 줄 여백 · 제목만으로 갈리면 선을 두지 않습니다 ② 한 면 안이면 약함 → 중간 순으로 고릅니다 ③ 다른 일을 하는 묶음일 때만 띠를 끊습니다(8 틈). 가르는 것을 두기 전에 꼭 필요한지 먼저 봅니다.

**② 비슷한 방식 견주기**

| 방식 | 세기 | 경계 모양 | 놓는 바탕 | 폰(768 미만) | 데스크톱 | 주의 |
|---|---|---|---|---|---|---|
| 구역 제목 · 목록 제목 + 여백 | 약함 | 선 없음 — 머리 글(16/22 · 700 또는 목록 제목 14/19)과 위 24 | 흰 면 안(띠 · 카드 · 시트 · 흰 화면) | ✓ | ✓ 카드 안 | 머리가 없으면 갈리지 않는다 |
| 들인 선 | 약함 | 1px `stroke-neutral-subtle` · 줄 글과 같은 24 들임(List 줄 사이 선) · Divider 는 16 | 흰 면 안 | ✓ | ✓ | 반복 목록 줄마다 긋지 않는다 |
| 끝까지 선 | 중간 | 1px `stroke-neutral-subtle` · 면 폭 전체 | 흰 면 안 | ✓ | ✓ | 면의 맨 위 · 맨 아래에는 긋지 않는다 |
| 8 틈 띠 | 강함 | 흰 띠 사이 회색 8 — 선이 아니다(라이트 1.08:1 · 다크 1.13:1 로 잘 안 보여 머리 글이 함께 가른다) | 회색 바닥 위 | ✓ 화면마다 고른다 | ✗ (카드) | 첫 띠 위 · 마지막 띠 아래 · 한 줄짜리 띠를 연달아 두지 않는다 |
| 흰 면 하나(흰 화면) | — | 화면 전체 흰 층 하나 — 구역은 제목 · 여백 · 선으로 | 바닥 대신 | ✓ 화면마다 고른다 | — | 구역이 많으면 머리 글 · 여백이 충분히 갈라야 한다 |
| 카드 | 강함 | 1px `stroke-neutral-weak` 테두리 · 모서리 16 · 그림자 없음 | 회색 바닥 위만 | ✗ | ✓ 기본 | 흰 면(띠 · 시트) 위에 두지 않는다 · 카드 안 카드 없음 |

**③ 예외 · 주의**

- **반복되는 목록은 구분자가 필요 없을 수 있습니다** — 줄의 위아래 여백이 줄을 가릅니다. 선은 촘촘하거나 설명 없는 긴 목록에만 긋습니다.
- **8 틈도 꼭 필요할 때만 둡니다** — 같은 성격의 묶음이 이어지면 띠를 끊지 않고 목록 제목으로만 가릅니다. 가계부 거래 흰 화면이 날짜를 이렇게 가릅니다.
- **첫 띠 위 · 마지막 띠 아래에는 틈 · 선 · 빈 띠를 두지 않습니다** — 첫 띠는 머리(상단 바 · 가계부 묶음 탭) 바로 아래에 붙고, 띠가 끝난 아래 회색은 바닥이지 구분선이 아닙니다(위 "화면 바탕").
- **한 줄짜리 띠를 연달아 두지 않습니다** — 달 고르기 · 장 상태 · 안내 한 줄은 이어지는 띠의 맨 위에 둡니다.
- **굵은 회색 막대를 긋지 않습니다** — "8px 구분선" 은 없습니다. 흰 화면 안에서 크게 나눠야 하면 그 화면을 띠 화면으로 고릅니다.
- **띠 안에 카드를 두지 않습니다**(위 "화면 바탕" — 예외 Accordion `separated` · Callout · Select Box).

#### 랜드마크

- 머리는 `header` 이고 `main` 밖에 둡니다.
- 주 메뉴는 이름 있는 `nav` 입니다 — 하단 탭 바 · 사이드바 · 옆 패널의 주 메뉴 모두 "주 메뉴" 입니다.
- 본문은 `main` 하나입니다.
- 화면 맨 앞에 "본문 바로가기" 링크를 둡니다 — 키보드 초점이 오면 보이고, 누르면 `main` 으로 갑니다.
- 앱은 랜드마크가 없습니다(Flutter 의 `main` · `navigation` 역할은 웹 엔진만 씁니다). 그래서 상단 바의 제목을 머리말로 두고(`Semantics(header: true, headingLevel: 1)` — iOS 는 `header` 를, 안드로이드는 `headingLevel` 을 읽습니다) 목록 제목(List Header) · 카드 머리는 단계 2 로 답니다. 상단 바의 버튼마다 이름을 답니다. 주 메뉴는 이름 있는 묶음(`Semantics(container: true, label)` — "주 메뉴", 번역 문구 `navMainMenu` · en "Main menu")입니다. 본문 바로가기는 두지 않습니다 — 화면 읽기는 제목 단위로 건너뛰고, 상단 바의 누를 것은 셋 이하이기 때문입니다.
- 이름은 모두 번역 문구입니다 — 코드에 한국어 상수를 두지 않습니다(International Design). 알림 벨의 이름은 새 알림이 있으면 "알림, 새 알림 있음"(en "Notifications, new notifications"), 없으면 "알림" 입니다(Notification Badge — 점은 `aria-hidden` · 낭독 제외).

### Safe Area

화면 가장자리는 상태 표시줄 · 홈 표시줄 · 카메라 자리(노치) · 둥근 모서리에 가릴 수 있습니다. 무엇을 안전 영역 안에 두고 무엇을 화면 끝까지 채울지 정합니다 — 요소가 가려지거나 잘렸을 때 정보나 기능을 잃는지에 따라 둘 자리를 정합니다.

#### 안과 끝

| 무엇 | 어디까지 | 예 |
|---|---|---|
| 누르는 것 · 읽는 것(버튼 · 링크 · 입력칸 · 탭 · 글 · 아이콘 · 배지 · 뜻이 있는 그림) | 안전 영역 안 | 상단 바의 버튼 · 제목, 탭 바의 칸, 떠 있는 버튼, 바닥 버튼 |
| 배경 · 장식 | 화면 끝까지 | 상단 바 · 바닥 바의 바탕, Page Banner 의 바탕, 화면 폭 Divider, 장식 그림 |
| 스크롤 영역 | 화면 끝까지 — 스크롤하면 가려진 것을 안으로 가져올 수 있습니다 | 목록(아래 끝까지), 가로 칩 줄 · Tabs(좌우 끝까지) |
| 가로 줄(Tabs · 칩 줄)의 칸 | 안전 영역 안 — 넘치지 않는 줄은 스크롤로 가져올 수 없습니다 | 줄의 바탕 · 아래 선은 화면 끝까지, 첫 칸 · 마지막 칸은 안전 영역 + 여백 안 |
| 고정된 바 · 버튼 | 안전 영역 안 — 스크롤로 가져올 수 없다 | 탭 바 · 바닥 버튼 · 떠 있는 버튼 |

- 네 변의 안전 영역은 따로입니다 — 한 방향이 늘 0 이라고 가정하지 않고 늘 지금 값을 씁니다(웹 `env(safe-area-inset-*)` · 앱 `MediaQuery.viewPadding`).
- 한 요소에 바탕과 내용이 함께 있으면 부분마다 따로 둡니다 — 바탕은 끝까지, 내용은 안입니다.

#### 여백은 안전 영역 경계부터

- 좌우 여백(본문 `spacing-global-gutter` 24 · 상단 바의 6)은 화면 끝이 아니라 안전 영역 경계에서 잽니다 — 안전 영역 + 여백입니다.
- 바닥에 고정한 바의 버튼은 아래 안전 영역 경계에서 바의 안쪽 여백만큼 띄웁니다.
- 가운데 정렬은 안전 영역을 기준으로 합니다 — 왼쪽 · 오른쪽 안전 영역이 다르면 화면 가운데가 아닙니다.
- 끝까지 스크롤하면 마지막 항목 전체가 안전 영역 안에 보이게, 스크롤 내용의 끝에 안전 영역 + 기본 여백을 둡니다. 가로로 스크롤하는 줄도 양 끝에 같은 여백을 둡니다 — 끝까지 밀면 첫 칸 · 마지막 칸이 안전 영역 안에 섭니다.
- 떠 있는 탭 바는 바의 아래 여백 6 만 홈 표시줄 영역에 걸치고, 누르는 칸은 그 위에서 끝납니다(Bottom Navigation).

#### 부품이 스스로 반영하는 방향

| 부품 | 반영하는 방향 |
|---|---|
| Top Navigation | 위(바가 그만큼 높아진다) · 좌우 |
| Bottom Navigation | 아래 · 좌우 |
| Bottom Sheet · Menu Sheet | 아래 · 좌우 · 위(시트가 화면 위까지 올라올 때 — 키보드 · 꽉 찬 시트). 최대 폭보다 넓은 화면에서는 좌우 안전 영역을 뺀 자리의 가운데에 섭니다 — 본문과 같은 세로 줄 |
| Dialog · Alert Dialog | 네 변 — 바깥 여백을 안전 영역 경계부터 잽니다. 좌우 안전 영역을 뺀 자리의 가운데에 섭니다 |
| Side Panel | 위(머리) · 아래(패널 내용 끝) · 붙은 쪽(폭에 더한다) |
| Snackbar | 좌우 · 아래 |
| Floating Action Button | 오른쪽 · 아래 |
| 화면 본문 | 좌우 · 아래(스크롤 내용 끝) |

#### 옆 · 모서리의 상태 칸

상태 표시줄 · 카메라가 위가 아니라 옆이나 모서리에 있는 기기도 같은 규칙을 씁니다. 시스템은 그런 칸을 그 변 전체의 안전 영역으로 알려 줍니다 — 칸이 위쪽 일부에만 있어도 그 변 전체를 비우고, 칸 아래 빈 곳에 누르는 것을 끼워 넣지 않습니다. 같은 기기라도 앱과 웹(브라우저 막대가 칸을 처리)이 받는 방향이 다릅니다.

#### 폴더블 — 접고 펼 때

접으면 폰 폭, 펼치면 넓은 화면이 되는 기기는 접기 · 펴기를 화면 크기가 바뀌는 일로 다룹니다.

- 보던 화면 · 스크롤 위치 · 입력 중인 값 · 열린 시트를 그대로 두고, 배치만 바뀐 폭으로 다시 합니다 — 768 미만은 폰 배치, 이상은 넓은 화면 배치(Layout 의 "콘텐츠 폭 — 밀도")입니다.
- 안전 영역은 접기 · 펴기 · 돌리기마다 다시 읽습니다 — 칸이 위에서 옆으로 옮겨 갑니다. 처음 한 번 읽어 둔 값을 쓰지 않습니다.
- 접힘선은 화면이 이어져 있어 내용이 가로질러도 됩니다. 반쯤 접어 세운 자세에서도 펼친 화면과 같은 배치입니다.

#### 웹 — viewport-fit=cover

안전 영역 값을 받으려면 문서의 `viewport` 메타에 `viewport-fit=cover` 를 둡니다 — 없으면 iOS 사파리가 `env(safe-area-inset-*)` 를 0 으로 계산합니다.

### 터치 영역

누를 수 있는 요소의 최소 크기입니다. 누르는 영역은 모두 44 × 44(`touch-min`) 이상입니다 — WCAG 2.5.5 AAA 를 지킵니다. 데스크톱에서도 같습니다.

| 토큰 | 값 | 뜻 |
|---|---|---|
| `touch-min` | `44px` | 누르는 영역의 최소 크기 — 모든 누르는 요소 |
| `touch-pill-w` | `100px` | 알약 버튼의 최소 폭 |
| `touch-circular` | `44px` | 원형 칩 · 아이콘 버튼(= `touch-min`) |

- 모든 누르는 요소: `min-height: var(--touch-min); min-width: var(--touch-min);`(44 × 44).
- 알약 버튼: `height: var(--touch-min); min-width: var(--touch-pill-w); border-radius: var(--radius-full);`.
- 원형 아이콘 버튼: `width: var(--touch-circular); height: var(--touch-circular); border-radius: var(--radius-full);`.
- 보이는 크기가 44 보다 작은 부품은 누르는 영역을 바깥으로 넓혀 44 를 채웁니다(Inclusive Design).
- 터치 영역은 부품의 바깥 크기라 간격(spacing) 토큰과 따로 둡니다.

### Z-index

겹쳐 뜨는 층의 차례입니다. 값은 이 표가 원본이고, `specs/z-index.md` 의 층 표(L0 ~ L9) · 컴포넌트 YAML · 레시피가 이 값을 따릅니다. 이름은 층을 부릅니다.

| 토큰 | 값 | 층 · 쓰는 곳 |
|---|---|---|
| `z-base` | `auto` | L0 페이지 — 쌓임 맥락을 만들지 않는다 |
| `z-sticky` | `50` | L1 페이지에 붙은 것 — 상단 바(Top Navigation) · 하단 탭 바(Bottom Navigation) · 떠 있는 버튼(Floating Action Button) · 스피드 다이얼 · 사이드바(Side Navigation — sticky 라 안의 펼침 메뉴가 본문 카드 아래로 가리지 않게) |
| `z-modal` | `100` | L2 딤 — Dialog · Bottom Sheet · Menu Sheet · Side Panel(옆 패널) |
| `z-modal-content` | `101` | L2 표면 — 자기 딤 바로 위 |
| `z-floating` | `200` | L3 트리거에 붙어 뜨는 것 — Popover · Select 목록 · Menu. 페이지에서도 모달 안에서도 같은 값 |
| `z-tooltip` | `210` | L4 말풍선 — Help Bubble · Tooltip |
| `z-alert` | `300` | L5 Alert Dialog 딤 |
| `z-alert-content` | `301` | L5 Alert Dialog 표면 |
| `z-snackbar` | `400` | L6 Snackbar 자리 |
| `z-dev` | `9999` | L9 개발 환경 표시 — 운영에서는 그리지 않는다 |

#### 왜 이 순서인가

- **트리거에 붙어 뜨는 것(L3)은 모달(L2) 위입니다** — 대화상자 · 시트 안에서 연 Select 목록 · 메뉴가 표면(101) 위에 떠야 하기 때문입니다. 페이지에서 열어도 같은 200 이라, 부르는 자리마다 값을 고르지 않습니다.
- **말풍선(L4)은 팝오버(L3) 위입니다** — 팝오버 · 메뉴 안의 ⓘ 로 연 말풍선이 가려지지 않습니다.
- **확인창(L5)은 메뉴(L3) 위입니다** — 되돌릴 수 없는 결정은 열린 모든 표면을 덮습니다.
- **스낵바(L6)는 모든 표면 위입니다** — 확인창이 열려 있어도 잠깐 뜨는 알림은 보입니다.
- **딤과 표면은 1 차이입니다**(100 · 101, 300 · 301) — 표면이 자기 딤 바로 위에 놓입니다. 층과 층 사이는 넉넉히 비웁니다.
- **화면 차례를 더하지 않습니다** — 웹은 화면을 쌓지 않으므로(주소가 바뀌면 화면이 바뀝니다) 층마다 값이 하나입니다.
- **앱(Flutter)은 숫자 없이 같은 순서를 따릅니다** — Flutter 에는 z-index 가 없고 라우트 · 오버레이가 연 순서로 쌓이므로, 페이지 → 시트 · 대화상자 → 메뉴 · 말풍선 → 확인창 → 스낵바 순서가 되게 띄웁니다.

#### 쓰는 법

- CSS: `z-index: var(--z-modal);` — 딤은 `--z-modal`, 표면은 `--z-modal-content` 입니다.
- Tailwind v4: `z-(--z-floating)`(= `z-index: var(--z-floating)`). 숫자 클래스(`z-[200]` · `z-50`)로 층을 적지 않습니다.
- 한 컴포넌트 안에서 겹침을 정리하는 작은 값(줄 끝 버튼 `z-[1]` · 포커스 칸 `z-10`)은 층이 아닙니다 — 토큰으로 부르지 않습니다.
- 미리보기 · 문서 그림처럼 틀 안에 가둘 때는 틀에 `isolation: isolate` 를 둡니다 — 안의 값이 틀 밖의 층과 겨루지 않습니다.
- 확인창 안에서 팝오버를 띄우는 드문 자리는 호출처가 올립니다 — `specs/z-index.md`.
- 내보내기는 이 표에서 `--z-*` 변수를 만듭니다. 값은 정수나 `auto` 만 받습니다.

#### 담다에서 쓰는 층

- 하단 탭 바는 `z-sticky` 입니다 — 페이지 스크롤과 상관없이 늘 아래에 있습니다.
- Bottom Sheet(가계부 거래 입력 · 할 일 추가)는 딤 `z-modal` · 시트 `z-modal-content` 입니다 — 하단 탭 바 위로 올라옵니다.
- 확인창(메모 삭제 확인)은 딤 `z-alert` · 확인창 `z-alert-content` 입니다 — 시트가 열려 있어도 확인창이 위에 섭니다.
- Snackbar(저장 완료 · 동기화 실패)는 `z-snackbar` 입니다 — 모든 층 위에 섭니다.
- 시트 안에서 연 Select 목록 · 메뉴(카테고리 고르기)는 `z-floating` 그대로입니다 — 시트(101) 위에 뜹니다.
- 메모 카드 안의 펼침 목록은 카드에 `isolation: isolate` 를 둬 카드 안에서만 겨루게 합니다.

### RTL

오른쪽에서 왼쪽으로 쓰는 언어(아랍어 · 히브리어)에 대응합니다. CSS 논리 속성(logical property)을 쓰면 LTR(한국어 · 영어 · 일본어)과 RTL 이 저절로 갈립니다. 컴포넌트는 `padding-left` · `right` 같은 물리 속성 대신 처음부터 논리 속성으로 적습니다.

#### 논리 속성 대응

| 물리 속성(LTR 가정) | 논리 속성(방향 자동) | 뜻 |
|---|---|---|
| `margin-left` | `margin-inline-start` | 시작 쪽 (LTR=왼쪽, RTL=오른쪽) |
| `margin-right` | `margin-inline-end` | 끝 쪽 (LTR=오른쪽, RTL=왼쪽) |
| `padding-left` | `padding-inline-start` | 같다 |
| `padding-right` | `padding-inline-end` | 같다 |
| `border-left` | `border-inline-start` | 같다 (예: Banner 띠) |
| `border-right` | `border-inline-end` | 같다 |
| `border-top-left-radius` | `border-start-start-radius` | 시작-시작 (LTR=왼쪽 위, RTL=오른쪽 위) |
| `border-top-right-radius` | `border-start-end-radius` | 시작-끝 |
| `border-bottom-left-radius` | `border-end-start-radius` | 끝-시작 |
| `border-bottom-right-radius` | `border-end-end-radius` | 끝-끝 |
| `left: 0` | `inset-inline-start: 0` | 시작 쪽 위치 |
| `right: 0` | `inset-inline-end: 0` | 끝 쪽 위치 |
| `text-align: left` | `text-align: start` | 시작 쪽 정렬 |
| `text-align: right` | `text-align: end` | 끝 쪽 정렬 |
| `width` | `inline-size` | 가로 (쓰기 방향을 따른다, 가로쓰기에서는 같다) |
| `height` | `block-size` | 세로 |
| `max-width` | `max-inline-size` | 같다 |

세로(block) 축은 `padding-block-start` · `padding-block-end` 처럼 적습니다. 가로쓰기에서 위 · 아래는 RTL 과 상관없지만, 한 가지 방식으로 적도록 물리 속성을 모두 논리 속성으로 씁니다.

#### `dir="rtl"` HTML 속성

```html
<html lang="ar" dir="rtl">
<!-- 또는 부분 영역 -->
<div dir="rtl">아랍어 콘텐츠 영역</div>
```

논리 속성을 쓰면 저절로 뒤집혀 CSS 를 더 적지 않아도 됩니다. JS 는 `document.dir` 또는 `getComputedStyle(el).direction` 으로 방향을 읽습니다.

#### 방향에 따라 따로 처리하는 것

| 처리 | 방법 |
|---|---|
| **옆에서 나오는 패널** | LTR `slide-in-left`(왼쪽에서) → RTL `slide-in-right`(오른쪽에서). 키프레임 `translateX` 부호가 반대다 — `:dir(rtl) .drawer { animation-name: slide-in-right; }` |
| **꺾쇠 · 화살표 아이콘** | `>`(앞으로) · `<`(뒤로) — RTL 에서는 `transform: scaleX(-1)` 또는 RTL 아이콘 |
| **진행 막대 채움** | `width: 50%` + `inset-inline-start: 0` — 저절로 뒤집힌다 |
| **숫자 · 통화** | RTL 에서도 LTR 로 보인다(`<bdi>` 또는 `unicode-bidi: embed`) — 1,234.56 같은 숫자는 늘 LTR |
| **이메일 · URL** | LTR 고정 — `direction: ltr` + `unicode-bidi: bidi-override` |

#### 컴포넌트별 RTL

| 컴포넌트 | RTL 처리 |
|---|---|
| Button (아이콘 + 글) | 아이콘 `margin-inline-end` — 저절로 뒤집힌다 |
| Input (앞 아이콘) | 아이콘 `inset-inline-start: 8px` — 저절로 뒤집힌다 |
| Select (꺾쇠) | 꺾쇠를 뒤집거나 `dir="ltr"` 영역으로 고정 |
| Tabs | `text-align: start`, 들임은 inline-start |
| Side Panel (LTR 오른쪽에서 나옴) | RTL 에서는 왼쪽에서 나온다(`slide-in-left` 키프레임 → `:dir(rtl) ... slide-in-right`) |
| Snackbar (아래 오른쪽) | RTL 에서는 아래 왼쪽 — `inset-inline-end: 16px` 그대로 두면 저절로 |
| Banner 띠 | `border-inline-start: 4px solid info` — 저절로 뒤집힌다 |
| Calendar | 요일 머리 · 날짜 칸 배치가 저절로 뒤집힌다 |

#### Tailwind v4 RTL 유틸리티

Tailwind v4 는 `me-*` · `ms-*`(margin-end · start), `pe-*` · `ps-*`, `text-start` · `text-end`, `start-0` · `end-0` 같은 논리 유틸리티와 변형 `rtl:`(예: `rtl:rotate-180`)을 기본으로 줍니다.

#### 담다 화면의 RTL

- 시트를 끄는 방향(위 · 아래)은 RTL 에서도 그대로입니다 — 세로 축은 방향과 상관없습니다.
- 하단 탭 바의 칸은 RTL 에서 오른쪽부터 놓입니다 — 논리 속성으로 적으면 저절로 됩니다.
- 줄을 밀어 동작을 여는 방향은 RTL 에서 반대입니다 — 손짓 처리를 `:dir(rtl)` 로 나눕니다.
- 금액(`₩1,234,500`)은 통화 기호와 숫자를 늘 LTR 로 둡니다 — `<bdi>` 또는 `unicode-bidi: embed`.
- 펼치는 꺾쇠(`>`)는 RTL 에서 뒤집습니다. 방향이 없는 카테고리 아이콘은 그대로 씁니다.

## Elevation & Depth

고도는 화면 요소가 쌓인 높이입니다. groo 는 표면 색의 차이(층)를 먼저 쓰고, 그림자는 꼭 떠 보여야 하는 몇 안 되는 요소에만 보조로 씁니다.

### 쌓임 맥락 — Global · Local

- **Global** — 화면 전체의 구조적 층입니다. 제품 화면 자체와 그 위를 덮는 컨테이너(시트 · 경고창)가 여기에 듭니다.
- **Local** — 한 층 안에서 콘텐츠끼리의 깊이입니다. 늘 자기가 속한 Global 층 위에 놓입니다.
- 새로 덮인 층(시트)은 곧 새 기준이 됩니다 — 그 안의 툴팁 · 메뉴는 그 층을 바닥으로 쌓입니다. 메뉴 · 팝오버 · Select 목록은 `z-floating`, 툴팁 · 말풍선은 `z-tooltip` 하나씩이라 어느 층에서 열어도 그 층 위에 뜹니다.

| Global 층 | 무엇 | groo |
|---|---|---|
| 0 | 바닥 — 스크롤되는 모든 콘텐츠 뒤 | `bg-layer-basement` |
| 1 | 기본 — 카드 · 목록 · 입력칸 · 상단 내비게이션 | `bg-layer-default` |
| 2 | 시트 · 메뉴 시트 · 서랍 — 화면을 덮는 새 쌓임 맥락 | `z-modal` |
| 3 | 경고창 — 가장 급한 정보, 다른 모달보다도 위 | `z-alert` |

| Local 층 | 무엇 | groo |
|---|---|---|
| 1 | 기본 콘텐츠 — 목록 · 탭 · 알림 띠 · 상단 내비게이션 | 층의 표면 |
| 2 | 떠 있는 동작 — 플로팅 버튼 | `z-sticky` |
| 3 | 잠깐 뜨는 알림 — 스낵바 | `z-snackbar` |

- Global 2 · 3 의 토큰은 딤 자리입니다 — 표면은 그 바로 위 `z-modal-content` · `z-alert-content` 입니다. z-index 값과 차례의 이유는 [z-index 층 표](specs/z-index.md)에 있습니다.
- 같은 층 안에서 겹칠 때(스크롤되는 목록이 상단 내비게이션 아래로 들어갈 때)는 층을 올리지 않습니다. 상단 내비게이션은 고정된 영역과 스크롤되는 영역 사이에 선 · 그림자를 긋지 않습니다. 데스크톱 머리 아래에도 선을 긋지 않습니다.
- 한 표면 안에서 머리와 본문이 따로 스크롤되는 대화상자 · 옆 패널(Side Panel) · 사이드바(Side Navigation)는 그 부품의 규칙대로, 본문이 위로 스크롤되면 머리 아래에 1px `stroke-neutral-subtle` 을 긋습니다.

### 고도를 드러내는 세 가지

- **표면 색** — 배경의 밝기 · 채도를 바꿉니다(스낵바 · 플로팅 버튼). 다크 모드는 높을수록 밝아집니다(`bg-layer-floating`).
- **그림자** — 떠 있는 높이를 그림자의 크기 · 퍼짐 · 투명도로 보입니다. 다크 모드에서 잘 보이지 않으므로 **화면에서 주목도가 높은 몇 안 되는 요소에만** 씁니다(떠 있는 탭 바 · 떠 있는 버튼 · 메뉴 · 팝오버 — `shadow-s3`).
- **선** — 가장자리에 테두리를 둬 영역을 나눕니다(사이드바의 오른쪽 선 · 떠 있는 탭 바의 안쪽 테두리 · 카드의 1px `stroke-neutral-weak`). 카드는 그림자 없이 선과 바닥(`bg-layer-basement`)으로 가릅니다.
- 그림자를 더하기 전에 표면 색의 차이로 가를 수 있는지 먼저 봅니다. 흰 면과 바닥은 라이트 1.08:1 · 다크 1.13:1 로 차이가 작아, 카드는 1px `stroke-neutral-weak` 테두리가 경계를 맡고 그림자를 두지 않습니다(`specs/components/card.md`).

### 바닥 위의 채움

라이트에서 바닥 `bg-layer-basement` · 약한 배경 `bg-neutral-weak` · 비활성 `bg-disabled` 는 모두 gray-200 입니다. 그래서 회색 바닥 위에 바로 놓인 채움은 바닥과 1.00:1 로 사라집니다(다크는 1.47:1 로 갈립니다).

- **`bg-neutral-weak` · `bg-disabled` 로 칠하는 것은 흰 표면(`bg-layer-default` · `bg-layer-floating`) 위에만 둡니다** — neutralWeak 버튼 · 안내 상자(Callout) · 스켈레톤 · 막힌 칸의 바탕이 그렇습니다. 화면 바탕은 Layout 의 "화면 바탕" 이 정합니다(폰은 띠 · 흰 화면, 데스크톱은 카드).
- 예외 — Page Banner 의 옅은 neutral 은 자리가 바닥 위(머리 바로 아래 화면 폭)여도 `bg-neutral-weak` 그대로입니다. 라이트에서는 띠 모양이 바닥과 거의 갈리지 않습니다.
- 회색 바닥 위에 바로 놓이는 버튼은 neutralOutline 입니다 — 데스크톱 화면 제목 줄의 버튼이 그렇습니다. 입력칸은 테두리가 모양을 맡아, 막혀 바탕이 바닥과 같아도 바닥 위에서 보입니다.
- 바닥 위에 자주 놓이는 두 부품 — Chip `solid` 바탕 · Segmented Control 트랙 — 은 투명 짝 `bg-neutral-weak-alpha`(누름 `bg-neutral-weak-alpha-pressed`)로 칠합니다. 놓인 바탕에 섞여 어느 바탕에서나 보입니다 — 회색 위 1.11:1 · 흰 위 1.11:1 · 다크 1.47:1. 흰 면 위에서는 불투명 `bg-neutral-weak`(1.08:1)보다 조금 짙습니다.

### 그림자

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `shadow-s1` | `0 1px 2px 0 rgba(15, 18, 28, 0.05)` | 가장 옅은 그림자. 카드 · 슬라이더 손잡이에는 쓰지 않습니다 |
| `shadow-s2` | `0 2px 8px -1px rgba(15, 18, 28, 0.08), 0 1px 3px -1px rgba(15, 18, 28, 0.04)` | 드롭다운 · 툴팁 · 떠 있는 버튼 |
| `shadow-s3` | `0 8px 24px -4px rgba(15, 18, 28, 0.10), 0 2px 6px -2px rgba(15, 18, 28, 0.05)` | 팝오버 · 작은 모달 |
| `shadow-s4` | `0 24px 48px -8px rgba(15, 18, 28, 0.16), 0 8px 16px -4px rgba(15, 18, 28, 0.08)` | 큰 모달 · 서랍 |
| `shadow-s1-dark` | `0 1px 2px 0 rgba(0, 0, 0, 0.30), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)` | 다크 — s1 |
| `shadow-s2-dark` | `0 2px 8px -1px rgba(0, 0, 0, 0.40), 0 1px 3px -1px rgba(0, 0, 0, 0.20), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` | 다크 — s2 |
| `shadow-s3-dark` | `0 8px 24px -4px rgba(0, 0, 0, 0.50), 0 2px 6px -2px rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)` | 다크 — s3 |
| `shadow-s4-dark` | `0 24px 48px -8px rgba(0, 0, 0, 0.60), 0 8px 16px -4px rgba(0, 0, 0, 0.30), inset 0 1px 0 0 rgba(255, 255, 255, 0.10)` | 다크 — s4 |

- 라이트 그림자의 색은 `rgba(15, 18, 28, …)` 입니다 — 바닥색과 어울리는 청회색 검정이라, 순수 검정보다 덜 번들거립니다.
- 다크 그림자는 순수 검정에 투명도를 크게 올리고, 위쪽에 1px 흰 안쪽 빛(`inset 0 1px 0 0`, 단계마다 5% ~ 10%)을 더합니다. 다크 표면이 이미 어두워 옅은 그림자는 보이지 않고, 아래 그림자만 있으면 떠 있기보다 들어가 보이기 때문입니다.
- 웹 내보내기(`export:tailwind`)는 `--shadow-s1` ~ `s4` 를 `var(--groo-shadow-s1)` ~ `s4` 로 적고, 값은 `@theme` 밖 `:root` 에 둡니다. 다크 블록이 그 값을 바꾸므로 `shadow-s3` 같은 클래스도 다크에서 다크 값이 됩니다.
- xs 단계 그림자는 두지 않습니다 — Tailwind 기본 xs 그림자는 내보내기에 없으므로 쓰지 않습니다.
- 모달 · 시트 뒤를 덮는 딤은 아래 `overlay-dim-light` · `overlay-dim-dark` 를 씁니다.

### 딤

시트 · 대화상자 · 서랍처럼 떠 있는 표면이 페이지 위에 있을 때 뒤를 어둡게 덮는 색입니다. 투명도가 있어 머리말 색이 아니라 표 토큰으로 둡니다.

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `overlay-dim-light` | `rgba(0, 0, 0, 0.50)` | 라이트 모드 — 모달 · 시트 뒤 |
| `overlay-dim-dark` | `rgba(0, 0, 0, 0.65)` | 다크 모드 — 모달 · 시트 뒤. 다크 표면 위에서도 떠 있는 표면이 갈리도록 더 짙습니다 |

## Motion

모션은 화면의 변화를 따라가게 돕습니다. 지속 시간 · 이징 · 눌림 · 모션 줄이기를 토큰으로 정하고, 컴포넌트는 이 이름만 부릅니다.

### 매크로 · 마이크로 모션

- **마이크로 모션** — 버튼 누름 · 입력칸 포커스 · 스크롤처럼 작은 움직임입니다. 200ms 이하입니다.
- **매크로 모션** — 페이지 전환 · 모달 · 시트 · 메뉴처럼 큰 움직임입니다. 200ms 를 넘습니다.
- 사용자 입력에 대한 반응 가운데 누름은 아래 "눌림 피드백" 에서 따로 정합니다.

### 지속 시간

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `motion-duration-d1` | `50ms` | 아주 작은 상태 변화 |
| `motion-duration-d2` | `100ms` | 작은 상태 변화 |
| `motion-duration-d3` | `150ms` | 마이크로 모션 기본 — 색 전환 · 눌림 |
| `motion-duration-d4` | `200ms` | 마이크로 모션 상한 — 메뉴 · 툴팁 |
| `motion-duration-d5` | `250ms` | 매크로 모션 — 시트 · 서랍 |
| `motion-duration-d6` | `300ms` | 매크로 모션 상한 — 모달 · 페이지 전환 |
| `motion-duration-color-transition` | `150ms` | 역할 — 색 전환(= d3) |
| `motion-duration-pressed-scale` | `150ms` | 역할 — 눌림 축소(= d3) |

- 색 전환과 눌림 축소는 같은 150ms 입니다 — 시작과 속도가 같아야 하나의 반응으로 읽힙니다.
- 큰 전환도 d6(300ms) 안에서 끝냅니다.
- 반복은 `motion-duration-loop`(1500ms)를 씁니다 — 스켈레톤 반짝임이 그렇습니다(아래 "반복 모션"). Progress Circle 은 1.2초입니다(`specs/components/progress-circle.yaml`).

### 이징

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `motion-ease-easing` | `cubic-bezier(0.35, 0, 0.35, 1)` | 버튼 · 포커스 같은 기능적 마이크로 모션 |
| `motion-ease-enter` | `cubic-bezier(0, 0, 0.15, 1)` | 다이얼로그 · 시트가 나타날 때 |
| `motion-ease-exit` | `cubic-bezier(0.35, 0, 1, 1)` | 다이얼로그 · 시트가 사라질 때 |
| `motion-ease-enter-expressive` | `cubic-bezier(0.03, 0.4, 0.1, 1)` | 특히 강조해야 하는 등장 |
| `motion-ease-exit-expressive` | `cubic-bezier(0.35, 0, 0.95, 0.55)` | 특히 강조해야 하는 퇴장 |
| `motion-ease-pressed-scale` | `cubic-bezier(0, 0, 0.15, 1)` | 눌림 축소 |

- 나타나는 모션은 `motion-ease-enter`, 사라지는 모션은 `motion-ease-exit` 입니다.
- 반복의 곡선은 컴포넌트가 정합니다 — 스켈레톤 반짝임은 `motion-ease-easing`, Progress Circle 은 스펙의 숫자 곡선입니다. `motion-ease-linear` 는 일정한 속도가 필요한 반복에 씁니다.

### 눌림 피드백

누르면 인터페이스가 입력이 닿았음을 바로 알립니다. 색 · 크기 · 햅틱 셋으로 알리고, 셋은 하나의 반응으로 읽히게 같은 시간(150ms)을 씁니다. 햅틱은 기준이 생기면 더합니다.

**색 — 기본.** 누를 수 있는 모든 요소는 누르는 동안 표면 색이 `-pressed` 역할로 바뀝니다. 동작 줄이기 설정에도 영향받지 않아 기본 요소입니다.

- 표면만 바뀝니다 — 그 위 글자 · 아이콘 색은 그대로입니다. 글자용 pressed 역할은 두지 않습니다.
- 평소 배경이 없는 요소(ghost 버튼)는 누르는 동안 `bg-layer-default-pressed` 표면이 생깁니다. 떠 있는 표면(FAB · 메뉴) 위라면 `bg-layer-floating-pressed` 입니다. 투명도 있는 누름 색은 두지 않습니다.
- 색이 이미 상태를 뜻하는 요소(Switch 의 켜짐 · 탭의 선택)는 색을 바꾸지 않고 축소만 합니다 — 손을 떼기 전에 상태가 바뀐 것처럼 보이지 않게 하기 위해서입니다.

**크기 — 거리로 줄인다.** 누르는 동안 요소가 세로 2px 만큼 줄어듭니다. 배율을 고정하면 요소가 클수록 가로로 많이 움직이므로, 거리를 고정하고 배율은 요소 크기에서 계산합니다.

| 값 | 크기 | 뜻 |
|---|---|---|
| 축소량 | 2px | 세로로 줄어드는 거리 |
| 폭 보정 | 폭 ÷ 4 | 가로로 긴 요소(목록 줄)가 지나치게 움직이지 않게 |
| 최소 기준 길이 | 24px | 아주 작은 요소의 축소 비율 상한(8.3%) |

```
기준 길이 = max(요소 높이, 요소 폭 ÷ 4, 24)
배율     = (기준 길이 − 2) ÷ 기준 길이
```

- 가운데를 기준으로 줄고, 차지하는 자리는 그대로입니다 — 옆 요소가 움직이지 않습니다.
- 영역이 하나의 면으로 잡히는 요소에만 씁니다. 글 속 링크처럼 줄바꿈되는 요소에는 쓰지 않습니다.
- 안의 동작이 요소 전체에 딸린 것(행 안의 Switch)이면 행 전체가 줄어듭니다. 대등한 동작이 나란하면(카드 안의 닫기 · 좋아요) 누른 버튼만 줄어듭니다.
- 요소 전체를 줄여 정렬 · 여백 · 모서리가 어긋나면(목록 줄 · 아코디언) 콘텐츠만 줄입니다.
- 이미 줄어드는 요소 안의 요소는 따로 줄지 않습니다.
- 선택된 요소도 줄어듭니다. 불러오는 중 · 비활성은 줄지 않습니다.
- 150ms · `motion-ease-pressed-scale` 입니다.

### 모션 줄이기 모드

색의 라이트 · 다크처럼 "보통 · 줄이기" 두 모드를 둡니다. 사용자가 기기에서 동작 줄이기를 켜면 줄이기 모드입니다 — 웹은 `prefers-reduced-motion: reduce`, 앱은 `MediaQuery.disableAnimations` 입니다. 모든 모션이 이 모드를 따릅니다.

| 무엇 | 보통 | 줄이기 |
|---|---|---|
| 눌림 축소 | 세로 2px | 없음(배율 1) — 색 전환만 남습니다 |
| 색 전환 | 150ms | 그대로 |
| 매크로 모션(200ms 초과) | 이동 · 확대 · 미끄러짐 | 150ms 서서히 나타남 · 사라짐 |
| 반복(스켈레톤 · 로딩 원 · 펄스) | 계속 | 멈춥니다 — 스켈레톤은 띠 없이 면만, Progress Circle 은 돌지 않는 3/4 호 |

- 모든 애니메이션을 0.01ms 로 끄는 전역 규칙은 쓰지 않습니다 — 서서히 나타남 · 색 전환까지 사라져 무엇이 바뀌었는지 보이지 않기 때문입니다.

### 반복 모션

스켈레톤 반짝임 · 회전 · 펄스처럼 되풀이되는 애니메이션의 토큰입니다.

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `motion-duration-loop` | `1500ms` | 스켈레톤 반짝임 한 주기(곡선은 `motion-ease-easing`) · 펄스 한 주기 |
| `motion-ease-linear` | `linear` | 일정한 속도가 필요한 반복. 스켈레톤 · Progress Circle 에는 쓰지 않습니다 |

- 반복 애니메이션은 멈출 수 있어야 합니다(WCAG 2.2.2) — 스켈레톤은 데이터가 오면 저절로 멈추고, 5초 넘게 도는 진행 표시는 취소 · 다시 시도를 함께 둡니다.

### 키프레임

컴포넌트가 함께 쓰는 키프레임 14종입니다 — 단발 10 · 반복 4. 컴포넌트 스펙은 `animation: <키프레임> <지속 시간 토큰> <이징>` 꼴로 이름을 그대로 적습니다(이름이 틀리면 아무 일도 일어나지 않습니다). 모션 줄이기는 위 "모션 줄이기 모드" 를 따릅니다.

#### 단발 키프레임

| 키프레임 | 지속 시간 | 이징 | 쓰는 곳 |
|---|---|---|---|
| `fade-in` | `motion-duration-d4` (200ms) | `motion-ease-enter` | 드롭다운 · 팝오버 · 알림이 나타날 때 |
| `fade-out` | `motion-duration-d3` (150ms) | `motion-ease-exit` | 드롭다운 · 팝오버 · 알림이 사라질 때(나타날 때보다 빠르게) |
| `slide-in-up` | `motion-duration-d6` (300ms) | `motion-ease-enter` | 아래 서랍 · 바텀 시트 · 아래 알림 |
| `slide-in-down` | `motion-duration-d4` (200ms) | `motion-ease-enter` | 드롭다운 · 배너가 나타날 때 |
| `slide-in-left` | `motion-duration-d6` (300ms) | `motion-ease-enter` | 오른쪽 서랍이 나타날 때 — Side Panel 은 스펙의 motion |
| `slide-in-right` | `motion-duration-d6` (300ms) | `motion-ease-enter` | 왼쪽 서랍 — Side Panel 은 스펙의 motion |
| `scale-in` | `motion-duration-d4` (200ms) | `motion-ease-enter` | 모달 · 대화상자 · 팝오버(`scale(0.96 → 1)` + `opacity 0 → 1`) |
| `scale-out` | `motion-duration-d3` (150ms) | `motion-ease-exit` | 모달 · 대화상자 · 팝오버가 닫힐 때 |
| `bounce-in` | `motion-duration-d6` (300ms) | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 빈 화면 축하 · 완료 표시(살짝 넘쳤다 돌아옴) |
| `shake` | `motion-duration-d6` (300ms) | `cubic-bezier(.36,.07,.19,.97)` | 폼 검증 오류 · 잘못된 입력 강조 |

#### 반복 키프레임

`motion-duration-loop`(1500ms)를 쓰고, 이징은 키프레임마다 고릅니다.

| 키프레임 | 지속 시간 | 이징 | 쓰는 곳 |
|---|---|---|---|
| `spin` | `motion-duration-loop` (1500ms) | `linear` | 새로 고침 아이콘처럼 일정하게 도는 것 — Progress Circle 에는 쓰지 않습니다(1.2초 · `progress-circle.yaml`) |
| `pulse` | `motion-duration-loop` (1500ms) | `cubic-bezier(0.4, 0, 0.6, 1)` | 점 표시 · 포커스 강조 |
| `shimmer` | `motion-duration-loop` (1500ms) | `motion-ease-easing` | 스켈레톤 반짝임 띠(왼쪽 밖 → 오른쪽 밖) |
| `ping` | `motion-duration-loop` (1500ms) | `cubic-bezier(0, 0, 0.2, 1)` | 알림 점 · 눈길 끌기(`scale 1 → 2`, `opacity 1 → 0`) |

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

#### 키프레임 쓰는 법

| 자리 | `animation` · `transition` 예 |
|---|---|
| 알림 띠 등장 | `animation: slide-in-up var(--motion-duration-d6) var(--motion-ease-enter) both` |
| 모달 등장 | `animation: scale-in var(--motion-duration-d4) var(--motion-ease-enter) both` |
| 모달 닫힘 | `animation: scale-out var(--motion-duration-d3) var(--motion-ease-exit) both` |
| 스켈레톤 반짝임 | `animation: shimmer var(--motion-duration-loop) var(--motion-ease-easing) infinite` |
| Progress Circle | 회전 · 호 · 채움 — `progress-circle.yaml` 의 motion(1.2초 숫자 곡선) |
| 알림 점 | `animation: ping var(--motion-duration-loop) cubic-bezier(0, 0, 0.2, 1) infinite` |
| 폼 오류 | `animation: shake var(--motion-duration-d6) cubic-bezier(.36,.07,.19,.97)` |
| 펼치고 접기(아코디언 · Collapsible · 하위 줄 · 나무 · 사이드바 하위) | `transition: height var(--motion-duration-d6) var(--motion-ease-easing)` + 꺾쇠 회전 같은 시간 — 모션 줄이기면 높이 대신 `opacity` 150ms |
| 숨는 머리 스냅(Scroll Auto Hide) | `transition: transform var(--motion-duration-d4) var(--motion-ease-enter)` — 스크롤이 끝났을 때만, 스크롤 중은 거리 1:1 |

### 담다에서 쓰는 모션

담다는 휴대폰에서 자주 쓰는 개인 서비스라, 작은 완료 · 새 소식을 모션으로 조금 더 드러냅니다. 키프레임 · 지속 시간은 위 표 그대로입니다.

| 자리 | 키프레임 · 지속 시간 |
|---|---|
| 새 메모가 목록에 들어올 때 | `scale-in` · `motion-duration-d4` |
| 가계부 목록을 불러오는 동안 | `shimmer` · `motion-duration-loop` |
| 당겨서 새로 고침 | `spin` · `motion-duration-loop` |
| 새 알림 · 새 할 일 점 | `ping` · `motion-duration-loop` |
| 할 일 완료 체크 · 가계부 저장 완료 | `bounce-in` · `motion-duration-d6` |
| 폼 오류(가계부 금액을 넣지 않음 등) | `shake` · `motion-duration-d6` |

- 아래에서 올라오는 시트(할 일 추가 · 가계부 입력)는 Bottom Sheet 스펙의 motion, 알림 띠는 Snackbar 스펙의 motion 을 따릅니다.
- `bounce-in` · `ping` 을 일상 화면의 작은 기쁨 · 새 소식에 씁니다.
- 위에서 내려오는 띠(`slide-in-down`)는 쓰지 않습니다 — 폰 화면에서는 아래에서 올라오는 쪽이 손과 눈에 가깝기 때문입니다.

## State

상태는 요소가 지금 어떤 처지인지를 보입니다. 이름과 표현을 한 벌로 정해, 컴포넌트마다 같은 상태가 같은 모습이 되게 합니다.

### 상태의 두 유형

- **상호작용 상태** — 사용자의 동작에 따라 바뀝니다. `enabled` · `hovered` · `focused` · `pressed` 입니다.
- **옵션 상태** — 컴포넌트에 걸린 옵션입니다. `selected` · `disabled`, 그리고 컴포넌트 상태 `invalid` · `loading` · `readonly` 입니다.
- 둘은 겹칠 수 있습니다 — 선택된 요소도 누를 수 있습니다. 겹치면 `selected + pressed` 처럼 함께 적습니다.

### 상태 이름

| 이름 | 뜻 | 어디서 |
|---|---|---|
| `enabled` | 기본 — 아무 상호작용이 없을 때 | 모두 |
| `hovered` | 포인터가 위에 있음 | 웹 — 마우스가 있는 기기에서만(`@media (hover: hover)`) |
| `focused` | 키보드 포커스(`:focus-visible`), 입력칸은 입력 중 | 모두 |
| `pressed` | 누르고 있는 동안 | 모두 |
| `selected` | 선택됨 · 켜짐 · 지금 항목 | 모두 |
| `disabled` | 비활성 — 상호작용을 받지 않음 | 모두 |
| `invalid` | 값이 규칙에 맞지 않음 | 입력 요소 |
| `loading` | 진행 중 — 입력을 받지 않음 | 누를 수 있는 요소 |
| `readonly` | 값은 보이지만 바꿀 수 없음 | 입력 요소 |

- 컴포넌트에만 있는 상태(`open` · `dragging` 들)는 그 컴포넌트 스펙의 이름을 씁니다.

### 상태별 표현

| 상태 | 표면 | 글자 · 아이콘 | 테두리 · 링 | 더하는 것 |
|---|---|---|---|---|
| `hovered` | `-pressed` 역할 색(누름과 같음) | 그대로 | 그대로 | — |
| `focused` — 키보드 | 그대로 | 그대로 | 링 2px · 띄움 2px · `stroke-focus-ring` | `outline` 으로 그려 자리가 밀리지 않습니다. 링은 상자 모서리를 따릅니다 — 링 바깥 반지름 = 상자 반지름 + 띄움 + 두께(띄움 2 면 + 4, 모서리 12 상자는 16). 모서리 0 이면 0, 원은 원입니다. CSS `outline` 이 그리는 그대로라 앱은 이 셈으로 그립니다 |
| `focused` — 입력 중 | 그대로 | 그대로 | 안쪽 2px `stroke-neutral-contrast` | 반투명 링은 쓰지 않습니다. 안쪽에 덧그려 내용이 밀리지 않습니다 |
| `pressed` | `-pressed` 역할 색 | 그대로 | 그대로 | 축소(Feedback) |
| `selected` | `bg-neutral-inverted` | `fg-neutral-inverted` | — | 칩 · 세그먼트 · 날짜처럼 고르는 요소 |
| `disabled` | `bg-disabled`(배경이 있는 요소만) | `fg-disabled` | `stroke-neutral-weak` | 불투명도를 쓰지 않습니다. 커서 not-allowed |
| `invalid` | 그대로 | 오류 문구 `fg-critical` | 테두리 2px `stroke-critical-solid` | 문구는 입력칸 가까이(Writing › 오류) |
| `loading` | `-pressed` 역할 색 | 글자 대신 진행 표시 | 그대로 | 누름 · 축소 없음 |
| `readonly` | `bg-disabled` | 값은 `fg-neutral` 로 읽히게 | 그대로 | — |

- 호버와 누름이 같은 색이라, 마우스로 누를 때는 색이 더 바뀌지 않고 축소만 더해집니다. 호버는 마우스가 있는 기기에서만 켭니다 — 터치 화면에 호버가 붙어 남지 않게 하기 위해서입니다.
- 비활성 요소는 `fg-disabled` 색 · `cursor: not-allowed` 와 함께 호버 · 누름 모양을 뺍니다. 포인터 이벤트는 끄지 않습니다 — 끄면 커서가 보이지 않습니다. 색만으로 비활성을 알리지 않고, 색 · 커서 · 반응 없음이 함께 비활성을 말합니다.
- 선택을 테두리로 보이는 요소 — Select Box 는 고른 상자만 2px `stroke-neutral-contrast` 이고 바탕은 바꾸지 않습니다. Icon Picker 의 고른 칸도 같은 안쪽 2px 이고, Color Swatch 의 고른 원은 2 를 띄운 2px 고리(같은 색) + 체크입니다 — 칸의 색이 곧 값이라 바탕을 바꿀 수 없기 때문입니다. 목록 · 메뉴의 지금 항목은 각 컴포넌트 스펙이 정합니다.
- 켜고 끄는 아이콘 단추(Toggle)는 켬에 바탕을 칠하지 않습니다 — 위 표의 `selected` 바탕(반전)은 칩 · 세그먼트 · 날짜처럼 여럿 가운데 고르는 요소의 것입니다. 켬은 아이콘이 진한 색 + 선 2.5 로 말합니다(Iconography).
- 누르는 순간 저장되는 컨트롤(Switch · Toggle · 할 일 완료 체크, 손을 뗄 때 저장되는 Slider)은 요청 중에도 `loading` · `disabled` 로 바꾸지 않습니다 — 화면은 바로 바뀌고, 실패하면 되돌리고 그 자리에서 알립니다. 한 요청이 화면의 다른 컨트롤을 막지도 않습니다 — 막으면 키보드 초점이 본문으로 빠집니다.
- 스위치처럼 색으로 켜짐을 뜻하는 요소의 비활성은 그 컴포넌트 스펙이 정합니다.
- **`fg-disabled` 는 막힘 · 위치 단서 · 장식에만 씁니다.** 막힌 요소의 글자 · 아이콘(위 표) 말고는 이 셋입니다 — 위치 단서(Wheel Picker 의 가운데가 아닌 칸 — 고른 값은 가운데 `fg-neutral` 이고 이웃 칸은 굴리는 동안 자리를 알립니다, Date Picker 의 앞뒤 달 날짜 — 누르지 못하고 보조 기술에 숨깁니다), 장식(Tag Group 의 구분 " · " — 보조 기술에 숨깁니다), 막힌 칸의 글(Attachment Input 이 가득 찼을 때의 개수 — 트리거가 막혀 "10/10, 사용할 수 없음" 으로 읽힙니다). 읽어야 하는 글(값 · 설명 · 안내)에는 쓰지 않습니다 — 흰 면 3.16 : 1 이라 보통 글 4.5 : 1 에 못 미칩니다(WCAG 1.4.3 은 막힌 · 쓰지 않는 요소를 기준에서 뺍니다). 기본 휠(26px)은 큰 글이라 3 : 1 을 넘고, 좁은 팝오버의 작은 휠(20px)만 이웃 칸이 3.16 : 1 로 남습니다. 캘린더 화면의 월 격자도 같습니다 — 이웃 달 날짜는 숫자만 `fg-disabled` 이고(그 칸의 일정 · 금액은 이번 달과 같게 읽힙니다), 꺼진 캘린더 줄은 체크로만 알리고 흐리게 하지 않습니다.
- 예외 — Attachment Input 의 사진 항목은 읽기 전용 · 끄는 중에 불투명도 0.5 입니다(파일 카드는 글 · 아이콘 `fg-disabled`). 이 두 상태의 사진 항목에만 쓰고, 막힘(`disabled`)은 그대로 불투명도를 쓰지 않습니다.
- **앱의 키보드 포커스** — 앱도 하드웨어 키보드로 옮길 때만 웹과 같은 링(2px · 띄움 2px · `stroke-focus-ring`)을 그립니다 — Flutter 의 `FocusHighlightMode.traditional` 일 때만이고, 손가락으로 누를 때는 그리지 않습니다. 누를 수 있는 것은 모두 포커스를 받아 Tab 순서에 듭니다 — 버튼(`PButton`)도 그렇습니다.

### 겹칠 때

- 옵션 상태는 상호작용 상태와 겹칩니다 — `selected` 에 호버 · 누름 · 포커스가 더해집니다. 선택된 요소를 누르면 선택 색은 그대로 두고 줄이기만 합니다(Feedback › Color).
- `disabled` 는 다른 상호작용 상태와 함께 나타나지 않습니다 — 호버 · 누름 색 · 축소가 없습니다. 키보드로 머무를 수 있는 비활성(`aria-disabled`)만 포커스 링을 받습니다.
- `loading` 은 입력을 받지 않습니다 — 누름 · 축소가 없습니다.
- `invalid` 와 입력 중(`focused`)이 겹치면 테두리는 오류 색이 이깁니다.

## Iconography

아이콘은 선 아이콘 한 세트를 정해진 크기 · 굵기로 씁니다. 채움 대신 굵기와 색으로 상태를 보이고, 아이콘만 있는 버튼에는 늘 이름을 답니다.

### 세트

- lucide 하나를 씁니다 — 웹은 `lucide-react`, 앱은 `lucide_icons_flutter` 입니다.
- 없는 아이콘은 lucide 의 모양 규칙대로 그려 더합니다 — 24px 격자, 선 2, 둥근 끝 · 둥근 이음.

### 크기

| 크기 | 뜻 |
|---|---|
| `16px` | 작은 UI 아이콘 — 가장 작은 단계 |
| `20px` | 가운데 단계 |
| `24px` | 기본 격자 — lucide 가 그리는 크기 |

- UI 아이콘은 16 · 20 · 24 셋만 씁니다. 다른 크기를 옮길 때는 한 단계 위로 — 15px 이하는 16, 17 ~ 19px 는 20, 21 ~ 23px 는 24 입니다.
- 12px 은 넘지 말아야 할 바닥입니다 — UI 아이콘으로는 쓰지 않습니다.
- 빈 화면 · 큰 그림처럼 24px 보다 큰 아이콘은 24px 격자를 비율대로 키워 자리마다 정합니다.
- 자리마다 쓰는 단계는 각 컴포넌트 스펙이 정합니다.

### 선 굵기와 상태

- 선은 lucide 기본 2 입니다(24px 격자 기준 — 16px 에서는 그만큼 가늘게 그려집니다).
- 켜짐 · 선택은 진한 색(또는 브랜드 색) + 선 2.5, 꺼짐은 lucide 의 `-off` 아이콘(사선)을 씁니다. lucide 에는 채움 모양이 없고 앱의 lucide 글꼴은 채울 수도 없어, 켜짐을 채움 대신 굵기로 보입니다.
- 모으기 단추(관심 · 고정)는 꺼짐에 사선을 긋지 않습니다 — 같은 아이콘이 꺼짐은 흐린 색(`fg-neutral-muted`) + 선 2, 켜짐은 진한 색(`fg-neutral`) + 선 2.5 로만 갈립니다(채우지 않습니다). 사선(`-off`)은 기능이 꺼지는 단추(눈 · 종)에 쓰고, 아이콘은 지금 상태를 그립니다 — 금액을 가렸으면 `eye-off` 입니다(`specs/components/toggle.md`).
- 앱은 lucide 글꼴의 굵기 변형으로 같은 굵기를 맞춥니다.

### 아이콘만 있는 버튼

- 보이는 크기는 40px — 24px 아이콘이면 44px 입니다.
- 누르는 영역은 늘 44px 이상입니다(Layout › 터치 영역) — 40px 버튼은 보이지 않는 여백을 2px 씩 더합니다.
- 이름을 반드시 답니다 — 웹 `aria-label`, 앱 `tooltip` 또는 `Semantics` label 입니다. 이름도 번역 문구에 둡니다.

### 글자와 함께

- 한 줄에 둘 때는 높이 가운데로 맞추고, 사이는 간격 토큰으로 둡니다.
- 아이콘만으로 뜻이 모호하면 글자를 함께 씁니다.
- 상단 내비게이션은 선 아이콘 24 로 둡니다(상자 44 — Top Navigation). 하단 탭은 고른 탭을 짙은 글자색(`fg-neutral`) + 선 2.5 로, 다른 탭은 `fg-neutral-subtle` + 선 2 로 둡니다 — 브랜드 색으로 칠하지 않습니다(Bottom Navigation).

## Inclusive Design

시각 · 청각 · 운동 · 인지 능력과 상황이 다른 모든 사용자가 groo 를 쓸 수 있게 합니다. 대비는 WCAG 2 로 잽니다.

### 보기

- **대비** — 글자와 배경은 WCAG 2 AA(본문 4.5:1 · UI 3:1)를 검사기로 잽니다. 비활성 · 플레이스홀더는 WCAG 가 따지지 않지만 전용 색(`fg-disabled` · `fg-placeholder`)으로 읽히게 둡니다.
- **색만으로 알리지 않습니다** — 상태 · 오류 · 차트는 글자 · 아이콘 · 모양을 함께 씁니다. 색을 고르는 칸도 칸마다 색 이름("빨강")을 이름으로 달고, 고른 칸은 고리 · 체크로 보입니다(Color Swatch).
- **위계와 순서** — 중요한 정보가 먼저 보이게 짜고, 화면 순서를 논리적으로 둡니다. 스크린 리더가 그 순서로 읽습니다.

### 조작

- **터치 영역** — 누르는 영역은 모두 44 × 44 이상입니다(`touch-min`). 보이는 크기가 작으면 보이지 않는 여백으로 넓힙니다.
- **제스처 대신 누르기** — 밀기 · 끌기 · 핀치 같은 제스처로 하는 일은 누르기로도 할 수 있게 합니다. Slider 는 트랙을 눌러 고르고 키보드로도 옮깁니다. 나누기 손잡이는 한 번 눌러 25 ↔ 40 · 키보드 5% 로도 바꿉니다(Resizable).
- **보조 기술** — 모든 동작에 VoiceOver · TalkBack · 키보드로 닿습니다. 키보드 포커스는 State › `focused` 입니다.
- **요청 중에도 막지 않습니다** — 누르는 순간 저장되는 컨트롤을 응답을 기다리며 막지 않습니다. 막으면 초점이 본문으로 빠져 키보드 · 화면 읽기 프로그램 사용자가 자리를 잃습니다. 실패하면 되돌리고 그 자리에서 알립니다(State).
- **앱의 키보드** — 앱도 누를 수 있는 것은 모두 키보드 포커스를 받습니다(버튼 `PButton` 포함). 링은 키보드로 옮길 때만 웹과 같게 그리고, 손가락으로 누를 때는 그리지 않습니다(State › 앱의 키보드 포커스).
- **길 찾기** — 지금 어디 있는지를 이름과 선택 표시로 알 수 있게 하고, 주요 기능은 찾기 쉬운 자리에 둡니다.

### 콘텐츠

- **이름** — 아이콘만 있는 버튼 · 이미지에는 기능과 맥락을 짧게 적은 이름을 답니다(웹 `aria-label` · `alt`, 앱 `Semantics` label · `tooltip`). 장식은 보조 기술에서 숨깁니다(`alt=""` · `aria-hidden` · `ExcludeSemantics`). 이름도 번역 문구에 둡니다. 켜고 끄는 단추는 이름을 고정하고 켬은 `aria-pressed`(앱 `toggled`)로 알립니다 — 상태마다 이름을 바꾸지 않습니다(Toggle). 펼치고 접는 트리거도 이름을 고정하고 펼침은 `aria-expanded`(앱 `expanded`)로 알립니다 — "펼치기 · 접기" 로 바꾸지 않습니다(Accordion · Collapsible).
- **오류** — 바로 알립니다. 테두리 색(State › `invalid`)과 함께, 웹은 `aria-invalid` + `aria-describedby` 로 입력칸과 문구를 잇고 `role="alert"`(또는 `aria-live`)로 알립니다. 앱은 `Semantics` liveRegion 입니다. 문구는 입력칸 가까이, 고칠 방법까지 씁니다(Writing › 오류).

### 개인 설정

- **글자 크기** — 웹 글자는 rem 이라 브라우저 글자 크기를 따르고, 앱은 OS 글자 크기를 따릅니다. 커져도 레이아웃이 깨지지 않게 합니다. 화면 확대를 막지 않습니다 — `user-scalable=no` · `maximum-scale` 을 쓰지 않습니다(WCAG 1.4.4).
- **애니메이션** — 모든 모션이 모션 줄이기 모드(Motion)를 따릅니다. 2초 넘는 애니메이션은 피하고, 쓰면 멈추거나 건너뛸 수 있게 합니다. 초당 3번 넘게 번쩍이지 않습니다.
- **자동 재생** — 소리 · 영상은 멈춰 둔 채로 시작합니다. 필요하면 소리 없이 시작하고, 3초 넘는 소리는 멈춤 · 음량 조절을 줍니다.
- **언어** — 화면 언어를 고를 수 있고, 바꾸면 `<html lang>` 도 바뀝니다(International Design).

## International Design

언어 · 지역마다 날짜 · 시각 · 숫자 · 기호를 그 관습대로 씁니다.

- 언어는 한국어(기본) · 영어입니다 — Desk 웹 · Desk 앱 · HR 웹. 그루 계정(SSO)은 한국어만 씁니다.
- 표기는 코드에 직접 적지 않고 로케일 문구 · 로케일 포맷터로 냅니다. 날짜 · 시각은 한국어 로케일을 넘겨야 "오후" 가 나옵니다.

### 날짜

| 형식 | 한국어 | 패턴 | 영어 | 패턴 |
|---|---|---|---|---|
| 표준 | 2026년 9월 30일 | `yyyy년 M월 d일` | Sep 30, 2026 | `MMM d, yyyy` |
| 줄임 | 9월 30일 | `M월 d일` | Sep 30 | `MMM d` |
| 점 | 2026. 9. 30. | `yyyy. M. d.` | — | — |
| 점 · 두 자리 연도 | 26. 9. 30. | `yy. M. d.` | Sep 30, '26 | `MMM d, ''yy` |
| 요일 | 9월 30일 (수) | `M월 d일 (E)` | Wed, Sep 30 | `E, MMM d` |
| 요일 풀어 씀 | 9월 30일 수요일 | `M월 d일 EEEE` | Wednesday, Sep 30 | `EEEE, MMM d` |
| 요일 · 시각 | 9월 30일 (수) 오후 9:41 | `M월 d일 (E) a h:mm` | Wed, Sep 30 at 9:41 PM | `E, MMM d 'at' h:mm a` |

- 올해 날짜는 줄임, 다른 해면 표준, 표 · 목록 끝처럼 좁은 칸은 점으로 씁니다.
- 점 표기는 [연] · [월] · [일] 을 줄인 것이라 마지막 [일] 뒤에도 점을 찍고, 0 을 채우지 않습니다(`2026. 9. 30.`).
- 점 · 두 자리 연도는 한 자리에만 씁니다 — 한 줄 버튼에 해가 다른 직접 기간이 들어갈 때입니다(통계 기간 버튼 `25. 11. 10.~26. 11. 10.` · 영어 `Nov 10, '25–Nov 10, '26` — en dash 앞뒤를 붙입니다). 버튼 라벨은 한 줄을 지키는데(`specs/components/button.md` 의 "긴 라벨"), 네 자리 점 표기는 큰 글자에서 버튼이 화면 밖으로 나가기 때문입니다. 같은 해 기간은 그대로 줄임 · 점 표기입니다. 영어는 줄임 표기에 두 자리 연도(`MMM d, ''yy`)를 붙입니다.
- 입력칸 값 · 내보내기 파일 · API 의 `yyyy-MM-dd` 는 화면 표시가 아니므로 그대로 둡니다. 다만 파일에서 읽은 값을 화면에 미리 보일 때(가져오기 미리보기 칩)는 표시이므로 날짜 규칙을 따릅니다 — 파일 원본 값은 파일 안에서만 씁니다.
- 공유 · 내보내기 문장처럼 화면 밖으로 나가는 글은 올해 날짜도 연도를 넣은 표준형으로 씁니다 — 받는 사람은 언제 읽을지 모르기 때문입니다.
- 자리마다 — 기간 줄은 줄임 "11월 2일~11월 8일", 날짜 묶음 머리는 요일 형식("11월 5일 (목)"), 할 일 완료 시각은 요일 · 시각 형식("11월 5일 (목) 오후 3:20"), 차트 눈금은 `specs/components/chart.md` 의 "날짜 · 시각 눈금" 입니다.

### 시각

| 형식 | 한국어 | 패턴 | 영어 | 패턴 |
|---|---|---|---|---|
| 시각 | 오후 9:41 | `a h:mm` | 9:41 PM | `h:mm a` |

- 모든 화면에 오전 · 오후 12시간을 씁니다. 초는 쓰지 않습니다.

### 지난 시간

| 지난 시간 | 한국어 | 영어 |
|---|---|---|
| 1분 미만 | 방금 전 | Just now |
| 1 ~ 59분 | n분 전 | n min ago |
| 1 ~ 23시간 | n시간 전 | n hr ago |
| 24 ~ 47시간 | 어제 | Yesterday |
| 2 ~ 6일 | n일 전 | n days ago |
| 7일 이상 | 날짜(위 규칙) | 날짜 |

- 주 · 달 · 년 단위("n주 전")는 쓰지 않습니다 — 7일부터는 날짜로 씁니다.
- 흐른 시간으로 셉니다 — 달력 날짜가 아닙니다. 밤 11시에 온 알림은 다음 날 새벽 1시에도 "2시간 전" 입니다.

### 숫자 · 돈

| 형식 | 한국어 | 영어 |
|---|---|---|
| 돈 | 1,234,567원 | ₩1,234,567 |
| 빼기 | −1,234원 | — |
| 차트 축 · 개수 줄임 | 1.2만 · 12.3만 · 123만 · 1.2억 | 12K · 123K · 1.2M |
| 전화번호 | 010-1234-5678 | — |

- 돈은 줄이지 않고 원 단위까지 씁니다. 줄임은 차트 축과 개수에만 씁니다. 차트의 좁은 자리(열지도 칸 · 도넛 가운데)에 원까지 들어가지 않으면 줄여 쓰지 않고 글을 뺍니다 — 열지도는 세기 색만 남기고, 도넛은 목록 위 합계로 옮깁니다(`specs/components/chart.md`).
- 한국어 줄임은 만 · 억 · 조에 소수 한 자리까지 쓰고, `.0` 은 버립니다(`1억`). 영어는 compact 표기(`Intl.NumberFormat` · `NumberFormat.compact`)입니다.
- 빼기는 붙임표(-) 대신 빼기 기호 `−`(U+2212)를 씁니다.
- 금액이 칸보다 길면 띄어쓰기에서 먼저 넘기고, 쉼표 뒤는 금액 낱말 하나가 칸보다 길 때만 꺾습니다 — 줄여 쓰거나 글자를 줄여 맞추지 않습니다(Typography "줄바꿈" 의 예외 — "이체" / "100,000원").
- 증감은 ▲ · ▼ + 값으로 쓰고 부호(+ · −)를 겹치지 않습니다 — Colors 의 "증감 — 방향 색".
- 좁은 칸에 원까지 쓴 금액이 들어가지 않으면 줄이지 않고 금액 대신 점("•")을 둡니다 — 위 "쉼표 뒤에서 꺾는다" 의 예외로, 가계부 주 띠 · 월 격자 칸처럼 줄을 바꿀 높이가 없는 자리입니다(차트의 "글을 뺀다" 와 같은 갈래). 들어가는지는 자리수가 아니라 실제 폭으로 재고, 읽는 이름에는 원까지 싣습니다.

### 퍼센트

뜻으로 소수 자리를 정하고, 웹 · 앱이 같은 함수 하나로 냅니다.

| 뜻 | 자리 | 예 |
|---|---|---|
| 비중 — 전체 중 몫(구성 · 카테고리 · 종목 · 통화별) | 소수 첫째 자리, 늘 한 자리 | 30.0% · 0 보다 크고 0.05% 미만은 "0.1% 미만"(영어 "<0.1%") |
| 진행률 — 이행 · 사용 · 달성 · 저축 · 할인 | 정수 | 76.6 → 77% |
| 등락률 · 수익률 · 지난 기간 대비 증감 | 소수 둘째 자리 — 지출 · 수입 · 순자산 증감도 같음 | 1.80% · ▲ 12.00% |

- 반올림은 반올림(half-up)입니다. 진행률만 예외 하나 — 반올림하면 100 이 되는 값은 100 으로 올리지 않습니다: 100 미만(99.5 ~ 99.99)은 99%, 100 초과(100.01 ~ 100.49)는 101%, 정확히 100 만 100% 입니다. 넘음 · 못 미침이 글에서 사라지지 않게 하기 위해서입니다(색과 글이 맞게).
- 숫자가 아니거나 무한이면 "—", 음수는 부호를 그대로(빼기 기호 U+2212) 둡니다.
- 사용자가 입력한 비율(나누기 비율)은 비중이 아닙니다 — 넣은 그대로(정수) 보입니다.
- 그루 이음의 승인율(전체 신청 중 승인한 몫)은 비중입니다 — 소수 첫째 자리입니다.
- 비중을 문장 안에 쓸 때 조사는 로케일 문구의 조사 처리로 값에 맞춰 붙입니다 — "지출의 33.2%가 고정이에요" · "지출의 0.1% 미만이 고정이에요". 값 뒤 조사를 문구에 박아 두면 "미만가" 처럼 깨집니다.
- 막대 · 말풍선 · 범례 · 읽는 이름이 같은 값을 씁니다.
- 1000% 이상은 천 단위 쉼표를 넣습니다 — "1,234%"(한국어 · 영어 같습니다). 소수 자리는 위 표 그대로입니다(진행률 "1,234%" · 등락률 "▲ 1,234.56%"). 돈 · 개수와 같은 숫자 묶음이라 한눈에 같이 읽힙니다.

### 구간 · 괄호

- 구간은 한국어 물결표 `~`, 영어 en dash `–` 로 잇고 앞뒤를 붙여 씁니다 — `9월 1일~9월 30일` · `06~10시` · `Sep 1–30`.
- 구간 기호는 로케일 문구에 둬서 언어마다 바뀌게 합니다 — 코드에 직접 쓰지 않습니다.
- 괄호는 한국어는 앞 글자에 붙이고(`매일 운동(30분)`), 영어는 한 칸 띄웁니다(`Exercise (30 min)`).
- 날짜 구간을 한 글로 쓸 때 줄은 구간 기호 뒤에서 먼저 바꿉니다. 그래도 넘치면 각 날짜 안의 띄어쓰기에서만 바꿉니다 — 낱말 가운데서 끊지 않고, 구간 기호는 앞 날짜에 붙어 줄 첫머리에 오거나 혼자 한 줄이 되지 않습니다(일정 상세의 여러 날 종일). 한 줄 버튼(통계 기간 버튼)은 줄을 바꾸지 않습니다 — 해가 다른 기간은 점 · 두 자리 연도로 줄입니다(위 "날짜").

### 번역 여유

- 버튼 · 라벨처럼 폭이 정해진 자리는 번역하면 길어질 자리를 둡니다 — 줄바꿈하거나 늘어나게 합니다.
- groo 의 한국어 · 영어 문구 6,100여 쌍을 재면 영어가 한국어의 2배(가운데값)이고, 6자 이하 짧은 말은 2.5배, 58 ~ 60% 가 2배 이상입니다.
- 한국어 글자 수에 따라 이만큼 늘어날 자리를 둡니다 — 10자 이하 150 ~ 250% · 11 ~ 20자 130 ~ 150% · 21 ~ 30자 110 ~ 130% · 31 ~ 50자 90 ~ 110% · 51 ~ 70자 80 ~ 90% · 71자 이상 80%.
- 화면은 영어로도 한 번씩 확인합니다.

## Voice and Tone

groo 가 사용자에게 말하는 방법입니다. 심플하고 믿음직하게, 나이와 상관없이 누구나 알아듣게 말합니다. groo 는 돈과 회사 일을 다룹니다.

### 원칙 — 명확한 · 이해하기 쉬운 · 사려깊은

1. **명확하고 간결하게** — 꼭 필요한 정보를 짧게 전해 사용자가 결정하도록 돕습니다. 그래서 믿을 수 있는 서비스가 됩니다.
2. **이해하기 쉽게** — 누구나 쉽게 쓸 수 있게 말합니다.
3. **사려깊게** — 사용자의 입장에서 생각합니다. 성별 · 나이 · 종교 · 혼인 여부 · 인종 · 장애 같은 다양성을 존중하고 배려합니다. 말에는 정보뿐 아니라 감정도 담깁니다.

### 톤 — 차분하고 친절한

- 이야기하듯 친절하게, 들뜨지 않게 말합니다. 돈과 회사 일을 다루므로 믿음이 먼저입니다.
- 느낌표와 감탄은 아낍니다 — 목표를 이룬 순간처럼 축하할 자리에서만 씁니다.
- 말투는 해요체입니다(Writing).

### 역할

- 사용자의 행동을 이끌어 목적을 이루게 돕습니다.
- 언어 · 문화와 상관없이 누구나 쉽게 쓸 수 있게 합니다.
- 어느 화면 · 어느 서비스에서나 같은 경험을 줍니다 — Desk 와 HR 이 같은 목소리로 말합니다.

## Writing

화면 글을 쓰는 규칙입니다. 화면 글의 말투는 해요체이고, 오류는 무엇이 · 왜 · 어떻게를 씁니다.

### 이름 표기

화면 글 안에서 사용자가 지은 이름은 큰따옴표로 묶습니다 — `"여행 적금" 그룹을 삭제할까요?`. 작은따옴표는 쓰지 않습니다.

### 말투

- 해요체로 씁니다 — `저장했어요.` · `삭제할까요?`
- "~니다" 는 두 자리에서만 씁니다 — ① 자동으로 나가고 사용자가 조심해야 하는 알림(보안 알림 · 계정 잠금 같은) ② 개인정보 처리방침 · 약관 같은 법적 문서.
- 사용자가 스스로 연 확인창은 해요체입니다 — `삭제할까요? 삭제하면 되돌릴 수 없어요.`
- 한 문구 안에서 해요체와 합니다체를 섞지 않습니다.

### 존칭

- "-시-" 를 쓰지 않습니다 — `삭제하시겠습니까?` → `삭제할까요?`, `해지하시면` → `해지하면`, `비밀번호를 잊으셨나요?` → `비밀번호를 잊었나요?`
- 부탁 · 권유는 `~해주세요` · `~해보세요` 로 공손하게 합니다.
- 사용자의 이름을 부를 때는 소리 내어 읽어 보고 정합니다.

### 쉬운 말

- 익숙한 단어를 씁니다 — 한자어 · 기술 용어는 풀어 씁니다(`삭제 불가` → `삭제할 수 없어요`, `처리` 대신 구체적인 동작).
- 숫자는 아라비아 숫자로 씁니다(`1개`). `한 번 더` 같은 관용 표현은 그대로 둡니다.
- 줄임말 · 은어 · 유행어를 쓰지 않습니다.
- 기능의 이름보다 목적을, 데이터의 변화보다 사용자의 행동을 씁니다 — `작성을 완료했어요` 대신 `메모를 저장했어요.`
- 같은 내용이면 긍정문 · 능동문으로 씁니다. 피동이 뜻을 더 잘 전하면 피동도 괜찮습니다.
- 한 문장에는 한 목적만 둡니다 — 길어지면 나눕니다.
- 영어 · 숫자 뒤 조사는 붙입니다 — `CSV로` · `AltStore를`.

### 오류

- 무엇이 안 됐는지, 알면 왜, 그리고 어떻게 고치는지를 씁니다 — `삭제하지 못했어요. 잠시 뒤 다시 시도해주세요.`
- "~하지 못했어요" 로 쓰고, `실패` 명사로 끝내지 않습니다(`삭제 실패` 로 쓰지 않습니다).
- 서버 코드 · enum(`MONTHLY`) · 영어 용어(`redirect_uri`)를 화면에 내지 않습니다 — 서버가 준 문구를 그대로 보이지 말고 화면 문구로 바꿉니다.

### 문장 부호

- 문장(평서문 · 명령문)은 하나여도 마침표로 끝냅니다 — `저장했어요.` · `제목을 입력해주세요.`
- 마침표를 쓰지 않는 자리 — 제목, 20px(`text-t7`) 이상 큰 글자, 버튼 · 메뉴 · 라벨.
- 버튼 문장에 `네` · `아니요` 가 있으면 쉼표를 넣습니다 — `네, 삭제할게요`
- 느낌표는 꼭 필요한 순간에만 씁니다(Voice and Tone).
- 줄임표는 `…` 한 글자로 씁니다 — `불러오는 중…`
- 나열은 앞뒤를 띄운 가운뎃점 " · " 으로 잇습니다 — 붙인 "·"(`구독·결제`)를 쓰지 않습니다. 고유명 안에도 예외가 없습니다. 문장 안에서는 " · " 로 값을 잇지 않습니다 — 메타 줄의 구분자입니다(Snackbar 의 글).
- 화면 글 안에서 버튼을 가리킬 때는 버튼 이름을 대괄호로 묶습니다 — `[추가]`.

### 띄어쓰기

- 기능 · 서비스 · 상태 이름 자체는 붙여 씁니다 — 배지 · 칸반 열 · 탭 · 메뉴의 `진행중` · `예약중`.
- 문장 속의 뜻은 띄웁니다 — `진행 중인 일` · `할 일을 적어주세요.` · `불러오는 중…`
- 보조 용언은 붙입니다 — `해주세요` · `해보세요` · `지워주세요`.

## Shapes

### 모서리 스케일

모서리는 2px ~ 24px 10단계와 `full` 입니다. 이름의 숫자는 4px 의 배수입니다(`r1` = 4px, `r0_5` = 2px).

| 토큰 | 값 |
|---|---|
| `radius-r0_5` | 2px |
| `radius-r1` | 4px |
| `radius-r1_5` | 6px |
| `radius-r2` | 8px |
| `radius-r2_5` | 10px |
| `radius-r3` | 12px |
| `radius-r3_5` | 14px |
| `radius-r4` | 16px |
| `radius-r5` | 20px |
| `radius-r6` | 24px |
| `radius-full` | 9999px |

- 모서리는 이 눈금의 이름으로 적습니다 — 픽셀 값을 바로 적지 않습니다. Tailwind 는 `rounded-r1`, CSS 는 `border-radius: var(--radius-r1)` 입니다.
- 컴포넌트마다 어느 모서리를 쓰는지는 아래 "컴포넌트 모서리" 표가 정합니다.

### 컴포넌트 모서리

컴포넌트마다 쓰는 모서리입니다. 새 컴포넌트를 그릴 때 이 표를 먼저 보고, 표에 없는 컴포넌트는 가장 가까운 묶음(Form / Action · Display · Overlay · Navigation · Disclosure · Data)을 따릅니다. 값의 원본은 각 컴포넌트 YAML 입니다.

| 컴포넌트 | 모서리 | 값 | 비고 |
|---|---|---|---|
| **Form / Action** | | | |
| `button` | `r2` · `r3` · `full` | 8px · 12px · 9999px | small · medium 8, large 12, xsmall 알약(`specs/components/button.yaml`) |
| `floating-action-button` | `full` | 9999px | 원 56(`floating-action-button.yaml`) |
| `input` / `textarea` | `r3` · `r2` | 12px · 8px | large · medium(`specs/components/input.yaml` · `textarea.yaml`) |
| `select` 트리거 · Input Button | `r3` · `r2` | 12px · 8px | Input 과 같다(`select.yaml` · `input-button.yaml`) |
| `select` 목록 | `r5` | 20px | 칸 아래 뜨는 목록 |
| `select-box` | `r3` | 12px | `select-box.yaml` |
| `slider` (트랙 · 손잡이 · 말풍선) | `full` · `r1_5` | 9999px · 6px | 트랙 · 손잡이는 원, 끄는 동안 뜨는 말풍선은 6(`slider.yaml`) |
| `toggle` (아이콘 단추) | `r2` | 8px | 누름 · 호버 바탕에만 보인다(`toggle.yaml`) |
| 인증 코드 칸(Input OTP) | `r3` · `r2` | 12px · 8px | Input 한 칸 — large · medium, Input 과 같다(`input-otp.yaml`) |
| `color-swatch` (색 칸 · 고른 고리) | `full` | 9999px | 원 40(`color-swatch.yaml`) |
| `icon-picker` (칸) | `r3` | 12px | 칸 48(`icon-picker.yaml`). 트리거는 Input Button |
| `quantity-picker` (상자 · 버튼) | `r2` · `r3` | 8px · 12px | small · medium 8, large 12 — 버튼의 누름 바탕도 같은 모서리(`quantity-picker.yaml`) |
| `attachment-input` (타일 · 항목 · 드롭존 · ×) | `r3` · `r2` · `full` | 12px · 8px · 9999px | 첨부 타일 · 사진 · 파일 카드 · 드롭존 12, 파일 카드의 썸네일 칸 8, × 는 원(`attachment-input.yaml`) |
| `chip` | `full` | 9999px | 알약(`specs/components/chip.yaml`) |
| `checkbox` (칸) | `r1` | 4px | `specs/components/checkbox.yaml` |
| `radio-group` (동그라미 · 점) | `full` | 9999px | 원형(`specs/components/radio-group.yaml`) |
| `switch` (track + thumb) | `full` | 9999px | 알약 |
| `list` 줄 바탕 · 타일 | `r2_5` · `r3` | 10px · 12px | 누르면 들어오는 바탕 · 앞 타일 — 카드 안 바탕은 동심 모서리(itemRadius)(`list.yaml`) |
| **Display** | | | |
| `badge` | `r1` · `r1_5` | 4px · 6px | medium · large — 둥근 사각(알약은 누르는 Chip)(`badge.yaml`) |
| `notification-badge` | `full` | 9999px | 점 · 숫자 알약(`notification-badge.yaml`) |
| `avatar` | `full` | 9999px | 원 하나(`avatar.yaml`) |
| `card` | `r4` | 16px | 바닥 위 흰 면 + 1px 테두리 · 그림자 없음 — 카드 안 목록의 누름 바탕은 동심 10. 순자산 카드도 같다(`card.yaml`) |
| `callout` | `r2_5` | 10px | 본문 안 안내 상자(`callout.yaml`) |
| `page-banner` | — | 0 | 화면 폭 띠, 모서리 없음(`page-banner.yaml`) |
| `progress` (트랙 · 채움) | `full` | 9999px | 막대 8(`progress.yaml`) |
| `progress-circle` | — | — | 원(SVG) · 끝이 둥근 호(`progress-circle.yaml`) |
| `skeleton` | `r1` · `r1_5` · `r2` · `r3` · `r4` · `full` · — | 4px · 6px · 8px · 12px · 16px · 9999px · 0 | 글 8(기본) · 그림 자리는 Image Frame 대로 4 · 6 · 8 · 타일 12 · 카드 면 16 · 아바타 full · 화면 폭 사진 0(`skeleton.yaml`) |
| `content-placeholder` | — | 0 | 제 모서리 없음 — 담는 틀이 자른다(`content-placeholder.yaml`) |
| `image-frame` | `r1` · `r1_5` · `r2` · — | 4px · 6px · 8px · 0 | 폭으로 — 24 이하 · 48 이하 · 그 위 · 화면 폭. 스켈레톤 · 대체 그림 · 카드 면도 같다(`image-frame.yaml` · `card-art.yaml`) |
| `logo-tile` | `r2_5` · `r3` · `r3_5` | 10px · 12px · 14px | 32 · 40 · 48 — 크기 × 0.3(List 타일과 같다)(`logo-tile.yaml`) |
| `aspect-ratio` | — | 0 | 비율 상자만 — 둥근 그림 틀은 Image Frame(`aspect-ratio.yaml`) |
| divider | — | — | 1px 선, 모서리 무관(`divider.yaml`) |
| `scroll-area` (스크롤바 막대) | `full` | 9999px | 6px 알약(`scroll-area.yaml`) |
| `resizable` (손잡이 표시 · 위젯 자리표시) | `r0_5` · `r4` | 2px · 16px | 손잡이 표시 4 × 24 · 자리표시는 위젯(Card 면)과 같다(`resizable.yaml`) |
| `scroll-fog` | — | — | 마스크(모양 없음)(`scroll-fog.yaml`) |
| `typography` | — | — | 글자, 모서리 무관 |
| **Overlay** | | | |
| `dialog` / `alert-dialog` | `r5` | 20px | `dialog.yaml` · `alert-dialog.yaml` |
| `bottom-sheet` (위 모서리) | `r6` | 24px | 위 두 모서리만(`bottom-sheet.yaml`) |
| `menu-sheet` (위 모서리 · 묶음) | `r5` · `r4` | 20px · 16px | `menu-sheet.yaml` |
| `side-panel` | — | 0 | 평평 — 높이 전체 · 모서리 없음(`side-panel.yaml`) |
| `popover` · `menu` | `r5` | 20px | 떠 있는 표면(`popover.yaml` · `menu.yaml`). 메뉴 줄의 알약은 `r3` 12px |
| `help-bubble` · `tooltip` | `r3` | 12px | 말풍선(`help-bubble.yaml`) |
| `snackbar` | `r2` | 8px | `snackbar.yaml` |
| **Navigation** | | | |
| `tabs` (Line) | — | 0 | 각진 막대(`tabs.yaml`). Chip Tabs 는 `chip` |
| `segmented-control` (트랙 · 알약) | `full` | 9999px | `segmented-control.yaml` |
| `menu` 줄 바탕(알약) | `r3` | 12px | 좌우 8 들인 알약 — 표면은 위 Overlay 의 `menu` |
| `pagination` 칸 · `table-pagination` 화살표 | `r2` | 8px | 칸 40 — 지금 쪽 채움 · 누를 때 바탕(`pagination.yaml` · `table-pagination.yaml`) |
| `top-navigation` 아이콘 · 글 버튼 | `r2` | 8px | 누를 때만 보이는 바탕 — 바 자체는 모서리 없음(`top-navigation.yaml`) |
| `bottom-navigation` 바 · 가운데 + | `full` | 9999px | 떠 있는 알약 · 원 44(`bottom-navigation.yaml`) |
| `side-navigation` 항목 · 펼침 메뉴 | `r2_5` · `r5` | 10px · 20px | 항목 바탕 10 · 펼침 메뉴는 Menu 와 같은 20(줄 알약 12)(`side-navigation.yaml`) |
| **Disclosure** | | | |
| `accordion` · `collapsible` (separated 면 · 누름 바탕) | `r4` · `r2_5` | 16px · 10px | separated · 카드 면은 Card 16, 트리거의 누름 바탕은 10(동심) · 모두 펼치기 8(`accordion.yaml` · `collapsible.yaml`) |
| `tree-view` 줄 · List 하위 줄 꺾쇠 단추 | `r2_5` | 10px | 줄 바탕 · 포커스 링 · 꺾쇠 단추 — Side Navigation 항목과 같다(`tree-view.yaml` · `list.yaml`) |
| **Data** | | | |
| `date-picker` 날짜 원 · 기간 띠 | `full` · — | 9999px · 0 | 원 42 · 띠는 줄 끝에서 각지게 끊는다(`date-picker.yaml`) |
| `wheel-picker` 선택 띠 | `r2` | 8px | Time Picker · 연 · 월 휠(`wheel-picker.yaml`) |
| `table` | — · `r3` | 0 · 12px | 표는 모서리 없이 카드 안에 붙는다 · 일괄 작업 바 12(`table.yaml`) |
| `chart` | `r3` · `r1` | 12px · 4px | 툴팁 · 지표 타일 12 · 막대 위 · 열지도 칸 4(`chart.yaml`) |
| `searchable-list` | — | — | 줄은 List · 검색칸은 Input 그대로(`searchable-list.yaml`) |
| `swipe-actions` 배지 | `full` | 9999px | 원형 배지 36(`swipe-actions.yaml`) |
| `footer` 링크 포커스 링 | `r1` | 4px | 바닥 자체는 모서리 없음(`footer.yaml`) |

- 두 브랜드가 같은 모서리를 씁니다.
- 모서리는 누르는 영역을 넓히지 않습니다 — `full` 을 작은 아이콘 버튼에 쓸 때도 누르는 영역 44 × 44 는 따로 채웁니다(Layout 의 "터치 영역").

## Components

이 절은 담다에서 달라지는 값과 담다에서 쓰는 자리를 적습니다. 공유 규칙과 수치는 `DESIGN.md` 의 같은 이름 절과 각 컴포넌트 스펙(`specs/components/<이름>.md` · `<이름>.yaml`)에 있습니다.

### Button

규칙 · 수치는 공유 `DESIGN.md` 의 Button 절과 `specs/components/button.md` 에 있습니다. 브랜드마다 달라지는 것은 brandSolid 의 채움 · 누름과 brandOutline · ghost(brand) 의 글자뿐입니다 — hover · 누름의 세기나 전환 시간은 브랜드마다 달리하지 않습니다.

| 자리 | 토큰 | 라이트 | 다크 | 대비 |
|---|---|---|---|---|
| brandSolid 채움 | `bg-brand-solid` | `#0147AD` | `#1049A4` | 흰 글자 8.38:1 · 다크 8.36:1 |
| brandSolid 누름 · 호버 · 로딩 | `bg-brand-solid-pressed` | `#013D96` | `#1A5AC2` | 흰 글자 9.96:1 · 다크 6.39:1 |
| 브랜드 글자(brandOutline · ghost brand) | `fg-brand` | `#0147AD` | `#7AA9F6` | `bg-layer-default` 위 8.38:1 · 다크 6.10:1 |
| 포커스 링 | `stroke-focus-ring` | 브랜드 역할 | 브랜드 역할 | 2px · 띄움 2px |

담다는 모바일에서 쓰는 일이 많습니다 — 화면 하단 CTA 는 `large` 전체 폭이고, 닫기와 둘이면 3:7(보조 : CTA)입니다. brandSolid 는 거래 추가처럼 서비스의 핵심 액션 하나에만 쓰고, 저장 · 확인 같은 일반 CTA 는 neutralSolid 입니다.

### Input · Textarea

공통 정의는 `DESIGN.md` 의 Input · Textarea 절에, 원본은 `specs/components/input.md` · `textarea.md` 에 있습니다. 포커스 · 오류 · 비활성 색은 브랜드와 관계없이 같습니다 — 포커스는 `stroke-neutral-contrast` 2px 이고 브랜드 색이 아닙니다.

#### Desk 쓰임

- 담다 앱은 늘 large 52 · 글자 16 입니다. 담다 웹은 반응형 기본(1280 미만 large · 이상 medium)입니다.
- 금액을 먼저 받는 단계 화면 · 목록 위 검색은 밑줄형입니다(화면에 입력이 하나뿐일 때). 금액은 숫자 키보드이고, 쓰는 동안 쉼표를 넣고 뒤에 글자 "원" 을 붙입니다.
- 메모 본문 · 거래 메모는 Textarea 자동 높이입니다. 시트 안에서는 최대 높이를 정해 저장 버튼이 밀리지 않게 합니다.

### Select · Input Button

공통 정의는 `DESIGN.md` 의 Select · Input Button 절에, 원본은 `specs/components/select.md` · `input-button.md` 에 있습니다. 고른 표시 · 누름 · 포커스 색은 브랜드와 관계없이 같습니다.

#### Desk 쓰임

- 담다 앱은 늘 large(트리거 52 · 선택지 46)입니다. 앱도 Select 목록은 칸 아래에 붙습니다 — 시트로 바꾸지 않습니다.
- 거래 추가 — 결제 수단은 Select(카드 · 계좌 묶음, 맨 앞 "결제 수단 없음")이고, 카테고리 · 날짜는 Input Button 입니다. 카테고리 격자 시트는 누르면 바로 반영하고, 날짜 · 시각은 "완료" 로 반영합니다.
- 계좌 종류(6 — 수정 폼의 종류 칸. 추가는 종류부터 Select Box 로 고릅니다) · 일정 반복(5) · 통화는 Select 이고, 반복 요일은 여럿 고르는 Select 입니다. 기관 · 종목처럼 긴 목록은 Input Button + 검색 시트입니다.

### Card

모양 · 규칙은 공유 `DESIGN.md` 의 Card 절과 `specs/components/card.md` 에 있습니다.

#### 순자산 카드

담다 홈 · 자산 맨 위 한 자리에 둡니다 — 135° 그라디언트 + 흰 글자이고, 다크도 짙은 채움입니다.

| 자리 | 토큰 | 라이트 | 다크 | 흰 글자 |
|---|---|---|---|---|
| 시작(왼쪽 위) | `bg-brand-solid` | `#0147AD` | `#1049A4` | 8.38 · 8.36 |
| 끝(오른쪽 아래) | `brand-900` · `brand-300-dark` | `#002460` | `#1F3A69` | 14.78 · 11.25 |

- 라벨 13 · 500, 금액 32 / 42(`text-t12`) · 700, 아래 글 13 입니다 — 모두 `static-white` 이고 불투명도로 흐리지 않습니다. 증감도 흰 글자 + ▲ · ▼ + 글입니다 — 빨강 · 파랑은 채움 위 대비가 1.66 · 1.65 라, 방향 색을 쓰지 않는 하나뿐인 예외입니다.
- 오른쪽 위에 장식 빛(흰 22% → 투명)을 둡니다 — 흰 글자 대비는 빛 위에서도 4.88 이상입니다. 여백 24 · 모서리 16 으로 다른 카드와 같습니다.

#### Desk 쓰임

- 카드는 데스크톱(768 이상) 화면의 구역입니다 — 흰 바탕 평면 묶음이나 흰 위 흰 그림자 카드(raised)를 쓰지 않고, 묶음마다 목록 카드(머리 + List 줄)를 둡니다. 담다 폰(앱 · 768 미만 웹)에는 카드 화면이 없습니다 — 띠 · 흰 화면이고(띠 안 값은 카드 안과 같고, 띠 안에 카드를 두지 않습니다), 어느 화면이 어느 쪽인지는 Layout 의 "화면 바탕" 한 곳에 적습니다.
- 머리 동작은 "전체 보기" 하나이고, 누르는 영역은 44 입니다.
- 통계 하이라이트 · 비교 지표는 지표 카드 + 증감(▲ 빨강 · ▼ 파랑 + 글)입니다. 폰은 한 줄에 하나이고, 데스크톱 격자에 넷씩 두면 숫자는 20 입니다. 폰 띠 화면에서는 지표 카드 없이 지표를 띠 안에 둡니다. 한 묶음의 지표는 한 띠 안에 위아래로 쌓고(사이는 띠 안 여백 24), 지표마다 띠를 나누지 않습니다 — 묶음마다 띠 하나가 띠 화면의 규칙입니다.
- 데이터 하나가 실패해도 화면 전체를 스켈레톤으로 되돌리지 않습니다 — 그 구역(데스크톱 카드 · 폰 띠) 안에 Result Section + 다시 시도를 둡니다.

### Badge · Notification Badge · Tag Group — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 같은 이름 절과 `specs/components/badge.md` · `notification-badge.md` · `tag-group.md` 에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **거래 줄의 상태** — 예정 · 환불됨 · 기록만은 Badge `weak` `neutral` medium 입니다. 줄은 흐리지 않습니다 — 제목 · 금액만 `fg-neutral-subtle` 이고, 환불 금액은 취소선입니다(List 의 "합계에 안 드는 줄").
- **같은 뜻은 같은 모양** — 달성은 `positive` weak "달성"(웹 · 앱 같은 글), 증권 "기본" · "Pro 시작" 은 웹 · 앱 한 변형, 연체는 `critical` weak 하나입니다.
- **작은 배지** — 단종 · 새로 · 결제자 배지는 medium 11 이고, "NEW" 대신 "새로" 라고 씁니다. 요금제 이름 Pro · Free 는 그대로 씁니다.
- **현재 기기** — `outline` `positive` 입니다.
- **알림 점** — 상단 바 알림(웹 · 앱)은 브랜드 점 6(`fg-brand`)이고, 버튼 이름은 "알림, 새 알림 있음" 입니다. 필터 개수 배지는 두지 않습니다 — 걸린 조건은 Chip 필터 바가 보입니다. 상세 빠른 동작 위의 "2개" · "연결됨" 은 알림이 아니라 버튼 글입니다.
- **메타 줄** — 거래 · 할 일 · 메모 · 이체 줄의 설명 줄은 Tag Group(`t3` · 한 줄 말줄임)입니다. 웹 · 앱이 같은 항목(분류 · 자산 · 시각)을 같은 구분으로 씁니다. 분할 개수(아이콘 + 숫자)는 읽을 글 "분할 2건" 을 답니다.

### Focus ring

담다의 포커스 링은 역할 색 `stroke-focus-ring` 하나이고, 모든 인터랙티브 컴포넌트가 같은 링을 씁니다. 모양 · 접근성 규칙은 `DESIGN.md` 의 Focus ring 절에 있습니다.

#### 색

| 토큰 | 라이트 | 다크 |
|---|---|---|
| `stroke-focus-ring` | `#0147AD` | `#7AA9F6` |

#### 대비

| 페어 | 대비 |
|---|---|
| `#0147AD` vs `bg-layer-basement` (`#F5F6FA`) | **7.76:1** ✅ |
| `#0147AD` vs `bg-layer-default` (`#FFFFFF`) | **8.38:1** ✅ |
| `#7AA9F6` vs `bg-layer-basement` 다크 (`#1A1F2E`) | **6.90:1** ✅ |
| `#7AA9F6` vs `bg-layer-default` 다크 (`#242938`) | **6.10:1** ✅ |
| `#7AA9F6` vs `bg-layer-floating` 다크 (`#2D3346`) | **5.28:1** ✅ |

담다는 라이트 링이 모든 표면에서 본문 AA(4.5:1)도 넘습니다 — 터치와 키보드를 함께 쓰는 모바일 사용자에게 강한 표시입니다.

#### 모양

- 두께 2px, 띄움 2px 이고, 컴포넌트와 같은 `border-radius` 를 씁니다. 입력칸 · 선택 상자는 입력 중 테두리 2px 입니다(State 절).
- `focus-visible` 만 씁니다 — 마우스로 누를 때는 그리지 않습니다.
- 제 상자가 보이는 것(칩 · 버튼 · 떠 있는 버튼 · 탭)은 바깥 링, 화면 폭 줄 · 칸은 안쪽 링(모서리 0)입니다. 앱도 키보드 초점에 같은 링을 그리고, 터치에는 그리지 않습니다.
- 디자인 시스템 부품 밖의 요소(본문 링크 · 화면이 만든 버튼 · 손잡이 · 스크롤 영역)도 같은 링입니다 — 웹은 전역 `:focus-visible { outline: 2px solid var(--color-stroke-focus-ring); outline-offset: 2px; }` 를 기본으로 두고, 부품이 제 규칙으로 덮습니다.

#### Motion

- 링은 `motion-duration-color-transition` × `motion-ease-easing` 으로 나타납니다.
- `prefers-reduced-motion: reduce` 면 바로 보입니다.

#### A11y

- WCAG 2.4.11 · 2.4.12 · 2.4.13 — 위 대비를 지킵니다. 고정 머리 아래로 포커스가 가면 `scroll-margin-top` 으로 스크롤합니다.
- 다크 모드는 `[data-theme="dark"]` · `prefers-color-scheme: dark` 블록이 `--color-stroke-focus-ring` 을 다크 값으로 바꿉니다.

### Divider — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 Divider 절과 `specs/components/divider.md` 에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- 선은 1px `stroke-neutral-subtle` 하나입니다.
- 거래 · 할 일 · 메모 줄 사이는 List 규칙 하나를 따릅니다(기본 선 없음).
- 크게 다른 내용(홈 카드 묶음 사이)은 선이 아니라 8 간격으로 나눕니다 — 회색 바탕 위 흰 카드입니다.

### Switch / Checkbox / Radio

담다에서는 데이터 내보내기 · 카드 혜택 필터에 Checkbox, 알림 설정에 Switch 를 씁니다. 설명 · 입력칸이 붙는 하나 고르기(반복 거래 "종료")는 Select Box 입니다(아래 Select Box). 할 일 완료 원은 Checkbox 입니다.

#### 색

- 세 컨트롤의 원본은 `specs/components/switch.md` · `checkbox.md` · `radio-group.md` 이고, 색 규칙은 셋이 같습니다.
- 선택 · 켜짐은 `bg-neutral-inverted`(짙은 회색) 채움 + `fg-neutral-inverted` 표시(체크 · 점 · 엄지)가 기본입니다. `tone="brand"` 면 담다 파랑(`bg-brand-solid`) + `static-white` 이고, 서비스 핵심 흐름에서만 씁니다.
- 선택 안 됨 · 꺼짐은 `stroke-neutral-solid` 입니다 — Checkbox · Radio 는 1px 테두리, Switch 는 트랙 채움입니다.
- 막힘은 전용 색입니다(State 절). 선택 · 켜진 채 막히면 모양은 그대로 두고 회색으로 바꿉니다.
- 포커스는 키보드 포커스에만 `stroke-focus-ring` 2px · 띄움 2px 입니다.

#### Variant

- Switch: 트랙 38 × 24(`24`, 기본) · 26 × 16(`16`) · 52 × 32(`32`)이고, 끄면 엄지가 0.8 로 작아집니다. 알림 켜고 끄기처럼 누르는 순간 적용되는 설정에만 씁니다. 저장해야 적용되는 값(자산 "합계에 포함" · 반복 "자동 기록")은 Checkbox 입니다.
- Checkbox: 칸 20(`medium`, 기본) · 24(`large`)입니다. 모바일에서 홀로 서는 선택은 `large` 입니다.
- Radio: 동그라미 20(`medium`, 기본) · 24(`large`)이고, 선택은 채운 원 + 가운데 점, 묶음은 세로입니다. 모바일에서 홀로 서는 선택은 `large` 입니다.

#### Layout

- 모바일 폼 행은 label + control 간격 `spacing-x3` (12px), 행 사이 `spacing-x4` (16px)입니다.
- 목록 줄은 List 의 체크 줄(`ListCheckItem`, `specs/components/list.md`)입니다 — 행 전체가 누르는 영역입니다.
- 누르는 영역은 44×44 이상입니다.

#### Motion

- Switch: 엄지의 이동 · 크기는 `motion-duration-d3` (150ms), 색은 20ms 뒤에 50ms 입니다 — `specs/components/switch.yaml`. 두 브랜드가 같은 값입니다.
- 할 일을 완료하면 취소선 + 색 전환(`fg-disabled` 로)을 `motion-duration-color-transition` × `motion-ease-easing` 으로 그립니다 — 불투명도로 흐리지 않습니다.

#### A11y

- HTML native `<input>` + `<label for>` 를 먼저 씁니다.
- 포커스 링은 `stroke-focus-ring` (`#0147AD` · 다크 `#7AA9F6`) 2px 입니다.
- Switch 는 native `<input type="checkbox" role="switch">` + `aria-checked` 입니다. 스위치만 쓰는 설정 줄은 줄 전체가 누르는 영역이고, 줄의 제목이 스위치의 이름이 됩니다 — 줄의 모양은 List 의 스위치 줄(`ListSwitchItem`)입니다.
- 키보드는 Space, Radio 는 방향 키이고, 묶음은 `role="radiogroup"` 입니다.

### List

규칙 · 수치의 원본은 [`specs/components/list.md`](specs/components/list.md) 와 `list.yaml` · `list-header.yaml` 입니다. 코드(`recipes/shadcn/components/ui/list.tsx`) 와 사이트 그림을 함께 맞춥니다.

- 구조: 목록(List) · 한 줄(List Item) · 목록 제목(List Header) · 줄 사이 선(ListDivider)입니다. 설정 · 메뉴 · 선택 · 키-값 줄과 거래 · 할 일 · 알림 같은 내용 줄을 모두 List 로 그립니다. 하나 고르기는 오른쪽 라디오 줄(`ListRadioItem`)입니다.
- 한 줄: 위아래 `spacing-x3` (12) · 좌우 `spacing-global-gutter` (24) · 제목 `t5` 16 · 400 `fg-neutral` · 설명 `t3` 13 `fg-neutral-subtle`(제목 아래 2)입니다 — 한 줄 46 · 두 줄 66.
- 앞: 설정 · 메뉴 줄은 아이콘 22(`fg-neutral`)이고, 색이 뜻을 가진 내용 줄은 타일 40(모서리 `radius-r3` 12 · `chart-{색}-weak` 바탕 · 아이콘 20 — 아이콘이 없으면 태그 아이콘, 이체 줄은 회색)입니다. 은행 · 카드 같은 물건 줄은 로고 타일 40(Logo Tile), 카드 혜택 줄은 카드 그림 56(Image Frame)입니다. 체크 · 라디오는 24, 스위치는 32 입니다.
- 뒤: 값 글자(`t5` · `fg-neutral-subtle`) · 오른쪽 화살표 18(화면을 옮기는 줄에만) · 컨트롤 · 작은 버튼입니다.
- 누름 · 호버(웹): 바탕 층이 좌우 6 들어와 모서리 10 의 `bg-layer-default-pressed` 가 되고, 콘텐츠 층만 2px 거리로 줄어듭니다. 끼운 컨트롤은 따로 줄지 않습니다. 포커스 링은 줄 안쪽 2px 입니다.
- 강조: 바탕만 `bg-brand-weak`(누름 · 호버 `bg-brand-weak-pressed`)입니다. 그동안 설명 · 값 글자는 4.5:1 을 지키려고 `fg-neutral-muted` 입니다.
- 줄 사이 선은 기본으로 두지 않습니다 — 필요할 때만 `ListDivider`(1px `stroke-neutral-subtle`, 줄 폭 또는 좌우 24 들임)를 씁니다.
- 목록 제목: `t4` 14 · 위아래 8 · 좌우 24 입니다 — `mediumWeak`(500 · `fg-neutral-subtle`, 기본) · `boldSolid`(700 · `fg-neutral`).
- 알림의 안 읽음은 바탕으로만 보입니다 — 왼쪽 막대 · 점을 두지 않습니다.
- 하위 줄: 부모 · 하위 두 단계에서 줄은 편집을 열고 하위만 접는 목록(카테고리)입니다. 부모 줄 앞에 꺾쇠 단추 44(이름 "{카테고리} 하위 카테고리" + `aria-expanded` · 펼치면 90° · 300ms)를 두고, 하위 줄은 부모 제목 자리 104 에서 시작합니다. 하위가 없는 줄도 꺾쇠 자리를 비워 부모 타일이 한 세로줄(52)에 섭니다. 여러 단계에서 고르는 나무는 Tree View 입니다.
- 목록은 흰 바탕(`bg-layer-default`) · 시트(`bg-layer-floating`) 위에 둡니다 — 회색 바탕(`bg-layer-basement`) 위에서는 누름 바탕이 보이지 않기 때문입니다(카드에 담습니다).
- 가계부 거래 · 할 일 · 메모는 표가 아니라 List 입니다. 담다의 표(Table, `specs/components/table.md`)는 가져오기 · 내보내기 미리보기와 증권의 일별 시세 · 호가 · 체결(`<table>`)이고, 768 미만은 List 줄입니다.

### Select Box

규칙 · 수치의 원본은 [`specs/components/select-box.md`](specs/components/select-box.md) 와 `select-box.yaml` 입니다. 코드(`recipes/shadcn/components/ui/select-box.tsx`) 와 사이트 그림을 함께 맞춥니다.

- 구조: 하나 고르기(Radio Select Box) · 여럿 고르기(Check Select Box) · 묶음(Select Box Group)입니다. 설명 · 아이콘 · 딸린 입력이 붙는 선택지 2 ~ 6개를 견줘 고르고, 저장 · 다음 같은 버튼으로 반영합니다.
- 상자: 모서리 `radius-r3` (12) · 안쪽 1px `stroke-neutral-weak` 입니다. 고르면 안쪽에 2px `stroke-neutral-contrast` 를 덧그립니다 — 내용이 밀리지 않고, 바탕은 그대로입니다(브랜드 색 없음).
- 글자: 제목 `t5` 16 · 500 `fg-neutral` · 설명 `t3` 13 `fg-neutral-muted`(두 줄까지)입니다. 앞 아이콘은 22(`fg-neutral`)입니다.
- 컨트롤은 오른쪽입니다 — 라디오 20(neutral) · 칸 없는 체크(Checkbox Ghost) · 없음(테두리만, 좁은 3열 같은 자리). 컨트롤은 따로 줄지 않고 자기 포커스 링도 그리지 않습니다.
- 배치: 1열은 가로형(위아래 16 · 왼쪽 20 · 오른쪽 16, 세로 가운데), 2 ~ 3열은 세로형(위아래 20 · 좌우 16, 앞이 위 · 컨트롤은 위 오른쪽)입니다. 묶음 줄 사이는 `spacing-component-default` · 열 사이는 12 이고, 2열 이상이면 모든 상자가 가장 긴 상자의 높이입니다. 가장 작은 상자는 54 입니다.
- 누름 · 호버(웹): 상자 바탕이 `bg-layer-default-pressed` 가 되고 누르는 자리(콘텐츠 + 컨트롤)만 2px 거리로 줄어듭니다. 키보드 포커스 링은 상자 바깥 2px · 띄움 2px 입니다.
- 펼침: 고른 상자 아래로 딸린 입력 · 안내가 열립니다(안쪽 좌우 20 · 아래 16, 높이 400ms · 투명도 300ms). 닫히면 보이지 않고 Tab 도 닿지 않습니다.
- 누르는 순간 바뀌는 고르기는 List 의 라디오 줄이고, 누르면 바로 무언가를 하는 자리는 버튼입니다. 테마 같은 설정 값은 지금 값을 보이는 줄을 누르면 고르기 시트 · Popover 가 열리고, 그 안이 라디오 줄입니다.
- 담다에서는 내보내기 기간 · 파일 형식 · 더치페이 분배 방식 · 필터 거래 종류 · 반복 거래 종료를 Select Box 로 고릅니다. 테마는 값 줄 → 고르기 시트 · Popover(안은 List 라디오 줄)입니다. "빠르게 맞추기" 는 누르면 바로 금액을 고치므로 버튼입니다.

### Chip — Desk

공통 정의는 `DESIGN.md` 의 Chip 절에, 원본은 `specs/components/chip.md` 에 있습니다. 고른 칩은 중립색이라 브랜드와 관계없이 같습니다.

- **거래 추가 거래 종류** — 지출 · 수입 · 이체 하나 고르기(Outline Strong — 고른 값이 곧 화면의 갈래)입니다. 수정에서 종류를 못 바꾸면 고르지 않은 칩만 막습니다.
- **가계부 필터 바** — 목록 위 한 줄에 기간 · 거래 종류 · 카테고리 · 계좌 · 카드 · 금액 칩(▾ — "계좌 · 카드" 는 칩 하나)을 둡니다. 걸린 조건은 짙은 채움 + "식비 외 2개" 이고, 맨 앞에 지우기(↺)를 둡니다. 카테고리 · 계좌의 "빼고" 는 "고른 것만 · 고른 것 빼고" 를 먼저 고릅니다(3상태 칩 없음).
- **예산 빠른 금액 · 통계 빠른 기간 · 프리셋** — 제안 칩(고른 표시 없음)입니다.
- **메모 태그 · 더치페이 참여자** — 입력값 칩(× 로 뺍니다)입니다.
- 할 일 우선순위 · 반복 주기처럼 2 ~ 4개인 폼 값은 칩, 요일 7개 · 계좌 종류 6개는 Select 입니다. 자산 추가는 종류부터 Select Box 로 고르고, 수정의 종류 칸만 계좌는 Select · 카드(신용 · 체크)는 칩입니다.

### Tabs · Segmented Control

공통 정의는 `DESIGN.md` 의 Tabs · Segmented Control 절에, 원본은 `specs/components/tabs.md` · `segmented-control.md` 에 있습니다. 고른 표시는 중립색이라 브랜드와 관계없이 같고, 알림 점만 브랜드 글자색(`fg-brand` — Notification Badge small)입니다.

- **1차 Line** — 통계(카테고리 · 추이 · 비교) · 카테고리(지출 · 수입) · 증권사(나무증권 · 토스증권)는 Fill, 금액 가리기(9개)는 Hug 입니다. 모바일 · 데스크톱이 같은 모양입니다.
- **가계부 묶음(폰)** — 가계부 · 자산 · 통계 · 예산은 가계부 화면 위 1차 Line(Fill · medium 44)이고, 하단 탭 바는 그대로입니다. 그 아래 통계의 카테고리 · 추이 · 비교는 폰에서 2차라 "두 단" 규칙을 따릅니다 — Chip Tabs 이고, 통계 화면에 필터 칩이 함께 있으면 Line 입니다.
- **2차 Chip Tabs** — 증권 보유 · 관심 · 발견입니다.
- **Segmented Control** — 프리셋 정렬 · 사용 내역 정렬 · 자산 추이 기간(3개월 · 6개월 · 1년) · 더치페이(진행 중 · 완료 · 친구 — 폰은 요약 띠 아래 목록 띠 맨 위)이고, 목록 바로 위에 둡니다. 가계부 목록의 전체 · 지출 · 수입은 필터 바의 "거래 종류" 칩입니다. 할 일에는 Segmented Control 을 두지 않습니다 — 이번 주는 달력, 완료는 거르기입니다.
- **탭 아닌 자리** — 폼 값(거래 종류 · 반복 주기 · 언어 · 이메일 주기 …)은 Chip · Select, 메모 태그 · 카드 혜택 · 반복 거래 거르기는 Chip 필터 바입니다.
- 증권 차트 기간(1일 · 1주 · 1개월 · 3개월 · 1년)은 Segmented 5칸 예외입니다(`specs/components/segmented-control.md`).
- **캘린더 보기** — 월 · 주 · 목록 셋입니다. 목록 보기는 날짜마다 List Header 아래 일정 줄이고, 줄은 하루 패널의 줄과 같은 모양입니다 — List 줄 + 일정 색 배지(`eventBadgeTone`) + 깃발 · 해 · 시계 아이콘.

### 메뉴 · 메뉴 시트 · 도움말 말풍선 · 툴팁

모양 · 쓰는 규칙은 `DESIGN.md` 의 같은 이름 절에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **목록 줄의 동작** — 목록 줄에는 ⋮ 를 두지 않습니다. 줄을 누르면 들어가고(상세 · 수정 시트), 동작이 하나(삭제)면 바닥 왼쪽 [삭제], 여럿이면 머리 ⋮ → Menu Sheet · Menu 입니다. 폰은 스와이프(고정 · 수정 · 삭제)가 지름길입니다. 늘 보이는 수정 · 삭제 아이콘은 두지 않습니다. 가계부(폰 · 데스크톱) · 카테고리(수정 시트 머리 ⋮ — 하위 추가 · 거래 옮기기 · 삭제) · 할 일(상세 [수정][삭제]) · 할 일 태그(수정 시트 바닥 [삭제]) · 메모 · 계좌 · 반복 거래 · 프리셋 · 캘린더 관리가 모두 이 규칙을 따릅니다.
- **테마** — 상단 바에 테마 메뉴를 두지 않고, 설정의 테마 값 줄(→ 고르기 시트 · Popover)로만 바꿉니다.
- **도움말** — 금액 가리기 · 자동 기록 같은 설명은 Help Bubble(ⓘ)이고, 막힌 버튼의 이유("복사할 지난달 예산이 없어요.")는 버튼 가까운 글입니다.

### 알림 메시지 — Snackbar · Callout · Page Banner · Result Section

모양 · 쓰는 규칙은 `DESIGN.md` 의 같은 이름 절에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **오류** — 전역 오류 토스트(웹 · 앱)를 쓰지 않습니다. 대시보드 · 거래 · 자산 · 예산 · 통계 · 할 일 · 메모를 불러오지 못하면 그 자리에 Result Section(실패 + 다시 시도)을 둡니다 — "없어요" 로 보이지 않게 합니다. 거래 추가 시트의 저장 실패는 시트 맨 위 Callout `critical` 입니다.
- **토스트** — 거래 저장 · 삭제(되돌리기) · 옮김, 환불 뒤 "잔액 고치기"(6초)처럼 방금 한 일의 결과만 알립니다. 탭 바 · 플로팅 버튼 위 8 에 뜹니다. 시트 안에서 한 일은 시트가 닫힌 뒤에 알립니다.
- **안내 상자** — 예산 한도 초과 · 분할 합계 · 가져오기 안내는 Callout 톤으로 씁니다. 화면 소개 카드는 머리와 같은 말이면 두지 않습니다.
- **페이지 배너** — 증권 연결 끊김(연결 게이트 대신) · Pro 만료 예정 · 웹 새 버전에 씁니다.

### 시트 · 대화상자 · 확인창 · 팝오버

공통 정의는 `DESIGN.md` 의 같은 절에, 원본은 `specs/components/bottom-sheet.md` · `dialog.md` · `alert-dialog.md` · `popover.md` 에 있습니다. 표면 · 고른 색은 브랜드와 관계없이 같습니다.

- **폼 · 상세** — 한 부품(Responsive Dialog)이 1280 미만은 Bottom Sheet, 이상은 Dialog 로 띄웁니다.
- **거래 추가 · 수정 같은 입력 폼** — 바깥 누르기 · 끌어내리기로 닫히지 않습니다. 시트는 위 닫기 + 바닥 [저장], 대화상자는 바닥 [취소] [저장]입니다. 바뀐 값이 있으면 나가기 전에 "작성한 내용이 사라져요" 를 묻습니다.
- **삭제 · 되돌리기 확인** — Alert Dialog 입니다. 버튼은 동작 이름입니다(관심 그룹 "그룹 삭제" · 할부 정리 "되돌리기" — "확인" 을 쓰지 않습니다). 환불처럼 입력이 필요한 확인은 Dialog · 시트입니다.
- **날짜 · 시각 고르기** — 1280 미만은 시트(Input Button), 이상은 Popover 입니다.
- **증권사 연동** — 시트 첫 단계는 증권사 줄 목록이고, 줄을 누르면 같은 시트의 다음 단계(연결 · 해제)로 갑니다. 연결 성공은 그 증권사 단계에 머물고, 해제 성공은 첫 단계로 돌아갑니다(`specs/components/bottom-sheet.md` 의 두 단계 시트).

### Chart color (palette)

담다에서는 가계부 카테고리 · 수입 · 지출 추이 · 예산 이행 · 자산 구성 · 통계 열지도에 씁니다. 10색 × 2 모드이고, 쓰는 규칙은 `specs/components/chart.md` 에 있습니다.

#### Desk 쓰임

- **수입 · 지출** — 수입 `chart-blue` · 지출 `chart-red` 입니다(추이 · 막대 · 순저축). 홈의 수입 숫자도 같은 파랑입니다 — 브랜드 색과 섞지 않습니다.
- **카테고리** — 저장된 색(라이트 hex 이름표)을 먼저 쓰고, 색이 없는 카테고리는 그 차트에서 아직 쓰지 않은 색부터 씁니다. 10개를 넘으면 상위 9 + 회색 "기타" 입니다. 색에 뜻(초록 = 수입 · 갈색 = 기타)을 매기지 않습니다.
- **추이** — 수입 · 지출은 이중 축(왼쪽 수입 · 오른쪽 지출, 눈금 글자도 계열 색)이고, 위에 지표 타일 둘(합계 · 계열 켜고 끄기)을 둡니다. 가로축은 오늘에서 끝납니다.
- **도넛** — 가운데 합계는 원까지 쓰고, 범례는 카테고리 목록(금액 "원")입니다. 하위 카테고리가 있으면 눌러 하위로 갑니다.
- **열지도(요일 × 시간)** — 브랜드 채움 18 · 35 · 55 · 76 · 100% 다섯 단계입니다. 칸 폭 112 이상에서만 금액을 원까지 쓰고, 좁으면 세기 색만 둡니다. 글자 색은 단계마다 정합니다(라이트 76 · 100% 는 흰 글자).
- **예산 이행 · 자산 구성** — 계열 색은 차트 10색에서 고릅니다 — 다크 `bg-brand-solid`(카드 대비 1.73)를 계열 색으로 쓰지 않습니다.
- 메모 태그 · 캘린더 칩 같은 카테고리 면은 옅은 바탕(`chart-{색}-weak`)입니다.

### Avatar — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 Avatar · Avatar Stack 절과 `specs/components/avatar.md` 에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **사진이 없습니다** — 사람은 모두 이니셜 + 이름 색입니다. 사이드바 · 설정 · 더치페이가 같은 규칙입니다.
- **크기** — 더치페이 참가자 줄 · 캘린더 공유 멤버 · 사이드바 36, 설정의 계정 줄 42, 계정 화면 머리 80, 더치페이 목록의 참여자 묶음 24(앞 4명 + "+N")입니다.
- **더치페이 색** — 웹 · 앱이 한 규칙(코드 포인트 합 % 10 · 차트 10색 순서)으로 같은 사람에게 같은 색을 줍니다. 다크에서는 흰 이니셜(1.91 ~ 2.08) 대신 짙은 글자를 쓰고, 안 낸 사람은 흐리지 않고 배지 · 글로 보입니다.
- **캘린더 공유 멤버** — 권한은 아바타 + 권한 Badge(`outline`)로 보입니다.
- 자산 로고는 Logo Tile, 카테고리는 List 의 타일입니다 — 아바타가 아닙니다(아래 "이미지 — Desk").

### 날짜 · 시각 고르기 — Desk

모양 · 규칙은 공유 `DESIGN.md` 의 "날짜 · 시각 고르기" 절과 `specs/components/date-picker.md` · `time-picker.md` · `wheel-picker.md` 에 있습니다.

- 날짜 하나: 일정 시작 · 종료(종일이 아니면 + 시각 칸), 거래 날짜(+ 시각), 할 일 마감, 저축 기한, 반복 시작 · 종료일, 환불일(거래일 ~ 오늘)입니다.
- 기간(기간 달력 + 빠른 기간): 통계 · 가계부 필터 · 내보내기 · 검색입니다.
- 달만(연 · 월 휠): 예산 · 홈 · 카드 실적의 달입니다.
- 가계부 거래 점처럼 날짜 칸에 표시를 얹는 것은 피커가 아니라 가계부 · 캘린더 화면 격자의 일입니다.
- **캘린더 일정 칩(월 · 주 보기)** — 바탕 · 글은 `eventBadgeTone`(`chart-{색}-weak` 바탕 · `-contrast` 글)이고, 모서리 4 입니다(여러 날 일정의 이어지는 띠 조각이 벌어지지 않게). 시각은 "오전 8:00~오전 9:00" 입니다(구간은 붙여 씁니다 — International Design). 칩을 따로 부품으로 빼지 않습니다 — 색 · 글 · 모서리는 `eventBadgeTone` 한 곳이고, 높이(18 · 20 · 26)는 자리마다 다릅니다. 주 보기 칩은 월 보기 칩과 같은 색입니다.
- **데스크톱 월 격자** — 날 칸 전체가 누르는 자리입니다(누르면 그날을 고릅니다). 칸 안 일정 칩 20 은 WCAG 2.5.8 의 "같은 일을 하는 다른 큰 대상" 예외입니다 — 날 칸 전체가 그날을 고르고, 하루 패널의 44 줄에서 같은 일정을 엽니다(칩 사이가 2 라 간격 예외가 아닙니다).
- **캘린더 격자선** — 월 격자의 날 칸 선과 주 보기의 시간 격자선(시각 가로선 · 날 사이 세로선)은 모두 1px `stroke-neutral-subtle` 한 값입니다.
- **가계부 주 띠 · 월 격자 칸의 금액** — 칸에 원까지 쓴 금액이 들어가지 않으면 금액 대신 점("•" — 지출 · 수입 글색, 줄 높이 그대로)을 둡니다. 들어가는지는 자리수가 아니라 실제 폭으로 잽니다(글자 크기 설정 포함). 말줄임 · 만 단위 줄임은 쓰지 않습니다. 칸의 읽는 이름은 "11월 4일 (수), 지출 −1,234,567원, 수입 +400,000원" 입니다 — 점일 때도 원까지 읽고, 점은 읽지 않습니다. 가린 금액은 "금액 가림", 금액 없는 날은 날짜만 읽습니다.
- **가계부 기간 필터** — 데스크톱 · 태블릿은 작은 달력이 기간의 첫 달로 가고 ‹ › 는 기간 안에서만 움직입니다. 폰(웹 · 앱)은 보던 달 안에서만 거르고, 거르는 동안 달 줄의 월 이름을 숨깁니다 — 폰은 달 구조 그대로입니다.

### Field — Desk

공통 정의는 `DESIGN.md` 의 Field 절에, 원본은 `specs/components/field.md` 에 있습니다.

#### Desk 쓰임

- 거래 · 메모 · 할 일처럼 칸이 적은 폼은 필수가 적으면 필수 칸에만 점, 많으면 선택 칸에만 "선택" 을 답니다.
- 저장 버튼은 켜 두고, 누르면 칸마다 오류를 보입니다(금액 · 카테고리를 비우고 눌러도 무엇이 빠졌는지 보입니다). 송금액 · 계좌번호처럼 잘못 넣으면 위험한 칸만 칸을 떠날 때 바로 알립니다.
- 아래 시트 폼(거래 추가 · 할 일 추가)은 바깥 누름 · 끌어내림 · 뒤로가기로 닫힐 때 값이 바뀌었으면 "작성한 내용이 사라져요" 를 묻습니다.
- 키보드 — 오류 글은 칸 바로 아래, 저장 버튼은 시트 아래에 붙여 키보드 위에 보이게 합니다. 금액 `numeric` · 소수 `decimal` · 이메일 `email` · 전화 `tel` 키보드입니다.
- 글자 수 — 카테고리 이름(12) · 메모(100)처럼 최대가 있는 칸에만 보입니다.

### 기다림 — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 "기다림" 절에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **첫 진입** — 대시보드 · 가계부 · 자산 · 예산 · 통계는 머리 · 탭 · 섹션 제목을 그리고 데이터 자리만 스켈레톤입니다. 틀 없는 가운데 원이나 금액 자리 "—" 로 기다리지 않습니다.
- **달 · 기간 바꾸기** — 가계부 · 통계 · 예산 · 캘린더는 고른 달 이름을 바로 보이고 숫자 · 목록 자리만 기다립니다(옛 달 숫자는 지웁니다). 화면 통째 스켈레톤을 쓰지 않습니다.
- **당겨서 새로 고침(앱)** — 원판 없는 원 24 이고, 새로 받기가 끝날 때까지 돕니다. 보던 내용은 그대로 둡니다 — 목록을 비우지 않습니다.
- **원** — 섹션 새로 고침 · 카드 혜택 목록 끝은 24, 앱 업데이트 받기는 값 있는 원 24 입니다. 할 일 체크 원 위에 같은 색 호를 그리지 않습니다.
- **막대** — 예산 · 카드 사용은 한도, 저축 목표 · 카드 실적은 목표입니다 — 높이 8 · 채움 `fg-brand` 이고, 넘친 한도만 `fg-critical` + "N원 초과", 달성은 글자 "달성" 입니다. 카드 실적도 웹 · 앱이 같은 색입니다.
- **이미지** — 카드 그림 · 혜택 그림은 Image Frame 이 불러오는 동안 스켈레톤이고, 그림이 없거나 못 불러오면 아는 카드사는 카드 면 · 모르는 카드사는 대체 그림을 그립니다. 자산 로고는 Logo Tile 입니다 — 첫 글자를 먼저 보이고, 그림이 오면 덮습니다(아래 "이미지 — Desk").
- **끝 흐림** — 필터 칩 줄 · 2차 탭 · 카테고리 고르기 · 거래 상세처럼 넘칠 수 있는 시트 본문에 씁니다.
- **요청** — 앱은 읽기 요청을 2번까지 · 10초 안에서 다시 시도하고, 웹은 요청 제한 10초를 둡니다.

### 이미지 — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 "이미지 — Image Frame · Aspect Ratio · Logo Tile" 절과 `specs/components/image-frame.md` · `logo-tile.md` 에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **카드 그림** — 카드 혜택 격자 · 목록 56 · 상세 312 · 카드 추가 미리보기 68 · 카탈로그 목록 44 가 모두 카드 그림(1.586)입니다. 세로 그림은 시계 방향으로 돌립니다. 그림이 없는 카드는 아는 카드사의 면 · 모르는 카드사의 대체 그림입니다. 웹 상세 대화상자는 폭 312 이고, 그림 아래 카드 이름 글을 둡니다. 단종은 흐리지 않고 배지로 보입니다.
- **자산 로고** — 은행 · 증권 · 카드 · 코인 · 금 자산은 Logo Tile 입니다 — 자산 목록 · 계좌 관리 40, 자산 상세 48 입니다(계좌 · 투자 추가 폼에는 미리보기를 두지 않습니다). 카드 자산은 카드 그림(옅은 판 위 카드 전체)이 첫 글자를 덮습니다. 색은 저장된 자산 색이 아니라 기관 색 표에서 찾고, 기관이 없는 자산은 Avatar 의 이름 색입니다.
- **카테고리 타일** — 아이콘 20 이고, 없는 아이콘은 태그 아이콘, 이체 줄은 회색입니다(List).
- 가맹점 · 구독 줄은 카테고리 타일입니다. 첨부(영수증 사진) 썸네일은 Attachment Input 입니다(아래 "마무리 — Desk").

### 화면 틀 · 이동 — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 "화면 틀 · 이동" 절, Layout 의 "화면 틀" · "Safe Area" 절과 각 스펙(`specs/components/top-navigation.md` · `bottom-navigation.md` · `side-navigation.md` · `side-panel.md` · `pagination.md` · `table-pagination.md` · `floating-action-button.md`)에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **폰(앱 · 웹 768 미만)** — 상단 바: 탭 첫 화면(홈 · 가계부 · 캘린더 · 전체)은 큰 제목 + 오른쪽 아이콘(홈은 검색 · 알림, 나머지는 검색)이고, 그 아래 화면은 ← + 제목입니다(글 버튼은 "모두 읽음" 같은 것 하나). 하단 탭 바: 홈 · 가계부 · + · 캘린더 · 전체입니다 — 가운데 + 는 "거래 추가"(캘린더에서는 "일정 추가")이고, 앱도 이름을 답니다. 가계부 · 자산 · 통계 · 예산은 가계부 화면 위 Line Tabs 입니다(웹은 각자의 주소).
- **데스크톱(768 이상)** — 사이드바는 두 묶음(워크스페이스 · 기록)이고, 증권은 연결이 둘 이상이면 하위(나무증권 · 토스증권)를 펼치기만 합니다. 768 ~ 1279 는 접힌 사이드바입니다. 머리 56 은 왼쪽 검색칸(360 — 거래 검색 화면의 입구) + 주 버튼 "내역 추가" + 아이콘 버튼 둘(알림 · 설정)입니다 — 금액 가리기 눈은 머리에 두지 않고, 벨은 1280 이상 Popover · 미만 Bottom Sheet 입니다. 접기 버튼은 사이드바 머리에, 테마는 설정에 둡니다. 화면 제목은 본문 맨 위 h1(`text-screen-title` 26)이고, 모든 화면에 하나이며 제목 줄은 한 줄입니다.
- **목록** — 카드 혜택은 폰은 끝없이 불러오기(받는 중 · 다시 시도 · "카드를 모두 봤어요."), 데스크톱은 Pagination(쪽은 주소에, 넘기면 목록 맨 위)입니다. 가계부 거래는 달 하나가 한 쪽입니다 — 달 이동이 쪽 넘김입니다(`DESIGN.md` Layout "목록 넘기기").
- **떠 있는 버튼** — 할 일 · 메모 · 더치페이(폰 전체 화면)에만 둡니다. 56 · 화면 끝 20 + 안전 영역입니다. 탭 바가 있는 화면은 가운데 + 가 맡습니다.
- **알림 점** — 상단 바의 벨에 점만(숫자 없음) 브랜드 파랑으로 답니다.

### 입력 — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 "입력 — Slider · Toggle · Input OTP · Color Swatch · Icon Picker" 절과 각 스펙(`specs/components/slider.md` · `toggle.md` · `input-otp.md` · `color-swatch.md` · `icon-picker.md`)에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **예산 알림 임계값** — 설정 > 알림의 Slider 하나입니다(50 ~ 100 · 5 단위 — 눈금 없이 양 끝 표식). 머리 값은 "80%" 이고, 손을 뗄 때 한 번 저장하며 요청 중에도 막지 않습니다.
- **켜고 끄는 단추** — 관심 별(증권 종목 머리) · App Key 보기에 씁니다. 메모 고정은 이 단추가 아닙니다 — 밀기 · 상세 · 폼이 맡습니다. 모두 보이는 40 · 누르는 44 입니다(상단 바에 둔다면 44 · 24). 켬을 채운 노랑 별로 칠하지 않습니다 — 모으기 단추(관심 · 고정)는 굵기와 색으로만 가릅니다.
- **금액 가리기 눈** — 켜고 끄는 단추가 아닙니다. 홈 · 자산 순자산 카드의 눈은 누르면 금액 가리기 설정의 그 화면 묶음으로 가는 버튼입니다(이름 "금액 가리기 설정" · `aria-pressed` 없음 · 아이콘은 그 카드가 가려졌는지 — 가렸으면 `eye-off`, 순자산 카드 위는 흰 아이콘만). 상단 바(폰 탭 첫 화면 · 데스크톱 머리)에는 두지 않습니다.
- **Toggle Group 을 쓰지 않습니다** — 예산 금액 제안은 제안 칩, 일정 반복은 Select, 반복 요일은 Select(7개), 구독 결제 주기는 Segmented Control, 자산 기관 고르기는 List + Logo Tile, 일정 알림(5분 전 ~ 1일 전 다섯 — 여럿)은 Select 입니다. 계좌 거르기는 Chip(고른 것만 · 고른 것 빼고), 할 일 완료 원은 Checkbox, 할 일 미리보기 ↔ 편집(앱)은 Segmented Control 입니다.
- **콤보박스** — 칸에 바로 치는 콤보박스를 두지 않습니다. 카테고리는 Input Button 이 여는 아이콘 격자, 긴 목록은 Searchable List 입니다.
- **인증 코드** — 이용 해지의 본인 확인 "메일로 코드 받기" 하나에 씁니다. 코드 6자리 · 유효 10분 · 5번 · 다시 받기 60초(서버 규칙)를 설명 줄과 다시 받기 단추로 보입니다.
- **색** — 카테고리 · 저축 목표 · 캘린더 라벨 · 공유 캘린더 · 할 일 태그 · 메모 태그 · 메모의 색(웹 · 앱 8색)입니다. 새 항목은 쓰지 않은 첫 색(기본 지출 카테고리 여덟 다음은 갈색), 가져온 #9E9E9E 는 "지금 색", 색 없는 항목은 "자동" 입니다.
- **아이콘** — 카테고리(기본 태그) · 저축 목표(기본 돼지저금통)에 씁니다. 세트는 148개 · 13 묶음이고, 서버가 심은 `home` 은 세트의 집으로 보입니다.

### 펼치고 접기 · 나누기 — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 "펼치고 접기 · 나누기 — Accordion · Collapsible · Tree View · Resizable · Scroll Area · Scroll Auto Hide" 절과 각 스펙(`specs/components/accordion.md` · `collapsible.md` · `list.md` · `scroll-area.md` · `scroll-auto-hide.md`)에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다. 담다에는 나무(Tree View)와 나누기(Resizable)를 두지 않습니다 — 카테고리는 List 하위 줄이고, 메모 목록 ↔ 상세 나누기는 두지 않습니다. 우클릭 · 길게 누르기 메뉴도 두지 않습니다.

- **카드 혜택 상세** — 웹 대화상자 · 폰 서랍 · 앱 시트의 "혜택 상세 · N건" 은 Accordion `separated` + 모두 펼치기(누르는 44)입니다. 항목은 제목 = 카테고리 · 설명 = 요약(`fg-neutral-subtle` 500)이고, 상세가 없는 혜택은 그냥 줄입니다.
- **카드 상세 혜택 · 유의사항** — 웹 · 앱 모두 카드 안 `inline` 아코디언입니다(카드 머리 "혜택 · 12건" + 모두 펼치기). 혜택 상세 본문은 접어 둡니다. 긴 유의사항 제목은 말줄임 없이 줄을 바꿉니다.
- **거래 상세 · 분할** — 나눈 내역은 접지 않고 처음부터 다 보입니다. 총액이 바뀌어 나눈 합과 어긋나면 "빠르게 맞추기" 는 Callout(warning 톤) 안의 버튼입니다.
- **긴 글** — 잘린 글을 "자세히" · "더 보기" 로 펼치지 않습니다 — 자르지 않습니다.
- **카테고리** — 설정 > 카테고리는 List 하위 줄입니다 — 줄 앞 꺾쇠 단추 44 · 이름 "{카테고리} 하위 카테고리" + 펼침 상태 · 하위 줄 104 · 하위 없는 부모도 꺾쇠 자리를 비워 타일 52 · 처음 모두 펼침입니다. 줄은 편집을 열고, 접힌 부모 줄에 › 를 따로 두지 않습니다.
- **원장 머리** — 폰 가계부의 "소비 요약" 과 "월 달력" 은 하나만 펼칩니다(웹 · 앱 같습니다). 월 달력 단추의 이름은 "월 달력" 으로 고정합니다. 가계부 · 할 일 원장 머리의 위쪽(총액 · 비교 줄 · 소비 요약 — 할 일은 오늘 상태 · 별빛 · 밤하늘)은 Scroll Auto Hide 로 숨습니다 — 높이를 접지 않습니다. 달 이동 줄과 주 달력은 남고 고른 날이 맨 위 날짜 묶음을 따라가며, 필터 중에는 달 줄 + 필터 칩 줄이 남습니다(Scroll Auto Hide 의 "어디에 쓰나"). 날짜 묶음 머리는 날짜 규칙의 요일 형식 — "10월 25일 (일)" 이고, 다른 해면 표준형입니다.
- **스크롤** — 웹은 전역 6px 스크롤바에 Firefox 두 줄(`@supports` 안)을 더합니다. 폰 본문 · 시트의 세로 스크롤바는 숨기지 않고, 가로 줄만 숨깁니다. Radix ScrollArea · `.scroll` CSS 를 쓰지 않습니다. 앱 스크롤바는 막대 색 `stroke-neutral-solid` · 6 · 알약입니다.

### 마무리 — Desk

모양 · 쓰는 규칙은 `DESIGN.md` 의 "마무리 — Quantity Picker · Attachment Input · Footer" 절과 각 스펙(`specs/components/quantity-picker.md` · `attachment-input.md` · `footer.md`)에 있습니다. 여기에는 담다에서 쓰는 자리만 적습니다.

- **반복 거래 "총 n회"** — 숫자 칸입니다 — 흔한 값(24 · 36)이 열 단계보다 멀어 Quantity Picker 를 쓰지 않습니다. 상한은 웹 · 앱이 같습니다. 매월 반복 일자는 카드 결제일처럼 Select 1 ~ 31 이고, 할부는 Select 입니다.
- **거래 영수증 · 메모 첨부** — 거래 상세 · 메모 편집에 Attachment Input 타일을 둡니다(웹 · 앱). 서버(`EXPENSE_RECEIPT` · `MEMO_ATTACHMENT`)는 한 파일 10MB 이고 개수 한도가 없어, "n/최대" 를 그리지 않습니다.
- **데이터 가져오기** — 웹 1280 이상은 드롭존(1px 실선 · "파일을 여기로 끌어다 놓으세요" + "파일 선택")이고, 1280 미만 · 앱은 "파일 선택" 버튼 + 파일 카드입니다. 드롭존은 키보드로 닿아야 합니다. 거절은 전역 토스트가 아니라 칸 아래 오류 글로 알립니다.
- **바닥 · 저작권** — 담다 화면 · 앱에는 바닥을 두지 않습니다(처리방침 · 설명서는 설정의 줄). 담다 설명서(Docusaurus) 바닥의 저작권은 "© {해} 그루" 입니다.
- **Command** — 담다에는 Command(cmdk)를 두지 않습니다(`DESIGN.md` "Command" 절).

