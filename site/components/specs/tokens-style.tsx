// 컴포넌트 페이지의 그림이 사이트의 라이트 · 다크 전환을 따르게 — groo 색 토큰을 CSS 변수로 깐다.
// `--p-<토큰>`(Desk 값) · `--p-hr-<토큰>`(HR 에서 값이 다른 브랜드 토큰만). `.dark`(fumadocs 의 다크)면 `-dark` 짝으로 바뀐다.
// 그림은 색을 hex 대신 이 변수로 쓴다(kit 의 rc — 모드를 정하지 않으면 변수).
import { design, proseValue } from '@/lib/design-tokens';
import { loadingCss } from './loading-look';
import { scrollAreaCss } from './collapse-look';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// specs/components/*.yaml 에서 { value: $color-a, dark: $color-b }(a ≠ b) 짝을 모은다
function pairsInSpecs() {
  const dir = join(process.cwd(), '..', 'specs', 'components');
  const seen = new Map<string, [string, string, string]>();
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.yaml'))) {
    for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/value: \$color-([a-z0-9-]+), dark: \$color-([a-z0-9-]+)/g)) {
      if (m[1] !== m[2]) seen.set(`${m[1]}--${m[2]}`, [f, m[1], m[2]]);
    }
  }
  return [...seen.values()];
}

function build() {
  const desk = design('desk').front.colors;
  const hr = design('hr').front.colors;
  const light: string[] = [];
  const dark: string[] = [];
  for (const name of Object.keys(desk)) {
    if (name.endsWith('-dark')) continue;
    light.push(`--p-${name}:${desk[name]}`);
    dark.push(`--p-${name}:${desk[`${name}-dark`] ?? desk[name]}`);
    if (hr[name] && (hr[name] !== desk[name] || (hr[`${name}-dark`] ?? hr[name]) !== (desk[`${name}-dark`] ?? desk[name]))) {
      light.push(`--p-hr-${name}:${hr[name]}`);
      dark.push(`--p-hr-${name}:${hr[`${name}-dark`] ?? hr[name]}`);
    }
  }
  // 컴포넌트 YAML 의 { value: $color-a, dark: $color-b } — 다크만 다른 토큰을 쓰는 자리(Segmented 안 고른 글 …)
  for (const [, a, b] of pairsInSpecs()) {
    light.push(`--p-pair-${a}--${b}:${desk[a]}`);
    dark.push(`--p-pair-${a}--${b}:${desk[`${b}-dark`] ?? desk[b]}`);
  }
  light.push(`--p-overlay-dim:${proseValue('overlay-dim-light')}`);
  dark.push(`--p-overlay-dim:${proseValue('overlay-dim-dark')}`);
  for (const n of [1, 2, 3, 4]) {
    light.push(`--p-shadow-s${n}:${proseValue(`shadow-s${n}`)}`);
    dark.push(`--p-shadow-s${n}:${proseValue(`shadow-s${n}-dark`)}`);
  }
  // 스켈레톤 반짝임 띠(v104) — 라이트 · 다크 짝
  light.push(`--p-gradient-shimmer-neutral:${proseValue('gradient-shimmer-neutral')}`);
  dark.push(`--p-gradient-shimmer-neutral:${proseValue('gradient-shimmer-neutral-dark')}`);
  // 그림 속 기기 틀 · 브라우저 창 — 토큰이 아니라 그림 장식
  light.push('--p-frame:#1A1F2E', '--p-chrome:#E4E6EB', '--p-chrome-url:#F5F6FA');
  dark.push('--p-frame:#3A3F4C', '--p-chrome:#2B303D', '--p-chrome-url:#1E222C');
  // 기다림 묶음의 움직임(Progress Circle · Skeleton — 버튼의 로딩 원도 이것) — 시간 · 곡선은 YAML 에서(loading-look)
  // Scroll Area 그림의 스크롤바 · 초점 링(scroll-area.yaml — collapse-look 의 scrollAreaCss) — 그림 상자(.psa)에만
  return `:root{${light.join(';')}}.dark{${dark.join(';')}}${loadingCss()}${scrollAreaCss()}`;
}

let css: string | undefined;
export function GrooTokenStyle() {
  css ??= build();
  return <style id="groo-tokens" dangerouslySetInnerHTML={{ __html: css }} />;
}
