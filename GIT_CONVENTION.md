# Git Convention

Groo Design System 저장소의 브랜치·커밋 규칙. CLAUDE.md의 토큰 작업 규칙(snapshot, lint, ≤5 토큰/배치)과 함께 적용한다 — 본 문서는 git 레이어만 다룬다.

## 브랜치

| 브랜치 | 용도 | 예시 |
|---|---|---|
| `main` | 안정 버전 — `npm run lint` 통과 + component 자동 검증 완료 상태만 머지 | — |
| `tokens/<카테고리>` | 토큰 추가·수정 (단일 카테고리 단위) | `tokens/typography`, `tokens/semantic`, `tokens/spacing` |
| `components/<이름>` | 컴포넌트 스펙 추가 | `components/button`, `components/input` |

카테고리·이름은 kebab-case. 한 브랜치는 한 카테고리/컴포넌트만 담는다 — 여러 카테고리를 묶지 않는다.

## 커밋 메시지

Conventional Commits 형식: `<type>(<scope>): <subject>`

### 사용 예시 (작성 시 이 패턴을 따른다)

```
feat(tokens): add typography scale (h1-h6, body, caption)
fix(tokens): adjust accent-hr lightness for AA contrast
docs(rationale): explain dual-brand neutral sharing
```

- `feat` — 신규 토큰·컴포넌트 추가
- `fix` — 색상값·치수 조정 (대비비 미달 보정 등)
- `docs` — prose·rationale 변경 (토큰 값 변경 없음)
- scope는 `tokens`(YAML 변경), `rationale`(prose-only) 등 변경의 *주 대상*

subject는 영어, 명령형 현재시제, 마침표 없음, 70자 이내.

## 머지 전 사전 점검

CLAUDE.md "변경 후" 규칙과 통합:

- [ ] `npm run lint` → **0 errors, 0 contrast warnings**
- [ ] `npm run diff` → `regression: false`
- [ ] 추가 토큰은 components 섹션에서 referenced (orphan 0건, contrast 자동 검증 활성)
- [ ] `DESIGN.history/v<N>-<이유>.md` 변경 전 백업 존재
- [ ] prose에 추가 이유 + lint 실측 결과 (손계산 단정 금지)

## 금지

- `--no-verify`로 hook 우회 금지
- `main`에 직접 commit 금지 — 항상 토픽 브랜치 경유
- 한 commit에 여러 카테고리 토큰 혼재 금지 (브랜치 분리 원칙과 동일)
- `--amend`로 머지된 commit 수정 금지 — 새 commit 생성

## 참고
- 토큰 작업 규칙: `CLAUDE.md`
- 산출물: `DESIGN.md` (Source of Truth)
- 백업: `DESIGN.history/`
