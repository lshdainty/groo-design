import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ComponentGallery, SpecFigure } from './specs';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // 컴포넌트 페이지의 그림 자리(scripts/gen-content.mjs 의 FIGURE)
    SpecFigure,
    ComponentGallery,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
