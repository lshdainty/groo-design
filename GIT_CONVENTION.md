# Git Convention

Groo Design 저장소의 브랜치 · 커밋 규칙입니다. 토큰 · 문서 작성 규칙은 `CLAUDE.md` 에 있고, 이 문서는 git 레이어만 다룹니다.

## 브랜치

| 브랜치 | 용도 | 예시 |
|---|---|---|
| `main` | 배포되는 상태 — 검사를 모두 통과한 변경만 머지합니다 | — |
| `tokens/<카테고리>` | 토큰 추가 · 수정(카테고리 하나) | `tokens/typography`, `tokens/semantic` |
| `components/<이름>` | 컴포넌트 스펙 추가 · 수정(컴포넌트 하나) | `components/button`, `components/input` |
| `docs/<주제>` | 문서만 고칠 때 | `docs/official-style` |

이름은 kebab-case 로 씁니다. 한 브랜치에는 한 카테고리 · 컴포넌트만 담습니다.

## 커밋 메시지

Conventional Commits 형식 `<type>(<scope>): <subject>` 를 씁니다.

```
feat(tokens): add typography scale
fix(tokens): adjust brand-600 for AA contrast
docs(spec): clarify date picker keyboard rules
```

- `feat` — 토큰 · 컴포넌트 추가
- `fix` — 값 · 치수 조정(대비 미달 보정 등)
- `docs` — 문서만 변경(토큰 값 변경 없음)
- scope 는 변경의 주 대상입니다 — `tokens`(YAML 머리말), `spec`(컴포넌트 스펙), `site`(문서 사이트)

변경 이유와 검토 기록은 커밋 · PR 본문에 적습니다. 문서 본문에는 적지 않습니다.

## 머지 전 점검

- [ ] `npm run verify` 통과(동기 · lint · 대비 · 문서 규칙)
- [ ] `npm run diff` → `regression: false`
- [ ] 추가한 토큰을 컴포넌트에서 참조합니다(쓰지 않는 토큰 0건)
- [ ] 문서 사이트 빌드 통과(`cd site && npm run build`)

## 금지

- `--no-verify` 로 hook 을 건너뛰지 않습니다.
- `main` 에 직접 커밋하지 않습니다 — 항상 토픽 브랜치를 거칩니다.
- 한 커밋에 여러 카테고리의 토큰을 섞지 않습니다.
- 머지된 커밋을 `--amend` 로 고치지 않습니다 — 새 커밋을 만듭니다.
