/*
 * Groo 기관 색 — 은행 · 증권 · 카드사 · 코인 · 금 기관마다 색 하나와 그 위 글자색(2026-10-04).
 * 원본은 specs/components/institution-colors.yaml 이다. 아래 표(INSTITUTION_COLORS)는 scripts/gen-institution-colors.mjs 가
 * 그 YAML 에서 만든다 — 손으로 고치지 않는다. 표를 바꾸려면 YAML 을 고치고 `npm run gen:institution-colors` 로 다시 만든다.
 * `npm run verify`(check:institution-colors)가 표와 YAML 이 어긋나면 멈춘다. 앱도 같은 YAML 에서 만든다.
 *
 * 쓰는 곳 — Logo Tile 의 첫 글자 타일(face="institution") · 그림 없는 카드의 면(Image Frame 의 CardArt).
 * 기관의 브랜드 색이라 디자인 토큰이 아니다 — 모드를 따르지 않는다(라이트 · 다크 같다). 브랜드 hex 를 화면 · 컴포넌트에 따로 적지 않는다.
 *
 *   institutionColor(name)  기관 이름 → 표의 한 줄(color · text …), 없으면 null. 웹 · 앱이 같은 순서로 찾는다(institution-colors.yaml)
 *     1. 찾는 이름과 표의 name · aliases 의 공백을 모두 뺀다
 *     2. name 또는 aliases 와 같으면 그 기관이다
 *     3. 아니면 찾는 이름에 들어 있는 name · aliases 가운데 가장 긴 것("NH농협카드 올원" → NH농협카드). 대소문자는 그대로 견준다.
 *        길이가 같으면 표에서 먼저 나온 기관이다. 표의 이름이 찾는 이름을 품는 거꾸로 맞추기("NH농협" ↔ "NH농협카드")는 하지 않는다
 *     4. 없으면 null — Logo Tile 은 Avatar 의 이름 색, 카드 면은 Content Placeholder(credit-card)
 *     기관 이름(자산의 기관 · 카드의 카드사)으로만 찾는다 — 사용자가 지은 자산 이름 · HR 회사 이름으로 찾지 않는다
 *     (짧은 별칭 "우리" · "하나" · "국민" · "기업" 이 "우리 아이 적금" · "하나투어" 에 걸린다).
 *
 * 글자색(text) — white 는 static-white(그 색 위 흰 글자가 4.5:1 이상), dark 는 라이트 fg-neutral · 다크 fg-neutral-inverted
 * (면이 모드를 따르지 않으므로 두 모드 모두 짙은 글자). 78곳 모두 4.52:1 이상이다. ci 는 대비를 맞추려 명도를 고친 곳의 원래 색이다.
 */

export type InstitutionText = "white" | "dark";

export interface InstitutionColor {
  /** 기관 이름 — 표의 대표 이름 */
  readonly name: string;
  /** 묶음 — 시중은행 · 인터넷은행 · 증권사 · 카드사 … */
  readonly category: string;
  /** 별칭 — 같은 기관으로 찾는 다른 이름 */
  readonly aliases: readonly string[];
  /** 면 색(hex) — 모드를 따르지 않는다 */
  readonly color: string;
  /** 대비를 맞추려 명도를 고친 곳의 원래 색(hex) */
  readonly ci?: string;
  /** 면 위 글자색 — white(static-white) · dark(라이트 fg-neutral · 다크 fg-neutral-inverted) */
  readonly text: InstitutionText;
}

// @generated:start (institution-colors.yaml — scripts/gen-institution-colors.mjs 가 만든다, 손으로 고치지 않는다)
export const INSTITUTION_COLORS: readonly InstitutionColor[] = [
  // ── 시중은행 ──────────────────────────────────────────
  { name: "신한", category: "시중은행", aliases: ["신한은행"], color: "#0046FF", text: "white" }, // 6.33
  { name: "KB국민", category: "시중은행", aliases: ["KB", "국민", "KB국민은행"], color: "#FFBC00", text: "dark" }, // 9.73 / 8.59
  { name: "우리", category: "시중은행", aliases: ["우리은행"], color: "#0067AC", text: "white" }, // 5.94
  { name: "하나", category: "시중은행", aliases: ["KEB하나", "하나은행"], color: "#008485", text: "white" }, // 4.53
  { name: "NH농협", category: "시중은행", aliases: ["농협", "NH농협은행"], color: "#00A651", text: "dark" }, // 5.14 / 4.54
  { name: "IBK기업", category: "시중은행", aliases: ["기업", "IBK", "기업은행"], color: "#004098", text: "white" }, // 9.60
  { name: "SC제일", category: "시중은행", aliases: ["제일", "SC", "SC제일은행"], color: "#1EA54E", ci: "#009A44", text: "dark" }, // 5.12 / 4.52 — AA 보정(ΔE2000 3.7)
  { name: "씨티", category: "시중은행", aliases: ["시티", "씨티은행", "한국씨티"], color: "#056DAE", text: "white" }, // 5.52
  // ── 인터넷은행 ────────────────────────────────────────
  { name: "카카오뱅크", category: "인터넷은행", aliases: ["카뱅"], color: "#FEE500", text: "dark" }, // 12.84 / 11.33
  { name: "토스뱅크", category: "인터넷은행", aliases: ["토스"], color: "#0064FF", text: "white" }, // 4.92
  { name: "케이뱅크", category: "인터넷은행", aliases: ["K뱅크", "K Bank"], color: "#0214A1", text: "white" }, // 12.98
  // ── 지방은행 ──────────────────────────────────────────
  { name: "부산", category: "지방은행", aliases: ["부산은행", "BNK부산"], color: "#0033A0", text: "white" }, // 10.60
  { name: "대구", category: "지방은행", aliases: ["대구은행", "iM뱅크", "DGB대구"], color: "#1464AC", text: "white" }, // 6.09
  { name: "경남", category: "지방은행", aliases: ["경남은행", "BNK경남"], color: "#0E4C92", text: "white" }, // 8.51
  { name: "광주", category: "지방은행", aliases: ["광주은행", "JB광주"], color: "#00428A", text: "white" }, // 9.78
  { name: "전북", category: "지방은행", aliases: ["전북은행", "JB전북"], color: "#0F3E8C", text: "white" }, // 10.06
  { name: "제주", category: "지방은행", aliases: ["제주은행"], color: "#F47216", text: "dark" }, // 5.68 / 5.01
  // ── 특수은행 ──────────────────────────────────────────
  { name: "KDB산업", category: "특수은행", aliases: ["산업", "산업은행", "KDB"], color: "#004098", text: "white" }, // 9.60
  { name: "수출입", category: "특수은행", aliases: ["수출입은행", "EXIM"], color: "#003A6C", text: "white" }, // 11.53
  { name: "수협", category: "특수은행", aliases: ["수협은행", "Sh수협"], color: "#003DA5", text: "white" }, // 9.50
  // ── 저축기관 ──────────────────────────────────────────
  { name: "우체국", category: "저축기관", aliases: ["우체국예금", "우체국금융"], color: "#E4002B", text: "white" }, // 4.85
  { name: "새마을금고", category: "저축기관", aliases: ["새마을", "MG"], color: "#D61E29", text: "white" }, // 5.15
  { name: "신협", category: "저축기관", aliases: ["신용협동조합"], color: "#003A70", text: "white" }, // 11.42
  { name: "산림조합", category: "저축기관", aliases: ["산림조합중앙회"], color: "#2E7D32", text: "white" }, // 5.13
  { name: "SBI저축", category: "저축기관", aliases: ["SBI저축은행", "SBI"], color: "#0E3E85", text: "white" }, // 10.26
  { name: "OK저축", category: "저축기관", aliases: ["OK저축은행"], color: "#FECC00", text: "dark" }, // 10.83 / 9.56
  { name: "웰컴저축", category: "저축기관", aliases: ["웰컴저축은행"], color: "#E30613", text: "white" }, // 4.88
  { name: "페퍼저축", category: "저축기관", aliases: ["페퍼저축은행", "Pepper"], color: "#B3002D", text: "white" }, // 7.11
  // ── 외국계 ────────────────────────────────────────────
  { name: "HSBC", category: "외국계", aliases: ["홍콩상하이", "에이치에스비씨"], color: "#DB0011", text: "white" }, // 5.22
  { name: "ICBC", category: "외국계", aliases: ["공상은행", "중국공상은행"], color: "#D6001C", text: "white" }, // 5.42
  { name: "BoA", category: "외국계", aliases: ["뱅크오브아메리카", "Bank of America"], color: "#012169", text: "white" }, // 14.76
  { name: "도이치", category: "외국계", aliases: ["도이치뱅크", "Deutsche"], color: "#004A8F", text: "white" }, // 8.84
  { name: "JP모건", category: "외국계", aliases: ["JPMorgan", "JP모건체이스"], color: "#006CB7", text: "white" }, // 5.48
  // ── 기타 ──────────────────────────────────────────────
  { name: "현금", category: "기타", aliases: ["지갑", "Cash"], color: "#64748B", text: "white" }, // 4.76
  // ── 증권사 ────────────────────────────────────────────
  { name: "삼성증권", category: "증권사", aliases: ["삼성"], color: "#1428A0", text: "white" }, // 11.41
  { name: "미래에셋", category: "증권사", aliases: ["미래에셋증권"], color: "#2C3E50", text: "white" }, // 10.98
  { name: "NH투자", category: "증권사", aliases: ["NH투자증권"], color: "#00A651", text: "dark" }, // 5.14 / 4.54
  { name: "한국투자", category: "증권사", aliases: ["한투", "한국투자증권"], color: "#00529B", text: "white" }, // 7.84
  { name: "KB증권", category: "증권사", aliases: [], color: "#FFBC00", text: "dark" }, // 9.73 / 8.59
  { name: "신한투자", category: "증권사", aliases: ["신한금융투자", "신한투자증권"], color: "#0046FF", text: "white" }, // 6.33
  { name: "하나증권", category: "증권사", aliases: [], color: "#008485", text: "white" }, // 4.53
  { name: "키움증권", category: "증권사", aliases: ["키움"], color: "#ED022F", ci: "#FF0033", text: "white" }, // 4.52 — AA 보정(ΔE2000 3.8)
  { name: "메리츠증권", category: "증권사", aliases: ["메리츠", "메리츠종합금융증권"], color: "#E60012", text: "white" }, // 4.80
  { name: "대신증권", category: "증권사", aliases: ["대신"], color: "#F58220", text: "dark" }, // 6.33 / 5.59
  { name: "유안타증권", category: "증권사", aliases: ["유안타", "동양"], color: "#10B981", text: "dark" }, // 6.47 / 5.71
  { name: "유진투자", category: "증권사", aliases: ["유진투자증권"], color: "#003595", text: "white" }, // 10.81
  { name: "교보증권", category: "증권사", aliases: ["교보"], color: "#004A8F", text: "white" }, // 8.84
  { name: "IBK투자", category: "증권사", aliases: ["IBK투자증권"], color: "#004098", text: "white" }, // 9.60
  { name: "DB금융투자", category: "증권사", aliases: ["DB", "DB금투"], color: "#008456", text: "white" }, // 4.74
  { name: "SK증권", category: "증권사", aliases: ["SK"], color: "#EA002C", text: "white" }, // 4.63
  { name: "현대차증권", category: "증권사", aliases: ["현대차", "HMC투자"], color: "#002C5F", text: "white" }, // 13.77
  { name: "하이투자", category: "증권사", aliases: ["하이투자증권"], color: "#004098", text: "white" }, // 9.60
  { name: "한화투자", category: "증권사", aliases: ["한화투자증권", "한화"], color: "#FF7900", text: "dark" }, // 6.24 / 5.51
  { name: "BNK투자", category: "증권사", aliases: ["BNK투자증권"], color: "#0033A0", text: "white" }, // 10.60
  { name: "한양증권", category: "증권사", aliases: ["한양"], color: "#004098", text: "white" }, // 9.60
  { name: "LS증권", category: "증권사", aliases: ["이베스트", "이베스트투자", "E-best"], color: "#005EB8", text: "white" }, // 6.38
  { name: "부국증권", category: "증권사", aliases: ["부국"], color: "#003366", text: "white" }, // 12.61
  { name: "신영증권", category: "증권사", aliases: ["신영"], color: "#005EB8", text: "white" }, // 6.38
  { name: "카카오페이증권", category: "증권사", aliases: ["카카오페이"], color: "#FEE500", text: "dark" }, // 12.84 / 11.33
  { name: "토스증권", category: "증권사", aliases: [], color: "#0064FF", text: "white" }, // 4.92
  // ── 상품거래소 ────────────────────────────────────────
  { name: "KRX 금시장", category: "상품거래소", aliases: ["한국거래소", "KRX", "금시장"], color: "#C9A227", text: "dark" }, // 6.79 / 5.99
  { name: "한국금거래소", category: "상품거래소", aliases: ["koreagoldx", "금거래소"], color: "#B8232F", text: "white" }, // 6.33
  { name: "한국표준금거래소", category: "상품거래소", aliases: ["표준금거래소"], color: "#8C6A1F", text: "white" }, // 5.00
  { name: "삼성금거래소", category: "상품거래소", aliases: ["삼성금"], color: "#1428A0", text: "white" }, // 11.41
  { name: "한국조폐공사", category: "상품거래소", aliases: ["조폐공사", "오롯", "KOMSCO"], color: "#00594F", text: "white" }, // 8.26
  { name: "기타 금은방", category: "상품거래소", aliases: ["금은방", "직접보관", "실물"], color: "#AF8A4E", ci: "#A78246", text: "dark" }, // 5.13 / 4.53 — AA 보정(ΔE2000 2.8)
  // ── 가상자산 ──────────────────────────────────────────
  { name: "업비트", category: "가상자산", aliases: ["Upbit", "UPBIT", "두나무"], color: "#1F55F4", text: "white" }, // 5.73
  { name: "빗썸", category: "가상자산", aliases: ["Bithumb", "BITHUMB"], color: "#F2811D", text: "dark" }, // 6.20 / 5.47
  { name: "코인원", category: "가상자산", aliases: ["Coinone", "COINONE"], color: "#F95B2A", ci: "#F55826", text: "dark" }, // 5.13 / 4.52 — AA 보정(ΔE2000 1.1)
  { name: "코빗", category: "가상자산", aliases: ["Korbit", "KORBIT"], color: "#1D3FFF", text: "white" }, // 6.55
  // ── 카드사 ────────────────────────────────────────────
  { name: "신한카드", category: "카드사", aliases: [], color: "#0046FF", text: "white" }, // 6.33
  { name: "KB국민카드", category: "카드사", aliases: [], color: "#FFBC00", text: "dark" }, // 9.73 / 8.59
  { name: "우리카드", category: "카드사", aliases: [], color: "#0067AC", text: "white" }, // 5.94
  { name: "하나카드", category: "카드사", aliases: [], color: "#008485", text: "white" }, // 4.53
  { name: "NH농협카드", category: "카드사", aliases: [], color: "#00A651", text: "dark" }, // 5.14 / 4.54
  { name: "삼성카드", category: "카드사", aliases: [], color: "#1428A0", text: "white" }, // 11.41
  { name: "현대카드", category: "카드사", aliases: [], color: "#1C2951", text: "white" }, // 14.14
  { name: "롯데카드", category: "카드사", aliases: [], color: "#EA1721", ci: "#ED1C24", text: "white" }, // 4.52 — AA 보정(ΔE2000 0.9)
];
// @generated:end

// 공백을 모두 뺀다 — 찾는 이름과 표의 name · aliases 모두
const squash = (value: string) => value.replace(/\s+/g, "");

// 기관마다 찾는 열쇠(name · aliases, 공백을 뺀) — 표 순서 그대로
const KEYS = INSTITUTION_COLORS.map((entry) => ({ entry, keys: [entry.name, ...entry.aliases].map(squash).filter((key) => key !== "") }));

/** 기관 이름 → 기관 색 표의 한 줄(color · text …). 같은 이름 · 별칭, 아니면 든 가장 긴 이름, 없으면 null */
function institutionColor(name: string | null | undefined): InstitutionColor | null {
  const query = squash(name ?? "");
  if (query === "") return null;
  for (const { entry, keys } of KEYS) if (keys.includes(query)) return entry;
  let found: InstitutionColor | null = null;
  let longest = 0;
  for (const { entry, keys } of KEYS) {
    for (const key of keys) {
      if (key.length > longest && query.includes(key)) {
        found = entry;
        longest = key.length;
      }
    }
  }
  return found;
}

export { institutionColor };
