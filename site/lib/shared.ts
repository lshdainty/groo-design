import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Groo Design';
export const docsRoute = '/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'lshdainty',
  repo: 'groo-design',
  branch: 'main',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

// 생성 페이지는 원본 파일(레포 루트 기준)을, 손으로 쓴 페이지는 자기 자신을 가리킨다.
export function getSourceUrl(page: { path: string; data: { source?: string } }) {
  const file = page.data.source ?? `site/content/docs/${page.path}`;
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${file}`;
}
