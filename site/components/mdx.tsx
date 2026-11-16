import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ComponentGallery, SpecFigure } from './specs';
import { FoundationGallery } from './foundations/gallery';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // 컴포넌트 페이지의 그림 자리(scripts/gen-content.mjs 의 FIGURE)
    SpecFigure,
    ComponentGallery,
    // 기초 개요(gen-content 의 "기초 개요")
    FoundationGallery,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
