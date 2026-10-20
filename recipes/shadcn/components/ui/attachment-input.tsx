import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type Modifier,
  type PointerSensorOptions,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { File as FileIcon, FileSpreadsheet, FileText, ImageIcon, Paperclip, RotateCw, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useField, useFieldGroup, useFieldGroupState } from "@/components/ui/field";
import { useInputButtonSurface } from "@/components/ui/input-button";
import { ResponsiveMenu, ResponsiveMenuContent, ResponsiveMenuGroup, ResponsiveMenuItem, ResponsiveMenuTrigger } from "@/components/ui/menu";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { ScrollFog } from "@/components/ui/scroll-fog";

/*
 * Groo Attachment Input — 구조는 SEED Attachment Input(2026-10-15, rootage attachment-input · -trigger · -item · -item-action-button ·
 * -item-remove-button · -dropzone, qvism-preset recipe, React AttachmentField). 수치 원본은 specs/components/attachment-input.yaml.
 * 사진 · 파일을 골라 붙이는 칸. 사람의 프로필 사진은 Avatar 의 "사진 바꾸기", 붙은 사진을 보이기만 하는 자리는 Image Frame 이다.
 *
 *   AttachmentInput  제어 컴포넌트 — 항목 목록(entries)은 쓰는 쪽이 쥐고, 올리기 요청과 상태도 쓰는 쪽이 바꾼다
 *     entries(필수)          AttachmentEntry[] — 줄에 놓인 항목
 *     onFilesAccept(added)(필수)  검사를 통과한 새 항목(상태 "pending") — 한 번 고른 것을 한 번에
 *     onRemove(id)(필수)     × — 묻지 않고 지운다(되돌리기는 다시 고르기)
 *     onRetry(id)            실패한 항목의 "다시 시도"
 *     onFilesReject(rejections)  한 번 고른 것 가운데 거절된 것 모두를 한 번에 — Field 오류 글로 이유마다 한 문장(토스트가 아니다).
 *                            같은 고르기면 onFilesAccept 다음에 부른다(붙이며 오류 글을 지워도 거절 글이 남는다)
 *     onReorder(next)        주면 항목을 끌어 · 키보드로 · 항목 메뉴로 순서를 바꾼다(dnd-kit — @dnd-kit/core · /sortable). 바뀐 목록을 돌려준다
 *     onPreview(id)          주면 사진 메뉴에 "크게 보기" — 크게 보이는 자리는 쓰는 쪽이 연다
 *     layout                 tile(기본 — 첨부 타일 + 항목 줄) · dropzone(파일 하나를 골라 바로 넘기는 자리 — 1280 이상 웹은 드롭존,
 *                            1280 미만은 "파일 선택" 버튼 large · 칸 폭 · 앞 아이콘 upload. 고른 파일은 아래 파일 카드)
 *     accept                 고르기 창의 편의 + 다시 검사(MIME image/png · image/* · 확장자 .csv 를 쉼표로)
 *     maxFiles               기본 1(SEED). Infinity 면 개수를 그리지 않는다 — "n/최대" 를 쓰려면 서버의 개수 한도부터 정한다
 *     maxFileSize            바이트 — 넘으면 FILE_TOO_LARGE
 *     badgeLabel             주면 첫 사진에 띠("대표")
 *     disabled · readOnly    Field 안이면 Field 의 값을 받는다. 막힘은 새로 고르지 못하고 × 도 막히며 값을 내지 않는다.
 *                            읽기 전용은 타일 · × · 순서 바꾸기가 막히고 붙인 것은 그대로 보이며 값은 낸다(흐리게 하지 않는다)
 *     name                   고른 파일(entries 의 file)을 숨은 <input type="file"> 에 맞춰 폼에 낸다
 *     triggerLabel           타일 이름의 앞 — 기본은 Field 라벨("영수증" → "영수증 첨부, 3/10")
 *   AttachmentEntry · AttachmentRejection · formatFileSize(bytes) — "9.8MB"(B · KB · MB, MB 는 소수 한 자리, 띄어 쓰지 않는다)
 *
 * 항목의 모양은 파일 종류가 정한다 — 사진(image/*)은 80 썸네일, 그 밖은 160 × 80 파일 카드이고 한 줄에 섞인다.
 *   사진은 그림 위에 투명 윤곽 1px stroke-neutral-overlay(v118), 파일 카드는 1px stroke-neutral-weak + 썸네일 칸 48(bg-neutral-weak ·
 *   모서리 8 · 아이콘 24 fg-neutral-subtle — PDF file-text · 표 file-spreadsheet · 그 밖 file) + 이름(t2 12 / 16 · 500 · 폭 70) + 크기
 *   (t1 11 / 15 · fg-neutral-subtle). 모서리 12 · 높이 80.
 * 파일 이름 — 글자 단위로 줄을 바꾸고(break-all — SEED, 사용자 결정 11D) 네 줄까지 보인다. 첫 줄만 오른쪽 4 를 비운다(× 구멍 —
 *   YAML name.maskClear). 넘치면 셋째 줄 끝을 "…" 로 줄이고 넷째 줄에 확장자를 남긴다
 *   (보이지 않는 같은 글로 줄 수를 재고 — 글꼴이 늦게 와도 ResizeObserver 가 다시 잰다). 보조 기술은 늘 전체 이름을 읽는다.
 * × — 20 원(bg-layer-default · 안쪽 1px stroke-neutral-weak · lucide x 10 선 2.5 fg-neutral)이 항목 모서리 밖으로 위 4 · 오른쪽 4 걸친다.
 *   항목은 × 둘레를 지름 24 로 파낸다(가운데가 모서리에서 안쪽 6 — mask 의 radial-gradient). 누르는 자리 44(보이지 않는 여백 12 씩).
 *   × 는 항목의 형제다 — 순서를 바꿀 수 있는 항목(role="button")안에 단추를 두지 않는다. "다시 시도" 도 형제로 항목 위에 겹친다.
 * 상태 — pending · success 는 보통 모습. uploading 은 값 있는 원 24(사진 — 딤 overlay-dim 라이트 0.50 · 다크 0.65 위 staticWhite,
 *   파일 — 썸네일 칸에서 아이콘 대신 neutral). 진행(progress 0 ~ 1)이 10초 동안 멈추면 실패로 보인다(Skeleton 의 요청 제한 —
 *   쓰는 쪽의 status 는 그대로, 다시 시도를 누르면 onRetry). error 는 덮개 + "다시 시도"(rotate-cw 24 + t2 500 — 사진은 검정 65% 덮개 ·
 *   static-white, 파일은 썸네일 · 이름 자리를 채운다 · fg-neutral-subtle). 실패 · 대표 띠의 덮개는 두 모드 모두 65%.
 * 대표 띠 — 첫 사진 아래 24(검정 65% · 좌우 4 · 아래 두 모서리 12) · static-white t2 500 한 줄. 순서를 바꾸면 새 첫 사진으로 옮겨 간다.
 * 순서 바꾸기(onReorder) — 마우스 · 펜은 누른 채 8px 넘게 움직이면, 터치는 250ms 누른 채 움직이면 든다(그 전에 움직이면 줄이 가로로
 *   스크롤한다 — 누르기(메뉴)와 끌기를 가르는 문턱, YAML item.dragStart). 키보드는 항목에서 Space 로
 *   들고 ← → 로 옮긴 뒤 Space · Enter 로 놓는다 · Esc 는 그만두기(처음 자리로). 읽기 글은 한국어(dnd-kit announcements). 끄는 항목은
 *   2px 줄어든 채 따라가고 × 와 구멍이 사라진다. 사진은 불투명도 0.5, 파일 카드는 글 · 아이콘이 fg-disabled(SEED 그대로 — 사용자
 *   결정 13B, v106 의 예외). 읽기 전용도 같다(사진 0.5 · 파일 글 fg-disabled).
 * 항목 메뉴(사용자 결정 14A — WCAG 2.5.7 포인터 한 번 길) — onReorder · onPreview 가운데 하나라도 주면 항목을 누르거나 Enter 로
 *   1280 이상 Menu(aria-label = 파일 이름) · 미만 Menu Sheet(머리 = 파일 이름)를 연다(ResponsiveMenu): 크게 보기(파일 카드는 "열기" —
 *   onPreview) · 대표로 정하기(badgeLabel 을 쓰는 칸의 사진 — 맨 앞으로) · 앞으로 옮기기 · 뒤로 옮기기(onReorder) | 지우기(위험 — onRemove).
 *   맨 앞 항목은 앞으로 · 대표로, 맨 끝 항목은 뒤로가 막힌 줄. 옮긴 뒤 초점은 옮긴 항목, 지운 뒤는 × 와 같다. × 는 지름길로 그대로다.
 *   읽기 전용이면 메뉴 없이 누르면 바로 onPreview, 막힘이면 누르지 않는다.
 * 첨부 타일 — 80 · 모서리 12 · 안쪽 1px stroke-neutral-weak · 투명. 아이콘 24 fg-neutral-subtle(사진을 받으면 image, 파일만이면 paperclip)
 *   아래 4 에 개수(t2 400 — 지금 개수 fg-neutral + "/최대" fg-neutral-subtle). 다 차면 aria-disabled(초점은 남아 "10/10, 사용할 수 없음"),
 *   막힘은 disabled — 아이콘 · 개수 fg-disabled. 이름 "{칸 이름} 첨부, 3/10".
 * 항목 줄(tile) — 화면 가장자리까지 넓히고(좌우 −24 · 안쪽 24 — 첫 항목이 다른 칸과 같은 자리) 넘치면 가로로 스크롤한다. 끝 흐림은
 *   Scroll Fog row(좌우 20 · 늘 켬 · 스크롤바 숨김). 위 16 을 더 두고 같은 만큼 당겨 × 의 누르는 자리 44 가 잘리지 않게 한다.
 * 드롭존(1280 이상 웹) — 높이 120 · 모서리 12 · 1px 실선 stroke-neutral-solid · 안내 t4 500 fg-neutral-subtle "파일을 여기로 끌어다
 *   놓으세요" + 8 아래 Button neutralWeak small "파일 선택"(키보드 길 — 상자 전체를 누르는 자리로 두지 않는다). 파일을 끌고 들어오면
 *   테두리 stroke-neutral-contrast + 바탕 bg-layer-default-pressed. 막힘 · 다 참 · 읽기 전용이면 테두리 stroke-neutral-weak · 안내 fg-disabled
 *   이고 받지 않는다. 드롭존이 있는 동안 드롭존 밖에 놓은 파일을 브라우저가 열지 않게 막는다.
 * 상태 — 타일 · × 는 올림(웹) · 누름 bg-layer-default-pressed, 누른 부품(타일 · × · 다시 시도)만 2px 거리 축소(기준 80 · 24 · 80 —
 *   모션 줄이기면 하지 않는다). 키보드 포커스 링은 모두 부품 안쪽 2px — 가로 스크롤 줄이 바깥 링을 자른다.
 * 읽기 글 — 붙음 · 올림 · 실패를 한 번씩 읽는다(polite — "사진 2장을 붙였어요." · "1개를 올렸어요." · "1개는 올리지 못했어요.").
 *   실패가 있으면 칸(role="group")의 설명에도 붙는다. 거절은 Field 오류 글이 읽는다.
 * 초점 — × 로 지우면 다음 항목의 × → 없으면 앞 항목의 × → 없으면 첨부 타일(드롭존이면 파일 선택). 고른 뒤 파일 선택이 막히면(다 참)
 *   새 항목의 × 로 옮긴다.
 */

export type AttachmentStatus = "pending" | "uploading" | "success" | "error";

export interface AttachmentEntry {
  id: string;
  name: string;
  /** 바이트 */
  size: number;
  /** MIME — image/* 면 사진 썸네일, 그 밖은 파일 카드 */
  type: string;
  file?: File;
  /** 사진 썸네일 — 새로 고른 사진은 레시피가 만든다(object URL) */
  previewUrl?: string;
  status: AttachmentStatus;
  /** 올리는 중 원 — 0 ~ 1 */
  progress?: number;
}

export type AttachmentRejectionCode = "FILE_TOO_LARGE" | "INVALID_TYPE" | "TOO_MANY_FILES";

export interface AttachmentRejection {
  file: File;
  codes: AttachmentRejectionCode[];
}

/** 파일 크기 글 — "512B" · "84KB" · "9.8MB"(MB · GB 는 소수 한 자리, 띄어 쓰지 않는다) */
export function formatFileSize(bytes: number): string {
  const b = Math.max(0, Math.round(bytes));
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${Math.max(1, Math.round(b / 1024))}KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)}MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(1)}GB`;
}

// ── 검사 ─────────────────────────────────────────────────────
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|avif)$/i;
const SHEET_EXT = /\.(csv|xlsx?|ods|numbers)$/i;
const SHEET_TYPE = /(csv|spreadsheet|ms-excel)/i;

const isImage = (type: string, name: string) => (type ? type.startsWith("image/") : IMAGE_EXT.test(name));

// accept 를 다시 검사한다 — 고르기 창의 accept 는 편의일 뿐("모든 파일" 로 다른 형식을 고를 수 있다)
function accepts(file: File, accept: string | undefined) {
  const tokens = (accept ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((t) => {
    if (t.startsWith(".")) return name.endsWith(t);
    if (t.endsWith("/*")) return type.startsWith(t.slice(0, -1)) || (t === "image/*" && !type && IMAGE_EXT.test(name));
    return type === t;
  });
}

// 형식 · 크기 · 개수 — 통과한 파일은 앞에서부터 남은 자리만큼, 넘친 파일은 TOO_MANY_FILES
function validate(files: File[], room: number, accept: string | undefined, maxFileSize: number | undefined) {
  const accepted: File[] = [];
  const rejections: AttachmentRejection[] = [];
  for (const file of files) {
    const codes: AttachmentRejectionCode[] = [];
    if (!accepts(file, accept)) codes.push("INVALID_TYPE");
    if (maxFileSize != null && file.size > maxFileSize) codes.push("FILE_TOO_LARGE");
    if (codes.length === 0 && accepted.length >= room) codes.push("TOO_MANY_FILES");
    if (codes.length > 0) rejections.push({ file, codes });
    else accepted.push(file);
  }
  return { accepted, rejections };
}

let entrySeq = 0;
const newEntryId = () => `attachment-${Date.now().toString(36)}-${(entrySeq += 1)}`;

const hasFiles = (e: { dataTransfer: DataTransfer | null }) => Array.from(e.dataTransfer?.types ?? []).includes("Files");

const STALL_MS = 10_000;
const EMPTY_IDS: ReadonlySet<string> = new Set();

// 진행이 10초 동안 멈춘 올리기 — 값(progress)이 있는 것만 잰다
function useStalledUploads(entries: AttachmentEntry[]) {
  const seen = React.useRef(new Map<string, { progress: number; at: number }>());
  const [stalled, setStalled] = React.useState<ReadonlySet<string>>(EMPTY_IDS);
  React.useEffect(() => {
    const map = seen.current;
    const t = Date.now();
    const live = new Set<string>();
    for (const e of entries) {
      if (e.status !== "uploading" || typeof e.progress !== "number" || e.progress >= 1) continue;
      live.add(e.id);
      const prev = map.get(e.id);
      if (!prev || prev.progress !== e.progress) map.set(e.id, { progress: e.progress, at: t });
    }
    for (const id of Array.from(map.keys())) if (!live.has(id)) map.delete(id);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      const now = Date.now();
      const ids = new Set<string>();
      let next = Infinity;
      map.forEach((v, id) => {
        const due = v.at + STALL_MS;
        if (due <= now) ids.add(id);
        else next = Math.min(next, due);
      });
      setStalled((prev) => (prev.size === ids.size && Array.from(ids).every((id) => prev.has(id)) ? prev : ids));
      if (next < Infinity) timer = setTimeout(check, next - now);
    };
    check();
    return () => clearTimeout(timer);
  }, [entries]);
  return stalled;
}

// 보이는 상태 — 진행이 멈춘 올리기는 실패로 보인다
const effectiveStatus = (e: AttachmentEntry, stalled: ReadonlySet<string>): AttachmentStatus =>
  e.status === "uploading" && stalled.has(e.id) ? "error" : e.status;

// 같은 글이 이어지면 다시 읽히게 끝에 빈칸을 번갈아 붙인다
const nextMessage = (previous: string, text: string) => (previous.endsWith(" ") ? text : `${text} `);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

// ── 모양 ─────────────────────────────────────────────────────
const ROOT = "flex min-w-0 flex-col gap-x2 font-sans";

// 항목 줄 — tile 은 화면 가장자리까지(Scroll Fog row 가 좌우 24 안쪽 여백 · 끝 흐림 20 · 스크롤바 숨김), dropzone 은 칸 안.
// 위 16 을 더 두고 같은 만큼 당긴다 — × 의 누르는 자리 44 가 위로 16(걸침 4 + 보이지 않는 여백 12) 나가도 가로 스크롤 줄에 잘리지 않는다.
// 당긴 16 은 위 칸(라벨 · 드롭존)에 겹치므로 줄 자체는 누르기를 받지 않고 안의 내용만 받는다
const ROW_TILE = "-mx-global-gutter -mt-x4 pt-x4 pointer-events-none [&>*]:pointer-events-auto";
const ROW_DROPZONE = "-mt-x4 flex flex-wrap items-start gap-x2 pt-x4 pointer-events-none [&>*]:pointer-events-auto";
const ROW_CONTENT = "flex items-start gap-x2";
const LIST = "m-0 flex list-none items-start gap-x2 p-0";

// 첨부 타일 — 80 · 모서리 12 · 안쪽 1px. 다 참 · 읽기 전용(aria-disabled) · 막힘(disabled)은 바탕 · 축소 없이 아이콘 · 개수만 fg-disabled
const TRIGGER = [
  "group/attachment-trigger relative flex size-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-x1 rounded-r3 bg-transparent font-sans",
  "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:80]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent aria-disabled:active:bg-transparent aria-disabled:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:bg-transparent disabled:active:[scale:1]",
].join(" ");
const TRIGGER_ICON =
  "size-6 shrink-0 text-fg-neutral-subtle group-aria-disabled/attachment-trigger:text-fg-disabled group-disabled/attachment-trigger:text-fg-disabled";
const COUNT = "text-t2 font-normal";
const COUNT_NOW = "text-fg-neutral group-aria-disabled/attachment-trigger:text-fg-disabled group-disabled/attachment-trigger:text-fg-disabled";
const COUNT_MAX = "text-fg-neutral-subtle group-aria-disabled/attachment-trigger:text-fg-disabled group-disabled/attachment-trigger:text-fg-disabled";

// × 둘레 구멍 — 지름 24, 가운데가 오른쪽 위 모서리에서 안쪽 6(× 의 가운데와 같다). 끄는 동안은 구멍이 없다
const MASK =
  "[mask-image:radial-gradient(circle_at_calc(100%_-_6px)_6px,transparent_12px,#000_12.5px)] group-data-[dragging]/attachment-item:[mask-image:none]";

// 항목 상자 — 높이 80 · 모서리 12 · 윤곽(::after, 그림 위). 끄는 동안 2px 거리 축소(기준 80).
// 누를 수 있는 항목(메뉴 · 순서 바꾸기)은 role="button" — 키보드 포커스 링은 안쪽 2px
const ITEM = [
  "relative flex h-20 shrink-0 items-center justify-center gap-x2_5 rounded-r3 bg-transparent",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
  MASK,
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:80]",
  "group-data-[dragging]/attachment-item:[scale:calc(1-2/var(--press-basis))] motion-reduce:group-data-[dragging]/attachment-item:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "data-[pressable]:cursor-pointer data-[sortable]:cursor-grab group-data-[dragging]/attachment-item:cursor-grabbing",
].join(" ");
// 사진은 읽기 전용 · 끄는 동안 불투명도 0.5(SEED 그대로 — 사용자 결정 2026-10-15 마무리 13B, v106 의 예외는 이 두 상태뿐) —
// 흐림 · 축소는 motion-duration-d4 · ease-easing 으로 서서히(모션 줄이기면 바로)
const ITEM_KIND = {
  image:
    "w-20 after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-overlay)] [transition:opacity_var(--motion-duration-d4)_var(--motion-ease-easing),scale_var(--motion-duration-d4)_var(--motion-ease-easing)] motion-reduce:[transition:none] group-data-[readonly]/attachment-item:opacity-50 group-data-[dragging]/attachment-item:opacity-50",
  file: "w-40 px-x4 after:shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)]",
} as const;

const IMAGE = "pointer-events-none size-full select-none rounded-[inherit] object-cover";
const IMAGE_FALLBACK = "flex size-full items-center justify-center rounded-[inherit] bg-bg-neutral-weak text-fg-neutral-subtle [&>svg]:size-6";

// 파일 카드 — 썸네일 칸 48 · 이름 · 크기. 실패면 다시 시도가 채운다. 읽기 전용 · 끄는 동안 글 · 아이콘 fg-disabled(SEED — 13B)
const THUMBNAIL =
  "flex size-12 shrink-0 items-center justify-center rounded-r2 bg-bg-neutral-weak text-fg-neutral-subtle [&>svg]:size-6 group-data-[readonly]/attachment-item:text-fg-disabled group-data-[dragging]/attachment-item:text-fg-disabled group-data-[status=error]/attachment-item:hidden";
const META = "flex min-w-0 flex-1 flex-col group-data-[status=error]/attachment-item:hidden";
// 이름은 글자 단위로 줄을 바꾼다(break-all — SEED 레시피 그대로, 사용자 결정 2026-10-15 마무리 11D)
const NAME =
  "relative block break-all text-t2 font-medium text-fg-neutral group-data-[readonly]/attachment-item:text-fg-disabled group-data-[dragging]/attachment-item:text-fg-disabled";
// 첫 줄만 오른쪽 4 를 비운다(YAML name.maskClear) — 오른쪽 float 4 × 한 줄. 네 줄이면 이름이 카드 위에 붙어 × 구멍이 첫 줄 끝 글자를
// 파먹는다. 둘째 줄부터는 70 그대로
const NAME_CLEAR = "float-right h-[1lh] w-x1";
// 줄 수를 재는 보이지 않는 같은 글(같은 폭 · 같은 첫 줄 비움)
const NAME_MEASURE = "invisible absolute inset-x-0 top-0";
const NAME_EXT = "block";
const SIZE =
  "text-t1 font-normal text-fg-neutral-subtle group-data-[readonly]/attachment-item:text-fg-disabled group-data-[dragging]/attachment-item:text-fg-disabled";

// 사진 위 덮개 — 올리는 중(라이트 0.50 · 다크 0.65) · 실패(두 모드 0.65 — 글이 얹힌다)
const BACKDROP = "absolute inset-0 flex items-center justify-center rounded-[inherit]";
const BACKDROP_UPLOADING = "bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]";
const BACKDROP_ERROR = "bg-[var(--overlay-dim-dark)]";

// 대표 띠 — 첫 사진 아래 24, 두 모드 0.65
const BADGE =
  "absolute inset-x-0 bottom-0 flex h-x6 items-center justify-center rounded-b-r3 bg-[var(--overlay-dim-dark)] px-x1 text-t2 font-medium text-static-white";
const BADGE_LABEL = "truncate";

// 다시 시도 — 항목 위에 겹친 형제(항목이 단추일 수 있다). 누르면 이것만 2px 거리 축소(기준 80)
const ACTION = [
  "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-x1 rounded-r3 bg-transparent font-sans text-t2 font-medium [&>svg]:size-6",
  MASK,
  "[transition:scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:80]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "disabled:cursor-not-allowed disabled:active:[scale:1]",
].join(" ");
const ACTION_KIND = { image: "text-static-white", file: "text-fg-neutral-subtle" } as const;

// × — 20 원이 모서리 밖으로 위 4 · 오른쪽 4. 누르는 자리 44(::before 12 씩). 끄는 동안 사라진다. 이웃 항목 위로 올린다
const REMOVE = [
  "absolute -right-x1 -top-x1 z-[1] flex size-5 cursor-pointer items-center justify-center rounded-full bg-bg-layer-default text-fg-neutral",
  "shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] [&>svg]:size-[10px]",
  "before:absolute before:-inset-x3 before:content-['']",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)] [--press-basis:24]",
  "hover:bg-bg-layer-default-pressed active:bg-bg-layer-default-pressed active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "aria-disabled:cursor-not-allowed aria-disabled:text-fg-disabled aria-disabled:hover:bg-bg-layer-default aria-disabled:active:bg-bg-layer-default aria-disabled:active:[scale:1]",
  "disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:bg-bg-layer-default disabled:active:bg-bg-layer-default disabled:active:[scale:1]",
  "group-data-[dragging]/attachment-item:hidden",
].join(" ");

// 항목 자리(li) — 항목 · 다시 시도 · × 를 담는다. 끄는 항목이 위로
const ITEM_ROOT = "group/attachment-item relative shrink-0 [touch-action:manipulation] data-[dragging]:z-[2]";

// 드롭존(1280 이상) — 높이 120 · 1px 실선. 끌어 들어오면 테두리 · 바탕이 바뀐다. 막히면 옅은 테두리
const DROPZONE = [
  "group/attachment-dropzone hidden h-[120px] flex-col items-center justify-center gap-x2 rounded-r3 border border-solid border-stroke-neutral-solid bg-transparent px-x4 lg:flex",
  "[transition:border-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "data-[drag-over]:border-stroke-neutral-contrast data-[drag-over]:bg-bg-layer-default-pressed",
  "data-[disabled]:border-stroke-neutral-weak",
].join(" ");
const DROPZONE_LABEL = "m-0 text-center text-t4 font-medium text-fg-neutral-subtle group-data-[disabled]/attachment-dropzone:text-fg-disabled";
// 1280 미만 — 드롭존 없이 파일 선택 버튼(large · 칸 폭 · 앞 아이콘)
const PICK_NARROW = "w-full lg:hidden";

type Kind = "image" | "file";

const fileIconOf = (type: string, name: string) => {
  if (type === "application/pdf" || /\.pdf$/i.test(name)) return <FileText aria-hidden />;
  if (SHEET_TYPE.test(type) || SHEET_EXT.test(name)) return <FileSpreadsheet aria-hidden />;
  return <FileIcon aria-hidden />;
};

// 파일 이름 — 네 줄까지. 넘치면 셋째 줄 끝을 "…" 로 줄이고 넷째 줄에 확장자(확장자가 없으면 넷째 줄 끝을 줄인다).
// 보이지 않는 같은 글로 줄 수를 재고(글꼴이 늦게 와도 ResizeObserver 가 다시 잰다), 넘치면 "…" 를 붙여 셋째 줄에 드는 가장 긴 앞부분을
// 글자 단위로 찾는다 — 첫 줄의 비움(float)이 있어 CSS line-clamp(-webkit-box 는 float 를 받지 않는다) 대신 잰다
const ELLIPSIS = "…";
function FileName({ name }: { name: string }) {
  const full = React.useRef<HTMLSpanElement>(null);
  const probe = React.useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState<string | null>(null);
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 && name.length - dot <= 10 ? name.slice(dot) : "";
  const base = ext ? name.slice(0, dot) : name;
  useIsoLayoutEffect(() => {
    const el = full.current;
    const text = probe.current;
    if (!el || !text) return;
    const check = () => {
      const line = parseFloat(getComputedStyle(el).lineHeight) || 16;
      if (el.offsetHeight <= line * 4 + 1) return setShown(null);
      // 넘친다 — 확장자가 있으면 세 줄, 없으면 네 줄에 드는 가장 긴 "앞부분…"
      const lines = ext ? 3 : 4;
      const chars = Array.from(base);
      const box = text.parentElement as HTMLElement;
      let lo = 0;
      let hi = chars.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        text.textContent = chars.slice(0, mid).join("") + ELLIPSIS;
        if (box.offsetHeight <= line * lines + 1) lo = mid;
        else hi = mid - 1;
      }
      text.textContent = "";
      setShown(chars.slice(0, lo).join("").trimEnd() + ELLIPSIS);
    };
    check();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [name, base, ext]);
  return (
    <span data-slot="attachment-input-name" data-overflow={shown != null || undefined} className={NAME}>
      <span ref={full} aria-hidden className={NAME_MEASURE}>
        <span className={NAME_CLEAR} />
        {name}
      </span>
      <span aria-hidden className={NAME_MEASURE}>
        <span className={NAME_CLEAR} />
        <span ref={probe} />
      </span>
      <span aria-hidden data-slot="attachment-input-name-clear" className={NAME_CLEAR} />
      {shown == null ? (
        name
      ) : (
        <>
          {shown}
          {ext && <span className={NAME_EXT}>{ext}</span>}
        </>
      )}
    </span>
  );
}

type Kindish = { kind: Kind; status: AttachmentStatus };

const describe = (entry: AttachmentEntry, status: AttachmentStatus, badgeLabel?: string) => {
  const parts = [entry.name, formatFileSize(entry.size)];
  if (badgeLabel) parts.push(badgeLabel);
  if (status === "uploading") {
    parts.push(typeof entry.progress === "number" ? `올리는 중 ${Math.round(Math.min(Math.max(entry.progress, 0), 1) * 100)}%` : "올리는 중");
  }
  if (status === "error") parts.push("올리지 못했어요");
  return parts.join(", ");
};

// 항목 상자의 안 — 사진 · 파일 카드 · 덮개 · 원 · 대표 띠. 단추를 담지 않는다(다시 시도 · × 는 형제)
function ItemFace({ entry, kind, status, badgeLabel }: Kindish & { entry: AttachmentEntry; badgeLabel?: string }) {
  const [broken, setBroken] = React.useState(false);
  const percent = typeof entry.progress === "number" ? Math.round(Math.min(Math.max(entry.progress, 0), 1) * 100) : undefined;
  const circle = (tone: "staticWhite" | "neutral") => (
    <ProgressCircle size="24" tone={tone} value={percent} aria-hidden />
  );
  return (
    <>
      {kind === "image" ? (
        entry.previewUrl && !broken ? (
          <img
            data-slot="attachment-input-image"
            src={entry.previewUrl}
            alt=""
            draggable={false}
            className={IMAGE}
            onError={() => setBroken(true)}
          />
        ) : (
          <span aria-hidden data-slot="attachment-input-image" className={IMAGE_FALLBACK}>
            <ImageIcon aria-hidden />
          </span>
        )
      ) : (
        <>
          <span aria-hidden data-slot="attachment-input-thumbnail" className={THUMBNAIL}>
            {status === "uploading" ? circle("neutral") : fileIconOf(entry.type, entry.name)}
          </span>
          <span aria-hidden data-slot="attachment-input-meta" className={META}>
            <FileName name={entry.name} />
            <span data-slot="attachment-input-size" className={SIZE}>
              {formatFileSize(entry.size)}
            </span>
          </span>
        </>
      )}
      {kind === "image" && badgeLabel && (
        <span aria-hidden data-slot="attachment-input-badge" className={BADGE}>
          <span className={BADGE_LABEL}>{badgeLabel}</span>
        </span>
      )}
      {kind === "image" && (status === "uploading" || status === "error") && (
        <span aria-hidden data-slot="attachment-input-backdrop" className={cn(BACKDROP, status === "uploading" ? BACKDROP_UPLOADING : BACKDROP_ERROR)}>
          {status === "uploading" && circle("staticWhite")}
        </span>
      )}
    </>
  );
}

// 항목 메뉴(사용자 결정 2026-10-15 마무리 14A — WCAG 2.5.7 의 포인터 한 번 길) — 항목을 누르거나 Enter 면 1280 이상 Menu(aria-label =
// 파일 이름) · 미만 Menu Sheet(머리 = 파일 이름). 위 묶음 크게 보기(파일 카드는 "열기" — onPreview) · 대표로 정하기(badgeLabel 을 쓰는 칸의
// 사진 — 맨 앞으로) · 앞으로 옮기기 · 뒤로 옮기기(onReorder — 맨 앞이면 앞으로 · 대표로, 맨 끝이면 뒤로가 막힌다) | 아래 위험 묶음 지우기.
// 끄는 길(포인터 · 키보드 Space · ← → · Space)과 × 는 그대로다
type AttachmentItemMenuAction = "preview" | "badge" | "forward" | "backward" | "remove";
type ItemMenu = {
  actions: AttachmentItemMenuAction[];
  /** 막힌 줄 — 끝에 닿은 옮기기 · 이미 대표인 사진 */
  blocked: AttachmentItemMenuAction[];
  onAction: (action: AttachmentItemMenuAction) => void;
};
const MENU_LABEL: Record<Exclude<AttachmentItemMenuAction, "preview">, string> = {
  badge: "대표로 정하기",
  forward: "앞으로 옮기기",
  backward: "뒤로 옮기기",
  remove: "지우기",
};

type ItemProps = {
  entry: AttachmentEntry;
  status: AttachmentStatus;
  description: string;
  badgeLabel?: string;
  readOnly: boolean;
  removeBlock: "none" | "readOnly" | "disabled";
  retryDisabled: boolean;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  menu?: ItemMenu;
  /** 메뉴 없이 누르기 — 읽기 전용에서 바로 크게 보기(onPreview) */
  onPress?: () => void;
};

type DragBits = {
  style?: React.CSSProperties;
  dragging?: boolean;
  setNodeRef?: (el: HTMLElement | null) => void;
  setActivatorNodeRef?: (el: HTMLElement | null) => void;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
};

// 누르는 키 — Enter 는 메뉴, Space 는 들기(dnd-kit — 끌 수 없는 항목이면 메뉴). 메뉴(Radix)가 ↓ · ↑ 로 열지 않게 막는다
const MENU_BLOCKED_KEYS = new Set(["ArrowDown", "ArrowUp"]);

// 항목 자리 — li > 항목(누를 수 있으면 role="button" · 메뉴 트리거 · 끌기의 activator) + 다시 시도 + ×
function Item({
  entry,
  status,
  description,
  badgeLabel,
  readOnly,
  removeBlock,
  retryDisabled,
  onRemove,
  onRetry,
  menu,
  onPress,
  drag,
}: ItemProps & { drag?: DragBits }) {
  const kind: Kind = isImage(entry.type, entry.name) ? "image" : "file";
  const [menuOpen, setMenuOpen] = React.useState(false);
  // 메뉴의 이름 — 1280 이상 Menu 는 aria-label(머리가 없다), 미만 Menu Sheet 는 머리(title). 둘 다 전체 파일 이름
  const wide = useInputButtonSurface() === "popover";
  const sortable = drag?.attributes != null;
  const pressable = sortable || menu != null || onPress != null;
  const dragging = drag?.dragging ?? false;
  // 메뉴 없이 누르는 항목(읽기 전용의 크게 보기)
  const pressHandlers =
    !menu && onPress
      ? {
          onClick: onPress,
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            onPress();
          },
        }
      : {};

  // 누를 수 있으면 role="button" + 전체 이름. 끌 수 있으면 dnd-kit 의 속성(aria-roledescription · 설명)과 끌기 · 들기 처리기 —
  // 처리기는 항목에 둔다(메뉴 트리거 Slot 은 자식의 처리기를 먼저 부르므로 dnd-kit 이 먼저 받는다)
  const element = (
    <div
      ref={drag?.setActivatorNodeRef}
      data-slot="attachment-input-item"
      data-kind={kind}
      data-sortable={sortable ? "" : undefined}
      data-pressable={menu || onPress ? "" : undefined}
      className={cn(ITEM, ITEM_KIND[kind])}
      {...(pressable ? { role: "button", tabIndex: 0 } : {})}
      {...drag?.attributes}
      {...drag?.listeners}
      {...pressHandlers}
      aria-label={pressable ? description : undefined}
    >
      <ItemFace entry={entry} kind={kind} status={status} badgeLabel={badgeLabel} />
      {!pressable && <span className="sr-only">{description}</span>}
    </div>
  );

  return (
    <li
      ref={drag?.setNodeRef}
      data-slot="attachment-input-item-root"
      data-id={entry.id}
      data-kind={kind}
      data-status={status}
      data-readonly={readOnly || undefined}
      data-dragging={dragging || undefined}
      className={ITEM_ROOT}
      style={drag?.style}
    >
      {menu ? (
        <ResponsiveMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <ResponsiveMenuTrigger
            asChild
            // 메뉴는 누르기(click) · Enter 로만 연다 — 마우스를 누르는 순간 여는 Radix 처리를 막아 끌기와 갈린다
            onPointerDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              if (!dragging) setMenuOpen(true);
            }}
            onKeyDown={(e) => {
              // 들고 있는 동안의 키는 모두 dnd-kit 것 · Space 로 들었으면(dnd-kit 이 막았다) 그대로
              if (dragging) return e.preventDefault();
              if (e.defaultPrevented) return;
              if (e.key === "Enter" || (e.key === " " && !sortable)) {
                e.preventDefault();
                setMenuOpen(true);
              } else if (MENU_BLOCKED_KEYS.has(e.key)) e.preventDefault();
            }}
          >
            {element}
          </ResponsiveMenuTrigger>
          <ResponsiveMenuContent
            align="start"
            title={entry.name}
            layout="textOnly"
            data-slot="attachment-input-menu"
            {...(wide ? { "aria-label": entry.name, "aria-labelledby": undefined } : {})}
          >
            {menu.actions.some((a) => a !== "remove") && (
              <ResponsiveMenuGroup>
                {menu.actions
                  .filter((a) => a !== "remove")
                  .map((a) => (
                    <ResponsiveMenuItem
                      key={a}
                      label={a === "preview" ? (kind === "image" ? "크게 보기" : "열기") : MENU_LABEL[a]}
                      disabled={menu.blocked.includes(a)}
                      onSelect={() => menu.onAction(a)}
                    />
                  ))}
              </ResponsiveMenuGroup>
            )}
            {menu.actions.includes("remove") && (
              <ResponsiveMenuGroup>
                <ResponsiveMenuItem label={MENU_LABEL.remove} tone="critical" onSelect={() => menu.onAction("remove")} />
              </ResponsiveMenuGroup>
            )}
          </ResponsiveMenuContent>
        </ResponsiveMenu>
      ) : (
        element
      )}
      {status === "error" && (
        <button
          type="button"
          data-slot="attachment-input-retry"
          aria-label={`${entry.name} 다시 시도`}
          disabled={retryDisabled}
          className={cn(ACTION, ACTION_KIND[kind])}
          onClick={() => onRetry?.(entry.id)}
        >
          <RotateCw aria-hidden />
          다시 시도
        </button>
      )}
      <button
        type="button"
        data-slot="attachment-input-remove"
        aria-label={`${entry.name} 지우기`}
        aria-disabled={removeBlock === "readOnly" || undefined}
        disabled={removeBlock === "disabled"}
        className={REMOVE}
        onClick={() => {
          if (removeBlock === "none") onRemove(entry.id);
        }}
      >
        <X aria-hidden strokeWidth={2.5} />
      </button>
    </li>
  );
}

// 끌기 — 가로로만(줄을 벗어나지 않는다)
const horizontalOnly: Modifier = ({ transform }) => ({ ...transform, y: 0 });

function SortableItem({ reducedMotion, ...props }: ItemProps & { reducedMotion: boolean }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props.entry.id,
    attributes: { roleDescription: "순서를 바꿀 수 있는 항목" },
    transition: reducedMotion ? null : undefined,
  });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)` : undefined,
    transition: reducedMotion ? undefined : transition,
  };
  return <Item {...props} drag={{ style, dragging: isDragging, setNodeRef, setActivatorNodeRef, attributes, listeners }} />;
}

// 마우스 · 펜 — 누른 채 8px 넘게 움직이면 든다. 터치는 TouchSensor(250ms 누른 채 움직이기 — 그 전에는 줄이 가로로 스크롤한다)가 맡는다.
// 항목의 pointerdown 은 메뉴 트리거가 막으므로(마우스로 누르는 순간 여는 Radix 처리를 끈다) 마우스 이벤트 대신 포인터 이벤트로 받는다
class NonTouchPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: React.PointerEvent, { onActivation }: PointerSensorOptions) => {
        if (!event.isPrimary || event.button !== 0 || event.pointerType === "touch") return false;
        onActivation?.({ event });
        return true;
      },
    },
  ];
}

export interface AttachmentInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  entries: AttachmentEntry[];
  /** 검사를 통과한 새 항목(상태 "pending") — 한 번 고른 것을 한 번에 */
  onFilesAccept: (added: AttachmentEntry[]) => void;
  /** × — 묻지 않고 지운다 */
  onRemove: (id: string) => void;
  /** 실패한 항목의 "다시 시도" */
  onRetry?: (id: string) => void;
  /** 한 번 고른 것 가운데 거절된 것 모두 — 한 번에 */
  onFilesReject?: (rejections: AttachmentRejection[]) => void;
  /** 주면 항목을 끌어 · 키보드로 · 항목 메뉴(대표로 정하기 · 앞으로 · 뒤로 옮기기)로 순서를 바꾼다 — 바뀐 목록 */
  onReorder?: (next: AttachmentEntry[]) => void;
  /** 주면 사진 메뉴에 "크게 보기" — 사진을 크게 보이는 자리는 쓰는 쪽이 연다 */
  onPreview?: (id: string) => void;
  /** tile(기본) · dropzone */
  layout?: "tile" | "dropzone";
  /** 고르기 창 · 다시 검사 — "image/*,application/pdf" · ".csv,.xlsx,.xls" */
  accept?: string;
  /** 기본 1. Infinity 면 개수를 그리지 않는다 */
  maxFiles?: number;
  /** 바이트 */
  maxFileSize?: number;
  /** 주면 첫 사진에 띠 — "대표" */
  badgeLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** 고른 파일을 숨은 <input type="file"> 에 맞춰 폼에 낸다 */
  name?: string;
  /** 타일 이름의 앞 — 기본은 Field 라벨 */
  triggerLabel?: string;
}

const AttachmentInput = React.forwardRef<HTMLDivElement, AttachmentInputProps>(
  (
    {
      entries,
      onFilesAccept,
      onRemove,
      onRetry,
      onFilesReject,
      onReorder,
      onPreview,
      layout = "tile",
      accept,
      maxFiles = 1,
      maxFileSize,
      badgeLabel,
      disabled: disabledProp,
      readOnly: readOnlyProp,
      name,
      triggerLabel,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const field = useField();
    const fieldState = useFieldGroupState();
    const disabled = disabledProp ?? fieldState.disabled;
    const readOnly = readOnlyProp ?? fieldState.readOnly;
    const auto = React.useId();
    const failureId = `${auto}failure`;
    const triggerSuffixId = `${auto}trigger`;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const pickerRef = React.useRef<HTMLInputElement>(null);
    const submitRef = React.useRef<HTMLInputElement>(null);
    const reducedMotion = usePrefersReducedMotion();
    const stalled = useStalledUploads(entries);
    const statusOf = (e: AttachmentEntry) => effectiveStatus(e, stalled);

    const limited = Number.isFinite(maxFiles);
    const full = entries.length >= maxFiles;
    const blocked = disabled || readOnly || full;
    const failures = entries.filter((e) => statusOf(e) === "error").length;
    const firstImageId = badgeLabel ? entries.find((e) => isImage(e.type, e.name))?.id : undefined;
    const acceptsImages = !accept || accept.split(",").some((t) => /^(image\/|\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|avif)$)/i.test(t.trim()));

    const naming = useFieldGroup({
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": [ariaDescribedBy, failures > 0 ? failureId : undefined].filter(Boolean).join(" ") || undefined,
    });

    // ── 새로 고른 사진의 썸네일(object URL) — 줄에서 빠지면 놓는다. 다시 붙는 렌더(Strict Mode)에서는 놓지 않는다
    const createdUrls = React.useRef(new Map<string, string>());
    const mounted = React.useRef(false);
    React.useEffect(() => {
      const ids = new Set(entries.map((e) => e.id));
      createdUrls.current.forEach((url, id) => {
        if (ids.has(id)) return;
        URL.revokeObjectURL(url);
        createdUrls.current.delete(id);
      });
    }, [entries]);
    React.useEffect(() => {
      mounted.current = true;
      const urls = createdUrls.current;
      return () => {
        mounted.current = false;
        setTimeout(() => {
          if (mounted.current) return;
          urls.forEach((url) => URL.revokeObjectURL(url));
          urls.clear();
        }, 0);
      };
    }, []);

    // ── 읽기 글 — 붙음 · 올림 · 실패를 한 번씩
    const [message, setMessage] = React.useState("");
    const announce = (text: string) => setMessage((m) => nextMessage(m, text));
    const previous = React.useRef<Map<string, AttachmentStatus> | null>(null);
    React.useEffect(() => {
      const before = previous.current;
      const now = new Map(entries.map((e) => [e.id, effectiveStatus(e, stalled)] as const));
      previous.current = now;
      if (!before) return;
      const added = entries.filter((e) => !before.has(e.id));
      const succeeded = entries.filter((e) => before.has(e.id) && before.get(e.id) !== "success" && now.get(e.id) === "success").length;
      const failed = entries.filter((e) => before.has(e.id) && before.get(e.id) !== "error" && now.get(e.id) === "error").length;
      const parts: string[] = [];
      if (added.length > 0) {
        const images = added.filter((e) => isImage(e.type, e.name)).length;
        if (images === added.length) parts.push(`사진 ${images}장을 붙였어요.`);
        else if (images === 0) parts.push(`파일 ${added.length}개를 붙였어요.`);
        else parts.push(`${added.length}개를 붙였어요.`);
      }
      if (succeeded > 0) parts.push(`${succeeded}개를 올렸어요.`);
      if (failed > 0) parts.push(`${failed}개는 올리지 못했어요.`);
      if (parts.length > 0) setMessage((m) => nextMessage(m, parts.join(" ")));
    }, [entries, stalled]);

    // ── 폼에 내는 값 — entries 의 file 을 숨은 입력에
    React.useEffect(() => {
      const input = submitRef.current;
      if (!input || typeof DataTransfer === "undefined") return;
      try {
        const dt = new DataTransfer();
        for (const e of entries) if (e.file) dt.items.add(e.file);
        input.files = dt.files;
      } catch {
        // DataTransfer 를 만들 수 없는 브라우저 — 값을 맞추지 않는다
      }
    }, [entries]);

    // ── 초점 — × 로 지운 뒤 · 고른 뒤 파일 선택이 막혔을 때
    const pendingFocus = React.useRef<
      { kind: "removed"; id: string; index: number } | { kind: "added"; ids: string[] } | { kind: "moved"; id: string } | null
    >(null);
    useIsoLayoutEffect(() => {
      const root = rootRef.current;
      const pending = pendingFocus.current;
      if (!root || !pending) return;
      const removes = () => Array.from(root.querySelectorAll<HTMLElement>('[data-slot="attachment-input-remove"]'));
      const visible = (el: HTMLElement) => el.offsetParent !== null || el.getClientRects().length > 0;
      if (pending.kind === "moved") {
        // 메뉴로 옮긴 항목 — 줄이 다시 놓이며 초점을 잃을 수 있어 그 항목으로 돌려놓는다
        pendingFocus.current = null;
        root.querySelector<HTMLElement>(`[data-slot="attachment-input-item-root"][data-id="${CSS.escape(pending.id)}"] [data-slot="attachment-input-item"]`)?.focus();
        return;
      }
      if (pending.kind === "removed") {
        if (entries.some((e) => e.id === pending.id)) return;
        pendingFocus.current = null;
        const list = removes();
        const target =
          list[pending.index] ??
          list[pending.index - 1] ??
          Array.from(root.querySelectorAll<HTMLElement>('[data-slot="attachment-input-trigger"], [data-slot="attachment-input-pick"]')).find(visible);
        target?.focus();
        return;
      }
      if (!pending.ids.some((id) => entries.some((e) => e.id === id))) return;
      pendingFocus.current = null;
      const active = document.activeElement as HTMLElement | null;
      const lost = !active || active === document.body || (active instanceof HTMLButtonElement && active.disabled);
      if (!lost) return;
      root.querySelector<HTMLElement>(`[data-slot="attachment-input-item-root"][data-id="${CSS.escape(pending.ids[0] ?? "")}"] [data-slot="attachment-input-remove"]`)?.focus();
    }, [entries]);

    // ── 고르기 · 끌어 놓기
    const take = (list: FileList | null | undefined) => {
      const files = Array.from(list ?? []);
      if (files.length === 0 || blocked) return;
      const room = Math.max(0, maxFiles - entries.length);
      const { accepted, rejections } = validate(files, room, accept, maxFileSize);
      // 붙인 것을 먼저 알리고 거절을 뒤에 — 붙이며 오류 글을 지우는 쪽(스펙 예시)에서도 거절 글이 남는다
      if (accepted.length > 0) onFilesAccept(toEntries(accepted));
      if (rejections.length > 0) onFilesReject?.(rejections);
    };
    const toEntries = (accepted: File[]) => {
      const added = accepted.map<AttachmentEntry>((file) => {
        const id = newEntryId();
        const entry: AttachmentEntry = { id, name: file.name, size: file.size, type: file.type, file, status: "pending" };
        if (isImage(file.type, file.name) && typeof URL.createObjectURL === "function") {
          entry.previewUrl = URL.createObjectURL(file);
          createdUrls.current.set(id, entry.previewUrl);
        }
        return entry;
      });
      pendingFocus.current = { kind: "added", ids: added.map((e) => e.id) };
      return added;
    };
    const openPicker = () => {
      if (blocked) return;
      pickerRef.current?.click();
    };

    const [dragOver, setDragOver] = React.useState(false);
    const dragDepth = React.useRef(0);
    const dropBlocked = blocked;
    const dropzoneHandlers = {
      onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        dragDepth.current += 1;
        if (!dropBlocked) setDragOver(true);
      },
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = dropBlocked ? "none" : "copy";
      },
      onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
        if (!hasFiles(e)) return;
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragOver(false);
      },
      onDrop: (e: React.DragEvent<HTMLDivElement>) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        dragDepth.current = 0;
        setDragOver(false);
        if (!dropBlocked) take(e.dataTransfer.files);
      },
    };
    // 드롭존 밖에 놓은 파일을 브라우저가 열지 않게 막는다(드롭존이 있는 동안)
    React.useEffect(() => {
      if (layout !== "dropzone") return;
      const guard = (e: DragEvent) => {
        if (!hasFiles(e) || (e.target instanceof Node && rootRef.current?.contains(e.target))) return;
        e.preventDefault();
        if (e.type === "dragover" && e.dataTransfer) e.dataTransfer.dropEffect = "none";
      };
      window.addEventListener("dragover", guard);
      window.addEventListener("drop", guard);
      return () => {
        window.removeEventListener("dragover", guard);
        window.removeEventListener("drop", guard);
      };
    }, [layout]);

    // ── 순서 바꾸기
    const sortable = onReorder != null && !disabled && !readOnly && entries.length > 0;
    const sensors = useSensors(
      useSensor(NonTouchPointerSensor, { activationConstraint: { distance: 8 } }),
      useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
      // Space 로 들고 ← → 로 옮긴 뒤 Space · Enter 로 놓는다 · Esc 그만두기. Enter 로는 들지 않는다(항목 메뉴)
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter", "Tab"] },
      }),
    );
    const position = (id: unknown) => entries.findIndex((e) => e.id === id) + 1;
    // 든 직후 제자리 위에 놓인 것(over = 든 항목)은 읽지 않는다 — "들었어요" 를 바로 덮는다. 자리가 바뀔 때만 읽는다
    const lastOver = React.useRef<unknown>(null);
    const announcements: Announcements = {
      onDragStart: ({ active }) => {
        lastOver.current = active.id;
        return `${position(active.id)}번째 항목을 들었어요.`;
      },
      onDragOver: ({ over }) => {
        if (!over || over.id === lastOver.current) return undefined;
        lastOver.current = over.id;
        return `${position(over.id)}번째 자리예요.`;
      },
      onDragEnd: ({ over }) => (over ? `${position(over.id)}번째 자리에 놓았어요.` : "옮기기를 그만뒀어요. 처음 자리예요."),
      onDragCancel: () => "옮기기를 그만뒀어요. 처음 자리예요.",
    };
    const onDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id || !onReorder) return;
      const from = entries.findIndex((e) => e.id === active.id);
      const to = entries.findIndex((e) => e.id === over.id);
      if (from < 0 || to < 0) return;
      onReorder(arrayMove(entries, from, to));
    };

    const removeBlock: ItemProps["removeBlock"] = disabled ? "disabled" : readOnly ? "readOnly" : "none";
    const handleRemove = (id: string) => {
      pendingFocus.current = { kind: "removed", id, index: entries.findIndex((e) => e.id === id) };
      onRemove(id);
    };
    // 항목 메뉴 — onReorder · onPreview 가운데 하나라도 주면. 사진: 크게 보기 · 대표로 정하기(badgeLabel) · 앞으로 · 뒤로 | 지우기,
    // 파일 카드: 열기 · 앞으로 · 뒤로 | 지우기. 맨 앞이면 앞으로 · 대표로, 맨 끝이면 뒤로가 막힌다.
    // 읽기 전용이면 메뉴 없이 누르면 바로 onPreview, 막힘이면 누르지 않는다
    const menuOf = (entry: AttachmentEntry, index: number): ItemMenu | undefined => {
      if (disabled || readOnly || (!onReorder && !onPreview)) return undefined;
      const image = isImage(entry.type, entry.name);
      const actions: AttachmentItemMenuAction[] = [];
      const blocked: AttachmentItemMenuAction[] = [];
      if (onPreview) actions.push("preview");
      if (onReorder) {
        if (image && badgeLabel) actions.push("badge");
        actions.push("forward", "backward");
        if (index === 0) blocked.push("badge", "forward");
        if (index === entries.length - 1) blocked.push("backward");
      }
      actions.push("remove");
      return { actions, blocked, onAction: (action) => runMenuAction(entry.id, action) };
    };
    const moveTo = (id: string, to: number) => {
      const from = entries.findIndex((e) => e.id === id);
      if (!onReorder || from < 0 || to < 0 || to >= entries.length || from === to) return;
      pendingFocus.current = { kind: "moved", id };
      announce(`${to + 1}번째 자리로 옮겼어요.`);
      onReorder(arrayMove(entries, from, to));
    };
    const runMenuAction = (id: string, action: AttachmentItemMenuAction) => {
      const index = entries.findIndex((e) => e.id === id);
      if (action === "preview") onPreview?.(id);
      else if (action === "remove") handleRemove(id);
      else if (action === "forward") moveTo(id, index - 1);
      else if (action === "backward") moveTo(id, index + 1);
      else if (action === "badge") moveTo(id, 0);
    };
    const itemProps = (entry: AttachmentEntry, index: number): ItemProps => {
      const status = statusOf(entry);
      const label = entry.id === firstImageId ? badgeLabel : undefined;
      return {
        entry,
        status,
        description: describe(entry, status, label),
        badgeLabel: label,
        readOnly,
        removeBlock,
        retryDisabled: disabled,
        onRemove: handleRemove,
        onRetry,
        menu: menuOf(entry, index),
        onPress: readOnly && !disabled && onPreview ? () => onPreview(entry.id) : undefined,
      };
    };

    const items =
      entries.length === 0 ? null : (
        <ul data-slot="attachment-input-items" className={LIST}>
          {sortable
            ? entries.map((entry, i) => <SortableItem key={entry.id} {...itemProps(entry, i)} reducedMotion={reducedMotion} />)
            : entries.map((entry, i) => <Item key={entry.id} {...itemProps(entry, i)} />)}
        </ul>
      );
    const list = sortable ? (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[horizontalOnly]}
        onDragEnd={onDragEnd}
        accessibility={{
          announcements,
          screenReaderInstructions: { draggable: "Space 로 들고 ← → 로 옮긴 뒤 Space 로 놓아요. Esc 는 그만두기예요." },
        }}
      >
        <SortableContext items={entries.map((e) => e.id)} strategy={horizontalListSortingStrategy}>
          {items}
        </SortableContext>
      </DndContext>
    ) : (
      items
    );

    // 타일 이름 — "{칸 이름} 첨부, 3/10". 칸 이름은 triggerLabel → Field 라벨
    const countText = limited ? `${entries.length}/${maxFiles}` : "";
    const suffix = countText ? `첨부, ${countText}` : "첨부";
    const triggerNaming = triggerLabel
      ? { "aria-label": `${triggerLabel} ${suffix}` }
      : field
        ? { "aria-labelledby": `${field.labelId} ${triggerSuffixId}` }
        : { "aria-label": `파일 ${suffix}` };

    const trigger = (
      <button
        type="button"
        data-slot="attachment-input-trigger"
        aria-disabled={(!disabled && (readOnly || full)) || undefined}
        disabled={disabled}
        className={TRIGGER}
        onClick={openPicker}
        {...triggerNaming}
      >
        {acceptsImages ? <ImageIcon aria-hidden className={TRIGGER_ICON} /> : <Paperclip aria-hidden className={TRIGGER_ICON} />}
        {limited && (
          <span aria-hidden data-slot="attachment-input-count" className={COUNT}>
            <span className={COUNT_NOW}>{entries.length}</span>
            <span className={COUNT_MAX}>/{maxFiles}</span>
          </span>
        )}
        <span id={triggerSuffixId} hidden>
          {suffix}
        </span>
      </button>
    );

    return (
      <div
        ref={(el) => {
          rootRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        role="group"
        data-slot="attachment-input"
        data-layout={layout}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        className={cn(ROOT, className)}
        {...naming}
        {...props}
      >
        {layout === "dropzone" && (
          <>
            <div
              data-slot="attachment-input-dropzone"
              data-drag-over={(dragOver && !dropBlocked) || undefined}
              data-disabled={dropBlocked || undefined}
              className={DROPZONE}
              {...dropzoneHandlers}
            >
              <p data-slot="attachment-input-dropzone-label" className={DROPZONE_LABEL}>
                파일을 여기로 끌어다 놓으세요
              </p>
              <Button type="button" variant="neutralWeak" size="small" data-slot="attachment-input-pick" disabled={blocked} onClick={openPicker}>
                파일 선택
              </Button>
            </div>
            <Button
              type="button"
              variant="neutralWeak"
              size="large"
              data-slot="attachment-input-pick"
              disabled={blocked}
              className={PICK_NARROW}
              onClick={openPicker}
            >
              <Upload aria-hidden />
              파일 선택
            </Button>
          </>
        )}
        {layout === "tile" ? (
          <ScrollFog use="row" data-slot="attachment-input-row" className={ROW_TILE}>
            <div className={ROW_CONTENT}>
              {trigger}
              {list}
            </div>
          </ScrollFog>
        ) : (
          entries.length > 0 && (
            <div data-slot="attachment-input-row" className={ROW_DROPZONE}>
              {list}
            </div>
          )
        )}
        <input
          ref={pickerRef}
          type="file"
          hidden
          tabIndex={-1}
          accept={accept}
          multiple={maxFiles > 1}
          disabled={disabled}
          data-slot="attachment-input-picker"
          onChange={(e) => {
            take(e.currentTarget.files);
            e.currentTarget.value = "";
          }}
        />
        {name != null && <input ref={submitRef} type="file" hidden tabIndex={-1} name={name} multiple disabled={disabled} data-slot="attachment-input-value" />}
        <span id={failureId} hidden>
          {failures > 0 ? `${failures}개는 올리지 못했어요.` : ""}
        </span>
        <span aria-live="polite" className="sr-only" data-slot="attachment-input-status">
          {message}
        </span>
      </div>
    );
  },
);
AttachmentInput.displayName = "AttachmentInput";

export { AttachmentInput };
