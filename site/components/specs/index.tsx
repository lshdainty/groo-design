// 컴포넌트 페이지의 그림 자리 — 스펙 md 의 `[그림: 캡션](../../site/components/specs/<이름>.tsx#<id>)` 한 줄이
// scripts/gen-content.mjs 에서 <SpecFigure name id caption /> 가 되고, 여기서 그 그림을 찾아 그린다.
import type { ReactNode } from 'react';
import { accordionFigures } from './accordion';
import { alertDialogFigures } from './alert-dialog';
import { aspectRatioFigures } from './aspect-ratio';
import { attachmentInputFigures } from './attachment-input';
import { avatarFigures } from './avatar';
import { badgeFigures } from './badge';
import { bottomNavigationFigures } from './bottom-navigation';
import { bottomSheetFigures } from './bottom-sheet';
import { buttonFigures } from './button';
import { buttonGuideFigures } from './button-guides';
import { calloutFigures } from './callout';
import { cardFigures } from './card';
import { chartFigures } from './chart';
import { checkboxFigures } from './checkbox';
import { contentPlaceholderFigures } from './content-placeholder';
import { datePickerFigures } from './date-picker';
import { chipFigures } from './chip';
import { collapsibleFigures } from './collapsible';
import { colorSwatchFigures } from './color-swatch';
import { dialogFigures } from './dialog';
import { dividerFigures } from './divider';
import { fieldFigures } from './field';
import { floatingActionButtonFigures } from './floating-action-button';
import { footerFigures } from './footer';
import { helpBubbleFigures } from './help-bubble';
import { iconPickerFigures } from './icon-picker';
import { imageFrameFigures } from './image-frame';
import { inputFigures } from './input';
import { inputButtonFigures } from './input-button';
import { inputOtpFigures } from './input-otp';
import { listFigures } from './list';
import { logoTileFigures } from './logo-tile';
import { menuFigures } from './menu';
import { menuSheetFigures } from './menu-sheet';
import { notificationBadgeFigures } from './notification-badge';
import { popoverFigures } from './popover';
import { progressFigures } from './progress';
import { progressCircleFigures } from './progress-circle';
import { quantityPickerFigures } from './quantity-picker';
import { pageBannerFigures } from './page-banner';
import { paginationFigures } from './pagination';
import { radioGroupFigures } from './radio-group';
import { resizableFigures } from './resizable';
import { resultSectionFigures } from './result-section';
import { searchableListFigures } from './searchable-list';
import { selectFigures } from './select';
import { selectBoxFigures } from './select-box';
import { sideNavigationFigures } from './side-navigation';
import { sidePanelFigures } from './side-panel';
import { scrollAreaFigures } from './scroll-area';
import { scrollAutoHideFigures } from './scroll-auto-hide';
import { scrollFogFigures } from './scroll-fog';
import { skeletonFigures } from './skeleton';
import { sliderFigures } from './slider';
import { segmentedControlFigures } from './segmented-control';
import { snackbarFigures } from './snackbar';
import { swipeActionsFigures } from './swipe-actions';
import { switchFigures } from './switch';
import { tableFigures } from './table';
import { tagGroupFigures } from './tag-group';
import { tablePaginationFigures } from './table-pagination';
import { tabsFigures } from './tabs';
import { textareaFigures } from './textarea';
import { timePickerFigures } from './time-picker';
import { toggleFigures } from './toggle';
import { tooltipFigures } from './tooltip';
import { topNavigationFigures } from './top-navigation';
import { treeViewFigures } from './tree-view';
import { wheelPickerFigures } from './wheel-picker';
import { SpecSheet } from './spec-sheet';

const FIGURES: Record<string, Record<string, (p: { caption?: string }) => ReactNode>> = {
  accordion: accordionFigures,
  'alert-dialog': alertDialogFigures,
  'aspect-ratio': aspectRatioFigures,
  'attachment-input': attachmentInputFigures,
  avatar: avatarFigures,
  badge: badgeFigures,
  'bottom-navigation': bottomNavigationFigures,
  'bottom-sheet': bottomSheetFigures,
  button: { ...buttonFigures, ...buttonGuideFigures },
  callout: calloutFigures,
  card: cardFigures,
  chart: chartFigures,
  checkbox: checkboxFigures,
  'content-placeholder': contentPlaceholderFigures,
  'date-picker': datePickerFigures,
  chip: chipFigures,
  collapsible: collapsibleFigures,
  'color-swatch': colorSwatchFigures,
  dialog: dialogFigures,
  divider: dividerFigures,
  field: fieldFigures,
  'floating-action-button': floatingActionButtonFigures,
  footer: footerFigures,
  'help-bubble': helpBubbleFigures,
  'icon-picker': iconPickerFigures,
  'image-frame': imageFrameFigures,
  input: inputFigures,
  'input-button': inputButtonFigures,
  'input-otp': inputOtpFigures,
  list: listFigures,
  'logo-tile': logoTileFigures,
  menu: menuFigures,
  'menu-sheet': menuSheetFigures,
  'notification-badge': notificationBadgeFigures,
  popover: popoverFigures,
  progress: progressFigures,
  'progress-circle': progressCircleFigures,
  'quantity-picker': quantityPickerFigures,
  'page-banner': pageBannerFigures,
  pagination: paginationFigures,
  'radio-group': radioGroupFigures,
  resizable: resizableFigures,
  'result-section': resultSectionFigures,
  'searchable-list': searchableListFigures,
  select: selectFigures,
  'select-box': selectBoxFigures,
  'side-navigation': sideNavigationFigures,
  'side-panel': sidePanelFigures,
  'scroll-area': scrollAreaFigures,
  'scroll-auto-hide': scrollAutoHideFigures,
  'scroll-fog': scrollFogFigures,
  skeleton: skeletonFigures,
  slider: sliderFigures,
  'segmented-control': segmentedControlFigures,
  snackbar: snackbarFigures,
  'swipe-actions': swipeActionsFigures,
  switch: switchFigures,
  table: tableFigures,
  'tag-group': tagGroupFigures,
  'table-pagination': tablePaginationFigures,
  tabs: tabsFigures,
  textarea: textareaFigures,
  'time-picker': timePickerFigures,
  toggle: toggleFigures,
  tooltip: tooltipFigures,
  'top-navigation': topNavigationFigures,
  'tree-view': treeViewFigures,
  'wheel-picker': wheelPickerFigures,
};

export function SpecFigure({ name, id, caption }: { name: string; id: string; caption?: string }) {
  // `spec-sheet.tsx#<컴포넌트>` — 그 컴포넌트 YAML 의 규칙 전부(Specification)
  // data-figure — 그림 자리 표시(상자를 만들지 않는다 — contents). 그림 하나씩 찍거나 잴 때 찾는다
  if (name === 'spec-sheet')
    return (
      <div className="contents" data-figure={`spec-sheet#${id}`}>
        <SpecSheet component={id} />
      </div>
    );
  const F = FIGURES[name]?.[id];
  if (!F) throw new Error(`그림 ${name}#${id} 이 없다 — site/components/specs/${name}.tsx 의 figures 에 더한다`);
  return (
    <div className="contents" data-figure={`${name}#${id}`}>
      <F caption={caption} />
    </div>
  );
}

// 컴포넌트 개요 — 모든 컴포넌트를 카드 한 장씩 한 페이지에 모은다.
// 카드 그림은 `thumb`(라이트 모습 하나), 아직 없으면 대표 그림(`hero`)을 줄여 쓴다. 그림 안은 inert — 카드 전체가 링크다.
export function ComponentGallery({ items }: { items: { name: string; title: string }[] }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3" data-gallery>
      {items.map(({ name, title }) => {
        const Thumb = FIGURES[name]?.thumb;
        const Hero = FIGURES[name]?.hero;
        if (!Thumb && !Hero) throw new Error(`그림 ${name}#thumb · #hero 가 없다 — 개요 카드에 쓴다`);
        return (
          <div key={name} className="group relative flex flex-col gap-3">
            <div
              aria-hidden
              inert
              className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#eef0f1] transition-[filter] group-hover:brightness-[0.97]"
            >
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                {Thumb ? (
                  <Thumb />
                ) : (
                  <div className="w-[880px] max-w-none [zoom:0.42]">{Hero && <Hero />}</div>
                )}
              </div>
            </div>
            <a href={`/docs/components/${name}`} className="text-[17px] font-semibold text-fd-foreground after:absolute after:inset-0 after:rounded-xl">
              {title}
            </a>
          </div>
        );
      })}
    </div>
  );
}
